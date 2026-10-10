/**
 * String visualizer: shows a str as indexed character cells, mirroring the
 * array layout so pointer/window overlays behave identically. Strings are
 * immutable in Python, so this is a read-only view of characters by index.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveBindingValue, asString, resolveOverlays, indexOverlays, overlayColor } from "./helpers";
import { recordedRange, SequenceState } from './SequenceState';
import { SEQUENCE_LIMIT, boundedSvgStyle, DiagramNotice } from './limits';

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
  const value = resolveBindingValue(event, binding);
  const str = asString(value);
  if (str === undefined) {
    const label = binding.path ? `${binding.variable}.${binding.path}` : binding.variable;
    return <p className="viz-empty">No string “{label}” in scope yet.</p>;
  }

  // Count Python code points without allocating an array for the whole string.
  const chars: string[] = [];
  let length = 0;
  for (const ch of str) {
    if (length < SEQUENCE_LIMIT) chars.push(ch);
    length++;
  }
  const width = PAD * 2 + Math.max(1, chars.length) * CELL + Math.max(0, chars.length - 1) * GAP;
  const height = TOP + CELL + 64;
  const overlays = resolveOverlays(event, binding);
  const marks = indexOverlays(overlays, chars.length);
  const hidden = overlays.filter(o => ['pointer', 'boundary', 'highlight'].includes(o.role) && o.index !== undefined && Number.isSafeInteger(o.index) && (o.index < 0 || o.index >= chars.length));
  const cellX = (i: number) => PAD + i * (CELL + GAP);
  const range = recordedRange(event, binding);

  return (
    <><svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      style={boundedSvgStyle(width, height)}
      aria-label={`String ${binding.variable}, length ${length}`}
    >
      <text x={PAD} y={22} className="viz-title">
        {binding.variable} (str, len {length})
      </text>
      {chars.length === 0 && (
        <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">(empty string)</text>
      )}
      {chars.map((ch, i) => {
        const mark = marks.find((m) => m.index === i);
        return (
          <g key={i}>
            <rect x={cellX(i)} y={TOP} width={CELL} height={CELL} rx={6} className={`cell${mark ? ' cell-active' : ''}${range && i>=range.start && i<=range.last ? ' cell-in-range' : ''}`} />
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
    </svg><DiagramNotice text={[length > chars.length ? `Display limit: showing character indices 0–${chars.length - 1} of ${length} Unicode code points.` : '', hidden.length ? `Recorded pointers outside the displayed characters: ${hidden.map(o => `${o.label}=${o.index}`).join(', ')}.` : ''].filter(Boolean).join(' ')}/><SequenceState event={event} binding={binding} length={length}/></>
  );
}
