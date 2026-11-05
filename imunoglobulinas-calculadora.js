/* Calculadora educativa de imunoglobulinas — apenas peso, sem persistência.
   Não calcula indicação, elegibilidade, dose individual definitiva ou tolerância prévia.
   Referências: AAAAI/ACAAI/CIS (2026); bulas brasileiras Privigen e Hizentra;
   bula HyQvia; EAACI/Allergy 2026.
*/
(function(){
  'use strict';
  var active='privigen';
  var REF={
    aaai:'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/2025-Inborn-errors-of-immunity-pp.pdf#page=4',
    eaaci:'https://pmc.ncbi.nlm.nih.gov/articles/PMC13465973/',
    privigen:'https://labeling.cslbehring.com/pi/br/sandoglobulina-privigen/pt/sandoglobulina-privigen-bula-prof-saude.pdf#page=17',
    hizentra:'https://labeling.cslbehring.com/pi/br/hizentra/pt/hizentra-bula-prof-saude.pdf#page=14',
    hyqvia:'https://consultaremedios.com.br/hyqvia/bula'
  };
  function id(x){return document.getElementById(x);}
  function e(tag, text, cls){
    var n=document.createElement(tag);
    if(cls)n.className=cls;
    if(text!==undefined&&text!==null)n.textContent=String(text);
    return n;
  }
  function link(url,title){
    var a=e('a',title);
    a.href=url; a.target='_blank'; a.rel='noopener noreferrer';
    return a;
  }
  function fmt(v,d){
    return Number(v).toLocaleString('pt-BR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});
  }
  function bloco(titulo,textos){
    var box=e('section',null,'igcalc-section');
    box.appendChild(e('h4',titulo));
    var ul=e('ul');
    textos.forEach(function(t){ul.appendChild(e('li',t));});
    box.appendChild(ul);
    return box;
  }
  function table(head,rows){
    var t=e('table',null,'igcalc-table');
    var thead=e('thead'),tr=e('tr');
    head.forEach(function(v){tr.appendChild(e('th',v));});
    thead.appendChild(tr);t.appendChild(thead);
    var body=e('tbody');
    rows.forEach(function(row){
      var r=e('tr');
      row.forEach(function(v){r.appendChild(e('td',v));});
      body.appendChild(r);
    });
    t.appendChild(body);
    return t;
  }
  function alert(container,txt){
    container.appendChild(e('div',txt,'igcalc-alert'));
  }
  function montarRefs(parent,produto){
    var r=e('div',null,'igcalc-refs');
    r.appendChild(e('div','Referências para conferência da prescrição:'));
    var ol=e('ul');ol.style.cssText='padding-left:17px;margin:7px 0';
    [
      [REF.aaai,'AAAAI/ACAAI/CIS — parâmetro de prática 2026, recomendação 8.2 (dose de reposição)'],
      [REF.eaaci,'EAACI / Allergy (2026) — algoritmo individualizado para reposição de imunoglobulinas'],
      [REF[produto],produto==='privigen'?'Bula brasileira Privigen — administração e velocidade (p. 16)':produto==='hizentra'?'Bula brasileira Hizentra — volume e velocidade SC (p. 14)':'Bula HyQvia — titulação, rHuPH20 e tabela de velocidade por local']
    ].forEach(function(item){
      var li=e('li');li.appendChild(link(item[0],item[1]));ol.appendChild(li);
    });
    r.appendChild(ol);
    r.appendChild(e('p','Uso profissional. Os valores são referência para reposição de IgG nos erros inatos de imunidade, e não se aplicam automaticamente a indicações imunomoduladoras, imunodeficiências secundárias ou outras condições.'));
    parent.appendChild(r);
  }
  function calcular(){
    var out=id('igcalcOutput');
    if(!out)return;
    out.textContent='';
    var campo=id('igcalcWeight');
    var raw=(campo&&campo.value||'').replace(',','.');
    var peso=Number(raw);
    if(!raw.trim() || !Number.isFinite(peso) || peso<2 || peso>250){
      out.appendChild(e('div','Informe um peso válido entre 2 e 250 kg.','igcalc-error'));
      if(campo)campo.focus();
      return;
    }
    var nome=active==='privigen'?'Privigen 10%':active==='hizentra'?'Hizentra 20%':'HyQvia 10%';
    var conc=active==='hizentra'?0.2:0.1; // gramas por mL
    var semanal=active==='hizentra';
    var doseMin=peso*(semanal?0.1:0.4);
    var doseMax=peso*(semanal?0.15:0.6);
    var mlMin=doseMin/conc,mlMax=doseMax/conc;
    var summary=e('div',null,'igcalc-summary');
    summary.appendChild(e('h4',nome+' — dose de referência'));
    summary.appendChild(e('p','Peso informado: '+fmt(peso,1)+' kg.'));
    summary.appendChild(e('p','Faixa usual de partida para reposição de IgG: '+fmt(doseMin,1)+' a '+fmt(doseMax,1)+' g'+(semanal?'/semana':' a cada 4 semanas')+' ('+(semanal?'100–150 mg/kg/semana':'400–600 mg/kg a cada 4 semanas')+').'));
    summary.appendChild(e('p','Volume teórico na concentração '+(active==='hizentra'?'20%':'10%')+': '+fmt(mlMin,1)+' a '+fmt(mlMax,1)+' mL por aplicação correspondente.'));
    summary.appendChild(e('p','O cálculo não arredonda a dose nem substitui a prescrição médica. A dose de manutenção e o intervalo dependem da indicação, resposta clínica, IgG e particularidades do produto.'));
    if(active==='privigen'||active==='hyqvia'){
      summary.appendChild(e('p','Apresentação de referência de 5 g: cada frasco de imunoglobulina a 10% contém 50 mL. Quantidade de frascos a separar deve ser definida a partir da dose prescrita; não arredondar automaticamente em múltiplos de 5 g.'));
    }else{
      summary.appendChild(e('p','Hizentra: não pressupor frascos de 5 g. Conferir apresentações comercializadas e volumes por local na bula vigente.'));
    }
    out.appendChild(summary);
    alert(out,'Antes de liberar a prescrição, confirmar diagnóstico/indicação, dose individual, peso de cálculo apropriado (especialmente em obesidade), fabricante e apresentação, idade autorizada, riscos renais/trombóticos, hidratação, tolerância à marca, intervalo desde a última infusão e protocolos do serviço.');
    var stages=e('div',null,'igcalc-sections');
    var pre=[
      'Conferir prescrição, dose, via, concentração, validade, lote, rastreabilidade e integridade do frasco. Não registrar dados identificáveis neste aplicativo.',
      'Revisar reações anteriores, mudança de produto, anafilaxia, trombose, insuficiência renal, comorbidades e hidratação; avaliar sinais vitais e necessidade de acesso venoso para IV.',
      'Pré-medicação não é obrigatória rotineiramente. Considerar medidas individualizadas em pacientes com reação infusional anterior; anti-histamínico ou antitérmico não previne anafilaxia.',
      'Disponibilizar equipe treinada e material para atendimento de reações graves; higienizar as mãos e respeitar técnica asséptica.'
    ];
    var per=[
      'Monitorar sintomas e sinais vitais durante a aplicação, com maior vigilância no início e a cada incremento. A frequência depende da via, do produto e do risco.',
      'Reduzir ou suspender a infusão diante de cefaleia intensa, calafrios, desconforto, dispneia, hipotensão ou outros sintomas; avaliar e tratar conforme gravidade.',
      'Em suspeita de anafilaxia, interromper imediatamente e seguir protocolo de emergência com adrenalina intramuscular quando indicada; não apenas desacelerar a bomba.'
    ];
    var post=[
      'Registrar no prontuário institucional dose realmente administrada, lote, fabricante, via, horários, taxas e reações; o Hub não mantém dados dos pacientes.',
      'Observar sinais tardios de cefaleia intensa, sinais de hemólise, oligúria, eventos tromboembólicos, febre persistente ou sintomas de meningite asséptica e orientar retorno imediato quando presentes.',
      'Monitorar infecções, tolerância e IgG sérica; em pacientes estáveis, diretriz AAAAI sugere reavaliação laboratorial em 6–12 meses, com intervalos menores se necessário. Ajustar dose conforme resposta.'
    ];
    if(active==='privigen'){
      pre.push('Privigen é pronto para uso IV. Se houver necessidade de diluição, a bula especifica glicose 5%; não misturar com soro fisiológico nem outros medicamentos na mesma linha.');
      var taxas=[0.3,0.6,1.2,2.4,4.8];
      var rows=taxas.map(function(t,i){
        return [(i*30)+'–'+((i+1)*30)+' min',fmt(t*peso,1)+' mL/h',fmt(t,1)+' mL/kg/h'];
      });
      var infusion=e('section',null,'igcalc-section');
      infusion.appendChild(e('h4','Durante — bomba de infusão Privigen'));
      infusion.appendChild(e('p','Progressão ilustrativa em etapas de 30 minutos. A bula estabelece 0,3 mL/kg/h por aproximadamente 30 minutos e aumento gradual se bem tolerado, sem definir os degraus intermediários.'));
      infusion.appendChild(table(['Período','Bomba','Taxa'],rows));
      infusion.appendChild(e('p','Teto habitual da bula: 4,8 mL/kg/h ('+fmt(4.8*peso,1)+' mL/h). Até 7,2 mL/kg/h ('+fmt(7.2*peso,1)+' mL/h) só nos casos previstos em bula, como reposição em imunodeficiência primária previamente bem tolerada, mediante decisão documentada.'));
      infusion.appendChild(e('p','A duração efetiva e a última etapa dependem do volume prescrito; a infusão pode terminar antes de atingir o degrau seguinte. Não avançar se houver reação.'));
      stages.appendChild(bloco('Antes da infusão',pre));
      stages.appendChild(infusion);
      stages.appendChild(bloco('Após a infusão',post.concat(['Segundo a bula, observar por pelo menos 20 minutos após a aplicação; nas primeiras infusões, troca de produto ou longo intervalo, observar por 1 hora após a primeira infusão.'])));
    }else if(active==='hizentra'){
      pre.push('Hizentra é exclusivamente subcutâneo. Definir número de locais e distribuição do volume, mantendo distância apropriada entre locais.');
      per.push('Na reposição, primeira infusão: até 15 mL por local e até 15 mL/h/local; nas subsequentes, se toleradas, até 25 mL por local e até 25 mL/h/local. Até 8 locais simultâneos, conforme bula.');
      per.push('A quantidade semanal calculada é aproximação de 1/4 da dose mensal; na conversão de IV para SC e em manutenção, seguir esquema específico da bula e níveis séricos.');
      stages.appendChild(bloco('Antes da infusão',pre));
      stages.appendChild(bloco('Durante — infusão subcutânea Hizentra',per));
      stages.appendChild(bloco('Após a infusão',post.concat(['Alternar locais de aplicação, avaliar edema, eritema e dor, e garantir treinamento adequado se houver aplicação domiciliar.'])));
    }else{
      pre.push('HyQvia inclui hialuronidase humana recombinante (rHuPH20) e IgG 10% em frascos separados. Verificar critérios de idade, titulação inicial e esquema de conversão.');
      var menor=peso<40;
      var taxasH=menor?[5,10,20,40,80]:[10,30,60,120,240];
      var linhas=taxasH.map(function(t,i){return [i===4?'Restante':i*10+'–'+((i+1)*10)+' min',fmt(t)+' mL/h/local'];});
      var infusionH=e('section',null,'igcalc-section');
      infusionH.appendChild(e('h4','Durante — HyQvia, velocidade por local'));
      infusionH.appendChild(e('p','Tabela da bula para as primeiras duas infusões, na faixa de peso '+(menor?'inferior a 40 kg':'a partir de 40 kg')+'. Velocidades de IgG 10% por local, com progressão se tolerada.'));
      infusionH.appendChild(table(['Período','Velocidade por local'],linhas));
      infusionH.appendChild(e('p','Aplicações subsequentes podem usar tabela distinta, desde que a tolerância esteja documentada. O peso sozinho não valida o escalonamento acelerado.'));
      infusionH.appendChild(e('p','Administrar primeiro a hialuronidase e depois a IgG 10%, pela mesma via/local, respeitando sequência, intervalo e titulação da bula. Não misturar os componentes.'));
      stages.appendChild(bloco('Antes da infusão',pre));
      stages.appendChild(infusionH);
      stages.appendChild(bloco('Após a infusão',post.concat(['Verificar reações locais e sistêmicas e as recomendações de observação específicas da administração subcutânea facilitada.'])));
    }
    out.appendChild(stages);
    montarRefs(out,active);
  }
  function onReady(){
    var op=id('igcalcOpen'),close=id('igcalcClose'),body=id('igcalcBody'),input=id('igcalcWeight'),out=id('igcalcOutput');
    if(!op||!close||!body||!input||!out)return;
    op.addEventListener('click',function(){
      op.hidden=true;
      body.hidden=false;
      op.setAttribute('aria-expanded','true');
      input.focus();
    });
    close.addEventListener('click',function(){
      body.hidden=true;
      op.hidden=false;
      op.setAttribute('aria-expanded','false');
      out.textContent='';
      input.value='';
      op.focus();
    });
    var b=id('igcalcCalculate');if(b)b.addEventListener('click',calcular);
    input.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();calcular();}});
    document.querySelectorAll('[data-igcalc-prod]').forEach(function(button){
      button.addEventListener('click',function(){
        active=button.getAttribute('data-igcalc-prod');
        document.querySelectorAll('[data-igcalc-prod]').forEach(function(other){
          var selected=other===button;other.classList.toggle('selected',selected);
          other.setAttribute('aria-pressed',selected?'true':'false');
        });
        out.textContent='';
        if(input.value.trim())calcular();
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onReady);
  else onReady();
})();
