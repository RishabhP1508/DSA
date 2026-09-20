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
 * "too large to visualize as bits"; we only report an approximate width plus a
 * bounded digit preview, and the full value stays in the inspector.
 */
const TOO_LARGE_BITS = 100_000;

const LOG10_2 = Math.log10(2);
/** A decimal string longer than this certainly encodes more than TOO_LARGE_BITS bits. */
const TOO_LARGE_DIGITS = Math.floor(TOO_LARGE_BITS * LOG10_2); // ≈ 30102 digits
/** How many leading digits to show in a bounded preview of a huge value. */
const PREVIEW_DIGITS = 12;

/** Read an integer TraceValue as a BigInt (number or string-encoded big int). */
function asBigInt(v: TraceValue | undefined): bigint | null {
  if (!v || v.kind !== "int") return null;
  try {
    return typeof v.value === "number" ? BigInt(Math.trunc(v.value)) : BigInt(v.value);
  } catch {
    return null;
  }
}

/** How close the estimate must be to the cap before we compute the EXACT width
 *  (the decimal→bits estimate is ±1–2 bits, so a small margin is ample). */
const BOUNDARY_MARGIN = 8;

/**
 * Estimate the bit length of a nonnegative BigInt from its decimal string
 * length — `bits ≈ digits / log10(2)`. O(digits), never a per-bit scan.
 */
function estimateBitLength(magnitude: bigint): number {
  if (magnitude === 0n) return 1;
  return Math.max(1, Math.ceil(magnitude.toString().length / LOG10_2));
}

/**
 * Exact bit length via a per-bit scan. Called ONLY when the estimate is within
 * BOUNDARY_MARGIN of MAX_BITS (so the value is ~256 bits) — bounded work — so a
 * huge value like `1 << 10000` never triggers a 10 000-iteration scan.
 */
function exactBitLength(magnitude: bigint): number {
  let n = 0;
  for (let m = magnitude; m > 0n; m >>= 1n) n++;
  return Math.max(1, n);
}

/** A bounded preview of a big decimal string: "1234567890…  (N digits)". */
function digitPreview(decimal: string): { preview: string; digits: number } {
  const neg = decimal.startsWith("-");
  const mag = neg ? decimal.slice(1) : decimal;
  const digits = mag.length;
  if (digits <= PREVIEW_DIGITS) return { preview: decimal, digits };
  return { preview: (neg ? "-" : "") + mag.slice(0, PREVIEW_DIGITS) + "…", digits };
}

export function BitsVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const value = resolveBindingValue(event, binding);
  const label = binding.path ? `${binding.variable}.${binding.path}` : binding.variable;

  // First-cut type/size check WITHOUT parsing a possibly-enormous integer:
  // decide "too large" from the raw decimal STRING LENGTH so we never BigInt-parse
  // (nor embed) a value with tens of thousands of digits. Cost here is O(digits)
  // to read the string length — not proportional to the bit count.
  const raw = value && value.kind === "int" ? value.value : undefined;
  if (typeof raw === "string") {
    const magDigits = raw.startsWith("-") ? raw.length - 1 : raw.length;
    if (magDigits > TOO_LARGE_DIGITS) {
      const { preview, digits } = digitPreview(raw);
      const approxBits = Math.round(digits / LOG10_2);
      return (
        <div className="viz-empty">
          <div>
            <code>{label}</code> = {preview}
          </div>
          <div className="viz-note">
            {digits.toLocaleString()} digits (≈{approxBits.toLocaleString()} bits) — too large to
            visualize as a bit row. The full value is available in the inspector.
          </div>
        </div>
      );
    }
  }

  const n = asBigInt(value);
  if (n === null) {
    return <p className="viz-empty">No integer “{label}” in scope yet.</p>;
  }

  const negative = n < 0n;
  const magnitude = negative ? -n : n;
  const full = n.toString();
  const { preview, digits } = digitPreview(full);
  const previewNeeded = digits > PREVIEW_DIGITS;

  // Guard against a huge NUMBER-encoded value too (rare; numbers are ≤ 2^53).
  // Estimate from the string length, cheaply, before deciding to bound-render.
  if (full.length - (negative ? 1 : 0) > TOO_LARGE_DIGITS) {
    const approxBits = Math.round(digits / LOG10_2);
    return (
      <div className="viz-empty">
        <div>
          <code>{label}</code> = {preview}
        </div>
        <div className="viz-note">
          {digits.toLocaleString()} digits (≈{approxBits.toLocaleString()} bits) — too large to
          visualize as a bit row. The full value is available in the inspector.
        </div>
      </div>
    );
  }

  // Decide the width cheaply from the decimal estimate; only near the 256-bit
  // boundary do we compute the EXACT width (bounded, ~256-bit value) so the
  // boundary is decided precisely: (1<<256)-1 is 256 bits (not capped), 1<<256
  // is 257 bits (capped). A huge value like 1<<10000 is far above the cap, so no
  // per-bit scan runs.
  const estBits = estimateBitLength(magnitude);
  const trueBits =
    Math.abs(estBits - MAX_BITS) <= BOUNDARY_MARGIN ? exactBitLength(magnitude) : estBits;
  const capped = trueBits > MAX_BITS;
  const shownBits = capped ? MAX_BITS : Math.max(8, Math.ceil(trueBits / 8) * 8);

  // Materialize only `shownBits` low bits — bounded diagram work regardless of
  // the value's size.
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
  // Keep the title/aria-label BOUNDED: use the preview for wide values so a
  // capped SVG never embeds a multi-thousand-digit decimal string.
  const shownFull = previewNeeded ? preview : full;

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Bits of ${label} = ${shownFull}`}>
      <text x={PAD} y={22} className="viz-title">
        {label} = {shownFull} ·{" "}
        {capped ? `low ${shownBits} of ~${trueBits} bits` : `${shownBits}-bit`}
        {negative ? " (magnitude)" : ""}
      </text>
      {capped && (
        <text x={PAD} y={40} className="cell-index">
          … higher bits (position ≥ {shownBits}) omitted — full value in the inspector
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
          Negative: bits show the magnitude |{shownFull}|. In Python, a negative int behaves in
          bitwise ops as an infinite two&rsquo;s-complement sign extension (leading 1s), not a fixed
          width.
        </text>
      )}
    </svg>
  );
}
