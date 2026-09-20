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
});
