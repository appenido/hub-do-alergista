// Fonte primária: grade oficial do 53º Congresso Brasileiro de Alergia e Imunologia.
// A consulta é executada no servidor para evitar CORS no navegador.
const BASE = 'https://congressoalergiaasbai2026.com.br/evento/alergia2026/pt/programacao/gradeatividades';
const SOURCES = [
  BASE + '/todas',
  BASE,
  BASE.replace('https://', 'https://www.') + '/todas',
  BASE.replace('https://', 'https://www.')
];

export async function onRequestGet() {
  for (const url of SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      let response;
      try {
        response = await fetch(url, {
          redirect: 'follow',
          headers: {
            'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'User-Agent': 'Mozilla/5.0 (compatible; CongressoAgendaHub/1.0; +https://hubdoalergista.pages.dev/)'
          },
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) continue;
      const type = response.headers.get('content-type') || '';
      if (!type.includes('text/html')) continue;
      const html = await response.text();
      if (html.length < 3500 || html.length > 3500000) continue;
      if (!/urtic[aá]ria|alergia alimentar|palestrante/i.test(html)) continue;
      return new Response(JSON.stringify({
        ok: true, html, source: url, at: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=600'
        }
      });
    } catch (_) {
      // Tentar a variante seguinte do endereço oficial.
    }
  }
  return new Response(JSON.stringify({
    ok: false,
    error: 'A programação oficial não está acessível pelo servidor neste momento.'
  }), {
    status: 503,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
