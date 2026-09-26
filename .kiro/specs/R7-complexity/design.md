# R7 — Design

## Observed statistics (R7.2)
`src/engine/complexity.ts` computes stats from a `RunResult`. The tracer emits a
`call` event for the top-level `<module>` frame; that is excluded from
`userFunctionCalls` (the innermost frame of a `call` event is the entered
function; skip it when its name is `<module>`). Active depth counts only
non-`<module>` frames. All counters accept an `upToIndex` so the panel can show
cumulative-to-the-current-step metrics beside whole-run totals.

## Conservative analyzer (R7.3)
`src/engine/complexity_analyzer.py` parses with `ast` and walks statement lists
computing a loop-nesting DEGREE for recognized `for` loops over recognized
iterables (`range(...)`, a name, `enumerate(x)`, or a literal → constant). It
raises `_Blocked(reason)` on `while`, comprehensions/generators, unmodelled calls
inside a loop, unrecognized loop iterables; recursion is detected up front. The
bound is derived structurally (sequential → sum, nested → product) and size
variables are named `n1, n2, …` from the iterable EXPRESSION, never from
variable names. Output matches the TS `ComplexityAnalysisResult`
(`auto-supported` + `time`/`scope`/`sizeVars`/`supportedFindings`, or
`not-determined` + `uncertaintyReason`).

## Personal-code integration (R7.5)
The analyzer module is installed in the same run worker as the tracer and called
on the run source (pure AST; never executes the program, never throws out). The
result rides the `result` protocol message → `RunResult.analysis`.
`PersonalComplexityPanel` shows the static analysis, observed stats (reusing
`computeObservedStats` with the current index), and a worksheet.

## Comparison experiments (R7.6)
`ComparisonExperiment` pairs a baseline and improved implementation that both
define `solve(*args)` and call `__op()` at the counted operation, plus a
`gen(size)` input generator. The harness/`ComparisonLab` runs both on the same
generated input per size, asserts equal results, and reports operation counts;
theoretical curves are labels only.

## Files
- Added: `src/engine/complexity_analyzer.py`, `src/engine/complexity.test.ts`,
  `src/ui/PersonalComplexityPanel.tsx`, `src/ui/ComparisonLab.tsx`,
  `src/content/comparisons.ts`, `scripts/verify_complexity_analysis.mjs`,
  `scripts/verify_comparisons.mjs`, `e2e/personal-complexity.spec.ts`.
- Changed: `src/engine/complexity.ts`, `src/ui/ComplexityPanel.tsx`,
  `src/ui/LessonWorkspace.tsx`, `src/ui/Playground.tsx`, `src/engine/run.worker.ts`,
  `src/engine/engine.ts`, `src/engine/protocol.ts`, `src/core/types.ts`,
  `package.json`.
