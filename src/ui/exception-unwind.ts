import type { TraceEvent } from "../core/types";

/**
 * CPython emits a return event with arg=None when an exception leaves a frame.
 * Identify only the directly observed case: adjacent exception and None-return
 * events in the same recorded stack. A later handled return is not unwinding.
 * Source: https://docs.python.org/3.14/library/sys.html#sys.settrace
 */
export function isExceptionUnwind(event: TraceEvent, previous?: TraceEvent): boolean {
  if (event.kind !== "return" || event.returnValue?.kind !== "none" || previous?.kind !== "exception"
    || previous.index + 1 !== event.index || !event.frames.length || previous.frames.length !== event.frames.length) return false;
  return event.frames.every((frame, index) => frame.name === previous.frames[index].name);
}
