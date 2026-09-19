/**
 * Content registry. Later phases register additional lessons and patterns here;
 * the app reads only from these arrays so adding content never requires UI
 * changes. Lessons are ordered roughly by the recommended learning path.
 */

import type { LessonDefinition, PatternDefinition } from "../core/types";
import { variablesAndTypes } from "./lessons/variables-and-types";
import { expressions } from "./lessons/expressions";
import { conditions } from "./lessons/conditions";
import { loops } from "./lessons/loops";
import { functions } from "./lessons/functions";
import { scope } from "./lessons/scope";
import { io } from "./lessons/io";
import { referencesMutation } from "./lessons/references-mutation";
import { classes } from "./lessons/classes";
import { errors } from "./lessons/errors";
import { representations } from "./lessons/representations";
import { complexity } from "./lessons/complexity";
import { cases } from "./lessons/cases";
import { amortized } from "./lessons/amortized";
import { correctness } from "./lessons/correctness";
import { linkedListTraversal } from "./lessons/linked-list-traversal";

export const lessons: LessonDefinition[] = [
  // Programming foundations
  variablesAndTypes,
  expressions,
  conditions,
  loops,
  functions,
  scope,
  io,
  referencesMutation,
  classes,
  errors,
  // DSA foundations
  representations,
  complexity,
  cases,
  amortized,
  correctness,
  // Linear structures
  linkedListTraversal,
];

export const patterns: PatternDefinition[] = [];

export function getLesson(id: string): LessonDefinition | undefined {
  return lessons.find((l) => l.id === id);
}
