import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const load=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=load('index.html');
const script=load('interacoes-clinicas.js');
const backend=load('functions/interacoes.js');
const sw=load('sw.js');
const pagina=html.split('<div class="page" id="page-interacao">')[1].split('<!-- ══ IMUNOGLOBULINAS')[0];
const fakeAbort=class{signal={};abort(){}};
const makeResp=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});

function fakeServer(meds,forcarStatus=null){
  let calls=[];
  const handle=new Function('fetch','Response','setTimeout','clearTimeout','AbortController','caches',
    backend.replaceAll('export async function','async function')+'return onRequestPost;')(
      async url=>{
        calls.push(String(url));
        if(forcarStatus!==null)return makeResp({error:'service unavailable'},forcarStatus);
        const u=new URL(String(url));
        if(u.hostname==='rxnav.nlm.nih.gov'){
          if(u.pathname==='/REST/rxcui.json'){
            const name=u.searchParams.get('name');
            if(/^(dupilumab|methotrexate)$/i.test(name))
              return makeResp({idGroup:{rxnormId:[name.toLowerCase()==='dupilumab'?'12345':'67890']}});
            return makeResp({idGroup:{}});
          }
          if(u.pathname.endsWith('/properties.json'))
            return makeResp({properties:{name:u.pathname.includes('12345')?'dupilumab':'methotrexate',tty:'IN'}});
        }
        const nome=u.searchParams.get('search')||'';
        if(/dupilumab/i.test(nome))return makeResp({results:[{
          set_id:'123e4567-e89b-12d3-a456-426614174000',
          effective_time:'20261010',
          openfda:{generic_name:['DUPILUMAB'],brand_name:['DUPIXENT']},
          drug_interactions:['No pharmacokinetic interactions with methotrexate are described in the study.']
        }]});
        if(/methotrexate/i.test(nome))return makeResp({results:[{
          set_id:'123e4567-e89b-12d3-a456-426614174001',
          effective_time:'20260504',
          openfda:{generic_name:['METHOTREXATE'],brand_name:['TREXALL']},
          drug_interactions:['Use caution with interacting drugs.']
        }]});
        return makeResp({error:'No matches found'},404);
      },Response,()=>1,()=>{},fakeAbort,undefined);
  async function call(med){
    const req=new Request('https://hubdoalergista.pages.dev/interacoes',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({medicamentos:med})
    });
    const res=await handle({request:req,env:{}});
    return {status:res.status,data:await res.json(),calls};
  }
  return call;
}

test('interações não usam IA nem fingem que a base do Medscape foi copiada',()=>{
  assert.match(pagina,/onclick="consultarInteracoesSemIA\(\)"/);
  assert.match(pagina,/id="diMedscapeBtn"/);
  assert.doesNotMatch(pagina,/\bpor IA\b|Medscape integrado/i);
  assert.doesNotMatch(script,/fetch\(['"]\/ia['"]/);
  assert.doesNotMatch(backend,/GEMINI|OPENAI|generativelanguage\.googleapis\.com/);
  assert.match(sw,/interacoes-clinicas\.js/);
});

test('consulta diretamente a API de bulas e produz menção textual, não confirmação de interação',async()=>{
  const req=fakeServer();
  const r=await req(['Dupilumabe','Metotrexato']);
  assert.equal(r.status,200);
  assert.equal(r.data.bulas.length,2);
  assert.equal(r.data.bulas[0].principioAtivo,'dupilumab');
  assert.equal(r.data.bulas[1].principioAtivo,'methotrexate');
  assert.equal(r.data.pares[0].mencoes.length,1);
  assert.match(r.data.aviso,/nao calcula nem classifica interacoes farmacologicas/i);
  assert.ok(r.calls.some(x=>x.startsWith('https://api.fda.gov/drug/label.json')));
  assert.ok(r.calls.some(x=>x.startsWith('https://rxnav.nlm.nih.gov/REST/rxcui.json')));
  assert.equal(r.data.bulas[0].rxnorm.rxcui,'12345');
  assert.equal(r.data.bulas[1].rxnorm.rxcui,'67890');
  assert.equal(r.data.fontesOficiais.anvisa,'https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico');
});

test('normalização RxNorm não transforma ausência de bula em avaliação de segurança',async()=>{
  const req=fakeServer();
  const r=await req(['Bilastina','Metotrexato']);
  assert.equal(r.status,200);
  assert.equal(r.data.bulas[0].status,'nao_encontrado');
  assert.equal(r.data.pares[0].mencoes.length,0);
  assert.match(r.data.aviso,/nao comprova seguranca/);
});

test('o limite da FDA aparece como falha, sem transformar em resultado negativo',async()=>{
  const req=fakeServer(null,429);
  const r=await req(['Dupilumabe','Metotrexato']);
  assert.equal(r.status,200);
  assert.ok(r.data.bulas.every(x=>x.status==='limite'));
  assert.ok(r.data.pares.every(x=>x.mencoes.length===0));
});

test('entrada é validada; pacientes identificados não devem ser enviados',async()=>{
  const req=fakeServer();
  const r=await req(['Dupilumabe','paciente@hospital.com']);
  assert.equal(r.status,400);
  assert.equal(r.calls.length,0);
});

test('scripts e função Cloudflare têm sintaxe válida',()=>{
  assert.doesNotThrow(()=>new Function(script));
  assert.doesNotThrow(()=>new Function(backend.replaceAll('export async function','async function')));
});

test('interface faz consulta ao endpoint próprio e restaura o botão em erro',async()=>{
  let calls=0;
  const box={style:{},children:[],replaceChildren(...itens){this.children=[...itens];},appendChild(el){this.children.push(el);}};
  const btn={disabled:false,textContent:'Consultar bulas sem IA'};
  const doc={
    getElementById(id){return id==='diResultado'?box:id==='diVerificarBtn'?btn:null;},
    createElement(tag){
      return {tag,style:{},children:[],addEventListener(){},appendChild(el){this.children.push(el);}};
    }
  };
  const w={open(){}};
  new Function('window','document','fetch','diColetarMeds','setTimeout','clearTimeout','AbortController',script)(
    w,doc,async url=>{
      calls++;assert.equal(url,'/interacoes');
      return {ok:false,status:503,json:async()=>({erro:'Fonte indisponível'})};
    },()=>['Dupilumabe','Metotrexato'],()=>1,()=>{},fakeAbort);
  await w.consultarInteracoesSemIA();
  assert.equal(calls,1);
  assert.equal(btn.disabled,false);
  assert.match(box.children[0].textContent,/Não foi possível consultar as bulas/);
  assert.ok(box.children.some(x=>x.tag==='button'));
});
