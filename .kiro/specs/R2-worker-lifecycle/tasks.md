# R2 — Tasks

Each task: requirement → defect/missing behavior → code → verification → evidence
to complete. Bugs are test-first (failing test committed before the fix).

## T1 — Failing tests first (test-first gate)
- **Requirement:** R2-REQ-1..8. **Missing:** no R2 regression tests.
- **Code:** add
  - `src/engine/protocol.test.ts` (validators: version/runId/owner/seq/size,
    reject stale/oversized/malformed; hash32 stable).
  - `src/engine/tracer.limits.test.ts` (`@vitest-environment node`, via harness):
    real byte limit stops with `trace-limit` + `incomplete`, keeps last valid
    states; event limit still `event-limit`; a learner `except BaseException`
    around a huge loop still stops (event/byte guard); small program unaffected.
  - `src/engine/engine.lifecycle.test.ts` (mock Worker): idle→initializing→
    running→terminal; init timeout (30s) separate from exec (10s); stop during
    init and run; supersede; single-settle; stale-result rejection; terminate on
    settle; missing-asset → recoverable error.
  - `src/ui/practice.no-eager-worker.test.tsx` (RTL + Worker spy): rendering
    Practice/ExercisePanels constructs NO Worker and warms NO Pyodide until Run.
  - `e2e/runner-origin.pending.spec.ts` (Playwright, `test.fixme`/skip):
    documents P-RUNNER-ORIGIN packaging checks.
- **Verify:** the new unit/python tests FAIL on current code (except the pending
  e2e which is intentionally skipped). Record the failures.
- **Evidence:** failing run output pasted into `verification.md`.

## T2 — Protocol + validators (R2-REQ-7, R2-REQ-8)
- **Code:** `src/engine/protocol.ts` — `PROTOCOL_VERSION`, `Inbound`/`Outbound`
  envelope types, `validateInbound`/`validateOutbound`, `hash32`, `MAX_MESSAGE_BYTES`,
  batch thresholds (`MAX_BATCH_EVENTS=64`, `MAX_BATCH_BYTES=64*1024`,
  `FLUSH_INTERVAL_MS=50`). Hand-written (see design "Validator choice").
- **Verify:** `protocol.test.ts` passes.

## T3 — Runner config boundary + CSP (R2-REQ-8, P-RUNNER-ORIGIN)
- **Code:** `src/engine/runner-config.ts` (`getRunnerConfig`, default same-origin,
  cross-origin ports 5173/5174). CSP `<meta>` in `index.html`. Keep the pending
  e2e as the recorded gate.
- **Verify:** build + lint; pending e2e present and skipped with a clear reason.

## T4 — Real resource limits + stop hardening (R2-REQ-4, R2-REQ-5) [tracer.py]
- **Code:** `_encoded_size` (UTF-8 JSON bytes) replacing `_rough_size`; running
  byte total; refuse the event that would exceed 16 MiB, keep prior events, set
  `trace-limit` + `incomplete`; per-object entry cap; harden the internal stop
  signal so a learner `except` cannot let it run unbounded within the trace
  callback; `run_program` returns `incomplete`/`limitHit`.
- **Verify:** `tracer.limits.test.ts` passes; `verify:lessons`/`verify:patterns`
  UNCHANGED (no output/expectedOutput change).

## T5 — Coordinator: shared engine, lazy fresh worker, lifecycle (R2-REQ-1,2,3,6)
- **Code:** `engine.ts` — `getSharedEngine()` singleton; remove constructor
  `spawnWorker`; per-run fresh worker; `EngineState` machine; 30s init timeout +
  10s exec timeout (armed on `exec-start`); stop in init/run; supersede;
  single-settle; terminate on settle; stale rejection; assemble RunResult from
  streamed batches + tail.
- **Verify:** `engine.lifecycle.test.ts` passes.

## T6 — Worker: no eager warm, fresh runtime per run, streaming (R2-REQ-1,2,3,7)
- **Code:** `run.worker.ts` — delete bottom eager warm; create fresh globals per
  run; emit `ready`/`exec-start`/`trace-batch`/`output`/`result`/`error` protocol
  envelopes; batch flushes; validate inbound; final `result` sends tail only.
  (Fresh worker per run from the engine gives fresh Pyodide → R2-B.)
- **Verify:** `test:browser` still boots; new browser lifecycle assertions pass.

## T7 — UI hooks use the shared engine (R2-REQ-1)
- **Code:** `useEngine.ts` + `useExerciseRunner.ts` use `getSharedEngine()`; do
  NOT dispose on unmount; expose engine `state`; pass `owner` through.
- **Verify:** `practice.no-eager-worker.test.tsx` passes; existing unit tests
  (VariablesPanel, coverage, md) still pass.

## T8 — Types (R2-REQ-4,6,7)
- **Code:** `types.ts` — `RunResult.incomplete?`, `RunResult.limitHit?`;
  `RunRequest.owner?/sourceRev?/inputRev?`; export `EngineState`.
- **Verify:** `npm run build` (tsc) passes.

## T9 — Full verification + docs (all)
- **Code:** none (verification). **Verify:** `npm run check:all` + `test:browser`
  green; R2 acceptance items demonstrated; `P-RUNNER-ORIGIN` pending. Clean
  `__pycache__`. Write `verification.md` (what was and was NOT proven, tested
  commit, remaining failures incl. the pending gate).

## T10 — PR
- One PR `repair/r2-worker-lifecycle → main` with the required body sections.
  Do not start R3 until merged.
