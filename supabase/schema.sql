-- USERS TABLE (linked to Supabase Auth)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'mentor', 'student')),
  created_at timestamp with time zone default now()
);

-- PROGRAMS
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  mentor_id uuid references public.users(id),
  created_at timestamp with time zone default now()
);

-- APPLICATIONS
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now()
);

-- ENROLLMENTS
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete cascade,
  student_id uuid references public.users(id) on delete cascade,
  enrolled_at timestamp with time zone default now(),
  unique (program_id, student_id)
);
