# R2 — Worker lifecycle, streaming, limits, isolation-ready (Bugfix)

**Depends on:** R1 (merged into `main` @ `7b8a90e`; confirmed by git graph).
**Type:** Bugfix (reproduced defects) + a small amount of new protocol/config
plumbing needed to make the fixes testable.
**Runtime:** bundled Pyodide = CPython 3.14.2. Module workers (Pyodide requires them).
**R2.5 decision:** **Option B** — implement and test everything that does not need
the packaged Windows two-origin server now; leave a release-blocking pending gate
`P-RUNNER-ORIGIN` for the real second-origin topology.

## Defects (reproduced in R0 `findings.md`)

| ID | Defect | Reproduction / evidence |
|---|---|---|
| R2-A | Eager per-exercise Python workers | `ExercisePanel` → `useExerciseRunner` → `new ExecutionEngine` per panel; `run.worker.ts` warms Pyodide at module load (`void loadPyodideRuntime()` at file bottom). `Practice` renders one panel per matching exercise → many Pyodide workers spun up just by opening the view. |
| R2-B | Runs inherit imported-module mutations | The worker keeps `dsa_tracer` in `sys.modules` and reuses one Pyodide across runs; a learner `import`ing and mutating a module (e.g. `sys.setrecursionlimit`, monkeypatching, module-level globals) leaks into the next run because the worker/runtime is reused. |
| R2-C | Fake byte limit | `tracer.py` `_rough_size` counts approximate object *shapes* (frames×24 + locals×16 …), not the actual encoded JSON bytes. The 16 MiB budget is not truly enforced; the ~40 MB trace blow-up the audit reproduced is not prevented by a real measurement. |
| R2-E | Limit uses a catchable Python exception | `class _StopTracing(Exception)`. Learner code with `except BaseException:` (or `except:`) can swallow it, so the limit does not reliably stop the program. |

Related shortfalls folded into this spec (from the plan §R2.1–R2.5):

- No explicit lifecycle state machine; no separate init vs exec timeout.
- No versioned streaming protocol; the worker returns the whole trace in one
  message (no batching, no per-event output, no sequence/revision metadata).
- No message validation, origin/`event.source` checks, stale/oversized rejection,
  CSP, or a configuration boundary for a separate runner origin.

## Expected behavior (testable requirements)

- **R2-REQ-1 (R2-A).** WHEN a lesson, Pattern, Playground, or Practice view is
  opened, THE SYSTEM SHALL NOT create a Python worker per exercise and SHALL NOT
  warm a Pyodide runtime until an execution is explicitly requested. All views
  share ONE execution coordinator; at most one Python job runs at a time per app
  window.
- **R2-REQ-2 (R2-A).** WHEN a run completes, is cancelled, fails, or times out,
  THE SYSTEM SHALL terminate that run's worker; a subsequent run SHALL use a
  fresh worker.
- **R2-REQ-3 (R2-B).** WHEN a program runs, THE SYSTEM SHALL start from fresh
  runtime state so it cannot inherit imported-module mutations from an earlier
  run.
- **R2-REQ-4 (R2-C).** WHEN recording a trace, THE SYSTEM SHALL measure the
  actual encoded byte size (strings, keys, output, and event metadata) and
  enforce 10 s exec / 10,000 events / 16 MiB. On reaching a limit it SHALL keep
  the last valid recorded states, report which limit was hit, mark the data
  incomplete, and SHALL NOT present a partial state as complete.
- **R2-REQ-5 (R2-E).** WHEN a resource limit is reached, THE SYSTEM SHALL
  guarantee the run stops even if learner code catches the internal control
  signal — the coordinator SHALL terminate the worker after a limit
  notification (a Python control exception alone is insufficient).
- **R2-REQ-6 (lifecycle).** THE SYSTEM SHALL expose states
  `idle | initializing | running | completed | error | stopped | timeout |
  event-limit | trace-limit` (plus `exited` from R1), use a 30 s initialization
  timeout SEPARATE from the 10 s execution timeout (exec timer starts
  immediately before learner code runs), allow Stop during BOTH init and run,
  cancel the previous request when a new one starts, settle every pending request
  exactly once, cancel owned work on disposal, and ensure an old result can never
  update a newer editor/exercise (stale-result rejection).
- **R2-REQ-7 (streaming).** THE SYSTEM SHALL use a versioned message protocol
  carrying protocol version, runId, owner id, source revision/hash, input
  revision/hash, a monotonic sequence number, message kind, and a validated
  payload. Trace events SHALL be flushed in bounded batches (≤64 events / ~64 KiB
  / ~50 ms); output SHALL flush promptly; the final message SHALL NOT resend the
  whole trace already delivered.
- **R2-REQ-8 (isolation-ready, Option B).** THE SYSTEM SHALL validate every
  inbound message against strict schemas; reject stale runIds, malformed
  payloads, invalid sequence numbers, and oversized messages; validate origin and
  `event.source` at the bridge boundary; set CSP for the bridge document and the
  worker script; forbid native filesystem / subprocess / network access from
  learner Python; and read the runner origin from a deployment-supplied
  configuration boundary (so packaging flips to a real second origin via config,
  not a rewrite). R2 SHALL leave `P-RUNNER-ORIGIN` as an explicit, release-
  blocking pending gate and SHALL NOT claim "runner isolation complete."

## Preservation requirements (must NOT break)

- All **130 lesson** and **29 pattern** stdout values stay byte-identical; no
  `expectedOutput` is edited (the R2 changes are lifecycle/limits/protocol, not
  program semantics). Verified by `verify:lessons` / `verify:patterns`.
- R1 guarantees stay intact: inspection never executes learner code;
  self-contained snapshots; `input()`/EOF semantics; guaranteed cleanup; the
  `exited` status.
- Non-finite float string encoding stays. Opaque type-label handling stays.
- Legitimate small programs still produce complete traces well under the limits.

## Acceptance (from the plan §R2)

Opening all 381 exercises creates no eager Python workers; a run cannot inherit
imported-module mutations; infinite loops can be stopped; a hanging run can be
superseded; partial output survives cancel/timeout; delayed messages from earlier
runs are ignored; missing runtime assets give a recoverable error; the ~40 MB
trace blow-up is prevented (real byte limit); browser + unit tests prove message
validation and lifecycle; `P-RUNNER-ORIGIN` remains a pending release-blocking
gate; the full R0+R1 suite still passes.
