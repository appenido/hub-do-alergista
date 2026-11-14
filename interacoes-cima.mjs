const ORIGEM = 'https://cima.aemps.es';
const API = `${ORIGEM}/cima/rest/`;

const NOMES_CIMA = {
  apixabana: 'apixaban',
  dipirona: 'metamizol',
  edoxabana: 'edoxaban',
  omalizumabe: 'omalizumab',
  dupilumabe: 'dupilumab',
  mepolizumabe: 'mepolizumab',
  benralizumabe: 'benralizumab',
  tezepelumabe: 'tezepelumab',
  nemolizumabe: 'nemolizumab',
  lebrikizumabe: 'lebrikizumab',
  risanquizumabe: 'risankizumab',
  rivaroxabana: 'rivaroxaban',
  sildenafila: 'sildenafilo',
  sinvastatina: 'simvastatina',
  tadalafila: 'tadalafilo',
  tacrolimo: 'tacrolimus',
  linezolida: 'linezolid',
  varfarina: 'warfarina',
  verapamil: 'verapamilo',
  'sulfametoxazol/trimetoprima': 'sulfametoxazol + trimetoprima'
};

const TERMOS_ADICIONAIS = {
  'acido acetilsalicilico': ['AAS'],
  'acido valproico': ['ácido valproico', 'valproato'],
  ciprofloxacino: ['ciprofloxacina'],
  ciclosporina: ['ciclosporin'],
  dipirona: ['dipirona'],
  'sulfametoxazol/trimetoprima': ['cotrimoxazol', 'trimetoprima y sulfametoxazol', 'sulfametoxazol y trimetoprima'],
  tacrolimo: ['tacrolimo'],
  varfarina: ['varfarina']
};

export function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ').trim();
}

function nomeCima(ativo) {
  return Object.hasOwn(NOMES_CIMA, ativo) ? NOMES_CIMA[ativo] : ativo;
}

function palavras(texto) {
  return ` ${normalizar(texto).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `;
}

function fichaTecnica(produto) {
  return produto.docs?.find(doc => doc.tipo === 1 && doc.secc);
}

function viaOral(produto) {
  return produto.viasAdministracion?.some(via => via.id === 48) ? 1 : 0;
}

function escolherFicha(produtos, ativo) {
  return produtos.filter(produto =>
    /^\d{4,12}$/.test(produto.nregistro) &&
    typeof produto.vtm?.nombre === 'string' &&
    normalizar(produto.vtm.nombre) === ativo && fichaTecnica(produto)
  ).sort((a, b) => viaOral(b) - viaOral(a) ||
    (fichaTecnica(b).fecha || 0) - (fichaTecnica(a).fecha || 0)
  )[0];
}

async function obter(caminho, parametros, formato, signal) {
  const url = new URL(caminho, API);
  url.search = new URLSearchParams(parametros);
  const resposta = await fetch(url, {
    signal,
    redirect: 'error',
    headers: { Accept: formato },
    cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 86400, '400-599': -1 } }
  });
  if (!resposta.ok || !resposta.headers.get('Content-Type')?.includes(formato)) {
    await resposta.body?.cancel();
    throw new Error('Consulta CIMA indisponível.');
  }
  return resposta;
}

export async function consultarCima(ativo, signal) {
  const nome = nomeCima(ativo);
  const termo = nome.split(' + ')[0];
  if (!/^[a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*){0,3}$/.test(termo)) {
    return { situacao: 'sem_ficha' };
  }

  try {
    const catalogo = await obter('medicamentos', { practiv1: termo, comerc: '1' }, 'application/json', signal);
    const { resultados } = await catalogo.json();
    if (!Array.isArray(resultados)) return { situacao: 'indisponivel' };
    const produto = escolherFicha(resultados, nome);
    if (!produto) return { situacao: 'sem_ficha' };

    const secao = await obter('docSegmentado/contenido/1', {
      nregistro: produto.nregistro,
      seccion: '4.5'
    }, 'text/plain', signal);
    const conteudo = (await secao.text()).trim();
    if (!conteudo) return { situacao: 'sem_ficha' };
    return {
      situacao: 'consultada',
      texto: palavras(conteudo),
      fonte: {
        url: `${ORIGEM}/cima/dochtml/ft/${produto.nregistro}/FT_${produto.nregistro}.html#4.5`
      }
    };
  } catch {
    return { situacao: 'indisponivel' };
  }
}

export function citaMedicamento(ficha, ativo) {
  if (ficha?.situacao !== 'consultada') return false;
  return [nomeCima(ativo), ...(Object.hasOwn(TERMOS_ADICIONAIS, ativo) ? TERMOS_ADICIONAIS[ativo] : [])]
    .some(termo => ficha.texto.includes(palavras(termo)));
}
