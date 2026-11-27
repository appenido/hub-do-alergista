/* Fisiopatologia — módulo independente, 26/11/2026. */
(function(){
  'use strict';
  function init(){
    var grid=document.querySelector('#page-dashboard .quick-grid');
    var scroll=document.querySelector('.scroll-area');
    if(!grid||!scroll||document.getElementById('page-fisiopatologia'))return;
    if(typeof PAGE_TITLES!=='undefined')PAGE_TITLES.fisiopatologia='Fisiopatologia';
    var icon='<svg class="q-illustration" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M32 30L14 12M32 30l18-18M32 30L14 51M32 30l18 21" fill="none" stroke="#8bb6c6" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="31" r="15" fill="#e0edf1" stroke="#174f70" stroke-width="2"/><circle cx="32" cy="31" r="7" fill="#174f70"/><circle cx="14" cy="12" r="7" fill="#dbb361" stroke="#a17b32" stroke-width="1.3"/><circle cx="50" cy="12" r="7" fill="#77c6c4" stroke="#147c82" stroke-width="1.3"/><circle cx="14" cy="51" r="7" fill="#77c6c4" stroke="#147c82" stroke-width="1.3"/><circle cx="50" cy="51" r="7" fill="#dbb361" stroke="#a17b32" stroke-width="1.3"/><circle cx="30" cy="28" r="2.5" fill="#fff" opacity=".8"/></svg>';
    var quick=document.createElement('div');
    quick.className='qcard';quick.dataset.nav='fisiopatologia';
    quick.setAttribute('role','button');quick.tabIndex=0;
    quick.setAttribute('aria-label','Abrir Fisiopatologia');
    quick.innerHTML='<div class="qi qi-teal" aria-hidden="true">'+icon+'</div><div class="ql">Fisiopatologia</div>';
    quick.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();quick.click();}});
    var fav=grid.querySelector('[data-nav="favoritos"]');
    if(fav)grid.insertBefore(quick,fav);else grid.appendChild(quick);
    var page=document.createElement('div');page.className='page';page.id='page-fisiopatologia';
    page.innerHTML=`
      <header class="fp-heading"><span class="fp-mark">${icon}</span><div><h1>Fisiopatologia</h1><p>Imunologia aplicada à prática clínica</p></div></header>
      <article class="fp-topic">
        <button type="button" class="fp-toggle" aria-expanded="false"><span class="fp-topic-title">Via Th2<span>(IL-5 × IL-4/IL-13)</span><small>Inflamação tipo 2 na asma</small></span><span class="fp-chevron" aria-hidden="true">⌄</span></button>
        <div class="fp-content" hidden>
          <p class="fp-lead">A inflamação tipo 2 envolve tanto linfócitos Th2 quanto células linfoides inatas do tipo 2 (ILC2). Os eixos de citocinas se sobrepõem e não constituem endótipos mutuamente exclusivos.</p>
          <div class="fp-columns">
            <section class="fp-axis fp-il5"><h2>IL-5</h2><p>Diferenciação, maturação, ativação e sobrevida de eosinófilos.</p><p><b>Marcador associado:</b> eosinófilos sanguíneos, interpretados no contexto clínico e da corticoterapia.</p></section>
            <section class="fp-axis fp-il4"><h2>IL-4 / IL-13</h2><p>IL-4: diferenciação Th2 e troca de classe para IgE. IL-13: metaplasia de células caliciformes, hipersecreção de muco e hiperreatividade brônquica. Ambas participam do recrutamento tecidual de eosinófilos.</p><p><b>Marcador associado:</b> FeNO, particularmente relacionado à sinalização epitelial de IL-13.</p></section>
          </div>
          <section class="fp-note"><h2>Aplicação clínica</h2><p>Dispneia, tosse, sibilância, produção de muco e exacerbações podem ocorrer em ambos os eixos. Não há padrão de sintomas validado que permita determinar isoladamente o predomínio de IL-5 ou IL-4/IL-13. Integrar biomarcadores, comorbidades, história de exacerbações e tratamento atual; nenhum marcador isolado identifica exclusivamente uma via.</p></section>
          <footer class="fp-refs"><h2>Referências</h2><a href="https://ginasthma.org/2026-gina-severe-asthma-guide/" target="_blank" rel="noopener noreferrer">GINA — guia de asma grave (2026)</a><a href="https://doi.org/10.1183/23120541.00576-2021" target="_blank" rel="noopener noreferrer">Inflamação tipo 2 na asma e em outras doenças das vias aéreas — ERJ Open Research (2022)</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10239209/" target="_blank" rel="noopener noreferrer">Inflamação tipo 2 e terapias biológicas na asma (2023)</a><small>Revisão inicial: 26/11/2026.</small></footer>
        </div>
      </article>`;
    var toggle=page.querySelector('.fp-toggle'),content=page.querySelector('.fp-content');
    toggle.addEventListener('click',function(){
      var open=toggle.getAttribute('aria-expanded')!=='true';
      toggle.setAttribute('aria-expanded',String(open));content.hidden=!open;
    });
    scroll.appendChild(page);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();