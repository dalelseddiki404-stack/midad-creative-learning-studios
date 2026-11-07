export type StudioId = "worksheets" | "presentations" | "assessment" | "games" | "video" | "design";
export type Lang = "ar" | "en";

export const STUDIOS: { id: StudioId; name: string; icon: string; desc: string }[] = [
  { id: "worksheets", name: "استوديو أوراق العمل", icon: "📝", desc: "أنشطة متدرجة وتعليمات واضحة" },
  { id: "presentations", name: "استوديو العروض التقديمية", icon: "🖥️", desc: "شرائح متسلسلة من التمهيد إلى الخلاصة" },
  { id: "assessment", name: "استوديو الاختبارات والتقويم", icon: "✅", desc: "اختبار متوازن مع دليل تصحيح" },
  { id: "games", name: "استوديو الألعاب التعليمية", icon: "🎲", desc: "مراحل وتحديات ونقاط وتحفيز" },
  { id: "video", name: "استوديو الفيديو التعليمي", icon: "🎬", desc: "سيناريو ومشاهد وتعليق صوتي" },
  { id: "design", name: "استوديو التصميم والإنفوجرافيك", icon: "🎨", desc: "تنظيم بصري جذاب للمعلومات" },
];

export const SUBJECTS = [
  "الرياضيات الممتعة", "أحب عربي", "ديني حياتي", "الهوية والمواطنة", "التقنية",
  "المطالعة", "الإنجليزية", "رياضة", "فنون تشكيلية",
] as const;
export const GRADES = ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع"] as const;
export const LANGS: { id: Lang; name: string }[] = [
  { id: "ar", name: "العربية" },
  { id: "en", name: "الإنجليزية" },
];

const SUBJECT_EN: Record<string, string> = {
  "الرياضيات الممتعة": "Fun Mathematics", "أحب عربي": "Arabic Language (I Love Arabic)",
  "ديني حياتي": "Islamic Education (My Religion, My Life)", "الهوية والمواطنة": "Identity and Citizenship",
  "التقنية": "Technology", "المطالعة": "Reading", "الإنجليزية": "English Language",
  "رياضة": "Physical Education", "فنون تشكيلية": "Visual Arts",
};
const GRADE_EN: Record<string, string> = {
  "الصف الأول": "Grade 1", "الصف الثاني": "Grade 2", "الصف الثالث": "Grade 3", "الصف الرابع": "Grade 4",
};
const AGE: Record<string, [string, string]> = {
  "الصف الأول": ["٦–٧ سنوات", "6–7 years old"], "الصف الثاني": ["٧–٨ سنوات", "7–8 years old"],
  "الصف الثالث": ["٨–٩ سنوات", "8–9 years old"], "الصف الرابع": ["٩–١٠ سنوات", "9–10 years old"],
};

// Subject-specific pedagogical hints — subjects do not share the same style of activity.
const SUBJECT_HINT: Record<string, [string, string]> = {
  "الرياضيات الممتعة": ["اعتمد على المحسوسات والصور والتمثيلات البصرية والمسائل الحياتية القصيرة، وتدرّج من المحسوس إلى المجرد.", "Use manipulatives, visual models and short real-life word problems, moving from concrete to abstract."],
  "أحب عربي": ["ركّز على مهارات الاستماع والقراءة والكتابة والتحدث، مع ضبط الكلمات بالشكل عند الحاجة وجمل قصيرة سليمة.", "Focus on listening, reading, writing and speaking skills, with diacritics where needed and short correct sentences."],
  "ديني حياتي": ["اربط المفاهيم بالسلوك اليومي والقيم، والتزم بالدقة الشرعية وتوثيق الآيات والأحاديث بدقة دون تحريف.", "Link concepts to daily behaviour and values; keep religious content accurate and quote verses/hadiths precisely."],
  "الهوية والمواطنة": ["اربط الدرس ببيئة المتعلم ومجتمعه ووطنه، وعزّز الانتماء والمسؤولية بمواقف واقعية.", "Connect the lesson to the learner's community and country, building belonging and responsibility through real situations."],
  "التقنية": ["اعتمد على خطوات عملية واضحة وسيناريوهات استخدام آمن ومسؤول للتقنية، مع صور توضيحية للواجهات أو الأجهزة.", "Use clear practical steps and safe, responsible technology-use scenarios, with illustrative visuals of devices or screens."],
  "المطالعة": ["ركّز على الفهم القرائي والاستيعاب والتذوق والتعبير عن الرأي، مع نصوص قصيرة مناسبة للعمر.", "Focus on reading comprehension, appreciation and expressing opinions, using short age-appropriate texts."],
  "الإنجليزية": ["اعتمد على المفردات المصورة والأنماط اللغوية البسيطة والتكرار الممتع والصوتيات المناسبة للمرحلة.", "Use picture vocabulary, simple language patterns, playful repetition and level-appropriate phonics."],
  "رياضة": ["اجعل الأنشطة حركية وعملية قدر الإمكان مع مراعاة السلامة والتسخين والعمل الجماعي.", "Make activities physical and hands-on where possible, with attention to safety, warm-up and teamwork."],
  "فنون تشكيلية": ["ركّز على التجريب والإبداع والألوان والخامات والتذوق الفني، وامنح المتعلم مساحة للتعبير الحر.", "Focus on experimentation, creativity, colours, materials and art appreciation, leaving room for free expression."],
};

