import fs from 'node:fs';
import { get, save, reference as ref } from './lib/content-edit.mjs';
const numeric=ref('https://docs.python.org/3.14/library/stdtypes.html#bitwise-operations-on-integer-types','Python integer operations','Bitwise operations on integer types',['Python integers have arbitrary precision and bitwise operations use infinite sign extension.'],'bits/xor');
const bitSource=ref('https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/longobject.c','CPython 3.14.2 integer implementation','long_lshift1; long_bitwise; int_bit_count_impl',['These implementations allocate and iterate over integer digits; bit-operation costs depend on operand and result width.'],'bits/cost-model');
const xorRef=ref('https://cp-algorithms.com/algebra/bit-manipulation.html','CP-Algorithms: bit manipulation','Bit operators and XOR',['XOR combines differing bits; pairing equal values cancels their contribution. The examples use fixed-width C++ integers.'],'bits/xor');
const singleRef=ref('https://leetcode.com/problems/single-number/','Single Number: original problem','Problem and constraints',['Exactly one integer appears once and every other integer appears twice.'],'bits/xor');
{
 const l=get('lesson','grouping');
 l.explanation=l.explanation.slice(0,l.explanation.indexOf('The cost is'))+`For n words, let L be at least 1 and at least the longest word length. Sorting each word gives an expected O(n*L log(L+1)) time upper bound. Building and hashing each new key also reads O(L) characters; dictionary access is not free for an arbitrarily long new string. Empty words are valid here and all share the empty key. The buckets hold references to the original words, while the stored keys can total O(n*L) characters.\n\nThe key must describe a real grouping rule: a remainder groups numbers by remainder, and rounding groups by the same rounded result. Rounding does not guarantee that every pair of nearby numbers lands together.`;
 l.concepts.tradeoffs='One pass plus the cost of building, hashing, and comparing keys. Buckets hold references, not copies of word characters. A wrong canonical key can split or merge the wrong groups.';
 l.complexity=[{operation:'Group anagrams with sorted keys',best:'O(n*L log(L+1))',average:'O(n*L log(L+1))',worst:'O(n*L log(L+1) + n²*L)',space:'O(n*L)',note:'Upper bounds; expected hashing in average column. L=max(1,longest word length). Severe hash collisions can add quadratic key comparisons.'}];
 const c=l.complexityExplanation;
 c.scope='operation'; c.variables[1].meaning='max(1, the longest word length), so empty words still have constant bookkeeping cost';
 c.costModel='Sorting a word has O(L log(L+1)) worst-case work; constructing and hashing its fresh string key costs O(L). Expected dictionary probes plus key comparisons give O(L) per lookup.';
 c.time={bound:'O(n*L log(L+1))',case:'expected',explanation:'For each word, sort and join its letters, hash the fresh key, and append its reference to a bucket. Expected hash-table behavior gives this upper bound; collisions can instead add O(n²*L) comparisons. A 26-count key for lowercase a-z gives expected O(n*L) under bounded-size counts.'};
 c.space.explanation='Stored canonical strings can total O(n*L) characters. Bucket lists contain n references to the existing words, not copies of their characters; sorting one current word also needs O(L) temporary slots.';
 c.space.inputOutputNote='Word strings are input. Grouped output contains O(n) references; O(n*L) key storage is auxiliary, and excludes the input character storage.';
 c.derivation=[{lines:[4],description:'Visit n words.',cost:'O(n)',dimension:'time'},{lines:[5],description:'Sort, join, and hash each key of up to L characters.',cost:'O(n*L log(L+1))',dimension:'time'},{lines:[6],description:'Expected bucket lookup with O(L) key hashing/comparison upper bound, then amortized append.',cost:'O(n*L)',dimension:'time'},{lines:[3,6],description:'Store keys and lists of original-word references.',cost:'O(n*L)',dimension:'space'}];
 c.assumptions=['L is at least 1; words may be empty.','Expected hash-table behavior, with bounded-size character/count operations.','For the 26-count alternative, every character belongs to lowercase a-z.'];
 c.fixedDataNote='The displayed five short words form two groups. Complexity concerns the grouping operation on generalized n-word input; the display print is outside that scope.';
 l.exercises.find(e=>e.id==='grp-complete-1').prompt='Group nonempty words by their first letter into a dict of lists. The list of words itself may be empty.';
 l.experiments[0]='For words using only lowercase a-z, use a 26-length letter-count tuple as the key; count in O(L) rather than sorting.';
 l.review='Grouping maps a canonical key to a bucket of item references. Sorted-letter keys group anagrams correctly, including empty words. With L=max(1,longest word length), the expected time upper bound is O(n*L log(L+1)); a fixed lowercase alphabet permits an expected O(n*L) count-key alternative. Account for key construction and hashing as well as dictionary probes.';
 l.references=[ref('https://docs.python.org/3.14/library/stdtypes.html#dict.setdefault','Python dictionary setdefault','Mapping types: setdefault',['setdefault returns the existing value, or inserts and returns the supplied default.'],'hashing/grouping'),ref('https://leetcode.com/problems/group-anagrams/','Group Anagrams: original problem','Problem, examples, and constraints',['Anagrams share the same multiset of letters; the original problem permits empty strings and restricts characters to lowercase English letters.'],'hashing/grouping')];
 save('lesson',l.id,l,['explanation','concepts','complexity','complexityExplanation','exercises','experiments','review','references']);
}
{
 const l=get('lesson','xor-cancellation');
 l.explanation=`XOR has three useful properties: x ^ x = 0, x ^ 0 = x, and order and grouping do not change the result. Equal pairs cancel. If several values occur an odd number of times, the fold returns their combined XOR; it does not list those values. For example, 1 ^ 2 ^ 3 = 0 even though all three values occur once.\n\nSingle Number supplies the crucial condition: exactly one value occurs an odd number of times and all others occur an even number of times. Then the fold isolates that value. In [4,1,2,1,2], the pairs of 1 and 2 cancel and leave 4. One accumulator replaces the O(n)-entry counting map.\n\nFor bounded-size integers this takes O(n) time and O(1) auxiliary space. If integers have up to w bits, Python's digit work gives O(n*w) time and O(w) accumulator storage upper bounds. O(1) here counts bounded-size slots, not zero memory.\n\nA missing number can be isolated by XORing both the known range and the input when exactly one range member is missing and all input values are distinct. To find two odd-count values, first split into two groups using a bit on which they differ, then fold each group. A plain fold cannot recover both values.`;
 l.vocabulary.find(x=>x.term==='Parity').definition='Whether a count is odd or even. Odd-count values contribute to the combined XOR; the result does not identify them separately.';
 Object.assign(l.concepts,{purpose:'Use cancellation to isolate exactly one odd-count integer under the stated contract.',operations:'Fold with ^; return the combined XOR, which is the unique value only under the parity condition.',tradeoffs:'O(n) time/O(1) extra bounded-size slots; O(n*w)/O(w) upper bounds when integer bit width w scales.',commonMistakes:'Expecting a single fold to list multiple odd-count values; omitting the multiplicity contract; confusing XOR (^) with exponentiation (**).'});
 l.complexity[0].note='Bounded-size integer model: one accumulator. Scaling bit width w gives O(n*w) time/O(w) auxiliary storage upper bounds.';
 const c=l.complexityExplanation; c.scope='operation'; c.costModel='Each XOR takes bounded work only when integer widths stay bounded. CPython digit loops imply O(w) upper bounds for width w.';
 c.space.explanation='One bounded-size accumulator slot gives O(1) extra space; if its width scales to w bits, the integer itself needs O(w) bit storage.';
 c.assumptions=['Exactly one value has odd multiplicity; all others have even multiplicity.','Integer widths are bounded for the stated O(n)/O(1) slot model.'];
 l.exercises.find(e=>e.id==='xor-complete-1').prompt='Find the missing number using XOR: nums contains n distinct integers from 0..n with exactly one missing.';
 l.review='Equal pairs cancel in XOR. A fold isolates the answer only when exactly one value has odd count; otherwise it combines all odd-count values (for example 1 ^ 2 ^ 3 = 0). One bounded-size accumulator gives O(n) time/O(1) extra slots; variable width w changes the upper bounds to O(n*w)/O(w).';
 l.references=[xorRef,numeric,bitSource,singleRef];
 save('lesson',l.id,l,['explanation','vocabulary','concepts','complexity','complexityExplanation','exercises','review','references']);
}
{
 const p=get('pattern','bitwise-xor');
 p.summary='Cancel equal integer pairs with XOR to isolate exactly one odd-count value. Other multiplicity contracts need additional reasoning.';
 p.conditions[0]='A single fold isolates exactly one odd-count value only when every other value has even multiplicity. Several odd-count values combine: 1 ^ 2 ^ 3 = 0, not a list of three answers.';
 p.clues[1]='Exactly one member is missing from a known range, with distinct input values; XOR the range and input. A duplicate requires its own full multiplicity contract.';
 p.whyItHelps+=' With several odd-count values, the result is their combined XOR rather than their identities; 1 ^ 2 ^ 3 = 0. The plain single-number fold therefore needs exactly one odd-count value.';
 p.complexityNote='O(n) time and O(1) extra bounded-size integer slots. If width w scales, CPython XOR work/storage has O(n*w)/O(w) upper bounds.';
 p.complexityExplanation.scope='operation';
 p.complexityExplanation.space.explanation='One accumulator has bounded storage in the bounded-size integer model; width w needs O(w) bits if it scales.';
 p.references=[xorRef,numeric,bitSource,singleRef];
 save('pattern',p.id,p,['summary','conditions','clues','whyItHelps','complexityNote','complexityExplanation','references']);
}
{
 const l=get('lesson','caching-seen');
 l.review='Memoization reuses stored results when recursive subproblems overlap. Here each non-base Fibonacci state is computed once, while the cheap uncached base cases may repeat. In general, sum the work within each distinct state plus its transitions and reuse costs. Expected O(n) time/O(n) slots for this example assumes bounded-size arithmetic and expected dictionary behavior; growing Fibonacci integers change the bit-cost analysis.';
 save('lesson',l.id,l,['review']);
}
{
 const l=get('lesson','kmp');
 l.explanation+='\n\nThe current text character may be compared with another pattern position after a fallback; “no text backtracking” does not mean every character is compared exactly once. The stated O(m) auxiliary space excludes the r returned match positions. Total allocated storage is O(m+r); for the empty-pattern convention, r=n+1 and no LPS is needed.';
 l.complexityExplanation.scope='operation';
 l.complexityExplanation.space.explanation='The LPS array has m entries and the pointers use constant slots. O(m) auxiliary space excludes the r result positions, so total allocated storage is O(m+r). For an empty pattern, the output alone has n+1 entries.';
 l.complexityExplanation.derivation.find(d=>d.dimension==='space').lines=[6];
 l.complexityExplanation.counters.find(c=>c.label==='text comparisons').countLines=[28];
 l.complexityExplanation.counters.find(c=>c.label==='text comparisons').definition='executions of the search match check (line 28)';
 l.codeExplanations[0].explanation='Comment: KMP keeps the text index moving forward; fallback can compare the current text character again.';
 l.references=l.references.filter(r=>!r.url.includes('wikipedia'));
 l.references.push(ref('https://www.cs.cornell.edu/courses/cs312/2002fa/lectures/lec26.htm','Cornell CS312: string matching','Knuth-Morris-Pratt and prefix computation',['Fallback decreases a quantity that increases at most n times, giving linear search work; prefix preprocessing is linear.'],'strings/kmp'));
 save('lesson',l.id,l,['explanation','complexityExplanation','codeExplanations','references'],l.code.replace('never re-scanning text.','never moving the text index backward.'));
}
{
 const p=get('pattern','cyclic-sort');
 p.references=[ref('https://leetcode.com/problems/missing-number/','Missing Number: original contract','Problem and constraints',['n distinct values come from 0..n with exactly one missing.'],'patterns/cyclic-sort')];
 save('pattern',p.id,p,['references']);
 const m=get('pattern','matrix-traversal');
 m.references=[ref('https://leetcode.com/problems/spiral-matrix/','Spiral Matrix: original contract','Problem and examples',['The input is a rectangular matrix; required traversal follows the perimeter inward. Empty-input handling here is an authored extension.'],'patterns/matrix-traversal')];
 save('pattern',m.id,m,['references']);
}
// Effective exercise hints/recognition override raw lesson fields in the registry.
let data=fs.readFileSync('src/content/exercise-tests-data.ts','utf8');
data=data.replaceAll('Goal: group words by their first letter into a dict of lists.','Goal: group nonempty words by first letter; the list may be empty.');
data=data.replaceAll('Both are O(n) time, but XOR is O(1) space','For bounded-size integers, both are O(n) time, but XOR is O(1) space');
data=data.replaceAll('Approach: cache each subproblem\'s result (memoize) so each is computed only once.','Approach: cache non-base results; repeated base cases can remain cheap. Sum the work per distinct state plus transitions.');
fs.writeFileSync('src/content/exercise-tests-data.ts',data);
