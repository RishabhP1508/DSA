import {test,expect,type Page,type Locator} from '@playwright/test';
import {readFile} from 'node:fs/promises';

// Behavioral acceptance for the redesigned UI. No mocked engine, storage,
// curriculum, fonts or downloads; every test starts in a fresh browser profile.
async function navigate(page:Page,label:string){
  const toggle=page.getByRole('button',{name:'Toggle navigation',exact:true});
  if(await toggle.isVisible())await toggle.click();
  await page.locator('.app-rail').getByRole('button',{name:label,exact:true}).click();
}
async function lesson(page:Page){
  await navigate(page,'Learn');
  await page.getByRole('textbox',{name:'Search lessons'}).fill('Recursion: Base Cases');
  await page.locator('.lesson-list').getByRole('button',{name:/Recursion: Base Cases/}).click();
  await expect(page.getByRole('heading',{name:'Recursion: Base Cases',exact:true})).toBeVisible();
}
async function pattern(page:Page){
  await navigate(page,'Patterns');
  await page.getByRole('textbox',{name:'Search patterns'}).fill('knapsack');
  await page.locator('.pattern-card').filter({has:page.getByRole('heading',{name:/knapsack/i})}).click();
  await expect(page.locator('main h1')).toContainText(/knapsack/i);
}
async function noPageOverflow(page:Page){
  await page.evaluate(()=>document.fonts.ready);
  const size=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth,
    offenders:[...document.querySelectorAll('main *')].flatMap(el=>{const box=el.getBoundingClientRect();return box.width&&box.right>innerWidth+1?[{tag:el.tagName,class:el.className,right:Math.round(box.right),text:el.textContent?.slice(0,70)}]:[];}).slice(0,8)}));
  expect(size.document,JSON.stringify(size)).toBeLessThanOrEqual(size.viewport+1);
}
async function tabsFit(page:Page){
  const width=await page.evaluate(()=>innerWidth);
  for(const tab of await page.getByRole('tab').all()){
    const box=await tab.boundingBox();expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x+box!.width).toBeLessThanOrEqual(width+1);
  }
}
async function edit(page:Page,source:string){
  const editor=page.locator('.cm-content[contenteditable=true]:visible').first();
  await editor.click();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.insertText(source);
}
async function downloadText(page:Page,button:Locator){
  const downloaded=page.waitForEvent('download');await button.click();const file=await downloaded;
  const path=await file.path();expect(path).not.toBeNull();
  return {filename:file.suggestedFilename(),text:await readFile(path!,'utf8')};
}
async function completedReplay(page:Page,output:string){
  await expect(page.getByText(/· completed/)).toBeVisible({timeout:60000});
  const timeline=page.getByRole('slider',{name:'Timeline'});await timeline.focus();await page.keyboard.press('End');
  await expect(page.locator('pre.output').first()).toHaveText(output);
}
async function snapshot(page:Page,label:string){
  const path=`output/playwright/codex-ui-${test.info().project.name}/${label}.png`;
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path,fullPage:true});
  await test.info().attach(label,{path,contentType:'image/png'});
}
test.afterEach(async({page,browser,browserName},info)=>{
  await info.attach('actual-browser',{body:JSON.stringify({engine:browserName,version:browser.version(),project:info.project.name,platform:process.platform,url:page.url(),viewport:page.viewportSize()}),contentType:'application/json'});
  if(info.status!==info.expectedStatus&&!page.isClosed())await snapshot(page,'failure-'+info.title.replace(/[^a-z0-9]+/gi,'-').slice(0,80));
});

