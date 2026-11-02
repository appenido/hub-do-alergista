// Radar de notícias — roda no GitHub Actions todo dia às 8h (America/Sao_Paulo)
// Coleta RSS, abre cada matéria, confirma a data original e grava jornal/radar.json
import fs from 'node:fs';

const SAIDA = 'jornal/radar.json';
const Q = (s) => 'https://news.google.com/rss/search?q=' + encodeURIComponent(s) + '&hl=pt-BR&gl=BR&ceid=BR:pt-419';
const FONTES = [
  Q('alergia OR "reação alérgica"'),
  Q('anafilaxia OR "choque anafilático"'),
  Q('asma OR "rinite alérgica"'),
  Q('"dermatite atópica" OR urticária OR angioedema'),
  Q('"alergia alimentar" OR "alergia a medicamento"'),
  Q('"esofagite eosinofílica" OR "pólipos nasais" OR rinossinusite'),
  Q('imunodeficiência OR "erros inatos da imunidade" OR imunoglobulina'),
  Q('imunobiológico OR imunoterapia alergia'),
  'https://g1.globo.com/rss/g1/ciencia-e-saude/',
  'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml'
];

const CHAVES = /(^|[^a-zà-ú])(alergi\w*|al[ée]rgic\w*|anafila\w*|anafil[áa]tic\w*|urtic[áa]ri\w*|asma|asm[áa]tic\w*|rinite|rinossinusite|dermatite at[óo]pica|imunodefici\w*|imunoglobulina|erros inatos da imunidade|imunoterapia|imunobiol[óo]gic\w*|angioedema|eosinof[íi]lic\w*|p[óo]lipos nasais)([^a-zà-ú]|$)/i;
// institucional, científico, publicidade
const BLOQUEADOS = /(gov\.br|\.gov\b|asbai\.org|sbp\.com\.br|sbi\.org|scielo|doaj|elsevier|pubmed|nih\.gov|prnewswire|segs\.com\.br|\.edu\b|einstein\.br|hospital|clinica|cl[íi]nica|blogspot|wordpress\.com)/i;

const limpar = (t) => (t||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
const UA = { 'User-Agent':'Mozilla/5.0 (compatible; HubDoAlergista-Radar/1.0)' };

function itensDoRss(xml, fonteFallback){
  const out = [];
  for (const b of xml.split(/<item[\s>]/).slice(1, 60)) {
    const pega = (tag) => { const m = b.match(new RegExp('<'+tag+'[^>]*>([\\s\\S]*?)<\\/'+tag+'>')); return m ? limpar(m[1]) : ''; };
    let titulo = pega('title'); if (!titulo) continue;
    const desc = pega('description');
    if (!CHAVES.test(titulo + ' ' + desc)) continue;
    const fonte = pega('source') || fonteFallback || '';
    titulo = titulo.replace(/\s+-\s+[^-]+$/, '').trim();
    out.push({ titulo, fonte, data: pega('pubDate'), url: pega('link') });
  }
  return out;
}

async function resolver(url){
  // Google News usa link intermediário: segue o redirecionamento até o veículo
  try {
    const r = await fetch(url, { headers: UA, redirect: 'follow' });
    const html = await r.text();
    let final = r.url;
    const m = html.match(/data-n-au="([^"]+)"/) || html.match(/<c-wiz[\s\S]*?href="(https?:\/\/[^"]+)"/);
    if (/news\.google\.com/.test(final) && m) final = m[1];
    return { final, html };
  } catch(e) { return { final: url, html: '' }; }
}

function dataDaPagina(html){
  const pats = [
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)/i,
    /<meta[^>]+name=["'](?:date|pubdate|publish-date|article:published_time)["'][^>]+content=["']([^"']+)/i,
    /"datePublished"\s*:\s*"([^"]+)"/i
  ];
  for (const p of pats){ const m = html.match(p); if (m) { const t = Date.parse(m[1]); if (t) return t; } }
  return 0;
}

const run = async () => {
  const brutos = [];
  await Promise.all(FONTES.map(async (u) => {
    try {
      const r = await fetch(u, { headers: UA });
      if (!r.ok) return;
      brutos.push(...itensDoRss(await r.text(), ''));
    } catch(e) {}
  }));

  brutos.sort((a,b) => (Date.parse(b.data)||0) - (Date.parse(a.data)||0));

  const vistos = new Set(), verificadas = [];
  for (const it of brutos) {
    if (verificadas.length >= 10) break;
    const chave = it.titulo.toLowerCase().replace(/\W+/g,'').slice(0,50);
    if (vistos.has(chave)) continue;
    const { final, html } = await resolver(it.url);
    if (!final || BLOQUEADOS.test(final)) continue;
    const ts = dataDaPagina(html) || Date.parse(it.data) || 0;
    if (!ts) continue;                                   // sem data confirmada: fora
    if (Date.now() - ts > 90*24*3600*1000) continue;      // janela máxima de 90 dias
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
    vistos.add(chave);
    verificadas.push({
      titulo: limpar(h1) || it.titulo,
      fonte: it.fonte || new URL(final).hostname.replace(/^www\./,''),
      data: new Date(ts).toISOString(),
      url: final,
      verificado: !!dataDaPagina(html)
    });
  }

  if (!verificadas.length) { console.log('nenhuma matéria verificada — mantendo arquivo anterior'); return; }
  verificadas.sort((a,b) => Date.parse(b.data) - Date.parse(a.data));
  const saida = {
    atualizadoEm: new Date().toISOString(),
    janela: '90 dias',
    total: verificadas.length,
    itens: verificadas.slice(0,10)
  };
  fs.mkdirSync('jornal', { recursive: true });
  fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 1));
  console.log('gravadas ' + verificadas.length + ' matérias');
};

run().catch((e) => { console.error('falha:', e.message); process.exit(0); }); // nunca sobrescreve em erro
