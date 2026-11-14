/* Hub do Alergista — métricas de uso com autorização expressa e sem rastreio identificável.
   Não lê campos de formulários, buscas, pacientes, URLs completas, e-mails ou respostas clínicas. */
(function(){
'use strict';
if(!window.crypto||!crypto.randomUUID)return;
// Central administrativa é um painel privado e não é instrumentada.
if(/^\/central-hub(?:\.html)?\/?$/.test(location.pathname)||
   document.querySelector('meta[name="hub-analytics"][content="disabled"]'))return;
const CHOICE_KEY='hub_analytics_choice_v2';
const OWNER_EXCLUSION_KEY='hub_analytics_owner_excluded_v1';
function ownerExcluded(){
  try{return localStorage.getItem(OWNER_EXCLUSION_KEY)==='1';}catch(_){return false;}
}
function disableOwnerAnalytics(){
  if(!ownerExcluded())return;
  enabled=false;
  try{localStorage.setItem(CHOICE_KEY,'nao');}catch(_){}
  D.getElementById('hubAnalyticsConsent')?.remove();
}
const session=crypto.randomUUID();
const D=document;
let enabled=false,prev=null,enteredAt=Date.now(),sent=0,lastClick=0;
function escolha(){try{return localStorage.getItem(CHOICE_KEY)||'';}catch(_){return '';}}
function salvar(opcao){try{localStorage.setItem(CHOICE_KEY,opcao);}catch(_){}}
function pagina(){const el=D.querySelector('.page.active');return (el?.id||'page-dashboard').replace(/^page-/,'').replace(/[^a-zA-Z0-9_.:-]/g,'').slice(0,64)||'dashboard';}
function tela(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true?'PWA':'navegador';}
function tamanho(){return innerWidth<640?'pequena':innerWidth<1100?'media':'grande';}
function referencia(){
  try{if(!document.referrer)return 'direto';const host=new URL(document.referrer).hostname.toLowerCase();
    return host===location.hostname?'interno':host.replace(/[^a-z0-9.:-]/g,'').slice(0,100)||'direto';
  }catch(_){return 'direto';}
}
function enviar(tipo,feat,acao,segundos,beacon){
  if(!enabled||ownerExcluded()||sent++>1500)return;
  const payload=JSON.stringify({session_key:session,event_type:tipo,
    feature:(feat||'dashboard').slice(0,64),action:(acao||'-').slice(0,80),
    seconds_visible:Math.max(0,Math.min(3600,Math.floor(segundos||0))),
    display_mode:tela(),viewport:tamanho(),referrer_host:referencia()});
  if(beacon&&navigator.sendBeacon){
    navigator.sendBeacon('/analytics',new Blob([payload],{type:'application/json'}));
    return;
  }
  fetch('/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true,credentials:'same-origin'}).catch(()=>{});
}
function saida(){
  const seconds=Math.floor((Date.now()-enteredAt)/1000);
  if(seconds>=2)enviar('screen_time',prev||pagina(),'-',Math.min(seconds,3600),true);
  enteredAt=Date.now();
}
function mudou(nova){
  if(!enabled||!nova||nova===prev)return;
  if(prev)saida();
  prev=nova;enteredAt=Date.now();
  enviar('page_view',nova,'-',0,false);
}
function acao(el){
  const id=el.getAttribute('data-analytics')||el.id;
  if(id && /^[a-zA-Z0-9_.:-]{1,80}$/.test(id))return id;
  const inline=(el.getAttribute('onclick')||'').match(/^\s*(?:return\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
  if(inline)return inline[1].slice(0,80);
  if(el.tagName==='A'){
    try{const href=new URL(el.href,location.href);
      if(href.origin!==location.origin)return 'link_externo';
      return 'link_interno';
    }catch(_){return 'link';}
  }
  const classes=String(el.className||'').split(/\s+/);
  const cls=classes.find(c=>/^(?:btn|nav|tab|card|score|tool|hub)[a-zA-Z0-9_-]*$/.test(c));
  return (cls||el.tagName.toLowerCase()).replace(/[^a-zA-Z0-9_.:-]/g,'').slice(0,80)||'click';
}
function cliques(ev){
  if(!enabled||!ev.isTrusted)return;
  const el=ev.target.closest('button,a,[role="button"],[onclick],.quick-card');
  if(!el||el.closest('[data-analytics-ignore],#hubAnalyticsConsent'))return;
  if(el.matches('input,textarea,select,[contenteditable="true"]'))return;
  const now=Date.now();if(now-lastClick<160)return;lastClick=now;
  enviar('click',pagina(),acao(el),0,false);
}

/* Observabilidade técnica opt-in: somente números e categorias, nunca mensagens ou URLs. */
let healthStarted=false,healthFlushed=false,healthLcp=0,healthCls=0,healthLatency=0,healthErrors=0;
function sendHealth(metric,value,beacon){
  if(!enabled||ownerExcluded()||!Number.isFinite(value)||value<0)return;
  const payload=JSON.stringify({session_key:session,metric,feature:pagina(),
    value:Math.min(300000,Math.round(value*1000)/1000)});
  if(beacon&&navigator.sendBeacon){
    navigator.sendBeacon('/health-analytics',new Blob([payload],{type:'application/json'}));
  }else{
    fetch('/health-analytics',{method:'POST',headers:{'Content-Type':'application/json'},
      body:payload,credentials:'same-origin',keepalive:true}).catch(()=>{});
  }
}
function flushHealth(){
  if(!enabled||ownerExcluded()||!healthStarted||healthFlushed)return;
  healthFlushed=true;
  if(healthLcp>0)sendHealth('lcp_ms',healthLcp,true);
  sendHealth('cls_score',healthCls,true);
  if(healthLatency>0)sendHealth('interaction_latency_ms',healthLatency,true);
}
function startHealth(){
  if(healthStarted||!window.performance)return;
  healthStarted=true;
  try{
    const nav=performance.getEntriesByType('navigation')[0];
    if(nav){
      if(nav.responseStart>0)sendHealth('ttfb_ms',Math.max(0,nav.responseStart-nav.requestStart),false);
      if(nav.domContentLoadedEventEnd>0)sendHealth('dom_ready_ms',nav.domContentLoadedEventEnd,false);
    }
  }catch(_){}
  if(typeof PerformanceObserver==='function'){
    for(const [name,record] of [
      ['largest-contentful-paint',e=>{healthLcp=Math.max(healthLcp,e.startTime||0);}],
      ['layout-shift',e=>{if(!e.hadRecentInput)healthCls+=e.value||0;}],
      ['event',e=>{if(e.interactionId&&e.duration>healthLatency)healthLatency=e.duration;}]
    ]){
      try{
        if(PerformanceObserver.supportedEntryTypes?.includes(name)){
          const observer=new PerformanceObserver(list=>{for(const entry of list.getEntries())record(entry);});
          observer.observe({type:name,buffered:true,durationThreshold:40});
        }
      }catch(_){}
    }
  }
  window.addEventListener('error',ev=>{
    // Ignorar falhas de imagem/recurso: contar somente erros JavaScript globais.
    // Nunca registrar mensagem, arquivo, stack trace, conteúdo clínico ou URL.
    if(ev.target!==window||typeof ev.message!=='string')return;
    if(enabled&&healthErrors++<20)sendHealth('js_error',1,false);
  },{capture:true,passive:true});
  window.addEventListener('unhandledrejection',()=>{
    if(enabled&&healthErrors++<20)sendHealth('js_error',1,false);
  },{passive:true});
  window.addEventListener('offline',()=>{if(enabled)sendHealth('offline',1,false);},{passive:true});
  D.addEventListener('visibilitychange',()=>{if(D.hidden)flushHealth();});
  window.addEventListener('pagehide',flushHealth,{passive:true});
}

function iniciar(){
  if(enabled||ownerExcluded())return;enabled=true;
  prev=pagina();enteredAt=Date.now();
  enviar('session_start',prev,'-',0,false);
  startHealth();
  enviar('page_view',prev,'-',0,false);
  D.addEventListener('click',cliques,{capture:true,passive:true});
  D.querySelectorAll('.page').forEach(pg=>{
    new MutationObserver(()=>{if(pg.classList.contains('active'))mudou(pagina());})
      .observe(pg,{attributes:true,attributeFilter:['class']});
  });
  D.addEventListener('visibilitychange',()=>{
    if(D.hidden){saida();}else{enteredAt=Date.now();if(prev!==pagina())mudou(pagina());}
  });
  window.addEventListener('pagehide',saida,{passive:true});
}
function aviso(){
  if(ownerExcluded()||D.getElementById('hubAnalyticsConsent'))return;
  const el=D.createElement('aside');el.id='hubAnalyticsConsent';
  el.setAttribute('role','dialog');el.setAttribute('aria-label','Medição anônima de uso');
  el.setAttribute('data-analytics-ignore','');
  el.style.cssText='position:fixed;bottom:14px;left:14px;right:14px;margin:auto;max-width:650px;background:#fff;color:#24364f;border:1px solid #d6dfe8;border-radius:17px;padding:16px;z-index:2147482000;box-shadow:0 8px 34px #10243a33;font:14px/1.5 system-ui,sans-serif';
  el.innerHTML='<div style="margin-bottom:11px">O Hub gostaria de medir, sem identificação pessoal, quais seções e botões são mais utilizados. Após sua autorização, estimamos país, estado, cidade e posição aproximada pela infraestrutura de rede, sem armazenar IP ou utilizar GPS. Medimos também desempenho técnico e quantidade de erros, sem armazenar seus detalhes. Não coletamos dados clínicos ou buscas digitadas. Você pode recusar sem prejudicar seu acesso. <a href="/privacidade.html" style="color:#174d87">Privacidade</a>.</div><div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" id="hubAnRecusar" style="border:1px solid #aabacc;border-radius:9px;background:#fff;color:#254267;padding:9px 15px;font:inherit;cursor:pointer">Recusar</button><button type="button" id="hubAnAceitar" style="border:1px solid #184c83;border-radius:9px;background:#184c83;color:#fff;padding:9px 15px;font:inherit;cursor:pointer">Autorizar métricas</button></div>';
  D.body.appendChild(el);
  el.querySelector('#hubAnRecusar').onclick=()=>{salvar('nao');el.remove();};
  el.querySelector('#hubAnAceitar').onclick=()=>{salvar('sim');el.remove();iniciar();};
}
window.hubPreferenciasMetricas=function(){
  if(ownerExcluded()){disableOwnerAnalytics();return;}
  salvar('');enabled=false;aviso();
};
function principal(){
  if(ownerExcluded()){disableOwnerAnalytics();return;}
  if(escolha()==='sim')iniciar();
  else if(escolha()!=='nao')aviso();

}
// Uma autenticação válida em outra aba interrompe a coleta na aba já aberta.
window.addEventListener('storage',event=>{
  if(event.key===OWNER_EXCLUSION_KEY&&event.newValue==='1')disableOwnerAnalytics();
});
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',principal,{once:true});else principal();
})();
