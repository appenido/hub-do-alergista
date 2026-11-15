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
        const separateWeights = row.maxKg != null && next.minKg != null && row.maxKg < next.minKg;
        assert.ok(!overlapAge || !overlapUse || sameBoundary || separateWeights, id);
      }
    }
  }
});

test('Dipirona retorna uma única dose inicial pelo peso, com unidade e teto diário', () => {
  const oral = dose('novalgina-solucao', 'painFever', 96, 26);
  const drops = dose('novalgina-gotas', 'painFever', 96, 26);
  assert.equal(oral.amount, 260);
  assert.equal(oral.ml, 5.2);
  assert.equal(oral.maxDaily, 1040);
  assert.equal(drops.amount, 275);
  assert.equal(drops.drops, 11);
  assert.equal(drops.wholeDropApplied, true);
  assert.equal(drops.maxDaily, 1100);
  for (const result of [oral, drops]) {
    assert.equal(result.times, 4);
    assert.equal(result.intervalHours, 6);
    assert.equal(result.guidance, 'sbpFebre');
    assert.equal(result.asNeeded, true);
    assert.equal(result.daily, undefined);
    assert.equal(result.minAmount, undefined);
  }
});

test('Dipirona respeita elegibilidade, limites de bula e dose adulta inicial', () => {
  assert.equal(dose('novalgina-gotas', 'painFever', 2, 6).error, 'dipyroneLiquid');
  assert.equal(dose('novalgina-gotas', 'painFever', 3, 4.99).error, 'dipyroneLiquid');
  assert.equal(dose('novalgina-solucao', 'painFever', 36, 15).ml, 3);
  assert.equal(dose('novalgina-solucao', 'painFever', 36, 15.5).ml, 3.75);
  assert.equal(dose('novalgina-solucao', 'painFever', 36, 12).labelMinimumApplied, true);
  assert.equal(dose('novalgina-gotas', 'painFever', 36, 15.5).drops, 7);
  assert.equal(dose('novalgina-gotas', 'painFever', 180, 25).error, 'dipyroneLiquid');
  assert.equal(dose('novalgina-gotas', 'painFever', 220, 25).error, 'dipyroneLiquid');
  assert.equal(dose('novalgina-500', 'painFever', 179, 55).error, 'dipyroneAdult');
  const adult = dose('novalgina-1g', 'painFever', 180, 55);
  assert.equal(adult.amount, 500);
  assert.equal(adult.tablets, 0.5);
  assert.equal(adult.maxDaily, 2000);
  assert.equal(adult.guidance, 'emaDipirona');
});

test('Todos os pesos pediátricos a partir de 5 kg resultam em dose mensurável dentro da referência', () => {
  for (const id of ['novalgina-solucao', 'novalgina-gotas']) {
    for (let cents = 500; cents <= 5300; cents++) {
      const kg = cents / 100;
      const result = dose(id, 'painFever', 36, kg);
      assert.equal(result.error, undefined, id + ' / ' + kg);
      assert.ok(result.amount >= 10 * kg - 1e-10 && result.amount <= 16 * kg, id + ' / ' + kg);
      assert.equal(result.maxDaily, result.amount * 4);
      if (id.endsWith('gotas')) assert.equal(result.amount, result.drops * 25);
    }
  }
});

test('A lista da CMED conserva apresentações distintas do mesmo produto', () => {
  const { date, items } = JSON.parse(readFileSync(new URL('../data/medicamentos-apresentacoes.json', import.meta.url), 'utf8'));
  assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
  const [, , forms] = items.find(([active, name]) => active === 'DIPIRONA MONOIDRATADA' && name === 'NOVALGINA');
  for (const strength of ['50 MG/ML SOL OR', '500 MG/ML SOL OR GOTAS', '500 MG/ML SOL INJ', '500 MG COM', '1 G COM']) {
    assert.ok(forms.includes(strength), strength);
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
