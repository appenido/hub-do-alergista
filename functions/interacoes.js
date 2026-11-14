// Informa a mudança às instalações do Hub que ainda carregam a tela antiga.
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

export function onRequest() {
  return new Response(JSON.stringify({
    erro: 'A consulta agora é feita no Medscape. Atualize o Hub e volte à seção Interações medicamentosas para acessar o link.'
  }), { status: 410, headers: HEADERS });
}
