// @vitest-environment node
/**
 * R2 coordinator lifecycle tests (R2-REQ-1,2,3,6,7).
 *
 * Written BEFORE the fix; expected to FAIL on the audited baseline whose
 * ExecutionEngine spawns a real Worker in its constructor, has no state machine,
 * no separate init/exec timeouts, and no injectable worker factory.
 *
 * We drive the engine with a FAKE worker (no Pyodide, no real thread) via an
 * injectable factory so we can deterministically simulate init, exec-start,
 * streaming, results, stalls, and stale messages.
 */
import { describe, it, expect, vi } from "vitest";
import { ExecutionEngine } from "./engine";
import { PROTOCOL_VERSION, type OutboundMessage, type InboundMessage } from "./protocol";

/**
 * A controllable fake of the Worker interface the engine talks to. It records
 * posted messages, lets the test push worker→main messages, and tracks
 * terminate() calls so we can assert the engine tears workers down.
 */
class FakeWorker {
  static instances: FakeWorker[] = [];
  posted: InboundMessage[] = [];
  terminated = false;
  onmessage: ((ev: { data: OutboundMessage }) => void) | null = null;
  onerror: ((ev: unknown) => void) | null = null;

  constructor() {
    FakeWorker.instances.push(this);
  }
  postMessage(m: InboundMessage) {
    this.posted.push(m);
  }
  terminate() {
    this.terminated = true;
  }
  // Test helpers -----------------------------------------------------------
  emit(msg: Partial<OutboundMessage> & { kind: OutboundMessage["kind"] }) {
    const runId = this.lastRunId();
    const full = {
      v: PROTOCOL_VERSION,
      runId,
      owner: "test",
      sourceRev: 0,
      inputRev: 0,
      seq: this.seq++,
      payload: {},
      ...msg,
    } as OutboundMessage;
    this.onmessage?.({ data: full });
  }
  private seq = 0;
  private lastRunId(): number {
    for (let i = this.posted.length - 1; i >= 0; i--) {
      const p = this.posted[i];
      if (p.kind === "run") return p.runId;
    }
    return 1;
  }
}

function newEngine() {
  FakeWorker.instances = [];
  const engine = new ExecutionEngine({
    // The new engine must accept an injectable factory for testing.
    workerFactory: () => new FakeWorker() as unknown as Worker,
  });
  return engine;
}

async function tick() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("R2 engine — lazy worker (R2-REQ-1)", () => {
  it("creates NO worker until the first run", () => {
    const engine = newEngine();
    expect(FakeWorker.instances.length).toBe(0);
    engine.dispose();
  });
});

describe("R2 engine — lifecycle states + single settle (R2-REQ-6)", () => {
  it("transitions idle → initializing → running → completed and settles once", async () => {
    const engine = newEngine();
    const states: string[] = [];
    engine.onStateChange = (s) => states.push(s);

    const p = engine.run("x = 1", { owner: "lesson:demo" });
    await tick();
    const w = FakeWorker.instances[0];
    expect(w).toBeTruthy();
    expect(engine.state).toBe("initializing");

    w.emit({ kind: "ready" });
    await tick();
    w.emit({ kind: "exec-start" });
    await tick();
    expect(engine.state).toBe("running");

    w.emit({
      kind: "result",
      payload: { status: "completed", tail: [], stdout: "", stderr: "", incomplete: false },
    });
    const res = await p;
    expect(res.status).toBe("completed");
    expect(engine.state).toBe("completed");
    expect(states).toContain("initializing");
    expect(states).toContain("running");
    // Worker is terminated on settle (R2-REQ-2).
    expect(w.terminated).toBe(true);
    engine.dispose();
  });
});

describe("R2 engine — streaming assembly (R2-REQ-7)", () => {
  it("assembles the full trace from batches + the final tail (final does not resend all)", async () => {
    const engine = newEngine();
    const p = engine.run("x = 1", { owner: "o" });
    await tick();
    const w = FakeWorker.instances[0];
    w.emit({ kind: "ready" });
    w.emit({ kind: "exec-start" });
    w.emit({ kind: "trace-batch", payload: { events: [{ index: 0 } as never, { index: 1 } as never] } });
    w.emit({ kind: "trace-batch", payload: { events: [{ index: 2 } as never] } });
    w.emit({
      kind: "result",
      payload: { status: "completed", tail: [{ index: 3 } as never], stdout: "", stderr: "", incomplete: false },
    });
    const res = await p;
    expect(res.events.map((e) => e.index)).toEqual([0, 1, 2, 3]);
    engine.dispose();
  });
});

