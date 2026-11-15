import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const env = { window: {} };
vm.runInNewContext(readFileSync(new URL('../medicamentos-dose-regras.js', import.meta.url), 'utf8'), env);
const { products, sources, manual, automatic } = env.window.HubDoseRules;
const dose = (id, use, ageMonths, kg) => automatic(products[id], use, ageMonths, kg);

test('Cada apresentação tem fonte e regras de idade, frequência e indicação sem sobreposição', () => {
  for (const [id, product] of Object.entries(products)) {
    assert.match(sources[product.source], /^https:\/\//, id);
    assert.ok(product.strength && product.uses.length && product.bands.length, id);
    for (const [i, row] of product.bands.entries()) {
      assert.ok(row.from < row.before && row.dose > 0 && row.times > 0, id);
      for (const next of product.bands.slice(i + 1)) {
        const overlapAge = row.from < next.before && next.from < row.before;
        const overlapUse = !row.only || !next.only || row.only === next.only;
        const sameBoundary = row.belowKg != null && row.belowKg === next.aboveKg;
        assert.ok(!overlapAge || !overlapUse || sameBoundary, id);
      }
    }
  }
});

test('Desalex distingue 5 meses, 6 meses, 1 ano e comprimido a partir de 12 anos', () => {
  assert.equal(dose('desalex-xarope', 'rhinitis', 5, 7).error, 'noBand');
  assert.equal(dose('desalex-xarope', 'rhinitis', 6, 7).ml, 2);
  assert.equal(dose('desalex-xarope', 'urticaria', 12, 9).ml, 2.5);
  assert.equal(dose('desalex-comprimido', 'rhinitis', 143, 45).error, 'noBand');
  assert.equal(dose('desalex-comprimido', 'rhinitis', 144, 45).tablets, 1);
});

test('Os limites exatos de peso e a indicação mudam a elegibilidade', () => {
  assert.equal(dose('alektos-ped', 'urticaria', 72, 19.99).error, 'bilastineWeight');
  assert.equal(dose('alektos-ped', 'urticaria', 72, 20).ml, 4);
  assert.equal(dose('loratadina-ache', 'rhinitis', 72, 29.99).amount, 5);
  assert.equal(dose('loratadina-ache', 'rhinitis', 72, 30).error, 'loratadineBoundary');
  assert.equal(dose('loratadina-ache', 'rhinitis', 72, 30.01).amount, 10);
  assert.equal(dose('allegra-pediatrico', 'seasonalRhinitis', 20, 10.5).error, 'noBand');
  assert.equal(dose('allegra-pediatrico', 'chronicUrticaria', 20, 10.5).ml, 2.5);
  assert.equal(dose('allegra-pediatrico', 'chronicUrticaria', 20, 11).error, 'fexoMismatch');
  assert.equal(dose('allegra-pediatrico', 'seasonalRhinitis', 24, 11).ml, 5);
});

test('O cálculo por kg e as unidades específicas da apresentação permanecem separados', () => {
  const syrup = dose('asmofen-xarope', 'rhinitis', 20, 10);
  assert.equal(syrup.amount, 0.5);
  assert.equal(syrup.ml, 2.5);
  assert.equal(syrup.daily, 1);
  const oralDrops = dose('zyxem-gotas', 'rhinitis', 30, 12);
  assert.equal(oralDrops.drops, 5);
  assert.equal(oralDrops.amount, 1.25);
  const nasal = dose('ryaltris-spray', 'moderateRhinitis', 144, 45);
  assert.equal(nasal.amount, 2);
  assert.equal(nasal.site, 'nostril');
  assert.equal(nasal.daily, 8);
  const ocular = dose('patanol-colirio', 'conjunctivitis', 48, 18);
  assert.equal(ocular.amount, 1);
  assert.equal(ocular.site, 'eye');
  assert.equal(ocular.daily, undefined);
});

test('Modo manual divide mg/kg/dia e aplica o menor dos tetos informados', () => {
  const data = { ageMonths: 72, kg: 20, basis: 'kgDay', quantity: 30, times: 3, concentration: 50 };
  assert.equal(manual(data).amount, 200);
  assert.equal(manual(data).ml, 4);
  assert.equal(manual({ ...data, maxDose: 180, maxDaily: 480 }).amount, 160);
  assert.equal(manual({ ...data, maxDose: 180, maxDaily: 480 }).daily, 480);
  assert.equal(manual({ ...data, maxDose: 150, maxDaily: 480 }).amount, 150);
  assert.equal(manual({ ...data, maxDose: 150, maxDaily: 480 }).capped, true);
  assert.equal(manual({ ...data, basis: 'kgDose', quantity: 10 }).amount, 200);
  assert.equal(manual({ ...data, basis: 'fixedDose', quantity: 42 }).amount, 42);
  assert.equal(manual({ ...data, basis: 'fixedDay', quantity: 42 }).amount, 14);
});

test('Modo manual rejeita dados inválidos e não ignora limites de idade', () => {
  const data = { ageMonths: 0, kg: 3, basis: 'kgDose', quantity: 2, times: 2 };
  assert.equal(manual(data).daily, 12);
  assert.equal(manual({ ...data, minAge: 1 }).error, 'ageOutside');
  assert.equal(manual({ ...data, ageMonths: 7, maxAge: 6 }).error, 'ageOutside');
  assert.equal(manual({ ...data, minAge: 5, maxAge: 2 }).error, 'limitsInvalid');
  assert.equal(manual({ ...data, concentration: 0 }).error, 'limitsInvalid');
  assert.equal(manual({ ...data, ageMonths: 10.5 }).error, 'patientInvalid');
  assert.equal(manual({ ...data, kg: 0 }).error, 'patientInvalid');
  assert.equal(manual({ ...data, basis: 'toString' }).error, 'manualInvalid');
  assert.equal(manual({ ...data, times: 1.5 }).error, 'manualInvalid');
});
