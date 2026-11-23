/* Páginas internas com URL, histórico e retorno. Não copia formulários nem dados clínicos. */
(function () {
  'use strict';
  const d = document;
  const layers = '.overlay.open,.ai-sheet.open,.sheet.open,#resumoSheet.open,#pedDrawer.open,#chatPanel.open,.igchat-drawer.open';
  const originalNav = window.navTo;
  let current = null, applying = false, pending = false, header, titleNode, crumbs;
  let masked = [], ancestors = [], projected = null, lastTrigger = null;
  let styles = [];
  // Rolagem independente por rota e por elemento; evita voltar ao início da página.
  const savedPositions = new Map();
  let scrollSequence = 0;
  let restorationTicket = 0;
  let clickOrigin = null;
  // Alguns módulos antigos usam !important. As alterações abaixo são transitórias
  // e reversíveis, para que o índice e os formulários mantenham seus estilos.
  const flat = {display: 'block', position: 'static', inset: 'auto', width: '100%', 'max-width': 'none', 'min-width': '0', height: 'auto', 'max-height': 'none', 'min-height': '0', margin: '0', padding: '0', overflow: 'visible', transform: 'none', border: '0', 'border-radius': '0', 'box-shadow': 'none', background: 'transparent'};
  function enforce(node, declarations) {
    if (!node) return;
    for (const [property, value] of Object.entries(declarations)) {
      styles.push([node, property, node.style.getPropertyValue(property), node.style.getPropertyPriority(property)]);
      node.style.setProperty(property, value, 'important');
    }
  }
  const byId = id => d.getElementById(id);
  const moduleId = () => d.querySelector('.page.active')?.id.replace(/^page-/, '') || 'dashboard';
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const slug = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 100) || 'conteudo';
  const moduleTitle = page => window.PAGE_TITLES?.[page] || 'Hub do Alergista';
  const last = state => state?.steps.at(-1);
  const same = (a, b) => a && b && a.kind === b.kind && a.key === b.key;

  function label(node) {
    const protocol = node?.id && Array.from(d.querySelectorAll('.eaaci-q[data-ego]')).find(n => n.dataset.ego === node.id)?.querySelector('.ql');
    if (protocol) return clean(protocol.textContent);
    const labelled = node?.getAttribute('aria-labelledby');
    if (node?.getAttribute('role') === 'tabpanel' && labelled) return clean(byId(labelled)?.querySelector('span')?.textContent || byId(labelled)?.textContent);
    const exam = node?.closest('.ige-card')?.querySelector('.ige-nome');
    if (exam && node.classList.contains('ige-details')) return clean(exam.textContent) + ' · aplicação clínica';
    const summary = node?.querySelector(':scope > summary');
    const heading = summary?.querySelector('.uci-card-title,.hub-med-nome,.vac-name,.vac-covid-title') || summary || node?.querySelector(':scope > .bio-header .bio-name,.modal-title,.ai-sheet-title,h1,h2,h3');
    return clean(heading?.textContent || node?.getAttribute('aria-label') || 'Conteúdo');
  }
  function identify(node) {
    if (!node) return '';
    if (node.id) return node.id;
    if (node.dataset.hubPageId) return node.dataset.hubPageId;
    const context = node.closest('[data-med-category], [id^="uci-panel-"], [id^="vac-sub-"], .page');
    const summary = node.querySelector(':scope > summary');
    const detailName = summary ? Array.from(summary.querySelectorAll('.hub-med-nome,.asma-brand,.asma-strength,.med-prod-brand')).map(n => n.textContent).join(' ') : '';
    const base = slug((context?.dataset.medCategory || context?.id || 'hub') + '-' + (node.getAttribute('data-uid') || node.getAttribute('data-ah-id') || node.getAttribute('data-fav-id') || detailName || label(node)));
    let key = base, i = 1;
    while (d.querySelector('[data-hub-page-id="' + key + '"]')) key = base + '-' + (++i);
    node.dataset.hubPageId = key;
    return key;
  }
  function locate(key) {
    return byId(key) || Array.from(d.querySelectorAll('[data-hub-page-id]')).find(n => n.dataset.hubPageId === key) || null;
  }
  function stamp() {
    d.querySelectorAll('.page details, .art-card, .guide-card, .fav-row').forEach(identify);
  }
  function url(state) {
    return '#/' + [state.page, ...state.steps.map(step => step.kind + '~' + step.key)].map(encodeURIComponent).join('/');
  }
  function decode(hash) {
    if (!hash.startsWith('#/')) return null;
    try {
      const parts = hash.slice(2).split('/').map(decodeURIComponent), page = parts.shift();
      if (!byId('page-' + page)) return null;
      if (parts.length > 24) return null;
      const kinds = new Set(['conteudo', 'bio', 'categoria', 'anti', 'ig', 'score', 'calendario', 'calendarios', 'favorito', 'vacinas', 'camada', 'aba', 'resultado', 'tabela']);
      const steps = parts.map(part => { const i = part.indexOf('~'); return {kind: part.slice(0, i), key: part.slice(i + 1)}; });
      if (steps.some(step => !kinds.has(step.kind) || !step.key || step.key.length > 250)) return null;
      return {page, steps, index: 0, scroll: 0};
    } catch (_) { return null; }
  }
  function scrollKey(node) {
    if (node.id) return 'id:' + node.id;
    if (!node.dataset.hubScrollId) node.dataset.hubScrollId = 'scroll-' + (++scrollSequence);
    return 'scroll:' + node.dataset.hubScrollId;
  }
  function findScrollNode(key) {
    if (!key) return null;
    if (key.startsWith('id:')) return byId(key.slice(3));
    if (key.startsWith('scroll:')) return d.querySelector('[data-hub-scroll-id="' + CSS.escape(key.slice(7)) + '"]');
    return null;
  }
  function capturePosition() {
    const area = d.querySelector('.scroll-area');
    const position = {
      pageY: Math.max(0, window.scrollY || d.scrollingElement?.scrollTop || 0),
      areaY: Math.max(0, area?.scrollTop || 0),
      nested: []
    };
    const scope = projected || d.querySelector('.page.active');
    if (scope) {
      for (const node of scope.querySelectorAll('*')) {
        if (position.nested.length >= 32) break;
        if (node === area || (!node.scrollTop && !node.scrollLeft)) continue;
        const overflow = getComputedStyle(node).overflowY;
        if (!/(auto|scroll|overlay)/.test(overflow) || node.scrollHeight <= node.clientHeight + 2) continue;
        position.nested.push({key: scrollKey(node), top: node.scrollTop, left: node.scrollLeft});
      }
    }
    const trigger = lastTrigger;
    if (trigger?.isConnected && scope?.contains(trigger) && trigger.getClientRects().length) {
      const top = trigger.getBoundingClientRect().top;
      if (Number.isFinite(top) && Math.abs(top) < window.innerHeight * 2) {
        position.anchor = {key: identify(trigger), top};
      }
    }
    return position;
  }
  function remember() {
    if (!current) return;
    // Alguns módulos reposicionam a página antes de chamar a navegação.
    // Usar a captura anterior ao clique impede que esse salto sobrescreva a posição.
    const origin = clickOrigin;
    current.position = origin?.route === url(current) && Date.now() - origin.at < 800
      ? origin.position : capturePosition();
    clickOrigin = null;
    current.scroll = current.position.pageY || current.position.areaY;
    savedPositions.set(url(current), current.position);
    history.replaceState({hubPage: current}, '', url(current));
  }
  function restorePosition(state, restoring) {
    const ticket = ++restorationTicket;
    const area = d.querySelector('.scroll-area');
    const position = restoring ? state.position || savedPositions.get(url(state)) : null;
    const pageY = restoring ? Math.max(0, position?.pageY ?? state.scroll ?? 0) : 0;
    const areaY = restoring ? Math.max(0, position?.areaY ?? 0) : 0;
    const targetUrl = url(state);
    // Rolagem não é aplicada enquanto a estrutura projetada ainda está mudando.
    function apply() {
      if (ticket !== restorationTicket || url(current) !== targetUrl) return;
      window.scrollTo(0, pageY);
      if (area) area.scrollTop = areaY;
      if (position?.nested) {
        position.nested.forEach(item => {
          const node = findScrollNode(item.key);
          if (node) { node.scrollTop = item.top; node.scrollLeft = item.left; }
        });
      }
      // Compensa a variação de altura de conteúdo acima do botão usado na navegação.
      if (restoring && position?.anchor) {
        const anchor = locate(position.anchor.key);
        if (anchor?.isConnected && anchor.getClientRects().length) {
          const delta = anchor.getBoundingClientRect().top - position.anchor.top;
          if (Math.abs(delta) > 2 && Math.abs(delta) < window.innerHeight * 2) {
            if (pageY > 0 || !area || area.scrollHeight <= area.clientHeight + 2) {
              window.scrollTo(0, Math.max(0, window.scrollY + delta));
            } else {
              area.scrollTop = Math.max(0, area.scrollTop + delta);
            }
          }
        }
      }
    }
    // Duas passagens: primeiro layout e depois estabilização de cards dinâmicos.
    apply();
    requestAnimationFrame(() => requestAnimationFrame(apply));
  }
  function unproject() {
    styles.slice().reverse().forEach(([node, property, value, priority]) => {
      if (value) node.style.setProperty(property, value, priority); else node.style.removeProperty(property);
    });
    styles = [];
    masked.forEach(n => n.classList.remove('hub-route-hidden'));
    ancestors.forEach(n => n.classList.remove('hub-route-ancestor'));
    projected?.classList.remove('hub-route-target');
    masked = []; ancestors = []; projected = null;
  }
  function project(node) {
    unproject();
    d.body.classList.toggle('hub-content-page', !!node);
    header.hidden = !node;
    if (!node) return;
    projected = node;
    node.classList.add('hub-route-target');
    const background = node.id === 'mResult' ? getComputedStyle(node).background : '#fff';
    enforce(node, {...flat, padding: 'clamp(14px, 1.7vw, 26px)', background, opacity: '1', visibility: 'visible'});
    node.querySelectorAll(':scope > summary,:scope > .bio-header,.modal-hdr,.ai-sheet-hdr,.modal-handle,.ai-sheet-handle').forEach(n => enforce(n, {display: 'none'}));
    node.querySelectorAll(':scope > .bio-body,:scope > .vac-body,.modal,.ai-sheet-inner,.ai-sheet-body').forEach(n => enforce(n, flat));
    let branch = node;
    while (branch?.parentElement) {
      const parent = branch.parentElement;
      Array.from(parent.children).forEach(sibling => {
        if (sibling === branch || sibling === header || sibling.matches('script,style,link,.topbar,.toast')) return;
        if (last(current)?.kind === 'ig' && sibling.matches('.igmain-controls')) return;
        sibling.classList.add('hub-route-hidden'); masked.push(sibling);
        enforce(sibling, {display: 'none'});
      });
      if (parent === d.body) break;
      parent.classList.add('hub-route-ancestor'); ancestors.push(parent);
      enforce(parent, flat);
      branch = parent;
    }
    titleNode.textContent = last(current)?.title || label(node);
    d.title = titleNode.textContent + ' | Hub do Alergista';
    crumbs.replaceChildren();
    const paths = [{name: 'Início', state: {page: 'dashboard', steps: []}}];
    if (current.page !== 'dashboard') paths.push({name: moduleTitle(current.page), state: {page: current.page, steps: []}});
    current.steps.slice(0, -1).forEach((step, i) => paths.push({name: step.title || step.key, state: {page: current.page, steps: current.steps.slice(0, i + 1)}}));
    paths.forEach(path => {
      const b = d.createElement('button'); b.type = 'button'; b.textContent = path.name;
      b.addEventListener('click', () => navigate(path.state)); crumbs.appendChild(b);
    });
    const active = d.createElement('span'); active.textContent = titleNode.textContent;
    active.setAttribute('aria-current', 'page'); crumbs.appendChild(active);
  }
  function elementFor(step) {
    if (!step) return null;
    if (step.kind === 'bio') return byId('bio-' + step.key);
    if (step.kind === 'categoria') return byId('med-category-' + step.key);
    if (step.kind === 'anti') return byId('ahDetail');
    if (step.kind === 'ig') return byId('igcalcDetail');
    if (step.kind === 'score') return byId('overlay');
    if (step.kind === 'calendario') return step.key.endsWith(':atraso') ? byId('vac-sub-atraso') : byId('vacCalPreview');
    if (step.kind === 'favorito') return byId('favDetalhe');
    if (step.kind === 'calendarios') return byId('vac-sub-calendarios');
    if (step.kind === 'vacinas') return byId('vac-sub-' + step.key);
    if (step.kind === 'tabela') return byId('atrTabela');
    return locate(step.key);
  }
  function closeStep(step) {
    const node = elementFor(step);
    if (!node) return;
    if (node.tagName === 'DETAILS') { node.open = false; node.classList.remove('sel'); }
    if (step.kind === 'resultado' || step.kind === 'conteudo' && (node.id.startsWith('hubInteressesPanel-') || node.id === 'bio-glossario')) node.classList.add('hub-page-dormant');
    if (step.kind === 'bio') { node.classList.remove('open'); node.querySelector('.bio-header')?.setAttribute('aria-expanded', 'false'); }
    if (step.kind === 'categoria') {
      node.hidden = true; const section = node.closest('.med-category');
      section?.classList.remove('is-open'); section?.querySelector('button')?.setAttribute('aria-expanded', 'false');
    }
    if (step.kind === 'anti') window.ahClosePage?.();
    if (step.kind === 'ig') window.igClosePage?.();
    if (step.kind === 'calendario') window.vacFecharCalendario?.();
    if (step.kind === 'favorito') window.fecharFavorito?.(false);
    if (step.kind === 'score') window.closeModal?.();
    if (step.kind === 'camada') node.classList.remove('open');
    if (step.kind === 'camada' && step.key === 'notifPanel') node.remove();
    if (step.kind === 'calendarios' || step.kind === 'vacinas') window.vacShowHub?.();
    if (step.kind === 'aba') {
      node.hidden = true;
      d.querySelector('[role="tab"][aria-controls="' + CSS.escape(node.id) + '"]')?.setAttribute('aria-selected', 'false');
    }
  }
  function prepare(step) {
    let node;
    if (step.kind === 'categoria') {
      node = elementFor(step);
      if (!node || node.hidden) window.medsOpenCategory?.(step.key);
      step.title ||= clean(elementFor(step)?.closest('.med-category')?.querySelector('.med-category-name')?.textContent);
    } else if (step.kind === 'anti') {
      if (!byId('ahDetail') || byId('ahDetail').dataset.hubAntiKey !== step.key) window.ahOpenPage?.(step.key);
    } else if (step.kind === 'ig') {
      if (byId('igcalcDetail')?.hidden || byId('igcalcDetail')?.dataset.hubIgKey !== step.key) window.igOpenPage?.(step.key);
    } else if (step.kind === 'score') {
      if (byId('overlay')?.dataset.hubScore !== step.key || !byId('overlay')?.classList.contains('open')) window.openScore?.(step.key);
    } else if (step.kind === 'calendario') {
      const [source, id] = step.key.split(':');
      const button = Array.from(d.querySelectorAll('[data-native-id]')).find(n => n.dataset.nativeId === id);
      if (button?.getAttribute('aria-expanded') !== 'true') {
        window.vacAbrirCalendarios?.(source);
        Array.from(d.querySelectorAll('[data-native-id]')).find(n => n.dataset.nativeId === id)?.click();
      }
    } else if (step.kind === 'favorito') {
      if (!byId('favDetalhe')) Array.from(d.querySelectorAll('[data-fav-open]')).find(n => n.dataset.favOpen === step.key)?.click();
    } else if (step.kind === 'calendarios') {
      if (byId('vac-sub-calendarios')?.style.display === 'none' || byId('vac-sub-calendarios')?.dataset.fonte !== step.key) window.vacAbrirCalendarios?.(step.key);
      step.title ||= 'Calendários ' + (step.key === 'pni' ? 'PNI' : 'SBIm');
    } else if (step.kind === 'vacinas') {
      if (elementFor(step)?.style.display === 'none') window.vacShowSub?.(step.key);
      step.title ||= {vacinas: 'Vacinas disponíveis no Brasil', novo: 'Recomendações de vacinação', atraso: 'Recuperação de doses em atraso'}[step.key];
    } else if (step.kind === 'tabela') {
      if (window.ATR_TAB !== Number(step.key)) window.atrTab?.(Number(step.key));
      step.title ||= clean(byId('atrTab' + step.key)?.textContent);
    } else if (step.kind === 'camada' && step.call) {
      const allowed = ['openResumoSheet', 'openAiSheet', 'openMbeSheet', 'openRelatorioSheet', 'abrirModeloRelatorio', 'abrirCarrinho', 'pedAbrir', 'chatToggle', 'igChatToggle'];
      if (!elementFor(step)?.classList.contains('open') && allowed.includes(step.call)) {
        window[step.call]?.(...(step.args || []).map(arg => arg && typeof arg === 'object' ? locate(arg.node) : arg));
      }
    }
    node = elementFor(step);
    if (!node) return null;
    node.classList.remove('hub-page-dormant');
    if (node.tagName === 'DETAILS') { node.open = true; if (node.classList.contains('eaaci-card')) node.classList.add('sel'); }
    if (step.kind === 'bio') { node.classList.add('open'); node.querySelector('.bio-header')?.setAttribute('aria-expanded', 'true'); }
    if (step.kind === 'aba') {
      node.hidden = false; node.classList.add('active');
      if (step.key.startsWith('labpane-')) window.labTab?.(step.key.slice(8));
      d.querySelector('[role="tab"][aria-controls="' + CSS.escape(node.id) + '"]')?.setAttribute('aria-selected', 'true');
    }
    if (step.kind === 'resultado' && !resultReady(node)) return null;
    if (step.kind === 'camada') node.classList.add('open');
    if (!step.title) step.title = label(node);
    return node;
  }
  function transition(next, restoreScroll) {
    applying = true;
    unproject();
    try {
      const previous = current;
      const keep = next.page === previous?.page ? next.steps : [];
      (previous?.steps || []).slice().reverse().forEach(step => { if (!keep.some(s => same(s, step))) closeStep(step); });
      if (moduleId() !== next.page) originalNav(next.page);
      current = next;
      stamp();
      let node = null;
      for (const step of current.steps) {
        const candidate = prepare(step);
        if (!candidate) { current.steps = current.steps.slice(0, current.steps.indexOf(step)); break; }
        node = candidate;
        stamp();
      }
      project(node);
      if (!node) d.title = moduleTitle(current.page) + ' | Hub do Alergista';
      const backButton = byId('tbBack');
      backButton?.classList.toggle('visible', !!current.steps.length || current.page !== 'dashboard');
      restorePosition(current, restoreScroll);
      if (node && !restoreScroll) titleNode.focus({preventScroll: true});
      if (restoreScroll && current.focus) locate(current.focus)?.focus({preventScroll: true});
    } finally { applying = false; }
  }
  function navigate(next, replace) {
    if (applying) return;
    remember();
    const saved = savedPositions.get(url(next));
    const destination = {...next, index: replace ? current.index : current.index + 1,
      scroll: saved ? saved.pageY || saved.areaY : 0,
      position: saved || undefined};
    transition(destination, !!saved);
    history[replace ? 'replaceState' : 'pushState']({hubPage: current}, '', url(current));
  }
  function open(node, title, descriptor) {
    if (!node || applying) return;
    const step = {...(descriptor || {kind: 'conteudo', key: identify(node)}), title: clean(title || label(node))};
    if (same(last(current), step)) { project(node); return; }
    let steps = current?.page === moduleId() ? current.steps.slice() : [];
    // Os antecessores da URL refletem a hierarquia do conteúdo; o histórico mantém cada visita.
    while (steps.length && !elementFor(last({steps}))?.contains(node)) steps.pop();
    if (lastTrigger && current) current.focus = identify(lastTrigger);
    navigate({page: moduleId(), steps: [...steps, step]});
  }
  function back() {
    if (pending || !current) return;
    if (current.index > 0) { pending = true; history.back(); return; }
    if (current.steps.length) navigate({...current, steps: current.steps.slice(0, -1)}, true);
    else if (current.page !== 'dashboard') navigate({page: 'dashboard', steps: []}, true);
  }
  function wrap(name, nodeId, kind, keyFrom) {
    const old = window[name]; if (typeof old !== 'function') return;
    window[name] = function (...args) {
      const result = old.apply(this, args), node = byId(nodeId);
      if (node && (node.classList.contains('open') || (!node.hidden && node.style.display !== 'none'))) {
        const descriptor = {kind: kind || 'camada', key: keyFrom ? keyFrom(args) : nodeId};
        if (descriptor.kind === 'camada') { descriptor.call = name; descriptor.args = args.map(arg => arg instanceof Element ? {node: identify(arg)} : arg); }
        if (name === 'openScore') node.dataset.hubScore = args[0];
        open(node, label(node), descriptor);
      }
      return result;
    };
  }
  function resultReady(node) {
    if (!node || node.hidden || !clean(node.textContent)) return false;
    if (node.id === 'mResult') return node.classList.contains('show');
    return node.style.display !== 'none';
  }
  function showResult() {
    if (applying) return;
    const scope = projected || d.querySelector('.page.active');
    const candidates = scope?.querySelectorAll('#mResult,#vacSaida,#ahResult,[data-dose-result],#fxResult,.gbi-result');
    const node = Array.from(candidates || []).find(resultReady);
    if (node) open(node, 'Resultado', {kind: 'resultado', key: identify(node)});
  }
  function capture(event) {
    if (applying) return;
    const trigger = event.target.closest('button,a,summary,[role="button"],.bio-header');
    if (!trigger) return;
    lastTrigger = trigger;
    if (current) clickOrigin = {route: url(current), position: capturePosition(), at: Date.now()};
    if (trigger.matches('#mCalc')) byId('mResult')?.classList.remove('show');
    if (trigger.matches('#mCalc,[data-ah-calc],#fxCompare,.gbi-btn[type="submit"]') || trigger.getAttribute('onclick')?.startsWith('vacGerarCalendario')) setTimeout(showResult);
    const close = trigger.closest('#tbBack,.pg-back,.btn-back,[data-eclose],[data-ah-close],.vsd-close-inline,.fav-detail-close,.atr-inline-close,#resumoSheetClose,#aiSheetClose,#mbeSheetClose,#relatorioClose,#matCartClose');
    const command = trigger.getAttribute('onclick') || '';
    const closeCommand = /^(?:vacShowHub|vacFecharCalendario|vacFecharCalendariosNivel|igShowHub|pedFechar|closeModal|fecharFavorito)\(/.test(command);
    if ((closeCommand || trigger.id === 'btnNotif' && last(current)?.key === 'notifPanel') && current.steps.length) { event.preventDefault(); event.stopImmediatePropagation(); back(); return; }
    if (close && current.steps.length) { event.preventDefault(); event.stopImmediatePropagation(); back(); return; }
    const protocol = trigger.closest('.eaaci-q[data-ego]');
    if (protocol) { event.preventDefault(); event.stopImmediatePropagation(); const card = byId(protocol.dataset.ego); open(card, protocol.querySelector('.ql')?.textContent, {kind: 'conteudo', key: protocol.dataset.ego}); return; }
    const bio = trigger.closest('.bio-header');
    if (bio && bio.closest('.bio-card')) { event.preventDefault(); event.stopImmediatePropagation(); const card = bio.closest('.bio-card'); open(card, card.querySelector('.bio-name')?.textContent, {kind: 'bio', key: card.id.slice(4)}); return; }
    const summary = trigger.closest('summary');
    if (summary && !summary.closest('#page-formulasInfantis') && summary.parentElement.tagName === 'DETAILS') {
      event.preventDefault(); event.stopImmediatePropagation();
      const details = summary.parentElement; open(details, label(details), {kind: 'conteudo', key: identify(details)}); return;
    }
    const controls = trigger.getAttribute('aria-controls');
    if (controls && trigger.hasAttribute('aria-expanded') && !trigger.matches('[data-ah-id],[data-ig-key],[data-fav-open],[data-native-id],.med-category-toggle')) setTimeout(() => {
      const panel = byId(controls);
      if (panel && panel !== projected && !panel.hidden && trigger.getAttribute('aria-expanded') === 'true') open(panel, label(panel), {kind: 'conteudo', key: panel.id});
    });
    const tab = trigger.closest('[role="tab"][aria-controls]');
    if (tab && !tab.closest('#hubPageHeader')) {
      const panel = byId(tab.getAttribute('aria-controls'));
      if (panel) setTimeout(() => open(panel, clean(tab.textContent), {kind: 'aba', key: panel.id}));
    }
    const native = trigger.closest('[data-native-id]');
    if (native) setTimeout(() => {
      const source = byId('vac-sub-calendarios')?.dataset.fonte || 'sbim';
      const node = native.dataset.nativeId === 'atraso' ? byId('vac-sub-atraso') : byId('vacCalPreview');
      open(node, byId('vacCalPreviewTitulo')?.textContent || clean(native.textContent), {kind: 'calendario', key: source + ':' + native.dataset.nativeId});
    });
    const fav = trigger.closest('[data-fav-open]');
    if (fav) setTimeout(() => { if (byId('favDetalhe')) open(byId('favDetalhe'), clean(fav.textContent), {kind: 'favorito', key: fav.dataset.favOpen}); });
  }
  function start() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('pagehide', remember);
    header = d.createElement('section'); header.id = 'hubPageHeader'; header.hidden = true;
    crumbs = d.createElement('nav'); crumbs.className = 'hub-page-crumbs'; crumbs.setAttribute('aria-label', 'Caminho da página');
    titleNode = d.createElement('h1'); titleNode.id = 'hubPageTitle'; titleNode.tabIndex = -1;
    const returnButton = d.createElement('button'); returnButton.type = 'button'; returnButton.className = 'hub-page-back'; returnButton.textContent = 'Voltar'; returnButton.addEventListener('click', back);
    header.append(crumbs, titleNode, returnButton); d.querySelector('.topbar').after(header);
    stamp();
    current = {page: moduleId(), steps: [], index: 0, scroll: 0};
    const requested = history.state?.hubPage || decode(location.hash);
    if (requested) transition(requested, true);
    history.replaceState({hubPage: current}, '', url(current));
    window.navTo = function (page) {
      if (applying) return originalNav(page);
      if (page === 'prompts') page = 'dashboard';
      const anti = page === 'antihistaminicos'; if (anti) page = 'medicamentos';
      if (!byId('page-' + page)) return;
      if (page === current.page && !current.steps.length && !anti) return;
      navigate({page, steps: anti ? [{kind: 'categoria', key: 'anti', title: 'Anti-histamínicos'}] : []});
    };
    window._hubVoltar = back;
    window.voltarApp = event => { event?.preventDefault(); back(); };
    wrap('openScore', 'overlay', 'score', args => args[0]);
    wrap('openNotifPanel', 'notifPanel');
    const oldBio = window.toggleBio;
    if (oldBio) window.toggleBio = function (id) {
      if (applying) return oldBio.apply(this, arguments);
      const card = byId('bio-' + id);
      if (id === 'glossario') {
        oldBio.apply(this, arguments);
        if (card?.style.display !== 'none') open(card, 'Glossário de terapias alvo', {kind: 'conteudo', key: card.id});
      } else open(card, card?.querySelector('.bio-name')?.textContent, {kind: 'bio', key: id});
    };
    const oldAtrTab = window.atrTab;
    if (oldAtrTab) window.atrTab = function (number) {
      const result = oldAtrTab.apply(this, arguments);
      open(byId('atrTabela'), byId('atrTab' + number)?.textContent, {kind: 'tabela', key: String(number)});
      return result;
    };
    const oldLabTab = window.labTab;
    if (oldLabTab) window.labTab = function (tab) {
      const result = oldLabTab.apply(this, arguments), panel = byId('labpane-' + tab);
      if (panel) open(panel, label(panel), {kind: 'aba', key: panel.id});
      return result;
    };
    const oldUtd = window.toggleUtd;
    if (oldUtd) window.toggleUtd = function (id) {
      const result = oldUtd.apply(this, arguments), panel = byId(id);
      if (panel?.style.display === 'block') open(panel, 'UpToDate', {kind: 'conteudo', key: id});
      return result;
    };
    ['openResumoSheet', 'openAiSheet', 'openMbeSheet', 'openRelatorioSheet', 'abrirModeloRelatorio', 'abrirCarrinho', 'pedAbrir', 'chatToggle', 'igChatToggle'].forEach(name => {
      const ids = {openResumoSheet: 'resumoSheet', openAiSheet: 'aiSheet', openMbeSheet: 'mbeSheet', openRelatorioSheet: 'relatorioSheet', abrirModeloRelatorio: 'relatorioSheet', abrirCarrinho: 'matCartSheet', pedAbrir: 'pedDrawer', chatToggle: 'chatPanel', igChatToggle: 'igChatDrawer'};
      wrap(name, ids[name]);
    });
    const oldVacSub = window.vacShowSub;
    if (oldVacSub) window.vacShowSub = function (sub) {
      const result = oldVacSub.apply(this, arguments);
      const titles = {vacinas: 'Vacinas disponíveis no Brasil', novo: 'Recomendações de vacinação', atraso: 'Recuperação de doses em atraso'};
      if (sub !== 'calendarios') open(byId('vac-sub-' + sub), titles[sub], {kind: 'vacinas', key: sub});
      return result;
    };
    // As duas entradas dos calendários abrem a página da fonte escolhida.
    const oldCalendars = window.vacAbrirCalendarios;
    if (oldCalendars) window.vacAbrirCalendarios = function (source) {
      const result = oldCalendars.apply(this, arguments);
      open(byId('vac-sub-calendarios'), 'Calendários ' + (source === 'pni' ? 'PNI' : 'SBIm'), {kind: 'calendarios', key: source === 'pni' ? 'pni' : 'sbim'});
      return result;
    };
    d.addEventListener('click', capture, true);
    d.addEventListener('submit', () => setTimeout(showResult, 0), true);
    d.addEventListener('keydown', event => { if (event.key === 'Escape' && current.steps.length) { event.preventDefault(); event.stopImmediatePropagation(); back(); } }, true);
    window.addEventListener('popstate', event => {
      pending = false;
      if (event.state?.hubPage) transition(event.state.hubPage, true);
      else { const state = decode(location.hash); if (state) transition(state, true); }
    });
    window.addEventListener('hashchange', () => {
      if (location.hash === url(current)) return;
      const requested = decode(location.hash); if (requested) { requested.index = current.index; transition(requested, false); history.replaceState({hubPage: current}, '', url(current)); }
    });
    let queued = false;
    new MutationObserver(records => {
      if (queued || applying || !records.some(r => r.type === 'childList' || r.attributeName === 'hidden' || r.attributeName === 'class' && !r.target.classList.contains('hub-route-hidden'))) return;
      queued = true;
      queueMicrotask(() => {
        queued = false; stamp();
        if (applying) return;
        const node = elementFor(last(current));
        if (node && node !== projected) project(node);
        const opened = Array.from(d.querySelectorAll(layers)).find(n => !current.steps.some(step => elementFor(step) === n) && !n.classList.contains('hub-route-hidden'));
        if (opened) open(opened, label(opened), {kind: 'camada', key: opened.id});
      });
    }).observe(d.body, {subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden']});
  }
  window.HubPages = {open, back, parseRoute: decode, href: (page, steps = []) => url({page, steps}), get restoring() { return applying; }};
  // Aguarda os catálogos e painéis dinâmicos antes de restaurar uma URL profunda.
  if (d.readyState === 'complete') start(); else d.addEventListener('DOMContentLoaded', start, {once: true});
})();
