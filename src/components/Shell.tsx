import { Link } from "@tanstack/react-router";
import school from "@/assets/school_logo_official.webp.asset.json";
import quality from "@/assets/quality_logo.png.asset.json";
import ministry from "@/assets/ministry_logo.png.asset.json";

export const SCHOOL = "مدرسة الطالب الذكي الخاصة – فرع المعبيلة ٢ – سلطنة عُمان";
export const CREDIT_LABEL = "إنجاز وتصميم";
export const CREDIT_NAME = "الأستاذة دلال مختار صديقي";
export const CREDIT = `${CREDIT_LABEL} ${CREDIT_NAME}`;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="min-w-0 leading-tight">
            <span className="block font-display text-xl font-extrabold text-primary">MIDAD <span className="text-gold">|</span> مِداد</span>
            <span className="hidden truncate text-xs text-muted-foreground sm:block">مدرسة الطالب الذكي الخاصة – فرع المعبيلة ٢</span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 text-sm font-bold">
          <Link to="/" className="rounded-full px-3 py-2 text-muted-foreground hover:bg-muted" activeProps={{ className: "bg-secondary text-secondary-foreground" }} activeOptions={{ exact: true }}>
            الاستوديوهات
          </Link>
          <Link to="/desk" className="rounded-full px-3 py-2 text-muted-foreground hover:bg-muted" activeProps={{ className: "bg-secondary text-secondary-foreground" }}>
            🗂️ <span className="hidden sm:inline">مكتب مهامي</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

const LOGOS = [
  { src: school.url, alt: "شعار مدرسة الطالب الذكي الخاصة" },
  { src: ministry.url, alt: "شعار وزارة التربية والتعليم – سلطنة عُمان" },
  { src: quality.url, alt: "شعار نظام إدارة الجودة" },
];

/** Top institutional bar with the three original logos, shown above every page. */
export function LogoBar() {
  return (
    <div className="logo-bar border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:justify-center sm:gap-16">
        {LOGOS.map((l) => (
          <img key={l.alt} src={l.src} alt={l.alt} className="h-11 w-auto max-w-[6.5rem] object-contain sm:h-16 sm:max-w-[10rem]" />
        ))}
      </div>
    </div>
  );
}

export function CreditBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`credit-block inline-flex flex-col items-center ${className}`}>
      <span className="text-sm font-medium tracking-wide opacity-90 md:text-base">{CREDIT_LABEL}</span>
      <span className="mt-1 flex items-center gap-2 font-display text-2xl font-extrabold md:text-4xl">
        <span aria-hidden className="text-xl md:text-2xl">✒️</span>{CREDIT_NAME}
      </span>
      <span aria-hidden className="credit-rule mt-2 h-1 w-24 rounded-full" />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          <span className="font-display font-extrabold text-primary">MIDAD | مِداد</span>
          <span className="mx-2 text-gold">|</span>
          {CREDIT}
          <span className="mx-2 text-gold">|</span>
          {SCHOOL}
        </p>
      </div>
    </footer>
  );
}

export function Progress({ step, total = 6 }: { step: number; total?: number }) {
  const labels = ["المادة", "الصف", "اللغة", "العنوان", "الأهداف", "الانطلاق"];
  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-xs font-bold text-muted-foreground">
        <span>مرحلة {Math.min(step + 1, total)} من {total}</span>
        <span>{Math.round((step / total) * 100)}٪</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gold-grad transition-all duration-500" style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <div className="mt-3 hidden justify-between sm:flex">
        {labels.map((l, i) => (
          <div key={l} className="flex flex-col items-center gap-1 text-xs font-bold">
            <span className={`grid h-8 w-8 place-items-center rounded-full border-2 transition ${i < step ? "border-accent bg-accent text-accent-foreground" : i === step ? "border-gold bg-gold/20 text-gold-foreground" : "border-border bg-card text-muted-foreground"}`}>
              {i < step ? "★" : i + 1}
            </span>
            <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
