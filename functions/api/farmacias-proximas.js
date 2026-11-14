// Cloudflare Pages — farmácias geograficamente próximas.
// Opcional: GOOGLE_MAPS_PLACES_API_KEY (Google Places Nearby New).
// Sem chave: dados colaborativos OpenStreetMap/Overpass, com cache.
// Distância em linha reta. Não infere preço/estoque de medicamentos.
const json = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers: {
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff'
  }
});
const validCoord = (lat,lon) => Number.isFinite(lat) && Number.isFinite(lon) &&
  lat >= -34 && lat <= 6 && lon >= -74 && lon <= -32;
const haversineKm = (lat1,lon1,lat2,lon2) => {
  const rad=Math.PI/180, dLat=(lat2-lat1)*rad, dLon=(lon2-lon1)*rad;
  const s=Math.sin(dLat/2)**2+Math.cos(lat1*rad)*Math.cos(lat2*rad)*Math.sin(dLon/2)**2;
  return 12742*Math.asin(Math.min(1,Math.sqrt(s)));
};
const safe = (v,n=150) => String(v == null ? '' : v).trim().slice(0,n);
function normalize(rows,lat,lon,source) {
  const ids=new Set();
  return rows.filter(p=>p && Number.isFinite(p.lat) && Number.isFinite(p.lon))
    .map(p=>({...p, distanceKm: Math.round(haversineKm(lat,lon,p.lat,p.lon)*100)/100}))
    .filter(p=>p.distanceKm<=16 && p.name && !ids.has(p.id) && ids.add(p.id))
    .sort((a,b)=>a.distanceKm-b.distanceKm)
    .slice(0,15)
    .map(p=>({
      id:p.id, name:p.name, address:p.address || 'Endereço não informado',
      lat:p.lat,lon:p.lon,distanceKm:p.distanceKm,source,
      mapsUrl:p.mapsUrl ||
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(p.name+' '+(p.address||'')+' '+p.lat+','+p.lon)
    }));
}
async function googleNearby(lat,lon,key,signal) {
  const response=await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method:'POST',signal,
    headers:{
      'Content-Type':'application/json','X-Goog-Api-Key':key,
      'X-Goog-FieldMask':'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri'
    },
    body:JSON.stringify({
      includedTypes:['pharmacy'], maxResultCount:20,
      rankPreference:'DISTANCE',languageCode:'pt-BR',regionCode:'BR',
      locationRestriction:{circle:{center:{latitude:lat,longitude:lon},radius:12000}}
    })
  });
  if (!response.ok) throw new Error('Google Places indisponível');
  const parsed=await response.json();
  return normalize((parsed.places||[]).map(p=>({
    id:'google:'+safe(p.id,140),
    name:safe(p.displayName && p.displayName.text),
    address:safe(p.formattedAddress,250),
    lat:Number(p.location?.latitude),lon:Number(p.location?.longitude),
    mapsUrl:/^https:\/\/www\.google\.com\/maps\//.test(p.googleMapsUri||'')?p.googleMapsUri:null
  })),lat,lon,'Google Places');
}
async function overpassNearby(lat,lon,signal,env) {
  // Malha por ~1 km: cache compartilhado e nenhum GPS persistido.
  const gridLat=Math.round(lat*100)/100,gridLon=Math.round(lon*100)/100;
  const url='https://overpass-api.de/api/interpreter';
  const query='[out:json][timeout:12];(nwr["amenity"="pharmacy"](around:12000,'+gridLat+','+gridLon+'););out center 100;';
  const cacheKey='https://hub-osm-cache.invalid/nearby?lat='+gridLat+'&lon='+gridLon;
  const store=typeof caches!=='undefined' && caches.default ? caches.default : null;
  let raw=null;
  if (store) {
    try {
      const cached=await store.match(cacheKey);
      if (cached) raw=await cached.json();
    } catch (_) {}
  }
  if (!raw) {
    const response=await fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded; charset=utf-8',
        'Accept':'application/json',
        'User-Agent':'HubDoAlergista/1.0 (https://hubdoalergista.pages.dev/)'
      },
      body:'data='+encodeURIComponent(query),signal
    });
    if (!response.ok) throw new Error('Overpass indisponível');
    raw=await response.json();
    if (store && Array.isArray(raw.elements)) {
      try {
        const cacheResponse=new Response(JSON.stringify(raw),{
          headers:{'Content-Type':'application/json','Cache-Control':'public,max-age=900'}
        });
        // Cache aproximado independente da pessoa e sem posição exata.
        env?.context?.waitUntil?.(store.put(cacheKey,cacheResponse));
      } catch (_) {}
    }
  }
  const rows=(raw.elements||[]).map(o=>{
    const t=o.tags||{};
    const location=o.center||o;
    const street=[t['addr:street'],t['addr:housenumber']].filter(Boolean).join(', ');
    const district=t['addr:suburb']||t['addr:city']||'';
    const address=[street,district].filter(Boolean).join(' · ');
    return {
      id:'osm:'+o.type+'/'+o.id,
      name:safe(t.name || t.brand || 'Farmácia',140),
      address:safe(address,250),
      lat:Number(location.lat),lon:Number(location.lon)
    };
  });
  return normalize(rows,lat,lon,'OpenStreetMap');
}
export async function onRequestPost({request,env,context}) {
  if (!(request.headers.get('content-type')||'').includes('application/json')) return json({error:'Formato inválido'},415);
  let data;try {data=await request.json();} catch (_) {return json({error:'JSON inválido'},400);}
  const lat=Number(data?.lat),lon=Number(data?.lon);
  if (!validCoord(lat,lon)) return json({error:'Coordenadas inválidas'},400);
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),11500);
  try {
    if (env?.GOOGLE_MAPS_PLACES_API_KEY) {
      try {
        const stores=await googleNearby(lat,lon,env.GOOGLE_MAPS_PLACES_API_KEY,ctrl.signal);
        if (stores.length) return json({stores,source:'Google Places',distanceType:'linha reta',locationAccuracy: data.accuracy==='precise'?'precisa':'aproximada'});
      } catch (_) { /* passa para fonte comunitária */ }
    }
    const stores=await overpassNearby(lat,lon,ctrl.signal,{context});
    return json({stores,source:'OpenStreetMap',distanceType:'linha reta',locationAccuracy:data.accuracy==='precise'?'precisa':'aproximada'});
  } catch (_) {
    return json({stores:[],source:'indisponível',error:'Não foi possível consultar as farmácias agora.'});
  } finally {clearTimeout(timer);}
}