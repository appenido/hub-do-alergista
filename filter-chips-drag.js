/* Hub do Alergista: barras de doenças com arraste, swipe e setas discretas. */
(function () {
  'use strict';

  function installStyles() {
    if (document.getElementById('hub-chip-drag-styles')) return;
    var style = document.createElement('style');
    style.id = 'hub-chip-drag-styles';
    style.textContent =
      '.hub-chip-scroll-wrap{position:relative;min-width:0;width:100%;}' +
      '.hub-chip-scroll-wrap .filter-chips{box-sizing:border-box;cursor:grab;user-select:none;-webkit-user-select:none;scroll-behavior:auto!important;overscroll-behavior-x:contain;}' +
      '.hub-chip-scroll-wrap .filter-chips.hub-chip-dragging{cursor:grabbing;}' +
      '.hub-chip-scroll-wrap .fchip{user-select:none;-webkit-user-select:none;}' +
      '.hub-chip-scroll-wrap .filter-chips:focus-visible{outline:2px solid var(--teal-mid,#17858a);outline-offset:2px;}' +
      '.hub-chip-arrow{position:absolute;z-index:3;top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:30px;height:36px;padding:0;border:1px solid #dde7ed;border-radius:999px;background:rgba(255,255,255,.97);box-shadow:0 2px 9px rgba(20,43,58,.12);color:var(--teal-mid,#17858a);font:700 24px/1 sans-serif;cursor:pointer;}' +
      '.hub-chip-arrow[hidden]{display:none!important;}' +
      '.hub-chip-arrow:focus-visible{outline:2px solid var(--teal-mid,#17858a);outline-offset:2px;}' +
      '.hub-chip-arrow--left{left:4px;}.hub-chip-arrow--right{right:4px;}' +
      '@media(pointer:coarse){.hub-chip-arrow{width:29px;height:36px;}}';
    document.head.appendChild(style);
  }

  function makeArrow(direction) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hub-chip-arrow hub-chip-arrow--' + (direction < 0 ? 'left' : 'right');
    btn.textContent = direction < 0 ? '‹' : '›';
    btn.setAttribute('aria-label', direction < 0 ? 'Ver doenças anteriores' : 'Ver mais doenças');
    btn.title = direction < 0 ? 'Ver doenças anteriores' : 'Ver mais doenças';
    btn.hidden = true;
    return btn;
  }

  function mount(scroller) {
    if (scroller.dataset.hubDragScroll === '1' || !scroller.parentNode) return;
    scroller.dataset.hubDragScroll = '1';
    scroller.tabIndex = 0;
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-label', 'Filtros de doenças. Arraste horizontalmente, deslize no celular ou use as setas para encontrar outras doenças.');
    scroller.title = 'Arraste para os lados para ver mais doenças';

    var wrap = document.createElement('div');
    wrap.className = 'hub-chip-scroll-wrap';
    scroller.parentNode.insertBefore(wrap, scroller);
    wrap.appendChild(scroller);
    var left = makeArrow(-1);
    var right = makeArrow(1);
    wrap.appendChild(left);
    wrap.appendChild(right);

    function updateArrows() {
      var overflow = scroller.scrollWidth > scroller.clientWidth + 3;
      left.hidden = !overflow || scroller.scrollLeft <= 3;
      right.hidden = !overflow || scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 3;
    }

    function scrollDirection(direction) {
      var step = Math.max(180, Math.round(scroller.clientWidth * 0.7));
      scroller.scrollBy({ left: direction * step, behavior: 'smooth' });
    }
    left.addEventListener('click', function () { scrollDirection(-1); });
    right.addEventListener('click', function () { scrollDirection(1); });

    scroller.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      scrollDirection(event.key === 'ArrowLeft' ? -1 : 1);
    });

    var gesture = null;
    var suppressClickUntil = 0;
    scroller.addEventListener('pointerdown', function (event) {
      if (scroller.scrollWidth <= scroller.clientWidth + 3) return;
      if (event.pointerType !== 'touch' && event.button !== 0) return;
      gesture = {
        id: event.pointerId,
        x: event.clientX,
        initialScroll: scroller.scrollLeft,
        touch: event.pointerType === 'touch',
        dragged: false
      };
    });
    scroller.addEventListener('pointermove', function (event) {
      if (!gesture || event.pointerId !== gesture.id) return;
      var dx = event.clientX - gesture.x;
      if (!gesture.dragged && Math.abs(dx) > 7) {
        gesture.dragged = true;
        if (!gesture.touch) {
          scroller.classList.add('hub-chip-dragging');
          try { scroller.setPointerCapture(event.pointerId); } catch (e) {}
        }
      }
      if (gesture.dragged && !gesture.touch) {
        scroller.scrollLeft = gesture.initialScroll - dx;
        event.preventDefault();
      }
      // No touch, o próprio navegador executa o deslocamento horizontal nativo.
    });
    function finishGesture(event) {
      if (!gesture || event.pointerId !== gesture.id) return;
      if (gesture.dragged) suppressClickUntil = Date.now() + 300;
      gesture = null;
      scroller.classList.remove('hub-chip-dragging');
      try {
        if (scroller.hasPointerCapture(event.pointerId)) scroller.releasePointerCapture(event.pointerId);
      } catch (e) {}
      updateArrows();
    }
    scroller.addEventListener('pointerup', finishGesture);
    scroller.addEventListener('pointercancel', finishGesture);
    scroller.addEventListener('lostpointercapture', finishGesture);
    scroller.addEventListener('click', function (event) {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    scroller.addEventListener('dragstart', function (event) { event.preventDefault(); });
    scroller.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(updateArrows);
      observer.observe(scroller);
    }
    window.addEventListener('load', updateArrows, { once: true });
    updateArrows();
  }

  function init() {
    installStyles();
    document.querySelectorAll('.filter-chips').forEach(mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
