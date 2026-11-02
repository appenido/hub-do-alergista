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

export async function onRequestGet() {
  const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(TERMOS + ' when:14d') + '&hl=pt-BR&gl=BR&ceid=BR:pt-419';
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 HubDoAlergista' } });
    const xml = await r.text();
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
