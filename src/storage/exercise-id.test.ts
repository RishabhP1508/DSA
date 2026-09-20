/**
 * R3-A: exercise identity must be globally unique across the real registry.
 */
import { describe, it, expect } from "vitest";
import { lessons, patterns } from "../content/registry";
import { exerciseUid, EXERCISE_ID_INDEX, isAmbiguousBareId, uniqueUidForBareId } from "./exercise-id";

function allComposite(): string[] {
  const out: string[] = [];
  for (const l of lessons) for (const ex of l.exercises ?? []) out.push(exerciseUid("lesson", l.id, ex.id));
  for (const p of patterns) for (const ex of p.exercises ?? []) out.push(exerciseUid("pattern", p.id, ex.id));
  return out;
}

describe("exercise-id — global uniqueness", () => {
  it("every exercise has a unique composite id across all owners", () => {
    const ids = allComposite();
    const unique = new Set(ids);
    expect(ids.length).toBeGreaterThan(0);
    expect(unique.size).toBe(ids.length); // no collisions
  });

  it("matches the known count (383 exercises)", () => {
    // 381 at the R5 baseline + 2 added by the R5 amendment's heap-sift lesson
    // (sift-predict-1, sift-choose-1).
    expect(allComposite().length).toBe(383);
  });

  it("flags exactly the four known ambiguous bare ids", () => {
    const ambiguous = [...EXERCISE_ID_INDEX.entries()]
      .filter(([, uids]) => uids.length > 1)
      .map(([bare]) => bare)
      .sort();
    expect(ambiguous).toEqual(["bfs-choose-1", "expr-choose-1", "ms-choose-1", "ms-complete-1"].sort());
    for (const bare of ambiguous) expect(isAmbiguousBareId(bare)).toBe(true);
  });

  it("resolves an unambiguous bare id to its single composite uid; null for ambiguous/unknown", () => {
    // A unique bare id resolves.
    const uniqueBare = [...EXERCISE_ID_INDEX.entries()].find(([, uids]) => uids.length === 1)?.[0];
    expect(uniqueBare).toBeTruthy();
    expect(uniqueUidForBareId(uniqueBare!)).toContain(":");
    // Ambiguous → null.
    expect(uniqueUidForBareId("ms-choose-1")).toBeNull();
    // Unknown → null.
    expect(uniqueUidForBareId("does-not-exist-xyz")).toBeNull();
  });

  it("composite id format is ownerKind:ownerId:exerciseId", () => {
    expect(exerciseUid("lesson", "matrix-search", "ms-choose-1")).toBe("lesson:matrix-search:ms-choose-1");
  });
});
