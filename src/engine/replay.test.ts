/**
 * R4.3 replay tests: exact forward/backward stepping without rerunning, a
 * zero-event result (no "step 1 of 0"), and the pure play/breakpoint stepping
 * logic the useEngine play timer relies on.
 *
 * Written before the fix: `Replay` exists but `nextPlayIndex` (breakpoint-aware
 * advance) does not yet, and there is no explicit zero-event helper.
 */
import { describe, it, expect } from "vitest";
import { Replay, nextPlayIndex } from "./replay";
import type { RunResult, TraceEvent } from "../core/types";

function ev(index: number, line: number): TraceEvent {
  return { index, kind: "line", line, frames: [], objects: {} };
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

describe("nextPlayIndex — breakpoint-aware advance (playback breakpoints)", () => {
  const events = [ev(0, 1), ev(1, 2), ev(2, 3), ev(3, 2), ev(4, 5)];

  it("advances by one when no breakpoints are set", () => {
    expect(nextPlayIndex(events, 0, new Set())).toBe(1);
    expect(nextPlayIndex(events, 3, new Set())).toBe(4);
  });

  it("returns null at the end (nothing more to play)", () => {
    expect(nextPlayIndex(events, 4, new Set())).toBeNull();
  });

  it("stops BEFORE an event whose line is a breakpoint", () => {
    // Breakpoint on line 3 (event index 2). Playing from index 0 should stop at
    // index 2 (the breakpoint event), reached by normal single-step advance.
    expect(nextPlayIndex(events, 1, new Set([3]))).toBe(2);
  });

  it("does not immediately re-trigger the same breakpoint when already on it", () => {
    // Sitting on the breakpoint event (index 2, line 3); pressing play again
    // must move past it (to the next event), not stay stuck.
    expect(nextPlayIndex(events, 2, new Set([3]))).toBe(3);
  });

  it("stops at the next breakpoint line encountered while advancing", () => {
    // Breakpoint on line 2 (events at index 1 and 3). From index 2, next stop is 3.
    expect(nextPlayIndex(events, 2, new Set([2]))).toBe(3);
  });
});
