/* Hub do Alergista | Apoio à seleção de biológicos para asma grave | revisão 09/11/2026 */
(function(){
  'use strict';
  var card=document.getElementById('eaaci-10');
  if(!card || document.getElementById('gbi-calculadora')) return;
  var body=card.querySelector('.eaaci-body');
  if(!body) return;
  var style=document.createElement('style');
  style.textContent='.gbi{margin:16px 0;border:1px solid #bed4da;border-radius:15px;background:#fff;overflow:hidden;color:#0d1f2d;font-family:Manrope,Arial,sans-serif;font-size:14px;line-height:1.55}.gbi *{box-sizing:border-box}.gbi-head{background:linear-gradient(110deg,#0d1f2d,#1a4a5c);color:white;padding:17px 19px}.gbi-head h3{margin:0 0 5px;font-size:19px;line-height:1.3;color:white}.gbi-head p{margin:0;color:#d3eef2;font-size:13px}.gbi-content{padding:17px}.gbi fieldset{margin:0 0 14px;padding:14px;border:1px solid #d9e6e9;border-radius:12px;min-width:0}.gbi legend{padding:0 7px;font-size:14px;font-weight:750;color:#1a4a5c}.gbi-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gbi label{display:block;font-size:13px;line-height:1.4;color:#203b49;font-weight:650}.gbi input[type=number],.gbi select{display:block;margin-top:6px;min-width:0;width:100%;height:43px;padding:9px 11px;border:1px solid #b9ccd5;border-radius:9px;background:#fff;font:inherit;font-size:15px;color:#0d1f2d}.gbi input:focus,.gbi select:focus{outline:2px solid #2d8fa8;outline-offset:1px}.gbi-note{font-size:12px;line-height:1.5;color:#516878;margin:9px 0 0}.gbi-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.gbi-checks label{display:flex;gap:9px;align-items:flex-start;border:1px solid #dce8e9;border-radius:9px;padding:11px;background:#f7fafb;font-size:13px}.gbi-checks input{flex-shrink:0;width:17px;height:17px;margin-top:2px;accent-color:#1f6980}.gbi-actions{display:flex;flex-wrap:wrap;gap:9px;margin:17px 0}.gbi-btn{min-height:43px;border:1px solid #1f6980;border-radius:10px;padding:10px 15px;background:#1f6980;color:#fff;cursor:pointer;font:700 13px Manrope,Arial,sans-serif}.gbi-btn-light{background:white;color:#1f6980}.gbi-result{border-top:1px solid #d9e6e9;padding-top:16px;margin-top:12px;scroll-margin-top:80px}.gbi-result h4{font-size:16px;line-height:1.35;margin:0 0 8px;color:#0d1f2d}.gbi-state{border-left:4px solid #1f6980;background:#eff8fa;padding:11px 13px;border-radius:8px;margin:8px 0 15px;font-size:13px}.gbi-state.warn{border-left-color:#a86e16;background:#fff8ec}.gbi-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.gbi-card{border:1px solid #d6e4e7;border-radius:11px;padding:13px;background:#fff}.gbi-card h5{font-size:14px;line-height:1.3;margin:0 0 4px;color:#183b4b}.gbi-card p{font-size:12px;line-height:1.55;margin:6px 0;color:#354d59}.gbi-status{display:inline-block;font-size:11px;border-radius:7px;padding:3px 7px;background:#eaf5f6;color:#195d6d;font-weight:700}.gbi-status.conditional{background:#fff4db;color:#8c5e0e}.gbi-status.no{background:#f2f3f5;color:#626c75}.gbi-list{margin:8px 0 10px;padding-left:19px;font-size:13px;line-height:1.6}.gbi-list li{margin-bottom:3px}.gbi-refs{border-top:1px solid #d9e6e9;margin-top:15px;padding-top:12px;font-size:12px;line-height:1.7}.gbi-refs a{color:#17667a;text-decoration:underline;overflow-wrap:anywhere}.gbi-ans{background:#f5f9fa;padding:12px 13px;border-radius:11px;margin-top:13px;border:1px solid #dde9eb}.gbi-small{color:#516878;font-size:12px;margin:6px 0}.gbi-hidden{display:none!important}@media(max-width:660px){.gbi-content{padding:12px}.gbi-head{padding:14px}.gbi-grid,.gbi-checks,.gbi-cards{grid-template-columns:1fr}.gbi fieldset{padding:12px}.gbi-head h3{font-size:17px}}@media(min-width:900px){.gbi{font-size:15px}.gbi label,.gbi-checks label{font-size:14px}.gbi input[type=number],.gbi select{font-size:16px}.gbi-card p{font-size:13px}}';
  document.head.appendChild(style);
  var mount=document.createElement('section');
  mount.id='gbi-calculadora';mount.className='gbi';
  mount.setAttribute('aria-label','Calculadora de elegibilidade e seleção de biológicos para asma grave');
  mount.innerHTML=[
    '<header class="gbi-head"><h3>Calculadora de biológicos para asma grave</h3>',
    '<p>Triagem clínica individualizada · GINA 2026 · com verificação separada das DUT da ANS</p></header>',
    '<div class="gbi-content"><form id="gbi-form" autocomplete="off">',
    '<fieldset><legend>1. Confirmar asma grave e tratamento otimizado</legend><div class="gbi-grid">',
    campo('confirmada','Diagnóstico de asma confirmado?',opSim()),
    campo('otimizada','Técnica inalatória, adesão, fatores modificáveis e comorbidades revisados?',opSim()),
    campo('alta','Tratamento otimizado para idade (CI-LABA em alta dose em adultos/adolescentes)?',opSim()),
    campo('sintomas','Persistem sintomas ou controle insuficiente?',opSim()),
    '</div><p class="gbi-note">GINA: biológico somente após confirmar asma grave, otimizar tratamento e avaliar inflamação do tipo 2, exacerbações e/ou necessidade de corticoide oral. O preenchimento não substitui avaliação especializada.</p></fieldset>',
    '<fieldset><legend>2. Dados clínicos e biomarcadores</legend><div class="gbi-grid">',
    numero('idade','Idade (anos)',0,110,1),
    numero('peso','Peso (kg)',1,350,'0.1'),
    numero('eos','Eosinófilos atuais (células/µL)',0,30000,1),
    numero('eosh','Maior eosinofilia nos últimos 12 meses (células/µL)',0,30000,1),
    numero('feno','FeNO (ppb)',0,300,1),
    numero('escarro','Eosinófilos no escarro induzido (%)',0,100,'0.1'),
    numero('vef1','VEF1 (% do previsto)',0,200,'0.1'),
    numero('ige','IgE total (UI/mL)',0,50000,1),
    numero('crises','Exacerbações tratadas com corticoide oral nos últimos 12 meses',0,40,1),
    numero('internacoes','Internações por exacerbação ≥24 h nos últimos 12 meses',0,20,1),
    campo('sens','Sensibilização comprovada a aeroalérgeno perene (SPT/IgE específica)',opSim()),
    campo('gatilho','Sintomas desencadeados por alérgenos clinicamente relevantes?',opSim()),
    campo('ocs','Uso de corticoide oral de manutenção atualmente?',opSim()),
    campo('ocs6','Uso contínuo de corticoide oral para asma nos últimos 6 meses?',opSim()),
    campo('ocsrec','Uso contínuo ou recorrente de corticoide oral (critério DUT 65.9)?',opSim()),
    campo('supressao','Biomarcadores coletados durante uso de corticoide sistêmico?',opSim()),
    campo('inicio','Início da asma',[
      ['','Não informado'],['infancia','Infância'],['adulta','Vida adulta']
    ]),
    campo('anterior','Biológico usado anteriormente',[
      ['','Nenhum / não informado'],['omalizumabe','Omalizumabe'],['mepolizumabe','Mepolizumabe'],['benralizumabe','Benralizumabe'],['depemoquimabe','Depemoquimabe'],['reslizumabe','Reslizumabe'],['dupilumabe','Dupilumabe'],['tezepelumabe','Tezepelumabe']
    ]),
    campo('resposta','Resposta ao biológico anterior',[
      ['','Não informada / não se aplica'],['boa','Boa resposta'],['parcial','Resposta parcial'],['nenhuma','Ausência de resposta']
    ]),
    campo('falta','Acesso ao biológico',[
      ['','Não informado'],['sim','Disponível'],['nao','Ainda não disponível']
    ]),
    '</div><p class="gbi-note">Um valor baixo de eosinófilos ou FeNO não exclui inflamação T2. O GINA recomenda repetir biomarcadores até três vezes quando necessário, especialmente após redução de corticoide sistêmico se clinicamente seguro. Não interromper OCS sem supervisão.</p></fieldset>',
    '<fieldset><legend>3. Comorbidades e fatores de seleção</legend><div class="gbi-checks">',
    check('polipos','Rinossinusite crônica com pólipos nasais'),
    check('dermatite','Dermatite atópica moderada/grave'),
    check('eoe','Esofagite eosinofílica'),
    check('egpa','Granulomatose eosinofílica com poliangiite (EGPA)'),
    check('uce','Urticária espontânea crônica'),
    check('alimento','Alergia alimentar mediada por IgE'),
    check('pref26','Preferência por intervalo de aplicação mais longo'),
    check('prefdom','Preferência por autoaplicação domiciliar'),
    '</div><p class="gbi-note">As comorbidades são fatores de decisão, não prova de superioridade entre biológicos. A indicação de cada doença e faixa etária depende de bula e regulamentação brasileira.</p></fieldset>',
    '<div class="gbi-actions"><button type="submit" class="gbi-btn">Analisar opções</button><button type="reset" class="gbi-btn gbi-btn-light">Limpar dados</button></div>',
    '</form><div id="gbi-res" class="gbi-result" aria-live="polite" aria-atomic="false">',
    '<div class="gbi-state">Preencha os critérios clínicos e selecione “Analisar opções”. Nenhum dado é salvo ou enviado ao servidor por esta calculadora.</div></div>',
    '<div class="gbi-refs">Fontes e localização: ',
    '<a href="https://ginasthma.org/wp-content/uploads/2026/06/GINA-Severe-Asthma-Guide-2026-WEB-WMS.pdf" target="_blank" rel="noopener noreferrer">GINA Severe Asthma Guide 2026, pp. 10–12 e 18–27 (Figuras 3–4; etapas 6–9)</a>; ',
    '<a href="https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf" target="_blank" rel="noopener noreferrer">GINA Strategy Report 2026, seção 8, pp. 154–168</a>; ',
    '<a href="https://bvsms.saude.gov.br/bvs/saudelegis/ans/2025/res_0634_14_05_2025.html" target="_blank" rel="noopener noreferrer">ANS RN 634/2025, DUT 65.9 e 65.10</a>; ',
    '<a href="https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-autoriza-novo-medicamento-biologico-para-doencas-respiratorias" target="_blank" rel="noopener noreferrer">Anvisa: depemoquimabe/Densurko, 11/05/2026</a>. ',
    '<p class="gbi-small">Ferramenta de apoio e síntese própria das fontes, não reproduz o fluxograma original do GINA. Não representa aprovação, cobertura, prescrição automática, comparação direta de eficácia ou escore validado.</p></div>',
    '</div>'
  ].join('');
  var oldRef=body.querySelector('.eaaci-ref');
  if(oldRef) body.insertBefore(mount,oldRef); else body.appendChild(mount);
  var form=mount.querySelector('#gbi-form'),result=mount.querySelector('#gbi-res');
  form.addEventListener('reset',function(){result.innerHTML='<div class="gbi-state">Dados limpos. Preencha o formulário para nova análise.</div>';});
  form.addEventListener('submit',function(e){e.preventDefault();try{render(read());}catch(err){result.innerHTML='<div class="gbi-state warn">Não foi possível analisar estes dados. Confira os campos e tente novamente.</div>'; if(window.console)console.error('Calculadora de biológicos',err);} });
  function campo(id,label,options){return '<label for="gbi-'+id+'">'+label+'<select id="gbi-'+id+'" name="'+id+'">'+options.map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>';}).join('')+'</select></label>';}
  function opSim(){return [['','Não informado'],['sim','Sim'],['nao','Não']];}
  function numero(id,label,min,max,step){return '<label for="gbi-'+id+'">'+label+'<input type="number" id="gbi-'+id+'" name="'+id+'" min="'+min+'" max="'+max+'" step="'+step+'" placeholder="Não informado"></label>';}
  function check(id,label){return '<label for="gbi-'+id+'"><input type="checkbox" name="'+id+'" id="gbi-'+id+'"><span>'+label+'</span></label>';}
  function read(){
    var v={}; var ids=['confirmada','otimizada','alta','sintomas','sens','gatilho','ocs','ocs6','ocsrec','supressao','inicio','anterior','resposta','falta'];
    ids.forEach(function(id){v[id]=form.elements[id].value;});
    ['idade','peso','eos','eosh','feno','escarro','vef1','ige','crises','internacoes'].forEach(function(id){var a=form.elements[id],x=a.value.trim();v[id]=x===''?null:Number(x);if(v[id]!==null && (!Number.isFinite(v[id]) || !a.checkValidity()))throw Error('Número inválido: '+id);});
    ['polipos','dermatite','eoe','egpa','uce','alimento','pref26','prefdom'].forEach(function(id){v[id]=form.elements[id].checked;});
    return v;
  }
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function pct(v){return v===null?'não informado':String(v);}
  function render(v){
    var age=v.idade, emax=Math.max(v.eos===null?-1:v.eos,v.eosh===null?-1:v.eosh),hasEos=emax>=0;
    var exacerb=v.crises!==null&&v.crises>0 || v.internacoes!==null&&v.internacoes>0;
    var need=[]; if(age===null)need.push('idade');
    if(v.confirmada==='')need.push('diagnóstico confirmado');
    if(v.otimizada==='')need.push('revisão do tratamento');
    if(v.alta==='')need.push('intensidade do tratamento');
    if(v.sintomas===''&&v.crises===null&&v.internacoes===null&&v.ocs==='')need.push('controle da asma ou exacerbações/OCS');
    var block=[];
    if(age!==null&&age<6)block.push('Abaixo de 6 anos: esta ferramenta não identifica opção de biológico para asma nas faixas etárias descritas pelo GINA 2026.');
    if(v.confirmada==='nao')block.push('Diagnóstico de asma ainda não confirmado.');
    if(v.otimizada==='nao')block.push('É necessário revisar e otimizar técnica, adesão, exposições, comorbidades e tratamento.');
    if(v.alta==='nao')block.push('A gravidade sob tratamento otimizado ainda não foi estabelecida para seleção de biológico.');
    var symptomatic=v.sintomas==='sim'||exacerb||v.ocs==='sim';
    if(v.sintomas==='nao'&&v.crises===0&&v.internacoes===0&&v.ocs==='nao')block.push('Sem exacerbações, controle inadequado ou necessidade de OCS de manutenção informados; rever indicação de biológico.');
    if(v.sintomas==='nao'&&v.crises===0&&v.internacoes===0&&v.ocs==='nao')block.push('Não foi demonstrada atividade clínica atual que justifique terapia adicional.');
    var gate=block.length===0&&need.length===0;
    var intro='<h4>Interpretação clínica</h4>';
    if(block.length)intro+='<div class="gbi-state warn">A seleção de biológico não está liberada nesta triagem: '+esc(block.join(' '))+'</div>';
    else if(need.length)intro+='<div class="gbi-state warn">Avaliação incompleta. Informe: '+esc(need.join('; '))+'. Abaixo são apresentadas apenas possibilidades condicionais, não elegibilidade confirmada.</div>';
    else intro+='<div class="gbi-state">Asma grave em avaliação após tratamento otimizado. A seleção depende de fenótipo, indicação aprovada e critérios locais. '+(symptomatic?'Há relato de atividade clínica relevante.':'Rever atividade clínica e riscos futuros.')+'</div>';
    var markers=[];
    if(hasEos&&emax>=150)markers.push('eosinófilos ≥150/µL');
    if(v.feno!==null&&v.feno>=20)markers.push('FeNO ≥20 ppb');
    if(v.escarro!==null&&v.escarro>=2)markers.push('eosinófilos no escarro ≥2%');
    if(v.sens==='sim'&&v.gatilho==='sim')markers.push('asma clinicamente dirigida por alérgenos');
    if(v.ocs==='sim')markers.push('OCS de manutenção (biomarcadores podem estar suprimidos)');
    if(markers.length)intro+='<p class="gbi-small">Sinais de inflamação T2: '+esc(markers.join('; '))+'. Os limiares de fenotipagem (GINA p. 19) não são, por si, critérios de autorização de biológico.</p>';
    else intro+='<p class="gbi-small">Inflamação T2 não demonstrada pelos dados preenchidos. Uma única medida baixa não exclui T2; revise o contexto e repita exames quando indicado.</p>';
    if(v.falta==='nao')intro+='<div class="gbi-state warn">Acesso informado como indisponível: verificar opções de fornecimento, custo e disponibilidade, sem alterar a indicação clínica.</div>';
    if(v.prefdom)intro+='<p class="gbi-small">Preferência registrada por autoaplicação: confirmar quais apresentações admitem uso domiciliar; reslizumabe é intravenoso.</p>';
    if(v.anterior&&v.resposta==='nenhuma')intro+='<div class="gbi-state warn">Ausência de resposta ao biológico anterior: após confirmar dose, adesão e tempo adequado de tratamento, considerar troca de alvo se houver outra opção elegível (GINA 2026, p. 26).</div>';
    if(v.anterior&&v.resposta==='boa')intro+='<p class="gbi-small">Boa resposta ao biológico anterior: considerar manutenção antes de propor troca; avaliar acesso, preferência e indicação clínica.</p>';
    if(v.supressao==='sim')intro+='<div class="gbi-state warn">Biomarcadores obtidos sob corticoide sistêmico: interpretar com cautela. O GINA orienta reavaliação em momento clinicamente apropriado, sem suspensão autônoma do tratamento.</div>';
    if(emax>1500)intro+='<div class="gbi-state warn">Eosinofilia acima de 1.500/µL: investigar outras causas, inclusive EGPA e infecções parasitárias quando pertinente. GINA desaconselha anti-IL4Rα quando há eosinófilos basais ou históricos acima de 1.500/µL pela escassez de evidência.</div>';
    var candidates=[
      {name:'Omalizumabe (anti-IgE)',min:6,dose:'Dose conforme tabela local de peso e IgE; SC a cada 2–4 semanas.',kind:'ige'},
      {name:'Mepolizumabe (anti-IL-5)',min:6,dose:'GINA: 40 mg SC a cada 4 semanas (6–11 anos); 100 mg SC a cada 4 semanas (≥12 anos).',kind:'il5'},
      {name:'Benralizumabe (anti-IL-5Rα)',min:12,dose:'GINA: 30 mg SC a cada 4 semanas nas primeiras três doses, depois a cada 8 semanas.',kind:'il5'},
      {name:'Depemoquimabe (anti-IL-5)',min:12,dose:'GINA: 100 mg SC a cada 26 semanas. Registrado na Anvisa como Densurko em maio/2026.',kind:'il5'},
      {name:'Reslizumabe (anti-IL-5)',min:18,dose:'GINA: 3 mg/kg IV a cada 4 semanas. Confirmar registro e disponibilidade no Brasil.',kind:'il5'},
      {name:'Dupilumabe (anti-IL-4Rα)',min:6,dose:'GINA: ≥12 anos, 200 ou 300 mg SC a cada 2 semanas conforme indicação; 6–11 anos, dose pelo peso/bula.',kind:'dup'},
      {name:'Tezepelumabe (anti-TSLP)',min:12,dose:'GINA: 210 mg SC a cada 4 semanas.',kind:'teze'}
    ];
    var items=candidates.map(function(c){
      var reasons=[],notes=[],state='possible',predictors=[];
      if(age===null){state='conditional';notes.push('Informar idade para verificar faixa etária.');}
      else if(age<c.min){state='no';notes.push('Idade inferior à faixa etária da indicação de asma descrita pelo GINA.');}
      if(c.kind==='ige'){
        if(v.sens==='nao'){state=state==='no'?'no':'unsupported';notes.push('Sem sensibilização perene documentada: fenótipo alérgico não demonstrado.');}
        else if(v.sens!=='sim'){if(state==='possible')state='conditional';notes.push('Comprovar sensibilização a aeroalérgeno perene.');}
        else reasons.push('Sensibilização perene documentada.');
        if(v.gatilho==='sim')predictors.push('sintomas relacionados a alérgenos');
        if(v.inicio==='infancia')predictors.push('início na infância');
        if(v.ige===null||v.peso===null){if(state==='possible')state='conditional';notes.push('Informar IgE total e peso e consultar tabela de dosagem por idade/registro.');}
        else notes.push('IgE e peso informados; confirmar se a combinação consta na tabela de dose da bula brasileira. IgE isoladamente não prediz resposta.');
        if(v.uce||v.alimento||v.polipos)reasons.push('Comorbidade que pode ter indicação própria, conforme bula e idade.');
      } else if(c.kind==='il5'){
        if(!hasEos){if(state==='possible')state='conditional';notes.push('É necessária documentação de eosinofilia atual ou prévia, idealmente antes de OCS.');}
        else if(emax>=150){
          reasons.push('Eosinofilia documentada ('+emax+'/µL).');
          if(emax>=300)predictors.push('eosinófilos elevados');
        } else {if(state==='possible')state=(v.ocs==='sim'||v.supressao==='sim')?'conditional':'unsupported';notes.push('Eosinofilia não demonstrada nos resultados informados; se houve OCS, possível supressão. Repetir quando pertinente e avaliar critérios locais.');}
        if(v.crises!==null&&v.crises>0)predictors.push('exacerbações no último ano');
        if(v.inicio==='adulta')predictors.push('asma de início adulto');
        if(v.polipos){predictors.push('polipose nasal');if(c.name.indexOf('Mepolizumabe')===0||c.name.indexOf('Depemoquimabe')===0)reasons.push('Possível indicação associada à RSCcPN conforme bula.');}
        if(v.ocs==='sim')predictors.push('uso de OCS de manutenção');
        if(v.vef1!==null&&v.vef1<65)predictors.push('VEF1 abaixo de 65% do previsto (associação observada em um estudo)');
        if(v.egpa&&(c.name.indexOf('Mepolizumabe')===0||c.name.indexOf('Benralizumabe')===0))reasons.push('EGPA: verificar indicação específica e dose.');
        if(c.name.indexOf('Depemoquimabe')===0){notes.push('Registro Anvisa confirmado; cobertura ANS/SUS e disponibilidade comercial devem ser verificadas.');if(v.pref26)predictors.push('preferência por aplicações semestrais');}
        if(c.name.indexOf('Reslizumabe')===0)notes.push('Administração intravenosa; registro e oferta no Brasil precisam de confirmação.');
      } else if(c.kind==='dup'){
        var eosOk=hasEos&&emax>=150&&emax<=1500, fenoOk=v.feno!==null&&v.feno>=25;
        var ocsOk=v.ocs==='sim'&&age!==null&&age>=12;
        if(eosOk)reasons.push('Eosinófilos ≥150 e ≤1.500/µL.');
        if(fenoOk)reasons.push('FeNO ≥25 ppb.');
        if(ocsOk)reasons.push('Uso de OCS de manutenção em idade ≥12 anos.');
        if(!eosOk&&!fenoOk&&!ocsOk){if(state==='possible')state=hasEos&&v.feno!==null&&v.ocs!=='sim'?'unsupported':'conditional';notes.push('Não há biomarcador T2 elegível documentado ou critério de OCS aplicável à idade; conferir indicação e bula.');}
        if(emax>1500){state=state==='no'?'no':'unsupported';notes.push('Eosinófilos basais/históricos >1.500/µL: GINA não sugere anti-IL4Rα.');}
        if(eosOk)predictors.push('eosinófilos elevados');
        if(fenoOk)predictors.push('FeNO elevado');
        if(v.dermatite)reasons.push('Dermatite atópica coexistente.');
        if(v.polipos)reasons.push('Polipose nasal coexistente.');
        if(v.eoe)reasons.push('Esofagite eosinofílica coexistente.');
        if(v.ocs==='sim')notes.push('Avaliar redução gradual supervisionada de OCS; monitorar eosinofilia e sinais de EGPA.');
      } else {
        if(v.crises===null&&v.internacoes===null){if(state==='possible')state='conditional';notes.push('Documentar exacerbações no último ano e critérios locais.');}
        else if(!exacerb){if(state==='possible')state='conditional';notes.push('Sem exacerbação documentada: GINA descreve evidências principalmente em pacientes com exacerbações prévias; validar elegibilidade individual.');}
        else reasons.push('Exacerbação no último ano documentada.');
        if(hasEos&&emax>=300)predictors.push('eosinófilos elevados');
        if(v.feno!==null&&v.feno>=25)predictors.push('FeNO elevado');
        if(v.polipos)predictors.push('polipose nasal');
        if(!markers.length)reasons.push('Pode ser considerado mesmo sem biomarcadores T2 elevados; benefício médio tende a ser maior com eosinófilos/FeNO mais altos.');
        if(v.ocs==='sim')notes.push('GINA: em asma dependente de OCS, tezepelumabe não demonstrou efeito poupador significativo de OCS vs placebo.');
      }
      if(c.kind!=='teze'&&c.kind!=='dup'&&!(v.crises!==null&&v.crises>0)&&!(v.internacoes!==null&&v.internacoes>0)&&v.ocs!=='sim'){
        if(state==='possible')state='conditional';
        notes.push('Confirmar exacerbações prévias/necessidade de OCS e critérios do pagador.');
      }
      if(v.anterior&&c.name.toLowerCase().indexOf(v.anterior)===0&&v.resposta==='nenhuma'){
        if(state==='possible')state='conditional';
        notes.push('Houve relato de ausência de resposta prévia a este mesmo fármaco; revisar decisão antes de reutilizá-lo.');
      }
      if(!gate&&state==='possible')state='conditional';
      var label=state==='no'?'Fora da faixa etária':state==='unsupported'?'Critério clínico não demonstrado':state==='conditional'?'Necessita confirmação':'Perfil a considerar';
      var css=state==='no'||state==='unsupported'?'no':state==='conditional'?'conditional':'';
      return '<article class="gbi-card"><h5>'+esc(c.name)+'</h5><span class="gbi-status '+css+'">'+label+'</span>'+
        (reasons.length?'<p>'+esc(reasons.join(' '))+'</p>':'')+
        (predictors.length?'<p><span style="color:#1f6980">Preditores/atributos favoráveis:</span> '+esc(predictors.join('; '))+'.</p>':'')+
        (notes.length?'<p>'+esc(notes.join(' '))+'</p>':'')+
        '<p>'+esc(c.dose)+'</p></article>';
    });
    var section='<h4>Classes e medicamentos avaliados</h4><p class="gbi-small">Sem ranking numérico ou promessa de superioridade. “Perfil a considerar” não equivale a elegibilidade formal pela bula, ANS ou SUS; os medicamentos são apresentados por classe terapêutica.</p><div class="gbi-cards">'+items.join('')+'</div>';
    var monitoring='<div class="gbi-ans"><h4>Antes de prescrever e durante o seguimento</h4><ul class="gbi-list"><li>Verificar bula brasileira, idade, dose, peso/IgE quando pertinentes, contraindicações, acesso e critérios da fonte pagadora.</li><li>Pesquisar infecção parasitária quando pertinente antes do tratamento, além de avaliar riscos e preferências do paciente.</li><li>Documentar exacerbações, ACT/ACQ, VEF1, OCS, FeNO/eosinófilos, eventos adversos e comorbidades; comparar com avaliação basal.</li><li>GINA 2026: período de teste inicial de pelo menos 4 meses (depemoquimabe: 6 meses); se resposta incerta, considerar avaliação total de 6–12 meses; sem resposta, interromper e ponderar troca de alvo se elegível.</li><li>GINA recomenda não administrar a primeira dose de biológico no mesmo dia de vacina, para distinguir eventos adversos.</li></ul></div>';
    result.innerHTML=intro+section+ans(v,emax,hasEos)+monitoring;
  }
  function ans(v,emax,hasEos){
    var fl=v.sintomas==='sim'||(v.crises!==null&&v.crises>0)||(v.internacoes!==null&&v.internacoes>0)||v.ocs==='sim';
    var base=v.confirmada==='sim'&&v.alta==='sim'&&fl;
    var exacerb=(v.crises!==null&&v.crises>=2)||(v.internacoes!==null&&v.internacoes>=1)||v.ocs6==='sim';
    var eps=hasEos&&(emax>=300||(emax>=150&&v.ocsrec==='sim'));
    var alerg=v.sens==='sim';
    var reqBase=v.confirmada!==''&&v.alta!==''&&v.sintomas!==''&&v.crises!==null&&v.internacoes!==null&&v.ocs6!==''&&v.ocsrec!=='';
    var eosstate=!reqBase||!hasEos?'Documentação incompleta':base&&exacerb&&eps?'Critérios clínicos principais preenchidos':'Critérios não preenchidos com os dados informados';
    var alergstate=!reqBase||v.sens===''?'Documentação incompleta':base&&exacerb&&alerg?'Critérios clínicos principais preenchidos':'Critérios não preenchidos com os dados informados';
    return '<div class="gbi-ans"><h4>Triagem documental separada — ANS (DUT)</h4>'+
      '<p class="gbi-small">Resolução Normativa ANS 634/2025. Não confundir recomendação GINA com autorização de cobertura, nem usar esta triagem como garantia de deferimento.</p>'+
      '<p>65.9 · Asma eosinofílica grave (benralizumabe, mepolizumabe, dupilumabe, tezepelumabe): <span class="gbi-status '+(eosstate.indexOf('preenchidos')>=0&&eosstate.indexOf('não')<0?'':'conditional')+'">'+esc(eosstate)+'</span></p>'+
      '<p>65.10 · Asma alérgica grave (omalizumabe, dupilumabe, tezepelumabe): <span class="gbi-status '+(alergstate.indexOf('preenchidos')>=0&&alergstate.indexOf('não')<0?'':'conditional')+'">'+esc(alergstate)+'</span></p>'+
      '<p class="gbi-small">Exige asma não controlada apesar de CI-LABA, além de: 65.9 — eos ≥300/µL nos últimos 12 meses ou ≥150/µL sob OCS contínuo/recorrente; 65.10 — sensibilização perene comprovada. Em ambas: ≥2 exacerbações com OCS em 12 meses ou ≥1 hospitalização ≥24 h ou OCS contínuo para asma por 6 meses. Avalie eventuais atualizações da DUT, exigências de bula e documentos comprobatórios.</p></div>';
  }
})();
