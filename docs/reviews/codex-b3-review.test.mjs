import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadCurriculum } from '../../scripts/lib/load-curriculum.mjs';
import { runProgram } from '../../scripts/lib/pyodide-harness.mjs';
const c = await loadCurriculum();
const ls = c.lessons.filter(x => ['Searching', 'Sorting'].includes(x.area));
const ps = c.patterns.filter(x => ['binary-search-on-answer','merge-intervals','greedy-interval-scheduling','modified-binary-search','divide-and-conquer'].includes(x.id));
const get = id => [...ls,...ps].find(x => x.id === id);
const failures=[]; const results=[];
async function check(name, fn) {try {await fn();results.push({name,passed:true});}catch(e){failures.push(name+': '+e.message);results.push({name,passed:false,error:e.message});}}
await check('scope excludes demonstration literal construction for function analyses',()=>{
  for(const x of [...ls,...ps].filter(x=>!['comparators','interval-sorting'].includes(x.id))) assert.notEqual(x.complexityExplanation.scope,'program',x.id);
});
await check('shipping range includes initialization at R=0',()=>{
  for(const id of ['binary-search-answer','binary-search-on-answer']) assert.match(get(id).complexityExplanation.time.bound,/log\s*\(?R\s*\+\s*2/);
});
await check('rotated distinct implementation explicitly rejects duplicate guarantee in prose',()=>{
  assert.match(get('rotated-array-search').concepts.edgeCases,/wrong|incorrect/);
  assert.match(get('modified-binary-search').conditions.join(' '),/distinct/i);
});
await check('actual Python sorting variants use their own memory and time',()=>{
  assert.equal(get('quick-sort').complexityExplanation.space.bound,'O(n^2)');
  assert.equal(get('heap-sort').complexityExplanation.space.bound,'O(n)');
  assert.equal(get('bucket-sort').complexityExplanation.time.bound,'O(n log n + k)');
  assert.equal(get('greedy-interval-scheduling').complexityExplanation.space.bound,'O(n)');
});
await check('bounds exposes both boundary loops and validates presence',()=>{
  assert.equal((get('bounds').code.match(/while lo < hi:/g)||[]).length,2);
  assert.match(get('bounds').exercises.find(x=>x.id==='bnd-choose-1').expected,/len\(nums\)|check.*present/i);
});
for(const x of [...ls,...ps]) await check('sample '+x.id,async()=>{
  const r=await runProgram(x.code??x.walkthroughCode);assert.equal(r.status,'completed');assert.equal(r.stdout,x.expectedOutput??x.walkthroughExpectedOutput);
});
for(const x of [...ls,...ps]) for(const ex of x.exercises.filter(x=>x.tests)) await check('exercise '+x.id+':'+ex.id,async()=>{
  const r=await runProgram((ex.preludeCode??'')+'\n'+ex.expected+'\n'+ex.tests);assert.equal(r.status,'completed',JSON.stringify(r.error));
});
async function oracle(id, code) {await check('boundary '+id,async()=>{
 const x=get(id);const r=await runProgram((x.code??x.walkthroughCode)+'\n'+code);assert.equal(r.status,'completed',JSON.stringify(r.error));assert.match(r.stdout,/ORACLE OK\n$/);
});}
await oracle('linear-search',`for a in [[], [0], [2,2,1], [-2,0,3]]:
    for target in [-2,0,1,2,3,9]:
        expected = a.index(target) if target in a else -1
        assert linear_search(a, target) == expected
print('ORACLE OK')`);
await oracle('binary-search',`for a in [[], [0], [1,1,2], [-3,0,4,9]]:
    for t in [-3,0,1,2,4,9,10]:
        i = binary_search(a,t)
        assert (i == -1 and t not in a) or (0 <= i < len(a) and a[i] == t)
print('ORACLE OK')`);
for(const id of ['rotated-array-search','modified-binary-search']) await oracle(id,`for n in range(7):
    a = list(range(n))
    for p in range(max(1,n)):
        rotated = a[p:] + a[:p]
        for t in range(-1,n+1):
            expected = rotated.index(t) if t in rotated else -1
            assert search_rotated(rotated,t) == expected
# Outside the documented distinct-values contract; prove why the warning is needed.
assert search_rotated([1,0,1,1,1],0) == -1
print('ORACLE OK')`);
for(const [id,fn] of [['binary-search-answer','min_capacity'],['binary-search-on-answer','least_capacity']]) await oracle(id,`def independent_days(weights, cap):
    used, total = 1, 0
    for w in weights:
        if w > cap: return 10**9
        if total + w > cap: used += 1; total = 0
        total += w
    return used
for weights in [[5], [1,1], [3,1,2], [2,2,2], [1,3,1,2]]:
    for days in range(1,len(weights)+2):
        expected = next(cap for cap in range(max(weights),sum(weights)+1) if independent_days(weights,cap)<=days)
        assert ${fn}(weights,days) == expected
print('ORACLE OK')`);
for(const [id,fn] of [['binary-search-answer','min_capacity'],['binary-search-on-answer','least_capacity']]) await oracle(id,`for weights, days in [([],1), ([0],1), ([-1,2],1), ([1],0)]:
    try:
        ${fn}(weights,days)
    except ValueError:
        pass
    else:
        raise AssertionError('invalid shipping input was accepted')
print('ORACLE OK')`);
await oracle('binary-search-on-answer',`assert can_ship([10],9,2) is False
assert can_ship([10],10,1) is True
print('ORACLE OK')`);
await oracle('bounds',`import bisect
for a in [[], [1], [2,2,2], [-3,0,0,4]]:
    for t in [-4,-3,0,1,2,4,9]:
        assert lower_bound(a,t) == bisect.bisect_left(a,t)
        assert upper_bound(a,t) == bisect.bisect_right(a,t)
print('ORACLE OK')`);
await oracle('matrix-search',`for m in [[], [[]], [[1]], [[-3,-1,0],[2,4,6]], [[1,1],[1,2]]]:
    for t in [-3,-1,0,1,2,4,6,9]:
        assert search_matrix(m,t) == any(t in row for row in m)
print('ORACLE OK')`);
for(const [id,fn] of [['bubble-sort','bubble_sort'],['selection-sort','selection_sort'],['insertion-sort','insertion_sort'],['merge-sort','merge_sort'],['quick-sort','quick_sort'],['heap-sort','heap_sort'],['divide-and-conquer','merge_sort'],['counting-sort','counting_sort'],['radix-sort','radix_sort'],['bucket-sort','bucket_sort']]) await oracle(id,`for a in [[], [0], [0,0,0], [5,4,3,2,1], [3,1,3,0,8,1]]:
    before = a[:]
    assert ${fn}(a) == sorted(before)
    assert a == before
print('ORACLE OK')`);
for(const [id,fn] of [['bubble-sort','bubble_sort'],['selection-sort','selection_sort'],['insertion-sort','insertion_sort'],['merge-sort','merge_sort'],['quick-sort','quick_sort'],['heap-sort','heap_sort'],['divide-and-conquer','merge_sort']]) await oracle(id,`for a in [[-3,-1,-2], [-3,0,-3,2], [4,-8,2,-1,0]]:
    before=a[:]
    assert ${fn}(a)==sorted(a)
    assert a==before
print('ORACLE OK')`);
for(const [id,fn] of [['bubble-sort','bubble_sort'],['insertion-sort','insertion_sort'],['merge-sort','merge_sort'],['quick-sort','quick_sort'],['divide-and-conquer','merge_sort']]) await oracle(id,`class Record:
    def __init__(self,key,tag): self.key,self.tag=key,tag
    def __lt__(self,other): return self.key<other.key
    def __le__(self,other): return self.key<=other.key
    def __gt__(self,other): return self.key>other.key
    def __eq__(self,other): return self.key==other.key
a=[Record(2,'a'),Record(1,'b'),Record(2,'c'),Record(1,'d'),Record(2,'e')]
assert [x.tag for x in ${fn}(a)] == ['b','d','a','c','e']
print('ORACLE OK')`);
await oracle('merge-intervals',`for a, expected in [([],[]), ([[1,4],[4,5]],[[1,5]]), ([[1,10],[2,3]],[[1,10]]), ([[-3,-1],[-2,0],[2,3]],[[-3,0],[2,3]])]:
    before = [x[:] for x in a]
    assert merge_intervals(a) == expected
    assert a == before
print('ORACLE OK')`);
await oracle('greedy-interval-scheduling',`def brute(intervals):
    best=0
    for mask in range(1 << len(intervals)):
        subset=sorted([x for i,x in enumerate(intervals) if mask & (1<<i)])
        if all(subset[i][1] <= subset[i+1][0] for i in range(len(subset)-1)):
            best=max(best,len(subset))
    return best
for a in [[], [[1,2]], [[1,10],[2,3],[4,5],[6,7]], [[-3,-1],[-1,0],[0,1]], [[1,3],[2,3],[3,4]]]:
    assert max_meetings([x[:] for x in a]) == brute(a)
print('ORACLE OK')`);
fs.writeFileSync('docs/reviews/codex-b3-test-results.json', JSON.stringify({runtime:'bundled Pyodide / CPython 3.14.2',results,failures},null,2));
console.log(`${results.length-failures.length}/${results.length} checks passed`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
