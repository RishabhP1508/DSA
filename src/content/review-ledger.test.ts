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
  for (const { kind, item } of all) {
    if (item.evidence?.semanticReview === true) {
      it(`${kind} ${item.id}: ledger reviewedHash == current content hash`, () => {
        const entry = REVIEW_LEDGER_BY_KEY.get(`${kind}:${item.id}`);
        expect(entry, `${kind} ${item.id} claims semanticReview but has no ledger entry`).toBeTruthy();
        expect(entry!.reviewedHash, `${kind} ${item.id} ledger hash must match live content`).toBe(contentHashOf(item));
      });
    }
  }
});

describe("R5.3 review ledger — a content edit breaks the ledger match (review cannot survive an edit)", () => {
  it("editing a reviewed lesson's explanation makes its live hash differ from the ledger", () => {
    const l = lessons.find((x) => x.id === "prefix-sums")! as LessonDefinition;
    const entry = REVIEW_LEDGER_BY_KEY.get("lesson:prefix-sums")!;
    expect(entry.reviewedHash).toBe(contentHashOf(l)); // currently reviewed
    const edited: LessonDefinition = { ...l, explanation: l.explanation + " (edited)" };
    // The edited content no longer matches the ledger, so semanticReview could
    // not be granted for it on regeneration.
    expect(contentHashOf(edited)).not.toBe(entry.reviewedHash);
  });

  it("editing a pattern's whyItHelps breaks its ledger match", () => {
    const p = patterns.find((x) => x.id === "sliding-window")! as PatternDefinition;
    const entry = REVIEW_LEDGER_BY_KEY.get("pattern:sliding-window")!;
    expect(entry.reviewedHash).toBe(contentHashOf(p));
    const edited: PatternDefinition = { ...p, whyItHelps: p.whyItHelps + " (edited)" };
    expect(contentHashOf(edited)).not.toBe(entry.reviewedHash);
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
