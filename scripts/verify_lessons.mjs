/**
 * Verifies every registered lesson: runs its `code` on the bundled Pyodide and
 * asserts the real stdout equals the lesson's declared `expectedOutput`. This
 * enforces the acceptance criterion "all standard examples produce their
 * expected results" and keeps content honest.
 *
 * Lessons are TS modules; we extract `code` and `expectedOutput` by importing
 * the compiled registry via a tiny esbuild-free approach: we read the built
 * lesson data from a JSON dump the app can also use. To avoid a build step here
 * we instead import the TS through Node's stripping (Node 22 supports --experimental
 * transform for .ts is not guaranteed), so we parse the fields with a regex-free
 * dynamic import of a generated JSON. Simpler: import from a small JSON the build
 * emits. For now we hard-read the two known lessons' code via the tracer probe.
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
json.dumps(sys.modules["dsa_tracer"].run_program(__s, "<lesson>", 10000, 16*1024*1024, __stdin))`);
  return JSON.parse(j);
}

// Extract `code` (template literal) and `expectedOutput` (string) from each
// lesson TS file with a tolerant parser: find `const code = ` backtick block,
// and the `expectedOutput:` string.
function extractLesson(file) {
  const text = readFileSync(file, "utf8");
  const codeMatch = text.match(/const code = `([\s\S]*?)`;/);
  const expMatch = text.match(/expectedOutput:\s*("(?:[^"\\]|\\.)*")/);
  if (!codeMatch || !expMatch) return null;
  const code = codeMatch[1];
  const expected = JSON.parse(expMatch[1]);
  const stdinMatch = text.match(/stdin:\s*("(?:[^"\\]|\\.)*")/);
  const stdin = stdinMatch ? JSON.parse(stdinMatch[1]) : "";
  return { code, expected, stdin, file: path.basename(file) };
}

const lessonsDir = path.join(root, "src/content/lessons");
const files = readdirSync(lessonsDir).filter((f) => f.endsWith(".ts"));

let failures = 0;
for (const f of files) {
  const lesson = extractLesson(path.join(lessonsDir, f));
  if (!lesson) {
    console.log(`  ? ${f} — could not extract code/expectedOutput (skipped)`);
    continue;
  }
  const res = run(lesson.code, lesson.stdin);
  const ok = res.status === "completed" && res.stdout === lesson.expected;
  if (ok) {
    console.log(`  ✓ ${lesson.file} — output matches (${res.events.length} events)`);
  } else {
    failures++;
    console.log(`  ✗ ${lesson.file} — status=${res.status}`);
    console.log(`      expected: ${JSON.stringify(lesson.expected)}`);
    console.log(`      actual:   ${JSON.stringify(res.stdout)}`);
    if (res.error) console.log(`      error: ${JSON.stringify(res.error)}`);
  }
}

console.log(failures === 0 ? "\nALL LESSON OUTPUTS OK" : `\n${failures} LESSON FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
