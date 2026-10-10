import fs from 'node:fs';
import assert from 'node:assert/strict';
import {taskScheduler} from '../../src/content/lessons/task-scheduler.ts';
import {meetingRoomsII} from '../../src/content/lessons/meeting-rooms-ii.ts';
import {runProgram,getPyodide} from '../../scripts/lib/pyodide-harness.mjs';
import {gradeRecognition,validateRecognition} from '../../src/core/recognition-grading.ts';
import {contentHashOf} from '../../scripts/lib/content-hash.mjs';

const integration=JSON.parse(fs.readFileSync('docs/reviews/codex-fu12-central-integration.json','utf8'));
const items=[taskScheduler,meetingRoomsII];
function value(e,name){for(const f of [...e.frames].reverse()){const found=f.locals.find(v=>v.name===name);if(found)return found.value;}}
function decoded(e,v){if(!v)return undefined;if(v.kind==='none')return null;if(v.kind==='ref'){const obj=e.objects[v.id];return obj?.entries?.map(x=>decoded(e,x.value))??obj?.repr;}return v.value;}
const result={runtime:'bundled Pyodide 314.0.7 / CPython 3.14.2',items:[],codingRejected:[],recognitionPairs:[],oracles:[],checkpoints:[]};
const py=await getPyodide();
result.pythonVersion=py.runPython('import sys\nsys.version');
assert.match(result.pythonVersion,/3\.14\.2/);
for(const item of items){
 const run=await runProgram(item.code);
 assert.equal(run.status,'completed',item.id);
 assert.equal(run.stdout,item.expectedOutput,item.id);
 const lines=item.code.split('\n');
 assert.equal(item.codeExplanations.length,lines.length);
 assert.deepEqual(item.codeExplanations.map(x=>x.line),lines.map((_,i)=>i+1));
 for(const e of run.events.filter(x=>x.kind==='line'))assert.equal(item.codeExplanations[e.line-1]?.executable,true,`${item.id}:${e.line}`);
 for(const ex of item.exercises){
  assert.equal(ex.hints.length,6,`${item.id}:${ex.id}:hints`);
  if(ex.tests){
   const model=await runProgram(`${ex.expected}\n${ex.tests}`);
   assert.equal(model.status,'completed',`${item.id}:${ex.id}:model: ${JSON.stringify(model.error)}`);
   const faults=integration.faultyVariants.find(x=>x.uid===`lesson:${item.id}:${ex.id}`).variants;
   for(const [name,code] of Object.entries({starter:ex.starterCode,empty:'',...faults})){
    const bad=await runProgram(`${code}\n${ex.tests}`);
    assert.equal(bad.status,'error',`${item.id}:${ex.id}:${name}`);
    result.codingRejected.push({uid:`lesson:${item.id}:${ex.id}`,variant:name,error:bad.error});
   }
  }
  if(ex.recognition){
   assert.deepEqual(validateRecognition(ex.recognition),[],`${item.id}:${ex.id}`);
   for(const a of ex.recognition.approaches)for(const reason of ex.recognition.reasons){
    const alt=ex.recognition.alternatives?.find(x=>x.approachId===a.id);
    const primary=ex.recognition.acceptableApproachIds.includes(a.id);
    const pass=!reason.contradictory && (primary?a.requiredReasonIds:alt?.requiredReasonIds??[]).includes(reason.id);
    const expected=pass?(primary?'accepted':'accepted-alternative'):'rejected';
    const verdict=gradeRecognition(ex.recognition,a.id,reason.id);
    assert.equal(verdict.outcome,expected);
    result.recognitionPairs.push({uid:`lesson:${item.id}:${ex.id}`,approach:a.id,reason:reason.id,outcome:verdict.outcome});
   }
  }
 }
 const checkpoint=item.id==='task-scheduler'
  ?run.events.find(e=>e.kind==='line'&&e.line===27&&decoded(e,value(e,'time'))===5)
  :run.events.find(e=>e.kind==='line'&&e.line===13&&decoded(e,value(e,'start'))===10);
 assert.ok(checkpoint,`${item.id}: actual decision checkpoint`);
 if(item.id==='task-scheduler'){
  assert.deepEqual(decoded(checkpoint,value(checkpoint,'ready')),[]);
  assert.deepEqual(decoded(checkpoint,value(checkpoint,'waiting')),[[6,-1,'A']]);
  assert.deepEqual(decoded(checkpoint,value(checkpoint,'timeline')),['A','B','C','A','B']);
  const after=run.events.find(e=>e.index>checkpoint.index&&decoded(e,value(e,'timeline'))?.length===6);
  assert.equal(decoded(after,value(after,'timeline'))[5],null);
 }else{
  assert.deepEqual(decoded(checkpoint,value(checkpoint,'end_heap')),[10,15]);
  const after=run.events.find(e=>e.index>checkpoint.index&&e.kind==='line'&&e.line===15&&decoded(e,value(e,'start'))===10);
  assert.deepEqual(decoded(after,value(after,'end_heap')),[15,20]);
  const last=[...run.events].reverse().find(e=>e.frames.at(-1)?.name==='min_rooms');
  assert.deepEqual(decoded(last,value(last,'active_counts')),[1,2,2,1]);
  assert.equal(decoded(last,value(last,'peak')),2);
  assert.deepEqual(decoded(last,value(last,'end_heap')),[25]);
 }
 result.checkpoints.push({id:item.id,index:checkpoint.index,line:checkpoint.line,verifiedBeforeDecision:true});
 if(process.argv.includes('--write-checkpoints')){
  const path=`src/content/lessons/${item.id}.ts`;
  const source=fs.readFileSync(path,'utf8');
  assert.match(source,/"atEventIndex": \d+/);
  fs.writeFileSync(path,source.replace(/"atEventIndex": \d+/,`"atEventIndex": ${checkpoint.index}`));
 }else assert.equal(item.prediction[0].atEventIndex,checkpoint.index,`${item.id}: prediction index`);
 result.items.push({id:item.id,events:run.events.length,lines:lines.length,stdout:run.stdout,contentHash:contentHashOf(item)});
}

