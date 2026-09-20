/**
 * Registers the extensionless-TS resolver hook. Use as an --import preload:
 *
 *   node --experimental-strip-types --import ./scripts/lib/ts-register.mjs <script.mjs>
 *
 * Cross-platform (Windows/macOS/Linux): no shell, no pyenv/nvm assumptions.
 */
import { register } from "node:module";
register("./ts-resolver.mjs", import.meta.url);
