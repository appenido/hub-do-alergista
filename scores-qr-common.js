/* VAS de prurido: leitura subjetiva 0–10 (não é diagnóstico isolado). */
(function(){
  if(typeof SCORES!=="object" || !SCORES) return;
  SCORES.vasprurido = {
    title:"VAS — Prurido",
    desc:"Intensidade subjetiva do prurido nas últimas 24 horas. 0 = ausência de coceira; 10 = pior coceira imaginável. Escala digital de 0 a 10 com incrementos de 0,1.",
    special:"vas-prurido",
    fields:[{id:"vasp1",lbl:"Quão intensa foi sua coceira nas últimas 24 horas?",type:"num",ph:"0 a 10"}],
    calc:function(v){
      var n=Number(v[0]);
      if(!Number.isFinite(n)||n<0||n>10)return {score:"—",lbl:"Informe um valor de 0 a 10.",desc:"Selecione a intensidade do prurido na escala.",color:"linear-gradient(135deg,#0d1f2d,#1f6980)"};
      return {score:n.toFixed(1).replace(".",",")+"/10",lbl:n===0?"Sem prurido referido":n===10?"Prurido máximo referido":"Intensidade subjetiva do prurido",desc:"VAS digital de prurido nas últimas 24 horas. A pontuação registra a percepção do paciente; não determina isoladamente gravidade, etiologia ou conduta.",color:"linear-gradient(135deg,#0d1f2d,#1f6980)"};
    }
  };
})();
