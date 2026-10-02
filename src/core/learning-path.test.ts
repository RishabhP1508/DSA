// @vitest-environment node
/**
 * R8.1 — learning-path recommendation + prerequisite-graph validation tests.
 */
import { describe, it, expect } from "vitest";
import {
  recommendNext,
  prerequisitesSatisfied,
  earliestUnfinishedPrerequisite,
  earliestEligibleUnfinished,
  validatePrerequisiteGraph,
  type LessonNode,
  type PathProgress,
} from "./learning-path";

const lessons: LessonNode[] = [
  { id: "a", title: "A", prerequisites: [] },
  { id: "b", title: "B", prerequisites: ["a"] },
  { id: "c", title: "C", prerequisites: ["b"] },
  { id: "d", title: "D", prerequisites: [] },
];

function progress(entries: Record<string, { completed: boolean; lastViewedAt?: string }>): PathProgress {
  return { lessons: entries };
}

describe("recommendNext", () => {
  it("recommends the earliest eligible unfinished lesson when nothing is viewed", () => {
    const r = recommendNext(lessons, progress({}));
    expect(r.kind).toBe("next");
    expect(r).toMatchObject({ lessonId: "a" });
  });

  it("resumes the last incomplete viewed lesson when its prerequisites are met", () => {
    const r = recommendNext(
      lessons,
      progress({
        a: { completed: true },
        b: { completed: false, lastViewedAt: "2026-09-21T10:00:00Z" },
      }),
    );
    expect(r).toMatchObject({ kind: "resume", lessonId: "b" });
  });

  it("recommends the earliest unfinished prerequisite when the resume target is blocked", () => {
    // Learner viewed c but hasn't done a or b.
    const r = recommendNext(
      lessons,
      progress({ c: { completed: false, lastViewedAt: "2026-09-21T10:00:00Z" } }),
    );
    expect(r).toMatchObject({ kind: "prerequisite", lessonId: "a" });
  });

  it("recommends review when every lesson is complete", () => {
    const r = recommendNext(
      lessons,
      progress({ a: { completed: true }, b: { completed: true }, c: { completed: true }, d: { completed: true } }),
    );
    expect(r.kind).toBe("review");
  });

  it("does not treat a viewed-but-not-completed lesson as done", () => {
    const r = recommendNext(lessons, progress({ a: { completed: false, lastViewedAt: "2026-09-21T09:00:00Z" } }));
    // 'a' has no prereqs, so resume it.
    expect(r).toMatchObject({ kind: "resume", lessonId: "a" });
  });
});

describe("prerequisite helpers", () => {
  it("prerequisitesSatisfied respects completion", () => {
    expect(prerequisitesSatisfied(lessons, progress({}), "b")).toBe(false);
    expect(prerequisitesSatisfied(lessons, progress({ a: { completed: true } }), "b")).toBe(true);
  });

  it("earliestUnfinishedPrerequisite descends to the deepest unmet prereq", () => {
    expect(earliestUnfinishedPrerequisite(lessons, progress({}), "c")).toBe("a");
    expect(earliestUnfinishedPrerequisite(lessons, progress({ a: { completed: true } }), "c")).toBe("b");
  });

  it("earliestEligibleUnfinished skips blocked lessons", () => {
    // a done -> b eligible; c still blocked by b.
    expect(earliestEligibleUnfinished(lessons, progress({ a: { completed: true } }), )).toBe("b");
  });
});

describe("validatePrerequisiteGraph", () => {
  it("passes a valid DAG", () => {
    expect(validatePrerequisiteGraph(lessons)).toEqual([]);
  });

  it("flags an unknown prerequisite id", () => {
    const bad: LessonNode[] = [{ id: "x", title: "X", prerequisites: ["nope"] }];
    expect(validatePrerequisiteGraph(bad)).toContain("lesson 'x' lists unknown prerequisite 'nope'");
  });

  it("flags a self-prerequisite", () => {
    const bad: LessonNode[] = [{ id: "x", title: "X", prerequisites: ["x"] }];
    const problems = validatePrerequisiteGraph(bad);
    expect(problems.some((p) => p.includes("itself as a prerequisite"))).toBe(true);
  });

  it("detects a cycle", () => {
    const cyc: LessonNode[] = [
      { id: "p", title: "P", prerequisites: ["q"] },
      { id: "q", title: "Q", prerequisites: ["p"] },
    ];
    const problems = validatePrerequisiteGraph(cyc);
    expect(problems.some((p) => p.includes("cycle"))).toBe(true);
  });
});
