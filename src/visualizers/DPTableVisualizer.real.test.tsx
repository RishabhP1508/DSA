/**
 * R4 amendment #3: DP fill-progress must be visible on REAL curriculum lessons,
 * not just a synthetic fixture. These render DPTableVisualizer against actual
 * recorded trace states (captured from the bundled Pyodide) for a 1D lesson
 * (dp-tabulation) and a 2D lesson (dp-grid-paths), asserting the CURRENT cell
 * (the active i / j) is highlighted at an initial and a later transition.
 *
 * Written before the fix: the authored DP bindings carry no current-cell
 * overlay, so no cell is marked active on a real trace.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { DPTableVisualizer } from "./DPTableVisualizer";
import { dpTabulation } from "../content/lessons/dp-tabulation";
import { dpGridPaths } from "../content/lessons/dp-grid-paths";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import type { TraceEvent } from "../core/types";

afterEach(cleanup);

let tabEvents: TraceEvent[] = [];
let gridEvents: TraceEvent[] = [];

beforeAll(async () => {
  const tab = await runProgram(dpTabulation.code, dpTabulation.stdin ?? "");
  tabEvents = tab.events as TraceEvent[];
  const grid = await runProgram(dpGridPaths.code, dpGridPaths.stdin ?? "");
  gridEvents = grid.events as TraceEvent[];
}, 120_000);

/** Events where the given locals are all defined in some frame. */
function eventsWithLocals(events: TraceEvent[], names: string[]): TraceEvent[] {
  return events.filter((e) =>
    names.every((n) => e.frames.some((f) => f.locals.some((l) => l.name === n))),
  );
}
function localInt(e: TraceEvent, name: string): number | undefined {
  for (let i = e.frames.length - 1; i >= 0; i--) {
    const l = e.frames[i].locals.find((x) => x.name === name);
    if (l && l.value.kind === "int" && typeof l.value.value === "number") return l.value.value;
  }
  return undefined;
}

describe("DPTableVisualizer — 1D fill progress on a real lesson (dp-tabulation)", () => {
  it("highlights the current cell dp[i] at two different transitions", () => {
    const binding = dpTabulation.bindings.find((b) => b.model === "dp-table")!;
    expect(binding).toBeTruthy();
    const withI = eventsWithLocals(tabEvents, ["dp", "i"]);
    expect(withI.length).toBeGreaterThan(1);

    // Take an early and a later event where i differs.
    const early = withI[0];
    const later = withI[withI.length - 1];
    const iEarly = localInt(early, "i")!;
    const iLater = localInt(later, "i")!;
    expect(iLater).toBeGreaterThan(iEarly);

    for (const [ev, iVal] of [
      [early, iEarly],
      [later, iLater],
    ] as const) {
      const { container, unmount } = render(<DPTableVisualizer event={ev} binding={binding} />);
      const active = container.querySelectorAll("rect.cell-active");
      // Exactly one current cell, at index i.
      expect(active.length).toBe(1);
      // The active cell is the i-th (its index label matches iVal).
      const cells = Array.from(container.querySelectorAll("g"));
      const activeCellIndex = cells.findIndex((g) => g.querySelector("rect.cell-active"));
      expect(activeCellIndex).toBe(iVal);
      unmount();
    }
  });
});

// The 2D DP renderer lays cells out in row-major order at
//   x = PAD + c*(CELL+GAP),  y = TOP + r*(CELL+GAP)
// with PAD=16, TOP=44, CELL=46, GAP=3 (see DPTableVisualizer). Invert the active
// rect's coordinates to recover the highlighted (row, col).
const PAD = 16, TOP = 44, CELL = 46, GAP = 3;
function activeCellCoords(container: HTMLElement): { row: number; col: number } | null {
  const rect = container.querySelector("rect.cell-active");
  if (!rect) return null;
  const x = Number(rect.getAttribute("x"));
  const y = Number(rect.getAttribute("y"));
  const col = Math.round((x - PAD) / (CELL + GAP));
  const row = Math.round((y - TOP) / (CELL + GAP));
  return { row, col };
}

describe("DPTableVisualizer — 2D fill progress on a real lesson (dp-grid-paths)", () => {
  it("highlights dp[i][j] at TWO distinct steps, coords matching the trace i/j and changing", () => {
    const binding = dpGridPaths.bindings.find((b) => b.model === "dp-table")!;
    // Interior double loop events define both i and j.
    const withIJ = eventsWithLocals(gridEvents, ["dp", "i", "j"]);
    expect(withIJ.length).toBeGreaterThan(1);

    // Pick two events whose (i, j) differ.
    const first = withIJ[0];
    const firstIJ = { i: localInt(first, "i")!, j: localInt(first, "j")! };
    const second = withIJ.find(
      (e) => localInt(e, "i") !== firstIJ.i || localInt(e, "j") !== firstIJ.j,
    );
    expect(second).toBeTruthy();
    const secondIJ = { i: localInt(second!, "i")!, j: localInt(second!, "j")! };

    // The two steps are genuinely distinct cells.
    expect(`${secondIJ.i},${secondIJ.j}`).not.toBe(`${firstIJ.i},${firstIJ.j}`);

    for (const [ev, ij] of [
      [first, firstIJ],
      [second!, secondIJ],
    ] as const) {
      const { container, unmount } = render(<DPTableVisualizer event={ev} binding={binding} />);
      // Exactly one current cell.
      expect(container.querySelectorAll("rect.cell-active").length).toBe(1);
      // Its rendered row/col match the trace's i/j.
      const coords = activeCellCoords(container);
      expect(coords).toEqual({ row: ij.i, col: ij.j });
      unmount();
    }
  });
});
