import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const report = read('supabase/migrations/20261114_hub_geo_location_fidelity.sql');
const map = read('central-hub.js');
const cities = read('central-inteligencia.js');
const html = read('central-hub.html');

test('registros antigos sem município usam região sem inventar uma cidade',()=>{
  assert.match(report,/nullif\(btrim\(city\),''\)/);
  assert.match(report,/location_precision/);
  assert.match(report,/when region is not null then 'região'/);
  assert.match(report,/group by 1,2,3,4/);
});

test('mapa identifica grau de precisão para sessões antigas',()=>{
  assert.match(map,/cidade não registrada/);
  assert.match(map,/apenas por estado ou região/);
  assert.match(map,/function regiaoNome/);
  assert.doesNotMatch(map,/city\s*=\s*['"]Belo Horizonte['"]/);
});

test('relatórios e CSV não misturam cidade real com estado estimado',()=>{
  assert.match(cities,/somente estado\/região/);
  assert.match(cities,/location_precision/);
  assert.match(cities,/Estado\/região/);
  assert.match(cities,/Cidade ou estado\/região/);
  assert.match(html,/Cidades e regiões de origem/);
  assert.match(html,/Precisão/);
  assert.doesNotThrow(()=>new Function(map));
  assert.doesNotThrow(()=>new Function(cities));
});
