import {test,expect,type Page} from '@playwright/test';

async function playground(page: Page) {
  await page.goto('/');
  await page.getByRole('button',{name:'Playground',exact:true}).click();
}
async function code(page: Page,source:string) {
  const editor=page.locator('.cm-content').first();
  await editor.click(); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.insertText(source);
}
test('app and actual bridge use different loopback origins',async({page})=>{
  await playground(page);
  const app=await page.evaluate(()=>location.origin);
  const navigated=page.waitForEvent('framenavigated',f=>f.url().includes('runner-bridge.html'));
  await page.getByRole('button',{name:'▶ Run',exact:true}).click();
  await expect(page.locator('iframe[title="Isolated Python execution"]')).toHaveAttribute('src',/127\.0\.0\.1:4174\/runner-bridge.html/);
  const frame=await navigated;
  expect(new URL(frame.url()).origin).not.toBe(app);
  await expect(page.getByText(/· completed/)).toBeVisible({timeout:60000});
});
test('bridge and worker receive restrictive CSP response headers',async({page,request})=>{
  const bridge=await request.get('http://127.0.0.1:4174/runner-bridge.html');
  const csp=bridge.headers()['content-security-policy'];
  expect(csp).toContain("connect-src 'self'");expect(csp).toContain('frame-ancestors http://127.0.0.1:4173');
  await playground(page);const created=page.waitForEvent('worker');await page.getByRole('button',{name:'▶ Run',exact:true}).click();
  const worker=await created;
  await expect(page.getByText(/· completed/)).toBeVisible({timeout:60000});
  expect(new URL(worker.url()).port).toBe('4174');
  const workerResponse=await request.get(worker.url());expect(workerResponse.headers()['content-security-policy']).toContain("connect-src 'self'");
  const app=await request.get('/');expect(app.headers()['content-security-policy']).not.toContain('unsafe-eval');
});
test('real bridge rejects malformed requests and unrelated envelopes',async({page})=>{
  await page.goto('/');
  const result=await page.evaluate(async()=>{
    const frame=document.createElement('iframe');frame.src='http://127.0.0.1:4174/runner-bridge.html';document.body.append(frame);
    await new Promise<void>(resolve=>frame.onload=()=>resolve());
    const messages:unknown[]=[];const listener=(event:MessageEvent)=>{if(event.source===frame.contentWindow && event.data?.kind)messages.push(event.data);};
    window.addEventListener('message',listener);
    // Invalid nested data from the correct parent cannot create a worker.
    frame.contentWindow!.postMessage({v:1,runId:1,owner:'probe',sourceRev:0,inputRev:0,seq:0,kind:'run',payload:{source:'print("unsafe")',stdin:'',limits:{timeMs:-1,maxEvents:10,maxTraceBytes:1000}}},'http://127.0.0.1:4174');
    // A synthetic MessageEvent has no trusted browser-supplied source/origin.
    frame.contentWindow!.postMessage({type:'unrelated',payload:{}},'http://127.0.0.1:4174');
    await new Promise(resolve=>setTimeout(resolve,150));
    const workerCreated=messages.length>0;window.removeEventListener('message',listener);frame.remove();return workerCreated;
  });
  expect(result).toBe(false);
});
test('Windows browser executes, stops, and restarts through the bridge',async({page})=>{
  await playground(page);await code(page,'import time\nprint("started")\ntime.sleep(4)\nprint("old result")');
  await page.getByRole('button',{name:'▶ Run',exact:true}).click();
  await expect(page.getByLabel('Live program output')).toContainText('started',{timeout:60000});
  await page.getByRole('button',{name:'■ Stop',exact:true}).click();
  await expect(page.getByText(/recorded states are partial/)).toBeVisible();
  await code(page,'print("new result")');await page.getByRole('button',{name:'▶ Run',exact:true}).click();
  await expect(page.getByText(/· completed/)).toBeVisible({timeout:60000});
  const slider=page.getByRole('slider',{name:'Timeline'});await slider.focus();await page.keyboard.press('End');
  await expect(page.locator('pre.output')).toContainText('new result');await expect(page.locator('pre.output')).not.toContainText('old result');
});
test('runner CSP blocks remote fetch and runner cannot read app storage',async({page})=>{
  await page.goto('/');
  const databaseName='dsa-app-origin-isolation-probe';
  const appValue='app-private-progress-sentinel';
  const runnerValue='runner-private-sentinel';
  const observed=await page.evaluate(async({databaseName,appValue})=>{
    const database=await new Promise<IDBDatabase>((resolve,reject)=>{
      const request=indexedDB.open(databaseName,1);
      request.onupgradeneeded=()=>request.result.createObjectStore('sentinels');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    await new Promise<void>((resolve,reject)=>{
      const transaction=database.transaction('sentinels','readwrite');
      transaction.objectStore('sentinels').put(appValue,'shared-key');
      transaction.oncomplete=()=>resolve();
      transaction.onabort=()=>reject(transaction.error);
    });
    database.close();
    const marker=document.createElement('div');marker.id='app-origin-isolation-marker';marker.textContent=appValue;document.body.append(marker);
    const frame=document.createElement('iframe');frame.src='http://127.0.0.1:4174/runner-bridge.html';document.body.append(frame);
    await new Promise<void>(resolve=>frame.onload=()=>resolve());return frame.src;
  },{databaseName,appValue});
  const runner=page.frames().find(f=>f.url()===observed)!;
  try {
    const result=await runner.evaluate(async({databaseName,runnerValue})=>{
      let blocked=false,parentDomError='';
      try {await fetch('https://example.com/');}catch{blocked=true;}
      try {void parent.document.getElementById('app-origin-isolation-marker')!.textContent;}
      catch(error){parentDomError=(error as DOMException).name;}
      // Create the same schema on this origin, so an empty read demonstrates
      // separate data rather than a missing-store exception.
      const database=await new Promise<IDBDatabase>((resolve,reject)=>{
        const request=indexedDB.open(databaseName,1);
        request.onupgradeneeded=()=>request.result.createObjectStore('sentinels');
        request.onsuccess=()=>resolve(request.result);
        request.onerror=()=>reject(request.error);
      });
      const read=()=>new Promise<unknown>((resolve,reject)=>{
        const request=database.transaction('sentinels','readonly').objectStore('sentinels').get('shared-key');
        request.onsuccess=()=>resolve(request.result??null);
        request.onerror=()=>reject(request.error);
      });
      try {
        const valueBefore=await read();
        await new Promise<void>((resolve,reject)=>{
          const transaction=database.transaction('sentinels','readwrite');
          transaction.objectStore('sentinels').put(runnerValue,'shared-key');
          transaction.oncomplete=()=>resolve();
          transaction.onabort=()=>reject(transaction.error);
        });
        return {blocked,parentDomError,valueBefore,valueAfter:await read(),origin:location.origin};
      } finally {database.close();}
    },{databaseName,runnerValue});
    expect(result).toEqual({blocked:true,parentDomError:'SecurityError',valueBefore:null,valueAfter:runnerValue,origin:'http://127.0.0.1:4174'});
    const appRead=await page.evaluate(async databaseName=>{
      const database=await new Promise<IDBDatabase>((resolve,reject)=>{
        const request=indexedDB.open(databaseName,1);
        request.onsuccess=()=>resolve(request.result);
        request.onerror=()=>reject(request.error);
      });
      try {
        const value=await new Promise<unknown>((resolve,reject)=>{
          const request=database.transaction('sentinels','readonly').objectStore('sentinels').get('shared-key');
          request.onsuccess=()=>resolve(request.result);
          request.onerror=()=>reject(request.error);
        });
        return {value,marker:document.getElementById('app-origin-isolation-marker')!.textContent,origin:location.origin};
      } finally {database.close();}
    },databaseName);
    expect(appRead).toEqual({value:appValue,marker:appValue,origin:'http://127.0.0.1:4173'});
  } finally {
    for(const context of [runner,page])await context.evaluate(databaseName=>new Promise<void>((resolve,reject)=>{
      const request=indexedDB.deleteDatabase(databaseName);
      request.onsuccess=()=>resolve();request.onerror=()=>reject(request.error);
    }),databaseName);
  }
});
