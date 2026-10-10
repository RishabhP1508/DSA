import type { CSSProperties } from 'react';
import type { TraceObject, TraceEvent, TraceValue } from '../core/types';
import type { ResolvedOverlay } from './helpers';

// These are display bounds, independent of the tracer's 1000-entry inspection
// bound. In particular, aliased rows must not multiply into a million SVG cells.
export const SEQUENCE_LIMIT = 64;
export const STACK_LIMIT = 32;
export const HEAP_LIMIT = 15;
export const GRID_ROWS = 16;
export const GRID_COLUMNS = 24;
export const NODE_LIMIT = 64;
export const EDGE_LIMIT = 128;
export const DEPTH_LIMIT = 16;
const CELL_TEXT_LIMIT = 96;
type Entry = NonNullable<TraceObject['entries']>[number];

function textPrefix(text: string) {
  let prefix = '';
  let count = 0;
  for (const character of text) {
    if (count === CELL_TEXT_LIMIT) return { text: prefix, shortened: true };
    prefix += character;
    count++;
  }
  return { text: prefix, shortened: false };
}

export function labelDisplay(text: string) {
  const prefix = textPrefix(text);
  return { text: prefix.text + (prefix.shortened ? '…' : ''), shortened: prefix.shortened };
}

/** Bounded formatting from data only; never put a huge primitive in SVG text. */
export function cellDisplay(value: TraceValue, objects: TraceEvent['objects']) {
  let shortened = false;
  const raw = (text: string) => {
    const prefix = textPrefix(text);
    shortened ||= prefix.shortened;
    return prefix.text + (prefix.shortened ? '…' : '');
  };
  const format = (v: TraceValue, depth = 0): string => {
    switch (v.kind) {
      case 'int': case 'float': return raw(String(v.value));
      case 'bool': return v.value ? 'True' : 'False';
      case 'none': return 'None';
      case 'unknown': return raw(v.repr);
      case 'str': {
        const prefix = textPrefix(v.value);
        shortened ||= prefix.shortened;
        return JSON.stringify(prefix.text) + (prefix.shortened ? '…' : '');
      }
      case 'ref': {
        const object = objects[v.id];
        if (!object) return '<ref>';
        if (depth > 2) return `<${raw(object.type)}>`;
        if (object.repr) return raw(object.repr);
        if (!object.entries) return `<${raw(object.type)}>`;
        const inner = object.entries.slice(0, 6).map(e => object.type === 'dict'
          ? `${e.keyKind === 'str' ? JSON.stringify(raw(e.key)) : raw(e.key)}: ${format(e.value, depth + 1)}`
          : format(e.value, depth + 1)).join(', ');
        const more = object.entries.length > 6 || object.truncated ? ', …' : '';
        const open = object.type === 'dict' || object.type === 'set' ? '{' : object.type === 'tuple' ? '(' : '[';
        const close = object.type === 'dict' || object.type === 'set' ? '}' : object.type === 'tuple' ? ')' : ']';
        return `${open}${inner}${more}${close}`;
      }
    }
  };
  const prefix = textPrefix(format(value));
  return { text: prefix.text + (prefix.shortened ? '…' : ''), shortened: shortened || prefix.shortened };
}

export function valueNotice(values: ReturnType<typeof cellDisplay>[]) {
  return values.some(value => value.shortened) ? 'Some cell values are shortened with ….' : '';
}

export function recordedIndex(entry: Entry): number | undefined {
  if (!/^\d+$/.test(entry.key)) return undefined;
  const index = Number(entry.key);
  return Number.isSafeInteger(index) ? index : undefined;
}

export function sequencePreview(object: TraceObject, limit = SEQUENCE_LIMIT, tail = false) {
  const entries = object.entries ?? [];
  const offset = tail && !object.truncated ? Math.max(0, entries.length - limit) : 0;
  return entries.slice(offset, offset + limit);
}

