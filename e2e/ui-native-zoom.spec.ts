import { chromium, test, expect } from '@playwright/test';
import { mkdir, mkdtemp, readFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';

// This is actual browser page zoom, selected through browser Settings. It is
// deliberately independent of the viewport/DPR reflow proxy in ui-hierarchy.
// The temporary persistent profile never opens or changes a personal profile.
test('native 200% page zoom keeps every main page and learning tab reachable', async ({ baseURL }, info) => {
  test.setTimeout(180_000);
  await mkdir(info.outputDir, { recursive: true });
  // Chrome cannot persist all profile files under very long Windows paths.
  // A short disposable profile also keeps personal browser profiles untouched.
  const profile = await mkdtemp(path.join(tmpdir(), 'dsa-native-zoom-'));
  const channel = info.project.use.channel;
  // A full Chromium executable includes chrome://settings. The default
  // headless-shell executable does not provide that native settings UI.
  const browserOptions = channel ? { channel } : { executablePath: chromium.executablePath() };
  const context = await chromium.launchPersistentContext(profile, {
    ...browserOptions,
    headless: true,
    viewport: null,
    // Clear the test project's Desktop Chrome emulation default. Native page
    // zoom requires an un-emulated viewport and the browser's actual DPR.
    deviceScaleFactor: undefined,
    args: ['--window-size=1440,1000'],
    reducedMotion: 'reduce',
  });
  const page = context.pages()[0];
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const report: {
    method: string; browser: string; channel: string; before?: Awaited<ReturnType<typeof dimensions>>;
    after?: Awaited<ReturnType<typeof dimensions>>; screens: Array<{ name: string } & Awaited<ReturnType<typeof dimensions>>>;
    pageErrors: string[]; nativePreference?: unknown;
  } = {
    method: 'Browser Settings > Appearance > Page zoom 200%; viewport:null; unchanged native window; no emulation',
    browser: context.browser()!.version(), channel: channel ?? 'full Chromium', screens: [], pageErrors,
  };

  async function dimensions() {
    return page.evaluate(() => ({
      innerWidth, innerHeight, outerWidth, outerHeight, devicePixelRatio,
      visualScale: visualViewport!.scale,
      documentWidth: document.documentElement.scrollWidth,
    }));
  }

  async function screenshot(name: string) {
    const screenshotPath = info.outputPath(name + '.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    await info.attach(name, { path: screenshotPath, contentType: 'image/png' });
  }

  async function navigate(label: string) {
    const toggle = page.getByRole('button', { name: 'Toggle navigation', exact: true });
    if (await toggle.isVisible()) await toggle.click();
    const link = page.locator('.app-rail').getByRole('button', { name: label, exact: true });
    // Scrolling must work for a short zoomed viewport. Never force-click a
    // clipped item: that would hide an inaccessible navigation regression.
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport();
    await link.click();
  }

  async function checkScreen(name: string) {
    await page.evaluate(() => document.fonts.ready);
    const size = await dimensions();
    report.screens.push({ name, ...size });
    expect(size.documentWidth, name).toBeLessThanOrEqual(size.innerWidth + 1);
    await expect(page.locator('main h1:visible'), name).toHaveCount(1);
    for (const tab of await page.getByRole('tab').all()) {
      const box = await tab.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x, name + ' tab left').toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width, name + ' tab right').toBeLessThanOrEqual(size.innerWidth + 1);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(name);
  }

  try {
    await page.goto(baseURL!);
    report.before = await dimensions();
    if (channel === 'msedge') {
      await page.goto('edge://settings/appearance');
      await page.getByRole('button', { name: 'Page zoom', exact: true }).click();
      await page.getByLabel('Page zoom 100%', { exact: true }).click();
      await page.getByText('200%', { exact: true }).click();
      await expect(page.getByLabel('Page zoom 200%', { exact: true })).toBeVisible();
    } else {
      await page.goto('chrome://settings/appearance');
      await page.locator('#zoomLevel').selectOption('2');
      await expect(page.locator('#zoomLevel')).toHaveValue('2');
    }
    await screenshot('browser-settings-native-200-percent');
    await page.goto(baseURL!);
    report.after = await dimensions();
    expect(report.after.outerWidth).toBe(report.before.outerWidth);
    expect(report.after.outerHeight).toBe(report.before.outerHeight);
    expect(report.after.innerWidth).toBeGreaterThanOrEqual(report.before.innerWidth / 2 - 1);
    expect(report.after.innerWidth).toBeLessThanOrEqual(report.before.innerWidth / 2 + 1);
    expect(report.after.devicePixelRatio / report.before.devicePixelRatio).toBe(2);
    // Pinch zoom changes visualViewport.scale; native page zoom leaves it at1.
    expect(report.after.visualScale).toBe(1);

    for (const label of ['Home', 'Learn', 'Patterns', 'Practice', 'Playground', 'Glossary', 'Backup']) {
      await navigate(label); await checkScreen('native-zoom-' + label.toLowerCase());
    }
    await navigate('Learn');
    await page.getByRole('textbox', { name: 'Search lessons' }).fill('Variables and Types');
    await page.locator('.lesson-row').filter({ has: page.getByText('Variables and Types', { exact: true }) }).click();
    for (const name of ['Understand', 'Watch the code', 'Try & practice', 'Review']) {
      await page.getByRole('tab', { name, exact: true }).click();
      await checkScreen('native-zoom-lesson-' + name.split(' ')[0].toLowerCase());
    }
    await navigate('Patterns');
    await page.getByRole('textbox', { name: 'Search patterns' }).fill('Two Pointers');
    await page.locator('.pattern-card').filter({ has: page.getByRole('heading', { name: 'Two Pointers', exact: true }) }).click();
    for (const name of ['Recognize', 'Watch the code', 'Try & practice', 'Related & sources']) {
      await page.getByRole('tab', { name, exact: true }).click();
      await checkScreen('native-zoom-pattern-' + name.split(' ')[0].toLowerCase());
    }
    await page.getByRole('button', { name: 'Search lessons and patterns', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search library' }).fill('heap');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(element => { const box = element.getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth && box.width > 0; })).toBe(true);
    await screenshot('native-zoom-search');
    await page.keyboard.press('Escape');
    expect(report.screens).toHaveLength(15);
    expect(pageErrors).toEqual([]);
  } finally {
    if (!page.isClosed()) await screenshot('native-zoom-final-state');
    await context.close();
    const preferences = JSON.parse(await readFile(path.join(profile, 'Default', 'Preferences'), 'utf8'));
    report.nativePreference = preferences.partition;
    await info.attach('native-zoom-measured-proof', { body: JSON.stringify(report, null, 2), contentType: 'application/json' });
  }
});
