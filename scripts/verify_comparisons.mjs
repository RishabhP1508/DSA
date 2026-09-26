/**
 * R7.6 — verify authored comparison experiments on the bundled runtime.
 *
 * For each experiment and each size: generate ONE input, run BOTH implementations
 * on it, assert they return EQUAL results (correctness), and record the operation
 * count each reported (via the injected `__op()` counter). Assert the improved
 * implementation's counts grow no faster than the baseline's across sizes (the
 * baseline is at least as costly at the largest size). The theoretical curves
 * are only labels — this checks observed OPERATION COUNTS, never timing.
 *
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs \
 *        scripts/verify_comparisons.mjs
 */
import { getPyodide } from "./lib/pyodide-harness.mjs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { COMPARISONS } = await import(pathToFileURL(path.join(ROOT, "src/content/comparisons.ts")).href);
const py = await getPyodide();

/** Run one implementation on generated input of `size`; returns {result, ops}. */
function runImpl(genCode, implCode, size) {
  py.globals.set("__gen", genCode);
  py.globals.set("__impl", implCode);
  py.globals.set("__size", size);
  const json = py.runPython(`
import json
_ns = {}
_ops = {"n": 0}
def __op():
    _ops["n"] += 1
_ns["__op"] = __op
exec(__gen, _ns)
exec(__impl, _ns)
_args = _ns["gen"](__size)
_res = _ns["solve"](*_args)
json.dumps({"result": _res, "ops": _ops["n"]})
`);
  return JSON.parse(json);
}

let failures = 0;
for (const exp of COMPARISONS) {
  console.log(`\n${exp.title}`);
  const baseOps = [];
  const impOps = [];
  for (const size of exp.sizes) {
    const b = runImpl(exp.inputGenerator, exp.baseline.code, size);
    const i = runImpl(exp.inputGenerator, exp.improved.code, size);
    const equal = JSON.stringify(b.result) === JSON.stringify(i.result);
    if (!equal) {
      failures++;
      console.log(`  ✗ size ${size}: outputs differ (baseline ${JSON.stringify(b.result)} vs improved ${JSON.stringify(i.result)})`);
      continue;
    }
    baseOps.push(b.ops);
    impOps.push(i.ops);
    console.log(`  ✓ size ${size}: equal result; ops baseline=${b.ops} improved=${i.ops} (${exp.operation})`);
  }
  // At the largest size the improved implementation must not do MORE of the
  // counted operation than the baseline (the whole point of the comparison).
  if (baseOps.length && impOps.length) {
    const last = baseOps.length - 1;
    if (impOps[last] > baseOps[last]) {
      failures++;
      console.log(`  ✗ improved ops (${impOps[last]}) exceed baseline (${baseOps[last]}) at largest size`);
    } else {
      console.log(`  baseline ${exp.baseline.theoretical}; improved ${exp.improved.theoretical} (theoretical labels)`);
    }
  }
}

console.log(failures === 0 ? "\nCOMPARISONS OK" : `\n${failures} COMPARISON FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
