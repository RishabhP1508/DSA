/**
 * R9/B1 amendment (finding 5) — honest line-label classification.
 *
 * The `executable` boolean on a codeExplanation means "this line produces a
 * runtime event" (false for comments, blanks, AND for real statements that were
 * not reached in the current trace). The UI previously rendered EVERY
 * `executable: false` line as literally "(comment)", which mislabels genuine
 * code statements that simply were not reached (e.g. the skipped `elif`/`else`
 * branch in the conditions lesson).
 *
 * This helper separates STATIC source classification (is the line text a comment
 * or blank?) from the trace-dependent executable flag, so the label is honest:
 *   - a comment line (text starts with `#`)         → "(comment)"
 *   - a blank line                                   → "(blank)"
 *   - a real statement with executable === false     → "(not reached in this run)"
 *   - a real statement with executable === true      → no label
 *
 * It does NOT claim an `executable: true` line is guaranteed to run in every
 * possible trace; it only labels what the authored flag + source text say.
 */
export type LineLabelKind = "comment" | "blank" | "not-reached" | "none";

/** Classify the one source line (1-indexed) behind a codeExplanation. */
export function classifyLine(sourceLine: string | undefined, executable: boolean): LineLabelKind {
  const text = (sourceLine ?? "").trim();
  if (text === "") return "blank";
  if (text.startsWith("#")) return "comment";
  // A real code statement: label only when it produced no event in this trace.
  return executable ? "none" : "not-reached";
}

/** Human-facing parenthetical for a line label kind ("" when none). */
export function lineLabelText(kind: LineLabelKind): string {
  switch (kind) {
    case "comment": return "(comment)";
    case "blank": return "(blank)";
    case "not-reached": return "(not reached in this run)";
    default: return "";
  }
}

/** Convenience: get the label text for an explanation against the lesson source. */
export function labelForLine(code: string, line: number, executable: boolean): string {
  const sourceLine = code.split("\n")[line - 1];
  return lineLabelText(classifyLine(sourceLine, executable));
}
