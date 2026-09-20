/**
 * R4.1 source/input staleness: a RunResult carries the sourceRev/inputRev it was
 * produced from; the UI marks the trace stale when the current editor content no
 * longer hashes to those revisions.
 *
 * Written before the fix: `isResultStale` does not exist yet, and RunResult has
 * no sourceRev/inputRev fields.
 */
import { describe, it, expect } from "vitest";
import { isResultStale } from "./replay";
import { hash32 } from "./protocol";
import type { RunResult } from "../core/types";

function res(source: string, stdin: string): RunResult {
  return {
    runId: 1,
    status: "completed",
    events: [],
    stdout: "",
    stderr: "",
    sourceRev: hash32(source),
    inputRev: hash32(stdin),
  };
}

describe("isResultStale", () => {
  it("is not stale when source and stdin are unchanged", () => {
    const r = res("x = 1\n", "");
    expect(isResultStale(r, "x = 1\n", "")).toBe(false);
  });

  it("is stale when the source changed", () => {
    const r = res("x = 1\n", "");
    expect(isResultStale(r, "x = 2\n", "")).toBe(true);
  });

  it("is stale when the stdin changed", () => {
    const r = res("x = input()\n", "Ada\n");
    expect(isResultStale(r, "x = input()\n", "Bob\n")).toBe(true);
  });

  it("treats a null/absent result as not stale (nothing to invalidate)", () => {
    expect(isResultStale(null, "x = 1\n", "")).toBe(false);
    expect(isResultStale(undefined, "x = 1\n", "")).toBe(false);
  });

  it("is stale when a result predates the rev feature (no sourceRev recorded)", () => {
    const legacy = { runId: 1, status: "completed", events: [], stdout: "", stderr: "" } as RunResult;
    // Without a recorded rev we cannot prove it matches the current source, so
    // treat it as stale (conservative) once the learner has any source.
    expect(isResultStale(legacy, "x = 1\n", "")).toBe(true);
  });
});
