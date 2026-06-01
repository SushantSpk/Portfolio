create extension if not exists "pgcrypto";

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text,
  bio text,
  location text,
  profile_image_url text,
  resume_url text,
  email text,
  updated_at timestamp with time zone default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  image_url text,
  tech_stack text[],
  live_url text,
  github_url text,
  display_order int default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  status text default 'unread',
  created_at timestamp with time zone default now(),
  replied_at timestamp with time zone
);

create table if not exists public.message_replies (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.contact_messages(id) on delete cascade,
  reply_body text not null,
  sent_to text not null,
  sent_at timestamp with time zone default now()
);

insert into public.profile (
  full_name,
  role,
  bio,
  location,
  email
)
select
  'Sushant Sapkota',
  'AI & Automation Engineer',
  'I build intelligent systems, automation workflows, and full-stack software products that solve real business problems.',
  'Kathmandu - Remote',
  'your-email@example.com'
where not exists (select 1 from public.profile);

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;
