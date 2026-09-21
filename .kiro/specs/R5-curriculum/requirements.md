# R5 — Reverify and complete the curriculum (Feature spec)

**Depends on:** R4 (in `main`). **Branch:** `repair/r5-curriculum` off `main` @ `3c8142d`.
**Type:** Feature spec, but the R5.2 corrections are handled test-first like bugfixes
(a failing regression is committed before the fix).

## Purpose

Turn populated lesson files into reliable teaching material. A passing sample
output is only ONE part of a lesson's correctness. R5 verifies teaching claims,
line explanations, Python-specific complexity, research evidence, external
practice mappings, and makes coverage evidence-based — without dropping any
required subtopic and without changing any lesson `expectedOutput` unless the
OLD output was genuinely wrong (with evidence).

## Baseline facts (measured on `main` @ 3c8142d)

- 130 lessons, 29 patterns, 130 coverage entries all `verified`, COVERAGE_VERSION=12.
- Bundled runtime: **CPython 3.14.2** (`public/pyodide/pyodide-lock.json`).
- `externalPractice` mappings: **0** across the whole curriculum.
- Only 3 exercises have executable `tests:` (making 161 coding exercises runnable is R6, NOT R5).

## Requirements (EARS)

### R5.1 — Shared executable-example model
- R5.1.1 WHEN a lesson or pattern supplies a full executable implementation, THE SYSTEM SHALL
  carry, for that example: a stable id (the lesson/pattern id), source + supported input
  (`code`/`walkthroughCode` + `stdin`), an expected result (`expectedOutput`), an explanation
  for every displayed line, visual bindings, an analysis scope, a time/space explanation,
  preconditions/edge cases, references, and verification evidence tied to the source revision.
- R5.1.2 A standalone `complexityNote` SHALL be insufficient for a full supplied implementation;
  patterns that ship a full `walkthroughCode` implementation SHALL additionally carry a structured
  `complexityExplanation` (scope, variables, time/space, derivation, assumptions).

Note: the `LessonDefinition`/`ComplexityExplanation`/`ReferenceRecord` types already model
R5.1's fields. R5.1 is enforced by NEW verification (see design.md), not by a type change.

### R5.2 — Fix known factual errors first (research-backed, test-first)
- R5.2.1 (Heaps) WHEN teaching heaps on the bundled Python 3.14, THE SYSTEM SHALL teach the
  native max-heap APIs (`heapify_max`, `heappush_max`, `heappop_max`, and note
  `heapreplace_max`/`heappushpop_max`), AND SHALL present value negation as an ALTERNATIVE
  (still needed on 3.11–3.13), NOT claim "Python only has a min-heap".
- R5.2.2 (Heaps) THE SYSTEM SHALL reconcile 0-based (`heapq`) vs 1-based (textbook) indexing,
  separate heap-CONSTRUCTION cost (`heapify` O(n)) from individual push/pop O(log n), and
  ensure every line-linked complexity derivation points at the operation it actually describes.
- R5.2.3 (Heaps) THE SYSTEM SHALL include an explicit sift-up/sift-down example where internal
  heap mechanics are taught.
- R5.2.4 (Fixed sliding window) WHEN a fixed-size sliding-window example claims O(1) auxiliary
  space, THE SYSTEM SHALL compute the first window by explicit accumulation (NOT `sum(nums[:k])`,
  which allocates an O(k) slice), state init costs O(k), explain total time O(k)+O(n−k)=O(n),
  handle or explicitly reject `k<=0` and `k>n`, and note prefix sums are a valid alternative.
- R5.2.5 (Missing line explanations) THE SYSTEM SHALL provide an explanation for EVERY line of
  every lesson `code` and every pattern `walkthroughCode`, with NO explanation pointing at a
  line that does not exist. Specifically repairs the known gaps in count-set-bits,
  kth-largest, prefix-search, adjacency-lists, connected-components, plus any additional
  missing/out-of-range mappings found by a full scan.

### R5.3 — Full-inventory review in 6 batches
- R5.3.1 THE SYSTEM SHALL review all 130 lessons + 29 patterns in 6 batches against the full
  checklist (beginner explanation + vocabulary, prerequisites, definition/invariant,
  preconditions, implementation correctness, edge cases, line explanations, visual behavior,
  time/space reasoning, exercises/feedback, pattern guidance, reference evidence), recording
  findings in verification.md.

### R5.4 — Python-specific complexity
- R5.4.1 THE SYSTEM SHALL check Python-specific costs (slices/copies, temp containers, repeated
  string concatenation, list front insertion/removal, hashing assumptions, heap stale entries,
  recursion depth, generated output size, arbitrary-size integer ops) and best/avg/worst/
  expected/amortized cases; peak temporary storage counts as auxiliary space; a whole example's
  cost is distinguished from one operation's cost.

### R5.5 — Restore the research workflow
- R5.5.1 THE SYSTEM SHALL preserve all original references and, for every substantial correction,
  record exact sections/claims/conventions/access dates in the lesson `references` and
  `docs/references.md`. Unresolved material questions are recorded as explicit gaps.

### R5.6 — Populate external practice mappings
- R5.6.1 THE SYSTEM SHALL map the Notion syllabus's listed practice questions to relevant
  lessons/patterns (title + destination link only; no third-party problem statements). Every
  listed question SHALL be mapped or explicitly recorded as unresolved; NO fabricated links.
  External practice stays optional; local exercises must teach the technique.

### R5.7 — Evidence-based coverage
- R5.7.1 THE SYSTEM SHALL separate inventory version / content revision / verification status.
  A topic is `verified` only after content, implementation, visuals, exercises, complexity, and
  references all pass their checks. Changing source/teaching claims invalidates prior verification
  evidence. COVERAGE_VERSION SHALL be bumped when the required set changes; `docs/coverage.md`
  regenerated via `npm run gen:coverage`.

## Acceptance

- All required subtopics still represented (no silent omission; 130 lessons / 29 patterns / 130 coverage entries).
- Every executable line has a correct explanation; NO out-of-range explanation entries.
- Heaps and fixed-sliding-window factual errors corrected with recorded evidence.
- All example/solution complexity claims have a stated scope + reasoning.
- Every visual example has meaningful rendering evidence (from R4 visualizer checks + this review).
- Every listed external practice question is mapped or explicitly blocked.
- No topic marked verified solely because its sample output passes.
- `check:all` green; `test:browser` 9 passed / 5 skipped (P-RUNNER-ORIGIN unchanged).
- No lesson `expectedOutput` changed unless the OLD output was genuinely wrong (with evidence).

## Out of scope for R5 (carried forward)
- Making the 161 coding exercises runnable + authored recognition grading (R6).
- Full authored complexity for EVERY implementation / observed-stat corrections / AST analysis (R7).
- Learning-path recommendations + Playground drafts/import-export (R8).
- P-RUNNER-ORIGIN two-origin runner topology (packaging; remains a pending release-blocking gate).
