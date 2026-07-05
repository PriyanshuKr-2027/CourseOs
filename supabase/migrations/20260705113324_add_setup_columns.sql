-- Add setup/onboarding columns to profiles table
alter table public.profiles add column has_completed_setup boolean not null default false;
alter table public.profiles add column dob date;
alter table public.profiles add column mobile_no text;
alter table public.profiles add column groq_api_key text;
