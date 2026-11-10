// Interactive games studio: settings, smart platform advisor and executive prompt builder.
// Pure functions only so the rules stay unit-testable.
import { ageLabel, goalList, gradeLabel, subjectLabel, GRADES, type TaskData } from "@/lib/midad";

export type GameType = "adventure" | "treasure" | "maze" | "speed" | "teams" | "dragdrop" | "memory" | "creative";
export type PlayMode = "solo" | "pairs" | "groups";
export type Difficulty = "easy" | "medium" | "advanced" | "graded";
export type Reward = "stars" | "points" | "badges" | "levels" | "trophy";
export type VisualStyle = "cartoon" | "explore" | "3d" | "modern" | "omani" | "auto";
export type PlatformId = "gemini-canvas" | "gemini-canva" | "lovable" | "canva-code" | "genially" | "makeit";
export type GameStep = "settings" | "platform" | "prompt";

export interface GameSettings {
  name: string;
  type: GameType;
  mode: PlayMode;
  difficulty: Difficulty;
  levels: number;
  challenges: number;
  rewards: Reward[];
  visual: VisualStyle;
  minutes: number;
  extra: string;
}
export interface GameState { settings: GameSettings; platform?: PlatformId | undefined; step: GameStep }

type Opt<T extends string> = { id: T; ar: string; en: string; icon: string; mechanicAr?: string; mechanicEn?: string };

export const GAME_TYPES: Opt<GameType>[] = [
  { id: "adventure", ar: "مغامرة تعليمية", en: "Learning adventure", icon: "🧭", mechanicAr: "رحلة على خريطة يتنقل فيها البطل بين محطات، ولا يفتح المحطة التالية إلا بعد حل تحديات المحطة الحالية، مع أحداث قصة تتطور مع كل مرحلة.", mechanicEn: "A map journey where the hero travels between stations; the next station unlocks only after solving the current challenges, and the story develops at each level." },
  { id: "treasure", ar: "كنز المعرفة", en: "Treasure of knowledge", icon: "💎", mechanicAr: "صناديق أو أبواب مغلقة يحصل المتعلم على مفتاح أو قطعة خريطة عند كل إجابة صحيحة، وتجميع القطع يفتح صندوق الكنز النهائي.", mechanicEn: "Locked chests or doors; each correct answer earns a key or map piece, and collecting all pieces opens the final treasure chest." },
  { id: "maze", ar: "متاهة تفاعلية", en: "Interactive maze", icon: "🌀", mechanicAr: "متاهة يحرّك فيها المتعلم الشخصية بالأسهم أو بالنقر، وتعترض طريقه بوابات أسئلة لا تُفتح إلا بالإجابة الصحيحة.", mechanicEn: "A maze where the learner moves the character with arrow keys or taps; question gates block the path and open only with a correct answer." },
  { id: "speed", ar: "تحدي السرعة", en: "Speed challenge", icon: "⚡", mechanicAr: "عدّاد زمني تنازلي لكل تحدٍّ، ونقاط إضافية للإجابة السريعة الصحيحة، مع سلسلة إجابات متتالية تضاعف النقاط.", mechanicEn: "A countdown timer per challenge, bonus points for fast correct answers and a streak multiplier." },
  { id: "teams", ar: "تحدي الفرق", en: "Team challenge", icon: "🏁", mechanicAr: "فرق تتناوب على الأدوار، ولوحة نقاط لكل فريق تظهر على الشاشة، وتحديات مشتركة يجيب عنها الفريق صاحب الدور.", mechanicEn: "Teams take turns, a live scoreboard per team is shown on screen and the team whose turn it is answers each challenge." },
  { id: "dragdrop", ar: "السحب والإفلات", en: "Drag and drop", icon: "🧩", mechanicAr: "عناصر يسحبها المتعلم إلى أماكنها الصحيحة (تصنيف، ترتيب، مطابقة)، مع ارتداد العنصر الخاطئ إلى مكانه وتلميح لطيف.", mechanicEn: "Items the learner drags to the correct place (sort, order, match); a wrong item bounces back with a gentle hint." },
  { id: "memory", ar: "لعبة الذاكرة والمطابقة", en: "Memory & matching", icon: "🃏", mechanicAr: "بطاقات مقلوبة يقلبها المتعلم بحثاً عن الأزواج المتطابقة (كلمة وصورة، سؤال وإجابة)، مع عدّاد محاولات.", mechanicEn: "Face-down cards the learner flips to find matching pairs (word–picture, question–answer), with a move counter." },
  { id: "creative", ar: "لعبة إبداعية مفتوحة", en: "Open creative game", icon: "🎨", mechanicAr: "مهام إبداعية يبني فيها المتعلم أو يرسم أو يركّب عناصر لتحقيق الهدف، مع تحديات صغيرة قابلة للتحقق ومكافأة على الإنجاز.", mechanicEn: "Creative missions where the learner builds, draws or assembles elements to reach the goal, with small checkable challenges and rewards." },
];
export const PLAY_MODES: Opt<PlayMode>[] = [
  { id: "solo", ar: "فردي", en: "Single player", icon: "🧒" },
  { id: "pairs", ar: "ثنائي", en: "Pairs", icon: "👫" },
  { id: "groups", ar: "مجموعات", en: "Groups / teams", icon: "👨‍👩‍👧‍👦" },
];
export const DIFFICULTIES: Opt<Difficulty>[] = [
  { id: "easy", ar: "سهل", en: "Easy", icon: "🌱" },
  { id: "medium", ar: "متوسط", en: "Medium", icon: "🌿" },
  { id: "advanced", ar: "متقدم", en: "Advanced", icon: "🌳" },
  { id: "graded", ar: "متدرج من السهل إلى المتقدم", en: "Graded from easy to advanced", icon: "📈" },
];
export const REWARDS: Opt<Reward>[] = [
  { id: "stars", ar: "النجوم", en: "Stars", icon: "⭐" },
  { id: "points", ar: "النقاط", en: "Points", icon: "🔢" },
  { id: "badges", ar: "الشارات", en: "Badges", icon: "🏅" },
  { id: "levels", ar: "المستويات", en: "Levels", icon: "🪜" },
  { id: "trophy", ar: "الكأس النهائي", en: "Final trophy", icon: "🏆" },
];
export const VISUALS: Opt<VisualStyle>[] = [
  { id: "cartoon", ar: "كرتوني مرح", en: "Playful cartoon", icon: "🐻" },
  { id: "explore", ar: "مغامرات واستكشاف", en: "Adventure & exploration", icon: "🗺️" },
  { id: "3d", ar: "ثلاثي الأبعاد", en: "3D look", icon: "🧊" },
  { id: "modern", ar: "تصميم تعليمي عصري", en: "Modern educational", icon: "✨" },
  { id: "omani", ar: "هوية عمانية وتراثية", en: "Omani heritage identity", icon: "🕌" },
  { id: "auto", ar: "يختار الذكاء الاصطناعي الأنسب للدرس", en: "AI chooses the best style for the lesson", icon: "🤖" },
];

