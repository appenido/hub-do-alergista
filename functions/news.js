// Cloudflare Pages Function — notícias da mídia brasileira sobre alergia/imunologia
// Rota: GET /news  → { itens: [{titulo, fonte, data, url}] }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=1800'
};

const FONTES = [
  { nome: 'G1',             url: 'https://g1.globo.com/rss/g1/ciencia-e-saude/' },
  { nome: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml' },
  { nome: 'Agência Brasil', url: 'https://agenciabrasil.ebc.com.br/rss/geral/feed.xml' },
  { nome: 'Fiocruz',        url: 'https://portal.fiocruz.br/rss.xml' },
  { nome: 'Google Notícias',url: 'https://news.google.com/rss/search?q=alergia&hl=pt-BR&gl=BR&ceid=BR:pt-419' },
  { nome: 'Google Notícias',url: 'https://news.google.com/rss/search?q=asma+OR+%22rinite+al%C3%A9rgica%22&hl=pt-BR&gl=BR&ceid=BR:pt-419' },
  { nome: 'Google Notícias',url: 'https://news.google.com/rss/search?q=anafilaxia+OR+urtic%C3%A1ria+OR+angioedema&hl=pt-BR&gl=BR&ceid=BR:pt-419' },
  { nome: 'Google Notícias',url: 'https://news.google.com/rss/search?q=%22dermatite+at%C3%B3pica%22+OR+imunoterapia+OR+imunobiol%C3%B3gico&hl=pt-BR&gl=BR&ceid=BR:pt-419' },
  { nome: 'Google Notícias',url: 'https://news.google.com/rss/search?q=%22alergia+alimentar%22+OR+%22imunodefici%C3%AAncia%22&hl=pt-BR&gl=BR&ceid=BR:pt-419' }
];

// palavras inteiras (evita casar "asma" dentro de "plasma")
const CHAVES = /(^|[^a-zà-ú])(alergi\w*|al[ée]rgic\w*|anafila\w*|anafil[áa]tic\w*|urtic[áa]ri\w*|asma|asm[áa]tic\w*|rinite|dermatite|imunodefici\w*|imunoterapia (?:alerg|sublingual|subcut|com al[ée]rgeno)\w*|imunobiol[óo]gic\w*|angioedema|bronco?espasmo)([^a-zà-ú]|$)/i;
// exclui conteúdo de oncologia (câncer), que não é escopo de alergia/imunologia clínica
const ONCOLOGIA = /(c[âa]ncer|oncol[óo]gic\w*|quimioterapia|radioterapia|tumor(?!al da al)|neoplasia|carcinoma|melanoma|metast[áa]tic\w*)/i;

function limpar(t) {
  return (t || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
}

function extrair(xml, nomeFonte) {
  const out = [];
  const blocos = xml.split(/<item[\s>]/).slice(1, 40);
  for (const b of blocos) {
    const pega = (tag) => {
      const m = b.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>'));
      return m ? limpar(m[1]) : '';
    };
    const titulo = pega('title');
    if (!titulo) continue;
    const desc = pega('description');
    const alvo = titulo + ' ' + desc;
    if (!CHAVES.test(alvo)) continue;
    if (ONCOLOGIA.test(alvo)) continue;
    const data = pega('pubDate');
    const ts = Date.parse(data);
    // só notícias dos últimos 120 dias
    if (ts && Date.now() - ts > 120 * 24 * 3600 * 1000) continue;
    out.push({ titulo, fonte: nomeFonte, data, url: pega('link') });
  }
  return out;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet() {
  const itens = [];
  const falhas = [];
  await Promise.all(FONTES.map(async (f) => {
    try {
      const r = await fetch(f.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HubDoAlergista/1.0)', 'Accept': 'application/rss+xml,text/xml,*/*' }
      });
      const t = await r.text();
      if (!r.ok) { falhas.push(f.nome + ' HTTP ' + r.status); return; }
      itens.push(...extrair(t, f.nome));
    } catch (e) {
      falhas.push(f.nome + ' ' + ((e && e.message) || 'falha'));
    }
  }));

  const vistos = new Set();
  const unicos = itens.filter((i) => {
    const k = i.titulo.toLowerCase().slice(0, 60);
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
  unicos.sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));

  const corpo = { itens: unicos.slice(0, 20), fontes: FONTES.length, falhas };
  if (!unicos.length) corpo.erro = 'Nenhuma notícia encontrada' + (falhas.length ? ' (' + falhas.join('; ') + ')' : '');
  return new Response(JSON.stringify(corpo), { headers: CORS });
}
