import type { CodeLineExplanation, TraceEvent } from '../core/types';
import { labelForLine } from './line-label';
import { mdInline } from './md';
import { recordedChanges } from './observed-line';
import { isExceptionUnwind } from './exception-unwind';
import './execution-workspace.css';

export function ExecutionPhase({ event, previous }: { event?: TraceEvent; previous?: TraceEvent }) {
  if (!event) return null;
  const frame = event.frames.at(-1)?.name;
  const fullName = frame === '<module>' ? 'Main program' : frame ?? 'Code block';
  const name = fullName.length>96 ? fullName.slice(0,96)+'…' : fullName;
  const unwinding = isExceptionUnwind(event, previous);
  const title = event.kind === 'line' ? `Before line ${event.line} executes`
    : event.kind === 'call' ? `${name} entered`
    : unwinding ? `${name}: exception unwinding`
    : event.kind === 'return' ? `${name} returning`
    : event.kind === 'exception' ? `Exception recorded at line ${event.line}`
    : `Output recorded at line ${event.line}`;
  return <div className="execution-phase" data-event-kind={event.kind}>
    <strong>{title}</strong><p>{event.kind === 'line'
      ? 'The diagram and variables show the saved state before this statement.'
      : unwinding ? 'This frame is leaving because an exception propagated. None here is not a normal returned result.'
      : 'The diagram and variables show this saved event, not the end of the run.'}</p>
  </div>;
}

export function RecordedChanges({ event, previous }: { event: TraceEvent; previous?: TraceEvent }) {
  const changes = recordedChanges(event, previous);
  return <section className="recorded-changes"><h4>Changes already recorded</h4>
    <p className="dim">Compared with the preceding saved step.</p>
    <ul>{changes.slice(0,20).map((change,index)=><li key={index}>{change}</li>)}</ul>
    {changes.length>20 && <p>{changes.length-20} more changes. Inspect the recorded variables for details.</p>}
  </section>;
}

export function AuthoredStep({event, previous, source, explanations}: {event: TraceEvent;previous?: TraceEvent;source:string;explanations: CodeLineExplanation[]}) {
  const explanation = explanations.find(item => item.line === event.line);
  return <div className="authored-step">
    <ExecutionPhase event={event} previous={previous}/>
    {explanation && <section className="statement-explanation">
      <h4>{event.kind === 'line' ? 'About the next statement' : 'About this source line'}</h4>
      {event.kind === 'line' && <p className="statement-pending">Not applied to this snapshot yet. This explanation describes the statement's effect when it runs.</p>}
      <p><span className="line-badge">line {event.line}</span>{' '}{labelForLine(source,event.line)}{' '}<span dangerouslySetInnerHTML={{__html:mdInline(explanation.explanation)}}/></p>
    </section>}
    <RecordedChanges event={event} previous={previous}/>
  </div>;
}
