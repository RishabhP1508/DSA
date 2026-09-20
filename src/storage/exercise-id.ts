/**
 * Globally unique exercise identity (R3.1 / R3-A).
 *
 * The audited bug: several exercises share a bare `exercise.id` across different
 * owners (e.g. `ms-choose-1` exists in BOTH the `matrix-search` and `maps-sets`
 * lessons), and progress was keyed on that bare id — so solving one silently
 * marked its twin solved.
 *
 * The fix is a composite id: `<ownerKind>:<ownerId>:<exerciseId>`, e.g.
 * `lesson:matrix-search:ms-choose-1`. This module is the single source of truth
 * for that identity and for which bare ids are AMBIGUOUS (reused across owners),
 * which the v1→v2 migration needs to avoid attributing progress incorrectly.
 */

import { lessons, patterns } from "../content/registry";

export type OwnerKind = "lesson" | "pattern";

/** The globally unique id for an exercise under a specific owner. */
export function exerciseUid(ownerKind: OwnerKind, ownerId: string, exerciseId: string): string {
  return `${ownerKind}:${ownerId}:${exerciseId}`;
}

/**
 * Map of bare exercise id → the composite uids that use it. Built once from the
 * real registry. A bare id used by more than one owner is AMBIGUOUS: a v1
 * progress record keyed on it cannot be attributed to a single exercise.
 */
export const EXERCISE_ID_INDEX: ReadonlyMap<string, readonly string[]> = (() => {
  const index = new Map<string, string[]>();
  const add = (ownerKind: OwnerKind, ownerId: string, exId: string) => {
    const uid = exerciseUid(ownerKind, ownerId, exId);
    const arr = index.get(exId) ?? [];
    if (!arr.includes(uid)) arr.push(uid);
    index.set(exId, arr);
  };
  for (const l of lessons) for (const ex of l.exercises ?? []) add("lesson", l.id, ex.id);
  for (const p of patterns) for (const ex of p.exercises ?? []) add("pattern", p.id, ex.id);
  return index;
})();

/** True when a bare exercise id is used by more than one owner (ambiguous). */
export function isAmbiguousBareId(bareId: string): boolean {
  return (EXERCISE_ID_INDEX.get(bareId)?.length ?? 0) > 1;
}

/**
 * Resolve a bare id to its single composite uid when unambiguous; returns null
 * when the bare id is ambiguous OR unknown to the registry (both cases the
 * migration must NOT auto-attribute).
 */
export function uniqueUidForBareId(bareId: string): string | null {
  const uids = EXERCISE_ID_INDEX.get(bareId);
  if (!uids || uids.length !== 1) return null;
  return uids[0];
}
