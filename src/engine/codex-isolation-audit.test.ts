// @vitest-environment node
import { beforeAll, describe, expect, it } from "vitest";
import { getPyodide, runProgram } from "../../scripts/lib/pyodide-harness.mjs";
import { validateInbound, validateOutbound } from "./protocol";

beforeAll(async () => { await getPyodide(); }, 120_000);

async function plainStdout(source: string): Promise<string> {
  const py = await getPyodide();
  py.globals.set("__codex_audit_source", source);
  return py.runPython(
    "import contextlib, io\n" +
    "_codex_audit_out = io.StringIO()\n" +
    "with contextlib.redirect_stdout(_codex_audit_out):\n" +
    "    exec(__codex_audit_source, {})\n" +
    "_codex_audit_out.getvalue()",
  ) as string;
}

describe("Codex independent isolation audit: valid programs preserve behavior", () => {
  const cases = [
    {
      name: "large integer in a tuple dictionary key",
      source: "x = 10**5000\nd = {(x,): 1}\nprint('done')",
    },
    {
      name: "deep tuple dictionary key",
      source: "k = ()\nfor _ in range(1100):\n    k = (k,)\nd = {k: 1}\nprint('done')",
    },
    {
      name: "dict subclass used as the ordinary instance dictionary",
      source: [
        "class D(dict):",
        "    def items(self):",
        "        raise RuntimeError('inspector invoked learner items')",
        "class C: pass",
        "c = C()",
        "c.__dict__ = D(a=1)",
        "print('done')",
      ].join("\n"),
    },
    {
      name: "non-string instance dictionary key with a learner string hook",
      source: [
        "class K:",
        "    def __str__(self):",
        "        raise RuntimeError('inspector invoked learner str')",
        "class C: pass",
        "c = C()",
        "c.__dict__[K()] = 1",
        "print('done')",
      ].join("\n"),
    },
    {
      name: "class property is not executed by inspector type classification",
      source: [
        "class C:",
        "    @property",
        "    def __class__(self):",
        "        raise RuntimeError('inspector invoked learner class property')",
        "c = C()",
        "print('done')",
      ].join("\n"),
    },
    {
      name: "exception argument classification does not invoke metaclass equality",
      source: [
        "class M(type):",
        "    def __eq__(self, other):",
        "        raise RuntimeError('inspector invoked metaclass equality')",
        "class V(metaclass=M): pass",
        "try:",
        "    raise ValueError(V())",
        "except ValueError:",
        "    print('done')",
      ].join("\n"),
    },
  ];

  it.each(cases)("$name", async ({ source }) => {
    // The oracle runs exactly the same program on the same CPython runtime
    // without tracing. No learner code intentionally calls these hooks.
    const baseline = await plainStdout(source);
    expect(baseline).toBe("done\n");
    const traced = await runProgram(source);
    expect(traced.status).toBe("completed");
    expect(traced.stdout).toBe(baseline);
  });

  it("serializes an arbitrarily large integer SystemExit code exactly", async () => {
    const traced = await runProgram("raise SystemExit(10**5000)");
    expect(traced.status).toBe("exited");
    // A numeric JS representation would silently lose this value even when
    // decimal JSON serialization succeeds. Strings can be decimal or hex.
    expect(typeof traced.exitCode).toBe("string");
    expect(BigInt(traced.exitCode)).toBe(10n ** 5000n);
  });
});

describe("Codex independent isolation audit: malformed worker data", () => {
  const meta = { v: 1, runId: 1, owner: "audit", sourceRev: 1, inputRev: 0, seq: 0 };
  for (const [direction, validate] of [
    ["inbound", validateInbound], ["outbound", validateOutbound],
  ] as const) {
    it.each(["constructor", "toString", "__proto__"])(
      `${direction} rejects inherited schema-map key %s without throwing`,
      (kind) => {
        const result = validate({ ...meta, kind, payload: {} });
        expect(result.ok).toBe(false);
      },
    );
  }
});
