/**
 * Content registry. Later phases register additional lessons and patterns here;
 * the app reads only from these arrays so adding content never requires UI
 * changes.
 */

import type { LessonDefinition, PatternDefinition } from "../core/types";
import { variablesAndTypes } from "./lessons/variables-and-types";
import { linkedListTraversal } from "./lessons/linked-list-traversal";

export const lessons: LessonDefinition[] = [variablesAndTypes, linkedListTraversal];

export const patterns: PatternDefinition[] = [];

export function getLesson(id: string): LessonDefinition | undefined {
  return lessons.find((l) => l.id === id);
}
