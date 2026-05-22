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
create index if not exists posts_status_idx on posts(status);
create index if not exists posts_published_at_idx on posts(published_at desc);
