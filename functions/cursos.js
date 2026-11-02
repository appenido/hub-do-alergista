// Cloudflare Pages Function — cursos/eventos de Alergia e Imunologia em qualquer idioma
// Rota: GET /cursos → { itens: [{titulo, fonte, data, url, idioma}] }  (ordem decrescente de data)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=21600'
};

const BUSCAS = [
  { idioma: 'pt', q: 'curso alergia imunologia',            hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' },
  { idioma: 'pt', q: 'webinar OR congresso alergia asma',   hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' },
  { idioma: 'en', q: 'allergy immunology course OR webinar', hl: 'en-US', gl: 'US', ceid: 'US:en' },
  { idioma: 'en', q: 'allergy congress OR symposium OR masterclass', hl: 'en-US', gl: 'US', ceid: 'US:en' },
  { idioma: 'es', q: 'curso alergología inmunología',        hl: 'es-419', gl: 'MX', ceid: 'MX:es-419' },
  { idioma: 'fr', q: 'formation allergologie immunologie',   hl: 'fr', gl: 'FR', ceid: 'FR:fr' },
  { idioma: 'de', q: 'Fortbildung Allergologie Immunologie', hl: 'de', gl: 'DE', ceid: 'DE:de' }
];

const CURSO = /(curso|cursos|aula|webinar|webin[áa]rio|congresso|simp[óo]sio|workshop|masterclass|capacita|jornada|course|courses|congress|symposium|training|fellowship|educational|curso|congreso|formaci[óo]n|formation|congr[èe]s|fortbildung|kongress|schulung)/i;
const AREA  = /(alerg|allerg|imunolog|immunolog|asma|asthma|urtic|anafila|anaphyl|atopic|at[óo]pic|eczema|ekzem|hives|immunodefici)/i;

function limpar(t) {
  return (t || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

function extrair(xml, idioma) {
  const out = [];
  for (const b of xml.split(/<item[\s>]/).slice(1, 40)) {
    const pega = (tag) => {
      const m = b.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>'));
      return m ? limpar(m[1]) : '';
    };
    const titulo = pega('title');
    const url = pega('link');
    if (!titulo || !url) continue;
    if (!(CURSO.test(titulo) && AREA.test(titulo))) continue;
    const ts = Date.parse(pega('pubDate'));
    if (!ts) continue;
    out.push({ titulo, fonte: pega('source') || 'Web', data: new Date(ts).toISOString(), url, idioma, _ts: ts });
  }
  return out;
}

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
  const limite = Date.now() - 120 * 86400000;
  const resultados = await Promise.all(BUSCAS.map(async (b) => {
    try {
      const u = 'https://news.google.com/rss/search?q=' + encodeURIComponent(b.q) + '&hl=' + b.hl + '&gl=' + b.gl + '&ceid=' + b.ceid;
      const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HubAlergista/1.0)' } });
      if (!r.ok) return [];
      return extrair(await r.text(), b.idioma);
    } catch (e) { return []; }
  }));
  const vistos = new Set();
  const itens = resultados.flat()
    .filter((i) => i._ts >= limite)
    .filter((i) => { const k = i.titulo.toLowerCase(); if (vistos.has(k)) return false; vistos.add(k); return true; })
    .sort((a, b) => b._ts - a._ts)
    .slice(0, 30)
    .map(({ _ts, ...rest }) => rest);
  const corpo = itens.length ? { itens } : { itens: [], erro: 'Nenhum curso novo encontrado agora.' };
  return new Response(JSON.stringify(corpo), { headers: CORS });
}
