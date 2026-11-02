// Cloudflare Pages Function — IA do Hub (Gemini)
// Rota: POST /ia  { pergunta: "..." }
// A chave fica na variável de ambiente GEMINI_API_KEY (painel do Cloudflare).

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
};

const SISTEMA = [
  'Você é um assistente clínico para médicos alergistas e imunologistas no Brasil.',
  'Responda em português do Brasil, de forma objetiva e estruturada.',
  'Baseie-se em diretrizes atuais (ASBAI, GINA, ARIA, EAACI/GA2LEN, AAAAI) e cite a diretriz quando relevante.',
  'Inclua doses e condutas quando pertinente, e sinalize quando a evidência for limitada.',
  'Não substitui avaliação médica; lembre disso ao final apenas quando a pergunta for sobre caso clínico.'
].join(' ');

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const chave = env.GEMINI_API_KEY || env.GEMINI || env.GOOGLE_API_KEY;
  if (!chave) {
    return new Response(JSON.stringify({ erro: 'IA ainda não configurada neste site.' }), { status: 503, headers: CORS });
  }
  let pergunta = '';
  try { pergunta = ((await request.json()).pergunta || '').toString().trim(); } catch (e) {}
  if (!pergunta) {
    return new Response(JSON.stringify({ erro: 'Escreva uma pergunta.' }), { status: 400, headers: CORS });
  }
  if (pergunta.length > 4000) pergunta = pergunta.slice(0, 4000);

  const MODELOS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-lite-latest'];
  const corpo = JSON.stringify({
    system_instruction: { parts: [{ text: SISTEMA }] },
    contents: [{ role: 'user', parts: [{ text: pergunta }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 1200 }
  });

  let ultimoErro = 'Falha na IA.';
  for (const modelo of MODELOS) {
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      try {
        const r = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent?key=' + encodeURIComponent(chave),
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpo }
        );
        const d = await r.json();
        if (r.ok) {
          const partes = (((d.candidates || [])[0] || {}).content || {}).parts || [];
          const texto = partes.map((p) => p.text || '').join('').trim();
          if (texto) return new Response(JSON.stringify({ resposta: texto }), { headers: CORS });
          ultimoErro = 'Resposta vazia.';
        } else {
          ultimoErro = (d && d.error && d.error.message) || ('HTTP ' + r.status);
          // sobrecarga/limite → espera e tenta de novo; outros erros → próximo modelo
          if (r.status === 429 || r.status === 503) { await new Promise((ok) => setTimeout(ok, 1200)); continue; }
          break;
        }
      } catch (e) {
        ultimoErro = (e && e.message) || 'falha de rede';
      }
    }
  }
  return new Response(JSON.stringify({ erro: ultimoErro }), { status: 502, headers: CORS });
}
