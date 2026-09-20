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
