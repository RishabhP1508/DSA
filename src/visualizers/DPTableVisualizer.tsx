/**
 * DP table visualizer.
 *
 * Renders a 1D or 2D dynamic-programming table (a list, or a list of lists) as a
 * grid. A `current` pointer overlay (or `i`/`j` overlays) highlights the cell
 * being filled; already-filled cells are shaded so the fill order is visible.
 *
 * "Filled" is inferred as cells that are not the table's initial sentinel; since
 * we cannot know the sentinel generically, we treat any non-None cell as filled
 * and highlight the current index from overlays.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import { resolveBindingObject, deref, resolveOverlays } from "./helpers";

const CELL = 46;
const GAP = 3;
const PAD = 16;
const TOP = 44;

export function DPTableVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) return <p className="viz-empty">No DP table “{binding.variable}” yet.</p>;

  const is2D = obj.entries.length > 0 && obj.entries[0].value.kind === "ref" && deref(event, obj.entries[0].value)?.entries !== undefined;

  const overlays = resolveOverlays(event, binding);
  const iMark = overlays.find((o) => /^i$|row|\bi\b/i.test(o.label))?.index;
  const jMark = overlays.find((o) => /^j$|col|\bj\b/i.test(o.label))?.index;

  if (!is2D) {
    const cells = obj.entries;
    const width = PAD * 2 + Math.max(1, cells.length) * (CELL + GAP);
    const height = TOP + CELL + 26;
    const x = (i: number) => PAD + i * (CELL + GAP);
    return (
      <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`DP table ${binding.variable}, ${cells.length} cells`}>
        <text x={PAD} y={22} className="viz-title">{binding.variable} (dp[{cells.length}])</text>
        {cells.map((c, i) => {
          const filled = c.value.kind !== "none";
          const active = iMark === i;
          return (
            <g key={i}>
              <rect x={x(i)} y={TOP} width={CELL} height={CELL} rx={5} className={active ? "cell cell-active" : filled ? "cell cell-filled" : "cell"} />
              <text x={x(i) + CELL / 2} y={TOP + CELL / 2 + 5} className="cell-value-sm">{displayValue(c.value, event.objects)}</text>
              <text x={x(i) + CELL / 2} y={TOP + CELL + 15} className="cell-index">{i}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  // 2D
  const rows = obj.entries.map((r) => deref(event, r.value)?.entries ?? []);
  const cols = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const width = PAD * 2 + Math.max(1, cols) * (CELL + GAP);
  const height = TOP + Math.max(1, rows.length) * (CELL + GAP) + 8;
  const x = (c: number) => PAD + c * (CELL + GAP);
  const y = (r: number) => TOP + r * (CELL + GAP);

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`DP table ${binding.variable}, ${rows.length} by ${cols}`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (dp[{rows.length}][{cols}])</text>
      {rows.map((row, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const cell = row[c];
          const active = iMark === r && jMark === c;
          const filled = cell && cell.value.kind !== "none";
          return (
            <g key={`${r}-${c}`}>
              <rect x={x(c)} y={y(r)} width={CELL} height={CELL} rx={4} className={active ? "cell cell-active" : filled ? "cell cell-filled" : "cell"} />
              {cell && <text x={x(c) + CELL / 2} y={y(r) + CELL / 2 + 5} className="cell-value-sm">{displayValue(cell.value, event.objects)}</text>}
            </g>
          );
        }),
      )}
    </svg>
  );
}
