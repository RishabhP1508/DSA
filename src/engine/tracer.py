"""
Tracing runtime for DSA Visual Lab.

This module executes a single-file learner/lesson program under sys.settrace and
records an immutable snapshot per step. It is loaded into Pyodide and driven by
the worker (see run.worker.ts).

Design rules taken from the plan's "Execution engine" section:
  * Preserve original behaviour; never re-evaluate expressions merely to explain
    them. We only READ frame locals and walk already-existing objects.
  * Distinguish the next executable line from completed state changes: a "line"
    event fires *before* the line runs, so the snapshot shows state resulting
    from all previously executed lines.
  * Record immutable states with frames, variables, object identities,
    references, output, returns and errors.
  * Preserve aliases, cycles and nested objects via an id-keyed object table.
  * Avoid invoking user-defined __repr__/properties during inspection where it
    could run arbitrary code or mutate state. We special-case known safe
    container types and fall back to a guarded repr for everything else.

The recorded trace is returned to JS as plain JSON-serialisable data.
"""

import sys
import io
import json
import builtins
import inspect

# Limits are injected by the worker before exec via the module globals
# _LIMIT_EVENTS and _LIMIT_TRACE_BYTES. Time is enforced on the JS side by
# terminating the worker, but we also guard event count here.

import types as _types
import collections as _collections


# Sentinel so `return None` is distinguishable from "no return value supplied".
_MISSING = object()

# Bounded serialization: never encode more than this many entries from a single
# container in one snapshot, so inspecting one huge value cannot allocate an
# unbounded payload before the byte budget is even checked (R2.4). The overflow
# is marked so the UI can show the value was truncated.
_MAX_ENTRIES_PER_OBJECT = 1000


def _is_opaque(obj):
    """True for non-data objects we show as a short repr instead of walking.

    Modules, classes/types, functions, methods and built-ins are program
    machinery, not the data being taught. Walking them (especially modules)
    would drag in __builtins__ and the whole type/function graph.
    """
    return isinstance(
        obj,
        (
            _types.ModuleType,
            type,
            _types.FunctionType,
            _types.BuiltinFunctionType,
            _types.MethodType,
            _types.BuiltinMethodType,
            _types.MethodWrapperType,
            _types.WrapperDescriptorType,
            _types.MethodDescriptorType,
            _types.GetSetDescriptorType,
        ),
    )


