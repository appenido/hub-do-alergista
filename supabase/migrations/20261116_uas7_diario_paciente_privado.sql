-- UAS7 diario: dados identificados isolados dos scores anonimos.
-- A leitura e a escrita ocorrem exclusivamente por Edge Function com tokens de 256 bits.
create table if not exists public.uas7_acompanhamentos (
  id uuid primary key default gen_random_uuid(),
  token_paciente_sha text not null unique check (token_paciente_sha ~ '^[0-9a-f]{64}$'),
  token_profissional_sha text not null unique check (token_profissional_sha ~ '^[0-9a-f]{64}$'),
  nome text check (nome is null or char_length(nome) between 3 and 100),
  idade smallint check (idade between 0 and 120),
  cidade_origem text check (cidade_origem is null or char_length(cidade_origem) between 2 and 100),
  consentimento_em timestamptz,
  inicio_em date,
  expira_link_paciente_em timestamptz not null default (now() + interval '45 days'),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint uas7_cadastro_integral check (
    (nome is null and idade is null and cidade_origem is null and consentimento_em is null and inicio_em is null) or
    (nome is not null and idade is not null and cidade_origem is not null and consentimento_em is not null and inicio_em is not null)
  )
);
create table if not exists public.uas7_respostas_diarias (
  id uuid primary key default gen_random_uuid(),
  acompanhamento_id uuid not null references public.uas7_acompanhamentos(id) on delete cascade,
  data_ref date not null,
  papulas smallint not null check (papulas between 0 and 3),
  prurido smallint not null check (prurido between 0 and 3),
  registrado_em timestamptz not null default now(),
  unique (acompanhamento_id, data_ref)
);
create index if not exists uas7_respostas_diarias_acompanhamento_idx
  on public.uas7_respostas_diarias (acompanhamento_id, data_ref);
alter table public.uas7_acompanhamentos enable row level security;
alter table public.uas7_respostas_diarias enable row level security;
revoke all on public.uas7_acompanhamentos, public.uas7_respostas_diarias from public, anon, authenticated;
grant all on public.uas7_acompanhamentos, public.uas7_respostas_diarias to service_role;
comment on table public.uas7_acompanhamentos is 'Dados pessoais sensiveis. Sem acesso Data API anon/autenticado; somente backend autorizado.';
comment on table public.uas7_respostas_diarias is 'UAS7: uma resposta por data civil; zero nao e atribuido a dias ausentes.';