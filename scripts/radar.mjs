// Radar de notícias — roda todo dia às 8h (America/Sao_Paulo) pelo GitHub Actions.
// Coleta RSS, confirma a data original de cada matéria e grava jornal/radar.json.
// Em qualquer falha, não sobrescreve o arquivo anterior.
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
  Q('imunobiológico alergia OR "imunoterapia alérgica"'),
  'https://g1.globo.com/rss/g1/ciencia-e-saude/',
  'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml',
  'https://agenciabrasil.ebc.com.br/rss/geral/feed.xml',
  'https://www.metropoles.com/saude/feed',
  'https://saude.abril.com.br/feed/'
];

const CHAVES = /(^|[^a-zà-ú])(alergi\w*|al[ée]rgic\w*|anafila\w*|anafil[áa]tic\w*|urtic[áa]ri\w*|asma|asm[áa]tic\w*|rinite|rinossinusite|dermatite at[óo]pica|imunodefici\w*|imunoglobulina|erros inatos da imunidade|imunoterapia (?:alerg|sublingual|subcut)\w*|imunobiol[óo]gic\w*|angioedema|esofagite eosinof[íi]lica|p[óo]lipos nasais)([^a-zà-ú]|$)/i;
const BLOQUEADOS = /(gov\.br|\.gov\b|asbai\.org|sbp\.com\.br|sbi\.org|scielo|doaj|elsevier|pubmed|nih\.gov|prnewswire|segs\.com\.br|\.edu\b|blogspot|wordpress\.com)/i;
const ESTRANGEIROS = /(vietnam|investing\.com|publico\.pt|observador\.pt|sapo\.pt|\.vn\b|\.pt\b|\.es\b|\.ao\b|\.mz\b)/i;
const BR_OK = ['globo.com','uol.com.br','metropoles.com','terra.com.br','r7.com','ig.com.br','band.com.br','cnnbrasil.com.br','estadao.com.br','abril.com.br','ebc.com.br'];

const limpar = (t) => (t||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; HubDoAlergista-Radar/1.0)' };
const brasileiro = (h) => /\.br$/.test(h) || BR_OK.some((d) => h === d || h.endsWith('.' + d));

function itensDoRss(xml){
  const out = [];
  for (const b of xml.split(/<item[\s>]/).slice(1, 60)) {
    const pega = (tag) => { const m = b.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>')); return m ? limpar(m[1]) : ''; };
    let titulo = pega('title'); if (!titulo) continue;
    const descRaw = (b.match(/<description[^>]*>([\s\S]*?)<\/description>/) || [])[1] || '';
    if (!CHAVES.test(titulo + ' ' + limpar(descRaw))) continue;
    const href = (descRaw.match(/href="(https?:\/\/[^"]+)"/) || [])[1] || '';
    out.push({
      titulo: titulo.replace(/\s+-\s+[^-]+$/, '').trim(),
      fonte: pega('source'),
      data: pega('pubDate'),
      url: href || pega('link')
    });
  }
  return out;
}

async function resolverGoogle(url){
  const m = String(url).match(/\/(?:rss\/)?articles\/([A-Za-z0-9_-]+)/);
  if (!m) return '';
  try {
    const p = await fetch('https://news.google.com/rss/articles/' + m[1], { headers: UA });
    const h = await p.text();
    const sig = (h.match(/data-n-a-sg="([^"]+)"/) || [])[1];
    const ts  = (h.match(/data-n-a-ts="([^"]+)"/) || [])[1];
    if (!sig || !ts) return '';
    const req = ['Fbv4je', JSON.stringify(['garturlreq', [['pt-BR','BR',['FINANCE_TOP_INDICES','WEB_TEST_1_0_0'],null,null,1,1,'BR:pt-419',null,null,null,null,null,null,null,0],'pt-BR','BR',true,[2],1,true,'1',null,null,null,0], m[1], Number(ts), sig])];
    const r = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
      method: 'POST',
      headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: 'f.req=' + encodeURIComponent(JSON.stringify([[req]]))
    });
    const t = await r.text();
    const alvo = t.match(/"(https?:\/\/(?!news\.google)[^"\\]+)"/);
    return alvo ? alvo[1] : '';
  } catch(e) { return ''; }
}

async function abrir(url){
  try {
    const r = await fetch(url, { headers: UA, redirect: 'follow' });
    return { final: r.url || url, html: await r.text() };
  } catch(e) { return { final: '', html: '' }; }
}

function dataDaPagina(html){
  const pats = [
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)/i,
    /<meta[^>]+name=["'](?:date|pubdate|publish-date)["'][^>]+content=["']([^"']+)/i,
    /"datePublished"\s*:\s*"([^"]+)"/i
  ];
  for (const p of pats) { const m = html.match(p); if (m) { const t = Date.parse(m[1]); if (t) return t; } }
  return 0;
}

const run = async () => {
  const brutos = [];
  await Promise.all(FONTES.map(async (u) => {
    try {
      const r = await fetch(u, { headers: UA });
      if (!r.ok) { console.log('FONTE ' + u + ' HTTP ' + r.status); return; }
      const achados = itensDoRss(await r.text());
      console.log('FONTE ' + u + ' -> ' + achados.length);
      brutos.push(...achados);
    } catch(e) { console.log('FONTE ' + u + ' erro ' + e.message); }
  }));

  brutos.sort((a, b) => (Date.parse(b.data)||0) - (Date.parse(a.data)||0));

  const vistos = new Set(), lista = [];
  for (const it of brutos) {
    if (lista.length >= 10) break;
    const chave = it.titulo.toLowerCase().replace(/\W+/g,'').slice(0,50);
    if (vistos.has(chave)) continue;
    if (it.fonte && ESTRANGEIROS.test(it.fonte)) continue;

    let alvo = it.url, verificado = true;
    if (/news\.google\.com/.test(alvo)) {
      const direto = await resolverGoogle(alvo);
      if (direto) alvo = direto; else verificado = false;   // sem link direto: mantém o do Google, que redireciona
    }
    if (BLOQUEADOS.test(alvo) || ESTRANGEIROS.test(alvo)) continue;

    let host = '';
    try { host = new URL(alvo).hostname.replace(/^www\./,''); } catch(e) { continue; }
    if (/news\.google\.com/.test(host)) {
      if (!it.fonte) continue;                              // sem veículo identificável
    } else if (!brasileiro(host)) continue;                 // só mídia brasileira

    let ts = Date.parse(it.data) || 0;
    if (verificado) {
      const { final, html } = await abrir(alvo);
      if (final && html) { alvo = final; ts = dataDaPagina(html) || ts; }
      else verificado = false;
    }
    if (!ts || Date.now() - ts > 90*24*3600*1000) continue;

    vistos.add(chave);
    lista.push({ titulo: it.titulo, fonte: it.fonte || host, data: new Date(ts).toISOString(), url: alvo, verificado });
  }

  if (!lista.length) { console.log('nenhuma matéria verificada — mantendo arquivo anterior'); return; }
  lista.sort((a, b) => Date.parse(b.data) - Date.parse(a.data));
  fs.mkdirSync('jornal', { recursive: true });
  fs.writeFileSync(SAIDA, JSON.stringify({
    atualizadoEm: new Date().toISOString(),
    janela: '90 dias',
    total: lista.length,
    itens: lista.slice(0, 10)
  }, null, 1));
  console.log('gravadas ' + lista.length + ' matérias');
};

run().catch((e) => { console.error('falha:', e.message); process.exit(0); });
