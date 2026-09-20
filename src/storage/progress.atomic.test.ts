/**
 * R3.4: atomic writes + safe restore, exercised against a real IndexedDB
 * (fake-indexeddb) in the jsdom environment.
 *
 * Written before the fix; fails on current progress.ts (read-modify-write
 * loses concurrent updates; importBackup replaces data with no pre-restore
 * snapshot and no migration/validation of the migrated result).
 */
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import {
  loadProgress,
  recordExerciseAttempt,
  exportBackup,
  importBackup,
  loadPreRestoreSnapshot,
  __closeDbForTests,
  BACKUP_VERSION,
} from "./progress";
import { exerciseUid } from "./exercise-id";

// Reset the IndexedDB between tests. Close the cached connection first so the
// delete is not blocked by the open handle.
beforeEach(async () => {
  await __closeDbForTests();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idb = indexedDB as any;
  await new Promise<void>((res) => {
    const req = idb.deleteDatabase("dsa-visual-lab");
    req.onsuccess = req.onerror = req.onblocked = () => res();
  });
});

const UID = exerciseUid("lesson", "matrix-search", "ms-choose-1");

describe("R3.4 — atomic writes (no lost updates)", () => {
  it("records every concurrent attempt (no lost-update race)", async () => {
    const N = 25;
    await Promise.all(Array.from({ length: N }, () => recordExerciseAttempt(UID, false)));
    const rec = await loadProgress();
    expect(rec.exercises[UID]?.attempts).toBe(N);
  });
});

describe("R3.4 — safe restore", () => {
  it("a restore that fails validation leaves live data intact", async () => {
    await recordExerciseAttempt(UID, true);
    const before = await loadProgress();
    // Malformed backup (negative attempts) must be rejected.
    const bad = JSON.stringify({
      app: "dsa-visual-lab",
      backupVersion: BACKUP_VERSION,
      exportedAt: "2026-01-01T00:00:00.000Z",
      data: { lessons: {}, exercises: { [UID]: { attempts: -5, solved: true } }, drafts: {}, preferences: {}, schemaVersion: 2, backupVersion: 2 },
    });
    const res = await importBackup(bad);
    expect(res.ok).toBe(false);
    const after = await loadProgress();
    expect(after.exercises[UID]?.attempts).toBe(before.exercises[UID]?.attempts);
    expect(after.exercises[UID]?.solved).toBe(true);
  });

  it("a successful restore replaces data and writes a recoverable pre-restore snapshot", async () => {
    await recordExerciseAttempt(UID, true); // live: solved
    const envelope = {
      app: "dsa-visual-lab",
      backupVersion: BACKUP_VERSION,
      exportedAt: "2026-02-02T00:00:00.000Z",
      data: {
        lessons: { "maps-sets": { completed: true, lastViewedAt: "2026-02-02T00:00:00.000Z" } },
        exercises: {},
        drafts: {},
        preferences: {},
        schemaVersion: 2,
        backupVersion: 2,
      },
    };
    const res = await importBackup(JSON.stringify(envelope));
    expect(res.ok).toBe(true);
    const after = await loadProgress();
    // Live exercise progress is replaced by the (empty) backup.
    expect(after.exercises[UID]).toBeUndefined();
    expect(after.lessons["maps-sets"].completed).toBe(true);
    // The pre-restore snapshot preserves what was there before.
    const snap = await loadPreRestoreSnapshot();
    expect(snap?.exercises[UID]?.solved).toBe(true);
  });

  it("round-trips export → import preserving supported data", async () => {
    await recordExerciseAttempt(UID, true);
    const env = await exportBackup();
    // Wipe then re-import.
    const res = await importBackup(JSON.stringify(env));
    expect(res.ok).toBe(true);
    const after = await loadProgress();
    expect(after.exercises[UID]?.solved).toBe(true);
  });

  it("a v1 backup (bare exercise keys) imports via migration", async () => {
    const v1 = {
      app: "dsa-visual-lab",
      backupVersion: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      data: {
        lessons: {},
        exercises: { "ms-choose-1": { attempts: 2, solved: true } }, // ambiguous → legacy
        drafts: {},
        preferences: {},
        backupVersion: 1,
      },
    };
    const res = await importBackup(JSON.stringify(v1));
    expect(res.ok).toBe(true);
    const after = await loadProgress();
    // Ambiguous id preserved in legacy section, not attributed to a twin.
    expect(after.legacyExercises?.["ms-choose-1"]?.solved).toBe(true);
    expect(after.exercises["ms-choose-1"]).toBeUndefined();
  });
});
