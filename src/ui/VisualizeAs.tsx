/**
 * VisualizeAs — a runtime "Visualize as…" control (R4.6).
 *
 * Lets a learner map a variable in the CURRENT trace event to a supported
 * diagram family (optionally with a dotted field path), producing a
 * `VisualBinding` that the existing dispatcher renders. Primarily for the
 * Playground, where code is the learner's own and there are no authored
 * bindings.
 *
 * It reads the recorded snapshot only (the variables present in `event`); it
 * never evaluates Python. An invalid/empty selection yields no binding and the
 * caller keeps showing the generic inspector.
 */

import type { TraceEvent, VisualBinding, VisualModel } from "../core/types";
import { SUPPORTED_MODELS } from "../visualizers";

export function VisualizeAs({
  event,
  binding,
  onChange,
}: {
  event: TraceEvent | undefined;
  binding: VisualBinding | null;
  onChange: (binding: VisualBinding | null) => void;
}) {
  // Offer the variable names visible in the current event (all frames, innermost
  // first, de-duplicated).
  const names: string[] = [];
  if (event) {
    for (let i = event.frames.length - 1; i >= 0; i--) {
      for (const l of event.frames[i].locals) if (!names.includes(l.name)) names.push(l.name);
    }
  }

  const variable = binding?.variable ?? "";
  const model: VisualModel = binding?.model ?? "array";
  const path = binding?.path ?? "";
  const directed = binding?.directed ?? false;

  // Merge a patch onto the CURRENT binding so properties like `directed` (and
  // any future ones) are PRESERVED when the learner changes the variable, model
  // or path — rather than rebuilt from scratch and dropped.
  const update = (patch: Partial<VisualBinding>) => {
    const base: VisualBinding = binding ?? { variable, model };
    const nextVar = patch.variable ?? base.variable;
    if (!nextVar) {
      onChange(null);
      return;
    }
    const next: VisualBinding = { ...base, ...patch, variable: nextVar };
    // Normalise: drop an empty path so it doesn't linger as "".
    if (!next.path) delete next.path;
    // `directed` is only meaningful for the graph model.
    if (next.model !== "graph") delete next.directed;
    onChange(next);
  };

  return (
    <div className="visualize-as">
      <div className="dim tiny">Visualize as…</div>
      <div className="va-row">
        <label>
          Variable
          <select
            aria-label="Variable to visualize"
            value={variable}
            onChange={(e) => update({ variable: e.target.value })}
          >
            <option value="">(none)</option>
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          As
          <select
            aria-label="Diagram family"
            value={model}
            onChange={(e) => update({ model: e.target.value as VisualModel })}
          >
            {SUPPORTED_MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        {model === "graph" && (
          <label>
            Direction
            <select
              aria-label="Graph direction"
              value={directed ? "directed" : "undirected"}
              onChange={(e) => update({ directed: e.target.value === "directed" })}
            >
              <option value="undirected">Undirected</option>
              <option value="directed">Directed</option>
            </select>
          </label>
        )}
        <label>
          Path
          <input
            aria-label="Optional field path"
            type="text"
            placeholder="e.g. root.left"
            value={path}
            onChange={(e) => update({ path: e.target.value })}
          />
        </label>
      </div>
      {variable && !names.includes(variable) && (
        <p className="dim tiny">
          “{variable}” is not in the current step — run or step to where it exists, or pick another
          variable. The generic inspector below still works.
        </p>
      )}
    </div>
  );
}
