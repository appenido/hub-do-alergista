// Diario UAS7: backend de dados sensiveis isolado do Hub publico.
// Tokens independentes de 256 bits, armazenados apenas como hashes SHA-256.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";
const APP_ORIGINS = new Set(["https://hubdoalergista.pages.dev"]);
const TZ = "America/Sao_Paulo";
function cors(origin) {
  return {
    "Access-Control-Allow-Origin": APP_ORIGINS.has(origin) ? origin : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, apikey",
    "Vary": "Origin",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  };
}
function send(origin, status, data) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors(origin), "Content-Type": "application/json; charset=utf-8" } });
}
const validToken = (t) => typeof t === "string" && /^[0-9a-f]{64}$/.test(t);
const randomToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
async function sha(t) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
function dateInBrazil() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone:TZ, year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(new Date()).map(x => [x.type,x.value]));
  return p.year+"-"+p.month+"-"+p.day;
}
const daysBetween = (a,b) => Math.round((Date.parse(b+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/86400000);
function adminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  let secret = "";
  try { secret = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}").default||""; } catch (_) { /* fallback */ }
  const key = secret||legacy;
  if (!url || !key) throw new Error("Configuração segura indisponível");
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
async function patientRow(db,token) {
  if (!validToken(token)) return null;
  const {data,error}=await db.from("uas7_acompanhamentos").select("*").eq("token_paciente_sha",await sha(token)).maybeSingle();
  if (error) throw error;
  return data;
}
async function doctorRow(db,token) {
  if (!validToken(token)) return null;
  const {data,error}=await db.from("uas7_acompanhamentos").select("*").eq("token_profissional_sha",await sha(token)).maybeSingle();
  if (error) throw error;
  return data;
}
async function entries(db,id) {
  const {data,error}=await db.from("uas7_respostas_diarias").select("data_ref,papulas,prurido,registrado_em").eq("acompanhamento_id",id).order("data_ref",{ascending:true});
  if (error) throw error;
  return (data||[]).map(x=>({data:x.data_ref,papulas:x.papulas,prurido:x.prurido,pontos:x.papulas+x.prurido}));
}
function stats(row,list) {
  const hoje=dateInBrazil();
  const dias=row.inicio_em ? daysBetween(row.inicio_em,hoje)+1:0;
  const complete=row.inicio_em && list.length===7 && list.every((x,i)=>daysBetween(row.inicio_em,x.data)===i);
  return {hoje,inicio:row.inicio_em||null,diaAtual:row.inicio_em?Math.max(1,dias):null,
    registros:list,respondidos:list.length,parcial:list.reduce((n,x)=>n+x.pontos,0),
    completo:!!complete,total:complete?list.reduce((n,x)=>n+x.pontos,0):null,
    encerrado:!!row.inicio_em && dias>7, expiraEm:row.expira_link_paciente_em};
}
function clean(s,max) {
  return typeof s==="string"?s.replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max):"";
}
Deno.serve(async req => {
  const origin=req.headers.get("Origin")||"";
  if (!APP_ORIGINS.has(origin)) return send(origin,403,{erro:"Origem não autorizada."});
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:cors(origin)});
  if(req.method!=="POST")return send(origin,405,{erro:"Método inválido."});
  try {
    const raw=await req.text();
    if(raw.length>4096)return send(origin,413,{erro:"Envio muito grande."});
    let body;try{body=JSON.parse(raw);}catch(_){return send(origin,400,{erro:"Dados inválidos."});}
    if(!body || typeof body!=="object" || Array.isArray(body)) return send(origin,400,{erro:"Dados inválidos."});
    const db=adminClient(), action=body.action;
    if(action==="create"){
      const tokenPaciente=randomToken(),tokenProfissional=randomToken();
      const {error}=await db.from("uas7_acompanhamentos").insert({token_paciente_sha:await sha(tokenPaciente),token_profissional_sha:await sha(tokenProfissional)});
      if(error)throw error;
      return send(origin,200,{ok:true,tokenPaciente,tokenProfissional,expiraEmDias:45});
    }
    if(action==="patient-status"){
      const row=await patientRow(db,body.token);
      if(!row)return send(origin,404,{erro:"Link inválido."});
      if(Date.parse(row.expira_link_paciente_em)<Date.now())return send(origin,410,{erro:"Este link expirou. Solicite um novo acompanhamento."});
      const list=await entries(db,row.id);
      return send(origin,200,{ok:true,cadastrado:!!row.consentimento_em,...stats(row,list)});
    }
    if(action==="professional-status"){
      const row=await doctorRow(db,body.token);
      if(!row)return send(origin,404,{erro:"Acesso profissional inválido."});
      const list=await entries(db,row.id);
      return send(origin,200,{ok:true,paciente:row.nome?{nome:row.nome,idade:row.idade,cidade:row.cidade_origem}:null,
        criadoEm:row.criado_em,...stats(row,list)});
    }
    if(action==="submit"){
      const row=await patientRow(db,body.token);
      if(!row)return send(origin,404,{erro:"Link inválido."});
      if(Date.parse(row.expira_link_paciente_em)<Date.now())return send(origin,410,{erro:"Este link expirou."});
      const p=body.papulas, i=body.prurido;
      if(!Number.isInteger(p)||p<0||p>3||!Number.isInteger(i)||i<0||i>3)
        return send(origin,400,{erro:"Selecione uma opção válida para pápulas e prurido."});
      const hoje=dateInBrazil(), inicio=row.inicio_em||hoje, n=daysBetween(inicio,hoje);
      if(n<0||n>6)return send(origin,409,{erro:"O período de sete dias já terminou. Solicite um novo QR Code."});
      if(!row.consentimento_em){
        const nome=clean(body.nome,100),cidade=clean(body.cidade,100),idade=body.idade;
        if(nome.length<3||cidade.length<2||!Number.isInteger(idade)||idade<0||idade>120||body.consentimento!==true)
          return send(origin,400,{erro:"Informe nome, idade, cidade e confirme a autorização para o registro."});
        const {error}=await db.from("uas7_acompanhamentos").update({
          nome,idade,cidade_origem:cidade,consentimento_em:new Date().toISOString(),
          inicio_em:hoje,atualizado_em:new Date().toISOString()
        }).eq("id",row.id).is("consentimento_em",null);
        if(error)throw error;
      }
      const {error}=await db.from("uas7_respostas_diarias").insert({
        acompanhamento_id:row.id,data_ref:hoje,papulas:p,prurido:i
      });
      if(error){
        if(error.code==="23505")return send(origin,409,{erro:"A resposta de hoje já foi registrada. Volte amanhã à noite."});
        throw error;
      }
      const list=await entries(db,row.id);
      return send(origin,200,{ok:true,registradoHoje:true,...stats({...row,inicio_em:inicio},list)});
    }
    if(action==="delete"){
      const row=await (validToken(body.token)?(body.tipo==="profissional"?doctorRow(db,body.token):patientRow(db,body.token)):Promise.resolve(null));
      if(!row)return send(origin,404,{erro:"Acesso inválido."});
      const {error}=await db.from("uas7_acompanhamentos").delete().eq("id",row.id);
      if(error)throw error;
      return send(origin,200,{ok:true,excluido:true});
    }
    return send(origin,400,{erro:"Operação desconhecida."});
  }catch(e){
    console.error("uas7 backend error",e instanceof Error?e.message:"failure");
    return send(origin,503,{erro:"Não foi possível salvar ou consultar os dados. Tente novamente."});
  }
});
