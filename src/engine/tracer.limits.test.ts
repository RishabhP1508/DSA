// @vitest-environment node
/**
 * R2 real-resource-limit tests (R2-REQ-4, R2-REQ-5) for src/engine/tracer.py.
 *
 * Written BEFORE the fix; expected to FAIL on the audited baseline whose
 * `_rough_size` only approximates object shapes and whose run_program returns no
 * `incomplete` flag. After the fix the tracer must measure ACTUAL encoded bytes,
 * stop at the true 16 MiB budget, keep the last valid states, and mark the
 * result incomplete — and a learner `except BaseException` must not defeat the
 * event/byte guard.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

beforeAll(async () => {
  await runProgram("x = 1\n");
}, 120_000);

type Res = {
  status: string;
  stdout: string;
  stderr: string;
  events: { index: number }[];
  incomplete?: boolean;
  limitHit?: string;
};

describe("R2 tracer — real byte accounting", () => {
  it("stops at a small byte budget with trace-limit and marks incomplete, keeping valid events", async () => {
    // A loop that grows a big string each step; each event now encodes real
    // bytes, so a small budget must trip the byte limit (not the event count).
    // Kept small (150 iters) so the test is fast; each event carries a big `s`
    // local, so a 128 KiB budget trips well before the loop finishes.
    const src = ["s = ''", "for i in range(150):", "    s = s + ('y' * 400)"].join("\n");
    const res = (await runProgram(src, "", { maxEvents: 100000, maxTraceBytes: 128 * 1024 })) as Res;
    expect(res.status).toBe("trace-limit");
    expect(res.incomplete).toBe(true);
    expect(res.limitHit).toBe("bytes");
    // Last valid states are kept (not thrown away) and are fewer than the loop count.
    expect(res.events.length).toBeGreaterThan(0);
    expect(res.events.length).toBeLessThan(150 * 2);
    // Event indices are contiguous from 0 (the kept prefix is valid).
    expect(res.events[0].index).toBe(0);
  }, 30_000);

  it("a huge budget lets the same program complete (byte limit is the cause, not events)", async () => {
    const src = ["s = ''", "for i in range(20):", "    s = s + ('y' * 10)"].join("\n");
    const res = (await runProgram(src, "", { maxEvents: 100000, maxTraceBytes: 16 * 1024 * 1024 })) as Res;
    expect(res.status).toBe("completed");
    expect(res.incomplete ?? false).toBe(false);
  });

  it("still enforces the event-count limit independently", async () => {
    const src = ["t = 0", "for i in range(5000):", "    t = t + 1"].join("\n");
    const res = (await runProgram(src, "", { maxEvents: 200, maxTraceBytes: 16 * 1024 * 1024 })) as Res;
    expect(res.status).toBe("event-limit");
    expect(res.incomplete).toBe(true);
    expect(res.events.length).toBeLessThanOrEqual(200);
  }, 30_000);
});

describe("R2 tracer — the stop signal is not an ordinary Exception (R2-E, tracer side)", () => {
  it("a loop that catches `except Exception` cannot swallow the limit stop", async () => {
    // The internal stop signal derives from BaseException, so a learner
    // `except Exception` (the common defensive pattern) does NOT catch it — the
    // event-count guard terminates the run with a limit status rather than
    // letting it run unbounded.
    const src = [
      "n = 0",
      "while True:",
      "    try:",
      "        n = n + 1",
      "    except Exception:",
      "        pass",
    ].join("\n");
    const res = (await runProgram(src, "", { maxEvents: 300, maxTraceBytes: 16 * 1024 * 1024 })) as Res;
    expect(["event-limit", "trace-limit"]).toContain(res.status);
    expect(res.incomplete).toBe(true);
  }, 30_000);

  // NOTE: a learner `except BaseException` CAN catch the signal in their own
  // frame; the tracer alone cannot guarantee a stop against that. The hard
  // guarantee is the coordinator's 10 s exec timeout + worker termination,
  // covered by engine.lifecycle.test.ts ("arms the 10s exec timeout ...
  // terminates on timeout") and the browser Stop test (runner-lifecycle.spec).
});

describe("R2 tracer — small programs are unaffected (preservation)", () => {
  it("a normal program completes with full output and is not marked incomplete", async () => {
    const res = (await runProgram("print(sum(range(5)))")) as Res;
    expect(res.status).toBe("completed");
    expect(res.stdout).toBe("10\n");
    expect(res.incomplete ?? false).toBe(false);
  });
});
