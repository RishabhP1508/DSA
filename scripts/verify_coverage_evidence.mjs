/**
 * R5.7 — coverage status must be EVIDENCE-BASED.
 *
 * A CoverageEntry may be marked `verified` ONLY when its mapped lesson (and each
 * mapped pattern) carries CURRENT, COMPLETE verification evidence:
 *   - evidence exists;
 *   - evidence.contentHash matches the LIVE content hash (not stale — a source /
 *     teaching-claim / binding / exercise / reference change flips the hash and
 *     therefore invalidates the prior "verified");
 *   - evidence.inventoryVersion equals the current COVERAGE_VERSION;
 *   - all six aspect checks (content, implementation, visualization, exercise,
 *     complexity, references) are true and there are no unresolved issues.
 *
 * This separates inventory version / content revision / verification status: the
 * status is DERIVED from live evidence, so it cannot silently drift from the
 * content. If a verified entry's evidence is missing/stale/incomplete, this fails
 * (exit 1) rather than letting docs/coverage.md keep claiming "verified".
 *
 * Loads the REAL registry. Wired into `npm run test:curriculum`.
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs scripts/verify_coverage_evidence.mjs
 */
import { pathToFileURL } from "node:url";
import path from "node:path";
import { loadRegistry, ROOT } from "./lib/load-curriculum.mjs";
import { contentHashOf } from "./lib/content-hash.mjs";

const { lessons, patterns } = await loadRegistry();
const { coverage, COVERAGE_VERSION } = await import(
  pathToFileURL(path.join(ROOT, "src/content/coverage.ts")).href
);

const lessonById = new Map(lessons.map((l) => [l.id, l]));
const patternById = new Map(patterns.map((p) => [p.id, p]));

let failures = 0;
const fail = (msg) => { failures++; console.log(`  ✗ ${msg}`); };

/** Returns problem strings for one item's evidence (empty = current & complete). */
function evidenceProblems(kind, item) {
  const problems = [];
  const ev = item.evidence;
  if (!ev) { problems.push(`${kind} ${item.id}: no evidence`); return problems; }
  const live = contentHashOf(item);
  if (ev.contentHash !== live) problems.push(`${kind} ${item.id}: evidence STALE (recorded ${ev.contentHash}, live ${live})`);
  if (ev.inventoryVersion !== COVERAGE_VERSION) problems.push(`${kind} ${item.id}: evidence.inventoryVersion ${ev.inventoryVersion} != COVERAGE_VERSION ${COVERAGE_VERSION}`);
  const c = ev.checks ?? {};
  for (const aspect of ["content", "implementation", "visualization", "exercise", "complexity", "references"]) {
    if (c[aspect] !== true) problems.push(`${kind} ${item.id}: check "${aspect}" is not true`);
  }
  if (Array.isArray(ev.unresolved) && ev.unresolved.length) problems.push(`${kind} ${item.id}: has unresolved issues [${ev.unresolved.join("; ")}]`);
  return problems;
}

let verified = 0;
let nonVerified = 0;
for (const entry of coverage) {
  if (entry.status !== "verified") { nonVerified++; continue; }
  verified++;
  const problems = [];
  if (!entry.lessonId) {
    problems.push(`coverage ${entry.id}: verified but no lessonId`);
  } else {
    const lesson = lessonById.get(entry.lessonId);
    if (!lesson) problems.push(`coverage ${entry.id}: lessonId "${entry.lessonId}" not in registry`);
    else problems.push(...evidenceProblems("lesson", lesson));
  }
  for (const pid of entry.patternIds ?? []) {
    const p = patternById.get(pid);
    if (!p) problems.push(`coverage ${entry.id}: patternId "${pid}" not in registry`);
    else problems.push(...evidenceProblems("pattern", p));
  }
  if (problems.length) { for (const pr of problems) fail(pr); }
  else console.log(`  ✓ coverage ${entry.id} — verified with current evidence`);
}

console.log(
  failures === 0
    ? `\nCOVERAGE EVIDENCE OK — ${verified} verified entries backed by current evidence, ${nonVerified} not-yet-verified`
    : `\n${failures} COVERAGE-EVIDENCE FAILURE(S)`,
);
process.exit(failures === 0 ? 0 : 1);
