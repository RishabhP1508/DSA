// @vitest-environment node
/**
 * R5.6 amendment — the "bridged" Notion mappings must actually be TAUGHT in the
 * mapped lesson's LEARNER-FACING content (explanation + experiments + exercises),
 * not merely asserted in a rationale or a developer doc. Each test below reads
 * only learner-visible fields of the mapped lesson and requires the adaptation
 * AND its correctness condition to be present, then checks the manifest keeps the
 * occurrence `mapped` to that lesson. If a bridge is ever removed from the
 * lesson, this fails — so a mapped assertion can't outlive the teaching.
 */
import { describe, it, expect } from "vitest";
import { lessons } from "./registry";
import { NOTION_PRACTICE } from "./notion-practice";
import type { LessonDefinition } from "../core/types";

const byId = (id: string): LessonDefinition => {
  const l = lessons.find((x) => x.id === id);
  if (!l) throw new Error(`lesson not found: ${id}`);
  return l;
};

/** All learner-facing text of a lesson (what a learner can actually read). */
function learnerText(l: LessonDefinition): string {
  return [
    l.explanation,
    l.review,
    ...l.experiments,
    ...l.exercises.flatMap((e) => [e.prompt, e.expected ?? "", ...(e.hints ?? [])]),
  ].join("\n").toLowerCase();
}

/** Assert the manifest maps `url` to `lessonId` with status mapped. */
function assertMapped(url: string, lessonId: string) {
  const rows = NOTION_PRACTICE.filter((r) => r.url === url);
  expect(rows.length, `no manifest row for ${url}`).toBeGreaterThan(0);
  for (const r of rows) {
    expect(r.status, `${url} must be mapped (bridge is taught)`).toBe("mapped");
    expect(r.mappedIds, `${url} must map to ${lessonId}`).toContain(lessonId);
  }
}

describe("R5.6 bridge — Product of Array Except Self is taught in prefix-sums", () => {
  const t = learnerText(byId("prefix-sums"));
  it("teaches the two-pass prefix/suffix PRODUCT adaptation", () => {
    expect(t).toMatch(/product of array except self|prefix.?product|suffix.?product|prefix products/);
    expect(t).toMatch(/two pass|two-pass|left.?to.?right|right.?to.?left/);
  });
  it("states the exclude-self / no-division correctness condition", () => {
    expect(t).toMatch(/exclud|except nums\[i\]|all except/);
    expect(t).toMatch(/no division|without division|division would|zero/);
  });
  it("manifest keeps it mapped to prefix-sums", () => {
    assertMapped("https://leetcode.com/problems/product-of-array-except-self/", "prefix-sums");
  });
});

describe("R5.6 bridge — Longest Palindromic Substring is taught in palindromes", () => {
  const t = learnerText(byId("palindromes"));
  it("teaches expand-around-center", () => {
    expect(t).toMatch(/expand around center|expand.*center|center.*expand|longest palindromic substring/);
  });
  it("states the must-check-both-odd-and-even-centers condition", () => {
    expect(t).toMatch(/odd/);
    expect(t).toMatch(/even/);
    expect(t).toMatch(/2n.?1|both|gap between/);
  });
  it("manifest keeps it mapped to palindromes", () => {
    assertMapped("https://leetcode.com/problems/longest-palindromic-substring/", "palindromes");
  });
});

describe("R5.6 bridge — Largest Rectangle in Histogram is taught in monotonic-stack", () => {
  const t = learnerText(byId("monotonic-stack"));
  it("teaches the width-on-pop histogram adaptation", () => {
    expect(t).toMatch(/largest rectangle|histogram/);
    expect(t).toMatch(/width/);
  });
  it("states the sentinel-flush correctness condition", () => {
    expect(t).toMatch(/sentinel|flush|height.?0|height 0/);
  });
  it("manifest keeps it mapped to monotonic-stack", () => {
    assertMapped("https://leetcode.com/problems/largest-rectangle-in-histogram/", "monotonic-stack");
  });
});

describe("R5.6 bridge — Combination Sum is taught in dp-combinations", () => {
  const t = learnerText(byId("dp-combinations"));
  it("teaches reuse (recurse from same index) + running target", () => {
    expect(t).toMatch(/combination sum/);
    expect(t).toMatch(/reuse|same index|bt\(i,|recurse from i\b|from i\b/);
    expect(t).toMatch(/target|remaining/);
  });
  it("states the prune-on-overshoot / non-decreasing-index condition", () => {
    expect(t).toMatch(/prune|remaining < 0|remaining<0|negative|overshoot/);
    expect(t).toMatch(/non-decreasing|increasing|duplicate|order/);
  });
  it("manifest keeps it mapped to dp-combinations", () => {
    assertMapped("https://leetcode.com/problems/combination-sum/", "dp-combinations");
  });
});

describe("R5.6 bridge — Sum of Two Integers is taught in bit-logical-ops", () => {
  const t = learnerText(byId("bit-logical-ops"));
  it("teaches XOR-sum / AND-carry addition", () => {
    expect(t).toMatch(/sum of two integers|without .?\+.?|add without/);
    expect(t).toMatch(/carry/);
    expect(t).toMatch(/a \^ b|xor/);
  });
  it("states the Python 32-bit mask correctness condition", () => {
    expect(t).toMatch(/mask|0xffffffff|32.?bit/);
    expect(t).toMatch(/arbitrary.?precision|never terminat|forever|spin|signed|two's complement/);
  });
  it("manifest keeps it mapped to bit-logical-ops", () => {
    assertMapped("https://leetcode.com/problems/sum-of-two-integers/", "bit-logical-ops");
  });
});
