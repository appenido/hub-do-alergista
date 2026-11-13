/* Hub do Alergista — métricas de uso com autorização expressa e sem rastreio identificável.
   Não lê campos de formulários, buscas, pacientes, URLs completas, e-mails ou respostas clínicas. */
(function(){
'use strict';
if(!window.crypto||!crypto.randomUUID)return;
const CHOICE_KEY='hub_analytics_choice_v2';
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
  if(!enabled||sent++>1500)return;
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
function iniciar(){
  if(enabled)return;enabled=true;
  prev=pagina();enteredAt=Date.now();
  enviar('session_start',prev,'-',0,false);
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
  if(D.getElementById('hubAnalyticsConsent'))return;
  const el=D.createElement('aside');el.id='hubAnalyticsConsent';
  el.setAttribute('role','dialog');el.setAttribute('aria-label','Medição anônima de uso');
  el.setAttribute('data-analytics-ignore','');
  el.style.cssText='position:fixed;bottom:14px;left:14px;right:14px;margin:auto;max-width:650px;background:#fff;color:#24364f;border:1px solid #d6dfe8;border-radius:17px;padding:16px;z-index:2147482000;box-shadow:0 8px 34px #10243a33;font:14px/1.5 system-ui,sans-serif';
  el.innerHTML='<div style="margin-bottom:11px">O Hub gostaria de medir, sem identificação pessoal, quais seções e botões são mais utilizados. Após sua autorização, estimamos país, estado, cidade e posição aproximada pela infraestrutura de rede, sem armazenar IP ou utilizar GPS. Não coletamos dados clínicos ou buscas digitadas. Você pode recusar sem prejudicar seu acesso. <a href="/privacidade.html" style="color:#174d87">Privacidade</a>.</div><div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" id="hubAnRecusar" style="border:1px solid #aabacc;border-radius:9px;background:#fff;color:#254267;padding:9px 15px;font:inherit;cursor:pointer">Recusar</button><button type="button" id="hubAnAceitar" style="border:1px solid #184c83;border-radius:9px;background:#184c83;color:#fff;padding:9px 15px;font:inherit;cursor:pointer">Autorizar métricas</button></div>';
  D.body.appendChild(el);
  el.querySelector('#hubAnRecusar').onclick=()=>{salvar('nao');el.remove();};
  el.querySelector('#hubAnAceitar').onclick=()=>{salvar('sim');el.remove();iniciar();};
}
window.hubPreferenciasMetricas=function(){
  salvar('');enabled=false;aviso();
};
function linkCentral(){
  // O link é visível em Preferências; todos os dados continuam protegidos
  // pela autenticação Supabase, pelo papel de administrador e por RLS.
  const perfil=D.getElementById('page-perfil');
  if(!perfil||D.getElementById('hubLinkCentral'))return;
  const a=D.createElement('a');
  a.id='hubLinkCentral';a.href='/central-hub.html';
  a.setAttribute('aria-label','Abrir Central de acessos — login administrativo obrigatório');
  a.style.cssText='display:flex;align-items:center;gap:12px;margin:16px 16px 0;padding:15px 16px;background:#fff;border:1px solid #d7e2ec;border-radius:14px;color:#173c61;text-decoration:none;box-shadow:0 3px 14px #123a6310;font:inherit;min-width:0';
  a.innerHTML='<span aria-hidden="true" style="display:grid;place-items:center;width:43px;height:43px;flex:none;border-radius:13px;background:linear-gradient(145deg,#123a63,#27749b);color:white;box-shadow:0 5px 12px #123a6326"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 16 4-4 3 2 5-7"/><path d="M16 7h3v3"/></svg></span><span style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0"><span style="font-weight:750;font-size:14px;color:#123a63">Central de acessos</span><span style="font-size:11.5px;line-height:1.4;color:#64788c">Relatórios de visitas e funcionalidades · login restrito</span></span><span aria-hidden="true" style="color:#8ca1b5;font-size:22px">›</span>';
  perfil.insertBefore(a,perfil.lastElementChild);
}
function principal(){
  if(escolha()==='sim')iniciar();
  else if(escolha()!=='nao')aviso();
  linkCentral();
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',principal,{once:true});else principal();
})();
