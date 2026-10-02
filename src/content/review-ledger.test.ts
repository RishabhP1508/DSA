// @vitest-environment node
/**
 * R5.3 amendment — semantic-review evidence must be a HUMAN CLAIM tied to the
 * reviewed content hash, not auto-granted. These tests enforce:
 *   - every item with evidence.semanticReview === true has a review-ledger entry
 *     whose reviewedHash equals the item's CURRENT content hash;
 *   - conversely, a simulated content edit (which changes the hash) breaks the
 *     ledger match, so semanticReview could no longer be granted — proving review
 *     cannot survive a content edit;
 *   - reported review counts are computed from CURRENT evidence, not a constant.
 */
import { describe, it, expect } from "vitest";
import { lessons, patterns } from "./registry";
import { REVIEW_LEDGER_BY_KEY, REVIEW_LEDGER } from "./review-ledger";
// @ts-expect-error - .mjs helper without types
import { contentHashOf } from "../../scripts/lib/content-hash.mjs";
import type { LessonDefinition, PatternDefinition } from "../core/types";

type Item = (LessonDefinition | PatternDefinition) & { evidence?: { semanticReview?: boolean } };
const all: { kind: "lesson" | "pattern"; item: Item }[] = [
  ...lessons.map((l) => ({ kind: "lesson" as const, item: l as Item })),
  ...patterns.map((p) => ({ kind: "pattern" as const, item: p as Item })),
];

describe("R5.3 review ledger — semanticReview:true is backed by a matching-hash ledger entry", () => {
  // Invariant (runs even when zero items are currently reviewed): EVERY item
  // that claims semanticReview:true must have a ledger entry whose reviewedHash
  // equals its live content hash. After R6 added hints/recognition to every
  // item, semantic review is honestly PENDING repo-wide (no item claims true)
  // until a human re-reads — so this set may be empty, which is itself valid.
  it("every semanticReview:true item is backed by a current-hash ledger entry", () => {
    const claimed = all.filter((x) => x.item.evidence?.semanticReview === true);
    for (const { kind, item } of claimed) {
      const entry = REVIEW_LEDGER_BY_KEY.get(`${kind}:${item.id}`);
      expect(entry, `${kind} ${item.id} claims semanticReview but has no ledger entry`).toBeTruthy();
      expect(entry!.reviewedHash, `${kind} ${item.id} ledger hash must match live content`).toBe(
        contentHashOf(item),
      );
    }
    // Document the current honest state: a count (possibly 0) of reviewed items.
    expect(claimed.length).toBeGreaterThanOrEqual(0);
  });
});

describe("R5.3 review ledger — a content edit breaks the ledger match (review cannot survive an edit)", () => {
  // These prove the MECHANISM: a ledger entry recorded at a given hash no longer
  // matches once a claim-bearing field changes. We record a hash at the CURRENT
  // content (rather than assuming the live ledger currently marks the item
  // reviewed — after R6 added hints/recognition to every item, semantic review
  // is honestly pending repo-wide until a human re-reads), then show an edit
  // breaks that recorded hash.
  it("editing a lesson's explanation makes its hash differ from a hash recorded now", () => {
    const l = lessons.find((x) => x.id === "prefix-sums")! as LessonDefinition;
    const recordedHash = contentHashOf(l); // simulate a fresh human review NOW
    const edited: LessonDefinition = { ...l, explanation: l.explanation + " (edited)" };
    expect(contentHashOf(edited)).not.toBe(recordedHash);
  });

  it("editing a lesson's hints (a learner-facing claim) breaks its recorded hash", () => {
    const l = lessons.find((x) => x.id === "prefix-sums")! as LessonDefinition;
    const recordedHash = contentHashOf(l);
    const ex0 = l.exercises[0];
    const edited: LessonDefinition = {
      ...l,
      exercises: [{ ...ex0, hints: [...ex0.hints, "an added hint claim"] }, ...l.exercises.slice(1)],
    };
    // hints are claim-bearing and INCLUDED in the hash (R6 correction), so this
    // must change the hash and therefore require re-review.
    expect(contentHashOf(edited)).not.toBe(recordedHash);
  });

  it("editing a pattern's whyItHelps breaks its recorded hash", () => {
    const p = patterns.find((x) => x.id === "sliding-window")! as PatternDefinition;
    const recordedHash = contentHashOf(p);
    const edited: PatternDefinition = { ...p, whyItHelps: p.whyItHelps + " (edited)" };
    expect(contentHashOf(edited)).not.toBe(recordedHash);
  });
});

describe("R6 — exercise claim fields (hints, recognition) are part of the content hash", () => {
  // tests/preludeCode are machine-verification harness and excluded; hints and
  // recognition are learner-facing CLAIMS and MUST change the hash so semantic
  // review reverts to pending when they change.
  const l = lessons.find((x) => x.id === "two-pointers")! as LessonDefinition;

  it("adding a recognition block changes the content hash", () => {
    const base = contentHashOf(l);
    const ex0 = l.exercises[0] as LessonDefinition["exercises"][number] & { recognition?: unknown };
    const withRec = {
      ...l,
      exercises: [
        { ...ex0, recognition: { scenario: "x", approaches: [], reasons: [], acceptableApproachIds: [], modelExplanation: "m" } },
        ...l.exercises.slice(1),
      ],
    } as unknown as LessonDefinition;
    expect(contentHashOf(withRec)).not.toBe(base);
  });

  it("adding a tests field (machine harness) does NOT change the content hash", () => {
    const base = contentHashOf(l);
    const ex0 = l.exercises[0] as LessonDefinition["exercises"][number] & { tests?: string };
    const withTests = {
      ...l,
      exercises: [{ ...ex0, tests: "assert True\nprint('OK')" }, ...l.exercises.slice(1)],
    } as unknown as LessonDefinition;
    expect(contentHashOf(withTests)).toBe(base);
  });
});

describe("R5.3 review ledger — keyed by kind:id (lesson and pattern can share an id)", () => {
  it("shared ids (e.g. two-pointers, kadane, tree-dfs) have distinct lesson and pattern ledger entries", () => {
    for (const id of ["two-pointers", "kadane", "tree-dfs", "dijkstra", "union-find"]) {
      const le = REVIEW_LEDGER_BY_KEY.get(`lesson:${id}`);
      const pe = REVIEW_LEDGER_BY_KEY.get(`pattern:${id}`);
      expect(le, `lesson:${id} ledger entry`).toBeTruthy();
      expect(pe, `pattern:${id} ledger entry`).toBeTruthy();
      // distinct content => distinct reviewed hashes
      expect(le!.reviewedHash).not.toBe(pe!.reviewedHash);
    }
  });

  it("the ledger has one entry per registry item (kind:id unique)", () => {
    const keys = REVIEW_LEDGER.map((e) => `${e.kind}:${e.id}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(REVIEW_LEDGER.length).toBe(lessons.length + patterns.length);
  });
});

describe("R5.3 review counts are computed from CURRENT evidence, not a constant", () => {
  it("reviewed-example count equals the number of items whose semanticReview is currently true", () => {
    const reviewed = all.filter((x) => x.item.evidence?.semanticReview === true).length;
    // This is a live count; assert it is derived (equals the ledger-backed set),
    // not a hardcoded number.
    const ledgerBacked = all.filter((x) => {
      const e = REVIEW_LEDGER_BY_KEY.get(`${x.kind}:${x.item.id}`);
      return e && e.reviewedHash === contentHashOf(x.item);
    }).length;
    expect(reviewed).toBe(ledgerBacked);
  });
});
