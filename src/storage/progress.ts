/**
 * Local progress persistence via IndexedDB (idb).
 *
 * Stores completion, exercise progress, drafts and preferences locally so the
 * app is fully offline. Phase 4 adds versioned JSON backup/restore on top of
 * this store; the schema is versioned via `backupVersion` for that purpose.
 */

import { openDB, type IDBPDatabase } from "idb";
import type { ProgressRecord } from "../core/types";

const DB_NAME = "dsa-visual-lab";
const STORE = "progress";
const KEY = "singleton";
const BACKUP_VERSION = 1;

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
  return rec ?? { ...empty };
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
