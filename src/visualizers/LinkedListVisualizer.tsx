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
import { displayValue } from "../engine/replay";
import { resolveBindingObject, resolveVariable, overlayColor } from "./helpers";

const NODE_W = 74;
const NODE_H = 46;
const GAP = 44;
const PAD = 16;
const TOP = 52;

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
  const { object: head } = resolveBindingObject(event, binding);
  if (!head) {
    return <p className="viz-empty">No node “{binding.variable}” in scope yet (empty list?).</p>;
  }

  // Walk the chain, guarding against cycles.
  const nodes: { obj: TraceObject; id: string }[] = [];
  const seen = new Set<string>();
  let cur: TraceObject | undefined = head;
  let curId = valueId(event, binding);
  let cycleToIndex: number | null = null;
  const hasPrev = head.entries?.some((e) => e.key === "prev") ?? false;

  while (cur && curId && !seen.has(curId)) {
    seen.add(curId);
    nodes.push({ obj: cur, id: curId });
    const nextVal = fieldValue(cur, "next");
    if (!nextVal || nextVal.kind !== "ref") break;
    const nextId = nextVal.id;
    if (seen.has(nextId)) {
      cycleToIndex = nodes.findIndex((n) => n.id === nextId);
      break;
    }
    cur = event.objects[nextId];
    curId = nextId;
    if (nodes.length > 200) break; // safety
  }

  // Map pointer-overlay variables to node indices by object identity.
  const pointerMarks = (binding.overlays ?? [])
    .map((o) => {
      const v = resolveVariable(event, o.source);
      const idx = v && v.kind === "ref" ? nodes.findIndex((n) => n.id === v.id) : -1;
      return { label: o.label, idx };
    })
    .filter((m) => m.idx >= 0);

  const width = PAD * 2 + nodes.length * NODE_W + Math.max(0, nodes.length - 1) * GAP + 20;
  const height = TOP + NODE_H + 60;
  const x = (i: number) => PAD + i * (NODE_W + GAP);
  const midY = TOP + NODE_H / 2;

  return (
    <svg
      className="array-viz"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${hasPrev ? "Doubly" : "Singly"} linked list ${binding.variable} with ${nodes.length} nodes${cycleToIndex !== null ? ", contains a cycle" : ""}`}
    >
      <defs>
        <marker id="ll-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="arrow-head" />
        </marker>
      </defs>

      <text x={PAD} y={22} className="viz-title">
        {binding.variable} ({hasPrev ? "doubly" : "singly"} linked, {nodes.length}
        {cycleToIndex !== null ? ", cyclic" : ""})
      </text>

      {nodes.map((n, i) => {
        const mark = pointerMarks.filter((m) => m.idx === i);
        return (
          <g key={n.id}>
            <rect x={x(i)} y={TOP} width={NODE_W} height={NODE_H} rx={6} className={mark.length ? "cell cell-active" : "cell"} />
            <line x1={x(i) + NODE_W * 0.7} y1={TOP} x2={x(i) + NODE_W * 0.7} y2={TOP + NODE_H} className="node-divider" />
            <text x={x(i) + NODE_W * 0.35} y={midY + 5} className="cell-value">
              {displayValue(fieldValue(n.obj, "val") ?? fieldValue(n.obj, "value") ?? { kind: "unknown", repr: "?" }, event.objects)}
            </text>
            {/* forward arrow */}
            {i < nodes.length - 1 && (
              <line x1={x(i) + NODE_W} y1={midY} x2={x(i + 1)} y2={midY} className="ll-edge" markerEnd="url(#ll-arrow)" />
            )}
            {/* back arrow for doubly linked */}
            {hasPrev && i > 0 && (
              <line x1={x(i)} y1={midY + 10} x2={x(i - 1) + NODE_W} y2={midY + 10} className="ll-edge-back" markerEnd="url(#ll-arrow)" />
            )}
            {mark.map((m, k) => (
              <text key={k} x={x(i) + NODE_W * 0.35} y={TOP - 8 - k * 15} className="pointer-label" fill={overlayColor(k)}>
                {m.label}↓
              </text>
            ))}
          </g>
        );
      })}

      {/* terminal or cycle indicator */}
      {cycleToIndex === null ? (
        <text x={x(nodes.length)} y={midY + 5} className="cell-index">
          None
        </text>
      ) : (
        <path
          d={cyclePath(x(nodes.length - 1) + NODE_W * 0.85, TOP + NODE_H, x(cycleToIndex) + NODE_W * 0.5, TOP + NODE_H)}
          className="ll-edge cycle-edge"
          markerEnd="url(#ll-arrow)"
          fill="none"
        />
      )}
    </svg>
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
