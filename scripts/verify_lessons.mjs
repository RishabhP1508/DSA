/**
 * Verifies every REGISTERED lesson: runs its `code` on the bundled Pyodide and
 * asserts the real stdout equals `expectedOutput`.
 *
 * The lessons come from the real `registry.ts` (via the TS resolver hook), not
 * a regex over files — so a lesson can never silently drop out of the count, and
 * a malformed/unregistered lesson fails the run.
 *
 * Run:  node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_lessons.mjs
 * (or `npm run test:curriculum`, which wires the flags for you.)
 *
 * A matching stdout proves the program runs and prints as expected. It does NOT
 * prove the visualization, complexity claim, or exercises are correct.
 */
import { loadCurriculum } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";

const { lessons, errors } = await loadCurriculum();

let failures = errors.length;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);

for (const lesson of lessons) {
  const res = await runProgram(lesson.code, lesson.stdin ?? "");
  const ok = res.status === "completed" && res.stdout === lesson.expectedOutput;
  if (ok) {
    console.log(`  ✓ ${lesson.id} — output matches (${res.events.length} events)`);
  } else {
    failures++;
    console.log(`  ✗ ${lesson.id} — status=${res.status}`);
    console.log(`      expected: ${JSON.stringify(lesson.expectedOutput)}`);
    console.log(`      actual:   ${JSON.stringify(res.stdout)}`);
    if (res.error) console.log(`      error: ${JSON.stringify(res.error)}`);
  }
}

console.log(
  failures === 0
    ? `\nALL ${lessons.length} LESSON OUTPUTS OK`
    : `\n${failures} LESSON FAILURE(S) across ${lessons.length} lessons`,
);
process.exit(failures === 0 ? 0 : 1);
