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
};

const FILTERS: { key: string; label: string; match: (r: Row) => boolean }[] = [
  { key: "recognition", label: "Recognition (mixed)", match: (r) => r.exercise.kind === "choose-approach" },
  { key: "predict", label: "Predict state", match: (r) => r.exercise.kind === "predict-state" },
  { key: "complete", label: "Complete code", match: (r) => r.exercise.kind === "complete-code" },
  { key: "debug", label: "Fix a bug", match: (r) => r.exercise.kind === "fix-mistake" },
  { key: "write", label: "Write a solution", match: (r) => r.exercise.kind === "write-solution" },
  { key: "all", label: "All", match: () => true },
];

export function Practice() {
  const [filter, setFilter] = useState("recognition");

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    for (const l of lessons) {
      for (const ex of l.exercises) {
        out.push({ exercise: ex, sourceLabel: l.title, patternMode: false });
      }
    }
    for (const p of patterns) {
      for (const ex of p.exercises) {
        out.push({ exercise: ex, sourceLabel: p.title, patternMode: true });
      }
    }
    return out;
  }, []);

  const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];
  const shown = rows.filter(active.match);

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
              <button className={f.key === filter ? "active" : ""} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="phase-note">
          {shown.length} exercise{shown.length === 1 ? "" : "s"} in this set. Recognition drills are
          intentionally unlabeled — identify the technique, then check the model answer and its
          conditions.
        </p>
      </nav>
      <main className="content">
        <div className="lesson-content">
          <h2>{active.label}</h2>
          {shown.length === 0 ? (
            <p className="dim">No exercises of this kind yet.</p>
          ) : (
            shown.map((r, i) => (
              <div key={`${r.exercise.id}-${i}`} className="practice-item">
                {!hideSource && <div className="dim tiny">from: {r.sourceLabel}</div>}
                <ExercisePanel exercise={r.exercise} patternMode={r.patternMode} />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
