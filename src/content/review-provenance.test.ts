// @vitest-environment node
import { describe, expect, it } from "vitest";
// @ts-expect-error JavaScript core is shared with the CLI generator.
import { ledgerEntryFor, UNREVIEWED_SENTINEL } from "../../scripts/lib/review-ledger-core.mjs";

describe("explicitly delegated review provenance", () => {
  const item = { id: "example", evidence: { verifiedAt: "2026-10-10" } };
  const hash = "1234567890abcdef";
  const reviewer = { name: "Codex", kind: "delegated-agent" };

  it("records the delegated reviewer without representing it as a human review", () => {
    const entry = ledgerEntryFor("lesson", item, 2, hash, undefined, new Set(["lesson:example"]), "2026-10-10", reviewer);
    expect(entry).toMatchObject({ reviewedHash: hash, reviewer: "Codex", reviewerKind: "delegated-agent" });
  });

  it("preserves provenance on regeneration and leaves changed content stale", () => {
    const prior = { reviewedHash: hash, reviewedAt: "2026-10-10", reviewer: "Codex", reviewerKind: "delegated-agent" };
    const entry = ledgerEntryFor("lesson", item, 2, "changed", prior, new Set(), "unused");
    expect(entry).toMatchObject(prior);
    expect(entry.reviewedHash).not.toBe("changed");
  });

  it("delegation never silently signs an unreviewed item", () => {
    const entry = ledgerEntryFor("lesson", item, 2, hash, undefined, new Set(), "unused", reviewer);
    expect(entry.reviewedHash).toBe(UNREVIEWED_SENTINEL);
    expect(entry.reviewerKind).toBeUndefined();
  });

  it("rejects unsigned or invalid reviewer identities", () => {
    for (const invalid of [{ name: "", kind: "delegated-agent" }, { name: "Codex", kind: "automatic" }]) {
      expect(() => ledgerEntryFor("lesson", item, 2, hash, undefined, new Set(["lesson:example"]), "2026-10-10", invalid)).toThrow(/reviewer/);
    }
  });
});
