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
import builtins

# Limits are injected by the worker before exec via the module globals
# _LIMIT_EVENTS and _LIMIT_TRACE_BYTES. Time is enforced on the JS side by
# terminating the worker, but we also guard event count here.

import types as _types


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
        if self._stdin_pos < len(self._stdin):
            line = self._stdin[self._stdin_pos]
            self._stdin_pos += 1
            return line
        return ""

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
            return {"kind": "float", "value": obj}
        if isinstance(obj, str):
            return {"kind": "str", "value": obj}

        # Opaque, non-data objects (modules, classes, functions, builtins) are
        # shown inline as a short repr and NOT walked. Expanding a module would
        # pull in __builtins__ and hundreds of type/function objects, bloating
        # the trace and distracting from the data structures being taught.
        if _is_opaque(obj):
            return {"kind": "unknown", "repr": self._safe_repr(obj)}

        oid = self._oid(obj)
        # Register the object shell first so cycles resolve to a ref.
        if oid not in self._obj_table:
            self._obj_table[oid] = None  # placeholder to break cycles
            self._obj_table[oid] = self._encode_object(obj, oid, depth)
        return {"kind": "ref", "id": oid}

    def _safe_repr(self, obj):
        try:
            r = repr(obj)
        except Exception as exc:  # never let inspection crash a run
            return "<unrepresentable: %s>" % type(exc).__name__
        if len(r) > 200:
            r = r[:200] + "..."
        return r

    def _encode_object(self, obj, oid, depth):
        tname = type(obj).__name__
        # Guard against pathological depth
        if depth > 12:
            return {"id": oid, "type": tname, "repr": self._safe_repr(obj)}

        # Known safe containers: walk without invoking user code.
        if isinstance(obj, (list, tuple)):
            entries = [
                {"key": str(i), "value": self._encode_value(v, depth + 1)}
                for i, v in enumerate(obj)
            ]
            return {"id": oid, "type": tname, "entries": entries}
        if isinstance(obj, dict):
            entries = []
            for k, v in obj.items():
                # Display key as a string but preserve its original type so an
                # int key 1 is distinguishable from a str key "1".
                if isinstance(k, str):
                    key, key_kind = k, "str"
                elif isinstance(k, bool):
                    key, key_kind = ("True" if k else "False"), "bool"
                elif isinstance(k, int):
                    key, key_kind = str(k), "int"
                elif isinstance(k, float):
                    key, key_kind = repr(k), "float"
                elif k is None:
                    key, key_kind = "None", "none"
                else:
                    key, key_kind = self._safe_repr(k), "unknown"
                entries.append(
                    {
                        "key": key,
                        "keyKind": key_kind,
                        "value": self._encode_value(v, depth + 1),
                    }
                )
            return {"id": oid, "type": tname, "entries": entries}
        if isinstance(obj, (set, frozenset)):
            entries = [
                {"key": str(i), "value": self._encode_value(v, depth + 1)}
                for i, v in enumerate(obj)
            ]
            return {"id": oid, "type": tname, "entries": entries}

        # Generic objects: expose ordinary instance attributes via __dict__
        # WITHOUT triggering descriptors/properties (we read the raw dict).
        d = getattr(obj, "__dict__", None)
        if isinstance(d, dict) and d:
            entries = [
                {"key": str(k), "value": self._encode_value(v, depth + 1)}
                for k, v in d.items()
            ]
            return {"id": oid, "type": tname, "entries": entries}

        # Fallback: opaque value shown by guarded repr.
        return {"id": oid, "type": tname, "repr": self._safe_repr(obj)}

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
    def _record(self, kind, frame, **extra):
        if self.stopped_reason is not None:
            return
        if len(self.events) >= self.limit_events:
            self.stopped_reason = "event-limit"
            raise _StopTracing()
        self._obj_table = {}
        frames = self._encode_frames(frame)
        # objects gathered as a side-effect of encoding frames/extra values
        event = {
            "index": len(self.events),
            "kind": kind,
            "line": frame.f_lineno,
            "frames": frames,
            "objects": self._obj_table,
        }
        event.update(extra)
        # rough size accounting to honour the trace-byte budget
        self.approx_bytes += _rough_size(event)
        if self.approx_bytes > self.limit_bytes:
            self.stopped_reason = "trace-limit"
            raise _StopTracing()
        self.events.append(event)


class _StopTracing(Exception):
    pass


def _rough_size(event):
    # cheap heuristic: count frames, locals and objects rather than serialising
    n = 32
    for fr in event.get("frames", []):
        n += 24 + 16 * len(fr.get("locals", []))
    for _oid, ob in event.get("objects", {}).items():
        if ob is None:
            continue
        n += 24 + 16 * len(ob.get("entries", []) or [])
        n += len(ob.get("repr", "") or "")
    return n


def run_program(source, source_name, limit_events, limit_bytes, stdin_text):
    """Execute `source`, returning a JSON-serialisable RunResult dict."""
    stdin_lines = _split_stdin(stdin_text)
    rec = _TraceRecorder(source_name, limit_events, limit_bytes, stdin_lines)

    out_buf = io.StringIO()
    err_buf = io.StringIO()

    # input() reads supplied stdin and echoes to stdout like a real prompt.
    def _input(prompt=""):
        if prompt:
            out_buf.write(str(prompt))
        line = rec.readline()
        return line.rstrip("\n")

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
                rec._record(
                    "return", frame, returnValue=rec._encode_value(arg)
                )
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
            sys.settrace(None)
            return None
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

    compiled = compile(source, source_name, "exec")
    prog_globals = {"__name__": "__main__", "__builtins__": builtins}

    try:
        sys.settrace(_trace)
        exec(compiled, prog_globals)
    except _StopTracing:
        pass
    except SystemExit:
        pass
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
    elif rec.stopped_reason == "trace-limit":
        result["status"] = "trace-limit"

    result["events"] = rec.events
    result["stdout"] = out_buf.getvalue()
    result["stderr"] = err_buf.getvalue()
    return result


def _split_stdin(stdin_text):
    if not stdin_text:
        return []
    # keepends so input() can strip its own newline consistently
    return stdin_text.splitlines(keepends=True)
