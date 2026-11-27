import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const window={};const document={readyState:'loading',addEventListener(){}};vm.runInNewContext(fs.readFileSync('fisiopatologia.js','utf8'),{window,document});
const f=window.HubFisiopatologiaInterpretar;
test('hipereosinofilia atual e histórica bloqueia sugestão automática',()=>{assert.match(f(1500,10,0,false),/Alerta/);assert.match(f(100,85,1500,false),/Alerta/)});
test('perfis operacionais',()=>{assert.match(f(850,12,0,false),/eosinofílico/);assert.match(f(100,85,0,false),/epitelial/);assert.match(f(850,85,0,false),/concomitantes/);assert.match(f(80,10,0,true),/suprim|supressão/);assert.match(f(200,30,0,false),/intermediário/);assert.match(f(-1,30,0,false),/não negativos/)});
test('integração e expansão local',()=>{assert.match(fs.readFileSync('index.html','utf8'),/fisiopatologia\.js/);assert.match(fs.readFileSync('hub-paginas.js','utf8'),/#page-formulasInfantis, #page-fisiopatologia/);assert.match(fs.readFileSync('sw.js','utf8'),/fisiopatologia\.css/)});