test('lesson tabs support keyboard traversal and keep the complete learning sequence',async({page})=>{
  test.setTimeout(90000);
  await page.goto('/');await lesson(page);
  const understand=page.getByRole('tab',{name:'Understand',exact:true});
  await understand.focus();await expect(understand).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('heading',{name:'Why it matters'})).toBeVisible();
  await expect(page.locator('.vocabulary-card')).toContainText('Base case');
  await page.keyboard.press('ArrowRight');
  const watch=page.getByRole('tab',{name:'Watch the code',exact:true});
  await expect(watch).toBeFocused();await expect(watch).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('button',{name:'▶ Run',exact:true})).toBeVisible();
  await page.getByText('Read the explanation for every code line',{exact:true}).click();
  await expect(page.locator('.all-lines li')).toHaveCount(9);
  await page.getByRole('button',{name:'▶ Run',exact:true}).click();await completedReplay(page,'120\n');
  await page.getByRole('slider',{name:'Timeline'}).press('Home');
  for(let i=0;i<60&&await page.locator('.frames li').count()<6;i++)await page.keyboard.press('ArrowRight');
  await expect(page.locator('.frames li')).toHaveCount(6);
  await page.keyboard.press('ArrowRight'); // the first body line, after call entry
  await snapshot(page,'desktop-lesson-watch');
  await watch.focus();await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab',{name:'Try & practice',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('heading',{name:'Experiment before solving'})).toBeVisible();
  await expect(page.locator('.exercise-list .exercise-panel').first()).toBeVisible();
  await expect(page.getByRole('button',{name:'▶ Run',exact:true})).toBeHidden();
  await page.getByRole('tab',{name:'Try & practice',exact:true}).focus();await page.keyboard.press('End');
  await expect(page.getByRole('tab',{name:'Review',exact:true})).toBeFocused();
  await expect(page.getByRole('heading',{name:'Time & space'})).toBeVisible();
  await page.getByText('Sources consulted',{exact:true}).click();
  await expect(page.locator('.sources a').first()).toHaveAttribute('href',/^https:\/\//);
  // Merely opening/reading is not completion; the explicit action remains.
  await expect(page.getByRole('button',{name:'Mark lesson complete',exact:true}).first()).toBeEnabled();
  await page.getByRole('tab',{name:'Review',exact:true}).press('Home');
  await expect(understand).toBeFocused();await expect(understand).toHaveAttribute('aria-selected','true');
});

test('search dialog traps focus, restores its opener and opens a result with keyboard',async({page})=>{
  await page.goto('/');const opener=page.locator('.global-search');
  await opener.click();const dialog=page.getByRole('dialog',{name:'Find your next idea'});
  const input=page.getByRole('textbox',{name:'Search library'});
  await expect(input).toBeFocused();await expect(dialog).toHaveAttribute('aria-modal','true');
  await page.keyboard.press('Shift+Tab');await expect(dialog.getByRole('button',{name:'Close',exact:true})).toBeFocused();
  await page.keyboard.press('Tab');await expect(input).toBeFocused();
  await input.fill('no-such-lesson-acceptance');await expect(dialog.getByText('No matches. Try a broader word.')).toBeVisible();
  await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(opener).toBeFocused();
  const previous=page.getByRole('button',{name:'Learn',exact:true});await previous.focus();
  await page.keyboard.press('ControlOrMeta+k');await expect(input).toBeFocused();
  await page.keyboard.press('Escape');await expect(previous).toBeFocused();
  await page.keyboard.press('ControlOrMeta+k');await input.fill('Recursion: Base Cases');
  await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:/Recursion: Base Cases/})).toBeFocused();
  await page.keyboard.press('Enter');await expect(dialog).toBeHidden();
  await expect(page.getByRole('heading',{name:'Recursion: Base Cases',exact:true})).toBeVisible();
});

test('closed mobile navigation does not receive invisible keyboard focus',async({page})=>{
  await page.setViewportSize({width:360,height:800});await page.goto('/');
  await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator(':focus')).toBeInViewport();
  await expect(page.locator('.global-search')).toHaveAccessibleName(/find|search/i);
  const toggle=page.getByRole('button',{name:'Toggle navigation',exact:true});
  await toggle.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.app-rail')).toBeInViewport();
  // Open navigation must have a keyboard-reachable close route.
  await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator(':focus')).toBeInViewport();
});

