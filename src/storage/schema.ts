/**
 * Runtime validation for progress records and backup envelopes (R3.3).
 *
 * The audited bug: `validateBackup` only checked that the four sections were
 * present objects, so a malformed or foreign file could replace live data. This
 * module validates the COMPLETE nested shape with Zod before any restore:
 * object/map structures (an array where an object is required is rejected),
 * completion booleans, valid ISO timestamps, nonnegative integer attempt counts,
 * exercise/draft/legacy record shapes, and object-shaped preferences.
 *
 * It NEVER executes or interprets stored source — draft `source`/`stdin` are
 * validated only as strings. Unknown curriculum ids are accepted (keys are
 * opaque strings; we never assume a key resolves to a live lesson/exercise).
 *
 * Zod is introduced in R3 per the repair plan.
 */

import { z } from "zod";
import type { ProgressRecord } from "../core/types";
import { isCompositeExerciseKey } from "./exercise-id";

export const APP_MARKER = "dsa-visual-lab" as const;
/** Current backup envelope version and progress schema version. */
export const BACKUP_VERSION = 2;
export const SCHEMA_VERSION = 2;

/** An ISO-8601 timestamp string that Date can parse. */
const isoDateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: "invalid ISO timestamp" });

const nonNegInt = z.number().int().nonnegative();

const lessonEntry = z.object({
  completed: z.boolean(),
  lastViewedAt: isoDateString,
});

const exerciseEntry = z.object({
  attempts: nonNegInt,
  solved: z.boolean(),
});

const draftEntry = z.object({
  source: z.string(),
  savedAt: isoDateString,
});

const legacyEntry = z.object({
  attempts: nonNegInt,
  solved: z.boolean(),
  note: z.string(),
});

/**
 * A record of exercise entries whose KEYS must all be well-formed composite ids
 * (`lesson:<ownerId>:<exerciseId>` / `pattern:<ownerId>:<exerciseId>`). A bare
 * id here is rejected — bare ids are only allowed in `legacyExercises`, where
 * migration deliberately preserves ambiguous history. The key check does NOT
 * require the id to exist in today's registry (backups outlive curriculum
 * changes).
 */
const compositeExercisesMap = z
  .record(z.string(), exerciseEntry)
  .superRefine((map, ctx) => {
    for (const key of Object.keys(map)) {
      if (!isCompositeExerciseKey(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `exercise key "${key}" is not a composite id (expected lesson:<ownerId>:<exerciseId> or pattern:<ownerId>:<exerciseId>)`,
          path: [key],
        });
      }
    }
  });

/**
 * The strict v2 progress record: `schemaVersion` and `backupVersion` MUST be 2,
 * and `exercises` keys MUST be composite. `z.record` requires an OBJECT map, so
 * an array where a record is expected is rejected.
 */
export const progressRecordSchemaV2 = z.object({
  lessons: z.record(z.string(), lessonEntry),
  exercises: compositeExercisesMap,
  legacyExercises: z.record(z.string(), legacyEntry).optional(),
  drafts: z.record(z.string(), draftEntry),
  preferences: z.record(z.string(), z.unknown()),
  schemaVersion: z.literal(SCHEMA_VERSION),
  backupVersion: z.literal(BACKUP_VERSION),
});

/** The strict v2 backup envelope. */
export const backupEnvelopeSchemaV2 = z.object({
  app: z.literal(APP_MARKER),
  backupVersion: z.literal(BACKUP_VERSION),
  exportedAt: isoDateString,
  data: progressRecordSchemaV2,
});

export type BackupEnvelope = z.infer<typeof backupEnvelopeSchemaV2>;

/**
 * The genuine v1 progress record: bare exercise keys, NO `schemaVersion`, NO
 * `legacyExercises`, and `backupVersion` exactly 1. Malformed nested records are
 * still rejected. This is what the importer migrates to v2.
 */
const progressRecordSchemaV1 = z.object({
  lessons: z.record(z.string(), lessonEntry),
  exercises: z.record(z.string(), exerciseEntry), // bare keys allowed at v1
  drafts: z.record(z.string(), draftEntry),
  preferences: z.record(z.string(), z.unknown()),
  backupVersion: z.literal(1),
  // A genuine v1 record must NOT claim to be schema v2.
  schemaVersion: z.undefined().optional(),
  legacyExercises: z.undefined().optional(),
});

export const backupEnvelopeSchemaV1 = z.object({
  app: z.literal(APP_MARKER),
  backupVersion: z.literal(1),
  exportedAt: isoDateString,
  data: progressRecordSchemaV1,
});

export type ValidationResult =
  | { ok: true; envelope: BackupEnvelope; version: 1 | 2 }
  | { ok: false; error: string };

function flatten(err: z.ZodError): string {
  const first = err.issues[0];
  if (!first) return "validation failed";
  const path = first.path.join(".") || "(root)";
  return `${path}: ${first.message}`;
}

/**
 * Validate a parsed object as a backup envelope WITHOUT touching local data or
 * executing stored source. VERSION-AWARE: the declared outer `backupVersion`
 * selects the schema, and the two versions are mutually exclusive, so
 * inconsistent files are rejected:
 *   - `backupVersion: 2` → must be a strict v2 record (schemaVersion 2,
 *     data.backupVersion 2, COMPOSITE exercise keys). A v2 file carrying a bare
 *     key (the reported bug) is rejected here.
 *   - `backupVersion: 1` → must be a genuine v1 record (bare keys, no
 *     schemaVersion, no legacyExercises). A v1 file claiming schemaVersion 2 is
 *     rejected. It is accepted and later migrated to v2.
 *   - any other version (e.g. 3) → rejected as unsupported.
 * The importer migrates a v1 result then re-validates against the strict v2
 * schema.
 */
export function validateBackup(parsed: unknown): ValidationResult {
  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, error: "backup is not a JSON object" };
  }
  const outer = parsed as { app?: unknown; backupVersion?: unknown };
  if (outer.app !== APP_MARKER) {
    return { ok: false, error: "not a DSA Visual Lab backup (missing app marker)" };
  }
  if (outer.backupVersion === 2) {
    const r = backupEnvelopeSchemaV2.safeParse(parsed);
    if (!r.success) return { ok: false, error: flatten(r.error) };
    return { ok: true, envelope: r.data as BackupEnvelope, version: 2 };
  }
  if (outer.backupVersion === 1) {
    const r = backupEnvelopeSchemaV1.safeParse(parsed);
    if (!r.success) return { ok: false, error: flatten(r.error) };
    // Shape it as the tolerant BackupEnvelope carrier; the importer migrates it.
    return { ok: true, envelope: r.data as unknown as BackupEnvelope, version: 1 };
  }
  return {
    ok: false,
    error: `unsupported backupVersion ${String(outer.backupVersion)} (this app supports 1 and ${BACKUP_VERSION})`,
  };
}

/** Validate a migrated record against the strict v2 schema (composite keys). */
export function validateMigratedRecord(rec: unknown): { ok: true } | { ok: false; error: string } {
  const r = progressRecordSchemaV2.safeParse(rec);
  if (!r.success) return { ok: false, error: flatten(r.error) };
  return { ok: true };
}

/** Narrow an unknown to a ProgressRecord shape after strict validation. */
export function asProgressRecord(rec: unknown): ProgressRecord {
  return progressRecordSchemaV2.parse(rec) as ProgressRecord;
}
