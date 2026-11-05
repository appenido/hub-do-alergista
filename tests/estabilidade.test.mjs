import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { resolverLinkCandidato } from '../scripts/radar-link.mjs';

async function importarFuncaoCloudflare() {
  const src = await readFile(new URL('../functions/news.js', import.meta.url), 'utf8');
  return import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'));
}

test('RSS de veículo brasileiro não deve passar pelo resolvedor do Google', async () => {
  let chamado = false;
  const original = 'https://g1.globo.com/saude/noticia/2026/11/04/exemplo.ghtml';
  const r = await resolverLinkCandidato(original, async () => { chamado = true; return { ok: false }; });
  assert.equal(r.ok, true);
  assert.equal(r.url, original);
  assert.equal(chamado, false);
});

test('link intermediário do Google Notícias precisa de resolução', async () => {
  const r = await resolverLinkCandidato('https://news.google.com/rss/articles/ABC', async link => ({
    ok: true, url: link.replace('news.google.com', 'g1.globo.com')
  }));
  assert.equal(r.ok, true);
  assert.match(r.url, /g1\.globo\.com/);
});

test('não aceitar protocolos potencialmente perigosos nas notícias', async () => {
  const r = await resolverLinkCandidato('javascript:alert(1)', async () => ({ ok: true }));
  assert.equal(r.ok, false);
});

test('/news entrega apenas notícias verificadas, recentes, HTTPS, e em ordem decrescente', async () => {
  const { onRequestGet } = await importarFuncaoCloudflare();
  const agora = Date.now();
  const noticia = (titulo, dias, status = 'verificado', verific = true, url = 'https://g1.globo.com/exemplo') =>
    ({ titulo, fonte: 'G1', data: new Date(agora - dias * 86400000).toISOString(), status, verificado: verific, url });
  const itens = [
    noticia('antiga', 8),
    noticia('segunda', 2, 'verificado', true, 'https://g1.globo.com/segunda'),
    noticia('não verificada', 1, 'pendente', false),
    noticia('futura', -2),
    noticia('insegura', 1, 'verificado', true, 'javascript:alert(1)'),
    noticia('primeira', 1, 'verificado', true, 'https://g1.globo.com/primeira')
  ];
  const response = await onRequestGet({
    request: new Request('https://hubdoalergista.pages.dev/news'),
    env: { ASSETS: { fetch: async () => new Response(JSON.stringify({ itens, status: 'ok', atualizadoEm: new Date().toISOString() })) } }
  });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.deepEqual(data.itens.map(x => x.titulo), ['primeira', 'segunda']);
});

test('/news não volta a fontes RSS não verificadas se o arquivo estiver indisponível', async () => {
  const { onRequestGet } = await importarFuncaoCloudflare();
  const response = await onRequestGet({ request: new Request('https://hubdoalergista.pages.dev/news'), env: {} });
  assert.equal(response.status, 503);
  assert.deepEqual((await response.json()).itens, []);
});

test('service worker não intercepta rotas dinâmicas; mantém arquivos estáticos offline', async () => {
  const source = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  const listeners = {};
  const context = {
    self: {
      location: { origin: 'https://hubdoalergista.pages.dev' },
      addEventListener: (type, fn) => { listeners[type] = fn; },
      skipWaiting: () => {},
      clients: { claim: async () => {} }
    },
    caches: {
      open: async () => ({ put: async () => {}, addAll: async () => {} }),
      match: async () => new Response('offline'),
      keys: async () => []
    },
    fetch: async () => new Response('online'),
    URL, Set, Promise, Response
  };
  vm.runInNewContext(source, context);
  assert.equal(typeof listeners.fetch, 'function');
  let interceptou = false;
  const ev = url => ({
    request: new Request(url),
    respondWith: promise => { interceptou = true; return promise; },
    waitUntil: () => {}
  });
  for (const path of ['/news', '/cursos', '/crm?uf=MG&crm=1', '/ia', '/api/qualquer']) {
    interceptou = false;
    listeners.fetch(ev('https://hubdoalergista.pages.dev' + path));
    assert.equal(interceptou, false, path + ' não deve ser armazenado');
  }
  interceptou = false;
  listeners.fetch(ev('https://hubdoalergista.pages.dev/index.html'));
  assert.equal(interceptou, true);
});


test('/news elimina URLs e manchetes duplicadas antes de limitar resultados', async () => {
  const { onRequestGet } = await importarFuncaoCloudflare();
  const agora = Date.now();
  const noticia = (titulo, url, atraso) => ({
    titulo, fonte: 'G1', url, data: new Date(agora - atraso * 1000).toISOString(),
    status: 'verificado', verificado: true
  });
  const itens = [
    noticia('Notícia A', 'https://g1.globo.com/a?utm_source=feed', 10),
    noticia('Notícia A', 'https://g1.globo.com/a', 20),
    noticia('Notícia B', 'https://g1.globo.com/b', 30),
    noticia('Notícia B', 'https://g1.globo.com/outra', 40),
    noticia('Notícia C', 'https://g1.globo.com/c', 50)
  ];
  const resposta = await onRequestGet({
    request: new Request('https://hubdoalergista.pages.dev/news'),
    env: { ASSETS: { fetch: async () => new Response(JSON.stringify({ itens })) } }
  });
  assert.equal(resposta.status, 200);
  assert.deepEqual((await resposta.json()).itens.map(i => i.titulo), ['Notícia A', 'Notícia B', 'Notícia C']);
});
