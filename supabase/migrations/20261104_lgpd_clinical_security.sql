-- Migração LGPD 2026-11-04: não elimina registros.
-- Trocar chamadas do frontend por JWT de usuário autenticado antes de aplicar.
begin;

create table if not exists public.clinical_sessions (
  sessao_id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('snot22','uct','uas7')),
  criado_em timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists clinical_sessions_owner_idx on public.clinical_sessions(owner_id,expires_at);
alter table public.clinical_sessions enable row level security;
revoke all on public.clinical_sessions from public,anon,authenticated;
grant select on public.clinical_sessions to authenticated;
drop policy if exists clinical_sessions_owner_select on public.clinical_sessions;
create policy clinical_sessions_owner_select on public.clinical_sessions
  for select to authenticated using (owner_id=(select auth.uid()));

create or replace function public.clinical_criar_sessao(p_tipo text)
returns text language plpgsql security definer set search_path=''
as $$
declare v_owner uuid; v_id text;
begin
  v_owner:=auth.uid();
  if v_owner is null then raise exception 'Autenticacao obrigatoria'; end if;
  if p_tipo not in ('snot22','uct','uas7') then raise exception 'Tipo invalido'; end if;
  v_id:=p_tipo||'-'||replace(gen_random_uuid()::text,'-','');
  insert into public.clinical_sessions(sessao_id,owner_id,tipo,expires_at)
  values (v_id,v_owner,p_tipo,now()+
    case when p_tipo='uas7' then interval '21 days' else interval '48 hours' end);
  return v_id;
end $$;
revoke all on function public.clinical_criar_sessao(text) from public,anon,authenticated;
grant execute on function public.clinical_criar_sessao(text) to authenticated;

create or replace function public.snot22_da_sessao(p_sessao text)
returns table(paciente_nome text,respostas jsonb,total integer,data_ref date,created_at timestamptz)
language sql stable security definer set search_path=''
as $$
  select r.paciente_nome,r.respostas,r.total,r.data_ref,r.created_at
    from public.snot22_results r
    join public.clinical_sessions cs on cs.sessao_id=r.sessao_id
   where cs.sessao_id=p_sessao
     and cs.tipo='snot22'
     and cs.owner_id=auth.uid()
     and cs.expires_at>now()
   order by r.created_at desc limit 1
$$;
revoke all on function public.snot22_da_sessao(text) from public,anon,authenticated;
grant execute on function public.snot22_da_sessao(text) to authenticated;

create or replace function public.snot22_registrar(
 p_sessao text,p_respostas jsonb,p_total integer,
 p_paciente text default null,p_data date default null,p_origem text default 'paciente')
returns void language plpgsql security definer set search_path=''
as $$
begin
  if not exists(select 1 from public.clinical_sessions
     where sessao_id=p_sessao and tipo='snot22' and expires_at>now()) then
     raise exception 'Sessao invalida ou expirada';
  end if;
  if p_total is null or p_total<0 or p_total>110
    or jsonb_typeof(p_respostas)!='array' or jsonb_array_length(p_respostas)!=22 then
    raise exception 'Respostas invalidas';
  end if;
  if exists(select 1 from public.snot22_results where sessao_id=p_sessao) then
    raise exception 'Questionario ja recebido';
  end if;
  insert into public.snot22_results(sessao_id,paciente_nome,respostas,total,data_ref,origem)
    values(p_sessao,left(nullif(trim(p_paciente),''),80),p_respostas,p_total,
      coalesce(p_data,current_date),'paciente');
end $$;
revoke all on function public.snot22_registrar(text,jsonb,integer,text,date,text) from public,anon,authenticated;
grant execute on function public.snot22_registrar(text,jsonb,integer,text,date,text) to anon,authenticated;

create or replace function public.uct_da_sessao(p_sessao text)
returns setof public.uct_results
language sql stable security definer set search_path=''
as $$
  select u.* from public.uct_results u
  join public.clinical_sessions cs on cs.sessao_id=u.sessao_id
  where cs.sessao_id=p_sessao
    and cs.tipo='uct'
    and cs.owner_id=auth.uid()
    and cs.expires_at>now()
  order by u.created_at desc limit 1
$$;
revoke all on function public.uct_da_sessao(text) from public,anon,authenticated;
grant execute on function public.uct_da_sessao(text) to authenticated;

create or replace function public.uct_registrar(
 p_sessao text,p_paciente text,p_q1 integer,p_q2 integer,p_q3 integer,p_q4 integer)
returns void language plpgsql security definer set search_path=''
as $$
begin
 if not exists(select 1 from public.clinical_sessions
   where sessao_id=p_sessao and tipo='uct' and expires_at>now()) then
   raise exception 'Sessao invalida ou expirada';
 end if;
 if p_q1 not between 0 and 4 or p_q2 not between 0 and 4
 or p_q3 not between 0 and 4 or p_q4 not between 0 and 4 then
   raise exception 'Respostas invalidas';
 end if;
 if exists(select 1 from public.uct_results where sessao_id=p_sessao) then
   raise exception 'Questionario ja recebido';
 end if;
 insert into public.uct_results(sessao_id,paciente_nome,q1,q2,q3,q4,total)
 values(p_sessao,left(nullif(trim(p_paciente),''),80),p_q1,p_q2,p_q3,p_q4,
   (p_q1+p_q2+p_q3+p_q4));
