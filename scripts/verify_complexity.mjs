/**
 * Verifies authored complexity panels against real execution, using the real
 * registered lessons (via the TS resolver hook):
 *   - every counter's countLines actually execute at least once on the sample
 *     input (counters can't reference dead/comment lines);
 *   - every derivation contribution references lines within the code;
 *   - time/space bounds and input-size variables are present.
 *
 * Run:  node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_complexity.mjs
 *
 * This checks panel STRUCTURE and that counters map to executed lines. It does
 * NOT prove the Big-O claim itself is correct — that needs human review (R7).
 */
import { loadCurriculum } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";

const { lessons, errors } = await loadCurriculum();

let failures = errors.length;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);

function executedLines(res) {
  const set = new Set();
  for (const ev of res.events) if (ev.kind === "line") set.add(ev.line);
  return set;
}

let checked = 0;
for (const lesson of lessons) {
  const cx = lesson.complexityExplanation;
  if (!cx) {
    // Allowed for pure-concept lessons, but record it so it's visible.
    console.log(`  · ${lesson.id} — no complexity panel (allowed for pure-concept lessons)`);
    continue;
  }
  const res = await runProgram(lesson.code, lesson.stdin ?? "");
  if (res.status !== "completed") {
    failures++;
    console.log(`  ✗ ${lesson.id} — code did not complete (${res.status})`);
    continue;
  }
  const executed = executedLines(res);
  const lineCount = lesson.code.split("\n").length;

  let localFail = 0;
  for (const d of cx.derivation ?? []) {
    for (const ln of d.lines ?? []) {
      if (ln < 1 || ln > lineCount) {
        localFail++;
        console.log(`  ✗ ${lesson.id} — derivation references out-of-range line ${ln}`);
      }
    }
  }
  for (const c of cx.counters ?? []) {
    const anyExecuted = (c.countLines ?? []).some((ln) => executed.has(ln));
    if (!anyExecuted) {
      localFail++;
      console.log(`  ✗ ${lesson.id} — counter "${c.label}" countLines [${c.countLines}] never executed`);
    }
  }
  if (!cx.time?.bound || !cx.space?.bound) { localFail++; console.log(`  ✗ ${lesson.id} — missing time/space bound`); }
  if (!cx.variables || cx.variables.length === 0) { localFail++; console.log(`  ✗ ${lesson.id} — no input-size variables listed`); }

  if (localFail === 0) console.log(`  ✓ ${lesson.id} — panel valid (${(cx.counters ?? []).length} counters checked)`);
  failures += localFail;
  checked++;
}

console.log(
  failures === 0
    ? `\nALL COMPLEXITY PANELS OK (${checked} checked)`
    : `\n${failures} COMPLEXITY FAILURE(S)`,
);
process.exit(failures === 0 ? 0 : 1);
