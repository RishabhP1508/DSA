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
 * TOPIC/SUBTOPIC PROJECTION (amendment): each occurrence declares the EXACT
 * coverage-entry id(s) it belongs to via `coverageIds`. The coverage doc attaches
 * a question to a subtopic ONLY through these ids — never by "any mapped
 * lesson/pattern id matches", which leaked questions across topics through shared
 * patterns (e.g. the sliding-window / two-pointers patterns belong to BOTH an
 * Arrays and a Strings coverage entry). Every `coverageId` must live in the
 * occurrence's own main-topic area (validated by notion-projection.test.ts).
 *
 * `mappedIds` records the lesson/pattern(s) that actually TEACH the technique
 * (with per-mapping evidence in the rationale). Where a lesson teaches only a
 * PREREQUISITE, the occurrence is either given a concise bridge (recorded in the
 * rationale + docs) or marked `status: "unresolved"` with a concrete content gap
 * — never implied to teach something it does not. Titles + canonical links only.
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
  /**
   * Coverage-entry id(s) this occurrence attaches to. MUST all be in the
   * occurrence's main-topic area. This is the ONLY channel the coverage doc uses
   * to surface the question (prevents cross-topic leakage via shared patterns).
   */
  coverageIds: string[];
  /** Lesson/pattern ids that teach this problem's technique (empty if unresolved). */
  mappedIds: string[];
  /** Whether the occurrence is mapped to a technique-teaching item or not. */
  status: "mapped" | "unresolved";
  /** Why it maps where it does — or, if unresolved, the concrete reason. */
  rationale: string;
}

/** Notion main topic -> coverage `area`. Every coverageId must be in this area. */
export const NOTION_TOPIC_TO_AREA: Record<string, string> = {
  "Arrays": "Arrays",
  "Strings": "Strings",
  "Linked Lists": "Linked lists",
  "Trees and Tries": "Trees and tries",
  "Stacks and Queues": "Stacks and queues",
  "Graphs": "Graphs",
  "Dynamic Programming and Recursion": "DP and recursion",
  "Heaps": "Heaps",
  "Hashing": "Hashing",
  "Bit Manipulation": "Bit manipulation",
  "Sorting": "Sorting",
  "Searching": "Searching",
};

/**
 * All 79 occurrences, in export order (topic by topic). Duplicates across topics
 * are kept as separate rows on purpose, each targeting its own topic's entries.
 */
