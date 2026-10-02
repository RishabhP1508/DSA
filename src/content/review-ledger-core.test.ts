// @vitest-environment node
/**
 * R6 amendment — the review-ledger generator must NEVER grant semantic review to
 * a newly added item without an explicit human sign-off.
 *
 * These tests exercise the FULL generator → evidence-codemod decision path:
 *   - `ledgerEntryFor` is the pure core the generator uses to compute each entry;
 *   - `grantsSemanticReview` mirrors the codemod's rule (semanticReview:true iff
 *     the item's LIVE content hash equals the ledger entry's reviewedHash).
 * Together they assert the end-to-end outcome (reviewed vs pending) for unsigned
 * and signed new items, changed items, and unchanged items.
 */
import { describe, it, expect } from "vitest";
// @ts-expect-error - .mjs helper without types
import { ledgerEntryFor, assertIsoDate, UNREVIEWED_SENTINEL } from "../../scripts/lib/review-ledger-core.mjs";

/** Mirror of codemod_add_evidence.mjs: review granted ONLY on a hash match. */
function grantsSemanticReview(entry: { reviewedHash: string } | undefined, liveHash: string): boolean {
  return Boolean(entry) && entry!.reviewedHash === liveHash;
}

const SIGNOFF = "2026-09-22";
const item = { id: "new-topic" };

describe("ledgerEntryFor — a NEW item without sign-off stays pending", () => {
  it("records a sentinel hash (never equal to the live hash) when unsigned", () => {
    const liveHash = "abcdef0123456789";
    const entry = ledgerEntryFor("lesson", item, 1, liveHash, undefined, new Set(), SIGNOFF);
    expect(entry.reviewedHash).toBe(UNREVIEWED_SENTINEL);
    // End-to-end: the codemod would NOT grant semanticReview.
    expect(grantsSemanticReview(entry, liveHash)).toBe(false);
  });

  it("grants review ONLY when the new item is explicitly signed off", () => {
    const liveHash = "abcdef0123456789";
    const signed = ledgerEntryFor(
      "lesson",
      item,
      1,
      liveHash,
      undefined,
      new Set(["lesson:new-topic"]),
      SIGNOFF,
    );
    expect(signed.reviewedHash).toBe(liveHash);
    expect(signed.reviewedAt).toBe(SIGNOFF);
    expect(grantsSemanticReview(signed, liveHash)).toBe(true);
  });
});

describe("ledgerEntryFor — prior items", () => {
  it("preserves an unchanged prior item (still reviewed)", () => {
    const liveHash = "1111111111111111";
    const prior = { id: "new-topic", kind: "lesson", reviewedHash: "1111111111111111", reviewedAt: "2026-09-20", batch: 1 };
    const entry = ledgerEntryFor("lesson", item, 1, liveHash, prior, new Set(), SIGNOFF);
    expect(entry.reviewedHash).toBe("1111111111111111");
    expect(grantsSemanticReview(entry, liveHash)).toBe(true);
  });

  it("a CHANGED prior item reverts to pending (review cannot survive an edit)", () => {
    const liveHash = "2222222222222222"; // content changed since review
    const prior = { id: "new-topic", kind: "lesson", reviewedHash: "1111111111111111", reviewedAt: "2026-09-20", batch: 1 };
    const entry = ledgerEntryFor("lesson", item, 1, liveHash, prior, new Set(), SIGNOFF);
    expect(entry.reviewedHash).toBe("1111111111111111"); // keeps OLD hash
    expect(grantsSemanticReview(entry, liveHash)).toBe(false); // pending
  });
});

describe("assertIsoDate — the sign-off date is validated, not hard-coded", () => {
  it("accepts a real ISO date", () => {
    expect(assertIsoDate("2026-09-22")).toBe("2026-09-22");
  });
  it("rejects a non-date string", () => {
    expect(() => assertIsoDate("today")).toThrow();
    expect(() => assertIsoDate("2026/09/22")).toThrow();
  });
  it("rejects an impossible calendar date", () => {
    expect(() => assertIsoDate("2026-13-40")).toThrow();
  });
});
