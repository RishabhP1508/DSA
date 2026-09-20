/**
 * R5.1 / R5.7 — deterministic content hash for a lesson or pattern.
 *
 * The hash covers exactly the fields whose change must INVALIDATE prior
 * verification evidence: the source code, the supported input, the expected
 * output, the per-line explanations, the visual bindings, the exercises, the
 * references, and the structured complexity explanation. A change to any of
 * these produces a different hash, so a stored `evidence.contentHash` that no
 * longer matches signals stale evidence.
 *
 * It intentionally does NOT hash prose like `explanation`/`review` narration
 * that does not carry a testable claim on its own — but DOES hash the concept
 * fields and vocabulary that state teaching claims. Kept conservative: when in
 * doubt, include the field (a false "stale" is safe; a false "fresh" is not).
 *
 * Uses SHA-256 over a canonical JSON projection (sorted keys) so the hash is
 * stable across runs and platforms.
 */
import { createHash } from "node:crypto";

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = canonical(value[key]);
    return out;
  }
  return value;
}

/** Build the hashable projection of a lesson. */
function lessonProjection(l) {
  return {
    id: l.id,
    code: l.code,
    stdin: l.stdin ?? null,
    expectedOutput: l.expectedOutput,
    codeExplanations: l.codeExplanations,
    bindings: l.bindings,
    bindingsRationale: l.bindingsRationale ?? null,
    concepts: l.concepts,
    vocabulary: l.vocabulary,
    exercises: l.exercises,
    prediction: l.prediction,
    complexityExplanation: l.complexityExplanation ?? null,
    references: l.references,
  };
}

/** Build the hashable projection of a pattern. */
function patternProjection(p) {
  return {
    id: p.id,
    walkthroughCode: p.walkthroughCode,
    walkthroughStdin: p.walkthroughStdin ?? null,
    walkthroughExpectedOutput: p.walkthroughExpectedOutput,
    codeExplanations: p.codeExplanations,
    bindings: p.bindings,
    bindingsRationale: p.bindingsRationale ?? null,
    clues: p.clues,
    conditions: p.conditions,
    alternatives: p.alternatives,
    counterexamples: p.counterexamples,
    exercises: p.exercises,
    complexityExplanation: p.complexityExplanation ?? null,
    references: p.references,
  };
}

/** True if the item is a pattern (has walkthroughCode). */
function isPattern(item) {
  return typeof item.walkthroughCode === "string";
}

/** Deterministic SHA-256 (hex, first 16 chars) of a lesson or pattern's content. */
export function contentHashOf(item) {
  const projection = isPattern(item) ? patternProjection(item) : lessonProjection(item);
  const json = JSON.stringify(canonical(projection));
  return createHash("sha256").update(json).digest("hex").slice(0, 16);
}
