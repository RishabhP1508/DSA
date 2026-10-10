import type { TraceEvent, VisualBinding } from '../core/types';
import { displayValue } from '../engine/replay';
import { asNumber, resolveOverlays, resolveVariable } from './helpers';

export function recordedRange(event: TraceEvent, binding: VisualBinding) {
  if (!binding.range) return undefined;
  const start=asNumber(resolveVariable(event,binding.range.startSource));
  const end=asNumber(resolveVariable(event,binding.range.endSource));
  if (start===undefined || end===undefined || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return undefined;
  return {start,end,last:binding.range.endInclusive?end:end-1};
}

/** Displays only recorded values. During a multi-line update these may be interim states. */
export function SequenceState({event,binding,length,truncated=false}:{event:TraceEvent;binding:VisualBinding;length:number;truncated?:boolean}) {
  const range=recordedRange(event,binding);
  const totals=resolveOverlays(event,binding).filter(o=>(o.role==='total' || o.role==='window') && o.value);
  if (!range && !totals.length) return null;
  const suffix=range && (range.last<range.start?' — empty range':range.start<0?' — outside sequence':range.last>=length?(truncated?' — extends beyond inspected entries; full length unknown':' — outside sequence'):'');
  return <div className="sequence-state" aria-label="Recorded sequence state">
    {range && <span className="range-state">{`${binding.range!.label}: [${range.start}, ${range.end}${binding.range!.endInclusive?'] (inclusive)':') (end excluded)'}${suffix}`}</span>}
    {totals.map((o,i)=><span key={i} className="total-state">{`${o.label}: ${displayValue(o.value!,event.objects)}`}</span>)}
  </div>;
}
