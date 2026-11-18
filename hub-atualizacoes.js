/* Histórico de mudanças publicadas. Expande na Home sem modal ou navegação. */
(function () {
  'use strict';
  var PAGE_SIZE = 25;
  var REFRESH_AFTER = 5 * 60 * 1000;
  var SECTIONS = ['dashboard','scores','interacao','imunoglobulinas','eaaci','imunizacoes','imuno','medicamentos','guidelines','artigos','laboratorio','jornal','educacao'];

  function element(tag, name, value) {
    var node = document.createElement(tag);
    if (name) node.className = name;
    if (value != null) node.textContent = value;
    return node;
  }
  function normalize(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  function dateLabel(value, short) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    return parts ? parts[3] + '/' + parts[2] + (short ? '' : '/' + parts[1]) : '';
  }
  function valid(item) {
    return item && item.kind === 'content' && /^[a-f0-9]{12}$/.test(item.id || '') && /^\d{4}-\d{2}-\d{2}$/.test(item.date || '') &&
      typeof item.title === 'string' && item.title.length >= 8 && item.title.length <= 500 &&
      typeof item.category === 'string' && item.category.length <= 80 && SECTIONS.indexOf(item.section) >= 0 &&
      ['Novidade','Correção','Melhoria','Remoção'].indexOf(item.type) >= 0;
  }

  function init() {
    var root = document.getElementById('hubAtualizacoes');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';
    var state = root.querySelector('.hau-state');
    var preview = root.querySelector('.hau-preview');
    var details = root.querySelector('.hau-disclosure');
    var summary = root.querySelector('.hau-summary-label');
    var stamp = root.querySelector('.hau-latest');
    var list = root.querySelector('.hau-list');
    var search = root.querySelector('input');
    var category = root.querySelector('select');
    var count = root.querySelector('.hau-count');
    var more = root.querySelector('.hau-more');
    var retry = root.querySelector('.hau-retry');
    var items = [], limit = PAGE_SIZE, lastLoaded = 0, loading = false;

    function render() {
      var term = normalize(search.value.trim());
      var filtered = items.filter(function (item) {
        return (!category.value || category.value === item.section) &&
          (!term || normalize(item.title + ' ' + item.category + ' ' + item.type + ' ' + dateLabel(item.date)).indexOf(term) >= 0);
      });
      list.textContent = '';
      count.textContent = filtered.length + (filtered.length === 1 ? ' atualização encontrada' : ' atualizações encontradas');
      var previousDate = '';
      filtered.slice(0, limit).forEach(function (item) {
        if (item.date !== previousDate) {
          var day = element('h3', 'hau-day');
          var time = element('time', '', dateLabel(item.date));
          time.dateTime = item.date;
          day.appendChild(time);
          list.appendChild(day);
          previousDate = item.date;
        }
        var entry = element('article', 'hau-entry');
        var meta = element('div', 'hau-meta');
        var type = element('span', 'hau-type', item.type);
        type.dataset.type = item.type;
        meta.appendChild(type);
        meta.appendChild(element('span', '', item.category));
        entry.appendChild(meta);
        entry.appendChild(element('p', 'hau-title', item.title));
        list.appendChild(entry);
      });
      if (!filtered.length) list.appendChild(element('p', 'hau-empty', 'Nenhuma atualização encontrada. Tente outro termo ou outra seção.'));
      more.hidden = filtered.length <= limit;
      more.textContent = 'Mostrar mais atualizações (' + Math.max(0, filtered.length - limit) + ' restantes)';
    }

    function refreshPreview() {
      preview.textContent = '';
      items.slice(0, 1).forEach(function (item) {
        var row = element('li');
        var time = element('time', '', dateLabel(item.date, true));
        time.dateTime = item.date;
        row.appendChild(time);
        row.appendChild(element('span', '', item.title));
        preview.appendChild(row);
      });
      preview.hidden = details.open;
      summary.textContent = (details.open ? 'Recolher histórico' : 'Ver histórico completo') + ' · ' + items.length + ' atualizações';
    }

    function load() {
      if (loading) return;
      loading = true;
      retry.hidden = true;
      return fetch('/data/hub-atualizacoes.json', {cache:'no-store', credentials:'same-origin'})
        .then(function (response) { if (!response.ok) throw new Error('Histórico indisponível'); return response.json(); })
        .then(function (data) {
          if (data.version !== 1 || data.scope !== 'clinical-content' || !Array.isArray(data.items)) throw new Error('Histórico inválido');
          var seen = Object.create(null);
          items = data.items.filter(valid).filter(function (item) {
            if (seen[item.id]) return false;
            seen[item.id] = true;
            return true;
          }).sort(function (a, b) { return b.date.localeCompare(a.date) || String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')); });
          if (!items.length) throw new Error('Histórico vazio');
          var selection = category.value;
          category.textContent = '';
          var all = element('option', '', 'Todas as seções'); all.value = ''; category.appendChild(all);
          var categories = Object.create(null);
          items.forEach(function (item) { categories[item.section] = item.category; });
          Object.keys(categories).sort(function (a, b) { return categories[a].localeCompare(categories[b], 'pt-BR'); }).forEach(function (key) {
            var option = element('option', '', categories[key]); option.value = key; category.appendChild(option);
          });
          if (categories[selection]) category.value = selection;
          stamp.textContent = 'Última atualização: ' + dateLabel(items[0].date);
          state.hidden = true;
          details.hidden = false;
          refreshPreview(); render(); lastLoaded = Date.now();
        })
        .catch(function () {
          state.textContent = items.length ? 'Não foi possível buscar novas atualizações. O histórico já carregado permanece disponível.' : 'Não foi possível carregar o histórico agora.';
          state.hidden = false;
          retry.hidden = false;
        })
        .finally(function () { loading = false; });
    }

    details.addEventListener('toggle', function () { refreshPreview(); });
    search.addEventListener('input', function () { limit = PAGE_SIZE; render(); });
    category.addEventListener('change', function () { limit = PAGE_SIZE; render(); });
    more.addEventListener('click', function () {
      var before = list.children.length;
      limit += PAGE_SIZE; render();
      var firstAdded = list.children[before];
      if (firstAdded) { firstAdded.tabIndex = -1; firstAdded.focus({preventScroll:true}); }
    });
    retry.addEventListener('click', load);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && Date.now() - lastLoaded > REFRESH_AFTER) load(); });
    window.addEventListener('online', load);
    window.setInterval(function () { if (!document.hidden && Date.now() - lastLoaded > REFRESH_AFTER) load(); }, REFRESH_AFTER);
    load();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
