/**
 * Array / list visualizer.
 *
 * Renders a list value as a row of cells with stable positions (index =
 * x-position), index labels, and pointer/boundary/highlight overlays driven by
 * other variables in the frame (e.g. two-pointer `lo`/`hi`, sliding window).
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { recordedRange, SequenceState } from './SequenceState';
import { sequencePreview, sequenceCount, sequenceNotice, recordedIndex, hiddenPointers, boundedSvgStyle, DiagramNotice, DiagramCaption, SvgLabel, bindingLabel, labelDisplay, cellDisplay, valueNotice } from './limits';
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

export function ArrayVisualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) {
    return <p className="viz-empty">No array “{bindingLabel(binding)}” in scope yet.</p>;
  }

  const cells = sequencePreview(obj);
  const displayed = cells.map(cell => cellDisplay(cell.value, event.objects));
  const width = Math.max(180, PAD * 2 + Math.max(1, cells.length) * CELL + Math.max(0, cells.length - 1) * GAP);

  // Aliasing (snapshot-only): other in-scope names that refer to THIS SAME list
  // object (equal recorded reference id). Shown so the learner sees that e.g.
  // `scores` and `best` are one object, while a copy is a different object.
  const aliases = binding.path ? [] : aliasNames(event, binding);
  const aliasPreview = aliases.slice(0, 8).map(name=>labelDisplay(name).text);

  const overlays = resolveOverlays(event, binding);
  const visible = new Set(cells.map(recordedIndex));
  const marks = indexOverlays(overlays, obj.entries.length).filter(mark => visible.has(mark.index));

  // Every authored pointer gets its own lane, including pointers sharing a cell.
  const top = 24 + Math.max(1, (binding.overlays ?? []).filter(o => ['pointer','boundary','highlight'].includes(o.role)).length) * 20;
  const height = top + CELL + 40;

  const range = recordedRange(event, binding);
  const cellX = (i: number) => PAD + i * (CELL + GAP);

  return (
    <><DiagramCaption><code>{bindingLabel(binding)}</code> · {labelDisplay(obj.type).text} · {sequenceCount(obj)}</DiagramCaption>
    {aliases.length > 0 && <p className="alias-note" aria-label={`${bindingLabel(binding)} shares one object with ${aliasPreview.join(', ')}`}>The same object as {aliasPreview.map((name, i) => <span key={i}>{i > 0 && ', '}<code>{name}</code></span>)}{aliases.length > aliasPreview.length ? `, and ${aliases.length-aliasPreview.length} more names` : ''}. These names refer to one shared list.</p>}
    <svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      style={boundedSvgStyle(width, height)}
      aria-label={`Array ${bindingLabel(binding)} with ${sequenceCount(obj)}`}
    >
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
            <SvgLabel x={cellX(i) + CELL / 2} y={top + CELL / 2} className="cell-value" text={displayed[i].text} />
            <text x={cellX(i) + CELL / 2} y={top + CELL + 18} className="cell-index">
              {cell.key}
            </text>
          </g>
        );
      })}

      {marks.map((m, k) => (
        <SvgLabel
          key={`ptr-${k}`}
          x={cellX(cells.findIndex(cell => recordedIndex(cell) === m.index)) + CELL / 2}
          y={top - 14 - k * 20}
          className="pointer-label"
          fill={overlayColor(k)}
          text={`${m.label}↓`} maxChars={7}
        />
      ))}
    </svg><DiagramNotice text={[sequenceNotice(obj, cells), hiddenPointers(overlays, cells), valueNotice(displayed)].filter(Boolean).join(' ')}/><SequenceState event={event} binding={binding} length={obj.entries.length} truncated={obj.truncated}/></>
  );
}
