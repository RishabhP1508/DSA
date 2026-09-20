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
              ? `${e.keyKind === "str" ? JSON.stringify(e.key) : e.key}: ${displayValue(e.value, objects, depth + 1)}`
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


// ---------------------------------------------------------------------------
// R4.3 playback stepping (pure; the useEngine play timer drives it)
// ---------------------------------------------------------------------------

/**
 * Compute the next index a "play" advance should land on, honouring PLAYBACK
 * breakpoints (breakpoints are 1-based source lines).
 *
 *  - Advance one step from `from`.
 *  - Return `null` when there is nothing left to play (already at/after the end).
 *  - If the event we would advance TO sits on a breakpoint line, stop AT it.
 *  - Sitting on a breakpoint event and pressing play again moves PAST it (so a
 *    breakpoint does not trap playback), then stops at the next breakpoint.
 *
 * These are playback breakpoints: they pause replay of already-recorded states;
 * they do not suspend Python (which has already finished).
 */
export function nextPlayIndex(
  events: Pick<TraceEvent, "line">[],
  from: number,
  breakpoints: ReadonlySet<number>,
): number | null {
  if (from >= events.length - 1) return null;
  // Always advance exactly one step. The caller decides whether to PAUSE after
  // landing (see `isBreakpointStop`), so a breakpoint stops playback AT the
  // intended event, and sitting on a breakpoint and pressing play again
  // advances past it rather than re-trapping. `breakpoints` is part of the
  // contract so the stepping/pausing rules stay co-located.
  void breakpoints;
  return from + 1;
}

/**
 * Whether playback should PAUSE at `event` for a breakpoint. A line breakpoint
 * targets the EXECUTABLE `line` event for that source line — the moment the
 * line is about to run — NOT a `call`/`return`/`exception`/`output` event that
 * merely reports the same line number. This keeps a breakpoint on line N from
 * spuriously trapping the function-entry `call` or the `return` reported at N.
 */
export function isBreakpointStop(
  event: Pick<TraceEvent, "kind" | "line"> | undefined,
  breakpoints: ReadonlySet<number>,
): boolean {
  if (!event) return false;
  if (event.kind !== "line") return false;
  return breakpoints.has(event.line);
}

// ---------------------------------------------------------------------------
// R4.1 source/input staleness
// ---------------------------------------------------------------------------

/**
 * True when `result`'s trace no longer matches the current editor source/stdin,
 * so the UI must stop presenting it as validated (R4.1). A falsy result is not
 * stale (nothing to invalidate).
 *
 * Freshness uses an EXACT string comparison of the source/input the result was
 * produced from — NOT the 32-bit `sourceRev`/`inputRev` hash, which can collide
 * across distinct sources and make a stale trace look current. The hash is kept
 * only for worker-message correlation. A result that predates the exact-string
 * feature (no recorded `source`) is treated as stale — we cannot prove it
 * matches the current editor.
 */
export function isResultStale(
  result: RunResult | null | undefined,
  source: string,
  stdin: string,
): boolean {
  if (!result) return false;
  // Exact comparison is authoritative when the result recorded its source.
  if (typeof result.source === "string") {
    if (result.source !== source) return true;
    // Compare stdin exactly when recorded; an unrecorded stdin defaults to "".
    if ((result.stdin ?? "") !== stdin) return true;
    return false;
  }
  // Legacy result without an exact source: cannot prove it matches → stale.
  return true;
}
