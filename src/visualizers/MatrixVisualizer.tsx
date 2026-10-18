/**
 * Matrix visualizer: renders a list-of-lists as a 2D grid.
 *
 * Row/column pointer overlays (e.g. `r`, `c` in a grid traversal) highlight the
 * current cell. Positions are stable: cell (r, c) always maps to the same x/y.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveBindingObject, resolveOverlays } from "./helpers";
import { gridPreview, recordedIndex, boundedSvgStyle, DiagramNotice, DiagramCaption, SvgLabel, bindingLabel, cellDisplay, valueNotice } from './limits';

const CELL = 44;
const GAP = 4;
const PAD = 48;
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
    return <p className="viz-empty">No matrix “{bindingLabel(binding)}” in scope yet.</p>;
  }

  const { rows, columns: cols, summary, notice } = gridPreview(event, obj);
  const displayed = rows.map(row => row.cells.map(cell => cellDisplay(cell.value, event.objects)));

  const overlays = resolveOverlays(event, binding);
  const rowMark = overlays.find((o) => /row|^r$|\br\b/i.test(o.label))?.index;
  const colMark = overlays.find((o) => /col|^c$|\bc\b/i.test(o.label))?.index;

  const width = Math.max(rows.length > 0 && cols === 0 ? 340 : 180, PAD * 2 + Math.max(1, cols) * (CELL + GAP));
  const height = TOP + Math.max(1, rows.length) * (CELL + GAP) + 12;
  const x = (c: number) => PAD + c * (CELL + GAP);
  const y = (r: number) => TOP + r * (CELL + GAP);

  return (
    <><DiagramCaption><code>{bindingLabel(binding)}</code> · matrix · {summary}</DiagramCaption><svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      style={boundedSvgStyle(width, height)}
      aria-label={`Matrix ${bindingLabel(binding)} with ${summary}`}
    >
      {rows.length === 0 && <text x={PAD} y={TOP + 20} className="viz-empty-svg">(empty matrix)</text>}
      {rows.length > 0 && cols === 0 && <text x={PAD} y={TOP + 20} className="viz-empty-svg">(rows contain no recorded cells)</text>}
      {Array.from({length:cols}, (_, c) => <text key={`col-${c}`} x={x(c)+CELL/2} y={TOP-14} className="cell-index grid-column-index">[{c}]</text>)}
      {rows.map((row,r)=><SvgLabel key={`row-${row.key}`} x={PAD-12} y={y(r)+CELL/2} className="cell-index grid-row-index" style={{textAnchor:'end'}} text={`[${row.key}]`} maxChars={4}/>)}
      {rows.map((row, r) =>
        row.cells.map((cell, c) => {
          const column = recordedIndex(cell);
          const active = row.index !== undefined && column !== undefined && rowMark === row.index && colMark === column;
          const inLine = (row.index !== undefined && rowMark === row.index) || (column !== undefined && colMark === column);
          return (
            <g key={`${row.key}-${cell.key}`} data-row={row.key} data-col={cell.key} aria-label={`${bindingLabel(binding)}[${row.key}][${cell.key}]`}>
              <rect
                x={x(c)}
                y={y(r)}
                width={CELL}
                height={CELL}
                rx={5}
                className={active ? "cell cell-active" : inLine ? "cell cell-line" : "cell"}
              />
              <SvgLabel x={x(c) + CELL / 2} y={y(r) + CELL / 2} className="cell-value-sm" text={displayed[r][c].text} maxChars={5}/>
            </g>
          );
        }),
      )}
    </svg><DiagramNotice text={[notice, valueNotice(displayed.flat()), rowMark !== undefined && colMark !== undefined && !rows.some(row => row.index === rowMark && row.cells.some(cell => recordedIndex(cell) === colMark)) ? `Recorded current coordinates [${rowMark}][${colMark}] have no cell in the displayed recorded data.` : ''].filter(Boolean).join(' ')}/></>
  );
}
