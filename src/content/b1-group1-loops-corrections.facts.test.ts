// @vitest-environment node
/**
 * R9 / B1 Group 1 — Lesson 2 (loops) focused corrections, reviewer-requested
 * after the Parts A–E packet review. Written test-first.
 *
 * Findings (verbatim intent):
 *  1. concepts.operations must NOT list break/continue — this lesson does not
 *     teach them (smaller-scope fix).
 *  2. Across explanation, vocabulary, line-1 comment, line explanations, and
 *     review: say `for` consumes an ITERABLE that provides items one at a time,
 *     with this list as the concrete example (not "sequence" only).
 *  3. "once per item" must be qualified as what happens when the loop FINISHES
 *     NORMALLY; a loop can stop early (break/return).
 *  4. Complexity model must be explicit: total time = iterations × work per
 *     iteration. The O(n) here ASSUMES each body op is constant cost for the
 *     SMALL numbers shown; Python's arbitrary-precision ints can make addition
 *     more expensive for very large values.
 *  5. Space: the loop uses O(1) EXTRA space, while an n-item nums list occupies
 *     O(n) storage. In THIS code nums is a fixed 3-item literal, so it must not
 *     be called "supplied input" without explaining the generalization.
 *  6. references include the Python language reference §8.3 (for / iterable /
 *     early-exit semantics).
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

const loops = byId("loops");

function cx(l: LessonDefinition): string {
  return JSON.stringify(l.complexityExplanation);
}

describe("B1 G1 L2 — loops: operations no longer claims break/continue", () => {
  it("concepts.operations does not mention break or continue", () => {
    const ops = loops.concepts.operations.toLowerCase();
    expect(ops).not.toContain("break");
    expect(ops).not.toContain("continue");
  });

  it("continue is never introduced; break appears only as an early-exit example, not taught", () => {
    const surfaces = [
      loops.explanation,
      loops.review,
      ...loops.vocabulary.map((v) => `${v.term} ${v.definition}`),
      ...loops.codeExplanations.map((c) => c.explanation),
    ].join("\n").toLowerCase();
    // continue is out of scope entirely
    expect(surfaces).not.toMatch(/\bcontinue\b/);
    // break may be named at most once, purely to illustrate early exit
    const breakCount = (surfaces.match(/\bbreak\b/g) ?? []).length;
    expect(breakCount).toBeLessThanOrEqual(1);
    // it is not presented as something this lesson teaches/demonstrates
    expect(surfaces).not.toMatch(/\bbreak\b[^.]*\b(demonstrat|example below|try|use the break)/);
  });
});

describe("B1 G1 L2 — loops: for consumes an iterable, items one at a time", () => {
  it("explanation describes for over an iterable providing items one at a time", () => {
    const e = loops.explanation.toLowerCase();
    expect(e).toContain("iterable");
    expect(e).toMatch(/one at a time|one item at a time|each item in turn/);
  });

  it("vocabulary defines for in terms of an iterable (list as example)", () => {
    const forEntry = loops.vocabulary.find((v) => /^for loop$/i.test(v.term));
    expect(forEntry).toBeDefined();
    expect(forEntry!.definition.toLowerCase()).toContain("iterable");
  });

  it("the line-1 comment and a line explanation mention iterable", () => {
    const line1 = loops.code.split("\n")[0].toLowerCase();
    expect(line1).toContain("iterable");
    const expl = loops.codeExplanations.map((c) => c.explanation).join("\n").toLowerCase();
    expect(expl).toContain("iterable");
  });

  it("review mentions iterable", () => {
    expect(loops.review.toLowerCase()).toContain("iterable");
  });
});

describe("B1 G1 L2 — loops: 'once per item' qualified for normal completion / early exit", () => {
  it("explanation or review qualifies once-per-item with normal completion + early stop", () => {
    const blob = (loops.explanation + "\n" + loops.review).toLowerCase();
    expect(blob).toMatch(/finish(es)? normally|runs to completion|without stopping early|unless/);
    expect(blob).toMatch(/stop early|exit early|early exit/);
  });
});

describe("B1 G1 L2 — loops: complexity model is iterations × work per iteration", () => {
  it("states total time = iterations × work-per-iteration", () => {
    const blob = cx(loops).toLowerCase();
    expect(blob).toMatch(/iterations?\s*(×|x|\*|times)\s*(the\s*)?(work|cost)|work per iteration|cost per iteration/);
  });

  it("qualifies the constant-body assumption with the arbitrary-precision int caveat", () => {
    const blob = cx(loops).toLowerCase();
    expect(blob).toMatch(/small (numbers|values|integers)/);
    expect(blob).toMatch(/arbitrary[- ]precision|arbitrary[- ]size|very large|big integers?|large integers?/);
  });

  it("space: O(1) extra space vs the n-item list occupying O(n) storage", () => {
    const blob = cx(loops).toLowerCase();
    expect(blob).toMatch(/o\(1\).*extra|extra.*o\(1\)|constant extra/);
    expect(blob).toMatch(/o\(n\).*(storage|space)|list.*o\(n\)/);
  });

  it("does not call the fixed 3-item literal 'supplied/supplied input' without generalization", () => {
    const blob = cx(loops);
    if (/supplied input|supplied by/i.test(blob)) {
      // if the word appears, it must be alongside the fixed-literal generalization
      expect(blob).toMatch(/fixed .*literal|three-item literal|3-item literal|here .*literal/i);
    }
    // affirmatively acknowledges the literal is fixed in this displayed code
    expect(blob.toLowerCase()).toMatch(/fixed (three|3)[- ]item|literal/);
  });
});

describe("B1 G1 L2 — loops: references include Python language reference §8.3", () => {
  it("has a compound_stmts.html reference scoped to the for statement (§8.3)", () => {
    const ref = loops.references.find((r) => /compound_stmts\.html/.test(r.url));
    expect(ref).toBeDefined();
    expect(`${ref!.section} ${ref!.url}`.toLowerCase()).toMatch(/8\.3|for statement|#for/);
    const claims = (ref!.verifiedClaims ?? []).join(" ").toLowerCase();
    expect(claims).toMatch(/iterable/);
    expect(claims).toMatch(/break|continue|early|terminat/);
  });
});
