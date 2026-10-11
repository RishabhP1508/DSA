import { test, expect, type Page, type Locator } from '@playwright/test';

// Regression checks for the reading hierarchy. These inspect actual rendered
// typography/layout, not class presence, and keep the full curriculum visible.
async function navigate(page: Page, label: string) {
  const toggle = page.getByRole('button', { name: 'Toggle navigation', exact: true });
  if (await toggle.isVisible()) await toggle.click();
  await page.locator('.app-rail').getByRole('button', { name: label, exact: true }).click();
}

async function openLesson(page: Page, title: string) {
  await navigate(page, 'Learn');
  await page.getByRole('textbox', { name: 'Search lessons' }).fill(title);
  await page.locator('.lesson-row').filter({ has: page.getByText(title, { exact: true }) }).click();
  await expect(page.locator('main h1')).toHaveText(title);
}

async function openPattern(page: Page, title = 'Two Pointers') {
  await navigate(page, 'Patterns');
  const back = page.getByRole('button', { name: 'All patterns', exact: true });
  if (await back.isVisible()) await back.click();
  await page.getByRole('textbox', { name: 'Search patterns' }).fill(title);
  await page.locator('.pattern-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) }).click();
  await expect(page.locator('main h1')).toHaveText(title);
}

async function noPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function fontSize(locator: Locator) {
  return locator.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
}

async function paint(locator: Locator) {
  return locator.evaluate(element => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, border: style.borderColor, shadow: style.boxShadow };
  });
}

async function screenshot(page: Page, name: string) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const path = `output/playwright/ui-hierarchy-${test.info().project.name}/${name}.png`;
  await page.screenshot({ path, fullPage: true });
  await test.info().attach(name, { path, contentType: 'image/png' });
}

async function inspectExercise(panel: Locator) {
  return panel.evaluate(element => {
    const visible = (node: Element) => Boolean(node.getBoundingClientRect().width && node.getBoundingClientRect().height);
    const style = getComputedStyle(element);
    const heading = element.querySelector('h3');
    return {
      padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(parseFloat),
      headingSize: heading ? parseFloat(getComputedStyle(heading).fontSize) : 0,
      choices: [...element.querySelectorAll('.recognition-choice')].filter(visible).map(node => {
        const css = getComputedStyle(node);
        return { display: css.display, height: node.getBoundingClientRect().height, gap: parseFloat(css.columnGap), fontSize: parseFloat(css.fontSize) };
      }),
      actions: [...element.querySelectorAll('.exercise-actions')].filter(visible).map(node => {
        const css = getComputedStyle(node);
        return { display: css.display, gap: parseFloat(css.columnGap), buttons: [...node.querySelectorAll('button')].map(button => ({ height: button.getBoundingClientRect().height, fontSize: parseFloat(getComputedStyle(button).fontSize) })) };
      }),
    };
  });
}

test('all seven main pages have one readable page title and a consistent hierarchy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const label of ['Home', 'Learn', 'Patterns', 'Practice', 'Playground', 'Glossary', 'Backup']) {
    await navigate(page, label);
    const title = page.locator('main h1:visible');
    await expect(title, `${label} page title`).toHaveCount(1);
    expect(await fontSize(title), `${label} title size`).toBeGreaterThanOrEqual(30);
    await noPageOverflow(page);
  }
  await page.getByRole('button', { name: 'Search lessons and patterns', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Find your next idea' });
  await expect(dialog).toBeVisible();
  await page.getByRole('textbox', { name: 'Search library' }).fill('heap');
  await expect(dialog.getByRole('button', { name: /heap/i }).first()).toBeVisible();
  await page.keyboard.press('Escape');
});

test('pattern reading sections have distinct headings, bounded prose and a working outline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/'); await openPattern(page);
  const sections = page.locator('.reading-prose > section');
  await expect(sections).toHaveCount(7);
  for (const heading of await sections.locator('h2').all()) expect(await fontSize(heading)).toBeGreaterThanOrEqual(22);
  const dimensions = await page.locator('.reading-prose').first().evaluate(element => {
    const style = getComputedStyle(element);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    return { width: element.getBoundingClientRect().width, character: context.measureText('0').width };
  });
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.character * 75 + 1);
  const paragraph = sections.locator('p').first();
  expect(await fontSize(paragraph)).toBeGreaterThanOrEqual(16);
  await expect(page.locator('.reader-outline .outline-desktop')).toBeVisible();
  const condition = page.locator('.condition-callout');
  await expect(condition.getByRole('heading', { name: 'Check these conditions' })).toBeVisible();
  const outlineLink = page.locator('.reader-outline .outline-desktop a').filter({ hasText: 'conditions' });
  await expect(outlineLink).toHaveCount(1);
  const destination = await outlineLink.getAttribute('href');
  expect(destination).toMatch(/^#/);
  await outlineLink.click();
  const target = page.locator(destination!);
  await expect(target).toBeInViewport();
  await noPageOverflow(page); await screenshot(page, 'desktop-pattern-recognize');
});

