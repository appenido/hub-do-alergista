import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('formularios clínicos não entram no cache offline',()=>{
 const sw=read('sw.js');
 assert.doesNotMatch(sw,/['"]\/?(?:uct|snot22|uas7)-paciente\.html['"]/);
 assert.match(sw,/v1160-privacidade/);
});
test('proteção de identidade no backend de IA',()=>{
 const f=read('functions/ia.js');
 assert.match(f,/suspeitaDeIdentificador/);
 assert.doesNotMatch(f,/'Access-Control-Allow-Origin': '\*'/);
});
test('autenticação e sessões clínicas sem enumeração',()=>{
 const f=read('lgpd-runtime.js');
 assert.match(f,/sessionStorage\.setItem\(AUTH/);
 assert.match(f,/clinical_criar_sessao/);
 assert.match(f,/privacy_submit_request/);
});
test('documentos públicos, cabeçalhos de segurança e políticas',()=>{
 assert.match(read('_headers'),/frame-ancestors 'none'/);
 assert.match(read('_headers'),/X-Robots-Tag: noindex, nofollow/);
 assert.match(read('privacidade.html'),/Termos de uso/);
 assert.match(read('termos.html'),/Responsabilidade profissional/);
});
