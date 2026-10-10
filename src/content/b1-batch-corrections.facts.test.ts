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
import { REVIEW_LEDGER_BY_KEY } from "./review-ledger";
// @ts-expect-error - .mjs helpers without types
import { contentHashOf } from "../../scripts/lib/content-hash.mjs";
// @ts-expect-error - .mjs helpers without types
import { ledgerEntryFor, assertSignoffNotBeforeVerified, UNREVIEWED_SENTINEL } from "../../scripts/lib/review-ledger-core.mjs";
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
  it("program-scope TIME bound (not just some O(n) in the blob) is O(n)", () => {
    // Assert the actual time.bound + scope, so a faulty O(1) time bound cannot
    // slip through via the space field containing 'O(n)'.
    expect(l.complexityExplanation.scope).toBe("program");
    expect(l.complexityExplanation.time.bound.replace(/\s/g, "")).toBe("O(n)");
    // per-append amortized O(1) stays visible in the operation table (not as a
    // program-scope alternative bound):
    const table = JSON.stringify(l.complexity).toLowerCase();
    expect(table).toMatch(/append \(single\)/);
    expect(table).toMatch(/n appends \(total\)/);
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

// ── Amendment: effective shared exercise content (merged registry) ──
describe("amendment — effective exercise hints match the exercise contract", () => {
  const effExercise = (lid: string, exid: string) => {
    const ex = byId(lid).exercises.find((e) => e.id === exid);
    if (!ex) throw new Error(`exercise ${lid}:${exid} not found`);
    return ex;
  };
  const hintBlob = (lid: string, exid: string) => (effExercise(lid, exid).hints ?? []).join("\n").toLowerCase();

  it("io-fix-1 hints use the `text` argument + int(text) + return (not input()/print)", () => {
    const h = hintBlob("io", "io-fix-1");
    expect(h).toMatch(/int\(text\)/);
    expect(h).toMatch(/return/);
    expect(h).not.toMatch(/input\(/);
    expect(h).not.toMatch(/\bprint\(n/);
  });

  it("err-complete-1 hints return values (not print) and note the tests check the return", () => {
    const h = hintBlob("errors", "err-complete-1");
    expect(h).toMatch(/return a \/ b|return the|return 'undefined'|returned value/);
    expect(h).not.toMatch(/print\(a \/ b\)|print\('undefined'\)/);
  });
});

describe("amendment — amort-choose-1 recognition no longer says 'doubling'", () => {
  const ex = () => byId("amortized").exercises.find((e) => e.id === "amort-choose-1")!;
  it("rejection feedback / recognition describe proportional over-allocation (doubling only when negated)", () => {
    const rec = JSON.stringify(ex().recognition ?? {}).toLowerCase();
    expect(rec).toMatch(/proportional|over-allocat/);
    // "doubling" may appear ONLY in a negation like "not doubling"; never as a
    // bare claim that CPython doubles.
    const bareDoubling = /(?<!not )doubling/.test(rec.replace(/not doubling/g, ""));
    expect(bareDoubling).toBe(false);
  });
});

// ── Amendment: residual prose + scope (Tasks 5–7) ──
describe("amendment — residual prose corrections", () => {
  it("classes line-3 explanation calls __init__ the initializer, not 'the constructor'", () => {
    const e3 = byId("classes").codeExplanations.find((c) => c.line === 3)!;
    expect(e3.explanation.toLowerCase()).toContain("initializer");
    expect(e3.explanation.toLowerCase()).not.toMatch(/\bthe constructor\b/);
  });
  it("classes explains instances can share an object via self (not blanket independence)", () => {
    expect(byId("classes").explanation.toLowerCase()).toMatch(/self\.items|share the same object|same object/);
  });
  it("complexity defines a tight (Theta) bound as matching bounds up to constants for large n", () => {
    expect(byId("complexity").explanation.toLowerCase()).toMatch(/up to constant factors.*(large|sufficiently large) n|matching/);
  });
  it("errors index guard warns that a bare `< len` is unsafe for negative indices", () => {
    // the index-check cost tradeoff lives in the complexity tradeoffs text
    const t = (byId("errors").complexityExplanation.tradeoffs ?? "").toLowerCase();
    expect(t).toMatch(/negative/);
    expect(t).toMatch(/-len\(nums\)|0 <= index/); // a correct full-range guard is shown
  });
  it("conditions/io exercises document that the function wrapper is provided", () => {
    expect(byId("conditions").exercises.find((e) => e.id === "cond-fix-1")!.prompt.toLowerCase()).toMatch(/already written|edit .*(body|order)/);
    expect(byId("io").exercises.find((e) => e.id === "io-fix-1")!.prompt.toLowerCase()).toMatch(/already written|edit its body/);
  });
  it("conditions line 6 explanation calls it a real code statement, scopes 'not reached' to THIS run, and notes another input reaches it", () => {
    const e6 = byId("conditions").codeExplanations.find((c) => c.line === 6)!.explanation.toLowerCase();
    expect(e6).toMatch(/real code statement|code statement/);
    expect(e6).toMatch(/this run|not reached/);
    // reachability is input-dependent, not a fixed property of the line
    expect(e6).toMatch(/temp = 25|different input|is reached/);
    // must NOT call a real statement a comment
    expect(e6).not.toContain("comment");
  });
});

describe("amendment — complexity scope consistency", () => {
  it("cases analysis scope is a single function call (not the two-call program)", () => {
    expect(byId("cases").complexityExplanation.scope).toBe("function");
  });
  it("references-mutation derivation references try_rebind on line 15 (print x on line 16)", () => {
    const cx = JSON.stringify(byId("references-mutation").complexityExplanation);
    // the call step must cite line 15
    expect(cx).toMatch(/"lines":\s*\[15\][^}]*try_rebind/);
  });
  it("references-mutation accounts for print(shared) touching n elements (O(n) program)", () => {
    const cx = JSON.stringify(byId("references-mutation").complexityExplanation).toLowerCase();
    expect(cx).toMatch(/print\(shared\)|every element|n element/);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Review-flag integrity (sign-off COMPATIBLE).
//
// A permanent "all 13 remain false" assertion would make this suite fail the
// moment the user legitimately signs any of them off — turning a regression
// guard into a prohibition on the very approval it is meant to lead to. Instead
// we assert the DURABLE integrity rule (a true flag must agree with the current
// content hash and the authorized review ledger; an item without a matching
// ledger entry stays pending) and record the amendment-time snapshot as
// non-blocking EVIDENCE. The hard enforcement lives in review-ledger.test.ts;
// here we add a batch-scoped integrity check plus an ISOLATED fixture proving
// the sign-off mechanism accepts an authorized review and rejects stale /
// unauthorized evidence — WITHOUT signing off any live lesson.
// ─────────────────────────────────────────────────────────────────────────
describe("B1 batch — review-flag integrity (survives a future legitimate sign-off)", () => {
  const BATCH = ["expressions","conditions","io","errors","functions","scope","references-mutation","classes","complexity","cases","amortized","correctness","representations"];

  it("INVARIANT: any batch item flagged semanticReview:true agrees with its current hash + ledger", () => {
    // Does NOT require any item to be true; it only forbids an INCONSISTENT true.
    // This passes today (all pending) and keeps passing after a real sign-off,
    // because a legitimate sign-off updates the ledger to the current hash.
    for (const id of BATCH) {
      const l = byId(id);
      if (l.evidence?.semanticReview === true) {
        const entry = REVIEW_LEDGER_BY_KEY.get(`lesson:${id}`);
        expect(entry, `${id} is approved but has no ledger entry`).toBeTruthy();
        expect(entry!.reviewedHash, `${id} approval must match current content hash`).toBe(contentHashOf(l));
      }
    }
  });

  it("INVARIANT: a batch item without a current-hash ledger entry is NOT approved", () => {
    for (const id of BATCH) {
      const l = byId(id);
      const entry = REVIEW_LEDGER_BY_KEY.get(`lesson:${id}`);
      const ledgerMatches = !!entry && entry.reviewedHash === contentHashOf(l);
      if (!ledgerMatches) {
        expect(l.evidence?.semanticReview).toBe(false);
      }
    }
  });

  it("EVIDENCE (non-blocking snapshot at this amendment): 2 approved repo-wide, 13 batch pending", () => {
    // Recorded as the amendment's observed state. If a later authorized sign-off
    // changes these numbers, that is EXPECTED — this is evidence, not a ceiling.
    const batchApprovedNow = BATCH.filter((id) => byId(id).evidence?.semanticReview === true);
    const batchPendingNow = BATCH.filter((id) => byId(id).evidence?.semanticReview !== true);
    // snapshot values observed when this amendment was authored:
    expect(batchApprovedNow.length + batchPendingNow.length).toBe(13);
    // the two prior approvals are the only repo-wide approvals at amendment time
    expect(byId("variables-and-types").evidence?.semanticReview).toBe(true);
    // A later correction may invalidate a prior approval. A historical approval
    // must not force the live flag true after the content changes.
    const currentLoops = byId("loops");
    expect(currentLoops.evidence?.semanticReview).toBe(
      REVIEW_LEDGER_BY_KEY.get("lesson:loops")?.reviewedHash === contentHashOf(currentLoops),
    );
  });
});

describe("B1 batch — sign-off mechanism accepts authorized review, rejects stale/unauthorized (isolated fixture)", () => {
  // Pure, in-memory fixture — NEVER mutates a live lesson's evidence or the real
  // ledger. Mirrors the codemod rule: semanticReview granted iff the ledger
  // entry's reviewedHash equals the item's live content hash.
  const grants = (reviewedHash: string, liveHash: string) => reviewedHash === liveHash;
  const fixtureItem = { id: "fixture-lesson", evidence: { verifiedAt: "2026-10-04" } };
  const liveHash = "0123456789abcdef";

  it("ACCEPTS a legitimately authorized sign-off at the current hash", () => {
    const entry = ledgerEntryFor(
      "lesson", fixtureItem, 1, liveHash,
      /* prior */ undefined,
      /* reviewedNow */ new Set(["lesson:fixture-lesson"]),
      /* signoffDate */ "2026-10-04",
    );
    expect(entry.reviewedHash).toBe(liveHash);
    expect(entry.reviewedAt).toBe("2026-10-04");
    expect(grants(entry.reviewedHash, liveHash)).toBe(true);
  });

  it("REJECTS a stale sign-off: a content edit (new hash) no longer matches the ledger", () => {
    const entry = ledgerEntryFor(
      "lesson", fixtureItem, 1, liveHash, undefined,
      new Set(["lesson:fixture-lesson"]), "2026-10-04",
    );
    const editedHash = "fedcba9876543210"; // content changed after review
    expect(grants(entry.reviewedHash, editedHash)).toBe(false);
  });

  it("REJECTS an unauthorized item: not in reviewedNow and no prior => sentinel, never granted", () => {
    const entry = ledgerEntryFor(
      "lesson", fixtureItem, 1, liveHash, undefined,
      /* reviewedNow (empty) */ new Set<string>(), "2026-10-04",
    );
    expect(entry.reviewedHash).toBe(UNREVIEWED_SENTINEL);
    expect(grants(entry.reviewedHash, liveHash)).toBe(false);
  });

  it("REJECTS a sign-off dated before the content's verifiedAt (clock-defect guard)", () => {
    expect(() =>
      assertSignoffNotBeforeVerified("lesson:fixture-lesson", fixtureItem, "2026-09-01"),
    ).toThrow(/before the content's verifiedAt/i);
  });
});