export const NOTION_PRACTICE: NotionPracticeRow[] = [
  // ---- 1. Arrays (7) ----
  { source: "notion-export", mainTopic: "Arrays", title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", coverageIds: ["arrays/traversal"], mappedIds: ["maps-sets", "value-to-index"], status: "mapped", rationale: "Value-to-index hash lookup — taught by maps-sets/value-to-index; surfaced under the Arrays traversal entry for this topic occurrence." },
  { source: "notion-export", mainTopic: "Arrays", title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", coverageIds: ["arrays/kadane"], mappedIds: ["kadane"], status: "mapped", rationale: "Track the running minimum price and best profit so far in one pass — the same 'best-ending-here / best-so-far' scan Kadane teaches (max profit = max subarray of day-to-day deltas). Reviewed kadane: its cur/best rolling-variable scan is exactly this adaptation." },
  { source: "notion-export", mainTopic: "Arrays", title: "Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/", coverageIds: ["arrays/prefix-sums"], mappedIds: ["prefix-sums"], status: "mapped", rationale: "Prefix→suffix accumulation with + replaced by *. The prefix-sums lesson now teaches this adaptation in LEARNER-FACING content: its explanation walks the two-pass prefix/suffix-product method on [1,2,3,4]→[24,12,8,6] with the exclude-self + no-division (zero-safe) correctness condition, plus experiment 'Prefix products' and exercise ps-product-except-self-1." },
  { source: "notion-export", mainTopic: "Arrays", title: "Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/", coverageIds: ["arrays/kadane"], mappedIds: ["kadane"], status: "mapped", rationale: "Kadane's algorithm — taught directly by the kadane lesson/pattern." },
  { source: "notion-export", mainTopic: "Arrays", title: "3Sum", url: "https://leetcode.com/problems/3sum/", coverageIds: ["arrays/two-pointers"], mappedIds: ["two-pointers"], status: "mapped", rationale: "Sort, then a converging two-pointer sweep inside a fixed element — the two-pointers technique." },
  { source: "notion-export", mainTopic: "Arrays", title: "Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/", coverageIds: ["arrays/two-pointers"], mappedIds: ["two-pointers"], status: "mapped", rationale: "Converging two pointers moving the shorter wall inward — two-pointers." },
  { source: "notion-export", mainTopic: "Arrays", title: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", coverageIds: ["arrays/prefix-sums"], mappedIds: ["prefix-sums-map", "prefix-sums-hashmap"], status: "mapped", rationale: "Prefix sum + hashmap of prefix counts (handles negatives) — surfaced here under the Arrays prefix-sums entry; the Hashing occurrence targets hashing/prefix-sums-maps." },

  // ---- 2. Strings (6) ----
  { source: "notion-export", mainTopic: "Strings", title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", coverageIds: ["strings/anagrams"], mappedIds: ["anagrams", "string-frequency"], status: "mapped", rationale: "Character-frequency comparison — anagrams/string-frequency; Strings occurrence targets the anagrams entry." },
  { source: "notion-export", mainTopic: "Strings", title: "Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", coverageIds: ["strings/palindromes"], mappedIds: ["palindromes", "string-two-pointers"], status: "mapped", rationale: "Two-pointer inward scan skipping non-alphanumerics — palindromes lesson." },
  { source: "notion-export", mainTopic: "Strings", title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", coverageIds: ["strings/sliding-window"], mappedIds: ["string-sliding-window", "sliding-window"], status: "mapped", rationale: "Variable-size window with a last-seen map — the exact string-sliding-window example." },
  { source: "notion-export", mainTopic: "Strings", title: "Longest Repeating Character Replacement", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", coverageIds: ["strings/sliding-window"], mappedIds: ["string-sliding-window", "sliding-window"], status: "mapped", rationale: "Variable window keeping (window length − max freq) ≤ k — the variable-window technique in string-sliding-window." },
  { source: "notion-export", mainTopic: "Strings", title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", coverageIds: ["strings/anagrams"], mappedIds: ["grouping", "anagrams"], status: "mapped", rationale: "Group by a canonical (sorted/frequency) key — anagrams entry for the Strings occurrence; the Hashing occurrence targets hashing/grouping." },
  { source: "notion-export", mainTopic: "Strings", title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", coverageIds: ["strings/palindromes"], mappedIds: ["palindromes"], status: "mapped", rationale: "Expand-around-center. The palindromes lesson now teaches this in LEARNER-FACING content: its explanation covers expanding outward from all 2n−1 centers with the must-check-BOTH-odd-and-even-centers correctness condition, plus an experiment (babad/cbbd) and exercise pal-longest-substring-1." },

  // ---- 3. Linked Lists (6) ----
  { source: "notion-export", mainTopic: "Linked Lists", title: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", coverageIds: ["linked-lists/reversal"], mappedIds: ["linked-list-reversal", "in-place-linkedlist-reversal"], status: "mapped", rationale: "In-place pointer reversal — linked-list-reversal." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", coverageIds: ["linked-lists/cycle-detection"], mappedIds: ["linked-list-cycle-detection", "fast-slow-pointers"], status: "mapped", rationale: "Floyd's fast/slow cycle detection — linked-list-cycle-detection." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", coverageIds: ["linked-lists/middle"], mappedIds: ["linked-list-middle", "linked-list-slow-fast"], status: "mapped", rationale: "Fast/slow pointer to find the middle — linked-list-middle." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", coverageIds: ["linked-lists/merging"], mappedIds: ["linked-list-merging", "linked-list-dummy-nodes"], status: "mapped", rationale: "Dummy-head merge of two sorted lists — linked-list-merging." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Remove Nth Node From End of List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", coverageIds: ["linked-lists/slow-fast"], mappedIds: ["linked-list-slow-fast", "linked-list-dummy-nodes"], status: "mapped", rationale: "Two pointers a fixed gap apart (advance fast n, then move both) with a dummy head — linked-list-slow-fast." },
  { source: "notion-export", mainTopic: "Linked Lists", title: "Reorder List", url: "https://leetcode.com/problems/reorder-list/", coverageIds: ["linked-lists/middle"], mappedIds: ["linked-list-middle", "linked-list-reversal"], status: "mapped", rationale: "Find middle, reverse the second half, then interleave — composed from linked-list-middle + linked-list-reversal; surfaced under the middle entry." },

  // ---- 4. Trees and Tries (8) ----
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Maximum Depth of Binary Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", coverageIds: ["trees/height-depth"], mappedIds: ["tree-height-depth", "tree-dfs"], status: "mapped", rationale: "Height via DFS recursion — tree-height-depth." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", coverageIds: ["trees/dfs"], mappedIds: ["tree-dfs"], status: "mapped", rationale: "Recursive DFS swapping left/right children — tree-dfs." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Binary Tree Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", coverageIds: ["trees/bfs-level-order"], mappedIds: ["tree-bfs"], status: "mapped", rationale: "Level-order BFS with a queue — tree-bfs." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", coverageIds: ["trees/bst"], mappedIds: ["bst-operations"], status: "mapped", rationale: "BST-invariant validation via bounded DFS — bst-operations." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Lowest Common Ancestor of a Binary Search Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", coverageIds: ["trees/lca"], mappedIds: ["lowest-common-ancestor", "bst-operations"], status: "mapped", rationale: "LCA using the BST ordering to descend — lowest-common-ancestor." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", coverageIds: ["trees/height-depth"], mappedIds: ["tree-height-depth", "tree-dfs"], status: "mapped", rationale: "DFS returning subtree height while tracking the max left+right path — tree-height-depth." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Implement Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", coverageIds: ["trees/trie-insertion", "trees/prefix-search"], mappedIds: ["trie-insertion", "prefix-search", "trie-prefix"], status: "mapped", rationale: "Trie insert + prefix search — trie-insertion + prefix-search (both in the Trees area)." },
  { source: "notion-export", mainTopic: "Trees and Tries", title: "Word Search II", url: "https://leetcode.com/problems/word-search-ii/", coverageIds: ["trees/word-search"], mappedIds: ["word-search", "trie-insertion"], status: "mapped", rationale: "Grid DFS backtracking over a trie of words — word-search." },

  // ---- 5. Stacks and Queues (6) ----
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", coverageIds: ["stacks/parentheses"], mappedIds: ["parentheses-matching", "stack-queue-operations"], status: "mapped", rationale: "Stack push/pop bracket matching — parentheses-matching." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Min Stack", url: "https://leetcode.com/problems/min-stack/", coverageIds: ["stacks/min-max-tracking"], mappedIds: ["min-max-tracking", "stack-queue-operations"], status: "mapped", rationale: "Auxiliary stack tracking the running minimum — min-max-tracking (min/max tracking on a stack)." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Evaluate Reverse Polish Notation", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", coverageIds: ["stacks/expression-eval"], mappedIds: ["expression-evaluation"], status: "mapped", rationale: "Operand-stack RPN evaluation — the expression-evaluation lesson (same walkthrough)." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", coverageIds: ["stacks/monotonic"], mappedIds: ["monotonic-stack"], status: "mapped", rationale: "Monotonic decreasing stack of indices (next-greater) — monotonic-stack lesson + pattern." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", coverageIds: ["stacks/monotonic"], mappedIds: ["monotonic-stack"], status: "mapped", rationale: "Monotonic INCREASING index stack with width-on-pop area + sentinel flush. The monotonic-stack lesson now teaches this in LEARNER-FACING content: its explanation derives width = i - stack[-1] - 1 and the must-flush-with-a-height-0-sentinel correctness condition (worked on [2,1,5,6,2,3]→10), plus an experiment and exercise mono-histogram-1." },
  { source: "notion-export", mainTopic: "Stacks and Queues", title: "Implement Queue Using Stacks", url: "https://leetcode.com/problems/implement-queue-using-stacks/", coverageIds: ["stacks/operations"], mappedIds: ["stack-queue-operations"], status: "mapped", rationale: "Two-stack queue via amortized transfer — stack-queue-operations." },

  // ---- 6. Graphs (8) ----
  { source: "notion-export", mainTopic: "Graphs", title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", coverageIds: ["graphs/components"], mappedIds: ["connected-components", "graph-dfs", "graph-dfs-components"], status: "mapped", rationale: "Grid flood-fill counting components — connected-components." },
  { source: "notion-export", mainTopic: "Graphs", title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", coverageIds: ["graphs/dfs"], mappedIds: ["graph-dfs", "graph-bfs"], status: "mapped", rationale: "Traversal (DFS/BFS) with an old→new visited map to copy nodes — graph-dfs." },
  { source: "notion-export", mainTopic: "Graphs", title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", coverageIds: ["graphs/topo-sort"], mappedIds: ["topological-sort", "graph-cycle-detection"], status: "mapped", rationale: "Topological sort / cycle detection on a dependency DAG — topological-sort." },
  { source: "notion-export", mainTopic: "Graphs", title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", coverageIds: ["graphs/multi-source-bfs"], mappedIds: ["multi-source-bfs"], status: "mapped", rationale: "Multi-source BFS spreading from all rotten cells at once — multi-source-bfs." },
  { source: "notion-export", mainTopic: "Graphs", title: "Pacific Atlantic Water Flow", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", coverageIds: ["graphs/multi-source-bfs"], mappedIds: ["multi-source-bfs", "graph-dfs"], status: "mapped", rationale: "Multi-source traversal inward from each ocean's border cells, then intersect — multi-source-bfs." },
  { source: "notion-export", mainTopic: "Graphs", title: "Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", coverageIds: ["graphs/dijkstra"], mappedIds: ["dijkstra"], status: "mapped", rationale: "Single-source shortest path with non-negative weights — dijkstra." },
  { source: "notion-export", mainTopic: "Graphs", title: "Redundant Connection", url: "https://leetcode.com/problems/redundant-connection/", coverageIds: ["graphs/union-find"], mappedIds: ["union-find"], status: "mapped", rationale: "Union-Find detecting the edge that closes a cycle — union-find." },
  { source: "notion-export", mainTopic: "Graphs", title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", coverageIds: ["graphs/bfs"], mappedIds: ["graph-bfs", "bfs-shortest-path"], status: "mapped", rationale: "BFS shortest path on an implicit word-transformation graph — graph-bfs + bfs-shortest-path." },

  // ---- 7. Dynamic Programming and Recursion (9) ----
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", coverageIds: ["dp/climbing-stairs"], mappedIds: ["dp-climbing-stairs"], status: "mapped", rationale: "1D DP f(n)=f(n-1)+f(n-2) — dp-climbing-stairs." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "House Robber", url: "https://leetcode.com/problems/house-robber/", coverageIds: ["dp/house-robber"], mappedIds: ["dp-house-robber"], status: "mapped", rationale: "1D DP take/skip — dp-house-robber." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Coin Change", url: "https://leetcode.com/problems/coin-change/", coverageIds: ["dp/coin-change"], mappedIds: ["dp-coin-change"], status: "mapped", rationale: "Unbounded-knapsack min-coins DP — dp-coin-change." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", coverageIds: ["dp/lis"], mappedIds: ["dp-lis"], status: "mapped", rationale: "LIS DP — dp-lis." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", coverageIds: ["dp/lcs"], mappedIds: ["dp-lcs"], status: "mapped", rationale: "2D LCS DP — dp-lcs." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", coverageIds: ["dp/grid-paths"], mappedIds: ["dp-grid-paths"], status: "mapped", rationale: "2D grid-path counting DP — dp-grid-paths." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Subsets", url: "https://leetcode.com/problems/subsets/", coverageIds: ["dp/subsets"], mappedIds: ["dp-subsets", "backtracking"], status: "mapped", rationale: "Backtracking subset enumeration — dp-subsets." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Permutations", url: "https://leetcode.com/problems/permutations/", coverageIds: ["dp/permutations"], mappedIds: ["dp-permutations", "backtracking"], status: "mapped", rationale: "Backtracking permutation generation — dp-permutations." },
  { source: "notion-export", mainTopic: "Dynamic Programming and Recursion", title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", coverageIds: ["dp/combinations"], mappedIds: ["dp-combinations", "backtracking"], status: "mapped", rationale: "Backtracking that REUSES each candidate (recurse from the same index i) while subtracting from a running target and pruning when it goes negative. The dp-combinations lesson now teaches this in LEARNER-FACING content: its explanation states the two changes (recurse from i not i+1; target instead of size-k with a remaining<0 prune), the non-decreasing-index no-duplicate condition, AND the two preconditions the argument relies on — candidates must be strictly POSITIVE (else the prune/termination fails: a zero loops forever, a negative never overshoots) and DISTINCT values (else the same multiset is emitted twice without an extra guard); worked [2,3,6,7]/7→[[2,2,3],[7]], plus an experiment and exercise dpcomb-combination-sum-1. LC Combination Sum guarantees distinct positive candidates, so the plain adaptation is correct. Distinct from LC 77 Combinations (no reuse), which is in additionalPractice." },

  // ---- 8. Heaps (6) ----
  { source: "notion-export", mainTopic: "Heaps", title: "Kth Largest Element in an Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", coverageIds: ["heaps/kth"], mappedIds: ["kth-largest", "top-k-heap"], status: "mapped", rationale: "Size-k min-heap for the kth largest — kth-largest." },
  { source: "notion-export", mainTopic: "Heaps", title: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements/", coverageIds: ["heaps/top-k"], mappedIds: ["top-k", "top-k-heap"], status: "mapped", rationale: "Heap of the k most frequent — top-k." },
  { source: "notion-export", mainTopic: "Heaps", title: "K Closest Points to Origin", url: "https://leetcode.com/problems/k-closest-points-to-origin/", coverageIds: ["heaps/top-k"], mappedIds: ["top-k", "top-k-heap"], status: "mapped", rationale: "Size-k heap by squared distance — the top-K-with-a-heap technique in top-k." },
  { source: "notion-export", mainTopic: "Heaps", title: "Merge K Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", coverageIds: ["heaps/merge-sorted"], mappedIds: ["merge-sorted-data", "k-way-merge"], status: "mapped", rationale: "K-way merge with a min-heap of list fronts — merge-sorted-data + k-way-merge." },
  { source: "notion-export", mainTopic: "Heaps", title: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", coverageIds: ["heaps/running-median", "heaps/two-heap"], mappedIds: ["running-median", "two-heap-pattern", "two-heaps"], status: "mapped", rationale: "Two balanced heaps for a streaming median — running-median + two-heap-pattern." },
  { source: "notion-export", mainTopic: "Heaps", title: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler/", coverageIds: [], mappedIds: [], status: "unresolved", rationale: "CONTENT GAP: the technique is greedy COOLDOWN scheduling — repeatedly take the highest-remaining-count task, place it, decrement, and requeue after a cooldown window (or compute idle slots from the max frequency). The nearest lesson, top-k, teaches a bounded top-K heap, which is only a PREREQUISITE (a max-heap of counts) and does NOT teach the cooldown/idle-slot scheduling. No lesson teaches that adaptation, so this is honestly unresolved rather than implying top-k covers it. Not surfaced as practice on any coverage entry." },

  // ---- 9. Hashing (6) ----
  { source: "notion-export", mainTopic: "Hashing", title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", coverageIds: ["hashing/value-to-index"], mappedIds: ["maps-sets", "value-to-index"], status: "mapped", rationale: "Complement lookup in a value→index map — value-to-index (Hashing occurrence)." },
  { source: "notion-export", mainTopic: "Hashing", title: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate/", coverageIds: ["hashing/duplicates"], mappedIds: ["duplicate-detection"], status: "mapped", rationale: "Seen-set duplicate detection — duplicate-detection." },
  { source: "notion-export", mainTopic: "Hashing", title: "Valid Anagram", url: "https://leetcode.com/problems/valid-anagram/", coverageIds: ["hashing/frequency"], mappedIds: ["hashing-frequency", "anagrams"], status: "mapped", rationale: "Frequency-count hashmap comparison — hashing-frequency (Hashing occurrence)." },
  { source: "notion-export", mainTopic: "Hashing", title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/", coverageIds: ["hashing/grouping"], mappedIds: ["grouping"], status: "mapped", rationale: "Group by a canonical key in a hashmap — grouping (Hashing occurrence)." },
  { source: "notion-export", mainTopic: "Hashing", title: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", coverageIds: ["hashing/maps-sets"], mappedIds: ["maps-sets", "caching-seen"], status: "mapped", rationale: "Hash set with sequence-start checks (only extend from a number whose predecessor is absent) for O(n) — maps-sets teaches O(1) set membership; the start-of-run check is the bridge (recorded in docs/references.md)." },
  { source: "notion-export", mainTopic: "Hashing", title: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", coverageIds: ["hashing/prefix-sums-maps"], mappedIds: ["prefix-sums-map", "prefix-sums-hashmap"], status: "mapped", rationale: "Prefix sum + hashmap of prefix counts — prefix-sums-map (Hashing occurrence)." },

  // ---- 10. Bit Manipulation (6) ----
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Single Number", url: "https://leetcode.com/problems/single-number/", coverageIds: ["bits/xor-cancellation"], mappedIds: ["xor-cancellation", "bit-logical-ops", "bitwise-xor"], status: "mapped", rationale: "XOR cancellation leaving the unpaired value — xor-cancellation." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", coverageIds: ["bits/count-set-bits"], mappedIds: ["count-set-bits"], status: "mapped", rationale: "Population count (Brian Kernighan) — count-set-bits." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Counting Bits", url: "https://leetcode.com/problems/counting-bits/", coverageIds: ["bits/count-set-bits"], mappedIds: ["count-set-bits", "dp-1d-2d"], status: "mapped", rationale: "Set-bit counting with a DP recurrence dp[i]=dp[i>>1]+(i&1) — count-set-bits (the count) + the 1D DP recurrence." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Reverse Bits", url: "https://leetcode.com/problems/reverse-bits/", coverageIds: ["bits/shifts"], mappedIds: ["bit-shifts", "bit-check-set-clear"], status: "mapped", rationale: "Shift the result left and OR in the input's low bit, 32 times — bit-shifts." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", coverageIds: ["bits/xor-cancellation"], mappedIds: ["xor-cancellation", "bitwise-xor"], status: "mapped", rationale: "XOR of indices and values cancels to the missing one — xor-cancellation." },
  { source: "notion-export", mainTopic: "Bit Manipulation", title: "Sum of Two Integers", url: "https://leetcode.com/problems/sum-of-two-integers/", coverageIds: ["bits/logical-ops"], mappedIds: ["bit-logical-ops", "bit-shifts"], status: "mapped", rationale: "Add without '+': sum = a ^ b, carry = (a & b) << 1, loop until carry 0. The bit-logical-ops lesson now teaches this in LEARNER-FACING content: its explanation derives XOR=sum-without-carry / AND<<1=carry and the Python correctness condition (32-bit mask + signed remap, else the loop never terminates on negatives), plus an experiment (add(2,3), add(-2,3)) and exercise bit-log-sum-1." },

  // ---- 11. Sorting (5) ----
  { source: "notion-export", mainTopic: "Sorting", title: "Sort an Array", url: "https://leetcode.com/problems/sort-an-array/", coverageIds: ["sorting/merge"], mappedIds: ["merge-sort", "quick-sort"], status: "mapped", rationale: "Implement an O(n log n) sort — merge-sort." },
  { source: "notion-export", mainTopic: "Sorting", title: "Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", coverageIds: ["sorting/intervals"], mappedIds: ["interval-sorting", "merge-intervals"], status: "mapped", rationale: "Sort by start then sweep-merge overlaps — interval-sorting + merge-intervals." },
  { source: "notion-export", mainTopic: "Sorting", title: "Insert Interval", url: "https://leetcode.com/problems/insert-interval/", coverageIds: ["sorting/intervals"], mappedIds: ["interval-sorting", "merge-intervals"], status: "mapped", rationale: "Merge a new interval into a sorted interval list — interval-sorting + merge-intervals." },
  { source: "notion-export", mainTopic: "Sorting", title: "Meeting Rooms II", url: "https://leetcode.com/problems/meeting-rooms-ii/", coverageIds: [], mappedIds: [], status: "unresolved", rationale: "CONTENT GAP: minimum rooms needs either a min-heap of end times (pop when the next start ≥ the earliest end) or a sorted start/end sweep counting concurrent overlaps. The nearest lesson, interval-sorting, teaches sorting intervals and the greedy earliest-END selection (max non-overlapping) — a PREREQUISITE but NOT the concurrent-overlap counting this problem requires. No lesson teaches the room-count sweep, so honestly unresolved rather than implying interval-sorting covers it. Not surfaced as practice on any coverage entry." },
  { source: "notion-export", mainTopic: "Sorting", title: "Largest Number", url: "https://leetcode.com/problems/largest-number/", coverageIds: ["sorting/comparators"], mappedIds: ["comparators"], status: "mapped", rationale: "Custom comparator ordering (compare a+b vs b+a) — comparators." },

  // ---- 12. Searching (6) ----
  { source: "notion-export", mainTopic: "Searching", title: "Binary Search", url: "https://leetcode.com/problems/binary-search/", coverageIds: ["searching/binary"], mappedIds: ["binary-search"], status: "mapped", rationale: "Classic binary search on a sorted array — binary-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", coverageIds: ["searching/rotated"], mappedIds: ["rotated-array-search", "modified-binary-search"], status: "mapped", rationale: "Modified binary search using the always-one-side-sorted property — rotated-array-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", coverageIds: ["searching/rotated"], mappedIds: ["rotated-array-search", "modified-binary-search"], status: "mapped", rationale: "Binary search for the pivot/min in a rotated array — rotated-array-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Search a 2D Matrix", url: "https://leetcode.com/problems/search-a-2d-matrix/", coverageIds: ["searching/matrix"], mappedIds: ["matrix-search"], status: "mapped", rationale: "Binary search over a row-major-sorted matrix — matrix-search." },
  { source: "notion-export", mainTopic: "Searching", title: "Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", coverageIds: ["searching/binary-on-answer"], mappedIds: ["binary-search-answer", "binary-search-on-answer"], status: "mapped", rationale: "Binary search on the answer (minimum feasible eating rate) — binary-search-answer + binary-search-on-answer." },
  { source: "notion-export", mainTopic: "Searching", title: "Find First and Last Position of Element in Sorted Array", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", coverageIds: ["searching/bounds"], mappedIds: ["bounds"], status: "mapped", rationale: "Lower-bound and upper-bound binary searches — the bounds lesson." },
];

/** The count of unique canonical problems in the export (deduplicated by URL). */
export const NOTION_UNIQUE_URL_COUNT = new Set(NOTION_PRACTICE.map((r) => r.url)).size;

/**
 * ADDITIONAL optional practice — canonical problems that were in the earlier
 * conservative subset but are NOT listed in the Notion export. Kept as useful
 * extras, explicitly NOT counted as Notion reconciliation results. Titles +
 * canonical links only.
 *
 * PRESENTATION (for later UI / learning-path work — no UI in this milestone):
 * these are intended to render in a clearly separated "Additional practice
 * (beyond the syllabus)" group in the Pattern Library / lesson practice panels,
 * attached to the lesson(s) in `mappedIds`, and MUST be visually distinct from
 * the Notion-syllabus set (which is the authoritative list). Until that UI
 * exists there is intentionally no learner-facing consumer; this collection is
 * data-only and validated by tests.
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
  { source: "additional", title: "Combinations", url: "https://leetcode.com/problems/combinations/", mappedIds: ["dp-combinations", "backtracking"], rationale: "Backtracking k-combinations without reuse — reinforces dp-combinations; distinct from the export's Combination Sum (LC 39); not in the export." },
  { source: "additional", title: "Capacity To Ship Packages Within D Days", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", mappedIds: ["binary-search-answer", "binary-search-on-answer"], rationale: "Binary search on the answer — reinforces binary-search-answer; not in the export." },
  { source: "additional", title: "Find the Index of the First Occurrence in a String", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", mappedIds: ["kmp"], rationale: "Substring search (KMP) — reinforces kmp; not in the export." },
];
