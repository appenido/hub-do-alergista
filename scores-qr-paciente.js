/* Formulário temporário do paciente — nunca usa localStorage, cookies ou cadastro. */
(function(){
'use strict';
const API="https://jpdtqtenlivxgjkyizcg.supabase.co/functions/v1/score-qr";
const KEY="sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j";
const allowed=["act","uct","dlqi","vasolfato","vasprurido","snot22"];
const params=new URLSearchParams(location.search), token=params.get("t")||"";
const code=token.split(".")[0], s=typeof SCORES==="object" ? SCORES[code] : null;
const intro=document.getElementById("intro"), form=document.getElementById("form");
const error=document.getElementById("error"), msg=document.getElementById("error-msg");
function invalid(text){form.hidden=true;intro.hidden=true;document.getElementById("progress").hidden=true;error.hidden=false;msg.textContent=text;}
if(history.replaceState)history.replaceState(null,"",location.pathname);
if(!allowed.includes(code)||!s||token.length>200||token.split(".").length!==4){invalid("Este código não é válido. Solicite um novo QR Code.");return;}
const timestamp=Number(token.split(".")[1]), age=Math.floor(Date.now()/1000)-timestamp;
if(!Number.isFinite(timestamp)||age>900||age< -60){invalid("O QR Code expirou. Solicite outro ao profissional.");return;}
document.getElementById("titulo").textContent=s.title.replace(/^[^\p{L}\p{N}]+/u,"");
document.getElementById("descricao").textContent=s.desc;
const wrap=document.getElementById("questions"), isVAS=code==="vasolfato"||code==="vasprurido";
if(isVAS){
  const title=code==="vasolfato"?"Qual a intensidade da perda de olfato percebida agora?":"Qual a intensidade da coceira nas últimas 24 horas?";
  const card=document.createElement("section");card.className="question";
  const lbl=document.createElement("label");lbl.textContent=title;lbl.htmlFor="vas";lbl.style.fontWeight="750";
  card.append(lbl);
  const tip=document.createElement("p");tip.className="small";tip.textContent=code==="vasolfato"?"0 = sem perda de olfato; 10 = perda completa percebida.":"0 = sem coceira; 10 = pior coceira imaginável.";card.append(tip);
  const input=document.createElement("input");input.id="vas";input.type="range";input.min="0";input.max="10";input.step="0.1";input.value="0";input.dataset.touched="0";
  const out=document.createElement("output");out.id="nvas";out.htmlFor="vas";out.textContent="Toque na escala para responder";
  input.addEventListener("input",()=>{input.dataset.touched="1";out.textContent=Number(input.value).toFixed(1).replace(".",",")+" / 10";progress();});
  input.addEventListener("pointerup",()=>{if(input.dataset.touched!=="1")input.dispatchEvent(new Event("input"));});
  input.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&input.dataset.touched!=="1")input.dispatchEvent(new Event("input"));});
  const endpoints=document.createElement("div");endpoints.style.cssText="display:flex;justify-content:space-between;font-size:12px;color:#60788a";
  endpoints.innerHTML="<span>0 · Nenhuma</span><span>10 · Máxima</span>";card.append(input,endpoints,out);wrap.append(card);
} else {
  s.fields.forEach((f,index)=>{
    const group=document.createElement("fieldset");group.className="question";
    const title=document.createElement("legend");title.textContent=f.lbl;group.append(title);
    (f.opts||[]).forEach((opt,i)=>{
      const label=document.createElement("label");label.className="choice";
      const input=document.createElement("input");input.type="radio";input.name="q"+index;input.value=String(i);input.required=true;
      input.addEventListener("change",progress);
      const span=document.createElement("span");span.textContent=opt;
      label.append(input,span);group.append(label);
    });
    wrap.append(group);
  });
}
const count=isVAS?1:s.fields.length, progressBox=document.getElementById("progress");
progressBox.hidden=false;form.hidden=false;
function progress(){
 let done=isVAS?(document.getElementById("vas").dataset.touched==="1"?1:0):s.fields.reduce((n,_,i)=>n+!!document.querySelector('input[name="q'+i+'"]:checked'),0);
 document.getElementById("progresstexto").textContent=done+" de "+count+" respostas";
 document.getElementById("progressfill").style.width=(done/count*100)+"%";
}
progress();
form.addEventListener("submit",async ev=>{
  ev.preventDefault();
  const status=document.getElementById("aviso"), btn=document.getElementById("enviar");
  const values=isVAS?[Number(document.getElementById("vas").value)]:s.fields.map((_,i)=>{
    const el=document.querySelector('input[name="q'+i+'"]:checked');return el?Number(el.value):null;
  });
  if(values.some(v=>v===null)||isVAS&&document.getElementById("vas").dataset.touched!=="1"){
    status.textContent="Responda todas as perguntas antes de enviar.";return;
  }
  if(!document.getElementById("consentimento").checked){status.textContent="Confirme a autorização para transmitir suas respostas.";return;}
  btn.disabled=true;btn.textContent="Transmitindo respostas…";status.textContent="";
  try{
    const r=await fetch(API,{method:"POST",headers:{"content-type":"application/json","apikey":KEY},body:JSON.stringify({action:"submit",token,values}),cache:"no-store",referrerPolicy:"no-referrer",credentials:"omit"});
    const data=await r.json().catch(()=>({}));
    if(!r.ok||!data.ok)throw new Error(data.error||"Não foi possível transmitir.");
    form.replaceChildren();
    form.hidden=true;intro.hidden=true;progressBox.hidden=true;
    const ok=document.getElementById("success");ok.style.display="block";
    document.getElementById("resultado").textContent="Pontuação: "+(Number(data.total).toFixed(isVAS?1:0).replace(".",","))+" / "+data.max;
    scrollTo({top:0,behavior:"smooth"});
  }catch(e){status.textContent=e.message||"Falha no envio. Verifique a conexão.";btn.disabled=false;btn.textContent="Tentar enviar novamente";}
});
})();