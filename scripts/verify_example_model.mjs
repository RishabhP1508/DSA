/**
 * R5.1 verification — the shared executable-example model (FULL contract).
 *
 * Every lesson that ships an executable `code` example, and every pattern that
 * ships a full `walkthroughCode` implementation, must carry a COMPLETE authored
 * example model. This validates, via scripts/lib/example-model.mjs:
 *   - source code + (optional) supported input;
 *   - expected output (non-empty);
 *   - an explanation for EVERY displayed source line (no gaps / out-of-range);
 *   - visual bindings OR a documented bindingsRationale for their absence;
 *   - analysis scope + input-size variables;
 *   - time and space explanations (no placeholder text);
 *   - preconditions (complexityExplanation.assumptions) and edge cases;
 *   - references with url + accessDate + >=1 verifiedClaim;
 *   - verification evidence (evidence.contentHash) tied to the CURRENT content
 *     revision — STALE evidence (hash mismatch) fails.
 *
 * It rejects empty arrays, placeholder text, missing expected output, and stale
 * evidence. It does NOT prove the Big-O CLAIM itself (human review / R7).
 *
 * Loads the REAL registry (no silent skip). Wired into `npm run test:curriculum`.
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_example_model.mjs
 */
import { loadCurriculum } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";
import { validateExample } from "./lib/example-model.mjs";

const { lessons, patterns, errors } = await loadCurriculum();

let failures = errors.length;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);

function executedLines(res) {
  const set = new Set();
  for (const ev of res.events) if (ev.kind === "line") set.add(ev.line);
  return set;
}

/** Normalize a lesson into the example view the validator expects. */
function lessonExample(l) {
  return {
    id: l.id,
    kind: "lesson",
    code: l.code,
    stdin: l.stdin,
    expectedOutput: l.expectedOutput,
    codeExplanations: l.codeExplanations,
    bindings: l.bindings,
    bindingsRationale: l.bindingsRationale,
    complexityExplanation: l.complexityExplanation,
    references: l.references,
    edgeCases: l.concepts?.edgeCases,
    item: l,
  };
}

/** Normalize a pattern into the example view the validator expects. */
function patternExample(p) {
  return {
    id: p.id,
    kind: "pattern",
    code: p.walkthroughCode,
    stdin: p.walkthroughStdin,
    expectedOutput: p.walkthroughExpectedOutput,
    codeExplanations: p.codeExplanations,
    bindings: p.bindings,
    bindingsRationale: p.bindingsRationale,
    complexityExplanation: p.complexityExplanation,
    references: p.references,
    // A pattern's edge-case coverage lives in its counterexamples + conditions.
    edgeCases: [...(p.counterexamples ?? []), ...(p.conditions ?? [])],
    item: p,
  };
}

async function run(example) {
  const res = await runProgram(example.code, example.stdin ?? "");
  const executed = res.status === "completed" ? executedLines(res) : null;
  const problems = validateExample(example, executed);
  if (res.status !== "completed") problems.unshift(`${example.kind} ${example.id}: program did not complete (${res.status})`);
  return problems;
}

for (const l of lessons) {
  const problems = await run(lessonExample(l));
  if (problems.length) { failures += problems.length; for (const p of problems) console.log(`  ✗ ${p}`); }
  else console.log(`  ✓ lesson ${l.id} — full example model`);
}

for (const p of patterns) {
  const problems = await run(patternExample(p));
  if (problems.length) { failures += problems.length; for (const pr of problems) console.log(`  ✗ ${pr}`); }
  else console.log(`  ✓ pattern ${p.id} — full example model`);
}

console.log(
  failures === 0
    ? `\nEXAMPLE MODEL OK (${lessons.length} lessons, ${patterns.length} patterns)`
    : `\n${failures} EXAMPLE-MODEL FAILURE(S)`,
);
process.exit(failures === 0 ? 0 : 1);
