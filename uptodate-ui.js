/* Radar UpToDate · cartões compactos com títulos públicos completos.
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
  // O cartão mostra apenas o título integral: compacto, sem resumo, metadados ou texto truncado.
  var titulo=String(item.titlePt||item.title||'Atualização clínica');
  var card=el('a','utd-item'+(posicao===0?' utd-feature':''));
  card.href=ORIGEM;
  card.target='_blank';
  card.rel='noopener noreferrer';
  card.title='Consultar novidades do UpToDate na fonte oficial';
  card.setAttribute('aria-label',titulo+'. Abrir o índice oficial do UpToDate.');
  card.appendChild(el('h3','',titulo));
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
  style.textContent="\n#page-artigos #utdPanel{\n  box-sizing:border-box!important;min-width:0!important;\n  max-width:calc(100% - 24px)!important;\n  padding:12px 13px!important;\n  overflow-wrap:break-word!important;\n}\n#page-artigos #utdPanel .utd-head{\n  display:flex!important;align-items:center!important;flex-wrap:wrap!important;\n  gap:8px 12px!important;min-width:0!important;margin-bottom:9px!important;\n}\n#page-artigos #utdPanel .utd-head > div{\n  flex:1 1 205px!important;min-width:0!important;\n}\n#page-artigos #utdPanel .utd-brand{\n  display:inline-flex!important;align-items:center!important;\n  gap:5px!important;color:#135f8a!important;\n  font:800 16px/1.15 Manrope,Arial,sans-serif!important;\n  letter-spacing:-.02em!important;margin-left:7px!important;\n  vertical-align:middle!important;white-space:nowrap!important;\n}\n#page-artigos #utdPanel .utd-brand svg{\n  display:inline-block!important;width:1em!important;height:1em!important;\n  flex:0 0 1em!important;vertical-align:middle!important;\n  border-radius:3px!important;\n}\n#page-artigos #utdPanel .utd-eyebrow{\n  font-size:10px!important;line-height:1.3!important;\n  letter-spacing:.055em!important;\n}\n#page-artigos #utdPanel .utd-head h2{\n  font-size:14px!important;line-height:1.35!important;\n  margin:4px 0 0!important;overflow-wrap:break-word!important;\n}\n#page-artigos #utdPanel .utd-head p{display:none!important;}\n#page-artigos #utdPanel .utd-source{\n  flex:0 0 auto!important;white-space:nowrap!important;\n  font-size:10px!important;padding:6px 9px!important;\n}\n#page-artigos #utdHighlights.utd-highlights{\n  display:flex!important;flex-direction:column!important;\n  grid-template-columns:none!important;grid-template-rows:none!important;\n  grid-auto-flow:row!important;grid-auto-columns:auto!important;\n  gap:6px!important;width:100%!important;max-width:100%!important;\n  min-width:0!important;box-sizing:border-box!important;\n  padding:0!important;margin:0!important;\n  overflow-x:hidden!important;overflow-y:visible!important;\n  scroll-snap-type:none!important;scroll-behavior:auto!important;\n}\n#page-artigos #utdHighlights > .utd-item{\n  display:block!important;flex:0 0 auto!important;position:static!important;\n  grid-column:auto!important;grid-row:auto!important;\n  box-sizing:border-box!important;width:100%!important;\n  max-width:100%!important;min-width:0!important;\n  height:auto!important;min-height:0!important;max-height:none!important;\n  padding:9px 11px!important;margin:0!important;border-radius:9px!important;\n  border:1px solid #dce8ec!important;background:#f8fbfc!important;\n  overflow:visible!important;transform:none!important;\n  scroll-snap-align:none!important;text-decoration:none!important;\n}\n#page-artigos #utdHighlights > .utd-item:hover,\n#page-artigos #utdHighlights > .utd-item:focus-visible{\n  background:#eaf5f8!important;border-color:#87b6c3!important;\n}\n#page-artigos #utdHighlights > .utd-item h3{\n  display:block!important;box-sizing:border-box!important;width:100%!important;\n  max-width:100%!important;min-width:0!important;\n  padding:0!important;margin:0!important;\n  color:#17384b!important;font-size:13px!important;line-height:1.4!important;\n  letter-spacing:0!important;font-weight:750!important;text-align:left!important;\n  white-space:normal!important;word-break:normal!important;\n  overflow-wrap:break-word!important;overflow:visible!important;\n  text-overflow:clip!important;-webkit-line-clamp:unset!important;\n  -webkit-box-orient:initial!important;\n}\n#page-artigos #utdHighlights > .utd-more{\n  display:block!important;grid-column:auto!important;grid-row:auto!important;\n  align-self:flex-start!important;flex:none!important;\n  min-width:0!important;max-width:100%!important;\n  padding:6px 9px!important;margin:1px 0 0!important;\n  background:#eef7f9!important;border:1px solid #d7e8ed!important;\n  border-radius:8px!important;color:#12677e!important;\n  font:700 11px/1.35 Manrope,Arial,sans-serif!important;\n  text-align:left!important;white-space:normal!important;\n  overflow-wrap:break-word!important;\n}\n#page-artigos #utdPanel .utd-foot{\n  display:flex!important;flex-wrap:wrap!important;align-items:center!important;\n  gap:6px 10px!important;min-width:0!important;\n  margin-top:8px!important;font-size:9.5px!important;line-height:1.4!important;\n}\n#page-artigos #utdPanel #utdStatus{\n  flex:1 1 200px!important;min-width:0!important;overflow-wrap:break-word!important;\n}\n#page-artigos #utdPanel .utd-foot button{\n  flex:0 0 auto!important;font-size:9.5px!important;padding:5px 8px!important;\n}\n#page-artigos #utdPanel .utd-note{\n  font-size:9.5px!important;line-height:1.45!important;\n  margin-top:8px!important;\n}\n@media(min-width:780px){\n  #page-artigos #utdHighlights.utd-highlights{\n    display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;\n    grid-auto-flow:row!important;align-items:stretch!important;\n  }\n  #page-artigos #utdHighlights > .utd-more{grid-column:1/-1!important;}\n}\n@media(min-width:1180px){\n  #page-artigos #utdHighlights.utd-highlights{\n    grid-template-columns:repeat(3,minmax(0,1fr))!important;\n  }\n}\n@media(max-width:420px){\n  #page-artigos #utdPanel{\n    margin-left:12px!important;margin-right:12px!important;\n    padding:11px!important;\n  }\n  #page-artigos #utdPanel .utd-head{gap:7px!important;}\n  #page-artigos #utdPanel .utd-brand{font-size:14px!important;margin-left:5px!important;}\n  #page-artigos #utdHighlights > .utd-item h3{font-size:12.8px!important;}\n  #page-artigos #utdHighlights > .utd-item{padding:8px 10px!important;}\n}\n";
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