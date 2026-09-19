/**
 * Matrix visualizer: renders a list-of-lists as a 2D grid.
 *
 * Row/column pointer overlays (e.g. `r`, `c` in a grid traversal) highlight the
 * current cell. Positions are stable: cell (r, c) always maps to the same x/y.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import { resolveBindingObject, deref, resolveOverlays } from "./helpers";

const CELL = 44;
const GAP = 4;
const PAD = 16;
const TOP = 44;

export function MatrixVisualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) {
    return <p className="viz-empty">No matrix “{binding.variable}” in scope yet.</p>;
  }

  // Each entry is a row (itself a list ref).
  const rows = obj.entries.map((rowEntry) => {
    const rowObj = deref(event, rowEntry.value);
    return rowObj?.entries ?? [];
  });
  const cols = rows.reduce((m, r) => Math.max(m, r.length), 0);

  const overlays = resolveOverlays(event, binding);
  const rowMark = overlays.find((o) => /row|^r$|\br\b/i.test(o.label))?.index;
  const colMark = overlays.find((o) => /col|^c$|\bc\b/i.test(o.label))?.index;

  const width = PAD * 2 + Math.max(1, cols) * (CELL + GAP);
  const height = TOP + Math.max(1, rows.length) * (CELL + GAP) + 12;
  const x = (c: number) => PAD + c * (CELL + GAP);
  const y = (r: number) => TOP + r * (CELL + GAP);

  return (
    <svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Matrix ${binding.variable} with ${rows.length} rows and ${cols} columns`}
    >
      <text x={PAD} y={22} className="viz-title">
        {binding.variable} ({rows.length}×{cols})
      </text>
      {rows.map((row, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const cell = row[c];
          const active = rowMark === r && colMark === c;
          const inLine = rowMark === r || colMark === c;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x(c)}
                y={y(r)}
                width={CELL}
                height={CELL}
                rx={5}
                className={active ? "cell cell-active" : inLine ? "cell cell-line" : "cell"}
              />
              {cell && (
                <text x={x(c) + CELL / 2} y={y(r) + CELL / 2 + 5} className="cell-value-sm">
                  {displayValue(cell.value, event.objects)}
                </text>
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}
