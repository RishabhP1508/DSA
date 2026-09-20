# R3 — Design

## Root causes (from R0 findings + R3 file read)

1. **R3-A.** `recordExerciseAttempt(exercise.id, …)` and the React keys use the
   **bare** `exercise.id`. Four bare ids are reused across two owners each, so
   their progress records collide (solving one marks both solved).
2. **R3-B.** `validateBackup` verifies only that `lessons/exercises/drafts/
   preferences` are present objects; nested shapes are unchecked.
3. **R3-C.** `saveProgress` = `loadProgress()` then `put()` — a lost-update race.
   `importBackup` replaces data with no pre-restore snapshot and no migration.

## The unique identity scheme (R3-REQ-1)

```
exerciseUid(ownerKind, ownerId, exId) = `${ownerKind}:${ownerId}:${exId}`
// e.g. "lesson:matrix-search:ms-choose-1", "pattern:sliding-window:sw-choose-1"
```

Verified collision-free across all 381 exercises (probe in the R3 verification).
A registry-wide Vitest asserts uniqueness so a future duplicate fails CI.

### Threading owner context to the UI
`ExercisePanel` currently receives only `{ exercise, patternMode }`. Add
`ownerKind: "lesson" | "pattern"` and `ownerId: string` props. It computes the
uid internally and uses it for `recordExerciseAttempt` and its stable React key.
The two render sites supply the owner:
- `Practice.tsx` — its `Row` already carries `patternMode`; add `ownerKind` +
  `ownerId` when flattening (`l.id` / `p.id`).
- `PatternLibrary.tsx` — the exercise map is inside a `pattern`, so
  `ownerKind="pattern"`, `ownerId=pattern.id`.

`recordExerciseAttempt` gains the uid as its key argument (call sites pass the
uid). No storage call keys on a bare id anymore.

## Schema v2 + migration (R3-REQ-2)

```
PROGRESS_SCHEMA_VERSION = 2
BACKUP_VERSION = 2
```

`ProgressRecord` (v2) adds:
- `schemaVersion: number` (2)
- `legacyExercises?: Record<string, { attempts: number; solved: boolean; note: string }>`
  — v1 records for **ambiguous** bare ids that cannot be attributed to one owner.

### Migration `migrateProgress(rec): ProgressRecord`
Pure, in-memory, **idempotent**. Steps:
1. If `rec.schemaVersion === 2`, return as-is (idempotent no-op).
2. Start from the v1 record. Keep `lessons`, `drafts`, `preferences` unchanged
   (lesson history + drafts survive).
3. For each `exercises[bareId]`:
   - Look up `bareId` in `EXERCISE_ID_INDEX` (built from the registry):
     - **exactly one owner** → move the record to `exercises[uid]` (the new key).
     - **more than one owner (the 4)** → move to
       `legacyExercises[bareId]` with a `note` explaining it can't be attributed;
       do NOT create `exercises[uid]` for either twin, do NOT set solved on both.
     - **unknown bare id** (not in the registry) → keep under
       `legacyExercises[bareId]` with an "unknown id" note (safe; never dropped).
4. Set `schemaVersion = 2`, `backupVersion = 2`.

`EXERCISE_ID_INDEX`: a `Map<bareId, string[] of uids>` built once from the
registry (`collectExercises`). Lives in a small module `src/storage/exercise-id.ts`
so `progress.ts` doesn't pull UI. The 4 ambiguous bare ids map to 2 uids each.

`loadProgress()` runs `migrateProgress` on read so any v1 record is upgraded in
memory (and persisted on the next write). Backups always contain the migrated v2
shape including `legacyExercises`.

## Complete backup validation with Zod (R3-REQ-3)

Add **Zod** (this is the spec where the plan introduces it). New module
`src/storage/schema.ts` exports the Zod schemas and a `validateBackup(parsed)`
that returns `{ ok, envelope | error }`. Schemas:
- `BackupEnvelope`: `app === "dsa-visual-lab"`, `backupVersion` int ≤ current,
  `exportedAt` ISO string, `data: ProgressRecord`.
