/**
 * ObjectInspector — an expandable, snapshot-only inspector for a TraceValue
 * (R4.4).
 *
 * Fixes the old flat, permanently-truncated display: it drills into refs,
 * container entries, and object attributes; shows typed dict keys (int vs str
 * vs tuple); is cycle-safe; renders return values; and surfaces the tracer's
 * `truncated` flag. Large entry lists paginate ("show more") but nothing is
 * permanently hidden — the learner can always expand.
 *
 * It reads ONLY the recorded snapshot (the event's object table); it never
 * evaluates Python or invokes learner code.
 */

import { useState } from "react";
import type { ObjectId, TraceObject, TraceValue } from "../core/types";

/** How many entries to show before a "show more" toggle. */
const PAGE = 50;

/** Format a primitive TraceValue for inline display. */
function primitiveText(value: TraceValue): string | null {
  switch (value.kind) {
    case "int":
    case "float":
      return String(value.value);
    case "bool":
      return value.value ? "True" : "False";
    case "str":
      return JSON.stringify(value.value);
    case "none":
      return "None";
    case "unknown":
      return value.repr;
    default:
      return null; // ref → not a primitive
  }
}

/** Display a dict entry key honouring its recorded type (keyKind). */
function keyText(key: string, keyKind?: TraceValue["kind"]): string {
  if (keyKind === "str") return JSON.stringify(key); // quote string keys
  return key; // int/tuple/none/bool/float shown as recorded (e.g. 1, (1, 2))
}

export function ObjectInspector({
  value,
  objects,
  label,
  keyKind,
  defaultExpanded = false,
  ancestors,
}: {
  value: TraceValue;
  objects: Record<ObjectId, TraceObject>;
  /** Optional name/key shown before the value (variable name or entry key). */
  label?: string;
  /** When `label` is a dict key, its recorded type for correct formatting. */
  keyKind?: TraceValue["kind"];
  defaultExpanded?: boolean;
  /** Object ids on the path to here, for cycle detection. */
  ancestors?: ReadonlySet<ObjectId>;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [shown, setShown] = useState(PAGE);

  const labelNode = label !== undefined ? <span className="oi-key">{keyText(label, keyKind)}</span> : null;

  const prim = primitiveText(value);
  if (prim !== null) {
    return (
      <div className="oi-row">
        {labelNode}
        <span className="oi-value">{prim}</span>
      </div>
    );
  }

  // value.kind === "ref"
  if (value.kind !== "ref") {
    return (
      <div className="oi-row">
        {labelNode}
        <span className="oi-value">?</span>
      </div>
    );
  }

  const obj = objects[value.id];
  if (!obj) {
    return (
      <div className="oi-row">
        {labelNode}
        <span className="oi-value">&lt;unresolved ref&gt;</span>
      </div>
    );
  }

  // Cycle detection: if this object is already on our path, don't recurse.
  if (ancestors?.has(obj.id)) {
    return (
      <div className="oi-row">
        {labelNode}
        <span className="oi-value oi-cycle">↺ &lt;{obj.type}&gt; (already shown)</span>
      </div>
    );
  }

  const entries = obj.entries ?? [];
  const summary = `${obj.type}${entries.length ? ` (${entries.length}${obj.truncated ? "+" : ""})` : obj.repr ? "" : " (empty)"}`;

  // Opaque object with only a repr (e.g. a safe type label) — show inline.
  if (!obj.entries && obj.repr) {
    return (
      <div className="oi-row">
        {labelNode}
        <span className="oi-value">{obj.repr}</span>
      </div>
    );
  }

  const nextAncestors = new Set(ancestors ?? []);
  nextAncestors.add(obj.id);
  const visible = entries.slice(0, shown);

  return (
    <div className="oi-node">
      <button
        type="button"
        className="oi-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="oi-caret">{expanded ? "▾" : "▸"}</span>
        {labelNode}
        <span className="oi-summary">{summary}</span>
      </button>
      {expanded && (
        <div className="oi-children">
          {visible.map((e, i) => (
            <ObjectInspector
              key={`${e.key}-${i}`}
              value={e.value}
              objects={objects}
              label={e.key}
              keyKind={e.keyKind}
              ancestors={nextAncestors}
            />
          ))}
          {entries.length > shown && (
            <button type="button" className="oi-more" onClick={() => setShown((s) => s + PAGE)}>
              show more ({entries.length - shown} hidden)
            </button>
          )}
          {obj.truncated && (
            <div className="oi-truncated dim tiny">
              … more entries were omitted during inspection (large structure truncated).
            </div>
          )}
        </div>
      )}
    </div>
  );
}
