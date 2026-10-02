# R9 — Functional-repair handoff

> **Status: functional repair verified on `main`; NOT YET ready for UI review.**
> One functional-content requirement is still open: **human semantic review of
> the learner-facing content is pending repo-wide (**160 of 160 items
> `semanticReview: false`**). UI review must not start until that is resolved
> in recorded batches by a human reviewer (see §10). UI redesign and offline Windows packaging remain
> separate later milestones.

This is the gate before the UI redesign. It summarises the repaired behaviour,
current counts, test evidence, and everything still open. It does NOT begin UI
work or packaging.

> **Reconciliation note (on-main close-out).** This document was first written on
> the pre-merge `repair/r9-verification-handoff` branch, before the R6 amendment
> (independently-authored faulty variants for all 161 coding exercises; honest
> review ledger) landed. It has now been re-confirmed on the **canonical merged
> `main`** and its counts corrected to the integrated post-amendment reality.
> Superseded figures (e.g. "135/161 runnable", "77 recognition", "unit 625/37")
> are called out inline where they appeared.

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
- **R6** (incl. amendment on `main`) **161/161** coding exercises runnable with a
  mistake-rejection harness that rejects the unfinished starter, the empty
  program, and **three independently-authored faulty variants** (plausible-wrong
  / early-exit / print-answer) per exercise; **164/164** recognition drills
  graded; full 6-stage hints on all **325** interactive exercises; economical
  paginated Practice (no eager workers). *(Superseded earlier draft: "135/161
  runnable, 77 recognition, 212 interactive" — pre-amendment figures.)*
- **R7** honest observed statistics; conservative AST complexity analysis with an
  explicit "not determined" state; personal-code panel + worksheet; baseline-vs-
  improved comparison experiments (operation counts, theory labelled separately).
- **R8** prerequisite-validated learning-path recommendations + "Continue
  learning"; shared glossary; clickable related content + optional external
  practice; named Playground drafts with stdin/binding persistence and Python
  import/export.

## 2. Current counts (integrated R0–R9 on `main` 30533a2)
- Lessons **131**, patterns **29**, exercises **388** (choose-approach 164,
  complete-code 88, fix-mistake 73, predict-state 63).
- Coding exercises **161**; **161 runnable** — every one has a passing model
  solution and is rejected on the unfinished starter, the empty program, and
  three **independently-authored** faulty variants (plausible-wrong / early-exit
  / print-answer). *(Superseded: "135 runnable; 26 self-assessed" — the R6
  amendment completed all 26 by converting single-input scripts to function
  contracts and authoring real faulty variants.)*
- Recognition-graded **164 of 164** choose-approach. *(Superseded: "77 of 164".)*
- Interactive exercises **325**, all with the full 6-stage hint progression.
  *(Superseded: "212".)*
- Coverage entries **131**, all `verified` with current content-hash evidence
  (machine checks). This is machine verification only — see §10 for human review.
- External practice: 79 occurrences reconciled (77 mapped, 2 unresolved = FU-1/2).
- **Human semantic review: 0 of 160 signed off (160 pending).** Open requirement,
  tracked in §10 — the project is NOT ready for UI review while this is open.

## 3. Required vs executed test counts (re-run on `main` 30533a2)
- `npm run check:all` → **exit 0**. Unit **476/476** across **38 files**.
  Curriculum: 131 lessons, 29 patterns, 131 complexity panels, line-explanations
  (131+29), example-model (131+29), coverage-evidence (131 verified / 0 not-yet),
  semantic-consistency (0 failures / 7 advisory), complexity-analysis,
  comparisons, prerequisite graph valid. Exercises: **model solutions 161/161**;
  R6.4 mistake-rejection all five categories **161/161** (starter / empty /
  plausible-wrong / early-exit / print-answer); recognition **164**; hints
  **325** full 6-stage. *(Superseded: "unit 625/37; runnable 135/135;
  recognition 77; hints 212" — those were measured on the pre-merge R9 branch,
  not canonical `main`.)*
- `npm run test:browser` → **18 passed / 5 skipped**. The 5 skips are the
  `P-RUNNER-ORIGIN` packaging gate. *(Superseded: "17 passed" — R7–R8 added
  specs.)*
- Offline: with all non-loopback requests blocked, the app boots and runs real
  Python (`e2e/offline.spec.ts`) — the built app uses local assets only.

## 4. Failed or blocked acceptance criteria
- **Human semantic review pending repo-wide** — 160/160 content items
  `semanticReview: false`. The R6 amendment added hints/recognition prose and
  converted exercises, so every item's content hash moved past its last recorded
  human-review hash; the ledger correctly reverted all to pending. This is a
  functional-content requirement, NOT a UI concern — it must be closed in
  recorded batches (§10) before UI review. *Not release-blocking for packaging,
  but blocking for the "ready for UI review" status.*
- **`P-RUNNER-ORIGIN`** — real two-origin runner topology + CSP on Windows
  Chrome/Edge NOT proven (5 skipped specs). Release-blocking; belongs to
  packaging.
- **FU-1 / FU-2** curriculum follow-ups unresolved (Task Scheduler cooldown
  scheduling; Meeting Rooms II concurrent-overlap counting).

*(Resolved by the R6 amendment, no longer open: the previously-listed "26 coding
exercises not machine-runnable" — now 161/161 runnable — and "87 recognition
exercises not yet authored" — now 164/164 graded.)*

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
- Original pre-merge audit base `main` tip: `f754e75` (R0–R5 merged); integrated
  audit tree was assembled locally on `repair/r9-verification-handoff`.
- **On-main close-out (this reconciliation):** all of R6 (#18), R7 (#19), R8
  (#20), and R9 (#21) are now **merged** into `main`. The canonical merged-main
  base is **`30533a2` (`30533a22bfa90a429a1c97fae4c17ae23c403af2`)**.
  `npm run check:all` (exit 0) and `npm run test:browser` (18 passed / 5 skipped)
  were run — with identical results — on that base **and** on the tested PR commit
  **`2bd9749` (`2bd97492d9c3cae2718be345540e682aaa97769d`)**, a docs-only
  descendant of `30533a2` (the diff is `.kiro/` markdown only). The exact tested
  PR commit is `2bd9749`; `30533a2` is its merged-main base, and the difference
  between them is documentation only. Any later changes on this branch are
  documentation-only and needed no rerun. See `verification.md` → "Test evidence".
  The earlier "re-run on main once #18/#19/#20 merge" instruction is hereby
  discharged.

## 10. OPEN REQUIREMENT — human semantic review (160 pending)

**Machine verification of R0–R9 is complete and green on `main` 30533a2.** Human
semantic review of the learner-facing content is a **separate, still-open**
functional requirement and is **not** satisfied by any passing test.

- **State:** 160 of 160 content items (131 lessons + 29 patterns) carry
  `semanticReview: false` — none signed off yet. The review ledger (`src/content/review-ledger.ts`)
  grants `semanticReview: true` for an item ONLY when a human has recorded a
  sign-off at the item's *current* content hash (`gen_review_ledger.mjs` with
  `REVIEWED_NOW` + a validated `SIGNOFF_DATE`). Because R6–R8 changed
  learner-facing prose (hints, recognition blocks, converted exercise contracts),
  every item's hash moved past its last recorded review hash, so all reverted to
  pending. This is the designed anti-stale behaviour — a review claim cannot
  outlive the content it was made against.
- **What closing it requires (do NOT bulk-sign):** a human re-reads the changed
  learner-facing content **in recorded batches** and signs off only the items
  actually read. The `REVIEWED_NOW` / `SIGNOFF_DATE` env vars must be set
  **before** the command (they are read from the environment, not passed as
  script args):

  ```bash
  # Sign off ONLY the ids actually re-read; use a real ISO date.
  REVIEWED_NOW="lesson:io,lesson:errors" SIGNOFF_DATE="2026-10-02" \
    node --experimental-strip-types --import ./scripts/lib/ts-register.mjs \
    scripts/gen_review_ledger.mjs
  # Regenerate evidence so semanticReview flips true ONLY where the hash matches:
  node --experimental-strip-types --import ./scripts/lib/ts-register.mjs \
    scripts/codemod_add_evidence.mjs
  ```

  Then commit. Items not in `REVIEWED_NOW` (and any not yet re-read) stay
  `semanticReview: false`.
- **Suggested batching** (mirrors the R5.3 review batches by area): B1
  foundations; B2 arrays/strings/hashing/bits; B3 searching/sorting; B4 linear
  structures/stacks/queues/heaps; B5 trees/tries/graphs/range; B6 DP & recursion;
  B7 all 29 patterns. Record, per batch, the exact ids reviewed and the date.
- **Who may sign off:** a reviewer who has actually re-read the full
  learner-facing content of an item (explanation, vocabulary, concepts, hints,
  recognition block, exercise prompts, `expectedOutput`) and checked it against
  the AGENTS.md correctness bar. Sign off *only* those items; never bulk-stamp.
- **Progress ledger:**

  | Batch | Area | Items reviewed (ids) | Reviewed on | Reviewer | Signed off |
  |---|---|---|---|---|---|
  | B1–B7 | all | — | — | — | **0** |
  | **Total** | | | | | **0 / 160 (160 pending)** |

  **No items have been signed off.** Human semantic review has not yet been
  performed; all 160 items remain `semanticReview: false`. (During this
  reconciliation an agent did read `lesson:io` and `lesson:errors` in full to
  confirm the sign-off *mechanism* works end-to-end — ledger `REVIEWED_NOW` +
  validated `SIGNOFF_DATE` flips exactly those items and the evidence codemod
  grants `semanticReview: true` only on a hash match — but that trial sign-off was
  **reverted** so the ledger honestly reflects zero human reviews. The reviews
  must be done by a human in recorded batches; do NOT bulk-sign.)

## Verdict
Machine verification of the functional repair (R0–R9) is **complete and green on
`main` base `30533a2` (tested PR commit `2bd9749`, docs-only descendant)** —
`check:all` exit 0 (unit 476/476), `test:browser` 18 passed / 5 skipped. **The
project is NOT yet ready for UI review.** Two things remain before that status
can be claimed:

1. **Human semantic review (160 pending)** — §10. Must be closed in recorded
   batches; items genuinely re-read are signed off, the rest stay pending.
2. The release-blocking **`P-RUNNER-ORIGIN`** packaging topology and the **FU-1 /
   FU-2** curriculum follow-ups remain tracked and open.

UI redesign and offline Windows packaging are separate later milestones and are
**not** started here. Do not mark the project "ready for UI review" while the
semantic-review requirement in §10 is still pending.
