import { chromium, expect, test, type Locator, type Page } from '@playwright/test';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// These are production-browser tests: real Python runs, saved trace events and
// rendered geometry. They complement the per-family unit/trace tests rather
// than treating a successful Python sample as proof of a usable diagram.
const FAMILY_SOURCE = `from collections import deque
class Node:
    def __init__(self, val, next=None, left=None, right=None):
        self.val = val
        self.next = next
        self.left = left
        self.right = right
class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False
nums = [10, 20, 30]
word = "cat"
grid = [[1, 2], [3, 4]]
stack = [10, 20, 30]
queue = deque([10, 20, 30])
head = Node(10, Node(20, Node(30)))
mapping = {1: "integer key", "1": "string key", (1, 2): "tuple key"}
seen = {10, 20, 30}
root = Node(20, left=Node(10), right=Node(30))
heap = [10, 20, 30]
trie = Trie()
trie.children["a"] = Trie()
trie.children["a"].is_end = True
graph = {0: [1, 2], 1: [2], 2: []}
bits = 2**80 + 1
thing = Node(10)
print("all diagram fixtures ready")`;

const FAMILIES = [
  ['array', 'nums'], ['string', 'word'], ['matrix', 'grid'],
  ['stack', 'stack'], ['queue', 'queue'], ['deque', 'queue'],
  ['linked-list', 'head'], ['dict', 'mapping'], ['set', 'seen'],
  ['tree', 'root'], ['heap', 'heap'], ['trie', 'trie'],
  ['graph', 'graph'], ['dp-table', 'grid'], ['bits', 'bits'],
  ['recursion', 'nums'], ['object', 'thing'],
] as const;

async function navigate(page: Page, name: string) {
  const toggle = page.getByRole('button', { name: 'Toggle navigation', exact: true });
  if (await toggle.isVisible()) await toggle.click();
  const target = page.locator('.app-rail').getByRole('button', { name, exact: true });
  await target.scrollIntoViewIfNeeded(); await target.click();
}

async function variablesLesson(page: Page) {
  await navigate(page, 'Learn');
  await page.getByRole('textbox', { name: 'Search lessons' }).fill('Variables and Types');
  await page.locator('.lesson-row').filter({ has: page.getByText('Variables and Types', { exact: true }) }).click();
  await page.getByRole('tab', { name: 'Watch the code', exact: true }).click();
  await run(page);
}

async function run(page: Page) {
  const button = page.getByRole('button', { name: '▶ Run', exact: true });
  await expect(button).toBeEnabled({ timeout: 60_000 }); await button.click();
  // A rerun can briefly retain the prior timeline. Wait for this worker to
  // settle before seeking, rather than mistaking the old completed status for
  // completion of the new source.
  await expect(button).toBeDisabled();
  await expect(button).toBeEnabled({ timeout: 60_000 });
  await expect(page.getByText(/· (?:run )?completed/)).toBeVisible({ timeout: 60_000 });
}

async function playground(page: Page, source: string) {
  await navigate(page, 'Playground');
  const editor = page.locator('.cm-content').first();
  await editor.click(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(source);
  await run(page); await seek(page, 'end');
}

async function seek(page: Page, position: number | 'end') {
  const timeline = page.getByRole('slider', { name: 'Timeline', exact: true });
  await timeline.focus();
  await page.keyboard.press(position === 'end' ? 'End' : 'Home');
  if (typeof position === 'number') for (let index = 0; index < position; index++) await page.keyboard.press('ArrowRight');
}

async function diagramGeometry(locator: Locator) {
  return locator.evaluate(element => {
    const svg = element as SVGSVGElement;
    const view = svg.viewBox.baseVal, scale = svg.getScreenCTM()?.a ?? 0;
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number).map(value => {
        const component = value / 255;
        return component <= .04045 ? component / 12.92 : ((component + .055) / 1.055) ** 2.4;
      });
      return channels?.length === 3 ? channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722 : 0;
    };
    const background = luminance(getComputedStyle(svg.closest('.visualization-card')!).backgroundColor);
    const contrasts = [...svg.querySelectorAll('text')].map(text => {
      const foreground = luminance(getComputedStyle(text).fill);
      return { text: text.textContent, fill: getComputedStyle(text).fill, ratio: (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05) };
    });
    return {
      label: svg.getAttribute('aria-label'), scale,
      width: svg.getBoundingClientRect().width, height: svg.getBoundingClientRect().height,
      minimumTextSize: Math.min(...[...svg.querySelectorAll('text')].map(text => parseFloat(getComputedStyle(text).fontSize) * scale)),
      lowContrast: contrasts.filter(item => item.ratio < 4.5),
      clipping: [...svg.querySelectorAll('text')].filter(text => {
        const box = text.getBBox();
        return box.x < view.x - 1 || box.y < view.y - 1 || box.x + box.width > view.x + view.width + 1 || box.y + box.height > view.y + view.height + 1;
      }).map(text => text.textContent),
    };
  });
}

