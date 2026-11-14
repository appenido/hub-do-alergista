import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const server=readFileSync(new URL('functions/interacoes.js',root),'utf8');
const sw=readFileSync(new URL('sw.js',root),'utf8');
const page=html.split('<div class="page" id="page-interacao">')[1]
  .split('<!-- ══ IMUNOGLOBULINAS')[0];

test('o botão principal abre diretamente o verificador Drugs.com',()=>{
  assert.ok(page,'Página de interação não encontrada');
  assert.match(page,/id="diAbrirExterno"/);
  assert.match(page,/href="https:\/\/www\.drugs\.com\/drug_interactions\.html"/);
  assert.match(page,/target="_blank"/);
  assert.match(page,/rel="noopener noreferrer external"/);
  assert.match(page,/Verificar interações/);
});

test('alternativa em português é expansível e identifica a limitação de cobertura',()=>{
  assert.match(page,/<details\b/);
  assert.match(page,/Detecta Interações/);
  assert.match(page,/https:\/\/imses\.crfmg\.org\.br\/receita\.php/);
  assert.match(page,/interações graves selecionadas/);
  assert.match(page,/não contempla necessariamente medicamentos biológicos/);
});

test('nenhum formulário antigo de interações é exibido ou envia medicamentos',()=>{
  assert.doesNotMatch(page,/id="diCampos"|id="diResultado"|id="diVerificarBtn"|di-chip-add/);
  assert.doesNotMatch(page,/<input|<form|onclick="/);
  assert.doesNotMatch(html,/diColetarMeds|diPreencherChip|diAdicionarCampo/);
  assert.doesNotMatch(html,/<script src="\/interacoes-clinicas\.js/);
  assert.match(page,/medicamentos não são enviados pelo Hub/);
});

test('endpoint antigo falha de modo seguro e não verifica pares parcialmente',async()=>{
  const post=new Function('Response',
    server.replaceAll('export async function','async function')+'return onRequestPost;')(Response);
  const response=await post({});
  assert.equal(response.status,410);
  const data=await response.json();
  assert.equal(data.status,'desativado');
  assert.match(data.erro,/cobertura clínica insuficiente/);
  assert.equal(data.consultaExterna,'https://www.drugs.com/drug_interactions.html');
  assert.doesNotMatch(server,/api\.fda\.gov|rxnav\.nlm\.nih\.gov/);
});

test('PWA não armazena nem carrega a implementação clínica interna antiga',()=>{
  assert.doesNotMatch(sw,/['"]interacoes-clinicas\.js\?v=/);
  assert.doesNotMatch(sw,/['"]\/interacoes-clinicas\.js['"]/);
  assert.match(sw,/link-externo-interacoes/);
});

test('textos de segurança não declaram ausência de interação como segurança clínica',()=>{
  assert.match(page,/Ausência de alerta em qualquer fonte não garante ausência de interação/);
  assert.match(page,/função renal e hepática/);
  assert.doesNotMatch(page,/0 interações|Nenhuma interação encontrada|Não avaliada nesta base/);
});

test('código do endpoint desativado mantém sintaxe válida',()=>{
  assert.doesNotThrow(()=>
    new Function(server.replaceAll('export async function','async function')));
});
