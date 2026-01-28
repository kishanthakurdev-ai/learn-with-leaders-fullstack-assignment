-- ENABLE RLS
alter table public.users enable row level security;
alter table public.programs enable row level security;
alter table public.applications enable row level security;
alter table public.enrollments enable row level security;

-- USERS: users can read their own profile
create policy "Users can view own profile"
on public.users
for select
using (id = auth.uid());

-- PROGRAMS
-- Anyone logged in can view programs
create policy "View programs"
on public.programs
for select
using (true);

-- APPLICATIONS
-- Students can view their own applications
create policy "Students view own applications"
on public.applications
for select
using (student_id = auth.uid());

-- Students can create applications
create policy "Students create applications"
on public.applications
for insert
with check (student_id = auth.uid());

-- ENROLLMENTS
-- Students view own enrollments
create policy "Students view own enrollments"
on public.enrollments
for select
using (student_id = auth.uid());

-- ADMINS FULL ACCESS
create policy "Admins full access"
on public.programs
for all
using (
  exists (
    select 1 from public.users
    where users.id = auth.uid()
    and users.role = 'admin'
  )
);
