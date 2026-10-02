# R9 — Design

R9 is a verification + handoff spec, not a feature. It adds:
- `e2e/offline.spec.ts` — blocks every non-loopback request via Playwright
  routing, then asserts the app boots and runs real Python (local assets only).
- `audit-recheck.md` — the full audit-finding table (R0 findings → repair →
  regression test → result → owning spec/PR).
- `handoff.md` — the ready-for-UI-review handoff.

## Integrated audit method
R6 (#18), R7 (#19), and R8 (#20) are open PRs off `main`. To audit the INTEGRATED
system without merging to `main`, the three branches were merged locally onto a
scratch `repair/r9-verification-handoff` (they merge cleanly, no conflicts) and
`check:all` + `test:browser` were run there: **unit 625/625 (37 files)**,
runnable 135/135, recognition 77, hints 212, complexity-analysis + comparisons
OK, coverage 131 verified; browser **17 passed / 5 skipped**. That integrated
state is what `handoff.md` and `audit-recheck.md` report.

The PR branch itself is kept CLEAN (only the R9 artifacts + offline test on top
of `main`), so this spec follows one-PR-per-spec. The handoff states the
integrated basis and requires the final close-out to be re-run on `main` after
#18/#19/#20 merge.

## STOP
No UI redesign and no packaging work is begun. The runner-origin topology
(`P-RUNNER-ORIGIN`) and the Windows-browser acceptance remain open and are
documented with their manual procedures.
