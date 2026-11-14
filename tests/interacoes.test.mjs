import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const carregar=caminho=>fs.readFileSync(new URL('../'+caminho,import.meta.url),'utf8');
const html=carregar('index.html');
const cliente=carregar('interacoes-clinicas.js');
const servidor=carregar('functions/interacoes.js');
const sw=carregar('sw.js');
const secao=html.split('<div class="page" id="page-interacao">')[1]
  .split('<!-- ══ IMUNOGLOBULINAS')[0];
const iniciar=new Function('Response',servidor.replaceAll('export async function','async function')+
  'return onRequestPost;')(Response);
async function consultar(medicamentos){
  const request=new Request('https://hubdoalergista.pages.dev/interacoes',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({medicamentos})
  });
  const response=await iniciar({request});
  return {status:response.status,corpo:await response.json()};
}

test('a seção contém apenas a verificação de interações em português',()=>{
  assert.match(secao,/Interações medicamentosas/);
  assert.match(secao,/Verificar interações/);
  assert.match(secao,/onclick="verificarInteracoes\(\)"/);
  assert.doesNotMatch(secao,/Medscape|RxNorm|FDA|IA|bula|Consult(ar|a) [A-Z]/i);
  assert.doesNotMatch(cliente,/Medscape|RxNorm|openFDA|/i);
  assert.doesNotMatch(cliente,/fetch\(['"]\/ia['"]/);
  assert.doesNotMatch(servidor,/fetch\(/);
  assert.match(sw,/interacoes-clinicas\.js\?v=20261114-interacoes-pt-1/);
});

test('interação entre ciclosporina e metotrexato é identificada com conduta',async()=>{
  const {status,corpo}=await consultar(['Ciclosporina','Metotrexato']);
  assert.equal(status,200);
  assert.equal(corpo.pares[0].situacao,'identificada');
  assert.match(corpo.pares[0].efeito,/nefrotoxicidade/);
  assert.match(corpo.pares[0].conduta,/creatinina/);
});

test('interação entre azatioprina e alopurinol traz ajuste de dose documentado',async()=>{
  const {corpo}=await consultar(['Azatioprina','Alopurinol']);
  assert.match(corpo.pares[0].efeito,/mielotoxicidade/);
  assert.match(corpo.pares[0].conduta,/1\/3 a 1\/4/);
});

test('interação contraindicada aparece antes de combinações não avaliadas',async()=>{
  const {corpo}=await consultar(['Hidroxizina','Citalopram','Dupilumabe']);
  assert.equal(corpo.pares.length,3);
  assert.equal(corpo.pares[0].nivel,'Contraindicada');
  assert.equal(corpo.naoAvaliadas,2);
});

test('associação não registrada nunca é declarada segura',async()=>{
  const {corpo}=await consultar(['Dupilumabe','Metotrexato']);
  assert.equal(corpo.pares[0].situacao,'nao_avaliada');
  assert.match(corpo.pares[0].conduta,/Não conclua/);
  assert.equal(corpo.identificadas,0);
});

test('medicamentos repetidos não criam interações inexistentes',async()=>{
  const {status}=await consultar(['Metotrexato','methotrexate']);
  assert.equal(status,400);
});

test('o endpoint bloqueia conteúdo indevido e não acessa rede externa',async()=>{
  const {status}=await consultar(['Ciclosporina','paciente@hospital.com']);
  assert.equal(status,400);
  assert.doesNotMatch(servidor,/https:\/\/api\.fda\.gov|https:\/\/rxnav\.nlm\.nih\.gov/);
});

test('JavaScript de consulta e função do servidor são sintaticamente válidos',()=>{
  assert.doesNotThrow(()=>new Function(cliente));
  assert.doesNotThrow(()=>new Function(servidor.replaceAll('export async function','async function')));
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
