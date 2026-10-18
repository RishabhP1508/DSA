/** An expandable inspector that reads only recorded values and object IDs. */
import { useId, useState } from "react";
import type { KeyKind, ObjectId, TraceObject, TraceValue } from "../core/types";
import "./inspector.css";

const PAGE = 50;
const PREVIEW = 160;
const TEXT_PAGE = 1000;
type LabelKind = "name" | "index" | "key" | "attribute" | "item";

function primitiveText(value: TraceValue): string | null {
  switch (value.kind) {
    case "int":
    case "float": return String(value.value);
    case "bool": return value.value ? "True" : "False";
    case "str": return JSON.stringify(value.value);
    case "none": return "None";
    case "unknown": return value.repr;
    default: return null;
  }
}

function displayKey(key: string, keyKind?: KeyKind, labelKind?: LabelKind): string {
  if (labelKind === "index") return `[${key}]`;
  if (labelKind === "item") return `item ${Number(key) + 1}`;
  if (keyKind === "str" && labelKind !== "attribute") return JSON.stringify(key);
  return key;
}

/** Only a bounded page enters the DOM, including after the learner expands it. */
export function RecordedText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const id = useId();
  if (text.length <= 240) return <>{text}</>;
  const lastPage = Math.ceil(text.length / TEXT_PAGE) - 1;
  const currentPage = Math.min(page, lastPage);
  const start = currentPage * TEXT_PAGE;
  return (
    <span className="oi-recorded-text">
      <span>{text.slice(0, PREVIEW)}…</span>
      <button type="button" className="oi-text-toggle" aria-expanded={expanded} aria-controls={id}
        onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Close text" : `Inspect text (${text.length} characters)`}
      </button>
      {expanded && <span id={id} className="oi-text-pages">
        <span className="oi-text-position">Characters {start + 1}–{Math.min(start + TEXT_PAGE, text.length)} of {text.length}</span>
        <span className="oi-text-page">{text.slice(start, start + TEXT_PAGE)}</span>
        <span className="oi-text-actions">
          <button type="button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous text page</button>
          <button type="button" disabled={currentPage === lastPage} onClick={() => setPage(currentPage + 1)}>Next text page</button>
        </span>
      </span>}
    </span>
  );
}

