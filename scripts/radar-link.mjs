// Resolução dos links dos feeds. RSS direto traz a URL do veículo; Google Notícias é intermediário.
export async function resolverLinkCandidato(link, resolverGoogle) {
  let url;
  try { url = new URL(String(link || '').trim()); } catch (_) {
    return { ok: false, motivo: 'URL da notícia inválida' };
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return { ok: false, motivo: 'Protocolo da notícia inválido' };
  }
  const host = url.hostname.toLowerCase();
  if (host === 'news.google.com') return resolverGoogle(url.href);
  return { ok: true, url: url.href };
}
