// Compatibilidade com versões instaladas que ainda consultam esta rota.
const ORIGEM='https://hubdoalergista.pages.dev';
const LANGS=new Set(['en','es']);
const MAX_ITEMS=24;
const MAX_CHARS=8500;
const reply=(obj,status=200)=>Response.json(obj,{
  status,headers:{
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'no-referrer',
    'Vary':'Origin'
  }
});
function hasIdentifier(value){
  return /(?:\b\d{3}[. ]?\d{3}[. ]?\d{3}[- ]?\d{2}\b|\b\d{15}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:CPF|RG|CNS|prontu[aá]rio|nome completo)\s*[:#-]?\s*\S+|\b(?:\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[- ]?\d{4}\b)/i.test(value);
}
function numbers(text){
  return (text.match(/\d+(?:[.,]\d+)*/g)||[]).join('|');
}
function safeTranslation(source,translated){
  return typeof translated==='string' && !!translated.trim() &&
    numbers(source)===numbers(translated) && !/<(?:script|style|iframe)\b/i.test(translated) &&
    !hasIdentifier(translated);
}
export async function onRequestOptions({request}){
  const origin=request.headers.get('Origin');
  if(origin&&origin!==ORIGEM)return reply({error:'Origem não autorizada'},403);
  return new Response(null,{status:204,headers:{
    'Access-Control-Allow-Origin':ORIGEM,
    'Access-Control-Allow-Methods':'POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type',
    'Access-Control-Max-Age':'300'
  }});
}
export async function onRequestPost({request,env}){
  const origin=request.headers.get('Origin');
  if(origin&&origin!==ORIGEM)return reply({error:'Origem não autorizada'},403);
  const referer=request.headers.get('Referer');
  if(referer){
    try{if(new URL(referer).origin!==ORIGEM)return reply({error:'Referência não autorizada'},403);}
    catch(_){return reply({error:'Referência inválida'},403);}
  }
  if(Number(request.headers.get('Content-Length')||0)>15000)return reply({error:'Requisição muito extensa'},413);
  let body;
  try{body=await request.json();}catch(_){return reply({error:'JSON inválido'},400);}
  const {language,texts}=body||{};
  if(!LANGS.has(language)||!Array.isArray(texts)||!texts.length||texts.length>MAX_ITEMS||
     texts.some(s=>typeof s!=='string'||!s.trim()||s.length>1600||hasIdentifier(s))||
     texts.reduce((n,s)=>n+s.length,0)>MAX_CHARS){
    return reply({error:'Parâmetros inválidos ou conteúdo não permitido'},400);
  }
  try{
    const path=new URL('/data/hub-i18n-'+language+'.json',request.url);
    const response=await env.ASSETS.fetch(new Request(path));
    if(!response.ok)throw new Error('Catálogo indisponível');
    const catalog=await response.json();
    const translations=texts.map(source=>{
      const text=Object.hasOwn(catalog,source)?catalog[source]:null;
      return safeTranslation(source,text)?text:null;
    });
    return reply({language,translations});
  }catch(_){
    return reply({error:'Catálogo indisponível'},503);
  }
}
