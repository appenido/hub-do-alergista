// Cloudflare Pages Function — somente notícias verificadas no radar editorial.
// GET /news mantém o contrato de resposta { itens, ... } usado pelo frontend.
// O radar é produzido diariamente por scripts/radar.mjs e revisa a página do veículo.
import {selecionarVerificadas} from '../alergo-news-core.mjs';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=300'
};
const JANELA_MS = 7 * 24 * 60 * 60 * 1000;
const LIMITE_SEMANAL = 10;

function resposta(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: status === 200 ? HEADERS : { ...HEADERS, 'Cache-Control': 'no-store' }
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function onRequestGet({ request, env }) {
  if (!env || !env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
    return resposta({ itens: [], erro: 'Fonte de notícias indisponível.' }, 503);
  }
  try {
    const origem = new URL('/jornal/radar.json', request.url);
    const resp = await env.ASSETS.fetch(new Request(origem.toString(), { method: 'GET' }));
    if (!resp.ok) throw new Error('Falha ao ler radar.json: HTTP ' + resp.status);
    const dados = await resp.json();
    const edicao = new URL(request.url).searchParams.get('edicao') === '1';
    const opcoes = edicao ? {} : {idadeMaxima: JANELA_MS, limite: LIMITE_SEMANAL};
    const itens = selecionarVerificadas(dados.itens, opcoes)
      .map(({titulo, fonte, data, url}) => ({titulo, fonte, data, url}));
    return resposta({
      itens,
      atualizadoEm: dados.atualizadoEm || null,
      ultimaTentativa: dados.ultimaTentativa || null,
      status: dados.status || 'indisponivel',
      fontes: 'radar-verificado',
      falhas: Array.isArray(dados.falhasFonte) ? dados.falhasFonte : [],
      ...(itens.length ? {} : { erro: edicao ? 'Nenhuma reportagem verificada.' : 'Nenhuma notícia verificada nos últimos 7 dias.' })
    });
  } catch (_) {
    return resposta({ itens: [], erro: 'Não foi possível consultar as notícias verificadas.' }, 503);
  }
}
