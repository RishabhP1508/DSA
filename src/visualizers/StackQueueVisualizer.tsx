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
import { displayValue } from "../engine/replay";
import { resolveBindingObject } from "./helpers";

const CELL = 48;
const GAP = 6;
const PAD = 16;
const TOP = 44;

function useEntries(event: TraceEvent, binding: VisualBinding) {
  const { object: obj } = resolveBindingObject(event, binding);
  return obj?.entries ?? null;
}

export function StackVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const entries = useEntries(event, binding);
  if (!entries) return <p className="viz-empty">No stack “{binding.variable}” yet.</p>;

  const n = entries.length;
  const height = TOP + Math.max(1, n) * (CELL + GAP) + 12;
  const width = 220;
  // Top of stack (last element) drawn at the top.
  const rows = [...entries].reverse();

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Stack ${binding.variable}, ${n} items, top at top`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (stack, {n})</text>
      {n === 0 && <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">(empty)</text>}
      {rows.map((e, i) => {
        const isTop = i === 0;
        const y = TOP + i * (CELL + GAP);
        return (
          <g key={i}>
            <rect x={PAD + 40} y={y} width={CELL * 2} height={CELL} rx={6} className={isTop ? "cell cell-active" : "cell"} />
            <text x={PAD + 40 + CELL} y={y + CELL / 2 + 5} className="cell-value">{displayValue(e.value, event.objects)}</text>
            {isTop && <text x={PAD} y={y + CELL / 2 + 5} className="pointer-label">top→</text>}
          </g>
        );
      })}
    </svg>
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
  const entries = useEntries(event, binding);
  if (!entries) return <p className="viz-empty">No {kind} “{binding.variable}” yet.</p>;
  const n = entries.length;
  const width = PAD * 2 + Math.max(1, n) * (CELL + GAP);
  const height = TOP + CELL + 40;
  const x = (i: number) => PAD + i * (CELL + GAP);
  const frontLabel = kind === "queue" ? "front" : "left";
  const rearLabel = kind === "queue" ? "rear" : "right";

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${kind} ${binding.variable}, ${n} items`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} ({kind}, {n})</text>
      {n === 0 && <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">(empty)</text>}
      {entries.map((e, i) => {
        const isFront = i === 0;
        const isRear = i === n - 1;
        return (
          <g key={i}>
            <rect x={x(i)} y={TOP} width={CELL} height={CELL} rx={6} className={isFront || isRear ? "cell cell-active" : "cell"} />
            <text x={x(i) + CELL / 2} y={TOP + CELL / 2 + 5} className="cell-value">{displayValue(e.value, event.objects)}</text>
            {isFront && <text x={x(i) + CELL / 2} y={TOP - 10} className="pointer-label">{frontLabel}↓</text>}
            {isRear && n > 1 && <text x={x(i) + CELL / 2} y={TOP + CELL + 20} className="pointer-label">↑{rearLabel}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function QueueVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  return <HorizontalEnds event={event} binding={binding} kind="queue" />;
}

export function DequeVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  return <HorizontalEnds event={event} binding={binding} kind="deque" />;
}