class _TraceRecorder:
    def __init__(self, source_name, limit_events, limit_bytes, stdin_lines):
        self.source_name = source_name
        self.limit_events = limit_events
        self.limit_bytes = limit_bytes
        self.events = []
        self.approx_bytes = 0
        self.stopped_reason = None
        self._stdin = list(stdin_lines)
        self._stdin_pos = 0
        # object identity table for the CURRENT snapshot; rebuilt each event so
        # each event is self-contained and immutable.
        self._obj_table = {}

    # -- stdin for input() -------------------------------------------------
    def readline(self):
        """Return the next supplied line, or raise EOFError when exhausted.

        A SUPPLIED blank line ("\\n") is real input and returns "" (after the
        caller strips the newline). Running past the end of supplied input is
        end-of-file: CPython's input() raises EOFError there, so we do too —
        we do NOT invent an empty string (fixes R1-E)."""
        if self._stdin_pos < len(self._stdin):
            line = self._stdin[self._stdin_pos]
            self._stdin_pos += 1
            return line
        raise EOFError("EOF when reading a line")

    # -- value inspection --------------------------------------------------
    def _oid(self, obj):
        return "obj_" + str(id(obj))

    def _encode_value(self, obj, depth=0):
        """Encode a Python value into a TraceValue dict.

        Primitives are inlined. Containers/objects are referenced by id and
        registered into the per-event object table (which preserves aliases and
        cycles because we check the table before recursing).
        """
        if obj is None:
            return {"kind": "none"}
        if isinstance(obj, bool):
            return {"kind": "bool", "value": obj}
        if isinstance(obj, int):
            # ints can exceed JS safe integer range; send big ones as strings
            if -(2**53) < obj < 2**53:
                return {"kind": "int", "value": obj}
            return {"kind": "int", "value": str(obj)}
        if isinstance(obj, float):
            # JS JSON.parse rejects Infinity/NaN, so encode non-finite floats
            # as strings; the JS side maps them back for display.
            import math as _math
            if _math.isinf(obj):
                return {"kind": "float", "value": "Infinity" if obj > 0 else "-Infinity"}
            if _math.isnan(obj):
                return {"kind": "float", "value": "NaN"}
            return {"kind": "float", "value": obj}
        if isinstance(obj, str):
            return {"kind": "str", "value": obj}

        # Opaque, non-data objects (modules, classes, functions, builtins) are
        # shown inline as a SAFE TYPE LABEL and NOT walked. We never call the
        # value's __repr__ (it could run arbitrary learner code / have side
        # effects); instead we describe it by type + identity.
        if _is_opaque(obj):
            return {"kind": "unknown", "repr": self._safe_label(obj)}

        oid = self._oid(obj)
        # Register the object shell first so cycles resolve to a ref.
        if oid not in self._obj_table:
            self._obj_table[oid] = None  # placeholder to break cycles
            self._obj_table[oid] = self._encode_object(obj, oid, depth)
        return {"kind": "ref", "id": oid}

    def _safe_label(self, obj):
        """A side-effect-free description: type name (+ id for data objects).

        Never calls the object's __repr__/__str__. Used for opaque values and as
        the fallback when an object cannot be safely walked.
        """
        try:
            tname = type(obj).__name__
        except Exception:
            tname = "object"
        return "<%s>" % tname

    def _encode_key(self, k):
        """Encode a dict key as (display, keyKind) WITHOUT invoking user code.

        Preserves the key's type. Tuple keys are shown structurally. Custom
        objects are labelled by type only (no __repr__/__hash__ side effects
        beyond what dict membership already required)."""
        if isinstance(k, bool):
            return ("True" if k else "False"), "bool"
        if isinstance(k, int):
            return str(int(k)), "int"
        if isinstance(k, float):
            import math as _math
            if _math.isinf(k):
                return ("Infinity" if k > 0 else "-Infinity"), "float"
            if _math.isnan(k):
                return "NaN", "float"
            return repr(float(k)), "float"
        if isinstance(k, str):
            return k, "str"
        if k is None:
            return "None", "none"
        if isinstance(k, tuple):
            # Show tuple keys structurally AND type-aware, so (1, 2) and
            # ('1', 2) render distinctly. Each element is formatted by
            # `_key_element_repr`, which quotes strings ('1'), keeps ints bare
            # (1), and recurses into nested tuples — without invoking user code.
            parts = [self._key_element_repr(item) for item in tuple.__iter__(k)]
            return "(" + ", ".join(parts) + ")", "tuple"
        return self._safe_label(k), "unknown"

    def _key_element_repr(self, k):
        """A type-aware, side-effect-free display of ONE tuple-key element.

        Unlike `_encode_key`'s display (which is bare for scalars), this keeps
        each element's type visible so structurally-similar tuple keys with
        different element types are distinguishable: a str element is quoted
        ('1'), an int is bare (1), a nested tuple recurses."""
        if isinstance(k, bool):
            return "True" if k else "False"
        if isinstance(k, int):
            return str(int(k))
        if isinstance(k, float):
            import math as _math
            if _math.isinf(k):
                return "inf" if k > 0 else "-inf"
            if _math.isnan(k):
                return "nan"
            return repr(float(k))
        if isinstance(k, str):
            # Quote so 'a' is visibly a string, distinct from a bare identifier.
            return "'" + k.replace("\\", "\\\\").replace("'", "\\'") + "'"
        if k is None:
            return "None"
        if isinstance(k, tuple):
            return "(" + ", ".join(self._key_element_repr(i) for i in tuple.__iter__(k)) + ")"
        return self._safe_label(k)

    def _encode_object(self, obj, oid, depth):
        try:
            tname = type(obj).__name__
        except Exception:
            tname = "object"
        # Guard against pathological depth: label instead of walking. Mark it
        # `truncated` so the inspector can tell the learner that deeper data was
        # omitted at the inspection depth limit (R4 follow-up #5).
        if depth > 12:
            return {"id": oid, "type": tname, "repr": self._safe_label(obj), "truncated": True}

        # Known safe containers. We call the BUILTIN base-type methods directly
        # (e.g. list.__iter__, dict.keys) so an overridden __iter__/items/keys on
        # a subclass cannot run learner code during inspection.
        if isinstance(obj, (list, tuple)):
            base = list if isinstance(obj, list) else tuple
            entries = []
            truncated = False
            for i, v in enumerate(base.__iter__(obj)):
                if i >= _MAX_ENTRIES_PER_OBJECT:
                    truncated = True
                    break
                entries.append({"key": str(i), "value": self._encode_value(v, depth + 1)})
            out = {"id": oid, "type": tname, "entries": entries}
            if truncated:
                out["truncated"] = True
            return out
        if isinstance(obj, dict):
            entries = []
            truncated = False
            # dict.keys / dict.__getitem__ on the base type avoid subclass overrides.
            for i, k in enumerate(dict.keys(obj)):
                if i >= _MAX_ENTRIES_PER_OBJECT:
                    truncated = True
                    break
                v = dict.__getitem__(obj, k)
                key, key_kind = self._encode_key(k)
                entries.append(
                    {
                        "key": key,
                        "keyKind": key_kind,
                        "value": self._encode_value(v, depth + 1),
                    }
                )
            out = {"id": oid, "type": tname, "entries": entries}
            if truncated:
                out["truncated"] = True
            return out
        if isinstance(obj, (set, frozenset)):
            base = set if isinstance(obj, set) else frozenset
            entries = []
            truncated = False
            for i, v in enumerate(base.__iter__(obj)):
                if i >= _MAX_ENTRIES_PER_OBJECT:
                    truncated = True
                    break
                entries.append({"key": str(i), "value": self._encode_value(v, depth + 1)})
            out = {"id": oid, "type": tname, "entries": entries}
            if truncated:
                out["truncated"] = True
            return out
        if isinstance(obj, _collections.deque):
            entries = []
            truncated = False
            for i, v in enumerate(_collections.deque.__iter__(obj)):
                if i >= _MAX_ENTRIES_PER_OBJECT:
                    truncated = True
                    break
                entries.append({"key": str(i), "value": self._encode_value(v, depth + 1)})
            out = {"id": oid, "type": tname, "entries": entries}
            if truncated:
                out["truncated"] = True
            return out

        # Generic objects: expose ordinary instance attributes via a
        # SIDE-EFFECT-FREE static read of __dict__. inspect.getattr_static and
        # the base-type __dict__ descriptor do not trigger @property/descriptors.
        raw = self._static_instance_dict(obj)
        if isinstance(raw, dict) and raw:
            entries = [
                {"key": str(k), "value": self._encode_value(v, depth + 1)}
                for k, v in raw.items()
            ]
            return {"id": oid, "type": tname, "entries": entries}

        # Fallback: opaque value shown by a safe type label (never __repr__).
        return {"id": oid, "type": tname, "repr": self._safe_label(obj)}

    def _static_instance_dict(self, obj):
        """Return the instance __dict__ without invoking descriptors/properties.

        We look up the __dict__ DESCRIPTOR statically (never running user code).
        Only the standard getset_descriptor (the normal instance-dict slot) is
        read, via its __get__. If a class overrides __dict__ as a @property or
        any non-standard descriptor, we DO NOT invoke it and return None so the
        object is treated as opaque. Objects with __slots__ / C types also
        return None."""
        try:
            desc = inspect.getattr_static(obj, "__dict__", None)
        except Exception:
            return None
        # The normal instance-dict slot is a getset_descriptor whose __get__
        # returns the real dict with no side effects.
        if type(desc) is _types.GetSetDescriptorType:
            try:
                d = desc.__get__(obj, type(obj))
            except Exception:
                return None
            return d if isinstance(d, dict) else None
        # Anything else (property, custom descriptor, or a plain dict returned by
        # a subclass shadowing) is NOT safe to invoke — treat as opaque.
        return None

    def _encode_frames(self, frame):
        """Encode the frame stack innermost-last.

        Only frames belonging to the user program (matched by filename) are
        included. This excludes the exec() caller and our own machinery, whose
        locals would otherwise pull in huge objects like __builtins__.
        """
        chain = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == self.source_name:
                chain.append(f)
            f = f.f_back
        chain.reverse()
        out = []
        for f in chain:
            name = f.f_code.co_name
            locals_ = []
            for k, v in list(f.f_locals.items()):
                if k.startswith("__") and k.endswith("__"):
                    continue
                locals_.append({"name": k, "value": self._encode_value(v)})
            out.append(
                {"name": name, "line": f.f_lineno, "locals": locals_}
            )
        return out

    # -- event recording ---------------------------------------------------
    def _record(self, kind, frame, return_value=_MISSING, error=None):
        """Record one immutable, self-contained snapshot.

        The object table is reset FIRST, then everything referenced by this
        event — frame locals AND the return value — is encoded into that same
        fresh table. This is what makes each snapshot self-contained: a returned
        object's ref always resolves within its own event (fixes R1-D, where the
        return value was previously encoded before the table was reset)."""
        # Once a limit has been hit, keep raising on EVERY call so a learner
        # `except BaseException` cannot swallow the stop once and then resume
        # unbounded recording (R2-E hardening).
        if self.stopped_reason is not None:
            raise _StopTracing()
        if len(self.events) >= self.limit_events:
            self.stopped_reason = "event-limit"
            raise _StopTracing()
        self._obj_table = {}
        frames = self._encode_frames(frame)
        event = {
            "index": len(self.events),
            "kind": kind,
            "line": frame.f_lineno,
            "frames": frames,
            "objects": self._obj_table,
        }
        # Encode the return value INTO the same (already-reset) object table.
        if return_value is not _MISSING:
            event["returnValue"] = self._encode_value(return_value)
        if error is not None:
            event["error"] = error
        # REAL byte accounting: measure the actual UTF-8 JSON size of this event
        # exactly as it will cross to JS (strings, keys, output, metadata all
        # counted). If adding it would exceed the budget, do NOT append it, keep
        # the last valid states, mark trace-limit, and stop (R2-C).
        try:
            event_bytes = len(json.dumps(event).encode("utf-8"))
        except (TypeError, ValueError):
            # Should not happen (all values are JSON-safe by construction), but
            # if an event is somehow non-serialisable, treat it as oversized.
            self.stopped_reason = "trace-limit"
            raise _StopTracing()
        if self.approx_bytes + event_bytes > self.limit_bytes:
            self.stopped_reason = "trace-limit"
            raise _StopTracing()
        self.approx_bytes += event_bytes
        self.events.append(event)