test('320 CSS pixels keeps home, lesson and pattern controls inside the viewport',async({page})=>{
  await page.setViewportSize({width:320,height:740});await page.goto('/');await snapshot(page,'320px-home');await noPageOverflow(page);
  await lesson(page);await noPageOverflow(page);await tabsFit(page);
  for(const name of ['Watch the code','Try & practice','Review']){
    await page.getByRole('tab',{name,exact:true}).click();await noPageOverflow(page);await tabsFit(page);
  }
  await pattern(page);await noPageOverflow(page);await tabsFit(page);
  for(const name of ['Watch the code','Try & practice','Related & sources']){
    await page.getByRole('tab',{name,exact:true}).click();await noPageOverflow(page);await tabsFit(page);
  }
  await snapshot(page,'320px-pattern-sources');
});

test.describe('200% zoom-equivalent layout from a 1280x900 desktop',()=>{
  // Browser toolbar zoom is not exposed by Playwright. 640x450 CSS pixels at
  // DPR2 exercise the same reflow dimensions; this does not claim native zoom.
  test.use({viewport:{width:640,height:450},deviceScaleFactor:2});
  test('lesson and pattern tabs remain reachable at half the CSS viewport',async({page})=>{
    await page.goto('/');await lesson(page);await tabsFit(page);await noPageOverflow(page);
    await page.getByRole('tab',{name:'Review',exact:true}).click();await noPageOverflow(page);
    await pattern(page);await tabsFit(page);await noPageOverflow(page);
    await page.getByRole('tab',{name:'Related & sources',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Sources consulted'})).toBeVisible();await noPageOverflow(page);
    await snapshot(page,'200-percent-equivalent-pattern-sources');
  });
});

test('reduced motion disables rail, catalog and dialog transitions',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:360,height:800});await page.goto('/');
  expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  const motion=async(locator:Locator)=>locator.evaluate(el=>{const s=getComputedStyle(el);return {transition:s.transitionDuration,animation:s.animationName};});
  expect(await motion(page.locator('.app-rail'))).toEqual({transition:'0s',animation:'none'});
  await navigate(page,'Patterns');
  expect(await motion(page.locator('.pattern-card').first())).toEqual({transition:'0s',animation:'none'});
  await page.locator('.global-search').click();await expect(page.getByRole('dialog')).toBeVisible();
  expect(await motion(page.getByRole('dialog'))).toEqual({transition:'0s',animation:'none'});
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toBeHidden();
});

