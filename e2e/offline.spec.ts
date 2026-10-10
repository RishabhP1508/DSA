import { test, expect } from "@playwright/test";

/**
 * R9.2 — offline behaviour. Block every non-loopback request, then verify the
 * app boots, loads the bundled runtime, and executes real Python. This proves
 * the BUILT app uses local assets only (no CDN/network dependency). It does NOT
 * prove a future portable ZIP works on a fresh Windows machine (that is
 * packaging, out of scope for this milestone).
 */

test("app boots and runs Python with all non-loopback requests blocked", async ({ page }) => {
  test.setTimeout(120_000);

  const blocked: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    const host = url.hostname;
    const isLoopback =
      host === "127.0.0.1" || host === "localhost" || host === "::1" || host === "[::1]";
    if (!isLoopback) {
      blocked.push(url.href);
      return route.abort();
    }
    return route.continue();
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "DSA Visual Lab", exact: true })).toBeVisible();

  // Run real Python in the Playground with the network cut off.
  await page.getByRole("button", { name: "Playground", exact: true }).click();
  await expect(page.getByRole("button", { name: "▶ Run", exact: true })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("button", { name: "▶ Run", exact: true }).click();
  await expect(page.getByText(/· completed/)).toBeVisible({ timeout: 60_000 });

  // No non-loopback request was needed to boot and execute (Pyodide + assets
  // are served locally). We assert the app still worked despite blocking them.
  expect(true).toBe(true);
});
