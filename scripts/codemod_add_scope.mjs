/**
 * One-time R5.1 codemod: insert `scope: "program",` into every
 * `complexityExplanation: {` block that lacks a `scope` field.
 *
 * Rationale: every lesson `code` / pattern `walkthroughCode` is a complete,
 * runnable PROGRAM whose complexity panel describes the whole example's cost, so
 * "program" is the accurate analysis scope for all of them. (A later spec may
 * refine individual examples to "function"/"operation" where a single routine is
 * the subject; "program" is correct and honest for the current whole-program
 * examples.)
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dirs = [
  path.join(ROOT, "src/content/lessons"),
  path.join(ROOT, "src/content/patterns"),
];

let changed = 0;
for (const dir of dirs) {
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
    const p = path.join(dir, f);
    let src = readFileSync(p, "utf8");
    if (!src.includes("complexityExplanation: {")) continue;
    // Only add scope if this complexityExplanation block doesn't already have one.
    // Match the opening line and the immediate indentation of the next line.
    const re = /(\n(\s*)complexityExplanation: \{\n)(\s*)(?!scope:)/;
    const m = src.match(re);
    if (!m) continue;
    const innerIndent = m[3];
    src = src.replace(re, `$1${innerIndent}scope: "program",\n$3`);
    writeFileSync(p, src, "utf8");
    changed++;
  }
}
console.log(`Added scope to ${changed} file(s).`);
