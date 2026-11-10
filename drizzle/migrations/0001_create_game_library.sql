CREATE TABLE public.game_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  game_name text NOT NULL,
  subject text NOT NULL,
  grade text NOT NULL,
  lesson_title text NOT NULL,
  goals text NOT NULL,
  game_type text NOT NULL,
  platform text NOT NULL,
  prompt text NOT NULL,
  lesson jsonb NOT NULL DEFAULT '{}'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_library TO authenticated;
GRANT ALL ON public.game_library TO service_role;
ALTER TABLE public.game_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers read own games" ON public.game_library FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers add own games" ON public.game_library FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers update own games" ON public.game_library FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers delete own games" ON public.game_library FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX game_library_user_created_idx ON public.game_library (user_id, created_at DESC);