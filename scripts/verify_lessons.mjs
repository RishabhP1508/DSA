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
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const { lessons, errors } = await loadCurriculum();

let failures = errors.length;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);

// R8.1 — validate the prerequisite graph (reject missing ids and cycles) so a
// recommendation can never point at a non-existent or circular prerequisite.
const R8_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { validatePrerequisiteGraph } = await import(
  pathToFileURL(path.join(R8_ROOT, "src/core/learning-path.ts")).href
);
const graphProblems = validatePrerequisiteGraph(
  lessons.map((l) => ({ id: l.id, title: l.title, prerequisites: l.prerequisites ?? [] })),
);
for (const p of graphProblems) {
  failures++;
  console.log(`  ✗ PREREQ: ${p}`);
}
if (graphProblems.length === 0) {
  console.log(`  ✓ prerequisite graph valid (no missing ids, no cycles)`);
}

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
