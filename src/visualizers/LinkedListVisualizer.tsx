/**
 * Linked list visualizer (singly / doubly / circular).
 *
 * Starting from the bound head variable, it walks `next` refs, drawing each
 * node as a box (value + a next-pointer slot) with arrows between nodes. If a
 * `prev` field exists it draws back-arrows (doubly linked). Cycles are detected
 * by tracking visited object ids: a back-arrow to an earlier node marks a
 * circular list (or a fast/slow cycle) instead of looping forever.
 *
 * Pointer overlays (e.g. slow/fast, prev/curr) are matched by the object id a
 * pointer variable currently refers to, so they ride along the drawn nodes.
 */

import type { TraceEvent, TraceObject, VisualBinding } from "../core/types";
import { resolveBindingObject, resolveVariable, overlayColor } from "./helpers";
import { NODE_LIMIT, boundedSvgStyle, DiagramCaption, DiagramNotice, SvgLabel, bindingLabel, cellDisplay } from './limits';

const NODE_W = 74;
const NODE_H = 46;
const GAP = 44;
const PAD = 16;

function fieldValue(obj: TraceObject, name: string) {
  return obj.entries?.find((e) => e.key === name)?.value;
}

export function LinkedListVisualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  const { value: headValue, object: head } = resolveBindingObject(event, binding);
  if (!head) {
    if (headValue?.kind === 'none') return <p className="viz-empty"><code>{bindingLabel(binding)}</code> is None. There is no linked node to draw.</p>;
    return <p className="viz-empty">No node “{bindingLabel(binding)}” in scope yet (empty list?).</p>;
  }

  // Walk the chain, guarding against cycles.
  const nodes: { obj: TraceObject; id: string }[] = [];
  const seen = new Set<string>();
  let cur: TraceObject | undefined = head;
  let curId = valueId(event, binding);
  let cycleToIndex: number | null = null;
  const nextField = binding.fields?.next ?? 'next';
  const prevField = binding.fields?.previous ?? 'prev';
  const hasPrev = head.entries?.some((e) => e.key === prevField) ?? false;

  while (cur && curId && !seen.has(curId)) {
    seen.add(curId);
    nodes.push({ obj: cur, id: curId });
    const nextVal = fieldValue(cur, nextField);
    if (!nextVal || nextVal.kind !== "ref") break;
    const nextId = nextVal.id;
    if (seen.has(nextId)) {
      cycleToIndex = nodes.findIndex((n) => n.id === nextId);
      break;
    }
    cur = event.objects[nextId];
    curId = nextId;
    if (nodes.length >= NODE_LIMIT) break;
  }

  // Map pointer-overlay variables to node indices by object identity.
  const pointerMarks = (binding.overlays ?? [])
    .map((o) => {
      const v = resolveVariable(event, o.source);
      const idx = v && v.kind === "ref" ? nodes.findIndex((n) => n.id === v.id) : -1;
      return { label: o.label, idx };
    })
    .filter((m) => m.idx >= 0);

  const TOP = 36 + Math.max(1, pointerMarks.length) * 18;
  // Reserve a complete terminal-label slot after the final node.
  const width = PAD * 2 + nodes.length * (NODE_W + GAP) + 200;
  const height = TOP + NODE_H + 60;
  const x = (i: number) => PAD + i * (NODE_W + GAP);
  const midY = TOP + NODE_H / 2;
  const lastNext = fieldValue(nodes.at(-1)!.obj, nextField);
  const limited = nodes.length >= NODE_LIMIT && lastNext?.kind === 'ref' && !seen.has(lastNext.id);

  return (
    <><DiagramCaption><code>{bindingLabel(binding)}</code> · {hasPrev ? 'doubly' : 'singly'} linked · {nodes.length} displayed nodes{cycleToIndex !== null ? ' · cyclic' : ''}</DiagramCaption><svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      style={boundedSvgStyle(width, height)}
      aria-label={`${hasPrev ? "Doubly" : "Singly"} linked list ${bindingLabel(binding)} with ${nodes.length} nodes${cycleToIndex !== null ? ", contains a cycle" : ""}`}
    >
      <defs>
        <marker id="ll-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="arrow-head" />
        </marker>
      </defs>

      {nodes.map((n, i) => {
        const mark = pointerMarks.filter((m) => m.idx === i);
        const previous = fieldValue(n.obj, prevField);
        const previousIndex = previous?.kind === 'ref' ? nodes.findIndex(node => node.id === previous.id) : -1;
        return (
          <g key={n.id}>
            <rect x={x(i)} y={TOP} width={NODE_W} height={NODE_H} rx={6} className={mark.length ? "cell cell-active" : "cell"} />
            <line x1={x(i) + NODE_W * 0.7} y1={TOP} x2={x(i) + NODE_W * 0.7} y2={TOP + NODE_H} className="node-divider" />
            <SvgLabel x={x(i) + NODE_W * 0.35} y={midY} className="cell-value" maxChars={5} text={cellDisplay(binding.fields?.value ? fieldValue(n.obj,binding.fields.value) ?? {kind:'unknown',repr:'?'} : fieldValue(n.obj, "val") ?? fieldValue(n.obj, "value") ?? { kind: "unknown", repr: "?" }, event.objects).text}/>
            {/* forward arrow */}
            {i < nodes.length - 1 && (
              <line x1={x(i) + NODE_W} y1={midY} x2={x(i + 1)} y2={midY} className="ll-edge" markerEnd="url(#ll-arrow)" />
            )}
            {/* back arrow for doubly linked */}
            {previousIndex >= 0 && (previousIndex < i
              ? <line x1={x(i)} y1={midY + 10} x2={x(previousIndex) + NODE_W} y2={midY + 10} className="ll-edge-back" markerEnd="url(#ll-arrow)" />
              : <path d={cyclePath(x(i) + 12, TOP + NODE_H, x(previousIndex) + NODE_W - 12, TOP + NODE_H)} className="ll-edge-back" fill="none" markerEnd="url(#ll-arrow)" />)}
            {hasPrev && previous?.kind === 'none' && <text x={x(i)+NODE_W/2} y={TOP + NODE_H + 17} className="cell-index">prev: None</text>}
            {mark.map((m, k) => (
              <SvgLabel key={k} x={x(i) + NODE_W * 0.35} y={TOP - 12 - k * 18} className="pointer-label" fill={overlayColor(k)} text={`${m.label}↓`} maxChars={9}/>
            ))}
          </g>
        );
      })}

      {/* terminal or cycle indicator */}
      {cycleToIndex === null && lastNext?.kind === 'none' && <line x1={x(nodes.length-1)+NODE_W} y1={midY} x2={x(nodes.length)-20} y2={midY} className="ll-edge" markerEnd="url(#ll-arrow)"/>}
      {cycleToIndex === null ? (
        <text x={x(nodes.length)} y={midY + 5} className="cell-index" style={{textAnchor:'start'}}>
          {(() => { const next = fieldValue(nodes.at(-1)!.obj, nextField); return next?.kind === 'none' ? 'None' : next?.kind === 'ref' ? '… more nodes not shown' : 'next not recorded'; })()}
        </text>
      ) : (
        <path
          d={cyclePath(x(nodes.length - 1) + NODE_W * 0.85, TOP + NODE_H, x(cycleToIndex) + NODE_W * 0.5, TOP + NODE_H)}
          className="ll-edge cycle-edge"
          markerEnd="url(#ll-arrow)"
          fill="none"
        />
      )}
    </svg><DiagramNotice text={limited ? `Display limit: at most ${NODE_LIMIT} linked nodes are shown. Follow the object inspector for additional recorded nodes.` : ''}/></>
  );
}

function valueId(event: TraceEvent, binding: VisualBinding): string | undefined {
  const { value } = resolveBindingObject(event, binding);
  return value && value.kind === "ref" ? value.id : undefined;
}

function cyclePath(x1: number, y1: number, x2: number, y2: number): string {
  const dip = y1 + 34;
  return `M ${x1} ${y1} C ${x1} ${dip}, ${x2} ${dip}, ${x2} ${y2}`;
}
