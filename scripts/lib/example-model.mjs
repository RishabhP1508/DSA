/**
 * R5.1 — shared validator for the executable-example model contract.
 *
 * One module used by BOTH `scripts/verify_example_model.mjs` (CLI, runs the
 * bundled Python) and the Vitest tests (which invalidate each field and assert a
 * failure). It validates the FULL R5.1 contract, not just complexity structure:
 *
 *   - source code and supported input present;
 *   - expected output present (non-empty string is allowed to be "" only when
 *     the program legitimately prints nothing — see `expectsOutput`);
 *   - a per-line explanation for every displayed source line (delegated to the
 *     line-explanation coverage check here so this module is self-contained);
 *   - visual bindings OR an explicit documented rationale for their absence;
 *   - analysis scope + input-size variables;
 *   - time and space explanations;
 *   - preconditions and edge cases;
 *   - references with url + accessDate + at least one verifiedClaim;
 *   - verification evidence tied to the CURRENT content revision (a content hash
 *     that must match the live content — stale evidence fails).
 *
 * It rejects empty arrays, placeholder text, missing expected output, and stale
 * evidence. It does NOT prove the Big-O claim itself (human review / R7).
 */

import { contentHashOf } from "./content-hash.mjs";

// Stub markers only — not legitimate prose ("a placeholder value", "fill in the
// table"). Kept narrow to avoid false positives on real explanations.
const PLACEHOLDER = /\b(tbd|todo|fixme|xxx|lorem ipsum|to be written)\b/i;

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}
function looksPlaceholder(v) {
  return typeof v === "string" && PLACEHOLDER.test(v);
}

/** Validate the line-explanation coverage for one example (self-contained). */
function checkLineExplanations(code, explanations, problems) {
  const total = code.split("\n").length;
  const byLine = new Map();
  for (const ce of explanations ?? []) {
    if (typeof ce.line !== "number") { problems.push("a codeExplanation has a non-numeric line"); continue; }
    if (typeof ce.executable !== "boolean") problems.push(`line ${ce.line} explanation missing boolean 'executable'`);
    if (!isNonEmptyString(ce.explanation)) problems.push(`line ${ce.line} explanation is empty`);
    if (looksPlaceholder(ce.explanation)) problems.push(`line ${ce.line} explanation looks like placeholder text`);
    byLine.set(ce.line, ce);
  }
  for (let ln = 1; ln <= total; ln++) if (!byLine.has(ln)) problems.push(`line ${ln} has no explanation`);
  for (const ln of byLine.keys()) if (ln < 1 || ln > total) problems.push(`explanation points at out-of-range line ${ln}`);
}

