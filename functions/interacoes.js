// Endpoint desativado em favor de verificadores externos especializados.
// Mantido apenas para informar aplicativos antigos ainda armazenados em cache.
// Nenhum dado de medicamentos é enviado a serviços externos ou armazenado aqui.
const HEADERS={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer'
};
function resposta(){
  return new Response(JSON.stringify({
    erro:'O verificador interno foi desativado por ter cobertura clínica insuficiente. Abra o verificador externo na página Interações medicamentosas.',
    status:'desativado',
    consultaExterna:'https://www.drugs.com/drug_interactions.html',
    alternativaPortugues:'https://imses.crfmg.org.br/receita.php'
  }),{status:410,headers:HEADERS});
}
export async function onRequestPost(){return resposta();}
export async function onRequestGet(){return resposta();}
export async function onRequestOptions(){
  return new Response(null,{status:204,headers:{...HEADERS,Allow:'GET, POST, OPTIONS'}});
}
