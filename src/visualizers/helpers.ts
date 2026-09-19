/**
 * Shared helpers for all visualizers.
 *
 * Every visualizer receives a TraceEvent (an immutable snapshot) plus a
 * VisualBinding, and reads values out of the event's frames + object table.
 * These helpers centralise variable/path resolution and overlay handling so
 * each structure renderer stays small and consistent.
 */

import type {
  TraceEvent,
  TraceObject,
  TraceValue,
  VisualBinding,
} from "../core/types";

/** Look up a variable's value in the innermost frame that defines it. */
export function resolveVariable(
  event: TraceEvent,
  name: string,
): TraceValue | undefined {
  for (let i = event.frames.length - 1; i >= 0; i--) {
    const found = event.frames[i].locals.find((l) => l.name === name);
    if (found) return found.value;
  }
  return undefined;
}

/** Resolve the object a ref points at, if any. */
export function deref(
  event: TraceEvent,
  value: TraceValue | undefined,
): TraceObject | undefined {
  if (!value || value.kind !== "ref") return undefined;
  return event.objects[value.id];
}

/**
 * Resolve a binding to its root object, honouring an optional dotted `path`
 * into object fields (e.g. "root.left.right"). Array/dict indexing uses the
 * entry key, so "grid.0" walks into the first row.
 */
export function resolveBindingObject(
  event: TraceEvent,
  binding: Pick<VisualBinding, "variable" | "path">,
): { value: TraceValue | undefined; object: TraceObject | undefined } {
  let value = resolveVariable(event, binding.variable);
  if (binding.path) {
    for (const seg of binding.path.split(".").filter(Boolean)) {
      const obj = deref(event, value);
      if (!obj || !obj.entries) {
        value = undefined;
        break;
      }
      const entry = obj.entries.find((e) => e.key === seg);
      value = entry?.value;
    }
  }
  return { value, object: deref(event, value) };
}

/** Read a numeric value (int/float) if the variable currently holds one. */
export function asNumber(v: TraceValue | undefined): number | undefined {
  if (!v) return undefined;
  if (v.kind === "int" && typeof v.value === "number") return v.value;
  if (v.kind === "float") return v.value;
  return undefined;
}

/** Read a string value if the variable currently holds one. */
export function asString(v: TraceValue | undefined): string | undefined {
  if (v && v.kind === "str") return v.value;
  return undefined;
}

export type ResolvedOverlay = {
  role: NonNullable<VisualBinding["overlays"]>[number]["role"];
  label: string;
  /** Numeric index the overlay points at (for pointer/boundary/highlight). */
  index?: number;
  /** Raw value the overlay tracks (for total/visited/window). */
  value?: TraceValue;
};

/** Resolve all overlays on a binding against the current event. */
export function resolveOverlays(
  event: TraceEvent,
  binding: VisualBinding,
): ResolvedOverlay[] {
  return (binding.overlays ?? []).map((o) => {
    const value = resolveVariable(event, o.source);
    return {
      role: o.role,
      label: o.label,
      index: asNumber(value),
      value,
    };
  });
}

/** Overlays that mark a single index (pointer/boundary/highlight). */
export function indexOverlays(
  overlays: ResolvedOverlay[],
  length: number,
): ResolvedOverlay[] {
  return overlays.filter(
    (o) =>
      (o.role === "pointer" || o.role === "boundary" || o.role === "highlight") &&
      o.index !== undefined &&
      o.index >= 0 &&
      o.index < length,
  );
}

/** A small stable palette for distinct overlays/labels. */
export const OVERLAY_COLORS = [
  "#ffd479",
  "#7aa2ff",
  "#7ee787",
  "#ff9e9e",
  "#c39bff",
  "#7fe0d4",
];

export function overlayColor(i: number): string {
  return OVERLAY_COLORS[i % OVERLAY_COLORS.length];
}
