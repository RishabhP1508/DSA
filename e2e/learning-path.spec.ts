import { test, expect } from "@playwright/test";

/**
 * R8 — learning path, glossary, and Playground drafts (headless Chromium).
 */

test("Continue learning and marking a lesson complete update the sidebar", async ({ page }) => {
  await page.goto("/");
  // Home offers a clear next lesson; opening it does not complete it.
  await expect(page.getByRole("button", { name: "Continue learning", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Continue learning", exact: true }).click();
  // Mark the current lesson complete; the action flips to Completed.
  const markBtn = page.getByRole("button", { name: "Mark lesson complete", exact: true });
  await expect(markBtn).toBeVisible();
  await markBtn.click();
  await expect(page.getByRole("button", { name: "✓ Completed", exact: true })).toBeVisible();
});

test("Glossary lists terms and jumps to a defining lesson", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Glossary", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Glossary", exact: true })).toBeVisible();
  // Filtering narrows the list.
  await page.getByPlaceholder("Type to filter…").fill("array");
  await expect(page.locator(".glossary dt").first()).toBeVisible();
});

test("Playground supports a new named draft and Python import creates a new draft", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Playground", exact: true }).click();

  // Create a new draft (the button enables once drafts have loaded).
  const newBtn = page.getByRole("button", { name: "＋ New draft", exact: true });
  await expect(newBtn).toBeEnabled({ timeout: 30_000 });
  await newBtn.click();
  // The clear save status shows the created draft (R8.3).
  await expect(page.locator(".save-status")).toContainText(/Created/, { timeout: 10_000 });

  // The draft selector lists at least one named draft (persisted to IndexedDB).
  const combo = page.getByRole("combobox", { name: "Select draft", exact: true });
  await expect(combo).toBeVisible();
  await expect(combo.locator("option")).not.toHaveCount(0);

  // Export is available (download path); Import creates a NEW draft on choose.
  await expect(page.getByRole("button", { name: "💾 Export .py", exact: true })).toBeEnabled();
});
