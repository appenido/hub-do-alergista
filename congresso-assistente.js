/* Busca pública, local e sem login na programação do Congresso ASBAI 2026 */
(function(){
'use strict';
const URL='https://congressoalergiaasbai2026.com.br/evento/alergia2026/pt/programacao/gradeatividades/todas';
const verificados=[
['12/11/2026','08:30 - 08:50','Sala 1A','Imunoterapia oral: quem, quando e até onde ir?','José Luís Magalhães Rios','Alergia Alimentar I'],
['12/11/2026','08:50 - 09:10','Sala 1A','Biológicos na alergia alimentar: substitutos ou aliados da imunoterapia?','Ariana Campos Yang','Alergia Alimentar I'],
['12/11/2026','09:10 - 09:30','Sala 1A','TPO como ferramenta estratégica','Jackeline Motta Franco','Alergia Alimentar I'],
['12/11/2026','08:30 - 08:50','Sala 1B','Fenótipos de asma no adulto: qual a importância na clínica?','Jose Elabras Filho','Asma I'],
['12/11/2026','08:50 - 09:10','Sala 1B','Plugs mucosos: novo marcador de resposta ao tratamento','Adelmir Machado','Asma I'],
['12/11/2026','09:10 - 09:30','Sala 1B','GINA 2026 - principais mudanças nos adultos','Grazielly Campos','Asma I'],
['12/11/2026','08:30 - 08:50','Sala 2','Diferenças na investigação de RHM em adultos e crianças','Mara Morelo Rocha Felix','Fármacos I'],
['12/11/2026','08:50 - 09:10','Sala 2','Infecção viral e RHM: uma via de mão dupla','Beni Morgenstern','Fármacos I'],
['12/11/2026','09:10 - 09:30','Sala 2','Dessensibilização rápida a medicamentos: quando indicar e como conduzir','André Feodrippe','Fármacos I'],
['12/11/2026','15:30 - 16:00','Sala 2','Como avaliar remissão na asma? O que os ensaios clínicos têm a nos dizer','Nelson Augusto Rosário Filho','Biológicos'],
['12/11/2026','15:30 - 16:00','Sala 3','Novas Diretrizes AEH','Anete Sevciovic Grumach','Angioedema'],
['12/11/2026','16:00 - 16:30','Sala 1A','Adrenalina: via de administração, dose e alternativas nos casos refratários','Marisa Rosimeire Ribeiro','Anafilaxia'],
['13/11/2026','08:30 - 09:00','Sala 1A + 1B','Contemporary management of atopic dermatitis: from basic skincare to targeted systemic therapies','Peter Schmid-Grendelmeier','Plenária 2'],
['13/11/2026','09:00 - 09:30','Sala 1A + 1B','Fatores de risco e protetores nas alergias: o que sabemos?','Luis Vicente Garcia-Marcos Alvarez','Plenária 2'],
['13/11/2026','09:30 - 10:00','Sala 1A + 1B','Biológicos na imunoterapia oral','Marylin Valentin Rostan','Plenária 2']
].map(x=>({dia:x[0],hora:x[1],sala:x[2],titulo:x[3],palestrante:x[4],mesa:x[5]}));
let dados=verificados, live=false, started=false, loadPromise=null;
const el=id=>document.getElementById(id);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const stops=new Set('a o as os de da do das dos que quais qual sobre me diga falar fala vai falar quero ver onde quando que quem com em no na nos nas para por horario hora horarios aula aulas palestrante palestrantes palestra palestras congresso tema temas grade programacao tem'.split(' '));
const sin={aeh:['angioedema','hereditario'],vacina:['imunizacao','imunizacoes','vacinacao'],vacinas:['imunizacao','imunizacoes'],asma:['gina'],urticaria:['uce'],tpo:['provocacao','tpo'],dermatite:['atopica'],medicamentos:['farmacos'],imunoterapia:['dessensibilizacao']};
function extract(html){
  const doc=new DOMParser().parseFromString(html,'text/html');
  doc.querySelectorAll('script,style,nav,header,footer,noscript').forEach(n=>n.remove());
  const nodes=[],walk=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);let n;
  while((n=walk.nextNode())&&nodes.length<60000){
    const p=n.parentElement;if(!p||p.closest('button,select,option'))continue;
    const s=n.textContent.replace(/\s+/g,' ').trim();if(!s||s.length>220)continue;
    const h=p.closest('h1,h2,h3,h4,h5,h6');
    nodes.push({s,tag:h?h.tagName:''});
  }
  let day='12/11/2026', room='', group='', time='', current=null, begun=false, afterTime=false;const result=[];
  const isPerson=s=>s.length>7 && s.length<100 && /^[A-ZÀ-Ý .'-]+$/.test(s) && s.trim().split(/\s+/).length>=2;
  for(let i=0;i<nodes.length;i++){
    const t=nodes[i],s=t.s;
    const d=s.match(/\b(1[1-4])\/11\/2026\b/);if(d){if(begun)day=d[1]+'/11/2026';continue;}
    if(/^Sala\s+(?:\d+[A-Z]?(?:\s*\+\s*\d+[A-Z]?)?|Marfim\s+[IVX]+|de Reunião|de Reuniao)$/i.test(s)||/^Arena Cient[ií]fica$/i.test(s)){room=s;group='';time='';begun=true;afterTime=false;current=null;continue;}
    if(!begun)continue;
    const h=s.match(/^(\d\d:\d\d)\s*[-–]\s*(\d\d:\d\d)$/);if(h){time=h[1]+' - '+h[2];afterTime=true;current=null;continue;}
    if(/^Palestrante$/i.test(s)&&current){
      let speaker=nodes[i-1]?.s||'';
      if(/^[A-Z]{2}$/.test(speaker))speaker=nodes[i-2]?.s||'';
      speaker=speaker.replace(/\s+(AC|AL|AM|AP|BA|CE|DF|ES|GO|MA|MG|MS|MT|PA|PB|PE|PI|PR|RJ|RN|RO|RR|RS|SC|SE|SP|TO)$/,'');
      if(isPerson(speaker))current.palestrante=speaker;continue;
    }
    if((t.tag==='H4'||t.tag==='H3')&&!isPerson(s)&&s.length>5&&!/^Mesa Redonda|Mini Confer[eê]ncia|Intervalo|Congresso|Programação/i.test(s)){group=s;continue;}
    if(!time||!room)continue;
    if((t.tag==='H5'||t.tag==='H6'||(afterTime&&!t.tag))&&s.length>8&&s.length<180&&!/^Discussão|Discussao|Mesa Redonda|Mini Conferência|Intervalo|Palestrante|Moderador|Moderadora|Outros|Plenária/i.test(s)&&!isPerson(s)){
      current={dia:day,hora:time,sala:room,titulo:s,palestrante:'',mesa:group};
      result.push(current);afterTime=false;
    }
  }
  return result.filter(x=>/^1[234]\/11\/2026$/.test(x.dia) && x.hora && x.sala);
}
function merge(a,b){let m=new Map;for(const x of [...a,...b]){
  let k=norm(x.titulo)+'|'+x.dia;
  if(!m.has(k)||(!m.get(k).palestrante&&x.palestrante))m.set(k,x);
}return [...m.values()]}
function load(){
 if(started)return loadPromise;started=true;
 loadPromise=(async()=>{
   try{
     const r=await fetch('/programacao-congresso',{cache:'no-store'});
     if(!r.ok)throw Error('sem fonte');
     const d=await r.json();const parsed=extract(d.html||'');
     if(parsed.length<15)throw Error('grade incompleta');
     dados=merge(parsed,verificados);live=true;
   }catch(e){dados=verificados;live=false;}
   const st=el('hubCongressAssistStatus');
   if(st)st.textContent=live?'Consulta realizada na grade oficial; horários sujeitos a alterações.':'A fonte oficial não respondeu. Busca limitada a aulas verificadas; confira a grade completa no site oficial.';
 })();return loadPromise;
}
function add(parent,tag,cls,txt){const x=document.createElement(tag);x.className=cls;if(txt!==undefined)x.textContent=txt;parent.appendChild(x);return x;}
function relevance(x,tokens,phrase){
 let score=0, hit=0;
 const tt=norm(x.titulo),ss=norm(x.palestrante),gg=norm(x.mesa);
 for(const t of tokens){let w=0;for(const term of [t,...(sin[t]||[])]) {
  if(tt.includes(term))w=Math.max(w,9);
  if(ss.includes(term))w=Math.max(w,11);
  if(gg.includes(term))w=Math.max(w,4);
 } if(w){score+=w;hit++;}}
 if(hit===tokens.length&&tokens.length>1)score+=15;
 if(phrase.length>3&&(tt.includes(phrase)||ss.includes(phrase)))score+=20;
 return hit?score:0;
}
async function ask(){
 const inp=el('hubCongressQuestion'),box=el('hubCongressAssistResult');if(!inp||!box)return;
 let query=inp.value.trim();box.replaceChildren();
 if(query.length<2){add(box,'p','hub-congress-empty','Digite um tema ou o nome de um palestrante.');return;}
 add(box,'p','hub-congress-empty','Consultando a programação…');await load();box.replaceChildren();
 const t=[...new Set(norm(query).split(' ').filter(w=>w.length>1&&!stops.has(w)))].slice(0,15);
 if(!t.length){add(box,'p','hub-congress-empty','Digite um tema ou nome mais específico.');return;}
 const matches=dados.map(x=>({x,v:relevance(x,t,norm(query))})).filter(a=>a.v>0).sort((a,b)=>b.v-a.v).slice(0,12);
 if(!matches.length)add(box,'p','hub-congress-empty',live?'Não encontrei esse termo na programação consultada. Tente outro nome ou palavra-chave.':'Não encontrei esse termo na seleção disponível. Consulte a programação completa.');
 else{
  add(box,'p','hub-congress-found',matches.length+' resultado(s) correspondente(s):');
  for(const {x} of matches){const c=add(box,'article','hub-congress-answer');
    add(c,'div','hub-congress-answer-title',x.titulo);
    if(x.palestrante)add(c,'div','hub-congress-answer-speaker',x.palestrante);
    add(c,'div','hub-congress-answer-detail',x.dia+' · '+x.hora+' · '+x.sala);
    if(x.mesa)add(c,'div','hub-congress-answer-session',x.mesa);
  }
 }
 if(!live)add(box,'p','hub-congress-caveat','Resultados parciais: a consulta ao site oficial está indisponível.');
 const a=add(box,'a','hub-congress-answer-link','Consultar a grade oficial ↗');a.href=URL;a.target='_blank';a.rel='noopener noreferrer';
}
window.hubCongressToggle=function(){
 const panel=el('hubCongressAssistPanel'),b=el('hubCongressAssistToggle');if(!panel||!b)return;
 panel.hidden=!panel.hidden;b.setAttribute('aria-expanded',String(!panel.hidden));
 if(!panel.hidden){el('hubCongressQuestion')?.focus();load();}
};
window.hubCongressAsk=ask;
document.addEventListener('DOMContentLoaded',()=>{
 el('hubCongressQuestion')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ask();}});
});
})();