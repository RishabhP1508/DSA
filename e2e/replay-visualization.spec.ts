import { test, expect } from "@playwright/test";

/**
 * R4 browser tests (headless Chromium): the real replay/inspection/visualize-as
 * path. The trace-shape correctness of every diagram family is covered by
 * scripts/verify_visualizers.mjs; here we prove the UI wiring works end-to-end.
 */

async function runStarter(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();
  await expect(page.getByRole("button", { name: "▶ Run" })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("button", { name: "▶ Run" }).click();
  await expect(page.getByText(/completed/)).toBeVisible({ timeout: 60_000 });
}

test("Visualize as… renders a chosen variable as a diagram", async ({ page }) => {
  await runStarter(page);
  // Step to the end so the top-level `nums`/`result` variables are in scope.
  const timeline = page.getByRole("slider", { name: "Timeline" });
  await timeline.focus();
  await page.keyboard.press("End");
  // Visualize `nums` as an array.
  const varSelect = page.getByLabel("Variable to visualize");
  await expect(varSelect).toBeVisible();
  await expect(varSelect.locator('option[value="nums"]')).toHaveCount(1);
  await varSelect.selectOption("nums");
  await page.getByLabel("Diagram family").selectOption("array");
  // A visualizer SVG appears in the viz slot.
  await expect(page.locator(".viz-slot svg").first()).toBeVisible({ timeout: 10_000 });
});

test("editing the source shows a stale banner until re-run", async ({ page }) => {
  await runStarter(page);
  // Edit the code; the trace becomes stale.
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.type("\n# edit\n");
  await expect(page.getByText(/outdated/i)).toBeVisible({ timeout: 10_000 });
  // Re-running clears the stale banner.
  await page.getByRole("button", { name: "▶ Run" }).click();
  await expect(page.getByText(/completed/)).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText(/outdated/i)).toHaveCount(0);
});

test("Play advances the timeline and the object inspector expands", async ({ page }) => {
  await runStarter(page);
  const timelineLabel = page.getByText(/step \d+ \/ \d+/);
  const stepOf = async () => {
    const t = (await timelineLabel.textContent()) ?? "";
    const m = t.match(/step (\d+) \/ (\d+)/);
    return m ? { pos: Number(m[1]), total: Number(m[2]) } : null;
  };

  // Restart to step 1, capture the starting position and total.
  await page.getByRole("button", { name: "⏮ Restart" }).click();
  const start = await stepOf();
  expect(start).not.toBeNull();
  expect(start!.pos).toBe(1);
  expect(start!.total).toBeGreaterThan(1); // the starter produces multiple steps

  // Play; the timeline must ADVANCE beyond the starting step.
  await page.getByRole("button", { name: "▶ Play" }).click();
  await expect
    .poll(async () => (await stepOf())?.pos ?? 0, { timeout: 20_000 })
    .toBeGreaterThan(start!.pos);
  // And it reaches the final step (playback runs to the end).
  await expect
    .poll(async () => {
      const s = await stepOf();
      return s ? s.pos === s.total : false;
    }, { timeout: 20_000 })
    .toBe(true);

  // The inspector shows expandable rows (a toggle caret) once state exists.
  await expect(page.locator(".oi-toggle, .oi-row").first()).toBeVisible();
});
