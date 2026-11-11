/* Scores por QR: recepção privada em tempo real, sem histórico ou cadastro de paciente. */
(function(){
'use strict';
const API="https://jpdtqtenlivxgjkyizcg.supabase.co/functions/v1/score-qr";
const SB="https://jpdtqtenlivxgjkyizcg.supabase.co";
const KEY="sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j";
const enabled=new Set(["act","uct","dlqi","vasolfato","vasprurido","snot22"]);
let client=null, channel=null, active=null, timer=null, counter=0;
const d=id=>document.getElementById(id);
function cleanup(){
  counter++;active=null;
  if(timer){clearTimeout(timer);timer=null;}
  if(client&&channel){try{client.removeChannel(channel);}catch(_){}}
  channel=null;
  const existing=d("score-qr-panel");if(existing)existing.remove();
}
function status(message,isError){
 const node=d("score-qr-status");
 if(node){node.textContent=message;node.style.color=isError?"#ad3730":"#415b6b";}
}
function result(payload,id){
 if(id!==counter||!active||!d("overlay").classList.contains("open"))return;
 if(!payload||payload.score!==active||!Array.isArray(payload.values))return;
 const def=SCORES[active];if(!def)return;
 const count=active==="vasolfato"||active==="vasprurido"?1:def.fields.length;
 if(payload.values.length!==count)return;
 let calculated;
 try{calculated=def.calc(payload.values);}catch(_){return;}
 if(!calculated||typeof calculated.score!=="string")return;
 const numeric=Number(payload.total);
 if(!Number.isFinite(numeric))return;
 const ref=Number(calculated.score.split("/")[0].replace(",","."));if(!Number.isFinite(ref)||Math.abs(ref-numeric)>0.051)return;
 // Resultado recebido aparece no próprio painel do QR, sem rolar até o rodapé do modal.
 const output=d("score-qr-result");if(!output)return;
 output.style.background=calculated.color;
 d("score-qr-res-n").textContent=calculated.score;
 d("score-qr-res-lbl").textContent="Recebido do celular · "+calculated.lbl;
 d("score-qr-res-desc").textContent=calculated.desc;
 const oldOutput=d("mResult");if(oldOutput)oldOutput.classList.remove("show");
 output.classList.add("show");
 status("Respostas recebidas e calculadas. Resultado logo abaixo do QR Code.",false);
}
async function createScoreSession(key,id){
 const button=d("score-qr-renovar");if(button)button.disabled=true;
 status("Criando sessão protegida…",false);
 try{
  if(!window.supabase||!window.QRCode)throw new Error("Os recursos de QR Code ainda não foram carregados. Recarregue a página com internet ativa.");
  // Sessão temporária sem login nem cadastro: código de 192 bits, assinado e válido 15 minutos.
  const response=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","apikey":KEY},
   body:JSON.stringify({action:"create",score:key}),cache:"no-store",referrerPolicy:"no-referrer"});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.token||!data.topic)throw new Error(data.error||"Não foi possível criar o QR Code.");
  if(id!==counter)return;
  if(!/^score-qr-[0-9a-f]{48}$/.test(data.topic))throw new Error("Canal de transmissão inválido.");
  const site="https://hubdoalergista.pages.dev/score-paciente.html?t="+encodeURIComponent(data.token);
  if(client&&channel){try{await client.removeChannel(channel)}catch(_){}}channel=null;
  client=window.supabase.createClient(SB,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  channel=client.channel(data.topic,{config:{private:false,broadcast:{self:false}}});
  const receiveChannel=channel;
  receiveChannel.on("broadcast",{event:"score-result"},m=>result(m.payload,id));
  status("Conectando à recepção de respostas…",false);
  receiveChannel.subscribe(st=>{
    if(id!==counter)return;
    if(st==="SUBSCRIBED"){
      const node=d("score-qr-image");if(!node)return;
      node.replaceChildren();
      try{new window.QRCode(node,{text:site,width:256,height:256,colorDark:"#0d1f2d",colorLight:"#ffffff",correctLevel:window.QRCode.CorrectLevel.M});}
      catch(_){status("O QR Code não pôde ser desenhado. Use o link do formulário abaixo.",true);}
      const url=d("score-qr-url");if(url){url.href=site;url.textContent="Abrir formulário do paciente";}
      const copy=d("score-qr-copy");if(copy){copy.hidden=false;copy.onclick=async()=>{try{await navigator.clipboard.writeText(site);copy.textContent="Link copiado";}catch(_){status("Use o link abaixo para abrir ou copiar o endereço.",true);}};}
      if(node.childNodes.length)status("QR Code ativo. Aguarde o paciente responder e tocar em Enviar.",false);
    }else if(st==="CHANNEL_ERROR"||st==="TIMED_OUT"||st==="CLOSED"){
      const image=d("score-qr-image");if(image)image.replaceChildren();
      const link=d("score-qr-url");if(link){link.removeAttribute("href");link.textContent="";}
      const copy=d("score-qr-copy");if(copy)copy.hidden=true;
      status("Conexão interrompida. O QR Code foi desativado para evitar perda de respostas. Gere um novo código.",true);
    }
  });
  const life=Math.max(0,Number(data.expiresAt)-Date.now());
  timer=setTimeout(()=>{if(id!==counter)return;
   status("QR Code expirado. Clique em Gerar novo QR Code.",true);
   const node=d("score-qr-image");if(node)node.replaceChildren();
   const link=d("score-qr-url");if(link){link.removeAttribute("href");link.textContent="";}
   const copy=d("score-qr-copy");if(copy)copy.hidden=true;
   if(client&&channel){client.removeChannel(channel).catch(()=>{});channel=null;}
  },life);
 }catch(e){if(id===counter)status(e.message||"Falha de conexão.",true);}
 finally{if(id===counter&&d("score-qr-renovar"))d("score-qr-renovar").disabled=false;}
}
function appendPanel(key){
 const fields=d("mFields");if(!fields)return;
 const panel=document.createElement("section");panel.id="score-qr-panel";
 panel.style.cssText="background:#f5fafb;border:1px solid #b6d8df;border-radius:12px;padding:13px;margin:13px 0;color:#0d1f2d;text-align:center";
 panel.innerHTML='<div style="font-size:14px;font-weight:750">Preenchimento pelo paciente via QR Code</div>'
 +'<p style="font-size:11px;line-height:1.6;margin:7px 0 10px;color:#496878">O paciente responde no celular. Ao tocar em Enviar, o resultado aparece imediatamente abaixo do QR Code nesta tela. Sessão válida por 15 minutos, sem identificação nem histórico.</p>'
 +'<div id="score-qr-image" style="display:flex;justify-content:center;align-items:center;width:min(100%,296px);padding:12px;margin:10px auto;min-height:0;border:1px solid #dae5e9;border-radius:14px;background:#fff;overflow:hidden"></div>'
 +'<div id="score-qr-result" class="score-result" style="margin:10px auto 12px;padding:18px 14px" role="status" aria-live="polite" aria-atomic="true"><div class="res-n" id="score-qr-res-n">—</div><div class="res-lbl" id="score-qr-res-lbl">—</div><div class="res-desc" id="score-qr-res-desc">—</div></div>'
 +'<div id="score-qr-status" role="status" aria-live="polite" style="font-size:11.5px;min-height:34px;line-height:1.5;color:#496878">Preparando sessão…</div>'
 +'<div style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap;margin:8px 0"><button type="button" id="score-qr-renovar" class="btn btn-sm">Gerar novo QR Code</button><button type="button" id="score-qr-copy" class="btn btn-sm" hidden>Copiar link</button></div>'
 +'<a id="score-qr-url" style="font-size:11.5px;color:#17697a;overflow-wrap:anywhere" target="_blank" rel="noopener noreferrer"></a>';
 fields.parentNode.insertBefore(panel,fields);
 d("score-qr-renovar").addEventListener("click",e=>{e.stopPropagation();if(active!==key)return;counter++;cleanupChannelOnly();createScoreSession(key,counter);});
}
function cleanupChannelOnly(){
 if(timer){clearTimeout(timer);timer=null;}
 if(client&&channel){try{client.removeChannel(channel)}catch(_){}}channel=null;
 const node=d("score-qr-image");if(node)node.replaceChildren();
 const link=d("score-qr-url");if(link){link.removeAttribute("href");link.textContent="";}
 const cp=d("score-qr-copy");if(cp)cp.hidden=true;
 const inlineResult=d("score-qr-result");
 if(inlineResult){inlineResult.classList.remove("show");inlineResult.style.background="";}
}
function activatePrurido(){
 const inp=d("vasp1");if(!inp)return;
 inp.type="number";inp.min="0";inp.max="10";inp.step="0.1";inp.value="";inp.placeholder="0 a 10";
 const slide=document.createElement("input");slide.type="range";slide.min="0";slide.max="10";slide.step="0.1";slide.value="0";
 slide.style.cssText="width:100%;accent-color:#17697a;display:block;margin-top:12px";
 const label=document.createElement("div");label.style.cssText="font-size:11px;color:#64748b;margin:6px 0";label.textContent="0 — Nenhuma coceira · 10 — Pior coceira imaginável";
 slide.addEventListener("input",()=>{inp.value=slide.value;});
 inp.addEventListener("input",()=>{let n=Number(inp.value);if(inp.value!==""&&n>=0&&n<=10)slide.value=inp.value;});
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
 createScoreSession(key,counter);
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
})();
