import { useState } from 'react';
import { Check, Copy, ExternalLink, Save, ArrowLeft, ArrowRight, Printer, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { GAME_PATHS, TOOLS, buildStagePrompt, copyText, saveStageOutput, stageStale, toolLogo, toolUrl, workflowExport, workflowStages, type TaskData } from '@/lib/midad';

export function Workflow({ task, onChange }: { task: TaskData; onChange: (task: TaskData) => void }) {
  const stages = workflowStages(task);
  const current = Math.min(task.workflow?.current ?? 0, stages.length - 1);
  const s = stages[current];
  const saved = task.workflow?.outputs[s.id];
  const text = task.workflow?.drafts?.[s.id] ?? saved?.text ?? '';
  const [previousOpen, setPreviousOpen] = useState(false);
  const stale = stages.filter((_,i) => stageStale(task,stages,i));
  const completed = stages.filter((p,i) => task.workflow?.outputs[p.id] && !stageStale(task,stages,i)).length;
  const tool = TOOLS[task.studio].find(t=>t.name===s.app);
  const change = (index: number) => { setPreviousOpen(false); onChange({ ...task, workflow: { ...task.workflow, outputs: task.workflow?.outputs ?? {}, current:index } }); };
  const save = (skip = false) => {
    try {
      const next = saveStageOutput(task,current,skip ? '' : text,skip);
      if (next.workflow?.drafts) { next.workflow = { ...next.workflow, drafts: { ...next.workflow.drafts, [s.id]: skip ? '' : text } }; }
      onChange(next); toast.success(skip ? 'تم تجاوز التحليل الاختياري' : 'تم حفظ مخرجات المرحلة');
      if (skip && current < stages.length-1) onChange({ ...next, workflow: { ...next.workflow, outputs: next.workflow?.outputs ?? {}, current:current+1 } });
    } catch (e) { toast.error(e instanceof Error ? e.message : 'تعذر الحفظ'); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob(['\ufeff',workflowExport(task)],{type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href=url; link.download=`مِداد-${task.title.replace(/[\\/:*?"<>|]/g,'-')}.txt`; link.click(); URL.revokeObjectURL(url);
  };
  return <section className="mb-10 border-t border-border pt-8" aria-label="مسار إنتاج المورد">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl font-extrabold">مسار إنتاج المورد</h2><span className="text-sm font-bold text-muted-foreground">{completed} من {stages.length} مراحل منجزة</span></div>
    {task.studio==='games' && <fieldset className="mb-6"><legend className="mb-3 font-bold">اختاري مسار اللعبة</legend><div className="grid gap-3 sm:grid-cols-2">{GAME_PATHS.map(p=><label key={p.id} className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${p.id===(task.gamePath??'lovable') ? 'border-primary bg-secondary' : 'border-border bg-card'}`}><input type="radio" name="game-path" value={p.id} checked={p.id===(task.gamePath??'lovable')} onChange={()=>onChange({...task,gamePath:p.id})} /><span><b className="block">{p.name} · {p.app}</b><span className="text-sm text-muted-foreground">{p.why}</span></span></label>)}</div></fieldset>}
    <progress value={completed} max={stages.length} className="workflow-progress mb-5 h-2 w-full" aria-label="تقدم مسار المورد" />
    {stale.length>0 && <div role="alert" className="mb-5 rounded-lg bg-gold p-4 text-gold-foreground"><b>تغيّرت بيانات الدرس أو مخرجات مرحلة سابقة.</b><p>أعمالك محفوظة. تحتاج هذه المراحل إلى مراجعة وإعادة توليد: {stale.map(p=>p.name).join('، ')}.</p></div>}
    <div className="grid gap-6 md:grid-cols-[190px_1fr]">
      <nav aria-label="مراحل المورد" className="flex gap-2 overflow-x-auto md:flex-col">{stages.map((p,i)=><Button key={p.id} variant={current===i ? 'secondary' : 'ghost'} onClick={()=>change(i)} className="h-auto min-w-40 justify-start whitespace-normal p-3 text-right"><span className="shrink-0">{task.workflow?.outputs[p.id] && !stageStale(task,stages,i) ? <Check size={16}/> : i+1}</span><span>{p.name}{p.optional && <small className="block text-muted-foreground">اختيارية</small>}</span></Button>)}</nav>
      <div className="min-w-0">
        <div className="mb-4 flex items-center gap-3"><img src={toolLogo(s.app)} alt={`شعار ${s.app}`} width={40} height={40} className="h-10 w-10 object-contain"/><div><p className="text-sm text-muted-foreground">المرحلة {current+1} · {s.app}</p><h3 className="font-display text-xl font-bold">{s.name}</h3></div></div>
        <dl className="mb-4 space-y-3 text-sm leading-relaxed"><div><dt className="font-bold">الهدف</dt><dd>{s.goal}</dd></div><div><dt className="font-bold">لماذا هذا التطبيق؟</dt><dd>{tool?.why ?? s.goal}</dd></div><div><dt className="font-bold">دور التطبيق</dt><dd>{tool?.role ?? s.name}</dd></div><div><dt className="font-bold">المهمة</dt><dd>{s.action}</dd></div><div><dt className="font-bold">المخرج المتوقع</dt><dd>{s.expected}</dd></div></dl>
        <p className="mb-3 text-xs text-muted-foreground">العمل بين مِداد والتطبيق يتم بالنسخ واللصق يدوياً؛ وقد تختلف ميزات التوليد والتصدير حسب الحساب.</p>
        <div className="mb-4 flex flex-wrap gap-2"><Button onClick={async()=>toast[(await copyText(buildStagePrompt(task,current)))?'success':'error']('نسخ أمر هذه المرحلة')}><Copy/>نسخ أمر هذه المرحلة</Button><Button asChild variant="outline"><a href={toolUrl(s.app)} target="_blank" rel="noopener noreferrer"><ExternalLink/>فتح التطبيق</a></Button>{current>0 && <Button variant="secondary" onClick={()=>setPreviousOpen(!previousOpen)}>عرض مخرجات المرحلة السابقة</Button>}</div>
        <a href={toolUrl(s.app)} target="_blank" rel="noopener noreferrer" dir="ltr" className="mb-4 block break-all text-sm underline">{toolUrl(s.app)}</a>
        <details className="mb-4"><summary className="cursor-pointer text-sm font-bold">الأمر المتخصص</summary><pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 font-sans text-sm leading-relaxed">{buildStagePrompt(task,current)}</pre></details>
        {previousOpen && <div className="mb-4 whitespace-pre-wrap rounded-lg bg-secondary p-4 text-sm">{stages.slice(0,current).map(p=>`${p.name}:\n${task.workflow?.outputs[p.id]?.skipped ? 'تم تجاوز المرحلة الاختيارية' : task.workflow?.outputs[p.id]?.text || 'لم تُحفظ مخرجات بعد'}`).join('\n\n')}</div>}
        <label className="block font-bold" htmlFor="stage-output">مخرجات هذه المرحلة</label><textarea id="stage-output" value={text} rows={8} placeholder="ألصقي النص أو رابط المورد الناتج هنا" onChange={e=>onChange({...task,workflow:{...task.workflow,current,outputs:task.workflow?.outputs??{},drafts:{...task.workflow?.drafts,[s.id]:e.target.value}}})} className="mt-2 w-full resize-y rounded-lg border border-input bg-card p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"/>
        <p className="my-3 text-sm text-muted-foreground">{current<stages.length-1 ? s.next : 'النسخة النهائية جاهزة للحفظ والطباعة والتنزيل بعد مراجعتك.'}</p>
        <div className="flex flex-wrap gap-2"><Button onClick={()=>save()} disabled={!text.trim()}><Save/>حفظ مخرجات المرحلة</Button>{s.optional && <Button variant="outline" onClick={()=>save(true)}>تجاوز تحليل المصدر</Button>}<Button variant="outline" disabled={current===0} onClick={()=>change(current-1)}><ArrowRight/>المرحلة السابقة</Button><Button variant="secondary" disabled={current===stages.length-1 || !saved || (!saved.skipped && (stageStale(task,stages,current) || saved.text!==text))} onClick={()=>change(current+1)}>المرحلة التالية<ArrowLeft/></Button></div>
        {current===stages.length-1 && <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4"><Button variant="outline" onClick={()=>window.print()}><Printer/>طباعة التحضير أو المورد</Button><Button variant="outline" onClick={download}><Download/>تنزيل العمل</Button><Button onClick={()=>save()} disabled={!text.trim()}><Save/>حفظ النسخة النهائية</Button></div>}
      </div>
    </div>
    <article className="print-workflow hidden whitespace-pre-wrap">{workflowExport(task)}</article>
  </section>;
}