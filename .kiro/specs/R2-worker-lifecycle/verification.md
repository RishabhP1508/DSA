# R2 — Verification

**Branch:** `repair/r2-worker-lifecycle` (off `main` @ `2dbde5b`, post-R1 + docs #12).
**Runtime:** bundled Pyodide = CPython 3.14.2. Node v22.

> This file is filled in as tasks complete. It states exactly what was and was
> NOT proven, the tested commit, and remaining failures (including the
> release-blocking `P-RUNNER-ORIGIN` gate).

## Baseline re-confirmed before any change (on `main` @ `2dbde5b`)

| Check | Result |
|---|---|
| `npm run build` | ✅ pass |
| `npm run lint` | ✅ 0 errors / 9 pre-existing warnings |
| `npm run test:unit` | ✅ 31/31 (4 files) |
| `npm run test:python` (pipeline + visualizers) | ✅ OK |
| `verify:lessons` | ✅ 130 OK |
| `verify:patterns` | ✅ 29 OK |
| `verify:complexity` | ✅ 130 panels |
| `verify:exercises` | ✅ 3 runnable OK |
| `npm run test:browser` (Playwright/Chromium) | ✅ 2/2 e2e |

## Test-first evidence (T1 — recorded BEFORE the fix, on current code)

New R2 tests were written and run against the unchanged engine/worker/tracer:

- `src/engine/protocol.test.ts` — **14/14 PASS** (new module; correct by
  construction — validators reject stale/mismatched/oversized/malformed and
  accept well-formed; `hash32` stable and 32-bit).
- `src/engine/engine.lifecycle.test.ts` — **FAIL** (all cases): current
  `ExecutionEngine` spawns a real `Worker` in its constructor and has no
  injectable `workerFactory`, no `state`/`onStateChange`, no separate init/exec
  timeouts. Error: `ReferenceError: Worker is not defined` at
  `engine.ts:48 spawnWorker`. Confirms the coordinator/state-machine don't exist.
- `src/ui/practice.no-eager-worker.test.tsx` — **FAIL**: mounting ONE exercise
  runner created **1** Worker; mounting **40** (Practice-like) created **40**
  Workers (`expected 40 to be +0`). This is R2-A reproduced as a test.
- `src/engine/tracer.limits.test.ts` — **FAIL** against current `tracer.py`.
  Direct harness probe on the unchanged tracer showed:
  - event-limit run → `status: "event-limit"` but **no `incomplete` field and
    no `limitHit` field** (the test requires `incomplete === true`).
  - a 150-iteration string-growing loop under a **128 KiB** byte budget →
    `status: "completed"` with 304 events (the fake `_rough_size` under-counts
    real encoded bytes, so the byte budget is NOT enforced — this is the R2-C
    ~40 MB blow-up). The test requires `status: "trace-limit"`.

`e2e/runner-origin.pending.spec.ts` is intentionally `test.fixme` (the
release-blocking P-RUNNER-ORIGIN gate). `e2e/runner-lifecycle.spec.ts` targets
the real browser worker path (run/stop) and is validated at T9.

## Results after the fix (tested commit: `6756a75`, PR #13 → `main`)

| Check | Result |
|---|---|
| `npm run build` (tsc -b + vite) | ✅ pass (worker built as separate chunk) |
| `npm run lint` | ✅ 0 errors / **9** warnings (same as baseline; 2 new-code warnings were cleaned) |
| `npm run test:unit` (all vitest) | ✅ **61/61** (8 files) |
| `npm run test:python` (pipeline + visualizers) | ✅ OK |
| `verify:lessons` | ✅ ALL 130 LESSON OUTPUTS OK — **unchanged** |
| `verify:patterns` | ✅ ALL 29 PATTERN WALKTHROUGHS OK — **unchanged** |
| `verify:complexity` | ✅ 130 panels OK |
| `verify:exercises` | ✅ 3 runnable OK |
| `npm run check:all` | ✅ green (RC 0) |
| `npm run test:browser` (Playwright/Chromium) | ✅ **5 passed / 5 skipped** |

New R2 test breakdown (all passing after the fix):
- `protocol.test.ts` — 14/14 (versioned envelope validation; stale/mismatch/
  oversized/malformed rejection; `hash32` stable & 32-bit).
- `engine.lifecycle.test.ts` — 9/9 (lazy worker; idle→initializing→running→
  terminal; 30 s init vs 10 s exec timeout; stop during init; supersede;
  single-settle; stale-result rejection; streaming assembly = batches + tail;
  terminate-on-settle; missing-asset → recoverable error).
- `tracer.limits.test.ts` — 5/5 (real byte budget → `trace-limit` + `incomplete`
  + `limitHit:"bytes"`, keeps last valid events; event-limit still enforced &
  marked; `except Exception` cannot swallow the stop; small programs unaffected).
- `practice.no-eager-worker.test.tsx` — 2/2 (mounting 1 and 40 exercise runners
  each creates **0** workers).
- `e2e/runner-lifecycle.spec.ts` — 3/3 real headless-Chromium: a run creates the
  worker on demand and produces real output ("14"); Stop terminates a
  `while True` loop and the app stays usable; **R2-B** — a `sys` attribute set in
  run 1 is absent in run 2 (assert passes → `completed`), proving no
  imported-module-mutation inheritance.
- `e2e/runner-origin.pending.spec.ts` — 5 `test.fixme` (P-RUNNER-ORIGIN gate),
  correctly reported as SKIPPED.

## Defects closed (with the test that prevents recurrence)

| ID | Defect | Test(s) | Result |
|---|---|---|---|
| R2-A | Eager per-exercise Python workers | `practice.no-eager-worker.test.tsx` (0 workers for 1 and 40 runners); `engine.lifecycle` "creates NO worker until the first run"; `runner-lifecycle` "worker created on demand" | ✅ |
| R2-B | Runs inherit imported-module mutations | `runner-lifecycle` "cannot inherit imported-module mutations" (fresh worker → fresh Pyodide/`sys.modules` per run) | ✅ |
| R2-C | Fake byte limit (`_rough_size`) | `tracer.limits` "stops at a small byte budget with trace-limit and marks incomplete, keeping valid events" (real UTF-8 JSON byte accounting) | ✅ |
| R2-E | Limit uses a catchable exception | `tracer.limits` "`except Exception` cannot swallow the stop" (signal now `BaseException`-derived + re-raises) AND coordinator termination: `engine.lifecycle` "arms the 10s exec timeout … terminates on timeout" + `runner-lifecycle` Stop | ✅ |

## Preservation (per milestone rule)

- **No lesson `expectedOutput` was changed.** `verify:lessons` (130) and
  `verify:patterns` (29) are byte-identical to baseline; the R2 changes are
  lifecycle/limits/protocol, not program semantics.
- **R1 regression preserved:** `tracer.regression.test.ts` 22/22 still pass —
  safe inspection, self-contained snapshots, input()/EOF, and the `exited`
  status are intact after the tracer edits.
- Non-finite float encoding, opaque type-label handling, and the object-table
  self-containment are untouched.

## What was NOT proven / remaining
- **`P-RUNNER-ORIGIN` (release-blocking, pending):** the real two-origin runner
  topology (app origin ≠ runner origin, bridge served from the runner origin with
  CSP RESPONSE HEADERS, Chrome AND Edge executing/stopping/superseding through the
  bridge, non-loopback blocked) is NOT proven in this environment. R2 is
  "isolation-ready", not "runner isolation complete." The app currently runs the
  module worker same-origin (`getRunnerConfig().mode === "same-origin"`); the
  cross-origin bridge flip is a config change wired for packaging. Recorded as a
  skipped Playwright spec `e2e/runner-origin.pending.spec.ts` and here.
- Playwright uses headless Chromium on Linux, NOT literal Windows Chrome/Edge
  (R9 must note this OS/engine gap).
- **"Opening all 381 exercises creates no eager workers"** is proven
  *structurally*, not by mounting 381 heavy panels: workers are created ONLY
  inside `ExecutionEngine.run()`, never on mount, and `practice.no-eager-worker`
  asserts 0 workers for 1 and 40 mounted runners. The invariant is independent of
  N. A full 381-panel browser mount is deferred to R9's acceptance sweep.
- **CSP is a `<meta>` on the app document only.** A `<meta>` CSP cannot govern a
  separately served worker or a cross-origin bridge; the packaged server must send
  CSP response headers for the runner bridge/worker. That is part of
  P-RUNNER-ORIGIN, not proven here.
- **Streaming batches are emitted post-execution.** The worker records the full
  trace synchronously (Pyodide `sys.settrace`), then partitions it into
  protocol batches with the final `result` carrying only the tail (never the whole
  trace). This satisfies the batch thresholds and the "final message doesn't
  resend the trace" requirement, but batches are not emitted mid-execution; true
  incremental streaming from Python would need a callback bridge (not required by
  R2 and out of scope).
- **Output-at-step display quirk (pre-existing; R4, not R2):** `outputSoFar()`
  only surfaces stdout at the final replay step because the tracer sets no
  per-event `output`. This is a replay/visualization concern owned by R4; R2 tests
  assert run STATUS rather than scrubbed output text.
- **R1 was not independently human-reviewed** (per HANDOFF §1). R2 builds on it at
  the git level with local automated verification only; if R1 review later
  requires changes, treat them as a follow-up bugfix on `main`.
