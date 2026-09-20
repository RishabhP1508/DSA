/**
 * Graph visualizer.
 *
 * Reads an adjacency list held as a dict {node: [neighbours...]} (the shape the
 * curriculum uses) OR a dict {node: {neighbour: weight}} for weighted graphs.
 * Nodes are laid out on a circle so positions are stable and deterministic
 * across steps. Edge DIRECTION is stated explicitly by the binding
 * (`directed: true|false`), never inferred from whether a reverse edge is
 * present: a directed graph draws a reciprocal pair (u->v and v->u) as two
 * arrowheaded arcs; an undirected graph draws each pair once with no arrowhead.
 *
 * A `visited` set overlay shades visited nodes; a `frontier`/`queue`/`stack`
 * overlay (a list/set) outlines nodes currently on the frontier. A `current`
 * pointer overlay highlights the active node.
 */

import type { TraceEvent, TraceValue, VisualBinding } from "../core/types";
import { displayValue } from "../engine/replay";
import { resolveBindingObject, resolveVariable, deref } from "./helpers";

const R = 20;
const PAD = 40;

function keyToLabel(k: string): string {
  return k;
}

function collectMembers(event: TraceEvent, v: TraceValue | undefined): Set<string> {
  const out = new Set<string>();
  const obj = deref(event, v);
  if (!obj?.entries) return out;
  for (const e of obj.entries) {
    // sets/lists: value is the member; dict: key is the member
    if (obj.type === "dict") out.add(e.key);
    else out.add(displayValue(e.value, event.objects));
  }
  return out;
}

export function GraphVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { object: adj } = resolveBindingObject(event, binding);
  if (!adj || !adj.entries) return <p className="viz-empty">No graph “{binding.variable}” yet.</p>;

  // Nodes = keys of the adjacency dict.
  const nodeKeys = adj.entries.map((e) => e.key);
  const nodeIndex = new Map(nodeKeys.map((k, i) => [k, i]));

  type Edge = { u: string; v: string; directed: boolean; weight?: string };
  const rawEdges: { u: string; v: string; weight?: string }[] = [];
  for (const e of adj.entries) {
    const neigh = deref(event, e.value);
    if (!neigh?.entries) continue;
    if (neigh.type === "dict") {
      for (const ne of neigh.entries) rawEdges.push({ u: e.key, v: ne.key, weight: displayValue(ne.value, event.objects) });
    } else {
      for (const ne of neigh.entries) rawEdges.push({ u: e.key, v: displayValue(ne.value, event.objects) });
    }
  }

  // Direction is EXPLICIT (binding.directed), never inferred from the presence
  // of a reverse edge. In a directed graph a reciprocal pair (u→v and v→u) is
  // TWO arcs; only exact duplicate arcs are collapsed. In an undirected graph
  // each unordered pair is drawn once with no arrowhead.
  const directed = binding.directed === true;
  const seenPair = new Set<string>();
  const edges: Edge[] = [];
  for (const { u, v, weight } of rawEdges) {
    const key = directed ? `${u}->${v}` : [u, v].sort().join("~");
    if (seenPair.has(key)) continue;
    seenPair.add(key);
    edges.push({ u, v, directed, weight });
  }

  const visited = collectMembers(event, resolveVariable(event, findOverlaySource(binding, ["visited", "seen"])));
  const frontier = collectMembers(event, resolveVariable(event, findOverlaySource(binding, ["frontier", "queue", "stack", "stack_", "q"])));
  const currentVal = resolveVariable(event, findOverlaySource(binding, ["current", "node", "cur", "u"]));
  const current = currentVal && (currentVal.kind === "int" || currentVal.kind === "str") ? String(currentVal.value) : undefined;

  const N = Math.max(1, nodeKeys.length);
  const size = 130 + N * 18;
  const cxCenter = size / 2;
  const cyCenter = size / 2;
  const radius = size / 2 - PAD;
  const pos = (i: number) => {
    const ang = (2 * Math.PI * i) / N - Math.PI / 2;
    return { cx: cxCenter + radius * Math.cos(ang), cy: cyCenter + radius * Math.sin(ang) };
  };

  return (
    <svg className="array-viz" viewBox={`0 0 ${size} ${size + 24}`} role="img" aria-label={`Graph ${binding.variable} with ${nodeKeys.length} nodes and ${edges.length} edges`}>
      <defs>
        <marker id="g-arrow" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="arrow-head" />
        </marker>
      </defs>
      <text x={12} y={20} className="viz-title">{binding.variable} (graph, {nodeKeys.length} nodes)</text>

      {edges.map((e, i) => {
        const ui = nodeIndex.get(e.u);
        const vi = nodeIndex.get(e.v);
        if (ui === undefined || vi === undefined) return null;
        const a = pos(ui);
        const b = pos(vi);
        // shorten to node edge so arrowheads aren't hidden under circles
        const dx = b.cx - a.cx, dy = b.cy - a.cy;
        const len = Math.hypot(dx, dy) || 1;
        const bx = b.cx - (dx / len) * (R + 4);
        const by = b.cy - (dy / len) * (R + 4);
        return (
          <g key={i}>
            <line x1={a.cx} y1={a.cy} x2={bx} y2={by} className="graph-edge" markerEnd={e.directed ? "url(#g-arrow)" : undefined} />
            {e.weight !== undefined && (
              <text x={(a.cx + bx) / 2} y={(a.cy + by) / 2 - 4} className="edge-label">{e.weight}</text>
            )}
          </g>
        );
      })}

      {nodeKeys.map((k, i) => {
        const { cx, cy } = pos(i);
        const isVisited = visited.has(k);
        const isFrontier = frontier.has(k);
        const isCurrent = current === k;
        const cls = ["cell", "node-circle"];
        if (isCurrent) cls.push("cell-active");
        else if (isVisited) cls.push("node-visited");
        return (
          <g key={k}>
            <circle cx={cx} cy={cy} r={R} className={cls.join(" ")} strokeDasharray={isFrontier && !isCurrent ? "4 3" : undefined} />
            <text x={cx} y={cy + 4} className="cell-value-sm">{keyToLabel(k)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function findOverlaySource(binding: VisualBinding, roles: string[]): string {
  const o = (binding.overlays ?? []).find(
    (ov) => roles.includes(ov.source) || roles.some((r) => ov.label.toLowerCase().includes(r)),
  );
  return o?.source ?? roles[0];
}
