/**
 * R6 — mistake-variant synthesis for the exercise mistake-rejection harness.
 *
 * The plan (R6.4) requires proving that an exercise's tests reject not just a
 * blank attempt but real, independent mistakes:
 *   - the UNFINISHED starter,
 *   - a PLAUSIBLE-WRONG solution,
 *   - an EARLY-EXIT variant,
 *   - a PRINT-THE-ANSWER variant.
 *
 * Hand-authoring 4 faulty programs for each of 161 exercises is both impractical
 * and likely to "mirror" the model solution (which the plan forbids). Instead we
 * derive variants MECHANICALLY from the exercise's own `starterCode`, `expected`
 * and `tests`, in ways that are genuinely wrong and NOT copies of the model:
 *
 *   - unfinished:   the literal starter (always available; independent by
 *                   construction — it is the un-solved code the learner starts
 *                   from).
 *   - print-answer: a program that, for a function contract, defines the
 *                   function to `print(...)` a plausible constant / its input
 *                   and return None (never satisfies a return-value contract);
 *                   for a script contract, a program that only prints a guessed
 *                   answer without computing the required state.
 *   - early-exit:   the model solution truncated to `pass` / an immediate
 *                   `return None` / `return 0`, so required work never runs.
 *   - plausible-wrong: a small, targeted corruption of the model solution
 *                   (e.g. off-by-one, wrong operator, dropped update) chosen so
 *                   it compiles but violates the contract.
 *
 * A variant is only asserted when it can be synthesised soundly; the harness
 * ALWAYS asserts the unfinished-starter rejection (universal), and asserts each
 * other variant when `synth*` returns a non-null program. Variants that a given
 * exercise cannot express are reported as "n/a", never as a silent pass.
 */

/** Extract the first top-level `def name(params):` from source, if any. */
export function firstFunction(src) {
  const m = src.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:/m);
  if (!m) return null;
  return { name: m[1], params: m[2].trim() };
}

/** Does the tests snippet assert on the RETURN VALUE of a function call? */
export function functionContract(src) {
  const fn = firstFunction(src);
  return fn && !/^class\s/m.test(src) ? fn : null;
}

/**
 * PRINT-THE-ANSWER variant. For a function contract, replace the body with a
 * `print` of a guessed value and an implicit `return None`. This satisfies any
 * "the program ran and printed something" check but fails a return-value or
 * structural assertion — proving the tests are not print-based.
 */
export function synthPrintAnswer(exercise) {
  const fn = functionContract(exercise.expected ?? "");
  if (fn) {
    // A body that prints yet returns None (or a wrong constant) — never matches
    // a real return contract.
    return `def ${fn.name}(${fn.params}):\n    print("answer")\n    return None\n`;
  }
  return null; // script-style: covered by early-exit / plausible-wrong instead
}

/**
 * EARLY-EXIT variant. For a function contract, return immediately before doing
 * the work. Uses a neutral wrong value so the assertion (not a crash) fails.
 */
export function synthEarlyExit(exercise) {
  const fn = functionContract(exercise.expected ?? "");
  if (fn) {
    return `def ${fn.name}(${fn.params}):\n    return None\n`;
  }
  return null;
}

/**
 * EMPTY-PROGRAM variant. A universal, always-available wrong attempt: submit
 * nothing. For a function contract this leaves the function undefined (NameError
 * on call); for a script it leaves the required variables unset (NameError) or
 * produces no output. Any correct test rejects it. This guarantees every
 * runnable exercise — including bare-script ones with no synthesised
 * function/plausible variant — has at least one machine-checked mistake beyond
 * the starter.
 */
export function synthEmpty() {
  return "# (nothing submitted)\n";
}

/**
 * PLAUSIBLE-WRONG variant. Applies ONE targeted corruption to the model
 * solution that keeps it syntactically valid but breaks the contract. Tries a
 * sequence of corruptions and returns the first that actually changes the
 * source (so it is not identical to the model).
 */
export function synthPlausibleWrong(exercise) {
  const model = exercise.expected ?? "";
  const corruptions = [
    // off-by-one on comparisons
    [/<=/g, "<"],
    [/>=/g, ">"],
    // flip a strict comparison
    [/(\w)\s<\s(\w)/, "$1 > $2"],
    // increment -> no-op accumulation (drop the += update once)
    [/(\w+)\s*\+=\s*1/, "$1 += 0"],
    // swap + and - in an arithmetic update
    [/(\w+)\s*=\s*(\w+)\s*\+\s*(\w+)/, "$1 = $2 - $3"],
    // return the wrong boundary
    [/return\s+(\w+)\s*\+\s*1/, "return $1"],
    // wrong modulo target (even<->odd)
    [/%\s*2\s*==\s*0/, "% 2 == 1"],
  ];
  for (const [re, repl] of corruptions) {
    const mutated = model.replace(re, repl);
    if (mutated !== model) return mutated;
  }
  return null;
}