export interface TaskData {
  studio: StudioId;
  subject: string;
  grade: string;
  lang: Lang | "";
  title: string;
  goals: string;
}

export function isComplete(d: Partial<TaskData>): d is TaskData {
  return !!(d.studio && d.subject && d.grade && d.lang && d.title?.trim() && d.goals?.trim());
}

export function studioName(id: StudioId) {
  return STUDIOS.find((s) => s.id === id)?.name ?? "";
}

function goalList(goals: string) {
  return goals.split(/\n+/).map((g) => g.replace(/^[\s\-•*\d.)٠-٩]+/, "").trim()).filter(Boolean);
}

const STUDIO_BODY: Record<StudioId, { ar: string[]; en: string[]; roleAr: string; roleEn: string; taskAr: string; taskEn: string }> = {
  worksheets: {
    roleAr: "مصممة مناهج خبيرة في إعداد أوراق العمل للمرحلة الابتدائية",
    roleEn: "an expert curriculum designer specialised in primary-school worksheets",
    taskAr: "أعدّ ورقة عمل تعليمية متكاملة جاهزة للطباعة",
    taskEn: "Create a complete, print-ready educational worksheet",
    ar: [
      "ترويسة: اسم المتعلم، التاريخ، عنوان الدرس، ومساحة لتقييم المعلمة.",
      "من ٤ إلى ٦ أنشطة متنوعة ومتدرجة (من السهل إلى الأصعب) مثل: التوصيل، التلوين، الإكمال، الاختيار، الترتيب، التصنيف، الإجابة القصيرة، نشاط إبداعي ختامي — بما يناسب طبيعة المادة.",
      "كل نشاط مرتبط بهدف محدد من الأهداف أعلاه، مع الإشارة إليه.",
      "تعليمات قصيرة وواضحة لكل نشاط بلغة يفهمها المتعلم في هذا العمر، مع رمز أو صورة توضيحية مقترحة.",
      "نشاط إثرائي اختياري للمتميزين، ودعم مبسط للمتعلمين الذين يحتاجون مساعدة.",
      "لا تضع الإجابات في ورقة المتعلم.",
      "اقترح تنسيق الصفحة: الخطوط، الألوان، أماكن الصور، ومساحات الكتابة الكافية.",
    ],
    en: [
      "Header: learner name, date, lesson title and a space for teacher feedback.",
      "4–6 varied, scaffolded activities (easy to harder) such as matching, colouring, fill-in-the-blanks, multiple choice, ordering, sorting, short answers and a final creative task — chosen to suit the subject.",
      "Link each activity explicitly to one of the objectives above.",
      "Short, clear, child-friendly instructions for each activity, with a suggested icon or illustration.",
      "An optional extension task for advanced learners and simplified support for learners who need help.",
      "Do not include answers on the learner's sheet.",
      "Suggest page layout: fonts, colours, image placement and enough writing space.",
    ],
  },
  presentations: {
    roleAr: "معلمة خبيرة في تصميم العروض التقديمية التفاعلية للأطفال",
    roleEn: "an expert teacher in designing interactive presentations for children",
    taskAr: "أعدّ عرضاً تقديمياً تعليمياً متسلسلاً",
    taskEn: "Create a sequenced educational slide presentation",
    ar: [
      "من ١٠ إلى ١٤ شريحة، ولكل شريحة: العنوان، المحتوى النصي المختصر، وصف الصورة أو العنصر البصري، وملاحظات المعلمة (ماذا تقول وماذا تفعل).",
      "التسلسل: شريحة العنوان ← الأهداف بلغة مبسطة ← تمهيد مشوّق (سؤال، صورة، قصة قصيرة) ← الشرح على مراحل ← أمثلة ← نشاط تفاعلي داخل العرض ← أسئلة تحقق من الفهم ← تلخيص ← نشاط ختامي أو تذكرة خروج.",
      "نص قليل في كل شريحة، وخط كبير، وصور كثيرة مناسبة للعمر.",
      "اقترح الحركات والانتقالات بشكل معتدل غير مشتت.",
      "ضع إجابات أسئلة التحقق في ملاحظات المعلمة فقط وليس على الشريحة.",
    ],
    en: [
      "10–14 slides; for each slide give: title, brief on-slide text, description of the image/visual, and teacher notes (what to say and do).",
      "Sequence: title slide → child-friendly objectives → engaging hook (question, picture, mini story) → step-by-step explanation → examples → in-slide interactive activity → check-for-understanding questions → summary → closing activity or exit ticket.",
      "Minimal text per slide, large fonts and plenty of age-appropriate visuals.",
      "Suggest moderate, non-distracting animations and transitions.",
      "Put answers to check questions in the teacher notes only, not on the slides.",
    ],
  },
  assessment: {
    roleAr: "خبيرة قياس وتقويم تربوي للمرحلة الابتدائية",
    roleEn: "an expert in educational measurement and assessment for primary school",
    taskAr: "ابنِ اختباراً تقويمياً متوازناً",
    taskEn: "Build a balanced assessment",
    ar: [
      "جدول مواصفات مختصر يربط كل سؤال بالهدف الذي يقيسه ومستواه (تذكر، فهم، تطبيق، تفكير أعلى).",
      "من ٨ إلى ١٢ سؤالاً بأنماط متنوعة تناسب المادة: اختيار من متعدد، صح وخطأ، توصيل، إكمال، ترتيب، إجابة قصيرة، سؤال مصور.",
      "توزيع الصعوبة تقريباً: ٤٠٪ سهل، ٤٠٪ متوسط، ٢٠٪ تحدٍّ.",
      "الناتج الأول: «نسخة المتعلم» بتعليمات واضحة ودرجة كل سؤال، ودون أي إجابات.",
      "الناتج الثاني منفصل: «دليل الإجابة والتصحيح للمعلمة» يتضمن الإجابات النموذجية، وتوزيع الدرجات، ومعايير تصحيح الأسئلة المفتوحة، وتفسير مستويات الأداء.",
      "تجنب الأسئلة الغامضة أو المركبة، واجعل اللغة مناسبة لعمر المتعلم.",
    ],
    en: [
      "A short test blueprint linking each question to the objective it measures and its level (remember, understand, apply, higher-order thinking).",
      "8–12 questions in varied formats suited to the subject: multiple choice, true/false, matching, fill-in, ordering, short answer, picture-based.",
      "Approximate difficulty mix: 40% easy, 40% medium, 20% challenge.",
      "Output 1: a 'Learner Version' with clear instructions and marks per question, with no answers.",
      "Output 2 (separate): a 'Teacher Answer Key & Marking Guide' with model answers, mark allocation, rubrics for open questions and performance-level interpretation.",
      "Avoid ambiguous or double-barrelled questions; keep the language age-appropriate.",
    ],
  },
  games: {
    roleAr: "مصممة ألعاب تعليمية خبيرة في التعلم باللعب",
    roleEn: "an expert educational game designer specialised in game-based learning",
    taskAr: "صمّم لعبة تعليمية مرتبطة بالدرس",
    taskEn: "Design an educational game linked to the lesson",
    ar: [
      "اسم جذاب للعبة وقصة أو إطار بسيط يشوّق المتعلم.",
      "قواعد اللعب بخطوات واضحة وقصيرة، وعدد اللاعبين (فردي/ثنائي/مجموعات) والزمن المقترح.",
      "٣ مراحل متدرجة الصعوبة، في كل مرحلة ٤–٦ تحديات أو أسئلة مرتبطة مباشرة بالأهداف.",
      "نظام نقاط ومكافآت (نجوم، شارات، مستويات) وتغذية راجعة فورية مشجعة عند الصواب، وتلميح لطيف عند الخطأ دون كشف الإجابة مباشرة.",
      "عناصر تحفيز: لوحة إنجاز، احتفال بنهاية كل مرحلة.",
      "قدّم محتوى الأسئلة بصيغة جاهزة للنسخ إلى أداة الألعاب (سؤال / خيارات / الإجابة الصحيحة) في قسم منفصل خاص بالمعلمة.",
      "نسخة بديلة غير رقمية يمكن تنفيذها في الصف عند الحاجة.",
    ],
    en: [
      "A catchy game name and a simple story or theme that engages learners.",
      "Clear, short game rules, number of players (solo/pairs/teams) and suggested duration.",
      "3 levels of increasing difficulty, each with 4–6 challenges or questions directly linked to the objectives.",
      "Points and rewards (stars, badges, levels), instant encouraging feedback when correct and a gentle hint when wrong without revealing the answer.",
      "Motivation elements: achievement board and a celebration at the end of each level.",
      "Provide the question content in a copy-ready format for a game tool (question / options / correct answer) in a separate teacher-only section.",
      "An alternative unplugged version that can be played in class if needed.",
    ],
  },
  video: {
    roleAr: "كاتبة سيناريو ومخرجة فيديوهات تعليمية للأطفال",
    roleEn: "a scriptwriter and director of educational videos for children",
    taskAr: "أعدّ فيديو تعليمياً قصيراً متكاملاً",
    taskEn: "Prepare a complete short educational video",
    ar: [
      "مدة مقترحة من ٢ إلى ٤ دقائق، وفكرة عامة وشخصية محببة (اختيارية) تقود الفيديو.",
      "سيناريو مقسّم إلى ٦–٩ مشاهد، ولكل مشهد: رقم المشهد، المدة، الوصف البصري التفصيلي (المكان، الشخصيات، الألوان، حركة الكاميرا)، نص التعليق الصوتي، والنص الظاهر على الشاشة.",
      "تسلسل الأحداث: افتتاحية مشوقة ← عرض المفهوم ← أمثلة ← سؤال تفاعلي يتوقف عنده المتعلم للتفكير ← تلخيص ← خاتمة محفزة.",
      "تعليق صوتي بجمل قصيرة وإيقاع هادئ ومناسب للعمر، مع اقتراح نبرة الصوت والموسيقى والمؤثرات.",
      "أوصاف بصرية مكتوبة بصيغة يمكن نسخها كأوامر لتوليد المشاهد (Prompt لكل مشهد).",
      "لا تعرض إجابة السؤال التفاعلي إلا بعد فترة توقف واضحة.",
    ],
    en: [
      "Suggested length 2–4 minutes, an overall concept and an optional friendly character guiding the video.",
      "A script split into 6–9 scenes; for each scene: scene number, duration, detailed visual description (setting, characters, colours, camera movement), voice-over text and on-screen text.",
      "Flow: engaging opening → introduce the concept → examples → an interactive pause-and-think question → summary → motivating ending.",
      "Voice-over in short sentences with a calm, age-appropriate pace; suggest voice tone, music and sound effects.",
      "Write the visual descriptions so they can be copied as scene-generation prompts (one prompt per scene).",
      "Reveal the answer to the interactive question only after a clear pause.",
    ],
  },
  design: {
    roleAr: "مصممة جرافيك تعليمية خبيرة في الإنفوجرافيك للأطفال",
    roleEn: "an educational graphic designer specialised in infographics for children",
    taskAr: "صمّم مورداً بصرياً تعليمياً (إنفوجرافيك/ملصق)",
    taskEn: "Design an educational visual resource (infographic/poster)",
    ar: [
      "حدّد نوع المورد الأنسب (إنفوجرافيك، ملصق صفي، خريطة ذهنية، بطاقات تعليمية) مع ذكر السبب.",
      "نظّم المعلومات في ٤–٧ أقسام متسلسلة منطقياً، لكل قسم: عنوان قصير، نص مختصر جداً، وأيقونة أو رسم مقترح.",
      "اقترح التسلسل البصري (من أعلى لأسفل أو مسار مرقّم) ونقطة البداية التي يجذب إليها النظر.",
      "اقترح لوحة ألوان مناسبة للعمر، وخطوطاً واضحة، وتوازناً بين النص والصورة.",
      "حدد مقاس الإخراج (A4 طباعة، A3 ملصق، أو مقاس شاشة) وطريقة استخدامه في الصف.",
      "أعطِ وصفاً كاملاً يمكن نسخه كأمر لأداة تصميم أو توليد صور.",
    ],
    en: [
      "Choose the most suitable format (infographic, classroom poster, mind map, flashcards) and explain why.",
      "Organise the information into 4–7 logically ordered sections; for each: a short heading, very brief text and a suggested icon or illustration.",
      "Propose the visual reading path (top-to-bottom or numbered path) and the focal starting point.",
      "Suggest an age-appropriate colour palette, clear fonts and a balance between text and visuals.",
      "Specify the output size (A4 print, A3 poster or screen) and how it will be used in class.",
      "Provide a full description that can be copied as a prompt for a design or image-generation tool.",
    ],
  },
};

