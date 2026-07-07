-- Migration to enable users to view their friends' progress for the leaderboard
-- Dropping existing select policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.progress;
DROP POLICY IF EXISTS "Users can view their own day progress" ON public.progress_days;

-- Creating new select policies that include friends
CREATE POLICY "Users can view their own and friends' progress" ON public.progress
  FOR SELECT USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.friendships
      WHERE status = 'accepted'
      AND (
        (sender_id = auth.uid() AND receiver_id = user_id)
        OR (receiver_id = auth.uid() AND sender_id = user_id)
      )
    )
  );

CREATE POLICY "Users can view their own and friends' day progress" ON public.progress_days
  FOR SELECT USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.friendships
      WHERE status = 'accepted'
      AND (
        (sender_id = auth.uid() AND receiver_id = user_id)
        OR (receiver_id = auth.uid() AND sender_id = user_id)
      )
    )
  );
