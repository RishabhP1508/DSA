/**
 * Main-thread execution coordinator (R2).
 *
 * ONE shared coordinator serves every view (lessons, patterns, Playground,
 * Practice) via `getSharedEngine()`. It:
 *   - creates NO worker until the first run (lazy; fixes R2-A eager workers),
 *   - runs at most one Python job at a time per app window,
 *   - creates a FRESH module worker per run and terminates it on settle, so a
 *     run can never inherit imported-module mutations from an earlier run
 *     (fixes R2-B) and infinite loops are killed by termination,
 *   - uses a 30 s INITIALIZATION timeout separate from the 10 s EXECUTION
 *     timeout (the exec timer is armed only when the worker signals exec-start),
 *   - supersedes a pending run when a new one starts, settles every pending
 *     request exactly once, and rejects stale/superseded results so an old run
 *     can never overwrite a newer editor/exercise,
 *   - speaks the versioned protocol (protocol.ts): validates every inbound
 *     message, assembles the full trace from streamed batches + the final tail.
 *
 * Recorded states are replayed by the UI (replay.ts) without rerunning Python.
 */

import type { RunLimits, RunResult, RunStatus, TraceEvent, EngineState } from "../core/types";
import {
  PROTOCOL_VERSION,
  hash32,
  validateOutbound,
  type InboundMessage,
  type OutboundMessage,
} from "./protocol";

const DEFAULT_LIMITS: RunLimits = {
  timeMs: 10_000,
  maxEvents: 10_000,
  maxTraceBytes: 16 * 1024 * 1024,
};

/** Initialization (runtime warm) budget, SEPARATE from exec time (R2.2). */
export const INIT_TIMEOUT_MS = 30_000;

export type EngineEvents = {
  onReady?: () => void;
  /** Called on every lifecycle state change. */
  onStateChange?: (state: EngineState) => void;
  /**
   * Injectable worker factory (used by tests and, later, by the cross-origin
   * bridge). Defaults to constructing the bundled module worker.
   */
  workerFactory?: () => Worker;
};

interface RunOptions {
  stdin?: string;
  owner?: string;
  limits?: Partial<RunLimits>;
}

/** Internal per-run bookkeeping. */
interface PendingRun {
  runId: number;
  owner: string;
  sourceRev: number;
  inputRev: number;
  worker: Worker;
  resolve: (r: RunResult) => void;
  /** Events assembled from streamed trace-batch messages (before the tail). */
  streamed: TraceEvent[];
  stdoutChunks: string[];
  stderrChunks: string[];
  initTimer: ReturnType<typeof setTimeout> | null;
  execTimer: ReturnType<typeof setTimeout> | null;
  execStarted: boolean;
  settled: boolean;
  seq: number;
}

function defaultWorkerFactory(): Worker {
  return new Worker(new URL("./run.worker.ts", import.meta.url), { type: "module" });
}

export class ExecutionEngine {
  private events: EngineEvents;
  private workerFactory: () => Worker;
  private nextRunId = 1;
  private pending: PendingRun | null = null;
  private _state: EngineState = "idle";

  /**
   * Settable single lifecycle callback (kept for the test contract). Prefer
   * `subscribe()` in app code so multiple views don't clobber each other.
   */
  onStateChange?: (state: EngineState) => void;
  private subscribers = new Set<(state: EngineState) => void>();

  constructor(events: EngineEvents = {}) {
    this.events = events;
    this.onStateChange = events.onStateChange;
    this.workerFactory = events.workerFactory ?? defaultWorkerFactory;
    // NOTE: no worker is created here. A worker is created lazily per run().
  }

  get state(): EngineState {
    return this._state;
  }

