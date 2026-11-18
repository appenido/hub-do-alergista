/* Títulos científicos em português brasileiro, em todas as telas e idiomas.
   Preserva PMID/DOI, links e o título original nos dados da referência. */
(function(){
  'use strict';
  var KEY='hub_titulos_pt_v2';
  var translations=Object.create(null);
  var pending=new Set();
  var failed=new Map();
  var processing=false;
  var scheduled=false;
  var observer;
  var alreadyScanned=new WeakMap();
  var TITLE_SELECTOR='.art-card .art-title-pt, .art-card:not(:has(.art-title-pt)) .art-title, #page-guidelines .guide-card .gc-name, #heroInteresses > div > div:nth-child(2)';
  try{
    var data=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(data&&typeof data==='object'&&!Array.isArray(data))translations=data;
  }catch(_){}
  // Recupera traduções já feitas pela versão anterior.
  var previous=Object.create(null);
  try{
    var legacy=JSON.parse(localStorage.getItem('hub_trad_titulos')||'{}');
    previous=legacy?legacy._data||legacy:{};
  }catch(_){}
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
  function looksPortuguese(s){
    var t=clean(s).toLowerCase();
    if(!t)return false;
    var pt=(t.match(/\b(?:de|do|da|dos|das|para|com|em|por|sobre|uma|um|entre|após|tratamento|diagnóstico|diretriz|recomendações|ensaio|estudo|alérgica|grave|terapia|resumo|atualização|eficácia|segurança|manejo|rinite|urticária|asma|esofagite)\b/g)||[]).length;
    var en=/\b(?:the|with|of|for|after|among|study|trial|guideline|guidelines|randomized|clinical|management|diagnosis|treatment|patients|recommendations|efficacy|safety|outcomes|review)\b/.test(t);
    return (pt>=2&&!en)||(pt>=1&&!en&&/[ãõçáéíóú]/.test(t));
  }
  function onlyTitle(el){
    if(el.matches('#heroInteresses > div > div:nth-child(2)')){
      var parent=el.parentElement;
      if(!parent||parent.children.length<3||/Buscando o mais recente|Carregando/.test(el.textContent))return false;
    }
    return true;
  }
  function findSource(el){
    return clean(el.getAttribute('data-hub-original-title')||
      el.getAttribute('data-original')||
      (el.classList.contains('art-title')&&el.closest('.art-card')?.getAttribute('data-ai-title'))||
      el.textContent);
  }
  function candidates(root){
    if(!root || !root.querySelectorAll)return [];
    var out=[];
    if(root.nodeType===1&&root.matches?.(TITLE_SELECTOR))out.push(root);
    root.querySelectorAll(TITLE_SELECTOR).forEach(function(node){out.push(node);});
    return out;
  }
  function cachePut(source,pt){
    translations[source]=pt;
    var keys=Object.keys(translations);
    if(keys.length>1000)keys.slice(0,keys.length-900).forEach(function(k){delete translations[k];});
    try{localStorage.setItem(KEY,JSON.stringify(translations));}catch(_){}
  }
  function update(el,pt){
    if(!el.isConnected)return;
    if(clean(el.textContent)!==pt)el.textContent=pt;
    el.dataset.hubTitleStatus='translated';
    var card=el.closest('.guide-card,.art-card');
    if(card?.classList.contains('guide-card')){
      card.dataset.favTitulo=pt;
    }
  }
  function renderWaiting(el){
    var original=el.getAttribute('data-hub-original-title');
    if(!original)return;
    var known=translations[original]||previous[original];
    if(known&&looksPortuguese(known)){
      cachePut(original,known);
      update(el,known);
      return;
    }
    if(looksPortuguese(original)){
      update(el,original);
      return;
    }
    var lastFail=failed.get(original);
    if(lastFail && Date.now()-lastFail<120000){
      if(el.dataset.hubTitleStatus!=='translated')el.textContent='Título em português temporariamente indisponível';
      el.dataset.hubTitleStatus='unavailable';
      return;
    }
    if(el.dataset.hubTitleStatus!=='translated')el.textContent='Traduzindo título para português…';
    el.dataset.hubTitleStatus='pending';
    pending.add(original);
    queue();
  }
  function inspect(el){
    if(!el.isConnected||!onlyTitle(el))return;
    var staticGuide=!!el.closest('#guidelines-list');
    var staticArticle=el.classList.contains('art-title-pt')&&!el.hasAttribute('data-original')&&!el.closest('#feedResults,#homeArtigos');
    if(staticGuide||staticArticle){
      el.setAttribute('data-hub-i18n-skip','');
      el.dataset.hubTitleStatus='translated';
      return;
    }
    var source=findSource(el);
    if(!source)return;
    el.setAttribute('data-hub-i18n-skip','');
    // O original permite identificar, pesquisar e abrir a publicação sem
    // trocar o título utilizado nos bancos bibliográficos.
    if(!el.hasAttribute('data-hub-original-title'))el.setAttribute('data-hub-original-title',source);
    var item=alreadyScanned.get(el);
    if(item===source && el.dataset.hubTitleStatus==='translated' &&
       clean(el.textContent)===(translations[source]||source))return;
    alreadyScanned.set(el,source);
    renderWaiting(el);
  }
  function scan(root){
    candidates(root||document).forEach(inspect);
  }
  function queue(){
    if(processing||scheduled||!pending.size)return;
    scheduled=true;
    setTimeout(function(){scheduled=false;flush();},110);
  }
  async function flush(){
    if(processing)return;
    processing=true;
    try{
      while(pending.size){
        var titles=[];
        var size=0;
        for(var item of pending){
          if(titles.length>=8||size+item.length>3400)break;
          titles.push(item);
          size+=item.length;
          pending.delete(item);
        }
        if(!titles.length){
          pending.delete(pending.values().next().value);
          continue;
        }
        var answers=null;
        try{
          var abort=typeof AbortController!=='undefined'?new AbortController():null;
          var timer=abort?setTimeout(function(){abort.abort();},28000):null;
          try{
            var r=await fetch('/api/titulos-pt',{
              method:'POST',credentials:'same-origin',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({titles:titles}),
              signal:abort?abort.signal:undefined
            });
            if(!r.ok)throw new Error('Tradutor indisponível');
            var data=await r.json();
            if(!Array.isArray(data.titles)||data.titles.length!==titles.length)throw new Error('Resposta inválida');
            answers=data.titles;
          }finally{if(timer)clearTimeout(timer);}
        }catch(_){}
        for(var i=0;i<titles.length;i++){
          var source=titles[i];
          var translated=answers&&typeof answers[i]==='string'?clean(answers[i]):'';
          if(translated&&looksPortuguese(translated)){
            cachePut(source,translated);
          }else{
            failed.set(source,Date.now());
          }
        }
        document.querySelectorAll('[data-hub-original-title]').forEach(function(el){
          if(!el.matches(TITLE_SELECTOR))return;
          var source=el.getAttribute('data-hub-original-title');
          if(titles.indexOf(source)<0)return;
          if(translations[source])update(el,translations[source]);
          else renderWaiting(el);
        });
      }
    }finally{processing=false;if(pending.size)queue();}
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(function(){
      scheduled=false;
      scan(document);
      if(pending.size)queue();
    });
  }
  function init(){
    // Evita a chamada antiga, separada, que podia deixar título inglês
    // visível ou substituir incorretamente a tradução pela versão original.
    window._traduzirTitulosFeed=function(box){
      scan(box||document);
      return Promise.resolve();
    };
    scan(document);
    observer=new MutationObserver(function(records){
      var relevant=records.some(function(r){
        if(r.type==='childList')return r.addedNodes.length>0||r.removedNodes.length>0;
        if(r.type==='characterData')return !!r.target.parentElement?.closest('.art-card,.guide-card,#heroInteresses');
        return r.type==='attributes'&&r.attributeName==='class';
      });
      if(relevant)schedule();
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('hub:languagechange',schedule);
    window.addEventListener('online',function(){failed.clear();schedule();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
