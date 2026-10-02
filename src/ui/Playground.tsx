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
import { PersonalComplexityPanel } from "./PersonalComplexityPanel";
import { ComparisonLab } from "./ComparisonLab";
import { VisualizeAs } from "./VisualizeAs";
import { Visualizer } from "../visualizers";
import {
  saveDraft,
  listDrafts,
  loadDraft,
  deleteDraft,
  lastDraftSlot,
  type Draft,
} from "../storage/progress";
import { readPythonFile, exportPythonFile } from "./python-file";
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

const DEFAULT_SLOT = "playground";

function slotLabel(slot: string): string {
  return slot === DEFAULT_SLOT ? "Scratchpad" : slot;
}

export function Playground() {
  const engine = useEngine("playground");
  const [source, setSource] = useState(STARTER);
  const [stdin, setStdin] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [vizBinding, setVizBinding] = useState<VisualBinding | null>(null);
  const [slot, setSlot] = useState<string>(DEFAULT_SLOT);
  const [drafts, setDrafts] = useState<{ slot: string; draft: Draft }[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  // R4.1: the trace is stale once the editor source/stdin no longer matches the
  // result it was produced from.
  const stale = engine.isStale(source, stdin);

  const refreshDrafts = async () => setDrafts(await listDrafts());

  // R8.3 — restore the LAST SELECTED draft once (falling back to the default
  // slot), and load the draft list.
  useEffect(() => {
    let alive = true;
    void (async () => {
      const last = (await lastDraftSlot()) ?? DEFAULT_SLOT;
      const d = await loadDraft(last);
      if (alive) {
        if (d) {
          setSlot(last);
          setSource(d.source);
          setStdin(d.stdin ?? "");
          setVizBinding((d.binding as VisualBinding | null) ?? null);
          setSavedAt(d.savedAt);
        }
        await refreshDrafts();
        setLoaded(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // R8.3 — save source + stdin + the current binding under the active slot.
  const save = async () => {
    const name = drafts.find((x) => x.slot === slot)?.draft.name ?? slotLabel(slot);
    const d = await saveDraft(slot, source, { stdin, name, binding: vizBinding ?? undefined });
    setSavedAt(d.savedAt);
    setStatus(`Saved “${name}”.`);
    await refreshDrafts();
  };

  const switchDraft = async (nextSlot: string) => {
    const d = await loadDraft(nextSlot);
    setSlot(nextSlot);
    if (d) {
      setSource(d.source);
      setStdin(d.stdin ?? "");
      setVizBinding((d.binding as VisualBinding | null) ?? null);
      setSavedAt(d.savedAt);
      setStatus(`Opened “${d.name ?? slotLabel(nextSlot)}”.`);
    }
  };

  const newDraft = async () => {
    const nextSlot = `draft-${Date.now()}`;
    const name = `Draft ${drafts.length + 1}`;
    await saveDraft(nextSlot, STARTER, { stdin: "", name });
    setSlot(nextSlot);
    setSource(STARTER);
    setStdin("");
    setVizBinding(null);
    setStatus(`Created “${name}”.`);
    await refreshDrafts();
  };

  const removeDraft = async () => {
    await deleteDraft(slot);
    setStatus(`Deleted this draft.`);
    const remaining = (await listDrafts()).filter((x) => x.slot !== slot);
    setDrafts(remaining);
    if (remaining.length) await switchDraft(remaining[0].slot);
    else {
      setSlot(DEFAULT_SLOT);
      setSource(STARTER);
      setStdin("");
    }
  };

  // R8.3 — import a Python file into a NEW draft (never overwriting another);
  // the imported code runs only when the learner presses Run.
  const importFile = async (file: File | null) => {
    if (!file) return;
    const res = await readPythonFile(file);
    if (!res.ok) {
      setStatus(`Import failed: ${res.error}`);
      return;
    }
    const nextSlot = `import-${Date.now()}`;
    const name = file.name.replace(/\.py$/i, "") || "Imported";
    await saveDraft(nextSlot, res.source, { stdin: "", name });
    setSlot(nextSlot);
    setSource(res.source);
    setStdin("");
    setVizBinding(null);
    setStatus(`Imported “${name}” into a new draft (press Run to execute).`);
    await refreshDrafts();
  };

  // While stale, stop highlighting the old trace's line (it no longer maps to
  // the edited source), but keep the recorded trace, output and error visible —
  // this is the learner's own program.
  const currentLine = stale ? null : engine.event?.line ?? null;
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

              {/* R8.3 — named drafts, import/export, clear save status. */}
              <div className="toolbar draft-bar">
                <label className="speed-control">
                  Draft
                  <select
                    aria-label="Select draft"
                    value={slot}
                    onChange={(e) => void switchDraft(e.target.value)}
                  >
                    {drafts.length === 0 && <option value={DEFAULT_SLOT}>{slotLabel(DEFAULT_SLOT)}</option>}
                    {drafts.map(({ slot: s, draft }) => (
                      <option key={s} value={s}>{draft.name ?? slotLabel(s)}</option>
                    ))}
                  </select>
                </label>
                <button onClick={() => void newDraft()} disabled={!loaded}>＋ New draft</button>
                <button onClick={() => void removeDraft()} disabled={!loaded || drafts.length === 0}>🗑 Delete</button>
                <span className="spacer" />
                <label className="import-btn">
                  📂 Import .py
                  <input
                    type="file"
                    accept=".py,text/x-python,text/plain"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      void importFile(e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button onClick={() => exportPythonFile(source, slotLabel(slot))}>💾 Export .py</button>
              </div>
              {status && <div className="dim tiny save-status" role="status">{status}</div>}
              {stale && engine.result && (
                <div className="stale-banner" role="status">
                  ⚠ Source or input changed since this run — the trace below is outdated (it predates
                  your edit). Run again to refresh it.
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
              {vizBinding && engine.event && (
                <div className="viz-slot">
                  <Visualizer event={engine.event} binding={vizBinding} />
                </div>
              )}
              {/* Playground code is the learner's own — no authored artifacts to
                  disable. The recorded trace stays available after an edit; the
                  banner just notes it predates the edit until re-run. */}
              <VariablesPanel event={engine.event} output={engine.outputSoFar} />
              <PersonalComplexityPanel
                result={engine.result}
                currentIndex={engine.position}
                stale={stale}
              />
              <ComparisonLab />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
