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
  shot_label text,
  tech_stack text[],
  live_url text,
  case_study_url text,
  github_url text,
  display_order int default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.projects
add column if not exists shot_label text,
add column if not exists case_study_url text;

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

insert into public.projects (
  title,
  category,
  description,
  shot_label,
  tech_stack,
  case_study_url,
  display_order,
  is_featured
)
select
  'Inventory Management System',
  'Operations',
  'A real-time inventory platform with predictive restocking, barcode scanning flows, and multi-warehouse sync. Replaced a tangle of spreadsheets with one reliable source of truth.',
  'dashboard ui - drop screenshot',
  array['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
  '#contact',
  1,
  true
where not exists (select 1 from public.projects where title = 'Inventory Management System');

insert into public.projects (
  title,
  category,
  description,
  shot_label,
  tech_stack,
  case_study_url,
  display_order,
  is_featured
)
select
  'AI Automation Workflow System',
  'AI',
  'Agentic pipelines connecting CRMs, inboxes, and ERPs to cut manual operations by hundreds of hours per month.',
  'flow diagram - drop screenshot',
  array['LLM Agents', 'n8n', 'Python'],
  '#contact',
  2,
  false
where not exists (select 1 from public.projects where title = 'AI Automation Workflow System');

insert into public.projects (
  title,
  category,
  description,
  shot_label,
  tech_stack,
  case_study_url,
  display_order,
  is_featured
)
select
  'Event Management System',
  'Platform',
  'Ticketing, scheduling, and attendee analytics in one platform built to handle traffic spikes without breaking the user experience.',
  'event app - drop screenshot',
  array['React', 'Stripe', 'WebSocket'],
  '#contact',
  3,
  false
where not exists (select 1 from public.projects where title = 'Event Management System');

insert into public.projects (
  title,
  category,
  description,
  shot_label,
  tech_stack,
  case_study_url,
  display_order,
  is_featured
)
select
  'Weather App',
  'Product',
  'A crisp, fast forecast app with location intelligence and a clean minimal interface that users can read at a glance.',
  'weather ui - drop screenshot',
  array['React', 'REST API', 'PWA'],
  '#contact',
  4,
  false
where not exists (select 1 from public.projects where title = 'Weather App');

insert into public.projects (
  title,
  category,
  description,
  shot_label,
  tech_stack,
  case_study_url,
  display_order,
  is_featured
)
select
  'University Department Management',
  'Enterprise',
  'A unified portal for courses, faculty, and student records with role-based access and automated reporting built in.',
  'admin portal - drop screenshot',
  array['Full-Stack', 'RBAC', 'Reporting'],
  '#contact',
  5,
  false
where not exists (select 1 from public.projects where title = 'University Department Management');

update public.projects
set
  description = 'A real-time inventory platform with predictive restocking, barcode scanning flows, and multi-warehouse sync. Replaced a tangle of spreadsheets with one reliable source of truth.',
  shot_label = 'dashboard ui - drop screenshot',
  case_study_url = coalesce(nullif(case_study_url, ''), '#contact'),
  display_order = 1,
  is_featured = true
where title = 'Inventory Management System';

update public.projects
set
  description = 'Agentic pipelines connecting CRMs, inboxes, and ERPs to cut manual operations by hundreds of hours per month.',
  shot_label = 'flow diagram - drop screenshot',
  case_study_url = coalesce(nullif(case_study_url, ''), '#contact'),
  display_order = 2,
  is_featured = false
where title = 'AI Automation Workflow System';

update public.projects
set
  description = 'Ticketing, scheduling, and attendee analytics in one platform built to handle traffic spikes without breaking the user experience.',
  shot_label = 'event app - drop screenshot',
  case_study_url = coalesce(nullif(case_study_url, ''), '#contact'),
  display_order = 3,
  is_featured = false
where title = 'Event Management System';

update public.projects
set
  description = 'A crisp, fast forecast app with location intelligence and a clean minimal interface that users can read at a glance.',
  shot_label = 'weather ui - drop screenshot',
  case_study_url = coalesce(nullif(case_study_url, ''), '#contact'),
  display_order = 4,
  is_featured = false
where title = 'Weather App';

update public.projects
set
  description = 'A unified portal for courses, faculty, and student records with role-based access and automated reporting built in.',
  shot_label = 'admin portal - drop screenshot',
  case_study_url = coalesce(nullif(case_study_url, ''), '#contact'),
  display_order = 5,
  is_featured = false
where title = 'University Department Management';
