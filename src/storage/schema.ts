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

export const APP_MARKER = "dsa-visual-lab" as const;
export const BACKUP_VERSION = 2;

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
 * The strict v2 progress record. `z.record` requires an OBJECT map; an array
 * supplied where a record is expected is rejected by Zod.
 */
export const progressRecordSchemaV2 = z.object({
  lessons: z.record(z.string(), lessonEntry),
  exercises: z.record(z.string(), exerciseEntry),
  legacyExercises: z.record(z.string(), legacyEntry).optional(),
  drafts: z.record(z.string(), draftEntry),
  preferences: z.record(z.string(), z.unknown()),
  schemaVersion: z.number().int(),
  backupVersion: z.number().int(),
});

/** The strict v2 backup envelope. */
export const backupEnvelopeSchemaV2 = z.object({
  app: z.literal(APP_MARKER),
  backupVersion: z.number().int().max(BACKUP_VERSION),
  exportedAt: isoDateString,
  data: progressRecordSchemaV2,
});

export type BackupEnvelope = z.infer<typeof backupEnvelopeSchemaV2>;

/**
 * Version-tolerant envelope for the FIRST validation pass on import: it accepts
 * both v1 (bare exercise keys, no schemaVersion, no legacyExercises) and v2
 * backups. The importer then migrates in memory and validates the result
 * against the strict v2 schema. This still rejects malformed nested records
 * (bad booleans/timestamps/negative attempts/non-string source) at v1 or v2.
 */
const progressRecordTolerant = z.object({
  lessons: z.record(z.string(), lessonEntry),
  exercises: z.record(z.string(), exerciseEntry),
  legacyExercises: z.record(z.string(), legacyEntry).optional(),
  drafts: z.record(z.string(), draftEntry),
  preferences: z.record(z.string(), z.unknown()),
  schemaVersion: z.number().int().optional(),
  backupVersion: z.number().int(),
});

export const backupEnvelopeTolerant = z.object({
  app: z.literal(APP_MARKER),
  backupVersion: z.number().int().max(BACKUP_VERSION),
  exportedAt: isoDateString,
  data: progressRecordTolerant,
});

export type ValidationResult =
  | { ok: true; envelope: BackupEnvelope }
  | { ok: false; error: string };

function flatten(err: z.ZodError): string {
  const first = err.issues[0];
  if (!first) return "validation failed";
  const path = first.path.join(".") || "(root)";
  return `${path}: ${first.message}`;
}

/**
 * Validate a parsed object as a (version-tolerant) backup envelope WITHOUT
 * touching local data or executing stored source. Use this as the first gate on
 * import; the importer migrates then re-validates against `progressRecordSchemaV2`.
 */
export function validateBackup(parsed: unknown): ValidationResult {
  const r = backupEnvelopeTolerant.safeParse(parsed);
  if (!r.success) return { ok: false, error: flatten(r.error) };
  return { ok: true, envelope: r.data as BackupEnvelope };
}

/** Validate a migrated record against the strict v2 schema. */
export function validateMigratedRecord(rec: unknown): { ok: true } | { ok: false; error: string } {
  const r = progressRecordSchemaV2.safeParse(rec);
  if (!r.success) return { ok: false, error: flatten(r.error) };
  return { ok: true };
}

/** Narrow an unknown to a ProgressRecord shape after strict validation. */
export function asProgressRecord(rec: unknown): ProgressRecord {
  return progressRecordSchemaV2.parse(rec) as ProgressRecord;
}
