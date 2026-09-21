// @vitest-environment node
/**
 * R5.6 amendment — topic/subtopic projection must NOT leak across topics.
 *
 * The earlier derivation attached a question to ANY coverage entry whose
 * lesson/pattern id was among the question's mapped ids. Because some patterns
 * (sliding-window, two-pointers, prefix-sums-hashmap, matrix-traversal, ...) are
 * shared by coverage entries in DIFFERENT areas, this leaked questions across
 * main topics. These tests prove each Notion occurrence lands ONLY under a
 * coverage entry whose `area` matches the occurrence's main topic.
 */
import { describe, it, expect } from "vitest";
import { coverage } from "./coverage";
import { NOTION_PRACTICE, NOTION_TOPIC_TO_AREA } from "./notion-practice";

const entryById = new Map(coverage.map((c) => [c.id, c]));
const urlToEntryAreas = new Map<string, Set<string>>();
for (const c of coverage) {
  for (const q of c.externalPractice ?? []) {
    if (!urlToEntryAreas.has(q.url)) urlToEntryAreas.set(q.url, new Set());
    urlToEntryAreas.get(q.url)!.add(c.area);
  }
}

describe("R5.6 projection — every occurrence declares in-topic coverage ids", () => {
  it("every occurrence has at least one coverageId", () => {
    for (const r of NOTION_PRACTICE) {
      if (r.status === "mapped") {
        expect(r.coverageIds.length, `${r.mainTopic}/${r.title} has no coverageIds`).toBeGreaterThan(0);
      }
    }
  });

  it("every coverageId exists and its area matches the occurrence main topic", () => {
    for (const r of NOTION_PRACTICE) {
      const expectedArea = NOTION_TOPIC_TO_AREA[r.mainTopic];
      expect(expectedArea, `no area mapping for topic ${r.mainTopic}`).toBeTruthy();
      for (const cid of r.coverageIds) {
        const entry = entryById.get(cid);
        expect(entry, `${r.title}: coverageId "${cid}" not a real coverage entry`).toBeTruthy();
        expect(entry!.area, `${r.title}: coverageId "${cid}" area ${entry!.area} != topic area ${expectedArea}`).toBe(expectedArea);
      }
    }
  });
});

describe("R5.6 projection — concrete cross-topic leakage cases are fixed", () => {
  // A Strings-only sliding-window question must NOT appear under an Arrays entry,
  // and an Arrays-only two-pointer question must NOT appear under a Strings entry.
  it("Longest Substring Without Repeating Characters (Strings) does not surface under an Arrays coverage entry", () => {
    const areas = urlToEntryAreas.get("https://leetcode.com/problems/longest-substring-without-repeating-characters/") ?? new Set();
    expect(areas.has("Arrays")).toBe(false);
    expect(areas.has("Strings")).toBe(true);
  });

  it("Longest Repeating Character Replacement (Strings) does not surface under Arrays", () => {
    const areas = urlToEntryAreas.get("https://leetcode.com/problems/longest-repeating-character-replacement/") ?? new Set();
    expect(areas.has("Arrays")).toBe(false);
    expect(areas.has("Strings")).toBe(true);
  });

  it("3Sum (Arrays) does not surface under a Strings coverage entry", () => {
    const areas = urlToEntryAreas.get("https://leetcode.com/problems/3sum/") ?? new Set();
    expect(areas.has("Strings")).toBe(false);
    expect(areas.has("Arrays")).toBe(true);
  });

  it("Container With Most Water (Arrays) does not surface under Strings", () => {
    const areas = urlToEntryAreas.get("https://leetcode.com/problems/container-with-most-water/") ?? new Set();
    expect(areas.has("Strings")).toBe(false);
    expect(areas.has("Arrays")).toBe(true);
  });

  it("Product of Array Except Self (Arrays) does not surface under Hashing via prefix-sums-hashmap", () => {
    const areas = urlToEntryAreas.get("https://leetcode.com/problems/product-of-array-except-self/") ?? new Set();
    expect(areas.has("Hashing")).toBe(false);
    expect(areas.has("Arrays")).toBe(true);
  });

  it("cross-topic DUPLICATES still surface under BOTH their declared topics", () => {
    // Subarray Sum Equals K is listed under Arrays AND Hashing in the export.
    const areas = urlToEntryAreas.get("https://leetcode.com/problems/subarray-sum-equals-k/") ?? new Set();
    expect(areas.has("Arrays")).toBe(true);
    expect(areas.has("Hashing")).toBe(true);
    // Two Sum: Arrays AND Hashing.
    const twoSum = urlToEntryAreas.get("https://leetcode.com/problems/two-sum/") ?? new Set();
    expect(twoSum.has("Arrays")).toBe(true);
    expect(twoSum.has("Hashing")).toBe(true);
  });
});

describe("R5.6 projection — no coverage entry shows an out-of-area question", () => {
  it("every externalPractice url on an entry is declared for that entry's area by some occurrence", () => {
    // Build url -> allowed areas from the manifest's declared coverageIds.
    const urlAllowedAreas = new Map<string, Set<string>>();
    for (const r of NOTION_PRACTICE) {
      for (const cid of r.coverageIds) {
        const e = entryById.get(cid);
        if (!e) continue;
        if (!urlAllowedAreas.has(r.url)) urlAllowedAreas.set(r.url, new Set());
        urlAllowedAreas.get(r.url)!.add(e.area);
      }
    }
    for (const c of coverage) {
      for (const q of c.externalPractice ?? []) {
        const allowed = urlAllowedAreas.get(q.url);
        expect(allowed, `${q.url} on ${c.id} not declared anywhere`).toBeTruthy();
        expect(allowed!.has(c.area), `${q.url} surfaced under ${c.id} (${c.area}) but is not declared for that area`).toBe(true);
      }
    }
  });
});
