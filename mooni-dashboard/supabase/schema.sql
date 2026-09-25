-- Run in the SQL editor of the MOONI Supabase project.
create table if not exists public.mooni_passengers (
  id text primary key,
  nombre text not null check (char_length(nombre) between 1 and 100),
  telefono text not null check (char_length(telefono) between 8 and 20),
  registrado_at timestamptz not null default now()
);
create table if not exists public.mooni_trips (
  id text primary key,
  access_token text not null,
  pasajero_id text not null references public.mooni_passengers(id),
  origen text not null,
  destino text not null,
  km numeric not null,
  min numeric not null,
  precio_sugerido numeric not null,
  oferta numeric not null,
  precio_acordado numeric,
  conductor text,
  vehiculo text,
  estado text not null,
  asignado_at timestamptz,
  creado_at timestamptz not null default now()
);
alter table public.mooni_passengers enable row level security;
alter table public.mooni_trips enable row level security;
revoke all on public.mooni_passengers, public.mooni_trips from anon, authenticated;
grant select, insert, update on public.mooni_passengers, public.mooni_trips to service_role;
-- No anon policies: requests go through validated server routes only.
