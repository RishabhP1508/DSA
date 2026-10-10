// @vitest-environment node
import { beforeAll, expect, it } from "vitest";
import { getPyodide, runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import { COMPARISONS } from "../content/comparisons";
import type { RunResult } from "../core/types";
import { comparisonProgram } from "./comparison-program";
import { parseComparisonResult } from "./comparison-result";

beforeAll(async () => { await getPyodide(); }, 120_000);
const samples = COMPARISONS.flatMap(exp => exp.sizes.map(size => ({label: `${exp.id} at size ${size}`, exp, size})));

it.each(samples)("$label completes both actual traced implementations within default limits", async ({exp, size}) => {
  const measured = [];
  for (const kind of ["baseline", "improved"] as const) {
    // No raised budgets: this uses the same 10,000 event / 16 MB defaults as UI.
    const actual = await runProgram(comparisonProgram(exp, exp[kind].code, size));
    expect(actual.status, `${exp.id}:${kind}:${size} (${actual.limitHit ?? "no limit"})`).toBe("completed");
    expect(actual.incomplete).not.toBe(true);
    measured.push(parseComparisonResult(actual as RunResult));
  }
  expect(measured[0].result).toBe(measured[1].result);
  // These authored generators put Two Sum's solution in the last pair; half
  // of the evenly spaced membership queries succeed and half scan all values.
  expect(measured[0].ops).toBe(exp.id === "two-sum" ? size * (size - 1) / 2 : 3 * size * size / 4);
  expect(measured[1].ops).toBe(size);
}, 30_000);
