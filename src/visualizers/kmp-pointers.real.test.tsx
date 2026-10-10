// @vitest-environment node
import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { lessons } from '../content/registry';
import { StringVisualizer } from './StringVisualizer';
import type { TraceEvent } from '../core/types';
// @ts-expect-error Shared JavaScript runtime harness.
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';
it('KMP pattern fallback is drawn on the pattern rather than the text', async()=>{
  const lesson=lessons.find(x=>x.id==='kmp')!;
  const result=await runProgram(lesson.code);
  expect(result.status).toBe('completed');
  let observed=0;
  for(const event of result.events as TraceEvent[]) {
    if(!event.frames.some(f=>f.name==='kmp_search' && f.locals.some(v=>v.name==='j')))continue;
    const text=renderToStaticMarkup(<StringVisualizer event={event} binding={lesson.bindings.find(b=>b.variable==='text')!}/>);
    const pattern=renderToStaticMarkup(<StringVisualizer event={event} binding={lesson.bindings.find(b=>b.variable==='pattern')!}/>);
    expect(text).not.toContain('j (pattern)↓');
    if(pattern.includes('j (pattern)↓'))observed++;
  }
  expect(observed).toBeGreaterThan(5);
},120_000);
