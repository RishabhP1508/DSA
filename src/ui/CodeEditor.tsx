/**
 * CodeMirror 6 Python editor with a highlight for the current trace line.
 */

import { useEffect, useRef } from "react";
import { EditorState, StateEffect, StateField } from "@codemirror/state";
import { EditorView, lineNumbers, Decoration, gutter, GutterMarker, type DecorationSet } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

const setHighlight = StateEffect.define<number | null>();
const setBreakpoints = StateEffect.define<ReadonlySet<number>>();
const breakpointField = StateField.define<ReadonlySet<number>>({
  create: () => new Set(),
  update: (value, transaction) => transaction.effects.find(effect => effect.is(setBreakpoints))?.value ?? value,
});

const highlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setHighlight)) {
        if (e.value == null || e.value < 1) return Decoration.none;
        const lineNo = e.value;
        if (lineNo > tr.state.doc.lines) return Decoration.none;
        const line = tr.state.doc.line(lineNo);
        return Decoration.set([
          Decoration.line({ class: "cm-active-trace-line" }).range(line.from),
        ]);
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export function CodeEditor({
  value,
  onChange,
  highlightLine,
  readOnly,
  breakpoints,
  onToggleBreakpoint,
}: {
  value: string;
  onChange?: (v: string) => void;
  highlightLine?: number | null;
  readOnly?: boolean;
  breakpoints?: ReadonlySet<number>;
  onToggleBreakpoint?: (line: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const toggleRef = useRef(onToggleBreakpoint);
  toggleRef.current = onToggleBreakpoint;

  useEffect(() => {
    if (!hostRef.current) return;
    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        breakpointField,
        ...(onToggleBreakpoint ? [gutter({
          class: 'cm-breakpoint-gutter',
          lineMarker(view, block) {
            const line = view.state.doc.lineAt(block.from).number;
            const active = view.state.field(breakpointField).has(line);
            return new class extends GutterMarker {
              toDOM() {
                const button = document.createElement('button');
                button.textContent = active ? '●' : '○';
                button.className = active ? 'breakpoint-dot is-set' : 'breakpoint-dot';
                button.setAttribute('aria-label', `Playback breakpoint on line ${line}`);
                button.setAttribute('aria-pressed', String(active));
                button.title = 'Pause playback before this line';
                button.onclick = event => { event.preventDefault(); toggleRef.current?.(line); };
                return button;
              }
            }();
          },
          lineMarkerChange: update => update.docChanged || update.transactions.some(tr => tr.effects.some(effect => effect.is(setBreakpoints))),
        })] : []),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        python(),
        syntaxHighlighting(defaultHighlightStyle),
        highlightField,
        EditorView.editable.of(!readOnly),
        EditorView.updateListener.of((u) => {
          if (u.docChanged && onChange) onChange(u.state.doc.toString());
        }),
      ],
    });
    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => view.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push external value changes into the editor.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (view.state.doc.toString() !== value) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
    }
  }, [value]);

  useEffect(() => {
    viewRef.current?.dispatch({ effects: setHighlight.of(highlightLine ?? null) });
  }, [highlightLine]);
  useEffect(() => {
    viewRef.current?.dispatch({ effects: setBreakpoints.of(breakpoints ?? new Set()) });
  }, [breakpoints]);

  return <div className="code-editor" ref={hostRef} />;
}