// Independent shortest-path search over all possible scheduling actions,
// including optional idle actions when work is ready. This uses no priority
// heap or frequency formula and checks optimality, not only gap validity.
const schedulerOracle=`import json
from collections import Counter, deque
from itertools import product

def oracle_duration(counts, cooldown):
    initial = (tuple(counts), (0, 0, 0))
    frontier = deque([(initial, 0)])
    seen = {initial}
    while frontier:
        (remaining, blocked), time = frontier.popleft()
        if not any(remaining):
            return time
        choices = [i for i in range(3) if remaining[i] and blocked[i] == 0] + [None]
        for choice in choices:
            next_counts = list(remaining)
            next_blocked = list(blocked)
            if choice is not None:
                next_counts[choice] -= 1
                next_blocked[choice] = cooldown + 1
            next_blocked = tuple(max(0, b - 1) if next_counts[i] else 0 for i, b in enumerate(next_blocked))
            state = (tuple(next_counts), next_blocked)
            if state not in seen:
                seen.add(state)
                frontier.append((state, time + 1))

cases = 0
for counts in product(range(4), repeat=3):
    tasks = [label for label, count in zip('ABC', counts) for _ in range(count)]
    for cooldown in range(4):
        before = tasks[:]
        slots = schedule(tasks, cooldown)
        assert tasks == before
        assert Counter(x for x in slots if x is not None) == Counter(tasks)
        positions = {}
        for time, label in enumerate(slots):
            if label is not None:
                assert time - positions.get(label, -cooldown-1) >= cooldown + 1, (counts, cooldown, slots)
                positions[label] = time
        optimum = oracle_duration(counts, cooldown)
        assert len(slots) == optimum, (counts, cooldown, slots, optimum)
        cases += 1
print(json.dumps({'group':'scheduler-exhaustive-actions', 'cases':cases, 'labels':3, 'countsPerLabel':'0..3', 'cooldowns':'0..3'}))`;

// Direct count at each supplied endpoint is independent of sorting and heap
// updates. Half-open containment at a tie is checked literally, s <= t < e.
const roomsOracle=`import json
from itertools import combinations_with_replacement

base = [(-1, 1), (0, 1), (1, 2), (0, 2), (0, 3), (2, 3)]
cases = 0
for n in range(6):
    for selected in combinations_with_replacement(base, n):
        intervals = [list(pair) for pair in reversed(selected)]
        before = [pair[:] for pair in intervals]
        points = {point for pair in intervals for point in pair}
        optimum = max((sum(start <= time < end for start, end in intervals) for time in points), default=0)
        assert min_rooms(intervals) == optimum, (intervals, optimum)
        assert intervals == before
        cases += 1
print(json.dumps({'group':'rooms-direct-containment', 'cases':cases, 'meetingCounts':'0..5', 'baseIntervals':base}))`;
for(const [item,oracle] of [[taskScheduler,schedulerOracle],[meetingRoomsII,roomsOracle]]){
 py.globals.set('__fu12_source',`${item.exercises[0].expected}\n${oracle}`);
 const output=py.runPython(`import contextlib, io\n__fu12_ns = {'__name__': '__fu12_oracle__'}\n__fu12_out = io.StringIO()\nwith contextlib.redirect_stdout(__fu12_out):\n    exec(__fu12_source, __fu12_ns)\n__fu12_out.getvalue()`);
 result.oracles.push(JSON.parse(output.trim()));
}
fs.writeFileSync('docs/reviews/codex-fu12-verification-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({items:result.items,oracles:result.oracles,codingRejected:result.codingRejected.length,recognitionPairs:result.recognitionPairs.length,checkpoints:result.checkpoints},null,2));
