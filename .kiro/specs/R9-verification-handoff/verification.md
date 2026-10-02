# R9 — Verification

**Branch:** `repair/r9-verification-handoff` = `main` + R6 (#18) + R7 (#19) +
R8 (#20), merged locally (no conflicts) for an INTEGRATED audit.
**Environment:** Node v22 (nvm), bundled Pyodide / CPython 3.14.2, headless
Chromium on Linux.

## R9.1 — all verification layers (integrated)
`npm run check:all` → **exit 0**:
- build + lint (0 err / 9 warn).
- **unit 625/625 across 37 files**.
- bundled-Python pipeline + visualizers OK.
- curriculum: 131 lessons, 29 patterns, 131 complexity panels, line-explanations
  (131+29), example-model (131+29), coverage-evidence (131 verified / 0 not-yet),
  semantic-consistency (0 fail / 7 advisory), **complexity-analysis (9)**,
  **comparisons (2)**, **prerequisite graph valid**.
- exercises: **runnable 135/135**, **recognition 77**, **hints 212** full 6-stage.

`npm run test:browser` → **17 passed / 5 skipped** (the 5 skips are
`P-RUNNER-ORIGIN`).

The three feature branches merge cleanly and all their test suites pass together
— confirming R6–R8 integrate without conflict.

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
- **Windows Chrome/Edge NOT exercised here** (headless Chromium on Linux only).
  Manual procedure: on a Windows 10/11 host, `npm run build && npm run preview`,
  open the preview URL in Chrome and in Edge, and run the main learning +
  playground flows; separately stand up the two loopback origins (5173 app /
  5174 runner) to exercise the `P-RUNNER-ORIGIN` specs.
- **No UI redesign or packaging work was started.** This spec adds only the
  offline test, the audit table, and the handoff.

## Not proven / carried forward
- `P-RUNNER-ORIGIN`; 26 non-runnable coding exercises; 87 un-graded recognition
  drills; FU-1/FU-2; Windows-browser acceptance; full visual pixel snapshots.
- **Final close-out must be re-run on `main` after #18/#19/#20 merge.**

**Tested commit:** integrated tree on `repair/r9-verification-handoff`.
