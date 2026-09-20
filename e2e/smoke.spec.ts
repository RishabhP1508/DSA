import { test, expect } from "@playwright/test";

// Seed browser integration test (R0.4). R9 expands this into the full
// acceptance suite (lesson execution, exercise grading, playground, offline).
// This one proves the app boots and the top-level navigation renders.
test("app boots and shows the primary navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "DSA Visual Lab" })).toBeVisible();
  // Top-nav views must be present and switchable.
  for (const label of ["Learn", "Patterns", "Practice", "Playground", "Backup"]) {
    await expect(page.getByRole("button", { name: label })).toBeVisible();
  }
});

test("switching to Patterns shows the pattern library", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Patterns" }).click();
  // The Patterns sidebar heading should appear.
  await expect(page.getByRole("heading", { name: "Patterns" })).toBeVisible();
});