  /** Subscribe to lifecycle changes. Returns an unsubscribe function. */
  subscribe(fn: (state: EngineState) => void): () => void {
    this.subscribers.add(fn);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private setState(s: EngineState): void {
    this._state = s;
    this.onStateChange?.(s);
    this.events.onStateChange?.(s);
    for (const fn of this.subscribers) fn(s);
  }

  /**
   * Execute a program and resolve with its recorded result. A previous pending
   * run is superseded (settled once as "stopped"). Never rejects: infrastructure
   * failures resolve with a status "error" RunResult so the UI stays usable.
   */
  run(source: string, opts: RunOptions = {}): Promise<RunResult> {
    // Supersede any in-flight run first (settles it exactly once as stopped).
    this.supersedePending();

    const limits: RunLimits = { ...DEFAULT_LIMITS, ...(opts.limits ?? {}) };
    const runId = this.nextRunId++;
    const owner = opts.owner ?? "anonymous";
    const stdin = opts.stdin ?? "";
    const sourceRev = hash32(source);
    const inputRev = hash32(stdin);

    const worker = this.workerFactory();

    return new Promise<RunResult>((resolve) => {
      const pending: PendingRun = {
        runId,
        owner,
        sourceRev,
        inputRev,
        worker,
        resolve,
        streamed: [],
        stdoutChunks: [],
        stderrChunks: [],
        initTimer: null,
        execTimer: null,
        execStarted: false,
        settled: false,
        seq: 0,
      };
      this.pending = pending;

      worker.onmessage = (ev: MessageEvent) => this.handleMessage(pending, ev.data);
      worker.onerror = () =>
        this.settle(pending, {
          runId,
          status: "error",
          events: pending.streamed,
          stdout: pending.stdoutChunks.join(""),
          stderr: "The execution runtime failed to start.",
          error: { type: "EngineError", message: "runtime worker error" },
        });

      this.setState("initializing");
      // Initialization timeout (runtime warm), separate from exec time.
      pending.initTimer = setTimeout(() => {
        if (pending.settled || pending.execStarted) return;
        this.settle(pending, {
          runId,
          status: "error",
          events: [],
          stdout: "",
          stderr: `The runtime did not become ready within ${INIT_TIMEOUT_MS} ms.`,
          error: { type: "InitTimeout", message: "runtime initialization timed out" },
        });
      }, INIT_TIMEOUT_MS);

      const runMsg: InboundMessage = {
        v: PROTOCOL_VERSION,
        runId,
        owner,
        sourceRev,
        inputRev,
        seq: pending.seq++,
        kind: "run",
        payload: { source, stdin, limits },
      };
      worker.postMessage(runMsg);
    });
  }

  /** Stop the current run immediately (works during init AND execution). */
  stop(): void {
    const p = this.pending;
    if (!p) return;
    // Best-effort notify, then hard-terminate.
    try {
      const stopMsg: InboundMessage = {
        v: PROTOCOL_VERSION,
        runId: p.runId,
        owner: p.owner,
        sourceRev: p.sourceRev,
        inputRev: p.inputRev,
        seq: p.seq++,
        kind: "stop",
        payload: { reason: "user" },
      };
      p.worker.postMessage(stopMsg);
    } catch {
      /* worker may already be gone */
    }
    this.settle(p, {
      runId: p.runId,
      status: "stopped",
      events: p.streamed,
      stdout: p.stdoutChunks.join(""),
      stderr: p.stderrChunks.join(""),
    });
  }

  dispose(): void {
    this.supersedePending("dispose");
  }

  // --- internals ---------------------------------------------------------

  private supersedePending(reason: "supersede" | "dispose" = "supersede"): void {
    const p = this.pending;
    if (!p || p.settled) return;
    this.settle(
      p,
      {
        runId: p.runId,
        status: "stopped",
        events: p.streamed,
        stdout: p.stdoutChunks.join(""),
        stderr: p.stderrChunks.join(""),
      },
      reason,
    );
  }

  /** Resolve a pending run exactly once, clearing timers and killing its worker. */
  private settle(p: PendingRun, result: RunResult, _reason?: string): void {
    if (p.settled) return;
    p.settled = true;
    // Stamp the source/input revisions this result was produced from, so the UI
    // can detect a stale trace after an edit (R4.1). Applied centrally so EVERY
    // terminal path (result/error/timeout/stop/supersede) carries them.
    result.sourceRev = p.sourceRev;
    result.inputRev = p.inputRev;
    if (p.initTimer) clearTimeout(p.initTimer);
    if (p.execTimer) clearTimeout(p.execTimer);
    // Detach handlers before terminating so a late message can't re-enter.
    p.worker.onmessage = null;
    p.worker.onerror = null;
    try {
      p.worker.terminate();
    } catch {
      /* ignore */
    }
    if (this.pending === p) {
      this.pending = null;
      this.setState(engineStateFor(result.status));
    }
    p.resolve(result);
  }

  private handleMessage(p: PendingRun, raw: unknown): void {
    // A message from a superseded/settled run: ignore (stale rejection).
    if (p.settled || this.pending !== p) return;

    const v = validateOutbound(raw);
    if (!v.ok) {
      // Drop malformed/oversized/mismatched messages; never settle on them.
      return;
    }
    const msg: OutboundMessage = v.value;
    // Stale-run rejection: the message must belong to THIS run.
    if (msg.runId !== p.runId) return;

    switch (msg.kind) {
      case "ready": {
        this.events.onReady?.();
        // Still initializing until exec-start arrives.
        return;
      }
      case "exec-start": {
        if (p.execStarted) return;
        p.execStarted = true;
        if (p.initTimer) {
          clearTimeout(p.initTimer);
          p.initTimer = null;
        }
        this.setState("running");
        // Arm the execution timeout now (NOT during init).
        p.execTimer = setTimeout(() => {
          this.settle(p, {
            runId: p.runId,
            status: "timeout",
            events: p.streamed,
            stdout: p.stdoutChunks.join(""),
            stderr: p.stderrChunks.join(""),
            incomplete: true,
            limitHit: "time",
          });
        }, DEFAULT_LIMITS.timeMs);
        return;
      }
      case "trace-batch": {
        for (const e of msg.payload.events) p.streamed.push(e);
        return;
      }
      case "output": {
        if (msg.payload.stream === "stdout") p.stdoutChunks.push(msg.payload.text);
        else p.stderrChunks.push(msg.payload.text);
        return;
      }
      case "result": {
        const pay = msg.payload;
        // Final message carries only the TAIL not already streamed.
        const events = p.streamed.concat(pay.tail);
        const stdout = pay.stdout || p.stdoutChunks.join("");
        const stderr = pay.stderr || p.stderrChunks.join("");
        this.settle(p, {
          runId: p.runId,
          status: pay.status,
          events,
          stdout,
          stderr,
          incomplete: pay.incomplete || undefined,
          limitHit: pay.limitHit,
          error: pay.error,
          exitCode: pay.exitCode,
        });
        return;
      }
      case "error": {
        this.settle(p, {
          runId: p.runId,
          status: "error",
          events: p.streamed,
          stdout: p.stdoutChunks.join(""),
          stderr: msg.payload.message,
          error: { type: "EngineError", message: msg.payload.message },
        });
        return;
      }
    }
  }
}

/** Map a terminal RunStatus to the engine's terminal EngineState. */
function engineStateFor(status: RunStatus): EngineState {
  switch (status) {
    case "completed":
      return "completed";
    case "exited":
      return "exited";
    case "stopped":
      return "stopped";
    case "timeout":
      return "timeout";
    case "event-limit":
      return "event-limit";
    case "trace-limit":
      return "trace-limit";
    case "error":
    default:
      return "error";
  }
}

// ---------------------------------------------------------------------------
// Shared singleton coordinator (R2-A): one engine per app window.
// ---------------------------------------------------------------------------

let shared: ExecutionEngine | null = null;

/**
 * The process-lifetime shared coordinator. Every view uses this instead of
 * constructing its own engine, so opening any view creates no worker and, at
 * most, reuses one coordinator. Do NOT dispose it on component unmount.
 */
export function getSharedEngine(): ExecutionEngine {
  if (!shared) shared = new ExecutionEngine();
  return shared;
}

/** Test hook: reset the shared singleton. */
export function __resetSharedEngineForTests(): void {
  shared?.dispose();
  shared = null;
}
