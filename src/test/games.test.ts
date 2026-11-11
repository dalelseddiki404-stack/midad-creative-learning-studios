import { describe, expect, it } from 'vitest';
import { GAME_PLATFORMS, buildGamePrompt, recommendPlatform, suggestSettings, type GameSettings } from '@/lib/games';
import { STUDIOS, type TaskData } from '@/lib/midad';

const lesson: TaskData = { studio: 'games', subject: 'الرياضيات الممتعة', grade: 'الصف الثالث', lang: 'ar', title: 'الجمع مع إعادة التجميع', goals: 'أن يجمع المتعلم عددين من رقمين\nأن يحل مسألة حياتية بالجمع' };
const base: GameSettings = { ...suggestSettings(lesson) };

describe('interactive games studio', () => {
  it('is renamed to الألعاب التفاعلية with a gamepad icon', () => {
    const g = STUDIOS.find((s) => s.id === 'games');
    expect(g?.name).toBe('استوديو الألعاب التفاعلية');
    expect(g?.icon).toBe('🎮');
  });
  it('offers exactly the six requested platforms', () => {
    expect(GAME_PLATFORMS.map((p) => p.name)).toEqual(['Gemini Canvas', 'Gemini مع Canva', 'Lovable', 'Canva Code', 'Genially', 'Make It']);
  });
  it('builds a different executive prompt for every platform', () => {
    const prompts = GAME_PLATFORMS.map((p) => buildGamePrompt(lesson, base, p.id));
    expect(new Set(prompts).size).toBe(6);
  });
  it('keeps every original objective in the prompt', () => {
    const p = buildGamePrompt(lesson, base, 'lovable');
    expect(p).toContain('أن يجمع المتعلم عددين من رقمين');
    expect(p).toContain('أن يحل مسألة حياتية بالجمع');
    expect(p).toContain('الجمع مع إعادة التجميع');
  });
  it('asks Arabic games for RTL and Arabic-Indic numerals', () => {
    const p = buildGamePrompt(lesson, base, 'gemini-canvas');
    expect(p).toContain('من اليمين إلى اليسار');
    expect(p).toContain('الأرقام العربية الهندية');
  });
  it('writes the prompt in English when the resource language is English', () => {
    expect(buildGamePrompt({ ...lesson, lang: 'en' }, base, 'lovable')).toContain('Grade 3');
  });
  it('recommends Lovable for a long multi-level adventure', () => {
    const r = recommendPlatform(lesson, { ...base, type: 'adventure', levels: 6, challenges: 6, mode: 'groups' });
    expect(r.best.id).toBe('lovable');
    expect(r.alt.id).not.toBe('lovable');
  });
  it('recommends Make It for a short first-grade memory game', () => {
    const r = recommendPlatform({ grade: 'الصف الأول' }, { ...base, type: 'memory', levels: 2, challenges: 3, mode: 'solo', difficulty: 'easy', rewards: ['stars'] });
    expect(r.best.id).toBe('makeit');
  });
});
