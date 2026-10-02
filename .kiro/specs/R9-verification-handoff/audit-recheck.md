# R9.3 — Audit-finding recheck

Every finding from `.kiro/specs/R0-baseline/findings.md` (audit of commit
`249a2f8`), rechecked against the **integrated** repair work (R0–R9). "Fix lives
on" names the spec/PR; a finding is only **Passed** when a regression test
guards it. **Re-confirmed on canonical `main` = `30533a22bfa90a429a1c97fae4c17ae23c403af2`**
(R6 #18, R7 #19, R8 #20, R9 #21 all merged); `check:all` exit 0 and
`test:browser` 18 passed / 5 skipped against that commit. Rows below are updated
to the post-R6-amendment reality (161/161 coding runnable; 164/164 recognition).

| Finding | Original reproduction | Repair | Regression test | Result | Fix lives on |
|---|---|---|---|---|---|
| **R1-A** inspection runs learner `__repr__` | side-effecting `__repr__` incremented a counter during inspection | safe typed adapters; `getattr_static`; opaque fallback (no `repr`) | `tracer` safe-inspection tests | Passed | R1 (main) |
| **R1-B** `__dict__` property invoked | side-effecting `@property __dict__` fired | static attribute inspection | tracer tests | Passed | R1 (main) |
| **R1-C** container subclass override called | overridden `items`/`__iter__` | built-in container access | tracer tests | Passed | R1 (main) |
| **R1-D** object table reset after return value | return ref unresolved in its snapshot | single object table per event; return encoded into it | tracer snapshot tests | Passed | R1 (main) |
| **R1-E** EOF → empty string + completed | `input()` with no stdin returned `''`, status completed | EOF raises `EOFError` | tracer I/O tests | Passed | R1 (main) |
| **R1-F** `rstrip` input semantics | trailing-newline mishandling | controlled stdin stream | tracer I/O tests | Passed | R1 (main) |
| **R2-A** eager per-exercise workers | a worker per `ExercisePanel` warmed Pyodide | one lazy shared engine; worker per run | `engine.lifecycle` + browser (Practice creates 0 workers) | Passed | R2 (main) + R6 browser |
| **R2-B** runs inherit module mutations | module state persisted across runs | fresh module worker per run, terminated on settle | browser R2-B isolation test | Passed | R2 (main) |
| **R2-C** heuristic byte limit | `_rough_size` approximated shapes | real encoded-byte accounting | engine limit tests | Passed | R2 (main) |
| **R2-D** no runner origin / CSP | same-origin worker, no CSP | runner-origin topology + CSP | **5 skipped `P-RUNNER-ORIGIN` specs** | **BLOCKED (packaging)** | R2 (main); gate open |
| **R2-E** limit via catchable exception | learner `except BaseException` could swallow it | coordinator terminates the worker on limit | engine limit tests | Passed | R2 (main) |
| **R3-A** non-unique exercise IDs | `ms-choose-1` shared across two lessons | composite `ownerKind:ownerId:exId`; registry uniqueness test | exercise-id + progress tests | Passed | R3 (main) |
| **R3-B** shallow backup validation | section-presence only | Zod schema v2; atomic restore; pre-restore snapshot | schema/backup tests | Passed | R3/R3.1 (main) |
| **R4-A** deque adapter broken | `DequeVisualizer` always "No deque yet" | deque adapter emits `entries`; all diagram families verified | visualizer tests + browser Visualize-as | Passed | R4 (main) |
| **R4-B** source edit keeps stale trace/complexity | — | source/input-revision invalidation; stale banner; authored association cleared | browser stale-banner test | Passed | R4 (main) |
| **R4-C** inspector hides after first N | — | paginated/collapsible inspection; truncation labelled | browser inspector test | Passed | R4 (main) |
| **R0-A** Windows-invalid dynamic import | bare absolute path ESM import | `pathToFileURL` everywhere | all verify scripts run cross-platform | Passed | R0 (main) |
| **R0-B** silent-skip regex extraction | reformatted lesson silently dropped | real registry load; a missing/malformed item fails | `load-curriculum` structural checks | Passed | R0 (main) |
| **R0-C** bash/nvm/pyenv-only instructions | `AGENTS.md` hardcoded nvm/pyenv | Node-only cross-platform commands; AGENTS.md corrected | n/a (docs) | Passed | R0 (main) |
| **Only 3 of 161 coding exercises runnable** | 3 had `tests` | **161/161** runnable: model passes + rejection of starter / empty / three independently-authored faulty variants (plausible-wrong / early-exit / print-answer) | `verify_exercise_tests.mjs` (model 161/161; all five rejection categories 161/161) | **Passed (161/161)** | **R6 + amendment (#18, on main)** |
| **0 external practice mappings** | no `externalPractice` | 77 occurrences reconciled (R5) + surfaced per-lesson (R8) | `notion-practice` tests | Passed | R5 (main) + R8 (#20) |
| **No recognition grading** | `correctPatternId` display-only | authored `RecognitionGrading` + grader; **164 graded** | `recognition-grading` tests + verifier (164/164 `ALL RECOGNITION OK`) | **Passed (164 of 164)** | **R6 + amendment (#18, on main)** |
| **"130/130 verified" = sample output only** | status flag not evidence | evidence-tied coverage (content hash + checks) | `coverage-evidence` tests (131 verified) | Passed | R5 (main) |
| **No conservative personal-code analysis** | type stub unused | AST analyzer with explicit not-determined | `verify_complexity_analysis.mjs` (9) + browser | **Passed** | **R7 (#19)** |
| **Observed "function calls" counted module entry** | — | module-entry excluded; categories separated; per-step metrics | `complexity.test.ts` (5) | **Passed** | **R7 (#19)** |
| **No learning-path / prerequisite validation** | lessons listed flat; no cycle/missing check | recommendation logic + prereq-graph validation | `learning-path.test.ts` (12) + `verify:lessons` | **Passed** | **R8 (#20)** |
| **Single source-only Playground draft** | one slot, source only | named drafts (source+stdin+binding), import/export | `python-file.test.ts` (6) + browser | **Passed** | **R8 (#20)** |

## Carried-forward / open (not closed)
- **Human semantic review — 158 of 160 pending** (2 agent-reviewed: `lesson:io`,
  `lesson:errors`; the rest `semanticReview: false`). Machine verification is complete; human re-reading of
  the R6–R8-changed learner-facing content has NOT been done. Must be closed in
  recorded batches (handoff.md §10) before the project is "ready for UI review".
  **Blocks the UI-review status** (not packaging).
- **`P-RUNNER-ORIGIN`** (R2-D): real two-origin runner topology + CSP on Windows
  Chrome/Edge not proven — 5 skipped Playwright specs. **Belongs to packaging.**
- **FU-1** (Task Scheduler / cooldown scheduling lesson) and **FU-2** (Meeting
  Rooms II / concurrent-overlap-count lesson) remain `unresolved` in the external
  practice manifest.
- Headless Chromium ≠ Windows Chrome/Edge (R9 OS/engine gap).
- Per-family rendered-pixel snapshots asserted at trace-shape level + a
  representative browser render, not full visual snapshots.

*(Closed by the R6 amendment, previously listed here: "26 coding exercises
self-assessed" → now 161/161 runnable with authored faulty variants; "87
recognition exercises self-assessed" → now 164/164 graded.)*
