/**
 * Observed-statistics computation for the complexity panel.
 *
 * These functions turn a recorded RunResult into the counts the Time & Space
 * panel shows (line-execution counts, max call-stack depth, peak container
 * sizes). Everything here is EVIDENCE about one particular run for one input —
 * it is never presented as a proof of asymptotic growth, and it excludes the
 * tracer/visualization machinery (we only count the learner program's own
 * frames and objects, which the tracer already filters to the user source).
 */

import type { RunResult, TraceEvent, OperationCounter } from "../core/types";

/** Count how many recorded events executed one of the given 1-based lines. */
export function countLineExecutions(result: RunResult, lines: number[]): number {
  const set = new Set(lines);
  let n = 0;
  for (const ev of result.events) {
    if (ev.kind === "line" && set.has(ev.line)) n++;
  }
  return n;
}

/** Maximum call-stack depth observed (a proxy for recursion stack space). */
export function maxCallDepth(result: RunResult): number {
  let max = 0;
  for (const ev of result.events) {
    if (ev.frames.length > max) max = ev.frames.length;
  }
  return max;
}

/** Total number of function calls observed (a proxy for total recursive calls). */
export function totalCalls(result: RunResult): number {
  let n = 0;
  for (const ev of result.events) if (ev.kind === "call") n++;
  return n;
}

/**
 * Peak number of entries held by the object a named variable refers to, across
 * the whole run. Useful for "auxiliary storage grows with n" explanations.
 */
export function peakContainerSize(result: RunResult, variable: string): number {
  let peak = 0;
  for (const ev of result.events) {
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

/** Evaluate an authored OperationCounter against a run. */
export function evaluateCounter(result: RunResult, counter: OperationCounter): number {
  return countLineExecutions(result, counter.countLines);
}

export interface ObservedStats {
  totalEvents: number;
  maxDepth: number;
  totalCalls: number;
  counters: { label: string; definition: string; value: number }[];
}

/** Compute the full set of observed stats for the panel. */
export function computeObservedStats(
  result: RunResult,
  counters: OperationCounter[] = [],
): ObservedStats {
  return {
    totalEvents: result.events.length,
    maxDepth: maxCallDepth(result),
    totalCalls: totalCalls(result),
    counters: counters.map((c) => ({
      label: c.label,
      definition: c.definition,
      value: evaluateCounter(result, c),
    })),
  };
}
