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
      '#artigosBuscaForm{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin:7px 0 9px}',
      '#artigosBuscaTermo{min-width:0;width:100%;box-sizing:border-box;padding:11px 13px;border-radius:11px;border:1px solid #ccdbe2;background:#fff;color:var(--navy);font:500 13px Manrope,sans-serif;outline-offset:2px}',
      '#artigosBuscaBotao{padding:10px 17px;border:0;border-radius:11px;background:var(--teal-mid);color:#fff;font:700 12px Manrope,sans-serif;cursor:pointer}',
      '.hub-artigos-aux{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:0 0 12px}',
      '.hub-artigos-aux label{display:flex;align-items:center;gap:7px;font:600 11.5px Manrope,sans-serif;color:var(--gray-500)}',
      '#artigosPeriodo{border:1px solid #ccdbe2;background:#fff;border-radius:9px;padding:6px 9px;font:600 11.5px Manrope,sans-serif;color:var(--navy)}',
      '#artigosBuscaLimpar{border:0;background:none;color:var(--teal-mid);font:700 11.5px Manrope,sans-serif;cursor:pointer;padding:5px}',
      '#artigosStatus{font:500 11px Manrope,sans-serif;color:var(--gray-500);line-height:1.5;min-height:18px;margin:3px 0 10px}',
      '#feedChips button[aria-pressed=true]{background:var(--teal-mid)!important;color:#fff!important;border-color:var(--teal-mid)!important}',
      '#feedChips button{scroll-snap-align:start}',
      '#feedResults .art-card{display:flex;flex-direction:column;gap:4px;border-radius:13px}',
      '#feedResults .art-title{font-size:13px;line-height:1.48}',
      '#feedResults .art-title-pt{font-size:13px;line-height:1.48}',
      '#feedResults .art-links{display:flex;gap:7px;flex-wrap:wrap}',
      '@media(max-width:420px){#artigosBuscaForm{grid-template-columns:minmax(0,1fr) auto}#artigosBuscaBotao{padding:9px 11px}}'
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
      block.innerHTML='<form id="artigosBuscaForm" role="search"><input id="artigosBuscaTermo" type="search" maxlength="120" autocomplete="off" placeholder="Pesquisar doença, medicamento ou palavra-chave" aria-label="Pesquisar artigos científicos"><button id="artigosBuscaBotao" type="submit">Pesquisar</button></form>'+
        '<div class="hub-artigos-aux"><label for="artigosPeriodo">Publicações de <select id="artigosPeriodo"><option value="30">30 dias</option><option value="90">90 dias</option><option value="365" selected>12 meses</option><option value="1095">3 anos</option><option value="0">Qualquer data</option></select></label><button id="artigosBuscaLimpar" type="button">Limpar pesquisa</button></div>';
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
      '<button type="button" class="link-btn ai btn-ai-summary">Analisar com IA</button>'+
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
