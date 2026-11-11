import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Gamepad2, Sparkles, Copy, ExternalLink, Settings2, RefreshCw, ArrowRight, Save, BookMarked, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CloudAccess } from '@/components/CloudAccess';
import { copyText, type TaskData } from '@/lib/midad';
import { saveLibraryGame } from '@/lib/game-library';
import {
  DIFFICULTIES, GAME_PLATFORMS, GAME_TYPES, PLAY_MODES, REWARDS, VISUALS, buildGamePrompt, fitLabel, initialGameState,
  platformById, platformLogo, recommendPlatform, suggestSettings, suggestionNote, type GameSettings, type GameState, type GameStep, type PlatformId,
} from '@/lib/games';

function Chips<T extends string>({ legend, options, value, onPick, multi }: { legend: string; options: { id: T; ar: string; icon: string }[]; value: T | T[]; onPick: (v: T) => void; multi?: boolean }) {
  const on = (id: T) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <fieldset>
      <legend className="mb-2 font-display text-lg font-extrabold text-foreground">{legend}{multi && <span className="ms-2 text-xs font-bold text-muted-foreground">(يمكن اختيار أكثر من واحد)</span>}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={on(o.id)} onClick={() => onPick(o.id)}
            className={`rounded-2xl border-2 px-3 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${on(o.id) ? 'border-primary bg-secondary text-secondary-foreground shadow-card' : 'border-border bg-card text-foreground hover:border-primary'}`}>
            <span aria-hidden className="me-1">{o.icon}</span>{o.ar}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <label className="block font-bold">{label}
      <input type="number" min={min} max={max} value={value} onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        className="mt-2 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 outline-none focus:border-primary" />
    </label>
  );
}

const STEPS: { id: GameStep; name: string }[] = [
  { id: 'settings', name: 'إعدادات اللعبة' }, { id: 'platform', name: 'مستشارك الذكي والتطبيق' }, { id: 'prompt', name: 'برومت لعبتك' },
];

