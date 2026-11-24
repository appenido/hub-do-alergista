/* VAS de prurido: leitura subjetiva 0–10 (não é diagnóstico isolado). */
(function(){
  if(typeof SCORES!=="object" || !SCORES) return;
  SCORES.vasprurido = {
    title:"VAS — Prurido",
    desc:"Intensidade subjetiva do prurido nas últimas 24 horas. 0 = ausência de coceira; 10 = pior coceira imaginável. Escala digital de 0 a 10 com incrementos de 0,1.",
    special:"vas-prurido",
    fields:[{id:"vasp1",lbl:"Quão intensa foi sua coceira nas últimas 24 horas?",type:"num",ph:"0 a 10"}],
    calc:function(v){
      var n=(v[0]===null||v[0]===undefined||v[0]==='')?NaN:Number(v[0]);
      if(!Number.isFinite(n)||n<0||n>10)return {score:"—",lbl:"Informe um valor de 0 a 10.",desc:"Selecione a intensidade do prurido na escala.",color:"linear-gradient(135deg,#0d1f2d,#1f6980)"};
      return {score:n.toFixed(1).replace(".",",")+"/10",lbl:n===0?"Sem prurido referido":n===10?"Prurido máximo referido":"Intensidade subjetiva do prurido",desc:"VAS digital de prurido nas últimas 24 horas. A pontuação registra a percepção do paciente; não determina isoladamente gravidade, etiologia ou conduta.",color:"linear-gradient(135deg,#0d1f2d,#1f6980)"};
    }
  };

  // GAD-7 — Spitzer et al. (2006); versão brasileira validada.
  // As sete questões correspondem às últimas duas semanas; 0–3 pontos por item.
  var gadOpts=[
    'Nenhuma vez (0)',
    'Vários dias (1)',
    'Mais da metade dos dias (2)',
    'Quase todos os dias (3)'
  ];
  SCORES.gad7 = {
    title:'GAD-7 — Ansiedade Generalizada',
    desc:'Questionário de rastreamento e acompanhamento de sintomas de ansiedade nas últimas 2 semanas. São 7 perguntas, cada uma pontuada de 0 a 3. Total de 0 a 21. O resultado não estabelece diagnóstico isoladamente.',
    special:'gad7',
    fields:[
      {id:'gad1',lbl:'1. Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)',opts:gadOpts},
      {id:'gad2',lbl:'2. Não ser capaz de impedir ou controlar as preocupações',opts:gadOpts},
      {id:'gad3',lbl:'3. Preocupar-se muito com diversas coisas',opts:gadOpts},
      {id:'gad4',lbl:'4. Ter dificuldade para relaxar',opts:gadOpts},
      {id:'gad5',lbl:'5. Ficar tão agitado(a) que se torna difícil permanecer sentado(a)',opts:gadOpts},
      {id:'gad6',lbl:'6. Ficar facilmente aborrecido(a) ou irritado(a)',opts:gadOpts},
      {id:'gad7',lbl:'7. Sentir medo, como se algo horrível fosse acontecer',opts:gadOpts}
    ],
    calc:function(values){
      if(!Array.isArray(values)||values.length!==7||values.some(function(v){
        return !Number.isInteger(v)||v<0||v>3;
      })){
        return {score:'—',lbl:'Questionário incompleto',desc:'Responda as sete perguntas.',color:'linear-gradient(135deg,#0d1f2d,#1f6980)'};
      }
      var total=values.reduce(function(a,b){return a+b;},0);
      var label,description,color;
      if(total<=4){
        label='Sintomas mínimos';
        description='GAD-7 de 0 a 4: intensidade mínima dos sintomas relatados.';
        color='#176f7b';
      }else if(total<=9){
        label='Sintomas leves';
        description='GAD-7 de 5 a 9: sintomas leves; considerar acompanhamento conforme o contexto clínico.';
        color='#267f98';
      }else if(total<=14){
        label='Sintomas moderados';
        description='GAD-7 de 10 a 14: rastreamento positivo pelo ponto de corte habitual (≥ 10). Recomenda-se avaliação clínica.';
        color='#a5792d';
      }else{
        label='Sintomas graves';
        description='GAD-7 de 15 a 21: sintomas graves; recomenda-se avaliação clínica prioritária.';
        color='#ad4c4f';
      }
      return {
        score:total+'/21',
        lbl:label,
        desc:description+' A escala mede sintomas nas últimas 2 semanas, não confirma transtorno de ansiedade e não substitui avaliação profissional.',
        color:'linear-gradient(135deg,#0d1f2d,'+color+')'
      };
    }
  };

})();
