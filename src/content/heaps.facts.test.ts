// @vitest-environment node
/**
 * R5.2 (heaps) factual-correctness regression.
 *
 * The bundled runtime is CPython 3.14.2, which ADDED a public max-heap family
 * (heapify_max / heappush_max / heappop_max, plus heapreplace_max /
 * heappushpop_max). Proven on the bundled runtime by scripts/probe_heaps_314.mjs.
 *
 * The min/max heaps lesson previously taught "Python only has a MIN-heap" — a
 * claim that is factually WRONG on 3.14. These tests assert the corrected
 * teaching: native max-heap APIs ARE taught, negation is presented as the
 * (portable, pre-3.14) ALTERNATIVE, indexing conventions are reconciled, and
 * construction cost is separated from per-operation cost.
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

/** All text a learner can read for a lesson (for claim presence/absence checks). */
function lessonProse(l: LessonDefinition): string {
  return [
    l.explanation,
    l.review,
    l.concepts.purpose,
    l.concepts.operations,
    l.concepts.uses,
    l.concepts.tradeoffs,
    l.concepts.commonMistakes,
    l.concepts.edgeCases,
    ...l.vocabulary.map((v) => `${v.term} ${v.definition}`),
    ...l.codeExplanations.map((c) => c.explanation),
  ].join("\n");
}

describe("R5.2 heaps — min-max-heaps teaches the Python 3.14 max-heap API", () => {
  const l = byId("min-max-heaps");
  const prose = lessonProse(l);
  const all = `${l.code}\n${prose}`;

  it("teaches the native max-heap functions (heapify_max / heappush_max / heappop_max)", () => {
    expect(all).toMatch(/heapify_max/);
    expect(all).toMatch(/heappush_max/);
    expect(all).toMatch(/heappop_max/);
  });

  it("still presents value negation as an alternative", () => {
    expect(prose.toLowerCase()).toMatch(/negat/);
  });

  it("does NOT assert as a current fact that Python only has a min-heap", () => {
    // The lesson may DISCUSS the historical min-only situation, but must not
    // state it as the present reality on the bundled 3.14 runtime.
    expect(prose).not.toMatch(/Python only has a MIN-heap/i);
    expect(prose).not.toMatch(/Python's heap is min-only/i);
    expect(prose).not.toMatch(/heapq is a min-heap[^.]*only/i);
  });

  it("reconciles heapq 0-based indexing with 1-based textbook indexing", () => {
    expect(prose).toMatch(/0-based|zero-based/i);
    expect(prose).toMatch(/1-based|one-based/i);
  });

  it("separates O(n) heap construction from O(log n) push/pop", () => {
    expect(prose).toMatch(/heapify/i);
    expect(prose).toMatch(/O\(n\)/);
    expect(prose).toMatch(/O\(log n\)/);
  });
});

describe("R5.2 heaps — sift-up/sift-down mechanics are taught explicitly somewhere in the heaps track", () => {
  it("at least one heap lesson shows sift-up/sift-down (bubble up / sink down)", () => {
    const heapLessons = ["min-max-heaps", "heap-sort", "top-k", "kth-largest", "running-median", "two-heap-pattern"]
      .map(byId);
    const combined = heapLessons.map((l) => `${l.code}\n${lessonProse(l)}`).join("\n").toLowerCase();
    expect(combined).toMatch(/sift|bubble up|sink down|percolate/);
  });
});

describe("R5.2 heaps — no other heap lesson repeats the min-only misconception", () => {
  it("heap lessons don't claim Python is min-only on 3.14", () => {
    for (const id of ["top-k", "kth-largest", "running-median", "two-heap-pattern", "heap-sort"]) {
      const prose = lessonProse(byId(id));
      expect(prose, `${id} should not assert Python is min-only`).not.toMatch(/only has a MIN-heap|min-only/i);
    }
  });
});
