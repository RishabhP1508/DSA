/**
 * Binary tree visualizer.
 *
 * Walks node objects via `left`/`right` refs from the bound root, assigning x by
 * in-order position and y by depth so positions stay stable and siblings never
 * overlap. Node values come from `val` (or `value`). Pointer overlays (by object
 * identity) highlight the current node during a traversal.
 *
 * Cycles (which shouldn't occur in a valid tree, but might mid-construction) are
 * guarded by a visited set.
 */

import type { TraceEvent, TraceObject, TraceValue, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import { resolveBindingObject, resolveVariable, overlayColor } from "./helpers";

const R = 18;
const V_GAP = 60;
const H_GAP = 40;
const PAD = 24;
const TOP = 40;

type Placed = { id: string; obj: TraceObject; depth: number; order: number };

function field(obj: TraceObject, name: string): TraceValue | undefined {
  return obj.entries?.find((e) => e.key === name)?.value;
}

export function TreeVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { value: rootVal, object: root } = resolveBindingObject(event, binding);
  if (!root || rootVal?.kind !== "ref") {
    return <p className="viz-empty">No tree “{binding.variable}” in scope yet.</p>;
  }

  const placed: Placed[] = [];
  const seen = new Set<string>();
  let orderCounter = 0;
  const edges: { from: string; to: string }[] = [];

  // In-order walk assigns horizontal order; recursion depth bounded by seen.
  function walk(id: string, depth: number) {
    if (seen.has(id)) return;
    seen.add(id);
    const obj = event.objects[id];
    if (!obj) return;
    const leftV = field(obj, "left");
    const rightV = field(obj, "right");
    if (leftV?.kind === "ref") {
      edges.push({ from: id, to: leftV.id });
      walk(leftV.id, depth + 1);
    }
    placed.push({ id, obj, depth, order: orderCounter++ });
    if (rightV?.kind === "ref") {
      edges.push({ from: id, to: rightV.id });
      walk(rightV.id, depth + 1);
    }
  }
  walk(rootVal.id, 0);

  const maxDepth = placed.reduce((m, p) => Math.max(m, p.depth), 0);
  const width = PAD * 2 + Math.max(1, orderCounter) * H_GAP;
  const height = TOP + (maxDepth + 1) * V_GAP + PAD;
  const pos = (p: Placed) => ({ cx: PAD + p.order * H_GAP + H_GAP / 2, cy: TOP + p.depth * V_GAP });
  const byId = new Map(placed.map((p) => [p.id, p]));

  const pointerMarks = (binding.overlays ?? [])
    .map((o) => {
      const v = resolveVariable(event, o.source);
      return { label: o.label, id: v && v.kind === "ref" ? v.id : "" };
    })
    .filter((m) => byId.has(m.id));

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Binary tree ${binding.variable} with ${placed.length} nodes`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (tree, {placed.length} nodes)</text>

      {edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const pa = pos(a);
        const pb = pos(b);
        return <line key={i} x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy} className="tree-edge" />;
      })}

      {placed.map((p) => {
        const { cx, cy } = pos(p);
        const marks = pointerMarks.filter((m) => m.id === p.id);
        return (
          <g key={p.id}>
            <circle cx={cx} cy={cy} r={R} className={marks.length ? "cell cell-active node-circle" : "cell node-circle"} />
            <text x={cx} y={cy + 4} className="cell-value-sm">
              {displayValue(field(p.obj, "val") ?? field(p.obj, "value") ?? { kind: "unknown", repr: "?" }, event.objects)}
            </text>
            {marks.map((m, k) => (
              <text key={k} x={cx} y={cy - R - 4 - k * 14} className="pointer-label" fill={overlayColor(k)}>{m.label}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
