import { supabase } from '@/integrations/supabase/client';
import { isComplete, type SavedTask } from '@/lib/midad';

async function writeCloudTask(task: SavedTask) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { error } = await supabase.from('midad_workspaces').upsert({ id: task.id, user_id: session.user.id, data: JSON.parse(JSON.stringify(task)), updated_at: new Date().toISOString() });
  if (error) throw error;
  return true;
}
// Serialize snapshots per task so a slow earlier request cannot overwrite newer work.
const pendingWrites = new Map<string, Promise<boolean>>();
export function saveCloudTask(task: SavedTask): Promise<boolean> {
  const previous = pendingWrites.get(task.id) ?? Promise.resolve(false);
  const next = previous.catch(() => false).then(() => writeCloudTask(task));
  pendingWrites.set(task.id, next);
  void next.finally(() => { if (pendingWrites.get(task.id) === next) pendingWrites.delete(task.id); }).catch(() => undefined);
  return next;
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