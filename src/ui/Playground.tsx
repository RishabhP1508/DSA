/**
 * Code Playground — run your own single-file Python with real tracing.
 *
 * Reuses the same execution engine, replay controls, and inspection panels as
 * lessons. Personal code gets execution-state inspection only (no invented
 * claims about intent). Drafts save to IndexedDB; optional stdin feeds input().
 */

import { useEffect, useState } from "react";
import { useEngine } from "./useEngine";
import { CodeEditor } from "./CodeEditor";
import { VariablesPanel } from "./VariablesPanel";
import { loadDraft, saveDraft } from "../storage/progress";

const STARTER = `# Write any single-file Python here and press Run.
# Supported: builtins, collections, heapq, bisect, math, functools.
def demo(nums):
    total = 0
    for x in nums:
        total += x
    return total

print(demo([3, 1, 4, 1, 5]))
`;

const SLOT = "playground";

export function Playground() {
  const engine = useEngine();
  const [source, setSource] = useState(STARTER);
  const [stdin, setStdin] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

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

  const currentLine = engine.event?.line ?? null;
  const err = engine.result?.error;

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
                <button onClick={engine.restart} disabled={!engine.result}>⏮ Restart</button>
                <button onClick={engine.prev} disabled={!engine.result || engine.position <= 0}>‹ Prev</button>
                <button onClick={engine.next} disabled={!engine.result || engine.position >= engine.length - 1}>
                  Next ›
                </button>
                <span className="spacer" />
                <button onClick={save} disabled={!loaded}>💾 Save draft</button>
              </div>

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
                  />
                  <span className="dim">
                    step {engine.position + 1} / {engine.length} · {engine.result.status}
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
              <VariablesPanel event={engine.event} output={engine.outputSoFar} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
