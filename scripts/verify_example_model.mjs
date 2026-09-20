/**
 * R5.1 verification — the shared executable-example model.
 *
 * Every lesson that ships an executable `code` example, and every pattern that
 * ships a full `walkthroughCode` implementation, must carry a COMPLETE authored
 * example model, not just a one-line note. Specifically each executable example
 * must have:
 *   - a structured `complexityExplanation` with input-size variables, a time
 *     bound + explanation, a space bound + explanation, a non-empty line-linked
 *     derivation, and non-empty assumptions;   [R5.1.1, R5.1.2]
 *   - every derivation line and counter line within the code's line range, and
 *     (for patterns) counters that actually execute on the walkthrough input;
 *   - at least one reference with a real URL and an accessDate.   [R5.5]
 *
 * A standalone `complexityNote` is INSUFFICIENT for a full supplied
 * implementation (R5.1.2): patterns must graduate to a `complexityExplanation`.
 *
 * Loads the REAL registry (no silent skip). Wired into `npm run test:curriculum`.
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_example_model.mjs
 *
 * This checks the example model is STRUCTURALLY COMPLETE and internally
 * consistent (lines in range, counters execute). It does NOT prove the Big-O
 * claim is correct — that is human review / R7.
 */
import { loadCurriculum } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";

const { lessons, patterns, errors } = await loadCurriculum();

let failures = errors.length;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);

function executedLines(res) {
  const set = new Set();
  for (const ev of res.events) if (ev.kind === "line") set.add(ev.line);
  return set;
}

function checkComplexity(kind, id, code, cx, executed) {
  const lineCount = code.split("\n").length;
  const problems = [];
  if (!cx) { problems.push("no complexityExplanation (a bare note is insufficient for a full implementation)"); return problems; }
  if (!cx.variables || cx.variables.length === 0) problems.push("no input-size variables");
  if (!cx.time?.bound) problems.push("no time.bound");
  if (!cx.time?.explanation) problems.push("no time.explanation");
  if (!cx.space?.bound) problems.push("no space.bound");
  if (!cx.space?.explanation) problems.push("no space.explanation");
  if (!cx.derivation || cx.derivation.length === 0) problems.push("empty derivation");
  if (!cx.assumptions || cx.assumptions.length === 0) problems.push("no assumptions");
  for (const d of cx.derivation ?? []) {
    for (const ln of d.lines ?? []) {
      if (ln < 1 || ln > lineCount) problems.push(`derivation line ${ln} out of range (1..${lineCount})`);
    }
  }
  for (const c of cx.counters ?? []) {
    for (const ln of c.countLines ?? []) {
      if (ln < 1 || ln > lineCount) problems.push(`counter "${c.label}" line ${ln} out of range`);
    }
    if (executed) {
      const anyExecuted = (c.countLines ?? []).some((ln) => executed.has(ln));
      if (!anyExecuted) problems.push(`counter "${c.label}" countLines [${c.countLines}] never executed`);
    }
  }
  return problems;
}

function checkReferences(refs) {
  if (!Array.isArray(refs) || refs.length === 0) return ["no references"];
  const problems = [];
  for (const r of refs) {
    if (!r.url || !/^https?:\/\//.test(r.url)) problems.push(`reference missing/invalid url: ${JSON.stringify(r.url)}`);
    if (!r.accessDate) problems.push(`reference ${r.url} missing accessDate`);
  }
  return problems;
}

// --- Lessons: executable code example must carry the full model. ---
for (const l of lessons) {
  const problems = [];
  const res = await runProgram(l.code, l.stdin ?? "");
  const executed = res.status === "completed" ? executedLines(res) : null;
  problems.push(...checkComplexity("lesson", l.id, l.code, l.complexityExplanation, executed));
  problems.push(...checkReferences(l.references));
  if (problems.length) { failures += problems.length; console.log(`  ✗ lesson ${l.id}: ${problems.join("; ")}`); }
  else console.log(`  ✓ lesson ${l.id} — full example model`);
}

// --- Patterns: a full walkthrough implementation must carry a structured
//     complexityExplanation (R5.1.2), not just complexityNote. ---
for (const p of patterns) {
  const problems = [];
  const res = await runProgram(p.walkthroughCode, p.walkthroughStdin ?? "");
  const executed = res.status === "completed" ? executedLines(res) : null;
  if (res.status !== "completed") problems.push(`walkthrough did not complete (${res.status})`);
  problems.push(...checkComplexity("pattern", p.id, p.walkthroughCode, p.complexityExplanation, executed));
  problems.push(...checkReferences(p.references));
  if (problems.length) { failures += problems.length; console.log(`  ✗ pattern ${p.id}: ${problems.join("; ")}`); }
  else console.log(`  ✓ pattern ${p.id} — full example model`);
}

console.log(
  failures === 0
    ? `\nEXAMPLE MODEL OK (${lessons.length} lessons, ${patterns.length} patterns)`
    : `\n${failures} EXAMPLE-MODEL FAILURE(S)`,
);
process.exit(failures === 0 ? 0 : 1);
