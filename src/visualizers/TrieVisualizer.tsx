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
import { NODE_LIMIT, EDGE_LIMIT, DEPTH_LIMIT, boundedSvgStyle, DiagramNotice, labelDisplay, valueNotice } from './limits';

const R = 16;
const V_GAP = 62;
const H_GAP = 46;
const PAD = 24;
const TOP = 40;

const TERMINAL_KEYS = ["is_end", "is_word", "end", "terminal", "isEnd", "isWord"];

type Node = { id: string; obj: TraceObject; depth: number; order: number; terminal: boolean; edgeChar?: string };

function childrenOf(event: TraceEvent, obj: TraceObject, childField: string) {
  const childrenVal = obj.entries?.find((e) => e.key === childField)?.value;
  if (!childrenVal || childrenVal.kind !== "ref") return { children: [], uninspected: !!obj.truncated };
  const dict = event.objects[childrenVal.id];
  if (!dict?.entries) return { children: [], uninspected: true };
  return { uninspected: !!obj.truncated || !!dict.truncated, children: dict.entries
    .filter((e) => e.value.kind === "ref")
    .map((e) => ({ ch: e.key, id: (e.value as { id: string }).id })) };
}

function isTerminal(obj: TraceObject, terminalField?: string): boolean {
  return (terminalField ? [terminalField] : TERMINAL_KEYS).some((k) => {
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
  let limited = false;
  let uninspected = false;
  const omittedParents = new Set<string>();

  function walk(id: string, depth: number, edgeChar?: string): boolean {
    if (seen.has(id)) return true;
    if (seen.size >= NODE_LIMIT || depth >= DEPTH_LIMIT) { limited = true; return false; }
    const obj = event.objects[id];
    if (!obj) { uninspected = true; return false; }
    seen.add(id);
    const info = childrenOf(event, obj, binding.fields?.children ?? 'children');
    if (info.uninspected) { uninspected = true; omittedParents.add(id); }
    // place this node after visiting nothing (pre-order gives left-to-right)
    const myOrder = order++;
    nodes.push({ id, obj, depth, order: myOrder, terminal: isTerminal(obj,binding.fields?.terminal), edgeChar });
    for (const k of info.children) {
      if (edges.length >= EDGE_LIMIT) { limited = true; omittedParents.add(id); break; }
      // Reserve the edge before recursion, so descendant edges cannot consume
      // its slot and let ancestor returns exceed the global edge bound.
      edges.push({ from: id, to: k.id, ch: k.ch });
      if (!walk(k.id, depth + 1, k.ch)) { edges.pop(); omittedParents.add(id); }
    }
    return true;
  }
  walk(rootVal.id, 0);

  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const width = PAD * 2 + Math.max(1, order) * H_GAP;
  const height = TOP + (maxDepth + 1) * V_GAP + PAD;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edgeLabels = edges.map(edge => labelDisplay(edge.ch));
  const nodeLabels = nodes.map(node => labelDisplay(node.edgeChar ?? ''));
  const count = limited || uninspected ? `${nodes.length} displayed nodes (partial view; total unknown)` : `${nodes.length} nodes`;
  const pos = (n: Node) => ({ cx: PAD + n.order * H_GAP + H_GAP / 2, cy: TOP + n.depth * V_GAP });

  return (
    <><svg className="array-viz" style={boundedSvgStyle(width, height)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Trie ${binding.variable} with ${count}`}>
      <text x={PAD} y={22} className="viz-title">{binding.variable} (trie, {count})</text>
      {edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const pa = pos(a);
        const pb = pos(b);
        return (
          <g key={i}>
            <line x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy} className="tree-edge" />
            <text x={(pa.cx + pb.cx) / 2 + 6} y={(pa.cy + pb.cy) / 2} className="edge-label">{edgeLabels[i].text}</text>
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const { cx, cy } = pos(n);
        return (
          <g key={n.id} data-node={n.id}>
            <circle cx={cx} cy={cy} r={R} className={n.terminal ? "cell cell-active node-circle" : "cell node-circle"} />
            {n.depth === 0 && <text x={cx} y={cy + 4} className="cell-index">•</text>}
            {n.depth > 0 && <text x={cx} y={cy + 4} className="cell-value-sm">{nodeLabels[i].text}</text>}
            {omittedParents.has(n.id) && <text x={cx + R + 8} y={cy + 4} className="cell-index" aria-label="Some child data is omitted">…</text>}
          </g>
        );
      })}
    </svg><DiagramNotice text={[limited ? `Display limit: at most ${NODE_LIMIT} nodes, ${EDGE_LIMIT} edges and ${DEPTH_LIMIT} levels; some recorded branches are omitted.` : '', uninspected ? 'Some node or children-map entries were not inspected; the full trie is unknown.' : '', valueNotice([...edgeLabels, ...nodeLabels])].filter(Boolean).join(' ')}/></>
  );
}
