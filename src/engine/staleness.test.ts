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

// Build a result the way the engine stamps it: exact source/stdin (authoritative
// for freshness) plus the hashes (kept for worker-message correlation).
function res(source: string, stdin: string): RunResult {
  return {
    runId: 1,
    status: "completed",
    events: [],
    stdout: "",
    stderr: "",
    source,
    stdin,
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

describe("isResultStale — exact comparison (hash collisions must not look fresh)", () => {
  // These two DISTINCT sources collide under the 32-bit FNV-1a hash, so a
  // hash-only freshness check would wrongly treat the old trace as current after
  // an edit between them. The result carries the EXACT source it was produced
  // from; freshness compares exact strings.
  const A = "x = 1026739644\nprint(x)\n";
  const B = "x = 2540207134\nprint(x)\n";

  it("the two sources really do collide under hash32 (guards the premise)", () => {
    expect(hash32(A)).toBe(hash32(B));
    expect(A).not.toBe(B);
  });

  it("a result produced from A is STALE against B even though the hashes match", () => {
    // The engine stamps the exact source/input on the result.
    const rA: RunResult = {
      runId: 1, status: "completed", events: [], stdout: "", stderr: "",
      source: A, stdin: "", sourceRev: hash32(A), inputRev: hash32(""),
    };
    expect(isResultStale(rA, B, "")).toBe(true); // edited A→B: must be stale
    expect(isResultStale(rA, A, "")).toBe(false); // unchanged: fresh
  });

  it("distinguishes stdin whose hashes would collide (exact compare)", () => {
    const rA: RunResult = {
      runId: 1, status: "completed", events: [], stdout: "", stderr: "",
      source: "x = input()\n", stdin: A, sourceRev: hash32("x = input()\n"), inputRev: hash32(A),
    };
    expect(isResultStale(rA, "x = input()\n", B)).toBe(true);
  });
});
