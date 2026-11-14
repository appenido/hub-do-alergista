/* Hub do Alergista | farmácias próximas e preço por unidade, somente verificado. */
(() => {
  'use strict';
  const API = '/api/farmacias-proximas';
  const GEO = '/api/farmacias-localizacao';
  const PRICE = '/api/farmacias-precos';
  let exactCoords = null; // memória temporária; nunca salva GPS em storage
  let approxPromise = null;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validCoord = (lat,lon) => Number.isFinite(lat) && Number.isFinite(lon) && lat>=-34 && lat<=6 && lon>=-74 && lon<=-32;
  const normalize = s => String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const haversine = (a,b,c,d) => {
    const rad=Math.PI/180;
    const v=Math.sin((c-a)*rad/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin((d-b)*rad/2)**2;
    return 12742*Math.asin(Math.min(1,Math.sqrt(v)));
  };
  const htmlURL = v => /^https:\/\/(www\.)?google\.com\/maps\//.test(v||'') ? v : null;
  const money = value => Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const priceGoogleUrl = (medicine,pharmacy,city,uf) =>
    'https://www.google.com/search?q='+encodeURIComponent([medicine,pharmacy,city,uf,'preço medicamento comprar'].filter(Boolean).join(' '));
  const mapsFallback = (city,uf) =>
    'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('farmácias '+city+' '+uf);
  const coordLink = p => 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.lat+','+p.lon);
  function getApprox() {
    if (!approxPromise) {
      approxPromise=fetch(GEO,{cache:'no-store',credentials:'same-origin'})
        .then(r=>r.ok?r.json():null).catch(()=>null);
    }
    return approxPromise;
  }
  function pharmacyName(panel) {
    return (panel.querySelector('.hub-precos-head h3')?.textContent||'').trim().slice(0,120);
  }
  function cityUF(panel) {
    return {
      city: (panel.querySelector('[data-precos-city]')?.value||'').trim().slice(0,100),
      uf: (panel.querySelector('[data-precos-uf]')?.value||'').trim().toUpperCase().slice(0,2)
    };
  }
  function message(target,text) {
    if (target) target.textContent=text;
  }
  function matchOffer(store,offer) {
    const lat=Number(offer.storeLat),lon=Number(offer.storeLon);
    const updated=new Date(offer.updatedAt||'').getTime();
    if (!offer.verified || !Number.isFinite(Number(offer.price)) || Number(offer.price)<=0 ||
        !validCoord(lat,lon) || !Number.isFinite(updated) ||
        updated>Date.now()+300000 || Date.now()-updated>86400000 ||
        !/^https:\/\//.test(offer.url||'')) return false;
    // Mesma unidade física (até 180 m) e mesma rede/nome; não serve preço online regional.
    if (haversine(store.lat,store.lon,lat,lon)>0.18) return false;
    const a=normalize(store.name),b=normalize(offer.pharmacy);
    if (['farmacia','drogaria','drugstore'].includes(a) || !b) return false;
    return a===b || (b.length>4 && a.includes(b)) || (a.length>4 && b.includes(a));
  }
  async function priceAtStore(medicine,city,uf,stores) {
    // Endpoint licenciado opcional; sem fornecedor = sem preço numérico.
    try {
      const response=await fetch(PRICE,{
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({medication:medicine,city,uf})
      });
      if (!response.ok) return {};
      const data=await response.json();
      const list=Array.isArray(data.offers)?data.offers:[];
      const found={};
      for (const store of stores) {
        const offer=list.filter(o=>matchOffer(store,o)).sort((a,b)=>Number(a.price)-Number(b.price))[0];
        if (offer) found[store.id]=offer;
      }
      return found;
    } catch (_) {return {};}
  }
  function showStores(panel,stores,source,accuracy,hasCoords) {
    const mount=panel.querySelector('[data-proximas-results]');
    if (!mount) return;
    const {city,uf}=cityUF(panel), medicine=pharmacyName(panel);
    if (!stores.length) {
      mount.innerHTML='<p class="hub-proximas-status">Não foi possível confirmar unidades próximas nesta consulta.</p>'+
        '<a class="hub-proximas-map" href="'+esc(mapsFallback(city,uf))+'" target="_blank" rel="noopener noreferrer">Procurar farmácias no Google Maps ↗</a>'+
        '<a class="hub-proximas-map" href="'+esc(priceGoogleUrl(medicine,'',city,uf))+'" target="_blank" rel="noopener noreferrer">Pesquisar preço do medicamento no Google ↗</a>';
      return;
    }
    mount.innerHTML='<p class="hub-proximas-note">Unidades por distância '+(accuracy==='precise'?'da localização autorizada':'do ponto aproximado da cidade')+
      ' (linha reta, não distância de percurso). '+esc(source||'')+'. Estoque e preço exigem confirmação.</p>'+
      '<div class="hub-proximas-grid">'+stores.slice(0,8).map((store,i)=>{
      const maps=htmlURL(store.mapsUrl)||coordLink(store);
      return '<article class="hub-proximas-store" data-near-store="'+esc(store.id)+'">'+
        '<div class="hub-proximas-store-head"><span class="hub-proximas-index">'+(i===0?'Mais próxima':'Farmácia próxima')+'</span>'+
        '<span class="hub-proximas-distance">'+Number(store.distanceKm).toLocaleString('pt-BR',{maximumFractionDigits:2})+' km</span></div>'+
        '<div class="hub-proximas-name">'+esc(store.name)+'</div>'+
        '<div class="hub-proximas-address">'+esc(store.address)+'</div>'+
        '<div class="hub-proximas-price" data-near-price="'+esc(store.id)+'">Preço nesta unidade: não confirmado</div>'+
        '<div class="hub-proximas-actions"><a href="'+esc(maps)+'" target="_blank" rel="noopener noreferrer">Ver no mapa</a>'+
        '<a href="'+esc(priceGoogleUrl(medicine,store.name,city,uf))+'" target="_blank" rel="noopener noreferrer">Pesquisar preço no Google</a></div></article>';
    }).join('')+'</div>'+
    '<div class="hub-proximas-license">'+(source==='OpenStreetMap'?'Dados de localização: © contribuidores OpenStreetMap (ODbL). ':'')+
    'A busca do Google não comprova preço da filial. Compare dose, concentração e embalagem.</div>';
    priceAtStore(medicine,city,uf,stores).then(offers=>{
      if (!panel.isConnected || !panel.contains(mount)) return;
      stores.forEach(store=>{
        const price=offers[store.id];
        if (!price) return;
        const target=Array.from(mount.querySelectorAll('[data-near-price]'))
          .find(el=>el.dataset.nearPrice===store.id);
        if (!target) return;
        target.textContent='';
        const label=document.createElement('span');
        label.textContent='Oferta verificada: '+money(price.price)+' · '+String(price.presentation||'')+
          ' · '+new Date(price.updatedAt).toLocaleDateString('pt-BR');
        target.appendChild(label);
        const link=document.createElement('a');
        link.href=price.url;link.target='_blank';link.rel='noopener noreferrer';
        link.textContent=' Conferir na farmácia ↗';
        target.appendChild(link);
      });
    });
  }
  async function queryStores(panel,coords,accuracy) {
    const target=panel.querySelector('[data-proximas-results]');
    if (!target) return;
    if (!coords || !validCoord(coords.lat,coords.lon)) {
      const {city,uf}=cityUF(panel);
      target.innerHTML='<p class="hub-proximas-status">Para identificar qual farmácia é a mais próxima, autorize sua localização ou consulte o mapa da cidade.</p>'+
        '<a class="hub-proximas-map" href="'+esc(mapsFallback(city,uf))+'" target="_blank" rel="noopener noreferrer">Encontrar farmácias no Google Maps ↗</a>';
      return;
    }
    target.textContent='Localizando unidades próximas…';
    try {
      const response=await fetch(API,{
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({lat:coords.lat,lon:coords.lon,accuracy})
      });
      if (!response.ok) throw new Error('Consulta indisponível');
      const data=await response.json();
      if (!panel.isConnected || !panel.contains(target)) return;
      const stores=Array.isArray(data.stores)?data.stores.filter(p=>
        p && typeof p.id==='string' && typeof p.name==='string' &&
        validCoord(Number(p.lat),Number(p.lon)) &&
        Number.isFinite(Number(p.distanceKm)) && Number(p.distanceKm)>=0
      ).slice(0,10):[];
      showStores(panel,stores,data.source,accuracy,true);
    } catch (_) {
      if (panel.isConnected && panel.contains(target)) showStores(panel,[],'',accuracy,true);
    }
  }
  async function initializePanel(panel) {
    if (!panel.isConnected || panel.querySelector('.hub-proximas')) return;
    const help=panel.querySelector('.hub-precos-help');
    if (!help) return;
    // O GPS é opcional e solicitado somente após clique explícito.
    help.textContent='Sua cidade é aproximada. Para ordenar por proximidade real, autorize o GPS. A posição precisa não é salva.';
    const near=document.createElement('section');
    near.className='hub-proximas';
    near.innerHTML='<div class="hub-proximas-title"><div><span>FARMÁCIAS PRÓXIMAS</span>'+
      '<h4>Mais perto de você</h4></div><button type="button" data-near-gps>Usar minha localização</button></div>'+
      '<div data-proximas-results class="hub-proximas-results" aria-live="polite">Verificando farmácias próximas…</div>';
    help.insertAdjacentElement('afterend',near);
    const approx=await getApprox();
    if (!panel.isConnected || !panel.contains(near)) return;
    const {city,uf}=cityUF(panel);
    const sameRegion=approx && normalize(city)===normalize(approx.city) && uf===approx.uf;
    const coords=exactCoords || (sameRegion ? {lat:Number(approx.lat),lon:Number(approx.lon)}:null);
    queryStores(panel,coords,exactCoords?'precise':'approximate');
  }
  async function useGPS(panel,button) {
    if (!navigator.geolocation) {
      message(panel.querySelector('[data-proximas-results]'),'Geolocalização indisponível neste navegador.');
      return;
    }
    button.disabled=true;
    message(panel.querySelector('[data-proximas-results]'),'Aguardando autorização de localização do navegador…');
    navigator.geolocation.getCurrentPosition(
      pos => {
        button.disabled=false;
        const lat=pos.coords.latitude,lon=pos.coords.longitude;
        if (!validCoord(lat,lon)) {
          message(panel.querySelector('[data-proximas-results]'),'Não foi possível utilizar estas coordenadas.');
          return;
        }
        exactCoords={lat,lon};
        if (panel.isConnected) queryStores(panel,exactCoords,'precise');
      },
      () => {
        button.disabled=false;
        message(panel.querySelector('[data-proximas-results]'),'Localização não autorizada ou indisponível. É possível procurar pelo Google Maps usando a cidade.');
      },
      {enableHighAccuracy:false,timeout:12000,maximumAge:120000}
    );
  }
  function scan() {
    document.querySelectorAll('.hub-precos-panel').forEach(panel=>{
      if (!panel.querySelector('.hub-proximas')) initializePanel(panel);
    });
  }
  function init(){
    const style=document.createElement('style');style.id='hub-farmacias-proximas-css';
    style.textContent=[
      '.hub-proximas{margin:13px 0 8px;border:1px solid #d5e5ea;background:#f8fbfc;border-radius:12px;padding:11px;min-width:0}',
      '.hub-proximas-title{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}',
      '.hub-proximas-title span{font-size:9px;letter-spacing:.065em;font-weight:800;color:#5e7b86}',
      '.hub-proximas-title h4{font-size:14px;margin:2px 0;color:#133747}',
      '.hub-proximas-title button{background:#12495e;color:white;border:0;padding:9px 10px;border-radius:9px;cursor:pointer;font:600 11px Manrope,Arial,sans-serif}',
      '.hub-proximas-title button:disabled{opacity:.5;cursor:wait}',
      '.hub-proximas-note,.hub-proximas-status,.hub-proximas-license{font-size:10px;line-height:1.5;color:#5a737e;margin:9px 0}',
      '.hub-proximas-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0}',
      '.hub-proximas-store{border:1px solid #d9e5e9;border-radius:10px;background:white;padding:10px;min-width:0}',
      '.hub-proximas-store:first-child{border-color:#87b6c1}',
      '.hub-proximas-store-head{display:flex;justify-content:space-between;gap:7px;align-items:center;flex-wrap:wrap}',
      '.hub-proximas-index{font-size:9px;color:#21566b;font-weight:800}',
      '.hub-proximas-distance{font-size:10px;color:#516873}',
      '.hub-proximas-name{font-size:12px;font-weight:800;color:#163b4a;margin:7px 0 2px}',
      '.hub-proximas-address{font-size:10px;color:#6a7c83;line-height:1.4;overflow-wrap:anywhere}',
      '.hub-proximas-price{font-size:10px;font-weight:700;color:#526a75;margin:10px 0 7px}',
      '.hub-proximas-price a{color:#116e62}',
      '.hub-proximas-actions{display:flex;flex-wrap:wrap;gap:5px}',
      '.hub-proximas-actions a,.hub-proximas-map{display:inline-block;padding:6px 7px;border:1px solid #c1d7df;background:#f8fcfd;color:#13586c;border-radius:7px;text-decoration:none;font:650 10px Manrope,Arial,sans-serif;margin:3px 3px 3px 0}',
      '@media(max-width:520px){.hub-proximas-grid{grid-template-columns:1fr}}'
    ].join('\n');
    if (!document.getElementById(style.id)) document.head.appendChild(style);
    let timer=null;
    const obs=new MutationObserver(()=>{
      clearTimeout(timer);timer=setTimeout(scan,140);
    });
    obs.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-near-gps]');
      if (button) {event.preventDefault();event.stopPropagation(); const panel=button.closest('.hub-precos-panel');if(panel)useGPS(panel,button);}
      if(event.target.closest('[data-precos-save]')) exactCoords=null;
    },true);
    scan();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();