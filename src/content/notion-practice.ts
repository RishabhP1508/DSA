/**
 * R5.6 — Notion syllabus external-practice manifest (AUTHORITATIVE source).
 *
 * Reconciled from the user-supplied Notion export (source = "notion-export"),
 * which supersedes the earlier Cloudflare-blocked access attempts recorded in
 * .kiro/specs/R5-curriculum/external-practice-manifest.md.
 *
 * The export lists 79 QUESTION OCCURRENCES across 12 main topics, with 75 unique
 * canonical URLs — four problems (Two Sum, Valid Anagram, Group Anagrams,
 * Subarray Sum Equals K) intentionally appear under two topics each. Duplicate
 * occurrences are PRESERVED here (one row per occurrence) so a question is mapped
 * under every topic it belongs to; deduplicate by `url` only for unique-problem
 * statistics.
 *
 * Every occurrence maps to the lesson/pattern that actually TEACHES its
 * technique (verified against the real registry by notion-practice.test.ts), or
 * is marked `status: "unresolved"` with a concrete reason — no question is
 * silently dropped and no link is invented. Titles + canonical links only.
 *
 * External practice stays OPTIONAL; the mapped local lessons teach the technique
 * regardless of whether the learner opens the external problem.
 */

export interface NotionPracticeRow {
  /** Provenance — always the supplied export for this manifest. */
  source: "notion-export";
  /** Main topic heading as it appears in the export. */
  mainTopic: string;
  /** Exact question title from the export. */
  title: string;
  /** Canonical LeetCode URL from the export. */
  url: string;
  /** Lesson/pattern ids that teach this problem's technique (empty if unresolved). */
  mappedIds: string[];
  /** Whether the occurrence is mapped to a technique-teaching item or not. */
  status: "mapped" | "unresolved";
  /** Why it maps where it does — or, if unresolved, the concrete reason. */
  rationale: string;
}

/**
 * All 79 occurrences, in export order (topic by topic). Duplicates across topics
 * are kept as separate rows on purpose.
 */
