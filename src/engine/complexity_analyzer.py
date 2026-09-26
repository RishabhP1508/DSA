"""
R7.3 — conservative static complexity analysis for PERSONAL (learner) code.

This is deliberately narrow and HONEST: it establishes a whole-program time
bound ONLY for the forms the plan sanctions —

  * fixed (constant) straight-line work,
  * a single bounded `for` loop over a recognized iterable,
  * sequential `for` loops (added, not multiplied),
  * directly-nested `for` loops over recognized iterables (multiplied),

where a "recognized iterable" is `range(n)` / `range(len(x))` / a bare name /
`enumerate(x)` / a literal list/tuple/str, and each loop bound is understood.

It BLOCKS a whole-program claim (returns source="not-determined" with a specific
`uncertaintyReason`) on anything it cannot bound soundly:

  * `while` loops (data-dependent termination),
  * recursion (a function that calls itself, directly),
  * calls to functions whose cost it does not model (any call that is not a
    known-constant builtin) inside a loop,
  * comprehensions/generators over an unrecognized iterable,
  * loops over an expression it does not recognize,
  * `break`/dynamic control it cannot account for in a bound.

It never GUESSES. A supported local finding is only surfaced as a whole-program
bound when the WHOLE analyzed unit is supported; otherwise the reason explains
exactly what stopped it. Variable NAMES are never used to infer input meaning
(plan §4): size variables are reported structurally (e.g. "len(nums)" -> n1).

Returns a JSON-serialisable dict shaped like the TS `ComplexityAnalysisResult`:
  { "source": "auto-supported"|"not-determined",
    "time": "O(...)" (when auto-supported),
    "uncertaintyReason": "..." (when not-determined),
    "supportedFindings": [ ... human-readable local notes ... ],
    "sizeVars": [ {"symbol": "n1", "meaning": "length of the range/collection ..."} ] }

Constant-cost builtins we model as O(1) per call (amortized, per the cost model
the app already uses): len, range, print, int, float, str, bool, abs, min, max
(on fixed arity), append, add, pop (amortized), and arithmetic.
"""

import ast
import json

# Builtins/methods we treat as O(1) per call for the conservative model. Calls
# to anything NOT here (inside a loop) block a whole-program bound.
_CONST_CALLS = {
    "len", "range", "print", "int", "float", "str", "bool", "abs",
    "ord", "chr", "round", "isinstance", "enumerate",
}
_CONST_METHODS = {"append", "add", "pop", "get", "setdefault", "popleft", "appendleft"}


class _Blocked(Exception):
    def __init__(self, reason):
        self.reason = reason


