/**
 * Variables + call-stack + output panel for the current trace step.
 *
 * R4.4: values are shown through the expandable `ObjectInspector` (drill into
 * refs, typed dict keys, cycles, truncated markers) instead of a flat truncated
 * string. The learner can select which stack frame to inspect, and a return
 * value is shown on `return` events.
 */

import { useState } from "react";
import type { TraceEvent } from "../core/types";
import { ObjectInspector } from "./ObjectInspector";

export function VariablesPanel({
  event,
  output,
}: {
  event: TraceEvent | undefined;
  output: string;
}) {
  // Which frame to inspect; default innermost (last). Reset implicitly when the
  // frame count changes by clamping below.
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);

  if (!event) {
    return <div className="panel">Run the program to inspect state.</div>;
  }

  const frameCount = event.frames.length;
  const activeFrame =
    selectedFrame != null && selectedFrame < frameCount ? selectedFrame : frameCount - 1;
  const frame = event.frames[activeFrame];

  return (
    <div className="panel">
      <section>
        <h4>Call stack</h4>
        <ol className="frames">
          {event.frames.map((f, i) => (
            <li key={i}>
              <button
                type="button"
                className={i === activeFrame ? "frame-btn active" : "frame-btn"}
                onClick={() => setSelectedFrame(i)}
                aria-pressed={i === activeFrame}
              >
                <code>{f.name}</code> <span className="dim">line {f.line}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h4>Variables{frameCount > 1 ? ` · ${frame?.name}` : ""}</h4>
        {!frame || frame.locals.length === 0 ? (
          <p className="dim">(no locals yet)</p>
        ) : (
          <div className="vars-inspect">
            {frame.locals.map((l) => (
              <ObjectInspector
                key={l.name}
                value={l.value}
                objects={event.objects}
                label={l.name}
                defaultExpanded
              />
            ))}
          </div>
        )}
      </section>

      {event.kind === "return" && event.returnValue && (
        <section>
          <h4>Return value</h4>
          <div className="vars-inspect">
            <ObjectInspector value={event.returnValue} objects={event.objects} label="→" defaultExpanded />
          </div>
        </section>
      )}

      {event.error && (
        <section>
          <h4>Error</h4>
          <p className="error">
            {event.error.type}: {event.error.message}
          </p>
        </section>
      )}

      <section>
        <h4>Output</h4>
        <pre className="output">{output || "(no output yet)"}</pre>
      </section>
    </div>
  );
}
