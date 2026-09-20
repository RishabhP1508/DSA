/**
 * R5 verification: every line of every lesson `code` and every pattern
 * `walkthroughCode` MUST have a `codeExplanations` entry, and NO explanation may
 * point beyond the last line of the code.
 *
 * This closes the "missing line explanations" gap the audit called out: the
 * structural loader only checked that codeExplanations was NON-EMPTY, not that
 * it COVERED every line. A dropped final-line explanation or a stale off-by-one
 * entry now fails the run instead of shipping silently.
 *
 * Loads the REAL registry (no regex, no silent skip): a malformed/unregistered
 * item fails. Wired into `npm run test:curriculum`.
 *
 * Run:  node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_line_explanations.mjs
 */
import { loadCurriculum } from "./lib/load-curriculum.mjs";

const { lessons, patterns, errors } = await loadCurriculum();

let failures = errors.length;
for (const e of errors) console.log(`  ✗ STRUCTURE: ${e}`);

function check(kind, id, code, explanations) {
  const total = code.split("\n").length;
  const byLine = new Map();
  for (const ce of explanations ?? []) {
    if (typeof ce.line !== "number") {
      failures++;
      console.log(`  ✗ ${kind} ${id}: a codeExplanation has a non-numeric line`);
      continue;
    }
    if (typeof ce.executable !== "boolean") {
      failures++;
      console.log(`  ✗ ${kind} ${id}: line ${ce.line} explanation missing boolean 'executable'`);
    }
    byLine.set(ce.line, ce);
  }

  const missing = [];
  for (let ln = 1; ln <= total; ln++) if (!byLine.has(ln)) missing.push(ln);

  const outOfRange = [...byLine.keys()].filter((ln) => ln < 1 || ln > total).sort((a, b) => a - b);

  // Blank source lines must be marked non-executable (a blank line produces no runtime event).
  const codeLines = code.split("\n");
  const blankButExecutable = [];
  for (let ln = 1; ln <= total; ln++) {
    const ce = byLine.get(ln);
    if (ce && codeLines[ln - 1].trim() === "" && ce.executable === true) blankButExecutable.push(ln);
  }

  if (missing.length || outOfRange.length || blankButExecutable.length) {
    failures++;
    let msg = `  ✗ ${kind} ${id}: ${total} code lines, ${byLine.size} explained`;
    if (missing.length) msg += `; MISSING [${missing.join(", ")}]`;
    if (outOfRange.length) msg += `; OUT-OF-RANGE [${outOfRange.join(", ")}]`;
    if (blankButExecutable.length) msg += `; BLANK-BUT-EXECUTABLE [${blankButExecutable.join(", ")}]`;
    console.log(msg);
  } else {
    console.log(`  ✓ ${kind} ${id} — ${total} lines all explained`);
  }
}

for (const l of lessons) check("lesson", l.id, l.code, l.codeExplanations);
for (const p of patterns) check("pattern", p.id, p.walkthroughCode, p.codeExplanations);

console.log(
  failures === 0
    ? `\nALL LINE EXPLANATIONS OK (${lessons.length} lessons, ${patterns.length} patterns)`
    : `\n${failures} LINE-EXPLANATION FAILURE(S)`,
);
process.exit(failures === 0 ? 0 : 1);
