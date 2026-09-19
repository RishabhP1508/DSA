/**
 * Trie (prefix tree) visualizer.
 *
 * Walks a trie from the bound root. Each node is expected to hold a `children`
 * dict mapping a character to a child node, and a terminal flag (any of
 * `is_end`, `is_word`, `end`, `terminal`). Edges are labelled with the
 * character that leads to the child. Layout is a simple tiered tree.
 */

import type { TraceEvent, TraceObject, VisualBinding } from "../core/types";
import { resolveBindingObject } from "./helpers";

const R = 16;
const V_GAP = 62;
const H_GAP = 46;
const PAD = 24;
const TOP = 40;

const TERMINAL_KEYS = ["is_end", "is_word", "end", "terminal", "isEnd", "isWord"];

type Node = { id: string; obj: TraceObject; depth: number; order: number; terminal: boolean; edgeChar?: string };

function childrenOf(event: TraceEvent, obj: TraceObject): { ch: string; id: string }[] {
  const childrenVal = obj.entries?.find((e) => e.key === "children")?.value;
  if (!childrenVal || childrenVal.kind !== "ref") return [];
  const dict = event.objects[childrenVal.id];
  if (!dict?.entries) return [];
  return dict.entries
    .filter((e) => e.value.kind === "ref")
    .map((e) => ({ ch: e.key, id: (e.value as { id: string }).id }));
}

function isTerminal(obj: TraceObject): boolean {
  return TERMINAL_KEYS.some((k) => {
    const v = obj.entries?.find((e) => e.key === k)?.value;
    return v?.kind === "bool" && v.value === true;
  });
}

export function TrieVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { value: rootVal, object: root } = resolveBindingObject(event, binding);
  if (!root || rootVal?.kind !== "ref") {
    return <p className="viz-empty">No trie “{binding.variable}” in scope yet.</p>;
  }

  const nodes: Node[] = [];
  const edges: { from: string; to: string; ch: string }[] = [];
  const seen = new Set<string>();
  let order = 0;

  function walk(id: string, depth: number, edgeChar?: string) {
    if (seen.has(id)) return;
    seen.add(id);
    const obj = event.objects[id];
    if (!obj) return;
    const kids = childrenOf(event, obj);
    // place this node after visiting nothing (pre-order gives left-to-right)
    const myOrder = order++;
    nodes.push({ id, obj, depth, order: myOrder, terminal: isTerminal(obj), edgeChar });
    for (const k of kids) {
      edges.push({ from: id, to: k.id, ch: k.ch });
      walk(k.id, depth + 1, k.ch);
    }
  }
  walk(rootVal.id, 0);

  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const width = PAD * 2 + Math.max(1, order) * H_GAP;
  const height = TOP + (maxDepth + 1) * V_GAP + PAD;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const pos = (n: Node) => ({ cx: PAD + n.order * H_GAP + H_GAP / 2, cy: TOP + n.depth * V_GAP });

  return (
    <svg className="array-viz" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Trie ${binding.variable} with ${nodes.length} nodes`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (trie, {nodes.length} nodes)</text>
      {edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const pa = pos(a);
        const pb = pos(b);
        return (
          <g key={i}>
            <line x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy} className="tree-edge" />
            <text x={(pa.cx + pb.cx) / 2 + 6} y={(pa.cy + pb.cy) / 2} className="edge-label">{e.ch}</text>
          </g>
        );
      })}
      {nodes.map((n) => {
        const { cx, cy } = pos(n);
        return (
          <g key={n.id}>
            <circle cx={cx} cy={cy} r={R} className={n.terminal ? "cell cell-active node-circle" : "cell node-circle"} />
            {n.depth === 0 && <text x={cx} y={cy + 4} className="cell-index">•</text>}
            {n.depth > 0 && <text x={cx} y={cy + 4} className="cell-value-sm">{n.edgeChar}</text>}
          </g>
        );
      })}
    </svg>
  );
}
