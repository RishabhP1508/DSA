# R8 — Learning-path and Playground functional completion (Feature Spec)

**Milestone:** functional repair before UI. **Depends on:** R3–R7. **Branch:**
`repair/r8-learning-path-playground` off `main`.

## Requirements (EARS)

### Learning path (R8.1)
- **R8.1.1** THE curriculum validation SHALL reject missing prerequisite ids and
  prerequisite cycles.
- **R8.1.2** THE SYSTEM SHALL track viewed, practiced, and completed states
  separately; viewing a lesson SHALL NOT mark it complete.
- **R8.1.3** THE SYSTEM SHALL provide an explicit completion action.
- **R8.1.4** THE recommendation SHALL be: resume the last incomplete lesson when
  its prerequisites are satisfied; else its earliest unfinished prerequisite;
  else the earliest eligible unfinished lesson in curriculum order; else review /
  mixed practice. Free browsing SHALL remain allowed.
- **R8.1.5** THE SYSTEM SHALL provide a working "Continue learning" action.

### Navigation + glossary (R8.2)
- **R8.2.1** Related lesson/pattern references SHALL be actionable.
- **R8.2.2** Optional external practice mappings SHALL be exposed without being
  required for local completion.
- **R8.2.3** THE SYSTEM SHALL provide a shared glossary with topic context for
  terms that have more than one meaning.

### Playground drafts & files (R8.3)
- **R8.3.1** THE Playground SHALL support multiple named drafts persisting
  source + stdin + saved custom bindings, and SHALL restore the last selected
  draft.
- **R8.3.2** Python file import SHALL decode UTF-8 (incl. BOM and CRLF) and report
  unsupported decoding; import SHALL create a NEW draft (not overwrite); imported
  code SHALL execute only on request. Export SHALL write a `.py` file. Save status
  SHALL be clearly shown.

### Integration (R8.4)
- **R8.4.1** The Playground SHALL use the repaired execution, inspection,
  visualization, and (R7) complexity systems with the same source-invalidation
  rules.

## Non-goals / carried forward
- FU-1/FU-2 and `P-RUNNER-ORIGIN` remain open (untouched).
- Layout/styling polish reserved for the UI pass; R8 adds only labeled,
  keyboard-operable controls.

## Acceptance
- `check:all` green incl. the prerequisite-graph check in `verify:lessons`.
- `test:browser` green incl. Continue-learning/mark-complete, Glossary, and
  Playground named-draft/import-export.
- Backup/restore preserves the extended draft fields (stdin/name/binding).