const label = <T extends string>(list: Opt<T>[], id: T, en: boolean) => { const o = list.find((x) => x.id === id); return o ? (en ? o.en : o.ar) : id; };
export const gameTypeName = (id: GameType) => label(GAME_TYPES, id, false);

const SUBJECT_TYPE: Record<string, GameType> = {
  "الرياضيات الممتعة": "adventure", "أحب عربي": "memory", "ديني حياتي": "treasure", "الهوية والمواطنة": "adventure",
  "التقنية": "maze", "المطالعة": "adventure", "الإنجليزية": "memory", "رياضة": "teams", "فنون تشكيلية": "creative",
};

/** Smart defaults suited to the grade and the subject; the teacher can change every value. */
export function suggestSettings(d: Pick<TaskData, "subject" | "grade" | "title">): GameSettings {
  const g = Math.max(0, GRADES.indexOf(d.grade as (typeof GRADES)[number]));
  const type = SUBJECT_TYPE[d.subject] ?? "adventure";
  return {
    name: `${gameTypeName(type)}: ${d.title.trim()}`,
    type,
    mode: d.subject === "رياضة" ? "groups" : "solo",
    difficulty: "graded",
    levels: g >= 2 ? 4 : 3,
    challenges: g >= 2 ? 5 : 4,
    rewards: g >= 2 ? ["points", "badges", "trophy"] : ["stars", "trophy"],
    visual: g >= 2 ? "explore" : "cartoon",
    minutes: [10, 12, 15, 15][g] ?? 12,
    extra: "",
  };
}
export function suggestionNote(d: Pick<TaskData, "subject" | "grade">): string {
  const s = suggestSettings({ ...d, title: "" });
  return `اقترحنا لـ${d.grade} في مادة ${d.subject}: ${gameTypeName(s.type)}، ${s.levels} مراحل في كل منها ${s.challenges} تحديات، صعوبة متدرجة، ونحو ${s.minutes} دقيقة؛ ${Number(GRADES.indexOf(d.grade as (typeof GRADES)[number])) < 2 ? "مكافآت بصرية بسيطة ونمط كرتوني يناسب الصغار" : "نقاط وشارات ونمط استكشاف يناسب هذا العمر"}.`;
}

