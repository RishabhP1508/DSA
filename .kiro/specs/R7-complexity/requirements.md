# R7 — Complexity analysis and comparisons (Feature Spec)

**Milestone:** functional repair before UI. **Depends on:** R4–R5 (merged).
**Branch:** `repair/r7-complexity` off `main`.

## Purpose
Teach *why* complexity claims apply, correct the observed statistics, and avoid
guessing about personal programs — while never presenting traced timing as proof.

## Requirements (EARS)

### Authored analysis (R7.1)
- **R7.1.1** Every executable example and model solution SHALL carry a complete
  authored `ComplexityExplanation` (scope, size variables, time+space bounds with
  case, line-linked derivation, cost model, assumptions). Enforced by
  `verify_complexity.mjs` + `verify_example_model.mjs`.

### Observed statistics (R7.2)
- **R7.2.1** "User-function calls" SHALL exclude the module-entry event.
- **R7.2.2** THE SYSTEM SHALL keep the metric categories distinct and honestly
  labelled: trace events, line entries, user-function calls, active call depth
  (module frame excluded), authored operation counters.
- **R7.2.3** THE SYSTEM SHALL show metrics at the selected playback position AND
  whole-run totals.

### Conservative auto-analysis (R7.3)
- **R7.3.1** THE analyzer SHALL establish a whole-program bound ONLY for: fixed
  work, a single bounded loop, sequential loops, and directly-nested loops over
  recognized built-in iterables.
- **R7.3.2** WHEN the code contains an unsupported call, a `while` loop,
  recursion, a comprehension/generator over an unrecognized iterable, or a loop
  over an unrecognized expression, THE SYSTEM SHALL return "not determined
  automatically" with the exact reason — never a guessed bound.
- **R7.3.3** THE analyzer SHALL NOT infer input meaning from variable names.

### Literal vs generalized (R7.4)
- **R7.4.1** THE "this run vs the general algorithm" note SHALL appear only when
  the example's authored analysis declares fixed literal data (`fixedDataNote`),
  not unconditionally.

### Personal-code panel (R7.5)
- **R7.5.1** Every personal program SHALL receive: observed statistics
  (cumulative to the current step + whole run), the supported static analysis or
  an explicit "not determined" state, and a guided worksheet.

### Comparison experiments (R7.6)
- **R7.6.1** An authored comparison SHALL run baseline and improved
  implementations on equivalent generated inputs, VERIFY equal results, and
  compare a clearly-defined operation count per size.
- **R7.6.2** Theoretical growth curves SHALL be labelled separately from observed
  counts; traced timing SHALL NOT be presented as a benchmark.

## Non-goals / carried forward
- FU-1/FU-2 and `P-RUNNER-ORIGIN` remain open (untouched by R7).
- Proving the correctness of an authored Big-O claim remains human review; the
  validators check structure and the analyzer is deliberately conservative.

## Acceptance
- `check:all` green incl. new `verify:complexity-analysis` and `verify:comparisons`.
- `test:browser` green incl. personal-code panel (auto-supported + not-determined).
- Observed-stats unit tests prove module-entry exclusion and per-step metrics.