export const NOTION_PRACTICE: NotionPracticeRow[] = [
  // ---- 1. Arrays (7) ----
  { source: "notion-export", mainTopic: "Arrays", title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", mappedIds: ["maps-sets", "value-to-index"], status: "mapped", rationale: "Value-to-index hash lookup — taught by maps-sets and value-to-index." },
  { source: "notion-export", mainTopic: "Arrays", title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", mappedIds: ["kadane", "array-traversal"], status: "mapped", rationale: "One-pass running-min / best-profit scan — the Kadane-style single-pass tracking taught in kadane (and array-traversal for the scan)." },
  { source: "notion-export", mainTopic: "Arrays", title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", mappedIds: ["prefix-sums"], status: "mapped", rationale: "Prefix/suffix accumulation (products) — the prefix-accumulation technique taught in prefix-sums." },
  { source: "notion-export", mainTopic: "Arrays", title: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", mappedIds: ["kadane"], status: "mapped", rationale: "Kadane's algorithm — taught directly by the kadane lesson/pattern." },
  { source: "notion-export", mainTopic: "Arrays", title: "3Sum", url: "https://leetcode.com/problems/3sum/", mappedIds: ["two-pointers"], status: "mapped", rationale: "Sorted two-pointer sweep inside a fixed element — the two-pointers technique." },
  { source: "notion-export", mainTopic: "Arrays", title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", mappedIds: ["two-pointers"], status: "mapped", rationale: "Converging two pointers on a sorted-by-position array — two-pointers." },
  { source: "notion-export", mainTopic: "Arrays", title: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", mappedIds: ["prefix-sums-map", "prefix-sums-hashmap"], status: "mapped", rationale: "Prefix sum + hashmap of counts (handles negatives) — prefix-sums-map lesson and the prefix-sums-hashmap pattern." },

  // ---- 2. Strings (6) ----
  { source: "notion-export", mainTopic: "Strings", title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", mappedIds: ["anagrams", "string-frequency"], status: "mapped", rationale: "Character frequency comparison — taught by anagrams and string-frequency." },
  { source: "notion-export", mainTopic: "Strings", title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", mappedIds: ["palindromes", "string-two-pointers"], status: "mapped", rationale: "Two-pointer inward scan skipping non-alphanumerics — palindromes + string-two-pointers." },
  { source: "notion-export", mainTopic: "Strings", title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", mappedIds: ["string-sliding-window", "sliding-window"], status: "mapped", rationale: "Variable-size sliding window with a last-seen map — the exact string-sliding-window example." },
  { source: "notion-export", mainTopic: "Strings", title: "Longest Repeating Character Replacement", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", mappedIds: ["string-sliding-window", "sliding-window"], status: "mapped", rationale: "Variable-size window keeping (window length − max freq) ≤ k — the variable-window technique in string-sliding-window / sliding-window." },
  { source: "notion-export", mainTopic: "Strings", title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", mappedIds: ["grouping", "anagrams"], status: "mapped", rationale: "Group by a canonical (sorted / frequency) key in a hashmap — grouping + anagrams." },
  { source: "notion-export", mainTopic: "Strings", title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", mappedIds: ["palindromes"], status: "mapped", rationale: "Expand-around-center palindrome checking — the palindromes lesson." },

  // ---- 3. Linked Lists (6) ----
  { source: "notion-export", mainTopic: "Linked Lists", title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", mappedIds: ["linked-list-reversal", "in-place-linkedlist-reversal"], status: "mapped", rationale: "In-place pointer reversal — linked-list-reversal lesson + in-place-linkedlist-reversal pattern." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", mappedIds: ["linked-list-cycle-detection", "fast-slow-pointers"], status: "mapped", rationale: "Floyd's fast/slow cycle detection — linked-list-cycle-detection + fast-slow-pointers." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", mappedIds: ["linked-list-middle", "linked-list-slow-fast"], status: "mapped", rationale: "Fast/slow pointer to find the middle — linked-list-middle + linked-list-slow-fast." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", mappedIds: ["linked-list-merging", "linked-list-dummy-nodes"], status: "mapped", rationale: "Dummy-head merge of two sorted lists — linked-list-merging + linked-list-dummy-nodes." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Remove Nth Node From End of List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", mappedIds: ["linked-list-slow-fast", "linked-list-dummy-nodes"], status: "mapped", rationale: "Two pointers a fixed gap apart (advance fast n steps, then move both) with a dummy head — linked-list-slow-fast + linked-list-dummy-nodes." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Reorder List", url: "https://leetcode.com/problems/reorder-list/", mappedIds: ["linked-list-middle", "linked-list-reversal"], status: "mapped", rationale: "Find middle, reverse the second half, then interleave — composed from linked-list-middle and linked-list-reversal." },

  // ---- 4. Trees and Tries (8) ----
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", mappedIds: ["tree-height-depth", "tree-dfs"], status: "mapped", rationale: "Height via DFS recursion — tree-height-depth + tree-dfs." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", mappedIds: ["tree-dfs"], status: "mapped", rationale: "Recursive DFS swapping left/right children at each node — tree-dfs." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", mappedIds: ["tree-bfs"], status: "mapped", rationale: "Level-order BFS with a queue — tree-bfs lesson + pattern." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", mappedIds: ["bst-operations"], status: "mapped", rationale: "BST-invariant validation via bounded DFS — bst-operations." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Lowest Common Ancestor of a Binary Search Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", mappedIds: ["lowest-common-ancestor", "bst-operations"], status: "mapped", rationale: "LCA using the BST ordering to descend — lowest-common-ancestor + bst-operations (the BST descent it relies on)." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", mappedIds: ["tree-height-depth", "tree-dfs"], status: "mapped", rationale: "DFS returning subtree height while tracking the max left+right path — tree-height-depth (height DFS) + tree-dfs." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Implement Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", mappedIds: ["trie-insertion", "prefix-search", "trie-prefix"], status: "mapped", rationale: "Trie insert + prefix search — trie-insertion + prefix-search lessons and the trie-prefix pattern." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", mappedIds: ["word-search", "trie-insertion"], status: "mapped", rationale: "Grid DFS backtracking over a trie of words — word-search + trie-insertion." },

  // ---- 5. Stacks and Queues (6) ----
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", mappedIds: ["parentheses-matching", "stack-queue-operations"], status: "mapped", rationale: "Stack push/pop matching of brackets — parentheses-matching + stack-queue-operations." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Min Stack", url: "https://leetcode.com/problems/min-stack/", mappedIds: ["min-max-tracking", "stack-queue-operations"], status: "mapped", rationale: "Auxiliary stack tracking the running minimum — min-max-tracking (min/max tracking on a stack) + stack-queue-operations." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", mappedIds: ["expression-evaluation"], status: "mapped", rationale: "Operand stack evaluation of RPN — the expression-evaluation lesson (same walkthrough)." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", mappedIds: ["monotonic-stack"], status: "mapped", rationale: "Monotonic decreasing stack of indices (next-greater) — monotonic-stack lesson + pattern." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", mappedIds: ["monotonic-stack"], status: "mapped", rationale: "Monotonic increasing stack popping to compute widths — monotonic-stack." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Implement Queue Using Stacks", url: "https://leetcode.com/problems/implement-queue-using-stacks/", mappedIds: ["stack-queue-operations"], status: "mapped", rationale: "Two-stack queue via amortized transfer — stack-queue-operations." },

  // ---- 6. Graphs (8) ----
  { source: "notion-export", mainTopic: "Graphs", title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", mappedIds: ["connected-components", "graph-dfs", "graph-dfs-components"], status: "mapped", rationale: "Grid flood-fill counting components — connected-components + graph-dfs + graph-dfs-components pattern." },
  { source: "notion-export", mainTopic: "Graphs", title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", mappedIds: ["graph-dfs", "graph-bfs"], status: "mapped", rationale: "Traversal (DFS or BFS) with a visited/old→new map to copy nodes — graph-dfs / graph-bfs." },
  { source: "notion-export", mainTopic: "Graphs", title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", mappedIds: ["topological-sort", "graph-cycle-detection"], status: "mapped", rationale: "Topological sort / cycle detection on a dependency DAG — topological-sort + graph-cycle-detection." },
  { source: "notion-export", mainTopic: "Graphs", title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", mappedIds: ["multi-source-bfs"], status: "mapped", rationale: "Multi-source BFS spreading from all rotten cells at once — multi-source-bfs." },
  { source: "notion-export", mainTopic: "Graphs", title: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", mappedIds: ["multi-source-bfs", "graph-dfs"], status: "mapped", rationale: "Multi-source traversal inward from each ocean's border cells, then intersect — multi-source-bfs + graph-dfs." },
  { source: "notion-export", mainTopic: "Graphs", title: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", mappedIds: ["dijkstra"], status: "mapped", rationale: "Single-source shortest path with non-negative weights — dijkstra lesson + pattern." },
  { source: "notion-export", mainTopic: "Graphs", title: "Redundant Connection", url: "https://leetcode.com/problems/redundant-connection/", mappedIds: ["union-find"], status: "mapped", rationale: "Union-Find detecting the edge that closes a cycle — union-find lesson + pattern." },
  { source: "notion-export", mainTopic: "Graphs", title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", mappedIds: ["graph-bfs", "bfs-shortest-path"], status: "mapped", rationale: "BFS shortest path on an implicit word-transformation graph — graph-bfs + bfs-shortest-path pattern." },

  // ---- 7. Dynamic Programming and Recursion (9) ----
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", mappedIds: ["dp-climbing-stairs"], status: "mapped", rationale: "1D DP recurrence f(n)=f(n-1)+f(n-2) — dp-climbing-stairs." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "House Robber", url: "https://leetcode.com/problems/house-robber/", mappedIds: ["dp-house-robber"], status: "mapped", rationale: "1D DP with take/skip transition — dp-house-robber." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Coin Change", url: "https://leetcode.com/problems/coin-change/", mappedIds: ["dp-coin-change"], status: "mapped", rationale: "Unbounded-knapsack min-coins DP — dp-coin-change." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", mappedIds: ["dp-lis"], status: "mapped", rationale: "LIS DP — dp-lis." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", mappedIds: ["dp-lcs"], status: "mapped", rationale: "2D LCS DP — dp-lcs." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", mappedIds: ["dp-grid-paths"], status: "mapped", rationale: "2D grid-path counting DP — dp-grid-paths." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Subsets", url: "https://leetcode.com/problems/subsets/", mappedIds: ["dp-subsets", "backtracking"], status: "mapped", rationale: "Backtracking subset enumeration — dp-subsets + backtracking pattern." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Permutations", url: "https://leetcode.com/problems/permutations/", mappedIds: ["dp-permutations", "backtracking"], status: "mapped", rationale: "Backtracking permutation generation — dp-permutations + backtracking." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", mappedIds: ["dp-combinations", "backtracking"], status: "mapped", rationale: "Backtracking with reuse and a running target — dp-combinations + backtracking." },

  // ---- 8. Heaps (6) ----
  { source: "notion-export", mainTopic: "Heaps", title: "Kth Largest Element in an Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", mappedIds: ["kth-largest", "top-k-heap"], status: "mapped", rationale: "Size-k min-heap for the kth largest — kth-largest + top-k-heap." },
  { source: "notion-export", mainTopic: "Heaps", title: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", mappedIds: ["top-k", "top-k-heap"], status: "mapped", rationale: "Heap of the k most frequent — top-k + top-k-heap." },
  { source: "notion-export", mainTopic: "Heaps", title: "K Closest Points to Origin", url: "https://leetcode.com/problems/k-closest-points-to-origin/", mappedIds: ["top-k", "top-k-heap"], status: "mapped", rationale: "Size-k heap by distance — the top-K-with-a-heap technique in top-k + top-k-heap." },
  { source: "notion-export", mainTopic: "Heaps", title: "Merge K Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", mappedIds: ["merge-sorted-data", "k-way-merge"], status: "mapped", rationale: "K-way merge with a min-heap of list fronts — merge-sorted-data + k-way-merge." },
  { source: "notion-export", mainTopic: "Heaps", title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", mappedIds: ["running-median", "two-heap-pattern", "two-heaps"], status: "mapped", rationale: "Two balanced heaps for a streaming median — running-median + two-heap-pattern + two-heaps." },
  { source: "notion-export", mainTopic: "Heaps", title: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler/", mappedIds: ["top-k", "top-k-heap"], status: "mapped", rationale: "Greedy scheduling driven by a max-heap of remaining task counts — the heap-of-counts technique in top-k / top-k-heap. (Greedy-with-a-heap; no dedicated scheduling lesson.)" },

  // ---- 9. Hashing (6) ----
  { source: "notion-export", mainTopic: "Hashing", title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", mappedIds: ["maps-sets", "value-to-index"], status: "mapped", rationale: "Complement lookup in a value→index map — maps-sets + value-to-index." },
  { source: "notion-export", mainTopic: "Hashing", title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", mappedIds: ["duplicate-detection"], status: "mapped", rationale: "Seen-set duplicate detection — duplicate-detection." },
  { source: "notion-export", mainTopic: "Hashing", title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", mappedIds: ["hashing-frequency", "anagrams"], status: "mapped", rationale: "Frequency-count hashmap comparison — hashing-frequency + anagrams." },
  { source: "notion-export", mainTopic: "Hashing", title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", mappedIds: ["grouping"], status: "mapped", rationale: "Group by a canonical key in a hashmap — grouping." },
  { source: "notion-export", mainTopic: "Hashing", title: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", mappedIds: ["maps-sets", "caching-seen"], status: "mapped", rationale: "Hash set with sequence-start checks for O(n) — maps-sets (set membership) + caching-seen." },
  { source: "notion-export", mainTopic: "Hashing", title: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", mappedIds: ["prefix-sums-map", "prefix-sums-hashmap"], status: "mapped", rationale: "Prefix sum + hashmap of prefix counts — prefix-sums-map + prefix-sums-hashmap." },

  // ---- 10. Bit Manipulation (6) ----
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Single Number", url: "https://leetcode.com/problems/single-number/", mappedIds: ["xor-cancellation", "bit-logical-ops", "bitwise-xor"], status: "mapped", rationale: "XOR cancellation leaving the unpaired value — xor-cancellation + bit-logical-ops + bitwise-xor." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", mappedIds: ["count-set-bits"], status: "mapped", rationale: "Population count (Brian Kernighan) — count-set-bits." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", mappedIds: ["count-set-bits", "dp-1d-2d"], status: "mapped", rationale: "Set-bit counting with a DP recurrence dp[i]=dp[i>>1]+(i&1) — count-set-bits + dp-1d-2d." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits/", mappedIds: ["bit-shifts", "bit-check-set-clear"], status: "mapped", rationale: "Shift out / shift in bits to reverse — bit-shifts + bit-check-set-clear." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", mappedIds: ["xor-cancellation", "bitwise-xor"], status: "mapped", rationale: "XOR of indices and values cancels to the missing one — xor-cancellation + bitwise-xor." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Sum of Two Integers", url: "https://leetcode.com/problems/sum-of-two-integers/", mappedIds: ["bit-logical-ops", "bit-shifts"], status: "mapped", rationale: "Add without '+': XOR for the sum-bits and (AND<<1) for the carry, looped — bit-logical-ops (AND/XOR) + bit-shifts (carry shift)." },

  // ---- 11. Sorting (5) ----
  { source: "notion-export", mainTopic: "Sorting", title: "Sort an Array", url: "https://leetcode.com/problems/sort-an-array/", mappedIds: ["merge-sort", "quick-sort"], status: "mapped", rationale: "Implement an O(n log n) sort — merge-sort / quick-sort." },
  { source: "notion-export", mainTopic: "Sorting", title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", mappedIds: ["interval-sorting", "intervals", "merge-intervals"], status: "mapped", rationale: "Sort by start then sweep-merge overlaps — interval-sorting + intervals + merge-intervals pattern." },
  { source: "notion-export", mainTopic: "Sorting", title: "Insert Interval", url: "https://leetcode.com/problems/insert-interval/", mappedIds: ["intervals", "merge-intervals"], status: "mapped", rationale: "Merge a new interval into a sorted interval list — intervals + merge-intervals." },
  { source: "notion-export", mainTopic: "Sorting", title: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii/", mappedIds: ["interval-sorting", "greedy-interval-scheduling"], status: "mapped", rationale: "Sort by start + a min-heap of end times (or a start/end sweep) to count concurrent rooms — interval-sorting + greedy-interval-scheduling." },
  { source: "notion-export", mainTopic: "Sorting", title: "Largest Number", url: "https://leetcode.com/problems/largest-number/", mappedIds: ["comparators"], status: "mapped", rationale: "Custom comparator ordering (a+b vs b+a) — comparators." },

  // ---- 12. Searching (6) ----
  { source: "notion-export", mainTopic: "Searching", title: "Binary Search", url: "https://leetcode.com/problems/binary-search/", mappedIds: ["binary-search"], status: "mapped", rationale: "Classic binary search on a sorted array — binary-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", mappedIds: ["rotated-array-search", "modified-binary-search"], status: "mapped", rationale: "Modified binary search using the always-one-side-sorted property — rotated-array-search + modified-binary-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", mappedIds: ["rotated-array-search", "modified-binary-search"], status: "mapped", rationale: "Binary search for the pivot/min in a rotated array — rotated-array-search + modified-binary-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Search a 2D Matrix", url: "https://leetcode.com/problems/search-a-2d-matrix/", mappedIds: ["matrix-search"], status: "mapped", rationale: "Binary search over a row-major-sorted matrix — matrix-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", mappedIds: ["binary-search-answer", "binary-search-on-answer"], status: "mapped", rationale: "Binary search on the answer (minimum feasible rate) — binary-search-answer + binary-search-on-answer." },
  { source: "notion-export", mainTopic: "Searching", title: "Find First and Last Position of Element in Sorted Array", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", mappedIds: ["bounds"], status: "mapped", rationale: "Lower-bound and upper-bound binary searches — the bounds lesson." },
];

/** The count of unique canonical problems in the export (deduplicated by URL). */
export const NOTION_UNIQUE_URL_COUNT = new Set(NOTION_PRACTICE.map((r) => r.url)).size;

/**
 * ADDITIONAL optional practice — canonical problems that were in the earlier
 * conservative subset but are NOT listed in the Notion export. Kept as useful
 * extras, explicitly NOT counted as Notion reconciliation results. Titles +
 * canonical links only.
 */
export interface AdditionalPracticeRow {
  source: "additional";
  title: string;
  url: string;
  mappedIds: string[];
  rationale: string;
}

export const ADDITIONAL_PRACTICE: AdditionalPracticeRow[] = [
  { source: "additional", title: "Two Sum II — Input Array Is Sorted", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", mappedIds: ["two-pointers"], rationale: "Sorted two-pointer — reinforces two-pointers; not in the Notion export." },
  { source: "additional", title: "Minimum Size Subarray Sum", url: "https://leetcode.com/problems/minimum-size-subarray-sum/", mappedIds: ["sliding-window"], rationale: "Variable window over positive sums — reinforces sliding-window; not in the export." },
  { source: "additional", title: "Maximum Average Subarray I", url: "https://leetcode.com/problems/maximum-average-subarray-i/", mappedIds: ["sliding-window"], rationale: "Fixed-size window average — reinforces sliding-window; not in the export." },
  { source: "additional", title: "Range Sum Query - Immutable", url: "https://leetcode.com/problems/range-sum-query-immutable/", mappedIds: ["prefix-sums"], rationale: "Prefix-sum range queries — reinforces prefix-sums; not in the export." },
  { source: "additional", title: "Remove Duplicates from Sorted Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", mappedIds: ["in-place-modification"], rationale: "In-place two-pointer compaction — reinforces in-place-modification; not in the export." },
  { source: "additional", title: "Find All Numbers Disappeared in an Array", url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/", mappedIds: ["in-place-modification"], rationale: "Index-as-hash in-place marking — reinforces in-place-modification; not in the export." },
  { source: "additional", title: "Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix/", mappedIds: ["matrix-traversal"], rationale: "Boundary-shrinking spiral walk — reinforces matrix-traversal; not in the export." },
  { source: "additional", title: "Rotate Image", url: "https://leetcode.com/problems/rotate-image/", mappedIds: ["matrix-traversal"], rationale: "In-place matrix rotation — reinforces matrix-traversal; not in the export." },
  { source: "additional", title: "First Unique Character in a String", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", mappedIds: ["string-frequency"], rationale: "Character frequency counting — reinforces string-frequency; not in the export." },
  { source: "additional", title: "Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", mappedIds: ["string-sliding-window"], rationale: "Advanced variable window — reinforces string-sliding-window; not in the export." },
  { source: "additional", title: "Reverse Linked List II", url: "https://leetcode.com/problems/reverse-linked-list-ii/", mappedIds: ["linked-list-reversal", "in-place-linkedlist-reversal"], rationale: "Sublist in-place reversal — reinforces linked-list reversal; not in the export." },
  { source: "additional", title: "Linked List Cycle II", url: "https://leetcode.com/problems/linked-list-cycle-ii/", mappedIds: ["linked-list-cycle-detection"], rationale: "Cycle entry via Floyd's — reinforces cycle detection; not in the export." },
  { source: "additional", title: "Path Sum", url: "https://leetcode.com/problems/path-sum/", mappedIds: ["tree-dfs"], rationale: "Root-to-leaf DFS with a running sum — reinforces tree-dfs; not in the export." },
  { source: "additional", title: "Search in a Binary Search Tree", url: "https://leetcode.com/problems/search-in-a-binary-search-tree/", mappedIds: ["bst-operations"], rationale: "BST descent — reinforces bst-operations; not in the export." },
  { source: "additional", title: "Lowest Common Ancestor of a Binary Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", mappedIds: ["lowest-common-ancestor"], rationale: "General-tree LCA via DFS — reinforces lowest-common-ancestor; not in the export (the export lists the BST variant)." },
  { source: "additional", title: "Next Greater Element I", url: "https://leetcode.com/problems/next-greater-element-i/", mappedIds: ["monotonic-stack"], rationale: "Monotonic stack next-greater — reinforces monotonic-stack; not in the export." },
  { source: "additional", title: "Nearest Exit from Entrance in Maze", url: "https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/", mappedIds: ["graph-bfs"], rationale: "Grid BFS shortest path — reinforces graph-bfs; not in the export." },
  { source: "additional", title: "Number of Provinces", url: "https://leetcode.com/problems/number-of-provinces/", mappedIds: ["connected-components"], rationale: "Connected components — reinforces connected-components; not in the export." },
  { source: "additional", title: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/", mappedIds: ["topological-sort"], rationale: "Topological ordering output — reinforces topological-sort; not in the export." },
  { source: "additional", title: "Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", mappedIds: ["dp-knapsack"], rationale: "0/1 subset-sum DP — reinforces dp-knapsack; not in the export." },
  { source: "additional", title: "N-Queens", url: "https://leetcode.com/problems/n-queens/", mappedIds: ["dp-n-queens"], rationale: "Backtracking placement — reinforces dp-n-queens; not in the export." },
  { source: "additional", title: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals/", mappedIds: ["interval-sorting", "greedy-interval-scheduling"], rationale: "Greedy interval scheduling — reinforces interval scheduling; not in the export." },
  { source: "additional", title: "Combinations", url: "https://leetcode.com/problems/combinations/", mappedIds: ["dp-combinations", "backtracking"], rationale: "Backtracking k-combinations — reinforces dp-combinations; distinct from the export's Combination Sum (LC 39); not in the export." },
  { source: "additional", title: "Capacity To Ship Packages Within D Days", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", mappedIds: ["binary-search-answer", "binary-search-on-answer"], rationale: "Binary search on the answer — reinforces binary-search-answer; not in the export." },
  { source: "additional", title: "Find the Index of the First Occurrence in a String", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", mappedIds: ["kmp"], rationale: "Substring search (KMP) — reinforces kmp; not in the export." },
];
