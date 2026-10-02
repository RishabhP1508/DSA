/**
 * R8.2 — shared glossary view. Lists every vocabulary term from every lesson,
 * with topic context, and marks terms that have more than one meaning across
 * topics so the learner can disambiguate (e.g. "node" in trees vs linked lists
 * vs graphs). Clicking a sense jumps to the lesson that defines it.
 */

import { useMemo, useState } from "react";
import { buildGlossary } from "./Glossary";

export function GlossaryView({ onOpenLesson }: { onOpenLesson?: (id: string) => void }) {
  const glossary = useMemo(() => buildGlossary(), []);
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = needle
    ? glossary.filter(
        (e) =>
          e.term.toLowerCase().includes(needle) ||
          e.senses.some((s) => s.definition.toLowerCase().includes(needle)),
      )
    : glossary;

  return (
    <div className="app-body">
      <main className="content">
        <div className="lesson-content">
          <h2>Glossary</h2>
          <p className="dim">
            Every term introduced across the curriculum, with the topic it was defined in. A term
            with more than one meaning keeps all of its senses so you can tell them apart.
          </p>
          <label className="answer-label">
            Filter terms
            <input
              className="answer-box"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type to filter…"
            />
          </label>
          <dl className="glossary">
            {shown.map((e) => (
              <div key={e.term}>
                <dt>
                  {e.term}
                  {e.senses.length > 1 && (
                    <span className="kind-badge" title="This term has more than one meaning">
                      {e.senses.length} meanings
                    </span>
                  )}
                </dt>
                {e.senses.map((s, i) => (
                  <dd key={i}>
                    {s.definition}{" "}
                    <button
                      className="link-like"
                      onClick={() => onOpenLesson?.(s.lessonId)}
                      title={`Open ${s.lessonTitle}`}
                    >
                      — {s.area}: {s.lessonTitle}
                    </button>
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          {shown.length === 0 && <p className="dim">No terms match “{q}”.</p>}
        </div>
      </main>
    </div>
  );
}
