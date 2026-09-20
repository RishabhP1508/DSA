/**
 * Verifies runnable exercises: for every lesson/pattern exercise that has a
 * `tests` snippet, run `expected + tests` on the bundled Pyodide and assert it
 * completes without error (the authored solution must pass its own tests). This
 * keeps runnable exercises honest — a test that the model answer fails is a bug.
 *
 * Run with:  node scripts/verify_exercise_tests.mjs
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

function run(src) {
  py.globals.set("__s", src);
  const j = py.runPython(`import json, sys
json.dumps(sys.modules["dsa_tracer"].run_program(__s, "<exercise>", 10000, 16*1024*1024, ""))`);
  return JSON.parse(j);
}

// Extract exercise objects with `tests` from a TS content file. We do a tolerant
// scan for id / expected / tests string fields within each exercise object.
function extractExercises(text) {
  const out = [];
  // Split on `id:` occurrences inside exercises; then within each chunk pull
  // the expected and tests string literals if both are present.
  const idRe = /id:\s*"([^"]+)"/g;
  let m;
  const ids = [];
  while ((m = idRe.exec(text))) ids.push({ id: m[1], index: m.index });
  for (let i = 0; i < ids.length; i++) {
    const start = ids[i].index;
    const end = i + 1 < ids.length ? ids[i + 1].index : text.length;
    const chunk = text.slice(start, end);
    const testsM = chunk.match(/tests:\s*("(?:[^"\\]|\\.)*")/);
    if (!testsM) continue;
    const expM = chunk.match(/expected:\s*("(?:[^"\\]|\\.)*")/);
    if (!expM) continue;
    out.push({
      id: ids[i].id,
      expected: JSON.parse(expM[1]),
      tests: JSON.parse(testsM[1]),
    });
  }
  return out;
}

const dirs = ["src/content/lessons", "src/content/patterns"];
const exercises = [];
for (const d of dirs) {
  let files = [];
  try {
    files = readdirSync(path.join(root, d)).filter((f) => f.endsWith(".ts"));
  } catch {
    continue;
  }
  for (const f of files) {
    const text = readFileSync(path.join(root, d, f), "utf8");
    for (const ex of extractExercises(text)) exercises.push({ ...ex, file: f });
  }
}

if (exercises.length === 0) {
  console.log("No runnable exercises (with `tests`) found — nothing to verify.");
  process.exit(0);
}

let failures = 0;
for (const ex of exercises) {
  const source = `${ex.expected}\n\n# --- tests ---\n${ex.tests}\n`;
  const res = run(source);
  const ok = res.status === "completed";
  if (ok) {
    console.log(`  ✓ ${ex.id} (${ex.file}) — model answer passes its tests`);
  } else {
    failures++;
    console.log(`  ✗ ${ex.id} (${ex.file}) — status=${res.status}`);
    if (res.error) console.log(`      error: ${JSON.stringify(res.error)}`);
  }
}

console.log(failures === 0 ? "\nALL RUNNABLE EXERCISES OK" : `\n${failures} EXERCISE FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
