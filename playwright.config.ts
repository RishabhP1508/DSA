import { defineConfig, devices } from "@playwright/test";

// Playwright config for real-browser integration (R0.4 scaffolding; suites grow
// in R9). It builds and serves the production app, then drives it in Chromium
// (closest available engine to the Windows Chrome/Edge release targets).
//
// NOTE: running this requires Playwright browser binaries
// (`npx playwright install chromium`). In CI/sandbox environments where that
// download is blocked, `npm run test:browser` will report the missing browser
// rather than silently passing — see R9 for the manual procedure.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Serve the built app on the app origin. The runner-origin work (R2.5) will
    // extend this to a second loopback origin.
    command: "npm run build && npm run preview -- --port 4173 --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
