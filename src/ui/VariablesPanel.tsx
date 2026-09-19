/**
 * Variables + call-stack + output panel for the current trace step.
 */

import type { TraceEvent } from "../core/types";
import { displayValue } from "../engine/replay";

export function VariablesPanel({
  event,
  output,
}: {
  event: TraceEvent | undefined;
  output: string;
}) {
  if (!event) {
    return <div className="panel">Run the program to inspect state.</div>;
  }
  return (
    <div className="panel">
      <section>
        <h4>Call stack</h4>
        <ol className="frames">
          {event.frames.map((f, i) => (
            <li key={i}>
              <code>{f.name}</code> <span className="dim">line {f.line}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h4>Variables</h4>
        {event.frames.length === 0 ? (
          <p className="dim">No frame.</p>
        ) : (
          <table className="vars">
            <tbody>
              {event.frames[event.frames.length - 1].locals.map((l) => (
                <tr key={l.name}>
                  <td className="var-name">{l.name}</td>
                  <td className="var-value">{displayValue(l.value, event.objects)}</td>
                </tr>
              ))}
              {event.frames[event.frames.length - 1].locals.length === 0 && (
                <tr>
                  <td className="dim" colSpan={2}>
                    (no locals yet)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

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
