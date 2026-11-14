// Tradução de textos públicos do Hub do Alergista.
// Não encaminhar campos de formulário, dados de pacientes ou texto livre.
// Somente frases existentes no catálogo público versionado são traduzidas.
const ORIGEM='https://hubdoalergista.pages.dev';
const LANGS=new Set(['en','es']);
const MAX_ITEMS=24;
const MAX_CHARS=8500;
let catalogPromise;
let catalogReadAt=0;
const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{
  status,headers:{
    'Content-Type':'application/json; charset=utf-8',
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
  return (text.match(/\d+(?:[.,]\d+)*/g)||[]).sort().join('|');
}
function safeTranslation(source,translated){
  if(typeof translated!=='string')return false;
  const t=translated.trim();
  return !!t && t.length<Math.max(120,source.length*3) &&
    numbers(source)===numbers(t) &&
    !/<(?:script|style|iframe)\b/i.test(t) &&
    !hasIdentifier(t);
}
// Atualizar o catálogo sem depender de reiniciar o Worker.
async function readCatalog(request,env){
  if(!catalogPromise||Date.now()-catalogReadAt>3600000){
    catalogReadAt=Date.now();
    catalogPromise=(async()=>{
      if(!env.ASSETS)throw Error('Public assets unavailable');
      async function asset(path){
        const u=new URL(path,request.url);
        const r=await env.ASSETS.fetch(new Request(u.toString(),{method:'GET'}));
        if(!r.ok)throw Error('Public asset unavailable: '+path);
        return r.json();
      }
      const j=await asset('/data/hub-i18n-catalog.json');
      if(!j||!Array.isArray(j.strings))throw Error('Catalog invalid');
      const allowed=new Set(j.strings);
      // Atualizações editoriais diárias também entram no catálogo permitido.
      function insertLeaves(value){
        if(typeof value==='string'){
          const normalized=value.replace(/\s+/g,' ').trim();
          if(normalized.length>=3&&normalized.length<=1600)allowed.add(normalized);
        }else if(Array.isArray(value)){value.forEach(insertLeaves);}
        else if(value&&typeof value==='object'){Object.values(value).forEach(insertLeaves);}
      }
      for(const path of ['/data/uptodate.json','/data/hub-novidades.json']){
        try{insertLeaves(await asset(path));}catch(_){}
      }
      return allowed;
    })().catch(e=>{catalogPromise=null;throw e;});
  }
  return catalogPromise;
}
async function fingerprint(target,s){
  const buffer=new TextEncoder().encode(target+'\u0000'+s);
  const digest=await crypto.subtle.digest('SHA-256',buffer);
  return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
}
async function fromCache(request,target,source){
  if(typeof caches==='undefined'||!caches.default)return null;
  const digest=await fingerprint(target,source);
  const url=new URL('/__translation_cache/'+target+'/'+digest,request.url);
  try{
    const res=await caches.default.match(new Request(url.toString()));
    if(res&&res.ok){
      const obj=await res.json();
      if(safeTranslation(source,obj.translation))return obj.translation;
    }
  }catch(_){}
  return null;
}
async function toCache(request,target,source,translation,ctx){
  if(typeof caches==='undefined'||!caches.default)return;
  try{
    const digest=await fingerprint(target,source);
    const url=new URL('/__translation_cache/'+target+'/'+digest,request.url);
    const cacheResponse=new Response(JSON.stringify({translation}),{
      headers:{'Content-Type':'application/json','Cache-Control':'public, max-age=2592000'}
    });
    ctx.waitUntil(caches.default.put(new Request(url.toString()),cacheResponse));
  }catch(_){}
}
async function translateBatch(items,target,env){
  const key=env.GEMINI_API_KEY||env.GEMINI||env.GOOGLE_API_KEY;
  if(!key)throw Error('Serviço de tradução não configurado.');
  const language=target==='en'?'inglês':'espanhol';
  const prompt=[
    'Você é tradutor médico profissional, especializado em alergia e imunologia.',
    'Traduza os valores da lista JSON do português brasileiro para '+language+'.',
    'Traduza a totalidade do conteúdo clínico fielmente, sem resumir, criar ou reinterpretar condutas.',
    'Conserve absolutamente todos os números (inclusive vírgula ou ponto decimal), doses, intervalos, unidades, porcentagens, nomes comerciais, siglas, DOI, URLs e referências. Mantenha a ordem.',
    'Mantenha siglas clínicas consagradas quando necessário. Não acrescente explicações.',
    'O conteúdo é informativo; traduza literalmente sem decidir condutas médicas.',
    'Responda APENAS como JSON válido: {"traducoes":["tradução 1","tradução 2",...]}',
    'Dados de entrada: '+JSON.stringify(items)
  ].join('\n');
  const body=JSON.stringify({
    contents:[{role:'user',parts:[{text:prompt}]}],
    generationConfig:{temperature:0,maxOutputTokens:8192,responseMimeType:'application/json'}
  });
  for(const model of ['gemini-2.5-flash-lite','gemini-2.5-flash']){
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),13000);
    try{
      const res=await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+encodeURIComponent(key),
        {method:'POST',headers:{'Content-Type':'application/json'},body,signal:controller.signal}
      );
      if(!res.ok){if([400,401,403].includes(res.status))break;continue;}
      const data=await res.json();
      const result=((((data.candidates||[])[0]||{}).content||{}).parts||[]).map(x=>x.text||'').join('').trim();
      if(!result)continue;
      const json=JSON.parse(result);
      if(Array.isArray(json.traducoes)&&json.traducoes.length===items.length)return json.traducoes;
    }catch(_){}
    finally{clearTimeout(timeout);}
  }
  throw Error('Tradução temporariamente indisponível.');
}
export async function onRequestOptions({request}){
  if(request.headers.get('Origin')&&request.headers.get('Origin')!==ORIGEM)return reply({error:'Origem não autorizada'},403);
  return new Response(null,{status:204,headers:{
    'Access-Control-Allow-Origin':ORIGEM,
    'Access-Control-Allow-Methods':'POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type',
    'Access-Control-Max-Age':'300'
  }});
}
export async function onRequestPost(context){
  const {request,env}=context;
  const origin=request.headers.get('Origin');
  if(origin&&origin!==ORIGEM)return reply({error:'Origem não autorizada'},403);
  const referer=request.headers.get('Referer');
  if(referer){try{if(new URL(referer).origin!==ORIGEM)return reply({error:'Referência não autorizada'},403);}catch(_){return reply({error:'Referência inválida'},403);}}
  if(Number(request.headers.get('Content-Length')||0)>15000)return reply({error:'Requisição muito extensa'},413);
  let data;
  try{data=await request.json();}catch(_){return reply({error:'JSON inválido'},400);}
  const {language,texts}=data||{};
  if(!LANGS.has(language)||!Array.isArray(texts)||!texts.length||texts.length>MAX_ITEMS||
     texts.some(s=>typeof s!=='string'||!s.trim()||s.length>1600||
      hasIdentifier(s))||
     texts.reduce((n,s)=>n+s.length,0)>MAX_CHARS)
    return reply({error:'Parâmetros inválidos ou conteúdo não permitido'},400);
  let allowed;
  try{allowed=await readCatalog(request,env);}catch(_){return reply({error:'Catálogo indisponível'},503);}
  if(texts.some(s=>!allowed.has(s)))return reply({error:'Somente conteúdo público catalogado pode ser traduzido'},422);
  const translations=new Array(texts.length).fill(null);
  const missing=[];
  for(let i=0;i<texts.length;i++){
    const cached=await fromCache(request,language,texts[i]);
    if(cached)translations[i]=cached;else missing.push(i);
  }
  if(missing.length){
    let returned;
    try{returned=await translateBatch(missing.map(i=>texts[i]),language,env);}
    catch(_){return reply({translations,error:'Serviço de tradução temporariamente indisponível'},503);}
    for(let n=0;n<missing.length;n++){
      const i=missing[n],translated=returned[n];
      if(safeTranslation(texts[i],translated)){
        translations[i]=translated.trim();
        await toCache(request,language,texts[i],translations[i],context);
      }
    }
  }
  return reply({translations,language});
}