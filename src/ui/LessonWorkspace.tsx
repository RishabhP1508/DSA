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
import { useEngine, PLAYBACK_SPEEDS } from "./useEngine";
import { CodeEditor } from "./CodeEditor";
import { VariablesPanel } from "./VariablesPanel";
import { ComplexityPanel } from "./ComplexityPanel";
import { Visualizer } from "../visualizers";
import { markLessonViewed } from "../storage/progress";

export function LessonWorkspace({ lesson }: { lesson: LessonDefinition }) {
  const engine = useEngine("lesson:" + lesson.id);
  // Initialised from the lesson; the parent remounts this component per lesson
  // (via a `key`), so state resets naturally without a setState-in-effect.
  const [source, setSource] = useState(lesson.code);
  // Lines highlighted by hovering a complexity-derivation row (overrides the
  // trace line while hovering).
  const [cxHighlight, setCxHighlight] = useState<number[] | null>(null);

  useEffect(() => {
    // Side-effect only: record that the lesson was viewed.
    void markLessonViewed(lesson.id);
  }, [lesson.id]);

  // The learner has edited away from the ORIGINAL lesson source. The authored
  // artifacts (line explanations, bindings, complexity claims) are keyed to the
  // original source and are only valid for it, so they are disabled until the
  // original source is restored (R4 amendment). The recorded TRACE itself stays
  // usable — a fresh run of the edited code produces real, inspectable states.
  const edited = source !== lesson.code;
  // The trace no longer matches the current editor content (edited but not
  // re-run): the trace-driven line highlight no longer maps to the source.
  const stale = engine.isStale(source, lesson.stdin ?? "");

  // Editor line highlight: the complexity-hover highlight applies ONLY when the
  // authored complexity is valid (i.e. not edited/stale) — staleness overrides a
  // lingering hover highlight. Otherwise use the trace line unless it is stale.
  const cxHover = !edited && !stale ? cxHighlight?.[0] : null;
  const currentLine = cxHover ?? (stale ? null : engine.event?.line ?? null);

  // Authored line explanations are keyed to the ORIGINAL source; only show them
  // when the source is unedited.
  const lineExplanation = useMemo(() => {
    if (edited || !currentLine) return null;
    return lesson.codeExplanations.find((c) => c.line === currentLine) ?? null;
  }, [edited, currentLine, lesson]);

  return (
    <div className="workspace">
      <div className="workspace-left">
        <div className="toolbar">
          <button onClick={() => engine.run(source, lesson.stdin)} disabled={!engine.ready || engine.running}>
            {engine.ready ? "▶ Run" : "Loading Python…"}
          </button>
          <button onClick={engine.stop} disabled={!engine.running}>■ Stop</button>
          <span className="spacer" />
          <button onClick={() => (engine.playing ? engine.pause() : engine.play())} disabled={!engine.result || engine.length === 0}>
            {engine.playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={engine.restart} disabled={!engine.result}>⏮ Restart</button>
          <button onClick={engine.prev} disabled={!engine.result || engine.position <= 0}>‹ Prev</button>
          <button onClick={engine.next} disabled={!engine.result || engine.position >= engine.length - 1}>Next ›</button>
          <label className="speed-control">
            Speed
            <select aria-label="Playback speed" value={engine.speed} onChange={(e) => engine.setSpeed(Number(e.target.value))}>
              {PLAYBACK_SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
            </select>
          </label>
          <button
            onClick={() => currentLine && engine.toggleBreakpoint(currentLine)}
            disabled={!engine.result || currentLine == null}
            aria-pressed={currentLine != null && engine.breakpoints.has(currentLine)}
            title="Toggle a playback breakpoint on the current line"
          >
            {currentLine != null && engine.breakpoints.has(currentLine) ? "● Breakpoint" : "○ Breakpoint"}
          </button>
        </div>

        {edited && (
          <div className="stale-banner" role="status">
            ⚠ You edited the lesson code — the authored line explanations, diagram bindings and
            complexity claims are hidden until you restore the original source. Run to inspect your
            edited program; its trace and variables still work.
          </div>
        )}

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
              disabled={engine.length === 0}
            />
            <span className="dim">
              {engine.length === 0
                ? `no steps recorded · ${engine.result.status}`
                : `step ${engine.position + 1} / ${engine.length} · ${engine.result.status}`}
            </span>
          </div>
        )}

        <div className="explanation-box">
          <h4>What this line does</h4>
          {edited ? (
            <p className="dim">
              Authored line explanations are hidden while the code differs from the original lesson.
              Restore the original source to see them again.
            </p>
          ) : lineExplanation ? (
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
            // Authored bindings are keyed to the original source; disable them
            // while edited. The trace/variables below still reflect the run.
            if (edited)
              return (
                <p className="dim">
                  The lesson's authored diagram bindings are hidden while the code is edited.
                  Restore the original source to see them.
                </p>
              );
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
        {lesson.complexityExplanation && !edited && (
          <ComplexityPanel
            explanation={lesson.complexityExplanation}
            result={engine.result}
            onHighlightLines={setCxHighlight}
            fixedData
          />
        )}
      </div>
    </div>
  );
}
