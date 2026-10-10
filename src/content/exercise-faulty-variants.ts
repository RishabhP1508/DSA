/**
 * R6.4 — INDEPENDENTLY AUTHORED faulty submissions, one set per coding exercise.
 *
 * The repair plan (R6.4) requires proving each coding exercise's tests reject,
 * in addition to the unfinished starter:
 *   - a PLAUSIBLE-WRONG solution (a believable but incorrect full attempt),
 *   - an EARLY-EXIT submission (returns/exits before doing the required work),
 *   - a PRINT-ANSWER submission (returns/sets a guessed answer without satisfying
 *     the contract).
 *
 * These are AUTHORED per exercise (not mechanically synthesised from the model,
 * not "n/a"): each is a complete submission in the exercise's own contract that a
 * learner might plausibly write. `scripts/verify_exercise_tests.mjs` runs each
 * against the exercise's tests and REQUIRES all three to be rejected; a missing
 * variant is a hard failure, not a pass.
 *
 * This map is VERIFICATION-ONLY: it is read by the harness, never shipped to the
 * UI and never part of the content hash. Keyed by uid `ownerKind:ownerId:exId`.
 */

export interface FaultyVariants {
  /** A believable but incorrect complete attempt. */
  plausibleWrong: string;
  /** Returns/exits before doing the required work. */
  earlyExit: string;
  /** Returns/sets a guessed answer without satisfying the contract. */
  printAnswer: string;
}

