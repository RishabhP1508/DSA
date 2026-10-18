/**
 * Stack / Queue / Deque visualizers.
 *
 * All three read a Python list (or collections.deque) object and differ only in
 * how ends are labelled and oriented:
 *   - Stack: vertical, top = last element (append/pop at the end).
 *   - Queue: horizontal, front = first element, rear = last.
 *   - Deque: horizontal with both ends labelled (appendleft/append).
 *
 * These are conceptual models chosen by the lesson's VisualBinding, so the same
 * list is drawn the way the lesson teaches it.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveBindingObject } from "./helpers";
import { sequencePreview, sequenceCount, sequenceNotice, boundedSvgStyle, DiagramNotice, DiagramCaption, SvgLabel, bindingLabel, STACK_LIMIT, cellDisplay, valueNotice } from './limits';

const CELL = 48;
const GAP = 6;
const PAD = 16;
const TOP = 44;

function recordedObject(event: TraceEvent, binding: VisualBinding) {
  const { object: obj } = resolveBindingObject(event, binding);
  return obj;
}

export function StackVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const object = recordedObject(event, binding);
  if (!object?.entries) return <p className="viz-empty">No stack “{bindingLabel(binding)}” yet.</p>;
  // A complete snapshot has a known top, so display its tail. An inspected
  // prefix does not establish the true top; never label its tail as that top.
  const entries = sequencePreview(object, STACK_LIMIT, true);

  const n = entries.length;
  const height = TOP + Math.max(1, n) * (CELL + GAP) + 12;
  const width = 220;
  // Top of stack (last element) drawn at the top.
  const rows = [...entries].reverse();
  const displayed = rows.map(row => cellDisplay(row.value, event.objects));

  return (
    <><DiagramCaption><code>{bindingLabel(binding)}</code> · stack · {sequenceCount(object)}</DiagramCaption><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Stack ${bindingLabel(binding)}, ${sequenceCount(object)}${object.truncated ? ', top unknown' : ', top at top'}`}>
      {n === 0 && <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">(empty)</text>}
      {rows.map((e, i) => {
        const isTop = !object.truncated && e === object.entries!.at(-1);
        const y = TOP + i * (CELL + GAP);
        return (
          <g key={e.key} data-index={e.key}>
            <rect x={PAD + 40} y={y} width={CELL * 2} height={CELL} rx={6} className={isTop ? "cell cell-active" : "cell"} />
            <SvgLabel x={PAD + 40 + CELL} y={y + CELL / 2} className="cell-value" text={displayed[i].text} maxChars={10}/>
            <text x={PAD + 40 + CELL * 2 + 20} y={y + CELL / 2 + 5} className="cell-index">{e.key}</text>
            {isTop && <text x={PAD} y={y + CELL / 2 + 5} className="pointer-label">top→</text>}
          </g>
        );
      })}
    </svg><DiagramNotice text={[sequenceNotice(object, entries, object.truncated ? 'Top' : undefined), valueNotice(displayed)].filter(Boolean).join(' ')}/></>
  );
}

function HorizontalEnds({
  event,
  binding,
  kind,
}: {
  event: TraceEvent;
  binding: VisualBinding;
  kind: "queue" | "deque";
}) {
  const object = recordedObject(event, binding);
  if (!object?.entries) return <p className="viz-empty">No {kind} “{bindingLabel(binding)}” yet.</p>;
  const entries = sequencePreview(object);
  const displayed = entries.map(entry => cellDisplay(entry.value, event.objects));
  const n = entries.length;
  const width = Math.max(180, PAD * 2 + Math.max(1, n) * (CELL + GAP));
  const height = TOP + CELL + 52;
  const x = (i: number) => PAD + i * (CELL + GAP);
  const frontLabel = kind === "queue" ? "front" : "left";
  const rearLabel = kind === "queue" ? "rear" : "right";

  return (
    <><DiagramCaption><code>{bindingLabel(binding)}</code> · {kind} · {sequenceCount(object)}</DiagramCaption><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${kind} ${bindingLabel(binding)}, ${sequenceCount(object)}`}>
      {n === 0 && <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">(empty)</text>}
      {entries.map((e, i) => {
        const isFront = i === 0;
        const isRear = !object.truncated && e === object.entries!.at(-1);
        return (
          <g key={e.key} data-index={e.key}>
            <rect x={x(i)} y={TOP} width={CELL} height={CELL} rx={6} className={isFront || isRear ? "cell cell-active" : "cell"} />
            <SvgLabel x={x(i) + CELL / 2} y={TOP + CELL / 2} className="cell-value" text={displayed[i].text} maxChars={5}/>
            {isFront && <text x={x(i) + CELL / 2} y={TOP - 10} className="pointer-label">{frontLabel}↓</text>}
            {isRear && <text x={x(i) + CELL / 2} y={TOP + CELL + 20} className="pointer-label">↑{rearLabel}</text>}
            <text x={x(i) + CELL / 2} y={TOP + CELL + 36} className="cell-index">{e.key}</text>
          </g>
        );
      })}
    </svg><DiagramNotice text={[sequenceNotice(object, entries, kind === 'queue' ? 'Rear' : 'Right endpoint'), valueNotice(displayed)].filter(Boolean).join(' ')}/></>
  );
}

export function QueueVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  return <HorizontalEnds event={event} binding={binding} kind="queue" />;
}

export function DequeVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  return <HorizontalEnds event={event} binding={binding} kind="deque" />;
}
