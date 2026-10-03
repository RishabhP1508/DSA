/**
 * R9 / B1 finding 3 (integration) — aliasing visible in the rendered UI from
 * ACTUAL bundled-tracer states (not hand-built fixtures).
 *
 * This runs the real `variables-and-types` lesson program through the bundled
 * Pyodide tracer, selects three genuine recorded states — before aliasing
 * (`scores` only), after `best = scores` (both share one object), and after
 * `independent = list(scores)` (the copy is a different object) — and renders
 * the ArrayVisualizer from each. It asserts the "same object as …" label is
 * driven by the recorded reference ids:
 *   - before aliasing: no label on `scores`;
 *   - after aliasing: `scores` is labelled as sharing with `best`;
 *   - after the copy: `independent` has no label and is NOT listed as sharing
 *     with `scores`.
 *
 * The synthetic clean-case unit tests live in `ArrayVisualizer.aliasing.test.tsx`;
 * this file is the end-to-end proof against real tracer output.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { variablesAndTypes } from "../content/lessons/variables-and-types";
// @ts-expect-error mjs harness has no types
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import type { TraceEvent, TraceValue, VisualBinding } from "../core/types";

afterEach(cleanup);

let events: TraceEvent[] = [];

beforeAll(async () => {
  const res = await runProgram(variablesAndTypes.code, variablesAndTypes.stdin ?? "");
  expect(res.status).toBe("completed");
  events = res.events as TraceEvent[];
}, 120_000);

const arrayBinding = (variable: string): VisualBinding => ({ variable, model: "array" });

/** Flatten a frame's locals into name -> value for the given event. */
function localsOf(ev: TraceEvent): Record<string, TraceValue> {
  const m: Record<string, TraceValue> = {};
  for (const f of ev.frames) for (const l of f.locals) m[l.name] = l.value;
  return m;
}
const has = (ev: TraceEvent, name: string) => name in localsOf(ev);

/** First recorded event satisfying a predicate (throws if none). */
function firstEvent(pred: (ev: TraceEvent) => boolean, label: string): TraceEvent {
  const e = events.find(pred);
  if (!e) throw new Error(`no recorded state: ${label}`);
  return e;
}

describe("aliasing (integration) — rendered from real variables-and-types tracer states", () => {
  it("captured real states exist for all three moments", () => {
    expect(events.length).toBeGreaterThan(0);
    // sanity: the program defines scores, best, independent at some point
    expect(events.some((e) => has(e, "scores"))).toBe(true);
    expect(events.some((e) => has(e, "best"))).toBe(true);
    expect(events.some((e) => has(e, "independent"))).toBe(true);
  });

  it("BEFORE aliasing: scores is in scope but best is not — no shared-object label", () => {
    const ev = firstEvent((e) => has(e, "scores") && !has(e, "best"), "scores before best");
    const { container } = render(<ArrayVisualizer event={ev} binding={arrayBinding("scores")} />);
    expect(container.querySelector(".alias-note")).toBeNull();
  });

  it("AFTER best = scores: the view labels scores as sharing one object with best", () => {
    const ev = firstEvent((e) => has(e, "best") && !has(e, "independent"), "best aliased, before copy");
    // Confirm from the real trace that the two names carry the SAME reference id.
    const m = localsOf(ev);
    expect(m.scores.kind).toBe("ref");
    expect(m.best.kind).toBe("ref");
    expect(m.scores.kind === "ref" && m.best.kind === "ref" && m.scores.id === m.best.id).toBe(true);

    const { container } = render(<ArrayVisualizer event={ev} binding={arrayBinding("scores")} />);
    const note = container.querySelector(".alias-note");
    expect(note).not.toBeNull();
    expect(note!.textContent).toContain("same object");
    expect(note!.textContent).toContain("best");
  });

  it("AFTER independent = list(scores): the copy is a different object, not labelled as shared", () => {
    const ev = firstEvent((e) => has(e, "independent"), "after copy");
    const m = localsOf(ev);
    // Real trace: independent has a DIFFERENT reference id from scores/best.
    expect(m.independent.kind).toBe("ref");
    expect(
      m.independent.kind === "ref" && m.scores.kind === "ref" && m.independent.id !== m.scores.id,
    ).toBe(true);

    // The independent list shows NO shared-object label…
    const indView = render(<ArrayVisualizer event={ev} binding={arrayBinding("independent")} />);
    expect(indView.container.querySelector(".alias-note")).toBeNull();
    cleanup();

    // …and scores still shares with best, but NOT with independent.
    const scoresView = render(<ArrayVisualizer event={ev} binding={arrayBinding("scores")} />);
    const note = scoresView.container.querySelector(".alias-note");
    expect(note).not.toBeNull();
    expect(note!.textContent).toContain("best");
    expect(note!.textContent).not.toContain("independent");
  });
});
