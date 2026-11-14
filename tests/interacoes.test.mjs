import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { onRequest } from '../functions/interacoes.js';

const carregar = nome => readFileSync(new URL(`../${nome}`, import.meta.url), 'utf8');
const html = carregar('index.html');
const pagina = html.split('<div class="page" id="page-interacao">')[1]
  .split('<!-- ══ IMUNOGLOBULINAS')[0];

test('Interações medicamentosas oferece apenas o link direto para o Medscape', () => {
  const links = [...pagina.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)];
  assert.equal(links.length, 1);
  assert.equal(links[0][1], 'https://reference.medscape.com/drug-interactionchecker');
  assert.match(links[0][0], /target="_blank" rel="noopener noreferrer"/);
  assert.match(pagina, /Verificar interações no Medscape/);
  assert.doesNotMatch(pagina, /<(?:form|input|button|script|iframe)\b|\bonclick=/i);
  assert.match(html, /body:has\(#page-interacao\.active\) #auriReabrir/);
});

test('a instalação do Hub deixa de carregar o verificador local', () => {
  assert.doesNotMatch(html, /interacoes-clinicas\.js|diColetarMeds|diAdicionarCampo/);
  const sw = carregar('sw.js');
  assert.match(sw, /medscape-externo/);
  assert.doesNotMatch(sw, /interacoes-clinicas\.js|interacoes-cima\.json/);
});

test('rota antiga informa a mudança sem ler nem encaminhar os dados da consulta', async () => {
  const resultado = onRequest({
    get request() { throw new Error('A rota desativada não deve acessar o corpo da consulta.'); }
  });
  assert.equal(resultado.status, 410);
  assert.equal(resultado.headers.get('Cache-Control'), 'no-store');
  assert.equal(resultado.headers.get('Location'), null);
  assert.match((await resultado.json()).erro, /consulta agora é feita no Medscape/);
});
