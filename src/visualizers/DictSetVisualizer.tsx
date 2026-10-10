/**
 * Dict and Set visualizers.
 *
 * Dict: key → value rows (insertion order, as Python dicts preserve it).
 * Set: unordered value chips.
 *
 * A "highlight" overlay whose value matches a key (dict) or member (set) marks
 * that entry — useful for frequency counting and membership checks.
 */

import type { TraceEvent, VisualBinding } from "../core/types";
import { resolveBindingObject, resolveOverlays } from "./helpers";
import { sequencePreview, collectionCount, collectionNotice, boundedSvgStyle, DiagramNotice, cellDisplay, labelDisplay, valueNotice } from './limits';

const ROW_H = 34;
const PAD = 16;
const TOP = 44;

export function DictVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) return <p className="viz-empty">No dict “{binding.variable}” yet.</p>;

  const overlays = resolveOverlays(event, binding);
  const highlightKeys = overlays
    .filter((o) => o.role === "highlight")
    .map((o) => (o.value && o.value.kind === "str" ? o.value.value : o.value ? String((o.value as { value?: unknown }).value ?? "") : ""));

  const rows = sequencePreview(obj);
  const values = rows.map(row => cellDisplay(row.value, event.objects));
  const keys = rows.map(row => row.keyKind === 'str' ? cellDisplay({ kind: 'str', value: row.key }, event.objects) : labelDisplay(row.key));
  const width = 300;
  const height = TOP + Math.max(1, rows.length) * ROW_H + 12;

  return (
    <><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Dictionary ${binding.variable} with ${collectionCount(obj, 'entries')}`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (dict, {collectionCount(obj, 'entries')})</text>
      {rows.length === 0 && <text x={PAD} y={TOP + ROW_H / 2} className="viz-empty-svg">{"{}"}</text>}
      {rows.map((e, i) => {
        const y = TOP + i * ROW_H;
        const hi = highlightKeys.includes(e.key);
        return (
          <g key={`${e.keyKind}:${e.key}:${i}`}>
            <rect x={PAD} y={y} width={110} height={ROW_H - 6} rx={5} className={hi ? "cell cell-active" : "cell cell-key"} />
            <text x={PAD + 55} y={y + ROW_H / 2} className="cell-value-sm">{keys[i].text}</text>
            <line x1={PAD + 118} y1={y + (ROW_H - 6) / 2} x2={PAD + 138} y2={y + (ROW_H - 6) / 2} className="ll-edge" markerEnd="url(#ds-arrow)" />
            <rect x={PAD + 140} y={y} width={110} height={ROW_H - 6} rx={5} className="cell" />
            <text x={PAD + 195} y={y + ROW_H / 2} className="cell-value-sm">{values[i].text}</text>
          </g>
        );
      })}
      <defs>
        <marker id="ds-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="arrow-head" />
        </marker>
      </defs>
    </svg><DiagramNotice text={[collectionNotice(obj, rows), valueNotice([...values, ...keys])].filter(Boolean).join(' ')}/></>
  );
}

export function SetVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { object: obj } = resolveBindingObject(event, binding);
  if (!obj || !obj.entries) return <p className="viz-empty">No set “{binding.variable}” yet.</p>;

  const chips = sequencePreview(obj);
  const values = chips.map(chip => cellDisplay(chip.value, event.objects));
  const CHIP = 46;
  const GAP = 8;
  const perRow = 6;
  const rows = Math.ceil(Math.max(1, chips.length) / perRow);
  const width = PAD * 2 + perRow * (CHIP + GAP);
  const height = TOP + rows * (CHIP + GAP) + 8;

  return (
    <><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Set ${binding.variable} with ${collectionCount(obj, 'members')}`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (set, {collectionCount(obj, 'members')})</text>
      {chips.length === 0 && <text x={PAD} y={TOP + CHIP / 2} className="viz-empty-svg">(empty set)</text>}
      {chips.map((_, i) => {
        const cx = PAD + (i % perRow) * (CHIP + GAP);
        const cy = TOP + Math.floor(i / perRow) * (CHIP + GAP);
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={CHIP} height={CHIP} rx={CHIP / 2} className="cell" />
            <text x={cx + CHIP / 2} y={cy + CHIP / 2 + 4} className="cell-value-sm">{values[i].text}</text>
          </g>
        );
      })}
    </svg><DiagramNotice text={[collectionNotice(obj, chips, true), valueNotice(values)].filter(Boolean).join(' ')}/></>
  );
}