export interface Platform {
  id: PlatformId; name: string; url: string; domain: string;
  desc: string; when: string; can: string; limits: string; plan: string; howTo: string;
}
export const GAME_PLATFORMS: Platform[] = [
  { id: "gemini-canvas", name: "Gemini Canvas", url: "https://gemini.google.com/", domain: "gemini.google.com",
    desc: "يحوّل الوصف إلى لعبة ويب تعمل داخل مساحة Canvas مع معاينة فورية.",
    when: "عندما تريدين لعبة قابلة للتشغيل بسرعة، متوسطة التعقيد، لتجربتها ومشاركتها خلال دقائق.",
    can: "ألعاب أسئلة، تحدي السرعة، الذاكرة، السحب والإفلات، ومتاهات بسيطة بكود يعمل في المتصفح.",
    limits: "لا يحفظ نتائج المتعلمين في قاعدة بيانات، وقد تحتاجين إلى طلبات تصحيح إضافية للألعاب الطويلة.",
    plan: "يعمل بحساب Google، وتختلف بعض الإمكانات والنماذج بحسب الحساب والمنطقة.",
    howTo: "افتحي Gemini، اختاري Canvas من أدوات المحادثة، ثم الصقي البرومت." },
  { id: "gemini-canva", name: "Gemini مع Canva", url: "https://gemini.google.com/", domain: "canva.com",
    desc: "يستخدم تطبيق Canva المتصل داخل Gemini لإنشاء تصميم لعبة صفية قابل للتعديل في Canva.",
    when: "عندما تريدين نشاط لعب بصرياً جميلاً للعرض على السبورة أو الطباعة، يعتمد على الشرائح والبطاقات.",
    can: "شرائح لكل شاشة، بطاقات تحديات، لوحة نقاط ومراحل تكملينها وتعدلينها في Canva.",
    limits: "التصميم ليس محرك ألعاب: لا يحتسب النقاط تلقائياً ولا يتحقق من الإجابات برمجياً.",
    plan: "يتطلب ربط حساب Canva داخل Gemini، وتوفره يختلف حسب الحساب والمنطقة واللغة.",
    howTo: "فعّلي تطبيق Canva في Gemini، ثم الصقي البرومت واطلبي فتح التصميم في Canva." },
  { id: "lovable", name: "Lovable", url: "https://lovable.dev/", domain: "lovable.dev",
    desc: "يبني تطبيق ويب تفاعلياً كاملاً من المحادثة: شاشات ومنطق لعب ونقاط ومراحل، ثم ينشره برابط.",
    when: "عندما تريدين لعبة متكاملة بمراحل متعددة وقواعد ونقاط ومؤثرات أو لعب بين فرق.",
    can: "مغامرات، متاهات، تحديات فرق، سحب وإفلات، لوحة نتائج، أصوات، ونشر برابط مشاركة.",
    limits: "يستهلك رصيد الرسائل، والخطة المجانية محدودة؛ قد تحتاجين إلى عدة رسائل للتجربة والتعديل.",
    plan: "خطة مجانية برصيد محدود، والاستخدام الأوسع باشتراك.",
    howTo: "افتحي Lovable، أنشئي مشروعاً جديداً، ثم الصقي البرومت في المحادثة." },
  { id: "canva-code", name: "Canva Code", url: "https://www.canva.com/", domain: "www.canva.com",
    desc: "ينشئ تجربة تفاعلية بالذكاء الاصطناعي داخل Canva يمكن تعديلها أو تضمينها في عرض أو سبورة.",
    when: "عندما تريدين لعبة قصيرة ومركّزة تدمجينها داخل عرض أو سبورة Canva.",
    can: "ألعاب أسئلة، مطابقة، بطاقات قلب، تحديات قصيرة بأزرار كبيرة ونقاط بسيطة.",
    limits: "الأنسب للألعاب القصيرة؛ المراحل الكثيرة والمنطق المعقد قد لا يكتملان، ولا يحفظ نتائج المتعلمين.",
    plan: "متاح لحسابات Canva ومنها حسابات التعليم، وحدود الاستخدام تختلف حسب الحساب.",
    howTo: "افتحي Canva، اختاري Canva Code (أو Canva AI ثم Code)، ثم الصقي البرومت." },
  { id: "genially", name: "Genially", url: "https://genially.com/", domain: "genially.com",
    desc: "منصة قوالب تفاعلية: غرف هروب ومغامرات وألعاب لوحية تعتمد على النقر والصفحات.",
    when: "عندما تريدين مغامرة أو كنز معرفة أو غرفة هروب بصرية قائمة على الاستكشاف.",
    can: "قوالب ألعاب، أزرار وانتقالات بين الصفحات، نوافذ منبثقة للتلميحات، وأسئلة اختيار بالنقر.",
    limits: "التفاعل مبني على القوالب والنقر؛ احتساب النقاط المتقدم محدود، والبناء يدوي غالباً.",
    plan: "خطة مجانية بقوالب محدودة، وقوالب وميزات أكثر باشتراك.",
    howTo: "إن لم يتوفر مساعد ذكي داخل حسابك في Genially، الصقي البرومت في ChatGPT أو Gemini لتحصلي على خطة البناء صفحة بصفحة، ثم نفّذيها في القالب." },
  { id: "makeit", name: "Make It", url: "https://makeit.app/", domain: "makeit.app",
    desc: "تطبيق لإنشاء ألعاب واختبارات من أكثر من ٢٠ نوع نشاط جاهز، ويدعم العربية من اليمين إلى اليسار.",
    when: "عندما تريدين ألعاباً قصيرة للصغار: ذاكرة ومطابقة وسحب وإفلات وترتيب، ومشاركتها برمز.",
    can: "اختبارات، صح وخطأ، سحب وإفلات، توصيل، ذاكرة، ترتيب، كلمة ناقصة، بالصور والأصوات.",
    limits: "لا يولّد لعبة مخصصة كاملة من نص؛ تبنين الأنشطة داخل القوالب. المجانية تسمح بمشروعين وصف واحد.",
    plan: "مجاني بحدود، والاشتراك يفتح الاستخدام دون حدود.",
    howTo: "الصقي البرومت في ChatGPT أو Gemini لتجهيز محتوى كل نشاط، ثم أنشئي الأنشطة في Make It بحسب القوالب المحددة." },
];
export const platformById = (id: PlatformId | undefined) => GAME_PLATFORMS.find((p) => p.id === id);
export const platformLogo = (p: Platform) => `https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`;

