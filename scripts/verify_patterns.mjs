/**
 * Verifies every REGISTERED pattern: runs its `walkthroughCode` on the bundled
 * Pyodide and asserts the real stdout equals `walkthroughExpectedOutput`.
 *
 * Patterns come from the real `registry.ts` (via the TS resolver hook), so none
 * can silently drop and a malformed/unregistered pattern fails the run.
 *
 * Run:  node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_patterns.mjs
 */
import { loadCurriculum } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";

const { patterns, errors } = await loadCurriculum();

let failures = errors.length;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);

for (const pat of patterns) {
  const res = await runProgram(pat.walkthroughCode, pat.walkthroughStdin ?? "");
  const ok = res.status === "completed" && res.stdout === pat.walkthroughExpectedOutput;
  if (ok) {
    console.log(`  ✓ ${pat.id} — walkthrough output matches (${res.events.length} events)`);
  } else {
    failures++;
    console.log(`  ✗ ${pat.id} — status=${res.status}`);
    console.log(`      expected: ${JSON.stringify(pat.walkthroughExpectedOutput)}`);
    console.log(`      actual:   ${JSON.stringify(res.stdout)}`);
    if (res.error) console.log(`      error: ${JSON.stringify(res.error)}`);
  }
}

console.log(
  failures === 0
    ? `\nALL ${patterns.length} PATTERN WALKTHROUGHS OK`
    : `\n${failures} PATTERN FAILURE(S) across ${patterns.length} patterns`,
);
process.exit(failures === 0 ? 0 : 1);