async function noPageOverflow(page: Page) {
  const size = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
  expect(size.document, JSON.stringify(size)).toBeLessThanOrEqual(size.width + 1);
}

async function screenshot(page: Page, name: string, region?: Locator) {
  const target = test.info().outputPath(name + '.png');
  if (region) await region.screenshot({ path: target });
  else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: target, fullPage: true });
  }
  await test.info().attach(name, { path: target, contentType: 'image/png' });
}

test('aliases share one diagram and next-line explanations never pretend the mutation already happened', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 }); await page.goto('/');
  await variablesLesson(page); await seek(page, 9); // saved state BEFORE best.append(40)
  await expect(page.locator('.execution-phase').first()).toContainText(/before line 17/i);
  const shared = page.locator('.visualization-card[data-object-id]').filter({ has: page.locator('.visualization-aliases').filter({ hasText: 'scores' }) });
  await expect(shared).toHaveCount(1);
  await expect(shared.locator('.visualization-aliases')).toContainText('best');
  await expect(shared.locator('rect.cell')).toHaveCount(3);
  expect(await page.locator('.explanation-box').first().innerText()).not.toContain('`');
  await expect(page.locator('.explanation-box').first().locator('code').first()).toBeVisible();
  await screenshot(page, 'alias-shared-object-before-line-17');
  await screenshot(page, 'shared-object-diagram-before-line-17', page.locator('.diagram'));
  const before = await shared.locator('svg').innerHTML();
  await page.getByRole('button', { name: 'Next ›', exact: true }).click();
  await expect(shared.locator('rect.cell')).toHaveCount(4);
  await page.getByRole('button', { name: '‹ Prev', exact: true }).click();
  await expect(shared.locator('rect.cell')).toHaveCount(3);
  expect(await shared.locator('svg').innerHTML()).toBe(before);
  await seek(page, 'end');
  const cards = page.locator('.visualization-card[data-object-id]');
  await expect(cards).toHaveCount(2); // one shared list plus the distinct copy
  const ids = await cards.evaluateAll(nodes => nodes.map(node => node.getAttribute('data-object-id')));
  expect(new Set(ids).size).toBe(2);
  await expect(page.locator('.variables-panel .frame-btn[aria-pressed=true]')).toContainText('Main program');
  await screenshot(page, 'alias-copy-shared-object-after');
  await screenshot(page, 'shared-and-copy-diagrams-after', page.locator('.diagram'));
});

test('inspector separates labels, types, values and typed keys and supports cycle-safe keyboard expansion', async ({ page }) => {
  await page.goto('/');
  await playground(page, `score = 42.5\nplayer = "Ada"\nnums = [10, 20, 30]\nbest = nums\ncopy = list(nums)\nlookup = {1: "integer", "1": "string", (1, 2): "tuple"}\ncycle = []\ncycle.append(cycle)\nprint("ready")`);
  const panel = page.locator('.variables-panel');
  await expect(panel.locator('.inspector-columns')).toContainText('Type');
  const score = panel.locator('[data-inspector-label="score"]').first();
  await expect(score.locator('.oi-key')).toHaveText('score');
  await expect(score.locator('.oi-type')).toHaveText(/(?:Type:\s*)?float$/);
  await expect(score.locator('.oi-value')).toHaveText(/(?:Value:\s*)?42\.5$/);
  const separation = await score.evaluate(row => {
    const key = row.querySelector('.oi-key')!.getBoundingClientRect();
    const value = row.querySelector('.oi-value')!.getBoundingClientRect();
    return { horizontal: value.left - key.right, vertical: value.top - key.bottom };
  });
  expect(separation.horizontal >= 8 || separation.vertical >= 4, JSON.stringify(separation)).toBe(true);
  const nums = panel.locator('[data-inspector-label="nums"]').first();
  await expect(nums.locator('.oi-alias').first()).toContainText('best');
  await expect(nums.locator('.oi-children .oi-key').first()).toHaveText('[0]');
  const lookup = panel.locator('[data-inspector-label="lookup"]').first();
  const keys = await lookup.locator('.oi-children .oi-key').evaluateAll(nodes => nodes.map(node => node.firstChild?.textContent));
  expect(keys).toContain('1'); expect(keys).toContain('"1"'); expect(keys).toContain('(1, 2)');
  const cycle = panel.locator('[data-inspector-label="cycle"]').first();
  await expect(cycle.locator('.oi-cycle')).toBeVisible();
  const toggle = nums.locator('> .oi-toggle');
  await toggle.focus(); await page.keyboard.press('Enter'); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space'); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await screenshot(page, 'aligned-inspector-typed-keys-cycle');
  await screenshot(page, 'inspector-typed-keys-cycle-detail', panel);
});

