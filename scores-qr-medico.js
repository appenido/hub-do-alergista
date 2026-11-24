/* Scores por QR — último resultado preservado por score; sessão retomável em navegações. */
(function(){
'use strict';
const API="https://jpdtqtenlivxgjkyizcg.supabase.co/functions/v1/score-qr";
const SB="https://jpdtqtenlivxgjkyizcg.supabase.co";
const KEY="sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j";
const RESULT_KEY="hub_score_qr_last_v2";
const SESSION_KEY="hub_score_qr_sessions_v2";
const enabled=new Set(["act","uct","dlqi","vasolfato","vasprurido","snot22"]);
let client=null, channel=null, active=null, timer=null, poll=null, counter=0;
const d=id=>document.getElementById(id);
const lastFallback={},sessionFallback={};
function fromStorage(name,fallback){
 try{const v=JSON.parse(localStorage.getItem(name)||"{}");return v&&typeof v==="object"&&!Array.isArray(v)?v:fallback;}
 catch(_){return fallback;}
}
function toStorage(name,object){
 try{localStorage.setItem(name,JSON.stringify(object));}catch(_){}
}
function storedLast(key){return fromStorage(RESULT_KEY,lastFallback)[key]||null;}
function storeLast(key,value){
 const all=fromStorage(RESULT_KEY,lastFallback);all[key]=value;lastFallback[key]=value;toStorage(RESULT_KEY,all);
}
function storedSession(key){
 const s=fromStorage(SESSION_KEY,sessionFallback)[key];
 return s&&s.score===key&&typeof s.token==="string"&&
 /^[a-f0-9]{64}$/.test(s.readSecret||"")&&
 /^score-qr-[a-f0-9]{48}$/.test(s.topic||"")&&
 Number.isFinite(Number(s.expiresAt))?s:null;
}
function storeSession(s){
 const all=fromStorage(SESSION_KEY,sessionFallback);all[s.score]=s;
 sessionFallback[s.score]=s;toStorage(SESSION_KEY,all);
}
function stopNetwork(){
 if(timer){clearTimeout(timer);timer=null;}
 if(poll){clearInterval(poll);poll=null;}
 if(client&&channel){try{client.removeChannel(channel);}catch(_){}}
 channel=null;client=null;
}
function cleanup(){
 counter++;stopNetwork();active=null;
 const panel=d("score-qr-panel");if(panel)panel.remove();
}
function status(message,isError){
 const n=d("score-qr-status");
 if(n){n.textContent=message;n.style.color=isError?"#ad3730":"#415b6b";}
}
function restoreLast(key){
 const out=d("score-qr-result"), value=storedLast(key);
 if(!out)return;
 if(!value||!value.scoreText){out.classList.remove("show");return;}
 out.style.background=value.color||"linear-gradient(135deg,#0d1f2d,#17697a)";
 d("score-qr-res-n").textContent=value.scoreText;
 d("score-qr-res-lbl").textContent="Último resultado recebido · "+value.label;
 d("score-qr-res-desc").textContent=value.description;
 let when="";
 try{when=new Date(value.receivedAt).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"});}
 catch(_){}
 d("score-qr-date").textContent="Recebido em "+when+" · permanece disponível ao sair e voltar à tela.";
 out.classList.add("show");
}
function acceptResult(payload,id){
 if(id!==counter||!active||!d("overlay")?.classList.contains("open"))return;
 if(!payload||payload.score!==active||!Array.isArray(payload.values))return;
 const def=SCORES[active];if(!def)return;
 const count=active==="vasolfato"||active==="vasprurido"?1:def.fields.length;
 if(payload.values.length!==count||payload.values.some(v=>typeof v!=="number"||!Number.isFinite(v)))return;
 let calculated;
 try{calculated=def.calc(payload.values);}catch(_){return;}
 if(!calculated||typeof calculated.score!=="string")return;
 const total=Number(payload.total);
 const extracted=Number(calculated.score.split("/")[0].replace(",","."));
 if(!Number.isFinite(total)||!Number.isFinite(extracted)||Math.abs(extracted-total)>0.051)return;
 const receivedAt=typeof payload.submittedAt==="string"&&Number.isFinite(Date.parse(payload.submittedAt))
   ?payload.submittedAt:new Date().toISOString();
 const previous=storedLast(active);
 if(previous&&previous.clearedAt&&Date.parse(receivedAt)<=Date.parse(previous.clearedAt))return;
 if(previous&&previous.receivedAt&&Date.parse(receivedAt)<Date.parse(previous.receivedAt))return;
 storeLast(active,{
   scoreText:calculated.score,label:calculated.lbl,description:calculated.desc,
   color:calculated.color,receivedAt
 });
 restoreLast(active);
 const old=d("mResult");if(old)old.classList.remove("show");
 status("Respostas recebidas. O último resultado ficará salvo neste navegador.",false);
}
async function request(action,body){
 const response=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","apikey":KEY},
   body:JSON.stringify({action,...body}),cache:"no-store",referrerPolicy:"no-referrer",credentials:"omit"});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data.error||"Serviço de QR Code indisponível.");
 return data;
}
async function recover(s,id){
 if(!s||!s.readSecret||Date.now()-Number(s.expiresAt)>7*86400000)return;
 try{
   const data=await request("status",{token:s.token,readSecret:s.readSecret});
   if(id===counter&&active===s.score&&data.found&&data.payload)acceptResult(data.payload,id);
 }catch(e){
   if(id===counter&&active===s.score)status("Não foi possível sincronizar o resultado anterior. Verifique a conexão.",true);
 }
}
function disableQR(){
 const image=d("score-qr-image");if(image)image.replaceChildren();
 const link=d("score-qr-url");if(link){link.removeAttribute("href");link.textContent="";}
 const copy=d("score-qr-copy");if(copy)copy.hidden=true;
}
function showQR(s,id){
 if(id!==counter||active!==s.score)return;
 const site="https://hubdoalergista.pages.dev/score-paciente.html?t="+encodeURIComponent(s.token);
 const image=d("score-qr-image");if(!image)return;
 image.replaceChildren();
 try{new window.QRCode(image,{text:site,width:256,height:256,colorDark:"#0d1f2d",
   colorLight:"#ffffff",correctLevel:window.QRCode.CorrectLevel.M});}
 catch(_){status("Falha ao desenhar o QR Code. Utilize o link abaixo.",true);}
 const link=d("score-qr-url");if(link){link.href=site;link.textContent="Abrir formulário do paciente";}
 const copy=d("score-qr-copy");
 if(copy){
   copy.hidden=false;copy.textContent="Copiar link";
   copy.onclick=async()=>{try{await navigator.clipboard.writeText(site);copy.textContent="Link copiado";}
     catch(_){status("Abra o formulário pelo link para copiar seu endereço.",true);}};
 }
}
function resumeSession(s,id){
 if(id!==counter||active!==s.score)return;
 stopNetwork();
 if(!window.supabase||!window.QRCode){
   status("Bibliotecas de QR Code indisponíveis. Recarregue a página com internet.",true);return;
 }
 const ms=Number(s.expiresAt)-Date.now();
 if(ms<=0){disableQR();status("QR Code anterior expirado. O último resultado permanece disponível.",false);return;}
 showQR(s,id);
 status("QR Code retomado. Ele permanece válido até o término dos 15 minutos, mesmo após sair e voltar à tela.",false);
 client=window.supabase.createClient(SB,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 channel=client.channel(s.topic,{config:{private:false,broadcast:{self:false}}});
 channel.on("broadcast",{event:"score-result"},message=>acceptResult(message.payload,id));
 channel.subscribe(state=>{
   if(id!==counter)return;
   if(state==="SUBSCRIBED")status("QR Code ativo. O último resultado aparece abaixo e não será perdido ao navegar.",false);
   else if(state==="CHANNEL_ERROR"||state==="TIMED_OUT"||state==="CLOSED")
     status("Recepção em tempo real interrompida. As respostas permanecem recuperáveis pelo servidor.",true);
 });
 // Consulta de recuperação também cobre falhas do canal em tempo real.
 poll=setInterval(()=>{if(id===counter&&active===s.score)recover(s,id);},8000);
 timer=setTimeout(()=>{
   if(id!==counter||active!==s.score)return;
   recover(s,id);stopNetwork();disableQR();
   status("QR Code expirado. Para outro paciente, gere um novo QR Code. O último resultado continua visível.",false);
 },ms);
}
async function createSession(key,id){
 const button=d("score-qr-renovar");if(button)button.disabled=true;
 status("Preparando QR Code protegido…",false);
 try{
   if(!window.supabase||!window.QRCode)throw new Error("Recursos do QR Code não carregados. Recarregue a página.");
   const data=await request("create",{score:key});
   if(id!==counter||key!==active)return;
   if(!data.token||!/^score-qr-[a-f0-9]{48}$/.test(data.topic||"")||
      !/^[a-f0-9]{64}$/.test(data.readSecret||"")||!Number.isFinite(Number(data.expiresAt)))
      throw new Error("A sessão retornada pelo servidor está incompleta.");
   const s={token:data.token,topic:data.topic,readSecret:data.readSecret,
     score:key,expiresAt:Number(data.expiresAt)};
   storeSession(s);
   resumeSession(s,id);
 }catch(e){if(id===counter)status(e.message||"Falha ao gerar QR Code.",true);}
 finally{if(id===counter&&button)button.disabled=false;}
}
async function boot(key,id){
 const s=storedSession(key);
 if(s){
   // Recupera primeiro o envio ocorrido enquanto a tela estava fechada.
   await recover(s,id);
   if(id!==counter||active!==key)return;
   if(Number(s.expiresAt)>Date.now()+1000){resumeSession(s,id);return;}
 }
 await createSession(key,id);
}
function appendPanel(key){
 const fields=d("mFields");if(!fields)return;
 const panel=document.createElement("section");panel.id="score-qr-panel";
 panel.style.cssText="background:#f5fafb;border:1px solid #b6d8df;border-radius:12px;padding:13px;margin:13px 0;color:#0d1f2d;text-align:center";
 panel.innerHTML='<div style="font-size:14px;font-weight:750">Preenchimento pelo paciente via QR Code</div>'
 +'<p style="font-size:11px;line-height:1.6;margin:7px 0 10px;color:#496878">O paciente responde no celular e o último resultado permanece disponível neste navegador, mesmo após fechar esta tela. O QR Code vale 15 minutos; envios feitos enquanto você navega pelo Hub podem ser recuperados ao retornar. Sem nome ou cadastro do paciente.</p>'
 +'<div id="score-qr-image" style="display:flex;justify-content:center;align-items:center;width:min(100%,296px);padding:12px;margin:10px auto;min-height:0;border:1px solid #dae5e9;border-radius:14px;background:#fff;overflow:hidden"></div>'
 +'<div id="score-qr-result" class="score-result" style="margin:10px auto 12px;padding:18px 14px" role="status" aria-live="polite" aria-atomic="true"><div class="res-n" id="score-qr-res-n">—</div><div class="res-lbl" id="score-qr-res-lbl">—</div><div class="res-desc" id="score-qr-res-desc">—</div><div id="score-qr-date" style="font-size:11px;margin-top:10px;opacity:.9"></div></div>'
 +'<div id="score-qr-status" role="status" aria-live="polite" style="font-size:11.5px;min-height:34px;line-height:1.5;color:#496878">Preparando sessão…</div>'
 +'<div style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap;margin:8px 0"><button type="button" id="score-qr-renovar" class="btn btn-sm">Gerar novo QR Code</button><button type="button" id="score-qr-copy" class="btn btn-sm" hidden>Copiar link</button><button type="button" id="score-qr-clear" class="btn btn-sm">Apagar último resultado</button></div>'
 +'<a id="score-qr-url" style="font-size:11.5px;color:#17697a;overflow-wrap:anywhere" target="_blank" rel="noopener noreferrer"></a>';
 fields.parentNode.insertBefore(panel,fields);
 d("score-qr-renovar").addEventListener("click",async e=>{
   e.stopPropagation();if(active!==key)return;
   const id=counter;
   const prev=storedSession(key);if(prev)await recover(prev,id);
   if(id!==counter||active!==key)return;
   stopNetwork();disableQR();await createSession(key,id);
 });
 d("score-qr-clear").addEventListener("click",e=>{
   e.stopPropagation();if(active!==key)return;
   storeLast(key,{clearedAt:new Date().toISOString()});
   restoreLast(key);status("Resultado removido deste navegador. Um novo envio poderá aparecer aqui.",false);
 });
}
function activatePrurido(){
 const inp=d("vasp1");if(!inp)return;
 inp.type="number";inp.min="0";inp.max="10";inp.step="0.1";inp.value="";inp.placeholder="0 a 10";
 const slide=document.createElement("input");slide.type="range";slide.min="0";slide.max="10";slide.step="0.1";slide.value="0";
 slide.style.cssText="width:100%;accent-color:#17697a;display:block;margin-top:12px";
 const label=document.createElement("div");label.style.cssText="font-size:11px;color:#64748b;margin:6px 0";
 label.textContent="0 — Nenhuma coceira · 10 — Pior coceira imaginável";
 slide.addEventListener("input",()=>{inp.value=slide.value;});
 inp.addEventListener("input",()=>{const n=Number(inp.value);if(inp.value!==""&&n>=0&&n<=10)slide.value=inp.value;});
 inp.after(slide,label);
}
const original=window.openScore;
if(typeof original!=="function")return;
window.openScore=function(key){
 cleanup();
 original.apply(this,arguments);
 if(key==="vasprurido")activatePrurido();
 if(!enabled.has(key))return;
 active=key;
 appendPanel(key);
 restoreLast(key);
 boot(key,counter);
};
const oldClose=window.closeModal;
if(typeof oldClose==="function"){
 window.closeModal=function(){cleanup();return oldClose.apply(this,arguments);};
}
const overlay=d("overlay");
if(overlay){
 new MutationObserver(()=>{if(!overlay.classList.contains("open")&&active!==null)cleanup();})
 .observe(overlay,{attributes:true,attributeFilter:["class"]});
}

/* GAD-7: card do Hub, coleta profissional com validação e sessão QR já existente. */
enabled.add("gad7");
(function mountGad7Card(){
  const page=d("page-scores"), list=page&&page.querySelector(".gap-list");
  if(!list||page.querySelector('[data-score="gad7"]'))return;
  const card=document.createElement("div");
  card.className="guide-card gad7-score-card";
  card.dataset.score="gad7";
  card.setAttribute("tabindex","0");
  card.setAttribute("role","button");
  card.setAttribute("aria-label","Abrir GAD-7 e QR Code para preenchimento pelo paciente");
  card.style.cssText="cursor:pointer;border-left:3px solid #9778b5;background:linear-gradient(100deg,#fff 76%,#f5f0fa);";
  card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">'
    +'<div><div style="font-size:16px;font-weight:800;color:var(--navy)">GAD-7</div>'
    +'<div style="font-size:11px;color:var(--gray-500)">Rastreamento de ansiedade · 0–21 · QR Code</div></div>'
    +'<div style="display:flex;align-items:center;gap:8px">'
    +'<button type="button" class="btn btn-sm btn-fav-score" data-score-name="GAD-7" title="Favoritar score" aria-label="Favoritar GAD-7" style="font-size:13px;padding:4px 8px;background:transparent;border:none;color:var(--gray-300)">⭐</button>'
    +'<svg width="38" height="38" viewBox="0 0 38 38" role="img" aria-label="Cérebro" style="flex-shrink:0"><defs><linearGradient id="gad7-icon-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7457a2"/><stop offset="1" stop-color="#c9a84c"/></linearGradient></defs><rect x="1" y="1" width="36" height="36" rx="10" fill="#f0ebf8"/><path d="M19 11c-3-4-8-1-8 2-4 1-5 6-1 8-2 4 3 7 6 4 2 3 3 0 3-1V11Zm0 0c3-4 8-1 8 2 4 1 5 6 1 8 2 4-3 7-6 4-2 3-3 0-3-1V11Z" fill="none" stroke="url(#gad7-icon-gradient)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17l3 2-2 3m13-5-3 2 2 3" stroke="#c19d54" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></div></div>'
    +'<div class="score-purpose">Para que serve: avalia sintomas de ansiedade nas últimas duas semanas. Preenchimento pelo médico ou paciente via QR Code.</div>'
    +'<div class="bar-bg" style="margin-top:8px"><div class="bar-fill" style="width:70%;background:linear-gradient(90deg,#7c60a6,#c9a84c)"></div></div>'
    +'<button type="button" class="sp-btn" style="margin-top:10px;background:#74579b">Aplicar GAD-7 ou gerar QR Code →</button>';
  list.insertBefore(card,list.children[2]||null);
  card.addEventListener("keydown",ev=>{
    if((ev.key==="Enter"||ev.key===" ")&&!ev.target.closest("button")){
      ev.preventDefault();window.openScore("gad7");
    }
  });
})();
const gadPreviousOpen=window.openScore;
window.openScore=function(key){
  gadPreviousOpen.apply(this,arguments);
  if(key!=="gad7")return;
  const container=d("mFields");
  if(!container)return;
  for(const f of SCORES.gad7.fields){
    const select=d(f.id);
    if(!select)continue;
    const option=document.createElement("option");
    option.value="";option.textContent="Selecione uma resposta";option.disabled=true;option.selected=true;
    select.prepend(option);select.value="";select.required=true;
    select.addEventListener("change",()=>{
      const notice=d("gad7-manual-warning");
      if(notice)notice.textContent="";
      const result=d("mResult");if(result)result.classList.remove("show");
    });
  }
  const info=document.createElement("div");
  info.className="sf";
  info.style.cssText="border:1px solid #dfd5ea;border-radius:12px;padding:13px;margin:12px 0;background:#f8f5fc;color:#425467;font-size:11.5px;line-height:1.65";
  info.innerHTML='<div id="gad7-manual-warning" role="alert" style="font-weight:700;color:#a43e3e"></div>'
    +'Interpretação: 0–4 mínimos · 5–9 leves · 10–14 moderados · 15–21 graves. O ponto de corte ≥ 10 indica necessidade de avaliação clínica, não diagnóstico.'
    +'<div style="margin-top:7px">Referências: <a href="https://doi.org/10.1001/archinte.166.10.1092" target="_blank" rel="noopener noreferrer">Spitzer et al. (2006)</a> · <a href="https://recursos.opas.org.br/en/tools/gad-7" target="_blank" rel="noopener noreferrer">OPAS</a>.</div>';
  container.append(info);
};
const gadPreviousCalc=window.doCalc;
if(typeof gadPreviousCalc==="function"){
  window.doCalc=function(){
    if(window.currentScore==="gad7"){
      const missing=SCORES.gad7.fields.find(f=>!d(f.id)||d(f.id).value==="");
      if(missing){
        const notice=d("gad7-manual-warning");
        if(notice)notice.textContent="Responda as sete perguntas antes de calcular.";
        const input=d(missing.id);if(input)input.focus();
        return;
      }
    }
    return gadPreviousCalc.apply(this,arguments);
  };
}

})();