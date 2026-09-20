// @vitest-environment node
/**
 * R4 follow-up #4: typed tuple dict keys must be displayed DISTINCTLY. The tracer
 * previously formatted a tuple key by joining each element's display only,
 * discarding element types, so `(1, 2)` and `('1', 2)` rendered identically.
 *
 * Driven by a REAL traced dictionary on the bundled Pyodide.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

beforeAll(async () => {
  await runProgram("x = 1\n");
}, 120_000);

type TV = { kind: string; value?: unknown; id?: string };
type Obj = { id: string; type: string; entries?: { key: string; keyKind?: string; value: TV }[] };
type Ev = { frames: { locals: { name: string; value: TV }[] }[]; objects: Record<string, Obj> };
type Res = { events: Ev[] };

function lastDict(res: Res, name: string): Obj | undefined {
  const ev = res.events[res.events.length - 1];
  let ref: TV | undefined;
  for (const f of ev.frames) for (const l of f.locals) if (l.name === name) ref = l.value;
  return ref && ref.kind === "ref" ? ev.objects[ref.id!] : undefined;
}

describe("tracer — typed tuple dict keys are displayed distinctly", () => {
  it("(1, 2) and ('1', 2) produce DIFFERENT key displays", async () => {
    const res = (await runProgram("d = {(1, 2): 'ints', ('1', 2): 'mixed'}\nx = 1\n")) as Res;
    const d = lastDict(res, "d");
    expect(d?.type).toBe("dict");
    const keys = (d?.entries ?? []).map((e) => e.key);
    expect(keys.length).toBe(2);
    // The two keys must NOT be the same string.
    expect(keys[0]).not.toBe(keys[1]);
    // The int-tuple shows bare ints; the mixed tuple quotes its string element.
    expect(keys).toContain("(1, 2)");
    expect(keys.some((k) => k.includes("'1'") || k.includes('"1"'))).toBe(true);
  });

  it("nested tuple keys preserve element types too", async () => {
    const res = (await runProgram("d = {(1, ('a', 2)): 'x'}\ny = 1\n")) as Res;
    const d = lastDict(res, "d");
    const key = d?.entries?.[0]?.key ?? "";
    // The inner string 'a' must be quoted; the ints bare.
    expect(key).toMatch(/'a'|"a"/);
    expect(key).toContain("1");
    expect(key).toContain("2");
  });

  it("keyKind for a tuple key is reported as 'tuple'", async () => {
    const res = (await runProgram("d = {(1, 2): 'x'}\nz = 1\n")) as Res;
    const d = lastDict(res, "d");
    expect(d?.entries?.[0]?.keyKind).toBe("tuple");
  });
});
