/* Laboratório — abas internas de fichas de IgE, sem perder pesquisa e nota. */
(function () {
  'use strict';

  var pane, tablist, searchPanel;
  var panels = new Map();
  var active = 'search';
  var searchScroll = null;
  var sequence = 0;

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function safe(value) {
    return typeof window.igeHtml === 'function'
      ? window.igeHtml(value)
      : String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
          return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
        });
  }
  function examFor(code) {
    return (window.IGE_CAT || []).find(function (item) { return item.c === code; });
  }
  function alreadyAdded(code) {
    return Array.isArray(window._ped) && window._ped.some(function (item) { return item.c === code; });
  }
  function scroller() {
    return document.querySelector('.scroll-area');
  }
  function captureScroll() {
    var area = scroller();
    return { windowY: window.scrollY, areaY: area ? area.scrollTop : 0 };
  }
  function restoreScroll(position) {
    if (!position) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (active !== 'search') return;
        var area = scroller();
        if (area) area.scrollTop = position.areaY;
        window.scrollTo(0, position.windowY);
      });
    });
  }
  function positionAtTabs() {
    requestAnimationFrame(function () {
      if (active === 'search' || !tablist) return;
      var area = scroller();
      var delta = tablist.getBoundingClientRect().top - 95;
      if (area && area.scrollHeight > area.clientHeight) {
        area.scrollTop = Math.max(0, area.scrollTop + delta);
      } else {
        window.scrollTo(0, Math.max(0, window.scrollY + delta));
      }
    });
  }
  function tabButton(code, title, panelId, closable) {
    var wrap = el('div', 'ige-local-tab-wrap');
    var button = el('button', 'ige-local-tab', title);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-selected', 'false');
    button.setAttribute('tabindex', '-1');
    button.addEventListener('click', function () { activate(code); });
    wrap.appendChild(button);
    if (closable) {
      var close = el('button', 'ige-local-tab-close', '×');
      close.type = 'button';
      close.title = 'Fechar ficha de ' + title;
      close.setAttribute('aria-label', close.title);
      close.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        closeExam(code);
      });
      wrap.appendChild(close);
    }
    tablist.appendChild(wrap);
    return { wrap: wrap, button: button };
  }
  function setCrossVisible(isSearch) {
    var cross = document.getElementById('foodCrossCard');
    if (cross) cross.classList.toggle('ige-local-search-hidden', !isSearch);
  }
  function activate(code) {
    if (code !== 'search' && !panels.has(code)) return;
    var previous = active;
    if (previous === 'search' && code !== 'search') searchScroll = captureScroll();
    active = code;
    searchPanel.hidden = code !== 'search';
    panels.forEach(function (record, key) {
      record.panel.hidden = key !== code;
      record.button.setAttribute('aria-selected', key === code ? 'true' : 'false');
      record.button.tabIndex = key === code ? 0 : -1;
      record.wrap.classList.toggle('is-active', key === code);
    });
    var searchTab = tablist.querySelector('[data-ige-search-tab]');
    searchTab.setAttribute('aria-selected', code === 'search' ? 'true' : 'false');
    searchTab.tabIndex = code === 'search' ? 0 : -1;
    searchTab.parentElement.classList.toggle('is-active', code === 'search');
    setCrossVisible(code === 'search');
    pane.classList.toggle('ige-showing-ficha', code !== 'search');
    if (code === 'search') {
      restoreScroll(searchScroll);
    } else {
      syncAdded();
      if (previous === 'search') positionAtTabs();
    }
  }
  function closeExam(code) {
    var record = panels.get(code);
    if (!record) return;
    var openCodes = Array.from(panels.keys());
    var index = openCodes.indexOf(code);
    record.panel.remove();
    record.wrap.remove();
    panels.delete(code);
    if (active === code) {
      var next = openCodes[index + 1] || openCodes[index - 1] || 'search';
      activate(panels.has(next) ? next : 'search');
    }
  }
  function syncAdded() {
    panels.forEach(function (record, code) {
      var button = record.panel.querySelector('[data-ige-add-detail]');
      if (!button) return;
      var added = alreadyAdded(code);
      button.textContent = added ? '✓ Na nota' : '+ Adicionar à nota';
      button.setAttribute('aria-pressed', added ? 'true' : 'false');
      button.classList.toggle('is-added', added);
    });
  }
  function addInsideDetail(code) {
    var exam = examFor(code);
    if (!exam || exam.bloqueado) return;
    if (!Array.isArray(window._ped)) return;
    if (!alreadyAdded(code)) window._ped.push({c: exam.c, n: exam.n});
    if (typeof window.igeRender === 'function') window.igeRender();
    if (typeof window.pedRender === 'function') window.pedRender();
    syncAdded();
  }
  function createPanel(exam) {
    var info = typeof window.igeInfo === 'function' ? window.igeInfo(exam) : {};
    var recordId = 'igeFichaInterna' + (++sequence);
    var panel = el('section', 'ige-local-panel ige-ficha', '');
    panel.id = recordId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-label', exam.n + ' — aplicação clínica');
    panel.hidden = true;
    var tipo = info.tipo || exam.g || 'IgE específica';
    var sections = [
      ['O que avalia', info.avalia],
      ['Quando solicitar', info.quando],
      ['Aplicação clínica', info.aplicacao],
      ['Limitações e reatividade cruzada', info.limites]
    ];
    var html = '<div class="ige-ficha-header">' +
      '<div class="ige-ficha-heading"><span class="ige-ficha-code">' + safe(exam.c) + '</span>' +
      '<div><p class="ige-ficha-kicker">FICHA CLÍNICA · IgE ESPECÍFICA</p><h2>' + safe(exam.n) + '</h2>' +
      '<p class="ige-ficha-tipo">' + safe(tipo) + '</p></div></div>' +
      '<div class="ige-ficha-actions"><button type="button" class="ige-ficha-back" data-ige-back>← Voltar à pesquisa</button>' +
      '<button type="button" class="ige-ficha-add" data-ige-add-detail>+ Adicionar à nota</button></div></div>' +
      '<div class="ige-ficha-grid">';
    sections.forEach(function (item) {
      if (!item[1]) return;
      html += '<section class="ige-ficha-section"><h3>' + safe(item[0]) + '</h3><p>' + safe(item[1]) + '</p></section>';
    });
    html += '</div><section class="ige-ficha-references"><h3>Referências científicas</h3>';
    var sources = Array.isArray(info.fontes) ? info.fontes : [];
    var found = 0;
    sources.forEach(function (key) {
      var ref = window.IGE_FONTES && window.IGE_FONTES[key];
      if (!ref || !/^https:\/\//i.test(ref.u || '')) return;
      found++;
      html += '<a href="' + safe(ref.u) + '" target="_blank" rel="noopener noreferrer">' + safe(ref.n) + ' ↗</a>';
    });
    if (!found) html += '<p>Não há referência específica cadastrada para este exame.</p>';
    html += '</section>';
    panel.innerHTML = html;
    panel.querySelector('[data-ige-back]').addEventListener('click', function () { activate('search'); });
    panel.querySelector('[data-ige-add-detail]').addEventListener('click', function () { addInsideDetail(exam.c); });
    pane.appendChild(panel);
    return panel;
  }
  function openExam(code) {
    var exam = examFor(String(code || ''));
    if (!exam) return false;
    if (!panels.has(exam.c)) {
      var panel = createPanel(exam);
      var tab = tabButton(exam.c, exam.n, panel.id, true);
      panels.set(exam.c, {panel: panel, wrap: tab.wrap, button: tab.button});
    }
    activate(exam.c);
    return true;
  }
  function decorateCards() {
    var results = document.getElementById('igeLista');
    if (!results) return;
    results.querySelectorAll('.ige-card > button.ige-hit').forEach(function (oldButton) {
      var codeNode = oldButton.querySelector('.ige-cod');
      var titleNode = oldButton.querySelector('.ige-title');
      var addNode = oldButton.querySelector('.ige-add');
      if (!codeNode || !titleNode || !addNode) return;
      var code = codeNode.textContent.trim();
      var name = titleNode.querySelector('.ige-nome')?.textContent.trim() || code;
      var disabled = oldButton.disabled;
      var selected = oldButton.getAttribute('aria-pressed') === 'true';
      var row = el('div', oldButton.className + ' ige-actions-row');
      var view = el('button', 'ige-exam-view');
      view.type = 'button';
      view.disabled = disabled;
      view.setAttribute('aria-label', 'Abrir ficha clínica: ' + name);
      view.appendChild(codeNode);
      view.appendChild(titleNode);
      view.addEventListener('click', function () { openExam(code); });
      var add = el('button', 'ige-add ige-add-action', addNode.textContent.trim());
      add.type = 'button';
      add.disabled = disabled;
      add.setAttribute('aria-label', (selected ? 'Na nota: ' : 'Adicionar à nota: ') + name);
      add.setAttribute('aria-pressed', selected ? 'true' : 'false');
      add.addEventListener('click', function () {
        if (typeof window.pedAdd === 'function') window.pedAdd(code);
      });
      row.appendChild(view);
      row.appendChild(add);
      oldButton.replaceWith(row);
    });
    syncAdded();
  }
  function init() {
    pane = document.getElementById('labpane-ige');
    if (!pane || window.igeAbrirFicha) return;
    var children = Array.from(pane.children);
    tablist = el('div', 'ige-local-tabs');
    tablist.id = 'igeLocalTabs';
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', 'Abas do Laboratório');
    searchPanel = el('div', 'ige-local-panel');
    searchPanel.id = 'igePesquisaPanel';
    searchPanel.setAttribute('role', 'tabpanel');
    searchPanel.setAttribute('aria-label', 'Pesquisa de IgEs');
    children.forEach(function (child) { searchPanel.appendChild(child); });
    pane.appendChild(tablist);
    pane.appendChild(searchPanel);
    var searchTab = tabButton('search', 'Pesquisa de IgEs', searchPanel.id, false);
    searchTab.button.setAttribute('data-ige-search-tab', '');
    window.igeAbrirFicha = openExam;
    window.igeVoltarFicha = function () {
      if (active === 'search' || !pane.closest('.page.active')) return false;
      activate('search');
      return true;
    };
    if (typeof window.igeRender === 'function') {
      var originalRender = window.igeRender;
      window.igeRender = function () {
        var result = originalRender.apply(this, arguments);
        decorateCards();
        return result;
      };
    }
    activate('search');
    decorateCards();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
})();