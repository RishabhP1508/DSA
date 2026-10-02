# R6 — Tasks

| # | Task | Requirement | Verification | Status |
|---|------|-------------|--------------|--------|
| T1 | Extend `Exercise` type with `recognition` + `preludeCode`; add `RecognitionGrading`/`RecognitionApproach`/`RecognitionReason` | R6.4 | tsc | done |
| T2 | `recognition-grading.ts`: `gradeRecognition` + `validateRecognition` (+ unit tests) | R6.4 | `recognition-grading.test.ts` (10) | done |
| T3 | Central authored-data module (`exercise-tests-data.ts`) + pure merge (`exercise-tests.ts`) wired into `registry.ts` | R6.1/6.4/6.5 | build + verifier | done |
| T4 | Mistake-rejection harness (`verify_exercise_tests.mjs` + `mistake-variants.mjs`): model passes; starter/empty/synthesised variants rejected | R6.1–R6.3 | `npm run test:exercises` | done |
| T5 | Author `tests` (+ preludes) making coding exercises runnable | R6.1/6.3 | verifier runnable count | **done (161/161)** |
| T5b | Rewrite the 24 bare fragments as complete functions + `kruskal` real find/union + `pat-sw` operation-cost check | R6.1 | verifier: 161/161 model pass | **done** |
| T6 | Author `EXERCISE_RECOGNITION` for ALL choose-approach exercises | R6.4 | verifier recognition count | **done (164/164)** |
| T7 | `RecognitionPanel.tsx` + wire into `ExercisePanel` | R6.4 | browser test | done |
| T8 | Author full 6-stage `EXERCISE_HINTS` for ALL interactive exercises | R6.5 | verifier full-progression count | **done (325/325)** |
| T9 | Practice pagination (≤20/page), no eager worker, filter reset | R6.6 | `practice-exercises.spec.ts` | done |
| T10 | Content-hash honesty: exclude ONLY `tests`/`preludeCode`; hash `hints`+`recognition`; regen ledger (preserve prior → changed→pending) + evidence | R5-integrity | `verify:coverage-evidence` + unit | **done** |
| T11 | Spec docs + run all suites + PR | discipline | check:all + test:browser | done |

## Files added
- `src/core/recognition-grading.ts`, `src/core/recognition-grading.test.ts`
- `src/content/exercise-tests.ts`, `src/content/exercise-tests-data.ts`
- `src/ui/RecognitionPanel.tsx`
- `scripts/lib/mistake-variants.mjs`
- `e2e/practice-exercises.spec.ts`
- `.kiro/specs/R6-exercises/*`

## Files changed
- `src/core/types.ts` (Exercise + recognition types)
- `src/content/registry.ts` (merge authored data)
- `src/ui/ExercisePanel.tsx`, `src/ui/useExerciseRunner.ts`, `src/ui/Practice.tsx`
- `scripts/verify_exercise_tests.mjs` (runnable + recognition + hint verification)
- `scripts/lib/content-hash.mjs` (exclude scaffolding fields)
- `scripts/gen_review_ledger.mjs` (incremental dates), `scripts/codemod_add_evidence.mjs` (date)
- `src/content/coverage.ts` (COVERAGE_VERSION 19), `src/content/review-ledger.ts` (regenerated)
- 160 lesson/pattern files (regenerated `evidence` block only)