end $$;
revoke all on function public.uct_registrar(text,text,integer,integer,integer,integer)
 from public,anon,authenticated;
grant execute on function public.uct_registrar(text,text,integer,integer,integer,integer)
 to anon,authenticated;

create or replace function public.uas7_da_sessao(p_sessao text)
returns table(dia smallint,data_ref date,papulas smallint,prurido smallint,
  paciente text,created_at timestamptz)
language sql stable security definer set search_path=''
as $$
  select r.dia,r.data_ref,r.papulas,r.prurido,r.paciente,r.created_at
  from public.uas7_registros r
  join public.clinical_sessions cs on cs.sessao_id=r.sessao_id
  where cs.sessao_id=p_sessao and cs.tipo='uas7' and cs.expires_at>now()
  order by r.dia
$$;
-- UAS7: o link aleatório funciona como credencial temporária do paciente.
-- Permitir leitura apenas por RPC, jamais consulta direta na tabela.
revoke all on function public.uas7_da_sessao(text) from public,anon,authenticated;
grant execute on function public.uas7_da_sessao(text) to anon,authenticated;

create or replace function public.uas7_registrar(
 p_sessao text,p_dia integer,p_data date,p_papulas integer,p_prurido integer,
 p_paciente text default null)
returns void language plpgsql security definer set search_path=''
as $$
begin
  if not exists(select 1 from public.clinical_sessions
    where sessao_id=p_sessao and tipo='uas7' and expires_at>now()) then
      raise exception 'Sessao invalida ou expirada';
  end if;
  if p_dia not between 1 and 7 or p_papulas not between 0 and 3
  or p_prurido not between 0 and 3 then raise exception 'Resposta invalida'; end if;
  insert into public.uas7_registros(sessao_id,dia,data_ref,papulas,prurido,paciente)
    values(p_sessao,p_dia,coalesce(p_data,current_date),p_papulas,p_prurido,
      left(nullif(trim(p_paciente),''),80))
  on conflict(sessao_id,dia) do update set
    data_ref=excluded.data_ref,papulas=excluded.papulas,
    prurido=excluded.prurido,
    paciente=coalesce(excluded.paciente,public.uas7_registros.paciente),
    created_at=now();
end $$;
revoke all on function public.uas7_registrar(text,integer,date,integer,integer,text)
 from public,anon,authenticated;
grant execute on function public.uas7_registrar(text,integer,date,integer,integer,text)
 to anon,authenticated;

-- Associar dados históricos a titulares autenticados, sem eliminar registros.
alter table public.score_registros add column if not exists owner_id uuid references auth.users(id);
create index if not exists score_registros_owner_idx on public.score_registros(owner_id);
update public.score_registros r set owner_id=u.id from auth.users u
 where r.owner_id is null and lower(r.medico_email)=lower(u.email);
create schema if not exists private;
create or replace function private.score_owner(p_email text)
returns uuid language plpgsql stable security definer set search_path=''
as $$
declare v_id uuid;v_email text;
begin
 v_id:=auth.uid();
 if v_id is null then raise exception 'Login obrigatorio'; end if;
 select lower(email) into v_email from auth.users where id=v_id;
 if v_email is null or v_email<>lower(trim(p_email)) then
   raise exception 'Acesso nao autorizado';
 end if;
 return v_id;
end $$;
revoke all on schema private from public,anon,authenticated;
revoke all on function private.score_owner(text) from public,anon,authenticated;

create or replace function public.score_pacientes(p_email text)
returns table(paciente_nome text,paciente_chave text,registros bigint,
  ultimo timestamptz,scores text)
language sql stable security definer set search_path=''
as $$
 select min(r.paciente_nome),r.paciente_chave,count(*)::bigint,max(r.created_at),
  string_agg(distinct r.score,',')
 from public.score_registros r
 where (r.owner_id=private.score_owner(p_email)
    or (r.owner_id is null and r.medico_email=lower(trim(p_email))))
 group by r.paciente_chave order by max(r.created_at) desc limit 300
$$;
create or replace function public.score_do_paciente(p_email text,p_paciente text)
returns table(id bigint,paciente_nome text,score text,total numeric,
 score_txt text,rotulo text,detalhes jsonb,data_ref date,origem text,created_at timestamptz)
language sql stable security definer set search_path=''
as $$
 select r.id,r.paciente_nome,r.score,r.total,r.score_txt,r.rotulo,
  r.detalhes,r.data_ref,r.origem,r.created_at
 from public.score_registros r
 where (r.owner_id=private.score_owner(p_email)
    or (r.owner_id is null and r.medico_email=lower(trim(p_email))))
 and r.paciente_chave=public.score_chave(p_paciente)
 order by r.created_at desc limit 500
