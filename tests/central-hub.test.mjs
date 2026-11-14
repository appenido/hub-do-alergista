import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const load=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=load('index.html'),admin=load('central-hub.html'),
  adminJs=load('central-hub.js'),events=load('analytics-client.js'),
  backend=load('functions/analytics.js'),sql=load('supabase/migrations/20261109_hub_central_analytics.sql'),
  privacy=load('privacidade.html'),sw=load('sw.js');

test('PWA instala telemetria somente no cliente principal, não em formulários clínicos',()=>{
  const assets=html.match(/src="\/(analytics-client\.js\?v=[0-9a-z-]+)"/)?.[1];
  assert.ok(assets,'cliente de métricas deve existir no Hub');
  assert.ok(sw.includes(assets),'service worker deve armazenar a versão atual');
  assert.match(events,/CHOICE_KEY='hub_analytics_choice_v2'/);
  assert.match(events,/escolha\(\)==='sim'/);
  assert.match(events,/if\(!enabled/);
  assert.doesNotMatch(events,/\.target\.value\b|\b(?:input|textarea|field)\.value\b/);
  assert.doesNotMatch(events,/textContent\s*\)/);
  assert.doesNotMatch(events,/location\.href[^\n]*body:/);
});

test('não há token administrativo, senha, service role ou chave secreta no frontend',()=>{
  assert.match(admin,/autocomplete="current-password"/);
  assert.match(adminJs,/hub_admin_roles/);
  assert.match(adminJs,/hub_analytics_report/);
  assert.match(adminJs,/\/central-auth/);
  assert.match(adminJs,/credentials:'same-origin'/);
  assert.doesNotMatch(adminJs,/service_role|sb_secret_|localStorage/);
  assert.match(adminJs,/sessionStorage\.removeItem\('hub_secure_auth'\)/);
  assert.doesNotMatch(adminJs,/sessionStorage\.(?:getItem|setItem)/);
  assert.doesNotMatch(adminJs,/refresh_token/);
  assert.match(load('functions/central-auth.js'),/HttpOnly/);
  assert.match(load('functions/central-auth.js'),/SameSite=Strict/);
  assert.doesNotMatch(admin,/admin.*password.*value=/i);
});

test('banco restringe leitura ao administrador autenticado e não libera edição de cobranças',()=>{
  assert.match(sql,/alter table public\.hub_admin_roles enable row level security/);
  assert.match(sql,/alter table public\.hub_analytics_events enable row level security/);
  assert.match(sql,/create policy "hub_events_admin_read_only"/);
  assert.match(sql,/auth\.uid\(\)/);
  assert.match(sql,/security invoker/);
  assert.doesNotMatch(sql,/grant select on public\.hub_analytics_events to anon/);
  assert.doesNotMatch(sql,/grant insert on public\.hub_subscriptions/);
  assert.match(sql,/Nenhuma assinatura é cobrada automaticamente/);
});

test('endpoint rejeita dados livres e não envia endereço IP nem conteúdo clínico ao banco',()=>{
  assert.match(backend,/const EVENTOS = new Set/);
  assert.match(backend,/const IDENTIFICADOR/);
  assert.match(backend,/request\.cf/);
  assert.doesNotMatch(backend,/'ip'\s*:|ipAddress|CF-Connecting-IP|X-Forwarded-For/);
  assert.doesNotMatch(backend,/search_term|patient_name|document_text|patient_id/);
});

test('privacidade e não indexação documentadas',()=>{
  assert.match(privacy,/id="metricas"/);
  assert.match(privacy,/revisarMetricas/);
  assert.match(admin,/noindex,nofollow/);
  assert.match(load('_headers'),/\/central-hub\.html[\s\S]*?noindex/);
});

test('fontes JavaScript continuam sintaticamente válidas',()=>{
  assert.doesNotThrow(()=>new Function(events));
  assert.doesNotThrow(()=>new Function(adminJs));
  assert.doesNotThrow(()=>new Function(backend.replaceAll('export async function','async function')));
  assert.doesNotThrow(()=>new Function(load('central-inteligencia.js')));
  assert.doesNotThrow(()=>new Function(load('central-saude.js')));
  assert.doesNotThrow(()=>new Function(load('functions/health-analytics.js').replaceAll('export async function','async function')));
});
