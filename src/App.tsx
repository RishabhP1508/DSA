import { useEffect, useState } from "react";
import "./App.css";
import { lessons, patterns } from "./content/registry";
import type { LessonDefinition } from "./core/types";
import { LessonWorkspace } from "./ui/LessonWorkspace";
import { ExercisePanel } from "./ui/ExercisePanel";
import { PatternLibrary } from "./ui/PatternLibrary";
import { Practice } from "./ui/Practice";
import { Playground } from "./ui/Playground";
import { BackupView } from "./ui/BackupView";
import { GlossaryView } from "./ui/GlossaryView";
import { mdInline } from "./ui/md";
import { useProgress } from "./ui/useProgress";
import { NOTION_PRACTICE } from "./content/notion-practice";

type View = "learn" | "patterns" | "practice" | "playground" | "glossary" | "backup";

const NAV: { key: View; label: string }[] = [
  { key: "learn", label: "Learn" },
  { key: "patterns", label: "Patterns" },
  { key: "practice", label: "Practice" },
  { key: "playground", label: "Playground" },
  { key: "glossary", label: "Glossary" },
  { key: "backup", label: "Backup" },
];

function LessonContent({
  lesson,
  onOpenLesson,
  onOpenPatterns,
  completed,
  onMarkComplete,
}: {
  lesson: LessonDefinition;
  onOpenLesson: (id: string) => void;
  onOpenPatterns: () => void;
  completed: boolean;
  onMarkComplete: () => void;
}) {
  const prereqs = lesson.prerequisites ?? [];
  // R8.2 — external practice problems whose technique THIS lesson teaches.
  const practice = NOTION_PRACTICE.filter((row) => row.mappedIds.includes(lesson.id));
  // Patterns that link to this lesson (actionable related content).
  const relatedPatterns = patterns.filter((p) => (p.linkedLessons ?? []).includes(lesson.id));

  return (
    <div className="lesson-content">
      <h2>{lesson.title}</h2>
      <p className="area">{lesson.area}</p>

      <div className="lesson-pathbar">
        {prereqs.length > 0 && (
          <div className="prereqs">
            <span className="dim tiny">Prerequisites:</span>{" "}
            {prereqs.map((pid, i) => {
              const pl = lessons.find((l) => l.id === pid);
              return (
                <span key={pid}>
                  <button className="link-like" onClick={() => onOpenLesson(pid)}>
                    {pl?.title ?? pid}
                  </button>
                  {i < prereqs.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </div>
        )}
        <button className={completed ? "sa on" : "sa"} onClick={onMarkComplete} disabled={completed}>
          {completed ? "✓ Completed" : "Mark lesson complete"}
        </button>
      </div>

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
          <ExercisePanel
            key={`lesson:${lesson.id}:${ex.id}`}
            exercise={ex}
            ownerKind="lesson"
            ownerId={lesson.id}
          />
        ))}
      </section>

      {relatedPatterns.length > 0 && (
        <section>
          <h3>Related patterns</h3>
          <ul>
            {relatedPatterns.map((p) => (
              <li key={p.id}>
                <button className="link-like" onClick={onOpenPatterns}>{p.title}</button>
                <span className="dim"> — {p.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {practice.length > 0 && (
        <section>
          <h3>Optional external practice</h3>
          <p className="dim tiny">
            These LeetCode problems use this lesson's technique. They are optional — the local
            exercises above already teach it.
          </p>
          <ul>
            {practice.map((row) => (
              <li key={row.url}>
                <a href={row.url} target="_blank" rel="noreferrer">{row.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

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

function LearnView({
  activeId,
  setActiveId,
  onOpenPatterns,
}: {
  activeId: string;
  setActiveId: (id: string) => void;
  onOpenPatterns: () => void;
}) {
  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];
  const { recommendation, markViewed, markCompleted, isCompleted } = useProgress();

  // R8.1 — opening a lesson records a VIEW (not a completion).
  useEffect(() => {
    if (active) void markViewed(active.id);
  }, [active?.id, markViewed]);

  const recId = "lessonId" in recommendation ? recommendation.lessonId : null;

  return (
    <div className="app-body">
      <nav className="sidebar">
        <h3>Lessons</h3>
        <div className="continue-learning">
          <p className="dim tiny">{recommendation.reason}</p>
          {recId && (
            <button className="continue-btn" onClick={() => setActiveId(recId)}>
              ▶ Continue learning
            </button>
          )}
        </div>
        <ul>
          {lessons.map((l) => (
            <li key={l.id}>
              <button className={l.id === activeId ? "active" : ""} onClick={() => setActiveId(l.id)}>
                <span className="lesson-status" aria-hidden>
                  {isCompleted(l.id) ? "✓ " : l.id === recId ? "▶ " : ""}
                </span>
                {l.title}
              </button>
            </li>
          ))}
        </ul>
        <p className="phase-note">{lessons.length} lessons across the full curriculum.</p>
      </nav>
      <main className="content">
        {active ? (
          <LessonContent
            lesson={active}
            onOpenLesson={setActiveId}
            onOpenPatterns={onOpenPatterns}
            completed={isCompleted(active.id)}
            onMarkComplete={() => void markCompleted(active.id)}
          />
        ) : (
          <p>No lessons yet.</p>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("learn");
  const [activeLessonId, setActiveLessonId] = useState(lessons[0]?.id ?? "");

  const openLesson = (id: string) => {
    setActiveLessonId(id);
    setView("learn");
  };

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

      {view === "learn" && (
        <LearnView
          activeId={activeLessonId}
          setActiveId={setActiveLessonId}
          onOpenPatterns={() => setView("patterns")}
        />
      )}
      {view === "patterns" && <PatternLibrary />}
      {view === "practice" && <Practice />}
      {view === "playground" && <Playground />}
      {view === "glossary" && <GlossaryView onOpenLesson={openLesson} />}
      {view === "backup" && <BackupView />}
    </div>
  );
}
