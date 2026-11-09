-- Central privada de uso do Hub do Alergista.
-- Não altera tabelas clínicas, financeiras ou de outras aplicações no projeto compartilhado.
create table if not exists public.hub_admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.hub_admin_roles enable row level security;
revoke all on public.hub_admin_roles from public, anon, authenticated;
grant select on public.hub_admin_roles to authenticated;
create policy "hub_admin_self_lookup"
  on public.hub_admin_roles for select to authenticated
  using ((select auth.uid()) = user_id);

insert into public.hub_admin_roles(user_id)
select id from auth.users
where lower(email) = 'drantoniopenidoalergia@gmail.com' and email_confirmed_at is not null
on conflict (user_id) do nothing;

create table if not exists public.hub_analytics_events (
  id bigint generated always as identity primary key,
  recorded_at timestamptz not null default now(),
  session_key uuid not null,
  event_type text not null check(event_type in ('session_start','page_view','click','feature_open','screen_time')),
  feature text not null check(length(feature) between 1 and 64 and feature ~ '^[a-zA-Z0-9_.:-]+$'),
  action text not null default '-' check(length(action) between 1 and 80 and action ~ '^[a-zA-Z0-9_.:-]+$'),
  seconds_visible integer not null default 0 check(seconds_visible between 0 and 3600),
  country text check(country ~ '^[A-Z]{2}$'),
  region text check(length(region) <= 60),
  device text not null check(device in ('celular','tablet','computador','outro')),
  os text not null check(os in ('Android','iOS','Windows','macOS','Linux','Outro')),
  browser text not null check(browser in ('Chrome','Safari','Edge','Firefox','Samsung Internet','Outro')),
  display_mode text not null check(display_mode in ('PWA','navegador')),
  viewport text not null check(viewport in ('pequena','media','grande')),
  referrer_host text not null default 'direto' check(length(referrer_host) between 1 and 100 and referrer_host ~ '^[a-zA-Z0-9_.:-]+$'),
  source text not null default 'hub-pwa' check(source = 'hub-pwa')
);
alter table public.hub_analytics_events enable row level security;
revoke all on public.hub_analytics_events from public, anon, authenticated;
grant insert on public.hub_analytics_events to anon, authenticated;
grant select on public.hub_analytics_events to authenticated;
grant usage, select on sequence public.hub_analytics_events_id_seq to anon, authenticated;
create policy "hub_events_ingest_only"
  on public.hub_analytics_events for insert to anon, authenticated
  with check(source='hub-pwa' and recorded_at > now()-interval '2 minutes' and recorded_at < now()+interval '2 minutes');
create policy "hub_events_admin_read_only"
  on public.hub_analytics_events for select to authenticated
  using(exists (select 1 from public.hub_admin_roles a where a.user_id = (select auth.uid())));
create index if not exists hub_analytics_events_recorded_idx on public.hub_analytics_events(recorded_at desc);
create index if not exists hub_analytics_events_feature_idx on public.hub_analytics_events(feature,recorded_at desc);
create index if not exists hub_analytics_events_session_idx on public.hub_analytics_events(session_key);

-- Preparação dos estados de assinatura; nenhum fluxo financeiro é ativado.
create table if not exists public.hub_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_code text not null default 'gratuito' check(plan_code in ('gratuito','mensal','anual')),
  status text not null default 'gratuito' check(status in ('gratuito','teste','ativo','vencido','cancelado')),
  billing_provider text,
  provider_customer_id text,
  current_period_ends_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.hub_subscriptions enable row level security;
revoke all on public.hub_subscriptions from public, anon, authenticated;
grant select on public.hub_subscriptions to authenticated;
create policy "hub_subs_user_or_admin_read"
  on public.hub_subscriptions for select to authenticated
  using ((select auth.uid()) = user_id or exists (
    select 1 from public.hub_admin_roles a where a.user_id = (select auth.uid())
  ));