function checkComplexity(cx, lineCount, executed, problems) {
  if (!cx) { problems.push("no complexityExplanation (a bare note is insufficient for a full implementation)"); return; }
  // analysis scope (R5.1: analysis scope) — must be one of the allowed kinds.
  if (!["program", "function", "operation"].includes(cx.scope)) {
    problems.push(`complexityExplanation.scope must be program|function|operation (got ${JSON.stringify(cx.scope)})`);
  }
  if (!cx.variables || cx.variables.length === 0) problems.push("no input-size variables");
  for (const v of cx.variables ?? []) {
    if (!isNonEmptyString(v.symbol) || !isNonEmptyString(v.meaning)) problems.push("an input-size variable is missing symbol/meaning");
  }
  if (!isNonEmptyString(cx.costModel)) problems.push("no costModel");
  if (!isNonEmptyString(cx.time?.bound)) problems.push("no time.bound");
  if (!isNonEmptyString(cx.time?.explanation)) problems.push("no time.explanation");
  if (looksPlaceholder(cx.time?.explanation)) problems.push("time.explanation looks like placeholder");
  if (!isNonEmptyString(cx.space?.bound)) problems.push("no space.bound");
  if (!isNonEmptyString(cx.space?.explanation)) problems.push("no space.explanation");
  if (looksPlaceholder(cx.space?.explanation)) problems.push("space.explanation looks like placeholder");
  if (!cx.derivation || cx.derivation.length === 0) problems.push("empty derivation");
  // Assumptions/preconditions the bounds & correctness rely on.
  if (!cx.assumptions || cx.assumptions.length === 0) problems.push("no assumptions/preconditions");
  for (const d of cx.derivation ?? []) {
    if (!isNonEmptyString(d.description)) problems.push("a derivation contribution has an empty description");
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
}

function checkReferences(refs, problems) {
  if (!Array.isArray(refs) || refs.length === 0) { problems.push("no references"); return; }
  for (const r of refs) {
    if (!r.url || !/^https?:\/\//.test(r.url)) problems.push(`reference missing/invalid url: ${JSON.stringify(r.url)}`);
    if (!r.accessDate || !/^\d{4}-\d{2}-\d{2}$/.test(r.accessDate)) problems.push(`reference ${r.url} missing/invalid accessDate`);
    if (!r.verifiedClaims || r.verifiedClaims.length === 0) problems.push(`reference ${r.url} has no verifiedClaims`);
  }
}

function checkEvidence(item, code, expectedOutput, problems) {
  const ev = item.evidence;
  if (!ev) { problems.push("no verification evidence (evidence tied to the content revision is required)"); return; }
  if (!isNonEmptyString(ev.verifiedAt) || !/^\d{4}-\d{2}-\d{2}/.test(ev.verifiedAt)) problems.push("evidence.verifiedAt missing/invalid");
  if (!isNonEmptyString(ev.contentHash)) { problems.push("evidence.contentHash missing"); return; }
  const live = contentHashOf(item);
  if (ev.contentHash !== live) {
    problems.push(`evidence.contentHash is STALE (recorded ${ev.contentHash}, live ${live}) — re-verify after the content change`);
  }
}

/**
 * Validate one example (lesson or pattern). `example` is a normalized view:
 *   { id, kind, code, stdin, expectedOutput, codeExplanations, bindings,
 *     bindingsRationale, complexityExplanation, references, evidence, item }
 * `executed` is a Set of executed 1-based lines (or null if the program didn't run).
 * Returns an array of problem strings (empty = passes).
 */
export function validateExample(example, executed) {
  const problems = [];
  const { id, kind, code, expectedOutput, codeExplanations, bindings, bindingsRationale, complexityExplanation, references, edgeCases, item } = example;

  if (!isNonEmptyString(code)) problems.push("missing source code");
  // supported input is optional (many programs read no input); if present it must be a string.
  if (example.stdin !== undefined && typeof example.stdin !== "string") problems.push("stdin must be a string when present");
  // expected output must be a defined string (may be "" only for a program that prints nothing).
  if (typeof expectedOutput !== "string") problems.push("missing expectedOutput");
  else if (expectedOutput.length === 0) problems.push("expectedOutput is empty (an executable example must print observable output)");

  checkLineExplanations(code ?? "", codeExplanations, problems);

  // bindings OR a documented rationale for their absence.
  if ((!bindings || bindings.length === 0) && !isNonEmptyString(bindingsRationale)) {
    problems.push("no visual bindings and no documented bindingsRationale for their absence");
  }

  checkComplexity(complexityExplanation, (code ?? "").split("\n").length, executed, problems);

  // Preconditions & edge cases (R5.1): preconditions live in complexityExplanation.assumptions
  // (checked above); edge cases are sourced from the item's existing genuine fields
  // (lesson concepts.edgeCases, or a pattern's counterexamples/conditions), passed in as `edgeCases`.
  if (!isNonEmptyString(edgeCases) && !(Array.isArray(edgeCases) && edgeCases.length)) {
    problems.push("no edge-case coverage (lesson concepts.edgeCases or pattern counterexamples/conditions)");
  }

  checkReferences(references, problems);
  checkEvidence(item, code, expectedOutput, problems);

  return problems.map((p) => `${kind} ${id}: ${p}`);
}
