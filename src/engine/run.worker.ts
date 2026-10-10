/// <reference lib="webworker" />
/**
 * Execution worker for DSA Visual Lab (R2).
 *
 * Lifecycle: the coordinator creates a FRESH module worker per run and
 * terminates it on settle. This worker therefore handles exactly ONE run and
 * starts from a clean Pyodide + clean `sys.modules`, so a run can never inherit
 * imported-module mutations from an earlier run (R2-B).
 *
 * It does NOT warm Pyodide at module load (that eager warm was the R2-A defect).
 * The runtime loads only when a validated `run` message arrives.
 *
 * It speaks the versioned protocol (protocol.ts): it validates the inbound
 * message, emits `ready` → `exec-start` → batched `trace-batch`/`output` →
 * a final `result` whose `tail` is only the events not already streamed.
 */

import {
  PROTOCOL_VERSION,
  validateInbound,
  type OutboundMessage,
  type OutboundKind,
  type EnvelopeMeta,
} from "./protocol";
import type { RunStatus, TraceEvent, ComplexityAnalysisResult } from "../core/types";
// Vite `?raw` import inlines the tracer source so it ships offline.
import tracerSource from "./tracer.py?raw";
// R7.3/7.5 — conservative AST complexity analyzer, run in the same worker.
import analyzerSource from "./complexity_analyzer.py?raw";
import { TraceStream } from './trace-stream';

type PyodideInterface = {
  runPython: (code: string) => unknown;
  globals: { set: (k: string, v: unknown) => void; get: (k: string) => unknown };
  toPy: (obj: unknown) => unknown;
};

/** Raw Python result shape returned by tracer.run_program. */
interface RawResult {
  status: RunStatus;
  events: TraceEvent[];
  stdout: string;
  stderr: string;
  error?: { type: string; message: string; line?: number };
  exitCode?: number | string | null;
  incomplete?: boolean;
  limitHit?: "time" | "events" | "bytes";
  analysis?: ComplexityAnalysisResult;
}

let seq = 0;
let meta: Omit<EnvelopeMeta, "seq"> | null = null;

function post<K extends OutboundKind>(kind: K, payload: unknown): void {
  if (!meta) return;
  const msg = { ...meta, seq: seq++, kind, payload } as OutboundMessage;
  (self as unknown as Worker).postMessage(msg);
}

async function loadPyodideRuntime(): Promise<PyodideInterface> {
  // Built at runtime so the bundler leaves it alone; served locally from
  // /public/pyodide (offline).
  const specifier = "/pyodide/" + "pyodide.mjs";
  const mod = (await import(/* @vite-ignore */ specifier)) as {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
  };
  return mod.loadPyodide({ indexURL: "/pyodide/" });
}

async function handleRun(
  m: Extract<ReturnType<typeof validateInbound>, { ok: true }>["value"] & { kind: "run" },
): Promise<void> {
  const { payload } = m;

  let pyodide: PyodideInterface;
  try {
    pyodide = await loadPyodideRuntime();
  } catch (e) {
    post("error", { message: `Failed to load runtime: ${String(e)}`, recoverable: true });
    return;
  }

  // Signal readiness (runtime warmed) — the coordinator is still in
  // "initializing" until exec-start.
  post("ready", {});

  try {
    // Install the tracer into a FRESH module (this worker is single-use, so
    // there is no prior state to inherit — R2-B).
    pyodide.globals.set("__tracer_source__", tracerSource);
    pyodide.globals.set("__analyzer_source__", analyzerSource);
    pyodide.runPython(`
import sys, types
_m = types.ModuleType("dsa_tracer")
exec(__tracer_source__, _m.__dict__)
sys.modules["dsa_tracer"] = _m
_a = types.ModuleType("dsa_cx")
exec(__analyzer_source__, _a.__dict__)
sys.modules["dsa_cx"] = _a
`);

    pyodide.globals.set("__run_source__", payload.source);
    pyodide.globals.set("__run_stdin__", payload.stdin);
    pyodide.globals.set("__limit_events__", payload.limits.maxEvents);
    pyodide.globals.set("__limit_bytes__", payload.limits.maxTraceBytes);
    const stream=new TraceStream(events=>post('trace-batch',{events}));
    pyodide.globals.set('__event_sink__',(json:string)=>stream.push(JSON.parse(json) as TraceEvent));
    pyodide.globals.set('__output_sink__',(stream:string,text:string)=>post('output',{stream,text}));

    // Learner code begins now: tell the coordinator to arm the exec timer.
    post("exec-start", {});

    const resultJson = pyodide.runPython(`
import json, sys
_tracer = sys.modules["dsa_tracer"]
_res = _tracer.run_program(
    __run_source__, "<lesson>", __limit_events__, __limit_bytes__, __run_stdin__,
    event_sink=__event_sink__, output_sink=__output_sink__
)
# R7.5 — attach a conservative static complexity analysis of the SAME source.
# Pure AST work; never executes the program and never raises out of here.
try:
    _res["analysis"] = sys.modules["dsa_cx"].analyze_complexity(__run_source__)
except Exception as _e:
    _res["analysis"] = {"source": "not-determined", "uncertaintyReason": "analyzer error: " + str(_e)}
json.dumps(_res)
`) as string;

    const raw = JSON.parse(resultJson) as RawResult;
    finish(raw,stream.finish());
  } catch (e) {
    post("error", { message: String(e), recoverable: true });
  }
}

/**
 * Stream the recorded events in bounded batches, then send a final `result`
 * whose `tail` contains ONLY the events not already streamed (the final message
 * must not resend the whole trace).
 */
function finish(raw: RawResult,tail:TraceEvent[]): void {
  post("result", {
    status: raw.status,
    tail,
    stdout: raw.stdout ?? "",
    stderr: raw.stderr ?? "",
    incomplete: Boolean(raw.incomplete),
    limitHit: raw.limitHit,
    error: raw.error,
    exitCode: raw.exitCode,
    analysis: raw.analysis,
  });
}

self.onmessage = (ev: MessageEvent) => {
  const v = validateInbound(ev.data);
  if (!v.ok) return; // drop malformed/oversized/mismatched inbound messages
  const msg = v.value;
  if (msg.kind !== 'run' || meta !== null) return;
  // Capture the envelope identity so our outbound messages echo it.
  meta = {
    v: PROTOCOL_VERSION,
    runId: msg.runId,
    owner: msg.owner,
    sourceRev: msg.sourceRev,
    inputRev: msg.inputRev,
  };
  if (msg.kind === "run") {
    void handleRun(msg);
  }
  // "stop" is handled by the coordinator terminating this worker; nothing to do.
};
