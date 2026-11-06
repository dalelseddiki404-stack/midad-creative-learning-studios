import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { STUDIOS, buildPrompt, copyText, deleteTask, loadTasks, saveDraft, type SavedTask } from "@/lib/midad";

export const Route = createFileRoute("/desk")({
  head: () => ({
    meta: [
      { title: "مكتب مهامي | مِداد" },
      { name: "description", content: "مهامك التعليمية المحفوظة على جهازك: افتحيها وعدّليها وانسخي برومبتها." },
      { property: "og:title", content: "مكتب مهامي | مِداد" },
      { property: "og:description", content: "مهامك المحفوظة في مِداد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Desk,
});

function Desk() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<SavedTask[] | null>(null);
  const [toDelete, setToDelete] = useState<SavedTask | null>(null);
  useEffect(() => setTasks(loadTasks()), []);

  const open = (t: SavedTask) => { saveDraft({ ...t, taskId: t.id }); navigate({ to: "/result" }); };
  const edit = (t: SavedTask) => { saveDraft({ ...t, taskId: t.id }); navigate({ to: "/studio/$studioId", params: { studioId: t.studio } }); };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 font-display text-3xl font-extrabold text-primary">🗂️ مكتب مهامي</h1>
      <p className="mb-8 text-muted-foreground">مهامك محفوظة على هذا الجهاز.</p>
      {tasks && tasks.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center">
          <p className="mb-5 text-lg">لا توجد مهام محفوظة بعد.</p>
          <Link to="/" className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">ابدئي مهمة جديدة</Link>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {tasks?.map((t) => {
          const s = STUDIOS.find((x) => x.id === t.studio)!;
          return (
            <div key={t.id} className="game-card p-5">
              <div className="mb-3 flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">{s.icon}</span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-extrabold text-primary">{t.title}</h2>
                  <p className="text-xs text-muted-foreground">{s.name} • {t.subject} • {t.grade}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.savedAt).toLocaleDateString("ar")}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-bold">
                <button onClick={() => open(t)} className="rounded-full bg-primary px-4 py-2 text-primary-foreground">فتح</button>
                <button onClick={() => edit(t)} className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground">تعديل</button>
                <button onClick={async () => toast[(await copyText(buildPrompt(t))) ? "success" : "error"]("تم نسخ البرومبت")} className="rounded-full bg-accent px-4 py-2 text-accent-foreground">نسخ البرومبت</button>
                <button onClick={() => setToDelete(t)} className="rounded-full border-2 border-destructive px-4 py-1.5 text-destructive">حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="text-right sm:text-right">
            <AlertDialogTitle>حذف المهمة؟</AlertDialogTitle>
            <AlertDialogDescription>سيتم حذف «{toDelete?.title}» نهائياً من هذا الجهاز.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (toDelete) { deleteTask(toDelete.id); setTasks(loadTasks()); toast.success("تم حذف المهمة"); } setToDelete(null); }}
            >
              نعم، احذفي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
