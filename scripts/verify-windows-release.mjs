/**
 * Acceptance against an ALREADY STARTED extracted/staged Windows release.
 * Does not build, package, launch servers, stop servers, or touch app source.
 * Uses installed Chrome AND Edge, each with isolated disposable profiles.
 *
 * node scripts/verify-windows-release.mjs
 * node scripts/verify-windows-release.mjs --base-url http://127.0.0.1:8765 --output outputs/windows-browser-acceptance.json
 * BASE_URL may also select the app origin. The runner origin comes from /health.
 * Non-loopback HTTP requests are aborted and WebSockets closed; loopback stays
 * reachable. This emulates an offline browser context, not a disconnected OS.
 */
import assert from 'node:assert/strict';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium, expect} from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const USAGE = 'node scripts/verify-windows-release.mjs [--base-url http://127.0.0.1:8765] [--output outputs/windows-browser-acceptance.json]';
const PROBE = 'https://release-offline-probe.invalid/';
const SOURCE = 'name = input()\nvalue = int(input())\nprint("release hello", name)\nprint(value * 2)\n';
const STDIN = 'café\n21\n';

function options() {
  const result = {baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:8765', output: path.join(ROOT, 'outputs/windows-browser-acceptance.json')};
  for (let i = 2; i < process.argv.length; i++) {
    const flag = process.argv[i];
    if (flag === '--help' || flag === '-h') return {help: true};
    if (!['--base-url', '--output'].includes(flag) || !process.argv[i + 1]) throw new Error(USAGE);
    result[flag === '--base-url' ? 'baseURL' : 'output'] = process.argv[++i];
  }
  result.output = path.resolve(result.output);
  return result;
}
function exactLoopbackOrigin(value) {
  const url = new URL(value);
  assert(url.protocol === 'http:' && url.hostname === '127.0.0.1' && url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password,
    `Expected an exact 127.0.0.1 HTTP origin, got ${value}`);
  return url.origin;
}
function loopbackRequest(value) {
  const url = new URL(value);
  return ['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol) &&
    (url.hostname === 'localhost' || url.hostname === '[::1]' || /^127(?:\.\d{1,3}){3}$/.test(url.hostname));
}
function errorRecord(error) { return {name: error?.name ?? 'Error', message: error?.message ?? String(error), stack: error?.stack}; }

async function health(origin, role) {
  const response = await fetch(origin + '/health', {signal: AbortSignal.timeout(15_000), redirect: 'error'});
  assert(response.ok, `${role} /health returned ${response.status}`);
  const data = await response.json();
  assert.equal(data.appId, 'dsa-visual-lab');
  assert.equal(data.role, role);
  assert(typeof data.buildId === 'string' && data.buildId.length > 0, 'Missing package build identity');
  return {url: response.url, status: response.status, data, csp: response.headers.get('content-security-policy') ?? ''};
}

async function offlineContext(browser, result, label, baseURL) {
  const context = await browser.newContext({baseURL, viewport: {width: 1280, height: 900}, acceptDownloads: true, serviceWorkers: 'block'});
  const audit = {label, requests: [], workers: [], blockedHTTP: [], sockets: [], console: [], pageErrors: [], closing: false};
  result.contexts.push(audit);
  const records = new WeakMap();
  context.setDefaultTimeout(20_000);
  context.setDefaultNavigationTimeout(30_000);
  const track = request => {
    if (!records.has(request)) {
      const record = {method: request.method(), url: request.url(), resourceType: request.resourceType(), intentionalProbe: request.url().startsWith(PROBE)};
      records.set(request, record); audit.requests.push(record);
    }
    return records.get(request);
  };
  context.on('request', track);
  context.on('response', response => {
    Object.assign(track(response.request()), {status: response.status(), contentType: response.headers()['content-type'] ?? ''});
  });
  context.on('requestfinished', request => {track(request).finished = true;});
  context.on('requestfailed', request => {
    Object.assign(track(request), {failure: request.failure()?.errorText ?? 'unknown failure', duringTeardown: audit.closing});
  });
  context.on('page', page => {
    page.on('worker', worker => audit.workers.push({url: worker.url()}));
    page.on('pageerror', error => audit.pageErrors.push(errorRecord(error)));
    page.on('console', message => {
      if (message.type() === 'error') audit.console.push({text: message.text(), location: message.location(), intentionalProbe: audit.probing === true});
    });
  });
  await context.route('**/*', async route => {
    const request = route.request();
    if (loopbackRequest(request.url())) return route.continue();
    const record = track(request); record.blockedByOfflineGuard = true;
    audit.blockedHTTP.push({url: request.url(), intentionalProbe: record.intentionalProbe});
    await route.abort('internetdisconnected');
  });
  await context.routeWebSocket('**/*', socket => {
    const local = loopbackRequest(socket.url());
    audit.sockets.push({url: socket.url(), local, blocked: !local});
    if (local) socket.connectToServer();
    else socket.close({code: 1008, reason: 'Offline release acceptance'});
  });
  return {context, audit};
}

function assertTraffic(audit) {
  assert.deepEqual(audit.blockedHTTP.filter(record => !record.intentionalProbe), [], 'The app attempted an external request');
  assert.deepEqual(audit.sockets.filter(record => !record.local), [], 'The app attempted an external WebSocket');
  assert.deepEqual(audit.requests.filter(record => !record.intentionalProbe && ((record.status ?? 0) >= 400 || (record.failure && !record.duringTeardown))), [], 'Unexpected local request/asset failure');
  assert.deepEqual(audit.pageErrors, [], 'Uncaught browser error');
  assert.deepEqual(audit.console.filter(record => !record.intentionalProbe), [], 'Unexpected browser console error');
}
async function navigate(page, label) {
  const toggle = page.getByRole('button', {name: 'Toggle navigation', exact: true});
  if (await toggle.isVisible()) await toggle.click();
  await page.locator('.app-rail').getByRole('button', {name: label, exact: true}).click();
}
async function openLesson(page) {
  await navigate(page, 'Learn');
  await page.getByRole('textbox', {name: 'Search lessons'}).fill('Recursion: Base Cases');
  await page.locator('.lesson-list').getByRole('button', {name: /Recursion: Base Cases/}).click();
  await expect(page.getByRole('heading', {name: 'Recursion: Base Cases', exact: true})).toBeVisible();
}
async function completed(page, output) {
  await expect(page.getByText(/· completed/)).toBeVisible({timeout: 60_000});
  const slider = page.getByRole('slider', {name: 'Timeline'});
  await slider.press('End');
  await expect(page.locator('pre.output').first()).toHaveText(output);
  return slider;
}
async function recordedState(page) {
  return {
    position: await page.getByRole('slider', {name: 'Timeline'}).inputValue(),
    frames: await page.locator('.frames li').allTextContents(),
    variables: await page.locator('.vars-inspect').allTextContents(),
    output: await page.locator('pre.output').first().textContent(),
    highlightedLine: await page.locator('.cm-active-trace-line').allTextContents(),
  };
}
async function downloadBackup(page, destination) {
  const event = page.waitForEvent('download');
  await page.getByRole('button', {name: /Download backup/}).click();
  const download = await event;
  assert.match(download.suggestedFilename(), /\.json$/);
  await download.saveAs(destination);
  return {filename: download.suggestedFilename(), path: destination, envelope: JSON.parse(await readFile(destination, 'utf8'))};
}

async function browserAcceptance(channel, expected, outputDir) {
  const result = {channel, status: 'failed', phases: [], contexts: [], startedAt: new Date().toISOString(), headless: true};
  let browser, primary, restored, page;
  const phase = async (name, action) => {
    result.currentPhase = name;
    const start = Date.now();
    const detail = await action();
    result.phases.push({name, status: 'passed', elapsedMs: Date.now() - start, detail});
  };
  try {
    browser = await chromium.launch({channel, headless: true});
    result.browserVersion = browser.version();
    primary = await offlineContext(browser, result, 'primary', expected.appOrigin);

    await phase('offline-request-guard', async () => {
      const probePage = await primary.context.newPage();
      primary.audit.probing = true;
      try {
        const refused = await probePage.evaluate(async url => {try {await fetch(url); return false;} catch {return true;}}, PROBE + 'route-guard');
        assert(refused, 'External request unexpectedly succeeded');
        assert(primary.audit.blockedHTTP.some(record => record.url === PROBE + 'route-guard'), 'Browser did not exercise the offline request interceptor');
        return {externalRequestAborted: true};
      } finally {await probePage.close(); primary.audit.probing = false;}
    });

    page = await primary.context.newPage();
    await phase('package-boot-and-bundled-fonts', async () => {
      const current = await health(expected.appOrigin, 'app');
      assert.equal(current.data.buildId, expected.buildId);
      await page.goto('/');
      await expect(page).toHaveTitle('DSA Visual Lab');
      await expect(page.locator('main#main-content')).toBeVisible();
      await expect(page.getByRole('heading', {name: /Big ideas/})).toBeVisible();
      const config = await page.evaluate(() => globalThis.__DSA_RUNNER_CONFIG__);
      assert.deepEqual(config, {mode: 'cross-origin', appOrigin: expected.appOrigin, runnerOrigin: expected.runnerOrigin, bridgePath: '/runner-bridge.html'});
      const fonts = await page.evaluate(async () => {
        const requests = [['DM Sans', '400 14px "DM Sans"'], ['JetBrains Mono', '400 14px "JetBrains Mono"'], ['Fraunces', '500 24px "Fraunces"']];
        const loaded = [];
        for (const [family, css] of requests) {
          const faces = await document.fonts.load(css, 'DSA Visual Lab');
          loaded.push({family, faceCount: faces.length, loaded: faces.length > 0 && faces.every(face => face.status === 'loaded'), check: document.fonts.check(css, 'DSA Visual Lab')});
        }
        await document.fonts.ready;
        return loaded;
      });
      assert(fonts.every(font => font.loaded && font.check), 'A bundled font did not load');
      return {config, fonts};
    });

    await phase('lesson-real-python-and-recorded-replay', async () => {
      await openLesson(page);
      await expect(page.locator('.vocabulary-card')).toContainText('Base case');
      await page.getByRole('tab', {name: 'Watch the code', exact: true}).click();
      await page.getByRole('button', {name: '▶ Run', exact: true}).click();
      const slider = await completed(page, '120\n');
      const steps = Number(await slider.getAttribute('max')) + 1;
      assert(steps > 10, 'The actual lesson produced no useful recorded trace');
      await slider.press('Home');
      await expect(page.locator('pre.output').first()).toHaveText('(no output yet)');
      for (let i = 0; i < steps && await page.locator('.frames li').count() < 6; i++) await page.getByRole('button', {name: 'Next ›', exact: true}).click();
      await expect(page.locator('.frames li')).toHaveCount(6);
      const before = await recordedState(page);
      const workersBeforeReplay = primary.audit.workers.length;
      await page.getByRole('button', {name: 'Next ›', exact: true}).click();
      const forward = await recordedState(page);
      assert.equal(Number(forward.position), Number(before.position) + 1);
      await page.getByRole('button', {name: '‹ Prev', exact: true}).click();
      assert.deepEqual(await recordedState(page), before, 'Backward replay did not restore the same recorded state');
      assert.equal(primary.audit.workers.length, workersBeforeReplay, 'Stepping reran Python');
      await slider.press('End');
      await expect(page.locator('pre.output').first()).toHaveText('120\n');
      await page.getByRole('button', {name: 'Mark lesson complete', exact: true}).first().click();
      await expect(page.getByRole('button', {name: /✓ Completed/}).first()).toBeDisabled();
      await page.screenshot({path: path.join(outputDir, `${channel}-release-lesson.png`), fullPage: true});
      return {lesson: 'dp-base-cases', stdout: '120\n', steps, before, forward, backwardRestored: true, steppingCreatedWorkers: 0};
    });

    let draftSlot;
    await phase('personal-python-file-stdin-and-persistent-draft', async () => {
      await navigate(page, 'Playground');
      await expect(page.getByRole('button', {name: /Save draft/})).toBeEnabled();
      const workersBeforeImport = primary.audit.workers.length;
      const chosen = page.waitForEvent('filechooser');
      await page.locator('label.import-btn').click();
      await (await chosen).setFiles({name: 'windows-release.py', mimeType: 'text/x-python', buffer: Buffer.from('\ufeff' + SOURCE.replace(/\n/g, '\r\n'), 'utf8')});
      await expect(page.locator('.save-status')).toContainText('Imported “windows-release” into a new draft');
      assert.equal(primary.audit.workers.length, workersBeforeImport, 'Import executed personal source');
      draftSlot = await page.getByRole('combobox', {name: 'Select draft'}).inputValue();
      await page.getByRole('textbox', {name: /Input for input/}).fill(STDIN);
      await page.getByRole('button', {name: /Save draft/}).click();
      await expect(page.locator('.save-status')).toContainText('Saved');
      await page.getByRole('button', {name: '▶ Run', exact: true}).click();
      await completed(page, 'release hello café\n42\n');
      await page.screenshot({path: path.join(outputDir, `${channel}-release-playground.png`), fullPage: true});
      await page.reload(); await navigate(page, 'Playground');
      await expect(page.getByRole('combobox', {name: 'Select draft'})).toHaveValue(draftSlot);
      await expect(page.getByRole('textbox', {name: /Input for input/})).toHaveValue(STDIN);
      await expect(page.locator('.cm-content')).toContainText('release hello');
      await expect(page.getByRole('slider', {name: 'Timeline'})).toHaveCount(0);
      return {source: SOURCE, stdin: STDIN, stdout: 'release hello café\n42\n', draftSlot, importExecuted: false, survivedReload: true};
    });

    await phase('progress-json-download-and-fresh-profile-restore', async () => {
      await navigate(page, 'Backup');
      const backup = await downloadBackup(page, path.join(outputDir, `${channel}-fixture-backup.json`));
      assert.equal(backup.envelope.app, 'dsa-visual-lab'); assert.equal(backup.envelope.backupVersion, 2);
      assert.equal(backup.envelope.data.lessons['dp-base-cases'].completed, true);
      assert.equal(backup.envelope.data.drafts[draftSlot].source, SOURCE);
      assert.equal(backup.envelope.data.drafts[draftSlot].stdin, STDIN);
      await page.getByLabel('Backup file to restore').setInputFiles({name: 'foreign.json', mimeType: 'application/json', buffer: Buffer.from('{"app":"foreign"}')});
      await expect(page.getByRole('status')).toContainText(/Import rejected:.*existing progress was not changed/);
      const preserved = await downloadBackup(page, path.join(outputDir, `${channel}-after-rejected-backup.json`));
      assert.deepEqual(preserved.envelope.data, backup.envelope.data, 'Rejected import changed progress');
      restored = await offlineContext(browser, result, 'fresh-restore', expected.appOrigin);
      const other = await restored.context.newPage(); await other.goto('/'); await navigate(other, 'Backup');
      const chooser = other.waitForEvent('filechooser');
      await other.getByLabel('Backup file to restore').click();
      await (await chooser).setFiles(backup.path);
      await expect(other.getByRole('status')).toContainText(/Restored backup.*Local progress replaced/);
      const roundTrip = await downloadBackup(other, path.join(outputDir, `${channel}-restored-backup.json`));
      assert.deepEqual(roundTrip.envelope.data, backup.envelope.data, 'Fresh-profile restore changed the exported data');
      await other.reload(); await openLesson(other);
      await expect(other.getByRole('button', {name: /✓ Completed/}).first()).toBeDisabled();
      await navigate(other, 'Playground');
      await expect(other.getByRole('combobox', {name: 'Select draft'})).toHaveValue(draftSlot);
      await expect(other.getByRole('textbox', {name: /Input for input/})).toHaveValue(STDIN);
      await expect(other.locator('.cm-content')).toContainText('release hello');
      assert.equal(restored.audit.workers.length, 0, 'Restore/reload executed saved Python source');
      return {downloadFilename: backup.filename, downloadedPath: backup.path, restoredPath: roundTrip.path, lessonCompleted: true, exactDataRoundTrip: true, rejectedImportPreservedData: true, restoreExecutedSource: false};
    });

    await phase('runner-origin-csp-and-local-runtime-assets', async () => {
      await navigate(page, 'Backup');
      primary.audit.probing = true;
      let frame;
      try {
        const loaded = page.waitForEvent('framenavigated', candidate => candidate.url() === expected.runnerOrigin + '/runner-bridge.html');
        await page.evaluate(origin => {
          const iframe = document.createElement('iframe'); iframe.id = 'release-runner-probe'; iframe.title = 'Release acceptance runner probe'; iframe.src = origin + '/runner-bridge.html'; document.body.append(iframe);
        }, expected.runnerOrigin);
        frame = await loaded;
        await frame.waitForLoadState('load');
        const denial = await frame.evaluate(async url => {
          const violations = []; const listener = event => violations.push({directive: event.effectiveDirective, blockedURI: event.blockedURI});
          document.addEventListener('securitypolicyviolation', listener);
          let fetchBlocked = false, parentDomError = '';
          try {await fetch(url);} catch {fetchBlocked = true;}
          try {void parent.document.body;} catch (error) {parentDomError = error.name;}
          await new Promise(resolve => setTimeout(resolve, 50));
          document.removeEventListener('securitypolicyviolation', listener);
          return {fetchBlocked, parentDomError, origin: location.origin, violations};
        }, PROBE + 'runner-csp');
        assert.equal(denial.fetchBlocked, true); assert.equal(denial.parentDomError, 'SecurityError'); assert.equal(denial.origin, expected.runnerOrigin);
        assert(denial.violations.some(violation => violation.directive === 'connect-src' && violation.blockedURI && new URL(violation.blockedURI).origin === new URL(PROBE).origin), 'Runner fetch was not blocked by its CSP');
        assert(primary.audit.workers.length >= 2, 'Lesson and personal code did not create actual workers');
        assert(primary.audit.workers.every(worker => new URL(worker.url).origin === expected.runnerOrigin), 'Python worker used the app origin');
        const responses = primary.audit.requests.filter(record => record.status === 200 && record.finished);
        const assets = {
          scripts: responses.filter(record => record.resourceType === 'script' && record.url.startsWith(expected.appOrigin + '/assets/')).map(record => record.url),
          styles: responses.filter(record => record.resourceType === 'stylesheet').map(record => record.url),
          fonts: responses.filter(record => record.resourceType === 'font' && record.url.endsWith('.woff2')).map(record => record.url),
          runtime: responses.filter(record => record.url.startsWith(expected.runnerOrigin + '/pyodide/')).map(record => record.url),
        };
        assert(assets.scripts.length && assets.styles.length && assets.fonts.length, 'Missing observed successful app/font assets');
        assert(assets.runtime.some(url => url.endsWith('.wasm')) && assets.runtime.some(url => url.endsWith('python_stdlib.zip')), 'Missing observed local Python runtime assets');
        return {denial, workers: primary.audit.workers, assets};
      } finally {
        await page.locator('#release-runner-probe').evaluateAll(nodes => nodes.forEach(node => node.remove()));
        primary.audit.probing = false;
      }
    });
    for (const item of result.contexts) assertTraffic(item);
    result.status = 'passed';
  } catch (error) {
    result.error = errorRecord(error);
    if (page && !page.isClosed()) {
      try {result.failureScreenshot = path.join(outputDir, `${channel}-release-failure.png`); await page.screenshot({path: result.failureScreenshot, fullPage: true});} catch { /* preserve the original failure */ }
    }
  } finally {
    for (const holder of [restored, primary]) if (holder) {holder.audit.closing = true; await holder.context.close().catch(() => {});}
    await browser?.close().catch(() => {});
    result.finishedAt = new Date().toISOString();
  }
  return result;
}

async function main() {
  const selected = options();
  if (selected.help) {console.log(USAGE); return;}
  const report = {schemaVersion: 1, kind: 'extracted-windows-release-browser-acceptance', status: 'failed', startedAt: new Date().toISOString(), platform: process.platform,
    baseURL: selected.baseURL, offline: {method: 'BrowserContext HTTP/WebSocket interception', nonLoopbackHTTP: 'aborted', nonLoopbackWebSockets: 'closed', serviceWorkers: 'blocked', scope: 'browser contexts; loopback remains online'}, browsers: []};
  const outputDir = path.join(path.dirname(selected.output), 'windows-browser-acceptance');
  await mkdir(outputDir, {recursive: true});
  try {
    assert.equal(process.platform, 'win32', 'This acceptance requires the installed Windows Chrome and Edge channels');
    const appOrigin = exactLoopbackOrigin(selected.baseURL);
    const app = await health(appOrigin, 'app');
    assert.equal(app.data.appOrigin, appOrigin);
    const runnerOrigin = exactLoopbackOrigin(app.data.runnerOrigin);
    assert.notEqual(runnerOrigin, appOrigin);
    const runner = await health(runnerOrigin, 'runner');
    assert.equal(runner.data.buildId, app.data.buildId); assert.equal(runner.data.appOrigin, appOrigin); assert.equal(runner.data.runnerOrigin, runnerOrigin);
    assert(app.csp.includes(`frame-src ${runnerOrigin}`) && !app.csp.includes("'unsafe-eval'"), 'App CSP is not isolated');
    assert(runner.csp.includes("connect-src 'self'") && runner.csp.includes(`frame-ancestors ${appOrigin}`), 'Runner CSP is not isolated');
    report.package = {app, runner};
    for (const channel of ['chrome', 'msedge']) {
      report.browsers.push(await browserAcceptance(channel, {appOrigin, runnerOrigin, buildId: app.data.buildId}, outputDir));
    }
    const finalApp = await health(appOrigin, 'app'), finalRunner = await health(runnerOrigin, 'runner');
    assert.equal(finalApp.data.buildId, app.data.buildId); assert.equal(finalRunner.data.buildId, app.data.buildId);
    report.status = report.browsers.every(browser => browser.status === 'passed') ? 'passed' : 'failed';
  } catch (error) {report.error = errorRecord(error);}
  report.finishedAt = new Date().toISOString();
  await writeFile(selected.output, JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.status.toUpperCase()}: Windows release acceptance → ${selected.output}`);
  for (const result of report.browsers) console.log(`  ${result.channel} ${result.browserVersion ?? '(launch failed)'}: ${result.status}${result.error ? ' — ' + result.error.message : ''}`);
  if (report.error) console.error(report.error.message);
  if (report.status !== 'passed') process.exitCode = 1;
}

await main();
