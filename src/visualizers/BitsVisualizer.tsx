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

import type { TraceEvent, TraceValue, VisualBinding } from "../core/types";
import { resolveBindingValue, resolveOverlays } from "./helpers";

const CELL = 34;
const GAP = 4;
const PAD = 16;
const TOP = 48;

/**
 * Read an integer TraceValue as a BigInt. Python ints are arbitrary precision,
 * and the tracer encodes ones outside JS's safe range as strings, so we must
 * NOT go through a JS `number` (which would lose precision and, with `>>`, wrap
 * at 32 bits). Returns null when the value is not an integer.
 */
function asBigInt(v: TraceValue | undefined): bigint | null {
  if (!v || v.kind !== "int") return null;
  try {
    return typeof v.value === "number" ? BigInt(Math.trunc(v.value)) : BigInt(v.value);
  } catch {
    return null;
  }
}

export function BitsVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const value = resolveBindingValue(event, binding);
  const n = asBigInt(value);
  if (n === null) {
    const label = binding.path ? `${binding.variable}.${binding.path}` : binding.variable;
    return <p className="viz-empty">No integer “{label}” in scope yet.</p>;
  }

  const negative = n < 0n;
  const magnitude = negative ? -n : n;
  // Bit width: at least 8, and a multiple of 8 large enough to hold the
  // magnitude — computed with BigInt so >32-bit and huge values are exact.
  let bitLen = 0;
  for (let m = magnitude; m > 0n; m >>= 1n) bitLen++;
  const bitsCount = Math.max(8, Math.ceil(Math.max(1, bitLen) / 8) * 8);
  const bits: number[] = [];
  for (let i = bitsCount - 1; i >= 0; i--) {
    bits.push(Number((magnitude >> BigInt(i)) & 1n));
  }

  const overlays = resolveOverlays(event, binding);
  const highlightPositions = overlays
    .filter((o) => o.role === "highlight" || o.role === "pointer")
    .map((o) => o.index)
    .filter((x): x is number => x !== undefined);

  const width = PAD * 2 + bitsCount * (CELL + GAP);
  const height = TOP + CELL + (negative ? 46 : 30);
  const x = (i: number) => PAD + i * (CELL + GAP);
  const label = binding.path ? `${binding.variable}.${binding.path}` : binding.variable;

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Bits of ${label} = ${n.toString()}`}>
      <text x={PAD} y={22} className="viz-title">
        {label} = {n.toString()} · {bitsCount}-bit{negative ? " (magnitude)" : ""}
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
      {negative && (
        <text x={PAD} y={TOP + CELL + 34} className="viz-note">
          Negative: bits show the magnitude |{n.toString()}|. In Python, a negative int behaves in
          bitwise ops as an infinite two&rsquo;s-complement sign extension (leading 1s), not a fixed
          width.
        </text>
      )}
    </svg>
  );
}
