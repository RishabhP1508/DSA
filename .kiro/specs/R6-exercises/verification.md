# R6 — Verification

**Branch:** `repair/r6-exercises` off `main` `f754e75` (R5 merged).
**Environment:** Node v22 (nvm), bundled Pyodide / CPython 3.14.2, headless
Chromium (Playwright) on Linux.
**Commands:** `npm run check:all` (exit 0) and `npm run test:browser`
(12 passed / 5 skipped).

## What was proven

### `check:all` — exit 0 (all green)
- build; lint 0 errors / 9 warnings.
- **unit 602/602 across 34 files** (was 592/33; +`recognition-grading.test.ts` 10).
- test:python pipeline + visualizers OK.
- curriculum: 131 lessons, 29 patterns, 131 complexity panels, line-explanations
  (131+29), example-model (131+29), **coverage-evidence 131 verified / 0 not-yet**,
  semantic-consistency 0 failures / 7 advisory.
- exercises gate:
  - **Runnable coding exercises: 135/135 model solutions pass**, and each rejects
    the unfinished starter, the empty program, and every synthesised mistake
    variant (print-answer / early-exit / plausible-wrong where derivable).
  - **Recognition-graded exercises: 77 — ALL RECOGNITION OK** (each validates
    structurally AND grades the acceptable pair as accepted and a contradictory
    reason as rejected).
  - **Interactive exercises: 212; full 6-stage progression: 212; all have ≥3
    staged hints — HINTS OK.**

### `test:browser` — 12 passed / 5 skipped
- New `e2e/practice-exercises.spec.ts` (3 tests):
  - opening Practice creates **0 Python workers** and renders **≤20** panels with
    working pagination (page 2 reachable, still 0 workers);
  - a recognition drill grades an authored approach+reason pair (verdict shown);
  - a runnable coding exercise executes its tests on the real engine.
- The 5 skips are the **`P-RUNNER-ORIGIN`** packaging gate (unchanged; still open).

## Counts (honest, separated)

| Category | Total | Machine-verified runnable / graded | Not yet |
|---|---|---|---|
| Coding exercises (lesson + pattern `complete-code`/`fix-mistake`) | 161 | **135 runnable** | 26 self-assessed |
| — of which lesson-owned | 133 | 117 | 16 |
| — of which pattern-owned | 28 | 18 | 10 |
| Recognition (`choose-approach`) | 164 | **77 graded** | 87 self-assessed |
| Interactive exercises with full 6-stage hints | 212 | **212** | 0 |

Runnable coding rose from **3 → 135**. Recognition grading did not exist before
R6 (`correctPatternId` was display-only); **77** now have authored, verified
grading.

## What was NOT proven / carried forward (do NOT treat as done)

### 26 coding exercises remain self-assessed (documented, not hidden)
These are code FRAGMENTS whose authored `starterCode`/`expected` are not
standalone programs, so no appended-test harness can grade them without rewriting
the learner-visible content:
- **Module-level `return`/`continue` fragments (21):** `word-search:ws-fix-1`,
  `linked-list-merging:llm-fix-1`, `dp-tabulation`, `dp-1d-2d`,
  `dp-state-transitions`, `dp-house-robber`, `dp-grid-paths`, `dp-coin-change`,
  `dp-lis` (×2), `dp-divide-and-conquer`, `dp-n-queens:dpnq-complete-1`
  (`continue`), and pattern fix-drills `pat-ps-fix-1`, `pat-tp-fix-1`,
  `pat-fs-fix-1`, `pat-bsa-fix-1`, `pat-tk-fix-1`, `pat-gis-fix-1`,
  `pat-iplr-fix-1`, `pat-mbs-fix-1`, `pat-dac-fix-1`. A bare `return`/`continue`
  at module scope is a Python SyntaxError; a prepended prelude cannot wrap the
  learner code in a function/loop without indenting it.
- **Fragments referencing names not defined within them / no observable state
  (4):** `conditions:cond-fix-1` (only prints; `temp` fixed so the fix is not
  observable at one input), `string-sliding-window:ssw-fix-1` (fixed path leaves
  state identical to the empty submission), `kruskal:kru-fix-1` (loop body is a
  `pass` stub, so model and starter both yield `total==0`), `kmp:kmp-complete-1`
  (TODO in the mismatch branch that a single straight-line run can't exercise
  while also rejecting the plausible-wrong corruption in the match branch).
- **Performance-only fix (1):** `pattern:sliding-window:pat-sw-fix-1` — the
  starter is a correct O(n·k) solution producing identical results to the O(n)
  model, so value-based tests cannot reject it.

These stay runnable-in-lesson-context and fully taught (correct model + 6-stage
hints); they are simply not auto-graded. Making them runnable would require
editing the learner-visible fragment into a complete function — deferred as a
content change, not done here.

### 87 recognition exercises remain self-assessed
R6 authored structured grading for the 57 Pattern-Library drills plus 20
high-value lesson distinctions (window vs prefix vs Kadane, DP memo vs tab, heap
top-k, Dijkstra/Bellman-Ford, topo/union-find, etc.). The remaining 87
lesson-level choose-approach prompts keep their authored model explanation and
self-assessment; authoring structured grading for them is follow-up work.

### R5 follow-ups and gates (unchanged, still open)
- **FU-1** (Task Scheduler / cooldown scheduling lesson) and **FU-2** (Meeting
  Rooms II / concurrent-overlap-count lesson) remain `unresolved` in the external
  practice manifest. R6 did not touch their counts or add these lessons.
- **`P-RUNNER-ORIGIN`** packaging gate remains open (5 skipped Playwright specs).

### What green does NOT prove
The Node/Pyodide exercise checks prove the Python grading path on the bundled
runtime; they do not prove the in-browser worker for every exercise, nor the
correctness of the hint prose or recognition explanations beyond structural +
behavioural validation. Those rest on the browser tests (representative) and
human review.

## Content-hash / evidence integrity note
Adding `tests`/`preludeCode`/`recognition`/`hints` to exercises would have
invalidated R5's content hashes for ~150 items. Because these are verification
harness / grading DATA / learner scaffolding (not the authoritative taught
claim), they are excluded from `contentHashOf`. The review ledger was regenerated
incrementally so existing items keep their original review date (the hash
DEFINITION changed, not the reviewed teaching prose): **157 items keep
2026-09-20; 3 lessons that carried inline `tests` in R5 show 2026-09-21.**
Machine evidence regenerated; `COVERAGE_VERSION` 18 → 19; coverage-evidence 131
verified / 0 not-yet.

**Tested commit:** recorded at PR time on `repair/r6-exercises`.
