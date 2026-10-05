/**
 * R9 / B1 batch — SEMANTIC trace/render check for the complexity lesson's `nums`
 * array binding. `best` holds a VALUE (the running maximum), not an index, and
 * the array renderer treats an overlay's source as an INDEX into the array. So a
 * `highlight: best` overlay mis-marks cells: on [3, 9, 2, 7] the value best=3
 * highlights index 3 (which holds 7), and best=9 is out of range entirely.
 *
 * This renders the ArrayVisualizer against the REAL recorded trace of the
 * complexity lesson and asserts the corrected (overlay-free) `nums` binding
 * highlights NO cell at any step. A POSITIVE CONTROL reconstructs the removed
 * bad overlay and proves it WOULD light a false cell on the same trace — so the
 * check has teeth.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { complexity } from "../content/lessons/complexity";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import type { TraceEvent, VisualBinding } from "../core/types";

afterEach(cleanup);

let events: TraceEvent[] = [];

beforeAll(async () => {
  const res = await runProgram(complexity.code, complexity.stdin ?? "");
  expect(res.status).toBe("completed");
  events = res.events as TraceEvent[];
}, 120_000);

/** Events in which `nums` is a bound list in some frame. */
function eventsWithNums(evs: TraceEvent[]): TraceEvent[] {
  return evs.filter((e) => e.frames.some((f) => f.locals.some((l) => l.name === "nums")));
}

describe("complexity — nums array binding never highlights a false position (real trace)", () => {
  it("the corrected nums binding marks NO cell active at ANY step", () => {
    const numsBinding = complexity.bindings.find((b) => b.variable === "nums")!;
    expect(numsBinding).toBeDefined();
    expect(numsBinding.overlays ?? []).toHaveLength(0);
    const relevant = eventsWithNums(events);
    expect(relevant.length).toBeGreaterThan(0);
    for (const ev of relevant) {
      const { container } = render(<ArrayVisualizer event={ev} binding={numsBinding} />);
      expect(container.querySelectorAll(".cell-active").length).toBe(0);
      expect(container.querySelectorAll(".pointer-label").length).toBe(0);
      cleanup();
    }
  });

  it("POSITIVE CONTROL: the removed 'highlight: best' overlay WOULD mark a false cell", () => {
    const badBinding: VisualBinding = {
      variable: "nums",
      model: "array",
      overlays: [{ role: "highlight", label: "best?", source: "best" }],
    };
    const relevant = eventsWithNums(events);
    let sawFalseHighlight = false;
    for (const ev of relevant) {
      const { container } = render(<ArrayVisualizer event={ev} binding={badBinding} />);
      if (container.querySelectorAll(".cell-active").length > 0) sawFalseHighlight = true;
      cleanup();
    }
    // best takes values 3 then 9 on [3,9,2,7]; best=3 lights index 3 (holds 7).
    expect(sawFalseHighlight).toBe(true);
  });
});
