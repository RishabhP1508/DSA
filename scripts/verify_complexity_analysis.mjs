/**
 * R7.3 — verify the conservative AST complexity analyzer against the plan's
 * required reasoning table (and the blocking cases). Runs the real
 * src/engine/complexity_analyzer.py on the bundled Pyodide runtime.
 *
 * Supported (must return source="auto-supported" with the expected bound):
 *   - two sequential loops over n           -> O(n)
 *   - nested loops over independent n, m    -> O(n1·n2)  (nesting, multiplied)
 *   - a fixed-size loop / literal iterable  -> O(1) w.r.t. input
 *   - a loop building a length-n result     -> O(n)
 * Blocked (must return source="not-determined" with a reason):
 *   - an unsupported call inside a loop
 *   - a while loop (data-dependent)
 *   - recursion
 *   - a comprehension over an unknown iterable
 *
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs \
 *        scripts/verify_complexity_analysis.mjs
 */
import { getPyodide } from "./lib/pyodide-harness.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const py = await getPyodide();
const analyzerSrc = readFileSync(path.join(ROOT, "src/engine/complexity_analyzer.py"), "utf8");
py.runPython(`import types as _t\n_am = _t.ModuleType('dsa_cx')\nexec(${JSON.stringify(analyzerSrc)}, _am.__dict__)\nimport sys as _s\n_s.modules['dsa_cx'] = _am`);

function analyze(source) {
  py.globals.set("__src", source);
  const json = py.runPython(`import sys, json\njson.dumps(sys.modules['dsa_cx'].analyze_complexity(__src))`);
  return JSON.parse(json);
}

let failures = 0;
function expectSupported(name, src, boundContains) {
  const r = analyze(src);
  if (r.source !== "auto-supported") {
    failures++;
    console.log(`  ✗ ${name} — expected auto-supported, got ${r.source} (${r.uncertaintyReason ?? ""})`);
  } else if (boundContains && !r.time.includes(boundContains)) {
    failures++;
    console.log(`  ✗ ${name} — bound ${r.time} does not contain ${boundContains}`);
  } else {
    console.log(`  ✓ ${name} — ${r.time} (${r.supportedFindings[0]})`);
  }
}
function expectBlocked(name, src, reasonContains) {
  const r = analyze(src);
  if (r.source !== "not-determined") {
    failures++;
    console.log(`  ✗ ${name} — expected not-determined, got ${r.source} ${r.time ?? ""}`);
  } else if (reasonContains && !r.uncertaintyReason.includes(reasonContains)) {
    failures++;
    console.log(`  ✗ ${name} — reason "${r.uncertaintyReason}" lacks "${reasonContains}"`);
  } else {
    console.log(`  ✓ ${name} — not-determined: ${r.uncertaintyReason}`);
  }
}

console.log("R7.3 conservative AST analyzer:");

expectSupported(
  "two sequential loops over n -> O(n)",
  "def f(a):\n    for x in a:\n        print(x)\n    for y in a:\n        print(y)",
  "n",
);
expectSupported(
  "nested loops over n and m -> multiplied",
  "def f(a, b):\n    for x in a:\n        for y in b:\n            print(x, y)",
  "·",
);
expectSupported(
  "fixed-size loop over a literal -> O(1)",
  "def f():\n    for x in [1, 2, 3]:\n        print(x)",
  "O(1)",
);
expectSupported(
  "single bounded loop over range(len(a)) -> O(n)",
  "def f(a):\n    total = 0\n    for i in range(len(a)):\n        total = total + a[i]\n    return total",
  "n",
);
expectSupported(
  "loop building a length-n result -> O(n)",
  "def f(a):\n    out = []\n    for x in a:\n        out.append(x)\n    return out",
  "n",
);

expectBlocked(
  "unsupported call inside a loop",
  "def f(a):\n    for x in a:\n        sorted(x)",
  "does not model as constant-time",
);
expectBlocked(
  "while loop (data-dependent)",
  "def f(a):\n    i = 0\n    while i < len(a):\n        i = i + 1",
  "while",
);
expectBlocked(
  "recursion",
  "def f(n):\n    if n <= 1:\n        return 1\n    return f(n - 1) + f(n - 2)",
  "recursive",
);
expectBlocked(
  "comprehension over unknown iterable",
  "def f(a):\n    return [x * x for x in a]",
  "comprehension",
);

console.log(failures === 0 ? "\nCOMPLEXITY ANALYSIS OK" : `\n${failures} ANALYSIS FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
