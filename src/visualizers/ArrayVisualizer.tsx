/**
 * Array / list visualizer.
 *
 * Renders a list value as a row of cells with stable positions (index =
 * x-position), index labels, and pointer/boundary/highlight overlays driven by
 * other variables in the frame (e.g. two-pointer `lo`/`hi`, sliding window).
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { recordedRange, SequenceState } from './SequenceState';
import { sequencePreview, sequenceCount, sequenceNotice, recordedIndex, hiddenPointers, boundedSvgStyle, DiagramNotice, cellDisplay, valueNotice } from './limits';
import {
  resolveBindingObject,
  resolveOverlays,
  indexOverlays,
  overlayColor,
  aliasNames,
} from "./helpers";

const CELL = 52;
const GAP = 8;
const PAD = 16;
const TOP = 48;
const ALIAS_H = 20;

export function ArrayVisualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) {
    return <p className="viz-empty">No array “{binding.variable}” in scope yet.</p>;
  }

  const cells = sequencePreview(obj);
  const displayed = cells.map(cell => cellDisplay(cell.value, event.objects));
  const width = PAD * 2 + Math.max(1, cells.length) * CELL + Math.max(0, cells.length - 1) * GAP;

  // Aliasing (snapshot-only): other in-scope names that refer to THIS SAME list
  // object (equal recorded reference id). Shown so the learner sees that e.g.
  // `scores` and `best` are one object, while a copy is a different object.
  const aliases = aliasNames(event, binding);
  const height = TOP + CELL + 64 + (aliases.length > 0 ? ALIAS_H : 0);

  const overlays = resolveOverlays(event, binding);
  const visible = new Set(cells.map(recordedIndex));
  const marks = indexOverlays(overlays, obj.entries.length).filter(mark => visible.has(mark.index));

  // Push the cells down to make room for the alias note when it is shown.
  const top = TOP + (aliases.length > 0 ? ALIAS_H : 0);

  const range = recordedRange(event, binding);
  const cellX = (i: number) => PAD + i * (CELL + GAP);

  return (
    <><svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      style={boundedSvgStyle(width, height)}
      aria-label={`Array ${binding.variable} with ${sequenceCount(obj)}`}
    >
      <text x={PAD} y={22} className="viz-title">
        {binding.variable} ({obj.type}, {sequenceCount(obj)})
      </text>

      {aliases.length > 0 && (
        <text x={PAD} y={40} className="alias-note" aria-label={`${binding.variable} shares one object with ${aliases.join(", ")}`}>
          = same object as {aliases.join(", ")} (one shared list)
        </text>
      )}

      {cells.length === 0 && (
        <text x={PAD} y={top + CELL / 2} className="viz-empty-svg">
          (empty)
        </text>
      )}

      {cells.map((cell, i) => {
        const index = recordedIndex(cell);
        const mark = marks.find((m) => m.index === index);
        return (
          <g key={cell.key} data-index={cell.key}>
            <rect
              x={cellX(i)}
              y={top}
              width={CELL}
              height={CELL}
              rx={6}
              className={`cell${mark ? ' cell-active' : ''}${range && index !== undefined && index>=range.start && index<=range.last ? ' cell-in-range' : ''}`}
            />
            <text x={cellX(i) + CELL / 2} y={top + CELL / 2 + 5} className="cell-value">
              {displayed[i].text}
            </text>
            <text x={cellX(i) + CELL / 2} y={top + CELL + 18} className="cell-index">
              {cell.key}
            </text>
          </g>
        );
      })}

      {marks.map((m, k) => (
        <text
          key={`ptr-${k}`}
          x={cellX(cells.findIndex(cell => recordedIndex(cell) === m.index)) + CELL / 2}
          y={top - 14 - (k % 2) * 16}
          className="pointer-label"
          fill={overlayColor(k)}
        >
          {m.label}↓
        </text>
      ))}
    </svg><DiagramNotice text={[sequenceNotice(obj, cells), hiddenPointers(overlays, cells), valueNotice(displayed)].filter(Boolean).join(' ')}/><SequenceState event={event} binding={binding} length={obj.entries.length} truncated={obj.truncated}/></>
  );
}
