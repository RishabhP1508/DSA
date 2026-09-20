/**
 * Local persistence via IndexedDB (idb) + versioned JSON backup/restore (R3).
 *
 * R3 fixes:
 *  - Progress is keyed on the GLOBALLY UNIQUE exercise id
 *    `<ownerKind>:<ownerId>:<exerciseId>` (see exercise-id.ts), so exercises
 *    that share a bare id across owners no longer share progress (R3-A).
 *  - A v1 → v2 migration rewrites old bare-id records: unambiguous ids move to
 *    their composite uid; the ambiguous ones (reused across owners) and any
 *    unknown ids move to a legacy-ambiguity section, preserved but never
 *    attributed to a twin or discarded (R3.2).
 *  - Backups are validated with a complete Zod schema before replacing live
 *    data (R3.3), and restore is transactional with a recoverable pre-restore
 *    snapshot; any failure leaves live data intact (R3.4).
 *  - All mutations go through a single read/write transaction, so concurrent
 *    updates cannot lose an attempt (R3.4).
 */

import { openDB, type IDBPDatabase } from "idb";
import type { ProgressRecord } from "../core/types";
import { uniqueUidForBareId } from "./exercise-id";
import {
  validateBackup,
  validateMigratedRecord,
  APP_MARKER,
  BACKUP_VERSION as SCHEMA_BACKUP_VERSION,
} from "./schema";

const DB_NAME = "dsa-visual-lab";
const DB_VERSION = 2;
const STORE = "progress";
const KEY = "singleton";
const PRE_RESTORE_KEY = "pre-restore";

/** Current progress-record schema version (migration target). */
export const PROGRESS_SCHEMA_VERSION = 2;
/** Current backup envelope version. */
export const BACKUP_VERSION = SCHEMA_BACKUP_VERSION; // 2

const empty: ProgressRecord = {
  lessons: {},
  exercises: {},
  legacyExercises: {},
  drafts: {},
  preferences: {},
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  backupVersion: BACKUP_VERSION,
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function db(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE)) {
          database.createObjectStore(STORE);
        }
      },
    });
  }
  return dbPromise;
}

/** Test-only: close and forget the cached connection so a DB can be deleted. */
export async function __closeDbForTests(): Promise<void> {
  if (dbPromise) {
    const d = await dbPromise;
    d.close();
    dbPromise = null;
  }
}

// ---------------------------------------------------------------------------
// Migration (v1 → v2)
// ---------------------------------------------------------------------------

/**
 * Migrate a progress record to the current schema. Pure and IDEMPOTENT:
 * calling it on an already-v2 record returns an equivalent record.
 *
 * v1 records key exercises on the BARE exercise id. We rewrite them:
 *  - a bare id that resolves to exactly one owner → moved to its composite uid;
 *  - an AMBIGUOUS bare id (reused across owners) → moved to `legacyExercises`
 *    with a note, NOT copied to either twin and NOT discarded;
 *  - an UNKNOWN bare id (not in the current registry) → also kept in
 *    `legacyExercises` with a note (never silently dropped).
 * Lessons, drafts, preferences, and any existing legacyExercises are preserved.
 */
export function migrateProgress(rec: ProgressRecord): ProgressRecord {
  if (rec.schemaVersion === PROGRESS_SCHEMA_VERSION) {
    // Already current: normalise optional fields but change nothing meaningful.
    return {
      ...empty,
      ...rec,
      legacyExercises: rec.legacyExercises ?? {},
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      backupVersion: BACKUP_VERSION,
    };
  }

  const exercises: ProgressRecord["exercises"] = {};
  const legacyExercises: NonNullable<ProgressRecord["legacyExercises"]> = {
    ...(rec.legacyExercises ?? {}),
  };

  for (const [bareOrUid, entry] of Object.entries(rec.exercises ?? {})) {
    // If the key already looks like a composite uid, keep it as-is.
    if (bareOrUid.includes(":")) {
      exercises[bareOrUid] = entry;
      continue;
    }
    const uid = uniqueUidForBareId(bareOrUid);
    if (uid) {
      exercises[uid] = entry;
    } else {
      // Ambiguous or unknown bare id: cannot attribute to a single exercise.
      legacyExercises[bareOrUid] = {
        attempts: entry.attempts,
        solved: entry.solved,
        note:
          "Migrated from an older version where this exercise id was reused " +
          "across lessons/patterns (or is no longer in the curriculum); it " +
          "cannot be reliably attributed to one exercise, so it is preserved " +
          "here rather than marking any current exercise solved.",
      };
    }
  }

  return {
    ...empty,
    lessons: rec.lessons ?? {},
    exercises,
    legacyExercises,
    drafts: rec.drafts ?? {},
    preferences: rec.preferences ?? {},
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    backupVersion: BACKUP_VERSION,
  };
}

// ---------------------------------------------------------------------------
// Read / transactional write
// ---------------------------------------------------------------------------

export async function loadProgress(): Promise<ProgressRecord> {
  const d = await db();
  const rec = (await d.get(STORE, KEY)) as ProgressRecord | undefined;
  if (!rec) return { ...empty };
  // Migrate on read so any v1 record is upgraded in memory; the next write
  // persists the v2 shape. Pass the RAW record (do NOT pre-seed schemaVersion,
  // or migration would think a v1 record is already current).
  return migrateProgress(rec);
}

