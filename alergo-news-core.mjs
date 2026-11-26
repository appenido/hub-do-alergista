// Uma manchete e as dez reportagens anteriores, pela data original de publicação.
export const TOTAL_EDICAO = 11;

export function materiaVeterinaria(titulo, url) {
  return /\/(?:pets|saude-animal|medicina-veterinaria)(?:\/|$)/i.test(url.pathname) ||
    /\b(?:coceira|prurido|dermatite(?: at[óo]pica)?|alergia|asma)\s+(?:em|n[oa]s?)\s+(?:cachorr[oa]s?|cães|gatos?)\b/i.test(titulo);
}

export function normalizarManchete(titulo) {
  return titulo.normalize('NFKD').replace(/\p{M}/gu, '')
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function manchetesRepetidas(a, b) {
  const x = normalizarManchete(a), y = normalizarManchete(b);
  if (x === y) return true;
  const prefixo = titulo => normalizarManchete(titulo.split(':')[0]);
  const pa = prefixo(a), pb = prefixo(b);
  const ignorar = new Set('a o as os um uma uns umas de do da dos das e em no na nos nas para por com que se ao aos como sobre'.split(' '));
  const palavras = titulo => new Set(titulo.split(' ').filter(p => p.length > 2 && !ignorar.has(p)));
  const wa = palavras(x), wb = palavras(y);
  const comuns = [...wa].filter(p => wb.has(p)).length;
  // Mesmo gancho editorial e conteúdo em comum, ou grande sobreposição lexical.
  if (a.includes(':') && b.includes(':') && pa === pb &&
      pa.split(' ').length >= 4 && comuns >= 4) return true;
  return comuns >= 5 && comuns / Math.max(wa.size, wb.size) >= 0.72;
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
    const titulo = normalizarManchete(item.titulo);
    candidatas.push({item, data, titulo, url: url.href.replace(/\/$/, '')});
  }

  const urls = new Set();
  const titulos = new Set();
  const resultado = [];
  candidatas.sort((a, b) => b.data - a.data);
  for (const candidata of candidatas) {
    if (urls.has(candidata.url) || titulos.has(candidata.titulo) ||
        resultado.some(anterior => Math.abs(Date.parse(anterior.data) - candidata.data) <= 7 * 86400000 &&
          manchetesRepetidas(anterior.titulo, candidata.item.titulo))) continue;
    urls.add(candidata.url);
    titulos.add(candidata.titulo);
    resultado.push(candidata.item);
    if (resultado.length === limite) break;
  }
  return resultado;
}
