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
  'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml',
  'https://agenciabrasil.ebc.com.br/rss/geral/feed.xml',
  'https://www.cnnbrasil.com.br/saude/feed/',
  'https://www.metropoles.com/saude/feed',
  'https://vejasp.abril.com.br/feed/',
  'https://saude.abril.com.br/feed/',
  'https://rss.uol.com.br/feed/noticias.xml',
  'https://noticias.r7.com/saude/feed.xml',
  'https://www.terra.com.br/rss/saude/'
];

const limpar = (t) => (t||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
const UA = { 'User-Agent':'Mozilla/5.0 (compatible; HubDoAlergista-Radar/1.0)' };

// link do Google News vem codificado: resolve pelo endpoint oficial do próprio Google News
async function resolverGoogle(url){
  const m = String(url).match(/\/(?:rss\/)?articles\/([A-Za-z0-9_-]+)/);
  if (!m) return '';
  const id = m[1];
  try {
    const p = await fetch('https://news.google.com/rss/articles/' + id, { headers: UA });
    const h = await p.text();
    const sig = (h.match(/data-n-a-sg="([^"]+)"/) || [])[1];
    const ts  = (h.match(/data-n-a-ts="([^"]+)"/) || [])[1];
    if (!sig || !ts) return '';
    const payload = [ 'Fbv4je', JSON.stringify(['garturlreq',[['pt-BR','BR',['FINANCE_TOP_INDICES','WEB_TEST_1_0_0'],null,null,1,1,'BR:pt-419',null,null,null,null,null,null,null,0],'pt-BR','BR',true,[2],1,true,'1',null,null,null,0],id,Number(ts),sig]) ];
    const r = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
      method: 'POST',
      headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: 'f.req=' + encodeURIComponent(JSON.stringify([[payload]]))
    });
    const t = await r.text();
    const alvo = t.match(/"(https?:\/\/(?!news\.google)[^"\\]+)"/);
    return alvo ? alvo[1] : '';
  } catch(e) { return ''; }
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
      if (!r.ok) { console.log('FONTE ' + u + ' HTTP ' + r.status); return; }
      const achados = itensDoRss(await r.text(), '');
      console.log('FONTE ' + u + ' -> ' + achados.length);
      brutos.push(...achados);
    } catch(e) { console.log('FONTE ' + u + ' erro ' + e.message); }
  }));

  brutos.sort((a,b) => (Date.parse(b.data)||0) - (Date.parse(a.data)||0));

  const vistos = new Set(), verificadas = [];
  for (const it of brutos) {
    if (verificadas.length >= 10) break;
    const chave = it.titulo.toLowerCase().replace(/\W+/g,'').slice(0,50);
    if (vistos.has(chave)) continue;
    const r = await resolver(it.url);
    let final = r.final, html = r.html, verificado = true;
    if (!final) {                       // não deu para abrir: fica com o link do Google News, que redireciona ao veículo
      final = it.url; html = ''; verificado = false;
    }
    if (BLOQUEADOS.test(final)) continue;
    let host = ''; try { host = new URL(final).hostname.replace(/^www\./,''); } catch(e) { continue; }
    const fonteNome = it.fonte || host;
    if (/news\.google\.com/.test(host)) {
      if (!it.fonte || ESTRANGEIROS.test(it.fonte)) continue;   // sem veículo identificável, ou veículo de fora
    } else if (!brasileiro(host)) continue;
    const ts = dataDaPagina(html) || Date.parse(it.data) || 0;
    if (!ts) continue;                                   // sem data confirmada: fora
    if (Date.now() - ts > 90*24*3600*1000) continue;      // janela máxima de 90 dias
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
    vistos.add(chave);
    verificadas.push({
      titulo: limpar(h1) || it.titulo,
      fonte: fonteNome,
      data: new Date(ts).toISOString(),
      url: final,
      verificado: verificado && !!dataDaPagina(html)
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
