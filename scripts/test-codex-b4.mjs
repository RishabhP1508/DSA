import assert from 'node:assert/strict';
import { loadCurriculum } from './lib/load-curriculum.mjs';
import { getPyodide, runProgram } from './lib/pyodide-harness.mjs';
import { resolveBindingObject } from '../src/visualizers/helpers.ts';
import fs from 'node:fs';
import { validateRecognition, gradeRecognition } from '../src/core/recognition-grading.ts';
import { EXERCISE_FAULTY } from '../src/content/exercise-faulty-variants.ts';

const c = await loadCurriculum();
const lessonIds = ['linked-list-traversal','linked-list-slow-fast','linked-list-cycle-detection','linked-list-reversal','linked-list-middle','linked-list-dummy-nodes','linked-list-merging','linked-list-pointer-manipulation','linked-list-variants','linked-list-deques','stack-queue-operations','monotonic-stack','parentheses-matching','expression-evaluation','bfs-queues','min-max-tracking','min-max-heaps','heap-sift','top-k','kth-largest','running-median','two-heap-pattern','merge-sorted-data'];
const patternIds = ['fast-slow-pointers','in-place-linkedlist-reversal','top-k-heap','two-heaps','k-way-merge','monotonic-stack'];
const lessons = c.lessons.filter(x => lessonIds.includes(x.id));
const patterns = c.patterns.filter(x => patternIds.includes(x.id));
const owned = [...lessons, ...patterns];
// Pending shared edits are supplied as a reviewable patch; root applies them before integrated verification.
const pending = JSON.parse(fs.readFileSync('docs/reviews/codex-b4-shared-patches.json','utf8'));
for(const x of owned)for(const e of x.exercises??[])for(const p of pending)if(p.uid===`${x.area?'lesson':'pattern'}:${x.id}:${e.id}`)e[p.field]=p.value;
assert.equal(owned.length, 29, 'Explicit review inventory changed; inspect it before extending this test.');
const py = await getPyodide();
let checks = 0, failures = [];
async function check(name, fn) {
  try { await fn(); checks++; } catch (e) { failures.push(`${name}: ${e.message}`); }
}
function program(id) { const x=owned.find(x=>x.id===id); return x.code ?? x.walkthroughCode; }
function oracle(id, assertions) {
  py.globals.set('__b4_code', program(id)); py.globals.set('__b4_oracle', assertions);
  py.runPython("import contextlib, io\n_b4_ns = {}\nwith contextlib.redirect_stdout(io.StringIO()):\n    exec(__b4_code, _b4_ns)\n    exec(__b4_oracle, _b4_ns)");
}
for (const x of owned) await check(`${x.id} trace/output/lines/bindings`, async () => {
  const code=x.code ?? x.walkthroughCode;
  const result = await runProgram(code);
  assert.equal(result.status, 'completed', JSON.stringify(result.error));
  assert.equal(result.stdout, x.expectedOutput ?? x.walkthroughExpectedOutput);
  assert.deepEqual(x.codeExplanations.map(e=>e.line), code.split('\n').map((_,i)=>i+1));
  for(const b of x.bindings ?? []) {
    if(b.model==='recursion') continue;
    assert(result.events.some(e => resolveBindingObject(e,b).value !== undefined), `unresolved binding ${b.variable}.${b.path??''}`);
  }
});
for(const x of owned)for(const e of x.exercises??[]) {
  const uid=`${x.area?'lesson':'pattern'}:${x.id}:${e.id}`;
  if(e.recognition)await check(`${uid} recognition pairs`,()=>{
    assert.deepEqual(validateRecognition(e.recognition),[]);
    for(const id of e.recognition.acceptableApproachIds) {
      const a=e.recognition.approaches.find(a=>a.id===id);
      for(const reasonId of a.requiredReasonIds)assert.equal(gradeRecognition(e.recognition,id,reasonId).outcome,'accepted');
    }
  });
  if(['complete-code','fix-mistake'].includes(e.kind))await check(`${uid} real exercise model and wrong attempts`, async()=>{
    async function run(code){return runProgram(`${e.preludeCode??''}\n${code}\n${e.tests}`);}
    const result=await run(e.expected);assert.equal(result.status,'completed',JSON.stringify(result.error));
    const faulty=EXERCISE_FAULTY[uid];assert(faulty,'missing authored faulty variants');
    for(const [name,code] of Object.entries({starter:e.starterCode,empty:'',...faulty})) {
      if(typeof code !== 'string')continue;
      assert.notEqual((await run(code)).status,'completed',`${name} incorrectly accepted`);
    }
  });
}
await check('circular empty/singleton/order',()=>oracle('linked-list-variants', `
assert build_circular([]) is None
assert build_doubly([]) == (None,None)
r=build_circular([9]); assert r.next is r
r=build_circular([1,2,3]); assert [r.val,r.next.val,r.next.next.val]==[1,2,3]
assert r.next.next.next is r
h,t=build_doubly([1,2,3]); assert h.prev is None and t.next is None
assert h.next.prev is h and t.prev.next is t
`));
await check('RPN exact integer division/signs/operand order',()=>oracle('expression-evaluation', `
for a in [-(10**400+17),-(2**60+13),-7,-1,0,1,7,2**60+13,10**400+17]:
    for b in [-11,-3,-1,1,3,11]:
        want=abs(a)//abs(b)
        if (a<0)!=(b<0): want=-want
        assert eval_rpn([str(a),str(b),'/'])==want, (a,b)
assert eval_rpn(['9','4','-'])==5
assert eval_rpn(['-7','3','/'])==-2
`));
await check('kth valid ranks and invalid rank rejection',()=>oracle('kth-largest', `
import itertools
for n in range(1,6):
    for a in itertools.product([-1,0,2],repeat=n):
        for k in range(1,n+1): assert kth_largest(a,k)==sorted(a,reverse=True)[k-1]
for a,k in [([],1),([1],0),([1],-1),([1],2)]:
    try: kth_largest(a,k)
    except ValueError: pass
    else: raise AssertionError((a,k))
`));
for(const [id,fn] of [['top-k','top_k_heap'],['top-k-heap','k_largest']]) await check(`${id} exhaustive rank/output oracle`,()=>oracle(id, `
import itertools
for n in range(6):
    for a in itertools.product([-2,0,2],repeat=n):
        for k in range(-1,n+3): assert ${fn}(a,k)==(sorted(a,reverse=True)[:k] if k>0 else [])
`));
for(const id of ['running-median','two-heaps']) await check(`${id} every prefix / partition / empty query`,()=>oracle(id, `
import itertools
for a in itertools.product([-3,0,2],repeat=6):
    f=MedianFinder(); seen=[]
    for x in a:
        f.add(x); seen.append(x); s=sorted(seen); m=len(s)
        want=s[m//2] if m%2 else (s[m//2-1]+s[m//2])/2
        assert f.median()==want
        assert len(f.small) in [len(f.large),len(f.large)+1]
        assert not f.small or not f.large or -f.small[0]<=f.large[0]
try: MedianFinder().median()
except IndexError: pass
else: raise AssertionError('empty median contract')
import math
# Float overflow is outside the documented sum/float-conversion contract.
# Merely requiring finite inputs and a representable mathematical average
# would be insufficient: the intermediate sum can already become inf.
f=MedianFinder();f.add(1e308);f.add(1e308);assert math.isinf(f.median())
`));
for(const id of ['merge-sorted-data','k-way-merge']) await check(`${id} empty/duplicates/negatives merge oracle`,()=>oracle(id, `
import itertools
choices=[[],[-2],[0,0],[1,3],[-2,0,4]]
for rows in itertools.product(choices,repeat=3): assert merge_k(rows)==sorted(x for row in rows for x in row)
assert merge_k([])==[]
assert merge_k([[],[],[]])==[]
`));
await check('pair manipulation identities and safe alternative update order',()=>oracle('linked-list-pointer-manipulation', `
for n in range(9):
    h=build(list(range(n))); nodes=[]; c=h
    while c is not None: nodes.append(c); c=c.next
    r=swap_pairs(h); actual=[]; c=r
    while c is not None:
        assert c not in actual
        actual.append(c); c=c.next
    want=nodes[:]
    for i in range(0,n-1,2): want[i],want[i+1]=want[i+1],want[i]
    assert actual==want and [x.val for x in nodes]==list(range(n))
def alternative(h):
    d=Node(0,h); p=d
    while p.next is not None and p.next.next is not None:
        first=p.next; second=first.next
        p.next=second
        first.next=second.next
        second.next=first
        p=first
    return d.next
assert to_list(alternative(build([1,2,3,4,5])))==[2,1,4,3,5]
`));
await check('middle parity and second-middle convention',()=>oracle('linked-list-middle', `
for n in range(9):
    h=build(list(range(n))); r=middle(h)
    assert (None if r is None else r.val)==(n//2 if n else None)
def unsafe(h):
    s=f=h
    while f: s=s.next; f=f.next.next
    return s
for n in [1,3,5]:
    try: unsafe(build(list(range(n))))
    except AttributeError: pass
    else: raise AssertionError('odd-length crash missing')
for n in [0,2,4,6]: unsafe(build(list(range(n))))
`));
for(const id of ['linked-list-cycle-detection','fast-slow-pointers'])await check(`${id} every small cycle entry / acyclic duplicate values`,()=>oracle(id,`
for n in range(9):
    nodes=[Node(1) for _ in range(n)]
    for i in range(n-1): nodes[i].next=nodes[i+1]
    h=nodes[0] if nodes else None
    assert not has_cycle(h)
    for entry in range(n):
        nodes[-1].next=nodes[entry]
        assert has_cycle(h)
        if 'cycle_start' in globals(): assert cycle_start(h) is nodes[entry]
        nodes[-1].next=None
`));
await check('reversal preserves node identities and values',()=>oracle('linked-list-reversal',`
for n in range(9):
    nodes=[Node(i) for i in range(n)]
    for i in range(n-1): nodes[i].next=nodes[i+1]
    h=nodes[0] if nodes else None; r=reverse(h); seen=[]
    while r is not None:
        assert r not in seen; seen.append(r); r=r.next
    assert seen==nodes[::-1] and [p.val for p in nodes]==list(range(n))
`));
await check('dummy deletion / merge empty / stability / identity',()=>oracle('linked-list-dummy-nodes',`
import itertools
for n in range(7):
 for vals in itertools.product([0,1],repeat=n):
    h=build(vals); keep=[]; p=h
    while p is not None:
        if p.val!=0: keep.append(p)
        p=p.next
    r=remove_all(h,0); got=[]
    while r is not None:
        assert r not in got; got.append(r); r=r.next
    assert got==keep
`));
await check('linked merge oracle / stable left tie / empty alias',()=>oracle('linked-list-merging',`
import itertools
options=[[],[-1],[0,0],[-1,0,2]]
for av,bv in itertools.product(options,repeat=2):
    a=build(av);b=build(bv); want=sorted(av+bv); r=merge(a,b)
    assert to_list(r)==want
a=Node(1);b=Node(1);r=merge(a,b);assert r is a and r.next is b
a=build([1,2]);assert merge(a,None) is a
`));
await check('sublist reversal every valid boundary / identity',()=>oracle('in-place-linkedlist-reversal',`
for n in range(1,9):
 for p in range(1,n+1):
  for q in range(p,n+1):
    h=build(list(range(n)));nodes=[];c=h
    while c is not None: nodes.append(c);c=c.next
    c=reverse_between(h,p,q);got=[]
    while c is not None:
        assert c not in got;got.append(c);c=c.next
    assert got==nodes[:p-1]+nodes[p-1:q][::-1]+nodes[q:]
    assert [x.val for x in nodes]==list(range(n))
`));
await check('BFS exhaustive directed graphs / cycles / shared successor / disconnection',()=>oracle('bfs-queues',`
from collections import deque
for mask in range(1<<9):
 g={u:[v for v in range(3) if mask & (1<<(3*u+v))] for u in range(3)}
 for start in range(3):
    want=[]; frontier=[start]; distance={start:0}
    while frontier:
        u=frontier.pop(0);want.append(u)
        for v in g[u]:
            if v not in distance:distance[v]=distance[u]+1;frontier.append(v)
    got=bfs_levels(g,start);assert got==want and len(got)==len(set(got))
    assert [distance[u] for u in got]==sorted(distance[u] for u in got)
try: bfs_levels({},0)
except KeyError: pass
else: raise AssertionError('invalid start precondition')
`));
await check('min stack duplicates / alternating pushes and pops',()=>oracle('min-max-tracking',`
s=MinStack(); values=[]
for x in [3,1,1,2,-4,-4,9]:
    s.push(x);values.append(x);assert s.get_min()==min(values)
while values:
    assert s.get_min()==min(values)
    assert s.pop()==values.pop()
try:s.get_min()
except IndexError:pass
else:raise AssertionError('empty minimum contract')
`));
await check('deque FIFO/LIFO/empty/maxlen/rotate semantics',()=>{
  py.runPython(`from collections import deque\nd=deque([1,2],maxlen=2);d.append(3);assert list(d)==[2,3]\nd.appendleft(0);assert list(d)==[0,2]\ntry:d.insert(1,9)\nexcept IndexError:pass\nelse:raise AssertionError('bounded insert')\nd.rotate(1);assert list(d)==[2,0]\nassert d.popleft()==2 and d.pop()==0\ntry:d.popleft()\nexcept IndexError:pass\nelse:raise AssertionError('empty pop')`);
});
await check('histogram real lesson function versus all-interval brute force',()=>oracle('monotonic-stack',`
import itertools
def brute(a):
    best=0
    for left in range(len(a)):
        height=a[left]
        for right in range(left,len(a)):
            height=min(height,a[right]);best=max(best,height*(right-left+1))
    return best
for n in range(7):
 for a in itertools.product([0,1,3],repeat=n):
    before=list(a);assert largest_rectangle(a)==brute(a);assert list(a)==before
assert largest_rectangle([2,1,5,6,2,3])==10
assert largest_rectangle([1,2,3])==4
`));
await check('IPO real lesson function versus exhaustive project choice sequences',()=>oracle('two-heap-pattern',`
import itertools
def brute(requirements,profits,k,w):
    best=w
    def visit(used,left,capital):
        nonlocal best
        best=max(best,capital)
        if left:
            for i in range(len(profits)):
                if i not in used and requirements[i]<=capital:
                    visit(used|{i},left-1,capital+profits[i])
    visit(set(),k,w);return best
for requirements in itertools.product([0,1,3],repeat=3):
 for profits in itertools.product([0,1,2],repeat=3):
  for k in range(5):
   for w in range(3):
    assert maximize_capital(requirements,profits,k,w)==brute(requirements,profits,k,w)
assert maximize_capital([],[],3,7)==7
assert maximize_capital([3],[10],1,0)==0
`));
for(const x of owned.filter(x=>x.id==='monotonic-stack')) await check(`${x.title} next-greater brute-force oracle`,()=>{
  py.globals.set('__b4_code', x.code??x.walkthroughCode);
  py.runPython(`import contextlib,io,itertools\n_ns={}\nwith contextlib.redirect_stdout(io.StringIO()): exec(__b4_code,_ns)\nf=_ns.get('next_greater',_ns.get('next_greater_elements'))\nassert f is not None\nfor n in range(7):\n for a in itertools.product([-2,0,2],repeat=n):\n  expected=[next((x for x in a[i+1:] if x>a[i]),-1) for i in range(n)]\n  assert f(a)==expected`);
});
await check('heap 3.14 native max / tuple ties',()=>{
  py.runPython(`import heapq\nh=[2,-1,2,4]; heapq.heapify_max(h)\nassert [heapq.heappop_max(h) for _ in range(4)]==[4,2,2,-1]\nheapq.heappush_max(h,7); assert heapq.heappushpop_max(h,3)==7\nassert heapq.heapreplace_max(h,9)==3\ntry: heapq.heapify([(1,{'a':1}),(1,{'b':2})])\nexcept TypeError: pass\nelse: raise AssertionError('incomparable tied payload')\na,b={},{}; q=[(1,0,a),(1,1,b)]; heapq.heapify(q); assert heapq.heappop(q)[2] is a`);
});
await check('educational sift restores heap order and preserves the multiset',()=>oracle('heap-sift',`
import heapq,itertools
def valid(a):
    return all(a[(i-1)//2]<=a[i] for i in range(1,len(a)))
for n in range(6):
 for values in itertools.product([-2,0,2],repeat=n):
  for x in [-3,0,3]:
    a=list(values);heapq.heapify(a);a.append(x)
    sift_up(a,len(a)-1)
    assert valid(a) and sorted(a)==sorted([*values,x])
    expected=sorted(a)[1:]
    last=a.pop()
    if a:
        a[0]=last;sift_down(a,0,len(a))
    assert valid(a) and sorted(a)==expected
sift_up([],0);sift_down([],0,0)
`));
console.log(JSON.stringify({checks, failures},null,2));
if(failures.length) process.exitCode=1;
