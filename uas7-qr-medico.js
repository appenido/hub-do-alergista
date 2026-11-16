/* UAS7 no modal de Scores: QR dedicado, acompanhamento de semanas sucessivas. */
(function () {
"use strict";
const API="https://jpdtqtenlivxgjkyizcg.supabase.co/functions/v1/uas7-diario";
const BASE="https://hubdoalergista.pages.dev/";
const $=id=>document.getElementById(id);
let doctorKey="",generation=0,refreshTimer=null;
async function api(action,extras){
 const response=await fetch(API,{method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify(Object.assign({action},extras||{})),cache:"no-store",credentials:"omit"});
 const body=await response.json().catch(()=>({}));
 if(!response.ok||!body.ok)throw Error(body.erro||"Falha no serviço UAS7.");
 return body;
}
function stop(){
 generation++;doctorKey="";
 if(refreshTimer){clearInterval(refreshTimer);refreshTimer=null;}
}
function status(t){const node=$("uas7-qr-status");if(node)node.textContent=t;}
function makeButton(id,label){const b=document.createElement("button");b.type="button";b.id=id;b.className="btn btn-sm";b.textContent=label;return b;}
async function refresh(token,gen){
 if(gen!==generation||!doctorKey)return;
 try {
  const data=await api("professional-status",{token});
  if(gen!==generation)return;
  const node=$("uas7-qr-andamento");if(!node)return;
  const name=data.paciente?.nome||"Aguardando cadastro";
  node.textContent=name+" · Semana "+data.semanaAtual+" · "+data.respondidos+"/7 noites · "+(data.completo?"UAS7 "+data.total+"/42":"Parcial "+data.parcial+" pontos");
  const details=$("uas7-qr-details");
  if(details){
    const content=$("uas7-qr-details-content");content.replaceChildren();
    const person=document.createElement("p");
    person.style.cssText="font-size:12px;color:#31566a";
    person.textContent=data.paciente?("Paciente: "+data.paciente.nome+" · "+data.paciente.idade+" anos · "+data.paciente.cidade):"Paciente ainda não identificado.";
    content.append(person);
    const table=document.createElement("table");
    table.style.cssText="width:100%;font-size:12px;border-collapse:collapse";
    const heading=document.createElement("tr");
    ["Sem.","Data","Pápulas","Prurido","Total"].forEach(x=>{
      const h=document.createElement("th");h.textContent=x;h.style.cssText="padding:6px 3px;border-bottom:1px solid #dbe6eb;text-align:left";heading.append(h);
    });table.append(heading);
    for(const item of (data.todasAsRespostas||data.registros)){
      const tr=document.createElement("tr");
      [String(data.semanas.find(x=>x.inicio&&item.data>=x.inicio&&item.data<=x.fim)?.numero||1),item.data,item.papulas,item.prurido,item.pontos+"/6"].forEach(x=>{
        const td=document.createElement("td");td.textContent=String(x);
        td.style.cssText="padding:7px 3px;border-bottom:1px solid #e5edf1;text-align:left";
        tr.append(td);
      });table.append(tr);
    }
    content.append(table);
    const heading=document.createElement("h4");heading.textContent="Resultados por semana";heading.style.cssText="font-size:13px;color:#14546b;margin:14px 0 9px";content.prepend(heading);
    const weekly=document.createElement("div");
    for(const week of data.semanas.slice().reverse()){
      const section=document.createElement("details");section.className="uas-week-history";
      const label=document.createElement("summary");label.textContent="Semana "+week.numero+" · "+(week.completo?"UAS7 "+week.total+"/42":(week.respondidos+"/7 respostas · "+(week.numero===data.semanaAtual?"em andamento":"incompleta")));
      const notes=document.createElement("p");notes.textContent=week.inicio+" a "+week.fim+" · "+(week.registros.length?week.registros.map(d=>d.data+": "+d.pontos+"/6").join(" | "):"sem registros");
      section.append(label,notes);weekly.append(section);
    }
    content.insertBefore(weekly,table);
    details.hidden=false;
  }
 }catch(e){if(gen===generation)status("Consulta ao histórico indisponível: "+e.message);}
}
async function create(gen){
 const area=$("uas7-qr-image");
 if(!area)return;
 const button=$("uas7-qr-generate");button.disabled=true;
 area.replaceChildren();status("Gerando acompanhamento individual…");
 try{
  const data=await api("create");
  if(gen!==generation)return;
  doctorKey=data.tokenProfissional;
  const patientUrl=BASE+"uas7-paciente.html#p="+data.tokenPaciente;
  const privateUrl=BASE+"uas7-profissional.html#k="+doctorKey;
  const link=$("uas7-qr-link");link.href=patientUrl;link.textContent="Abrir site do paciente";
  const doctor=$("uas7-qr-doctor");doctor.href=privateUrl;doctor.textContent="Abrir acompanhamento profissional";
  $("uas7-qr-copy-patient").disabled=false;$("uas7-qr-copy-doctor").disabled=false;
  $("uas7-qr-copy-patient").onclick=()=>navigator.clipboard.writeText(patientUrl).then(()=>status("Link do paciente copiado."),()=>status("Copie o link do site do paciente."));
  $("uas7-qr-copy-doctor").onclick=()=>navigator.clipboard.writeText(privateUrl).then(()=>status("Link profissional copiado. Guarde em local protegido."),()=>status("Copie o link exclusivo do profissional."));
  if(window.QRCode){
   new window.QRCode(area,{text:patientUrl,width:220,height:220,colorDark:"#0d2636",colorLight:"#ffffff",correctLevel:window.QRCode.CorrectLevel.M});
  }else status("QR Code indisponível no navegador. Utilize o link do paciente.");
  $("uas7-qr-refresh").disabled=false;
  $("uas7-qr-refresh").onclick=()=>refresh(doctorKey,gen);
  await refresh(doctorKey,gen);
  if(gen!==generation)return;
  if(!refreshTimer)refreshTimer=setInterval(()=>refresh(doctorKey,gen),45000);
  status("QR Code válido para semanas sucessivas. Salve o acesso profissional para consultar o histórico.");
 }catch(e){if(gen===generation)status(e.message||"Falha ao gerar QR Code.");}
 finally{if(gen===generation&&$("uas7-qr-generate"))button.disabled=false;}
}
function render(){
 const fields=$("mFields");if(!fields)return;
 const box=document.createElement("section");
 box.id="uas7-qr-panel";box.className="uas-qr-wrap";
 const head=document.createElement("h3");head.textContent="Diário do paciente por QR Code";head.style.cssText="font-size:16px;color:#14364c;margin:0 0 7px";
 const intro=document.createElement("p");intro.textContent="O paciente preenche todas as noites. A cada 7 dias inicia automaticamente uma nova semana no mesmo QR Code, preservando o histórico. Nome, idade e cidade são informados só uma vez.";intro.style.cssText="color:#416477;font-size:12px;line-height:1.55;margin:6px 0";
 const qr=document.createElement("div");qr.id="uas7-qr-image";qr.className="uas-qr-inner";
 const links=document.createElement("div");links.style.cssText="display:flex;flex-direction:column;gap:8px;margin-bottom:10px";
 const link=document.createElement("a");link.id="uas7-qr-link";link.target="_blank";link.rel="noopener noreferrer";links.append(link);
 const doctor=document.createElement("a");doctor.id="uas7-qr-doctor";doctor.target="_blank";doctor.rel="noopener noreferrer";links.append(doctor);
 const actions=document.createElement("div");actions.className="uas-actions";
 const generate=makeButton("uas7-qr-generate","Iniciar outro acompanhamento");
 const cp=makeButton("uas7-qr-copy-patient","Copiar link do paciente");cp.disabled=true;
 const cd=makeButton("uas7-qr-copy-doctor","Copiar acesso profissional");cd.disabled=true;
 const rb=makeButton("uas7-qr-refresh","Atualizar respostas");rb.disabled=true;
 actions.append(generate,cp,cd,rb);
 const warning=document.createElement("p");warning.className="uas-note";
 warning.textContent="O link profissional é confidencial e diferente do QR do paciente. Copie e guarde antes de fechar. Não compartilhe com o paciente.";
 const progress=document.createElement("p");progress.id="uas7-qr-andamento";progress.style.cssText="font-size:12px;color:#274d65;margin-top:11px";
 const stat=document.createElement("p");stat.id="uas7-qr-status";stat.className="uas-status";stat.setAttribute("role","status");
 const details=document.createElement("details");details.id="uas7-qr-details";
 details.style.cssText="background:#fff;border:1px solid #dae9ed;border-radius:10px;text-align:left;padding:10px;margin:9px 0";
 details.hidden=true;
 const summary=document.createElement("summary");summary.textContent="Ver respostas e ficha do paciente";summary.style.cssText="font-size:12px;font-weight:750;cursor:pointer;color:#14546b";
 const detailContent=document.createElement("div");detailContent.id="uas7-qr-details-content";
 details.append(summary,detailContent);
 box.append(head,intro,qr,links,actions,warning,progress,details,stat);
 fields.prepend(box);
 generate.addEventListener("click",()=>{if(doctorKey&&!confirm("Gerar um novo QR Code inicia outro acompanhamento. Você guardou o link profissional anterior?"))return;stop();create(generation);});
 create(generation);
}
const previous=window.openScore;if(typeof previous!=="function")return;
window.openScore=function(key){
 stop();
 const result=previous.apply(this,arguments);
 if(key==="uas")render();
 return result;
};
const overlay=$("overlay");
if(overlay)new MutationObserver(()=>{
 if(!overlay.classList.contains("open")&&doctorKey)stop();
}).observe(overlay,{attributes:true,attributeFilter:["class"]});
})();