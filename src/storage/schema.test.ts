/**
 * R3.3: complete backup validation (Zod). Rejects malformed nested records;
 * accepts well-formed v1 and v2 envelopes; never executes stored source.
 */
import { describe, it, expect } from "vitest";
import { validateBackup, validateMigratedRecord, APP_MARKER, BACKUP_VERSION } from "./schema";

function envelope(data: unknown, over: Record<string, unknown> = {}) {
  return { app: APP_MARKER, backupVersion: BACKUP_VERSION, exportedAt: "2026-01-01T00:00:00.000Z", data, ...over };
}
function v2data(over: Record<string, unknown> = {}) {
  return {
    lessons: {},
    exercises: {},
    drafts: {},
    preferences: {},
    schemaVersion: 2,
    backupVersion: 2,
    ...over,
  };
}

describe("validateBackup — acceptance", () => {
  it("accepts a well-formed v2 backup", () => {
    expect(validateBackup(envelope(v2data())).ok).toBe(true);
  });
  it("accepts a v1 backup (bare keys, no schemaVersion)", () => {
    const v1 = { lessons: {}, exercises: { "ms-choose-1": { attempts: 1, solved: true } }, drafts: {}, preferences: {}, backupVersion: 1 };
    expect(validateBackup(envelope(v1, { backupVersion: 1 })).ok).toBe(true);
  });
});

describe("validateBackup — rejection of malformed nested records", () => {
  it("rejects a non-object top-level", () => {
    expect(validateBackup(null).ok).toBe(false);
    expect(validateBackup(42).ok).toBe(false);
  });
  it("rejects a missing/foreign app marker", () => {
    expect(validateBackup(envelope(v2data(), { app: "other-app" })).ok).toBe(false);
  });
  it("rejects a backupVersion newer than supported", () => {
    expect(validateBackup(envelope(v2data(), { backupVersion: BACKUP_VERSION + 1 })).ok).toBe(false);
  });
  it("rejects an ARRAY where an object map is required", () => {
    expect(validateBackup(envelope(v2data({ exercises: [] }))).ok).toBe(false);
    expect(validateBackup(envelope(v2data({ lessons: [] }))).ok).toBe(false);
  });
  it("rejects a non-boolean completed flag", () => {
    expect(validateBackup(envelope(v2data({ lessons: { x: { completed: "yes", lastViewedAt: "2026-01-01T00:00:00.000Z" } } }))).ok).toBe(false);
  });
  it("rejects an invalid timestamp", () => {
    expect(validateBackup(envelope(v2data({ lessons: { x: { completed: true, lastViewedAt: "not-a-date" } } }))).ok).toBe(false);
  });
  it("rejects a negative attempt count", () => {
    expect(validateBackup(envelope(v2data({ exercises: { x: { attempts: -1, solved: false } } }))).ok).toBe(false);
  });
  it("rejects a non-integer attempt count", () => {
    expect(validateBackup(envelope(v2data({ exercises: { x: { attempts: 1.5, solved: false } } }))).ok).toBe(false);
  });
  it("rejects a non-string draft source", () => {
    expect(validateBackup(envelope(v2data({ drafts: { s: { source: 123, savedAt: "2026-01-01T00:00:00.000Z" } } }))).ok).toBe(false);
  });
});

describe("validateMigratedRecord — strict v2", () => {
  it("accepts a valid migrated v2 record and rejects a v1-shaped one (missing schemaVersion)", () => {
    expect(validateMigratedRecord(v2data()).ok).toBe(true);
    const v1shape = { lessons: {}, exercises: {}, drafts: {}, preferences: {}, backupVersion: 1 };
    expect(validateMigratedRecord(v1shape).ok).toBe(false); // schemaVersion required at v2
  });
});

