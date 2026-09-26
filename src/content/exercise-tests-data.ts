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
    "# The fixed loop must terminate and i must reach 3.\nassert i == 3, f'loop should end with i == 3, got {i}'\nprint('OK')",
  "lesson:loops:loop-complete-1":
    "assert count == 2, f'expected 2 evens in [4,7,10,3], got {count}'\nprint('OK')",
  "lesson:functions:func-complete-1":
    "assert square(6) == 36\nassert square(0) == 0\nassert square(-3) == 9\nprint('OK')",

  "lesson:references-mutation:ref-fix-1":
    "src = [1, 2, 3]\nout = doubled(src)\nassert src == [1, 2, 3], f'caller list must be intact, got {src}'\nassert out == [1, 2, 3, 3], f'result should append the last element, got {out}'\nassert out is not src\nprint('OK')",
  "lesson:classes:class-complete-1":
    "c = Counter(5)\nassert c.value == 5\nc.reset()\nassert c.value == 0, f'reset should zero value, got {c.value}'\nc2 = Counter(0)\nc2.reset()\nassert c2.value == 0\nprint('OK')",

  "lesson:correctness:correct-fix-1":
    "assert sum_to(5) == 15, f'1+..+5 == 15, got {sum_to(5)}'\nassert sum_to(1) == 1\nassert sum_to(0) == 0\nprint('OK')",

  // ── Arrays ─────────────────────────────────────────────────────────────
  "lesson:array-traversal:arr-trav-complete-1":
    "assert total == 17, f'5+2+9+1 == 17, got {total}'\nprint('OK')",
  "lesson:two-pointers:tp-fix-1":
    "assert arr == [3, 2, 1], f'array should be reversed, got {arr}'\nprint('OK')",
  "lesson:prefix-sums:ps-complete-1":
    "# prefix[i] = sum of first i elements. For nums=[2,4,1,3] prefix=[0,2,6,7,10].\nprefix = [0, 2, 6, 7, 10]\nassert range_sum(prefix, 1, 3) == 5, 'nums[1:3] = 4+1 = 5'\nassert range_sum(prefix, 0, 4) == 10\nassert range_sum(prefix, 2, 2) == 0\nprint('OK')",

  "lesson:kadane:kad-fix-1":
    "assert max_sub([-2, -3, -1, -4]) == -1, 'all-negative: best single element'\nassert max_sub([1, 2, 3]) == 6\nassert max_sub([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6\nprint('OK')",
  "lesson:in-place-modification:ip-complete-1":
    "nums = [3, 2, 2, 3]\nn = remove_val(nums, 3)\nassert n == 2, f'two non-3 values remain, got {n}'\nassert sorted(nums[:n]) == [2, 2]\nnums2 = [1]\nassert remove_val(nums2, 1) == 0\nprint('OK')",
  "lesson:matrix-traversal:mat-complete-1":
    "assert total == 21, f'sum of 1..6 == 21, got {total}'\nprint('OK')",
  "lesson:intervals:int-fix-1":
    "out = merge([[2, 3], [1, 5], [4, 6]])\nnorm = [list(x) for x in out]\nassert norm == [[1, 6]], f'overlapping intervals merge to [1,6], got {norm}'\nout2 = merge([[1, 2], [5, 6]])\nassert [list(x) for x in out2] == [[1, 2], [5, 6]]\n# touching intervals [1,3],[3,5] must merge (needs <= and the sort): a version\n# using strict < would leave them separate.\nout3 = merge([[3, 5], [1, 3]])\nassert [list(x) for x in out3] == [[1, 5]], f'touching intervals should merge, got {out3}'\nprint('OK')",

  // ── Strings ────────────────────────────────────────────────────────────
  "lesson:string-frequency:sf-complete-1":
    "# Script contract: the learner's final `freq` dict is in scope.\nassert freq == {'a': 1, 'p': 2, 'l': 1, 'e': 1}, f'apple frequency wrong, got {freq}'\nassert freq['p'] == 2, f'two p in apple, got {freq.get(\"p\")}'\nassert sum(freq.values()) == 5, f'total chars must equal len(s)=5, got {sum(freq.values())}'\nprint('OK')",
  "lesson:string-two-pointers:stp-complete-1":
    "assert is_palindrome('racecar') is True, 'racecar is a palindrome'\nassert is_palindrome('abca') is False, 'abca is not a palindrome'\nassert is_palindrome('') is True, 'empty string is a palindrome'\nassert is_palindrome('a') is True, 'single char is a palindrome'\nassert is_palindrome('ab') is False, 'ab is not a palindrome'\nprint('OK')",
  "lesson:string-parsing:sp-complete-1":
    "# Script contract: the learner builds `nums` from the line.\nassert nums == [3, 9, 2, 7], f'parsed ints wrong, got {nums}'\nassert all(isinstance(x, int) for x in nums), f'values must be ints, got {nums}'\nassert max(nums) == 9, f'max should be 9, got {max(nums)}'\nprint('OK')",
  "lesson:palindromes:pal-complete-1":
    "assert is_palindrome('racecar') is True\nassert is_palindrome('hello') is False\nassert is_palindrome('') is True, 'empty string is a palindrome'\nassert is_palindrome('x') is True\nassert is_palindrome('ab') is False\nprint('OK')",
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
    "# Weighted undirected: each edge (u,v,w) appears in BOTH u and v lists.\nadj = build([(0, 1, 5), (1, 2, 3)])\nassert (1, 5) in adj[0], f'0 links to 1 with weight 5, got {adj[0]}'\nassert (0, 5) in adj[1], f'undirected: 1 links back to 0, got {adj[1]}'\nassert (2, 3) in adj[1] and (1, 3) in adj[2], 'both directions of the 1-2 edge'\nassert len(adj[1]) == 2, f'vertex 1 has two incident edges, got {adj[1]}'\nassert sorted(w for _, w in adj[0]) == [5], 'weight preserved on the stored tuple'\nprint('OK')",
  "lesson:graph-bfs:gbfs-complete-1":
    "from collections import defaultdict\nadj = defaultdict(list, {0: [1, 2], 1: [0, 3], 2: [0], 3: [1], 4: [5], 5: [4]})\nr = reachable(adj, 0)\nassert r == {0, 1, 2, 3}, f'component of 0 is {{0,1,2,3}}, got {r}'\nassert 4 not in r and 5 not in r, 'disconnected component 4-5 is unreachable'\nassert reachable(adj, 4) == {4, 5}, 'the other component'\nsolo = defaultdict(list, {7: []})\nassert reachable(solo, 7) == {7}, 'isolated vertex reaches only itself'\nprint('OK')",
  "lesson:graph-dfs:gdfs-complete-1":
    "from collections import defaultdict\nadj = defaultdict(list, {0: [1, 2], 1: [3], 2: [], 3: []})\norder = dfs_iter(adj, 0)\nassert set(order) == {0, 1, 2, 3}, f'visits every reachable node once, got {order}'\nassert len(order) == len(set(order)), 'no node recorded twice'\nassert order[0] == 0, 'starts at the start node'\n# Every non-start node must appear after a node that links to it (valid DFS walk).\npos = {v: k for k, v in enumerate(order)}\nassert pos[3] > pos[1], '3 is discovered after its only parent 1'\nsolo = defaultdict(list, {9: []})\nassert dfs_iter(solo, 9) == [9], 'isolated start'\nprint('OK')",
  "lesson:connected-components:cc-complete-1":
    "# Two components: {0,1,2} size 3 and {3,4} size 2 -> largest is 3.\nassert largest(5, [(0, 1), (1, 2), (3, 4)]) == 3, 'largest component has 3 nodes'\n# All isolated -> every component size 1.\nassert largest(4, []) == 1, 'no edges: largest component is a single vertex'\n# One big chain.\nassert largest(4, [(0, 1), (1, 2), (2, 3)]) == 4, 'single component spanning all'\n# Singleton graph.\nassert largest(1, []) == 1, 'one vertex'\nprint('OK')",
  "lesson:graph-cycle-detection:cyc-fix-1":
    "from collections import defaultdict\n# The fragment defines dfs(node, parent) using globals `seen` and `adj`.\n# Tree (no cycle): 0-1, 0-2. The buggy version wrongly reports the arrival\n# edge (child seeing its parent) as a cycle; the fixed one excludes the parent.\nadj = defaultdict(list, {0: [1, 2], 1: [0], 2: [0]})\nseen = set()\nassert dfs(0, -1) is False, 'a tree has no cycle (parent edge must be excluded)'\n# Real cycle: triangle 0-1-2-0.\nadj = defaultdict(list, {0: [1, 2], 1: [0, 2], 2: [0, 1]})\nseen = set()\nassert dfs(0, -1) is True, 'triangle contains a cycle'\nprint('OK')",
  "lesson:shortest-paths-unweighted:spu-complete-1":
    "from collections import defaultdict\nadj = defaultdict(list, {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]})\ndist, parent = bfs_parents(adj, 0)\nassert dist == {0: 0, 1: 1, 2: 1, 3: 2}, f'BFS layer distances wrong, got {dist}'\nassert parent[0] is None, 'start has no parent'\nassert parent[1] == 0 and parent[2] == 0, 'both discovered directly from 0'\nassert parent[3] in (1, 2), f'3 discovered from a distance-1 node, got {parent[3]}'\n# Reconstruct the path 3 -> ... -> 0 and check it ends at the start.\nnode, path = 3, []\nwhile node is not None:\n    path.append(node)\n    node = parent[node]\nassert path[-1] == 0 and len(path) == 3, f'path has 3 hops back to 0, got {path}'\nprint('OK')",
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
    "# Script contract: FIFO use of a deque. After enqueue 1,2,3 the front is 1.\nassert first == 1, f'FIFO dequeue returns the earliest item, got {first}'\nassert list(q) == [2, 3], f'front removed, 2 and 3 remain in order, got {list(q)}'\nprint('OK')",

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
    "# The bug stores the live `path` (alias), so every recorded subset ends as [].\nnums = [1, 2, 3]\nres = []\nbt(0, [])\ngot = sorted(tuple(x) for x in res)\nexpected = sorted([(), (1,), (1, 2), (1, 2, 3), (1, 3), (2,), (2, 3), (3,)])\nassert got == expected, f'snapshots must be independent copies, got {got}'\nassert sum(len(s) for s in res) == 12, f'total elements across subsets is 12, got {sum(len(s) for s in res)}'\nprint('OK')",
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
    "sys.stdout = _orig\n_out = _buf.getvalue().strip()\nassert _out == '14', f\"double of 7 should be 14, got {_out!r} (string version prints 77)\"\nprint('OK')",
  "lesson:errors:err-complete-1":
    "sys.stdout = _orig\n_out = _buf.getvalue().strip()\nassert _out == 'undefined', f\"division by zero should print undefined, got {_out!r}\"\nprint('OK')",
  "lesson:sliding-window:sw-complete-1":
    "assert window == sum(nums[-k:]), f'after sliding, window should be sum of last k = {sum(nums[-k:])}, got {window}'\nassert window == 14, f'expected 14, got {window}'\nprint('OK')",
  "lesson:binary-search-answer:bsa-fix-1":
    "assert lo == 5, f'answer-search should converge to 5, got {lo}'\nassert lo == hi\nprint('OK')",
  "lesson:bubble-sort:bub-fix-1":
    "assert a == [1, 2, 4, 5, 8], f'array should be sorted, got {a}'\nprint('OK')",
  "lesson:selection-sort:sel-complete-1":
    "assert a == [1, 2, 4, 5, 8], f'selection sort should sort, got {a}'\nprint('OK')",
  "lesson:insertion-sort:ins-fix-1":
    "assert a == [1, 2, 4, 5, 8], f'insertion sort should sort, got {a}'\nprint('OK')",
  "lesson:counting-sort:cnt-complete-1":
    "assert counts == [1, 1, 2, 3], f'counts should tally each value, got {counts}'\nassert sum(counts) == len(a)\nprint('OK')",
  "lesson:radix-sort:rad-complete-1":
    "assert buckets[0] == [40], f'ones digit 0 bucket, got {buckets[0]}'\nassert buckets[3] == [23], f'ones digit 3, got {buckets[3]}'\nassert buckets[5] == [45, 5], f'ones digit 5 in order, got {buckets[5]}'\nassert buckets[2] == [12]\nassert sum(len(b) for b in buckets) == len(out)\nprint('OK')",
  "lesson:comparators:cmp-complete-1":
    "sys.stdout = _orig\n_out = _buf.getvalue().strip()\nassert _out == str([('Cy', 25), ('Al', 30), ('Bo', 30)]), f'sort by age then name, got {_out!r}'\nprint('OK')",
  "lesson:interval-sorting:isort-complete-1":
    "sys.stdout = _orig\n_out = _buf.getvalue().strip()\nassert _out == str([[2, 3], [1, 5], [4, 6]]), f'sort by end time, got {_out!r}'\nprint('OK')",
  "lesson:monotonic-stack:mono-fix-1":
    "assert stack == [2, 3], f'stack should hold indices of a decreasing run ending at end, got {stack}'\n# All entries must be valid indices, not values (value-storing buggy version gives [1,5,3]).\nassert all(0 <= s < len(nums) for s in stack), f'stack must contain indices, got {stack}'\nprint('OK')",
  "lesson:expression-evaluation:expr-fix-1":
    "assert stack == [2], f'5 - 3 should be 2 (correct operand order), got {stack}'\nprint('OK')",
  "lesson:bfs-queues:bfs-fix-1":
    "assert sorted(order) == [0, 1, 2, 3], f'BFS should visit each node, got {order}'\nassert len(order) == len(set(order)), f'no node visited twice, got {order}'\nassert order[0] == 0\n# The fixed version enqueues each of the 3 non-start nodes exactly once.\n# The buggy 'mark on dequeue' version enqueues a node once per in-edge (more).\nassert _appends['n'] == 3, f'each non-start node enqueued exactly once (buggy over-enqueues), got {_appends[\"n\"]}'\nprint('OK')",
  "lesson:prefix-sums-map:psm-fix-1":
    "assert count == 2, f'subarrays summing to 3: [3] and [1,2] = 2 (buggy misses the prefix one), got {count}'\nprint('OK')",
  "lesson:top-k:topk-fix-1":
    "assert sorted(h) == [4, 7, 8], f'heap should retain the k largest (buggy keeps smallest), got {sorted(h)}'\nassert len(h) == k\nprint('OK')",
  "lesson:two-heap-pattern:twoheap-fix-1":
    "assert len(small) >= len(large), f'after rebalance small must not be smaller than large (buggy leaves large bigger), got small={small} large={large}'\nassert len(small) - len(large) <= 1\nassert len(small) + len(large) == 1\nprint('OK')",
  "lesson:topological-sort:topo-complete-1":
    "assert indeg == {0: 0, 1: 0, 2: 0, 3: 2}, f'processing node 0 decrements indeg of 1 and 2, got {indeg}'\nassert list(q) == [1, 2], f'nodes that reached indeg 0 are queued, got {list(q)}'\nprint('OK')",
  "lesson:multi-source-bfs:msbfs-fix-1":
    "assert dist == [0, -1, -1, -1, 0], f'all sources start at distance 0, got {dist}'\nassert sorted(q) == [0, 4], f'all sources enqueued, got {sorted(q)}'\nprint('OK')",
  "lesson:dijkstra:dij-fix-1":
    "assert dist == [0, 1, 2, 3], f'shortest distances from 0, got {dist}'\n# With the stale-skip each of the 4 nodes expands its neighbor list exactly once.\n# The buggy version also expands stale duplicate pops -> more than 4 expansions.\nassert _expand['n'] == 4, f'stale entries must be skipped (buggy over-expands), got {_expand[\"n\"]}'\nprint('OK')",
  "lesson:bellman-ford:bf-complete-1":
    "d = bellman_ford([(0, 1, 4), (0, 2, 5), (1, 2, -2), (2, 3, 3)], 4, 0)\nassert d == [0, 4, 2, 5], f'shortest distances, got {d}'\n# Negative cycle 0->1->0 with total -1 must be detected.\nassert bellman_ford([(0, 1, 1), (1, 0, -2)], 2, 0) is None, 'negative cycle -> None'\n# No-cycle single edge.\nassert bellman_ford([(0, 1, 7)], 2, 0) == [0, 7], 'simple two-node graph'\nprint('OK')",
  "lesson:floyd-warshall:fw-fix-1":
    "assert d[0] == [0, 3, 5, 6], f'row 0 all-pairs shortest, got {d[0]}'\nassert d[1] == [5, 0, 2, 3], f'row 1, got {d[1]}'\nassert d[2] == [3, 6, 0, 1], f'row 2, got {d[2]}'\nassert d[3] == [2, 5, 7, 0], f'row 3, got {d[3]}'\nprint('OK')",
  "lesson:prim:prim-fix-1":
    "assert all(visited), f'every vertex must be included, got {visited}'\nassert total == 6, f'MST weight is 0+1+2+3 = 6 (buggy revisits and overcounts), got {total}'\nprint('OK')",
  "lesson:linked-list-traversal:ll-fix-1":
    "sys.stdout = _orig\n_out = _buf.getvalue().split()\nassert _out == ['1', '2', '3'], f'traversal must print each value once and terminate, got {_out}'\nprint('OK')",
  "lesson:linked-list-slow-fast:llsf-fix-1":
    "assert slow.val == 2, f'middle of [1,2,3] is 2 (buggy crashes on the None.next.next), got {slow.val}'\nprint('OK')",
  "lesson:linked-list-merging:llm-complete-1":
    "# Both fronts tie at val 1; the stable merge (<=) splices the LEFT node first.\nfirst = dummy.next\nassert first is not None and first.val == 1, f'a node must be spliced, got {first}'\nassert first.src == 'L', f'on a tie the left list is taken first (needs <=), got {first.src!r}'\nprint('OK')",
  "lesson:linked-list-pointer-manipulation:llpm-complete-1":
    "vals = []\nnode = dummy.next\nwhile node is not None:\n    vals.append(node.val)\n    node = node.next\nassert vals == [2, 1, 4, 3], f'adjacent pairs swapped, got {vals}'\nprint('OK')",
  "lesson:linked-list-pointer-manipulation:llpm-fix-1":
    "# After swapping (1,2) -> (2,1), prev must advance to node 1 so the NEXT pair\n# (3,4) is processed. The buggy version sets prev=second (node 2), skipping node 1.\nassert prev.val == 1, f'prev must land on the trailing node of the swapped pair (1), got {prev.val}'\nassert prev.next.val == 3, f'the next pair starts at 3, got {prev.next.val}'\nprint('OK')",
  "lesson:linked-list-variants:llv-complete-1":
    "assert tail.val == 2, f'tail advanced to the new node, got {tail.val}'\nassert tail.prev is not None and tail.prev.val == 1, f'new node links back to old tail, got {tail.prev}'\nassert tail.prev.next is tail, 'old tail links forward to the new node'\nprint('OK')",
  "lesson:dp-base-cases:dpbc-fix-1":
    "assert fact(0) == 1, '0! == 1 (base case)'\nassert fact(1) == 1, '1! == 1'\nassert fact(5) == 120, '5! == 120'\nassert fact(6) == 720\n_orig = fact\n_calls = [0]\ndef fact(n):\n    _calls[0] += 1\n    return _orig(n)\nassert fact(3) == 6, '3! == 6'\n# fact(3) -> fact(2) -> fact(1) stops: exactly 3 calls. A base case of n<1 would\n# recurse once more (down to fact(0)) giving 4 calls.\nassert _calls[0] == 3, f'base case must stop at n<=1 (3 calls for fact(3)), got {_calls[0]}'\nprint('OK')",
  "lesson:dp-permutations:dpperm-complete-1":
    "got = sorted(tuple(p) for p in res)\nexpected = sorted([(1, 2, 3), (1, 3, 2), (2, 1, 3), (2, 3, 1), (3, 1, 2), (3, 2, 1)])\nassert got == expected, f'all 6 permutations, got {got}'\nassert all(len(p) == 3 for p in res), 'each permutation uses all elements'\nprint('OK')",
  "lesson:dp-permutations:dpperm-fix-1":
    "# The fragment runs one iteration (i=0): choose nums[0]=1, explore, then undo.\n# Exploring must populate res with the permutations that start with 1 (this fails\n# for the 'empty' submission, which never calls bt). The FIX also clears\n# used[0] on backtrack (the buggy version leaves it True).\ngot = sorted(tuple(p) for p in res)\nassert got == [(1, 2, 3), (1, 3, 2)], f'exploring i=0 yields perms starting with 1, got {got}'\nassert used[0] is False, f'used[0] must be cleared after backtracking (buggy leaves it True), got {used[0]}'\nassert path == [], f'path must be restored to empty, got {path}'\nprint('OK')",
  "lesson:dp-knapsack:dpks-complete-1":
    "# Item index1 weighs 3, value 4. At capacity 3, take = dp[1][0]+4 = 4 beats skip = dp[1][3] = 3.\nassert dp[2][3] == 4, f'should take the better (take) option = 4, got {dp[2][3]}'\nprint('OK')",
  "lesson:dp-subsequences:dpsub-complete-1":
    "assert is_subsequence('abc', 'ahbgdc') is True, 'abc is a subsequence of ahbgdc'\nassert is_subsequence('axc', 'ahbgdc') is False, 'axc is not a subsequence'\nassert is_subsequence('', 'anything') is True, 'empty is always a subsequence'\nassert is_subsequence('abc', '') is False, 'non-empty cannot be a subsequence of empty'\nassert is_subsequence('aaa', 'aa') is False, 'needs three a but only two available'\nprint('OK')",

  // ── R6 runnable fragments (indices 41-80 of remaining) ─────────────
  "lesson:dp-grid-paths:dpgp-fix-1":
    "# grid = [[1,3,1],[1,5,1],[4,2,1]]; min path sum top-left -> bottom-right is 7.\n# The buggy version leaves the top row / left column as zeros, so interior cells\n# read wrong predecessors and dp[m-1][n-1] is understated.\nassert dp[0][1] == 4, f'top-row prefix must be filled (1+3), got {dp[0][1]}'\nassert dp[1][0] == 2, f'left-column prefix must be filled (1+1), got {dp[1][0]}'\nassert dp[m - 1][n - 1] == 7, f'min path sum should be 7, got {dp[m - 1][n - 1]}'\nprint('OK')",
  "lesson:dp-lcs:dplcs-complete-1":
    "# Match branch: a[0]==b[0]=='a', so dp[1][1] = dp[0][0] + 1 = 1.\nassert dp[1][1] == 1, f'matching chars extend the diagonal to 1, got {dp[1][1]}'\n# Mismatch branch: recompute with i,j pointing at differing chars.\ni, j = 1, 2\ndp = [[0, 0, 0], [0, 0, 2]]\n# a[0]='a', b[1]='b' differ -> take max(dp[0][2], dp[1][1]) = max(0, 0)... set up a\n# clear winner: left neighbour dp[1][1]=5, top dp[0][2]=3 -> should pick 5.\ndp = [[0, 0, 3], [0, 5, 0]]\nif a[i - 1] == b[j - 1]:\n    dp[i][j] = dp[i - 1][j - 1] + 1\nelse:\n    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\nassert dp[1][2] == 5, f'mismatch takes the better neighbour (5), got {dp[1][2]}'\nprint('OK')",
  "lesson:dp-n-queens:dpnq-fix-1":
    "# One placement then backtrack must fully restore all three constraint sets.\n# The buggy version forgets to remove from diag1/diag2, leaking conflicts.\nassert cols == set(), f'cols must be restored empty, got {cols}'\nassert diag1 == set(), f'diag1 must be restored empty (buggy leaves the entry), got {diag1}'\nassert diag2 == set(), f'diag2 must be restored empty (buggy leaves the entry), got {diag2}'\nassert _bt_calls['n'] == 1, f'bt(row+1) must be called exactly once, got {_bt_calls[\"n\"]}'\nprint('OK')",
  "pattern:kadane:pat-kadane-fix-1":
    "assert kadane([-2, -3, -1, -4]) == -1, 'all-negative: best is the single largest element (-1), not 0'\nassert kadane([1, 2, 3]) == 6, 'all-positive: whole array'\nassert kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6, 'classic mixed case'\nassert kadane([5]) == 5, 'single element'\nassert kadane([-7]) == -7, 'single negative element'\nprint('OK')",
  "pattern:bfs-shortest-path:pat-bfs-fix-1":
    "# Diamond where DFS (a stack) discovers node 4 via the long branch first:\n# 0->1->4 is 2 hops, 0->2->3->4 is 3 hops. BFS gives dist[4]==2; a stack-based\n# walk labels 4 from node 3 (dist 3) before the short path is taken.\nassert dist[0] == 0, 'start distance is 0'\nassert dist[1] == 1 and dist[2] == 1, f'direct neighbours are 1 hop, got {dist}'\nassert dist[4] == 2, f'4 must be the true shortest distance 2 (a stack/DFS reports 3), got {dist[4]}'\nprint('OK')",
  "pattern:backtracking:pat-bt-fix-1":
    "# Subsets of [1,2] via choose/explore/undo. The aliasing bug appends the SAME\n# list object repeatedly, so every recorded subset ends up [] after the pops.\nbt(0, path)\nassert res[0] == [], 'first recorded subset is the empty prefix'\ngot = sorted(res, key=lambda s: (len(s), s))\nassert got == [[], [1], [2], [1, 2]], f'all four subsets recorded as snapshots, got {got}'\nassert path == [], f'path fully unwound at the end, got {path}'\nprint('OK')",
  "pattern:two-heaps:pat-th-fix-1":
    "# small starts as [-10] (a max-heap of negated values, representing 10) and\n# num=5. The FIX pushes -5, then moves the true MAXIMUM of the lower half (10)\n# up to large: small ends [-5] (representing 5), large ends [10].\n# The buggy version pushes the raw 5, so heappop returns -10 (a spurious min),\n# leaving small=[5] and large=[-10] -- a broken partition.\nassert self.large == [10], f'the largest of the lower half (10) must move up (needs negation); got large={self.large}'\nassert self.small == [-5], f'lower half keeps 5 as a negated max-heap; got small={self.small}'\nlower_vals = sorted(-v for v in self.small)\nupper_vals = sorted(self.large)\nassert all(lo <= up for lo in lower_vals for up in upper_vals), f'every lower <= every upper, got lower={lower_vals} upper={upper_vals}'\nprint('OK')",
  "pattern:k-way-merge:pat-kwm-fix-1":
    "# The fixed tuple carries (val, i, j) so equal front values break the tie on\n# the integer index i, never on the list object. The buggy (val, lst) stores\n# 2-tuples whose second element is a list.\nassert len(heap) == 2, f'both non-empty lists seeded, got {len(heap)}'\nassert all(len(e) == 3 for e in heap), f'entries must be (val, i, j) triples, not (val, lst) pairs, got {heap}'\nassert all(isinstance(e[1], int) and isinstance(e[2], int) for e in heap), f'the tiebreakers must be integer indices, got {heap}'\nfirst = heapq.heappop(heap)\nassert first == (1, 0, 0), f'smallest front is list 0 position 0, got {first}'\nsecond = heapq.heappop(heap)\nassert second == (1, 1, 0), f'the tie resolves to list 1 via the index tiebreaker, got {second}'\nprint('OK')",
  "pattern:monotonic-stack:pat-ms-fix-1":
    "# next greater element to the right; -1 where none. nums = [2, 1, 2, 4, 3].\nassert res == [4, 2, 4, -1, -1], f'next greater to the right, got {res}'\n# The buggy '>' comparison resolves the wrong entries, leaving values that\n# should have a greater-to-the-right unset (-1).\nassert res[0] == 4 and res[3] == -1, f'2 -> 4 and 4 -> none, got {res}'\nprint('OK')",
  "pattern:merge-intervals:pat-mi-fix-1":
    "# Sorting by START ([1,4],[2,3],[4,5]) merges all three into [1,5]: [2,3] is\n# contained, and [4,5] touches at 4 (needs the <= overlap test). Sorting by END\n# instead starts from [2,3] and yields [2,5] -- a different, wrong span, which\n# catches the wrong-key bug. A strict < overlap test would leave [4,5] separate.\nnorm = [list(x) for x in merged]\nassert norm == [[1, 5]], f'all three merge into [1,5] (needs sort-by-start AND the <= touch test), got {norm}'\nprint('OK')",
  "pattern:cyclic-sort:pat-cs-fix-1":
    "# With a duplicate the buggy version swaps 0<->0 forever. The guard advances i.\nassert nums == [0, 1, 2, 2], f'array settled with the duplicate in place, got {nums}'\nprint('OK')",
  "pattern:matrix-traversal:pat-mt-fix-1":
    "# Single-row matrix: without the guards the bottom row (== top row) is walked\n# again, double-visiting cells. Expect each cell exactly once.\nassert res == [1, 2, 3], f'single row visited once each, got {res}'\nassert len(res) == len(set(res)), f'no cell double-visited, got {res}'\nprint('OK')",
  "pattern:tree-bfs:pat-tbfs-fix-1":
    "# Level order must group by depth. Without snapshotting len(q) all values land\n# in one flat level.\nassert res == [[1], [2, 3], [4, 5]], f'nodes grouped by level, got {res}'\nprint('OK')",
  "pattern:tree-dfs:pat-tdfs-fix-1":
    "class _T:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nres = []\n# root 1 -> (2 -> 4,5), (3). Root-to-leaf paths: [1,2,4],[1,2,5],[1,3].\nroot = _T(1, _T(2, _T(4), _T(5)), _T(3))\ndfs(root, [])\ngot = sorted(res)\nassert got == [[1, 2, 4], [1, 2, 5], [1, 3]], f'root-to-leaf paths; missing path.pop() leaks state, got {got}'\nprint('OK')",
  "pattern:graph-dfs-components:pat-gdc-fix-1":
    "# Cyclic graph 0-1-2-0. Without the seen-guard the DFS recurses forever;\n# with it every node is visited exactly once.\ndfs(0)\nassert seen == {0, 1, 2}, f'all reachable nodes visited once, got {seen}'\nprint('OK')",
  "pattern:topological-sort:pat-topo-fix-1":
    "# DAG 0->2, 1->2, 2->3. A valid topo order must place 2 after both 0 and 1,\n# and 3 last. Enqueuing before indeg hits 0 corrupts this.\npos = {v: k for k, v in enumerate(order)}\nassert set(order) == {0, 1, 2, 3}, f'every node ordered once, got {order}'\nassert pos[2] > pos[0] and pos[2] > pos[1], f'2 comes after its prerequisites, got {order}'\nassert pos[3] == 3, f'3 is last, got {order}'\nprint('OK')",
  "pattern:union-find:pat-uf-fix-1":
    "# find(self, x) is a method fragment; call it on a host exposing `parent`.\nclass _UF:\n    def __init__(self, parent):\n        self.parent = parent\n# Chain 0<-1<-2<-3. find must return root 0 for every node.\nu = _UF([0, 0, 1, 2])\nassert find(u, 3) == 0, f'root of the chain is 0, got {find(u, 3)}'\nassert find(u, 0) == 0, 'root points to itself'\n# Path compression: after find(3) the deep node hops nearer the root.\nu2 = _UF([0, 0, 1, 2])\nfind(u2, 3)\nassert u2.parent[3] != 2, f'compression must shorten parent[3] (no-compression leaves it 2), got {u2.parent[3]}'\nprint('OK')",
  "pattern:dijkstra:pat-dij-fix-1":
    "# Shortest paths from 0 on a small weighted graph.\nassert dist == [0, 1, 2, 3], f'shortest distances from 0, got {dist}'\n# With the stale-skip each node expands its neighbours at most once; the buggy\n# version reprocesses stale pops and over-expands.\nassert _expand['n'] == 4, f'stale entries skipped (buggy over-expands), got {_expand[\"n\"]}'\nprint('OK')",
  "pattern:trie-prefix:pat-trie-fix-1":
    "# search(self, word) must return True only for STORED words, not mere prefixes.\nclass _N:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\nclass _Trie:\n    def __init__(self):\n        self.root = _N()\n    def add(self, word):\n        node = self.root\n        for ch in word:\n            node = node.children.setdefault(ch, _N())\n        node.is_end = True\nt = _Trie()\nt.add('app')\nassert search(t, 'app') is True, 'stored word is found'\nassert search(t, 'ap') is False, 'a prefix that was not stored is NOT a word (buggy returns True)'\nassert search(t, 'apple') is False, 'path breaks -> not found'\nprint('OK')",
  "pattern:dynamic-programming:pat-dp-fix-1":
    "assert fib(0) == 0 and fib(1) == 1, 'base cases'\nassert fib(10) == 55, 'fib(10) == 55'\nassert fib(20) == 6765, 'fib(20) == 6765'\n# Memoization must make a large index return quickly (no exponential blow-up).\nassert fib(60) == 1548008755920, 'memoized fib(60) is exact and fast'\nprint('OK')",
  "pattern:knapsack:pat-ks-fix-1":
    "# subset-sum: can we hit target with each item used at most once?\n# nums=[3], target=6: reusing 3 twice would wrongly say yes; correct is no.\nassert dp[6] is False, f'item 3 may be used only once -> 6 is unreachable, got {dp[6]}'\nassert dp[3] is True, f'3 alone reaches 3, got {dp[3]}'\nassert dp[0] is True, 'empty subset reaches 0'\nprint('OK')",
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
  "lesson:io:io-fix-1":
    "import io, sys\ndef input(prompt=''):\n    return '7'\n_buf = io.StringIO()\n_orig = sys.stdout\nsys.stdout = _buf",
  "lesson:errors:err-complete-1":
    "import io, sys\n_buf = io.StringIO()\n_orig = sys.stdout\nsys.stdout = _buf",
  "lesson:sliding-window:sw-complete-1":
    "nums = [1, 3, 5, 2, 8, 4]\nk = 3\nwindow = sum(nums[:k])",
  "lesson:binary-search-answer:bsa-fix-1":
    "def can_ship(cap):\n    return cap >= 5\nlo, hi = 1, 10",
  "lesson:bubble-sort:bub-fix-1":
    "a = [5, 1, 4, 2, 8]\nn = len(a)",
  "lesson:selection-sort:sel-complete-1":
    "a = [5, 1, 4, 2, 8]\nn = len(a)",
  "lesson:insertion-sort:ins-fix-1":
    "a = [5, 1, 4, 2, 8]",
  "lesson:counting-sort:cnt-complete-1":
    "a = [2, 0, 2, 3, 1, 3, 3]\nhi = max(a)",
  "lesson:radix-sort:rad-complete-1":
    "out = [23, 45, 12, 5, 40]\nexp = 1\nbuckets = [[] for _ in range(10)]",
  "lesson:comparators:cmp-complete-1":
    "import io, sys\n_buf = io.StringIO()\n_orig = sys.stdout\nsys.stdout = _buf",
  "lesson:interval-sorting:isort-complete-1":
    "import io, sys\n_buf = io.StringIO()\n_orig = sys.stdout\nsys.stdout = _buf",
  "lesson:monotonic-stack:mono-fix-1":
    "nums = [2, 1, 5, 3]",
  "lesson:expression-evaluation:expr-fix-1":
    "stack = [5, 3]\nt = '-'",
  "lesson:bfs-queues:bfs-fix-1":
    "from collections import deque as _deque\n_appends = {'n': 0}\nclass deque(_deque):\n    def append(self, x):\n        _appends['n'] += 1\n        super().append(x)\ngraph = {0: [1, 2], 1: [0, 2, 3], 2: [0, 1], 3: [1]}\nstart = 0",
  "lesson:prefix-sums-map:psm-fix-1":
    "nums = [3, 1, 2]\nk = 3",
  "lesson:top-k:topk-fix-1":
    "import heapq\nnums = [4, 1, 7, 3, 8, 2]\nk = 3",
  "lesson:two-heap-pattern:twoheap-fix-1":
    "import heapq\nsmall = []\nlarge = []\nx = 5",
  "lesson:topological-sort:topo-complete-1":
    "from collections import deque\nadj = {0: [1, 2], 1: [3], 2: [3], 3: []}\nindeg = {0: 0, 1: 1, 2: 1, 3: 2}\nq = deque()\nnode = 0",
  "lesson:multi-source-bfs:msbfs-fix-1":
    "from collections import deque\nn = 5\nsources = [0, 4]",
  "lesson:dijkstra:dij-fix-1":
    "import heapq\n_expand = {'n': 0}\nclass _CountAdj(dict):\n    def __getitem__(self, k):\n        _expand['n'] += 1\n        return super().__getitem__(k)\nadj = _CountAdj({0: [(1, 1), (2, 4)], 1: [(2, 1), (3, 5)], 2: [(3, 1)], 3: []})\nn = 4\ndist = [float('inf')] * n\ndist[0] = 0\npq = [(0, 0)]",
  "lesson:bellman-ford:bf-complete-1":
    "",
  "lesson:floyd-warshall:fw-fix-1":
    "INF = float('inf')\nn = 4\nd = [\n    [0, 3, INF, 7],\n    [8, 0, 2, INF],\n    [5, INF, 0, 1],\n    [2, INF, INF, 0],\n]",
  "lesson:prim:prim-fix-1":
    "import heapq\nadj = {0: [(1, 1), (2, 4)], 1: [(0, 1), (2, 2), (3, 6)], 2: [(0, 4), (1, 2), (3, 3)], 3: [(1, 6), (2, 3)]}\nn = 4\nvisited = [False] * n\ntotal = 0\npq = [(0, 0)]",
  "lesson:linked-list-traversal:ll-fix-1":
    "import io, sys\nclass Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\nhead = Node(1, Node(2, Node(3)))\n_buf = io.StringIO()\n_orig = sys.stdout\nsys.stdout = _buf",
  "lesson:linked-list-slow-fast:llsf-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\nhead = build([1, 2, 3])\nslow = head\nfast = head",
  "lesson:linked-list-merging:llm-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None, src=None):\n        self.val = val\n        self.next = nxt\n        self.src = src\na = Node(1, None, 'L')\nb = Node(1, None, 'R')\ndummy = Node(0)\ntail = dummy",
  "lesson:linked-list-pointer-manipulation:llpm-complete-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndef build(vals):\n    head = None\n    for v in reversed(vals):\n        head = Node(v, head)\n    return head\ndummy = Node(0, build([1, 2, 3, 4]))\nprev = dummy",
  "lesson:linked-list-pointer-manipulation:llpm-fix-1":
    "class Node:\n    def __init__(self, val, nxt=None):\n        self.val = val\n        self.next = nxt\ndummy = Node(0)\nfirst = Node(1)\nsecond = Node(2)\ntail = Node(3, Node(4))\ndummy.next = first\nfirst.next = second\nsecond.next = tail\nprev = dummy",
  "lesson:linked-list-variants:llv-complete-1":
    "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n        self.prev = None\ntail = Node(1)\nnode = Node(2)\nif tail is None:\n    head = node\n    tail = node",
  "lesson:dp-base-cases:dpbc-fix-1":
    "",
  "lesson:dp-permutations:dpperm-complete-1":
    "nums = [1, 2, 3]\nres = []\ndef bt(path, used):\n    if len(path) == len(nums):\n        res.append(path[:])\n        return\n    for i in range(len(nums)):\n        if used[i]:\n            continue\n        used[i] = True\n        path.append(nums[i])\n        bt(path, used)\n        path.pop()\n        used[i] = False\npath = []\nused = [False] * len(nums)",
  "lesson:dp-permutations:dpperm-fix-1":
    "nums = [1, 2, 3]\nres = []\ndef bt(path, used):\n    if len(path) == len(nums):\n        res.append(path[:])\n        return\n    for j in range(len(nums)):\n        if used[j]:\n            continue\n        used[j] = True\n        path.append(nums[j])\n        bt(path, used)\n        path.pop()\n        used[j] = False\npath = []\nused = [False] * len(nums)\ni = 0",
  "lesson:dp-knapsack:dpks-complete-1":
    "weights = [2, 3]\nvalues = [3, 4]\ndp = [[0, 0, 0, 0], [0, 0, 3, 3], [0, 0, 0, 0]]\ni = 2\nw = 3",
  "lesson:dp-subsequences:dpsub-complete-1":
    "",

  // ── R6 runnable fragments (indices 41-80 of remaining) ─────────────
  "lesson:dp-grid-paths:dpgp-fix-1":
    "grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]\nm = len(grid)\nn = len(grid[0])\ndp = [[0] * n for _ in range(m)]",
  "lesson:dp-lcs:dplcs-complete-1":
    "a = 'ab'\nb = 'ab'\ndp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]\ni = 1\nj = 1",
  "lesson:dp-n-queens:dpnq-fix-1":
    "cols = set()\ndiag1 = set()\ndiag2 = set()\nrow = 0\ncol = 0\n_bt_calls = {'n': 0}\ndef bt(r):\n    _bt_calls['n'] += 1",
  "pattern:kadane:pat-kadane-fix-1":
    "",
  "pattern:bfs-shortest-path:pat-bfs-fix-1":
    "adj = {0: [1, 2], 1: [4], 2: [3], 3: [4], 4: []}\nstart = 0",
  "pattern:backtracking:pat-bt-fix-1":
    "nums = [1, 2]\nres = []\npath = []",
  "pattern:two-heaps:pat-th-fix-1":
    "import heapq\nclass _H:\n    def __init__(self):\n        self.small = []\n        self.large = []\nself = _H()\n# small already holds 10 as a MAX-heap of negated values ([-10]).\nself.small = [-10]\nself.large = []\nnum = 5",
  "pattern:k-way-merge:pat-kwm-fix-1":
    "import heapq\n# Two lists share the same front value (1) so the tiebreaker matters.\nlists = [[1, 4], [1, 5]]\nheap = []",
  "pattern:monotonic-stack:pat-ms-fix-1":
    "nums = [2, 1, 2, 4, 3]\nstack = []\nres = [-1] * len(nums)",
  "pattern:merge-intervals:pat-mi-fix-1":
    "intervals = [[1, 4], [2, 3], [4, 5]]",
  "pattern:cyclic-sort:pat-cs-fix-1":
    "nums = [2, 0, 2, 1]",
  "pattern:matrix-traversal:pat-mt-fix-1":
    "matrix = [[1, 2, 3]]\nres = []\ntop = 0\nbottom = len(matrix) - 1\nleft = 0\nright = len(matrix[0]) - 1",
  "pattern:tree-bfs:pat-tbfs-fix-1":
    "from collections import deque\nclass _T:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\nroot = _T(1, _T(2, _T(4), None), _T(3, None, _T(5)))\nres = []",
  "pattern:tree-dfs:pat-tdfs-fix-1":
    "res = []",
  "pattern:graph-dfs-components:pat-gdc-fix-1":
    "adj = {0: [1, 2], 1: [0, 2], 2: [0, 1]}\nseen = set()",
  "pattern:topological-sort:pat-topo-fix-1":
    "from collections import deque\nadj = {0: [2], 1: [2], 2: [3], 3: []}\nindeg = {0: 0, 1: 0, 2: 2, 3: 1}\norder = []\nq = deque([0, 1])",
  "pattern:union-find:pat-uf-fix-1":
    "",
  "pattern:dijkstra:pat-dij-fix-1":
    "import heapq\n_expand = {'n': 0}\nclass _CountAdj(dict):\n    def __getitem__(self, k):\n        _expand['n'] += 1\n        return super().__getitem__(k)\nadj = _CountAdj({0: [(1, 1), (2, 4)], 1: [(2, 1), (3, 5)], 2: [(3, 1)], 3: []})\nn = 4\ndist = [float('inf')] * n\ndist[0] = 0\npq = [(0, 0)]",
  "pattern:trie-prefix:pat-trie-fix-1":
    "",
  "pattern:dynamic-programming:pat-dp-fix-1":
    "",
  "pattern:knapsack:pat-ks-fix-1":
    "nums = [3]\ntarget = 6\ndp = [False] * (target + 1)\ndp[0] = True",
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
