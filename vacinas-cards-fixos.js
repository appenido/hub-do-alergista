/* Vacinas por população: a ficha permanece ancorada ao card de origem.
   A expansão não altera as células nem a ordem da grade. */
(function () {
  'use strict';

  var CSS = `
  #page-imunizacoes #vacListaAll.vac-grid {
    display:grid !important;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:10px;
    align-items:start !important;
    grid-auto-flow:row !important;
    position:relative;
    overflow:visible !important;
    overflow-anchor:none;
    isolation:isolate;
  }
  @media (min-width:680px) {
    #page-imunizacoes #vacListaAll.vac-grid {
      grid-template-columns:repeat(3,minmax(0,1fr)) !important;
    }
  }
  #page-imunizacoes #vacListaAll.vac-grid > details.vac-card,
  #page-imunizacoes #vacListaAll.vac-grid > details.vac-card[open] {
    display:block !important;
    grid-column:auto !important;
    grid-row:auto !important;
    width:100% !important;
    min-width:0 !important;
    height:190px !important;
    min-height:190px !important;
    max-height:190px !important;
    align-self:start !important;
    position:relative !important;
    overflow:visible !important;
    box-sizing:border-box !important;
    z-index:1;
    margin:0 !important;
    border:1px solid #e2e8f0;
    border-radius:15px;
    background:#fff;
    overflow-anchor:none;
    box-shadow:0 2px 10px rgba(13,31,45,.045);
  }
  #page-imunizacoes #vacListaAll.vac-grid > details.vac-card[open] {
    z-index:50 !important;
    border-color:#25819a;
    box-shadow:0 0 0 2px rgba(37,129,154,.18),0 8px 24px rgba(13,31,45,.11);
  }
  #page-imunizacoes #vacListaAll.vac-grid > details.vac-card > summary.vac-header,
  #page-imunizacoes #vacListaAll.vac-grid > details.vac-card[open] > summary.vac-header {
    display:flex !important;
    flex-direction:column !important;
    justify-content:flex-start !important;
    align-items:center !important;
    text-align:center !important;
    gap:6px !important;
    width:100% !important;
    height:188px !important;
    min-height:188px !important;
    max-height:188px !important;
    padding:11px 8px 8px !important;
    overflow:hidden !important;
    box-sizing:border-box !important;
    background:transparent !important;
    border:0 !important;
    cursor:pointer;
  }
  #page-imunizacoes #vacListaAll .vac-header .vac-icon {
    width:36px;height:36px;flex:0 0 36px;
    border-radius:11px;font-size:18px;
  }
  #page-imunizacoes #vacListaAll .vac-header .vac-info {
    flex:1 1 auto;min-width:0;width:100%;
    overflow:hidden;
  }
  #page-imunizacoes #vacListaAll .vac-header .vac-name {
    font-size:12.5px !important;line-height:1.3 !important;
    display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;
    overflow:hidden;overflow-wrap:anywhere;
  }
  #page-imunizacoes #vacListaAll .vac-header .vac-protection,
  #page-imunizacoes #vacListaAll .vac-header .vac-brand {
    font-size:10px !important;line-height:1.3 !important;
    display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
    overflow:hidden;overflow-wrap:anywhere;
  }
  #page-imunizacoes #vacListaAll .vac-header .vac-badge {
    margin-top:5px !important;
  }
  #page-imunizacoes #vacListaAll .vac-chevron {display:none !important;}
  #page-imunizacoes #vacListaAll.vac-grid > details.vac-card > .vac-body {
    display:none;
  }
  #page-imunizacoes #vacListaAll.vac-grid > details.vac-card[open] > .vac-body {
    display:block !important;
    position:absolute !important;
    top:calc(100% - 2px) !important;
    left:var(--vac-panel-left,0px) !important;
    width:var(--vac-panel-width,min(440px,calc(100vw - 28px))) !important;
    min-width:0 !important;
    max-width:none !important;
    max-height:min(62vh,560px) !important;
    max-height:min(62dvh,560px) !important;
    padding:12px 14px 15px !important;
    box-sizing:border-box !important;
    overflow-y:auto !important;
    overflow-x:hidden !important;
    overscroll-behavior:contain;
    -webkit-overflow-scrolling:touch;
    background:#fff !important;
    border:1.5px solid #25819a !important;
    border-radius:0 0 15px 15px;
    box-shadow:0 16px 35px rgba(13,31,45,.2);
    z-index:100;
    overflow-wrap:anywhere;
    scrollbar-width:thin;
  }
  #page-imunizacoes #vacListaAll .vac-body table {max-width:100% !important;table-layout:fixed;}
  #page-imunizacoes #vacListaAll .vac-body td {white-space:normal !important;overflow-wrap:anywhere;}
  #page-imunizacoes #vacListaAll .vac-body td:first-child {width:94px !important;white-space:normal !important;}
  #page-imunizacoes #vacListaAll .vac-body a {overflow-wrap:anywhere;}
  @media(max-width:359px) {
    #page-imunizacoes #vacListaAll.vac-grid {gap:7px;padding-left:9px;padding-right:9px;}
    #page-imunizacoes #vacListaAll .vac-header .vac-name {font-size:11.5px !important;}
    #page-imunizacoes #vacListaAll .vac-header .vac-protection,
    #page-imunizacoes #vacListaAll .vac-header .vac-brand {font-size:9.5px !important;}
    #page-imunizacoes #vacListaAll.vac-grid > details.vac-card[open] > .vac-body {padding:9px 10px !important;}
  }
  @media (prefers-reduced-motion:reduce) {
    #page-imunizacoes #vacListaAll.vac-grid > details.vac-card {transition:none !important;}
  }
  `;

  function init() {
    var grid = document.getElementById('vacListaAll');
    if (!grid || grid.dataset.vacCardFix === 'on') return;
    grid.dataset.vacCardFix = 'on';

    var style = document.createElement('style');
    style.id = 'vacinas-cards-fixos-css';
    style.textContent = CSS;
    document.head.appendChild(style);

    function positionCard(card) {
      if (!card || !card.open || !grid.contains(card)) return;
      var r = card.getBoundingClientRect();
      var g = grid.getBoundingClientRect();
      var viewportW = document.documentElement.clientWidth;
      var leftEdge = Math.max(12, g.left);
      var rightEdge = Math.min(viewportW - 12, g.right);
      var available = Math.max(1, rightEdge - leftEdge);
      var width = Math.min(440, available);
      var left = Math.max(leftEdge, Math.min(r.left, rightEdge - width));
      card.style.setProperty('--vac-panel-left', (left - r.left) + 'px');
      card.style.setProperty('--vac-panel-width', width + 'px');
    }

    function active() {return grid.querySelector('details.vac-card[open]');}

    grid.addEventListener('toggle', function(ev) {
      var target = ev.target;
      if (!target || !target.matches || !target.matches('details.vac-card') || !target.open) return;
      grid.querySelectorAll('details.vac-card[open]').forEach(function(other) {
        if (other !== target) other.open = false;
      });
      positionCard(target);
      requestAnimationFrame(function(){positionCard(target);});
    }, true);

    grid.addEventListener('click', function(ev){
      var summary = ev.target.closest && ev.target.closest('summary.vac-header');
      if (!summary || !grid.contains(summary)) return;
      requestAnimationFrame(function(){positionCard(active());});
    });

    document.addEventListener('keydown', function(ev){
      if (ev.key !== 'Escape') return;
      var opened = active();
      if (!opened) return;
      opened.open = false;
      var summary = opened.querySelector('summary');
      if (summary) summary.focus({preventScroll:true});
    });

    window.addEventListener('resize', function(){positionCard(active());},{passive:true});
    window.addEventListener('orientationchange', function(){positionCard(active());},{passive:true});
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize',function(){positionCard(active());},{passive:true});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
