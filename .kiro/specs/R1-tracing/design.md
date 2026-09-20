# R1 — Design (root cause → fix)

All changes are in `src/engine/tracer.py`. No lesson content changed.

## R1-A/B/C — inspection executed learner code

**Root cause.** `_encode_object` (1) fell back to `repr(obj)` for unknown
objects, (2) read the instance dict with `getattr(obj, "__dict__")` (which fires
a `@property`/descriptor), and (3) iterated containers with the possibly
overridden bound methods (`obj.items()`, iteration).

**Fix.**
- New `_safe_label(obj)` returns `"<TypeName>"` with no `__repr__`/`__str__`
  call. Opaque values and the fallback path use it; `_safe_repr` (which called
  `repr`) is removed.
- Containers are walked via the BUILTIN base-type methods
  (`list.__iter__`, `dict.keys` + `dict.__getitem__`, `set/frozenset.__iter__`,
  `collections.deque.__iter__`), so a subclass override cannot run.
- New `_static_instance_dict(obj)` uses `inspect.getattr_static` to fetch the
  `__dict__` DESCRIPTOR without running code; it only reads the value when the
  descriptor is the standard `getset_descriptor` (normal instance dict). A
  `@property __dict__` (or any custom descriptor) is treated as opaque.
- New `_encode_key` preserves key TYPE (bool/int/float/str/none/tuple) with a
  structural display for tuple keys, without invoking user code.

## R1-D — return value unresolved in its snapshot

**Root cause.** In `_trace`, `returnValue=rec._encode_value(arg)` was evaluated
as an argument BEFORE `_record` reset `self._obj_table = {}`, so the return
ref pointed at an id purged from the event's table.

**Fix.** `_record(kind, frame, return_value=_MISSING, error=None)` now resets the
table first, encodes frames, THEN encodes `return_value`/`error` INTO the same
fresh table. `_trace` passes the raw value (`return_value=arg`). A `_MISSING`
sentinel distinguishes `return None` from "no value".

## R1-E/F — input()/EOF

**Root cause.** `readline()` returned `""` at end of supplied input, so `input()`
past EOF succeeded with an empty string.

**Fix.** `readline()` raises `EOFError` when exhausted (matching CPython); a
supplied blank line still returns `""`. `_input` strips only the single trailing
newline (not internal ones).

## R1.4/R1.5 — lifecycle, exit, syntax errors

- `compile()` moved INSIDE the try so the `finally` always restores
  stdout/stderr/tracing/`input()` — even on `SyntaxError`.
- `SyntaxError` → structured, located error (`type`, `msg`, `lineno`) with no
  events.
- `SystemExit` → new terminal status `"exited"` (+ `exitCode`), distinct from
  normal completion (added to `RunStatus` in `core/types.ts`).
- Uncaught exceptions remain `"error"`; caught exceptions still `"completed"`.

## Preserved
Non-finite float string encoding; opaque handling of modules/classes/functions
(now via safe label); aliases, cycles, nested values, big integers. Verified:
all 130 lesson outputs and 29 pattern outputs UNCHANGED.
