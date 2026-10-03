// @vitest-environment node
/**
 * R9 / B1 amendment — the evidence generator must stamp evidence with the ACTUAL
 * verification date, and must NOT bulk-redate items that did not change.
 *
 * Before the fix, `codemod_add_evidence.mjs` wrote a hard-coded `verifiedAt`
 * ("2026-09-21") to EVERY item on every run — so (a) freshly recorded evidence
 * carried a stale date, and (b) regenerating after editing one lesson re-dated
 * all 160 items. These tests pin the corrected behaviour via the pure helpers in
 * `scripts/lib/evidence-date.mjs`:
 *   - resolveToday() returns the real current date (or a validated pinned date),
 *     never a hard-coded constant;
 *   - verifiedAtFor() keeps the prior date when the content hash is unchanged and
 *     stamps TODAY only for new or content-changed items.
 */
import { describe, it, expect } from "vitest";
// @ts-expect-error - .mjs helper without types
import { resolveToday, verifiedAtFor, assertIsoDate } from "../../scripts/lib/evidence-date.mjs";

describe("evidence-date — resolveToday", () => {
  it("returns the real current date (ISO YYYY-MM-DD) when nothing is pinned", () => {
    const expected = new Date().toISOString().slice(0, 10);
    expect(resolveToday()).toBe(expected);
    expect(resolveToday("")).toBe(expected); // empty env treated as unset
  });

  it("is NOT the old hard-coded constant", () => {
    expect(resolveToday()).not.toBe("2026-09-21");
  });

  it("honours a validated pinned date (e.g. from VERIFIED_DATE)", () => {
    expect(resolveToday("2026-10-02")).toBe("2026-10-02");
  });

  it("rejects a non-ISO or impossible pinned date", () => {
    expect(() => resolveToday("10/02/2026")).toThrow();
    expect(() => resolveToday("2026-13-40")).toThrow();
    expect(() => assertIsoDate("not-a-date")).toThrow();
  });

  it("resolves relative to an injectable clock", () => {
    expect(resolveToday(undefined, new Date("2027-01-15T12:00:00Z"))).toBe("2027-01-15");
  });
});

describe("evidence-date — verifiedAtFor (no bulk re-dating)", () => {
  const TODAY = "2026-10-02";

  it("stamps TODAY for a brand-new item (no prior evidence)", () => {
    expect(verifiedAtFor(null, "abc123", TODAY)).toBe(TODAY);
  });

  it("stamps TODAY when the content hash CHANGED", () => {
    const prior = { contentHash: "oldhash", verifiedAt: "2026-09-20" };
    expect(verifiedAtFor(prior, "newhash", TODAY)).toBe(TODAY);
  });

  it("KEEPS the prior date when the content hash is UNCHANGED", () => {
    const prior = { contentHash: "samehash", verifiedAt: "2026-09-20" };
    // An untouched item must not be re-dated just because the generator ran.
    expect(verifiedAtFor(prior, "samehash", TODAY)).toBe("2026-09-20");
    expect(verifiedAtFor(prior, "samehash", TODAY)).not.toBe(TODAY);
  });

  it("stamps TODAY if the hash matches but a prior date is missing", () => {
    const prior = { contentHash: "samehash", verifiedAt: null };
    expect(verifiedAtFor(prior, "samehash", TODAY)).toBe(TODAY);
  });
});