$$;
create or replace function public.score_salvar(
 p_email text,p_paciente text,p_score text,p_total numeric,p_score_txt text,
 p_rotulo text,p_detalhes jsonb default null,p_data date default null,
 p_origem text default 'medico')
returns bigint language plpgsql security definer set search_path=''
as $$
declare v_owner uuid;v_id bigint;v_paciente text;v_chave text;v_canon text;
begin
 v_owner:=private.score_owner(p_email);
 v_paciente:=left(nullif(trim(p_paciente),''),120);
 if v_paciente is null or nullif(trim(p_score),'') is null then
   raise exception 'Dados insuficientes';
 end if;
 v_chave:=public.score_chave(v_paciente);
 select r.paciente_nome into v_canon from public.score_registros r
 where (r.owner_id=v_owner or
 (r.owner_id is null and r.medico_email=lower(trim(p_email))))
 and r.paciente_chave=v_chave order by r.created_at limit 1;
 insert into public.score_registros(owner_id,medico_email,paciente_nome,
   paciente_chave,score,total,score_txt,rotulo,detalhes,data_ref,origem)
 values(v_owner,lower(trim(p_email)),coalesce(v_canon,v_paciente),v_chave,
   left(p_score,100),p_total,left(p_score_txt,100),left(p_rotulo,250),
   p_detalhes,coalesce(p_data,current_date),coalesce(p_origem,'medico'))
 returning id into v_id;
 return v_id;
end $$;
create or replace function public.score_editar(
 p_email text,p_id bigint,p_paciente text default null,p_data date default null)
returns void language plpgsql security definer set search_path=''
as $$
declare v_owner uuid;v_pac text;
begin
 v_owner:=private.score_owner(p_email);
 v_pac:=left(nullif(trim(p_paciente),''),120);
 update public.score_registros r set
  paciente_nome=coalesce(v_pac,r.paciente_nome),
  paciente_chave=case when v_pac is null then r.paciente_chave
                     else public.score_chave(v_pac) end,
  data_ref=coalesce(p_data,r.data_ref),
  owner_id=coalesce(r.owner_id,v_owner)
 where r.id=p_id and (r.owner_id=v_owner or
  (r.owner_id is null and r.medico_email=lower(trim(p_email))));
end $$;
create or replace function public.score_apagar(p_email text,p_id bigint)
returns void language plpgsql security definer set search_path=''
as $$
declare v_owner uuid;
begin
 v_owner:=private.score_owner(p_email);
 delete from public.score_registros r
 where r.id=p_id and (r.owner_id=v_owner or
   (r.owner_id is null and r.medico_email=lower(trim(p_email))));
end $$;
revoke all on function public.score_pacientes(text) from public,anon,authenticated;
revoke all on function public.score_do_paciente(text,text) from public,anon,authenticated;
revoke all on function public.score_salvar(text,text,text,numeric,text,text,jsonb,date,text)
 from public,anon,authenticated;
revoke all on function public.score_editar(text,bigint,text,date) from public,anon,authenticated;
revoke all on function public.score_apagar(text,bigint) from public,anon,authenticated;
grant execute on function public.score_pacientes(text) to authenticated;
grant execute on function public.score_do_paciente(text,text) to authenticated;
grant execute on function public.score_salvar(text,text,text,numeric,text,text,jsonb,date,text)
 to authenticated;
grant execute on function public.score_editar(text,bigint,text,date) to authenticated;
grant execute on function public.score_apagar(text,bigint) to authenticated;

create table if not exists public.privacy_requests(
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 kind text not null check(kind in ('acesso_correcao','exclusao')),
 status text not null default 'pendente' check(status in ('pendente','em_analise','respondida','concluida')),
 criado_em timestamptz not null default now(),
 resolvida_em timestamptz,
 observacao_interna text
);
alter table public.privacy_requests enable row level security;
revoke all on public.privacy_requests from public,anon,authenticated;
grant select on public.privacy_requests to authenticated;
drop policy if exists privacy_requests_own_select on public.privacy_requests;
create policy privacy_requests_own_select on public.privacy_requests
 for select to authenticated using(owner_id=(select auth.uid()));
create or replace function public.privacy_submit_request(p_kind text)
returns uuid language plpgsql security definer set search_path=''
as $$
declare v_owner uuid;v_id uuid;
begin
 v_owner:=auth.uid();
 if v_owner is null then raise exception 'Login obrigatorio'; end if;
 if p_kind not in('acesso_correcao','exclusao') then raise exception 'Tipo invalido'; end if;
 insert into public.privacy_requests(owner_id,kind)
 values(v_owner,p_kind) returning id into v_id;
 return v_id;
end $$;
revoke all on function public.privacy_submit_request(text) from public,anon,authenticated;
grant execute on function public.privacy_submit_request(text) to authenticated;

-- Dados sensíveis: jamais permitir leitura/escrita por REST direta.
drop policy if exists read_anon on public.snot22_results;
drop policy if exists insert_public on public.snot22_results;
drop policy if exists read_anon on public.uct_results;
drop policy if exists insert_public on public.uct_results;
revoke all on public.snot22_results,public.uct_results,public.uas7_registros,
 public.score_registros from public,anon,authenticated;

commit;
