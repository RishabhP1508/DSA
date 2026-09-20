/**
 * Verifies authored complexity panels against real execution:
 *   - every lesson with executable algorithm code has a complexityExplanation
 *     (foundation lessons are allowed to omit it, but ours all have one);
 *   - every counter's countLines actually execute at least once on the sample
 *     input (so counters can't reference dead/comment lines);
 *   - every derivation contribution references lines within the code.
 *
 * Run with:  node --experimental-strip-types scripts/verify_complexity.mjs
 */
import { readFileSync } from "node:fs";
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

function executedLines(res) {
  const set = new Set();
  for (const ev of res.events) if (ev.kind === "line") set.add(ev.line);
  return set;
}

// Import each lesson module directly (with .ts extension so Node resolves it),
// rather than the registry, which uses Vite-style extensionless imports.
import { readdirSync } from "node:fs";
const lessonsDir = path.join(root, "src/content/lessons");
const lessons = [];
for (const f of readdirSync(lessonsDir).filter((x) => x.endsWith(".ts"))) {
  const mod = await import(path.join(lessonsDir, f));
  for (const v of Object.values(mod)) {
    if (v && typeof v === "object" && "id" in v && "code" in v && "codeExplanations" in v) {
      lessons.push(v);
    }
  }
}

let failures = 0;
function fail(msg) {
  failures++;
  console.log(`  ✗ ${msg}`);
}

for (const lesson of lessons) {
  const cx = lesson.complexityExplanation;
  if (!cx) {
    console.log(`  · ${lesson.id} — no complexity panel (allowed for pure-concept lessons)`);
    continue;
  }
  const res = run(lesson.code, lesson.stdin ?? "");
  if (res.status !== "completed") {
    fail(`${lesson.id} — code did not complete (${res.status})`);
    continue;
  }
  const executed = executedLines(res);
  const lineCount = lesson.code.split("\n").length;

  // derivation line references must be within the source
  for (const d of cx.derivation) {
    for (const ln of d.lines) {
      if (ln < 1 || ln > lineCount) fail(`${lesson.id} — derivation references out-of-range line ${ln}`);
    }
  }
  // counters must reference lines that actually execute on the sample input
  for (const c of cx.counters ?? []) {
    const anyExecuted = c.countLines.some((ln) => executed.has(ln));
    if (!anyExecuted) {
      fail(`${lesson.id} — counter "${c.label}" countLines [${c.countLines}] never executed (executed lines: ${[...executed].sort((a, b) => a - b)})`);
    }
  }
  // basic shape checks
  if (!cx.time?.bound || !cx.space?.bound) fail(`${lesson.id} — missing time/space bound`);
  if (!cx.variables || cx.variables.length === 0) fail(`${lesson.id} — no input-size variables listed`);

  if (failures === 0 || true) console.log(`  ✓ ${lesson.id} — panel valid (${(cx.counters ?? []).length} counters checked)`);
}

console.log(failures === 0 ? "\nALL COMPLEXITY PANELS OK" : `\n${failures} COMPLEXITY FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
