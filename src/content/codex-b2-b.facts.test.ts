// @vitest-environment node
import { describe, expect, it } from "vitest";
import { lessons, patterns } from "./registry";
const lesson = (id: string) => lessons.find(x => x.id === id)!;
const pattern = (id: string) => patterns.find(x => x.id === id)!;
describe("B2-B teaching regressions", () => {
  it("does not reverse Python's bitwise vs comparison precedence", () => {
    expect(lesson("bit-logical-ops").concepts.commonMistakes).not.toContain("looser than ==");
    expect(lesson("bit-logical-ops").concepts.commonMistakes).toMatch(/tighter than.*==/);
  });
  it("qualifies addition carry failure with an actual counterexample", () => {
    const l = lesson("bit-logical-ops");
    expect(l.explanation).not.toContain("a negative sum's carry never");
    expect(l.explanation).toContain("-1 + 1");
    expect(l.explanation).toContain("32-bit signed");
  });
  it("accounts for the shift distance when Python allocates left-shift results", () => {
    expect(lesson("bit-shifts").explanation).toMatch(/O\(w\s*\+\s*k\)/);
    expect(lesson("bit-shifts").concepts.tradeoffs).not.toContain("just as fast");
  });
  it("restricts Kernighan to nonnegative integers and guards zero in a power test", () => {
    const l = lesson("count-set-bits");
    expect(l.code).toContain("if n < 0:");
    expect(l.experiments.join(" ")).toContain("n > 0");
    expect(l.explanation).toContain("absolute value");
  });
  it("counts memoized non-base work rather than claiming base calls are cached", () => {
    const l = lesson("caching-seen");
    expect(l.explanation).toMatch(/base cases.*not cached/i);
    expect(l.exercises.find(e=>e.id==="cache-choose-1")!.expected).toMatch(/work per subproblem|state.*transition/i);
    expect(l.complexityExplanation.time.case).toBe("expected");
  });
  it("does not generalize a monotone-sum restriction to fixed windows", () => {
    expect(lesson("prefix-sums-map").explanation).toMatch(/fixed[- ](?:size|width).*negative/i);
    expect(pattern("prefix-sums-hashmap").alternatives.join(" ")).toMatch(/fixed[- ](?:size|width).*negative/i);
  });
  it("keeps exclusive prefix endpoints consistent", () => {
    expect(pattern("prefix-sums-hashmap").whyItHelps).toContain("[i, j)");
  });
  it("avoids a missing-key insertion before counting prefixes", () => {
    expect(pattern("prefix-sums-hashmap").walkthroughCode).toContain("seen.get(prefix - k, 0)");
  });
  it("walkthroughs claiming constant auxiliary space do not copy their inputs", () => {
    expect(pattern("sliding-window").walkthroughCode).not.toContain("nums[:k]");
    expect(pattern("kadane").walkthroughCode).not.toContain("nums[1:]");
    expect(pattern("kadane").exercises.find(e=>e.id==="pat-kadane-fix-1")!.expected).not.toContain("nums[1:]");
  });
  it("does not draw Kadane's best sum as an array index", () => {
    expect(pattern("kadane").bindings?.flatMap(b=>b.overlays??[]).find(o=>o.source==="best")?.role).toBe("total");
  });
  it("shows KMP text and pattern indices on their own strings", () => {
    const b=lesson("kmp").bindings!;
    expect(b.find(x=>x.variable==="text")?.overlays?.some(o=>o.source==="j")).toBeFalsy();
    expect(b.find(x=>x.variable==="pattern")?.overlays?.some(o=>o.source==="j")).toBe(true);
  });
  it("gives KMP the same empty-pattern convention in example and exercise", () => {
    expect(lesson("kmp").code).toContain("return list(range(len(text) + 1))");
    expect(lesson("kmp").concepts.edgeCases).toMatch(/empty pattern.*boundar/i);
  });
  it("spiral handles an empty outer list", () => {
    expect(pattern("matrix-traversal").walkthroughCode).toContain("if not matrix:");
  });
  it("cyclic placement argues per fixed slot, not per moving value", () => {
    expect(pattern("cyclic-sort").whyItHelps).not.toContain("Each number reaches its slot in at most one swap");
    expect(pattern("cyclic-sort").walkthroughCode).toContain("0 <= j < n");
    expect(pattern("cyclic-sort").complexityNote).not.toContain("each value is placed with at most one swap");
    expect(pattern("cyclic-sort").complexityExplanation.scope).toBe("operation");
  });
  it("does not call an always-inward pointer bug an infinite loop", () => {
    const e=pattern("two-pointers").exercises.find(e=>e.id==="pat-tp-fix-1")!;
    expect(e.prompt).not.toContain("can loop");
    expect(e.hints.join(" ")).not.toContain("loops");
  });
  it("hashing-based two-sum uses expected rather than universal linear time", () => {
    expect(lesson("value-to-index").complexityExplanation.time.case).toBe("expected");
    expect(lesson("value-to-index").complexity[0].worst).toBe("O(n²)");
  });
  it("grouping accounts for key hashing, references, and nonempty exercise words", () => {
    const l=lesson("grouping");
    expect(l.complexityExplanation.time.case).toBe("expected");
    expect(l.complexityExplanation.costModel).toContain("hash");
    expect(l.complexityExplanation.space.explanation).toContain("references");
    expect(l.exercises.find(e=>e.id==="grp-complete-1")!.prompt).toContain("nonempty");
  });
  it("does not imply an XOR fold lists every odd-count value", () => {
    expect(lesson("xor-cancellation").explanation).toContain("1 ^ 2 ^ 3 = 0");
    expect(pattern("bitwise-xor").conditions.join(" ")).toContain("exactly one");
  });
  it("limits constant-space XOR claims to bounded-size numbers", () => {
    expect(lesson("xor-cancellation").explanation).toContain("O(n*w)");
    expect(pattern("bitwise-xor").complexityNote).toContain("bounded-size");
  });
  it("does not cite an unrelated network protocol as an algorithm reference", () => {
    expect(pattern("sliding-window").references.some(r=>r.url.includes("Sliding_window_protocol"))).toBe(false);
  });
});
