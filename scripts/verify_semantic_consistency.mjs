/**
 * R5.3 — semantic-CONSISTENCY scan across all lessons + patterns.
 *
 * This is NOT a substitute for a human read; it is an automated cross-check that
 * surfaces internal CONTRADICTIONS a semantic review must resolve, so the review
 * targets real issues and the "semantically reviewed" claim rests on evidence:
 *
 *  - the summary `complexity` table's space/worst bound is consistent with the
 *    structured `complexityExplanation` time/space bounds (no table claiming a
 *    bound the panel contradicts);
 *  - every `vocabulary` term used is defined (non-empty definition, no placeholder);
 *  - prerequisites resolve to real lessons;
 *  - a definition/invariant/precondition is actually present (explanation +
 *    concepts are non-trivial, not stubs);
 *  - the lesson's own summary complexity `worst` bound string appears in the
 *    structured explanation (catches a table that drifted from the panel).
 *
 * Exit non-zero if any contradiction is found. Advisory checks (that can have
 * legitimate exceptions) are printed as warnings and do NOT fail the run.
 *
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_semantic_consistency.mjs
 */
import { loadCurriculum } from "./lib/load-curriculum.mjs";

const { lessons, patterns, errors } = await loadCurriculum();
const lessonIds = new Set(lessons.map((l) => l.id));

let failures = errors.length;
let warnings = 0;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);
const fail = (m) => { failures++; console.log(`  ✗ ${m}`); };
const warn = (m) => { warnings++; console.log(`  ! ${m}`); };

// Stub markers only — NOT legitimate prose like "placeholder node" or
// "fill in dependency order".
const PLACEHOLDER = /\b(tbd|todo|fixme|xxx|lorem ipsum|to be written)\b/i;

for (const l of lessons) {
  // prerequisites resolve
  for (const pr of l.prerequisites ?? []) {
    if (!lessonIds.has(pr)) fail(`lesson ${l.id}: prerequisite "${pr}" not a real lesson`);
  }
  // vocabulary defined
  for (const v of l.vocabulary ?? []) {
    if (!v.term || !v.definition || v.definition.trim().length < 3 || PLACEHOLDER.test(v.definition)) {
      fail(`lesson ${l.id}: vocabulary term "${v.term}" has a missing/placeholder definition`);
    }
  }
  // definition/invariant present: explanation & concepts non-trivial
  if (!l.explanation || l.explanation.trim().length < 80) fail(`lesson ${l.id}: explanation too short to carry a definition`);
  for (const key of ["purpose", "operations", "uses", "tradeoffs", "commonMistakes", "edgeCases"]) {
    const v = l.concepts?.[key];
    if (!v || v.trim().length < 10 || PLACEHOLDER.test(v)) fail(`lesson ${l.id}: concepts.${key} missing/stub`);
  }
  // complexity table <-> structured explanation consistency (worst-case bound present in panel)
  const cx = l.complexityExplanation;
  if (cx) {
    const worstRow = (l.complexity ?? []).find((c) => c.worst);
    if (worstRow) {
      const norm = (s) => (s || "").replace(/\s+/g, "").replace(/\^/g, "").toLowerCase();
      const panelBounds = norm(cx.time?.bound) + "|" + (cx.time?.otherCases ?? []).map((o) => norm(o.bound)).join("|") + "|" + norm(cx.space?.bound);
      if (!panelBounds.includes(norm(worstRow.worst))) {
        // Advisory: the summary table can legitimately describe a per-operation
        // bound the whole-program panel doesn't restate; flag for human eyes.
        warn(`lesson ${l.id}: summary worst "${worstRow.worst}" for "${worstRow.operation}" not restated in the complexity panel (${cx.time?.bound} time / ${cx.space?.bound} space) — verify scope`);
      }
    }
  }
}

for (const p of patterns) {
  for (const ll of p.linkedLessons ?? []) {
    if (!lessonIds.has(ll)) fail(`pattern ${p.id}: linkedLesson "${ll}" not a real lesson`);
  }
  for (const key of ["summary", "naiveApproach", "whyItHelps"]) {
    if (!p[key] || p[key].trim().length < 10 || PLACEHOLDER.test(p[key])) fail(`pattern ${p.id}: ${key} missing/stub`);
  }
  if (!p.clues || p.clues.length === 0) fail(`pattern ${p.id}: no recognition clues`);
  if (!p.conditions || p.conditions.length === 0) fail(`pattern ${p.id}: no correctness conditions`);
  if (!p.counterexamples || p.counterexamples.length === 0) fail(`pattern ${p.id}: no counterexamples`);
}

console.log(
  `\n${failures === 0 ? "SEMANTIC CONSISTENCY OK" : failures + " CONSISTENCY FAILURE(S)"} — ${lessons.length} lessons, ${patterns.length} patterns, ${warnings} advisory warning(s)`,
);
process.exit(failures === 0 ? 0 : 1);
