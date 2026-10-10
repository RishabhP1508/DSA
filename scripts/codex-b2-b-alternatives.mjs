import {get,save,saveExerciseOverride} from './lib/content-edit.mjs';
function alternative(g,id,label,reason,text,tradeoff) {
 let a=g.approaches.find(a=>a.id===id);
 if(!a){a={id,label,requiredReasonIds:[]};g.approaches.push(a);}
 a.requiredReasonIds=[reason];delete a.rejectionFeedback;
 g.reasons.push({id:reason,text});
 g.alternatives??=[];
 g.alternatives.push({approachId:id,conditions:'Valid under this problem’s stated contract.',tradeoff,requiredReasonIds:[reason]});
}
{
 const p=get('pattern','sliding-window');const e=p.exercises.find(e=>e.id==='pat-sw-recognize-1');
 alternative(e.recognition,'prefix-array','Build prefix sums, then compare length-k range sums','prefix-difference','Adjacent prefix totals recover each length-k sum; this also works with negative values.','O(n) time and O(n) auxiliary storage rather than the window’s O(1) slots.');
 e.recognition.modelExplanation+=' A prefix array is also correct with O(n) storage; this question does not forbid that alternative.';
 saveExerciseOverride(`pattern:${p.id}:${e.id}`,'recognition',e.recognition);
 e.hints[5]+=' Prefix sums are a valid O(n)-storage alternative.';
 saveExerciseOverride(`pattern:${p.id}:${e.id}`,'hints',e.hints);
 save('pattern',p.id,p,['exercises']);
}
{
 const p=get('pattern','two-pointers');const e=p.exercises.find(e=>e.id==='pat-tp-recognize-2');
 e.prompt="Check whether an ASCII string is a palindrome, ignoring letter case. Which approaches fit? Extra storage is allowed.";
 e.recognition.scenario=e.prompt;
 alternative(e.recognition,'reverse-copy','Lowercase the ASCII string and compare with its reverse','reverse-preserves-order','A reversed copy preserves the order information needed to compare both directions. ASCII lowercasing preserves the number of characters.','O(n) extra storage; inward pointers can use O(1) slots on ASCII characters.');
 e.recognition.modelExplanation+=' A reversed lowercase copy is also valid when extra space is allowed. Full Unicode case folding may expand characters, so per-character inward comparison is not a general normalized-Unicode solution.';
 e.hints[0]='Goal: check an ASCII string for a case-insensitive palindrome; extra storage is allowed.';
 e.hints[4]='Pseudocode: compare the lowercase ASCII characters at both ends, then move inward.';
 saveExerciseOverride(`pattern:${p.id}:${e.id}`,'recognition',e.recognition);
 saveExerciseOverride(`pattern:${p.id}:${e.id}`,'hints',e.hints);
 p.complexityExplanation.scope='operation';p.complexityExplanation.assumptions.push('Arithmetic uses bounded-size integers in this two-sum model.');
 save('pattern',p.id,p,['exercises','complexityExplanation']);
}
{
 const p=get('pattern','bitwise-xor');const e=p.exercises.find(e=>e.id==='pat-xor-choose-1');
 e.recognition.reasons=e.recognition.reasons.filter(r=>r.id!=='sorted-scan');
 alternative(e.recognition,'sorted-runs','Sort and inspect consecutive equal-value runs','triples-runs','After sorting, equal values are consecutive; the one-element run identifies the singleton, whereas other runs have length three.','O(n log n) sorting plus O(n) scanning; Python sorted() uses O(n) storage. Per-bit mod-3 also needs a finite-width signed convention for negative integers.');
 e.recognition.modelExplanation+=' Sorting and scanning equal-value runs is also valid, at O(n log n) time.';
 saveExerciseOverride(`pattern:${p.id}:${e.id}`,'recognition',e.recognition);
 e.hints[4]+=' For signed inputs, choose a finite width, count those masked bits, then convert the sign bit back; alternatively sort and examine runs.';
 saveExerciseOverride(`pattern:${p.id}:${e.id}`,'hints',e.hints);
 save('pattern',p.id,p,['exercises']);
}
{
 const p=get('pattern','prefix-sums-hashmap');
 p.exercises.find(e=>e.id==='pat-ps-contrast-1').expected=p.exercises.find(e=>e.id==='pat-ps-contrast-1').expected.replace('negatives rule out a window','negatives invalidate the usual sum-threshold grow/shrink rule; fixed-size windows still work');
 save('pattern',p.id,p,['exercises']);
}