test('pattern guide exposes conditions, counterexamples, every line, practice and linked lessons',async({page})=>{
  test.setTimeout(90000);await page.goto('/');await pattern(page);
  for(const name of ['Check these conditions','Compare your options','Clues can mislead you'])await expect(page.getByRole('heading',{name})).toBeVisible();
  const recognize=page.getByRole('tab',{name:'Recognize',exact:true});await recognize.focus();await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab',{name:'Watch the code',exact:true})).toBeFocused();
  await page.getByText('Read every line explanation',{exact:true}).click();
  await expect(page.locator('.line-guide tbody tr')).not.toHaveCount(0);
  await page.getByRole('button',{name:'▶ Run',exact:true}).click();await completedReplay(page,'True\n');
  await page.getByRole('tab',{name:'Try & practice',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Choose an approach, then explain why'})).toBeVisible();
  await expect(page.locator('.exercise-panel').first()).toBeVisible();
  await page.getByRole('tab',{name:'Related & sources',exact:true}).click();
  await expect(page.locator('.source-list a').first()).toHaveAttribute('href',/^https:\/\//);
  await page.locator('.related-grid button').first().click();
  await expect(page.getByRole('tab',{name:'Understand',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(page.locator('main h1')).toContainText(/knapsack/i);
});

test('mixed practice mounts one challenge, keeps replies when collapsed, and paginates',async({page})=>{
  await page.goto('/');await navigate(page,'Practice');
  const headings=page.locator('.challenge-heading');
  await expect(headings).toHaveCount(20);await expect(headings.first()).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.challenge-item .exercise-panel:visible')).toHaveCount(1);
  await expect(headings.first()).toContainText('Recognition challenge 1');
  await expect(headings.first()).not.toContainText('Python');
  const first=page.locator('.challenge-item').first();
  const option=first.getByRole('radio').first();await option.check();
  await headings.first().click();await expect(headings.first()).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('.challenge-item .exercise-panel:visible')).toHaveCount(0);
  await headings.first().click();await expect(option).toBeChecked();
  await headings.nth(1).click();await expect(headings.first()).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('.challenge-item .exercise-panel:visible')).toHaveCount(1);
  await page.getByRole('navigation',{name:'Practice pages'}).getByRole('button',{name:'Next',exact:true}).click();
  await expect(headings.first()).toContainText('Recognition challenge 21');
  await page.getByRole('navigation',{name:'Practice pages'}).getByRole('button',{name:'Previous',exact:true}).click();
  await expect(headings.first()).toContainText('Recognition challenge 1');
});

test('personal Python import normalizes text, preserves drafts, runs only on demand and exports actual source',async({page})=>{
  test.setTimeout(90000);await page.goto('/');await navigate(page,'Playground');
  const save=page.getByRole('button',{name:/Save draft/});await expect(save).toBeEnabled();
  await edit(page,'print("original")\n');await save.click();await expect(page.locator('.save-status')).toContainText('Saved');
  const drafts=page.getByRole('combobox',{name:'Select draft'}),original=await drafts.inputValue();
  const workers:string[]=[];page.on('worker',worker=>workers.push(worker.url()));
  const source='value = input()\nprint("hello", value)\n';
  const importControl=page.getByLabel(/Import \.py/);
  await expect(importControl).toHaveAccessibleName(/Import \.py/);
  await importControl.setInputFiles({name:'greeting.py',mimeType:'text/x-python',buffer:Buffer.from('\ufeff'+source.replace(/\n/g,'\r\n'),'utf8')});
  await expect(page.locator('.save-status')).toContainText('Imported “greeting” into a new draft');
  await expect(drafts.locator('option')).toHaveCount(2);expect(await drafts.inputValue()).not.toBe(original);
  expect(workers).toEqual([]);await expect(page.getByRole('slider',{name:'Timeline'})).toHaveCount(0);
  const imported=await drafts.inputValue();
  await drafts.selectOption(original);await expect(page.locator('.cm-content')).toContainText('original');
  await drafts.selectOption(imported);await expect(page.locator('.cm-content')).toContainText('hello');
  await importControl.setInputFiles({name:'binary.py',mimeType:'text/x-python',buffer:Buffer.from([0xff,0x00])});
  await expect(page.locator('.save-status')).toContainText('Import failed');await expect(drafts.locator('option')).toHaveCount(2);
  const exported=await downloadText(page,page.getByRole('button',{name:/Export \.py/}));
  expect(exported.filename).toMatch(/\.py$/);expect(exported.text).toBe(source);
  await page.getByRole('textbox',{name:/Input for input/}).fill('café');await save.click();
  await page.getByRole('button',{name:'▶ Run',exact:true}).click();await completedReplay(page,'hello café\n');
  expect(workers.length).toBeGreaterThan(0);expect(workers.every(url=>new URL(url).port==='4174')).toBe(true);
  await snapshot(page,'desktop-playground');
  await page.reload();await navigate(page,'Playground');
  await expect(page.getByRole('combobox',{name:'Select draft'})).toHaveValue(imported);
  await expect(page.getByRole('textbox',{name:/Input for input/})).toHaveValue('café');
  await expect(page.locator('.cm-content')).toContainText('hello');
});

test('backup downloads real progress and drafts, rejects foreign data, and restores into a fresh profile',async({page,browser})=>{
  await page.goto('/');await lesson(page);await page.getByRole('button',{name:'Mark lesson complete',exact:true}).first().click();
  await expect(page.getByRole('button',{name:/✓ Completed/}).first()).toBeDisabled();
  await navigate(page,'Playground');await expect(page.getByRole('button',{name:/Save draft/})).toBeEnabled();
  await edit(page,'print("backed up")\n');await page.getByRole('textbox',{name:/Input for input/}).fill('saved stdin');
  await page.getByRole('button',{name:/Save draft/}).click();await expect(page.locator('.save-status')).toContainText('Saved');
  await navigate(page,'Backup');
  await expect(page.locator('main#main-content')).toHaveCount(1);
  const restore=page.locator('input[type=file]');await expect(restore).toHaveAccessibleName(/backup/i);
  await page.getByRole('link',{name:'Skip to content'}).focus();await page.keyboard.press('Enter');await page.keyboard.press('Tab');
  expect(await page.locator(':focus').evaluate(el=>!!el.closest('main'))).toBe(true);
  const backup=await downloadText(page,page.getByRole('button',{name:/Download backup/}));
  const envelope=JSON.parse(backup.text);expect(envelope.app).toBe('dsa-visual-lab');expect(envelope.backupVersion).toBe(2);
  expect(envelope.data.lessons['dp-base-cases'].completed).toBe(true);
  expect(envelope.data.drafts.playground).toMatchObject({source:'print("backed up")\n',stdin:'saved stdin'});
  await restore.setInputFiles({name:'foreign.json',mimeType:'application/json',buffer:Buffer.from('{"app":"other"}')});
  await expect(page.getByText(/Import rejected:.*existing progress was not changed/)).toBeVisible();
  const unchanged=await downloadText(page,page.getByRole('button',{name:/Download backup/}));
  expect(JSON.parse(unchanged.text).data).toEqual(envelope.data);
  const fresh=await browser.newContext({baseURL:new URL(page.url()).origin});
  try{
    const other=await fresh.newPage();await other.goto('/');
    const restoredWorkers:string[]=[];other.on('worker',worker=>restoredWorkers.push(worker.url()));
    // A never-written profile has no stored record to snapshot. Persist a real
    // pre-import draft so recovery checks preservation of actual existing data.
    await navigate(other,'Playground');await expect(other.getByRole('button',{name:/Save draft/})).toBeEnabled();
    await edit(other,'print("before restore")\n');await other.getByRole('button',{name:/Save draft/}).click();
    await expect(other.locator('.save-status')).toContainText('Saved');await navigate(other,'Backup');
    const prior=await downloadText(other,other.getByRole('button',{name:/Download backup/}));
    await other.locator('input[type=file]').setInputFiles({name:backup.filename,mimeType:'application/json',buffer:Buffer.from(backup.text)});
    await expect(other.getByText(/Restored backup.*Local progress replaced/)).toBeVisible();
    await expect(other.getByRole('row').filter({has:other.getByRole('cell',{name:'Lessons completed',exact:true})})).toContainText('1');
    await navigate(other,'Playground');await expect(other.locator('.cm-content')).toContainText('backed up');
    await expect(other.getByRole('textbox',{name:/Input for input/})).toHaveValue('saved stdin');
    await navigate(other,'Backup');await other.getByRole('button',{name:'Restore previous snapshot',exact:true}).click();
    await expect(other.getByRole('status')).toContainText('Previous snapshot restored');
    const recovered=await downloadText(other,other.getByRole('button',{name:/Download backup/}));
    expect(JSON.parse(recovered.text).data).toEqual(JSON.parse(prior.text).data);
    expect(restoredWorkers).toEqual([]);
  }finally{await fresh.close();}
});
