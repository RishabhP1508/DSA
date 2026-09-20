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