describe("validateBackup — does not execute stored source", () => {
  it("treats draft source purely as a string (no evaluation)", () => {
    // If source were evaluated this would throw; validation must just type-check.
    const data = v2data({ drafts: { s: { source: "raise Exception('boom')", savedAt: "2026-01-01T00:00:00.000Z" } } });
    const r = validateBackup(envelope(data));
    expect(r.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// R3.1 follow-up: version-aware validation (a v2 file must not carry bare keys)
// ---------------------------------------------------------------------------

// A genuine v1 envelope: backupVersion 1, no schemaVersion, bare exercise keys.
function v1envelope(exercises: Record<string, unknown>) {
  return {
    app: APP_MARKER,
    backupVersion: 1,
    exportedAt: "2026-01-01T00:00:00.000Z",
    data: { lessons: {}, exercises, drafts: {}, preferences: {}, backupVersion: 1 },
  };
}

describe("validateBackup — version-aware (v2 must use composite keys)", () => {
  it("REJECTS a v2 backup with a bare exercise key (the reported bug)", () => {
    const r = validateBackup(envelope(v2data({ exercises: { "ms-choose-1": { attempts: 1, solved: true } } })));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/composite|exercise key|lesson:|pattern:/i);
  });

  it("ACCEPTS a v2 backup with a valid composite key and preserves its data", () => {
    const data = v2data({ exercises: { "lesson:matrix-search:ms-choose-1": { attempts: 4, solved: true } } });
    const r = validateBackup(envelope(data));
    expect(r.ok).toBe(true);
    if (r.ok) {
      const ex = r.envelope.data.exercises["lesson:matrix-search:ms-choose-1"];
      expect(ex).toMatchObject({ attempts: 4, solved: true });
    }
  });

  it("ACCEPTS a v2 backup whose composite key is UNKNOWN to today's registry (curriculum drift)", () => {
    // Well-formed composite shape, but the ids need not exist now.
    const data = v2data({ exercises: { "lesson:removed-lesson:old-ex-9": { attempts: 2, solved: true } } });
    expect(validateBackup(envelope(data)).ok).toBe(true);
  });

  it("ACCEPTS bare keys in legacyExercises of a v2 backup (migration preserves ambiguous history)", () => {
    const data = v2data({
      exercises: {},
      legacyExercises: { "ms-choose-1": { attempts: 1, solved: true, note: "ambiguous" } },
    });
    expect(validateBackup(envelope(data)).ok).toBe(true);
  });

  it("ACCEPTS a genuine v1 backup with bare keys (still migratable)", () => {
    expect(validateBackup(v1envelope({ "ms-choose-1": { attempts: 1, solved: true } })).ok).toBe(true);
  });

  it("REJECTS an outer backupVersion 2 whose data.backupVersion is 1", () => {
    const r = validateBackup(envelope(v2data({ backupVersion: 1 })));
    expect(r.ok).toBe(false);
  });

  it("REJECTS an outer backupVersion 1 whose data claims schemaVersion 2", () => {
    const env = {
      app: APP_MARKER,
      backupVersion: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      data: { lessons: {}, exercises: {}, drafts: {}, preferences: {}, schemaVersion: 2, backupVersion: 1 },
    };
    expect(validateBackup(env).ok).toBe(false);
  });

  it("REJECTS a future schemaVersion this app cannot understand", () => {
    const r = validateBackup(envelope(v2data({ schemaVersion: 3 }), { backupVersion: BACKUP_VERSION }));
    expect(r.ok).toBe(false);
  });

  it("REJECTS a future backupVersion", () => {
    const r = validateBackup(envelope(v2data(), { backupVersion: BACKUP_VERSION + 1 }));
    expect(r.ok).toBe(false);
  });
});

describe("validateMigratedRecord — strict v2 requires composite keys + schemaVersion 2", () => {
  it("rejects a migrated record that still has a bare exercise key", () => {
    const rec = { lessons: {}, exercises: { "ms-choose-1": { attempts: 1, solved: true } }, legacyExercises: {}, drafts: {}, preferences: {}, schemaVersion: 2, backupVersion: 2 };
    expect(validateMigratedRecord(rec).ok).toBe(false);
  });
  it("accepts a migrated record with only composite keys", () => {
    const rec = { lessons: {}, exercises: { "pattern:sliding-window:sw-1": { attempts: 1, solved: true } }, legacyExercises: {}, drafts: {}, preferences: {}, schemaVersion: 2, backupVersion: 2 };
    expect(validateMigratedRecord(rec).ok).toBe(true);
  });
  it("rejects a wrong schemaVersion in the migrated record", () => {
    const rec = { lessons: {}, exercises: {}, legacyExercises: {}, drafts: {}, preferences: {}, schemaVersion: 1, backupVersion: 2 };
    expect(validateMigratedRecord(rec).ok).toBe(false);
  });
});
