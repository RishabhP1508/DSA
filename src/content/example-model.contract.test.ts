// @vitest-environment node
/**
 * R5.1 — the example-model validator must reject each missing/invalid required
 * field. These are the deliberate-invalidation tests the amendment requires:
 * start from a fully-valid synthetic example, remove/invalidate ONE field at a
 * time, and assert the validator reports a failure mentioning that field.
 *
 * The validator itself lives in scripts/lib/example-model.mjs and is the SAME
 * code the CLI `verify_example_model.mjs` runs against the real registry.
 */
import { describe, it, expect } from "vitest";
// @ts-expect-error - .mjs helper without types
import { validateExample } from "../../scripts/lib/example-model.mjs";
// @ts-expect-error - .mjs helper without types
import { contentHashOf } from "../../scripts/lib/content-hash.mjs";

/** Build a minimal but fully-VALID lesson item + example view. */
function makeValid() {
  const code = "x = 1\nprint(x)";
  const item: Record<string, unknown> = {
    id: "synthetic",
    code,
    stdin: undefined,
    expectedOutput: "1\n",
    codeExplanations: [
      { line: 1, executable: true, explanation: "Assign 1 to x." },
      { line: 2, executable: true, explanation: "Print x." },
    ],
    bindings: [{ variable: "x", model: "object" }],
    concepts: { purpose: "", operations: "", uses: "", tradeoffs: "", commonMistakes: "", edgeCases: "x is a single int." },
    vocabulary: [],
    exercises: [],
    prediction: [],
    complexityExplanation: {
      scope: "program",
      variables: [{ symbol: "n", meaning: "irrelevant here; fixed data" }],
      costModel: "constant work.",
      time: { bound: "O(1)", case: "worst", explanation: "one assignment and one print." },
      space: { bound: "O(1)", case: "worst", explanation: "a single variable." },
      derivation: [{ lines: [1, 2], description: "assign then print.", cost: "O(1)", dimension: "time" }],
      assumptions: ["print and assignment are O(1)."],
    },
    references: [
      { url: "https://docs.python.org/3.14/", title: "Python docs", topic: "x", purpose: "x", verifiedClaims: ["print writes to stdout"], accessDate: "2026-09-20" },
    ],
  };
  // Evidence must be tied to the CURRENT content hash.
  item.evidence = {
    inventoryVersion: 1,
    contentHash: contentHashOf(item),
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
  };
  const example = {
    id: "synthetic",
    kind: "lesson",
    code,
    stdin: undefined,
    expectedOutput: "1\n",
    codeExplanations: item.codeExplanations,
    bindings: item.bindings,
    bindingsRationale: undefined,
    complexityExplanation: item.complexityExplanation,
    references: item.references,
    edgeCases: (item.concepts as { edgeCases: string }).edgeCases,
    item,
  };
  // executed lines = both lines ran.
  return { item, example, executed: new Set([1, 2]) };
}

describe("R5.1 example-model validator — the fully-valid example passes", () => {
  it("passes with no problems", () => {
    const { example, executed } = makeValid();
    expect(validateExample(example, executed)).toEqual([]);
  });
});

describe("R5.1 example-model validator — each invalidated field is rejected", () => {
  // Each case mutates the valid example and asserts a matching failure.
  const cases: { name: string; mutate: (v: ReturnType<typeof makeValid>) => void; expect: RegExp }[] = [
    { name: "missing source code", mutate: (v) => { v.example.code = ""; }, expect: /missing source code/ },
    { name: "missing expected output", mutate: (v) => { (v.example as { expectedOutput?: unknown }).expectedOutput = undefined; }, expect: /missing expectedOutput/ },
    { name: "empty expected output", mutate: (v) => { v.example.expectedOutput = ""; }, expect: /expectedOutput is empty/ },
    { name: "a source line has no explanation", mutate: (v) => { v.example.codeExplanations = [v.example.codeExplanations[0]]; }, expect: /line 2 has no explanation/ },
    { name: "explanation is placeholder", mutate: (v) => { v.example.codeExplanations[1].explanation = "TODO"; }, expect: /placeholder/ },
    { name: "no bindings and no rationale", mutate: (v) => { v.example.bindings = []; v.example.bindingsRationale = undefined; }, expect: /no visual bindings and no documented bindingsRationale/ },
    { name: "no complexityExplanation", mutate: (v) => { v.example.complexityExplanation = undefined; }, expect: /no complexityExplanation/ },
    { name: "invalid analysis scope", mutate: (v) => { (v.example.complexityExplanation as { scope: string }).scope = "nonsense"; }, expect: /scope must be program\|function\|operation/ },
    { name: "no input-size variables", mutate: (v) => { (v.example.complexityExplanation as { variables: unknown[] }).variables = []; }, expect: /no input-size variables/ },
    { name: "no time.explanation", mutate: (v) => { (v.example.complexityExplanation as { time: { explanation?: string } }).time.explanation = ""; }, expect: /no time.explanation/ },
    { name: "no space.explanation", mutate: (v) => { (v.example.complexityExplanation as { space: { explanation?: string } }).space.explanation = ""; }, expect: /no space.explanation/ },
    { name: "empty derivation", mutate: (v) => { (v.example.complexityExplanation as { derivation: unknown[] }).derivation = []; }, expect: /empty derivation/ },
    { name: "no assumptions/preconditions", mutate: (v) => { (v.example.complexityExplanation as { assumptions: unknown[] }).assumptions = []; }, expect: /no assumptions\/preconditions/ },
    { name: "derivation line out of range", mutate: (v) => { (v.example.complexityExplanation as { derivation: { lines: number[] }[] }).derivation[0].lines = [99]; }, expect: /out of range/ },
    { name: "no edge cases", mutate: (v) => { v.example.edgeCases = ""; }, expect: /no edge-case coverage/ },
    { name: "no references", mutate: (v) => { v.example.references = []; }, expect: /no references/ },
    { name: "reference missing accessDate", mutate: (v) => { (v.example.references as { accessDate?: string }[])[0].accessDate = undefined; }, expect: /missing\/invalid accessDate/ },
    { name: "reference missing verifiedClaims", mutate: (v) => { (v.example.references as { verifiedClaims?: unknown[] }[])[0].verifiedClaims = []; }, expect: /no verifiedClaims/ },
    { name: "no evidence", mutate: (v) => { (v.item as { evidence?: unknown }).evidence = undefined; }, expect: /no verification evidence/ },
    { name: "stale evidence (content changed after verification)", mutate: (v) => { v.example.code = "x = 2\nprint(x)"; (v.item as { code: string }).code = "x = 2\nprint(x)"; }, expect: /STALE/ },
    { name: "counter references a line that never executes", mutate: (v) => { (v.example.complexityExplanation as { counters?: unknown[] }).counters = [{ label: "c", definition: "d", countLines: [2] }]; v.executed = new Set([1]); }, expect: /never executed/ },
  ];

  for (const c of cases) {
    it(`rejects: ${c.name}`, () => {
      const v = makeValid();
      c.mutate(v);
      const problems = validateExample(v.example, v.executed);
      expect(problems.length, `expected a failure for "${c.name}"`).toBeGreaterThan(0);
      expect(problems.join("\n")).toMatch(c.expect);
    });
  }
});