/**
 * Atomically read-modify-write the singleton progress record in ONE
 * transaction, so concurrent updates cannot lose an attempt (R3.4). The mutator
 * receives the current (migrated) record and returns the next one.
 */
async function updateProgress(
  mutate: (rec: ProgressRecord) => ProgressRecord,
): Promise<ProgressRecord> {
  const d = await db();
  const tx = d.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  const current = (await store.get(KEY)) as ProgressRecord | undefined;
  const base = current ? migrateProgress(current) : { ...empty };
  const next = mutate(base);
  await store.put(next, KEY);
  await tx.done;
  return next;
}

export async function saveProgress(rec: ProgressRecord): Promise<void> {
  await updateProgress(() => ({ ...rec, schemaVersion: PROGRESS_SCHEMA_VERSION, backupVersion: BACKUP_VERSION }));
}

export async function markLessonViewed(id: string): Promise<void> {
  await updateProgress((rec) => {
    rec.lessons[id] = {
      completed: rec.lessons[id]?.completed ?? false,
      lastViewedAt: new Date().toISOString(),
    };
    return rec;
  });
}

export async function markLessonCompleted(id: string): Promise<void> {
  await updateProgress((rec) => {
    rec.lessons[id] = { completed: true, lastViewedAt: new Date().toISOString() };
    return rec;
  });
}

/**
 * Record an attempt at an exercise; `solved` marks it complete (sticky).
 * `uid` MUST be the globally unique composite id from `exerciseUid(...)`.
 */
export async function recordExerciseAttempt(uid: string, solved: boolean): Promise<void> {
  await updateProgress((rec) => {
    const prev = rec.exercises[uid] ?? { attempts: 0, solved: false };
    rec.exercises[uid] = {
      attempts: prev.attempts + 1,
      solved: prev.solved || solved,
    };
    return rec;
  });
}

export type Draft = { source: string; savedAt: string };

export async function saveDraft(slot: string, source: string): Promise<Draft> {
  const draft: Draft = { source, savedAt: new Date().toISOString() };
  await updateProgress((rec) => {
    rec.drafts[slot] = draft;
    return rec;
  });
  return draft;
}

export async function loadDraft(slot: string): Promise<Draft | undefined> {
  const rec = await loadProgress();
  return rec.drafts[slot];
}

export async function setPreference(key: string, value: unknown): Promise<void> {
  await updateProgress((rec) => {
    rec.preferences[key] = value;
    return rec;
  });
}

// ---------------------------------------------------------------------------
// Versioned JSON backup / restore
// ---------------------------------------------------------------------------

/** The envelope written to a backup file. */
export interface BackupEnvelope {
  app: typeof APP_MARKER;
  backupVersion: number;
  exportedAt: string;
  data: ProgressRecord;
}

export async function exportBackup(): Promise<BackupEnvelope> {
  const data = await loadProgress(); // already migrated to v2
  return {
    app: APP_MARKER,
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export type ImportResult =
  | { ok: true; envelope: BackupEnvelope }
  | { ok: false; error: string };

/** The most recent pre-restore snapshot, if any (recovery aid). */
export async function loadPreRestoreSnapshot(): Promise<ProgressRecord | undefined> {
  const d = await db();
  return (await d.get(STORE, PRE_RESTORE_KEY)) as ProgressRecord | undefined;
}

/**
 * Parse, deeply validate, migrate, re-validate, snapshot, and only then replace
 * local data — transactionally. Any failure before the replace leaves the
 * existing live data intact (R3.4). Never executes stored source.
 */
export async function importBackup(text: string): Promise<ImportResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }

  // 1. Validate the envelope (version-tolerant: accepts v1 and v2).
  const validated = validateBackup(parsed);
  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  // 2. Migrate the record in memory to the current schema. Pass the RAW record
  // (do NOT pre-seed schemaVersion) so a v1 backup is actually migrated.
  const migrated = migrateProgress(validated.envelope.data as ProgressRecord);

  // 3. Re-validate the migrated result against the strict v2 schema.
  const strict = validateMigratedRecord(migrated);
  if (!strict.ok) {
    return { ok: false, error: `Migrated backup failed validation: ${strict.error}` };
  }

  // 4-6. Snapshot the current live data, then replace it — all transactionally.
  const d = await db();
  const tx = d.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  const current = (await store.get(KEY)) as ProgressRecord | undefined;
  if (current) await store.put(current, PRE_RESTORE_KEY);
  await store.put(migrated, KEY);
  await tx.done;

  return {
    ok: true,
    envelope: { ...validated.envelope, data: migrated } as BackupEnvelope,
  };
}

/** Summary counts for the progress dashboard. */
export async function progressSummary(): Promise<{
  lessonsViewed: number;
  lessonsCompleted: number;
  exercisesAttempted: number;
  exercisesSolved: number;
  drafts: number;
}> {
  const rec = await loadProgress();
  const ex = Object.values(rec.exercises);
  return {
    lessonsViewed: Object.keys(rec.lessons).length,
    lessonsCompleted: Object.values(rec.lessons).filter((l) => l.completed).length,
    exercisesAttempted: ex.length,
    exercisesSolved: ex.filter((e) => e.solved).length,
    drafts: Object.keys(rec.drafts).length,
  };
}
