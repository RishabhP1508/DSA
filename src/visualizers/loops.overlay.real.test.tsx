/**
 * R9 / B1 finding 4 (deepened) — a SEMANTIC trace/render check for the loops
 * `nums` array binding, not merely "does the overlay source name a variable".
 *
 * The weaker guard (overlay source appears in the source code) would have PASSED
 * the original bug: the false pointer was `source: "i"`, and `i` IS a real
 * variable in the loops program (the while-counter). So this test renders the
 * ArrayVisualizer against the REAL recorded trace of the loops lesson and asserts
 * the array shows NO highlighted cell at any step — the property that actually
 * matters.
 *
 * It also includes a POSITIVE CONTROL: the old bad binding
 * ({ role: "pointer", source: "i" }) WOULD highlight a cell of `nums` on this
 * same trace. That proves the check has teeth — it fails for the old bug and
 * passes for the corrected (overlay-free) binding.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { loops } from "../content/lessons/loops";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import type { TraceEvent, VisualBinding } from "../core/types";

afterEach(cleanup);

let events: TraceEvent[] = [];

beforeAll(async () => {
  const res = await runProgram(loops.code, loops.stdin ?? "");
  expect(res.status).toBe("completed");
  events = res.events as TraceEvent[];
}, 120_000);

/** Events in which `nums` is a bound list in some frame. */
function eventsWithNums(evs: TraceEvent[]): TraceEvent[] {
  return evs.filter((e) => e.frames.some((f) => f.locals.some((l) => l.name === "nums")));
}

describe("loops — nums array binding never highlights a false position (real trace)", () => {
  it("the authored nums binding marks NO cell active at ANY step", () => {
    const numsBinding = loops.bindings.find((b) => b.variable === "nums")!;
    expect(numsBinding).toBeDefined();
    const relevant = eventsWithNums(events);
    expect(relevant.length).toBeGreaterThan(0);

    for (const ev of relevant) {
      const { container } = render(<ArrayVisualizer event={ev} binding={numsBinding} />);
      // No highlighted cell and no pointer label anywhere in the array view.
      expect(container.querySelectorAll(".cell-active").length).toBe(0);
      expect(container.querySelectorAll(".pointer-label").length).toBe(0);
      cleanup();
    }
  });

  it("POSITIVE CONTROL: the OLD bad overlay (source 'i') WOULD highlight a cell", () => {
    // Reconstruct the exact binding the bug used and prove it marks a false
    // position on the real trace — i.e. the semantic check genuinely detects it.
    const badBinding: VisualBinding = {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "x-index", source: "i" }],
    };
    const relevant = eventsWithNums(events);
    let sawFalseHighlight = false;
    for (const ev of relevant) {
      const iLocal = ev.frames
        .flatMap((f) => f.locals)
        .find((l) => l.name === "i" && l.value.kind === "int");
      // Only steps where the while-counter i is in range [0, len(nums)) light a cell.
      const { container } = render(<ArrayVisualizer event={ev} binding={badBinding} />);
      if (container.querySelectorAll(".cell-active").length > 0) sawFalseHighlight = true;
      cleanup();
      void iLocal;
    }
    expect(sawFalseHighlight).toBe(true);
  });
});
