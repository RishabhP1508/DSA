# R3 — Tasks

Each task: requirement → defect/missing → code → verification → evidence.
Bugs are test-first (failing test committed before the fix).

## T1 — Add dependencies (Zod, fake-indexeddb)
- `npm install zod` (runtime) + `npm install -D fake-indexeddb`, pinned.
- **Verify:** `npm run build` still passes; lockfile updated.

## T2 — Failing tests first (test-first gate)
- **Requirement:** R3-REQ-1..4.
- **Code:**
  - `exercise-id.test.ts` — every exercise's `exerciseUid` is unique across the
    real registry (381); the 4 known bare ids are flagged ambiguous.
  - `migration.test.ts` — v1 record with a unique bare id → migrated to its uid;
    v1 record with a duplicated bare id → moved to `legacyExercises`, NOT solved
    on both, original preserved; drafts + lesson history survive; migration is
    idempotent (running twice == once).
  - `schema.test.ts` — strict validation rejects: array where object expected,
    non-boolean `completed`, bad timestamp, negative attempts, non-string draft
    source; accepts a well-formed v2 backup and a v1 backup (via migrate step);
    never executes source.
  - `progress.atomic.test.ts` — N concurrent `recordExerciseAttempt` calls lose
    no attempts; a restore that fails validation leaves live data intact; a
    successful restore replaces data and writes a pre-restore snapshot.
- **Verify:** these FAIL on current code. Record the failures in `verification.md`.

## T3 — Unique exercise identity (R3-REQ-1)
- **Code:** `src/storage/exercise-id.ts` (`exerciseUid`, `EXERCISE_ID_INDEX`,
  `isAmbiguousBareId`). Thread `ownerKind`/`ownerId` through `ExercisePanel`,
  `Practice`, `PatternLibrary`; keys + `recordExerciseAttempt` use the uid.
- **Verify:** `exercise-id.test.ts` passes; unit + build green.

## T4 — Schema v2 + migration (R3-REQ-2)
- **Code:** `types.ts` (`schemaVersion`, `legacyExercises?`); `progress.ts`
  `migrateProgress` (idempotent), `loadProgress` migrates on read, `PROGRESS_
  SCHEMA_VERSION=2`, `BACKUP_VERSION=2`.
- **Verify:** `migration.test.ts` passes.

## T5 — Deep backup validation with Zod (R3-REQ-3)
- **Code:** `src/storage/schema.ts` Zod schemas + `validateBackup`; `BackupView`
  keeps its API.
- **Verify:** `schema.test.ts` passes.

## T6 — Atomic writes + safe restore (R3-REQ-4)
- **Code:** `progress.ts` `updateProgress` (single readwrite txn) for all
  mutators; transactional restore with pre-restore snapshot; DB version → 2.
- **Verify:** `progress.atomic.test.ts` passes.

## T7 — Full verification + docs (all)
- **Verify:** `npm run check:all` + `test:browser` green; R3 acceptance
  demonstrated; 130 lessons / 29 patterns unchanged. Clean `__pycache__`.
  Write `verification.md`.

## T8 — PR
- One PR `repair/r3-persistence → main` with the required body sections.
  Do not start R4 until merged.
