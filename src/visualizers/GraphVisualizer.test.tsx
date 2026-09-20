/**
 * R4 amendment: graph DIRECTION must be explicit (from the binding), not
 * inferred from the presence of a reverse edge. A reciprocal pair (u→v and
 * v→u) in a DIRECTED graph must render TWO directed arcs (two arrowheads), not
 * a single undirected edge.
 *
 * These are RENDERED-OUTPUT tests (they inspect the produced SVG), written
 * before the fix — the current renderer collapses reciprocal pairs to one
 * undirected edge.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { GraphVisualizer } from "./GraphVisualizer";
import type { TraceEvent, TraceObject, VisualBinding } from "../core/types";

afterEach(cleanup);

/** Build an event whose `g` is an adjacency dict {node: [neighbours]}. */
function graphEvent(adj: Record<string, number[]>): TraceEvent {
  const objects: Record<string, TraceObject> = {};
  const listId = (node: string) => `list_${node}`;
  const gEntries = Object.entries(adj).map(([node, neigh]) => {
    objects[listId(node)] = {
      id: listId(node),
      type: "list",
      entries: neigh.map((n, i) => ({ key: String(i), value: { kind: "int", value: n } })),
    };
    return { key: node, keyKind: "int" as const, value: { kind: "ref" as const, id: listId(node) } };
  });
  objects["g"] = { id: "g", type: "dict", entries: gEntries };
  return {
    index: 0,
    kind: "line",
    line: 1,
    frames: [{ name: "<module>", line: 1, locals: [{ name: "g", value: { kind: "ref", id: "g" } }] }],
    objects,
  };
}

function countArrows(container: HTMLElement): number {
  // Directed edges carry marker-end="url(#g-arrow)".
  return container.querySelectorAll('line[marker-end]').length;
}
function countEdges(container: HTMLElement): number {
  return container.querySelectorAll("line.graph-edge").length;
}

describe("GraphVisualizer — explicit direction (no inference from reverse edges)", () => {
  it("renders reciprocal arcs as TWO directed edges when the binding is directed", () => {
    const ev = graphEvent({ "0": [1], "1": [0] });
    const binding: VisualBinding = { variable: "g", model: "graph", directed: true };
    const { container } = render(<GraphVisualizer event={ev} binding={binding} />);
    // Two distinct directed arcs (0→1 and 1→0), each with an arrowhead.
    expect(countEdges(container)).toBe(2);
    expect(countArrows(container)).toBe(2);
  });

  it("renders a reciprocal pair as ONE undirected edge when the binding is undirected", () => {
    const ev = graphEvent({ "0": [1], "1": [0] });
    const binding: VisualBinding = { variable: "g", model: "graph", directed: false };
    const { container } = render(<GraphVisualizer event={ev} binding={binding} />);
    // One line, no arrowhead.
    expect(countEdges(container)).toBe(1);
    expect(countArrows(container)).toBe(0);
  });

  it("a directed one-way edge has exactly one arrow", () => {
    const ev = graphEvent({ "0": [1], "1": [] });
    const binding: VisualBinding = { variable: "g", model: "graph", directed: true };
    const { container } = render(<GraphVisualizer event={ev} binding={binding} />);
    expect(countEdges(container)).toBe(1);
    expect(countArrows(container)).toBe(1);
  });
});
