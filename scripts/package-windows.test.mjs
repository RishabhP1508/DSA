import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {ROOT,NODE_VERSION,NODE_ARCHIVE,createInventory,stagePackage,verifyStagedPackage} from './package-windows.mjs';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
test('package inventory, freeze validation, copied checksums and paths containing spaces',()=>{
 const base=path.join(ROOT,'outputs');fs.mkdirSync(base,{recursive:true});
 const fixture=fs.mkdtempSync(path.join(base,'package tests with spaces '));
 const put=(relative,bytes)=>{const file=path.join(fixture,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);};
 const copy=(relative)=>{const file=path.join(fixture,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.copyFileSync(path.join(ROOT,relative),file);};
 try{
  for(const file of ['dist/index.html','dist/runner-bridge.html','dist/pyodide/pyodide.mjs','dist/pyodide/pyodide.asm.mjs','dist/pyodide/pyodide.asm.wasm','dist/pyodide/python_stdlib.zip','dist/pyodide/pyodide-lock.json','desktop/server.mjs','desktop/start.mjs','desktop/stop.mjs'])put(file,`fixture: ${file}\n`);
  for(const file of ['Start.cmd','Stop.cmd'])put(file,fs.readFileSync(path.join(ROOT,file)));
  put('src/lesson.ts','export const sample=1;\n');put('package.json','{"name":"fixture"}\n');put('package-lock.json','{"packages":{}}\n');
  for(const file of [`vendor/${NODE_ARCHIVE}`,`vendor/node-v${NODE_VERSION}-win-x64/node.exe`,`vendor/node-v${NODE_VERSION}-win-x64/LICENSE`,'vendor/node-runtime-provenance.json',`vendor/SHASUMS256-node-v${NODE_VERSION}.txt`])copy(file);
  const provenance=JSON.parse(fs.readFileSync(path.join(ROOT,'vendor/licenses/provenance.json'),'utf8'));
  put('vendor/licenses/provenance.json',JSON.stringify(provenance));
  for(const row of provenance)copy(`vendor/licenses/${row.file}`);
  const inventory=createInventory(fixture);
  assert.equal(createInventory(fixture).inputHash,inventory.inputHash,'deterministic inventory without writes');
  assert.ok(inventory.files.some(row=>row.destination==='source/src/lesson.ts'));
  assert.ok(inventory.files.some(row=>row.destination==='runtime/LICENSE'));
  assert.equal(fs.existsSync(path.join(fixture,'build-id.txt')),false,'inventory does not stage output');
  const output=path.join(fixture,'outputs','DSA Visual Lab fixture space');
  assert.throws(()=>stagePackage(output,{root:fixture,expectedInputHash:'bad'}),/matching --expect-input-hash/);
  assert.equal(fs.existsSync(output),false,'wrong freeze hash creates no directory');
  const staged=stagePackage(output,{root:fixture,expectedInputHash:inventory.inputHash});
  assert.equal(staged.inputHash,inventory.inputHash);
  assert.equal(fs.readFileSync(path.join(output,'build-id.txt'),'utf8').trim(),inventory.buildId);
  assert.match(fs.readFileSync(path.join(output,'Start.cmd'),'utf8'),/"%~dp0runtime\\node\.exe"/);
  assert.match(fs.readFileSync(path.join(output,'Stop.cmd'),'utf8'),/"%~dp0desktop\\stop\.mjs"/);
  assert.ok(fs.existsSync(path.join(output,'licenses/runtime/Pyodide-314.0.7-LICENSE.txt')));
  assert.ok(fs.existsSync(path.join(output,'THIRD-PARTY-NOTICES.md')));
  assert.equal(verifyStagedPackage(output,inventory.inputHash).inputHash,inventory.inputHash);
  const checksums=fs.readFileSync(path.join(output,'SHA256SUMS.txt'),'utf8').trim().split('\n');
  for(const row of checksums){const split=row.indexOf('  ');const expected=row.slice(0,split);const file=row.slice(split+2);assert.equal(sha(fs.readFileSync(path.join(output,file))),expected,file);}
  assert.throws(()=>stagePackage(output,{root:fixture,expectedInputHash:inventory.inputHash}),/already exists/);
  put('src/lesson.ts','export const sample=2;\n');
  assert.notEqual(createInventory(fixture).inputHash,inventory.inputHash,'an edited source invalidates freeze');
  assert.throws(()=>stagePackage(path.join(fixture,'outputs/new output'),{root:fixture,expectedInputHash:inventory.inputHash}),/matching --expect-input-hash/);
  fs.writeFileSync(path.join(output,'source/src/lesson.ts'),'changed after testing');
  assert.throws(()=>verifyStagedPackage(output,inventory.inputHash),/changed staged file/);
 }finally{
  // Cleanup is limited to the resolved directory just created for this test.
  const resolved=path.resolve(fixture);
  assert.ok(resolved.startsWith(path.resolve(base)+path.sep)&&path.basename(resolved).startsWith('package tests with spaces '));
  fs.rmSync(resolved,{recursive:true,force:true});
 }
});
