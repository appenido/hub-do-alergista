// Radar de notícias — roda todo dia às 8h (America/Sao_Paulo) pelo GitHub Actions.
// Fluxo: 1) feed RSS por tema  2) resolve a URL real do veículo  3) abre a página e
// confirma data de publicação  4) só então marca verificado:true.
// Item que não passa por todo o fluxo vai para "pendentes", nunca para a lista principal.
// Falha total preserva os resultados verificados anteriores (atualizadoEm não muda).
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

// institucional / científico / não-jornalístico — excluído, não vira pendência
const INSTITUCIONAIS = /(\.gov\.br$|\.gov$|^gov\.br$|asbai\.org|sbp\.com\.br|\bsbi\.org|scielo|doaj\.org|elsevier|pubmed|ncbi\.nlm\.nih\.gov|prnewswire|segs\.com\.br|\.edu\.br$|blogspot\.com$|wordpress\.com$|agenciaminas\.mg\.gov\.br)/i;
const ESTRANGEIROS = /(vietnam\.vn|investing\.com|publico\.pt|observador\.pt|sapo\.pt|\.vn$|\.pt$|\.es$|\.ao$|\.mz$)/i;
const VETERINARIO = /(cão|cães|gato\b|gatos\b|veterinári|pet\b|tutor de animais|caesegatos\.com\.br|petlove|portalpet)/i;
const ONCOLOGIA = /(c[âa]ncer|oncol[óo]gic\w*|quimioterapia|radioterapia|tumor(?!al da al)|neoplasia|carcinoma|melanoma|metast[áa]tic\w*)/i;
const BR_OK = ['globo.com','uol.com.br','metropoles.com','terra.com.br','r7.com','ig.com.br','band.com.br','cnnbrasil.com.br','estadao.com.br','abril.com.br','ebc.com.br','billboard.com.br','gauchazh.clicrbs.com.br','clicrbs.com.br'];

const limpar = (t) => (t||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'Accept-Language': 'pt-BR,pt;q=0.9' };
const brasileiro = (h) => /\.br$/.test(h) || BR_OK.some((d) => h === d || h.endsWith('.' + d));
const institucional = (h) => INSTITUCIONAIS.test(h);

