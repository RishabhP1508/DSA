/**
 * Pattern Library view.
 *
 * Left: patterns grouped by category. Right: the selected pattern's recognition
 * content in the plan's teaching order — clues, a naive baseline and its
 * bottleneck, why the pattern helps, correctness conditions, how to choose among
 * alternatives, counterexamples/misleading clues, a visual Python walkthrough,
 * recognition exercises, and sources.
 */

import { useMemo, useState } from "react";
import { patterns } from "../content/registry";
import type { PatternDefinition } from "../core/types";
import { PatternWorkspace } from "./PatternWorkspace";
import { ExercisePanel } from "./ExercisePanel";
import { mdInline } from "./md";

function PatternDetail({ pattern }: { pattern: PatternDefinition }) {
  return (
    <div className="lesson-content">
      <h2>{pattern.title}</h2>
      <p className="area">{pattern.category}</p>
      <p dangerouslySetInnerHTML={{ __html: mdInline(pattern.summary) }} />

      <section>
        <h3>Recognition clues</h3>
        <ul>
          {pattern.clues.map((c, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: mdInline(c) }} />
          ))}
        </ul>
      </section>

      <section>
        <h3>Naive baseline &amp; its bottleneck</h3>
        <p dangerouslySetInnerHTML={{ __html: mdInline(pattern.naiveApproach) }} />
      </section>

      <section>
        <h3>Why the pattern helps</h3>
        <p dangerouslySetInnerHTML={{ __html: mdInline(pattern.whyItHelps) }} />
      </section>

      <section>
        <h3>Conditions for correctness</h3>
        <ul>
          {pattern.conditions.map((c, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: mdInline(c) }} />
          ))}
        </ul>
      </section>

      <section>
        <h3>Choosing among alternatives</h3>
        <ul>
          {pattern.alternatives.map((c, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: mdInline(c) }} />
          ))}
        </ul>
      </section>

      <section>
        <h3>Counterexamples &amp; misleading clues</h3>
        <ul>
          {pattern.counterexamples.map((c, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: mdInline(c) }} />
          ))}
        </ul>
      </section>

      <section>
        <h3>Visual walkthrough</h3>
        <p className="dim">
          Run and step through the walkthrough. The current line is highlighted and explained; the
          structure is drawn on the right.
        </p>
        <PatternWorkspace key={pattern.id} pattern={pattern} />
      </section>

      <section>
        <h3>Recognition practice</h3>
        <p className="dim">
          Decide the pattern before revealing the model answer. Hints escalate from understanding the
          example to a full explanation.
        </p>
        {pattern.exercises.map((ex) => (
          <ExercisePanel
            key={`pattern:${pattern.id}:${ex.id}`}
            exercise={ex}
            patternMode
            ownerKind="pattern"
            ownerId={pattern.id}
          />
        ))}
      </section>

      {pattern.linkedLessons.length > 0 && (
        <section>
          <h3>Related lessons</h3>
          <ul>
            {pattern.linkedLessons.map((id) => (
              <li key={id}>
                <code>{id}</code>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="sources">
        <h3>Sources consulted</h3>
        <ul>
          {pattern.references.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.title}
              </a>
              {r.section ? ` — ${r.section}` : ""}{" "}
              <span className="dim">(accessed {r.accessDate})</span>
              <div className="dim">{r.purpose}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function PatternLibrary() {
  const [activeId, setActiveId] = useState(patterns[0]?.id);
  const active = patterns.find((p) => p.id === activeId) ?? patterns[0];

  const grouped = useMemo(() => {
    const m = new Map<string, PatternDefinition[]>();
    for (const p of patterns) {
      if (!m.has(p.category)) m.set(p.category, []);
      m.get(p.category)!.push(p);
    }
    return [...m.entries()];
  }, []);

  if (patterns.length === 0) {
    return <p className="dim">No patterns yet.</p>;
  }

  return (
    <div className="app-body">
      <nav className="sidebar">
        <h3>Patterns</h3>
        {grouped.map(([category, list]) => (
          <div key={category} className="nav-group">
            <div className="nav-group-title">{category}</div>
            <ul>
              {list.map((p) => (
                <li key={p.id}>
                  <button className={p.id === activeId ? "active" : ""} onClick={() => setActiveId(p.id)}>
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <main className="content">{active && <PatternDetail pattern={active} />}</main>
    </div>
  );
}
