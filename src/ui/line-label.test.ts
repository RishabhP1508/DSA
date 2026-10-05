// @vitest-environment node
/**
 * R9/B1 amendment (finding 5, revised) — line labels keep STATIC source
 * classification separate from RUNTIME reachability. The authored `executable`
 * flag is NOT a reachability signal and must never produce a "not reached"
 * label; reachability comes only from actual recorded events.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { classifyLine, lineKindText, labelForLine, reachabilityLabel } from "./line-label";
import { conditions } from "../content/lessons/conditions";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import type { TraceEvent } from "../core/types";

describe("classifyLine — STATIC source classification (text only, no executable flag)", () => {
  it("identifies comments, blanks, and code purely from the source text", () => {
    expect(classifyLine("# a comment")).toBe("comment");
    expect(classifyLine("    # indented comment")).toBe("comment");
    expect(classifyLine("")).toBe("blank");
    expect(classifyLine("   ")).toBe("blank");
    expect(classifyLine("elif temp >= 20:")).toBe("code");
    expect(classifyLine("    label = 'warm'")).toBe("code");
  });
  it("static label tags comments/blanks only; code gets no static tag", () => {
    expect(lineKindText(classifyLine("# c"))).toBe("(comment)");
    expect(lineKindText(classifyLine(""))).toBe("(blank)");
    expect(lineKindText(classifyLine("x = 1"))).toBe("");
  });
  it("labelForLine never emits a reachability claim (code → no tag)", () => {
    // conditions line 6 is `elif temp >= 20:` — real code, so a STATIC label is
    // empty; it must NOT be "(not reached...)" and must NOT be "(comment)".
    const label = labelForLine(conditions.code, 6);
    expect(label).toBe("");
    expect(labelForLine(conditions.code, 1)).toBe("(comment)"); // actual comment
  });
});

describe("reachabilityLabel — derived ONLY from recorded events, never from the authored flag", () => {
  it("labels code absent from the executed set as not-reached; present code gets no label", () => {
    const executed = new Set<number>([2, 4, 5, 10]); // e.g. a temp>=30 run
    expect(reachabilityLabel("code", 6, executed)).toBe("(not reached in this run)");
    expect(reachabilityLabel("code", 5, executed)).toBe("");
  });
  it("never labels comments/blanks as not-reached", () => {
    const executed = new Set<number>([2, 4, 5, 10]);
    expect(reachabilityLabel("comment", 1, executed)).toBe("");
    expect(reachabilityLabel("blank", 99, executed)).toBe("");
  });
});

describe("REGRESSION — alternate branch (temp = 25): line 7 is reached, must NOT be 'not reached'", () => {
  // The lesson's authored `executable` flag is a single value independent of the
  // input; inferring reachability from it mislabels whichever branch is taken.
  // With temp = 25 the elif body (line 7, `label = "warm"`) genuinely runs.
  let executed = new Set<number>();
  beforeAll(async () => {
    const alt = conditions.code.replace("temp = 30", "temp = 25");
    const res = await runProgram(alt, "");
    expect(res.status).toBe("completed");
    executed = new Set<number>(
      (res.events as TraceEvent[]).filter((e) => e.kind === "line").map((e) => e.line),
    );
  }, 120_000);

  it("the recorded trace reaches line 7 (and not line 5) for temp = 25", () => {
    expect(executed.has(7)).toBe(true);
    expect(executed.has(5)).toBe(false);
  });
  it("line 7 (reached code) gets NO 'not reached' label from real events", () => {
    expect(reachabilityLabel("code", 7, executed)).toBe("");
  });
  it("line 5 (the untaken 'hot' body) IS 'not reached' in this run", () => {
    expect(reachabilityLabel("code", 5, executed)).toBe("(not reached in this run)");
  });
  it("the authored executable flag does NOT decide this — only events do", () => {
    // conditions line 7 is authored executable:false (it emits no event in the
    // default temp=30 trace), yet with temp=25 it IS reached. Proving the label
    // is event-derived, not flag-derived.
    const e7 = conditions.codeExplanations.find((c) => c.line === 7);
    expect(e7?.executable).toBe(false); // authored flag (default-trace oriented)
    expect(reachabilityLabel("code", 7, executed)).toBe(""); // but reached here
  });
});
