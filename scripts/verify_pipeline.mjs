// End-to-end verification of the Python execution path, run under Node using
// the SAME bundled Pyodide (public/pyodide) and the SAME tracer.py the worker
// uses. Proves the trace pipeline works against the real runtime.
//
// NOTE: this exercises the Python path, not the in-browser worker/UI. The
// browser path is covered by the Playwright suite (npm run test:browser).
//
// Run:  node scripts/verify_pipeline.mjs   (cross-platform; uses file URLs)
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPyodide, runProgram, ROOT } from "./lib/pyodide-harness.mjs";

const py = await getPyodide();
console.log("Pyodide loaded. Python:", py.runPython("import sys; sys.version").split(" ")[0]);

const lessonCode = readFileSync(path.join(ROOT, "scripts", "lesson_variables.py"), "utf8");
const res = await runProgram(lessonCode, "");

console.log("status:", res.status);
console.log("events:", res.events.length);
console.log("stdout:", JSON.stringify(res.stdout));

const expected = "Ada 42.5 True None\n[10, 20, 30, 40]\n";
if (res.stdout !== expected) {
  console.error("MISMATCH: expected", JSON.stringify(expected));
  process.exit(1);
}

// Backward-playback check: the `scores` list must show 4 elements at the end
// and 3 earlier — proving states are self-contained snapshots, not recomputed.
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
