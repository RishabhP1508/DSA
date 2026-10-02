# R8 — Design

## Learning path (R8.1)
`src/core/learning-path.ts` is pure over `LessonNode[]` + a `PathProgress` view.
`recommendNext` implements the 4-step order; `validatePrerequisiteGraph` rejects
unknown prereq ids, self-prereqs, and cycles (DFS). `verify_lessons.mjs` runs the
validator over the real registry so a bad graph fails the build.
`src/ui/useProgress.ts` loads the IndexedDB progress record, derives the
recommendation, and exposes `markViewed`/`markCompleted`. The Learn view records
a VIEW on lesson open (never a completion) and offers an explicit complete button.

## Navigation + glossary (R8.2)
Prerequisites and `pattern.linkedLessons` are rendered as buttons that call an
`onOpenLesson(id)` / `onOpenPatterns()` callback lifted to `App`. External
practice is filtered from `NOTION_PRACTICE` by `mappedIds.includes(lesson.id)` and
shown as optional links. `Glossary.ts` aggregates all lesson `vocabulary` into
sorted entries keyed case-insensitively; a term with multiple distinct senses
keeps all of them with their lesson/area context. `GlossaryView` lists/filters
and links each sense back to its lesson.

## Playground drafts & files (R8.3)
`storage/progress.ts` drafts now carry `stdin`, `name`, and `binding` (all
optional; older drafts still load). New ops: `listDrafts`, `lastDraftSlot`
(persisted in preferences on save), `deleteDraft`. The Zod `draftEntry` schema
gained the optional fields so backup/restore preserves them rather than stripping
them. `python-file.ts` decodes UTF-8 (BOM strip, CRLF→LF, fatal decoder → reports
invalid UTF-8/binary) and exports a `.py` blob. The Playground draft bar supports
select/new/delete, import-into-a-new-draft, export, and a clear save-status line;
imported code runs only when Run is pressed.

## Files
- Added: `src/core/learning-path.ts` (+test), `src/ui/useProgress.ts`,
  `src/ui/Glossary.ts`, `src/ui/GlossaryView.tsx`, `src/ui/python-file.ts`
  (+test), `e2e/learning-path.spec.ts`, `.kiro/specs/R8-.../*`.
- Changed: `src/App.tsx` (Learn view, Glossary nav, lesson navigation),
  `src/ui/Playground.tsx` (draft bar + import/export), `src/storage/progress.ts`
  (draft API), `src/storage/schema.ts` (draft fields), `scripts/verify_lessons.mjs`
  (prereq graph), `e2e/smoke.spec.ts` (exact nav match).
