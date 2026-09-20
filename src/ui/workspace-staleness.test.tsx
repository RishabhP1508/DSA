/**
 * R4 amendment #3 (test-only): exercise the ACTUAL source-state sequence in both
 * LessonWorkspace and PatternWorkspace, rather than flipping a mocked `stale`
 * flag. The sequence, per the review:
 *
 *   original run → edit → run edited code → restore original (no rerun) → rerun original
 *
 * At each state we assert (a) the stale warning, (b) trace/playback availability,
 * and (c) authored explanation/diagram/complexity visibility.
 *
 * The fake engine models the REAL staleness rule: `run(src)` records the source
 * that produced the trace, and `isStale(curSource)` is `lastRunSource !==
 * curSource` (exactly what engine.ts stamps via sourceRev and replay.isStale
 * compares). Edits are driven through the real CodeMirror view so the
 * workspace's own `source` state advances like it does for a learner.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import type { TraceEvent, RunResult } from "../core/types";

// --- a stateful fake engine that models real staleness --------------------
type Listener = () => void;

class FakeEngine {
  ready = true;
  running = false;
  state = "idle";
  result: RunResult | null = null;
  event: TraceEvent | undefined = undefined;
  position = 0;
  length = 0;
  outputSoFar = "";
  playing = false;
  speed = 1;
  breakpoints = new Set<number>();

  private lastRunSource: string | null = null;
  private listeners = new Set<Listener>();

  subscribeRerender(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private notify() {
    for (const fn of this.listeners) fn();
  }

  // The workspace calls run(source, stdin). We record the source that produced
  // the trace and synthesize a completed result/event so traceMatchesEditor
  // becomes true for the CURRENT editor content.
  run = vi.fn((source: string) => {
    this.lastRunSource = source;
    const ev: TraceEvent = {
      index: 0,
      kind: "line",
      line: 5,
      frames: [{ name: "<module>", line: 5, locals: [] }],
      objects: {},
    };
    this.result = { runId: 1, status: "completed", events: [ev], stdout: "", stderr: "" };
    this.event = ev;
    this.length = 1;
    this.position = 0;
    this.notify();
  });

  stop = vi.fn();
  play = vi.fn(() => { this.playing = true; this.notify(); });
  pause = vi.fn(() => { this.playing = false; this.notify(); });
  setSpeed = vi.fn();
  toggleBreakpoint = vi.fn();
  seek = vi.fn();
  next = vi.fn();
  prev = vi.fn();
  restart = vi.fn();

  isStale(source: string) {
    if (this.result === null) return false;
    return this.lastRunSource !== source;
  }
}

let fake: FakeEngine;

vi.mock("./useEngine", () => ({
  PLAYBACK_SPEEDS: [0.5, 1, 2, 4],
  // Re-render the consuming workspace whenever the fake notifies.
  useEngine: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react") as typeof import("react");
    const [, force] = React.useState(0);
    React.useEffect(() => fake.subscribeRerender(() => force((n) => n + 1)), []);
    return fake;
  },
}));
vi.mock("../storage/progress", () => ({ markLessonViewed: vi.fn() }));

import { LessonWorkspace } from "./LessonWorkspace";
import { PatternWorkspace } from "./PatternWorkspace";
import type { LessonDefinition, PatternDefinition } from "../core/types";

const lesson: LessonDefinition = {
  id: "demo", title: "Demo", area: "DP and recursion", prerequisites: [],
  explanation: "", vocabulary: [],
  concepts: { purpose: "", operations: "", uses: "", tradeoffs: "", commonMistakes: "", edgeCases: "" },
  complexity: [],
  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "n" }], costModel: "unit",
    time: { bound: "O(n)", case: "worst", explanation: "" },
    space: { bound: "O(1)", case: "worst", explanation: "" },
    derivation: [], assumptions: [],
  },
  code: "x = 1\ny = 2\n",
  codeExplanations: [{ line: 5, executable: true, explanation: "AUTHORED-LINE-EXPLANATION" }],
  bindings: [{ variable: "x", model: "array" }],
  prediction: [], experiments: [], exercises: [], review: "", expectedOutput: "", references: [],
};

const pattern: PatternDefinition = {
  id: "demo-p", title: "DemoP", category: "DP", summary: "",
  clues: [], naiveApproach: "", whyItHelps: "", conditions: [], alternatives: [], counterexamples: [],
  walkthroughCode: "a = 1\nb = 2\n", walkthroughExpectedOutput: "",
  codeExplanations: [{ line: 5, executable: true, explanation: "AUTHORED-PATTERN-EXPLANATION" }],
  bindings: [{ variable: "a", model: "array" }],
  linkedLessons: [], exercises: [], references: [],
};

// --- helpers to drive the real editor + Run button ------------------------
import { EditorView } from "@codemirror/view";

function editorView(container: HTMLElement): EditorView {
  const host = container.querySelector(".code-editor") as HTMLElement;
  // EditorView.findFromDOM walks up from the CM content node.
  const content = host.querySelector(".cm-content") as HTMLElement;
  const view = EditorView.findFromDOM(content);
  if (!view) throw new Error("could not find the CodeMirror view");
  return view;
}

function setEditorText(container: HTMLElement, text: string) {
  const view = editorView(container);
  act(() => {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
  });
}

function clickRun(runLabel: RegExp = /^▶ Run$|Run$/) {
  const btn = screen.getByRole("button", { name: runLabel });
  act(() => {
    btn.click();
  });
}

const warning = () => screen.queryByRole("status");
const playBtn = () => screen.getByRole("button", { name: /Play/ }) as HTMLButtonElement;

beforeEach(() => {
  fake = new FakeEngine();
});
afterEach(cleanup);

describe("LessonWorkspace — full source-state sequence (original→edit→run edited→restore→rerun)", () => {
  it("shows/hides the stale warning, trace panels and authored content correctly at each state", () => {
    const { container } = render(<LessonWorkspace lesson={lesson} />);

    // State A — original code, fresh original run.
    clickRun();
    expect(warning()).not.toBeInTheDocument();
    expect(screen.getByText("AUTHORED-LINE-EXPLANATION")).toBeInTheDocument(); // authored shown
    expect(playBtn()).not.toBeDisabled(); // trace/playback available

    // State B — edit the code (no rerun). Trace is now from the OLD original run
    // → stale. Authored hidden; stale warning; playback disabled.
    setEditorText(container, "x = 999\ny = 2\n");
    expect(warning()).toBeInTheDocument();
    expect(screen.queryByText("AUTHORED-LINE-EXPLANATION")).not.toBeInTheDocument();
    expect(playBtn()).toBeDisabled();

    // State C — run the EDITED code. Trace now matches the editor (not stale)
    // but the editor differs from the authored source → edited.
    clickRun();
    // Trace/playback available again (fresh edited trace)...
    expect(playBtn()).not.toBeDisabled();
    // ...but authored explanation stays hidden (edited away from the lesson).
    expect(screen.queryByText("AUTHORED-LINE-EXPLANATION")).not.toBeInTheDocument();
    // The "edited, restore original" banner is shown (edited && !stale).
    expect(warning()).toBeInTheDocument();

    // State D — restore the ORIGINAL text WITHOUT rerunning. edited === false,
    // but the last run was the edited one → stale. Authored must stay hidden and
    // the stale warning must reappear (the reported regression).
    setEditorText(container, lesson.code);
    expect(warning()).toBeInTheDocument();
    expect(screen.queryByText("AUTHORED-LINE-EXPLANATION")).not.toBeInTheDocument();
    expect(playBtn()).toBeDisabled(); // stale → playback disabled

    // State E — rerun the ORIGINAL code. Back to fully valid.
    clickRun();
    expect(warning()).not.toBeInTheDocument();
    expect(screen.getByText("AUTHORED-LINE-EXPLANATION")).toBeInTheDocument();
    expect(playBtn()).not.toBeDisabled();
  });
});

describe("PatternWorkspace — full source-state sequence", () => {
  it("shows/hides the stale warning, trace panels and authored content correctly at each state", () => {
    const { container } = render(<PatternWorkspace pattern={pattern} />);

    // A — original walkthrough, fresh run.
    clickRun();
    expect(warning()).not.toBeInTheDocument();
    expect(screen.getByText("AUTHORED-PATTERN-EXPLANATION")).toBeInTheDocument();
    expect(playBtn()).not.toBeDisabled();

    // B — edit, no rerun → stale.
    setEditorText(container, "a = 42\nb = 2\n");
    expect(warning()).toBeInTheDocument();
    expect(screen.queryByText("AUTHORED-PATTERN-EXPLANATION")).not.toBeInTheDocument();
    expect(playBtn()).toBeDisabled();

    // C — run edited → trace current, authored hidden (edited).
    clickRun();
    expect(playBtn()).not.toBeDisabled();
    expect(screen.queryByText("AUTHORED-PATTERN-EXPLANATION")).not.toBeInTheDocument();
    expect(warning()).toBeInTheDocument();

    // D — restore original text, no rerun → stale, authored hidden, warning shown.
    setEditorText(container, pattern.walkthroughCode);
    expect(warning()).toBeInTheDocument();
    expect(screen.queryByText("AUTHORED-PATTERN-EXPLANATION")).not.toBeInTheDocument();
    expect(playBtn()).toBeDisabled();

    // E — rerun original → fully valid.
    clickRun();
    expect(warning()).not.toBeInTheDocument();
    expect(screen.getByText("AUTHORED-PATTERN-EXPLANATION")).toBeInTheDocument();
    expect(playBtn()).not.toBeDisabled();
  });
});
