import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('calendários separam nome, descrição e orientação clínica',()=>{
 const c=read('calendarios-imunizacoes.js');
 for(const field of ['data-vac-title','vac-nat-item-title','vac-nat-item-subtitle','vac-nat-clinical-label','vac-nat-clinical-text'])assert.ok(c.includes(field),field);
 assert.ok(read('vacinas-criterios.js').includes("summary.querySelector('.vac-nat-item-title')"));
 assert.ok(read('hub-paginas.js').includes('native.dataset.vacTitle'));
});
test('resultados e catálogo têm hierarquia visual e espaçamento próprios',()=>{
 const h=read('index.html'),c=read('hub-paginas.css');
 for(const field of ['vac-result-name','vac-result-dose','vac-result-motive','vac-menu-icon'])assert.ok(h.includes(field),field);
 assert.ok(c.includes('word-spacing:normal!important'));
 assert.ok(c.includes('.vac-nat-card-copy'));
 assert.ok(c.includes('body.hub-content-page #page-imunizacoes .hub-route-target > summary {display:none!important;}'));
});
