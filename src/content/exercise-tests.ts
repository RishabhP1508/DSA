/**
 * R6 — authored runnable-exercise tests and recognition grading, kept in ONE
 * reviewable place and merged onto the exercises at registry build time (see
 * `attachExerciseData` below and its use in `registry.ts`).
 *
 * Why a side map instead of editing 136 content files: the tests and the
 * structured recognition data are cross-cutting R6 additions; centralising them
 * keeps them auditable and lets the verifier and the UI see identical objects.
 * The runnable signal in the UI is still `exercise.tests` (a non-empty string),
 * and recognition grading still reads `exercise.recognition` — this module just
 * supplies those fields.
 *
 * Test convention (matches the 3 pre-existing runnable exercises):
 *  - The snippet is appended after the learner's code: `${code}\n# tests\n${tests}`.
 *  - For a FUNCTION contract, the tests define any fixtures/helper classes, call
 *    the function, and `assert` on return values / invariants.
 *  - For a SCRIPT contract, the learner's top-level names are already in scope;
 *    the tests `assert` on the final variable(s), or capture the printed output.
 *  - A clean completion = pass; an `AssertionError` = fail; any other error =
 *    infra error. End with `print("OK")` for a positive signal (optional).
 *
 * Every entry here is machine-verified by `scripts/verify_exercise_tests.mjs`:
 * the model solution must pass, and the unfinished starter plus at least one
 * synthesised mistake variant must be rejected.
 */

import type { Exercise, PatternExercise, LessonDefinition, PatternDefinition } from "../core/types";
import { EXERCISE_TESTS, EXERCISE_RECOGNITION, EXERCISE_PRELUDE, EXERCISE_HINTS } from "./exercise-tests-data";

export { EXERCISE_TESTS, EXERCISE_RECOGNITION, EXERCISE_PRELUDE, EXERCISE_HINTS };

function uid(kind: "lesson" | "pattern", ownerId: string, exId: string): string {
  return `${kind}:${ownerId}:${exId}`;
}

function applyToExercise(
  ex: Exercise | PatternExercise,
  key: string,
): Exercise | PatternExercise {
  const tests = EXERCISE_TESTS[key];
  const recognition = EXERCISE_RECOGNITION[key];
  const preludeCode = EXERCISE_PRELUDE[key];
  const hints = EXERCISE_HINTS[key];
  if (!tests && !recognition && !preludeCode && !hints) return ex;
  return {
    ...ex,
    ...(tests ? { tests } : {}),
    ...(recognition ? { recognition } : {}),
    ...(preludeCode ? { preludeCode } : {}),
    ...(hints && hints.length ? { hints } : {}),
  };
}

/**
 * Returns copies of the lesson/pattern arrays with `tests` and `recognition`
 * merged onto the exercises that have authored data. Pure: does not mutate the
 * source definitions.
 */
export function attachExerciseData(
  lessons: LessonDefinition[],
  patterns: PatternDefinition[],
): { lessons: LessonDefinition[]; patterns: PatternDefinition[] } {
  const mappedLessons = lessons.map((l) => ({
    ...l,
    exercises: l.exercises.map((ex) => applyToExercise(ex, uid("lesson", l.id, ex.id))),
  }));
  const mappedPatterns = patterns.map((p) => ({
    ...p,
    exercises: p.exercises.map(
      (ex) => applyToExercise(ex, uid("pattern", p.id, ex.id)) as PatternExercise,
    ),
  }));
  return { lessons: mappedLessons, patterns: mappedPatterns };
}
