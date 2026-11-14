// Hub do Alergista - consulta documental de interacoes sem modelos de IA.
// Fonte: openFDA Structured Product Labeling. NAO equivale a banco de DDI.
const HEADERS={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'Vary':'Origin'
};
const MEDSCAPE='https://reference.medscape.com/drug-interactionchecker';
// RxNorm identifica substancias; nao e uma base de interacoes medicamentosas.
const FONTES_OFICIAIS={
  fda:'https://open.fda.gov/apis/drug/label/',
  rxnorm:'https://rxnav.nlm.nih.gov/',
  ema:'https://www.ema.europa.eu/en/medicines',
  anvisa:'https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico'
};
const ALIASES={
  dupilumabe:'dupilumab',dupixent:'dupilumab',omalizumabe:'omalizumab',xolair:'omalizumab',
  mepolizumabe:'mepolizumab',nucala:'mepolizumab',benralizumabe:'benralizumab',
  tezepelumabe:'tezepelumab',tezspire:'tezepelumab',reslizumabe:'reslizumab',
  lebrikizumabe:'lebrikizumab',lebrizumabe:'lebrikizumab',nemolizumabe:'nemolizumab',
  depemoquimabe:'depemokimab',tralocinumabe:'tralokinumab',secukinumabe:'secukinumab',
  adalimumabe:'adalimumab',infliximabe:'infliximab',rituximabe:'rituximab',
  metotrexato:'methotrexate',ciclosporina:'cyclosporine',ciclosporin:'cyclosporine',
  prednisona:'prednisone',prednisolona:'prednisolone',metilprednisolona:'methylprednisolone',
  dexametasona:'dexamethasone',hidrocortisona:'hydrocortisone',
  tacrolimo:'tacrolimus',micofenolato:'mycophenolate',azatioprina:'azathioprine',
  tofacitinibe:'tofacitinib',baricitinibe:'baricitinib',upadacitinibe:'upadacitinib',
  abrocitinibe:'abrocitinib',remibrutinibe:'remibrutinib',ibrutinibe:'ibrutinib',
  loratadina:'loratadine',desloratadina:'desloratadine',cetirizina:'cetirizine',
  levocetirizina:'levocetirizine',fexofenadina:'fexofenadine',
  hidroxizina:'hydroxyzine',difenidramina:'diphenhydramine',bilastina:'bilastine',
  rupatadina:'rupatadine',montelucaste:'montelukast',omalizumab:'omalizumab',
  alopurinol:'allopurinol',fluconazol:'fluconazole',itraconazol:'itraconazole',
  voriconazol:'voriconazole',cetoconazol:'ketoconazole',claritromicina:'clarithromycin',
  azitromicina:'azithromycin',eritromicina:'erythromycin',amoxicilina:'amoxicillin',
  cefalexina:'cephalexin',ciprofloxacino:'ciprofloxacin',levofloxacino:'levofloxacin',
  sulfametoxazol:'sulfamethoxazole',trimetoprima:'trimethoprim',
  amiodarona:'amiodarone',digoxina:'digoxin',verapamil:'verapamil',
  diltiazem:'diltiazem',rifampicina:'rifampin',carbamazepina:'carbamazepine',
  fenitoina:'phenytoin',fenobarbital:'phenobarbital',valproato:'valproic acid',
  ibuprofeno:'ibuprofen',naproxeno:'naproxen',diclofenaco:'diclofenac',
  paracetamol:'acetaminophen',sinvastatina:'simvastatin',rosuvastatina:'rosuvastatin',
  atorvastatina:'atorvastatin',sertralina:'sertraline',fluoxetina:'fluoxetine',
  citalopram:'citalopram',escitalopram:'escitalopram',tramadol:'tramadol',
  omeprazol:'omeprazole',pantoprazol:'pantoprazole',colchicina:'colchicine'
};
const normalizar=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function saida(d,status=200){return new Response(JSON.stringify(d),{status,headers:HEADERS});}
function combinar(lista){return [...new Set((Array.isArray(lista)?lista:[]).flatMap(x=>typeof x==='string'?[x]:[]))];}
function nomeFDA(nome){const n=normalizar(nome);return ALIASES[n]||n;}
function compativel(nomes,ing,original){
  const opcoes=[normalizar(ing),normalizar(original)];
  return nomes.some(s=>{
    const v=normalizar(s);
    return opcoes.some(q=>q.length>2&&(v===q||v.startsWith(q+' ')||v.includes(' '+q+' ')));
  });
}
function textoSecao(x){return (Array.isArray(x)?x:[]).filter(z=>typeof z==='string').join('\n\n').trim();}
function filtrarBula(d,ing,original){
  const itens=Array.isArray(d?.results)?d.results:[];
  const candidatos=itens.filter(rec=>{
    const f=rec.openfda||{};
    return compativel([...combinar(f.generic_name),...combinar(f.brand_name),...combinar(f.substance_name)],ing,original);
  });
  candidatos.sort((a,b)=>{
    const aT=textoSecao(a.drug_interactions).length>0?1:0;
    const bT=textoSecao(b.drug_interactions).length>0?1:0;
    return (bT-aT)||String(b.effective_time||'').localeCompare(String(a.effective_time||''));
  });
  const rec=candidatos[0];
  if(!rec)return null;
  const f=rec.openfda||{};
  const secao=textoSecao(rec.drug_interactions);
  const id=String(rec.set_id||f.spl_set_id?.[0]||'');
  return {
    nome:combinar(f.generic_name)[0]||ing,
    marca:combinar(f.brand_name)[0]||'',
    atualizado:String(rec.effective_time||''),
    fonte:'openFDA / bula Structured Product Labeling',
    link:/^[a-f0-9-]{36}$/i.test(id)?
      'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid='+id:
      'https://labels.fda.gov/',
    secaoInteracoes:secao.slice(0,23000),
    secaoTruncada:secao.length>23000,
    temSecao:!!secao
  };
}

