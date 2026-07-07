-- Enable select access for administrators on progress, progress_days, user_notes, and sheet_progress tables

-- 1. Policies for progress
CREATE POLICY "Admins can view all progress" ON public.progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 2. Policies for progress_days
CREATE POLICY "Admins can view all progress_days" ON public.progress_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 3. Policies for user_notes
CREATE POLICY "Admins can view all user_notes" ON public.user_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- 4. Policies for sheet_progress
CREATE POLICY "Admins can view all sheet_progress" ON public.sheet_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );
