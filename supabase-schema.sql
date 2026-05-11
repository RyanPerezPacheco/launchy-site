-- ============================================================
-- Launchy — Schema inicial
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run
-- ============================================================

-- 1. Tabela de perfis (estende auth.users do Supabase)
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  role        text not null check (role in ('client', 'provider')),
  name        text,
  empresa     text,
  cat         text,
  phone       text,
  cnpj        text,
  bio         text,
  site        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Row Level Security — cada usuário acessa só o próprio perfil
alter table public.profiles enable row level security;

create policy "Leitura do próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Inserção do próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Atualização do próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Trigger: cria o perfil automaticamente após o signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, name, empresa, cat, phone, cnpj)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role',    'client'),
    coalesce(new.raw_user_meta_data->>'name',    new.email),
    coalesce(new.raw_user_meta_data->>'empresa', null),
    coalesce(new.raw_user_meta_data->>'cat',     null),
    coalesce(new.raw_user_meta_data->>'phone',   null),
    coalesce(new.raw_user_meta_data->>'cnpj',    null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Função para updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
