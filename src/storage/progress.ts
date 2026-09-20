/**
 * Local persistence via IndexedDB (idb) + versioned JSON backup/restore.
 *
 * Stores completion, exercise progress, drafts and preferences locally so the
 * app is fully offline and survives restarts. Backup/restore serialises the
 * whole record as versioned JSON and VALIDATES an import before it replaces the
 * live data (plan §7: "validation before replacing local data"). Progress
 * belongs to the current browser profile; backups move it between browsers or
 * machines.
 */

import { openDB, type IDBPDatabase } from "idb";
import type { ProgressRecord } from "../core/types";

const DB_NAME = "dsa-visual-lab";
const STORE = "progress";
const KEY = "singleton";
export const BACKUP_VERSION = 1;

const empty: ProgressRecord = {
  lessons: {},
  exercises: {},
  drafts: {},
  preferences: {},
  backupVersion: BACKUP_VERSION,
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function db(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE)) {
          database.createObjectStore(STORE);
        }
      },
    });
  }
  return dbPromise;
}

export async function loadProgress(): Promise<ProgressRecord> {
  const d = await db();
  const rec = (await d.get(STORE, KEY)) as ProgressRecord | undefined;
  // Merge with the empty shape so older/partial records gain new fields.
  return rec ? { ...empty, ...rec } : { ...empty };
}

export async function saveProgress(rec: ProgressRecord): Promise<void> {
  const d = await db();
  await d.put(STORE, rec, KEY);
}

export async function markLessonViewed(id: string): Promise<void> {
  const rec = await loadProgress();
  rec.lessons[id] = {
    completed: rec.lessons[id]?.completed ?? false,
    lastViewedAt: new Date().toISOString(),
  };
  await saveProgress(rec);
}

export async function markLessonCompleted(id: string): Promise<void> {
  const rec = await loadProgress();
  rec.lessons[id] = { completed: true, lastViewedAt: new Date().toISOString() };
  await saveProgress(rec);
}

/** Record an attempt at an exercise; `solved` marks it complete (sticky). */
export async function recordExerciseAttempt(id: string, solved: boolean): Promise<void> {
  const rec = await loadProgress();
  const prev = rec.exercises[id] ?? { attempts: 0, solved: false };
  rec.exercises[id] = {
    attempts: prev.attempts + 1,
    solved: prev.solved || solved,
  };
  await saveProgress(rec);
}

export type Draft = { source: string; savedAt: string };

export async function saveDraft(slot: string, source: string): Promise<Draft> {
  const rec = await loadProgress();
  const draft: Draft = { source, savedAt: new Date().toISOString() };
  rec.drafts[slot] = draft;
  await saveProgress(rec);
  return draft;
}

export async function loadDraft(slot: string): Promise<Draft | undefined> {
  const rec = await loadProgress();
  return rec.drafts[slot];
}

export async function setPreference(key: string, value: unknown): Promise<void> {
  const rec = await loadProgress();
  rec.preferences[key] = value;
  await saveProgress(rec);
}

// ---------------------------------------------------------------------------
// Versioned JSON backup / restore
// ---------------------------------------------------------------------------

/** The envelope written to a backup file. */
export interface BackupEnvelope {
  app: "dsa-visual-lab";
  backupVersion: number;
  exportedAt: string;
  data: ProgressRecord;
}

export async function exportBackup(): Promise<BackupEnvelope> {
  const data = await loadProgress();
  return {
    app: "dsa-visual-lab",
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export type ValidationResult =
  | { ok: true; envelope: BackupEnvelope }
  | { ok: false; error: string };

/**
 * Validate a parsed object as a backup envelope WITHOUT touching local data.
 * Restore only proceeds when this returns ok, so a malformed or foreign file
 * can never overwrite the learner's progress.
 */
export function validateBackup(parsed: unknown): ValidationResult {
  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, error: "Not a JSON object." };
  }
  const o = parsed as Record<string, unknown>;
  if (o.app !== "dsa-visual-lab") {
    return { ok: false, error: "Not a DSA Visual Lab backup (missing app marker)." };
  }
  if (typeof o.backupVersion !== "number") {
    return { ok: false, error: "Missing or invalid backupVersion." };
  }
  if (o.backupVersion > BACKUP_VERSION) {
    return {
      ok: false,
      error: `Backup version ${o.backupVersion} is newer than this app supports (${BACKUP_VERSION}). Update the app first.`,
    };
  }
  const data = o.data as Record<string, unknown> | undefined;
  if (typeof data !== "object" || data === null) {
    return { ok: false, error: "Missing progress data." };
  }
  for (const field of ["lessons", "exercises", "drafts", "preferences"]) {
    if (typeof data[field] !== "object" || data[field] === null) {
      return { ok: false, error: `Progress data is missing the '${field}' section.` };
    }
  }
  return { ok: true, envelope: o as unknown as BackupEnvelope };
}

/** Parse text, validate, and only then replace local data. Returns a result. */
export async function importBackup(text: string): Promise<ValidationResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }
  const result = validateBackup(parsed);
  if (!result.ok) return result;

  // Normalise through the empty shape so a valid-but-old backup gains any new
  // fields, and bump the stored version to the current one.
  const restored: ProgressRecord = {
    ...empty,
    ...result.envelope.data,
    backupVersion: BACKUP_VERSION,
  };
  await saveProgress(restored);
  return result;
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
