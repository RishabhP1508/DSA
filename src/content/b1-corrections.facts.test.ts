// @vitest-environment node
/**
 * R9 / B1 semantic-review corrections — regression tests (test-first).
 *
 * These guard the four B1 findings surfaced during semantic review:
 *   1. representations: the two shown encodings must be GENUINELY EQUIVALENT
 *      (an edge list and an adjacency map encode exactly the same connections).
 *   2. loops: the `nums` array binding must NOT carry a pointer/boundary/
 *      highlight overlay sourced from a variable that does not index `nums`
 *      (the old overlay used the unrelated while-counter `i`, highlighting a
 *      false position). The observed loop value `x` is shown via the frame
 *      locals panel, not a fabricated array index.
 *   3. functions: the call-stack visualization is kept, but the binding and the
 *      learner-facing text describe a FUNCTION CALL STACK, not "recursion"
 *      attached to the scalar `answer`.
 *   4. variables-and-types: the lesson must TEACH object identity from the
 *      recorded snapshot — `scores` and `best` refer to the SAME list after
 *      `best = scores`, while a copied list is a DIFFERENT object. Identity is
 *      read from reference ids in the trace, never by re-executing learner code.
 *
 * A general guard also asserts that EVERY overlay `source` on EVERY lesson
 * binding names a token that actually appears in that lesson's code — closing
 * the verification gap that let the loops false-pointer pass silently.
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

/** All learner-facing prose for a lesson (for claim presence/absence checks). */
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

/** A token appears in code if it occurs as a whole word. */
function codeMentions(code: string, token: string): boolean {
  return new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(code);
}

// ---------------------------------------------------------------------------
// General guard: overlay sources must be real variables in the lesson code.
// ---------------------------------------------------------------------------
describe("B1 guard — overlay sources name a real variable in the lesson code", () => {
  for (const l of lessons) {
    for (const b of l.bindings ?? []) {
      for (const o of b.overlays ?? []) {
        it(`${l.id}: overlay '${o.label}' source '${o.source}' exists in code`, () => {
          expect(codeMentions(l.code, o.source)).toBe(true);
        });
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Finding 1 — representations: two equivalent encodings of one small graph.
// ---------------------------------------------------------------------------
describe("B1 finding 1 — representations shows two EQUIVALENT encodings", () => {
  const l = byId("representations");

  it("teaches an edge list and an adjacency map of the same graph", () => {
    const prose = lessonProse(l).toLowerCase();
    expect(prose).toContain("edge list");
    expect(prose).toContain("adjacency");
    // code builds both representations
    expect(codeMentions(l.code, "edges")).toBe(true);
    expect(codeMentions(l.code, "adj")).toBe(true);
  });

  it("the program checks the two encodings describe the SAME connections", () => {
    // The lesson's own program must demonstrate equivalence and print the proof,
    // so a learner (and the Pyodide verifier) see them agree.
    expect(l.code.toLowerCase()).toMatch(/same|equal|==|equivalent/);
    expect(l.expectedOutput).toContain("True");
  });

  it("binds both representations for side-by-side visualization", () => {
    const vars = (l.bindings ?? []).map((b) => b.variable);
    expect(vars).toContain("edges");
    expect(vars).toContain("adj");
    const edgesB = l.bindings.find((b) => b.variable === "edges");
    const adjB = l.bindings.find((b) => b.variable === "adj");
    expect(edgesB?.model).toBe("array");
    expect(adjB?.model).toBe("dict");
  });

  it("complexity claims mention both representations", () => {
    const ops = l.complexity.map((c) => c.operation.toLowerCase()).join(" | ");
    expect(ops).toMatch(/edge list|edge-list/);
    expect(ops).toMatch(/adjacency/);
  });
});

// ---------------------------------------------------------------------------
// Finding 2 — loops: no false pointer into nums from the while-counter.
// ---------------------------------------------------------------------------
describe("B1 finding 2 — loops has no false array pointer", () => {
  const l = byId("loops");

  it("the nums array binding carries no index overlay", () => {
    const numsB = l.bindings.find((b) => b.variable === "nums");
    expect(numsB).toBeDefined();
    const indexOverlays = (numsB?.overlays ?? []).filter(
      (o) => o.role === "pointer" || o.role === "boundary" || o.role === "highlight",
    );
    expect(indexOverlays).toEqual([]);
  });

  it("no overlay anywhere in the lesson is sourced from the while-counter 'i'", () => {
    for (const b of l.bindings ?? []) {
      for (const o of b.overlays ?? []) {
        expect(o.source).not.toBe("i");
      }
    }
  });

  it("still teaches the for-loop value variable x and the accumulator", () => {
    expect(codeMentions(l.code, "x")).toBe(true);
    const prose = lessonProse(l).toLowerCase();
    expect(prose).toContain("accumulat");
  });
});

// ---------------------------------------------------------------------------
// Finding 3 — functions: call-stack binding/label, not recursion-on-answer.
// ---------------------------------------------------------------------------
describe("B1 finding 3 — functions uses a call-stack binding, not recursion-on-answer", () => {
  const l = byId("functions");

  it("the recursion/call-stack binding is not attached to the scalar 'answer'", () => {
    const recB = l.bindings.find((b) => b.model === "recursion");
    expect(recB).toBeDefined();
    expect(recB?.variable).not.toBe("answer");
  });

  it("learner-facing text frames it as a function call stack", () => {
    const prose = lessonProse(l).toLowerCase();
    expect(prose).toContain("call stack");
    // Any mention of 'recursion' must be an explicit contrast (this example is
    // NOT recursive), never a claim that this lesson demonstrates recursion.
    const recSentences = lessonProse(l)
      .split(/(?<=[.!?])\s+/)
      .filter((s) => /\brecursion\b|\brecursive\b/i.test(s));
    for (const s of recSentences) {
      expect(s.toLowerCase()).toMatch(
        /\bno\b|\bnot\b|non-recursive|isn't|rather than|calling itself/,
      );
    }
  });

  it("binding carries a call-stack label, not a scalar variable", () => {
    const recB = l.bindings.find((b) => b.model === "recursion");
    // Point the binding at the traced function / call stack, not a result value.
    expect(recB?.variable).toMatch(/call|stack|add/i);
  });

  it("program defines and calls a function so call AND return frames occur", () => {
    expect(codeMentions(l.code, "def")).toBe(true);
    expect(codeMentions(l.code, "return")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Finding 4 — variables-and-types: identity taught + both bindings present.
// ---------------------------------------------------------------------------
describe("B1 finding 4 — variables-and-types teaches identity from the snapshot", () => {
  const l = byId("variables-and-types");

  it("binds BOTH aliasing names so the shared object is visible", () => {
    const vars = (l.bindings ?? []).map((b) => b.variable);
    expect(vars).toContain("scores");
    expect(vars).toContain("best");
  });

  it("the program shows same-object vs copy explicitly (is / is not)", () => {
    // `is` compares identity; the lesson must demonstrate both the alias (same
    // object) and a copy (different object) and print the result.
    expect(l.code).toMatch(/\bis\b/);
    expect(codeMentions(l.code, "copy") || /list\(/.test(l.code) || /\[:\]/.test(l.code)).toBe(true);
    // Output proves one True (alias) and one False (copy).
    expect(l.expectedOutput).toContain("True");
    expect(l.expectedOutput).toContain("False");
  });

  it("teaches identity/aliasing in prose without claiming code is re-run", () => {
    const prose = lessonProse(l).toLowerCase();
    expect(prose).toContain("alias");
    expect(prose).toMatch(/same object|same list|identity/);
  });
});
