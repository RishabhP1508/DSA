import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Vitest config for TypeScript logic + React component tests (R0.4).
// - jsdom environment so React Testing Library can render components.
// - Excludes e2e/ (Playwright owns those) and node_modules.
// - Node-only logic tests can opt into the node environment per file via a
//   `// @vitest-environment node` comment.
export default defineConfig({
  plugins: [react()],
  // Use the automatic JSX runtime so component tests don't need `import React`.
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", "e2e/**"],
    css: false,
  },
});
