// @vitest-environment node
import { describe, it, expect } from "vitest";
import { coverage, coverageStats, COVERAGE_VERSION } from "./coverage";

describe("coverageStats", () => {
  it("counts total/verified/authored consistently", () => {
    const s = coverageStats(coverage);
    expect(s.total).toBe(coverage.length);
    expect(s.verified).toBe(coverage.filter((c) => c.status === "verified").length);
    expect(s.remaining).toBe(s.total - s.verified - s.authored);
    expect(s.total).toBeGreaterThan(0);
  });

  it("every coverage entry has a unique id", () => {
    const ids = coverage.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("COVERAGE_VERSION is a positive integer", () => {
    expect(Number.isInteger(COVERAGE_VERSION)).toBe(true);
    expect(COVERAGE_VERSION).toBeGreaterThan(0);
  });

  it("R5.6 — every external-practice entry has a name and a canonical LeetCode URL", () => {
    const mapped = coverage.filter((c) => c.externalPractice && c.externalPractice.length);
    // R5.6: the empty-mapping gap is closed for the covered techniques.
    expect(mapped.length).toBeGreaterThan(0);
    for (const c of mapped) {
      for (const q of c.externalPractice!) {
        expect(q.name, `entry ${c.id} question name`).toBeTruthy();
        // canonical LeetCode problem slug — no fabricated/ad-hoc links.
        expect(q.url, `entry ${c.id} url ${q.url}`).toMatch(
          /^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/$/,
        );
      }
    }
  });

  it("R5.6 — external practice points at a subtopic that has a lesson (technique is taught locally)", () => {
    for (const c of coverage) {
      if (c.externalPractice && c.externalPractice.length) {
        expect(c.lessonId, `entry ${c.id} must teach the technique locally`).toBeTruthy();
      }
    }
  });
});
