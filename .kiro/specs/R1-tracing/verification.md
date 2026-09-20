# R1 — Verification

**Branch:** `repair/r1-tracing` (off `main` @ `9f777fc`, post-R0).
**Runtime:** bundled Pyodide = CPython 3.14.2. Node v22.

## Test-first evidence

The regression corpus (`src/engine/tracer.regression.test.ts`) was committed
BEFORE the tracer change. On the unfixed tracer, 5 tests failed — exactly the
reproduced defects R1-A (repr executed), R1-B (`__dict__` property), R1-C
(subclass `items()`), R1-D (return unresolved), R1-E (EOF). 14 related invariants
already passed.

## Results after the fix

| Check | Result |
|---|---|
| R1 regression suite | ✅ 22/22 pass |
| `npm run test:unit` (all) | ✅ 31/31 pass (4 files) |
| `npm run build` (tsc + bundle) | ✅ pass (added `"exited"` to `RunStatus`) |
| `npm run lint` | ✅ 0 errors (9 pre-existing warnings) |
| `verify:lessons` | ✅ ALL 130 LESSON OUTPUTS OK — **unchanged** |
| `verify:patterns` | ✅ ALL 29 PATTERN WALKTHROUGHS OK — **unchanged** |
| `verify:complexity` | ✅ 130 panels OK |
| `verify:visualizers` | ✅ OK |
| `verify:pipeline` | ✅ PIPELINE OK |
| `verify:exercises` | ✅ OK |
| `npm run test:browser` (Playwright/Chromium) | ✅ 2/2 e2e pass |

## Defects closed (with the test that prevents recurrence)

| ID | Test | Result |
|---|---|---|
| R1-A repr executed | "a side-effecting __repr__ is never invoked" | ✅ |
| R1-B __dict__ property | "a __dict__ property with a side effect is not invoked" | ✅ |
| R1-C subclass items() | "a container subclass overriding items() is not invoked" | ✅ |
| R1-D return unresolved | "a returned new list resolves within the return event" | ✅ |
| R1-E EOF | "input() past supplied stdin raises EOFError" | ✅ |

## Preservation (per milestone rule)

- **No lesson `expectedOutput` was changed.** The inspection/snapshot fixes
  altered trace *structure* only; all 130 lesson and 29 pattern stdout values
  are byte-identical to before. Confirmed by `verify:lessons`/`verify:patterns`.
- Non-finite float string encoding and opaque module/class/function handling
  preserved (the latter now via a safe type label, never `__repr__`).

## Notes / limitations

- New terminal status `"exited"` (with `exitCode`) distinguishes `sys.exit()`
  from normal completion; the UI shows the status label (UI polish is deferred).
- A harmless Vite dev warning about a missing `pyodide.mjs.map` sourcemap appears
  during Vitest runs; it does not affect results.

**Conclusion:** R1 acceptance met — inspection no longer executes learner code,
snapshots are self-contained, input()/EOF matches CPython, and no legitimate
learner output changed. R0 suite still fully green.
