/**
 * Generic object / reference visualizer (fallback).
 *
 * When a value has no specific conceptual model, it is shown as a titled box of
 * fields (for objects/containers) or an inline value. This is the "generic
 * object/reference view" the plan requires so unrecognized values remain
 * inspectable rather than hidden.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import { resolveBindingObject } from "./helpers";

const PAD = 16;
const ROW_H = 26;
const TOP = 40;

export function ObjectVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { value, object: obj } = resolveBindingObject(event, binding);

  if (!value) {
    return <p className="viz-empty">“{binding.variable}” is not in scope yet.</p>;
  }

  // Inline (primitive) value.
  if (value.kind !== "ref") {
    return (
      <svg className="array-viz" viewBox={`0 0 260 80`} role="img" aria-label={`${binding.variable} value`}>
        <text x={PAD} y={22} className="viz-title">{binding.variable}</text>
        <rect x={PAD} y={TOP} width={228} height={34} rx={6} className="cell" />
        <text x={PAD + 12} y={TOP + 22} className="cell-value">{displayValue(value, event.objects)}</text>
      </svg>
    );
  }

  if (!obj) return <p className="viz-empty">Reference to a value not captured in this step.</p>;

  const entries = obj.entries ?? [];
  const width = 300;
  const height = TOP + Math.max(1, entries.length) * ROW_H + 14;

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${binding.variable} (${obj.type})`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} ({obj.type})</text>
      {obj.repr && entries.length === 0 && (
        <text x={PAD} y={TOP + 18} className="cell-value-sm">{obj.repr}</text>
      )}
      {entries.map((e, i) => {
        const y = TOP + i * ROW_H;
        return (
          <g key={e.key}>
            <text x={PAD} y={y + 16} className="var-name-svg">{e.key}</text>
            <text x={PAD + 120} y={y + 16} className="cell-value-sm" textAnchor="start">
              {displayValue(e.value, event.objects)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
