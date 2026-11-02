// Cloudflare Pages Function — notícias da mídia brasileira sobre alergia/imunologia
// Rota: GET /news   → { itens: [{titulo, fonte, data, url}] }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=1800'
};

const TERMOS = '("alergia alimentar" OR anafilaxia OR urticária OR "dermatite atópica" OR "choque anafilático" OR "crise de asma" OR "alergia a medicamento" OR imunodeficiência)';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

const FONTES = [
  'https://news.google.com/rss/search?q=' + encodeURIComponent(TERMOS + ' when:21d') + '&hl=pt-BR&gl=BR&ceid=BR:pt-419',
  'https://www.bing.com/news/search?q=' + encodeURIComponent(TERMOS) + '&format=RSS&cc=br&setlang=pt-br'
];

export async function onRequestGet() {
  let xml = '';
  let erro = '';
  for (const f of FONTES) {
    try {
      const r = await fetch(f, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HubDoAlergista/1.0)', 'Accept': 'application/rss+xml,text/xml,*/*' } });
      const t = await r.text();
      if (r.ok && t.includes('<item')) { xml = t; break; }
      erro = 'HTTP ' + r.status;
    } catch (e) { erro = (e && e.message) || 'falha'; }
  }
  if (!xml) {
    return new Response(JSON.stringify({ itens: [], erro: 'Fonte indisponível (' + erro + ')' }), { status: 200, headers: CORS });
  }
  try {
    const itens = [];
    const blocos = xml.split('<item>').slice(1, 13);
    for (const b of blocos) {
      const pega = (tag) => {
        const m = b.match(new RegExp('<' + tag + '>([\\s\\S]*?)</' + tag + '>'));
        if (!m) return '';
        return m[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim();
      };
      const titulo = pega('title');
      if (!titulo) continue;
      let fonte = '';
      const ms = b.match(/<source[^>]*>([\s\S]*?)<\/source>/);
      if (ms) fonte = ms[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim();
      if (!fonte && titulo.includes(' - ')) fonte = titulo.split(' - ').pop().trim();
      let limpo = titulo;
      if (fonte && limpo.endsWith(' - ' + fonte)) limpo = limpo.slice(0, -(fonte.length + 3));
      itens.push({
        titulo: limpo,
        fonte,
        data: pega('pubDate'),
        url: pega('link')
      });
    }
    itens.sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));
    return new Response(JSON.stringify({ itens }), { headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ itens: [], erro: 'Falha ao buscar notícias.' }), { status: 502, headers: CORS });
  }
}