export function ObjectInspector({
  value, objects, label, keyKind, labelKind = "name", defaultExpanded = false,
  ancestors, referenceNames,
}: {
  value: TraceValue;
  objects: Record<ObjectId, TraceObject>;
  label?: string;
  keyKind?: KeyKind;
  labelKind?: LabelKind;
  defaultExpanded?: boolean;
  ancestors?: ReadonlySet<ObjectId>;
  /** Names in the selected frame only. Shadowed names in other frames stay separate. */
  referenceNames?: Record<ObjectId, string[]>;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [shown, setShown] = useState(PAGE);
  const childId = useId();
  const renderedKey = label === undefined ? "Value" : displayKey(label, keyKind, labelKind);
  const longKey = renderedKey.length > 240;
  const labelNode = <span className={`oi-key oi-label-${labelKind}`}>
    {longKey ? `${renderedKey.slice(0, PREVIEW)}…` : renderedKey}
    {labelKind === "key" && keyKind && <span className="oi-key-kind">{keyKind} key</span>}
  </span>;
  const keyDetail = longKey && <div className="oi-key-detail">Full name / key: <RecordedText text={renderedKey} /></div>;
  const prim = primitiveText(value);
  const objectId = value.kind === "ref" ? value.id : undefined;
  const obj = objectId === undefined ? undefined : objects[objectId];
  const type = value.kind === "none" ? "NoneType" : value.kind === "unknown" ? "not inspected"
    : value.kind === "ref" ? obj?.type ?? "not recorded" : value.kind;
  const typePreview = type.length > 80 ? type.slice(0, 80) + "…" : type;
  const typeDetail = type.length > 80 && <div className="oi-type-detail">Full recorded type: <RecordedText text={type} /></div>;
  const rowData = { "data-inspector-label": label?.slice(0, 240), "data-object-id": objectId };
  const primitiveRow = (text: string, className = "") => <div className="oi-entry" {...rowData} role="group" aria-label={`${renderedKey.slice(0, 240)}: recorded value`}>
    <div className="oi-row">
      {labelNode}<span className="oi-type"><span className="oi-sr-only"> Type: </span>{typePreview}</span>
      <span className={`oi-value ${className}`}><span className="oi-sr-only"> Value: </span><RecordedText text={text} /></span>
    </div>{keyDetail}{typeDetail}
  </div>;
  if (prim !== null) return primitiveRow(prim);
  if (value.kind !== "ref") return primitiveRow("No recorded value");
  if (!obj) return primitiveRow(`Object ${value.id} · unresolved reference`, "oi-unresolved");
  if (ancestors?.has(obj.id)) return primitiveRow(`↺ Object ${obj.id} (${typePreview}, already shown on this path)`, "oi-cycle");

  const entries = obj.entries ?? [];
  const isSet = obj.type === "set" || obj.type === "frozenset";
  const indexed = ["list", "tuple", "deque"].includes(obj.type);
  const entryKind: LabelKind = indexed ? "index" : isSet ? "item" : obj.type === "dict" ? "key" : "attribute";
  // The trace records a type name, not its base class. For an unfamiliar class
  // these could be instance attributes OR subclassed-container entries.
  const count = obj.entries
    ? `${entries.length}${obj.truncated ? "+ recorded" : ""} ${entryKind === "attribute" ? "entries" : "items"}${entries.length === 0 && !obj.truncated ? " · empty" : ""}`
    : "";
  const aliasNames = (referenceNames?.[obj.id] ?? []).filter((name) => name !== label);
  const nextAncestors = new Set(ancestors ?? []);
  nextAncestors.add(obj.id);

  return (
    <div className="oi-node" {...rowData} role="group" aria-label={`${renderedKey.slice(0, 240)}: recorded object`}>
      <button type="button" className="oi-toggle" aria-expanded={expanded} aria-controls={childId}
        onClick={() => setExpanded((v) => !v)}>
        <span className="oi-name-cell"><span className="oi-caret" aria-hidden="true">{expanded ? "▾" : "▸"}</span>{labelNode}</span>
        <span className="oi-type"><span className="oi-sr-only"> Type: </span>{typePreview}</span>
        <span className="oi-value oi-summary">
          <span className="oi-identity">Object {obj.id}</span>
          {count && <span className="oi-count">{count}</span>}
          {aliasNames.length > 0 && <span className="oi-alias">shared with {aliasNames.slice(0, 3).map((name) => name.length > 80 ? name.slice(0, 80) + "…" : name).join(", ")}
            {aliasNames.length > 3 && ` and ${aliasNames.length - 3} more names with this object ID`}
          </span>}
        </span>
      </button>
      {keyDetail}
      {typeDetail}
      {expanded && <div id={childId} className="oi-children">
        {isSet && <p className="oi-entry-note">Items are shown in recorded iteration order. A set has no index positions.</p>}
        {entries.slice(0, shown).map((entry, i) => <ObjectInspector key={`${entry.key}-${i}`} value={entry.value}
          objects={objects} label={entry.key} keyKind={entry.keyKind} labelKind={entryKind}
          ancestors={nextAncestors} referenceNames={referenceNames} />)}
        {!obj.entries && <div className="oi-opaque">
          {obj.repr ? <RecordedText text={obj.repr} /> : <span>No attributes were recorded for this object.</span>}
        </div>}
        {entries.length > shown && <button type="button" className="oi-more" onClick={() => setShown((s) => s + PAGE)}>
          Show more ({entries.length - shown} recorded entries hidden)
        </button>}
        {obj.truncated && <div className="oi-truncated">
          {obj.entries ? "… more entries were omitted during inspection (large structure truncated)." : "… deeper data omitted (max inspection depth)."}
        </div>}
      </div>}
    </div>
  );
}
