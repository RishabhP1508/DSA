/**
 * One-time R5.1/R5.7 codemod: generate an `evidence` block for every lesson and
 * pattern, tied to the CURRENT content hash and reflecting the ACTUAL verified
 * state (not a blanket "true").
 *
 * For each item it runs the real checks:
 *   - implementation: the program runs on the bundled runtime and its stdout
 *     equals the recorded expectedOutput;
 *   - content: every displayed source line has an explanation, none out of range;
 *   - visualization: has >=1 binding or a documented bindingsRationale;
 *   - exercise: has >=1 exercise;
 *   - complexity: the structured complexityExplanation validates (scope,
 *     variables, time/space explanations, in-range derivation, executing counters);
 *   - references: >=1 reference with url + accessDate + verifiedClaims.
 *
 * Any aspect that does NOT pass is recorded as `false` and listed in
 * `unresolved`, so the status stays honest. The `contentHash` is computed AFTER
 * all other edits so it matches the final content.
 *
 * Idempotent: re-running recomputes and rewrites the evidence block.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { loadCurriculum } from "./lib/load-curriculum.mjs";
import { runProgram } from "./lib/pyodide-harness.mjs";
import { contentHashOf } from "./lib/content-hash.mjs";
import { validateExample } from "./lib/example-model.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOW = "2026-09-20";

const { lessons, patterns } = await loadCurriculum();
const { COVERAGE_VERSION } = await import(pathToFileURL(path.join(ROOT, "src/content/coverage.ts")).href);

/**
 * R5.3 — semantic review is NOT auto-granted here. This codemod records only the
 * MACHINE evidence (checks + content hash). The `semanticReview` flag is derived
 * strictly from the HUMAN-REVIEW LEDGER (src/content/review-ledger.ts): an item
 * gets `semanticReview: true` ONLY when its CURRENT content hash equals the
 * ledger's `reviewedHash` for that id. So a content edit (which changes the hash)
 * automatically reverts the item to `semanticReview: false` when evidence is
 * regenerated — the review claim cannot outlive the content it was made against.
 * To re-grant it, a human re-reads the item and re-runs gen_review_ledger.mjs.
 */
const { REVIEW_LEDGER_BY_KEY } = await import(pathToFileURL(path.join(ROOT, "src/content/review-ledger.ts")).href);

/**
 * Returns { reviewed, batch } for an item given its CURRENT content hash:
 * reviewed is true only if a ledger entry (keyed by kind:id) exists AND its
 * reviewedHash matches. (kind:id keying is required because a lesson and a
 * pattern can share an id.)
 */
function reviewStateFor(kind, item, currentHash) {
  const entry = REVIEW_LEDGER_BY_KEY.get(kind + ":" + item.id);
  if (!entry) return { reviewed: false, batch: undefined };
  if (entry.reviewedHash !== currentHash) return { reviewed: false, batch: entry.batch };
  return { reviewed: true, batch: entry.batch };
}

// Map registry id -> file path (by exported const's file). We locate files by
// scanning the two content dirs and matching `id: "<id>"`.
import { readdirSync } from "node:fs";
function fileIndex(dir) {
  const map = new Map();
  for (const f of readdirSync(path.join(ROOT, dir)).filter((x) => x.endsWith(".ts"))) {
    const p = path.join(ROOT, dir, f);
    const src = readFileSync(p, "utf8");
    const m = src.match(/\n\s*id:\s*"([^"]+)"/);
    if (m) map.set(m[1], p);
  }
  return map;
}
const lessonFiles = fileIndex("src/content/lessons");
const patternFiles = fileIndex("src/content/patterns");

function executedLines(res) {
  const set = new Set();
  for (const ev of res.events) if (ev.kind === "line") set.add(ev.line);
  return set;
}

