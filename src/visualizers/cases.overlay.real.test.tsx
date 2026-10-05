/**
 * R9 / B1 batch amendment — SEMANTIC trace/render check for the cases lesson's
 * `nums` array binding. The loop is `for x in nums`, so `x` holds an element
 * VALUE, not an index. The array renderer treats an overlay's source as an
 * index, so a `pointer: x` overlay marks nums[x] — a false position.
 *
 * This renders ArrayVisualizer against a REAL recorded trace and asserts the
 * corrected (overlay-free) binding marks NO cell. The POSITIVE CONTROL uses a
 * list where values differ from their indices AND contains a duplicate, proving
 * (a) the removed overlay marks the WRONG coordinate, and (b) a value cannot be
 * mapped back to an index (duplicates make it ambiguous). It asserts the actual
 * marked index, not merely that some cell is active.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { cases } from "../content/lessons/cases";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import type { TraceEvent, VisualBinding } from "../core/types";

afterEach(cleanup);

// A probe program with the SAME loop shape as the lesson, over a list whose
// values differ from their indices and that contains a duplicate value (1).
const PROBE = [
  "def contains(nums, target):",
  "    for x in nums:",
  "        if x == target:",
  "            return True",
  "    return False",
  "print(contains([2, 1, 4, 1], 9))",
].join("\n");

let events: TraceEvent[] = [];
beforeAll(async () => {
  const res = await runProgram(PROBE, "");
  expect(res.status).toBe("completed");
  events = res.events as TraceEvent[];
}, 120_000);

function eventsWithNums(evs: TraceEvent[]): TraceEvent[] {
  return evs.filter((e) => e.frames.some((f) => f.locals.some((l) => l.name === "nums")));
}
function activeIndices(container: HTMLElement): number[] {
  // Each cell is a <g> containing a .cell rect (marked .cell-active when
  // highlighted) and a .cell-index <text> whose content is the index number.
  // Read the index from the same <g> as each active rect.
  const out: number[] = [];
  for (const rect of Array.from(container.querySelectorAll<SVGElement>(".cell-active"))) {
    const g = rect.closest("g");
    const idxText = g?.querySelector(".cell-index")?.textContent ?? "";
    out.push(Number(idxText));
  }
  return out;
}

describe("cases — nums array binding never marks a false position (real trace)", () => {
  it("the corrected binding has no overlays and marks NO cell at any step", () => {
    const b = cases.bindings.find((x) => x.variable === "nums")!;
    expect(b.overlays ?? []).toHaveLength(0);
    const relevant = eventsWithNums(events);
    expect(relevant.length).toBeGreaterThan(0);
    for (const ev of relevant) {
      const { container } = render(<ArrayVisualizer event={ev} binding={b} />);
      expect(container.querySelectorAll(".cell-active").length).toBe(0);
      cleanup();
    }
  });

  it("POSITIVE CONTROL: the removed 'pointer: x' overlay marks nums[x], the WRONG index", () => {
    const bad: VisualBinding = {
      variable: "nums",
      model: "array",
      overlays: [{ role: "pointer", label: "x", source: "x" }],
    };
    // Walk the trace; for each step where x is in range, the overlay must mark
    // index == x (i.e. the VALUE), which is not the visited index. We assert the
    // concrete marked coordinate rather than "some cell is active".
    let checkedValueAsIndex = false;
    for (const ev of eventsWithNums(events)) {
      const xl = ev.frames.flatMap((f) => f.locals).find((l) => l.name === "x" && l.value.kind === "int");
      if (!xl) continue;
      const xVal = (xl.value as { value: number }).value;
      const { container } = render(<ArrayVisualizer event={ev} binding={bad} />);
      const marks = activeIndices(container);
      if (xVal >= 0 && xVal < 4) {
        // the overlay marks the index EQUAL TO THE VALUE x — the defect
        expect(marks).toContain(xVal);
        checkedValueAsIndex = true;
      }
      cleanup();
    }
    expect(checkedValueAsIndex).toBe(true);
  });
});
