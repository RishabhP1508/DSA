# R1 — Make Python tracing preserve program behavior (Bugfix)

**Depends on:** R0 (merged). **Runtime:** bundled Pyodide = CPython 3.14.2.
**File under repair:** `src/engine/tracer.py`.

## Defects (reproduced in R0 findings.md)

| ID | Defect | Reproduction |
|---|---|---|
| R1-A | Inspection executes a learner `__repr__` | side-effecting `__repr__` counter incremented during inspection (fallback path calls `repr()`) |
| R1-B | `getattr(obj, "__dict__")` fires a `@property`/descriptor | a `@property __dict__` with a side effect ran |
| R1-C | Container-subclass override invoked (`items`/`__iter__`) | `isinstance(obj, dict)` then `obj.items()` calls the override |
| R1-D | Object table reset AFTER the return value is encoded | `returnValue=encode(arg)` is evaluated before `_record` resets `self._obj_table`; the return ref is unresolved in its snapshot |
| R1-E | EOF returns `""` with status `completed` | `input()` past supplied stdin returns `""`; should raise `EOFError` |
| R1-F | `input()` newline handling | `rstrip("\n")` semantics; blank supplied line should be `""`, real EOF should raise |

## Expected behavior (testable)

- **R1-REQ-1.** WHEN the tracer inspects any learner value, THE SYSTEM SHALL NOT
  execute learner-defined code (`__repr__`, `__getattribute__`, properties,
  descriptors, overridden container methods, `__eq__`/`__hash__` on custom keys).
  Inspection uses side-effect-free access (`inspect.getattr_static`, direct
  builtin iteration, raw instance dict) only.
- **R1-REQ-2.** WHEN a value cannot be safely inspected, THE SYSTEM SHALL show an
  opaque object with a safe type label and identity, and SHALL NOT fall back to
  calling the value's `__repr__`.
- **R1-REQ-3.** WHEN encoding a `return` (or `exception`) event, THE SYSTEM SHALL
  produce a self-contained snapshot in which the return/exception value's
  references resolve within that event's object table.
- **R1-REQ-4.** WHEN `input()` is called with no remaining supplied input, THE
  SYSTEM SHALL raise `EOFError` (status `error`), not return an empty string. A
  supplied blank line SHALL return `""`; prompts SHALL appear in output; unicode
  SHALL be preserved; successive reads SHALL consume successive lines.
- **R1-REQ-5.** WHEN the program raises, exits, hits a limit, or completes, THE
  SYSTEM SHALL restore stdout/stderr, tracing, and `input()` (guaranteed
  cleanup), and SHALL represent explicit `SystemExit` distinctly from normal
  completion.
- **R1-REQ-6.** THE SYSTEM SHALL preserve aliases, cycles, nested values, typed
  dict keys (incl. tuple keys), large integers, and non-finite floats; and
  associate output/exception events with their actual execution position.

## Preservation requirements (must NOT break)

- Legitimate learner **stdout** must be unchanged. Trace structure / event
  counts MAY change; a lesson's `expectedOutput` is updated ONLY if the old
  output was genuinely wrong (with evidence) — never merely because counts moved.
- Non-finite float string encoding (`"Infinity"`/`"-Infinity"`/`"NaN"`) stays.
- Opaque handling of modules/classes/functions stays (but via safe type label,
  not by invoking user `__repr__`).

## Acceptance

For the R1 regression corpus (below), tracing does not change output, return
values, mutations, or exception behavior; the reproduced defects R1-A..F no
longer occur; the full R0 suite still passes (adjusting only trace-specific
fixtures, not legitimate lesson output).
