import type { RunResult } from "../core/types";

export type ComparisonSample = { result: string; ops: number };

/** Read the final result|count record printed by a comparison program. */
export function parseComparisonResult(run: RunResult): ComparisonSample {
  if (run.status !== "completed" || run.incomplete || run.error || run.limitHit) {
    throw new Error(`Comparison did not complete (${run.status}${run.incomplete ? ", incomplete" : ""}).${run.error ? ` ${run.error.message}` : ""}`);
  }
  const line = run.stdout.trim().split(/\r?\n/).pop() ?? "";
  // Python repr may itself contain a pipe; the count is the final field.
  const separator = line.lastIndexOf("|");
  const result = line.slice(0, separator);
  if (separator <= 0 || !result.trim()) {
    throw new Error("Comparison produced no result record.");
  }
  const count = line.slice(separator + 1);
  const ops = Number(count);
  if (!/^\d+$/.test(count) || !Number.isSafeInteger(ops)) {
    throw new Error("Comparison produced an invalid operation count.");
  }
  return { result, ops };
}