- `ProgressRecord`: `z.record` (object maps, NOT arrays) for `lessons`,
  `exercises`, `drafts`, `preferences`, optional `legacyExercises`;
  `schemaVersion`/`backupVersion` ints.
- Lesson entry: `{ completed: boolean, lastViewedAt: isoDateString }`.
- Exercise entry: `{ attempts: nonNegInt, solved: boolean }`.
- Draft: `{ source: string, savedAt: isoDateString }`.
- Legacy entry: `{ attempts: nonNegInt, solved: boolean, note: string }`.
- `preferences`: `z.record(z.string(), z.unknown())` (shape-tolerant but object).

Unknown curriculum ids are accepted (keys are opaque strings; we never assume a
key resolves to a live lesson/exercise). Validation NEVER executes stored source
(it only type-checks strings). A `z.record` rejects an array supplied where an
object is required (Zod distinguishes them), satisfying "reject arrays".

Backward compatibility: a **v1** backup (backupVersion 1, no `schemaVersion`, old
bare exercise keys) must still import. Approach: validate against a permissive
"any supported version" envelope schema, then run `migrateProgress` in memory,
then validate the migrated result against the strict v2 schema before saving.

## Atomic writes + safe restore (R3-REQ-4)

- `updateProgress(mutator)`: opens a single `readwrite` transaction, reads the
  current record, applies `mutator` (which returns the new record), and puts it —
  all in one transaction, so concurrent `recordExerciseAttempt` calls cannot lose
  an update. All mutators (`markLessonViewed/Completed`, `recordExerciseAttempt`,
  `saveDraft`, `setPreference`) go through `updateProgress`.
- `importBackup(text)` sequence:
  1. `JSON.parse` (reject non-JSON).
  2. Validate against the version-tolerant envelope schema.
  3. `migrateProgress` in memory → v2.
  4. Validate the migrated result against the strict v2 schema.
  5. Save a recoverable **pre-restore snapshot** to a separate key
     (`pre-restore`) in the same store.
  6. Replace the live record transactionally.
  7. Return ok; UI refreshes.
  Any failure before step 6 leaves live data untouched; the snapshot from step 5
  allows recovery if a caller wants to undo.

IndexedDB bump: `openDB(DB_NAME, 2, { upgrade })` — v2 upgrade creates the store
if missing (idempotent) and needs no data reshape (records migrate lazily on
read). Bumping the DB version is safe for existing users.

## Files touched

- `src/storage/exercise-id.ts` (new) — `exerciseUid()`, `EXERCISE_ID_INDEX`
  (built from registry), `isAmbiguousBareId()`.
- `src/storage/schema.ts` (new) — Zod schemas + `validateBackup`.
- `src/storage/progress.ts` — schema v2, `migrateProgress`, `updateProgress`
  (transactional), transactional restore with pre-restore snapshot, DB v2.
- `src/core/types.ts` — `ProgressRecord` gains `schemaVersion` +
  `legacyExercises?`.
- `src/ui/ExercisePanel.tsx` — accept `ownerKind`/`ownerId`, use the uid.
- `src/ui/Practice.tsx`, `src/ui/PatternLibrary.tsx` — pass owner context.
- `src/ui/BackupView.tsx` — unchanged API; benefits from the new validation.
- Tests (test-first): `src/storage/exercise-id.test.ts` (registry uniqueness),
  `src/storage/migration.test.ts` (v1→v2, 4 dup ids, idempotent, drafts survive),
  `src/storage/schema.test.ts` (deep validation, reject arrays/bad shapes),
  `src/storage/progress.atomic.test.ts` (concurrent attempts, safe restore) —
  using `fake-indexeddb` for a real IDB in jsdom/node.

## Dependency choice
- **Zod** is added now (the plan assigns Zod introduction to R3). Pinned.
- **fake-indexeddb** (devDependency) to test the real IndexedDB code paths
  (transactions, restore) deterministically without a browser. Pinned.
