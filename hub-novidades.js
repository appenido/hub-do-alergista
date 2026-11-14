/* Sininho editorial: novos conteúdos do Hub e novos títulos verificados do índice público UpToDate.
   Correções e notícias externas não são notificações de conteúdo novo. */
(function () {
  'use strict';

  var FEED_URL = '/data/hub-novidades.json';
  var SEEN_KEY = 'hub_novidades_lidas_v1';
  var PERMITTED_SECTIONS = ['antihistaminicos','eaaci','scores','laboratorio','imunoglobulinas','imuno','imunizacoes','guidelines','artigos','jornal','interacao','educacao','prompts','material'];
  var items = [];
  var loaded = false;
  var loading = null;
  var lastChecked = '';

  function readSeen() {
    try {
      var saved = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter(function (id) { return typeof id === 'string'; }).slice(-300) : [];
    } catch (_) { return []; }
  }

  function saveSeen(list) {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(list.slice(-300))); } catch (_) {}
  }

  function formatDate(date) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || '');
    return match ? match[3] + '/' + match[2] + '/' + match[1] : '';
  }

  function validItem(item) {
    return item && typeof item.id === 'string' && /^[a-zA-Z0-9-]{3,90}$/.test(item.id) &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.date || '') &&
      typeof item.title === 'string' && item.title.length <= 130 &&
      typeof item.description === 'string' && item.description.length <= 300 &&
      PERMITTED_SECTIONS.indexOf(item.section) !== -1;
  }

  function fetchNews(force) {
    if (loading) return loading;
    if (loaded && !force) return Promise.resolve(items);
    loading = fetch(FEED_URL, { cache: 'no-store', credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('Falha na consulta de novidades');
        return res.json();
      })
      .then(function (data) {
        lastChecked = typeof data.checkedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.checkedAt) ? data.checkedAt : '';
        var list = Array.isArray(data.items) ? data.items.filter(validItem) : [];
        var unique = Object.create(null);
        items = list.filter(function (item) {
          if (unique[item.id]) return false;
          unique[item.id] = true;
          return true;
        }).sort(function (a, b) {
          return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
        }).slice(0, 40);
        loaded = true;
        refreshBell();
        return items;
      })
      .catch(function () {
        // Não mostrar notícias externas ou anúncios fictícios no lugar do feed.
        if (!loaded) items = [];
        refreshBell();
        return loaded ? items : null;
      })
      .finally(function () { loading = null; });
    return loading;
  }

  function refreshBell() {
    var bell = document.getElementById('btnNotif');
    if (!bell) return;
    var seen = readSeen();
    var unread = items.filter(function (item) { return seen.indexOf(item.id) < 0; }).length;
    var dot = bell.querySelector('.tb-dot');
    if (dot) {
      dot.style.display = unread ? 'block' : 'none';
      dot.classList.add('hub-novidades-dot');
      dot.setAttribute('aria-hidden', 'true');
      dot.title = unread ? unread + ' novos conteúdos' : '';
    }
    bell.title = unread ? 'Novidades do Hub: ' + unread + ' conteúdo(s) novo(s)' : 'Novidades do Hub';
    bell.setAttribute('aria-label', bell.title);
  }

  function closeNews() {
    var panel = document.getElementById('notifPanel');
    if (panel) panel.remove();
    var bell = document.getElementById('btnNotif');
    if (bell) bell.setAttribute('aria-expanded', 'false');
  }

  function element(tag, cssClass, text) {
    var node = document.createElement(tag);
    if (cssClass) node.className = cssClass;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderPanel(panel, wasUnread) {
    panel.textContent = '';
    var header = element('div', 'hub-novidades-header');
    var heading = element('div', 'hub-novidades-heading');
    heading.appendChild(element('div', 'hub-novidades-eyebrow', 'ATUALIZAÇÕES DO APLICATIVO'));
    heading.appendChild(element('h2', '', 'Novidades do Hub'));
    heading.appendChild(element('p', '', 'Novos conteúdos adicionados ao aplicativo, organizados para uma consulta rápida.'));
    if (lastChecked) heading.appendChild(element('p', 'hub-novidades-checked', 'Verificação automática: ' + formatDate(lastChecked)));
    header.appendChild(heading);
    var close = element('button', 'hub-novidades-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Fechar novidades');
    close.addEventListener('click', function (event) { event.stopPropagation(); closeNews(); });
    header.appendChild(close);
    panel.appendChild(header);

    var body = element('div', 'hub-novidades-list');
    if (!items.length) {
      body.appendChild(element('p', 'hub-novidades-empty', 'Nenhum novo conteúdo publicado no momento.'));
    }

    items.forEach(function (item) {
      var isUpToDate = item.source === 'uptodate';
      var entry = element('button', 'hub-novidades-entry' + (wasUnread.indexOf(item.id) !== -1 ? ' unread' : '') + (isUpToDate ? ' is-uptodate' : ''));
      entry.type = 'button';
      entry.setAttribute('aria-label', item.title + '. Ir para ' + item.category);
      var icon = isUpToDate ? null : element('span', 'hub-novidades-icon', typeof item.icon === 'string' ? item.icon.slice(0, 4) : '✦');
      if (icon) icon.setAttribute('aria-hidden', 'true');
      var content = element('span', 'hub-novidades-content');
      var meta = element('span', 'hub-novidades-meta');
      meta.appendChild(element('span', '', item.category || 'Novo conteúdo'));
      meta.appendChild(element('span', '', formatDate(item.date)));
      content.appendChild(meta);
      var titleRow = element('span', 'hub-novidades-title-row');
      if (isUpToDate) {
        var sourceMark = element('span', 'hub-novidades-source-uptodate', 'U');
        sourceMark.title = 'UpToDate';
        sourceMark.setAttribute('aria-label', 'Fonte: UpToDate');
        titleRow.appendChild(sourceMark);
      }
      titleRow.appendChild(element('span', 'hub-novidades-title', item.title));
      content.appendChild(titleRow);
      content.appendChild(element('span', 'hub-novidades-description', item.description));
      content.appendChild(element('span', 'hub-novidades-action', 'Abrir conteúdo  →'));
      if (icon) entry.appendChild(icon);
      entry.appendChild(content);
      entry.addEventListener('click', function () {
        closeNews();
        if (typeof window.navTo === 'function') window.navTo(item.section);
      });
      body.appendChild(entry);
    });
    panel.appendChild(body);
  }

  function openNews() {
    if (document.getElementById('notifPanel')) { closeNews(); return; }
    var panel = element('section', 'hub-novidades-panel');
    panel.id = 'notifPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Novidades do Hub');
    panel.setAttribute('aria-modal', 'false');
    panel.appendChild(element('p', 'hub-novidades-empty', 'Carregando novidades...'));
    document.body.appendChild(panel);
    var bell = document.getElementById('btnNotif');
    if (bell) bell.setAttribute('aria-expanded', 'true');
    var seenBefore = readSeen();
    fetchNews(true).then(function (result) {
      if (!panel.isConnected) return;
      if (!result) {
        panel.textContent = '';
        var message = element('div', 'hub-novidades-error', 'As novidades estão temporariamente indisponíveis. Tente novamente.');
        var close = element('button', 'hub-novidades-retry', 'Fechar');
        close.type = 'button';
        close.addEventListener('click', closeNews);
        panel.appendChild(message);
        panel.appendChild(close);
        return;
      }
      renderPanel(panel, items.filter(function (item) { return seenBefore.indexOf(item.id) === -1; }).map(function (item) { return item.id; }));
      // A abertura da central marca como vistas apenas as publicações realmente carregadas.
      var seenNow = readSeen();
      items.forEach(function (item) {
        if (seenNow.indexOf(item.id) === -1) seenNow.push(item.id);
      });
      saveSeen(seenNow);
      refreshBell();
    });
  }

  function addStyles() {
    if (document.getElementById('hub-novidades-styles')) return;
    var style = element('style');
    style.id = 'hub-novidades-styles';
    style.textContent = [
      '#btnNotif{outline-offset:3px;}',
      '#btnNotif:focus-visible{outline:2px solid #66d5df;}',
      '#btnNotif .hub-novidades-dot{width:8px;height:8px;top:5px;right:5px;background:#5cd2df;border:2px solid #102535;box-sizing:content-box;}',
      '#notifPanel.hub-novidades-panel{position:fixed;right:12px;top:calc(env(safe-area-inset-top, 0px) + 61px);width:min(430px, calc(100vw - 24px));max-height:min(76vh, 660px);display:flex;flex-direction:column;overflow:hidden;overscroll-behavior:contain;box-sizing:border-box;background:#fff;border:1px solid #d4e3ea;border-radius:17px;box-shadow:0 16px 48px rgba(11,32,45,.20);z-index:900;color:#173448;font-family:Manrope,Arial,sans-serif;}',
      '.hub-novidades-header{display:flex;flex:0 0 auto;align-items:flex-start;justify-content:space-between;gap:10px;padding:18px 19px 15px;border-bottom:1px solid #dce7eb;background:#fff;}',
      '.hub-novidades-heading h2{margin:3px 0 4px;font-size:19px;line-height:1.3;letter-spacing:-.03em;font-weight:800;color:#13324a;}',
      '.hub-novidades-heading p{font-size:12.5px;line-height:1.5;margin:0;color:#4e6b7a;}',
      '.hub-novidades-heading .hub-novidades-checked{font-size:10.5px;line-height:1.4;margin-top:7px;color:#527480;}',
      '.hub-novidades-eyebrow{font-size:9px;font-weight:800;letter-spacing:.12em;color:#218f9b;}',
      '.hub-novidades-close{border:0;background:#f1f6f7;border-radius:9px;width:29px;height:29px;color:#45616e;font-size:21px;line-height:1;cursor:pointer;flex-shrink:0;}',
      '.hub-novidades-list{display:block;flex:1 1 auto;min-height:0;max-height:none;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px;background:#f1f6f8;scrollbar-gutter:stable;}',
      '.hub-novidades-entry{display:flex;align-items:flex-start;gap:13px;box-sizing:border-box;width:100%;margin:0 0 13px;padding:16px 15px;text-align:left;border:1px solid #d4e1e7;border-left:4px solid #20939e;border-radius:13px;background:#fff;box-shadow:0 3px 10px rgba(25,63,79,.06);cursor:pointer;font-family:inherit;transition:background .16s,border-color .16s,box-shadow .16s,transform .16s;}',
      '.hub-novidades-entry:hover{background:#f9fcfd;border-color:#8ac3cb;box-shadow:0 5px 16px rgba(25,63,79,.11);transform:translateY(-1px);}.hub-novidades-entry:focus-visible{outline:3px solid #188895;outline-offset:2px;}',
      '.hub-novidades-entry.unread{background:#fff;border-left-color:#087a89;box-shadow:0 4px 14px rgba(14,115,128,.11);}.hub-novidades-entry:last-child{margin-bottom:0;}',
      '.hub-novidades-icon{display:inline-flex;flex:0 0 40px;width:40px;height:40px;align-items:center;justify-content:center;border:1px solid #d6e8ec;background:#eaf5f7;border-radius:11px;font-size:21px;line-height:1;}',
      '.hub-novidades-content{display:flex;flex:1;min-width:0;flex-direction:column;align-items:flex-start;gap:8px;}',
      '.hub-novidades-meta{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:7px;width:100%;color:#116d78;font-size:10.5px;font-weight:800;letter-spacing:.015em;}.hub-novidades-meta span:first-child{display:inline-flex;align-items:center;max-width:100%;padding:4px 8px;border-radius:6px;background:#e3f2f4;color:#116d78;}',
      '.hub-novidades-meta span:last-child{color:#526b79;font-weight:700;white-space:nowrap;padding:3px 0;margin-left:auto;}',
      '.hub-novidades-title{display:block;font-weight:800;font-size:15px;line-height:1.35;color:#103146;letter-spacing:-.01em;}',
      '.hub-novidades-description{display:block;font-size:12.5px;line-height:1.55;color:#405d6e;}',
      '.hub-novidades-action{display:inline-flex;align-items:center;justify-content:center;margin-top:4px;padding:7px 11px;border:1px solid #b9dce1;border-radius:8px;background:#eaf6f7;color:#096f7c;font-size:11.5px;line-height:1.35;font-weight:800;}',
      '.hub-novidades-footer{flex:0 0 auto;padding:11px 15px;text-align:center;border-top:1px solid #dce7eb;background:#fff;color:#587585;font-size:10.5px;line-height:1.5;}',
      '.hub-novidades-empty,.hub-novidades-error{padding:23px 18px;text-align:center;color:#68818d;font-size:12px;line-height:1.55;margin:0;}',
      '.hub-novidades-retry{display:block;margin:0 auto 18px;padding:7px 16px;border:1px solid #b5d6d9;border-radius:8px;background:#f2fafb;color:#168896;cursor:pointer;}',
      '@media(max-width:520px){#notifPanel.hub-novidades-panel{top:calc(env(safe-area-inset-top, 0px) + 57px);right:8px;width:calc(100vw - 16px);max-height:76dvh;border-radius:14px;}.hub-novidades-heading h2{font-size:18px;}.hub-novidades-list{padding:10px;scrollbar-gutter:auto;}.hub-novidades-entry{padding:13px 12px;gap:10px;margin-bottom:10px;}.hub-novidades-icon{flex-basis:37px;width:37px;height:37px;}.hub-novidades-title{font-size:14px;}.hub-novidades-description{font-size:12px;}}',
      '.hub-novidades-title-row{display:flex;align-items:flex-start;gap:10px;width:100%;min-width:0;}',
      '.hub-novidades-title{min-width:0;flex:1;font-size:17px;line-height:1.45;font-weight:800;letter-spacing:0;overflow-wrap:break-word;text-align:left;}',
      '.hub-novidades-description{font-size:14px;line-height:1.6;letter-spacing:0;text-align:left;}',
      '.hub-novidades-meta{font-size:12px;line-height:1.4;}',
      '.hub-novidades-action{font-size:12px;min-height:30px;}',
      '.hub-novidades-source-uptodate{display:inline-flex;flex:0 0 33px;width:33px;height:33px;justify-content:center;align-items:center;border:1px solid #bbdfcd;border-radius:9px;background:#e9f6ee;color:#157544;font:800 21px/1 Manrope,Arial,sans-serif;}',
      '.hub-novidades-entry.is-uptodate{border-left-color:#27965d;}',
      '@media(max-width:520px){.hub-novidades-title{font-size:16px;line-height:1.43;}.hub-novidades-description{font-size:13.5px;line-height:1.55;}.hub-novidades-meta{font-size:11.5px;}.hub-novidades-entry{padding:15px 13px;}.hub-novidades-source-uptodate{flex-basis:30px;width:30px;height:30px;font-size:19px;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function start() {
    addStyles();
    var bell = document.getElementById('btnNotif');
    if (!bell) return;
    bell.setAttribute('role', 'button');
    bell.setAttribute('tabindex', '0');
    bell.setAttribute('aria-controls', 'notifPanel');
    bell.setAttribute('aria-expanded', 'false');
    bell.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openNews();
      }
    });
    // A rotina original da Home já chama openNotifPanel() ao clicar no sino.
    window.openNotifPanel = openNews;
    fetchNews(false);
    // Atualizar o sino mesmo se o aplicativo ficar aberto por muito tempo.
    window.setInterval(function () { if (!document.hidden) fetchNews(true); }, 60 * 60 * 1000);
    window.addEventListener('focus', function () { fetchNews(true); });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) fetchNews(true);
    });
    window.addEventListener('storage', function (event) {
      if (event.key === SEEN_KEY) refreshBell();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.getElementById('notifPanel')) closeNews();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
