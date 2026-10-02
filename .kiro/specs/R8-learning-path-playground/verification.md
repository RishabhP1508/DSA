# R8 — Verification

**Branch:** `repair/r8-learning-path-playground` off `main`.
**Environment:** Node v22 (nvm), bundled Pyodide / CPython 3.14.2, headless Chromium.

## Proven

### `check:all` — exit 0
- build; lint; **unit 610/610 across 35 files** (592 baseline + `learning-path.test.ts` 12 + `python-file.test.ts` 6).
- `verify:lessons` now validates the prerequisite graph: **"prerequisite graph
  valid (no missing ids, no cycles)"** across the real 131-lesson curriculum;
  ALL 131 lesson outputs OK.
- coverage-evidence 131 verified / 0 not-yet; semantic-consistency unchanged.

### `test:browser` — 12 passed / 5 skipped
- `e2e/learning-path.spec.ts`: Continue-learning action present + marking a lesson
  complete flips the control and shows ✓ in the nav; Glossary lists/filters terms
  and links to a defining lesson; Playground creates a named draft, shows clear
  save status, lists drafts, and exposes export.
- The 5 skips remain `P-RUNNER-ORIGIN`.

### Unit (R8.1 / R8.3)
- `learning-path.test.ts`: the 4-step recommendation order; viewed ≠ completed;
  earliest-unfinished-prerequisite descent; earliest-eligible selection;
  prerequisite-graph validation (unknown id, self-prereq, cycle).
- `python-file.test.ts`: UTF-8 decode, BOM strip, CRLF/CR → LF, unicode
  preservation, invalid-UTF-8 and binary rejection.

## What was built
- **R8.1:** `src/core/learning-path.ts` (pure recommendation + graph validation),
  wired into `verify_lessons.mjs`; `src/ui/useProgress.ts`; the Learn view now
  shows a Continue-learning banner, per-lesson ✓/▶ status, an explicit "Mark
  lesson complete" action, and records a VIEW on open.
- **R8.2:** clickable prerequisites and related patterns; optional external
  practice (from `notion-practice.ts`) listed per lesson; a shared Glossary view
  (`Glossary.ts` + `GlossaryView.tsx`) that keeps multi-sense terms distinct with
  topic context and links to the defining lesson; a new "Glossary" nav item.
- **R8.3:** named multi-draft storage (`listDrafts`/`lastDraftSlot`/`deleteDraft`,
  drafts now carry stdin + name + binding; Zod schema extended, backup-preserving);
  `python-file.ts` import/export; Playground draft bar (New/Delete/select, Import
  .py → new draft, Export .py, clear save status, restore last draft).
- **R8.4:** the Playground continues to use the repaired engine/replay/inspection
  and the R7 personal-complexity panel + comparison lab, with source-edit
  invalidation (stale banner).

## Not proven / carried forward
- `P-RUNNER-ORIGIN`, FU-1, FU-2 remain open (untouched by R8).
- Backup/restore of extended drafts is covered by the existing R3 schema tests +
  the new optional fields; a dedicated backup round-trip of a binding-bearing
  draft is a candidate for R9's acceptance pass.

**Tested commit:** recorded at PR time on `repair/r8-learning-path-playground`.
