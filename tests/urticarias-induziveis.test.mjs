import test from 'node:test';
import assert from 'node:assert/strict';
import uci from '../urticarias-induziveis.js';
import { readFileSync } from 'node:fs';

const subtype=id=>uci.subtypes.find(item=>item.id===id);
test('UCInd separa seis formas físicas e três não físicas com fichas operacionais completas',()=>{
  assert.equal(new Set(uci.subtypes.map(item=>item.id)).size,9);
  assert.equal(uci.subtypes.filter(item=>item.group==='fisicas').length,6);
  assert.equal(uci.subtypes.filter(item=>item.group==='nao-fisicas').length,3);
  for(const item of uci.subtypes){
    assert.ok(item.tests.length);
    for(const method of item.tests){
      for(const field of ['material','site','reading','positive','threshold','negative','safety']){
        assert.ok(method[field]?.length>20,`${item.id}: ${field} precisa ser resolutivo`);
      }
      assert.ok(method.steps.length>=2);
      assert.ok(method.references.length>=2);
      for(const id of method.references)assert.match(uci.references[id]?.url||'',/^https:\/\//);
    }
  }
});
test('frio distingue maior temperatura de menor tempo de provocação e evita imersão',()=>{
  const cold=subtype('frio').tests[0];
  assert.match(cold.threshold,/temperatura mais alta/);
  assert.match(cold.threshold,/menor tempo/);
  assert.match(cold.reading,/10 minutos após retirar/);
  assert.match(cold.safety,/Não usar.*imersão/);
});
test('fototeste usa dose urticariante e não eritema como critério de positividade',()=>{
  const solar=subtype('solar').tests[0];
  assert.match(solar.threshold,/Dose urticariante mínima/);
  assert.match(solar.threshold,/Não confundir.*eritematosa/);
  assert.match(solar.positive,/Urtica palpável/);
  assert.match(solar.steps.join(' '),/dose ÷ irradiância/);
  assert.match(solar.negative,/espectro/);
});
test('pressão tardia exige leitura em horas e registro de área e carga',()=>{
  const pressure=subtype('pressao').tests[0];
  assert.match(pressure.reading,/6 horas/);
  assert.match(pressure.reading,/imediata isolada não exclui/);
  assert.match(pressure.threshold,/área e duração/);
});
test('colinérgica não exige aumento térmico do banho para positividade no exercício',()=>{
  const [exercise,passive]=subtype('colinergica').tests;
  assert.match(exercise.steps.join(' '),/15 bpm a cada 5 minutos/);
  assert.match(exercise.steps.join(' '),/Interromper ao surgirem urticas/);
  assert.match(exercise.threshold,/critério do aquecimento passivo/);
  assert.doesNotMatch(exercise.positive,/1 °C/);
  assert.match(passive.steps.join(' '),/24 horas/);
  assert.match(passive.steps.join(' '),/42 °C/);
});
test('contato mantém quatro técnicas e não transforma sensibilização em causalidade',()=>{
  const contact=subtype('contato');
  assert.equal(contact.tests.length,4);
  assert.match(contact.introduction,/Prick positivo demonstra sensibilização/);
  const [,prick,,scratch]=contact.tests;
  assert.match(prick.positive,/≥3 mm maior que o controle negativo/);
  assert.match(prick.positive,/Não exigir.*metade/);
  assert.match(prick.negative,/não interpretável/);
  assert.match(scratch.steps[0],/Não é etapa obrigatória/);
  assert.match(scratch.positive,/Não transportar automaticamente/);
  assert.match(scratch.safety,/Não é alternativa mais segura/);
});
test('aba e seus recursos estão integrados à versão instalada, com expansões nativas',()=>{
  const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const sw=readFileSync(new URL('../sw.js',import.meta.url),'utf8');
  const source=readFileSync(new URL('../urticarias-induziveis.js',import.meta.url),'utf8');
  assert.equal((index.match(/id="eaaci-16"/g)||[]).length,1);
  assert.match(index,/data-ego="eaaci-16"/);
  for(const file of ['urticarias-induziveis.js','urticarias-induziveis.css']){
    assert.ok(index.includes(file)); assert.ok(sw.includes(file));
  }
  assert.match(source,/el\('details', 'uci-card'\)/);
  assert.match(source,/panel.hidden = index !== 0/);
  assert.match(source,/ArrowRight/);
  assert.match(uci.reportTemplate,/CRM-MG 59\.766 \| RQE 48\.720/);
  assert.match(uci.reportTemplate,/inconclusivo/);
});
