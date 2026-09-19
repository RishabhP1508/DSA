/**
 * Binary heap visualizer.
 *
 * A Python heap (heapq) is a plain list using ZERO-BASED indexing: the children
 * of index i are at 2i+1 and 2i+2, and the parent of i is at (i-1)//2. This
 * convention is verified against the Python heapq documentation (see
 * docs/references.md) — some textbooks (e.g. Princeton) use 1-based indexing,
 * which this app deliberately does NOT follow, to match the bundled runtime.
 *
 * We show both the backing array (with indices) and the implied complete binary
 * tree so learners can connect the two representations.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import { resolveBindingObject, resolveOverlays, indexOverlays, overlayColor } from "./helpers";

const CELL = 42;
const GAP = 4;
const PAD = 16;
const R = 18;

export function HeapVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) return <p className="viz-empty">No heap “{binding.variable}” yet.</p>;

  const items = obj.entries;
  const n = items.length;
  const marks = indexOverlays(resolveOverlays(event, binding), n);

  // Array row layout.
  const arrTop = 44;
  const arrWidth = PAD * 2 + Math.max(1, n) * (CELL + GAP);

  // Tree layout: level of index i is floor(log2(i+1)); position within level.
  const levelOf = (i: number) => Math.floor(Math.log2(i + 1));
  const maxLevel = n > 0 ? levelOf(n - 1) : 0;
  const treeTop = arrTop + CELL + 48;
  const V_GAP = 56;
  const treeWidth = PAD * 2 + Math.pow(2, maxLevel) * 56;
  const width = Math.max(arrWidth, treeWidth);
  const height = treeTop + (maxLevel + 1) * V_GAP + PAD;

  const arrX = (i: number) => PAD + i * (CELL + GAP);
  // Position node i in its level, spread across the width.
  function treePos(i: number) {
    const level = levelOf(i);
    const firstInLevel = Math.pow(2, level) - 1;
    const idxInLevel = i - firstInLevel;
    const countInLevel = Math.pow(2, level);
    const slot = (width - PAD * 2) / countInLevel;
    const cx = PAD + slot * (idxInLevel + 0.5);
    const cy = treeTop + level * V_GAP;
    return { cx, cy };
  }

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Binary heap ${binding.variable} with ${n} elements, zero-based array and tree views`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (heap, {n}, 0-based)</text>
      {n === 0 && <text x={PAD} y={arrTop + CELL / 2} className="viz-empty-svg">(empty heap)</text>}

      {/* array view */}
      {items.map((e, i) => {
        const mark = marks.find((m) => m.index === i);
        return (
          <g key={`a-${i}`}>
            <rect x={arrX(i)} y={arrTop} width={CELL} height={CELL} rx={5} className={mark ? "cell cell-active" : "cell"} />
            <text x={arrX(i) + CELL / 2} y={arrTop + CELL / 2 + 5} className="cell-value-sm">{displayValue(e.value, event.objects)}</text>
            <text x={arrX(i) + CELL / 2} y={arrTop + CELL + 16} className="cell-index">{i}</text>
          </g>
        );
      })}

      {/* tree edges (parent -> child) */}
      {items.map((_, i) => {
        if (i === 0) return null;
        const parent = Math.floor((i - 1) / 2);
        const pp = treePos(parent);
        const cp = treePos(i);
        return <line key={`e-${i}`} x1={pp.cx} y1={pp.cy} x2={cp.cx} y2={cp.cy} className="tree-edge" />;
      })}

      {/* tree nodes */}
      {items.map((e, i) => {
        const { cx, cy } = treePos(i);
        const mark = marks.find((m) => m.index === i);
        return (
          <g key={`t-${i}`}>
            <circle cx={cx} cy={cy} r={R} className={mark ? "cell cell-active node-circle" : "cell node-circle"} />
            <text x={cx} y={cy + 4} className="cell-value-sm">{displayValue(e.value, event.objects)}</text>
            <text x={cx} y={cy + R + 12} className="cell-index">{i}</text>
          </g>
        );
      })}

      {marks.map((m, k) => (
        <text key={`m-${k}`} x={arrX(m.index!) + CELL / 2} y={arrTop - 8 - (k % 2) * 14} className="pointer-label" fill={overlayColor(k)}>
          {m.label}↓
        </text>
      ))}
    </svg>
  );
}