for (const width of [320, 390, 768, 1440]) test(`all 17 populated diagram families have readable intrinsic sizing and unclipped SVG labels at ${width}px`, async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width, height: 1000 }); await page.goto('/');
  await playground(page, FAMILY_SOURCE);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const results = [];
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Use dark theme', exact: true }).click();
    for (const [model, variable] of FAMILIES) {
      await page.getByLabel('Variable to visualize', { exact: true }).selectOption(variable);
      await page.getByLabel('Diagram family', { exact: true }).selectOption(model);
      const card = page.locator('.visualization-card').first();
      await expect(card, model).toBeVisible();
      const svg = card.locator('svg').first();
      await expect(svg, model).toBeVisible();
      const result = { theme, model, variable, ...await diagramGeometry(svg) }; results.push(result);
      expect.soft(result.scale, JSON.stringify(result)).toBeLessThanOrEqual(1.01);
      expect.soft(result.scale, JSON.stringify(result)).toBeGreaterThanOrEqual(.99);
      expect.soft(result.minimumTextSize, JSON.stringify(result)).toBeGreaterThanOrEqual(11);
      expect.soft(result.lowContrast, JSON.stringify(result)).toEqual([]);
      expect.soft(result.clipping, JSON.stringify(result)).toEqual([]);
      if (model === 'bits') {
        const viewport = card.locator('.diagram-scroll');
        expect(await viewport.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
        await viewport.focus(); await page.keyboard.press('Home');
        const start = await viewport.evaluate(element => element.scrollLeft);
        await page.keyboard.press('ArrowRight');
        await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(start);
      }
      await noPageOverflow(page);
    }
  }
  await test.info().attach('populated-family-geometry', { body: JSON.stringify({ width, results, errors }, null, 2), contentType: 'application/json' });
  expect(errors).toEqual([]);
  await screenshot(page, `${width}px-populated-object-and-inspector`);
  await screenshot(page, `${width}px-dark-object-detail`, page.locator('.visualization-card').first());
});

test('all diagram families distinguish empty data and None roots from names not yet in scope', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 320, height: 1000 }); await page.goto('/');
  await playground(page, 'from collections import deque\nnums = []\nword = ""\ngrid = []\nstack = []\nqueue = deque()\nhead = None\nmapping = {}\nseen = set()\nroot = None\nheap = []\ntrie = None\ngraph = {}\nbits = 0\nthing = {}\nprint("empty fixtures ready")');
  const results = [];
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Use dark theme', exact: true }).click();
    for (const [model, variable] of FAMILIES) {
      await page.getByLabel('Variable to visualize', { exact: true }).selectOption(variable);
      await page.getByLabel('Diagram family', { exact: true }).selectOption(model);
      const card = page.locator('.visualization-card').first(); await expect(card, model).toBeVisible();
      for (const svg of await card.locator('svg').all()) {
        const result = { theme, model, ...await diagramGeometry(svg) }; results.push(result);
        expect.soft(result.clipping, JSON.stringify(result)).toEqual([]);
        expect.soft(result.scale, JSON.stringify(result)).toBeGreaterThanOrEqual(.99);
        expect.soft(result.scale, JSON.stringify(result)).toBeLessThanOrEqual(1.01);
        expect.soft(result.lowContrast, JSON.stringify(result)).toEqual([]);
      }
      if (['linked-list', 'tree', 'trie'].includes(model)) {
        await expect(card).toContainText(/None|empty/i);
        await expect(card).not.toContainText(/not in scope|in scope yet|not.*yet/i);
      }
      await noPageOverflow(page);
    }
  }
  await test.info().attach('empty-family-geometry', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
});

