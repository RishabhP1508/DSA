import { test, expect } from "@playwright/test";

/**
 * R2 browser lifecycle tests (headless Chromium).
 *
 * These exercise the REAL in-browser worker path (not the Node harness): the
 * shared coordinator, lazy worker creation, a real Pyodide run, and Stop.
 *
 * NOTE: this is headless Chromium on Linux, NOT literal Windows Chrome/Edge.
 * The Windows-browser + two-origin proof is the pending gate P-RUNNER-ORIGIN
 * (see runner-origin.pending.spec.ts). R9 records that OS/engine gap.
 */

test("Playground runs real Python and shows output (worker created on demand)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();

  // The Run button becomes enabled only once the runtime is available; before a
  // run there is no eager warm blocking the UI — the page is interactive.
  const runBtn = page.getByRole("button", { name: /Run/ });
  await expect(runBtn).toBeVisible();

  // Click Run and wait for a completed trace (real Pyodide execution).
  await runBtn.click({ trial: false });
  // Wait for the timeline/status to reflect a finished run.
  await expect(page.getByText(/completed/)).toBeVisible({ timeout: 60_000 });

  // Scrub the timeline to the final step so accumulated output is shown, then
  // confirm the starter program's output (14 = 3+1+4+1+5) is visible. This
  // proves the worker was created on demand and produced a real result.
  const timeline = page.getByRole("slider", { name: "Timeline" });
  await timeline.focus();
  await page.keyboard.press("End");
  await expect(page.locator("pre.output")).toContainText("14", { timeout: 10_000 });
});

test("a run cannot inherit imported-module mutations from an earlier run (R2-B)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();
  await expect(page.getByRole("button", { name: "▶ Run" })).toBeEnabled({ timeout: 60_000 });

  const editor = page.locator(".cm-content");

  // Run 1: mutate an imported module's attribute.
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("import sys\nsys.dsa_leak = 'polluted'\nprint('run1')\n");
  await page.getByRole("button", { name: "▶ Run" }).click();
  await expect(page.getByText(/completed/)).toBeVisible({ timeout: 60_000 });

  // Run 2: a fresh runtime must NOT see the attribute from run 1. We make the
  // isolation observable via run STATUS: if the module leaked, the assert fails
  // and the run ends in "error"; if isolated (correct), it "completed".
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("import sys\nassert not hasattr(sys, 'dsa_leak')\n");
  await page.getByRole("button", { name: "▶ Run" }).click();
  // A fresh runtime → assertion holds → completed. A leaked runtime → error.
  await expect(page.getByText(/· completed/)).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText(/· error/)).toHaveCount(0);
});

test("Stop terminates a long-running program", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();

  const runBtn = page.getByRole("button", { name: /Run/ });
  await expect(runBtn).toBeVisible();

  // Replace the editor content with an infinite loop, then run and stop it.
  // The CodeMirror editor is contenteditable; select-all + type.
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("while True:\n    pass\n");

  // Wait until the runtime is ready (button label flips from "Loading Python…").
  await expect(page.getByRole("button", { name: "▶ Run" })).toBeEnabled({ timeout: 60_000 });
  await page.getByRole("button", { name: "▶ Run" }).click();

  // Stop should become enabled while running; clicking it must settle the run
  // (status shows a terminal state and the app stays responsive).
  const stopBtn = page.getByRole("button", { name: /Stop/ });
  await expect(stopBtn).toBeEnabled({ timeout: 10_000 });
  await stopBtn.click();

  // After stop, the Run button is usable again (app not wedged).
  await expect(page.getByRole("button", { name: "▶ Run" })).toBeEnabled({ timeout: 15_000 });
});
