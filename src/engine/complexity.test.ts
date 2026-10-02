// @vitest-environment node
/**
 * R7.2 — observed-statistics correctness.
 *
 * Locks in the honest category separation: the module-entry `call` event is NOT
 * a user-function call; active depth excludes the module frame; metrics can be
 * computed cumulatively up to a playback position as well as whole-run.
 */
import { describe, it, expect } from "vitest";
import {
  computeObservedStats,
  userFunctionCalls,
  maxCallDepth,
  lineEntries,
  activeDepthAt,
} from "./complexity";
import type { RunResult, TraceEvent, TraceFrame } from "../core/types";

function frame(name: string, line: number): TraceFrame {
  return { name, line, locals: [] };
}
function ev(
  index: number,
  kind: TraceEvent["kind"],
  line: number,
  frames: TraceFrame[],
): TraceEvent {
  return { index, kind, line, frames, objects: {} };
}

// A run: enter module, one line, call user fn f (which calls itself once), lines.
const events: TraceEvent[] = [
  ev(0, "call", 1, [frame("<module>", 1)]),
  ev(1, "line", 1, [frame("<module>", 1)]),
  ev(2, "call", 5, [frame("<module>", 1), frame("f", 5)]),
  ev(3, "line", 6, [frame("<module>", 1), frame("f", 6)]),
  ev(4, "call", 5, [frame("<module>", 1), frame("f", 6), frame("f", 5)]),
  ev(5, "line", 6, [frame("<module>", 1), frame("f", 6), frame("f", 6)]),
  ev(6, "return", 6, [frame("<module>", 1), frame("f", 6), frame("f", 6)]),
  ev(7, "return", 6, [frame("<module>", 1), frame("f", 6)]),
];
const result = { status: "completed", events } as unknown as RunResult;

describe("observed stats (R7.2)", () => {
  it("excludes the module-entry call from user-function calls", () => {
    // 3 `call` events, but one is <module> entry -> 2 user calls.
    expect(userFunctionCalls(result)).toBe(2);
  });

  it("reports active depth excluding the module frame", () => {
    // Deepest event has frames [module, f, f] -> active depth 2.
    expect(maxCallDepth(result)).toBe(2);
    expect(activeDepthAt(ev(9, "line", 1, [frame("<module>", 1)]))).toBe(0);
  });

  it("counts line entries distinctly from trace events", () => {
    expect(lineEntries(result)).toBe(3);
    const s = computeObservedStats(result);
    expect(s.traceEvents).toBe(8);
    expect(s.lineEntries).toBe(3);
    expect(s.userFunctionCalls).toBe(2);
    expect(s.maxDepth).toBe(2);
  });

  it("computes cumulative metrics up to a playback position", () => {
    // Up to index 3 (before the second call): only 1 user call so far.
    expect(userFunctionCalls(result, 3)).toBe(1);
    const s = computeObservedStats(result, [], 3);
    expect(s.userFunctionCalls).toBe(1);
    expect(s.traceEvents).toBe(4);
    // Whole run is unchanged.
    expect(computeObservedStats(result).userFunctionCalls).toBe(2);
  });

  it("evaluates authored operation counters (up to a position)", () => {
    const counter = { label: "f body", definition: "line 6 runs", countLines: [6] };
    const s = computeObservedStats(result, [counter]);
    expect(s.counters[0].value).toBe(2); // line 6 ran twice
    const partial = computeObservedStats(result, [counter], 3);
    expect(partial.counters[0].value).toBe(1);
  });
});