test('exercise cards stack choices and visibly distinguish selected, accepted and rejected answers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/'); await openPattern(page);
  await page.getByRole('tab', { name: 'Try & practice', exact: true }).click();
  const panel = page.locator('.exercise-panel').first();
  const metrics = await inspectExercise(panel);
  expect(Math.min(...metrics.padding)).toBeGreaterThanOrEqual(16);
  expect(metrics.headingSize).toBeGreaterThanOrEqual(18);
  for (const choice of metrics.choices) {
    expect(['flex', 'grid', 'inline-flex']).toContain(choice.display);
    expect(choice.height).toBeGreaterThanOrEqual(44);
    expect(choice.gap).toBeGreaterThanOrEqual(8);
    expect(choice.fontSize).toBeGreaterThanOrEqual(16);
  }
  for (const actions of metrics.actions) {
    expect(['flex', 'grid']).toContain(actions.display);
    expect(actions.gap).toBeGreaterThanOrEqual(8);
    for (const button of actions.buttons) expect(button.height).toBeGreaterThanOrEqual(44);
  }
  const approach = panel.getByRole('radio', { name: 'Two pointers from both ends', exact: true });
  const choice = approach.locator('..'); const unselected = await paint(choice);
  await approach.check(); await expect(approach).toBeChecked();
  expect(await paint(choice), 'a selected answer must differ beyond the tiny radio dot').not.toEqual(unselected);
  await panel.getByRole('radio', { name: /We must examine every pair/ }).check();
  await panel.getByRole('button', { name: 'Check my reasoning', exact: true }).click();
  await expect(panel.locator('.recognition-verdict.rejected')).toBeVisible();
  await expect(panel.locator('.recognition-verdict.rejected')).toContainText('Not quite');
  await panel.getByRole('radio', { name: /The array is already sorted/ }).check();
  await panel.getByRole('button', { name: 'Check my reasoning', exact: true }).click();
  await expect(panel.locator('.recognition-verdict.accepted')).toContainText('Correct');
  await panel.getByRole('radio', { name: 'Hash map of complements', exact: true }).check();
  await panel.getByRole('radio', { name: /A hash map storing each value/ }).check();
  await panel.getByRole('button', { name: 'Check my reasoning', exact: true }).click();
  await expect(panel.locator('.recognition-verdict.accepted')).toContainText('Valid alternative');
  await panel.getByRole('button', { name: 'Show model explanation', exact: true }).click();
  await expect(panel.locator('.model-answer')).toContainText('Two pointers');
  const secondRecognition = page.locator('.exercise-panel').filter({ has: page.locator('.recognition-block') }).nth(1);
  await secondRecognition.getByRole('radio').first().check();
  await expect(panel.getByRole('radio', { name: 'Hash map of complements', exact: true })).toBeChecked();
  await expect(secondRecognition.getByRole('radio').first()).toBeChecked();
  await screenshot(page, 'desktop-pattern-practice-feedback');
});

