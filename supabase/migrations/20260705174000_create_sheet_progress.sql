-- Create sheet_progress table to track pattern-wise sheet problem completions
create table public.sheet_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  problem_id text not null, -- problem id from risingbrain_data.json, e.g. "problem_0004"
  completed_at timestamp with time zone not null default now(),
  unique(user_id, problem_id)
);

-- Enable Row Level Security (RLS)
alter table public.sheet_progress enable row level security;

-- Policies for sheet_progress
create policy "Users can view their own sheet progress" on public.sheet_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert their own sheet progress" on public.sheet_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own sheet progress" on public.sheet_progress
  for delete using (auth.uid() = user_id);
