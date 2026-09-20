// @vitest-environment node
/**
 * R5.6 — exact-set regression against the AUTHORITATIVE Notion export.
 *
 * Proves the manifest matches the supplied export exactly: 79 occurrences, 75
 * unique URLs, duplicates retained under every relevant topic, every mapped id
 * exists in the registry and teaches the technique, nothing dropped, no
 * additional problem falsely labelled notion-export, and every unresolved row
 * carries a concrete reason.
 */
import { describe, it, expect } from "vitest";
import { NOTION_PRACTICE, ADDITIONAL_PRACTICE, NOTION_UNIQUE_URL_COUNT } from "./notion-practice";
import { lessons, patterns } from "./registry";

const lessonIds = new Set(lessons.map((l) => l.id));
const patternIds = new Set(patterns.map((p) => p.id));
const known = (id: string) => lessonIds.has(id) || patternIds.has(id);

/**
 * The authoritative export, transcribed as (mainTopic, title, url) — 79 rows.
 * This is the fixture the manifest must match EXACTLY.
 */
const EXPORT: [string, string, string][] = [
  ["Arrays", "Two Sum", "https://leetcode.com/problems/two-sum/"],
  ["Arrays", "Best Time to Buy and Sell Stock", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"],
  ["Arrays", "Product of Array Except Self", "https://leetcode.com/problems/product-of-array-except-self/"],
  ["Arrays", "Maximum Subarray", "https://leetcode.com/problems/maximum-subarray/"],
  ["Arrays", "3Sum", "https://leetcode.com/problems/3sum/"],
  ["Arrays", "Container With Most Water", "https://leetcode.com/problems/container-with-most-water/"],
  ["Arrays", "Subarray Sum Equals K", "https://leetcode.com/problems/subarray-sum-equals-k/"],
  ["Strings", "Valid Anagram", "https://leetcode.com/problems/valid-anagram/"],
  ["Strings", "Valid Palindrome", "https://leetcode.com/problems/valid-palindrome/"],
  ["Strings", "Longest Substring Without Repeating Characters", "https://leetcode.com/problems/longest-substring-without-repeating-characters/"],
  ["Strings", "Longest Repeating Character Replacement", "https://leetcode.com/problems/longest-repeating-character-replacement/"],
  ["Strings", "Group Anagrams", "https://leetcode.com/problems/group-anagrams/"],
  ["Strings", "Longest Palindromic Substring", "https://leetcode.com/problems/longest-palindromic-substring/"],
  ["Linked Lists", "Reverse Linked List", "https://leetcode.com/problems/reverse-linked-list/"],
  ["Linked Lists", "Linked List Cycle", "https://leetcode.com/problems/linked-list-cycle/"],
  ["Linked Lists", "Middle of the Linked List", "https://leetcode.com/problems/middle-of-the-linked-list/"],
  ["Linked Lists", "Merge Two Sorted Lists", "https://leetcode.com/problems/merge-two-sorted-lists/"],
  ["Linked Lists", "Remove Nth Node From End of List", "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"],
  ["Linked Lists", "Reorder List", "https://leetcode.com/problems/reorder-list/"],
  ["Trees and Tries", "Maximum Depth of Binary Tree", "https://leetcode.com/problems/maximum-depth-of-binary-tree/"],
  ["Trees and Tries", "Invert Binary Tree", "https://leetcode.com/problems/invert-binary-tree/"],
  ["Trees and Tries", "Binary Tree Level Order Traversal", "https://leetcode.com/problems/binary-tree-level-order-traversal/"],
  ["Trees and Tries", "Validate Binary Search Tree", "https://leetcode.com/problems/validate-binary-search-tree/"],
  ["Trees and Tries", "Lowest Common Ancestor of a Binary Search Tree", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"],
  ["Trees and Tries", "Diameter of Binary Tree", "https://leetcode.com/problems/diameter-of-binary-tree/"],
  ["Trees and Tries", "Implement Trie", "https://leetcode.com/problems/implement-trie-prefix-tree/"],
  ["Trees and Tries", "Word Search II", "https://leetcode.com/problems/word-search-ii/"],
  ["Stacks and Queues", "Valid Parentheses", "https://leetcode.com/problems/valid-parentheses/"],
  ["Stacks and Queues", "Min Stack", "https://leetcode.com/problems/min-stack/"],
  ["Stacks and Queues", "Evaluate Reverse Polish Notation", "https://leetcode.com/problems/evaluate-reverse-polish-notation/"],
  ["Stacks and Queues", "Daily Temperatures", "https://leetcode.com/problems/daily-temperatures/"],
  ["Stacks and Queues", "Largest Rectangle in Histogram", "https://leetcode.com/problems/largest-rectangle-in-histogram/"],
  ["Stacks and Queues", "Implement Queue Using Stacks", "https://leetcode.com/problems/implement-queue-using-stacks/"],
  ["Graphs", "Number of Islands", "https://leetcode.com/problems/number-of-islands/"],
  ["Graphs", "Clone Graph", "https://leetcode.com/problems/clone-graph/"],
  ["Graphs", "Course Schedule", "https://leetcode.com/problems/course-schedule/"],
  ["Graphs", "Rotting Oranges", "https://leetcode.com/problems/rotting-oranges/"],
  ["Graphs", "Pacific Atlantic Water Flow", "https://leetcode.com/problems/pacific-atlantic-water-flow/"],
  ["Graphs", "Network Delay Time", "https://leetcode.com/problems/network-delay-time/"],
  ["Graphs", "Redundant Connection", "https://leetcode.com/problems/redundant-connection/"],
  ["Graphs", "Word Ladder", "https://leetcode.com/problems/word-ladder/"],
  ["Dynamic Programming and Recursion", "Climbing Stairs", "https://leetcode.com/problems/climbing-stairs/"],
  ["Dynamic Programming and Recursion", "House Robber", "https://leetcode.com/problems/house-robber/"],
  ["Dynamic Programming and Recursion", "Coin Change", "https://leetcode.com/problems/coin-change/"],
  ["Dynamic Programming and Recursion", "Longest Increasing Subsequence", "https://leetcode.com/problems/longest-increasing-subsequence/"],
  ["Dynamic Programming and Recursion", "Longest Common Subsequence", "https://leetcode.com/problems/longest-common-subsequence/"],
  ["Dynamic Programming and Recursion", "Unique Paths", "https://leetcode.com/problems/unique-paths/"],
  ["Dynamic Programming and Recursion", "Subsets", "https://leetcode.com/problems/subsets/"],
  ["Dynamic Programming and Recursion", "Permutations", "https://leetcode.com/problems/permutations/"],
  ["Dynamic Programming and Recursion", "Combination Sum", "https://leetcode.com/problems/combination-sum/"],
  ["Heaps", "Kth Largest Element in an Array", "https://leetcode.com/problems/kth-largest-element-in-an-array/"],
  ["Heaps", "Top K Frequent Elements", "https://leetcode.com/problems/top-k-frequent-elements/"],
  ["Heaps", "K Closest Points to Origin", "https://leetcode.com/problems/k-closest-points-to-origin/"],
  ["Heaps", "Merge K Sorted Lists", "https://leetcode.com/problems/merge-k-sorted-lists/"],
  ["Heaps", "Find Median from Data Stream", "https://leetcode.com/problems/find-median-from-data-stream/"],
  ["Heaps", "Task Scheduler", "https://leetcode.com/problems/task-scheduler/"],
  ["Hashing", "Two Sum", "https://leetcode.com/problems/two-sum/"],
  ["Hashing", "Contains Duplicate", "https://leetcode.com/problems/contains-duplicate/"],
  ["Hashing", "Valid Anagram", "https://leetcode.com/problems/valid-anagram/"],
  ["Hashing", "Group Anagrams", "https://leetcode.com/problems/group-anagrams/"],
  ["Hashing", "Longest Consecutive Sequence", "https://leetcode.com/problems/longest-consecutive-sequence/"],
  ["Hashing", "Subarray Sum Equals K", "https://leetcode.com/problems/subarray-sum-equals-k/"],
  ["Bit Manipulation", "Single Number", "https://leetcode.com/problems/single-number/"],
  ["Bit Manipulation", "Number of 1 Bits", "https://leetcode.com/problems/number-of-1-bits/"],
  ["Bit Manipulation", "Counting Bits", "https://leetcode.com/problems/counting-bits/"],
  ["Bit Manipulation", "Reverse Bits", "https://leetcode.com/problems/reverse-bits/"],
  ["Bit Manipulation", "Missing Number", "https://leetcode.com/problems/missing-number/"],
  ["Bit Manipulation", "Sum of Two Integers", "https://leetcode.com/problems/sum-of-two-integers/"],
  ["Sorting", "Sort an Array", "https://leetcode.com/problems/sort-an-array/"],
  ["Sorting", "Merge Intervals", "https://leetcode.com/problems/merge-intervals/"],
  ["Sorting", "Insert Interval", "https://leetcode.com/problems/insert-interval/"],
  ["Sorting", "Meeting Rooms II", "https://leetcode.com/problems/meeting-rooms-ii/"],
  ["Sorting", "Largest Number", "https://leetcode.com/problems/largest-number/"],
  ["Searching", "Binary Search", "https://leetcode.com/problems/binary-search/"],
  ["Searching", "Search in Rotated Sorted Array", "https://leetcode.com/problems/search-in-rotated-sorted-array/"],
  ["Searching", "Find Minimum in Rotated Sorted Array", "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"],
  ["Searching", "Search a 2D Matrix", "https://leetcode.com/problems/search-a-2d-matrix/"],
  ["Searching", "Koko Eating Bananas", "https://leetcode.com/problems/koko-eating-bananas/"],
  ["Searching", "Find First and Last Position of Element in Sorted Array", "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"],
];

const key = (t: string, title: string, url: string) => `${t}|||${title}|||${url}`;

describe("R5.6 Notion manifest — exact set", () => {
  it("has exactly 79 occurrences", () => {
    expect(NOTION_PRACTICE.length).toBe(79);
    expect(EXPORT.length).toBe(79);
  });

  it("has exactly 75 unique canonical URLs", () => {
    expect(NOTION_UNIQUE_URL_COUNT).toBe(75);
    expect(new Set(EXPORT.map((e) => e[2])).size).toBe(75);
  });

  it("matches the export occurrence-for-occurrence (topic + title + url), duplicates included", () => {
    const manifest = NOTION_PRACTICE.map((r) => key(r.mainTopic, r.title, r.url)).sort();
    const expected = EXPORT.map(([t, title, url]) => key(t, title, url)).sort();
    expect(manifest).toEqual(expected);
  });

  it("retains the 4 cross-topic duplicate problems under BOTH their topics", () => {
    const dupUrls = [
      "https://leetcode.com/problems/two-sum/",
      "https://leetcode.com/problems/valid-anagram/",
      "https://leetcode.com/problems/group-anagrams/",
      "https://leetcode.com/problems/subarray-sum-equals-k/",
    ];
    for (const url of dupUrls) {
      const topics = new Set(NOTION_PRACTICE.filter((r) => r.url === url).map((r) => r.mainTopic));
      expect(topics.size, `${url} should appear under 2 topics`).toBe(2);
    }
  });

  it("no Notion question is silently dropped (every export row is present)", () => {
    const manifestKeys = new Set(NOTION_PRACTICE.map((r) => key(r.mainTopic, r.title, r.url)));
    for (const [t, title, url] of EXPORT) {
      expect(manifestKeys.has(key(t, title, url)), `missing: ${t} / ${title}`).toBe(true);
    }
  });

  it("every mapped id exists in the registry (a real lesson or pattern)", () => {
    for (const r of NOTION_PRACTICE) {
      if (r.status === "mapped") {
        expect(r.mappedIds.length, `${r.title} mapped with no ids`).toBeGreaterThan(0);
        for (const id of r.mappedIds) expect(known(id), `${r.title} → unknown id "${id}"`).toBe(true);
      }
    }
  });

  it("every unresolved row has a non-empty concrete reason and no mapped ids", () => {
    for (const r of NOTION_PRACTICE) {
      if (r.status === "unresolved") {
        expect(r.rationale.trim().length, `${r.title} unresolved without a reason`).toBeGreaterThan(10);
        expect(r.mappedIds.length).toBe(0);
      }
    }
  });

  it("every mapped row has a non-empty rationale", () => {
    for (const r of NOTION_PRACTICE) {
      expect(r.rationale.trim().length, `${r.title} has no rationale`).toBeGreaterThan(10);
    }
  });
});

describe("R5.6 — the previously-absent questions are present AND mapped to a technique-teaching item", () => {
  // The 22 the amendment flagged, with the technique-teaching id each MUST map to.
  const flagged: [string, string][] = [
    ["Best Time to Buy and Sell Stock", "kadane"],
    ["Product of Array Except Self", "prefix-sums"],
    ["Longest Repeating Character Replacement", "string-sliding-window"],
    ["Remove Nth Node From End of List", "linked-list-slow-fast"],
    ["Reorder List", "linked-list-middle"],
    ["Invert Binary Tree", "tree-dfs"],
    ["Lowest Common Ancestor of a Binary Search Tree", "lowest-common-ancestor"],
    ["Diameter of Binary Tree", "tree-height-depth"],
    ["Min Stack", "min-max-tracking"],
    ["Largest Rectangle in Histogram", "monotonic-stack"],
    ["Clone Graph", "graph-dfs"],
    ["Pacific Atlantic Water Flow", "multi-source-bfs"],
    ["Word Ladder", "graph-bfs"],
    ["K Closest Points to Origin", "top-k"],
    ["Task Scheduler", "top-k"],
    ["Longest Consecutive Sequence", "maps-sets"],
    ["Reverse Bits", "bit-shifts"],
    ["Sum of Two Integers", "bit-logical-ops"],
    ["Meeting Rooms II", "interval-sorting"],
    ["Find Minimum in Rotated Sorted Array", "rotated-array-search"],
    ["Find First and Last Position of Element in Sorted Array", "bounds"],
    ["Combination Sum", "dp-combinations"],
  ];

  for (const [title, expectedId] of flagged) {
    it(`${title} → mapped, includes technique-teaching "${expectedId}"`, () => {
      const rows = NOTION_PRACTICE.filter((r) => r.title === title);
      expect(rows.length, `${title} not present`).toBeGreaterThan(0);
      for (const r of rows) expect(r.status).toBe("mapped");
      expect(rows.some((r) => r.mappedIds.includes(expectedId)), `${title} must map to ${expectedId}`).toBe(true);
      expect(known(expectedId)).toBe(true);
    });
  }
});

describe("R5.6 — additional practice is separate and not labelled Notion", () => {
  it("additional-practice URLs are NOT in the Notion export set (no false attribution)", () => {
    const notionUrls = new Set(NOTION_PRACTICE.map((r) => r.url));
    for (const a of ADDITIONAL_PRACTICE) {
      expect(a.source).toBe("additional");
      expect(notionUrls.has(a.url), `${a.title} is in the Notion set — move it out of additional`).toBe(false);
    }
  });

  it("every additional-practice row maps to a real registry id with a rationale", () => {
    for (const a of ADDITIONAL_PRACTICE) {
      expect(a.mappedIds.length).toBeGreaterThan(0);
      for (const id of a.mappedIds) expect(known(id), `${a.title} → unknown id "${id}"`).toBe(true);
      expect(a.rationale.trim().length).toBeGreaterThan(10);
    }
  });
});
