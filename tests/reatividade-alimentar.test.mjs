import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const script = readFileSync(new URL('../comparador-reatividade-alimentar.js', import.meta.url), 'utf8');
const marker = '  if(document.readyState==="loading")';
assert.ok(script.includes(marker), 'Ponto de inspeção do comparador ausente');
const source = script.replace(marker, '  window.__testFoodCross = {byId, PAIRS, PAIR_SRC, pairKey, render, links};\n' + marker);
const elements = {
  fxFoodA: {value:'banana'},
  fxFoodB: {value:'abacaxi'},
  fxTolerated: {checked:false},
  fxResult: {innerHTML:''}
};
const sandbox = {
  window: {},
  document: {readyState:'loading', addEventListener(){}, getElementById(id){return elements[id];}},
  console
};
runInNewContext(source, sandbox);
const cmp = sandbox.window.__testFoodCross;

test('Banana e abacaxi compartilham profilinas documentadas', () => {
  assert.ok(cmp.byId.banana.components.some(c => c.name === 'Mus a 1' && c.family === 'profilina'));
  assert.ok(cmp.byId.abacaxi.components.some(c => c.name === 'Ana c 1' && c.family === 'profilina'));
  assert.ok(cmp.byId.abacaxi.components.some(c => c.name === 'Ana c 2' && c.family === 'bromelina'));
  const key = cmp.pairKey('banana', 'abacaxi');
  assert.match(cmp.PAIRS[key].level, /documentada/);
  assert.match(cmp.PAIRS[key].reason, /Mus a 1 e Ana c 1/);
  assert.equal(cmp.PAIR_SRC[key].length, 4);
  assert.ok(cmp.PAIR_SRC[key].some(r => r[1].includes('000059400')));
  assert.ok(cmp.PAIR_SRC[key].some(r => r[1].includes('foods12132456')));
});

test('resultado clínico e referências específicas para banana e abacaxi', () => {
  cmp.render();
  assert.match(elements.fxResult.innerHTML, /Reatividade cruzada molecular documentada/);
  assert.match(elements.fxResult.innerHTML, /Profilinas/);
  assert.match(elements.fxResult.innerHTML, /Ana c 1/);
  assert.match(elements.fxResult.innerHTML, /Reindl et al/);
  assert.match(elements.fxResult.innerHTML, /PubMed/);
  assert.doesNotMatch(elements.fxResult.innerHTML, /Sem associação cruzada bem caracterizada/);
});

test('par sem mecanismo catalogado não é declarado negativo', () => {
  elements.fxFoodA.value='banana'; elements.fxFoodB.value='sardinha';
  cmp.render();
  assert.match(elements.fxResult.innerHTML, /Evidência específica ainda não cadastrada/);
  assert.match(elements.fxResult.innerHTML, /não comprova ausência/);
  assert.match(elements.fxResult.innerHTML, /pubmed.ncbi.nlm.nih.gov/);
});

test('tolerância ao alimento permanece informada sem exclusão automática', () => {
  elements.fxFoodA.value='banana'; elements.fxFoodB.value='abacaxi'; elements.fxTolerated.checked=true;
  cmp.render();
  assert.match(elements.fxResult.innerHTML, /Tolerância informada/);
  assert.match(elements.fxResult.innerHTML, /Não restringir ou solicitar IgEs apenas pela homologia molecular/);
});
