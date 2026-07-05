-- 1. Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text not null,
  role text not null default 'learner' check (role in ('learner', 'admin')),
  dark_mode boolean not null default false,
  reminders boolean not null default true,
  current_streak integer not null default 0,
  last_active_date text,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profile policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- Trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    case
      when new.email = 'princekumot1307@gmail.com' then 'admin'
      when new.email ilike '%admin%' then 'admin'
      else 'learner'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create days table
create table public.days (
  id bigint primary key,
  day_number integer not null unique,
  date_label text not null,
  pattern text not null,
  topic text not null,
  youtube_id text,
  notes_default text,
  created_at timestamp with time zone not null default now()
);

alter table public.days enable row level security;

create policy "Anyone can view days" on public.days
  for select using (true);

create policy "Only admins can modify days" on public.days
  for all using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 3. Create problems table
create table public.problems (
  id uuid primary key default gen_random_uuid(),
  day_id bigint references public.days(id) on delete cascade not null,
  name text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  leetcode_url text,
  gfg_url text,
  youtube_url text,
  is_missing_video boolean not null default false,
  order_index integer not null,
  created_at timestamp with time zone not null default now()
);

alter table public.problems enable row level security;

create policy "Anyone can view problems" on public.problems
  for select using (true);

create policy "Only admins can modify problems" on public.problems
  for all using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 4. Create progress table (solved problems)
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  problem_id uuid references public.problems(id) on delete cascade not null,
  solved_at timestamp with time zone not null default now(),
  unique(user_id, problem_id)
);

alter table public.progress enable row level security;

create policy "Users can view their own progress" on public.progress
  for select using (auth.uid() = user_id);

create policy "Users can insert their own progress" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own progress" on public.progress
  for delete using (auth.uid() = user_id);

-- 5. Create progress_days table (manual day completion for 0-problem days)
create table public.progress_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  day_id bigint references public.days(id) on delete cascade not null,
  completed_at timestamp with time zone not null default now(),
  unique(user_id, day_id)
);

alter table public.progress_days enable row level security;

create policy "Users can view their own day progress" on public.progress_days
  for select using (auth.uid() = user_id);

create policy "Users can insert their own day progress" on public.progress_days
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own day progress" on public.progress_days
  for delete using (auth.uid() = user_id);

-- 6. Create user_notes table
create table public.user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  day_id bigint references public.days(id) on delete cascade not null,
  notes_text text not null,
  updated_at timestamp with time zone not null default now(),
  unique(user_id, day_id)
);

alter table public.user_notes enable row level security;

create policy "Users can view their own notes" on public.user_notes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own notes" on public.user_notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own notes" on public.user_notes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own notes" on public.user_notes
  for delete using (auth.uid() = user_id);
