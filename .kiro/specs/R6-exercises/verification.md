# R6 — Verification (amended to the full acceptance standard)

**Branch:** `repair/r6-exercises` off `main` `f754e75` (R5 merged).
**Environment:** Node v22 (nvm), bundled Pyodide / CPython 3.14.2, headless
Chromium (Playwright) on Linux.
**Commands:** `npm run check:all` (exit 0) and `npm run test:browser`
(12 passed / 5 skipped).
**Tested commit:** recorded at amendment-commit time on `repair/r6-exercises`
(see the PR head SHA).

## Acceptance criteria (repair plan §R6) — status

| R6 criterion | Status | Evidence |
|---|---|---|
| Every coding exercise has working local evaluation | **MET** | 161/161 runnable |
| Every model solution passes | **MET** | `Model solutions passing: 161/161` |
| Every coding exercise has a meaningful rejection test (unfinished / plausible-wrong / early-exit / print-only fail) | **MET** | harness rejects starter + empty + every synthesisable variant per exercise |
| Recognition grading handles authored approaches, reasons, alternatives, feedback | **MET** | 164/164 choose-approach graded; `ALL RECOGNITION OK` |
| Free-text reflections remain clearly ungraded | **MET** | `RecognitionPanel` reflection is never scored |
| Six-stage hint progression for coding + recognition exercises | **MET** | 325/325 interactive exercises carry the full 6 stages |
| Opening Practice creates no mass worker initialization | **MET** | browser test: 0 workers on open + paging |
| Attempts/results persist under unique exercise identities | **MET** | R3 composite `ownerKind:ownerId:exId` |
| Practice bounded (≤20/page) | **MET** | pagination; browser test asserts ≤20 panels |

## What was proven

### `check:all` — exit 0 (all green)
- build; lint 0 errors / 9 warnings (unchanged advisory baseline).
- **unit 446/446 across 34 files** (incl. `recognition-grading.test.ts`,
  `review-ledger.test.ts` extended for the hash-of-hints/recognition check).
- test:python pipeline + visualizers OK.
- curriculum: 131 lessons, 29 patterns, 131 complexity panels, line-explanations
  (131+29), example-model (131+29), **coverage-evidence 131 verified / 0 not-yet**
  (machine checks + current content hash), semantic-consistency 0 failures /
  7 advisory.
- exercises gate:
  - **Coding exercises: 161/161 runnable; 161/161 model solutions pass.** Each
    rejects the unfinished starter, the empty program, and every synthesisable
    mistake variant (print-answer / early-exit / plausible-wrong where
    derivable). The one performance-only exercise
    (`pattern:sliding-window:pat-sw-fix-1`) is graded by an **operation-cost
    check** (an instrumented list counts element reads and the test asserts the
    solution stays O(n), rejecting the O(n·k) starter).
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
