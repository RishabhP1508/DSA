/**
 * Replay controller: steps through recorded TraceEvents WITHOUT rerunning the
 * program. Supports forward/back/restart and jumping to an index, which is what
 * the visualization workspace controls (Prev/Next/Restart/scrub) bind to.
 *
 * Backward playback simply selects an earlier recorded state, so it restores
 * exact state by construction (each TraceEvent is a full immutable snapshot).
 */

import type { RunResult, TraceEvent, TraceValue, TraceObject } from "../core/types";

export class Replay {
  private index = 0;
  private result: RunResult;

  constructor(result: RunResult) {
    this.result = result;
  }

  get length(): number {
    return this.result.events.length;
  }

  get position(): number {
    return this.index;
  }

  get current(): TraceEvent | undefined {
    return this.result.events[this.index];
  }

  get atStart(): boolean {
    return this.index <= 0;
  }

  get atEnd(): boolean {
    return this.index >= this.length - 1;
  }

  next(): TraceEvent | undefined {
    if (this.index < this.length - 1) this.index++;
    return this.current;
  }

  prev(): TraceEvent | undefined {
    if (this.index > 0) this.index--;
    return this.current;
  }

  restart(): TraceEvent | undefined {
    this.index = 0;
    return this.current;
  }

  seek(i: number): TraceEvent | undefined {
    this.index = Math.max(0, Math.min(this.length - 1, i));
    return this.current;
  }

  /** stdout produced up to and including the current step. */
  outputSoFar(): string {
    let out = "";
    for (let i = 0; i <= this.index && i < this.length; i++) {
      const ev = this.result.events[i];
      if (ev.output?.stream === "stdout") out += ev.output.text;
    }
    // Fall back to full stdout if no per-event output was recorded.
    return out || (this.index >= this.length - 1 ? this.result.stdout : out);
  }
}

/** Resolve a TraceValue to a short display string using the event's object table. */
export function displayValue(
  value: TraceValue,
  objects: Record<string, TraceObject>,
  depth = 0,
): string {
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
    case "ref": {
      const obj = objects[value.id];
      if (!obj) return "<ref>";
      if (depth > 2) return `<${obj.type}>`;
      if (obj.repr) return obj.repr;
      if (obj.entries) {
        const inner = obj.entries
          .slice(0, 6)
          .map((e) =>
            obj.type === "dict"
              ? `${e.key}: ${displayValue(e.value, objects, depth + 1)}`
              : displayValue(e.value, objects, depth + 1),
          )
          .join(", ");
        const more = obj.entries.length > 6 ? ", …" : "";
        const open = obj.type === "dict" || obj.type === "set" ? "{" : obj.type === "tuple" ? "(" : "[";
        const close = obj.type === "dict" || obj.type === "set" ? "}" : obj.type === "tuple" ? ")" : "]";
        return `${open}${inner}${more}${close}`;
      }
      return `<${obj.type}>`;
    }
  }
}
