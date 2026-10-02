# R6 — Verification (amended to the full acceptance standard)

**Branch:** `repair/r6-exercises` off `main` `f754e75` (R5 merged).
**Environment:** Node v22 (nvm), bundled Pyodide / CPython 3.14.2, headless
Chromium (Playwright) on Linux.
**Commands:** `npm run check:all` (exit 0) and `npm run test:browser`
(12 passed / 5 skipped).
**Tested commit:** recorded at amendment-commit time on `repair/r6-exercises`
(see the PR head SHA, filled in by the amendment commit message / PR comment).

## Amendment 2 (this revision) — two correctness fixes, both test-first

This revision replaces two things the previous revision claimed but did not fully
earn, and adds failing-first regression evidence for each.

### Fix A — `gen_review_ledger.mjs` honesty (ledger cannot auto-grant a new item)
Previously a NEW lesson/pattern with no prior ledger entry was recorded at its
live content hash, which the evidence codemod then matched → it silently acquired
`semanticReview: true` with no human having read it. Now:
- The pure, unit-tested core lives in `scripts/lib/review-ledger-core.mjs`
  (`ledgerEntryFor`, `assertIsoDate`, `UNREVIEWED_SENTINEL`).
- A new item that is **not** explicitly signed off is recorded with
  `reviewedHash = "unreviewed-pending-human-signoff"` — a sentinel that can never
  equal a real `contentHashOf` (16-hex), so the item stays **pending**.
- An item is stamped at its live hash **only** when its `kind:id` is listed in the
  `REVIEWED_NOW` env set, and only with a validated ISO `SIGNOFF_DATE`
  (`assertIsoDate` enforces `yyyy-mm-dd` + a real calendar date). The old
  hard-coded review date is gone; a sign-off date is required *only* when
  something is actually being signed off.
- **Failing-first evidence:** `src/content/review-ledger-core.test.ts` (7 tests)
  asserts the OLD behaviour would have granted an unsigned new item and that the
  sentinel path keeps it pending; `src/content/review-ledger.test.ts` (9 tests)
  additionally proves a `hints` or `recognition` change flips the content hash
  (so the claim reverts to pending) while adding `tests` does not. Run:
  `npx vitest run src/content/review-ledger-core.test.ts src/content/review-ledger.test.ts` → 16/16.

### Fix B — R6.4 independently-authored faulty variants for all 161 coding exercises
The previous revision rejected the starter, the empty program, and *synthesised*
mistake variants where derivable, and counted `n/a` where it could not. The
repair plan requires, for **every** coding exercise, three **independently
authored** faulty submissions suited to its contract — plausible-wrong,
early-exit, and print-answer — each proven rejected. `n/a` and a synthesised
variant alone no longer count.
- Authored variants live in `src/content/exercise-faulty-variants.ts`
  (`EXERCISE_FAULTY: Record<uid, {plausibleWrong, earlyExit, printAnswer}>`). This
  file is **verification-only**: it is not shown in the UI and is excluded from
  the content hash.
- `scripts/verify_exercise_tests.mjs` now **requires** all three authored variants
  per coding exercise and asserts each is rejected; the synthesised-variant
  fallback and `n/a` acceptance were removed.
- **Defeating print-answer:** a hard-coded answer trivially passes a single-input
  bare-script exercise. Such exercises were **converted to function contracts**
  (new learner-facing `prompt`/`starterCode`/`expected`, tests calling the
  function with ≥3 inputs incl. edge cases, obsolete `EXERCISE_PRELUDE` cleared),
  so a constant return now fails at least one input. A few genuine function
  exercises had single-input tests strengthened instead;
  `dijkstra:dij-fix-1` was kept as an instrumented bare script (its prelude counts
  adjacency accesses, so a hard-coded distance array is caught).
