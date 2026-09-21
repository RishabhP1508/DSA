// @vitest-environment node
/**
 * R5.7 amendment — contentHashOf must cover ALL learner-facing claim-bearing
 * fields, so editing any of them invalidates prior verification/semantic-review
 * evidence. These tests mutate each such field (one at a time) on a real lesson
 * and a real pattern and assert the hash changes. In particular they lock in the
 * fields that were previously OMITTED: lesson `explanation`, `review`,
 * `complexity` summary; pattern `summary`, `naiveApproach`, `whyItHelps`,
 * `complexityNote`.
 */
import { describe, it, expect } from "vitest";
import { lessons, patterns } from "./registry";
// @ts-expect-error - .mjs helper without types
import { contentHashOf } from "../../scripts/lib/content-hash.mjs";
import type { LessonDefinition, PatternDefinition } from "../core/types";

const lesson = lessons.find((l) => l.id === "prefix-sums")! as LessonDefinition;
const pattern = patterns.find((p) => p.id === "sliding-window")! as PatternDefinition;

/** Deep-ish clone sufficient for these mutations. */
function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

describe("R5.7 contentHashOf — lesson learner-facing fields all affect the hash", () => {
  const base = contentHashOf(lesson);

  const lessonMutations: { name: string; mutate: (l: LessonDefinition) => void }[] = [
    { name: "explanation (bridge prose lives here)", mutate: (l) => { l.explanation += " EDIT"; } },
    { name: "review", mutate: (l) => { l.review += " EDIT"; } },
    { name: "title", mutate: (l) => { l.title += " EDIT"; } },
    { name: "complexity summary table", mutate: (l) => { l.complexity = [...l.complexity, { operation: "EDIT", worst: "O(x)" }]; } },
    { name: "complexityExplanation.time.explanation", mutate: (l) => { l.complexityExplanation!.time.explanation += " EDIT"; } },
    { name: "concepts.commonMistakes", mutate: (l) => { l.concepts.commonMistakes += " EDIT"; } },
    { name: "vocabulary", mutate: (l) => { l.vocabulary = [...l.vocabulary, { term: "EDIT", definition: "x" }]; } },
    { name: "experiments", mutate: (l) => { l.experiments = [...l.experiments, "EDIT"]; } },
    { name: "an exercise prompt", mutate: (l) => { l.exercises[0].prompt += " EDIT"; } },
    { name: "code", mutate: (l) => { l.code += "\n# EDIT"; } },
    { name: "a codeExplanation", mutate: (l) => { l.codeExplanations[0].explanation += " EDIT"; } },
    { name: "expectedOutput", mutate: (l) => { l.expectedOutput += "EDIT"; } },
    { name: "bindings", mutate: (l) => { l.bindings = [...l.bindings, { variable: "EDIT", model: "array" }]; } },
    { name: "references", mutate: (l) => { l.references[0].accessDate = "2000-01-01"; } },
  ];

  for (const m of lessonMutations) {
    it(`editing ${m.name} changes the hash`, () => {
      const c = clone(lesson);
      m.mutate(c);
      expect(contentHashOf(c), `${m.name} must invalidate the hash`).not.toBe(base);
    });
  }

  it("an unrelated no-op leaves the hash unchanged (stability)", () => {
    const c = clone(lesson);
    expect(contentHashOf(c)).toBe(base);
  });
});

describe("R5.7 contentHashOf — pattern learner-facing fields all affect the hash", () => {
  const base = contentHashOf(pattern);

  const patternMutations: { name: string; mutate: (p: PatternDefinition) => void }[] = [
    { name: "summary", mutate: (p) => { p.summary += " EDIT"; } },
    { name: "naiveApproach", mutate: (p) => { p.naiveApproach += " EDIT"; } },
    { name: "whyItHelps", mutate: (p) => { p.whyItHelps += " EDIT"; } },
    { name: "complexityNote", mutate: (p) => { p.complexityNote = (p.complexityNote ?? "") + " EDIT"; } },
    { name: "title", mutate: (p) => { p.title += " EDIT"; } },
    { name: "clues", mutate: (p) => { p.clues = [...p.clues, "EDIT"]; } },
    { name: "conditions", mutate: (p) => { p.conditions = [...p.conditions, "EDIT"]; } },
    { name: "counterexamples", mutate: (p) => { p.counterexamples = [...p.counterexamples, "EDIT"]; } },
    { name: "walkthroughCode", mutate: (p) => { p.walkthroughCode += "\n# EDIT"; } },
    { name: "complexityExplanation.time.bound", mutate: (p) => { p.complexityExplanation!.time.bound += "EDIT"; } },
  ];

  for (const m of patternMutations) {
    it(`editing ${m.name} changes the hash`, () => {
      const c = clone(pattern);
      m.mutate(c);
      expect(contentHashOf(c), `${m.name} must invalidate the hash`).not.toBe(base);
    });
  }
});