export function GameBuilder({ task, onChange }: { task: TaskData; onChange: (task: TaskData) => void }) {
  const [state, setState] = useState<GameState>(() => initialGameState(task));
  const [version, setVersion] = useState(0);
  const [needSignIn, setNeedSignIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const s = state.settings;
  const rec = useMemo(() => recommendPlatform(task, s), [task, s]);
  const platform = platformById(state.platform);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const prompt = useMemo(() => (state.platform ? buildGamePrompt(task, s, state.platform) : ''), [task, s, state.platform, version]);

  const commit = (next: GameState) => { setState(next); onChange({ ...task, game: next }); window.setTimeout(() => document.getElementById('game-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); };
  const set = (patch: Partial<GameSettings>) => setState((st) => ({ ...st, settings: { ...st.settings, ...patch } }));
  const adopt = (id: PlatformId) => { commit({ ...state, platform: id, step: 'prompt' }); toast.success(`تم اعتماد ${platformById(id)?.name}`); };
  const copy = async () => toast[(await copyText(prompt)) ? 'success' : 'error']('تم نسخ برومت اللعبة كاملاً');
  const save = async () => {
    if (!state.platform) return;
    setSaving(true);
    try {
      const ok = await saveLibraryGame({ name: s.name, settings: s, platform: state.platform, prompt,
        lesson: { subject: task.subject, grade: task.grade, lang: task.lang, title: task.title, goals: task.goals, content: task.content, constraints: task.constraints } });
      if (ok) { setNeedSignIn(false); toast.success('تم حفظ اللعبة في مكتبتي'); } else { setNeedSignIn(true); toast.error('سجّلي الدخول أولاً لحفظ اللعبة في مكتبتك'); }
    } catch { toast.error('تعذر الحفظ في المكتبة؛ أعيدي المحاولة'); }
    setSaving(false);
  };

  return (
    <section id="game-builder" className="mb-8 scroll-mt-24 overflow-hidden rounded-3xl border-2 border-primary bg-card shadow-card">
      <div className="bg-hero p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-foreground"><Gamepad2 aria-hidden className="h-8 w-8" /> استوديو الألعاب التفاعلية</h2>
          <Link to="/games-library" className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold text-foreground shadow-card hover:-translate-y-0.5"><BookMarked aria-hidden className="h-4 w-4" /> مكتبتي – ألعابي السابقة</Link>
        </div>
        <p className="mt-2 text-sm font-bold text-foreground">بيانات درسك وصلت تلقائياً؛ خصّصي اللعبة، ودعي المستشار يقترح التطبيق، ثم انسخي برومتاً تنفيذياً يبني لعبة حقيقية.</p>
        <ol className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold sm:text-sm">
          {STEPS.map((st, i) => {
            const idx = STEPS.findIndex((x) => x.id === state.step);
            return <li key={st.id} className={`rounded-2xl px-2 py-2 ${i === idx ? 'bg-card text-foreground shadow-card' : i < idx ? 'bg-secondary text-secondary-foreground' : 'bg-card/50 text-foreground'}`}>{i < idx ? '★' : i + 1}. {st.name}</li>;
          })}
        </ol>
      </div>

      <div className="p-6">
        {state.step === 'settings' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-gold p-4 text-sm text-gold-foreground">
              <p className="flex-1"><Sparkles aria-hidden className="me-1 inline h-4 w-4" /><b>اقتراح ذكي: </b>{suggestionNote(task)}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => { setState((st) => ({ ...st, settings: suggestSettings(task) })); toast.success('تمت استعادة الاقتراح الذكي'); }}>استعادة الاقتراح</Button>
            </div>
            <label className="block font-display text-lg font-extrabold">اسم اللعبة
              <input value={s.name} onChange={(e) => set({ name: e.target.value })} className="mt-2 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 font-sans text-base font-normal outline-none focus:border-primary" />
            </label>
            <Chips legend="١. نوع اللعبة" options={GAME_TYPES} value={s.type} onPick={(type) => set({ type })} />
            <Chips legend="٢. طريقة اللعب" options={PLAY_MODES} value={s.mode} onPick={(mode) => set({ mode })} />
            <Chips legend="٣. مستوى الصعوبة" options={DIFFICULTIES} value={s.difficulty} onPick={(difficulty) => set({ difficulty })} />
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField label="٤. عدد المراحل" value={s.levels} min={1} max={8} onChange={(levels) => set({ levels })} />
              <NumberField label="عدد التحديات في كل مرحلة" value={s.challenges} min={2} max={10} onChange={(challenges) => set({ challenges })} />
              <NumberField label="٧. الزمن المقترح (دقيقة)" value={s.minutes} min={3} max={60} onChange={(minutes) => set({ minutes })} />
            </div>
            <Chips legend="٥. نظام المكافآت" multi options={REWARDS} value={s.rewards} onPick={(r) => set({ rewards: s.rewards.includes(r) ? s.rewards.filter((x) => x !== r) : [...s.rewards, r] })} />
            <Chips legend="٦. النمط البصري" options={VISUALS} value={s.visual} onPick={(visual) => set({ visual })} />
            <label className="block font-bold">أسئلة أو تحديات تقترحينها (اختياري)
              <textarea value={s.extra} onChange={(e) => set({ extra: e.target.value })} rows={3} placeholder="اكتبي أسئلة أو تحديات تريدين تضمينها كما هي" className="mt-2 w-full rounded-2xl border-2 border-input bg-background p-3 font-normal outline-none focus:border-primary" />
            </label>
            <Button type="button" disabled={!s.name.trim() || s.rewards.length === 0} onClick={() => commit({ ...state, step: 'platform' })} className="w-full rounded-2xl py-6 font-display text-xl font-extrabold">
              التالي: مستشارك الذكي ←
            </Button>
            {s.rewards.length === 0 && <p className="text-center text-sm text-destructive">اختاري نوعاً واحداً على الأقل من المكافآت.</p>}
          </div>
        )}

        {state.step === 'platform' && (
          <div className="space-y-8">
            <div className="rounded-3xl border-2 border-primary bg-secondary p-5">
              <h3 className="mb-4 font-display text-xl font-extrabold">🧭 مستشارك الذكي – أين تصممين لعبتك؟</h3>
              <div className="flex flex-wrap items-center gap-3">
                <img src={platformLogo(rec.best)} alt={`أيقونة ${rec.best.name}`} width={48} height={48} className="h-12 w-12 rounded-xl bg-card object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-muted-foreground">التطبيق المقترح لهذه اللعبة</p>
                  <p dir="auto" className="font-display text-2xl font-extrabold">{rec.best.name}</p>
                </div>
                <a href={rec.best.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-card px-4 py-2 text-sm font-bold hover:shadow-card">فتح التطبيق <ExternalLink aria-hidden className="h-4 w-4" /></a>
              </div>
              <div className="mt-4 grid gap-4 text-sm leading-relaxed md:grid-cols-2">
                <div className="rounded-2xl bg-card p-4"><b className="mb-1 block">لماذا نوصي به لهذه اللعبة؟</b><ul className="list-disc space-y-1 ps-5">{rec.reasons.map((r) => <li key={r}>{r}</li>)}</ul></div>
                <div className="space-y-3 rounded-2xl bg-card p-4">
                  <p><b>ما الذي يمكن إنشاؤه من خلاله؟ </b>{rec.best.can}</p>
                  <p><b>ملاحظات حول الإمكانات والحدود: </b>{rec.best.limits}</p>
                  <p><b>الاشتراك والحساب: </b>{rec.best.plan}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 text-sm">
                <img src={platformLogo(rec.alt)} alt={`أيقونة ${rec.alt.name}`} width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />
                <p className="min-w-0 flex-1"><b>خيار بديل مناسب: {rec.alt.name}</b> — {rec.alt.when}</p>
                <Button type="button" variant="outline" size="sm" onClick={() => adopt(rec.alt.id)}>اعتماد البديل</Button>
              </div>
              <Button type="button" onClick={() => adopt(rec.best.id)} className="mt-4 w-full rounded-2xl py-6 font-display text-lg font-extrabold"><CheckCircle2 aria-hidden /> اعتماد هذا التطبيق</Button>
            </div>

            <div>
              <h3 className="mb-1 font-display text-xl font-extrabold">أين تريدين إنشاء لعبتك؟</h3>
              <p className="mb-4 text-sm text-muted-foreground">يمكنك اختيار تطبيق آخر؛ تظهر لكل تطبيق درجة ملاءمته للعبة التي اخترتِها.</p>
              <div className="grid gap-4 md:grid-cols-2">
                {GAME_PLATFORMS.map((p) => (
                  <div key={p.id} className={`game-card flex flex-col p-5 ${state.platform === p.id ? 'ring-2 ring-primary' : ''}`}>
                    <div className="mb-3 flex items-center gap-3">
                      <img src={platformLogo(p)} alt={`أيقونة ${p.name}`} width={40} height={40} loading="lazy" className="h-10 w-10 rounded-lg bg-card object-contain" />
                      <h4 dir="auto" className="flex-1 font-display text-lg font-extrabold">{p.name}</h4>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${rec.fit[p.id] >= 4 ? 'bg-primary text-primary-foreground' : rec.fit[p.id] >= 2 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>{fitLabel(rec.fit[p.id])}</span>
                    </div>
                    <p className="text-sm">{p.desc}</p>
                    <p className="mt-2 text-sm"><b>متى يناسبك؟ </b>{p.when}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{p.limits}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4 text-sm font-bold">
                      <Button type="button" size="sm" onClick={() => adopt(p.id)}>اختيار {p.name}</Button>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 hover:bg-muted">فتح <ExternalLink aria-hidden className="h-4 w-4" /></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button type="button" variant="outline" onClick={() => commit({ ...state, step: 'settings' })}><ArrowRight aria-hidden /> تعديل إعدادات اللعبة</Button>
          </div>
        )}

        {state.step === 'prompt' && platform && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="flex-1 font-display text-xl font-extrabold">🎮 برومت إنشاء لعبتك التفاعلية</h3>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-bold"><img src={platformLogo(platform)} alt="" width={20} height={20} className="h-5 w-5" />{platform.name}</span>
            </div>
            <p className="rounded-2xl bg-gold p-4 font-bold text-gold-foreground">انسخي البرومت كاملاً، ثم افتحي التطبيق المختار والصقيه في محادثة الذكاء الاصطناعي، واطلبي منه تنفيذ اللعبة وتشغيلها.</p>
            <p className="text-sm text-muted-foreground"><b>في {platform.name}: </b>{platform.howTo}</p>
            <pre dir={task.lang === 'en' ? 'ltr' : 'rtl'} className={`max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-muted p-5 font-sans text-sm leading-loose ${task.lang === 'en' ? 'text-left' : 'text-right'}`}>{prompt}</pre>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={copy}><Copy aria-hidden /> نسخ البرومت كاملاً</Button>
              <Button asChild variant="secondary"><a href={platform.url} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden /> فتح {platform.name}</a></Button>
              <Button type="button" variant="outline" onClick={() => commit({ ...state, step: 'settings' })}><Settings2 aria-hidden /> تعديل إعدادات اللعبة</Button>
              <Button type="button" variant="outline" onClick={() => { setVersion((v) => v + 1); onChange({ ...task, game: state }); toast.success('تمت إعادة إنشاء البرومت وفق أحدث بيانات الدرس والإعدادات'); }}><RefreshCw aria-hidden /> إعادة إنشاء البرومت</Button>
              <Button type="button" variant="outline" onClick={() => commit({ ...state, step: 'platform' })}><ArrowRight aria-hidden /> الرجوع إلى اختيار التطبيق</Button>
              <Button type="button" disabled={saving} onClick={save} className="bg-gold-grad text-gold-foreground"><Save aria-hidden /> {saving ? 'جارٍ الحفظ…' : 'حفظ في مكتبتي'}</Button>
            </div>
            {needSignIn && <CloudAccess message="مكتبة الألعاب مرتبطة بحسابك؛ سجّلي الدخول ثم اضغطي «حفظ في مكتبتي» مرة أخرى." onSignedIn={() => setNeedSignIn(false)} />}
          </div>
        )}
      </div>
    </section>
  );
}
