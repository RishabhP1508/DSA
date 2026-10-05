/**
 * R9/B1 amendment (finding 5, revised) — line labels, with STATIC source
 * classification kept strictly separate from RUNTIME reachability.
 *
 * Two independent questions:
 *   1. STATIC: what KIND of source line is this? — comment / blank / code.
 *      Determined ONLY from the source text. The authored `executable` flag is
 *      NOT a reachability signal and MUST NOT feed this classification: a
 *      `codeExplanation.executable === false` on a real statement means "this
 *      authored line emits no runtime event" (true of comments/blanks), it does
 *      NOT mean the statement was skipped in some trace.
 *   2. RUNTIME: was this line actually reached? — answerable only from the
 *      RECORDED EVENTS of a specific run (the set of lines that fired a `line`
 *      event). Never inferred from `executable`.
 *
 * The workspace renders the explanation for the line of its CURRENT recorded
 * event, so ordinary code shown there was reached by definition and must not be
 * labelled "not reached". A reachability label is only produced when the caller
 * supplies the real set of executed lines (see `reachabilityLabel`).
 */

/** Static source-kind of a line — depends ONLY on the source text. */
export type LineKind = "comment" | "blank" | "code";

/** Classify a source line (its text) as comment, blank, or code. */
export function classifyLine(sourceLine: string | undefined): LineKind {
  const text = (sourceLine ?? "").trim();
  if (text === "") return "blank";
  if (text.startsWith("#")) return "comment";
  return "code";
}

/** Static parenthetical for a line kind ("" for code — code gets no static tag). */
export function lineKindText(kind: LineKind): string {
  switch (kind) {
    case "comment": return "(comment)";
    case "blank": return "(blank)";
    default: return "";
  }
}

/**
 * Static label for a source line, from its text alone. Used by the UI next to
 * the current-line explanation: a comment/blank is tagged; real code is not
 * (and is never tagged "not reached" from the static flag).
 */
export function labelForLine(code: string, line: number): string {
  const sourceLine = code.split("\n")[line - 1];
  return lineKindText(classifyLine(sourceLine));
}

/**
 * RUNTIME reachability label, derived from ACTUAL recorded events.
 * @param kind          the line's static kind
 * @param line          1-indexed source line
 * @param executedLines the set of source lines that fired a `line` event in the run
 * Returns "(not reached in this run)" ONLY for a code line that is absent from
 * the recorded events; otherwise "" (comments/blanks and reached code get none).
 */
export function reachabilityLabel(
  kind: LineKind,
  line: number,
  executedLines: ReadonlySet<number>,
): string {
  if (kind !== "code") return "";
  return executedLines.has(line) ? "" : "(not reached in this run)";
}
