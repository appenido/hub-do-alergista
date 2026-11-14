const ORIGEM = 'https://cima.aemps.es';

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
  'acido acetilsalicilico': ['aas'],
  'acido valproico': ['valproato'],
  ciprofloxacino: ['ciprofloxacina'],
  ciclosporina: ['ciclosporin'],
  dipirona: ['dipirona'],
  'sulfametoxazol/trimetoprima': ['cotrimoxazol'],
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

export function palavras(texto) {
  return ` ${normalizar(texto).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `;
}

export function termosCima(nomes) {
  return [...new Set([...nomes, ...Object.values(TERMOS_ADICIONAIS).flat()])].sort();
}

export function obterFicha(indice, ativo) {
  if (!indice) return { situacao: 'indisponivel' };
  const nome = nomeCima(ativo);
  if (!Object.hasOwn(indice, nome)) return { situacao: 'sem_ficha' };
  const linha = indice[nome];
  if (!Array.isArray(linha) || !/^\d{4,12}$/.test(linha[0]) || !Array.isArray(linha[2])) {
    return { situacao: 'indisponivel' };
  }
  const [registro, atualizada, termos] = linha;
  return {
    situacao: 'consultada', termos,
    fonte: {
      url: `${ORIGEM}/cima/dochtml/ft/${registro}/FT_${registro}.html#4.5`,
      atualizada: atualizada?.slice(0, 10) || null
    }
  };
}

export function citaMedicamento(ficha, ativo) {
  if (ficha?.situacao !== 'consultada') return false;
  const alternativos = Object.hasOwn(TERMOS_ADICIONAIS, ativo) ? TERMOS_ADICIONAIS[ativo] : [];
  return [nomeCima(ativo), ...alternativos].some(termo => ficha.termos.includes(termo));
}
