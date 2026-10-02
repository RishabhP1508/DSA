---
inclusion: always
---

# Current milestone: functional repair before UI redesign

The current milestone is **functional repair before UI redesign** — not release,
not "only packaging remains." An audit of `main` @ `249a2f8` disproved earlier
completion claims; the reproduced findings and the R0–R9 repair plan are in
`.kiro/specs/R0-baseline/findings.md`.

Binding rules for this milestone:

- **Completion requires evidence tied to a requirement.** A passing build,
  matching sample output, a populated complexity panel, a reference URL, or a
  model solution passing are **not**, by themselves, proof of correctness.
  State exactly what was verified and how.
- **Preserve requested curriculum coverage.** Do not delete or silently drop any
  required subtopic, lesson, pattern, or exercise to make status look complete.
- **Report missing work explicitly.** If something is unfinished, blocked, or
  unverifiable in this environment (e.g. real-browser behavior), say so and give
  the exact manual procedure rather than substituting a weaker check.
- **Fix bugs test-first.** Capture a failing regression test before changing
  code, then show it passing. Required acceptance/regression tests are mandatory,
  not optional.
- **Reserve UI redesign and Windows packaging for later.** Add only the minimum
  controls/feedback needed to use and test repaired functionality; keep them
  labeled and keyboard-operable, but defer layout/styling/responsiveness/polish.

The attached product plan (`AGENTS.md` + the repair plan) is the requirements
source. When it conflicts with older notes, the plan and this rule win.


## Progress (as of R9 — all merged into `main`)

**R0–R9 are all merged into `main` = `30533a2`** (R6 #18, R7 #19, R8 #20, R9 #21).
Re-confirmed on that canonical commit after `npm ci`: `check:all` exit 0, unit
**476/476 across 38 files**, **161/161** coding exercises runnable (model passes +
rejection of starter / empty / three independently-authored faulty variants —
plausible-wrong / early-exit / print-answer), **164/164** recognition graded,
**325** six-stage-hint interactive exercises; browser **18 passed / 5 skipped**.
R9 (`.kiro/specs/R9-verification-handoff/`) is the audit + handoff: see
`handoff.md` (esp. §10) and `audit-recheck.md`. *(The earlier "unit 625/37, 135
runnable, 77 recognition, 212 hints, browser 17/5" numbers were a pre-merge local
integration; the R6 amendment then completed all coding/recognition work.)*

**Status: functional repair MACHINE-verified on `main`; NOT yet ready for UI
review.** The one open functional-content requirement is **human semantic review
— 160/160 items pending** (`semanticReview: false` after the R6–R8 content
changes; no human sign-offs yet). It must be closed by a human re-reading the
changed learner-facing content in recorded batches and signing off only reviewed
items (ledger `REVIEWED_NOW` + validated `SIGNOFF_DATE`); do NOT bulk-sign. Also still open and visible:
`P-RUNNER-ORIGIN` (packaging), FU-1/FU-2, and the Windows-browser acceptance gap.
*(No longer open: the former "26 non-runnable coding fragments" and "87 un-graded
recognition drills" — resolved by the R6 amendment.)* UI redesign and Windows
packaging remain separate milestones and are NOT started; do not begin UI review
while the semantic-review requirement is pending.