const FIT: Record<GameType, Record<PlatformId, number>> = {
  adventure: { lovable: 3, "gemini-canvas": 2, genially: 3, "canva-code": 1, "gemini-canva": 1, makeit: 0 },
  treasure: { genially: 3, lovable: 2, "gemini-canvas": 2, "canva-code": 1, "gemini-canva": 1, makeit: 1 },
  maze: { lovable: 3, "gemini-canvas": 3, genially: 1, "canva-code": 1, "gemini-canva": 0, makeit: 0 },
  speed: { "gemini-canvas": 3, lovable: 2, "canva-code": 2, makeit: 2, genially: 1, "gemini-canva": 0 },
  teams: { lovable: 3, "gemini-canvas": 2, genially: 2, "gemini-canva": 2, "canva-code": 1, makeit: 1 },
  dragdrop: { makeit: 3, lovable: 2, "gemini-canvas": 2, "canva-code": 2, genially: 1, "gemini-canva": 0 },
  memory: { makeit: 3, "gemini-canvas": 3, "canva-code": 2, lovable: 2, genially: 1, "gemini-canva": 0 },
  creative: { "canva-code": 3, "gemini-canva": 3, "gemini-canvas": 2, lovable: 2, genially: 1, makeit: 1 },
};

export type Complexity = "low" | "mid" | "high";
export function gameComplexity(s: GameSettings): Complexity {
  const score = s.levels * s.challenges + (s.mode === "groups" ? 4 : s.mode === "pairs" ? 2 : 0) + (s.difficulty === "graded" ? 2 : 0) + (s.rewards.length > 2 ? 2 : 0);
  return score <= 12 ? "low" : score <= 22 ? "mid" : "high";
}
const COMPLEXITY_AR: Record<Complexity, string> = { low: "بسيط", mid: "متوسط", high: "مرتفع" };

export function platformScores(d: Pick<TaskData, "grade">, s: GameSettings): Record<PlatformId, number> {
  const c = gameComplexity(s);
  const out = { ...FIT[s.type] };
  const add = (id: PlatformId, n: number) => { out[id] += n; };
  if (c === "high") { add("lovable", 2); add("gemini-canvas", 1); add("makeit", -1); add("gemini-canva", -1); add("canva-code", -1); }
  if (c === "low") { add("makeit", 1); add("canva-code", 1); add("gemini-canvas", 1); }
  if (s.visual === "omani" || s.visual === "3d") { add("lovable", 1); add("gemini-canvas", 1); }
  if (d.grade === "الصف الأول" && (s.type === "memory" || s.type === "dragdrop")) add("makeit", 1);
  return out;
}

export interface Recommendation { best: Platform; alt: Platform; complexity: Complexity; reasons: string[]; fit: Record<PlatformId, number> }
const ORDER: PlatformId[] = ["lovable", "gemini-canvas", "genially", "makeit", "canva-code", "gemini-canva"];

