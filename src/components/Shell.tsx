import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-hero text-xl text-primary-foreground shadow-card">✒️</span>
          <span className="font-display text-2xl font-extrabold text-primary">مِداد</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-bold">
          <Link to="/" className="rounded-full px-3 py-2 text-muted-foreground hover:bg-muted" activeProps={{ className: "bg-secondary text-secondary-foreground" }} activeOptions={{ exact: true }}>
            الاستوديوهات
          </Link>
          <Link to="/desk" className="rounded-full px-3 py-2 text-muted-foreground hover:bg-muted" activeProps={{ className: "bg-secondary text-secondary-foreground" }}>
            🗂️ مكتب مهامي
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-muted-foreground">
        <span className="font-display font-extrabold text-primary">مِداد</span>
        <span className="mx-2 text-gold">|</span>
        إعداد وتصميم الأستاذة دلال مختار
        <span className="mx-2 text-gold">|</span>
        مدرسة الطالب الذكي الخاصة – فرع المعبيلة ٢
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
