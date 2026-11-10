
/* Hub do Alergista | Mecanismo H1: infográfico animado vetorial. */
(function(){
'use strict';
function receptor(x,y,mode,slug){
 var h=[70,77,87,92,87,78,69],p=[];
 p.push('<g class="ahp-receptor ahp-rec-'+mode+'" transform="translate('+x+' '+y+')">');
 p.push('<ellipse cx="0" cy="0" rx="39" ry="9" fill="#102e4d" opacity=".13"/>');
 for(var i=0;i<7;i++){
  var xx=(i-3)*11, yy=-h[i];
  p.push('<path d="M'+xx+' '+yy+' q-6 15 0 30 q6 14 0 28 q-6 14 0 27" fill="none" stroke="url(#ahp-grad-'+slug+')" stroke-width="14" stroke-linecap="round"/>');
  p.push('<path d="M'+(xx-3)+' '+(yy+3)+' q-2 10 0 22" stroke="#e7f8ff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".32"/>');
 }
 p.push('<path d="M-14 -69 Q0 -89 14 -69 L8 -51 Q0 -39 -8 -51 Z" fill="'+(mode==='on'?'#eab17e':'#163c62')+'" stroke="#c6e9f0" stroke-width="1.8"/>');
 p.push('<path d="M-41 -44 Q-48 -29 -36 -12 M41 -44 Q48 -29 36 -12" stroke="#225269" stroke-width="3" stroke-linecap="round" fill="none"/>');
 p.push('</g>');return p.join('');
}
function scene(mode){
 var inverse=mode==='inverse',active=mode==='active',slug='ahp-'+mode;
 var p=['<svg class="ahp-scene" viewBox="0 0 320 242" role="img" aria-label="'+
 (inverse?'Anti-H1 favorece a conformação inativa do receptor H1.':active?'Histamina favorece a conformação ativa do receptor H1.':'O receptor H1 oscila entre estados ativo e inativo, mesmo sem ligante.')+'">'];
 p.push('<defs><linearGradient id="ahp-grad-'+slug+'" x1="0" x2=".9" y1="0" y2="1"><stop stop-color="#102f63"/><stop offset=".52" stop-color="#47899d"/><stop offset="1" stop-color="#0e3552"/></linearGradient>');
 p.push('<radialGradient id="ahp-halo-'+slug+'"><stop stop-color="'+(inverse?'#a79cdd':active?'#eeb08b':'#a5d4df')+'" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>');
 p.push('<linearGradient id="ahp-pivot-'+slug+'" x1="0" x2=".9" y1="0" y2="1"><stop stop-color="#465782"/><stop offset="1" stop-color="#152e52"/></linearGradient></defs>');
 p.push('<ellipse cx="'+(inverse?95:active?225:160)+'" cy="117" rx="107" ry="92" fill="url(#ahp-halo-'+slug+')" class="ahp-halo"/>');
 p.push('<path d="M3 106 Q80 85 159 103 T317 91 M3 112 Q80 92 159 110 T317 98 M3 118 Q80 99 159 117 T317 105" stroke="#8ac7d1" stroke-width="1.4" opacity=".26" fill="none"/>');
 p.push('<g class="ahp-seesaw">');
 p.push(receptor(96,172,'off',slug));p.push(receptor(224,172,'on',slug));
 p.push('<path d="M25 191 L295 191" stroke="#1c3758" stroke-width="8" stroke-linecap="round"/>');
 p.push('<path d="M25 187 L295 187" stroke="#8199b0" stroke-width="2" stroke-linecap="round"/>');
 p.push('</g><path d="M160 191 L137 227 L183 227Z" fill="url(#ahp-pivot-'+slug+')" stroke="#243453" stroke-width="1.5"/>');
 p.push('<ellipse cx="160" cy="231" rx="40" ry="3" fill="#223a4a" opacity=".14"/>');
 if(inverse){
  p.push('<g class="ahp-ligand ahp-ligand-inverse"><path d="M57 28 C49 17 56 5 72 3 Q89 0 103 13 C115 26 108 42 95 43 Q77 49 64 39 Z" fill="#9997d3" stroke="#5a61a1" stroke-width="2.6"/><path d="M65 12 Q82 4 94 21" stroke="#e7e0ff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".8"/></g>');
 }else if(active){
  p.push('<g class="ahp-ligand ahp-ligand-active"><path d="M218 7 l10 10 15 -5 0 15 12 11 -14 8 -4 16 -14 -8 -16 4 -1 -16 -13 -9 13 -10 0 -16Z" fill="#e7a06d" stroke="#b65a39" stroke-width="2.6"/><path d="M215 19 q9 -5 15 2" stroke="#ffe7cf" stroke-width="4" fill="none" stroke-linecap="round"/></g>');
  p.push('<g class="ahp-sparks"><circle cx="266" cy="82" r="3" fill="#eab075"/><circle cx="281" cy="111" r="2" fill="#dd9c66"/><circle cx="267" cy="130" r="3" fill="#eab075"/><path d="M265 96 l0 -10 m-5 5 5 -6 5 6" fill="none" stroke="#d59560" stroke-width="2.6"/></g>');
 } else {p.push('<text x="160" y="28" font-size="12" font-weight="650" fill="#7d99a5" text-anchor="middle">Sem ligante</text>');}
 p.push('</svg>');return p.join('');
}
function card(type,index,label,title,subtitle,reading,caption){
 return '<article class="ahp-panel ahp-panel-'+type+'"><div class="ahp-panel-head"><span class="ahp-index">'+index+'</span><span class="ahp-panel-label">'+label+'</span></div>'+
 '<h4>'+title+'</h4><p class="ahp-panel-subtitle">'+subtitle+'</p><div class="ahp-scene-holder">'+scene(type)+'</div>'+
 '<div class="ahp-state-labels"><span>INATIVO</span><span>ATIVO</span></div>'+
 '<div class="ahp-signal ahp-signal-'+type+'"><span class="ahp-signal-dot"></span>'+reading+'</div>'+
 '<p class="ahp-caption">'+caption+'</p></article>';
}
var markup = [
'<details class="ah-mechanism ahp-premium" id="ahMechanism">',
'<summary><span class="ah-mech-icon" aria-hidden="true">H₁</span><span class="ah-mech-label">Clique aqui e entenda o mecanismo de ação<small>Agonista vs. agonista inverso · animação ilustrada</small></span><span class="ah-mech-arrow" aria-hidden="true">⌄</span></summary>',
'<div class="ahp-content"><div class="ahp-heading"><p class="ahp-eyebrow">FARMACODINÂMICA · RECEPTOR H1</p>',
'<h3>Agonista vs. agonista inverso</h3><p>Como funcionam os anti-histamínicos H1</p></div>',
'<p class="ahp-swipe-hint">Deslize para comparar os três estados <span aria-hidden="true">→</span></p>',
'<div class="ahp-comparison" aria-label="Comparação ilustrada de receptor H1 inativo, em equilíbrio basal e ativo">',
card('inverse','01','AGONISTA INVERSO','Anti-histamínico H1','Favorece o estado inativo','Redução da atividade basal','Estabiliza a conformação inativa e diminui a sinalização constitutiva.'),
card('basal','02','EQUILÍBRIO BASAL','Sem fármaco','Inativo ⇄ ativo','Atividade constitutiva','O receptor alterna espontaneamente entre estados, mesmo sem histamina.'),
card('active','03','AGONISTA','Histamina','Favorece o estado ativo','Sinalização aumentada','A histamina estabiliza o estado ativo e amplifica a sinalização H1.'),
'</div><div class="ahp-controls"><div class="ahp-timeline" aria-hidden="true"><span class="ahp-timeline-progress"></span></div>',
'<div class="ahp-control-actions"><button type="button" class="ahp-button" data-ahp-replay>↻ Reproduzir animação</button><button type="button" class="ahp-button ahp-pause" data-ahp-pause aria-pressed="false">Ⅱ Pausar</button></div></div>',
'<div class="ahp-science-note"><span class="ahp-note-mark" aria-hidden="true">i</span><p>O antagonista neutro impede a ação da histamina sem alterar a atividade constitutiva. O agonista inverso favorece o receptor inativo e reduz essa atividade basal. As balanças ilustram o equilíbrio entre conformações, não a estrutura molecular real do receptor.</p></div>',
'<div class="ah-links ahp-references"><a href="https://pubmed.ncbi.nlm.nih.gov/10633171/" target="_blank" rel="noopener noreferrer">Agonismo inverso H1 · estudo experimental</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10762250/" target="_blank" rel="noopener noreferrer">Receptor H1 · revisão estrutural</a></div>',
'</div></details>'
].join('');
function reduced(){return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;}
function play(root){
 var stage=root.querySelector('.ahp-comparison'),bar=root.querySelector('.ahp-timeline');
 if(!stage)return;
 stage.classList.remove('ahp-running','ahp-paused');
 if(bar)bar.classList.remove('ahp-running','ahp-paused');
 void stage.offsetWidth;
 if(!reduced()){stage.classList.add('ahp-running');if(bar)bar.classList.add('ahp-running');}
 var pause=root.querySelector('[data-ahp-pause]');
 if(pause){pause.disabled=!!reduced();pause.setAttribute('aria-pressed','false');pause.textContent='Ⅱ Pausar';}
}
function togglePause(root){
 var stage=root.querySelector('.ahp-comparison'),bar=root.querySelector('.ahp-timeline'),btn=root.querySelector('[data-ahp-pause]');
 if(!stage||!btn||reduced())return;
 var paused=stage.classList.toggle('ahp-paused');
 if(bar)bar.classList.toggle('ahp-paused',paused);
 btn.setAttribute('aria-pressed',String(paused));btn.textContent=paused?'▶ Continuar':'Ⅱ Pausar';
}
var baseInit=window.ahInit;if(typeof baseInit!=='function')return;
window.ahInit=function(){
 baseInit();
 var root=document.getElementById('ahApp');
 if(!root||root.querySelector('#ahMechanism'))return;
 var toolbar=root.querySelector('.ah-toolbar');if(!toolbar)return;
 toolbar.insertAdjacentHTML('beforebegin',markup);
 var details=root.querySelector('#ahMechanism');
 details.addEventListener('toggle',function(){
  if(details.open)play(details);
  else{
   var st=details.querySelector('.ahp-comparison'),bar=details.querySelector('.ahp-timeline');
   if(st)st.classList.remove('ahp-running');if(bar)bar.classList.remove('ahp-running');
  }
 });
 details.addEventListener('click',function(e){
  if(e.target.closest('[data-ahp-replay]'))play(details);
  else if(e.target.closest('[data-ahp-pause]'))togglePause(details);
 });
};
})();