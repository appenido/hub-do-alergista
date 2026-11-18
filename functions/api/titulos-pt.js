// Tradução fiel dos títulos públicos de artigos e diretrizes para português brasileiro.
// Não recebe dados de pacientes; os textos originais seguem disponíveis no PubMed.
const ORIGIN='https://hubdoalergista.pages.dev';
const MAX_TITLES=10;
const MAX_TOTAL=4400;
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Vary':'Origin'};
const response=(value,status=200)=>Response.json(value,{status,headers});
const forbidden=/(?:\b\d{3}[. ]?\d{3}[. ]?\d{3}[- ]?\d{2}\b|\b\d{15}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:CPF|CNS|prontu[aá]rio)\s*[:#-]?\s*\S+)/i;
function numberTokens(value){
  return (String(value).match(/\d+(?:[.,]\d+)*/g)||[]).sort().join('|');
}
function valid(input,output){
  if(typeof output!=='string')return false;
  const pt=output.trim();
  return pt.length>=4 && pt.length<=Math.max(input.length*2.5,160) &&
    !/[<>]/.test(pt) && !forbidden.test(pt) &&
    numberTokens(input)===numberTokens(pt);
}
function likelyPortuguese(value){
  const t=String(value).toLowerCase();
  const pt=(t.match(/\b(?:de|do|da|dos|das|para|com|em|por|sobre|uma|um|entre|após|tratamento|diagnóstico|diretriz|recomendações|ensaio|estudo|alérgica|grave|terapia)\b/g)||[]).length;
  const en=/\b(?:the|with|of|for|after|among|study|trial|guideline|guidelines|randomized|clinical|management|diagnosis|treatment|patients|recommendations|efficacy|safety|outcomes|review)\b/.test(t);
  return (pt>=2&&!en)||(pt>=1&&!en&&/[ãõçáéíóú]/.test(t));
}
async function sha(source){
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('pt-v1\0'+source));
  return Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
}
async function lookup(ctx,source){
  if(!globalThis.caches?.default)return null;
  try{
    const url=new URL('/__titulos_pt_cache/'+await sha(source),ctx.request.url);
    const match=await caches.default.match(new Request(url.toString()));
    if(!match?.ok)return null;
    const obj=await match.json();
    return valid(source,obj.pt)?obj.pt:null;
  }catch(_){return null;}
}
async function store(ctx,source,pt){
  if(!globalThis.caches?.default)return;
  try{
    const url=new URL('/__titulos_pt_cache/'+await sha(source),ctx.request.url);
    const r=new Response(JSON.stringify({pt}),{headers:{
      'Content-Type':'application/json','Cache-Control':'public, max-age=2592000'
    }});
    ctx.waitUntil(caches.default.put(new Request(url.toString()),r));
  }catch(_){}
}
async function askAI(input,env){
  const key=env.GEMINI_API_KEY||env.GEMINI||env.GOOGLE_API_KEY;
  if(!key)throw new Error('Tradutor médico indisponível');
  const prompt=[
    'Traduza para o português brasileiro os títulos científicos enviados no JSON.',
    'Você atua como tradutor técnico de alergia e imunologia. Traduza TODOS os títulos sem resumir nem interpretar.',
    'Preserve os números exatamente (inclusive separadores decimais), nomes de fármacos, siglas, nomes de ensaios e nomes próprios.',
    'Não invente informações clínicas nem traduza DOI, PMID, doses, unidades ou símbolos.',
    'Sua resposta deve ser somente JSON com um array "titulos", na ordem de entrada, exatamente '+input.length+' elementos.',
    JSON.stringify({titulos:input})
  ].join('\n');
  const body=JSON.stringify({
    contents:[{role:'user',parts:[{text:prompt}]}],
    generationConfig:{temperature:0,maxOutputTokens:4096,responseMimeType:'application/json'}
  });
  for(const model of ['gemini-2.5-flash-lite','gemini-2.5-flash']){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),11500);
    try{
      const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+encodeURIComponent(key),{
        method:'POST',headers:{'Content-Type':'application/json'},body,signal:controller.signal
      });
      if(!r.ok){if([401,403].includes(r.status))break;continue;}
      const data=await r.json();
      const value=((((data.candidates||[])[0]||{}).content||{}).parts||[]).map(p=>p.text||'').join('').trim();
      const parsed=JSON.parse(value);
      if(Array.isArray(parsed.titulos)&&parsed.titulos.length===input.length)return parsed.titulos;
    }catch(_){}
    finally{clearTimeout(timer);}
  }
  throw new Error('Serviço temporariamente indisponível');
}
export async function onRequestOptions({request}){
  const origin=request.headers.get('Origin');
  if(origin && origin!==ORIGIN)return response({error:'Origem não autorizada'},403);
  return new Response(null,{status:204,headers:{
    ...headers,'Access-Control-Allow-Origin':ORIGIN,
    'Access-Control-Allow-Methods':'POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type',
    'Access-Control-Max-Age':'300'
  }});
}
export async function onRequestPost(ctx){
  const {request,env}=ctx;
  const origin=request.headers.get('Origin');
  if(origin&&origin!==ORIGIN)return response({error:'Origem não autorizada'},403);
  const referer=request.headers.get('Referer');
  if(referer){try{if(new URL(referer).origin!==ORIGIN)return response({error:'Referência inválida'},403);}catch(_){return response({error:'Referência inválida'},403);}}
  if(Number(request.headers.get('Content-Length')||0)>12000)return response({error:'Tamanho excedido'},413);
  let data;
  try{data=await request.json();}catch(_){return response({error:'JSON inválido'},400);}
  const titles=data?.titles;
  if(!Array.isArray(titles)||titles.length<1||titles.length>MAX_TITLES||
    titles.some(t=>typeof t!=='string'||t.length<4||t.length>440||forbidden.test(t))||
    titles.reduce((n,t)=>n+t.length,0)>MAX_TOTAL){
    return response({error:'Títulos inválidos'},400);
  }
  const results=new Array(titles.length).fill(null);
  const pending=[];
  for(let i=0;i<titles.length;i++){
    if(likelyPortuguese(titles[i])){results[i]=titles[i];continue;}
    const stored=await lookup(ctx,titles[i]);
    if(stored)results[i]=stored;else pending.push(i);
  }
  if(pending.length){
    let outputs;
    try{outputs=await askAI(pending.map(i=>titles[i]),env);}
    catch(_){return response({titles:results,error:'Tradução indisponível'},503);}
    for(let p=0;p<pending.length;p++){
      const i=pending[p];
      if(valid(titles[i],outputs[p])&&likelyPortuguese(outputs[p])){
        results[i]=outputs[p].trim();
        await store(ctx,titles[i],results[i]);
      }
    }
  }
  return response({titles:results,locale:'pt-BR'});
}
