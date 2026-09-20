/**
 * R4 amendment #2: "Visualize as…" must let a learner choose graph DIRECTION,
 * pass it into VisualBinding.directed, and PRESERVE it across variable/path
 * changes. Written before the fix — the current control drops `directed`.
 */
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { useState } from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VisualizeAs } from "./VisualizeAs";
import type { TraceEvent, VisualBinding } from "../core/types";

afterEach(cleanup);
beforeEach(() => {
  lastBinding = null;
});

function evWith(names: string[]): TraceEvent {
  return {
    index: 0, kind: "line", line: 1,
    frames: [{ name: "<module>", line: 1, locals: names.map((n) => ({ name: n, value: { kind: "int", value: 0 } })) }],
    objects: {},
  };
}

/** Render VisualizeAs as a controlled component that records the latest binding
 *  emitted via onChange (captured through the mutable `seen` ref below). */
let lastBinding: VisualBinding | null = null;
function Harness({ event, initial }: { event: TraceEvent; initial: VisualBinding | null }) {
  const [b, setB] = useState<VisualBinding | null>(initial);
  return (
    <VisualizeAs
      event={event}
      binding={b}
      onChange={(nb) => {
        lastBinding = nb;
        setB(nb);
      }}
    />
  );
}

describe("VisualizeAs — graph direction control", () => {
  it("shows a Directed/Undirected control only when the graph model is selected", async () => {
    render(<Harness event={evWith(["g"])} initial={{ variable: "g", model: "array" }} />);
    // Not a graph → no direction control.
    expect(screen.queryByLabelText(/direction/i)).not.toBeInTheDocument();
    // Switch to graph → the control appears.
    await userEvent.selectOptions(screen.getByLabelText("Diagram family"), "graph");
    expect(screen.getByLabelText(/direction/i)).toBeInTheDocument();
  });

  it("passes the chosen direction into VisualBinding.directed", async () => {
    render(<Harness event={evWith(["g"])} initial={{ variable: "g", model: "graph" }} />);
    const dir = screen.getByLabelText(/direction/i);
    await userEvent.selectOptions(dir, "directed");
    expect(lastBinding).toMatchObject({ variable: "g", model: "graph", directed: true });
    await userEvent.selectOptions(dir, "undirected");
    expect(lastBinding).toMatchObject({ variable: "g", model: "graph", directed: false });
  });

  it("PRESERVES directed when the learner changes the variable", async () => {
    render(<Harness event={evWith(["g", "h"])} initial={{ variable: "g", model: "graph", directed: true }} />);
    await userEvent.selectOptions(screen.getByLabelText("Variable to visualize"), "h");
    expect(lastBinding).toMatchObject({ variable: "h", model: "graph", directed: true });
  });

  it("PRESERVES directed when the learner changes the field path", async () => {
    render(<Harness event={evWith(["g"])} initial={{ variable: "g", model: "graph", directed: true }} />);
    await userEvent.type(screen.getByLabelText("Optional field path"), "adj");
    expect(lastBinding).toMatchObject({ variable: "g", model: "graph", directed: true, path: "adj" });
  });
});
