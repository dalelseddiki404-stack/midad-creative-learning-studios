import { describe, expect, it } from 'vitest';
import { GAME_PATHS, buildStagePrompt, buildPrompt, saveStageOutput, stageStale, workflowStages, type TaskData } from '@/lib/midad';

const base: TaskData = {studio:'planning',subject:'أحب عربي',grade:'الصف الثاني',lang:'ar',title:'الجملة الاسمية',goals:'- أن يميز المتعلم المبتدأ\n٢. أن يحدد الخبر',content:'الجملة الاسمية تتكون من مبتدأ وخبر',constraints:'وسائل ورقية فقط',duration:40};
describe('manual studio workflows',()=>{
  it('planning only uses NotebookLM and ChatGPT in five stages',()=>{const s=workflowStages(base);expect(s).toHaveLength(5);expect([...new Set(s.map(p=>p.app))]).toEqual(['NotebookLM','ChatGPT']);});
  it('planning keeps the teacher objectives verbatim',()=>{expect(buildPrompt(base)).toContain(base.goals);expect(buildStagePrompt(base,4)).toContain(base.goals);expect(buildPrompt(base)).not.toContain('اقتراح صياغة أوضح');});
  it('planning source analysis is optional, other stages cannot be skipped',()=>{const d=saveStageOutput(base,0,'',true);expect(d.workflow?.outputs['source']?.skipped).toBe(true);expect(()=>saveStageOutput(base,1,'',true)).toThrow();});
  it('later prompts include original content, constraints, duration and saved outputs',()=>{const d=saveStageOutput(base,1,'تهيئة: قراءة جملة من الكتاب');const p=buildStagePrompt(d,2);expect(p).toContain('تهيئة: قراءة جملة من الكتاب');expect(p).toContain(base.content);expect(p).toContain(base.constraints);expect(p).toContain('40 دقيقة');});
  it('master edits retain outputs and mark affected stages stale',()=>{const d=saveStageOutput(base,1,'سير الدرس المحفوظ');const edited={...d,title:'درس جديد'};expect(edited.workflow?.outputs['sequence']?.text).toBe('سير الدرس المحفوظ');expect(stageStale(edited,workflowStages(edited),1)).toBe(true);});
  it('previous stage edits invalidate downstream saved outputs without deleting them',()=>{let d=saveStageOutput(base,1,'سير أول');d=saveStageOutput(d,2,'أنشطة محفوظة');d=saveStageOutput(d,1,'سير معدل');expect(stageStale(d,workflowStages(d),2)).toBe(true);expect(d.workflow?.outputs['activities']?.text).toBe('أنشطة محفوظة');});
  it('each game path uses its selected real creation tool',()=>{for(const path of GAME_PATHS){expect(workflowStages({...base,studio:'games',gamePath:path.id})[2]?.app).toBe(path.app);}});
});