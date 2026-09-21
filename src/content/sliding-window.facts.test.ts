// @vitest-environment node
/**
 * R5.2.4 (fixed sliding window) factual-correctness regression.
 *
 * The FIXED-size sliding-window lesson claims O(1) AUXILIARY space, but built
 * the first window with `sum(nums[:k])`, which allocates an O(k) slice — a peak
 * temporary that DOES count as auxiliary space. These tests assert the corrected
 * teaching: explicit accumulation for the first window (no `nums[:k]` slice when
 * an O(1)-aux claim is made), an O(k) init-cost statement, k<=0 / k>n handling,
 * and a note that prefix sums are a valid alternative.
 *
 * `string-sliding-window` is a VARIABLE-size window (longest substring without
 * repeats); it has no fixed k and no first-window slice, so the fixed-window
 * assertions do not apply to it. It is checked only for the slice-vs-O(1) rule.
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

function prose(l: LessonDefinition): string {
  return [
    l.explanation,
    l.review,
    l.concepts.purpose,
    l.concepts.operations,
    l.concepts.uses,
    l.concepts.tradeoffs,
    l.concepts.commonMistakes,
    l.concepts.edgeCases,
    l.complexityExplanation?.time.explanation ?? "",
    l.complexityExplanation?.space.explanation ?? "",
    l.complexityExplanation?.space.inputOutputNote ?? "",
    ...(l.complexityExplanation?.assumptions ?? []),
    ...l.codeExplanations.map((c) => c.explanation),
  ].join("\n");
}

/** Rule that applies to ANY window lesson: if aux space is claimed O(1), the
 *  code must not allocate a slice that grows with the window. */
function assertNoSliceWhenConstantAux(l: LessonDefinition) {
  const auxIsConstant = /^O\(1\)/.test(l.complexityExplanation?.space.bound ?? "");
  if (auxIsConstant) {
    expect(l.code, `${l.id}: O(1) aux claim must not use sum(x[:k])`).not.toMatch(/sum\(\s*\w+\s*\[\s*:\s*k\s*\]\s*\)/);
    expect(l.code, `${l.id}: O(1) aux claim must not slice x[:k]`).not.toMatch(/\w+\[\s*:\s*k\s*\]/);
  }
}

describe("R5.2.4 fixed sliding window — sliding-window", () => {
  const l = byId("sliding-window");

  it("does NOT build the first window with sum(nums[:k]) while claiming O(1) aux space", () => {
    assertNoSliceWhenConstantAux(l);
  });

  it("states the O(k) initialisation cost of the first window", () => {
    expect(prose(l)).toMatch(/O\(k\)/);
  });

  it("handles or explicitly rejects k <= 0 and k > n", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/k\s*(<=|<|≤)\s*0|k\s*(is\s*)?(zero|non-positive|nonpositive)/);
    expect(p).toMatch(/k\s*>\s*n|k larger than n|k greater than n|larger than the array|longer than the array|k\s*>\s*len/);
  });

  it("notes prefix sums are a valid alternative", () => {
    expect(prose(l).toLowerCase()).toMatch(/prefix sum/);
  });
});

describe("R5.2.4 window lessons — slice-vs-O(1) rule holds for string-sliding-window too", () => {
  it("string-sliding-window does not claim O(1) aux while slicing", () => {
    assertNoSliceWhenConstantAux(byId("string-sliding-window"));
  });
});
