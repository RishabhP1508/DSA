// End-to-end verification of the browser execution path, run under Node using
// the SAME bundled Pyodide (public/pyodide) and the SAME tracer.py the worker
// uses. This proves the trace pipeline works against the real runtime, not just
// local CPython.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(HERE, "..");
const tracerSource = readFileSync(path.join(root, "src/engine/tracer.py"), "utf8");

const { loadPyodide } = await import(path.join(root, "public/pyodide/pyodide.mjs"));
const pyodide = await loadPyodide({ indexURL: path.join(root, "public/pyodide") + "/" });

console.log("Pyodide loaded. Python:", pyodide.runPython("import sys; sys.version").split(" ")[0]);

pyodide.globals.set("__tracer_source__", tracerSource);
pyodide.runPython(`
import sys, types
_m = types.ModuleType("dsa_tracer")
exec(__tracer_source__, _m.__dict__)
sys.modules["dsa_tracer"] = _m
`);

// The exact intro-lesson code.
const lessonCode = readFileSync(path.join(root, "scripts/lesson_variables.py"), "utf8");

pyodide.globals.set("__run_source__", lessonCode);
pyodide.globals.set("__run_stdin__", "");
pyodide.globals.set("__limit_events__", 10000);
pyodide.globals.set("__limit_bytes__", 16 * 1024 * 1024);

const resultJson = pyodide.runPython(`
import json, sys
_tracer = sys.modules["dsa_tracer"]
_res = _tracer.run_program(__run_source__, "<lesson>", __limit_events__, __limit_bytes__, __run_stdin__)
json.dumps(_res)
`);

const res = JSON.parse(resultJson);
console.log("status:", res.status);
console.log("events:", res.events.length);
console.log("stdout:", JSON.stringify(res.stdout));

const expected = "Ada 42.5 True None\n[10, 20, 30, 40]\n";
if (res.stdout !== expected) {
  console.error("MISMATCH: expected", JSON.stringify(expected));
  process.exit(1);
}

// Backward-playback check: last state's `scores` list must show 4 elements,
// and an earlier state (before append) must show 3 — proving states are
// self-contained snapshots, not recomputed.
function scoresLen(ev) {
  for (let i = ev.frames.length - 1; i >= 0; i--) {
    const local = ev.frames[i].locals.find((l) => l.name === "scores");
    const v = local?.value;
    if (v && v.kind === "ref") {
      const obj = ev.objects[v.id];
      if (obj && Array.isArray(obj.entries)) return obj.entries.length;
    }
  }
  return null;
}
const lens = res.events.map(scoresLen).filter((x) => x !== null);
console.log("scores lengths across steps:", lens.join(",") || "(none found)");
const grew = lens.includes(3) && lens[lens.length - 1] === 4;
console.log("aliasing/mutation visible across snapshots:", grew);
if (!grew) process.exit(1);

console.log("PIPELINE OK");
