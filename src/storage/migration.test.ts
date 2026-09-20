/**
 * R3.2: v1 → v2 progress migration.
 *
 * Written before the fix; fails on current progress.ts (no `migrateProgress`,
 * no schema v2, no legacyExercises). A v1 record keyed on bare exercise ids
 * must migrate: unambiguous ids move to their composite uid; the four ambiguous
 * ids move to a legacy-ambiguity section (never solved on both, never
 * discarded); drafts and lesson history survive; migration is idempotent.
 */
import { describe, it, expect } from "vitest";
import { migrateProgress, PROGRESS_SCHEMA_VERSION } from "./progress";
import { uniqueUidForBareId, EXERCISE_ID_INDEX } from "./exercise-id";
import type { ProgressRecord } from "../core/types";

/** A representative v1 record (no schemaVersion; exercises keyed by bare id). */
function v1(): ProgressRecord {
  // Pick a real unambiguous bare id from the registry for the happy path.
  // `array-traversal` lesson exercises use ids like `at-...`; use a resolvable one.
  return {
    lessons: { "matrix-search": { completed: true, lastViewedAt: "2026-01-01T00:00:00.000Z" } },
    exercises: {
      // Ambiguous (matrix-search & maps-sets): must NOT be auto-attributed.
      "ms-choose-1": { attempts: 3, solved: true },
      "ms-complete-1": { attempts: 1, solved: false },
      "bfs-choose-1": { attempts: 2, solved: true },
      "expr-choose-1": { attempts: 5, solved: true },
    },
    drafts: { playground: { source: "print(1)", savedAt: "2026-01-02T00:00:00.000Z" } },
    preferences: { theme: "dark" },
    backupVersion: 1,
  } as ProgressRecord;
}

describe("migrateProgress — v1 → v2", () => {
  it("moves the four ambiguous bare ids to legacyExercises without attributing to a twin", () => {
    const out = migrateProgress(v1());
    expect(out.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
    // None of the ambiguous ids are copied into the composite `exercises` map.
    for (const bare of ["ms-choose-1", "ms-complete-1", "bfs-choose-1", "expr-choose-1"]) {
      expect(out.exercises[bare]).toBeUndefined();
      // No composite uid was fabricated for either twin.
      const anyComposite = Object.keys(out.exercises).some((k) => k.endsWith(`:${bare}`));
      expect(anyComposite).toBe(false);
      // The original record is preserved verbatim in legacyExercises with a note.
      expect(out.legacyExercises?.[bare]).toBeTruthy();
      expect(typeof out.legacyExercises?.[bare]?.note).toBe("string");
    }
    // Original solved/attempts preserved (not lost, not duplicated).
    expect(out.legacyExercises?.["ms-choose-1"]).toMatchObject({ attempts: 3, solved: true });
  });

  it("migrates an unambiguous bare id to its composite uid", () => {
    const uniqueBare = "matrix-search"; // not an exercise id; use a real unique one instead
    // Find a real unambiguous exercise bare id to migrate.
    const rec = v1();
    // add a known-unique exercise id
    const someUnique = findUniqueBareId();
    rec.exercises[someUnique] = { attempts: 2, solved: true };
    const out = migrateProgress(rec);
    const uid = uniqueUidForBareId(someUnique)!;
    expect(uid).toBeTruthy();
    expect(out.exercises[uid]).toMatchObject({ attempts: 2, solved: true });
    // The bare key is gone.
    expect(out.exercises[someUnique]).toBeUndefined();
    void uniqueBare;
  });

  it("preserves drafts and lesson history", () => {
    const out = migrateProgress(v1());
    expect(out.drafts.playground.source).toBe("print(1)");
    expect(out.lessons["matrix-search"].completed).toBe(true);
    expect(out.preferences.theme).toBe("dark");
  });

  it("is idempotent (running twice equals running once)", () => {
    const once = migrateProgress(v1());
    const twice = migrateProgress(once);
    expect(twice).toEqual(once);
    expect(twice.schemaVersion).toBe(PROGRESS_SCHEMA_VERSION);
  });

  it("keeps an unknown bare id (not in the registry) in legacyExercises, never dropped", () => {
    const rec = v1();
    rec.exercises["totally-unknown-id"] = { attempts: 1, solved: false };
    const out = migrateProgress(rec);
    expect(out.exercises["totally-unknown-id"]).toBeUndefined();
    expect(out.legacyExercises?.["totally-unknown-id"]).toBeTruthy();
  });
});

// Helper: find a bare exercise id that maps to exactly one composite uid.
function findUniqueBareId(): string {
  for (const [bare, uids] of EXERCISE_ID_INDEX.entries()) {
    if (uids.length === 1) return bare;
  }
  throw new Error("no unique bare id found");
}
