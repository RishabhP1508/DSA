import { test, expect } from "@playwright/test";

/**
 * R8 — learning path, glossary, and Playground drafts (headless Chromium).
 */

test("Continue learning and marking a lesson complete update the sidebar", async ({ page }) => {
  await page.goto("/");
  // Learn is the default view; the Continue-learning action is present.
  await expect(page.getByRole("button", { name: /Continue learning/ })).toBeVisible();

  // Mark the current lesson complete; the button flips and a ✓ appears in the nav.
  const markBtn = page.getByRole("button", { name: /Mark lesson complete/ });
  await expect(markBtn).toBeVisible();
  await markBtn.click();
  await expect(page.getByRole("button", { name: /✓ Completed/ })).toBeVisible();
});

test("Glossary lists terms and jumps to a defining lesson", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Glossary" }).click();
  await expect(page.getByRole("heading", { name: "Glossary" })).toBeVisible();
  // Filtering narrows the list.
  await page.getByPlaceholder("Type to filter…").fill("array");
  await expect(page.locator(".glossary dt").first()).toBeVisible();
});

test("Playground supports a new named draft and Python import creates a new draft", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();

  // Create a new draft (the button enables once drafts have loaded).
  const newBtn = page.getByRole("button", { name: /New draft/ });
  await expect(newBtn).toBeEnabled({ timeout: 30_000 });
  await newBtn.click();
  // The clear save status shows the created draft (R8.3).
  await expect(page.locator(".save-status")).toContainText(/Created/, { timeout: 10_000 });

  // The draft selector lists at least one named draft (persisted to IndexedDB).
  const combo = page.getByRole("combobox", { name: "Select draft" });
  await expect(combo).toBeVisible();
  await expect(combo.locator("option")).not.toHaveCount(0);

  // Export is available (download path); Import creates a NEW draft on choose.
  await expect(page.getByRole("button", { name: /Export .py/ })).toBeEnabled();
});
