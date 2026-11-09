// Consulta da grade oficial do 53º Congresso ASBAI 2026 (sem login).
// Executa no servidor para evitar CORS e procura em ambas as variantes do domínio.
const BASE = 'https://congressoalergiaasbai2026.com.br/evento/alergia2026/pt/programacao/gradeatividades';
const SOURCES = [
  BASE + '/todas',
  BASE,
  BASE.replace('https://', 'https://www.') + '/todas',
  BASE.replace('https://', 'https://www.')
];

async function getOfficialHTML(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'User-Agent': 'Mozilla/5.0 (compatible; CongressoAgendaHub/1.0; +https://hubdoalergista.pages.dev/)'
      },
      signal: controller.signal
    });
    if (!response.ok || !(response.headers.get('content-type') || '').includes('html')) {
      throw new Error('HTTP não disponível');
    }
    const html = await response.text();
    if (html.length < 3500 || html.length > 3500000 ||
        !/urtic[aá]ria|alergia alimentar|palestrante/i.test(html)) {
      throw new Error('Documento inválido');
    }
    return {html, source: url};
  } finally {
    clearTimeout(timeout);
  }
}

export async function onRequestGet() {
  try {
    // A origem pode recusar requisições de um dos domínios.
    // Requisições concorrentes evitam que o visitante espere quatro timeouts.
    const {html, source} = await Promise.any(SOURCES.map(getOfficialHTML));
    return new Response(JSON.stringify({
      ok: true, html, source, at: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=600'
      }
    });
  } catch (_) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'A grade oficial não pôde ser consultada no momento.'
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  }
}
