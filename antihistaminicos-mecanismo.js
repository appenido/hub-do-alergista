
(function(){
'use strict';
var markup=`
<details class="ah-mechanism" id="ahMechanism">
  <summary>
    <span class="ah-mech-icon" aria-hidden="true">H₁</span>
    <span class="ah-mech-label">Clique aqui e entenda o mecanismo de ação<small>Agonista inverso · animação breve</small></span>
    <span class="ah-mech-arrow" aria-hidden="true">⌄</span>
  </summary>
  <div class="ah-mech-content">
    <p>O receptor H1, acoplado à proteína G, pode apresentar atividade constitutiva. Os anti-histamínicos H1 estabilizam sua conformação inativa e reduzem a sinalização basal, mesmo na ausência de histamina.</p>
    <div class="ah-anim" aria-label="Três etapas: receptor sem ligante, ativação pela histamina e estabilização inativa por anti-histamínico H1.">
      <div class="ah-scene ah-scene-1">
        <div class="ah-scene-title">1 · Receptor sem ligante</div>
        <div class="ah-bio-illustration"><div class="ah-membrane"></div><div class="ah-receptor ah-receptor-basal"><span>H₁</span></div><div class="ah-ligand-label ah-no-ligand">Ativo ⇄ inativo</div></div>
        <div class="ah-meter-label">Atividade constitutiva</div>
        <div class="ah-meter ah-meter-basal"><span></span><span></span><span></span><span></span><span></span></div>
        <p>O receptor pode transmitir sinal mesmo sem histamina.</p>
      </div>
      <div class="ah-scene ah-scene-2">
        <div class="ah-scene-title">2 · Histamina: agonista</div>
        <div class="ah-bio-illustration"><div class="ah-membrane"></div><div class="ah-receptor ah-receptor-on"><span>H₁</span></div><div class="ah-ligand-label ah-histamine">Histamina</div></div>
        <div class="ah-meter-label">Sinalização aumentada</div>
        <div class="ah-meter ah-meter-on"><span></span><span></span><span></span><span></span><span></span></div>
        <p>A histamina favorece o estado ativo e aumenta a sinalização H1.</p>
      </div>
      <div class="ah-scene ah-scene-3">
        <div class="ah-scene-title">3 · Anti-H1: agonista inverso</div>
        <div class="ah-bio-illustration"><div class="ah-membrane"></div><div class="ah-receptor ah-receptor-off"><span>H₁</span></div><div class="ah-ligand-label ah-inverse">Anti-H₁</div></div>
        <div class="ah-meter-label">Sinalização reduzida</div>
        <div class="ah-meter ah-meter-off"><span></span><span></span><span></span><span></span><span></span></div>
        <p>O anti-H1 favorece o estado inativo e reduz inclusive a atividade basal.</p>
      </div>
      <div class="ah-progress" aria-hidden="true"><span></span></div>
    </div>
    <button class="ah-replay" type="button" data-ah-replay>↻ Reproduzir novamente</button>
    <p class="ah-mech-difference">Diferença: um antagonista neutro impede a ação da histamina sem reduzir a atividade constitutiva. O agonista inverso diminui essa atividade basal. Esquema didático, não simulação estrutural do receptor.</p>
    <div class="ah-links">
      <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10762250/" target="_blank" rel="noopener noreferrer">Mecanismo molecular do receptor H1 (2023)</a>
      <a href="https://pubmed.ncbi.nlm.nih.gov/10633171/" target="_blank" rel="noopener noreferrer">Evidência experimental do agonismo inverso (2000)</a>
    </div>
  </div>
</details>`;
function replay(){
 var frame=document.querySelector('#ahMechanism .ah-anim');
 if(!frame)return;
 frame.classList.remove('ah-playing');
 void frame.offsetWidth;
 frame.classList.add('ah-playing');
}
var original=window.ahInit;
if(typeof original!=='function')return;
window.ahInit=function(){
 original();
 var root=document.getElementById('ahApp');
 if(!root || root.querySelector('#ahMechanism'))return;
 var toolbar=root.querySelector('.ah-toolbar');
 if(!toolbar)return;
 toolbar.insertAdjacentHTML('beforebegin',markup);
 root.addEventListener('toggle',function(e){if(e.target.id==='ahMechanism' && e.target.open)replay();},true);
 root.addEventListener('click',function(e){if(e.target.closest('[data-ah-replay]')){replay();}});
};
})();