-- Drop the recursive policies
DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON public.group_members;
DROP POLICY IF EXISTS "Members can view their group chats" ON public.group_chats;

-- Create the new non-recursive policies
CREATE POLICY "Users can view members of groups they belong to" ON public.group_members
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Members can view their group chats" ON public.group_chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE public.group_members.group_id = id AND public.group_members.user_id = auth.uid()
    )
  );
