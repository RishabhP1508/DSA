/**
 * Code Playground — run your own single-file Python with real tracing.
 *
 * Reuses the same execution engine, replay controls, and inspection panels as
 * lessons. Personal code gets execution-state inspection only (no invented
 * claims about intent). Drafts save to IndexedDB; optional stdin feeds input().
 */

import { useEffect, useState } from "react";
import { useEngine, PLAYBACK_SPEEDS } from "./useEngine";
import { CodeEditor } from "./CodeEditor";
import { VariablesPanel } from "./VariablesPanel";
import { VisualizeAs } from "./VisualizeAs";
import { Visualizer } from "../visualizers";
import { loadDraft, saveDraft } from "../storage/progress";
import type { VisualBinding } from "../core/types";

const STARTER = `# Write any single-file Python here and press Run.
# Supported: builtins, collections, heapq, bisect, math, functools.
# Tip: after running, use "Visualize as…" to draw a variable (e.g. nums).
def demo(nums):
    total = 0
    for x in nums:
        total += x
    return total

nums = [3, 1, 4, 1, 5]
result = demo(nums)
print(result)
`;

const SLOT = "playground";

export function Playground() {
  const engine = useEngine("playground");
  const [source, setSource] = useState(STARTER);
  const [stdin, setStdin] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [vizBinding, setVizBinding] = useState<VisualBinding | null>(null);

  // R4.1: the trace is stale once the editor source/stdin no longer matches the
  // result it was produced from.
  const stale = engine.isStale(source, stdin);

  // Restore the last draft once.
  useEffect(() => {
    let alive = true;
    void loadDraft(SLOT).then((d) => {
      if (alive && d) {
        setSource(d.source);
        setSavedAt(d.savedAt);
      }
      if (alive) setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const save = async () => {
    const d = await saveDraft(SLOT, source);
    setSavedAt(d.savedAt);
  };

  // While stale, stop highlighting the old trace's line (it no longer maps to
  // the edited source).
  const currentLine = stale ? null : engine.event?.line ?? null;
  const err = stale ? undefined : engine.result?.error;

  return (
    <div className="app-body">
      <main className="content playground">
        <div className="lesson-content">
          <h2>Code Playground</h2>
          <p className="dim">
            Your own single-file Python, executed with the same real tracer as the lessons. State is
            observed, not guessed — the panels show actual variables, calls, output and errors.
          </p>

          <div className="workspace">
            <div className="workspace-left">
              <div className="toolbar">
                <button onClick={() => engine.run(source, stdin)} disabled={!engine.ready || engine.running}>
                  {engine.ready ? "▶ Run" : "Loading Python…"}
                </button>
                <button onClick={engine.stop} disabled={!engine.running}>■ Stop</button>
                <span className="spacer" />
                <button
                  onClick={() => (engine.playing ? engine.pause() : engine.play())}
                  disabled={!engine.result || engine.length === 0}
                >
                  {engine.playing ? "⏸ Pause" : "▶ Play"}
                </button>
                <button onClick={engine.restart} disabled={!engine.result}>⏮ Restart</button>
                <button onClick={engine.prev} disabled={!engine.result || engine.position <= 0}>‹ Prev</button>
                <button onClick={engine.next} disabled={!engine.result || engine.position >= engine.length - 1}>
                  Next ›
                </button>
                <label className="speed-control">
                  Speed
                  <select
                    aria-label="Playback speed"
                    value={engine.speed}
                    onChange={(e) => engine.setSpeed(Number(e.target.value))}
                  >
                    {PLAYBACK_SPEEDS.map((s) => (
                      <option key={s} value={s}>{s}×</option>
                    ))}
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
                <span className="spacer" />
                <button onClick={save} disabled={!loaded}>💾 Save draft</button>
              </div>
              {stale && engine.result && (
                <div className="stale-banner" role="status">
                  ⚠ Source or input changed — this trace and its panels are outdated. Run again to
                  refresh.
                </div>
              )}

              <CodeEditor value={source} onChange={setSource} highlightLine={currentLine} />

              {savedAt && <div className="dim tiny">Draft saved {new Date(savedAt).toLocaleString()}</div>}

              <label className="answer-label">
                Input for input() (one value per line)
                <textarea
                  className="answer-box"
                  rows={2}
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Optional stdin…"
                />
              </label>

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
                    {engine.result.incomplete ? " · incomplete" : ""}
                  </span>
                </div>
              )}

              {err && (
                <div className="explanation-box">
                  <h4>Error</h4>
                  <p className="error">
                    {err.type}: {err.message}
                    {err.line ? ` (line ${err.line})` : ""}
                  </p>
                </div>
              )}
            </div>

            <div className="workspace-right">
              <VisualizeAs event={engine.event} binding={vizBinding} onChange={setVizBinding} />
              {vizBinding && engine.event && !stale && (
                <div className="viz-slot">
                  <Visualizer event={engine.event} binding={vizBinding} />
                </div>
              )}
              <VariablesPanel event={stale ? undefined : engine.event} output={stale ? "" : engine.outputSoFar} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
