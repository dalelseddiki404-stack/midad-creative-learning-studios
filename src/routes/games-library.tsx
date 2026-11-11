import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { BookMarked, Copy, ExternalLink, Eye, Pencil, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CloudAccess } from "@/components/CloudAccess";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { copyText, saveDraft } from "@/lib/midad";
import { GAME_TYPES, platformById, platformLogo } from "@/lib/games";
import { deleteLibraryGame, isSignedIn, listLibraryGames, saveLibraryGame, type LibraryGame } from "@/lib/game-library";

export const Route = createFileRoute("/games-library")({
  head: () => ({
    meta: [
      { title: "مكتبتي – ألعابي السابقة | مِداد" },
      { name: "description", content: "برومتات الألعاب التفاعلية التي حفظتِها في حسابك: افتحيها وانسخيها وأعيدي استخدامها." },
      { property: "og:title", content: "مكتبتي – ألعابي السابقة | مِداد" },
      { property: "og:description", content: "مكتبة شخصية لبرومتات الألعاب التعليمية التفاعلية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GamesLibrary,
});

function GamesLibrary() {
  const navigate = useNavigate();
  const [games, setGames] = useState<LibraryGame[] | null>(null);
  const [signed, setSigned] = useState<boolean | null>(null);
  const [viewing, setViewing] = useState<LibraryGame | null>(null);
  const [editing, setEditing] = useState<{ game: LibraryGame; text: string } | null>(null);
  const [toDelete, setToDelete] = useState<LibraryGame | null>(null);

  const refresh = useCallback(() => {
    void isSignedIn().then((ok) => {
      setSigned(ok);
      if (!ok) { setGames([]); return; }
      listLibraryGames().then(setGames).catch(() => { setGames([]); toast.error("تعذر تحميل مكتبتك؛ أعيدي المحاولة"); });
    });
  }, []);
  const signedOut = useCallback(() => { setSigned(false); setGames([]); }, []);
  useEffect(refresh, [refresh]);

  const copy = async (g: LibraryGame, text = g.prompt) => toast[(await copyText(text)) ? "success" : "error"]("تم نسخ البرومت");
  const reuse = (g: LibraryGame) => {
    saveDraft({ ...g.lesson, studio: "games", game: { settings: { ...g.settings, name: `${g.game_name} – جديدة` }, platform: g.platform, step: "settings" } });
    toast.success("نُقلت بيانات اللعبة إلى المحرر؛ عدّلي ما تريدين وسيُنشأ برومت جديد");
    navigate({ to: "/studio/$studioId", params: { studioId: "games" } });
  };
  const saveCopy = async () => {
    if (!editing) return;
    const g = editing.game;
    try {
      await saveLibraryGame({ name: `${g.game_name} (نسخة معدّلة)`, lesson: g.lesson, settings: g.settings, platform: g.platform, prompt: editing.text });
      toast.success("تم حفظ النسخة المعدّلة في مكتبتي"); setEditing(null); refresh();
    } catch { toast.error("تعذر حفظ النسخة؛ أعيدي المحاولة"); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 flex items-center gap-2 font-display text-3xl font-extrabold text-foreground"><BookMarked aria-hidden className="h-8 w-8" /> مكتبتي – ألعابي السابقة</h1>
      <p className="mb-4 text-muted-foreground">برومتات الألعاب التفاعلية المحفوظة في حسابك، لكل معلمة مكتبتها الخاصة.</p>
      <CloudAccess message="سجّلي الدخول لعرض مكتبة ألعابك وحفظ ألعاب جديدة فيها." onSignedIn={refresh} onSignedOut={signedOut} />

      {games && games.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-primary bg-secondary p-10 text-center">
          <div className="text-6xl" aria-hidden>🎮</div>
          <p className="mt-3 font-display text-xl font-extrabold">{signed ? "مكتبتك تنتظر لعبتك الأولى!" : "مكتبتك محفوظة في حسابك"}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{signed ? "أنشئي برومت لعبة في استوديو الألعاب التفاعلية، ثم اضغطي «حفظ في مكتبتي» لتجديها هنا." : "سجّلي الدخول أولاً لتظهر ألعابك المحفوظة."}</p>
          <Link to="/studio/$studioId" params={{ studioId: "games" }} className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">ابدئي لعبة جديدة</Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {games?.map((g) => {
          const p = platformById(g.platform);
          const type = GAME_TYPES.find((t) => t.id === g.game_type);
          return (
            <article key={g.id} className="game-card flex flex-col p-5">
              <div className="mb-3 flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl" aria-hidden>{type?.icon ?? "🎮"}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-extrabold">{g.game_name}</h2>
                  <p className="text-xs text-muted-foreground">{g.subject} • {g.grade} • {g.lesson_title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{type?.ar} • {new Date(g.created_at).toLocaleDateString("ar")}</p>
                </div>
                {p && <img src={platformLogo(p)} alt={`أيقونة ${p.name}`} title={p.name} width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />}
              </div>
              <p className="line-clamp-2 whitespace-pre-line text-sm text-muted-foreground">{g.goals}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <Button size="sm" onClick={() => setViewing(g)}><Eye aria-hidden /> فتح البرومت</Button>
                <Button size="sm" variant="secondary" onClick={() => copy(g)}><Copy aria-hidden /> نسخ</Button>
                {p && <Button size="sm" variant="outline" asChild><a href={p.url} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden /> فتح {p.name}</a></Button>}
                <Button size="sm" variant="outline" onClick={() => setEditing({ game: g, text: g.prompt })}><Pencil aria-hidden /> تعديل نسخة</Button>
                <Button size="sm" variant="outline" onClick={() => reuse(g)}><Sparkles aria-hidden /> لعبة جديدة اعتماداً عليها</Button>
                <Button size="sm" variant="outline" className="border-destructive text-destructive" onClick={() => setToDelete(g)}><Trash2 aria-hidden /> حذف</Button>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent dir="rtl" className="max-w-3xl">
          <DialogHeader className="text-right sm:text-right"><DialogTitle>{viewing?.game_name}</DialogTitle><DialogDescription>{viewing && platformById(viewing.platform)?.name}</DialogDescription></DialogHeader>
          <pre dir={viewing?.lesson.lang === "en" ? "ltr" : "rtl"} className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-2xl bg-muted p-4 font-sans text-sm leading-loose">{viewing?.prompt}</pre>
          {viewing && <Button onClick={() => copy(viewing)}><Copy aria-hidden /> نسخ البرومت كاملاً</Button>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent dir="rtl" className="max-w-3xl">
          <DialogHeader className="text-right sm:text-right"><DialogTitle>تعديل نسخة من البرومت</DialogTitle><DialogDescription>تُحفظ التعديلات كنسخة جديدة، ويبقى البرومت الأصلي كما هو.</DialogDescription></DialogHeader>
          <textarea aria-label="نص البرومت" value={editing?.text ?? ""} onChange={(e) => editing && setEditing({ ...editing, text: e.target.value })} rows={16} className="w-full rounded-2xl border-2 border-input bg-background p-3 text-sm leading-relaxed outline-none focus:border-primary" />
          <div className="flex flex-wrap gap-2">
            <Button disabled={!editing?.text.trim()} onClick={saveCopy}>حفظ النسخة في مكتبتي</Button>
            {editing && <Button variant="secondary" onClick={() => copy(editing.game, editing.text)}><Copy aria-hidden /> نسخ</Button>}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="text-right sm:text-right">
            <AlertDialogTitle>حذف اللعبة من مكتبتي؟</AlertDialogTitle>
            <AlertDialogDescription>سيتم حذف «{toDelete?.game_name}» نهائياً من حسابك.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => { if (toDelete) { try { await deleteLibraryGame(toDelete.id); toast.success("تم حذف اللعبة من مكتبتي"); refresh(); } catch { toast.error("تعذر الحذف؛ لم تُحذف اللعبة"); } } setToDelete(null); }}>
              نعم، احذفي
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
