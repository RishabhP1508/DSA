# R3.1 — Verification

**Branch:** `repair/r3.1-backup-version-integrity` (off `main` @ `ad0d56f`, post-R3).
**Runtime:** bundled Pyodide = CPython 3.14.2. Node v22.

## Test-first evidence (recorded BEFORE the fix, on `main` @ `ad0d56f`)

New/extended tests were run against the shipped R3 code — **8 failed** exactly on
the version-integrity gaps:
- `schema.test.ts`:
  - REJECTS a v2 backup with a bare exercise key — **failed** (was accepted; the
    reported bug).
  - REJECTS outer v2 / data v1 — **failed** (accepted).
  - REJECTS outer v1 / data `schemaVersion 2` — **failed** (accepted).
  - REJECTS a future `schemaVersion` — **failed** (accepted).
  - `validateMigratedRecord` rejects a bare key / wrong `schemaVersion` —
    **failed** (accepted).
- `progress.atomic.test.ts`:
  - rejects a v2-with-bare-key import leaving live + snapshot unchanged —
    **failed** (import succeeded, wrote the bare key).
  - `saveProgress` migrates a v1-shaped record instead of mislabeling it v2 —
    **failed** (stamped v2 with the bare key).

The acceptance/negative cases that were already correct (composite v2 accepted,
v1 accepted, future backupVersion rejected, legacy bare keys allowed) passed
before and after.

## Fix

- `exercise-id.ts`: added `isCompositeExerciseKey(key)` — structural check for
  `lesson|pattern:<ownerId>:<exerciseId>` with nonempty parts; does NOT require
  the id to exist in the registry.
- `schema.ts`: version-aware `validateBackup`. The outer `backupVersion` selects
  a strict, mutually-exclusive schema:
  - **v2** → `schemaVersion` and `data.backupVersion` are `z.literal(2)` and
    `exercises` keys must all be composite (`superRefine`).
  - **v1** → bare keys allowed, but `schemaVersion`/`legacyExercises` must be
    absent and `backupVersion` is `z.literal(1)`.
  - any other version → rejected. `validateMigratedRecord` now enforces the
    strict v2 schema (composite keys + literal versions).
- `progress.ts`:
  - `migrateProgress` now uses `isCompositeExerciseKey` (not `includes(":")`),
    relocates any bare key even on a `schemaVersion === 2` record (defensive
    recovery of a locally-corrupted "v2 with bare keys" record), and returns a
    FUTURE schema version untouched (no downgrade).
  - `saveProgress` migrates the supplied record instead of stamping it v2.
  - `importBackup` validates version+keys before migration/write (unchanged
    transactional snapshot+replace).

## Results after the fix (tested commit: `000d934`, PR #15 → `main`)

| Check | Result |
|---|---|
| `npm run build` | ✅ pass |
| `npm run lint` | ✅ 0 errors / 9 warnings (baseline) |
| `npm run test:unit` | ✅ **104/104** (12 files; +15 version-integrity tests) |
| storage tests (`src/storage/`) | ✅ 43/43 (schema 25, exercise-id 5, migration 5, atomic 8) |
| `npm run check:all` | ✅ green (RC 0) |
| `verify:lessons` / `verify:patterns` | ✅ 130 / 29 — **unchanged** |
| `npm run test:browser` | ✅ 6 passed / 5 skipped |

## Defects closed

| Req | Test | Result |
|---|---|---|
| R3.1-REQ-1 | schema "REJECTS a v2 backup with a bare exercise key"; atomic "rejects a v2 backup with a bare key; live data and snapshot unchanged" | ✅ |
| R3.1-REQ-2 | schema/atomic "ACCEPTS a v2 backup with a valid composite key…" | ✅ |
| R3.1-REQ-3 | schema "ACCEPTS a v2 backup whose composite key is UNKNOWN to today's registry" | ✅ |
| R3.1-REQ-4 | atomic "a v1 backup (bare exercise keys) imports via migration" | ✅ |
| R3.1-REQ-5 | schema outer-2/data-1, outer-1/schemaVersion-2, future schemaVersion, future backupVersion | ✅ |
| R3.1-REQ-6 | atomic "saveProgress cannot mislabel a v1 bare record as v2" | ✅ |
| R3.1-REQ-7 | migrateProgress recovery of bare keys on a v2 record; future-version no-downgrade | ✅ |

## What was NOT proven / remaining
- File-picker export→import through the real browser is still not automated
  (unchanged from R3); the logic is covered by unit tests against a real
  IndexedDB (`fake-indexeddb`) and the Backup view boot test.
- Playwright is headless Chromium on Linux, not Windows Chrome/Edge (R9 gap).
