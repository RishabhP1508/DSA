/**
 * R4.4 expandable object inspector.
 *
 * Written before the fix: `ObjectInspector` does not exist yet. It must render a
 * TraceValue against an event's object table with expand/collapse, typed dict
 * keys, cycle-safety, and a surfaced `truncated` flag — never permanently
 * hiding entries after the first six.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ObjectInspector } from "./ObjectInspector";
import type { TraceObject, TraceValue } from "../core/types";

afterEach(cleanup);

describe("ObjectInspector — expansion & drill-in", () => {
  it("expands a ref to reveal its entries (not truncated at 6)", async () => {
    const objects: Record<string, TraceObject> = {
      o1: {
        id: "o1",
        type: "list",
        // Values distinct from their indices so the assertion is unambiguous.
        entries: Array.from({ length: 9 }, (_, i) => ({
          key: String(i),
          value: { kind: "int", value: i * 10 } as TraceValue,
        })),
      },
    };
    render(<ObjectInspector value={{ kind: "ref", id: "o1" }} objects={objects} label="xs" defaultExpanded />);
    // All 9 values must be reachable (paginated is fine, but not permanently
    // hidden). Expand any "show more" affordance if present.
    const more = screen.queryByRole("button", { name: /show more|more/i });
    if (more) await userEvent.click(more);
    expect(screen.getByText("80")).toBeInTheDocument(); // the 9th element's value (index 8)
  });

  it("shows typed dict keys (int vs str vs tuple) distinctly", () => {
    const objects: Record<string, TraceObject> = {
      d: {
        id: "d",
        type: "dict",
        entries: [
          { key: "1", keyKind: "int", value: { kind: "str", value: "int-key" } },
          { key: "1", keyKind: "str", value: { kind: "str", value: "str-key" } },
          { key: "(1, 2)", keyKind: "tuple", value: { kind: "str", value: "tuple-key" } },
        ],
      },
    };
    render(<ObjectInspector value={{ kind: "ref", id: "d" }} objects={objects} label="d" defaultExpanded />);
    // The string key is quoted; the int key is not; the tuple key is structural.
    expect(screen.getByText('"1"')).toBeInTheDocument(); // str key quoted
    expect(screen.getByText("1")).toBeInTheDocument(); // int key bare
    expect(screen.getByText("(1, 2)")).toBeInTheDocument(); // tuple key
  });

  it("handles a cyclic reference without infinite recursion", () => {
    const objects: Record<string, TraceObject> = {
      a: { id: "a", type: "list", entries: [{ key: "0", value: { kind: "ref", id: "a" } }] },
    };
    // Should render finitely; expanding the self-ref shows a cycle marker.
    render(<ObjectInspector value={{ kind: "ref", id: "a" }} objects={objects} label="a" defaultExpanded />);
    expect(screen.getByText(/↺|cycle|already shown/i)).toBeInTheDocument();
  });

  it("surfaces the truncated flag with an omitted-entries note", () => {
    const objects: Record<string, TraceObject> = {
      big: {
        id: "big",
        type: "list",
        truncated: true,
        entries: [{ key: "0", value: { kind: "int", value: 0 } }],
      },
    };
    render(<ObjectInspector value={{ kind: "ref", id: "big" }} objects={objects} label="big" defaultExpanded />);
    expect(screen.getByText(/omitted|truncat/i)).toBeInTheDocument();
  });

  it("renders a primitive inline", () => {
    render(<ObjectInspector value={{ kind: "int", value: 42 }} objects={{}} label="n" />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("collapses and expands on toggle", async () => {
    const objects: Record<string, TraceObject> = {
      o1: { id: "o1", type: "list", entries: [{ key: "0", value: { kind: "int", value: 7 } }] },
    };
    render(<ObjectInspector value={{ kind: "ref", id: "o1" }} objects={objects} label="xs" />);
    // Collapsed by default (no defaultExpanded): the child value is hidden.
    expect(screen.queryByText("7")).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: /xs|expand|▸/i });
    await userEvent.click(toggle);
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