export function sequenceCount(object: TraceObject) {
  const count = object.entries?.length ?? 0;
  return object.truncated ? `${count} recorded entries; total unknown` : `${count} elements`;
}

export function collectionCount(object: TraceObject, noun: string) {
  const count = object.entries?.length ?? 0;
  return object.truncated ? `${count} recorded ${noun}; total unknown` : `${count} ${noun}`;
}

export function collectionNotice(object: TraceObject, shown: Entry[], unordered = false) {
  const messages: string[] = [];
  if (shown.length < (object.entries?.length ?? 0)) messages.push(`Display limit: showing ${shown.length} of ${object.entries!.length} inspected ${unordered ? 'members; their order has no meaning' : 'entries in insertion order'}.`);
  if (object.truncated) messages.push('More entries were not inspected; the total is unknown.');
  return messages.join(' ');
}

export function sequenceNotice(object: TraceObject, shown: Entry[], endpoint?: string) {
  const recorded = object.entries?.length ?? 0;
  const messages: string[] = [];
  if (shown.length < recorded) {
    messages.push(`Display limit: showing recorded indices ${shown[0]?.key}–${shown.at(-1)?.key} of ${recorded} inspected entries.`);
  }
  if (object.truncated) messages.push(`More entries were not inspected; total length is unknown.${endpoint ? ` ${endpoint} was not inspected.` : ''}`);
  else if (endpoint && shown.length < recorded) messages.push(`${endpoint} is outside the displayed prefix.`);
  return messages.join(' ');
}

export function hiddenPointers(overlays: ResolvedOverlay[], entries: Entry[]) {
  const visible = new Set(entries.map(recordedIndex));
  const hidden = overlays.filter(o =>
    ['pointer', 'boundary', 'highlight'].includes(o.role) &&
    o.index !== undefined && Number.isSafeInteger(o.index) && !visible.has(o.index));
  return hidden.length ? `Recorded pointers outside the displayed entries: ${hidden.map(o => `${o.label}=${o.index}`).join(', ')}.` : '';
}

/** Small diagrams retain their layout; larger diagrams scroll at natural size. */
export function boundedSvgStyle(width: number, height: number): CSSProperties | undefined {
  return width > 900 || height > 360 ? { width, minWidth: width, height, maxHeight: 'none' } : undefined;
}

export function DiagramNotice({ text }: { text: string }) {
  return text ? <p className="viz-note" role="note">{text}</p> : null;
}

export function gridPreview(event: TraceEvent, object: TraceObject) {
  const entries = object.entries ?? [];
  let recordedColumns = 0;
  let uninspected = !!object.truncated;
  for (const row of entries) {
    const rowObject = row.value.kind === 'ref' ? event.objects[row.value.id] : undefined;
    recordedColumns = Math.max(recordedColumns, rowObject?.entries?.length ?? 0);
    uninspected ||= !!rowObject?.truncated || !rowObject?.entries;
  }
  const rows = entries.slice(0, GRID_ROWS).map(row => {
    const rowObject = row.value.kind === 'ref' ? event.objects[row.value.id] : undefined;
    return { key: row.key, index: recordedIndex(row), cells: (rowObject?.entries ?? []).slice(0, GRID_COLUMNS) };
  });
  const columns = Math.min(recordedColumns, GRID_COLUMNS);
  const limited = entries.length > GRID_ROWS || recordedColumns > GRID_COLUMNS;
  const summary = uninspected
    ? `${entries.length} recorded rows, up to ${recordedColumns} recorded columns; full dimensions unknown`
    : `${entries.length} rows, up to ${recordedColumns} columns`;
  const notice = [
    limited ? `Display limit: showing the first ${rows.length} recorded rows and up to ${columns} recorded columns per row.` : '',
    uninspected ? 'Some rows or entries were not inspected; full dimensions are unknown.' : '',
  ].filter(Boolean).join(' ');
  return { rows, columns, summary, notice };
}
