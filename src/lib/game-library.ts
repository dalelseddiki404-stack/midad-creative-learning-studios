import { supabase } from '@/integrations/supabase/client';
import type { TaskData } from '@/lib/midad';
import type { GameSettings, PlatformId } from '@/lib/games';

export type LessonSnapshot = Pick<TaskData, 'subject' | 'grade' | 'lang' | 'title' | 'goals' | 'content' | 'constraints'>;
export interface LibraryGame {
  id: string; game_name: string; subject: string; grade: string; lesson_title: string; goals: string;
  game_type: string; platform: PlatformId; prompt: string; lesson: LessonSnapshot; settings: GameSettings; created_at: string;
}
export interface NewLibraryGame { name: string; lesson: LessonSnapshot; settings: GameSettings; platform: PlatformId; prompt: string }

async function signedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
export async function isSignedIn() { return !!(await signedIn()); }

/** Saves a game prompt to the signed-in teacher's library. Returns false when nobody is signed in. */
export async function saveLibraryGame(g: NewLibraryGame): Promise<boolean> {
  const session = await signedIn();
  if (!session) return false;
  const { error } = await supabase.from('game_library').insert({
    user_id: session.user.id, game_name: g.name.trim() || g.lesson.title, subject: g.lesson.subject, grade: g.lesson.grade,
    lesson_title: g.lesson.title, goals: g.lesson.goals, game_type: g.settings.type, platform: g.platform, prompt: g.prompt,
    lesson: JSON.parse(JSON.stringify(g.lesson)), settings: JSON.parse(JSON.stringify(g.settings)),
  });
  if (error) throw error;
  return true;
}
export async function listLibraryGames(): Promise<LibraryGame[]> {
  if (!(await signedIn())) return [];
  const { data, error } = await supabase.from('game_library').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({ ...r, platform: r.platform as PlatformId, lesson: r.lesson as unknown as LessonSnapshot, settings: r.settings as unknown as GameSettings }));
}
export async function deleteLibraryGame(id: string) {
  const { error } = await supabase.from('game_library').delete().eq('id', id);
  if (error) throw error;
}
