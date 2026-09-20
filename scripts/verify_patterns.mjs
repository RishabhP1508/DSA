/**
 * Verifies every Pattern Library entry: runs its `walkthroughCode` on the
 * bundled Pyodide and asserts the real stdout equals `walkthroughExpectedOutput`.
 * This is the pattern analogue of verify_lessons.mjs, keeping walkthroughs honest.
 *
 * Run with:  node scripts/verify_patterns.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(HERE, "..");
const tracerSource = readFileSync(path.join(root, "src/engine/tracer.py"), "utf8");
const { loadPyodide } = await import(path.join(root, "public/pyodide/pyodide.mjs"));
const py = await loadPyodide({ indexURL: path.join(root, "public/pyodide") + "/" });
py.globals.set("__tracer_source__", tracerSource);
py.runPython(`import sys, types
_m = types.ModuleType("dsa_tracer")
exec(__tracer_source__, _m.__dict__)
sys.modules["dsa_tracer"] = _m`);

function run(src, stdin = "") {
  py.globals.set("__s", src);
  py.globals.set("__stdin", stdin);
  const j = py.runPython(`import json, sys
json.dumps(sys.modules["dsa_tracer"].run_program(__s, "<pattern>", 10000, 16*1024*1024, __stdin))`);
  return JSON.parse(j);
}

// Extract `walkthroughCode` (const backtick block) and the expected output +
// optional stdin from each pattern TS file, without a TS build step.
function extractPattern(file) {
  const text = readFileSync(file, "utf8");
  const codeMatch = text.match(/const walkthroughCode = `([\s\S]*?)`;/);
  const expMatch = text.match(/walkthroughExpectedOutput:\s*("(?:[^"\\]|\\.)*")/);
  if (!codeMatch || !expMatch) return null;
  const code = codeMatch[1];
  const expected = JSON.parse(expMatch[1]);
  const stdinMatch = text.match(/walkthroughStdin:\s*("(?:[^"\\]|\\.)*")/);
  const stdin = stdinMatch ? JSON.parse(stdinMatch[1]) : "";
  return { code, expected, stdin, file: path.basename(file) };
}

const patternsDir = path.join(root, "src/content/patterns");
let files = [];
try {
  files = readdirSync(patternsDir).filter((f) => f.endsWith(".ts"));
} catch {
  console.log("No patterns directory yet — nothing to verify.");
  process.exit(0);
}

let failures = 0;
for (const f of files) {
  const pat = extractPattern(path.join(patternsDir, f));
  if (!pat) {
    console.log(`  ? ${f} — could not extract walkthroughCode/expected (skipped)`);
    continue;
  }
  const res = run(pat.code, pat.stdin);
  const ok = res.status === "completed" && res.stdout === pat.expected;
  if (ok) {
    console.log(`  ✓ ${pat.file} — walkthrough output matches (${res.events.length} events)`);
  } else {
    failures++;
    console.log(`  ✗ ${pat.file} — status=${res.status}`);
    console.log(`      expected: ${JSON.stringify(pat.expected)}`);
    console.log(`      actual:   ${JSON.stringify(res.stdout)}`);
    if (res.error) console.log(`      error: ${JSON.stringify(res.error)}`);
  }
}

console.log(failures === 0 ? "\nALL PATTERN WALKTHROUGHS OK" : `\n${failures} PATTERN FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
