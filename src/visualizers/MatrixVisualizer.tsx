/**
 * Matrix visualizer: renders a list-of-lists as a 2D grid.
 *
 * Row/column pointer overlays (e.g. `r`, `c` in a grid traversal) highlight the
 * current cell. Positions are stable: cell (r, c) always maps to the same x/y.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveBindingObject, resolveOverlays } from "./helpers";
import { gridPreview, recordedIndex, boundedSvgStyle, DiagramNotice, cellDisplay, valueNotice } from './limits';

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

  const { rows, columns: cols, summary, notice } = gridPreview(event, obj);
  const displayed = rows.map(row => row.cells.map(cell => cellDisplay(cell.value, event.objects)));

  const overlays = resolveOverlays(event, binding);
  const rowMark = overlays.find((o) => /row|^r$|\br\b/i.test(o.label))?.index;
  const colMark = overlays.find((o) => /col|^c$|\bc\b/i.test(o.label))?.index;

  const width = PAD * 2 + Math.max(1, cols) * (CELL + GAP);
  const height = TOP + Math.max(1, rows.length) * (CELL + GAP) + 12;
  const x = (c: number) => PAD + c * (CELL + GAP);
  const y = (r: number) => TOP + r * (CELL + GAP);

  return (
    <><svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      style={boundedSvgStyle(width, height)}
      aria-label={`Matrix ${binding.variable} with ${summary}`}
    >
      <text x={PAD} y={22} className="viz-title">
        {binding.variable} ({summary})
      </text>
      {rows.map((row, r) =>
        row.cells.map((cell, c) => {
          const column = recordedIndex(cell);
          const active = row.index !== undefined && column !== undefined && rowMark === row.index && colMark === column;
          const inLine = (row.index !== undefined && rowMark === row.index) || (column !== undefined && colMark === column);
          return (
            <g key={`${row.key}-${cell.key}`} data-row={row.key} data-col={cell.key} aria-label={`${binding.variable}[${row.key}][${cell.key}]`}>
              <rect
                x={x(c)}
                y={y(r)}
                width={CELL}
                height={CELL}
                rx={5}
                className={active ? "cell cell-active" : inLine ? "cell cell-line" : "cell"}
              />
              <text x={x(c) + CELL / 2} y={y(r) + CELL / 2 + 5} className="cell-value-sm">
                {displayed[r][c].text}
              </text>
            </g>
          );
        }),
      )}
    </svg><DiagramNotice text={[notice, valueNotice(displayed.flat()), rowMark !== undefined && colMark !== undefined && !rows.some(row => row.index === rowMark && row.cells.some(cell => recordedIndex(cell) === colMark)) ? `Recorded current coordinates [${rowMark}][${colMark}] have no cell in the displayed recorded data.` : ''].filter(Boolean).join(' ')}/></>
  );
}
