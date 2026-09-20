/**
 * Shared Pyodide harness for verification scripts.
 *
 * Loads the SAME bundled `public/pyodide` runtime and the SAME `src/engine/
 * tracer.py` the browser worker uses, then exposes `runProgram(source, stdin)`.
 * Cross-platform: dynamic imports use `pathToFileURL(...).href` (a bare absolute
 * path is not a valid ESM specifier on Windows).
 *
 * Note: this exercises the Python path only. It does NOT prove the in-browser
 * worker, visualizations, or UI — those require the browser (Playwright).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, "..", "..");

let pyPromise = null;

export async function getPyodide() {
  if (pyPromise) return pyPromise;
  pyPromise = (async () => {
    const pyodideUrl = pathToFileURL(
      path.join(ROOT, "public", "pyodide", "pyodide.mjs"),
    ).href;
    const { loadPyodide } = await import(pyodideUrl);
    const py = await loadPyodide({
      indexURL: path.join(ROOT, "public", "pyodide") + path.sep,
    });
    const tracerSource = readFileSync(
      path.join(ROOT, "src", "engine", "tracer.py"),
      "utf8",
    );
    py.globals.set("__tracer_source__", tracerSource);
    py.runPython(`import sys, types
_m = types.ModuleType("dsa_tracer")
exec(__tracer_source__, _m.__dict__)
sys.modules["dsa_tracer"] = _m`);
    return py;
  })();
  return pyPromise;
}

/** Run a program through the tracer; returns the parsed RunResult object. */
export async function runProgram(source, stdin = "", limits = {}) {
  const py = await getPyodide();
  const { maxEvents = 10000, maxTraceBytes = 16 * 1024 * 1024 } = limits;
  py.globals.set("__s", source);
  py.globals.set("__stdin", stdin);
  py.globals.set("__ev", maxEvents);
  py.globals.set("__by", maxTraceBytes);
  const json = py.runPython(`import json, sys
json.dumps(sys.modules["dsa_tracer"].run_program(__s, "<verify>", __ev, __by, __stdin))`);
  return JSON.parse(json);
}
