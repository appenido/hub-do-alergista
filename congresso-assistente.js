/* Busca pública, local e sem login na programação do Congresso ASBAI 2026 */
(function(){
'use strict';
const URL='https://congressoalergiaasbai2026.com.br/evento/alergia2026/pt/programacao/gradeatividades';
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
['13/11/2026','09:30 - 10:00','Sala 1A + 1B','Biológicos na imunoterapia oral','Marylin Valentin Rostan','Plenária 2'],
['12/11/2026','13:30 - 13:50','','Da lesão de barreira ao processo inflamatório: o que há de novo?','Márcia Carvalho Mallozi','Dermatite atópica I'],
['12/11/2026','13:50 - 14:10','','Prurido na DA: mecanismos e desafios terapêuticos','Dayanne Bruscky','Dermatite atópica I'],
['12/11/2026','14:10 - 14:30','','Dermatite atópica no idoso','Nelson Cordeiro','Dermatite atópica I'],
['12/11/2026','13:30 - 13:50','','Caracterização de endótipos na rinossinusite crônica: aplicações clínicas','Sergio D. Dortas Junior','Biológicos I'],
['12/11/2026','13:50 - 14:10','','Novos biológicos para o tratamento da asma grave','Marcelo Vivolo Aun','Biológicos I'],
['12/11/2026','14:10 - 14:30','','Perspectivas das pequenas moléculas nas doenças T2','Martti Antila','Biológicos I'],
['12/11/2026','15:00 - 15:30','','Hesitação vacinal na era da desinformação: como o alergista pode liderar a reconstrução da confiança','Renato Kfouri','Imunizações'],
['12/11/2026','15:30 - 16:00','','Programação imunológica precoce e alergias: microbiota, ambiente e prevenção','Bruno Acatauassu Paes Barreto','Infância'],
['12/11/2026','16:30 - 16:50','','Novas terapêuticas e perspectiva de tratamento personalizado','Luis Felipe Chiaverini Ensina','Urticária I - UCE','Régis de Albuquerque Campos; Rosana Camara Agondi'],
['12/11/2026','16:50 - 17:10','','Como prever recidiva após remissão?','Eduardo Magalhães de Souza Lima','Urticária I - UCE','Régis de Albuquerque Campos; Rosana Camara Agondi'],
['12/11/2026','17:10 - 17:30','','Autoimunidade: o que há de novo?','Solange Oliveira Rodrigues Valle','Urticária I - UCE','Régis de Albuquerque Campos; Rosana Camara Agondi'],
['12/11/2026','16:30 - 16:50','','Reexposição após anafilaxia: como decidir com segurança','Albertina Varandas Capelo','Anafilaxia I'],
['12/11/2026','16:50 - 17:10','','Anafilaxia perioperatória em pacientes com cofatores e comorbidades complexa','Alex Eustaquio de Lacerda','Anafilaxia I'],
['12/11/2026','17:10 - 17:30','','Identificação precoce de fenótipos de gravidade','Luana Melquíades de Medeiros Castro','Anafilaxia I'],
['12/11/2026','16:30 - 16:50','','Padronização dos extratos: papel na efetividade no tratamento','Ernesto Akio Taketomi','Imunoterapia I'],
['12/11/2026','16:50 - 17:10','','Imunoterapia sublingual: o que avançamos','Fernando Monteiro Aarestrup','Imunoterapia I'],
['12/11/2026','17:10 - 17:30','','IT & Imunobiológicos: alternativas ou associação?','Clóvis Eduardo Santos Galvão','Imunoterapia I'],
['13/11/2026','10:30 - 10:50','','Fenótipos complexos: quem foge do padrão?','Ana Paula Moschione Castro','Alergia Alimentar II'],
['13/11/2026','10:50 - 11:10','','Cofatores e variabilidade da reação: o que muda no risco?','Germana Pimentel Stefani','Alergia Alimentar II'],
['13/11/2026','11:10 - 11:30','','Vida real: adesão, qualidade de vida e risco social','Renata Rodrigues Cocco','Alergia Alimentar II'],
['13/11/2026','10:30 - 10:50','','Fenótipos de reações a AINES: da teoria à prática','Luiz Alexandre Ribeiro da Rocha','Fármacos II'],
['13/11/2026','10:50 - 11:10','','Reações imediatas a beta-lactâmicos','Maria Fernanda Malaman','Fármacos II'],
['13/11/2026','11:10 - 11:30','','Reações de hipersensibilidade a outros antibióticos','Tânia Maria Gonçalves de Souza Gomes','Fármacos II'],
['13/11/2026','15:30 - 16:00','','Medicina de Precisão nos Erros Inatos da Imunidade','Ekaterini Simões Goudouris','EII'],
['13/11/2026','16:30 - 16:50','','Infecção pelo S. aureus: como evitar?','Danielle Kiertsman Harari','Dermatite atópica II'],
['13/11/2026','16:50 - 17:10','','Imunoterapia com aeroalérgenos: qual papel na DA?','Evandro Alves do Prado','Dermatite atópica II'],
['13/11/2026','17:10 - 17:30','','Biológicos e pequenas moléculas na DA grave','Claudia Soido Falcao do Amaral','Dermatite atópica II'],
['13/11/2026','16:30 - 16:50','','Imunoterapia oral para alergia alimentar: já é realidade na prática clínica?','Antonio Carlos Pastorino','Luso-Brasileiro'],
['13/11/2026','16:50 - 17:10','','Anafilaxia oral por ácaros (síndrome da panqueca)','Rodrigo Rodrigues Alves','Luso-Brasileiro'],
['13/11/2026','17:10 - 17:30','','Diagnóstico molecular na alergia alimentar: quando solicitar?','José Carlison de Oliveira','Luso-Brasileiro'],
['13/11/2026','16:30 - 16:50','','Asma grave em adultos: o que fazer antes dos imunobiológicos?','Gustavo Farias','Cono Sur'],
['13/11/2026','16:50 - 17:10','','Asma no pré-escolar: a GINA acabou com o lactente sibilante?','Patricia Monge Ortega','Cono Sur'],
['13/11/2026','17:10 - 17:30','','Management of IgE-Mediated Food Allergy in Latin America: Challenges and Opportunities','Silvana Monsell','Cono Sur'],
['13/11/2026','16:30 - 16:50','','Expossoma e microbioma na regulação imunológica','Raquel Prudente de Carvalho Baldacara','Meio ambiente'],
['13/11/2026','16:50 - 17:10','','Qualidade do ar interior: fontes ocultas, controladas e não controladas','Celso Taques Saldanha','Meio ambiente'],
['13/11/2026','17:10 - 17:30','','Microplásticos e mudanças extremas do clima','Luciana Rizzo','Meio ambiente'],
['14/11/2026','08:30 - 09:00','Sala 1A + 1B','Normativa para certificação de cursos práticos em alergia e imunologia','Dirceu Solé','Plenária 3'],
['14/11/2026','09:00 - 09:30','Sala 1A + 1B','A formação oficial do especialista x cursos extraoficiais','Celso Taques Saldanha','Plenária 3'],
['14/11/2026','09:30 - 10:00','Sala 1A + 1B','Critérios para credenciamento dos centros formadores em alergia e imunologia','Herberto José Chong Neto','Plenária 3'],
['14/11/2026','10:30 - 10:50','','Imunoterapia nos extremos de idade','Marcos Reis Gonçalves','Imunoterapia II'],
['14/11/2026','10:50 - 11:10','','Imunoterapia nas doenças crônicas','Georgia Veras de Araujo Gueiros Lira','Imunoterapia II'],
['14/11/2026','11:10 - 11:30','','Imunoterapia nos polissensibilizados','Gil Bardini Alves','Imunoterapia II'],
['14/11/2026','10:30 - 10:50','','Urticária Crônica Induzida: desafios clínicos e avanços terapêuticos','Rosana Camara Agondi','Urticária II','Luis Felipe Chiaverini Ensina'],
['14/11/2026','10:50 - 11:10','','Urticária no idoso: o que tem de diferente?','Paula Natassya Barbosa Argolo de Freitas','Urticária II','Luis Felipe Chiaverini Ensina'],
['14/11/2026','11:10 - 11:30','','As múltiplas faces da urticária em pediatria','Larissa Silva Brandão','Urticária II','Luis Felipe Chiaverini Ensina'],
['14/11/2026','10:30 - 10:50','','Vacina VSR materna e anticorpos monoclonais - como estamos no Brasil?','Lorena de Castro Diniz','Imunizações II'],
['14/11/2026','10:50 - 11:10','','Diagnóstico de Deficiência de Anticorpo Específico na era das novas vacinas pneumocócicas?','Ana Karolina Barreto Berselli Marinho','Imunizações II'],
['14/11/2026','11:10 - 11:30','','Vacinação em pacientes submetidos a TCTH e terapia gênica: recomendações atuais e lacunas','Claudia França Cavalcante Valente','Imunizações II'],
['14/11/2026','10:30 - 10:50','','Quase HLH: isso existe?','Irma Cecilia Douglas Paes Barreto','Hot Topics em EII'],
['14/11/2026','10:50 - 11:10','','Desordens imunometabólicas: o que é isto?','Adriana Azoubel Antunes','Hot Topics em EII'],
['14/11/2026','11:10 - 11:30','','GLILD: guideline de prática clínica','Mayra de Barros Dorna','Hot Topics em EII'],
['14/11/2026','13:30 - 13:50','','WAO Hereditary Angioedema (HAE) Position Paper','Daniel Vazquez','WAO'],
['14/11/2026','13:50 - 14:10','','WAO Initiatives on Mastocytosis','Pedro Francisco Giavina Bianchi Jr','WAO'],
['14/11/2026','14:10 - 14:30','','WAO SLIT Position Paper','Veridiana Aun Rufino Pereira','WAO'],
['14/11/2026','15:00 - 15:30','','Consensos na urticária crônica: quais as novidades','Régis de Albuquerque Campos','Urticária','Solange Oliveira Rodrigues Valle'],
['14/11/2026','15:00 - 15:30','','Avaliação multidimensional da asma grave: imagem, função pulmonar, sintomas e biomarcadores inflamatórios','Alvaro Augusto Souza da Cruz Filho','Asma'],
['14/11/2026','15:00 - 15:30','','Clinical practice recommendations for managing children and adults with 22q11.2 deletion syndrome','Kate Sullivan','Imuno'],
].map(x=>({dia:x[0],hora:x[1],sala:x[2],titulo:x[3],palestrante:x[4],mesa:x[5],moderadores:x[6]||''}));
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
  // A sala pertence à coluna da atividade na grade. Não se deve usar
  // a última sala lida no cabeçalho para todas as palestras.
  function roomFor(element) {
    const cell=element?.closest('td,th');
    const table=cell?.closest('table');
    if(!cell||!table||cell.cellIndex<0)return '';
    const header=[...table.querySelectorAll('tr')].find(row=>{
      const labels=[...row.cells].map(c=>c.textContent.trim());
      return labels.filter(t=>/^Sala\s+\d|^Arena Cient/i.test(t)).length>=2;
    });
    if(!header)return '';
    const label=header.cells[cell.cellIndex]?.textContent.replace(/\s+/g,' ').trim()||'';
    const match=label.match(/^(Sala\s+(?:\d+[A-Z]?(?:\s*\+\s*\d+[A-Z]?)?|de Reunião)|Arena Científica)$/i);
    return match?match[0]:'';
  }
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
    if(!time)continue;
    if((t.tag==='H5'||t.tag==='H6'||(afterTime&&!t.tag))&&s.length>8&&s.length<180&&!/^Discussão|Discussao|Mesa Redonda|Mini Conferência|Intervalo|Palestrante|Moderador|Moderadora|Outros|Plenária/i.test(s)&&!isPerson(s)){
      current={dia:day,hora:time,sala:roomFor(p),titulo:s,palestrante:'',mesa:group};
      result.push(current);afterTime=false;
    }
  }
  return result.filter(x=>/^1[234]\/11\/2026$/.test(x.dia) && x.hora && x.titulo);
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
     const d=await r.json();if(!d.ok)throw Error('sem fonte');
     const parsed=extract(d.html||'');
     if(parsed.length<15)throw Error('grade incompleta');
     dados=merge(verificados,parsed);live=true;
   }catch(e){dados=verificados;live=false;}
   const st=el('hubCongressAssistStatus');
   if(st)st.textContent=live?'Consulta realizada na grade oficial; horários sujeitos a alterações.':'Busca na seleção conferida da programação oficial; a atualização automática está indisponível.';
 })();return loadPromise;
}
function add(parent,tag,cls,txt){const x=document.createElement(tag);x.className=cls;if(txt!==undefined)x.textContent=txt;parent.appendChild(x);return x;}
function relevance(x,tokens,phrase){
 let score=0, hit=0;
 const tt=norm(x.titulo),ss=norm(x.palestrante),gg=norm(x.mesa),mm=norm(x.moderadores);
 for(const t of tokens){let w=0;for(const term of [t,...(sin[t]||[])]) {
  if(tt.includes(term))w=Math.max(w,9);
  if(ss.includes(term))w=Math.max(w,11);
  if(mm.includes(term))w=Math.max(w,7);
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
 const matches=dados.map(x=>({x,v:relevance(x,t,norm(query))})).filter(a=>a.v>0).sort((a,b)=>b.v-a.v || a.x.dia.localeCompare(b.x.dia) || a.x.hora.localeCompare(b.x.hora)).slice(0,40);
 if(!matches.length)add(box,'p','hub-congress-empty',live?'Não encontrei esse termo na programação consultada. Tente outro nome ou palavra-chave.':'Não encontrei esse termo na seleção disponível. Consulte a programação completa.');
 else{
  add(box,'p','hub-congress-found',matches.length+' resultado(s) correspondente(s):');
  for(const {x} of matches){const c=add(box,'article','hub-congress-answer');
    add(c,'div','hub-congress-answer-title',x.titulo);
    if(x.palestrante)add(c,'div','hub-congress-answer-speaker',x.palestrante);
    add(c,'div','hub-congress-answer-detail',x.dia+' · '+x.hora+(x.sala?' · '+x.sala:' · Sala: consultar grade oficial'));
    if(x.mesa)add(c,'div','hub-congress-answer-session',x.mesa);
    if(x.moderadores)add(c,'div','hub-congress-answer-session','Moderação: '+x.moderadores);
  }
 }
 if(!live)add(box,'p','hub-congress-caveat','Seleção parcial conferida na grade oficial. Para confirmar salas e eventuais alterações, consulte a programação completa.');
 const source=add(box,'a','hub-congress-source','Conferir programação oficial');source.href=URL;source.target='_blank';source.rel='noopener noreferrer';

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