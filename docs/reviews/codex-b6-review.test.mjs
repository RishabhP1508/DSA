import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadCurriculum} from '../../scripts/lib/load-curriculum.mjs';
import {runProgram} from '../../scripts/lib/pyodide-harness.mjs';
const c=await loadCurriculum();
const items=[...c.lessons.filter(x=>x.area==='DP and recursion'),...c.patterns.filter(x=>['backtracking','dynamic-programming','knapsack'].includes(x.id))];
const get=id=>items.find(x=>x.id===id), results=[];
async function check(name,fn){try{await fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:e.message});}}
await check('analysis scope excludes demonstration inputs and printing',()=>{for(const x of items)assert.equal(x.complexityExplanation.scope,'function',x.id);});
await check('factorial exact calls and prediction include initial exactly once',()=>{const x=get('dp-base-cases');assert.match(x.complexityExplanation.fixedDataNote,/5 calls/);assert.match(x.exercises.find(e=>e.id==='dpbc-predict-1').expected,/5 calls/);assert.doesNotMatch(x.concepts.edgeCases,/never reach/);});
await check('naive Fibonacci exact recurrence replaces doubling claim',()=>{const x=get('dp-recursive-calls');assert.match(x.complexityExplanation.time.explanation,/2.?F/);assert.doesNotMatch(x.experiments.join(' '),/double/);});
await check('immutable prefixes retained across stack are counted',()=>{assert.equal(get('dp-backtracking').complexityExplanation.space.bound,'O(n^2)');assert.match(get('dp-backtracking').codeExplanations.find(e=>e.line===6).explanation,/reference.*immutable string/i);});
await check('subset repeated-index experiment warns nontermination',()=>assert.match(get('dp-subsets').experiments.join(' '),/RecursionError|does not terminate/));
await check('combinations loop prunes unfillable prefixes',()=>assert.match(get('dp-combinations').code,/n - \(k - len\(path\)\) \+ 2/));
await check('permutation internal scans and failure description are correct',()=>{assert.match(get('dp-permutations').complexityExplanation.costModel,/scan.*n|n.*scan/i);assert.doesNotMatch(get('dp-permutations').experiments.join(' '),/too short/);assert.doesNotMatch(get('dp-permutations').exercises.find(e=>e.id==='dpperm-fix-1').prompt,/truncated/);});
await check('stock retains constant space without a copied suffix',()=>assert.doesNotMatch(get('dp-state-transitions').code,/prices\[1:\]/));
await check('house robber uses an actual greedy counterexample',()=>{const ex=get('dp-house-robber').exercises.find(e=>e.id==='dphr-choose-1');assert.match(ex.prompt,/4,\s*5,\s*4/);assert.match(ex.expected,/8/);});
await check('N Queens includes scan overhead and correct diagonal direction',()=>{const x=get('dp-n-queens');assert.equal(x.complexityExplanation.time.bound,'O(N*N!)');assert.match(x.explanation,/row − col[^\n]*\\/);});
await check('DP state storage and enumeration are distinguished',()=>{assert.match(get('dp-1d-2d').explanation,/compression/);assert.doesNotMatch(get('dynamic-programming').whyItHelps,/turning exponential recursion into polynomial time/);assert.match(get('dynamic-programming').exercises.find(e=>e.id==='pat-dp-choose-1').expected,/reconstruct|augment|guide/);});
for(const x of items)await check('sample '+x.id,async()=>{const r=await runProgram(x.code??x.walkthroughCode);assert.equal(r.status,'completed',JSON.stringify(r.error));assert.equal(r.stdout,x.expectedOutput??x.walkthroughExpectedOutput);});
for(const x of items)for(const ex of x.exercises.filter(e=>e.tests))await check('exercise '+x.id+':'+ex.id,async()=>{const r=await runProgram((ex.preludeCode??'')+'\n'+ex.expected+'\n'+ex.tests);assert.equal(r.status,'completed',JSON.stringify(r.error));});
async function oracle(id,code){await check('boundary '+id,async()=>{const x=get(id),r=await runProgram((x.code??x.walkthroughCode)+'\n'+code);assert.equal(r.status,'completed',JSON.stringify(r.error));assert.match(r.stdout,/ORACLE OK\n$/);});}
await oracle('dp-base-cases',`import math
for n in range(8): assert fact(n) == math.factorial(n)
print('ORACLE OK')`);
await oracle('dp-recursive-calls',`for n in range(7):
    calls = 0
    result = fib(n)
    a,b = 0,1
    for _ in range(n+1): a,b=b,a+b
    assert calls == 2*a-1
print('ORACLE OK')`);
await oracle('dp-backtracking',`import math
for n in range(4):
    got = gen_parens(n)
    assert len(got) == math.comb(2*n,n)//(n+1)
    assert len(got) == len(set(got))
    for s in got:
        balance=0
        for ch in s:
            balance += 1 if ch == '(' else -1
            assert balance >= 0
        assert balance == 0 and len(s)==2*n
print('ORACLE OK')`);
for(const id of ['dp-subsets','backtracking'])await oracle(id,`for a in [[],[1],[1,2,3]]:
    before=a[:]
    got=subsets(a)
    expect={tuple(a[i] for i in range(len(a)) if mask&(1<<i)) for mask in range(1<<len(a))}
    assert {tuple(x) for x in got} == expect and len(got)==len(expect)
    assert a==before
    assert len({id(x) for x in got})==len(got)
print('ORACLE OK')`);
await oracle('dp-permutations',`import math
for a in [[],[1],[1,2],[1,2,3]]:
    got=permutations(a)
    assert len(got)==math.factorial(len(a))
    assert len({tuple(x) for x in got})==len(got)
    assert all(sorted(x)==a for x in got)
print('ORACLE OK')`);
await oracle('dp-combinations',`import math
for n,k in [(0,0),(4,0),(4,1),(4,2),(4,4),(3,4),(6,6)]:
    got=combine(n,k)
    assert len(got)==(math.comb(n,k) if k<=n else 0)
    assert len({tuple(x) for x in got})==len(got)
    assert all(len(x)==k and x==sorted(set(x)) for x in got)
print('ORACLE OK')`);
for(const id of ['dp-memoization','dp-tabulation','dynamic-programming'])await oracle(id,`a,b=0,1
for n in range(12):
    assert fib(n)==a
    a,b=b,a+b
assert fib(10)==55
print('ORACLE OK')`);
await oracle('dp-memoization',`fib.cache_clear()
assert fib(10)==55
info=fib.cache_info()
assert info.misses==11 and info.hits==8 and info.currsize==11
assert fib(10)==55 and fib.cache_info().hits==9
print('ORACLE OK')`);
await oracle('dp-1d-2d',`import math
for m,n in [(1,1),(1,5),(4,1),(2,3),(3,3)]:
    assert unique_paths(m,n)==math.comb(m+n-2,m-1)
print('ORACLE OK')`);
await oracle('dp-knapsack',`for weights,values,W in [([],[],0),([],[],5),([1],[2],0),([2,3],[3,4],5),([4,3,3],[5,3,3],6)]:
    expect=max(sum(values[i] for i in range(len(weights)) if mask&(1<<i)) for mask in range(1<<len(weights)) if sum(weights[i] for i in range(len(weights)) if mask&(1<<i))<=W)
    assert knapsack(weights,values,W)==expect
print('ORACLE OK')`);
await oracle('dp-subsequences',`for s,t,want in [('', '',True),('', 'abc',True),('a','',False),('aaa','aa',False),('aa','abaa',True),('aec','abcde',False),('ace','abcde',True)]:
    assert is_subsequence(s,t) is want
print('ORACLE OK')`);
await oracle('dp-state-transitions',`for a in [[],[5],[7,1,5,3,6,4],[7,6,1],[1,5,2]]:
    expect=max([0]+[a[j]-a[i] for i in range(len(a)) for j in range(i+1,len(a))])
    assert max_profit(a)==expect
print('ORACLE OK')`);
await oracle('dp-climbing-stairs',`expect=[1,1,2,3,5,8,13]
for n,v in enumerate(expect): assert climb(n)==v
print('ORACLE OK')`);
await oracle('dp-house-robber',`for a in [[],[5],[1,2],[4,5,4],[2,7,9,3,1]]:
    expect=max(sum(a[i] for i in range(len(a)) if mask&(1<<i)) for mask in range(1<<len(a)) if not(mask&(mask<<1)))
    assert rob(a)==expect
# Richest-compatible greedy succeeds on old scenario; fails on new one.
def greedy(a):
    blocked=set(); total=0
    for i in sorted(range(len(a)),key=lambda i:a[i],reverse=True):
        if i not in blocked:
            total+=a[i]; blocked.update([i-1,i,i+1])
    return total
assert greedy([2,7,9,3,1])==12
assert greedy([4,5,4])==5 and rob([4,5,4])==8
print('ORACLE OK')`);
await oracle('dp-grid-paths',`def all_costs(g,r=0,c=0):
    if r==len(g)-1 and c==len(g[0])-1: return [g[r][c]]
    out=[]
    if r+1<len(g): out += [g[r][c]+v for v in all_costs(g,r+1,c)]
    if c+1<len(g[0]): out += [g[r][c]+v for v in all_costs(g,r,c+1)]
    return out
for g in [[[5]],[[1,2,3]],[[1],[2],[3]],[[1,-2],[3,1]],[[1,3,1],[1,5,1],[4,2,1]]]: assert min_path_sum(g)==min(all_costs(g))
print('ORACLE OK')`);
await oracle('dp-grid-paths',`assert min_path_sum([])==0 and min_path_sum([[]])==0
for grid in [[[],[1]], [[1],[2,3]]]:
    try: min_path_sum(grid)
    except ValueError: pass
    else: raise AssertionError('ragged grid must reject')
print('ORACLE OK')`);
await check('memoized comparison retains linear cold cost',()=>{const row=get('dp-recursive-calls').complexity.find(r=>r.operation==='memoized Fibonacci');assert.equal(row.worst,'O(n)');});
await oracle('dp-coin-change',`def bfs(coins,A):
    if A==0: return 0
    seen={0}; frontier=[0]; depth=0
    while frontier:
        depth+=1; nxt=[]
        for a in frontier:
            for c in coins:
                b=a+c
                if b==A: return depth
                if b<A and b not in seen: seen.add(b); nxt.append(b)
        frontier=nxt
    return -1
for coins,A in [([],0),([],3),([2],3),([1,3,4],6),([1,2,5],11),([2,4],8)]: assert coin_change(coins,A)==bfs(coins,A)
print('ORACLE OK')`);
await oracle('dp-lis',`for a in [[],[7],[7,7],[3,2,1],[1,2,3,0],[0,1,0,3,2,3]]:
    seqs=[list(a[i] for i in range(len(a)) if mask&(1<<i)) for mask in range(1<<len(a))]
    assert lis(a)==max(len(s) for s in seqs if all(s[i]<s[i+1] for i in range(len(s)-1)))
print('ORACLE OK')`);
await oracle('dp-lcs',`def seqs(s): return {''.join(s[i] for i in range(len(s)) if mask&(1<<i)) for mask in range(1<<len(s))}
for a,b in [('', ''),('', 'abc'),('a',''),('abc','abc'),('abc','def'),('abcde','ace'),('aba','baa')]: assert lcs(a,b)==max(map(len,seqs(a)&seqs(b)))
print('ORACLE OK')`);
await oracle('dp-divide-and-conquer',`for a in [[1],[-1,-2,-3],[-2,-1],[1,-2,3,4,-1],[-2,1,-3,4,-1,2,1,-5,4]]:
    assert max_subarray(a)==max(sum(a[i:j]) for i in range(len(a)) for j in range(i+1,len(a)+1))
print('ORACLE OK')`);
await oracle('dp-n-queens',`for n,v in [(0,1),(1,1),(2,0),(3,0),(4,2)]: assert n_queens(n)==v
print('ORACLE OK')`);
await oracle('knapsack',`for a in [[],[0,0],[1],[1,1],[1,2,5],[1,5,11,5],[2,2,3,5]]:
    total=sum(a)
    want=total%2==0 and any(sum(a[i] for i in range(len(a)) if mask&(1<<i))*2==total for mask in range(1<<len(a)))
    assert can_partition(a)==want
print('ORACLE OK')`);
for(const [id,call] of [['dp-base-cases','fact(-1)'],['dp-recursive-calls','fib(-1)'],['dp-memoization','fib(-1)'],['dp-tabulation','fib(-1)'],['dp-climbing-stairs','climb(-1)']])await oracle(id,`try: ${call}
except ValueError: pass
else: raise AssertionError('negative index must reject')
print('ORACLE OK')`);
await oracle('dp-1d-2d',`assert unique_paths(0,3)==0 and unique_paths(3,0)==0
for m,n in [(-1,3),(3,-1)]:
    try: unique_paths(m,n)
    except ValueError: pass
    else: raise AssertionError('negative dimension must reject')
print('ORACLE OK')`);
await oracle('dp-knapsack',`for weights,values,W in [([1],[],2),([0],[2],2),([-1],[2],2),([],[],-1)]:
    try: knapsack(weights,values,W)
    except ValueError: pass
    else: raise AssertionError('invalid knapsack input must reject')
print('ORACLE OK')`);
await oracle('dp-coin-change',`for coins,A in [([0],2),([-1],2),([1],-1)]:
    try: coin_change(coins,A)
    except ValueError: pass
    else: raise AssertionError('invalid coin input must reject')
print('ORACLE OK')`);
await oracle('dp-divide-and-conquer',`try: max_subarray([])
except ValueError: pass
else: raise AssertionError('nonempty subarray contract must reject empty input')
print('ORACLE OK')`);
const output={runtime:'bundled Pyodide 314.0.7 / CPython 3.14.2',results,passed:results.filter(x=>x.passed).length,total:results.length};
fs.writeFileSync(process.argv[2]??'docs/reviews/codex-b6-test-results.json',JSON.stringify(output,null,2));
console.log(`${output.passed}/${output.total} checks passed`);
for(const r of results.filter(x=>!x.passed))console.log(`${r.name}: ${r.error}`);
if(output.passed!==output.total)process.exitCode=1;
