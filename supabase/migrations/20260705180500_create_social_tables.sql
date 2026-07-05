-- Migration to enable social features (Friendships & Group Chats)

-- 1. Enable reading profiles of other users for authenticated users (required for search and listing friends)
create policy "Allow authenticated users to view profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

-- 2. Create friendships table
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'accepted')),
  created_at timestamp with time zone not null default now(),
  unique(sender_id, receiver_id)
);

-- Enable Row Level Security (RLS)
alter table public.friendships enable row level security;

-- Policies for friendships
create policy "Users can view their own friendships" on public.friendships
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert friendships they send" on public.friendships
  for insert with check (auth.uid() = sender_id);

create policy "Users can update friendships they are part of" on public.friendships
  for update using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can delete friendships they are part of" on public.friendships
  for delete using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- 3. Create group_chats table
create table public.group_chats (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS on group_chats
alter table public.group_chats enable row level security;

-- 4. Create group_members table
create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.group_chats(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamp with time zone not null default now(),
  unique(group_id, user_id)
);

-- Enable RLS on group_members
alter table public.group_members enable row level security;

-- Policies for group_chats (depends on group_members)
create policy "Members can view their group chats" on public.group_chats
  for select using (
    exists (
      select 1 from public.group_members
      where public.group_members.group_id = id and public.group_members.user_id = auth.uid()
    )
  );

create policy "Users can insert group chats" on public.group_chats
  for insert with check (auth.uid() = created_by);

-- Policies for group_members
create policy "Users can view members of groups they belong to" on public.group_members
  for select using (
    exists (
      select 1 from public.group_members as m
      where m.group_id = group_id and m.user_id = auth.uid()
    )
  );

create policy "Users can add members" on public.group_members
  for insert with check (
    exists (
      select 1 from public.group_chats as c
      where c.id = group_id and c.created_by = auth.uid()
    ) or auth.uid() = user_id
  );

create policy "Users can leave groups" on public.group_members
  for delete using (auth.uid() = user_id);
