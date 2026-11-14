-- Central de Acessos — exclusividade estrutural da conta administradora.
-- Este índice impede que mais de uma linha de proprietário exista ao mesmo tempo.
-- Migração já aplicada no Supabase em 14/11/2026.
create unique index if not exists hub_admin_roles_single_owner_idx
 on public.hub_admin_roles ((true));
