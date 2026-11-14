// Cloudflare Pages: integração opcional com fornecedor licenciado de preços.
// Nunca transforma PMC/CMED em preço de balcão. Nenhuma integração = sem preços.
const respond = (data, status=200) => new Response(JSON.stringify(data), {
  status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
});
const clean = (value, max=120) => String(value || '').trim().slice(0,max);
export async function onRequestPost({request,env}) {
  if (!/^application\/json/i.test(request.headers.get('content-type') || '')) return respond({error:'Formato inválido'},415);
  let payload;
  try { payload = await request.json(); } catch (_) { return respond({error:'JSON inválido'},400); }
  const medication = clean(payload.medication);
  const city = clean(payload.city,100);
  const uf = clean(payload.uf,2).toUpperCase();
  if (medication.length < 3 || !/^[\p{L}\p{N}\s+.,\-®()/%]+$/u.test(medication) ||
      (uf && !/^[A-Z]{2}$/.test(uf))) return respond({error:'Consulta inválida'},400);
  if (!env.HUB_PRECOS_API_URL || !env.HUB_PRECOS_API_KEY)
    return respond({offers:[],configured:false,provider:null});
  let endpoint;
  try { endpoint = new URL(env.HUB_PRECOS_API_URL); } catch (_) { return respond({offers:[],configured:false}); }
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) return respond({offers:[],configured:false});
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let upstream;
    try {
      upstream = await fetch(endpoint.toString(), {
        method:'POST',headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer '+env.HUB_PRECOS_API_KEY,
          'Accept':'application/json'
        },
        body:JSON.stringify({medication,city,uf}),
        signal:controller.signal
      });
    } finally { clearTimeout(timer); }
    if (!upstream.ok) return respond({offers:[],configured:true});
    const json=await upstream.json();
    const offers=Array.isArray(json.offers)?json.offers.slice(0,40).filter(o=>{
      try {
        const url=new URL(o.url);
        return url.protocol==='https:' && url.username==='' && url.password==='' &&
          o.verified===true && Number(o.price)>0 && Number.isFinite(Number(o.price)) &&
          !!clean(o.presentation,250) && !!clean(o.pharmacy,120);
      } catch (_) {return false;}
    }).map(o=>({
      pharmacy:clean(o.pharmacy),presentation:clean(o.presentation,250),
      price:Number(o.price),currency:'BRL',verified:true,
      ean:/^\d{8,14}$/.test(clean(o.ean,14))?clean(o.ean,14):'',
      updatedAt:clean(o.updatedAt,40),url:new URL(o.url).toString()
    })):[];
    return respond({offers,configured:true,provider:clean(json.provider || 'parceiro autorizado',80)});
  } catch (_) { return respond({offers:[],configured:true}); }
}