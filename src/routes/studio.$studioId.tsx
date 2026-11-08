import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { STUDIO_IMAGES } from "@/lib/studio-images";
import { Progress } from "@/components/Shell";
import { GRADES, LANGS, STUDIOS, SUBJECTS, isComplete, loadDraft, saveDraft, type Draft, type Lang, type StudioId } from "@/lib/midad";

export const Route = createFileRoute("/studio/$studioId")({
  beforeLoad: ({ params }) => {
    if (!STUDIOS.some((s) => s.id === params.studioId)) throw notFound();
  },
  head: () => ({
    meta: [
      { title: "لنجهّز مهمتك التعليمية | مِداد" },
      { name: "description", content: "أدخلي المادة والصف واللغة وعنوان الدرس والأهداف لتحصلي على برومبت متخصص." },
      { property: "og:title", content: "لنجهّز مهمتك التعليمية | مِداد" },
      { property: "og:description", content: "خطوات بسيطة لإعداد مهمتك التعليمية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Setup,
});

function Picker({ label, icon, value, options, onPick }: { label: string; icon: string; value?: string | undefined; options: { id: string; name: string }[]; onPick: (v: string) => void }) {
  const [open, setOpen] = useState(!value);
  const name = options.find((o) => o.id === value)?.name;
  return (
    <div className="pop-in rounded-3xl border-2 border-border bg-card p-4 shadow-card">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 text-right" aria-expanded={open}>
        <span className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-xl">{icon}</span>
          <span>
            <span className="block font-display text-lg font-extrabold text-primary">{label}</span>
            {name && <span className="text-sm font-bold text-accent">✓ {name}</span>}
          </span>
        </span>
        <span className={`text-muted-foreground transition ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => { onPick(o.id); setOpen(false); }}
              className={`rounded-2xl border-2 px-3 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-accent ${value === o.id ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background"}`}
            >
              {o.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Setup() {
  const { studioId } = Route.useParams();
  const studio = STUDIOS.find((s) => s.id === studioId)!;
  const navigate = useNavigate();
  const [d, setD] = useState<Draft | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadDraft();
    // keep data when returning to edit; switching studio keeps lesson data too
    setD({ ...saved, studio: studioId as StudioId });
  }, [studioId]);

  const update = (patch: Partial<Draft>) => {
    setD((prev) => {
      const next = { ...prev!, ...patch };
      saveDraft(next);
      return next;
    });
    setTimeout(() => bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80);
  };

  if (!d) return <div className="p-10 text-center text-muted-foreground">...</div>;

  const step = !d.subject ? 0 : !d.grade ? 1 : !d.lang ? 2 : !d.title?.trim() ? 3 : !d.goals?.trim() ? 4 : 6;
  const ready = isComplete(d);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <img src={STUDIO_IMAGES[studio.id]} alt={studio.name} width={1024} height={768} className="h-20 w-28 shrink-0 rounded-2xl object-cover shadow-card" />
        <div>
          <p className="text-sm font-bold text-accent">{studio.name}</p>
          <h1 className="font-display text-3xl font-extrabold text-primary">لنجهّز مهمتك التعليمية</h1>
        </div>
      </div>
      <Progress step={step} />

      <div className="space-y-4">
        <Picker label="اختاري المادة" icon="📚" value={d.subject} options={SUBJECTS.map((s) => ({ id: s, name: s }))} onPick={(v) => update({ subject: v })} />
        {d.subject && <Picker label="اختاري الصف" icon="🎒" value={d.grade} options={GRADES.map((s) => ({ id: s, name: s }))} onPick={(v) => update({ grade: v })} />}
        {d.grade && <Picker label="اختاري لغة المورد" icon="🌐" value={d.lang} options={LANGS} onPick={(v) => update({ lang: v as Lang })} />}
        {d.lang && (
          <label className="pop-in block rounded-3xl border-2 border-border bg-card p-4 shadow-card">
            <span className="mb-3 flex items-center gap-3 font-display text-lg font-extrabold text-primary">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-xl">✏️</span>ما عنوان الدرس؟
            </span>
            <input
              value={d.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="اكتبي عنوان الدرس هنا"
              className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 outline-none focus:border-accent"
            />
          </label>
        )}
        {d.lang && d.title?.trim() && (
          <label className="pop-in block rounded-3xl border-2 border-border bg-card p-4 shadow-card">
            <span className="mb-3 flex items-center gap-3 font-display text-lg font-extrabold text-primary">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-xl">🎯</span>ما الهدف أو الأهداف التعليمية التي تريدين تحقيقها؟
            </span>
            <textarea
              value={d.goals ?? ""}
              onChange={(e) => update({ goals: e.target.value })}
              rows={5}
              placeholder="اكتبي هدفاً واحداً أو عدة أهداف، كل هدف في سطر إن أحببتِ"
              className="w-full resize-y rounded-2xl border-2 border-input bg-background px-4 py-3 leading-relaxed outline-none focus:border-accent"
            />
          </label>
        )}
        {ready && (
          <button
            type="button"
            onClick={() => navigate({ to: "/result" })}
            className="pop-in w-full rounded-3xl bg-gold-grad px-6 py-5 font-display text-2xl font-extrabold text-gold-foreground shadow-glow transition hover:scale-[1.02] active:scale-95"
          >
            ✨ اضغطي هنا لمساعدتك
          </button>
        )}
        <div ref={bottom} />
      </div>
    </div>
  );
}
