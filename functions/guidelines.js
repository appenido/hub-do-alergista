import { SCHEMA, TOPIC_IDS, searchQuery, normalizeRecord } from '../guidelines-core.mjs';

const BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
async function ncbi(path, params) {
  const url = new URL(path, BASE);
  Object.entries({db:'pubmed',retmode:'json',tool:'HubDoAlergista',...params}).forEach(([k,v]) => url.searchParams.set(k,v));
  const body = url.searchParams.toString();
  url.search = '';
  for (let attempt=0; attempt<3; attempt++) {
    const response = await fetch(url, {method:'POST',body,headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},signal:AbortSignal.timeout(18000)});
    if ([429,502,503,504].includes(response.status) && attempt<2) {
      const retryAfter=Number(response.headers.get('Retry-After'));
      await new Promise(resolve=>setTimeout(resolve,Math.min(3000,Math.max(1000*(attempt+1),(Number.isFinite(retryAfter)?retryAfter:0)*1000))));
      continue;
    }
    if (!response.ok) throw new Error('PubMed HTTP '+response.status);
    const json = await response.json();
    if (json.error && /rate limit/i.test(String(json.error)) && attempt<2) {
      await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
      continue;
    }
    if (json.error) throw new Error('Resposta PubMed inválida');
    return json;
  }
  throw new Error('PubMed indisponível');
}
const headers = {'Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
export async function onRequestGet(context) {
  const topic = new URL(context.request.url).searchParams.get('tema') || 'all';
  if (topic !== 'all' && !TOPIC_IDS.includes(topic)) return new Response(JSON.stringify({erro:'Tema inválido'}),{status:400,headers});
  const now = new Date();
  const today = now.toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
  const min = (Number(today.slice(0,4))-3) + today.slice(4);
  const cacheURL = new URL(context.request.url);
  cacheURL.search = new URLSearchParams({tema:topic,schema:String(SCHEMA),dia:today}).toString();
  const cacheRequest = new Request(cacheURL.toString());
  const cache = globalThis.caches?.default;
  const cached = cache && await cache.match(cacheRequest);
  if (cached) return cached;
  try {
    const search = await ncbi('esearch.fcgi', {retmax:'100',sort:'pub_date',datetype:'pdat',mindate:min.replace(/-/g,'/'),maxdate:today.replace(/-/g,'/'),term:searchQuery(topic)});
    if (!Array.isArray(search.esearchresult?.idlist)) throw new Error('Busca inválida');
    const ids = [...new Set(search.esearchresult.idlist.map(String))].filter(i => /^[1-9]\d{0,8}$/.test(i));
    const summary = ids.length ? await ncbi('esummary.fcgi',{id:ids.join(',')}) : {result:{}};
    if (!summary.result) throw new Error('Metadados ausentes');
    const seen = new Set();
    const itens = ids.map(id => normalizeRecord(summary.result[id],id,today)).filter(Boolean)
      .filter(i => i.date >= min && (topic === 'all' || i.topics.includes(topic)))
      .filter(i => {const key=(i.doi || i.pmid).toLowerCase();if(seen.has(key))return false;seen.add(key);return true;})
      .sort((a,b) => b.date.localeCompare(a.date) || b.pmid.localeCompare(a.pmid)).slice(0,50);
    const response = new Response(JSON.stringify({schema:SCHEMA,updatedAt:now.toISOString(),source:'PubMed',topic,itens}),{
      headers:{...headers,'Cache-Control':'public, max-age=3600, s-maxage=21600'}
    });
    if (cache) context.waitUntil(cache.put(cacheRequest,response.clone()));
    return response;
  } catch (error) {
    console.warn('Consulta PubMed indisponível:', String(error?.message || error));
    // Falha de busca nunca é preenchida com referências ou URLs sem correspondência.
    return new Response(JSON.stringify({schema:SCHEMA,source:'PubMed',topic,itens:[],erro:'Não foi possível consultar o PubMed agora.',diagnostico:String(error?.message||'Falha externa').slice(0,180)}),{status:503,headers:{...headers,'Cache-Control':'no-store'}});
  }
}
