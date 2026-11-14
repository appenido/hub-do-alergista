-- Home executiva do Hub do Alergista, 14/11/2026.
-- Apenas eventos autorizados, não usuários únicos; acesso controlado via RLS.
-- Instalada na produção Supabase; migração espelhada para versionamento.
CREATE OR REPLACE FUNCTION public.hub_analytics_home(p_days integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare result jsonb;
begin
 if p_days is null or p_days<1 or p_days>365 then
  raise exception 'Período inválido' using errcode='22023';
 end if;
 if not exists(select 1 from public.hub_admin_roles a where a.user_id=(select auth.uid())) then
  raise exception 'Acesso restrito ao administrador' using errcode='42501';
 end if;
 with
 starts as materialized (
   select e.session_key,e.recorded_at,e.country,e.region,e.city
   from public.hub_analytics_events e
   where e.event_type='session_start'
   and e.recorded_at >= now()-make_interval(days=>p_days)
 ),
 views as materialized (
   select e.session_key,e.feature,e.recorded_at from public.hub_analytics_events e
   where e.event_type='page_view'
   and e.recorded_at >= now()-make_interval(days=>p_days)
 ),
 days as (
   select (recorded_at at time zone 'America/Sao_Paulo')::date as day_local,
   count(distinct session_key)::int as sessions
   from starts group by 1
 ),
 features as (
  select feature,count(*)::int as views,count(distinct session_key)::int as sessions
  from views group by feature order by views desc,sessions desc limit 12
 ),
 recent as (
  select recorded_at,event_type,feature,action,device,city,region,country
  from public.hub_analytics_events
  where recorded_at >= now()-make_interval(days=>p_days)
  order by recorded_at desc limit 12
 )
 select jsonb_build_object(
   'generated_at',now(),
   'days',p_days,
   'today',(
    select count(distinct session_key)::int from starts
    where (recorded_at at time zone 'America/Sao_Paulo')::date=(now() at time zone 'America/Sao_Paulo')::date
   ),
   'yesterday',(
    select count(distinct session_key)::int
    from public.hub_analytics_events
    where event_type='session_start'
    and (recorded_at at time zone 'America/Sao_Paulo')::date=(now() at time zone 'America/Sao_Paulo')::date-1
   ),
   'last_hour',(
    select count(distinct session_key)::int
    from public.hub_analytics_events
    where event_type='session_start' and recorded_at>=now()-interval '1 hour'
   ),
   'active_last_hour',(
    select count(distinct session_key)::int
    from public.hub_analytics_events
    where recorded_at>=now()-interval '1 hour'
   ),
   'period_sessions',(select count(distinct session_key)::int from starts),
   'daily',(select coalesce(jsonb_agg(to_jsonb(d) order by d.day_local),'[]'::jsonb) from days d),
   'top_features',(select coalesce(jsonb_agg(to_jsonb(f) order by f.views desc),'[]'::jsonb) from features f),
   'recent',(select coalesce(jsonb_agg(to_jsonb(r) order by r.recorded_at desc),'[]'::jsonb) from recent r)
 ) into result;
 return result;
end;
$function$
;
revoke all on function public.hub_analytics_home(integer) from public,anon;
grant execute on function public.hub_analytics_home(integer) to authenticated;
