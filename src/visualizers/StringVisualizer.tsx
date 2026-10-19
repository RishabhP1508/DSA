/**
 * String visualizer: shows a str as indexed character cells, mirroring the
 * array layout so pointer/window overlays behave identically. Strings are
 * immutable in Python, so this is a read-only view of characters by index.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveBindingValue, asString, resolveOverlays, indexOverlays, overlayColor } from "./helpers";
import { recordedRange, SequenceState } from './SequenceState';
import { SEQUENCE_LIMIT, boundedSvgStyle, DiagramNotice, DiagramCaption, SvgLabel, bindingLabel } from './limits';

const CELL = 40;
const GAP = 4;
const PAD = 16;

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
    const label = bindingLabel(binding);
    return <p className="viz-empty">No string “{label}” in scope yet.</p>;
  }

  // Count Python code points without allocating an array for the whole string.
  const chars: string[] = [];
  let length = 0;
  for (const ch of str) {
    if (length < SEQUENCE_LIMIT) chars.push(ch);
    length++;
  }
  const width = Math.max(180, PAD * 2 + Math.max(1, chars.length) * CELL + Math.max(0, chars.length - 1) * GAP);
  const TOP = 24 + Math.max(1, (binding.overlays ?? []).filter(o=>['pointer','boundary','highlight'].includes(o.role)).length) * 20;
  const height = TOP + CELL + 40;
  const overlays = resolveOverlays(event, binding);
  const marks = indexOverlays(overlays, chars.length);
  const hidden = overlays.filter(o => ['pointer', 'boundary', 'highlight'].includes(o.role) && o.index !== undefined && Number.isSafeInteger(o.index) && (o.index < 0 || o.index >= chars.length));
  const cellX = (i: number) => PAD + i * (CELL + GAP);
  const range = recordedRange(event, binding);

  return (
    <><DiagramCaption><code>{bindingLabel(binding)}</code> · str · {length} characters</DiagramCaption><svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      style={boundedSvgStyle(width, height)}
      aria-label={`String ${bindingLabel(binding)}, length ${length}`}
    >
      {chars.length === 0 && (
        <text x={PAD} y={TOP + CELL / 2} className="viz-empty-svg">(empty string)</text>
      )}
      {chars.map((ch, i) => {
        const mark = marks.find((m) => m.index === i);
        const control = ({' ':'␠','\n':'↵','\t':'⇥','\r':'␍','\0':'␀'} as Record<string,string>)[ch];
        const characterName = ({' ':'space','\n':'newline','\t':'tab','\r':'carriage return','\0':'null character'} as Record<string,string>)[ch];
        return (
          <g key={i}>
            <rect x={cellX(i)} y={TOP} width={CELL} height={CELL} rx={6} className={`cell${mark ? ' cell-active' : ''}${range && i>=range.start && i<=range.last ? ' cell-in-range' : ''}`} />
            <text x={cellX(i) + CELL / 2} y={TOP + CELL / 2} className="cell-value" aria-label={characterName}>
              {control ?? ch}
            </text>
            <text x={cellX(i) + CELL / 2} y={TOP + CELL + 18} className="cell-index">{i}</text>
          </g>
        );
      })}
      {marks.map((m, k) => (
        <SvgLabel key={k} x={cellX(m.index!) + CELL / 2} y={TOP - 14 - k * 20} className="pointer-label" fill={overlayColor(k)} text={`${m.label}↓`} maxChars={6}/>
      ))}
    </svg><DiagramNotice text={[length > chars.length ? `Display limit: showing character indices 0–${chars.length - 1} of ${length} Unicode code points.` : '', hidden.length ? `Recorded pointers outside the displayed characters: ${hidden.map(o => `${o.label}=${o.index}`).join(', ')}.` : ''].filter(Boolean).join(' ')}/><SequenceState event={event} binding={binding} length={length}/></>
  );
}
