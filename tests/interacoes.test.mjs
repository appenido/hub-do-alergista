import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const ia=fs.readFileSync(new URL('../functions/ia.js',import.meta.url),'utf8');
const inicio=html.indexOf('/* ── INTERAÇÕES MEDICAMENTOSAS: triagem');
const fim=html.indexOf('/* ── Endereço completo',inicio);
assert.ok(inicio>0 && fim>inicio,'Função de interações deve estar disponível');
const codigo=html.slice(inicio,fim);

function montarConsulta(medicamentos,resposta){
  let chamadas=0;
  const resultado={
    style:{},children:[],innerHTML:'',
    replaceChildren(){this.children=[];this.innerHTML='';},
    appendChild(el){this.children.push(el);}
  };
  const botao={disabled:false,textContent:'Analisar'};
  const doc={
    getElementById(id){return id==='diResultado'?resultado:id==='diVerificarBtn'?botao:null;},
    createElement(tag){return {tag,style:{},textContent:'',children:[],appendChild(el){this.children.push(el);},addEventListener(){}};}
  };
  const mockFetch=async()=>{chamadas++;return resposta;};
  const executar=new Function(
    'document','fetch','diColetarMeds','_iaFormatar','abrirMedscapeInteracao',
    'setTimeout','clearTimeout','AbortController',codigo+'return verificarInteracoes;'
  )(doc,mockFetch,()=>medicamentos,(x)=>x,()=>{},()=>1,()=>{},class{signal={};abort(){}});
  return {executar,resultado,botao,get chamadas(){return chamadas;}};
}

test('erro de cota exibe alternativa segura em vez de resultado clínico',async()=>{
  const c=montarConsulta(['Dupilumabe','Metotrexato'],{
    ok:false,status:429,json:async()=>({erro:'Serviço sobrecarregado'})
  });
  await c.executar();
  assert.equal(c.resultado.children[0].textContent,'Triagem automatizada indisponível');
  assert.match(c.resultado.children[1].textContent,/Não foi possível confirmar as combinações informadas/);
  assert.equal(c.resultado.children.at(-1).tag,'button');
  assert.equal(c.botao.disabled,false);
});

test('ciclosporina e prednisona retornam conteúdo documental mesmo sem API de IA',async()=>{
  const c=montarConsulta(['Ciclosporina','Prednisona'],{
    ok:false,status:429,json:async()=>({erro:'Cota excedida'})
  });
  await c.executar();
  assert.equal(c.chamadas,0,'Pares documentados devem funcionar sem requisitar IA');
  assert.match(c.resultado.children[0].textContent,/Interações identificadas em bula oficial/);
  const card=c.resultado.children.find(el=>el.tag==='section');
  assert.ok(card,'Deve exibir card com a interação');
  assert.match(card.children[0].textContent,/Ciclosporina \+ Prednisona/);
  assert.match(card.children[1].textContent,/prednisolona/);
  const link=card.children.find(el=>el.tag==='a');
  assert.match(link.href,/dailymed.nlm.nih.gov/);
});

test('falha da IA preserva achado de bula e declara pares não cobertos',async()=>{
  const c=montarConsulta(['Ciclosporina','Prednisona','Dupilumabe'],{
    ok:false,status:429,json:async()=>({erro:'Cota excedida'})
  });
  await c.executar();
  assert.equal(c.chamadas,1);
  assert.match(c.resultado.children[0].textContent,/Interações identificadas em bula oficial/);
  assert.ok(c.resultado.children.some(el=>/Pares sem cobertura/.test(el.children?.[0]?.textContent||'')));
  assert.ok(c.resultado.children.some(el=>/limite de cota/.test(el.textContent||'')));
});

test('sucesso traz aviso explícito de triagem não validada',async()=>{
  const c=montarConsulta(['Dupilumabe','Metotrexato'],{
    ok:true,status:200,json:async()=>({resposta:'Avaliação preliminar'})
  });
  await c.executar();
  assert.match(c.resultado.innerHTML,/não validada pelo Medscape/);
  assert.match(c.resultado.innerHTML,/Avaliação preliminar/);
  assert.equal(c.botao.disabled,false);
});

test('um fármaco isolado ou repetido não aciona a IA',async()=>{
  const c=montarConsulta(['Dupilumabe','dupilumabe'],{
    ok:true,status:200,json:async()=>({resposta:'Não deveria executar'})
  });
  await c.executar();
  assert.equal(c.chamadas,0);
  assert.equal(c.resultado.children[0].textContent,'Faltam medicamentos');
});

test('interface distingue análise por IA de consulta ao Medscape',()=>{
  assert.match(html,/id="diMedscapeBtn"/);
  assert.match(html,/A triagem por IA ocorre no Hub/);
  assert.doesNotMatch(html,/Medscape integrado|feita integralmente pela base do Medscape/);
});

test('backend devolve HTTP 429 quando modelos atingem a cota',async()=>{
  let chamadas=0;
  const fonte=ia.replaceAll('export async function','async function');
  const handle=new Function('fetch','Response','setTimeout','clearTimeout','AbortController',
    fonte+'return onRequestPost;')(
    async()=>{chamadas++;return {ok:false,status:429};},
    Response,()=>1,()=>{},class{signal={};abort(){}}
  );
  const r=await handle({
    request:{
      headers:{get(){return null;}},
      json:async()=>({pergunta:'Interações entre dupilumabe e metotrexato'})
    },
    env:{GEMINI_API_KEY:'mock'}
  });
  assert.equal(r.status,429);
  assert.equal(chamadas,2);
});
