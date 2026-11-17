// Hub do Alergista — relay QR com recuperação privada do último envio (até 7 dias).
const SB = Deno.env.get("SUPABASE_URL") || "";
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const allowed = "https://hubdoalergista.pages.dev";
const scores: Record<string, {count:number,min:number,max:number,step:number}> = {
  act:{count:5,min:0,max:4,step:1},uct:{count:4,min:0,max:4,step:1},
  dlqi:{count:10,min:0,max:3,step:1},snot22:{count:22,min:0,max:5,step:1},
  vasolfato:{count:1,min:0,max:10,step:0.1},
  vasprurido:{count:1,min:0,max:10,step:0.1}
};
const bytes = new TextEncoder();
let keyPromise: Promise<CryptoKey>|undefined;
function key(){return keyPromise ||= crypto.subtle.importKey("raw",bytes.encode(SERVICE),{name:"HMAC",hash:"SHA-256"},false,["sign"]);}
async function mac(value:string){const data=new Uint8Array(await crypto.subtle.sign("HMAC",await key(),bytes.encode(value)));return Array.from(data).map(b=>b.toString(16).padStart(2,"0")).join("");}
function equals(a:string,b:string){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++) x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0;}
function random(){return Array.from(crypto.getRandomValues(new Uint8Array(24))).map(x=>x.toString(16).padStart(2,"0")).join("");}
function cors(req:Request){const o=req.headers.get("origin");return {"Access-Control-Allow-Origin":o===allowed?allowed:"null","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"authorization,apikey,content-type","Cache-Control":"no-store","Vary":"Origin","Content-Type":"application/json; charset=utf-8","Referrer-Policy":"no-referrer"};}
function result(req:Request,data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:cors(req)});}
Deno.serve(async req=>{
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:cors(req)});
  if(req.method!=="POST")return result(req,{error:"Método inválido."},405);
  if(!SB||!SERVICE)return result(req,{error:"Serviço não configurado."},503);
  const contentLength=Number(req.headers.get("content-length")||0);
  if(contentLength>5000)return result(req,{error:"Dados excedem o limite."},413);
  let body:any;
  try{body=await req.json();}catch{return result(req,{error:"JSON inválido."},400);}
  if(!body||typeof body!=="object")return result(req,{error:"Requisição inválida."},400);
  if(body.action==="create"){
    const score=String(body.score||"");
    if(!scores[score])return result(req,{error:"Score desconhecido."},400);
    // Formulário QR não exige login/cadastro de paciente ou profissional.
    // A sessão é um segredo efêmero de alta entropia; nenhum nome, CPF ou histórico é coletado.
    // A origem do navegador é verificada para impedir criação cross-site não autorizada.
    const origin=req.headers.get("origin")||"";
    if(origin && origin!==allowed)return result(req,{error:"Origem não autorizada."},403);
    const timestamp=Math.floor(Date.now()/1000);
    const fragment=score+"."+timestamp+"."+random();
    const token=fragment+"."+await mac("submit:"+fragment);
    const topic="score-qr-"+(await mac("receive:"+token)).slice(0,48);
    // Limpeza oportunística dos resultados expirados; leitura já bloqueada após 7 dias.
    try{await fetch(SB+"/rest/v1/score_qr_last_deliveries?expires_at=lt."+
      encodeURIComponent(new Date().toISOString()),{method:"DELETE",
      headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE}});}catch(_){}
    return result(req,{token,topic,score,readSecret:await mac("read:"+token),expiresAt:(timestamp+900)*1000});
  }
  if(body.action==="status"){
    // Segredo de leitura entregue somente ao navegador do profissional no momento da criação.
    // O token público do QR permite responder, mas não permite recuperar as respostas.
    const token=String(body.token||"");
    const secret=String(body.readSecret||"");
    const parts=token.split(".");
    if(parts.length!==4||token.length>200||!scores[parts[0]]||
       !/^\d{10}$/.test(parts[1])||!/^[a-f0-9]{48}$/.test(parts[2])||
       !/^[a-f0-9]{64}$/.test(parts[3])||!/^[a-f0-9]{64}$/.test(secret))
      return result(req,{error:"Sessão inválida."},400);
    const age=Math.floor(Date.now()/1000)-Number(parts[1]);
    if(age < -60 || age > 7*86400+900)return result(req,{ok:true,found:false,expired:true});
    if(!equals(await mac("submit:"+parts.slice(0,3).join(".")),parts[3])||
       !equals(await mac("read:"+token),secret))return result(req,{error:"Acesso não autorizado."},403);
    const topic="score-qr-"+(await mac("receive:"+token)).slice(0,48);
    const lookup=await fetch(SB+"/rest/v1/score_qr_last_deliveries?topic=eq."+
      encodeURIComponent(topic)+"&select=score,values,total,received_at,expires_at&limit=1",{
      headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE,"Accept":"application/json"},
      cache:"no-store"
    });
    if(!lookup.ok)return result(req,{error:"Falha temporária ao recuperar resposta."},503);
    const rows=await lookup.json();
    const row=Array.isArray(rows)?rows[0]:null;
    if(!row||Date.parse(row.expires_at)<=Date.now())return result(req,{ok:true,found:false});
    return result(req,{ok:true,found:true,payload:{
      score:row.score,values:row.values,total:Number(row.total),submittedAt:row.received_at
    }});
  }
  if(body.action==="submit"){
    const token=String(body.token||"");
    const parts=token.split(".");
    if(parts.length!==4||token.length>200||!scores[parts[0]]||!/^\d{10}$/.test(parts[1])||! /^[a-f0-9]{48}$/.test(parts[2])||! /^[a-f0-9]{64}$/.test(parts[3]))return result(req,{error:"QR inválido."},400);
    const [score,ts]=parts;
    const age=Math.floor(Date.now()/1000)-Number(ts);
    if(age< -60||age>900)return result(req,{error:"QR expirado. Solicite outro código ao médico."},410);
    const verified=await mac("submit:"+parts.slice(0,3).join("."));
    if(!equals(verified,parts[3]))return result(req,{error:"QR inválido."},403);
    const rule=scores[score], val=body.values;
    if(!Array.isArray(val)||val.length!==rule.count)return result(req,{error:"Responda a todas as perguntas."},422);
    const valid=val.every((v:any)=>typeof v==="number" && Number.isFinite(v)&&v>=rule.min&&v<=rule.max&&Math.abs(v/rule.step-Math.round(v/rule.step))<1e-7);
    if(!valid)return result(req,{error:"Valores fora da escala permitida."},422);
    const total=score==="act"?val.reduce((s:number,v:number)=>s+v+1,0):val.reduce((s:number,v:number)=>s+v,0);
    const max=({act:25,uct:16,dlqi:30,snot22:110,vasolfato:10,vasprurido:10} as Record<string,number>)[score];
    const topic="score-qr-"+(await mac("receive:"+token)).slice(0,48);
    // Persiste antes do broadcast, inclusive quando o médico saiu da página.
    // A tabela tem RLS e nenhum privilégio de acesso para clientes públicos.
    const timestampNow=new Date().toISOString();
    const saved=await fetch(SB+"/rest/v1/score_qr_last_deliveries?on_conflict=topic",{
      method:"POST",
      headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE,
        "Content-Type":"application/json","Prefer":"resolution=merge-duplicates,return=minimal"},
      body:JSON.stringify({topic,score,values:val,total,received_at:timestampNow,
        expires_at:new Date(Date.now()+7*86400000).toISOString()})
    });
    if(!saved.ok)return result(req,{error:"Não foi possível guardar as respostas para entrega. Tente novamente."},503);
    const delivery=await fetch(SB+"/realtime/v1/api/broadcast/"+encodeURIComponent(topic)+"/events/score-result?private=false",{
      method:"POST",
      headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE,"Content-Type":"application/json"},
      body:JSON.stringify({score,values:val,total,max,submittedAt:timestampNow})
    });
    // Mesmo sem canal conectado, o profissional receberá o último resultado ao retornar.
    return result(req,{ok:true,score,total,max,deliveredRealtime:delivery.ok});
  }
  return result(req,{error:"Ação não reconhecida."},400);
});