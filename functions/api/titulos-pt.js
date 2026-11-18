// Compatibilidade com instalações anteriores à remoção da tradução de títulos.
export function onRequest() {
  return Response.json({
    error: 'Tradução de títulos removida. Atualize o Hub para consultar os títulos originais.'
  }, {
    status: 410,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    }
  });
}
