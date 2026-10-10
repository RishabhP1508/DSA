import fs from 'node:fs';
import { loadCurriculum } from './lib/load-curriculum.mjs';
import { contentHashOf } from './lib/content-hash.mjs';
const c=await loadCurriculum();
const assessments={
 'lesson:value-to-index':'Two-sum complement ordering and original-index contract checked; expected hashing distinguished from collision worst case. Constant-space sorting alternative names iterative heapsort and its index tradeoff.',
 'lesson:grouping':'Canonical sorted-letter keys checked, including empty strings. Costs include key construction/hashing; buckets hold original-word references. First-letter exercise explicitly requires nonempty words.',
 'lesson:prefix-sums-map':'Empty-prefix count and lookup-before-increment checked. Fixed-size windows support negatives; the invalid monotonicity argument applies to sum-threshold variable windows. n+1 possible stored prefix keys.',
 'lesson:caching-seen':'Base Fibonacci calls are not cached; non-base states are. General memoization cost includes state work/transitions and reuse. Bounded arithmetic, hash behavior, recursion limits and large-integer costs are explicit.',
 'lesson:bit-logical-ops':'Corrected precedence (& binds tighter than ==), simultaneous old-operand carry calculation, specific -1+1 unbounded-carry counterexample, and finite-width signed wrap semantics.',
 'lesson:bit-shifts':'Python arbitrary-precision left-shift work/storage includes the shift distance, not just input width. Negative distances invalid; no unsupported claim that shifts and arithmetic have equal speed.',
 'lesson:bit-check-set-clear':'Masks return new integer values and require nonnegative bit positions. Constant-time claims are bounded-width/position models, not universal big-integer guarantees.',
 'lesson:xor-cancellation':'A fold combines odd-count values; 1^2^3=0 disproves recovery of all of them. Exactly one odd-count value is required. Width-dependent work/storage and distinct missing-range contract stated.',
 'lesson:count-set-bits':'Kernighan explicitly rejects negative input; runtime tested against bit_count on zero and wide integers. Power-of-two experiment excludes zero. Builtin counting still processes integer digits.',
 'lesson:kmp':'LPS proper-prefix convention, fallback amortization, overlaps, and all-boundaries empty-pattern convention checked against exhaustive oracle. Pattern index drawn on pattern; text character can be compared again without backtracking. Output storage separated.',
 'pattern:sliding-window':'Explicit no-slice initialization and invalid-width guard preserve constant auxiliary space. Boundaries/totals authored; prefix arrays are accepted as a valid storage tradeoff. Diagram total/window rendering is tracked as a remaining application repair.',
 'pattern:prefix-sums-hashmap':'Exclusive [i,j) endpoints, non-inserting get, zero-prefix seed and lookup order verified. Contrast distinguishes fixed negative windows, exact-target counts, and unrestricted maximum sums.',
 'pattern:kadane':'Indexed traversal avoids hidden input slice; best sum is a total rather than an index overlay. Nonempty recurrence and model behavior checked against signed-array boundaries.',
 'pattern:two-pointers':'Sorted movement logic, empty/singleton contracts, and terminating wrong-move bug checked. ASCII case-insensitive palindrome scoped honestly; reversed-copy alternative accepted when storage is allowed.',
 'pattern:cyclic-sort':'0<=home<n guard and distinct range contract checked exhaustively through n=5. Linear proof counts permanently fixed slots, not an incorrect one-swap-per-moving-value claim. Input mutation explicitly allowed.',
 'pattern:bitwise-xor':'Single-odd-count isolation and two-group extension distinguished. Bounded-width costs explicit. Triple-frequency drill accepts sorting equal-value runs and documents finite-width handling for bit-count modulo 3.',
 'pattern:matrix-traversal':'Boundary guards checked against an independent peel-and-rotate oracle for empty, single-row/column and rectangular grids. Output excluded from constant working slots; square-only in-place rotation stated.'
};
const date=new Date().toISOString().slice(0,10);
const rows=Object.entries(assessments).map(([key,assessment])=>{
 const [kind,id]=key.split(':'); const item=(kind==='lesson'?c.lessons:c.patterns).find(x=>x.id===id);
 return {kind,id,hash:contentHashOf(item),reviewer:'Codex',reviewerKind:'delegated-agent',reviewedAt:date,assessment};
});
fs.writeFileSync('docs/reviews/codex-b2-b.json',JSON.stringify(rows,null,2)+'\n');
fs.writeFileSync('docs/reviews/codex-b2-b.md',`# Delegated review B2-B\n\nDate: ${date}. All 17 effective registered examples were read, including every learner-facing field, line explanation and exercise override. Reviews are delegated-agent technical reviews, not human reviews. Exact hashes and assessments follow.\n\nMachine verification before sign-off: check:all exit 0, 795 unit tests / 61 files, all 131 lesson and 29 pattern outputs, 161 coding models and five authored-fault rejection categories, 164 recognition drills, 325 hint progressions. Focused content and grading assertions failed before correction. Real Pyodide oracles cover KMP, spiral grids, signed addition, set-bit counts, cyclic placement and grouping; a real-trace rendered test checks KMP pointer placement. A failed initial KMP visual test used the wrong label substring; the test was corrected to inspect the authored full label, not weakened to skip missing diagrams.\n\n`+rows.map(r=>`## ${r.kind}:${r.id}\n\nHash: ${r.hash}\n\n${r.assessment}\n`).join('\n')+`\n## Scope and limits\n\nArray totals/windows are authored but not yet rendered by the current application; that functional repair precedes the new UI. The generic browser suite is not evidence of every diagram family. Runner-origin and portable delivery remain open. Windows Chrome browser results are recorded separately after completion; no skipped runner test is claimed passed.\n`);
let index='\n## Codex B2-B topic checks ('+date+')\n\n';
for(const r of rows){const item=(r.kind==='lesson'?c.lessons:c.patterns).find(x=>x.id===r.id);index+=`### ${r.kind}/${r.id}\n\n${r.assessment}\n\n`;for(const reference of item.references.filter(x=>x.accessDate===date))index+=`- [${reference.title}](${reference.url}) — ${reference.section}. Checked: ${reference.verifiedClaims.join(' ')} Accessed ${date}.\n`;index+='\n';}
fs.appendFileSync('docs/references.md',index);
