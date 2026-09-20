/**
 * Verifies runnable exercises via the real registry (no regex): for every
 * registered lesson/pattern exercise that has a `tests` snippet, run
 * `expected + tests` on the bundled Pyodide and assert the authored MODEL
 * answer passes its own tests. A model answer that fails its tests is a bug.
 *
 * (R6 will make the count of runnable coding exercises much larger and add the
 * mistake-rejection checks; this script is the model-answer half.)
 *
 * Run:  node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_exercise_tests.mjs
 */
import { loadCurriculum, collectExercises } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";

const curriculum = await loadCurriculum();
let failures = curriculum.errors.length;
for (const e of curriculum.errors) console.log(`  ✗ STRUCTURE: ${e}`);

const all = collectExercises(curriculum);
const runnable = all.filter((r) => typeof r.exercise.tests === "string" && r.exercise.tests.length > 0);

console.log(`Runnable exercises (with tests): ${runnable.length} of ${all.length} total exercises`);

for (const { ownerKind, ownerId, exercise } of runnable) {
  if (typeof exercise.expected !== "string") {
    failures++;
    console.log(`  ✗ ${ownerKind}:${ownerId}:${exercise.id} — has tests but no string 'expected' model answer`);
    continue;
  }
  const source = `${exercise.expected}\n\n# --- tests ---\n${exercise.tests}\n`;
  const res = await runProgram(source);
  if (res.status === "completed") {
    console.log(`  ✓ ${ownerKind}:${ownerId}:${exercise.id} — model answer passes its tests`);
  } else {
    failures++;
    console.log(`  ✗ ${ownerKind}:${ownerId}:${exercise.id} — status=${res.status}`);
    if (res.error) console.log(`      error: ${JSON.stringify(res.error)}`);
  }
}

console.log(failures === 0 ? "\nALL RUNNABLE EXERCISES OK" : `\n${failures} EXERCISE FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