async function evidenceFor(kind, item) {
  const code = kind === "lesson" ? item.code : item.walkthroughCode;
  const stdin = kind === "lesson" ? item.stdin : item.walkthroughStdin;
  const expected = kind === "lesson" ? item.expectedOutput : item.walkthroughExpectedOutput;
  const res = await runProgram(code, stdin ?? "");
  const executed = res.status === "completed" ? executedLines(res) : null;

  const implementation = res.status === "completed" && res.stdout === expected;

  // Build the example view (same normalization the CLI uses) to reuse the validator.
  const example = {
    id: item.id, kind, code, stdin, expectedOutput: expected,
    codeExplanations: item.codeExplanations, bindings: item.bindings,
    bindingsRationale: item.bindingsRationale, complexityExplanation: item.complexityExplanation,
    references: item.references,
    edgeCases: kind === "lesson" ? item.concepts?.edgeCases : [...(item.counterexamples ?? []), ...(item.conditions ?? [])],
    // Temporarily attach a matching hash so the evidence-check passes during generation;
    // we recompute the real hash below from the final content.
    item: { ...item, evidence: { contentHash: contentHashOf(item), verifiedAt: NOW, inventoryVersion: 0, checks: {} } },
  };
  const problems = validateExample(example, executed);
  // Aspect flags.
  const complexity = !problems.some((p) => /complexity|scope|variable|derivation|assumption|time\.|space\.|counter/.test(p));
  const content = implementation && !problems.some((p) => /line \d+|explanation|expectedOutput|source code/.test(p));
  const visualization = (item.bindings && item.bindings.length > 0) || !!item.bindingsRationale;
  const exercise = Array.isArray(item.exercises) && item.exercises.length > 0;
  const references = !problems.some((p) => /reference|verifiedClaims|accessDate/.test(p));

  const checks = { content, implementation, visualization, exercise, complexity, references };
  const unresolved = [];
  for (const [k, v] of Object.entries(checks)) if (!v) unresolved.push(`${k} check did not pass at generation time`);

  return { checks, unresolved, res };
}

function renderEvidence(hash, checks, unresolved, indent, inventoryVersion, reviewed, reviewBatch) {
  const c = checks;
  const lines = [];
  lines.push(`${indent}evidence: {`);
  lines.push(`${indent}  inventoryVersion: ${inventoryVersion},`);
  lines.push(`${indent}  contentHash: "${hash}",`);
  lines.push(`${indent}  verifiedAt: "${NOW}",`);
  lines.push(`${indent}  checks: { content: ${c.content}, implementation: ${c.implementation}, visualization: ${c.visualization}, exercise: ${c.exercise}, complexity: ${c.complexity}, references: ${c.references} },`);
  // semanticReview is true ONLY when the human-review ledger's reviewedHash
  // matches the current content hash (see reviewStateFor). reviewBatch is
  // recorded when a ledger entry exists (even if stale) for traceability.
  lines.push(`${indent}  semanticReview: ${reviewed ? "true" : "false"},`);
  if (reviewBatch !== undefined) lines.push(`${indent}  reviewBatch: ${reviewBatch},`);
  if (unresolved.length) {
    lines.push(`${indent}  unresolved: [${unresolved.map((u) => JSON.stringify(u)).join(", ")}],`);
  }
  lines.push(`${indent}},`);
  return lines.join("\n");
}

/** Insert/replace an `evidence: {...}` block just before the definition's closing `};`. */
function writeEvidence(filePath, evidenceBlock) {
  let src = readFileSync(filePath, "utf8");
  // Remove any now-unused COVERAGE_VERSION import from an earlier evidence pass.
  src = src.replace(/import \{ COVERAGE_VERSION \} from "\.\.\/coverage";\n/, "");
  // Remove any existing evidence block (idempotent), tolerating `},\n};` or `},};`.
  src = src.replace(/\n\s*evidence: \{[\s\S]*?\},\s*\};/, "\n};");
  // Now the file must end with `...\n};`. Insert the fresh evidence before it.
  const idx = src.lastIndexOf("\n};");
  if (idx === -1) throw new Error(`no closing }; in ${filePath}`);
  src = src.slice(0, idx) + "\n" + evidenceBlock + "\n};" + src.slice(idx + "\n};".length);
  writeFileSync(filePath, src, "utf8");
}

let done = 0;
for (const [kind, items, files] of [["lesson", lessons, lessonFiles], ["pattern", patterns, patternFiles]]) {
  for (const item of items) {
    const filePath = files.get(item.id);
    if (!filePath) { console.log(`  ! no file for ${kind} ${item.id}`); continue; }
    const { checks, unresolved } = await evidenceFor(kind, item);
    const hash = contentHashOf(item); // hash of current content
    const indent = "  ";
    const { reviewed, batch } = reviewStateFor(kind, item, hash);
    writeEvidence(filePath, renderEvidence(hash, checks, unresolved, indent, COVERAGE_VERSION, reviewed, batch));
    done++;
  }
}
console.log(`Wrote evidence to ${done} file(s).`);
