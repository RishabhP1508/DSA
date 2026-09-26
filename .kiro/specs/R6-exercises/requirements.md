# R6 — Coding exercises and recognition grading (Feature Spec)

**Milestone:** functional repair before UI redesign. **Depends on:** R2–R3 (engine
lifecycle, unique exercise IDs), R5 (curriculum correctness). **Branch:**
`repair/r6-exercises` off `main` (tip `f754e75`, R5 merged).

## Purpose

Make practice actually evaluate understanding and correctness. Today only **3 of
388** exercises are runnable (they carry a `tests` snippet), there is **no
authored recognition grader** (`correctPatternId` is display-only), hints are
uneven, and the Practice view renders every matching exercise at once with no
pagination. R6 closes these gaps.

## Audited starting state (verified on branch)

- Exercise kinds in content: `choose-approach` 164, `complete-code` 88,
  `fix-mistake` 73, `predict-state` 63; `write-solution`/`mixed` 0. Total 388.
- **161 coding exercises** = `complete-code` (88) + `fix-mistake` (73).
- Runnable (has `tests`): 3 (`lesson:linked-list-traversal:ll-complete-1`,
  `lesson:linked-list-reversal:llr-complete-1`,
  `lesson:dp-climbing-stairs:dpcs-complete-1`).
- Recognition (`choose-approach`): 164, graded only by self-assessment.
- Practice view (`src/ui/Practice.tsx`): renders `shown.map(...)` — no pagination.
- Engine is lazy (`getSharedEngine()` creates no worker until `run()`); mounting
  Practice creates zero Python workers. (R2-A already mitigates eager workers.)

## Requirements (EARS)

### Runnable coding exercises

- **R6.1.1** WHEN a coding exercise (`complete-code` or `fix-mistake`) is
  authored, THE SYSTEM SHALL provide starter code (or an explicit editable
  region), a stated contract (required function signature / program behavior), a
  correct model solution, and a deterministic test snippet, so the exercise is
  runnable with pass/fail feedback.
- **R6.1.2** WHEN the model solution of any runnable coding exercise is run
  against its own tests on the bundled runtime, THE SYSTEM SHALL report all
  required cases pass.
- **R6.1.3** WHERE a problem admits multiple valid outputs (e.g. orderings) or a
  structural invariant, THE SYSTEM SHALL test the contract/invariant rather than
  a single literal answer.
- **R6.1.4** THE SYSTEM SHALL NOT reclassify a coding exercise as self-assessment
  to avoid authoring tests.

### Grading that cannot be faked

- **R6.2.1** WHEN a submission exits before its required tests execute, THE
  SYSTEM SHALL report an incomplete/failed evaluation (never a pass).
- **R6.2.2** WHEN learner code prints the expected answer without satisfying the
  contract, THE SYSTEM SHALL NOT report a pass.
- **R6.2.3** THE grading harness SHALL derive pass/fail from actual assertion
  execution on the real engine, and surface the failing detail (message + line)
  and any printed failing input.

### Mistake-rejection (proof the tests catch mistakes)

- **R6.3.1** FOR every runnable coding exercise, THE SYSTEM SHALL verify: the
  model solution passes; the unfinished starter does NOT pass; at least one
  independently-authored plausible-wrong solution is rejected; an early-exit
  variant does NOT pass; and a print-the-answer variant does NOT pass.
- **R6.3.2** Faulty variants SHALL be independently authored (not mirror the
  model solution's structure), so tests catch real mistakes.

### Authored recognition grading

- **R6.4.1** WHEN a recognition exercise (`choose-approach`) is authored, THE
  SYSTEM SHALL define candidate approaches, the acceptable approach(es), the
  required reason(s) for each accepted approach, contradictory/incorrect reasons,
  valid alternatives with their conditions, and feedback for rejected
  combinations.
- **R6.4.2** WHEN a learner selects an approach and a reason, THE SYSTEM SHALL
  grade the pair against the authored data: accept an acceptable approach paired
  with a required reason; accept a valid alternative when its stated conditions
  hold; reject an approach ruled out by the constraints or a contradictory
  reason, with explanatory feedback.
- **R6.4.3** THE SYSTEM SHALL NOT grade arbitrary free-text prose by keywords;
  free-text reflection remains clearly ungraded with a model explanation.
- **R6.4.4** A recognition prompt SHALL NOT reveal its answer through the source
  heading or exercise label.

### Hint progression

- **R6.5.1** WHERE hints are provided for a coding or recognition exercise, THE
  SYSTEM SHALL offer the six stages — understand the example; identify repeated
  work/storage; reveal a useful property; suggest an approach; show pseudocode;
  reveal the explained solution — written for the specific exercise, revealed one
  at a time.

### Economical Practice

- **R6.6.1** THE Practice view SHALL render a bounded set (≤20 per page) with
  navigation through the full collection.
- **R6.6.2** Opening or paging Practice SHALL create no Python worker; a worker
  is created only when a coding evaluation or explicit run is requested.
- **R6.6.3** Attempts and results SHALL persist under the globally unique
  exercise identity `ownerKind:ownerId:exerciseId` (R3).

## Non-goals / carried forward (do NOT hide)

- **FU-1** (Task Scheduler / cooldown scheduling) and **FU-2** (Meeting Rooms II /
  concurrent-overlap-count) remain `unresolved` teaching-content gaps; R6's
  exercise work does not fill them, and their manifest counts are unchanged.
- `P-RUNNER-ORIGIN` packaging gate remains open (R2/packaging).
- Layout/styling/responsiveness/accessibility polish is reserved for the UI pass;
  R6 adds only minimal, labeled, keyboard-operable controls.

## Acceptance

- Every runnable coding exercise has working local evaluation; model passes;
  each has a meaningful rejection test (unfinished/plausible-wrong/early-exit/
  print-answer all fail). Verified by `npm run test:exercises`.
- Recognition grading handles authored approaches, reasons, and alternatives;
  free-text stays ungraded. Verified by unit tests.
- Opening Practice creates no mass worker initialization; pagination bounds the
  rendered set. Verified by a browser test.
- Attempts persist under unique IDs.
- `check:all` and `test:browser` green; verification.md states verified vs
  partial vs unresolved counts.