test('edited personal code hides the old inspector and its output until a fresh run', async ({ page }) => {
  await page.goto('/'); await playground(page, 'answer = 12345\nprint(answer)');
  await expect(page.locator('.variables-panel')).toContainText('12345');
  const editor = page.locator('.cm-content').first();
  await editor.click(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText('answer = 67890\nprint(answer)');
  await expect(page.locator('.stale-banner')).toBeVisible();
  await expect(page.locator('.variables-panel')).not.toContainText('12345');
  await expect(page.locator('.variables-panel')).toContainText(/run|current|inspect/i);
  await run(page); await seek(page, 'end');
  await expect(page.locator('.variables-panel')).toContainText('67890');
});

test('long names, long values, huge integers and nested objects stay bounded and explicitly inspectable', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 1000 }); await page.goto('/');
  await playground(page, `class Box:\n    def __init__(self):\n        self.a_very_long_attribute_name_that_must_remain_readable = "long-value-" * 200\nvery_long_variable_name_for_a_small_list = ["a long value that cannot fit in one tiny cell", 2**160]\nlong_string = "readable" * 100\nlarge_number = 2**10000\nbox = Box()\nnested = {"outer": [[1, 2], {"inner": "text"}]}\nprint("ready")`);
  const results = [];
  for (const [model, variable] of [['array', 'very_long_variable_name_for_a_small_list'], ['string', 'long_string'], ['bits', 'large_number'], ['object', 'box']] as const) {
    await page.getByLabel('Variable to visualize', { exact: true }).selectOption(variable);
    await page.getByLabel('Diagram family', { exact: true }).selectOption(model);
    const card = page.locator('.visualization-card').first(); await expect(card).toBeVisible();
    for (const svg of await card.locator('svg').all()) {
      const result = { model, ...await diagramGeometry(svg) }; results.push(result);
      expect.soft(result.clipping, JSON.stringify(result)).toEqual([]);
      expect.soft(result.scale, JSON.stringify(result)).toBeGreaterThanOrEqual(.99);
      expect.soft(result.scale, JSON.stringify(result)).toBeLessThanOrEqual(1.01);
    }
    expect(await card.locator('*').count()).toBeLessThan(1800);
    await noPageOverflow(page);
    if (model === 'bits') await screenshot(page, 'mobile-huge-bits-bounded-and-scrollable', card);
  }
  const huge = page.locator('.variables-panel [data-inspector-label="large_number"]').first();
  expect((await huge.innerText()).length).toBeLessThan(1000);
  const inspect = huge.getByRole('button', { name: /inspect.*text/i });
  await inspect.click();
  await expect(huge).toContainText(/Characters 1[–-]1000/);
  await expect(huge.getByRole('button', { name: /next.*text/i })).toBeEnabled();
  const nested = page.locator('.variables-panel [data-inspector-label="nested"]').first();
  await expect(nested.locator('.oi-key').filter({ hasText: 'outer' })).toBeVisible();
  await test.info().attach('long-value-geometry', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
  await screenshot(page, 'mobile-long-values-bounded-inspection');
});

