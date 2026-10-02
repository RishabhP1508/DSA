# R9 — Complete functional verification and handoff (Feature Spec)

**Milestone:** functional repair before UI. **Depends on:** all of R0–R8.
**Branch:** `repair/r9-verification-handoff` off `main`.

## Purpose
Establish a credible gate for moving to UI work: run every verification layer,
test offline behaviour, recheck every original audit finding in a table, produce
the handoff — and STOP before any UI redesign or packaging.

## Requirements (EARS)
- **R9.1.1** THE SYSTEM SHALL run type-check/build, lint, unit/component tests,
  bundled-Python regression, curriculum/reference validation, model- and
  faulty-solution exercise tests, visualization tests, and browser integration.
- **R9.1.2** WHERE Windows Chrome/Edge cannot be exercised in this environment,
  THE handoff SHALL say so explicitly and give the manual procedure — never
  substitute a build result for that test.
- **R9.2.1** THE browser integration SHALL verify the app boots, runs Python, and
  grades with non-loopback requests blocked (local assets only). This does NOT
  prove a portable ZIP on a fresh Windows machine.
- **R9.3.1** THE SYSTEM SHALL recheck every original audit finding in a table
  (finding, reproduction, repair, regression test, result, commit); an issue is
  not closed merely because its implementation changed.
- **R9.4.1** THE handoff SHALL report repaired behaviour, current counts,
  required-vs-executed test counts, failed/blocked criteria, browser/runtime
  versions, migration behaviour, remaining UI work, remaining packaging work, and
  the exact commit reviewed.
- **R9.5.1** THE milestone SHALL STOP before UI redesign and before packaging.

## Acceptance
- All verification layers pass on the integrated tree (R6–R8 merge cleanly).
- Offline test passes.
- The audit-recheck table and handoff exist and are honest about open items
  (`P-RUNNER-ORIGIN`, 26 exercises, 87 recognition drills, FU-1/FU-2, Windows
  browser gap).
- No UI or packaging work is begun.
