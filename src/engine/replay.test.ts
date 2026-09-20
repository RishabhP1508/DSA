/**
 * R4.3 replay tests: exact forward/backward stepping without rerunning, a
 * zero-event result (no "step 1 of 0"), and the pure play/breakpoint stepping
 * logic the useEngine play timer relies on.
 *
 * Written before the fix: `Replay` exists but `nextPlayIndex` (breakpoint-aware
 * advance) does not yet, and there is no explicit zero-event helper.
 */
import { describe, it, expect } from "vitest";
import { Replay, nextPlayIndex, isBreakpointStop } from "./replay";
import type { RunResult, TraceEvent, TraceEventKind } from "../core/types";

function ev(index: number, line: number, kind: TraceEventKind = "line"): TraceEvent {
  return { index, kind, line, frames: [], objects: {} };
}

function result(events: TraceEvent[]): RunResult {
  return { runId: 1, status: "completed", events, stdout: "", stderr: "" };
}

describe("Replay — exact stepping", () => {
  it("steps forward and backward over recorded events without rerunning", () => {
    const r = new Replay(result([ev(0, 1), ev(1, 2), ev(2, 3)]));
    expect(r.position).toBe(0);
    expect(r.next()?.index).toBe(1);
    expect(r.next()?.index).toBe(2);
    expect(r.next()?.index).toBe(2); // clamped at end
    expect(r.atEnd).toBe(true);
    expect(r.prev()?.index).toBe(1);
    expect(r.prev()?.index).toBe(0);
    expect(r.prev()?.index).toBe(0); // clamped at start
    expect(r.atStart).toBe(true);
    r.seek(2);
    expect(r.position).toBe(2);
    r.restart();
    expect(r.position).toBe(0);
  });
});

describe("Replay — zero-event result (no 'step 1 of 0')", () => {
  it("reports length 0 and a safe position for an empty trace", () => {
    const r = new Replay(result([]));
    expect(r.length).toBe(0);
    // position stays 0 and current is undefined; the workspace uses length===0
    // to show "no steps recorded" instead of "step 1 / 0".
    expect(r.current).toBeUndefined();
    expect(r.next()).toBeUndefined();
    expect(r.position).toBe(0);
  });
});

// A realistic call/line/return sequence for `f()` defined at line 1 that runs
// two body lines (2, 3) and returns, then a top-level line 5.
//   idx0 line1  call     (entering <module>)
//   idx1 line5  line     (about to call f — reported at the call site)
//   idx2 line1  call     (entering f)
//   idx3 line2  line     (executable body line 2)
//   idx4 line3  line     (executable body line 3)
//   idx5 line3  return    (f returns; reported at line 3)
//   idx6 line5  line     (back at module line 5)
const realSeq: TraceEvent[] = [
  ev(0, 1, "call"),
  ev(1, 5, "line"),
  ev(2, 1, "call"),
  ev(3, 2, "line"),
  ev(4, 3, "line"),
  ev(5, 3, "return"),
  ev(6, 5, "line"),
];

describe("nextPlayIndex — single-step advance", () => {
  it("advances by one and returns null at the end", () => {
    expect(nextPlayIndex(realSeq, 0, new Set())).toBe(1);
    expect(nextPlayIndex(realSeq, 5, new Set())).toBe(6);
    expect(nextPlayIndex(realSeq, 6, new Set())).toBeNull();
  });
});

describe("isBreakpointStop — triggers only at the intended EXECUTABLE line event", () => {
  it("pauses at a `line` event whose line is a breakpoint", () => {
    expect(isBreakpointStop(realSeq[3], new Set([2]))).toBe(true); // idx3 line2 line
    expect(isBreakpointStop(realSeq[4], new Set([3]))).toBe(true); // idx4 line3 line
  });

  it("does NOT pause on a call event that merely reports a breakpoint line", () => {
    // idx2 is a `call` at line 1; a breakpoint on line 1 must not trap the call.
    expect(isBreakpointStop(realSeq[2], new Set([1]))).toBe(false);
  });

  it("does NOT pause on a return event that reports a breakpoint line", () => {
    // idx5 is a `return` reported at line 3; a line-3 breakpoint targets the
    // executable line-3 event (idx4), not the return.
    expect(isBreakpointStop(realSeq[5], new Set([3]))).toBe(false);
  });

  it("does not pause when the line is not a breakpoint", () => {
    expect(isBreakpointStop(realSeq[3], new Set([99]))).toBe(false);
  });
});

describe("play loop over a realistic sequence stops at the intended breakpoint", () => {
  // Simulate the useEngine timer: advance, then pause if the landed event is a
  // breakpoint stop.
  function playFrom(from: number, breakpoints: Set<number>): number {
    let pos = from;
    for (;;) {
      const nxt = nextPlayIndex(realSeq, pos, breakpoints);
      if (nxt == null) return pos; // reached the end
      pos = nxt;
      if (isBreakpointStop(realSeq[pos], breakpoints)) return pos;
    }
  }

  it("plays to the executable line-3 event (idx4), not the line-3 return (idx5)", () => {
    expect(playFrom(0, new Set([3]))).toBe(4);
  });

  it("plays to the end when no breakpoints are set", () => {
    expect(playFrom(0, new Set())).toBe(realSeq.length - 1);
  });

  it("resumes past a breakpoint it is already sitting on", () => {
    // Already at idx4 (line 3 breakpoint); playing again continues to the end
    // (no further line-3 line events).
    expect(playFrom(4, new Set([3]))).toBe(realSeq.length - 1);
  });
});
