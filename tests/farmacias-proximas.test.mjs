import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const index=read('index.html');
const client=read('farmacias-precos.js');
const nearby=read('farmacias-proximas-ui.js');
const places=read('functions/api/farmacias-proximas.js');
const prices=read('functions/api/farmacias-precos.js');
const privacy=read('privacidade.html');
test('página carrega consulta de preços e farmácias mais próximas',()=>{
  assert.match(index,/src="\/farmacias-precos\.js\?/);
  assert.match(index,/src="\/farmacias-proximas-ui\.js\?/);
  assert.match(client,/\[data-hub-medicamento\] \.hub-med-nome/);
  assert.match(client,/#page-imuno \.bio-card \.bio-name/);
  assert.match(client,/#ahApp \.ah-card-name/);
});
test('o cifrão abre a ficha de Medicamentos no próprio details',()=>{
  assert.match(client,/if \(card\.matches\('details'\)\) card\.open = true/);
  assert.match(nearby,/className='hub-proximas'/);
});
test('geolocalização precisa é voluntária, sem armazenamento persistente',()=>{
  assert.match(nearby,/getCurrentPosition/);
  assert.match(nearby,/data-near-gps/);
  assert.doesNotMatch(nearby,/localStorage/);
  assert.doesNotMatch(nearby,/sessionStorage/);
  assert.match(privacy,/visitante pode optar por autorizar a localização/);
});
test('distância não é confundida com distância rodoviária',()=>{
  assert.match(places,/haversineKm/);
  assert.match(places,/distanceType:'linha reta'/);
  assert.match(nearby,/linha reta, não distância de percurso/);
});
test('preço depende de verificação da farmácia física e de atualização',()=>{
  assert.match(nearby,/offer\.verified/);
  assert.match(nearby,/storeLat/);
  assert.match(nearby,/storeLon/);
  assert.match(nearby,/Date\.now\(\)-updated>86400000/);
  assert.match(prices,/HUB_PRECOS_API_URL/);
  assert.match(prices,/HUB_PRECOS_API_KEY/);
  assert.match(prices,/storeAddress/);
  assert.doesNotMatch(prices,/Math\.random/);
});
test('Google consulta preço por link e nunca finge fornecer preço automático',()=>{
  assert.match(nearby,/google\.com\/search\?q=/);
  assert.match(nearby,/Preço nesta unidade: não confirmado/);
  assert.match(places,/places\.googleMapsUri/);
  assert.match(places,/overpass-api\.de/);
  assert.match(nearby,/OpenStreetMap/);
});