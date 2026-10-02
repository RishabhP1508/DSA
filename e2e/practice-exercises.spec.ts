import { test, expect } from "@playwright/test";

/**
 * R6 browser tests — economical Practice + interactive exercises (headless
 * Chromium). Proves:
 *  - opening Practice creates NO Python worker (R6.6.2): the shared engine is
 *    lazy and each ExercisePanel mounts without warming Pyodide;
 *  - the view renders a BOUNDED page (<=20 exercises) with working pagination
 *    (R6.6.1);
 *  - a recognition drill grades an authored approach+reason pair (R6.4);
 *  - a runnable coding exercise executes its tests on the real engine (R6.1/2).
 */

// Count Worker constructions from page load. Installed before any app script
// runs so an eager worker would be caught.
async function installWorkerCounter(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    (window as unknown as { __workerCount: number }).__workerCount = 0;
    const Native = window.Worker;
    class CountingWorker extends Native {
      constructor(url: string | URL, opts?: WorkerOptions) {
        (window as unknown as { __workerCount: number }).__workerCount++;
        super(url, opts);
      }
    }
    window.Worker = CountingWorker as unknown as typeof Worker;
  });
}

const workerCount = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as unknown as { __workerCount: number }).__workerCount);

test("opening Practice creates no Python worker and paginates (<=20 per page)", async ({ page }) => {
  await installWorkerCounter(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Practice" }).click();

  // The recognition set is large; the pager must appear and bound the page.
  await expect(page.getByRole("navigation", { name: "Practice pages" })).toBeVisible();
  const panels = page.locator(".exercise-panel");
  const count = await panels.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(20);

  // No Python worker was created just by opening Practice.
  expect(await workerCount(page)).toBe(0);

  // Paging forward shows a different page and still no worker.
  await page.getByRole("button", { name: /Next/ }).click();
  await expect(page.getByText(/page 2 of/)).toBeVisible();
  expect(await workerCount(page)).toBe(0);
});

test("a recognition drill grades an authored approach + reason", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Practice" }).click();
  // Recognition filter is the default. Find the first drill that rendered the
  // structured picker (authored recognition data).
  const check = page.getByRole("button", { name: "Check my reasoning" }).first();
  await expect(check).toBeVisible();
  // It is disabled until an approach and a reason are chosen.
  await expect(check).toBeDisabled();
  // Choose the first approach and first reason, then check — a verdict appears.
  await page.getByRole("radio").first().check();
  // Pick the first "reason" radio (second group). Radios are grouped by name.
  const reasonRadios = page.locator('input[name="reason"]');
  await reasonRadios.first().check();
  await expect(check).toBeEnabled();
  await check.click();
  await expect(page.locator(".recognition-verdict")).toBeVisible();
});

test("a runnable coding exercise runs its tests on the real engine", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Practice" }).click();
  // Switch to the Complete-code filter, which contains runnable exercises.
  await page.getByRole("button", { name: "Complete code" }).click();
  const runBtn = page.getByRole("button", { name: /Run tests/ }).first();
  await expect(runBtn).toBeVisible();
  await runBtn.click();
  // A real Pyodide run reports pass or fail (not stuck). Accept either the
  // pass banner or a fail banner — both prove the engine executed the tests.
  await expect(
    page.locator(".test-result").first(),
  ).toBeVisible({ timeout: 60_000 });
});
