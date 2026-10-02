# R6 — Design

## Architecture: additive, centralized, verified

R6 does not rewrite the 136 content files. Instead it adds three cross-cutting
capabilities via a **single reviewable data module** merged onto the exercises at
registry build time, plus a **grading module**, a **UI panel**, and an extended
**verification harness**.

### Data flow

```
exercise-tests-data.ts   (authored data, keyed by uid ownerKind:ownerId:exId)
  ├─ EXERCISE_TESTS       Python test snippet (makes an exercise runnable)
  ├─ EXERCISE_PRELUDE     scaffold prepended before learner code (fragment → program)
  ├─ EXERCISE_RECOGNITION structured approach/reason grading (choose-approach)
  └─ EXERCISE_HINTS       full 6-stage hint progression (replaces default hints)
        │
        ▼
exercise-tests.ts  attachExerciseData(lessons, patterns)  — PURE merge
        │
        ▼
registry.ts  const _lessons/_patterns → export lessons/patterns (merged)
        │
        ├──────────────► UI (ExercisePanel, RecognitionPanel, Practice)
        └──────────────► Node verifier (load-curriculum → verify_exercise_tests.mjs)
```

Both the UI and the verifier read the SAME merged objects, so `tests` /
`preludeCode` / `recognition` / `hints` are identical in both.

### Runnable exercises (R6.1–R6.3)

- An exercise is runnable iff it has a non-empty `tests` string (unchanged UI
  signal). The run source is `preludeCode + "\n" + learnerCode + "\n# --- tests
  ---\n" + tests`, executed on the SAME bundled-Pyodide tracer the app uses.
- **Contract families:** (a) FUNCTION/CLASS — tests define fixtures, call the
  function/method, assert on returns/invariants; (b) SCRIPT — tests assert on the
  final module variables the learner code leaves; (c) FRAGMENT — a `preludeCode`
  scaffold defines the surrounding names (imports, inputs, host class) so the
  fragment runs as a complete program.
- **Grading (`useExerciseRunner`)**: a clean `completed` status = pass; an
  `AssertionError` = fail (with message + line + printed failing input); any
  other status = infra error. This is real assertion execution — a program that
  merely prints the answer, or exits early, does not satisfy a return/state
  assertion and is reported not-passed.

### Mistake-rejection harness (`scripts/verify_exercise_tests.mjs` + `lib/mistake-variants.mjs`)

For every runnable exercise the harness asserts, on the bundled runtime:
1. the MODEL solution passes;
2. the unfinished STARTER is rejected;
3. the EMPTY program is rejected (universal floor);
4. each SYNTHESISED variant is rejected where derivable — `print-answer` and
   `early-exit` for function contracts, `plausible-wrong` via a single targeted
   corruption of the model (off-by-one, flipped operator, dropped update, …).

Variants are synthesised mechanically from the exercise's own starter/expected,
so they are independent of the tests (not mirror tests). A variant that PASSES
fails the build (the tests are too weak).

### Recognition grading (`src/core/recognition-grading.ts`)

- `RecognitionGrading` (new type): scenario, candidate `approaches` (each with
  `requiredReasonIds`), candidate `reasons` (some `contradictory`), the
  `acceptableApproachIds`, optional `alternatives` (with `conditions`/`tradeoff`),
  a never-graded `reflectionPrompt`, and a `modelExplanation`.
- `gradeRecognition(grading, approachId, reasonId)` → accepted /
  accepted-alternative / rejected, with authored feedback. It never inspects free
  text.
- `validateRecognition(grading)` → structural problems (used by the verifier);
  requires ≥2 approaches, ≥2 reasons, ≥1 acceptable approach with ≥1 required
  reason, and ≥1 contradictory reason so the drill can actually be failed.
- `RecognitionPanel.tsx` renders the picker and the graded verdict; the free-text
  reflection is shown with the model explanation and explicitly not scored.

### Hints (R6.5)

`EXERCISE_HINTS[uid]` supplies the six authored stages (understand → repeated
work → property → approach → pseudocode → solution) and replaces the exercise's
default hints. The verifier fails any interactive exercise with fewer than 3
distinct staged hints and reports how many reach the full ≥5-stage progression.

### Economical Practice (R6.6, `src/ui/Practice.tsx`)

- Renders a bounded page of ≤20 exercises with Previous/Next navigation over the
  full filtered set; changing filter resets to page 1.
- No Python worker is created by opening or paging Practice — the shared engine
  is lazy (R2-A) and each `ExercisePanel` mounts without warming Pyodide. A
  worker is created only when the learner clicks "Run tests". A browser test
  installs a `Worker` counter and asserts it stays 0 on open/paging.

### Content-hash integrity (interaction with R5 evidence)

`tests`, `preludeCode`, `recognition`, and `hints` are **excluded** from
`contentHashOf` (scripts/lib/content-hash.mjs `exerciseClaimFields`): they are
verification harness / grading DATA / learner scaffolding, not the authoritative
taught CLAIM (which lives in explanation, code, complexity, prompt, expected —
all still hashed). This keeps R5's semantic-review invalidation semantics intact
for teaching prose while not treating the ADDITION of a test/hint as a
teaching-claim edit. `gen_review_ledger.mjs` was made incremental: it preserves
each existing item's original `reviewedAt` (the hash-DEFINITION changed, not the
reviewed content) and stamps NOW only for genuinely new items. Result: 157 items
keep their R5 review date; only the 3 lessons that carried inline `tests` in R5
show a re-read date. Machine evidence and the ledger were regenerated;
`COVERAGE_VERSION` bumped 18 → 19.