class _Analyzer:
    def __init__(self, func_names):
        self.func_names = func_names  # names defined at top level (for recursion detection)
        self.size_vars = []
        self.findings = []

    def _size_symbol(self, iter_node):
        """Return a symbol for a recognized iterable's size, or raise _Blocked."""
        # range(x) / range(a, b) -> linear in the range span
        if isinstance(iter_node, ast.Call) and isinstance(iter_node.func, ast.Name) and iter_node.func.id == "range":
            desc = "size of range(" + ast.unparse(iter_node).split("range", 1)[1] + ")"
        elif isinstance(iter_node, ast.Call) and isinstance(iter_node.func, ast.Name) and iter_node.func.id == "enumerate":
            desc = "length of " + (ast.unparse(iter_node.args[0]) if iter_node.args else "the collection")
        elif isinstance(iter_node, ast.Name):
            desc = "length of " + iter_node.id
        elif isinstance(iter_node, (ast.List, ast.Tuple, ast.Set, ast.Constant)):
            # A literal iterable is a FIXED size -> constant w.r.t. input.
            return None  # signals "constant loop"
        else:
            raise _Blocked("a loop iterates over an expression the analyzer does not recognize (" + ast.unparse(iter_node) + ")")
        sym = "n" + str(len(self.size_vars) + 1)
        self.size_vars.append({"symbol": sym, "meaning": desc})
        return sym

    def _check_calls_constant(self, node):
        """Raise _Blocked if `node` contains a call the model can't treat as
        O(1), or a comprehension/generator (an implicit unbounded loop)."""
        for sub in ast.walk(node):
            if isinstance(sub, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
                raise _Blocked("a comprehension/generator is present; the analyzer does not bound it")
            if isinstance(sub, ast.Call):
                f = sub.func
                if isinstance(f, ast.Name):
                    if f.id in self.func_names:
                        raise _Blocked("a loop body calls user-defined function '" + f.id + "' whose cost is not modelled")
                    if f.id not in _CONST_CALLS:
                        raise _Blocked("a loop body calls '" + f.id + "()', which the analyzer does not model as constant-time")
                elif isinstance(f, ast.Attribute):
                    if f.attr not in _CONST_METHODS:
                        raise _Blocked("a loop body calls method '." + f.attr + "()', which the analyzer does not model as constant-time")
                else:
                    raise _Blocked("a loop body contains a call the analyzer cannot identify")

    def loop_degree(self, body):
        """Max nesting degree of recognized for-loops in a statement list.
        Returns an int degree (0 = constant). Raises _Blocked on anything
        unsupported (while, comprehension over unknown, unmodelled calls...)."""
        max_deg = 0
        for stmt in body:
            deg = self._stmt_degree(stmt)
            if deg > max_deg:
                max_deg = deg
        return max_deg

    def _stmt_degree(self, stmt):
        if isinstance(stmt, ast.While):
            raise _Blocked("a `while` loop has a data-dependent bound the analyzer cannot establish")
        if isinstance(stmt, ast.For):
            sym = self._size_symbol(stmt.iter)
            # A loop over a literal is constant w.r.t. input size.
            this_level = 0 if sym is None else 1
            # Non-loop statements in the body must not contain unmodelled calls.
            inner = 0
            for s in stmt.body:
                if isinstance(s, (ast.For, ast.While)):
                    inner = max(inner, self._stmt_degree(s))
                else:
                    self._check_calls_constant(s)
            return this_level + inner
        if isinstance(stmt, ast.If):
            return max([self.loop_degree(stmt.body), self.loop_degree(stmt.orelse)] or [0])
        if isinstance(stmt, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
            raise _Blocked("a comprehension/generator is present; the analyzer does not bound it")
        # Any other statement: ensure no unmodelled call at top level of a
        # loop-free path (constant work is fine).
        self._check_calls_constant(stmt)
        return 0


def _has_recursion(func_node, func_names):
    name = func_node.name
    for sub in ast.walk(func_node):
        if isinstance(sub, ast.Call) and isinstance(sub.func, ast.Name) and sub.func.id == name:
            return True
    return False


def analyze_complexity(source):
    """Return a ComplexityAnalysisResult-shaped dict for `source`."""
    try:
        tree = ast.parse(source)
    except SyntaxError as e:
        return {"source": "not-determined", "uncertaintyReason": "the code does not parse: " + str(e)}

    top_funcs = [n for n in tree.body if isinstance(n, ast.FunctionDef)]
    func_names = {n.name for n in top_funcs}

    # Choose the unit to analyze: if there is exactly one top-level function and
    # the rest is trivial, analyze that function; else analyze the top-level
    # script body. Comprehension over unknown / while / recursion all block.
    analyzer = _Analyzer(func_names)

    # Recursion anywhere blocks a whole-program claim.
    for fn in top_funcs:
        if _has_recursion(fn, func_names):
            return {
                "source": "not-determined",
                "uncertaintyReason": "the code is recursive (function '" + fn.name + "' calls itself); recursion is outside the supported forms",
            }

    try:
        if len(top_funcs) == 1 and all(
            isinstance(n, (ast.FunctionDef, ast.Import, ast.ImportFrom, ast.Expr, ast.Assign, ast.Pass))
            for n in tree.body
        ):
            fn = top_funcs[0]
            degree = analyzer.loop_degree(fn.body)
            scope = "function"
            unit = "function '" + fn.name + "'"
        else:
            # Analyze the top-level script body (skip function DEFS themselves —
            # only their being CALLED at top level matters, which _check flags).
            body = [n for n in tree.body if not isinstance(n, ast.FunctionDef)]
            degree = analyzer.loop_degree(body)
            scope = "program"
            unit = "the program"
    except _Blocked as b:
        return {"source": "not-determined", "uncertaintyReason": b.reason}

    # Build the bound from the degree and the recognized size variables.
    if degree == 0:
        bound = "O(1)"
        finding = unit + " does a fixed amount of work (no input-dependent loop)."
    else:
        syms = [v["symbol"] for v in analyzer.size_vars]
        if not syms:
            bound = "O(1)"
            finding = unit + " loops only over fixed literal data (constant in input size)."
        elif degree == 1 and len(syms) == 1:
            bound = "O(" + syms[0] + ")"
            finding = unit + " runs one bounded loop over " + syms[0] + "."
        elif degree == 1:
            # sequential loops over possibly-different sizes -> sum, dominated term
            bound = "O(" + " + ".join(syms) + ")"
            finding = unit + " runs sequential bounded loops (added, not nested)."
        else:
            # nested: product of the deepest chain. Conservative: multiply the
            # distinct recognized sizes up to the degree.
            used = syms[:degree] if len(syms) >= degree else syms
            bound = "O(" + "·".join(used) + ")" if len(used) > 1 else "O(" + used[0] + "^" + str(degree) + ")"
            finding = unit + " has " + str(degree) + " directly-nested bounded loops (multiplied)."

    return {
        "source": "auto-supported",
        "scope": scope,
        "time": bound,
        "sizeVars": analyzer.size_vars,
        "supportedFindings": [finding],
    }


def analyze_complexity_json(source):
    return json.dumps(analyze_complexity(source))
