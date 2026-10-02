/**
 * R8.3 — Python file import/export helpers.
 *
 * Import DECODES the file as UTF-8, tolerating a BOM and normalising Windows
 * (CRLF) line endings to `\n`; a file that is not valid UTF-8 (or not text) is
 * reported, not silently mangled. Export builds a downloadable `.py` blob.
 *
 * The decode logic is pure so it is unit-testable (decodePythonBytes).
 */

export type DecodeResult =
  | { ok: true; source: string }
  | { ok: false; error: string };

/**
 * Decode raw bytes as a Python source string: strip a UTF-8 BOM, reject invalid
 * UTF-8, and normalise CRLF/CR to LF. Uses a fatal TextDecoder so malformed
 * bytes are reported rather than replaced with U+FFFD.
 */
export function decodePythonBytes(bytes: Uint8Array): DecodeResult {
  // Strip a leading UTF-8 BOM (EF BB BF) if present.
  let view = bytes;
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    view = bytes.subarray(3);
  }
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(view);
  } catch {
    return { ok: false, error: "File is not valid UTF-8 text — only UTF-8 Python files are supported." };
  }
  if (text.includes("\u0000")) {
    return { ok: false, error: "File looks binary (contains NUL bytes), not Python source." };
  }
  // Normalise CRLF and lone CR to LF.
  const source = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return { ok: true, source };
}

/** Read a File (from <input type=file>) and decode it as Python source. */
export async function readPythonFile(file: File): Promise<DecodeResult> {
  const buf = await file.arrayBuffer();
  return decodePythonBytes(new Uint8Array(buf));
}

/** Trigger a browser download of `source` as a `.py` file. */
export function exportPythonFile(source: string, filename = "playground.py"): void {
  const blob = new Blob([source], { type: "text/x-python;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".py") ? filename : `${filename}.py`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
