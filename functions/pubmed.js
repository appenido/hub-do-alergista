// Proxy de consulta ao PubMed para os resumos do Hub.
// Evita bloqueios CORS no navegador; não inventa conteúdo nem altera a fonte.
const ORIGEM = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const CAB = {'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};

function falha(mensagem,status){
  return new Response(mensagem,{status,headers:CAB});
}
async function consultar(endpoint, params){
  const url = ORIGEM + endpoint + '?' + new URLSearchParams({
    ...params,tool:'HubDoAlergista',email:''
  }).toString();
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),7500);
  try {
    const resp = await fetch(url,{signal:controller.signal,headers:{'Accept':'application/json, application/xml, text/xml'}});
    if(!resp.ok)throw new Error('PubMed HTTP '+resp.status);
    return await resp.text();
  } finally {clearTimeout(timer);}
}
async function pesquisar(termo){
  const raw=await consultar('esearch.fcgi',{db:'pubmed',retmode:'json',retmax:'3',term:termo});
  const ids=JSON.parse(raw).esearchresult?.idlist||[];
  return ids.find(x=>/^\d{1,10}$/.test(x))||'';
}
export async function onRequestGet({request}){
  const u=new URL(request.url);
  const id=(u.searchParams.get('id')||'').trim();
  const doi=(u.searchParams.get('doi')||'').trim();
  const titulo=(u.searchParams.get('title')||'').trim();
  if(id && !/^\d{1,10}$/.test(id))return falha('Identificador PubMed inválido.',400);
  if(doi && (!/^10\.\d{4,9}\/[\w.()/:;-]+$/i.test(doi) || doi.length>160))
    return falha('DOI inválido.',400);
  if(titulo.length>250)return falha('Título muito longo.',400);
  if(!id&&!doi&&!titulo)return falha('Informe o PMID, DOI ou título.',400);
  let pmid=id;
  try{
    if(!pmid&&doi)pmid=await pesquisar(doi+'[DOI]');
    if(!pmid&&titulo){
      let limpa=titulo.replace(/\([^)]*\)/g,' ').replace(/[^a-zA-Z0-9À-ÿ -]/g,' ').replace(/\s+/g,' ').trim();
      if(limpa.length<7)return falha('Título insuficiente para localizar o artigo.',400);
      pmid=await pesquisar(limpa+'[Title]');
      if(!pmid){
        const palavras=limpa.split(' ').filter(x=>x.length>=5).slice(0,5);
        if(palavras.length>=2)pmid=await pesquisar(palavras.join(' '));
      }
    }
    if(!pmid)return falha('Artigo não encontrado no PubMed.',404);
    const xml=await consultar('efetch.fcgi',{db:'pubmed',retmode:'xml',id:pmid});
    if(!/<PubmedArticle\b/.test(xml))return falha('Registro PubMed indisponível.',502);
    return new Response(xml,{status:200,headers:{
      'Content-Type':'application/xml; charset=utf-8',
      'Cache-Control':'public, max-age=3600',
      'X-Content-Type-Options':'nosniff',
      'X-PubMed-ID':pmid
    }});
  }catch(e){
    return falha(e&&e.name==='AbortError'?'PubMed demorou a responder.':'Consulta ao PubMed indisponível.',503);
  }
}
