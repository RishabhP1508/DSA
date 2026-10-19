import { useMemo, useState } from 'react';
import type { TraceEvent } from '../core/types';
import { syntaxExplanation } from './observed-line';
import { ExecutionPhase, RecordedChanges } from './ExecutionState';
export function ObservedStep({source,event,previous}:{source:string;event?:TraceEvent;previous?:TraceEvent}){
 const [selected,setSelected]=useState<number|null>(null);const line=Math.max(1,Math.min(source.split('\n').length,selected??event?.line??1));
 const explanation=useMemo(()=>syntaxExplanation(source,line),[source,line]);
 return <section className="explanation-box observed-step"><h4>Syntax & observed changes</h4><ExecutionPhase event={event} previous={previous}/><label className="source-line-select">Inspect source line <input type="number" aria-label="Source line to explain" min="1" max={source.split('\n').length} value={line} onChange={e=>setSelected(Math.max(1,Math.min(source.split('\n').length,Number(e.target.value)||1)))}/>{selected!==null&&<button className="link-like" onClick={()=>setSelected(null)}>Follow execution</button>}</label><p><span className="line-badge">line {line}</span> {explanation}</p>{event&&<RecordedChanges event={event} previous={previous}/>}</section>;
}
