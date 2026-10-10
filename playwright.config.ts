import { defineConfig, devices } from "@playwright/test";

// Real production app and isolated runner. PLAYWRIGHT_CHANNEL=chrome/msedge
// uses the installed Windows browser; otherwise install Playwright Chromium.
// Missing browsers or inaccessible loopback ports are failures, never skips.
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
    {
      name: process.env.PLAYWRIGHT_CHANNEL ?? "chromium",
      use: { ...devices["Desktop Chrome"], channel: process.env.PLAYWRIGHT_CHANNEL },
    },
  ],
  webServer: {
    // Serve both origins with their production CSP and validated bridge.
    command: "npm run build && node desktop/server.mjs --app-port 4173 --runner-port 4174",
    url: "http://127.0.0.1:4173/health",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
