/**
 * R6 — runnable-exercise verifier + mistake-rejection harness.
 *
 * For every registered coding exercise that carries a `tests` snippet, this
 * script runs on the bundled Pyodide runtime and asserts (via the SAME tracer
 * the browser worker uses):
 *
 *   1. MODEL PASSES        — `expected + tests` completes cleanly (R6.1.2).
 *   2. STARTER FAILS       — `starterCode + tests` does NOT pass (R6.3.1). The
 *                            unfinished starter is a genuine, independent wrong
 *                            attempt.
 *   3. PRINT-ANSWER FAILS  — a program that only prints a guessed answer does
 *                            not pass (R6.2.2 / R6.3.1), where synthesisable.
 *   4. EARLY-EXIT FAILS    — returning before doing the work does not pass
 *                            (R6.2.1 / R6.3.1), where synthesisable.
 *   5. PLAUSIBLE-WRONG FAILS — a targeted single-corruption of the model is
 *                            rejected (R6.3.1/R6.3.2), where synthesisable.
 *
 * A "pass" means the tracer reports `status === "completed"` (no assertion or
 * error fired). A rejection means any non-completed status (error/AssertionError
 * /timeout/limit).
 *
 * R6.4 (amended): every CODING exercise (complete-code / fix-mistake) MUST carry
 * an INDEPENDENTLY AUTHORED faulty-variant set in
 * src/content/exercise-faulty-variants.ts — plausibleWrong, earlyExit, and
 * printAnswer — and the tests MUST reject the unfinished starter AND all three
 * authored variants plus the empty program. A missing authored variant, or any
 * variant that passes, is a HARD FAILURE. Synthesised variants and "n/a" no
 * longer count toward satisfying a required case.
 *
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs \
 *        scripts/verify_exercise_tests.mjs
 */
import { loadCurriculum, collectExercises } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";
import { synthEmpty } from "./lib/mistake-variants.mjs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const R6_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { validateRecognition, gradeRecognition } = await import(
  pathToFileURL(path.join(R6_ROOT, "src/core/recognition-grading.ts")).href
);
// R6.4 — INDEPENDENTLY AUTHORED faulty variants, one set per coding exercise.
const { EXERCISE_FAULTY } = await import(
  pathToFileURL(path.join(R6_ROOT, "src/content/exercise-faulty-variants.ts")).href
);

const curriculum = await loadCurriculum();
let failures = curriculum.errors.length;
for (const e of curriculum.errors) console.log(`  ✗ STRUCTURE: ${e}`);

const all = collectExercises(curriculum);
const runnable = all.filter(
  (r) => typeof r.exercise.tests === "string" && r.exercise.tests.length > 0,
);
const coding = all.filter(
  (r) => r.exercise.kind === "complete-code" || r.exercise.kind === "fix-mistake",
);

console.log(
  `Runnable exercises (with tests): ${runnable.length} of ${all.length} total ` +
    `(${coding.length} coding exercises; ${coding.filter((r) => r.exercise.tests).length} of them runnable)`,
);

/** Run `prelude + code + tests` and return true iff it completed cleanly. */
async function passes(code, tests, prelude) {
  const pre = prelude ? `${prelude}\n` : "";
  const source = `${pre}${code}\n\n# --- tests ---\n${tests}\n`;
  const res = await runProgram(source);
  return res.status === "completed";
}

let modelOk = 0;
// R6.4 per-variant rejection tallies (coding exercises only).
const tally = { coding: 0, starter: 0, empty: 0, plausibleWrong: 0, earlyExit: 0, printAnswer: 0 };
for (const { ownerKind, ownerId, exercise } of runnable) {
  const uid = `${ownerKind}:${ownerId}:${exercise.id}`;
  const tests = exercise.tests;
  const prelude = exercise.preludeCode;

  if (typeof exercise.expected !== "string") {
    failures++;
    console.log(`  ✗ ${uid} — has tests but no string 'expected' model answer`);
    continue;
  }

  // 1. Model must pass.
  const model = await passes(exercise.expected, tests, prelude);
  if (!model) {
    failures++;
    console.log(`  ✗ ${uid} — MODEL answer does NOT pass its own tests`);
    continue;
  }
  modelOk++;

  // 2. Unfinished starter must be rejected (universal).
  const results = [];
  if (typeof exercise.starterCode === "string" && exercise.starterCode.length) {
    const starterPass = await passes(exercise.starterCode, tests, prelude);
    if (starterPass) {
      failures++;
      console.log(`  ✗ ${uid} — UNFINISHED starter incorrectly PASSES (hollow tests)`);
      continue;
    }
    results.push("starter✗");
    tally.starter++;
  } else {
    failures++;
    console.log(`  ✗ ${uid} — no starterCode to prove starter-rejection`);
    continue;
  }

  // 3. Empty program must be rejected (universal floor).
  let exerciseFailed = false;
  if (await passes(synthEmpty(), tests, prelude)) {
    failures++;
    exerciseFailed = true;
    console.log(`  ✗ ${uid} — empty program incorrectly PASSES (hollow tests)`);
  } else {
    results.push("empty✗");
    tally.empty++;
  }

  // 4–6. INDEPENDENTLY AUTHORED faulty variants (R6.4). Every CODING exercise
  // MUST provide all three; each MUST be rejected. No synthesis, no n/a.
  const isCoding = exercise.kind === "complete-code" || exercise.kind === "fix-mistake";
  if (isCoding) {
    tally.coding++;
    const faulty = EXERCISE_FAULTY[uid];
    if (!faulty) {
      failures++;
      exerciseFailed = true;
      console.log(`  ✗ ${uid} — coding exercise has NO authored faulty variants (R6.4 requires plausibleWrong/earlyExit/printAnswer)`);
    } else {
      for (const label of ["plausibleWrong", "earlyExit", "printAnswer"]) {
        const variant = faulty[label];
        if (typeof variant !== "string" || variant.length === 0) {
          failures++;
          exerciseFailed = true;
          console.log(`  ✗ ${uid} — missing authored '${label}' variant`);
          continue;
        }
        if (await passes(variant, tests, prelude)) {
          failures++;
          exerciseFailed = true;
          console.log(`  ✗ ${uid} — authored '${label}' variant incorrectly PASSES (tests do not catch it)`);
        } else {
          results.push(`${label}✗`);
          tally[label]++;
        }
      }
    }
  }
  if (exerciseFailed) continue;

  console.log(`  ✓ ${uid} — model passes; rejects [${results.join(", ")}]`);
}

