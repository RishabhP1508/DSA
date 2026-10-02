/**
 * R8.1 — progress-driven learning-path recommendations.
 *
 * Pure functions over the lesson list and a lightweight progress view, so they
 * are unit-testable without IndexedDB or the DOM. The prerequisite graph is
 * validated separately (scripts/verify_lessons.mjs rejects missing prereq ids
 * and cycles); these functions assume a valid graph but degrade safely.
 *
 * Recommendation order (plan §3 / requirement R8.1):
 *   1. Resume the last incomplete lesson WHEN its prerequisites are satisfied.
 *   2. Otherwise recommend its earliest unfinished prerequisite.
 *   3. Otherwise recommend the earliest eligible unfinished lesson (all
 *      prerequisites complete), in curriculum order.
 *   4. Otherwise (every lesson complete) recommend review / mixed practice.
 *
 * Viewing a lesson never marks it complete; completion is an explicit action
 * (markLessonCompleted). Free browsing is always allowed — this only drives the
 * "Continue learning" suggestion.
 */

export interface LessonNode {
  id: string;
  title: string;
  prerequisites: string[];
}

/** The slice of progress the path logic needs. */
export interface PathProgress {
  /** Lesson id -> { completed, lastViewedAt? }. */
  lessons: Record<string, { completed: boolean; lastViewedAt?: string }>;
}

export type Recommendation =
  | { kind: "resume"; lessonId: string; reason: string }
  | { kind: "prerequisite"; lessonId: string; reason: string }
  | { kind: "next"; lessonId: string; reason: string }
  | { kind: "review"; reason: string };

function isComplete(p: PathProgress, id: string): boolean {
  return Boolean(p.lessons[id]?.completed);
}

/** All prerequisites of `id` are complete. */
export function prerequisitesSatisfied(
  lessons: LessonNode[],
  p: PathProgress,
  id: string,
): boolean {
  const node = lessons.find((l) => l.id === id);
  if (!node) return false;
  return node.prerequisites.every((pre) => isComplete(p, pre));
}

/** The earliest (curriculum-order) unfinished prerequisite of `id`, if any. */
export function earliestUnfinishedPrerequisite(
  lessons: LessonNode[],
  p: PathProgress,
  id: string,
): string | null {
  const node = lessons.find((l) => l.id === id);
  if (!node) return null;
  // Walk prerequisites in curriculum order, descending into THEIR unfinished
  // prerequisites first so we recommend something the learner can actually do.
  for (const l of lessons) {
    if (!node.prerequisites.includes(l.id)) continue;
    if (isComplete(p, l.id)) continue;
    // If this prereq itself has an unfinished prereq, recurse to the deepest.
    const deeper = earliestUnfinishedPrerequisite(lessons, p, l.id);
    return deeper ?? l.id;
  }
  return null;
}

/** The last incomplete lesson the learner viewed (most recent lastViewedAt). */
export function lastIncompleteViewed(
  lessons: LessonNode[],
  p: PathProgress,
): string | null {
  let best: { id: string; at: string } | null = null;
  for (const l of lessons) {
    const rec = p.lessons[l.id];
    if (!rec || rec.completed || !rec.lastViewedAt) continue;
    if (!best || rec.lastViewedAt > best.at) best = { id: l.id, at: rec.lastViewedAt };
  }
  return best?.id ?? null;
}

/** The earliest eligible unfinished lesson (all prereqs complete), in order. */
export function earliestEligibleUnfinished(
  lessons: LessonNode[],
  p: PathProgress,
): string | null {
  for (const l of lessons) {
    if (isComplete(p, l.id)) continue;
    if (prerequisitesSatisfied(lessons, p, l.id)) return l.id;
  }
  return null;
}

/** Compute the next recommendation (the "Continue learning" target). */
export function recommendNext(lessons: LessonNode[], p: PathProgress): Recommendation {
  if (lessons.length === 0) {
    return { kind: "review", reason: "No lessons are available yet." };
  }

  // 1. Resume the last incomplete viewed lesson if its prerequisites are met.
  const resume = lastIncompleteViewed(lessons, p);
  if (resume && prerequisitesSatisfied(lessons, p, resume)) {
    const title = lessons.find((l) => l.id === resume)?.title ?? resume;
    return {
      kind: "resume",
      lessonId: resume,
      reason: `Pick up where you left off: “${title}”.`,
    };
  }

  // 2. If the resume target is blocked, recommend its earliest unfinished prereq.
  if (resume) {
    const pre = earliestUnfinishedPrerequisite(lessons, p, resume);
    if (pre) {
      const title = lessons.find((l) => l.id === pre)?.title ?? pre;
      return {
        kind: "prerequisite",
        lessonId: pre,
        reason: `Finish the prerequisite “${title}” before resuming.`,
      };
    }
  }

  // 3. Otherwise the earliest eligible unfinished lesson in curriculum order.
  const next = earliestEligibleUnfinished(lessons, p);
  if (next) {
    const title = lessons.find((l) => l.id === next)?.title ?? next;
    return { kind: "next", lessonId: next, reason: `Start the next lesson: “${title}”.` };
  }

  // 4. Everything is complete.
  return {
    kind: "review",
    reason: "You've completed every lesson — review a topic or try mixed practice.",
  };
}

/**
 * Validate a prerequisite graph: every prerequisite id must exist, and there
 * must be no cycle. Returns a list of problems (empty = valid). Used by the
 * curriculum verifier (R8.1 "reject missing prerequisite IDs and cycles").
 */
export function validatePrerequisiteGraph(lessons: LessonNode[]): string[] {
  const problems: string[] = [];
  const ids = new Set(lessons.map((l) => l.id));

  for (const l of lessons) {
    for (const pre of l.prerequisites) {
      if (!ids.has(pre)) {
        problems.push(`lesson '${l.id}' lists unknown prerequisite '${pre}'`);
      }
      if (pre === l.id) {
        problems.push(`lesson '${l.id}' lists itself as a prerequisite`);
      }
    }
  }

  // Cycle detection via DFS over known edges.
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const state = new Map<string, 0 | 1 | 2>(); // 0 unseen, 1 in-stack, 2 done
  const stack: string[] = [];
  function visit(id: string): void {
    const s = state.get(id) ?? 0;
    if (s === 2) return;
    if (s === 1) {
      const from = stack.indexOf(id);
      problems.push(`prerequisite cycle: ${[...stack.slice(from), id].join(" -> ")}`);
      return;
    }
    state.set(id, 1);
    stack.push(id);
    for (const pre of byId.get(id)?.prerequisites ?? []) {
      if (byId.has(pre)) visit(pre);
    }
    stack.pop();
    state.set(id, 2);
  }
  for (const l of lessons) visit(l.id);

  // De-duplicate cycle reports (DFS can report the same cycle from several entries).
  return [...new Set(problems)];
}
