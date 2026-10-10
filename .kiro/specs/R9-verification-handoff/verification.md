# R9 — Verification

> **Historical Kiro verification.** Results below remain attributed to their
> original commits. Current Windows Chrome/Edge, runner isolation, subject-review
> and delivery verification is recorded in `docs/completion.md`; these older
> counts and skipped-gate results are not the current acceptance report.

**Re-confirmed on canonical `main`** = `30533a22bfa90a429a1c97fae4c17ae23c403af2`
(R6 #18, R7 #19, R8 #20, R9 #21 all merged). The original audit was assembled
pre-merge on `repair/r9-verification-handoff`; this revision re-ran the suites and
corrected the counts to the post-R6-amendment reality.
**Environment:** Node v22 (nvm), bundled Pyodide / CPython 3.14.2, headless
Chromium on Linux; clean `npm ci` before the runs.

### Test evidence — exact commits each suite ran on
The suites were executed **twice, with identical results**, on two commits that
differ only in R9 documentation (no source, content, ledger, or test changes):

| Run | `check:all` | `test:browser` | Commit |
|---|---|---|---|
| On canonical merged main | exit 0 (unit 476/476) | 18 passed / 5 skipped | **`30533a2`** (= `30533a22bfa90a429a1c97fae4c17ae23c403af2`) — merged-main base |
| On the tested PR commit (final closeout) | exit 0 (unit 476/476) | 18 passed / 5 skipped | **`2bd9749`** (= `2bd97492d9c3cae2718be345540e682aaa97769d`) |

`2bd9749` is a **docs-only descendant of its merged-main base `30533a2`**
(`git diff --stat 30533a2..2bd9749` touches only `.kiro/` markdown — see the PR).
Because the two trees are code-identical, the verification numbers below apply to
both; where a document names `30533a2` it refers to the merged-main base, and the
tested PR commit is `2bd9749`. **The difference between them is documentation
only.** Any later changes on this branch are documentation-only and needed no
rerun.

## R9.1 — all verification layers (on `main` 30533a2)
`npm run check:all` → **exit 0**:
- build + lint (0 err / 9 warn — unchanged advisory baseline).
- **unit 476/476 across 38 files**. *(Superseded: "625/37" measured pre-merge.)*
- bundled-Python pipeline + visualizers OK.
- curriculum: 131 lessons, 29 patterns, 131 complexity panels, line-explanations
  (131+29), example-model (131+29), coverage-evidence (131 verified / 0 not-yet),
  semantic-consistency (0 fail / 7 advisory), complexity-analysis, comparisons,
  prerequisite graph valid.
- exercises: **model solutions 161/161**; R6.4 mistake-rejection all five
  categories **161/161** (starter / empty / plausible-wrong / early-exit /
  print-answer); **recognition 164**; **hints 325** full 6-stage. *(Superseded:
  "runnable 135/135, recognition 77, hints 212" — pre-amendment figures.)*

`npm run test:browser` → **18 passed / 5 skipped** (the 5 skips are
`P-RUNNER-ORIGIN`). *(Superseded: "17 passed".)*

All of R6–R9 are merged into `main` and their suites pass together on the
canonical history — no rebase or re-merge was required (the pre-merge integration
turned out identical to the merged result for the test outcomes).

## R9.2 — offline behaviour
`e2e/offline.spec.ts`: with every non-loopback request aborted, the app boots and
runs real Python in the Playground. Proves the built app uses local assets only.
(Does NOT prove a portable ZIP on a fresh Windows machine — packaging.)

## R9.3 — audit recheck
`audit-recheck.md` rechecks every finding from `R0-baseline/findings.md`. All are
Passed with a regression test EXCEPT `R2-D`/`P-RUNNER-ORIGIN` (BLOCKED — belongs
to packaging). R6/R7/R8 fixes are attributed to their PRs and verified on the
integrated tree.

## R9.4 — handoff
`handoff.md` records repaired behaviour, counts, test counts, failed/blocked
criteria, browser/runtime versions, migration behaviour, remaining UI and
packaging work, and the exact commit basis.

## R9.1.2 / R9.5 — explicit gaps and STOP
- **Human semantic review (160 pending)** is the standing content gap — machine
  checks do not substitute for it; see handoff.md §10. The project is **not**
  marked ready for UI review while it is open.
- **Windows Chrome/Edge NOT exercised here** (headless Chromium on Linux only).
  Manual procedure: on a Windows 10/11 host, `npm run build && npm run preview`,
  open the preview URL in Chrome and in Edge, and run the main learning +
  playground flows; separately stand up the two loopback origins (5173 app /
  5174 runner) to exercise the `P-RUNNER-ORIGIN` specs.
- **No UI redesign or packaging work was started.** This spec adds only the
  offline test, the audit table, and the handoff.

## Not proven / carried forward
- **Human semantic review — 160/160 pending** (all content items
  `semanticReview: false`; no human sign-offs yet). Machine verification complete;
  re-reading the R6–R8-changed learner-facing content in recorded batches is the
  open requirement. Must be closed in
  recorded batches (handoff.md §10) before "ready for UI review" can be claimed.
- `P-RUNNER-ORIGIN`; FU-1/FU-2; Windows-browser acceptance; full visual pixel
  snapshots.
- *(No longer open: the previously-listed "26 non-runnable coding exercises" and
  "87 un-graded recognition drills" were resolved by the R6 amendment —
  161/161 runnable, 164/164 graded.)*
- The "re-run on `main` after #18/#19/#20 merge" item is **discharged**: done here
  on `main` 30533a2.

**Tested commits:** tested PR commit `2bd9749`
(`2bd97492d9c3cae2718be345540e682aaa97769d`), whose merged-main base is
`30533a2` (`30533a22bfa90a429a1c97fae4c17ae23c403af2`). Both were run with
identical results; they differ by documentation only. See "Test evidence" above.
