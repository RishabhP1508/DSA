/**
 * Minimal inline markdown for authored, in-repo (trusted) content.
 *
 * Escapes HTML, then renders **bold**, *emphasis* and `code`. Content is authored in the
 * repository, not user-supplied, so this limited transform is safe to inject.
 */
export function mdInline(s: string): string {
  const escaped = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Protect code before formatting prose: multiplication and other literal
  // asterisks inside Python snippets must stay literal.
  const code: string[] = [];
  const prose = escaped.replace(/`([^`\n]+)`/g, (_match, value: string) => {
    const index = code.push(`<code>${value}</code>`) - 1;
    return `\u0000${index}\u0000`;
  });
  return prose
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<![\w*])\*([^*\n]+)\*(?![\w*])/g, '<em>$1</em>')
    .replace(/\u0000(\d+)\u0000/g, (_match, index: string) => code[Number(index)] ?? '');
}
