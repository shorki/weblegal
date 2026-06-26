-- ─────────────────────────────────────────────────────────────
-- C & V Estudio Jurídico — esquema de base de datos
-- Pegá y ejecutá esto en: Supabase → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────

create table if not exists public.consultas (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nombre      text not null,
  email       text not null,
  telefono    text,
  area        text,
  mensaje     text not null,
  estado      text not null default 'nueva',  -- 'nueva' | 'respondida'
  ip          text,
  user_agent  text
);

create index if not exists consultas_created_at_idx
  on public.consultas (created_at desc);

create index if not exists consultas_estado_idx
  on public.consultas (estado);

-- RLS activado y SIN políticas públicas:
-- nadie puede leer/escribir con la clave anónima.
-- La web inserta y el panel lee usando la clave service_role (solo en el servidor),
-- que bypassea RLS. Así los datos de las consultas quedan protegidos.
alter table public.consultas enable row level security;
