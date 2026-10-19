import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { TraceEvent } from "../core/types";
import { VariablesPanel } from "./VariablesPanel";
import { isExceptionUnwind } from "./exception-unwind";
// @ts-expect-error The bundled runtime harness is JavaScript.
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

afterEach(cleanup);
const traces = new Map<string, TraceEvent[]>();
beforeAll(async () => {
  const sources: Record<string, string> = {
    unhandled: 'def fail():\n    raise ValueError("bad")\nfail()',
    caught: 'def fail():\n    raise ValueError("bad")\ntry:\n    fail()\nexcept ValueError:\n    print("caught")',
    handledNone: 'def done():\n    try:\n        raise ValueError("handled")\n    except ValueError:\n        pass\n    return None\ndone()',
    finallyNone: 'def done():\n    try:\n        raise ValueError("handled")\n    finally:\n        return None\ndone()',
    normalValue: 'def done():\n    return 7\ndone()',
  };
  for (const [name, source] of Object.entries(sources)) {
    const result = await runProgram(source, "");
    expect(result.status).toBe(name === "unhandled" ? "error" : "completed");
    traces.set(name, result.events);
  }
}, 120_000);

function returnFrom(name: string, frame: string) {
  const events = traces.get(name)!;
  const event = events.find((event) => event.kind === "return" && event.frames.at(-1)?.name === frame);
  if (!event) throw new Error(`Missing actual return event for ${name}:${frame}`);
  return { event, previous: events[event.index - 1] };
}

describe("exception-unwind display from actual bundled Python events", () => {
  it("recognizes an exception-caused function and module exit without presenting None as a returned value", () => {
    for (const frame of ["fail", "<module>"]) {
      const { event, previous } = returnFrom("unhandled", frame);
      expect(previous.kind).toBe("exception");
      expect(isExceptionUnwind(event, previous)).toBe(true);
      render(<VariablesPanel event={event} previous={previous} output="" />);
      expect(screen.getByRole("heading", { name: "Exception unwinding" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Return value" })).not.toBeInTheDocument();
      expect(screen.getByText("ValueError: bad")).toBeInTheDocument();
      cleanup();
    }
  });

  it("recognizes a callee unwinding even when the caller later catches its exception", () => {
    const { event, previous } = returnFrom("caught", "fail");
    expect(isExceptionUnwind(event, previous)).toBe(true);
  });

  it.each(["handledNone", "finallyNone"])("does not mislabel a genuine None return after handled exceptions: %s", (name) => {
    const { event, previous } = returnFrom(name, "done");
    expect(event.returnValue).toEqual({ kind: "none" });
    expect(isExceptionUnwind(event, previous)).toBe(false);
    render(<VariablesPanel event={event} previous={previous} output="" />);
    expect(screen.getByRole("heading", { name: "Return value" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Exception unwinding" })).not.toBeInTheDocument();
  });

  it("preserves genuine returned values", () => {
    const { event, previous } = returnFrom("normalValue", "done");
    expect(isExceptionUnwind(event, previous)).toBe(false);
    render(<VariablesPanel event={event} previous={previous} output="" />);
    expect(screen.getByRole("heading", { name: "Return value" })).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("rejects missing, nonadjacent or different-frame context instead of inventing causation", () => {
    const { event, previous } = returnFrom("unhandled", "fail");
    expect(isExceptionUnwind(event, undefined)).toBe(false);
    expect(isExceptionUnwind(event, { ...previous, index: previous.index - 1 })).toBe(false);
    expect(isExceptionUnwind(event, { ...previous, frames: previous.frames.slice(0, -1) })).toBe(false);
    expect(isExceptionUnwind({ ...event, returnValue: { kind: "int", value: 7 } }, previous)).toBe(false);
  });
});
