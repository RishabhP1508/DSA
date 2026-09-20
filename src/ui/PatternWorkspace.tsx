/**
 * PatternWorkspace — the visual Python walkthrough for a pattern.
 *
 * Mirrors LessonWorkspace: code beside the visualization, playback controls,
 * the current-line explanation, and expandable variables/output. Runs the
 * pattern's walkthroughCode on the same tracing engine used by lessons.
 */

import { useMemo, useState } from "react";
import type { PatternDefinition } from "../core/types";
import { useEngine } from "./useEngine";
import { CodeEditor } from "./CodeEditor";
import { VariablesPanel } from "./VariablesPanel";
import { Visualizer } from "../visualizers";

export function PatternWorkspace({ pattern }: { pattern: PatternDefinition }) {
  const engine = useEngine();
  const [source, setSource] = useState(pattern.walkthroughCode);

  const currentLine = engine.event?.line ?? null;

  const lineExplanation = useMemo(() => {
    if (!currentLine) return null;
    return pattern.codeExplanations.find((c) => c.line === currentLine) ?? null;
  }, [currentLine, pattern]);

  return (
    <div className="workspace">
      <div className="workspace-left">
        <div className="toolbar">
          <button
            onClick={() => engine.run(source, pattern.walkthroughStdin)}
            disabled={!engine.ready || engine.running}
          >
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
            <p className="dim">Run the walkthrough and step through to see line-by-line explanations.</p>
          )}
        </div>

        {pattern.complexityNote && (
          <div className="explanation-box">
            <h4>Time &amp; space</h4>
            <p>{pattern.complexityNote}</p>
          </div>
        )}
      </div>

      <div className="workspace-right">
        <div className="diagram">
          <h4>Visualization</h4>
          {(() => {
            const ev = engine.event;
            if (!ev) return <p className="dim">Run the walkthrough to see the visualization.</p>;
            if (pattern.bindings.length === 0)
              return <p className="dim">This pattern has no visual bindings.</p>;
            return pattern.bindings.map((b, i) => (
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
