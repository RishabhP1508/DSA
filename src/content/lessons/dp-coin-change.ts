/**
 * Lesson: DP worked example — coin change (fewest coins) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "3\n". Uses the dp-table visualizer (1D over
 * amounts).
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Fewest coins to make 'amount' from unlimited coins of the given denominations.
def coin_change(coins, amount):
    if amount < 0 or any(c <= 0 for c in coins):
        raise ValueError("use positive coins and non-negative amount")
    INF = amount + 1                 # a sentinel bigger than any real answer
    dp = [0] + [INF] * amount        # dp[a] = fewest coins to make a; dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1  # use coin c, plus best for the remainder
    return dp[amount] if dp[amount] != INF else -1

print(coin_change([1, 2, 5], 11))   # 5 + 5 + 1 = 3 coins`;

export const dpCoinChange: LessonDefinition = {
  id: "dp-coin-change",
  title: "DP Example: Coin Change",
  area: "DP and recursion",
  prerequisites: ["dp-tabulation", "dp-state-transitions"],

  explanation: "**Coin change (fewest coins)** asks for the **minimum number of coins** that sum to a target `amount`, drawing from **unlimited** coins of given denominations. It's a classic where the natural **greedy** rule — always take the largest coin that fits — **fails** for some coin systems (e.g. coins `[1,3,4]`, amount 6: greedy gives 4+1+1 = 3 coins, but 3+3 = 2 is better). So we need DP for a guaranteed optimum.\n\nThe state is the sub-amount: `dp[a]` = the fewest coins to make exactly `a`. The transition considers **every coin** as the *last* coin used: if coin `c` fits (`c <= a`), then one way to make `a` is coin `c` plus the best way to make `a − c`, i.e. `dp[a-c] + 1`; we keep the **minimum** over all coins. The **base case** is `dp[0] = 0` (zero coins make zero). Unreachable amounts stay at a sentinel `INF`, and if `dp[amount]` is still `INF` at the end, the amount is impossible, so we return −1. Filling `a` from 1 up to `amount` guarantees `dp[a-c]` is already computed. For coins `[1,2,5]` and amount 11 the answer is **3** (5+5+1).\n\nNote the **unbounded** flavor: because coins can repeat, the transition freely reuses `dp[a-c]` for the *same* coin set — unlike 0/1 knapsack, which must not reuse an item. This is **O(amount × #coins)** time and **O(amount)** space — **pseudo-polynomial**, since it scales with the numeric value of `amount`. The reusable lessons: (1) when greedy might be wrong, reach for DP; (2) \"try each option as the last step, add its cost, take the best\" is the same last-choice-split you saw in climbing stairs, now with a `min` over choices; and (3) always handle the **impossible/unreachable** case explicitly.\n\nEvery coin must be a strictly positive integer. This ensures amount−coin is an earlier state and any feasible answer uses at most amount coins. Thus amount+1 is a safe unreachable sentinel. With zero or negative denominations those dependency/termination arguments fail; the code rejects them. The greedy failure [1,3,4], amount6 gives 4+1+1 (3 coins) versus 3+3 (2 coins).",

  vocabulary: [
    { term: "Coin change (min)", definition: "Fewest coins summing to a target, with unlimited coins of each denomination." },
    { term: "dp[a]", definition: "The minimum number of coins to make sub-amount a." },
    { term: "Last-coin split", definition: "Casing on which coin is used last: dp[a] = min over c of dp[a-c] + 1." },
    { term: "Sentinel (INF)", definition: "A value larger than any real answer marking still-unreachable amounts." },
    { term: "Unbounded reuse", definition: "Coins may repeat, so dp[a-c] can use the same denomination again (unlike 0/1 knapsack)." },
  ],

  concepts: {
  "purpose": "Compute an exact minimum-coins answer where greedy can fail, using bottom-up DP over sub-amounts.",
  "operations": "For each amount 1..target, try each coin as the last coin, take min(dp[a-c] + 1); handle impossibility with a sentinel.",
  "uses": "Making change, minimum-operations-to-reach-target problems, unbounded-knapsack-style counting/optimization.",
  "tradeoffs": "Exact and pseudo-polynomial in the numeric amount. Largest-coin-first greedy has no guarantee for arbitrary positive denominations; a canonical system is one where it is optimal for every reachable amount.",
  "commonMistakes": "Assuming greedy is optimal (it isn't in general); forgetting the c <= a guard (negative index); not returning -1 for unreachable amounts; treating it like 0/1 knapsack (coins are reusable).",
  "edgeCases": "Amount 0 returns 0, including an empty coin set. Empty coins with a positive amount return −1. Duplicated positive denominations do not change correctness, but repeat checks. Zero/negative denominations and negative amount raise ValueError."
},

  complexity: [
  {
    "operation": "coin change (min, DP)",
    "best": "O((A+1)*(k+1))",
    "average": "O((A+1)*(k+1))",
    "worst": "O((A+1)*(k+1))",
    "space": "O(A+1)",
    "note": "Validation, allocation and transitions are included; pseudo-polynomial in numeric amount."
  }
],

  complexityExplanation: {
  "scope": "function",
  "variables": [
    {
      "symbol": "A",
      "meaning": "the target amount"
    },
    {
      "symbol": "k",
      "meaning": "the number of coin denominations"
    }
  ],
  "costModel": "Each (amount, coin) pair does O(1) work (a compare and a possible update). Every pair is examined once.",
  "time": {
    "bound": "O((A+1)*(k+1))",
    "case": "worst",
    "explanation": "Validate k denominations, initialize A+1 cells, and test k denominations for each amount 1..A. Total O(k+A+Ak+1)=O((A+1)(k+1)), including an empty coin set or amount zero. For positive A,k it is commonly O(Ak), pseudo-polynomial in numeric A."
  },
  "space": {
    "bound": "O(A+1)",
    "case": "worst",
    "explanation": "The amount table has A+1 scalar cells plus O(1) loop state.",
    "inputOutputNote": "The answer is a single count or −1; the table is auxiliary. Python integer bit costs are separate."
  },
  "derivation": [
    {
      "lines": [
        5,
        6
      ],
      "description": "Allocate dp over amounts and seed dp[0] = 0.",
      "cost": "O(A+1)",
      "dimension": "space"
    },
    {
      "lines": [
        7,
        8,
        9,
        10
      ],
      "description": "Nested loops over amounts × coins, O(1) each.",
      "cost": "O((A+1)*(k+1))",
      "dimension": "time"
    },
    {
      "lines": [
        11
      ],
      "description": "Read the answer or report impossibility — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    }
  ],
  "assumptions": [
    "Coins are available in unlimited quantity (unbounded).",
    "Filling amounts upward makes dp[a-c] ready before dp[a].",
    "Comparisons/additions are O(1).",
    "Inputs meet the stated type/domain contract. Scalar arithmetic, comparisons and array indexing use a unit-cost model; Python arbitrary-precision bit costs are not included.",
    "Denominations are strictly positive integers and amount is a non-negative integer. INF=A+1 exceeds every possible feasible coin count because each coin contributes at least 1.",
    "Best/average/worst table entries are asymptotic upper bounds for the specified variant; no input probability distribution or tight average-time claim is assumed unless stated."
  ],
  "tradeoffs": "Positive reusable coins read earlier amount states without an item axis. Exact DP costs O((A+1)(k+1)) including validation/allocation. A largest-first rule is correct for all amounts only when the denomination system has that property; a failed sample refutes a general guarantee.",
  "counters": [
    {
      "label": "coin options tried",
      "definition": "executions of the transition check Recorded line entries at 9 occur before the operation completes.",
      "countLines": [
        9
      ]
    },
    {
      "label": "dp updates",
      "definition": "executions of the update line Recorded line entries at 10 occur before the operation completes.",
      "countLines": [
        10
      ]
    }
  ],
  "fixedDataNote": "coin_change([1,2,5], 11) examines 11×3 pairs and returns 3. The O(A·k) bound describes how the work scales with the amount and coin count. Function analysis excludes demonstration input literals, imports, printing and tracer storage. A line event shows the next operation before it completes."
},

  code,

  codeExplanations: [
  {
    "line": 1,
    "executable": false,
    "explanation": "Comment: fewest coins with unlimited denominations."
  },
  {
    "line": 2,
    "executable": true,
    "explanation": "Define coin_change(coins, amount)."
  },
  {
    "line": 3,
    "executable": true,
    "explanation": "Check the amount and strictly positive denomination contract."
  },
  {
    "line": 4,
    "executable": true,
    "explanation": "Reject negative amount or zero/negative coin denomination."
  },
  {
    "line": 5,
    "executable": true,
    "explanation": "A sentinel INF larger than any real coin count marks unreachable amounts."
  },
  {
    "line": 6,
    "executable": true,
    "explanation": "dp[a] = fewest coins to make a; dp[0] = 0, all others start at INF."
  },
  {
    "line": 7,
    "executable": true,
    "explanation": "Fill amounts from 1 up to the target."
  },
  {
    "line": 8,
    "executable": true,
    "explanation": "Try each coin as the last coin used."
  },
  {
    "line": 9,
    "executable": true,
    "explanation": "If the coin fits and using it improves dp[a]..."
  },
  {
    "line": 10,
    "executable": true,
    "explanation": "...update dp[a] to dp[a - c] + 1 (one more coin than the remainder)."
  },
  {
    "line": 11,
    "executable": true,
    "explanation": "Return the answer, or -1 if the target is unreachable."
  },
  {
    "line": 12,
    "executable": false,
    "explanation": "Blank line."
  },
  {
    "line": 13,
    "executable": true,
    "explanation": "For [1,2,5] and 11, the fewest is 3 (5+5+1)."
  }
],

  bindings: [
    {
      variable: "dp",
      model: "dp-table",
      // Current dp index is the sub-amount `a`; label it as the 1D index.
      overlays: [{ role: "pointer", label: "i", source: "a" }],
    },
  ],

  prediction: [
    {
      atEventIndex: 0,
      prompt: "Why not just greedily take the largest coin that fits each time?",
      answer: "Greedy can be suboptimal for some coin systems. For coins [1,3,4] and amount 6, greedy takes 4 then 1+1 = 3 coins, but 3+3 = 2 coins is better. DP checks every last-coin choice and guarantees the minimum.",
      explanation: "Greedy is only optimal for 'canonical' coin systems. In general the last-coin choice interacts with the remainder, which DP evaluates exhaustively but efficiently.",
    },
  ],

  experiments: [
    "Print dp after the loops to see the fewest coins for every sub-amount.",
    "Run it on coins [1,3,4], amount 6 and confirm it returns 2 (beating greedy's 3).",
    "Try an unreachable case like coins [2], amount 3 and see it return -1.",
  ],

  exercises: [
  {
    "id": "dpcc-complete-1",
    "kind": "complete-code",
    "prompt": "Complete `coin_change(coins, amount)`: fewest coins to make `amount`, or -1 if impossible. Practice input contract: strictly positive integer denominations and a non-negative integer amount.",
    "starterCode": "def coin_change(coins, amount):\n    INF = float('inf')\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            # TODO: if c fits and improves dp[a], update it\n            pass\n    return dp[amount] if dp[amount] != INF else -1",
    "expected": "def coin_change(coins, amount):\n    INF = float('inf')\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and dp[a - c] + 1 < dp[a]:\n                dp[a] = dp[a - c] + 1\n    return dp[amount] if dp[amount] != INF else -1",
    "hints": [
      "Goal: coin_change(coins, amount) = fewest coins to make amount, or -1.",
      "The repeated subproblem is dp[a] = fewest coins for amount a; build up from 0.",
      "Key property: using coin c (if c<=a) costs 1 + dp[a-c].",
      "Approach: for each amount, try every coin that fits and keep the smallest.",
      "Pseudocode: for a in 1..amount: for c in coins: if c<=a: dp[a]=min(dp[a], dp[a-c]+1).",
      "Fix: if c <= a and dp[a - c] + 1 < dp[a]: dp[a] = dp[a - c] + 1."
    ],
    "tests": "assert coin_change([1,2,5], 11) == 3, '5+5+1'\nassert coin_change([2], 3) == -1, 'impossible'\nassert coin_change([1], 0) == 0\nassert coin_change([1,2,5], 0) == 0\nassert coin_change([2,5,10], 1) == -1\nassert coin_change([1,3,4], 6) == 2, '3+3'\nprint('OK')"
  },
  {
    "id": "dpcc-choose-1",
    "kind": "choose-approach",
    "prompt": "For coins [1,3,4], amount 6: what does greedy give vs DP, and which should you trust?",
    "expected": "Greedy: 4 + 1 + 1 = 3 coins. DP: 3 + 3 = 2 coins. Trust DP — greedy is not optimal for this non-canonical coin system.",
    "hints": [
      "Goal: for coins [1,3,4] and amount 6, compare what greedy gives versus DP.",
      "Greedy's repeated 'take the biggest coin' looks efficient but can miss the true minimum.",
      "Key insight: greedy grabs the 4 then two 1s (3 coins), but two 3s make 6 in only 2 coins.",
      "Approach: use DP over amounts, since greedy is not optimal for this non-canonical coin system.",
      "Pseudocode: dp[0]=0; for each amount a: dp[a]=min over coins c<=a of dp[a-c]+1.",
      "Trust DP, which finds 2 coins (3 + 3); greedy wrongly returns 3 (4 + 1 + 1)."
    ],
    "recognition": {
      "scenario": "For coins [1,3,4], amount 6: what does greedy give vs DP, and which should you trust?",
      "approaches": [
        {
          "id": "dp",
          "label": "Dynamic programming",
          "requiredReasonIds": [
            "non-canonical-needs-dp"
          ]
        },
        {
          "id": "greedy",
          "label": "Greedy (always take the largest coin)",
          "requiredReasonIds": [],
          "rejectionFeedback": "Greedy gives 4+1+1 = 3 coins here, but DP finds 3+3 = 2; this coin system is non-canonical, so greedy is not optimal."
        }
      ],
      "reasons": [
        {
          "id": "non-canonical-needs-dp",
          "text": "For [1,3,4], amount6, greedy gives three coins and DP gives two. The counterexample rejects a general greedy guarantee; the valid amount recurrence finds the exact optimum."
        },
        {
          "id": "greedy-canonical",
          "text": "This coin system is canonical, so the largest-coin-first greedy is always optimal.",
          "contradictory": true
        },
        {
          "id": "coins-unique-use",
          "text": "Each coin may be used at most once, so it is a 0/1 subset problem.",
          "contradictory": true
        }
      ],
      "acceptableApproachIds": [
        "dp"
      ],
      "modelExplanation": "Trust DP: greedy gives 4+1+1 = 3 coins, but DP gives 3+3 = 2. Greedy is not optimal for this non-canonical coin system."
    }
  },
  {
    "id": "dpcc-predict-1",
    "kind": "predict-state",
    "prompt": "For coins [1,2,5], amount 11, what is dp[11] and one coin combination that achieves it?",
    "expected": "dp[11] = 3, e.g. 5 + 5 + 1.",
    "hints": [
      "Use the largest coins where helpful.",
      "5 + 5 = 10, plus 1.",
      "That's 3 coins."
    ]
  }
],

  review: "With positive reusable integer coins, dp[a] is the fewest coins for amount a. Test every last coin c≤a using dp[a−c]+1; dp[0]=0 and INF=A+1 marks unreachable states. Empty coins make only amount zero. Zero/negative coins or a negative amount are rejected. Cost includes validation, allocation and transitions: O((A+1)(k+1)) scalar work, O(A+1) cells. [1,3,4], amount6 refutes largest-first greedy.",

  expectedOutput: "3\n",

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
    "url": "https://leetcode.com/problems/coin-change/description/",
    "title": "LeetCode: Coin Change",
    "section": "Problem definition, examples and constraints",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Coins are reusable positive integers; impossible amounts return −1; zero target returns 0."
    ],
    "conventions": [],
    "accessDate": "2026-10-10"
  },
  {
    "url": "https://runestone.academy/ns/books/published/pythonds3/Recursion/DynamicProgramming.html",
    "title": "Runestone: dynamic programming",
    "section": "Coin recurrence, bottom-up table and Figure 15",
    "topic": "dp-recursion",
    "purpose": "Verify the named claim and the convention used by this example.",
    "verifiedClaims": [
      "Minimum coin count can be formed from smaller amounts; greedy denominations can fail; bottom-up order makes dependencies ready."
    ],
    "conventions": [
      "Source assumes denomination 1 and seeds count=cents. App uses INF=A+1 so arbitrary positive sets and unreachable targets work. The source figure uses [1,5,10], app sample [1,2,5]."
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
    contentHash: "d0c4ce9fe7fa8ca2",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 6,
  },
};