export function buildPrompt(d: TaskData): string {
  const b = STUDIO_BODY[d.studio];
  const goals = goalList(d.goals);
  const hint = SUBJECT_HINT[d.subject] ?? ["", ""];
  const age = AGE[d.grade] ?? ["", ""];
  if (d.lang === "en") {
    return [
      `Act as ${b.roleEn}.`,
      ``,
      `${b.taskEn} with the following details:`,
      `- Subject: ${SUBJECT_EN[d.subject] ?? d.subject}`,
      `- Grade: ${GRADE_EN[d.grade] ?? d.grade} (learners aged ${age[1]})`,
      `- Resource language: English`,
      `- Lesson title: ${d.title.trim()}`,
      `- Learning objective(s) (use exactly these, do not add new ones):`,
      ...goals.map((g, i) => `  ${i + 1}. ${g}`),
      ``,
      `Requirements:`,
      ...b.en.map((x) => `- ${x}`),
      ``,
      `Subject-specific guidance: ${hint[1]}`,
      ``,
      `General rules:`,
      `- Do not invent objectives beyond those listed; you may suggest a clearer wording at the start without changing their meaning.`,
      `- Do not show answers in learner-facing materials unless I explicitly ask.`,
      `- Keep the language simple and suitable for ${GRADE_EN[d.grade]}.`,
      `- Present the output in clearly titled, editable sections so I can modify it easily.`,
      `- At the end, ask me if I want any adjustments (difficulty, length, differentiation).`,
    ].join("\n");
  }
  return [
    `تصرّف بصفتك ${b.roleAr}.`,
    ``,
    `${b.taskAr} وفق البيانات التالية:`,
    `- المادة: ${d.subject}`,
    `- الصف: ${d.grade} (أعمار المتعلمين ${age[0]})`,
    `- لغة المورد: العربية الفصحى المبسطة`,
    `- عنوان الدرس: ${d.title.trim()}`,
    `- الهدف/الأهداف التعليمية (التزم بها كما هي ولا تضف أهدافاً جديدة):`,
    ...goals.map((g, i) => `  ${i + 1}. ${g}`),
    ``,
    `المطلوب:`,
    ...b.ar.map((x) => `- ${x}`),
    ``,
    `توجيه خاص بطبيعة المادة: ${hint[0]}`,
    ``,
    `قواعد عامة:`,
    `- لا تخترع أهدافاً غير المذكورة، ويمكنك في البداية اقتراح صياغة أوضح لها دون تغيير معناها.`,
    `- لا تعرض الإجابات في المواد الموجهة للمتعلم إلا إذا طلبتُ ذلك صراحة.`,
    `- استخدم لغة بسيطة مناسبة لمتعلمي ${d.grade}.`,
    `- قدّم الناتج في أقسام معنونة وواضحة قابلة للتعديل بسهولة.`,
    `- في النهاية اسألني إن كنت أرغب في أي تعديل (مستوى الصعوبة، الطول، التمايز).`,
  ].join("\n");
}

