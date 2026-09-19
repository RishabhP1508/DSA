/**
 * Main-thread execution engine client.
 *
 * Owns the run worker, assigns monotonic run ids, and enforces the wall-clock
 * timeout by terminating the worker (a hard stop for infinite loops). A fresh
 * worker is spun up after any hard stop so the next run starts clean.
 *
 * Guarantees required by the plan:
 *   - Infinite loops can be stopped and cancelled runs cannot overwrite newer
 *     results (stale runIds are rejected on both sides).
 *   - Recorded states are replayed by the UI without rerunning the program.
 */

import type { RunRequest, RunResult, RunLimits } from "../core/types";
import type { OutMessage } from "./run.worker";

const DEFAULT_LIMITS: RunLimits = {
  timeMs: 10_000,
  maxEvents: 10_000,
  maxTraceBytes: 16 * 1024 * 1024,
};

export type EngineEvents = {
  onReady?: () => void;
};

export class ExecutionEngine {
  private worker: Worker | null = null;
  private nextRunId = 1;
  private pending: {
    runId: number;
    resolve: (r: RunResult) => void;
    timer: ReturnType<typeof setTimeout>;
    limits: RunLimits;
  } | null = null;
  private ready = false;
  private readyWaiters: (() => void)[] = [];

  private events: EngineEvents;

  constructor(events: EngineEvents = {}) {
    this.events = events;
    this.spawnWorker();
  }

  private spawnWorker(): void {
    this.worker?.terminate();
    this.worker = new Worker(new URL("./run.worker.ts", import.meta.url), {
      type: "module",
    });
    this.ready = false;
    this.worker.onmessage = (ev: MessageEvent<OutMessage>) =>
      this.handleMessage(ev.data);
  }

  private handleMessage(msg: OutMessage): void {
    if (msg.type === "ready") {
      this.ready = true;
      this.readyWaiters.splice(0).forEach((w) => w());
      this.events.onReady?.();
      return;
    }
    if (!this.pending) return;

    if (msg.type === "result") {
      // Reject stale results that arrive after a newer run began.
      if (msg.result.runId !== this.pending.runId) return;
      clearTimeout(this.pending.timer);
      const resolve = this.pending.resolve;
      this.pending = null;
      resolve(msg.result);
    } else if (msg.type === "error") {
      if (msg.runId !== this.pending.runId) return;
      clearTimeout(this.pending.timer);
      const { resolve, runId } = this.pending;
      this.pending = null;
      resolve({
        runId,
        status: "error",
        events: [],
        stdout: "",
        stderr: msg.message,
        error: { type: "EngineError", message: msg.message },
      });
    }
  }

  /** Resolve once the worker's runtime has finished warming up. */
  whenReady(): Promise<void> {
    if (this.ready) return Promise.resolve();
    return new Promise((res) => this.readyWaiters.push(res));
  }

  /**
   * Execute a program and resolve with its recorded result. If a previous run
   * is still pending it is superseded (its result will be discarded).
   */
  run(source: string, opts?: { stdin?: string; limits?: Partial<RunLimits> }): Promise<RunResult> {
    const limits: RunLimits = { ...DEFAULT_LIMITS, ...(opts?.limits ?? {}) };
    const runId = this.nextRunId++;

    // Supersede any in-flight run.
    if (this.pending) {
      clearTimeout(this.pending.timer);
      const stale = this.pending;
      this.pending = null;
      stale.resolve({
        runId: stale.runId,
        status: "stopped",
        events: [],
        stdout: "",
        stderr: "",
      });
    }

    const request: RunRequest = { runId, source, stdin: opts?.stdin, limits };

    return new Promise<RunResult>((resolve) => {
      const timer = setTimeout(() => {
        // Hard stop: terminate the worker (kills infinite loops) and report.
        if (this.pending && this.pending.runId === runId) {
          this.pending = null;
          this.spawnWorker();
          resolve({
            runId,
            status: "timeout",
            events: [],
            stdout: "",
            stderr: `Execution exceeded ${limits.timeMs} ms and was stopped.`,
          });
        }
      }, limits.timeMs);

      this.pending = { runId, resolve, timer, limits };
      this.worker!.postMessage({ type: "run", request });
    });
  }

  /** Stop the current run immediately (used by the Stop control). */
  stop(): void {
    if (!this.pending) return;
    const { resolve, runId, timer } = this.pending;
    clearTimeout(timer);
    this.pending = null;
    this.spawnWorker();
    resolve({ runId, status: "stopped", events: [], stdout: "", stderr: "" });
  }

  dispose(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
