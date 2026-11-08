/* Radar UpToDate · apenas títulos públicos e resumos independentes.
   JSON atualizado diariamente via GitHub Actions, sem conteúdo restrito ou dados de pacientes. */
(function(){
'use strict';
var ORIGEM='https://ff.uptodate.com/contents/whats-new-in-allergy-and-immunology';
var caminho='/data/uptodate.json';
var ultimaConsulta=0, carregando=false, itens=[], mostrarTodos=false;
function el(tag,classe,texto){
  var e=document.createElement(tag); if(classe)e.className=classe;
  if(texto!==undefined && texto!==null)e.textContent=String(texto);
  return e;
}
function dataBrasil(iso){
  if(!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso))return 'não informada';
  var d=new Date(iso+'T12:00:00Z');
  return Number.isNaN(d.getTime())?'não informada':d.toLocaleDateString('pt-BR',{timeZone:'UTC'});
}
function mesBrasil(anoMes){
  if(!/^\d{4}-\d{2}$/.test(anoMes||''))return 'Data não informada';
  var d=new Date(anoMes+'-01T12:00:00Z');
  return Number.isNaN(d.getTime())?'Data não informada':d.toLocaleDateString('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'});
}
function montarItem(item,posicao){
  var card=el('article','utd-item'+(posicao===0?' utd-feature':''));
  card.appendChild(el('div','utd-meta',(item.topic||'Alergia e Imunologia')+' · '+mesBrasil(item.month)));
  var titulo=el('h3','',item.titlePt||item.title||'Atualização clínica');
  card.appendChild(titulo);
  if(item.summary)card.appendChild(el('p','',item.summary));
  else card.appendChild(el('p','','Nova atualização identificada no índice oficial. Consulte o conteúdo na fonte antes de alterar condutas.'));
  var a=el('a','', 'Abrir índice geral de novidades do UpToDate ↗');
  a.href=ORIGEM; a.target='_blank'; a.rel='noopener noreferrer';
  a.setAttribute('aria-label','Abrir índice geral de novidades do UpToDate; não é um link direto para '+(item.title||item.titlePt||'esta atualização'));
  card.appendChild(a);
  return card;
}
function render(dados){
  var container=document.getElementById('utdHighlights');
  var status=document.getElementById('utdStatus');
  if(!container||!status)return;
  if(!Array.isArray(dados.items)||!dados.items.length)throw Error('Sem atualizações válidas');
  itens=dados.items.slice().filter(function(item){return item && (item.titlePt||item.title);});
  itens.sort(function(a,b){return String(b.month||'').localeCompare(String(a.month||''));});
  container.textContent='';
  var n=mostrarTodos?itens.length:Math.min(3,itens.length);
  for(var i=0;i<n;i++)container.appendChild(montarItem(itens[i],i));
  if(itens.length>3){
    var more=el('button','','');
    more.type='button'; more.className='utd-more';
    more.textContent=mostrarTodos?'Mostrar menos':'Ver todas as '+itens.length+' novidades';
    more.addEventListener('click',function(){mostrarTodos=!mostrarTodos;render(dados);});
    container.appendChild(more);
  }
  var txt='Fonte atualizada em '+dataBrasil(dados.sourceUpdatedAt)+' · Última verificação: '+dataBrasil(dados.checkedAt);
  var verificada=dados.checkedAt?new Date(dados.checkedAt+'T12:00:00Z'):null;
  if(!verificada||Number.isNaN(verificada.getTime())||(Date.now()-verificada.getTime())>3*86400000)
    txt+=' · Verificação diária pendente';
  status.textContent=txt;
}
async function atualizar(){
  if(carregando)return;
  carregando=true;ultimaConsulta=Date.now();
  var btn=document.getElementById('utdReload');
  if(btn)btn.disabled=true;
  try{
    var resposta=await fetch(caminho+'?t='+Date.now(),{cache:'no-store',headers:{Accept:'application/json'}});
    if(!resposta.ok)throw Error('HTTP '+resposta.status);
    var dados=await resposta.json();
    render(dados);
  }catch(err){
    var container=document.getElementById('utdHighlights');
    var status=document.getElementById('utdStatus');
    if(!itens.length && container){
      container.textContent='';
      container.appendChild(el('p','utd-loading','Novidades temporariamente indisponíveis. Consulte a página oficial do UpToDate.'));
    }
    if(status)status.textContent='Não foi possível verificar as atualizações neste acesso.';
  }finally{carregando=false;if(btn)btn.disabled=false;}
}
function iniciar(){
  var botao=document.getElementById('utdReload');
  if(!botao)return;
  botao.addEventListener('click',atualizar);
  atualizar();
  setInterval(function(){
    var pagina=document.getElementById('page-artigos');
    if(pagina && pagina.classList.contains('active') && (Date.now()-ultimaConsulta)>3600000)atualizar();
  },300000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);
else iniciar();
})();