/** Rule-based advisor: compares the requested game with what each platform really supports. */
export function recommendPlatform(d: Pick<TaskData, "grade">, s: GameSettings): Recommendation {
  const fit = platformScores(d, s);
  const ranked = [...ORDER].sort((a, b) => fit[b] - fit[a] || ORDER.indexOf(a) - ORDER.indexOf(b));
  const best = platformById(ranked[0])!, alt = platformById(ranked[1])!;
  const c = gameComplexity(s);
  const reasons = [
    `نوع اللعبة «${gameTypeName(s.type)}» يحتاج إلى: ${GAME_TYPES.find((t) => t.id === s.type)?.mechanicAr ?? ""}`,
    `${best.name} يدعم ذلك فعلياً: ${best.can}`,
    `مستوى التعقيد ${COMPLEXITY_AR[c]}: ${s.levels} مراحل × ${s.challenges} تحديات، ${label(PLAY_MODES, s.mode, false)}${s.difficulty === "graded" ? "، مع صعوبة متدرجة" : ""}.`,
    c === "high" ? "كثرة المراحل والتحديات تتطلب منطق لعب مبرمجاً حقيقياً لاحتساب النقاط والانتقال بين المراحل." : c === "low" ? "لعبة قصيرة؛ يكفيها تطبيق سريع الإعداد دون بناء تطبيق كامل." : "تعقيد متوسط يحتاج إلى تفاعل حقيقي دون مشروع كبير.",
  ];
  return { best, alt, complexity: c, reasons, fit };
}
export function fitLabel(score: number) { return score >= 4 ? "مناسب جداً" : score >= 2 ? "مناسب" : "محدود لهذه اللعبة"; }

