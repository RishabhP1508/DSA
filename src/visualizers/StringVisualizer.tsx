/**
 * String visualizer: shows a str as indexed character cells, mirroring the
 * array layout so pointer/window overlays behave identically. Strings are
 * immutable in Python, so this is a read-only view of characters by index.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveVariable, asString, resolveOverlays, indexOverlays, overlayColor } from "./helpers";

const CELL = 40;
const GAP = 4;
const PAD = 16;
const TOP = 48;

export function StringVisualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  const value = resolveVariable(event, binding.variable);
  const str = asString(value);
  if (str === undefined) {
    return <p className="viz-empty">No string “{binding.variable}” in scope yet.</p>;
  }

  const chars = [...str];
  const width = PAD * 2 + Math.max(1, chars.length) * CELL + Math.max(0, chars.length - 1) * GAP;
  const height = TOP + CELL + 64;
  const marks = indexOverlays(resolveOverlays(event, binding), chars.length);
  const cellX = (i: number) => PAD + i * (CELL + GAP);

  return (
    <svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`String ${binding.variable}, length ${chars.length}`}
    >
      <text x={PAD} y={22} className="viz-title">
        {binding.variable} (str, len {chars.length})
      </text>
      {chars.length === 0 && (
        <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">(empty string)</text>
      )}
      {chars.map((ch, i) => {
        const mark = marks.find((m) => m.index === i);
        return (
          <g key={i}>
            <rect x={cellX(i)} y={TOP} width={CELL} height={CELL} rx={6} className={mark ? "cell cell-active" : "cell"} />
            <text x={cellX(i) + CELL / 2} y={TOP + CELL / 2 + 5} className="cell-value">
              {ch === " " ? "␠" : ch}
            </text>
            <text x={cellX(i) + CELL / 2} y={TOP + CELL + 18} className="cell-index">{i}</text>
          </g>
        );
      })}
      {marks.map((m, k) => (
        <text key={k} x={cellX(m.index!) + CELL / 2} y={TOP - 14 - (k % 2) * 16} className="pointer-label" fill={overlayColor(k)}>
          {m.label}↓
        </text>
      ))}
    </svg>
  );
}
