/**
 * Bit-manipulation visualizer.
 *
 * Renders an integer variable as a row of bits (most-significant on the left),
 * with bit-position indices beneath. A `highlight` overlay whose value names a
 * bit position marks that bit. Useful for masks, set/clear/toggle, and
 * bit-counting lessons.
 *
 * Width adapts to the value: at least 8 bits, expanding to fit larger numbers
 * (negative numbers are shown via their Python two's-complement-free repr, i.e.
 * a sign plus magnitude, since Python ints are arbitrary precision).
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveVariable, asNumber, resolveOverlays } from "./helpers";

const CELL = 34;
const GAP = 4;
const PAD = 16;
const TOP = 48;

export function BitsVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const value = resolveVariable(event, binding.variable);
  const num = asNumber(value);
  if (num === undefined || !Number.isFinite(num)) {
    return <p className="viz-empty">No integer “{binding.variable}” in scope yet.</p>;
  }

  const negative = num < 0;
  const magnitude = Math.abs(Math.trunc(num));
  // Determine bit width: at least 8, enough to hold the magnitude.
  const needed = magnitude === 0 ? 1 : Math.floor(Math.log2(magnitude)) + 1;
  const bitsCount = Math.max(8, Math.ceil(needed / 8) * 8);
  const bits: number[] = [];
  for (let i = bitsCount - 1; i >= 0; i--) {
    bits.push((magnitude >> i) & 1);
  }

  const overlays = resolveOverlays(event, binding);
  const highlightPositions = overlays
    .filter((o) => o.role === "highlight" || o.role === "pointer")
    .map((o) => o.index)
    .filter((x): x is number => x !== undefined);

  const width = PAD * 2 + bitsCount * (CELL + GAP);
  const height = TOP + CELL + 30;
  const x = (i: number) => PAD + i * (CELL + GAP);

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Bits of ${binding.variable} = ${num}`}>
      <text x={PAD} y={22} className="viz-title">
        {binding.variable} = {num}{negative ? " (sign shown separately)" : ""} · {bitsCount}-bit
      </text>
      {bits.map((b, i) => {
        const pos = bitsCount - 1 - i; // bit position (0 = LSB)
        const hi = highlightPositions.includes(pos);
        return (
          <g key={i}>
            <rect x={x(i)} y={TOP} width={CELL} height={CELL} rx={4} className={hi ? "cell cell-active" : b ? "cell cell-filled" : "cell"} />
            <text x={x(i) + CELL / 2} y={TOP + CELL / 2 + 5} className="cell-value-sm">{b}</text>
            <text x={x(i) + CELL / 2} y={TOP + CELL + 14} className="cell-index">{pos}</text>
          </g>
        );
      })}
    </svg>
  );
}
