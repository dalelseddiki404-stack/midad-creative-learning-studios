import { Workflow } from "@/components/Workflow";
import { GameBuilder } from "@/components/GameBuilder";
import { Button } from "@/components/ui/button";
import { saveCloudTask } from "@/lib/workspace-cloud";
import { CloudAccess } from "@/components/CloudAccess";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LANGS, STUDIOS, TOOLS, buildPrompt, copyText, isComplete, loadDraft, saveDraft, studioName, toolLogo, toolPrompt, toolUrl, toolsText, upsertTask, type Draft, type TaskData } from "@/lib/midad";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "مهمتك جاهزة | مِداد" },
      { name: "description", content: "البرومبت المتخصص والأدوات المقترحة لتنفيذ مهمتك التعليمية." },
      { property: "og:title", content: "مهمتك جاهزة | مِداد" },
      { property: "og:description", content: "برومبت جاهز للنسخ وأدوات مقترحة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Result,
});

function Result() {
  const navigate = useNavigate();
  const [d, setD] = useState<Draft | null>(null);
  useEffect(() => setD(loadDraft()), []);

  if (!d) return null;
  if (!isComplete(d)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="mb-6 text-lg">لم تكتمل بيانات المهمة بعد.</p>
        <Link to="/" className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">العودة إلى الاستوديوهات</Link>
      </div>
    );
  }
  const task: TaskData = d;
  const prompt = buildPrompt(task);
  const studio = STUDIOS.find((s) => s.id === task.studio);
  if (!studio) return null;

  const persist = (updated: TaskData) => {
    try {
      const saved = upsertTask(updated, (d as Draft).taskId);
      const next = { ...updated, taskId: saved.id };
      saveDraft(next); setD(next);
      void saveCloudTask(saved).catch(() => toast.error("محفوظ على الجهاز؛ تعذر الحفظ لحسابك، أعيدي المحاولة بزر حفظ مهمتي"));
    } catch { toast.error("تعذر حفظ البيانات على الجهاز؛ نزّلي نسخة من عملك"); }
  };
  const save = async () => {
    const saved = upsertTask(task, (d as Draft).taskId);
    const next = { ...d, taskId: saved.id };
    saveDraft(next); setD(next);
    try { const cloud = await saveCloudTask(saved); toast.success(cloud ? "تم حفظ مهمتك على الجهاز ولحسابك" : "تم حفظ مهمتك على هذا الجهاز"); } catch { toast.error("محفوظ على الجهاز؛ تعذر الحفظ لحسابك، أعيدي المحاولة"); }
  };
  const copy = async (text: string, msg: string) => toast[(await copyText(text)) ? "success" : "error"](msg);

  const summary = [
    ["الاستوديو", studioName(task.studio)], ["المادة", task.subject], ["الصف", task.grade],
    ["اللغة", LANGS.find((l) => l.id === task.lang)?.name], ["عنوان الدرس", task.title],
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="pop-in mb-8 rounded-3xl bg-hero p-8 text-center text-primary-foreground shadow-glow">
        <div className="text-5xl">🏆</div>
        <h1 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">أحسنتِ! أصبحت مهمتك جاهزة للانطلاق</h1>
      </div>

      <CloudAccess />
      <section className="mb-8 rounded-3xl border-2 border-border bg-card p-6 shadow-card">
        <h2 className="mb-4 font-display text-xl font-extrabold text-primary">📋 ملخص اختياراتك</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {summary.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-muted px-4 py-3">
              <dt className="text-xs font-bold text-muted-foreground">{k}</dt>
              <dd className="font-bold">{v}</dd>
            </div>
          ))}
          <div className="rounded-2xl bg-muted px-4 py-3 sm:col-span-2">
            <dt className="text-xs font-bold text-muted-foreground">الهدف التعليمي</dt>
            <dd className="whitespace-pre-line font-bold">{task.goals}</dd>
          </div>
        </dl>
      </section>

      {task.studio === "games" && <GameBuilder task={task} onChange={persist} />}

      <section className="mb-8 rounded-3xl border-2 border-accent bg-card p-6 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-primary">{studio.icon} الأمر الأساسي Master Prompt – {studio.name}</h2>
          <Button onClick={() => copy(prompt, "تم نسخ البرومبت")} className="rounded-full bg-accent px-5 py-2 font-bold text-accent-foreground hover:opacity-90">📋 نسخ الأمر الأساسي</Button>
        </div>
        <pre dir={task.lang === "en" ? "ltr" : "rtl"} className={`max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-muted p-5 font-sans text-sm leading-loose ${task.lang === "en" ? "text-left" : "text-right"}`}>{prompt}</pre>
      </section>

      <Workflow task={task} onChange={persist} />
      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-primary">🧰 الأدوات والتطبيقات المقترحة لتنفيذ مهمتك</h2>
          <Button onClick={() => copy(toolsText(task.studio), "تم نسخ الأدوات المقترحة")} className="rounded-full bg-secondary px-5 py-2 font-bold text-secondary-foreground hover:opacity-90">📋 نسخ الأدوات المقترحة</Button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">المسار المقترح: ابدئي بالتطبيق الأول ثم انتقلي بالترتيب، فلكل تطبيق دور مختلف في إنجاز المهمة.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {TOOLS[task.studio].map((t, i) => (
            <div key={t.name} className="game-card p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-grad text-sm font-extrabold text-gold-foreground">{i + 1}</span>
                <img src={toolLogo(t.name)} alt={`شعار ${t.name}`} width={36} height={36} loading="lazy" className="h-9 w-9 rounded-lg bg-card object-contain" />
                <h3 dir="ltr" className="font-display text-lg font-extrabold text-primary">{t.name}</h3>
              </div>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li><b className="text-accent">دوره:</b> {t.role}</li>
                <li><b className="text-accent">ماذا ستفعلين:</b> {t.action}</li>
                <li><b className="text-accent">لماذا اخترناه:</b> {t.why}</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
                <a href={toolUrl(t.name)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">زيارة التطبيق ↗</a>
                <Button onClick={() => copy(toolPrompt(t, task), `تم نسخ أمر ${t.name}`)} className="rounded-full bg-secondary px-4 py-2 text-secondary-foreground hover:opacity-90">📋 نسخ الأمر الجاهز</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button onClick={save} className="rounded-2xl bg-gold-grad px-4 py-4 font-display text-lg font-extrabold text-gold-foreground shadow-card hover:scale-[1.02]">💾 حفظ مهمتي</Button>
        <Button onClick={() => navigate({ to: "/studio/$studioId", params: { studioId: task.studio } })} className="rounded-2xl bg-primary px-4 py-4 font-bold text-primary-foreground hover:opacity-90">✏️ تعديل بيانات المهمة</Button>
        <Link to="/" className="rounded-2xl border-2 border-primary px-4 py-4 text-center font-bold text-primary hover:bg-secondary">🏠 العودة إلى الاستوديوهات</Link>
      </div>
    </div>
  );
}
