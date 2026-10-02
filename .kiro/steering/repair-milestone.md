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


## Progress (as of R9)

R0–R5 are merged into `main`. R6 (coding exercises runnable + recognition
grading, PR #18), R7 (complexity analysis + comparisons, PR #19), and R8
(learning-path + Playground drafts, PR #20) are complete on their branches and
verified green; they merge cleanly together (R9 integrated audit:
`check:all` exit 0, unit 625/37 files, 135/161 coding runnable, 77 recognition,
212 six-stage hints; browser 17 passed / 5 skipped). R9
(`.kiro/specs/R9-verification-handoff/`) is the audit + handoff: see
`handoff.md` and `audit-recheck.md`.

**Status when #18/#19/#20 merge: functional repair complete; ready for UI
review.** Still open and visible: `P-RUNNER-ORIGIN` (packaging), 26 non-runnable
coding fragments, 87 un-graded recognition drills, FU-1/FU-2, and the
Windows-browser acceptance gap. UI redesign and Windows packaging remain separate
milestones and are NOT started.
