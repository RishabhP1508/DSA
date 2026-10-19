import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TraceEvent, TraceObject } from "../core/types";
import { ObjectInspector } from "./ObjectInspector";
import { VariablesPanel } from "./VariablesPanel";

afterEach(cleanup);

const objects: Record<string, TraceObject> = {
  shared: { id: "shared", type: "list", entries: [{ key: "0", value: { kind: "int", value: 10 } }] },
  copy: { id: "copy", type: "list", entries: [{ key: "0", value: { kind: "int", value: 10 } }] },
};
const event: TraceEvent = {
  index: 5, kind: "line", line: 19, objects,
  frames: [{ name: "<module>", line: 19, locals: [
    { name: "score", value: { kind: "float", value: 42.5 } },
    { name: "scores", value: { kind: "ref", id: "shared" } },
    { name: "best", value: { kind: "ref", id: "shared" } },
    { name: "independent", value: { kind: "ref", id: "copy" } },
  ] }],
};

describe("inspector repair: readable structure and recorded identity", () => {
  it("gives names, types and values separate cells with an explicit index", () => {
    const { container } = render(<VariablesPanel event={event} output="" />);
    expect(screen.getByText("Name / key")).toBeInTheDocument();
    const score = container.querySelector('[data-inspector-label="score"]')!;
    expect(score.querySelector(".oi-key")).toHaveTextContent("score");
    expect(score.querySelector(".oi-type")).toHaveTextContent("float");
    expect(score.querySelector(".oi-value")).toHaveTextContent("42.5");
    expect(screen.getAllByText("[0]").length).toBeGreaterThan(0);
  });

  it("identifies aliases by ID, keeps copies distinct, and initially expands shared contents once", () => {
    const { container } = render(<VariablesPanel event={event} output="" />);
    const scores = container.querySelector('[data-inspector-label="scores"]')!;
    const best = container.querySelector('[data-inspector-label="best"]')!;
    const copy = container.querySelector('[data-inspector-label="independent"]')!;
    expect(scores).toHaveAttribute("data-object-id", "shared");
    expect(best).toHaveAttribute("data-object-id", "shared");
    expect(copy).toHaveAttribute("data-object-id", "copy");
    expect(scores.querySelector(".oi-identity")).toHaveTextContent("Object shared");
    expect(best.querySelector(".oi-alias")).toHaveTextContent("shared with scores");
    expect(copy.querySelector(".oi-alias")).toBeNull();
    expect(within(best as HTMLElement).getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(within(scores as HTMLElement).getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("calls the module Main program and resets frame selection when stack shape changes", async () => {
    const user = userEvent.setup();
    const called: TraceEvent = { ...event, frames: [...event.frames,
      { name: "add", line: 2, locals: [{ name: "arg", value: { kind: "int", value: 7 } }] }] };
    const { rerender } = render(<VariablesPanel event={called} output="" />);
    const main = screen.getByRole("button", { name: /Main program/ });
    await user.click(main);
    expect(main).toHaveAttribute("aria-pressed", "true");
    rerender(<VariablesPanel event={{ ...called, frames: [...called.frames,
      { name: "helper", line: 3, locals: [{ name: "inner", value: { kind: "int", value: 8 } }] }] }} output="" />);
    expect(screen.getByRole("button", { name: /helper/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("inner")).toBeInTheDocument();
    // A later invocation with the old shape must not resurrect the old choice.
    rerender(<VariablesPanel event={event} output="" />);
    rerender(<VariablesPanel event={called} output="" />);
    expect(screen.getByRole("button", { name: /add/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("supports keyboard expansion and keeps a cyclic reference tied to its recorded ID", async () => {
    const user = userEvent.setup();
    const cyclic = { self: { id: "self", type: "list", entries: [{ key: "0", value: { kind: "ref" as const, id: "self" } }] } };
    const { container } = render(<ObjectInspector value={{ kind: "ref", id: "self" }} objects={cyclic} label="cycle" />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector(".oi-cycle")).toHaveTextContent("Object self");
    expect(container.querySelector(".oi-cycle")).toHaveTextContent("already shown");
  });

  it("pages entries, shows recorded omissions and never silently calls unknown objects empty", async () => {
    const entries = Array.from({ length: 55 }, (_, i) => ({ key: String(i), value: { kind: "int" as const, value: i + 100 } }));
    render(<ObjectInspector value={{ kind: "ref", id: "many" }} objects={{ many: { id: "many", type: "list", entries, truncated: true } }} label="many" defaultExpanded />);
    expect(screen.queryByText("154")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /show more/i }));
    expect(screen.getByText("154")).toBeInTheDocument();
    expect(screen.getByText(/omitted during inspection/)).toBeInTheDocument();
    cleanup();
    render(<ObjectInspector value={{ kind: "ref", id: "opaque" }} objects={{ opaque: { id: "opaque", type: "Custom" } }} label="opaque" defaultExpanded />);
    expect(screen.queryByText(/empty/)).not.toBeInTheDocument();
    expect(screen.getByText(/No attributes were recorded/)).toBeInTheDocument();
  });

  it("bounds long text in the DOM while allowing every recorded character to be paged", async () => {
    const huge = "1".repeat(40_000) + "END";
    const { container } = render(<ObjectInspector value={{ kind: "int", value: huge }} objects={{}} label="huge" />);
    expect(container.innerHTML).not.toContain(huge);
    expect(container.textContent!.length).toBeLessThan(1_000);
    await userEvent.click(screen.getByRole("button", { name: /inspect.*text/i }));
    expect(screen.getByText(/Characters 1–1000 of 40003/)).toBeInTheDocument();
    expect(container.innerHTML).not.toContain(huge);
    expect(screen.getByRole("button", { name: /next.*text/i })).toBeEnabled();
  });

  it("does not put a huge dictionary key into a text node, title or data attribute", () => {
    const hugeKey = "key".repeat(15_000);
    const { container } = render(<ObjectInspector value={{ kind: "ref", id: "dict" }} objects={{
      dict: { id: "dict", type: "dict", entries: [{ key: hugeKey, keyKind: "str", value: { kind: "int", value: 7 } }] },
    }} label="dict" defaultExpanded />);
    expect(container.innerHTML).not.toContain(hugeKey);
    expect(container.innerHTML.length).toBeLessThan(5_000);
    expect(screen.getByRole("button", { name: /inspect.*text/i })).toBeInTheDocument();
  });

  it("labels sets as recorded items rather than inventing index positions", () => {
    render(<ObjectInspector value={{ kind: "ref", id: "set" }} objects={{
      set: { id: "set", type: "set", entries: [{ key: "0", value: { kind: "int", value: 7 } }] },
    }} label="set" defaultExpanded />);
    expect(screen.getByText("item 1")).toBeInTheDocument();
    expect(screen.queryByText("[0]")).not.toBeInTheDocument();
    expect(screen.getByText(/set has no index positions/)).toBeInTheDocument();
  });

  it("bounds output and error text too, without losing access to recorded text pages", () => {
    const huge = "output".repeat(8_000);
    const { container } = render(<VariablesPanel event={{ ...event, error: { type: "ValueError", message: huge } }} output={huge} />);
    expect(container.innerHTML).not.toContain(huge);
    expect(screen.getAllByRole("button", { name: /Inspect text/ })).toHaveLength(2);
    expect(screen.getByLabelText("Captured program output").textContent!.length).toBeLessThan(500);
  });

  it("bounds very long frame names in buttons and headings with an inspectable selected-frame detail", async () => {
    const name = "long_function_name_".repeat(1500);
    const { container } = render(<VariablesPanel event={{ ...event, frames: [event.frames[0], { name, line: 3, locals: [] }] }} output="" />);
    expect(container.innerHTML).not.toContain(name);
    expect(container.querySelector(".frame-name")!.textContent!.length).toBeLessThan(120);
    await userEvent.click(screen.getByText("Full selected frame name"));
    expect(screen.getByRole("button", { name: /Inspect text/ })).toBeInTheDocument();
    expect(container.innerHTML).not.toContain(name);
  });

  it("bounds shared-name summaries while full variable names remain inspectable", () => {
    const longName = "alias_name_".repeat(1000);
    const aliases = Array.from({ length: 8 }, (_, index) => ({ name: `${longName}${index}`, value: { kind: "ref" as const, id: "shared" } }));
    const { container } = render(<VariablesPanel event={{ ...event, frames: [{ name: "<module>", line: 2, locals: aliases }] }} output="" />);
    expect(container.innerHTML.includes(longName)).toBe(false);
    for (const summary of container.querySelectorAll(".oi-alias")) expect(summary.textContent!.length).toBeLessThan(400);
    expect(screen.getAllByText("Full name / key:", { exact: false }).length).toBe(8);
    expect(screen.getAllByRole("button", { name: /Inspect text/ })).toHaveLength(8);
  });

  it("keeps frame-local shadowed names separate rather than inventing an alias", async () => {
    const shadowed: TraceEvent = { ...event, frames: [event.frames[0], {
      name: "f", line: 2, locals: [{ name: "scores", value: { kind: "ref", id: "copy" } }],
    }] };
    const { container } = render(<VariablesPanel event={shadowed} output="" />);
    expect(container.querySelector('[data-inspector-label="scores"]')).toHaveAttribute("data-object-id", "copy");
    expect(container.querySelector(".oi-alias")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /Main program/ }));
    expect(container.querySelector('[data-inspector-label="scores"]')).toHaveAttribute("data-object-id", "shared");
  });
});
