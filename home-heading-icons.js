/* Identidade visual dos títulos das seções acessadas pela Home.
   Reutiliza o ícone e a cor do cartão correspondente, sem alterar a navegação. */
(function () {
  'use strict';
  const selectors = {
    scores: '#page-scores > .sec-hdr h2',
    artigos: '#page-artigos > div:first-child > div:first-child',
    guidelines: '#page-guidelines > div:first-child > div:first-child',
    eaaci: '#page-eaaci > div:first-child > div:first-child',
    prompts: '#page-prompts > div:first-child > div:first-child',
    educacao: '#page-educacao > div:first-child > div:first-child',
    imuno: '#page-imuno > div:first-child > div:first-child',
    interacao: '#page-interacao > div:first-child > div:first-child',
    imunoglobulinas: '#page-imunoglobulinas .igcalc-header h2',
    antihistaminicos: '#page-antihistaminicos .ah-head h1',
    imunizacoes: '#page-imunizacoes #vac-menu-hub > div:first-child',
    laboratorio: '#page-laboratorio > div:first-child > div:first-child',
    favoritos: '#page-favoritos > div:first-child > div:first-child'
  };

  function installStyles() {
    if (document.getElementById('hub-home-heading-icons-css')) return;
    const style = document.createElement('style');
    style.id = 'hub-home-heading-icons-css';
    style.textContent = [
      '.hub-home-icon-heading{display:flex!important;align-items:center!important;column-gap:10px!important;row-gap:6px;flex-wrap:wrap;min-width:0;max-width:100%;}',
      '.hub-home-heading-icon{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;flex:0 0 34px;width:34px;height:34px;border-radius:11px;font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif;font-size:20px;font-weight:400;line-height:1;background:rgba(37,158,171,.10);border:1px solid rgba(37,158,171,.14);vertical-align:middle;}',
      '.hub-home-heading-icon svg{display:block;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain;}',
      '.hub-home-heading-icon[data-tone="navy"]{background:rgba(13,31,45,.075);border-color:rgba(13,31,45,.12);}',
      '.hub-home-heading-icon[data-tone="gold"]{background:rgba(193,150,55,.11);border-color:rgba(193,150,55,.17);}',
      '.hub-home-heading-icon[data-tone="green"]{background:rgba(40,142,105,.10);border-color:rgba(40,142,105,.15);}',
      '.hub-home-heading-icon[data-tone="teal"]{background:rgba(37,158,171,.10);border-color:rgba(37,158,171,.14);}',
      '#page-scores .hub-home-icon-heading{gap:9px!important;}',
      '#page-antihistaminicos .ah-head .hub-home-icon-heading{display:flex!important;align-items:center!important;}',
      '@media(max-width:600px){.hub-home-icon-heading{column-gap:8px!important;}.hub-home-heading-icon{flex-basis:29px;width:29px;height:29px;border-radius:9px;font-size:18px;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function decorate(key) {
    const selector = selectors[key];
    if (!selector) return;
    const heading = document.querySelector(selector);
    const homeCard = document.querySelector('#page-dashboard .quick-grid .qcard[data-nav="' + key + '"]');
    if (!heading || !homeCard || heading.querySelector('.hub-home-heading-icon')) return;

    const source = homeCard.querySelector('.qi');
    if (!source) return;
    const sourceSvg = source.querySelector('svg');
    const sourceGlyph = sourceSvg ? '' : source.textContent.trim();
    if (!sourceSvg && !sourceGlyph) return;
    const icon = document.createElement('span');
    icon.className = 'hub-home-heading-icon';
    icon.setAttribute('aria-hidden', 'true');

    // A Home usa ilustrações SVG próprias: espelha exatamente o mesmo desenho
    // e renomeia seus gradientes para não duplicar IDs no documento.
    if (sourceSvg) {
      const clonedSvg = sourceSvg.cloneNode(true);
      const idMap = Object.create(null);
      clonedSvg.querySelectorAll('[id]').forEach(function (node) {
        const previous = node.id;
        idMap[previous] = previous + '-heading';
        node.id = idMap[previous];
      });
      clonedSvg.querySelectorAll('*').forEach(function (node) {
        ['fill', 'stroke', 'filter', 'clip-path', 'mask'].forEach(function (attribute) {
          const previous = node.getAttribute(attribute);
          if (!previous || previous.indexOf('url(#') < 0) return;
          node.setAttribute(attribute, previous.replace(/url\(#([^)]+)\)/g, function (all, id) {
            return idMap[id] ? 'url(#' + idMap[id] + ')' : all;
          }));
        });
      });
      icon.appendChild(clonedSvg);
    } else {
      icon.textContent = sourceGlyph;
    }
    const colorClass = Array.from(source.classList).find(function (name) {
      return /^qi-(?:navy|gold|green|teal)$/.test(name);
    });
    icon.dataset.tone = colorClass ? colorClass.replace('qi-', '') : 'teal';

    // Conserva o traço vertical que já identifica os cabeçalhos.
    const accent = Array.from(heading.children).find(function (child) {
      return child.tagName === 'SPAN' &&
        /width\s*:\s*3px/i.test(child.getAttribute('style') || '') &&
        !child.classList.contains('hub-home-heading-icon');
    });
    if (accent) accent.insertAdjacentElement('afterend', icon);
    else heading.insertBefore(icon, heading.firstChild);

    heading.classList.add('hub-home-icon-heading');
  }

  function decorateAll() {
    Object.keys(selectors).forEach(decorate);
  }

  function start() {
    installStyles();
    decorateAll();

    // A seção de anti-histamínicos monta o cabeçalho somente quando é aberta.
    const dynamicPage = document.getElementById('page-antihistaminicos');
    if (dynamicPage && typeof MutationObserver !== 'undefined') {
      new MutationObserver(function () {
        decorate('antihistaminicos');
      }).observe(dynamicPage, { childList: true, subtree: true });
    }

    // Redecora os cabeçalhos se algum painel for reconstruído na navegação.
    document.addEventListener('click', function (event) {
      const link = event.target.closest('[data-nav]');
      if (link && selectors[link.dataset.nav]) {
        requestAnimationFrame(function () { decorate(link.dataset.nav); });
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
