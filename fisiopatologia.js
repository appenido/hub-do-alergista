/* Hub do Alergista — módulo de fisiopatologia. Revisão científica 26/11/2026. */
(function(){
'use strict';
if(window.HubFisiopatologia)return;
window.HubFisiopatologia=true;
const gina='https://ginasthma.org/wp-content/uploads/2026/06/GINA-Severe-Asthma-Guide-2026-WEB-WMS.pdf';
const sources=[
['GINA 2026 — guia de asma grave, figura 4 (p. 12), pp. 18–25 e 33',gina],
['Pavord et al. 2023 — análise post hoc do QUEST','https://pubmed.ncbi.nlm.nih.gov/36535524/'],
['Revisão sistemática de preditores de resposta aos biológicos','https://pubmed.ncbi.nlm.nih.gov/40956008/'],
['Biomarcadores e mecanismos dos biológicos na asma T2','https://pmc.ncbi.nlm.nih.gov/articles/PMC11742565/'],
['VESTIGE — ensaio de fase 4, 2025','https://pubmed.ncbi.nlm.nih.gov/39947221/'],
['VESTIGE — análise de carga de muco, 2026','https://pubmed.ncbi.nlm.nih.gov/41145399/'],
['Revisão sistemática: biológicos e tampões mucosos','https://pmc.ncbi.nlm.nih.gov/articles/PMC12906045/'],
['Anvisa — registro do depemoquimabe, maio de 2026','https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-autoriza-novo-medicamento-biologico-para-doencas-respiratorias']
];
const icon='<svg viewBox="0 0 64 64" class="q-illustration" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true"><circle cx="32" cy="12" r="7" fill="#d4af60" stroke="#a4792e" stroke-width="2"/><path d="M32 19v8M32 27L15 38M32 27l17 11" stroke="#20475e" stroke-width="3" stroke-linecap="round"/><circle cx="15" cy="44" r="12" fill="#f3e4f5" stroke="#8c4b91" stroke-width="2"/><path d="M10 41c-5 6 2 10 5 5 3 5 10 1 5-5-2-3-4-1-5 1-1-2-3-4-5-1Z" fill="#92519a"/><circle cx="49" cy="44" r="12" fill="#d5eef0" stroke="#187f86" stroke-width="2"/><path d="M43 49V39m6 10V36m6 13V39" stroke="#187f86" stroke-width="3" stroke-linecap="round"/><path d="M4 59h56" stroke="#c8a45e" stroke-width="2" stroke-linecap="round"/></svg>';
const rows=[
['Eosinófilos no sangue','Habitualmente elevados','Podem estar elevados'],
['FeNO','Variável','Frequentemente elevado'],
['Idade de início','Início adulto favorece resposta anti-IL-5/5R','Qualquer idade'],
['Atopia / IgE','Variáveis','Atopia pode coexistir; IgE não diferencia isoladamente'],
['Exacerbações','Histórico frequente favorece resposta anti-IL-5/5R','Também frequentes'],
['Polipose nasal','Frequente','Frequente; não discrimina'],
['Dermatite atópica / EoE','Não seleciona especificamente este alvo','Comorbidades podem favorecer dupilumabe, se indicado'],
['Muco / tampões','Eosinófilos participam da formação','IL-13 participa da hipersecreção; não é específico'],
['GEPA','Considerar terapia anti-IL-5/5R com indicação específica','Investigar GEPA antes da escolha; cautela com dupilumabe'],
['Corticoide oral de manutenção','Pode responder','Pode responder']
];
const cases=[
[850,12,'Sinal eosinofílico forte; considerar anti-IL-5/5R entre opções elegíveis.'],
[100,85,'FeNO alto; considerar anti-IL-4Rα ou anti-TSLP; excluir supressão da eosinofilia.'],
[850,85,'Dois marcadores altos; sobreposição. Comorbidades e objetivos orientam a escolha.'],
[450,18,'Sinal eosinofílico com FeNO baixo; considerar anti-IL-5/5R.'],
[200,70,'FeNO alto com eosinofilia intermediária; não excluir anti-IL-5/5R.'],
[80,10,'Marcadores baixos; investigar supressão farmacológica ou T2-low.'],
[1800,65,'Hipereosinofilia: investigar causas antes da escolha do biológico.']
];
function table(head,rows){return '<div class="fp-table-wrap" tabindex="0"><table><thead><tr>'+head.map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((x,i)=>i===0?'<th scope="row">'+x+'</th>':'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
function section(title,content){return '<section class="fp-section"><h3>'+title+'</h3>'+content+'</section>';}
function interpret(e,f,h,supp){
if(!Number.isFinite(e)||!Number.isFinite(f)||e<0||f<0||!Number.isFinite(h)||h<0)return 'Informe valores numéricos não negativos.';
if(Math.max(e,h)>=1500)return 'Alerta: eosinofilia atual ou histórica ≥1.500/µL. Investigar GEPA, parasitoses, ABPA e outras causas conforme contexto. GINA não aconselha iniciar dupilumabe para asma nesse cenário. Não selecionar automaticamente um biológico.';
let out='';
if(e>=300&&f>=50)out='Sinais T2 concomitantes: eosinofilia e FeNO altos. Considerar anti-IL-5/5R, anti-IL-4Rα e anti-TSLP conforme elegibilidade, comorbidades e objetivo.';
else if(e>=300&&f<25)out='Sinal eosinofílico com FeNO baixo. Anti-IL-5/5R é uma possibilidade entre os elegíveis; FeNO baixo não exclui outras vias.';
else if(f>=50&&e<300)out='Sinal epitelial associado a FeNO alto. Anti-IL-4Rα ou anti-TSLP são possibilidades; anti-IL-5/5R continua possível conforme eosinofilia histórica e critérios locais.';
else if(e<150&&f<25)out='Biomarcadores baixos: reavaliar supressão por corticoide/biológico e repetir quando adequado; T2-low não está confirmado. Anti-TSLP pode ser considerado se elegível.';
else out='Perfil intermediário: marcadores não permitem separar os eixos. Avaliar tendência histórica, comorbidades e resposta esperada.';
if(h>=300&&e<300)out+=' Eosinofilia histórica ≥300/µL deve ser considerada.';
if(supp)out+=' Atenção: terapia atual pode modificar os marcadores; não interpretar como fenótipo basal.';
return out;
}
window.HubFisiopatologiaInterpretar=interpret;
function init(){
const grid=document.querySelector('#page-dashboard .quick-grid'), scroll=document.querySelector('.scroll-area');
if(!grid||!scroll||document.getElementById('page-fisiopatologia'))return;
if(typeof PAGE_TITLES!=='undefined')PAGE_TITLES.fisiopatologia='Fisiopatologia';
const card=document.createElement('div');card.className='qcard';card.dataset.nav='fisiopatologia';card.setAttribute('role','button');card.setAttribute('aria-label','Abrir Fisiopatologia');card.tabIndex=0;
card.innerHTML='<div class="qi qi-teal">'+icon+'</div><div class="ql">Fisiopatologia</div>';
card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.navTo('fisiopatologia');}});
const fav=grid.querySelector('[data-nav="favoritos"]');grid.insertBefore(card,fav||null);
const page=document.createElement('div');page.className='page';page.id='page-fisiopatologia';
page.innerHTML='<header class="fp-header"><span class="fp-icon">'+icon+'</span><div><h1>Fisiopatologia</h1><p>Imunologia aplicada à prática clínica</p></div></header><details class="fp-topic" id="fp-via-th2"><summary><span class="fp-summary-title">Via Th2 (IL-5 × IL-4/13)<small>Asma grave · inflamação tipo 2 · biomarcadores e terapias-alvo</small></span><span class="fp-chevron" aria-hidden="true">⌄</span></summary><div class="fp-body"><p class="fp-note">Síntese para profissionais de saúde · revisão bibliográfica: 26/11/2026. Th2 é parte da inflamação T2, que também inclui ILC2. Não existe teste validado para atribuir predominância molecular individual de IL-5 ou IL-4/IL-13. Sintomas isolados não diferenciam essas vias.</p>'+
section('1. Diferenças fisiopatológicas','<div class="fp-pathways"><div class="fp-origin">Epitélio · alérgenos e alarminas (TSLP, IL-33, IL-25)<br>Th2 / ILC2</div><div class="fp-branch fp-il5"><h4>IL-5</h4><p>Maturação, ativação e sobrevivência dos eosinófilos.</p><p>Marcador indireto: eosinófilos no sangue.</p><p>Alvos: mepolizumabe, benralizumabe (IL-5Rα) e depemoquimabe (registro Anvisa; disponibilidade comercial não verificada).</p></div><div class="fp-branch fp-il4"><h4>IL-4 / IL-13</h4><p>IL-4: diferenciação Th2 e troca de classe para IgE. IL-13: iNOS epitelial, FeNO, mucinas e hiperreatividade. Ambas contribuem para o recrutamento tecidual de eosinófilos.</p><p>Alvo: dupilumabe (IL-4Rα). Tezepelumabe atua a montante, sobre TSLP, não diretamente em IL-13.</p></div></div><p>Há interação entre os eixos; eosinofilia e FeNO são dimensões parcialmente distintas, não medidas diretas das citocinas.</p>')+
section('2. Como diferenciar clinicamente?',table(['Característica','Eixo IL-5','Eixo IL-4/IL-13'],rows)+'<p>Tosse, sibilância, dispneia, sintomas noturnos e produção de muco não definem o endótipo. Comorbidades e histórico ajudam a escolher o alvo, sem provar predominância da via.</p>')+
section('3. Matriz FeNO × eosinófilos','<div class="fp-matrix"><div><strong>FeNO alto + eosinofilia menor</strong><p>Sinal epitelial associado</p></div><div><strong>FeNO alto + eosinofilia alta</strong><p>Sobreposição T2</p></div><div><strong>Ambos baixos</strong><p>Investigar supressão / T2-low</p></div><div><strong>Eosinofilia alta + FeNO baixo</strong><p>Sinal eosinofílico</p></div></div><p>Cortes ilustrativos para adultos/adolescentes: eosinófilos ≥300/µL como sinal alto; FeNO ≥50 ppb como sinal alto e &lt;25 ppb como baixo. Valores intermediários não são binários. Não são critérios de endotipagem ou elegibilidade.</p>'+table(['Eosinófilos/µL','FeNO (ppb)','Interpretação didática'],cases)+'<form class="fp-form"><h4>Interpretador de biomarcadores</h4><div class="fp-fields"><label>Eosinófilos atuais (/µL)<input required type="number" min="0" step="1" name="eos" inputmode="numeric" autocomplete="off" placeholder="850"></label><label>FeNO (ppb)<input required type="number" min="0" step="any" name="feno" inputmode="decimal" autocomplete="off" placeholder="12"></label><label>Maior eosinofilia histórica (/µL), se conhecida<input type="number" min="0" step="1" name="hist" autocomplete="off" placeholder="Opcional"></label></div><label class="fp-check"><input type="checkbox" name="supp"> Corticoide sistêmico ou biológico pode estar modificando os resultados</label><button type="submit">Interpretar perfil</button> <button type="reset" class="fp-reset">Limpar</button><p class="fp-result" role="status" aria-live="polite">Preencha os marcadores para obter uma interpretação educacional.</p></form>')+
section('4. FeNO e resposta ao dupilumabe','<p>QUEST, análise post hoc de Pavord et al. (2023): redução relativa de exacerbações graves frente ao placebo, por FeNO basal.</p><div class="fp-bars">'+[['&lt;25 ppb',22.7],['25 a &lt;50 ppb',58.3],['≥50 ppb',69.3]].map(r=>'<div class="fp-bar-row"><span>'+r[0]+'</span><div class="fp-track"><div style="width:'+r[1]+'%"></div></div><strong>'+String(r[1]).replace('.',',')+'%</strong></div>').join('')+'</div><p>O FeNO forneceu informação preditiva além dos eosinófilos. O estudo não comparou dupilumabe diretamente a anti-IL-5/5R.</p>')+
section('5. GINA 2026 — preditores de resposta','<p>Resumo interpretativo da figura 4, p. 12. Os sinais + representam intensidade da associação, não uma pontuação terapêutica.</p>'+table(['Preditor','Anti-IL-5/5R','Anti-IL-4Rα','Anti-TSLP'],[['Eosinofilia elevada','+++','+++','+++'],['FeNO elevado','—','+++','+++'],['Exacerbações prévias','+++','—','—'],['Início adulto','++','—','—'],['Polipose nasal','++','++','++']])+'<p>—: não destacado nessa figura; não significa ausência de benefício. Considerar também anti-IgE na asma alérgica elegível. Critérios locais, exacerbações, preferência e comorbidades são essenciais.</p><a href="'+gina+'#page=12" target="_blank" rel="noopener noreferrer">GINA 2026 · Figura 4, p. 12 ↗</a>')+
section('6. Tomografia e tampões mucosos','<p>IL-13 favorece células caliciformes e MUC5AC; eosinófilos contribuem para alterações e persistência do muco. VESTIGE demonstrou redução de tampões após dupilumabe em pacientes T2 com ambos os biomarcadores elevados. Há evidências também para estratégias antieosinofílicas e anti-TSLP. FeNO alto com tampões reforça participação epitelial, sem especificidade molecular.</p>')+
section('7. Antes de interpretar os biomarcadores','<ul><li>Confirmar asma grave e otimização da técnica e adesão à terapia inalatória.</li><li>Rever valores históricos, uso recente de corticoide sistêmico e biológicos; repetir os marcadores até três vezes quando necessário.</li><li>Considerar escarro induzido quando disponível; dosagens séricas de IL-4/5/13 não são ferramentas validadas de seleção.</li><li>Investigar causas não asmáticas de eosinofilia, inclusive Strongyloides, conforme contexto; ≥1.500/µL exige avaliar GEPA e outras causas de hipereosinofilia.</li><li>GINA 2026, p. 33: não aconselha iniciar dupilumabe para asma com eosinófilos atuais ou históricos ≥1.500/µL.</li></ul>')+
section('8. Perfis operacionais para raciocínio clínico','<div class="fp-profiles"><div><h4>Sinal eosinofílico</h4><p>Eosinofilia alta, FeNO baixo, exacerbações e possível início adulto.</p></div><div><h4>Sinal epitelial</h4><p>FeNO alto, eosinofilia proporcionalmente menor; considerar comorbidades de IL-4/13.</p></div><div><h4>T2 misto</h4><p>Ambos altos; dermatite atópica ou EoE podem favorecer dupilumabe; GEPA demanda avaliação específica; polipose não diferencia.</p></div><div><h4>Marcadores baixos</h4><p>Reavaliar terapia, diagnóstico e fenótipo; anti-TSLP pode ser uma opção se elegível.</p></div></div><p>Classificação didática não oficial da GINA. Não define diagnóstico, prescrição ou superioridade entre biológicos. Reavaliar resposta clínica e exacerbações após teste terapêutico apropriado.</p>')+
section('Referências científicas','<ol class="fp-refs">'+sources.map(r=>'<li><a href="'+r[1]+'" target="_blank" rel="noopener noreferrer">'+r[0]+' ↗</a></li>').join('')+'</ol>')+'</div></details>';
scroll.appendChild(page);
const form=page.querySelector('.fp-form'),result=form.querySelector('.fp-result');
form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);if(d.get('eos')===''||d.get('feno')==='')return;result.textContent=interpret(Number(d.get('eos')),Number(d.get('feno')),Number(d.get('hist')||0),d.has('supp'));});
form.addEventListener('reset',()=>{result.textContent='Preencha os marcadores para obter uma interpretação educacional.';});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();