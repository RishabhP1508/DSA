# R9 — Functional-repair handoff

> **Status: functional repair complete; ready for UI review. UI redesign and
> offline Windows packaging remain (separate milestones).**

This is the gate before the UI redesign. It summarises the repaired behaviour,
current counts, test evidence, and everything still open. It does NOT begin UI
work or packaging.

## 1. Summary of repaired behaviour (R0–R8)
- **R0** cross-platform verification foundation; corrected stale "only Phase 5 /
  130/130 verified" claims.
- **R1** Python tracing preserves behaviour: safe inspection (no learner
  `__repr__`/property execution), self-contained snapshots, `input()`→`EOFError`,
  `SystemExit`→exited.
- **R2** one lazy shared engine; fresh module worker per run; real
  event/encoded-byte limits; cancellation/stale-rejection. (Runner-origin
  topology left as the `P-RUNNER-ORIGIN` packaging gate.)
- **R3** globally unique exercise IDs; schema-v2 + backup-v2 with Zod validation
  and atomic restore.
- **R4** replay / source-edit invalidation / full object inspector / all diagram
  families / Visualize-as.
- **R5** curriculum reverified and completed; evidence-tied coverage; Notion
  external practice reconciled; ledger-backed semantic review.
- **R6** 135/161 coding exercises runnable with a mistake-rejection harness; 77
  authored recognition drills; full 6-stage hints on all 212 interactive
  exercises; economical paginated Practice (no eager workers).
- **R7** honest observed statistics; conservative AST complexity analysis with an
  explicit "not determined" state; personal-code panel + worksheet; baseline-vs-
  improved comparison experiments (operation counts, theory labelled separately).
- **R8** prerequisite-validated learning-path recommendations + "Continue
  learning"; shared glossary; clickable related content + optional external
  practice; named Playground drafts with stdin/binding persistence and Python
  import/export.

## 2. Current counts (integrated R0–R8)
- Lessons **131**, patterns **29**, exercises **388** (choose-approach 164,
  complete-code 88, fix-mistake 73, predict-state 63).
- Coding exercises **161**; **135 runnable** (model passes + starter/empty/
  synthesised-variant rejection); 26 self-assessed (documented).
- Recognition-graded **77** of 164 choose-approach.
- Interactive exercises **212**, all with the full 6-stage hint progression.
- Coverage entries **131**, all `verified` with current content-hash evidence.
- External practice: 79 occurrences reconciled (77 mapped, 2 unresolved = FU-1/2).

## 3. Required vs executed test counts (integrated)
- `npm run check:all` → **exit 0**. Unit **625/625** across **37 files**.
  Curriculum: 131 lessons, 29 patterns, 131 complexity panels, line-explanations
  (131+29), example-model (131+29), coverage-evidence (131 verified / 0 not-yet),
  semantic-consistency (0 failures / 7 advisory), complexity-analysis (9),
  comparisons (2), prerequisite graph valid. Exercises: runnable **135/135**,
  recognition **77**, hints **212** full 6-stage.
- `npm run test:browser` → **17 passed / 5 skipped**. The 5 skips are the
  `P-RUNNER-ORIGIN` packaging gate.
- Offline: with all non-loopback requests blocked, the app boots and runs real
  Python (`e2e/offline.spec.ts`) — the built app uses local assets only.

## 4. Failed or blocked acceptance criteria
- **`P-RUNNER-ORIGIN`** — real two-origin runner topology + CSP on Windows
  Chrome/Edge NOT proven (5 skipped specs). Release-blocking; belongs to
  packaging.
- **26 coding exercises** not machine-runnable (module-level-`return`/`continue`
  fragments; one performance-only fix). Taught + self-assessed; listed in R6.
- **87 recognition exercises** not yet authored with structured grading.
- **FU-1 / FU-2** curriculum follow-ups unresolved (Task Scheduler cooldown
  scheduling; Meeting Rooms II concurrent-overlap counting).

## 5. Browser / runtime versions tested
- Headless **Chromium** (Playwright) on **Linux**; bundled **Pyodide 314.0.7 /
  CPython 3.14.2**. **NOT** literal Windows Chrome/Edge — that OS/engine
  acceptance is an R9/packaging gap to close on a Windows host.

## 6. Progress migration behaviour
- v1→v2 progress migration (R3): unambiguous bare ids move to composite uids;
  ambiguous/unknown ids preserved in `legacyExercises` (never false completion).
  Backup/restore is atomic with a pre-restore snapshot. R8 extended drafts
  (stdin/name/binding) are preserved by the Zod schema (optional fields).

## 7. Remaining UI work (NOT started)
- Overall layout/navigation redesign; typography/colour/spacing/polish;
  responsive & narrow-screen redesign; full 200% zoom + accessibility review;
  animation/presentation polish. R6–R8 added only minimal, labelled,
  keyboard-operable controls.

## 8. Remaining packaging work (NOT started)
- Portable Node runtime; double-click `Start.cmd` launcher + Stop; final ZIP;
  fresh-Windows install test without dev tools; the `P-RUNNER-ORIGIN` two-origin
  server topology; license notices + startup docs.

## 9. Exact commit reviewed
- Base `main` tip at audit: `f754e75` (R0–R5 merged).
- Integrated audit tree: `main` + `repair/r6-exercises` (#18) +
  `repair/r7-complexity` (#19) + `repair/r8-learning-path-playground` (#20),
  merged locally on `repair/r9-verification-handoff` (they merge cleanly; no
  conflicts). **Re-run this audit on `main` once #18/#19/#20 merge** to close out
  on the canonical history.

## Verdict
With R6–R8 merged, the functional-repair gate is met **except** the
release-blocking `P-RUNNER-ORIGIN` topology and the documented content
follow-ups (26 exercises, 87 recognition drills, FU-1/FU-2), all of which are
tracked and visible. The status is **functional repair complete; ready for UI
review** — UI redesign and Windows packaging are the next, separate milestones
and are **not** started here.
