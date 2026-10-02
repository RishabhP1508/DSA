/**
 * Practice view — mixed recognition and exercise drills.
 *
 * Aggregates exercises from every lesson and pattern, and lets the learner
 * filter by kind (predict-state, complete-code, fix-mistake, choose-approach,
 * write-solution). "Recognition" collects the unlabeled choose-approach drills
 * from the Pattern Library so the learner must identify the technique without a
 * category hint (plan §3: mixed problems requiring independent recognition).
 */

import { useMemo, useState } from "react";
import { lessons, patterns } from "../content/registry";
import type { Exercise, PatternExercise } from "../core/types";
import { ExercisePanel } from "./ExercisePanel";

type Row = {
  exercise: Exercise | PatternExercise;
  sourceLabel: string;
  patternMode: boolean;
  ownerKind: "lesson" | "pattern";
  ownerId: string;
};

const FILTERS: { key: string; label: string; match: (r: Row) => boolean }[] = [
  { key: "recognition", label: "Recognition (mixed)", match: (r) => r.exercise.kind === "choose-approach" },
  { key: "predict", label: "Predict state", match: (r) => r.exercise.kind === "predict-state" },
  { key: "complete", label: "Complete code", match: (r) => r.exercise.kind === "complete-code" },
  { key: "debug", label: "Fix a bug", match: (r) => r.exercise.kind === "fix-mistake" },
  { key: "write", label: "Write a solution", match: (r) => r.exercise.kind === "write-solution" },
  { key: "all", label: "All", match: () => true },
];

const PAGE_SIZE = 20;

export function Practice() {
  const [filter, setFilter] = useState("recognition");
  const [page, setPage] = useState(0);

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    for (const l of lessons) {
      for (const ex of l.exercises) {
        out.push({ exercise: ex, sourceLabel: l.title, patternMode: false, ownerKind: "lesson", ownerId: l.id });
      }
    }
    for (const p of patterns) {
      for (const ex of p.exercises) {
        out.push({ exercise: ex, sourceLabel: p.title, patternMode: true, ownerKind: "pattern", ownerId: p.id });
      }
    }
    return out;
  }, []);

  const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];
  const matching = rows.filter(active.match);

  // R6.6.1 — render a BOUNDED page (<=20) with navigation through the full set,
  // so opening Practice never mounts hundreds of exercise panels at once. No
  // Python worker loads until the learner runs a coding check (R6.6.2): the
  // shared engine is lazy and each ExercisePanel creates no worker on mount.
  const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const start = clampedPage * PAGE_SIZE;
  const shown = matching.slice(start, start + PAGE_SIZE);

  const changeFilter = (key: string) => {
    setFilter(key);
    setPage(0);
  };

  // For recognition drills the source is hidden until the learner reveals the
  // model answer, so the technique must be identified independently.
  const hideSource = filter === "recognition";

  return (
    <div className="app-body">
      <nav className="sidebar">
        <h3>Practice</h3>
        <ul>
          {FILTERS.map((f) => (
            <li key={f.key}>
              <button className={f.key === filter ? "active" : ""} onClick={() => changeFilter(f.key)}>
                {f.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="phase-note">
          {matching.length} exercise{matching.length === 1 ? "" : "s"} in this set. Recognition drills
          are intentionally unlabeled — identify the technique, then check the model answer and its
          conditions.
        </p>
      </nav>
      <main className="content">
        <div className="lesson-content">
          <h2>{active.label}</h2>
          {matching.length > PAGE_SIZE && (
            <div className="practice-pager" role="navigation" aria-label="Practice pages">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={clampedPage === 0}>
                ← Previous
              </button>
              <span className="dim tiny">
                Showing {start + 1}–{Math.min(start + PAGE_SIZE, matching.length)} of {matching.length}{" "}
                (page {clampedPage + 1} of {pageCount})
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={clampedPage >= pageCount - 1}
              >
                Next →
              </button>
            </div>
          )}
          {shown.length === 0 ? (
            <p className="dim">No exercises of this kind yet.</p>
          ) : (
            shown.map((r, i) => (
              <div key={`${r.ownerKind}:${r.ownerId}:${r.exercise.id}-${i}`} className="practice-item">
                {!hideSource && <div className="dim tiny">from: {r.sourceLabel}</div>}
                <ExercisePanel
                  exercise={r.exercise}
                  patternMode={r.patternMode}
                  ownerKind={r.ownerKind}
                  ownerId={r.ownerId}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
