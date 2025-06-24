
-- Add missing RLS policies for leads table
CREATE POLICY "Users can view their own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- Add missing RLS policies for search_history table
CREATE POLICY "Users can view their own search history" ON public.search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own search history" ON public.search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own search history" ON public.search_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history" ON public.search_history
  FOR DELETE USING (auth.uid() = user_id);
