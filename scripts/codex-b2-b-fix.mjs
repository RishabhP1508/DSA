// One-time authoring correction; evidence/sign-off are deliberately separate.
import fs from 'node:fs';
import ts from 'typescript';
import {loadCurriculum} from './lib/load-curriculum.mjs';
const {lessons,patterns}=await loadCurriculum();
if(lessons.find(x=>x.id==='count-set-bits').code.includes('if n < 0:')) throw Error('One-time B2-B codemod already applied; refusing to duplicate edits.');
function setProps(file, values, code) {
  let source=fs.readFileSync(file,'utf8');
  const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);
  let object,codeNode;
  function visit(n){
    if(ts.isVariableDeclaration(n)&&n.initializer){
      if(ts.isObjectLiteralExpression(n.initializer)&&n.initializer.properties.some(p=>p.name?.getText(tree)==='id')) object=n.initializer;
      if(n.name.getText(tree)==='code'||n.name.getText(tree)==='walkthroughCode')codeNode=n.initializer;
    }
    ts.forEachChild(n,visit);
  } visit(tree);
  const edits=[];
  for(const [key,value] of Object.entries(values)) {
    const p=object.properties.find(p=>p.name?.getText(tree)===key);
    if(!p)throw Error('missing '+file+':'+key);
    const a=p.initializer??p;edits.push({start:a.getStart(tree),end:a.end,text:p.initializer?JSON.stringify(value,null,2):key+': '+JSON.stringify(value,null,2)});
  }
  if(code!==undefined)edits.push({start:codeNode.getStart(tree),end:codeNode.end,text:'`'+code.replaceAll('\\','\\\\').replaceAll('`','\\`').replaceAll('${','\\${')+'`'});
  for(const e of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,e.start)+e.text+source.slice(e.end);
  fs.writeFileSync(file,source);
}
function get(kind,id){return structuredClone((kind==='lesson'?lessons:patterns).find(x=>x.id===id));}
function save(kind,id,item,keys,code){setProps(`src/content/${kind==='lesson'?'lessons':'patterns'}/${id}.ts`,Object.fromEntries(keys.map(k=>[k,item[k]])),code);}
function ref(url,title,section,claims){return {url,title,section,topic:'codex/b2-b',purpose:'Verify the specific semantics and conditions used in this lesson.',verifiedClaims:claims,accessDate:'2026-10-10'};}
const numeric=ref('https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types','Python integer bit operations','Bit operations; int.bit_count', ['Python integer bit operations use infinite-sign-extension semantics; bit_count counts ones in the absolute value.']);
const precedence=ref('https://docs.python.org/3.14/reference/expressions.html#operator-precedence','Python expression precedence','6.10 and 6.17',['Bitwise operations bind more tightly than comparisons.']);
const prefixRef=ref('https://usaco.guide/silver/prefix-sums','USACO Guide: prefix sums','Exclusive prefix sums, adapted to 0-based endpoints',['Range sums can be recovered from two prefix totals.']);
const pointersRef=ref('https://usaco.guide/silver/two-pointers','USACO Guide: two pointers','Sum of Two Values; Sliding Window',['Sorted opposite-end pointers move according to the current sum; suitable monotone windows advance each boundary at most n times.']);
{
 const l=get('lesson','bit-logical-ops');
 l.explanation=l.explanation.replace("a negative sum's carry never runs off a fixed width and the loop would spin forever",'some signed inputs can carry forever: -1 + 1 is a counterexample, even though its sum is zero; negative sums do not universally fail');
 l.explanation=l.explanation.replace('after each step `mask = 0xFFFFFFFF`, keep `a &= mask`','set `mask = 0xFFFFFFFF` and update both values simultaneously with `a, b = (a ^ b) & mask, ((a & b) << 1) & mask`');
 l.explanation+='\n\nThis returns a 32-bit signed result: it agrees with mathematical addition when the result fits that range, and wraps modulo 2**32 outside it. Both right-hand expressions must use the old a and b. A w-bit Python result also needs O(w) storage; constant time/space here means bounded-size operands.';
 l.concepts.commonMistakes=l.concepts.commonMistakes.replace('& binds looser than ==, so parenthesize','& binds tighter than ==; parenthesize the masked value for readability');
 l.review=l.review.replace("parenthesize because `&` has low precedence",'parenthesize masked values for readability; bitwise operators bind more tightly than comparisons');
 l.complexity[0]={operation:'Bitwise op on w-bit Python integers',best:'O(w)',average:'O(w)',worst:'O(w)',space:'O(w)',note:'Linear upper bounds in operand/result width. Bounded-size operands give O(1) time/space.'};
 l.complexityExplanation.costModel='A bounded-size Python bitwise operation is constant work; the interpreter may execute multiple instructions. Scaling arbitrary-precision operands to w bits gives linear work/storage upper bounds.';
 l.complexityExplanation.time.explanation=l.complexityExplanation.time.explanation.replace('each of &, |, ^ is a single constant-time CPU operation','each of &, |, ^ takes bounded work in this Python example');
 const e=l.exercises.find(e=>e.id==='bit-log-sum-1');
 e.prompt=e.prompt.replace('using a = a ^ b (sum without carry) and carry = (a & b) << 1','computing both a ^ b (sum without carry) and (a & b) << 1 from the OLD operands');
 e.expected=e.expected.replace("a negative sum's carry never falls off a fixed width, so the loop would run forever",'some signed inputs, such as -1 + 1, have a carry that propagates forever without masking (not every negative sum fails)');
 l.references.push(numeric,precedence);
 save('lesson',l.id,l,['explanation','concepts','review','complexity','complexityExplanation','exercises','references']);
}
{
 const l=get('lesson','bit-shifts');
 l.explanation=l.explanation.replace('**O(w)** for w-bit big integers, since bits are physically moved','**O(w + k)** time and space as an upper bound for left-shifting a w-bit Python integer by k; the result can have w+k bits. A right shift has an O(w) upper bound');
 l.concepts.tradeoffs='For bounded-size operands and shift distances, shifts take constant work. Relative performance of shifts versus * or // depends on operands and implementation; choose shifts to express bit intent.';
 l.complexity=[{operation:'Left shift, w input bits, distance k',best:'O(w+k)',average:'O(w+k)',worst:'O(w+k)',space:'O(w+k)',note:'Upper bound for Python arbitrary-precision result allocation; bounded widths/distances are constant work.'}];
 l.complexityExplanation.costModel='The displayed widths and shift distances are fixed. Python does not perform one hardware instruction for all arbitrary-precision shifts; a left result may need w+k bits.';
 l.complexityExplanation.time.explanation='Two shifts of small fixed literals take constant work. If input width w and left distance k scale, producing up to w+k result bits costs O(w+k) work/storage; right shifting has an O(w) work upper bound.';
 l.complexityExplanation.assumptions=['Operands and shift distances stay bounded in this example.','k is a nonnegative integer; a negative distance raises ValueError.'];
 l.review=l.review.replace('(O(w) for big integers)','(a Python left shift can require O(w+k) time/space for input width w and distance k)');
 l.exercises[0].prompt+=' Assume k is a nonnegative integer.';
 l.references.push(numeric);
 save('lesson',l.id,l,['explanation','concepts','complexity','complexityExplanation','review','exercises','references']);
}
{
 const l=get('lesson','bit-check-set-clear');
 l.explanation=l.explanation.replace('Every operation is **O(1)** and modifies only the targeted bit','For bounded-size integers and positions, each expression takes **O(1)** work and returns a new integer with only the targeted bit changed. It does not mutate the original n. For arbitrary Python widths, masks/results need O(w+i) work/storage upper bounds');
 l.concepts.tradeoffs='Constant work for bounded-size integers and bit positions; Python big integers and high positions require larger masks/results. Named fields may be easier to read.';
 l.concepts.edgeCases+=' Bit positions must be nonnegative integers. Negative values follow Python sign-extension semantics.';
 l.review=l.review.replace('each **O(1)** and touching only bit i','each **O(1)** for bounded-size operands/positions and touching only bit i in the returned value');
 l.references.push(numeric);
 save('lesson',l.id,l,['explanation','concepts','review','references']);
}
{
 const l=get('lesson','count-set-bits');
 const code=l.code.replace('    count = 0','    if n < 0:\n        raise ValueError("count_bits requires a nonnegative integer")\n    count = 0');
 l.codeExplanations=l.codeExplanations.map(e=>({...e,line:e.line>=3?e.line+2:e.line}));
 l.codeExplanations.splice(2,0,{line:3,executable:true,explanation:'Reject negative input: the bit-clearing loop would not reach zero under sign extension.'},{line:4,executable:true,explanation:'Report the nonnegative-integer contract clearly.'});
 for(const d of l.complexityExplanation.derivation)d.lines=d.lines.map(n=>n>=3?n+2:n);
 for(const c of l.complexityExplanation.counters)c.countLines=c.countLines.map(n=>n>=3?n+2:n);
 l.complexityExplanation.counters[0].definition='iterations of the bit-clearing update (line 7)';
 l.explanation+='\n\nThe explicit loop requires a nonnegative integer: negative Python integers have an indefinitely extended sign and repeated clearing does not reach zero. By contrast, int.bit_count() counts the absolute value, so (-3).bit_count() is 2. The O(s) iteration count assumes constant-cost bounded-size operations; with w-bit big integers a conservative O(s*w) time and O(w) working-storage bound applies. Built-ins compute an answer without your handwritten loop, but not for zero computational cost.';
 l.explanation=l.explanation.replace('gives you the answer for free','provides a convenient built-in answer').replace('`n & (n-1) == 0`','`n > 0 and (n & (n-1)) == 0`');
 l.concepts.edgeCases+=' This loop rejects negatives; bit_count instead counts the absolute value. The power-of-two predicate must exclude zero.';
 l.experiments=l.experiments.map(s=>s.replace('Test n & (n-1) == 0','Test n > 0 and (n & (n-1)) == 0'));
 l.complexityExplanation.time.case='worst';
 l.complexityExplanation.assumptions.push('n is a nonnegative integer; the displayed operations use bounded-size values.');
 l.review+=' Require nonnegative input for the loop, and n > 0 for a power-of-two test; int.bit_count uses the absolute value.';
 l.references.push(numeric);
 save('lesson',l.id,l,['codeExplanations','explanation','concepts','experiments','complexityExplanation','review','references'],code);
}
{
 const l=get('lesson','caching-seen');
 l.explanation=l.explanation.replace('each `fib(k)` is computed **once**','each non-base `fib(k)` is computed and cached **once**').replace('one entry per distinct argument','one entry per non-base argument');
 l.explanation+='\n\nThe base cases are not cached in this program: fib(0) and fib(1) may be called repeatedly, but each takes constant work. For a general memoized recurrence, count states AND work per subproblem (including transitions), not just states. Linear Fibonacci time/space here is a bounded-value unit-cost model with expected hashing; growing Fibonacci integers use more bits and can give O(n²) bit work/storage. Large n also reaches Python’s recursion limit; iteration avoids that stack. A recursive call is a function calling itself, and a base case stops that chain.';
 l.vocabulary.find(v=>v.term==='lru_cache').definition='A decorator in Python’s functools standard-library module that caches results; its size policy controls evictions.';
 l.concepts.edgeCases='The base cases in this version are checked before cache lookup and are not stored. Cache lookup before an explicit base case can also be correct. Separate top-level calls share no cache unless it is passed or external; large n can reach the recursion limit.';
 l.complexity[0].worst='O(n²)';l.complexity[0].note='Expected O(n) in a bounded-value unit-cost model; hash-collision or growing-integer costs need separate bounds.';
 l.complexityExplanation.time.case='expected';
 l.complexityExplanation.time.explanation='There are n+1 possible indices 0..n. The n-1 non-base states are computed and cached once; base calls are not cached but remain constant work. With bounded-value arithmetic and expected constant-cost hashing, total work is O(n). General memoization sums each state’s transition/computation cost plus reuse costs; it is not automatically linear in the number of states.';
 l.complexityExplanation.costModel='Bounded-value unit-cost model with expected O(1) memo operations. Arbitrary-precision Fibonacci arithmetic and total stored bits grow with n.';
 l.complexityExplanation.space.inputOutputNote='O(n) cached bounded-size values and O(n) frames. In a bit-cost model, cached Fibonacci values can occupy O(n²) total bits.';
 l.complexityExplanation.fixedDataNote='For fib(10), states 2..10 are computed and cached once; base states 0 and 1 are returned without caching. The output is 55.';
 l.exercises.find(e=>e.id==='cache-choose-1').expected='Overlapping subproblems motivate memoization. Total work sums the work per subproblem (including its transitions) once, plus the cost of cache reuses. Fibonacci has constant work per state in a bounded-value model, so expected O(n); other recurrences can have more transitions.';
 l.references=l.references.filter(r=>!r.url.includes('lecture-notes/'));
 l.references.push(ref('https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html','Runestone: dynamic programming','Repeated coin-change calls and result caching',['Caching prior subproblem results avoids repeating their computation.']),ref('https://docs.python.org/3.14/library/functools.html#functools.lru_cache','Python functools caching','lru_cache; hashable arguments and eviction',['lru_cache caches results keyed by hashable arguments, with a configurable size limit.']));
 save('lesson',l.id,l,['explanation','vocabulary','concepts','complexity','complexityExplanation','exercises','references']);
}
{
 const l=get('lesson','prefix-sums-map');
 l.explanation=l.explanation.replace('which is exactly where the fixed-size sliding window fails','with no fixed width. A fixed-size window also works with negative values, but it solves a different question: a specified width, not this arbitrary-length count');
 l.explanation=l.explanation.replace("a sliding window's monotonic assumption breaks with negative numbers","a sum-threshold VARIABLE-size window's monotonic assumption can break with negative numbers");
 l.concepts.tradeoffs='Expected O(n) time and O(n) space for arbitrary-length target-sum counting. Fixed-width windows handle negative numbers too; a sum-threshold variable window needs a suitable monotone condition.';
 l.complexity[0].worst='O(n²)';l.complexity[0].note='Expected linear hashing; pathological collisions can yield quadratic work.';
 l.complexityExplanation.space.explanation=l.complexityExplanation.space.explanation.replace('up to n distinct','up to n+1 distinct');
 l.complexityExplanation.space.inputOutputNote=l.complexityExplanation.space.inputOutputNote.replace('up to n)','up to n+1)');
 l.complexityExplanation.derivation.find(d=>d.dimension==='space').description='The map holds at most n+1 prefix sums, including the empty prefix.';
 l.complexityExplanation.tradeoffs='A fixed-size window is O(n)/O(1) for its fixed-width objective, including negative values. Prefix counting handles arbitrary lengths and exact targets at O(n) storage; sum-threshold variable windows need monotonicity.';
 l.prediction=[{atEventIndex:0,prompt:'Why does prefix-counting handle negatives, and why is a fixed-width window a different problem?',answer:'Prefix differences work without monotonicity. Fixed-width windows work with negatives too, but examine only one length; this task counts all lengths. Sum-threshold variable windows can lose their shrink/grow guarantee with negatives.',explanation:'Separate the objective (fixed width versus all lengths) from the monotonicity condition used by variable-size sum windows.'}];
 l.review=l.review.replace('where fixed-size windows fail','sum-threshold variable windows can fail; fixed-size windows still work with negatives for their fixed-width objective');
 l.references=l.references.filter(r=>!r.url.includes('prefix_sum.html'));l.references.push(prefixRef);
 save('lesson',l.id,l,['explanation','concepts','complexity','complexityExplanation','prediction','review','references']);
}
{
 const l=get('lesson','value-to-index');
 l.complexity[0].worst='O(n²)';l.complexity[0].note='Expected O(n) with bounded-size keys; hash collisions can cause O(n²) work.';
 l.complexityExplanation.time.case='expected';
 l.complexityExplanation.tradeoffs='Iterative in-place heapsort then two pointers gives O(n log n) time/O(1) auxiliary space if only values matter and reordering is allowed. Python list.sort can need O(n) temporary storage. To retain original positions while sorting, decorate values with indices using O(n) storage. Hashing preserves original indices directly with expected O(n) time/O(n) space.';
 l.concepts.tradeoffs=l.complexityExplanation.tradeoffs;
 l.references.push(pointersRef);
 save('lesson',l.id,l,['complexity','complexityExplanation','concepts','references']);
}
{
 const l=get('lesson','kmp');
 const code=l.code.replace('        return []','        return list(range(len(text) + 1))');
 l.concepts.edgeCases='Empty pattern → all boundaries 0..len(text), by the convention used in both this example and its exercise. A longer pattern has no matches. Overlapping occurrences are reported.';
 l.codeExplanations.find(e=>e.line===21).explanation='Handle the empty pattern under the explicit boundary-match convention.';
 l.codeExplanations.find(e=>e.line===22).explanation='Return every boundary position from 0 through len(text).';
 l.vocabulary.find(v=>v.term==='No text backtracking').definition='i never decreases; linear time also requires bounding j’s fallback steps against its prior increments.';
 l.explanation=l.explanation.replace('Because `i` only ever moves **forward**, the total work is','The text index i never decreases, and every j fallback reduces a quantity that only increases once per matching advance. This amortized bound, not forward movement alone, makes the total work');
 l.bindings=[{variable:'text',model:'string',overlays:[{role:'pointer',label:'i (text)',source:'i'}]},{variable:'pattern',model:'string',overlays:[{role:'pointer',label:'j (pattern)',source:'j'}]}];
 save('lesson',l.id,l,['concepts','codeExplanations','vocabulary','explanation','bindings'],code);
}
{
 const p=get('pattern','sliding-window');
 const code=`# Largest sum of exactly k consecutive elements, negatives allowed.
def max_sum_k(nums, k):
    if not 1 <= k <= len(nums):
        raise ValueError("k must select a nonempty window")
    window = 0
    for j in range(k):
        window += nums[j]
    best = window
    left, right = 0, k - 1
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        left, right = i - k + 1, i
        best = max(best, window)
    return best

print(max_sum_k([2, 1, 5, 1, 3, 2], 3))`;
 const explanations=['Comment: fixed-width maximum sum, including negative values.','Define max_sum_k.','Validate that a nonempty width fits the input.','Report invalid width.','Begin explicit accumulation without a copied slice.','Visit each of the first k indices.','Add this first-window value.','Seed the best with the first window.','Record inclusive first-window boundaries.','Advance the entering index through the remaining elements.','Add the entering value and subtract the leaving value.','Record the newly completed window’s inclusive bounds.','Retain the largest completed-window sum.','Return the best sum.','Blank line.','The best width-three window sums to 9.'];
 p.codeExplanations=explanations.map((explanation,i)=>({line:i+1,executable:![0,14].includes(i),explanation}));
 p.complexityExplanation.scope='operation';
 p.complexityExplanation.time.explanation='The explicit first-window loop runs k times; the slide loop runs n-k times with bounded-value updates. O(k)+O(n-k)=O(n).';
 p.complexityExplanation.space.inputOutputNote='The input is supplied to max_sum_k. No slice is allocated; scalar working state is O(1) in a bounded-value unit-cost model.';
 p.complexityExplanation.derivation=[{lines:[6,7],description:'Explicit first-window accumulation.',cost:'O(k)',dimension:'time'},{lines:[10,11,12,13],description:'n-k constant-cost slides.',cost:'O(n)',dimension:'time'},{lines:[5,8,9],description:'Constant-size scalar working state; no input copy.',cost:'O(1)',dimension:'space'}];
 p.complexityExplanation.counters=[{label:'slides',definition:'completed slide updates',countLines:[11]}];
 p.bindings=[{variable:'nums',model:'array',overlays:[{role:'boundary',label:'window start',source:'left'},{role:'boundary',label:'window end',source:'right'},{role:'total',label:'sum',source:'window'},{role:'total',label:'best',source:'best'}]}];
 p.alternatives[0]='Prefix sums — valid for fixed-width sums too (including negatives) with O(n) storage. Prefix sums plus a frequency map are useful for arbitrary-length exact-target counts; distinguish the objective from variable-window monotonicity.';
 p.conditions.push('Maximum/minimum window aggregates need an appropriate structure such as a monotonic deque; an ordinary running sum does not maintain them.');
 p.summary='Maintain a contiguous window with incrementally updated state; sums have constant-cost updates, while window max/min needs a suitable data structure.';
 p.references=[pointersRef,prefixRef];
 save('pattern',p.id,p,['codeExplanations','complexityExplanation','bindings','alternatives','conditions','summary','references'],code);
}
{
 const p=get('pattern','kadane');
 const code=p.walkthroughCode.replace('    for x in nums[1:]:','    for i in range(1, len(nums)):\n        x = nums[i]');
 p.codeExplanations=p.codeExplanations.map(e=>({...e,line:e.line>=6?e.line+1:e.line}));
 p.codeExplanations.find(e=>e.line===5).explanation='Visit indices 1..n-1 without copying a list slice.';
 p.codeExplanations.splice(5,0,{line:6,executable:true,explanation:'Read the current value in constant time.'});
 p.bindings[0].overlays=[{role:'pointer',label:'i',source:'i'},{role:'total',label:'cur',source:'cur'},{role:'total',label:'best',source:'best'}];
 p.complexityExplanation.scope='operation';
 p.complexityExplanation.space.inputOutputNote='The existing input list is not copied. The two rolling totals and index use constant auxiliary slots under bounded-value arithmetic.';
 p.complexityExplanation.time.explanation='The n-1 remaining indices each perform bounded-value addition/comparisons, so worst-case O(n) in this unit-cost model.';
 for(const d of p.complexityExplanation.derivation)d.lines=d.lines.map(n=>n>=6?n+1:n);
 p.complexityExplanation.counters=[{label:'elements scanned',definition:'current value reads',countLines:[6]}];
 p.references=[ref('https://cp-algorithms.com/others/maximum_average_segment.html','CP-Algorithms: maximum subarray','Algorithm 2: Kadane',['The best running sum can restart after a negative prefix; a one-pass algorithm uses constant working state.'])];
 p.exercises.find(e=>e.id==='pat-kadane-fix-1').expected=p.exercises.find(e=>e.id==='pat-kadane-fix-1').expected.replace('    for x in nums[1:]:','    for i in range(1, len(nums)):\n        x = nums[i]');
 save('pattern',p.id,p,['codeExplanations','bindings','complexityExplanation','references','exercises'],code);
}
{
 const p=get('pattern','prefix-sums-hashmap');
 const code=p.walkthroughCode.replace('seen[prefix - k]','seen.get(prefix - k, 0)');
 p.whyItHelps=p.whyItHelps.replace('(i, j]','[i, j)').replace('an **O(1) hashmap lookup**','an **expected O(1) hashmap lookup**');
 p.alternatives[0]='Fixed-size windows work with negatives for a fixed-width objective. Sum-threshold VARIABLE-size windows need monotonicity; for arbitrary-length target-sum counting, prefix counts remain correct with negatives and zeros.';
 p.complexityExplanation.assumptions[1]='A sum-threshold variable window may fail with negatives; a fixed-width window still works for its different objective.';
 p.complexityExplanation.tradeoffs='Prefix-counting supports arbitrary-length target sums and negative values, using O(n) storage. Fixed windows solve specified-width questions, including negative values; variable-size sum windows require a suitable monotone condition.';
 p.codeExplanations.find(e=>e.line===11).explanation='Look up the number of earlier complement prefixes, using zero without inserting a missing key.';
 p.references=[prefixRef,ref('https://docs.python.org/3.14/library/stdtypes.html#dict.get','Python dict.get','Dictionary methods',['get returns its default without inserting a missing key.'])];
 save('pattern',p.id,p,['whyItHelps','alternatives','complexityExplanation','codeExplanations','references'],code);
}
{
 const p=get('pattern','matrix-traversal');
 const code=p.walkthroughCode.replace('    res = []','    if not matrix:\n        return []\n    res = []');
 p.codeExplanations=p.codeExplanations.map(e=>({...e,line:e.line>=4?e.line+2:e.line}));
 p.codeExplanations.splice(3,0,{line:4,executable:true,explanation:'Handle the empty outer list before reading its first row.'},{line:5,executable:true,explanation:'Return empty output for the empty matrix.'});
 for(const d of p.complexityExplanation.derivation)d.lines=d.lines.map(n=>n>=4?n+2:n);
 p.complexityExplanation.counters=[{label:'cells visited',definition:'appends across all four sides',countLines:[11,14,18,22]}];
 p.complexityExplanation.scope='operation';
 p.complexityExplanation.time.explanation='For a rectangular nonempty m-by-n matrix, each cell is appended once across the four side loops: O(m*n). Empty outer lists and zero-width rectangular matrices return empty output in O(1). Ragged rows are outside this contract.';
 p.conditions.push('The spiral input is rectangular; in-place transpose-plus-reverse 90-degree rotation requires a square matrix. Rectangular rotations change shape.');
 save('pattern',p.id,p,['codeExplanations','complexityExplanation','conditions'],code);
}
{
 const p=get('pattern','cyclic-sort');
 const code=p.walkthroughCode.replace('if j < n and','if 0 <= j < n and');
 p.whyItHelps=p.whyItHelps.replace('Each number reaches its slot in at most one swap','Each successful swap permanently fixes at least one target slot; a displaced value may move more than once');
 p.conditions[0]='The single-missing example requires n distinct integer values from 0..n. Other range problems need their own mapping, bounds, and duplicate rules.';
 p.conditions[1]='Require 0 <= j < n before indexing, and skip equal values to avoid useless duplicate swaps. Negative Python indices are valid indices but are not home slots for this algorithm.';
 p.alternatives[0]='XOR is valid for n distinct values from 0..n with exactly one missing. A duplicate-only XOR variant requires a complete known range plus exactly one extra repeated value; it does not solve arbitrary duplicate patterns.';
 p.references=p.references.filter(r=>!r.url.includes('cycle-sort/'));
 save('pattern',p.id,p,['whyItHelps','conditions','alternatives','references'],code);
}
{
 const p=get('pattern','two-pointers');
 p.exercises.find(e=>e.id==='pat-tp-fix-1').prompt=p.exercises.find(e=>e.id==='pat-tp-fix-1').prompt.replace('and can loop','and can miss a valid pair (it still terminates)');
 p.references=[pointersRef];
 save('pattern',p.id,p,['exercises','references']);
}
// Shared effective overrides must agree with the learner-facing lesson.
{
 const f='src/content/exercise-tests-data.ts';let s=fs.readFileSync(f,'utf8');
 s=s.replaceAll('total time proportional to the number of DISTINCT subproblems (each solved once) plus O(1) per reuse','total work equal to the sum of work per subproblem (including transitions) plus cache-reuse costs').replaceAll('total time becomes proportional to the number of DISTINCT subproblems plus O(1) per reuse','total work sums each state’s computation and transitions once, plus cache-reuse costs').replaceAll('total time proportional to the distinct subproblems (each solved once) plus O(1) per reuse','total work sums work per subproblem and transitions once, plus cache-reuse costs');
 s=s.replaceAll('sorting then two pointers works in O(n log n) time with constant extra space','iterative in-place heapsort then two pointers works in O(n log n) time with constant auxiliary space (Python list.sort can allocate linear temporary space)').replaceAll('Sort + two pointers is O(n log n) with O(1) space','Iterative heapsort + two pointers is O(n log n) with O(1) auxiliary space').replaceAll('sort + two pointers is O(n log n) with O(1) extra space','iterative heapsort + two pointers is O(n log n) with O(1) auxiliary space').replaceAll('use sort + two pointers when you don\'t need original indices','use iterative heapsort + two pointers when you don\'t need original indices');
 s=s.replaceAll('moving the wrong one wastes work or loops','moving the wrong one can discard a valid pair, although both pointers still move inward and the loop terminates').replaceAll('would loop forever the wrong way','would miss the valid pair with the wrong move');
 s=s.replaceAll('number of DISTINCT subproblems (each solved once) plus O(1) reuse','sum of work per subproblem and its transitions, plus cache-reuse costs');
 s=s.replaceAll('    for x in nums[1:]:\\n        cur = max(x, cur + x)','    for i in range(1, len(nums)):\\n        x = nums[i]\\n        cur = max(x, cur + x)').replaceAll('for x in nums[1:]: cur=max(x,cur+x)','for i in range(1,len(nums)): x=nums[i]; cur=max(x,cur+x)');
 fs.writeFileSync(f,s);
}
