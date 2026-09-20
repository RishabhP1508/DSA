/**
 * R4 amendment: DP "computed" styling must come from actual state or authored
 * metadata — NOT from a cell merely being non-None. A zero-initialised table
 * ([0,0,0]) must render with NO cells marked computed/filled unless a
 * `computedSource` (or the current-index overlay) says so.
 *
 * RENDERED-OUTPUT tests written before the fix — the current renderer marks
 * every non-None cell `.cell-filled`.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { DPTableVisualizer } from "./DPTableVisualizer";
import type { TraceEvent, TraceObject, TraceValue, VisualBinding } from "../core/types";

afterEach(cleanup);

/** Build an event with a 1D dp list and optional extra locals. */
function dp1dEvent(values: number[], extraLocals: { name: string; value: TraceValue }[] = []): TraceEvent {
  const objects: Record<string, TraceObject> = {
    dp: {
      id: "dp",
      type: "list",
      entries: values.map((v, i) => ({ key: String(i), value: { kind: "int", value: v } })),
    },
  };
  return {
    index: 0,
    kind: "line",
    line: 1,
    frames: [
      {
        name: "<module>",
        line: 1,
        locals: [{ name: "dp", value: { kind: "ref", id: "dp" } }, ...extraLocals],
      },
    ],
    objects,
  };
}

function filledCount(container: HTMLElement): number {
  return container.querySelectorAll("rect.cell-filled").length;
}
function activeCount(container: HTMLElement): number {
  return container.querySelectorAll("rect.cell-active").length;
}

describe("DPTableVisualizer — computed styling only from state/metadata", () => {
  it("marks NO cells computed for a zero-initialised table with no metadata", () => {
    const ev = dp1dEvent([0, 0, 0]);
    const binding: VisualBinding = { variable: "dp", model: "dp-table" };
    const { container } = render(<DPTableVisualizer event={ev} binding={binding} />);
    expect(filledCount(container)).toBe(0);
  });

  it("marks only the cells listed by an authored computedSource", () => {
    // computed = {0, 1}; a set object referenced by the binding.
    const ev = dp1dEvent([1, 1, 0], []);
    ev.objects["computed"] = {
      id: "computed",
      type: "set",
      entries: [
        { key: "0", value: { kind: "int", value: 0 } },
        { key: "1", value: { kind: "int", value: 1 } },
      ],
    };
    ev.frames[0].locals.push({ name: "computed", value: { kind: "ref", id: "computed" } });
    const binding: VisualBinding = { variable: "dp", model: "dp-table", computedSource: "computed" };
    const { container } = render(<DPTableVisualizer event={ev} binding={binding} />);
    // Exactly the two authored indices are shaded computed.
    expect(filledCount(container)).toBe(2);
  });

  it("still highlights the current index from an overlay (actual state)", () => {
    const ev = dp1dEvent([0, 0, 0], [{ name: "i", value: { kind: "int", value: 1 } }]);
    const binding: VisualBinding = {
      variable: "dp",
      model: "dp-table",
      overlays: [{ role: "pointer", label: "i", source: "i" }],
    };
    const { container } = render(<DPTableVisualizer event={ev} binding={binding} />);
    expect(activeCount(container)).toBe(1); // the current cell
    expect(filledCount(container)).toBe(0); // but nothing is "computed" without metadata
  });
});