test('coding exercise hints, failure feedback, model and passing result stay separated', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/'); await openPattern(page);
  await page.getByRole('tab', { name: 'Try & practice', exact: true }).click();
  const panel = page.locator('.exercise-panel').filter({ has: page.locator('.runnable-block') }).first();
  await expect(panel.locator('h3')).toContainText('Find and fix the bug');
  await panel.getByRole('button', { name: 'Show a hint', exact: true }).click();
  await expect(panel.locator('.hints li')).toHaveCount(1);
  await panel.getByRole('button', { name: 'Next hint', exact: true }).click();
  await expect(panel.locator('.hints li')).toHaveCount(2);
  const run = panel.getByRole('button', { name: '▶ Run tests', exact: true });
  await expect(run).toBeEnabled(); await run.click();
  await expect(panel.locator('.test-result.fail')).toContainText('A test failed', { timeout: 60_000 });
  await panel.getByRole('button', { name: 'Reveal model answer', exact: true }).click();
  const model = panel.locator('.model-answer pre'); await expect(model).toBeVisible();
  const correctSource = await model.innerText();
  const editor = panel.locator('.cm-content[contenteditable=true]');
  await editor.click(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(correctSource);
  await run.click(); await expect(panel.locator('.test-result.pass')).toContainText('All tests passed', { timeout: 60_000 });
  expect(await fontSize(panel.locator('h3'))).toBeGreaterThanOrEqual(18);
  expect(await panel.locator('.test-result').evaluate(element => parseFloat(getComputedStyle(element).paddingTop))).toBeGreaterThanOrEqual(12);
  await noPageOverflow(page); await screenshot(page, 'coding-exercise-hints-result');
});

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px keeps all main pages and representative lesson/pattern tabs readable`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 1000 }); await page.goto('/');
    for (const label of ['Home', 'Learn', 'Patterns', 'Practice', 'Playground', 'Glossary', 'Backup']) {
      await navigate(page, label); await noPageOverflow(page);
      const title = page.locator('main h1:visible'); await expect(title).toHaveCount(1);
      expect(await fontSize(title)).toBeGreaterThanOrEqual(width <= 390 ? 28 : 30);
    }
    await openLesson(page, 'Variables and Types');
    for (const name of ['Understand', 'Watch the code', 'Try & practice', 'Review']) {
      await page.getByRole('tab', { name, exact: true }).click(); await noPageOverflow(page);
      for (const tab of await page.getByRole('tab').all()) {
        const box = await tab.boundingBox(); expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(-1); expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
    }
    await openPattern(page);
    for (const name of ['Recognize', 'Watch the code', 'Try & practice', 'Related & sources']) {
      await page.getByRole('tab', { name, exact: true }).click(); await noPageOverflow(page);
      if (name === 'Watch the code' && width <= 390) {
        const title = await page.locator('.workspace-intro h2').boundingBox();
        const description = await page.locator('.workspace-intro p').boundingBox();
        expect(title).not.toBeNull(); expect(description).not.toBeNull();
        expect(description!.y).toBeGreaterThanOrEqual(title!.y + title!.height - 1);
      }
    }
    await page.getByRole('tab', { name: 'Recognize', exact: true }).click();
    await expect(page.locator('.reading-prose').getByRole('heading', { name: 'Time & space', exact: true })).toBeVisible();
    const outline = page.locator('.reader-outline'); await expect(outline).toBeVisible();
    await expect(outline.locator(width < 1100 ? '.outline-mobile' : '.outline-desktop')).toBeVisible();
    await screenshot(page, `${width}px-pattern-recognize`);
  });
}

test('dark theme preserves hierarchy, visible selections and exercise boundaries', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto('/');
  await page.getByRole('button', { name: 'Use dark theme', exact: true }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await openPattern(page);
  for (const heading of await page.locator('.study-section > h2').all()) expect(await fontSize(heading)).toBeGreaterThanOrEqual(22);
  await screenshot(page, 'dark-pattern-recognize');
  await page.getByRole('tab', { name: 'Try & practice', exact: true }).click();
  const panel = page.locator('.exercise-panel').first();
  const radio = panel.getByRole('radio').first(); const label = radio.locator('..');
  const unselected = await paint(label); await radio.check(); expect(await paint(label)).not.toEqual(unselected);
  const boundary = await panel.evaluate(element => { const s = getComputedStyle(element); const p = getComputedStyle(element.parentElement!); return { border: parseFloat(s.borderTopWidth), background: s.backgroundColor, parent: p.backgroundColor }; });
  expect(boundary.border > 0 || boundary.background !== boundary.parent).toBe(true);
  await noPageOverflow(page); await screenshot(page, 'dark-pattern-practice');
});

test('Python syntax remains readable in both themes without losing edited code', async ({ page }) => {
  await page.goto('/'); await navigate(page, 'Playground');
  const source = '# Explain this step\ndef demo():\n    value = 123\n    word = "hello"\n    return value + len(word)\n';
  const editor = page.locator('.cm-content').first();
  await editor.fill(source);
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Use dark theme', exact: true }).click();
    await expect(editor).toContainText('Explain this step');
    const ratios = await editor.evaluate(element => {
      const luminance = (color: string) => {
        const values = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(n => { const c = n / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
        return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
      };
      return [...element.querySelectorAll('[class*="cm-syntax-"]')].map(token => {
        let parent: Element | null = token;
        let background = 'rgb(255, 255, 255)';
        while (parent) {
          const color = getComputedStyle(parent).backgroundColor;
          if (color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') { background = color; break; }
          parent = parent.parentElement;
        }
        const foreground = getComputedStyle(token).color;
        const a = luminance(foreground), b = luminance(background);
        return { text: token.textContent, className: token.className, foreground, background, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
      });
    });
    expect(ratios.length).toBeGreaterThan(6);
    for (const token of ratios) expect(token.ratio, `${theme}: ${JSON.stringify(token)}`).toBeGreaterThanOrEqual(4.5);
  }
  await expect(editor).toContainText('word = "hello"');
  await screenshot(page, 'dark-playground-readable-python');
});

test.describe('200% zoom-equivalent reflow, not native browser zoom', () => {
  // 720 CSS pixels at DPR2 model the reflow of a 1440px display at 200%.
  // Native Chrome/Edge toolbar zoom must be verified separately on Windows.
  test.use({ viewport: { width: 720, height: 500 }, deviceScaleFactor: 2 });
  test('the full lesson/pattern sequence remains reachable in half the CSS viewport', async ({ page }) => {
    await page.goto('/'); await openLesson(page, 'Variables and Types');
    for (const name of ['Understand', 'Watch the code', 'Try & practice', 'Review']) {
      await page.getByRole('tab', { name, exact: true }).click(); await noPageOverflow(page);
    }
    await openPattern(page);
    for (const name of ['Recognize', 'Watch the code', 'Try & practice', 'Related & sources']) {
      await page.getByRole('tab', { name, exact: true }).click(); await noPageOverflow(page);
    }
    await screenshot(page, '200-percent-equivalent-reflow');
  });
});

for (const width of [1440, 390]) test(`every lesson and pattern tab passes the rendered hierarchy inventory at ${width}px`, async ({ page }) => {
  test.setTimeout(360_000);
  await page.setViewportSize({ width, height: 1000 }); await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await navigate(page, 'Learn');
  const lessonTitles = await page.locator('.lesson-row strong').allTextContents();
  await navigate(page, 'Patterns');
  const patternTitles = await page.locator('.pattern-card h2').allTextContents();
  expect(lessonTitles).toHaveLength(133); expect(patternTitles).toHaveLength(29);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const results: Array<{ owner: string; tab: string; problems: string[] }> = [];
  const inspect = async (owner: string, tab: string) => {
    const problems = await page.evaluate(() => {
      const issues: string[] = [];
      const visible = (element: Element) => Boolean(element.getBoundingClientRect().width && element.getBoundingClientRect().height);
      const titles = [...document.querySelectorAll('main h1')].filter(visible);
      if (titles.length !== 1) issues.push(`visible h1 count ${titles.length}`);
      for (const title of titles) if (parseFloat(getComputedStyle(title).fontSize) < (innerWidth < 580 ? 28 : 30)) issues.push('small h1');
      if (document.documentElement.scrollWidth > innerWidth + 1) issues.push(`page overflow ${document.documentElement.scrollWidth}/${innerWidth}`);
      for (const element of [...document.querySelectorAll('.study-section > h2,.workspace-intro h2,.practice-intro h2,.review-column > h2')].filter(visible)) {
        if (parseFloat(getComputedStyle(element).fontSize) < 22) issues.push(`small section ${element.textContent?.slice(0, 50)}`);
      }
      for (const panel of [...document.querySelectorAll('.exercise-panel')].filter(visible)) {
        const style = getComputedStyle(panel);
        if (Math.min(...[style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(parseFloat)) < 16) issues.push('exercise padding below 16');
        const heading = panel.querySelector('h3');
        if (!heading || parseFloat(getComputedStyle(heading).fontSize) < 18) issues.push('exercise heading missing or small');
        for (const choice of [...panel.querySelectorAll('.recognition-choice')].filter(visible)) {
          const css = getComputedStyle(choice);
          if (!['flex', 'grid', 'inline-flex'].includes(css.display) || choice.getBoundingClientRect().height < 44) issues.push('inline or short recognition choice');
        }
        for (const group of [...panel.querySelectorAll('.exercise-actions')].filter(visible)) {
          const css = getComputedStyle(group);
          if (!['flex', 'grid'].includes(css.display) || parseFloat(css.columnGap) < 8) issues.push('joined exercise actions');
        }
      }
      return [...new Set(issues)];
    });
    results.push({ owner, tab, problems });
  };
  for (const title of lessonTitles) {
    await openLesson(page, title);
    for (const tab of ['Understand', 'Watch the code', 'Try & practice', 'Review']) {
      await page.getByRole('tab', { name: tab, exact: true }).click(); await inspect(`lesson:${title}`, tab);
    }
  }
  for (const title of patternTitles) {
    await openPattern(page, title);
    for (const tab of ['Recognize', 'Watch the code', 'Try & practice', 'Related & sources']) {
      await page.getByRole('tab', { name: tab, exact: true }).click(); await inspect(`pattern:${title}`, tab);
    }
  }
  const report = { width, lessons: lessonTitles.length, patterns: patternTitles.length, tabsChecked: results.length, problems: results.filter(result => result.problems.length), pageErrors: errors, results };
  await test.info().attach('complete-rendered-hierarchy-inventory', { body: JSON.stringify(report, null, 2), contentType: 'application/json' });
  expect(results).toHaveLength((133 + 29) * 4);
  expect(report.problems, JSON.stringify(report.problems.slice(0, 15))).toEqual([]);
  expect(errors).toEqual([]);
});
