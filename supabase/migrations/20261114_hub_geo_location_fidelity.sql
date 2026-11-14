-- Hub do Alergista — precisão de localidade, 14/11/2026.
-- Cidades só são informadas quando efetivamente presentes nos dados.
-- Sessões históricas sem cidade são agrupadas pelo estado/região, sem estimativa fictícia.
-- Esta função já foi publicada no Supabase. Arquivo reproduzível para controle de versão.
-- Não adiciona coleta de IP, GPS nem dados clínicos.
CREATE OR REPLACE FUNCTION public.hub_analytics_extended_report(p_days integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
declare output jsonb;
begin
 if p_days is null or p_days<1 or p_days>365 then raise exception 'Período inválido'; end if;
 if not exists(select 1 from public.hub_admin_roles where user_id=(select auth.uid()))
 then raise exception 'Acesso restrito ao administrador' using errcode='42501'; end if;
 with base as materialized (
 select id,recorded_at,session_key,event_type,feature,action,seconds_visible,country,region,city,
 display_mode,viewport,referrer_host from public.hub_analytics_events
 where recorded_at>=now()-make_interval(days=>p_days)
 ),
 sess as materialized (
 select session_key,min(recorded_at) started,max(recorded_at) last_at,
 count(*) filter(where event_type='page_view')::int views,
 count(*) filter(where event_type='click')::int clicks,
 coalesce(sum(seconds_visible) filter(where event_type='screen_time'),0)::bigint visible,
 (array_agg(nullif(btrim(country),'') order by recorded_at)
   filter (where nullif(btrim(country),'') is not null))[1] country,
 (array_agg(nullif(btrim(region),'') order by recorded_at)
   filter (where nullif(btrim(region),'') is not null))[1] region,
 (array_agg(nullif(btrim(city),'') order by recorded_at)
   filter (where nullif(btrim(city),'') is not null))[1] city,
 (array_agg(display_mode order by recorded_at))[1] display_mode,
 (array_agg(viewport order by recorded_at))[1] viewport,
 (array_agg(referrer_host order by recorded_at))[1] referrer_host
 from base group by session_key
 ),
 pages as materialized (
 select session_key,feature,recorded_at,
 row_number() over(partition by session_key order by recorded_at,id) entry_rank,
 row_number() over(partition by session_key order by recorded_at desc,id desc) exit_rank,
 lead(feature) over(partition by session_key order by recorded_at,id) next_feature
 from base where event_type='page_view'
 )
 select jsonb_build_object(
 'generated_at',now(),'period_days',p_days,
 'totals',(select jsonb_build_object(
 'sessions',count(*),'engaged',count(*) filter(where visible>=10 or views>=2 or clicks>=1),
 'single_page',count(*) filter(where views=1),
 'bounce',count(*) filter(where views<=1 and clicks=0 and visible<10),
 'avg_visible_seconds',round(coalesce(avg(visible),0),1),
 'median_visible_seconds',coalesce(percentile_cont(0.5) within group(order by visible),0),
 'avg_pages',round(coalesce(avg(views),0),2),
 'avg_clicks',round(coalesce(avg(clicks),0),2),
 'pwa_sessions',count(*) filter(where display_mode='PWA'),
 'recent_5min',count(*) filter(where last_at>=now()-interval '5 minutes'),
 'recent_15min',count(*) filter(where last_at>=now()-interval '15 minutes'),
 'first_seen',min(started),'last_seen',max(last_at),
 'identified_countries',count(*) filter(where country is not null),
 'identified_cities',count(*) filter(where city is not null),
 'identified_regions',count(*) filter(where region is not null)
 ) from sess),
 'previous',(select jsonb_build_object('sessions',count(distinct session_key),
 'views',count(*) filter(where event_type='page_view'),
 'clicks',count(*) filter(where event_type='click'))
 from public.hub_analytics_events where recorded_at>=now()-make_interval(days=>(2*p_days))
 and recorded_at<now()-make_interval(days=>p_days)),
 'features',(select coalesce(jsonb_agg(to_jsonb(f) order by f.views desc,f.clicks desc),'[]'::jsonb)
 from (select feature,count(*) filter(where event_type='page_view')::int views,
 count(*) filter(where event_type='click')::int clicks,
 count(distinct session_key)::int sessions,
 coalesce(sum(seconds_visible) filter(where event_type='screen_time'),0)::bigint visible_seconds
 from base group by feature order by views desc,clicks desc limit 50) f),
 'entrances',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select feature,count(*)::int sessions from pages where entry_rank=1 group by feature
 order by sessions desc limit 25) f),
 'exits',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select feature,count(*)::int sessions from pages where exit_rank=1 group by feature
 order by sessions desc limit 25) f),
 'flows',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select feature origin,next_feature destination,count(*)::int sessions
 from pages where next_feature is not null and feature<>next_feature
 group by feature,next_feature order by sessions desc limit 35) f),
 'cities',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select city,region,coalesce(country,'—') country,
 case when city is not null then 'cidade' when region is not null then 'região' else 'país' end as location_precision,
 count(*)::int sessions from sess group by 1,2,3,4 order by sessions desc limit 60) f),
 'countries',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select coalesce(nullif(country,''),'Não informado') country,count(*)::int sessions
 from sess group by 1 order by sessions desc limit 35) f),
 'display_modes',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select coalesce(display_mode,'Não informado') name,count(*)::int sessions
 from sess group by 1 order by sessions desc) f),
 'viewports',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select coalesce(viewport,'Não informado') name,count(*)::int sessions
 from sess group by 1 order by sessions desc) f),
 'weekday',(select coalesce(jsonb_agg(to_jsonb(f) order by f.weekday),'[]'::jsonb)
 from (select extract(isodow from started at time zone 'America/Sao_Paulo')::int weekday,
 count(*)::int sessions from sess group by 1 order by 1) f),
 'heatmap',(select coalesce(jsonb_agg(to_jsonb(f) order by f.weekday,f.slot_hour),'[]'::jsonb)
 from (select extract(isodow from started at time zone 'America/Sao_Paulo')::int weekday,
 extract(hour from started at time zone 'America/Sao_Paulo')::int slot_hour,
 count(*)::int sessions from sess group by 1,2 order by 1,2) f),
 'session_sources',(select coalesce(jsonb_agg(to_jsonb(f) order by f.sessions desc),'[]'::jsonb)
 from (select coalesce(nullif(referrer_host,''),'direto') name,count(*)::int sessions
 from sess group by 1 order by sessions desc limit 40) f)
 ) into output;
 return output;
end;$function$
;
revoke all on function public.hub_analytics_extended_report(integer) from public,anon;
grant execute on function public.hub_analytics_extended_report(integer) to authenticated;
