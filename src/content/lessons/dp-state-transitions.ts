/**
 * Lesson: DP — state transitions (buy/sell stock once) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Maximum profit from one buy followed by a later sell; no trade gives zero.
def max_profit(prices):
    if not prices:
        return 0
    min_price = prices[0]
    best = 0
    for i in range(1, len(prices)):
        p = prices[i]
        best = max(best, p - min_price)
        min_price = min(min_price, p)
    return best

print(max_profit([7, 1, 5, 3, 6, 4]))`;

export const dpStateTransitions: LessonDefinition = {
  id: "dp-state-transitions",
  title: "DP: State Transitions",
  area: "DP and recursion",
  prerequisites: ["dp-tabulation"],

  explanation: "The heart of any dynamic-programming solution is its **state** and its **transition**. The **state** is the minimal information you must carry to make the next decision correctly; the **transition** is the rule that updates the state (and the answer) as you move from one step to the next. A sufficient state lets us write correct transitions; their cost and evaluation order still require analysis. This lesson makes that idea concrete with \"best time to buy and sell stock once.\"\n\nYou may buy on one day and sell on a **later** day; maximize the profit. A brute-force check of every (buy, sell) pair is O(n²). But notice what you actually need at day `p`: to sell today profitably, you only need the **cheapest price seen so far** — nothing else about the history matters. So the state is just two numbers: `min_price` (cheapest buy point up to now) and `best` (best profit so far). The transitions on each new price are: *\"could selling today beat my best?\"* → `best = max(best, p - min_price)`, and *\"is today a cheaper buy point?\"* → `min_price = min(min_price, p)`. One pass, **O(n)** time, **O(1)** space. For `[7,1,5,3,6,4]` the answer is **5** (buy at 1, sell at 6).\n\nThis is DP with the table compressed to a **constant number of rolling variables** — Fibonacci can also roll to constant scalar cells, while grid-path compression retains one row of columns. The transferable skill is the modeling question: **\"what is the least I must remember to decide the next step?\"** A minimal, sufficient state gives simple transitions and cheap solutions; a bloated state wastes time and space, and a missing piece makes the transition wrong. Getting the state right is the first and most important DP decision.\n\nThe loop uses indices instead of `prices[1:]`, whose copied references would cost O(n) memory. Selling before updating the minimum makes the strictly-earlier-buy invariant easy to read. Swapping these two updates would still give the same maximum-profit value with the no-trade answer initialized to zero: the only extra same-day candidate is zero. It would require more care if reconstructing actual transaction dates.",

  vocabulary: [
    { term: "State", definition: "The minimal information needed to make the next decision correctly." },
    { term: "Transition", definition: "The rule that updates the state (and answer) from one step to the next." },
    { term: "Rolling state", definition: "Keeping only a few variables instead of a full table when history compresses." },
    { term: "Running best", definition: "The best answer found so far, updated as the scan proceeds." },
    { term: "Minimal sufficient state", definition: "A state that omits nothing needed and includes nothing extra." },
  ],

  concepts: {
  "purpose": "Teach how to identify a minimal state and its transitions — the modeling core of every DP — via a one-pass example.",
  "operations": "Maintain the state variables; on each step apply the transition to update the answer and the state.",
  "uses": "Stock-trading variants, running max/min problems, Kadane-style scans, any DP that compresses to a few rolling values.",
  "tradeoffs": "A minimal state gives O(1) space and O(n) time; a redundant state costs more; an insufficient state gives wrong answers.",
  "commonMistakes": "Omitting necessary history or carrying an avoidable copy; using negative initial best when no trade is allowed; confusing a price value with its day index. With best=0, swapping the two scalar updates preserves the profit value.",
  "edgeCases": "Empty prices return 0; one day or nonincreasing prices also return 0. The intended input is finite non-negative integer prices. A profitable transaction must sell strictly later."
},

  complexity: [
    { operation: "best profit (rolling state)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; two state variables." },
    { operation: "brute-force pairs (contrast)", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)", note: "Check every (buy, sell) pair." },
  ],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of days / prices"
    }
  ],
  "costModel": "Each later day performs one indexed read, a subtraction and two scalar min/max updates. range produces indices without copying the input; comparisons and arithmetic are unit-cost.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop makes a single pass over the prices, doing constant work per day. So the total time is proportional to n — a big improvement over the O(n²) brute force that compares every buy/sell pair."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "A constant number of scalar variables and a range iterator are retained. No prices suffix slice or DP table is allocated.",
    "inputOutputNote": "The price list is the input; the single profit result is O(1). No table is allocated."
  },
  "derivation": [
    {
      "lines": [
        3,
        4,
        5,
        6
      ],
      "description": "Empty guard and constant initialization.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        7,
        8,
        9,
        10
      ],
      "description": "n−1 later days, constant scalar transitions per day.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        6,
        7,
        8
      ],
      "description": "Constant scalar/iterator storage; no input copy.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "You buy before you sell (sell strictly later).",
    "min_price and best summarize everything needed for the next decision.",
    "Comparisons/updates are O(1).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "The minimal state gives O(n)/O(1); brute force over pairs is O(n²). This is DP with a table compressed to rolling variables — the same optimization used in Fibonacci and grid-path DP.",
  "counters": [
    {
      "label": "later days processed",
      "definition": "Entries to the sell-profit computation, before assignment. Recorded line entries at 9 occur before the operation completes.",
      "countLines": [
        9
      ]
    },
    {
      "label": "minimum-price checks",
      "definition": "Entries to min assignment; the value need not change. Recorded line entries at 10 occur before the operation completes.",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "For [7,1,5,3,6,4] the best profit is 5 (buy 1, sell 6), found in one pass. The O(n) bound describes growth with the number of days. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: the sell must follow the buy; zero means no profitable trade."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define the single-transaction optimum."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Test for no trading days."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Return zero for an empty price list."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "Seed the cheapest earlier buy with day zero."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "Seed the no-trade optimum zero."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Visit later day indices without allocating a prices slice."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Read today's price from the supplied list."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "Consider selling today using the cheapest strictly earlier price."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "Update the cheapest price available for future days."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return the optimum profit; this code does not reconstruct days."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "Print the sample profit five."
  }
],

  bindings: [
  {
    "variable": "prices",
    "model": "array",
    "overlays": [
      {
        "role": "pointer",
        "label": "day i",
        "source": "i"
      },
      {
        "role": "total",
        "label": "best profit",
        "source": "best"
      }
    ]
  },
  {
    "variable": "min_price",
    "model": "object"
  },
  {
    "variable": "best",
    "model": "object"
  }
],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why is remembering only `min_price` and `best` enough — why don't we need the full price history?",
      answer: "To decide today's profit we only need the cheapest earlier price (best buy point) and the best profit so far. Everything else about the history is irrelevant to the next decision, so those two values are a minimal sufficient state.",
      explanation: "That's the essence of state design: keep exactly what future decisions depend on. Here selling today only needs the minimum price before today, so two rolling variables suffice.",
    },
  ],

  experiments: [
    "Print min_price and best each day to watch the state evolve.",
    "Feed strictly decreasing prices and confirm the profit is 0.",
    "Extend the state to also record the buy/sell days that achieve the best profit.",
  ],

  exercises: [
  {
    "id": "dpst-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `max_profit(prices)`: best profit from one buy then one later sell (0 if none). Assume a nonempty list of non-negative integer prices.",
    "starterCode": "def max_profit(prices):\n    if not prices:\n        return 0\n    min_price = prices[0]\n    best = 0\n    for p in prices[1:]:\n        # TODO: update best, then min_price\n        pass\n    return best",
    "expected": "def max_profit(prices):\n    if not prices:\n        return 0\n    min_price = prices[0]\n    best = 0\n    for i in range(1, len(prices)):\n        p = prices[i]\n        best = max(best, p - min_price)\n        min_price = min(min_price, p)\n    return best",
    "hints": [
      "Goal: max_profit(prices) = best profit from one buy then one later sell.",
      "The state you carry is the cheapest price seen so far and the best profit so far.",
      "Key property: selling today earns price - min_price_so_far.",
      "Approach: scan once, update best BEFORE moving min_price so you never sell before buying.",
      "Pseudocode: for p in prices[1:]: best=max(best, p-min_price); min_price=min(min_price,p).",
      "Fix: best = max(best, p - min_price) then min_price = min(min_price, p)."
    ],
    "tests": "assert max_profit([7,1,5,3,6,4]) == 5, 'buy 1 sell 6'\nassert max_profit([7,6,4,3,1]) == 0, 'only losses -> 0'\nassert max_profit([]) == 0\nassert max_profit([5]) == 0\nassert max_profit([1,2,3,4,5]) == 4\nprint('OK')"
  },
  {
    "id": "dpst-choose-1",
    "kind": "choose-approach",
    "prompt": "You could compare all (buy, sell) pairs in O(n²), or track a rolling state in O(n). Which do you pick for a long price series, and what state makes O(n) work?",
    "expected": "The O(n) rolling-state scan. The minimal state is (cheapest price so far, best profit so far); updating both per day gives the answer in one pass.",
    "hints": [
      "Goal: for a long price series, choose between comparing all (buy, sell) pairs in O(n²) and a rolling-state O(n) scan, and name the state.",
      "The costly baseline is the O(n²) double loop over all buy/sell pairs.",
      "Key property: the best sell at day i only depends on the cheapest price seen before it, so a small running summary suffices.",
      "Approach: scan once, maintaining a rolling state and updating the answer each day.",
      "Reasoning: tracking (cheapest price so far, best profit so far) lets each day update both in O(1), replacing the quadratic pairwise comparison with one linear pass.",
      "Answer: the O(n) rolling-state scan — minimal state (cheapest price so far, best profit so far), updated per day in one pass."
    ],
    "recognition": {
      "scenario": "For a long price series you can compare all (buy, sell) pairs in O(n²) or track a rolling state in O(n). You must choose and name the state.",
      "approaches": [
        {
          "id": "rolling-state",
          "label": "O(n) rolling-state scan tracking (min price, best profit)",
          "requiredReasonIds": [
            "rolling-min-profit"
          ]
        },
        {
          "id": "all-pairs",
          "label": "Compare every (buy, sell) pair",
          "requiredReasonIds": [],
          "rejectionFeedback": "Comparing all pairs is O(n²), unnecessary on a long series because a single left-to-right pass tracking the cheapest price so far already yields the best profit."
        }
      ],
      "reasons": [
        {
          "id": "rolling-min-profit",
          "text": "Keeping (cheapest price so far, best profit so far) and updating both each day gives the answer in one O(n) pass with O(1) extra state."
        },
        {
          "id": "needs-all-pairs",
          "text": "You must examine every buy/sell pair, so O(n²) is unavoidable.",
          "contradictory": true
        },
        {
          "id": "state-needs-full-history",
          "text": "The rolling scan must remember every past price, not just the minimum.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "rolling-state"
      ],
      "modelExplanation": "The O(n) rolling-state scan. The minimal state is (cheapest price so far, best profit so far); updating both per day gives the answer in one pass."
    }
  },
  {
    "id": "dpst-predict-1",
    "kind": "predict-state",
    "prompt": "For [7,1,5,3,6,4], what are min_price and best right after processing the price 6?",
    "expected": "min_price = 1, best = 5 (6 - 1). The 6 sets a new best; min_price stays 1.",
    "hints": [
      "The cheapest price so far is 1.",
      "Selling at 6 gives 6 - 1 = 5.",
      "6 doesn't lower min_price."
    ]
  }
],

  review: `Every DP is defined by its **state** (the minimal info needed to decide the next step) and its **transition** (how that state updates). "Buy/sell once" needs only two rolling values — \`min_price\` and \`best\` — so it runs in **O(n)** time and **O(1)** space, versus O(n²) brute force. The modeling question to always ask is **"what is the least I must remember?"**: a minimal, sufficient state yields simple transitions and cheap solutions. The example's best profit is **5**.`,

  expectedOutput: "5\n",

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
    "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/",
    "title": "LeetCode: Best Time to Buy and Sell Stock",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "One buy and one strictly later sell are allowed; no profitable trade returns zero."
    ],
    "conventions": [
      "Source numbers days from 1; app positions are 0-based. App adds empty-input return zero."
    ],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf",
    "title": "MIT 6.006 lecture 15: dynamic programming",
    "section": "SRTBOT; Fibonacci; memoization and bottom-up evaluation",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "A complete state, acyclic dependency order, base cases and correct recurrence justify DP; runtime counts states and nonrecursive transition work.",
      "Both memoization and tabulation are dynamic programming; Fibonacci is linear in scalar additions but big-integer additions grow with the index."
    ],
    "conventions": [
      "F(0)=0, F(1)=1. Displayed functions exclude demo literal construction and printing."
    ],
    "accessDate": "2026-10-10"
  }
],
  evidence: {
    inventoryVersion: 20,
    contentHash: "52e41c4f20588a12",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
