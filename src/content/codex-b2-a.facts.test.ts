// @vitest-environment node
import { describe, expect, it } from "vitest";
import { lessons } from "./registry";
// @ts-expect-error The bundled Python harness is a JavaScript module.
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

const lesson = (id: string) => lessons.find((item) => item.id === id)!;

describe("Delegated review: array teaching agrees with executable contracts", () => {
  it("does not claim a middle-element self-swap undoes reversal", () => {
    expect(lesson("two-pointers").concepts.commonMistakes).not.toContain("swaps the middle element back");
  });

  it("confirms <= is harmless for this reversal, on odd and even arrays", async () => {
    for (const arr of [[], [1], [1, 2, 3], [1, 2, 3, 4]]) {
      const code = lesson("two-pointers").code
        .replace("arr = [1, 2, 3, 4, 5]", `arr = ${JSON.stringify(arr)}`)
        .replace("while lo < hi:", "while lo <= hi:");
      const result = await runProgram(code, "");
      expect(result.status).toBe("completed");
      expect(result.stdout.trim()).toBe(`[${arr.toReversed().join(", ")}]`);
    }
  }, 120_000);

  it("the effective sum_all hints describe returning, not printing", () => {
    const hints = lesson("array-traversal").exercises.find((e) => e.id === "arr-trav-complete-1")!.hints.join(" ");
    expect(hints).toMatch(/return.*total/i);
    expect(hints).not.toMatch(/print (the )?total/i);
  });

  it("recognition feedback accepts prefix sums as correct for fixed-width sums", () => {
    const e = lesson("sliding-window").exercises.find((e) => e.id === "sw-choose-1")!;
    expect([e.prompt, e.expected, ...e.hints].join(" ")).toMatch(/prefix sums.*(valid|correct)/i);
    expect(e.hints.join(" ")).not.toContain("neither matching 'exactly k'");
  });

  it("Kadane's constant-space model does not allocate a slice", () => {
    const e = lesson("kadane").exercises.find((e) => e.id === "kad-fix-1")!;
    expect(e.expected).not.toContain("nums[1:]");
    expect(e.hints.join(" ")).not.toContain("nums[1:]");
    expect(e.prompt).toMatch(/non.?empty/i);
  });

  it("the write-pointer prediction does not presuppose overwriting unread positions", () => {
    expect(lesson("in-place-modification").prediction[0].prompt).not.toContain("positions we may not have read yet");
  });

  it.each([
    ["loops", "loop-complete-1"],
    ["matrix-traversal", "mat-complete-1"],
    ["string-frequency", "sf-complete-1"],
  ])("%s function hints agree with their return-value contract", (id, exerciseId) => {
    const e = lesson(id).exercises.find((x) => x.id === exerciseId)!;
    expect(e.expected).toMatch(/return/);
    const pseudocode = e.hints.find((x) => x.startsWith("Pseudocode:"))!;
    expect(pseudocode).toMatch(/return/);
    expect(pseudocode).not.toMatch(/print (count|total|freq)/);
  });

  it("merging empty intervals produces an empty result", async () => {
    const result = await runProgram(lesson("intervals").code.replace("intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]", "intervals = []"), "");
    expect(result.status).toBe("completed");
    expect(result.stdout.trim()).toBe("[]");
  }, 120_000);

  it("defines closed-interval overlap using both endpoints", () => {
    expect(lesson("intervals").vocabulary.find((v) => v.term === "Overlap")!.definition).toContain("max");
  });

  it.each(["two-pointers", "in-place-modification"])("%s scopes constant space to the operation", (id) => {
    expect(lesson(id).complexityExplanation!.scope).toBe("operation");
    expect(lesson(id).complexityExplanation!.space.inputOutputNote).toMatch(/print/i);
  });

  it("matrix analysis accounts for empty rows", () => {
    expect(lesson("matrix-traversal").complexityExplanation!.assumptions.join(" ")).toMatch(/R.*N/);
  });

  it("hashing costs do not label expected time as an unconditional worst-case bound", () => {
    const row = lesson("string-frequency").complexity[0];
    expect(row.worst).not.toBe(row.average);
  });

  it("parse_max hints return the maximum and distinguish whitespace from malformed input", () => {
    const x = lesson("string-parsing");
    const e = x.exercises.find((x) => x.id === "sp-complete-1")!;
    expect(e.hints.join(" ")).not.toContain("print(max(nums))");
    expect(x.concepts.edgeCases).toMatch(/int.*whitespace/);
    expect(e.prompt).toMatch(/non.?empty/);
  });

  it("sorted anagram copies are honestly linear space", () => {
    expect(lesson("anagrams").explanation).not.toContain("O(1)-ish");
  });

  it("materialized substring analysis matches cubic copying work", () => {
    expect(lesson("substrings").complexityExplanation!.time.bound).toBe("O(n^3)");
    expect(lesson("substrings").explanation).toMatch(/monotone|monotonic/);
  });

  it("hashability depends on tuple contents rather than immutability alone", () => {
    const x = lesson("maps-sets");
    expect(x.explanation).toMatch(/tuple.*all.*hashable/);
    expect(x.vocabulary.find((x) => x.term === "Hashable")!.definition).not.toContain("immutable with");
  });

  it("a duplicate value is not presented as an array index", () => {
    expect(lesson("duplicate-detection").bindings[0].overlays ?? []).toEqual([]);
  });

  it("duplicate recognition specifies a genuinely constant-space sorting algorithm", () => {
    const e = lesson("duplicate-detection").exercises.find((x) => x.id === "dup-choose-1")!;
    expect([e.expected, ...e.hints, e.recognition!.modelExplanation].join(" ")).toMatch(/heapsort/i);
    expect(lesson("duplicate-detection").explanation).toMatch(/Python.*sort.*O\(n\)/);
  });

  it("frequency program analysis includes its deterministic key sort", () => {
    expect(lesson("hashing-frequency").complexityExplanation!.time.bound).toBe("O(n + k log k)");
  });
});
