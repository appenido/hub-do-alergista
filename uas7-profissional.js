/* Leitura profissional por chave distinta da chave do paciente. */
(function(){
"use strict";
const endpoint="https://jpdtqtenlivxgjkyizcg.supabase.co/functions/v1/uas7-diario";
const key=new URLSearchParams(location.hash.slice(1)).get("k")||"";
const el=id=>document.getElementById(id);
let latest=null;
async function api(action){
 const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({action,token:key,tipo:"profissional"}),cache:"no-store",credentials:"omit"});
 const data=await response.json().catch(()=>({}));
 if(!response.ok||!data.ok)throw Error(data.erro||"Não foi possível consultar.");
 return data;
}
function plus(date,n){const d=new Date(date+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function dateBR(date){return date?date.slice(8,10)+"/"+date.slice(5,7)+"/"+date.slice(0,4):"—";}
function render(data){
 latest=data;el("info").hidden=false;el("tabelaBox").hidden=false;
 el("nome").textContent=data.paciente?data.paciente.nome:"Aguardando primeiro preenchimento";
 el("dados").textContent=data.paciente?("Idade: "+data.paciente.idade+" anos · Cidade de origem: "+data.paciente.cidade):"O paciente ainda não cadastrou seus dados.";
 el("andamento").textContent=data.respondidos+" de 7 registros recebidos"+(data.inicio?" · Início: "+dateBR(data.inicio):"");
 el("escore").textContent=data.completo?"UAS7: "+data.total+" / 42":"Soma parcial: "+data.parcial+" / 42";
 el("esclegenda").textContent=data.completo?"UAS7 concluído com sete dias consecutivos.":data.encerrado?"A semana terminou incompleta: sem UAS7 validado.":"A soma parcial não deve ser tratada como UAS7 final.";
 const byDate=new Map(data.registros.map(x=>[x.data,x]));
 const days=el("dias");days.replaceChildren();
 for(let n=0;n<7;n++){
  const date=data.inicio?plus(data.inicio,n):null,done=byDate.has(date);
  const badge=document.createElement("div");badge.className="uas-day"+(done?" done":date&&date<data.hoje?" missed":date===data.hoje?" today":"");
  badge.textContent=(n+1)+(done?" ✓":"");badge.title=dateBR(date);days.append(badge);
 }
 const tbody=el("linhas");tbody.replaceChildren();
 data.registros.forEach(item=>{
  const tr=document.createElement("tr");
  [dateBR(item.data),item.papulas,item.prurido,item.pontos+"/6"].forEach(v=>{
   const td=document.createElement("td");td.textContent=String(v);tr.append(td);
  });
  tbody.append(tr);
 });
 el("status").textContent="Acompanhamento atualizado.";
}
async function refresh(){
 el("status").textContent="Consultando registros…";
 try{
  if(!/^[0-9a-f]{64}$/.test(key))throw Error("Chave inválida. Abra o link de acesso profissional gerado no Hub.");
  render(await api("professional-status"));
 }catch(e){el("status").textContent=e.message;}
}
el("atualizar").addEventListener("click",refresh);
el("copiar").addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText(location.href);el("status").textContent="Link profissional copiado. Guarde em local protegido.";}
 catch(_){el("status").textContent="Copie o endereço completo da barra do navegador.";}
});
el("csv").addEventListener("click",()=>{
 if(!latest){el("status").textContent="Atualize os dados antes de exportar.";return;}
 const safe=v=>{let s=String(v??"");if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const rows=[["Nome","Idade","Cidade origem","Data","Pápulas","Prurido","Soma diária","UAS7 final"]];
 if(latest.registros.length){
  latest.registros.forEach(x=>rows.push([latest.paciente?.nome||"",latest.paciente?.idade??"",
   latest.paciente?.cidade||"",dateBR(x.data),x.papulas,x.prurido,x.pontos,latest.completo?latest.total:"Incompleto"]));
 }else rows.push(["Aguardando respostas","","","","","","",""]);
 const csv="\uFEFF"+rows.map(row=>row.map(safe).join(";")).join("\r\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="uas7-acompanhamento.csv";a.click();URL.revokeObjectURL(url);
});
el("excluir").addEventListener("click",async()=>{
 if(!confirm("Excluir permanentemente os dados e todas as respostas deste acompanhamento?"))return;
 try{await api("delete");el("info").hidden=true;el("tabelaBox").hidden=true;el("status").textContent="Acompanhamento excluído.";}
 catch(e){el("status").textContent=e.message;}
});
refresh();
})();