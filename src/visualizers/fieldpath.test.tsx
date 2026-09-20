/**
 * R4 follow-up #3: "Visualize as…" offers an optional field path, but the string
 * and bit renderers previously read only the ROOT variable. They must resolve
 * `binding.path` from the recorded snapshot and render the selected nested value.
 *
 * Rendered-output tests written before the fix.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { StringVisualizer } from "./StringVisualizer";
import { BitsVisualizer } from "./BitsVisualizer";
import type { TraceEvent, TraceObject, VisualBinding } from "../core/types";

afterEach(cleanup);

/** An object `obj` with attributes name: "hi" (str) and count: 5 (int). */
function objEvent(): TraceEvent {
  const objects: Record<string, TraceObject> = {
    o1: {
      id: "o1",
      type: "Item",
      entries: [
        { key: "name", value: { kind: "str", value: "hi" } },
        { key: "count", value: { kind: "int", value: 5 } },
      ],
    },
  };
  return {
    index: 0, kind: "line", line: 1,
    frames: [{ name: "<module>", line: 1, locals: [{ name: "obj", value: { kind: "ref", id: "o1" } }] }],
    objects,
  };
}

describe("StringVisualizer — reads a nested field path", () => {
  it("renders obj.name ('hi') as characters when path='name'", () => {
    const binding: VisualBinding = { variable: "obj", path: "name", model: "string" };
    const { container } = render(<StringVisualizer event={objEvent()} binding={binding} />);
    // Character cells for 'h' and 'i'.
    const cells = Array.from(container.querySelectorAll("text.cell-value")).map((t) => t.textContent);
    expect(cells).toContain("h");
    expect(cells).toContain("i");
    // Not the "no string" placeholder.
    expect(container.querySelector(".viz-empty")).toBeNull();
  });
});

describe("BitsVisualizer — reads a nested field path", () => {
  it("renders obj.count (5) as bits when path='count'", () => {
    const binding: VisualBinding = { variable: "obj", path: "count", model: "bits" };
    const { container } = render(<BitsVisualizer event={objEvent()} binding={binding} />);
    const bits = Array.from(container.querySelectorAll("text.cell-value-sm")).map((t) => t.textContent).join("");
    expect(bits.endsWith("00000101")).toBe(true); // 5 = 101
    expect(container.querySelector(".viz-empty")).toBeNull();
  });
});
