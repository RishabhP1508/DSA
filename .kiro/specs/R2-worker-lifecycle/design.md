# R2 — Design

## Root causes (from R0 findings + R2 file read)

1. **R2-A eager workers.** Two hooks (`useEngine`, `useExerciseRunner`) each do
   `new ExecutionEngine()` in a `useEffect`; `ExecutionEngine`'s constructor
   immediately `spawnWorker()`s, and `run.worker.ts` ends with
   `void loadPyodideRuntime().then(() => post({ ready }))`, warming Pyodide the
   moment the worker module loads. `Practice` renders one `ExercisePanel` per
   matching exercise, so opening it constructs many engines → many workers →
   many eager Pyodide warms.
2. **R2-B module leakage.** The worker memoizes one Pyodide (`pyodideReady`) and
   installs `dsa_tracer` once; consecutive runs reuse the same interpreter, so
   any mutation a learner makes to an imported module (or to `sys`) persists into
   the next run.
3. **R2-C fake bytes.** `_rough_size` approximates object shapes; it never
   measures the encoded JSON, so 16 MiB is not enforced against real payload size.
4. **R2-E catchable stop.** `_StopTracing(Exception)` can be caught by learner
   `except BaseException`, so the limit does not guarantee a stop.

## Architecture

### One shared coordinator (R2-A, R2-2)

Introduce a module-level **singleton** `ExecutionEngine` accessed via
`getSharedEngine()` (in `src/engine/engine.ts`). `useEngine` and
`useExerciseRunner` both use the shared instance instead of constructing their
own, and they do NOT dispose it on unmount (it is process-lifetime, one per app
window). This collapses N engines → 1, so opening any view creates at most one
engine and — crucially — **no worker at all until the first run**.

Lazy worker creation: the constructor no longer spawns a worker. A worker is
created on demand at the start of `run()` (and torn down when the run settles).
The engine tracks `state: EngineState` and notifies subscribers so the UI can
show `idle/initializing/running/...`.

Because only one Python job runs at a time and the coordinator owns run ids,
concurrent `run()` calls from different views supersede each other cleanly
(the previous pending run settles once, as `stopped`).

### Fresh worker + runtime per run (R2-A, R2-B, R2-2)

Each `run()`:
1. Terminates any existing worker (hard cancel of prior work).
2. Creates a fresh module worker.
3. Waits for `initializing → ready` under a **30 s init timeout**.
4. Sends the `run` request; starts the **10 s exec timeout** when the worker
   acknowledges execution start (`exec-start` message), not before — init time is
   not counted against exec time.
5. On settle (result/error/stop/timeout/limit) terminates the worker.

A fresh worker means a fresh Pyodide + fresh `sys.modules`, which is the simplest
correct fix for R2-B: no run can inherit another run's imported-module mutations.
(Runtime *assets* may still be reused via browser HTTP cache; executed Python
state is not.)

> Trade-off noted: a fresh Pyodide per run pays the runtime init cost each run.
> That is acceptable and correct for the milestone (isolation > latency), and the
> plan explicitly requires a fresh module worker per run. A future optimization
> (a pooled-but-reset runtime) is out of scope and would need to prove
> equivalent isolation.

### Real resource limits (R2-C) + guaranteed stop (R2-E)

In `tracer.py`, replace `_rough_size` with **`_encoded_size`**, which measures the
actual UTF-8 JSON byte cost of each event incrementally:
- Serialize each finished event with `json.dumps(event)` and count
  `len(s.encode("utf-8"))`. This counts strings, dict keys, output text, and all
  event metadata exactly as they will cross to JS.
- Maintain a running total; when adding the next event would exceed
  `limit_bytes`, do NOT append it, set `stopped_reason = "trace-limit"`, and stop.
- Keep the already-recorded valid events (last valid states preserved) and mark
  the result incomplete via `status` = `trace-limit` and an `incomplete: true`
  flag on the result.
