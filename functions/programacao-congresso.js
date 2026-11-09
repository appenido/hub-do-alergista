// Consulta pública da programação oficial do 53º Congresso ASBAI 2026.
// Não exige login ou chave de API. O cliente interpreta o HTML apenas como dados.
const SOURCES = [
 'https://www.congressoalergiaasbai2026.com.br/evento/alergia2026/pt/programacao/lista',
 'https://congressoalergiaasbai2026.com.br/evento/alergia2026/pt/programacao/lista'
];
export async function onRequestGet() {
  for (const url of SOURCES) {
    try {
      const r = await fetch(url, {
        redirect: 'follow',
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'pt-BR,pt;q=0.9',
          'User-Agent': 'Mozilla/5.0 (compatible; HubDoAlergista/1.0; consulta de programação pública)'
        },
        signal: AbortSignal.timeout(12000)
      });
      if (!r.ok) continue;
      const contentType = r.headers.get('content-type') || '';
      if (!contentType.includes('html')) continue;
      const html = await r.text();
      if (html.length < 3000 || html.length > 3500000 || !/programa[cç][aã]o|palestrante|congresso/i.test(html)) continue;
      return new Response(JSON.stringify({ok:true, html, source:url,at:new Date().toISOString()}), {
        headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=600'}
      });
    } catch(_){}
  }
  return new Response(JSON.stringify({ok:false,error:'A grade oficial não pôde ser consultada neste momento.'}),{
    status:503,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}
  });
}