test('call, return and error states use the selected recorded frame without mixing its locals', async ({ page }) => {
  await page.goto('/');
  await playground(page, 'def inner(value):\n    result = value + 1\n    return result\ndef outer(value):\n    answer = inner(value)\n    return answer\nanswer = outer(41)\nprint(answer)');
  await seek(page, 0);
  const panel = page.locator('.variables-panel');
  const next = page.getByRole('button', { name: 'Next ›', exact: true });
  let foundCall = false, foundReturn = false;
  for (let step = 0; step < 40 && await next.isEnabled(); step++) {
    if (await panel.locator('.frame-btn').filter({ hasText: /^inner/ }).count()) {
      foundCall = true;
      const current = panel.locator('.frame-btn[aria-pressed=true]');
      await expect(current).toContainText('inner');
      await panel.getByRole('button', { name: /Main program/ }).click();
      await expect(panel.locator('.frame-btn[aria-pressed=true]')).toContainText('Main program');
      // Re-select the function explicitly. The next test phase follows calls.
      await panel.locator('.frame-btn').filter({ hasText: /^inner/ }).click();
    }
    if (await panel.getByRole('heading', { name: 'Return value', exact: true }).count()) {
      foundReturn = true;
      await expect(page.locator('.execution-phase').first()).toContainText(/return/i);
    }
    await next.click();
  }
  expect(foundCall).toBe(true); expect(foundReturn).toBe(true);
  const editor = page.locator('.cm-content').first();
  await editor.click(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText('items = [1]\nprint(items[3])');
  await page.getByRole('button', { name: '▶ Run', exact: true }).click();
  await expect(page.getByText(/· (?:run )?error/)).toBeVisible({ timeout: 60_000 });
  await seek(page, 'end');
  // CPython records an unwind return after the exception. Inspect the actual
  // exception event rather than expecting its payload on a different event.
  const previous = page.getByRole('button', { name: '‹ Prev', exact: true });
  for (let step = 0; step < 10 && !await panel.getByRole('heading', { name: 'Error', exact: true }).count() && await previous.isEnabled(); step++) await previous.click();
  await expect(panel.getByRole('heading', { name: 'Error', exact: true })).toBeVisible();
  await expect(panel).toContainText('IndexError');
  await expect(page.locator('.execution-phase').first()).toContainText(/error|exception/i);
});

test('a deep recorded call stack scrolls locally and keeps its current frame reachable', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 1000 }); await page.goto('/');
  const name = 'a_recursive_function_with_a_long_but_valid_python_name';
  await playground(page, `def ${name}(n):\n    value = n\n    if n == 0:\n        return 0\n    return ${name}(n - 1) + 1\nresult = ${name}(40)\nprint(result)`);
  await seek(page, 0);
  const frames = page.locator('.variables-panel .frames');
  const next = page.getByRole('button', { name: 'Next ›', exact: true });
  for (let step = 0; step < 200 && await frames.locator('li').count() < 30 && await next.isEnabled(); step++) await next.click();
  expect(await frames.locator('li').count()).toBeGreaterThanOrEqual(30);
  const metrics = await frames.evaluate(element => ({ client: element.clientHeight, scroll: element.scrollHeight }));
  expect(metrics.client).toBeLessThanOrEqual(302);
  expect(metrics.scroll).toBeGreaterThan(metrics.client);
  const current = frames.locator('.frame-btn[aria-pressed=true]');
  await current.focus();
  expect(await frames.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await expect(current).toBeInViewport();
  await noPageOverflow(page);
  await screenshot(page, 'deep-stack-local-scroll-current-frame');
});

test('populated diagrams and aligned inspector remain usable with actual native 200% page zoom', async ({ baseURL }, info) => {
  test.setTimeout(120_000);
  const profile = await mkdtemp(path.join(tmpdir(), 'dsa-viz-zoom-'));
  const channel = info.project.use.channel;
  const context = await chromium.launchPersistentContext(profile, {
    ...(channel ? { channel } : { executablePath: chromium.executablePath() }),
    headless: true, viewport: null, deviceScaleFactor: undefined,
    args: ['--window-size=1440,1000'], reducedMotion: 'reduce',
  });
  const page = context.pages()[0];
  try {
    await page.goto(baseURL!);
    const before = await page.evaluate(() => ({ width: innerWidth, outerWidth, dpr: devicePixelRatio }));
    if (channel === 'msedge') {
      await page.goto('edge://settings/appearance');
      await page.getByRole('button', { name: 'Page zoom', exact: true }).click();
      await page.getByLabel('Page zoom 100%', { exact: true }).click();
      await page.getByText('200%', { exact: true }).click();
    } else {
      await page.goto('chrome://settings/appearance'); await page.locator('#zoomLevel').selectOption('2');
    }
    await page.goto(baseURL!); await variablesLesson(page); await seek(page, 'end');
    const after = await page.evaluate(() => ({ width: innerWidth, outerWidth, dpr: devicePixelRatio, visualScale: visualViewport!.scale }));
    expect(after.outerWidth).toBe(before.outerWidth);
    expect(after.width).toBeGreaterThanOrEqual(before.width / 2 - 1);
    expect(after.width).toBeLessThanOrEqual(before.width / 2 + 1);
    expect(after.dpr / before.dpr).toBe(2); expect(after.visualScale).toBe(1);
    await expect(page.locator('.visualization-card[data-object-id]')).toHaveCount(2);
    for (const svg of await page.locator('.visualization-card svg').all()) {
      const geometry = await diagramGeometry(svg);
      expect(geometry.scale).toBeLessThanOrEqual(1.01); expect(geometry.clipping).toEqual([]);
    }
    await expect(page.locator('.variables-panel .oi-key').filter({ hasText: /^score$/ })).toBeVisible();
    await noPageOverflow(page);
    await page.locator('.visualization-card').first().scrollIntoViewIfNeeded();
    const target = info.outputPath('native-200-populated-visualization.png');
    await page.screenshot({ path: target, fullPage: false }); await info.attach('native-200-populated-visualization', { path: target, contentType: 'image/png' });
    await info.attach('native-zoom-measured-state', { body: JSON.stringify({ before, after }), contentType: 'application/json' });
  } finally { await context.close(); }
});
