// @vitest-environment node
/**
 * R9 / B1 batch semantic-review corrections. Written test-first; each assertion
 * encodes a specific reviewer-approved finding verified against the bundled
 * runtime. Covers: expressions, conditions, io, errors, functions-prereq,
 * complexity, amortized, references-mutation, classes, correctness,
 * representations, scope. All 13 items stay semanticReview:false.
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};
const cx = (l: LessonDefinition) => JSON.stringify(l.complexityExplanation);
const prose = (l: LessonDefinition) =>
  [
    l.explanation,
    l.review,
    l.concepts.purpose, l.concepts.operations, l.concepts.uses,
    l.concepts.tradeoffs, l.concepts.commonMistakes, l.concepts.edgeCases,
    ...l.vocabulary.map((v) => `${v.term} ${v.definition}`),
    ...l.codeExplanations.map((c) => c.explanation),
  ].join("\n");

// ── expressions: precedence (grouping) vs left-to-right evaluation order ──
describe("expressions: precedence is grouping, distinct from evaluation order", () => {
  const l = byId("expressions");
  it("commonMistakes no longer frames left-to-right evaluation itself as the error", () => {
    expect(l.concepts.commonMistakes.toLowerCase()).not.toContain("assuming left-to-right evaluation (ignoring precedence)");
  });
  it("teaches that precedence decides grouping (not the order operands are evaluated)", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/group(s|ing)?/);
    expect(p).toMatch(/evaluat(es|ed|ion) (operands|left to right|left-to-right)|left to right|left-to-right/);
  });
  it("vocab Precedence defines binding/grouping, not 'the order operators are applied'", () => {
    const v = l.vocabulary.find((x) => /precedence/i.test(x.term))!;
    expect(v.definition.toLowerCase()).not.toContain("the order operators are applied");
    expect(v.definition.toLowerCase()).toMatch(/bind|group/);
  });
});

// ── conditions: truthiness + = vs == is a SyntaxError ──
describe("conditions: truthiness taught; = vs == is a SyntaxError", () => {
  const l = byId("conditions");
  it("introduces truthy/falsy, not only the literal True", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/truthy|falsy|truth value/);
  });
  it("clarifies that if x = 5 is a syntax error in Python", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/syntax error|syntaxerror/);
  });
});

// ── io: blank line '' vs exhausted input EOFError ──
describe("io: distinguishes blank line from EOF", () => {
  const l = byId("io");
  it("edgeCases no longer says exhausted input 'gets an empty line'", () => {
    expect(l.concepts.edgeCases.toLowerCase()).not.toContain("gets an empty line");
  });
  it("names EOFError for exhausted input and '' for a blank line", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/eoferror/);
    expect(p).toMatch(/blank line|empty string/);
  });
});

// ── prereq audit: errors + correctness depend on functions (acyclic) ──
describe("prerequisite audit: function-using lessons declare functions", () => {
  it("errors lists functions as a prerequisite (its exercise writes a def)", () => {
    expect(byId("errors").prerequisites).toContain("functions");
  });
  it("correctness lists functions as a prerequisite (its example is a def)", () => {
    expect(byId("correctness").prerequisites).toContain("functions");
  });
});

// ── complexity: O upper-bound wording, empty-input, nested-loop, viz overlay ──
describe("complexity: upper-bound wording + empty-input + nested-loop qualifier + viz", () => {
  const l = byId("complexity");
  it("does not define O(n) as growing in DIRECT PROPORTION to n (that is Theta)", () => {
    expect(l.explanation.toLowerCase()).not.toContain("grows in direct proportion to n");
  });
  it("frames Big-O as an upper bound (at most)", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/upper bound|at most/);
  });
  it("states the nonempty-input precondition / find_max([]) failure at nums[0]", () => {
    const p = (prose(l) + cx(l)).toLowerCase();
    expect(p).toMatch(/non-?empty|at least one element|nums\[0\]|indexerror/);
  });
  it("qualifies the nested-loop rule: TWO FULL n-length nested loops give O(n^2)", () => {
    const blob = (prose(l) + cx(l)).toLowerCase();
    // nesting alone is not sufficient; must mention full/length-n (or each runs n)
    expect(blob).toMatch(/full|length-?n|each (of )?(the )?(inner|loops) runs n|both run n|n[- ]length/);
  });
  it("removes the value-as-index highlight overlay on nums (defect)", () => {
    const b = l.bindings.find((x) => x.variable === "nums")!;
    const hasBestOverlay = (b.overlays ?? []).some((o: any) => o.source === "best");
    expect(hasBestOverlay).toBe(false);
  });
});

// ── amortized: program-scope O(n) total; constant-multiple not 2n; refs moved ──
describe("amortized: program total O(n); constant-multiple bound; references moved", () => {
  const l = byId("amortized");
  it("does not claim the doubling-specific 'about 2n' total", () => {
    expect(cx(l).toLowerCase()).not.toContain("about 2n");
  });
  it("uses a constant-multiple-of-n bound for total copying", () => {
    expect(cx(l).toLowerCase()).toMatch(/constant multiple of n|a constant times n|c\s*\*\s*n|proportional to n/);
  });
  it("program-scope total construction time is reported as O(n)", () => {
    // scope is program; the total must be visible as O(n) somewhere in the model
    expect(l.complexityExplanation.scope).toBe("program");
    expect(cx(l)).toMatch(/O\(n\)/);
  });
  it("explains a resize MOVES references, not copies the objects themselves", () => {
    const p = (prose(l) + cx(l)).toLowerCase();
    expect(p).toMatch(/moves?\b[^.]*\breferences/);
    expect(p).toMatch(/objects (themselves )?are not duplicated|not the objects|objects themselves/);
  });
});

// ── references-mutation: another local name; contents not copied; tuple-holds-mutable; shallow copy ──
describe("references-mutation: name/contents + immutable caveat + shallow copy", () => {
  const l = byId("references-mutation");
  it("explains the parameter is another local NAME for the same object (contents not copied)", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/another (local )?name|a second name|same object/);
    expect(p).toMatch(/contents are not copied|not a copy of the object|copies (only )?the reference/);
  });
  it("does not keep the blanket 'immutable means the caller is never affected' claim", () => {
    const p = prose(l).toLowerCase();
    // a tuple can hold a mutable object; blanket 'never affected' is wrong
    expect(p).toMatch(/tuple can (still )?(contain|hold).*mutable|a tuple holding a mutable/);
  });
  it("qualifies shallow-copy advice (list(x) is a shallow copy)", () => {
    const p = (prose(l) + cx(l)).toLowerCase();
    expect(p).toMatch(/shallow copy|shallow/);
  });
});

// ── classes: __init__ initializes; self binding explained; no auto-independence promise ──
describe("classes: init vs construct; self binding; independence qualified", () => {
  const l = byId("classes");
  it("describes __init__ as initialization (not solely 'the constructor')", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/initiali(s|z)e/);
  });
  it("explains the instance is supplied as self (c.increment() ~ Counter.increment(c))", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/counter\.increment\(c\)|passes? (the )?instance as self|instance is (passed|supplied) as self|supplied as self/);
  });
  it("does not promise ALL instance data is automatically independent (class attrs can be shared)", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/class(-| )level.*shared|shared across instances|not all .* independent|mutable class/);
  });
});

// ── correctness: valid-input contract; invariant restored after full iteration; closed-form arithmetic cost ──
describe("correctness: contract + invariant timing + closed-form cost model", () => {
  const l = byId("correctness");
  it("the line-7 explanation does not claim the invariant holds immediately after adding to total", () => {
    const e7 = l.codeExplanations.find((c) => c.line === 7)!;
    // invariant is restored only after i advances (line 8), not right after the add
    expect(e7.explanation.toLowerCase()).not.toMatch(/preserves the invariant|invariant (now )?holds/);
  });
  it("states the invariant is restored after the complete iteration (after i advances)", () => {
    const p = prose(l).toLowerCase();
    expect(p).toMatch(/after (the )?(complete |full |whole )?iteration|after i (advances|increases)|restored (at|after)/);
  });
  it("qualifies the closed-form O(1) with an arithmetic cost model (big ints cost more)", () => {
    const p = (prose(l) + cx(l)).toLowerCase();
    expect(p).toMatch(/arbitrary[- ]precision|large (integers?|numbers?)|digits|machine word|unit[- ]cost/);
  });
});

// ── representations: retract 'ints cannot collide'; keep worst-case caveat; explain labels 0,1,2 don't collide ──
describe("representations: honest hashing worst-case caveat", () => {
  const l = byId("representations");
  it("does NOT claim integer keys cannot collide / collision is unreachable for integers", () => {
    const blob = (prose(l) + cx(l)).toLowerCase();
    expect(blob).not.toMatch(/not reachable with these integer|integer keys (cannot|can't|never) collide|no collision.*integer/);
  });
  it("keeps a legitimate hashing worst-case caveat (expected O(1) vs pathological worst)", () => {
    const blob = cx(l).toLowerCase();
    expect(blob).toMatch(/expected/);
    expect(blob).toMatch(/worst/);
    expect(blob).toMatch(/collision|collide/);
  });
  it("explains the fixed labels 0,1,2 do not themselves trigger the collision", () => {
    const blob = (prose(l) + cx(l)).toLowerCase();
    expect(blob).toMatch(/0, ?1, ?2|these (specific )?labels|labels 0/);
    expect(blob).toMatch(/do(es)? not (trigger|cause|collide|produce)|no collision for|distinct hashes/);
  });
});

// ── scope: define "enclosing" where used; finally wording handled in errors ──
describe("scope: 'enclosing' is defined where used", () => {
  const l = byId("scope");
  it("if 'enclosing' appears, it is defined (not an undefined term)", () => {
    const p = prose(l).toLowerCase();
    if (p.includes("enclosing")) {
      // defined, not left as a bare term: nearby text explains it as an outer/
      // containing function scope
      expect(p).toMatch(/enclosing scope[^.]*(function|outer|defined inside|contains)/);
    }
  });
});

describe("errors: 'finally' wording qualified for normal control flow", () => {
  const l = byId("errors");
  it("does not assert finally 'always runs' unqualified", () => {
    expect(l.concepts.edgeCases.toLowerCase()).not.toMatch(/finally always runs/);
  });
});

// ── global invariant: all 13 remain pending; the 2 approvals preserved ──
describe("batch review-flag invariants", () => {
  const PENDING = ["expressions","conditions","io","errors","functions","scope","references-mutation","classes","complexity","cases","amortized","correctness","representations"];
  it("all 13 batch items remain semanticReview:false", () => {
    for (const id of PENDING) expect(byId(id).evidence?.semanticReview).toBe(false);
  });
  it("the two prior approvals are preserved", () => {
    expect(byId("variables-and-types").evidence?.semanticReview).toBe(true);
    expect(byId("loops").evidence?.semanticReview).toBe(true);
  });
});
