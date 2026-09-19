/**
 * Array / list visualizer.
 *
 * Renders a list value as a row of cells with stable positions (index =
 * x-position), index labels, and pointer/boundary/highlight overlays driven by
 * other variables in the frame (e.g. two-pointer `lo`/`hi`, sliding window).
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import {
  resolveBindingObject,
  resolveOverlays,
  indexOverlays,
  overlayColor,
} from "./helpers";

const CELL = 52;
const GAP = 8;
const PAD = 16;
const TOP = 48;

export function ArrayVisualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) {
    return <p className="viz-empty">No array “{binding.variable}” in scope yet.</p>;
  }

  const cells = obj.entries;
  const width = PAD * 2 + Math.max(1, cells.length) * CELL + Math.max(0, cells.length - 1) * GAP;
  const height = TOP + CELL + 64;

  const overlays = resolveOverlays(event, binding);
  const marks = indexOverlays(overlays, cells.length);

  // Sliding-window overlays: a "window" overlay whose label encodes lo..hi could
  // be added later; for now window ranges are shown via two boundary overlays.
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

      {cells.length === 0 && (
        <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">
          (empty)
        </text>
      )}

      {cells.map((cell, i) => {
        const mark = marks.find((m) => m.index === i);
        return (
          <g key={i}>
            <rect
              x={cellX(i)}
              y={TOP}
              width={CELL}
              height={CELL}
              rx={6}
              className={mark ? "cell cell-active" : "cell"}
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

      {marks.map((m, k) => (
        <text
          key={`ptr-${k}`}
          x={cellX(m.index!) + CELL / 2}
          y={TOP - 14 - (k % 2) * 16}
          className="pointer-label"
          fill={overlayColor(k)}
        >
          {m.label}↓
        </text>
      ))}
    </svg>
  );
}
