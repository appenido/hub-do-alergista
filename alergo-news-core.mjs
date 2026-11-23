// Uma manchete e as dez reportagens anteriores, pela data original de publicação.
export const TOTAL_EDICAO = 11;

export function materiaVeterinaria(titulo, url) {
  return /\/(?:pets|saude-animal|medicina-veterinaria)(?:\/|$)/i.test(url.pathname) ||
    /\b(?:coceira|prurido|dermatite(?: at[óo]pica)?|alergia|asma)\s+(?:em|n[oa]s?)\s+(?:cachorr[oa]s?|cães|gatos?)\b/i.test(titulo);
}

export function selecionarVerificadas(itens, {agora = Date.now(), idadeMaxima = Infinity, limite = TOTAL_EDICAO} = {}) {
  const candidatas = [];
  for (const item of Array.isArray(itens) ? itens : []) {
    if (item?.status !== 'verificado' || item.verificado !== true ||
        typeof item.titulo !== 'string' || !item.titulo.trim() || !item.fonte) continue;
    const data = Date.parse(item.data);
    if (!Number.isFinite(data) || data > agora + 5 * 60000 || agora - data > idadeMaxima) continue;
    let url;
    try { url = new URL(item.url); } catch { continue; }
    if (url.protocol !== 'https:' || materiaVeterinaria(item.titulo, url)) continue;
    url.hash = '';
    for (const parametro of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(parametro)) url.searchParams.delete(parametro);
    }
    const titulo = item.titulo.normalize('NFKD').replace(/\p{M}/gu, '')
      .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    candidatas.push({item, data, titulo, url: url.href.replace(/\/$/, '')});
  }

  const urls = new Set();
  const titulos = new Set();
  const resultado = [];
  candidatas.sort((a, b) => b.data - a.data);
  for (const candidata of candidatas) {
    if (urls.has(candidata.url) || titulos.has(candidata.titulo)) continue;
    urls.add(candidata.url);
    titulos.add(candidata.titulo);
    resultado.push(candidata.item);
    if (resultado.length === limite) break;
  }
  return resultado;
}