- Bounded serialization: cap the number of entries encoded for a single container
  (existing depth guard stays; add a per-object entry cap so inspecting one huge
  value cannot allocate an unbounded JSON payload before the byte check runs).

R2-E: the tracer still raises the internal stop signal, but the signal is renamed
and the coordinator no longer trusts it alone. The **coordinator terminates the
worker** after the run settles for any limit status. Additionally, to survive a
learner `except BaseException`, the exec timeout (10 s) plus the event-count guard
give a hard upper bound: if the learner swallows the signal and keeps looping, the
main-thread timeout terminates the worker regardless. We also make the internal
signal derive from `BaseException` and re-arm: after catching a swallowed stop,
the trace function returns `None` and re-raises on the next event, so a single
`except` cannot let it run unbounded within the trace callback.

### Lifecycle state machine (R2-6)

`EngineState = idle | initializing | running | completed | error | stopped |
timeout | event-limit | trace-limit | exited`. The engine is a small state
machine; `run()` transitions `idle → initializing → running → <terminal>`.
`stop()` works in `initializing` and `running` (terminates the worker, settles
the pending run as `stopped`). New `run()` supersedes the pending one. `dispose()`
cancels owned work. Every pending promise settles exactly once (guarded by
clearing `pending` before resolving). Stale results are rejected by comparing
`runId` on every inbound message.

### Versioned streaming protocol (R2-7)

Define the protocol in a new `src/engine/protocol.ts` shared by the worker and the
engine:

```
PROTOCOL_VERSION = 1
Envelope (worker → main): { v, runId, owner, sourceRev, inputRev, seq, kind, payload }
kinds: "ready" | "exec-start" | "trace-batch" | "output" | "result" | "error"
Envelope (main → worker): { v, runId, owner, sourceRev, inputRev, seq, kind, payload }
kinds: "run" | "stop"
```

- `owner` = the workspace/exercise id that requested the run (e.g.
  `lesson:dijkstra` or `exercise:lesson:...:ll-complete-1`).
- `sourceRev` / `inputRev` = a cheap 32-bit hash of the source / stdin, so a
  result can be matched to the exact source that produced it (used by R4 for
  source-edit invalidation; R2 wires it through and validates it).
- `seq` = monotonic per-run sequence number; out-of-order or stale seq is
  rejected.
- **Batched trace flushes:** the worker buffers trace events and flushes at
  ≤64 events, ~64 KiB, or ~50 ms, whichever first. Output flushes promptly.
- **Final message** (`result`) carries status + counts + the *tail* not already
  streamed, NOT the entire trace again. The engine assembles the full
  `RunResult` from the streamed batches plus the final tail.

### Message validation (R2-8, Option B)

`protocol.ts` exports **hand-written validators** (`validateInbound`,
`validateOutbound`) that check version, run id, owner, revisions, seq monotonicity,
kind, and payload shape, and enforce a max message size. See "Validator choice".

At the bridge boundary (see below) the engine also validates
`event.origin === RUNNER_ORIGIN` and `event.source === <the bridge window/worker>`
and rejects anything else. Same-origin worker messages (the default dev topology)
are validated by schema + runId + seq; the origin check is active on the
cross-origin bridge path.

### Runner isolation config boundary (R2-8, Option B; P-RUNNER-ORIGIN)

Add `src/engine/runner-config.ts` exporting `getRunnerConfig()`:
```
{ mode: "same-origin" | "cross-origin",
  appOrigin: string, runnerOrigin: string,
  bridgePath: string }
```
Defaults (dev/verification): `appOrigin=http://127.0.0.1:5173`,
`runnerOrigin=http://127.0.0.1:5174`, `mode` defaults to `same-origin` because
the second origin is only served by the packaged Windows server (later milestone).
Packaging flips `mode` to `cross-origin` via config — no code rewrite.