function itensDoRss(xml){
  const out = [];
  for (const b of xml.split(/<item[\s>]/).slice(1, 60)) {
    const pega = (tag) => { const m = b.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>')); return m ? limpar(m[1]) : ''; };
    let titulo = pega('title'); if (!titulo) continue;
    const descRaw = (b.match(/<description[^>]*>([\s\S]*?)<\/description>/) || [])[1] || '';
    if (!CHAVES.test(titulo + ' ' + limpar(descRaw))) continue;
    if (ONCOLOGIA.test(titulo + ' ' + limpar(descRaw))) continue;   // oncologia não é escopo de alergia/imunologia clínica
    out.push({
      titulo: titulo.replace(/\s+-\s+[^-]+$/, '').trim(),
      fonte: pega('source'),
      dataFeed: pega('pubDate'),
      linkGoogle: pega('link')        // link intermediário do Google Notícias (completo, não truncado)
    });
  }
  return out;
}

// Resolve o endereço real do veículo a partir do link do Google Notícias (endpoint oficial do próprio Google).
async function resolverUrlReal(linkGoogle){
  const m = String(linkGoogle).match(/\/(?:rss\/)?articles\/([A-Za-z0-9_-]+)/);
  if (!m) return { ok: false, motivo: 'link do Google Notícias em formato inesperado' };
  try {
    const p = await fetch('https://news.google.com/rss/articles/' + m[1] + '?hl=pt-BR&gl=BR&ceid=BR:pt-419', { headers: UA });
    const h = await p.text();
    const sig = (h.match(/data-n-a-sg="([^"]+)"/) || [])[1];
    const ts  = (h.match(/data-n-a-ts="([^"]+)"/) || [])[1];
    if (!sig || !ts) return { ok: false, motivo: 'Google Notícias não forneceu assinatura de resolução para este link' };
    const req = ['Fbv4je', JSON.stringify(['garturlreq', [['pt-BR','BR',['FINANCE_TOP_INDICES','WEB_TEST_1_0_0'],null,null,1,1,'BR:pt-419',null,null,null,null,null,null,null,0],'pt-BR','BR',true,[2],1,true,'1',null,null,null,0], m[1], Number(ts), sig])];
    const r = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
      method: 'POST',
      headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: 'f.req=' + encodeURIComponent(JSON.stringify([[req]]))
    });
    const t = await r.text();
    // a resposta do batchexecute vem em blocos (número de bytes + linha JSON); procura o bloco "Fbv4je"
    for (const linha of t.split('\n')) {
      if (!linha.startsWith('[')) continue;
      try {
        const arr = JSON.parse(linha);
        for (const row of arr) {
          if (Array.isArray(row) && row[1] === 'Fbv4je' && typeof row[2] === 'string') {
            const inner = JSON.parse(row[2]);
            if (typeof inner[1] === 'string' && /^https?:\/\//.test(inner[1])) return { ok: true, url: inner[1] };
          }
        }
      } catch(e) { /* bloco não é o esperado, segue */ }
    }
    return { ok: false, motivo: 'resposta de resolução do Google Notícias sem URL do veículo' };
  } catch(e) { return { ok: false, motivo: 'erro ao contatar o Google Notícias: ' + e.message }; }
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

async function abrirPagina(url){
  try {
    const r = await fetch(url, { headers: UA, redirect: 'follow' });
    if (!r.ok) return { ok: false, motivo: 'página retornou HTTP ' + r.status };
    const html = await r.text();
    return { ok: true, finalUrl: r.url || url, html };
  } catch(e) { return { ok: false, motivo: 'página inacessível (' + e.message + ')' }; }
}

async function verificarCandidato(c){
  // 1) resolve a URL real do veículo a partir do link do Google Notícias
  const res = await resolverUrlReal(c.linkGoogle);
  if (!res.ok) return { status: 'pendente', titulo: c.titulo, fonte: c.fonte, linkGoogle: c.linkGoogle, motivo: res.motivo };

  let host = '';
  try { host = new URL(res.url).hostname.replace(/^www\./, ''); } catch(e) {
    return { status: 'pendente', titulo: c.titulo, fonte: c.fonte, linkGoogle: c.linkGoogle, motivo: 'URL do veículo inválida' };
  }
  if (ESTRANGEIROS.test(host)) return { status: 'excluido', motivo: 'veículo estrangeiro', titulo: c.titulo, fonte: c.fonte, url: res.url };
  if (VETERINARIO.test(host) || VETERINARIO.test(c.titulo)) return { status: 'excluido', motivo: 'conteúdo de saúde animal/veterinária, fora do escopo humano', titulo: c.titulo, fonte: c.fonte, url: res.url };
  if (institucional(host))     return { status: 'excluido', motivo: 'fonte institucional/científica, não jornalística', titulo: c.titulo, fonte: c.fonte, url: res.url };
  if (!brasileiro(host))       return { status: 'excluido', motivo: 'domínio fora da lista de mídia brasileira', titulo: c.titulo, fonte: c.fonte, url: res.url };

  // 2) abre a página do veículo e confirma data de publicação
  const pg = await abrirPagina(res.url);
  if (!pg.ok) return { status: 'pendente', titulo: c.titulo, fonte: c.fonte, url: res.url, motivo: pg.motivo };

  const ts = dataDaPagina(pg.html);
  if (!ts) return { status: 'pendente', titulo: c.titulo, fonte: c.fonte, url: pg.finalUrl, motivo: 'data de publicação não encontrada na página (meta tags ausentes)' };
  if (Date.now() - ts > 90*24*3600*1000) return { status: 'excluido', motivo: 'publicação fora da janela de 90 dias', titulo: c.titulo, fonte: c.fonte, url: pg.finalUrl };

  const h1 = (pg.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  return {
    status: 'verificado',
    titulo: limpar(h1) || c.titulo,
    fonte: c.fonte || host,
    data: new Date(ts).toISOString(),
    url: pg.finalUrl,
    verificado: true
  };
}

function carregarAnterior(){
  try { return JSON.parse(fs.readFileSync(SAIDA, 'utf8')); } catch(e) { return null; }
}

function salvar(obj){
  fs.mkdirSync('jornal', { recursive: true });
  fs.writeFileSync(SAIDA, JSON.stringify(obj, null, 1));
}

const run = async () => {
  const agora = new Date().toISOString();
  const anterior = carregarAnterior();

  const brutos = [];
  const falhasFonte = [];
  await Promise.all(FONTES.map(async (u) => {
    try {
      const r = await fetch(u, { headers: UA });
      if (!r.ok) { falhasFonte.push(u + ' HTTP ' + r.status); return; }
      const achados = itensDoRss(await r.text());
      console.log('FONTE ' + u + ' -> ' + achados.length + ' candidatos');
      brutos.push(...achados);
    } catch(e) { falhasFonte.push(u + ' erro ' + e.message); console.log('FONTE ' + u + ' erro ' + e.message); }
  }));

  brutos.sort((a, b) => (Date.parse(b.dataFeed)||0) - (Date.parse(a.dataFeed)||0));

  const vistos = new Set();
  const candidatosUnicos = brutos.filter((it) => {
    const k = it.titulo.toLowerCase().replace(/\W+/g,'').slice(0,50);
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  }).slice(0, 60); // limite de candidatos processados por execução

  const verificados = [], pendentes = [], excluidos = [];
  for (const c of candidatosUnicos) {
    if (verificados.length >= 10) break;
    const r = await verificarCandidato(c);
    if (r.status === 'verificado') { console.log('VERIFICADO: ' + r.titulo.slice(0,60) + ' | ' + r.fonte + ' | ' + r.data); verificados.push(r); }
    else if (r.status === 'pendente') { console.log('PENDENTE: ' + r.titulo.slice(0,60) + ' | motivo: ' + r.motivo); pendentes.push(r); }
    else { console.log('EXCLUÍDO: ' + r.titulo.slice(0,60) + ' | motivo: ' + r.motivo); excluidos.push(r); }
  }

  verificados.sort((a, b) => Date.parse(b.data) - Date.parse(a.data));

  const saida = {
    ultimaTentativa: agora,
    atualizadoEm: verificados.length ? agora : (anterior ? anterior.atualizadoEm : null),
    status: verificados.length ? 'ok' : 'falha_mantido_anterior',
    totalCandidatos: candidatosUnicos.length,
    totalVerificados: verificados.length,
    totalPendentes: pendentes.length,
    totalExcluidos: excluidos.length,
    falhasFonte,
    itens: verificados.length ? verificados.slice(0, 10) : (anterior ? anterior.itens || [] : []),
    pendentes: pendentes.slice(0, 20),
    excluidos: excluidos.slice(0, 20)
  };

  salvar(saida);
  console.log(verificados.length ? ('gravadas ' + verificados.length + ' matérias verificadas') : 'nenhuma matéria verificada nesta execução — lista principal anterior preservada');
};

run().catch((e) => {
  console.error('falha geral do script:', e.message);
  const anterior = carregarAnterior();
  salvar({
    ultimaTentativa: new Date().toISOString(),
    atualizadoEm: anterior ? anterior.atualizadoEm : null,
    status: 'erro: ' + e.message,
    itens: anterior ? anterior.itens || [] : [],
    pendentes: anterior ? anterior.pendentes || [] : [],
    excluidos: anterior ? anterior.excluidos || [] : []
  });
  process.exit(0);
});
