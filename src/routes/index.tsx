import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/school_logo.png.asset.json";
import { STUDIOS, saveDraft } from "@/lib/midad";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مِداد | من الفكرة إلى المورد التعليمي" },
      { name: "description", content: "مِداد: لعبة تعليمية تساعد المعلمة على إعداد برومبت متخصص وأدوات مناسبة لمواردها التعليمية." },
      { property: "og:title", content: "مِداد | من الفكرة إلى المورد التعليمي" },
      { property: "og:description", content: "اختاري الاستوديو وانطلقي في رحلتك الإبداعية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center md:flex-row md:justify-center md:gap-10 md:text-right">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-3xl bg-card p-2 shadow-glow md:h-32 md:w-32">
            <img src={logo.url} alt="شعار مدرسة الطالب الذكي الخاصة" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="font-display text-6xl font-extrabold md:text-7xl">مِداد</h1>
            <p className="mt-1 text-lg font-bold text-gold md:text-xl">«من الفكرة إلى المورد التعليمي في وقت أقل»</p>
            <div className="mt-3 space-y-0.5 text-sm opacity-90">
              <p>إعداد وتصميم الأستاذة دلال مختار</p>
              <p>مدرسة الطالب الذكي الخاصة – فرع المعبيلة ٢</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="mx-auto mb-10 max-w-2xl text-center text-lg font-medium leading-relaxed">
          مرحباً بكِ في مِداد، اختاري الاستوديو الذي تريدين العمل فيه وانطلقي في رحلتك الإبداعية
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIOS.map((s, i) => (
            <Link
              key={s.id}
              to="/studio/$studioId"
              params={{ studioId: s.id }}
              onClick={() => saveDraft({})}
              className="game-card pop-in group relative flex flex-col items-center gap-3 overflow-hidden p-7 text-center"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="absolute left-4 top-4 rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-gold-foreground">{i + 1}</span>
              <span className="grid h-20 w-20 place-items-center rounded-3xl bg-secondary text-4xl transition group-hover:scale-110 group-hover:bg-gold/25">
                {s.icon}
              </span>
              <h2 className="font-display text-xl font-extrabold text-primary">{s.name}</h2>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <span className="mt-1 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-accent-foreground">ابدئي ←</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
