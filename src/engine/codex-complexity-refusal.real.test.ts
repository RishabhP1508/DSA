// @vitest-environment node
import { readFileSync } from "node:fs";
import { beforeAll, expect, it } from "vitest";
import { getPyodide, runProgram, ROOT } from "../../scripts/lib/pyodide-harness.mjs";

let py: Awaited<ReturnType<typeof getPyodide>>;
beforeAll(async () => {
  py = await getPyodide();
  py.globals.set("__refusal_analyzer_source", readFileSync(`${ROOT}/src/engine/complexity_analyzer.py`, "utf8"));
  py.runPython("__refusal_analyzer = {}\nexec(__refusal_analyzer_source, __refusal_analyzer)");
}, 120_000);

function analyze(source: string) {
  py.globals.set("__refusal_source", source);
  return JSON.parse(py.runPython("import json\njson.dumps(__refusal_analyzer['analyze_complexity'](__refusal_source))"));
}

const cases = [
  ["straight-line input", "value = input()\nprint('hello', value)", "the code calls 'input()', which the analyzer does not model as constant-time"],
  ["input inside a loop", "for x in [1, 2]:\n    input()", "the code calls 'input()', which the analyzer does not model as constant-time"],
  ["straight-line method", "values = [2, 1]\nvalues.sort()", "the code calls method '.sort()', which the analyzer does not model as constant-time"],
  ["method inside a loop", "for values in [[2, 1]]:\n    values.sort()", "the code calls method '.sort()', which the analyzer does not model as constant-time"],
  ["straight-line helper", "def helper():\n    return 1\ndef unused():\n    pass\nhelper()", "the code calls user-defined function 'helper' whose cost is not modelled"],
  ["helper inside a loop", "def helper():\n    return 1\ndef unused():\n    pass\nfor x in [1, 2]:\n    helper()", "the code calls user-defined function 'helper' whose cost is not modelled"],
  ["straight-line indirect call", "factory()()", "the code contains a call the analyzer cannot identify"],
  ["indirect call inside a loop", "for x in [1, 2]:\n    factory()()", "the code contains a call the analyzer cannot identify"],
];

it.each(cases)("refuses %s without inventing its context", (_name, source, reason) => {
  expect(analyze(source)).toEqual({ source: "not-determined", uncertaintyReason: reason });
});

it("executes the loop-free Playground example on bundled Python before refusing a bound", async () => {
  const source = "value = input()\nprint('hello', value)";
  const actual = await runProgram(source, "café\n");
  expect(actual.status).toBe("completed");
  expect(actual.stdout.trim()).toBe("hello café");
  expect(analyze(source).uncertaintyReason).not.toMatch(/loop body/);
});

it("retains supported straight-line and loop classifications", () => {
  expect(analyze("value = 1\nprint(value)")).toMatchObject({source: "auto-supported", scope: "program", time: "O(1)"});
  expect(analyze("def f(values):\n    for value in values:\n        print(value)")).toMatchObject({source: "auto-supported", scope: "function", time: "O(n1)"});
});
