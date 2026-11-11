/* SCORAD clássico, regra dos nove; avaliação clínica em etapas. */
(function(){
'use strict';
var R=[
 {id:'cab',name:'Cabeça e pescoço',w:9},
 {id:'brE',name:'Membro superior esquerdo',w:9},
 {id:'brD',name:'Membro superior direito',w:9},
 {id:'trF',name:'Tronco anterior',w:18},
 {id:'trB',name:'Tronco posterior',w:18},
 {id:'peE',name:'Membro inferior esquerdo',w:18},
 {id:'peD',name:'Membro inferior direito',w:18},
 {id:'gen',name:'Genitais / períneo',w:1}
];
var S=[
 ['eritema','Eritema','Vermelhidão'],
 ['edema','Edema e pápulas','Edema ou elevação da lesão'],
 ['exsudacao','Exsudação e crostas','Secreção, umidade ou crostas'],
 ['escoriacao','Escoriações','Marcas da coçadura'],
 ['liquenificacao','Liquenificação','Espessamento da pele'],
 ['xerose','Xerose','Avaliar em pele sem inflamação']
];
var D=null, step=0,selected='trF';
function fmt(n,dec){return Number(n).toLocaleString('pt-BR',{minimumFractionDigits:dec||0,maximumFractionDigits:dec===undefined?1:dec});}
function aTotal(){return R.reduce(function(t,r){return t+r.w*D.area[r.id]/100;},0);}
function bTotal(){return S.reduce(function(t,s){return t+(D.sign[s[0]]||0);},0);}
function bValid(){return S.every(function(s){return D.sign[s[0]]!==null;});}
function region(id){return R.find(function(r){return r.id===id;});}
function skinFigure(back){
 var ids=back?{head:'cab',torso:'trB',armL:'brE',armR:'brD',legL:'peE',legR:'peD'}:{head:'cab',torso:'trF',armL:'brD',armR:'brE',legL:'peD',legR:'peE',gen:'gen'};
 var paths={
 head:'<ellipse cx="90" cy="25" rx="14" ry="18"/>',
 torso:'<path d="M68 53 Q90 49 112 53 L110 132 Q90 139 70 132 Z"/>',
 armL:'<path d="M67 56 Q58 54 54 69 L42 119 Q39 136 48 137 Q57 138 59 121 L77 76 Z"/>',
 armR:'<path d="M113 56 Q122 54 126 69 L138 119 Q141 136 132 137 Q123 138 121 121 L103 76 Z"/>',
 legL:'<path d="M70 137 L90 139 L88 219 Q88 233 77 234 Q66 233 67 219 Z"/>',
 legR:'<path d="M90 139 L110 137 L113 219 Q114 233 103 234 Q92 233 92 219 Z"/>',
 gen:'<path d="M84 135 L96 135 L90 150 Z"/>'};
 var h='<div class="sc-figure"><div class="sc-figure-label">'+(back?'COSTAS':'FRENTE')+'</div><svg viewBox="30 0 120 241" aria-label="'+(back?'Vista posterior':'Vista anterior')+' do corpo">';
 Object.keys(ids).forEach(function(k){
  h+='<g data-sc-region="'+ids[k]+'" class="sc-body-part" role="button" tabindex="0" aria-label="'+region(ids[k]).name+'"><title>'+region(ids[k]).name+'</title>'+paths[k]+'</g>';
 });
 return h+'</svg></div>';
}
function makeCSS(){
 if(document.getElementById('scorad-ui-style'))return;
 var st=document.createElement('style');st.id='scorad-ui-style';
 st.textContent=[
 '#overlay.scorad-modal .modal{width:min(730px,calc(100vw - 10px));max-width:730px;box-sizing:border-box}',
 '#scorad-ui{font-family:Manrope,system-ui,sans-serif;color:var(--navy)}#scorad-ui *{box-sizing:border-box}',
 '#scorad-ui .sc-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin:5px 0 13px}',
 '#scorad-ui .sc-tab{font-size:10px;min-height:40px;border:1px solid #d6e4ea;background:#f5fafb;border-radius:9px;color:#466373;font-weight:800;padding:6px 1px}',
 '#scorad-ui .sc-tab.on{color:white;background:#146781;border-color:#146781}',
 '#scorad-ui .sc-heading{font-size:17px;font-weight:800;margin:8px 0 5px}',
 '#scorad-ui .sc-hint{font-size:12px;color:#5a7180;line-height:1.6;margin:0 0 13px}',
 '#scorad-ui .sc-total{background:linear-gradient(115deg,#103e53,#16718a);color:white;border-radius:12px;padding:11px 16px;margin:9px 0 14px;display:flex;align-items:center;justify-content:space-between;font-size:12px}',
 '#scorad-ui .sc-total strong{font-size:23px}',
 '#scorad-ui .sc-maps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 0 13px}',
 '#scorad-ui .sc-figure{background:linear-gradient(#f7fcfe,#eaf4f8);border:1px solid #d5e7ef;border-radius:13px;text-align:center;padding:11px 4px}',
 '#scorad-ui .sc-figure-label{font-size:11px;font-weight:800;color:#527484;letter-spacing:.06em}',
 '#scorad-ui .sc-figure svg{display:block;max-width:100%;height:218px;margin:4px auto}',
 '#scorad-ui .sc-body-part{outline:0;cursor:pointer}',
 '#scorad-ui .sc-body-part>path,#scorad-ui .sc-body-part>ellipse{fill:#cddfe7;stroke:#799aaa;stroke-width:1.15;transition:fill .1s}',
 '#scorad-ui .sc-body-part.applied>path,#scorad-ui .sc-body-part.applied>ellipse{fill:#5eafc1;stroke:#1684a0}',
 '#scorad-ui .sc-body-part.current>path,#scorad-ui .sc-body-part.current>ellipse,#scorad-ui .sc-body-part:focus-visible>path,#scorad-ui .sc-body-part:focus-visible>ellipse{fill:#e6bd71;stroke:#af812e;stroke-width:2}',
 '#scorad-ui .sc-editor{background:white;border:1px solid #d5e6ed;border-radius:13px;padding:13px;margin:10px 0}',
 '#scorad-ui .sc-edit-head{display:flex;justify-content:space-between;gap:10px;align-items:center}',
 '#scorad-ui .sc-edit-head strong{font-size:14px}#scorad-ui .sc-edit-head small{font-size:10px;display:block;color:#637e89;margin-top:3px}',
 '#scorad-ui .sc-current-value{font-size:19px;font-weight:850;background:#e5f5f8;border-radius:9px;padding:8px 10px;color:#16708c}',
 '#scorad-ui input[type=range]{width:100%;height:26px;accent-color:#118ab0;touch-action:pan-y;cursor:pointer}',
 '#scorad-ui .sc-hints{display:flex;justify-content:space-between;font-size:10px;color:#6b808b}',
 '#scorad-ui .sc-preset{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:10px 0}',
 '#scorad-ui .sc-preset button{border:1px solid #cde2e9;background:#f0f8fa;color:#286b83;border-radius:7px;min-height:34px;font-size:11px;font-weight:800}',
 '#scorad-ui .sc-preset button.on{background:#176780;color:white}',
 '#scorad-ui .sc-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}',
 '#scorad-ui .sc-chip{border:1px solid #d7e8ec;border-radius:8px;background:#fafdfd;min-height:40px;padding:7px;font-size:10px;display:flex;justify-content:space-between;align-items:center;gap:5px;color:#4a6776;text-align:left}',
 '#scorad-ui .sc-chip b{color:#176f8b;white-space:nowrap}#scorad-ui .sc-chip.on{background:#fff5e3;border-color:#ddbc83}',
 '#scorad-ui .sc-sign{padding:11px;border:1px solid #dfeaf0;border-radius:12px;margin:8px 0}',
 '#scorad-ui .sc-sign-title{font-size:13px;font-weight:800}#scorad-ui .sc-sign-tip{font-size:11px;color:#657c89;margin:4px 0 9px}',
 '#scorad-ui .sc-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}',
 '#scorad-ui .sc-photo-choice{position:relative;width:100%;aspect-ratio:1/1;min-height:112px;display:block;overflow:hidden;cursor:pointer;padding:0;border:3px solid transparent;border-radius:12px;background-image:url("/assets/scorad-intensidades.webp?v=20261111-1");background-size:400% 600%;background-repeat:no-repeat;background-color:#e9d2c9;box-shadow:0 3px 9px rgba(16,56,73,.09)}',
 '#scorad-ui .sc-photo-choice.on{border-color:#057fa4;box-shadow:0 0 0 2px #e7f7fa,0 4px 16px rgba(9,111,143,.26)}',
 '#scorad-ui .sc-photo-choice:focus-visible{outline:3px solid #0e7290;outline-offset:3px}',
 '#scorad-ui .sc-grade-number{position:absolute;top:7px;right:8px;display:grid;place-items:center;width:25px;height:25px;background:rgba(10,46,65,.91);border-radius:50%;color:white;font-size:13px;font-weight:850;z-index:1}',
 '#scorad-ui .sc-photo-bottom{position:absolute;bottom:0;left:0;right:0;padding:15px 3px 7px;background:linear-gradient(0deg,rgba(10,38,53,.89),transparent);color:white;font-size:11px;line-height:1.2;font-weight:800;text-shadow:0 1px 2px rgba(0,0,0,.2)}',
 '#scorad-ui .sc-photo-choice.on .sc-grade-number{background:#007ea3}',
 '#scorad-ui .sc-reset-button{display:block;width:100%;border:1px solid #cfe3eb;color:#1c6f86;background:#f1f8fa;border-radius:10px;padding:12px;margin-top:15px;font-size:12px;font-weight:800;cursor:pointer}',
 '#scorad-ui .sc-v-item{padding:13px;border:1px solid #dceaf0;border-radius:11px;margin:12px 0}',
 '#scorad-ui .sc-v-item label{display:block;font-size:13px;font-weight:800}#scorad-ui .sc-v-item p{font-size:11px;color:#617a86;margin:4px 0 12px}',
 '#scorad-ui output{display:block;text-align:center;font-size:13px;font-weight:800;color:#146f8c;padding:8px;background:#e6f6f9;border-radius:8px}',
 '#scorad-ui .sc-alert{font-size:12px;color:#a03b38;margin:8px 0;min-height:14px}',
 '#scorad-ui .sc-note{font-size:11px;color:#5a7180;background:#f0f6f8;border-radius:9px;padding:10px 12px;line-height:1.6;margin:11px 0}',
 '#scorad-ui .sc-final{background:linear-gradient(115deg,#103a50,#147b99);color:white;padding:17px;border-radius:14px;text-align:center}',
 '#scorad-ui .sc-final strong{font-size:41px;display:block;line-height:1.3}',
 '#scorad-ui .sc-line{display:flex;justify-content:space-between;align-items:center;gap:8px;border-bottom:1px solid #dfe8ed;padding:10px 2px;font-size:12px}',
 '#scorad-ui .sc-result-details{margin:16px 0 0;display:grid;gap:12px}',
 '#scorad-ui .sc-detail-card{background:#fff;border:1px solid #dee9ef;border-radius:12px;padding:15px 14px}',
 '#scorad-ui .sc-detail-label{font-size:11px;letter-spacing:.04em;text-transform:uppercase;font-weight:800;color:#587586;margin:0 0 10px}',
 '#scorad-ui .sc-formula{display:flex;align-items:center;justify-content:center;text-align:center;min-height:48px;border:1px solid #e2edf1;background:#f8fbfc;border-radius:9px;padding:10px 6px;color:#164c63;font-size:17px;line-height:1.5;font-weight:750;letter-spacing:.01em;font-variant-numeric:tabular-nums}',
 '#scorad-ui .sc-classification{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}',
 '#scorad-ui .sc-severity{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:74px;background:#f8fafb;border:1px solid #e0e8ec;border-radius:10px;padding:9px 5px;text-align:center}',
 '#scorad-ui .sc-severity .sc-severity-range{font-size:12px;color:#4b6776;font-weight:750;white-space:nowrap}',
 '#scorad-ui .sc-severity .sc-severity-name{font-size:12px;color:#183c50;font-weight:800}',
 '#scorad-ui .sc-severity.selected{border:2px solid #117895;background:#ecf8fa;padding:8px 4px}',
 '#scorad-ui .sc-severity.selected .sc-severity-name{color:#086a85}',
 '#scorad-ui .sc-context{padding:12px 14px;border-left:3px solid #bf9e60;border-radius:0 9px 9px 0;background:#f8f7f3;color:#53616a;font-size:11.5px;line-height:1.75;margin:0}',
 '#scorad-ui .sc-result-details+.sc-cites{margin-top:15px}',

 '#scorad-ui .sc-cites{font-size:10px;line-height:1.7;margin:12px 0;color:#536a77}#scorad-ui .sc-cites a{color:#196e86;text-decoration:underline}',
 '#scorad-ui [hidden]{display:none!important}',
 '@media(min-width:660px){#scorad-ui .sc-stage0-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px;align-items:start}#scorad-ui .sc-maps{margin:0}#scorad-ui .sc-editor{margin:0 0 10px}}',
 '@media(max-width:370px){#scorad-ui .sc-choices button{font-size:9px}#scorad-ui .sc-figure svg{height:190px}}'
 ].join('\n');
 document.head.appendChild(st);
}
function render(){
 D={area:{},sign:{},sym:{prurido:0,sono:0},touched:{prurido:false,sono:false}};
 R.forEach(function(r){D.area[r.id]=0;});
 S.forEach(function(s){D.sign[s[0]]=null;});
 selected='trF';step=0;makeCSS();
 var html='<div id="scorad-ui"><div class="sc-tabs" role="tablist">'+
 ['Área corporal','Intensidade','Sintomas','Resultado'].map(function(t,i){return '<button type="button" class="sc-tab" data-tab="'+i+'" aria-selected="false">'+t+'</button>';}).join('')+'</div>'+
 '<section data-stage="0"><h3 class="sc-heading">A · Extensão por área corporal</h3>'+
 '<p class="sc-hint">Selecione cada região do corpo e informe o percentual dela afetado pelo eczema. A contribuição será ponderada automaticamente.</p>'+
 '<div class="sc-total"><span>Superfície corporal acometida (A)</span><strong id="sc-a">0%</strong></div>'+
 '<div class="sc-stage0-grid"><div class="sc-maps">'+skinFigure(false)+skinFigure(true)+'</div>'+
 '<div><div class="sc-editor"><div class="sc-edit-head"><div><strong id="sc-name"></strong><small id="sc-weight"></small></div><span class="sc-current-value" id="sc-pct"></span></div>'+
 '<input id="sc-area-range" type="range" min="0" max="100" step="1" value="0" aria-label="Quanto da região está afetado"/>'+
 '<div class="sc-hints"><span>0% da região</span><span>100% da região</span></div>'+
 '<div class="sc-preset">'+[0,25,50,75,100].map(function(v){return '<button type="button" data-preset="'+v+'">'+v+'%</button>';}).join('')+'</div>'+
 '<small id="sc-weighted" style="font-size:11px;color:#59717e"></small></div><div id="sc-regions" class="sc-list"></div></div></div>'+
 '<div class="sc-note">Regra dos nove: utilizada aqui para adultos e crianças a partir de 2 anos. Em menores de 2 anos, a distribuição anatômica exige adaptação pediátrica e não deve ser calculada com estes percentuais.</div></section>'+
 '<section data-stage="1" hidden><h3 class="sc-heading">B · Intensidade das lesões</h3>'+
 '<p class="sc-hint">Escolha uma área representativa do eczema. Avalie os seis sinais de 0 a 3, independentemente da localização corporal.</p>'+
 S.map(function(s,row){return '<div class="sc-sign"><div class="sc-sign-title">'+s[1]+' <span id="sc-selected-'+s[0]+'" style="float:right;color:#2d849b;font-size:11px"></span></div><div class="sc-sign-tip">'+s[2]+'</div>'+
 '<div class="sc-choices sc-photo-grid">'+['Ausente','Leve','Moderado','Intenso'].map(function(t,i){return '<button type="button" class="sc-photo-choice" style="background-position:'+(i*100/3).toFixed(3)+'% '+(row*100/5).toFixed(3)+'%" data-skey="'+s[0]+'" data-sval="'+i+'" aria-pressed="false" aria-label="'+s[1]+': '+t+', '+i+' pontos"><span class="sc-grade-number">'+i+'</span><span class="sc-photo-bottom">'+i+' · '+t+'</span></button>';}).join('')+'</div></div>';}).join('')+
 '<div class="sc-note">Fotografias clínicas ilustrativas fornecidas como referência. Selecione a graduação de cada sinal em uma área representativa do eczema. A xerose deve ser avaliada em pele não inflamada. B varia de 0 a 18 pontos.</div><div class="sc-alert" id="sc-b-alert"></div></section>'+
 '<section data-stage="2" hidden><h3 class="sc-heading">C · Sintomas subjetivos</h3><p class="sc-hint">Média dos últimos três dias e noites. Confirme as duas escalas, mesmo quando a pontuação for zero.</p>'+
 [['prurido','Prurido','Nenhum prurido → máximo imaginável'],['sono','Perda de sono','Sem comprometimento → máximo imaginável']].map(function(x){return '<div class="sc-v-item"><label for="sc-v-'+x[0]+'">'+x[1]+'</label><p>'+x[2]+'</p><input type="range" id="sc-v-'+x[0]+'" min="0" max="10" value="0" step="0.5"/>'+
 '<div class="sc-hints"><span>0</span><span>10</span></div><output id="sc-output-'+x[0]+'">Marque a intensidade</output></div>';}).join('')+
 '<div class="sc-alert" id="sc-c-alert"></div></section>'+
 '<section data-stage="3" hidden><h3 class="sc-heading">Resultado do SCORAD</h3><div id="sc-results"></div></section></div>';
 var f=document.getElementById('mFields');f.innerHTML=html;
 document.getElementById('overlay').classList.add('scorad-modal','open');
 var mres=document.getElementById('mResult');mres.className='score-result';mres.style.display='none';
 f.querySelectorAll('[data-sc-region]').forEach(function(el){el.addEventListener('click',function(){select(el.dataset.scRegion);});el.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();select(el.dataset.scRegion);}});});
 f.onclick=function(ev){
  var t=ev.target.closest('[data-rid],[data-preset],[data-skey],[data-tab],[data-sc-new]');
  if(!t)return;
  if(t.dataset.rid){select(t.dataset.rid);return;}
  if(t.dataset.preset!==undefined){setArea(Number(t.dataset.preset));return;}
  if(t.dataset.skey){D.sign[t.dataset.skey]=Number(t.dataset.sval);updateSigns();return;}
  if(t.dataset.tab!==undefined){move(Number(t.dataset.tab));return;}
  if(t.dataset.scNew!==undefined){render();return;}
 };
 f.querySelector('#sc-area-range').addEventListener('input',function(ev){setArea(Number(ev.target.value));});
 ['prurido','sono'].forEach(function(id){
  var el=f.querySelector('#sc-v-'+id);
  function set(){D.sym[id]=Number(el.value);D.touched[id]=true;f.querySelector('#sc-output-'+id).textContent=fmt(D.sym[id],1)+' / 10';}
  el.addEventListener('input',set);el.addEventListener('pointerup',set);el.addEventListener('keyup',set);
 });
 updateArea();updateSigns();move(0);
}
function select(id){if(!region(id))return;selected=id;updateArea();}
function setArea(value){if(!Number.isFinite(value))return;D.area[selected]=Math.max(0,Math.min(100,Math.round(value)));updateArea();}
function updateArea(){
 var r=region(selected),f=document.getElementById('scorad-ui');if(!f)return;
 f.querySelector('#sc-a').textContent=fmt(aTotal(),1)+'%';
 f.querySelector('#sc-name').textContent=r.name;
 f.querySelector('#sc-weight').textContent='Peso anatômico: '+fmt(r.w,1)+'% do corpo';
 f.querySelector('#sc-pct').textContent=D.area[r.id]+'%';
 f.querySelector('#sc-area-range').value=D.area[r.id];
 f.querySelector('#sc-weighted').textContent='Contribuição: '+fmt(r.w*D.area[r.id]/100,2)+' pontos percentuais do corpo.';
 f.querySelectorAll('[data-sc-region]').forEach(function(el){
  el.classList.toggle('current',el.dataset.scRegion===selected);
  el.classList.toggle('applied',D.area[el.dataset.scRegion]>0);
 });
 f.querySelectorAll('[data-preset]').forEach(function(el){el.classList.toggle('on',Number(el.dataset.preset)===D.area[r.id]);});
 f.querySelector('#sc-regions').innerHTML=R.map(function(x){return '<button type="button" class="sc-chip'+(selected===x.id?' on':'')+'" data-rid="'+x.id+'"><span>'+x.name+'</span><b>'+D.area[x.id]+'%</b></button>';}).join('');
}
function updateSigns(){
 S.forEach(function(s){
 var f=document.getElementById('sc-selected-'+s[0]);if(!f)return;
 var v=D.sign[s[0]];f.textContent=v===null?'Não avaliado':v+'/3';
 document.querySelectorAll('[data-skey="'+s[0]+'"]').forEach(function(b){var on=v!==null && Number(b.dataset.sval)===v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));});
 });
}
function move(n){
 if(!D)return;
 if(n===3 && !bValid()){document.getElementById('sc-b-alert').textContent='Avalie os seis sinais antes do resultado.';n=1;}
 if(n===3 && !(D.touched.prurido&&D.touched.sono)){document.getElementById('sc-c-alert').textContent='Confirme prurido e sono, inclusive quando a nota for zero.';n=2;}
 step=n;
 document.querySelectorAll('#scorad-ui [data-stage]').forEach(function(el){el.hidden=Number(el.dataset.stage)!==n;});
 document.querySelectorAll('#scorad-ui [data-tab]').forEach(function(el){var on=Number(el.dataset.tab)===n;el.classList.toggle('on',on);el.setAttribute('aria-selected',String(on));});
 document.getElementById('mCalc').textContent=n===3?'Ver resultado ↑':n===2?'Calcular SCORAD →':'Continuar →';
 if(n===3)showResult();
 var modal=document.querySelector('#overlay .modal');
 if(modal)modal.scrollTop=0;
}
function showResult(){
 var a=aTotal(),b=bTotal(),c=D.sym.prurido+D.sym.sono,t=a/5+3.5*b+c;
 var grau=t<25?'Leve':t<50?'Moderada':'Grave';
 document.getElementById('sc-results').innerHTML=
 '<div class="sc-final"><span>SCORAD CLÁSSICO</span><strong>'+fmt(t,1)+'</strong><span>/ 103 · Dermatite atópica '+grau.toLowerCase()+'</span></div>'+
 '<div class="sc-line"><span>A · Extensão</span><b>'+fmt(a,1)+'% = '+fmt(a/5,2)+' pontos</b></div>'+
 '<div class="sc-line"><span>B · Intensidade</span><b>'+b+'/18 = '+fmt(b*3.5,1)+' pontos</b></div>'+
 '<div class="sc-line"><span>C · Sintomas</span><b>'+fmt(c,1)+'/20 pontos</b></div>'+
 '<div class="sc-result-details">'+
 '<section class="sc-detail-card" aria-label="Fórmula do SCORAD"><h4 class="sc-detail-label">Fórmula do SCORAD</h4><div class="sc-formula">A ÷ 5 + (7 × B) ÷ 2 + C</div></section>'+
 '<section class="sc-detail-card" aria-label="Classificação de gravidade"><h4 class="sc-detail-label">Classificação de gravidade</h4><div class="sc-classification">'+
 '<div class="sc-severity'+(t<25?' selected':'')+'"><span class="sc-severity-range">&lt; 25</span><span class="sc-severity-name">Leve</span></div>'+
 '<div class="sc-severity'+(t>=25&&t<50?' selected':'')+'"><span class="sc-severity-range">25–49,9</span><span class="sc-severity-name">Moderada</span></div>'+
 '<div class="sc-severity'+(t>=50?' selected':'')+'"><span class="sc-severity-range">≥ 50</span><span class="sc-severity-name">Grave</span></div>'+
 '</div></section>'+
 '<p class="sc-context">Observação clínica: os pontos de corte podem variar conforme o protocolo. O SCORAD isoladamente não determina a indicação terapêutica.</p>'+
 '</div>'+
 '<div class="sc-cites">Fontes: <a href="https://asbai.org.br/wp-content/uploads/2023/08/Ler-Dermatite-atopica-ABRIL-2022.pdf" target="_blank" rel="noopener">ASBAI, Dermatite Atópica, p. 28</a> · <a href="https://pubmed.ncbi.nlm.nih.gov/21576955/" target="_blank" rel="noopener">Oranje et al., 2011</a> · <a href="https://www.clinicacroce.com.br/scorad/" target="_blank" rel="noopener">Clínica Croce</a> · <a href="https://scorad.corti.li/" target="_blank" rel="noopener">Corti</a>.</div>'+ 
 '<button type="button" class="sc-reset-button" data-sc-new="1">Nova avaliação (zerar dados)</button>';
}
function calculate(){
 if(!D)return;
 if(step===3){showResult();var modal=document.querySelector('#overlay .modal');if(modal)modal.scrollTop=0;return;}
 if(step===0){move(1);return;}
 if(step===1){if(!bValid()){document.getElementById('sc-b-alert').textContent='Avalie os seis sinais antes de continuar.';return;}move(2);return;}
 if(step===2){if(!(D.touched.prurido&&D.touched.sono)){document.getElementById('sc-c-alert').textContent='Confirme as duas escalas.';return;}move(3);}
}
window.scoradRender=render;window.scoradCalcular=calculate;
window.scoradReset=function(){D=null;step=0;};
})();