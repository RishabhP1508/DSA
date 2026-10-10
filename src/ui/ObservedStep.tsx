import { useMemo, useState } from 'react';
import type { TraceEvent } from '../core/types';
import { recordedChanges, syntaxExplanation } from './observed-line';
export function ObservedStep({source,event,previous}:{source:string;event?:TraceEvent;previous?:TraceEvent}){
 const [selected,setSelected]=useState<number|null>(null);const line=selected??event?.line??1;
 const explanation=useMemo(()=>syntaxExplanation(source,line),[source,line]);
 return <section className="explanation-box observed-step"><h4>Syntax & observed changes</h4><label className="source-line-select">Inspect source line <input type="number" aria-label="Source line to explain" min="1" max={source.split('\n').length} value={line} onChange={e=>setSelected(Math.max(1,Math.min(source.split('\n').length,Number(e.target.value)||1)))}/>{selected!==null&&<button className="link-like" onClick={()=>setSelected(null)}>Follow execution</button>}</label><p><span className="line-badge">line {line}</span> {explanation}</p>{event&&<><p className="dim tiny">{event.kind==='line'?'This snapshot is before the highlighted line executes. Changes below happened since the preceding snapshot.':`Recorded ${event.kind} event. No expressions are evaluated again.`}</p><ul>{recordedChanges(event,previous).map((change,i)=><li key={i}>{change}</li>)}</ul></>}</section>;
}
