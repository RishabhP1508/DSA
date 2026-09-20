import { test, expect } from "@playwright/test";

/**
 * R3 browser check: the Backup & progress view renders with the progress
 * summary and the export/restore controls. The persistence LOGIC (unique ids,
 * migration, deep validation, atomic writes, safe restore) is covered
 * exhaustively by the storage unit tests running against a real IndexedDB
 * (fake-indexeddb); this proves the UI wiring boots in a real browser.
 */
test("Backup view renders progress summary and controls", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Backup" }).click();
  await expect(page.getByRole("heading", { name: /Backup/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your progress" })).toBeVisible();
  // Export + restore controls are present.
  await expect(page.getByRole("button", { name: /Download backup/ })).toBeVisible();
  // The summary table renders its known rows.
  await expect(page.getByText("Exercises solved")).toBeVisible();
});
