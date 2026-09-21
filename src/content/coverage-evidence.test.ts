// @vitest-environment node
/**
 * R5.7 — coverage status is evidence-based and self-invalidating.
 *
 * These tests prove that:
 *  1. every `verified` coverage entry maps to a lesson (and patterns) whose
 *     evidence is CURRENT (contentHash matches live) and COMPLETE (all six
 *     checks true, inventoryVersion == COVERAGE_VERSION);
 *  2. a content/source change to a lesson INVALIDATES its evidence — so an entry
 *     cannot stay "verified" after the content it was verified against changes.
 */
import { describe, it, expect } from "vitest";
import { coverage, COVERAGE_VERSION } from "./coverage";
import { lessons, patterns } from "./registry";
// @ts-expect-error - .mjs helper without types
import { contentHashOf } from "../../scripts/lib/content-hash.mjs";
import type { LessonDefinition, PatternDefinition } from "../core/types";

const lessonById = new Map(lessons.map((l) => [l.id, l]));
const patternById = new Map(patterns.map((p) => [p.id, p]));

/** The same aspect-check used by verify_coverage_evidence.mjs. */
function evidenceIsCurrentAndComplete(item: LessonDefinition | PatternDefinition): boolean {
  const ev = item.evidence;
  if (!ev) return false;
  if (ev.contentHash !== contentHashOf(item)) return false;
  if (ev.inventoryVersion !== COVERAGE_VERSION) return false;
  const c = ev.checks;
  const allChecks = c.content && c.implementation && c.visualization && c.exercise && c.complexity && c.references;
  const noUnresolved = !ev.unresolved || ev.unresolved.length === 0;
  return Boolean(allChecks && noUnresolved);
}

describe("R5.7 coverage evidence — every verified entry is backed by current evidence", () => {
  const verified = coverage.filter((c) => c.status === "verified");

  it("there is at least one verified entry", () => {
    expect(verified.length).toBeGreaterThan(0);
  });

  for (const entry of verified) {
    it(`${entry.id} — lesson + patterns have current, complete evidence`, () => {
      expect(entry.lessonId, `${entry.id} verified without a lessonId`).toBeTruthy();
      const lesson = lessonById.get(entry.lessonId!);
      expect(lesson, `${entry.id} lessonId not in registry`).toBeTruthy();
      expect(evidenceIsCurrentAndComplete(lesson!), `${entry.id} lesson evidence stale/incomplete`).toBe(true);
      for (const pid of entry.patternIds ?? []) {
        const p = patternById.get(pid);
        expect(p, `${entry.id} patternId ${pid} not in registry`).toBeTruthy();
        expect(evidenceIsCurrentAndComplete(p!), `${entry.id} pattern ${pid} evidence stale/incomplete`).toBe(true);
      }
    });
  }
});

describe("R5.7 coverage evidence — a content change cannot leave an entry falsely verified", () => {
  it("mutating a verified lesson's code invalidates its evidence hash", () => {
    const entry = coverage.find((c) => c.status === "verified" && c.lessonId);
    expect(entry).toBeTruthy();
    const lesson = lessonById.get(entry!.lessonId!)!;

    // Baseline: evidence is current.
    expect(evidenceIsCurrentAndComplete(lesson)).toBe(true);

    // Simulate a source/teaching-claim change WITHOUT re-recording evidence.
    const mutated: LessonDefinition = { ...lesson, code: lesson.code + "\nprint('changed')" };
    // The live hash now differs from the recorded evidence hash...
    expect(contentHashOf(mutated)).not.toBe(lesson.evidence!.contentHash);
    // ...so the evidence is no longer current => the entry is NOT verifiable.
    expect(evidenceIsCurrentAndComplete(mutated)).toBe(false);
  });

  it("mutating a code explanation also invalidates the evidence hash", () => {
    const entry = coverage.find((c) => c.status === "verified" && c.lessonId);
    const lesson = lessonById.get(entry!.lessonId!)!;
    const mutated: LessonDefinition = {
      ...lesson,
      codeExplanations: lesson.codeExplanations.map((ce, i) =>
        i === 0 ? { ...ce, explanation: ce.explanation + " (edited)" } : ce,
      ),
    };
    expect(contentHashOf(mutated)).not.toBe(lesson.evidence!.contentHash);
    expect(evidenceIsCurrentAndComplete(mutated)).toBe(false);
  });

  it("mutating the references invalidates the evidence hash", () => {
    const entry = coverage.find((c) => c.status === "verified" && c.lessonId);
    const lesson = lessonById.get(entry!.lessonId!)!;
    const mutated: LessonDefinition = {
      ...lesson,
      references: [...lesson.references, { url: "https://example.com/new", title: "x", topic: "x", purpose: "x", verifiedClaims: ["y"], accessDate: "2026-09-20" }],
    };
    expect(contentHashOf(mutated)).not.toBe(lesson.evidence!.contentHash);
    expect(evidenceIsCurrentAndComplete(mutated)).toBe(false);
  });
});
