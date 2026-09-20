// @vitest-environment node
/**
 * R4 follow-up #5: at the inspection depth limit the tracer returned an opaque
 * type label with NO truncation marker, so the inspector could never tell the
 * learner that deeper data was omitted. The depth-capped object must carry a
 * `truncated` flag.
 *
 * Driven by a deeply nested REAL structure on the bundled Pyodide.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

beforeAll(async () => {
  await runProgram("x = 1\n");
}, 120_000);

type TV = { kind: string; id?: string };
type Obj = { id: string; type: string; entries?: unknown[]; repr?: string; truncated?: boolean };
type Ev = { frames: { locals: { name: string; value: TV }[] }[]; objects: Record<string, Obj> };
type Res = { events: Ev[] };

describe("tracer — depth cap marks truncation", () => {
  it("a structure nested past the depth limit yields a depth-capped object flagged truncated", async () => {
    // 16 levels of nested lists exceeds the depth cap (12).
    const src = "d = " + "[".repeat(16) + "0" + "]".repeat(16) + "\ny = 1\n";
    const res = (await runProgram(src)) as Res;
    const ev = res.events[res.events.length - 1];

    // Find any object that is a depth-cap sentinel: has a repr, no entries.
    const capped = Object.values(ev.objects).filter((o) => o && o.repr && !o.entries);
    expect(capped.length).toBeGreaterThan(0);
    // At least one depth-capped object must be marked truncated so the inspector
    // can surface the omission.
    expect(capped.some((o) => o.truncated === true)).toBe(true);
  });
});
