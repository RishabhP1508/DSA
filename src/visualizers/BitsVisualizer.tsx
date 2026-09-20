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
 * Maximum number of bit cells ever rendered. A Python int can be astronomically
 * wide (e.g. `1 << 10000`), so we cap the diagram to the LOW `MAX_BITS` bits and
 * mark the higher bits as omitted. Chosen comfortably above common large values
 * (a 2**80 mask is 81 bits) so those still render in full.
 */
const MAX_BITS = 256;

/**
 * Above this many bits we don't even try to render a bit row — the number is
 * "too large to visualize as bits"; we only report its width and keep the full
 * value in the label/inspector. (We never do work proportional to the full bit
 * count: the true width is ESTIMATED from the decimal digit count, and only the
 * low MAX_BITS bits are ever materialized via masking.)
 */
const TOO_LARGE_BITS = 100_000;

const LOG10_2 = Math.log10(2);

/** Read an integer TraceValue as a BigInt (number or string-encoded big int). */
function asBigInt(v: TraceValue | undefined): bigint | null {
  if (!v || v.kind !== "int") return null;
  try {
    return typeof v.value === "number" ? BigInt(Math.trunc(v.value)) : BigInt(v.value);
  } catch {
    return null;
  }
}

/**
 * Cheaply ESTIMATE the bit length of a nonnegative BigInt from its decimal digit
 * count — O(digits), never O(bits) beyond that. `bits ≈ digits / log10(2)`. The
 * estimate can be off by ±1–2 bits, which is fine: it is used only to decide
 * whether to cap, and the capped view shows exact low-bit positions regardless.
 */
function estimateBitLength(magnitude: bigint): number {
  if (magnitude === 0n) return 1;
  const digits = magnitude.toString().length; // decimal digits
  return Math.max(1, Math.ceil(digits / LOG10_2));
}

/** Exact bit length; only call when the value is known to be small. */
function exactBitLength(magnitude: bigint): number {
  let n = 0;
  for (let m = magnitude; m > 0n; m >>= 1n) n++;
  return Math.max(1, n);
}

export function BitsVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const value = resolveBindingValue(event, binding);
  const n = asBigInt(value);
  const label = binding.path ? `${binding.variable}.${binding.path}` : binding.variable;
  if (n === null) {
    return <p className="viz-empty">No integer “{label}” in scope yet.</p>;
  }

  const negative = n < 0n;
  const magnitude = negative ? -n : n;
  const full = n.toString(); // the complete value stays available in the label

  // Estimate width WITHOUT scanning every bit, then decide how much to show.
  const estBits = estimateBitLength(magnitude);

  // Too large even to bound-render: show a compact "too large" state. The full
  // value is still shown; no bit row is built.
  if (estBits > TOO_LARGE_BITS) {
    return (
      <div className="viz-empty">
        <div><code>{label}</code> = {full}</div>
        <div className="viz-note">
          ≈{estBits.toLocaleString()} bits — too large to visualize as a bit row. The full value is
          shown above and in the inspector.
        </div>
      </div>
    );
  }

  // If the estimate is within the cap, compute the exact width (cheap) and show
  // every bit. Otherwise cap to the LOW MAX_BITS bits and mark the omission.
  const capped = estBits > MAX_BITS;
  const trueBits = capped ? estBits : exactBitLength(magnitude); // exact only when small
  const shownBits = capped ? MAX_BITS : Math.max(8, Math.ceil(trueBits / 8) * 8);

  // Materialize only `shownBits` low bits (O(shownBits) work regardless of size).
  const lowMask = (1n << BigInt(shownBits)) - 1n;
  const shownValue = magnitude & lowMask;
  const bits: number[] = [];
  for (let i = shownBits - 1; i >= 0; i--) {
    bits.push(Number((shownValue >> BigInt(i)) & 1n));
  }

  const overlays = resolveOverlays(event, binding);
  const highlightPositions = overlays
    .filter((o) => o.role === "highlight" || o.role === "pointer")
    .map((o) => o.index)
    .filter((x): x is number => x !== undefined);

  const width = PAD * 2 + shownBits * (CELL + GAP);
  const noteLines = (negative ? 1 : 0) + (capped ? 1 : 0);
  const height = TOP + CELL + 30 + noteLines * 16;
  const x = (i: number) => PAD + i * (CELL + GAP);

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Bits of ${label} = ${full}`}>
      <text x={PAD} y={22} className="viz-title">
        {label} = {full} ·{" "}
        {capped ? `low ${shownBits} of ~${trueBits} bits` : `${shownBits}-bit`}
        {negative ? " (magnitude)" : ""}
      </text>
      {capped && (
        <text x={PAD} y={40} className="cell-index">
          … higher bits (position ≥ {shownBits}) omitted — the full value is shown above
        </text>
      )}
      {bits.map((b, i) => {
        const pos = shownBits - 1 - i; // bit position (0 = LSB) — accurate for the retained window
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
          Negative: bits show the magnitude |{full}|. In Python, a negative int behaves in bitwise
          ops as an infinite two&rsquo;s-complement sign extension (leading 1s), not a fixed width.
        </text>
      )}
    </svg>
  );
}
