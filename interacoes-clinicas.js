/* Interações medicamentosas: exibição de pares, em português brasileiro. */
(function(){
'use strict';
const COR_TEXTO='#17374d';
function el(tag,texto,css){
  const e=document.createElement(tag);
  if(texto!==undefined&&texto!==null)e.textContent=texto;
  if(css)e.style.cssText=css;
  return e;
}
function mensagem(box,titulo,descricao){
  box.style.display='block';box.style.whiteSpace='normal';box.replaceChildren();
  box.appendChild(el('div',titulo,'font-size:13px;font-weight:800;color:'+COR_TEXTO+';margin-bottom:6px'));
  box.appendChild(el('div',descricao,'font-size:12.5px;line-height:1.6;color:#506475'));
}
function linha(rotulo,conteudo){
  const w=el('div',null,'margin:8px 0;line-height:1.65;font-size:12.5px;color:#334d5e');
  w.appendChild(el('div',rotulo,'font-size:11.5px;font-weight:800;color:'+COR_TEXTO+';margin-bottom:2px'));
  w.appendChild(el('div',conteudo));
  return w;
}
function renderizar(box,dados){
  box.style.display='block';box.style.whiteSpace='normal';box.replaceChildren();
  const pares=Array.isArray(dados.pares)?dados.pares:[];
  if(!pares.length){
    mensagem(box,'Nenhuma combinação disponível','Informe dois ou mais medicamentos diferentes.');
    return;
  }
  const identificadas=pares.filter(p=>p.situacao==='identificada').length;
  const mencoes=pares.filter(p=>p.situacao==='mencao_documental').length;
  const semClassificacao=pares.length-identificadas;
  box.appendChild(el('div','Resultado das interações medicamentosas',
    'font-size:14px;font-weight:800;color:'+COR_TEXTO+';margin-bottom:8px'));
  const resumo=[];
  if(identificadas)resumo.push(identificadas===1?'1 interação documentada':identificadas+' interações documentadas');
  if(mencoes)resumo.push(mencoes===1?'1 menção em ficha técnica':mencoes+' menções em fichas técnicas');
  const restantes=semClassificacao-mencoes;
  if(restantes)resumo.push(restantes===1?'1 combinação sem conclusão clínica':restantes+' combinações sem conclusão clínica');
  box.appendChild(el('div',resumo.join(' · '),
    'font-size:12.5px;color:#506475;line-height:1.6;margin-bottom:12px'));
  pares.forEach(function(p){
    const reconhecida=p.situacao==='identificada';
    const prioridade=p.nivel==='Contraindicada'||p.nivel==='Evitar associação';
    const cor=reconhecida?(prioridade?'#ae3b35':'#8b5d16'):
      (p.situacao==='mencao_documental'?'#176b91':'#64748b');
    const card=el('details',null,
      'border:1px solid #d8e2ec;border-left:4px solid '+cor+';border-radius:12px;background:#fff;overflow:hidden;margin-bottom:10px');
    card.open=pares.length===1;
    const titulo=el('summary',null,
      'cursor:pointer;padding:13px 14px;list-style-position:inside;font-size:13px;font-weight:800;line-height:1.55;color:'+COR_TEXTO);
    titulo.appendChild(document.createTextNode((p.par||[]).join(' + ')));
    titulo.appendChild(el('span',p.nivel||'Não avaliada',
      'display:block;padding-left:17px;font-size:11.5px;font-weight:700;color:'+cor+';margin-top:4px'));
    card.appendChild(titulo);
    const conteudo=el('div',null,'padding:0 14px 14px');
    conteudo.appendChild(linha(reconhecida?'Efeito clínico esperado':'Resultado da busca',p.efeito||
      'A informação disponível não permite classificar esta combinação.'));
    if(p.mecanismo)conteudo.appendChild(linha('Mecanismo',p.mecanismo));
    if(p.conduta)conteudo.appendChild(linha(reconhecida?'Conduta':'Próximo passo',p.conduta));
    const fontes=[p.fonte,...(p.referencias||[])].filter(fonte=>fonte?.url);
    fontes.forEach(function(fonte){
      const a=el('a',fonte.nome||'Consultar referência oficial',
        'display:block;margin:6px 0;font-size:11.5px;color:#176b91;text-decoration:underline;overflow-wrap:anywhere');
      a.href=fonte.url;a.target='_blank';a.rel='noopener noreferrer';
      conteudo.appendChild(a);
      if(fonte.atualizada){
        const data=fonte.atualizada.split('-').reverse().join('/');
        conteudo.appendChild(el('div','Atualização da ficha em '+data,'font-size:10.5px;color:#506475;margin-top:-4px'));
      }
    });
    card.appendChild(conteudo);box.appendChild(card);
  });
  if(semClassificacao){
    box.appendChild(el('div','A cobertura é parcial. Uma combinação sem conclusão clínica continua sem confirmação de segurança.',
      'font-size:11.5px;line-height:1.6;color:#73511c;background:#fff8e8;border-radius:9px;padding:10px;margin-top:9px'));
  }
}
async function verificarInteracoes(){
  const box=document.getElementById('diResultado');
  const btn=document.getElementById('diVerificarBtn');
  if(!box||!btn)return;
  let nomes=typeof diColetarMeds==='function'?diColetarMeds():[];
  nomes=nomes.map(n=>String(n).trim()).filter(Boolean);
  if(nomes.length<2){
    mensagem(box,'Medicamentos insuficientes','Informe pelo menos dois medicamentos.');
    return;
  }
  if(nomes.length>12){
    mensagem(box,'Limite excedido','Informe no máximo 12 medicamentos por consulta.');
    return;
  }
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),32000);
  btn.disabled=true;
  btn.textContent='Verificando interações…';
  mensagem(box,'Verificando interações','Consultando as combinações informadas.');
  try{
    const response=await fetch('/interacoes',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({medicamentos:nomes}),
      cache:'no-store',
      signal:controller.signal
    });
    const dados=await response.json().catch(()=>null);
    if(!response.ok||!dados||!Array.isArray(dados.pares)){
      mensagem(box,'Não foi possível verificar as interações',
        dados&&dados.erro?dados.erro:'A consulta não foi concluída. Tente novamente.');
    }else{
      renderizar(box,dados);
    }
  }catch(erro){
    mensagem(box,'Não foi possível verificar as interações',
      erro&&erro.name==='AbortError'?
        'A consulta excedeu o tempo limite. Tente novamente.':
        'Falha na comunicação. Tente novamente.');
  }finally{
    clearTimeout(timer);
    btn.disabled=false;
    btn.textContent='Verificar interações';
  }
}
window.verificarInteracoes=verificarInteracoes;
})();
