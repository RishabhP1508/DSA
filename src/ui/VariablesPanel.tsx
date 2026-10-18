/** Variables, recorded references, call stack and captured output for one state. */
import { useState } from "react";
import type { TraceEvent } from "../core/types";
import { ObjectInspector, RecordedText } from "./ObjectInspector";
import { isExceptionUnwind } from "./exception-unwind";
import "./inspector.css";

const frameName = (name: string) => name === "<module>" ? "Main program" : name;
const VARIABLES_PER_PAGE = 50;
const framePreview = (name: string) => {
  const text = frameName(name);
  return text.length > 80 ? text.slice(0, 80) + "…" : text;
};

export function VariablesPanel({ event, previous, output }: { event: TraceEvent | undefined; previous?: TraceEvent; output: string }) {
  // TraceFrame has no frame identity. Keep a selection only while the recorded
  // stack shape is unchanged; a call/return defaults to its new innermost frame.
  const stack = JSON.stringify(event?.frames.map((frame) => frame.name) ?? []);
  const [selection, setSelection] = useState<{ stack: string; index: number | null; page: number }>({ stack, index: null, page: 0 });
  if (selection.stack !== stack) setSelection({ stack, index: null, page: 0 });
  if (!event) return <div className="panel variables-panel"><p>Run the program to inspect state.</p></div>;
  const activeFrame = selection.stack === stack && selection.index !== null && selection.index < event.frames.length
    ? selection.index : event.frames.length - 1;
  const frame = event.frames[activeFrame];
  const variableCount = frame?.locals.length ?? 0;
  const pageCount = Math.max(1, Math.ceil(variableCount / VARIABLES_PER_PAGE));
  const page = selection.stack === stack ? Math.min(selection.page, pageCount - 1) : 0;
  if (selection.stack === stack && selection.page !== page) setSelection({ ...selection, page });
  const firstVariable = page * VARIABLES_PER_PAGE;
  const changePage = (next: number) => setSelection({ stack, index: activeFrame, page: Math.max(0, Math.min(next, pageCount - 1)) });
  const unwinding = isExceptionUnwind(event, previous);
  const recordedError = event.error ?? (unwinding ? previous?.error : undefined);
  const referenceNames: Record<string, string[]> = {};
  for (const local of frame?.locals ?? []) {
    if (local.value.kind === "ref") (referenceNames[local.value.id] ??= []).push(local.name);
  }
  const seenReferences = new Set<string>();

  return (
    <div className="panel variables-panel">
      <section className="inspector-stack">
        <h3>Call stack</h3>
        <p className="inspector-help">Select a frame to inspect its variables. The last frame is where execution is paused.</p>
        <ol className="frames" aria-label="Recorded call stack">
          {event.frames.map((f, i) => <li key={`${i}:${f.name}`}>
            <button type="button" className={i === activeFrame ? "frame-btn active" : "frame-btn"}
              onClick={() => setSelection({ stack, index: i, page: 0 })} aria-pressed={i === activeFrame}>
              <span className="frame-name">{framePreview(f.name)}</span>
              <span className="frame-location">line {f.line}</span>
              {i === event.frames.length - 1 && <span className="frame-status">Current execution</span>}
            </button>
          </li>)}
        </ol>
        {event.frames.length === 0 && <p className="inspector-help">No stack frames were recorded.</p>}
        {frame && frame.name.length > 80 && <details className="inspector-frame-detail">
          <summary>Full selected frame name</summary><RecordedText text={frame.name} />
        </details>}
      </section>

      <section className="inspector-variables">
        <h3>Variables{frame ? ` · ${framePreview(frame.name)}` : ""}</h3>
        {!frame || frame.locals.length === 0 ? <p className="inspector-help">No local variables recorded yet.</p> : <>
          <p className="inspector-help">Object IDs identify shared references. Equal contents can still belong to different objects.</p>
          <p className="inspector-page-count" role="status">Showing variables {firstVariable + 1}–{Math.min(firstVariable + VARIABLES_PER_PAGE, variableCount)} of {variableCount}</p>
          {pageCount > 1 && <nav className="inspector-pagination" aria-label="Variable pages">
            <button type="button" aria-label="Previous variables page" disabled={page === 0} onClick={() => changePage(page - 1)}>Previous</button>
            <form key={`${stack}:${activeFrame}:${page}:${pageCount}`} noValidate onSubmit={(event) => {
              event.preventDefault();
              const requested = Number(new FormData(event.currentTarget).get("page"));
              if (Number.isFinite(requested)) changePage(Math.trunc(requested) - 1);
            }}>
              <label>Page <input type="number" name="page" aria-label="Variables page number" min={1} max={pageCount} defaultValue={page + 1} /></label>
              <span>of {pageCount}</span><button type="submit">Go to page</button>
            </form>
            <button type="button" aria-label="Next variables page" disabled={page === pageCount - 1} onClick={() => changePage(page + 1)}>Next</button>
          </nav>}
          <div className="inspector-columns" aria-hidden="true"><span>Name / key</span><span>Type</span><span>Value</span></div>
          <div className="vars-inspect" key={`${stack}:${activeFrame}:${page}`}>
            {frame.locals.slice(firstVariable, firstVariable + VARIABLES_PER_PAGE).map((local) => {
              const firstReference = local.value.kind !== "ref" || !seenReferences.has(local.value.id);
              if (local.value.kind === "ref") seenReferences.add(local.value.id);
              return <ObjectInspector key={local.name} value={local.value} objects={event.objects} label={local.name}
                defaultExpanded={firstReference} referenceNames={referenceNames} />;
            })}
          </div>
        </>}
      </section>

      {unwinding && <section><h3>Exception unwinding</h3>
        <p className="inspector-help">This frame is leaving after the recorded exception. Its None exit marker is not a normal returned value.</p>
      </section>}
      {event.kind === "return" && event.returnValue && !unwinding && <section>
        <h3>Return value</h3>
        <div className="vars-inspect"><ObjectInspector value={event.returnValue} objects={event.objects}
          label="Returned" defaultExpanded referenceNames={referenceNames} /></div>
      </section>}
      {recordedError && <section><h3>Error</h3><p className="error inspector-error"><RecordedText text={`${recordedError.type}: ${recordedError.message}`} /></p></section>}
      <section><h3>Output</h3><pre className="output" tabIndex={0} aria-label="Captured program output"><RecordedText text={output || "(no output yet)"} /></pre></section>
    </div>
  );
}