-- Relatório agregado executado com RLS do usuário logado (security invoker).
create or replace function public.hub_analytics_report(p_days integer default 30)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  output jsonb;
begin
  if p_days is null or p_days < 1 or p_days > 365 then
    raise exception 'Período inválido' using errcode='22023';
  end if;
  if not exists (
    select 1 from public.hub_admin_roles a where a.user_id = (select auth.uid())
  ) then
    raise exception 'Acesso restrito ao administrador' using errcode='42501';
  end if;
  with base as materialized (
    select e.* from public.hub_analytics_events e
    where e.recorded_at >= now() - (p_days || ' days')::interval
  ),
  totals as (
    select count(*)::int as events,
      count(distinct session_key)::int as sessions,
      count(*) filter(where event_type='page_view')::int as page_views,
      count(*) filter(where event_type='click')::int as clicks,
      count(*) filter(where event_type='feature_open')::int as features_opened,
      coalesce(sum(seconds_visible),0)::int as seconds_visible
    from base
  ),
  daily as (
    select coalesce(jsonb_agg(jsonb_build_object('date',day,'sessions',sessions,'views',views,'clicks',clicks) order by day),'[]'::jsonb) v
    from (
      select (recorded_at at time zone 'America/Sao_Paulo')::date as day,
        count(distinct session_key)::int sessions,
        count(*) filter(where event_type='page_view')::int views,
        count(*) filter(where event_type='click')::int clicks
      from base group by 1 order by 1
    ) d
  ),
  features as (
    select coalesce(jsonb_agg(jsonb_build_object('name',feature,'count',n) order by n desc),'[]'::jsonb) v
    from (
      select feature,count(*)::int n from base
      where event_type in ('page_view','feature_open','click')
      group by feature order by n desc limit 35
    ) f
  ),
  actions as (
    select coalesce(jsonb_agg(jsonb_build_object('feature',feature,'action',action,'count',n) order by n desc),'[]'::jsonb) v
    from (
      select feature,action,count(*)::int n from base
      where event_type='click' group by feature,action order by n desc limit 60
    ) f
  ),
  locations as (
    select coalesce(jsonb_agg(jsonb_build_object('country',country,'region',region,'sessions',n) order by n desc),'[]'::jsonb) v
    from (
      select coalesce(country,'Não informado') country,
        coalesce(region,'Não informado') region,
        count(distinct session_key)::int n from base
      group by 1,2 order by n desc limit 40
    ) f
  ),
  devices as (
    select coalesce(jsonb_agg(jsonb_build_object('name',device,'sessions',n) order by n desc),'[]'::jsonb) v
    from (select device,count(distinct session_key)::int n from base group by device order by n desc) f
  ),
  operating_systems as (
    select coalesce(jsonb_agg(jsonb_build_object('name',os,'sessions',n) order by n desc),'[]'::jsonb) v
    from (select os,count(distinct session_key)::int n from base group by os order by n desc) f
  ),
  browsers as (
    select coalesce(jsonb_agg(jsonb_build_object('name',browser,'sessions',n) order by n desc),'[]'::jsonb) v
    from (select browser,count(distinct session_key)::int n from base group by browser order by n desc) f
  ),
  sources as (
    select coalesce(jsonb_agg(jsonb_build_object('name',referrer_host,'sessions',n) order by n desc),'[]'::jsonb) v
    from (select referrer_host,count(distinct session_key)::int n from base group by referrer_host order by n desc limit 30) f
  ),
  hours as (
    select coalesce(jsonb_agg(jsonb_build_object('hour',hr,'sessions',n) order by hr),'[]'::jsonb) v
    from (
      select extract(hour from recorded_at at time zone 'America/Sao_Paulo')::int hr,
        count(distinct session_key)::int n from base where event_type='session_start'
      group by 1 order by 1
    ) f
  ),
  recent as (
    select coalesce(jsonb_agg(jsonb_build_object(
      'at',recorded_at,'type',event_type,'feature',feature,'action',action,
      'device',device,'region',region,'country',country
    ) order by recorded_at desc),'[]'::jsonb) v
    from (select * from base order by recorded_at desc limit 40) f
  )
  select jsonb_build_object(
    'days',p_days,'generated_at',now(),
    'totals',to_jsonb(t),'daily',d.v,'features',f.v,'actions',a.v,
    'locations',l.v,'devices',dv.v,'operating_systems',o.v,
    'browsers',b.v,'sources',s.v,'hours',h.v,'recent',r.v
  )
  into output
  from totals t cross join daily d cross join features f cross join actions a
  cross join locations l cross join devices dv cross join operating_systems o
  cross join browsers b cross join sources s cross join hours h cross join recent r;
  return output;
end;
$$;
revoke all on function public.hub_analytics_report(integer) from public, anon;
grant execute on function public.hub_analytics_report(integer) to authenticated;
comment on table public.hub_analytics_events is 'Métricas mínimas e pseudônimas do Hub; sem IP, texto livre, dados clínicos ou identificadores persistentes.';
comment on table public.hub_subscriptions is 'Estrutura reservada para faturamento futuro. Nenhuma assinatura é cobrada automaticamente.';
