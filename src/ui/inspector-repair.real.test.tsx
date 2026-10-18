import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TraceEvent } from "../core/types";
import { VariablesPanel } from "./VariablesPanel";
// @ts-expect-error The bundled runtime harness is JavaScript.
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

afterEach(cleanup);
let events: TraceEvent[] = [];

beforeAll(async () => {
  const result = await runProgram([
    "scores = [10, 20]",
    "best = scores",
    "independent = list(scores)",
    "scores.append(scores)",
    "def inspect_arg(scores):",
    "    first = scores[0]",
    "    return scores",
    "returned = inspect_arg(scores)",
    "print(len(scores))",
  ].join("\n"), "");
  expect(result.status).toBe("completed");
  events = result.events;
}, 120_000);

function rootWith(name: string) {
  const event = events.find((event) => event.frames[0]?.locals.some((local) => local.name === name));
  if (!event) throw new Error(`Missing actual recorded state for ${name}`);
  return event;
}

describe("inspector repair from actual bundled Python snapshots", () => {
  it("uses actual alias and copy IDs, then restores exact earlier contents on backwards replay", () => {
    const beforeAlias = rootWith("scores");
    const afterCopy = rootWith("independent");
    const scores = afterCopy.frames[0].locals.find((local) => local.name === "scores")!.value;
    const independent = afterCopy.frames[0].locals.find((local) => local.name === "independent")!.value;
    expect(scores.kind).toBe("ref");
    expect(independent.kind).toBe("ref");
    if (scores.kind !== "ref" || independent.kind !== "ref") throw new Error("Expected recorded refs");
    expect(scores.id).not.toBe(independent.id);
    const { container, rerender } = render(<VariablesPanel event={afterCopy} output="" />);
    expect(container.querySelector('[data-inspector-label="best"]')).toHaveAttribute("data-object-id", scores.id);
    expect(container.querySelector('[data-inspector-label="best"] .oi-alias')).toHaveTextContent("shared with scores");
    expect(container.querySelector('[data-inspector-label="independent"]')).toHaveAttribute("data-object-id", independent.id);
    rerender(<VariablesPanel event={beforeAlias} output="" />);
    expect(container.querySelector('[data-inspector-label="best"]')).toBeNull();
    expect(container.querySelector(".oi-alias")).toBeNull();
    expect(screen.getByText("[0]")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders a real self-cycle finitely and keeps frame variables scoped", async () => {
    const call = events.find((event) => event.frames.at(-1)?.name === "inspect_arg" && event.frames.at(-1)?.locals.some((local) => local.name === "first"));
    expect(call).toBeDefined();
    const { container } = render(<VariablesPanel event={call!} output="" />);
    expect(screen.getByRole("button", { name: /inspect_arg/ })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".oi-cycle")).toHaveTextContent(/Object obj_.*already shown/);
    expect(container.querySelector('[data-inspector-label="independent"]')).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /Main program/ }));
    expect(container.querySelector('[data-inspector-label="independent"]')).toBeInTheDocument();
  });

  it("renders the recorded return reference and output without re-execution", () => {
    const returned = events.find((event) => event.kind === "return" && event.frames.at(-1)?.name === "inspect_arg");
    expect(returned?.returnValue?.kind).toBe("ref");
    const { container } = render(<VariablesPanel event={returned!} output="3\n" />);
    expect(screen.getByRole("heading", { name: "Return value" })).toBeInTheDocument();
    if (returned?.returnValue?.kind !== "ref") throw new Error("Expected returned reference");
    expect(container.querySelector('[data-inspector-label="Returned"]')).toHaveAttribute("data-object-id", returned.returnValue.id);
    expect(screen.getByLabelText("Captured program output")).toHaveTextContent("3");
  });
});
