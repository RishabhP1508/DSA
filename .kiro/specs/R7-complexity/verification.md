# R7 — Verification

**Branch:** `repair/r7-complexity` off `main`.
**Environment:** Node v22 (nvm), bundled Pyodide / CPython 3.14.2, headless Chromium.

## Proven

### `check:all` — exit 0
- build; lint 0 err / 9 warn; **unit 597/597 across 34 files** (592 baseline +
  `complexity.test.ts` 5).
- curriculum incl. new gates: **COMPLEXITY ANALYSIS OK** (9 cases: 5 supported
  bounds + 4 blocked-with-reason) and **COMPARISONS OK** (Two Sum + membership:
  equal outputs at every size; op counts show O(n²) vs O(n) and O(q·n) vs O(q)).
- unchanged: 131 lessons / 29 patterns / 131 complexity panels / example-model /
  coverage-evidence 131 verified / semantic-consistency 7 advisory.

### `test:browser` — 11 passed / 5 skipped
- New `e2e/personal-complexity.spec.ts`: a supported loop shows an auto-supported
  `O(...)` bound + observed stats; recursion shows "not determined automatically"
  with the reason. The 5 skips remain `P-RUNNER-ORIGIN`.

### Unit (R7.2)
- `src/engine/complexity.test.ts` proves: module-entry excluded from
  user-function calls; active depth excludes the module frame; line entries are
  distinct from trace events; metrics are cumulative to a playback position;
  authored counters evaluate up to a position.

## What was built

- **R7.2:** `src/engine/complexity.ts` reworked — `userFunctionCalls` (module
  entry excluded), `activeDepthAt`/`maxCallDepth` (module frame excluded),
  `lineEntries`, and an `upToIndex` parameter for per-step cumulative metrics.
  `ComplexityPanel.tsx` now shows an "at this step" column beside "whole run" and
  honest per-metric tooltips.
- **R7.3:** `src/engine/complexity_analyzer.py` — a conservative AST analyzer that
  returns an `auto-supported` bound only for fixed/single/sequential/nested
  bounded loops over recognized iterables, and `not-determined` (with a specific
  reason) for `while`, recursion, unmodelled calls, comprehensions, or
  unrecognized iterables. Verified by `scripts/verify_complexity_analysis.mjs`.
- **R7.4:** `LessonWorkspace` now passes `fixedData` derived from the authored
  `fixedDataNote` (not hardcoded true).
- **R7.5:** the analyzer runs in the same worker as the tracer and its result
  flows through the protocol/`RunResult` (`analysis`). `PersonalComplexityPanel`
  renders the static analysis, observed stats (per-step + whole-run), and a
  guided worksheet in the Playground.
- **R7.6:** `ComparisonExperiment` type + `src/content/comparisons.ts` (Two Sum,
  membership) + `scripts/verify_comparisons.mjs` (equal outputs, op-count
  comparison) + `ComparisonLab.tsx` in the Playground (theoretical labels shown
  separately from observed counts).

## Not proven / carried forward
- Correctness of authored Big-O claims still rests on human review; the
  validators check structure and the analyzer is conservative by design.
- The AST analyzer is intentionally narrow: many real programs return
  "not determined" — this is the honest contract, not a gap to paper over.
- `P-RUNNER-ORIGIN`, FU-1, FU-2 remain open (untouched by R7).

**Tested commit:** recorded at PR time on `repair/r7-complexity`.
