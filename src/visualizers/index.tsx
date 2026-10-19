/**
 * Visualizer dispatcher.
 *
 * Maps a VisualBinding's `model` to the matching SVG visualizer. Lessons declare
 * bindings; the workspace renders each binding through this dispatcher, so
 * adding a lesson never requires touching the workspace, and adding a new model
 * only requires registering it here.
 */

import type { TraceEvent, VisualBinding, VisualModel } from "../core/types";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { StringVisualizer } from "./StringVisualizer";
import { MatrixVisualizer } from "./MatrixVisualizer";
import { StackVisualizer, QueueVisualizer, DequeVisualizer } from "./StackQueueVisualizer";
import { LinkedListVisualizer } from "./LinkedListVisualizer";
import { DictVisualizer, SetVisualizer } from "./DictSetVisualizer";
import { TreeVisualizer } from "./TreeVisualizer";
import { HeapVisualizer } from "./HeapVisualizer";
import { TrieVisualizer } from "./TrieVisualizer";
import { GraphVisualizer } from "./GraphVisualizer";
import { RecursionVisualizer } from "./RecursionVisualizer";
import { DPTableVisualizer } from "./DPTableVisualizer";
import { BitsVisualizer } from "./BitsVisualizer";
import { ObjectVisualizer } from "./ObjectVisualizer";
import { groupBindings } from './binding-groups';
import '../ui/execution-workspace.css';

/** One card per recorded object and semantic view, shared by every workspace. */
export function Visualizations({ event, bindings }: { event: TraceEvent; bindings: VisualBinding[] }) {
  return <div className="visualization-list">{groupBindings(event, bindings).map((group, index) => (
    <article className="visualization-card viz-slot" key={`${group.objectId ?? 'value'}:${index}`} data-object-id={group.objectId} data-shared={group.names.length > 1 ? 'true' : 'false'} aria-label={`${group.binding.model} view: ${group.names.slice(0, 8).map(name=>name.slice(0,80)).join(', ')}`}>
      <header className="visualization-card-heading">
        <div className="visualization-aliases">{group.names.slice(0,8).map(name=><code key={name}>{name.length>80 ? name.slice(0,80)+'…' : name}</code>)}<span aria-hidden="true">→</span></div>
        <div className="visualization-identity">{group.objectId ? <><span>{group.names.length > 1 ? 'Shared object' : 'Object'}</span><code>{group.objectId}</code></> : <span>{group.binding.model === 'recursion' ? 'Recorded call stack' : 'Recorded value'}</span>}</div>
        {group.names.length > 8 && <p className="dim">{group.names.length - 8} more names share this object. Inspect variables for their references.</p>}
      </header>
      <div className="diagram-scroll" role="region" aria-label={`${group.binding.model} diagram, scroll for larger structures`} tabIndex={0}>
        <Visualizer event={event} binding={group.binding}/>
      </div>
    </article>
  ))}</div>;
}

export const SUPPORTED_MODELS: VisualModel[] = [
  "array",
  "string",
  "matrix",
  "stack",
  "queue",
  "deque",
  "linked-list",
  "dict",
  "set",
  "tree",
  "heap",
  "trie",
  "graph",
  "dp-table",
  "bits",
  "recursion",
  "object",
];

export function Visualizer({
  event,
  binding,
}: {
  event: TraceEvent;
  binding: VisualBinding;
}) {
  switch (binding.model) {
    case "array":
      return <ArrayVisualizer event={event} binding={binding} />;
    case "string":
      return <StringVisualizer event={event} binding={binding} />;
    case "matrix":
      return <MatrixVisualizer event={event} binding={binding} />;
    case "stack":
      return <StackVisualizer event={event} binding={binding} />;
    case "queue":
      return <QueueVisualizer event={event} binding={binding} />;
    case "deque":
      return <DequeVisualizer event={event} binding={binding} />;
    case "linked-list":
      return <LinkedListVisualizer event={event} binding={binding} />;
    case "dict":
      return <DictVisualizer event={event} binding={binding} />;
    case "set":
      return <SetVisualizer event={event} binding={binding} />;
    case "tree":
      return <TreeVisualizer event={event} binding={binding} />;
    case "heap":
      return <HeapVisualizer event={event} binding={binding} />;
    case "trie":
      return <TrieVisualizer event={event} binding={binding} />;
    case "graph":
      return <GraphVisualizer event={event} binding={binding} />;
    case "dp-table":
      return <DPTableVisualizer event={event} binding={binding} />;
    case "bits":
      return <BitsVisualizer event={event} binding={binding} />;
    case "recursion":
      return <RecursionVisualizer event={event} />;
    case "object":
    default:
      return <ObjectVisualizer event={event} binding={binding} />;
  }
}
