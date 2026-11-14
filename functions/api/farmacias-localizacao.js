// Cloudflare Pages: informação aproximada de cidade/UF, sem GPS nem IP no payload.
export async function onRequestGet({request}) {
  const cf = request.cf || {};
  const uf = String(cf.regionCode || '').toUpperCase();
  const city = String(cf.city || '').slice(0,100);
  const lat = Number(cf.latitude), lon = Number(cf.longitude);
  const valid = Number.isFinite(lat) && Number.isFinite(lon) && lat >= -34 && lat <= 6 && lon >= -74 && lon <= -32;
  const inBrazil = String(cf.country || '').toUpperCase() === 'BR';
  return new Response(JSON.stringify({
    city: inBrazil && /^[A-Z]{2}$/.test(uf) ? city : '',
    uf: inBrazil && /^[A-Z]{2}$/.test(uf) ? uf : '',
    lat: inBrazil && valid ? Math.round(lat*10000)/10000 : null,
    lon: inBrazil && valid ? Math.round(lon*10000)/10000 : null,
    accuracy: 'aproximada',
    source: 'Cloudflare'
  }), {headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}