// Checks de regressão de privacidade e segurança; não substitui auditoria dinâmica.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
function read(p){return fs.readFileSync(p,'utf8');}
const html=read('index.html');
const runtime=read('lgpd-runtime.js');
const sql=read('supabase/migrations/20261104_lgpd_clinical_security.sql');
const ia=read('functions/ia.js');
assert(html.includes('lgpd-runtime.js?v='),'Faltando módulo LGPD no app');
assert(html.includes('privacidade.html')||runtime.includes('privacidade.html'),'Falta aviso de privacidade');
assert(!html.includes('hash:_hash(senha)'),'Login inseguro com hash local reintroduzido');
assert(!html.includes("if(!_snot22SessaoId) _snot22SessaoId='snot22-'+Date.now()"),'Token SNOT previsível');
assert(!html.includes("if(!_uas7SessaoId) _uas7SessaoId = 'uas7-' + Date.now()"),'Token UAS previsível');
assert(!html.includes("_uctSessaoId = 'uct-' + Date.now()"),'Token UCT previsível');
assert(runtime.includes("if(/^(?:score_|clinical_|uct_|uas7_|snot22_)/.test(nome))erro('Registro clínico de pacientes desativado no Hub.');"),'O runtime público deve bloquear RPCs clínicas');
assert(runtime.includes("window._scoreRpc=function(){return Promise.reject(new Error('O cadastro de pacientes foi desativado.'));};"),'O cadastro clínico deve permanecer desativado');
assert(sql.includes('create or replace function public.clinical_criar_sessao'),'A migração de sessões protegidas deve permanecer disponível');
assert(sql.includes('cs.owner_id=auth.uid()') && sql.includes('cs.expires_at>now()'),'A migração deve verificar proprietário e expiração nas leituras protegidas');
assert(runtime.includes('privacy_submit_request'),'Falta registro de direitos LGPD');
assert(runtime.includes('sessionStorage'),'Credenciais não isoladas por aba');
assert(sql.includes("drop policy if exists read_anon on public.snot22_results"),'RLS de SNOT sem revisão');
assert(sql.includes("drop policy if exists read_anon on public.uct_results"),'RLS de UCT sem revisão');
assert(sql.includes("revoke all on public.snot22_results"),'Revogação do acesso direto ausente');
assert(ia.includes('suspeitaDeIdentificador')&&ia.includes('Cache-Control'),'Validação de IA no servidor ausente');
assert(!/service_role\s*[=:]\s*['"]eyJ/i.test(html),'Chave privilegiada exposta');
for(const f of ['uct-paciente.html','snot22-paciente.html','uas7-paciente.html']){
 const txt=read(f);
 assert(txt.includes('privacidade.html'),'Aviso clínico ausente: '+f);
 assert(txt.includes('no-referrer'),'Política de referer ausente: '+f);
}
assert(read('uct-paciente.html').includes('/rpc/uct_registrar'),'UCT precisa enviar por RPC');
for(const [i,s] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()){
 new vm.Script(s[1],{filename:'inline-script-'+i});
}
new vm.Script(runtime,{filename:'lgpd-runtime.js'});
console.log('LGPD static regression checks OK. As regras do banco e o site publicado requerem teste operacional independente.');
