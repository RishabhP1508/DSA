import { test, expect } from "@playwright/test";

/**
 * R7.5 — personal-code complexity panel in the Playground (headless Chromium).
 * Proves the conservative analyzer surfaces an auto-supported bound for a
 * supported form and an explicit "not determined" state for recursion, and that
 * observed stats appear after a real run.
 */

// Set the editor content via a paste event, which inserts the text verbatim
// (bypassing CodeMirror's per-keystroke auto-indent that mangles typed Python).
async function setProgram(page: import("@playwright/test").Page, code: string) {
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.evaluate(async (text) => {
    const el = document.activeElement as HTMLElement;
    const dt = new DataTransfer();
    dt.setData("text/plain", text);
    el.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }),
    );
  }, code);
}

test("supported form shows an auto-supported bound + observed stats", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();
  await expect(page.getByRole("button", { name: "▶ Run" })).toBeEnabled({ timeout: 60_000 });

  await setProgram(
    page,
    "def total(a):\n    t = 0\n    for x in a:\n        t = t + x\n    return t\n\nprint(total([1, 2, 3]))\n",
  );
  await page.getByRole("button", { name: "▶ Run" }).click();
  await expect(page.getByText(/completed/)).toBeVisible({ timeout: 60_000 });

  // The personal complexity panel shows a supported bound (O(n...)) and the
  // honest observed-stats table.
  const panel = page.locator(".personal-cx");
  await expect(panel).toContainText(/Automatic analysis/);
  await expect(panel).toContainText(/Observed on this run/);
  await expect(panel.locator(".cx-big")).toContainText(/O\(/);
});

test("recursion shows 'not determined automatically' with a reason", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();
  await expect(page.getByRole("button", { name: "▶ Run" })).toBeEnabled({ timeout: 60_000 });

  await setProgram(
    page,
    "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(6))\n",
  );
  await page.getByRole("button", { name: "▶ Run" }).click();
  await expect(page.getByText(/completed/)).toBeVisible({ timeout: 60_000 });

  await expect(page.locator(".cx-not-determined")).toContainText(
    /not determined automatically/i,
  );
  await expect(page.locator(".cx-not-determined")).toContainText(/recursive/);
});
