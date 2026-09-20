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

// ---------------------------------------------------------------------------
// Collision policy (R3.1 amendment): when a bare id and its composite equivalent
// both exist, or an ambiguous bare id is already in legacyExercises, migration
// must MERGE without losing attempts or downgrading a solved exercise.
//
// Policy (deterministic, order-independent):
//   attempts := sum of both attempts (both are real attempts)
//   solved   := logical OR (sticky; never turn solved → unsolved)
// ---------------------------------------------------------------------------

function baseV1(exercises: Record<string, { attempts: number; solved: boolean }>): ProgressRecord {
  return {
    lessons: {},
    exercises,
    drafts: {},
    preferences: {},
    backupVersion: 1,
  } as ProgressRecord;
}

describe("migrateProgress — collision: composite key + its unique bare equivalent", () => {
  const bare = findUniqueBareId();
  const uid = uniqueUidForBareId(bare)!;

  it("merges when the composite key is listed BEFORE the bare key", () => {
    const rec = baseV1({
      [uid]: { attempts: 2, solved: false },
      [bare]: { attempts: 3, solved: true },
    });
    const out = migrateProgress(rec);
    // Exactly one destination entry, no bare key left behind.
    expect(out.exercises[bare]).toBeUndefined();
    expect(out.exercises[uid]).toMatchObject({ attempts: 5, solved: true });
  });

  it("merges when the bare key is listed BEFORE the composite key (same result)", () => {
    const rec = baseV1({
      [bare]: { attempts: 3, solved: true },
      [uid]: { attempts: 2, solved: false },
    });
    const out = migrateProgress(rec);
    expect(out.exercises[bare]).toBeUndefined();
    expect(out.exercises[uid]).toMatchObject({ attempts: 5, solved: true });
  });

  it("never downgrades solved: composite solved=true, bare solved=false stays solved", () => {
    const rec = baseV1({
      [uid]: { attempts: 1, solved: true },
      [bare]: { attempts: 1, solved: false },
    });
    const out = migrateProgress(rec);
    expect(out.exercises[uid].solved).toBe(true);
    expect(out.exercises[uid].attempts).toBe(2);
  });

  it("is order-independent (both orders yield identical results)", () => {
    const a = migrateProgress(baseV1({ [uid]: { attempts: 2, solved: false }, [bare]: { attempts: 3, solved: true } }));
    const b = migrateProgress(baseV1({ [bare]: { attempts: 3, solved: true }, [uid]: { attempts: 2, solved: false } }));
    expect(a.exercises[uid]).toEqual(b.exercises[uid]);
  });
});

describe("migrateProgress — collision: ambiguous bare key already in legacyExercises", () => {
  it("merges the incoming ambiguous bare exercise with the existing legacy record", () => {
    // `ms-choose-1` is ambiguous; it is present BOTH in exercises (v1 bare) and
    // already in legacyExercises. Migration must merge, not overwrite.
    const rec = {
      lessons: {},
      exercises: { "ms-choose-1": { attempts: 4, solved: false } },
      legacyExercises: { "ms-choose-1": { attempts: 1, solved: true, note: "prior" } },
      drafts: {},
      preferences: {},
      backupVersion: 1,
    } as ProgressRecord;
    const out = migrateProgress(rec);
    expect(out.exercises["ms-choose-1"]).toBeUndefined();
    const legacy = out.legacyExercises?.["ms-choose-1"];
    expect(legacy).toBeTruthy();
    // attempts summed, solved OR'd (the prior solved:true must survive).
    expect(legacy?.attempts).toBe(5);
    expect(legacy?.solved).toBe(true);
    expect(typeof legacy?.note).toBe("string");
  });

  it("does not downgrade an existing solved legacy record when the incoming is unsolved", () => {
    const rec = {
      lessons: {},
      exercises: { "bfs-choose-1": { attempts: 2, solved: false } },
      legacyExercises: { "bfs-choose-1": { attempts: 0, solved: true, note: "prior" } },
      drafts: {},
      preferences: {},
      backupVersion: 1,
    } as ProgressRecord;
    const out = migrateProgress(rec);
    expect(out.legacyExercises?.["bfs-choose-1"]?.solved).toBe(true);
    expect(out.legacyExercises?.["bfs-choose-1"]?.attempts).toBe(2);
  });
});
