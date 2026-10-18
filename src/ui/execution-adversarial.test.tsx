/** Independent regressions for the shared execution/visualization integration. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TraceEvent } from "../core/types";
import { Visualizations } from "../visualizers";
import { ObservedStep } from "./ObservedStep";
import { RecordedChanges } from "./ExecutionState";
import { recordedChanges } from "./observed-line";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const event: TraceEvent = {
  index: 1, line: 2, kind: "line", frames: [{ name: "<module>", line: 2,
    locals: [{ name: "xs", value: { kind: "ref", id: "array-id" } }] }],
  objects: { "array-id": { id: "array-id", type: "list", entries: [{ key: "0", value: { kind: "int", value: 1 } }] } },
};

describe("shared execution integration adversarial cases", () => {
  it("never labels a call-stack diagram as the selected variable's list object", () => {
    const { container } = render(<Visualizations event={event} bindings={[{ variable: "xs", model: "recursion" }]} />);
    expect(container.querySelector(".visualization-card")).not.toHaveAttribute("data-object-id");
    expect(container.querySelector(".visualization-identity")).toHaveTextContent("Recorded call stack");
  });

  it("keeps manual source inspection within the edited source's actual line range", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ObservedStep source={"a = 1\nb = 2\nc = 3"} />);
    const input = screen.getByRole("spinbutton", { name: "Source line to explain" });
    await user.clear(input);
    await user.type(input, "3");
    expect(input).toHaveValue(3);
    rerender(<ObservedStep source="a = 1" />);
    expect(input).toHaveValue(1);
    expect(screen.queryByText(/A blank line separates/)).not.toBeInTheDocument();
  });

  it("caps personal-code change rows and clearly reports undisplayed changes", () => {
    const many: TraceEvent = { ...event, frames: [{ name: "<module>", line: 2,
      locals: Array.from({ length: 1000 }, (_, index) => ({ name: `name_${index}`, value: { kind: "int", value: index } })) }] };
    const before: TraceEvent = { ...event, frames: [{ name: "<module>", line: 1, locals: [] }] };
    const { container } = render(<ObservedStep source="pass" event={many} previous={before} />);
    expect(container.querySelectorAll("li").length).toBeLessThanOrEqual(20);
    expect(screen.getByText(/more changes/)).toBeInTheDocument();
  });

  it("bounds learner-supplied variable names in recorded-change text", () => {
    const name = "long_identifier_".repeat(1000);
    const now: TraceEvent = { ...event, frames: [{ name: "<module>", line: 2,
      locals: [{ name, value: { kind: "int", value: 2 } }] }] };
    const before: TraceEvent = { ...now, frames: [{ name: "<module>", line: 1,
      locals: [{ name, value: { kind: "int", value: 1 } }] }] };
    const { container } = render(<RecordedChanges event={now} previous={before} />);
    expect(container.innerHTML).not.toContain(name);
    expect(container.textContent!.length).toBeLessThan(2000);
  });

  it("does not serialize the same large aliased object once per variable", () => {
    const object = event.objects["array-id"];
    const aliased: TraceEvent = { ...event, frames: [{ name: "<module>", line: 2,
      locals: Array.from({ length: 200 }, (_, index) => ({ name: `alias_${index}`, value: { kind: "ref", id: "array-id" } })) }] };
    const spy = vi.spyOn(JSON, "stringify");
    recordedChanges(aliased, aliased);
    const objectSerializations = spy.mock.calls.filter(([value]) => value === object).length;
    expect(objectSerializations).toBeLessThanOrEqual(2);
  });
});