async function consultarRxNorm(nome){
  const ing=nomeFDA(nome);
  const termo=ing.replace(/[^a-z0-9 \-/]/g,'').slice(0,65).trim();
  if(!termo)return {status:'nao_identificado'};
  // Somente igualdade exata ou normalizada: nao inferir correspondencia aproximada.
  const url=new URL('https://rxnav.nlm.nih.gov/REST/rxcui.json');
  url.searchParams.set('name',termo);
  url.searchParams.set('search','2');
  url.searchParams.set('allsrc','0');
  async function obterJson(endpoint){
    const ac=new AbortController();
    const timer=setTimeout(()=>ac.abort(),6500);
    try{
      const resp=await fetch(endpoint,{signal:ac.signal,headers:{Accept:'application/json'}});
      if(!resp.ok)throw Error('HTTP '+resp.status);
      return await resp.json();
    }finally{clearTimeout(timer);}
  }
  try{
    const dados=await obterJson(url.toString());
    const ids=Array.isArray(dados?.idGroup?.rxnormId)?dados.idGroup.rxnormId:[];
    const id=String(ids[0]||'');
    if(!/^\d{1,12}$/.test(id))return {status:'nao_identificado'};
    let padronizado=termo, tipo='';
    try{
      const detalhes=await obterJson('https://rxnav.nlm.nih.gov/REST/rxcui/'+id+'/properties.json');
      padronizado=String(detalhes?.properties?.name||termo).slice(0,140);
      tipo=String(detalhes?.properties?.tty||'').slice(0,12);
    }catch(_){
      // O identificador permanece valido se a consulta dos detalhes falhar.
    }
    return {status:'identificado',rxcui:id,nomePadronizado:padronizado,tipo};
  }catch(_){return {status:'indisponivel'};}
}
async function consultarNome(nome,env){
  const ing=nomeFDA(nome);
  // Termos validos apenas; sem URL fornecida pelo usuario.
  const valor=ing.replace(/[^a-z0-9 \-/]/g,'').slice(0,65).trim();
  if(!valor)return {medicamento:nome,status:'nao_encontrado'};
  const cache=typeof caches!=='undefined'&&caches.default?caches.default:null;
  async function pesquisar(campo){
    const url=new URL('https://api.fda.gov/drug/label.json');
    url.searchParams.set('search',campo+':"'+valor+'"');
    url.searchParams.set('limit','15');
    if(env.OPENFDA_API_KEY)url.searchParams.set('api_key',env.OPENFDA_API_KEY);
    let cacheKey;
    if(cache){
      // URL de cache sem chave; nao armazena textos digitados por pacientes.
      cacheKey=new Request('https://hub-openfda-cache.internal/'+encodeURIComponent(campo)+'/'+encodeURIComponent(valor));
      try{
        const cached=await cache.match(cacheKey);
        if(cached)return {status:200,data:await cached.json()};
      }catch(_){}
    }
    const ac=new AbortController();
    const timer=setTimeout(()=>ac.abort(),7500);
    try{
      const r=await fetch(url.toString(),{signal:ac.signal,headers:{Accept:'application/json'}});
      if(r.status===404)return {status:404,data:null};
      if(!r.ok)return {status:r.status,data:null};
      const data=await r.json();
      if(cache&&cacheKey){
        try{await cache.put(cacheKey,new Response(JSON.stringify(data),{
          headers:{'Content-Type':'application/json','Cache-Control':'public, max-age=21600'}
        }));}catch(_){}
      }
      return {status:200,data};
    }finally{clearTimeout(timer);}
  }
  try{
    let resposta=await pesquisar('openfda.generic_name');
    let bula=resposta.status===200?filtrarBula(resposta.data,valor,nome):null;
    if(!bula&&resposta.status!==429&&resposta.status!==503){
      const alternativa=await pesquisar('openfda.brand_name');
      bula=alternativa.status===200?filtrarBula(alternativa.data,valor,nome):null;
      if(resposta.status===404)resposta=alternativa;
    }
    if(!bula){
      return {medicamento:nome,principioAtivo:ing,
        status:resposta.status===429?'limite':resposta.status===404||resposta.status===200?'nao_encontrado':'indisponivel'};
    }
    return {medicamento:nome,principioAtivo:ing,status:'encontrado',...bula};
  }catch(_){return {medicamento:nome,principioAtivo:ing,status:'indisponivel'};}
}
function ocorrencias(bulas){
  // Menção textual != prova de interacao. Exibe somente correspondencia rastreavel.
  const res=[];
  for(let i=0;i<bulas.length;i++){
    for(let j=i+1;j<bulas.length;j++){
      const a=bulas[i],b=bulas[j], fontes=[];
      for(const [principal,outro] of [[a,b],[b,a]]){
        if(!principal.temSecao)continue;
        const paragrafos=principal.secaoInteracoes.split(/\n+/).filter(Boolean);
        const termos=[normalizar(outro.principioAtivo),normalizar(outro.medicamento)]
          .filter(x=>x.length>=4);
        const p=paragrafos.find(t=>termos.some(nome=>{
          const txt=normalizar(t);
          const pos=txt.indexOf(nome);
          return pos>=0&&(pos===0||!/[\p{L}\p{N}]/u.test(txt[pos-1])) &&
            (pos+nome.length===txt.length||!/[\p{L}\p{N}]/u.test(txt[pos+nome.length]));
        }));
        if(p)fontes.push({medicamento:principal.medicamento,trecho:p.slice(0,950),link:principal.link});
      }
      res.push({par:[a.medicamento,b.medicamento],mencoes:fontes});
    }
  }
  return res;
}
export async function onRequestOptions(){return new Response(null,{status:204,headers:{...HEADERS,Allow:'POST, OPTIONS'}});}
export async function onRequestPost({request,env={}}){
  const origem=request.headers.get('Origin');
  if(origem&&origem!==new URL(request.url).origin)return saida({erro:'Origem não autorizada.'},403);
  if(Number(request.headers.get('Content-Length')||0)>4000)return saida({erro:'Requisição excessiva.'},413);
  let body;
  try{body=await request.json();}catch(_){return saida({erro:'JSON inválido.'},400);}
  const meds=body?.medicamentos;
  if(!Array.isArray(meds)||meds.length<2||meds.length>12 ||
    meds.some(x=>typeof x!=='string'||x.length>80||!(/^[\p{L}\p{M}\p{N} ().,+/\-]+$/u.test(x.trim())))){
    return saida({erro:'Informe de 2 a 12 nomes de medicamentos, sem dados de pacientes.'},400);
  }
  const seen=new Set(), nomes=[];
  for(const nome of meds){
    const limpo=nome.trim(), chave=normalizar(nomeFDA(limpo));
    if(limpo.length<2||seen.has(chave))continue;
    seen.add(chave);nomes.push(limpo);
  }
  if(nomes.length<2)return saida({erro:'Informe pelo menos dois princípios ativos diferentes.'},400);
  // No maximo 3 solicitacoes paralelas: protege limite publico da FDA.
  const bulas=[];
  for(let i=0;i<nomes.length;i+=3){
    const grupo=await Promise.all(nomes.slice(i,i+3).map(async n=>{
      const [bula,rxnorm]=await Promise.all([consultarNome(n,env),consultarRxNorm(n)]);
      return {...bula,rxnorm};
    }));
    bulas.push(...grupo);
  }
  const pares=ocorrencias(bulas);
  return saida({
    fonte:'openFDA + NIH/RxNorm',
    fontesOficiais:FONTES_OFICIAIS,
    dataConsulta:new Date().toISOString(),
    bulas,
    pares,
    medscape:MEDSCAPE,
    aviso:'A RxNorm padroniza nomes e identificadores, e a openFDA mostra textos de bulas dos EUA. Esta consulta nao calcula nem classifica interacoes farmacologicas. Ausencia de mencao ou de bula nao comprova seguranca. EMA e Anvisa oferecem consulta documental complementar, nao verificacao automatica de pares. Nunca informe dados de pacientes.'
  });
}
