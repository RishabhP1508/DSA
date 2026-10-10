/**
 * DP table visualizer.
 *
 * Renders a 1D or 2D dynamic-programming table (a list, or a list of lists) as a
 * grid. A `current` pointer overlay (or `i`/`j` overlays) highlights the cell
 * being filled; already-filled cells are shaded so the fill order is visible.
 *
 * "Computed" shading comes ONLY from authored/observed state (a `computedSource`
 * variable listing the computed indices) — never inferred from a cell being
 * non-None, because a zero-initialised table is not "computed". The current
 * cell is highlighted from the `i`/`j` overlays (actual state).
 */

import type { TraceEvent, TraceValue, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import { resolveBindingObject, deref, resolveOverlays, resolveVariable } from "./helpers";
import { sequencePreview, sequenceCount, sequenceNotice, recordedIndex, hiddenPointers, boundedSvgStyle, DiagramNotice, gridPreview, cellDisplay, valueNotice } from './limits';

const CELL = 46;
const GAP = 3;
const PAD = 16;
const TOP = 44;

/**
 * The set of indices/cells that have actually been COMPUTED, taken ONLY from
 * the authored `computedSource` variable (a set/list). Returns null when no such
 * metadata is bound — in which case NO cell is styled "computed" (a non-None
 * value alone, e.g. a zero-initialised table, is not evidence of computation).
 *
 * 1D: members are ints (the computed indices).
 * 2D: members are "[i, j]"/"(i, j)" pairs, or "i,j" — matched by string form.
 */
function computedSet(event: TraceEvent, binding: VisualBinding): Set<string> | null {
  if (!binding.computedSource) return null;
  const obj = deref(event, resolveVariable(event, binding.computedSource));
  if (!obj?.entries) return new Set();
  const out = new Set<string>();
  for (const e of obj.entries) {
    // set/list → member is the value; normalise to a compact string key.
    out.add(cellKeyOf(event, e.value));
  }
  return out;
}

function cellKeyOf(event: TraceEvent, v: TraceValue): string {
  if (v.kind === "int" || v.kind === "str") return String(v.value);
  if (v.kind === "ref") {
    // a tuple/list [i, j] → "i,j"
    const o = event.objects[v.id];
    if (o?.entries) return o.entries.map((e) => displayValue(e.value, event.objects)).join(",");
  }
  return displayValue(v, event.objects);
}

export function DPTableVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) return <p className="viz-empty">No DP table “{binding.variable}” yet.</p>;

  const is2D = obj.entries.length > 0 && obj.entries[0].value.kind === "ref" && deref(event, obj.entries[0].value)?.entries !== undefined;

  const overlays = resolveOverlays(event, binding);
  const iMark = overlays.find((o) => /^i$|row|\bi\b/i.test(o.label))?.index;
  const jMark = overlays.find((o) => /^j$|col|\bj\b/i.test(o.label))?.index;
  // "computed" styling comes ONLY from authored/observed metadata (R4 amendment).
  const computed = computedSet(event, binding);

  if (!is2D) {
    const cells = sequencePreview(obj);
    const displayed = cells.map(cell => cellDisplay(cell.value, event.objects));
    const width = PAD * 2 + Math.max(1, cells.length) * (CELL + GAP);
    const height = TOP + CELL + 26;
    const x = (i: number) => PAD + i * (CELL + GAP);
    return (
      <><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`DP table ${binding.variable}, ${sequenceCount(obj)}`}>
        <text x={PAD} y={22} className="viz-title">{binding.variable} (dp, {sequenceCount(obj)})</text>
        {cells.map((c, i) => {
          const index = recordedIndex(c);
          const filled = computed?.has(c.key) ?? false;
          const active = index !== undefined && iMark === index;
          return (
            <g key={c.key} data-index={c.key}>
              <rect x={x(i)} y={TOP} width={CELL} height={CELL} rx={5} className={active ? "cell cell-active" : filled ? "cell cell-filled" : "cell"} />
              <text x={x(i) + CELL / 2} y={TOP + CELL / 2 + 5} className="cell-value-sm">{displayed[i].text}</text>
              <text x={x(i) + CELL / 2} y={TOP + CELL + 15} className="cell-index">{c.key}</text>
            </g>
          );
        })}
      </svg><DiagramNotice text={[sequenceNotice(obj, cells), hiddenPointers(overlays, cells), valueNotice(displayed)].filter(Boolean).join(' ')}/></>
    );
  }

  // 2D
  const { rows, columns: cols, summary, notice } = gridPreview(event, obj);
  const displayed = rows.map(row => row.cells.map(cell => cellDisplay(cell.value, event.objects)));
  const width = PAD * 2 + Math.max(1, cols) * (CELL + GAP);
  const height = TOP + Math.max(1, rows.length) * (CELL + GAP) + 8;
  const x = (c: number) => PAD + c * (CELL + GAP);
  const y = (r: number) => TOP + r * (CELL + GAP);

  return (
    <><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`DP table ${binding.variable}, ${summary}`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (dp, {summary})</text>
      {rows.map((row, r) =>
        row.cells.map((cell, c) => {
          const column = recordedIndex(cell);
          const active = row.index !== undefined && column !== undefined && iMark === row.index && jMark === column;
          const filled = computed?.has(`${row.key},${cell.key}`) ?? false;
          return (
            <g key={`${row.key}-${cell.key}`} data-row={row.key} data-col={cell.key} aria-label={`${binding.variable}[${row.key}][${cell.key}]`}>
              <rect x={x(c)} y={y(r)} width={CELL} height={CELL} rx={4} className={active ? "cell cell-active" : filled ? "cell cell-filled" : "cell"} />
              <text x={x(c) + CELL / 2} y={y(r) + CELL / 2 + 5} className="cell-value-sm">{displayed[r][c].text}</text>
            </g>
          );
        }),
      )}
    </svg><DiagramNotice text={[notice, valueNotice(displayed.flat()), iMark !== undefined && jMark !== undefined && !rows.some(row => row.index === iMark && row.cells.some(cell => recordedIndex(cell) === jMark)) ? `Recorded current coordinates [${iMark}][${jMark}] have no cell in the displayed recorded data.` : ''].filter(Boolean).join(' ')}/></>
  );
}
