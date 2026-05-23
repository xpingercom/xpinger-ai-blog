-- XPinger MVP schema for Supabase/PostgreSQL

create table if not exists trends (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  score integer not null default 0,
  category text not null,
  source text,
  reason text,
  velocity text,
  detected_at timestamptz not null default now(),
  status text not null default 'candidate'
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid references trends(id) on delete cascade,
  title text not null,
  publisher text,
  url text,
  summary text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  category text not null,
  tags text[] not null default '{}',
  status text not null default 'draft', -- draft, review, published, rejected
  featured_image text,
  image_prompt text,
  sources jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  risk_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists ai_jobs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  input jsonb not null default '{}',
  output jsonb,
  status text not null default 'pending',
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists trends_detected_at_idx on trends(detected_at desc);
create table if not exists ad_slots (
  slot text primary key,
  name text,
  enabled boolean not null default true,
  label text,
  body text,
  html text,
  updated_at timestamptz not null default now()
);

insert into ad_slots (slot, name, enabled, label, body)
values
  ('top-banner', '상단 광고', true, 'ADVERTISEMENT', 'XPinger 광고 영역 — 상단 배너'),
  ('in-article', '본문 중간 광고', true, 'SPONSORED', 'XPinger 광고 영역 — 글 본문 중간')
on conflict (slot) do nothing;

create index if not exists posts_status_idx on posts(status);
create index if not exists posts_published_at_idx on posts(published_at desc);
