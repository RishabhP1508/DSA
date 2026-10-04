/**
 * R6 authored data — runnable-exercise test snippets and recognition grading.
 *
 * Keyed by uid `ownerKind:ownerId:exerciseId`. See exercise-tests.ts for the
 * conventions and the merge step. Every EXERCISE_TESTS entry is machine-verified
 * by scripts/verify_exercise_tests.mjs (model passes; starter + a synthesised
 * mistake variant are rejected). Every EXERCISE_RECOGNITION entry is validated
 * by src/core/recognition-grading.ts `validateRecognition`.
 */

import type { RecognitionGrading } from "../core/types";

export const EXERCISE_TESTS: Record<string, string> = {
  // ── Programming foundations ────────────────────────────────────────────
  "lesson:variables-and-types:vt-fix-1":
    "assert a == [1, 2, 3], f'a should be unchanged, got {a}'\nassert b == [1, 2, 3, 4], f'b should have the appended item, got {b}'\nassert a is not b, 'a and b must be independent lists'\nprint('OK')",

  "lesson:loops:loop-fix-1":
    "assert count_up(3) == 3, f'should reach 3, got {count_up(3)}'\nassert count_up(0) == 0, 'no iterations: stays 0'\nassert count_up(5) == 5\nassert count_up(1) == 1\nprint('OK')",
  "lesson:loops:loop-complete-1":
    "assert count_evens([4, 7, 10, 3]) == 2, f'2 evens, got {count_evens([4,7,10,3])}'\nassert count_evens([]) == 0, 'empty list has no evens'\nassert count_evens([1, 3, 5]) == 0, 'all odd'\nassert count_evens([2, 4, 6]) == 3, 'all even'\nprint('OK')",
  "lesson:functions:func-complete-1":
    "assert square(6) == 36\nassert square(0) == 0\nassert square(-3) == 9\nprint('OK')",

  "lesson:references-mutation:ref-fix-1":
    "src = [1, 2, 3]\nout = doubled(src)\nassert src == [1, 2, 3], f'caller list must be intact, got {src}'\nassert out == [1, 2, 3, 3], f'result should append the last element, got {out}'\nassert out is not src\n# A second, different input so a hard-coded return cannot pass.\nsrc2 = [9, 8]\nout2 = doubled(src2)\nassert src2 == [9, 8], f'caller list must be intact, got {src2}'\nassert out2 == [9, 8, 8], f'result should append the last element, got {out2}'\nassert out2 is not src2\nprint('OK')",
  "lesson:classes:class-complete-1":
    "c = Counter(5)\nassert c.value == 5\nc.reset()\nassert c.value == 0, f'reset should zero value, got {c.value}'\nc2 = Counter(0)\nc2.reset()\nassert c2.value == 0\nprint('OK')",

  "lesson:correctness:correct-fix-1":
    "assert sum_to(5) == 15, f'1+..+5 == 15, got {sum_to(5)}'\nassert sum_to(1) == 1\nassert sum_to(0) == 0\nprint('OK')",

  // ── Arrays ─────────────────────────────────────────────────────────────
  "lesson:array-traversal:arr-trav-complete-1":
    "assert sum_all([5, 2, 9, 1]) == 17, f'5+2+9+1 == 17, got {sum_all([5,2,9,1])}'\nassert sum_all([]) == 0, 'empty sum is 0'\nassert sum_all([42]) == 42\nassert sum_all([-1, 1, -2, 2]) == 0\nprint('OK')",
  "lesson:two-pointers:tp-fix-1":
    "assert reverse_in_place([1, 2, 3]) == [3, 2, 1], 'reverses odd-length'\nassert reverse_in_place([1, 2, 3, 4]) == [4, 3, 2, 1], 'reverses even-length'\nassert reverse_in_place([]) == [], 'empty stays empty'\nassert reverse_in_place([7]) == [7], 'single element unchanged'\nprint('OK')",
  "lesson:prefix-sums:ps-complete-1":
    "# prefix[i] = sum of first i elements. For nums=[2,4,1,3] prefix=[0,2,6,7,10].\nprefix = [0, 2, 6, 7, 10]\nassert range_sum(prefix, 1, 3) == 5, 'nums[1:3] = 4+1 = 5'\nassert range_sum(prefix, 0, 4) == 10\nassert range_sum(prefix, 2, 2) == 0\nprint('OK')",

  "lesson:kadane:kad-fix-1":
    "assert max_sub([-2, -3, -1, -4]) == -1, 'all-negative: best single element'\nassert max_sub([1, 2, 3]) == 6\nassert max_sub([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6\nprint('OK')",
  "lesson:in-place-modification:ip-complete-1":
    "nums = [3, 2, 2, 3]\nn = remove_val(nums, 3)\nassert n == 2, f'two non-3 values remain, got {n}'\nassert sorted(nums[:n]) == [2, 2]\nnums2 = [1]\nassert remove_val(nums2, 1) == 0\nprint('OK')",
  "lesson:matrix-traversal:mat-complete-1":
    "assert grid_sum([[1, 2, 3], [4, 5, 6]]) == 21, f'sum of 1..6 == 21, got {grid_sum([[1,2,3],[4,5,6]])}'\nassert grid_sum([[5]]) == 5, 'single cell'\nassert grid_sum([[1, 1], [1, 1], [1, 1]]) == 6, 'ragged? no — 3x2 of ones'\nassert grid_sum([[0, 0], [0, 0]]) == 0\nprint('OK')",
  "lesson:intervals:int-fix-1":
    "out = merge([[2, 3], [1, 5], [4, 6]])\nnorm = [list(x) for x in out]\nassert norm == [[1, 6]], f'overlapping intervals merge to [1,6], got {norm}'\nout2 = merge([[1, 2], [5, 6]])\nassert [list(x) for x in out2] == [[1, 2], [5, 6]]\n# touching intervals [1,3],[3,5] must merge (needs <= and the sort): a version\n# using strict < would leave them separate.\nout3 = merge([[3, 5], [1, 3]])\nassert [list(x) for x in out3] == [[1, 5]], f'touching intervals should merge, got {out3}'\nprint('OK')",

  // ── Strings ────────────────────────────────────────────────────────────
  "lesson:string-frequency:sf-complete-1":
    "assert char_freq('apple') == {'a': 1, 'p': 2, 'l': 1, 'e': 1}, f'apple frequency wrong, got {char_freq(\"apple\")}'\nassert char_freq('') == {}, 'empty string has no characters'\nassert char_freq('aaa') == {'a': 3}, 'all same char'\nassert char_freq('abc') == {'a': 1, 'b': 1, 'c': 1}\nprint('OK')",
  "lesson:string-two-pointers:stp-complete-1":
    "assert is_palindrome('racecar') is True, 'racecar is a palindrome'\nassert is_palindrome('abca') is False, 'abca is not a palindrome'\nassert is_palindrome('') is True, 'empty string is a palindrome'\nassert is_palindrome('a') is True, 'single char is a palindrome'\nassert is_palindrome('ab') is False, 'ab is not a palindrome'\nprint('OK')",
  "lesson:string-parsing:sp-complete-1":
    "assert parse_max('3 9 2 7') == 9, f'max should be 9, got {parse_max(\"3 9 2 7\")}'\nassert parse_max('5') == 5, 'single token'\nassert parse_max('-1 -4 -2') == -1, 'all negative'\nassert parse_max('10 2 10') == 10, 'duplicate max'\nprint('OK')",
  "lesson:palindromes:pal-complete-1":
    "assert is_palindrome('racecar') is True\nassert is_palindrome('hello') is False\nassert is_palindrome('') is True, 'empty string is a palindrome'\nassert is_palindrome('x') is True\nassert is_palindrome('ab') is False\n# first and last match but the middle differs: must compare the WHOLE reverse,\n# not just the ends.\nassert is_palindrome('abca') is False, 'ends match but not a palindrome'\nassert is_palindrome('abba') is True\nprint('OK')",
  "lesson:anagrams:ana-complete-1":
    "assert is_anagram('listen', 'silent') is True, 'listen/silent are anagrams'\nassert is_anagram('rat', 'car') is False, 'rat/car are not anagrams'\nassert is_anagram('', '') is True, 'two empty strings are anagrams'\nassert is_anagram('a', 'aa') is False, 'different lengths cannot be anagrams'\nassert is_anagram('aab', 'abb') is False, 'counts must match, not just letter set'\nprint('OK')",

  // ── Searching ──────────────────────────────────────────────────────────
  "lesson:linear-search:ls-complete-1":
    "assert contains([1, 2, 3], 2) is True, 'present value found'\nassert contains([1, 2, 3], 9) is False, 'absent value not found'\nassert contains([], 1) is False, 'nothing is in an empty list'\nassert contains([5], 5) is True, 'singleton hit'\nprint('OK')",
  "lesson:binary-search:bs-fix-1":
    "assert bsearch([1, 3, 5, 7, 9], 7) == 3, 'finds index of 7'\nassert bsearch([1, 3, 5, 7, 9], 1) == 0, 'finds first element'\nassert bsearch([1, 3, 5, 7, 9], 9) == 4, 'finds last element'\nassert bsearch([1, 3, 5, 7, 9], 4) == -1, 'absent value returns -1 (must terminate, not loop forever)'\nassert bsearch([], 1) == -1, 'empty array returns -1'\nprint('OK')",
  "lesson:bounds:bnd-complete-1":
    "assert count([1, 2, 2, 2, 3], 2) == 3, 'three 2s'\nassert count([1, 2, 2, 2, 3], 5) == 0, 'absent target has 0 occurrences'\nassert count([], 1) == 0, 'empty array'\nassert count([2, 2, 2], 2) == 3, 'all equal'\nassert count([1, 2, 3], 3) == 1, 'single occurrence at the end'\nprint('OK')",
  "lesson:matrix-search:ms-complete-1":
    "m = [[1, 2, 3], [4, 5, 6]]\nassert cell(m, 3, 0) == 1, 'flat 0 -> [0][0]'\nassert cell(m, 3, 4) == 5, 'flat 4 -> [1][1]'\nassert cell(m, 3, 2) == 3, 'flat 2 -> [0][2]'\nassert cell(m, 3, 5) == 6, 'flat 5 -> [1][2] (last cell)'\nprint('OK')",

  // ── Sorting ────────────────────────────────────────────────────────────
  "lesson:merge-sort:mrg-complete-1":
    "assert merge([1, 3, 5], [2, 4, 6]) == [1, 2, 3, 4, 5, 6], 'interleaved merge'\nassert merge([], [1, 2]) == [1, 2], 'empty left'\nassert merge([1, 2], []) == [1, 2], 'empty right'\nassert merge([], []) == [], 'both empty'\nassert merge([1, 1], [1, 1]) == [1, 1, 1, 1], 'duplicates preserved'\nassert merge([2], [1]) == [1, 2], 'takes smaller front first'\n# Stability: on a tie the LEFT element must be taken first, which requires the\n# <= comparison. A strict-< version would take the right element on ties.\nclass _E:\n    def __init__(self, k, src):\n        self.k = k\n        self.src = src\n    def __le__(self, o):\n        return self.k <= o.k\n    def __lt__(self, o):\n        return self.k < o.k\n_res = merge([_E(1, 'L')], [_E(1, 'R')])\nassert _res[0].src == 'L', f'stable merge takes left on ties (needs <=), got {_res[0].src}'\nprint('OK')",

  // ── Stacks & Queues ────────────────────────────────────────────────────
  "lesson:stack-queue-operations:sq-complete-1":
    "assert safe_pop([]) is None, 'empty stack pops None, not an error'\ns = [1, 2, 3]\nassert safe_pop(s) == 3, 'pops the top'\nassert s == [1, 2], 'pop mutates the stack'\nassert safe_pop([9]) == 9, 'singleton pop'\nprint('OK')",
  "lesson:parentheses-matching:paren-fix-1":
    "assert valid('()[]{}') is True, 'all matched'\nassert valid('([{}])') is True, 'nested matched'\nassert valid('(((') is False, 'unclosed opens must be rejected (stack not empty at end)'\nassert valid('') is True, 'empty string is valid'\nassert valid('(]') is False, 'mismatched pair'\nassert valid(')') is False, 'closing with empty stack'\nprint('OK')",
  "lesson:min-max-tracking:min-complete-1":
    "# The learner's push is a top-level function taking self; call it on a dummy.\nclass _S:\n    def __init__(self):\n        self.stack = []\n        self.mins = []\nobj = _S()\npush(obj, 5)\nassert obj.mins == [5], f'first push seeds min, got {obj.mins}'\npush(obj, 3)\nassert obj.mins == [5, 3], f'running min drops to 3, got {obj.mins}'\npush(obj, 4)\nassert obj.mins == [5, 3, 3], f'running min stays 3, got {obj.mins}'\nassert obj.stack == [5, 3, 4], f'stack keeps raw values, got {obj.stack}'\nprint('OK')",

  // ── Hashing ────────────────────────────────────────────────────────
  "lesson:maps-sets:ms-complete-1":
    "assert distinct_count([1, 2, 2, 3, 3, 3]) == 3, 'three distinct values'\nassert distinct_count([]) == 0, 'no values'\nassert distinct_count([7, 7, 7]) == 1, 'all duplicates -> 1'\nassert distinct_count([-1, -1, 0, 1]) == 3, 'handles negatives'\nprint('OK')",
  "lesson:hashing-frequency:hf-complete-1":
    "assert first_unique([2, 3, 2, 4, 3]) == 4, 'first with count 1 is 4'\nassert first_unique([1, 1, 2, 2]) is None, 'no unique -> None'\nassert first_unique([9]) == 9, 'lone element is unique'\nassert first_unique([5, 5, 3, 3, 7, 7, 3]) is None, 'no count-1 element'\nassert first_unique([4, 5, 5, 4, 6]) == 6, 'returns first-appearing unique in order'\nprint('OK')",
  "lesson:duplicate-detection:dup-fix-1":
    "assert has_dup([1, 2, 3, 1]) is True, 'a repeat exists'\nassert has_dup([1, 2, 3]) is False, 'all distinct -> False (buggy version always returns True)'\nassert has_dup([]) is False, 'empty has no duplicate'\nassert has_dup([5]) is False, 'single element is never a duplicate'\nassert has_dup([2, 2]) is True, 'immediate repeat'\nprint('OK')",
  "lesson:value-to-index:vti-complete-1":
    "assert two_sum([2, 7, 11, 15], 9) == [0, 1], 'classic pair'\nassert two_sum([3, 2, 4], 6) == [1, 2], 'not the first element'\nassert two_sum([3, 3], 6) == [0, 1], 'uses two distinct indices of equal values'\nassert two_sum([1, 2, 3], 100) == [], 'no pair -> empty'\nr = two_sum([0, 4, 3, 0], 0)\nassert r == [0, 3], f'two zeros sum to target, got {r}'\nprint('OK')",
  "lesson:grouping:grp-complete-1":
    "g = by_first_letter(['apple', 'ant', 'bee', 'cat'])\nassert g == {'a': ['apple', 'ant'], 'b': ['bee'], 'c': ['cat']}, f'grouped wrong, got {g}'\nassert by_first_letter([]) == {}, 'empty input -> empty dict'\nassert by_first_letter(['zoo']) == {'z': ['zoo']}, 'single word'\ng2 = by_first_letter(['ax', 'ay', 'az'])\nassert g2 == {'a': ['ax', 'ay', 'az']}, f'preserves insertion order, got {g2}'\nprint('OK')",
  "lesson:caching-seen:cache-fix-1":
    "assert fib(0) == 0\nassert fib(1) == 1\nassert fib(10) == 55, 'fib(10) == 55'\n# The bug is a shared mutable default {}: a fresh call with no memo must NOT be\n# polluted by previous calls. Prove memo does not persist across calls by\n# checking the default is not a dict carrying state.\nimport inspect\ndefaults = fib.__defaults__\nassert defaults == (None,), f'memo default must be None (None-guard idiom), got {defaults}'\nassert fib(7) == 13, 'independent call still correct'\nprint('OK')",

  // ── Bit manipulation ───────────────────────────────────────────────
  "lesson:bit-shifts:shift-complete-1":
    "assert bit_mask(0) == 1, 'bit 0 -> 1'\nassert bit_mask(1) == 2, 'bit 1 -> 2'\nassert bit_mask(3) == 8, 'bit 3 -> 8'\nassert bit_mask(10) == 1024, 'bit 10 -> 1024'\nprint('OK')",
  "lesson:bit-check-set-clear:csc-complete-1":
    "assert is_set(5, 0) == 1, 'bit 0 of 0b101 is set'\nassert is_set(5, 1) == 0, 'bit 1 of 0b101 is clear'\nassert is_set(5, 2) == 1, 'bit 2 of 0b101 is set'\nassert is_set(0, 0) == 0, 'no bits set in 0'\nassert is_set(8, 3) == 1, 'bit 3 of 0b1000 is set'\nprint('OK')",
  "lesson:bit-check-set-clear:csc-fix-1":
    "assert clear_bit(0b1111, 0) == 0b1110, 'clears bit 0'\nassert clear_bit(0b1111, 2) == 0b1011, 'clears bit 2'\nassert clear_bit(0b1010, 0) == 0b1010, 'clearing an already-0 bit is a no-op'\nassert clear_bit(5, 1) == 5, 'bit 1 of 0b101 already 0'\n# The buggy version (n & (1<<i)) would KEEP only bit i; check a case that\n# distinguishes them: clearing bit 2 of 0b111 must leave 0b011, not 0b100.\nassert clear_bit(0b111, 2) == 0b011, 'must clear, not isolate, the bit'\nprint('OK')",
  "lesson:xor-cancellation:xor-complete-1":
    "assert missing([0, 1, 3]) == 2, 'missing 2 from 0..3'\nassert missing([1, 2, 3]) == 0, 'missing 0'\nassert missing([0, 1, 2]) == 3, 'missing the top value'\nassert missing([]) == 0, 'empty list is missing 0 from range 0..0'\nassert missing([0, 2, 3, 4]) == 1, 'missing an interior value'\nprint('OK')",
  "lesson:count-set-bits:csb-complete-1":
    "assert is_power_of_two(1) is True, '1 == 2**0'\nassert is_power_of_two(2) is True\nassert is_power_of_two(8) is True\nassert is_power_of_two(1024) is True\nassert is_power_of_two(3) is False, 'two bits set'\nassert is_power_of_two(6) is False\nassert is_power_of_two(0) is False, 'zero has no set bit'\nassert is_power_of_two(-4) is False, 'negatives are not powers of two'\nprint('OK')",

  // ── Heaps ──────────────────────────────────────────────────────────
  "lesson:min-max-heaps:heap-complete-1":
    "assert sorted(k_smallest([5, 1, 4, 2, 3], 3)) == [1, 2, 3], 'three smallest'\nassert k_smallest([5, 1, 4, 2, 3], 1) == [1], 'the single smallest'\nassert sorted(k_smallest([3, 3, 3], 2)) == [3, 3], 'duplicates allowed'\nassert k_smallest([2, 1], 5) == sorted([2, 1]), 'k larger than list returns all sorted'\nassert k_smallest([], 3) == [], 'empty input'\nprint('OK')",
  "lesson:kth-largest:kth-complete-1":
    "assert kth_smallest([7, 10, 4, 3, 20, 15], 3) == 7, '3rd smallest is 7'\nassert kth_smallest([7, 10, 4, 3, 20, 15], 1) == 3, '1st smallest is the min'\nassert kth_smallest([7, 10, 4, 3, 20, 15], 6) == 20, 'kth == n gives the max'\nassert kth_smallest([2, 2, 2], 2) == 2, 'duplicates: 2nd smallest is 2'\nassert kth_smallest([-5, -1, -3], 2) == -3, 'handles negatives'\nprint('OK')",
  "lesson:merge-sorted-data:merge-complete-1":
    "assert merge_two([1, 3, 5], [2, 4, 6]) == [1, 2, 3, 4, 5, 6], 'interleaved'\nassert merge_two([], [1, 2]) == [1, 2], 'empty left'\nassert merge_two([1, 2], []) == [1, 2], 'empty right'\nassert merge_two([], []) == [], 'both empty'\nassert merge_two([1, 1], [1]) == [1, 1, 1], 'duplicates kept, still sorted'\nout = merge_two([1, 5], [2, 3, 4])\nassert out == sorted(out), 'result is sorted'\nprint('OK')",
  "lesson:running-median:med-fix-1":
    "import heapq\n# add() is a method fragment referencing self.small/self.large; call it on a host.\nclass _MF:\n    def __init__(self):\n        self.small = []  # max-heap via negation (larger half's floor)\n        self.large = []  # min-heap (upper half)\n    def median(self):\n        if len(self.small) == len(self.large):\n            return (-self.small[0] + self.large[0]) / 2\n        return float(-self.small[0])\nm = _MF()\nfor v in [5, 15, 1, 3]:\n    add(m, v)\n# After rebalancing the two heaps must stay balanced (small has the extra when odd).\nassert len(m.small) >= len(m.large), f'small must not be smaller than large, got {len(m.small)},{len(m.large)}'\nassert len(m.small) - len(m.large) <= 1, 'heaps differ by at most one'\nassert m.median() == 4.0, f'median of [1,3,5,15] is 4.0, got {m.median()}'\nm2 = _MF()\nfor v in [2, 1, 3]:\n    add(m2, v)\nassert m2.median() == 2.0, f'median of [1,2,3] is 2, got {m2.median()}'\nprint('OK')",

  // ── Trees & Tries ──────────────────────────────────────────────────
  "lesson:tree-dfs:dfs-complete-1":
    "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nassert count(None) == 0, 'empty tree has 0 nodes'\nleaf = TreeNode(1)\nassert count(leaf) == 1, 'single node'\nroot = TreeNode(1, TreeNode(2, TreeNode(4), None), TreeNode(3))\nassert count(root) == 4, f'four nodes total, got {count(root)}'\nprint('OK')",
  "lesson:tree-bfs:bfs-complete-1":
    "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nassert levels(None) == [], 'empty tree -> no levels'\nassert levels(TreeNode(1)) == [[1]], 'single node -> one level'\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\nassert levels(root) == [[1], [2, 3], [4, 5]], f'level order wrong, got {levels(root)}'\nprint('OK')",
  "lesson:tree-traversals:trav-complete-1":
    "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nout = []\ninorder(None, out)\nassert out == [], 'empty tree yields nothing'\nout = []\ninorder(TreeNode(1), out)\nassert out == [1], 'single node'\n# BST: 2 with left 1 and right 3 -> inorder is sorted [1,2,3]\nroot = TreeNode(2, TreeNode(1), TreeNode(3))\nout = []\ninorder(root, out)\nassert out == [1, 2, 3], f'inorder should be left,node,right, got {out}'\n# Asymmetric tree pins the order (distinguishes pre/post-order).\nroot2 = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(5))\nout = []\ninorder(root2, out)\nassert out == [1, 2, 3, 4, 5], f'inorder wrong, got {out}'\nprint('OK')",
  "lesson:bst-operations:bst-complete-1":
    "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n# BST: 4 -> (2 -> 1,3) , (6 -> 5,7)\nroot = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(6, TreeNode(5), TreeNode(7)))\nassert search(root, 4) is True, 'root found'\nassert search(root, 1) is True, 'leftmost leaf found'\nassert search(root, 7) is True, 'rightmost leaf found'\nassert search(root, 5) is True, 'interior found via right then left'\nassert search(root, 8) is False, 'absent value'\nassert search(None, 1) is False, 'empty tree'\nprint('OK')",
  "lesson:tree-height-depth:height-complete-1":
    "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nassert height(None) == 0, 'empty tree height 0'\nassert height(TreeNode(1)) == 1, 'single node height 1'\n# Left-heavy chain of depth 3.\nroot = TreeNode(1, TreeNode(2, TreeNode(3), None), None)\nassert height(root) == 3, f'expected 3, got {height(root)}'\n# Balanced tree of height 2.\nbal = TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4), None))\nassert height(bal) == 3, f'taller branch wins, got {height(bal)}'\nprint('OK')",
  "lesson:lowest-common-ancestor:lca-complete-1":
    "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n# BST: 6 -> (2 -> 0,4) , (8 -> 7,9)\nroot = TreeNode(6, TreeNode(2, TreeNode(0), TreeNode(4)), TreeNode(8, TreeNode(7), TreeNode(9)))\nassert lca_bst(root, 0, 4) == 2, 'split at 2'\nassert lca_bst(root, 7, 9) == 8, 'split at 8'\nassert lca_bst(root, 0, 9) == 6, 'split at the root'\nassert lca_bst(root, 2, 4) == 2, 'ancestor is one of the nodes'\nassert lca_bst(root, 7, 8) == 8, 'q equals a node on the path'\nprint('OK')",
  "lesson:tree-construction:build-complete-1":
    "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\ndef height(node):\n    if node is None:\n        return 0\n    return 1 + max(height(node.left), height(node.right))\ndef inorder(node, out):\n    if node:\n        inorder(node.left, out)\n        out.append(node.val)\n        inorder(node.right, out)\nroot = build_bst([1, 2, 3, 4, 5, 6, 7])\nassert root is not None, 'non-empty array builds a tree'\nout = []\ninorder(root, out)\nassert out == [1, 2, 3, 4, 5, 6, 7], f'inorder must recover the sorted array, got {out}'\n# 7 sorted values -> balanced BST of height 3 (a chain would be height 7).\nassert height(root) == 3, f'balanced height should be 3, got {height(root)}'\nassert build_bst([]) is None, 'empty array -> None'\none = build_bst([42])\nassert one.val == 42 and one.left is None and one.right is None, 'single node'\nprint('OK')",
  "lesson:trie-insertion:trie-complete-1":
    "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\nt = Trie()\ninsert(t, 'cat')\nassert 'c' in t.root.children, 'first char inserted at root'\nnode = t.root.children['c'].children['a'].children['t']\nassert node.is_word is True, 'end of word marked'\ninsert(t, 'car')\n# shared prefix 'ca' must be reused, not duplicated\nca = t.root.children['c'].children['a']\nassert set(ca.children.keys()) == {'t', 'r'}, f'prefix shared, got {set(ca.children.keys())}'\nassert ca.children['r'].is_word is True, 'car marked as word'\nassert ca.is_word is False, 'ca is only a prefix, not a word'\nprint('OK')",
  "lesson:prefix-search:prefix-complete-1":
    "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_word = False\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def _add(self, word):\n        node = self.root\n        for ch in word:\n            node = node.children.setdefault(ch, TrieNode())\n        node.is_word = True\nt = Trie()\nt._add('apple')\nt._add('app')\nassert starts_with(t, 'app') is True, 'app is a prefix'\nassert starts_with(t, 'appl') is True, 'appl is a prefix'\nassert starts_with(t, 'apple') is True, 'the full word is its own prefix'\nassert starts_with(t, '') is True, 'empty prefix always matches'\nassert starts_with(t, 'apx') is False, 'path breaks -> False'\nassert starts_with(t, 'b') is False, 'missing first char -> False'\nprint('OK')",
  "lesson:avl-rotations:avl-complete-1":
    "class Node:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n# y=3 with left x=2 (whose right t=T), right=C. Right-rotate should make x root.\nt = Node('T')\nc = Node('C')\nx = Node(2, Node('L'), t)\ny = Node(3, x, c)\nnew_root = rotate_right(y)\nassert new_root is x, 'x becomes the new root'\nassert new_root.right is y, 'y becomes new_root.right'\nassert y.left is t, 'the middle subtree t reattaches as y.left'\nassert new_root.left.val == 'L', 'x keeps its left child'\nassert y.right is c, \"y's right child is unchanged\"\nprint('OK')",

  // ── Graphs ─────────────────────────────────────────────────────────
  "lesson:graph-representations:grep-complete-1":
    "# Directed adjacency list: edge u->v adds v to adj[u] only, not the reverse.\nadj = build([(0, 1), (0, 2), (1, 2)])\nassert sorted(adj[0]) == [1, 2], f'0 points to 1 and 2, got {adj[0]}'\nassert adj[1] == [2], f'1 points to 2, got {adj[1]}'\nassert adj[2] == [], f'2 has no out-edges (directed), got {adj[2]}'\n# Directed means the reverse edge is absent: 1 must NOT appear in adj under 2.\nassert 0 not in adj[1], 'edge is one-way: no back-edge to 0'\nassert build([]) == {} or list(build([]).items()) == [], 'no edges -> empty'\nprint('OK')",
  "lesson:adjacency-lists:adj-complete-1":
    "# Weighted undirected: each edge (u,v,w) appears in BOTH u and v lists.\nadj = build([(0, 1, 5), (1, 2, 3)])\nassert (1, 5) in adj[0], f'0 links to 1 with weight 5, got {adj[0]}'\nassert (0, 5) in adj[1], f'undirected: 1 links back to 0, got {adj[1]}'\nassert (2, 3) in adj[1] and (1, 3) in adj[2], 'both directions of the 1-2 edge'\nassert len(adj[1]) == 2, f'vertex 1 has two incident edges, got {adj[1]}'\nassert sorted(w for _, w in adj[0]) == [5], 'weight preserved on the stored tuple'\n# A lone edge must still appear from both endpoints.\nsa = build([(3, 4, 9)])\nassert (4, 9) in sa[3] and (3, 9) in sa[4], 'single edge recorded both ways'\n# No edges -> empty adjacency.\nassert build([]) == {} or list(build([]).items()) == [], 'no edges -> empty'\n# A star: center 0 linked to 1 and 2, each back to 0.\nst = build([(0, 1, 2), (0, 2, 7)])\nassert len(st[0]) == 2 and (0, 2) in st[1] and (0, 7) in st[2], 'star recorded both ways'\nprint('OK')",
  "lesson:graph-bfs:gbfs-complete-1":
    "from collections import defaultdict\nadj = defaultdict(list, {0: [1, 2], 1: [0, 3], 2: [0], 3: [1], 4: [5], 5: [4]})\nr = reachable(adj, 0)\nassert r == {0, 1, 2, 3}, f'component of 0 is {{0,1,2,3}}, got {r}'\nassert 4 not in r and 5 not in r, 'disconnected component 4-5 is unreachable'\nassert reachable(adj, 4) == {4, 5}, 'the other component'\nsolo = defaultdict(list, {7: []})\nassert reachable(solo, 7) == {7}, 'isolated vertex reaches only itself'\nprint('OK')",
  "lesson:graph-dfs:gdfs-complete-1":
    "from collections import defaultdict\nadj = defaultdict(list, {0: [1, 2], 1: [3], 2: [], 3: []})\norder = dfs_iter(adj, 0)\nassert set(order) == {0, 1, 2, 3}, f'visits every reachable node once, got {order}'\nassert len(order) == len(set(order)), 'no node recorded twice'\nassert order[0] == 0, 'starts at the start node'\n# Every non-start node must appear after a node that links to it (valid DFS walk).\npos = {v: k for k, v in enumerate(order)}\nassert pos[3] > pos[1], '3 is discovered after its only parent 1'\nsolo = defaultdict(list, {9: []})\nassert dfs_iter(solo, 9) == [9], 'isolated start'\nprint('OK')",
  "lesson:connected-components:cc-complete-1":
    "# Two components: {0,1,2} size 3 and {3,4} size 2 -> largest is 3.\nassert largest(5, [(0, 1), (1, 2), (3, 4)]) == 3, 'largest component has 3 nodes'\n# All isolated -> every component size 1.\nassert largest(4, []) == 1, 'no edges: largest component is a single vertex'\n# One big chain.\nassert largest(4, [(0, 1), (1, 2), (2, 3)]) == 4, 'single component spanning all'\n# Singleton graph.\nassert largest(1, []) == 1, 'one vertex'\nprint('OK')",
  "lesson:graph-cycle-detection:cyc-fix-1":
    "from collections import defaultdict\n# The fragment defines dfs(node, parent) using globals `seen` and `adj`.\n# Tree (no cycle): 0-1, 0-2. The buggy version wrongly reports the arrival\n# edge (child seeing its parent) as a cycle; the fixed one excludes the parent.\nadj = defaultdict(list, {0: [1, 2], 1: [0], 2: [0]})\nseen = set()\nassert dfs(0, -1) is False, 'a tree has no cycle (parent edge must be excluded)'\n# Real cycle: triangle 0-1-2-0.\nadj = defaultdict(list, {0: [1, 2], 1: [0, 2], 2: [0, 1]})\nseen = set()\nassert dfs(0, -1) is True, 'triangle contains a cycle'\nprint('OK')",
  "lesson:shortest-paths-unweighted:spu-complete-1":
    "from collections import defaultdict\nadj = defaultdict(list, {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]})\ndist, parent = bfs_parents(adj, 0)\nassert dist == {0: 0, 1: 1, 2: 1, 3: 2}, f'BFS layer distances wrong, got {dist}'\nassert parent[0] is None, 'start has no parent'\nassert parent[1] == 0 and parent[2] == 0, 'both discovered directly from 0'\nassert parent[3] in (1, 2), f'3 discovered from a distance-1 node, got {parent[3]}'\n# Reconstruct the path 3 -> ... -> 0 and check it ends at the start.\nnode, path = 3, []\nwhile node is not None:\n    path.append(node)\n    node = parent[node]\nassert path[-1] == 0 and len(path) == 3, f'path has 3 hops back to 0, got {path}'\n# A line 0-1-2: distances step up by one and parents chain back.\nline = defaultdict(list, {0: [1], 1: [0, 2], 2: [1]})\nd2, p2 = bfs_parents(line, 0)\nassert d2 == {0: 0, 1: 1, 2: 2}, f'line distances wrong, got {d2}'\nassert p2[0] is None and p2[1] == 0 and p2[2] == 1, f'line parents wrong, got {p2}'\n# An isolated start reaches only itself.\nsolo = defaultdict(list, {5: []})\nd3, p3 = bfs_parents(solo, 5)\nassert d3 == {5: 0} and p3 == {5: None}, 'isolated start'\nprint('OK')",
  "lesson:union-find:uf-complete-1":
    "# find(self, x) is a method fragment; call it on a host exposing `parent`.\nclass _UF:\n    def __init__(self, parent):\n        self.parent = parent\n# Chain 0<-1<-2<-3 (each points to the one below). find must reach root 0.\nu = _UF([0, 0, 1, 2])\nassert find(u, 3) == 0, f'root of the chain is 0, got {find(u, 3)}'\nassert find(u, 0) == 0, 'root points to itself'\n# Path compression: after find(3) the deep node must point nearer the root\n# (grandparent hop), so parent[3] is no longer 2.\nu2 = _UF([0, 0, 1, 2])\nfind(u2, 3)\nassert u2.parent[3] != 3, 'find still returns via the chain'\nassert u2.parent[3] == 1, f'grandparent compression: parent[3] becomes 1, got {u2.parent[3]}'\nprint('OK')",

  // ── Linked lists ───────────────────────────────────────────────────
  "lesson:linked-list-slow-fast:llsf-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\n# Odd length: middle is the exact centre. [1,2,3,4,5] -> 3.\nassert middle(build([1, 2, 3, 4, 5])).val == 3, 'odd-length middle'\n# Even length: slow/fast lands on the second of the two middles. [1,2,3,4] -> 3.\nassert middle(build([1, 2, 3, 4])).val == 3, 'even-length upper middle'\nassert middle(build([1])).val == 1, 'singleton is its own middle'\nassert middle(build([1, 2])).val == 2, 'two nodes -> second'\nprint('OK')",
  "lesson:linked-list-cycle-detection:llcd-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\nassert has_cycle(build([1, 2, 3])) is False, 'acyclic list has no cycle'\nassert has_cycle(None) is False, 'empty list has no cycle'\nassert has_cycle(build([1])) is False, 'single node, no self-loop'\n# Build a cycle: tail links back to the second node.\na = Node(1); b = Node(2); c = Node(3); d = Node(4)\na.next = b; b.next = c; c.next = d; d.next = b\nassert has_cycle(a) is True, 'tail pointing back forms a cycle'\ns = Node(9); s.next = s\nassert has_cycle(s) is True, 'self-loop is a cycle'\nprint('OK')",
  "lesson:linked-list-reversal:llr-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(head):\n    out = []\n    seen = set()\n    while head is not None:\n        assert id(head) not in seen, 'cycle formed during reversal'\n        seen.add(id(head))\n        out.append(head.val)\n        head = head.next\n    return out\n# The buggy version returns the old head (now the tail), so to_list would give\n# just [1]; the fix returns prev, the true new head.\nassert to_list(reverse(build([1, 2, 3, 4]))) == [4, 3, 2, 1], 'full reversal'\nassert to_list(reverse(build([1]))) == [1], 'singleton unchanged'\nassert reverse(None) is None, 'empty list reverses to empty'\nassert to_list(reverse(build([5, 6]))) == [6, 5], 'two-node reversal'\nprint('OK')",
  "lesson:linked-list-middle:llmid-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\nassert middle_count(build([1, 2, 3, 4, 5])).val == 3, 'odd-length middle'\nassert middle_count(build([1, 2, 3, 4])).val == 3, 'even-length upper middle (n//2 steps)'\nassert middle_count(build([1])).val == 1, 'singleton'\nassert middle_count(build([1, 2])).val == 2, 'two nodes -> second'\nprint('OK')",
  "lesson:linked-list-dummy-nodes:lldn-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(head):\n    out = []\n    while head is not None:\n        out.append(head.val)\n        head = head.next\n    return out\nassert to_list(remove_all(build([1, 2, 6, 3, 6]), 6)) == [1, 2, 3], 'interior removals'\nassert to_list(remove_all(build([6, 1, 6]), 6)) == [1], 'removing the head node'\nassert to_list(remove_all(build([6, 6, 6]), 6)) == [], 'removing everything'\nassert to_list(remove_all(build([1, 2, 3]), 9)) == [1, 2, 3], 'target absent -> unchanged'\nassert remove_all(None, 1) is None, 'empty list'\nprint('OK')",
  "lesson:linked-list-dummy-nodes:lldn-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(head):\n    out = []\n    while head is not None:\n        out.append(head.val)\n        head = head.next\n    return out\n# The bug returns `head` (stale) when the first node is deleted; the fix returns\n# dummy.next. This case distinguishes them: removing the leading 6 must drop it.\nassert to_list(remove_all(build([6, 1, 2]), 6)) == [1, 2], 'leading node removed -> new head'\nassert to_list(remove_all(build([6, 6, 3]), 6)) == [3], 'multiple leading removals'\nassert to_list(remove_all(build([1, 6, 2]), 6)) == [1, 2], 'interior removal still works'\nassert to_list(remove_all(build([1, 2]), 9)) == [1, 2], 'no match -> unchanged'\nprint('OK')",
  "lesson:linked-list-deques:lldq-complete-1":
    "# FIFO use of a deque: the earliest enqueued item comes out first.\nfirst, rest = dequeue_front([1, 2, 3])\nassert first == 1, f'FIFO dequeue returns the earliest item, got {first}'\nassert rest == [2, 3], f'front removed, 2 and 3 remain in order, got {rest}'\n# A different input so a hard-coded answer cannot pass.\nf2, r2 = dequeue_front([9, 8, 7, 6])\nassert f2 == 9, f'earliest is 9, got {f2}'\nassert r2 == [8, 7, 6], f'remaining in order, got {r2}'\n# Single item leaves an empty queue.\nf3, r3 = dequeue_front([42])\nassert f3 == 42 and r3 == [], 'single item -> empty remainder'\nprint('OK')",

  // ── Dynamic programming & recursion ────────────────────────────────
  "lesson:dp-base-cases:dpbc-complete-1":
    "# 1+2+...+n with a base case at n == 0.\nassert total(0) == 0, 'base case: sum of nothing is 0'\nassert total(1) == 1\nassert total(5) == 15, '1+2+3+4+5 == 15'\nassert total(10) == 55\nprint('OK')",
  "lesson:dp-recursive-calls:dprc-complete-1":
    "assert fib(0) == 0\nassert fib(1) == 1\nassert fib(2) == 1, 'fib(2) == fib(1)+fib(0)'\nassert fib(10) == 55, 'fib(10) == 55'\nassert fib(7) == 13\nprint('OK')",
  "lesson:dp-backtracking:dpbt-complete-1":
    "# bt(cur, open_c, close_c) uses globals n and res to generate valid parens.\nn = 3\nres = []\nbt('', 0, 0)\nassert len(res) == 5, f'Catalan(3) == 5 valid strings, got {len(res)}'\nassert set(res) == {'((()))', '(()())', '(())()', '()(())', '()()()'}, f'wrong set, got {sorted(res)}'\nassert all(len(s) == 6 for s in res), 'every string uses all 3 pairs'\n# Validity: never more close than open at any prefix.\nfor s in res:\n    bal = 0\n    for ch in s:\n        bal += 1 if ch == '(' else -1\n        assert bal >= 0\n    assert bal == 0, f'balanced string, got {s}'\nn = 1\nres = []\nbt('', 0, 0)\nassert res == ['()'], f'n=1 yields just (), got {res}'\nprint('OK')",
  "lesson:dp-backtracking:dpbt-fix-1":
    "# bt(start, path) uses globals nums and res; missing undo leaks state.\nnums = [1, 2, 3]\nres = []\nbt(0, [])\ngot = sorted(tuple(x) for x in res)\nexpected = sorted([(), (1,), (1, 2), (1, 2, 3), (1, 3), (2,), (2, 3), (3,)])\nassert got == expected, f'all 8 subsets in correct membership, got {got}'\nassert len(res) == 8, f'2**3 == 8 subsets, got {len(res)}'\nnums = []\nres = []\nbt(0, [])\nassert res == [[]], f'empty input -> just the empty subset, got {res}'\nprint('OK')",
  "lesson:dp-subsets:dpss-complete-1":
    "nums = [1, 2, 3]\nres = []\nbt(0, [])\ngot = sorted(tuple(x) for x in res)\nexpected = sorted([(), (1,), (1, 2), (1, 2, 3), (1, 3), (2,), (2, 3), (3,)])\nassert got == expected, f'all 8 subsets, got {got}'\nassert len(res) == 8, f'2**3 subsets, got {len(res)}'\nnums = [7]\nres = []\nbt(0, [])\nassert sorted(tuple(x) for x in res) == [(), (7,)], 'singleton -> empty and itself'\nprint('OK')",
  "lesson:dp-subsets:dpss-fix-1":
    "# The bug stores the live `path` (alias), so every recorded subset ends as [].\nnums = [1, 2, 3]\nres = []\nbt(0, [])\ngot = sorted(tuple(x) for x in res)\nexpected = sorted([(), (1,), (1, 2), (1, 2, 3), (1, 3), (2,), (2, 3), (3,)])\nassert got == expected, f'snapshots must be independent copies, got {got}'\nassert sum(len(s) for s in res) == 12, f'total elements across subsets is 12, got {sum(len(s) for s in res)}'\n# A second, different input so a hard-coded result set cannot pass.\nnums = [7]\nres = []\nbt(0, [])\nassert sorted(tuple(x) for x in res) == [(), (7,)], f'singleton -> empty and itself, got {res}'\nprint('OK')",
  "lesson:dp-combinations:dpcomb-complete-1":
    "# bt(start, path) uses globals n and k to build k-combinations of 1..n.\nn = 4\nk = 2\nres = []\nbt(1, [])\ngot = sorted(tuple(x) for x in res)\nexpected = [(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)]\nassert got == expected, f'C(4,2) == 6 combinations, got {got}'\nassert all(len(c) == 2 for c in res), 'each combination has size k'\nn = 3\nk = 3\nres = []\nbt(1, [])\nassert [tuple(x) for x in res] == [(1, 2, 3)], f'C(3,3) is one combination, got {res}'\nprint('OK')",
  "lesson:dp-memoization:dpmemo-complete-1":
    "assert fib(0) == 0\nassert fib(1) == 1\nassert fib(10) == 55, 'fib(10) == 55'\nassert fib(20) == 6765, 'fib(20) via memo'\n# The memo dict must have been populated (proves caching happened, not raw recursion).\nassert isinstance(memo, dict) and memo.get(10) == 55, f'memo should cache fib(10)=55, got {memo.get(10)}'\nprint('OK')",

  // ── Range queries & string matching ────────────────────────────────
  "lesson:fenwick-tree:fen-complete-1":
    "# prefix(self, i) walks down the BIT via the lowest-set-bit trick.\n# Host holds a valid 1-indexed Fenwick tree over a = [3, 2, -1, 6, 5].\nclass _BIT:\n    def __init__(self):\n        # tree[i] = sum of a[i-lowbit(i)+1 .. i]; index 0 unused.\n        self.tree = [0, 3, 5, -1, 10, 5]\nb = _BIT()\nassert prefix(b, 1) == 3, f'prefix(1) = a1 = 3, got {prefix(b, 1)}'\nassert prefix(b, 3) == 4, f'prefix(3) = 3+2-1 = 4, got {prefix(b, 3)}'\nassert prefix(b, 4) == 10, f'prefix(4) = 3+2-1+6 = 10, got {prefix(b, 4)}'\nassert prefix(b, 5) == 15, f'prefix(5) = full sum = 15, got {prefix(b, 5)}'\nassert prefix(b, 0) == 0, 'empty prefix is 0 (loop must terminate at i==0)'\nprint('OK')",
  "lesson:segment-tree:seg-complete-1":
    "# update(self, i, value) refreshes leaf n+i then recomputes ancestors up to root.\nclass _Seg:\n    def __init__(self, data):\n        self.n = len(data)\n        self.tree = [0] * (2 * self.n)\n        for k, v in enumerate(data):\n            self.tree[self.n + k] = v\n        for k in range(self.n - 1, 0, -1):\n            self.tree[k] = self.tree[2 * k] + self.tree[2 * k + 1]\ns = _Seg([1, 2, 3, 4])\nassert s.tree[1] == 10, 'sanity: initial total is 10'\nupdate(s, 1, 10)  # a[1]: 2 -> 10, delta +8\nassert s.tree[s.n + 1] == 10, 'leaf updated'\nassert s.tree[1] == 18, f'root sum becomes 1+10+3+4 = 18, got {s.tree[1]}'\nupdate(s, 3, 0)  # a[3]: 4 -> 0\nassert s.tree[1] == 14, f'root sum becomes 1+10+3+0 = 14, got {s.tree[1]}'\n# Ancestor of leaf 0 must also stay consistent.\nupdate(s, 0, 5)  # a[0]: 1 -> 5\nassert s.tree[1] == 18, f'root sum becomes 5+10+3+0 = 18, got {s.tree[1]}'\nassert s.tree[2] == 15, f'left half (5+10) refreshed, got {s.tree[2]}'\nprint('OK')",


  // ── R6 runnable fragments (indices 0-40 of remaining) ──────────────
  "lesson:io:io-fix-1":
    "assert double('7') == 14, f'double of 7 should be 14, got {double(\"7\")!r} (string version gives 77)'\nassert double('3') == 6\nassert double('0') == 0\nassert double('-5') == -10\nprint('OK')",
  "lesson:errors:err-complete-1":
    "assert safe_div(10, 0) == 'undefined', f\"division by zero should return undefined, got {safe_div(10, 0)!r}\"\nassert safe_div(6, 2) == 3\nassert safe_div(9, 0) == 'undefined'\nassert safe_div(7, 2) == 3.5\nprint('OK')",
  "lesson:sliding-window:sw-complete-1":
    "assert final_window([1, 3, 5, 2, 8, 4], 3) == 14, f'sum of last 3 = 14, got {final_window([1,3,5,2,8,4],3)}'\nassert final_window([1, 2, 3, 4], 2) == 7, 'last two: 3+4'\nassert final_window([5, 5, 5], 3) == 15, 'whole array as the window'\nassert final_window([10, 1, 1, 1], 1) == 1, 'width-1 window ends on last element'\nprint('OK')",
  "lesson:binary-search-answer:bsa-fix-1":
    "assert search_answer(lambda c: c >= 5, 1, 10) == 5, 'smallest feasible is 5'\nassert search_answer(lambda c: c >= 1, 1, 10) == 1, 'everything feasible -> lo'\nassert search_answer(lambda c: c >= 10, 1, 10) == 10, 'only the top is feasible'\nassert search_answer(lambda c: c >= 7, 0, 100) == 7\nprint('OK')",
  "lesson:bubble-sort:bub-fix-1":
    "assert bubble_sort([5, 1, 4, 2, 8]) == [1, 2, 4, 5, 8], 'sorts a mixed list'\nassert bubble_sort([]) == [], 'empty list'\nassert bubble_sort([1]) == [1], 'single element'\nassert bubble_sort([3, 2, 1]) == [1, 2, 3], 'reversed input'\nassert bubble_sort([2, 2, 1]) == [1, 2, 2], 'duplicates'\nprint('OK')",
  "lesson:selection-sort:sel-complete-1":
    "assert selection_sort([5, 1, 4, 2, 8]) == [1, 2, 4, 5, 8], 'sorts a mixed list'\nassert selection_sort([]) == [], 'empty list'\nassert selection_sort([1]) == [1], 'single element'\nassert selection_sort([3, 2, 1]) == [1, 2, 3], 'reversed input'\nassert selection_sort([4, 4, 2]) == [2, 4, 4], 'duplicates'\nprint('OK')",
  "lesson:insertion-sort:ins-fix-1":
    "assert insertion_sort([5, 1, 4, 2, 8]) == [1, 2, 4, 5, 8], 'sorts a mixed list'\nassert insertion_sort([]) == [], 'empty list'\nassert insertion_sort([1]) == [1], 'single element'\nassert insertion_sort([3, 2, 1]) == [1, 2, 3], 'reversed input (max shifting)'\nassert insertion_sort([2, 1, 2]) == [1, 2, 2], 'duplicates'\nprint('OK')",
  "lesson:counting-sort:cnt-complete-1":
    "assert tally([2, 0, 2, 3, 1, 3, 3], 3) == [1, 1, 2, 3], f'tally wrong, got {tally([2,0,2,3,1,3,3],3)}'\nassert tally([], 0) == [0], 'empty input, hi=0'\nassert tally([0, 0, 0], 0) == [3], 'all zeros'\nassert tally([1, 1, 2], 2) == [0, 2, 1], 'nothing in bucket 0'\nprint('OK')",
  "lesson:radix-sort:rad-complete-1":
    "b = bucketize([23, 45, 12, 5, 40], 1)\nassert b[0] == [40] and b[3] == [23] and b[5] == [45, 5] and b[2] == [12], f'ones-digit buckets wrong, got {b}'\nassert sum(len(x) for x in b) == 5, 'every element placed once'\n# tens place: 23->2, 45->4, 12->1, 5->0, 40->4\nb2 = bucketize([23, 45, 12, 5, 40], 10)\nassert b2[2] == [23] and b2[4] == [45, 40] and b2[1] == [12] and b2[0] == [5], f'tens-digit buckets wrong, got {b2}'\nassert len(bucketize([], 1)) == 10, 'always 10 buckets'\nprint('OK')",
  "lesson:comparators:cmp-complete-1":
    "assert sort_people([('Bo', 30), ('Al', 30), ('Cy', 25)]) == [('Cy', 25), ('Al', 30), ('Bo', 30)], 'age then name'\nassert sort_people([]) == [], 'empty'\nassert sort_people([('Z', 1)]) == [('Z', 1)], 'single'\n# same age, reverse-alphabetical input must come out alphabetical by name\nassert sort_people([('Di', 40), ('An', 40)]) == [('An', 40), ('Di', 40)], 'tie broken by name'\nprint('OK')",
  "lesson:interval-sorting:isort-complete-1":
    "assert sort_by_end([[1, 5], [2, 3], [4, 6]]) == [[2, 3], [1, 5], [4, 6]], 'sort by end'\nassert sort_by_end([]) == [], 'empty'\nassert sort_by_end([[0, 9]]) == [[0, 9]], 'single'\nassert sort_by_end([[5, 8], [1, 2], [3, 4]]) == [[1, 2], [3, 4], [5, 8]], 'already end-ordered after sort'\nprint('OK')",
  "lesson:monotonic-stack:mono-fix-1":
    "assert mono_stack([2, 1, 5, 3]) == [2, 3], f'indices of the decreasing run ending at end, got {mono_stack([2,1,5,3])}'\nassert mono_stack([]) == [], 'empty'\nassert mono_stack([1, 2, 3]) == [2], 'strictly increasing: only the last index survives'\nassert mono_stack([3, 2, 1]) == [0, 1, 2], 'strictly decreasing: all indices kept'\n# entries must be indices, not values (the value-storing bug gives [5, 3] here):\nassert all(0 <= s < 4 for s in mono_stack([2, 1, 5, 3]))\nprint('OK')",
  "lesson:expression-evaluation:expr-fix-1":
    "assert apply_sub([5, 3]) == [2], f'5 - 3 == 2, got {apply_sub([5, 3])}'\nassert apply_sub([3, 5]) == [-2], 'order matters: 3 - 5 == -2'\nassert apply_sub([10, 4, 1]) == [10, 3], 'operates on the TOP two, leaving the rest'\nassert apply_sub([7, 7]) == [0]\nprint('OK')",
  "lesson:bfs-queues:bfs-fix-1":
    "assert sorted(order) == [0, 1, 2, 3], f'BFS should visit each node, got {order}'\nassert len(order) == len(set(order)), f'no node visited twice, got {order}'\nassert order[0] == 0\n# The fixed version enqueues each of the 3 non-start nodes exactly once.\n# The buggy 'mark on dequeue' version enqueues a node once per in-edge (more).\nassert _appends['n'] == 3, f'each non-start node enqueued exactly once (buggy over-enqueues), got {_appends[\"n\"]}'\nprint('OK')",
  "lesson:prefix-sums-map:psm-fix-1":
    "assert count_subarrays([3, 1, 2], 3) == 2, 'subarrays summing to 3: [3] and [1,2] (buggy seed {} misses the index-0 one)'\nassert count_subarrays([1, 1, 1], 2) == 2\nassert count_subarrays([1, 2, 3], 3) == 2, '[1,2] and [3]'\nassert count_subarrays([1, -1, 0], 0) == 3, 'handles negatives'\nassert count_subarrays([], 0) == 0, 'empty array'\nassert count_subarrays([5], 5) == 1, 'single matching element'\nprint('OK')",
  "lesson:top-k:topk-fix-1":
    "assert top_k([4, 1, 7, 3, 8, 2], 3) == [4, 7, 8], 'the three largest (buggy keeps the smallest)'\nassert top_k([5, 1, 4, 2, 3], 1) == [5], 'the single largest'\nassert top_k([3, 3, 3], 2) == [3, 3], 'duplicates allowed'\nassert top_k([2, 1], 5) == [1, 2], 'k larger than list returns all sorted'\nassert top_k([], 3) == [], 'empty input'\nprint('OK')",
  "lesson:two-heap-pattern:twoheap-fix-1":
    "import heapq\ndef _median(small, large):\n    if len(small) == len(large):\n        return (-small[0] + large[0]) / 2\n    return float(-small[0])\n# A single insert must land in small with large empty.\nsm, lg = [], []\ninsert(sm, lg, 7)\nassert len(sm) == 1 and len(lg) == 0, f'one insert seeds small, got small={sm} large={lg}'\n# After each insert the heaps stay balanced (small never smaller than large).\nsm, lg = [], []\nfor v in [5, 15, 1, 3]:\n    insert(sm, lg, v)\n    assert len(sm) >= len(lg), f'small must not be smaller than large (buggy skips rebalance), got small={sm} large={lg}'\n    assert len(sm) - len(lg) <= 1, 'heaps differ by at most one'\nassert _median(sm, lg) == 4.0, f'median of [1,3,5,15] is 4.0, got {_median(sm, lg)}'\nsm2, lg2 = [], []\nfor v in [2, 1, 3]:\n    insert(sm2, lg2, v)\nassert _median(sm2, lg2) == 2.0, 'median of [1,2,3] is 2'\nprint('OK')",
  "lesson:topological-sort:topo-complete-1":
    "order = kahn({0: [1, 2], 1: [3], 2: [3], 3: []}, {0: 0, 1: 1, 2: 1, 3: 2})\nassert order == [0, 1, 2, 3], f'Kahn order (buggy forgets to queue newly-zeroed nodes), got {order}'\nassert kahn({0: [1], 1: [2], 2: []}, {0: 0, 1: 1, 2: 1}) == [0, 1, 2], 'simple chain'\nassert len(kahn({0: [1], 1: [0]}, {0: 1, 1: 1})) == 0, 'a cycle emits no node'\nassert kahn({0: []}, {0: 0}) == [0], 'single node'\no4 = kahn({0: [2], 1: [2], 2: []}, {0: 0, 1: 0, 2: 2})\nassert sorted(o4) == [0, 1, 2] and o4[-1] == 2, f'two roots feed node 2 last, got {o4}'\nprint('OK')",
  "lesson:multi-source-bfs:msbfs-fix-1":
    "dist, q = seed_sources(5, [0, 4])\nassert dist == [0, -1, -1, -1, 0], f'all sources start at distance 0 (buggy seeds only the first), got {dist}'\nassert sorted(q) == [0, 4], f'all sources enqueued, got {sorted(q)}'\ndist, q = seed_sources(3, [1])\nassert dist == [-1, 0, -1] and q == [1], 'single source'\ndist, q = seed_sources(4, [0, 1, 2, 3])\nassert dist == [0, 0, 0, 0] and sorted(q) == [0, 1, 2, 3], 'every vertex a source'\ndist, q = seed_sources(2, [])\nassert dist == [-1, -1] and q == [], 'no sources leaves all unreached'\nprint('OK')",
  "lesson:dijkstra:dij-fix-1":
    "assert dist == [0, 1, 2, 3], f'shortest distances from 0, got {dist}'\n# With the stale-skip each of the 4 nodes expands its neighbor list exactly once.\n# The buggy version also expands stale duplicate pops -> more than 4 expansions.\nassert _expand['n'] == 4, f'stale entries must be skipped (buggy over-expands), got {_expand[\"n\"]}'\nprint('OK')",
  "lesson:bellman-ford:bf-complete-1":
    "d = bellman_ford([(0, 1, 4), (0, 2, 5), (1, 2, -2), (2, 3, 3)], 4, 0)\nassert d == [0, 4, 2, 5], f'shortest distances, got {d}'\n# Negative cycle 0->1->0 with total -1 must be detected.\nassert bellman_ford([(0, 1, 1), (1, 0, -2)], 2, 0) is None, 'negative cycle -> None'\n# No-cycle single edge.\nassert bellman_ford([(0, 1, 7)], 2, 0) == [0, 7], 'simple two-node graph'\nprint('OK')",
  "lesson:floyd-warshall:fw-fix-1":
    "INF = float('inf')\nd = floyd_warshall([[0, 3, INF, 7], [8, 0, 2, INF], [5, INF, 0, 1], [2, INF, INF, 0]], 4)\nassert d[0] == [0, 3, 5, 6], f'row 0 all-pairs shortest, got {d[0]}'\nassert d[1] == [5, 0, 2, 3], f'row 1, got {d[1]}'\nassert d[2] == [3, 6, 0, 1], f'row 2, got {d[2]}'\nassert d[3] == [2, 5, 7, 0], f'row 3, got {d[3]}'\n# A different graph so a hard-coded matrix cannot pass.\nd2 = floyd_warshall([[0, 1, INF], [INF, 0, 1], [1, INF, 0]], 3)\nassert d2[0] == [0, 1, 2], f'triangle row 0, got {d2[0]}'\nassert d2[1] == [2, 0, 1], f'triangle row 1, got {d2[1]}'\nassert d2[2] == [1, 2, 0], f'triangle row 2, got {d2[2]}'\n# Single vertex.\nassert floyd_warshall([[0]], 1) == [[0]], 'single vertex matrix unchanged'\nprint('OK')",
  "lesson:prim:prim-fix-1":
    "adj = {0: [(1, 1), (2, 4)], 1: [(0, 1), (2, 2), (3, 6)], 2: [(0, 4), (1, 2), (3, 3)], 3: [(1, 6), (2, 3)]}\nassert prim(adj, 4) == 6, f'MST weight is 1+2+3 = 6 (buggy revisits and overcounts), got {prim(adj, 4)}'\n# A different graph so a hard-coded total cannot pass.\nadj2 = {0: [(1, 10), (2, 1)], 1: [(0, 10), (2, 2)], 2: [(0, 1), (1, 2)]}\nassert prim(adj2, 3) == 3, f'MST weight is 1+2 = 3, got {prim(adj2, 3)}'\n# Single vertex: no edges, zero weight.\nassert prim({0: []}, 1) == 0, 'single vertex MST weight is 0'\nprint('OK')",
  "lesson:linked-list-traversal:ll-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\nassert collect(build([1, 2, 3])) == [1, 2, 3], f'values in order, got {collect(build([1, 2, 3]))}'\nassert collect(None) == [], 'empty list collects nothing'\nassert collect(build([7])) == [7], 'single node'\nassert collect(build([5, 4, 3, 2, 1])) == [5, 4, 3, 2, 1], 'longer list in order'\nprint('OK')",
  "lesson:linked-list-slow-fast:llsf-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\n# Odd length: exact centre.\nassert middle(build([1, 2, 3])).val == 2, f'middle of [1,2,3] is 2, got {middle(build([1,2,3])).val}'\n# Even length (buggy crashes on None.next.next): upper middle.\nassert middle(build([1, 2, 3, 4])).val == 3, f'even-length upper middle is 3, got {middle(build([1,2,3,4])).val}'\nassert middle(build([1])).val == 1, 'singleton is its own middle'\nassert middle(build([1, 2])).val == 2, 'two nodes -> second'\nprint('OK')",
  "lesson:linked-list-merging:llm-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None, src=None):\n        self.val = val\n        self.next = nxt\n        self.src = src\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h is not None:\n        out.append(h.val)\n        h = h.next\n    return out\nassert to_list(merge(build([1, 3, 5]), build([2, 4, 6]))) == [1, 2, 3, 4, 5, 6], 'interleaved merge'\n# Leftover tail must be attached: one list far longer than the other.\nassert to_list(merge(build([1]), build([2, 3, 4, 5]))) == [1, 2, 3, 4, 5], 'longer list tail kept'\nassert to_list(merge(None, build([1, 2]))) == [1, 2], 'empty left'\nassert to_list(merge(build([1, 2]), None)) == [1, 2], 'empty right'\nassert to_list(merge(None, None)) == [], 'both empty'\n# Stability: on a tie the LEFT node (needs <=) comes first.\nla = Node(1, None, 'L')\nlb = Node(1, None, 'R')\nmerged = merge(la, lb)\nassert merged is not None and merged.val == 1, 'a node must be spliced'\nassert merged.src == 'L', f'on a tie the left node comes first (needs <=), got {merged.src!r}'\nprint('OK')",
  "lesson:linked-list-pointer-manipulation:llpm-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h is not None:\n        out.append(h.val)\n        h = h.next\n    return out\nassert to_list(swap_pairs(build([1, 2, 3, 4]))) == [2, 1, 4, 3], f'adjacent pairs swapped, got {to_list(swap_pairs(build([1,2,3,4])))}'\n# Odd length: the trailing single node stays put.\nassert to_list(swap_pairs(build([1, 2, 3]))) == [2, 1, 3], 'odd tail stays'\nassert to_list(swap_pairs(build([1]))) == [1], 'single node unchanged'\nassert swap_pairs(None) is None, 'empty list'\nassert to_list(swap_pairs(build([1, 2, 3, 4, 5, 6]))) == [2, 1, 4, 3, 6, 5], 'three pairs'\nprint('OK')",
  "lesson:linked-list-pointer-manipulation:llpm-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h is not None:\n        out.append(h.val)\n        h = h.next\n    return out\n# The bug sets prev=second (the new front), skipping a node and corrupting the\n# next pair, so [1,2,3,4] does not become [2,1,4,3].\nassert to_list(swap_pairs(build([1, 2, 3, 4]))) == [2, 1, 4, 3], f'all pairs swapped, got {to_list(swap_pairs(build([1,2,3,4])))}'\nassert to_list(swap_pairs(build([1, 2, 3]))) == [2, 1, 3], 'odd tail stays'\nassert to_list(swap_pairs(build([1, 2]))) == [2, 1], 'single pair'\nassert swap_pairs(None) is None, 'empty list'\nassert to_list(swap_pairs(build([1, 2, 3, 4, 5, 6]))) == [2, 1, 4, 3, 6, 5], 'three pairs'\nprint('OK')",
  "lesson:linked-list-variants:llv-complete-1":
    "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n        self.prev = None\n# Append node 2 after tail node 1: both links must be set and the tail advances.\nt1 = Node(1)\nn2 = Node(2)\ntail = append(t1, n2)\nassert tail.val == 2, f'tail advanced to the new node, got {tail.val}'\nassert tail.prev is not None and tail.prev.val == 1, f'new node links back to old tail, got {tail.prev}'\nassert tail.prev.next is tail, 'old tail links forward to the new node'\n# Appending to an empty list: the node becomes the tail.\nn5 = Node(5)\nt = append(None, n5)\nassert t is n5 and t.prev is None, 'empty append -> node is the sole tail'\n# A second append chains correctly.\nn3 = Node(3)\ntail2 = append(tail, n3)\nassert tail2.val == 3 and tail2.prev.val == 2 and tail2.prev.next is tail2, 'chained append links both ways'\nprint('OK')",
  "lesson:dp-base-cases:dpbc-fix-1":
    "assert fact(0) == 1, '0! == 1 (base case)'\nassert fact(1) == 1, '1! == 1'\nassert fact(5) == 120, '5! == 120'\nassert fact(6) == 720\n_orig = fact\n_calls = [0]\ndef fact(n):\n    _calls[0] += 1\n    return _orig(n)\nassert fact(3) == 6, '3! == 6'\n# fact(3) -> fact(2) -> fact(1) stops: exactly 3 calls. A base case of n<1 would\n# recurse once more (down to fact(0)) giving 4 calls.\nassert _calls[0] == 3, f'base case must stop at n<=1 (3 calls for fact(3)), got {_calls[0]}'\nprint('OK')",
  "lesson:dp-permutations:dpperm-complete-1":
    "got = sorted(tuple(p) for p in permutations([1, 2, 3]))\nexpected = sorted([(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)])\nassert got == expected, f'all 6 permutations, got {got}'\nassert all(len(p) == 3 for p in permutations([1, 2, 3])), 'each permutation uses all elements'\n# A different-size input so a hard-coded result cannot pass.\nassert sorted(tuple(p) for p in permutations([1, 2])) == [(1, 2), (2, 1)], 'two-element permutations'\nassert permutations([7]) == [[7]], 'singleton'\nassert permutations([]) == [[]], 'empty input -> the empty permutation'\nprint('OK')",
  "lesson:dp-permutations:dpperm-fix-1":
    "# The buggy version never clears used[i] on backtrack, so after taking the\n# first element every deeper slot stays blocked and most orderings are lost.\ngot = sorted(tuple(p) for p in permutations([1, 2, 3]))\nexpected = sorted([(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)])\nassert got == expected, f'all 6 permutations (buggy truncates), got {got}'\nassert sorted(tuple(p) for p in permutations([1, 2])) == [(1, 2), (2, 1)], 'two-element permutations'\nassert permutations([7]) == [[7]], 'singleton'\nassert permutations([]) == [[]], 'empty input -> the empty permutation'\nprint('OK')",
  "lesson:dp-knapsack:dpks-complete-1":
    "# weights [2,3], values [3,4], capacity 3: take item 2 (w3,v4) -> 4 beats item 1 (w2,v3).\nassert knapsack([2, 3], [3, 4], 3) == 4, f'best value at capacity 3 is 4, got {knapsack([2, 3], [3, 4], 3)}'\n# Larger capacity fits both items -> 3 + 4 = 7.\nassert knapsack([2, 3], [3, 4], 5) == 7, f'both items fit -> 7, got {knapsack([2, 3], [3, 4], 5)}'\n# Classic instance.\nassert knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7) == 9, f'best is items w3+w4 -> 9, got {knapsack([1,3,4,5],[1,4,5,7],7)}'\n# Nothing fits.\nassert knapsack([5], [10], 3) == 0, 'item too heavy -> 0'\nassert knapsack([], [], 5) == 0, 'no items -> 0'\nprint('OK')",
  "lesson:dp-subsequences:dpsub-complete-1":
    "assert is_subsequence('abc', 'ahbgdc') is True, 'abc is a subsequence of ahbgdc'\nassert is_subsequence('axc', 'ahbgdc') is False, 'axc is not a subsequence'\nassert is_subsequence('', 'anything') is True, 'empty is always a subsequence'\nassert is_subsequence('abc', '') is False, 'non-empty cannot be a subsequence of empty'\nassert is_subsequence('aaa', 'aa') is False, 'needs three a but only two available'\nprint('OK')",

  // ── R6 runnable fragments (indices 41-80 of remaining) ─────────────
  "lesson:dp-grid-paths:dpgp-fix-1":
    "assert min_path_sum([[1,3,1],[1,5,1],[4,2,1]]) == 7, 'path 1->3->1->1->1'\nassert min_path_sum([[1,2,3],[4,5,6]]) == 12\nassert min_path_sum([[5]]) == 5\nassert min_path_sum([[1,2,5],[3,2,1]]) == 6\nassert min_path_sum([[1,2],[1,1]]) == 3\nprint('OK')",
  "lesson:dp-lcs:dplcs-complete-1":
    "assert lcs('abcde', 'ace') == 3, 'ace'\nassert lcs('abc', 'abc') == 3\nassert lcs('abc', 'def') == 0\nassert lcs('', 'abc') == 0\nassert lcs('aggtab', 'gxtxayb') == 4, 'gtab'\nprint('OK')",
  "lesson:dp-n-queens:dpnq-fix-1":
    "assert count_n_queens(1) == 1\nassert count_n_queens(2) == 0\nassert count_n_queens(3) == 0\nassert count_n_queens(4) == 2\nassert count_n_queens(5) == 10\nprint('OK')",
  "pattern:kadane:pat-kadane-fix-1":
    "assert kadane([-2, -3, -1, -4]) == -1, 'all-negative: best is the single largest element (-1), not 0'\nassert kadane([1, 2, 3]) == 6, 'all-positive: whole array'\nassert kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6, 'classic mixed case'\nassert kadane([5]) == 5, 'single element'\nassert kadane([-7]) == -7, 'single negative element'\nprint('OK')",
  "pattern:bfs-shortest-path:pat-bfs-fix-1":
    "assert bfs_dist({0: [1, 2], 1: [4], 2: [3], 3: [4], 4: []}, 0) == {0: 0, 1: 1, 2: 1, 3: 2, 4: 2}, 'BFS gives shortest hops; a stack/DFS reports dist[4]=3'\nassert bfs_dist({0: [1], 1: [2], 2: []}, 0) == {0: 0, 1: 1, 2: 2}, 'chain'\nassert bfs_dist({0: []}, 0) == {0: 0}, 'single node'\nassert bfs_dist({0: [1, 2], 1: [], 2: []}, 0) == {0: 0, 1: 1, 2: 1}, 'star'\nprint('OK')",
  "pattern:backtracking:pat-bt-fix-1":
    "assert sorted(subsets([1, 2]), key=lambda s: (len(s), s)) == [[], [1], [2], [1, 2]]\nassert subsets([]) == [[]], 'only the empty subset'\nassert sorted(subsets([5]), key=len) == [[], [5]]\ng = sorted(subsets([1, 2, 3]), key=lambda s: (len(s), s))\nassert g == [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]], f'all 8 subsets, got {g}'\nprint('OK')",
  "pattern:two-heaps:pat-th-fix-1":
    "s, l = add_lower([-10], [], 5)\nassert l == [10], f'largest of lower half (10) moves up, got {l}'\nassert s == [-5], f'lower half keeps 5 as negated max-heap, got {s}'\ns, l = add_lower([], [], 3)\nassert l == [3] and s == [], f'first element flows up, got s={s} l={l}'\ns, l = add_lower([-7, -2], [], 9)\nassert l == [9], f'new max 9 moves up, got {l}'\nassert sorted(-v for v in s) == [2, 7], f'lower half keeps 2 and 7, got {s}'\nprint('OK')",
  "pattern:k-way-merge:pat-kwm-fix-1":
    "heap = seed_heap([[1, 4], [1, 5]])\nassert len(heap) == 2, f'both non-empty lists seeded, got {len(heap)}'\nassert all(len(e) == 3 and isinstance(e[1], int) and isinstance(e[2], int) for e in heap), f'entries must be (val, i, j) triples with int tiebreakers, got {heap}'\nimport heapq\nassert heapq.heappop(heap) == (1, 0, 0)\nassert heapq.heappop(heap) == (1, 1, 0), 'tie resolves on list index'\nheap2 = seed_heap([[], [3], [2]])\nassert sorted(heap2) == [(2, 2, 0), (3, 1, 0)], f'empty list skipped, got {heap2}'\nprint('OK')",
  "pattern:monotonic-stack:pat-ms-fix-1":
    "assert next_greater([2, 1, 2, 4, 3]) == [4, 2, 4, -1, -1]\nassert next_greater([1, 2, 3]) == [2, 3, -1]\nassert next_greater([3, 2, 1]) == [-1, -1, -1]\nassert next_greater([5]) == [-1]\nassert next_greater([2, 7, 3, 5, 1]) == [7, -1, 5, -1, -1]\nprint('OK')",
  "pattern:merge-intervals:pat-mi-fix-1":
    "assert merge_intervals([[1,4],[2,3],[4,5]]) == [[1,5]], 'overlap + touch'\nassert merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]\nassert merge_intervals([[1,2],[5,6]]) == [[1,2],[5,6]], 'disjoint'\nassert merge_intervals([]) == []\nassert merge_intervals([[1,10],[2,3]]) == [[1,10]], 'contained'\nprint('OK')",
  "pattern:cyclic-sort:pat-cs-fix-1":
    "assert cyclic_sort([2, 0, 2, 1]) == [0, 1, 2, 2], 'duplicate must not loop forever'\nassert cyclic_sort([3, 2, 1, 0]) == [0, 1, 2, 3]\nassert cyclic_sort([0]) == [0]\nassert cyclic_sort([1, 1, 1]) == [1, 1, 1], 'all duplicates'\nassert cyclic_sort([]) == []\nprint('OK')",
  "pattern:matrix-traversal:pat-mt-fix-1":
    "assert spiral([[1,2,3]]) == [1,2,3], 'single row: no double-visit'\nassert spiral([[1],[2],[3]]) == [1,2,3], 'single column'\nassert spiral([[1,2,3],[4,5,6],[7,8,9]]) == [1,2,3,6,9,8,7,4,5]\nassert spiral([[1,2],[3,4]]) == [1,2,4,3]\nr = spiral([[1,2,3],[4,5,6]])\nassert r == [1,2,3,6,5,4] and len(r) == len(set(r)), 'each cell once'\nprint('OK')",
  "pattern:tree-bfs:pat-tbfs-fix-1":
    "class _T:\n    def __init__(self, val, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\nroot = _T(1, _T(2, _T(4), None), _T(3, None, _T(5)))\nassert level_order(root) == [[1], [2, 3], [4, 5]], 'grouped by depth, not flattened'\nassert level_order(None) == []\nassert level_order(_T(7)) == [[7]]\nassert level_order(_T(1, _T(2, _T(3)))) == [[1], [2], [3]], 'left-skewed, one node per level'\nprint('OK')",
  "pattern:tree-dfs:pat-tdfs-fix-1":
    "class _T:\n    def __init__(self, val, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\nroot = _T(1, _T(2, _T(4), _T(5)), _T(3))\nassert sorted(root_to_leaf(root)) == [[1, 2, 4], [1, 2, 5], [1, 3]], 'path.pop() must unwind between subtrees'\nassert root_to_leaf(None) == []\nassert root_to_leaf(_T(9)) == [[9]], 'single leaf'\nassert sorted(root_to_leaf(_T(1, _T(2), _T(3)))) == [[1, 2], [1, 3]]\nprint('OK')",
  "pattern:graph-dfs-components:pat-gdc-fix-1":
    "assert count_components(3, [[0, 1], [1, 2], [2, 0]]) == 1, 'cyclic triangle: one component, must not loop forever'\nassert count_components(5, [[0, 1], [2, 3]]) == 3, 'two edges + isolated 4'\nassert count_components(4, []) == 4, 'no edges: all isolated'\nassert count_components(1, []) == 1\nassert count_components(6, [[0, 1], [1, 2], [3, 4]]) == 3\nprint('OK')",
  "pattern:topological-sort:pat-topo-fix-1":
    "o = topo_order({0: [2], 1: [2], 2: [3], 3: []}, {0: 0, 1: 0, 2: 2, 3: 1})\npos = {v: k for k, v in enumerate(o)}\nassert set(o) == {0, 1, 2, 3}, f'every node once, got {o}'\nassert pos[2] > pos[0] and pos[2] > pos[1], f'2 after its prerequisites, got {o}'\nassert pos[3] == 3, f'3 last, got {o}'\nassert topo_order({0: [1], 1: [2], 2: []}, {0: 0, 1: 1, 2: 1}) == [0, 1, 2], 'chain'\nassert topo_order({0: [1], 1: [0]}, {0: 1, 1: 1}) == [], 'a cycle emits no node'\nassert topo_order({0: []}, {0: 0}) == [0], 'single node'\nprint('OK')",
  "pattern:union-find:pat-uf-fix-1":
    "# find(self, x) is a method fragment; call it on a host exposing `parent`.\nclass _UF:\n    def __init__(self, parent):\n        self.parent = parent\n# Chain 0<-1<-2<-3. find must return root 0 for every node.\nu = _UF([0, 0, 1, 2])\nassert find(u, 3) == 0, f'root of the chain is 0, got {find(u, 3)}'\nassert find(u, 0) == 0, 'root points to itself'\n# Path compression: after find(3) the deep node hops nearer the root.\nu2 = _UF([0, 0, 1, 2])\nfind(u2, 3)\nassert u2.parent[3] != 2, f'compression must shorten parent[3] (no-compression leaves it 2), got {u2.parent[3]}'\nprint('OK')",
  "pattern:dijkstra:pat-dij-fix-1":
    "# Shortest paths from 0 on a small weighted graph.\nassert dist == [0, 1, 2, 3], f'shortest distances from 0, got {dist}'\n# With the stale-skip each node expands its neighbours at most once; the buggy\n# version reprocesses stale pops and over-expands.\nassert _expand['n'] == 4, f'stale entries skipped (buggy over-expands), got {_expand[\"n\"]}'\nprint('OK')",
  "pattern:trie-prefix:pat-trie-fix-1":
    "assert search(['app'], 'app') is True, 'stored word found'\nassert search(['app'], 'ap') is False, 'a prefix that is not a stored word'\nassert search(['app'], 'apple') is False, 'path breaks'\nassert search(['app', 'application'], 'application') is True, 'longer stored word found (defeats len-based guess)'\nassert search(['app', 'application'], 'appl') is False, 'intermediate prefix is not a word'\nassert search([], 'x') is False\nprint('OK')",
  "pattern:dynamic-programming:pat-dp-fix-1":
    "assert fib(0) == 0 and fib(1) == 1, 'base cases'\nassert fib(10) == 55, 'fib(10) == 55'\nassert fib(20) == 6765, 'fib(20) == 6765'\n# Memoization must make a large index return quickly (no exponential blow-up).\nassert fib(60) == 1548008755920, 'memoized fib(60) is exact and fast'\nprint('OK')",
  "pattern:knapsack:pat-ks-fix-1":
    "assert subset_sum([3], 6) is False, 'each item used at most once'\nassert subset_sum([3], 3) is True\nassert subset_sum([1,2,3], 0) is True, 'empty subset'\nassert subset_sum([2,3,7,8,10], 11) is True, '3+8'\nassert subset_sum([1,2,5], 4) is False\nprint('OK')",
};

export const EXERCISE_RECOGNITION: Record<string, RecognitionGrading> = {
  // ── Pattern-Library recognition drills (ownerKind === "pattern") ───────────
  "pattern:sliding-window:pat-sw-recognize-1": {
    scenario:
      "Given an array of integers and a number k, you must find the largest sum of exactly k consecutive elements.",
    approaches: [
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: ["contiguous-fixed-k"] },
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: [], rejectionFeedback: "Kadane finds the best subarray of ANY length; here the width is pinned at exactly k, so Kadane solves a different problem." },
      { id: "prefix-map", label: "Prefix sums + hash map", requiredReasonIds: [], rejectionFeedback: "A prefix-sum map is for counting arbitrary-range target sums; for a single fixed width it is overkill." },
    ],
    reasons: [
      { id: "contiguous-fixed-k", text: "The block is contiguous and of fixed width k, so the sum updates in O(1) as the window slides (add the entering element, drop the leaving one)." },
      { id: "any-length-best", text: "We want the best subarray of any length, so we must decide extend-or-restart at each index.", contradictory: true },
      { id: "count-targets", text: "We must count how many subarrays hit a target sum.", contradictory: true },
    ],
    acceptableApproachIds: ["fixed-window"],
    modelExplanation:
      "Fixed-size sliding window: the width is fixed at k, so slide the window and update the running sum incrementally for an O(n) solution.",
  },
  "pattern:sliding-window:pat-sw-recognize-2": {
    scenario:
      "Find the length of the longest substring that contains at most 2 distinct characters. No pattern name is given.",
    approaches: [
      { id: "var-window", label: "Variable-size sliding window with a frequency map", requiredReasonIds: ["monotone-shrink"] },
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: [], rejectionFeedback: "The answer's length is unknown, so there is no fixed window width to slide." },
      { id: "enumerate", label: "Enumerate all substrings", requiredReasonIds: [], rejectionFeedback: "Enumerating every substring is O(n^2)+; the constraint is monotone so a window does it in O(n)." },
    ],
    reasons: [
      { id: "monotone-shrink", text: "The 'at most 2 distinct' condition is monotone: grow the right edge, and when it breaks, shrink from the left until valid again — O(n)." },
      { id: "fixed-width", text: "The substring has a known fixed width, so slide a constant window.", contradictory: true },
      { id: "needs-sorting", text: "The input must be sorted before scanning.", contradictory: true },
    ],
    acceptableApproachIds: ["var-window"],
    modelExplanation:
      "Variable-size sliding window: expand the right edge and contract the left whenever the distinct-count exceeds 2, tracking the longest valid width in O(n).",
  },
  "pattern:prefix-sums-hashmap:pat-ps-recognize-1": {
    scenario:
      "Count the number of contiguous subarrays whose sum is exactly k, where the array MAY contain negative numbers.",
    approaches: [
      { id: "prefix-map", label: "Prefix sums + hash map", requiredReasonIds: ["negatives-nonmonotone", "count-earlier-prefixes"] },
      { id: "sliding-window", label: "Sliding window", requiredReasonIds: [], rejectionFeedback: "With negatives the window sum is not monotone, so growing/shrinking a window cannot decide membership." },
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: [], rejectionFeedback: "Kadane maximizes a subarray sum; it does not count how many subarrays hit a target." },
    ],
    reasons: [
      { id: "negatives-nonmonotone", text: "Negatives make the running sum non-monotone, so a sliding window cannot decide when to shrink." },
      { id: "count-earlier-prefixes", text: "For each prefix sum, the number of earlier prefixes equal to (current − k) counts the qualifying subarrays in O(n)." },
      { id: "all-positive", text: "All values are positive, so the window sum only grows and a two-pointer window suffices.", contradictory: true },
    ],
    acceptableApproachIds: ["prefix-map"],
    modelExplanation:
      "Prefix sums + hash map: store counts of each prefix sum and add the count of prefixes equal to (current − k) at every step — O(n), and correct with negatives.",
  },
  "pattern:prefix-sums-hashmap:pat-ps-contrast-1": {
    scenario:
      "Three problems on the SAME integer array (with negatives): (a) largest sum of exactly k consecutive; (b) COUNT contiguous subarrays summing to a target; (c) largest sum of any contiguous subarray. This drill is about problem (b).",
    approaches: [
      { id: "prefix-map", label: "Prefix sums + hash map", requiredReasonIds: ["count-with-negatives"] },
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: [], rejectionFeedback: "That is the tool for (a): a fixed width k. Problem (b) has no fixed width and needs a count." },
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: [], rejectionFeedback: "That is the tool for (c): the max any-length sum. It does not count target-sum subarrays." },
    ],
    reasons: [
      { id: "count-with-negatives", text: "Problem (b) counts arbitrary-length subarrays hitting a target sum and tolerates negatives — prefix sums in a map handle exactly this." },
      { id: "fixed-k-tell", text: "The wording pins a fixed width k, so slide a constant window.", contradictory: true },
      { id: "max-any-tell", text: "The wording asks for the maximum any-length sum, so track extend-vs-restart.", contradictory: true },
    ],
    acceptableApproachIds: ["prefix-map"],
    modelExplanation:
      "Problem (b) — counting target-sum subarrays with negatives — is prefix sums + a hash map. The fixed-k wording signals a window (a); the 'max any-length' wording signals Kadane (c).",
  },
  "pattern:kadane:pat-kadane-recognize-1": {
    scenario:
      "Given an array with positives and negatives, find the largest sum of any non-empty contiguous subarray.",
    approaches: [
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: ["extend-or-restart"] },
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: [], rejectionFeedback: "No fixed width is given — the winning subarray can be any length — so a constant window does not apply." },
      { id: "prefix-map", label: "Prefix sums + hash map", requiredReasonIds: [], rejectionFeedback: "That counts target-sum subarrays; here we want the single maximum sum." },
    ],
    reasons: [
      { id: "extend-or-restart", text: "At each index decide whether to extend the best subarray ending here or restart from this element — one O(n) pass, O(1) space." },
      { id: "fixed-window-len", text: "The subarray length is fixed in advance, so slide a constant window.", contradictory: true },
      { id: "need-count", text: "We only need to count qualifying subarrays, not find a maximum.", contradictory: true },
    ],
    acceptableApproachIds: ["kadane"],
    modelExplanation:
      "Kadane's algorithm: track the best subarray sum ending at each index (extend vs restart) and the running maximum, in O(n) time and O(1) space.",
  },
  "pattern:two-pointers:pat-tp-recognize-1": {
    scenario:
      "Given a SORTED array, find two numbers that add up to a target. Both two pointers and a hash map are on the table.",
    approaches: [
      { id: "two-pointers", label: "Two pointers from both ends", requiredReasonIds: ["sorted-converge"] },
      { id: "hashmap", label: "Hash map of complements", requiredReasonIds: ["hash-complement"] },
      { id: "brute", label: "Check every pair (nested loops)", requiredReasonIds: [], rejectionFeedback: "O(n^2) ignores the sortedness that lets converging pointers solve it in O(n)." },
    ],
    reasons: [
      { id: "sorted-converge", text: "The array is already sorted, so a too-small sum means move the left pointer right and a too-big sum means move the right pointer left — O(n) time, O(1) space." },
      { id: "hash-complement", text: "A hash map storing each value's complement finds the pair in O(n) time regardless of order, at the cost of O(n) space." },
      { id: "need-all-pairs", text: "We must examine every pair to be sure, so nested loops are required.", contradictory: true },
    ],
    acceptableApproachIds: ["two-pointers"],
    alternatives: [
      { approachId: "hashmap", conditions: "Always works, sorted or not.", tradeoff: "Uses O(n) extra space, whereas two pointers on a sorted array is O(1) space.", requiredReasonIds: ["hash-complement"] },
    ],
    modelExplanation:
      "Two pointers from both ends exploit the existing sort for an O(n) time, O(1) space solution. A hash map also runs in O(n) time but costs O(n) space.",
  },
  "pattern:two-pointers:pat-tp-recognize-2": {
    scenario:
      "Check whether a string reads the same forwards and backwards, ignoring case.",
    approaches: [
      { id: "two-pointers", label: "Two pointers from both ends", requiredReasonIds: ["compare-inward"] },
      { id: "reverse-copy", label: "Build a reversed copy and compare", requiredReasonIds: [], rejectionFeedback: "Correct but uses O(n) extra space; converging pointers do it in O(1) space with early exit." },
      { id: "sort", label: "Sort the characters", requiredReasonIds: [], rejectionFeedback: "Sorting destroys order, which is the very thing a palindrome check depends on." },
    ],
    reasons: [
      { id: "compare-inward", text: "Compare characters at the two ends and move inward until the pointers cross; a mismatch means not a palindrome — O(n) time, O(1) space." },
      { id: "order-irrelevant", text: "Character order does not matter, so a frequency comparison suffices.", contradictory: true },
      { id: "needs-hashmap", text: "A hash map of counts is required to decide this.", contradictory: true },
    ],
    acceptableApproachIds: ["two-pointers"],
    modelExplanation:
      "Two pointers from both ends: compare s[lo] and s[hi] moving inward, exiting early on the first mismatch — O(n) time, O(1) space.",
  },
  "pattern:fast-slow-pointers:pat-fs-recognize-1": {
    scenario:
      "Detect whether a linked list has a cycle, using O(1) extra memory.",
    approaches: [
      { id: "floyd", label: "Fast & slow pointers (Floyd's)", requiredReasonIds: ["lap-in-cycle"] },
      { id: "visited-set", label: "Hash set of visited nodes", requiredReasonIds: [], rejectionFeedback: "It detects the cycle but stores up to n nodes — O(n) space, which the O(1) constraint forbids." },
    ],
    reasons: [
      { id: "lap-in-cycle", text: "A one-step pointer and a two-step pointer must eventually meet inside a cycle, giving O(1)-space detection." },
      { id: "set-membership", text: "Recording each visited node in a hash set detects a repeat visit, correctly finding a cycle when O(n) space is acceptable." },
      { id: "must-sort", text: "The nodes must be sorted before checking.", contradictory: true },
    ],
    acceptableApproachIds: ["floyd"],
    alternatives: [
      { approachId: "visited-set", conditions: "When O(n) extra memory is acceptable.", tradeoff: "Uses O(n) space versus Floyd's O(1).", requiredReasonIds: ["set-membership"] },
    ],
    modelExplanation:
      "Fast & slow pointers (Floyd's): the fast pointer laps the slow one inside any cycle, detecting it in O(n) time and O(1) space — satisfying the memory limit.",
  },
  "pattern:fast-slow-pointers:pat-fs-recognize-2": {
    scenario:
      "Return the middle node of a singly linked list in one pass.",
    approaches: [
      { id: "floyd", label: "Fast & slow pointers", requiredReasonIds: ["fast-double-speed"] },
      { id: "count-twice", label: "Count length, then walk to length/2", requiredReasonIds: [], rejectionFeedback: "That is two passes; the fast/slow method finds the middle in a single pass." },
    ],
    reasons: [
      { id: "fast-double-speed", text: "When the fast pointer (two steps at a time) reaches the end, the slow pointer (one step) sits at the middle — a single O(n) pass, O(1) space." },
      { id: "index-access", text: "You can index the middle directly because a linked list supports O(1) random access.", contradictory: true },
      { id: "needs-two-passes", text: "Finding the middle inherently requires two passes over the list.", contradictory: true },
    ],
    acceptableApproachIds: ["floyd"],
    modelExplanation:
      "Fast & slow pointers: advance fast by two and slow by one; when fast falls off the end, slow is at the middle — one pass, O(1) space.",
  },
  "pattern:bfs-shortest-path:pat-bfs-recognize-1": {
    scenario:
      "In a maze grid of open and wall cells, find the minimum number of steps from the start to the exit.",
    approaches: [
      { id: "bfs", label: "BFS for shortest paths", requiredReasonIds: ["unweighted-levels"] },
      { id: "dfs", label: "DFS", requiredReasonIds: [], rejectionFeedback: "DFS does not visit cells in increasing distance, so the first arrival is not guaranteed shortest." },
      { id: "dijkstra", label: "Dijkstra's algorithm", requiredReasonIds: [], rejectionFeedback: "Every move costs one step (unweighted), so Dijkstra's priority queue is unnecessary overhead — BFS suffices." },
    ],
    reasons: [
      { id: "unweighted-levels", text: "Each move costs one step, so BFS visits cells in increasing distance and reaches the exit via the fewest moves — O(V+E)." },
      { id: "weighted-edges", text: "The moves have differing costs, so a priority queue is required.", contradictory: true },
      { id: "path-context", text: "We must carry a running path sum down each route, so recursion is the natural fit.", contradictory: true },
    ],
    acceptableApproachIds: ["bfs"],
    modelExplanation:
      "BFS: the grid is an unweighted graph, so a breadth-first sweep reaches the exit by the fewest moves in O(V+E) over the cells.",
  },
  "pattern:bfs-shortest-path:pat-bfs-choose-1": {
    scenario:
      "You need the lowest-COST route in a network where roads have different positive travel times. Is BFS the right pattern?",
    approaches: [
      { id: "dijkstra", label: "Dijkstra's algorithm", requiredReasonIds: ["weighted-nonneg"] },
      { id: "bfs", label: "Plain BFS", requiredReasonIds: [], rejectionFeedback: "BFS finds the fewest EDGES, not the lowest cost; with unequal weights fewest-edges is not cheapest." },
    ],
    reasons: [
      { id: "weighted-nonneg", text: "Edge weights differ but are non-negative, so a priority queue that always settles the closest node gives correct shortest costs in O((V+E) log V)." },
      { id: "equal-weights", text: "All roads cost the same, so counting edges equals counting cost.", contradictory: true },
      { id: "negative-weights", text: "Some roads have negative cost, so only Bellman–Ford is safe here.", contradictory: true },
    ],
    acceptableApproachIds: ["dijkstra"],
    modelExplanation:
      "No — BFS minimizes edge count, not weighted cost. With differing non-negative weights, Dijkstra's priority-queue search is the right pattern.",
  },
  "pattern:backtracking:pat-bt-recognize-1": {
    scenario:
      "Generate ALL permutations of a list of distinct numbers.",
    approaches: [
      { id: "backtracking", label: "Backtracking (choose / explore / un-choose)", requiredReasonIds: ["enumerate-with-used"] },
      { id: "dp", label: "Dynamic programming", requiredReasonIds: [], rejectionFeedback: "DP counts or optimizes over overlapping subproblems; it does not enumerate every explicit arrangement." },
    ],
    reasons: [
      { id: "enumerate-with-used", text: "You must produce every arrangement, filling positions one at a time and marking placed elements with a used-array to avoid reuse — all n! orderings." },
      { id: "count-only", text: "Only the number of permutations is needed, so a closed-form count suffices.", contradictory: true },
      { id: "overlapping-sub", text: "The permutations share overlapping subproblems that memoization can collapse.", contradictory: true },
    ],
    acceptableApproachIds: ["backtracking"],
    modelExplanation:
      "Backtracking: build each permutation by choosing an unused element per position, recursing, then un-choosing — enumerating all n! orderings with O(n) auxiliary space.",
  },
  "pattern:backtracking:pat-bt-choose-1": {
    scenario:
      "Two problems: (a) LIST every subset that sums to a target; (b) count HOW MANY subsets sum to a target. This drill is about (a).",
    approaches: [
      { id: "backtracking", label: "Backtracking", requiredReasonIds: ["must-enumerate"] },
      { id: "dp", label: "Dynamic programming (subset-sum count)", requiredReasonIds: [], rejectionFeedback: "DP is right for (b): counting. Problem (a) requires each explicit subset, which DP's counts do not produce." },
    ],
    reasons: [
      { id: "must-enumerate", text: "Problem (a) demands each explicit subset, so you must enumerate configurations via choose/explore/un-choose." },
      { id: "count-suffices", text: "Only a count is required, so overlapping subproblems make DP ideal.", contradictory: true },
      { id: "greedy-works", text: "A greedy pass produces every qualifying subset directly.", contradictory: true },
    ],
    acceptableApproachIds: ["backtracking"],
    modelExplanation:
      "Listing every qualifying subset (a) needs backtracking to enumerate each configuration; only the counting variant (b) is a DP over overlapping subproblems.",
  },
  "pattern:binary-search-on-answer:pat-bsa-recognize-1": {
    scenario:
      "Split an array into m contiguous parts to MINIMIZE the largest part sum.",
    approaches: [
      { id: "bs-answer", label: "Binary search on the answer", requiredReasonIds: ["monotone-feasible"] },
      { id: "array-bs", label: "Ordinary binary search on the array", requiredReasonIds: [], rejectionFeedback: "There is no target element to locate in the array; we search a range of candidate answers, not positions." },
      { id: "dp", label: "Full DP over splits", requiredReasonIds: [], rejectionFeedback: "DP works but is heavier; the monotone feasibility test makes binary search on the answer far simpler." },
    ],
    reasons: [
      { id: "monotone-feasible", text: "Feasibility ('can we split into ≤ m parts each ≤ candidate?') is monotone in the candidate cap, so binary-search the cap and greedily test — O(n log(sum))." },
      { id: "sorted-array", text: "The array is sorted, so we can locate the answer by comparing to the midpoint element.", contradictory: true },
      { id: "no-monotonicity", text: "There is no monotone property to exploit, so we must try every split.", contradictory: true },
    ],
    acceptableApproachIds: ["bs-answer"],
    modelExplanation:
      "Binary search on the answer: search the candidate 'largest allowed part sum'; a greedy feasibility check is monotone, giving O(n log(sum)).",
  },
  "pattern:binary-search-on-answer:pat-bsa-choose-1": {
    scenario:
      "You must find the index of a specific value in a sorted array. Is this 'binary search on the answer'?",
    approaches: [
      { id: "array-bs", label: "Ordinary binary search on the sorted array", requiredReasonIds: ["locate-element"] },
      { id: "bs-answer", label: "Binary search on the answer", requiredReasonIds: [], rejectionFeedback: "There is no abstract candidate-answer range with a feasibility test here — you are locating a concrete element by position." },
    ],
    reasons: [
      { id: "locate-element", text: "The array is sorted and you compare the target to the midpoint element to discard half — a direct positional search." },
      { id: "feasibility-range", text: "You search an abstract range of candidate answers using a monotone feasibility predicate.", contradictory: true },
      { id: "unsorted-scan", text: "The array is unsorted, so a linear scan is unavoidable.", contradictory: true },
    ],
    acceptableApproachIds: ["array-bs"],
    modelExplanation:
      "No — locating a value in a sorted array is ordinary binary search over positions. 'Binary search on the answer' searches candidate answers via a feasibility test, not array indices.",
  },
  "pattern:top-k-heap:pat-tk-recognize-1": {
    scenario:
      "From a huge stream of numbers you cannot store fully, report the 100 largest.",
    approaches: [
      { id: "min-heap-k", label: "Top-K with a size-100 min-heap", requiredReasonIds: ["stream-bounded"] },
      { id: "full-sort", label: "Sort everything, take the top 100", requiredReasonIds: [], rejectionFeedback: "A full sort needs all n items in memory and is O(n log n); the stream cannot be stored fully." },
    ],
    reasons: [
      { id: "stream-bounded", text: "A size-100 MIN-heap keeps only the 100 best seen: push each number, pop the smallest when size exceeds 100 — O(n log 100) time, O(100) space, stream-friendly." },
      { id: "need-all-in-memory", text: "All n numbers fit in memory, so a full sort is fine.", contradictory: true },
      { id: "max-heap-k", text: "Use a size-100 MAX-heap so the largest stays on top.", contradictory: true },
    ],
    acceptableApproachIds: ["min-heap-k"],
    modelExplanation:
      "Top-K with a size-k min-heap: hold only the k best, popping the smallest on overflow — O(n log k), O(k) space, and it works on an unbounded stream.",
  },
  "pattern:top-k-heap:pat-tk-choose-1": {
    scenario:
      "You have all n numbers in memory and want just the single k-th largest.",
    approaches: [
      { id: "quickselect", label: "Quickselect", requiredReasonIds: ["single-order-stat"] },
      { id: "min-heap-k", label: "Size-k min-heap", requiredReasonIds: [], rejectionFeedback: "The heap is O(n log k) and best when streaming or when you need ALL top-k; for a single in-memory order statistic quickselect is faster on average." },
    ],
    reasons: [
      { id: "single-order-stat", text: "All data is in memory and only one order statistic is needed, so partitioning around a pivot finds it in expected O(n), O(1) extra space." },
      { id: "heap-streamable", text: "A size-k heap holds only k items, so it works on a stream and yields all top-k, at O(n log k) rather than expected O(n)." },
      { id: "need-all-topk", text: "We need every one of the top-k elements, not just the k-th.", contradictory: true },
    ],
    acceptableApproachIds: ["quickselect"],
    alternatives: [
      { approachId: "min-heap-k", conditions: "When the input is a stream or you need all top-k, not just the single k-th.", tradeoff: "O(n log k) versus quickselect's expected O(n), but predictable and streaming-capable.", requiredReasonIds: ["heap-streamable"] },
    ],
    modelExplanation:
      "Quickselect finds a single k-th largest in expected O(n) with O(1) extra space when all data is in memory; a size-k heap is preferred for streams or when all top-k are needed.",
  },
  "pattern:two-heaps:pat-th-recognize-1": {
    scenario:
      "Numbers arrive one at a time; after each arrival you must report the median of all numbers so far.",
    approaches: [
      { id: "two-heaps", label: "Two heaps (max-heap low half, min-heap high half)", requiredReasonIds: ["balance-halves"] },
      { id: "resort", label: "Re-sort after every insertion", requiredReasonIds: [], rejectionFeedback: "Re-sorting is O(n log n) per query → O(n^2 log n) overall; two heaps give O(log n) per insert." },
      { id: "single-heap", label: "Single size-k heap", requiredReasonIds: [], rejectionFeedback: "A single heap tracks one extreme, not the boundary between the lower and upper halves that the median needs." },
    ],
    reasons: [
      { id: "balance-halves", text: "A max-heap for the lower half and a min-heap for the upper half, kept balanced, expose the median at the heap tops — O(log n) per add, O(1) per query." },
      { id: "one-extreme", text: "We only ever need one extreme value, so a single heap suffices.", contradictory: true },
      { id: "must-fully-sort", text: "The full data must be sorted after each insertion to read the median.", contradictory: true },
    ],
    acceptableApproachIds: ["two-heaps"],
    modelExplanation:
      "Two heaps: balance a low-half max-heap against a high-half min-heap so the median is read from the top(s) in O(1), with O(log n) inserts.",
  },
  "pattern:two-heaps:pat-th-choose-1": {
    scenario:
      "You only need the 10 largest numbers seen so far (not the median).",
    approaches: [
      { id: "single-heap", label: "Top-K with a single size-10 min-heap", requiredReasonIds: ["one-side-only"] },
      { id: "two-heaps", label: "Two balanced heaps", requiredReasonIds: [], rejectionFeedback: "Two heaps track the half-boundary needed for a median; for the top-10 you only need one extreme, so a single heap is simpler." },
    ],
    reasons: [
      { id: "one-side-only", text: "You need one extreme (the 10 largest), not the boundary between halves, so a single size-10 min-heap suffices." },
      { id: "need-boundary", text: "You need the boundary between the lower and upper halves, which requires two opposing heaps.", contradictory: true },
      { id: "resort-fine", text: "Re-sorting the whole stream on each query is efficient enough.", contradictory: true },
    ],
    acceptableApproachIds: ["single-heap"],
    modelExplanation:
      "Top-K with a single size-10 min-heap: only one extreme is required, so the two-heap median machinery is unnecessary.",
  },
  "pattern:k-way-merge:pat-kwm-recognize-1": {
    scenario:
      "Merge k sorted linked lists into one sorted list efficiently.",
    approaches: [
      { id: "kway-heap", label: "K-way merge with a min-heap of the k heads", requiredReasonIds: ["heap-of-fronts"] },
      { id: "concat-sort", label: "Concatenate all, then sort", requiredReasonIds: [], rejectionFeedback: "Throwing away the existing sortedness costs O(N log N); a heap of fronts exploits it for O(N log k)." },
    ],
    reasons: [
      { id: "heap-of-fronts", text: "Keep the k current heads in a min-heap: pop the smallest, advance that list — O(N log k) time, O(k) space, using the per-list sortedness." },
      { id: "unsorted-lists", text: "The lists are unsorted, so their order gives no advantage.", contradictory: true },
      { id: "need-two-heaps", text: "This needs two opposing heaps to track a median boundary.", contradictory: true },
    ],
    acceptableApproachIds: ["kway-heap"],
    modelExplanation:
      "K-way merge: a min-heap of the k list fronts pops the global minimum each step and advances that list — O(N log k), O(k) space.",
  },
  "pattern:k-way-merge:pat-kwm-choose-1": {
    scenario:
      "You must find the k-th smallest element across m sorted rows of a matrix.",
    approaches: [
      { id: "kway-heap", label: "K-way merge (heap of row fronts)", requiredReasonIds: ["pop-k-times"] },
      { id: "bs-value", label: "Binary search on the value range", requiredReasonIds: ["value-monotone"] },
      { id: "full-flatten-sort", label: "Flatten and sort all cells", requiredReasonIds: [], rejectionFeedback: "Sorting all cells wastes the per-row order; heap the fronts and pop k times instead." },
    ],
    reasons: [
      { id: "pop-k-times", text: "Heap the m row fronts and pop k times: the k-th pop is the k-th smallest — O(k log m), leveraging each row's sorted order." },
      { id: "value-monotone", text: "The count of cells ≤ a candidate value is monotone, so binary-searching the value range converges on the k-th smallest without popping k times." },
      { id: "median-boundary", text: "We must maintain a balanced two-heap median boundary.", contradictory: true },
    ],
    acceptableApproachIds: ["kway-heap"],
    alternatives: [
      { approachId: "bs-value", conditions: "For very large matrices, binary-searching on the value range can beat popping k times.", tradeoff: "More complex to implement than the heap-of-fronts merge.", requiredReasonIds: ["value-monotone"] },
    ],
    modelExplanation:
      "K-way merge fits: heap the m sorted row fronts and pop k times to reach the k-th smallest in O(k log m). (Binary-search-on-value is an alternative for large matrices.)",
  },
  "pattern:monotonic-stack:pat-ms-recognize-1": {
    scenario:
      "For each day, how many days until a warmer temperature? Which pattern applies and what does the stack hold?",
    approaches: [
      { id: "mono-stack", label: "Monotonic (decreasing) stack of indices", requiredReasonIds: ["pop-on-warmer"] },
      { id: "brute", label: "For each day scan forward for a warmer day", requiredReasonIds: [], rejectionFeedback: "The nested forward scan is O(n^2); a monotonic stack answers all days in O(n) total." },
    ],
    reasons: [
      { id: "pop-on-warmer", text: "Keep a decreasing stack of day INDICES awaiting a warmer day; when a warmer day arrives, pop the cooler days and record the index gap — O(n) total." },
      { id: "window-expires", text: "Elements expire from the front as a fixed window slides, so a deque is required.", contradictory: true },
      { id: "needs-sorting", text: "The temperatures must be sorted first.", contradictory: true },
    ],
    acceptableApproachIds: ["mono-stack"],
    modelExplanation:
      "A monotonic decreasing stack of indices: each warmer day pops the cooler days waiting below it and records the wait, giving O(n) total work.",
  },
  "pattern:monotonic-stack:pat-ms-choose-1": {
    scenario:
      "You need the MAXIMUM of every sliding window of size k as the window moves.",
    approaches: [
      { id: "mono-deque", label: "Monotonic (decreasing) deque", requiredReasonIds: ["expire-front"] },
      { id: "mono-stack", label: "Plain monotonic stack", requiredReasonIds: [], rejectionFeedback: "Elements expire from the FRONT as the window slides, which a stack (LIFO, one end) cannot remove — you need a deque." },
    ],
    reasons: [
      { id: "expire-front", text: "As the window slides, the oldest element leaves from the front and dominated elements leave from the back, so a double-ended queue maintains the max in O(n)." },
      { id: "no-expiry", text: "Nothing ever leaves from the front, so a one-ended stack is enough.", contradictory: true },
      { id: "needs-heap", text: "Only a heap can report the window maximum.", contradictory: true },
    ],
    acceptableApproachIds: ["mono-deque"],
    modelExplanation:
      "Not a plain stack — window elements expire from the front, so use a monotonic decreasing DEQUE, popping the front when it leaves the window: O(n).",
  },
  "pattern:merge-intervals:pat-mi-recognize-1": {
    scenario:
      "Given a list of meeting time ranges, combine any that overlap into consolidated blocks.",
    approaches: [
      { id: "merge-intervals", label: "Merge intervals (sort by start, sweep)", requiredReasonIds: ["sort-start-sweep"] },
      { id: "pairwise", label: "Compare every pair of intervals", requiredReasonIds: [], rejectionFeedback: "Pairwise overlap checks are O(n^2); sorting by start then sweeping is O(n log n)." },
      { id: "greedy-schedule", label: "Greedy interval scheduling (sort by end)", requiredReasonIds: [], rejectionFeedback: "Scheduling maximizes a non-overlapping selection; here we must COMBINE overlaps, not select." },
    ],
    reasons: [
      { id: "sort-start-sweep", text: "Sort by start, then sweep once extending the last kept block whenever the next range overlaps it — O(n log n)." },
      { id: "sort-by-end", text: "Sort by end time to greedily pick the most non-overlapping meetings.", contradictory: true },
      { id: "already-sorted", text: "The intervals are already sorted, so no sort is needed and a single sweep is O(n).", contradictory: true },
    ],
    acceptableApproachIds: ["merge-intervals"],
    modelExplanation:
      "Merge intervals: sort by start and sweep once, extending the current block on overlap — O(n log n) dominated by the sort.",
  },
  "pattern:merge-intervals:pat-mi-choose-1": {
    scenario:
      "Find the maximum number of non-overlapping meetings you can attend. Is that merge intervals?",
    approaches: [
      { id: "greedy-schedule", label: "Greedy interval scheduling (sort by end)", requiredReasonIds: ["earliest-finish"] },
      { id: "merge-intervals", label: "Merge intervals (sort by start)", requiredReasonIds: [], rejectionFeedback: "Merging combines overlaps into blocks; here we must SELECT the most non-overlapping meetings, which is a different objective." },
    ],
    reasons: [
      { id: "earliest-finish", text: "Sort by END time and greedily take each meeting starting at/after the last chosen one's end; earliest-finish is provably optimal for maximizing the count." },
      { id: "combine-overlaps", text: "The goal is to fuse overlapping ranges into consolidated blocks.", contradictory: true },
      { id: "sort-by-start", text: "Sorting by start time is what makes this greedy choice optimal.", contradictory: true },
    ],
    acceptableApproachIds: ["greedy-schedule"],
    modelExplanation:
      "No — maximizing non-overlapping meetings is greedy interval scheduling: sort by end time and pick each compatible meeting. Merging is a different task.",
  },
  "pattern:greedy-interval-scheduling:pat-gis-recognize-1": {
    scenario:
      "Given meeting time ranges, attend the MAXIMUM number without overlaps. Which pattern and sort key?",
    approaches: [
      { id: "greedy-end", label: "Greedy interval scheduling, sort by END", requiredReasonIds: ["earliest-finish-optimal"] },
      { id: "greedy-start", label: "Greedy, sort by start", requiredReasonIds: [], rejectionFeedback: "Sorting by start can pick a long early meeting that blocks many later ones; earliest-finish is the provably optimal key." },
      { id: "merge-intervals", label: "Merge intervals", requiredReasonIds: [], rejectionFeedback: "Merging fuses overlaps; it does not select a maximum non-overlapping set." },
    ],
    reasons: [
      { id: "earliest-finish-optimal", text: "Sort by finish time and greedily take each meeting that starts at/after the last chosen end; finishing earliest leaves the most room, which is provably optimal — O(n log n)." },
      { id: "sort-by-duration", text: "Sorting by shortest duration first is what guarantees optimality.", contradictory: true },
      { id: "need-dp", text: "Only DP can solve this; no greedy rule is optimal.", contradictory: true },
    ],
    acceptableApproachIds: ["greedy-end"],
    modelExplanation:
      "Greedy interval scheduling: sort by end time and pick each meeting compatible with the last chosen one — earliest-finish is optimal, O(n log n).",
  },
  "pattern:greedy-interval-scheduling:pat-gis-choose-1": {
    scenario:
      "Each meeting has a VALUE and you want the maximum total value of non-overlapping meetings.",
    approaches: [
      { id: "weighted-dp", label: "Dynamic programming (weighted interval scheduling)", requiredReasonIds: ["value-changes-optimum"] },
      { id: "greedy-end", label: "Greedy by earliest finish", requiredReasonIds: [], rejectionFeedback: "Earliest-finish greedy maximizes COUNT, but a high-value long meeting can beat several cheap short ones, so greedy is not optimal for value." },
    ],
    reasons: [
      { id: "value-changes-optimum", text: "With weights, sort by end and for each interval choose max(skip, value + best compatible earlier) — the value can make a single interval beat many, so DP is needed." },
      { id: "count-is-goal", text: "We only maximize the count of meetings, so earliest-finish greedy is optimal.", contradictory: true },
      { id: "merge-overlaps", text: "We must merge overlapping meetings into blocks.", contradictory: true },
    ],
    acceptableApproachIds: ["weighted-dp"],
    modelExplanation:
      "Weighted interval scheduling is DP: sort by end and take max(skip, value + best earlier compatible). Greedy-by-finish maximizes count, not weighted value.",
  },
  "pattern:cyclic-sort:pat-cs-recognize-1": {
    scenario:
      "An array holds n distinct numbers taken from 0..n (one is missing). Find the missing number using O(1) extra space.",
    approaches: [
      { id: "cyclic-sort", label: "Cyclic sort", requiredReasonIds: ["value-equals-index"] },
      { id: "xor", label: "Bitwise XOR of indices and values", requiredReasonIds: ["xor-cancel-range"] },
      { id: "hash-set", label: "Hash set of seen values", requiredReasonIds: [], rejectionFeedback: "A set finds it but uses O(n) extra space, which the O(1) constraint forbids." },
    ],
    reasons: [
      { id: "value-equals-index", text: "Values come from the range 0..n, so each value has a home index; swap values into place, then the first index whose value ≠ index is missing — O(n) time, O(1) space." },
      { id: "xor-cancel-range", text: "XOR-ing 0..n with all array values cancels every present value in pairs, leaving the missing number — O(n) time, O(1) space." },
      { id: "needs-sorting-nlogn", text: "You must sort in O(n log n) first before scanning.", contradictory: true },
    ],
    acceptableApproachIds: ["cyclic-sort"],
    alternatives: [
      { approachId: "xor", conditions: "When you prefer an arithmetic trick over in-place swaps.", tradeoff: "Equally O(1) space; some find XOR less intuitive than placing values home.", requiredReasonIds: ["xor-cancel-range"] },
    ],
    modelExplanation:
      "Cyclic sort: because values are the range 0..n, swap each to its index and the first mismatched slot reveals the missing number — O(n) time, O(1) space. (XOR is an equally valid O(1)-space alternative.)",
  },
  "pattern:cyclic-sort:pat-cs-choose-1": {
    scenario:
      "The array holds arbitrary large integers (NOT a 0..n range) and you must find the one value that appears once.",
    approaches: [
      { id: "xor", label: "Bitwise XOR fold (if all others pair up)", requiredReasonIds: ["pairs-cancel"] },
      { id: "count-map", label: "Hash map of value counts", requiredReasonIds: ["count-general"] },
      { id: "cyclic-sort", label: "Cyclic sort", requiredReasonIds: [], rejectionFeedback: "Arbitrary values have no home index in 0..n, so there is nowhere to swap them — cyclic sort does not apply." },
    ],
    reasons: [
      { id: "pairs-cancel", text: "If every other value appears exactly twice, XOR-ing all values cancels the pairs and leaves the unique one — O(n) time, O(1) space." },
      { id: "count-general", text: "A hash map of counts finds the singleton for arbitrary values and any duplication pattern, at O(n) time and O(n) space." },
      { id: "must-fully-sort", text: "You must fully sort the array to find the singleton.", contradictory: true },
    ],
    acceptableApproachIds: ["xor"],
    alternatives: [
      { approachId: "count-map", conditions: "When values may not pair up neatly (e.g. appear three times).", tradeoff: "Uses O(n) space versus XOR's O(1).", requiredReasonIds: ["count-general"] },
    ],
    modelExplanation:
      "Not cyclic sort — arbitrary values have no home index. Use a bitwise XOR fold when the rest pair up, or a hash map of counts more generally.",
  },
  "pattern:matrix-traversal:pat-mt-recognize-1": {
    scenario:
      "Return all elements of an m×n matrix in spiral order.",
    approaches: [
      { id: "boundary-walk", label: "Matrix traversal with boundary tracking", requiredReasonIds: ["shrink-boundaries"] },
      { id: "grid-bfs", label: "Grid BFS", requiredReasonIds: [], rejectionFeedback: "There are no obstacles or shortest-path question; a fixed spiral walk over fixed boundaries is all that is needed." },
    ],
    reasons: [
      { id: "shrink-boundaries", text: "Walk top row, right column, bottom row, left column, shrinking the four boundaries each lap — O(m·n) time, O(1) extra space." },
      { id: "obstacles-present", text: "Movement depends on wall cells, so cells must be treated as graph nodes.", contradictory: true },
      { id: "needs-recursion-sum", text: "You must carry a running sum along paths, so recursion is required.", contradictory: true },
    ],
    acceptableApproachIds: ["boundary-walk"],
    modelExplanation:
      "Matrix traversal with boundary tracking: peel the outer ring layer by layer, shrinking the boundaries — O(m·n) time, O(1) extra space.",
  },
  "pattern:matrix-traversal:pat-mt-choose-1": {
    scenario:
      "Find the shortest path from top-left to bottom-right avoiding blocked cells.",
    approaches: [
      { id: "grid-bfs", label: "Grid BFS", requiredReasonIds: ["obstacles-shortest"] },
      { id: "boundary-walk", label: "Fixed spiral/boundary traversal", requiredReasonIds: [], rejectionFeedback: "A fixed traversal ignores walls and cannot compute a shortest path around obstacles." },
    ],
    reasons: [
      { id: "obstacles-shortest", text: "Movement is blocked by walls and you need the fewest steps, so treat cells as unweighted graph nodes and BFS from the start." },
      { id: "no-obstacles", text: "There are no obstacles, so a fixed geometric traversal visits everything correctly.", contradictory: true },
      { id: "weighted-cells", text: "Cells have differing move costs, so Dijkstra is required.", contradictory: true },
    ],
    acceptableApproachIds: ["grid-bfs"],
    modelExplanation:
      "Grid BFS: with walls and a shortest-path goal, treat cells as graph nodes and BFS for the fewest steps — a fixed spiral cannot account for obstacles.",
  },
  "pattern:in-place-linkedlist-reversal:pat-iplr-recognize-1": {
    scenario:
      "Reverse a singly linked list using O(1) extra memory.",
    approaches: [
      { id: "inplace-relink", label: "In-place reversal (relink next pointers)", requiredReasonIds: ["relink-one-pass"] },
      { id: "stack", label: "Push nodes on a stack, pop to rebuild", requiredReasonIds: [], rejectionFeedback: "A stack reverses it but stores all n nodes — O(n) space, violating the O(1) constraint." },
    ],
    reasons: [
      { id: "relink-one-pass", text: "Walk once, pointing each node's next at its predecessor with a couple of pointers — O(n) time, O(1) space." },
      { id: "needs-extra-array", text: "You must copy the values into an array to reverse them.", contradictory: true },
      { id: "needs-recursion-stack", text: "Recursion is required, and its O(n) call stack is unavoidable.", contradictory: true },
    ],
    acceptableApproachIds: ["inplace-relink"],
    modelExplanation:
      "In-place reversal: relink each node's next to its predecessor in a single pass — O(n) time, O(1) space, meeting the memory limit.",
  },
  "pattern:in-place-linkedlist-reversal:pat-iplr-choose-1": {
    scenario:
      "Reverse the nodes of a list in groups of k, leaving a trailing partial group as-is. Same pattern as full reversal?",
    approaches: [
      { id: "kgroup-relink", label: "In-place reversal generalized to k-groups", requiredReasonIds: ["reverse-each-group"] },
      { id: "copy-to-array", label: "Copy to an array and rebuild", requiredReasonIds: [], rejectionFeedback: "Copying uses O(n) extra space; the in-place k-group relink keeps it O(1)." },
    ],
    reasons: [
      { id: "reverse-each-group", text: "Reverse each full k-node group by relinking, connect groups as you go, and leave an incomplete final group untouched — O(n) time, O(1) space." },
      { id: "cannot-generalize", text: "In-place reversal cannot be extended to groups, so a different family is required.", contradictory: true },
      { id: "needs-sort", text: "The nodes must be sorted before grouping.", contradictory: true },
    ],
    acceptableApproachIds: ["kgroup-relink"],
    modelExplanation:
      "Yes — it is in-place reversal applied per k-group: relink each full group, splice groups together, and leave a short final group as-is. Still O(n) time, O(1) space.",
  },
  "pattern:tree-bfs:pat-tbfs-recognize-1": {
    scenario:
      "Return the average value of the nodes on each level of a binary tree.",
    approaches: [
      { id: "tree-bfs", label: "Tree BFS (level order with a queue)", requiredReasonIds: ["per-level-snapshot"] },
      { id: "tree-dfs", label: "Tree DFS", requiredReasonIds: [], rejectionFeedback: "DFS descends paths and does not group nodes by level without extra depth bookkeeping; BFS is the natural per-level fit." },
    ],
    reasons: [
      { id: "per-level-snapshot", text: "Process the tree level by level: snapshot the queue length each iteration to isolate one level and average its values — O(n)." },
      { id: "path-sum-needed", text: "The task needs a running path sum down each root-to-leaf route.", contradictory: true },
      { id: "must-sort-values", text: "Node values must be sorted before averaging.", contradictory: true },
    ],
    acceptableApproachIds: ["tree-bfs"],
    modelExplanation:
      "Tree BFS: use a queue and snapshot its size each round to process exactly one level, averaging that level's values — O(n).",
  },
  "pattern:tree-bfs:pat-tbfs-choose-1": {
    scenario:
      "Find the maximum root-to-leaf path sum. Tree BFS or Tree DFS?",
    approaches: [
      { id: "tree-dfs", label: "Tree DFS", requiredReasonIds: ["carry-path-sum"] },
      { id: "tree-bfs", label: "Tree BFS", requiredReasonIds: [], rejectionFeedback: "BFS processes by level and does not naturally carry a running sum along a single root-to-leaf path." },
    ],
    reasons: [
      { id: "carry-path-sum", text: "A path problem needs to carry a running sum down each root-to-leaf route, which recursion (DFS) does naturally — O(n)." },
      { id: "per-level-work", text: "The work is defined per level, so a breadth-first queue is the fit.", contradictory: true },
      { id: "need-heap", text: "You must keep a heap of partial sums to solve it.", contradictory: true },
    ],
    acceptableApproachIds: ["tree-dfs"],
    modelExplanation:
      "Tree DFS: recursion carries the running sum along each root-to-leaf path, exactly what a path-sum problem needs; BFS does not carry path context.",
  },
  "pattern:tree-dfs:pat-tdfs-recognize-1": {
    scenario:
      "Find all root-to-leaf paths whose values sum to a target.",
    approaches: [
      { id: "tree-dfs", label: "Tree DFS with backtracking", requiredReasonIds: ["recurse-path-backtrack"] },
      { id: "tree-bfs", label: "Tree BFS", requiredReasonIds: [], rejectionFeedback: "Level-order processing does not carry the current path and running sum needed to record qualifying routes." },
    ],
    reasons: [
      { id: "recurse-path-backtrack", text: "Recurse carrying the path and running sum; at a leaf record a copy when the sum matches, and backtrack on the way up — O(n) time, O(h) space." },
      { id: "level-grouping", text: "The task groups nodes by depth, so a queue-based level sweep fits.", contradictory: true },
      { id: "sorted-required", text: "The tree must be a BST and sorted for this to work.", contradictory: true },
    ],
    acceptableApproachIds: ["tree-dfs"],
    modelExplanation:
      "Tree DFS: descend carrying the path and running sum, record a copy at a matching leaf, and backtrack — O(n) time, O(h) space.",
  },
  "pattern:tree-dfs:pat-tdfs-choose-1": {
    scenario:
      "Return the values of the tree grouped by level. Tree DFS or Tree BFS?",
    approaches: [
      { id: "tree-bfs", label: "Tree BFS", requiredReasonIds: ["breadth-first-levels"] },
      { id: "tree-dfs", label: "Tree DFS", requiredReasonIds: [], rejectionFeedback: "DFS descends paths and does not group by level without carrying explicit depth bookkeeping; BFS is the direct fit." },
    ],
    reasons: [
      { id: "breadth-first-levels", text: "Grouping by level is breadth-first work: a queue processes one full level at a time — O(n)." },
      { id: "path-context-needed", text: "The task needs a running path sum, so recursion is natural.", contradictory: true },
      { id: "needs-two-heaps", text: "Two heaps are needed to balance the levels.", contradictory: true },
    ],
    acceptableApproachIds: ["tree-bfs"],
    modelExplanation:
      "Tree BFS: level grouping is breadth-first and uses a queue; DFS would need extra depth bookkeeping to group by level.",
  },
  "pattern:graph-dfs-components:pat-gdc-recognize-1": {
    scenario:
      "Count the number of islands in a grid of land and water cells.",
    approaches: [
      { id: "flood-fill", label: "Graph DFS / connected components (flood fill)", requiredReasonIds: ["one-dfs-per-component"] },
      { id: "union-find-static", label: "Union-Find", requiredReasonIds: [], rejectionFeedback: "Union-Find works but is overkill for a one-time static count; a flood-fill DFS/BFS is simpler at O(V+E)." },
    ],
    reasons: [
      { id: "one-dfs-per-component", text: "Treat land cells as nodes connected to adjacent land; launch a DFS from each unvisited land cell and count one component per launch — O(V+E)." },
      { id: "dynamic-edges", text: "Edges arrive incrementally, so a near-constant incremental union is required.", contradictory: true },
      { id: "weighted-shortest", text: "You need the shortest weighted path, so Dijkstra applies.", contradictory: true },
    ],
    acceptableApproachIds: ["flood-fill"],
    modelExplanation:
      "Graph DFS / connected components: flood-fill from each unvisited land cell, counting one island per launch — O(V+E) over the grid.",
  },
  "pattern:graph-dfs-components:pat-gdc-choose-1": {
    scenario:
      "Edges are added one at a time and after each you must answer 'are X and Y connected?'.",
    approaches: [
      { id: "union-find", label: "Union-Find (DSU)", requiredReasonIds: ["incremental-near-constant"] },
      { id: "dfs-per-query", label: "Re-run DFS per query", requiredReasonIds: [], rejectionFeedback: "Each DFS is O(V+E); repeated per query on a stream of edges is far too slow." },
    ],
    reasons: [
      { id: "incremental-near-constant", text: "Union each new edge and answer connectivity in amortized near-constant time, ideal for a stream of edges and queries." },
      { id: "static-one-count", text: "The graph is fixed and you count components exactly once, so a single traversal is simplest.", contradictory: true },
      { id: "weighted-paths", text: "You need weighted shortest paths, so a priority queue is required.", contradictory: true },
    ],
    acceptableApproachIds: ["union-find"],
    modelExplanation:
      "Union-Find (DSU): near-constant union and connectivity queries handle incremental edges; repeated DFS would be O(V+E) per query.",
  },
  "pattern:topological-sort:pat-topo-recognize-1": {
    scenario:
      "Given courses with prerequisites, return an order to take them all (or report that it is impossible).",
    approaches: [
      { id: "topo-kahn", label: "Topological sort (Kahn's algorithm)", requiredReasonIds: ["indegree-peel", "cycle-detect"] },
      { id: "plain-bfs", label: "Plain shortest-path BFS", requiredReasonIds: [], rejectionFeedback: "Shortest-path BFS computes distances; it does not order nodes by dependency or detect prerequisite cycles." },
    ],
    reasons: [
      { id: "indegree-peel", text: "Build in-degrees, start with prerequisite-free courses, and peel each node as its prerequisites clear — a valid dependency order in O(V+E)." },
      { id: "cycle-detect", text: "If fewer than all courses come out, a prerequisite cycle exists and scheduling is impossible." },
      { id: "distance-order", text: "The task asks for the fewest edges between two courses.", contradictory: true },
    ],
    acceptableApproachIds: ["topo-kahn"],
    modelExplanation:
      "Topological sort (Kahn's): peel prerequisite-free courses via in-degrees; if fewer than V emerge, a cycle makes it impossible — O(V+E).",
  },
  "pattern:topological-sort:pat-topo-choose-1": {
    scenario:
      "Find the fewest edges between two nodes in an unweighted graph. Topological sort or BFS?",
    approaches: [
      { id: "bfs", label: "BFS", requiredReasonIds: ["fewest-edges-levels"] },
      { id: "topo", label: "Topological sort", requiredReasonIds: [], rejectionFeedback: "Topological sort orders a DAG by dependencies; it does not compute distances and does not apply to a general (possibly cyclic) graph." },
    ],
    reasons: [
      { id: "fewest-edges-levels", text: "Fewest edges on an unweighted graph is a shortest-path question; BFS visits in increasing distance so the first arrival is shortest — O(V+E)." },
      { id: "dependency-order", text: "The task is to order nodes by their dependencies.", contradictory: true },
      { id: "weighted-cost", text: "Edges have differing weights, so a priority queue is needed.", contradictory: true },
    ],
    acceptableApproachIds: ["bfs"],
    modelExplanation:
      "BFS: fewest edges on an unweighted graph is shortest-path work. Topological sort orders a DAG's dependencies and computes no distances.",
  },
  "pattern:union-find:pat-uf-recognize-1": {
    scenario:
      "Edges are added one by one; report when an edge first connects two already-connected nodes (a redundant edge).",
    approaches: [
      { id: "union-find", label: "Union-Find with path compression + union by rank", requiredReasonIds: ["find-before-union"] },
      { id: "dfs-per-edge", label: "Re-run DFS/BFS after each edge", requiredReasonIds: [], rejectionFeedback: "Re-traversing per edge is O(V+E) each time — far too slow for a stream of edges." },
    ],
    reasons: [
      { id: "find-before-union", text: "For each edge, if find(a) == find(b) before uniting, the endpoints were already connected and this edge is redundant — near-O(1) per operation." },
      { id: "static-graph", text: "The graph is fixed, so a single traversal answers everything.", contradictory: true },
      { id: "weighted-mst", text: "You must minimize total edge weight, so this needs an MST algorithm.", contradictory: true },
    ],
    acceptableApproachIds: ["union-find"],
    modelExplanation:
      "Union-Find: union each edge's endpoints, and a same-root find before uniting marks the redundant edge — near-O(1) per op with path compression and union by rank.",
  },
  "pattern:union-find:pat-uf-choose-1": {
    scenario:
      "The graph is FIXED and you need to count its connected components exactly once.",
    approaches: [
      { id: "dfs-count", label: "One-pass DFS/BFS component count", requiredReasonIds: ["static-single-pass"] },
      { id: "union-find", label: "Union-Find", requiredReasonIds: [], rejectionFeedback: "Union-Find is not wrong, but for a one-time static count a single DFS/BFS sweep is simpler at O(V+E)." },
    ],
    reasons: [
      { id: "static-single-pass", text: "The graph does not change and you count once, so a single traversal launching a search per unvisited node is simplest — O(V+E)." },
      { id: "uf-dynamic", text: "When edges arrive incrementally or many connectivity queries are made, Union-Find's near-constant operations avoid re-traversing the whole graph." },
      { id: "shortest-path", text: "You need shortest weighted paths, so a heap is required.", contradictory: true },
    ],
    acceptableApproachIds: ["dfs-count"],
    alternatives: [
      { approachId: "union-find", conditions: "When edges are dynamic or you make many connectivity queries.", tradeoff: "More machinery than a one-pass traversal for a single static count.", requiredReasonIds: ["uf-dynamic"] },
    ],
    modelExplanation:
      "For a one-time static count, a single DFS/BFS sweep (O(V+E)) is simplest. Union-Find shines when edges are dynamic or many queries are made.",
  },
  "pattern:dijkstra:pat-dij-recognize-1": {
    scenario:
      "Find the minimum total travel time from a source to every city, given roads with positive times.",
    approaches: [
      { id: "dijkstra", label: "Dijkstra's algorithm", requiredReasonIds: ["settle-closest"] },
      { id: "bfs", label: "Plain BFS", requiredReasonIds: [], rejectionFeedback: "BFS counts edges, not weighted cost; with unequal positive weights fewest-edges is not cheapest." },
      { id: "bellman", label: "Bellman–Ford", requiredReasonIds: [], rejectionFeedback: "Bellman–Ford is for negative edges; with all-positive weights Dijkstra is faster." },
    ],
    reasons: [
      { id: "settle-closest", text: "Weights are non-negative, so repeatedly settling the closest unvisited city and relaxing its roads via a min-heap is correct — O((V+E) log V)." },
      { id: "unweighted", text: "All roads take the same time, so counting edges equals counting cost.", contradictory: true },
      { id: "has-negative", text: "Some roads have negative time, so the closest-is-final rule breaks.", contradictory: true },
    ],
    acceptableApproachIds: ["dijkstra"],
    modelExplanation:
      "Dijkstra's algorithm: a min-heap by distance settles the closest city and relaxes its edges; non-negative weights guarantee correctness — O((V+E) log V).",
  },
  "pattern:dijkstra:pat-dij-choose-1": {
    scenario:
      "Some edges have NEGATIVE weights (e.g. currency arbitrage). Dijkstra or Bellman–Ford?",
    approaches: [
      { id: "bellman", label: "Bellman–Ford", requiredReasonIds: ["handles-negative"] },
      { id: "dijkstra", label: "Dijkstra's algorithm", requiredReasonIds: [], rejectionFeedback: "Dijkstra's 'closest is final' guarantee breaks with negative edges, so it can return wrong distances." },
    ],
    reasons: [
      { id: "handles-negative", text: "Bellman–Ford relaxes all edges V−1 times, correctly handling negative weights and detecting negative cycles — O(V·E)." },
      { id: "all-nonneg", text: "All weights are non-negative, so the closest-is-final rule holds.", contradictory: true },
      { id: "unweighted-bfs", text: "The graph is unweighted, so BFS suffices.", contradictory: true },
    ],
    acceptableApproachIds: ["bellman"],
    modelExplanation:
      "Bellman–Ford: it correctly handles negative edges and detects negative cycles (O(V·E)); Dijkstra's closest-is-final guarantee fails with negative weights.",
  },
  "pattern:trie-prefix:pat-trie-recognize-1": {
    scenario:
      "Build an autocomplete that, given a prefix, reports whether any stored word starts with it, over thousands of words.",
    approaches: [
      { id: "trie", label: "Trie (prefix tree)", requiredReasonIds: ["prefix-walk"] },
      { id: "scan-all", label: "Scan every word per query", requiredReasonIds: [], rejectionFeedback: "Scanning all words each query is O(dictionary) per lookup; a trie answers a prefix in O(L) independent of dictionary size." },
    ],
    reasons: [
      { id: "prefix-walk", text: "Insert each word once; a prefix query walks one node per character in O(L), independent of how many words are stored — ideal for repeated prefix lookups." },
      { id: "exact-only", text: "Only exact-word membership is needed, so a hash set is simpler.", contradictory: true },
      { id: "needs-sorting", text: "The dictionary must be sorted and binary-searched per query.", contradictory: true },
    ],
    acceptableApproachIds: ["trie"],
    modelExplanation:
      "Trie (prefix tree): each prefix query walks O(L) nodes regardless of dictionary size — far better than scanning all words per query.",
  },
  "pattern:trie-prefix:pat-trie-choose-1": {
    scenario:
      "You only need to test whether an exact word is in a dictionary (never prefixes).",
    approaches: [
      { id: "hash-set", label: "Hash set", requiredReasonIds: ["exact-membership"] },
      { id: "trie", label: "Trie", requiredReasonIds: [], rejectionFeedback: "A trie's advantage is prefix queries; with only exact lookups it adds structure and memory overhead a hash set avoids." },
    ],
    reasons: [
      { id: "exact-membership", text: "Exact membership is O(L) average in a hash set and far simpler — no prefix queries are needed, so the trie's extra structure is wasted." },
      { id: "need-prefixes", text: "The task requires enumerating all words sharing a prefix.", contradictory: true },
      { id: "need-order", text: "Words must be returned in sorted order, which only a trie provides.", contradictory: true },
    ],
    acceptableApproachIds: ["hash-set"],
    modelExplanation:
      "Hash set: exact membership is O(L) average and simplest. A trie only earns its overhead when prefix queries are required.",
  },
  "pattern:modified-binary-search:pat-mbs-recognize-1": {
    scenario:
      "A sorted array was rotated at an unknown pivot; find the index of a target in O(log n).",
    approaches: [
      { id: "mod-bs", label: "Modified binary search", requiredReasonIds: ["one-half-sorted"] },
      { id: "linear", label: "Linear scan", requiredReasonIds: [], rejectionFeedback: "A scan is O(n); the array is still 'sorted in halves', which a modified binary search exploits for O(log n)." },
      { id: "bs-answer", label: "Binary search on the answer", requiredReasonIds: [], rejectionFeedback: "There is no candidate-answer range with a feasibility test; you are searching within a transformed sorted array." },
    ],
    reasons: [
      { id: "one-half-sorted", text: "At each midpoint one half is still sorted; test whether the target lies within that sorted half and keep it, else keep the other — O(log n), O(1) space." },
      { id: "fully-sorted", text: "The array is fully sorted, so plain binary search applies directly.", contradictory: true },
      { id: "candidate-range", text: "You search an abstract range of candidate answers with a feasibility test.", contradictory: true },
    ],
    acceptableApproachIds: ["mod-bs"],
    modelExplanation:
      "Modified binary search: at each midpoint one half is sorted; decide whether the target lies there to discard the other half — O(log n).",
  },
  "pattern:modified-binary-search:pat-mbs-choose-1": {
    scenario:
      "Find the minimum ship capacity so all packages ship within D days. Is that modified binary search on a rotated array?",
    approaches: [
      { id: "bs-answer", label: "Binary search on the answer", requiredReasonIds: ["candidate-capacity"] },
      { id: "mod-bs", label: "Modified binary search on a transformed array", requiredReasonIds: [], rejectionFeedback: "There is no rotated/transformed array to search; you search a range of candidate capacities via a feasibility test." },
    ],
    reasons: [
      { id: "candidate-capacity", text: "Binary-search the candidate capacity: feasibility ('can we ship within D days at this capacity?') is monotone, so search the answer range." },
      { id: "rotated-array", text: "You are searching within a rotated sorted array by index.", contradictory: true },
      { id: "no-monotone", text: "Feasibility is not monotone in capacity, so binary search cannot apply.", contradictory: true },
    ],
    acceptableApproachIds: ["bs-answer"],
    modelExplanation:
      "No — this is binary search on the ANSWER: search candidate capacities using a monotone feasibility test. Modified binary search refers to searching a transformed sorted array.",
  },
  "pattern:bitwise-xor:pat-xor-recognize-1": {
    scenario:
      "Every number appears exactly twice except one; find that one using O(1) extra space.",
    approaches: [
      { id: "xor-fold", label: "Bitwise XOR fold", requiredReasonIds: ["pairs-cancel"] },
      { id: "hash-count", label: "Hash map of counts", requiredReasonIds: [], rejectionFeedback: "Counting works but stores up to n entries — O(n) space, which the O(1) constraint forbids." },
    ],
    reasons: [
      { id: "pairs-cancel", text: "XOR is its own inverse, so XOR-ing all numbers cancels the paired values and leaves the unique one — O(n) time, O(1) space." },
      { id: "appears-thrice", text: "Duplicates appear three times, so pairwise cancellation does not isolate the answer.", contradictory: true },
      { id: "needs-sorting", text: "The array must be sorted before the singleton can be found.", contradictory: true },
    ],
    acceptableApproachIds: ["xor-fold"],
    modelExplanation:
      "Bitwise XOR: fold all numbers together; paired values cancel and the unique one remains — O(n) time, O(1) space.",
  },
  "pattern:bitwise-xor:pat-xor-choose-1": {
    scenario:
      "Every number appears three times except one; find the unique number. Does plain XOR work?",
    approaches: [
      { id: "bit-count-mod3", label: "Count bits modulo 3 (or a hash map)", requiredReasonIds: ["triples-need-mod3"] },
      { id: "xor-fold", label: "Plain single XOR fold", requiredReasonIds: [], rejectionFeedback: "Single XOR cancels PAIRS, not triples, so with triple duplicates it does not isolate the unique value." },
    ],
    reasons: [
      { id: "triples-need-mod3", text: "For triples, sum each bit position across all numbers modulo 3; bits from the triple-appearing values vanish, leaving the unique number's bits." },
      { id: "pairs-only", text: "Every other value appears exactly twice, so pairwise XOR cancels them.", contradictory: true },
      { id: "sorted-scan", text: "A single sorted scan directly reveals the answer with no counting.", contradictory: true },
    ],
    acceptableApproachIds: ["bit-count-mod3"],
    modelExplanation:
      "No — plain XOR cancels pairs, not triples. Count set bits modulo 3 across all numbers (or use a hash map) to isolate the unique value.",
  },
  "pattern:dynamic-programming:pat-dp-recognize-1": {
    scenario:
      "Count the number of distinct ways to climb n stairs taking 1 or 2 steps.",
    approaches: [
      { id: "dp", label: "Dynamic programming", requiredReasonIds: ["overlapping-subproblems"] },
      { id: "backtracking", label: "Backtracking (enumerate every path)", requiredReasonIds: [], rejectionFeedback: "Enumerating every climb path is exponential; only a count is asked, and the subproblems overlap, so DP collapses it to O(n)." },
    ],
    reasons: [
      { id: "overlapping-subproblems", text: "ways(k) = ways(k−1) + ways(k−2): the same subproblems recur, so memoize or tabulate for O(n) instead of exponential recursion." },
      { id: "must-list-paths", text: "You must produce every explicit sequence of steps, so enumeration is required.", contradictory: true },
      { id: "greedy-optimal", text: "A greedy choice at each stair gives the count directly.", contradictory: true },
    ],
    acceptableApproachIds: ["dp"],
    modelExplanation:
      "Dynamic programming: ways(k) = ways(k−1) + ways(k−2) has overlapping subproblems, so memoization/tabulation gives O(n) instead of exponential recursion.",
  },
  "pattern:dynamic-programming:pat-dp-choose-1": {
    scenario:
      "You must LIST every subset that sums to a target (not just count them).",
    approaches: [
      { id: "backtracking", label: "Backtracking", requiredReasonIds: ["enumerate-explicit"] },
      { id: "dp", label: "Dynamic programming", requiredReasonIds: [], rejectionFeedback: "DP counts or optimizes over overlapping subproblems; producing every explicit subset requires enumeration, not a count." },
    ],
    reasons: [
      { id: "enumerate-explicit", text: "Listing every subset means producing each explicit configuration, so you must enumerate via choose/explore/un-choose." },
      { id: "count-suffices", text: "Only the number of subsets is needed, so overlapping subproblems make DP ideal.", contradictory: true },
      { id: "greedy-lists", text: "A greedy scan can list all qualifying subsets directly.", contradictory: true },
    ],
    acceptableApproachIds: ["backtracking"],
    modelExplanation:
      "Backtracking: enumerating every explicit qualifying subset requires generating configurations. DP is for counting/optimizing, not listing every combination.",
  },
  "pattern:knapsack:pat-ks-recognize-1": {
    scenario:
      "Can an array be split into two subsets with equal sum?",
    approaches: [
      { id: "knapsack-01", label: "0/1 knapsack (subset-sum DP)", requiredReasonIds: ["reachable-half"] },
      { id: "greedy", label: "Greedy partition (sort and assign)", requiredReasonIds: [], rejectionFeedback: "Greedily balancing sums does not reliably decide exact equal partition; subset-sum needs DP over reachable sums." },
    ],
    reasons: [
      { id: "reachable-half", text: "Set target = total/2 and let dp[s] track reachable subset sums with each item used once (sweep capacity downward); feasible iff dp[target] is true — O(n·target)." },
      { id: "fractional-ok", text: "Items can be split into fractions, so a greedy ratio choice is optimal.", contradictory: true },
      { id: "unlimited-reuse", text: "Each item may be reused unlimited times, so sweep capacity upward.", contradictory: true },
    ],
    acceptableApproachIds: ["knapsack-01"],
    modelExplanation:
      "0/1 knapsack (subset-sum): target = total/2; dp[s] tracks reachable sums with each item used once (downward capacity sweep). Feasible iff dp[target] is true.",
  },
  "pattern:knapsack:pat-ks-choose-1": {
    scenario:
      "Fewest coins to make an amount, with coins reusable unlimited times. Same 0/1 knapsack recurrence?",
    approaches: [
      { id: "unbounded", label: "Unbounded knapsack (coin change)", requiredReasonIds: ["reuse-sweep-up"] },
      { id: "knapsack-01", label: "0/1 knapsack (downward sweep)", requiredReasonIds: [], rejectionFeedback: "The 0/1 downward sweep forbids reuse and would undercount when coins repeat unlimited times." },
    ],
    reasons: [
      { id: "reuse-sweep-up", text: "Coins repeat, so iterate capacity UPWARD (dp[a] from dp[a−coin]) to allow reusing a coin within the same amount." },
      { id: "each-once", text: "Each coin may be used at most once, so sweep capacity downward.", contradictory: true },
      { id: "fractional-coins", text: "Coins can be split into fractions, so greedy ratio selection is optimal.", contradictory: true },
    ],
    acceptableApproachIds: ["unbounded"],
    modelExplanation:
      "No — reusable coins make it UNBOUNDED knapsack (coin change): iterate capacity upward so a coin can be reused. The 0/1 downward sweep forbids reuse and undercounts.",
  },
  "pattern:divide-and-conquer:pat-dac-recognize-1": {
    scenario:
      "Sort an array in guaranteed O(n log n) time, stably.",
    approaches: [
      { id: "merge-sort", label: "Merge sort", requiredReasonIds: ["split-merge"] },
      { id: "quick-sort", label: "Quicksort", requiredReasonIds: [], rejectionFeedback: "Quicksort risks O(n^2) on adversarial input and its in-place form is not stable, so it fails the guarantee and stability requirements." },
    ],
    reasons: [
      { id: "split-merge", text: "Split in half, recursively sort each half, then MERGE the sorted halves in linear time: T(n)=2T(n/2)+O(n)=O(n log n), and the merge is stable." },
      { id: "overlapping-sub", text: "The subproblems overlap, so memoization is what makes it efficient.", contradictory: true },
      { id: "counting-range", text: "Values lie in a small integer range, so counting sort is the natural fit.", contradictory: true },
    ],
    acceptableApproachIds: ["merge-sort"],
    modelExplanation:
      "Merge sort: split, recursively sort, and merge sorted halves linearly — a guaranteed O(n log n), stable divide-and-conquer sort.",
  },
  "pattern:divide-and-conquer:pat-dac-choose-1": {
    scenario:
      "Computing Fibonacci by splitting into fib(n−1) and fib(n−2): is that a good divide-and-conquer use?",
    approaches: [
      { id: "dp", label: "Dynamic programming (memoize/tabulate)", requiredReasonIds: ["overlap-reuse"] },
      { id: "plain-dac", label: "Plain divide and conquer", requiredReasonIds: [], rejectionFeedback: "The two subproblems OVERLAP heavily, so plain divide and conquer recomputes them exponentially — the hallmark of a DP problem." },
    ],
    reasons: [
      { id: "overlap-reuse", text: "fib(n−1) and fib(n−2) share overlapping subproblems, so caching each value once turns exponential recomputation into O(n) — this is DP, not divide and conquer." },
      { id: "independent-halves", text: "The subproblems are independent and non-overlapping, so divide and conquer is ideal.", contradictory: true },
      { id: "needs-sorting", text: "The values must be sorted before combining.", contradictory: true },
    ],
    acceptableApproachIds: ["dp"],
    modelExplanation:
      "No — fib's subproblems overlap, so plain divide and conquer recomputes exponentially. Memoization/tabulation (DP) reuses each subproblem for O(n).",
  },

  // ── High-value lesson recognition drills (distinguishing similar approaches) ─
  "lesson:two-pointers:tp-choose-1": {
    scenario:
      "You must decide if a string reads the same forwards and backwards. Which two-pointer form fits?",
    approaches: [
      { id: "converging", label: "Converging pointers from both ends", requiredReasonIds: ["compare-ends-inward"] },
      { id: "same-direction", label: "Two same-direction pointers", requiredReasonIds: [], rejectionFeedback: "Same-direction pointers (slow/fast) suit windows and cycle/middle detection; a palindrome compares opposite ends, so they must converge." },
    ],
    reasons: [
      { id: "compare-ends-inward", text: "Compare the characters at lo and hi and move them inward; a mismatch means it is not a palindrome — O(n) time, O(1) space." },
      { id: "window-growth", text: "The problem grows a window and tracks its contents, so both pointers move the same way.", contradictory: true },
      { id: "must-sort-chars", text: "The characters must be sorted before comparing.", contradictory: true },
    ],
    acceptableApproachIds: ["converging"],
    modelExplanation:
      "Converging pointers: compare s[lo] and s[hi] as they move toward the center; the first mismatch rules out a palindrome.",
  },
  "lesson:prefix-sums:ps-choose-1": {
    scenario:
      "You must answer 10,000 different range-sum queries on a fixed array of 100,000 numbers. Prefix sums or re-summing each range?",
    approaches: [
      { id: "prefix-sums", label: "Precompute prefix sums", requiredReasonIds: ["build-once-query-fast"] },
      { id: "resum", label: "Re-sum each range on demand", requiredReasonIds: [], rejectionFeedback: "Re-summing is O(n) per query = O(n·q); with many queries on a fixed array that is far slower than an O(1)-per-query lookup." },
    ],
    reasons: [
      { id: "build-once-query-fast", text: "The array is fixed and queries are many, so one O(n) prefix-sum build answers each range in O(1) as a difference — O(n + q) overall." },
      { id: "array-changes", text: "The array is frequently updated, so a static prefix table would need constant rebuilds.", contradictory: true },
      { id: "single-query", text: "There is only one query, so precomputation cannot pay off.", contradictory: true },
    ],
    acceptableApproachIds: ["prefix-sums"],
    modelExplanation:
      "Prefix sums: O(n) build plus O(1) per query = O(n + q), which dominates the O(n·q) cost of re-summing every range on a fixed array.",
  },
  "lesson:sliding-window:sw-choose-1": {
    scenario:
      "Problem: 'largest sum of exactly k consecutive elements.' Which pattern applies, and why not prefix sums or Kadane?",
    approaches: [
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: ["fixed-width-incremental"] },
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: [], rejectionFeedback: "Kadane finds the best any-length subarray; here the width is pinned at exactly k, a different question." },
      { id: "prefix-sums", label: "Prefix sums", requiredReasonIds: [], rejectionFeedback: "Prefix sums answer arbitrary ranges but are overkill for a single fixed width that updates incrementally." },
    ],
    reasons: [
      { id: "fixed-width-incremental", text: "The block is contiguous and of fixed width k, so slide the window updating the sum in O(1) (add entering, drop leaving) — O(n)." },
      { id: "prefix-range-diff", text: "A prefix-sum array answers any range sum as a difference in O(1), so the fixed-k sums are also obtainable from it." },
      { id: "count-targets", text: "We must count subarrays hitting a target sum.", contradictory: true },
    ],
    acceptableApproachIds: ["fixed-window"],
    alternatives: [
      { approachId: "prefix-sums", conditions: "When you already have (or will reuse) a prefix-sum array for other range queries.", tradeoff: "Correct but heavier than a single incremental window for one fixed width.", requiredReasonIds: ["prefix-range-diff"] },
    ],
    modelExplanation:
      "Fixed-size sliding window: the width is fixed at k and the sum updates incrementally for an O(n) solution. Kadane is for any-length subarrays; prefix sums are overkill for one fixed width.",
  },
  "lesson:kadane:kad-choose-1": {
    scenario:
      "Three problems: (a) max sum of exactly k consecutive, (b) count subarrays summing to a target with negatives, (c) max sum of any-length contiguous subarray. Which is Kadane? This drill is about (c).",
    approaches: [
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: ["max-any-length"] },
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: [], rejectionFeedback: "That is the tool for (a): a fixed width k, not the max any-length sum." },
      { id: "prefix-map", label: "Prefix sums + hash map", requiredReasonIds: [], rejectionFeedback: "That is the tool for (b): counting target-sum subarrays with negatives, not maximizing." },
    ],
    reasons: [
      { id: "max-any-length", text: "Problem (c) wants the maximum sum over subarrays of ANY length, so track the best ending here (extend vs restart) in one O(n) pass." },
      { id: "fixed-k", text: "The wording pins a fixed width k, so slide a constant window.", contradictory: true },
      { id: "count-target", text: "The wording counts subarrays hitting a target sum.", contradictory: true },
    ],
    acceptableApproachIds: ["kadane"],
    modelExplanation:
      "Kadane solves (c), the max any-length contiguous sum. (a) is a fixed-size window; (b) is prefix sums + a hash map — same 'subarray' wording, different patterns.",
  },
  "lesson:binary-search:bs-choose-1": {
    scenario:
      "You will search a currently-unsorted collection 100,000 times for different values. Compare linear each time, sort-then-binary-search, or build a set. For pure membership, which is usually best?",
    approaches: [
      { id: "build-set", label: "Build a hash set once, then query", requiredReasonIds: ["set-expected-o1"] },
      { id: "sort-then-bs", label: "Sort once, then binary-search each query", requiredReasonIds: ["sorted-ordered-queries"] },
      { id: "linear-each", label: "Linear search each time", requiredReasonIds: [], rejectionFeedback: "Linear each query is O(n·q); with many queries that is far slower than an expected-O(1) set lookup." },
    ],
    reasons: [
      { id: "set-expected-o1", text: "For pure membership over many queries, an O(n) set build then expected-O(1) lookups gives O(n + q) — the best of the three." },
      { id: "sorted-ordered-queries", text: "Sorting once (O(n log n)) then binary-searching (O(q log n)) also answers ORDERED queries like floor/ceil and ranges that a set cannot." },
      { id: "need-linear-scan", text: "You must scan linearly because the values cannot be hashed.", contradictory: true },
    ],
    acceptableApproachIds: ["build-set"],
    alternatives: [
      { approachId: "sort-then-bs", conditions: "When you also need ORDERED queries such as floor/ceil or ranges, not just membership.", tradeoff: "O(n log n) build + O(q log n) queries — slower than a set for pure membership, but supports order.", requiredReasonIds: ["sorted-ordered-queries"] },
    ],
    modelExplanation:
      "For pure membership across many queries, build a set once (O(n)) then query in expected O(1) → O(n + q). Sort-then-binary-search also works and additionally supports ordered queries like bounds.",
  },
  "lesson:binary-search-answer:bsa-choose-1": {
    scenario:
      "Which fits 'binary search on the answer': (a) sum of exactly k elements, (b) minimize the largest part-sum when splitting an array into m parts, (c) find an element in a sorted array? This drill is about (b).",
    approaches: [
      { id: "bs-answer", label: "Binary search on the answer", requiredReasonIds: ["monotone-feasibility"] },
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: [], rejectionFeedback: "That is the tool for (a): a fixed width k, not a search over candidate answers." },
      { id: "array-bs", label: "Ordinary array binary search", requiredReasonIds: [], rejectionFeedback: "That is the tool for (c): locating an element in a sorted array by position." },
    ],
    reasons: [
      { id: "monotone-feasibility", text: "Minimizing the maximum part-sum has a monotone feasibility check — a larger allowed max is always feasible — so binary-search the candidate cap." },
      { id: "fixed-k-window", text: "The problem pins a fixed count k of elements to sum.", contradictory: true },
      { id: "locate-in-sorted", text: "We are locating a known element in an already-sorted array.", contradictory: true },
    ],
    acceptableApproachIds: ["bs-answer"],
    modelExplanation:
      "(b) fits binary search on the answer: the feasibility of a candidate max part-sum is monotone. (a) is a sliding window; (c) is ordinary array binary search.",
  },
  "lesson:rotated-array-search:rot-choose-1": {
    scenario:
      "Why can't plain binary search be used directly on [4,5,6,7,0,1,2], and what single extra step fixes it?",
    approaches: [
      { id: "which-half-sorted", label: "Detect which half of mid is sorted, then decide", requiredReasonIds: ["identify-sorted-half"] },
      { id: "plain-bs", label: "Plain binary search comparing nums[mid] to target", requiredReasonIds: [], rejectionFeedback: "The array is not fully sorted, so nums[mid] vs target alone cannot tell which half to discard." },
      { id: "linear", label: "Linear scan", requiredReasonIds: [], rejectionFeedback: "A scan is O(n) and throws away the fact that each half is still sorted, which permits O(log n)." },
    ],
    reasons: [
      { id: "identify-sorted-half", text: "First determine which half of mid is sorted (e.g. nums[lo] ≤ nums[mid]); then check whether the target lies in that half's range to decide which side to keep — still O(log n)." },
      { id: "fully-sorted", text: "The array is fully sorted, so plain binary search works unchanged.", contradictory: true },
      { id: "no-order", text: "The array has no usable order, so only a linear scan can work.", contradictory: true },
    ],
    acceptableApproachIds: ["which-half-sorted"],
    modelExplanation:
      "Because the array isn't fully sorted, nums[mid] vs target alone can't pick a half. Identify which half of mid IS sorted, then decide using that half's range — O(log n).",
  },
  "lesson:monotonic-stack:mono-choose-1": {
    scenario:
      "For each day, how many days until a warmer temperature? Which structure gives O(n), and what does it hold?",
    approaches: [
      { id: "mono-stack", label: "Monotonic (decreasing) stack of indices", requiredReasonIds: ["pop-on-warmer-day"] },
      { id: "brute", label: "For each day scan forward for a warmer day", requiredReasonIds: [], rejectionFeedback: "The nested forward scan is O(n^2); a monotonic stack answers all days in O(n)." },
    ],
    reasons: [
      { id: "pop-on-warmer-day", text: "Keep a decreasing stack of day indices awaiting a warmer day; when a warmer day arrives, pop the waiting days and record the index gap — O(n) total." },
      { id: "window-expiry", text: "Elements expire from the front of a fixed-size window, so a deque is required.", contradictory: true },
      { id: "sort-temps", text: "The temperatures must be sorted before processing.", contradictory: true },
    ],
    acceptableApproachIds: ["mono-stack"],
    modelExplanation:
      "A monotonic decreasing stack of indices: each warmer day pops the cooler days waiting below and records the wait, giving O(n) total.",
  },
  "lesson:prefix-sums-map:psm-choose-1": {
    scenario:
      "Three problems: (a) max sum of exactly k consecutive, (b) count subarrays summing to k WITH negatives, (c) max-sum any-length subarray. Which needs prefix sums + a map? This drill is about (b).",
    approaches: [
      { id: "prefix-map", label: "Prefix sums + hash map", requiredReasonIds: ["count-target-negatives"] },
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: [], rejectionFeedback: "That is the tool for (a): a fixed width k; it cannot count arbitrary-length target sums with negatives." },
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: [], rejectionFeedback: "That is the tool for (c): the max any-length sum; it does not count target-sum subarrays." },
    ],
    reasons: [
      { id: "count-target-negatives", text: "Problem (b) counts arbitrary-length subarrays summing to k and tolerates negatives, so track prefix sums in a map and count earlier prefixes equal to (current − k)." },
      { id: "fixed-width-k", text: "The problem pins a fixed width k, so a constant window applies.", contradictory: true },
      { id: "maximize-only", text: "We only need the single maximum sum, so extend-vs-restart suffices.", contradictory: true },
    ],
    acceptableApproachIds: ["prefix-map"],
    modelExplanation:
      "(b) needs prefix sums + a map: it counts arbitrary-length target-sum subarrays and handles negatives. (a) is a fixed-size window; (c) is Kadane.",
  },
  "lesson:top-k:topk-choose-1": {
    scenario:
      "You need the 10 largest of 10 million numbers arriving as a stream. Full sort or a size-k heap?",
    approaches: [
      { id: "size-k-heap", label: "Size-k (min-)heap", requiredReasonIds: ["bounded-stream-heap"] },
      { id: "full-sort", label: "Sort everything, take the top 10", requiredReasonIds: [], rejectionFeedback: "A full sort is O(n log n) and needs all n in memory — impossible for a 10-million-element stream." },
    ],
    reasons: [
      { id: "bounded-stream-heap", text: "A size-k min-heap holds only the k best seen: push each number, pop the smallest on overflow — O(n log k) time, O(k) space, stream-friendly." },
      { id: "all-in-memory", text: "The whole input fits in memory, so a full sort is fine.", contradictory: true },
      { id: "need-median-boundary", text: "You need the boundary between the lower and upper halves, so two heaps are required.", contradictory: true },
    ],
    acceptableApproachIds: ["size-k-heap"],
    modelExplanation:
      "A size-k min-heap: O(n log k) time, O(k) space, and it works on a stream. A full sort is O(n log n) and needs all n in memory — far worse.",
  },
  "lesson:kth-largest:kth-choose-1": {
    scenario:
      "Kth largest in a fixed in-memory array with no streaming. Heap (O(n log k)) or quickselect (expected O(n))? What's the risk with quickselect?",
    approaches: [
      { id: "quickselect", label: "Quickselect", requiredReasonIds: ["partition-expected-linear"] },
      { id: "size-k-heap", label: "Size-k heap", requiredReasonIds: [], rejectionFeedback: "The heap is O(n log k) and best for streams or when you need all top-k; for a single in-memory order statistic quickselect is faster on average." },
    ],
    reasons: [
      { id: "partition-expected-linear", text: "All data is in memory and only one order statistic is needed, so partitioning around a pivot finds the k-th largest in expected O(n), O(1) extra space — though bad pivots risk O(n²), mitigated by random/median pivots." },
      { id: "heap-predictable", text: "A size-k heap gives predictable O(n log k) with no O(n²) worst case, and works on a stream or when all top-k are needed." },
      { id: "need-all-k", text: "You need all top-k elements, not just the k-th.", contradictory: true },
    ],
    acceptableApproachIds: ["quickselect"],
    alternatives: [
      { approachId: "size-k-heap", conditions: "When the input streams or you need all top-k, or you want predictable worst-case behavior.", tradeoff: "O(n log k) versus quickselect's expected O(n), but avoids quickselect's O(n²) worst case.", requiredReasonIds: ["heap-predictable"] },
    ],
    modelExplanation:
      "Quickselect is faster on average (expected O(n), O(1) extra space) but risks O(n²) with bad pivots (mitigate with random/median pivots). The heap is O(n log k), predictable, and streaming-capable.",
  },
  "lesson:running-median:med-choose-1": {
    scenario:
      "You must report the median after every insertion in a stream of a million numbers. Two heaps or re-sort each time?",
    approaches: [
      { id: "two-heaps", label: "Two heaps (balanced halves)", requiredReasonIds: ["log-insert-const-query"] },
      { id: "resort", label: "Re-sort on every query", requiredReasonIds: [], rejectionFeedback: "Re-sorting is O(n log n) per query → O(n² log n) overall — hopeless for a million insertions." },
    ],
    reasons: [
      { id: "log-insert-const-query", text: "A low-half max-heap and high-half min-heap kept balanced give O(log n) per insert and O(1) per median → O(n log n) total." },
      { id: "single-report", text: "The median is reported only once at the end, so a single sort suffices.", contradictory: true },
      { id: "one-extreme-only", text: "Only one extreme value is ever needed, so a single heap works.", contradictory: true },
    ],
    acceptableApproachIds: ["two-heaps"],
    modelExplanation:
      "Two heaps: O(log n) per insert and O(1) per median → O(n log n) total, versus re-sorting's O(n² log n). The two-heap approach is vastly better.",
  },
  "lesson:two-heap-pattern:twoheap-choose-1": {
    scenario:
      "Which fit the two-heap pattern: (a) find the kth largest, (b) running median of a stream, (c) merge k sorted lists? This drill is about identifying (b).",
    approaches: [
      { id: "two-heaps", label: "Two opposing balanced heaps", requiredReasonIds: ["half-boundary"] },
      { id: "single-heap", label: "Single size-k heap", requiredReasonIds: [], rejectionFeedback: "That is the tool for (a): one extreme via a single heap, not the half-boundary a median needs." },
      { id: "kway-merge", label: "K-way merge (heap of fronts)", requiredReasonIds: [], rejectionFeedback: "That is the tool for (c): merging k sorted sequences, not tracking a running median." },
    ],
    reasons: [
      { id: "half-boundary", text: "Problem (b), the running median, needs the boundary between the lower and upper halves — exactly what two opposing balanced heaps maintain." },
      { id: "one-extreme", text: "You only need one extreme value, so a single heap is enough.", contradictory: true },
      { id: "merge-sequences", text: "You are merging several sorted sequences into one.", contradictory: true },
    ],
    acceptableApproachIds: ["two-heaps"],
    modelExplanation:
      "(b) running median uses two heaps to hold the half-boundary. (a) is a single size-k heap; (c) is a k-way merge — only (b) balances two opposing heaps.",
  },
  "lesson:topological-sort:topo-choose-1": {
    scenario:
      "You must schedule courses given prerequisite pairs and also report if scheduling is impossible. Which algorithm, and how do you detect impossibility?",
    approaches: [
      { id: "topo-kahn", label: "Topological sort (Kahn's algorithm)", requiredReasonIds: ["peel-and-detect-cycle"] },
      { id: "bfs-distance", label: "Shortest-path BFS", requiredReasonIds: [], rejectionFeedback: "Shortest-path BFS computes distances; it does not produce a dependency-respecting order or detect a prerequisite cycle." },
    ],
    reasons: [
      { id: "peel-and-detect-cycle", text: "Kahn's algorithm peels prerequisite-free courses via in-degrees to produce a valid order in O(V+E); if fewer than V courses come out, a cycle makes scheduling impossible." },
      { id: "fewest-edges", text: "The task asks for the fewest edges between two courses.", contradictory: true },
      { id: "weighted-cost", text: "Prerequisites carry weights, so a priority queue by cost is needed.", contradictory: true },
    ],
    acceptableApproachIds: ["topo-kahn"],
    modelExplanation:
      "Topological sort (Kahn's): peel prerequisite-free courses via in-degrees for a valid order in O(V+E); if fewer than V emerge, a prerequisite cycle makes it impossible.",
  },
  "lesson:union-find:uf-choose-1": {
    scenario:
      "Edges are added one at a time and after each you must answer 'are u and v connected?'. Union-Find or repeated BFS/DFS?",
    approaches: [
      { id: "union-find", label: "Union-Find (DSU)", requiredReasonIds: ["amortized-alpha"] },
      { id: "bfs-dfs-each", label: "Repeated BFS/DFS per query", requiredReasonIds: [], rejectionFeedback: "Each traversal is O(V+E); repeating it for a stream of edges/queries is far too slow." },
    ],
    reasons: [
      { id: "amortized-alpha", text: "Each union and connectivity query is amortized near-constant (α(n)) with path compression and union by rank, so a stream of edges/queries is near-linear overall." },
      { id: "static-once", text: "The graph is fixed and you count connectivity exactly once, so a single traversal is simplest.", contradictory: true },
      { id: "shortest-path-needed", text: "You need shortest weighted paths, so a priority queue is required.", contradictory: true },
    ],
    acceptableApproachIds: ["union-find"],
    modelExplanation:
      "Union-Find: amortized near-O(1) union and connectivity queries make a stream of incremental edges near-linear; repeated BFS/DFS is O(V+E) per query.",
  },
  "lesson:dijkstra:dij-choose-1": {
    scenario:
      "Pick the shortest-path algorithm: (a) unweighted social graph, (b) road network with positive distances, (c) currency graph with possible negative-weight edges. This drill is about (b).",
    approaches: [
      { id: "dijkstra", label: "Dijkstra's algorithm", requiredReasonIds: ["nonneg-weighted"] },
      { id: "bfs", label: "Plain BFS", requiredReasonIds: [], rejectionFeedback: "That is the tool for (a): an unweighted graph. With differing positive weights, fewest edges is not lowest cost." },
      { id: "bellman", label: "Bellman–Ford", requiredReasonIds: [], rejectionFeedback: "That is the tool for (c): negative weights. With all-positive weights it is unnecessarily slow." },
    ],
    reasons: [
      { id: "nonneg-weighted", text: "The road network (b) has non-negative weights, so a min-heap that settles the closest node and relaxes its edges is correct — O((V+E) log V)." },
      { id: "unweighted-bfs", text: "All edges cost the same, so counting edges equals cost.", contradictory: true },
      { id: "negative-edges", text: "Some edges are negative, so the closest-is-final rule fails.", contradictory: true },
    ],
    acceptableApproachIds: ["dijkstra"],
    modelExplanation:
      "(b) uses Dijkstra — non-negative weights, O((V+E) log V). (a) is BFS on an unweighted graph; (c) needs Bellman–Ford for negative edges.",
  },
  "lesson:bellman-ford:bf-choose-1": {
    scenario:
      "A graph has some negative edge weights (but no negative cycle). Dijkstra or Bellman–Ford? What's the complexity trade-off?",
    approaches: [
      { id: "bellman", label: "Bellman–Ford", requiredReasonIds: ["relax-handles-negative"] },
      { id: "dijkstra", label: "Dijkstra's algorithm", requiredReasonIds: [], rejectionFeedback: "Dijkstra is incorrect with negative edges: its 'closest is final' assumption breaks, so it can return wrong distances." },
    ],
    reasons: [
      { id: "relax-handles-negative", text: "Bellman–Ford relaxes all edges V−1 times, so it is correct with negative weights and can also detect negative cycles — O(V·E), slower than Dijkstra's O((V+E) log V)." },
      { id: "all-positive", text: "All weights are non-negative, so the closest-is-final rule holds.", contradictory: true },
      { id: "unweighted", text: "The graph is unweighted, so BFS suffices.", contradictory: true },
    ],
    acceptableApproachIds: ["bellman"],
    modelExplanation:
      "Bellman–Ford: correct with negative edges (and detects negative cycles), O(V·E) — slower than Dijkstra's O((V+E) log V) but Dijkstra is simply incorrect here.",
  },
  "lesson:dp-memoization:dpmemo-choose-1": {
    scenario:
      "A recursive function recomputes the same subproblems but keeps side effects (it prints as it goes). Is naive memoization safe? What's the fix?",
    approaches: [
      { id: "separate-pure", label: "Separate the pure computation from the side effects, then memoize the pure part", requiredReasonIds: ["cache-skips-effects"] },
      { id: "memoize-asis", label: "Memoize the function as-is", requiredReasonIds: [], rejectionFeedback: "Caching returns the stored value on repeat calls and skips the side effects (the prints), changing observable behavior." },
    ],
    reasons: [
      { id: "cache-skips-effects", text: "A cache short-circuits repeat calls, so the side effects fire only the first time; isolate the pure computation and memoize that, or remove the effects before caching." },
      { id: "no-overlap", text: "There are no overlapping subproblems, so memoization does nothing at all.", contradictory: true },
      { id: "effects-are-pure", text: "Printing is a pure operation, so caching cannot change behavior.", contradictory: true },
    ],
    acceptableApproachIds: ["separate-pure"],
    modelExplanation:
      "Not safe as-is: caching skips the side effects on repeat calls. Separate the pure computation (memoize that) from the side effects, or remove the effects before caching.",
  },
  "lesson:dp-tabulation:dptab-choose-1": {
    scenario:
      "You have a DP whose recursion depth would exceed Python's recursion limit for large inputs. Memoization or tabulation?",
    approaches: [
      { id: "tabulation", label: "Bottom-up tabulation", requiredReasonIds: ["iterative-no-stack"] },
      { id: "memoization", label: "Top-down memoized recursion", requiredReasonIds: [], rejectionFeedback: "Memoized recursion still recurses, so very large inputs can hit Python's recursion limit (RecursionError)." },
    ],
    reasons: [
      { id: "iterative-no-stack", text: "Tabulation fills the table iteratively, so there is no recursion stack and no depth-limit risk for large inputs." },
      { id: "no-overlap", text: "The subproblems do not overlap, so DP offers no benefit.", contradictory: true },
      { id: "recursion-unlimited", text: "Python has no recursion depth limit, so deep recursion is safe.", contradictory: true },
    ],
    acceptableApproachIds: ["tabulation"],
    modelExplanation:
      "Tabulation is iterative, so there's no recursion stack and no depth-limit risk; memoized recursion could hit RecursionError for very large inputs.",
  },
  "lesson:dp-coin-change:dpcc-choose-1": {
    scenario:
      "For coins [1,3,4], amount 6: what does greedy give vs DP, and which should you trust?",
    approaches: [
      { id: "dp", label: "Dynamic programming", requiredReasonIds: ["non-canonical-needs-dp"] },
      { id: "greedy", label: "Greedy (always take the largest coin)", requiredReasonIds: [], rejectionFeedback: "Greedy gives 4+1+1 = 3 coins here, but DP finds 3+3 = 2; this coin system is non-canonical, so greedy is not optimal." },
    ],
    reasons: [
      { id: "non-canonical-needs-dp", text: "For [1,3,4] amount 6, greedy yields 3 coins (4+1+1) while DP yields 2 (3+3); the coin system is non-canonical, so only DP over subamounts guarantees the minimum." },
      { id: "greedy-canonical", text: "This coin system is canonical, so the largest-coin-first greedy is always optimal.", contradictory: true },
      { id: "coins-unique-use", text: "Each coin may be used at most once, so it is a 0/1 subset problem.", contradictory: true },
    ],
    acceptableApproachIds: ["dp"],
    modelExplanation:
      "Trust DP: greedy gives 4+1+1 = 3 coins, but DP gives 3+3 = 2. Greedy is not optimal for this non-canonical coin system.",
  },
};

/**
 * uid -> scaffold prepended before the learner's code so a lesson CODE FRAGMENT
 * (one that references names defined elsewhere in the lesson, is a loop/method
 * body, or uses a module-level `return`) becomes a complete, runnable program.
 * The run source is `preludeCode + "\n" + learnerCode + "\n# --- tests ---\n" +
 * tests`. Authored so the MODEL solution passes and the unfinished starter and
 * mistake variants fail — same verification gate as EXERCISE_TESTS.
 */
export const EXERCISE_PRELUDE: Record<string, string> = {
  "lesson:bfs-queues:bfs-fix-1":
    "from collections import deque as _deque\n_appends = {'n': 0}\nclass deque(_deque):\n    def append(self, x):\n        _appends['n'] += 1\n        super().append(x)\ngraph = {0: [1, 2], 1: [0, 2, 3], 2: [0, 1], 3: [1]}\nstart = 0",
  "lesson:dijkstra:dij-fix-1":
    "import heapq\n_expand = {'n': 0}\nclass _CountAdj(dict):\n    def __getitem__(self, k):\n        _expand['n'] += 1\n        return super().__getitem__(k)\nadj = _CountAdj({0: [(1, 1), (2, 4)], 1: [(2, 1), (3, 5)], 2: [(3, 1)], 3: []})\nn = 4\ndist = [float('inf')] * n\ndist[0] = 0\npq = [(0, 0)]",
  "lesson:bellman-ford:bf-complete-1":
    "",
  "lesson:floyd-warshall:fw-fix-1":
    "",
  "lesson:prim:prim-fix-1":
    "",
  "lesson:linked-list-traversal:ll-fix-1":
    "",
  "lesson:linked-list-slow-fast:llsf-fix-1":
    "",
  "lesson:linked-list-merging:llm-complete-1":
    "",
  "lesson:linked-list-pointer-manipulation:llpm-complete-1":
    "",
  "lesson:linked-list-pointer-manipulation:llpm-fix-1":
    "",
  "lesson:linked-list-variants:llv-complete-1":
    "",
  "lesson:dp-base-cases:dpbc-fix-1":
    "",
  "lesson:dp-permutations:dpperm-complete-1":
    "",
  "lesson:dp-permutations:dpperm-fix-1":
    "",
  "lesson:dp-knapsack:dpks-complete-1":
    "",
  "lesson:dp-subsequences:dpsub-complete-1":
    "",

  // ── R6 runnable fragments (indices 41-80 of remaining) ─────────────
  "lesson:dp-grid-paths:dpgp-fix-1":
    "",
  "lesson:dp-lcs:dplcs-complete-1":
    "",
  "lesson:dp-n-queens:dpnq-fix-1":
    "",
  "pattern:kadane:pat-kadane-fix-1":
    "",
  "pattern:bfs-shortest-path:pat-bfs-fix-1":
    "",
  "pattern:backtracking:pat-bt-fix-1":
    "",
  "pattern:two-heaps:pat-th-fix-1":
    "",
  "pattern:k-way-merge:pat-kwm-fix-1":
    "",
  "pattern:monotonic-stack:pat-ms-fix-1":
    "",
  "pattern:merge-intervals:pat-mi-fix-1":
    "",
  "pattern:cyclic-sort:pat-cs-fix-1":
    "",
  "pattern:matrix-traversal:pat-mt-fix-1":
    "",
  "pattern:tree-bfs:pat-tbfs-fix-1":
    "",
  "pattern:tree-dfs:pat-tdfs-fix-1":
    "",
  "pattern:graph-dfs-components:pat-gdc-fix-1":
    "",
  "pattern:topological-sort:pat-topo-fix-1":
    "",
  "pattern:union-find:pat-uf-fix-1":
    "",
  "pattern:dijkstra:pat-dij-fix-1":
    "import heapq\n_expand = {'n': 0}\nclass _CountAdj(dict):\n    def __getitem__(self, k):\n        _expand['n'] += 1\n        return super().__getitem__(k)\nadj = _CountAdj({0: [(1, 1), (2, 4)], 1: [(2, 1), (3, 5)], 2: [(3, 1)], 3: []})\nn = 4\ndist = [float('inf')] * n\ndist[0] = 0\npq = [(0, 0)]",
  "pattern:trie-prefix:pat-trie-fix-1":
    "",
  "pattern:dynamic-programming:pat-dp-fix-1":
    "",
  "pattern:knapsack:pat-ks-fix-1":
    "",
};


/**
 * R6.5 — full six-stage hint progression, keyed by uid. When present this
 * REPLACES the exercise's default hints. The six stages are:
 *   1. understand the example/goal,
 *   2. identify the repeated work or storage cost,
 *   3. reveal a useful property,
 *   4. suggest an approach,
 *   5. show pseudocode,
 *   6. the explained solution step.
 * Written for the specific exercise (no generic filler). Verified by
 * scripts/verify_exercise_tests.mjs (>= 5 distinct, non-empty stages for an
 * exercise that opts in). Exercises without an entry keep their authored hints.
 */
export const EXERCISE_HINTS: Record<string, string[]> = {
  "lesson:variables-and-types:vt-fix-1": [
    "Goal: after copying the list you want to change `b` and leave `a` still equal to [1, 2, 3].",
    "The expense here is a hidden shared object: `b = a` stores the same list reference, so one append touches both names.",
    "Key insight: assignment copies the reference, not the contents \u2014 you need a genuinely separate list object.",
    "Approach: make a shallow copy of the list before mutating it.",
    "Pseudocode: set a = [1,2,3]; make b a fresh copy of a; append to b; print a to confirm it is unchanged.",
    "Replace `b = a` with `b = list(a)` (or `a.copy()` / `a[:]`) so `b` is independent and `a` stays [1, 2, 3].",
  ],
  "lesson:loops:loop-fix-1": [
    "Goal: make the while loop print 0, 1, 2 and then stop instead of running forever.",
    "The problem is that nothing inside the loop changes the value the condition `i < 3` tests.",
    "Key insight: a while loop only ends when its condition becomes False, so some state must move toward that boundary.",
    "Approach: advance the counter each iteration so it eventually reaches the limit.",
    "Pseudocode: start i = 0; while i < 3: print i, then increase i by one.",
    "Add `i = i + 1` as the last line inside the loop so `i` grows to 3 and `i < 3` becomes False.",
  ],
  "lesson:loops:loop-complete-1": [
    "Goal: count how many numbers in nums are even and print that count (here the answer is 2).",
    "You need one running total that survives across iterations rather than recomputing anything.",
    "Key insight: a number is even exactly when dividing by 2 leaves no remainder.",
    "Approach: loop over the list and increment an accumulator whenever the evenness test passes.",
    "Pseudocode: count = 0; for each x in nums: if x is even, add one to count; print count.",
    "Inside `if x % 2 == 0:` put `count = count + 1` so each even value bumps the tally.",
  ],
  "lesson:functions:func-complete-1": [
    "Goal: define square(n) returning n multiplied by itself, then print square(6) which should show 36.",
    "There is no repeated work to optimise; the point is to package one computation as a reusable function.",
    "Key insight: squaring a number is simply that number times itself.",
    "Approach: write a def with a return statement, then call it inside print.",
    "Pseudocode: def square(n): return n times n; then print(square(6)).",
    "Use `return n * n` in the body and `print(square(6))` to display 36.",
  ],
  "lesson:io:io-fix-1": [
    "Goal: read one number and print its double (entering 5 should print 10, not '55').",
    "The costly mistake is treating text as if it were a number: `input()` hands back a string.",
    "Key insight: multiplying a string by 2 repeats the text, while multiplying an int by 2 doubles the value.",
    "Approach: convert the input to an integer before doing arithmetic.",
    "Pseudocode: read the line, convert it to int, then print that value times two.",
    "Wrap the input in `int(...)` \u2014 `n = int(input('n: '))` \u2014 then `print(n * 2)` gives the double.",
  ],
  "lesson:references-mutation:ref-fix-1": [
    "Goal: return a list with its last element duplicated while leaving the caller's original list untouched.",
    "The expense is mutating shared state: appending to the passed-in list changes the caller's data.",
    "Key insight: the parameter and the caller's variable point at the same list, so in-place edits leak out.",
    "Approach: work on a private copy of the argument instead of the original.",
    "Pseudocode: copy the list; append the copy's last element to the copy; return the copy.",
    "Start with `copy = list(lst)` and operate on `copy`, so the caller's list is never modified.",
  ],
  "lesson:classes:class-complete-1": [
    "Goal: add a reset() method to Counter that sets its value attribute back to 0.",
    "There is no repeated computation; the task is knowing where instance state lives.",
    "Key insight: an instance's data is stored on `self`, and methods change it through `self`.",
    "Approach: define a method that assigns 0 to the value attribute on self.",
    "Pseudocode: def reset(self): set self's value to zero.",
    "Inside `def reset(self):` write `self.value = 0`.",
  ],
  "lesson:errors:err-complete-1": [
    "Goal: make the division print 'undefined' when the divisor is 0 instead of crashing.",
    "The risky operation is `a / b`, which raises when b is zero.",
    "Key insight: dividing by zero raises the specific exception ZeroDivisionError, which you can catch.",
    "Approach: guard the division with try/except targeting that exception.",
    "Pseudocode: try to print a / b; except ZeroDivisionError: print 'undefined'.",
    "Put `print(a / b)` in the try and handle it with `except ZeroDivisionError: print('undefined')`.",
  ],
  "lesson:correctness:correct-fix-1": [
    "Goal: sum_to(n) should add 1 through n inclusive (sum_to(3) is 6, not 3).",
    "The bug is an off-by-one in the loop boundary that drops the final term n.",
    "Key insight: `i < n` stops before i equals n, so n itself is never added.",
    "Approach: extend the loop condition so it includes n.",
    "Pseudocode: total = 0, i = 1; while i is at most n: add i to total, increment i; return total.",
    "Change the condition to `while i <= n:` so the last term n is included.",
  ],
  "lesson:array-traversal:arr-trav-complete-1": [
    "Goal: add up every element of nums and print the total (here 17).",
    "You need one accumulator carried across the loop rather than recomputing sums.",
    "Key insight: index i lets you read each element as nums[i] during the range walk.",
    "Approach: loop over the indices and fold each element into a running total.",
    "Pseudocode: total = 0; for i in range(len(nums)): add nums[i] to total; print total.",
    "Inside the loop write `total = total + nums[i]` to accumulate every element.",
  ],
  "lesson:two-pointers:tp-fix-1": [
    "Goal: reverse the list in place by swapping ends, then stop \u2014 not loop forever.",
    "Nothing moves the two pointers, so the condition `lo < hi` never becomes False.",
    "Key insight: a converging two-pointer loop ends only when both pointers step toward the middle.",
    "Approach: after each swap, advance lo inward and pull hi inward.",
    "Pseudocode: while lo < hi: swap arr[lo] and arr[hi]; increase lo; decrease hi.",
    "Add `lo = lo + 1` and `hi = hi - 1` inside the loop so the pointers meet and the loop ends.",
  ],
  "lesson:two-pointers:tp-choose-1": [
    "Goal: decide which two-pointer layout tests whether a string reads the same both ways.",
    "The cost to avoid is scanning or reversing separately; a single pass comparing pairs is enough.",
    "Key insight: a palindrome is symmetric about its center, so the first and last characters must match, and so on inward.",
    "Approach: use converging pointers starting at both ends rather than two same-direction pointers.",
    "Pseudocode: put lo at the start and hi at the end; while lo < hi compare the two characters and move both inward.",
    "Choose converging (both-ends) pointers: compare s[lo] and s[hi] as they move inward, and a mismatch means it is not a palindrome.",
  ],
  "lesson:prefix-sums:ps-complete-1": [
    "Goal: return the sum of nums[a:b] using a precomputed prefix array in O(1).",
    "Re-adding the range each query is the wasteful part; the prefix array already stores cumulative sums.",
    "Key insight: prefix[i] holds the sum of the first i elements, so a range sum is a difference of two prefixes.",
    "Approach: subtract the prefix before a from the prefix before b.",
    "Pseudocode: return prefix at b minus prefix at a.",
    "Write `return prefix[b] - prefix[a]`.",
  ],
  "lesson:prefix-sums:ps-choose-1": [
    "Goal: choose between prefix sums and re-summing for 10,000 range queries on a fixed 100,000-element array.",
    "Re-summing repeats the same additions for every query, wasting work proportional to range width each time.",
    "Key insight: because the array is fixed, one preprocessing pass can answer any range in constant time.",
    "Approach: build a prefix-sum table once, then answer each query with a single subtraction.",
    "Pseudocode: build prefix in O(n); per query return prefix[b] - prefix[a] in O(1).",
    "Prefix sums win: O(n) build + O(1) per query = O(n + q), versus O(n\u00b7q) for re-summing.",
  ],
  "lesson:sliding-window:sw-complete-1": [
    "Goal: slide a fixed-width-k window one step and update its sum in O(1).",
    "Recomputing the whole window each step is the expensive part you want to avoid.",
    "Key insight: moving the window right adds exactly one new element and drops exactly one old element.",
    "Approach: adjust the running sum incrementally instead of re-summing k elements.",
    "Pseudocode: for i from k onward: window += entering element nums[i], window -= leaving element nums[i-k].",
    "Write `window = window + nums[i] - nums[i - k]` inside the loop.",
  ],
  "lesson:sliding-window:sw-choose-1": [
    "Goal: pick the pattern for 'largest sum of exactly k consecutive elements.'",
    "The naive cost is re-summing every length-k block; that repeats work you can update incrementally.",
    "Key insight: the target block is contiguous and of fixed width k, so its sum updates by one add and one subtract per step.",
    "Approach: use a fixed-size sliding window, not Kadane and not prefix sums.",
    "Pseudocode: sum the first k; slide right updating the sum; track the maximum sum seen.",
    "Choose the fixed-size sliding window: Kadane handles any-length subarrays and prefix sums answer arbitrary ranges, neither matching 'exactly k'.",
  ],
  "lesson:kadane:kad-fix-1": [
    "Goal: return the maximum-sum contiguous subarray, correct even when every number is negative.",
    "Seeding the running sum at 0 is the bug: it lets an empty selection win when all values are negative.",
    "Key insight: with all negatives the best subarray is the single least-negative element, not 0.",
    "Approach: initialise both best and current from the first element, then scan the rest.",
    "Pseudocode: best = current = nums[0]; for x in nums[1:]: current = max(x, current + x); best = max(best, current).",
    "Seed `best = nums[0]` and `current = nums[0]` and iterate over `nums[1:]` so an all-negative array returns its largest element.",
  ],
  "lesson:kadane:kad-choose-1": [
    "Goal: match three subarray problems to their patterns and identify which is Kadane.",
    "The trap is the shared word 'subarray'; the distinguishing cost is whether length is fixed, free, or you are counting matches.",
    "Key insight: Kadane maximises a sum over any-length contiguous run, while fixed width and target-counting are different problems.",
    "Approach: classify by the length constraint and the objective before picking a tool.",
    "Pseudocode: fixed width \u2192 window; count target sums with negatives \u2192 prefix sums + map; max any-length sum \u2192 Kadane.",
    "Answer: (c) max any-length contiguous sum is Kadane; (a) is a fixed-size window and (b) is prefix sums + a hash map.",
  ],
  "lesson:in-place-modification:ip-complete-1": [
    "Goal: remove every occurrence of target in place and return the new length.",
    "Allocating a new list is the cost to avoid; you overwrite in place instead.",
    "Key insight: a slow 'insert' index marks where the next kept element goes, compacting survivors to the front.",
    "Approach: use the two-pointer read/write (fast scan, slow write) technique.",
    "Pseudocode: insert = 0; for each i: if nums[i] != target, write it at insert and advance insert; return insert.",
    "In the keep branch do `nums[insert] = nums[i]` then `insert = insert + 1`, and `return insert`.",
  ],
  "lesson:matrix-traversal:mat-complete-1": [
    "Goal: sum every value in a 2D grid and print the total (here 21).",
    "You need a single accumulator across nested loops rather than partial sums.",
    "Key insight: a cell is addressed by row and column as grid[r][c].",
    "Approach: nest a column loop inside a row loop and fold each cell into the total.",
    "Pseudocode: total = 0; for r in rows: for c in columns of that row: add grid[r][c]; print total.",
    "Inside the inner loop write `total = total + grid[r][c]`.",
  ],
  "lesson:intervals:int-fix-1": [
    "Goal: merge overlapping intervals correctly even when the input arrives unsorted.",
    "The missing expense is ordering: the single sweep assumes overlapping intervals are adjacent.",
    "Key insight: only after sorting by start do overlaps become neighbours the sweep can merge.",
    "Approach: sort first, then do the one-pass merge extending the last interval's end.",
    "Pseudocode: sort intervals; start merged with the first; for each next: if it overlaps the last, extend its end, else append it.",
    "Add `intervals.sort()` before building `merged` so the left-to-right merge is valid.",
  ],
  "lesson:string-frequency:sf-complete-1": [
    "Goal: build a dict counting how often each character appears in s.",
    "The subtlety is reading a count that may not exist yet without raising KeyError.",
    "Key insight: dict.get(key, 0) returns 0 for unseen characters, letting you always add one.",
    "Approach: loop the characters and increment their counts via get-with-default.",
    "Pseudocode: freq = {}; for ch in s: freq[ch] = current count (default 0) + 1; print freq.",
    "Use `freq[ch] = freq.get(ch, 0) + 1` inside the loop.",
  ],
  "lesson:string-two-pointers:stp-complete-1": [
    "Goal: check whether s is a palindrome using two pointers, returning True/False.",
    "Reversing the whole string costs extra space; a two-pointer scan needs none.",
    "Key insight: matching characters at symmetric positions from both ends proves symmetry.",
    "Approach: start pointers at both ends, compare, and move them inward.",
    "Pseudocode: lo=0, hi=last; while lo<hi: if s[lo]!=s[hi] return False; move lo up, hi down; return True.",
    "After the mismatch check, advance the pointers with `lo += 1` and `hi -= 1`.",
  ],
  "lesson:string-parsing:sp-complete-1": [
    "Goal: parse a space-separated line into integers and print the maximum (here 9).",
    "Doing this by manual index slicing is the tedious cost; splitting handles tokenisation for you.",
    "Key insight: str.split() with no argument breaks on any whitespace into a list of tokens.",
    "Approach: split the line, convert each token to int in a comprehension, then take max.",
    "Pseudocode: nums = [int(p) for p in line.split()]; print(max(nums)).",
    "Write `nums = [int(p) for p in line.split()]` then `print(max(nums))`.",
  ],
  "lesson:palindromes:pal-complete-1": [
    "Goal: write is_palindrome(s) that returns whether s reads the same reversed.",
    "There is little repeated work; the point is a concise, correct comparison.",
    "Key insight: the slice s[::-1] produces the reversed string.",
    "Approach: compare the string to its reversed slice.",
    "Pseudocode: return whether s equals its reverse.",
    "Write `return s == s[::-1]`.",
  ],
  "lesson:anagrams:ana-complete-1": [
    "Goal: write is_anagram(a, b) using the O(n) frequency-count approach.",
    "Sorting both strings is O(n log n); comparing counts is only O(n).",
    "Key insight: two strings are anagrams exactly when their character frequency maps are identical.",
    "Approach: build a Counter for each string and compare them.",
    "Pseudocode: return whether Counter(a) equals Counter(b).",
    "Write `return Counter(a) == Counter(b)` after importing Counter.",
  ],
  "lesson:linear-search:ls-complete-1": [
    "Goal: return True if target appears in nums, else False.",
    "There is nothing to precompute for a single unsorted search; you just scan once.",
    "Key insight: the moment you find a match you can stop and answer True.",
    "Approach: loop each element, returning early on a match, and return False after the loop.",
    "Pseudocode: for x in nums: if x == target: return True; return False.",
    "Inside the loop write `if x == target: return True`, and `return False` at the end.",
  ],
  "lesson:binary-search:bs-fix-1": [
    "Goal: search a sorted array for target and stop cleanly instead of looping forever.",
    "The bug is a range that fails to shrink when a bound is set to mid rather than past it.",
    "Key insight: mid was already checked, so the next range must exclude it to guarantee progress.",
    "Approach: move the surviving bound one step past mid on each branch.",
    "Pseudocode: while lo<=hi: mid=(lo+hi)//2; if hit return mid; if too small lo=mid+1 else hi=mid-1; return -1.",
    "Use `lo = mid + 1` and `hi = mid - 1` so the search interval always shrinks.",
  ],
  "lesson:binary-search:bs-choose-1": [
    "Goal: pick the best structure for 100,000 membership searches over a currently unsorted collection.",
    "Linear search repeats an O(n) scan per query; the cost adds up to O(n\u00b7q).",
    "Key insight: preprocessing once \u2014 sorting or hashing \u2014 makes each later query cheap.",
    "Approach: weigh a set (expected O(1) membership) against sort-then-binary-search (ordered queries).",
    "Pseudocode: build set once \u2192 O(n)+O(q); or sort once \u2192 O(n log n) + O(q log n) queries.",
    "For plain membership choose the set (O(n) build + expected O(1) per query); use sorted + binary search when you also need order-based queries like bounds.",
  ],
  "lesson:binary-search-answer:bsa-choose-1": [
    "Goal: identify which problem fits 'binary search on the answer.'",
    "The naive cost is testing every candidate value; a monotone feasibility test lets you halve the search space.",
    "Key insight: minimising the largest part-sum has a monotone check \u2014 allowing a larger max is always at least as feasible.",
    "Approach: binary-search the answer value, using the feasibility test to move the bounds.",
    "Pseudocode: search over possible max-sums; if a candidate is feasible, try smaller, else larger.",
    "Answer: (b) minimising the maximum part-sum fits; (a) is a sliding window and (c) is ordinary array binary search.",
  ],
  "lesson:binary-search-answer:bsa-fix-1": [
    "Goal: binary-search the smallest feasible capacity and converge instead of looping forever.",
    "The infinite loop comes from an update that fails to advance when lo and mid coincide.",
    "Key insight: when mid is infeasible it cannot be the answer, so the lower bound must move strictly past it.",
    "Approach: shrink toward the smallest feasible value with lo/hi that always make progress.",
    "Pseudocode: while lo<hi: mid=(lo+hi)//2; if feasible hi=mid; else lo=mid+1.",
    "Use `lo = mid + 1` in the infeasible branch so the interval always shrinks.",
  ],
  "lesson:rotated-array-search:rot-choose-1": [
    "Goal: explain why plain binary search fails on a rotated array like [4,5,6,7,0,1,2] and the one fix.",
    "The cost of a linear scan is O(n); you still want O(log n), but the usual comparison is ambiguous here.",
    "Key insight: the whole array is not sorted, so nums[mid] vs target alone cannot say which half to drop.",
    "Approach: at each step first detect which side of mid is sorted, then decide using that side's range.",
    "Pseudocode: find mid; if the left half is sorted, check if target lies in it to pick a side, else use the right half.",
    "The fix: determine which half is sorted (e.g. nums[lo] <= nums[mid]) and range-test the target against that half.",
  ],
  "lesson:bounds:bnd-complete-1": [
    "Goal: count occurrences of target in a sorted array using bisect.",
    "Scanning for all matches is O(n); the sorted order lets you find the block ends in O(log n).",
    "Key insight: the count equals the gap between the first index and just-after-last index of target.",
    "Approach: use bisect_left and bisect_right to locate those boundaries.",
    "Pseudocode: return bisect_right(nums, target) minus bisect_left(nums, target).",
    "Write `return bisect.bisect_right(nums, target) - bisect.bisect_left(nums, target)`.",
  ],
  "lesson:matrix-search:ms-complete-1": [
    "Goal: map a flat index mid into a 2D cell so a matrix can be searched like a 1D array.",
    "Storing a separate coordinate list is wasteful; the mapping is pure arithmetic.",
    "Key insight: with row-major numbering, dividing by the column count gives the row and the remainder gives the column.",
    "Approach: use integer division and modulo by the number of columns.",
    "Pseudocode: row = mid // cols; col = mid % cols; return matrix[row][col].",
    "Write `return matrix[mid // cols][mid % cols]`.",
  ],
  "lesson:bubble-sort:bub-fix-1": [
    "Goal: fix the inner loop range so bubble sort does not index out of bounds.",
    "The comparison reads a[j+1], which runs past the end when j reaches the last index.",
    "Key insight: after i passes, the last i elements are already in place and need no comparison.",
    "Approach: shrink the inner range each pass to stop before the sorted tail.",
    "Pseudocode: for i in range(n): for j in range(n - 1 - i): if a[j] > a[j+1]: swap.",
    "Use `range(n - 1 - i)` for the inner loop so a[j+1] stays in bounds.",
  ],
  "lesson:selection-sort:sel-complete-1": [
    "Goal: complete selection sort's inner loop that finds the minimum of the unsorted tail.",
    "You track just the index of the smallest seen rather than re-scanning repeatedly.",
    "Key insight: compare each candidate a[j] against the current minimum a[m] and update m on a smaller value.",
    "Approach: scan from i+1 to the end, remembering the index of the smallest element.",
    "Pseudocode: m = i; for j in range(i+1, n): if a[j] < a[m]: m = j; then swap a[i] and a[m].",
    "Inside the inner loop write `if a[j] < a[m]: m = j`.",
  ],
  "lesson:insertion-sort:ins-fix-1": [
    "Goal: fix insertion sort so shifting elements does not clobber the value being inserted.",
    "The bug is the shift direction/target: overwriting the wrong slot loses data.",
    "Key insight: you copy each larger element one slot to the right, freeing a[j+1] for the key.",
    "Approach: save the key, shift larger elements rightward, then drop the key into the hole.",
    "Pseudocode: key=a[i]; j=i-1; while j>=0 and a[j]>key: a[j+1]=a[j]; j-=1; a[j+1]=key.",
    "Use `a[j + 1] = a[j]` for the shift and place the key with `a[j + 1] = key` after the loop.",
  ],
  "lesson:merge-sort:mrg-complete-1": [
    "Goal: merge two already-sorted lists into one sorted list.",
    "Re-sorting the concatenation is wasteful; both inputs are already ordered.",
    "Key insight: the next smallest overall is always at one of the two current front positions.",
    "Approach: walk two pointers, repeatedly taking the smaller front, then append any leftover.",
    "Pseudocode: while both have items: append the smaller front and advance its pointer; then extend with the remaining tails.",
    "Use `if left[i] <= right[j]: out.append(left[i]); i += 1` else take from right, and extend with the leftovers.",
  ],
  "lesson:counting-sort:cnt-complete-1": [
    "Goal: complete the tally loop that counts each value for counting sort.",
    "Comparisons are unnecessary here; the value itself indexes a bucket.",
    "Key insight: element x maps directly to the counts slot at index x.",
    "Approach: for each element, increment the bucket named by its value.",
    "Pseudocode: counts = [0]*(hi+1); for x in a: counts[x] += 1.",
    "Write `counts[x] += 1` inside the loop.",
  ],
  "lesson:radix-sort:rad-complete-1": [
    "Goal: place each number into the bucket for its digit at the current place `exp`.",
    "You avoid comparing full numbers by bucketing on one digit at a time.",
    "Key insight: (x // exp) drops the lower digits and % 10 isolates the digit at that place.",
    "Approach: compute the current digit and append x to that bucket.",
    "Pseudocode: for x in out: digit = (x // exp) % 10; buckets[digit].append(x).",
    "Write `buckets[(x // exp) % 10].append(x)`.",
  ],
  "lesson:comparators:cmp-complete-1": [
    "Goal: sort people by age ascending and break ties by name.",
    "Manual multi-pass sorting is unnecessary; one key expresses both criteria.",
    "Key insight: returning a tuple key sorts by the first field, then the second on ties.",
    "Approach: use sorted with a lambda returning (age, name).",
    "Pseudocode: sorted(people, key = each p -> (p's age, p's name)).",
    "Write `sorted(people, key=lambda p: (p[1], p[0]))` \u2014 age first, then name.",
  ],
  "lesson:interval-sorting:isort-complete-1": [
    "Goal: sort intervals by their end time.",
    "No custom comparator function is needed; a key on one field suffices.",
    "Key insight: the end value is index 1 of each interval.",
    "Approach: pass a key lambda selecting iv[1] to sorted.",
    "Pseudocode: sorted(intervals, key = each iv -> iv's end).",
    "Write `sorted(intervals, key=lambda iv: iv[1])`.",
  ],
  "lesson:stack-queue-operations:sq-complete-1": [
    "Goal: pop from a stack but return None on an empty stack instead of raising.",
    "The hazard is calling pop() on an empty list, which raises IndexError.",
    "Key insight: an empty list is falsy, so you can test emptiness before popping.",
    "Approach: guard with an emptiness check, returning None when empty.",
    "Pseudocode: if the stack is empty: return None; otherwise return stack.pop().",
    "Write `if not stack: return None` then `return stack.pop()`.",
  ],
  "lesson:monotonic-stack:mono-choose-1": [
    "Goal: choose the O(n) structure for 'how many days until a warmer temperature' per day.",
    "Comparing every later day is O(n^2); you want each day resolved once.",
    "Key insight: this is a next-greater-element variant, where earlier unresolved days wait for a warmer day.",
    "Approach: keep a decreasing monotonic stack of indices awaiting resolution.",
    "Pseudocode: for each day, pop stacked days colder than today and record the index gap, then push today.",
    "Use a decreasing monotonic stack of indices; when a warmer day arrives, pop and record the day gap for O(n) total.",
  ],
  "lesson:monotonic-stack:mono-fix-1": [
    "Goal: fix the monotonic stack so it stores indices, enabling day-gap computation.",
    "Storing values loses positional information, so gaps between days can't be computed.",
    "Key insight: you need positions on the stack and must dereference the array when comparing.",
    "Approach: push indices and compare using nums[stack[-1]] against nums[i].",
    "Pseudocode: for i: while stack and nums[stack[-1]] < nums[i]: pop; push i.",
    "Push `i` and compare with `nums[stack[-1]] < nums[i]`, so `stack.append(i)` stores indices.",
  ],
  "lesson:parentheses-matching:paren-fix-1": [
    "Goal: fix the validator so all-openers like '(((' are rejected.",
    "The final return ignores leftover openers still sitting on the stack.",
    "Key insight: unmatched openers leave the stack non-empty at the end, which means invalid.",
    "Approach: require the stack to be empty for a valid string.",
    "Pseudocode: push openers; on a closer, fail if the stack is empty or the top does not match; at the end succeed only if the stack is empty.",
    "Change the final line to `return not stack` so leftover openers fail.",
  ],
  "lesson:expression-evaluation:expr-fix-1": [
    "Goal: fix subtraction so it computes left minus right with the correct sign.",
    "The bug is operand order: the two popped values are being combined the wrong way.",
    "Key insight: the stack pops the right operand first because it was pushed last.",
    "Approach: pop b (right) then a (left) and compute a - b.",
    "Pseudocode: b = pop; a = pop; if operator is '-': push a - b.",
    "Pop `b = stack.pop()` then `a = stack.pop()` and push `a - b`.",
  ],
  "lesson:bfs-queues:bfs-fix-1": [
    "Goal: fix BFS so no node is enqueued more than once.",
    "Marking visited only after dequeuing lets a node be queued by several neighbours first.",
    "Key insight: marking a node visited at enqueue time prevents duplicate enqueues.",
    "Approach: add each neighbour to visited the moment you enqueue it.",
    "Pseudocode: for each neighbour not visited: add to visited and enqueue.",
    "Inside the neighbour loop do `visited.add(nb); q.append(nb)` guarded by `if nb not in visited`.",
  ],
  "lesson:min-max-tracking:min-complete-1": [
    "Goal: implement push so a parallel mins stack always holds the running minimum.",
    "Rescanning the stack for the minimum is O(n); tracking it per push is O(1).",
    "Key insight: the new minimum is x compared against the previous top of the mins stack.",
    "Approach: on push, compute min(x, current min) and push it too, handling the empty case.",
    "Pseudocode: push x; m = x if mins empty else min(x, mins[-1]); push m onto mins.",
    "Write `m = x if not self.mins else min(x, self.mins[-1])` then `self.mins.append(m)`.",
  ],
  "lesson:maps-sets:ms-complete-1": [
    "Goal: return the number of distinct values in a list.",
    "Manually deduplicating with loops is unnecessary work.",
    "Key insight: a set automatically discards duplicate values.",
    "Approach: build a set from the list and take its length.",
    "Pseudocode: return the size of set(nums).",
    "Write `return len(set(nums))`.",
  ],
  "lesson:hashing-frequency:hf-complete-1": [
    "Goal: return the first value in nums that appears exactly once, or None.",
    "Re-counting each element while scanning is O(n^2); counting once first is O(n).",
    "Key insight: 'first' requires scanning in original order after the counts are known.",
    "Approach: build a Counter, then scan nums in order for the first count-1 value.",
    "Pseudocode: freq = Counter(nums); for x in nums: if freq[x] == 1: return x; return None.",
    "Inside the scan write `if freq[x] == 1: return x`, with `return None` after the loop.",
  ],
  "lesson:duplicate-detection:dup-fix-1": [
    "Goal: fix has_dup so it returns True only when an actual duplicate exists.",
    "The bug is order: adding x before checking makes x always appear 'seen'.",
    "Key insight: you must test membership before inserting the current element.",
    "Approach: check the set first, then add.",
    "Pseudocode: for x: if x in seen return True; else add x; return False.",
    "Check `if x in seen: return True` before `seen.add(x)`.",
  ],
  "lesson:value-to-index:vti-complete-1": [
    "Goal: return the indices of the two numbers summing to target (Two Sum).",
    "Checking all pairs is O(n^2); remembering seen values makes it one pass.",
    "Key insight: for each x, its needed partner is target - x, which may already be stored with its index.",
    "Approach: use a hash map from value to index while scanning.",
    "Pseudocode: for i, x: need = target - x; if need in seen return [seen[need], i]; else seen[x] = i.",
    "When `need in seen` do `return [seen[need], i]`, otherwise `seen[x] = i`.",
  ],
  "lesson:grouping:grp-complete-1": [
    "Goal: group words by their first letter into a dict of lists.",
    "Manually checking whether a bucket exists each time is repetitive.",
    "Key insight: the group key is the first character w[0], and buckets must be created on first use.",
    "Approach: use dict.setdefault to create-then-append in one step.",
    "Pseudocode: for w in words: groups.setdefault(w[0], []).append(w); return groups.",
    "Write `groups.setdefault(w[0], []).append(w)`.",
  ],
  "lesson:prefix-sums-map:psm-fix-1": [
    "Goal: fix subarray-sum counting so subarrays starting at index 0 are counted.",
    "The seed omits the empty prefix, so a prefix that equals k on its own is missed.",
    "Key insight: an empty prefix has sum 0, and seeding that lets prefix == k count.",
    "Approach: initialise the prefix-count map with {0: 1} before scanning.",
    "Pseudocode: seen = {0:1}; for x: prefix += x; count += seen.get(prefix - k, 0); bump seen[prefix].",
    "Seed `seen = {0: 1}` so subarrays starting at index 0 are counted.",
  ],
  "lesson:prefix-sums-map:psm-choose-1": [
    "Goal: identify which of three subarray problems needs prefix sums plus a hash map.",
    "The trap is that all three say 'subarray'; the deciding cost is counting arbitrary-length target sums with negatives.",
    "Key insight: prefix sums + a map count target-sum subarrays of any length and handle negatives, which a window or Kadane cannot.",
    "Approach: classify by objective and whether negatives/arbitrary length are involved.",
    "Pseudocode: count target sums with negatives \u2192 prefix + map; fixed length \u2192 window; max any-length \u2192 Kadane.",
    "Answer: (b) counting subarrays summing to k with negatives needs prefix sums + a map; (a) is a window and (c) is Kadane.",
  ],
  "lesson:caching-seen:cache-fix-1": [
    "Goal: fix memoised fib so separate calls don't share one accidental cache.",
    "The cost is a mutable default {} created once at definition time and shared across all calls.",
    "Key insight: default arguments are evaluated once, so a shared dict leaks state between calls.",
    "Approach: use the None-guard idiom, creating a fresh dict inside the function.",
    "Pseudocode: def fib(n, memo=None): if memo is None: memo = {}; then memoise as usual.",
    "Default `memo=None` and add `if memo is None: memo = {}` at the top.",
  ],
  "lesson:bit-shifts:shift-complete-1": [
    "Goal: return a mask with only bit k set.",
    "Building the value by looping or exponentiating is unnecessary.",
    "Key insight: shifting 1 left by k moves the single set bit to position k.",
    "Approach: left-shift the literal 1 by k.",
    "Pseudocode: return 1 shifted left by k.",
    "Write `return 1 << k`.",
  ],
  "lesson:bit-check-set-clear:csc-complete-1": [
    "Goal: write is_set(n, i) returning True when bit i of n is set.",
    "Building a full mask is unnecessary; you can isolate one bit cheaply.",
    "Key insight: shifting n right by i brings bit i down to position 0, where a single-bit mask reads it.",
    "Approach: shift right by i and mask with 1.",
    "Pseudocode: return whether ((n >> i) & 1) equals 1.",
    "Write `return (n >> i) & 1 == 1`.",
  ],
  "lesson:bit-check-set-clear:csc-fix-1": [
    "Goal: fix clear_bit so it clears bit i while keeping all other bits.",
    "The current mask keeps only bit i instead of clearing it.",
    "Key insight: to clear one bit you AND with a mask that is 1 everywhere except position i.",
    "Approach: invert the single-bit mask, then AND.",
    "Pseudocode: return n AND (NOT (1 shifted left by i)).",
    "Write `return n & ~(1 << i)`.",
  ],
  "lesson:xor-cancellation:xor-complete-1": [
    "Goal: find the one missing value from a list containing 0..n with one gap, using XOR.",
    "Summing or sorting is fine but XOR gives an O(n), O(1)-space, overflow-free solution.",
    "Key insight: XORing every index 0..n with every present value cancels matched pairs, leaving the missing number.",
    "Approach: XOR all indices, then XOR all present values into the same accumulator.",
    "Pseudocode: x = 0; for i in range(len+1): x ^= i; for v in nums: x ^= v; return x.",
    "In the second loop do `x ^= v`, and return the surviving `x`.",
  ],
  "lesson:count-set-bits:csb-complete-1": [
    "Goal: write is_power_of_two(n) for positive n using the lowest-set-bit trick.",
    "Counting bits in a loop is O(bits); the trick is O(1).",
    "Key insight: a power of two has exactly one set bit, so clearing its lowest set bit yields 0.",
    "Approach: test n > 0 and (n & (n - 1)) == 0.",
    "Pseudocode: return n is positive AND (n AND n-1) equals 0.",
    "Write `return n > 0 and (n & (n - 1)) == 0`.",
  ],
  "lesson:min-max-heaps:heap-complete-1": [
    "Goal: return the k smallest numbers using a heap.",
    "Fully sorting is O(n log n); a heap helper targets just the k smallest.",
    "Key insight: heapq exposes ready-made selection helpers for smallest/largest.",
    "Approach: call heapq.nsmallest with k and the list.",
    "Pseudocode: return heapq.nsmallest(k, nums).",
    "Write `return heapq.nsmallest(k, nums)`.",
  ],
  "lesson:top-k:topk-choose-1": [
    "Goal: choose between a full sort and a size-k heap for the 10 largest of a 10-million-number stream.",
    "A full sort needs all n in memory and O(n log n) time, which a stream may not allow.",
    "Key insight: keeping only k elements bounds both memory and per-element cost when k is tiny.",
    "Approach: maintain a size-k min-heap, evicting the smallest when it overflows.",
    "Pseudocode: for each x: push x; if heap size > k: pop the smallest; the heap holds the k largest.",
    "Use a size-k min-heap: O(n log k) time and O(k) space, and it works on a stream.",
  ],
  "lesson:top-k:topk-fix-1": [
    "Goal: fix the heap so it keeps the k largest values, not the k smallest.",
    "Negating values turns heappop into removing the largest, which discards the wrong element.",
    "Key insight: a plain min-heap lets heappop drop the smallest, so the k largest survive.",
    "Approach: push the raw value and pop when the size exceeds k.",
    "Pseudocode: for x: heappush(h, x); if len(h) > k: heappop(h).",
    "Push `x` (not `-x`) so `heappop` removes the smallest and the k largest remain.",
  ],
  "lesson:kth-largest:kth-choose-1": [
    "Goal: choose between a heap and quickselect for the kth largest in a fixed in-memory array.",
    "A heap costs O(n log k); quickselect can be cheaper on average but has a worst case.",
    "Key insight: quickselect averages O(n) and O(1) extra space but degrades to O(n^2) with poor pivots.",
    "Approach: prefer quickselect for speed, mitigating pivots; prefer the heap for predictability or streaming.",
    "Pseudocode: quickselect partitions around a (random) pivot to locate the kth order statistic.",
    "Quickselect is faster on average (expected O(n)) but risks O(n^2) without random/median pivots; the heap is a predictable O(n log k).",
  ],
  "lesson:kth-largest:kth-complete-1": [
    "Goal: return the kth smallest value using a size-k max-heap simulated by negation.",
    "Sorting is O(n log n); a size-k heap keeps only k elements.",
    "Key insight: negating values makes heappop remove the current largest, so the heap retains the k smallest.",
    "Approach: push -x, pop when size exceeds k, and negate the root at the end.",
    "Pseudocode: for x: push -x; if len > k: pop; return -h[0].",
    "Do `heapq.heappush(h, -x)`, pop when `len(h) > k`, and `return -h[0]`.",
  ],
  "lesson:running-median:med-choose-1": [
    "Goal: choose between two heaps and re-sorting for the median after every insertion in a million-number stream.",
    "Re-sorting per query is O(n log n) each time, so O(n^2 log n) overall.",
    "Key insight: keeping the two halves as heaps exposes the median at the roots in O(1).",
    "Approach: maintain a low-half max-heap and high-half min-heap, balanced by size.",
    "Pseudocode: insert into the correct heap, rebalance sizes, read the median from the roots.",
    "Two heaps give O(log n) insert and O(1) median \u2192 O(n log n) total, far better than re-sorting's O(n^2 log n).",
  ],
  "lesson:running-median:med-fix-1": [
    "Goal: fix add() so the two heaps stay balanced and the median stays correct.",
    "Skipping rebalancing lets the high half outgrow the low half, corrupting the median.",
    "Key insight: after pushing into small then shifting its max to large, large may exceed small by more than one.",
    "Approach: restore the size invariant by moving large's min back when it grows too big.",
    "Pseudocode: push -x to small; push -pop(small) to large; if len(large) > len(small): push -pop(large) back to small.",
    "Add `if len(self.large) > len(self.small): heapq.heappush(self.small, -heapq.heappop(self.large))`.",
  ],
  "lesson:merge-sorted-data:merge-complete-1": [
    "Goal: merge two sorted lists into one sorted list using heapq.merge.",
    "Concatenating then sorting is O(n log n); merging pre-sorted inputs is linear.",
    "Key insight: heapq.merge lazily interleaves already-sorted iterables in order.",
    "Approach: call heapq.merge on both lists and materialise it.",
    "Pseudocode: return list(heapq.merge(a, b)).",
    "Write `return list(heapq.merge(a, b))`.",
  ],
  "lesson:two-heap-pattern:twoheap-choose-1": [
    "Goal: identify which problem fits the two-heap pattern.",
    "The trap is that all involve heaps; only one needs a moving partition between halves.",
    "Key insight: the running median needs the boundary between the lower and upper halves of a changing set.",
    "Approach: use two opposing balanced heaps for the median; other problems use a single heap.",
    "Pseudocode: low max-heap + high min-heap kept balanced expose the middle at their roots.",
    "Answer: (b) running median uses two heaps; (a) kth largest is one bounded heap and (c) merge k lists is a heap of fronts.",
  ],
  "lesson:two-heap-pattern:twoheap-fix-1": [
    "Goal: fix the two-heap insert so the median stays on the heap roots.",
    "The missing rebalance lets large outgrow small, so the boundary drifts off the roots.",
    "Key insight: after pushing to small and shifting its max to large, large can exceed small and must be trimmed.",
    "Approach: move large's minimum back to small whenever large is bigger.",
    "Pseudocode: push -x to small; push -pop(small) to large; if len(large) > len(small): push -pop(large) to small.",
    "Add `if len(large) > len(small): heapq.heappush(small, -heapq.heappop(large))`.",
  ],
  "lesson:tree-dfs:dfs-complete-1": [
    "Goal: count the number of nodes in a binary tree via DFS.",
    "You don't store the whole tree; recursion combines subtree results.",
    "Key insight: a tree's node count is 1 (this node) plus the counts of its two subtrees.",
    "Approach: recurse, returning 0 for a missing node.",
    "Pseudocode: if node is None: return 0; else return 1 + count(left) + count(right).",
    "Write `return 1 + count(node.left) + count(node.right)`.",
  ],
  "lesson:tree-bfs:bfs-complete-1": [
    "Goal: return the tree's values grouped level by level as a list of lists.",
    "Mixing levels is the pitfall; you must know each level's boundary before dequeuing.",
    "Key insight: the queue length at the start of a round equals the number of nodes on that level.",
    "Approach: BFS by rounds, snapshotting the queue size and processing exactly that many nodes.",
    "Pseudocode: while queue: size = len(queue); collect that many nodes into a level list, enqueueing children; append the level.",
    "Snapshot `size = len(q)`, loop that many times appending `node.val` and enqueuing children, then append the level list.",
  ],
  "lesson:tree-traversals:trav-complete-1": [
    "Goal: perform an inorder traversal appending values in left, node, right order.",
    "Recursion handles the structure; you only decide the visit order.",
    "Key insight: inorder means fully traverse the left subtree, then the node, then the right subtree.",
    "Approach: recurse left, append the value, recurse right, guarding for None.",
    "Pseudocode: if n: inorder(n.left); append n.val; inorder(n.right).",
    "Write `inorder(n.left, out); out.append(n.val); inorder(n.right, out)`.",
  ],
  "lesson:bst-operations:bst-complete-1": [
    "Goal: search a BST iteratively, returning True/False for whether val is present.",
    "Scanning every node is O(n); the BST ordering lets you discard half each step.",
    "Key insight: smaller values live in the left subtree and larger-or-equal in the right.",
    "Approach: walk down, going left or right by comparing val to the current node.",
    "Pseudocode: while root: if val == root.val return True; go left if val < root.val else right; return False.",
    "Write `root = root.left if val < root.val else root.right` inside the loop.",
  ],
  "lesson:tree-height-depth:height-complete-1": [
    "Goal: compute a tree's height recursively (empty tree height 0).",
    "Recursion combines child results; there is no shared state to track.",
    "Key insight: a node's height is 1 plus the larger of its two children's heights.",
    "Approach: recurse into both children and take the max.",
    "Pseudocode: if node is None: return 0; else return 1 + max(height(left), height(right)).",
    "Write `return 1 + max(height(node.left), height(node.right))`.",
  ],
  "lesson:lowest-common-ancestor:lca-complete-1": [
    "Goal: find the lowest common ancestor of p and q in a BST by descending.",
    "You avoid storing paths by using the BST ordering to descend directly.",
    "Key insight: the LCA is the first node where p and q fall on different sides (or one equals the node).",
    "Approach: go left when both are smaller, right when both are larger, else you're at the split.",
    "Pseudocode: while root: if both < root go left; elif both > root go right; else return root.",
    "In the else branch (the divergence point) `return root.val`.",
  ],
  "lesson:tree-construction:build-complete-1": [
    "Goal: build a height-balanced BST from a sorted array.",
    "Inserting one-by-one can unbalance; picking the middle as root keeps it balanced.",
    "Key insight: the middle element makes a balanced root, with left/right halves forming the subtrees.",
    "Approach: recurse on the left and right halves around the midpoint.",
    "Pseudocode: if empty return None; mid = len//2; node = TreeNode(arr[mid], build(left half), build(right half)).",
    "Write `return TreeNode(arr[mid], build_bst(arr[:mid]), build_bst(arr[mid+1:]))`.",
  ],
  "lesson:trie-insertion:trie-complete-1": [
    "Goal: insert a word into a trie, creating nodes along the path and marking the end.",
    "Re-checking whether each child exists is repetitive; setdefault does create-or-get in one call.",
    "Key insight: descending character by character and creating missing children builds the path.",
    "Approach: walk the word with setdefault to make/get each child, then set the word-end flag.",
    "Pseudocode: node = root; for ch in word: node = node.children.setdefault(ch, TrieNode()); node.is_word = True.",
    "Use `node = node.children.setdefault(ch, TrieNode())`, then `node.is_word = True`.",
  ],
  "lesson:prefix-search:prefix-complete-1": [
    "Goal: return whether any stored word starts with the given prefix.",
    "You don't scan all words; you walk the shared prefix path in the trie.",
    "Key insight: if any character along the path has no child, the prefix cannot exist.",
    "Approach: descend character by character, failing fast on a missing child.",
    "Pseudocode: node = root; for ch in prefix: if ch not in node.children return False; descend; return True.",
    "Write `if ch not in node.children: return False` then `node = node.children[ch]`.",
  ],
  "lesson:avl-rotations:avl-complete-1": [
    "Goal: perform the pointer surgery of a right rotation where x is y.left.",
    "The subtle part is not losing x's right subtree during the relink.",
    "Key insight: y descends to become x's right child, and x's old right subtree becomes y's left.",
    "Approach: capture x and its right subtree t, then rewire the three pointers and return x.",
    "Pseudocode: x = y.left; t = x.right; x.right = y; y.left = t; return x.",
    "Write `x.right = y` and `y.left = t`, then `return x`.",
  ],
  "lesson:graph-representations:grep-complete-1": [
    "Goal: build an adjacency list for a directed graph from an edge list.",
    "Directed edges are one-way, so adding a reverse link would be wrong.",
    "Key insight: each edge (u, v) adds v to u's neighbours only.",
    "Approach: use a defaultdict(list) and append v under u for each edge.",
    "Pseudocode: adj = defaultdict(list); for u, v in edges: adj[u].append(v); return adj.",
    "Write `adj[u].append(v)` with no reverse edge.",
  ],
  "lesson:adjacency-lists:adj-complete-1": [
    "Goal: build a weighted undirected adjacency list from (u, v, w) edges.",
    "Undirected means each edge must be recorded from both endpoints.",
    "Key insight: store (neighbour, weight) tuples in both directions for every edge.",
    "Approach: for each edge add v under u and u under v, each with the weight.",
    "Pseudocode: for u, v, w: adj[u].append((v, w)); adj[v].append((u, w)).",
    "Write `adj[u].append((v, w))` and `adj[v].append((u, w))`.",
  ],
  "lesson:graph-bfs:gbfs-complete-1": [
    "Goal: return the set of vertices reachable from start via BFS.",
    "Revisiting nodes wastes work and can loop; a seen set prevents it.",
    "Key insight: mark a neighbour seen when you enqueue it so it is queued only once.",
    "Approach: BFS from start, enqueueing only unseen neighbours.",
    "Pseudocode: seen={start}; queue=[start]; while queue: pop; for each neighbour not seen: mark and enqueue; return seen.",
    "Inside the neighbour loop write `if nb not in seen: seen.add(nb); q.append(nb)`.",
  ],
  "lesson:graph-dfs:gdfs-complete-1": [
    "Goal: perform iterative DFS from start using an explicit stack, returning the visit order.",
    "Without a visited guard a node can be processed many times or loop.",
    "Key insight: skip already-seen nodes when popped, and mark on first visit.",
    "Approach: pop, skip if seen, otherwise mark, record, and push unseen neighbours.",
    "Pseudocode: stack=[start]; while stack: node=pop; if seen: continue; mark; record; push unseen neighbours.",
    "Push unseen neighbours with `stack.append(nb)` after marking and recording the popped node.",
  ],
  "lesson:connected-components:cc-complete-1": [
    "Goal: return the size of the largest connected component in an undirected graph.",
    "Re-exploring visited vertices is wasteful; a global seen set avoids it.",
    "Key insight: flood-filling each unseen vertex counts one whole component, and you keep the maximum.",
    "Approach: for each unvisited vertex, DFS/flood-fill counting its size, tracking the best.",
    "Pseudocode: for each vertex unseen: flood-fill counting size; best = max(best, size); return best.",
    "After counting each component's size write `best = max(best, size)`.",
  ],
  "lesson:graph-cycle-detection:cyc-fix-1": [
    "Goal: fix undirected cycle detection so the edge back to the parent isn't reported as a cycle.",
    "The bug counts the immediate parent as a back-edge, giving false cycles.",
    "Key insight: a visited neighbour is only a real cycle if it is not the node you arrived from.",
    "Approach: pass the parent down and exclude it when checking visited neighbours.",
    "Pseudocode: for nb in adj[node]: if unseen recurse with node as parent; elif nb != parent: return True.",
    "Change the visited branch to `elif nb != parent: return True`.",
  ],
  "lesson:topological-sort:topo-complete-1": [
    "Goal: complete the in-degree update inside Kahn's algorithm main loop.",
    "Rescanning for zero-in-degree nodes is wasteful; you decrement as you remove edges.",
    "Key insight: removing a node lowers each neighbour's in-degree, and a zero means all prerequisites are done.",
    "Approach: for each neighbour, decrement in-degree and enqueue when it hits zero.",
    "Pseudocode: for nb in adj[node]: indeg[nb] -= 1; if indeg[nb] == 0: enqueue nb.",
    "Write `indeg[nb] -= 1` then `if indeg[nb] == 0: q.append(nb)`.",
  ],
  "lesson:topological-sort:topo-choose-1": [
    "Goal: schedule courses from prerequisite pairs and detect when it is impossible.",
    "Ad-hoc dependency resolution is error-prone; a standard ordering algorithm handles it in linear time.",
    "Key insight: a valid order exists iff the prerequisite graph is acyclic.",
    "Approach: run topological sort (Kahn's) and check the output length.",
    "Pseudocode: run Kahn's in O(V+E); if fewer than V nodes come out, a cycle exists.",
    "Use topological sort (Kahn's); an output shorter than V means a cycle, so scheduling is impossible.",
  ],
  "lesson:multi-source-bfs:msbfs-fix-1": [
    "Goal: fix multi-source BFS so distances are measured from all sources at once.",
    "Seeding only the first source makes every distance wrong.",
    "Key insight: in multi-source BFS every source starts at distance 0 in the same queue.",
    "Approach: loop over all sources, setting distance 0 and enqueuing each.",
    "Pseudocode: dist = [-1]*n; q = deque(); for s in sources: dist[s] = 0; q.append(s).",
    "Replace the single seed with `for s in sources: dist[s] = 0; q.append(s)`.",
  ],
  "lesson:shortest-paths-unweighted:spu-complete-1": [
    "Goal: BFS shortest paths that also record a parent map for path reconstruction.",
    "Without parents you can't rebuild the path, only distances.",
    "Key insight: when you first discover a node, the node you came from is its parent on a shortest path.",
    "Approach: on discovery, set the neighbour's distance and store the current node as its parent.",
    "Pseudocode: for nb not in dist: dist[nb] = dist[node] + 1; parent[nb] = node; enqueue nb.",
    "Set `parent[nb] = node` when first discovering nb.",
  ],
  "lesson:union-find:uf-choose-1": [
    "Goal: choose the structure for incremental edges with 'are u and v connected?' after each.",
    "Repeated BFS/DFS costs O(V+E) per query, expensive across many incremental operations.",
    "Key insight: connectivity under incremental unions is answered in near-constant amortized time by a disjoint-set structure.",
    "Approach: use Union-Find with path compression and union by rank.",
    "Pseudocode: for each edge union(u, v); for each query compare find(u) and find(v).",
    "Use Union-Find: each union/query is amortized O(\u03b1(n)) \u2248 O(1), so the whole stream is near-linear.",
  ],
  "lesson:union-find:uf-complete-1": [
    "Goal: implement find with path compression that points each node at its grandparent.",
    "Long parent chains make find slow; compression flattens them over time.",
    "Key insight: repointing x to its grandparent halves the path length as you climb.",
    "Approach: iterate upward, compressing each step until reaching the root.",
    "Pseudocode: while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]; return x.",
    "Write `self.parent[x] = self.parent[self.parent[x]]` then `x = self.parent[x]`.",
  ],
  "lesson:dijkstra:dij-choose-1": [
    "Goal: pick the shortest-path algorithm for unweighted, non-negative-weighted, and negative-edge graphs.",
    "Using the wrong algorithm either wastes time or gives wrong answers on negative edges.",
    "Key insight: edge-weight nature dictates the algorithm \u2014 none, non-negative, or possibly negative.",
    "Approach: match each graph to BFS, Dijkstra, or Bellman\u2013Ford.",
    "Pseudocode: unweighted \u2192 BFS; non-negative weights \u2192 Dijkstra; negative edges \u2192 Bellman\u2013Ford.",
    "Answer: (a) BFS O(V+E); (b) Dijkstra O((V+E) log V); (c) Bellman\u2013Ford O(V\u00b7E), which also detects negative cycles.",
  ],
  "lesson:dijkstra:dij-fix-1": [
    "Goal: fix Dijkstra so it skips stale heap entries and avoids redundant/incorrect work.",
    "A vertex can sit in the heap multiple times with different distances, so outdated entries get processed.",
    "Key insight: an entry whose popped distance exceeds the recorded best is stale and should be ignored.",
    "Approach: after popping, compare the popped distance to dist[node] and continue if worse.",
    "Pseudocode: pop (d, node); if d > dist[node]: continue; else relax neighbours.",
    "Add `if d > dist[node]: continue` right after popping.",
  ],
  "lesson:bellman-ford:bf-choose-1": [
    "Goal: choose between Dijkstra and Bellman\u2013Ford for a graph with some negative edges but no negative cycle.",
    "Dijkstra's greedy choice is invalid with negative edges, so it can return wrong distances.",
    "Key insight: Bellman\u2013Ford relaxes all edges repeatedly and stays correct with negatives.",
    "Approach: use Bellman\u2013Ford, accepting its higher cost for correctness.",
    "Pseudocode: relax every edge V-1 times to settle all shortest paths.",
    "Use Bellman\u2013Ford: it is O(V\u00b7E) (slower than Dijkstra's O((V+E) log V)) but correct with negative edges and can detect negative cycles.",
  ],
  "lesson:bellman-ford:bf-complete-1": [
    "Goal: add negative-cycle detection, returning None if a V-th relaxation pass still improves an edge.",
    "You already relax V-1 times; one more pass detects cycles without extra structures.",
    "Key insight: if any edge can still be relaxed after V-1 passes, a negative cycle exists.",
    "Approach: run an extra pass and return None on any successful relaxation.",
    "Pseudocode: after V-1 passes, for each edge: if it can still relax, return None; else return dist.",
    "In the extra pass, `return None` when an edge relaxation still succeeds.",
  ],
  "lesson:floyd-warshall:fw-fix-1": [
    "Goal: fix Floyd\u2013Warshall's loop order so all-pairs distances come out correct.",
    "With k innermost, intermediate vertices aren't fully considered before being used, giving wrong results.",
    "Key insight: k is the intermediate vertex and must be the outermost loop so each k is finished before the next.",
    "Approach: order the loops k, then i, then j.",
    "Pseudocode: for k: for i: for j: if d[i][k] + d[k][j] < d[i][j]: update d[i][j].",
    "Move the `k` loop to be outermost, enclosing the `i` and `j` loops.",
  ],
  "lesson:prim:prim-fix-1": [
    "Goal: fix Prim's MST so it doesn't add edges to vertices already in the tree.",
    "A vertex can appear in the heap several times, so it can be added twice, forming cycles and overcounting.",
    "Key insight: once a vertex is in the tree, any later heap entry for it is stale and must be skipped.",
    "Approach: mark vertices visited on inclusion and skip already-visited pops.",
    "Pseudocode: pop (w, node); if visited[node]: continue; else mark, add w, push unvisited neighbours.",
    "Add `if visited[node]: continue` right after popping.",
  ],
  "lesson:linked-list-traversal:ll-complete-1": [
    "Goal: count the number of nodes in a singly linked list.",
    "You keep just a counter and a moving pointer, no extra storage.",
    "Key insight: each loop iteration corresponds to exactly one node before the next link.",
    "Approach: walk from head following .next until None, counting steps.",
    "Pseudocode: count=0; current=head; while current: count+=1; current=current.next; return count.",
    "Inside the loop write `count += 1` then `current = current.next`.",
  ],
  "lesson:linked-list-traversal:ll-fix-1": [
    "Goal: fix the traversal so it prints each value and then terminates.",
    "Nothing advances the pointer, so the while loop never reaches None.",
    "Key insight: the loop ends only when the pointer moves toward the tail and becomes None.",
    "Approach: step the pointer to its successor each iteration.",
    "Pseudocode: current=head; while current: print current.val; current=current.next.",
    "Add `current = current.next` inside the loop.",
  ],
  "lesson:linked-list-slow-fast:llsf-complete-1": [
    "Goal: use slow/fast pointers so slow ends on the middle node.",
    "A two-pass count-then-walk works, but one pass with two speeds is enough.",
    "Key insight: when fast advances twice as fast, it reaches the end as slow reaches the middle.",
    "Approach: move slow one and fast two per iteration, guarding fast and fast.next.",
    "Pseudocode: while fast and fast.next: slow = slow.next; fast = fast.next.next; return slow.",
    "Inside the loop write `slow = slow.next` and `fast = fast.next.next`.",
  ],
  "lesson:linked-list-slow-fast:llsf-fix-1": [
    "Goal: fix the loop so even-length lists don't crash on a None.next access.",
    "Reading fast.next.next when fast.next is None raises the AttributeError.",
    "Key insight: stepping fast twice requires both fast and fast.next to exist first.",
    "Approach: strengthen the while condition to check both before advancing.",
    "Pseudocode: while fast is not None and fast.next is not None: step slow once, fast twice.",
    "Use `while fast is not None and fast.next is not None:` as the condition.",
  ],
  "lesson:linked-list-cycle-detection:llcd-complete-1": [
    "Goal: return True exactly when the linked list contains a cycle.",
    "A seen set costs O(n) space; slow/fast pointers detect cycles in O(1) space.",
    "Key insight: in a cycle a fast pointer laps and eventually lands on the slow pointer.",
    "Approach: Floyd's tortoise-and-hare, comparing pointer identity each step.",
    "Pseudocode: slow=fast=head; while fast and fast.next: slow=slow.next; fast=fast.next.next; if slow is fast: return True; return False.",
    "Inside the loop write `if slow is fast: return True` (compare with `is`).",
  ],
  "lesson:linked-list-reversal:llr-complete-1": [
    "Goal: reverse a singly linked list in place and return the new head.",
    "You must not lose the rest of the list when flipping a link, so save it first.",
    "Key insight: reversing needs three pointers so each node's next can be redirected safely.",
    "Approach: walk the list, at each node save next, flip the link to prev, then advance prev and curr.",
    "Pseudocode: prev=None; curr=head; while curr: nxt=curr.next; curr.next=prev; prev=curr; curr=nxt; return prev.",
    "Use the four-line body `nxt = curr.next; curr.next = prev; prev = curr; curr = nxt` and return prev.",
  ],
  "lesson:linked-list-reversal:llr-fix-1": [
    "Goal: reverse the list and return its new head, which is the node that was originally last.",
    "The bug returns a stale pointer: after the loop `head` still names the original first node, which is now the tail.",
    "Key insight: when the loop ends, `prev` holds the last node processed, and that node is the reversed list's head.",
    "Approach: fix the return so it hands back the walker `prev`, not the untouched `head`.",
    "Pseudocode: run the prev/curr reversal loop to completion, then return prev instead of head.",
    "Change the final line to `return prev`, the new head, since `head` now points at the tail (its next is None).",
  ],
  "lesson:linked-list-middle:llmid-complete-1": [
    "Goal: count the nodes, then walk halfway to return the middle node of the list.",
    "The repeated work is one full pass to count plus a partial second pass; storing nodes in a list would waste O(n) space instead.",
    "Key insight: after counting n nodes, the middle sits n // 2 steps from the head.",
    "Approach: do a count-then-walk in two loops, advancing one node per step in the second loop.",
    "Pseudocode: count nodes into n; reset node to head; repeat n // 2 times moving node forward; return node.",
    "Inside the second loop write `node = node.next` so it advances one node per step toward the middle.",
  ],
  "lesson:linked-list-dummy-nodes:lldn-complete-1": [
    "Goal: delete every node whose value equals target, returning the (possibly new) head via the dummy.",
    "Without a dummy you would special-case deleting the head repeatedly; the dummy removes that repeated branching.",
    "Key insight: unlinking a node just means pointing its predecessor past it, so prev must trail curr.",
    "Approach: use a dummy before head, keep prev/curr, and splice out matches while advancing.",
    "Pseudocode: dummy=Node(0,head); prev=dummy; walk curr; on match set prev.next=curr.next else move prev; always advance curr; return dummy.next.",
    "On a match write `prev.next = curr.next` and do NOT advance prev, so the removed node is skipped.",
  ],
  "lesson:linked-list-dummy-nodes:lldn-fix-1": [
    "Goal: return the correct head even when the original first node was the one deleted.",
    "Returning `head` is the bug: if the first node was removed, `head` no longer points at the surviving list.",
    "Key insight: the dummy always precedes the current first node, so it tracks the real head across deletions.",
    "Approach: anchor a dummy before head and return through it instead of the raw head variable.",
    "Pseudocode: set dummy=Node(0,head), run the prev/curr removal loop, then return dummy.next.",
    "Return `dummy.next` so the answer reflects the current first node no matter what was deleted.",
  ],
  "lesson:linked-list-merging:llm-complete-1": [
    "Goal: merge two sorted lists by splicing the smaller front node onto the tail each step.",
    "Rebuilding a new list with copied values would waste memory; instead reuse the existing nodes by relinking.",
    "Key insight: the next node of the merged list is always the smaller of the two current fronts.",
    "Approach: at each step compare a.val and b.val, attach the smaller via tail.next, then advance that list.",
    "Pseudocode: while both non-empty: if a.val<=b.val attach a and advance a else attach b and advance b; then move tail forward.",
    "Write `tail.next = a; a = a.next` (and the symmetric `tail.next = b; b = b.next`) before advancing tail.",
  ],
  "lesson:linked-list-pointer-manipulation:llpm-complete-1": [
    "Goal: swap the current adjacent pair of nodes by rewiring three pointers in the right order.",
    "The tricky cost is losing the node after the pair; if you rewire blindly you drop the rest of the list.",
    "Key insight: you must capture `second.next` before overwriting links, so the tail of the pair still reaches the rest.",
    "Approach: name first and second, then relink so second precedes first and prev points at second.",
    "Pseudocode: first=prev.next; second=first.next; set first.next to second.next; set second.next to first; set prev.next to second.",
    "Write `first.next = second.next; second.next = first; prev.next = second` in that order to swap the pair safely.",
  ],
  "lesson:linked-list-pointer-manipulation:llpm-fix-1": [
    "Goal: after swapping a pair, advance prev to the correct node so the next pair isn't corrupted.",
    "The bug advances prev to the wrong node, so the following pair gets rewired from a broken anchor.",
    "Key insight: after the swap, second is the front of the pair and first is its tail.",
    "Approach: set prev to the node that is now last in the swapped pair before continuing.",
    "Pseudocode: complete the three rewiring lines, then set prev to first, the pair's tail.",
    "Fix the advance to `prev = first`, since first is now the back of the swapped pair.",
  ],
  "lesson:linked-list-variants:llv-complete-1": [
    "Goal: append a node to a doubly linked list so both the forward and backward links are set.",
    "A singly linked append sets only next; here skipping the prev link leaves the list broken for backward walks.",
    "Key insight: a doubly linked node needs two links — the old tail's next AND the new node's prev.",
    "Approach: set both directions, then move the tail pointer to the new node.",
    "Pseudocode: old tail's next = node; node's prev = old tail; tail = node.",
    "Write `tail.next = node; node.prev = tail; tail = node` so both links are wired.",
  ],
  "lesson:linked-list-deques:lldq-complete-1": [
    "Goal: use a deque as a FIFO queue — enqueue 1, 2, 3 then dequeue the first one (1).",
    "A plain list's pop(0) is O(n); a deque removes from the front in O(1), which is the point of using it.",
    "Key insight: FIFO means the first item added is the first removed, so remove from the left end.",
    "Approach: append at the right to enqueue and popleft to dequeue the front.",
    "Pseudocode: q=deque(); append 1,2,3; first = popleft(); print first.",
    "Use `first = q.popleft()` to remove the front (1), since append adds at the right.",
  ],
  "lesson:dp-base-cases:dpbc-complete-1": [
    "Goal: recursively sum 1..n, and here the base case is what stops the recursion at n == 0.",
    "Without a base case the calls recurse below zero forever; the base case is the fixed anchor of the recurrence.",
    "Key insight: the sum of no numbers is 0, so n == 0 should return 0.",
    "Approach: add a base case for the smallest input before the recursive n + total(n-1).",
    "Pseudocode: if n == 0 return 0; otherwise return n + total(n-1).",
    "Add `if n == 0: return 0` as the base case so the recursion terminates.",
  ],
  "lesson:dp-base-cases:dpbc-fix-1": [
    "Goal: make factorial terminate by giving the recursion a stopping condition.",
    "The bug is a missing base case, so fact(n) recurses forever and never returns.",
    "Key insight: factorial of 0 or 1 is 1, which is the smallest input where recursion must stop.",
    "Approach: add a base case guarding the smallest input before the recursive multiply.",
    "Pseudocode: if n <= 1 return 1; otherwise return n * fact(n-1).",
    "Add `if n <= 1: return 1` so the recursion bottoms out and computes factorial.",
  ],
  "lesson:dp-recursive-calls:dprc-complete-1": [
    "Goal: complete the recursive case for Fibonacci, which sums the two preceding values.",
    "This naive branching recomputes overlapping subproblems, but the task here is just the two-call recurrence.",
    "Key insight: fib(n) is defined as fib(n-1) + fib(n-2) once past the base case.",
    "Approach: make two recursive calls on n-1 and n-2 and add their results.",
    "Pseudocode: if n < 2 return n; otherwise return fib(n-1) + fib(n-2).",
    "Write `return fib(n - 1) + fib(n - 2)` as the recursive case.",
  ],
  "lesson:dp-backtracking:dpbt-complete-1": [
    "Goal: build only valid parenthesis strings by pruning invalid choices as you go.",
    "Generating all 2^(2n) strings and filtering wastes work; pruning avoids ever building invalid prefixes.",
    "Key insight: a prefix stays valid only if opens never exceed n and closes never exceed opens.",
    "Approach: backtrack with two guarded recursive calls, one to add '(' and one to add ')'.",
    "Pseudocode: if length == 2n record and return; if open_c < n recurse adding '('; if close_c < open_c recurse adding ')'.",
    "Add '(' only while `open_c < n` and ')' only while `close_c < open_c`, guarding both recursive calls.",
  ],
  "lesson:dp-backtracking:dpbt-fix-1": [
    "Goal: fix the subset builder so state doesn't leak between recursive branches.",
    "The bug is a missing undo: path keeps elements from one branch when exploring the next.",
    "Key insight: after exploring a choice you must reset the shared state so siblings start clean.",
    "Approach: pair every append with a matching pop after the recursive call (choose/explore/un-choose).",
    "Pseudocode: for each i from start: append nums[i]; recurse from i+1; pop.",
    "Add `path.pop()` after the recursive call so each choice is undone on backtrack.",
  ],
  "lesson:dp-subsets:dpss-complete-1": [
    "Goal: generate all subsets using the choose / explore / un-choose backtracking loop.",
    "Restarting from index 0 each call would revisit elements; starting from i+1 avoids that repeated work.",
    "Key insight: recursing from i+1 prevents reusing an element and yields each subset once.",
    "Approach: for each i, append the element, recurse from i+1, then pop to undo.",
    "Pseudocode: record path snapshot; for i from start: append nums[i]; recurse(i+1); pop.",
    "Write `path.append(nums[i]); bt(i + 1, path); path.pop()` as the loop body.",
  ],
  "lesson:dp-subsets:dpss-fix-1": [
    "Goal: fix the builder so each stored subset is distinct instead of every one printing as [].",
    "The bug stores the same mutable list repeatedly, so all recorded results alias one list that ends empty.",
    "Key insight: path is one shared list mutated throughout the search; you must save a snapshot, not the live object.",
    "Approach: append a copy of path to the results rather than the list itself.",
    "Pseudocode: at each node, record path[:] (a copy); continue the choose/recurse/pop loop.",
    "Use `res.append(path[:])` to store a snapshot instead of the shared list.",
  ],
  "lesson:dp-permutations:dpperm-complete-1": [
    "Goal: complete the choose/explore/un-choose block using a used[] array to build permutations.",
    "Rescanning for unused elements is fine, but forgetting to undo the marks corrupts later branches.",
    "Key insight: each element must be marked used before recursing and unmarked after, so it's available again.",
    "Approach: skip used elements, then mark+append, recurse, and undo both on return.",
    "Pseudocode: for each i: if used[i] skip; set used[i]=True; append nums[i]; recurse; pop; set used[i]=False.",
    "Write `used[i]=True; path.append(nums[i]); bt(...); path.pop(); used[i]=False` around the recursion.",
  ],
  "lesson:dp-permutations:dpperm-fix-1": [
    "Goal: fix the permutation search so it stops producing truncated results.",
    "The bug leaves used[i] set after backtracking, so element i stays unavailable and branches come up short.",
    "Key insight: on backtrack, element i must be freed so sibling permutations can use it again.",
    "Approach: mirror every used[i]=True with a used[i]=False after the recursive call.",
    "Pseudocode: mark used[i]; append; recurse; pop; then clear used[i].",
    "Add `used[i] = False` after popping so the element becomes available again.",
  ],
  "lesson:dp-combinations:dpcomb-complete-1": [
    "Goal: generate all k-sized combinations from 1..n with a size check plus choose/explore/un-choose.",
    "Enumerating all permutations and deduping wastes work; forcing increasing picks avoids duplicate combinations.",
    "Key insight: recursing from i+1 keeps numbers strictly increasing, so each combination appears once.",
    "Approach: when path reaches size k record it; otherwise loop i from start, append, recurse from i+1, pop.",
    "Pseudocode: if len(path)==k record and return; for i in start..n: append i; recurse(i+1); pop.",
    "Write `path.append(i); bt(i + 1, path); path.pop()` so numbers only increase.",
  ],
  "lesson:dp-memoization:dpmemo-complete-1": [
    "Goal: add dictionary memoization to the Fibonacci recurrence (no decorator).",
    "The plain recurrence recomputes the same fib(k) exponentially; caching each result removes that repetition.",
    "Key insight: each subproblem needs computing only once, so check the cache before recomputing.",
    "Approach: keep a memo dict, return the cached value on a hit, and store before returning on a miss.",
    "Pseudocode: if n<2 return n; if n in memo return memo[n]; memo[n]=fib(n-1)+fib(n-2); return memo[n].",
    "Add `if n in memo: return memo[n]` and store `memo[n] = fib(n-1) + fib(n-2)` before returning it.",
  ],
  "lesson:dp-memoization:dpmemo-choose-1": [
    "Goal: decide whether naive memoization is safe for a function that prints as it runs.",
    "The repeated subproblems tempt you to cache, but the per-call prints are work that caching would skip.",
    "Key insight: memoization assumes purity, so on a cache hit the side effects (prints) never execute.",
    "Approach: separate the pure computation from the side effects and memoize only the pure part.",
    "Pseudocode: extract a pure helper that computes the value; cache that; keep the printing outside the cache.",
    "So it is not safe as-is: isolate the pure computation and cache only that, or drop the side effects before caching.",
  ],
  "lesson:dp-tabulation:dptab-choose-1": [
    "Goal: choose memoization or tabulation for a DP whose recursion depth would exceed Python's limit.",
    "Deep recursion isn't repeated work but a stack cost, and that stack is what overflows on large inputs.",
    "Key insight: one approach uses no recursion at all, so it has no depth-limit risk.",
    "Approach: prefer bottom-up tabulation, which fills a table iteratively.",
    "Pseudocode: allocate the DP array; fill base cases; loop upward filling each state from earlier ones.",
    "Choose tabulation: it is iterative with no recursion stack, so it avoids the RecursionError that memoized recursion could hit.",
  ],
  "lesson:dp-knapsack:dpks-complete-1": [
    "Goal: complete the take/skip transition for 0/1 knapsack at cell dp[i][w].",
    "Recomputing subproblems is avoided by the table; the transition just reuses the row above.",
    "Key insight: taking item i frees value only if it fits, using dp[i-1][w - weights[i-1]] capacity for earlier items.",
    "Approach: start from the skip value dp[i-1][w], then if the item fits compare against taking it.",
    "Pseudocode: dp[i][w]=dp[i-1][w]; if weights[i-1]<=w compute take=dp[i-1][w-weights[i-1]]+values[i-1]; keep the max.",
    "Write `take = dp[i-1][w - weights[i-1]] + values[i-1]` and set dp[i][w] to the larger of skip and take.",
  ],
  "lesson:dp-subsequences:dpsub-complete-1": [
    "Goal: check whether s is a subsequence of t using a greedy two-pointer scan.",
    "Trying all subsequences is exponential; a single linear scan matching in order is enough.",
    "Key insight: advance the s-pointer only when the current t-character matches it, in order.",
    "Approach: scan t once, moving i forward on each match, and succeed when i covers all of s.",
    "Pseudocode: i=0; for ch in t: if i<len(s) and s[i]==ch: i+=1; return i==len(s).",
    "Write `if i < len(s) and s[i] == ch: i += 1`, guarding with i < len(s) to avoid an index error.",
  ],
  "lesson:dp-climbing-stairs:dpcs-complete-1": [
    "Goal: count the ways to climb n stairs using a rolling two-variable update.",
    "Storing the full DP array is unnecessary; each step only needs the previous two counts.",
    "Key insight: ways(k) = ways(k-1) + ways(k-2), so two rolling variables suffice.",
    "Approach: keep a and b, and update them together each iteration with a tuple assignment.",
    "Pseudocode: a,b=1,1; repeat n times: a,b = b, a+b; return a.",
    "Write `a, b = b, a + b` to roll the pair forward each step.",
  ],
  "lesson:dp-grid-paths:dpgp-fix-1": [
    "Goal: fix the grid-path DP by filling the top-row and left-column base cases before the interior.",
    "The bug leaves the edges as zeros, so interior cells read wrong predecessor values.",
    "Key insight: edge cells have only one predecessor — the top row sums leftward, the left column sums downward.",
    "Approach: initialize dp[0][0], then fill the whole first row and first column before the double loop.",
    "Pseudocode: dp[0][0]=grid[0][0]; fill row 0 from the left; fill column 0 from the top; then fill interior with grid+min(up,left).",
    "Add the top-row fill `dp[0][j]=dp[0][j-1]+grid[0][j]` and the left-column fill `dp[i][0]=dp[i-1][0]+grid[i][0]` before the interior loops.",
  ],
  "lesson:dp-coin-change:dpcc-choose-1": [
    "Goal: for coins [1,3,4] and amount 6, compare what greedy gives versus DP.",
    "Greedy's repeated 'take the biggest coin' looks efficient but can miss the true minimum.",
    "Key insight: greedy grabs the 4 then two 1s (3 coins), but two 3s make 6 in only 2 coins.",
    "Approach: use DP over amounts, since greedy is not optimal for this non-canonical coin system.",
    "Pseudocode: dp[0]=0; for each amount a: dp[a]=min over coins c<=a of dp[a-c]+1.",
    "Trust DP, which finds 2 coins (3 + 3); greedy wrongly returns 3 (4 + 1 + 1).",
  ],
  "lesson:dp-lcs:dplcs-complete-1": [
    "Goal: complete the match/mismatch transition for the longest common subsequence.",
    "The table avoids recomputing overlapping subproblems; you only supply the per-cell rule.",
    "Key insight: on a character match the LCS extends the diagonal cell by 1; on a mismatch it inherits the best neighbor.",
    "Approach: branch on whether a[i-1] equals b[j-1], using the diagonal on a match and max of top/left otherwise.",
    "Pseudocode: if a[i-1]==b[j-1] then dp[i][j]=dp[i-1][j-1]+1 else dp[i][j]=max(dp[i-1][j], dp[i][j-1]).",
    "Write `dp[i][j] = dp[i-1][j-1] + 1` on a match, else `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.",
  ],
  "lesson:dp-n-queens:dpnq-fix-1": [
    "Goal: fix the N-Queens search so diagonal conflicts are released on backtrack.",
    "The bug adds to the diagonal sets but never removes, so stale conflicts leak into later branches.",
    "Key insight: every add of a constraint needs a matching remove when the recursion unwinds.",
    "Approach: after placing a queen and recursing, remove the column and both diagonals it occupied.",
    "Pseudocode: add col, row-col, row+col; recurse(row+1); then remove col, row-col, row+col.",
    "After `bt(row + 1)` remove `row-col` from diag1 and `row+col` from diag2 (plus col) to undo the placement.",
  ],
  "lesson:fenwick-tree:fen-complete-1": [
    "Goal: complete the Fenwick prefix-sum walk using the lowest-set-bit trick.",
    "A plain array would need O(n) to sum a prefix; the tree does it in O(log n) by jumping over blocks.",
    "Key insight: each cell i covers a block ending at i whose length is i's lowest set bit.",
    "Approach: accumulate tree[i], then strip the lowest set bit to jump to the previous block.",
    "Pseudocode: s=0; while i>0: s+=tree[i]; i -= i & (-i); return s.",
    "Write `i -= i & (-i)` to strip the lowest set bit and move to the previous block.",
  ],
  "lesson:segment-tree:seg-complete-1": [
    "Goal: complete the segment-tree point update so every ancestor is refreshed.",
    "Rebuilding the tree per update is O(n); updating only the path to the root is O(log n).",
    "Key insight: each internal node equals the combine of its two children, so only ancestors change.",
    "Approach: set the leaf, then walk to the root recomputing each parent from its children.",
    "Pseudocode: i+=n; tree[i]=value; i//=2; while i>=1: tree[i]=tree[2i]+tree[2i+1]; i//=2.",
    "In the loop write `self.tree[i] = self.tree[2*i] + self.tree[2*i+1]` then `i //= 2` to climb to the parent.",
  ],
  "pattern:sliding-window:pat-sw-recognize-1": [
    "Goal: find the largest sum of exactly k consecutive elements in an array.",
    "Recomputing each window's sum from scratch is O(n·k) — the overlapping elements are recomputed every slide.",
    "Key insight: adjacent windows share k-1 elements, so a new sum differs by only the entering and leaving values.",
    "Approach: use a fixed-size sliding window, updating the running sum in O(1) per slide.",
    "Pseudocode: sum the first k; then slide: add the entering element, subtract the leaving one, track the max.",
    "This is a fixed-size sliding window: add the entering element and subtract the leaving one each step for O(n).",
  ],
  "pattern:sliding-window:pat-sw-recognize-2": [
    "Goal: find the longest substring containing at most 2 distinct characters.",
    "Rechecking every substring is O(n^2); the window's overlap makes most of that recomputation avoidable.",
    "Key insight: 'at most k distinct' is monotone — once valid, shrinking from the left restores validity.",
    "Approach: use a variable-size sliding window with a frequency map of characters in the window.",
    "Pseudocode: grow the right edge adding to the map; while distinct>2 shrink the left edge; track the max length.",
    "Use a variable-size window with a frequency map: grow right, shrink left when distinct exceeds 2, for O(n).",
  ],
  "pattern:prefix-sums-hashmap:pat-ps-recognize-1": [
    "Goal: count contiguous subarrays summing to exactly k when the array may contain negatives.",
    "Checking every subarray is O(n^2), and a sliding window can't decide membership because negatives break monotonicity.",
    "Key insight: a range sum equals a difference of two prefix sums, so a subarray sums to k when an earlier prefix equals current−k.",
    "Approach: use prefix sums with a hashmap counting how many times each prefix value has occurred.",
    "Pseudocode: running prefix; for each element add count[prefix−k] to the answer; then increment count[prefix].",
    "Use prefix sums + hashmap and count earlier prefixes equal to (current prefix − k), in O(n).",
  ],
  "pattern:prefix-sums-hashmap:pat-ps-contrast-1": [
    "Goal: name the right pattern for three problems on the same integer array with negatives.",
    "It's tempting to reuse one technique, but the differing wording signals different repeated-work structures.",
    "Key insight: fixed-size-and-max, count-with-exact-target-and-negatives, and max-over-any-range each demand a different tool.",
    "Approach: match each phrasing to fixed-size window, prefix sums + map, or Kadane respectively.",
    "Pseudocode: (a) slide a k-window tracking max; (b) prefix sums + hashmap counting prefix−target; (c) Kadane's extend-or-restart.",
    "(a) is a fixed-size sliding window, (b) is prefix sums + hashmap (negatives rule out a window), and (c) is Kadane's algorithm.",
  ],
  "pattern:kadane:pat-kadane-recognize-1": [
    "Goal: find the largest sum of any non-empty contiguous subarray with mixed signs.",
    "Trying every subarray is O(n^2); the 'ending here' subproblem lets you reuse the previous step's best.",
    "Key insight: the best subarray ending at i either extends the previous one or restarts at i.",
    "Approach: use Kadane's algorithm in one O(n) pass with O(1) space.",
    "Pseudocode: cur = max(x, cur + x); best = max(best, cur) for each element; return best.",
    "This is Kadane's algorithm: `cur = max(x, cur + x)` decides extend-vs-restart at each index.",
  ],
  "pattern:kadane:pat-kadane-fix-1": [
    "Goal: make Kadane return the true maximum for all-negative arrays where the subarray must be non-empty.",
    "The bug initializes best to 0, so an all-negative array wrongly reports 0 (an empty selection).",
    "Key insight: a non-empty subarray must include at least one element, so the seed must be an actual value.",
    "Approach: seed both best and cur from nums[0] and start the scan at index 1.",
    "Pseudocode: best=cur=nums[0]; for x in nums[1:]: cur=max(x,cur+x); best=max(best,cur); return best.",
    "Initialize `best = cur = nums[0]` and loop from index 1 so all-negative inputs return their largest element.",
  ],
  "pattern:two-pointers:pat-tp-recognize-1": [
    "Goal: find two numbers in a SORTED array that add up to a target.",
    "A brute-force pair scan is O(n^2), and even a hashmap costs O(n) extra space you don't need here.",
    "Key insight: because the array is sorted, the ends tell you which way to move — the sum only grows rightward.",
    "Approach: use two pointers from opposite ends, adjusting based on the current sum.",
    "Pseudocode: lo=0, hi=n-1; while lo<hi: if sum<target lo+=1; elif sum>target hi-=1; else return the pair.",
    "Use two pointers: move left up when the sum is too small and right down when too big — O(n) time, O(1) space vs the hashmap's O(n).",
  ],
  "pattern:two-pointers:pat-tp-recognize-2": [
    "Goal: check whether a string reads the same forwards and backwards, ignoring case.",
    "Building and comparing a reversed copy costs O(n) extra space; comparing in place avoids that.",
    "Key insight: a palindrome's outermost characters must match, then the next inner pair, and so on.",
    "Approach: use two pointers starting at both ends and move them inward.",
    "Pseudocode: lo=0, hi=n-1; while lo<hi: compare (case-folded) s[lo] and s[hi]; if unequal return False; move inward.",
    "Use a from-both-ends two-pointer scan comparing s[lo] and s[hi] until they meet — O(n) time, O(1) space.",
  ],
  "pattern:fast-slow-pointers:pat-fs-recognize-1": [
    "Goal: detect whether a linked list has a cycle using O(1) extra memory.",
    "A visited hash set detects cycles but costs O(n) space, which the O(1) constraint forbids.",
    "Key insight: in a loop a pointer moving twice as fast will eventually lap and collide with the slow one.",
    "Approach: use Floyd's fast and slow pointers at speeds 2 and 1.",
    "Pseudocode: slow=fast=head; while fast and fast.next: slow=slow.next; fast=fast.next.next; if slow is fast return True; return False.",
    "Use fast & slow pointers (Floyd's): they collide inside a loop, giving O(1) space unlike a hash set.",
  ],
  "pattern:fast-slow-pointers:pat-fs-recognize-2": [
    "Goal: return the middle node of a singly linked list in one pass.",
    "Counting nodes first then walking is two passes; a single traversal can locate the middle directly.",
    "Key insight: if one pointer moves twice as fast, it reaches the end exactly when the slow one reaches the middle.",
    "Approach: use fast & slow pointers, advancing fast by two and slow by one.",
    "Pseudocode: slow=fast=head; while fast and fast.next: slow=slow.next; fast=fast.next.next; return slow.",
    "Use fast & slow pointers: slow lands at the middle when fast finishes, in one O(n) pass with O(1) space.",
  ],
  "pattern:bfs-shortest-path:pat-bfs-recognize-1": [
    "Goal: find the minimum number of steps from start to exit in a maze grid.",
    "Exploring paths depth-first can revisit cells and won't give shortest distances directly.",
    "Key insight: every move costs one step, so fewest steps equals fewest edges in an unweighted graph.",
    "Approach: use BFS from the start, treating each open cell as a node.",
    "Pseudocode: queue the start with distance 0; pop a cell, and for each unvisited open neighbor set dist+1 and enqueue.",
    "Use BFS for shortest paths: explore level by level with a queue, reaching the exit in the fewest moves (O(V+E)).",
  ],
  "pattern:bfs-shortest-path:pat-bfs-choose-1": [
    "Goal: find the lowest-COST route where roads have different positive travel times.",
    "BFS counts edges cheaply, but here edges have unequal weights so fewest hops isn't the cheapest route.",
    "Key insight: BFS assumes uniform edge cost, which breaks the moment weights differ.",
    "Approach: use Dijkstra's algorithm with a priority queue ordered by distance.",
    "Pseudocode: push (0, source); pop the closest node; relax its edges, pushing updated distances.",
    "BFS is wrong here; use Dijkstra — swap the FIFO queue for a min-heap to handle non-negative weighted shortest paths.",
  ],
  "pattern:bfs-shortest-path:pat-bfs-fix-1": [
    "Goal: fix the traversal so it reports correct shortest distances instead of DFS-order ones.",
    "The bug uses a stack (LIFO), so it explores depth-first and records wrong distances.",
    "Key insight: shortest paths in an unweighted graph require FIFO order so nodes are reached by fewest edges first.",
    "Approach: replace the stack with a queue and pop from the front.",
    "Pseudocode: deque([start]); dist[start]=0; while q: node=popleft(); for unvisited nb: dist[nb]=dist[node]+1; append nb.",
    "Use a `deque` and `popleft()` for FIFO order so distances come out correct (BFS, not DFS).",
  ],
  "pattern:backtracking:pat-bt-recognize-1": [
    "Goal: generate all permutations of a list of distinct numbers.",
    "The cost is producing every one of the n! orderings without accidentally reusing an element.",
    "Key insight: track which elements are already placed so each position uses an unused element.",
    "Approach: backtrack, filling one position at a time with choose/explore/un-choose and a used-array.",
    "Pseudocode: if path full record it; for each unused i: mark used, append; recurse; pop, unmark.",
    "Use backtracking with a used-array: choose (mark used + append), explore, then un-choose to produce all n! orderings.",
  ],
  "pattern:backtracking:pat-bt-choose-1": [
    "Goal: decide the pattern for (a) listing every subset that sums to a target vs (b) counting how many do.",
    "Both explore subsets, but one needs each explicit configuration while the other reuses overlapping subproblems.",
    "Key insight: enumerating requires generating each subset, whereas counting only needs an aggregate over subproblems.",
    "Approach: use backtracking for enumeration and dynamic programming for the count.",
    "Pseudocode: (a) backtrack recording each qualifying subset; (b) DP over reachable sums accumulating counts.",
    "(a) is backtracking (produce each subset); (b) is usually DP (subset-sum count) since it only needs a count.",
  ],
  "pattern:backtracking:pat-bt-fix-1": [
    "Goal: fix the subset search so results aren't all empty from an aliasing bug.",
    "The bug records the same mutable list each time, so every result aliases one list that ends empty.",
    "Key insight: path is one shared list mutated across the search, so it must be snapshotted when recorded.",
    "Approach: store a copy of path instead of the live list, keeping the choose/recurse/pop loop.",
    "Pseudocode: record path[:]; for i from start: append nums[i]; recurse(i+1); pop.",
    "Record a snapshot with `res.append(path[:])` so results don't alias the shared list.",
  ],
  "pattern:binary-search-on-answer:pat-bsa-recognize-1": [
    "Goal: split an array into m contiguous parts to minimize the largest part sum.",
    "Trying every split is exponential; the answer's monotonicity lets you search the value directly.",
    "Key insight: feasibility ('can we split into ≤ m parts each ≤ candidate?') is monotone in the candidate cap.",
    "Approach: binary search on the answer, testing each candidate largest-sum with a greedy pass.",
    "Pseudocode: lo=max element, hi=total; while lo<hi: mid=(lo+hi)//2; if feasible(mid) hi=mid else lo=mid+1; return lo.",
    "Binary-search the candidate 'largest allowed sum' and test feasibility greedily — O(n log(sum)) since it's monotone.",
  ],
  "pattern:binary-search-on-answer:pat-bsa-choose-1": [
    "Goal: decide whether locating a value's index in a sorted array is 'binary search on the answer'.",
    "Both use halving, but one searches array positions while the other searches candidate answers.",
    "Key insight: no feasibility function is involved when you're simply locating an element by comparison.",
    "Approach: recognize this as ordinary binary search on the array, not on an abstract answer range.",
    "Pseudocode: lo=0, hi=n-1; while lo<=hi: compare target to a[mid]; move lo or hi accordingly.",
    "No — this is plain binary search on a sorted array; 'binary search on the answer' searches candidate answers via a feasibility test.",
  ],
  "pattern:top-k-heap:pat-tk-recognize-1": [
    "Goal: report the 100 largest numbers from a stream you can't fully store.",
    "Sorting needs the whole dataset, which is impossible for an unbounded stream.",
    "Key insight: you only ever need to keep the k best seen so far, discarding smaller ones.",
    "Approach: maintain a size-100 min-heap so the smallest kept item is easy to evict.",
    "Pseudocode: for each number push it; if heap size exceeds 100 pop the smallest; the heap holds the top 100.",
    "Use a Top-K min-heap of size 100: push each number and pop the smallest when it exceeds 100 — O(n log 100), O(100) space.",
  ],
  "pattern:top-k-heap:pat-tk-choose-1": [
    "Goal: find just the single k-th largest element when all n numbers are in memory.",
    "A heap gives all top-k in O(n log k), but you only need one order statistic, not the whole set.",
    "Key insight: partitioning around a pivot can locate the k-th largest in O(n) average without a heap.",
    "Approach: use quickselect since everything is in memory and you need one value.",
    "Pseudocode: partition around a pivot; recurse only into the side containing the k-th position.",
    "Use quickselect — O(n) average for a single order statistic; the heap (O(n log k)) is better for streams or all top-k.",
  ],
  "pattern:two-heaps:pat-th-recognize-1": [
    "Goal: report the running median after each number arrives in a stream.",
    "Re-sorting after every insertion is O(n log n) each time; the median can be maintained far more cheaply.",
    "Key insight: if you keep the lower half and upper half separately and balanced, the median sits at their tops.",
    "Approach: use two heaps — a max-heap for the lower half and a min-heap for the upper half.",
    "Pseudocode: push into the correct half; rebalance so sizes differ by at most one; median is a top or the average of tops.",
    "Use two heaps kept balanced: the median is the top of the larger heap or the average of the two tops — O(log n) per add.",
  ],
  "pattern:two-heaps:pat-th-choose-1": [
    "Goal: keep only the 10 largest numbers seen so far, not the median.",
    "Two balanced heaps maintain a middle boundary you don't need for an extreme set.",
    "Key insight: an extreme-set query needs only one boundary, not a split into balanced halves.",
    "Approach: use a single Top-K min-heap of size 10.",
    "Pseudocode: push each number; if the heap exceeds 10 pop the smallest; the heap holds the 10 largest.",
    "Use Top-K with one size-10 min-heap; two balanced heaps are for medians and would be overkill here.",
  ],
  "pattern:two-heaps:pat-th-fix-1": [
    "Goal: fix the lower half so it truly behaves as a max-heap for the running-median structure.",
    "The bug relies on heapq for a max-heap, but heapq only provides a min-heap.",
    "Key insight: negating values turns heapq's min-heap into a working max-heap.",
    "Approach: push negated values into the lower half and negate again when moving items across.",
    "Pseudocode: push -num into small; then move -(pop from small) into large to rebalance.",
    "Write `heapq.heappush(self.small, -num)` and `heapq.heappush(self.large, -heapq.heappop(self.small))` to simulate a max-heap.",
  ],
  "pattern:k-way-merge:pat-kwm-recognize-1": [
    "Goal: merge k sorted linked lists into one sorted list efficiently.",
    "Concatenating then sorting ignores that the inputs are already sorted, costing O(N log N).",
    "Key insight: the next output node is always the smallest among the k current list heads.",
    "Approach: use a k-way merge with a min-heap holding the current head of each list.",
    "Pseudocode: push all heads; pop the smallest, append it, and push that list's next; repeat until empty.",
    "Use a k-way merge with a size-k min-heap: pop the smallest head and advance that list — O(N log k), O(k) space.",
  ],
  "pattern:k-way-merge:pat-kwm-choose-1": [
    "Goal: find the k-th smallest element across m sorted rows of a matrix.",
    "Flattening and sorting discards the row ordering and is more work than needed.",
    "Key insight: the k-th smallest is reached by popping the smallest current front exactly k times.",
    "Approach: use a k-way merge with a heap of the row fronts.",
    "Pseudocode: push each row's first element; pop the smallest k times, pushing the next element from that row each pop.",
    "K-way merge fits: heap the row fronts and pop k times — O(k log m); binary-search-on-value is an alternative for large matrices.",
  ],
  "pattern:k-way-merge:pat-kwm-fix-1": [
    "Goal: fix the heap so it doesn't crash when two fronts have equal values.",
    "The bug lets the heap compare the lists themselves as a tiebreaker, which is ambiguous or invalid.",
    "Key insight: pushing a unique index alongside the value gives a well-defined tiebreak, avoiding list comparison.",
    "Approach: store tuples of (value, list_index, position) so ties resolve on the index.",
    "Pseudocode: push (lst[0], i, 0) for each list; pop (val, i, j) and push (lists[i][j+1], i, j+1).",
    "Push `(lst[0], i, 0)` — the (value, list_index, position) tuple — so equal values break the tie on the index.",
  ],
  "pattern:monotonic-stack:pat-ms-recognize-1": [
    "Goal: for each day, find how many days until a warmer temperature.",
    "Scanning forward from every day is O(n^2); a stack reuses unresolved days instead of rescanning.",
    "Key insight: it's a 'next greater' problem, and you need distances, so the stack should hold indices.",
    "Approach: use a monotonic decreasing stack of indices, resolving days when a warmer one arrives.",
    "Pseudocode: for each i: while stack top is cooler than today, pop and record i minus its index; push i.",
    "Use a decreasing monotonic stack storing indices; a warmer day pops cooler ones and records the index gap — O(n).",
  ],
  "pattern:monotonic-stack:pat-ms-choose-1": [
    "Goal: find the maximum of every sliding window of size k as it moves.",
    "A monotonic stack can't handle elements expiring from the front as the window advances.",
    "Key insight: the window drops old elements from the front, which a stack's single working end can't do.",
    "Approach: use a monotonic decreasing deque, evicting the front when it leaves the window.",
    "Pseudocode: for each i: pop smaller values from the back; append i; pop the front if it's out of the window; record the front's value.",
    "Use a monotonic (decreasing) deque, popping the front when it leaves the window — O(n), not a plain stack.",
  ],
  "pattern:monotonic-stack:pat-ms-fix-1": [
    "Goal: fix 'next greater' so answers aren't left unresolved by the wrong comparison.",
    "The bug uses the wrong inequality, so smaller stacked elements never get resolved by a larger arrival.",
    "Key insight: an arriving x should resolve stacked elements that are SMALLER than it, keeping the stack decreasing.",
    "Approach: pop while the stacked value is less than x, assigning x as their next greater.",
    "Pseudocode: for i,x: while stack and nums[stack[-1]] < x: res[stack.pop()] = x; push i.",
    "Use `while stack and nums[stack[-1]] < x` (compare with < , not >) so smaller elements resolve to x.",
  ],
  "pattern:merge-intervals:pat-mi-recognize-1": [
    "Goal: combine any overlapping meeting-time ranges into consolidated blocks.",
    "Comparing every pair of intervals is O(n^2); sorting first lets a single sweep handle overlaps.",
    "Key insight: after sorting by start, an interval overlaps the last block exactly when its start ≤ that block's end.",
    "Approach: use the merge-intervals pattern — sort by start, then sweep once extending the last block.",
    "Pseudocode: sort by start; for each interval, if it overlaps the last block extend the block's end, else start a new block.",
    "Use merge intervals: sort by start and extend the last block whenever next.start ≤ last.end — O(n log n).",
  ],
  "pattern:merge-intervals:pat-mi-choose-1": [
    "Goal: find the maximum number of non-overlapping meetings you can attend.",
    "This looks like merging, but you're selecting a maximal set, not combining overlaps.",
    "Key insight: choosing the earliest-finishing compatible meeting leaves the most room for the rest.",
    "Approach: use greedy interval scheduling, sorting by END time.",
    "Pseudocode: sort by end; track last end; count each meeting whose start ≥ last end and update last end.",
    "No — that's greedy interval scheduling: sort by end and greedily pick each meeting starting after the last chosen ends.",
  ],
  "pattern:merge-intervals:pat-mi-fix-1": [
    "Goal: fix the merge so it stops missing overlaps caused by sorting on the wrong key.",
    "The bug sorts by the wrong field, so an overlapping interval can land out of the sweep's reach.",
    "Key insight: merging requires intervals in START order so overlaps are always adjacent in the sweep.",
    "Approach: sort by the start coordinate before sweeping and extending blocks.",
    "Pseudocode: sort by x[0]; merged=[first]; for each interval: if start ≤ merged[-1] end extend it, else append.",
    "Sort with `key=lambda x: x[0]` (by start) so overlapping intervals are adjacent and get merged.",
  ],
  "pattern:greedy-interval-scheduling:pat-gis-recognize-1": [
    "Goal: attend the maximum number of non-overlapping meetings.",
    "Trying all subsets is exponential; a greedy choice by finish time avoids that search.",
    "Key insight: earliest-finish-first is provably optimal because it frees the most remaining time.",
    "Approach: use greedy interval scheduling, sorting by end time.",
    "Pseudocode: sort by end; last_end=-inf; for each interval: if start ≥ last_end take it and set last_end=end.",
    "Use greedy interval scheduling: sort by finish time and take each earliest-finishing compatible interval — O(n log n).",
  ],
  "pattern:greedy-interval-scheduling:pat-gis-choose-1": [
    "Goal: maximize the total VALUE of non-overlapping meetings, where each has a weight.",
    "Greedy-by-finish maximizes count, but a high-value meeting can outweigh several small ones it blocks.",
    "Key insight: with weights the objective changes, so earliest-finish is no longer optimal.",
    "Approach: use weighted interval scheduling with dynamic programming.",
    "Pseudocode: sort by end; for each interval choose max(skip it, value + best compatible earlier interval).",
    "Use weighted-interval DP: max(skip, value + best compatible earlier) — greedy-by-finish only maximizes count, not value.",
  ],
  "pattern:cyclic-sort:pat-cs-recognize-1": [
    "Goal: find the missing number in an array of n distinct values from 0..n using O(1) extra space.",
    "A marker or seen array costs O(n) space, which the O(1) constraint forbids.",
    "Key insight: each value maps directly to an index, so values can be placed at their own positions in place.",
    "Approach: use cyclic sort to send each value home, then scan for the index whose value is wrong.",
    "Pseudocode: swap each value to index==value; then the first index i where nums[i]!=i is the missing number.",
    "Use cyclic sort: place each value at its index by swapping, then the first mismatched index is the missing number (XOR is an equally valid alternative).",
  ],
  "pattern:cyclic-sort:pat-cs-fix-1": [
    "Goal: keep cyclic sort from looping forever when the array contains duplicates.",
    "The bug swaps even when the target slot already holds the same value, so it repeats endlessly.",
    "Key insight: if nums[i] already equals nums[j], the swap accomplishes nothing and must be skipped.",
    "Approach: only swap when the destination slot holds a different value, otherwise advance i.",
    "Pseudocode: while i<n: j=nums[i]; if j<n and nums[i]!=nums[j] swap; else i+=1.",
    "Add the guard `and nums[i] != nums[j]` so it swaps only when the target slot differs, avoiding the infinite loop.",
  ],
  "pattern:cyclic-sort:pat-cs-choose-1": [
    "Goal: find the value that appears once in an array of arbitrary large integers.",
    "Cyclic sort wants values that map to indices, but arbitrary values have no home slot.",
    "Key insight: without a value-to-index mapping, cyclic sort's core assumption doesn't hold.",
    "Approach: use bitwise XOR if the others pair up, or a hashmap of counts otherwise.",
    "Pseudocode: XOR all values (pairs cancel, leaving the unique) or tally counts in a map and return the one with count 1.",
    "Not cyclic sort — use bitwise XOR (if every other value pairs up) or a frequency map, since arbitrary values have no home index.",
  ],
  "pattern:matrix-traversal:pat-mt-recognize-1": [
    "Goal: return all elements of an m×n matrix in spiral order.",
    "There's no repeated computation here; the challenge is visiting each cell exactly once in a fixed geometric order.",
    "Key insight: a spiral is four directed passes bounded by shrinking top/bottom/left/right edges.",
    "Approach: use matrix traversal with boundary tracking, walking each side then tightening the bounds.",
    "Pseudocode: while bounds valid: walk top row, right column, bottom row, left column; move each boundary inward.",
    "Use matrix traversal with top/bottom/left/right boundaries, shrinking the region after each side — O(m·n), O(1) extra space.",
  ],
  "pattern:matrix-traversal:pat-mt-choose-1": [
    "Goal: find the shortest path from top-left to bottom-right avoiding blocked cells.",
    "A fixed spiral or diagonal walk ignores obstacles and can't measure shortest distance.",
    "Key insight: movement depends on cell content and you need fewest steps, which makes it a graph problem.",
    "Approach: use grid BFS, treating each open cell as a node.",
    "Pseudocode: BFS from the start; for each unblocked neighbor set distance+1 and enqueue; stop at the target.",
    "Use grid BFS: cells are graph nodes and BFS gives the fewest steps, unlike a fixed traversal.",
  ],
  "pattern:matrix-traversal:pat-mt-fix-1": [
    "Goal: fix the spiral so single-row or single-column matrices aren't double-visited.",
    "The bug walks the bottom row and left column unconditionally, revisiting cells when the region has collapsed in one dimension.",
    "Key insight: after moving top/right inward, the remaining region may be empty vertically or horizontally.",
    "Approach: guard the bottom-row and left-column passes with boundary checks.",
    "Pseudocode: after the top and right passes, only do the bottom pass if top ≤ bottom and the left pass if left ≤ right.",
    "Wrap the bottom-row and left-column passes in `if top <= bottom` and `if left <= right` to avoid double-visits.",
  ],
  "pattern:in-place-linkedlist-reversal:pat-iplr-recognize-1": [
    "Goal: reverse a singly linked list using O(1) extra memory.",
    "Pushing nodes onto a stack reverses them but costs O(n) space, violating the constraint.",
    "Key insight: you can reverse by relinking each node's next to its predecessor, no copying needed.",
    "Approach: use in-place reversal with prev/curr/next pointers in a single pass.",
    "Pseudocode: prev=None; curr=head; while curr: nxt=curr.next; curr.next=prev; prev=curr; curr=nxt; return prev.",
    "Use in-place linked-list reversal (relink with prev/curr/next) — O(n) time, O(1) space, unlike a stack.",
  ],
  "pattern:in-place-linkedlist-reversal:pat-iplr-choose-1": [
    "Goal: reverse the nodes of a list in groups of k, leaving a trailing partial group as-is.",
    "Copying values into an array wastes O(n) space; the relinking approach still works per group.",
    "Key insight: it's the same pointer relinking applied to each full k-node group, connecting groups as you go.",
    "Approach: use in-place reversal generalized to k-groups, reversing only complete groups.",
    "Pseudocode: for each full group of k: reverse it by relinking; connect it to the previous group; leave an incomplete final group.",
    "Yes — it's in-place reversal per k-group: reverse full groups and leave the incomplete final one untouched, O(n) time, O(1) space.",
  ],
  "pattern:tree-bfs:pat-tbfs-recognize-1": [
    "Goal: return the average value of the nodes on each level of a binary tree.",
    "You must group nodes by depth, so a plain recursive descent doesn't naturally separate levels.",
    "Key insight: snapshotting the queue size at the start of each iteration bounds exactly one level.",
    "Approach: use tree BFS (level order) with a queue.",
    "Pseudocode: queue root; while queue: take size=len(queue); pop that many, summing values and enqueuing children; record the average.",
    "Use tree BFS: snapshot len(queue) each iteration to process one level, averaging that level's values — O(n).",
  ],
  "pattern:tree-bfs:pat-tbfs-choose-1": [
    "Goal: find the maximum root-to-leaf path sum.",
    "BFS by level doesn't carry the running sum along a specific path, so it doesn't fit here.",
    "Key insight: path problems require carrying accumulated state down each root-to-leaf path.",
    "Approach: use tree DFS, which recursion carries path context down naturally.",
    "Pseudocode: recurse carrying current sum; at a leaf update the best; return the max over children.",
    "Use Tree DFS: recursion carries a running sum down each path, which BFS's level processing can't do.",
  ],
  "pattern:tree-bfs:pat-tbfs-fix-1": [
    "Goal: fix level-order so nodes are grouped by level instead of merged into one list.",
    "The bug processes the whole queue at once, so it never separates one level from the next.",
    "Key insight: you must process exactly one level per outer iteration, which means capturing the level's size first.",
    "Approach: read len(queue) before the inner loop so each iteration handles just that level.",
    "Pseudocode: while q: level=[]; for _ in range(len(q)): pop node, add its value, enqueue children; append level.",
    "Wrap the body in `for _ in range(len(q))` after snapshotting the count so each level is grouped correctly.",
  ],
  "pattern:tree-dfs:pat-tdfs-recognize-1": [
    "Goal: find all root-to-leaf paths whose values sum to a target.",
    "You need per-path state, so processing by level would lose which nodes belong to a path.",
    "Key insight: recursion can carry the current path and running sum down each branch, checking the target at leaves.",
    "Approach: use tree DFS, recording a copy of the path when a leaf's sum matches.",
    "Pseudocode: recurse carrying path and sum; at a leaf, if sum==target record path[:]; backtrack (pop) on return.",
    "Use Tree DFS carrying the path and running sum; at a matching leaf record a copy and backtrack — O(n) time, O(h) space.",
  ],
  "pattern:tree-dfs:pat-tdfs-choose-1": [
    "Goal: return the values of the tree grouped by level.",
    "DFS descends paths and would need extra depth bookkeeping to reconstruct levels.",
    "Key insight: grouping by level is breadth-first work, naturally handled by a queue.",
    "Approach: use tree BFS instead of DFS.",
    "Pseudocode: queue root; per iteration process one level's worth of nodes, collecting their values and enqueuing children.",
    "Use Tree BFS with a queue: level grouping is breadth-first, which DFS doesn't do without extra bookkeeping.",
  ],
  "pattern:tree-dfs:pat-tdfs-fix-1": [
    "Goal: fix the DFS so path state doesn't leak across sibling subtrees.",
    "The bug appends a node to the path but never removes it, so siblings inherit stale nodes.",
    "Key insight: after exploring a node's subtrees you must undo its append so the path reflects only the current branch.",
    "Approach: add a backtracking pop at the end of the recursive call.",
    "Pseudocode: append node.val; if leaf record path[:]; recurse left and right; then pop.",
    "Add `path.pop()` at the end so the node is removed on backtrack and doesn't leak to siblings.",
  ],
  "pattern:graph-dfs-components:pat-gdc-recognize-1": [
    "Goal: count the number of islands in a grid of land and water cells.",
    "Rescanning connected land repeatedly would recount; marking visited cells avoids that.",
    "Key insight: adjacent land cells form connected components, so each unvisited land cell starts a new island.",
    "Approach: use graph DFS (flood fill) from each unvisited land cell, counting one component per launch.",
    "Pseudocode: for each cell: if it's unvisited land, DFS/flood-fill its whole region and add one to the count.",
    "Use graph DFS / connected components: flood-fill each unvisited land region and count one component per new DFS — O(V+E).",
  ],
  "pattern:graph-dfs-components:pat-gdc-choose-1": [
    "Goal: after each added edge, answer whether X and Y are connected.",
    "Re-running DFS per query is O(V+E) each time — far too slow for many dynamic queries.",
    "Key insight: connectivity changes incrementally and you make many 'same set?' queries, which favors a dedicated structure.",
    "Approach: use Union-Find (DSU) with union and find operations.",
    "Pseudocode: union each new edge's endpoints; answer a query by comparing find(X) and find(Y).",
    "Use Union-Find (DSU): near-constant union and connectivity queries suit incremental edges far better than repeated DFS.",
  ],
  "pattern:graph-dfs-components:pat-gdc-fix-1": [
    "Goal: fix the DFS so it doesn't loop forever on a cyclic graph.",
    "The bug never marks nodes visited, so a cycle sends the recursion around endlessly.",
    "Key insight: marking a node seen on entry and only recursing into unvisited neighbors breaks cycles.",
    "Approach: track a seen set, adding each node before exploring its neighbors.",
    "Pseudocode: dfs(node): add node to seen; for each neighbor not in seen: dfs(neighbor).",
    "Add `seen.add(node)` on entry and recurse only when `nb not in seen` to stop infinite recursion.",
  ],
  "pattern:topological-sort:pat-topo-recognize-1": [
    "Goal: return an order to take all courses given prerequisites, or report it's impossible.",
    "Guessing orders is exponential; tracking in-degrees lets you peel ready courses one at a time.",
    "Key insight: prerequisites define a directed order, and a course is ready only when its in-degree reaches 0.",
    "Approach: use Kahn's topological sort with in-degree counts and a queue of ready nodes.",
    "Pseudocode: compute in-degrees; queue all zero-in-degree nodes; pop, output, decrement neighbors, queue newly-zero; check the count.",
    "Use topological sort (Kahn's): start from in-degree-0 nodes and peel; if output length < V a cycle makes it impossible — O(V+E).",
  ],
  "pattern:topological-sort:pat-topo-choose-1": [
    "Goal: find the fewest edges between two nodes in an unweighted graph.",
    "Topological sort orders a DAG by dependencies but never computes distances.",
    "Key insight: fewest edges is a shortest-path measure, which requires level-by-level exploration.",
    "Approach: use BFS from the source.",
    "Pseudocode: BFS from source tracking distance; the first time you reach the target, that distance is the answer.",
    "Use BFS — it's a fewest-edges shortest-path problem; topological sort is about ordering, not distance.",
  ],
  "pattern:topological-sort:pat-topo-fix-1": [
    "Goal: fix Kahn's algorithm so neighbors are enqueued only after all their prerequisites clear.",
    "The bug enqueues neighbors too early, before their remaining prerequisites are done.",
    "Key insight: a node is ready exactly when its in-degree hits 0, not on the first decrement.",
    "Approach: decrement each neighbor's in-degree and enqueue only when it reaches 0.",
    "Pseudocode: pop node, output it; for each neighbor: indeg[nb]-=1; if indeg[nb]==0 enqueue nb.",
    "Guard the enqueue with `if indeg[nb] == 0` so a node is queued only when all its prerequisites are done.",
  ],
  "pattern:union-find:pat-uf-recognize-1": [
    "Goal: as edges arrive, report when one first connects two already-connected nodes (a redundant edge).",
    "Re-checking connectivity from scratch per edge is slow; a structure that remembers merges is far cheaper.",
    "Key insight: an edge is redundant exactly when its endpoints already share a root before union.",
    "Approach: use Union-Find with path compression and union by rank.",
    "Pseudocode: for each edge: if find(a)==find(b) it's redundant; otherwise union(a,b).",
    "Use Union-Find: if find(a)==find(b) before the union the edge is redundant (creates a cycle) — near-O(1) per op.",
  ],
  "pattern:union-find:pat-uf-choose-1": [
    "Goal: count the connected components of a fixed graph exactly once.",
    "Union-Find's strength is dynamic edges and repeated queries, which a one-shot static count doesn't need.",
    "Key insight: for a single static pass, a plain traversal is simpler and equally efficient.",
    "Approach: use DFS/BFS, counting one component per new unvisited start.",
    "Pseudocode: for each unvisited node: launch DFS/BFS over its component and add one to the count.",
    "Either works, but DFS/BFS is simpler for a one-time static count (O(V+E)); Union-Find shines for dynamic edges or many queries.",
  ],
  "pattern:union-find:pat-uf-fix-1": [
    "Goal: fix find so it doesn't degrade to O(n) on long parent chains.",
    "The bug has no path compression, so repeated finds walk long chains and slow to O(n).",
    "Key insight: flattening the path as you walk up keeps future finds near-constant.",
    "Approach: add path compression by pointing each node at its grandparent during find.",
    "Pseudocode: while parent[x]!=x: set parent[x]=parent[parent[x]]; x=parent[x]; return x.",
    "Add `self.parent[x] = self.parent[self.parent[x]]` inside the loop to compress the path (grandparent pointer).",
  ],
  "pattern:dijkstra:pat-dij-recognize-1": [
    "Goal: find the minimum total travel time from a source to every city over roads with positive times.",
    "BFS counts hops, not weighted cost, so it can't answer cheapest-total on weighted edges.",
    "Key insight: with non-negative weights, once you settle the closest unsettled node its distance is final.",
    "Approach: use Dijkstra with a min-heap keyed by distance.",
    "Pseudocode: push (0, source); pop the closest node; relax each outgoing road, pushing improved distances.",
    "Use Dijkstra: settle the closest city first via a min-heap and relax its roads — O((V+E) log V).",
  ],
  "pattern:dijkstra:pat-dij-choose-1": [
    "Goal: find shortest paths when some edges have NEGATIVE weights (e.g. currency arbitrage).",
    "Dijkstra's 'closest is final' assumption breaks the moment an edge weight is negative.",
    "Key insight: negative edges can improve a path later, and you may also need to detect negative cycles.",
    "Approach: use Bellman–Ford, which relaxes all edges repeatedly.",
    "Pseudocode: relax every edge V−1 times; one more pass that still improves signals a negative cycle.",
    "Use Bellman–Ford: it handles negative edges and detects negative cycles (O(V·E)); Dijkstra can't.",
  ],
  "pattern:dijkstra:pat-dij-fix-1": [
    "Goal: fix Dijkstra so it doesn't reprocess stale heap entries.",
    "The bug processes every popped entry, but a node can sit in the heap with an outdated larger distance.",
    "Key insight: if a popped distance is worse than the recorded distance, that entry is stale and must be skipped.",
    "Approach: compare the popped distance to dist[node] and skip when it's larger.",
    "Pseudocode: pop (d, node); if d > dist[node] continue; else relax neighbors and push improved distances.",
    "Add `if d > dist[node]: continue` right after popping so each node is settled only once.",
  ],
  "pattern:trie-prefix:pat-trie-recognize-1": [
    "Goal: build autocomplete that tells whether any stored word starts with a given prefix, over thousands of words.",
    "Scanning all words per prefix query is O(dictionary size) each time — wasteful for many queries.",
    "Key insight: words sharing a prefix can share tree nodes, so a query walks one node per character.",
    "Approach: use a trie (prefix tree), inserting each word once.",
    "Pseudocode: insert each word character by character; for a prefix query, walk node per character and succeed if the path exists.",
    "Use a trie: a prefix query costs O(prefix length), independent of dictionary size — far better than scanning all words.",
  ],
  "pattern:trie-prefix:pat-trie-choose-1": [
    "Goal: test whether an exact word is in a dictionary, never querying prefixes.",
    "A trie's node-per-character machinery pays off only for prefix queries, which you don't have.",
    "Key insight: exact membership needs no shared-prefix structure — a hash lookup suffices.",
    "Approach: use a hash set of the words.",
    "Pseudocode: build a set of all words; answer a query with `word in the_set`.",
    "Use a hash set — exact membership is O(L) average and far simpler; a trie's edge is prefix queries you don't need.",
  ],
  "pattern:trie-prefix:pat-trie-fix-1": [
    "Goal: fix trie search so a mere prefix isn't reported as a stored word.",
    "The bug returns True whenever the path exists, even if no word ended at that node.",
    "Key insight: reaching the end of the character path isn't the same as a word having been stored there.",
    "Approach: mark word endings with an is_end flag and check it at the final node.",
    "Pseudocode: walk each character; if any is missing return False; at the end return node.is_end.",
    "Return `node.is_end` at the end so only nodes marked as stored words count as a match.",
  ],
  "pattern:modified-binary-search:pat-mbs-recognize-1": [
    "Goal: find a target's index in a sorted array that was rotated at an unknown pivot, in O(log n).",
    "A linear scan is O(n); the array's structure still allows halving despite the rotation.",
    "Key insight: at any midpoint one half is still fully sorted, so you can test which half could hold the target.",
    "Approach: use a modified binary search that identifies the sorted half each step.",
    "Pseudocode: while lo<=hi: mid; if the target lies within the sorted half keep it, else search the other half.",
    "Use modified binary search: at each mid, keep the sorted half if the target lies in it, else the other — O(log n), O(1) space.",
  ],
  "pattern:modified-binary-search:pat-mbs-choose-1": [
    "Goal: find the minimum ship capacity so all packages ship within D days.",
    "This isn't searching a rotated array; you're searching a range of candidate capacities.",
    "Key insight: feasibility ('does this capacity finish within D days?') is monotone in the capacity value.",
    "Approach: use binary search on the answer with a feasibility test, not a positional array search.",
    "Pseudocode: lo=max weight, hi=sum; while lo<hi: mid; if feasible(mid) hi=mid else lo=mid+1; return lo.",
    "No — that's binary search on the ANSWER (search candidate capacities via feasibility); modified binary search targets a transformed sorted array.",
  ],
  "pattern:bitwise-xor:pat-xor-recognize-1": [
    "Goal: find the single number that appears once while every other appears twice, in O(1) space.",
    "A hashmap of counts costs O(n) space, which the O(1) constraint forbids.",
    "Key insight: a ^ a = 0, so XORing all values cancels every pair and leaves the unique one.",
    "Approach: use bitwise XOR, folding the whole array together.",
    "Pseudocode: result=0; for each x: result ^= x; return result.",
    "Use bitwise XOR of all numbers: paired values cancel and the unique one remains — O(n) time, O(1) space.",
  ],
  "pattern:bitwise-xor:pat-xor-choose-1": [
    "Goal: find the unique number when every other appears three times.",
    "A single XOR cancels pairs, but triples don't vanish under XOR, so it won't isolate the answer.",
    "Key insight: XOR removes even multiplicities only; triples leave a residue.",
    "Approach: count each bit's set occurrences modulo 3 across all numbers (or use a hashmap).",
    "Pseudocode: for each bit position, sum that bit over all numbers mod 3; the bits with remainder 1 form the answer.",
    "No — plain XOR cancels PAIRS, not triples; use per-bit counts modulo 3 (or a hash map) instead.",
  ],
  "pattern:dynamic-programming:pat-dp-recognize-1": [
    "Goal: count distinct ways to climb n stairs taking 1 or 2 steps at a time.",
    "Naive recursion recomputes the same step counts exponentially across branches.",
    "Key insight: ways(k) = ways(k-1) + ways(k-2), so subproblems overlap and can be reused.",
    "Approach: use dynamic programming — define the state and memoize or tabulate.",
    "Pseudocode: ways(0)=ways(1)=1; for k up to n: ways(k)=ways(k-1)+ways(k-2); return ways(n).",
    "Use DP: state = ways to reach step k, transition ways(k)=ways(k-1)+ways(k-2), memoized or tabulated for O(n).",
  ],
  "pattern:dynamic-programming:pat-dp-choose-1": [
    "Goal: LIST every subset that sums to a target, not just count them.",
    "DP counts or optimizes over overlapping subproblems but doesn't produce every explicit configuration.",
    "Key insight: listing all subsets is enumeration, which requires generating each one.",
    "Approach: use backtracking to build and record each qualifying subset.",
    "Pseudocode: backtrack over elements, tracking the running sum; when it hits the target, record the current subset.",
    "Use backtracking — you need each explicit subset; DP is for counting/optimizing, not enumerating every combination.",
  ],
  "pattern:dynamic-programming:pat-dp-fix-1": [
    "Goal: make the exponential Fibonacci recursion efficient by caching results.",
    "The bug recomputes the same subproblems across branches, giving O(2^n) work.",
    "Key insight: each argument's result needs computing only once, so cache it by argument.",
    "Approach: add memoization, e.g. an lru_cache decorator, so repeat calls return instantly.",
    "Pseudocode: decorate fib with a cache; on a repeat argument return the stored result instead of recursing.",
    "Add `@lru_cache(maxsize=None)` above fib to cache by argument, turning O(2^n) into O(n).",
  ],
  "pattern:knapsack:pat-ks-recognize-1": [
    "Goal: decide whether an array can be split into two subsets with equal sum.",
    "Trying every partition is exponential; overlapping reachable-sum subproblems can be reused.",
    "Key insight: it's subset-sum to total/2, with each number used at most once.",
    "Approach: use a 1D 0/1-knapsack DP tracking which subset sums are reachable.",
    "Pseudocode: if total is odd return False; target=total/2; dp[0]=True; for each num sweep capacity downward marking dp[s]|=dp[s-num].",
    "Use 0/1 knapsack (subset-sum): target=total/2, iterate capacity downward, feasible iff dp[target] is True — O(n·target).",
  ],
  "pattern:knapsack:pat-ks-choose-1": [
    "Goal: find the fewest coins to make an amount where coins are reusable unlimited times.",
    "The 0/1 downward sweep forbids reuse, so applying it here would undercount coin usage.",
    "Key insight: reusable items mean an item can contribute multiple times, changing the sweep direction.",
    "Approach: use unbounded knapsack (coin change), iterating capacity upward.",
    "Pseudocode: dp[0]=0; for each amount a upward: dp[a]=min(dp[a], dp[a-coin]+1) over coins.",
    "No — that's UNBOUNDED knapsack: iterate capacity UPWARD (dp[a] from dp[a-coin]) since items repeat; the 0/1 downward form forbids reuse.",
  ],
  "pattern:knapsack:pat-ks-fix-1": [
    "Goal: fix the subset-sum so it stops accidentally reusing an item.",
    "The bug sweeps capacity upward, letting the same item be counted again within one pass.",
    "Key insight: for 0/1 (each item once) the capacity loop must go from high to low so an update can't chain within the pass.",
    "Approach: reverse the inner capacity loop to iterate downward.",
    "Pseudocode: for each num: for s from target down to num: dp[s] = dp[s] or dp[s-num].",
    "Iterate the capacity loop downward with `range(target, num - 1, -1)` so each item is used at most once.",
  ],
  "pattern:divide-and-conquer:pat-dac-recognize-1": [
    "Goal: sort an array in guaranteed O(n log n) time while staying stable.",
    "Quadratic sorts are too slow; splitting the problem lets independent halves be sorted separately.",
    "Key insight: two already-sorted halves can be combined in linear time, giving T(n)=2T(n/2)+O(n).",
    "Approach: use merge sort, a divide-and-conquer algorithm.",
    "Pseudocode: split the array in half; recursively sort each half; merge the two sorted halves linearly.",
    "Use merge sort: split in half, recursively sort, then MERGE in linear time — O(n log n) and stable.",
  ],
  "pattern:divide-and-conquer:pat-dac-choose-1": [
    "Goal: decide whether splitting Fibonacci into fib(n-1) and fib(n-2) is good divide-and-conquer.",
    "Plain divide-and-conquer assumes independent subproblems, but these two calls share enormous work.",
    "Key insight: fib(n-1) and fib(n-2) overlap heavily, so recomputing them is exponential.",
    "Approach: use dynamic programming (memoization or tabulation) to reuse subproblems.",
    "Pseudocode: cache fib(k) by argument, or fill a table upward so each value is computed once.",
    "No — the subproblems OVERLAP, so this calls for DP (memoization/tabulation), not plain divide-and-conquer.",
  ],
};


// ── R6 amendment — tests for the 26 rewritten-as-complete-function exercises ──
// These were previously bare fragments left self-assessed; their learner-facing
// starterCode/expected were rewritten into complete functions (see the R6
// verification notes), so every coding exercise is now runnable. The model
// passes; the unfinished starter, empty, and synthesised mistake variants fail.
Object.assign(EXERCISE_TESTS, {
  "lesson:conditions:cond-fix-1":
    "assert classify(35) == 'hot', 'temp 35 is hot (specific branch first)'\nassert classify(25) == 'warm', 'temp 25 is warm'\nassert classify(30) == 'hot', 'boundary 30 is hot'\nassert classify(20) == 'warm', 'boundary 20 is warm'\nassert classify(5) == 'cold', 'temp 5 is cold'\nprint('OK')",
  "lesson:string-sliding-window:ssw-fix-1":
    "assert length_of_longest_unique('abcabcbb') == 3, 'abc'\nassert length_of_longest_unique('bbbbb') == 1\nassert length_of_longest_unique('pwwkew') == 3, 'wke'\nassert length_of_longest_unique('') == 0\n# 'abba': the guard must stop start jumping back for the first 'a' (seen outside window)\nassert length_of_longest_unique('abba') == 2, 'abba -> ab/ba length 2 (needs the >= start guard)'\nprint('OK')",
  "lesson:word-search:ws-fix-1":
    "assert exist([list('ABCE'), list('SFCS'), list('ADEE')], 'ABCCED') is True\nassert exist([list('ABCE'), list('SFCS'), list('ADEE')], 'SEE') is True\nassert exist([list('ABCE'), list('SFCS'), list('ADEE')], 'ABCB') is False, 'cannot reuse a cell'\n# Missing-restore bug: a dead-end path marks cells '#'; without restoring them a\n# later correct path cannot reuse those cells. On this board 'AAB' is reachable\n# ONLY if cells are restored after each failed branch (no-restore returns False).\nassert exist([['C','A','A'],['A','A','A'],['B','C','D']], 'AAB') is True, 'needs cells restored after a dead-end path'\nassert exist([['A','A'],['A','A']], 'AAAAA') is False, 'only 4 cells, no reuse'\nassert exist([['A']], 'A') is True\nassert exist([['A']], 'B') is False\nprint('OK')",
  "lesson:linked-list-merging:llm-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val; self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h: out.append(h.val); h = h.next\n    return out\nassert to_list(merge(build([1,3,5]), build([2,4,6]))) == [1,2,3,4,5,6]\n# leftover tail must be attached: second list much longer\nassert to_list(merge(build([1]), build([2,3,4,5]))) == [1,2,3,4,5], 'longer list tail must be kept'\nassert to_list(merge(None, build([1,2]))) == [1,2]\nassert to_list(merge(build([1,2]), None)) == [1,2]\nassert to_list(merge(None, None)) == []\n# Stability (distinguishes <= from <): on equal vals take the LEFT node first.\nla, lb = Node(1), Node(1)\nla.src = 'L'; lb.src = 'R'\nmerged = merge(la, lb)\nassert getattr(merged, 'src', None) == 'L', 'on a tie the left node comes first (needs <=)'\nprint('OK')",
  "lesson:dp-tabulation:dptab-complete-1":
    "assert fib(0) == 0\nassert fib(1) == 1\nassert fib(2) == 1\nassert fib(10) == 55\nassert fib(15) == 610\nprint('OK')",
  "lesson:dp-1d-2d:dp12-complete-1":
    "assert count_paths(1, 1) == 1\nassert count_paths(2, 2) == 2\nassert count_paths(3, 3) == 6\nassert count_paths(3, 7) == 28\nassert count_paths(1, 5) == 1, 'single row -> one path'\nprint('OK')",
  "lesson:dp-state-transitions:dpst-complete-1":
    "assert max_profit([7,1,5,3,6,4]) == 5, 'buy 1 sell 6'\nassert max_profit([7,6,4,3,1]) == 0, 'only losses -> 0'\nassert max_profit([]) == 0\nassert max_profit([5]) == 0\nassert max_profit([1,2,3,4,5]) == 4\nprint('OK')",
  "lesson:dp-house-robber:dphr-complete-1":
    "assert rob([]) == 0\nassert rob([5]) == 5\nassert rob([1,2,3,1]) == 4, 'rob 1 and 3 -> 1+3=4'\nassert rob([2,7,9,3,1]) == 12, 'rob 2,9,1'\nassert rob([2,1,1,2]) == 4, 'rob first and last'\nprint('OK')",
  "lesson:dp-grid-paths:dpgp-complete-1":
    "assert min_path_sum([[1,3,1],[1,5,1],[4,2,1]]) == 7, 'path 1->3->1->1->1'\nassert min_path_sum([[1,2,3],[4,5,6]]) == 12\nassert min_path_sum([[5]]) == 5\nassert min_path_sum([[1,2,5],[3,2,1]]) == 6\nprint('OK')",
  "lesson:dp-coin-change:dpcc-complete-1":
    "assert coin_change([1,2,5], 11) == 3, '5+5+1'\nassert coin_change([2], 3) == -1, 'impossible'\nassert coin_change([1], 0) == 0\nassert coin_change([1,2,5], 0) == 0\nassert coin_change([2,5,10], 1) == -1\nassert coin_change([1,3,4], 6) == 2, '3+3'\nprint('OK')",
  "lesson:dp-lis:dplis-complete-1":
    "assert lis([10,9,2,5,3,7,101,18]) == 4, '2,3,7,101'\nassert lis([0,1,0,3,2,3]) == 4\nassert lis([7,7,7,7]) == 1, 'strictly increasing -> 1'\nassert lis([]) == 0\nassert lis([5]) == 1\nprint('OK')",
  "lesson:dp-lis:dplis-fix-1":
    "assert lis([10,9,2,5,3,7,101,18]) == 4\n# the fix matters when the LIS does NOT end at the last index:\nassert lis([1,2,3,4,0]) == 4, 'best is 1,2,3,4 (not ending at last index 0)'\nassert lis([3,2,1]) == 1\nassert lis([5]) == 1\nprint('OK')",
  "lesson:dp-divide-and-conquer:dpdc-complete-1":
    "assert max_subarray([-2,1,-3,4,-1,2,1,-5,4]) == 6, '4,-1,2,1'\nassert max_subarray([1]) == 1\nassert max_subarray([-1,-2,-3]) == -1, 'all negative -> best single'\nassert max_subarray([5,4,-1,7,8]) == 23\nassert max_subarray([-2,-1]) == -1\nprint('OK')",
  "lesson:dp-n-queens:dpnq-complete-1":
    "# Keep n small so tracing stays under the event limit; these still pin the\n# choose/explore/un-choose correctness (n=4 is the smallest nonzero board).\nassert count_n_queens(1) == 1\nassert count_n_queens(2) == 0\nassert count_n_queens(3) == 0\nassert count_n_queens(4) == 2\nprint('OK')",
  "lesson:kmp:kmp-complete-1":
    "assert kmp_search('abxabcabcaby', 'abcaby') == [6]\nassert kmp_search('aaaaa', 'aa') == [0,1,2,3], 'overlapping matches'\nassert kmp_search('abcabcabc', 'abc') == [0,3,6]\nassert kmp_search('abc', 'xyz') == []\nassert kmp_search('abc', 'abcd') == [], 'pattern longer than text'\nprint('OK')",
  "lesson:kruskal:kru-fix-1":
    "# MST total weight; unsorted edges must still yield the minimum.\nassert kruskal(4, [(0,1,10),(0,2,6),(0,3,5),(1,3,15),(2,3,4)]) == 19, 'MST edges 2-3(4),0-3(5),0-1(10)'\nassert kruskal(2, [(0,1,7)]) == 7\nassert kruskal(3, [(0,1,1),(1,2,2),(0,2,3)]) == 3, 'take 1 and 2, skip the cycle edge 3'\nassert kruskal(1, []) == 0\nprint('OK')",
  "pattern:prefix-sums-hashmap:pat-ps-fix-1":
    "assert count_subarrays([1,1,1], 2) == 2\nassert count_subarrays([1,2,3], 3) == 2, '[1,2] and [3]'\n# subarray starting at index 0 must count (needs seen[0]=1):\nassert count_subarrays([3,1,2], 3) == 2, '[3] and [1,2]'\nassert count_subarrays([1,-1,0], 0) == 3\nassert count_subarrays([], 0) == 0\nprint('OK')",
  "pattern:two-pointers:pat-tp-fix-1":
    "assert two_sum_sorted([1,2,3,4,6], 6) == (1,3), '2+4'\nassert two_sum_sorted([2,3,4], 6) == (0,2)\nassert two_sum_sorted([1,2,3], 7) is None\n# a too-small sum must move lo UP (would loop forever the wrong way):\nassert two_sum_sorted([1,2,3,9], 11) == (1,3), '2+9'\nassert two_sum_sorted([5], 5) is None\nprint('OK')",
  "pattern:fast-slow-pointers:pat-fs-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val; self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\nassert has_cycle(build([1,2,3,4])) is False, 'even-length acyclic must not crash'\nassert has_cycle(build([1,2,3])) is False\nassert has_cycle(None) is False\nassert has_cycle(build([1])) is False\na=Node(1); b=Node(2); c=Node(3); a.next=b; b.next=c; c.next=b\nassert has_cycle(a) is True\nprint('OK')",
  "pattern:binary-search-on-answer:pat-bsa-fix-1":
    "assert least_capacity([1,2,3,4,5,6,7,8,9,10], 5) == 15\nassert least_capacity([3,2,2,4,1,4], 3) == 6\nassert least_capacity([1,2,3,1,1], 4) == 3\n# the boundary (mid feasible) must be kept, not skipped:\nassert least_capacity([5,5,5], 3) == 5, 'each day one 5'\nprint('OK')",
  "pattern:top-k-heap:pat-tk-fix-1":
    "assert k_largest([3,1,5,2,4], 2) == [5,4]\nassert k_largest([1,2,3], 3) == [3,2,1]\nassert k_largest([7], 1) == [7]\nassert k_largest([4,4,4], 2) == [4,4], 'duplicates'\nassert k_largest([-1,-2,-3], 2) == [-1,-2], 'handles negatives (negation bug would fail)'\nprint('OK')",
  "pattern:greedy-interval-scheduling:pat-gis-fix-1":
    "assert max_non_overlapping([[1,3],[2,4],[3,5]]) == 2, '[1,3] then [3,5]'\n# sort-by-start would pick the long [1,10] and block the rest:\nassert max_non_overlapping([[1,10],[2,3],[4,5],[6,7]]) == 3\nassert max_non_overlapping([[1,2]]) == 1\nassert max_non_overlapping([]) == 0\nprint('OK')",
  "pattern:in-place-linkedlist-reversal:pat-iplr-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val; self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndef to_list(h):\n    out = []\n    while h: out.append(h.val); h = h.next\n    return out\nassert to_list(reverse(build([1,2,3,4,5]))) == [5,4,3,2,1]\nassert to_list(reverse(build([1]))) == [1]\nassert reverse(None) is None\nassert to_list(reverse(build([1,2]))) == [2,1]\nprint('OK')",
  "pattern:modified-binary-search:pat-mbs-fix-1":
    "assert first_occurrence([1,2,2,2,3], 2) == 1, 'FIRST 2, not any'\nassert first_occurrence([1,2,3], 3) == 2\nassert first_occurrence([2,2,2], 2) == 0\nassert first_occurrence([1,2,3], 5) == -1\nassert first_occurrence([], 1) == -1\nprint('OK')",
  "pattern:divide-and-conquer:pat-dac-fix-1":
    "assert merge([1,3,5], [2,4,6]) == [1,2,3,4,5,6]\nassert merge([1,2], []) == [1,2], 'leftover left must be appended'\nassert merge([], [3,4]) == [3,4], 'leftover right must be appended'\nassert merge([1,1,1],[1]) == [1,1,1,1]\nassert merge([], []) == []\n# Stability (distinguishes <= from <): equal keys keep the LEFT element first.\nclass _E:\n    def __init__(self, k, src): self.k = k; self.src = src\n    def __le__(self, o): return self.k <= o.k\n    def __lt__(self, o): return self.k < o.k\nout = merge([_E(1,'L')], [_E(1,'R')])\nassert out[0].src == 'L', 'stable merge takes the left element on a tie (needs <=)'\nprint('OK')",
});

// pat-sw-fix-1 is already a complete function; the bug is PERFORMANCE (O(n*k) vs
// O(n)), so a value-only test cannot reject the slow starter. We attach an
// OPERATION-COST check (R6.3 "appropriate operation-cost check"): a prelude
// instruments list indexing to count element reads, and the test asserts the
// solution stays linear (<= ~3n reads) rather than O(n*k). The slow starter
// (sum(nums[start:start+k]) each step) performs ~n*k reads and is rejected; the
// O(1)-slide model performs O(n) reads and passes.
Object.assign(EXERCISE_PRELUDE, {
  "pattern:sliding-window:pat-sw-fix-1":
    "class _CountList(list):\n    reads = 0\n    def __getitem__(self, i):\n        if isinstance(i, slice):\n            r = list.__getitem__(self, i)\n            _CountList.reads += len(r)  # a slice reads every element it copies\n            return r\n        _CountList.reads += 1\n        return list.__getitem__(self, i)",
});
Object.assign(EXERCISE_TESTS, {
  "pattern:sliding-window:pat-sw-fix-1":
    "# correctness first\nassert max_sum_k([1,2,3,4,5], 2) == 9, '4+5'\nassert max_sum_k([2,1,5,1,3,2], 3) == 9, '5+1+3'\nassert max_sum_k([5], 1) == 5\n# operation-cost check: slicing-sum each window reads ~ n*k elements; the O(1)\n# slide reads O(n). Count element reads via an instrumented list and require\n# the solution to stay linear (not n*k). For n=40, k=10: n*k=400, linear ~<=160.\n_CountList.reads = 0\nnums = _CountList(range(40))\nmax_sum_k(nums, 10)\nassert _CountList.reads <= 3 * len(nums), f'must be O(n), not O(n*k): {_CountList.reads} reads for n={len(nums)}, k=10'\nprint('OK')",
});


// ── R6 amendment — full 6-stage hints for the 26 rewritten exercises ──
Object.assign(EXERCISE_HINTS, {
  "lesson:conditions:cond-fix-1": [
    "Goal: classify(temp) returns 'hot' (>=30), 'warm' (>=20), else 'cold'.",
    "The cost here is wrong branch ORDER: a broad test runs before a specific one.",
    "Key property: if-elif stops at the FIRST true test, so the most specific threshold must come first.",
    "Approach: order the thresholds from highest/most-specific to lowest.",
    "Pseudocode: if temp>=30 return 'hot'; elif temp>=20 return 'warm'; else return 'cold'.",
    "Fix: swap the first two branches so the >=30 test is checked before >=20.",
  ],
  "lesson:string-sliding-window:ssw-fix-1": [
    "Goal: length_of_longest_unique(s) = longest substring with no repeated character.",
    "The repeated work is scanning; track the window [start, i] and each char's last index.",
    "Key property: a duplicate only matters if its last index is INSIDE the current window (>= start).",
    "Approach: on a repeat, move start forward only when seen[ch] >= start.",
    "Pseudocode: if ch in seen and seen[ch] >= start: start = seen[ch] + 1; seen[ch]=i; best=max(best, i-start+1).",
    "Fix: add the guard `and seen[ch] >= start` to the if.",
  ],
  "lesson:word-search:ws-fix-1": [
    "Goal: exist(board, word) = can word be spelled along adjacent cells without reuse.",
    "Repeated work is DFS from each cell; mark a cell visited so one path can't reuse it.",
    "Key property: after a branch fails, the cell must become available again for OTHER paths.",
    "Approach: backtracking — mark on entry, recurse, then UNMARK on exit.",
    "Pseudocode: tmp=board[r][c]; board[r][c]='#'; found=dfs(neighbours); board[r][c]=tmp; return found.",
    "Fix: restore board[r][c] = tmp before returning.",
  ],
  "lesson:kruskal:kru-fix-1": [
    "Goal: kruskal(n, edges) returns the total weight of a Minimum Spanning Tree.",
    "The cost is choosing edges in the wrong order; the greedy needs them cheapest-first.",
    "Key property: Kruskal adds the smallest edge that doesn't form a cycle (union-find detects cycles).",
    "Approach: sort edges by weight, then union endpoints when they're in different components.",
    "Pseudocode: edges=sorted(edges,key=w); for u,v,w: if find(u)!=find(v): union; total+=w.",
    "Fix: add `edges = sorted(edges, key=lambda e: e[2])` at the top.",
  ],
  "lesson:linked-list-merging:llm-fix-1": [
    "Goal: merge(a,b) returns one sorted list from two sorted lists.",
    "The repeated work is comparing fronts; splice the smaller each step with a dummy+tail.",
    "Key property: when the while loop ends, ONE list may still have (already-sorted) nodes.",
    "Approach: after the loop, attach whichever list is non-empty to the tail.",
    "Pseudocode: while a and b: splice smaller; then tail.next = a if a else b; return dummy.next.",
    "Fix: add `tail.next = a if a is not None else b` after the loop.",
  ],
  "lesson:dp-tabulation:dptab-complete-1": [
    "Goal: fib(n) bottom-up using a table dp.",
    "The repeated subproblems are fib(i-1) and fib(i-2); store them so each is computed once.",
    "Key property: each cell depends only on the two cells below it.",
    "Approach: fill dp left-to-right from the base cases.",
    "Pseudocode: dp[0]=0; dp[1]=1; for i in 2..n: dp[i]=dp[i-1]+dp[i-2]; return dp[n].",
    "Fix: dp[i] = dp[i - 1] + dp[i - 2].",
  ],
  "lesson:dp-1d-2d:dp12-complete-1": [
    "Goal: count_paths(m,n) = unique right/down paths in an m×n grid.",
    "Repeated subproblems are paths-to-each-cell; store them in a 2D table.",
    "Key property: you reach a cell only from above or from the left.",
    "Approach: first row/col are 1; each interior cell sums its top and left neighbours.",
    "Pseudocode: for i in 1..m-1: for j in 1..n-1: dp[i][j]=dp[i-1][j]+dp[i][j-1].",
    "Fix: dp[i][j] = dp[i - 1][j] + dp[i][j - 1].",
  ],
  "lesson:dp-state-transitions:dpst-complete-1": [
    "Goal: max_profit(prices) = best profit from one buy then one later sell.",
    "The state you carry is the cheapest price seen so far and the best profit so far.",
    "Key property: selling today earns price - min_price_so_far.",
    "Approach: scan once, update best BEFORE moving min_price so you never sell before buying.",
    "Pseudocode: for p in prices[1:]: best=max(best, p-min_price); min_price=min(min_price,p).",
    "Fix: best = max(best, p - min_price) then min_price = min(min_price, p).",
  ],
  "lesson:dp-house-robber:dphr-complete-1": [
    "Goal: rob(nums) = max sum with no two adjacent elements chosen.",
    "The repeated decision at each house is take-or-skip; keep two rolling totals.",
    "Key property: best up to i = max(best up to i-1, nums[i] + best up to i-2).",
    "Approach: roll prev (i-2) and curr (i-1) forward in one pass.",
    "Pseudocode: for x in nums: prev, curr = curr, max(curr, prev + x).",
    "Fix: prev, curr = curr, max(curr, prev + x).",
  ],
  "lesson:dp-grid-paths:dpgp-complete-1": [
    "Goal: min_path_sum(grid) = cheapest right/down path cost.",
    "Repeated subproblems are cheapest-cost-to-each-cell; store in a table.",
    "Key property: you arrive from above or from the left, so take the cheaper predecessor.",
    "Approach: seed first row/col cumulatively, then fill interior cells.",
    "Pseudocode: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).",
    "Fix: dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1]).",
  ],
  "lesson:dp-coin-change:dpcc-complete-1": [
    "Goal: coin_change(coins, amount) = fewest coins to make amount, or -1.",
    "The repeated subproblem is dp[a] = fewest coins for amount a; build up from 0.",
    "Key property: using coin c (if c<=a) costs 1 + dp[a-c].",
    "Approach: for each amount, try every coin that fits and keep the smallest.",
    "Pseudocode: for a in 1..amount: for c in coins: if c<=a: dp[a]=min(dp[a], dp[a-c]+1).",
    "Fix: if c <= a and dp[a - c] + 1 < dp[a]: dp[a] = dp[a - c] + 1.",
  ],
  "lesson:dp-lis:dplis-complete-1": [
    "Goal: lis(nums) = length of the longest strictly increasing subsequence.",
    "dp[i] = LIS ending at i; the repeated work compares i against all earlier j.",
    "Key property: you may extend j's subsequence by i only when nums[j] < nums[i].",
    "Approach: for each i, look back at every j < i and extend when it helps.",
    "Pseudocode: if nums[j]<nums[i] and dp[j]+1>dp[i]: dp[i]=dp[j]+1; answer=max(dp).",
    "Fix: if nums[j] < nums[i] and dp[j] + 1 > dp[i]: dp[i] = dp[j] + 1.",
  ],
  "lesson:dp-lis:dplis-fix-1": [
    "Goal: lis(nums) returns the overall LIS length.",
    "dp[i] is the LIS ENDING at i — not necessarily the global best.",
    "Key property: the best subsequence can end at any index, not just the last one.",
    "Approach: after filling dp, take the maximum over all cells.",
    "Pseudocode: return max(dp) (not dp[-1]).",
    "Fix: return max(dp).",
  ],
  "lesson:dp-divide-and-conquer:dpdc-complete-1": [
    "Goal: max_subarray(nums) = maximum contiguous subarray sum (divide & conquer).",
    "Each level splits in half; the extra work is the crossing sum through the middle.",
    "Key property: the best subarray is entirely left, entirely right, or crosses the midpoint.",
    "Approach: recurse on both halves, compute the crossing best, and combine.",
    "Pseudocode: return max(left_result, right_result, crossing_sum).",
    "Fix: return max(left, right, cross).",
  ],
  "lesson:dp-n-queens:dpnq-complete-1": [
    "Goal: count_n_queens(n) = number of ways to place n non-attacking queens.",
    "The repeated work is trying each column per row; prune with column/diagonal sets.",
    "Key property: a safe square adds col, row-col, and row+col to the three sets.",
    "Approach: backtracking — choose a safe square, recurse to the next row, then undo.",
    "Pseudocode: add(col,r-c,r+c); bt(row+1); remove(col,r-c,r+c).",
    "Fix: cols.add(col); diag1.add(row-col); diag2.add(row+col); bt(row+1); then remove the same three.",
  ],
  "lesson:kmp:kmp-complete-1": [
    "Goal: kmp_search(text, pattern) = all start indices where pattern occurs.",
    "The naive restart re-compares matched characters; KMP reuses them via the LPS table.",
    "Key property: on a mismatch with j>0, the longest proper prefix that is also a suffix is lps[j-1].",
    "Approach: fall back j to lps[j-1] instead of resetting j or moving i backward.",
    "Pseudocode: on mismatch: if j>0: j=lps[j-1] else i+=1.",
    "Fix: in the `elif j > 0:` branch, set j = lps[j - 1].",
  ],
  "pattern:sliding-window:pat-sw-fix-1": [
    "Goal: max_sum_k(nums, k) = largest sum of any k consecutive elements.",
    "The repeated work is sum(nums[start:start+k]) — it re-adds k elements every step (O(n·k)).",
    "Key property: adjacent windows differ by exactly two elements (one enters, one leaves).",
    "Approach: keep a running window sum and slide it in O(1) per step.",
    "Pseudocode: window=sum(first k); for i in k..n-1: window += nums[i]-nums[i-k]; best=max(best,window).",
    "Fix: replace the re-sum with window += nums[i] - nums[i - k].",
  ],
  "pattern:prefix-sums-hashmap:pat-ps-fix-1": [
    "Goal: count_subarrays(nums, k) = number of contiguous subarrays summing to k.",
    "The repeated work is range sums; a running prefix + a count map answers each in O(1).",
    "Key property: a subarray that STARTS at index 0 has 'previous prefix' 0, which must already be counted.",
    "Approach: seed the empty-prefix count before scanning.",
    "Pseudocode: seen={0:1}; for x: prefix+=x; count+=seen[prefix-k]; seen[prefix]+=1.",
    "Fix: set seen[0] = 1 before the loop.",
  ],
  "pattern:two-pointers:pat-tp-fix-1": [
    "Goal: two_sum_sorted(nums, target) = indices of a pair summing to target in a SORTED array.",
    "The two pointers start at both ends; moving the wrong one wastes work or loops.",
    "Key property: if the sum is too small you need a LARGER value (raise lo); too big → lower hi.",
    "Approach: compare the sum to target and move the correct pointer inward.",
    "Pseudocode: if s<target: lo+=1 elif s>target: hi-=1 else return (lo,hi).",
    "Fix: on s < target do lo += 1; else hi -= 1 (swap the two moves).",
  ],
  "pattern:fast-slow-pointers:pat-fs-fix-1": [
    "Goal: has_cycle(head) = does the linked list contain a cycle.",
    "fast moves two steps per iteration, so reading fast.next.next can dereference None.",
    "Key property: before a double step, BOTH fast and fast.next must exist.",
    "Approach: guard the loop condition so fast never steps past the end.",
    "Pseudocode: while fast and fast.next: slow=slow.next; fast=fast.next.next; if slow is fast: return True.",
    "Fix: change the loop to `while fast and fast.next:`.",
  ],
  "pattern:binary-search-on-answer:pat-bsa-fix-1": [
    "Goal: least_capacity(weights, days) = smallest capacity to ship all weights within days.",
    "Binary-search the ANSWER; a feasibility test can_ship(cap) checks a candidate.",
    "Key property: mid itself may be the smallest feasible capacity, so it must stay in range.",
    "Approach: on feasible, shrink the UPPER bound to mid (not mid-1); on infeasible, lo=mid+1.",
    "Pseudocode: if can_ship(mid): hi=mid else lo=mid+1; return lo.",
    "Fix: set hi = mid (not hi = mid - 1) in the feasible branch.",
  ],
  "pattern:top-k-heap:pat-tk-fix-1": [
    "Goal: k_largest(nums, k) = the k largest values, descending.",
    "Python's heapq is a MIN-heap; the smallest sits at the root (index 0).",
    "Key property: to keep the k LARGEST, hold a size-k min-heap and evict its smallest.",
    "Approach: push each value; if the heap exceeds k, pop (removes the current smallest).",
    "Pseudocode: for x: heappush(heap,x); if len>k: heappop(heap); return sorted(heap, reverse=True).",
    "Fix: push x (not -x) and return sorted(heap, reverse=True).",
  ],
  "pattern:greedy-interval-scheduling:pat-gis-fix-1": [
    "Goal: max_non_overlapping(intervals) = most mutually non-overlapping intervals.",
    "Sorting by start can pick a long interval that blocks several shorter ones.",
    "Key property: the optimal greedy always takes the interval that FINISHES earliest.",
    "Approach: sort by end time, then greedily take an interval whose start >= last end.",
    "Pseudocode: sort by x[1]; for start,end: if start>=last_end: count+=1; last_end=end.",
    "Fix: sort with key=lambda x: x[1] (end time).",
  ],
  "pattern:in-place-linkedlist-reversal:pat-iplr-fix-1": [
    "Goal: reverse(head) = the head of the reversed list.",
    "The loop flips each node's next pointer, advancing prev and curr.",
    "Key property: after the loop, the ORIGINAL head is the tail; prev is the new head.",
    "Approach: return prev, the last node that became the front.",
    "Pseudocode: while curr: nxt=curr.next; curr.next=prev; prev=curr; curr=nxt; return prev.",
    "Fix: return prev (not head).",
  ],
  "pattern:modified-binary-search:pat-mbs-fix-1": [
    "Goal: first_occurrence(nums, target) = index of the FIRST target in a sorted array, or -1.",
    "Returning on the first match can land on a later duplicate, not the earliest.",
    "Key property: after a match, earlier equal values can only be to the LEFT.",
    "Approach: record the match, then keep searching the left half.",
    "Pseudocode: if nums[mid]==target: res=mid; hi=mid-1 (don't return yet).",
    "Fix: on a match set res = mid and hi = mid - 1; return res at the end.",
  ],
  "pattern:divide-and-conquer:pat-dac-fix-1": [
    "Goal: merge(left, right) = one sorted list from two sorted lists (the merge-sort combine).",
    "The main loop stops when EITHER side is exhausted, leaving the other's tail behind.",
    "Key property: the remaining elements of the non-empty side are already sorted.",
    "Approach: after the loop, append both remainders (one is empty).",
    "Pseudocode: out.extend(left[i:]); out.extend(right[j:]).",
    "Fix: add out.extend(left[i:]) and out.extend(right[j:]) after the while loop.",
  ],
});



// ── R6 functional-repair — recognition grading for choose-approach lessons ──
// Structured approach/reason grading for the first batch of lesson-owned
// choose-approach exercises. Each entry's correct approach is taken from the
// exercise's authoritative `expected` answer; distractors carry empty
// requiredReasonIds + rejectionFeedback, and every entry has >=1 contradictory
// reason so a wrong justification is caught. Validated by validateRecognition.
Object.assign(EXERCISE_RECOGNITION, {
  "lesson:variables-and-types:vt-choose-1": {
    scenario:
      "A variable x must hold a whole number that may be hundreds of digits long. You must pick a Python numeric type and decide whether overflow is a concern.",
    approaches: [
      { id: "int", label: "Use Python's built-in int", requiredReasonIds: ["arbitrary-precision"] },
      { id: "float", label: "Use float", requiredReasonIds: [], rejectionFeedback: "float stores an approximate 64-bit double; past ~15–16 significant digits it loses precision, so a hundreds-of-digits whole number would be corrupted." },
      { id: "fixed-width", label: "Use a fixed-width 64-bit integer type", requiredReasonIds: [], rejectionFeedback: "Python's int is not a fixed-width C integer; there is no 64-bit cap to design around, and such a type would overflow on huge values." },
    ],
    reasons: [
      { id: "arbitrary-precision", text: "Python ints have arbitrary (unlimited) precision, growing as large as memory allows, so there is no overflow to worry about." },
      { id: "overflow-wraps", text: "The value will wrap around once it exceeds a fixed maximum, so you must guard against overflow.", contradictory: true },
      { id: "need-float-range", text: "Only a floating-point type can represent numbers this large.", contradictory: true },
    ],
    acceptableApproachIds: ["int"],
    modelExplanation:
      "Use int: Python integers have unlimited precision, so a value of any size is exact — there is no fixed-width integer overflow, only the limit of available memory.",
  },
  "lesson:expressions:expr-choose-1": {
    scenario:
      "You need the remainder of dividing a by b — for example, to test whether a is even.",
    approaches: [
      { id: "modulo", label: "Use the modulo operator %", requiredReasonIds: ["remainder-op"] },
      { id: "floordiv", label: "Use floor division //", requiredReasonIds: [], rejectionFeedback: "// gives the quotient (how many times b fits), discarding the remainder — the opposite of what you need." },
      { id: "truediv", label: "Use true division /", requiredReasonIds: [], rejectionFeedback: "/ gives a float quotient, not the integer remainder, so a % 2 == 0 cannot be expressed with it directly." },
    ],
    reasons: [
      { id: "remainder-op", text: "% returns the remainder after division, so a % 2 == 0 is true exactly when a is even." },
      { id: "gives-quotient", text: "This operator returns the quotient of the division, which is what we want.", contradictory: true },
      { id: "needs-float", text: "You must convert to float first to find a remainder.", contradictory: true },
    ],
    acceptableApproachIds: ["modulo"],
    modelExplanation:
      "The modulo operator % yields the remainder; a % 2 == 0 tests evenness.",
  },
  "lesson:scope:scope-choose-1": {
    scenario:
      "A function must update a module-level counter. You can declare the name `global` inside the function, or return the new value and reassign it at the call site.",
    approaches: [
      { id: "return-value", label: "Return the new value and reassign at the call site", requiredReasonIds: ["no-hidden-side-effects"] },
      { id: "global-decl", label: "Declare the name `global` and mutate it in place", requiredReasonIds: [], rejectionFeedback: "`global` works but couples the function to one specific module name and introduces a hidden side effect, making it harder to test and reuse." },
      { id: "nonlocal-decl", label: "Use `nonlocal`", requiredReasonIds: [], rejectionFeedback: "`nonlocal` targets an enclosing function's local, not a module-level name, so it does not apply to a module-level counter." },
    ],
    reasons: [
      { id: "no-hidden-side-effects", text: "Returning the value and reassigning it keeps the data flow explicit and avoids hidden side effects, so the function stays easy to test and decoupled from any particular name." },
      { id: "global-works-coupled", text: "`global` does correctly update the module-level name, so it works when shared mutable state is genuinely wanted — at the cost of coupling the function to that specific name." },
      { id: "global-is-cleanest", text: "Mutating a global is the cleanest option because it avoids any return value.", contradictory: true },
      { id: "cannot-return", text: "A function cannot return a value to update a counter, so a declaration is required.", contradictory: true },
    ],
    acceptableApproachIds: ["return-value"],
    alternatives: [
      { approachId: "global-decl", conditions: "When a quick script truly needs shared mutable module state and the coupling is acceptable.", tradeoff: "Introduces a hidden side effect and binds the function to that module name, hurting testability.", requiredReasonIds: ["global-works-coupled"] },
    ],
    reflectionPrompt:
      "Think of a case where a hidden side effect from `global` would make a bug hard to track down.",
    modelExplanation:
      "Prefer returning the new value and reassigning it at the call site — it avoids hidden side effects. `global` works but couples the function to that specific name.",
  },
  "lesson:errors:err-choose-1": {
    scenario:
      "A key might be missing from a dict. You can guard with `if key in d`, or wrap the access in try/except KeyError. You must decide which fits — and when.",
    approaches: [
      { id: "membership-check", label: "Check with `if key in d` first", requiredReasonIds: ["miss-is-common"] },
      { id: "try-except", label: "Catch KeyError with try/except", requiredReasonIds: ["miss-is-rare"] },
      { id: "catch-broad", label: "Wrap it in try/except Exception", requiredReasonIds: [], rejectionFeedback: "Catching broad Exception hides unrelated bugs (typos, TypeErrors); catch only the specific KeyError you expect." },
    ],
    reasons: [
      { id: "miss-is-common", text: "When a miss is common and expected, the `in` check is a cheap, explicit test that reads naturally in the normal flow." },
      { id: "miss-is-rare", text: "When a miss is rare/exceptional, try/except KeyError keeps the common path fast and treats the absence as the exception it is." },
      { id: "must-catch-broad", text: "You should always catch the broadest Exception type to be safe.", contradictory: true },
      { id: "in-mutates", text: "Using `in` modifies the dictionary, so try/except is the only safe option.", contradictory: true },
    ],
    acceptableApproachIds: ["membership-check"],
    alternatives: [
      { approachId: "try-except", conditions: "When a missing key is rare/exceptional rather than part of the normal flow.", tradeoff: "Exceptions are costly on the error path but keep the common (present) path clean and fast.", requiredReasonIds: ["miss-is-rare"] },
    ],
    modelExplanation:
      "Both are valid: use `if key in d` when a miss is common (cheap check); use try/except KeyError when a miss is rare/exceptional. Avoid catching broad Exception.",
  },
  "lesson:representations:repr-choose-1": {
    scenario:
      "On changing data, you frequently ask 'is key K present, and what is its value?'. You can store the data as a list of (key, value) pairs or as a dict.",
    approaches: [
      { id: "dict", label: "Use a dict keyed by K", requiredReasonIds: ["o1-lookup"] },
      { id: "list-pairs", label: "Keep a list of (key, value) pairs", requiredReasonIds: [], rejectionFeedback: "Finding a key in a list of pairs means scanning until you hit it — O(n) per lookup — which is wasteful for frequent keyed queries." },
      { id: "sorted-list", label: "Keep a list of pairs sorted by key and binary-search", requiredReasonIds: [], rejectionFeedback: "Binary search needs the list kept sorted, and inserts/deletes on changing data cost O(n); a dict gives expected O(1) without that upkeep." },
    ],
    reasons: [
      { id: "o1-lookup", text: "A dict hashes the key, so 'is K present and what is its value?' is answered in expected O(1), versus O(n) scanning a list of pairs." },
      { id: "preserves-order-only", text: "A list of pairs answers keyed lookups faster because it preserves insertion order.", contradictory: true },
      { id: "list-is-constant", text: "Searching a list of pairs for a key is O(1).", contradictory: true },
    ],
    acceptableApproachIds: ["dict"],
    modelExplanation:
      "A dict: keyed lookup is expected O(1), versus O(n) scanning a list of pairs.",
  },
  "lesson:complexity:cx-choose-1": {
    scenario:
      "You must find the maximum of an unsorted list, examining it only once. What is the best time complexity achievable?",
    approaches: [
      { id: "linear-scan", label: "A single O(n) linear scan tracking the running max", requiredReasonIds: ["must-see-every"] },
      { id: "sort-first", label: "Sort the list, then take the last element", requiredReasonIds: [], rejectionFeedback: "Sorting is O(n log n) — slower than necessary; you don't need total order just to find one maximum." },
      { id: "binary-search", label: "Binary search for the maximum", requiredReasonIds: [], rejectionFeedback: "Binary search needs a sorted array; the list is unsorted, so there is no ordering to exploit." },
    ],
    reasons: [
      { id: "must-see-every", text: "Any element you never examine could be the maximum, so you must look at every element at least once — that forces at least linear time." },
      { id: "sublinear-possible", text: "You can find the max without inspecting every element, so sublinear time is achievable.", contradictory: true },
      { id: "already-ordered", text: "The list is already ordered, so you can jump straight to the max.", contradictory: true },
    ],
    acceptableApproachIds: ["linear-scan"],
    modelExplanation:
      "O(n): any unexamined element could be the maximum, so you must inspect every element at least once — you cannot do better than linear.",
  },
  "lesson:cases:cases-choose-1": {
    scenario:
      "Two sorting algorithms handle n items: one is O(n log n) in the WORST case; the other averages O(n log n) but degrades to O(n²) in the worst case. The input is untrusted and possibly adversarial.",
    approaches: [
      { id: "guaranteed-worst", label: "Choose the guaranteed O(n log n) worst-case algorithm", requiredReasonIds: ["adversary-triggers-worst"] },
      { id: "best-average", label: "Choose the better average-case algorithm", requiredReasonIds: [], rejectionFeedback: "Average-case assumes random/benign input; an adversary can craft the exact input that triggers the O(n²) worst case, so the average bound gives no guarantee here." },
    ],
    reasons: [
      { id: "adversary-triggers-worst", text: "Untrusted input can be crafted to hit the quadratic worst case, so only a guaranteed worst-case bound protects you against a deliberate attack." },
      { id: "average-is-guarantee", text: "The average-case bound guarantees performance even on worst-case adversarial input.", contradictory: true },
      { id: "worst-case-irrelevant", text: "Worst-case behavior never occurs in practice, so it can be ignored.", contradictory: true },
    ],
    acceptableApproachIds: ["guaranteed-worst"],
    modelExplanation:
      "Pick the algorithm with the guaranteed O(n log n) worst case: untrusted/adversarial input could deliberately trigger the other's O(n²) worst case.",
  },
  "lesson:amortized:amort-choose-1": {
    scenario:
      "You will append exactly n items to a list and n is known in advance. You want to avoid the periodic resize/copy that a growing list performs.",
    approaches: [
      { id: "preallocate", label: "Preallocate a list of size n ([None] * n) and assign by index", requiredReasonIds: ["one-alloc-no-copies"] },
      { id: "append-grow", label: "Start empty and append n times, letting the list grow", requiredReasonIds: [], rejectionFeedback: "Appending to a growing list triggers periodic doubling/reallocations; it is amortized O(n) overall but does repeated mid-loop copies you were asked to avoid." },
    ],
    reasons: [
      { id: "one-alloc-no-copies", text: "Because n is known, one [None]*n allocation reserves all space up front, so index assignment does zero mid-loop copies — a single O(n) allocation." },
      { id: "append-never-copies", text: "Appending to a Python list never causes any reallocation or copying.", contradictory: true },
      { id: "size-unknown", text: "The final size is unknown, so preallocation is impossible.", contradictory: true },
    ],
    acceptableApproachIds: ["preallocate"],
    modelExplanation:
      "Preallocate a list of size n (e.g. [None] * n) and assign by index: one O(n) allocation and no mid-loop copies.",
  },
  "lesson:matrix-traversal:mat-predict-1": {
    scenario:
      "You must state the time complexity of visiting every cell of an R×C grid, and explain why it is not O(R+C).",
    approaches: [
      { id: "rc-product", label: "O(R*C) — nested loops multiply", requiredReasonIds: ["nested-multiply"] },
      { id: "r-plus-c", label: "O(R+C) — add the dimensions", requiredReasonIds: [], rejectionFeedback: "O(R+C) counts each row and each column only once, but a full traversal touches every one of the R*C cells, so the counts multiply, not add." },
    ],
    reasons: [
      { id: "nested-multiply", text: "The row loop runs R times and the inner column loop runs C times for each row, so the cell visits multiply to R*C." },
      { id: "loops-are-sequential", text: "The two loops run one after another rather than nested, so their counts add to R+C.", contradictory: true },
      { id: "diagonal-only", text: "A traversal only visits the diagonal, so it is O(min(R,C)).", contradictory: true },
    ],
    acceptableApproachIds: ["rc-product"],
    modelExplanation:
      "O(R*C): the loops are nested so the counts multiply. O(R+C) would count each row and column once, but there are R*C cells to visit.",
  },
  "lesson:intervals:int-choose-1": {
    scenario:
      "You merge a set of n intervals. You must give the overall time complexity and name the step that dominates it.",
    approaches: [
      { id: "sort-dominates", label: "O(n log n), dominated by sorting the intervals", requiredReasonIds: ["sort-then-linear-sweep"] },
      { id: "linear-total", label: "O(n), because the merge sweep is linear", requiredReasonIds: [], rejectionFeedback: "The one-pass sweep is indeed O(n), but you must sort by start first, and that O(n log n) sort dominates the total." },
      { id: "quadratic", label: "O(n²), from comparing every pair of intervals", requiredReasonIds: [], rejectionFeedback: "Pairwise comparison would be O(n²), but sorting + a single sweep avoids that, giving O(n log n)." },
    ],
    reasons: [
      { id: "sort-then-linear-sweep", text: "Sorting by start is O(n log n) and the subsequent merge sweep is only O(n), so the sort dominates the total." },
      { id: "no-sort-needed", text: "No sorting is required to merge intervals, so the whole thing is linear.", contradictory: true },
      { id: "sweep-is-quadratic", text: "The merge sweep itself is O(n²).", contradictory: true },
    ],
    acceptableApproachIds: ["sort-dominates"],
    modelExplanation:
      "O(n log n), dominated by the sort. The merge sweep itself is only O(n).",
  },
  "lesson:string-frequency:sf-choose-1": {
    scenario:
      "You must decide whether two strings are anagrams of each other. You can build and compare character-frequency maps, or sort both strings.",
    approaches: [
      { id: "freq-map", label: "Build a frequency map of each string and compare", requiredReasonIds: ["linear-count-compare"] },
      { id: "sort-both", label: "Sort both strings and compare", requiredReasonIds: [], rejectionFeedback: "Sorting works but is O(n log n); counting characters answers the same question in O(n)." },
      { id: "set-compare", label: "Compare the sets of characters", requiredReasonIds: [], rejectionFeedback: "A set ignores how many times each character appears, so 'aab' and 'abb' would wrongly look equal — counts matter for anagrams." },
    ],
    reasons: [
      { id: "linear-count-compare", text: "Anagrams have identical character counts, so counting each string in O(n) and comparing the two maps decides it in O(n) time and O(k) space." },
      { id: "sorting-also-works", text: "Two strings are anagrams exactly when their sorted forms are equal, so sorting both and comparing is a valid O(n log n) alternative." },
      { id: "order-matters", text: "Anagram testing depends on the order of characters, so you must preserve order.", contradictory: true },
      { id: "counts-dont-matter", text: "Only the set of distinct characters matters, not how many of each.", contradictory: true },
    ],
    acceptableApproachIds: ["freq-map"],
    alternatives: [
      { approachId: "sort-both", conditions: "When you want a one-line solution and the O(n log n) cost is acceptable.", tradeoff: "Sorting is O(n log n), slower than the O(n) frequency-map count.", requiredReasonIds: ["sorting-also-works"] },
    ],
    modelExplanation:
      "Build a frequency map of each string and compare them (equal maps ⇒ anagrams): O(n) time, O(k) space — better than sorting's O(n log n).",
  },
  "lesson:string-two-pointers:stp-choose-1": {
    scenario:
      "In a memory-constrained setting you must check whether a string is a palindrome. You can compare it to its reverse (s == s[::-1]) or walk two pointers inward from both ends.",
    approaches: [
      { id: "two-pointers", label: "Two pointers converging from both ends", requiredReasonIds: ["constant-space-early-exit"] },
      { id: "reverse-slice", label: "Compare s to its reversed copy s[::-1]", requiredReasonIds: [], rejectionFeedback: "s[::-1] allocates a full reversed copy — O(n) extra space — and always scans the whole string, which the memory-tight setting rules out." },
    ],
    reasons: [
      { id: "constant-space-early-exit", text: "Two pointers compare characters in place using O(1) extra space and can return False at the first mismatch without building anything." },
      { id: "slice-is-constant-space", text: "Building s[::-1] uses only O(1) extra space.", contradictory: true },
      { id: "pointers-need-copy", text: "The two-pointer method must first copy the string, so it uses O(n) space too.", contradictory: true },
    ],
    acceptableApproachIds: ["two-pointers"],
    modelExplanation:
      "Two pointers use O(1) extra space and can exit early on the first mismatch; s[::-1] builds a full reversed copy using O(n) space.",
  },
  "lesson:string-sliding-window:ssw-choose-1": {
    scenario:
      "You need the longest substring with at most 2 distinct characters. You must choose between a fixed-size and a variable-size sliding window.",
    approaches: [
      { id: "variable-window", label: "Variable-size sliding window", requiredReasonIds: ["grow-shrink-on-constraint"] },
      { id: "fixed-window", label: "Fixed-size sliding window", requiredReasonIds: [], rejectionFeedback: "A fixed window needs a known width, but the answer's length is exactly what you're solving for — it isn't fixed." },
    ],
    reasons: [
      { id: "grow-shrink-on-constraint", text: "The window grows while 'at most 2 distinct' holds and contracts from the left when it breaks, so its width adapts to the data rather than being fixed." },
      { id: "width-is-known", text: "The target substring has a fixed, known width, so a constant-size window applies.", contradictory: true },
      { id: "needs-sorting", text: "The string must be sorted before the window can slide.", contradictory: true },
    ],
    acceptableApproachIds: ["variable-window"],
    modelExplanation:
      "Variable-size: the window grows while the constraint (<= 2 distinct) holds and contracts when it breaks; the width is not fixed.",
  },
  "lesson:string-parsing:sp-choose-1": {
    scenario:
      "You receive the text '10,20,30' and must add the three numbers together. You must choose the required steps and their order.",
    approaches: [
      { id: "split-then-int", label: "Split on ',' into tokens, then convert each with int, then sum", requiredReasonIds: ["text-to-numbers-first"] },
      { id: "sum-tokens", label: "Split on ',' and sum the string tokens directly", requiredReasonIds: [], rejectionFeedback: "Summing strings either concatenates them or raises a TypeError — text must become numbers before arithmetic." },
      { id: "int-whole", label: "Call int('10,20,30') on the whole string", requiredReasonIds: [], rejectionFeedback: "int() cannot parse a string containing commas; you must split into individual numeric tokens first." },
    ],
    reasons: [
      { id: "text-to-numbers-first", text: "Splitting yields string tokens, and arithmetic needs numbers, so you must convert each token with int before summing — split first, then convert." },
      { id: "convert-before-split", text: "You should convert the whole string to an int before splitting it.", contradictory: true },
      { id: "strings-add-numerically", text: "Adding the string tokens directly performs numeric addition.", contradictory: true },
    ],
    acceptableApproachIds: ["split-then-int"],
    modelExplanation:
      "First split on ',' to get string tokens, then convert each with int before summing — text must become numbers first.",
  },
  "lesson:palindromes:pal-choose-1": {
    scenario:
      "For a very long string in a memory-tight environment, you must choose a palindrome-checking method: slicing (s == s[::-1]) or two converging pointers.",
    approaches: [
      { id: "two-pointers", label: "Two pointers from both ends", requiredReasonIds: ["o1-space-early-exit"] },
      { id: "slice-reverse", label: "Compare s to s[::-1]", requiredReasonIds: [], rejectionFeedback: "The slice builds a full reversed copy (O(n) extra space) and never exits early — both bad in a memory-tight setting on a long string." },
    ],
    reasons: [
      { id: "o1-space-early-exit", text: "The two-pointer scan compares in place with O(1) extra space and stops at the first mismatch, which fits a long string under tight memory." },
      { id: "slice-saves-memory", text: "The slice method uses less memory because it avoids extra pointers.", contradictory: true },
      { id: "pointers-slower-asymptotically", text: "Two pointers are asymptotically slower than slicing.", contradictory: true },
    ],
    acceptableApproachIds: ["two-pointers"],
    modelExplanation:
      "The two-pointer method: O(1) extra space and early exit on mismatch, versus the slice's O(n) reversed copy.",
  },
  "lesson:palindromes:pal-longest-substring-1": {
    scenario:
      "To find the LONGEST palindromic substring of 'cbbd' by expanding around centers, you must decide which centers to try. The answer 'bb' is an even-length palindrome.",
    approaches: [
      { id: "all-centers", label: "Expand around all 2n-1 centers (each index AND each gap between adjacent indices)", requiredReasonIds: ["even-needs-gap-center"] },
      { id: "odd-only", label: "Expand only around single-index (odd-length) centers", requiredReasonIds: [], rejectionFeedback: "Odd-only centers never check the gap between the two 'b's, so the even-length 'bb' is missed and you return a length-1 answer." },
    ],
    reasons: [
      { id: "even-needs-gap-center", text: "An even-length palindrome like 'bb' is centered in the gap between two indices, so you must expand from both single-index centers (odd) and between-index gaps (even) — 2n-1 centers in O(n^2) time, O(1) space." },
      { id: "odd-centers-suffice", text: "Only single-index centers are needed because every palindrome has an odd length.", contradictory: true },
      { id: "needs-sorting", text: "You must sort the string's characters before expanding around centers.", contradictory: true },
    ],
    acceptableApproachIds: ["all-centers"],
    modelExplanation:
      "Try all 2n-1 centers — each index (odd-length) and each gap between adjacent indices (even-length) — expanding while s[lo]==s[hi]. 'bb' is even-length, centered in a gap, so an odd-only version misses it. O(n^2) time, O(1) space.",
  },
  "lesson:anagrams:ana-choose-1": {
    scenario:
      "For very long strings you must test whether they are anagrams, and you care which method scales better.",
    approaches: [
      { id: "freq-map", label: "Compare character-frequency maps (reject early if lengths differ)", requiredReasonIds: ["linear-counts"] },
      { id: "sort-both", label: "Sort both strings and compare", requiredReasonIds: [], rejectionFeedback: "Sorting is O(n log n); for long strings the O(n) frequency count scales better." },
    ],
    reasons: [
      { id: "linear-counts", text: "Counting characters is O(n) time and O(k) space, and a quick length check rejects non-anagrams immediately — better scaling than sorting." },
      { id: "sorting-works-slower", text: "Comparing the sorted forms of both strings also decides anagrams correctly, at an O(n log n) cost." },
      { id: "sort-is-linear", text: "Sorting both strings runs in O(n) time, matching the frequency-map method.", contradictory: true },
      { id: "lengths-irrelevant", text: "Strings of different lengths can still be anagrams, so the length check is pointless.", contradictory: true },
    ],
    acceptableApproachIds: ["freq-map"],
    alternatives: [
      { approachId: "sort-both", conditions: "When code brevity matters more than the asymptotic edge.", tradeoff: "O(n log n) versus the frequency map's O(n).", requiredReasonIds: ["sorting-works-slower"] },
    ],
    modelExplanation:
      "The frequency-map method: O(n) time, O(k) space, versus sorting's O(n log n). Also reject early if lengths differ.",
  },
  "lesson:substrings:sub-choose-1": {
    scenario:
      "A problem asks for the longest substring without repeating characters. You could enumerate all substrings, or slide a window.",
    approaches: [
      { id: "variable-window", label: "Variable-size sliding window with a seen-set/last-index map", requiredReasonIds: ["linear-window"] },
      { id: "enumerate-all", label: "Enumerate every substring and check each", requiredReasonIds: [], rejectionFeedback: "There are O(n^2) substrings and checking each adds more cost; a window solves the same problem in O(n)." },
    ],
    reasons: [
      { id: "linear-window", text: "The 'no repeats' constraint is monotone: grow the right edge and advance the left past any repeat, visiting each index O(1) times for O(n) total and O(k) space." },
      { id: "enumeration-is-linear", text: "Enumerating all substrings is only O(n) work.", contradictory: true },
      { id: "needs-sorting", text: "The string must be sorted first for a window to work.", contradictory: true },
    ],
    acceptableApproachIds: ["variable-window"],
    modelExplanation:
      "No — enumeration is O(n^2)+ substrings. Use a variable-size sliding window: O(n) time, O(k) space.",
  },
  "lesson:linear-search:ls-choose-1": {
    scenario:
      "You will search the SAME array thousands of times, each query asking whether a different value is present. Repeated linear scans vs building an index first.",
    approaches: [
      { id: "build-set", label: "Build a set once, then query membership", requiredReasonIds: ["amortize-queries"] },
      { id: "repeated-linear", label: "Linear-search the array on every query", requiredReasonIds: [], rejectionFeedback: "Each scan is O(n), so q queries cost O(n·q) — far too slow when q is large and the array is fixed." },
    ],
    reasons: [
      { id: "amortize-queries", text: "The array is fixed, so a one-time O(n) set build lets each of the q queries run in expected O(1), giving O(n + q) overall instead of O(n·q)." },
      { id: "linear-is-faster-repeated", text: "Repeated linear search is faster than a set because it avoids the build cost each time.", contradictory: true },
      { id: "set-query-linear", text: "Membership in a set costs O(n) per query, no better than scanning.", contradictory: true },
    ],
    acceptableApproachIds: ["build-set"],
    modelExplanation:
      "Repeated linear search is O(n) per query = O(n·q). Build a set once (O(n)) then query in expected O(1), giving O(n + q).",
  },
  "lesson:bounds:bnd-choose-1": {
    scenario:
      "In a sorted array with duplicate values, you need the index of the FIRST occurrence of a target. You must pick between bisect_left and bisect_right.",
    approaches: [
      { id: "bisect-left", label: "Use bisect_left", requiredReasonIds: ["leftmost-insertion"] },
      { id: "bisect-right", label: "Use bisect_right", requiredReasonIds: [], rejectionFeedback: "bisect_right returns the index just past the LAST occurrence, so it points to the wrong end of a run of duplicates." },
    ],
    reasons: [
      { id: "leftmost-insertion", text: "bisect_left returns the leftmost position where the target appears (or would be inserted), which is exactly the first occurrence's index." },
      { id: "right-gives-first", text: "bisect_right returns the index of the first occurrence of the target.", contradictory: true },
      { id: "duplicates-break-bisect", text: "Neither bisect function works when the array contains duplicates.", contradictory: true },
    ],
    acceptableApproachIds: ["bisect-left"],
    modelExplanation:
      "bisect_left — it returns the leftmost index where the target appears (or would be inserted); bisect_right points past the last occurrence.",
  },
});


Object.assign(EXERCISE_RECOGNITION, {
  "lesson:matrix-search:ms-choose-1": {
    scenario:
      "A matrix is sorted within each row and each column, but NOT globally (a row's first value may be smaller than the previous row's last value). You must search it for a target.",
    approaches: [
      { id: "staircase", label: "Staircase walk from the top-right (or bottom-left) corner", requiredReasonIds: ["corner-prunes-rowcol"] },
      { id: "flatten-binary", label: "Flatten the cells and binary-search", requiredReasonIds: [], rejectionFeedback: "Flattening is NOT globally sorted (row starts can be below previous row ends), so binary search over cells can skip the target — it's invalid here." },
    ],
    reasons: [
      { id: "corner-prunes-rowcol", text: "From the top-right, a too-big value rules out that whole column (move left) and a too-small value rules out that whole row (move down), eliminating one row or column each step for O(m+n)." },
      { id: "globally-sorted", text: "Reading the cells row by row yields a globally sorted sequence, so binary search applies.", contradictory: true },
      { id: "no-structure", text: "The matrix has no useful ordering, so only a full O(m·n) scan works.", contradictory: true },
    ],
    acceptableApproachIds: ["staircase"],
    modelExplanation:
      "Flattening isn't globally sorted, so cell binary search is invalid. Use the staircase walk from the top-right (or bottom-left): move left on too-big, down on too-small — O(m+n).",
  },
  "lesson:bubble-sort:bub-choose-1": {
    scenario:
      "You must sort n = 1,000,000 elements. You must decide whether bubble sort is acceptable, and if not, what to use.",
    approaches: [
      { id: "nlogn-sort", label: "Use an O(n log n) sort (Python's sorted/Timsort)", requiredReasonIds: ["quadratic-too-slow"] },
      { id: "bubble", label: "Use bubble sort", requiredReasonIds: [], rejectionFeedback: "Bubble sort is O(n²); for n = 10^6 that's ~10^12 operations — far too slow to finish in reasonable time." },
    ],
    reasons: [
      { id: "quadratic-too-slow", text: "O(n²) on a million elements is ~10^12 operations, whereas an O(n log n) sort is ~2×10^7 — many orders of magnitude faster." },
      { id: "bubble-is-nlogn", text: "Bubble sort runs in O(n log n), so it scales fine to a million elements.", contradictory: true },
      { id: "quadratic-fine", text: "10^12 operations completes essentially instantly, so quadratic is acceptable.", contradictory: true },
    ],
    acceptableApproachIds: ["nlogn-sort"],
    modelExplanation:
      "No — O(n²) would be ~10^12 operations. Use an O(n log n) sort (Python's sorted/Timsort), which is ~2×10^7 operations.",
  },
  "lesson:selection-sort:sel-choose-1": {
    scenario:
      "Writes to your storage medium are very expensive but reads are cheap. Among the O(n²) sorts, you must pick the one that minimizes writes.",
    approaches: [
      { id: "selection", label: "Selection sort", requiredReasonIds: ["at-most-n-writes"] },
      { id: "bubble", label: "Bubble sort", requiredReasonIds: [], rejectionFeedback: "Bubble sort performs O(n²) adjacent swaps in the worst case — far more writes than selection sort's n." },
      { id: "insertion", label: "Insertion sort", requiredReasonIds: [], rejectionFeedback: "Insertion sort shifts elements to make room, which can be O(n²) writes — more than selection sort's at-most-n swaps." },
    ],
    reasons: [
      { id: "at-most-n-writes", text: "Selection sort does at most n swaps — one per position as it places the correct element — so it writes O(n) times even though it reads O(n²) times." },
      { id: "selection-many-writes", text: "Selection sort performs O(n²) writes, more than the other quadratic sorts.", contradictory: true },
      { id: "all-same-writes", text: "All O(n²) sorts perform the same number of writes.", contradictory: true },
    ],
    acceptableApproachIds: ["selection"],
    modelExplanation:
      "Selection sort — it performs at most n swaps (writes), one per position, whereas bubble/insertion may perform O(n²) writes.",
  },
  "lesson:insertion-sort:ins-choose-1": {
    scenario:
      "You must sort many small chunks that are each already nearly sorted. You must choose the best quadratic sort for this.",
    approaches: [
      { id: "insertion", label: "Insertion sort", requiredReasonIds: ["adaptive-nearly-sorted"] },
      { id: "selection", label: "Selection sort", requiredReasonIds: [], rejectionFeedback: "Selection sort always scans the full remaining array regardless of order, so it is O(n²) even on nearly-sorted input — it is not adaptive." },
    ],
    reasons: [
      { id: "adaptive-nearly-sorted", text: "Insertion sort is adaptive: each element only shifts past the few out-of-place neighbours, so nearly-sorted input runs in near O(n), and it is stable — exactly why hybrid sorts use it for small runs." },
      { id: "selection-adaptive", text: "Selection sort speeds up to O(n) on nearly-sorted input.", contradictory: true },
      { id: "insertion-not-stable", text: "Insertion sort is unstable, so it reorders equal elements.", contradictory: true },
    ],
    acceptableApproachIds: ["insertion"],
    modelExplanation:
      "Insertion sort — it is adaptive (near O(n) on nearly-sorted input) and stable, which is why hybrid sorts use it for small runs.",
  },
  "lesson:merge-sort:mrg-choose-1": {
    scenario:
      "You must sort 100 GB of data that does not fit in memory. You must choose a sorting approach suited to data on disk.",
    approaches: [
      { id: "merge-sort", label: "Merge sort (as an external sort)", requiredReasonIds: ["sequential-run-merge"] },
      { id: "quick-sort", label: "In-memory quicksort", requiredReasonIds: [], rejectionFeedback: "Quicksort assumes random access to the whole array in memory; 100 GB does not fit, and its partitioning is not naturally a sequential external pass." },
    ],
    reasons: [
      { id: "sequential-run-merge", text: "Merge sort sorts chunks that fit in memory, then merges the sorted runs with sequential linear passes from disk — guaranteed O(n log n) with disk-friendly sequential access." },
      { id: "fits-in-memory", text: "The whole 100 GB can be loaded into memory, so an in-place sort is fine.", contradictory: true },
      { id: "merge-random-access", text: "Merge sort requires random access across the entire dataset at once.", contradictory: true },
    ],
    acceptableApproachIds: ["merge-sort"],
    modelExplanation:
      "Merge sort merges sorted runs sequentially, so it works as an external sort: sort in-memory chunks, then merge them from disk with linear passes. O(n log n) is guaranteed and access is sequential.",
  },
  "lesson:quick-sort:qk-choose-1": {
    scenario:
      "You need a sort with a GUARANTEED worst-case O(n log n) on adversarial input, and stability matters. Quicksort or merge sort?",
    approaches: [
      { id: "merge-sort", label: "Merge sort", requiredReasonIds: ["guaranteed-stable"] },
      { id: "quick-sort", label: "Quicksort", requiredReasonIds: [], rejectionFeedback: "Quicksort can be driven to O(n²) by crafted input, and its usual in-place form is not stable — failing both requirements." },
    ],
    reasons: [
      { id: "guaranteed-stable", text: "Merge sort guarantees O(n log n) in the worst case and is stable, satisfying both the adversarial-input and stability requirements." },
      { id: "quicksort-guaranteed", text: "Quicksort guarantees O(n log n) worst case regardless of input.", contradictory: true },
      { id: "merge-unstable", text: "Merge sort is inherently unstable.", contradictory: true },
    ],
    acceptableApproachIds: ["merge-sort"],
    modelExplanation:
      "Merge sort — it guarantees O(n log n) worst case and is stable. Quicksort risks O(n²) on crafted input and its in-place form is not stable.",
  },
  "lesson:counting-sort:cnt-choose-1": {
    scenario:
      "You must sort 1,000,000 exam scores, each an integer from 0 to 100. Counting sort or an O(n log n) comparison sort?",
    approaches: [
      { id: "counting-sort", label: "Counting sort", requiredReasonIds: ["small-range-linear"] },
      { id: "comparison-sort", label: "An O(n log n) comparison sort", requiredReasonIds: [], rejectionFeedback: "It works, but with the tiny fixed range 0–100 counting sort is O(n), faster than the O(n log n) comparison bound here." },
    ],
    reasons: [
      { id: "small-range-linear", text: "The value range hi = 100 is tiny and fixed, so counting sort is O(n + hi) ≈ O(n) — linear and faster than O(n log n)." },
      { id: "range-is-huge", text: "The score range is enormous, so counting sort's counts array would be impractical.", contradictory: true },
      { id: "counting-needs-comparisons", text: "Counting sort still makes O(n log n) comparisons internally.", contradictory: true },
    ],
    acceptableApproachIds: ["counting-sort"],
    modelExplanation:
      "Counting sort: hi = 100 is tiny, so it's O(n + hi) ≈ O(n) — linear and faster than O(n log n) here.",
  },
  "lesson:bucket-sort:buck-choose-1": {
    scenario:
      "You have a million floats UNIFORMLY distributed in [0, 1). You consider bucket sort versus an O(n log n) comparison sort.",
    approaches: [
      { id: "bucket-sort", label: "Bucket sort", requiredReasonIds: ["uniform-small-buckets"] },
      { id: "comparison-sort", label: "An O(n log n) comparison sort", requiredReasonIds: [], rejectionFeedback: "It is a fine general choice, but it cannot beat the O(n log n) comparison bound, whereas bucket sort exploits the uniform distribution to reach expected O(n)." },
    ],
    reasons: [
      { id: "uniform-small-buckets", text: "A uniform distribution spreads items evenly, so each bucket stays small and sorting them is cheap, giving expected O(n) — below the comparison-sort bound." },
      { id: "distribution-irrelevant", text: "Bucket sort's speed does not depend on how the data is distributed.", contradictory: true },
      { id: "comparison-beats-linear", text: "A comparison sort can run in O(n) on this data, so bucket sort offers no advantage.", contradictory: true },
    ],
    acceptableApproachIds: ["bucket-sort"],
    modelExplanation:
      "Uniform distribution keeps each bucket small, so bucket sort runs in expected O(n) — faster than the O(n log n) comparison bound for this well-distributed data.",
  },
  "lesson:heap-sort:hs-choose-1": {
    scenario:
      "You need a guaranteed O(n log n) sort using O(1) extra space, and stability is NOT required. Heap sort or merge sort?",
    approaches: [
      { id: "heap-sort", label: "Heap sort (in-place)", requiredReasonIds: ["inplace-guaranteed"] },
      { id: "merge-sort", label: "Merge sort", requiredReasonIds: [], rejectionFeedback: "Merge sort is also O(n log n) but needs O(n) auxiliary space, violating the O(1)-space requirement." },
    ],
    reasons: [
      { id: "inplace-guaranteed", text: "Heap sort is O(n log n) in the worst case and sorts in place with O(1) auxiliary space; since stability is not needed, its non-stability is irrelevant." },
      { id: "heap-needs-on-space", text: "Heap sort requires O(n) extra space for the heap.", contradictory: true },
      { id: "merge-is-constant-space", text: "Merge sort sorts with O(1) auxiliary space.", contradictory: true },
    ],
    acceptableApproachIds: ["heap-sort"],
    modelExplanation:
      "Heap sort (in-place): O(n log n) guaranteed and O(1) auxiliary space. Merge sort is also O(n log n) but needs O(n) space.",
  },
  "lesson:radix-sort:rad-choose-1": {
    scenario:
      "You must sort a million integers ranging up to 1,000,000,000. Counting sort or radix sort?",
    approaches: [
      { id: "radix-sort", label: "Radix sort", requiredReasonIds: ["digit-passes-avoid-range"] },
      { id: "counting-sort", label: "Plain counting sort over the value range", requiredReasonIds: [], rejectionFeedback: "A single counting sort would need an O(hi)=O(10^9) counts array for the billion-wide range — wasteful in time and memory." },
    ],
    reasons: [
      { id: "digit-passes-avoid-range", text: "Radix sort processes ~10 digits with a small base, so it is O(d·(n+b)) ≈ O(n), avoiding the huge O(10^9) counts array that the raw range would require." },
      { id: "range-is-small", text: "The value range is small, so a single counting-sort pass is cheap.", contradictory: true },
      { id: "radix-needs-comparisons", text: "Radix sort relies on O(n log n) comparisons like a comparison sort.", contradictory: true },
    ],
    acceptableApproachIds: ["radix-sort"],
    modelExplanation:
      "Radix sort — counting sort would need an O(hi)=O(10^9) counts array (wasteful). Radix processes ~10 digits: O(d·(n+b)) ≈ O(n), avoiding the huge-range blowup.",
  },
  "lesson:comparators:cmp-choose-1": {
    scenario:
      "You want to sort records by field A ascending and field B descending at the same time. You must pick a clean Python approach.",
    approaches: [
      { id: "tuple-key", label: "A tuple key that negates the descending field, e.g. key=lambda x: (x.a, -x.b)", requiredReasonIds: ["key-computed-once"] },
      { id: "cmp-function", label: "A cmp_to_key comparator function", requiredReasonIds: [], rejectionFeedback: "cmp_to_key invokes the comparator O(n log n) times and is noticeably slower than a key computed once per element." },
    ],
    reasons: [
      { id: "key-computed-once", text: "A key function is computed once per element and sorting then compares the resulting tuples lexicographically; negating the descending field flips just that field's order." },
      { id: "cmp-faster", text: "A cmp_to_key comparator is faster because it compares elements directly.", contradictory: true },
      { id: "cannot-mix-directions", text: "Python's sort cannot mix ascending and descending fields in one pass.", contradictory: true },
    ],
    acceptableApproachIds: ["tuple-key"],
    modelExplanation:
      "Use a tuple key that negates the descending field, e.g. key=lambda x: (x.a, -x.b). The key is computed once per element; cmp_to_key calls a comparator O(n log n) times and is slower.",
  },
  "lesson:interval-sorting:isort-choose-1": {
    scenario:
      "You need to MERGE overlapping intervals. You must decide whether to sort by start or by end, and what sorting enables.",
    approaches: [
      { id: "sort-by-start", label: "Sort by start, then sweep left to right", requiredReasonIds: ["start-order-enables-sweep"] },
      { id: "sort-by-end", label: "Sort by end", requiredReasonIds: [], rejectionFeedback: "Sorting by end is the tool for interval scheduling (max non-overlapping), not for merging; for merging you want intervals grouped by where they begin." },
      { id: "no-sort", label: "Compare every pair of intervals", requiredReasonIds: [], rejectionFeedback: "Pairwise comparison is O(n²); sorting first turns the merge into a single O(n) sweep." },
    ],
    reasons: [
      { id: "start-order-enables-sweep", text: "After sorting by start, any interval that overlaps the last kept one starts before that one ends, so a single left-to-right sweep merges them — O(n log n) sort + O(n) sweep." },
      { id: "end-order-for-merging", text: "Sorting by end time is what makes interval merging work.", contradictory: true },
      { id: "merging-needs-no-sort", text: "Merging overlapping intervals requires no sorting at all.", contradictory: true },
    ],
    acceptableApproachIds: ["sort-by-start"],
    modelExplanation:
      "Sort by START, then a single left-to-right sweep merges each interval into the last kept one when they overlap — turning an O(n²) pairwise check into O(n log n) sort + O(n) sweep.",
  },
  "lesson:stack-queue-operations:sq-choose-1": {
    scenario:
      "You need FIFO processing of tasks with millions of enqueue and dequeue operations. You must choose between a list and a collections.deque.",
    approaches: [
      { id: "deque", label: "Use collections.deque", requiredReasonIds: ["o1-both-ends"] },
      { id: "list", label: "Use a list with append and pop(0)", requiredReasonIds: [], rejectionFeedback: "list.pop(0) shifts every remaining element, costing O(n) per dequeue — far too slow for millions of operations." },
    ],
    reasons: [
      { id: "o1-both-ends", text: "A deque supports append (enqueue) and popleft (dequeue) in O(1) each, so millions of FIFO operations stay linear overall." },
      { id: "list-pop0-constant", text: "list.pop(0) runs in O(1), so a plain list is just as fast as a deque for a queue.", contradictory: true },
      { id: "deque-no-fifo", text: "A deque cannot model FIFO ordering.", contradictory: true },
    ],
    acceptableApproachIds: ["deque"],
    modelExplanation:
      "deque — enqueue (append) and dequeue (popleft) are O(1). A list would make dequeue list.pop(0) = O(n), far too slow.",
  },
  "lesson:parentheses-matching:paren-choose-1": {
    scenario:
      "You must validate bracket strings like '([)]'. A single integer counter increments on '(' and decrements on ')'; a stack pushes openers and matches closers. You must explain why the counter fails but the stack succeeds.",
    approaches: [
      { id: "stack", label: "Use a stack of open brackets", requiredReasonIds: ["stack-enforces-type-order"] },
      { id: "counter", label: "Use a single integer counter", requiredReasonIds: [], rejectionFeedback: "A counter ignores bracket TYPE and nesting order, so '([)]' balances numerically yet is actually mis-nested — the counter accepts an invalid string." },
    ],
    reasons: [
      { id: "stack-enforces-type-order", text: "A stack makes each closer match the most recent opener of the correct type, so it catches the mis-nesting in '([)]' that a numeric count cannot see." },
      { id: "counter-tracks-type", text: "An integer counter tracks each bracket's type and nesting order.", contradictory: true },
      { id: "paren-is-numeric", text: "Validity depends only on the total counts of openers and closers, so a counter suffices.", contradictory: true },
    ],
    acceptableApproachIds: ["stack"],
    modelExplanation:
      "A counter ignores bracket type and order, so '([)]' balances numerically but is mis-nested. A stack enforces that each closer matches the most recent opener of the correct type.",
  },
  "lesson:expression-evaluation:expr-choose-1": {
    scenario:
      "You must evaluate arithmetic expressions. You compare evaluating RPN (postfix) against evaluating infix like (2+1)*3 directly, and explain why RPN is simpler.",
    approaches: [
      { id: "rpn-stack", label: "Evaluate RPN with a single value stack", requiredReasonIds: ["order-is-explicit"] },
      { id: "infix-direct", label: "Evaluate the infix expression directly with one left-to-right pass", requiredReasonIds: [], rejectionFeedback: "Infix needs precedence and parentheses handling (e.g. a shunting-yard parser) before you can evaluate it; a naive single pass gets operator precedence wrong." },
    ],
    reasons: [
      { id: "order-is-explicit", text: "RPN encodes evaluation order explicitly, so you just push numbers and apply each operator to the top values — no precedence or parentheses logic needed." },
      { id: "infix-has-no-precedence", text: "Infix expressions require no precedence handling, so they are as simple as RPN.", contradictory: true },
      { id: "rpn-needs-parens", text: "RPN still needs parentheses to disambiguate operations.", contradictory: true },
    ],
    acceptableApproachIds: ["rpn-stack"],
    modelExplanation:
      "RPN encodes order explicitly, so no precedence or parentheses handling is needed — just push numbers and apply operators. Infix requires a precedence-aware parser (e.g. shunting-yard) first.",
  },
  "lesson:bfs-queues:bfs-choose-1": {
    scenario:
      "You need the shortest path LENGTH between two nodes in an UNWEIGHTED graph. BFS or DFS?",
    approaches: [
      { id: "bfs", label: "Breadth-first search", requiredReasonIds: ["distance-order"] },
      { id: "dfs", label: "Depth-first search", requiredReasonIds: [], rejectionFeedback: "DFS dives down one path first and does not visit nodes in distance order, so the first time it reaches the target is not guaranteed to be via a shortest path." },
    ],
    reasons: [
      { id: "distance-order", text: "BFS explores nodes in increasing distance from the source, so the first time it reaches the target it has used the fewest edges — the shortest path in an unweighted graph. O(V + E)." },
      { id: "dfs-finds-shortest", text: "DFS visits nodes in increasing distance order, so it finds shortest paths too.", contradictory: true },
      { id: "needs-weights", text: "You must have edge weights to compute a shortest path here.", contradictory: true },
    ],
    acceptableApproachIds: ["bfs"],
    modelExplanation:
      "BFS — it visits nodes in increasing distance order, so the first time it reaches the target is the shortest path. O(V + E). DFS does not visit in distance order.",
  },
  "lesson:min-max-tracking:min-choose-1": {
    scenario:
      "You need the maximum within every sliding window of size k over an array, in O(n) total. You must decide whether a min/max stack suffices or something else is required.",
    approaches: [
      { id: "monotonic-deque", label: "A monotonic double-ended queue (deque)", requiredReasonIds: ["drop-both-ends"] },
      { id: "minmax-stack", label: "A plain min/max stack", requiredReasonIds: [], rejectionFeedback: "A stack only grows/shrinks at one end, so it cannot evict elements that fall out of the window's FRONT; you need to remove from both ends." },
    ],
    reasons: [
      { id: "drop-both-ends", text: "A monotonic deque drops out-of-window elements from the front and dominated elements from the back, so each element is pushed and popped once — O(n) total for sliding-window maximum." },
      { id: "stack-handles-window", text: "A single-ended stack can evict elements leaving the window front, so it is enough.", contradictory: true },
      { id: "needs-sorting", text: "You must sort each window to find its maximum.", contradictory: true },
    ],
    acceptableApproachIds: ["monotonic-deque"],
    modelExplanation:
      "You need a monotonic DEQUE (double-ended), not a plain stack: it drops out-of-window and dominated elements from both ends, giving O(n) total for sliding-window maximum.",
  },
  "lesson:maps-sets:ms-choose-1": {
    scenario:
      "You must check membership against a FIXED collection millions of times. You compare a list, a sorted list with binary search, and a set.",
    approaches: [
      { id: "set", label: "A set", requiredReasonIds: ["o1-membership"] },
      { id: "list", label: "A plain list with the `in` operator", requiredReasonIds: [], rejectionFeedback: "Membership in a list is O(n) per check — millions of checks make this far too slow." },
      { id: "sorted-binary", label: "A sorted list with binary search", requiredReasonIds: [], rejectionFeedback: "Binary search is O(log n) per check — better than a list but still beaten by the set's expected O(1) for pure membership." },
    ],
    reasons: [
      { id: "o1-membership", text: "A set hashes each element, so membership is expected O(1) per check regardless of size — ideal when the only operation is 'is x present?' done millions of times." },
      { id: "binary-logn-ordered", text: "A sorted list with binary search answers membership in O(log n) and additionally supports ordered queries like ranges and predecessors that a set cannot." },
      { id: "list-is-constant", text: "Membership in a plain list is O(1).", contradictory: true },
      { id: "set-is-logn", text: "A set answers membership in O(log n), the same as binary search.", contradictory: true },
    ],
    acceptableApproachIds: ["set"],
    alternatives: [
      { approachId: "sorted-binary", conditions: "When you also need ordered operations like range or predecessor queries, not just membership.", tradeoff: "O(log n) per membership check versus the set's expected O(1), in exchange for order.", requiredReasonIds: ["binary-logn-ordered"] },
    ],
    modelExplanation:
      "A set — expected O(1) membership. A list is O(n) per check; a sorted list + binary search is O(log n). For pure membership, the set wins.",
  },
  "lesson:hashing-frequency:hf-choose-1": {
    scenario:
      "You must find the 'majority element' of an array — the value appearing more than n/2 times. You consider a frequency map (Counter).",
    approaches: [
      { id: "counter", label: "Build a Counter and check the most common value's count", requiredReasonIds: ["count-then-check-half"] },
      { id: "boyer-moore", label: "Boyer–Moore voting algorithm", requiredReasonIds: ["voting-constant-space"] },
      { id: "sort-middle", label: "Sort and look only at the middle element without verifying", requiredReasonIds: [], rejectionFeedback: "Sorting to the median is a known trick, but it is O(n log n) and, taken without a count, it can report a value that isn't actually a strict majority." },
    ],
    reasons: [
      { id: "count-then-check-half", text: "A Counter tallies every value in O(n); the most_common(1) entry is the majority exactly when its count exceeds n/2 — O(n) time, O(k) space." },
      { id: "voting-constant-space", text: "Boyer–Moore voting keeps a single candidate and a counter, finding the majority in O(n) time and O(1) space when one is guaranteed to exist." },
      { id: "no-count-needed", text: "You can identify the majority without counting any occurrences.", contradictory: true },
      { id: "counter-is-quadratic", text: "Building a Counter over the array is O(n²).", contradictory: true },
    ],
    acceptableApproachIds: ["counter"],
    alternatives: [
      { approachId: "boyer-moore", conditions: "When O(1) extra space is required and a majority is guaranteed to exist.", tradeoff: "Boyer–Moore voting uses O(1) space instead of the Counter's O(k), at the cost of being less obvious.", requiredReasonIds: ["voting-constant-space"] },
    ],
    modelExplanation:
      "Build a Counter in O(n), then take most_common(1); if its count > n/2 it's the majority. O(n) time, O(k) space. (Boyer–Moore voting does it in O(1) space.)",
  },
  "lesson:duplicate-detection:dup-choose-1": {
    scenario:
      "You must detect duplicates but cannot use extra memory, and you ARE allowed to reorder the data.",
    approaches: [
      { id: "sort-scan", label: "Sort in place, then scan for equal adjacent elements", requiredReasonIds: ["sort-brings-equal-adjacent"] },
      { id: "hash-set", label: "Track seen values in a hash set", requiredReasonIds: [], rejectionFeedback: "A set is O(n) time but needs O(n) extra memory, which the no-extra-memory constraint forbids." },
    ],
    reasons: [
      { id: "sort-brings-equal-adjacent", text: "Sorting puts equal values next to each other, so a single adjacent scan finds any duplicate; in-place sorting adds no extra memory, trading the set's O(n) space for O(n log n) time." },
      { id: "sort-needs-extra-space", text: "Sorting always requires O(n) extra memory, so it violates the constraint too.", contradictory: true },
      { id: "set-is-constant-space", text: "A hash set uses only O(1) extra memory.", contradictory: true },
    ],
    acceptableApproachIds: ["sort-scan"],
    modelExplanation:
      "Sort the array (O(n log n), O(1) extra if in-place) and scan for equal adjacent elements. This trades the set's O(n) space for O(n log n) time.",
  },
  "lesson:value-to-index:vti-choose-1": {
    scenario:
      "For Two Sum, a hash map gives O(n) time and O(n) space. You consider instead sorting the array and using converging two pointers.",
    approaches: [
      { id: "hash-map", label: "Hash map of complements (returns original indices)", requiredReasonIds: ["need-original-indices"] },
      { id: "sort-two-pointers", label: "Sort, then converging two pointers", requiredReasonIds: ["dont-need-indices-save-space"] },
    ],
    reasons: [
      { id: "need-original-indices", text: "A hash map runs in O(n) time and reports the values' original positions, which is required when the answer must be the original indices." },
      { id: "dont-need-indices-save-space", text: "When you don't need original indices and want O(1) extra space, sorting then two pointers works in O(n log n) time with constant extra space." },
      { id: "sorting-keeps-indices", text: "Sorting preserves each element's original index, so you can still report original positions.", contradictory: true },
      { id: "hashmap-constant-space", text: "The hash-map approach uses O(1) extra space.", contradictory: true },
    ],
    acceptableApproachIds: ["hash-map"],
    alternatives: [
      { approachId: "sort-two-pointers", conditions: "When you don't need the original indices and want O(1) extra space.", tradeoff: "O(n log n) time (vs O(n)) and sorting scrambles indices, so it's worse when original positions are required.", requiredReasonIds: ["dont-need-indices-save-space"] },
    ],
    modelExplanation:
      "With a hash map Two Sum is O(n)/O(n) and keeps original indices. Sort + two pointers is O(n log n) with O(1) space but scrambles indices, so it's worse when the answer must be original positions.",
  },
  "lesson:grouping:grp-choose-1": {
    scenario:
      "You must group anagrams over a fixed lowercase alphabet. Using the sorted string as a group key costs O(n·L log L). You want a cheaper key.",
    approaches: [
      { id: "count-tuple-key", label: "Use a 26-length letter-count tuple as the key", requiredReasonIds: ["count-key-no-sort"] },
      { id: "sorted-string-key", label: "Use the sorted characters as the key", requiredReasonIds: [], rejectionFeedback: "Sorting each word is O(L log L) per word, giving O(n·L log L); counting over the fixed alphabet is only O(L) per word." },
    ],
    reasons: [
      { id: "count-key-no-sort", text: "A 26-slot count of each letter is a canonical anagram signature computed in O(L) without sorting, so grouping all words is O(n·L)." },
      { id: "sorting-is-linear", text: "Sorting a word's characters is O(L), the same as counting them.", contradictory: true },
      { id: "counts-not-canonical", text: "Two anagrams can have different letter counts, so a count tuple is not a reliable key.", contradictory: true },
    ],
    acceptableApproachIds: ["count-tuple-key"],
    modelExplanation:
      "A 26-length count tuple (how many of each letter) as the key is computed in O(L) without sorting, giving O(n·L) total — below O(n·L log L).",
  },
  "lesson:caching-seen:cache-choose-1": {
    scenario:
      "You must decide when memoization will help a recursive algorithm, and describe the resulting complexity relationship.",
    approaches: [
      { id: "overlapping-subproblems", label: "Apply memoization when subproblems OVERLAP (recur with the same inputs)", requiredReasonIds: ["distinct-subproblems-once"] },
      { id: "memoize-always", label: "Memoize every recursion regardless of structure", requiredReasonIds: [], rejectionFeedback: "If subproblems never repeat (e.g. plain divide-and-conquer on disjoint halves), a cache only adds overhead and memory — memoization helps only when the same inputs recur." },
    ],
    reasons: [
      { id: "distinct-subproblems-once", text: "Overlapping subproblems mean the same inputs recur; caching each one makes total time proportional to the number of DISTINCT subproblems (each solved once) plus O(1) reuse, replacing exponential recomputation." },
      { id: "always-helps", text: "Memoization speeds up every recursive algorithm, even when subproblems never repeat.", contradictory: true },
      { id: "no-repeats-needed", text: "Memoization helps precisely when subproblems are all distinct and never recur.", contradictory: true },
    ],
    acceptableApproachIds: ["overlapping-subproblems"],
    modelExplanation:
      "Overlapping subproblems are the signal: the same inputs recur. Memoization then makes total time proportional to the number of DISTINCT subproblems (each solved once) plus O(1) per reuse, replacing exponential recomputation.",
  },
  "lesson:bit-logical-ops:bit-log-choose-1": {
    scenario:
      "You pack several on/off feature flags into one integer. You must choose which bitwise operators SET a flag and TEST a flag.",
    approaches: [
      { id: "or-set-and-test", label: "OR (|) with the flag's bit to set it; AND (&) with the flag's bit to test it", requiredReasonIds: ["or-sets-and-tests"] },
      { id: "xor-set-and-test", label: "XOR (^) to set and XOR (^) to test", requiredReasonIds: [], rejectionFeedback: "XOR TOGGLES a bit rather than setting it, so applying it twice clears the flag — it doesn't reliably set, and it doesn't isolate a bit for testing." },
    ],
    reasons: [
      { id: "or-sets-and-tests", text: "ORing with the flag's bit forces that bit to 1 (set) while leaving others untouched, and ANDing with the flag's bit isolates it — a non-zero result means the flag is set." },
      { id: "and-sets-or-tests", text: "AND sets a flag and OR tests it.", contradictory: true },
      { id: "xor-sets", text: "XOR with the bit reliably sets the flag no matter its current value.", contradictory: true },
    ],
    acceptableApproachIds: ["or-set-and-test"],
    modelExplanation:
      "Use OR (|) with the flag's bit to set it, and AND (&) with the flag's bit to test it (non-zero means set).",
  },
});


Object.assign(EXERCISE_RECOGNITION, {
  "lesson:xor-cancellation:xor-choose-1": {
    scenario:
      "Every number in an array appears exactly twice except one, which appears once. You must find that single number and care about memory.",
    approaches: [
      { id: "xor-fold", label: "XOR-fold every element into one accumulator", requiredReasonIds: ["xor-pairs-cancel"] },
      { id: "hash-set", label: "Count with a hash set / frequency map", requiredReasonIds: [], rejectionFeedback: "This works in O(n) time but stores the seen values, so it uses O(n) extra space — worse on memory than XOR's single accumulator." },
    ],
    reasons: [
      { id: "xor-pairs-cancel", text: "a ^ a == 0 and x ^ 0 == x, so XORing everything cancels the paired values and leaves only the unique one — O(n) time, O(1) space." },
      { id: "xor-needs-on-space", text: "XOR-folding must store every value it has seen, so it uses O(n) space just like the hash set.", contradictory: true },
      { id: "needs-sorting-first", text: "The array must be sorted before XOR can cancel the pairs.", contradictory: true },
    ],
    acceptableApproachIds: ["xor-fold"],
    modelExplanation:
      "Both are O(n) time, but XOR-folding is O(1) space (a single accumulator) while the hash-set count is O(n) space. XOR wins on memory.",
  },
  "lesson:count-set-bits:csb-choose-1": {
    scenario:
      "You must count the set bits of a 64-bit integer that has only a couple of bits set, and want the fewest iterations.",
    approaches: [
      { id: "kernighan", label: "Kernighan's trick (n &= n - 1 per set bit)", requiredReasonIds: ["loops-per-set-bit"] },
      { id: "check-every-bit", label: "Test every one of the 64 bit positions", requiredReasonIds: [], rejectionFeedback: "Checking every position always does w=64 iterations regardless of how many bits are set, so it is slower than Kernighan on sparse numbers." },
    ],
    reasons: [
      { id: "loops-per-set-bit", text: "n &= n - 1 clears exactly the lowest set bit each iteration, so the loop runs once per set bit — O(s) = O(2) here, not O(w)." },
      { id: "kernighan-loops-w", text: "Kernighan's trick still iterates once for every bit width (64 times) no matter how few bits are set.", contradictory: true },
      { id: "both-same-cost", text: "Both methods always perform the same number of iterations.", contradictory: true },
    ],
    acceptableApproachIds: ["kernighan"],
    modelExplanation:
      "Kernighan does 2 iterations (O(s) = O(2)); checking every bit does 64 (O(w) = O(64)). Kernighan is far better for sparse numbers.",
  },
  "lesson:min-max-heaps:heap-choose-1": {
    scenario:
      "You repeatedly insert numbers and must always be able to fetch the current minimum, interleaving many inserts and extractions.",
    approaches: [
      { id: "heap", label: "A min-heap", requiredReasonIds: ["heap-log-ops"] },
      { id: "sorted-list", label: "A list kept sorted on every insert", requiredReasonIds: [], rejectionFeedback: "A sorted list gives O(1) min but every insertion is O(n) to keep order, so a stream of inserts makes it too slow." },
    ],
    reasons: [
      { id: "heap-log-ops", text: "A heap does insert and extract-min in O(log n) and peek-min in O(1), which balances the interleaved inserts and extractions far better than O(n) insertion." },
      { id: "heap-sorted-fully", text: "A heap keeps all elements fully sorted, so you can read any rank in O(1).", contradictory: true },
      { id: "sorted-list-fast-insert", text: "A sorted list inserts in O(1), so it beats the heap for frequent inserts.", contradictory: true },
    ],
    acceptableApproachIds: ["heap"],
    modelExplanation:
      "A heap: insert O(log n) and extract-min O(log n), peek O(1). A sorted list gives O(1) min but O(n) insertion, so the heap wins when inserts and extractions interleave.",
  },
  "lesson:heap-sift:sift-choose-1": {
    scenario:
      "You removed the min from a heap and moved the last element into the root slot. You must restore the heap property in O(log n).",
    approaches: [
      { id: "sift-down-smaller-child", label: "Sift the root DOWN, swapping with the SMALLER child", requiredReasonIds: ["root-sinks-to-smaller"] },
      { id: "sift-up", label: "Sift the root UP toward the parent", requiredReasonIds: [], rejectionFeedback: "The root has no parent to rise to, so sifting up does nothing — the out-of-place element is at the top and must sink downward." },
      { id: "sift-down-larger-child", label: "Sift DOWN but swap with the LARGER child", requiredReasonIds: [], rejectionFeedback: "In a min-heap the parent must be <= both children; swapping with the larger child can leave the smaller child above its parent, breaking the heap." },
    ],
    reasons: [
      { id: "root-sinks-to-smaller", text: "In a min-heap each parent must be <= its children, so the misplaced root sinks by swapping with the smaller of children 2i+1 and 2i+2 while it is larger — O(log n)." },
      { id: "root-has-parent", text: "The root has a parent, so sifting it up restores the heap.", contradictory: true },
      { id: "swap-larger-correct", text: "Swapping with the larger child is correct for a min-heap.", contradictory: true },
    ],
    acceptableApproachIds: ["sift-down-smaller-child"],
    modelExplanation:
      "Sift DOWN, comparing the root with the SMALLER of its two in-range children (2i+1, 2i+2) and swapping while it is larger. Sifting up is wrong because the root has no parent to rise to.",
  },
  "lesson:merge-sorted-data:merge-choose-1": {
    scenario:
      "You have 1000 already-sorted files, too large to all fit in memory, and must produce one sorted output stream.",
    approaches: [
      { id: "kway-heap", label: "Heap-based k-way merge of the file fronts", requiredReasonIds: ["heap-front-elements"] },
      { id: "concat-sort", label: "Concatenate every file and sort the whole thing", requiredReasonIds: [], rejectionFeedback: "Concatenate-and-sort must hold all N items in memory (O(N) space) and is O(N log N) — but the data does not fit in memory, so it is infeasible here." },
    ],
    reasons: [
      { id: "heap-front-elements", text: "A min-heap holding only the k=1000 current front elements picks the global next value in O(log k) and streams output lazily, needing just O(k) memory." },
      { id: "concat-is-cheaper", text: "Concatenating and sorting uses less memory than a k-way merge because it reads each file only once.", contradictory: true },
      { id: "merge-needs-all-memory", text: "The k-way merge must load all N items into memory before it can emit anything.", contradictory: true },
    ],
    acceptableApproachIds: ["kway-heap"],
    modelExplanation:
      "Heap-based k-way merge keeps only k front elements in memory (O(k) space) and streams output in O(N log k). Concatenate-and-sort needs all N items in memory and is O(N log N).",
  },
  "lesson:tree-bfs:bfs-choose-1": {
    scenario:
      "You must report, for each depth of a binary tree, the value of its rightmost node (the 'right side view').",
    approaches: [
      { id: "level-bfs", label: "Level-order BFS, taking the last node of each level", requiredReasonIds: ["per-level-natural"] },
      { id: "depth-dfs", label: "Depth-tracking DFS visiting the right child first", requiredReasonIds: ["dfs-depth-right-first"] },
      { id: "inorder-dfs", label: "Plain inorder DFS collecting values in order", requiredReasonIds: [], rejectionFeedback: "Inorder traversal visits nodes left-to-right across the whole tree without tracking depth, so it cannot pick out the rightmost node at each level." },
    ],
    reasons: [
      { id: "per-level-natural", text: "The answer is defined per depth, and BFS processes the tree one full level at a time, so the last node dequeued on each level is exactly the rightmost at that depth." },
      { id: "dfs-depth-right-first", text: "A DFS that records a node the first time it reaches a new depth, visiting the right child before the left, captures each level's rightmost node in O(n)." },
      { id: "sides-irrelevant-depth", text: "The problem does not depend on depth, so any traversal order gives the same answer.", contradictory: true },
      { id: "bfs-no-levels", text: "BFS cannot tell which level a node is on, so it is unsuitable here.", contradictory: true },
    ],
    acceptableApproachIds: ["level-bfs"],
    alternatives: [
      { approachId: "depth-dfs", conditions: "A DFS that tracks the current depth and visits the right child first.", tradeoff: "Equally O(n) but the per-level framing is less direct than BFS's natural level order.", requiredReasonIds: ["dfs-depth-right-first"] },
    ],
    modelExplanation:
      "BFS by levels is the intuitive fit: process each level and take its last node. A depth-tracking DFS that visits the right child first also works.",
  },
  "lesson:tree-traversals:trav-choose-1": {
    scenario:
      "You must pick traversal orders for three tasks: (a) print a BST's values sorted, (b) serialize so each parent is recorded before its children, (c) free every node without losing a reference.",
    approaches: [
      { id: "in-pre-post", label: "Inorder for (a), preorder for (b), postorder for (c)", requiredReasonIds: ["order-matches-task"] },
      { id: "all-preorder", label: "Use preorder for all three", requiredReasonIds: [], rejectionFeedback: "Preorder does not emit a BST's values in sorted order (that needs inorder) and frees a parent before its children (postorder is required for safe deletion)." },
    ],
    reasons: [
      { id: "order-matches-task", text: "Inorder visits left-node-right so a BST comes out sorted; preorder records a node before its subtrees; postorder frees both children before the parent, so no reference is lost." },
      { id: "any-order-works", text: "All three traversal orders produce identical results for these tasks.", contradictory: true },
      { id: "postorder-sorts-bst", text: "Postorder is what prints a BST's values in sorted order.", contradictory: true },
    ],
    acceptableApproachIds: ["in-pre-post"],
    modelExplanation:
      "(a) inorder — sorted BST output; (b) preorder — node before children; (c) postorder — free children before the parent so no reference is lost.",
  },
  "lesson:bst-operations:bst-choose-1": {
    scenario:
      "You need ordered operations (range queries, floor/ceil) AND guaranteed fast lookup on data that keeps changing.",
    approaches: [
      { id: "balanced-bst", label: "A self-balancing BST (AVL / red-black)", requiredReasonIds: ["balanced-ordered-and-fast"] },
      { id: "plain-bst", label: "A plain (unbalanced) BST", requiredReasonIds: [], rejectionFeedback: "A plain BST supports ordered queries but can degrade to an O(n)-height chain on bad insert orders, losing the guaranteed fast lookup." },
      { id: "hash-map", label: "A hash map", requiredReasonIds: [], rejectionFeedback: "A hash map gives expected O(1) lookup but stores no order, so it cannot answer range or floor/ceil queries." },
    ],
    reasons: [
      { id: "balanced-ordered-and-fast", text: "A balanced BST keeps height O(log n), guaranteeing O(log n) search/insert/delete while its in-order structure answers range and floor/ceil queries." },
      { id: "hashmap-does-ranges", text: "A hash map answers range and floor/ceil queries efficiently.", contradictory: true },
      { id: "plain-bst-always-logn", text: "A plain BST always has O(log n) height regardless of insertion order.", contradictory: true },
    ],
    acceptableApproachIds: ["balanced-bst"],
    modelExplanation:
      "A balanced BST (AVL/red-black) gives guaranteed O(log n) search/insert/delete AND ordered queries. A plain BST risks O(n) if unbalanced; a hash map is expected O(1) but supports no order/range queries.",
  },
  "lesson:lowest-common-ancestor:lca-choose-1": {
    scenario:
      "You must find the lowest common ancestor of two nodes in a plain binary tree that has NO BST ordering.",
    approaches: [
      { id: "recursive-dfs", label: "Recursive DFS returning where p and q are found", requiredReasonIds: ["no-order-cant-prune"] },
      { id: "bst-value-walk", label: "Walk down comparing node values to decide direction (BST LCA)", requiredReasonIds: [], rejectionFeedback: "Comparing values to pick a direction only works when the tree is a BST; a plain tree has no ordering to steer the walk, so this gives wrong answers." },
    ],
    reasons: [
      { id: "no-order-cant-prune", text: "Without ordering you cannot prune a side, so a DFS searches both subtrees and returns the node where p and q surface from different sides — O(n) time, O(h) stack." },
      { id: "order-lets-prune", text: "The tree's ordering lets you discard one subtree at each node, giving O(log n).", contradictory: true },
      { id: "lca-needs-parent-pointers", text: "Finding the LCA is impossible without parent pointers on every node.", contradictory: true },
    ],
    acceptableApproachIds: ["recursive-dfs"],
    modelExplanation:
      "Use a recursive DFS: return a node if it equals p or q, or if p and q are found in different subtrees. It is O(n) time and O(h) stack space, since without ordering you cannot prune.",
  },
  "lesson:tree-construction:build-choose-1": {
    scenario:
      "You have sorted data and want a BST that supports O(log n) search. You must decide how to build it.",
    approaches: [
      { id: "build-from-middle", label: "Recursively build from the middle element (divide and conquer)", requiredReasonIds: ["middle-balances-height"] },
      { id: "insert-one-by-one", label: "Insert the values one at a time in sorted order", requiredReasonIds: [], rejectionFeedback: "Inserting already-sorted values one-by-one always appends to the same side, producing a degenerate O(n)-height chain that gives O(n) search." },
    ],
    reasons: [
      { id: "middle-balances-height", text: "Choosing the middle as the root and recursing on each half splits the keys evenly, directly producing a balanced O(log n)-height tree." },
      { id: "sorted-insert-balances", text: "Inserting sorted values one-by-one naturally produces a balanced tree.", contradictory: true },
      { id: "shape-irrelevant", text: "The tree's shape does not affect search time, so either method is fine.", contradictory: true },
    ],
    acceptableApproachIds: ["build-from-middle"],
    modelExplanation:
      "Build from the middle (divide and conquer): it produces a balanced O(log n)-height tree directly. Inserting sorted values one-by-one yields a degenerate O(n)-height tree.",
  },
  "lesson:trie-insertion:trie-choose-1": {
    scenario:
      "You only need exact-word membership on a dictionary. A hash set and a trie are both roughly O(L) per word, and you must choose.",
    approaches: [
      { id: "hash-set", label: "A hash set of the words", requiredReasonIds: ["set-simpler-for-exact"] },
      { id: "trie-for-exact-only", label: "A trie, justified by faster exact lookup", requiredReasonIds: [], rejectionFeedback: "A trie is not faster than a hash set for exact membership; its real advantage is prefix queries, not plain lookup, so 'faster exact lookup' is the wrong justification." },
    ],
    reasons: [
      { id: "set-simpler-for-exact", text: "For exact membership alone a hash set is simpler and lower-overhead, since the trie's edge-walking buys nothing when you never ask about prefixes." },
      { id: "set-does-prefixes", text: "A hash set efficiently enumerates all words sharing a given prefix.", contradictory: true },
      { id: "trie-faster-exact", text: "A trie answers exact membership asymptotically faster than a hash set.", contradictory: true },
    ],
    acceptableApproachIds: ["hash-set"],
    modelExplanation:
      "For exact membership alone, a hash set is simpler and lower-overhead. The trie's advantage is prefix queries — enumerating or counting words that start with a prefix — which a hash set cannot do efficiently.",
  },
  "lesson:prefix-search:prefix-choose-1": {
    scenario:
      "You are building autocomplete over a large dictionary and must support fast prefix lookups and suggestion listing.",
    approaches: [
      { id: "trie", label: "A trie", requiredReasonIds: ["trie-prefix-queries"] },
      { id: "hash-set", label: "A hash set of words", requiredReasonIds: [], rejectionFeedback: "A hash set only answers exact membership; it cannot efficiently find all words sharing a prefix, which is exactly what autocomplete needs." },
    ],
    reasons: [
      { id: "trie-prefix-queries", text: "A trie reaches a prefix node in O(P) and then walks its subtree to collect matches in O(P + S) — prefix queries a hash set cannot do." },
      { id: "set-prefix-cheap", text: "A hash set finds all words with a given prefix in O(P) just like a trie.", contradictory: true },
      { id: "trie-exact-faster", text: "The reason to pick a trie is that exact membership is faster than a hash set.", contradictory: true },
    ],
    acceptableApproachIds: ["trie"],
    modelExplanation:
      "A trie supports prefix queries a hash set can't. Checking a prefix exists is O(P); listing suggestions is O(P + S) — reaching the prefix node then walking its subtree to collect the matching words.",
  },
  "lesson:word-search:ws-choose-1": {
    scenario:
      "You must search a character grid for MANY words at once, deciding whether to search each word separately or share work across them.",
    approaches: [
      { id: "trie-guided-dfs", label: "Build a trie of all words and run one trie-guided DFS", requiredReasonIds: ["shared-prefix-once"] },
      { id: "repeated-single-dfs", label: "Run a separate single-word DFS for each word", requiredReasonIds: [], rejectionFeedback: "Searching each word independently re-explores the same grid paths once per word (O(m·n·3^L) each), wasting the work shared by common prefixes." },
    ],
    reasons: [
      { id: "shared-prefix-once", text: "A trie lets one DFS follow all words simultaneously, so a prefix shared by many words is explored just once instead of per word." },
      { id: "words-no-shared-prefixes", text: "The words share no prefixes, so a trie saves nothing over separate searches.", contradictory: true },
      { id: "trie-slower-per-word", text: "A trie-guided DFS is slower than repeating single-word DFS because the trie adds overhead.", contradictory: true },
    ],
    acceptableApproachIds: ["trie-guided-dfs"],
    modelExplanation:
      "Build a trie of all the words and run one DFS (Word Search II): walk the grid guided by the trie so shared prefixes are explored once, instead of paying O(m·n·3^L) separately per word.",
  },
  "lesson:avl-rotations:avl-choose-1": {
    scenario:
      "You will insert 1, 2, 3, ..., n in increasing order and need the resulting structure to still give fast search.",
    approaches: [
      { id: "avl-tree", label: "An AVL (self-balancing) tree", requiredReasonIds: ["rotations-keep-logn"] },
      { id: "plain-bst", label: "A plain BST", requiredReasonIds: [], rejectionFeedback: "Inserting a sorted sequence into a plain BST appends to the same side every time, producing a height-n chain and O(n) search — the worst case." },
    ],
    reasons: [
      { id: "rotations-keep-logn", text: "AVL rebalances with rotations after each insert, keeping height O(log n) even for sorted input, so search stays O(log n)." },
      { id: "plain-bst-balances-sorted", text: "A plain BST stays balanced on sorted input, giving O(log n) height.", contradictory: true },
      { id: "avl-degenerates", text: "AVL insertion of sorted values produces an O(n)-height chain just like a plain BST.", contradictory: true },
    ],
    acceptableApproachIds: ["avl-tree"],
    modelExplanation:
      "Plain BST: a degenerate chain of height n → O(n) search. AVL: rotations keep height O(log n) → O(log n) search. AVL's self-balancing prevents the sorted-insert worst case.",
  },
  "lesson:graph-representations:grep-choose-1": {
    scenario:
      "On a small, dense graph you frequently ask 'is there an edge between u and v?' and want that check as fast as possible.",
    approaches: [
      { id: "adjacency-matrix", label: "An adjacency matrix", requiredReasonIds: ["matrix-o1-edge-check"] },
      { id: "adjacency-list", label: "An adjacency list", requiredReasonIds: [], rejectionFeedback: "An adjacency list must scan u's neighbour list for v, which is O(degree) per check — slower than the constant-time lookup an edge query here wants." },
    ],
    reasons: [
      { id: "matrix-o1-edge-check", text: "mat[u][v] answers the edge query in O(1), and the graph being small/dense makes the O(V^2) matrix storage affordable." },
      { id: "list-o1-edge-check", text: "An adjacency list answers 'is u–v an edge?' in O(1).", contradictory: true },
      { id: "matrix-wastes-on-dense", text: "A matrix is wasteful specifically on dense graphs, so it is the wrong choice here.", contradictory: true },
    ],
    acceptableApproachIds: ["adjacency-matrix"],
    modelExplanation:
      "A matrix gives O(1) edge lookup (mat[u][v]), affordable because the graph is small/dense. An adjacency list needs O(degree) to scan u's neighbours for v.",
  },
  "lesson:adjacency-lists:adj-choose-1": {
    scenario:
      "A traversal visits every neighbour of every vertex. You must state why its total cost is O(V + E) and not simply O(V) times the average degree.",
    approaches: [
      { id: "sum-of-degrees", label: "Count via the sum of all degrees = 2E", requiredReasonIds: ["degrees-sum-to-edges"] },
      { id: "v-times-maxdegree", label: "Multiply V by the maximum degree", requiredReasonIds: [], rejectionFeedback: "Multiplying V by the max degree over-counts: most vertices have far fewer neighbours, so this gives a loose bound, not the tight O(V + E)." },
    ],
    reasons: [
      { id: "degrees-sum-to-edges", text: "Summing degrees over all vertices counts each edge from both endpoints, totalling 2E; adding O(V) to touch each vertex gives the exact O(V + E)." },
      { id: "neighbour-work-is-v2", text: "Visiting all neighbours is inherently O(V^2) regardless of how many edges exist.", contradictory: true },
      { id: "edges-dont-matter", text: "The number of edges does not affect the traversal cost.", contradictory: true },
    ],
    acceptableApproachIds: ["sum-of-degrees"],
    modelExplanation:
      "The sum of all degrees equals 2E, so neighbour visits total O(E); adding O(V) to touch each vertex gives O(V + E). V·(avg degree) is the same quantity (it equals O(E)), but O(V + E) is the standard exact form.",
  },
  "lesson:graph-bfs:gbfs-choose-1": {
    scenario:
      "You need the fewest number of edges on a path from A to B in an UNWEIGHTED graph.",
    approaches: [
      { id: "bfs", label: "Breadth-first search", requiredReasonIds: ["bfs-distance-order"] },
      { id: "dfs", label: "Depth-first search", requiredReasonIds: [], rejectionFeedback: "DFS plunges down one path and does not visit vertices in distance order, so the first time it reaches B need not be via the fewest edges." },
    ],
    reasons: [
      { id: "bfs-distance-order", text: "BFS expands vertices in increasing distance from A, so the first time it dequeues B it has arrived by a fewest-edge path — O(V + E)." },
      { id: "dfs-finds-shortest", text: "DFS visits vertices in order of distance, so its first arrival at B is shortest.", contradictory: true },
      { id: "needs-dijkstra-unweighted", text: "An unweighted shortest path requires Dijkstra with a priority queue.", contradictory: true },
    ],
    acceptableApproachIds: ["bfs"],
    modelExplanation:
      "BFS visits vertices in increasing distance, so the first time it reaches B is via a shortest (fewest-edge) path. O(V + E). DFS does not visit in distance order.",
  },
  "lesson:graph-dfs:gdfs-choose-1": {
    scenario:
      "You must detect whether a graph contains a cycle, and decide which traversal is the natural fit.",
    approaches: [
      { id: "dfs", label: "Depth-first search", requiredReasonIds: ["dfs-follows-paths"] },
      { id: "bfs-levels", label: "BFS justified by level processing", requiredReasonIds: [], rejectionFeedback: "Cycle detection is about revisiting a vertex along the current path, not about level order; BFS's level-by-level framing is not what naturally reveals a cycle." },
    ],
    reasons: [
      { id: "dfs-follows-paths", text: "DFS follows a path as deep as it can, so meeting an already-visited vertex that is not the immediate parent (undirected) or one on the recursion stack (directed) exposes a cycle — O(V + E)." },
      { id: "cycle-needs-distance", text: "Detecting a cycle requires visiting vertices in distance order, which is BFS's job.", contradictory: true },
      { id: "cycles-undetectable-traversal", text: "No traversal can detect a cycle; you must count edges versus vertices.", contradictory: true },
    ],
    acceptableApproachIds: ["dfs"],
    modelExplanation:
      "DFS naturally follows paths, so encountering an already-visited vertex that is not the immediate parent (undirected) or a vertex on the current recursion stack (directed) reveals a cycle. It's O(V + E).",
  },
  "lesson:connected-components:cc-choose-1": {
    scenario:
      "Edges arrive one at a time and after each addition you must report the current number of connected components.",
    approaches: [
      { id: "union-find", label: "Union-find (disjoint set union)", requiredReasonIds: ["union-incremental"] },
      { id: "retraverse", label: "Re-run a full BFS/DFS after each edge", requiredReasonIds: [], rejectionFeedback: "Re-traversing the whole graph after every edge is O(V + E) per query, so a stream of edges makes it far too slow." },
    ],
    reasons: [
      { id: "union-incremental", text: "Each new edge is a single union in near-O(α) time, and the component count simply drops by one on each merge — ideal for an incremental edge stream." },
      { id: "traverse-cheaper-stream", text: "Re-running a full traversal per edge is cheaper than union-find for a stream of edges.", contradictory: true },
      { id: "union-cant-count", text: "Union-find cannot report the number of components.", contradictory: true },
    ],
    acceptableApproachIds: ["union-find"],
    modelExplanation:
      "Union-find: each edge union is near O(α), so it handles incremental edges without re-traversing. Repeated full traversals would be O(V + E) per query — far slower for a stream of edges.",
  },
  "lesson:graph-cycle-detection:cyc-choose-1": {
    scenario:
      "You must detect a cycle in a DIRECTED graph and explain why the undirected 'visited and not the parent' rule does not transfer.",
    approaches: [
      { id: "back-edge-recstack", label: "Detect a back edge to a vertex on the recursion stack (in-progress set)", requiredReasonIds: ["recstack-is-cycle"] },
      { id: "visited-not-parent", label: "Reuse the undirected visited-and-not-parent rule", requiredReasonIds: [], rejectionFeedback: "In a directed graph a visited vertex may already be finished and off the current path, so reaching it is not a cycle — the parent rule misfires." },
    ],
    reasons: [
      { id: "recstack-is-cycle", text: "A cycle exists only when DFS reaches a neighbour still on the current recursion stack (in-progress); a finished vertex off the path is not a cycle." },
      { id: "parent-rule-works-directed", text: "The undirected visited-and-not-parent rule works unchanged on directed graphs.", contradictory: true },
      { id: "any-visited-is-cycle", text: "In a directed graph, revisiting any already-visited vertex means there is a cycle.", contradictory: true },
    ],
    acceptableApproachIds: ["back-edge-recstack"],
    modelExplanation:
      "In a directed graph a visited vertex might be finished (off the current path), so reaching it isn't a cycle. The correct rule detects a BACK EDGE: a neighbour currently on the recursion stack (in-progress set).",
  },
  "lesson:multi-source-bfs:msbfs-choose-1": {
    scenario:
      "In a grid every empty cell must learn its distance to the NEAREST of several gates.",
    approaches: [
      { id: "multi-source-bfs", label: "Multi-source BFS seeding all gates at distance 0", requiredReasonIds: ["seed-all-sources"] },
      { id: "bfs-per-gate", label: "Run a separate BFS from each gate", requiredReasonIds: [], rejectionFeedback: "One BFS per gate is O(k·(V + E)) for k gates and recomputes overlapping frontiers, far slower than seeding them all at once." },
    ],
    reasons: [
      { id: "seed-all-sources", text: "Putting every gate in the queue at distance 0 lets a single BFS expand all frontiers together, so each cell is first reached by its nearest gate — O(V + E)." },
      { id: "per-gate-same-cost", text: "Running a separate BFS from each gate costs the same as one multi-source BFS.", contradictory: true },
      { id: "cant-seed-multiple", text: "BFS can only start from one source, so multiple gates must be handled one at a time.", contradictory: true },
    ],
    acceptableApproachIds: ["multi-source-bfs"],
    modelExplanation:
      "Multi-source BFS: seed all gates at distance 0 and run one BFS — O(V + E). Separate BFS per gate is O(k·(V + E)) for k gates, far slower.",
  },
  "lesson:shortest-paths-unweighted:spu-choose-1": {
    scenario:
      "You need the cheapest route in a road network where roads have DIFFERENT lengths (weights).",
    approaches: [
      { id: "dijkstra", label: "Dijkstra's algorithm with a min-heap", requiredReasonIds: ["weights-break-bfs"] },
      { id: "bfs", label: "Breadth-first search", requiredReasonIds: [], rejectionFeedback: "BFS counts edges, so it finds the fewest-edge route, which is not the lowest-cost route once edges carry different weights." },
    ],
    reasons: [
      { id: "weights-break-bfs", text: "With differing edge weights 'fewest edges' is not 'lowest cost', so you need Dijkstra (non-negative weights), which always settles the closest unsettled node via a heap — O((V+E) log V)." },
      { id: "bfs-handles-weights", text: "BFS already accounts for edge weights, so it gives the cheapest route.", contradictory: true },
      { id: "weights-dont-change-path", text: "Edge weights do not change which route is cheapest, so counting edges suffices.", contradictory: true },
    ],
    acceptableApproachIds: ["dijkstra"],
    modelExplanation:
      "Dijkstra — edges have different weights, so 'fewest edges' isn't 'lowest cost.' BFS only works for equal-weight graphs. Dijkstra (non-negative weights) uses a heap for O((V+E) log V).",
  },
  "lesson:floyd-warshall:fw-choose-1": {
    scenario:
      "You need shortest distances between ALL pairs of vertices in a small, dense graph (V ≈ 200, edges ≈ V²).",
    approaches: [
      { id: "floyd-warshall", label: "Floyd–Warshall", requiredReasonIds: ["fw-dense-allpairs"] },
      { id: "dijkstra-each-source", label: "Run Dijkstra from every source", requiredReasonIds: [], rejectionFeedback: "On a dense graph Dijkstra-from-every-source is ~O(V·(V+E) log V) ≈ O(V³ log V) — the extra log factor and heap bookkeeping make it slower and more complex than Floyd–Warshall here." },
    ],
    reasons: [
      { id: "fw-dense-allpairs", text: "Floyd–Warshall is O(V³) with tiny triple-loop code, and on a dense graph that beats the O(V³ log V) of Dijkstra-from-every-source while being far simpler." },
      { id: "fw-slower-dense", text: "Floyd–Warshall is asymptotically slower than Dijkstra-from-every-source on dense graphs.", contradictory: true },
      { id: "fw-single-source", text: "Floyd–Warshall only computes paths from a single source.", contradictory: true },
    ],
    acceptableApproachIds: ["floyd-warshall"],
    modelExplanation:
      "Floyd–Warshall: O(V³) with tiny code; on a dense graph, Dijkstra from every source is ~O(V³ log V). Floyd–Warshall avoids the log factor and is simpler for all-pairs on dense/small graphs.",
  },
  "lesson:prim:prim-choose-1": {
    scenario:
      "Both Prim and Dijkstra use a min-heap. You must say how Prim differs and what it produces.",
    approaches: [
      { id: "prim-mst", label: "Prim keys by crossing-edge weight and builds a Minimum Spanning Tree", requiredReasonIds: ["prim-keys-crossing-edge"] },
      { id: "prim-shortest-paths", label: "Prim keys by cumulative distance and builds shortest paths", requiredReasonIds: [], rejectionFeedback: "Keying by cumulative distance from a source and producing shortest paths describes Dijkstra, not Prim — that confuses the two objectives." },
    ],
    reasons: [
      { id: "prim-keys-crossing-edge", text: "Prim keys the heap by the weight of the cheapest edge crossing out of the tree, so it greedily grows a Minimum Spanning Tree; Dijkstra instead keys by distance from the source." },
      { id: "prim-same-as-dijkstra", text: "Prim and Dijkstra optimize the same objective and produce the same tree.", contradictory: true },
      { id: "prim-makes-shortest-paths", text: "Prim produces a shortest-path tree from the source.", contradictory: true },
    ],
    acceptableApproachIds: ["prim-mst"],
    modelExplanation:
      "Prim keys the heap by the crossing-edge weight (to join the tree) and produces a Minimum Spanning Tree; Dijkstra keys by cumulative distance from the source and produces shortest paths — same structure, different objective.",
  },
  "lesson:kruskal:kru-choose-1": {
    scenario:
      "You must build a minimum spanning tree of a SPARSE graph that is given to you as an edge list.",
    approaches: [
      { id: "kruskal", label: "Kruskal's algorithm", requiredReasonIds: ["kruskal-sort-edges"] },
      { id: "prim-matrix", label: "Prim's algorithm over an adjacency matrix", requiredReasonIds: [], rejectionFeedback: "A matrix-based Prim is O(V²), which wastes work on a sparse graph and ignores that the input is already an edge list suited to Kruskal." },
    ],
    reasons: [
      { id: "kruskal-sort-edges", text: "Kruskal sorts the edge list (O(E log E)) and adds each edge unless union-find reports it would form a cycle — a perfect fit for sparse graphs given as edges, with the sort dominating." },
      { id: "kruskal-no-sort", text: "Kruskal does not need to sort the edges.", contradictory: true },
      { id: "kruskal-needs-dense", text: "Kruskal is only efficient on dense graphs.", contradictory: true },
    ],
    acceptableApproachIds: ["kruskal"],
    modelExplanation:
      "Kruskal — it sorts the edge list (O(E log E)) and uses union-find for near-linear cycle checks, ideal for sparse graphs / edge-list input. Sorting the edges dominates its cost.",
  },
  "lesson:linked-list-cycle-detection:llcd-choose-1": {
    scenario:
      "You must detect a cycle in a linked list of possibly millions of nodes under tight memory limits.",
    approaches: [
      { id: "floyd-two-pointers", label: "Floyd's slow/fast two pointers", requiredReasonIds: ["floyd-o1-space"] },
      { id: "visited-set", label: "A visited set of node references", requiredReasonIds: [], rejectionFeedback: "A visited set is O(n) space to store every node seen, which may exceed the tight memory budget at millions of nodes." },
    ],
    reasons: [
      { id: "floyd-o1-space", text: "Floyd's two pointers run in O(n) time but O(1) space — a fast pointer catching a slow one inside a loop proves a cycle without storing any nodes." },
      { id: "floyd-needs-on-space", text: "Floyd's algorithm must store visited nodes, so it uses O(n) space just like the set.", contradictory: true },
      { id: "set-is-o1-space", text: "A visited set uses only O(1) space.", contradictory: true },
    ],
    acceptableApproachIds: ["floyd-two-pointers"],
    modelExplanation:
      "Floyd's algorithm: O(n) time like the set method but O(1) space, so it fits tight memory. The visited set is O(n) space, which may be too much at scale.",
  },
  "lesson:linked-list-middle:llmid-choose-1": {
    scenario:
      "Nodes arrive from a stream you can read only once, and you must report the middle node.",
    approaches: [
      { id: "slow-fast", label: "Slow/fast pointers in a single pass", requiredReasonIds: ["one-pass-middle"] },
      { id: "count-then-walk", label: "Count the length, then walk to length/2", requiredReasonIds: [], rejectionFeedback: "Counting first and then walking requires a SECOND pass over the data, which a one-read stream does not permit." },
    ],
    reasons: [
      { id: "one-pass-middle", text: "Advancing fast by two and slow by one lands slow at the middle when fast reaches the end — one pass, no length known in advance." },
      { id: "need-length-first", text: "You must know the length before you can find the middle, so a counting pass is unavoidable.", contradictory: true },
      { id: "stream-allows-rereads", text: "A read-once stream can be traversed twice, so count-then-walk is fine.", contradictory: true },
    ],
    acceptableApproachIds: ["slow-fast"],
    modelExplanation:
      "Slow/fast finds the middle in a single pass without knowing the length. Count-then-walk needs a second pass over the same data, which a one-read stream doesn't allow.",
  },
  "lesson:linked-list-variants:llv-choose-1": {
    scenario:
      "Match a list variant to each need: (a) browser history with back/forward, (b) a fixed-size ring buffer overwriting the oldest, (c) a memory-tight forward-only queue.",
    approaches: [
      { id: "doubly-circular-singly", label: "Doubly for (a), circular for (b), singly for (c)", requiredReasonIds: ["variant-matches-need"] },
      { id: "singly-everywhere", label: "Use a singly linked list for all three", requiredReasonIds: [], rejectionFeedback: "A singly linked list cannot move backward (needed for history) and has no wrap-around end (needed for a ring buffer), so it fits only the forward-only queue." },
    ],
    reasons: [
      { id: "variant-matches-need", text: "A doubly list moves both directions and deletes a known node in O(1) (history); a circular list wraps with no None end (ring buffer); a singly list is the leanest for forward-only traversal (queue)." },
      { id: "singly-does-all", text: "A singly linked list supports backward movement and wrap-around, so it covers all three needs.", contradictory: true },
      { id: "circular-cant-wrap", text: "A circular list cannot cycle back to the start, so it is unsuited to a ring buffer.", contradictory: true },
    ],
    acceptableApproachIds: ["doubly-circular-singly"],
    modelExplanation:
      "(a) doubly — move both directions and delete a given node in O(1). (b) circular — cycle through slots with no None end. (c) singly — least memory, forward-only is enough.",
  },
  "lesson:linked-list-deques:lldq-choose-1": {
    scenario:
      "You need a fixed-size buffer of the last 100 sensor readings that automatically drops the oldest as new ones arrive.",
    approaches: [
      { id: "deque-maxlen", label: "collections.deque(maxlen=100)", requiredReasonIds: ["maxlen-auto-drops"] },
      { id: "list-manual-trim", label: "A list you append to and slice back to 100", requiredReasonIds: [], rejectionFeedback: "A plain list requires manual trimming, and dropping the oldest with list.pop(0) is O(n); deque's maxlen does the eviction automatically in O(1)." },
    ],
    reasons: [
      { id: "maxlen-auto-drops", text: "deque(maxlen=100) discards from the opposite end automatically once full, giving an O(1) fixed-size ring buffer with no manual bookkeeping." },
      { id: "maxlen-raises-when-full", text: "A deque with maxlen raises an error when it is full rather than evicting.", contradictory: true },
      { id: "list-pop0-is-o1", text: "Removing the oldest element with list.pop(0) is O(1), so a list is just as good.", contradictory: true },
    ],
    acceptableApproachIds: ["deque-maxlen"],
    modelExplanation:
      "deque(maxlen=100): appending past capacity discards from the opposite end, giving an automatic fixed-size ring buffer in O(1).",
  },
  "lesson:dp-recursive-calls:dprc-choose-1": {
    scenario:
      "A recursive solution recomputes the same subproblems over and over, and you must speed it up.",
    approaches: [
      { id: "memoize", label: "Memoize (cache) each subproblem's result", requiredReasonIds: ["cache-overlapping"] },
      { id: "add-base-case", label: "Just add another base case", requiredReasonIds: [], rejectionFeedback: "Adding a base case changes where recursion stops; it does not stop the SAME subproblem being recomputed on different branches, so the exponential blowup remains." },
    ],
    reasons: [
      { id: "cache-overlapping", text: "The subproblems overlap, so caching each one computes it once and reuses it, collapsing exponential repeated work to the number of distinct subproblems." },
      { id: "no-overlap-to-cache", text: "The subproblems never repeat, so caching would never produce a hit.", contradictory: true },
      { id: "memo-slower", text: "Memoization makes the recursion asymptotically slower.", contradictory: true },
    ],
    acceptableApproachIds: ["memoize"],
    modelExplanation:
      "Memoization (or bottom-up tabulation): cache each subproblem's answer so it's computed once, turning exponential repeated work into linear work.",
  },
  "lesson:dp-combinations:dpcomb-choose-1": {
    scenario:
      "Distinguish seating 3 people in a row (order matters) from picking a 3-person team (order irrelevant): which is permutations and which is combinations.",
    approaches: [
      { id: "perm-row-comb-team", label: "Seating in a row = permutations; picking a team = combinations", requiredReasonIds: ["order-matters-split"] },
      { id: "swap-them", label: "Seating = combinations; picking a team = permutations", requiredReasonIds: [], rejectionFeedback: "This reverses the definitions: order matters for a seating arrangement (permutations) and is irrelevant for a chosen team (combinations)." },
    ],
    reasons: [
      { id: "order-matters-split", text: "When order distinguishes outcomes (a row of seats) it's permutations, n!/(n-k)!; when order is irrelevant (a team) it's combinations, C(n,k)." },
      { id: "order-never-matters", text: "Order never affects the count, so both tasks are combinations.", contradictory: true },
      { id: "team-is-ordered", text: "Choosing a team is order-sensitive, so it is a permutation problem.", contradictory: true },
    ],
    acceptableApproachIds: ["perm-row-comb-team"],
    modelExplanation:
      "Seating in a row = permutations (order matters, n!/(n-k)! arrangements). Picking a team = combinations (order irrelevant, C(n,k)).",
  },
  "lesson:dp-combinations:dpcomb-combination-sum-1": {
    scenario:
      "Adapt the choose/explore/un-choose backtracking template to Combination Sum: all combinations of candidates=[2,3,6,7] (reuse allowed) summing to target=7.",
    approaches: [
      { id: "same-index-remaining", label: "Recurse with the SAME index and drive by a remaining target, pruning when remaining < 0", requiredReasonIds: ["reuse-same-index", "positive-distinct-preconditions"] },
      { id: "next-index-size-k", label: "Recurse with i+1 and stop at a fixed size k", requiredReasonIds: [], rejectionFeedback: "Recursing with i+1 forbids reusing a candidate, so it misses [2,2,3]; and a fixed size k is the wrong driver — Combination Sum is bounded by the remaining target, not a count." },
    ],
    reasons: [
      { id: "reuse-same-index", text: "Recursing bt(i, ...) with the same index lets a candidate be reused, while a non-decreasing start index avoids duplicate orderings; subtract the pick and record when remaining == 0, prune when remaining < 0." },
      { id: "positive-distinct-preconditions", text: "Candidates must be strictly positive (so each pick decreases remaining and the <0 prune terminates) and distinct (so each multiset is emitted once without a skip-equal-siblings guard)." },
      { id: "i-plus-one-allows-reuse", text: "Recursing with i+1 still allows a candidate to be reused, so [2,2,3] is found.", contradictory: true },
      { id: "zero-candidate-fine", text: "A zero or negative candidate is harmless because the remaining<0 prune still guarantees termination.", contradictory: true },
    ],
    acceptableApproachIds: ["same-index-remaining"],
    modelExplanation:
      "Two changes: recurse with the SAME index so candidates reuse, and drive by a remaining target (record at remaining==0, prune at remaining<0). It relies on candidates being strictly positive (termination/overshoot) and distinct (each multiset once). Results: [[2,2,3],[7]].",
  },
  "lesson:dp-1d-2d:dp12-choose-1": {
    scenario:
      "A subproblem is 'best result using the first i items with j units of capacity left'. You must decide whether the DP table is 1D or 2D.",
    approaches: [
      { id: "two-d", label: "2D DP table dp[i][j]", requiredReasonIds: ["two-independent-dims"] },
      { id: "one-d", label: "1D DP table indexed by one variable", requiredReasonIds: [], rejectionFeedback: "A single index cannot capture both the item position i and the remaining capacity j independently, so a 1D table loses state the recurrence needs." },
    ],
    reasons: [
      { id: "two-independent-dims", text: "The state has two independent quantities — item index i and remaining capacity j — so it is naturally dp[i][j], exactly the 0/1 knapsack shape." },
      { id: "state-is-one-var", text: "The subproblem depends on only one varying quantity, so one dimension suffices.", contradictory: true },
      { id: "capacity-not-state", text: "Remaining capacity is not part of the state, so it need not index the table.", contradictory: true },
    ],
    acceptableApproachIds: ["two-d"],
    modelExplanation:
      "2D: the state has two independent quantities (item index i and remaining capacity j), so the table is dp[i][j]. That's exactly the 0/1 knapsack shape.",
  },
  "lesson:dp-knapsack:dpks-choose-1": {
    scenario:
      "Items may be split into any fraction and you want maximum value under a weight limit.",
    approaches: [
      { id: "greedy-ratio", label: "Greedy by value-per-weight ratio", requiredReasonIds: ["fractions-remove-01"] },
      { id: "dp-knapsack", label: "0/1 knapsack dynamic programming", requiredReasonIds: [], rejectionFeedback: "0/1 DP is for the all-or-nothing case; when items can be split, the fraction removes that interaction and a simple ratio-greedy is optimal, so DP is unnecessary overhead." },
    ],
    reasons: [
      { id: "fractions-remove-01", text: "Because items can be split, taking them in descending value/weight order (splitting the last to fill the limit) is provably optimal in O(n log n) — no DP interaction remains." },
      { id: "greedy-wrong-fractional", text: "Greedy by ratio gives a suboptimal answer for the fractional knapsack.", contradictory: true },
      { id: "fractional-needs-dp", text: "The fractional knapsack still needs the 0/1 DP table to be solved optimally.", contradictory: true },
    ],
    acceptableApproachIds: ["greedy-ratio"],
    modelExplanation:
      "Greedy by value-per-weight: for the fractional knapsack, take items in ratio order (splitting the last), giving the optimum in O(n log n). DP is unnecessary because fractions remove the 0/1 interaction.",
  },
  "lesson:dp-subsequences:dpsub-choose-1": {
    scenario:
      "Distinguish (a) 'does s appear in t keeping order but allowing gaps?' from (b) 'does s appear in t as a contiguous block?'.",
    approaches: [
      { id: "subseq-vs-substr", label: "(a) is a subsequence check; (b) is a substring search", requiredReasonIds: ["gaps-vs-contiguous"] },
      { id: "both-same", label: "Treat both as the same contiguous-match problem", requiredReasonIds: [], rejectionFeedback: "They are different: (a) permits gaps between matched characters while (b) demands a contiguous run, so they need different algorithms." },
    ],
    reasons: [
      { id: "gaps-vs-contiguous", text: "Allowing gaps while keeping order is a subsequence check — a greedy two-pointer scan in O(|t|); requiring a contiguous block is a substring search (e.g. s in t, or KMP)." },
      { id: "subseq-needs-contiguous", text: "A subsequence must be contiguous in t, so (a) and (b) are the same problem.", contradictory: true },
      { id: "substring-allows-gaps", text: "A substring match allows gaps between characters.", contradictory: true },
    ],
    acceptableApproachIds: ["subseq-vs-substr"],
    modelExplanation:
      "(a) subsequence — greedy two-pointer scan, O(|t|). (b) substring — contiguous match (e.g. `s in t` or KMP), a different problem.",
  },
  "lesson:dp-state-transitions:dpst-choose-1": {
    scenario:
      "For a long price series you can compare all (buy, sell) pairs in O(n²) or track a rolling state in O(n). You must choose and name the state.",
    approaches: [
      { id: "rolling-state", label: "O(n) rolling-state scan tracking (min price, best profit)", requiredReasonIds: ["rolling-min-profit"] },
      { id: "all-pairs", label: "Compare every (buy, sell) pair", requiredReasonIds: [], rejectionFeedback: "Comparing all pairs is O(n²), unnecessary on a long series because a single left-to-right pass tracking the cheapest price so far already yields the best profit." },
    ],
    reasons: [
      { id: "rolling-min-profit", text: "Keeping (cheapest price so far, best profit so far) and updating both each day gives the answer in one O(n) pass with O(1) extra state." },
      { id: "needs-all-pairs", text: "You must examine every buy/sell pair, so O(n²) is unavoidable.", contradictory: true },
      { id: "state-needs-full-history", text: "The rolling scan must remember every past price, not just the minimum.", contradictory: true },
    ],
    acceptableApproachIds: ["rolling-state"],
    modelExplanation:
      "The O(n) rolling-state scan. The minimal state is (cheapest price so far, best profit so far); updating both per day gives the answer in one pass.",
  },
  "lesson:dp-climbing-stairs:dpcs-choose-1": {
    scenario:
      "You must count the ways to reach step n for very large n and choose between naive recursion, memoized recursion, and a rolling bottom-up loop.",
    approaches: [
      { id: "rolling-bottom-up", label: "Rolling-variable bottom-up iteration", requiredReasonIds: ["rolling-o1-no-recursion"] },
      { id: "naive-recursion", label: "Plain recursion with no caching", requiredReasonIds: [], rejectionFeedback: "Naive recursion recomputes overlapping subproblems and is exponential, so it is hopeless for very large n." },
      { id: "memoized-recursion", label: "Memoized recursion", requiredReasonIds: [], rejectionFeedback: "Memoized recursion is O(n) time but keeps an O(n) cache and O(n) call stack, risking a recursion-depth error for very large n." },
    ],
    reasons: [
      { id: "rolling-o1-no-recursion", text: "Keeping only the last two counts gives O(n) time and O(1) space with no recursion, so very large n is safe from stack limits." },
      { id: "naive-is-linear", text: "Naive recursion already runs in O(n) time without caching.", contradictory: true },
      { id: "rolling-needs-on-space", text: "The rolling bottom-up loop still needs an O(n) table and deep recursion.", contradictory: true },
    ],
    acceptableApproachIds: ["rolling-bottom-up"],
    modelExplanation:
      "Rolling-variable bottom-up: O(n) time, O(1) space, no recursion limit. Naive recursion is exponential; memoized recursion is O(n) time but uses O(n) cache and stack.",
  },
  "lesson:dp-house-robber:dphr-choose-1": {
    scenario:
      "For houses [2,7,9,3,1] where adjacent houses can't both be robbed, you must choose between a naive greedy and DP.",
    approaches: [
      { id: "dp", label: "Dynamic programming (max of rob-this + best-two-back, or skip)", requiredReasonIds: ["dp-correct-nonadjacent"] },
      { id: "greedy-richest", label: "Greedily grab the richest available non-adjacent house", requiredReasonIds: [], rejectionFeedback: "Grabbing 9 first forces skipping its neighbours and tops out at 11 (9+2 or 9+1), below the DP optimum of 12 — greedy is not reliable here." },
    ],
    reasons: [
      { id: "dp-correct-nonadjacent", text: "DP keeps, at each house, the best of skipping it or robbing it plus the best up to two houses back, correctly finding 12 (rob 2, 9, 1)." },
      { id: "greedy-optimal-here", text: "Greedily taking the richest house always yields the optimum for this problem.", contradictory: true },
      { id: "dp-gives-11", text: "DP returns 11 for [2,7,9,3,1].", contradictory: true },
    ],
    acceptableApproachIds: ["dp"],
    modelExplanation:
      "DP is correct: 12 (rob 2, 9, 1). A naive greedy grabbing 9 first ends at 11, worse than 12. Greedy is not reliable here; use DP.",
  },
  "lesson:dp-lcs:dplcs-choose-1": {
    scenario:
      "You must find the longest run of characters common to two strings that is CONTIGUOUS in both.",
    approaches: [
      { id: "longest-common-substring", label: "Longest common SUBSTRING DP (reset the cell to 0 on mismatch)", requiredReasonIds: ["contiguous-resets-on-mismatch"] },
      { id: "lcs", label: "Longest common subsequence (LCS) DP", requiredReasonIds: [], rejectionFeedback: "LCS allows gaps between matched characters, so it does not require the run to be contiguous — it solves a different problem than the one asked." },
    ],
    reasons: [
      { id: "contiguous-resets-on-mismatch", text: "Requiring contiguity means a mismatch breaks the run, so the DP cell resets to 0 and you track the maximum cell — the longest-common-substring recurrence." },
      { id: "lcs-is-contiguous", text: "LCS already requires the common characters to be contiguous in both strings.", contradictory: true },
      { id: "substring-allows-gaps-lcs", text: "The contiguous version keeps the carry on a mismatch just like LCS.", contradictory: true },
    ],
    acceptableApproachIds: ["longest-common-substring"],
    modelExplanation:
      "Not LCS — that's the longest common SUBSTRING (contiguous), a different DP where a mismatch resets the cell to 0. LCS allows gaps; substring does not.",
  },
  "lesson:dp-divide-and-conquer:dpdc-choose-1": {
    scenario:
      "You need the maximum subarray sum on a huge array under tight time limits, choosing between divide-and-conquer O(n log n) and Kadane's O(n).",
    approaches: [
      { id: "kadane", label: "Kadane's algorithm", requiredReasonIds: ["kadane-linear-o1"] },
      { id: "divide-conquer", label: "Divide-and-conquer across the midpoint", requiredReasonIds: [], rejectionFeedback: "Divide-and-conquer is O(n log n) and great for teaching the paradigm, but on a huge array under tight limits Kadane's O(n) single pass is faster." },
    ],
    reasons: [
      { id: "kadane-linear-o1", text: "Kadane runs in one O(n) pass with O(1) space (extend-or-restart at each index), beating the O(n log n) divide-and-conquer on large inputs." },
      { id: "dc-faster-than-kadane", text: "Divide-and-conquer is asymptotically faster than Kadane for maximum subarray sum.", contradictory: true },
      { id: "kadane-is-nlogn", text: "Kadane's algorithm runs in O(n log n).", contradictory: true },
    ],
    acceptableApproachIds: ["kadane"],
    modelExplanation:
      "Kadane's O(n): it's asymptotically faster and O(1) space. Divide-and-conquer (O(n log n)) is great for teaching the paradigm but not the fastest here.",
  },
  "lesson:fenwick-tree:fen-choose-1": {
    scenario:
      "You need many range-SUM queries on an array whose entries are updated frequently.",
    approaches: [
      { id: "fenwick", label: "A Fenwick (binary indexed) tree", requiredReasonIds: ["fenwick-log-update-query"] },
      { id: "static-prefix", label: "A static prefix-sum array", requiredReasonIds: [], rejectionFeedback: "A prefix-sum array answers queries in O(1) but must be rebuilt in O(n) after every update, which is far too slow when updates are frequent." },
    ],
    reasons: [
      { id: "fenwick-log-update-query", text: "A Fenwick tree does both point update and prefix-sum query in O(log n), so frequent updates no longer force an O(n) rebuild." },
      { id: "prefix-updates-o1", text: "A static prefix-sum array supports point updates in O(1) without rebuilding.", contradictory: true },
      { id: "fenwick-cant-update", text: "A Fenwick tree cannot handle updates once built.", contradictory: true },
    ],
    acceptableApproachIds: ["fenwick"],
    modelExplanation:
      "Fenwick tree: O(log n) for both update and query. A static prefix-sum array answers queries in O(1) but needs O(n) to rebuild after every update, too slow with frequent updates.",
  },
  "lesson:segment-tree:seg-choose-1": {
    scenario:
      "You need range-MINIMUM queries with point updates and must choose between a Fenwick tree and a segment tree.",
    approaches: [
      { id: "segment-tree", label: "A segment tree storing per-segment minima", requiredReasonIds: ["min-non-invertible"] },
      { id: "fenwick", label: "A Fenwick tree", requiredReasonIds: [], rejectionFeedback: "A Fenwick tree answers queries by subtracting prefix results, but minimum is non-invertible — you cannot 'subtract' a min — so it can't answer an arbitrary range minimum." },
    ],
    reasons: [
      { id: "min-non-invertible", text: "Minimum has no inverse, so prefix differences don't work; a segment tree stores each segment's min and combines O(log n) covering segments to answer any range-min." },
      { id: "min-invertible-prefix", text: "Minimum is invertible, so a Fenwick tree answers range-min via prefix differences.", contradictory: true },
      { id: "segtree-cant-min", text: "A segment tree cannot answer range-minimum queries.", contradictory: true },
    ],
    acceptableApproachIds: ["segment-tree"],
    modelExplanation:
      "Segment tree: minimum is non-invertible, so a Fenwick tree can't answer arbitrary range minima via prefix differences. The segment tree stores per-segment minima and answers range-min in O(log n).",
  },
  "lesson:kmp:kmp-choose-1": {
    scenario:
      "You must find all occurrences of a pattern in a huge text with a worst-case time guarantee, since inputs may be adversarial.",
    approaches: [
      { id: "kmp", label: "KMP with a prefix-function (failure) table", requiredReasonIds: ["kmp-no-rescan"] },
      { id: "naive-scan", label: "Naive sliding comparison at every start position", requiredReasonIds: [], rejectionFeedback: "Naive scanning rescans the text after a mismatch, degrading to O(n·m) on adversarial inputs like 'aaaa...a' with pattern 'aa...ab' — no worst-case guarantee." },
    ],
    reasons: [
      { id: "kmp-no-rescan", text: "KMP's failure table lets the search skip already-matched text instead of backing up, giving a guaranteed O(n + m) even on adversarial inputs." },
      { id: "naive-is-linear-worst", text: "Naive scanning is already O(n + m) in the worst case, so KMP adds nothing.", contradictory: true },
      { id: "kmp-quadratic-adversarial", text: "KMP degrades to O(n·m) on adversarial inputs just like naive scanning.", contradictory: true },
    ],
    acceptableApproachIds: ["kmp"],
    modelExplanation:
      "KMP: guaranteed O(n + m) even on adversarial inputs like 'aaaa...a' with pattern 'aa...ab', where naive scanning degrades to O(n·m). KMP never rescans the text.",
  },
});

Object.assign(EXERCISE_HINTS, {
  "lesson:variables-and-types:vt-choose-1": [
    "Goal: pick the Python numeric type for a whole number that may be hundreds of digits long, and decide whether overflow can bite you.",
    "The costly assumption is reaching for a fixed-width integer out of habit — in many languages that would overflow at huge magnitudes.",
    "Key property: Python's int is not fixed-width; it grows to hold any magnitude exactly.",
    "Approach: store the value in a plain int rather than a float or any capped type.",
    "Reasoning: int gives exact arbitrary-precision arithmetic, while float would lose precision on hundreds of digits; there is no capped alternative to worry about here.",
    "Answer: use int — Python integers have unlimited precision, so a value of any size is exact; there is no fixed-width integer overflow, only the limit of available memory.",
  ],
  "lesson:expressions:expr-choose-1": [
    "Goal: choose the operator that gives the remainder of a divided by b, e.g. to test whether a is even.",
    "The naive detour is computing a quotient and subtracting back — that recomputes what one operator already gives you.",
    "Key property: you want the leftover after division, not the quotient.",
    "Approach: use the modulo operator rather than / or //.",
    "Reasoning: // gives the floor quotient and / gives a float, but only % yields the remainder you can test against zero.",
    "Answer: use the modulo operator % — a % b is the remainder, and a % 2 == 0 tests evenness.",
  ],
  "lesson:scope:scope-choose-1": [
    "Goal: decide the cleaner way for a function to update a module-level counter: declare it global, or return the new value.",
    "The hidden cost of global is a side effect: the function silently mutates outside state, making it harder to test and reason about.",
    "Key property: a function that only reads inputs and returns outputs is easier to reason about than one that reaches out to mutate a name.",
    "Approach: have the function return the new value and let the caller reassign it.",
    "Reasoning: returning keeps the function pure and testable; global works but couples it to one specific name and introduces hidden coupling.",
    "Answer: prefer returning the new value and reassigning at the call site — it avoids hidden side effects, whereas global ties the function to that specific name.",
  ],
  "lesson:errors:err-choose-1": [
    "Goal: decide whether to guard a possibly-missing dict key with `if key in d` or with try/except KeyError — and when each fits.",
    "The wrong instinct is a one-size rule; using exceptions for the common case (or `in` for the rare case) pays an avoidable cost either way.",
    "Key property: the right choice depends on how OFTEN the key is actually missing.",
    "Approach: match the guard to the expected frequency of a miss, and keep the except clause specific.",
    "Reasoning: a membership check is cheap when misses are frequent; exceptions are cheap when misses are rare but costly when they fire constantly — and a broad `except Exception` would mask unrelated bugs.",
    "Answer: both are valid — use `if key in d` when a miss is common, use try/except KeyError when a miss is rare/exceptional, and never catch broad Exception.",
  ],
  "lesson:representations:repr-choose-1": [
    "Goal: pick a representation for changing data you repeatedly query as 'is key K present, and what is its value?' — a list of pairs or a dict.",
    "The costly choice is a list of (key, value) pairs: every lookup scans the whole list.",
    "Key property: the dominant operation is keyed lookup by K, which a hash table serves directly.",
    "Approach: store the data in a dict keyed by K rather than a list of pairs.",
    "Reasoning: a dict hashes straight to the entry in expected O(1), while a list of pairs forces an O(n) scan per query — and the data changing doesn't hurt the dict.",
    "Answer: use a dict — keyed lookup is expected O(1), versus O(n) scanning a list of pairs.",
  ],
  "lesson:complexity:cx-choose-1": [
    "Goal: determine the best achievable time complexity for finding the maximum of an unsorted list in a single examination.",
    "The tempting error is assuming you can somehow shortcut and skip elements the way binary search skips in sorted data.",
    "Key property: the list is unsorted, so any element you don't look at could be the maximum.",
    "Approach: accept that a full linear scan is required and reason about its lower bound.",
    "Reasoning: skipping even one element risks missing the true max, so no algorithm can be certain without inspecting all n — sorting first would be worse at O(n log n).",
    "Answer: O(n) is optimal — any unexamined element could be the maximum, so you must inspect every element at least once.",
  ],
  "lesson:cases:cases-choose-1": [
    "Goal: choose between two sorts for untrusted input — one O(n log n) worst case, one that averages O(n log n) but degrades to O(n²).",
    "The trap is judging by average case: on adversarial input the average tells you nothing about what an attacker can force.",
    "Key property: the input is untrusted/adversarial, so an attacker can deliberately hit the worst case.",
    "Approach: choose on the WORST-case bound, not the average.",
    "Reasoning: a guaranteed worst case can't be exploited, whereas the second sort's O(n²) worst case could be triggered by crafted input to cause a denial of service; the average-case sort would be fine only for trusted/random data.",
    "Answer: pick the algorithm with the guaranteed O(n log n) worst case, because adversarial input could deliberately trigger the other's O(n²).",
  ],
  "lesson:amortized:amort-choose-1": [
    "Goal: append exactly n known-in-advance items while avoiding the periodic resize-and-copy a growing list performs.",
    "The avoidable cost is letting the list grow on demand: it reallocates and copies several times as capacity is exceeded.",
    "Key property: n is known up front, so the final capacity is fixed in advance.",
    "Approach: reserve all the capacity once, then fill by index.",
    "Reasoning: preallocating does a single allocation and no mid-loop copies; relying on amortized append still pays occasional O(n) copies you can skip entirely when n is known.",
    "Answer: preallocate a list of size n (e.g. [None] * n) and assign by index — one O(n) allocation and no mid-loop copies.",
  ],
  "lesson:matrix-traversal:mat-predict-1": [
    "Goal: state the time complexity of visiting every cell of an R×C grid and justify why it is not O(R+C).",
    "The mistake O(R+C) encodes is treating the two loops as sequential (added) rather than nested (multiplied).",
    "Key property: for each of the R rows you walk all C columns, so the loops are nested.",
    "Approach: multiply the loop counts rather than add them.",
    "Reasoning: nested loops multiply, giving R·C cell visits; O(R+C) would only count each row and each column once, which undercounts the actual cells.",
    "Answer: O(R*C) — the nested loops multiply, and there are R*C cells to visit, not R+C.",
  ],
  "lesson:intervals:int-choose-1": [
    "Goal: give the overall time complexity of merging n intervals and name the step that dominates it.",
    "The error is costing only the visible merge loop and forgetting the preprocessing that makes it work.",
    "Key property: merging needs the intervals in sorted order before a single linear sweep can combine overlaps.",
    "Approach: add the cost of the sort to the cost of the sweep and keep the larger term.",
    "Reasoning: the sort is O(n log n) and the sweep is only O(n), so the sort dominates; without sorting you'd face O(n²) pairwise checks instead.",
    "Answer: O(n log n), dominated by the sort — the merge sweep itself is only O(n).",
  ],
  "lesson:string-frequency:sf-choose-1": [
    "Goal: decide whether two strings are anagrams, choosing between comparing frequency maps and sorting both strings.",
    "The slower route is sorting both strings just to compare them, which costs more than counting.",
    "Key property: anagrams are exactly the strings with identical character counts.",
    "Approach: build a character-frequency map of each string and compare the two maps.",
    "Reasoning: counting is a single linear pass and equal maps prove anagram status, while sorting adds an O(n log n) factor you don't need; also reject early if lengths differ.",
    "Answer: build and compare frequency maps — O(n) time, O(k) space, better than sorting's O(n log n).",
  ],
  "lesson:string-two-pointers:stp-choose-1": [
    "Goal: in a memory-constrained setting, choose how to check if a string is a palindrome — compare it to its reverse or walk two pointers inward.",
    "The costly part of s == s[::-1] is that it allocates a whole reversed copy of the string.",
    "Key property: a palindrome is symmetric, so you only ever need to compare the i-th and (n-1-i)-th characters — no copy required.",
    "Approach: converge two pointers from both ends, comparing as they move inward.",
    "Reasoning: two pointers use O(1) extra space and can stop at the first mismatch, whereas the slice always builds an O(n) copy; the slice is only acceptable when memory is plentiful.",
    "Answer: use two pointers — O(1) extra space and early exit on the first mismatch, versus s[::-1]'s O(n) reversed copy.",
  ],
  "lesson:string-sliding-window:ssw-choose-1": [
    "Goal: pick a fixed-size or variable-size sliding window for 'longest substring with at most 2 distinct characters'.",
    "The clue against a fixed window is that the answer's length is unknown — you are discovering it, not given it.",
    "Key property: the window must stay valid under the constraint (≤ 2 distinct), expanding and shrinking as that constraint allows.",
    "Approach: use a variable-size window driven by the distinct-character constraint.",
    "Reasoning: the window grows while ≤ 2 distinct holds and contracts when it breaks, so its width changes; a fixed-size window only fits when the target length k is given up front.",
    "Answer: variable-size — the window grows while the ≤ 2-distinct constraint holds and contracts when it breaks, so the width is not fixed.",
  ],
  "lesson:string-parsing:sp-choose-1": [
    "Goal: read the text '10,20,30' and add the three numbers, choosing the required steps and their order.",
    "The costly bug is adding the pieces while they are still strings — '10'+'20' concatenates instead of summing.",
    "Key property: the values are separated by commas and arrive as text, so they must be split and then converted before arithmetic.",
    "Approach: split on the delimiter first, then convert each token to int, then sum.",
    "Reasoning: splitting yields string tokens; only after int() turns each into a number can '+' mean addition — doing it in the other order (sum then convert) is impossible.",
    "Answer: first split on ',' to get tokens, then convert each with int before summing — text must become numbers first.",
  ],
  "lesson:palindromes:pal-choose-1": [
    "Goal: for a very long string in a memory-tight environment, choose a palindrome check — slicing (s == s[::-1]) or two converging pointers.",
    "The expensive part of slicing is that it materializes a full reversed copy, doubling memory for a long string.",
    "Key property: symmetry means you only need to compare mirrored character pairs, which needs no extra storage.",
    "Approach: walk two pointers inward from both ends instead of building a reversed string.",
    "Reasoning: two pointers run in O(1) extra space and bail out at the first mismatch, while the slice always spends O(n) space; slicing is fine only when memory is abundant.",
    "Answer: use two pointers — O(1) extra space and early exit on mismatch, versus the slice's O(n) reversed copy.",
  ],
  "lesson:palindromes:pal-longest-substring-1": [
    "Goal: find the longest palindromic substring of 'cbbd' by expanding around centers, and decide which centers to try.",
    "The costly mistake is checking only single-character (odd) centers, which never finds an even-length palindrome.",
    "Key property: a palindrome's center is either one character (odd length) or the gap between two adjacent characters (even length), and 'bb' sits in a gap.",
    "Approach: expand around all 2n-1 centers — each index and each adjacent gap — keeping the widest match.",
    "Reasoning: expand(i,i) catches odd palindromes and expand(i,i+1) catches even ones like 'bb'; an odd-only version skips the gap center between the two b's and wrongly returns a length-1 answer. Overall O(n^2) time, O(1) space.",
    "Answer: try all 2n-1 centers (each index for odd, each gap for even), expanding while s[lo]==s[hi]; 'bb' is even and gap-centered, so odd-only misses it — O(n^2) time, O(1) space.",
  ],
  "lesson:anagrams:ana-choose-1": [
    "Goal: for very long strings, choose the anagram test that scales better and state the complexities.",
    "The slower choice is sorting both strings, which adds a logarithmic factor over simply counting.",
    "Key property: anagrams share identical character counts, which one linear pass can tally.",
    "Approach: build and compare character-frequency maps rather than sorting.",
    "Reasoning: counting is O(n) versus sorting's O(n log n), and you can reject immediately when the lengths differ; sorting only wins if you had to produce sorted output anyway.",
    "Answer: the frequency-map method — O(n) time, O(k) space, beating sorting's O(n log n); also reject early if lengths differ.",
  ],
  "lesson:substrings:sub-choose-1": [
    "Goal: find the longest substring without repeating characters, deciding whether to enumerate all substrings or slide a window.",
    "The costly route is enumerating substrings: there are O(n^2) of them, so checking each is far too slow.",
    "Key property: as you extend a window rightward, a repeat only forces the left edge forward — you never need to restart from scratch.",
    "Approach: use a variable-size sliding window that tracks the last seen position of each character.",
    "Reasoning: the window grows while characters stay unique and the left edge jumps past a duplicate, giving one linear pass instead of quadratic enumeration.",
    "Answer: don't enumerate (O(n^2)+ substrings) — use a variable-size sliding window: O(n) time, O(k) space.",
  ],
  "lesson:linear-search:ls-choose-1": [
    "Goal: decide if repeated linear search is right when you query the same array thousands of times for different values.",
    "The costly pattern is rescanning the whole array per query — O(n) each, multiplied by many queries.",
    "Key property: the array is fixed across queries, so you can preprocess it once and reuse the result.",
    "Approach: build a set (hash index) once, then answer each membership query against it.",
    "Reasoning: one O(n) build plus expected O(1) per query gives O(n + q), far better than O(n·q) for repeated scans; linear search only wins for a single one-off query.",
    "Answer: no — repeated linear search is O(n·q); build a set once (O(n)) and query in expected O(1), giving O(n + q).",
  ],
  "lesson:bounds:bnd-choose-1": [
    "Goal: find the index of the FIRST occurrence of a value in a sorted array with duplicates — bisect_left or bisect_right.",
    "The error is bisect_right, which lands past the last duplicate rather than at the first.",
    "Key property: the first occurrence is the leftmost position where the target could sit among equal values.",
    "Approach: use bisect_left to get that leftmost boundary.",
    "Reasoning: bisect_left returns the first index ≥ target (the start of the run of equals), while bisect_right returns the index just after the last equal element.",
    "Answer: bisect_left — it returns the leftmost index where the target appears, whereas bisect_right points past the last occurrence.",
  ],
  "lesson:matrix-search:ms-choose-1": [
    "Goal: search a matrix sorted within each row and column but NOT globally, deciding if you can binary-search the flattened cells.",
    "The costly misstep is flattening and binary-searching: row-major order isn't globally sorted here, so binary search is simply invalid.",
    "Key property: although not globally sorted, from the top-right corner every value is the max of its row and the min of its column — giving a monotone decision at each step.",
    "Approach: walk a staircase from the top-right (or bottom-left) corner.",
    "Reasoning: moving left on too-big and down on too-small eliminates a row or column each step for O(m+n); flattened binary search would compare against unsorted order and miss the target.",
    "Answer: no — flattening isn't globally sorted, so use the O(m+n) staircase from a corner: left on too-big, down on too-small.",
  ],
  "lesson:bubble-sort:bub-choose-1": [
    "Goal: decide whether bubble sort is acceptable for n = 1,000,000 elements, and if not, what to use.",
    "The costly reality is bubble sort's O(n²): for a million elements that is about 10^12 operations.",
    "Key property: n is large enough that the quadratic-versus-log-linear gap is the difference between seconds and hours.",
    "Approach: use an O(n log n) comparison sort such as Python's built-in sorted (Timsort).",
    "Reasoning: O(n log n) is roughly 2×10^7 operations here, tens of thousands of times fewer than O(n²); bubble sort is only tolerable for tiny or nearly-sorted inputs.",
    "Answer: no — O(n²) is ~10^12 ops; use an O(n log n) sort (sorted/Timsort), ~2×10^7 ops.",
  ],
  "lesson:selection-sort:sel-choose-1": [
    "Goal: among the O(n²) sorts, pick the one that minimizes writes when writes to storage are expensive but reads are cheap.",
    "The costly choice is bubble or insertion sort, which can perform O(n²) writes as they shuffle elements.",
    "Key property: the cost model weights writes far above reads/comparisons, so write count is what matters.",
    "Approach: choose selection sort, which commits one element to its final place per position.",
    "Reasoning: selection sort does at most n swaps regardless of input, whereas bubble/insertion move elements repeatedly; it reads a lot but writes little, matching this cost model.",
    "Answer: selection sort — at most n swaps (writes), one per position, versus O(n²) writes for bubble/insertion.",
  ],
  "lesson:insertion-sort:ins-choose-1": [
    "Goal: choose the best quadratic sort for many small chunks that are each already nearly sorted.",
    "The missed opportunity is using a non-adaptive quadratic sort that pays full O(n²) even when the data is almost ordered.",
    "Key property: the input is nearly sorted, so most elements are already close to their final positions.",
    "Approach: use insertion sort, whose work scales with how far elements must move.",
    "Reasoning: insertion sort is adaptive (near O(n) on nearly-sorted data) and stable, which is exactly why hybrid sorts like Timsort use it for small runs; selection sort wouldn't benefit from the near-order.",
    "Answer: insertion sort — adaptive (near O(n) on nearly-sorted input) and stable, which is why hybrids use it for small runs.",
  ],
  "lesson:merge-sort:mrg-choose-1": [
    "Goal: choose a sorting approach for 100 GB of data that does not fit in memory.",
    "The costly assumption is any in-memory sort — the data simply cannot all be loaded at once.",
    "Key property: the algorithm must work on sorted runs streamed from disk, accessing data sequentially rather than randomly.",
    "Approach: use merge sort as an external sort — sort chunks that fit in RAM, then merge them from disk.",
    "Reasoning: merge sort combines sorted runs with linear sequential passes, so it never needs the whole dataset in memory; quicksort's random-access partitioning is a poor fit for disk.",
    "Answer: merge sort — its sequential merges make external sorting practical with guaranteed O(n log n) and sequential access.",
  ],
  "lesson:quick-sort:qk-choose-1": [
    "Goal: choose a sort with GUARANTEED worst-case O(n log n) on adversarial input where stability also matters — quicksort or merge sort.",
    "The risk with quicksort is that crafted input can force O(n²) and its in-place form isn't stable.",
    "Key property: the input is adversarial (so average case can't be trusted) and equal keys must keep their order (stability).",
    "Approach: use merge sort.",
    "Reasoning: merge sort guarantees O(n log n) regardless of input and is stable, satisfying both requirements; quicksort would be the pick only without adversarial input or stability needs.",
    "Answer: merge sort — guaranteed O(n log n) worst case and stable, while quicksort risks O(n²) and its in-place form isn't stable.",
  ],
  "lesson:counting-sort:cnt-choose-1": [
    "Goal: choose between counting sort and an O(n log n) comparison sort for 1,000,000 exam scores each in 0–100, and give the complexity.",
    "The suboptimal default is a comparison sort, which pays an O(n log n) factor even though the key range is tiny.",
    "Key property: every value lies in a small fixed range (0–100), so the max value hi is tiny relative to n.",
    "Approach: use counting sort over the 0–100 range.",
    "Reasoning: counting sort runs in O(n + hi); with hi = 100 that is effectively O(n), beating O(n log n); it would be wasteful only if the value range were huge.",
    "Answer: counting sort — hi = 100 is tiny, so O(n + hi) ≈ O(n), faster than O(n log n) here.",
  ],
  "lesson:bucket-sort:buck-choose-1": [
    "Goal: judge why bucket sort might beat an O(n log n) comparison sort for a million floats uniformly distributed in [0, 1).",
    "The default comparison sort pays O(n log n) even though the data's distribution could be exploited.",
    "Key property: the values are UNIFORMLY distributed, so spreading them into equal-width buckets leaves each bucket with only a few items.",
    "Approach: distribute into buckets by value, sort each small bucket, and concatenate.",
    "Reasoning: uniform spread keeps bucket sizes small, so total work is expected O(n); skewed data would overfill a bucket and lose this edge, where a comparison sort would be safer.",
    "Answer: bucket sort — uniform distribution keeps buckets small, giving expected O(n) and beating the O(n log n) comparison bound.",
  ],
  "lesson:heap-sort:hs-choose-1": [
    "Goal: choose a guaranteed O(n log n) sort with O(1) extra space where stability is NOT required — heap sort or merge sort.",
    "The costly aspect of merge sort here is its O(n) auxiliary buffer, which the memory budget forbids.",
    "Key property: you need worst-case O(n log n) with constant extra space, and you don't care about preserving equal-key order.",
    "Approach: use in-place heap sort.",
    "Reasoning: heap sort guarantees O(n log n) and sorts in place with O(1) auxiliary space; merge sort matches the time but needs O(n) space, so it only wins when stability is required.",
    "Answer: in-place heap sort — O(n log n) guaranteed and O(1) auxiliary space, versus merge sort's O(n) space.",
  ],
  "lesson:radix-sort:rad-choose-1": [
    "Goal: choose between counting sort and radix sort for a million integers ranging up to 1,000,000,000.",
    "The costly misfit is plain counting sort: it would allocate a counts array of size ~10^9, far larger than n.",
    "Key property: the value range is enormous but each number has only about 10 digits, so the data has few digits even though it has a huge range.",
    "Approach: use radix sort, processing the numbers digit by digit with a small base.",
    "Reasoning: radix runs in O(d·(n+b)) ≈ O(n) with d≈10 digits and small base b, avoiding the O(hi) blowup; counting sort would win only when hi is comparable to n.",
    "Answer: radix sort — counting sort's O(hi)=O(10^9) array is wasteful, while radix's O(d·(n+b)) ≈ O(n) avoids the huge-range blowup.",
  ],
  "lesson:comparators:cmp-choose-1": [
    "Goal: sort records by field A ascending and field B descending at once, choosing the clean Python approach.",
    "The slow route is a cmp-style comparator, which Python invokes O(n log n) times during the sort.",
    "Key property: both orderings can be captured in a single composite key if you flip the descending field's sign.",
    "Approach: pass a tuple key that negates the descending field, e.g. key=lambda x: (x.a, -x.b).",
    "Reasoning: a key is computed once per element and then compared with fast tuple ordering, while cmp_to_key re-runs a Python comparator on every comparison and is slower.",
    "Answer: use key=lambda x: (x.a, -x.b) — computed once per element, versus a slow cmp function called O(n log n) times.",
  ],
  "lesson:interval-sorting:isort-choose-1": [
    "Goal: to MERGE overlapping intervals, decide whether to sort by start or by end, and what sorting enables.",
    "The costly baseline is comparing every pair of intervals, which is O(n²).",
    "Key property: sorting by start makes all intervals that could overlap a given one appear contiguously, right after it.",
    "Approach: sort by start, then sweep once, merging each interval into the last kept one when they overlap.",
    "Reasoning: a start-sorted order lets a single left-to-right pass decide each merge in O(n); sorting by end doesn't line up overlaps for a merge sweep the same way.",
    "Answer: sort by START, then a single sweep merges overlaps — turning an O(n²) pairwise check into O(n log n) sort + O(n) sweep.",
  ],
  "lesson:stack-queue-operations:sq-choose-1": [
    "Goal: choose a structure for FIFO processing with millions of enqueues and dequeues — a list or a collections.deque.",
    "The costly choice is a list, because removing from the front with pop(0) shifts every remaining element.",
    "Key property: FIFO removes from the front, and only a deque supports O(1) removal there.",
    "Approach: use a deque, appending to enqueue and popleft to dequeue.",
    "Reasoning: deque gives O(1) at both ends, so millions of operations stay linear overall; a list's pop(0) is O(n), making the total O(n²).",
    "Answer: deque — append and popleft are O(1), whereas list.pop(0) is O(n) and far too slow at scale.",
  ],
  "lesson:parentheses-matching:paren-choose-1": [
    "Goal: explain why a single integer counter fails to validate '([)]' while a stack succeeds.",
    "The counter's flaw is that it only tallies open-minus-close, so it can balance numerically yet be mis-nested.",
    "Key property: validity depends on bracket TYPE and nesting order, not just the count — each closer must match the most recent opener of its kind.",
    "Approach: use a stack that pushes each opener and, on a closer, checks the top is the matching opener.",
    "Reasoning: the stack enforces last-opened-first-closed with type matching, catching '([)]' where ')' meets an unmatched '[', while a counter is blind to both type and order.",
    "Answer: a counter ignores bracket type and order (so '([)]' balances numerically but is mis-nested); a stack enforces that each closer matches the most recent opener of the correct type.",
  ],
  "lesson:expression-evaluation:expr-choose-1": [
    "Goal: explain why evaluating RPN (postfix) is simpler than evaluating infix like (2+1)*3 directly.",
    "The cost infix imposes is handling operator precedence and parentheses before you can compute anything.",
    "Key property: RPN already encodes evaluation order in the token sequence, so no precedence or grouping remains to resolve.",
    "Approach: evaluate RPN with a single stack — push numbers, pop operands when an operator appears, push the result.",
    "Reasoning: RPN needs no parser because order is explicit; infix first requires a precedence-aware pass (e.g. shunting-yard) to even reach that stack evaluation.",
    "Answer: RPN encodes order explicitly, so just push numbers and apply operators — infix needs a precedence-aware parser first.",
  ],
  "lesson:bfs-queues:bfs-choose-1": [
    "Goal: find the shortest path LENGTH between two nodes in an UNWEIGHTED graph, choosing BFS or DFS.",
    "The pitfall with DFS is that it plunges down one branch, so the first time it reaches the target need not be via the fewest edges.",
    "Key property: with unit edge weights, distance equals edge count, and exploring by layers visits nodes in increasing distance.",
    "Approach: use BFS from the source with a queue.",
    "Reasoning: BFS reaches each node in nondecreasing distance order, so its first arrival at the target is a shortest path in O(V+E); DFS doesn't visit in distance order and would need extra work.",
    "Answer: BFS — it visits nodes in increasing distance, so the first arrival at the target is the shortest path; O(V+E), unlike DFS.",
  ],
  "lesson:min-max-tracking:min-choose-1": [
    "Goal: compute the maximum of every size-k sliding window over an array in O(n) total, deciding if a min/max stack is enough.",
    "The limitation of a plain stack is that it can't drop elements that have slid out of the window's left edge.",
    "Key property: you must discard both out-of-window elements (from the front) and dominated smaller elements (from the back), i.e. work at both ends.",
    "Approach: use a monotonic DEQUE that keeps indices in decreasing value order.",
    "Reasoning: the deque pops the front when it leaves the window and pops the back while new values dominate, so each index is pushed and popped once for O(n); a one-ended stack can't evict stale front elements.",
    "Answer: a monotonic DEQUE (not a plain stack) — it drops out-of-window and dominated elements from both ends, giving O(n) for sliding-window maximum.",
  ],
  "lesson:maps-sets:ms-choose-1": [
    "Goal: choose a structure for millions of membership checks against a FIXED collection — list, sorted list + binary search, or set.",
    "The costly options are a plain list (O(n) per check) and even a sorted list (O(log n) per check), repeated millions of times.",
    "Key property: the only operation is 'is x present?', with no ordering or range needs, and the collection never changes.",
    "Approach: build a set once and test membership against it.",
    "Reasoning: a set hashes to expected O(1) per check, beating O(log n) and O(n); the sorted-list+binary-search option would matter only if you also needed order or range queries.",
    "Answer: a set — expected O(1) membership, versus O(log n) for sorted list + binary search and O(n) for a list.",
  ],
  "lesson:hashing-frequency:hf-choose-1": [
    "Goal: find the majority element (appearing more than n/2 times) and state how a frequency map solves it and at what cost.",
    "The naive baseline is counting each candidate by rescanning the array, which is O(n²).",
    "Key property: one pass can tally every value's count, after which the majority is just the most frequent if its count exceeds n/2.",
    "Approach: build a Counter in one pass, then check whether its most common value exceeds n/2.",
    "Reasoning: the Counter gives O(n) time and O(k) space; if memory is tight, Boyer–Moore voting reaches the same answer in O(1) space as a further optimization.",
    "Answer: build a Counter in O(n), take most_common(1), and confirm count > n/2 — O(n) time, O(k) space (Boyer–Moore voting is the O(1)-space refinement).",
  ],
  "lesson:duplicate-detection:dup-choose-1": [
    "Goal: detect duplicates when extra memory is forbidden but reordering the data IS allowed.",
    "The usual O(n)-space set is ruled out here because no extra memory is permitted.",
    "Key property: reordering is allowed, and once equal values are adjacent, a duplicate is just a neighbor comparison.",
    "Approach: sort the array in place, then scan for equal adjacent elements.",
    "Reasoning: an in-place sort uses O(1) extra space and makes duplicates adjacent, trading the set's O(n) space for O(n log n) time; a set would be the pick when time matters more than memory and reordering is disallowed.",
    "Answer: sort the array (O(n log n), O(1) extra in-place) and scan for equal adjacent elements — trading the set's O(n) space for time.",
  ],
  "lesson:value-to-index:vti-choose-1": [
    "Goal: for Two Sum, decide when to switch from the hash-map approach to sorting plus two pointers, and what changes.",
    "The cost of sorting is that it scrambles the original positions, so you lose the ability to report input indices.",
    "Key property: the deciding factor is whether the answer must be the ORIGINAL indices or just the values, and how tight memory is.",
    "Approach: keep the hash map when indices matter; switch to sort + converging two pointers when only values matter and space is tight.",
    "Reasoning: the hash map is O(n)/O(n) and preserves indices; sort + two pointers is O(n log n) with O(1) extra space but destroys original positions.",
    "Answer: use sort + two pointers when you don't need original indices and want O(1) space (O(n log n)); keep the hash map (O(n)/O(n)) when the answer must be original positions.",
  ],
  "lesson:grouping:grp-choose-1": [
    "Goal: group anagrams over a fixed lowercase alphabet with a key cheaper than the sorted-string key's O(n·L log L).",
    "The costly key is the sorted string: sorting each word of length L adds a log L factor per word.",
    "Key property: with a fixed 26-letter alphabet, two words are anagrams exactly when their per-letter counts match — and counts need no sorting.",
    "Approach: use a 26-length count tuple of letter frequencies as the group key.",
    "Reasoning: counting a word is O(L) with no sort, so grouping is O(n·L); the sorted-string key pays O(n·L log L) for the same grouping.",
    "Answer: a 26-length count tuple as the key — computed in O(L) without sorting, giving O(n·L), below O(n·L log L).",
  ],
  "lesson:caching-seen:cache-choose-1": [
    "Goal: decide when memoization will speed up a recursive algorithm and describe the resulting complexity relationship.",
    "The costly symptom without memoization is exponential recomputation of the same subproblems.",
    "Key property: the signal is overlapping subproblems — the same inputs recur across the recursion tree.",
    "Approach: cache each subproblem's result (memoize) so each is computed only once.",
    "Reasoning: with caching, total time becomes proportional to the number of DISTINCT subproblems plus O(1) per reuse; without overlap (all subproblems distinct) memoization adds overhead without saving work.",
    "Answer: overlapping subproblems are the signal — memoization makes total time proportional to the distinct subproblems (each solved once) plus O(1) per reuse, replacing exponential recomputation.",
  ],
  "lesson:bit-logical-ops:bit-log-choose-1": [
    "Goal: packing on/off feature flags into one integer, choose the bitwise operators to SET a flag and to TEST a flag.",
    "The error is reaching for arithmetic (+/-) which can carry across bits and corrupt neighboring flags.",
    "Key property: each flag is one bit, so you need operations that touch exactly that bit without disturbing others.",
    "Approach: OR the flag's bit in to set it; AND with the flag's bit to test it.",
    "Reasoning: OR (|) turns a bit on idempotently, and AND (&) with a single-bit mask isolates that bit (non-zero means set); addition/subtraction would misbehave if the flag were already set/clear.",
    "Answer: use OR (|) with the flag's bit to set it, and AND (&) with the flag's bit to test it (non-zero means set).",
  ],
  "lesson:xor-cancellation:xor-choose-1": [
    "Goal: find the single number that appears once while all others appear twice, caring about memory, comparing XOR-fold vs a hash-set count.",
    "The hash-set approach stores every value seen, costing O(n) memory you may not have.",
    "Key property: XOR is self-inverse (x ^ x = 0) and commutative, so paired values cancel and only the unique one survives.",
    "Approach: XOR all elements together into a single accumulator.",
    "Reasoning: both methods are O(n) time, but the XOR fold uses O(1) space (one accumulator) while the hash set uses O(n); the set only wins if the 'twice' invariant doesn't hold.",
    "Answer: both are O(n) time, but XOR-folding is O(1) space versus the hash set's O(n) — XOR wins on memory.",
  ],
  "lesson:count-set-bits:csb-choose-1": [
    "Goal: count set bits of a sparse 64-bit integer (only a couple set) with the fewest iterations.",
    "The wasteful method checks all 64 bit positions regardless of how few are actually set.",
    "Key property: the number is sparse, so the count of set bits s is far smaller than the word width w.",
    "Approach: use Kernighan's trick (n &= n - 1), which clears the lowest set bit each iteration.",
    "Reasoning: Kernighan iterates once per set bit, so O(s) = 2 here, while checking every bit is O(w) = 64; the bit-by-bit scan would only be comparable when nearly all bits are set.",
    "Answer: Kernighan does 2 iterations (O(s)); checking every bit does 64 (O(w)) — Kernighan is far better for sparse numbers.",
  ],
  "lesson:min-max-heaps:heap-choose-1": [
    "Goal: repeatedly insert numbers and always fetch the current minimum, choosing a sorted list or a heap, with per-op costs.",
    "The costly part of a sorted list is insertion: keeping it sorted shifts elements in O(n) each time.",
    "Key property: inserts and extract-mins interleave heavily, so BOTH operations must stay cheap.",
    "Approach: use a binary heap (e.g. heapq).",
    "Reasoning: a heap gives O(log n) insert and extract-min with O(1) peek, balancing both operations; a sorted list offers O(1) min but O(n) insert, which loses when inserts are frequent.",
    "Answer: a heap — insert and extract-min O(log n), peek O(1); the sorted list's O(n) insert loses when inserts and extractions interleave.",
  ],
  "lesson:heap-sift:sift-choose-1": [
    "Goal: after moving the last element into the vacated root slot, restore the heap in O(log n) — sift up or down, and against which child.",
    "The wrong move is sifting up: the root has no parent, so there is nowhere for it to rise.",
    "Key property: the new root may be too large for a min-heap, so it must descend toward the smaller side to keep the heap order.",
    "Approach: sift the root DOWN, comparing it against the smaller of its two in-range children.",
    "Reasoning: swapping with the smaller child (indices 2i+1, 2i+2) preserves the min-heap property as the element sinks; comparing with the larger child or sifting up would violate it.",
    "Answer: sift DOWN, comparing with the SMALLER of the two in-range children (2i+1, 2i+2) and swapping while larger — sifting up is wrong since the root has no parent.",
  ],
  "lesson:merge-sorted-data:merge-choose-1": [
    "Goal: merge 1000 sorted files too large to fit in memory into one sorted stream — concatenate-and-sort or heap-based k-way merge.",
    "The costly route is concatenate-and-sort: it needs all N items in memory and re-sorts data that is already sorted.",
    "Key property: each file is already sorted, so the global next element is always one of the k current front elements.",
    "Approach: run a heap-based k-way merge, keeping one front element per file in a min-heap.",
    "Reasoning: the heap holds only k=1000 items (O(k) space) and emits output lazily in O(N log k), while concatenate-and-sort needs O(N) memory and O(N log N) time.",
    "Answer: heap-based k-way merge — O(k) space and O(N log k) streaming, versus concatenate-and-sort's O(N) memory and O(N log N).",
  ],
  "lesson:tree-bfs:bfs-choose-1": [
    "Goal: report the rightmost node value at each depth of a binary tree (the 'right side view'), choosing BFS or DFS.",
    "The clumsy framing is a plain DFS with no notion of levels, which doesn't naturally group nodes by depth.",
    "Key property: the problem is defined PER LEVEL, and level-order processing exposes each depth's nodes together.",
    "Approach: run BFS level by level and take the last node of each level.",
    "Reasoning: BFS processes one depth at a time, so the final node per level is the right-side view; a depth-tracking DFS that visits the right child first also works but BFS matches the per-level definition most directly.",
    "Answer: BFS by levels — process each level and take its last node (a right-first depth-tracking DFS also works).",
  ],
  "lesson:tree-traversals:trav-choose-1": [
    "Goal: match a traversal order to each task — (a) print a BST sorted, (b) serialize parent-before-children, (c) free every node safely.",
    "The error is picking one traversal for all three; each task constrains the visit order differently.",
    "Key property: inorder yields sorted BST values, preorder emits a node before its subtrees, and postorder finishes children before their parent.",
    "Approach: assign inorder to (a), preorder to (b), postorder to (c).",
    "Reasoning: a BST's inorder is ascending; serialization needs the parent recorded first (preorder) so it can be rebuilt; freeing must release children before the parent (postorder) so no reference is lost.",
    "Answer: (a) inorder — sorted BST output; (b) preorder — node before children; (c) postorder — free children before the parent.",
  ],
  "lesson:bst-operations:bst-choose-1": [
    "Goal: pick a structure needing ordered operations (range, floor/ceil) AND guaranteed fast lookup on changing data — plain BST, balanced BST, or hash map.",
    "The costly risks are a plain BST degenerating to O(n) and a hash map having no ordering at all.",
    "Key property: you need BOTH order-based queries and a worst-case guarantee under ongoing inserts and deletes.",
    "Approach: use a self-balancing BST (AVL or red-black).",
    "Reasoning: a balanced BST keeps height O(log n) for guaranteed O(log n) search/insert/delete plus ordered queries; a plain BST risks O(n) if unbalanced, and a hash map is expected O(1) but supports no order or range queries.",
    "Answer: a balanced BST (AVL/red-black) — guaranteed O(log n) operations AND ordered queries, unlike a plain BST (risking O(n)) or a hash map (no order).",
  ],
  "lesson:lowest-common-ancestor:lca-choose-1": [
    "Goal: find the LCA of two nodes in a plain binary tree with NO BST ordering, and give the complexity.",
    "The missing shortcut is BST ordering: without it you cannot use value comparisons to prune a branch.",
    "Key property: the LCA is the node where the two targets first lie in different subtrees (or that equals one target).",
    "Approach: use a recursive DFS that returns a target when found and combines results from both subtrees.",
    "Reasoning: a node is the LCA if p and q are found in its different subtrees, or if it is one of them; because nothing can be pruned, it costs O(n) time and O(h) recursion-stack space.",
    "Answer: a recursive DFS returning a node when it equals p or q, or when p and q appear in different subtrees — O(n) time, O(h) stack, since no ordering allows pruning.",
  ],
  "lesson:tree-construction:build-choose-1": [
    "Goal: build a BST from sorted data for O(log n) search, deciding between inserting one-by-one and building from the middle.",
    "The costly misstep is inserting sorted values one by one, which produces a degenerate O(n)-height chain.",
    "Key property: the data is already sorted, so the middle element is a perfectly balanced root for each range.",
    "Approach: build from the middle via divide and conquer — pick the midpoint as root, recurse on each half.",
    "Reasoning: choosing midpoints yields an O(log n)-height balanced tree directly, whereas sequential insertion of sorted keys defeats the purpose by making a linked-list-shaped tree.",
    "Answer: build from the middle (divide and conquer) for a balanced O(log n)-height tree — one-by-one insertion of sorted values yields a degenerate O(n)-height tree.",
  ],
  "lesson:trie-insertion:trie-choose-1": [
    "Goal: for exact-word membership only, decide between a hash set and a trie (both ~O(L)) and name what the trie uniquely enables.",
    "The hidden tradeoff is that a trie carries more structural overhead than a set when all you need is exact lookup.",
    "Key property: exact membership needs only the full key, but PREFIX queries need the shared-prefix structure a trie provides.",
    "Approach: choose a hash set for pure exact membership; choose a trie when prefix queries are required.",
    "Reasoning: for exact lookup both are ~O(L) and the set is simpler and lighter; the trie's edge is enumerating or counting words by prefix, which a hash set can't do efficiently.",
    "Answer: for exact membership alone use a hash set (simpler, lower overhead); the trie's advantage is prefix queries a set can't serve efficiently.",
  ],
  "lesson:prefix-search:prefix-choose-1": [
    "Goal: for autocomplete over a large dictionary, justify a trie over a hash set and give the cost of a prefix check vs listing 10 suggestions.",
    "The hash set's limitation is that it keys whole words and can't walk forward from a prefix.",
    "Key property: autocomplete is a PREFIX operation, and a trie stores words along shared-prefix paths.",
    "Approach: use a trie, descending P characters to the prefix node and then walking its subtree for suggestions.",
    "Reasoning: checking a prefix exists is O(P) to reach the node, and listing matches is O(P + S) to collect the subtree words; a hash set offers neither efficiently.",
    "Answer: a trie supports prefix queries a hash set can't — a prefix check is O(P), and listing suggestions is O(P + S) (reach the node, then walk its subtree).",
  ],
  "lesson:word-search:ws-choose-1": [
    "Goal: search a grid for MANY words at once, deciding between repeated single-word DFS and a trie-guided DFS.",
    "The costly repetition is a separate DFS per word, re-exploring shared prefixes over and over at O(m·n·3^L) each.",
    "Key property: many search words share common prefixes, so their grid exploration can be done once.",
    "Approach: build a trie of all words and run one DFS over the grid guided by the trie.",
    "Reasoning: the trie prunes to only paths that extend some word's prefix, exploring each shared prefix once (Word Search II), rather than paying the per-word cost repeatedly.",
    "Answer: a trie of all words with one trie-guided DFS (Word Search II) — shared prefixes are explored once instead of O(m·n·3^L) per word.",
  ],
  "lesson:avl-rotations:avl-choose-1": [
    "Goal: compare inserting 1,2,3,...,n into a plain BST versus an AVL tree — resulting heights and search complexities.",
    "The costly case is the plain BST on sorted insertion: it never branches, forming a chain.",
    "Key property: increasing-order insertion is exactly the worst case that unbalanced BSTs fall into, while AVL rebalances after each insert.",
    "Approach: reason about the height each structure ends with and derive search cost from it.",
    "Reasoning: the plain BST becomes a height-n chain giving O(n) search, whereas AVL rotations keep height O(log n) for O(log n) search — self-balancing is precisely what defeats the sorted-insert worst case.",
    "Answer: plain BST → height-n chain → O(n) search; AVL → height O(log n) → O(log n) search, because rotations prevent the sorted-insert worst case.",
  ],
  "lesson:graph-representations:grep-choose-1": [
    "Goal: on a small dense graph where you often ask 'is there an edge u–v?', choose an adjacency list or matrix, with edge-check costs.",
    "The costly option is the adjacency list: answering 'edge u–v?' means scanning u's neighbor list.",
    "Key property: the query is a direct edge-existence test, and the graph is small/dense so a V×V matrix is affordable.",
    "Approach: store the graph as an adjacency matrix and test mat[u][v].",
    "Reasoning: the matrix answers edge existence in O(1) and its O(V²) space is fine for a small dense graph; an adjacency list needs O(degree) per check and shines mainly for sparse graphs or neighbor iteration.",
    "Answer: a matrix — O(1) edge lookup (mat[u][v]), affordable on a small dense graph, versus O(degree) for an adjacency list.",
  ],
  "lesson:adjacency-lists:adj-choose-1": [
    "Goal: explain why a traversal visiting every neighbor of every vertex costs O(V + E), not O(V·d) written as V times average degree.",
    "The confusion is treating per-vertex neighbor work as a fixed multiplier d on V, hiding that total neighbor work is bounded by edges.",
    "Key property: the sum of all vertex degrees equals 2E (undirected) or E (directed), so all neighbor visits together total O(E).",
    "Approach: count the O(V) to touch each vertex plus the O(E) summed over all neighbor lists.",
    "Reasoning: V·(average degree) actually equals O(E), so it's the same quantity — but O(V + E) is the exact standard form that also accounts for touching every vertex even in a sparse graph.",
    "Answer: because degrees sum to 2E, neighbor visits total O(E), and adding O(V) to touch each vertex gives O(V + E) — V·(avg degree) is the same quantity (= O(E)), but O(V + E) is the standard exact form.",
  ],
  "lesson:graph-bfs:gbfs-choose-1": [
    "Goal: find the fewest number of edges on a path from A to B in an UNWEIGHTED graph, choosing BFS or DFS, with complexity.",
    "The pitfall with DFS is that it dives along a branch, so its first path to B may be far from the fewest-edge one.",
    "Key property: with equal edge weights, fewest edges equals shortest distance, and BFS visits vertices in increasing distance.",
    "Approach: run BFS from A with a queue, stopping when B is dequeued.",
    "Reasoning: BFS reaches B first via a minimum-edge path in O(V+E); DFS doesn't order visits by distance, so it can't guarantee fewest edges without extra bookkeeping.",
    "Answer: BFS — it visits vertices in increasing distance, so the first arrival at B uses the fewest edges; O(V+E), unlike DFS.",
  ],
  "lesson:graph-dfs:gdfs-choose-1": [
    "Goal: detect whether a graph contains a cycle, deciding which traversal is the natural fit and why.",
    "The awkward option is BFS, whose level-by-level frontier doesn't directly expose a path revisiting itself.",
    "Key property: a cycle is a path that returns to a vertex already on the current exploration path.",
    "Approach: use DFS, tracking visited status (and the recursion stack for directed graphs).",
    "Reasoning: DFS follows paths, so meeting an already-visited vertex that isn't the immediate parent (undirected) or is on the current recursion stack (directed) reveals a cycle, all in O(V+E).",
    "Answer: DFS — following paths, a revisit that isn't the parent (undirected) or that's on the recursion stack (directed) reveals a cycle; O(V+E).",
  ],
  "lesson:connected-components:cc-choose-1": [
    "Goal: report the component count after each edge is added one at a time — repeated traversal or union-find.",
    "The costly approach is re-running a full traversal after every edge, at O(V+E) per query.",
    "Key property: edges arrive incrementally, and adding one edge can only merge two components, never split any.",
    "Approach: use union-find, uniting the endpoints of each new edge and tracking the component count.",
    "Reasoning: each union is near O(α) (almost constant) and simply decrements the count on a successful merge, so a stream of edges stays near-linear; repeated traversals would redo O(V+E) work every time.",
    "Answer: union-find — each edge union is near O(α) and handles incremental edges without re-traversing, far beating O(V+E) per query.",
  ],
  "lesson:graph-cycle-detection:cyc-choose-1": [
    "Goal: detect a cycle in a DIRECTED graph and explain why the undirected 'visited and not the parent' rule fails there.",
    "The costly misapplication is the undirected rule: in a digraph a vertex can be visited-but-finished, so meeting it is not a cycle.",
    "Key property: a directed cycle corresponds to a BACK EDGE — an edge to a vertex still on the current recursion path (in progress).",
    "Approach: DFS while tracking an in-progress set (gray) distinct from finished (black); a neighbor in the in-progress set means a cycle.",
    "Reasoning: finished vertices lie off the current path, so revisiting them is harmless; only a neighbor currently on the recursion stack closes a directed cycle, which the parent-based rule can't capture.",
    "Answer: a visited directed vertex may be finished (off the path), so the parent rule fails — detect a BACK EDGE instead: a neighbor currently on the recursion stack.",
  ],
  "lesson:multi-source-bfs:msbfs-choose-1": [
    "Goal: give every empty grid cell its distance to the NEAREST of several gates — separate BFS per gate or multi-source BFS, with costs.",
    "The costly approach is a separate BFS from each gate, repeating the whole sweep k times.",
    "Key property: all gates are sources at distance 0, and a single frontier can expand from all of them simultaneously.",
    "Approach: seed every gate into the queue at distance 0 and run one BFS.",
    "Reasoning: one combined wavefront assigns each cell its nearest-gate distance in O(V+E); running BFS per gate costs O(k·(V+E)), far slower for many gates.",
    "Answer: multi-source BFS — seed all gates at distance 0 and run one BFS, O(V+E), versus O(k·(V+E)) for per-gate BFS.",
  ],
  "lesson:shortest-paths-unweighted:spu-choose-1": [
    "Goal: find the cheapest route in a road network where roads have DIFFERENT lengths — BFS or Dijkstra, and why.",
    "The costly mistake is BFS: it counts edges, so on weighted roads 'fewest roads' is not 'lowest total length'.",
    "Key property: edges carry different (non-negative) weights, so cost accumulates by weight, not by hop count.",
    "Approach: use Dijkstra's algorithm with a min-heap keyed by cumulative distance.",
    "Reasoning: Dijkstra always finalizes the closest-by-cost frontier vertex, giving correct weighted shortest paths in O((V+E) log V); BFS is correct only when all weights are equal.",
    "Answer: Dijkstra — with differing weights, fewest edges isn't lowest cost; BFS only works unweighted, while Dijkstra (non-negative weights) runs in O((V+E) log V).",
  ],
  "lesson:floyd-warshall:fw-choose-1": [
    "Goal: get shortest distances between ALL pairs in a small dense graph (V ≈ 200, E ≈ V²) — Floyd–Warshall or Dijkstra-from-every-source.",
    "The costlier option on a dense graph is running Dijkstra from every source, which carries a log factor across all V runs.",
    "Key property: you need all-pairs distances on a small, dense graph where a simple O(V³) triple loop is entirely affordable.",
    "Approach: use Floyd–Warshall's three nested loops over intermediate vertices.",
    "Reasoning: Floyd–Warshall is O(V³) with tiny code, while Dijkstra from every source is ~O(V³ log V) on dense graphs; the all-source Dijkstra approach wins mainly on sparse graphs.",
    "Answer: Floyd–Warshall — O(V³) and simple, avoiding the log factor of ~O(V³ log V) all-source Dijkstra on a small dense graph.",
  ],
  "lesson:prim:prim-choose-1": [
    "Goal: explain how Prim differs from Dijkstra (both use a min-heap) and what Prim produces.",
    "The confusion to avoid is assuming identical heap structure means identical output — the heap KEY differs.",
    "Key property: the objective differs — Prim grows a tree by cheapest connecting edge, Dijkstra grows shortest paths by cumulative distance.",
    "Approach: key Prim's heap by the weight of the edge crossing into the tree, not by distance from a source.",
    "Reasoning: because Prim keys on crossing-edge weight it builds a Minimum Spanning Tree, whereas Dijkstra keys on accumulated distance to build shortest paths — same machinery, different goal.",
    "Answer: Prim keys the heap by crossing-edge weight and produces a Minimum Spanning Tree; Dijkstra keys by cumulative distance and produces shortest paths — same structure, different objective.",
  ],
  "lesson:kruskal:kru-choose-1": [
    "Goal: build an MST of a SPARSE graph given as an edge list — Prim or Kruskal — and name what dominates Kruskal's cost.",
    "The friction with Prim here is that it prefers adjacency structure, while the input is a raw edge list.",
    "Key property: the graph is sparse and already presented as edges, which suits an edge-sorting greedy.",
    "Approach: use Kruskal — sort all edges by weight and add each if its endpoints are in different components (union-find).",
    "Reasoning: sorting the edges is O(E log E) and union-find makes cycle checks near-linear, ideal for sparse/edge-list input; the sort is the dominant term.",
    "Answer: Kruskal — it sorts the edge list (O(E log E)) and uses union-find for near-linear cycle checks, with the sort dominating its cost.",
  ],
  "lesson:linked-list-cycle-detection:llcd-choose-1": [
    "Goal: detect a cycle in a list of possibly millions of nodes under tight memory — Floyd's two pointers or a visited set.",
    "The costly option is the visited set, which stores a reference per node for O(n) memory.",
    "Key property: a cycle makes a fast pointer eventually lap a slow one, so detection needs no stored history.",
    "Approach: use Floyd's slow/fast pointers moving at one and two steps.",
    "Reasoning: Floyd's method is O(n) time like the set but O(1) space, fitting the memory limit; the visited set's O(n) space may be too much at this scale.",
    "Answer: Floyd's two pointers — O(n) time like the set but O(1) space, so it fits tight memory where the O(n)-space visited set may not.",
  ],
  "lesson:linked-list-middle:llmid-choose-1": [
    "Goal: report the middle node when nodes arrive from a stream you can read only ONCE.",
    "The costly approach is count-then-walk, which requires a second pass the one-read stream won't permit.",
    "Key property: the data can be consumed only once, so the method must finish in a single pass without knowing the length upfront.",
    "Approach: use slow/fast pointers — advance slow one step and fast two steps.",
    "Reasoning: when fast reaches the end, slow sits at the middle, all in one pass; counting first then walking needs to revisit the data, impossible on a one-read stream.",
    "Answer: slow/fast — it finds the middle in a single pass without knowing the length, unlike count-then-walk which needs a second pass.",
  ],
  "lesson:linked-list-variants:llv-choose-1": [
    "Goal: match a list variant to each need — (a) browser history with back/forward, (b) fixed-size ring buffer overwriting oldest, (c) memory-tight forward-only queue.",
    "The error is one variant for all; each need stresses a different capability (bidirectional moves, wraparound, or minimal memory).",
    "Key property: back/forward needs two-way links, a ring buffer needs no terminal end, and a forward-only queue needs only forward links.",
    "Approach: assign doubly to (a), circular to (b), singly to (c).",
    "Reasoning: doubly lets you move both directions and delete a known node in O(1); circular cycles through fixed slots with no None end; singly uses the least memory for a forward-only traversal.",
    "Answer: (a) doubly (both directions, O(1) delete); (b) circular (cycle slots, no None end); (c) singly (least memory, forward-only suffices).",
  ],
  "lesson:linked-list-deques:lldq-choose-1": [
    "Goal: keep a fixed-size buffer of the last 100 sensor readings, automatically dropping the oldest as new ones arrive.",
    "The costly hand-rolled approach is manually removing the front whenever a list grows past 100, which is error-prone and may be O(n).",
    "Key property: you need a bounded FIFO where appending past capacity evicts from the opposite end automatically.",
    "Approach: use collections.deque with a maxlen of 100.",
    "Reasoning: deque(maxlen=100) discards from the opposite end on each over-capacity append in O(1), giving a free ring buffer with no manual bookkeeping.",
    "Answer: deque(maxlen=100) — appending past capacity discards from the opposite end, an automatic O(1) fixed-size ring buffer.",
  ],
  "lesson:dp-recursive-calls:dprc-choose-1": [
    "Goal: speed up a recursion that recomputes identical subproblems many times — pick the right technique.",
    "The costly symptom is exponential blowup from re-solving the same subproblem again and again.",
    "Key property: the recursion has overlapping subproblems — the same arguments recur across the call tree.",
    "Approach: cache subproblem answers via memoization, or build them bottom-up with tabulation.",
    "Reasoning: caching ensures each distinct subproblem is computed once and reused in O(1), collapsing exponential repeated work to linear in the number of subproblems.",
    "Answer: memoization (or bottom-up tabulation) — cache each subproblem's answer so it's computed once, turning exponential repeated work into linear.",
  ],
  "lesson:dp-combinations:dpcomb-choose-1": [
    "Goal: classify seating 3 people in a row (order matters) versus picking a 3-person team (order irrelevant) as permutations or combinations.",
    "The error is treating both as the same count; whether order matters changes the formula entirely.",
    "Key property: arrangements where position matters are permutations; selections where only membership matters are combinations.",
    "Approach: label the ordered task permutations and the unordered task combinations.",
    "Reasoning: seating fixes positions, so swapping two people gives a new arrangement (n!/(n-k)!); a team is a set, so reorderings are the same team (C(n,k)).",
    "Answer: seating in a row = permutations (order matters, n!/(n-k)!); picking a team = combinations (order irrelevant, C(n,k)).",
  ],
  "lesson:dp-combinations:dpcomb-combination-sum-1": [
    "Goal: adapt the choose/explore/un-choose template to Combination Sum — all combos of candidates=[2,3,6,7] summing to target=7 with reuse allowed.",
    "The costly bug is recursing from i+1 (which forbids reuse and misses [2,2,3]) or driving by a fixed size k instead of a remaining target.",
    "Key property: reuse requires recursing from the SAME index, and the goal is a sum target, so you prune as soon as the remaining target goes negative.",
    "Approach: recurse with bt(i, ...) to allow reuse, subtract the chosen value from a remaining target, record a path when remaining == 0, and prune when remaining < 0.",
    "Reasoning: keeping the start index non-decreasing avoids duplicate orderings like [2,2,3] vs [3,2,2]; this relies on candidates being strictly POSITIVE (so each pick decreases remaining, guaranteeing termination and valid overshoot pruning) and DISTINCT (so each multiset is emitted once).",
    "Answer: recurse with the SAME index (reuse) and drive by a remaining target (record at 0, prune below 0), giving [[2,2,3],[7]] — valid only because candidates are strictly positive and distinct.",
  ],
  "lesson:dp-1d-2d:dp12-choose-1": [
    "Goal: decide whether a subproblem 'best using the first i items with j capacity left' is 1D or 2D DP.",
    "The error is collapsing it to 1D and losing track of one of the two varying quantities.",
    "Key property: the state varies along TWO independent axes — item index i and remaining capacity j.",
    "Approach: index the DP table by both, as dp[i][j].",
    "Reasoning: because i and j vary independently, a single dimension can't capture every reachable state; this two-axis state is exactly the 0/1 knapsack shape.",
    "Answer: 2D — the state has two independent quantities (item index i and remaining capacity j), so the table is dp[i][j], the 0/1 knapsack shape.",
  ],
  "lesson:dp-knapsack:dpks-choose-1": [
    "Goal: maximize value under a weight limit when items can be split into ANY fraction — DP knapsack or greedy.",
    "The costly over-engineering is a DP knapsack table, which exists to handle the all-or-nothing item interaction.",
    "Key property: fractional splitting removes the 0/1 coupling, so each item can be taken partially by its value density.",
    "Approach: greedily take items in decreasing value-per-weight order, splitting the last one to fill the limit.",
    "Reasoning: with fractions the exchange argument proves greedy optimal in O(n log n); DP is only needed for the 0/1 variant where items can't be split.",
    "Answer: greedy by value-per-weight (fractional knapsack) — optimal in O(n log n); DP is unnecessary because fractions remove the 0/1 interaction.",
  ],
  "lesson:dp-subsequences:dpsub-choose-1": [
    "Goal: distinguish (a) 'does s appear in t keeping order but allowing gaps?' from (b) 'does s appear in t as a contiguous block?' — subsequence or substring.",
    "The error is conflating the two; allowing gaps versus requiring contiguity are different problems with different algorithms.",
    "Key property: (a) only needs order preserved (gaps allowed), while (b) needs the characters consecutive.",
    "Approach: solve (a) with a greedy two-pointer scan; solve (b) with a contiguous match (`s in t` or KMP).",
    "Reasoning: a subsequence check advances through t matching s's characters in order in O(|t|); a substring search must find an unbroken block, a fundamentally different scan.",
    "Answer: (a) subsequence — greedy two-pointer scan, O(|t|); (b) substring — contiguous match (`s in t` or KMP), a different problem.",
  ],
  "lesson:dp-state-transitions:dpst-choose-1": [
    "Goal: for a long price series, choose between comparing all (buy, sell) pairs in O(n²) and a rolling-state O(n) scan, and name the state.",
    "The costly baseline is the O(n²) double loop over all buy/sell pairs.",
    "Key property: the best sell at day i only depends on the cheapest price seen before it, so a small running summary suffices.",
    "Approach: scan once, maintaining a rolling state and updating the answer each day.",
    "Reasoning: tracking (cheapest price so far, best profit so far) lets each day update both in O(1), replacing the quadratic pairwise comparison with one linear pass.",
    "Answer: the O(n) rolling-state scan — minimal state (cheapest price so far, best profit so far), updated per day in one pass.",
  ],
  "lesson:dp-climbing-stairs:dpcs-choose-1": [
    "Goal: count ways to reach step n for very large n — naive recursion, memoized recursion, or rolling-variable bottom-up.",
    "The costly options are naive recursion (exponential) and even memoized recursion (O(n) cache and recursion-depth risk) for very large n.",
    "Key property: each answer depends only on the previous two, so you never need the full table or the call stack.",
    "Approach: iterate bottom-up keeping just two rolling variables.",
    "Reasoning: rolling variables give O(n) time and O(1) space with no recursion-limit risk; memoization is O(n) time but spends O(n) cache/stack, and naive recursion is exponential.",
    "Answer: rolling-variable bottom-up — O(n) time, O(1) space, no recursion limit; naive recursion is exponential and memoized recursion costs O(n) cache and stack.",
  ],
  "lesson:dp-house-robber:dphr-choose-1": [
    "Goal: for houses [2,7,9,3,1] with no two adjacent robbed, choose between a naive greedy and DP, and give each result.",
    "The costly trap is greedy: grabbing the richest house first can block a better combination.",
    "Key property: the optimal choice at each house depends on the best of the two prior subproblems, not on a locally richest pick.",
    "Approach: use DP where dp[i] = max(dp[i-1], dp[i-2] + house[i]).",
    "Reasoning: DP yields 12 (rob 2, 9, 1), while a greedy grabbing 9 first ends at 11; the adjacency constraint makes locally greedy choices unreliable, so DP is required.",
    "Answer: DP is correct — 12 (rob 2, 9, 1); the naive greedy grabbing 9 first ends at 11, so greedy is unreliable here.",
  ],
  "lesson:dp-lcs:dplcs-choose-1": [
    "Goal: find the longest run of characters common to two strings that is CONTIGUOUS in both — is that LCS or something else?",
    "The error is applying LCS, which permits gaps and so overcounts for a contiguity requirement.",
    "Key property: 'contiguous in both' forbids gaps, so a mismatch must break the run entirely.",
    "Approach: use the longest common SUBSTRING DP, where dp[i][j] extends on a match and resets to 0 on a mismatch.",
    "Reasoning: resetting on mismatch enforces contiguity, unlike LCS which carries the best-with-gaps value across mismatches; the answer is the max cell, not dp[m][n].",
    "Answer: not LCS — it's the longest common SUBSTRING (contiguous), a DP that resets a cell to 0 on mismatch, whereas LCS allows gaps.",
  ],
  "lesson:dp-divide-and-conquer:dpdc-choose-1": [
    "Goal: compute maximum subarray sum on a huge array under tight time limits — divide-and-conquer O(n log n) or Kadane's O(n).",
    "The costlier option is divide-and-conquer: its O(n log n) recursion is slower and uses stack space.",
    "Key property: the best subarray ending at each index extends from a running sum, so one left-to-right pass suffices.",
    "Approach: use Kadane's algorithm, tracking the best sum ending here and the best overall.",
    "Reasoning: Kadane's is O(n) time and O(1) space, strictly faster here; divide-and-conquer is valuable for teaching the paradigm but not the fastest option.",
    "Answer: Kadane's O(n) — asymptotically faster and O(1) space; divide-and-conquer's O(n log n) is for teaching the paradigm, not speed here.",
  ],
  "lesson:fenwick-tree:fen-choose-1": [
    "Goal: serve many range-SUM queries on an array whose entries are updated frequently — static prefix-sum array or Fenwick tree.",
    "The costly choice is a static prefix-sum array: each update invalidates it, forcing an O(n) rebuild.",
    "Key property: updates and range-sum queries interleave, so BOTH must be fast — a static precompute can't absorb frequent writes.",
    "Approach: use a Fenwick (binary indexed) tree.",
    "Reasoning: a Fenwick tree does both point update and prefix/range sum in O(log n); the prefix array answers queries in O(1) but needs O(n) per update, which is too slow when updates are frequent.",
    "Answer: a Fenwick tree — O(log n) for both update and query, versus a prefix array's O(1) query but O(n) rebuild per update.",
  ],
  "lesson:segment-tree:seg-choose-1": [
    "Goal: serve range-MINIMUM queries with point updates — Fenwick tree or segment tree.",
    "The costly misfit is a Fenwick tree: minimum can't be undone, so prefix-difference tricks don't recover an arbitrary range min.",
    "Key property: minimum is non-invertible (there is no subtraction for min), unlike sums where prefix differences work.",
    "Approach: use a segment tree that stores each segment's minimum and combines children on query.",
    "Reasoning: the segment tree answers arbitrary range-min in O(log n) by merging O(log n) segment minima, which a Fenwick tree can't do because min lacks an inverse.",
    "Answer: a segment tree — minimum is non-invertible so a Fenwick tree can't do range min; the segment tree stores per-segment minima and answers in O(log n).",
  ],
  "lesson:kmp:kmp-choose-1": [
    "Goal: find all occurrences of a pattern in a huge text with a worst-case time guarantee against adversarial inputs — naive scanning or KMP.",
    "The costly risk with naive scanning is backtracking: on inputs like 'aaaa...a' with pattern 'aa...ab' it degrades to O(n·m).",
    "Key property: the pattern's own structure (its longest proper prefix-suffix overlaps) tells you how far to shift without rescanning the text.",
    "Approach: use KMP, precomputing the failure/prefix function and advancing through the text without ever moving the text pointer backward.",
    "Reasoning: KMP guarantees O(n + m) regardless of input because it never rescans text, whereas naive scanning's worst case is exploitable by adversarial inputs.",
    "Answer: KMP — guaranteed O(n + m) even on adversarial inputs where naive scanning degrades to O(n·m), because KMP never rescans the text.",
  ],
});
