// One-time authored hint correction; do not run as part of builds.
import { get, save, saveExerciseOverride } from '../../scripts/lib/content-edit.mjs';
const changes = [
  ['lesson', 'dp-recursive-calls', 'dprc-choose-1', [
    'Draw the calls for a small Fibonacci input. Which index is solved more than once?',
    'Repeated calls redo work even though the fully specified subproblem has the same answer.',
    'A reusable state must contain every input that affects its answer. Count distinct states and their transition work.',
    'Consider memoization or bottom-up tabulation to reuse overlapping answers; caching alone does not promise linear time.',
    'Memoization pseudocode: return a cached answer if present; otherwise solve dependencies, store the result, and return it. Fibonacci has n+1 states and constant scalar transition work per state.'
  ]],
  ['lesson', 'dp-1d-2d', 'dp12-choose-1', [
    'Compare two subproblems with equal capacity but different available item prefixes. Could their answers differ?',
    'The full state needs both item-prefix i and capacity j; state coordinates and stored rows are different ideas.',
    'A compressed row must read answers from the previous item layer rather than reuse the current item twice.',
    'Start with dp[i][j]. One-row storage can also work when the outer item loop and update direction preserve those dependencies.',
    'For positive item weights, one-row pseudocode is: for each item, visit capacities from largest down to its weight; update from the smaller-capacity previous-layer entry. This retains the 0/1 choice rule.'
  ]],
  ['lesson', 'dp-house-robber', 'dphr-choose-1', [
    'List the valid non-adjacent selections from [4,5,4], including the choice of both endpoints.',
    'Picking the middle 5 blocks both 4-valued neighbors; a locally richest choice can lose a better pair.',
    'For each prefix, either skip its last house or take it and use the best prefix ending two positions earlier.',
    'Use take/skip dynamic programming so both valid possibilities contribute to the decision.',
    'Pseudocode: new_best = max(best_one_back, best_two_back + current_value); shift the saved prefix totals. The endpoint pair totals 8, whereas richest-first picks 5.'
  ]],
  ['pattern', 'backtracking', 'pat-bt-choose-1', [
    'Compare the requested outputs: explicit subsets in (a), but a single count in (b).',
    'Listing must emit every qualifying configuration. A scalar count cannot supply the list.',
    'Finite include/exclude choices over the item positions can enumerate the subsets.',
    'Use backtracking for explicit output; bounded non-negative counting can use DP over item index and sum. A feasibility table may guide enumeration.',
    'Enumeration pseudocode: decide include or exclude for the next position, explore both, and copy the chosen positions at a qualifying leaf. Counting DP instead combines counts from the two choices and is pseudo-polynomial in the numeric target.'
  ]],
  ['pattern', 'dynamic-programming', 'pat-dp-choose-1', [
    'The requested output is every subset, not only the number of subsets.',
    'Duplicate values represent different positions; each position has a finite include/exclude decision.',
    'A DP count alone does not emit configurations. A DP table can guide reconstruction, but cannot remove output work.',
    'Use backtracking to traverse the configurations; finish all position decisions before testing a leaf when zero or negative values are allowed.',
    'Pseudocode: at position i, explore excluding it and including it; restore the path afterward. At i == len(values), emit a copy only if the sum equals the target. Do not return early merely because a partial sum equals the target.'
  ]]
];
for (const [kind, id, exerciseId, hints] of changes) {
  const item = get(kind, id);
  item.exercises.find(exercise => exercise.id === exerciseId).hints = hints;
  save(kind, id, item, ['exercises']);
  saveExerciseOverride(`${kind}:${id}:${exerciseId}`, 'hints', hints);
}
