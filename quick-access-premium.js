/* Ilustrações SVG próprias dos atalhos do Hub. Sem fontes externas ou emojis. */
(function(){
  "use strict";
  var shapes={
    scores:'<rect x="14" y="7" width="36" height="50" rx="7" fill="url(#ink)" stroke="#315b6d" stroke-width="1.3"/><path d="M21 10h21" stroke="#76a3b4" stroke-width="1.1" opacity=".65"/><rect x="19" y="14" width="26" height="15" rx="3.5" fill="url(#paper)"/><path d="M22 25l6-5 5 3 7-7" fill="none" stroke="#179aad" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><g fill="#8ab5c1"><rect x="20" y="34" width="7" height="6" rx="1.8"/><rect x="29" y="34" width="7" height="6" rx="1.8"/><rect x="38" y="34" width="7" height="6" rx="1.8"/><rect x="20" y="43" width="7" height="6" rx="1.8"/><rect x="29" y="43" width="7" height="6" rx="1.8"/></g><rect x="38" y="43" width="7" height="6" rx="1.8" fill="url(#gold)"/>',
    artigos:'<path d="M16 12h26l7 8v31c0 2-2 4-4 4H17c-3 0-5-2-5-5V17c0-3 2-5 4-5z" fill="#c4dce4"/><path d="M21 8h23l7 8v31c0 3-2 5-5 5H21c-3 0-5-2-5-5V13c0-3 2-5 5-5z" fill="url(#paper)" stroke="#a5c0cc" stroke-width="1.4"/><path d="M44 8v9h7" fill="#e5eaf0" stroke="#a5c0cc" stroke-width="1.3"/><rect x="22" y="20" width="20" height="4" rx="2" fill="url(#ink)"/><path d="M22 31h21M22 36h18M22 41h21" stroke="#82a6b4" stroke-width="2.3" stroke-linecap="round"/><path d="M22 46h10" stroke="#caa75c" stroke-width="2.5" stroke-linecap="round"/>',
    guidelines:'<path d="M14 14c8-3 14-2 18 1 4-3 11-4 18-1v35c-8-2-14-2-18 2-4-4-11-4-18-2V14z" fill="url(#paper)" stroke="#537788" stroke-width="2" stroke-linejoin="round"/><path d="M32 16v35" stroke="#a7c6cb" stroke-width="2"/><path d="M20 24h7M20 30h7M20 36h7M37 36h7M37 42h7" stroke="#7d9eac" stroke-width="2.2" stroke-linecap="round"/><rect x="36" y="20" width="9" height="10" rx="2" fill="#d9ebe9"/><path d="M40.5 22v6M37.5 25h6" stroke="#18899c" stroke-width="1.8" stroke-linecap="round"/><path d="M24 47v9l4-3 4 3v-8" fill="url(#gold)" stroke="#b28a43" stroke-width="1"/>',
    eaaci:'<rect x="15" y="11" width="36" height="45" rx="6" fill="url(#ink)"/><rect x="19" y="15" width="28" height="37" rx="3" fill="url(#paper)"/><rect x="26" y="7" width="14" height="10" rx="3" fill="url(#steel)" stroke="#7a9baa" stroke-width="1.2"/><path d="M26 28l2 2 4-5M26 40l2 2 4-5" fill="none" stroke="#1d9aa8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 28h7M36 40h7" stroke="#7496a5" stroke-width="2.4" stroke-linecap="round"/><path d="M39 48l11-11 3 3-11 11-5 2z" fill="url(#gold)" stroke="#a9853a" stroke-width="1.1"/>',
    prompts:'<path d="M32 8l6.5 16.5L55 31l-16.5 6.5L32 54l-6.5-16.5L9 31l16.5-6.5z" fill="url(#gold)" stroke="#9b792f" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 16l4.3 11 11 4-11 4.3L32 46l-4.3-10.7L17 31l10.7-4z" fill="#fff3c5" opacity=".83"/><path d="M47 8l2 4.8L54 15l-5 2-2 5-2-5-5-2 5-2.2z" fill="url(#teal)"/><circle cx="15" cy="15" r="2.6" fill="#b1ced5"/>',
    educacao:'<path d="M7 24l25-12 25 12-25 12z" fill="url(#ink)" stroke="#153547" stroke-width="1.3" stroke-linejoin="round"/><path d="M18 31v10c8 8 20 8 28 0V31l-14 7z" fill="url(#teal)" stroke="#1b6d80" stroke-width="1.6"/><path d="M32 36l25-12v17" fill="none" stroke="#d1a84d" stroke-width="2.4" stroke-linejoin="round"/><circle cx="57" cy="44" r="3" fill="url(#gold)"/><path d="M55 46l-2 7h8l-2-7" fill="url(#gold)"/><path d="M20 43c7 6 17 6 24 0" stroke="#a8d3d9" stroke-width="1.8" fill="none"/>',
    imuno:'<g transform="rotate(-35 32 33)"><rect x="25" y="19" width="14" height="26" rx="4" fill="url(#paper)" stroke="#547b8b" stroke-width="1.6"/><rect x="27.5" y="26" width="9" height="15" rx="1.5" fill="url(#teal)" opacity=".86"/><path d="M32 8v11M26 12h12M28 45v6h8v-6M32 51v9" fill="none" stroke="#526d79" stroke-width="2.2" stroke-linecap="round"/><path d="M29 30h5M29 35h5" stroke="#eafafa" stroke-width="1.5"/></g><circle cx="48" cy="18" r="5" fill="url(#gold)" stroke="#c2953d" stroke-width=".8"/><circle cx="54" cy="28" r="2.5" fill="#4bb0b9"/><circle cx="12" cy="45" r="3.5" fill="#86c7d0"/>',
    interacao:'<g transform="rotate(-37 25 27)"><rect x="9" y="18" width="34" height="16" rx="8" fill="url(#paper)" stroke="#577f8c" stroke-width="1.6"/><path d="M26 18v16" stroke="#527e8d" stroke-width="1.6"/><path d="M17 18h9v16h-9a8 8 0 0 1 0-16z" fill="url(#teal)"/></g><g transform="rotate(39 42 39)"><rect x="28" y="31" width="30" height="15" rx="7.5" fill="url(#paper)" stroke="#a5843d" stroke-width="1.4"/><path d="M43 31v15" stroke="#b79b62" stroke-width="1.4"/><path d="M35.5 31H43v15h-7.5a7.5 7.5 0 0 1 0-15z" fill="url(#gold)"/></g><circle cx="31" cy="31" r="4.7" fill="#fff" stroke="#246b7a" stroke-width="2"/><path d="M31 29v4M29 31h4" stroke="#246b7a" stroke-width="1.3" stroke-linecap="round"/>',
    imunoglobulinas:'<path d="M23 10h18v7H23z" fill="url(#steel)" stroke="#668594" stroke-width="1.2"/><rect x="17" y="16" width="30" height="35" rx="7" fill="url(#paper)" stroke="#7599a5" stroke-width="1.7"/><path d="M21 34h22v9a5 5 0 0 1-5 5H26a5 5 0 0 1-5-5z" fill="url(#teal)" opacity=".8"/><rect x="23" y="22" width="18" height="9" rx="2.4" fill="#eef6f5"/><text x="32" y="29" text-anchor="middle" font-family="Arial,sans-serif" font-size="7.5" font-weight="700" fill="#2a677a">IgG</text><path d="M32 51v5h9" stroke="#567889" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M45 49c0 3-3 5-3 7a3 3 0 0 0 6 0c0-2-3-4-3-7z" fill="url(#gold)"/>',
    imunizacoes:'<path d="M32 7l21 8v16c0 14-9 22-21 27-12-5-21-13-21-27V15z" fill="url(#ink)" stroke="#21485d" stroke-width="1.4" stroke-linejoin="round"/><path d="M32 13l15 6v12c0 10-6 16-15 20-9-4-15-10-15-20V19z" fill="url(#teal)"/><path d="M23 32l6 6 13-14" stroke="#fff9e8" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 20l13-5 13 5" stroke="#90c8cc" stroke-width="1.2" fill="none" opacity=".55"/>',
    crm:'<rect x="9" y="15" width="46" height="36" rx="6" fill="url(#paper)" stroke="#789caa" stroke-width="1.5"/><rect x="9" y="15" width="46" height="8" rx="5" fill="url(#ink)"/><circle cx="23" cy="35" r="6" fill="#99c7d0"/><path d="M13 46c1-6 4-8 10-8 5 0 9 3 10 8" fill="#a7ccd2"/><path d="M37 31h12M37 36h8M37 41h11" stroke="#6d98aa" stroke-width="2" stroke-linecap="round"/><circle cx="48" cy="18" r="4" fill="url(#gold)"/><path d="M48 16v4M46 18h4" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>',
    laboratorio:'<path d="M25 7h14v6l-3 2v13l13 20c3 5 0 9-6 9H21c-6 0-9-4-6-9l13-20V15l-3-2V7z" fill="url(#paper)" stroke="#6b94a2" stroke-width="1.8" stroke-linejoin="round"/><path d="M22 43h20l6 9c1 1-.5 3-3 3H19c-2 0-3-2-2-3z" fill="url(#teal)"/><path d="M29 21h7M29 26h7" stroke="#aecad1" stroke-width="1.6" stroke-linecap="round"/><circle cx="31" cy="48" r="3" fill="#d9f9f5"/><circle cx="39" cy="50" r="2" fill="#e6fbf6"/><circle cx="20" cy="39" r="2" fill="url(#gold)"/>',
    instalar:'<rect x="18" y="6" width="28" height="51" rx="7" fill="url(#ink)" stroke="#2a5669" stroke-width="1.4"/><rect x="22" y="11" width="20" height="38" rx="2.5" fill="url(#paper)"/><path d="M32 19v19M25 31l7 7 7-7" stroke="#1499ab" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 44h10" stroke="#d1a84f" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="53" r="1.8" fill="#8eb2bd"/>',
    favoritos:'<path d="M32 7l7.4 15 16.6 2.4-12 11.8 2.9 16.5L32 45l-14.9 7.7L20 36.2 8 24.4 24.6 22z" fill="#b88b3f" opacity=".35" transform="translate(0 2.5)"/><path d="M32 7l7.4 15 16.6 2.4-12 11.8 2.9 16.5L32 45l-14.9 7.7L20 36.2 8 24.4 24.6 22z" fill="url(#gold)" stroke="#b78c3e" stroke-width="1.5" stroke-linejoin="round"/><path d="M32 13l5.5 11.6 13 2-9.3 9.1 2.2 12.4L32 42.2 20.6 48l2.2-12.4-9.3-9.1 13-2z" fill="#ffe8a5" opacity=".72"/><path d="M25 24l7-11 4 10" fill="none" stroke="#fff5d7" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>'
  };
  function svg(id,content){
    var p="hub-qa-"+id;
    var defs='<defs>'
    +'<linearGradient id="'+p+'-ink" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#356e85"/><stop offset=".55" stop-color="#19475f"/><stop offset="1" stop-color="#102d43"/></linearGradient>'
    +'<linearGradient id="'+p+'-teal" x1=".15" y1="0" x2=".9" y2="1"><stop stop-color="#9adce0"/><stop offset=".55" stop-color="#31a4b4"/><stop offset="1" stop-color="#16778e"/></linearGradient>'
    +'<linearGradient id="'+p+'-gold" x1=".1" y1="0" x2="1" y2="1"><stop stop-color="#fff3c6"/><stop offset=".48" stop-color="#eac86b"/><stop offset="1" stop-color="#bc8d38"/></linearGradient>'
    +'<linearGradient id="'+p+'-paper" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#ffffff"/><stop offset=".65" stop-color="#f6fafc"/><stop offset="1" stop-color="#dcebf0"/></linearGradient>'
    +'<linearGradient id="'+p+'-steel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7fbfc"/><stop offset=".55" stop-color="#a7c2cd"/><stop offset="1" stop-color="#6a8e9c"/></linearGradient>'
    +'<filter id="'+p+'-shadow" x="-35%" y="-35%" width="175%" height="175%"><feDropShadow dx="0" dy="2" stdDeviation="1.4" flood-color="#17394e" flood-opacity=".17"/></filter>'
    +'</defs>';
    content=content.replace(/url\(#(ink|teal|gold|paper|steel)\)/g,function(_,name){return 'url(#'+p+'-'+name+')';});
    return '<svg class="q-illustration" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+defs+'<g filter="url(#'+p+'-shadow)">'+content+'</g></svg>';
  }
  function enhance(){
    var items=document.querySelectorAll('#page-dashboard .quick-grid .qcard');
    Array.prototype.forEach.call(items,function(card){
      var key=card.getAttribute('data-nav') || (card.id==='hubInstallBtn'?'instalar':card.hasAttribute('href')?'crm':'');
      if(!shapes[key])return;
      var el=card.querySelector('.qi');
      if(el && !el.querySelector('svg')){el.innerHTML=svg(key,shapes[key]);el.setAttribute('aria-hidden','true');}
      if(card.tagName==='DIV' && card.hasAttribute('data-nav') && !card.hasAttribute('tabindex')){
        card.setAttribute('role','button');
        card.setAttribute('tabindex','0');
        card.setAttribute('aria-label',(card.querySelector('.ql')||{}).textContent||key);
        card.addEventListener('keydown',function(e){
          if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}
        });
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});
  else enhance();
})();


/* HUB PREMIUM 2026-11-09 — fichas vacinais sem deslocamento e icones vetoriais */
(function(){
  'use strict';
  var lastFocus=null, overlay=null;
  var artwork={
    syringe:'<path d="M14 39l-4 9 9-4M21 39l22-22M38 11l15 15M43 7l14 14" stroke="#214d62" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M20 36l18-18 9 9-18 18z" fill="#8ecbd3" stroke="#226d7d" stroke-width="1.7"/><path d="M25 32l4 4M29 28l4 4M33 24l4 4" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><circle cx="49" cy="13" r="4" fill="#dbbc6f"/>',
    helix:'<path d="M23 11c23 8-5 24 18 42M41 11c-23 8 5 24-18 42" fill="none" stroke="#1b7184" stroke-width="3.4" stroke-linecap="round"/><path d="M26 17h12M24 25h16M24 33h16M26 41h12M29 49h6" stroke="#d5ab56" stroke-width="2.6" stroke-linecap="round"/><circle cx="23" cy="11" r="3" fill="#256a7f"/><circle cx="41" cy="11" r="3" fill="#d6ad5d"/>',
    shield:'<path d="M32 7l21 8v17c0 12-8 20-21 26-13-6-21-14-21-26V15z" fill="#d8edf0" stroke="#20586b" stroke-width="2.3" stroke-linejoin="round"/><path d="M32 16l12 5v11c0 7-4 12-12 17-8-5-12-10-12-17V21z" fill="#86c6cf"/><path d="M32 25v15M24.5 32.5h15" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>',
    molecule:'<g fill="none" stroke="#286d80" stroke-width="3" stroke-linecap="round"><path d="M22 22l18 6M22 22l2 21M40 28l-16 15M40 28l10 14"/></g><circle cx="22" cy="22" r="8" fill="#d7ecf0" stroke="#2b7185" stroke-width="2"/><circle cx="40" cy="28" r="7.5" fill="#91cad1" stroke="#2b7185" stroke-width="2"/><circle cx="24" cy="43" r="7" fill="#e8c780" stroke="#b58b41" stroke-width="2"/><circle cx="50" cy="42" r="5" fill="#d7ecf0" stroke="#2b7185" stroke-width="2"/>',
    medicine:'<g transform="rotate(-38 32 32)"><rect x="12" y="22" width="40" height="20" rx="10" fill="#e5f2f5" stroke="#246378" stroke-width="2.3"/><path d="M32 22v20" stroke="#246378" stroke-width="2.3"/><path d="M22 22h10v20H22a10 10 0 010-20z" fill="#8ac8d1"/></g><circle cx="49" cy="16" r="4" fill="#d8b366"/>',
    lungs:'<path d="M31 11v17M33 11v17M31 23c-9-1-12-11-16-7C10 22 9 39 11 47c2 8 15 8 18-2l2-16M33 23c9-1 12-11 16-7 5 6 6 23 4 31-2 8-15 8-18-2l-2-16" fill="#d8ecf0" stroke="#206179" stroke-width="2.6" stroke-linejoin="round"/><path d="M20 30l9 9M44 30l-9 9" stroke="#c69d4d" stroke-width="2" stroke-linecap="round"/>',
    skin:'<rect x="12" y="16" width="40" height="32" rx="11" fill="#e5f1f1" stroke="#2b7082" stroke-width="2.3"/><path d="M19 27c6-9 12 9 18 0s12 4 12 4M18 40c7-7 12 8 20 0s11 2 11 2" fill="none" stroke="#c39d54" stroke-width="2.7" stroke-linecap="round"/>',
    book:'<path d="M10 17c9-3 16-2 22 2 6-4 13-5 22-2v34c-8-3-16-2-22 2-6-4-14-5-22-2z" fill="#e2f0f3" stroke="#256276" stroke-width="2.3" stroke-linejoin="round"/><path d="M32 20v33M16 27h10M16 34h10M38 27h10M38 34h10" stroke="#5d9eae" stroke-width="2" stroke-linecap="round"/><path d="M24 13v12" stroke="#c69d4d" stroke-width="3" stroke-linecap="round"/>',
    alert:'<path d="M32 8L58 53H6z" fill="#e9f2f2" stroke="#28677a" stroke-width="2.4" stroke-linejoin="round"/><path d="M32 25v14" stroke="#b68a3e" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="46" r="2.5" fill="#b68a3e"/>',
    food:'<circle cx="32" cy="34" r="20" fill="#e5f2f3" stroke="#286d80" stroke-width="2.5"/><circle cx="32" cy="34" r="12" fill="none" stroke="#aacfd7" stroke-width="2"/><path d="M15 10v17M11 12v11M19 12v11M49 10v44" stroke="#bd994f" stroke-width="2.4" stroke-linecap="round"/>'
  };
  function pictogram(kind) {
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+(artwork[kind]||artwork.shield)+'</svg>';
  }
  function kindForVaccine(card) {
    var label=((card.querySelector('.vac-name')||{}).textContent||'').toLowerCase();
    var all=(window.VAC_CATALOGO||[]);
    var item=all.find(function(v){return v.nome.toLowerCase()===label;});
    var tipo=item?(item.tipo||'').toLowerCase():'';
    if(tipo.indexOf('monoclonal')>=0)return 'shield';
    if(tipo.indexOf('atenuad')>=0)return 'helix';
    if(tipo.indexOf('conjugad')>=0 || tipo.indexOf('recombinant')>=0 || tipo.indexOf('subunidade')>=0)return 'molecule';
    if(label.indexOf('pneumoc')>=0 || label.indexOf('meningoc')>=0)return 'molecule';
    return 'syringe';
  }
  function decorateVaccineCards(){
    var grid=document.getElementById('vacListaAll');if(!grid)return;
    grid.querySelectorAll('.vac-card').forEach(function(card){
      var ico=card.querySelector('.vac-icon');
      if(ico && !ico.querySelector('svg'))ico.innerHTML=pictogram(kindForVaccine(card));
      var summary=card.querySelector('.vac-header');
      if(summary){summary.setAttribute('aria-haspopup','dialog');summary.setAttribute('aria-label','Abrir informações: '+(card.querySelector('.vac-name')||{}).textContent);}
    });
  }
  function initOverlay(){
    if(overlay)return overlay;
    overlay=document.createElement('div');
    overlay.id='vacPremiumBackdrop';
    overlay.className='vac-premium-backdrop';
    overlay.hidden=true;
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML='<section class="vac-premium-sheet" role="dialog" aria-modal="true" aria-labelledby="vacPremiumTitle" tabindex="-1">'
      +'<div class="vac-premium-sheet-head"><div class="vac-premium-sheet-heading">'
      +'<div class="vac-premium-sheet-kicker">Vacinas disponíveis no Brasil</div>'
      +'<h2 class="vac-premium-sheet-title" id="vacPremiumTitle"></h2>'
      +'<div class="vac-premium-sheet-sub" id="vacPremiumSub"></div></div>'
      +'<button type="button" class="vac-premium-close" aria-label="Fechar informações da vacina">×</button></div>'
      +'<div class="vac-premium-scroll" id="vacPremiumContent"></div></section>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click',function(e){
      if(e.target===overlay || e.target.closest('.vac-premium-close'))closeFicha();
    });
    return overlay;
  }
  function openFicha(card){
    var body=card&&card.querySelector('.vac-body');if(!body)return;
    var backdrop=initOverlay();
    lastFocus=card.querySelector('.vac-header')||document.activeElement;
    backdrop.querySelector('#vacPremiumTitle').textContent=(card.querySelector('.vac-name')||{}).textContent||'Vacina';
    backdrop.querySelector('#vacPremiumSub').textContent=(card.querySelector('.vac-protection')||{}).textContent||'';
    backdrop.querySelector('#vacPremiumContent').innerHTML=body.outerHTML;
    backdrop.querySelector('.vac-premium-scroll').scrollTop=0;
    backdrop.hidden=false;
    backdrop.setAttribute('aria-hidden','false');
    backdrop.querySelector('.vac-premium-close').focus();
  }
  function closeFicha(){
    if(!overlay || overlay.hidden)return;
    overlay.hidden=true;overlay.setAttribute('aria-hidden','true');
    overlay.querySelector('#vacPremiumContent').innerHTML='';
    if(lastFocus && lastFocus.isConnected && lastFocus.getClientRects().length)lastFocus.focus({preventScroll:true});
    lastFocus=null;
  }
  function setupVaccines(){
    var grid=document.getElementById('vacListaAll');if(!grid || grid.dataset.premiumBound==='1')return;
    grid.dataset.premiumBound='1';
    grid.addEventListener('click',function(event){
      var summary=event.target.closest('summary.vac-header');
      if(!summary || !grid.contains(summary))return;
      event.preventDefault();event.stopPropagation();
      openFicha(summary.closest('.vac-card'));
    });
    document.addEventListener('keydown',function(e){
      if(!overlay || overlay.hidden)return;
      if(e.key==='Escape'){e.preventDefault();closeFicha();return;}
      if(e.key!=='Tab')return;
      var focusables=Array.from(overlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
        .filter(function(node){return !node.hasAttribute('disabled') && node.getClientRects().length;});
      if(!focusables.length)return;
      var first=focusables[0],last=focusables[focusables.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    });
    if(typeof window.vacRenderVacinas==='function' && !window.vacRenderVacinas._premiumBound){
      var prior=window.vacRenderVacinas;
      var extended=function(){
        closeFicha();
        var result=prior.apply(this,arguments);
        decorateVaccineCards();
        return result;
      };
      extended._premiumBound=true;
      window.vacRenderVacinas=extended;
    }
    decorateVaccineCards();
    if(typeof MutationObserver==='function'){
      new MutationObserver(function(){decorateVaccineCards();})
        .observe(grid,{childList:true});
    }
  }
  function decorateProtocolIcons(){
    var kinds={anafilaxia:'alert',urticaria:'skin',it:'shield',aa:'food',da:'skin',asma:'lungs',medicam:'medicine',diag:'molecule',eoe:'medicine'};
    document.querySelectorAll('#page-eaaci .eaaci-grid .qcard').forEach(function(card){
      var ico=card.querySelector('.qi');
      if(ico && !ico.querySelector('svg')){
        ico.innerHTML=pictogram(kinds[card.dataset.etopic]||'book');
        ico.setAttribute('aria-hidden','true');
      }
    });
  }
  function decorateVaccinationMenu(){
    var menu=document.getElementById('vac-menu-hub');if(!menu)return;
    menu.querySelectorAll('button').forEach(function(btn){
      var el=btn.firstElementChild;
      if(!el || el.tagName!=='SPAN' || el.querySelector('svg'))return;
      var t=btn.textContent.toLowerCase();
      var k=t.indexOf('calendários')>=0?'book':t.indexOf('pni')>=0?'shield':'syringe';
      el.innerHTML=pictogram(k);
      el.classList.add('hub-premium-section-icon');
      el.setAttribute('aria-hidden','true');
    });
  }
  function start(){
    setupVaccines();
    decorateProtocolIcons();
    decorateVaccinationMenu();
    document.addEventListener('click',function(e){
      if(e.target.closest('[data-nav="imunizacoes"]'))decorateVaccinationMenu();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
