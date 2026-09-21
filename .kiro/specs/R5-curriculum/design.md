# R5 — Design

## How a content spec is verified "test-first"

R5 corrects teaching CONTENT, so the "regression tests" are executable checks over
the real registry that FAIL on the current content and PASS after the repair. These
are added BEFORE the content edits and wired into `check:all` so they can never
silently regress.

### New verification: `scripts/verify_line_explanations.mjs` (R5.2.5, R5.1.1)
Loads the real registry and asserts, for every lesson `code` and every pattern
`walkthroughCode`:
- every 1-based line number has a `codeExplanations` entry (no MISSING lines);
- no `codeExplanations` entry points beyond the last line (no OUT-OF-RANGE entries);
- the `executable` flag is a boolean and blank/comment lines are marked `executable:false`
  where trivially detectable (blank line ⇒ not executable).
Exit 1 on any violation. Wired into `test:curriculum`.

Confirmed to FAIL first on: count-set-bits (missing 11), kth-largest (missing 12),
prefix-search (missing 42), adjacency-lists (missing 14), connected-components (missing 25),
references-mutation (out-of-range 17), rotated-array-search (out-of-range 24).

### New verification: `scripts/verify_example_model.mjs` (R5.1)
Asserts the shared executable-example contract:
- every lesson that ships `code` also ships a `complexityExplanation` with non-empty
  `variables`, a `time.bound`+`time.explanation`, a `space.bound`+`space.explanation`,
  a non-empty `derivation`, and non-empty `assumptions`;
- every pattern that ships a full `walkthroughCode` ships a `complexityExplanation`
  (R5.1.2 — a bare `complexityNote` is insufficient for a full implementation);
- every lesson/pattern with an executable example has ≥1 `references` entry with a real URL
  and an `accessDate`.
Exit 1 on violation. Wired into `test:curriculum`. (Note: today the 29 patterns carry only
`complexityNote`; R5.1.2 requires adding a structured `complexityExplanation` to each pattern
that ships a full walkthrough. This is the largest mechanical part of R5.)

### New unit test: `src/content/heaps.facts.test.ts` (R5.2.1–R5.2.3)
Asserts the corrected teaching claims are present and the wrong claim is gone:
- the min-max-heaps lesson MUST mention `heappush_max`/`heappop_max`/`heapify_max`;
- it MUST NOT assert Python is "min-only"/"only has a MIN-heap" as a current fact;
- it MUST still present negation as an alternative;
- a heap lesson that teaches internal mechanics MUST include a sift-up/sift-down example.
Backed by a probe on the bundled runtime (see below), so the claim is evidence-based.

### New unit test: `src/content/sliding-window.facts.test.ts` (R5.2.4)
- the fixed sliding-window lesson MUST NOT initialise the first window with `sum(nums[:k])`
  while claiming O(1) auxiliary space;
- it MUST mention the O(k) init cost and handle/reject `k<=0`/`k>n`;
- it MUST mention prefix sums as a valid alternative.

### Runtime evidence probes (bundled Pyodide 3.14.2)
`scripts/probe_heaps_314.mjs` proved on the bundled runtime that `heapify_max`,
`heappush_max`, `heappop_max`, `heapreplace_max`, `heappushpop_max` all exist and keep
the max at the root, and that negation still works. This is the evidence behind R5.2.1.
(The probe is temporary and NOT committed; its output is recorded in verification.md.)

## Fix approach per area

### Heaps (min-max-heaps, top-k, kth-largest, running-median, two-heap-pattern, heap-sort)
- Rewrite `min-max-heaps` `code` to demonstrate BOTH the native max-heap API and negation,
  keeping the min-heap teaching. Update explanation/vocabulary/review to state 3.14 has native
  max-heaps and negation is the portable alternative. Re-derive `expectedOutput` from the bundled
  runtime (this is a case where the OLD output was tied to WRONG teaching, so the code legitimately
  changes and the new expectedOutput is captured from the runtime — recorded as evidence).
- Ensure `heapify` O(n) build vs push/pop O(log n) is explicit and the line-linked derivation is correct.
- Add an explicit sift-up/sift-down illustration (a small manual implementation lesson section or code).
- Review the other heap lessons for the same min-only misconception and construction-vs-op cost errors.

### Fixed sliding window (sliding-window, string-sliding-window)
- Replace `sum(nums[:k])` init with an explicit accumulation loop; state O(k) init + O(n−k) slide.
- Add k<=0 / k>n handling (or an explicit documented rejection).
- Add a note that prefix sums are a valid alternative for range-sum style variants.
- Re-derive expectedOutput from the runtime if the code changes (evidence recorded).

### Missing / out-of-range line explanations
- Add the missing final-line explanation to the 5 lessons.
- Fix the off-by-one/extra entries in references-mutation and rotated-array-search (remove or
  correct the phantom entry to match the actual code lines).

## Preservation rules (from steering)
- Do NOT drop any lesson/pattern/exercise or coverage entry.
- Do NOT change any lesson `expectedOutput` unless the OLD output was genuinely wrong; where a
  factual-error fix changes the `code`, the new expectedOutput is captured from the bundled
  runtime and the reason is recorded in verification.md. Trace-structure/event-count changes go
  to fixtures, not lesson output.

## Data flow / failure handling
- All new checks load the REAL `registry.ts` (no regex, no silent skip). A missing/malformed
  item fails (exit 1), consistent with R0's no-silent-skip guarantee.
- `check:all` gains the new checks via `test:curriculum`, so any future content edit that drops a
  line explanation or a required complexity explanation fails CI-equivalent locally.
