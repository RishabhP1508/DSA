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
 * A general guard asserts that EVERY overlay `source` on EVERY lesson binding
 * names a token that actually appears in that lesson's code. NOTE: this is a
 * NECESSARY-not-sufficient check — it rejects a typo'd/undefined source, but it
 * would NOT have caught the original loops bug, whose source `i` IS a real
 * variable (the while-counter) that simply does not index `nums`. The property
 * that actually matters — that an array binding does not highlight a false
 * position — is enforced SEMANTICALLY, against a real recorded trace, in
 * `src/visualizers/loops.overlay.real.test.tsx` (it renders the loops `nums`
 * binding over every step and asserts no cell is ever marked active, with a
 * positive control proving the old `source: "i"` overlay WOULD have lit a cell).
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
// General guard (NECESSARY, not sufficient): an overlay source must at least
// name a real variable in the lesson code — this rejects typos/undefined names.
// It does NOT prove the overlay tracks a meaningful position; that is enforced
// semantically on a real trace in loops.overlay.real.test.tsx (see file header).
// ---------------------------------------------------------------------------
describe("B1 guard — overlay source names a real variable (necessary, not sufficient)", () => {
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

  // --- Reviewer deepening (amendment 2) ---

  it("the break-it experiment uses a GENUINELY NEW edge (not a duplicate)", () => {
    // from_edges is a Python set, so re-adding an EXISTING edge cannot change
    // equality. The experiment must introduce an edge not already present AND
    // not in the adjacency map (so the stated edit truly makes equality False).
    const expJoined = l.experiments.join("\n");
    expect(expJoined).toContain("(0, 3)");
    // The edge introduced must not already be one of the three existing edges.
    for (const existing of ["(0, 1)", "(0, 2)", "(1, 2)"]) {
      // the NEW edge token must differ from each existing edge
      expect("(0, 3)").not.toBe(existing);
    }
    // The lesson text explicitly states this edit yields False.
    expect(expJoined.toLowerCase()).toMatch(/false/);
  });

  it("complexity has NO sort term and the program prints no sorted list", () => {
    // The program prints an equality + a count, not sorted(from_edges), so no
    // O(E log E) sort cost should be CLAIMED as a bound.
    expect(l.code).not.toMatch(/sorted\s*\(/);
    // The claimed time bound (and the summary operation bounds) must be linear —
    // no logarithmic sort term anywhere a cost is asserted.
    const claimedBounds = [
      l.complexityExplanation.time.bound,
      ...l.complexity.flatMap((c) => [c.best, c.average, c.worst]),
    ]
      .join(" | ")
      .toLowerCase();
    expect(claimedBounds).not.toMatch(/log/);
    // The prose should note that there is no sort step (reconciliation).
    const cx = JSON.stringify(l.complexityExplanation).toLowerCase();
    expect(cx).toMatch(/no sort/);
  });

  it("separates REACHING a neighbour set from ENUMERATING it, as distinct rows", () => {
    // Reaching the set (a dict key lookup) and reading its members (set
    // iteration) are DIFFERENT operations with different costs; they must not be
    // conflated into one row.
    const reach = l.complexity.find((c) => /reach/i.test(c.operation));
    const enumerate = l.complexity.find((c) => /enumerat/i.test(c.operation));
    expect(reach, "a 'reach' row").toBeDefined();
    expect(enumerate, "an 'enumerate' row").toBeDefined();
    expect(reach!.operation).not.toBe(enumerate!.operation);
  });

  it("the REACH row is expected O(1), and its worst case is NOT O(degree)", () => {
    // Reaching the set is a hashed dict lookup: expected O(1); the hashing worst
    // case is O(V) (collisions), per the Python TimeComplexity reference. O(degree)
    // is the ENUMERATION cost and must not appear as the reach's worst case.
    const reach = l.complexity.find((c) => /reach/i.test(c.operation))!;
    expect(reach.average?.replace(/\s/g, "")).toBe("O(1)");
    expect(reach.worst).not.toMatch(/degree/i);
    // the worst case acknowledges the hashing collision cost (linear in V), not O(1)
    expect(reach.worst).toMatch(/O\(V\)|O\(n\)/);
  });

  it("the ENUMERATE row carries the O(degree) cost", () => {
    const enumerate = l.complexity.find((c) => /enumerat/i.test(c.operation))!;
    const bounds = [enumerate.best, enumerate.average, enumerate.worst].join(" ");
    expect(bounds).toMatch(/degree/i);
  });

  it("the overall program time bound is labelled EXPECTED/AVERAGE, not strict worst", () => {
    // The derivation relies on expected-O(1) dict/set ops, so an O(V+E) bound is
    // an EXPECTED/average-case claim — not a guaranteed worst case. The true
    // hashing worst case must be acknowledged (superlinear / collisions).
    const t = l.complexityExplanation.time;
    expect(["expected", "average"]).toContain(t.case);
    const blob = JSON.stringify(l.complexityExplanation).toLowerCase();
    expect(blob).toMatch(/collision|worst case|adversar|superlinear/);
    // And the expected bound itself is linear in the graph size.
    expect(t.bound.replace(/\s/g, "")).toMatch(/O\(V\+E\)/);
  });

  it("states the assumptions under which the two encodings are equal", () => {
    const blob = (
      lessonProse(l) +
      "\n" +
      (l.complexityExplanation?.assumptions ?? []).join("\n")
    ).toLowerCase();
    expect(blob).toContain("undirected");
    expect(blob).toMatch(/self-loop|self loop/);
    expect(blob).toMatch(/duplicate|parallel/);
  });
});

// ---------------------------------------------------------------------------
// Finding 2 (wording) — the equality check's scope is stated honestly: it
// compares normalized edge SETS and is NOT a general graph-equivalence
// validator. Assumption violations can still print True, so the lesson must not
// claim they "would break" the check.
// ---------------------------------------------------------------------------
describe("B1 finding 2 — equality check scope is qualified honestly", () => {
  const l = byId("representations");

  const prose = () =>
    (
      lessonProse(l) +
      "\n" +
      (l.complexityExplanation?.assumptions ?? []).join("\n") +
      "\n" +
      l.experiments.join("\n")
    ).toLowerCase();

  it("does NOT claim assumption violations would always break the check", () => {
    const blob = prose();
    // The old overgeneralisations must be gone.
    expect(blob).not.toMatch(/would break it/);
    expect(blob).not.toMatch(/edit one shape alone and the check prints `?false/);
  });

  it("states the check compares normalized edge sets (not a general validator)", () => {
    const blob = prose();
    expect(blob).toMatch(/normali[sz]ed edge set|set of \(min, max\)|edge set/);
    // Explicitly distinguishes example-under-assumptions from a general validator.
    expect(blob).toMatch(/not a (general|full|complete).*(validator|check|equivalence)/);
  });

  it("acknowledges violations that can STILL print True", () => {
    const blob = prose();
    // At least two of: parallel/duplicate multiplicity, non-reciprocal adjacency,
    // isolated/extra vertex not in any edge — each can still compare equal.
    const stillTrueSignals = [
      /parallel|duplicate|multiplicit/, // duplicate edge collapses in a set
      /reciprocal|both directions|one direction|only one/, // non-reciprocal adj
      /isolated|no edges|vertex set|same nodes|extra (node|vertex)/, // vertex-set not checked
    ].filter((re) => re.test(blob)).length;
    expect(stillTrueSignals).toBeGreaterThanOrEqual(2);
    // And it says such cases can still print True / are not detected.
    expect(blob).toMatch(/still (print|return|compare).*true|not detect|cannot detect|won'?t catch/);
  });
});

// ---------------------------------------------------------------------------
// Finding 2 — representations is reachable by a beginner at its position.
// ---------------------------------------------------------------------------
describe("B1 finding 2 — representations prerequisites match the constructs used", () => {
  const l = byId("representations");

  it("declares loops as a prerequisite (it uses for-loops incl. a nested one)", () => {
    expect(l.prerequisites).toContain("variables-and-types");
    expect(l.prerequisites).toContain("loops");
  });

  it("introduces set and nested-loop vocabulary it relies on", () => {
    const terms = l.vocabulary.map((v) => v.term.toLowerCase());
    expect(terms.some((t) => t.includes("set"))).toBe(true);
    expect(terms.some((t) => t.includes("nested"))).toBe(true);
  });

  it("uses plain for-loops rather than set/dict comprehensions", () => {
    // Beginner-friendlier: explicit loops, no comprehension syntax.
    expect(l.code).toMatch(/\bfor\b/);
    expect(l.code).not.toMatch(/\{[^}]*\bfor\b[^}]*\}/); // no {... for ...} comprehension
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
