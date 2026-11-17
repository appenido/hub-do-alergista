-- Entrega segura do último score de sessões QR, mesmo com a tela do médico fechada.
-- Não contém nome, CPF, e-mail, telefone ou prontuário. Acesso exclusivo por Edge Function.
create table if not exists public.score_qr_last_deliveries (
  topic text primary key check (topic ~ '^score-qr-[a-f0-9]{48}$'),
  score text not null check (score in ('act','uct','dlqi','snot22','vasolfato','vasprurido')),
  values jsonb not null check (jsonb_typeof(values) = 'array'),
  total numeric not null,
  received_at timestamptz not null default now(),
  expires_at timestamptz not null
);
alter table public.score_qr_last_deliveries enable row level security;
revoke all on public.score_qr_last_deliveries from PUBLIC, anon, authenticated;
create index if not exists score_qr_last_deliveries_expires_idx on public.score_qr_last_deliveries (expires_at);
comment on table public.score_qr_last_deliveries is 'Resposta QR pseudônima por sessão para recuperação durante 7 dias; protegida por segredo exclusivo do profissional. Sem acesso direto ao cliente.';