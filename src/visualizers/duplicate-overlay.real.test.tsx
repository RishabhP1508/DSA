// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { lessons } from "../content/registry";
import type { TraceEvent } from "../core/types";
// @ts-expect-error JavaScript verification harness.
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

describe("duplicate scan: values are not indices", () => {
  it("renders every real snapshot without a false pointer, with an old-binding positive control", async () => {
    const lesson = lessons.find((x) => x.id === "duplicate-detection")!;
    const result = await runProgram(lesson.code, "");
    expect(result.status).toBe("completed");
    let relevant = 0;
    let oldBindingHighlights = false;
    for (const event of result.events as TraceEvent[]) {
      if (!event.frames.some((f) => f.locals.some((l) => l.name === "nums"))) continue;
      relevant++;
      const binding = lesson.bindings[0];
      const actual = renderToStaticMarkup(<ArrayVisualizer event={event} binding={binding} />);
      expect(actual).not.toContain("cell-active");
      const old = renderToStaticMarkup(<ArrayVisualizer event={event} binding={{ ...binding, overlays: [{ role: "pointer", label: "x", source: "x" }] }} />);
      oldBindingHighlights ||= old.includes("cell-active");
    }
    expect(relevant).toBeGreaterThan(0);
    expect(oldBindingHighlights).toBe(true);
  }, 120_000);
});
