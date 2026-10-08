-- Tabela de notas pessoais: cada usuário só lê e cria as próprias notas.

create table public.notas (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  texto text not null check (length(trim(texto)) > 0),
  criado_em timestamptz not null default now()
);

create index notas_user_id_idx on public.notas (user_id);

-- RLS: sem policy, ninguém (exceto service_role) enxerga nenhuma linha.
alter table public.notas enable row level security;

create policy "notas_select_proprias"
  on public.notas
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "notas_insert_proprias"
  on public.notas
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Grant: a policy decide QUAIS linhas; o grant decide se o papel pode tocar na tabela.
-- O Supabase costuma dar grant automático em tabelas novas do schema public, então
-- primeiro tiramos tudo e depois liberamos só o necessário.
revoke all on table public.notas from anon, authenticated;
grant select, insert on table public.notas to authenticated;
