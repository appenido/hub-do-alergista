import { readFile, writeFile, rename } from 'node:fs/promises';
import { normalizar, palavras, termosCima } from '../interacoes-cima.mjs';

const API = 'https://cima.aemps.es/cima/rest/';
const ARQUIVO = new URL('../data/interacoes-cima.json', import.meta.url);
const METADADOS = {
  origem: 'AEMPS/CIMA — Agencia Española de Medicamentos y Productos Sanitarios',
  dadosAbertos: 'https://sede.aemps.gob.es/datos-abertos/',
  termos: 'https://www.aemps.gob.es/aviso-legal/',
  transformacao: 'Índice de termos da seção 4.5. Grafia normalizada; interpretação clínica não automatizada.'
};

async function obter(caminho, parametros, formato) {
  const url = new URL(caminho, API);
  url.search = new URLSearchParams(parametros);
  for (let tentativa = 1; ; tentativa++) {
    try {
      const resposta = await fetch(url, { signal: AbortSignal.timeout(14000), headers: { Accept: formato } });
      if (caminho.startsWith('docSegmentado') && resposta.status === 404) {
        await resposta.body?.cancel();
        return '';
      }
      if (!resposta.ok || !resposta.headers.get('Content-Type')?.includes(formato)) {
        await resposta.body?.cancel();
        throw Error(`HTTP ${resposta.status}`);
      }
      return formato === 'application/json' ? await resposta.json() : await resposta.text();
    } catch (erro) {
      if (tentativa === 2) throw new Error(`${url.pathname} ${url.search}: ${erro.message}`);
      await new Promise(resolve => setTimeout(resolve, 1400));
    }
  }
}

async function emParalelo(itens, tarefa, limite) {
  let proximo = 0;
  async function executar() {
    while (proximo < itens.length) {
      const item = itens[proximo++];
      await tarefa(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limite, itens.length) }, executar));
}

const diretorioCatalogo = process.argv[2];
async function listar(pagina) {
  const r = diretorioCatalogo
    ? JSON.parse(await readFile(`${diretorioCatalogo}/pagina-${pagina}.json`, 'utf8'))
    : await obter('medicamentos', { comerc: '1', pagina }, 'application/json');
  if (!Array.isArray(r.resultados) || Number(r.pagina) !== pagina) throw Error(`Página inválida: ${pagina}`);
  return r;
}

const primeiro = await listar(1);
const totalPaginas = Math.ceil(primeiro.totalFilas / primeiro.tamanioPagina);
if (!Number.isSafeInteger(totalPaginas) || totalPaginas < 2 || totalPaginas > 200) {
  throw Error('O catálogo CIMA retornou uma paginação inesperada.');
}
const catalogo = [...primeiro.resultados];
await emParalelo(Array.from({ length: totalPaginas - 1 }, (_, i) => i + 2), async pagina => {
  const outras = await listar(pagina);
  catalogo.push(...outras.resultados);
}, 5);

const candidatos = new Map();
for (const produto of catalogo) {
  const viaOral = produto.viasAdministracion?.some(v => v.id === 48);
  const ativo = normalizar(produto.vtm?.nombre || '');
  const ficha = produto.docs?.find(d => d.tipo === 1 && d.secc);
  if (!ativo || ativo === 'multicomponente' || !ficha || !/^\d{4,12}$/.test(produto.nregistro)) continue;
  const atual = candidatos.get(ativo);
  const data = Number(ficha.fecha || 0);
  const prioridade = Number(Boolean(viaOral));
  const preferencia = atual && (prioridade - atual.prioridade || data - atual.data || atual.registro.localeCompare(produto.nregistro));
  if (!atual || preferencia > 0) candidatos.set(ativo, { registro: produto.nregistro, data, prioridade });
}
if (candidatos.size < 500) throw Error('Cobertura inesperada no catálogo CIMA.');

const termosBuscaveis = termosCima(candidatos.keys()).map(nome => [nome, palavras(nome)]);

let anterior = {};
try { anterior = JSON.parse(await readFile(ARQUIVO, 'utf8')).ativos; }
catch (erro) { if (erro.code !== 'ENOENT') throw erro; }

const ativos = new Map();
const falhas = [];
let verificados = 0;
const revisarFichasSemData = new Date().getUTCDay() === 0;
console.log(`${candidatos.size} princípios ativos ou associações nas fichas técnicas.`);
await emParalelo([...candidatos], async ([ativo, { registro, data }]) => {
  const ultimaData = data ? new Date(data).toISOString() : null;
  const existente = Object.hasOwn(anterior, ativo) ? anterior[ativo] : undefined;
  if (existente?.[0] === registro && existente[1] === ultimaData && (ultimaData || !revisarFichasSemData)) {
    ativos.set(ativo, existente);
    return;
  }
  try {
    const texto = await obter('docSegmentado/contenido/1', { nregistro: registro, seccion: '4.5' }, 'text/plain');
    if (!texto.trim()) return;
    const palavrasDaFicha = palavras(texto);
    const reconhecidos = termosBuscaveis.filter(([nome, termo]) => nome !== ativo && palavrasDaFicha.includes(termo))
      .map(([nome]) => nome);
    ativos.set(ativo, [registro, ultimaData, reconhecidos.sort()]);
  } catch (erro) {
    if (existente) ativos.set(ativo, existente);
    falhas.push(`${ativo}: ${erro.message}`);
  }
  if (++verificados % 100 === 0) console.log(`${verificados} fichas obtidas ou revalidadas.`);
}, Number(process.env.CIMA_DOWNLOAD_CONCURRENCY || 8));

if (falhas.length) console.warn(`${falhas.length} fichas indisponíveis: ${falhas.slice(0, 5).join(' | ')}`);
if (ativos.size < candidatos.size * 0.9) throw Error('A quantidade de fichas recebidas ficou abaixo de 90%.');
const resultado = Object.fromEntries([...ativos].sort(([a], [b]) => a.localeCompare(b)));
const conteudo = `{
  ${Object.entries(METADADOS).map(([chave, valor]) => `${JSON.stringify(chave)}: ${JSON.stringify(valor)}`).join(',\n  ')},
  "ativos": {
    ${Object.entries(resultado).map(([nome, dados]) => `${JSON.stringify(nome)}: ${JSON.stringify(dados)}`).join(',\n    ')}
  }
}\n`;
const temporario = new URL('../data/.interacoes-cima.tmp', import.meta.url);
await writeFile(temporario, conteudo);
await rename(temporario, ARQUIVO);
console.log(`${ativos.size} itens registrados. Índice de ${Buffer.byteLength(conteudo)} bytes.`);
