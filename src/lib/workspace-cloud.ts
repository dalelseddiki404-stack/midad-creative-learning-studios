import { supabase } from '@/integrations/supabase/client';
import { isComplete, type SavedTask } from '@/lib/midad';

export async function saveCloudTask(task: SavedTask) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { error } = await supabase.from('midad_workspaces').upsert({ id: task.id, user_id: session.user.id, data: JSON.parse(JSON.stringify(task)), updated_at: new Date().toISOString() });
  if (error) throw error;
  return true;
}
export async function loadCloudTasks(): Promise<SavedTask[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data, error } = await supabase.from('midad_workspaces').select('data').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).flatMap(row => {
    const value = row.data;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
    const task = value as unknown as SavedTask;
    return isComplete(task) && typeof task.id === 'string' && typeof task.savedAt === 'number' ? [task] : [];
  });
}
export async function deleteCloudTask(id: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { error } = await supabase.from('midad_workspaces').delete().eq('id', id);
  if (error) throw error;
}