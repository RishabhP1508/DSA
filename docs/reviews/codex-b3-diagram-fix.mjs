import { get, save } from '../../scripts/lib/content-edit.mjs';
for(const [kind,id] of [['lesson','binary-search'],['lesson','rotated-array-search'],['lesson','bounds'],['pattern','modified-binary-search']]) {
  const x=get(kind,id), key='bindings';
  x[key][0].range={label:'candidate indices',startSource:'lo',endSource:'hi',endInclusive:id!=='bounds'};
  if(id==='bounds') {
    const row=x.complexity.find(x=>x.operation==='bisect.insort');
    delete row.space;
    row.note='The maintained list grows by one value; a capacity resize can allocate/copy O(n) references. Search is O(log n); shifting/insertion takes O(n) worst-case time.';
    save(kind,id,x,[key,'complexity']);
  } else if(id==='modified-binary-search') {
    x.complexityExplanation.counters=[{label:'halving steps',definition:'executions of the midpoint line, excluding the final failed loop test',countLines:[5]}];
    save(kind,id,x,[key,'complexityExplanation']);
  } else save(kind,id,x,[key]);
}
{
  const x=get('lesson','matrix-search');
  const code=x.code.replace('        val = matrix[mid // cols][mid % cols]','        row, col = mid // cols, mid % cols\n        val = matrix[row][col]');
  x.codeExplanations=x.codeExplanations.flatMap(e=>e.line===12?[{line:12,executable:true,explanation:'Store the midpoint coordinates: quotient gives row, remainder gives column.'},{line:13,executable:true,explanation:'Read the cell at those recorded coordinates.'}]:[{...e,line:e.line>12?e.line+1:e.line}]);
  x.bindings=[{variable:'matrix',model:'matrix',overlays:[{role:'pointer',label:'row',source:'row'},{role:'pointer',label:'col',source:'col'}]}];
  x.vocabulary.find(v=>v.term==='Globally sorted matrix').definition='Reading across each row and then down to the next gives one nondecreasing sequence; equality is allowed.';
  x.explanation=x.explanation.replace('Because `log(m·n) = log m + log n`, this is far faster than searching each row separately (`m` binary searches = O(m·log n)) or scanning every cell (O(m·n)).','Because `log(m·n) = log m + log n`, one flat query avoids searching every row (`m` binary searches = O(m·log n)) or scanning every cell (O(m·n)); the comparison depends on the dimensions.');
  x.complexityExplanation.costModel='Each step computes a midpoint, maps it to row/column, and performs at most two value comparisons, all O(1), then halves the m*n-cell range.';
  x.complexityExplanation.time.explanation='Binary-search the virtual row-major sequence of m*n cells. Each O(1) iteration halves the candidate range, giving O(log(m*n)) for at least two cells; an empty or singleton query costs O(1). This avoids a separate search of every row or a full scan.';
  x.complexityExplanation.assumptions[0]='The matrix is rectangular and globally nondecreasing in row-major order.';
  x.complexityExplanation.derivation[1]={lines:[10,12,13,14,16],description:'Midpoint, coordinate mapping, cell access and at most two comparisons cost constant time.',cost:'O(1) per iteration',dimension:'time'};
  save('lesson','matrix-search',x,['codeExplanations','bindings','vocabulary','explanation','complexityExplanation'],code);
}
{
  const x=get('pattern','merge-intervals');
  x.complexityExplanation.space.inputOutputNote='intervals is supplied input and is unchanged; ordered is a separate reference list; merged is the required O(n) output of fresh pairs.';
  x.complexityExplanation.assumptions.push('Each interval is a two-value pair of finite, comparable numeric endpoints with start <= end; closed endpoints that touch overlap.');
  save('pattern','merge-intervals',x,['complexityExplanation']);
}
for(const id of ['counting-sort','radix-sort','insertion-sort']) {
  const x=get('lesson',id);
  const binding=id==='counting-sort'?{variable:'out',model:'array'}:id==='radix-sort'?{variable:'buckets',model:'matrix'}:{variable:'key',model:'object'};
  if(!x.bindings.some(b=>b.variable===binding.variable))x.bindings.push(binding);
  if(id==='radix-sort') {
    x.complexityExplanation.derivation[0].description='For a positive maximum the body runs once per digit place; all-zero input runs zero passes.';
    x.complexityExplanation.derivation.push({lines:[5,7],description:'Copying and finding max always scan a nonempty input, including all-zero values.',cost:'O(n)',dimension:'time'});
    save('lesson',id,x,['bindings','complexityExplanation']);
  } else save('lesson',id,x,['bindings']);
}
for(const id of ['bubble-sort','selection-sort','insertion-sort']) {
  const x=get('lesson',id);
  x.complexity[0].note+=' O(1) auxiliary space excludes the copied list that becomes the returned result; including that result requires O(n) memory.';
  save('lesson',id,x,['complexity']);
}
for(const [kind,id] of [['lesson','binary-search-answer'],['pattern','binary-search-on-answer']]) {
  const x=get(kind,id),key='bindings';
  x[key].push(...['lo','hi','mid','cap','used','cur'].map(variable=>({variable,model:'object'})));
  if(kind==='lesson')x.complexityExplanation.space.explanation='The feasibility check keeps used and cur, and the search keeps lo, hi and mid; no retained container grows with n or R.';
  save(kind,id,x,[key,'complexityExplanation']);
}
{
  const x=get('lesson','heap-sort');
  x.concepts.tradeoffs='The shown copy-and-pop implementation uses O(n) auxiliary memory and does not guarantee stability. Classic array heapsort uses O(1) auxiliary memory; practical speed depends on the implementation and input.';
  x.complexityExplanation.tradeoffs='Merge sort is stable with O(n) auxiliary memory. The shown heap-based sort also uses O(n) auxiliary memory and has O(n log n) worst-case time. Classic array heapsort can reduce auxiliary memory to O(1); deterministic quicksort can have O(n²) worst-case time.';
  save('lesson','heap-sort',x,['concepts','complexityExplanation']);
}
{
  const x=get('pattern','divide-and-conquer');
  x.counterexamples[0]='Plain recursive Fibonacci or edit distance repeatedly solves overlapping states and can take exponential time; memoization or tabulation avoids this repetition.';
  x.alternatives[2]='Heap/quickselect — quickselect is divide and conquer specialized to the one side containing the k-th element; random pivots give O(n) expected time and O(n²) worst time.';
  save('pattern','divide-and-conquer',x,['counterexamples','alternatives']);
}
