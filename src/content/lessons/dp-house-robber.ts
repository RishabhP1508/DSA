/**
 * Lesson: DP worked example — house robber (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "12\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# House robber: max money without robbing two ADJACENT houses.
# For each house, choose the better of: skip it, or rob it + best up to two back.
def rob(nums):
    prev, curr = 0, 0     # best up to house i-2 (prev) and i-1 (curr)
    for x in nums:
        prev, curr = curr, max(curr, prev + x)  # skip vs rob
    return curr

print(rob([2, 7, 9, 3, 1]))   # rob houses 2,9,1 -> 12`;

export const dpHouseRobber: LessonDefinition = {
  id: "dp-house-robber",
  title: "DP Example: House Robber",
  area: "DP and recursion",
  prerequisites: ["dp-state-transitions", "dp-climbing-stairs"],

  explanation: "**House robber** is the canonical \"**take-or-skip with a constraint**\" DP. Houses along a street hold amounts of money; you want the **maximum total** you can rob, but you **cannot rob two adjacent houses** (an alarm links neighbors). Greedy — \"always grab the biggest\" — fails, because grabbing a large house can force you to skip two others that together are worth more.\n\nThe DP comes from a **take-or-skip** decision at each house `i`. Let `best(i)` be the most you can rob considering houses `0..i`. Either you **skip** house `i`, keeping `best(i−1)`, or you **rob** it, earning `nums[i]` **plus** `best(i−2)` (you must skip the adjacent `i−1`). So `best(i) = max(best(i−1), nums[i] + best(i−2))`. Because each answer depends only on the previous **two**, we compress the table to two rolling variables `prev` (= best two houses back) and `curr` (= best one house back), updated together with `prev, curr = curr, max(curr, prev + x)`. That is **O(n)** time and **O(1)** space. For `[2,7,9,3,1]` the best is **12** (rob houses worth 2, 9, and 1).\n\nThis example sharpens two DP habits. First, **derive the transition from the constraint**: \"adjacent forbidden\" is exactly what makes the \"rob\" branch reach **two** back instead of one. Second, notice the family resemblance to climbing stairs — same two-term rolling recurrence, different combiner (`max` for optimization vs `+` for counting). Recognizing that \"take this and jump the neighbor, or skip it\" shape lets you solve many variants: house robber on a **circle** (handle length 0/1 first; otherwise run the linear DP twice, once excluding the first house and once the last), and \"delete-and-earn\" style problems that reduce to this recurrence.\n\nFor [4,5,4], a richest-first greedy choice takes 5 and blocks both neighbors, totaling 5. The optimum takes the two 4-valued endpoints for 8. The sample [2,7,9,3,1] is not that counterexample: choosing 9 first can still choose 2 and 1 for 12. This function returns only a best total; recording/reconstructing the houses needs additional information.",

  vocabulary: [
    { term: "Take-or-skip", definition: "At each item, choose to include it (with a constraint) or exclude it." },
    { term: "Adjacency constraint", definition: "Robbing house i forbids robbing i-1 and i+1, so 'rob' reaches two back." },
    { term: "best(i)", definition: "The maximum money robbable considering houses 0..i." },
    { term: "Rolling variables", definition: "prev and curr replace the full table since best(i) needs only best(i-1) and best(i-2)." },
    { term: "Optimization combiner", definition: "max(...) chooses the better option (vs + for counting problems)." },
  ],

  concepts: {
  "purpose": "Model a constrained selection (no two adjacent) as a take-or-skip DP and reduce it to O(1) rolling state.",
  "operations": "At each house apply best(i) = max(best(i-1), nums[i] + best(i-2)); carry two rolling values.",
  "uses": "Non-adjacent selection, delete-and-earn, house robber on a circle, max-weight independent set on a path.",
  "tradeoffs": "The O(n) rolling recurrence is exact with two scalar totals. Richest-first greedy has no general correctness guarantee; a full prefix table can aid reconstruction.",
  "commonMistakes": "Using greedy (grab the largest) — incorrect; reaching only one house back in the 'rob' branch (violates adjacency); wrong initial rolling values.",
  "edgeCases": "With non-negative values, empty input returns 0, one house returns its value and two houses return their maximum. Circular variants need an explicit singleton case."
},

  complexity: [
    { operation: "house robber (rolling DP)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; two rolling variables." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of houses"
    }
  ],
  "costModel": "Each house does O(1) work: one addition, one max, and a paired assignment.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop visits each of the n houses once, doing constant work per house, so the total time is proportional to n."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only prev and curr are stored, regardless of how many houses there are, because best(i) depends only on the previous two answers.",
    "inputOutputNote": "The house list is the input; the single best-total integer is O(1). No table is allocated."
  },
  "derivation": [
    {
      "lines": [
        4
      ],
      "description": "Initialise the two rolling bests — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6
      ],
      "description": "One pass; per house a max/add and paired update.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "Two rolling variables, independent of n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Amounts are non-negative (skipping is never forced to a negative).",
    "Adjacency is the only constraint.",
    "max and addition are O(1).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Rolling state is optimal; a dp array is O(n) space for no gain. Greedy is O(n) but incorrect. For the circular variant, run this linear DP twice (exclude first, exclude last) and take the max.",
  "counters": [
    {
      "label": "houses processed",
      "definition": "executions of the transition line Recorded line entries at 6 occur before the operation completes.",
      "countLines": [
        6
      ]
    },
    {
      "label": "loop iterations",
      "definition": "executions of the loop body Recorded line entries at 5 occur before the operation completes.",
      "countLines": [
        5
      ]
    }
  ],
  "fixedDataNote": "rob([2,7,9,3,1]) processes 5 houses and returns 12. The O(n) bound describes growth with the number of houses. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: maximize money, no two adjacent houses." },
    { line: 2, executable: false, explanation: "Comment: the take-or-skip choice per house." },
    { line: 3, executable: true, explanation: "Define rob(nums)." },
    { line: 4, executable: true, explanation: "Rolling state: prev = best two houses back, curr = best one house back (both 0 initially)." },
    { line: 5, executable: true, explanation: "Process each house's amount x." },
    { line: 6, executable: true, explanation: "Transition: new best = max(skip = curr, rob = prev + x); prev becomes the old curr." },
    { line: 7, executable: true, explanation: "curr holds the best over all houses; return it." },
    { line: 8, executable: false, explanation: "Blank line." },
    { line: 9, executable: true, explanation: "Best for [2,7,9,3,1] is 12 (rob 2, 9, 1)." },
  ],

  bindings: [
  {
    "variable": "nums",
    "model": "array",
    "overlays": [
      {
        "role": "total",
        "label": "curr",
        "source": "curr"
      }
    ]
  },
  {
    "variable": "prev",
    "model": "object"
  },
  {
    "variable": "curr",
    "model": "object"
  }
],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why does the 'rob it' branch add best from TWO houses back (prev), not one?",
      answer: "Because robbing house i forbids robbing the adjacent house i-1. So the best compatible total is nums[i] plus best(i-2), skipping the neighbor. Reaching only one back would allow an illegal adjacent pair.",
      explanation: "The adjacency constraint is exactly what pushes the 'rob' branch to i-2. That's how the constraint shapes the recurrence.",
    },
  ],

  experiments: [
  "Print prev and curr each step to watch the running best evolve.",
  "Try a greedy 'take the largest first' and find an input where it loses to the DP.",
  "For a circular street, handle lengths 0 and 1 separately; otherwise compare rob(nums[:-1]) and rob(nums[1:]). Those Python slices use O(n) extra references even though the helper rob itself uses O(1) scalar slots."
],

  exercises: [
  {
    "id": "dphr-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `rob(nums)`: maximum sum with no two adjacent elements taken.",
    "starterCode": "def rob(nums):\n    prev, curr = 0, 0\n    for x in nums:\n        # TODO: roll forward with max(skip, rob)\n        pass\n    return curr",
    "expected": "def rob(nums):\n    prev, curr = 0, 0\n    for x in nums:\n        prev, curr = curr, max(curr, prev + x)\n    return curr",
    "hints": [
      "Goal: rob(nums) = max sum with no two adjacent elements chosen.",
      "The repeated decision at each house is take-or-skip; keep two rolling totals.",
      "Key property: best up to i = max(best up to i-1, nums[i] + best up to i-2).",
      "Approach: roll prev (i-2) and curr (i-1) forward in one pass.",
      "Pseudocode: for x in nums: prev, curr = curr, max(curr, prev + x).",
      "Fix: prev, curr = curr, max(curr, prev + x)."
    ],
    "tests": "assert rob([]) == 0\nassert rob([5]) == 5\nassert rob([1,2,3,1]) == 4, 'rob 1 and 3 -> 1+3=4'\nassert rob([2,7,9,3,1]) == 12, 'rob 2,9,1'\nassert rob([2,1,1,2]) == 4, 'rob first and last'\nprint('OK')"
  },
  {
    "id": "dphr-choose-1",
    "kind": "choose-approach",
    "prompt": "For [4,5,4], richest-first greedy takes the middle house 5 and blocks its neighbors. Which method finds the maximum without adjacent robberies, and what does each method return?",
    "expected": "Use take/skip dynamic programming. Greedy returns 5; the optimum takes the two endpoints for 4+4=8. The recurrence considers skipping each house or taking it plus the best two positions earlier.",
    "hints": [
      "List the valid non-adjacent selections from [4,5,4], including the choice of both endpoints.",
      "Picking the middle 5 blocks both 4-valued neighbors; a locally richest choice can lose a better pair.",
      "For each prefix, either skip its last house or take it and use the best prefix ending two positions earlier.",
      "Use take/skip dynamic programming so both valid possibilities contribute to the decision.",
      "Pseudocode: new_best = max(best_one_back, best_two_back + current_value); shift the saved prefix totals. The endpoint pair totals 8, whereas richest-first picks 5."
    ],
    "recognition": {
      "scenario": "For [4,5,4], richest-first greedy takes the middle house 5 and blocks its neighbors. Which method finds the maximum without adjacent robberies, and what does each method return?",
      "approaches": [
        {
          "id": "dp",
          "label": "Dynamic programming (max of rob-this + best-two-back, or skip)",
          "requiredReasonIds": [
            "dp-correct-nonadjacent"
          ]
        },
        {
          "id": "greedy-richest",
          "label": "Greedily grab the richest available non-adjacent house",
          "requiredReasonIds": [],
          "rejectionFeedback": "Richest-first picks 5 and blocks both endpoints, giving 5; selecting both 4-valued endpoints gives the larger valid total 8."
        }
      ],
      "reasons": [
        {
          "id": "dp-correct-nonadjacent",
          "text": "Take/skip prefix DP compares skipping the current house with taking it plus the best two positions earlier; for [4,5,4], the endpoints give 8."
        },
        {
          "id": "greedy-optimal-here",
          "text": "Greedily taking the richest house always yields the optimum for this problem.",
          "contradictory": true
        },
        {
          "id": "dp-gives-11",
          "text": "DP returns 5 for [4,5,4], so selecting both endpoints cannot improve it.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "dp"
      ],
      "modelExplanation": "Use take/skip dynamic programming. Greedy returns 5; the optimum takes the two endpoints for 4+4=8. The recurrence considers skipping each house or taking it plus the best two positions earlier."
    }
  },
  {
    "id": "dphr-predict-1",
    "kind": "predict-state",
    "prompt": "Trace curr after each house for [2,7,9,3,1].",
    "expected": "After 2:2, after 7:7, after 9:11, after 3:11, after 1:12. Answer 12.",
    "hints": [
      "curr = max(prev skip, rob).",
      "9 combines with 2 to give 11.",
      "1 combines with 11 to give 12."
    ]
  }
],

  review: "No adjacent houses means best(i)=max(best(i−1),nums[i]+best(i−2)). The two rolling totals update together from the old values. [2,7,9,3,1] gives 12; it is not a richest-first counterexample. [4,5,4] demonstrates greedy5 versus optimum8. The helper uses O(n) scalar work and O(1) scalar slots; reconstructing houses needs more information.",

  expectedOutput: "12\n",

  references: [
  {
    "url": "https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex",
    "title": "Python 3.14 numeric types",
    "section": "Numeric Types — int, float, complex",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Python integers have unlimited precision; a fixed number of integer variables is not fixed byte storage."
    ],
    "conventions": [
      "Complexity below counts scalar/cell operations; large-integer bit costs and output formatting are separate."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://faculty.cc.gatech.edu/~ladha/algo/L9.pdf",
    "title": "Georgia Tech CS3510 lecture 9",
    "section": "House robber, grid paths and DP evaluation",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "House-robber take/skip prefix recurrence yields 12 on [2,7,9,3,1]; right/down path counts combine above and left.",
      "Obstacle boundaries need propagation, not an interior-only skip rule."
    ],
    "conventions": [
      "App stairs allow 1 or 2 steps; source includes a 1/2/3 variant. Source grid prose uses start count 1; its conflicting dp[0][0]=0 pseudocode is not adopted."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://leetcode.com/problems/house-robber/description/",
    "title": "LeetCode: House Robber",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Non-negative house values must be selected without adjacent positions; the [2,7,9,3,1] optimum is 12."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "d2308771d8c5c10d",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