export interface Tool { name: string; role: string; action: string; why: string; url?: string }

// Official app websites for the visit buttons and logos.
export const TOOL_URLS: Record<string, string> = {
  ChatGPT: "https://chatgpt.com", Gemini: "https://gemini.google.com", NotebookLM: "https://notebooklm.google.com",
  Canva: "https://www.canva.com", Gamma: "https://gamma.app", Lovable: "https://lovable.dev",
  Genially: "https://genially.com", Quizizz: "https://wayground.com", "Kahoot!": "https://kahoot.com",
  "Microsoft Word": "https://www.microsoft.com/microsoft-365/word", "Microsoft PowerPoint": "https://www.microsoft.com/microsoft-365/powerpoint",
  "Google Forms": "https://docs.google.com/forms", Wordwall: "https://wordwall.net", "Google Flow": "https://labs.google/flow",
  "Google Vids": "https://vids.google.com",
};

export function toolUrl(name: string) { return TOOL_URLS[name] ?? "https://www.google.com/search?q=" + encodeURIComponent(name); }
export function toolLogo(name: string) {
  const host = new URL(toolUrl(name)).hostname;
  return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
}

// Ready prompt for a specific app, tied to the teacher's subject, grade and lesson.
export function toolPrompt(t: Tool, d: TaskData): string {
  if (t.name === "ChatGPT") return buildPrompt(d);
  const lang = d.lang === "en" ? "English" : "العربية";
  const lesson = `«${d.title.trim()}» – ${d.subject} – ${d.grade}`;
  const goals = goalList(d.goals).join("؛ ");
  return [
    `استخدم ${t.name} في هذه المهمة: ${t.role}.`,
    `الدرس: ${lesson}. لغة المورد: ${lang}.`,
    `الأهداف: ${goals}.`,
    `المطلوب: ${t.action}.`,
    `اجعل الناتج مناسباً لمتعلمين في ${d.grade} بلغة بسيطة وتصميم واضح وجذاب ومن دون أخطاء.`,
  ].join("\n");
}

