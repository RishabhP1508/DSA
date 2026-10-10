/** Validate authored checkpoint indices against fresh bundled-runtime traces.
 * Run: node --experimental-strip-types --import ./scripts/lib/ts-register.mjs docs/reviews/codex-prediction-bounds.mjs
 * This checks recorded-index existence, not the educational meaning of prose.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {loadCurriculum,ROOT} from '../../scripts/lib/load-curriculum.mjs';
import {getPyodide,runProgram} from '../../scripts/lib/pyodide-harness.mjs';
import {contentHashOf} from '../../scripts/lib/content-hash.mjs';

const curriculum=await loadCurriculum();
const errors=[...curriculum.errors];
if(curriculum.lessons.length!==133)errors.push(`Expected 133 lessons, found ${curriculum.lessons.length}.`);
if(curriculum.patterns.length!==29)errors.push(`Expected 29 patterns, found ${curriculum.patterns.length}.`);
const tracerHash=()=>createHash('sha256').update(fs.readFileSync(path.join(ROOT,'src/engine/tracer.py'))).digest('hex');
const tracerSha256=tracerHash();
const runtime=await getPyodide();
const pythonVersion=runtime.runPython('import sys\nsys.version');
const report={
  checkedAt:new Date().toISOString(),
  scope:'Every registered lesson and pattern; authored prediction indices where present. Bounds are not semantic signoff.',
  runtime:{pyodide:'314.0.7',pythonVersion,tracerSha256},
  counts:{lessons:curriculum.lessons.length,patterns:curriculum.patterns.length,realTraces:0,completedTraces:0,failedTraces:0,itemsWithPredictions:0,itemsWithoutPredictions:0,checkpoints:0,validCheckpoints:0,invalidCheckpoints:0,unvalidatedCheckpoints:0},
  items:[],errors,
};
for(const [kind,items] of [['lesson',curriculum.lessons],['pattern',curriculum.patterns]]) {
  for(const item of items) {
    const beforeHash=contentHashOf(item);
    const code=kind==='lesson'?item.code:item.walkthroughCode;
    const stdin=kind==='lesson'?item.stdin:item.walkthroughStdin;
    const expectedOutput=kind==='lesson'?item.expectedOutput:item.walkthroughExpectedOutput;
    const trace=await runProgram(code,stdin??'');
    report.counts.realTraces++;
    report.counts[trace.status==='completed'?'completedTraces':'failedTraces']++;
    const entry={kind,id:item.id,contentHash:beforeHash,status:trace.status,eventCount:trace.events.length,expectedOutputMatches:trace.stdout===expectedOutput,checkpoints:[]};
    if(trace.status!=='completed')errors.push(`${kind}:${item.id}: trace ${trace.status}: ${JSON.stringify(trace.error)}`);
    if(!entry.expectedOutputMatches)errors.push(`${kind}:${item.id}: example stdout differs from expected output.`);
    const predictions=item.prediction??[];
    if(!Array.isArray(predictions)) {
      errors.push(`${kind}:${item.id}: prediction is not an array.`);
      report.items.push(entry);
      continue;
    }
    report.counts[predictions.length?'itemsWithPredictions':'itemsWithoutPredictions']++;
    for(const [ordinal,prediction] of predictions.entries()) {
      const index=prediction.atEventIndex;
      const inRange=Number.isInteger(index)&&index>=0&&index<trace.events.length;
      const valid=trace.status==='completed'?inRange:null;
      report.counts.checkpoints++;
      report.counts[valid===null?'unvalidatedCheckpoints':valid?'validCheckpoints':'invalidCheckpoints']++;
      const event=inRange?trace.events[index]:null;
      const next=inRange?trace.events[index+1]:null;
      const checkpoint={ordinal,index,valid,prompt:prediction.prompt,answer:prediction.answer,
        event:event?{index:event.index,kind:event.kind,line:event.line,frame:event.frames.at(-1)?.name,stdout:event.stdout}:null,
        next:next?{index:next.index,kind:next.kind,line:next.line,frame:next.frames.at(-1)?.name,stdout:next.stdout}:null};
      entry.checkpoints.push(checkpoint);
      if(valid===false)errors.push(`${kind}:${item.id}: checkpoint ${ordinal} index ${JSON.stringify(index)} outside integer range [0,${trace.events.length-1}].`);
      if(valid&&event.index!==index)errors.push(`${kind}:${item.id}: array position ${index} contains event index ${event.index}.`);
    }
    if(contentHashOf(item)!==beforeHash)errors.push(`${kind}:${item.id}: loaded content changed while tracing.`);
    report.items.push(entry);
  }
}
if(tracerHash()!==tracerSha256)errors.push('Tracer source changed during validation; rerun against the frozen version.');
fs.writeFileSync(path.join(ROOT,'docs/reviews/codex-prediction-bounds-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({counts:report.counts,errorCount:errors.length,firstErrors:errors.slice(0,8)},null,2));
if(errors.length)process.exitCode=1;
