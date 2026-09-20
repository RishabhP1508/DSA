# R3 — Progress identifiers, persistence, and backups (Bugfix)

**Depends on:** R0 (merged). Independent of R1/R2 at the code level, branched off
`main` @ `28a1c29` (post-R2). **Type:** Bugfix (reproduced defects) + the minimum
new plumbing (schema/backup versioning, Zod validation) needed to fix them.

## Defects (reproduced in R0 `findings.md`, re-confirmed for R3)

| ID | Defect | Reproduction / evidence |
|---|---|---|
| R3-A | Non-unique exercise IDs across owners | 381 exercises; **4 bare IDs collide across owners**: `expr-choose-1` (lesson `expressions` & `expression-evaluation`), `ms-complete-1` and `ms-choose-1` (lesson `matrix-search` & `maps-sets`), `bfs-choose-1` (lesson `bfs-queues` & `tree-bfs`). `recordExerciseAttempt(exercise.id, …)` keys storage on the **bare** id, so solving one silently marks its twin solved. |
| R3-B | Backup validation is shallow | `validateBackup` checks only that the four sections are present objects; it does not validate nested record shapes (booleans, timestamps, nonneg int attempts, draft strings), so a malformed/foreign file could be accepted and replace live data. |
| R3-C | Writes are not atomic; restore is not safe | `saveProgress` does a read-modify-write with no transaction, so concurrent updates can lose an attempt. `importBackup` calls `saveProgress` with no pre-restore snapshot and no migration — a failure mid-replace could leave live data damaged. |

## Expected behavior (testable requirements)

- **R3-REQ-1 (R3.1 / R3-A).** THE SYSTEM SHALL identify every exercise by a
  globally unique id composed of owner kind + owner id + exercise id
  (`lesson:matrix-search:ms-choose-1`). This identity SHALL be used consistently
  for storage, attempts, grading, React keys, and backups. A registry-wide test
  SHALL prove uniqueness across all 381 exercises.
- **R3-REQ-2 (R3.2).** THE SYSTEM SHALL introduce progress schema version 2 and
  backup version 2. For unambiguous old exercise ids it SHALL migrate the record
  to its new identity. For the four duplicated ids it SHALL preserve the original
  record in an explicit legacy-ambiguity section, SHALL NOT copy "solved" to both
  exercises, SHALL NOT discard the original attempts/flag, and SHALL keep the
  legacy record in subsequent backups. Existing drafts and lesson history SHALL
  survive migration. Migration SHALL be idempotent.
- **R3-REQ-3 (R3.3).** THE SYSTEM SHALL validate the complete backup contents
  before replacing local data: app marker and supported version; object/map
  structures (an array where an object is required SHALL be rejected); lesson
  completion booleans and valid ISO timestamps; nonnegative integer attempt
  counts; exercise result structures; draft source and stdin strings; binding and
  preference shapes; legacy migration records; and safe handling of unknown
  curriculum ids. It SHALL NOT execute or interpret stored source during
  validation.
- **R3-REQ-4 (R3.4).** THE SYSTEM SHALL use IndexedDB read/write transactions for
  updates (no lost concurrent attempts) and SHALL restore via: parse → validate →
  migrate in memory → validate the migrated result → save a recoverable
  pre-restore record → replace live data transactionally → refresh. ANY failure
  SHALL leave the existing live data intact.

## Preservation requirements (must NOT break)

- No lesson `expectedOutput` changes; the 130 lesson / 29 pattern verification
  stays green (this spec touches persistence, not content).
- Existing progress written under schema v1 must load and migrate without loss.
- Export/import round-trips all supported data.
- R1/R2 behavior untouched.

## Acceptance (from the plan §R3)

- Malformed nested records are rejected.
- A failed restore does not change progress.
- Export/import preserves all supported data.
- Repeated migration is safe (idempotent).
- Duplicated legacy ids do not create false completion.
- Concurrent updates do not lose attempts.
- Draft source, input, and bindings survive restart.
