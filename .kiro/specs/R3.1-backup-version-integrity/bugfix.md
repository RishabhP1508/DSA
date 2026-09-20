# R3.1 — Backup version integrity (Bugfix, R3 follow-up)

**Depends on:** R3 (merged into `main` @ `ad0d56f`). **Type:** Bugfix. Scope is
strictly persistence/validation/migration + tests. No lesson-content changes; R4
does not begin in this PR.

## Defect

A backup can claim to be **version 2 while storing an exercise under an old bare
id**. Example:

```json
{
  "app": "dsa-visual-lab", "backupVersion": 2, "exportedAt": "…",
  "data": {
    "lessons": {}, "exercises": { "ms-choose-1": { "attempts": 1, "solved": true } },
    "legacyExercises": {}, "drafts": {}, "preferences": {},
    "schemaVersion": 2, "backupVersion": 2
  }
}
```

Root cause (as shipped in R3 @ `ad0d56f`):
- `schema.ts` `backupEnvelopeTolerant` / `progressRecordSchemaV2` accept any
  `backupVersion ≤ 2`, an optional `schemaVersion`, and **any** exercise key
  string — so a v2 envelope with a bare key passes validation.
- `migrateProgress` sees `schemaVersion === 2` and early-returns, leaving the
  bare key in `exercises`.

Consequence: restore succeeds, but exercise progress is looked up by the
composite id (`lesson:matrix-search:ms-choose-1`). The bare-keyed record is
never read, so the restored completion is invisible.

## Expected behavior (testable)

- **R3.1-REQ-1.** WHEN a backup declares `backupVersion: 2`, THE SYSTEM SHALL
  require `data.schemaVersion === 2`, `data.backupVersion === 2`, and every key
  in `data.exercises` to be a well-formed **composite** id
  (`lesson:<ownerId>:<exerciseId>` or `pattern:<ownerId>:<exerciseId>`, nonempty
  parts). A v2 file with a bare exercise key SHALL be rejected with a useful
  error, leaving live progress AND the pre-restore snapshot unchanged.
- **R3.1-REQ-2.** A v2 backup with a valid composite key SHALL be accepted and
  preserve its `attempts`/`solved`.
- **R3.1-REQ-3.** A v2 backup MAY reference an exercise **unknown to today's
  registry** provided the key is composite; the id need NOT exist now (backups
  outlive curriculum changes).
- **R3.1-REQ-4.** A genuine v1 backup (bare keys, no `schemaVersion`, no
  `legacyExercises`, `backupVersion: 1`) SHALL remain accepted and follow the
  existing migration rules (unique bare → composite; ambiguous/unknown →
  `legacyExercises`).
- **R3.1-REQ-5.** Inconsistent version combinations SHALL be rejected: outer
  `backupVersion 2` with `data.backupVersion 1`; outer `backupVersion 1` whose
  data claims `schemaVersion 2`; and any future `schemaVersion`/`backupVersion`
  this app cannot understand.
- **R3.1-REQ-6.** `saveProgress` SHALL NOT turn a v1-shaped record (bare keys)
  into a mislabeled "v2 with bare keys" record — it SHALL migrate first.
- **R3.1-REQ-7.** Validation of version and keys SHALL happen BEFORE migration or
  any IndexedDB write; a rejected file SHALL never alter either stored record.
  `loadProgress` SHALL defensively repair any locally-stored "v2 with bare keys"
  record (resolve unique bare ids, keep ambiguous/unknown in `legacyExercises`)
  and SHALL NOT downgrade a future schema version.

## Preservation

- Bare keys are still allowed in `legacyExercises` (migration preserves ambiguous
  history).
- All prior R3 storage tests keep passing; 130 lessons + 29 patterns unchanged.

## Acceptance

The reported v2-with-bare-key file is rejected; a composite v2 file restores
correctly; v1 files still migrate; inconsistent versions are rejected; a
rejected import leaves live data and the snapshot intact.