CSP: add a strict `Content-Security-Policy` `<meta>` to `index.html` for the app
document and document the worker/bridge CSP headers the packaged server must send
(the dev/preview server cannot set per-worker headers; this is part of the pending
gate). Learner Python has no filesystem/subprocess/network: Pyodide's sandbox plus
not exposing `js`/`pyodide.http`/native FS to the program (we exec in a plain
globals dict with only `builtins`) already prevents this; we add a test asserting
`open()`/`socket`/`subprocess`-style access fails.

**`P-RUNNER-ORIGIN`** — recorded as a release-blocking gate in this spec and as a
skipped/pending Playwright test `e2e/runner-origin.pending.spec.ts` that documents
exactly what packaging must prove (app origin ≠ runner origin; bridge loads from
runner origin; CSP served; Chrome+Edge execute/stop/supersede through the bridge;
non-loopback blocked). It fails/pends until packaging, so it cannot be forgotten.

## Validator choice: hand-written (not Zod) for R2

Zod is NOT yet a dependency (R3 planned to introduce it). For R2 we hand-write
small validators because:
- The R2 payload set is small and closed (6 outbound kinds, 2 inbound), and the
  trace-event shape is already defined in `types.ts`.
- The validators run inside the Worker under a strict CSP; minimizing
  third-party code on the isolation boundary is a security positive.
- The milestone rule says not to combine unrelated dependency changes with
  correctness work; adding a runtime dep here would do exactly that.
Recorded so R3 can consciously standardize on Zod later (backup validation) and,
if desired, migrate these validators. Interfaces are written so a later swap is
mechanical.

## Data flow (per run)

```
UI (view) → getSharedEngine().run(source, {stdin, owner, limits})
  → engine: state=initializing; new Worker; init-timeout(30s)
  → worker: load Pyodide (fresh); post {ready}
  → engine: post {run, runId, owner, sourceRev, inputRev, seq}; state=running; exec-timeout(10s) armed on {exec-start}
  → worker: fresh globals; install tracer; run_program with real byte accounting; stream {trace-batch}/{output}; post {result | error} (tail only)
  → engine: validate every msg (version/runId/owner/seq/size); assemble RunResult; clear pending; resolve once; terminate worker; state=<terminal>
  (stop/timeout/supersede/limit → terminate worker, settle once)
```

## Failure handling

- Missing runtime assets (Pyodide fails to load) → worker posts `error`
  (kind=`error`, payload has a recoverable message) OR init-timeout fires →
  engine resolves status `error` with an actionable message; app stays usable.
- Learner catches the stop signal / infinite loop → exec-timeout terminates the
  worker; status `timeout`, partial streamed output preserved.
- Oversized/stale/malformed message → dropped by the validator; never resolves a
  newer run; logged for diagnostics.

## Files touched

- `src/engine/protocol.ts` (new) — protocol version, envelope types, hand-written
  validators, `hash32`, size cap, batch thresholds.
- `src/engine/runner-config.ts` (new) — origin/config boundary.
- `src/engine/engine.ts` — coordinator: singleton, lazy fresh worker per run,
  state machine, init/exec timeouts, streaming assembly, validation, terminate on
  settle, single-settle, stale rejection.
- `src/engine/run.worker.ts` — remove eager warm; fresh globals per run; stream
  batches; emit protocol envelopes; `exec-start`; validate inbound.
- `src/engine/tracer.py` — `_encoded_size` real byte accounting; entry cap;
  `incomplete` flag; keep last valid states; stop signal hardening.
- `src/core/types.ts` — `RunResult.incomplete?`, `RunResult.limitHit?`;
  `RunRequest.owner?/sourceRev?/inputRev?`; export `EngineState`.
- `src/ui/useEngine.ts`, `src/ui/useExerciseRunner.ts` — use shared engine; expose
  state; do not dispose the shared engine on unmount.
- `index.html` — CSP meta for the app document.
- Tests (test-first): `src/engine/engine.lifecycle.test.ts`,
  `src/engine/protocol.test.ts`, `src/engine/tracer.limits.test.ts`,
  `src/ui/practice.no-eager-worker.test.tsx`, `e2e/runner-origin.pending.spec.ts`.
