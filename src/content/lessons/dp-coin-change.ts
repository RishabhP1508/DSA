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

  explanation: `**Coin change (fewest coins)** asks for the **minimum number of coins** that sum to a target \`amount\`, drawing from **unlimited** coins of given denominations. It's a classic where the natural **greedy** rule — always take the largest coin that fits — **fails** for some coin systems (e.g. coins \`[1,3,4]\`, amount 6: greedy gives 4+1+1 = 3 coins, but 3+3 = 2 is better). So we need DP for a guaranteed optimum.

The state is the sub-amount: \`dp[a]\` = the fewest coins to make exactly \`a\`. The transition considers **every coin** as the *last* coin used: if coin \`c\` fits (\`c <= a\`), then one way to make \`a\` is coin \`c\` plus the best way to make \`a − c\`, i.e. \`dp[a-c] + 1\`; we keep the **minimum** over all coins. The **base case** is \`dp[0] = 0\` (zero coins make zero). Unreachable amounts stay at a sentinel \`INF\`, and if \`dp[amount]\` is still \`INF\` at the end, the amount is impossible, so we return −1. Filling \`a\` from 1 up to \`amount\` guarantees \`dp[a-c]\` is already computed. For coins \`[1,2,5]\` and amount 11 the answer is **3** (5+5+1).

Note the **unbounded** flavor: because coins can repeat, the transition freely reuses \`dp[a-c]\` for the *same* coin set — unlike 0/1 knapsack, which must not reuse an item. This is **O(amount × #coins)** time and **O(amount)** space — **pseudo-polynomial**, since it scales with the numeric value of \`amount\`. The reusable lessons: (1) when greedy might be wrong, reach for DP; (2) "try each option as the last step, add its cost, take the best" is the same last-choice-split you saw in climbing stairs, now with a \`min\` over choices; and (3) always handle the **impossible/unreachable** case explicitly.`,

  vocabulary: [
    { term: "Coin change (min)", definition: "Fewest coins summing to a target, with unlimited coins of each denomination." },
    { term: "dp[a]", definition: "The minimum number of coins to make sub-amount a." },
    { term: "Last-coin split", definition: "Casing on which coin is used last: dp[a] = min over c of dp[a-c] + 1." },
    { term: "Sentinel (INF)", definition: "A value larger than any real answer marking still-unreachable amounts." },
    { term: "Unbounded reuse", definition: "Coins may repeat, so dp[a-c] can use the same denomination again (unlike 0/1 knapsack)." },
  ],

  concepts: {
    purpose:
      "Compute an exact minimum-coins answer where greedy can fail, using bottom-up DP over sub-amounts.",
    operations:
      "For each amount 1..target, try each coin as the last coin, take min(dp[a-c] + 1); handle impossibility with a sentinel.",
    uses:
      "Making change, minimum-operations-to-reach-target problems, unbounded-knapsack-style counting/optimization.",
    tradeoffs:
      "Exact but O(amount × #coins) (pseudo-polynomial); greedy is faster but only correct for canonical coin systems.",
    commonMistakes:
      "Assuming greedy is optimal (it isn't in general); forgetting the c <= a guard (negative index); not returning -1 for unreachable amounts; treating it like 0/1 knapsack (coins are reusable).",
    edgeCases:
      "amount 0 → 0 coins. No coins or an unreachable amount → -1. A coin larger than the amount is simply skipped by the guard.",
  },

  complexity: [
    { operation: "coin change (min, DP)", best: "O(amount·k)", average: "O(amount·k)", worst: "O(amount·k)", space: "O(amount)", note: "k = number of coin denominations; pseudo-polynomial in amount." },
  ],

  complexityExplanation: {
    scope: "program",
    variables: [
      { symbol: "A", meaning: "the target amount" },
      { symbol: "k", meaning: "the number of coin denominations" },
    ],
    costModel: "Each (amount, coin) pair does O(1) work (a compare and a possible update). Every pair is examined once.",
    time: {
      bound: "O(A·k)",
      case: "worst",
      explanation:
        "The outer loop runs A times (amounts 1..A) and the inner loop k times (coins), with constant work per pair. So total time is O(A·k). This is pseudo-polynomial: it grows with the numeric value of the amount A, so large targets are expensive even with few coins.",
    },
    space: {
      bound: "O(A)",
      case: "worst",
      explanation:
        "The dp array has A+1 entries (one per sub-amount). No other structure grows with the input, so auxiliary space is O(A).",
      inputOutputNote: "The single min-coins integer (or -1) is O(1); the O(A) space is the dp table.",
    },
    derivation: [
      { lines: [3, 4], description: "Allocate dp over amounts and seed dp[0] = 0.", cost: "O(A)", dimension: "space" },
      { lines: [5, 6, 7, 8], description: "Nested loops over amounts × coins, O(1) each.", cost: "O(A·k)", dimension: "time" },
      { lines: [9], description: "Read the answer or report impossibility — O(1).", cost: "O(1)", dimension: "time" },
    ],
    assumptions: [
      "Coins are available in unlimited quantity (unbounded).",
      "Filling amounts upward makes dp[a-c] ready before dp[a].",
      "Comparisons/additions are O(1).",
    ],
    tradeoffs:
      "DP guarantees the optimum in O(A·k); greedy is faster but correct only for canonical systems. Unlike 0/1 knapsack, coins are reusable, which is why the transition reads dp[a-c] within the same DP without an item dimension.",
    counters: [
      { label: "coin options tried", definition: "executions of the transition check (line 7)", countLines: [7] },
      { label: "dp updates", definition: "executions of the update line (line 8)", countLines: [8] },
    ],
    fixedDataNote:
      "coin_change([1,2,5], 11) examines 11×3 pairs and returns 3. The O(A·k) bound describes how the work scales with the amount and coin count.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: fewest coins with unlimited denominations." },
    { line: 2, executable: true, explanation: "Define coin_change(coins, amount)." },
    { line: 3, executable: true, explanation: "A sentinel INF larger than any real coin count marks unreachable amounts." },
    { line: 4, executable: true, explanation: "dp[a] = fewest coins to make a; dp[0] = 0, all others start at INF." },
    { line: 5, executable: true, explanation: "Fill amounts from 1 up to the target." },
    { line: 6, executable: true, explanation: "Try each coin as the last coin used." },
    { line: 7, executable: true, explanation: "If the coin fits and using it improves dp[a]..." },
    { line: 8, executable: true, explanation: "...update dp[a] to dp[a - c] + 1 (one more coin than the remainder)." },
    { line: 9, executable: true, explanation: "Return the answer, or -1 if the target is unreachable." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "For [1,2,5] and 11, the fewest is 3 (5+5+1)." },
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
      id: "dpcc-complete-1",
      kind: "complete-code",
      prompt: "Complete the transition that tries each coin as the last coin.",
      starterCode:
        "for a in range(1, amount + 1):\n    for c in coins:\n        # TODO: if c fits and improves dp[a], update it\n        pass\nreturn dp[amount] if dp[amount] != INF else -1",
      expected:
        "for a in range(1, amount + 1):\n    for c in coins:\n        if c <= a and dp[a - c] + 1 < dp[a]:\n            dp[a] = dp[a - c] + 1\nreturn dp[amount] if dp[amount] != INF else -1",
      hints: [
        "Only use a coin that fits (c <= a).",
        "Using coin c costs 1 plus dp[a - c].",
        "if c <= a and dp[a-c] + 1 < dp[a]: dp[a] = dp[a-c] + 1",
      ],
    },
    {
      id: "dpcc-choose-1",
      kind: "choose-approach",
      prompt: "For coins [1,3,4], amount 6: what does greedy give vs DP, and which should you trust?",
      expected: "Greedy: 4 + 1 + 1 = 3 coins. DP: 3 + 3 = 2 coins. Trust DP — greedy is not optimal for this non-canonical coin system.",
      hints: [
        "Greedy grabs the 4 first.",
        "Two 3s are better.",
        "DP finds 2; greedy finds 3.",
      ],
    },
    {
      id: "dpcc-predict-1",
      kind: "predict-state",
      prompt: "For coins [1,2,5], amount 11, what is dp[11] and one coin combination that achieves it?",
      expected: "dp[11] = 3, e.g. 5 + 5 + 1.",
      hints: [
        "Use the largest coins where helpful.",
        "5 + 5 = 10, plus 1.",
        "That's 3 coins.",
      ],
    },
  ],

  review: `**Coin change (min)** finds the fewest coins for a target from **unlimited** denominations, where **greedy can fail**, so we use DP. State \`dp[a]\` = fewest coins for \`a\`; transition tries each coin as the **last** one: \`dp[a] = min(dp[a-c] + 1)\`, base \`dp[0]=0\`, sentinel \`INF\` → **-1** if unreachable. Coins are **reusable** (unlike 0/1 knapsack). It's **O(amount·#coins)** time, **O(amount)** space — **pseudo-polynomial**. For \`[1,2,5]\`, amount 11 → **3** coins.`,

  expectedOutput: "3\n",

  references: [
    {
      url: "https://leetcode.com/problems/coin-change/editorial/",
      title: "Coin Change — LeetCode editorial",
      section: "Bottom-up DP over amounts; -1 for unreachable",
      topic: "dp/coin-change",
      purpose: "Confirm dp[a] = min over coins of dp[a-c] + 1, the dp[0]=0 base, the impossible→-1 handling, and O(amount·coins) cost.",
      verifiedClaims: [
        "dp[a] = min over coins c of dp[a-c] + 1 gives the fewest coins for amount a.",
        "The DP is O(amount × number of coins) time and O(amount) space.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://en.wikipedia.org/wiki/Change-making_problem",
      title: "Change-making problem — Wikipedia",
      section: "Greedy fails for non-canonical systems; DP is optimal",
      topic: "dp/coin-change",
      purpose: "Cross-check that greedy is not optimal for general coin systems while DP yields the minimum.",
      verifiedClaims: [
        "The greedy algorithm is optimal only for canonical coin systems; dynamic programming solves the general case optimally.",
      ],
      accessDate: "2026-09-20",
    },
  ],
  evidence: {
    inventoryVersion: 14,
    contentHash: "42b69c7113756cd5",
    verifiedAt: "2026-09-20",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: false,
  },
};
