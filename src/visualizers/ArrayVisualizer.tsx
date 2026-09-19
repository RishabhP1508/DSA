/**
 * Array / list visualizer.
 *
 * Renders a list value from a trace object table as a row of cells, with stable
 * cell positions between steps (index = x-position), labels, and optional
 * pointer/window/boundary overlays driven by other variables in the frame.
 *
 * This is the Phase-1 proof that the trace -> visual pipeline works end to end;
 * later phases add the remaining structure families using the same contract.
 */

import type { TraceEvent, TraceObject, TraceValue, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";

const CELL = 52;
const GAP = 8;
const PAD = 16;
const TOP = 44;

function resolveVariable(event: TraceEvent, name: string): TraceValue | undefined {
  // innermost frame first
  for (let i = event.frames.length - 1; i >= 0; i--) {
    const found = event.frames[i].locals.find((l) => l.name === name);
    if (found) return found.value;
  }
  return undefined;
}

function asNumber(v: TraceValue | undefined): number | undefined {
  if (!v) return undefined;
  if (v.kind === "int" && typeof v.value === "number") return v.value;
  if (v.kind === "float") return v.value;
  return undefined;
}

export function ArrayVisualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  const value = resolveVariable(event, binding.variable);
  if (!value || value.kind !== "ref") {
    return <p className="viz-empty">No array named “{binding.variable}” in scope yet.</p>;
  }
  const obj: TraceObject | undefined = event.objects[value.id];
  if (!obj || !obj.entries) {
    return <p className="viz-empty">“{binding.variable}” is not a list here.</p>;
  }

  const cells = obj.entries;
  const width = PAD * 2 + cells.length * CELL + Math.max(0, cells.length - 1) * GAP;
  const height = TOP + CELL + 60;

  // Resolve overlay indices.
  const pointers = (binding.overlays ?? [])
    .filter((o) => o.role === "pointer" || o.role === "boundary" || o.role === "highlight")
    .map((o) => ({ ...o, idx: asNumber(resolveVariable(event, o.source)) }))
    .filter((o) => o.idx !== undefined && o.idx >= 0 && o.idx < cells.length);

  const cellX = (i: number) => PAD + i * (CELL + GAP);

  return (
    <svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Array ${binding.variable} with ${cells.length} elements`}
    >
      <text x={PAD} y={22} className="viz-title">
        {binding.variable} ({obj.type}, len {cells.length})
      </text>

      {cells.map((cell, i) => {
        const highlighted = pointers.some((p) => p.idx === i);
        return (
          <g key={i}>
            <rect
              x={cellX(i)}
              y={TOP}
              width={CELL}
              height={CELL}
              rx={6}
              className={highlighted ? "cell cell-active" : "cell"}
            />
            <text x={cellX(i) + CELL / 2} y={TOP + CELL / 2 + 5} className="cell-value">
              {displayValue(cell.value, event.objects)}
            </text>
            <text x={cellX(i) + CELL / 2} y={TOP + CELL + 18} className="cell-index">
              {i}
            </text>
          </g>
        );
      })}

      {pointers.map((p, k) => (
        <g key={`ptr-${k}`}>
          <text
            x={cellX(p.idx!) + CELL / 2}
            y={TOP - 16 - (k % 2) * 16}
            className="pointer-label"
          >
            {p.label}↓
          </text>
        </g>
      ))}
    </svg>
  );
}
