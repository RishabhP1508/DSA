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
import { resolveBindingObject, resolveVariable, deref } from "./helpers";
import { DiagramNotice, boundedSvgStyle, cellDisplay } from './limits';

const R = 20;
const PAD = 40;
const NODE_LIMIT = 128;
const EDGE_LIMIT = 256;

/** Python equal int/float/bool keys denote the same graph vertex. */
function numericIdentity(key: string, kind: string): string {
  if (kind === 'bool') return key === 'True' ? '1' : '0';
  if (kind === 'float') {
    const number = Number(key);
    return Number.isFinite(number) && Number.isInteger(number) ? BigInt(number).toString() : String(number);
  }
  if (key.length < 4096 && /^-?(?:\d+|0x[\da-f]+)$/i.test(key)) {
    try { return (key.startsWith('-0x') ? -BigInt(key.slice(1)) : BigInt(key)).toString(); } catch { /* retain recorded text */ }
  }
  return key;
}

function keyToLabel(k: string): string {
  return k;
}

export function GraphVisualizer({ event, binding }: { event: TraceEvent; binding: VisualBinding }) {
  const { object: adj } = resolveBindingObject(event, binding);
  if (!adj || !adj.entries) return <p className="viz-empty">No graph “{binding.variable}” yet.</p>;

  type Edge = { u: string; v: string; directed: boolean; weight?: string };
  const labels = new Map<string,string>();
  let omitted = !!adj.truncated || adj.entries.length > NODE_LIMIT;
  function keyNode(key: string, kind = 'str'): string {
    const id = ['int', 'float', 'bool'].includes(kind) ? 'num:' + numericIdentity(key, kind) : kind + ':' + key;
    if (!labels.has(id)) {
      if (labels.size < NODE_LIMIT) labels.set(id, kind === 'str' ? cellDisplay({kind:'str',value:key},event.objects).text : key.slice(0,96) + (key.length>96?'…':''));
      else omitted = true;
    }
    return id;
  }
  function valueNode(value: TraceValue): string {
    if (value.kind === 'int' || value.kind === 'float') return keyNode(String(value.value), value.kind);
    if (value.kind === 'str') return keyNode(value.value, 'str');
    if (value.kind === 'bool') return keyNode(value.value ? 'True' : 'False', 'bool');
    if (value.kind === 'none') return keyNode('None', 'none');
    return keyNode(cellDisplay(value,event.objects).text, 'object');
  }
  for (const entry of adj.entries.slice(0,NODE_LIMIT)) keyNode(entry.key, entry.keyKind);
  const rawEdges: { u: string; v: string; weight?: string }[] = [];
  outer: for (const entry of adj.entries.slice(0,NODE_LIMIT)) {
    const u = keyNode(entry.key, entry.keyKind);
    const neighbors = deref(event, entry.value);
    if (!neighbors?.entries) continue;
    omitted ||= !!neighbors.truncated;
    if (neighbors.type === 'dict' || binding.adjacencyFormat === 'weighted-map') {
      for (const next of neighbors.entries) {
        if (rawEdges.length >= EDGE_LIMIT) { omitted = true; break outer; }
        rawEdges.push({u, v:keyNode(next.key,next.keyKind), weight:cellDisplay(next.value,event.objects).text});
      }
    } else {
      for (const next of neighbors.entries) {
        if (rawEdges.length >= EDGE_LIMIT) { omitted = true; break outer; }
        const pair = binding.adjacencyFormat === 'weighted-pairs' ? deref(event,next.value) : undefined;
        if (pair?.entries?.length === 2) rawEdges.push({u, v:valueNode(pair.entries[0].value), weight:cellDisplay(pair.entries[1].value,event.objects).text});
        else if (binding.adjacencyFormat !== 'weighted-pairs') rawEdges.push({u,v:valueNode(next.value)});
      }
    }
  }
  // Destination-only sinks are part of the graph even without a dict entry.
  const nodeKeys = [...labels.keys()];
  const nodeIndex = new Map(nodeKeys.map((key,index)=>[key,index]));

  // Direction is EXPLICIT (binding.directed), never inferred from the presence
  // of a reverse edge. In a directed graph a reciprocal pair (u→v and v→u) is
  // TWO arcs; only exact duplicate arcs are collapsed. In an undirected graph
  // each unordered pair is drawn once with no arrowhead.
  const directed = binding.directed === true;
  const seenPair = new Set<string>();
  const edges: Edge[] = [];
  for (const { u, v, weight } of rawEdges) {
    const key = JSON.stringify([directed ? [u,v] : [u,v].sort(),weight]);
    if (seenPair.has(key)) continue;
    seenPair.add(key);
    edges.push({ u, v, directed, weight });
  }

  function members(value: TraceValue | undefined) {
    const object = deref(event,value);
    return new Set((object?.entries ?? []).map(entry=>object?.type === 'dict' ? keyNode(entry.key,entry.keyKind) : valueNode(entry.value)));
  }
  const visited = members(resolveVariable(event, findOverlaySource(binding, ['visited','seen'])));
  const frontier = members(resolveVariable(event, findOverlaySource(binding, ['frontier','queue','stack','stack_','q'])));
  const currentVal = resolveVariable(event,findOverlaySource(binding,['current','node','cur','u']));
  const current = currentVal ? valueNode(currentVal) : undefined;

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
    <><DiagramNotice text={omitted ? 'Display limit: showing a recorded graph prefix, at most 128 nodes and 256 adjacency entries. Other nodes or edges are omitted or were not inspected; this is not the full graph.' : ''}/>
    <svg className="array-viz" style={boundedSvgStyle(size+64,size+72)} viewBox={`-32 -40 ${size + 64} ${size + 72}`} role="img" aria-label={omitted ? `Graph ${binding.variable}: partial diagram, ${nodeKeys.length} displayed nodes and ${edges.length} displayed edges` : `Graph ${binding.variable} with ${nodeKeys.length} nodes and ${edges.length} edges`}>
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
            {e.u === e.v
              ? <path d={`M ${a.cx - 12} ${a.cy - 16} C ${a.cx - 45} ${a.cy - 68}, ${a.cx + 45} ${a.cy - 68}, ${a.cx + 12} ${a.cy - 16}`} className="graph-edge" fill="none" markerEnd={e.directed ? "url(#g-arrow)" : undefined} />
              : <line x1={a.cx} y1={a.cy} x2={bx} y2={by} className="graph-edge" markerEnd={e.directed ? "url(#g-arrow)" : undefined} />}
            {e.weight !== undefined && (
              <text x={(a.cx + bx) / 2} y={(a.cy + by) / 2 - 4} className="edge-label">{e.weight}</text>
            )}
          </g>
        );
      })}

      {nodeKeys.map((k, i) => {
        const { cx, cy } = pos(i);
        const label = labels.get(k)!;
        const isVisited = visited.has(k);
        const isFrontier = frontier.has(k);
        const isCurrent = current === k;
        const cls = ["cell", "node-circle"];
        if (isCurrent) cls.push("cell-active");
        else if (isVisited) cls.push("node-visited");
        return (
          <g key={k}>
            <circle cx={cx} cy={cy} r={R} className={cls.join(" ")} strokeDasharray={isFrontier && !isCurrent ? "4 3" : undefined} />
            <text x={cx} y={cy + 4} className="cell-value-sm">{keyToLabel(label)}</text>
          </g>
        );
      })}
    </svg></>
  );
}

function findOverlaySource(binding: VisualBinding, roles: string[]): string {
  const o = (binding.overlays ?? []).find(
    (ov) => roles.includes(ov.source) || roles.some((r) => ov.label.toLowerCase().includes(r)),
  );
  return o?.source ?? roles[0];
}
