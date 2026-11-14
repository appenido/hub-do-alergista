/* Hub do Alergista — busca temática de artigos, consulta PubMed verificável. */
(function(){
  'use strict';
  var TOPICS=[
    ['todos','Todos'],['asma','Asma'],['da','Dermatite atópica'],['dc','Dermatite de contato'],
    ['urticaria','Urticária'],['angioedema','Angioedema'],['anafilaxia','Anafilaxia'],
    ['himen','Himenópteros'],['rinite','Rinite'],['rsc','Rinossinusite'],
    ['aa','Alergia alimentar'],['eii','Erros inatos'],['medicam','Medicamentos'],
    ['masto','Mastocitose'],['eoe','Esofagite eosinofílica'],['vacinas','Vacinação']
  ];
  var topicNames=Object.create(null);
  TOPICS.forEach(function(t){topicNames[t[0]]=t[1];});
  var active='todos',query='',days='365',request=0,controller=null,lastKey='',lastLoaded=0;
  var esc=function(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');};
  function dt(v){return /^\d{4}-\d\d-\d\d$/.test(v||'')?v.split('-').reverse().join('/'):'';}
  function stamp(v){
    var d=new Date(v||'');
    return isNaN(d.getTime())?'não informada':d.toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
  }
  function style(){
    if(document.getElementById('hub-artigos-style'))return;
    var s=document.createElement('style');s.id='hub-artigos-style';
    s.textContent=[
      '#page-artigos > .filter-chips,#page-artigos #artigos-list{display:none!important}',
      '#artigosBuscaForm{display:grid;grid-template-columns:minmax(0,1fr) 84px;gap:6px;margin:5px 0 7px;width:100%;max-width:100%;align-items:stretch}',
      '#artigosBuscaTermo{min-width:0;width:100%;box-sizing:border-box;height:38px;min-height:38px;padding:0 10px;border-radius:9px;border:1px solid #ccdbe2;background:#fff;color:var(--navy);font:500 12px Manrope,sans-serif!important;line-height:normal;outline-offset:2px;-webkit-text-size-adjust:100%}',
      '#artigosBuscaTermo::placeholder{color:#798994;font-size:12px;text-overflow:ellipsis}',
      '#artigosBuscaBotao{height:38px;min-height:38px;padding:0 9px;border:0;border-radius:9px;background:var(--teal-mid);color:#fff;font:700 11.5px Manrope,sans-serif!important;cursor:pointer}',
      '.hub-artigos-aux{display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:nowrap;margin:0 0 9px;min-width:0}',
      '.hub-artigos-aux label{display:flex;align-items:center;gap:5px;min-width:0;white-space:nowrap;font:600 11px Manrope,sans-serif;color:var(--gray-500)}',
      '#artigosPeriodo{width:112px;max-width:33vw;min-width:0;height:32px;min-height:32px;box-sizing:border-box;border:1px solid #ccdbe2;background:#fff;border-radius:8px;padding:0 6px;font:600 11px Manrope,sans-serif!important;color:var(--navy);line-height:normal;-webkit-text-size-adjust:100%}',
      '#artigosBuscaLimpar{border:0;background:none;color:var(--teal-mid);font:700 10.5px Manrope,sans-serif!important;cursor:pointer;padding:5px 2px;white-space:nowrap;flex:none}',
      '#artigosStatus{font:500 11px Manrope,sans-serif;color:var(--gray-500);line-height:1.5;min-height:18px;margin:3px 0 10px}',
      '#feedChips button[aria-pressed=true]{background:var(--teal-mid)!important;color:#fff!important;border-color:var(--teal-mid)!important}',
      '#feedChips button{scroll-snap-align:start}',
      '#feedResults .art-card{display:flex;flex-direction:column;gap:4px;border-radius:13px}',
      '#feedResults .art-title{font-size:13px;line-height:1.48}',
      '#feedResults .art-title-pt{font-size:13px;line-height:1.48}',
      '#feedResults .art-links{display:flex;gap:7px;flex-wrap:wrap}',
      '@media(max-width:360px){#artigosBuscaForm{grid-template-columns:minmax(0,1fr) 76px}#artigosPeriodo{width:98px}#artigosBuscaBotao{padding:0 7px}.hub-artigos-aux label{font-size:10.5px}}'
    ].join('\n');document.head.appendChild(s);
  }
  function renderChips(){
    var box=document.getElementById('feedChips');if(!box)return;
    box.setAttribute('role','group');box.setAttribute('aria-label','Tema dos artigos');
    box.innerHTML=TOPICS.map(function(t){
      var selected=t[0]===active;
      return '<button type="button" data-article-topic="'+t[0]+'" aria-pressed="'+selected+'" style="flex:0 0 auto;border:1px solid '+(selected?'var(--teal-mid)':'var(--gray-100)')+';background:'+(selected?'var(--teal-mid)':'#fff')+';color:'+(selected?'#fff':'var(--gray-500)')+';border-radius:20px;padding:7px 13px;font-size:11.5px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:Manrope,sans-serif">'+esc(t[1])+'</button>';
    }).join('');
  }
  function ensureControls(){
    style();
    var chips=document.getElementById('feedChips');if(!chips)return;
    if(!document.getElementById('artigosBuscaForm')){
      var block=document.createElement('div');
      block.innerHTML='<form id="artigosBuscaForm" role="search"><input id="artigosBuscaTermo" type="search" maxlength="120" autocomplete="off" placeholder="Doença ou medicamento..." aria-label="Pesquisar artigos científicos"><button id="artigosBuscaBotao" type="submit">Buscar</button></form>'+
        '<div class="hub-artigos-aux"><label for="artigosPeriodo">Período: <select id="artigosPeriodo"><option value="30">30 dias</option><option value="90">90 dias</option><option value="365" selected>12 meses</option><option value="1095">3 anos</option><option value="0">Qualquer data</option></select></label><button id="artigosBuscaLimpar" type="button">Limpar pesquisa</button></div>';
      chips.parentNode.insertBefore(block,chips);
      var status=document.createElement('div');status.id='artigosStatus';status.setAttribute('role','status');
      chips.parentNode.insertBefore(status,document.getElementById('feedResults'));
      document.getElementById('artigosBuscaForm').addEventListener('submit',function(e){
        e.preventDefault();query=document.getElementById('artigosBuscaTermo').value.trim();load(active,true);
      });
      document.getElementById('artigosPeriodo').addEventListener('change',function(e){days=e.target.value;load(active,true);});
      document.getElementById('artigosBuscaLimpar').addEventListener('click',function(){
        query='';document.getElementById('artigosBuscaTermo').value='';load(active,true);
      });
      chips.addEventListener('click',function(e){
        var btn=e.target.closest('[data-article-topic]');
        if(btn)load(btn.getAttribute('data-article-topic'),true);
      });
    }
  }
  function message(txt){
    var el=document.getElementById('artigosStatus');if(el)el.textContent=txt;
  }
  function fallbackLink(){
    var terms=(query?query+' ':'')+(active==='todos'?'allergy immunology':topicNames[active]);
    return 'https://pubmed.ncbi.nlm.nih.gov/?term='+encodeURIComponent(terms)+'&sort=date';
  }
  function card(a){
    if(!a||!/^[1-9]\d{0,8}$/.test(String(a.pmid||'')))return '';
    var title=String(a.title||'').replace(/<[^>]*>/g,' ');
    var pub='https://pubmed.ncbi.nlm.nih.gov/'+a.pmid+'/';
    var topic=(a.topics||[])[0]||active;
    var authors=(a.authors||[]).filter(Boolean).join(', ');
    return '<article class="art-card" data-topic="'+esc(topic)+'" data-uid="'+a.pmid+'" data-ai-title="'+esc(title)+'" style="margin-bottom:10px">'+
      '<span class="art-journal">'+esc(a.journal||'Revista indexada')+' · '+esc(dt(a.date))+' · PMID '+a.pmid+'</span>'+
      '<div class="art-meta"><span class="tag t-gold">'+esc(topicNames[topic]||topicNames[active])+'</span></div>'+
      '<div class="art-title-pt" data-original="'+esc(title)+'">'+esc(title)+'</div>'+
      '<div class="art-title">'+esc(title)+'</div>'+
      (authors?'<div style="font-size:11px;color:var(--gray-500)">'+esc(authors)+'</div>':'')+
      '<div class="art-links" style="margin-top:9px">'+
      '<a class="link-btn pub" href="'+pub+'" target="_blank" rel="noopener noreferrer">Abrir no PubMed</a>'+
      (a.doi?'<a class="link-btn" href="https://doi.org/'+encodeURIComponent(a.doi)+'" target="_blank" rel="noopener noreferrer">Na revista</a>':'')+
      '<button type="button" class="link-btn btn-resumo">Resumo</button>'+
      '<button type="button" class="link-btn btn-save" aria-label="Favoritar artigo" style="margin-left:auto">🔖</button>'+
      '</div></article>';
  }
  function render(data){
    var box=document.getElementById('feedResults');if(!box)return;
    var a=Array.isArray(data.artigos)?data.artigos:[];
    if(data.topic!==active || data.query!==query || Number(data.days)!==Number(days))
      throw new Error('Resposta pertence a outro filtro');
    box.innerHTML=a.length?a.map(card).join(''):'<div style="padding:15px;border:1px solid var(--gray-100);border-radius:12px;color:var(--gray-500);font-size:12px">Nenhum artigo corresponde exatamente a este tema e período. Amplie o período ou altere os termos.</div>';
    message('PubMed · '+a.length+' publicações pertinentes · consulta em '+stamp(data.updatedAt)+' · mais recentes primeiro');
    lastLoaded=Date.now();
    lastKey=JSON.stringify([active,query,days]);
    if(typeof window.favScan==='function')window.favScan(box);
    if(typeof window._traduzirTitulosFeed==='function')window._traduzirTitulosFeed(box,active);
  }
  function load(topic,force){
    ensureControls();
    active=topicNames[topic]?topic:'todos';
    if(typeof window._feedTema!=='undefined')window._feedTema=active;
    renderChips();
    var box=document.getElementById('feedResults');if(!box)return Promise.resolve();
    var token=++request;
    if(controller)controller.abort();
    controller=typeof AbortController==='function'?new AbortController():null;
    box.style.opacity='1';
    box.innerHTML='<div role="status" style="font-size:12px;color:var(--gray-500);padding:18px 3px">Consultando os artigos mais recentes deste tema no PubMed…</div>';
    message('Atualizando lista temática diretamente do PubMed…');
    var qs=new URLSearchParams({tema:active,q:query,dias:days});
    if(force)qs.set('forcar','1');
    return fetch('/artigos?'+qs.toString(),{cache:'no-store',headers:{Accept:'application/json'},signal:controller?controller.signal:undefined})
      .then(function(r){if(!r.ok)throw new Error('Consulta indisponível');return r.json();})
      .then(function(data){
        if(token!==request)return;
        if(!data || data.schema!==1 || !Array.isArray(data.artigos))throw new Error('Dados inválidos');
        render(data);
      }).catch(function(e){
        if(token!==request || e.name==='AbortError')return;
        lastLoaded=0;
        message('Não foi possível obter publicações atualizadas para este filtro.');
        box.innerHTML='<div style="padding:15px;border:1px solid var(--gray-100);border-radius:12px;font-size:12px;color:var(--gray-500);line-height:1.6">O PubMed não respondeu à consulta agora. Não são mostrados resultados de outro tema nem listas antigas. <a href="'+esc(fallbackLink())+'" target="_blank" rel="noopener noreferrer" style="color:var(--teal-mid)">Pesquisar diretamente no PubMed</a> ou <button type="button" id="hub-artigos-retry" style="border:0;background:none;color:var(--teal-mid);font-weight:700;cursor:pointer">tentar novamente</button>.</div>';
        var retry=document.getElementById('hub-artigos-retry');
        if(retry)retry.addEventListener('click',function(){load(active,true);});
      });
  }
  // A Home utiliza a mesma busca rigorosa, sem os filtros antigos por medicamento isolado.
  window._homeBuscarTema=function(id){
    if(!topicNames[id] || id==='todos')return Promise.reject(new Error('Tema inválido'));
    return fetch('/artigos?'+new URLSearchParams({tema:id,dias:'365'}).toString(),{
      cache:'no-store',headers:{Accept:'application/json'}
    }).then(function(r){if(!r.ok)throw new Error('PubMed indisponível');return r.json();})
      .then(function(d){
        if(d.schema!==1 || d.topic!==id || !Array.isArray(d.artigos))throw new Error('Artigos inválidos');
        var result={uids:[]};
        d.artigos.slice(0,3).forEach(function(a){
          if(!/^[1-9]\d{0,8}$/.test(String(a.pmid)) || !(a.topics||[]).includes(id))return;
          result.uids.push(a.pmid);
          result[a.pmid]={uid:a.pmid,title:a.title,source:a.journal,pubdate:a.date,sortpubdate:a.date,
            authors:(a.authors||[]).map(function(name){return {name:name};})};
        });
        return {result:result};
      });
  };
  window.renderFeedChips=renderChips;
  window.carregarFeed=load;
  window.hubArtigosAoAbrir=function(){
    ensureControls();renderChips();
    var key=JSON.stringify([active,query,days]);
    if(!lastLoaded || lastKey!==key || Date.now()-lastLoaded>60*60*1000)return load(active,false);
    return Promise.resolve();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureControls);
  else ensureControls();
})();
