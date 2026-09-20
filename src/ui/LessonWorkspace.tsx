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

  // Two INDEPENDENT questions (R4 amendment):
  //  - `edited`: does the editor differ from the ORIGINAL authored lesson code?
  //  - `stale`:  does the recorded trace differ from the CURRENT editor content?
  // They are not the same: after edit → run edited → restore the original text
  // (without rerunning), `edited === false` but `stale === true` — the trace is
  // still from the edited run and must not be presented as current, nor used to
  // back the authored diagram/complexity.
  const edited = source !== lesson.code;
  const stale = engine.isStale(source, lesson.stdin ?? "");

  // The recorded trace is CURRENT only when a result exists and matches the
  // editor. Authored explanations/bindings/complexity are valid only when the
  // current trace also came from the unedited authored source.
  const traceMatchesEditor = Boolean(engine.result) && !stale;
  const authoredMatchesTrace = traceMatchesEditor && !edited;

  // While the trace is stale, pause playback so it can't keep advancing a trace
  // that no longer matches the editor.
  useEffect(() => {
    if (stale && engine.playing) engine.pause();
  }, [stale, engine]);

  // Editor line highlight: the complexity-hover highlight applies ONLY when the
  // authored complexity is valid; staleness/edits override a lingering hover.
  // Otherwise use the trace line only when the trace matches the editor.
  const cxHover = authoredMatchesTrace ? cxHighlight?.[0] : null;
  const currentLine = cxHover ?? (traceMatchesEditor ? engine.event?.line ?? null : null);

  // Authored line explanations are keyed to the ORIGINAL source and the current
  // trace; only show them when both match.
  const lineExplanation = useMemo(() => {
    if (!authoredMatchesTrace || !currentLine) return null;
    return lesson.codeExplanations.find((c) => c.line === currentLine) ?? null;
  }, [authoredMatchesTrace, currentLine, lesson]);

  // The event fed to the trace/variables/visualization panels: only the current
  // (non-stale) trace; a stale result's panels are hidden until rerun.
  const liveEvent = traceMatchesEditor ? engine.event : undefined;

  return (
    <div className="workspace">
      <div className="workspace-left">
        <div className="toolbar">
          <button onClick={() => engine.run(source, lesson.stdin)} disabled={!engine.ready || engine.running}>
            {engine.ready ? "▶ Run" : "Loading Python…"}
          </button>
          <button onClick={engine.stop} disabled={!engine.running}>■ Stop</button>
          <span className="spacer" />
          <button onClick={() => (engine.playing ? engine.pause() : engine.play())} disabled={!traceMatchesEditor || engine.length === 0}>
            {engine.playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button onClick={engine.restart} disabled={!traceMatchesEditor}>⏮ Restart</button>
          <button onClick={engine.prev} disabled={!traceMatchesEditor || engine.position <= 0}>‹ Prev</button>
          <button onClick={engine.next} disabled={!traceMatchesEditor || engine.position >= engine.length - 1}>Next ›</button>
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

        {engine.result && stale && (
          <div className="stale-banner" role="status">
            ⚠ This recorded run no longer matches the code in the editor — its trace, variables and
            playback are hidden until you run again.
          </div>
        )}
        {edited && !stale && (
          <div className="stale-banner" role="status">
            ⚠ You edited the lesson code — the authored line explanations, diagram bindings and
            complexity claims are hidden until you restore the original source. Your edited program's
            trace and variables still work.
          </div>
        )}

        <CodeEditor value={source} onChange={setSource} highlightLine={currentLine} />

        {traceMatchesEditor && engine.result && (
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
          {!authoredMatchesTrace ? (
            <p className="dim">
              {edited
                ? "Authored line explanations are hidden while the code differs from the original lesson. Restore the original source to see them again."
                : stale
                  ? "Run again to see line-by-line explanations for the current code."
                  : "Run the program and step through to see line-by-line explanations."}
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
            if (!traceMatchesEditor)
              return (
                <p className="dim">
                  {stale
                    ? "The recorded run no longer matches the editor — run again to refresh the visualization."
                    : "Run the program to see the visualization."}
                </p>
              );
            // Authored bindings are keyed to the original source; disable them
            // while edited even though the trace itself is current.
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
                <Visualizer event={liveEvent!} binding={b} />
              </div>
            ));
          })()}
        </div>
        <VariablesPanel event={liveEvent} output={traceMatchesEditor ? engine.outputSoFar : ""} />
        {lesson.complexityExplanation && authoredMatchesTrace && (
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
