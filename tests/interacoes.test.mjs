import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { onRequestPost } from '../functions/interacoes.js';

const carregar=caminho=>fs.readFileSync(new URL('../'+caminho,import.meta.url),'utf8');
const html=carregar('index.html');
const cliente=carregar('interacoes-clinicas.js');
const servidor=carregar('functions/interacoes.js');
const cima=carregar('interacoes-cima.mjs');
const sw=carregar('sw.js');
const indice=JSON.parse(carregar('data/interacoes-cima.json'));
const secao=html.split('<div class="page" id="page-interacao">')[1]
  .split('<!-- ══ IMUNOGLOBULINAS')[0];
const arquivoLocal=async function(request){
  assert.equal(new URL(request.url).pathname,'/data/interacoes-cima.json');
  assert.equal(request.method,'GET');
  return Response.json(indice);
};
async function consultar(t,medicamentos,arquivo=arquivoLocal){
  const acesso=t.mock.fn(arquivo);
  const request=new Request('https://hubdoalergista.pages.dev/interacoes',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({medicamentos})
  });
  const response=await onRequestPost({request,env:{ASSETS:{fetch:acesso}}});
  return {status:response.status,corpo:await response.json(),acesso};
}

test('a seção contém apenas a verificação de interações em português',()=>{
  assert.match(secao,/Interações medicamentosas/);
  assert.match(secao,/Verificar interações/);
  assert.match(secao,/onclick="verificarInteracoes\(\)"/);
  assert.doesNotMatch(secao,/Medscape|RxNorm|openFDA|\bIA\b|bula oficial|NIH/i);
  assert.doesNotMatch(cliente,/Medscape|generativelanguage\.googleapis\.com/i);
  assert.match(secao,/AEMPS\/CIMA · dados abertos/);
  assert.match(html,/body:has\(#page-interacao\.active\) #auriReabrir/);
  assert.doesNotMatch(cliente,/NIH\/RxNorm|Bula FDA:|Consulta complementar/);
  assert.doesNotMatch(cliente,/fetch\(['"]\/ia['"]/);
  assert.match(cima,/https:\/\/cima\.aemps\.es/);
  assert.doesNotMatch(servidor,/\bfetch\(new URL\('https:\/\//);
  const versao=html.match(/interacoes-clinicas\.js\?v=([\w-]+)/)?.[0];
  assert.ok(versao && sw.includes(versao));
});

test('dipirona e ciclosporina retornam mecanismo e conduta, inclusive com nomes de marca e dose',async t=>{
  const {status,corpo,acesso}=await consultar(t,['Sandimmun Neoral 100 mg','Novalgina 1 g'],()=>assert.fail('A regra clínica deve funcionar durante uma falha da fonte externa'));
  assert.equal(status,200);
  assert.equal(corpo.identificadas,1);
  assert.equal(corpo.pares[0].nivel,'Requer monitorização');
  assert.match(corpo.pares[0].efeito,/reduzir os níveis sanguíneos de ciclosporina/);
  assert.match(corpo.pares[0].mecanismo,/CYP3A4/);
  assert.match(corpo.pares[0].conduta,/concentração de vale/);
  assert.match(corpo.pares[0].fonte.url,/novalgina\.com\.br/);
  assert.ok(corpo.pares[0].referencias.some(f=>f.url.includes('cima.aemps.es')));
  assert.equal(acesso.mock.callCount(),0);
});

test('índice CIMA contém a origem e uma referência verificável para dipirona e ciclosporina',()=>{
  assert.match(indice.origem,/AEMPS\/CIMA/);
  assert.ok(Object.keys(indice.ativos).length>1000);
  const [,data,termos]=indice.ativos.metamizol;
  assert.match(data,/^\d{4}-\d{2}-\d{2}/);
  assert.ok(termos.includes('ciclosporina'));
});

test('interação entre ciclosporina e metotrexato é identificada com conduta',async t=>{
  const {status,corpo}=await consultar(t,['Ciclosporina','Metotrexato']);
  assert.equal(status,200);
  assert.equal(corpo.pares[0].situacao,'identificada');
  assert.match(corpo.pares[0].efeito,/nefrotoxicidade/);
  assert.match(corpo.pares[0].conduta,/creatinina/);
});

test('interação entre azatioprina e alopurinol traz ajuste de dose documentado',async t=>{
  const {corpo}=await consultar(t,['Azatioprina','Alopurinol']);
  assert.match(corpo.pares[0].efeito,/mielotoxicidade/);
  assert.match(corpo.pares[0].conduta,/1\/3 a 1\/4/);
});

test('interação contraindicada aparece antes de combinações não avaliadas',async t=>{
  const {corpo}=await consultar(t,['Hidroxizina','Citalopram','Dupilumabe']);
  assert.equal(corpo.pares.length,3);
  assert.equal(corpo.pares[0].nivel,'Contraindicada');
  assert.equal(corpo.naoAvaliadas,2);
});

test('associação não registrada nunca é declarada segura',async t=>{
  const {corpo,acesso}=await consultar(t,['Dipirona','Cetirizina']);
  assert.equal(corpo.pares[0].situacao,'nao_avaliada');
  assert.match(corpo.pares[0].efeito,/não trazem menção nominal/);
  assert.match(corpo.aviso,/sem confirmação de segurança/);
  assert.equal(corpo.identificadas,0);
  assert.equal(corpo.naoAvaliadas,1);
  assert.equal(acesso.mock.callCount(),1);
});

test('omalizumabe e ciclosporina têm evidência insuficiente e fonte oficial, nunca falso negativo',async t=>{
  const {corpo}=await consultar(t,['Omalizumabe','Ciclosporina']);
  assert.equal(corpo.pares[0].situacao,'dados_insuficientes');
  assert.equal(corpo.naoAvaliadas,1);
  assert.equal(corpo.identificadas,0);
  assert.match(corpo.pares[0].efeito,/não foram realizados estudos formais/i);
  assert.match(corpo.pares[0].fonte.url,/dailymed\.nlm\.nih\.gov/);
});

test('a CIMA encontra menção real ao par sem convertê-la em alerta clínico automático',async t=>{
  const {corpo}=await consultar(t,['Pantoprazol','Clopidogrel']);
  assert.equal(corpo.identificadas,0);
  assert.equal(corpo.pares[0].situacao,'mencao_documental');
  assert.equal(corpo.pares[0].nivel,'Menção em ficha técnica');
  assert.match(corpo.pares[0].fonte.url,/cima\.aemps\.es\/.*#4\.5$/);
  assert.match(corpo.pares[0].fonte.atualizada,/^\d{4}-\d{2}-\d{2}$/);
  assert.doesNotMatch(JSON.stringify(corpo),/Estos resultados/);
});

test('a cobertura se estende a medicamentos fora das regras clínicas originais',async t=>{
  const {corpo}=await consultar(t,['Sertralina','Carbamazepina']);
  assert.equal(corpo.pares[0].situacao,'mencao_documental');
  assert.ok(corpo.pares[0].referencias.length>0);
});

test('uma ocorrência parcial dentro de outro nome não gera menção',async t=>{
  const {corpo}=await consultar(t,['Ibuprofeno','Dipirona'],async()=>Response.json({ativos:{
    metamizol:['90011','2026-10-03',['dexibuprofeno']],
    ibuprofeno:['90012','2026-10-03',[]]
  }}));
  assert.equal(corpo.pares[0].situacao,'nao_avaliada');
  assert.doesNotMatch(JSON.stringify(corpo),/dexibuprofeno/);
});

test('a pesquisa de fichas inclui todos os medicamentos, mesmo acima de seis',async t=>{
  const {corpo,acesso}=await consultar(t,['Dupilumabe','Metotrexato','Cetirizina','Sertralina','Hidroclorotiazida','Omalizumabe','Pantoprazol','Clopidogrel']);
  assert.equal(corpo.pares.length,28);
  assert.equal(corpo.pares.find(p=>p.par.join('|')==='Pantoprazol|Clopidogrel').situacao,'mencao_documental');
  assert.equal(acesso.mock.callCount(),1);
});

test('falha na fonte vira consulta incompleta e preserva alertas documentados',async t=>{
  const {corpo}=await consultar(t,['Dipirona','Ciclosporina','Cetirizina'],async()=>new Response(null,{status:503}));
  assert.equal(corpo.pares[0].nivel,'Requer monitorização');
  assert.equal(corpo.pares[1].situacao,'consulta_incompleta');
  assert.match(corpo.pares[1].conduta,/Tente novamente/);
});

test('medicamentos repetidos não criam interações inexistentes',async t=>{
  const {status}=await consultar(t,['Dipirona sódica monoidratada','metamizol']);
  assert.equal(status,400);
});

test('o endpoint bloqueia conteúdo indevido e não acessa rede externa',async t=>{
  const {status,acesso}=await consultar(t,['Ciclosporina','paciente@hospital.com']);
  assert.equal(status,400);
  assert.equal(acesso.mock.callCount(),0);
  assert.doesNotMatch(servidor,/api\.fda\.gov|rxnav\.nlm\.nih\.gov/);
});

test('JavaScript de consulta do navegador é sintaticamente válido',()=>{
  assert.doesNotThrow(()=>new Function(cliente));
});

test('botão consulta rota de interações e retorna ao estado inicial após falha',async()=>{
  let chamadas=0;
  const box={style:{},children:[],replaceChildren(...itens){this.children=[...itens];},
    appendChild(e){this.children.push(e);}};
  const btn={disabled:false,textContent:'Verificar interações'};
  const doc={
    getElementById(id){return id==='diResultado'?box:id==='diVerificarBtn'?btn:null;},
    createElement(tag){return {tag,style:{},children:[],appendChild(e){this.children.push(e);},
      addEventListener(){}};},
    createTextNode(t){return {textContent:t};}
  };
  const win={};
  new Function('window','document','fetch','diColetarMeds','setTimeout','clearTimeout','AbortController',cliente)(
    win,doc,async rota=>{
      chamadas++;
      assert.equal(rota,'/interacoes');
      return {ok:false,status:503,json:async()=>({erro:'Serviço indisponível.'})};
    },()=>['Dupilumabe','Metotrexato'],()=>1,()=>{},class {signal={};abort(){}});
  await win.verificarInteracoes();
  assert.equal(chamadas,1);
  assert.equal(btn.disabled,false);
  assert.equal(btn.textContent,'Verificar interações');
  assert.match(box.children[0].textContent,/Não foi possível verificar/);
});
