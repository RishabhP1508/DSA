import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VariablesPanel } from "./VariablesPanel";
import type { TraceEvent } from "../core/types";

describe("VariablesPanel", () => {
  it("prompts to run when there is no event", () => {
    render(<VariablesPanel event={undefined} output="" />);
    expect(screen.getByText(/Run the program to inspect state/i)).toBeInTheDocument();
  });

  it("renders a local variable and output from a trace event", () => {
    const event: TraceEvent = {
      index: 0,
      kind: "line",
      line: 1,
      frames: [
        { name: "<module>", line: 1, locals: [{ name: "x", value: { kind: "int", value: 42 } }] },
      ],
      objects: {},
      output: undefined,
    };
    render(<VariablesPanel event={event} output="hello\n" />);
    // variable name and value are shown
    expect(screen.getByText("x")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    // output panel shows captured stdout
    expect(screen.getByText(/hello/)).toBeInTheDocument();
  });
});