export const EXERCISE_FAULTY: Record<string, FaultyVariants> = {
  // ── Function-contract exercises (tests already call with multiple inputs) ──

  // 1 — classify(temp): hot >=30, warm 20-29, else cold.
  "lesson:conditions:cond-fix-1": {
    // Treats the 20 boundary as cold (uses > instead of >=): classify(20) wrong.
    plausibleWrong:
      "def classify(temp):\n    if temp >= 30:\n        return 'hot'\n    elif temp > 20:\n        return 'warm'\n    return 'cold'",
    // Bails out before classifying anything.
    earlyExit:
      "def classify(temp):\n    return None",
    // Hard-codes the first test's answer; fails on 'warm'/'cold' cases.
    printAnswer:
      "def classify(temp):\n    return 'hot'",
  },

  // 4 — square(n) returns n*n.
  "lesson:functions:func-complete-1": {
    // Doubles instead of squaring: right for n=0 but wrong for 6 and -3.
    plausibleWrong:
      "def square(n):\n    return n + n\nprint(square(6))",
    earlyExit:
      "def square(n):\n    return\nprint(square(6))",
    // Hard-codes square(6); fails square(0)/square(-3).
    printAnswer:
      "def square(n):\n    return 36\nprint(square(6))",
  },

  // 6 — doubled(lst) returns a copy with the last element appended; caller intact.
  "lesson:references-mutation:ref-fix-1": {
    // Copies but appends the wrong element (first, not last).
    plausibleWrong:
      "def doubled(lst):\n    copy = list(lst)\n    copy.append(copy[0])\n    return copy",
    earlyExit:
      "def doubled(lst):\n    return lst",
    // Returns a guessed literal; fails invariants and other inputs.
    printAnswer:
      "def doubled(lst):\n    return [1, 2, 3, 3]",
  },

  // 7 — Counter.reset() sets value to 0.
  "lesson:classes:class-complete-1": {
    // Resets to the start value instead of 0.
    plausibleWrong:
      "class Counter:\n    def __init__(self, start):\n        self.start = start\n        self.value = start\n    def reset(self):\n        self.value = self.start",
    // reset does nothing.
    earlyExit:
      "class Counter:\n    def __init__(self, start):\n        self.value = start\n    def reset(self):\n        return",
    // Hard-codes value=1; fails c.value==5 before reset AND reset to 0.
    printAnswer:
      "class Counter:\n    def __init__(self, start):\n        self.value = 1\n    def reset(self):\n        self.value = 1",
  },

  // 9 — sum_to(n) = 1+..+n.
  "lesson:correctness:correct-fix-1": {
    // Over-corrects: loops while i <= n+1, overshooting by one.
    plausibleWrong:
      "def sum_to(n):\n    total = 0\n    i = 1\n    while i <= n + 1:\n        total = total + i\n        i = i + 1\n    return total",
    earlyExit:
      "def sum_to(n):\n    return 0",
    // Hard-codes sum_to(5); fails sum_to(1)/sum_to(0).
    printAnswer:
      "def sum_to(n):\n    return 15",
  },

  // 12 — range_sum(prefix, a, b) = prefix[b] - prefix[a].
  "lesson:prefix-sums:ps-complete-1": {
    // Off-by-one on the upper bound (prefix[b-1]).
    plausibleWrong:
      "def range_sum(prefix, a, b):\n    return prefix[b - 1] - prefix[a]",
    earlyExit:
      "def range_sum(prefix, a, b):\n    return 0",
    // Hard-codes the first query's answer; fails the others.
    printAnswer:
      "def range_sum(prefix, a, b):\n    return 5",
  },

  // 14 — Kadane max_sub; must handle all-negative.
  "lesson:kadane:kad-fix-1": {
    // Seeds best at 0 (the classic bug) but seeds current correctly: still
    // returns 0 for all-negative input.
    plausibleWrong:
      "def max_sub(nums):\n    best = 0\n    current = nums[0]\n    for x in nums[1:]:\n        current = max(x, current + x)\n        best = max(best, current)\n    return best",
    earlyExit:
      "def max_sub(nums):\n    return 0",
    // Hard-codes the first test's answer.
    printAnswer:
      "def max_sub(nums):\n    return -1",
  },

  // 15 — remove_val(nums, target) in place, returns new length.
  "lesson:in-place-modification:ip-complete-1": {
    // Counts kept values but forgets to actually write them into place.
    plausibleWrong:
      "def remove_val(nums, target):\n    insert = 0\n    for i in range(len(nums)):\n        if nums[i] != target:\n            insert = insert + 1\n    return insert",
    earlyExit:
      "def remove_val(nums, target):\n    return len(nums)",
    // Hard-codes the first case's length; fails remove_val([1],1)==0.
    printAnswer:
      "def remove_val(nums, target):\n    return 2",
  },

  // 17 — merge(intervals) must sort first.
  "lesson:intervals:int-fix-1": {
    // Sorts but uses strict < so touching intervals [3,5],[1,3] don't merge.
    plausibleWrong:
      "def merge(intervals):\n    intervals.sort()\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start < merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
    earlyExit:
      "def merge(intervals):\n    return intervals",
    // Hard-codes the first test's answer; fails the non-overlapping case.
    printAnswer:
      "def merge(intervals):\n    return [[1, 6]]",
  },

  // 19 — is_palindrome(s) via two pointers.
  "lesson:string-two-pointers:stp-complete-1": {
    // Moves only one pointer: never converges correctly (compares s[lo] to a
    // fixed s[hi]), misreporting many strings.
    plausibleWrong:
      "def is_palindrome(s):\n    lo, hi = 0, len(s) - 1\n    while lo < hi:\n        if s[lo] != s[hi]:\n            return False\n        lo += 1\n    return True",
    earlyExit:
      "def is_palindrome(s):\n    return True",
    // Guesses True always; fails the non-palindrome cases.
    printAnswer:
      "def is_palindrome(s):\n    return bool(s)",
  },

  // 20 — length_of_longest_unique(s): needs the >= start guard.
  "lesson:string-sliding-window:ssw-fix-1": {
    // Adds a guard but with the wrong comparison (> instead of >=), still lets
    // start jump for a char seen exactly at `start`.
    plausibleWrong:
      "def length_of_longest_unique(s):\n    seen = {}\n    start = 0\n    best = 0\n    for i, ch in enumerate(s):\n        if ch in seen and seen[ch] > start:\n            start = seen[ch] + 1\n        seen[ch] = i\n        best = max(best, i - start + 1)\n    return best",
    earlyExit:
      "def length_of_longest_unique(s):\n    return 0",
    // Hard-codes the first test's answer.
    printAnswer:
      "def length_of_longest_unique(s):\n    return 3",
  },

  // 22 — is_palindrome(s) via slice.
  "lesson:palindromes:pal-complete-1": {
    // Compares only the first and last char, not the whole reverse.
    plausibleWrong:
      "def is_palindrome(s):\n    if len(s) < 2:\n        return True\n    return s[0] == s[-1]",
    earlyExit:
      "def is_palindrome(s):\n    return True",
    printAnswer:
      "def is_palindrome(s):\n    return len(s) > 0",
  },

  // 23 — is_anagram(a, b) via Counter.
  "lesson:anagrams:ana-complete-1": {
    // Compares the set of letters, not the counts: 'aab'/'abb' falsely equal.
    plausibleWrong:
      "from collections import Counter\ndef is_anagram(a, b):\n    return set(a) == set(b)",
    earlyExit:
      "from collections import Counter\ndef is_anagram(a, b):\n    return True",
    printAnswer:
      "from collections import Counter\ndef is_anagram(a, b):\n    return True",
  },

  // 24 — contains(nums, target) linear search.
  "lesson:linear-search:ls-complete-1": {
    // Returns True/False from inside the loop on the FIRST element only.
    plausibleWrong:
      "def contains(nums, target):\n    for x in nums:\n        return x == target\n    return False",
    earlyExit:
      "def contains(nums, target):\n    return False",
    printAnswer:
      "def contains(nums, target):\n    return True",
  },

  // 25 — bsearch(nums, target) must terminate and return index or -1.
  "lesson:binary-search:bs-fix-1": {
    // Fixes one branch but not the other (lo = mid still), can loop/miss.
    plausibleWrong:
      "def bsearch(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid\n        else:\n            hi = mid - 1\n    return -1",
    earlyExit:
      "def bsearch(nums, target):\n    return -1",
    printAnswer:
      "def bsearch(nums, target):\n    return 3",
  },

  // 27 — count(nums, target) via bisect.
  "lesson:bounds:bnd-complete-1": {
    // Swaps the subtraction order, returning a negative count.
    plausibleWrong:
      "import bisect\ndef count(nums, target):\n    return bisect.bisect_left(nums, target) - bisect.bisect_right(nums, target)",
    earlyExit:
      "import bisect\ndef count(nums, target):\n    return 0",
    printAnswer:
      "import bisect\ndef count(nums, target):\n    return 3",
  },

  // 28 — cell(matrix, cols, mid) maps a flat index.
  "lesson:matrix-search:ms-complete-1": {
    // Swaps row/col arithmetic (mid % cols for row, mid // cols for col).
    plausibleWrong:
      "def cell(matrix, cols, mid):\n    return matrix[mid % cols][mid // cols]",
    earlyExit:
      "def cell(matrix, cols, mid):\n    return matrix[0][0]",
    printAnswer:
      "def cell(matrix, cols, mid):\n    return 1",
  },

  // 32 — merge(left, right) of two sorted lists; stable on ties.
  "lesson:merge-sort:mrg-complete-1": {
    // Uses strict < so equal keys take the RIGHT element first (unstable).
    plausibleWrong:
      "def merge(left, right):\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    out.extend(left[i:])\n    out.extend(right[j:])\n    return out",
    earlyExit:
      "def merge(left, right):\n    return left + right",
    printAnswer:
      "def merge(left, right):\n    return [1, 2, 3, 4, 5, 6]",
  },

  // 37 — safe_pop(stack): None if empty, else pop.
  "lesson:stack-queue-operations:sq-complete-1": {
    // Returns the top without removing it (no mutation).
    plausibleWrong:
      "def safe_pop(stack):\n    if not stack:\n        return None\n    return stack[-1]",
    earlyExit:
      "def safe_pop(stack):\n    return None",
    printAnswer:
      "def safe_pop(stack):\n    return 3",
  },

  // ── Converted bare-script exercises (now function contracts) ──────────────

  // 0 — independent_append(a, x): return a COPY of a with x appended; a intact.
  "lesson:variables-and-types:vt-fix-1": {
    // Mutates and returns the SAME list (aliasing bug the lesson warns about).
    plausibleWrong:
      "def independent_append(a, x):\n    a.append(x)\n    return a",
    earlyExit:
      "def independent_append(a, x):\n    return a",
    // Hard-codes the first test's result list.
    printAnswer:
      "def independent_append(a, x):\n    return [1, 2, 3, 4]",
  },

  // 2 — count_up(n): count 0..n-1, return final counter.
  "lesson:loops:loop-fix-1": {
    // Off-by-one: returns n-1 (stops one early with a different condition).
    plausibleWrong:
      "def count_up(n):\n    i = 0\n    while i < n - 1:\n        i = i + 1\n    return i",
    earlyExit:
      "def count_up(n):\n    return 0",
    printAnswer:
      "def count_up(n):\n    return 3",
  },

  // 3 — count_evens(nums).
  "lesson:loops:loop-complete-1": {
    // Counts odds instead of evens.
    plausibleWrong:
      "def count_evens(nums):\n    count = 0\n    for x in nums:\n        if x % 2 == 1:\n            count = count + 1\n    return count",
    earlyExit:
      "def count_evens(nums):\n    return 0",
    printAnswer:
      "def count_evens(nums):\n    return 2",
  },

  // 5 — double(text): return 2 * int(text).
  "lesson:io:io-fix-1": {
    // Forgets the conversion AND the fix: still string-repeats (the bug).
    plausibleWrong:
      "def double(text):\n    return text * 2",
    earlyExit:
      "def double(text):\n    return text",
    // Hard-codes the first test's answer.
    printAnswer:
      "def double(text):\n    return 14",
  },

  // 8 — safe_div(a, b): 'undefined' on divide-by-zero else a/b.
  "lesson:errors:err-complete-1": {
    // Catches the wrong exception, so a/0 still crashes rather than returning
    // 'undefined'.
    plausibleWrong:
      "def safe_div(a, b):\n    try:\n        return a / b\n    except ValueError:\n        return 'undefined'",
    earlyExit:
      "def safe_div(a, b):\n    return 'undefined'",
    // Hard-codes the first test's answer; fails the real-division cases.
    printAnswer:
      "def safe_div(a, b):\n    return 'undefined'",
  },

  // 10 — sum_all(nums) via index loop.
  "lesson:array-traversal:arr-trav-complete-1": {
    // Off-by-one: skips the last element (range(len-1)).
    plausibleWrong:
      "def sum_all(nums):\n    total = 0\n    for i in range(len(nums) - 1):\n        total = total + nums[i]\n    return total",
    earlyExit:
      "def sum_all(nums):\n    return 0",
    printAnswer:
      "def sum_all(nums):\n    return 17",
  },

  // 11 — reverse_in_place(arr) via two pointers.
  "lesson:two-pointers:tp-fix-1": {
    // Advances only one pointer, so it swaps the same pair repeatedly and never
    // actually reverses (and would loop on longer input).
    plausibleWrong:
      "def reverse_in_place(arr):\n    lo = 0\n    hi = len(arr) - 1\n    while lo < hi:\n        arr[lo], arr[hi] = arr[hi], arr[lo]\n        lo = lo + 1\n    return arr",
    earlyExit:
      "def reverse_in_place(arr):\n    return arr",
    printAnswer:
      "def reverse_in_place(arr):\n    return [3, 2, 1]",
  },

  // 13 — final_window(nums, k) via O(1) slide.
  "lesson:sliding-window:sw-complete-1": {
    // Adds the entering element but forgets to subtract the leaving one, so it
    // ends as the sum of the whole array, not the last k.
    plausibleWrong:
      "def final_window(nums, k):\n    window = sum(nums[:k])\n    for i in range(k, len(nums)):\n        window = window + nums[i]\n    return window",
    earlyExit:
      "def final_window(nums, k):\n    return sum(nums[:k])",
    printAnswer:
      "def final_window(nums, k):\n    return 14",
  },

  // 16 — grid_sum(grid) via nested loops.
  "lesson:matrix-traversal:mat-complete-1": {
    // Sums only the first row (returns after the first outer iteration).
    plausibleWrong:
      "def grid_sum(grid):\n    total = 0\n    for c in range(len(grid[0])):\n        total = total + grid[0][c]\n    return total",
    earlyExit:
      "def grid_sum(grid):\n    return 0",
    printAnswer:
      "def grid_sum(grid):\n    return 21",
  },

  // 18 — char_freq(s): dict of character counts.
  "lesson:string-frequency:sf-complete-1": {
    // Overwrites instead of accumulating: every count ends at 1.
    plausibleWrong:
      "def char_freq(s):\n    freq = {}\n    for ch in s:\n        freq[ch] = 1\n    return freq",
    earlyExit:
      "def char_freq(s):\n    return {}",
    printAnswer:
      "def char_freq(s):\n    return {'a': 1, 'p': 2, 'l': 1, 'e': 1}",
  },

  // 21 — parse_max(line): max of the parsed ints.
  "lesson:string-parsing:sp-complete-1": {
    // Forgets int conversion, so it compares strings ('9' > '10' lexically).
    plausibleWrong:
      "def parse_max(line):\n    return max(line.split())",
    earlyExit:
      "def parse_max(line):\n    return 0",
    printAnswer:
      "def parse_max(line):\n    return 9",
  },

  // 26 — search_answer(can_ship, lo, hi): smallest feasible value.
  "lesson:binary-search-answer:bsa-fix-1": {
    // Returns hi instead of lo (feasible branch keeps hi but it reports the
    // wrong end on convergence by returning hi+... — off by one on the answer).
    plausibleWrong:
      "def search_answer(can_ship, lo, hi):\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can_ship(mid):\n            hi = mid - 1\n        else:\n            lo = mid + 1\n    return lo",
    earlyExit:
      "def search_answer(can_ship, lo, hi):\n    return lo",
    printAnswer:
      "def search_answer(can_ship, lo, hi):\n    return 5",
  },

  // 29 — bubble_sort(a) in place.
  "lesson:bubble-sort:bub-fix-1": {
    // Over-shrinks the inner range (n-1-i-1), leaving an adjacent pair unsorted.
    plausibleWrong:
      "def bubble_sort(a):\n    n = len(a)\n    for i in range(n):\n        for j in range(n - 2 - i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n    return a",
    earlyExit:
      "def bubble_sort(a):\n    return a",
    printAnswer:
      "def bubble_sort(a):\n    return [1, 2, 4, 5, 8]",
  },

  // 30 — selection_sort(a) in place.
  "lesson:selection-sort:sel-complete-1": {
    // Tracks the MAX instead of the min, so each pass moves the wrong element.
    plausibleWrong:
      "def selection_sort(a):\n    n = len(a)\n    for i in range(n):\n        m = i\n        for j in range(i + 1, n):\n            if a[j] > a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a",
    earlyExit:
      "def selection_sort(a):\n    return a",
    printAnswer:
      "def selection_sort(a):\n    return [1, 2, 4, 5, 8]",
  },

  // 31 — insertion_sort(a) in place.
  "lesson:insertion-sort:ins-fix-1": {
    // Keeps the overwrite bug (a[j] = a[j+1]) — the mistake it is meant to fix.
    plausibleWrong:
      "def insertion_sort(a):\n    for i in range(1, len(a)):\n        key = a[i]\n        j = i - 1\n        while j >= 0 and a[j] > key:\n            a[j] = a[j + 1]\n            j -= 1\n        a[j + 1] = key\n    return a",
    earlyExit:
      "def insertion_sort(a):\n    return a",
    printAnswer:
      "def insertion_sort(a):\n    return [1, 2, 4, 5, 8]",
  },

  // 33 — tally(a, hi): counts list of length hi+1.
  "lesson:counting-sort:cnt-complete-1": {
    // Off-by-one bucket: tallies at index x+1 (wrong placement).
    plausibleWrong:
      "def tally(a, hi):\n    counts = [0] * (hi + 2)\n    for x in a:\n        counts[x + 1] += 1\n    return counts",
    earlyExit:
      "def tally(a, hi):\n    return [0] * (hi + 1)",
    printAnswer:
      "def tally(a, hi):\n    return [1, 1, 2, 3]",
  },

  // 34 — bucketize(nums, exp): 10 buckets by digit at place exp.
  "lesson:radix-sort:rad-complete-1": {
    // Uses the whole number as the bucket key (forgets % 10), so for exp=10 it
    // picks the wrong (often out-of-range or merged) bucket.
    plausibleWrong:
      "def bucketize(nums, exp):\n    buckets = [[] for _ in range(10)]\n    for x in nums:\n        buckets[x % 10].append(x)\n    return buckets",
    earlyExit:
      "def bucketize(nums, exp):\n    return [[] for _ in range(10)]",
    printAnswer:
      "def bucketize(nums, exp):\n    b = [[] for _ in range(10)]\n    b[0] = [40]; b[2] = [12]; b[3] = [23]; b[5] = [45, 5]\n    return b",
  },

  // 35 — sort_people(people): by age then name.
  "lesson:comparators:cmp-complete-1": {
    // Sorts by name only (ignores age as the primary key).
    plausibleWrong:
      "def sort_people(people):\n    return sorted(people, key=lambda p: p[0])",
    earlyExit:
      "def sort_people(people):\n    return people",
    printAnswer:
      "def sort_people(people):\n    return [('Cy', 25), ('Al', 30), ('Bo', 30)]",
  },

  // 36 — sort_by_end(intervals): by end time.
  "lesson:interval-sorting:isort-complete-1": {
    // Sorts by START time instead of end time.
    plausibleWrong:
      "def sort_by_end(intervals):\n    return sorted(intervals, key=lambda iv: iv[0])",
    earlyExit:
      "def sort_by_end(intervals):\n    return intervals",
    printAnswer:
      "def sort_by_end(intervals):\n    return [[2, 3], [1, 5], [4, 6]]",
  },

  // 38 — mono_stack(nums): monotonic stack of INDICES.
  "lesson:monotonic-stack:mono-fix-1": {
    // Stores values (the bug): compares/pushes values, not indices.
    plausibleWrong:
      "def mono_stack(nums):\n    stack = []\n    for i in range(len(nums)):\n        while stack and stack[-1] < nums[i]:\n            stack.pop()\n        stack.append(nums[i])\n    return stack",
    earlyExit:
      "def mono_stack(nums):\n    return []",
    printAnswer:
      "def mono_stack(nums):\n    return [2, 3]",
  },

  // 40 — apply_sub(stack): pop two, push left - right.
  "lesson:expression-evaluation:expr-fix-1": {
    // Keeps the swapped operand order (the bug): computes right - left.
    plausibleWrong:
      "def apply_sub(stack):\n    a = stack.pop()\n    b = stack.pop()\n    stack.append(a - b)\n    return stack",
    earlyExit:
      "def apply_sub(stack):\n    return stack",
    printAnswer:
      "def apply_sub(stack):\n    return [2]",
  },

  // 39 — valid(s) parentheses; must reject leftover opens.
  "lesson:parentheses-matching:paren-fix-1": {
    // Returns len(stack)==0 but using the wrong truthiness (returns the stack),
    // so '(((' returns a truthy non-empty list.
    plausibleWrong:
      "def valid(s):\n    pairs = {')':'(', ']':'[', '}':'{'}\n    stack = []\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            return False\n    return len(stack) >= 0",
    earlyExit:
      "def valid(s):\n    return True",
    printAnswer:
      "def valid(s):\n    return True",
  },

  // ── R6.4 batch 41–80 ──────────────────────────────────────────────────────

  // 41 — bfs-fix-1: visited-marking BFS; prelude counts enqueues (_appends).
  // Stays a bare-script contract: the instrumented deque defeats a hard-coded
  // `order` (a guess never enqueues, so _appends['n'] != 3).
  "lesson:bfs-queues:bfs-fix-1": {
    // The classic 'mark on dequeue' bug: enqueues a node once per in-edge, so
    // _appends['n'] exceeds 3 (over-enqueues).
    plausibleWrong:
      "q = deque([start]); order = []; visited = set()\nwhile q:\n    node = q.popleft()\n    if node in visited:\n        continue\n    visited.add(node)\n    order.append(node)\n    for nb in graph[node]:\n        q.append(nb)",
    // Builds no traversal.
    earlyExit:
      "order = []",
    // Hard-codes the visit order but never enqueues, so _appends['n'] stays 0.
    printAnswer:
      "order = [0, 1, 2, 3]",
  },

  // 42 — push(self, x): mins stack carries the running minimum.
  "lesson:min-max-tracking:min-complete-1": {
    // Pushes the raw value onto mins (forgets the running-min comparison).
    plausibleWrong:
      "def push(self, x):\n    self.stack.append(x)\n    self.mins.append(x)",
    earlyExit:
      "def push(self, x):\n    return",
    // Hard-codes the final stacks; wrong after the first push.
    printAnswer:
      "def push(self, x):\n    self.stack = [5, 3, 4]\n    self.mins = [5, 3, 3]",
  },

  // 43 — distinct_count(nums) via set.
  "lesson:maps-sets:ms-complete-1": {
    // Counts all elements, not the distinct ones.
    plausibleWrong:
      "def distinct_count(nums):\n    return len(nums)",
    earlyExit:
      "def distinct_count(nums):\n    return 0",
    printAnswer:
      "def distinct_count(nums):\n    return 3",
  },

  // 44 — first_unique(nums): first count-1 value in order, else None.
  "lesson:hashing-frequency:hf-complete-1": {
    // Returns the first element regardless of its frequency.
    plausibleWrong:
      "from collections import Counter\ndef first_unique(nums):\n    freq = Counter(nums)\n    for x in nums:\n        if freq[x] >= 1:\n            return x\n    return None",
    earlyExit:
      "def first_unique(nums):\n    return None",
    printAnswer:
      "def first_unique(nums):\n    return 4",
  },

  // 45 — has_dup(nums): True iff a repeat exists.
  "lesson:duplicate-detection:dup-fix-1": {
    // Adds BEFORE checking, so x is always already in `seen`: always True.
    plausibleWrong:
      "def has_dup(nums):\n    seen = set()\n    for x in nums:\n        seen.add(x)\n        if x in seen:\n            return True\n    return False",
    earlyExit:
      "def has_dup(nums):\n    return False",
    printAnswer:
      "def has_dup(nums):\n    return True",
  },

  // 46 — two_sum(nums, target): indices of the pair.
  "lesson:value-to-index:vti-complete-1": {
    // Records x before checking, so a single element can pair with itself.
    plausibleWrong:
      "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        need = target - x\n        seen[x] = i\n        if need in seen:\n            return [seen[need], i]\n    return []",
    earlyExit:
      "def two_sum(nums, target):\n    return []",
    printAnswer:
      "def two_sum(nums, target):\n    return [0, 1]",
  },

  // 47 — by_first_letter(words): dict of lists.
  "lesson:grouping:grp-complete-1": {
    // Overwrites each group with a one-element list (forgets to append).
    plausibleWrong:
      "def by_first_letter(words):\n    groups = {}\n    for w in words:\n        groups[w[0]] = [w]\n    return groups",
    earlyExit:
      "def by_first_letter(words):\n    return {}",
    printAnswer:
      "def by_first_letter(words):\n    return {'a': ['apple', 'ant'], 'b': ['bee'], 'c': ['cat']}",
  },

  // 48 — CONVERTED to count_subarrays(nums, k): prefix-sum + map, seed {0:1}.
  "lesson:prefix-sums-map:psm-fix-1": {
    // Seeds seen = {} so subarrays starting at index 0 are missed.
    plausibleWrong:
      "def count_subarrays(nums, k):\n    count = 0\n    prefix = 0\n    seen = {}\n    for x in nums:\n        prefix += x\n        count += seen.get(prefix - k, 0)\n        seen[prefix] = seen.get(prefix, 0) + 1\n    return count",
    earlyExit:
      "def count_subarrays(nums, k):\n    return 0",
    printAnswer:
      "def count_subarrays(nums, k):\n    return 2",
  },

  // 49 — fib(n, memo=None): None-guard idiom (no shared mutable default).
  "lesson:caching-seen:cache-fix-1": {
    // Keeps the shared mutable default {} — the exact bug: __defaults__ != (None,).
    plausibleWrong:
      "def fib(n, memo={}):\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]",
    earlyExit:
      "def fib(n, memo=None):\n    return 0",
    printAnswer:
      "def fib(n, memo=None):\n    return 55",
  },

  // 50 — bit_mask(k) = 1 << k.
  "lesson:bit-shifts:shift-complete-1": {
    // Returns 2*k: right for k=0,1 but wrong for 3 and 10.
    plausibleWrong:
      "def bit_mask(k):\n    return 2 * k",
    earlyExit:
      "def bit_mask(k):\n    return 0",
    printAnswer:
      "def bit_mask(k):\n    return 1",
  },

  // 51 — is_set(n, i): True if bit i is set.
  "lesson:bit-check-set-clear:csc-complete-1": {
    // Inverts the test (checks for a clear bit instead of a set one).
    plausibleWrong:
      "def is_set(n, i):\n    return (n >> i) & 1 == 0",
    earlyExit:
      "def is_set(n, i):\n    return 0",
    printAnswer:
      "def is_set(n, i):\n    return 1",
  },

  // 52 — clear_bit(n, i) = n & ~(1 << i).
  "lesson:bit-check-set-clear:csc-fix-1": {
    // Toggles the bit (XOR) instead of clearing: wrong when the bit is already 0.
    plausibleWrong:
      "def clear_bit(n, i):\n    return n ^ (1 << i)",
    earlyExit:
      "def clear_bit(n, i):\n    return n",
    printAnswer:
      "def clear_bit(n, i):\n    return 0b1110",
  },

  // 53 — missing(nums): XOR of range and values.
  "lesson:xor-cancellation:xor-complete-1": {
    // XORs range(len) instead of range(len+1): off by the top value.
    plausibleWrong:
      "def missing(nums):\n    x = 0\n    for i in range(len(nums)):\n        x ^= i\n    for v in nums:\n        x ^= v\n    return x",
    earlyExit:
      "def missing(nums):\n    return 0",
    printAnswer:
      "def missing(nums):\n    return 2",
  },

  // 54 — is_power_of_two(n): n>0 and (n & (n-1))==0.
  "lesson:count-set-bits:csb-complete-1": {
    // Drops the n>0 guard, so 0 (and negatives) are misreported.
    plausibleWrong:
      "def is_power_of_two(n):\n    return (n & (n - 1)) == 0",
    earlyExit:
      "def is_power_of_two(n):\n    return False",
    printAnswer:
      "def is_power_of_two(n):\n    return True",
  },

  // 55 — k_smallest(nums, k) via heapq.
  "lesson:min-max-heaps:heap-complete-1": {
    // Returns the k LARGEST instead of the k smallest.
    plausibleWrong:
      "import heapq\ndef k_smallest(nums, k):\n    return heapq.nlargest(k, nums)",
    earlyExit:
      "def k_smallest(nums, k):\n    return []",
    printAnswer:
      "def k_smallest(nums, k):\n    return [1, 2, 3]",
  },

  // 56 — CONVERTED to top_k(nums, k): size-k min-heap, returns sorted k largest.
  "lesson:top-k:topk-fix-1": {
    // Pushes -x (max-heap behaviour): ends up keeping the k SMALLEST.
    plausibleWrong:
      "import heapq\ndef top_k(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, -x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return sorted(h)",
    earlyExit:
      "def top_k(nums, k):\n    return []",
    printAnswer:
      "def top_k(nums, k):\n    return [4, 7, 8]",
  },

  // 57 — kth_smallest(nums, k) via size-k MAX-heap (negation).
  "lesson:kth-largest:kth-complete-1": {
    // Uses a min-heap (keeps k largest) → returns the kth LARGEST, not smallest.
    plausibleWrong:
      "import heapq\ndef kth_smallest(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return h[0]",
    earlyExit:
      "def kth_smallest(nums, k):\n    return 0",
    printAnswer:
      "def kth_smallest(nums, k):\n    return 7",
  },

  // 58 — add(self, x): running-median two-heap insert; must rebalance.
  "lesson:running-median:med-fix-1": {
    // Skips the rebalance, so `large` can grow larger than `small`.
    plausibleWrong:
      "import heapq\ndef add(self, x):\n    heapq.heappush(self.small, -x)\n    heapq.heappush(self.large, -heapq.heappop(self.small))",
    earlyExit:
      "def add(self, x):\n    return",
    // Hard-codes heap contents; wrong structure for other sequences.
    printAnswer:
      "import heapq\ndef add(self, x):\n    self.small = [-3, -1]\n    self.large = [5, 15]",
  },

  // 59 — merge_two(a, b) via heapq.merge.
  "lesson:merge-sorted-data:merge-complete-1": {
    // Concatenates instead of merging: result is not sorted.
    plausibleWrong:
      "def merge_two(a, b):\n    return a + b",
    earlyExit:
      "def merge_two(a, b):\n    return []",
    printAnswer:
      "def merge_two(a, b):\n    return [1, 2, 3, 4, 5, 6]",
  },

  // 60 — CONVERTED to insert(small, large, x): two-heap insert with rebalance.
  "lesson:two-heap-pattern:twoheap-fix-1": {
    // Skips the rebalance step, so `large` can end up bigger than `small`.
    plausibleWrong:
      "import heapq\ndef insert(small, large, x):\n    heapq.heappush(small, -x)\n    heapq.heappush(large, -heapq.heappop(small))",
    earlyExit:
      "def insert(small, large, x):\n    return",
    // Guesses 'just stash it in small': passes a lone insert, fails a sequence.
    printAnswer:
      "def insert(small, large, x):\n    small.append(-x)",
  },

  // 61 — count(node): number of nodes via DFS.
  "lesson:tree-dfs:dfs-complete-1": {
    // Recurses only into the left child (forgets the right subtree).
    plausibleWrong:
      "def count(node):\n    if node is None:\n        return 0\n    return 1 + count(node.left)",
    earlyExit:
      "def count(node):\n    return 0",
    printAnswer:
      "def count(node):\n    return 4",
  },

  // 62 — levels(root): BFS by level (list of lists).
  "lesson:tree-bfs:bfs-complete-1": {
    // Emits one node per level (forgets the fixed per-level batch size).
    plausibleWrong:
      "from collections import deque\ndef levels(root):\n    if not root:\n        return []\n    out = []\n    q = deque([root])\n    while q:\n        node = q.popleft()\n        out.append([node.val])\n        if node.left: q.append(node.left)\n        if node.right: q.append(node.right)\n    return out",
    earlyExit:
      "def levels(root):\n    return []",
    printAnswer:
      "def levels(root):\n    return [[1], [2, 3], [4, 5]]",
  },

  // 63 — inorder(n, out): left, node, right.
  "lesson:tree-traversals:trav-complete-1": {
    // Visits node BEFORE the left subtree: that's preorder, not inorder.
    plausibleWrong:
      "def inorder(n, out):\n    if n:\n        out.append(n.val)\n        inorder(n.left, out)\n        inorder(n.right, out)",
    earlyExit:
      "def inorder(n, out):\n    return",
    printAnswer:
      "def inorder(n, out):\n    out.extend([1, 2, 3])",
  },

  // 64 — search(root, val): iterative BST search.
  "lesson:bst-operations:bst-complete-1": {
    // Descends the wrong way (right when smaller, left when larger).
    plausibleWrong:
      "def search(root, val):\n    while root:\n        if val == root.val:\n            return True\n        root = root.right if val < root.val else root.left\n    return False",
    earlyExit:
      "def search(root, val):\n    return False",
    printAnswer:
      "def search(root, val):\n    return True",
  },

  // 65 — height(node): recursive tree height.
  "lesson:tree-height-depth:height-complete-1": {
    // Takes the min of the two child heights instead of the max.
    plausibleWrong:
      "def height(node):\n    if node is None:\n        return 0\n    return 1 + min(height(node.left), height(node.right))",
    earlyExit:
      "def height(node):\n    return 0",
    printAnswer:
      "def height(node):\n    return 3",
  },

  // 66 — lca_bst(root, p, q): BST lowest common ancestor descent.
  "lesson:lowest-common-ancestor:lca-complete-1": {
    // Swaps the descent directions (goes right when both are smaller).
    plausibleWrong:
      "def lca_bst(root, p, q):\n    while root:\n        if p < root.val and q < root.val:\n            root = root.right\n        elif p > root.val and q > root.val:\n            root = root.left\n        else:\n            return root.val",
    earlyExit:
      "def lca_bst(root, p, q):\n    return None",
    printAnswer:
      "def lca_bst(root, p, q):\n    return 2",
  },

  // 67 — build_bst(arr): balanced BST from sorted array.
  "lesson:tree-construction:build-complete-1": {
    // Always takes arr[0] as the root: builds a degenerate right chain
    // (correct inorder but height n, not balanced).
    plausibleWrong:
      "def build_bst(arr):\n    if not arr:\n        return None\n    return TreeNode(arr[0], None, build_bst(arr[1:]))",
    earlyExit:
      "def build_bst(arr):\n    return None",
    printAnswer:
      "def build_bst(arr):\n    return TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(6, TreeNode(5), TreeNode(7)))",
  },

  // 68 — insert(self, word): trie insert; reuse shared prefixes.
  "lesson:trie-insertion:trie-complete-1": {
    // Overwrites each child instead of reusing it, destroying shared prefixes.
    plausibleWrong:
      "def insert(self, word):\n    node = self.root\n    for ch in word:\n        node.children[ch] = TrieNode()\n        node = node.children[ch]\n    node.is_word = True",
    earlyExit:
      "def insert(self, word):\n    return",
    printAnswer:
      "def insert(self, word):\n    self.root.children['c'] = TrieNode()",
  },

  // 69 — starts_with(self, prefix): walk the prefix path.
  "lesson:prefix-search:prefix-complete-1": {
    // Returns is_word at the end — that's a full-word lookup, not a prefix test.
    plausibleWrong:
      "def starts_with(self, prefix):\n    node = self.root\n    for ch in prefix:\n        if ch not in node.children:\n            return False\n        node = node.children[ch]\n    return node.is_word",
    earlyExit:
      "def starts_with(self, prefix):\n    return True",
    printAnswer:
      "def starts_with(self, prefix):\n    return bool(prefix)",
  },

  // 70 — exist(board, word): DFS with backtracking restore.
  "lesson:word-search:ws-fix-1": {
    // Marks a cell but never restores it, so dead-end paths block later ones.
    plausibleWrong:
      "def exist(board, word):\n    rows, cols = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word):\n            return True\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:\n            return False\n        board[r][c] = '#'\n        return dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or dfs(r, c+1, i+1) or dfs(r, c-1, i+1)\n    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))",
    earlyExit:
      "def exist(board, word):\n    return False",
    printAnswer:
      "def exist(board, word):\n    return True",
  },

  // 71 — rotate_right(y): AVL right-rotation pointer surgery.
  "lesson:avl-rotations:avl-complete-1": {
    // Reattaches y.left to x (a cycle) instead of the middle subtree t.
    plausibleWrong:
      "def rotate_right(y):\n    x = y.left\n    t = x.right\n    x.right = y\n    y.left = x\n    return x",
    earlyExit:
      "def rotate_right(y):\n    return y",
    printAnswer:
      "def rotate_right(y):\n    return y.left",
  },

  // 72 — build(edges): DIRECTED adjacency list.
  "lesson:graph-representations:grep-complete-1": {
    // Adds both directions — builds an UNDIRECTED graph.
    plausibleWrong:
      "from collections import defaultdict\ndef build(edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    return adj",
    earlyExit:
      "from collections import defaultdict\ndef build(edges):\n    return defaultdict(list)",
    printAnswer:
      "from collections import defaultdict\ndef build(edges):\n    return defaultdict(list, {0: [1, 2], 1: [2], 2: []})",
  },

  // 73 — build(edges): weighted UNDIRECTED adjacency list.
  "lesson:adjacency-lists:adj-complete-1": {
    // Adds only the forward direction — builds a DIRECTED graph.
    plausibleWrong:
      "from collections import defaultdict\ndef build(edges):\n    adj = defaultdict(list)\n    for u, v, w in edges:\n        adj[u].append((v, w))\n    return adj",
    earlyExit:
      "from collections import defaultdict\ndef build(edges):\n    return defaultdict(list)",
    printAnswer:
      "from collections import defaultdict\ndef build(edges):\n    return defaultdict(list, {0: [(1, 5)], 1: [(0, 5), (2, 3)], 2: [(1, 3)]})",
  },

  // 74 — reachable(adj, start): BFS reachable set.
  "lesson:graph-bfs:gbfs-complete-1": {
    // Only expands the start's direct neighbours (never queues deeper).
    plausibleWrong:
      "from collections import deque\ndef reachable(adj, start):\n    seen = {start}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            seen.add(nb)\n    return seen",
    earlyExit:
      "def reachable(adj, start):\n    return {start}",
    printAnswer:
      "def reachable(adj, start):\n    return {0, 1, 2, 3}",
  },

  // 75 — dfs_iter(adj, start): iterative DFS order.
  "lesson:graph-dfs:gdfs-complete-1": {
    // Records only the start and its direct neighbours (no stack loop).
    plausibleWrong:
      "def dfs_iter(adj, start):\n    order = [start]\n    for nb in adj[start]:\n        order.append(nb)\n    return order",
    earlyExit:
      "def dfs_iter(adj, start):\n    return [start]",
    printAnswer:
      "def dfs_iter(adj, start):\n    return [0, 1, 2, 3]",
  },

  // 76 — largest(n, edges): size of the largest connected component.
  "lesson:connected-components:cc-complete-1": {
    // Returns the NUMBER of components instead of the largest component's size.
    plausibleWrong:
      "from collections import defaultdict\ndef largest(n, edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v); adj[v].append(u)\n    seen = set()\n    comps = 0\n    for s in range(n):\n        if s not in seen:\n            comps += 1\n            stack = [s]; seen.add(s)\n            while stack:\n                node = stack.pop()\n                for nb in adj[node]:\n                    if nb not in seen:\n                        seen.add(nb); stack.append(nb)\n    return comps",
    earlyExit:
      "def largest(n, edges):\n    return 1",
    printAnswer:
      "def largest(n, edges):\n    return 3",
  },

  // 77 — dfs(node, parent): undirected cycle check with parent exclusion.
  "lesson:graph-cycle-detection:cyc-fix-1": {
    // Omits the parent exclusion: the arrival edge is reported as a cycle.
    plausibleWrong:
      "def dfs(node, parent):\n    seen.add(node)\n    for nb in adj[node]:\n        if nb not in seen:\n            if dfs(nb, node):\n                return True\n        else:\n            return True\n    return False",
    earlyExit:
      "def dfs(node, parent):\n    return False",
    printAnswer:
      "def dfs(node, parent):\n    return True",
  },

  // 78 — CONVERTED to kahn(adj, indeg): full Kahn's topological sort.
  "lesson:topological-sort:topo-complete-1": {
    // Decrements in-degrees but never queues newly-zeroed nodes, so only the
    // initial zero-in-degree nodes are emitted.
    plausibleWrong:
      "from collections import deque\ndef kahn(adj, indeg):\n    q = deque([v for v in indeg if indeg[v] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nb in adj[node]:\n            indeg[nb] -= 1\n    return order",
    earlyExit:
      "def kahn(adj, indeg):\n    return []",
    printAnswer:
      "def kahn(adj, indeg):\n    return [0, 1, 2, 3]",
  },

  // 79 — CONVERTED to seed_sources(n, sources): multi-source BFS seeding.
  "lesson:multi-source-bfs:msbfs-fix-1": {
    // Seeds only the first source (the bug), leaving the rest at -1.
    plausibleWrong:
      "from collections import deque\ndef seed_sources(n, sources):\n    dist = [-1] * n\n    q = deque()\n    dist[sources[0]] = 0\n    q.append(sources[0])\n    return dist, list(q)",
    earlyExit:
      "def seed_sources(n, sources):\n    return [-1] * n, []",
    printAnswer:
      "def seed_sources(n, sources):\n    return [0, -1, -1, -1, 0], [0, 4]",
  },

  // 80 — bfs_parents(adj, start): BFS distances + parent map.
  "lesson:shortest-paths-unweighted:spu-complete-1": {
    // Computes distances but forgets to record parents (empty parent map).
    plausibleWrong:
      "from collections import deque\ndef bfs_parents(adj, start):\n    dist = {start: 0}\n    parent = {}\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            if nb not in dist:\n                dist[nb] = dist[node] + 1\n                q.append(nb)\n    return dist, parent",
    earlyExit:
      "def bfs_parents(adj, start):\n    return {start: 0}, {start: None}",
    printAnswer:
      "def bfs_parents(adj, start):\n    return {0: 0, 1: 1, 2: 1, 3: 2}, {0: None, 1: 0, 2: 0, 3: 1}",
  },

  // ── R6.4 batch: indices 81–120 ─────────────────────────────────────────

  // 82 — Dijkstra stale-skip (SCRIPT contract; prelude seeds pq/dist/adj and a
  // neighbour-access counter _expand). Correct: skip stale pops with `if d >
  // dist[node]: continue`, giving exactly 4 neighbour-list expansions.
  "lesson:dijkstra:dij-fix-1": {
    // Uses >= instead of >, so even the first (fresh) pop of each node is
    // skipped: nodes 1..3 never relax -> wrong distances.
    plausibleWrong:
      "while pq:\n    d, node = heapq.heappop(pq)\n    if d >= dist[node]:\n        continue\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
    // Stops after the first pop; distances stay at infinity for 1..3.
    earlyExit:
      "while pq:\n    d, node = heapq.heappop(pq)\n    break",
    // Hard-codes the answer list but never touches adj, so _expand stays 0.
    printAnswer:
      "dist = [0, 1, 2, 3]",
  },

  // 116 — CONVERTED to knapsack(weights, values, capacity): max value DP.
  "lesson:dp-knapsack:dpks-complete-1": {
    // 'take' forgets to free capacity (uses dp[i-1][w] instead of
    // dp[i-1][w - weights[i-1]]), so the weight budget is ignored -> overcounts.
    plausibleWrong:
      "def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            dp[i][w] = dp[i - 1][w]\n            if weights[i - 1] <= w:\n                take = dp[i - 1][w] + values[i - 1]\n                if take > dp[i][w]:\n                    dp[i][w] = take\n    return dp[n][capacity]",
    earlyExit:
      "def knapsack(weights, values, capacity):\n    return 0",
    // Hard-codes the first case's answer; fails the larger-capacity cases.
    printAnswer:
      "def knapsack(weights, values, capacity):\n    return 4",
  },

  // 110 — CONVERTED to permutations(nums): backtracking with a used array.
  "lesson:dp-permutations:dpperm-complete-1": {
    // Forgets to clear used[i] on backtrack, so most orderings never form.
    plausibleWrong:
      "def permutations(nums):\n    res = []\n    path = []\n    used = [False] * len(nums)\n    def bt():\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            bt()\n            path.pop()\n        return\n    bt()\n    return res",
    earlyExit:
      "def permutations(nums):\n    return []",
    // Hard-codes the 3-element answer; fails the 2-element/singleton/empty cases.
    printAnswer:
      "def permutations(nums):\n    return [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
  },

  // 111 — CONVERTED to permutations(nums): fix the missing used-flag reset.
  "lesson:dp-permutations:dpperm-fix-1": {
    // Clears used but forgets to pop the path, so entries grow unboundedly and
    // the length check never matches cleanly -> wrong/degenerate results.
    plausibleWrong:
      "def permutations(nums):\n    res = []\n    path = []\n    used = [False] * len(nums)\n    def bt():\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            bt()\n            used[i] = False\n    bt()\n    return res",
    earlyExit:
      "def permutations(nums):\n    return []",
    printAnswer:
      "def permutations(nums):\n    return [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
  },

  // 102 — CONVERTED to dequeue_front(items): deque used as a FIFO queue.
  "lesson:linked-list-deques:lldq-complete-1": {
    // Pops from the RIGHT (pop, LIFO) instead of the left — returns the last item.
    plausibleWrong:
      "from collections import deque\ndef dequeue_front(items):\n    q = deque()\n    for x in items:\n        q.append(x)\n    first = q.pop()\n    return first, list(q)",
    // Returns the front without actually removing it from the remainder.
    earlyExit:
      "from collections import deque\ndef dequeue_front(items):\n    return items[0], items",
    // Hard-codes the first case; fails the other inputs.
    printAnswer:
      "def dequeue_front(items):\n    return 1, [2, 3]",
  },

  // 101 — CONVERTED to append(tail, node): doubly linked append (both links).
  "lesson:linked-list-variants:llv-complete-1": {
    // Sets only the forward link (forgets node.prev), so the back-pointer is None.
    plausibleWrong:
      "def append(tail, node):\n    if tail is None:\n        return node\n    tail.next = node\n    return node",
    // Returns the old tail without linking the new node.
    earlyExit:
      "def append(tail, node):\n    return tail",
    // Returns the new node but never links it back to the old tail.
    printAnswer:
      "def append(tail, node):\n    return node",
  },

  // 99 — CONVERTED to swap_pairs(head): swap adjacent pairs, return new head.
  "lesson:linked-list-pointer-manipulation:llpm-complete-1": {
    // Swaps values' links but advances prev to second (the new front), skipping
    // a node so the next pair is misaligned.
    plausibleWrong:
      "def swap_pairs(head):\n    dummy = Node(0, head)\n    prev = dummy\n    while prev.next is not None and prev.next.next is not None:\n        first = prev.next\n        second = first.next\n        first.next = second.next\n        second.next = first\n        prev.next = second\n        prev = second\n    return dummy.next",
    earlyExit:
      "def swap_pairs(head):\n    return head",
    // Hard-codes the four-node answer; fails odd/single/empty/six-node.
    printAnswer:
      "def swap_pairs(head):\n    return Node(2, Node(1, Node(4, Node(3))))",
  },

  // 100 — CONVERTED to swap_pairs(head): fix prev advance after the swap.
  "lesson:linked-list-pointer-manipulation:llpm-fix-1": {
    // Advances prev correctly but forgets to relink prev.next = second, so the
    // predecessor still points at the old front and the head/order is wrong.
    plausibleWrong:
      "def swap_pairs(head):\n    dummy = Node(0, head)\n    prev = dummy\n    while prev.next is not None and prev.next.next is not None:\n        first = prev.next\n        second = first.next\n        first.next = second.next\n        second.next = first\n        prev = first\n    return dummy.next",
    earlyExit:
      "def swap_pairs(head):\n    return head",
    printAnswer:
      "def swap_pairs(head):\n    return Node(2, Node(1, Node(4, Node(3))))",
  },

  // 97 — CONVERTED to merge(a, b): merge two sorted lists (stable, keeps tail).
  "lesson:linked-list-merging:llm-complete-1": {
    // Uses strict < so equal values take the RIGHT node first (breaks stability).
    plausibleWrong:
      "def merge(a, b):\n    dummy = Node(0)\n    tail = dummy\n    while a is not None and b is not None:\n        if a.val < b.val:\n            tail.next = a\n            a = a.next\n        else:\n            tail.next = b\n            b = b.next\n        tail = tail.next\n    tail.next = a if a is not None else b\n    return dummy.next",
    earlyExit:
      "def merge(a, b):\n    return a",
    printAnswer:
      "def merge(a, b):\n    return Node(1, Node(2, Node(3, Node(4, Node(5, Node(6))))))",
  },

  // 90 — CONVERTED to middle(head): slow/fast middle with a safe loop guard.
  "lesson:linked-list-slow-fast:llsf-fix-1": {
    // Over-guards with `or` instead of `and`, so it still dereferences
    // fast.next.next when fast.next is None -> crashes on even lists.
    plausibleWrong:
      "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None or fast.next is not None:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
    earlyExit:
      "def middle(head):\n    return head",
    // Returns head.next: right for [1,2] by luck, wrong for singleton/odd.
    printAnswer:
      "def middle(head):\n    return head.next",
  },

  // 88 — CONVERTED to collect(head): return list of values in order.
  "lesson:linked-list-traversal:ll-fix-1": {
    // Skips the first node (appends after advancing), dropping the head value.
    plausibleWrong:
      "def collect(head):\n    out = []\n    current = head\n    while current is not None:\n        current = current.next\n        if current is not None:\n            out.append(current.val)\n    return out",
    // Returns after recording just the first node.
    earlyExit:
      "def collect(head):\n    if head is None:\n        return []\n    return [head.val]",
    // Hard-codes the first list; fails empty/single/longer.
    printAnswer:
      "def collect(head):\n    return [1, 2, 3]",
  },

  // 85 — CONVERTED to prim(adj, n): MST weight; needs the visited skip.
  "lesson:prim:prim-fix-1": {
    // Keeps the original bug (no visited skip): stale heap entries get re-added,
    // overcounting the total.
    plausibleWrong:
      "import heapq\ndef prim(adj, n):\n    visited = [False] * n\n    total = 0\n    pq = [(0, 0)]\n    while pq:\n        w, node = heapq.heappop(pq)\n        visited[node] = True\n        total += w\n        for nb, w2 in adj[node]:\n            heapq.heappush(pq, (w2, nb))\n    return total",
    earlyExit:
      "def prim(adj, n):\n    return 0",
    // Hard-codes the first graph's total; fails the other graphs.
    printAnswer:
      "def prim(adj, n):\n    return 6",
  },

  // 84 — CONVERTED to floyd_warshall(d, n): fix loop order (k outermost).
  "lesson:floyd-warshall:fw-fix-1": {
    // Leaves k innermost (the original bug): relaxes through each k before later
    // ks are available, giving wrong distances.
    plausibleWrong:
      "def floyd_warshall(d, n):\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                if d[i][k] + d[k][j] < d[i][j]:\n                    d[i][j] = d[i][k] + d[k][j]\n    return d",
    // Returns the matrix untouched.
    earlyExit:
      "def floyd_warshall(d, n):\n    return d",
    // Hard-codes the first graph's answer; fails the triangle and single-vertex.
    printAnswer:
      "def floyd_warshall(d, n):\n    return [[0, 3, 5, 6], [5, 0, 2, 3], [3, 6, 0, 1], [2, 5, 7, 0]]",
  },

  // 81 — find(self, x): path-compression union-find find.
  "lesson:union-find:uf-complete-1": {
    // Walks to the root correctly but never compresses, so parent[3] stays 2.
    plausibleWrong:
      "def find(self, x):\n    while self.parent[x] != x:\n        x = self.parent[x]\n    return x",
    // Returns the queried node without climbing at all.
    earlyExit:
      "def find(self, x):\n    return x",
    // Hard-codes the root; wrong for find(0) context and skips compression.
    printAnswer:
      "def find(self, x):\n    return 0",
  },

  // 83 — bellman_ford(edges, n, start): + negative-cycle detection.
  "lesson:bellman-ford:bf-complete-1": {
    // Relaxes correctly but never runs the detection pass, so a negative cycle
    // yields a (bogus) distance list instead of None.
    plausibleWrong:
      "def bellman_ford(edges, n, start):\n    dist = [float('inf')] * n\n    dist[start] = 0\n    for _ in range(n - 1):\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    return dist",
    earlyExit:
      "def bellman_ford(edges, n, start):\n    return None",
    // Hard-codes the first case's answer; fails the cycle and two-node cases.
    printAnswer:
      "def bellman_ford(edges, n, start):\n    return [0, 4, 2, 5]",
  },

  // 86 — kruskal(n, edges): MST weight; must sort edges cheapest-first.
  "lesson:kruskal:kru-fix-1": {
    // Sorts by the WRONG key (by endpoint u, not weight w) — still unsorted by
    // cost, so it picks heavier edges first on the first test.
    plausibleWrong:
      "def kruskal(n, edges):\n    edges = sorted(edges, key=lambda e: e[0])\n    parent = list(range(n))\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]\n            x = parent[x]\n        return x\n    total = 0\n    for u, v, w in edges:\n        ru, rv = find(u), find(v)\n        if ru != rv:\n            parent[ru] = rv\n            total += w\n    return total",
    earlyExit:
      "def kruskal(n, edges):\n    return 0",
    // Hard-codes the first case's total; fails the other cases.
    printAnswer:
      "def kruskal(n, edges):\n    return 19",
  },

  // 87 — length(head): count nodes in a linked list.
  "lesson:linked-list-traversal:ll-complete-1": {
    // Off-by-one: starts the count at 1, so empty gives 1 and others overcount.
    plausibleWrong:
      "def length(head):\n    count = 1\n    current = head\n    while current is not None:\n        count += 1\n        current = current.next\n    return count",
    earlyExit:
      "def length(head):\n    return 0",
    // Hard-codes a single list's length; fails empty and three-node cases.
    printAnswer:
      "def length(head):\n    return 1",
  },

  // 89 — middle(head): slow/fast middle node.
  "lesson:linked-list-slow-fast:llsf-complete-1": {
    // Advances fast by one (not two), so slow never reaches the middle.
    plausibleWrong:
      "def middle(head):\n    slow = head\n    fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next\n        fast = fast.next\n    return slow",
    earlyExit:
      "def middle(head):\n    return head",
    // Returns the head's immediate next; wrong for singleton and long lists.
    printAnswer:
      "def middle(head):\n    return head.next",
  },

  // 91 — has_cycle(head): Floyd cycle detection.
  "lesson:linked-list-cycle-detection:llcd-complete-1": {
    // Never checks the collision, so it always reports False (misses cycles).
    plausibleWrong:
      "def has_cycle(head):\n    slow = fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next\n        fast = fast.next.next\n    return False",
    earlyExit:
      "def has_cycle(head):\n    return False",
    // Hard-codes True; wrong for every acyclic case.
    printAnswer:
      "def has_cycle(head):\n    return True",
  },

  // 92 — reverse(head): in-place reversal, returns new head.
  "lesson:linked-list-reversal:llr-complete-1": {
    // Flips links but returns the old head (now the tail) instead of prev.
    plausibleWrong:
      "def reverse(head):\n    prev = None\n    curr = head\n    while curr is not None:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return head",
    earlyExit:
      "def reverse(head):\n    return head",
    // Returns None regardless; wrong for single/multi-node lists.
    printAnswer:
      "def reverse(head):\n    return None",
  },

  // 93 — reverse(head): fix-the-return reversal.
  "lesson:linked-list-reversal:llr-fix-1": {
    // Reverses only the first link then returns head: list [1,2,...] -> [1].
    plausibleWrong:
      "def reverse(head):\n    prev = None\n    curr = head\n    if curr is not None:\n        nxt = curr.next\n        curr.next = prev\n    return head",
    earlyExit:
      "def reverse(head):\n    return head",
    printAnswer:
      "def reverse(head):\n    return None",
  },

  // 94 — middle_count(head): count then walk n//2 steps.
  "lesson:linked-list-middle:llmid-complete-1": {
    // Walks n//2 - 1 steps (off-by-one), landing before the middle.
    plausibleWrong:
      "def middle_count(head):\n    n = 0\n    node = head\n    while node is not None:\n        n += 1\n        node = node.next\n    node = head\n    for _ in range(n // 2 - 1):\n        node = node.next\n    return node",
    earlyExit:
      "def middle_count(head):\n    return head",
    printAnswer:
      "def middle_count(head):\n    return head.next",
  },

  // 95 — remove_all(head, target): dummy-node deletion of all matches.
  "lesson:linked-list-dummy-nodes:lldn-complete-1": {
    // Advances prev even on a deletion, so consecutive matches get skipped
    // (e.g. [6,6,6] leaves a stray 6).
    plausibleWrong:
      "def remove_all(head, target):\n    dummy = Node(0, head)\n    prev = dummy\n    curr = head\n    while curr is not None:\n        if curr.val == target:\n            prev.next = curr.next\n            prev = curr\n        else:\n            prev = curr\n        curr = curr.next\n    return dummy.next",
    earlyExit:
      "def remove_all(head, target):\n    return head",
    // Hard-codes one case's shape; fails the others.
    printAnswer:
      "def remove_all(head, target):\n    return Node(1, Node(2, Node(3)))",
  },

  // 96 — remove_all(head, target): fix-the-return (return dummy.next).
  "lesson:linked-list-dummy-nodes:lldn-fix-1": {
    // Returns head (stale) — fails whenever the first node is removed.
    plausibleWrong:
      "def remove_all(head, target):\n    dummy = Node(0, head)\n    prev = dummy\n    curr = head\n    while curr is not None:\n        if curr.val == target:\n            prev.next = curr.next\n        else:\n            prev = curr\n        curr = curr.next\n    return head",
    earlyExit:
      "def remove_all(head, target):\n    return head",
    printAnswer:
      "def remove_all(head, target):\n    return Node(1, Node(2))",
  },

  // 98 — merge(a, b): merge two sorted lists; attach leftover tail.
  "lesson:linked-list-merging:llm-fix-1": {
    // Uses strict < so equal values take the RIGHT node first (breaks stability).
    plausibleWrong:
      "def merge(a, b):\n    dummy = Node(0)\n    tail = dummy\n    while a is not None and b is not None:\n        if a.val < b.val:\n            tail.next = a; a = a.next\n        else:\n            tail.next = b; b = b.next\n        tail = tail.next\n    tail.next = a if a is not None else b\n    return dummy.next",
    earlyExit:
      "def merge(a, b):\n    return a",
    printAnswer:
      "def merge(a, b):\n    return Node(1, Node(2, Node(3, Node(4, Node(5, Node(6))))))",
  },

  // 103 — total(n): recursive 1..n with base case at 0.
  "lesson:dp-base-cases:dpbc-complete-1": {
    // Base case at n == 1 returning 1: double-counts nothing but mis-sums at 0.
    plausibleWrong:
      "def total(n):\n    if n == 1:\n        return 1\n    return n + total(n - 1)",
    earlyExit:
      "def total(n):\n    return 0",
    // Hard-codes total(5); fails total(0)/total(1)/total(10).
    printAnswer:
      "def total(n):\n    return 15",
  },

  // 104 — fact(n): factorial with a terminating base case.
  "lesson:dp-base-cases:dpbc-fix-1": {
    // Base case at n == 0 only: fact(1) recurses to fact(0) — one extra call,
    // caught by the call-count assertion (and n<0 would blow up, but not tested).
    plausibleWrong:
      "def fact(n):\n    if n == 0:\n        return 1\n    return n * fact(n - 1)",
    earlyExit:
      "def fact(n):\n    return 1",
    printAnswer:
      "def fact(n):\n    return 120",
  },

  // 105 — fib(n): branching recursion.
  "lesson:dp-recursive-calls:dprc-complete-1": {
    // Off-by-one branch: fib(n-1)+fib(n-3) — wrong from fib(3) upward.
    plausibleWrong:
      "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 3)",
    earlyExit:
      "def fib(n):\n    return n",
    printAnswer:
      "def fib(n):\n    return 55",
  },

  // 106 — bt(cur, open_c, close_c): generate valid parentheses (globals n, res).
  "lesson:dp-backtracking:dpbt-complete-1": {
    // Drops the close-bracket guard (close_c < open_c -> close_c < n), producing
    // invalid strings like '))((' and the wrong count.
    plausibleWrong:
      "def bt(cur, open_c, close_c):\n    if len(cur) == 2 * n:\n        res.append(cur)\n        return\n    if open_c < n:\n        bt(cur + '(', open_c + 1, close_c)\n    if close_c < n:\n        bt(cur + ')', open_c, close_c + 1)",
    earlyExit:
      "def bt(cur, open_c, close_c):\n    return",
    // Appends the n=3 answer set directly; fails the n=1 case.
    printAnswer:
      "def bt(cur, open_c, close_c):\n    res.extend(['((()))', '(()())', '(())()', '()(())', '()()()'])",
  },

  // 107 — bt(start, path): subsets with undo (globals nums, res).
  "lesson:dp-backtracking:dpbt-fix-1": {
    // Undoes with clear() instead of pop(), destroying the whole path so only
    // the empty subset and single-element ones survive incorrectly.
    plausibleWrong:
      "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.clear()",
    earlyExit:
      "def bt(start, path):\n    res.append(path[:])\n    return",
    // Hard-codes the [1,2,3] subsets; fails the empty-input case.
    printAnswer:
      "def bt(start, path):\n    res.extend([[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]])",
  },

  // 108 — bt(start, path): subsets choose/explore/un-choose (globals nums, res).
  "lesson:dp-subsets:dpss-complete-1": {
    // Explores from i (not i+1), so elements repeat and recursion over-generates.
    plausibleWrong:
      "def bt(start, path):\n    res.append(path[:])\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i, path)\n        path.pop()",
    earlyExit:
      "def bt(start, path):\n    res.append(path[:])\n    return",
    printAnswer:
      "def bt(start, path):\n    res.extend([[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]])",
  },

  // 109 — bt(start, path): subsets, must snapshot path[:] not the alias.
  "lesson:dp-subsets:dpss-fix-1": {
    // Snapshots with list(path) is correct — the plausible bug stores path then
    // keeps mutating a DIFFERENT list, still ending with aliased empties: here we
    // append the alias but pop beyond, leaving leaked state (snapshots all []).
    plausibleWrong:
      "def bt(start, path):\n    res.append(path)\n    for i in range(start, len(nums)):\n        path.append(nums[i])\n        bt(i + 1, path)\n        path.pop()",
    earlyExit:
      "def bt(start, path):\n    res.append(path[:])\n    return",
    printAnswer:
      "def bt(start, path):\n    res.extend([[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]])",
  },

  // 112 — bt(start, path): k-combinations of 1..n (globals n, k, res).
  "lesson:dp-combinations:dpcomb-complete-1": {
    // Explores from i (not i+1), allowing repeats like (1,1).
    plausibleWrong:
      "def bt(start, path):\n    if len(path) == k:\n        res.append(path[:])\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        bt(i, path)\n        path.pop()",
    earlyExit:
      "def bt(start, path):\n    if len(path) == k:\n        res.append(path[:])\n    return",
    // Hard-codes C(4,2); fails the C(3,3) case.
    printAnswer:
      "def bt(start, path):\n    res.extend([[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]])",
  },

  // 113 — fib(n): dict memoization (globals memo).
  "lesson:dp-memoization:dpmemo-complete-1": {
    // Computes correctly but never writes to memo, so the cache stays empty and
    // the memo.get(10) assertion fails.
    plausibleWrong:
      "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
    earlyExit:
      "def fib(n):\n    return n",
    printAnswer:
      "def fib(n):\n    return 55",
  },

  // 114 — fib(n): bottom-up tabulation.
  "lesson:dp-tabulation:dptab-complete-1": {
    // Off-by-one recurrence dp[i] = dp[i-1] + dp[i-1]: doubles instead of summing
    // the two previous cells.
    plausibleWrong:
      "def fib(n):\n    if n == 0:\n        return 0\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i - 1] + dp[i - 1]\n    return dp[n]",
    earlyExit:
      "def fib(n):\n    return 0",
    printAnswer:
      "def fib(n):\n    return 55",
  },

  // 115 — count_paths(m, n): grid unique paths.
  "lesson:dp-1d-2d:dp12-complete-1": {
    // Reads from the wrong neighbours (dp[i-1][j-1] diagonal), undercounting.
    plausibleWrong:
      "def count_paths(m, n):\n    dp = [[1] * n for _ in range(m)]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1]\n    return dp[m - 1][n - 1]",
    earlyExit:
      "def count_paths(m, n):\n    return 1",
    printAnswer:
      "def count_paths(m, n):\n    return 6",
  },

  // 117 — is_subsequence(s, t): greedy two-pointer check.
  "lesson:dp-subsequences:dpsub-complete-1": {
    // Advances i without the bounds guard but compares with s[i]; an out-of-range
    // compare is avoided by Python only if guarded — here it drops the guard and
    // instead advances on ANY char, so 'axc' wrongly matches.
    plausibleWrong:
      "def is_subsequence(s, t):\n    i = 0\n    for ch in t:\n        if i < len(s) and (s[i] == ch or True):\n            i += 1\n    return i == len(s)",
    earlyExit:
      "def is_subsequence(s, t):\n    return True",
    printAnswer:
      "def is_subsequence(s, t):\n    return s == 'abc'",
  },

  // 118 — max_profit(prices): best single buy/sell.
  "lesson:dp-state-transitions:dpst-complete-1": {
    // Updates best but forgets to lower min_price, so it only ever profits
    // against prices[0] — wrong when the true buy point comes later.
    plausibleWrong:
      "def max_profit(prices):\n    if not prices:\n        return 0\n    min_price = prices[0]\n    best = 0\n    for p in prices[1:]:\n        best = max(best, p - min_price)\n    return best",
    earlyExit:
      "def max_profit(prices):\n    return 0",
    printAnswer:
      "def max_profit(prices):\n    return 5",
  },

  // 119 — climb(n): climbing-stairs rolling counts.
  "lesson:dp-climbing-stairs:dpcs-complete-1": {
    // Rolls only one variable forward (a = a + b) without swapping, inflating.
    plausibleWrong:
      "def climb(n):\n    a, b = 1, 1\n    for _ in range(n):\n        a = a + b\n    return a",
    earlyExit:
      "def climb(n):\n    return 1",
    printAnswer:
      "def climb(n):\n    return 8",
  },

  // 120 — rob(nums): house robber.
  "lesson:dp-house-robber:dphr-complete-1": {
    // Forgets the skip option (always adds), so adjacent houses get robbed.
    plausibleWrong:
      "def rob(nums):\n    prev, curr = 0, 0\n    for x in nums:\n        prev, curr = curr, prev + x\n    return curr",
    earlyExit:
      "def rob(nums):\n    return 0",
    printAnswer:
      "def rob(nums):\n    return 12",
  },

  // ── R6.4 indices 121-160 (authored by the 121-160 pass) ──────────────────

  // 121 — min_path_sum(grid): min top-left->bottom-right sum (right/down).
  "lesson:dp-grid-paths:dpgp-complete-1": {
    // Maximises instead of minimising each cell's predecessor.
    plausibleWrong:
      "def min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, n):\n        dp[0][j] = dp[0][j - 1] + grid[0][j]\n    for i in range(1, m):\n        dp[i][0] = dp[i - 1][0] + grid[i][0]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + max(dp[i - 1][j], dp[i][j - 1])\n    return dp[m - 1][n - 1]",
    earlyExit:
      "def min_path_sum(grid):\n    return grid[0][0]",
    printAnswer:
      "def min_path_sum(grid):\n    return 7",
  },

  // 122 — CONVERTED to min_path_sum(grid): grid DP as a full function.
  "lesson:dp-grid-paths:dpgp-fix-1": {
    plausibleWrong:
      "def min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, n):\n        dp[0][j] = dp[0][j - 1] + grid[0][j]\n    for i in range(1, m):\n        dp[i][0] = dp[i - 1][0] + grid[i][0]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + max(dp[i - 1][j], dp[i][j - 1])\n    return dp[m - 1][n - 1]",
    earlyExit:
      "def min_path_sum(grid):\n    return grid[0][0]",
    printAnswer:
      "def min_path_sum(grid):\n    return 7",
  },

  // 123 — coin_change(coins, amount): fewest coins, or -1.
  "lesson:dp-coin-change:dpcc-complete-1": {
    // Returns the raw INF (never maps the impossible case to -1).
    plausibleWrong:
      "def coin_change(coins, amount):\n    INF = float('inf')\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and dp[a - c] + 1 < dp[a]:\n                dp[a] = dp[a - c] + 1\n    return dp[amount]",
    earlyExit:
      "def coin_change(coins, amount):\n    return 0",
    printAnswer:
      "def coin_change(coins, amount):\n    return 3",
  },

  // 124 — lis(nums): length of the longest STRICTLY increasing subsequence.
  "lesson:dp-lis:dplis-complete-1": {
    // Uses <= so equal values extend the run (counts non-strict).
    plausibleWrong:
      "def lis(nums):\n    if not nums:\n        return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] <= nums[i] and dp[j] + 1 > dp[i]:\n                dp[i] = dp[j] + 1\n    return max(dp)",
    earlyExit:
      "def lis(nums):\n    return 0",
    printAnswer:
      "def lis(nums):\n    return 4",
  },

  // 125 — lis(nums): return the best, not the run ending at the last index.
  "lesson:dp-lis:dplis-fix-1": {
    // Returns dp[-1] (run ending at the last element) instead of max(dp).
    plausibleWrong:
      "def lis(nums):\n    if not nums:\n        return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:\n                dp[i] = dp[j] + 1\n    return dp[-1]",
    earlyExit:
      "def lis(nums):\n    return 0",
    printAnswer:
      "def lis(nums):\n    return 4",
  },

  // 126 — CONVERTED to lcs(a, b): full longest-common-subsequence length.
  "lesson:dp-lcs:dplcs-complete-1": {
    // Mismatch takes the diagonal neighbour instead of the two orthogonal ones.
    plausibleWrong:
      "def lcs(a, b):\n    m, n = len(a), len(b)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j - 1], dp[i][j - 1])\n    return dp[m][n]",
    earlyExit:
      "def lcs(a, b):\n    return 0",
    printAnswer:
      "def lcs(a, b):\n    return 3",
  },

  // 127 — max_subarray(nums) (divide & conquer): best of left/right/cross.
  "lesson:dp-divide-and-conquer:dpdc-complete-1": {
    // Drops the crossing candidate from the combine step.
    plausibleWrong:
      "def max_subarray(nums):\n    def helper(lo, hi):\n        if lo == hi:\n            return nums[lo]\n        mid = (lo + hi) // 2\n        left = helper(lo, mid)\n        right = helper(mid + 1, hi)\n        s = 0; left_best = nums[mid]\n        for k in range(mid, lo - 1, -1):\n            s += nums[k]; left_best = max(left_best, s)\n        s = 0; right_best = nums[mid + 1]\n        for k in range(mid + 1, hi + 1):\n            s += nums[k]; right_best = max(right_best, s)\n        cross = left_best + right_best\n        return max(left, right)\n    return helper(0, len(nums) - 1)",
    earlyExit:
      "def max_subarray(nums):\n    return nums[0]",
    printAnswer:
      "def max_subarray(nums):\n    return 6",
  },

  // 128 — count_n_queens(n): count non-attacking placements.
  "lesson:dp-n-queens:dpnq-complete-1": {
    // Checks only one diagonal (forgets the anti-diagonal), over-counts.
    plausibleWrong:
      "def count_n_queens(n):\n    cols = set(); diag1 = set(); diag2 = set()\n    count = 0\n    def bt(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag1:\n                continue\n            cols.add(col); diag1.add(row - col); diag2.add(row + col)\n            bt(row + 1)\n            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)\n    bt(0)\n    return count",
    earlyExit:
      "def count_n_queens(n):\n    return 0",
    printAnswer:
      "def count_n_queens(n):\n    return 2",
  },

  // 129 — CONVERTED to count_n_queens(n): backtracking that frees all 3 sets.
  "lesson:dp-n-queens:dpnq-fix-1": {
    // Forgets to free the anti-diagonal on backtrack (leaks conflicts).
    plausibleWrong:
      "def count_n_queens(n):\n    cols = set(); diag1 = set(); diag2 = set()\n    count = 0\n    def bt(row):\n        nonlocal count\n        if row == n:\n            count += 1\n            return\n        for col in range(n):\n            if col in cols or (row - col) in diag1 or (row + col) in diag2:\n                continue\n            cols.add(col); diag1.add(row - col); diag2.add(row + col)\n            bt(row + 1)\n            cols.remove(col); diag1.remove(row - col)\n    bt(0)\n    return count",
    earlyExit:
      "def count_n_queens(n):\n    return 0",
    printAnswer:
      "def count_n_queens(n):\n    return 2",
  },

  // 130 — prefix(self, i): Fenwick prefix sum via lowest-set-bit walk.
  "lesson:fenwick-tree:fen-complete-1": {
    // Walks i -= 1 (linear) instead of i -= i & (-i): wrong sums.
    plausibleWrong:
      "def prefix(self, i):\n    s = 0\n    while i > 0:\n        s += self.tree[i]\n        i -= 1\n    return s",
    earlyExit:
      "def prefix(self, i):\n    return 0",
    printAnswer:
      "def prefix(self, i):\n    return 3",
  },

  // 131 — update(self, i, value): segment-tree point update + ancestor refresh.
  "lesson:segment-tree:seg-complete-1": {
    // Stops at i > 1, so the root (index 1) is never refreshed.
    plausibleWrong:
      "def update(self, i, value):\n    i += self.n\n    self.tree[i] = value\n    i //= 2\n    while i > 1:\n        self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]\n        i //= 2",
    earlyExit:
      "def update(self, i, value):\n    i += self.n\n    self.tree[i] = value",
    printAnswer:
      "def update(self, i, value):\n    pass",
  },

  // 132 — kmp_search(text, pattern): sorted match start indices.
  "lesson:kmp:kmp-complete-1": {
    // Resets j to 0 after a match instead of lps[j-1]: misses overlaps.
    plausibleWrong:
      "def kmp_search(text, pattern):\n    if not pattern:\n        return list(range(len(text) + 1))\n    lps = [0] * len(pattern)\n    k = 0\n    for q in range(1, len(pattern)):\n        while k > 0 and pattern[k] != pattern[q]:\n            k = lps[k - 1]\n        if pattern[k] == pattern[q]:\n            k += 1\n        lps[q] = k\n    res = []\n    i = j = 0\n    while i < len(text):\n        if text[i] == pattern[j]:\n            i += 1; j += 1\n            if j == len(pattern):\n                res.append(i - j)\n                j = 0\n        elif j > 0:\n            j = lps[j - 1]\n        else:\n            i += 1\n    return res",
    earlyExit:
      "def kmp_search(text, pattern):\n    return []",
    printAnswer:
      "def kmp_search(text, pattern):\n    return [6]",
  },

  // 133 — max_sum_k(nums, k): O(n) fixed-window maximum sum.
  "pattern:sliding-window:pat-sw-fix-1": {
    // Adds the entering element but never subtracts the leaving one.
    plausibleWrong:
      "def max_sum_k(nums, k):\n    window = sum(nums[:k])\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i]\n        best = max(best, window)\n    return best",
    earlyExit:
      "def max_sum_k(nums, k):\n    return sum(nums[:k])",
    printAnswer:
      "def max_sum_k(nums, k):\n    return 9",
  },

  // 134 — count_subarrays(nums, k): subarrays summing to k (prefix + map).
  "pattern:prefix-sums-hashmap:pat-ps-fix-1": {
    // Forgets seen[0]=1, so subarrays starting at index 0 are undercounted.
    plausibleWrong:
      "from collections import defaultdict\ndef count_subarrays(nums, k):\n    seen = defaultdict(int)\n    count = 0\n    prefix = 0\n    for x in nums:\n        prefix += x\n        count += seen[prefix - k]\n        seen[prefix] += 1\n    return count",
    earlyExit:
      "def count_subarrays(nums, k):\n    return 0",
    printAnswer:
      "def count_subarrays(nums, k):\n    return 2",
  },

  // 135 — kadane(nums): max subarray sum (non-empty).
  "pattern:kadane:pat-kadane-fix-1": {
    // Seeds best/cur at 0, so all-negative inputs return 0 (empty subarray).
    plausibleWrong:
      "def kadane(nums):\n    best = 0\n    cur = 0\n    for x in nums:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best",
    earlyExit:
      "def kadane(nums):\n    return nums[0]",
    printAnswer:
      "def kadane(nums):\n    return -1",
  },

  // 136 — two_sum_sorted(nums, target): index pair in a sorted array, or None.
  "pattern:two-pointers:pat-tp-fix-1": {
    // Moves the pointers the wrong direction on the comparison.
    plausibleWrong:
      "def two_sum_sorted(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo < hi:\n        s = nums[lo] + nums[hi]\n        if s == target:\n            return (lo, hi)\n        if s < target:\n            hi -= 1\n        else:\n            lo += 1\n    return None",
    earlyExit:
      "def two_sum_sorted(nums, target):\n    return None",
    printAnswer:
      "def two_sum_sorted(nums, target):\n    return (1, 3)",
  },

  // 137 — has_cycle(head): Floyd's cycle detection.
  "pattern:fast-slow-pointers:pat-fs-fix-1": {
    // Advances fast by one (not two): slow and fast never separate meaningfully.
    plausibleWrong:
      "def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next\n        if slow is fast:\n            return True\n    return False",
    earlyExit:
      "def has_cycle(head):\n    return False",
    printAnswer:
      "def has_cycle(head):\n    return True",
  },

  // 138 — CONVERTED to bfs_dist(adj, start): BFS shortest-hop distances.
  "pattern:bfs-shortest-path:pat-bfs-fix-1": {
    // Uses a stack (DFS), so distances are path-length, not shortest hops.
    plausibleWrong:
      "from collections import deque\ndef bfs_dist(adj, start):\n    stack = [start]\n    dist = {start: 0}\n    while stack:\n        node = stack.pop()\n        for nb in adj[node]:\n            if nb not in dist:\n                dist[nb] = dist[node] + 1\n                stack.append(nb)\n    return dist",
    earlyExit:
      "def bfs_dist(adj, start):\n    return {start: 0}",
    printAnswer:
      "def bfs_dist(adj, start):\n    return {0: 0, 1: 1, 2: 1, 3: 2, 4: 2}",
  },

  // 139 — CONVERTED to subsets(nums): all subsets via choose/explore/undo.
  "pattern:backtracking:pat-bt-fix-1": {
    // Appends the live list (aliasing bug): every recorded subset ends up [].
    plausibleWrong:
      "def subsets(nums):\n    res = []\n    def bt(start, path):\n        res.append(path)\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            bt(i + 1, path)\n            path.pop()\n    bt(0, [])\n    return res",
    earlyExit:
      "def subsets(nums):\n    return [[]]",
    printAnswer:
      "def subsets(nums):\n    return [[], [1], [2], [1, 2]]",
  },

  // 140 — least_capacity(weights, days): min ship capacity (binary search).
  "pattern:binary-search-on-answer:pat-bsa-fix-1": {
    // Skips the feasible boundary (hi = mid - 1), under-shooting the answer.
    plausibleWrong:
      "def least_capacity(weights, days):\n    def can_ship(cap):\n        d, cur = 1, 0\n        for w in weights:\n            if w > cap:\n                return False\n            if cur + w > cap:\n                d += 1; cur = 0\n            cur += w\n        return d <= days\n    lo, hi = max(weights), sum(weights)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can_ship(mid):\n            hi = mid - 1\n        else:\n            lo = mid + 1\n    return lo",
    earlyExit:
      "def least_capacity(weights, days):\n    return max(weights)",
    printAnswer:
      "def least_capacity(weights, days):\n    return 15",
  },

  // 141 — k_largest(nums, k): k largest values, descending.
  "pattern:top-k-heap:pat-tk-fix-1": {
    // Negates into a min-heap but pops the wrong end, keeping the k smallest.
    plausibleWrong:
      "import heapq\ndef k_largest(nums, k):\n    heap = []\n    for x in nums:\n        heapq.heappush(heap, -x)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return sorted((-v for v in heap), reverse=True)",
    earlyExit:
      "def k_largest(nums, k):\n    return []",
    printAnswer:
      "def k_largest(nums, k):\n    return [5, 4]",
  },

  // 142 — CONVERTED to add_lower(small, large, num): two-heap lower-half insert.
  "pattern:two-heaps:pat-th-fix-1": {
    // Pushes the raw popped value (no re-negation): breaks the partition.
    plausibleWrong:
      "import heapq\ndef add_lower(small, large, num):\n    heapq.heappush(small, -num)\n    heapq.heappush(large, heapq.heappop(small))\n    return small, large",
    earlyExit:
      "def add_lower(small, large, num):\n    return small, large",
    printAnswer:
      "def add_lower(small, large, num):\n    return [-5], [10]",
  },

  // 143 — CONVERTED to seed_heap(lists): k-way-merge heap seeding with tiebreak.
  "pattern:k-way-merge:pat-kwm-fix-1": {
    // Stores (val, lst): equal fronts compare lists and lack the (val,i,j) shape.
    plausibleWrong:
      "import heapq\ndef seed_heap(lists):\n    heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(heap, (lst[0], lst))\n    return heap",
    earlyExit:
      "def seed_heap(lists):\n    return []",
    printAnswer:
      "def seed_heap(lists):\n    return [(1, 0, 0), (1, 1, 0)]",
  },

  // 144 — CONVERTED to next_greater(nums): next greater element to the right.
  "pattern:monotonic-stack:pat-ms-fix-1": {
    // Uses > instead of <, resolving the wrong entries and leaving some -1.
    plausibleWrong:
      "def next_greater(nums):\n    res = [-1] * len(nums)\n    stack = []\n    for i, x in enumerate(nums):\n        while stack and nums[stack[-1]] > x:\n            res[stack.pop()] = x\n        stack.append(i)\n    return res",
    earlyExit:
      "def next_greater(nums):\n    return [-1] * len(nums)",
    printAnswer:
      "def next_greater(nums):\n    return [4, 2, 4, -1, -1]",
  },

  // 145 — CONVERTED to merge_intervals(intervals): merge overlapping intervals.
  "pattern:merge-intervals:pat-mi-fix-1": {
    // Sorts by END instead of START, so some overlaps are missed.
    plausibleWrong:
      "def merge_intervals(intervals):\n    if not intervals:\n        return []\n    intervals = sorted(intervals, key=lambda x: x[1])\n    merged = [list(intervals[0])]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
    earlyExit:
      "def merge_intervals(intervals):\n    return [list(intervals[0])] if intervals else []",
    printAnswer:
      "def merge_intervals(intervals):\n    return [[1, 5]]",
  },

  // 146 — max_non_overlapping(intervals): most mutually non-overlapping.
  "pattern:greedy-interval-scheduling:pat-gis-fix-1": {
    // Sorts by start (greedy must sort by end), so it selects too few.
    plausibleWrong:
      "def max_non_overlapping(intervals):\n    intervals = sorted(intervals, key=lambda x: x[0])\n    count = 0\n    last_end = float('-inf')\n    for start, end in intervals:\n        if start >= last_end:\n            count += 1\n            last_end = end\n    return count",
    earlyExit:
      "def max_non_overlapping(intervals):\n    return 0",
    printAnswer:
      "def max_non_overlapping(intervals):\n    return 2",
  },

  // 147 — CONVERTED to cyclic_sort(nums): cyclic sort with duplicate guard.
  "pattern:cyclic-sort:pat-cs-fix-1": {
    // Guards on i != j (indices) instead of value equality: loops on duplicates.
    plausibleWrong:
      "def cyclic_sort(nums):\n    i = 0\n    while i < len(nums):\n        j = nums[i]\n        if j < len(nums) and i != j:\n            nums[i], nums[j] = nums[j], nums[i]\n        else:\n            i += 1\n    return nums",
    earlyExit:
      "def cyclic_sort(nums):\n    return nums",
    printAnswer:
      "def cyclic_sort(nums):\n    return [0, 1, 2, 2]",
  },

  // 148 — CONVERTED to spiral(matrix): spiral order with boundary guards.
  "pattern:matrix-traversal:pat-mt-fix-1": {
    // Omits the top<=bottom / left<=right guards: single row/col double-visited.
    plausibleWrong:
      "def spiral(matrix):\n    if not matrix:\n        return []\n    res = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for c in range(left, right + 1):\n            res.append(matrix[top][c])\n        top += 1\n        for r in range(top, bottom + 1):\n            res.append(matrix[r][right])\n        right -= 1\n        for c in range(right, left - 1, -1):\n            res.append(matrix[bottom][c])\n        bottom -= 1\n        for r in range(bottom, top - 1, -1):\n            res.append(matrix[r][left])\n        left += 1\n    return res",
    earlyExit:
      "def spiral(matrix):\n    return matrix[0][:] if matrix else []",
    printAnswer:
      "def spiral(matrix):\n    return [1, 2, 3]",
  },

  // 149 — reverse(head): reverse a linked list in place, return new head.
  "pattern:in-place-linkedlist-reversal:pat-iplr-fix-1": {
    // Returns the old head instead of prev (the new head).
    plausibleWrong:
      "def reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return head",
    earlyExit:
      "def reverse(head):\n    return head",
    printAnswer:
      "def reverse(head):\n    return None",
  },

  // 150 — CONVERTED to level_order(root): BFS grouped by level.
  "pattern:tree-bfs:pat-tbfs-fix-1": {
    // Doesn't snapshot the level size, so every node becomes its own level.
    plausibleWrong:
      "from collections import deque\ndef level_order(root):\n    if not root:\n        return []\n    res = []\n    q = deque([root])\n    while q:\n        node = q.popleft()\n        res.append([node.val])\n        if node.left: q.append(node.left)\n        if node.right: q.append(node.right)\n    return res",
    earlyExit:
      "def level_order(root):\n    return [[root.val]] if root else []",
    printAnswer:
      "def level_order(root):\n    return [[1], [2, 3], [4, 5]]",
  },

  // 151 — CONVERTED to root_to_leaf(root): all root-to-leaf paths.
  "pattern:tree-dfs:pat-tdfs-fix-1": {
    // Never pops on the way up: path state leaks across sibling subtrees.
    plausibleWrong:
      "def root_to_leaf(root):\n    res = []\n    def dfs(node, path):\n        if not node:\n            return\n        path.append(node.val)\n        if not node.left and not node.right:\n            res.append(path[:])\n        dfs(node.left, path)\n        dfs(node.right, path)\n    dfs(root, [])\n    return res",
    earlyExit:
      "def root_to_leaf(root):\n    return []",
    printAnswer:
      "def root_to_leaf(root):\n    return [[1, 2, 4], [1, 2, 5], [1, 3]]",
  },

  // 152 — CONVERTED to count_components(n, edges): connected components (DFS).
  "pattern:graph-dfs-components:pat-gdc-fix-1": {
    // Counts components but hard-returns 1 (ignores the real count).
    plausibleWrong:
      "def count_components(n, edges):\n    adj = {i: [] for i in range(n)}\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    seen = set()\n    def dfs(node):\n        seen.add(node)\n        for nb in adj[node]:\n            if nb not in seen:\n                dfs(nb)\n    for i in range(n):\n        if i not in seen:\n            dfs(i)\n    return 1",
    earlyExit:
      "def count_components(n, edges):\n    return n",
    printAnswer:
      "def count_components(n, edges):\n    return 1",
  },

  // 153 — CONVERTED to topo_order(adj, indeg): Kahn's topological order.
  "pattern:topological-sort:pat-topo-fix-1": {
    // Enqueues every neighbour (not just newly-zeroed ones): duplicates/early.
    plausibleWrong:
      "from collections import deque\ndef topo_order(adj, indeg):\n    q = deque([v for v in indeg if indeg[v] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nb in adj[node]:\n            indeg[nb] -= 1\n            q.append(nb)\n    return order",
    earlyExit:
      "from collections import deque\ndef topo_order(adj, indeg):\n    return [v for v in indeg if indeg[v] == 0]",
    printAnswer:
      "def topo_order(adj, indeg):\n    return [0, 1, 2, 3]",
  },

  // 154 — find(self, x): union-find with path compression.
  "pattern:union-find:pat-uf-fix-1": {
    // Finds the root but omits compression (parent pointers never shorten).
    plausibleWrong:
      "def find(self, x):\n    while self.parent[x] != x:\n        x = self.parent[x]\n    return x",
    earlyExit:
      "def find(self, x):\n    return x",
    printAnswer:
      "def find(self, x):\n    return 0",
  },

  // 155 — Dijkstra loop body: settle each node once (skip stale heap entries).
  "pattern:dijkstra:pat-dij-fix-1": {
    // Drops the stale-entry skip, so settled nodes are reprocessed/over-expanded.
    plausibleWrong:
      "while pq:\n    d, node = heapq.heappop(pq)\n    for nb, w in adj[node]:\n        nd = d + w\n        if nd < dist[nb]:\n            dist[nb] = nd\n            heapq.heappush(pq, (nd, nb))",
    earlyExit:
      "pass",
    printAnswer:
      "dist = [0, 1, 2, 3]",
  },

  // 156 — CONVERTED to search(words, query): trie membership (full words only).
  "pattern:trie-prefix:pat-trie-fix-1": {
    // Returns True for any consumed path (treats a prefix as a stored word).
    plausibleWrong:
      "def search(words, query):\n    root = {}\n    for word in words:\n        node = root\n        for ch in word:\n            node = node.setdefault(ch, {})\n        node['$'] = True\n    node = root\n    for ch in query:\n        if ch not in node:\n            return False\n        node = node[ch]\n    return True",
    earlyExit:
      "def search(words, query):\n    return False",
    printAnswer:
      "def search(words, query):\n    return len(query) == 3",
  },

  // 157 — first_occurrence(nums, target): leftmost index, or -1.
  "pattern:modified-binary-search:pat-mbs-fix-1": {
    // Returns the first match found instead of continuing left for the earliest.
    plausibleWrong:
      "def first_occurrence(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
    earlyExit:
      "def first_occurrence(nums, target):\n    return -1",
    printAnswer:
      "def first_occurrence(nums, target):\n    return 1",
  },

  // 158 — fib(n): memoized Fibonacci.
  "pattern:dynamic-programming:pat-dp-fix-1": {
    // Recurses on n-1 and n-3 (wrong recurrence): wrong values beyond the base.
    plausibleWrong:
      "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 3)",
    earlyExit:
      "def fib(n):\n    return n",
    printAnswer:
      "def fib(n):\n    return 55",
  },

  // 159 — CONVERTED to subset_sum(nums, target): 0/1 subset sum.
  "pattern:knapsack:pat-ks-fix-1": {
    // Iterates capacity ascending, which lets an item be reused (unbounded).
    plausibleWrong:
      "def subset_sum(nums, target):\n    dp = [False] * (target + 1)\n    dp[0] = True\n    for num in nums:\n        for s in range(num, target + 1):\n            dp[s] = dp[s] or dp[s - num]\n    return dp[target]",
    earlyExit:
      "def subset_sum(nums, target):\n    return target == 0",
    printAnswer:
      "def subset_sum(nums, target):\n    return False",
  },

  // 160 — merge(left, right): merge two sorted lists (stable).
  "pattern:divide-and-conquer:pat-dac-fix-1": {
    // Uses < (not <=) so equal keys take the right element first (unstable).
    plausibleWrong:
      "def merge(left, right):\n    out = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    out.extend(left[i:])\n    out.extend(right[j:])\n    return out",
    earlyExit:
      "def merge(left, right):\n    return left",
    printAnswer:
      "def merge(left, right):\n    return [1, 2, 3, 4, 5, 6]",
  },
};

