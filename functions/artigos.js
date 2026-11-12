import { ARTICLE_SCHEMA, ARTICLE_TOPICS, buildArticleQuery, normalizeArticle } from '../artigos-core.mjs';

const BASE='https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const HEADERS={'Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function pubmed(path,params) {
  const body=new URLSearchParams({db:'pubmed',retmode:'json',tool:'HubDoAlergista',...params});
  for(let attempt=0;attempt<3;attempt++) {
    try {
      const response=await fetch(BASE+path,{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},
        body,signal:AbortSignal.timeout(15000)
      });
      if([429,502,503,504].includes(response.status) && attempt<2) {
        await sleep(900*(attempt+1));continue;
      }
      if(!response.ok) throw new Error('PubMed HTTP '+response.status);
      const json=await response.json();
      if(json.error) throw new Error('PubMed: resposta inválida');
      return json;
    } catch(error) {
      if(attempt===2 || !/fetch|abort|timed out|429|502|503|504/i.test(String(error?.message||error))) throw error;
      await sleep(900*(attempt+1));
    }
  }
  throw new Error('PubMed indisponível');
}
function json(data,status=200,cache='no-store'){
  return new Response(JSON.stringify(data),{
    status,headers:{...HEADERS,'Cache-Control':cache}
  });
}
function dateBR(){
  return new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
}
function startDate(today,days) {
  if(!days)return '';
  const d=new Date(today+'T12:00:00Z');
  d.setUTCDate(d.getUTCDate()-days);
  return d.toISOString().slice(0,10);
}
export async function onRequestGet(context){
  const u=new URL(context.request.url);
  const topic=u.searchParams.get('tema')||'todos';
  const q=String(u.searchParams.get('q')||'').trim().slice(0,120);
  const days=Number(u.searchParams.get('dias')||'365');
  const fresh=u.searchParams.get('forcar')==='1';
  if(!ARTICLE_TOPICS[topic] || ![0,30,90,365,1095].includes(days))
    return json({erro:'Filtro inválido'},400);
  const today=dateBR();
  const from=startDate(today,days);
  const now=new Date().toISOString();
  const cache=globalThis.caches?.default;
  const canCache=!q && !fresh;
  const cacheURL=new URL(u.origin+u.pathname);
  cacheURL.search=new URLSearchParams({
    schema:String(ARTICLE_SCHEMA),tema:topic,dias:String(days),dia:today
  }).toString();
  const cacheRequest=new Request(cacheURL);
  if(canCache && cache){
    const hit=await cache.match(cacheRequest);
    if(hit)return hit;
  }
  try{
    const params={term:buildArticleQuery(topic,q),sort:'pub_date',retmax:'80',
      datetype:'pdat',maxdate:today.replaceAll('-','/')};
    if(from)params.mindate=from.replaceAll('-','/');
    const found=await pubmed('esearch.fcgi',params);
    if(!Array.isArray(found.esearchresult?.idlist))throw new Error('ESearch sem IDs');
    const ids=[...new Set(found.esearchresult.idlist.map(String))].filter(x=>/^[1-9]\d{0,8}$/.test(x));
    let details={result:{}};
    if(ids.length){
      await sleep(375);
      details=await pubmed('esummary.fcgi',{id:ids.join(',')});
      if(!details.result)throw new Error('ESummary sem registros');
    }
    const seen=new Set();
    const articles=ids.map(id=>normalizeArticle(details.result[id],id,today,topic))
      .filter(Boolean)
      .filter(a=>!from || a.date>=from)
      .filter(a=>{const key=a.doi||a.pmid;if(seen.has(key))return false;seen.add(key);return true;})
      .sort((a,b)=>b.date.localeCompare(a.date)||b.pmid.localeCompare(a.pmid))
      .slice(0,20);
    const response=json({
      schema:ARTICLE_SCHEMA,source:'PubMed',topic,query:q,days,
      updatedAt:now,periodStart:from,periodEnd:today,total:articles.length,
      artigos:articles
    },200,canCache?'public, max-age=0, s-maxage=3600':'no-store');
    if(canCache && cache)context.waitUntil(cache.put(cacheRequest,response.clone()));
    return response;
  }catch(error){
    console.warn('Artigos PubMed:',String(error?.message||error).slice(0,160));
    return json({schema:ARTICLE_SCHEMA,source:'PubMed',topic,updatedAt:null,
      artigos:[],erro:'Não foi possível consultar publicações atualizadas no PubMed. Tente novamente.'},503);
  }
}
