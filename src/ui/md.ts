/**
 * Minimal inline markdown for authored, in-repo (trusted) content.
 *
 * Escapes HTML, then renders **bold** and `code`. Content is authored in the
 * repository, not user-supplied, so this limited transform is safe to inject.
 */
export function mdInline(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
