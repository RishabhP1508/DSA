// @vitest-environment node
/**
 * R9/B1 amendment (finding 5) — the UI line label must distinguish a genuine
 * comment/blank from a real code statement that was simply NOT REACHED in the
 * current trace. Previously every `executable: false` line was labeled
 * "(comment)", which mislabeled skipped statements (e.g. the conditions
 * elif/else branch).
 */
import { describe, it, expect } from "vitest";
import { classifyLine, lineLabelText, labelForLine } from "./line-label";
import { lessons } from "../content/registry";

describe("classifyLine — static source classification vs executable flag", () => {
  it("labels a comment line as comment regardless of executable", () => {
    expect(classifyLine("# a comment", false)).toBe("comment");
    expect(lineLabelText(classifyLine("    # indented comment", false))).toBe("(comment)");
  });
  it("labels a blank line as blank", () => {
    expect(classifyLine("", false)).toBe("blank");
    expect(classifyLine("    ", false)).toBe("blank");
  });
  it("labels a real statement with executable:false as NOT REACHED (not a comment)", () => {
    expect(classifyLine("    label = 'warm'", false)).toBe("not-reached");
    expect(lineLabelText(classifyLine("elif temp >= 20:", false))).toBe("(not reached in this run)");
  });
  it("gives no label to an executable:true statement", () => {
    expect(classifyLine("x = 1", true)).toBe("none");
    expect(lineLabelText(classifyLine("x = 1", true))).toBe("");
  });
});

describe("labelForLine — against the real conditions lesson", () => {
  const conditions = lessons.find((l) => l.id === "conditions")!;
  // In the conditions trace, the elif/else branch (lines 6–9) is a real set of
  // CODE statements that is not reached — it must NOT be labeled "(comment)".
  it("the skipped elif header (line 6) is labeled not-reached, never comment", () => {
    const label = labelForLine(conditions.code, 6, false);
    expect(label).toBe("(not reached in this run)");
    expect(label).not.toBe("(comment)");
  });
  it("an actual comment line (line 1) is labeled comment", () => {
    expect(labelForLine(conditions.code, 1, false)).toBe("(comment)");
  });
  it("a reached statement (line 4: the if test) carries no label", () => {
    expect(labelForLine(conditions.code, 4, true)).toBe("");
  });
});