class _StopTracing(BaseException):
    """Internal control signal to stop recording at a resource limit.

    Derives from BaseException (not Exception) so a learner `except Exception`
    does not swallow it. A learner `except BaseException` still *can* catch it in
    their frame, so this signal is NOT trusted as the sole guard: (1) `_record`
    re-raises on EVERY call once `stopped_reason` is set, so a single swallow
    cannot resume unbounded recording within the trace callback, and (2) the
    coordinator terminates the worker after any limit and the 10 s exec timeout
    is a hard main-thread backstop (see engine.ts / run.worker.ts, R2-E)."""

    pass


def run_program(source, source_name, limit_events, limit_bytes, stdin_text):
    """Execute `source`, returning a JSON-serialisable RunResult dict."""
    stdin_lines = _split_stdin(stdin_text)
    rec = _TraceRecorder(source_name, limit_events, limit_bytes, stdin_lines)

    out_buf = io.StringIO()
    err_buf = io.StringIO()

    # input() reads supplied stdin and echoes the prompt like the real builtin.
    # Raises EOFError past the end of supplied input (rec.readline does), matching
    # CPython. Strips only the single trailing newline (not internal newlines).
    def _input(prompt=""):
        if prompt:
            out_buf.write(str(prompt))
        line = rec.readline()
        if line.endswith("\n"):
            line = line[:-1]
        return line

    def _trace(frame, event, arg):
        # Only trace lines belonging to the user program (by filename).
        if frame.f_code.co_filename != source_name:
            return None
        try:
            if event == "call":
                rec._record("call", frame)
            elif event == "line":
                rec._record("line", frame)
            elif event == "return":
                # Pass the raw value; it is encoded INSIDE _record after the
                # object table is reset, so its refs resolve in this snapshot.
                rec._record("return", frame, return_value=arg)
            elif event == "exception":
                exc_type, exc_val, _tb = arg
                rec._record(
                    "exception",
                    frame,
                    error={
                        "type": exc_type.__name__,
                        "message": str(exc_val),
                    },
                )
        except _StopTracing:
            # A resource limit was hit. Propagate the stop so it unwinds the
            # learner's frames and terminates exec(). We do NOT settrace(None):
            # if learner code catches this (e.g. `except BaseException`), the
            # NEXT traced event re-raises immediately (rec._record raises while
            # stopped_reason is set), so a single swallow cannot resume the run.
            # The main-thread exec timeout + worker termination remain the hard
            # backstop (R2-E).
            raise
        return _trace

    result = {
        "status": "completed",
        "events": rec.events,
        "stdout": "",
        "stderr": "",
    }

    old_stdout, old_stderr = sys.stdout, sys.stderr
    old_input = builtins.input
    sys.stdout, sys.stderr = out_buf, err_buf
    builtins.input = _input

    prog_globals = {"__name__": "__main__", "__builtins__": builtins}

    # ALL state-changing setup (compile + exec) is inside the try so the finally
    # always restores streams/tracing/input — even on a SyntaxError (R1.4).
    try:
        compiled = compile(source, source_name, "exec")
        sys.settrace(_trace)
        exec(compiled, prog_globals)
    except _StopTracing:
        pass
    except SyntaxError as exc:
        # No execution events exist; still report a structured, located error.
        result["error"] = {
            "type": type(exc).__name__,
            "message": str(getattr(exc, "msg", exc)),
            "line": getattr(exc, "lineno", None),
        }
        result["status"] = "error"
        import traceback as _tb2
        err_buf.write("".join(_tb2.format_exception_only(type(exc), exc)))
    except SystemExit as exc:
        # Explicit program exit is NOT the same as normal completion (R1.4).
        code = exc.code
        result["status"] = "exited"
        result["exitCode"] = code if isinstance(code, int) or code is None else str(code)
    except BaseException as exc:  # capture the program's own error
        import traceback

        tb = exc.__traceback__
        line = None
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == source_name:
                line = tb.tb_lineno
            tb = tb.tb_next
        result["error"] = {
            "type": type(exc).__name__,
            "message": str(exc),
            "line": line,
        }
        result["status"] = "error"
        err_buf.write("".join(traceback.format_exception_only(type(exc), exc)))
    finally:
        sys.settrace(None)
        sys.stdout, sys.stderr = old_stdout, old_stderr
        builtins.input = old_input

    if rec.stopped_reason == "event-limit":
        result["status"] = "event-limit"
        result["incomplete"] = True
        result["limitHit"] = "events"
    elif rec.stopped_reason == "trace-limit":
        result["status"] = "trace-limit"
        result["incomplete"] = True
        result["limitHit"] = "bytes"

    result["events"] = rec.events
    result["stdout"] = out_buf.getvalue()
    result["stderr"] = err_buf.getvalue()
    return result


def _split_stdin(stdin_text):
    if not stdin_text:
        return []
    # keepends so input() can strip its own newline consistently
    return stdin_text.splitlines(keepends=True)
