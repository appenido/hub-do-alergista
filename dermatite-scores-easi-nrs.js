/* Hub do Alergista — EASI e NRS para dermatite atópica.
 * EASI: HOME EASI User Guide (2017); 4 regiões, pesos pediátricos e sinais regionais.
 * NRS: Peak Pruritus / Worst Itch NRS, pior prurido nas últimas 24 horas.
 * Sem coleta de identificação ou persistência clínica.
 */
(function () {
  'use strict';

  var REGIONS = [
    { id: 'head', name: 'Cabeça e pescoço', short: 'Cabeça / pescoço', adult: 0.1, child: 0.2 },
    { id: 'upper', name: 'Membros superiores', short: 'Braços / mãos', adult: 0.2, child: 0.2 },
    { id: 'trunk', name: 'Tronco', short: 'Tronco', adult: 0.3, child: 0.3 },
    { id: 'lower', name: 'Membros inferiores', short: 'Pernas / pés', adult: 0.4, child: 0.3 }
  ];
  var SIGNS = [
    { id: 'ery', label: 'Eritema', detail: 'Vermelhidão média nas lesões', photoRow: 0 },
    { id: 'pap', label: 'Edema / pápulas', detail: 'Elevação e infiltração das lesões', photoRow: 1 },
    { id: 'exc', label: 'Escoriações', detail: 'Lesões relacionadas à coçadura', photoRow: 3 },
    { id: 'lich', label: 'Liquenificação', detail: 'Espessamento e acentuação das linhas da pele', photoRow: 4 }
  ];
  var state = null;
  var stage = 0;
  var selected = 'head';
  var nrsValue = null;

  function byId(id) { return document.getElementById(id); }
  function root() { return byId('mFields'); }
  function fmt(num, digits) {
    return Number(num).toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  function weight(region) { return state.age === 'child' ? region.child : region.adult; }
  function areaRank(percent) {
    if (percent === null || percent === 0) return 0;
    if (percent < 10) return 1;
    if (percent < 30) return 2;
    if (percent < 50) return 3;
    if (percent < 70) return 4;
    if (percent < 90) return 5;
    return 6;
  }
  function regionalScore(region) {
    var a = state.area[region.id];
    var intensities = SIGNS.map(function (sign) { return state.signs[region.id][sign.id]; });
    if (a === null || a === 0) return 0;
    return areaRank(a) * intensities.reduce(function (s, n) { return s + (n || 0); }, 0) * weight(region);
  }
  function total() { return REGIONS.reduce(function (sum, r) { return sum + regionalScore(r); }, 0); }
  function regionById(id) { return REGIONS.find(function (r) { return r.id === id; }); }
  function allAreas() { return state.age !== null && REGIONS.every(function (r) { return state.area[r.id] !== null; }); }
  function missingSigns() {
    return REGIONS.find(function (r) {
      return state.area[r.id] > 0 && SIGNS.some(function (s) { return state.signs[r.id][s.id] === null; });
    });
  }
  function severity(n) {
    if (n === 0) return 'Sem eczema ativo';
    if (n <= 1) return 'Quase sem lesões';
    if (n <= 7) return 'Leve';
    if (n <= 21) return 'Moderada';
    if (n <= 50) return 'Grave';
    return 'Muito grave';
  }
  function ensureCss() {
    if (byId('hub-da-scores-style')) return;
    var st = document.createElement('style');
    st.id = 'hub-da-scores-style';
    st.textContent = [
      '#overlay.hub-da-modal .modal{width:min(760px,calc(100vw - 12px));max-width:760px;box-sizing:border-box}',
      '#hub-da-ui{font-family:Manrope,system-ui,sans-serif;color:#153a4e;font-size:13px;line-height:1.5}',
      '#hub-da-ui *{box-sizing:border-box}',
      '#hub-da-ui [hidden]{display:none!important}',
      '#hub-da-ui .da-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:4px 0 13px}',
      '#hub-da-ui .da-step{padding:10px 5px;min-height:42px;border:1px solid #d0e1e9;background:#f4f9fb;border-radius:10px;font-weight:800;font-size:11px;color:#597689;cursor:pointer}',
      '#hub-da-ui .da-step.active{background:linear-gradient(125deg,#123e56,#187b98);border-color:#167e9c;color:#fff}',
      '#hub-da-ui .da-title{font-size:16px;font-weight:800;margin:4px 0 6px;color:#153b50}',
      '#hub-da-ui .da-help{font-size:12px;color:#5d7887;line-height:1.65;margin:0 0 12px}',
      '#hub-da-ui .da-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:14px;align-items:start}',
      '#hub-da-ui .da-maps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}',
      '#hub-da-ui .da-map{background:linear-gradient(165deg,#f7fcff,#eaf4f7);border:1px solid #d3e6ed;border-radius:13px;padding:9px 4px;text-align:center}',
      '#hub-da-ui .da-map-label{font-size:10px;font-weight:850;letter-spacing:.08em;color:#5b7e91}',
      '#hub-da-ui .da-map svg{display:block;height:216px;max-width:100%;margin:5px auto}',
      '#hub-da-ui .da-piece{cursor:pointer;outline:none}',
      '#hub-da-ui .da-piece path,#hub-da-ui .da-piece ellipse{fill:#cadae4;stroke:#789aaa;stroke-width:1.3;transition:fill .15s,stroke .15s}',
      '#hub-da-ui .da-piece.filled path,#hub-da-ui .da-piece.filled ellipse{fill:#60b4c0;stroke:#1685a2}',
      '#hub-da-ui .da-piece.active path,#hub-da-ui .da-piece.active ellipse,#hub-da-ui .da-piece:focus-visible path,#hub-da-ui .da-piece:focus-visible ellipse{fill:#e8bd65;stroke:#916d2c;stroke-width:2.2}',
      '#hub-da-ui .da-panel{background:#fff;border:1px solid #d3e4ec;border-radius:13px;padding:13px}',
      '#hub-da-ui .da-row{display:flex;align-items:center;justify-content:space-between;gap:9px}',
      '#hub-da-ui .da-row strong{font-size:13px;color:#143c50}',
      '#hub-da-ui .da-label{font-size:11px;color:#5f7885}',
      '#hub-da-ui .da-number{display:flex;align-items:center;gap:7px;background:#ebf7f9;color:#106e86;border-radius:9px;padding:7px 9px;font-size:16px;font-weight:850;white-space:nowrap}',
      '#hub-da-ui .da-number input{width:60px;border:1px solid #b9d6e0;border-radius:6px;padding:3px 4px;font-size:16px;color:#106e86;font-weight:800;background:#fff;text-align:right}',
      '#hub-da-ui .da-age{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:9px 0 14px}',
      '#hub-da-ui .da-age button,#hub-da-ui .da-preset button{background:#f0f7f9;border:1px solid #c9e0e8;border-radius:9px;padding:10px 5px;color:#256d82;font-size:11px;font-weight:800;cursor:pointer}',
      '#hub-da-ui .da-age button.on,#hub-da-ui .da-preset button.on{background:#166e87;color:#fff;border-color:#166e87}',
      '#hub-da-ui input[type=range]{width:100%;accent-color:#167e9b;cursor:pointer;height:27px;touch-action:pan-y}',
      '#hub-da-ui .da-extremes{display:flex;justify-content:space-between;color:#657e8d;font-size:10px}',
      '#hub-da-ui .da-preset{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin:10px 0}',
      '#hub-da-ui .da-preset button{padding:8px 0;font-size:10px}',
      '#hub-da-ui .da-regions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:10px 0}',
      '#hub-da-ui .da-region{border:1px solid #d8e6ed;background:#f8fbfc;border-radius:9px;min-height:54px;padding:9px 8px;text-align:left;cursor:pointer;color:#355c70}',
      '#hub-da-ui .da-region.on{border-color:#b6934c;background:#fff8e8;box-shadow:inset 3px 0 #c3a05c}',
      '#hub-da-ui .da-region span{display:block;font-size:11px;font-weight:800}',
      '#hub-da-ui .da-region small{display:block;font-size:10px;color:#5d7b88;margin-top:3px}',
      '#hub-da-ui .da-alert{color:#a74533;font-size:11.5px;font-weight:650;min-height:17px;margin:9px 0}',
      '#hub-da-ui .da-note{margin:10px 0;font-size:11px;line-height:1.6;color:#526d7c;background:#f0f6f8;border-radius:9px;padding:10px}',
      '#hub-da-ui .da-photo-sign{background:#fff;border:1px solid #dbe8ee;border-radius:12px;padding:11px;margin:11px 0}',
      '#hub-da-ui .da-photo-sign h4{font-size:13px;color:#173f53;margin:0}',
      '#hub-da-ui .da-photo-sign p{font-size:11px;color:#6a818f;margin:3px 0 9px}',
      '#hub-da-ui .da-photo-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}',
      '#hub-da-ui .da-photo{display:block;position:relative;aspect-ratio:1/1;min-height:88px;border:3px solid transparent;border-radius:10px;background-color:#ecd5c9;background-image:url("/assets/scorad-intensidades.webp?v=20261111-1");background-size:400% 600%;background-repeat:no-repeat;overflow:hidden;cursor:pointer;box-shadow:0 2px 7px rgba(15,63,85,.1)}',
      '#hub-da-ui .da-photo.on{border-color:#067d9d;box-shadow:0 0 0 2px #d9f2f7}',
      '#hub-da-ui .da-photo:focus-visible{outline:3px solid #1682a0;outline-offset:2px}',
      '#hub-da-ui .da-photo-num{position:absolute;right:5px;top:5px;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:rgba(17,45,60,.88);color:#fff;font-size:12px;font-weight:850}',
      '#hub-da-ui .da-photo-caption{position:absolute;left:0;right:0;bottom:0;padding:13px 2px 5px;color:#fff;background:linear-gradient(0deg,rgba(15,45,61,.94),transparent);font-size:10px;font-weight:800;text-align:center}',
      '#hub-da-ui .da-banner{background:linear-gradient(115deg,#113b50,#16819c);border-radius:13px;padding:15px;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:14px}',
      '#hub-da-ui .da-banner span{display:block;font-size:11px;opacity:.86}',
      '#hub-da-ui .da-banner strong{display:block;font-size:36px;font-weight:900;line-height:1.2;font-variant-numeric:tabular-nums}',
      '#hub-da-ui .da-resultrow{display:flex;justify-content:space-between;gap:9px;padding:11px 4px;border-bottom:1px solid #e0ebef;font-size:12px}',
      '#hub-da-ui .da-resultrow b{text-align:right;white-space:nowrap}',
      '#hub-da-ui .da-reset{width:100%;border:1px solid #bed8e4;background:#edf7fa;color:#136c86;padding:12px;border-radius:10px;font-size:12px;font-weight:850;cursor:pointer;margin:11px 0 0}',
      '#hub-da-ui .da-reference{font-size:10px;line-height:1.6;margin:15px 0 0;color:#5e7784}',
      '#hub-da-ui .da-reference a{color:#176d86;text-decoration:underline}',
      '#hub-da-ui .da-nrs-grid{display:grid;grid-template-columns:repeat(11,minmax(0,1fr));gap:4px;margin:11px 0 16px}',
      '#hub-da-ui .da-nrs-choice{border:1px solid #c8e0e8;background:#f0f8fa;border-radius:8px;min-height:44px;padding:8px 0;font-weight:850;color:#245f76;font-size:13px;cursor:pointer}',
      '#hub-da-ui .da-nrs-choice.on{color:#fff;border-color:#176c86;background:#176c86}',
      '#hub-da-ui .da-nrs-result{text-align:center;background:#f0f8fa;border-radius:12px;padding:19px 12px;margin:12px 0}',
      '#hub-da-ui .da-nrs-result strong{font-size:33px;color:#156b85;display:block}',
      '#hub-da-ui .da-nrs-ends{display:flex;justify-content:space-between;font-size:11px;color:#5f7b88;gap:9px}',
      '@media(max-width:640px){#hub-da-ui .da-grid{grid-template-columns:1fr}#hub-da-ui .da-map svg{height:195px}#hub-da-ui .da-photo{min-height:74px}#hub-da-ui .da-nrs-grid{grid-template-columns:repeat(6,minmax(0,1fr))}#hub-da-ui .da-banner strong{font-size:31px}}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function bodyFigure(back) {
    var shapes = {
      head: ['<ellipse cx="90" cy="25" rx="14" ry="18"/>', '<path d="M84 42 L96 42 L97 54 L83 54 Z"/>'],
      upper: [
        '<path d="M67 56 Q58 54 54 69 L42 119 Q39 136 48 137 Q57 138 59 121 L77 76 Z"/>',
        '<path d="M113 56 Q122 54 126 69 L138 119 Q141 136 132 137 Q123 138 121 121 L103 76 Z"/>'
      ],
      trunk: [
        '<path d="M68 53 Q90 49 112 53 L110 132 Q90 139 70 132 Z"/>'
      ],
      lower: [
        '<path d="M70 137 L90 139 L88 219 Q88 233 77 234 Q66 233 67 219 Z"/>',
        '<path d="M90 139 L110 137 L113 219 Q114 233 103 234 Q92 233 92 219 Z"/>'
      ]
    };
    if (back) {
      shapes.lower.push('<path d="M71 129 Q80 131 90 136 Q100 131 109 129 L109 145 Q100 152 90 146 Q80 152 71 145 Z"/>');
    } else {
      shapes.trunk.push('<path d="M83 132 L97 132 L90 146 Z"/>');
    }
    var markup = '<div class="da-map"><div class="da-map-label">' + (back ? 'VISTA POSTERIOR' : 'VISTA ANTERIOR') + '</div><svg viewBox="30 0 120 241" role="img" aria-label="Mapa corporal interativo, ' + (back ? 'costas' : 'frente') + '">';
    REGIONS.forEach(function (r) {
      markup += '<g class="da-piece" data-easi-region="' + r.id + '" role="button" tabindex="0" aria-label="Selecionar ' + r.name + '"><title>' + r.name + '</title>' + shapes[r.id].join('') + '</g>';
    });
    return markup + '</svg></div>';
  }

  function regionButtons(showRank) {
    return REGIONS.map(function (r) {
      var v = state.area[r.id];
      var s = v === null ? 'Não avaliado' : v + '% da região';
      if (showRank && v !== null) s += ' · faixa ' + areaRank(v) + '/6';
      return '<button type="button" class="da-region" data-easi-pick="' + r.id + '"><span>' + r.name + '</span><small>' + s + '</small></button>';
    }).join('');
  }

  function renderEasi() {
    ensureCss();
    stage = 0;
    selected = 'head';
    state = { age: null, area: {}, signs: {} };
    REGIONS.forEach(function (r) {
      state.area[r.id] = null;
      state.signs[r.id] = {};
      SIGNS.forEach(function (s) { state.signs[r.id][s.id] = null; });
    });
    var f = root();
    f.innerHTML =
      '<div id="hub-da-ui" class="da-easi"><div class="da-steps" role="tablist" aria-label="Etapas EASI">' +
      ['Área acometida', 'Sinais clínicos', 'Resultado'].map(function (t, i) {
        return '<button type="button" role="tab" class="da-step" data-easi-tab="' + i + '" aria-selected="false">' + (i + 1) + '. ' + t + '</button>';
      }).join('') +
      '</div><section data-easi-stage="0"><h3 class="da-title">A. Áreas acometidas</h3>' +
      '<p class="da-help">Selecione a faixa etária e toque em cada região nas figuras de frente e costas. Informe a porcentagem da própria região acometida — não a porcentagem do corpo inteiro.</p>' +
      '<label class="da-label">Faixa etária (altera os pesos anatômicos)</label>' +
      '<div class="da-age"><button type="button" data-easi-age="child">Menores de 8 anos</button><button type="button" data-easi-age="adult">8 anos ou mais</button></div>' +
      '<div class="da-grid"><div class="da-maps">' + bodyFigure(false) + bodyFigure(true) + '</div>' +
      '<div><div class="da-panel"><div class="da-row"><div><strong id="da-area-name"></strong><div class="da-label" id="da-area-weight"></div></div><div class="da-number"><input id="da-area-input" type="number" min="0" max="100" step="1" inputmode="numeric" aria-label="Porcentagem da região acometida">%</div></div>' +
      '<input id="da-area-range" type="range" min="0" max="100" step="1" value="0" aria-label="Porcentagem da região acometida">' +
      '<div class="da-extremes"><span>0% da região</span><span>100% da região</span></div>' +
      '<div class="da-preset">' + [0, 5, 10, 25, 50, 75, 100].map(function (n) { return '<button type="button" data-easi-percent="' + n + '">' + n + '%</button>'; }).join('') + '</div>' +
      '<div class="da-label" id="da-area-rank"></div></div><div class="da-regions" id="da-area-regions">' + regionButtons(true) + '</div></div></div>' +
      '<p class="da-note">No EASI, cada região corresponde a uma unidade anatômica; braços esquerdo e direito, por exemplo, são avaliados juntos. Genitais/axilas pertencem ao tronco; nádegas pertencem aos membros inferiores. O desenho é esquemático: a seleção da região não representa a distribuição exata das lesões.</p>' +
      '<p class="da-alert" id="da-area-alert" role="alert"></p></section>' +
      '<section data-easi-stage="1" hidden><h3 class="da-title">B. Intensidade por região</h3>' +
      '<p class="da-help">Para cada região acometida, gradue separadamente os quatro sinais de 0 a 3. As fotografias utilizam a mesma referência visual do SCORAD, mas o cálculo EASI é feito por região.</p>' +
      '<div class="da-regions" id="da-sign-regions">' + regionButtons(false) + '</div>' +
      '<div class="da-panel"><div class="da-row"><strong id="da-sign-title"></strong><span class="da-label" id="da-sign-progress"></span></div><div id="da-sign-content"></div></div>' +
      '<p class="da-alert" id="da-sign-alert" role="alert"></p></section>' +
      '<section data-easi-stage="2" hidden><h3 class="da-title">Resultado do EASI</h3><div id="da-easi-results"></div></section>' +
      '</div>';
    byId('overlay').classList.add('hub-da-modal', 'open');
    var originalResult = byId('mResult');
    originalResult.className = 'score-result';
    originalResult.style.display = 'none';

    f.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-easi-age],button[data-easi-percent],button[data-easi-pick],button[data-easi-tab],button[data-easi-grade],button[data-easi-restart]');
      if (!button) return;
      if (button.hasAttribute('data-easi-age')) {
        state.age = button.dataset.easiAge;
        updateArea();
      } else if (button.hasAttribute('data-easi-percent')) {
        setPercent(Number(button.dataset.easiPercent));
      } else if (button.hasAttribute('data-easi-pick')) {
        selected = button.dataset.easiPick;
        updateArea();
        updateSigns();
      } else if (button.hasAttribute('data-easi-tab')) {
        move(Number(button.dataset.easiTab));
      } else if (button.hasAttribute('data-easi-grade')) {
        var split = button.dataset.easiGrade.split(':');
        state.signs[selected][split[0]] = Number(split[1]);
        updateSigns();
      } else if (button.hasAttribute('data-easi-restart')) {
        renderEasi();
      }
    });
    f.querySelectorAll('[data-easi-region]').forEach(function (el) {
      function activate() { selected = el.dataset.easiRegion; updateArea(); updateSigns(); }
      el.addEventListener('click', activate);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    });
    f.querySelector('#da-area-range').addEventListener('input', function (e) { setPercent(Number(e.target.value)); });
    f.querySelector('#da-area-input').addEventListener('change', function (e) {
      if (e.target.value.trim() === '') { updateArea(); return; }
      setPercent(Number(e.target.value));
    });
    updateArea();
    updateSigns();
    move(0);
  }

  function setPercent(value) {
    if (!Number.isFinite(value)) return;
    state.area[selected] = Math.max(0, Math.min(100, Math.round(value)));
    updateArea();
    updateSigns();
  }

  function updateArea() {
    if (!state || !byId('hub-da-ui')) return;
    var r = regionById(selected);
    byId('da-area-name').textContent = r.name;
    byId('da-area-weight').textContent = state.age === null
      ? 'Selecione a faixa etária'
      : 'Peso da região: ' + fmt(weight(r) * 100, 0) + '% do total';
    byId('da-area-input').value = state.area[selected] === null ? '' : state.area[selected];
    byId('da-area-range').value = state.area[selected] === null ? 0 : state.area[selected];
    byId('da-area-rank').textContent = state.area[selected] === null
      ? 'Área ainda não avaliada'
      : 'Percentual ' + state.area[selected] + '% → grau de área ' + areaRank(state.area[selected]) + '/6';
    root().querySelectorAll('[data-easi-age]').forEach(function (b) { b.classList.toggle('on', b.dataset.easiAge === state.age); });
    root().querySelectorAll('[data-easi-percent]').forEach(function (b) { b.classList.toggle('on', Number(b.dataset.easiPercent) === state.area[selected]); });
    root().querySelectorAll('[data-easi-region]').forEach(function (el) {
      el.classList.toggle('active', el.dataset.easiRegion === selected);
      el.classList.toggle('filled', state.area[el.dataset.easiRegion] > 0);
    });
    root().querySelectorAll('[data-easi-pick]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.easiPick === selected);
      var v = state.area[b.dataset.easiPick];
      var small = b.querySelector('small');
      if (small) small.textContent = v === null ? 'Não avaliado' : v + '% da região · faixa ' + areaRank(v) + '/6';
    });
    byId('da-area-alert').textContent = '';
  }

  function updateSigns() {
    if (!state || !byId('da-sign-title')) return;
    var r = regionById(selected);
    byId('da-sign-title').textContent = r.name;
    var done = SIGNS.filter(function (s) { return state.signs[selected][s.id] !== null; }).length;
    byId('da-sign-progress').textContent = state.area[selected] === 0 ? 'Sem eczema' : done + '/4 sinais';
    root().querySelectorAll('#da-sign-regions [data-easi-pick]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.easiPick === selected);
      var id = b.dataset.easiPick, number = state.area[id];
      var label = b.querySelector('small');
      if (label) label.textContent = number === null ? 'Área não avaliada'
        : number === 0 ? '0% · sem lesões'
        : SIGNS.filter(function (s) { return state.signs[id][s.id] !== null; }).length + '/4 sinais avaliados';
    });
    if (state.area[selected] === null) {
      byId('da-sign-content').innerHTML = '<p class="da-note">Informe primeiro a extensão desta região na etapa anterior.</p>';
      return;
    }
    if (state.area[selected] === 0) {
      byId('da-sign-content').innerHTML = '<p class="da-note">Região sem eczema ativo (0%). Os quatro sinais recebem pontuação 0 automaticamente para o cálculo.</p>';
      return;
    }
    byId('da-sign-content').innerHTML = SIGNS.map(function (s) {
      return '<div class="da-photo-sign"><h4>' + s.label + '</h4><p>' + s.detail + '</p><div class="da-photo-row">' +
        ['Ausente', 'Leve', 'Moderado', 'Intenso'].map(function (title, grade) {
          var active = state.signs[selected][s.id] === grade;
          return '<button type="button" class="da-photo' + (active ? ' on' : '') + '" data-easi-grade="' + s.id + ':' + grade + '" aria-pressed="' + active + '" aria-label="' + s.label + ': ' + title + ', ' + grade + ' pontos" style="background-position:' + (grade * 100 / 3).toFixed(3) + '% ' + (s.photoRow * 20).toFixed(3) + '%"><span class="da-photo-num">' + grade + '</span><span class="da-photo-caption">' + title + '</span></button>';
        }).join('') + '</div></div>';
    }).join('');
    byId('da-sign-alert').textContent = '';
  }

  function move(to) {
    if (!state) return;
    if (to > 0 && !allAreas()) {
      byId('da-area-alert').textContent = state.age === null
        ? 'Selecione a faixa etária e informe a área das quatro regiões, inclusive 0% quando não houver lesões.'
        : 'Informe a área das quatro regiões, inclusive 0% quando não houver lesões.';
      to = 0;
    }
    if (to === 2) {
      var missing = missingSigns();
      if (missing) {
        selected = missing.id;
        updateSigns();
        byId('da-sign-alert').textContent = 'Avalie os quatro sinais de ' + missing.name + ' antes de calcular.';
        to = 1;
      }
    }
    stage = to;
    root().querySelectorAll('[data-easi-stage]').forEach(function (el) { el.hidden = Number(el.dataset.easiStage) !== stage; });
    root().querySelectorAll('[data-easi-tab]').forEach(function (b) {
      var active = Number(b.dataset.easiTab) === stage;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });
    byId('mCalc').textContent = stage === 0 ? 'Continuar para os sinais →' : stage === 1 ? 'Calcular EASI →' : 'Resultado calculado';
    if (stage === 2) {
      renderResult();
      byId('mCalc').style.display = 'none';
    } else {
      byId('mCalc').style.display = '';
    }
    var modal = document.querySelector('#overlay .modal');
    if (modal) modal.scrollTop = 0;
  }

  function renderResult() {
    var score = total();
    var entries = REGIONS.map(function (r) {
      var signs = SIGNS.map(function (s) { return state.signs[r.id][s.id] || 0; });
      return '<div class="da-resultrow"><span>' + r.name + '<br><small>' + state.area[r.id] + '% · faixa ' + areaRank(state.area[r.id]) + '/6 · sinais (' + signs.join('+') + ') · peso ' + fmt(weight(r), 1) + '</small></span><b>' + fmt(regionalScore(r), 1) + '</b></div>';
    }).join('');
    byId('da-easi-results').innerHTML =
      '<div class="da-banner"><div><span>ECZEMA AREA AND SEVERITY INDEX</span><strong>' + fmt(score, 1) + ' / 72</strong><span>' + severity(score) + ' · ' + (state.age === 'child' ? 'menor de 8 anos' : '8 anos ou mais') + '</span></div><svg width="62" height="62" viewBox="0 0 62 62" aria-hidden="true"><circle cx="31" cy="31" r="26" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="8"/><circle cx="31" cy="31" r="26" fill="none" stroke="#e4bb70" stroke-width="8" stroke-dasharray="' + (Math.round(score / 72 * 163.4)) + ' 163.4" transform="rotate(-90 31 31)"/></svg></div>' +
      entries +
      '<p class="da-note">Fórmula de cada região: (eritema + edema/pápulas + escoriações + liquenificação) × faixa de área (0–6) × peso anatômico. O resultado total é a soma das quatro regiões (0–72). A extensão no EASI é expressa em faixas, não diretamente como percentual de superfície corporal.</p>' +
      '<p class="da-note">Faixas interpretativas propostas na literatura: 0 sem eczema; 0,1–1 quase sem lesões; 1,1–7 leve; 7,1–21 moderada; 21,1–50 grave; acima de 50 muito grave. A classificação não substitui os critérios clínicos e regulatórios para tratamento.</p>' +
      '<p class="da-reference">Referências: <a href="https://www.homeforeczema.org/documents/easi-user-guide-jan-2017-v3.pdf" target="_blank" rel="noopener noreferrer">HOME, guia oficial do EASI (2017)</a> · <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9154300/" target="_blank" rel="noopener noreferrer">EASI: guia prático (2022)</a>. Fotografias dos sinais: acervo ilustrativo já utilizado no SCORAD do Hub.</p>' +
      '<button type="button" class="da-reset" data-easi-restart="1">Nova avaliação EASI</button>';
  }

  function calcEasi() {
    if (stage === 0) { move(1); return; }
    if (stage === 1) { move(2); return; }
  }

  function renderNrs() {
    ensureCss();
    nrsValue = null;
    byId('overlay').classList.add('hub-da-modal', 'open');
    byId('mResult').className = 'score-result';
    byId('mResult').style.display = 'none';
    byId('mCalc').style.display = '';
    byId('mCalc').textContent = 'Interpretar NRS →';
    var f = root();
    f.innerHTML = '<div id="hub-da-ui" class="da-nrs"><h3 class="da-title">Pico do prurido nas últimas 24 horas</h3>' +
      '<p class="da-help">Qual foi a pior intensidade da coceira causada pela dermatite atópica nas últimas 24 horas? Selecione um número inteiro de 0 a 10.</p>' +
      '<div class="da-panel"><div class="da-nrs-ends"><span>0 · Nenhuma coceira</span><span>10 · Pior coceira imaginável</span></div>' +
      '<div class="da-nrs-grid">' + Array.from({ length: 11 }, function (_, n) {
        return '<button type="button" class="da-nrs-choice" data-nrs-choice="' + n + '" aria-label="' + n + ' de 10" aria-pressed="false">' + n + '</button>';
      }).join('') + '</div>' +
      '<div class="da-nrs-result" id="da-nrs-preview"><span>Selecione a intensidade</span></div>' +
      '<input id="da-nrs-range" type="range" min="0" max="10" step="1" value="0" aria-label="Intensidade máxima do prurido nas últimas 24 horas">' +
      '<div class="da-nrs-ends"><span>Sem prurido</span><span>Máximo imaginável</span></div></div>' +
      '<p class="da-alert" id="da-nrs-alert" role="alert"></p>' +
      '<div id="da-nrs-results"></div>' +
      '<p class="da-reference">Referências: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6850643/" target="_blank" rel="noopener noreferrer">Peak Pruritus NRS, validação clínica</a> · <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8359383/" target="_blank" rel="noopener noreferrer">Consenso HOME VII</a>. Não confundir NRS (escolha de número inteiro) com VAS (posição em escala contínua).</p></div>';
    f.addEventListener('click', function (e) {
      var b = e.target.closest('[data-nrs-choice],[data-nrs-restart]');
      if (!b) return;
      if (b.hasAttribute('data-nrs-restart')) { renderNrs(); return; }
      setNrs(Number(b.dataset.nrsChoice));
    });
    f.querySelector('#da-nrs-range').addEventListener('input', function (e) { setNrs(Number(e.target.value)); });
  }

  function setNrs(value) {
    if (!Number.isInteger(value) || value < 0 || value > 10) return;
    nrsValue = value;
    root().querySelectorAll('[data-nrs-choice]').forEach(function (b) {
      var on = Number(b.dataset.nrsChoice) === value;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    byId('da-nrs-range').value = value;
    byId('da-nrs-preview').innerHTML = '<strong>' + value + ' / 10</strong><span>Pior prurido nas últimas 24 horas</span>';
    byId('da-nrs-alert').textContent = '';
    byId('da-nrs-results').innerHTML = '';
  }

  function calcNrs() {
    if (nrsValue === null) {
      byId('da-nrs-alert').textContent = 'Escolha um valor de 0 a 10, inclusive se a resposta for zero.';
      return;
    }
    byId('da-nrs-results').innerHTML =
      '<div class="da-banner"><div><span>NRS · PRURIDO NA DERMATITE ATÓPICA</span><strong>' + nrsValue + ' / 10</strong><span>' +
      (nrsValue === 0 ? 'Nenhuma coceira no período' : 'Maior intensidade referida nas últimas 24 horas') +
      '</span></div></div>' +
      '<p class="da-note">A NRS é uma medida relatada pelo paciente e complementa a avaliação objetiva por EASI ou SCORAD. Em estudos clínicos de dermatite atópica, uma redução de pelo menos 4 pontos na escala de pico do prurido é frequentemente utilizada como resposta clinicamente relevante; a interpretação longitudinal depende do valor basal e do contexto.</p>' +
      '<button type="button" class="da-reset" data-nrs-restart="1">Nova avaliação NRS</button>';
    byId('mCalc').style.display = 'none';
  }

  window.hubDaScoreRender = function (key) {
    if (key === 'easi') { renderEasi(); return true; }
    if (key === 'nrsda') { renderNrs(); return true; }
    return false;
  };
  window.hubDaScoreCalc = function (key) {
    if (key === 'easi') { calcEasi(); return true; }
    if (key === 'nrsda') { calcNrs(); return true; }
    return false;
  };
  window.hubDaScoreReset = function () {
    state = null;
    nrsValue = null;
    stage = 0;
    var f = root();
    if (f) f.replaceChildren();
    byId('overlay').classList.remove('hub-da-modal');
    var calc = byId('mCalc');
    if (calc) calc.style.display = '';
  };
})();
