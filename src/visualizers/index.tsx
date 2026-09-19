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
