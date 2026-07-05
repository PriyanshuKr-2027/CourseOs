-- Alter chat_messages to support chat sessions
alter table public.chat_messages add column session_id uuid not null default gen_random_uuid();
