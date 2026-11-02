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
  const chave = env.GEMINI_API_KEY;
  if (!chave) {
    return new Response(JSON.stringify({ erro: 'IA ainda não configurada neste site.' }), { status: 503, headers: CORS });
  }
  let pergunta = '';
  try { pergunta = ((await request.json()).pergunta || '').toString().trim(); } catch (e) {}
  if (!pergunta) {
    return new Response(JSON.stringify({ erro: 'Escreva uma pergunta.' }), { status: 400, headers: CORS });
  }
  if (pergunta.length > 4000) pergunta = pergunta.slice(0, 4000);

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + encodeURIComponent(chave);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SISTEMA }] },
        contents: [{ role: 'user', parts: [{ text: pergunta }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1200 }
      })
    });
    const d = await r.json();
    if (!r.ok) {
      const msg = (d && d.error && d.error.message) || 'Falha na IA.';
      return new Response(JSON.stringify({ erro: msg }), { status: 502, headers: CORS });
    }
    const texto = (((d.candidates || [])[0] || {}).content || {}).parts?.map(p => p.text || '').join('') || '';
    return new Response(JSON.stringify({ resposta: texto.trim() || 'Sem resposta.' }), { headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ erro: 'Não foi possível falar com a IA agora.' }), { status: 502, headers: CORS });
  }
}
