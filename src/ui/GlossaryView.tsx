/**
 * R8.2 — shared glossary view. Lists every vocabulary term from every lesson,
 * with topic context, and marks terms that have more than one meaning across
 * topics so the learner can disambiguate (e.g. "node" in trees vs linked lists
 * vs graphs). Clicking a sense jumps to the lesson that defines it.
 */

import { useMemo, useState } from "react";
import { buildGlossary } from "./Glossary";
import { mdInline } from "./md";

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
      <main className="support-page glossary-page" id="main-content">
        <header className="support-header">
          <div className="eyebrow">WORDS YOU WILL MEET</div>
          <h1>Glossary</h1>
          <p className="page-description">
            Every term introduced across the curriculum, with the topic it was defined in. A term
            with more than one meaning keeps all of its senses so you can tell them apart.
          </p>
        </header>
        <section className="glossary-tools" aria-label="Find a term">
          <label className="answer-label" htmlFor="glossary-filter">
            Filter terms
            <input
              className="answer-box"
              id="glossary-filter"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type to filter…"
            />
          </label>
          <p className="dim glossary-count" role="status">{shown.length} of {glossary.length} terms</p>
        </section>
        <section className="support-section" aria-labelledby="glossary-terms-heading">
          <h2 id="glossary-terms-heading">Terms and definitions</h2>
          <dl className="glossary">
            {shown.map((e) => (
              <div className="glossary-entry" key={e.term}>
                <dt>
                  {e.term}
                  {e.senses.length > 1 && (
                    <span className="kind-badge" title="This term has more than one meaning">
                      {e.senses.length} meanings
                    </span>
                  )}
                </dt>
                {e.senses.map((s, i) => (
                  <dd className="glossary-sense" key={i}>
                    <p dangerouslySetInnerHTML={{ __html: mdInline(s.definition) }} />
                    <button
                      className="link-like glossary-context"
                      onClick={() => onOpenLesson?.(s.lessonId)}
                      title={`Open ${s.lessonTitle}`}
                    >
                      {s.area}: {s.lessonTitle}
                    </button>
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          {shown.length === 0 && <p className="dim">No terms match "{q}".</p>}
        </section>
      </main>
  );
}
