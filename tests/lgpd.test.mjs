import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'), sw=read('sw.js');
test('login não pode criar sessão local sem autenticação Supabase',()=>{
  assert.doesNotMatch(html,/function _hash\(/);
  assert.doesNotMatch(html,/cadastro local de emerg.ncia/);
  assert.doesNotMatch(html,/u\.hash === _hash/);
  assert.match(html,/if\(!token\)/);
  assert.match(html,/sessionStorage\.setItem\('hub_session'/);
});
test('histórico clínico usa token do usuário, não chave pública',()=>{
  assert.match(html,/function _scoreRpc\(fn, body\)\{\s*var token=_sbToken\(\)/);
  assert.match(html,/'Bearer '\+token/);
  assert.match(html,/rest\/v1\/rpc\/uct_da_sessao/);
});
test('links para QR clínico usam identificadores aleatórios',()=>{
  assert.match(html,/crypto\.getRandomValues\(bytes\)/);
  assert.match(html,/'uct-' \+ _hubTokenSeguro\(\)/);
  assert.match(html,/'snot22-'\+_hubTokenSeguro\(\)/);
  assert.match(html,/'uas7-' \+ _hubTokenSeguro\(\)/);
});
test('formularios com dados de saúde não são armazenados no service worker',()=>{
  assert.doesNotMatch(sw,/['"]\.?\/?(?:uct|uas7|snot22)-paciente\.html['"]/);
  assert.match(sw,/hub-alergista-v1160-privacidade/);
});
test('informações e direitos de privacidade acessíveis',()=>{
  assert.match(html,/href="\/privacidade\.html"/);
  assert.match(html,/hubExportarDadosLocais/);
  assert.match(html,/hubApagarDadosLocais/);
  assert.match(read('privacidade.html'),/hub_solicitacoes_privacidade/);
  assert.match(read('termos.html'),/Responsabilidade profissional/);
  assert.match(read('_headers'),/Cache-Control: no-store/);
});