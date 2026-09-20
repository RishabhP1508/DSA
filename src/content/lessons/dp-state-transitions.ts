/**
 * Lesson: DP — state transitions (buy/sell stock once) (DP and recursion).
 *
 * Researched against `references` and verified on CPython 3.14 (bundled Pyodide
 * 3.14.2). Output is exactly "5\n".
 */

import type { LessonDefinition } from "../../core/types";

const code = `# Best profit buying once and selling later. State we carry forward:
# the lowest price seen so far, and the best profit achievable so far.
def max_profit(prices):
    min_price = prices[0]      # STATE 1: cheapest buy point up to now
    best = 0                   # STATE 2: best profit found so far
    for p in prices[1:]:
        best = max(best, p - min_price)   # transition: sell today?
        min_price = min(min_price, p)     # transition: update cheapest buy
    return best

print(max_profit([7, 1, 5, 3, 6, 4]))   # buy at 1, sell at 6 -> 5`;

export const dpStateTransitions: LessonDefinition = {
  id: "dp-state-transitions",
  title: "DP: State Transitions",
  area: "DP and recursion",
  prerequisites: ["dp-tabulation"],

  explanation: `The heart of any dynamic-programming solution is its **state** and its **transition**. The **state** is the minimal information you must carry to make the next decision correctly; the **transition** is the rule that updates the state (and the answer) as you move from one step to the next. Choose the *right* state and the transition is short and the whole solution collapses to a single pass. This lesson makes that idea concrete with "best time to buy and sell stock once."

You may buy on one day and sell on a **later** day; maximize the profit. A brute-force check of every (buy, sell) pair is O(n²). But notice what you actually need at day \`p\`: to sell today profitably, you only need the **cheapest price seen so far** — nothing else about the history matters. So the state is just two numbers: \`min_price\` (cheapest buy point up to now) and \`best\` (best profit so far). The transitions on each new price are: *"could selling today beat my best?"* → \`best = max(best, p - min_price)\`, and *"is today a cheaper buy point?"* → \`min_price = min(min_price, p)\`. One pass, **O(n)** time, **O(1)** space. For \`[7,1,5,3,6,4]\` the answer is **5** (buy at 1, sell at 6).

This is DP with the table compressed to a **constant number of rolling variables** — the same move that turned Fibonacci and grid-paths from O(n) space to O(1). The transferable skill is the modeling question: **"what is the least I must remember to decide the next step?"** A minimal, sufficient state gives simple transitions and cheap solutions; a bloated state wastes time and space, and a missing piece makes the transition wrong. Getting the state right is the first and most important DP decision.`,

  vocabulary: [
    { term: "State", definition: "The minimal information needed to make the next decision correctly." },
    { term: "Transition", definition: "The rule that updates the state (and answer) from one step to the next." },
    { term: "Rolling state", definition: "Keeping only a few variables instead of a full table when history compresses." },
    { term: "Running best", definition: "The best answer found so far, updated as the scan proceeds." },
    { term: "Minimal sufficient state", definition: "A state that omits nothing needed and includes nothing extra." },
  ],

  concepts: {
    purpose:
      "Teach how to identify a minimal state and its transitions — the modeling core of every DP — via a one-pass example.",
    operations:
      "Maintain the state variables; on each step apply the transition to update the answer and the state.",
    uses:
      "Stock-trading variants, running max/min problems, Kadane-style scans, any DP that compresses to a few rolling values.",
    tradeoffs:
      "A minimal state gives O(1) space and O(n) time; a redundant state costs more; an insufficient state gives wrong answers.",
    commonMistakes:
      "Carrying too much state (slow) or too little (incorrect); updating best after min_price (would allow buying and selling the same day for 0 improperly); starting best at negative values.",
    edgeCases:
      "Prices only decreasing → profit 0 (never sell at a loss). Single day → 0. Buy and sell must be on different days (sell strictly later).",
  },

  complexity: [
    { operation: "best profit (rolling state)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)", note: "One pass; two state variables." },
    { operation: "brute-force pairs (contrast)", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)", note: "Check every (buy, sell) pair." },
  ],

  complexityExplanation: {
    variables: [{ symbol: "n", meaning: "the number of days / prices" }],
    costModel:
      "Each step does O(1) work: two comparisons and updates to the two state variables.",
    time: {
      bound: "O(n)",
      case: "worst",
      explanation:
        "The loop makes a single pass over the prices, doing constant work per day. So the total time is proportional to n — a big improvement over the O(n²) brute force that compares every buy/sell pair.",
    },
    space: {
      bound: "O(1)",
      case: "worst",
      explanation:
        "Only two state variables, min_price and best, are kept regardless of how many prices there are. The DP 'table' has been compressed to rolling values.",
      inputOutputNote: "The price list is the input; the single profit result is O(1). No table is allocated.",
    },
    derivation: [
      { lines: [4, 5], description: "Initialise the two state variables — O(1).", cost: "O(1)", dimension: "time" },
      { lines: [6, 7, 8], description: "One pass applying the two transitions per day.", cost: "O(n)", dimension: "time" },
      { lines: [4, 5], description: "Exactly two state variables, independent of n.", cost: "O(1)", dimension: "space" },
    ],
    assumptions: [
      "You buy before you sell (sell strictly later).",
      "min_price and best summarize everything needed for the next decision.",
      "Comparisons/updates are O(1).",
    ],
    tradeoffs:
      "The minimal state gives O(n)/O(1); brute force over pairs is O(n²). This is DP with a table compressed to rolling variables — the same optimization used in Fibonacci and grid-path DP.",
    counters: [
      { label: "days processed", definition: "executions of the sell-decision line (line 7)", countLines: [7] },
      { label: "buy-point updates", definition: "executions of the min-price update (line 8)", countLines: [8] },
    ],
    fixedDataNote:
      "For [7,1,5,3,6,4] the best profit is 5 (buy 1, sell 6), found in one pass. The O(n) bound describes growth with the number of days.",
  },

  code,

  codeExplanations: [
    { line: 1, executable: false, explanation: "Comment: define the state we carry forward." },
    { line: 2, executable: false, explanation: "Comment continued: cheapest price and best profit." },
    { line: 3, executable: true, explanation: "Define max_profit(prices)." },
    { line: 4, executable: true, explanation: "State 1: the cheapest buy price seen so far (start with day 0)." },
    { line: 5, executable: true, explanation: "State 2: the best profit found so far (start at 0 — no trade)." },
    { line: 6, executable: true, explanation: "Scan the remaining days." },
    { line: 7, executable: true, explanation: "Transition: could selling today at price p beat the best so far?" },
    { line: 8, executable: true, explanation: "Transition: update the cheapest buy point for future days." },
    { line: 9, executable: true, explanation: "Return the best achievable profit." },
    { line: 10, executable: false, explanation: "Blank line." },
    { line: 11, executable: true, explanation: "For [7,1,5,3,6,4]: buy at 1, sell at 6 -> profit 5." },
  ],

  bindings: [
    {
      variable: "prices",
      model: "array",
      overlays: [
        { role: "total", label: "best", source: "best" },
        { role: "highlight", label: "min_price", source: "min_price" },
      ],
    },
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
      id: "dpst-complete-1",
      kind: "complete-code",
      prompt: "Complete the two transitions using the rolling state.",
      starterCode:
        "min_price = prices[0]\nbest = 0\nfor p in prices[1:]:\n    # TODO: update best, then min_price\n    pass\nreturn best",
      expected:
        "min_price = prices[0]\nbest = 0\nfor p in prices[1:]:\n    best = max(best, p - min_price)\n    min_price = min(min_price, p)\nreturn best",
      hints: [
        "First ask: sell today for p - min_price?",
        "Then update the cheapest buy point.",
        "best = max(best, p - min_price); min_price = min(min_price, p)",
      ],
    },
    {
      id: "dpst-choose-1",
      kind: "choose-approach",
      prompt: "You could compare all (buy, sell) pairs in O(n²), or track a rolling state in O(n). Which do you pick for a long price series, and what state makes O(n) work?",
      expected: "The O(n) rolling-state scan. The minimal state is (cheapest price so far, best profit so far); updating both per day gives the answer in one pass.",
      hints: [
        "Avoid the quadratic pairwise check.",
        "Track just what the next decision needs.",
        "State = min price so far + best profit so far.",
      ],
    },
    {
      id: "dpst-predict-1",
      kind: "predict-state",
      prompt: "For [7,1,5,3,6,4], what are min_price and best right after processing the price 6?",
      expected: "min_price = 1, best = 5 (6 - 1). The 6 sets a new best; min_price stays 1.",
      hints: [
        "The cheapest price so far is 1.",
        "Selling at 6 gives 6 - 1 = 5.",
        "6 doesn't lower min_price.",
      ],
    },
  ],

  review: `Every DP is defined by its **state** (the minimal info needed to decide the next step) and its **transition** (how that state updates). "Buy/sell once" needs only two rolling values — \`min_price\` and \`best\` — so it runs in **O(n)** time and **O(1)** space, versus O(n²) brute force. The modeling question to always ask is **"what is the least I must remember?"**: a minimal, sufficient state yields simple transitions and cheap solutions. The example's best profit is **5**.`,

  expectedOutput: "5\n",

  references: [
    {
      url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/editorial/",
      title: "Best Time to Buy and Sell Stock — LeetCode editorial",
      section: "One-pass with running minimum",
      topic: "dp/state-transitions",
      purpose: "Confirm the one-pass O(n)/O(1) solution tracking the minimum price and best profit as state.",
      verifiedClaims: [
        "Tracking the minimum price so far and the best profit so far solves the problem in one O(n) pass with O(1) space.",
      ],
      accessDate: "2026-09-20",
    },
    {
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/",
      title: "Introduction to Algorithms 6.006 — Dynamic Programming (MIT OCW)",
      section: "Defining states and transitions",
      topic: "dp/state-transitions",
      purpose: "Cross-check that a DP is characterized by its state definition and transition, and that minimal sufficient state yields efficient solutions.",
      verifiedClaims: [
        "A dynamic program is specified by its subproblem states and the transitions between them.",
      ],
      accessDate: "2026-09-20",
    },
  ],
};