// ---------- executive prompt ----------
const TECH: Record<PlatformId, { ar: string[]; en: string[]; roleAr: string; roleEn: string }> = {
  lovable: {
    roleAr: "مطوّر ألعاب ويب تعليمية خبير يعمل داخل Lovable", roleEn: "an expert educational web-game developer working in Lovable",
    ar: ["ابنِ تطبيق ويب تفاعلياً كاملاً يحتوي على جميع الشاشات ومنطق اللعب وإدارة حالة النقاط والمراحل والمكافآت.", "احفظ تقدم اللاعب وأفضل نتيجة في تخزين المتصفح المحلي؛ لا حاجة إلى تسجيل دخول أو قاعدة بيانات.", "ارسم الشخصيات والعناصر بـ SVG/CSS أو رسومات مولدة متسقة، وأضف حركات انتقال خفيفة واحتفالاً عند إنهاء كل مرحلة.", "ولّد الأصوات القصيرة (صواب، خطأ، فوز) بـ Web Audio مع زر كتم ظاهر دائماً.", "بعد البناء جرّب كل شاشة ومرحلة وزر بنفسك، وأصلح الأخطاء، ثم اذكر ما اختبرته، وجهّز اللعبة للنشر برابط مشاركة."],
    en: ["Build a complete interactive web app containing every screen, the game logic and state management for points, levels and rewards.", "Store player progress and best score in browser local storage; no login or database is needed.", "Draw characters and elements with SVG/CSS or consistent generated art, add light transitions and a celebration at the end of each level.", "Generate short sounds (correct, wrong, win) with Web Audio, with a mute button that is always visible.", "After building, test every screen, level and button yourself, fix bugs, report what you tested and prepare the game for publishing with a share link."],
  },
  "gemini-canvas": {
    roleAr: "مطوّر ألعاب تعليمية يعمل داخل Gemini Canvas", roleEn: "an educational game developer working inside Gemini Canvas",
    ar: ["أنشئ اللعبة داخل Canvas كتطبيق ويب واحد قابل للتشغيل (HTML وCSS وJavaScript في ملف واحد) يعمل في المعاينة مباشرة.", "لا تعتمد على مكتبات تحتاج تثبيتاً أو على صور خارجية قد لا تُحمّل؛ استخدم رسومات CSS/SVG أو رموزاً تعبيرية.", "اجعل الكود منظماً ومعلّقاً بحيث أستطيع طلب تعديلات لاحقة على الأسئلة أو التصميم.", "شغّل المعاينة بعد الإنشاء وأصلح أي خطأ، ثم أخبرني كيف أشارك اللعبة من زر المشاركة في Canvas."],
    en: ["Create the game inside Canvas as one runnable web app (HTML, CSS and JavaScript in a single file) that works directly in the preview.", "Do not rely on libraries that need installing or external images that may not load; use CSS/SVG graphics or emoji.", "Keep the code organised and commented so I can request later changes to questions or design.", "Run the preview after creating it, fix any error, then tell me how to share the game from the Canvas share button."],
  },
  "canva-code": {
    roleAr: "مصمم تجارب تعليمية تفاعلية يستخدم Canva Code", roleEn: "an interactive learning-experience designer using Canva Code",
    ar: ["أنشئ تجربة تفاعلية قصيرة ومركّزة باستخدام Canva Code يمكن تضمينها في عرض أو سبورة Canva.", "استخدم أزراراً كبيرة واضحة وعناصر بصرية بسيطة، ومنطق نقاط وانتقال بين المراحل داخل التجربة نفسها.", "لا تعتمد على خوادم أو حفظ بيانات خارجي.", "إذا كان عدد المراحل كبيراً على تجربة واحدة، فاقترح تقسيمها إلى تجارب أصغر مترابطة ونفّذ الأولى كاملة."],
    en: ["Create a short, focused interactive experience with Canva Code that can be embedded in a Canva presentation or whiteboard.", "Use large clear buttons and simple visuals, with point logic and level transitions inside the experience itself.", "Do not rely on servers or external data storage.", "If there are too many levels for one experience, propose splitting it into smaller linked experiences and fully build the first one."],
  },
  "gemini-canva": {
    roleAr: "مصمم أنشطة لعب صفية يستخدم تطبيق Canva المتصل في Gemini", roleEn: "a classroom game-activity designer using the Canva connected app in Gemini",
    ar: ["أنشئ تصميماً في Canva لنشاط لعب صفي: صفحة لكل شاشة (البداية، التعليمات، كل مرحلة، النتائج) وبطاقات تحديات واضحة.", "استخدم روابط تنقل بين الصفحات داخل التصميم لتمثيل الانتقال بين المراحل والإجابات.", "بما أن التصميم لا يحتوي على منطق برمجي، أضف لوحة نقاط تملؤها المعلمة أو الفرق، وتعليمات احتساب النقاط يدوياً.", "اجعل التصميم قابلاً للتعديل في Canva وللعرض على السبورة أو الطباعة."],
    en: ["Create a Canva design for a classroom game activity: one page per screen (start, instructions, each level, results) and clear challenge cards.", "Use page links inside the design to represent moving between levels and answers.", "Because the design has no programmed logic, add a scoreboard filled in by the teacher or teams, with instructions for manual scoring.", "Keep the design editable in Canva and suitable for board display or printing."],
  },
  genially: {
    roleAr: "مصمم ألعاب تعليمية خبير في قوالب Genially", roleEn: "an educational game designer expert in Genially templates",
    ar: ["اقترح قالب Genially المناسب لهذا النوع (غرفة هروب، مغامرة، لعبة لوحية أو مسابقة) واذكر سبب اختياره.", "أخرج خطة بناء صفحة بصفحة: محتوى كل صفحة، عناصرها التفاعلية، الأزرار ووجهة كل زر.", "اجعل الإجابة الصحيحة تقود إلى الصفحة التالية أو تمنح مفتاحاً/شارة، والإجابة الخاطئة تفتح نافذة تلميح ثم تعيد المحاولة.", "استخدم إمكانات القالب المتاحة لاحتساب التقدم (مفاتيح، شارات، عدّاد إن وجد)، ولا تطلب برمجة غير مدعومة في Genially."],
    en: ["Suggest the right Genially template for this game type (escape room, adventure, board game or quiz) and explain why.", "Output a page-by-page build plan: each page's content, interactive elements, buttons and where each button leads.", "A correct answer leads to the next page or grants a key/badge; a wrong answer opens a hint pop-up and then allows a retry.", "Use the template's available features to track progress (keys, badges, a counter if available) and do not ask for programming Genially does not support."],
  },
  makeit: {
    roleAr: "مصمم أنشطة تعليمية تفاعلية خبير في Make It", roleEn: "an interactive learning-activity designer expert in Make It",
    ar: ["حوّل كل مرحلة إلى نشاط من أنواع Make It المدعومة: اختبار، صح وخطأ، سحب وإفلات، توصيل، ذاكرة، ترتيب، كلمة ناقصة.", "أخرج لكل نشاط: نوع القالب، نص التعليمات القصير، العناصر والصور المقترحة، الصوت المقترح، والإجابات الصحيحة للمعلمة.", "رتّب الأنشطة في مشروع واحد متسلسل بحسب المراحل، واقترح المكافآت والمؤقتات المتاحة في التطبيق.", "لا تطلب ميزات غير موجودة في Make It؛ المشاركة تتم برمز أو رابط أو عبر الصف الافتراضي."],
    en: ["Turn each level into a supported Make It activity type: quiz, true/false, drag and drop, connect, memory, ordering, missing word.", "For each activity give: template type, short instruction text, suggested items and pictures, suggested sound and the correct answers for the teacher.", "Arrange the activities in one sequenced project by level and suggest the rewards and timers available in the app.", "Do not ask for features Make It does not have; sharing works by code, link or a classroom."],
  },
};

