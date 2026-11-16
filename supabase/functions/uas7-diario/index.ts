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
  // PostgREST limita respostas por página: paginar para preservar todas as semanas.
  const all=[];
  for(let from=0; from<20000; from+=500) {
    const {data,error}=await db.from("uas7_respostas_diarias")
      .select("data_ref,papulas,prurido,registrado_em")
      .eq("acompanhamento_id",id).order("data_ref",{ascending:true}).range(from,from+499);
    if(error)throw error;
    all.push(...(data||[]));
    if(!data||data.length<500)break;
  }
  return all.map(x=>({data:x.data_ref,papulas:x.papulas,prurido:x.prurido,pontos:x.papulas+x.prurido}));
}
function addDays(date,n) {
  const d=new Date(date+"T12:00:00Z");
  d.setUTCDate(d.getUTCDate()+n);
  return d.toISOString().slice(0,10);
}
function stats(row,list) {
  // Semanas fixas de 7 dias, ancoradas na primeira resposta, mesmo se houver lacunas.
  const hoje=dateInBrazil(),inicio=row.inicio_em||null;
  const elapsed=inicio?Math.max(0,daysBetween(inicio,hoje)):0;
  const semanaAtual=inicio?Math.floor(elapsed/7)+1:1;
  const diaAtual=inicio?(elapsed%7)+1:1;
  const semanas=[];
  for(let i=0;i<semanaAtual;i++){
    const semanaInicio=inicio?addDays(inicio,i*7):null;
    const semanaFim=semanaInicio?addDays(semanaInicio,6):null;
    const respostas=semanaInicio?list.filter(x=>x.data>=semanaInicio&&x.data<=semanaFim):[];
    const completo=respostas.length===7&&respostas.every((x,j)=>x.data===addDays(semanaInicio,j));
    const parcial=respostas.reduce((n,x)=>n+x.pontos,0);
    semanas.push({numero:i+1,inicio:semanaInicio,fim:semanaFim,respondidos:respostas.length,
      registros:respostas,parcial,completo,total:completo?parcial:null,
      encerrada:i+1<semanaAtual||i+1===semanaAtual&&diaAtual===7&&respostas.some(x=>x.data===hoje)});
  }
  const atual=semanas[semanas.length-1]||{};
  return {hoje,inicio,semanaAtual,diaAtual,semanaInicio:atual.inicio||null,semanaFim:atual.fim||null,
    registros:atual.registros||[],respondidos:atual.respondidos||0,parcial:atual.parcial||0,
    completo:!!atual.completo,total:atual.total??null,encerrado:false,
    todasAsRespostas:list,semanas,expiraEm:row.expira_link_paciente_em};
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
      return send(origin,200,{ok:true,tokenPaciente,tokenProfissional,expiraSemAtividadeEmDias:45});
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
      const hoje=dateInBrazil(), inicio=row.inicio_em||hoje;
      // O mesmo QR Code segue válido por semanas sucessivas; não há limite de sete dias.
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
      // Renovação deslizante: o link não expira enquanto o diário for usado periodicamente.
      const novoPrazo=new Date(Date.now()+45*86400000).toISOString();
      const {error:renewError}=await db.from("uas7_acompanhamentos")
        .update({expira_link_paciente_em:novoPrazo,atualizado_em:new Date().toISOString()})
        .eq("id",row.id);
      if(renewError)console.error("uas7 renewal failed",renewError.code);
      const list=await entries(db,row.id);
      return send(origin,200,{ok:true,registradoHoje:true,cadastrado:true,
        ...stats({...row,inicio_em:inicio,expira_link_paciente_em:renewError?row.expira_link_paciente_em:novoPrazo},list)});
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
