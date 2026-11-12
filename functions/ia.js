// Endpoint educacional de IA. Não aceite dados clínicos identificáveis.
// A validação é defesa em profundidade: padrões não garantem anonimização.
const ORIGEM='https://hubdoalergista.pages.dev';
const CABECALHOS={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store, private',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'Vary':'Origin'
};
const SISTEMA=[
  'Você é um assistente educacional para médicos alergistas e imunologistas no Brasil.',
  'Responda em português do Brasil, use diretrizes reconhecidas, cite fontes quando pertinentes.',
  'Nunca solicite nome, CPF, prontuário, endereço, telefone ou qualquer identificador de pacientes.',
  'Não substitua avaliação individual, exame presencial ou responsabilidade profissional.'
].join(' ');
function resposta(d,status=200,origin=null){
  const headers={...CABECALHOS};
  if(origin===ORIGEM)headers['Access-Control-Allow-Origin']=ORIGEM;
  return new Response(JSON.stringify(d),{status,headers});
}
function validaOrigem(request){
  const origin=request.headers.get('Origin');
  return !origin || origin===ORIGEM;
}
function suspeitaDeIdentificador(s){
  const patterns=[
    /\b\d{3}[. ]?\d{3}[. ]?\d{3}[- ]?\d{2}\b/, // CPF
    /\b\d{15}\b/, // CNS
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(?:CPF|RG|CNS|prontu[aá]rio|nome completo|paciente identificado)\s*[:#-]?\s*\S+/i,
    /\b(?:\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[- ]?\d{4}\b/
  ];
  return patterns.some(rx=>rx.test(s));
}
export async function onRequestOptions({request}){
  if(!validaOrigem(request))return resposta({erro:'Origem não autorizada.'},403);
  return new Response(null,{status:204,headers:{
    ...CABECALHOS,'Access-Control-Allow-Origin':ORIGEM,
    'Access-Control-Allow-Methods':'POST, OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type',
    'Access-Control-Max-Age':'300'
  }});
}
export async function onRequestPost({request,env}){
  if(!validaOrigem(request))return resposta({erro:'Origem não autorizada.'},403);
  const origin=request.headers.get('Origin');
  if(Number(request.headers.get('Content-Length')||0)>12000)
    return resposta({erro:'Solicitação acima do tamanho permitido.'},413,origin);
  let pergunta='';
  try{
    const payload=await request.json();
    if(!payload||typeof payload.pergunta!=='string')throw new Error('JSON inválido');
    pergunta=payload.pergunta.trim();
  }catch(_){return resposta({erro:'Requisição inválida.'},400,origin);}
  if(!pergunta||pergunta.length>4000)return resposta({erro:'A pergunta deve ter até 4.000 caracteres.'},400,origin);
  if(suspeitaDeIdentificador(pergunta))
    return resposta({erro:'Remova qualquer informação identificável de pacientes antes de utilizar a IA.'},422,origin);
  const key=env.GEMINI_API_KEY||env.GEMINI||env.GOOGLE_API_KEY;
  if(!key)return resposta({erro:'IA temporariamente indisponível.'},503,origin);
  // Priorização de modelos válidos com prazo curto: a interface não deve ficar
  // esperando uma longa cadeia de tentativas e exibir o abstract como substituto.
  const MODELOS=['gemini-2.5-flash','gemini-flash-latest'];
  const corpo=JSON.stringify({
    system_instruction:{parts:[{text:SISTEMA}]},
    contents:[{role:'user',parts:[{text:pergunta}]}],
    generationConfig:{temperature:0.25,maxOutputTokens:1800}
  });
  let ultimaFalha='';
  for(const modelo of MODELOS){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8500);
    try{
      const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+modelo+':generateContent?key='+encodeURIComponent(key),
        {method:'POST',headers:{'Content-Type':'application/json'},body:corpo,signal:controller.signal});
      if(r.ok){
        const d=await r.json();
        const partes=(((d.candidates||[])[0]||{}).content||{}).parts||[];
        const texto=partes.map(p=>typeof p.text==='string'?p.text:'').join('').trim();
        if(texto)return resposta({resposta:texto},200,origin);
        ultimaFalha='O serviço não retornou conteúdo.';
      }else{
        ultimaFalha=r.status===429?'Serviço de IA temporariamente sobrecarregado.':
          r.status===401||r.status===403?'Serviço de IA sem autorização.':
          'Serviço de IA indisponível (HTTP '+r.status+').';
        if(r.status===401||r.status===403)break;
      }
    }catch(e){ultimaFalha=e&&e.name==='AbortError'?'A IA excedeu o tempo limite.':'Falha de comunicação com a IA.';}
    finally{clearTimeout(timer);}
  }
  return resposta({erro:ultimaFalha||'Não foi possível consultar o serviço de IA agora.'},503,origin);
}
