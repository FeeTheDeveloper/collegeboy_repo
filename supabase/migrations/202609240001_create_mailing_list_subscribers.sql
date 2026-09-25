create table if not exists public.mailing_list_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 3 and 254),
  first_name text check (first_name is null or char_length(first_name) <= 80),
  last_name text check (last_name is null or char_length(last_name) <= 80),
  consented_at timestamptz not null,
  unsubscribed_at timestamptz,
  source text not null check (source in ('website')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mailing_list_subscribers enable row level security;

revoke all on table public.mailing_list_subscribers from anon, authenticated;

comment on table public.mailing_list_subscribers is 'College Boy mailing-list consent records. Server-side service role access only.';
