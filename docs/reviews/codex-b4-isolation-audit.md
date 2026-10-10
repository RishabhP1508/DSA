# Delegated execution/isolation audit

Frozen 2026-10-10 22:39:05 UTC. Reviewer: delegated Codex technical reviewer
`review_sequences_heaps`. This is agent review, not human signoff. The reviewer
changed only new regression files and this report. The coordinating agent made
all production fixes. No curriculum/evidence/ledger approval flags were changed.

Reviewed: `desktop/server.mjs`, `start.mjs`, `stop.mjs`;
`src/engine/runner-transport.ts`, `runner-bridge.ts`, `runner-config.ts`,
`run.worker.ts`, `tracer.py`, `protocol-schema.ts`, and the coordinator/protocol
they use. Live origins: `http://127.0.0.1:4173` and `:4174`.
Runtime probes used bundled Pyodide 314.0.7 / CPython 3.14.2. Final focused unit
run used Node 24.11.1 and Vitest 5.0.3 on Windows. Browser probes used an isolated
installed Chrome context; no saved user browser profile was touched.

## Reproductions and resolved recommendations

| Finding | Exact reproduction and risk | Recommendation integrated by coordinator |
| --- | --- | --- |
| Schema-map prototype keys | Otherwise valid envelopes with `kind` equal to `constructor`, `toString`, or `__proto__` throw `schema.safeParse is not a function`, in both directions. A malicious data-only sender can disrupt validation; this does not bypass origin/source checks. | Require own schema-map properties before lookup. Own-property testing excludes inherited prototype names. [ECMAScript Object.hasOwn](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.hasown) |
| Large integer tuple key | `x = 10**5000; d = {(x,): 1}; print('done')` completes untraced, but inspection previously raised decimal-conversion `ValueError` before printing. | Use the existing exact integer formatter in tuple-key rendering; keep Python's decimal safety limit unchanged and permit hexadecimal fallback. Python documents decimal conversion limits and unrestricted power-of-two conversion. [Python integer string conversion](https://docs.python.org/3.14/builtins/stdtypes.html#integer-string-conversion-length-limitation) |
| Deep tuple key | Build `k = (k,)` 1100 times, then `{k: 1}` and print. Untraced execution completes; the original tuple-key inspector raised `RecursionError`. | Bound tuple-key recursion and entry enumeration, with explicit omitted-data text. |
| Instance dictionary subclass | Give an ordinary instance `c.__dict__ = D(a=1)`, where `D(dict).items()` raises. The successful baseline never calls that method; the original inspector does. | Use base `dict.items` and `dict.__len__`, with the same entry bound as other containers. |
| Custom instance dictionary key | Store `c.__dict__[K()] = 1`, where `K.__str__` raises. Baseline completes, but original inspection calls `str(k)`. | Reuse safe typed key encoding rather than learner string conversion. |
| Dynamic class property | Ordinary `C` has a `__class__` property that raises; instantiate and print. Baseline completes, but original inspector `isinstance` checks invoke it. | Classify by actual type and the built-in type MRO, comparing identities. CPython's `object_isinstance` can dynamically obtain `inst.__class__`. [CPython 3.14.2 Objects/abstract.c, object_isinstance](https://github.com/python/cpython/blob/v3.14.2/Objects/abstract.c#L2434) |
| Metaclass equality in exception arguments | A class `V` has metaclass `M` whose `__eq__` raises. `try: raise ValueError(V())` followed by a caught `ValueError` and `print('done')` succeeds untraced, but exception inspection originally used `type(value) in (bool, float)`, invoking that equality hook and failing with `RuntimeError`. | Compare actual types with `is`, preserving the successful caught-exception behavior. The regression compares against the same-runtime untraced baseline. |
| Large SystemExit integer | `raise SystemExit(10**5000)` returns a raw integer exit code; JSON encoding raises before the worker can emit its result. Smaller unsafe integers also risk JS precision loss. | Send unsafe integer exit codes as exact decimal/hex strings. The regression reconstructs the value with JS BigInt and checks equality. `SystemExit.code` retains its supplied value. [Python SystemExit](https://docs.python.org/3.14/builtins/exceptions.html#SystemExit) |
| Diagnostic budgets | With requested budget 64, valid malicious-worker `error` or `result.error` messages retain 3000 UTF-8 bytes. After the first fix, stdout 30 plus error 36 still retained 66 bytes. | Bound diagnostic/metadata payloads and count retained output plus infrastructure diagnostic together. These are malicious-worker hardening tests, not ordinary learner Python or origin escapes. |
| Server shutdown | A raw local TCP client leaves HTTP headers unfinished. First `close()` remains pending; second originally resolves immediately. | Memoize the close promise and close active connections, after flushing the authenticated Stop response. Node distinguishes idle closure from active connection closure. [Node closeAllConnections / closeIdleConnections](https://nodejs.org/api/http.html#servercloseallconnections) |
| Worker teardown operation | The original transport removed its iframe without guaranteed explicit worker termination. A busy supported builtin `sum(range(10**10))` left the worker target observable after removal. | Retain bridge until an exact-origin/source, random-token acknowledgment follows its explicit `Worker.terminate()` invocation. Reject ordinary messages once adapter is closed; then remove frame/listener. Frame discard alone leaves termination discretionary under the standard. [HTML worker lifetime and terminate algorithm](https://html.spec.whatwg.org/multipage/workers.html#the-workers-lifetime) |

The successful-program regressions compare the same source with untraced execution
on the same runtime. They demonstrate inspector-induced behavior changes. They
do not treat a hook deliberately called by learner code as an inspector defect.
No filesystem/network/concurrency API is required by these Python cases.

## Teardown evidence and corrected timing oracle

The initial manual frame-removal observation was 633 ms, and the first browser
regression required target destruction within 2 s. Those observations did **not**
prove indefinite execution. The same 2 s oracle was too tight after the explicit
termination fix. A follow-up UI probe received `dsa-bridge-terminated` promptly,
showed zero iframes by 121 ms, and confirmed the app remained responsive while
the worker target was still visible. Worker termination runs in parallel under
the standard; target destruction is not a synchronous UI operation.
[HTML terminate a worker](https://html.spec.whatwg.org/multipage/workers.html#terminate-a-worker)

Final Chrome regressions separately require UI readiness/bridge acknowledgment
within 2 s and worker target destruction within 5 s. Measured destruction after the
cancellation action: Stop 2023 ms, supersede 2007 ms, dispose 2006 ms. All three passed.
Stop additionally runs fresh Python through the UI and verifies replacement
output without late output. Supersede verifies the old promise resolves once as
stopped, its reason is `supersede`, and the replacement result completes.

Stop uses the actual production UI. Supersede/dispose use an in-memory bundle of
the actual repository coordinator and transport, with only its build-time worker
URL substituted by the actual production worker asset URL. No lifecycle logic
is replaced. This gives direct access to coordinator operations the UI does not
expose while using the real bridge/Pyodide worker.

An exploratory direct-worker probe failed its setup wait and was cleaned up in
`finally`; it provides no timing evidence. All private browser contexts were
closed. No live desktop-server Stop endpoint was called by this reviewer.

## Other boundaries checked

- Live headers/configuration identify separate app/runner origins. App CSP has no
  unsafe eval; runner/worker responses allow the runtime's required eval/WASM
  and restrict connections and worker scripts to self.
- The actual production worker rejects remote `https://example.com/` and app
  `/api/session` fetches with observed `connect-src` violation events. Runner
  `/health` succeeds 200. This confirms policy enforcement, rather than merely
  checking a header string. [CSP connect-src and worker-src](https://www.w3.org/TR/CSP3/#directive-connect-src)
- The actual bridge rejects wrong source and wrong origin probes without creating
  a worker; a valid parent request then completes with stdout `probe\n`. The
  code also correlates run ID, owner, source/input revisions, and sequence. Exact
  target origins are used. [HTML messaging security](https://html.spec.whatwg.org/multipage/web-messaging.html#security-postmsg)
- Both live origins reject a foreign Host header 403. Missing Origin on app
  `/api/session` returns 403; runner has no session route. Encoded traversal,
  backslash and NUL paths are blocked, while URL-normalized `../` paths resolve
  only to nonexistent build assets 404. Realpath containment prevents serving
  outside the build directory. Runner root/app config routes are 404.
- Static Start/Stop review found identity/build/role checks before controlling
  the local app, a random Stop session token, loopback-only binds, hidden
  background Node startup and browser launch. Actual launcher UX and package
  relocation were outside this audit; the live servers were left running.
- Schema primitives, finite floats, exact large-integer strings, event ordering,
  cumulative trace/output limits, event-limit partial results, detached old-run
  handlers and per-run fresh worker initialization were read against their
  consumers. No additional reproduced defect remains in the focused cases.

## Repeatable focused checks

From the worktree, with `C:\Program Files\nodejs` prepended to PATH:

```text
node node_modules/vitest/vitest.mjs run src/engine/codex-isolation-audit.test.ts src/engine/codex-error-budget.test.ts src/engine/codex-desktop-shutdown.test.ts
PLAYWRIGHT_CHANNEL=chrome node node_modules/@playwright/test/cli.js test e2e/codex-runner-teardown.spec.ts --workers=1 --reporter=line
```

Final result: 18/18 focused unit/runtime/server assertions and 3/3 real Chrome
teardown cases. Unit run emits the existing missing optional Pyodide source-map
warning and legacy esbuild/oxc configuration warning; assertions pass. No full
aggregate gate or broad browser suite was run by this reviewer.

All linked sources were consulted on 2026-10-10. Python documentation served the
current 3.14 maintenance documentation; the dynamic-class source is pinned to
runtime 3.14.2. Node documentation describes current APIs introduced in 18.2;
shutdown was executed on installed 24.11.1. Browser observations establish these
cases on installed Chrome; they are not an Edge, every-browser, malicious-code
proof, total-memory limit, or operating-system-process security certification.
The 5 s fallback for an unresponsive bridge is cleanup recovery, not proof of
termination when the bridge cannot acknowledge. Ordinary Python in its worker
does not block the bridge's main-thread message handler.
