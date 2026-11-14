/* Hub do Alergista — farmácias e preços por cidade; sem preços inventados. */
(function () {
  'use strict';
  const VERSION = '20261114-1';
  const SESSION_KEY = 'hub_farmacias_cidade_v1';
  const NETWORKS = {
    MG: ['Drogaria Araujo', 'Drogasil', 'Droga Raia', 'Pague Menos'],
    DF: ['Drogaria Rosário', 'Drogasil', 'Droga Raia', 'Pague Menos'],
    RJ: ['Drogarias Pacheco', 'Drogasil', 'Droga Raia', 'Pague Menos'],
    SP: ['Drogaria São Paulo', 'Drogasil', 'Droga Raia', 'Pague Menos'],
    RS: ['Panvel', 'Farmácias São João', 'Drogasil', 'Droga Raia'],
    SC: ['Drogaria Catarinense', 'Farmácias São João', 'Panvel', 'Drogasil'],
    PR: ['Nissei', 'Drogasil', 'Droga Raia', 'Pague Menos'],
    ES: ['Drogasil', 'Droga Raia', 'Pague Menos'],
    GO: ['Drogasil', 'Droga Raia', 'Pague Menos']
  };
  const DEFAULT_NETWORKS = ['Drogasil', 'Droga Raia', 'Pague Menos'];
  const escapeHTML = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const qs = s => document.querySelector(s);
  const formatBRL = value => Number(value).toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
  const validUF = value => /^[A-Z]{2}$/.test(value) ? value : '';
  let locationValue = null;
  let locationPromise = null;
  let active = null;

  try {
    const cached = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (cached && typeof cached.city === 'string' && typeof cached.uf === 'string' &&
        cached.city.length <= 100 && validUF(cached.uf)) locationValue = {city: cached.city, uf: cached.uf, source:'escolhida'};
  } catch (_) {}

  function saveLocation(city, uf) {
    city = String(city || '').trim().replace(/\s+/g,' ').slice(0,100);
    uf = validUF(String(uf || '').trim().toUpperCase());
    if (!city || !uf) return false;
    locationValue = {city, uf, source:'escolhida'};
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(locationValue)); } catch (_) {}
    return true;
  }
  async function discoverLocation() {
    if (locationValue) return locationValue;
    if (!locationPromise) locationPromise = fetch('/api/farmacias-localizacao', {
      credentials:'same-origin', cache:'no-store'
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (!locationValue && data && data.city && validUF(data.uf)) {
        locationValue = {city:String(data.city).slice(0,100), uf:data.uf, source:'aproximada'};
      }
      return locationValue;
    }).catch(() => null);
    return locationPromise;
  }

  function networks() {
    const uf = locationValue && locationValue.uf;
    return NETWORKS[uf] || DEFAULT_NETWORKS;
  }
  function addButton(nameEl) {
    if (nameEl.querySelector('.hub-preco-icon')) return;
    const name = (nameEl.textContent || '').trim().replace(/\s+/g,' ');
    if (!name || name.length > 120) return;
    const priceButton = document.createElement('span');
    priceButton.className = 'hub-preco-icon';
    priceButton.setAttribute('role','button');
    priceButton.tabIndex = 0;
    priceButton.setAttribute('aria-label','Consultar preços de ' + name + ' nas farmácias');
    priceButton.setAttribute('title','Consultar preços em farmácias da sua cidade');
    priceButton.dataset.hubPrice = name;
    priceButton.textContent = '$';
    nameEl.appendChild(priceButton);
  }
  function scan() {
    document.querySelectorAll(
      '#page-imuno .bio-card .bio-name, #ahApp .ah-card-name, [data-hub-medicamento] .hub-med-nome'
    ).forEach(addButton);
  }
  function panelFor(button) {
    return button.closest('#page-imuno .bio-card, #ahApp .ah-card-wrap, [data-hub-medicamento]');
  }
  function createPanel(card) {
    let panel = card.querySelector(':scope > .hub-precos-panel');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'hub-precos-panel';
      panel.setAttribute('aria-label','Consulta de farmácias e preços');
      card.appendChild(panel);
    }
    return panel;
  }
  function pharmacySearchUrl(pharmacy) {
    const city = locationValue ? locationValue.city + ' ' + locationValue.uf : 'Brasil';
    return 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(pharmacy + ' farmácia ' + city);
  }
  function renderPanel(panel, name) {
    const city = locationValue ? locationValue.city + ' / ' + locationValue.uf : 'Cidade ainda não identificada';
    const approximate = locationValue && locationValue.source === 'aproximada';
    panel.innerHTML =
      '<div class="hub-precos-head"><div><span class="hub-precos-eyebrow">CONSULTA DE PREÇOS</span>' +
      '<h3>' + escapeHTML(name) + '</h3><p>Farmácias para consultar em ' + escapeHTML(city) +
      (approximate ? ' <small>(localização aproximada)</small>' : '') + '</p></div>' +
      '<button type="button" class="hub-precos-fechar" data-precos-close aria-label="Fechar consulta">×</button></div>' +
      '<div class="hub-precos-local"><label>Cidade <input data-precos-city maxlength="100" placeholder="Sua cidade" value="' +
      escapeHTML(locationValue ? locationValue.city : '') + '"></label>' +
      '<label>UF <input data-precos-uf maxlength="2" placeholder="UF" value="' +
      escapeHTML(locationValue ? locationValue.uf : '') + '"></label>' +
      '<button type="button" data-precos-save>Aplicar</button></div>' +
      '<p class="hub-precos-help">A cidade pode ser alterada manualmente. Não solicitamos GPS nem registramos localização precisa.</p>' +
      '<div class="hub-precos-redes">' + networks().map(pharmacy =>
        '<a href="' + escapeHTML(pharmacySearchUrl(pharmacy)) +
        '" target="_blank" rel="noopener noreferrer">' +
        '<span>' + escapeHTML(pharmacy) + '</span><small>Ver lojas na cidade ↗</small></a>'
      ).join('') + '</div>' +
      '<div class="hub-precos-ofertas" data-precos-ofertas aria-live="polite"></div>' +
      '<div class="hub-precos-links"><span>Comparar ofertas atuais:</span>' +
      '<a href="https://bula.com.br/precos/" target="_blank" rel="noopener noreferrer">Bula</a>' +
      '<a href="https://buscaremediosbrasil.com/" target="_blank" rel="noopener noreferrer">Busca Remédios Brasil</a>' +
      '<button type="button" data-precos-copy>Copiar nome</button></div>' +
      '<p class="hub-precos-nota">Confirme apresentação (dose, forma e quantidade), estoque, frete e preço final no estabelecimento. ' +
      'A lista de redes é regional e não confirma unidade física ou disponibilidade em cada cidade. ' +
      'O PMC da CMED é um teto regulatório, não o preço de venda.</p>';
    loadOffers(panel, name);
  }
  async function loadOffers(panel, name) {
    const target = panel.querySelector('[data-precos-ofertas]');
    if (!target) return;
    const loc = locationValue || {city:'',uf:''};
    target.innerHTML = '<p class="hub-precos-status">Verificando disponibilidade de preços integrados…</p>';
    try {
      const response = await fetch('/api/farmacias-precos', {
        method:'POST', credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({medication:name,city:loc.city,uf:loc.uf})
      });
      if (!response.ok) throw Error('Consulta indisponível');
      const data = await response.json();
      if (!panel.isConnected || !panel.contains(target)) return;
      const offers = Array.isArray(data.offers) ? data.offers.filter(o =>
        o && Number.isFinite(Number(o.price)) && Number(o.price)>0 &&
        typeof o.pharmacy === 'string' && o.pharmacy.length < 120 &&
        typeof o.presentation === 'string' && o.presentation.length < 250 &&
        /^https:\/\//.test(o.url || '') && o.verified === true
      ).slice(0,20) : [];
      if (!offers.length) {
        target.innerHTML = '<p class="hub-precos-status">Não há preços locais verificados integrados ao Hub para este medicamento. ' +
          'Use os comparadores acima para consultar os valores atuais; nenhum preço foi estimado.</p>';
        return;
      }
      target.innerHTML = '<div class="hub-precos-result-title">Ofertas recebidas do fornecedor ' +
        escapeHTML(data.provider || 'integrado') + '</div>' +
        offers.map(o => '<div class="hub-precos-oferta"><div><span>' + escapeHTML(o.pharmacy) + '</span>' +
          '<small>' + escapeHTML(o.presentation) + (o.ean ? ' · EAN ' + escapeHTML(o.ean) : '') +
          '</small><small>Atualização: ' + escapeHTML(o.updatedAt || 'não informada') + '</small></div>' +
          '<div><span class="hub-precos-valor">' + formatBRL(o.price) + '</span>' +
          '<a href="' + escapeHTML(o.url) + '" target="_blank" rel="noopener noreferrer">Conferir oferta ↗</a></div></div>').join('');
    } catch (_) {
      if (panel.isConnected && panel.contains(target))
        target.innerHTML = '<p class="hub-precos-status">Preços em tempo real não disponíveis nesta consulta. ' +
          'Use os links de comparação para visualizar preços nas farmácias.</p>';
    }
  }
  async function openPrice(button) {
    const card = panelFor(button);
    if (!card) return;
    const name = button.dataset.hubPrice;
    const existing = card.querySelector(':scope > .hub-precos-panel');
    if (existing && !existing.hidden && active === existing) {
      existing.remove(); active = null; button.setAttribute('aria-expanded','false'); return;
    }
    if (active && active.isConnected) active.remove();
    document.querySelectorAll('.hub-preco-icon[aria-expanded=true]').forEach(el => el.setAttribute('aria-expanded','false'));
    const panel = createPanel(card);
    active = panel;
    button.setAttribute('aria-expanded','true');
    renderPanel(panel,name);
    await discoverLocation();
    if (panel.isConnected && active === panel) renderPanel(panel,name);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.hub-preco-icon');
    if (button) {
      event.preventDefault(); event.stopPropagation(); openPrice(button); return;
    }
    const panel = event.target.closest('.hub-precos-panel');
    if (!panel) return;
    if (event.target.closest('[data-precos-close]')) {
      event.preventDefault(); event.stopPropagation();
      panel.remove(); active = null;
      document.querySelectorAll('.hub-preco-icon[aria-expanded=true]').forEach(el => el.setAttribute('aria-expanded','false'));
    } else if (event.target.closest('[data-precos-save]')) {
      event.preventDefault(); event.stopPropagation();
      const city = panel.querySelector('[data-precos-city]').value;
      const uf = panel.querySelector('[data-precos-uf]').value;
      if (!saveLocation(city,uf)) {
        panel.querySelector('[data-precos-city]').setCustomValidity('Informe cidade e UF válidas.');
        panel.querySelector('[data-precos-city]').reportValidity();
        return;
      }
      panel.querySelector('[data-precos-city]').setCustomValidity('');
      const selected = cardNameFromPanel(panel);
      renderPanel(panel,selected);
    } else if (event.target.closest('[data-precos-copy]')) {
      event.preventDefault(); event.stopPropagation();
      const value = cardNameFromPanel(panel);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(() => {
          const b = panel.querySelector('[data-precos-copy]'); if (b) b.textContent='Copiado';
        }).catch(() => {});
      }
    }
  }, true);
  function cardNameFromPanel(panel) {
    const parent = panel.closest('#page-imuno .bio-card, #ahApp .ah-card-wrap, [data-hub-medicamento]');
    const el = parent && parent.querySelector('.hub-preco-icon');
    return (el && el.dataset.hubPrice) || '';
  }
  document.addEventListener('keydown', event => {
    if ((event.key==='Enter' || event.key===' ') && event.target.matches('.hub-preco-icon')) {
      event.preventDefault(); event.stopPropagation(); openPrice(event.target);
    }
  }, true);

  function init() {
    if (document.getElementById('hub-precos-css')) return;
    const style=document.createElement('style'); style.id='hub-precos-css';
    style.textContent = [
      '.hub-preco-icon{display:inline-grid;place-items:center;vertical-align:middle;margin-left:6px;min-width:21px;height:21px;padding:0 5px;border:1px solid #c9a84c;border-radius:7px;background:#fff9e9;color:#8b6714;font-size:12px;font-weight:800;line-height:1;cursor:pointer;position:relative;z-index:3;white-space:nowrap}',
      '.hub-preco-icon:focus-visible{outline:2px solid #13677c;outline-offset:2px}',
      '.hub-precos-panel{padding:15px;margin:8px 12px 14px;background:#fff;border:1px solid #cddfe6;border-radius:13px;box-shadow:0 5px 18px rgba(12,32,48,.08);font:normal 12px/1.5 Manrope,Arial,sans-serif;color:#193342;min-width:0}',
      '.hub-precos-head{display:flex;justify-content:space-between;gap:10px}.hub-precos-head h3{font-size:15px;margin:2px 0}.hub-precos-head p{font-size:11px;color:#506575;margin:0}.hub-precos-eyebrow{font-size:9px;letter-spacing:.06em;color:#8b6714;font-weight:800}.hub-precos-fechar{width:27px;height:27px;border:0;border-radius:7px;background:#edf3f5;font-size:20px;cursor:pointer;flex-shrink:0}',
      '.hub-precos-local{display:flex;gap:6px;align-items:end;flex-wrap:wrap;margin-top:12px}.hub-precos-local label{display:flex;flex-direction:column;font-size:10px;font-weight:700;gap:4px;flex:1;min-width:100px}.hub-precos-local label:nth-child(2){flex:0 0 56px;min-width:56px}.hub-precos-local input{height:32px;width:100%;padding:5px 7px;border:1px solid #bdccd5;border-radius:7px;font:inherit;min-width:0}.hub-precos-local button{height:32px;background:#15546b;color:white;border:0;border-radius:7px;padding:0 10px;cursor:pointer}',
      '.hub-precos-help,.hub-precos-nota{font-size:10px;color:#697c86;line-height:1.55;margin:7px 0 0}.hub-precos-redes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:12px 0}.hub-precos-redes a{display:flex;flex-direction:column;gap:2px;padding:9px;border:1px solid #e2ebef;border-radius:9px;color:#183848;text-decoration:none;min-width:0;font-size:11px;font-weight:700;background:#f9fcfd}.hub-precos-redes small{font-size:9px;color:#2c7585;font-weight:500}',
      '.hub-precos-ofertas{margin:10px 0}.hub-precos-status{padding:9px;border-radius:8px;background:#f3f7f9;color:#536a78;font-size:11px}.hub-precos-links{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-top:12px}.hub-precos-links span{font-size:10px;color:#536a78}.hub-precos-links a,.hub-precos-links button{border:1px solid #bed5dd;border-radius:7px;padding:6px 8px;color:#145d72;background:#fff;text-decoration:none;font:600 10px Manrope,Arial,sans-serif;cursor:pointer}',
      '.hub-precos-result-title{font-size:10px;color:#516670;margin-bottom:7px}.hub-precos-oferta{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid #e5ebed}.hub-precos-oferta>div{display:flex;flex-direction:column;min-width:0}.hub-precos-oferta span{font-weight:700}.hub-precos-oferta small{font-size:10px;color:#687d87;overflow-wrap:anywhere}.hub-precos-valor{font-weight:800;color:#156c57;white-space:nowrap}.hub-precos-oferta a{font-size:10px;color:#14677e;text-decoration:none}',
      '@media(max-width:440px){.hub-precos-panel{margin:7px 5px 11px;padding:10px}.hub-precos-redes{grid-template-columns:1fr}.hub-precos-local label{min-width:80px}}'
    ].join('\n');
    document.head.appendChild(style);
    scan();
    const observer=new MutationObserver(() => {
      if (init._timer) clearTimeout(init._timer);
      init._timer=setTimeout(scan,120);
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();