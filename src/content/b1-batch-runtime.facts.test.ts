// @vitest-environment node
/**
 * R9 / B1 batch amendment — RUNTIME behavioral regressions (distinct from the
 * CONTENT regex assertions in b1-batch-corrections.facts.test.ts). These run
 * real Python on the bundled Pyodide (CPython 3.14.2) and assert the empirical
 * facts the lesson text now relies on. If the runtime ever disagrees, these
 * fail — unlike a prose check, which only proves the text says something.
 */
import { describe, it, expect, beforeAll } from "vitest";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

async function run(lines: string[]): Promise<string> {
  const res = await runProgram(lines.join("\n"), "");
  expect(res.status).toBe("completed");
  return res.stdout as string;
}

describe("representations: integer hash collisions are a NONNEGATIVE-family fact (signed differs)", () => {
  it("nonnegative multiples of P collide at hash 0; signed congruent ints do NOT", async () => {
    const out = await run([
      "import sys",
      "P = sys.hash_info.modulus",
      "print(P)",
      "print(hash(0) == 0 and hash(P) == 0 and hash(2*P) == 0 and hash(3*P) == 0)",
      "print((-1) % P == (P-1) % P)",            // congruent mod P
      "print(hash(-1) == hash(P-1))",            // but hashes differ
      "print(hash(-1))",
      "print(hash(P-1) == P-1)",
    ]);
    const [p, nonnegCollide, congruent, signedCollide, hNeg1, hPm1] = out.trim().split("\n");
    expect(p).toBe("2147483647");                // bundled 32-bit runtime
    expect(nonnegCollide).toBe("True");          // 0, P, 2P, 3P -> hash 0
    expect(congruent).toBe("True");              // -1 and P-1 ARE congruent mod P
    expect(signedCollide).toBe("False");         // but their hashes are NOT equal
    expect(hNeg1).toBe("-2");                    // documented -1 avoidance
    expect(hPm1).toBe("True");                   // hash(P-1) == P-1
  });
});

describe("amortized: CPython list growth uses a 4-byte pointer build (not 8)", () => {
  it("struct.calcsize('P') is 4 and the capacity sequence matches a 4-byte pointer", async () => {
    const out = await run([
      "import sys, struct",
      "per = struct.calcsize('P')",
      "print(per)",
      "empty = sys.getsizeof([])",
      "lst = []",
      "seq = []",
      "last = -1",
      "for i in range(40):",
      "    lst.append(i)",
      "    s = sys.getsizeof(lst)",
      "    if s != last:",
      "        seq.append((s - empty)//per)",
      "        last = s",
      "print(seq)",
    ]);
    const [per, seq] = out.trim().split("\n");
    expect(per).toBe("4");
    // 4-byte-pointer capacity growth points on the bundled runtime.
    expect(seq).toBe("[4, 8, 16, 24, 32, 40]");
  });
});

describe("complexity: find_max([]) fails at nums[0] (nonempty precondition)", () => {
  it("raises IndexError on an empty list", async () => {
    const res = await runProgram(
      [
        "def find_max(nums):",
        "    best = nums[0]",
        "    for x in nums:",
        "        if x > best:",
        "            best = x",
        "    return best",
        "find_max([])",
      ].join("\n"),
      "",
    );
    expect(res.status).toBe("error");
    expect(String(res.stderr)).toContain("IndexError");
  });
});
