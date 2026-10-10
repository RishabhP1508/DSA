import { expect, it } from "vitest";
import type { RunResult, RunStatus } from "../core/types";
import { parseComparisonResult } from "./comparison-result";

const sample = (stdout: string, changes: Partial<RunResult> = {}): RunResult => ({runId: 1, status: "completed", stdout, stderr: "", events: [], ...changes});

it.each(["error", "timeout", "stopped", "exited", "event-limit", "trace-limit"] as RunStatus[])("rejects %s even if it printed a valid-looking record", status => {
  expect(() => parseComparisonResult(sample("[6, 7]|28\n", {status}))).toThrow(/did not complete/);
});
it("rejects incomplete completed results", () => {
  expect(() => parseComparisonResult(sample("4|8\n", {incomplete: true}))).toThrow(/did not complete/);
});
it.each(["", "\n", "|1", "  |1", "[6, 7]", "4|"])("rejects a missing result or count in %j", stdout => {
  expect(() => parseComparisonResult(sample(stdout))).toThrow(/result|count/);
});
it.each(["-1", "1.5", "NaN", "Infinity", "1e3", "0x10", "9007199254740992", "1junk", " 8"])("rejects invalid operation count %j", count => {
  expect(() => parseComparisonResult(sample(`4|${count}\n`))).toThrow(/operation count/);
});
it("accepts zero and safe nonnegative integer counts without interpreting Python values", () => {
  expect(parseComparisonResult(sample("None|0\n"))).toEqual({result: "None", ops: 0});
  expect(parseComparisonResult(sample("[]|8\n"))).toEqual({result: "[]", ops: 8});
});
it("uses the final separator when a result contains a pipe", () => {
  expect(parseComparisonResult(sample("'a|b'|12\n"))).toEqual({result: "'a|b'", ops: 12});
});
