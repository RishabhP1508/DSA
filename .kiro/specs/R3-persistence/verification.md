# R3 — Verification

**Branch:** `repair/r3-persistence` (off `main` @ `28a1c29`, post-R2).
**Runtime:** bundled Pyodide = CPython 3.14.2. Node v22.

> Filled in as tasks complete. States exactly what was and was NOT proven, the
> tested commit, and remaining failures.

## Baseline re-confirmed before any change (on `main` @ `28a1c29`)

| Check | Result |
|---|---|
| `npm run check:all` | ✅ green (build; lint 0 err/9 warn; unit 61/61; 130 lessons; 29 patterns; 130 complexity; 3 runnable) |

Duplicate-ID probe (reproduces R3-A): 381 exercises; 4 bare ids reused across two
owners each — `expr-choose-1`, `ms-complete-1`, `ms-choose-1`, `bfs-choose-1`;
`ownerKind:ownerId:exId` → 0 collisions.

## Test-first evidence (T2 — recorded BEFORE the fix)

New R3 storage tests run against the unchanged `progress.ts`:
- `exercise-id.test.ts` — **PASS** (new module): all 381 composite ids unique;
  exactly the 4 known ambiguous bare ids flagged; format `ownerKind:ownerId:exId`.
- `schema.test.ts` — **PASS** (new module): deep Zod validation accepts v1/v2,
  rejects array-for-object, non-boolean `completed`, bad timestamp, negative/
  non-integer attempts, non-string draft source; never executes source.
- `migration.test.ts` — **FAIL** (all): `migrateProgress`/`PROGRESS_SCHEMA_VERSION`
  do not exist on the current `progress.ts`.
- `progress.atomic.test.ts` — **FAIL**: current `importBackup` does NOT reject a
  malformed (negative-attempts) backup (`expected true to be false`), has no
  pre-restore snapshot, and no v1→v2 migration on import; the module-level cached
  IDB connection also blocks `deleteDatabase` (fixed by exposing a test-only
  close in the implementation).

## Results after the fix (tested commit: HEAD of `repair/r3-persistence`)

| Check | Result |
|---|---|
| `npm run build` (tsc -b + vite) | ✅ pass |
| `npm run lint` | ✅ 0 errors / 9 warnings (baseline) |
| `npm run test:unit` (all vitest) | ✅ **89/89** (12 files; +28 storage) |
| `npm run test:python` (pipeline + visualizers) | ✅ OK |
| `verify:lessons` | ✅ 130 OK — **unchanged** |
| `verify:patterns` | ✅ 29 OK — **unchanged** |
| `verify:complexity` | ✅ 130 panels |
| `verify:exercises` | ✅ 3 runnable OK |
| `npm run check:all` | ✅ green (RC 0) |
| `npm run test:browser` (Playwright/Chromium) | ✅ 6 passed / 5 skipped |

New R3 storage tests (all passing):
- `exercise-id.test.ts` — 5/5 (381 composite ids unique; exactly the 4 known
  ambiguous bare ids flagged; format `ownerKind:ownerId:exId`).
- `migration.test.ts` — 5/5 (unambiguous bare id → composite uid; the 4 ambiguous
  ids → `legacyExercises` and never onto a twin; drafts + lesson history survive;
  idempotent; unknown ids kept, never dropped).
- `schema.test.ts` — 13/13 (accepts v1 & v2; rejects array-for-object,
  non-boolean `completed`, bad timestamp, negative/non-integer attempts,
  non-string draft source; never executes source).
- `progress.atomic.test.ts` — 5/5 (25 concurrent attempts lose none; a
  validation-failing restore leaves live data intact; a successful restore
  replaces data and writes a recoverable pre-restore snapshot; export→import
  round-trip; a v1 backup imports via migration).
- `e2e/backup.spec.ts` — 1/1 (Backup view renders summary + controls in-browser).

## Defects closed (with the test that prevents recurrence)

| ID | Defect | Test(s) | Result |
|---|---|---|---|
| R3-A | Non-unique exercise ids across owners | `exercise-id.test.ts` (uniqueness + 4 ambiguous flagged); UI threads `ownerKind`/`ownerId` so storage keys on the composite uid | ✅ |
| R3-B | Shallow backup validation | `schema.test.ts` (deep Zod validation rejects malformed nested records; arrays where objects required) | ✅ |
| R3-C | Non-atomic writes / unsafe restore | `progress.atomic.test.ts` (no lost concurrent updates via single txn; failed restore intact; pre-restore snapshot; transactional replace) | ✅ |
| (R3.2) | Duplicated legacy ids create false completion | `migration.test.ts` (ambiguous ids → `legacyExercises`, never solved on both) | ✅ |

## Preservation (per milestone rule)

- No lesson `expectedOutput` changed; `verify:lessons` (130) / `verify:patterns`
  (29) byte-identical to baseline (this spec is persistence-only).
- A v1 progress record (bare exercise keys, no `schemaVersion`) migrates on read
  and on import without losing lessons, drafts, preferences, or attempt counts.
- R1/R2 behavior untouched; the full prior suite stays green.

## What was NOT proven / remaining
- **File-level export→import through the real browser file picker** is not
  automated (Playwright download/upload plumbing is fiddly). The persistence
  LOGIC is fully covered by unit tests against a real IndexedDB (`fake-indexeddb`);
  the browser test proves the Backup view boots and renders its controls. A full
  file round-trip in a real browser is a candidate for the R9 acceptance sweep.
- Playwright is headless Chromium on Linux, not Windows Chrome/Edge (R9 gap).
- The pre-restore snapshot is written to a recovery key; a user-facing "undo
  restore" affordance is not part of R3 (BackupView keeps its current controls;
  UI work is deferred to the UI milestone).
- `EXERCISE_ID_INDEX` has **377** unique bare-id keys (381 exercises − 4 shared
  keys), reflecting the 4 ambiguous ids; this is expected, not a data loss.
