/**
 * Observed-statistics computation for the complexity panel.
 *
 * These functions turn a recorded RunResult into the counts the Time & Space
 * panel shows. Everything here is EVIDENCE about one particular run for one
 * input — it is never presented as a proof of asymptotic growth, and it excludes
 * the tracer/visualization machinery (we only count the learner program's own
 * frames and objects, which the tracer already filters to the user source).
 *
 * R7.2 corrections:
 *  - "function calls" now means USER-FUNCTION calls: the module-entry `call`
 *    event (the top-level `<module>` frame) is EXCLUDED, because entering the
 *    module is not a function call the learner wrote.
 *  - the categories are kept distinct and honestly labelled: trace events (all
 *    recorded events), user-function calls, active call depth (excluding the
 *    module frame), line entries, and authored operation counters. A line-entry
 *    count is NOT presented as a "comparison" or "operation" count unless an
 *    authored counter defines it.
 *  - metrics can be computed UP TO a chosen playback index (current position) as
 *    well as for the whole run, so the panel can show both.
 */

import type { RunResult, TraceEvent, OperationCounter } from "../core/types";

/** The module-entry frame name emitted by the tracer for top-level code. */
export const MODULE_FRAME = "<module>";

/** Events up to and including `index` (whole run when index is omitted). */
function eventsUpTo(result: RunResult, index?: number): TraceEvent[] {
  if (index === undefined) return result.events;
  const clamped = Math.max(-1, Math.min(index, result.events.length - 1));
  return result.events.slice(0, clamped + 1);
}

/** Count how many recorded events executed one of the given 1-based lines. */
export function countLineExecutions(
  result: RunResult,
  lines: number[],
  upToIndex?: number,
): number {
  const set = new Set(lines);
  let n = 0;
  for (const ev of eventsUpTo(result, upToIndex)) {
    if (ev.kind === "line" && set.has(ev.line)) n++;
  }
  return n;
}

/** Total line-entry events (every executed line step). */
export function lineEntries(result: RunResult, upToIndex?: number): number {
  let n = 0;
  for (const ev of eventsUpTo(result, upToIndex)) if (ev.kind === "line") n++;
  return n;
}

/**
 * Active USER call depth: the number of frames that are not the module frame.
 * This is the recursion/stack-space proxy the learner cares about (a top-level
 * script sitting in `<module>` has active depth 0, not 1).
 */
export function activeDepthAt(ev: TraceEvent): number {
  let d = 0;
  for (const f of ev.frames) if (f.name !== MODULE_FRAME) d++;
  return d;
}

/** Maximum active user-call depth observed (recursion stack-space proxy). */
export function maxCallDepth(result: RunResult, upToIndex?: number): number {
  let max = 0;
  for (const ev of eventsUpTo(result, upToIndex)) {
    const d = activeDepthAt(ev);
    if (d > max) max = d;
  }
  return max;
}

/**
 * Total number of USER-function calls observed (a proxy for total recursive
 * calls). Excludes the module-entry `call` event: entering `<module>` is not a
 * function the learner defined or called.
 */
export function userFunctionCalls(result: RunResult, upToIndex?: number): number {
  let n = 0;
  for (const ev of eventsUpTo(result, upToIndex)) {
    if (ev.kind !== "call") continue;
    // The innermost frame of a call event is the function being entered.
    const entering = ev.frames[ev.frames.length - 1];
    if (entering && entering.name !== MODULE_FRAME) n++;
  }
  return n;
}

/**
 * Peak number of entries held by the object a named variable refers to, across
 * the run (up to a position). Useful for "auxiliary storage grows with n".
 */
export function peakContainerSize(
  result: RunResult,
  variable: string,
  upToIndex?: number,
): number {
  let peak = 0;
  for (const ev of eventsUpTo(result, upToIndex)) {
    const size = containerSizeAt(ev, variable);
    if (size > peak) peak = size;
  }
  return peak;
}

function containerSizeAt(ev: TraceEvent, variable: string): number {
  for (let i = ev.frames.length - 1; i >= 0; i--) {
    const local = ev.frames[i].locals.find((l) => l.name === variable);
    if (local && local.value.kind === "ref") {
      const obj = ev.objects[local.value.id];
      if (obj?.entries) return obj.entries.length;
    }
  }
  return 0;
}

/** Evaluate an authored OperationCounter against a run (up to a position). */
export function evaluateCounter(
  result: RunResult,
  counter: OperationCounter,
  upToIndex?: number,
): number {
  return countLineExecutions(result, counter.countLines, upToIndex);
}

export interface ObservedStats {
  /** All recorded trace events (every kind). */
  traceEvents: number;
  /** Line-entry events (executed line steps). */
  lineEntries: number;
  /** USER-function calls (module entry excluded). */
  userFunctionCalls: number;
  /** Max active user-call depth (module frame excluded). */
  maxDepth: number;
  /** Authored operation counters. */
  counters: { label: string; definition: string; value: number }[];
}

/**
 * Compute observed stats for the panel. When `upToIndex` is given the values are
 * cumulative up to that playback position; otherwise they are whole-run totals.
 */
export function computeObservedStats(
  result: RunResult,
  counters: OperationCounter[] = [],
  upToIndex?: number,
): ObservedStats {
  return {
    traceEvents: eventsUpTo(result, upToIndex).length,
    lineEntries: lineEntries(result, upToIndex),
    userFunctionCalls: userFunctionCalls(result, upToIndex),
    maxDepth: maxCallDepth(result, upToIndex),
    counters: counters.map((c) => ({
      label: c.label,
      definition: c.definition,
      value: evaluateCounter(result, c, upToIndex),
    })),
  };
}
