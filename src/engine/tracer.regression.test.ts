// @vitest-environment node
/**
 * R1 regression corpus for the Python tracer (src/engine/tracer.py).
 *
 * These tests run real programs on the bundled Pyodide via the shared harness
 * and assert behavior the tracer MUST have. They are written BEFORE the fix and
 * are expected to fail on the audited baseline (see .kiro/specs/R1-tracing).
 *
 * Guarantee under test: inspection never executes learner code, snapshots are
 * self-contained (returns resolve), input()/EOF matches CPython, and aliases/
 * cycles/typed keys are preserved.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { runProgram } from "../../scripts/lib/pyodide-harness.mjs";

// Warm the runtime once (first load is slow).
beforeAll(async () => {
  await runProgram("x = 1\n");
}, 120_000);

// --- helpers ---------------------------------------------------------------
type TV = { kind: string; value?: unknown; id?: string; repr?: string };
type Obj = { id: string; type: string; entries?: { key: string; keyKind?: string; value: TV }[]; repr?: string };
type Ev = {
  index: number; kind: string; line: number;
  frames: { name: string; line: number; locals: { name: string; value: TV }[] }[];
  objects: Record<string, Obj | null>;
  returnValue?: TV; error?: { type: string; message: string };
};
type Res = { status: string; stdout: string; stderr: string; events: Ev[]; error?: { type: string; message: string; line?: number } };

function lastLocal(res: Res, name: string): { v: TV; ev: Ev } | null {
  for (let i = res.events.length - 1; i >= 0; i--) {
    const ev = res.events[i];
    for (let f = ev.frames.length - 1; f >= 0; f--) {
      const loc = ev.frames[f].locals.find((l) => l.name === name);
      if (loc) return { v: loc.value, ev };
    }
  }
  return null;
}
function objOf(ev: Ev, v: TV | undefined): Obj | null | undefined {
  return v && v.kind === "ref" ? ev.objects[v.id!] : undefined;
}
function intEntry(obj: Obj | null | undefined, key: string): unknown {
  return obj?.entries?.find((e) => e.key === key)?.value?.value;
}

describe("R1 tracer — inspection must not execute learner code", () => {
  it("R1-A: a side-effecting __repr__ is never invoked during inspection", async () => {
    const res = (await runProgram(
      [
        "calls = {'n': 0}",
        "class Bad:",
        "    def __repr__(self):",
        "        calls['n'] += 1",
        "        return 'Bad()'",
        "b = Bad()",
        "x = 1",
      ].join("\n"),
    )) as Res;
    const found = lastLocal(res, "calls");
    const n = intEntry(objOf(found!.ev, found!.v), "n");
    expect(n).toBe(0); // repr must not have run
  });

  it("R1-B: a __dict__ property with a side effect is not invoked", async () => {
    const res = (await runProgram(
      [
        "log = []",
        "class Weird:",
        "    @property",
        "    def __dict__(self):",
        "        log.append(1)",
        "        return {'fake': 1}",
        "w = Weird()",
        "y = 2",
      ].join("\n"),
    )) as Res;
    expect(res.status).toBe("completed");
    const found = lastLocal(res, "log");
    const logObj = objOf(found!.ev, found!.v);
    expect(logObj?.entries?.length ?? 0).toBe(0); // property not called
  });

  it("R1-C: a container subclass overriding items() is not invoked", async () => {
    const res = (await runProgram(
      [
        "hits = {'n': 0}",
        "class LoudDict(dict):",
        "    def items(self):",
        "        hits['n'] += 1",
        "        return super().items()",
        "d = LoudDict()",
        "d['a'] = 1",
        "z = 3",
      ].join("\n"),
    )) as Res;
    const found = lastLocal(res, "hits");
    expect(intEntry(objOf(found!.ev, found!.v), "n")).toBe(0);
  });
});

describe("R1 tracer — self-contained snapshots", () => {
  it("R1-D: a returned new list resolves within the return event", async () => {
    const res = (await runProgram(
      ["def make():", "    return [1, 2, 3]", "result = make()"].join("\n"),
    )) as Res;
    const returns = res.events.filter((e) => e.kind === "return");
    expect(returns.length).toBeGreaterThan(0);
    for (const ev of returns) {
      const rv = ev.returnValue;
      if (rv && rv.kind === "ref") {
        expect(ev.objects[rv.id!]).toBeTruthy(); // ref resolves in its own snapshot
      }
    }
  });

  it("preserves aliasing: two names share one list object", async () => {
    const res = (await runProgram(["a = [1, 2]", "b = a", "b.append(3)"].join("\n"))) as Res;
    const A = lastLocal(res, "a")!;
    const B = lastLocal(res, "b")!;
    expect(A.v.kind).toBe("ref");
    expect(B.v.kind).toBe("ref");
    expect(A.v.id).toBe(B.v.id); // same object id
  });

  it("handles a self-referential list without hanging (finite snapshot)", async () => {
    const res = (await runProgram(["a = [1]", "a.append(a)", "x = 2"].join("\n"))) as Res;
    expect(res.status).toBe("completed");
    const A = lastLocal(res, "a")!;
    expect(A.v.kind).toBe("ref");
    expect(A.ev.objects[A.v.id!]).toBeTruthy();
  });

  it("preserves typed dict keys including tuple keys", async () => {
    const res = (await runProgram(["d = {(1, 2): 'a', 3: 'b', 'k': 'c'}", "x = 1"].join("\n"))) as Res;
    const D = lastLocal(res, "d")!;
    const obj = objOf(D.ev, D.v);
    const kinds = (obj?.entries ?? []).map((e) => e.keyKind);
    expect(kinds).toContain("int");
    expect(kinds).toContain("str");
    // tuple key must be preserved (not silently coerced to a bare string kind of int/str)
    expect(obj?.entries?.some((e) => e.key.includes("1") && e.key.includes("2"))).toBe(true);
  });
});

describe("R1 tracer — input() and EOF match CPython", () => {
  it("R1-E: input() past supplied stdin raises EOFError (not empty string)", async () => {
    const res = (await runProgram("x = input()\nprint(x)", "")) as Res;
    expect(res.status).toBe("error");
    expect(res.error?.type).toBe("EOFError");
  });

  it("a supplied blank line returns an empty string (completed)", async () => {
    const res = (await runProgram("x = input()\nprint('got:' + repr(x))", "\n")) as Res;
    expect(res.status).toBe("completed");
    expect(res.stdout).toBe("got:''\n");
  });

  it("successive reads consume successive lines; prompt appears in output", async () => {
    const res = (await runProgram(
      ["a = input('name? ')", "b = input()", "print(a + '/' + b)"].join("\n"),
      "Ada\n42\n",
    )) as Res;
    expect(res.status).toBe("completed");
    expect(res.stdout).toBe("name? Ada/42\n");
  });

  it("preserves unicode input", async () => {
    const res = (await runProgram("x = input()\nprint(x)", "héllo—✓\n")) as Res;
    expect(res.status).toBe("completed");
    expect(res.stdout).toBe("héllo—✓\n");
  });
});

describe("R1 tracer — output and exceptions", () => {
  it("distinguishes an uncaught exception as an error status", async () => {
    const res = (await runProgram("x = 1\nraise ValueError('boom')").catch((e) => e)) as Res;
    expect(res.status).toBe("error");
    expect(res.error?.type).toBe("ValueError");
  });

  it("a caught exception still completes normally", async () => {
    const res = (await runProgram(
      ["try:", "    raise ValueError('x')", "except ValueError:", "    print('caught')"].join("\n"),
    )) as Res;
    expect(res.status).toBe("completed");
    expect(res.stdout).toBe("caught\n");
  });

  it("print without newline is preserved", async () => {
    const res = (await runProgram("print('a', end='')\nprint('b')")) as Res;
    expect(res.stdout).toBe("ab\n");
  });

  it("a final-statement mutation appears in the last snapshot", async () => {
    const res = (await runProgram(["xs = [1, 2]", "xs.append(3)"].join("\n"))) as Res;
    const X = lastLocal(res, "xs")!;
    const obj = objOf(X.ev, X.v);
    expect(obj?.entries?.length).toBe(3);
  });
});

describe("R1 tracer — differential: tracing does not change output", () => {
  // Run a supported program through the tracer and compare its stdout with the
  // same program run untraced in the same runtime.
  const programs = [
    "print(sum(range(5)))",
    "d = {'a': 1}\nd['b'] = 2\nprint(sorted(d.items()))",
    "print([x*x for x in range(4)])",
    "def f(n):\n    return 1 if n < 2 else f(n-1)+f(n-2)\nprint(f(6))",
  ];
  it.each(programs)("traced stdout matches untraced stdout: %s", async (src) => {
    const traced = (await runProgram(src)) as Res;
    // Untraced: exec directly in the harness runtime.
    const { getPyodide } = await import("../../scripts/lib/pyodide-harness.mjs");
    const py = await getPyodide();
    py.globals.set("__plain_src", src);
    const plain = py.runPython(
      "import io,contextlib\n_b=io.StringIO()\n_g={}\n" +
        "with contextlib.redirect_stdout(_b):\n    exec(__plain_src, _g)\n_b.getvalue()",
    ) as string;
    expect(traced.status).toBe("completed");
    expect(traced.stdout).toBe(plain);
  });
});
