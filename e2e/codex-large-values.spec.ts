import { expect, test } from '@playwright/test';

test('personal aliased grid has a bounded, visibly partial production diagram', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Playground', exact: true }).click();
  const editor = page.locator('.cm-content').first();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  // Only 200 captured entries, but 10,000 logical cells. We deliberately do not
  // attempt the possible million-cell expansion of a 1000x1000 aliased grid.
  await page.keyboard.insertText('row = [0] * 100\ngrid = [row] * 100\nprint("done")');
  await page.getByRole('button', { name: '▶ Run', exact: true }).click();
  await expect(page.getByText(/· completed/)).toBeVisible({ timeout: 60_000 });
  await page.getByRole('slider', { name: 'Timeline' }).focus();
  await page.keyboard.press('End');
  await page.getByLabel('Variable to visualize').selectOption('grid');
  await page.evaluate(() => {
    const audit = globalThis as typeof globalThis & { codexLongTasks: number[]; codexObserver: PerformanceObserver };
    audit.codexLongTasks = [];
    audit.codexObserver = new PerformanceObserver(list => {
      audit.codexLongTasks.push(...list.getEntries().map(e => e.duration));
    });
    audit.codexObserver.observe({ type: 'longtask' });
  });
  for (const model of ['matrix', 'dp-table']) {
    await page.getByLabel('Diagram family').selectOption(model);
    const slot = page.locator('.viz-slot');
    await expect(slot.locator('svg')).toBeVisible();
    const cells = await slot.locator('rect.cell').count();
    const nodes = await slot.locator('*').count();
    console.info(`production ${model}: ${cells} cells, ${nodes} DOM nodes`);
    expect.soft(cells).toBeLessThanOrEqual(1024);
    await expect.soft(slot).toContainText(/showing|omitt|truncat|display limit|not inspected/i);
    await expect(page.getByRole('button', { name: '▶ Run', exact: true })).toBeEnabled();
  }
  const longTasks = await page.evaluate(() => {
    const audit = globalThis as typeof globalThis & { codexLongTasks: number[]; codexObserver: PerformanceObserver };
    audit.codexObserver.disconnect();
    return audit.codexLongTasks;
  });
  console.info(`production grid transition long tasks (diagnostic only): ${JSON.stringify(longTasks)}`);
  // Durations vary with hardware. Bounded DOM and a visible omission notice are
  // stable regression oracles; these measurements are not a timing assertion.
});
