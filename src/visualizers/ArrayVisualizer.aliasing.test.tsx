/**
 * R9 / B1 finding 3 — aliasing must be visible in the RENDERED UI, derived
 * purely from recorded reference ids (never by re-executing learner code).
 *
 * These are rendered-output tests: they build real TraceEvent snapshots (as the
 * tracer would emit them) for three moments of the `variables-and-types`
 * program and assert what the ArrayVisualizer draws:
 *   - before aliasing: `scores` alone — no "same object" note;
 *   - after `best = scores`: `scores` and `best` carry the SAME ref id, so the
 *     view labels them as one shared object;
 *   - after `independent = list(scores)`: the copy carries a DIFFERENT ref id,
 *     so it is NOT labelled as sharing — the view distinguishes copy from alias.
 *
 * Printing `best is scores` in the program is useful, but these tests enforce
 * the VISUAL requirement independently of any print output.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { aliasNames } from "./helpers";
import type { TraceEvent, TraceObject, TraceValue, VisualBinding } from "../core/types";

afterEach(cleanup);

const ref = (id: string): TraceValue => ({ kind: "ref", id });
const listObj = (id: string, values: number[]): TraceObject => ({
  id,
  type: "list",
  entries: values.map((v, i) => ({ key: String(i), value: { kind: "int", value: v } })),
});

/** Build a one-frame event from a map of variable name -> list object id, plus
 *  the object table. Several names may point at the SAME id (aliasing). */
function moduleEvent(
  bindings: Record<string, string>,
  objects: Record<string, TraceObject>,
): TraceEvent {
  return {
    index: 0,
    kind: "line",
    line: 1,
    frames: [
      {
        name: "<module>",
        line: 1,
        locals: Object.entries(bindings).map(([name, id]) => ({ name, value: ref(id) })),
      },
    ],
    objects,
  };
}

const arrayBinding = (variable: string): VisualBinding => ({ variable, model: "array" });

describe("ArrayVisualizer aliasing — from recorded reference ids", () => {
  it("before aliasing, scores shows NO 'same object' note", () => {
    const objects = { L1: listObj("L1", [10, 20, 30]) };
    const ev = moduleEvent({ scores: "L1" }, objects);
    expect(aliasNames(ev, { variable: "scores" })).toEqual([]);
    const { container } = render(<ArrayVisualizer event={ev} binding={arrayBinding("scores")} />);
    expect(container.querySelector(".alias-note")).toBeNull();
  });

  it("after best = scores, the view labels scores and best as ONE shared object", () => {
    // Both names point at the SAME object id — that is aliasing.
    const objects = { L1: listObj("L1", [10, 20, 30]) };
    const ev = moduleEvent({ scores: "L1", best: "L1" }, objects);

    // Snapshot-only identity: same ref id across the two locals.
    expect(aliasNames(ev, { variable: "scores" })).toEqual(["best"]);
    expect(aliasNames(ev, { variable: "best" })).toEqual(["scores"]);

    const { container } = render(<ArrayVisualizer event={ev} binding={arrayBinding("scores")} />);
    const note = container.querySelector(".alias-note");
    expect(note).not.toBeNull();
    expect(note!.textContent).toContain("same object");
    expect(note!.textContent).toContain("best");
  });

  it("after independent = list(scores), the copy is NOT labelled as shared", () => {
    // scores & best share L1; independent is a DIFFERENT object L2 (a copy).
    const objects = {
      L1: listObj("L1", [10, 20, 30, 40]),
      L2: listObj("L2", [10, 20, 30, 40]),
    };
    const ev = moduleEvent({ scores: "L1", best: "L1", independent: "L2" }, objects);

    // independent shares with nobody; scores still shares only with best.
    expect(aliasNames(ev, { variable: "independent" })).toEqual([]);
    expect(aliasNames(ev, { variable: "scores" }).sort()).toEqual(["best"]);

    // The independent list renders with NO shared-object note…
    const indView = render(<ArrayVisualizer event={ev} binding={arrayBinding("independent")} />);
    expect(indView.container.querySelector(".alias-note")).toBeNull();
    cleanup();

    // …while scores still shows it shares one object with best (and NOT with independent).
    const scoresView = render(<ArrayVisualizer event={ev} binding={arrayBinding("scores")} />);
    const note = scoresView.container.querySelector(".alias-note");
    expect(note).not.toBeNull();
    expect(note!.textContent).toContain("best");
    expect(note!.textContent).not.toContain("independent");
  });

  it("equal CONTENTS but different ids are NOT reported as aliases (identity, not equality)", () => {
    // Two distinct list objects with identical elements must not be called the
    // same object — this is identity (ref id), not value equality.
    const objects = {
      L1: listObj("L1", [1, 2, 3]),
      L2: listObj("L2", [1, 2, 3]),
    };
    const ev = moduleEvent({ a: "L1", b: "L2" }, objects);
    expect(aliasNames(ev, { variable: "a" })).toEqual([]);
    const { container } = render(<ArrayVisualizer event={ev} binding={arrayBinding("a")} />);
    expect(container.querySelector(".alias-note")).toBeNull();
  });
});
