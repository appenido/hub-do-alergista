/* Alergo News — cards interativos de reportagens (sem alterar as fontes) */
(function(){
  'use strict';
  var root, observer;

  function classifyCard(a){
    var parts=Array.prototype.filter.call(a.children,function(x){return x.tagName==='DIV';});
    if(parts[0]) parts[0].classList.add('an-source');
    if(parts[1]) parts[1].classList.add('an-title');
    if(parts.length>3 && parts[2]) parts[2].classList.add('an-description');
    if(parts.length>2) parts[parts.length-1].classList.add('an-read');
  }

  function makeButton(label, content, className){
    var b=document.createElement('button');
    b.type='button';
    b.setAttribute('aria-label',label);
    if(className) b.className=className;
    if(content) b.innerHTML=content;
    return b;
  }

  function makeCover(n){
    var cover=document.createElement('div');
    cover.className='an-story-cover';
    cover.setAttribute('aria-hidden','true');
    var marker=document.createElement('span');
    marker.className='an-cover-mark';
    marker.innerHTML='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 6h22v20H5zM10 11h8v8h-8zM21 11h3M21 15h3M10 22h14"/><path d="M2 9v17a3 3 0 0 0 3 3h19"/></svg>';
    marker.appendChild(document.createTextNode(n===0?'CAPA · REPORTAGEM EM DESTAQUE':'REPORTAGEM EM FOCO'));
    cover.appendChild(marker);
    return cover;
  }

  function enhance(){
    if(!root || root.querySelector(':scope > .an-feature')) return;
    var cards=Array.prototype.filter.call(root.children,function(node){
      return node.tagName==='A' && node.getAttribute('href');
    });
    if(!cards.length) return;

    var selected=cards.slice(0,Math.min(3,cards.length));
    var section=document.createElement('section');
    section.className='an-feature';
    section.setAttribute('aria-label','Reportagens em destaque');
    var header=document.createElement('div');
    header.className='an-feature-heading';
    var h=document.createElement('div');
    h.innerHTML='<span class="an-eyebrow">Seleção editorial</span><div class="an-section-title">Em destaque</div>';
    var counter=document.createElement('span');
    counter.className='an-count';
    counter.setAttribute('aria-live','polite');
    header.appendChild(h);
    header.appendChild(counter);
    section.appendChild(header);

    var stage=document.createElement('div');
    stage.className='an-stage';
    stage.id='an-news-stage';
    stage.tabIndex=0;
    stage.setAttribute('aria-label','Reportagens em destaque. Use as setas para navegar');
    var slides=[];
    selected.forEach(function(a,i){
      classifyCard(a);
      a.classList.add('an-story-card');
      a.insertBefore(makeCover(i),a.firstChild);
      var slide=document.createElement('div');
      slide.className='an-slide';
      slide.setAttribute('role','group');
      slide.setAttribute('aria-roledescription','slide');
      slide.setAttribute('aria-label','Reportagem '+(i+1)+' de '+selected.length);
      slide.appendChild(a);
      stage.appendChild(slide);
      slides.push(slide);
    });
    section.appendChild(stage);

    var controls=document.createElement('div');
    controls.className='an-story-controls';
    var progress=document.createElement('div');
    progress.className='an-story-progress';
    progress.setAttribute('role','group');
    progress.setAttribute('aria-label','Selecionar reportagem');
    var dots=selected.map(function(a,i){
      var title=(a.querySelector('.an-title')||a).textContent.trim();
      var dot=makeButton('Ver reportagem '+(i+1)+': '+title,'','an-story-dot');
      dot.setAttribute('aria-controls','an-news-stage');
      progress.appendChild(dot);
      return dot;
    });
    controls.appendChild(progress);

    var actions=document.createElement('div');
    actions.className='an-story-actions';
    var prev=makeButton('Reportagem anterior','&#8592;','an-story-prev');
    var next=makeButton('Próxima reportagem','&#8594;','an-story-next');
    var share=makeButton('Compartilhar reportagem','<span aria-hidden="true">&#8599;</span><span class="an-share-label">Compartilhar</span>','an-story-share');
    actions.appendChild(prev);
    actions.appendChild(next);
    actions.appendChild(share);
    controls.appendChild(actions);
    section.appendChild(controls);

    var status=document.createElement('div');
    status.className='an-story-status';
    status.setAttribute('role','status');
    status.setAttribute('aria-live','polite');
    section.appendChild(status);

    var current=0, messageTimer=null;
    function show(i){
      current=(i+slides.length)%slides.length;
      slides.forEach(function(s,j){s.hidden=j!==current;});
      dots.forEach(function(d,j){d.setAttribute('aria-pressed',j===current?'true':'false');});
      counter.textContent=(current+1)+' / '+slides.length;
      status.textContent='';
    }
    function change(delta){show(current+delta);}
    prev.addEventListener('click',function(){change(-1);});
    next.addEventListener('click',function(){change(1);});
    dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i);});});
    stage.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();change(1);}
      if(e.key==='ArrowLeft'){e.preventDefault();change(-1);}
    });
    var touchX=0,touchY=0;
    stage.addEventListener('touchstart',function(e){
      if(e.touches.length!==1)return;
      touchX=e.touches[0].clientX;touchY=e.touches[0].clientY;
    },{passive:true});
    stage.addEventListener('touchend',function(e){
      if(!e.changedTouches.length)return;
      var dx=e.changedTouches[0].clientX-touchX;
      var dy=e.changedTouches[0].clientY-touchY;
      if(Math.abs(dx)>48 && Math.abs(dx)>Math.abs(dy)*1.4) change(dx<0?1:-1);
    },{passive:true});

    function announce(t){
      clearTimeout(messageTimer);
      status.textContent=t;
      messageTimer=setTimeout(function(){status.textContent='';},3200);
    }
    share.addEventListener('click',function(){
      var active=slides[current].querySelector('a');
      if(!active)return;
      var link=active.href;
      var title=(active.querySelector('.an-title')||active).textContent.trim();
      if(navigator.share){
        navigator.share({title:title,url:link}).catch(function(){});
      }else if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(link).then(function(){announce('Link da reportagem copiado.');})
          .catch(function(){window.prompt('Copie o link da reportagem:',link);});
      }else{
        window.prompt('Copie o link da reportagem:',link);
      }
    });
    show(0);
    root.insertBefore(section,root.firstChild);

    var others=cards.slice(selected.length);
    if(others.length){
      var label=document.createElement('div');
      label.className='an-news-list-heading';
      label.textContent='Mais notícias';
      root.appendChild(label);
      var grid=document.createElement('div');
      grid.className='an-news-grid';
      others.forEach(function(a){
        classifyCard(a);
        a.classList.add('an-news-card');
        grid.appendChild(a);
      });
      root.appendChild(grid);
    }
  }

  function init(){
    root=document.getElementById('jornalCorpo');
    if(!root || observer)return;
    observer=new MutationObserver(enhance);
    observer.observe(root,{childList:true});
    enhance();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
