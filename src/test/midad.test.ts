import { describe, expect, it } from "vitest";
import { buildPrompt, isComplete, STUDIOS, TOOLS, type TaskData } from "@/lib/midad";

const base: TaskData = { studio: "worksheets", subject: "التقنية", grade: "الصف الثالث", lang: "ar", title: "أمن المعلومات", goals: "أن يميز المتعلم كلمة المرور القوية" };

describe("midad", () => {
  it("preserves six studios and adds planning", () => expect(STUDIOS).toHaveLength(7));
  it("requires all fields", () => {
    expect(isComplete({ ...base, goals: " " })).toBe(false);
    expect(isComplete(base)).toBe(true);
  });
  it("prompt differs per studio and includes data", () => {
    const prompts = STUDIOS.map((s) => buildPrompt({ ...base, studio: s.id }));
    expect(new Set(prompts).size).toBe(7);
    prompts.forEach((p) => { expect(p).toContain("أمن المعلومات"); expect(p).toContain("كلمة المرور القوية"); expect(p).toContain("الصف الثالث"); });
  });
  it("english prompt when english chosen", () => {
    expect(buildPrompt({ ...base, lang: "en" })).toContain("Grade 3");
  });
  it("each studio has its own tools", () => STUDIOS.forEach((s) => expect(TOOLS[s.id].length).toBeGreaterThan(1)));
});
