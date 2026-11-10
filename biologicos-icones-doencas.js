/* Ilustracoes clinicas dos biologicos - icones locais SVG. */
(function installDiseaseIcons(){
  "use strict";
  var count=0;
  function getIcon(kind){
    var id="bioclin"+(++count);
    var skins='fill="url(#'+id+'skin)" stroke="#bc8c77" stroke-width="1.4"';
    var lungs='<path d="M30 11v17m4-17v17" stroke="#98788a" stroke-width="5" stroke-linecap="round"/><path d="M29 26C22 15 18 17 14 23S8 42 11 48c3 9 16 10 18 1 2-7 2-17 0-23Z" fill="url(#'+id+'organ)" stroke="#a85d72" stroke-width="1.4"/><path d="M35 26c7-11 11-9 15-3s6 19 3 25c-3 9-16 10-18 1-2-7-2-17 0-23Z" fill="url(#'+id+'organ)" stroke="#a85d72" stroke-width="1.4"/><path d="m32 27-10 9m10-9 10 9m-20 0-3 10m23-10 3 10" stroke="#9d526c" fill="none" stroke-width="2.7" stroke-linecap="round"/>';
    var face='<path d="M22 12C12 16 10 29 12 40s10 15 21 15c13 0 20-10 20-21 1-14-10-23-21-24-4 0-8 0-10 2Z" fill="url(#'+id+'face)" stroke="#be907e" stroke-width="1.4"/><path d="M29 22c-3 10-4 12-8 17 6 5 12 2 15-2" stroke="#b78374" fill="#edb79f" stroke-width="1.4"/><path d="M36 20q10-3 13 5l-3 6q-7-1-11-5Z" fill="#a7c7d8" stroke="#608ca3" stroke-width="1.4"/><path d="M36 35q7-4 11 1l-2 8-10-2Z" fill="#c3848d" stroke="#a05c67"/>';
    var lesion='<path d="M9 24q12-6 24 0t22 0v26q-12 7-23 2t-23 0Z" '+skins+'/><path d="M9 27q12-5 23 0t23 0" fill="none" stroke="#e7b19a" stroke-width="4"/>';
    var drawing={
      dermatitis:lesion+'<path d="m11 24 8-5 6 5 5-1 3 7-5 5-9-4-7 3Z" fill="#d46f75" stroke="#a84c5a" stroke-width="1.3"/><path d="m16 23 4 4 4-5m-5 9 8-3" fill="none" stroke="#fff1de" stroke-width="1.5"/><path d="m18 43 5 2m10-4 5 3" stroke="#c2846c" stroke-width="1.5"/>',
      asthma:lungs,
      copd:lungs+'<g fill="#eaf6f7" stroke="#82afbc" stroke-width="1"><circle cx="18" cy="41" r="4.3"/><circle cx="25" cy="46" r="3"/><circle cx="46" cy="43" r="4.6"/><circle cx="39" cy="48" r="2.9"/></g>',
      sinus:face+'<ellipse cx="41" cy="38" rx="3.5" ry="4.5" fill="#f2b4b9"/><path d="M33 30q-5 1-8 7" stroke="#ffebd2" fill="none" stroke-width="1.8"/>',
      fungal:face+'<g fill="#675b83"><circle cx="40" cy="23" r="2.6"/><circle cx="46" cy="26" r="1.8"/><circle cx="40" cy="38" r="2.3"/><circle cx="44" cy="41" r="1.5"/></g><path d="m40 23-2-4m2 4 3-4m-3 19-3-2" stroke="#625b81" stroke-width="1.3"/>',
      esophagus:'<path d="M25 13q7-5 14 0l-1 10 3 10-2 18q-7 7-14 0l-2-18 3-10Z" fill="#f2d6c7" stroke="#bf917f" stroke-width="1.5"/><path d="M29 12c-3 8 0 15-1 21s-1 13 0 19m7-40c3 8 0 15 1 21s1 13 0 19" stroke="#d58a91" stroke-width="5" fill="none"/><path d="M32 13v39" stroke="#a04764" stroke-width="3"/><path d="M27 29q5 4 10 0m-10 8q5 4 10 0m-10 8q5 4 10 0" stroke="#c85068" stroke-width="2" fill="none"/>',
      prurigo:lesion+'<g fill="#b76672" stroke="#8c495a" stroke-width="1.2"><ellipse cx="18" cy="29" rx="5" ry="4"/><ellipse cx="36" cy="33" rx="5.2" ry="4.6"/><ellipse cx="47" cy="28" rx="3.5" ry="3"/></g><g fill="#f4c1b1"><ellipse cx="18" cy="27" rx="2.6" ry="1.1"/><ellipse cx="36" cy="31" rx="2.7" ry="1.1"/></g>',
      urticaria:lesion+'<g fill="#ea8b94" stroke="#b45d6b" stroke-width="1.2"><ellipse cx="18" cy="31" rx="7" ry="4.5"/><ellipse cx="38" cy="30" rx="8" ry="5"/><ellipse cx="27" cy="42" rx="9" ry="5"/><ellipse cx="47" cy="42" rx="5" ry="4"/></g><g fill="#ffded0"><ellipse cx="18" cy="30" rx="4.8" ry="2.3"/><ellipse cx="38" cy="29" rx="5.5" ry="2.4"/><ellipse cx="27" cy="41" rx="6" ry="2.4"/></g>',
      blister:lesion+'<path d="M11 26c2-12 11-14 17-8 3 3 5 6 5 9" fill="url(#'+id+'fluid)" stroke="#b48383" stroke-width="1.4"/><path d="M35 26q2-11 10-9 8 2 9 10" fill="url(#'+id+'fluid)" stroke="#b48383" stroke-width="1.4"/><path d="M16 22q4-5 9-2m15 1q3-2 6 1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>',
      food:'<ellipse cx="32" cy="43" rx="23" ry="10" fill="#e6eef3" stroke="#819db0" stroke-width="1.8"/><ellipse cx="32" cy="41" rx="17" ry="6.5" fill="#fff" stroke="#b5cbd8"/><path d="M22 19c-8 3-7 14 0 17 7 3 13-6 10-12-2-4-5-6-10-5Zm15 0c-9 3-9 13-3 17s14-3 13-10c0-5-5-9-10-7Z" fill="#dba77a" stroke="#a16d48" stroke-width="1.4"/><path d="m26 21-5 12m19-11-6 11" stroke="#a47753" stroke-width="1.7"/><g fill="#b9677b"><circle cx="47" cy="16" r="3.5"/><circle cx="52" cy="24" r="2"/><circle cx="48" cy="30" r="1.7"/></g>',
      egpa:'<path d="M7 25q13-9 25 1t25-1v18q-12 9-25-1T7 43Z" fill="#d28092" stroke="#a85b71" stroke-width="1.6"/><circle cx="24" cy="35" r="10" fill="#f1e1ec" stroke="#ae85a1" stroke-width="1.3"/><path d="M19 32q3-5 7-2 4 1 2 5 4 4-1 7-7 1-8-4Z" fill="#83588a"/><ellipse cx="44" cy="37" rx="7" ry="4.5" fill="#efb9bc"/><path d="M9 30q10-6 16 0" stroke="#ffdce0" stroke-width="1.7" fill="none"/>',
      eosinophil:'<path d="M32 8C23 22 13 33 13 43a19 19 0 0 0 38 0C51 33 41 22 32 8Z" fill="url(#'+id+'blood)" stroke="#af647b" stroke-width="1.5"/><circle cx="32" cy="40" r="12" fill="#f5e7e9" stroke="#a984a3"/><path d="M27 40q-3-8 3-9 6-1 4 6 6-1 6 5-4 6-9 1Z" fill="#82588b"/><g fill="#df988b"><circle cx="25" cy="35" r="1.4"/><circle cx="39" cy="36" r="1.3"/><circle cx="26" cy="46" r="1.2"/><circle cx="38" cy="46" r="1.4"/></g>',
      mast:'<circle cx="32" cy="32" r="21" fill="#dfc3df" stroke="#a782ae" stroke-width="1.8"/><circle cx="32" cy="32" r="9" fill="#ad7bb5" stroke="#784d8b" stroke-width="1.7"/><g fill="#856198"><circle cx="18" cy="28" r="3"/><circle cx="25" cy="19" r="2.6"/><circle cx="38" cy="20" r="2.8"/><circle cx="46" cy="28" r="2.5"/><circle cx="44" cy="40" r="3"/><circle cx="33" cy="47" r="2.4"/><circle cx="21" cy="42" r="3"/></g>',
      angioedema:'<path d="M11 30q14-13 21-5 8-8 21 5-8 8-21 8t-21-8Z" fill="url(#'+id+'lip)" stroke="#ad657d" stroke-width="1.5"/><path d="M11 35q9 12 21 13 13-1 21-13-11 5-21 4-10 1-21-4Z" fill="#d2879e" stroke="#ad657d" stroke-width="1.5"/><path d="M12 35q10 5 20 4 11 1 20-4" stroke="#8f546b" stroke-width="1.9" fill="none"/><path d="M18 28q5-4 11-2m7 0q6-2 10 2" stroke="#ffe0e2" stroke-width="2" fill="none" stroke-linecap="round"/>'
    };
    var defs='<defs><radialGradient id="'+id+'bg" cx="35%" cy="25%" r="90%"><stop stop-color="#fff"/><stop offset="1" stop-color="#e7f0f5"/></radialGradient><linearGradient id="'+id+'organ" x2="1" y2="1"><stop stop-color="#f6c1bb"/><stop offset=".55" stop-color="#d98997"/><stop offset="1" stop-color="#b65a78"/></linearGradient><linearGradient id="'+id+'skin" x2="0" y2="1"><stop stop-color="#f9d7c2"/><stop offset="1" stop-color="#e7a68e"/></linearGradient><linearGradient id="'+id+'face" x2="1" y2="1"><stop stop-color="#fce2ce"/><stop offset="1" stop-color="#e8ad97"/></linearGradient><linearGradient id="'+id+'fluid" x2="0" y2="1"><stop stop-color="#fffcf0"/><stop offset="1" stop-color="#f4cfc3"/></linearGradient><linearGradient id="'+id+'blood" x2="1" y2="1"><stop stop-color="#f2b7c5"/><stop offset="1" stop-color="#cc7d93"/></linearGradient><linearGradient id="'+id+'lip" x2="0" y2="1"><stop stop-color="#f9c8cf"/><stop offset="1" stop-color="#cf8299"/></linearGradient></defs>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">'+defs+'<circle cx="32" cy="32" r="30" fill="url(#'+id+'bg)" stroke="#d5e1e8" stroke-width="1"/><ellipse cx="32" cy="56" rx="18" ry="2" fill="#a9b9c3" opacity=".16"/>'+(drawing[kind]||drawing.dermatitis)+'</svg>';
  }
  function classify(text) {
    var t=(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(t.indexOf('rinossinusite fungica')>=0)return 'fungal';
    if(/rsc|rinossinusite|polipos nasais/.test(t))return 'sinus';
    if(/dpoc|doenca pulmonar obstrutiva/.test(t))return 'copd';
    if(t.indexOf('asma')>=0)return 'asthma';
    if(t.indexOf('esofagite')>=0)return 'esophagus';
    if(t.indexOf('prurigo')>=0)return 'prurigo';
    if(t.indexOf('urticaria')>=0)return 'urticaria';
    if(t.indexOf('penfigoide')>=0)return 'blister';
    if(/dermatite|eczema/.test(t))return 'dermatitis';
    if(t.indexOf('alergia alimentar')>=0)return 'food';
    if(/egpa|granulomatose eosinofilica/.test(t))return 'egpa';
    if(/sindrome hipereosinofilica|she\b/.test(t))return 'eosinophil';
    if(t.indexOf('mastocitose')>=0)return 'mast';
    if(/aeh|angioedema hereditario/.test(t))return 'angioedema';
    return 'dermatitis';
  }
  function addCss(){
    if(document.getElementById('bioclinical-icon-css'))return;
    var style=document.createElement('style');
    style.id='bioclinical-icon-css';
    style.textContent='.bio-doenca-titulo{display:flex!important;align-items:center!important;gap:10px!important;line-height:1.3!important;font-size:clamp(14px,.94rem,17px)!important;min-width:0!important;margin-bottom:9px!important}' +
      '.bio-doenca-icone{width:46px;height:46px;flex:0 0 46px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;box-shadow:0 2px 8px rgba(25,55,75,.09)}' +
      '.bio-doenca-icone svg{display:block;width:100%;height:100%}' +
      '.bio-doenca-titulo-texto{min-width:0;flex:1;overflow-wrap:break-word}' +
      '.bio-doenca-titulo-texto .bio-new{display:inline-block;margin-left:5px;white-space:nowrap}' +
      '@media(max-width:540px){.bio-doenca-titulo{font-size:14px!important;gap:9px!important}.bio-doenca-icone{width:40px;height:40px;flex-basis:40px}}';
    document.head.appendChild(style);
  }
  function update(){
    document.querySelectorAll('.bio-section').forEach(function(section){
      var label=section.querySelector(':scope > .bio-label');
      if(!label||label.textContent.trim().toLowerCase()!=='posologia e dose por doença')return;
      var content=section.querySelector(':scope > .bio-value');
      if(!content)return;
      content.querySelectorAll('div[style*="font-weight:800"][style*="font-size:12.5px"]').forEach(function(heading){
        if(heading.classList.contains('bio-doenca-titulo'))return;
        var name=heading.textContent.trim();
        if(!name)return;
        var icon=document.createElement('span');
        icon.className='bio-doenca-icone';
        icon.setAttribute('aria-hidden','true');
        icon.innerHTML=getIcon(classify(name));
        var text=document.createElement('span');
        text.className='bio-doenca-titulo-texto';
        while(heading.firstChild)text.appendChild(heading.firstChild);
        heading.classList.add('bio-doenca-titulo');
        heading.appendChild(icon);
        heading.appendChild(text);
      });
    });
  }
  function start(){
    addCss();update();
    var root=document.getElementById('page-biologicos')||document.body;
    var pending=false;
    var observer=new MutationObserver(function(mutations){
      if(pending)return;
      for(var i=0;i<mutations.length;i++){
        if(mutations[i].addedNodes.length){
          pending=true;
          requestAnimationFrame(function(){pending=false;update();});
          break;
        }
      }
    });
    observer.observe(root,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