export function buildGamePrompt(d: TaskData, s: GameSettings, platformId: PlatformId): string {
  const en = d.lang === "en";
  const t = TECH[platformId];
  const p = platformById(platformId)!;
  const type = GAME_TYPES.find((x) => x.id === s.type)!;
  const goals = goalList(d.goals);
  const total = s.levels * s.challenges;
  const rewards = s.rewards.map((r) => label(REWARDS, r, en)).join(en ? ", " : "، ") || (en ? "stars" : "النجوم");
  const multiplayer = s.mode !== "solo";
  if (en) {
    return [
      `Act as ${t.roleEn}. Build a REAL, playable, interactive educational digital game called "${s.name.trim()}" — not an idea, a description, a quiz list or a static slideshow.`,
      ``,
      `## A. Educational identity`,
      `- Subject: ${subjectLabel(d.subject, "en")}`,
      `- Grade: ${gradeLabel(d.grade, "en")} (learners aged ${ageLabel(d.grade, "en")})`,
      `- Lesson title: ${d.title.trim()}`,
      `- Game language for learners: simple English suitable for this age`,
      `- Original learning objectives (use exactly these, do not add, remove or change any):`,
      ...goals.map((g, i) => `  ${i + 1}. ${g}`),
      ...(d.content ? [`- Lesson content to rely on (do not change it): ${d.content}`] : []),
      ...(d.constraints ? [`- Teacher constraints: ${d.constraints}`] : []),
      ...(s.extra.trim() ? [`- Questions/challenges supplied by the teacher (include them as written): ${s.extra.trim()}`] : []),
      ``,
      `## B. Experience design`,
      `- Game type: ${type.en}. Core mechanic: ${type.mechanicEn} Do not turn it into a plain traditional quiz.`,
      `- Play mode: ${label(PLAY_MODES, s.mode, true)}. Suggested duration: about ${s.minutes} minutes.`,
      `- Visual style: ${label(VISUALS, s.visual, true)}.`,
      `- Write a short motivating story/frame for the game suited to ${ageLabel(d.grade, "en")}, and describe the characters and visual elements.`,
      `- Screens: start screen (game name, character, Start button) → instructions screen (short illustrated rules)${multiplayer ? " → player/team selection screen (names and colours)" : ""} → ${s.levels} level screens → final results screen (score, rewards, Play again button).`,
      ``,
      `## C. Game logic`,
      `- ${s.levels} levels × ${s.challenges} challenges = ${total} challenges in total. Difficulty: ${label(DIFFICULTIES, s.difficulty, true)}.`,
      `- Rules: explain them on the instructions screen in 3–5 short steps.`,
      `- Level transition: the next level unlocks after finishing the current one; show a short celebration between levels.`,
      `- Scoring: award ${rewards}; the score must change for real according to the player's answers${multiplayer ? ", with a separate live score for each player/team and turn rotation" : ""}.`,
      `- Win/lose: winning = completing all levels; a wrong answer costs an attempt, never ends the game harshly; when attempts run out the player can retry the level.`,
      `- Retry: a Retry button on every level and Play again on the results screen.`,
      `- Instant feedback: an encouraging message and sound when correct, a gentle hint when wrong.`,
      ``,
      `## D. Learning content`,
      `- Write accurate challenges linked to the objectives above; label each challenge with the objective number it serves, and cover every objective.`,
      `- Vary challenge types in a way that fits the ${type.en} mechanic.`,
      `- For multiple choice, give 3–4 plausible options; store the correct answer in the game logic only.`,
      `- Show hints after a wrong answer; never reveal the solution before the learner answers.`,
      `- Move from concrete to abstract where suitable for the lesson.`,
      `- Put a separate teacher answer key at the end of your response (or behind a "Teacher" button), not on learner screens.`,
      ``,
      `## E. Technical implementation (${p.name})`,
      ...t.en.map((x) => `- ${x}`),
      `- Every button and element must be clickable and interactive; program all screen and level transitions.`,
      `- Add suitable visual and motion effects; optional sounds with a mute option.`,
      `- Make it work on computers, tablets and phones (large touch targets).`,
      `- Test the game and fix errors before announcing it is complete.`,
      `- Provide a way to preview, publish and share the link if ${p.name} supports it.`,
      ``,
      `Start building now, then summarise what you built and what I can adjust.`,
    ].join("\n");
  }
  return [
    `تصرّف بصفتك ${t.roleAr}. ابنِ لعبة تعليمية رقمية تفاعلية حقيقية قابلة للتشغيل باسم «${s.name.trim()}»، وليست فكرة أو وصفاً أو قائمة أسئلة أو عرض شرائح ثابتاً.`,
    ``,
    `## أ. الهوية التعليمية`,
    `- المادة: ${d.subject}`,
    `- الصف: ${d.grade} (أعمار المتعلمين ${ageLabel(d.grade, "ar")})`,
    `- عنوان الدرس: ${d.title.trim()}`,
    `- لغة اللعبة للمتعلمين: العربية الفصحى المبسطة المناسبة لهذا العمر`,
    `- الأهداف التعليمية الأصلية (التزم بها كما هي، ولا تضف أو تحذف أو تغيّر أي هدف):`,
    ...goals.map((g, i) => `  ${i + 1}. ${g}`),
    ...(d.content ? [`- محتوى الدرس المعتمد (لا تغيّره): ${d.content}`] : []),
    ...(d.constraints ? [`- شروط المعلمة: ${d.constraints}`] : []),
    ...(s.extra.trim() ? [`- أسئلة وتحديات من المعلمة (ضمّنها كما هي): ${s.extra.trim()}`] : []),
    ``,
    `## ب. تصميم التجربة`,
    `- نوع اللعبة: ${type.ar}. آلية اللعب الأساسية: ${type.mechanicAr} لا تحوّلها إلى اختبار تقليدي.`,
    `- طريقة اللعب: ${label(PLAY_MODES, s.mode, false)}. الزمن المقترح: نحو ${s.minutes} دقيقة.`,
    `- النمط البصري: ${label(VISUALS, s.visual, false)}.`,
    `- اكتب قصة قصيرة وإطاراً تحفيزياً للعبة يناسب أعمار ${ageLabel(d.grade, "ar")}، وصِف الشخصيات والعناصر البصرية.`,
    `- الشاشات: شاشة البداية (اسم اللعبة، الشخصية، زر ابدأ) ← شاشة التعليمات (قواعد قصيرة مصورة)${multiplayer ? " ← شاشة اختيار اللاعب أو الفريق (الأسماء والألوان)" : ""} ← ${s.levels} شاشات للمراحل ← شاشة النتائج النهائية (النقاط، المكافآت، زر العب مجدداً).`,
    ``,
    `## ج. منطق اللعبة`,
    `- ${s.levels} مراحل × ${s.challenges} تحديات = ${total} تحدياً. مستوى الصعوبة: ${label(DIFFICULTIES, s.difficulty, false)}.`,
    `- قواعد اللعب: اعرضها في شاشة التعليمات في ٣–٥ خطوات قصيرة.`,
    `- الانتقال بين المراحل: تُفتح المرحلة التالية بعد إنهاء الحالية، مع احتفال قصير بين المراحل.`,
    `- احتساب النقاط: امنح ${rewards}، ويجب أن تتغير النتيجة فعلياً بحسب إجابات اللاعب${multiplayer ? "، مع نتيجة مستقلة ظاهرة لكل لاعب أو فريق وتناوب على الأدوار" : ""}.`,
    `- الفوز والخسارة: الفوز بإنهاء جميع المراحل؛ الإجابة الخاطئة تُفقد محاولة ولا تُنهي اللعبة بقسوة، وعند نفاد المحاولات يعيد اللاعب المرحلة.`,
    `- إعادة المحاولة: زر «أعد المحاولة» في كل مرحلة وزر «العب مجدداً» في شاشة النتائج.`,
    `- التغذية الراجعة الفورية: رسالة وصوت مشجعان عند الصواب، وتلميح لطيف عند الخطأ.`,
    ``,
    `## د. المحتوى التعليمي`,
    `- أنشئ تحديات دقيقة مرتبطة بالأهداف أعلاه، واذكر رقم الهدف الذي يخدمه كل تحدٍّ، وغطِّ جميع الأهداف.`,
    `- نوّع أنواع التحديات بما يناسب آلية «${type.ar}».`,
    `- في الاختيار من متعدد قدّم ٣–٤ خيارات معقولة، واحفظ الإجابة الصحيحة داخل منطق اللعبة فقط.`,
    `- اعرض تلميحاً بعد الخطأ، ولا تُظهر الحل قبل إجابة المتعلم.`,
    `- تدرّج من المحسوس إلى المجرد متى كان ذلك مناسباً للدرس.`,
    `- ضع دليل إجابات للمعلمة منفصلاً في نهاية ردك (أو خلف زر «المعلمة»)، وليس في شاشات المتعلم.`,
    ``,
    `## هـ. التنفيذ التقني (${p.name})`,
    ...t.ar.map((x) => `- ${x}`),
    `- اجعل جميع الأزرار والعناصر قابلة للنقر والتفاعل، وبرمج الانتقالات بين الشاشات والمراحل.`,
    `- أضف مؤثرات بصرية وحركية مناسبة، وأصواتاً اختيارية مع إمكانية كتمها.`,
    `- ادعم اللغة العربية واتجاه الكتابة من اليمين إلى اليسار في كل الشاشات، واستخدم الأرقام العربية الهندية (١، ٢، ٣) في النصوص والنقاط.`,
    `- اجعل اللعبة متوافقة مع الحاسوب والأجهزة اللوحية والهواتف (أزرار لمس كبيرة).`,
    `- اختبر وظائف اللعبة وعالج الأخطاء قبل إعلان اكتمالها.`,
    `- وفّر طريقة لمعاينة اللعبة ونشرها ومشاركة رابطها إذا كان ${p.name} يدعم ذلك.`,
    ``,
    `ابدأ التنفيذ الآن، ثم لخّص ما بنيته وما يمكنني تعديله.`,
  ].join("\n");
}

export function initialGameState(d: TaskData): GameState {
  return d.game ?? { settings: suggestSettings(d), step: "settings" };
}
