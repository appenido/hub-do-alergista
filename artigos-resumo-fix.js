/* Resumo científico resiliente do Hub — PubMed verificável, limite de espera e fallback. */
(function () {
  'use strict';
  var tentativaAtual = 0;

  function esc(valor) {
    return String(valor == null ? '' : valor).replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function buscarComPrazo(url, opcoes, prazo) {
    var ac = new AbortController();
    var timer = setTimeout(function(){ ac.abort(); }, prazo || 15000);
    return fetch(url, Object.assign({}, opcoes || {}, {signal:ac.signal}))
      .finally(function(){clearTimeout(timer);});
  }
  function palavras(titulo) {
    var ignoradas = /^(with|from|that|this|study|trial|phase|randomized|clinical|among|para|sobre|ensaio|estudo|com|the|and|for|dos|das)$/;
    return [...new Set(String(titulo||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().split(/[^a-z0-9]+/).filter(function(p){return p.length>=4&&!ignoradas.test(p);}))];
  }
  function tituloCompativel(esperado, encontrado) {
    var a=palavras(esperado), b=palavras(encontrado);
    if(!a.length||!b.length)return false;
    var comuns=a.filter(function(w){return b.indexOf(w)!==-1;}).length;
    return comuns>=2 && comuns/Math.min(a.length,b.length)>=0.5;
  }
  function artigoNoPubmed(info) {
    var q = new URLSearchParams();
    if(info.uid && /^\d+$/.test(info.uid)) q.set('id', info.uid);
    else {
      if(info.doi) q.set('doi',info.doi);
      if(info.titulo) q.set('title',info.titulo);
    }
    if(!q.toString()) return Promise.reject(new Error('Referência sem PMID, DOI ou título.'));
    return buscarComPrazo('/pubmed?'+q.toString(),{cache:'no-store'},19000)
      .then(function(r){
        if(!r.ok) throw new Error(r.status===404?'Artigo não localizado no PubMed.':'PubMed indisponível.');
        return r.text();
      })
      .then(function(xml){
        var doc=new DOMParser().parseFromString(xml,'application/xml');
        if(doc.querySelector('parsererror'))throw new Error('Resposta PubMed inválida.');
        var artTitle=doc.getElementsByTagName('ArticleTitle')[0];
        var tituloReal=artTitle ? artTitle.textContent.trim() : '';
        if(info.titulo && (!tituloReal || !tituloCompativel(info.titulo,tituloReal))){
          throw new Error('O registro encontrado não corresponde ao título selecionado.');
        }
        var nodes=doc.getElementsByTagName('AbstractText');
        var secoes=[];
        for(var i=0;i<nodes.length;i++){
          var texto=(nodes[i].textContent||'').trim();
          if(texto)secoes.push({rotulo:nodes[i].getAttribute('Label')||'',texto:texto});
        }
        if(!secoes.length)throw new Error('O registro não contém abstract acessível.');
        var pmidEl=doc.getElementsByTagName('PMID')[0];
        return {titulo:tituloReal,pmid:pmidEl?pmidEl.textContent.trim():'',
          secoes:secoes, texto:secoes.map(function(p){return (p.rotulo?p.rotulo+': ':'')+p.texto;}).join('\n')};
      });
  }
  function mostrarResumoOficial(dados) {
    var html='<div style="padding:10px 12px;border-left:3px solid var(--teal-mid);background:#f1f8f9;border-radius:7px;margin-bottom:13px">'
      +'<div style="font-size:12px;color:var(--teal-mid)">Resumo oficial · PubMed'
      +(dados.pmid?' · PMID '+esc(dados.pmid):'')+'</div>'
      +'<div style="font-size:12px;color:var(--navy);margin-top:5px">'+esc(dados.titulo)+'</div></div>';
    dados.secoes.forEach(function(p){
      html+='<p style="font-size:13px;line-height:1.7;color:var(--navy);margin:0 0 11px">'
        +(p.rotulo?'<span style="font-weight:650">'+esc(p.rotulo)+':</span> ':'')+esc(p.texto)+'</p>';
    });
    return html;
  }
  function mostrarErroOrigem(alvo, card, erro) {
    var descricao=card.querySelector('.art-body');
    var txt=descricao ? (descricao.textContent||'').trim() : '';
    var motivo=erro&&erro.name==='AbortError'?'O PubMed não respondeu dentro do prazo.':
      (erro&&erro.message ? erro.message : 'Não foi possível acessar o PubMed.');
    var html='<p style="font-size:13px;color:#735925;line-height:1.6">'
      +esc(motivo)+' Não foi gerada uma análise sem fonte verificável.</p>';
    if(txt){
      html+='<div style="padding:12px;background:#f4f8fa;border-radius:9px">'
        +'<div style="font-size:11px;color:var(--teal-mid);margin-bottom:8px">Síntese editorial cadastrada no Hub (não é o abstract oficial)</div>'
        +'<p style="font-size:13px;line-height:1.7;color:var(--navy)">'+esc(txt)+'</p></div>';
    }
    alvo.innerHTML=html;
  }
  function colocarLink(sheet, card, titulo) {
    var links=document.getElementById('aiSheetLinks');
    links.replaceChildren();
    var cardLink=card.querySelector('a.link-btn.pub');
    var alvo=cardLink&&/^https:\/\//i.test(cardLink.href)?cardLink.href:
      'https://pubmed.ncbi.nlm.nih.gov/?term='+encodeURIComponent(titulo);
    var a=document.createElement('a');
    a.className='link-btn pub';
    a.href=alvo;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.style.cssText='flex:1;justify-content:center';
    a.textContent=/\.pdf(?:[?#]|$)|\/pdf(?:[/?#]|$)/i.test(alvo)?'📄 Abrir PDF original':'📄 Abrir artigo original';
    links.appendChild(a);
  }
  function analiseHTML(resposta, jornal) {
    var html='<div style="font-size:11px;color:var(--teal-mid);padding:9px 11px;border-left:3px solid var(--teal-mid);background:#f2f8f9;margin-bottom:14px">Análise do abstract · '+esc(jornal)+'</div>';
    String(resposta||'').split('\n').forEach(function(l){
      l=l.trim();if(!l)return;
      if(/^#{1,4}\s/.test(l))html+='<h3>'+esc(l.replace(/^#+\s*/,''))+'</h3>';
      else html+='<p>'+esc(l.replace(/^[-*]\s*/,''))+'</p>';
    });
    return html+'<p style="font-size:11px;line-height:1.5;color:var(--gray-500)">Análise automática baseada apenas no abstract publicado. Confira o artigo completo antes de orientar condutas.</p>';
  }

  window.openAiSheet=function(card){
    if(!card)return;
    var token=++tentativaAtual;
    var ehGuia=card.classList.contains('guide-card');
    var titulo=card.getAttribute('data-ai-title') ||
      (ehGuia && card.querySelector('.gc-name')?card.querySelector('.gc-name').textContent:'') ||
      (card.querySelector('.art-title')?card.querySelector('.art-title').textContent:'');
    var tituloPt=card.querySelector('.art-title-pt')?card.querySelector('.art-title-pt').textContent:titulo;
    var journalEl=card.querySelector('.art-journal')||card.querySelector('.gc-year')||card.querySelector('.gc-soc');
    var jornal=journalEl?journalEl.textContent:'';
    var uid=card.getAttribute('data-uid')||'';
    var doi=card.getAttribute('data-doi')||'';
    var sheet=document.getElementById('aiSheet');
    var body=document.getElementById('aiSheetBody');
    if(!sheet||!body)return;
    document.getElementById('aiSheetTitle').textContent=tituloPt||titulo||'Análise do artigo';
    var doiEl=document.getElementById('aiSheetDoi');
    doiEl.textContent=doi?'DOI: '+doi:'';
    doiEl.style.display=doi?'flex':'none';
    colocarLink(sheet,card,titulo||tituloPt);
    sheet.classList.add('open');
    body.innerHTML='<div class="ai-sheet-loading" role="status">Consultando o resumo oficial no PubMed…</div>';

    artigoNoPubmed({uid:uid,doi:doi,titulo:titulo}).then(function(dados){
      if(token!==tentativaAtual)return;
      var oficial=mostrarResumoOficial(dados);
      body.innerHTML=oficial+
        '<p id="aiAnaliseStatus" role="status" style="font-size:12px;color:var(--teal-mid);margin:15px 0">Gerando análise crítica a partir do abstract…</p>';
      var resumo=dados.texto.slice(0,2850);
      var truncado=dados.texto.length>2850?' [Abstract parcialmente transcrito por limite técnico.]':'';
      var pergunta='Analise APENAS o abstract médico informado, sem inventar números, resultados ou conclusões. '
        +'Quando um dado não constar, escreva "não informado no resumo". Responda em português brasileiro '
        +'e use estas seções: ## Objetivo; ## Métodos e população; ## Resultados; ## Limitações; '
        +'## Aplicabilidade clínica. Não afirme ter lido o artigo integral. '
        +'Título: '+titulo+'. Revista: '+jornal+'. Abstract: '+resumo+truncado;
      return buscarComPrazo('/ia',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({pergunta:pergunta})},22000)
        .then(function(r){return r.json().then(function(d){if(!r.ok||!d.resposta)throw new Error(d.erro||'Serviço de IA indisponível.');return d.resposta;});})
        .then(function(resposta){
          if(token!==tentativaAtual)return;
          body.innerHTML=analiseHTML(resposta,jornal)+
            '<details style="margin-top:16px"><summary style="color:var(--teal-mid);cursor:pointer">Consultar o abstract oficial do PubMed</summary><div style="margin-top:12px">'+oficial+'</div></details>';
        })
        .catch(function(){
          if(token!==tentativaAtual)return;
          body.innerHTML=oficial+'<p style="font-size:12px;line-height:1.6;color:#795d22;margin-top:14px">'
            +'A análise automática não respondeu dentro do prazo ou está indisponível. O resumo oficial permanece disponível acima.</p>';
        });
    }).catch(function(e){
      if(token!==tentativaAtual)return;
      mostrarErroOrigem(body,card,e);
    });
  };

  // O botão "Resumo" também deve encerrar o carregamento quando o PubMed falhar.
  window._buscarAbstract=function(uid,alvo){
    artigoNoPubmed({uid:uid,titulo:''}).then(function(d){
      if(alvo.isConnected)alvo.innerHTML=mostrarResumoOficial(d);
    }).catch(function(e){
      if(alvo.isConnected)alvo.innerHTML='<p style="font-size:13px;line-height:1.6;color:var(--gray-500)">'
        +esc(e&&e.name==='AbortError'?'Consulta ao PubMed excedeu o tempo limite.':'Resumo oficial indisponível no momento.')
        +' Abra o artigo original pelo botão abaixo.</p>';
    });
  };
})();
