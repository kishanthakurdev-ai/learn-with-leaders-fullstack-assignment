# Architecture & Migration Plan

## Supabase Data Model

### users
- id (uuid, primary key)
- role (admin | mentor | student)

### programs
- id
- title
- description
- mentor_id → users.id
- start_date
- end_date

### applications
- id
- program_id → programs.id
- student_id → users.id
- status (pending | approved | rejected)
- created_at

### enrollments
- id
- program_id → programs.id
- student_id → users.id
- enrolled_at

### assessments
- id
- enrollment_id → enrollments.id
- score
- feedback

## Roles & Permissions
- Students can view programs and manage their own applications.
- Mentors can view programs they are assigned to and students enrolled in them.
- Admins have full access to all data.

## Data Migration Strategy
1. Export data from the no-code platform (CSV/JSON).
2. Clean and normalize data.
3. Import data in order: users → programs → applications → enrollments.
4. Validate foreign keys and counts.
5. Perform migration during low-traffic hours.

## Architecture Decisions
- Supabase RLS for data security.
- Clear separation of frontend and backend.
- React Query for caching and state management.
- Minimal but scalable schema design.
