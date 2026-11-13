-- Localização aproximada por infraestrutura, apenas após consentimento.
-- Sem coleta nem persistência do endereço IP, GPS ou geolocalização exata.
alter table public.hub_analytics_events
  add column if not exists city text,
  add column if not exists geo_lat numeric(5,1),
  add column if not exists geo_lon numeric(5,1);
alter table public.hub_analytics_events
  add constraint hub_analytics_city_length check (city is null or length(city) <= 80),
  add constraint hub_analytics_geo_lat_range check (geo_lat is null or geo_lat between -90 and 90),
  add constraint hub_analytics_geo_lon_range check (geo_lon is null or geo_lon between -180 and 180),
  add constraint hub_analytics_geo_pair check ((geo_lat is null) = (geo_lon is null));
create index if not exists hub_analytics_events_map_idx
  on public.hub_analytics_events(event_type, recorded_at desc);
comment on column public.hub_analytics_events.city is
  'Cidade estimada pela rede, quando disponível; não é localização por GPS.';
comment on column public.hub_analytics_events.geo_lat is
  'Latitude aproximada obtida da infraestrutura e arredondada a 0,1 grau.';
comment on column public.hub_analytics_events.geo_lon is
  'Longitude aproximada obtida da infraestrutura e arredondada a 0,1 grau.';
