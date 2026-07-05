-- Create chat_messages table to store persistent AI agent chat history
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  day_id bigint references public.days(id) on delete cascade,
  problem_id text,
  role text not null check (role in ('user', 'assistant')),
  message_text text not null,
  created_at timestamp with time zone not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.chat_messages enable row level security;

-- Policies for chat_messages
create policy "Users can view their own chat messages" on public.chat_messages
  for select using (auth.uid() = user_id);

create policy "Users can insert their own chat messages" on public.chat_messages
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own chat messages" on public.chat_messages
  for delete using (auth.uid() = user_id);

create policy "Admins can view all chat messages" on public.chat_messages
  for select using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );
