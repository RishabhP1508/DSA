/**
 * R8 — React hook exposing the local progress record and the derived
 * learning-path recommendation, with helpers to mark a lesson viewed/completed.
 *
 * Progress lives in IndexedDB (storage/progress.ts). This hook loads it, keeps a
 * reactive copy, and recomputes the "Continue learning" recommendation whenever
 * it changes. Viewing a lesson records a view (not a completion); completion is
 * an explicit action.
 */

import { useCallback, useEffect, useState } from "react";
import type { ProgressRecord } from "../core/types";
import {
  loadProgress,
  markLessonViewed as persistViewed,
  markLessonCompleted as persistCompleted,
} from "../storage/progress";
import { lessons } from "../content/registry";
import { recommendNext, type Recommendation, type PathProgress } from "../core/learning-path";

const nodes = lessons.map((l) => ({ id: l.id, title: l.title, prerequisites: l.prerequisites ?? [] }));

export function useProgress() {
  const [record, setRecord] = useState<ProgressRecord | null>(null);

  const refresh = useCallback(async () => {
    setRecord(await loadProgress());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markViewed = useCallback(
    async (id: string) => {
      await persistViewed(id);
      await refresh();
    },
    [refresh],
  );

  const markCompleted = useCallback(
    async (id: string) => {
      await persistCompleted(id);
      await refresh();
    },
    [refresh],
  );

  const pathProgress: PathProgress = { lessons: record?.lessons ?? {} };
  const recommendation: Recommendation = recommendNext(nodes, pathProgress);

  const isCompleted = (id: string) => Boolean(record?.lessons[id]?.completed);
  const isViewed = (id: string) => Boolean(record?.lessons[id]?.lastViewedAt);

  return { record, recommendation, markViewed, markCompleted, isCompleted, isViewed, refresh };
}