console.log(
  `\nModel solutions passing: ${modelOk}/${runnable.length}. ` +
    (failures === 0 ? "ALL RUNNABLE EXERCISES OK" : `${failures} FAILURE(S)`),
);
// R6.4 per-variant rejection totals (coding exercises). Each count is the number
// of coding exercises whose tests rejected that AUTHORED variant.
console.log(
  `R6.4 mistake-rejection (coding=${tally.coding}): ` +
    `starter-rejected ${tally.starter}/${tally.coding}, ` +
    `empty-rejected ${tally.empty}/${tally.coding}, ` +
    `plausible-wrong-rejected ${tally.plausibleWrong}/${tally.coding}, ` +
    `early-exit-rejected ${tally.earlyExit}/${tally.coding}, ` +
    `print-answer-rejected ${tally.printAnswer}/${tally.coding}.`,
);

// ── R6.4: validate every authored recognition-grading block ────────────────
const withRecognition = all.filter((r) => r.exercise.recognition);
let recFailures = 0;
for (const { ownerKind, ownerId, exercise } of withRecognition) {
  const uid = `${ownerKind}:${ownerId}:${exercise.id}`;
  const problems = validateRecognition(exercise.recognition);
  if (problems.length) {
    recFailures++;
    for (const p of problems) console.log(`  ✗ ${uid} — recognition: ${p}`);
    continue;
  }
  // Behavioural sanity: the acceptable approach + a required reason must grade
  // as accepted, and at least one contradictory reason must be rejected.
  const g = exercise.recognition;
  const okApproach = g.acceptableApproachIds[0];
  const okReason = g.approaches.find((a) => a.id === okApproach).requiredReasonIds[0];
  if (gradeRecognition(g, okApproach, okReason).outcome !== "accepted") {
    recFailures++;
    console.log(`  ✗ ${uid} — recognition: acceptable pair did not grade as accepted`);
    continue;
  }
  const bad = g.reasons.find((r) => r.contradictory);
  if (bad && gradeRecognition(g, okApproach, bad.id).outcome !== "rejected") {
    recFailures++;
    console.log(`  ✗ ${uid} — recognition: contradictory reason was not rejected`);
    continue;
  }
  console.log(`  ✓ ${uid} — recognition grading validates`);
}
console.log(
  `\nRecognition-graded exercises: ${withRecognition.length}. ` +
    (recFailures === 0 ? "ALL RECOGNITION OK" : `${recFailures} RECOGNITION FAILURE(S)`),
);

// ── R6.5: hint-progression report ──────────────────────────────────────────
// Every interactive exercise (runnable or recognition) MUST have at least a
// staged 3-hint progression (understand -> property -> solution); the authored
// target is the full 6-stage set. This section FAILS an interactive exercise
// with fewer than 3 distinct, non-empty hints, and reports how many reach the
// full >=5-stage progression.
const interactive = all.filter((r) => r.exercise.tests || r.exercise.recognition);
let hintFailures = 0;
let fullProgression = 0;
for (const { ownerKind, ownerId, exercise } of interactive) {
  const uid = `${ownerKind}:${ownerId}:${exercise.id}`;
  const hints = (exercise.hints ?? []).map((h) => (h ?? "").trim()).filter(Boolean);
  const distinct = new Set(hints);
  if (hints.length < 3 || distinct.size < 3) {
    hintFailures++;
    console.log(`  ✗ ${uid} — needs >=3 distinct staged hints, has ${distinct.size}`);
  } else if (hints.length >= 5) {
    fullProgression++;
  }
}
console.log(
  `\nInteractive exercises: ${interactive.length}; full 6-stage progression: ${fullProgression}; ` +
    (hintFailures === 0
      ? "all have >=3 staged hints — HINTS OK"
      : `${hintFailures} HINT FAILURE(S)`),
);

process.exit(failures === 0 && recFailures === 0 && hintFailures === 0 ? 0 : 1);
