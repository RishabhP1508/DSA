import { useState } from "react";
import "./App.css";
import { lessons } from "./content/registry";
import type { LessonDefinition } from "./core/types";
import { LessonWorkspace } from "./ui/LessonWorkspace";
import { ExercisePanel } from "./ui/ExercisePanel";
import { PatternLibrary } from "./ui/PatternLibrary";
import { Practice } from "./ui/Practice";
import { Playground } from "./ui/Playground";
import { BackupView } from "./ui/BackupView";
import { mdInline } from "./ui/md";

type View = "learn" | "patterns" | "practice" | "playground" | "backup";

const NAV: { key: View; label: string }[] = [
  { key: "learn", label: "Learn" },
  { key: "patterns", label: "Patterns" },
  { key: "practice", label: "Practice" },
  { key: "playground", label: "Playground" },
  { key: "backup", label: "Backup" },
];

function LessonContent({ lesson }: { lesson: LessonDefinition }) {
  return (
    <div className="lesson-content">
      <h2>{lesson.title}</h2>
      <p className="area">{lesson.area}</p>

      <section>
        <h3>Simple explanation</h3>
        {lesson.explanation.split("\n\n").map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: mdInline(p) }} />
        ))}
      </section>

      <section>
        <h3>Vocabulary</h3>
        <dl className="glossary">
          {lesson.vocabulary.map((v) => (
            <div key={v.term}>
              <dt>{v.term}</dt>
              <dd>{v.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h3>Interactive example</h3>
        <p className="dim">
          Use Run and the Prev/Next controls to step through the program. The current line is
          highlighted, its explanation appears below the code, and the structure is drawn on the right.
        </p>
        <LessonWorkspace key={lesson.id} lesson={lesson} />
      </section>

      <section className="concepts">
        <h3>Concepts</h3>
        <Concept label="Purpose" text={lesson.concepts.purpose} />
        <Concept label="Operations" text={lesson.concepts.operations} />
        <Concept label="Uses" text={lesson.concepts.uses} />
        <Concept label="Tradeoffs" text={lesson.concepts.tradeoffs} />
        <Concept label="Common mistakes" text={lesson.concepts.commonMistakes} />
        <Concept label="Edge cases" text={lesson.concepts.edgeCases} />
      </section>

      <section>
        <h3>Complexity</h3>
        <table className="complexity">
          <thead>
            <tr><th>Operation</th><th>Best</th><th>Average</th><th>Worst</th><th>Note</th></tr>
          </thead>
          <tbody>
            {lesson.complexity.map((c) => (
              <tr key={c.operation}>
                <td>{c.operation}</td>
                <td>{c.best ?? "—"}</td>
                <td>{c.average ?? "—"}</td>
                <td>{c.worst ?? "—"}</td>
                <td>{c.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Predict</h3>
        {lesson.prediction.map((p, i) => (
          <details key={i}>
            <summary>{p.prompt}</summary>
            <p><strong>Answer:</strong> {p.answer}</p>
            <p>{p.explanation}</p>
          </details>
        ))}
      </section>

      <section>
        <h3>Experiment</h3>
        <ul>{lesson.experiments.map((e, i) => <li key={i}>{e}</li>)}</ul>
      </section>

      <section>
        <h3>Practice</h3>
        {lesson.exercises.map((ex) => (
          <ExercisePanel key={ex.id} exercise={ex} />
        ))}
      </section>

      <section>
        <h3>Review</h3>
        <p dangerouslySetInnerHTML={{ __html: mdInline(lesson.review) }} />
      </section>

      <section className="sources">
        <h3>Sources consulted</h3>
        <ul>
          {lesson.references.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
              {r.section ? ` — ${r.section}` : ""} <span className="dim">(accessed {r.accessDate})</span>
              <div className="dim">{r.purpose}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Concept({ label, text }: { label: string; text: string }) {
  return (
    <div className="concept">
      <strong>{label}:</strong> <span>{text}</span>
    </div>
  );
}

function LearnView() {
  const [activeId, setActiveId] = useState(lessons[0]?.id);
  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];

  return (
    <div className="app-body">
      <nav className="sidebar">
        <h3>Lessons</h3>
        <ul>
          {lessons.map((l) => (
            <li key={l.id}>
              <button className={l.id === activeId ? "active" : ""} onClick={() => setActiveId(l.id)}>
                {l.title}
              </button>
            </li>
          ))}
        </ul>
        <p className="phase-note">{lessons.length} lessons across the full curriculum.</p>
      </nav>
      <main className="content">
        {active ? <LessonContent lesson={active} /> : <p>No lessons yet.</p>}
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("learn");

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div>
            <h1>DSA Visual Lab</h1>
            <p className="tagline">Learn Python, data structures &amp; algorithms — offline, with real execution.</p>
          </div>
          <nav className="top-nav" aria-label="Main views">
            {NAV.map((n) => (
              <button
                key={n.key}
                className={view === n.key ? "active" : ""}
                onClick={() => setView(n.key)}
                aria-current={view === n.key ? "page" : undefined}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {view === "learn" && <LearnView />}
      {view === "patterns" && <PatternLibrary />}
      {view === "practice" && <Practice />}
      {view === "playground" && <Playground />}
      {view === "backup" && <BackupView />}
    </div>
  );
}
