import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const env = { window: {} };
vm.runInNewContext(readFileSync(new URL('../medicamentos-dose-catalogo.js', import.meta.url), 'utf8'), env);
const { parsePresentation, buildCatalog, normalize } = env.window.HubDoseCatalog;
const cm = JSON.parse(readFileSync(new URL('../data/medicamentos-apresentacoes.json', import.meta.url), 'utf8'));

test('CMED tem catálogo válido e azitromicina aparece com comprimidos e suspensão', () => {
  assert.ok(cm.items.length > 1000);
  const list = buildCatalog([], cm.items, {});
  const found = list.filter(item => item.key.includes('azitromicina'));
  assert.ok(found.length >= 2);
  const forms = found.flatMap(item => item.registered);
  assert.ok(forms.some(item => item.concentration === 40 && item.form === 'oralPowder' && item.calculable));
  assert.ok(forms.some(item => item.unitSize === 500 && item.form === 'tablet' && item.calculable));
  assert.ok(forms.some(item => item.unitSize === 1000 && item.form === 'tablet'));
  assert.ok(found.some(item => item.terms.includes('zitromax')));
  assert.ok(found.some(item => item.terms.includes('astro')));
});

test('Distingue líquidos, pó para suspensão, gotas, comprimidos, cápsulas e liberação modificada', () => {
  assert.equal(parsePresentation('50 MG/ML SOL OR').concentration, 50);
  assert.equal(parsePresentation('6 MG/ML SUS OR').form, 'oralSuspension');
  assert.equal(parsePresentation('40 MG/ML PO SUS OR').form, 'oralPowder');
  assert.equal(parsePresentation('500 MG/ML SOL OR GOTAS').form, 'oralDrops');
  assert.equal(parsePresentation('1 MG/ML XPE').form, 'syrup');
  assert.equal(parsePresentation('500 MG COM REV').unitSize, 500);
  assert.equal(parsePresentation('1 G COM').unitSize, 1000);
  assert.equal(parsePresentation('20 MG CAP DURA').form, 'capsule');
  assert.equal(parsePresentation('5 MG COM LIB PROL').form, 'tablet');
  assert.equal(parsePresentation('100 MG COM + 25 MG COM')?.calculable, false);
  assert.equal(parsePresentation('1500 MG PO SUS OR'), null);
});

test('Impede converter injetáveis, colírios, sprays nasais e associações como dose oral', () => {
  assert.equal(parsePresentation('500 MG/ML SOL INJ').calculable, false);
  assert.equal(parsePresentation('5 MG/ML SOL OFT').calculable, false);
  assert.equal(parsePresentation('1 MG/ML SOL NAS').calculable, false);
  assert.equal(parsePresentation('10 MG/ML + 2 MG/ML XPE').calculable, false);
});

test('A busca é insensível a maiúsculas e acentos; marcas ficam indexadas', () => {
  const list = buildCatalog([], [['AZITROMICINA', 'ZITROMAX', ['40 MG/ML PO SUS OR','500 MG COM REV']]], {});
  assert.equal(list.length, 1);
  assert.ok(list[0].keywords.has('zitromax'));
  assert.equal(normalize('AZITROMICINA'), 'azitromicina');
  assert.ok(list[0].registered.every(item => item.calculable));
});