- **Failing-first evidence:** after the harness was tightened to require authored
  variants, a full run reported **161 failures** ("coding exercise has NO authored
  faulty variants"); authoring then drove every category to 161/161 (below).

### Per-variant totals (exact, from `scripts/verify_exercise_tests.mjs`)
Three consecutive clean runs, all identical:

```
Model solutions passing: 161/161. ALL RUNNABLE EXERCISES OK
R6.4 mistake-rejection (coding=161): starter-rejected 161/161, empty-rejected 161/161,
  plausible-wrong-rejected 161/161, early-exit-rejected 161/161, print-answer-rejected 161/161.
```

| Rejection category | Rejected / total |
|---|---|
| Unfinished starter | **161 / 161** |
| Empty program | **161 / 161** |
| Plausible-wrong (authored) | **161 / 161** |
| Early-exit (authored) | **161 / 161** |
| Print-answer (authored) | **161 / 161** |
| Model solution passes | **161 / 161** |

**Exceptions: none.** Every coding exercise supports all three authored checks;
no exercise required an `n/a` or a synthesised stand-in. (Had any been unable to
support a check, its uid + contract + reason would be listed here instead of a
completion claim.)

## Acceptance criteria (repair plan §R6) — status

| R6 criterion | Status | Evidence |
|---|---|---|
| Every coding exercise has working local evaluation | **MET** | 161/161 runnable |
| Every model solution passes | **MET** | `Model solutions passing: 161/161` |
| Every coding exercise has a meaningful rejection test (unfinished / plausible-wrong / early-exit / print-only fail) | **MET** | harness rejects starter + empty + three **independently authored** variants per exercise; all five categories 161/161 (see Amendment 2) |
| Recognition grading handles authored approaches, reasons, alternatives, feedback | **MET** | 164/164 choose-approach graded; `ALL RECOGNITION OK` |
| Free-text reflections remain clearly ungraded | **MET** | `RecognitionPanel` reflection is never scored |
| Six-stage hint progression for coding + recognition exercises | **MET** | 325/325 interactive exercises carry the full 6 stages |
| Opening Practice creates no mass worker initialization | **MET** | browser test: 0 workers on open + paging |
| Attempts/results persist under unique exercise identities | **MET** | R3 composite `ownerKind:ownerId:exId` |
| Practice bounded (≤20/page) | **MET** | pagination; browser test asserts ≤20 panels |

## What was proven

### `check:all` — exit 0 (all green)
- build; lint 0 errors / 9 warnings (unchanged advisory baseline).
- **unit 453/453 across 35 files** (incl. `recognition-grading.test.ts`,
  `review-ledger.test.ts` extended for the hash-of-hints/recognition check, and
  the new `review-ledger-core.test.ts` proving the ledger cannot auto-grant an
  unsigned new item — Amendment 2 Fix A).
- test:python pipeline + visualizers OK.
- curriculum: 131 lessons, 29 patterns, 131 complexity panels, line-explanations
  (131+29), example-model (131+29), **coverage-evidence 131 verified / 0 not-yet**
  (machine checks + current content hash), semantic-consistency 0 failures /
  7 advisory.
- exercises gate:
  - **Coding exercises: 161/161 runnable; 161/161 model solutions pass.** Each
    rejects the unfinished starter, the empty program, and **three independently
    authored** faulty variants (plausible-wrong / early-exit / print-answer) — all
    five categories at **161/161** (see Amendment 2 for the exact tally and the
    failing-first evidence). The one performance-only exercise
    (`pattern:sliding-window:pat-sw-fix-1`) is graded by an **operation-cost
    check** (an instrumented list counts element reads and the test asserts the
    solution stays O(n), rejecting the O(n·k) starter); its authored variants are
    rejected on the same cost basis.
  - **Recognition-graded exercises: 164/164 — ALL RECOGNITION OK** (each
    validates structurally AND grades the acceptable pair as accepted and a
    contradictory reason as rejected).
  - **Interactive exercises: 325; full 6-stage progression: 325; all ≥3 staged
    hints — HINTS OK.**

### `test:browser` — 12 passed / 5 skipped
- `e2e/practice-exercises.spec.ts`: opening Practice creates **0 Python
  workers** and renders **≤20** panels with working pagination; a recognition
  drill grades an authored approach+reason pair; a runnable coding exercise
  executes its tests on the real engine.
- The 5 skips are the **`P-RUNNER-ORIGIN`** packaging gate (unchanged; still open).

## Final counts (exact)

| Category | Total | Runnable / graded | Remaining |
|---|---|---|---|
| Coding exercises (`complete-code` + `fix-mistake`) | 161 | **161 runnable** | 0 |
| Recognition (`choose-approach`) | 164 | **164 graded** | 0 |
| Interactive exercises with the full 6-stage hints | 325 | **325** | 0 |

Runnable coding rose from **3 → 161**; recognition grading from **0 → 164**
(`correctPatternId` was display-only before R6).

### How the 26 previously-deferred exercises were completed
The 24 bare code fragments (module-level `return`/`continue`, or references to
undefined context) were **rewritten as complete functions/programs with an
explicit contract** (new learner-facing `prompt`/`starterCode`/`expected`), then
given deterministic tests. `kruskal:kru-fix-1` gained a real find/union body.
`pattern:sliding-window:pat-sw-fix-1` (a correct-but-slow starter) is graded by a
documented operation-cost check rather than a value test. All 26 also received
the full 6-stage hint progression.

### Further bare-script → function conversions in Amendment 2
Satisfying the R6.4 print-answer check for the remaining single-input bare-script
exercises required the same conversion pattern (function contract + ≥3-input
tests + cleared `EXERCISE_PRELUDE`). Across Amendment 2 these conversions touched
the learner-facing `prompt`/`starterCode`/`expected` (and hints where needed) of
~50 lesson and pattern files; `src/content/exercise-tests-data.ts` was updated to
call each as a function with edge-case inputs. Because this edits content a
learner reads, every converted item's content hash changed and its
`semanticReview` reverted to pending (tracked honestly below).

## Content-hash honesty (machine vs human review kept distinct)
`contentHashOf` excludes **only** the machine-VERIFICATION harness
(`tests`, `preludeCode` — executable assertions / a runnable-wrapper scaffold).
Everything a learner READS as a claim is hashed, **including `hints` and the
whole `recognition` block (scenario, approach/reason labels, feedback, model
explanation)**. Unit tests prove a hint or recognition change flips the hash
while adding `tests` does not.

Consequence (honest): R6 added hints and/or recognition claims to **every**
lesson and pattern, so each item's content hash changed relative to R5's
recorded human-review hash. The review ledger preserves R5's recorded hashes
verbatim, so **semantic review is now PENDING repo-wide** (all 160 items show
`semanticReview: false`) until a human re-reads the new claim-bearing content and
re-records the ledger (via `gen_review_ledger.mjs`, optionally with
`REVIEWED_NOW`). This is the designed anti-stale behaviour — a human-review claim
cannot survive a content edit.

Machine verification stays **green and distinct**: coverage `verified` is derived
from the machine evidence checks (content/implementation/visualization/exercise/
complexity/references) plus a current content hash, not from `semanticReview`.
`COVERAGE_VERSION = 19`.

## What was NOT proven / carried forward (do NOT treat as done)
- **`P-RUNNER-ORIGIN`** packaging gate remains open (5 skipped Playwright specs).
- **FU-1** (Task Scheduler / cooldown scheduling lesson) and **FU-2** (Meeting
  Rooms II / concurrent-overlap-count lesson) remain `unresolved` in the external
  practice manifest. R6 did not add these lessons or change their counts.
- **Human semantic review is pending repo-wide** (see above): the new hints and
  recognition prose have not been human-reviewed at their current hash. Machine
  verification is complete; human sign-off is tracked separately and honestly.
- Headless Chromium ≠ Windows Chrome/Edge (R9 gap).

### What green does NOT prove
The Node/Pyodide checks prove the Python grading path on the bundled runtime and
that every model passes while mistakes are rejected. They do not prove the
in-browser worker for every exercise, nor the pedagogical quality of the hint
prose or recognition explanations beyond structural + behavioural validation —
those rest on the representative browser tests and (pending) human review.
