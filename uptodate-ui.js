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
  // CSS isolado: jamais combinar grid-auto-flow horizontal com grid-template-columns no celular.
  // Flex vertical é intencional até 899px, independente das regras antigas do índice.
  style.textContent=`
    #page-artigos #utdPanel{
      box-sizing:border-box;min-width:0;max-width:calc(100% - 24px);
      overflow-wrap:break-word;
    }
    #page-artigos #utdPanel .utd-head{
      display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px 12px;
      min-width:0;max-width:100%;
    }
    #page-artigos #utdPanel .utd-head > div{
      flex:1 1 210px;min-width:0;max-width:100%;
    }
    #page-artigos #utdPanel .utd-head h2{
      font-size:clamp(15px,3.6vw,19px)!important;line-height:1.3!important;
      overflow-wrap:break-word;
    }
    #page-artigos #utdHighlights.utd-highlights{
      display:flex!important;flex-direction:column!important;
      grid-template-columns:none!important;grid-auto-columns:auto!important;
      grid-auto-flow:row!important;grid-template-rows:none!important;
      gap:9px!important;width:100%!important;max-width:100%!important;
      min-width:0!important;box-sizing:border-box!important;
      overflow-x:hidden!important;overflow-y:visible!important;
      scroll-snap-type:none!important;scroll-behavior:auto!important;
      padding:0!important;margin:0!important;
    }
    #page-artigos #utdHighlights > .utd-item{
      display:flex!important;flex-direction:column!important;
      position:relative!important;flex:0 0 auto!important;
      grid-column:auto!important;grid-row:auto!important;
      width:100%!important;min-width:0!important;max-width:100%!important;
      min-height:0!important;max-height:none!important;height:auto!important;
      box-sizing:border-box!important;margin:0!important;padding:12px 13px!important;
      gap:7px!important;transform:none!important;scroll-snap-align:none!important;
      border-radius:12px!important;overflow:visible!important;
    }
    #page-artigos #utdHighlights .utd-title-row{
      display:flex!important;align-items:flex-start!important;flex-direction:row!important;
      gap:9px!important;width:100%!important;max-width:100%!important;
      min-width:0!important;box-sizing:border-box!important;
    }
    #page-artigos #utdHighlights .utd-title-row h3{
      display:block!important;flex:1 1 auto!important;
      min-width:0!important;max-width:100%!important;
      margin:0!important;font-size:15px!important;line-height:1.43!important;
      font-weight:800!important;letter-spacing:0!important;
      white-space:normal!important;word-break:normal!important;
      overflow-wrap:anywhere!important;overflow:visible!important;
      -webkit-line-clamp:unset!important;text-overflow:clip!important;
      text-align:left!important;
    }
    #page-artigos #utdHighlights .utd-source-mark{
      display:inline-flex!important;flex:0 0 30px!important;
      width:30px!important;height:30px!important;
      align-items:center!important;justify-content:center!important;
      box-sizing:border-box!important;border:1px solid #b9dcc9!important;
      border-radius:8px!important;background:#e7f5ee!important;color:#167443!important;
      font:800 19px/1 Manrope,Arial,sans-serif!important;
    }
    #page-artigos #utdHighlights .utd-meta{
      display:block!important;max-width:100%!important;
      white-space:normal!important;overflow:visible!important;
      text-overflow:clip!important;overflow-wrap:break-word!important;
      font-size:11px!important;line-height:1.4!important;
    }
    #page-artigos #utdHighlights .utd-item p{
      display:block!important;margin:0!important;
      font-size:13px!important;line-height:1.55!important;font-weight:400!important;
      white-space:normal!important;overflow:visible!important;
      overflow-wrap:break-word!important;-webkit-line-clamp:unset!important;
      text-align:left!important;
    }
    #page-artigos #utdHighlights .utd-item a{
      display:inline-block!important;align-self:flex-start!important;
      margin-top:3px!important;max-width:100%!important;
      font-size:11.5px!important;line-height:1.45!important;
      font-weight:700!important;white-space:normal!important;
      overflow-wrap:break-word!important;
    }
    #page-artigos #utdHighlights > .utd-more{
      display:block!important;flex:none!important;
      grid-column:auto!important;grid-row:auto!important;
      align-self:stretch!important;justify-self:stretch!important;
      box-sizing:border-box!important;width:100%!important;max-width:100%!important;
      min-width:0!important;margin:0!important;padding:10px 12px!important;
      text-align:left!important;white-space:normal!important;
      overflow-wrap:break-word!important;font-size:12px!important;line-height:1.4!important;
      color:#12677e!important;background:#f1f8fa!important;
      border:1px solid #d9e9ed!important;border-radius:9px!important;
    }
    #page-artigos #utdPanel .utd-foot{
      display:flex!important;flex-wrap:wrap!important;align-items:flex-start!important;
      gap:8px!important;min-width:0!important;max-width:100%!important;
      font-size:10px!important;line-height:1.5!important;
    }
    #page-artigos #utdPanel #utdStatus{
      flex:1 1 220px;min-width:0;overflow-wrap:break-word;
    }
    #page-artigos #utdPanel .utd-foot button{
      flex:0 0 auto;font-size:10.5px!important;line-height:1.4!important;
      padding:6px 9px!important;
    }
    #page-artigos #utdPanel .utd-note{
      font-size:10px!important;line-height:1.5!important;
    }
    @media(min-width:900px){
      #page-artigos #utdHighlights.utd-highlights{
        display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
        grid-auto-flow:row!important;align-items:stretch!important;
      }
      #page-artigos #utdHighlights > .utd-more{grid-column:1/-1!important;}
    }
    @media(max-width:420px){
      #page-artigos #utdPanel{margin-left:12px!important;margin-right:12px!important;padding:12px!important;}
      #page-artigos #utdHighlights .utd-title-row h3{font-size:14px!important;}
      #page-artigos #utdHighlights .utd-item p{font-size:12.5px!important;}
      #page-artigos #utdHighlights > .utd-item{padding:11px!important;}
      #page-artigos #utdPanel .utd-source{font-size:10px!important;white-space:normal!important;}
    }
  `;
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