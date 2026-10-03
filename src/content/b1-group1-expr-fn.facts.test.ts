// @vitest-environment node
/**
 * R9 / B1 Group 1 follow-up (amendment 8) — regression for the reviewer's
 * narrower findings on PR #24:
 *   - expressions: EVERY learner-facing "/ yields a float" claim (vocabulary,
 *     expr-predict-1 expected + hints, reference verifiedClaims) must be scoped
 *     to the BUILT-IN int/float operands taught — not a generic "numbers" claim,
 *     because complex operands yield a complex, not a float. A complex
 *     counterexample is verified on the bundled runtime; the standard example's
 *     output is preserved.
 *   - functions: the O(d) addition cost is the lesson's DERIVED complexity
 *     reasoning; the Numeric Types reference's verifiedClaims must state only
 *     what that page establishes (unlimited-precision integers), not the O(d)
 *     cost.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

/** Scoped to the built-in int/float operands taught: the text names int/float
 *  (or "integer and floating-point"), and does NOT make a bare "numbers" claim. */
function scopedToIntFloat(text: string): boolean {
  const t = text.toLowerCase();
  const namesIntFloat = /int\b|integer|float/.test(t);
  // A bare universal "numbers" claim (not qualified by int/float) is too broad.
  const bareNumbers = /\b(of|on|two|for) numbers?\b/.test(t) && !namesIntFloat;
  return namesIntFloat && !bareNumbers;
}

// ---------------------------------------------------------------------------
// expressions — every "/ yields a float" claim scoped to int/float
// ---------------------------------------------------------------------------
describe("B1 G1 amd8 — expressions: '/ yields a float' scoped to int/float operands", () => {
  const l = byId("expressions");

  it("vocabulary 'True division (/)' entry is scoped to int/float, not bare 'numbers'", () => {
    const v = l.vocabulary.find((x) => /true division/i.test(x.term));
    expect(v, "True division vocabulary entry").toBeDefined();
    expect(v!.definition.toLowerCase()).not.toMatch(/\b(of|on) numbers?\b/);
    expect(scopedToIntFloat(v!.definition)).toBe(true);
  });

  it("expr-predict-1 expected answer is scoped to int/float, not bare 'numbers'", () => {
    const ex = (l.exercises ?? []).find((e) => e.id === "expr-predict-1");
    expect(ex, "expr-predict-1").toBeDefined();
    expect((ex!.expected ?? "").toLowerCase()).not.toMatch(/\b(of|on) numbers?\b/);
    expect(scopedToIntFloat(ex!.expected ?? "")).toBe(true);
  });

  it("expr-predict-1 hints are scoped to int/float, not bare 'numbers'", () => {
    const ex = (l.exercises ?? []).find((e) => e.id === "expr-predict-1");
    const hintBlob = (ex!.hints ?? []).join(" ").toLowerCase();
    expect(hintBlob).not.toMatch(/\bon numbers?\b/);
    expect(scopedToIntFloat(hintBlob)).toBe(true);
  });

  it("the reference verifiedClaims for '/' is scoped to int/float, not bare 'numbers'", () => {
    const claims = l.references.flatMap((r) => r.verifiedClaims ?? []);
    const slashClaim = claims.find((c) => /\//.test(c) && /float/i.test(c));
    expect(slashClaim, "a '/'-returns-float verified claim").toBeDefined();
    expect(slashClaim!.toLowerCase()).not.toMatch(/\bon numbers?\b/);
    expect(scopedToIntFloat(slashClaim!)).toBe(true);
  });

  it("no learner-facing field makes a bare universal 'numbers' true-division claim", () => {
    const fields = [
      l.explanation,
      l.review,
      ...l.vocabulary.map((v) => v.definition),
      ...(l.exercises ?? []).flatMap((e) => [e.expected ?? "", ...(e.hints ?? [])]),
      ...l.references.flatMap((r) => r.verifiedClaims ?? []),
    ].join("\n").toLowerCase();
    // "numbers" may still appear, but not as "of/on numbers ... float" without int/float scoping
    expect(fields).not.toMatch(/(of|on) numbers?[^.]*float/);
  });
});

// ---------------------------------------------------------------------------
// expressions — runtime: complex counterexample + preserved standard output
// ---------------------------------------------------------------------------
describe("B1 G1 amd8 — expressions runtime: complex counterexample; output preserved", () => {
  let stdCompleted = false;
  let stdStdout = "";
  let complexType = "";

  beforeAll(async () => {
    const l = byId("expressions");
    const std = await runProgram(l.code, l.stdin ?? "");
    stdCompleted = std.status === "completed";
    stdStdout = std.stdout;
    // Counterexample: complex operands -> complex, NOT float.
    const cx = await runProgram("print(type((1 + 2j) / (1 + 1j)).__name__)\n", "");
    complexType = cx.stdout.trim();
  }, 120_000);

  it("the standard example still prints 14 20 2 / 3 32 2.5", () => {
    expect(stdCompleted).toBe(true);
    expect(stdStdout).toBe("14 20 2\n3 32 2.5\n");
    expect(byId("expressions").expectedOutput).toBe("14 20 2\n3 32 2.5\n");
  });

  it("complex-operand true division yields a complex (not a float) on the bundled runtime", () => {
    expect(complexType).toBe("complex");
  });
});

// ---------------------------------------------------------------------------
// functions — O(d) is derived reasoning; reference claim = unlimited precision
// ---------------------------------------------------------------------------
describe("B1 G1 amd8 — functions: O(d) cost is derived, reference states only unlimited precision", () => {
  const l = byId("functions");

  it("the Numeric Types reference verifiedClaims establishes unlimited precision, NOT the O(d) cost", () => {
    const ref = l.references.find((r) => /numeric-types|stdtypes/i.test(r.url));
    expect(ref, "Numeric Types reference").toBeDefined();
    const claims = (ref!.verifiedClaims ?? []).join(" ").toLowerCase();
    expect(claims).toMatch(/unlimited precision|arbitrary precision|unlimited length/);
    // The page establishes precision; it must not be cited as the SOURCE of the
    // O(d) / cost-grows derivation.
    expect(claims).not.toMatch(/o\(d\)|cost (grows|can grow)|time complexity|addition cost/);
  });

  it("the O(d) cost appears as the lesson's own derived complexity reasoning", () => {
    const cx = JSON.stringify(l.complexityExplanation).toLowerCase();
    expect(cx).toMatch(/o\(d\)/);
    // framed as derivation/our reasoning, not "the docs say"
    expect(cx).toMatch(/arbitrary precision|unlimited precision|digits/);
  });
});
