import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TraceEvent } from "../core/types";
import { VariablesPanel } from "./VariablesPanel";
// @ts-expect-error The bundled runtime harness is JavaScript.
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

afterEach(cleanup);
const locals = Array.from({ length: 201 }, (_, index) => ({ name: `alias_${index}`, value: { kind: "ref" as const, id: "shared" } }));
const event: TraceEvent = { index: 0, kind: "line", line: 1,
  frames: [{ name: "<module>", line: 1, locals }],
  objects: { shared: { id: "shared", type: "list", entries: [{ key: "0", value: { kind: "int", value: 7 } }] } },
};
const rootRows = (container: HTMLElement) => container.querySelectorAll(".inspector-variables .vars-inspect > [data-inspector-label]");

describe("bounded root variable pages", () => {
  it("renders at most 50 roots, retains off-page aliases and expands the first shared ref per page", async () => {
    const user = userEvent.setup();
    const { container } = render(<VariablesPanel event={event} output="ready\n" />);
    expect(rootRows(container)).toHaveLength(50);
    expect(screen.getByText(/Showing variables 1–50 of 201/)).toBeInTheDocument();
    expect(container.querySelector('[data-inspector-label="alias_50"]')).toBeNull();
    expect(container.querySelector('[data-inspector-label="alias_0"] .oi-alias')).toHaveTextContent(/197 more names/);
    await user.click(screen.getByRole("button", { name: "Next variables page" }));
    expect(rootRows(container)).toHaveLength(50);
    expect(container.querySelector('[data-inspector-label="alias_50"] > .oi-toggle')).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector('[data-inspector-label="alias_0"]')).toBeNull();
    expect(screen.getByLabelText("Captured program output")).toHaveTextContent("ready");
  });

  it("supports keyboard page jumps and previous/next without hiding recorded names permanently", async () => {
    const user = userEvent.setup();
    const { container } = render(<VariablesPanel event={event} output="" />);
    const page = screen.getByRole("spinbutton", { name: "Variables page number" });
    await user.clear(page);
    await user.type(page, "5{Enter}");
    expect(rootRows(container)).toHaveLength(1);
    expect(container.querySelector('[data-inspector-label="alias_200"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next variables page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Previous variables page" }));
    expect(container.querySelector('[data-inspector-label="alias_150"]')).toBeInTheDocument();
    await user.clear(screen.getByRole("spinbutton", { name: "Variables page number" }));
    await user.type(screen.getByRole("spinbutton", { name: "Variables page number" }), "2{Enter}");
    expect(container.querySelector('[data-inspector-label="alias_50"]')).toBeInTheDocument();
  });

  it("clamps on backwards replay and resets pages on frame selection and stack changes", async () => {
    const user = userEvent.setup();
    const called: TraceEvent = { ...event, frames: [...event.frames, { name: "f", line: 2, locals }] };
    const { container, rerender } = render(<VariablesPanel event={called} output="" />);
    const page = screen.getByRole("spinbutton", { name: "Variables page number" });
    await user.clear(page); await user.type(page, "5{Enter}");
    await user.click(screen.getByRole("button", { name: /Main program/ }));
    expect(screen.getByRole("spinbutton", { name: "Variables page number" })).toHaveValue(1);
    await user.clear(screen.getByRole("spinbutton", { name: "Variables page number" }));
    await user.type(screen.getByRole("spinbutton", { name: "Variables page number" }), "5{Enter}");
    rerender(<VariablesPanel event={{ ...event, frames: [{ ...event.frames[0], locals: locals.slice(0, 1) }] }} output="" />);
    expect(rootRows(container)).toHaveLength(1);
    expect(container.querySelector('[data-inspector-label="alias_0"]')).toBeInTheDocument();
    rerender(<VariablesPanel event={event} output="" />);
    expect(screen.getByRole("spinbutton", { name: "Variables page number" })).toHaveValue(1);
  });

  it("clamps a shrinking same-frame local count and does not resurrect the old page later", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<VariablesPanel event={event} output="" />);
    const page = screen.getByRole("spinbutton", { name: "Variables page number" });
    await user.clear(page); await user.type(page, "5{Enter}");
    rerender(<VariablesPanel event={{ ...event, frames: [{ ...event.frames[0], locals: locals.slice(0, 75) }] }} output="" />);
    expect(rootRows(container)).toHaveLength(25);
    expect(screen.getByRole("spinbutton", { name: "Variables page number" })).toHaveValue(2);
    expect(container.querySelector('[data-inspector-label="alias_50"]')).toBeInTheDocument();
    rerender(<VariablesPanel event={event} output="" />);
    expect(screen.getByRole("spinbutton", { name: "Variables page number" })).toHaveValue(2);
    expect(container.querySelector('[data-inspector-label="alias_200"]')).not.toBeInTheDocument();
  });

  it("pages actual recorded Python globals without changing output", async () => {
    const result = await runProgram('globals().update(dict.fromkeys(map(str, range(200)), []))\nprint("ready")', "");
    expect(result.status).toBe("completed");
    const recorded = (result.events as TraceEvent[]).findLast((event) => event.frames[0]?.locals.length === 200)!;
    expect(recorded).toBeDefined();
    const { container } = render(<VariablesPanel event={recorded} output={result.stdout} />);
    expect(rootRows(container)).toHaveLength(50);
    expect(screen.getByLabelText("Captured program output")).toHaveTextContent("ready");
    const user = userEvent.setup();
    const page = screen.getByRole("spinbutton", { name: "Variables page number" });
    await user.clear(page); await user.type(page, "4{Enter}");
    expect(rootRows(container)).toHaveLength(50);
    expect(container.querySelector('[data-inspector-label="199"]')).toBeInTheDocument();
  }, 120_000);
});