// Independently authored FU-1/FU-2 faulty solutions.
Object.assign(EXERCISE_FAULTY, {
  "lesson:task-scheduler:scheduler-complete-1": {
    "plausibleWrong": "from collections import Counter, deque\nimport heapq\n\ndef schedule(tasks, cooldown):\n    if type(cooldown) is not int or cooldown < 0:\n        raise ValueError(\"cooldown must be a nonnegative integer\")\n    for task in tasks:\n        if not isinstance(task, str) or len(task) != 1 or not \"A\" <= task <= \"Z\":\n            raise ValueError(\"tasks must be single letters A-Z\")\n    counts = Counter(tasks)\n    ready = [(-count, label) for label, count in counts.items()]\n    heapq.heapify(ready)\n    waiting = deque()\n    timeline = []\n    while ready or waiting:\n        time = len(timeline)\n        while waiting and waiting[0][0] <= time:\n            ready_at, neg_count, label = waiting.popleft()\n            heapq.heappush(ready, (neg_count, label))\n        if ready:\n            neg_count, label = heapq.heappop(ready)\n            timeline.append(label)\n            neg_count += 1\n            if neg_count < 0:\n                waiting.append((time + cooldown, neg_count, label))\n        else:\n            timeline.append(None)\n    return timeline",
    "earlyExit": "from collections import Counter, deque\nimport heapq\n\ndef schedule(tasks, cooldown):\n    if type(cooldown) is not int or cooldown < 0:\n        raise ValueError(\"cooldown must be a nonnegative integer\")\n    for task in tasks:\n        if not isinstance(task, str) or len(task) != 1 or not \"A\" <= task <= \"Z\":\n            raise ValueError(\"tasks must be single letters A-Z\")\n    counts = Counter(tasks)\n    ready = [(-count, label) for label, count in counts.items()]\n    heapq.heapify(ready)\n    waiting = deque()\n    timeline = []\n    while ready:\n        time = len(timeline)\n        while waiting and waiting[0][0] <= time:\n            ready_at, neg_count, label = waiting.popleft()\n            heapq.heappush(ready, (neg_count, label))\n        if ready:\n            neg_count, label = heapq.heappop(ready)\n            timeline.append(label)\n            neg_count += 1\n            if neg_count < 0:\n                waiting.append((time + cooldown + 1, neg_count, label))\n        else:\n            timeline.append(None)\n    return timeline",
    "printAnswer": "from collections import Counter, deque\nimport heapq\n\ndef schedule(tasks, cooldown):\n    if type(cooldown) is not int or cooldown < 0:\n        raise ValueError(\"cooldown must be a nonnegative integer\")\n    for task in tasks:\n        if not isinstance(task, str) or len(task) != 1 or not \"A\" <= task <= \"Z\":\n            raise ValueError(\"tasks must be single letters A-Z\")\n    counts = Counter(tasks)\n    ready = [(-count, label) for label, count in counts.items()]\n    heapq.heapify(ready)\n    waiting = deque()\n    timeline = []\n    while ready or waiting:\n        time = len(timeline)\n        while waiting and waiting[0][0] <= time:\n            ready_at, neg_count, label = waiting.popleft()\n            heapq.heappush(ready, (neg_count, label))\n        if ready:\n            neg_count, label = heapq.heappop(ready)\n            timeline.append(label)\n            neg_count += 1\n            if neg_count < 0:\n                waiting.append((time + cooldown + 1, neg_count, label))\n        else:\n            timeline.append(None)\n    print(timeline)"
  },
  "lesson:meeting-rooms-ii:rooms-complete-1": {
    "plausibleWrong": "import heapq\n\ndef min_rooms(intervals):\n    for start, end in intervals:\n        if type(start) is not int or type(end) is not int or start >= end:\n            raise ValueError(\"meetings need integer start < end\")\n    by_start = sorted(intervals, key=lambda meeting: meeting[0])\n    end_heap = []\n    peak = 0\n    active_counts = []\n    for start, end in by_start:\n        while end_heap and end_heap[0] < start:\n            heapq.heappop(end_heap)\n        heapq.heappush(end_heap, end)\n        peak = max(peak, len(end_heap))\n        active_counts.append(len(end_heap))\n    return peak",
    "earlyExit": "import heapq\n\ndef min_rooms(intervals):\n    for start, end in intervals:\n        if type(start) is not int or type(end) is not int or start >= end:\n            raise ValueError(\"meetings need integer start < end\")\n    by_start = sorted(intervals, key=lambda meeting: meeting[0])\n    end_heap = []\n    peak = 0\n    active_counts = []\n    for start, end in by_start:\n        while end_heap and end_heap[0] <= start:\n            heapq.heappop(end_heap)\n        heapq.heappush(end_heap, end)\n        peak = max(peak, len(end_heap))\n        active_counts.append(len(end_heap))\n        return peak\n    return peak",
    "printAnswer": "import heapq\n\ndef min_rooms(intervals):\n    for start, end in intervals:\n        if type(start) is not int or type(end) is not int or start >= end:\n            raise ValueError(\"meetings need integer start < end\")\n    by_start = sorted(intervals, key=lambda meeting: meeting[0])\n    end_heap = []\n    peak = 0\n    active_counts = []\n    for start, end in by_start:\n        while end_heap and end_heap[0] <= start:\n            heapq.heappop(end_heap)\n        heapq.heappush(end_heap, end)\n        peak = max(peak, len(end_heap))\n        active_counts.append(len(end_heap))\n    print(peak)"
  }
});
