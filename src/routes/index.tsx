import { createFileRoute, Link } from "@tanstack/react-router";
import { STUDIOS, saveDraft } from "@/lib/midad";
import { STUDIO_IMAGES } from "@/lib/studio-images";
import { CREDIT, InstitutionBand, SCHOOL } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MIDAD | مِداد – مداد الإبداع التربوي" },
      { name: "description", content: "MIDAD – Creative Learning Studios: استوديوهات متخصصة تساعد المعلمة من الفكرة إلى المورد التعليمي." },
      { property: "og:title", content: "MIDAD | مِداد – مداد الإبداع التربوي" },
      { property: "og:description", content: "من الفكرة إلى المورد التعليمي – Creative Learning Studios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="islamic-pattern pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center md:py-20">
          <p dir="ltr" className="text-xs font-bold uppercase tracking-[0.35em] text-gold md:text-sm">Creative Learning Studios</p>
          <h1 className="mt-3 font-display text-6xl font-extrabold md:text-8xl">
            <span dir="ltr">MIDAD</span> <span className="text-gold">|</span> مِداد
          </h1>
          <p className="mt-3 font-display text-2xl font-extrabold md:text-3xl">مداد الإبداع التربوي</p>
          <p className="mt-2 text-lg font-bold text-gold md:text-xl">من الفكرة إلى المورد التعليمي</p>
          <figure className="mx-auto mt-8 max-w-2xl rounded-3xl border border-primary-foreground/25 bg-primary-foreground/10 px-6 py-5 backdrop-blur-sm">
            <blockquote lang="ar" className="font-quran text-2xl leading-loose md:text-3xl">
              ﴿قُل لَّوْ كَانَ الْبَحْرُ مِدَادًا لِّكَلِمَاتِ رَبِّي لَنَفِدَ الْبَحْرُ قَبْلَ أَن تَنفَدَ كَلِمَاتُ رَبِّي﴾
            </blockquote>
            <figcaption className="mt-2 text-sm opacity-90">سورة الكهف: الآية ١٠٩</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-border bg-card py-6">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <InstitutionBand />
          <p className="mt-3 text-sm font-bold text-primary">{SCHOOL}</p>
          <p className="text-xs text-muted-foreground">{CREDIT}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-primary">مرحباً بكِ في مساحتك الإبداعية</h2>
          <p className="mt-2 text-lg text-muted-foreground">اختاري الاستوديو الذي تريدين العمل فيه، وانطلقي في رحلتك من الفكرة إلى المورد التعليمي.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIOS.map((s, i) => (
            <Link
              key={s.id}
              to="/studio/$studioId"
              params={{ studioId: s.id }}
              onClick={() => saveDraft({})}
              className="game-card pop-in group flex flex-col overflow-hidden text-center"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img src={STUDIO_IMAGES[s.id]} alt={s.name} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col items-center gap-2 p-5">
                <h3 className="font-display text-xl font-extrabold text-primary">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                <span className="mt-auto rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">ادخلي الاستوديو ←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
