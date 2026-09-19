/**
 * Lesson Workspace: code beside a large diagram, playback controls, the
 * current-line explanation, and expandable variables/stack/output.
 *
 * Renders every VisualBinding the lesson declares through the visualizer
 * dispatcher, so any structure family (array, tree, graph, heap, …) is drawn
 * without workspace changes. Later phases add breakpoints and speed control.
 */

import { useEffect, useMemo, useState } from "react";
import type { LessonDefinition } from "../core/types";
import { useEngine } from "./useEngine";
import { CodeEditor } from "./CodeEditor";
import { VariablesPanel } from "./VariablesPanel";
import { Visualizer } from "../visualizers";
import { markLessonViewed } from "../storage/progress";

export function LessonWorkspace({ lesson }: { lesson: LessonDefinition }) {
  const engine = useEngine();
  // Initialised from the lesson; the parent remounts this component per lesson
  // (via a `key`), so state resets naturally without a setState-in-effect.
  const [source, setSource] = useState(lesson.code);

  useEffect(() => {
    // Side-effect only: record that the lesson was viewed.
    void markLessonViewed(lesson.id);
  }, [lesson.id]);

  const currentLine = engine.event?.line ?? null;

  const lineExplanation = useMemo(() => {
    if (!currentLine) return null;
    return lesson.codeExplanations.find((c) => c.line === currentLine) ?? null;
  }, [currentLine, lesson]);

  return (
    <div className="workspace">
      <div className="workspace-left">
        <div className="toolbar">
          <button onClick={() => engine.run(source, lesson.stdin)} disabled={!engine.ready || engine.running}>
            {engine.ready ? "▶ Run" : "Loading Python…"}
          </button>
          <button onClick={engine.stop} disabled={!engine.running}>■ Stop</button>
          <span className="spacer" />
          <button onClick={engine.restart} disabled={!engine.result}>⏮ Restart</button>
          <button onClick={engine.prev} disabled={!engine.result || engine.position <= 0}>‹ Prev</button>
          <button onClick={engine.next} disabled={!engine.result || engine.position >= engine.length - 1}>Next ›</button>
        </div>

        <CodeEditor value={source} onChange={setSource} highlightLine={currentLine} />

        {engine.result && (
          <div className="timeline">
            <input
              type="range"
              min={0}
              max={Math.max(0, engine.length - 1)}
              value={engine.position}
              onChange={(e) => engine.seek(Number(e.target.value))}
              aria-label="Timeline"
            />
            <span className="dim">
              step {engine.position + 1} / {engine.length} · {engine.result.status}
            </span>
          </div>
        )}

        <div className="explanation-box">
          <h4>What this line does</h4>
          {lineExplanation ? (
            <p>
              <span className="line-badge">line {lineExplanation.line}</span>{" "}
              {lineExplanation.executable ? "" : <em>(comment) </em>}
              {lineExplanation.explanation}
            </p>
          ) : (
            <p className="dim">Run the program and step through to see line-by-line explanations.</p>
          )}
        </div>
      </div>

      <div className="workspace-right">
        <div className="diagram">
          <h4>Visualization</h4>
          {(() => {
            const ev = engine.event;
            if (!ev) return <p className="dim">Run the program to see the visualization.</p>;
            if (lesson.bindings.length === 0)
              return <p className="dim">This lesson has no visual bindings.</p>;
            return lesson.bindings.map((b, i) => (
              <div key={`${b.variable}-${b.model}-${i}`} className="viz-slot">
                <Visualizer event={ev} binding={b} />
              </div>
            ));
          })()}
        </div>
        <VariablesPanel event={engine.event} output={engine.outputSoFar} />
      </div>
    </div>
  );
}
