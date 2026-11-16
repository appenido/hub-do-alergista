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
 el("andamento").textContent="Semana "+data.semanaAtual+" · "+data.respondidos+"/7 registros · "+(data.semanaInicio?dateBR(data.semanaInicio)+" a "+dateBR(data.semanaFim):"Aguardando início");
 el("escore").textContent=data.completo?"UAS7: "+data.total+" / 42":"Soma parcial: "+data.parcial+" / 42";
 el("esclegenda").textContent=data.completo?"Semana "+data.semanaAtual+" concluída. A seguinte abre automaticamente amanhã após o sétimo dia.":"Pontuação parcial não é UAS7 definitivo. As semanas anteriores continuam disponíveis abaixo.";
 const byDate=new Map(data.registros.map(x=>[x.data,x]));
 const days=el("dias");days.replaceChildren();
 for(let n=0;n<7;n++){
  const date=data.semanaInicio?plus(data.semanaInicio,n):null,done=byDate.has(date);
  const badge=document.createElement("div");badge.className="uas-day"+(done?" done":date&&date<data.hoje?" missed":date===data.hoje?" today":"");
  badge.textContent=(n+1)+(done?" ✓":"");badge.title=dateBR(date);days.append(badge);
 }
 const history=el("historicoSemanas");
 if(history){
   history.replaceChildren();
   const title=document.createElement("h3");
   title.textContent="Evolução semanal · "+data.semanas.length+" semana(s)";
   title.style.cssText="font-size:16px;margin:21px 0 10px;color:#16445a";
   history.append(title);
   for(const w of data.semanas.slice().reverse()){
     const details=document.createElement("details");details.className="uas-week-history";
     if(w.numero===data.semanaAtual)details.open=true;
     const summary=document.createElement("summary");
     summary.textContent="Semana "+w.numero+" · "+dateBR(w.inicio)+" a "+dateBR(w.fim)+" · "+
       (w.completo?"UAS7 "+w.total+"/42":(w.respondidos+"/7 noites · "+(w.numero===data.semanaAtual?"em andamento":"incompleta")));
     details.append(summary);
     const text=document.createElement("p");text.className="uas-muted";
     text.textContent=w.registros.length
       ?w.registros.map(x=>dateBR(x.data)+": pápulas "+x.papulas+" · prurido "+x.prurido+" · "+x.pontos+"/6").join(" | ")
       :"Nenhum preenchimento nesta semana";
     details.append(text);history.append(details);
   }
 }
 const tbody=el("linhas");tbody.replaceChildren();
 (data.todasAsRespostas||data.registros).forEach(item=>{
  const tr=document.createElement("tr");
  [String(data.semanas.find(s=>s.inicio && item.data>=s.inicio&&item.data<=s.fim)?.numero||1),dateBR(item.data),item.papulas,item.prurido,item.pontos+"/6"].forEach(v=>{
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
 const rows=[["Nome","Idade","Cidade origem","Semana","Data","Pápulas","Prurido","Soma diária","UAS7 semanal"]];
 if(latest.todasAsRespostas.length){
  latest.todasAsRespostas.forEach(x=>{const week=latest.semanas.find(s=>s.inicio&&x.data>=s.inicio&&x.data<=s.fim);rows.push([latest.paciente?.nome||"",latest.paciente?.idade??"",
   latest.paciente?.cidade||"",week?.numero||"",dateBR(x.data),x.papulas,x.prurido,x.pontos,week?.completo?week.total:"Incompleto"]);});
 }else rows.push(["Aguardando respostas","","","","","","","",""]);
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