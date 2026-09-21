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

describe("R5.2.3 heaps — a genuine sift-up/sift-down mechanics example (not just the word 'sift')", () => {
  const l = byId("heap-sift");

  it("defines explicit sift_up and sift_down routines in the lesson code", () => {
    expect(l.code).toMatch(/def sift_up\(/);
    expect(l.code).toMatch(/def sift_down\(/);
  });

  it("teaches the 0-based parent/child index formulas", () => {
    const all = `${l.code}\n${lessonProse(l)}`;
    expect(all).toMatch(/\(i ?- ?1\) ?\/\/ ?2/); // parent (i-1)//2
    expect(all).toMatch(/2 ?\* ?i ?\+ ?1/); // left child 2i+1
    expect(all).toMatch(/2 ?\* ?i ?\+ ?2/); // right child 2i+2
  });

  it("shows a concrete before-array, the swap sequence, and the resulting array", () => {
    // The lesson's expectedOutput IS the state sequence: append -> sift-up swaps ->
    // move-last-to-root -> sift-down swap. Assert the exact mechanics, not a keyword.
    const out = l.expectedOutput;
    expect(out).toContain("after append: [1, 3, 2, 7, 4, 5, 0]");
    expect(out).toContain("sift-up swap: [1, 3, 0, 7, 4, 5, 2]");
    expect(out).toContain("sift-up swap: [0, 3, 1, 7, 4, 5, 2]");
    expect(out).toContain("moved last to root: [2, 3, 1, 7, 4, 5]");
    expect(out).toContain("sift-down swap: [1, 3, 2, 7, 4, 5]");
    // final state is a valid min-heap (root is the minimum).
    expect(out.trim().endsWith("after sift-down: [1, 3, 2, 7, 4, 5]")).toBe(true);
  });

  it("has a predict-next-swap exercise", () => {
    const kinds = l.exercises.map((e) => e.kind);
    expect(kinds).toContain("predict-state");
    const predict = l.exercises.find((e) => e.kind === "predict-state")!;
    expect(predict.prompt.toLowerCase()).toMatch(/swap|index|sift/);
  });

  it("binds the heap array to the heap visualizer", () => {
    expect(l.bindings.some((b) => b.variable === "heap" && b.model === "heap")).toBe(true);
  });
});

/**
 * The state sequence in expectedOutput must be a REAL, correct heap trace — this
 * re-derives sift-up/sift-down in TS from the same start array and asserts it
 * matches the lesson output, so the mechanics can't drift from a valid heap.
 */
describe("R5.2.3 heaps — the sift state sequence is mechanically correct", () => {
  it("re-derived sift-up/sift-down reproduce the lesson's exact state lines", () => {
    const lines: string[] = [];
    const heap = [1, 3, 2, 7, 4, 5];
    heap.push(0);
    lines.push(`after append: [${heap.join(", ")}]`);
    // sift-up from the last index
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[i] < heap[parent]) {
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        lines.push(`sift-up swap: [${heap.join(", ")}]`);
        i = parent;
      } else break;
    }
    lines.push(`after sift-up: [${heap.join(", ")}]`);
    // remove-min: move last to root, sift down
    const last = heap.pop()!;
    heap[0] = last;
    lines.push(`moved last to root: [${heap.join(", ")}]`);
    i = 0;
    const size = heap.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < size && heap[left] < heap[smallest]) smallest = left;
      if (right < size && heap[right] < heap[smallest]) smallest = right;
      if (smallest === i) break;
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      lines.push(`sift-down swap: [${heap.join(", ")}]`);
      i = smallest;
    }
    lines.push(`after sift-down: [${heap.join(", ")}]`);

    const rederived = lines.join("\n") + "\n";
    expect(byId("heap-sift").expectedOutput).toBe(rederived);
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
