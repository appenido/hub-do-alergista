import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditarFontesDose } from './auditar-fontes-dose.mjs';
import { createRequire } from 'node:module';

const root=process.cwd();
const source=readFileSync(resolve(root,'protocolos-bolso-condutas-20261114.js'),'utf8');
const baseline=JSON.parse(readFileSync(resolve(root,'data/baseline-lacunas-clinicas.json'),'utf8'));
function parseObject(name) {
  const marker='const '+name+'=';
  const start=source.indexOf(marker);
  if(start<0)throw new Error('Objeto clínico não localizado: '+name);
  const serialized=source.slice(start+marker.length).split('\n')[0].replace(/;\s*$/,'');
  return JSON.parse(serialized);
}
const data=parseObject('DATA');
const meds=parseObject('HUB_STEP_MEDS');
const criteria=parseObject('HUB_EXPLICIT_CRITERIA');
const refs=parseObject('HUB_CRITERIA_REFERENCES');
const generic=/(?:\bconforme\b|\bverificar\b|\bsem dose\b|\bavaliar\b|\bdose alta otimizada\b|\bposologia conforme\b)/iu;
const issues=[];
// As fichas de provocação integram a mesma auditoria diária dos protocolos.
// Uma validação estática não altera a data da revisão científica.
const uci=createRequire(import.meta.url)('../urticarias-induziveis.js');
for(const subtype of uci.subtypes){
 for(const [index,method] of subtype.tests.entries()){
  const key='uci:'+subtype.id+':'+index;
  for(const field of ['material','site','reading','positive','threshold','negative','safety']){
   if(!method[field]?.trim())issues.push({key:key+':'+field,priority:'P0',protocol:'UCInd',topic:subtype.title,description:'Ficha de provocação sem '+field});
  }
  if(!method.steps?.length)issues.push({key:key+':steps',priority:'P0',protocol:'UCInd',topic:subtype.title,description:'Teste sem execução explícita'});
  if(!method.references?.length||method.references.some(id=>!uci.references[id]?.url?.startsWith('https://'))){
   issues.push({key:key+':source',priority:'P1',protocol:'UCInd',topic:subtype.title,description:'Teste sem referência verificável'});
  }
 }
}
for(const [pid,steps] of Object.entries(meds)){
 for(const [step,items] of Object.entries(steps)){
  const topic=data[pid]?.steps?.[Number(step)-1]?.[0]||'Etapa não identificada';
  for(const item of items){
   const [drug,dose,comment,reference]=item;
   const key=pid+'|'+step+'|'+drug.toLocaleLowerCase('pt-BR');
   if(generic.test(dose)){
    issues.push({key,priority:'P1',protocol:pid,step,topic,drug,dose,description:'Posologia não resolutiva. Substituir por critérios explícitos, tabela de peso/idade ou justificativa objetiva de dose variável.',reference:reference?.[1]||null});
   }
   if(!dose||!drug||!comment)issues.push({key:key+':incompleto',priority:'P0',protocol:pid,step,topic,drug,dose,description:'Medicamento sem descrição, dose ou nome.'});
   if(!reference||!Array.isArray(reference)||reference.length!==2||!/^https:\/\//.test(reference[1])){
     issues.push({key:key+':sem-fonte',priority:'P1',protocol:pid,step,topic,drug,dose,description:'Medicamento sem fonte verificável diretamente vinculada à posologia.'});
   }
  }
 }
}
for(const [pid,p] of Object.entries(data)){
 const details=criteria[pid];
 if(!details||details.length!==p.steps.length)issues.push({key:'criteria:'+pid,priority:'P0',protocol:pid,description:'Etapas sem cobertura de critérios clínicos completos'});
 if(!refs[pid]?.[1]?.startsWith('https://'))issues.push({key:'source:'+pid,priority:'P1',protocol:pid,description:'Referência científica do protocolo ausente'});
}
issues.sort((a,b)=>a.key.localeCompare(b.key,'pt-BR'));
const original=new Set(baseline.entries);
const currentKeys=new Set(issues.map(x=>x.key));
const newIssues=issues.filter(x=>!original.has(x.key));
const resolved=baseline.entries.filter(k=>!currentKeys.has(k));
const verificaBulas = ['schedule', 'workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME) || process.argv.includes('--verificar-bulas');
const fontesDose = verificaBulas ? await auditarFontesDose() : [];
const pendenciasBulas = fontesDose.filter(fonte => fonte.status !== 'inalterada');
const summary={
 date:new Date().toISOString(),
 protocols:Object.keys(data).length+1,
 provocationSubtypes:uci.subtypes.length,
 provocationMethods:uci.subtypes.reduce((sum,subtype)=>sum+subtype.tests.length,0),
 provocationReviewedAt:uci.reviewedAt,
 clinicalSteps:Object.values(data).reduce((v,x)=>v+x.steps.length,0),
 therapeuticOptions:Object.values(meds).reduce((v,x)=>v+Object.values(x).reduce((n,y)=>n+y.length,0),0),
 outstanding:issues.length+pendenciasBulas.length, newIssues:newIssues.length, resolved:resolved.length,
 ...(verificaBulas ? { bulasConsultadas: fontesDose.length, pendenciasBulas: pendenciasBulas.length } : {})
};
const header='# Auditoria automática — protocolos clínicos\n\n'+
 'Executada em '+summary.date+' (UTC). Esta etapa é uma análise estática do código. NÃO valida atualização científica, registro Anvisa, cobertura ANS nem funcionamento visual em produção.\n\n'+
 '| Indicador | Resultado |\n|---|---:|\n'+
 '| Protocolos | '+summary.protocols+' |\n'+
 '| Subtipos / métodos de provocação UCInd | '+summary.provocationSubtypes+' / '+summary.provocationMethods+' |\n'+
 '| Última revisão científica das fichas UCInd | '+summary.provocationReviewedAt+' |\n'+
 '| Etapas clínicas | '+summary.clinicalSteps+' |\n'+
 '| Opções de medicamentos/classes | '+summary.therapeuticOptions+' |\n'+
 '| Pendências em aberto | '+summary.outstanding+' |\n'+
 '| Novas pendências | '+summary.newIssues+' |\n'+
 '| Pendências resolvidas desde a linha de base | '+summary.resolved+' |\n\n';
const detail=issues.length
 ? issues.map((x,i)=>(i+1)+'. ['+x.priority+'] '+(x.drug||'Critério')+' · protocolo '+x.protocol+' · etapa '+(x.step||'-')+' · '+(x.topic||'—')+'\n   Campo: '+(x.dose||'—')+'\n   Pendência: '+x.description).join('\n\n')
 : 'Nenhuma expressão genérica identificada pelo detector estático.';
const bulasReport = verificaBulas ? '\n\n## Fontes do cálculo de dose\n\n'+
 'Documentos inalterados: '+(fontesDose.length-pendenciasBulas.length)+' de '+fontesDose.length+
 '. Arquivos alterados ou indisponíveis entram em revisão, e a calculadora mantém a última posologia conferida.\n\n'+
 pendenciasBulas.map(fonte => '- ['+fonte.name+']('+fonte.url+') · '+fonte.status).join('\n') : '';
const report=header+'## Pendências\n\n'+detail+bulasReport+'\n\n## Política de resolução\n\n'+
 'A substituição exige bula/registro Anvisa e/ou diretriz específica, indicação e idade/peso, posologia completa, fonte e revisão clínica. Não preencher automaticamente lacunas com doses inferidas. Conferir o prompt AUDITORIA-CLINICA-PROMPT-MESTRE.md.\n';
const output=resolve(root,'audit-output');
mkdirSync(output,{recursive:true});
writeFileSync(resolve(output,'relatorio-clinico.md'),report);
writeFileSync(resolve(output,'relatorio-clinico.json'),JSON.stringify({summary,issues,newIssues,resolved,fontesDose},null,2)+'\n');
process.stdout.write(JSON.stringify(summary)+'\n');
if(process.argv.includes('--fail-on-new')&&newIssues.length>0){
 console.error('BLOQUEIO: foram introduzidas novas pendências clínicas sem resolução.');
 process.exitCode=1;
}