export const TOOLS: Record<StudioId, Tool[]> = {
  worksheets: [
    { name: "ChatGPT", role: "توليد محتوى ورقة العمل", action: "تلصقين البرومبت وتراجعين الأنشطة والتعليمات وتطلبين التعديل", why: "يكتب محتوى متدرجاً ومنظماً بسرعة ويقبل التعديل بالمحادثة" },
    { name: "Canva", role: "تصميم الورقة وإخراجها بصرياً", action: "تختارين قالب ورقة عمل وتنقلين الأنشطة وتضيفين الصور والأيقونات ثم تحمّلينها PDF", why: "يضم قوالب أوراق عمل جاهزة ومكتبة رسومات مناسبة للأطفال" },
    { name: "Microsoft Word", role: "التنسيق النهائي والطباعة", action: "تضبطين الجداول ومساحات الكتابة والخطوط العربية ثم تطبعين", why: "دقيق في التحكم بالصفحة والطباعة ويدعم العربية جيداً" },
  ],
  presentations: [
    { name: "ChatGPT", role: "إعداد محتوى الشرائح وملاحظات المعلمة", action: "تلصقين البرومبت وتحصلين على محتوى كل شريحة ووصف صورها", why: "ينظم الدرس في تسلسل منطقي من التمهيد إلى الخلاصة" },
    { name: "Microsoft PowerPoint", role: "بناء العرض وتقديمه", action: "تنشئين الشرائح، وتستخدمين المصمم (Designer) لاقتراح التنسيق، وتضيفين الحركات وملاحظات المتحدث", why: "أداة عرض متكاملة تعمل دون إنترنت وتدعم ملاحظات المتحدث" },
    { name: "Canva", role: "بديل لتصميم شرائح جذابة", action: "تختارين قالب عرض تعليمي وتنسخين المحتوى وتضيفين العناصر المرئية", why: "قوالب ملونة جاهزة مناسبة للأطفال ويمكن التقديم منه مباشرة" },
  ],
  assessment: [
    { name: "ChatGPT", role: "صياغة الأسئلة ودليل التصحيح", action: "تلصقين البرومبت وتراجعين الأسئلة وتوازن الصعوبة ونسخة المعلمة", why: "يبني أسئلة متنوعة مرتبطة بالأهداف مع إجابات نموذجية" },
    { name: "Google Forms", role: "تحويل الاختبار إلى اختبار إلكتروني", action: "تنشئين نموذجاً بوضع «اختبار»، وتضيفين الأسئلة ومفتاح الإجابة والدرجات، ثم ترسلين الرابط", why: "يصحح الأسئلة الموضوعية تلقائياً ويعرض النتائج للمعلمة" },
    { name: "Microsoft Word", role: "إعداد النسخة الورقية", action: "تنسقين نسخة المتعلم للطباعة وتحفظين دليل الإجابة في ملف منفصل", why: "مناسب للاختبارات الورقية ويحافظ على فصل نسخة المعلمة" },
  ],
  games: [
    { name: "ChatGPT", role: "تصميم فكرة اللعبة وقواعدها وأسئلتها", action: "تلصقين البرومبت وتحصلين على المراحل والتحديات والأسئلة الجاهزة", why: "يبتكر قصة اللعبة ويصوغ التحديات حسب الأهداف" },
    { name: "Wordwall", role: "تنفيذ اللعبة تفاعلياً", action: "تختارين قالباً (مطابقة، عجلة عشوائية، اختبار تلفزيوني...) وتلصقين الأسئلة وتشاركين الرابط أو تعرضينها على السبورة", why: "يحول المحتوى إلى ألعاب جاهزة بالنقاط والوقت دون برمجة" },
    { name: "Kahoot!", role: "مسابقة صفية جماعية", action: "تنشئين مسابقة بالأسئلة ويشارك المتعلمون عبر رمز اللعبة", why: "يضيف روح التنافس ولوحة متصدرين مباشرة" },
  ],
  video: [
    { name: "ChatGPT", role: "كتابة السيناريو والتعليق الصوتي", action: "تلصقين البرومبت وتحصلين على المشاهد ونصوص التعليق وأوامر المشاهد", why: "يكتب سيناريو متسلسلاً مناسباً للعمر بسرعة" },
    { name: "Google Flow", role: "توليد مقاطع المشاهد بالذكاء الاصطناعي", action: "تنسخين وصف كل مشهد كأمر لتوليد مقطع فيديو قصير ثم تجمعين المقاطع", why: "يولّد مشاهد فيديو من الوصف النصي لتجسيد الأفكار بصرياً" },
    { name: "Google Vids", role: "تجميع الفيديو وإضافة الصوت والنصوص", action: "ترتبين المشاهد وتضيفين التعليق الصوتي والنصوص والموسيقى ثم تصدّرين الفيديو", why: "محرر بسيط مرتبط بحساب Google يسهل المونتاج والمشاركة" },
    { name: "Canva", role: "بديل لتحرير الفيديو بالقوالب", action: "تستخدمين قوالب الفيديو والرسوم المتحركة وتضيفين التسجيل الصوتي", why: "قوالب جاهزة ومكتبة عناصر متحركة سهلة للمبتدئات" },
  ],
  design: [
    { name: "ChatGPT", role: "تنظيم المعلومات وصياغتها باختصار", action: "تلصقين البرومبت وتحصلين على الأقسام والنصوص المختصرة والوصف البصري", why: "يختصر المحتوى ويرتبه في تسلسل بصري واضح" },
    { name: "Canva", role: "تصميم الإنفوجرافيك وإخراجه", action: "تختارين قالب إنفوجرافيك أو ملصق، وتضيفين الأقسام والأيقونات والألوان ثم تحمّلينه للطباعة", why: "مكتبة ضخمة من قوالب الإنفوجرافيك والأيقونات وسهل الاستخدام" },
    { name: "Microsoft PowerPoint", role: "بديل للتصميم دون إنترنت", action: "تصممين الملصق على شريحة بمقاس A4 أو A3 باستخدام الأشكال وSmartArt", why: "متوفر غالباً ويتيح أشكالاً ومخططات جاهزة" },
  ],
};

export function toolsText(id: StudioId) {
  return TOOLS[id]
    .map((t, i) => `${i + 1}. ${t.name}\n- دوره: ${t.role}\n- ماذا ستفعلين: ${t.action}\n- لماذا اخترناه: ${t.why}`)
    .join("\n\n");
}

// ---------- local storage ----------
export interface SavedTask extends TaskData { id: string; savedAt: number }
export interface Draft extends Partial<TaskData> { taskId?: string }

const DRAFT_KEY = "midad-draft";
const TASKS_KEY = "midad-tasks";

export function loadDraft(): Draft {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}"); } catch { return {}; }
}
export function saveDraft(d: Draft) { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); }

export function loadTasks(): SavedTask[] {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]"); } catch { return []; }
}
export function upsertTask(d: TaskData, id?: string): SavedTask {
  const tasks = loadTasks();
  const task: SavedTask = { ...d, id: id || crypto.randomUUID(), savedAt: Date.now() };
  const i = tasks.findIndex((t) => t.id === task.id);
  if (i >= 0) tasks[i] = task; else tasks.unshift(task);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return task;
}
export function deleteTask(id: string) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(loadTasks().filter((t) => t.id !== id)));
}

export async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  }
}
