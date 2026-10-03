// @vitest-environment node
/**
 * R9 / B1 Group 1 follow-up — regression checks for the reviewer's exact
 * findings on merged main (ce2339b). Each assertion encodes a specific claim
 * that must be corrected; written test-first (fails against the pre-fix content).
 *
 * Findings (verbatim intent):
 *  1. variables-and-types
 *     - do NOT claim a literal "creates"/"freshly creates" a NEW int object
 *       (CPython can reuse small ints); say the literal evaluates to an int the
 *       name is bound to.
 *     - the copy length k is 4 (append runs before list(scores)), not 3.
 *     - the time section (case: worst) must not treat the single append as the
 *       size story while ignoring that print(scores) also displays k elements;
 *       overall O(k) stays, reasoning corrected.
 *  2. expressions
 *     - // floors the quotient; two ints -> int, a float operand -> float
 *       (7.0 // 2 == 3.0); not "integer division -> a whole number" only.
 *     - "/ gives a float" scoped to the int/float operands being taught, not a
 *       universal claim about all Python objects.
 *  3. loops
 *     - keep case: worst; the displayed while is O(1) (fixed 3), independent of
 *       n = len(nums); a generalized while limit uses a SEPARATE variable.
 *     - replace the Runestone book-index reference with an exact page; fix the
 *       Python reference section/URL pairing.
 *  4. functions
 *     - remove unrestricted "regardless of the values passed" / "any numeric
 *       inputs" claims (Python ints are arbitrary precision); keep O(1)/worst for
 *       the displayed small fixed-size values and state that assumption.
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

function cxBlob(l: LessonDefinition): string {
  return JSON.stringify(l.complexityExplanation);
}
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
    ...l.vocabulary.map((v) => `${v.term} ${v.definition}`),
    ...l.codeExplanations.map((c) => c.explanation),
  ].join("\n");
}

// ---------------------------------------------------------------------------
// 1. variables-and-types
// ---------------------------------------------------------------------------
describe("B1 G1 — variables-and-types: honest object creation + copy length + time reasoning", () => {
  const l = byId("variables-and-types");

  it("does not claim a literal CREATES/freshly-creates a new int object", () => {
    const p = prose(l).toLowerCase();
    expect(p).not.toContain("create the integer object");
    expect(p).not.toContain("creates the integer object");
    expect(cxBlob(l).toLowerCase()).not.toContain("freshly created object");
    // affirmatively teaches the honest framing (literal evaluates to / bound to)
    expect(p).toMatch(/evaluates to .*int|bound to|refers to the int|reuse/);
  });

  it("notes CPython may reuse small integer objects", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/reuse|cache|same (small )?int|intern/);
  });

  it("states the copy length k is 4 (append runs before the copy), not 3", () => {
    const cx = cxBlob(l);
    expect(cx).not.toMatch(/here\s*3\b/);
    expect(cx).toMatch(/here\s*4\b|k\s*=\s*4|4 elements/);
  });

  it("time reasoning: print(scores) is also size-dependent (copy is not the ONLY one)", () => {
    const cx = cxBlob(l).toLowerCase();
    // The pre-fix wording claimed the copy was the ONLY size-dependent step.
    expect(cx).not.toMatch(/it is the only step that (grows|is size)/);
    expect(cx).not.toMatch(/the copy is the only/);
    // affirmatively says the copy is NOT the only size-dependent step
    expect(cx).toMatch(/not the only size-dependent/);
    // acknowledges the final print of k elements and the resize cost of append
    expect(cx).toMatch(/print/);
    expect(cx).toMatch(/resize|reallocat/);
  });
});

// ---------------------------------------------------------------------------
// 2. expressions
// ---------------------------------------------------------------------------
describe("B1 G1 — expressions: floor division type + scoped true-division claim", () => {
  const l = byId("expressions");

  it("// floors the quotient; a float operand yields a float (7.0 // 2 == 3.0)", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/floor(s)? the quotient|rounds the quotient down/);
    // must mention the float-operand case, not only the whole-number int case
    expect(p).toMatch(/float operand|7\.0 \/\/ 2|yield a float|can be a float|float result/);
    // must NOT state floor division only ever gives a whole number
    expect(p).not.toMatch(/to a whole number\b(?!.*float)/);
  });

  it("'/ gives a float' is scoped to int/float operands, not a universal claim", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/int(eger)?s? (and|or|\/) float|numeric operand|on numbers|with numbers/);
    // avoid the unqualified universal "always gives a float" without scoping
    const universalUnscoped =
      /\balways gives a float\b/.test(p) && !/number|int|float operand|numeric/.test(p);
    expect(universalUnscoped).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. loops
// ---------------------------------------------------------------------------
describe("B1 G1 — loops: separate for-O(n) from the displayed while-O(1); exact references", () => {
  const l = byId("loops");

  it("keeps case: worst for the program", () => {
    expect(l.complexityExplanation.time.case).toBe("worst");
  });

  it("states the displayed while loop is O(1) / fixed, independent of n", () => {
    const cx = cxBlob(l).toLowerCase();
    expect(cx).toMatch(/while.*(o\(1\)|fixed|constant|independent of n|does not depend on n)/);
    // must NOT claim the displayed while runs n times
    expect(cx).not.toMatch(/while.*runs.*\bn\b (times|iterations) here/);
  });

  it("uses a SEPARATE variable if it generalizes the while limit (not n)", () => {
    // n is defined as len(nums); a generalized while bound must use another symbol.
    const nVar = l.complexityExplanation.variables.find((v) => v.symbol === "n");
    expect(nVar?.meaning.toLowerCase()).toMatch(/len\(nums\)|items? in .*nums|the list/);
    // if the while is generalized, a distinct symbol (e.g. m/k) is introduced
    const cx = cxBlob(l);
    if (/generali[sz]e|in general/i.test(cx) && /while/i.test(cx)) {
      expect(l.complexityExplanation.variables.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("replaces the Runestone book-index reference with an exact page (not index.html)", () => {
    const runestone = l.references.find((r) => /runestone/.test(r.url));
    expect(runestone).toBeDefined();
    expect(runestone!.url).not.toMatch(/\/index\.html$/);
    expect(runestone!.url).toMatch(/runestone\.academy\/.+\/.+\.html$/);
  });

  it("the Python reference section/URL pairing is coherent (no mixed-page section)", () => {
    const py = l.references.find((r) => /docs\.python\.org/.test(r.url));
    expect(py).toBeDefined();
    // the muddled "for Statements / while (introduction.html)" section is gone
    expect((py!.section ?? "").toLowerCase()).not.toContain("introduction.html");
  });
});

// ---------------------------------------------------------------------------
// 4. functions
// ---------------------------------------------------------------------------
describe("B1 G1 — functions: no unrestricted constant-cost claim for arbitrary-precision ints", () => {
  const l = byId("functions");

  it("keeps O(1) worst case for the displayed small values", () => {
    expect(l.complexityExplanation.time.bound.replace(/\s/g, "")).toBe("O(1)");
    expect(l.complexityExplanation.time.case).toBe("worst");
  });

  it("removes the 'regardless of the values passed' unrestricted claim", () => {
    expect(l.complexityExplanation.time.explanation.toLowerCase()).not.toContain(
      "regardless of the values passed",
    );
  });

  it("removes the 'O(1) per call for any numeric inputs' unrestricted claim", () => {
    const cx = cxBlob(l).toLowerCase();
    expect(cx).not.toMatch(/any numeric inputs?/);
  });

  it("states the fixed-size / small-operand assumption (arbitrary precision caveat)", () => {
    const cx = cxBlob(l).toLowerCase();
    expect(cx).toMatch(/fixed-size|small (operands?|values?|integers?)|machine word|arbitrary precision|grow.*operand|digits/);
  });
});
