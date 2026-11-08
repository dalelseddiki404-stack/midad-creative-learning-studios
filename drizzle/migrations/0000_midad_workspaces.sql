CREATE TABLE public.midad_workspaces (id uuid PRIMARY KEY, user_id uuid NOT NULL DEFAULT auth.uid(), data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.midad_workspaces TO authenticated;
GRANT ALL ON public.midad_workspaces TO service_role;
ALTER TABLE public.midad_workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own workspaces" ON public.midad_workspaces FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Insert own workspaces" ON public.midad_workspaces FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own workspaces" ON public.midad_workspaces FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Delete own workspaces" ON public.midad_workspaces FOR DELETE TO authenticated USING (user_id = auth.uid());