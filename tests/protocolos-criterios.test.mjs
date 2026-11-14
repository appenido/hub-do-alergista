import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../protocolos-bolso-condutas-20261114.js', import.meta.url),'utf8');
function parseObject(name){
  const pattern = new RegExp('const '+name+'=(\\{[^\\n]*\\});');
  const match = src.match(pattern);
  assert.ok(match,'Fonte de dados ausente: '+name);
  return JSON.parse(match[1]);
}
const protocols=parseObject('DATA');
const criteria=parseObject('HUB_EXPLICIT_CRITERIA');
const references=parseObject('HUB_CRITERIA_REFERENCES');
const meds=parseObject('HUB_STEP_MEDS');
const flowMeds=parseObject('HUB_FLOW_MEDS');

test('todos os protocolos devem ter critérios visíveis para todas as etapas',()=>{
  assert.equal(Object.keys(protocols).length,16);
  assert.deepEqual(Object.keys(criteria).sort(),Object.keys(protocols).sort());
  for(const [id,protocol] of Object.entries(protocols)){
    assert.equal(criteria[id].length,protocol.steps.length,'Cobertura incompleta no protocolo '+id);
    assert.ok(protocol.flow.includes('→'),'Fluxo clínico ausente: '+id);
    assert.ok(!/profilaxia conforme risco/iu.test(protocol.flow),'Risco sem critérios no fluxograma '+id);
    for(let i=0;i<protocol.steps.length;i++){
      const details=criteria[id][i];
      assert.ok(Array.isArray(details)&&details.length>0,'Etapa sem explicação '+id+'/'+(i+1));
      assert.ok(typeof details[0]==='string'&&details[0].trim().length>=8,
        'Título do critério ausente '+id+'/'+(i+1));
      assert.ok(details.length>=2,'Etapa sem conduta explicada '+id+'/'+(i+1));
      for(const explanation of details.slice(1)){
        assert.ok(typeof explanation==='string'&&explanation.trim().length>40,
          'Explicação clínica insuficiente '+id+'/'+(i+1));
      }
    }
    assert.match(references[id][1],/^https:\/\/\S+$/,'Referência inválida '+id);
  }
});
test('AEH deve declarar critérios de profilaxia e não só adjetivos de risco',()=>{
  const hae=criteria['3'][6].join(' ').toLocaleLowerCase('pt-BR');
  for(const concept of ['frequência','gravidade','laring','qualidade de vida','resgate','consulta']){
    assert.ok(hae.includes(concept),'AEH sem '+concept);
  }
  assert.ok(criteria['3'][5].join(' ').includes('procedimento'),'Profilaxia curta sem indicações explícitas');
});
test('posologia e referências continuam no fluxo e todas as expansões apontam para etapas existentes',()=>{
  assert.ok(src.includes('appendExplicitCriteria(li,id,index)'),'Critérios não visíveis no cartão');
  assert.ok(src.includes('appendMedicines(li,meds)'),'Medicamentos não expansíveis');
  for(const [id,steps] of Object.entries(meds)){
    for(const [step,items] of Object.entries(steps)){
      assert.ok(protocols[id]&&Number(step)>=1&&Number(step)<=protocols[id].steps.length);
      for(const item of items){
        assert.equal(item.length,4,'Todo medicamento deve ter referência posológica específica');
        assert.ok(Array.isArray(item[3])&&item[3].length===2,'Referência posológica deve estar vinculada');
        assert.match(item[3][1],/^https:\/\//,'A fonte deve conter URL válida');
        assert.doesNotMatch(item[1],/\\b(?:conforme|verificar|sem dose|avaliar)\\b/iu,'Dose genérica não permitida');
        assert.ok(item.length===3||item.length===4,'Medicamento precisa de nome, dose, observação e fonte opcional');
        assert.ok(item.slice(0,3).every(x=>typeof x==='string'&&x.trim().length>0));
        if(item[3]){
          assert.ok(Array.isArray(item[3])&&item[3].length===2);
          assert.match(item[3][1],/^https:\/\//);
        }
      }
    }
  }
  for(const [id,nodes] of Object.entries(flowMeds)){
    const count=protocols[id].flow.split(/\s*→\s*/u).length;
    for(const [index,steps] of Object.entries(nodes)){
      assert.ok(Number(index)<count,'Nó de fluxo inexistente '+id+'/'+index);
      for(const step of steps)assert.ok(meds[id]?.[String(step)],'Nó sem medicamentos relacionados '+id+'/'+index);
    }
  }
});