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
  var titleRow=el('div','utd-title-row');
  var sourceMark=el('span','utd-source-mark','U');
  sourceMark.setAttribute('aria-label','Fonte: UpToDate');
  sourceMark.title='UpToDate';
  titleRow.appendChild(sourceMark);
  titleRow.appendChild(el('h3','',item.titlePt||item.title||'Atualização clínica'));
  card.appendChild(titleRow);
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
function instalarEstilos(){
  if(document.getElementById('uptodate-legibilidade-styles'))return;
  var style=el('style');
  style.id='uptodate-legibilidade-styles';
  style.textContent=[
    '#utdHighlights.utd-highlights{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;}',
    '#utdHighlights .utd-item{padding:16px!important;gap:9px!important;border-radius:13px!important;}',
    '#utdHighlights .utd-title-row{display:flex;align-items:flex-start;gap:10px;min-width:0;width:100%;}',
    '#utdHighlights .utd-title-row h3{flex:1;min-width:0;font-size:16px!important;line-height:1.5!important;font-weight:800!important;display:block!important;-webkit-line-clamp:unset!important;overflow:visible!important;overflow-wrap:break-word!important;letter-spacing:0!important;text-align:left!important;}',
    '#utdHighlights .utd-source-mark{display:inline-flex;flex:0 0 36px;width:36px;height:36px;align-items:center;justify-content:center;border:1px solid #bbdfcd;border-radius:9px;background:#e9f6ee;color:#157544;font:800 22px/1 Manrope,Arial,sans-serif;}',
    '#utdHighlights .utd-meta{font-size:12px!important;line-height:1.45!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;}',
    '#utdHighlights .utd-item p{font-size:13.5px!important;line-height:1.65!important;display:block!important;-webkit-line-clamp:unset!important;overflow:visible!important;text-align:left!important;}',
    '#utdHighlights .utd-item a{font-size:12.5px!important;line-height:1.45!important;}',
    '#utdHighlights .utd-more{font-size:13px!important;padding:8px!important;}',
    '@media(max-width:720px){#utdHighlights.utd-highlights{grid-template-columns:minmax(0,1fr)!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;overflow-x:visible!important;scroll-snap-type:none!important;}#utdHighlights .utd-item{scroll-snap-align:none!important;padding:14px!important;}#utdHighlights .utd-title-row h3{font-size:16px!important;}#utdHighlights .utd-item p{font-size:13.5px!important;}}'
  ].join(' ');
  document.head.appendChild(style);
}
function iniciar(){
  instalarEstilos();
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