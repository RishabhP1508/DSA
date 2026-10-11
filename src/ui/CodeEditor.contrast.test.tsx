import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { EditorView } from "@codemirror/view";
import { CodeEditor } from "./CodeEditor";
import { EDITOR_SYNTAX_COLORS } from "./editor-syntax";

const themeCss = readFileSync("src/theme.css", "utf8");

function luminance(hex: string) {
  const fullHex = hex.length === 4 ? hex.slice(1).split("").map((digit) => digit + digit).join("") : hex.slice(1);
  const channels = fullHex.match(/../g)!.map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove("dark");
});

describe("CodeEditor syntax readability", () => {
  for (const mode of ["light", "dark"] as const) {
    it(`${mode} token colors meet 4.5:1 on the actual editor and trace backgrounds`, () => {
      const declaration = themeCss.match(mode === "dark" ? /\.dark\{([^}]+)\}/ : /:root\{([^}]+)\}/)![1];
      const backgrounds = ["card", "secondary"].map((name) => declaration.match(new RegExp(`--${name}:(#[0-9a-f]{3,6})`, "i"))![1]);
      for (const [token, color] of Object.entries(EDITOR_SYNTAX_COLORS[mode])) {
        for (const background of backgrounds) {
          expect(contrast(color, background), `${mode} ${token} ${color} on ${background}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    });
  }

  it("renders actual Python tokens with the theme-aware token classes", () => {
    const { container } = render(<CodeEditor value={'# a comment\ndef add(value):\n    return value + 42\nmessage = "hello"\n'} />);
    expect(container.querySelector(".cm-syntax-comment")).toHaveTextContent("# a comment");
    expect(container.querySelector(".cm-syntax-keyword")).toHaveTextContent("def");
    expect(container.querySelector(".cm-syntax-number")).toHaveTextContent("42");
    expect(container.querySelector(".cm-syntax-string")).toHaveTextContent('"hello"');
    expect(container.querySelector(".cm-syntax-function")).toHaveTextContent("add");
  });

  it("theme switching preserves the existing editor, unsaved text and selection", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<CodeEditor value={"value = 42\n"} onChange={onChange} />);
    const editor = container.querySelector<HTMLElement>(".cm-editor")!;
    const view = EditorView.findFromDOM(editor)!;
    act(() => view.dispatch({ changes: { from: view.state.doc.length, insert: "# unsaved edit\n" } }));
    const editedSource = view.state.doc.toString();
    expect(onChange).toHaveBeenLastCalledWith(editedSource);
    act(() => view.dispatch({ selection: { anchor: 2, head: 7 } }));
    const before = view.state.selection.main;
    document.documentElement.classList.add("dark");
    rerender(<CodeEditor value={editedSource} onChange={onChange} />);
    expect(container.querySelector(".cm-editor")).toBe(editor);
    expect(view.state.doc.toString()).toBe(editedSource);
    expect(view.state.selection.main.anchor).toBe(before.anchor);
    expect(view.state.selection.main.head).toBe(before.head);
    document.documentElement.classList.remove("dark");
    rerender(<CodeEditor value={editedSource} onChange={onChange} />);
    expect(container.querySelector(".cm-editor")).toBe(editor);
    expect(view.state.selection.main.head).toBe(before.head);
  });
});
