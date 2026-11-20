import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../hub-paginas.js', import.meta.url), 'utf8');
const pages = new Set(['dashboard', 'medicamentos', 'eaaci', 'imunizacoes', 'scores', 'imuno', 'favoritos']);
const window = {};
// O carregamento não inicializa a interface: exercita a API pública de URLs.
runInNewContext(source, {
  window,
  document: {
    readyState: 'loading', addEventListener() {},
    getElementById: id => id.startsWith('page-') && pages.has(id.slice(5)) ? {id} : null
  }
});
const routes = window.HubPages;
const plain = value => JSON.parse(JSON.stringify(value));

test('URLs de páginas profundas mantêm módulo e sequência de conteúdos', () => {
  const steps = [{kind: 'categoria', key: 'anti'}, {kind: 'anti', key: 'desloratadina'}, {kind: 'resultado', key: 'ahResult'}];
  const path = routes.href('medicamentos', steps);
  assert.equal(path, '#/medicamentos/categoria~anti/anti~desloratadina/resultado~ahResult');
  const restored = plain(routes.parseRoute(path));
  assert.equal(restored.page, 'medicamentos');
  assert.deepEqual(restored.steps, steps);
});

test('URLs preservam acentos, espaços e caracteres de apresentação sem fragmentar a rota', () => {
  const steps = [{kind: 'conteudo', key: 'Concentração 1% / solução + A&B'}];
  const path = routes.href('medicamentos', steps);
  assert.deepEqual(plain(routes.parseRoute(path)).steps, steps);
});

test('links inválidos não viram páginas nem acionam funções arbitrárias', () => {
  for (const hash of ['#antigo', '#/ausente', '#/scores/score', '#/scores/score~', '#/scores/eval~alert', '#/scores/%E0%A4%A']) {
    assert.equal(routes.parseRoute(hash), null, hash);
  }
  assert.equal(routes.parseRoute('#/scores/' + Array(25).fill('score~act').join('/')), null);
});

test('URLs dos formulários e resultados não serializam dados clínicos nem campos do paciente', () => {
  const path = routes.href('scores', [{kind: 'score', key: 'uct', patientName: 'Nome privado', answers: [1, 2], weight: 70}]);
  assert.equal(path, '#/scores/score~uct');
  assert.doesNotMatch(path, /privado|answers|weight|70/);
});

test('calendários de fontes distintas têm destinos diferentes', () => {
  const sbim = routes.href('imunizacoes', [{kind: 'calendarios', key: 'sbim'}, {kind: 'calendario', key: 'sbim:crianca'}]);
  const pni = routes.href('imunizacoes', [{kind: 'calendarios', key: 'pni'}, {kind: 'calendario', key: 'pni:crianca'}]);
  assert.notEqual(sbim, pni);
  assert.equal(plain(routes.parseRoute(pni)).steps.at(-1).key, 'pni:crianca');
});