describe("R2 engine — timeouts (R2-REQ-6)", () => {
  it("uses a 30s init timeout SEPARATE from the 10s exec timeout", async () => {
    vi.useFakeTimers();
    const engine = newEngine();
    const p = engine.run("x = 1", { owner: "o" });
    await Promise.resolve();
    // Never send ready: init timeout should fire at 30s (not 10s).
    vi.advanceTimersByTime(10_000);
    await Promise.resolve();
    expect(engine.state).toBe("initializing"); // exec timer not armed yet
    vi.advanceTimersByTime(20_001);
    const res = await p;
    expect(res.status).toBe("error"); // init timeout → recoverable error
    expect(FakeWorker.instances[0].terminated).toBe(true);
    vi.useRealTimers();
    engine.dispose();
  });

  it("arms the 10s exec timeout only after exec-start and terminates on timeout", async () => {
    vi.useFakeTimers();
    const engine = newEngine();
    const p = engine.run("while True: pass", { owner: "o" });
    await Promise.resolve();
    const w = FakeWorker.instances[0];
    w.emit({ kind: "ready" });
    w.emit({ kind: "exec-start" });
    await Promise.resolve();
    vi.advanceTimersByTime(10_001);
    const res = await p;
    expect(res.status).toBe("timeout");
    expect(w.terminated).toBe(true);
    vi.useRealTimers();
    engine.dispose();
  });
});

describe("R2 engine — supersede, stop, stale rejection (R2-REQ-2,6)", () => {
  it("a new run supersedes the previous pending run (settled once as stopped)", async () => {
    const engine = newEngine();
    const p1 = engine.run("a = 1", { owner: "o1" });
    await tick();
    const p2 = engine.run("b = 2", { owner: "o2" });
    const r1 = await p1;
    expect(r1.status).toBe("stopped");
    await tick();
    const w2 = FakeWorker.instances[FakeWorker.instances.length - 1];
    w2.emit({ kind: "ready" });
    w2.emit({ kind: "exec-start" });
    w2.emit({ kind: "result", payload: { status: "completed", tail: [], stdout: "", stderr: "", incomplete: false } });
    const r2 = await p2;
    expect(r2.status).toBe("completed");
    engine.dispose();
  });

  it("stop() works during initialization", async () => {
    const engine = newEngine();
    const p = engine.run("x = 1", { owner: "o" });
    await tick();
    const w = FakeWorker.instances[0];
    engine.stop();
    const res = await p;
    expect(res.status).toBe("stopped");
    expect(w.terminated).toBe(true);
    engine.dispose();
  });

  it("ignores a stale result from a superseded run (cannot overwrite newer)", async () => {
    const engine = newEngine();
    const p1 = engine.run("a = 1", { owner: "o1" });
    await tick();
    const w1 = FakeWorker.instances[0];
    const p2 = engine.run("b = 2", { owner: "o2" });
    await p1; // settled as stopped
    await tick();
    // The OLD worker now tries to report a result — must be ignored.
    w1.emit({ kind: "result", payload: { status: "completed", tail: [{ index: 99 } as never], stdout: "STALE", stderr: "", incomplete: false } });
    await tick();
    const w2 = FakeWorker.instances[FakeWorker.instances.length - 1];
    w2.emit({ kind: "ready" });
    w2.emit({ kind: "exec-start" });
    w2.emit({ kind: "result", payload: { status: "completed", tail: [], stdout: "FRESH", stderr: "", incomplete: false } });
    const r2 = await p2;
    expect(r2.stdout).toBe("FRESH");
    engine.dispose();
  });
});

describe("R2 engine — missing runtime asset is recoverable (R2 acceptance)", () => {
  it("a worker error resolves as a recoverable error, app stays usable", async () => {
    const engine = newEngine();
    const p = engine.run("x = 1", { owner: "o" });
    await tick();
    const w = FakeWorker.instances[0];
    w.emit({ kind: "error", payload: { message: "Failed to load runtime", recoverable: true } });
    const res = await p;
    expect(res.status).toBe("error");
    expect(res.stderr).toContain("runtime");
    expect(w.terminated).toBe(true);
    // Engine can run again afterwards.
    expect(engine.state === "error" || engine.state === "idle").toBe(true);
    engine.dispose();
  });
});
