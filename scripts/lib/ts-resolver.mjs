/**
 * ESM resolver hook: resolves the app's Vite-style EXTENSIONLESS relative
 * imports (e.g. `./lessons/foo`) to their `.ts`/`.tsx` files so Node can import
 * the real TypeScript with `--experimental-strip-types`.
 *
 * Runs in Node's loader thread. Registered by ./ts-register.mjs.
 */
import { existsSync } from "node:fs";

const TS_EXTS = [".ts", ".tsx"];

export async function resolve(specifier, context, nextResolve) {
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExt = /\.[a-zA-Z0-9]+$/.test(specifier);
  if (isRelative && !hasExt && context.parentURL) {
    const parentDir = new URL(".", context.parentURL);
    for (const ext of TS_EXTS) {
      if (existsSync(new URL(specifier + ext, parentDir))) {
        return nextResolve(specifier + ext, context);
      }
    }
    for (const ext of TS_EXTS) {
      if (existsSync(new URL(specifier + "/index" + ext, parentDir))) {
        return nextResolve(specifier + "/index" + ext, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
