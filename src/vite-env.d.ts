/// <reference types="vite/client" />

// Raw text imports for bundled Python sources (e.g. the tracer).
declare module "*.py?raw" {
  const src: string;
  export default src;
}

// The Pyodide loader is served from /public/pyodide and imported dynamically.
declare module "/pyodide/pyodide.mjs" {
  export function loadPyodide(config?: { indexURL?: string }): Promise<unknown>;
}
