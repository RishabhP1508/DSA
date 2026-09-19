/// <reference lib="webworker" />
/**
 * Execution worker for DSA Visual Lab.
 *
 * Each run executes in this dedicated module worker. The worker:
 *   - lazily loads the locally-bundled Pyodide runtime (no network),
 *   - loads the Python tracer (tracer.py, imported as a raw string),
 *   - runs the requested program under sys.settrace,
 *   - posts back an immutable RunResult.
 *
 * Stale-run handling: the worker tracks the highest runId it has seen and
 * refuses to start or report a run whose id is older than the current one, so
 * a cancelled run can never overwrite a newer result (plan requirement).
 */

import type { RunRequest, RunResult, RunLimits, TraceEvent } from "../core/types";
// Vite `?raw` import inlines the tracer source so it ships offline.
import tracerSource from "./tracer.py?raw";

// The Pyodide type is loaded dynamically; keep it loose here.
type PyodideInterface = {
  runPython: (code: string) => unknown;
  globals: { set: (k: string, v: unknown) => void; get: (k: string) => unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pyimport: (name: string) => any;
  toPy: (obj: unknown) => unknown;
};

const DEFAULT_LIMITS: RunLimits = {
  timeMs: 10_000,
  maxEvents: 10_000,
  maxTraceBytes: 16 * 1024 * 1024,
};

let pyodideReady: Promise<PyodideInterface> | null = null;
let currentRunId = -1;

/** Messages the worker accepts. */
type InMessage =
  | { type: "run"; request: RunRequest }
  | { type: "stop"; runId: number };

/** Messages the worker emits. */
type OutMessage =
  | { type: "ready" }
  | { type: "result"; result: RunResult }
  | { type: "error"; runId: number; message: string };

async function loadPyodideRuntime(): Promise<PyodideInterface> {
  if (!pyodideReady) {
    pyodideReady = (async () => {
      // Import the bundled Pyodide loader served from /pyodide/. The specifier
      // is built at runtime so the bundler leaves it alone; the file is copied
      // into public/pyodide so it is served locally (offline).
      const specifier = "/pyodide/" + "pyodide.mjs";
      const mod = (await import(/* @vite-ignore */ specifier)) as {
        loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
      };
      const pyodide = await mod.loadPyodide({ indexURL: "/pyodide/" });
      return pyodide;
    })();
  }
  return pyodideReady;
}

async function handleRun(request: RunRequest): Promise<void> {
  const { runId } = request;
  // Reject stale runs: only advance forward.
  if (runId < currentRunId) return;
  currentRunId = runId;

  const limits: RunLimits = { ...DEFAULT_LIMITS, ...(request.limits ?? {}) };

  let pyodide: PyodideInterface;
  try {
    pyodide = await loadPyodideRuntime();
  } catch (e) {
    post({ type: "error", runId, message: `Failed to load runtime: ${String(e)}` });
    return;
  }

  // If a newer run started while the runtime was loading, abandon this one.
  if (runId !== currentRunId) return;

  try {
    // Install the tracer module once per worker.
    pyodide.globals.set("__tracer_source__", tracerSource);
    pyodide.runPython(`
import sys, types
if "dsa_tracer" not in sys.modules:
    _m = types.ModuleType("dsa_tracer")
    exec(__tracer_source__, _m.__dict__)
    sys.modules["dsa_tracer"] = _m
`);

    pyodide.globals.set("__run_source__", request.source);
    pyodide.globals.set("__run_stdin__", request.stdin ?? "");
    pyodide.globals.set("__limit_events__", limits.maxEvents);
    pyodide.globals.set("__limit_bytes__", limits.maxTraceBytes);

    const resultProxy = pyodide.runPython(`
import json, sys
_tracer = sys.modules["dsa_tracer"]
_res = _tracer.run_program(
    __run_source__, "<lesson>", __limit_events__, __limit_bytes__, __run_stdin__
)
json.dumps(_res)
`) as string;

    // A newer run may have superseded us during execution.
    if (runId !== currentRunId) return;

    const parsed = JSON.parse(resultProxy) as {
      status: RunResult["status"];
      events: TraceEvent[];
      stdout: string;
      stderr: string;
      error?: RunResult["error"];
    };

    post({
      type: "result",
      result: {
        runId,
        status: parsed.status,
        events: parsed.events,
        stdout: parsed.stdout,
        stderr: parsed.stderr,
        error: parsed.error,
      },
    });
  } catch (e) {
    if (runId !== currentRunId) return;
    post({ type: "error", runId, message: String(e) });
  }
}

function post(msg: OutMessage): void {
  (self as unknown as Worker).postMessage(msg);
}

self.onmessage = (ev: MessageEvent<InMessage>) => {
  const msg = ev.data;
  if (msg.type === "run") {
    void handleRun(msg.request);
  } else if (msg.type === "stop") {
    // Advancing the id invalidates the in-flight run's ability to report.
    // The main thread also terminates the worker for hard stops/timeouts.
    if (msg.runId >= currentRunId) currentRunId = msg.runId + 1;
  }
};

// Warm the runtime as soon as the worker is created.
void loadPyodideRuntime().then(() => post({ type: "ready" }));

export type { InMessage, OutMessage };
