# R9 B1 Batch Semantic-Review Packet — 13 lessons

Full learner-facing content for the 13 remaining B1 (batch-1) lessons, plus the effective shared exercise-registry content (model solutions and recognition steps) each learner sees. Generated from the registry at the batch-corrections commit. The two already-approved lessons (variables-and-types, loops) are excluded.

All 13 items are `semanticReview: false` (pending). Hashes below are the post-correction hashes.

---

## expressions — "Expressions and Operators"

- **Area:** Programming foundations
- **Prerequisites:** variables-and-types
- **contentHash:** `32b82b97f920056f` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
14 20 2
3 32 2.5

```

### Explanation
An **expression** is any piece of code that produces a value: `2 + 3`, `x * 2`, `17 % 5`. Python evaluates the operators in a fixed order called **precedence** — for example `*` and `/` happen before `+` and `-`, just like in maths. So `2 + 3 * 4` is `2 + 12 = 14`, not `20`.

You can override precedence with **parentheses**: `(2 + 3) * 4` forces the addition first, giving `20`.

Precedence is about **grouping** — which operator claims its operands first — not about the order the operands are computed. Python still **evaluates the operands left to right**; precedence only decides how they are then combined. In `a() + b() * c()`, Python calls `a`, `b`, `c` in that left-to-right order, but `*` groups `b() * c()` before the `+` adds `a()`.

Python has three "division-like" operators that beginners often confuse. For the numeric operands taught here (`int` and `float`): `/` is **true division** and gives a float (`10 / 4 == 2.5`); `//` is **floor division** — it *floors the quotient* (rounds toward negative infinity), and its result **type** follows the operands: two ints give an int (`7 // 2 == 3`) while a float operand gives a float (`7.0 // 2 == 3.0`); `%` is the **remainder** (`17 % 5 == 2`). `**` is exponentiation (`2 ** 5 == 32`). (These are the behaviours of the built-in numeric types; a custom class can define these operators to do anything.)

### Vocabulary
- **Expression** — Code that evaluates to a single value, e.g. 2 + 3 * 4.
- **Operator** — A symbol that combines values, e.g. +, -, *, /, %, //, **.
- **Precedence** — Which operators bind their operands first (group tighter); * and / bind tighter than + and -. Precedence decides grouping — it is separate from the left-to-right order in which Python evaluates the operands.
- **True division (/)** — For the built-in int/float operands taught here, `/` yields a float, e.g. 10 / 4 == 2.5 (even 4 / 2 == 2.0). (Other numeric types differ: complex operands give a complex.)
- **Floor division (//)** — Floors the quotient (rounds toward -infinity); two ints give an int (7 // 2 == 3), a float operand gives a float (7.0 // 2 == 3.0).
- **Modulo (%)** — The remainder after division, e.g. 17 % 5 == 2.

### Concepts
- **purpose:** Expressions compute the values your program works with — sums, indices, conditions, and more.
- **operations:** Arithmetic (+, -, *, /, //, %, **), grouping with parentheses, and mixing with variables.
- **uses:** Index math, running totals, converting between units, checking divisibility with %.
- **tradeoffs:** Relying on precedence keeps code short but can mislead readers; parentheses make intent explicit.
- **commonMistakes:** Thinking operators simply apply left-to-right and so reading `2 + 3 * 4` as `(2 + 3) * 4` — precedence decides the grouping (`*` binds before `+`), which is separate from the order operands are evaluated; expecting / to give an int (it gives a float); confusing % (remainder) with / (division).
- **edgeCases:** Division by zero raises ZeroDivisionError. % with negatives follows the sign of the divisor in Python (e.g. -1 % 5 == 4).

### Code
```
# An expression combines values and operators to produce one value.
# Multiplication binds tighter than addition (precedence).
x = 2 + 3 * 4
# Parentheses force a different order.
y = (2 + 3) * 4
# % is the remainder (modulo) operator.
z = 17 % 5
print(x, y, z)
# // floors the quotient (7 // 2 -> int 3; float operand -> float); ** is power; / is true division.
print(7 // 2, 2 ** 5, 10 / 4)
```

### Line explanations
- L1 (—): Comment: what an expression is.
- L2 (—): Comment about precedence.
- L3 (exec): 3 * 4 is evaluated first (12), then 2 + 12 gives 14. x becomes 14.
- L4 (—): Comment about parentheses.
- L5 (exec): (2 + 3) is forced first (5), then 5 * 4 gives 20. y becomes 20.
- L6 (—): Comment about modulo.
- L7 (exec): 17 % 5 is the remainder of 17 ÷ 5, which is 2. z becomes 2.
- L8 (exec): Print x, y, z → 14 20 2.
- L9 (—): Comment about //, ** and /.
- L10 (exec): 7 // 2 is 3 (floor), 2 ** 5 is 32 (power), 10 / 4 is 2.5 (float). Prints 3 32 2.5.

### Complexity (table)
- **Arithmetic on small ints** — best O(1), avg O(1), worst O(1). Fixed-size integer arithmetic is constant time.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "—",
      "meaning": "no input size; this example does a fixed amount of arithmetic"
    }
  ],
  "costModel": "Each arithmetic operation on machine-sized integers/floats is treated as one constant-time step. (Python integers are arbitrary precision, so arithmetic on very large integers with d digits costs more — noted below.)",
  "time": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "There are no loops. The program evaluates a fixed number of arithmetic expressions and two print calls, so its running time does not depend on any input size."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "It stores three small variables (x, y, z). No storage grows with any input."
  },
  "derivation": [
    {
      "lines": [
        3,
        5,
        7
      ],
      "description": "Three constant-time arithmetic expressions assigned to names.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        8,
        10
      ],
      "description": "Two print calls of a fixed number of values.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        5,
        7
      ],
      "description": "A fixed set of small variables.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Operands fit in machine-word integers/floats, so each operation is constant time.",
    "For arbitrary-precision integers with d digits, +/- cost O(d) and * costs more — not relevant to these small values."
  ],
  "fixedDataNote": "All operands are fixed literals, so this run does a constant amount of work; there is no input size to grow."
}
```

### Prediction
- **atEventIndex 0** — Q: What is `2 + 3 * 4` in Python, and why?
  - A: 14, because * has higher precedence than + so 3*4 happens first.
  - Why: Multiplication binds tighter than addition, so it is 2 + (3*4) = 14, not (2+3)*4 = 20.

### Experiments
- Change line 3 to add parentheses and predict the new value of x.
- Print `-1 % 5` and `-7 // 2` and see how Python handles negatives.
- Replace 10 / 4 with 10 // 4 and note the type change from float to int.

### Exercises (with hints, graded solutions, and shared-registry content)

#### expr-predict-1 · kind: predict-state
- **Prompt:** What does `10 / 2` evaluate to, and what type is it?
- **Expected / model solution:** ```
5.0, a float — for the int/float operands taught here, `/` (true division) yields a float, even when it divides evenly.
```
- **Hints:**
  1. / is true division.
  2. On int/float operands, true division yields a float.
  3. 10 / 2 == 5.0 (not 5).

#### expr-choose-1 · kind: choose-approach
- **Prompt:** You need the remainder when dividing a by b (e.g. to test if a is even). Which operator do you use?
- **Expected / model solution:** ```
The modulo operator %. a % 2 == 0 means a is even.
```
- **Hints:**
  1. Goal: choose the operator that gives the remainder of a divided by b, e.g. to test whether a is even.
  2. The naive detour is computing a quotient and subtracting back — that recomputes what one operator already gives you.
  3. Key property: you want the leftover after division, not the quotient.
  4. Approach: use the modulo operator rather than / or //.
  5. Reasoning: // gives the floor quotient and / gives a float, but only % yields the remainder you can test against zero.
  6. Answer: use the modulo operator % — a % b is the remainder, and a % 2 == 0 tests evenness.
- **Shared exercise-registry effective content** (`lesson:expressions:expr-choose-1`):
```
{
    scenario:
      "You need the remainder of dividing a by b — for example, to test whether a is even.",
    approaches: [
      { id: "modulo", label: "Use the modulo operator %", requiredReasonIds: ["remainder-op"] },
      { id: "floordiv", label: "Use floor division //", requiredReasonIds: [], rejectionFeedback: "// gives the quotient (how many times b fits), discarding the remainder — the opposite of what you need." },
      { id: "truediv", label: "Use true division /", requiredReasonIds: [], rejectionFeedback: "/ gives a float quotient, not the integer remainder, so a % 2 == 0 cannot be expressed with it directly." },
    ],
    reasons: [
      { id: "remainder-op", text: "% returns the remainder after division, so a % 2 == 0 is true exactly when a is even." },
      { id: "gives-quotient", text: "This operator returns the quotient of the division, which is what we want.", contradictory: true },
      { id: "needs-float", text: "You must convert to float first to find a remainder.", contradictory: true },
    ],
    acceptableApproachIds: ["modulo"],
    modelExplanation:
      "The modulo operator % yields the remainder; a % 2 == 0 tests evenness.",
  }
```

### References
- [An Informal Introduction to Python — Python 3.14 documentation](https://docs.python.org/3.14/tutorial/introduction.html) — §Numbers (operators and division) (accessed 2026-09-20)
  - verified: / on int/float operands returns a float
  - verified: // floors the quotient (int//int -> int, float operand -> float)
  - verified: ** is exponentiation
- [Expressions — Python Language Reference](https://docs.python.org/3/reference/expressions.html) — §Operator precedence (accessed 2026-09-20)
  - verified: * and / have higher precedence than + and -

---

## conditions — "Conditions (if / elif / else)"

- **Area:** Programming foundations
- **Prerequisites:** expressions
- **contentHash:** `a2a4fa2253733ba5` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
hot

```

### Explanation
A **condition** lets a program make a decision. An `if` statement runs a block of code when its test is **true** — not only the literal `True`, but any value Python treats as true. This is called **truthiness**: non-zero numbers and non-empty containers (strings, lists, dicts) are **truthy**, while `0`, `""`, `[]`, `None`, and `False` are **falsy**. So `if items:` runs when `items` is a non-empty list. You can add `elif` ("else if") branches for more cases, and a final `else` for "none of the above".

Python checks the tests **top to bottom** and runs the **first** one that is True — then it skips the rest. Order matters: because `temp = 30` satisfies `temp >= 30`, the label becomes `"hot"` and the `elif`/`else` are never tried.

Tests use **comparison operators** (`==`, `!=`, `<`, `<=`, `>`, `>=`) and can be combined with `and`, `or`, and `not`.

### Vocabulary
- **Condition** — A test whose value controls which code runs; the branch runs when the value is truthy.
- **Truthy / falsy** — Values Python treats as true or false in a condition: 0, '', [], None, False are falsy; most other values (non-zero numbers, non-empty containers) are truthy.
- **Boolean** — A value that is True or False.
- **if / elif / else** — Branches: run the first block whose test is True; else runs if none match.
- **Comparison operator** — ==, !=, <, <=, >, >= — produce a Boolean.
- **Block** — The indented lines that belong to a branch.

### Concepts
- **purpose:** Conditions let a program behave differently depending on its data.
- **operations:** Compare values, combine tests with and/or/not, branch with if/elif/else.
- **uses:** Validating input, choosing an algorithm branch, handling edge cases, base cases in recursion.
- **tradeoffs:** Many elif branches can be clearer as a lookup table/dict; deeply nested ifs hurt readability.
- **commonMistakes:** Writing = (assignment) instead of == (comparison) — in Python `if x = 5:` is a SyntaxError (the parser rejects it), not a silent bug as in some languages; wrong branch order so a broad test shadows a specific one; forgetting indentation defines the block.
- **edgeCases:** If no branch matches and there is no else, nothing runs. Only the first true branch executes.

### Code
```
# A condition chooses which block of code runs.
temp = 30
# Python checks each test top to bottom and runs the FIRST that is True.
if temp >= 30:
    label = "hot"
elif temp >= 20:
    label = "warm"
else:
    label = "cold"
print(label)
```

### Line explanations
- L1 (—): Comment: conditions choose which code runs.
- L2 (exec): Set temp to 30.
- L3 (—): Comment: Python runs the first True test.
- L4 (exec): Test temp >= 30. It is True (30 >= 30), so this branch is chosen.
- L5 (exec): Because the test was True, set label to 'hot'.
- L6 (—): This elif is skipped entirely — an earlier branch already matched.
- L7 (—): Not run: its branch was not selected.
- L8 (—): The else is skipped too.
- L9 (—): Not run.
- L10 (exec): Print label → 'hot'.

### Complexity (table)
- **Evaluate an if/elif chain** — best O(1), avg O(1), worst O(1). A fixed number of constant-time comparisons.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "—",
      "meaning": "no input size; a fixed chain of comparisons"
    }
  ],
  "costModel": "Each comparison of two numbers is one constant-time step.",
  "time": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "At most a fixed number of comparisons run (here, at most two before a branch is chosen), each constant time. There is no loop, so the cost does not depend on input size."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Stores two small variables (temp, label). Nothing grows with input."
  },
  "derivation": [
    {
      "lines": [
        4,
        6
      ],
      "description": "At most two constant-time comparisons before a branch is picked.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        5,
        7,
        9
      ],
      "description": "One assignment inside the chosen branch.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        2,
        5
      ],
      "description": "A fixed set of variables.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are between small numbers, so each is constant time."
  ],
  "fixedDataNote": "temp is a fixed literal (30), so the 'hot' branch always runs on this run; the O(1) claim is about the fixed branch count, not any input size."
}
```

### Prediction
- **atEventIndex 0** — Q: If temp were 20, what would label be?
  - A: warm
  - Why: temp >= 30 is False, but temp >= 20 is True, so the elif branch sets label to 'warm'.

### Experiments
- Change temp to 10 and predict which branch runs.
- Swap the order of the >= 30 and >= 20 tests and see how the result changes for temp = 30.
- Replace the chain with a single test using `and` to require two conditions.

### Exercises (with hints, graded solutions, and shared-registry content)

#### cond-fix-1 · kind: fix-mistake
- **Prompt:** `classify(temp)` should return 'hot' for temps >= 30, 'warm' for 20–29, else 'cold'. This version always returns 'warm' for hot temps. Fix the branch order.
- **Starter:** ```
def classify(temp):
    if temp >= 20:
        return 'warm'
    elif temp >= 30:
        return 'hot'
    return 'cold'
```
- **Expected / model solution:** ```
def classify(temp):
    if temp >= 30:
        return 'hot'
    elif temp >= 20:
        return 'warm'
    return 'cold'
```
- **Hints:**
  1. Goal: classify(temp) returns 'hot' (>=30), 'warm' (>=20), else 'cold'.
  2. The cost here is wrong branch ORDER: a broad test runs before a specific one.
  3. Key property: if-elif stops at the FIRST true test, so the most specific threshold must come first.
  4. Approach: order the thresholds from highest/most-specific to lowest.
  5. Pseudocode: if temp>=30 return 'hot'; elif temp>=20 return 'warm'; else return 'cold'.
  6. Fix: swap the first two branches so the >=30 test is checked before >=20.
- **Shared exercise-registry effective content** (`lesson:conditions:cond-fix-1`):
```
[list('ABCE'), list('SFCS'), list('ADEE')]
```

#### cond-predict-1 · kind: predict-state
- **Prompt:** With the lesson code unchanged, how many comparisons run before a branch is chosen?
- **Expected / model solution:** ```
One — temp >= 30 is True immediately, so no further tests run.
```
- **Hints:**
  1. Python stops at the first True test.
  2. temp >= 30 is the first test.
  3. It is True, so exactly one comparison runs.

### References
- [More Control Flow Tools — Python 3.14 documentation](https://docs.python.org/3.14/tutorial/controlflow.html) — §if Statements (accessed 2026-09-20)
  - verified: There can be zero or more elif parts
  - verified: The first true branch executes; others are skipped
- [Python Conditions — W3Schools](https://www.w3schools.com/python/python_conditions.asp) — §if / elif / else (accessed 2026-09-20)
  - verified: elif means 'else if'; else covers the remaining case

---

## io — "Input and Output"

- **Area:** Programming foundations
- **Prerequisites:** expressions
- **contentHash:** `11eb36b9ad8fef7c` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
Name: Number: Hello Ada
10

```
- **stdin:** ```
Ada
5

```

### Explanation
Programs talk to the outside world through **input** and **output**. `input()` reads one line of text; `print()` writes values out.

The single most common beginner trap: **`input()` always returns a string**, even if the user types digits. `"5"` is text, not the number 5 — and `"5" * 2` is `"55"`, not `10`. To do arithmetic you must convert with `int(...)` (or `float(...)`).

In this workspace you supply the input ahead of time (a "supplied input" box), and `print` output is captured and shown in the Output panel. `print` separates multiple values with a space and adds a newline at the end.

### Vocabulary
- **input()** — Reads one line of text from the supplied input and returns it as a string.
- **print()** — Writes values to the output, space-separated, followed by a newline.
- **int() / float()** — Convert a string (or number) to an integer / floating-point value.
- **Type conversion (casting)** — Turning a value of one type into another, e.g. int('5') → 5.

### Concepts
- **purpose:** I/O lets a program receive data and report results.
- **operations:** Read with input(), convert with int()/float(), write with print().
- **uses:** Reading parameters for an algorithm, printing traced results, interactive exercises.
- **tradeoffs:** Converting input is required for arithmetic but can fail on bad data (raises ValueError).
- **commonMistakes:** Doing math on the string from input() without converting; assuming input() strips more than the trailing newline.
- **edgeCases:** int('abc') raises ValueError. A blank line (the user just presses Enter) makes input() return an empty string ''. But if the input is exhausted — there is no more line to read (EOF) — input() raises EOFError rather than returning ''.

### Code
```
# input() reads a line of text that you supply.
name = input("Name: ")
# Input always arrives as a string; convert to int for arithmetic.
n = int(input("Number: "))
# print() sends values to the output.
print("Hello", name)
print(n * 2)
```

### Line explanations
- L1 (—): Comment: input() reads supplied text.
- L2 (exec): Read a line into name. The prompt 'Name: ' is shown; name becomes the string 'Ada'.
- L3 (—): Comment: input is a string; convert for math.
- L4 (exec): Read '5' and convert it with int(), so n is the integer 5 (not the string '5').
- L5 (—): Comment: print() writes output.
- L6 (exec): Print 'Hello' and name, space-separated → 'Hello Ada'.
- L7 (exec): Print n * 2. Because n is an int, this is 10 (not '55').

### Complexity (table)
- **Read + convert + print** — best O(1), avg O(1), worst O(L). Linear in the length L of the text read/printed.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "L",
      "meaning": "the number of characters in the text being read or printed"
    }
  ],
  "costModel": "Reading or printing a line costs time proportional to its length L; converting a numeric string of length L to int is O(L).",
  "time": {
    "bound": "O(L)",
    "case": "worst",
    "explanation": "There is no loop in the program, but reading a line, converting it, and printing it each touch every character, so the cost is proportional to the text length L. For short inputs this is effectively constant."
  },
  "space": {
    "bound": "O(L)",
    "case": "worst",
    "explanation": "The strings read from input are held in memory, so storage is proportional to their length L. Beyond that, only a couple of variables are kept.",
    "inputOutputNote": "The supplied input text and the printed output are I/O, sized by L; they are the data, distinct from algorithmic auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        2,
        4
      ],
      "description": "Reading each input line touches its L characters.",
      "cost": "O(L)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "int(...) parses a numeric string of length L.",
      "cost": "O(L)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7
      ],
      "description": "Printing writes each character of the output.",
      "cost": "O(L)",
      "dimension": "time"
    },
    {
      "lines": [
        2,
        4
      ],
      "description": "Holding the input strings uses O(L) space.",
      "cost": "O(L)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The converted number fits in a machine word so int arithmetic is O(1); otherwise arbitrary-precision costs apply.",
    "Input is well-formed (a valid integer); malformed input raises ValueError."
  ],
  "fixedDataNote": "This run reads short fixed inputs ('Ada', '5'), so the work is tiny; the O(L) bound describes growth with longer text."
}
```

### Prediction
- **atEventIndex 0** — Q: If line 4 were `n = input('Number: ')` (no int()), what would `n * 2` print for input 5?
  - A: '55' — because n would be the string '5', and '5' * 2 repeats the string.
  - Why: input() returns a string; multiplying a string by 2 repeats it. Converting with int() is what makes n * 2 equal 10.

### Experiments
- Change the supplied input to a different name and number and re-run.
- Remove int() on line 4 and observe the string-repetition behaviour of n * 2.
- Supply a non-numeric second line and see the ValueError explanation.

### Exercises (with hints, graded solutions, and shared-registry content)

#### io-fix-1 · kind: fix-mistake
- **Prompt:** `double(text)` takes the string a user typed and should return TWICE the number it represents. This version forgets to convert the text to a number, so `'7'` becomes `'77'` (string repetition). Fix it.
- **Starter:** ```
def double(text):
    n = text
    return n * 2
```
- **Expected / model solution:** ```
def double(text):
    n = int(text)
    return n * 2
```
- **Hints:**
  1. Goal: read one number and print its double (entering 5 should print 10, not '55').
  2. The costly mistake is treating text as if it were a number: `input()` hands back a string.
  3. Key insight: multiplying a string by 2 repeats the text, while multiplying an int by 2 doubles the value.
  4. Approach: convert the input to an integer before doing arithmetic.
  5. Pseudocode: read the line, convert it to int, then print that value times two.
  6. Wrap the input in `int(...)` — `n = int(input('n: '))` — then `print(n * 2)` gives the double.
- **Shared exercise-registry effective content** (`lesson:io:io-fix-1`):
```
{double(\"7\")!r}
```

#### io-predict-1 · kind: predict-state
- **Prompt:** What type is the value returned by input()?
- **Expected / model solution:** ```
A string (str), always — even if the user types digits.
```
- **Hints:**
  1. Think about what the user types.
  2. It is always text.
  3. input() returns a str; convert for numbers.

### References
- [Built-in Functions — input() — Python documentation](https://docs.python.org/3/library/functions.html#input) — §input() (accessed 2026-09-20)
  - verified: input() reads one line and returns it as a string with the trailing newline removed
  - verified: input() raises EOFError when the input is exhausted (end of file)
- [Built-in Functions — int() — Python documentation](https://docs.python.org/3/library/functions.html#int) — §int() (accessed 2026-09-20)
  - verified: int('5') == 5
  - verified: int() of a non-numeric string raises ValueError

---

## errors — "Errors and Exceptions"

- **Area:** Programming foundations
- **Prerequisites:** conditions, functions
- **contentHash:** `cefec6ec44b2230f` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
caught: index out of range
after

```

### Explanation
When something goes wrong at runtime — indexing past the end of a list, dividing by zero, converting bad text to a number — Python **raises an exception**. If nothing handles it, the program stops and prints a traceback.

You can handle expected failures with **try / except**: put the risky code in the `try` block and the recovery in an `except` block for the specific exception type. Here, `nums[5]` raises `IndexError`; the `except IndexError` catches it, prints a friendly message, and the program **continues** to the `print("after")`.

Catch **specific** exception types (`IndexError`, `ValueError`, `KeyError`, `ZeroDivisionError`) rather than everything, so you don't accidentally hide bugs. Handling errors deliberately is how robust programs deal with bad input and edge cases.

### Vocabulary
- **Exception** — An error raised at runtime that interrupts normal flow, e.g. IndexError.
- **raise** — The act of signalling an exception (by Python or your own code).
- **try / except** — Run risky code in try; handle a named exception in except.
- **Traceback** — The report Python prints when an exception is unhandled.
- **IndexError / ValueError / KeyError** — Common exceptions for bad index, bad value/conversion, missing key.

### Concepts
- **purpose:** Exceptions let programs detect and recover from runtime problems instead of crashing.
- **operations:** Wrap risky code in try; catch specific types with except; optionally use else/finally.
- **uses:** Validating input, handling missing keys, guarding division, cleaning up resources.
- **tradeoffs:** try/except adds structure and safety; catching too broadly (bare except) hides real bugs.
- **commonMistakes:** Catching Exception/everything and silently passing; putting too much code in one try so you can't tell what failed; using exceptions for ordinary control flow.
- **edgeCases:** An exception raised inside except propagates. In normal control flow a `finally` block runs on every way out of the try — whether it succeeded, raised, or returned (so it is the place for cleanup); the only things that skip it are a hard process exit (e.g. os._exit) or the interpreter being killed.

### Code
```
# Some operations fail at runtime by raising an exception.
nums = [1, 2, 3]
try:
    # Index 5 does not exist -> raises IndexError.
    print(nums[5])
except IndexError:
    # We handle the specific error instead of crashing.
    print("caught: index out of range")
# Execution continues normally after a handled exception.
print("after")
```

### Line explanations
- L1 (—): Comment: some operations raise exceptions.
- L2 (exec): Create the list [1, 2, 3]. Valid indices are 0, 1, 2.
- L3 (exec): Begin a try block — risky code goes here.
- L4 (—): Comment: index 5 is out of range.
- L5 (exec): nums[5] does not exist, so this raises IndexError; the print never runs.
- L6 (exec): Control jumps here because the raised error is an IndexError.
- L7 (—): Comment: we handle the error.
- L8 (exec): Print the friendly message instead of crashing.
- L9 (—): Comment: execution continues after handling.
- L10 (exec): Print 'after' — the program did not crash, so this runs normally.

### Complexity (table)
- **try/except around O(1) code** — best O(1), avg O(1), worst O(1). Exception setup is effectively constant here.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "—",
      "meaning": "no input size; a fixed amount of work"
    }
  ],
  "costModel": "Entering a try block and raising/catching an exception are treated as constant-time control-flow operations here.",
  "time": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "The program indexes a list (O(1)), raises and catches one exception, and prints twice. There is no loop, so the total is constant time."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "A fixed list and a couple of constant-size operations; nothing grows with input."
  },
  "derivation": [
    {
      "lines": [
        5
      ],
      "description": "Indexing raises IndexError — constant-time detection.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        8
      ],
      "description": "The matching except runs one print.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        10
      ],
      "description": "Execution resumes and prints once more.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        2
      ],
      "description": "One small fixed list.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "List indexing and exception handling are constant-time for this small example."
  ],
  "tradeoffs": "Checking a condition first (if index < len(nums)) also works and avoids raising; try/except is preferred when the failure is exceptional rather than expected.",
  "fixedDataNote": "Fixed list and a single caught error, so the run is constant work; there is no input size to scale."
}
```

### Prediction
- **atEventIndex 0** — Q: Does line 5's print ('print(nums[5])') produce any output? Why?
  - A: No — nums[5] raises IndexError before print runs, so control jumps straight to the except block.
  - Why: The exception is raised while evaluating nums[5], so print never receives a value; execution moves to the matching except.

### Experiments
- Change the index to 2 and see the try block succeed with no exception.
- Catch a ValueError instead and observe that IndexError is no longer handled (it would propagate).
- Add a `finally:` block and confirm it runs whether or not an error occurs.

### Exercises (with hints, graded solutions, and shared-registry content)

#### err-complete-1 · kind: complete-code
- **Prompt:** Complete `safe_div(a, b)` so dividing by 0 returns the string 'undefined' instead of crashing; otherwise return a / b.
- **Starter:** ```
def safe_div(a, b):
    # TODO: try/except so b == 0 returns 'undefined'
    return a / b
```
- **Expected / model solution:** ```
def safe_div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return 'undefined'
```
- **Hints:**
  1. Goal: make the division print 'undefined' when the divisor is 0 instead of crashing.
  2. The risky operation is `a / b`, which raises when b is zero.
  3. Key insight: dividing by zero raises the specific exception ZeroDivisionError, which you can catch.
  4. Approach: guard the division with try/except targeting that exception.
  5. Pseudocode: try to print a / b; except ZeroDivisionError: print 'undefined'.
  6. Put `print(a / b)` in the try and handle it with `except ZeroDivisionError: print('undefined')`.
- **Shared exercise-registry effective content** (`lesson:errors:err-complete-1`):
```
{safe_div(10, 0)!r}
```

#### err-choose-1 · kind: choose-approach
- **Prompt:** You expect a key might be missing from a dict. Is it better to catch KeyError, or to check with `in` first? When?
- **Expected / model solution:** ```
Both are valid. Use `if key in d` when a miss is common/expected (cheap check); use try/except KeyError when a miss is rare/exceptional. Avoid catching broad Exception.
```
- **Hints:**
  1. Goal: decide whether to guard a possibly-missing dict key with `if key in d` or with try/except KeyError — and when each fits.
  2. The wrong instinct is a one-size rule; using exceptions for the common case (or `in` for the rare case) pays an avoidable cost either way.
  3. Key property: the right choice depends on how OFTEN the key is actually missing.
  4. Approach: match the guard to the expected frequency of a miss, and keep the except clause specific.
  5. Reasoning: a membership check is cheap when misses are frequent; exceptions are cheap when misses are rare but costly when they fire constantly — and a broad `except Exception` would mask unrelated bugs.
  6. Answer: both are valid — use `if key in d` when a miss is common, use try/except KeyError when a miss is rare/exceptional, and never catch broad Exception.
- **Shared exercise-registry effective content** (`lesson:errors:err-choose-1`):
```
{
    scenario:
      "A key might be missing from a dict. You can guard with `if key in d`, or wrap the access in try/except KeyError. You must decide which fits — and when.",
    approaches: [
      { id: "membership-check", label: "Check with `if key in d` first", requiredReasonIds: ["miss-is-common"] },
      { id: "try-except", label: "Catch KeyError with try/except", requiredReasonIds: ["miss-is-rare"] },
      { id: "catch-broad", label: "Wrap it in try/except Exception", requiredReasonIds: [], rejectionFeedback: "Catching broad Exception hides unrelated bugs (typos, TypeErrors); catch only the specific KeyError you expect." },
    ],
    reasons: [
      { id: "miss-is-common", text: "When a miss is common and expected, the `in` check is a cheap, explicit test that reads naturally in the normal flow." },
      { id: "miss-is-rare", text: "When a miss is rare/exceptional, try/except KeyError keeps the common path fast and treats the absence as the exception it is." },
      { id: "must-catch-broad", text: "You should always catch the broadest Exception type to be safe.", contradictory: true },
      { id: "in-mutates", text: "Using `in` modifies the dictionary, so try/except is the only safe option.", contradictory: true },
    ],
    acceptableApproachIds: ["membership-check"],
    alternatives: [
      { approachId: "try-except", conditions: "When a missing key is rare/exceptional rather than part of the normal flow.", tradeoff: "Exceptions are costly on the error path but keep the common (present) path clean and fast.", requiredReasonIds: ["miss-is-rare"] },
    ],
    modelExplanation:
      "Both are valid: use `if key in d` when a miss is common (cheap check); use try/except KeyError when a miss is rare/exceptional. Avoid catching broad Exception.",
  }
```

### References
- [Errors and Exceptions — Python 3.14 documentation](https://docs.python.org/3.14/tutorial/errors.html) — §Handling Exceptions (accessed 2026-09-20)
  - verified: A try selects a handler by exception type
  - verified: After a handled exception, execution continues after the try statement
- [Built-in Exceptions — Python documentation](https://docs.python.org/3/library/exceptions.html) — §IndexError / ValueError / KeyError / ZeroDivisionError (accessed 2026-09-20)
  - verified: Indexing out of range raises IndexError
  - verified: Dividing by zero raises ZeroDivisionError

---

## functions — "Functions"

- **Area:** Programming foundations
- **Prerequisites:** loops
- **contentHash:** `34076dce4cf0d3ba` · **verifiedAt:** 2026-10-03 · **semanticReview:** false
- **expectedOutput:** ```
7

```

### Explanation
A **function** gives a name to a reusable piece of work. You **define** it once with `def`, listing **parameters** (inputs), and later **call** it with **arguments** (actual values). The `return` statement hands a value back to whoever called the function.

Functions are the backbone of every larger program: they let you name an idea ("add these two numbers"), test it in isolation, and reuse it. When you call `add(2, 5)`, Python creates a fresh **frame** for that call, binds `a = 2` and `b = 5`, runs the body, and the `return` sends `7` back — then the frame disappears.

Watching the call stack in the visualization makes this concrete: a frame appears on the call, its locals live only inside it, and it is removed on return.

### Vocabulary
- **Function** — A named, reusable block of code that may take inputs and return a value.
- **def** — The keyword that defines a function.
- **Parameter** — A name in the function definition that receives an argument.
- **Argument** — An actual value passed to a function when you call it.
- **return** — Hands a value back to the caller and ends the function call.
- **Frame** — The temporary workspace for one function call, holding its local variables.

### Concepts
- **purpose:** Functions name and reuse logic, reduce repetition, and make code testable and readable.
- **operations:** Define with def, call with arguments, return a result, use local variables.
- **uses:** Every algorithm is packaged as a function; later lessons build on calls and the call stack shown here.
- **tradeoffs:** Function calls add a small overhead and a stack frame, but the clarity and reuse are almost always worth it.
- **commonMistakes:** Forgetting to return (the function then returns None); confusing parameters with arguments; expecting a function's local variables to exist outside it.
- **edgeCases:** A function with no return statement returns None. Default parameter values are evaluated once, at definition time.

### Code
```
# A function packages reusable steps behind a name.
def add(a, b):
    # a and b are parameters; result is a local variable.
    result = a + b
    return result

# Call the function with arguments 2 and 5.
answer = add(2, 5)
print(answer)
```

### Line explanations
- L1 (—): Comment: a function packages reusable steps.
- L2 (exec): Define the function add with parameters a and b. The def line runs to create the function object.
- L3 (—): Comment describing parameters and the local variable.
- L4 (exec): Inside a call, compute a + b and store it in the local variable result.
- L5 (exec): Return result to the caller, ending this call.
- L6 (—): Blank line.
- L7 (—): Comment: we are about to call add.
- L8 (exec): Call add(2, 5). A new frame binds a=2, b=5; the returned value 7 is stored in answer.
- L9 (exec): Print answer → 7.

### Complexity (table)
- **Call add(a, b)** — best O(1), avg O(1), worst O(1), space O(1). One addition and one frame.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "—",
      "meaning": "no input size; the function does constant work per call"
    }
  ],
  "costModel": "One arithmetic operation and the setup/teardown of one call frame are each constant time.",
  "time": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "add does a single addition and returns, with no loop or recursion, so one call is constant time for the small fixed-size integers used here (2 and 5). This O(1) assumes the operands fit in a machine word; Python ints are arbitrary precision, so for very large operands the addition cost grows with the number of digits — that is outside this example's small-value assumption."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "One call frame is active at a time, holding a fixed set of locals (a, b, result). The maximum call-stack depth is 1 (main → add), which does not grow with input."
  },
  "derivation": [
    {
      "lines": [
        8
      ],
      "description": "One call creates one frame — constant setup.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        5
      ],
      "description": "One addition and one return inside the body.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "A fixed number of locals in a single frame; stack depth stays at 1.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The operands are small, fixed-size integers, so one addition is O(1). (Deriving the general case ourselves: since Python's int is unlimited precision — per the Numeric Types docs — adding two d-digit integers must process all d digits, so it is O(d); the O(1) here is the special case where d is a small constant.)",
    "No recursion, so call depth is bounded by a constant."
  ],
  "tradeoffs": "Inlining the addition (writing 2 + 5 directly) avoids the call overhead but loses reuse and readability; the O-class is the same.",
  "counters": [
    {
      "label": "function calls",
      "definition": "call events for add (line 8)",
      "countLines": [
        8
      ]
    }
  ],
  "fixedDataNote": "The arguments are fixed, small ints (2 and 5), so this run does constant work. add is O(1) per call for small, machine-word-sized operands; it is NOT unconditionally O(1) for arbitrarily large integers, whose addition cost grows with their digit count."
}
```

### Prediction
- **atEventIndex 0** — Q: What does add return if you call add(10, -3)?
  - A: 7
  - Why: It returns a + b = 10 + (-3) = 7.

### Experiments
- Add a third parameter c and return a + b + c; update the call.
- Remove the return statement and print the result of the call — it will be None.
- Call add twice and watch two separate frames appear and disappear.

### Exercises (with hints, graded solutions, and shared-registry content)

#### func-complete-1 · kind: complete-code
- **Prompt:** Write a function `square(n)` that returns n times itself, then print square(6).
- **Starter:** ```
def square(n):
    # TODO: return n squared
    pass
print(square(6))
```
- **Expected / model solution:** ```
def square(n):
    return n * n
print(square(6))
```
- **Hints:**
  1. Goal: define square(n) returning n multiplied by itself, then print square(6) which should show 36.
  2. There is no repeated work to optimise; the point is to package one computation as a reusable function.
  3. Key insight: squaring a number is simply that number times itself.
  4. Approach: write a def with a return statement, then call it inside print.
  5. Pseudocode: def square(n): return n times n; then print(square(6)).
  6. Use `return n * n` in the body and `print(square(6))` to display 36.
- **Shared exercise-registry effective content** (`lesson:functions:func-complete-1`):
```
[1, 2, 3]
```

#### func-predict-1 · kind: predict-state
- **Prompt:** A function has no return statement. What value does calling it produce?
- **Expected / model solution:** ```
None — a function without an explicit return returns None.
```
- **Hints:**
  1. Every function call produces some value.
  2. Without return, Python supplies a default.
  3. That default is None.

### References
- [More Control Flow Tools — Python 3.14 documentation](https://docs.python.org/3.14/tutorial/controlflow.html) — §Defining Functions (accessed 2026-09-20)
  - verified: def introduces a function definition
  - verified: A function without a return statement returns None
- [Built-in Types — Numeric Types (int, float, complex) — Python 3.14 documentation](https://docs.python.org/3.14/library/stdtypes.html#numeric-types-int-float-complex) — §Numeric Types (accessed 2026-10-03)
  - verified: Python integers (int) have unlimited precision (no fixed width / no overflow)

---

## scope — "Scope (Local vs Global)"

- **Area:** Programming foundations
- **Prerequisites:** functions
- **contentHash:** `612ab2035b310049` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
1
10

```

### Explanation
**Scope** is the region of a program where a name is visible. A variable assigned **inside** a function is **local** to that function — it lives only during the call and is invisible outside. A variable assigned at the top level is **global**.

This matters because a local variable can **shadow** a global one with the same name. In this lesson `bump` assigns `count = 0`, which creates a brand-new *local* `count`. Changing it does not touch the global `count`, so after the call the global is still `10`.

The rule of thumb: assigning to a name inside a function makes it local (unless you use the `global` keyword). Reading a name that isn't local falls back to an outer scope — the **enclosing scope** (the body of a function that this one is defined inside, if any) and then the **global** (module-level) scope. Keeping state local is usually what you want — it prevents functions from accidentally clobbering each other's data.

### Vocabulary
- **Scope** — The region of code where a name is visible/usable.
- **Local variable** — A name assigned inside a function; exists only during that call.
- **Global variable** — A name defined at the top level of the module.
- **Shadowing** — A local name hiding a global name of the same identifier.
- **global keyword** — Declares that assignments to a name inside a function target the global variable.

### Concepts
- **purpose:** Scope keeps each function's variables separate so functions don't interfere with one another.
- **operations:** Assigning inside a function creates a local; the global keyword opts into modifying a global.
- **uses:** Encapsulating state, avoiding side effects, reasoning about what a function can change.
- **tradeoffs:** Locals keep functions predictable; overusing globals makes bugs hard to trace.
- **commonMistakes:** Expecting an assignment inside a function to change a same-named global (it creates a local instead); reading then assigning a global without declaring `global` (raises UnboundLocalError).
- **edgeCases:** If you reference a name before assigning it in a function where it's assigned later, Python treats it as local and raises UnboundLocalError.

### Code
```
# 'count' here is a global variable.
count = 10

def bump():
    # This 'count' is a NEW local variable, separate from the global.
    count = 0
    count = count + 1
    return count

# The function's local count does not change the global count.
print(bump())
print(count)
```

### Line explanations
- L1 (—): Comment: count here is global.
- L2 (exec): Define the global variable count = 10.
- L3 (—): Blank line.
- L4 (exec): Define the function bump.
- L5 (—): Comment: the inner count is a new local.
- L6 (exec): Assigning count inside bump creates a LOCAL count = 0, separate from the global.
- L7 (exec): Update the local count to 1. The global is untouched.
- L8 (exec): Return the local count (1).
- L9 (—): Blank line.
- L10 (—): Comment: the local does not change the global.
- L11 (exec): Call bump(); it returns 1, which is printed.
- L12 (exec): Print the global count → still 10.

### Complexity (table)
- **Call bump()** — best O(1), avg O(1), worst O(1), space O(1). Constant work in one frame.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "—",
      "meaning": "no input size; constant work per call"
    }
  ],
  "costModel": "Each assignment and addition is one constant-time step; one call frame is constant space.",
  "time": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "bump does two assignments and one addition, then returns — a fixed amount of work with no loop or recursion."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "The call uses one frame with a single local (count). Global count is one variable. Nothing grows with input; max call depth is 1."
  },
  "derivation": [
    {
      "lines": [
        11
      ],
      "description": "One call creates one frame.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        6,
        7,
        8
      ],
      "description": "Two assignments and one addition inside the body.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        2,
        6
      ],
      "description": "One global and one local variable — a fixed set.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Arithmetic and assignment are constant time.",
    "No recursion, so call depth is bounded."
  ],
  "counters": [
    {
      "label": "bump calls",
      "definition": "call events for bump (line 11)",
      "countLines": [
        11
      ]
    }
  ],
  "fixedDataNote": "Values are fixed literals, so this run is constant work; scope behaviour does not depend on any input size."
}
```

### Prediction
- **atEventIndex 0** — Q: After bump() runs, what is the value of the GLOBAL count?
  - A: 10
  - Why: bump's count is a separate local variable; assigning it never changed the global, which stays 10.

### Experiments
- Add `global count` as the first line of bump and re-run; now the global changes.
- Rename the local to `c` and confirm the two variables are clearly distinct in the panel.
- Try reading count before assigning it inside bump to trigger UnboundLocalError.

### Exercises (with hints, graded solutions, and shared-registry content)

#### scope-predict-1 · kind: predict-state
- **Prompt:** A function assigns `x = 5` inside it. Does this change a global variable also named x?
- **Expected / model solution:** ```
No — the assignment creates a local x; the global x is unchanged (unless `global x` is declared).
```
- **Hints:**
  1. Assigning inside a function usually creates a local.
  2. Locals are separate from globals of the same name.
  3. Only `global x` would make it modify the global.

#### scope-choose-1 · kind: choose-approach
- **Prompt:** You want a function to update a module-level counter. What is the cleaner approach: `global`, or returning the new value?
- **Expected / model solution:** ```
Prefer returning the new value and reassigning it at the call site; it avoids hidden side effects. `global` works but couples the function to that name.
```
- **Hints:**
  1. Goal: decide the cleaner way for a function to update a module-level counter: declare it global, or return the new value.
  2. The hidden cost of global is a side effect: the function silently mutates outside state, making it harder to test and reason about.
  3. Key property: a function that only reads inputs and returns outputs is easier to reason about than one that reaches out to mutate a name.
  4. Approach: have the function return the new value and let the caller reassign it.
  5. Reasoning: returning keeps the function pure and testable; global works but couples it to one specific name and introduces hidden coupling.
  6. Answer: prefer returning the new value and reassigning at the call site — it avoids hidden side effects, whereas global ties the function to that specific name.
- **Shared exercise-registry effective content** (`lesson:scope:scope-choose-1`):
```
{
    scenario:
      "A function must update a module-level counter. You can declare the name `global` inside the function, or return the new value and reassign it at the call site.",
    approaches: [
      { id: "return-value", label: "Return the new value and reassign at the call site", requiredReasonIds: ["no-hidden-side-effects"] },
      { id: "global-decl", label: "Declare the name `global` and mutate it in place", requiredReasonIds: [], rejectionFeedback: "`global` works but couples the function to one specific module name and introduces a hidden side effect, making it harder to test and reuse." },
      { id: "nonlocal-decl", label: "Use `nonlocal`", requiredReasonIds: [], rejectionFeedback: "`nonlocal` targets an enclosing function's local, not a module-level name, so it does not apply to a module-level counter." },
    ],
    reasons: [
      { id: "no-hidden-side-effects", text: "Returning the value and reassigning it keeps the data flow explicit and avoids hidden side effects, so the function stays easy to test and decoupled from any particular name." },
      { id: "global-works-coupled", text: "`global` does correctly update the module-level name, so it works when shared mutable state is genuinely wanted — at the cost of coupling the function to that specific name." },
      { id: "global-is-cleanest", text: "Mutating a global is the cleanest option because it avoids any return value.", contradictory: true },
      { id: "cannot-return", text: "A function cannot return a value to update a counter, so a declaration is required.", contradictory: true },
    ],
    acceptableApproachIds: ["return-value"],
    alternatives: [
      { approachId: "global-decl", conditions: "When a quick script truly needs shared mutable module state and the coupling is acceptable.", tradeoff: "Introduces a hidden side effect and binds the function to that module name, hurting testability.", requiredReasonIds: ["global-works-coupled"] },
    ],
    reflectionPrompt:
      "Think of a case where a hidden side effect from `global` would make a bug hard to track down.",
    modelExplanation:
      "Prefer returning the new value and reassigning it at the call site — it avoids hidden side effects. `global` works but couples the function to that specific name.",
  }
```

### References
- [Classes — Python 3.14 documentation](https://docs.python.org/3.14/tutorial/classes.html) — §Python Scopes and Namespaces (accessed 2026-09-20)
  - verified: Assignments inside a function create local names by default
  - verified: global declares module-level binding

---

## references-mutation — "References and Mutation"

- **Area:** Programming foundations
- **Prerequisites:** functions, variables-and-types
- **contentHash:** `d1261afa910cc3e3` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
[1, 2, 3]
5

```

### Explanation
When you pass a value to a function, Python passes a **reference to the object** — the parameter becomes **another local name for the same object** the caller named. The object's **contents are not copied**; what is copied is the reference (the arrow pointing at the object), so the caller and the function now have two names for one shared object. This has two consequences that surprise beginners:

1. If the object is **mutable** (like a list) and the function **mutates it in place** (e.g. `bag.append(item)`), the caller sees the change — because there is only one list.
2. If the function **rebinds** the parameter to a new object (e.g. `n = n + 100`), the caller's variable is **unaffected** — rebinding only changes what the local name points to, not the caller's name.

So `add_item` changes `shared` (mutation of a shared object), but `try_rebind` leaves `x` at 5 (rebinding a local). Understanding this distinction — mutation versus rebinding — prevents a whole category of bugs.

### Vocabulary
- **Reference** — A binding to an object (not a copy of the object). Passing an argument copies the reference, so the parameter is another local name for the same object; the object's contents are not copied.
- **Mutable object** — An object that can be changed in place, e.g. list, dict, set.
- **Immutable object** — An object that cannot change, e.g. int, str, tuple.
- **Mutation** — Changing an object in place (list.append), visible through every reference to it.
- **Rebinding** — Pointing a name at a different object; affects only that name.

### Concepts
- **purpose:** Understanding references explains why some function calls change your data and others don't.
- **operations:** Mutating methods (append, sort, update) change shared objects; assignment rebinds a name.
- **uses:** Passing structures to helpers that modify them; deliberately copying to avoid shared-state bugs.
- **tradeoffs:** Mutating in place is memory-efficient but can cause spooky action at a distance; copying is safe but costs O(n).
- **commonMistakes:** Expecting `n = n + 100` inside a function to change the caller; accidentally mutating a shared default argument or shared list.
- **edgeCases:** An immutable object (int, str, tuple) can't itself be changed, so rebinding a parameter bound to one never affects the caller. But "immutable" is not a blanket guarantee the caller is safe: a tuple can CONTAIN a mutable object (e.g. ([1, 2], 3)), and mutating that inner list through the shared reference IS visible to the caller — the tuple's own slots are fixed, but the objects they point at may be mutable.

### Code
```
# Arguments are passed by object reference.
def add_item(bag, item):
    # Mutating the list affects the caller's list (same object).
    bag.append(item)

shared = [1, 2]
add_item(shared, 3)
print(shared)

# Rebinding a parameter does NOT affect the caller's variable.
x = 5
def try_rebind(n):
    n = n + 100

try_rebind(x)
print(x)
```

### Line explanations
- L1 (—): Comment: arguments are passed by object reference.
- L2 (exec): Define add_item(bag, item).
- L3 (—): Comment: mutating the list is visible to the caller.
- L4 (exec): append mutates the SAME list object the caller passed in.
- L5 (—): Blank line.
- L6 (exec): Create the list [1, 2] and bind it to shared.
- L7 (exec): Call add_item(shared, 3). bag and shared refer to the same list, so it becomes [1, 2, 3].
- L8 (exec): Print shared → [1, 2, 3]. The mutation is visible here.
- L9 (—): Blank line.
- L10 (—): Comment: rebinding a parameter does not affect the caller.
- L11 (exec): Set x = 5 (an immutable int).
- L12 (exec): Define try_rebind(n).
- L13 (exec): n = n + 100 rebinds the LOCAL n to a new int; it does not change x.
- L14 (—): Blank line.
- L15 (exec): Call try_rebind(x). Inside, n becomes 105, but x is untouched.
- L16 (exec): Print x → still 5.

### Complexity (table)
- **append to a shared list** — best O(1), avg O(1), worst O(n) amortized O(1). One element added; occasional resize.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in the list (this run uses a small fixed list)"
    }
  ],
  "costModel": "append is amortized O(1); passing an argument copies only a reference (O(1)), never the object.",
  "time": {
    "bound": "O(1)",
    "case": "amortized",
    "explanation": "Both function calls do constant work: passing arguments copies references (O(1)), append is amortized O(1), and rebinding is O(1). No loops."
  },
  "space": {
    "bound": "O(1)",
    "case": "amortized",
    "explanation": "No copy of the list is made when passing it — only a reference is shared — so passing costs no extra space proportional to n. append adds one slot.",
    "inputOutputNote": "The list `shared` holds your data; it is not auxiliary space created by the calls."
  },
  "derivation": [
    {
      "lines": [
        7
      ],
      "description": "Pass a reference to the list — O(1), no copy.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "append one element — amortized O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        16
      ],
      "description": "Pass an int and rebind locally — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        7
      ],
      "description": "Sharing a reference adds no storage proportional to n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Passing an argument shares a reference (no implicit deep copy).",
    "append is amortized O(1) in CPython."
  ],
  "tradeoffs": "If a helper must not change the caller's list, pass a copy (list(bag)) — O(n) time and space, protecting the original. Note list(bag) is a SHALLOW copy: the new list is independent, but it still shares references to the SAME inner objects, so mutating a nested object (e.g. a sublist) is still visible to the caller. Use copy.deepcopy for fully independent nested data.",
  "counters": [
    {
      "label": "append calls",
      "definition": "executions of the append line (line 4)",
      "countLines": [
        4
      ]
    }
  ],
  "fixedDataNote": "This run uses a 2-element list and one append, so the work is constant; the amortized O(1) claim is about scaling appends to n."
}
```

### Prediction
- **atEventIndex 0** — Q: After both calls, what are `shared` and `x`?
  - A: shared is [1, 2, 3]; x is 5.
  - Why: add_item mutates the shared list (visible), while try_rebind only rebinds a local copy of the reference to x, leaving x unchanged.

### Experiments
- Make add_item do `bag = bag + [item]` instead of append, and see that shared no longer changes (rebinding vs mutating).
- Pass list(shared) into add_item and confirm the original is protected.
- Try mutating a tuple inside a function to see why immutables can't be changed.

### Exercises (with hints, graded solutions, and shared-registry content)

#### ref-predict-1 · kind: predict-state
- **Prompt:** A function does `lst.append(9)` on the list you pass in. Does your original list change?
- **Expected / model solution:** ```
Yes — append mutates the shared list object, so the caller sees the 9.
```
- **Hints:**
  1. Is the list copied or shared when passed?
  2. It is shared (a reference).
  3. append mutates that shared object, so the caller sees it.

#### ref-fix-1 · kind: fix-mistake
- **Prompt:** A helper should NOT modify the caller's list, but it does. Change it to leave the original intact.
- **Starter:** ```
def doubled(lst):
    lst.append(lst[-1])
    return lst
```
- **Expected / model solution:** ```
def doubled(lst):
    copy = list(lst)
    copy.append(copy[-1])
    return copy
```
- **Hints:**
  1. Goal: return a list with its last element duplicated while leaving the caller's original list untouched.
  2. The expense is mutating shared state: appending to the passed-in list changes the caller's data.
  3. Key insight: the parameter and the caller's variable point at the same list, so in-place edits leak out.
  4. Approach: work on a private copy of the argument instead of the original.
  5. Pseudocode: copy the list; append the copy's last element to the copy; return the copy.
  6. Start with `copy = list(lst)` and operate on `copy`, so the caller's list is never modified.
- **Shared exercise-registry effective content** (`lesson:references-mutation:ref-fix-1`):
```
[1, 2, 3]
```

### References
- [More Control Flow Tools — Python 3.14 documentation](https://docs.python.org/3.14/tutorial/controlflow.html) — §Defining Functions (argument passing) (accessed 2026-09-20)
  - verified: Arguments are passed by object reference; mutable arguments can be changed in place by the callee
- [Data model — Python 3.14 Language Reference](https://docs.python.org/3.14/reference/datamodel.html) — §Objects, values and types (mutability) (accessed 2026-09-20)
  - verified: lists/dicts/sets are mutable; ints/strings/tuples are immutable

---

## classes — "Classes and Objects"

- **Area:** Programming foundations
- **Prerequisites:** functions, references-mutation
- **contentHash:** `ddf1dc876e061ecd` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
12

```

### Explanation
A **class** is a blueprint that bundles **data** (attributes) with **behaviour** (methods). An **instance** is one object made from that blueprint. Classes are how we build the nodes and structures in later lessons — a linked-list node, a tree node, a graph — so this is an important foundation.

The `__init__` method **initializes** a newly created instance — Python builds the object first, then runs `__init__` to set up its starting attributes (so it is the *initializer*; the lower-level creation step is `__new__`, which beginners rarely write). `self` is the current instance, and Python supplies it **automatically**: writing `c.increment()` is shorthand for `Counter.increment(c)`, so the instance `c` is passed in as the first parameter `self`. That is why every method lists `self` first. `self.value = start` stores data **on that specific instance**, and a **method** like `increment` reaches the object's own data through `self`.

Here we make a `Counter` starting at 10, call `increment` twice (10 → 11 → 12), and print `c.value`, which is 12. Attributes you assign through `self` (like `self.value`) are **per-instance**, so two counters' `value`s are independent. Beware, though: this independence is not automatic for *all* data — an attribute defined on the **class** itself (not on `self`) is **shared** by every instance, which matters when that shared value is mutable.

### Vocabulary
- **Class** — A blueprint describing the attributes and methods of a kind of object.
- **Instance / object** — A concrete value created from a class.
- **__init__ (initializer)** — The method that initializes a newly created instance's attributes. Often loosely called the constructor, though Python creates the object first (via __new__) and then calls __init__ to set it up.
- **self** — A reference to the current instance, used to access its attributes/methods.
- **Attribute** — A piece of data stored on an instance, e.g. self.value.
- **Method** — A function defined in a class that operates on an instance.

### Concepts
- **purpose:** Classes model entities that carry state and behaviour together — the basis for nodes, trees, and graphs.
- **operations:** Define with class, initialise with __init__, add methods, create instances, read/write attributes.
- **uses:** Linked-list/tree/graph nodes, custom data structures, grouping related state.
- **tradeoffs:** Classes add structure and reuse but can be overkill for simple data (a tuple or dict may suffice).
- **commonMistakes:** Forgetting self in method definitions or attribute access; confusing class-level and instance-level attributes; expecting two instances to share instance attributes (they don't).
- **edgeCases:** Attributes not set in __init__ don't exist until assigned. Mutable class-level defaults are shared across instances (a common trap).

### Code
```
# A class is a blueprint for objects that bundle data + behaviour.
class Counter:
    def __init__(self, start):
        # self.value is an instance attribute — data for this object.
        self.value = start

    def increment(self):
        # Methods act on the object's own data via self.
        self.value = self.value + 1

# Create an instance and use it.
c = Counter(10)
c.increment()
c.increment()
print(c.value)
```

### Line explanations
- L1 (—): Comment: a class bundles data and behaviour.
- L2 (exec): Define the class Counter (creates the class object).
- L3 (exec): Define the constructor __init__, which runs on instance creation.
- L4 (—): Comment: self.value is per-instance data.
- L5 (exec): Store the starting value on this instance as self.value.
- L6 (—): Blank line.
- L7 (exec): Define the method increment.
- L8 (—): Comment: methods use self to reach the object's data.
- L9 (exec): Add 1 to this instance's value.
- L10 (—): Comment: create and use an instance.
- L11 (—): Comment continues (or blank).
- L12 (exec): Create a Counter with start=10; __init__ sets value to 10.
- L13 (exec): First increment: value becomes 11.
- L14 (exec): Second increment: value becomes 12.
- L15 (exec): Print c.value → 12.

### Complexity (table)
- **increment()** — best O(1), avg O(1), worst O(1), space O(1). One attribute update per call.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "k",
      "meaning": "the number of increment() calls made"
    }
  ],
  "costModel": "Creating an instance and each method call are constant-time; one attribute update is O(1).",
  "time": {
    "bound": "O(k)",
    "case": "worst",
    "explanation": "Construction is O(1). Each increment() does one addition and one attribute store — O(1) — so making k increment calls is O(k). This run makes k = 2 calls."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "One instance with a fixed number of attributes (value). Method calls use one frame at a time (depth 1). Nothing grows with the number of calls."
  },
  "derivation": [
    {
      "lines": [
        12
      ],
      "description": "Construct one instance — O(1).",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        13,
        14
      ],
      "description": "Each increment call does one addition + attribute store; k calls → O(k).",
      "cost": "O(k)",
      "dimension": "time"
    },
    {
      "lines": [
        5
      ],
      "description": "One instance holding a fixed set of attributes.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Attribute access/store and integer addition are constant time.",
    "No recursion; call depth is bounded."
  ],
  "counters": [
    {
      "label": "increment calls",
      "definition": "call events for increment (lines 13–14)",
      "countLines": [
        13,
        14
      ]
    },
    {
      "label": "attribute updates",
      "definition": "executions of the increment body (line 9)",
      "countLines": [
        9
      ]
    }
  ],
  "fixedDataNote": "This run makes exactly 2 increments (final value 12). The O(k) time describes scaling with the number of increment calls."
}
```

### Prediction
- **atEventIndex 0** — Q: If you created a second counter d = Counter(0) and called d.increment() once, would c.value change?
  - A: No — c and d are independent instances; d.increment() only changes d.value.
  - Why: Each instance has its own value attribute, so incrementing d does not affect c.

### Experiments
- Add a method decrement() and call it; watch value go back down.
- Create two counters and confirm they hold independent values.
- Add a second attribute in __init__ and display it in the object view.

### Exercises (with hints, graded solutions, and shared-registry content)

#### class-complete-1 · kind: complete-code
- **Prompt:** Give Counter a `reset()` method that sets value back to 0.
- **Starter:** ```
class Counter:
    def __init__(self, start):
        self.value = start
    def reset(self):
        # TODO: set value to 0
        pass
```
- **Expected / model solution:** ```
class Counter:
    def __init__(self, start):
        self.value = start
    def reset(self):
        self.value = 0
```
- **Hints:**
  1. Goal: add a reset() method to Counter that sets its value attribute back to 0.
  2. There is no repeated computation; the task is knowing where instance state lives.
  3. Key insight: an instance's data is stored on `self`, and methods change it through `self`.
  4. Approach: define a method that assigns 0 to the value attribute on self.
  5. Pseudocode: def reset(self): set self's value to zero.
  6. Inside `def reset(self):` write `self.value = 0`.
- **Shared exercise-registry effective content** (`lesson:classes:class-complete-1`):
```
{c.value}
```

#### class-predict-1 · kind: predict-state
- **Prompt:** After Counter(10) then two increment() calls, what is c.value?
- **Expected / model solution:** ```
12
```
- **Hints:**
  1. Start is 10.
  2. Each increment adds 1.
  3. 10 + 1 + 1 = 12.

### References
- [Classes — Python 3.14 documentation](https://docs.python.org/3.14/tutorial/classes.html) — §Class Objects / Instance Objects / Method Objects (accessed 2026-09-20)
  - verified: __init__ initialises new instances
  - verified: self refers to the instance
  - verified: instances have their own attributes

---

## complexity — "Time and Space Complexity"

- **Area:** DSA foundations
- **Prerequisites:** loops, functions
- **contentHash:** `dc3852d9fb149174` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
9

```

### Explanation
**Complexity** describes how an algorithm's cost grows as its input grows — without tying us to a specific computer or clock. We measure **time complexity** (how many basic steps) and **space complexity** (how much extra memory), both as functions of the **input size**, usually called `n`.

We summarise growth with **Big-O**: `O(n)` ("linear") means the work grows **at most** in proportion to n (Big-O is an *upper bound*); `O(1)` ("constant") means it does not depend on n; `O(n²)` ("quadratic") grows with the square of n. Big-O ignores constant factors and small terms, because we care about the *shape* of the growth for large inputs. (When the work grows *exactly* in proportion to n — an upper **and** matching lower bound — that tight bound is written Θ(n); for `find_max` below, O(n) is in fact tight.)

`find_max` scans the list once, comparing each of the n elements to the best-so-far. That is **n comparisons → O(n) time**, and because it always inspects every element this bound is tight (the same O(n) in the best, average, and worst case). It keeps just one extra variable (`best`), so it uses **O(1) auxiliary space**. The visualization's counter lets you confirm the comparison count matches n as you change the input.

A **precondition**: `find_max` assumes the list is **non-empty**. On `find_max([])` the line `best = nums[0]` raises `IndexError` (there is no element 0), so an empty list is outside the contract rather than returning a value.

### Vocabulary
- **Input size (n)** — The quantity that the cost is measured against, e.g. the number of elements.
- **Time complexity** — How the number of basic steps grows with input size.
- **Space complexity** — How much extra (auxiliary) memory grows with input size.
- **Big-O** — Notation for an upper bound on growth, ignoring constants and lower-order terms.
- **Constant time O(1)** — Cost independent of input size.
- **Linear time O(n)** — Cost grows at most in proportion to n (an upper bound). When it grows exactly in proportion, the tight bound is Θ(n).
- **Auxiliary space** — Extra memory beyond the input itself.

### Concepts
- **purpose:** Complexity lets us compare algorithms and predict how they scale before running them.
- **operations:** Count how basic steps and extra memory grow with n; summarise with Big-O.
- **uses:** Choosing between approaches, spotting bottlenecks, justifying a data structure.
- **tradeoffs:** Faster time often costs more space (e.g. hashing) and vice versa; Big-O hides constants that matter for small n.
- **commonMistakes:** Assuming any nested loops mean O(n²): nesting alone does not establish that bound — it is TWO FULL n-length loops (an inner loop that runs n times for each of the n outer iterations) that give n×n = O(n²); sequential loops instead add → O(n), and an inner loop that runs a constant or sub-n number of times does not reach O(n²); counting the input as auxiliary space; treating measured time as proof of Big-O.
- **edgeCases:** Empty input (n = 0) is outside this function's precondition: `best = nums[0]` raises IndexError before the loop is even reached (it does not return a value). A single element: the loop runs once and returns that element.

### Code
```
# Find the largest number by scanning the list once.
def find_max(nums):
    best = nums[0]
    for x in nums:
        if x > best:
            best = x
    return best

print(find_max([3, 9, 2, 7]))
```

### Line explanations
- L1 (—): Comment: scan the list once to find the largest.
- L2 (exec): Define find_max(nums).
- L3 (exec): Assume the first element is the best so far.
- L4 (exec): Loop over every element x (this is the source of the O(n) work).
- L5 (exec): Compare x to best — one constant-time comparison per element.
- L6 (exec): If x is larger, update best.
- L7 (exec): Return the largest value found.
- L8 (—): Blank line.
- L9 (exec): Call find_max on [3, 9, 2, 7]; the result 9 is printed.

### Complexity (table)
- **find_max scan** — best O(n), avg O(n), worst O(n), space O(1). Every element is compared once; one extra variable.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Each comparison (x > best) and each assignment is one constant-time step. Reading a list element by iteration is O(1).",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop visits every element exactly once and does one comparison each time, so it performs about n comparisons. Doubling the list size doubles the work — the hallmark of linear O(n). Best, average, and worst are all O(n) here because we must look at every element to be sure we found the maximum."
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only `best` and the loop variable `x` are kept, no matter how big the list is. No new list grows with n, so auxiliary space is constant.",
    "inputOutputNote": "The list of n numbers is the input; it is not counted as auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        3
      ],
      "description": "Initialise best from the first element — one constant-time step.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        4,
        5,
        6
      ],
      "description": "The loop body runs once per element: n comparisons, each O(1).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "One extra variable regardless of n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons between elements are constant time.",
    "We must inspect every element, so the whole list is scanned."
  ],
  "tradeoffs": "If the list were already sorted you could read the max in O(1) (the last element) — but sorting first costs O(n log n), which is worse than a single O(n) scan when you only need the max once.",
  "counters": [
    {
      "label": "elements scanned",
      "definition": "executions of the loop comparison (line 5)",
      "countLines": [
        5
      ]
    },
    {
      "label": "best updated",
      "definition": "executions of the update (line 6)",
      "countLines": [
        6
      ]
    }
  ],
  "fixedDataNote": "This run uses a fixed 4-element list, so you observe 4 comparisons. The O(n) claim says that count would grow to n for an n-element list."
}
```

### Prediction
- **atEventIndex 0** — Q: If nums had 1000 elements instead of 4, roughly how many comparisons would find_max do?
  - A: About 1000 — one per element (O(n)).
  - Why: The loop does one comparison per element, so the count scales linearly with n: ~1000 comparisons for 1000 elements.

### Experiments
- Add elements to nums and watch the 'elements scanned' counter grow one-for-one.
- Put the largest number first and note the 'best updated' counter stays low while 'elements scanned' still equals n.
- Reason about why sorting to find the max (O(n log n)) is worse than this single O(n) scan.

### Exercises (with hints, graded solutions, and shared-registry content)

#### cx-predict-1 · kind: predict-state
- **Prompt:** An algorithm does two SEPARATE loops over the same n-element list (one after the other). Is it O(n) or O(n²)?
- **Expected / model solution:** ```
O(n) — sequential loops add: n + n = 2n, which is O(n). You reach O(n²) only when one full n-length loop is NESTED inside another (the inner loop runs n times for each of the n outer iterations); nesting by itself is not enough.
```
- **Hints:**
  1. Are the loops nested or one-after-another?
  2. Sequential costs add; a full n-length loop nested inside another full n-length loop multiplies.
  3. n + n = 2n = O(n); n × n = O(n²).

#### cx-choose-1 · kind: choose-approach
- **Prompt:** You need the maximum of an unsorted list exactly once. What is the best time complexity achievable, and why?
- **Expected / model solution:** ```
O(n): you must look at every element at least once (any unexamined element could be the max), so you cannot do better than linear.
```
- **Hints:**
  1. Goal: determine the best achievable time complexity for finding the maximum of an unsorted list in a single examination.
  2. The tempting error is assuming you can somehow shortcut and skip elements the way binary search skips in sorted data.
  3. Key property: the list is unsorted, so any element you don't look at could be the maximum.
  4. Approach: accept that a full linear scan is required and reason about its lower bound.
  5. Reasoning: skipping even one element risks missing the true max, so no algorithm can be certain without inspecting all n — sorting first would be worse at O(n log n).
  6. Answer: O(n) is optimal — any unexamined element could be the maximum, so you must inspect every element at least once.
- **Shared exercise-registry effective content** (`lesson:complexity:cx-choose-1`):
```
{
    scenario:
      "You must find the maximum of an unsorted list, examining it only once. What is the best time complexity achievable?",
    approaches: [
      { id: "linear-scan", label: "A single O(n) linear scan tracking the running max", requiredReasonIds: ["must-see-every"] },
      { id: "sort-first", label: "Sort the list, then take the last element", requiredReasonIds: [], rejectionFeedback: "Sorting is O(n log n) — slower than necessary; you don't need total order just to find one maximum." },
      { id: "binary-search", label: "Binary search for the maximum", requiredReasonIds: [], rejectionFeedback: "Binary search needs a sorted array; the list is unsorted, so there is no ordering to exploit." },
    ],
    reasons: [
      { id: "must-see-every", text: "Any element you never examine could be the maximum, so you must look at every element at least once — that forces at least linear time." },
      { id: "sublinear-possible", text: "You can find the max without inspecting every element, so sublinear time is achievable.", contradictory: true },
      { id: "already-ordered", text: "The list is already ordered, so you can jump straight to the max.", contradictory: true },
    ],
    acceptableApproachIds: ["linear-scan"],
    modelExplanation:
      "O(n): any unexamined element could be the maximum, so you must inspect every element at least once — you cannot do better than linear.",
  }
```

### References
- [Big-O Notation — Problem Solving with Algorithms and DS using Python (Runestone)](https://runestone.academy/ns/books/published/pythonds3/AlgorithmAnalysis/BigONotation.html) — §Big-O Notation (accessed 2026-09-20)
  - verified: Big-O describes growth ignoring constants and lower-order terms
  - verified: A single pass over n items is O(n)
- [MIT 6.006 Introduction to Algorithms — Lecture notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/) — §Asymptotic notation / models of computation (accessed 2026-09-20)
  - verified: Asymptotic notation abstracts machine-specific constants

---

## cases — "Best, Average, and Worst Cases"

- **Area:** DSA foundations
- **Prerequisites:** complexity
- **contentHash:** `1f31f7d42bd2adc4` · **verifiedAt:** 2026-09-21 · **semanticReview:** false
- **expectedOutput:** ```
True
False

```

### Explanation
The same algorithm can do very different amounts of work depending on the **specific input**. We describe this with three cases:

- **Best case:** the luckiest input. Linear search finds the target at the very first position → **O(1)**.
- **Worst case:** the unluckiest input. The target is absent (or last), so we scan all n elements → **O(n)**.
- **Average case:** the expected work over typical inputs. For a present target at a uniformly random position, linear search checks about n/2 elements → still **O(n)**.

Reporting a bound **without saying which case** is ambiguous, so always state it. By default we usually quote the **worst case**, because it is the guarantee you can rely on. In this lesson, `contains([5,1,4], 5)` hits the best case (one comparison), while `contains([5,1,4], 9)` hits the worst case (three comparisons, then False).

### Vocabulary
- **Best case** — The least work over all inputs of size n.
- **Worst case** — The most work over all inputs of size n; the guarantee.
- **Average case** — The expected work over a stated distribution of inputs.
- **Early exit** — Returning as soon as the answer is known, which enables a good best case.

### Concepts
- **purpose:** Cases explain why one input is fast and another slow for the same algorithm, and which bound to trust.
- **operations:** Identify inputs that trigger least/most work; state the case with every bound.
- **uses:** Setting expectations, choosing algorithms with acceptable worst cases, understanding early exits.
- **tradeoffs:** An algorithm with a great average but terrible worst case (e.g. naive quicksort) may be risky for adversarial input.
- **commonMistakes:** Quoting a bound without its case; assuming best case is typical; confusing average case with best case.
- **edgeCases:** Empty list: contains returns False after zero comparisons. Duplicate targets: returns at the first match.

### Code
```
# Linear search: stop as soon as we find the target.
def contains(nums, target):
    for x in nums:
        if x == target:
            return True
    return False

# Target is first -> stops immediately (best case).
print(contains([5, 1, 4], 5))
# Target absent -> scans everything (worst case).
print(contains([5, 1, 4], 9))
```

### Line explanations
- L1 (—): Comment: linear search with early exit.
- L2 (exec): Define contains(nums, target).
- L3 (exec): Loop over each element (up to n comparisons in the worst case).
- L4 (exec): Compare the current element to target.
- L5 (exec): Return True immediately on a match — this enables the O(1) best case.
- L6 (exec): If the loop finishes with no match, return False (worst case scanned all n).
- L7 (—): Blank line.
- L8 (—): Comment: best case (target first).
- L9 (exec): contains([5,1,4], 5): matches at index 0 → True after one comparison.
- L10 (—): Comment: worst case (target absent).
- L11 (exec): contains([5,1,4], 9): no match → False after scanning all 3 elements.

### Complexity (table)
- **linear search** — best O(1), avg O(n), worst O(n), space O(1). Best: match at index 0. Worst: absent → scan all n.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of elements in nums"
    }
  ],
  "costModel": "Each equality comparison is one constant-time step. The loop may exit early on a match.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "In the worst case (target absent or last), the loop compares against all n elements before returning — O(n). The early `return True` is what makes better cases possible.",
    "otherCases": [
      {
        "case": "best",
        "bound": "O(1)",
        "note": "Target is at index 0: one comparison, then return."
      },
      {
        "case": "average",
        "bound": "O(n)",
        "note": "Target at a uniformly random present position: ~n/2 comparisons, still linear in n."
      }
    ]
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only the loop variable is used; no storage grows with n regardless of case.",
    "inputOutputNote": "The list of n elements is the input, not auxiliary space."
  },
  "derivation": [
    {
      "lines": [
        3,
        4
      ],
      "description": "Each element triggers one comparison; up to n of them in the worst case.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        5
      ],
      "description": "Early return on a match — the source of the O(1) best case.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        3
      ],
      "description": "One loop variable; no growth with n.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Comparisons are constant time.",
    "Average case assumes the target is present at a uniformly random position."
  ],
  "tradeoffs": "If you search the same list many times, building a set once (O(n)) then querying in O(1) beats repeated O(n) linear searches — trading space for time.",
  "counters": [
    {
      "label": "comparisons",
      "definition": "executions of the equality test (line 4)",
      "countLines": [
        4
      ]
    }
  ],
  "fixedDataNote": "The first call hits the best case (1 comparison); the second hits the worst case (3 comparisons on this 3-element list). The bounds generalise these counts to n."
}
```

### Prediction
- **atEventIndex 0** — Q: For a 100-element list, how many comparisons does the best case take, and the worst case?
  - A: Best: 1 (match at index 0). Worst: 100 (absent → scan all).
  - Why: The early return gives O(1) best case; an absent target forces scanning all n = 100 elements in the worst case.

### Experiments
- Search for the last element and count comparisons — it equals n (a worst-case-like scan).
- Search an empty list and confirm zero comparisons and a False result.
- Change the target to one that appears twice and see it returns at the first occurrence.

### Exercises (with hints, graded solutions, and shared-registry content)

#### cases-predict-1 · kind: predict-state
- **Prompt:** State the case: linear search where the target is the LAST element. Best, average, or worst-like?
- **Expected / model solution:** ```
Worst-like: it scans all n elements before finding it, which is the maximum work O(n).
```
- **Hints:**
  1. How many elements are checked before the match?
  2. All of them.
  3. That is the maximum → worst-case O(n).

#### cases-choose-1 · kind: choose-approach
- **Prompt:** Two algorithms both sort n items: one is O(n log n) worst case, the other averages O(n log n) but is O(n²) worst case. Which is safer for untrusted input, and why?
- **Expected / model solution:** ```
The guaranteed O(n log n) worst case, because untrusted/adversarial input could deliberately trigger the other's O(n²) worst case.
```
- **Hints:**
  1. Goal: choose between two sorts for untrusted input — one O(n log n) worst case, one that averages O(n log n) but degrades to O(n²).
  2. The trap is judging by average case: on adversarial input the average tells you nothing about what an attacker can force.
  3. Key property: the input is untrusted/adversarial, so an attacker can deliberately hit the worst case.
  4. Approach: choose on the WORST-case bound, not the average.
  5. Reasoning: a guaranteed worst case can't be exploited, whereas the second sort's O(n²) worst case could be triggered by crafted input to cause a denial of service; the average-case sort would be fine only for trusted/random data.
  6. Answer: pick the algorithm with the guaranteed O(n log n) worst case, because adversarial input could deliberately trigger the other's O(n²).
- **Shared exercise-registry effective content** (`lesson:cases:cases-choose-1`):
```
{
    scenario:
      "Two sorting algorithms handle n items: one is O(n log n) in the WORST case; the other averages O(n log n) but degrades to O(n²) in the worst case. The input is untrusted and possibly adversarial.",
    approaches: [
      { id: "guaranteed-worst", label: "Choose the guaranteed O(n log n) worst-case algorithm", requiredReasonIds: ["adversary-triggers-worst"] },
      { id: "best-average", label: "Choose the better average-case algorithm", requiredReasonIds: [], rejectionFeedback: "Average-case assumes random/benign input; an adversary can craft the exact input that triggers the O(n²) worst case, so the average bound gives no guarantee here." },
    ],
    reasons: [
      { id: "adversary-triggers-worst", text: "Untrusted input can be crafted to hit the quadratic worst case, so only a guaranteed worst-case bound protects you against a deliberate attack." },
      { id: "average-is-guarantee", text: "The average-case bound guarantees performance even on worst-case adversarial input.", contradictory: true },
      { id: "worst-case-irrelevant", text: "Worst-case behavior never occurs in practice, so it can be ignored.", contradictory: true },
    ],
    acceptableApproachIds: ["guaranteed-worst"],
    modelExplanation:
      "Pick the algorithm with the guaranteed O(n log n) worst case: untrusted/adversarial input could deliberately trigger the other's O(n²) worst case.",
  }
```

### References
- [Analysis / Big-O — Problem Solving with Algorithms and DS using Python (Runestone)](https://runestone.academy/ns/books/published/pythonds3/AlgorithmAnalysis/BigONotation.html) — §Best/worst/average case discussion (accessed 2026-09-20)
  - verified: Linear search is O(1) best case and O(n) worst case
  - verified: Average case depends on the input distribution

---

## amortized — "Amortized Cost"

- **Area:** DSA foundations
- **Prerequisites:** complexity, cases
- **contentHash:** `5feb5a93f07dcd08` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
[0, 1, 2, 3, 4]
5

```

### Explanation
Some operations are *usually* cheap but *occasionally* expensive. **Amortized analysis** asks: averaged over a long sequence of operations, what is the cost **per operation**?

A Python list is the classic example. `append` normally just drops the item into a spare slot — **O(1)**. But when the underlying array is full, Python allocates a bigger array and **moves the existing element references across** — an **O(n)** event. (It copies the *references* — the slots that point at the objects — into the new array; the objects themselves are not duplicated.) Crucially, Python grows the array by a *multiplicative factor*, so those expensive moves happen rarely and get geometrically less frequent. Their total cost across all n appends is only a **constant multiple of n**, so spreading it over the appends gives **amortized O(1)** per append.

So appending n items is **O(n) total**, or **O(1) amortized each** — even though a single append can occasionally cost O(n). Amortized O(1) is a promise about the *average over the sequence*, not about every individual call.

### Vocabulary
- **Amortized cost** — The average cost per operation across a long sequence, even if individual ops vary.
- **Resize / reallocation** — Allocating a larger backing array and copying elements when the current one is full.
- **Geometric growth** — Growing capacity by a multiplicative factor, making expensive resizes rare.
- **Worst-case single op** — The most one individual operation can cost (here, O(n) on a resize).

### Concepts
- **purpose:** Amortized analysis explains why 'append is O(1)' is true on average despite occasional costly resizes.
- **operations:** Repeated appends; the rare resize copies elements; the cost is averaged over the sequence.
- **uses:** Dynamic arrays, hash-table resizing, and any structure that occasionally reorganises.
- **tradeoffs:** Amortized O(1) is great for throughput but a single op can spike to O(n) — relevant for real-time deadlines.
- **commonMistakes:** Claiming every append is O(1) worst case (a resize is O(n)); confusing amortized with average-case over random inputs (amortized is over an operation sequence, no randomness needed).
- **edgeCases:** The very first append allocates; appends right after a resize are cheap again until the next capacity boundary.

### Code
```
# Build a list by appending one item at a time.
data = []
for i in range(5):
    data.append(i)
print(data)
print(len(data))
```

### Line explanations
- L1 (—): Comment: build a list by appending.
- L2 (exec): Start with an empty list.
- L3 (exec): Loop i = 0..4 (n = 5 iterations).
- L4 (exec): Append i. Usually O(1); occasionally triggers a resize that moves the k current element references into a larger array (O(k)).
- L5 (exec): Print the built list → [0, 1, 2, 3, 4].
- L6 (exec): Print its length → 5.

### Complexity (table)
- **append (single)** — best O(1), avg O(1), worst O(n). Worst = a resize copying n elements.
- **n appends (total)** — best O(n), avg O(n), worst O(n), space O(n). Amortized O(1) each; O(n) total; list holds n items.

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the number of appends performed (5 in this run)"
    }
  ],
  "costModel": "A non-resizing append is O(1). A resizing append copies the current k elements: O(k). Capacity grows geometrically, so resizes are rare.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "This program's scope is the whole construction: building the list with n appends is O(n) TOTAL time. Most of the n appends drop into a spare slot in O(1). The occasional resize moves all current element references into a larger array, but because capacity grows by a multiplicative factor each time, those moves form a geometric series whose total across all n appends is only a CONSTANT MULTIPLE of n (the exact constant depends on the growth factor; CPython grows capacity by roughly an eighth each time, so the total move work is a modest constant times n). Constant-multiple-of-n total work plus the n cheap appends is O(n) total — which is O(1) AMORTIZED per append.",
    "otherCases": [
      {
        "case": "amortized",
        "bound": "O(1)",
        "note": "Per append: total O(n) work spread over n appends is O(1) each on average over the sequence."
      },
      {
        "case": "worst",
        "bound": "O(n)",
        "note": "A single append that triggers a resize moves all n current element references once."
      }
    ]
  },
  "space": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The list ends up holding n elements, so it uses O(n) space (this is the data you built). Auxiliary space beyond the list is O(1): a loop counter. During a resize, a temporarily larger array exists but capacity stays O(n).",
    "inputOutputNote": "The n-element list is the output you are constructing; its O(n) size is expected, not wasteful overhead."
  },
  "derivation": [
    {
      "lines": [
        3
      ],
      "description": "The loop runs n times (n appends).",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        4
      ],
      "description": "Each append is amortized O(1); the rare resize moves element references into a larger array, but the geometric growth spreads that cost so the total is a constant multiple of n.",
      "cost": "O(1)",
      "dimension": "time"
    },
    {
      "lines": [
        2,
        4
      ],
      "description": "The list grows to hold n elements.",
      "cost": "O(n)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "CPython over-allocates list capacity geometrically, giving amortized O(1) append.",
    "range(n) yields values in O(1) each."
  ],
  "tradeoffs": "If you know the final size, preallocating (e.g. [None] * n) avoids resizes entirely, trading a one-time O(n) allocation for zero mid-loop copies.",
  "counters": [
    {
      "label": "appends",
      "definition": "executions of the append line (line 4)",
      "countLines": [
        4
      ]
    }
  ],
  "fixedDataNote": "This run does exactly 5 appends, building [0,1,2,3,4]. The amortized O(1) / O(n)-total claims describe how the cost scales as the number of appends grows to n."
}
```

### Prediction
- **atEventIndex 0** — Q: Appending n items to a list: what is the TOTAL time, and the per-append AMORTIZED time?
  - A: O(n) total; O(1) amortized per append.
  - Why: Cheap appends plus rare geometric resizes sum to O(n) total, which is O(1) averaged over the n appends.

### Experiments
- Increase the range and watch the 'appends' counter equal n while the list grows to n.
- Preallocate with data = [None] * 5 and assign by index instead of appending; compare the approach.
- Reason about why growing capacity by +1 each time (instead of ×2) would make appends O(n) amortized.

### Exercises (with hints, graded solutions, and shared-registry content)

#### amort-predict-1 · kind: predict-state
- **Prompt:** True or false: every individual list.append is O(1) in the worst case.
- **Expected / model solution:** ```
False — a single append that triggers a resize is O(n). Appends are O(1) AMORTIZED, not O(1) worst case.
```
- **Hints:**
  1. What happens when the backing array is full?
  2. It reallocates and copies all elements.
  3. So one append can be O(n); the O(1) is amortized.

#### amort-choose-1 · kind: choose-approach
- **Prompt:** You will append exactly n items and n is known in advance. How can you avoid all resizes, and what does it cost?
- **Expected / model solution:** ```
Preallocate a list of size n (e.g. [None] * n) and assign by index; this does one O(n) allocation and no mid-loop copies.
```
- **Hints:**
  1. Goal: append exactly n known-in-advance items while avoiding the periodic resize-and-copy a growing list performs.
  2. The avoidable cost is letting the list grow on demand: it reallocates and copies several times as capacity is exceeded.
  3. Key property: n is known up front, so the final capacity is fixed in advance.
  4. Approach: reserve all the capacity once, then fill by index.
  5. Reasoning: preallocating does a single allocation and no mid-loop copies; relying on amortized append still pays occasional O(n) copies you can skip entirely when n is known.
  6. Answer: preallocate a list of size n (e.g. [None] * n) and assign by index — one O(n) allocation and no mid-loop copies.
- **Shared exercise-registry effective content** (`lesson:amortized:amort-choose-1`):
```
{
    scenario:
      "You will append exactly n items to a list and n is known in advance. You want to avoid the periodic resize/copy that a growing list performs.",
    approaches: [
      { id: "preallocate", label: "Preallocate a list of size n ([None] * n) and assign by index", requiredReasonIds: ["one-alloc-no-copies"] },
      { id: "append-grow", label: "Start empty and append n times, letting the list grow", requiredReasonIds: [], rejectionFeedback: "Appending to a growing list triggers periodic doubling/reallocations; it is amortized O(n) overall but does repeated mid-loop copies you were asked to avoid." },
    ],
    reasons: [
      { id: "one-alloc-no-copies", text: "Because n is known, one [None]*n allocation reserves all space up front, so index assignment does zero mid-loop copies — a single O(n) allocation." },
      { id: "append-never-copies", text: "Appending to a Python list never causes any reallocation or copying.", contradictory: true },
      { id: "size-unknown", text: "The final size is unknown, so preallocation is impossible.", contradictory: true },
    ],
    acceptableApproachIds: ["preallocate"],
    modelExplanation:
      "Preallocate a list of size n (e.g. [None] * n) and assign by index: one O(n) allocation and no mid-loop copies.",
  }
```

### References
- [Design and History FAQ — How are lists implemented in CPython?](https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython) — §List implementation / over-allocation (accessed 2026-09-20)
  - verified: CPython lists are dynamic arrays that over-allocate, giving amortized O(1) append
- [Open Data Structures](https://opendatastructures.org/) — §ArrayStack / amortized analysis of dynamic arrays (accessed 2026-09-20)
  - verified: Dynamic arrays that grow capacity by a multiplicative factor achieve amortized O(1) append; the total copy/move work over n appends is a constant multiple of n

---

## correctness — "Correctness and Invariants"

- **Area:** DSA foundations
- **Prerequisites:** loops, functions
- **contentHash:** `23fa1c0da21c5d26` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
15
0

```

### Explanation
Fast is useless if the answer is wrong. **Correctness** means an algorithm returns the right result for **every** valid input — the inputs allowed by its **contract** (precondition). For `sum_to` the contract is "`n` is a non-negative integer"; inputs outside the contract (such as a negative `n`) are not promised a meaningful answer, though here the loop guard happens to return 0 for them. We reason about correctness with a few tools:

- A **loop invariant**: a statement that is true before the loop and is restored after each **complete** pass (it may be momentarily broken mid-pass). Here the invariant is "`total` equals the sum of `1..(i-1)`." It holds at the start (total = 0 = empty sum). Within a pass it is briefly broken — `total = total + i` makes total the sum of `1..i` while `i` has not yet moved — and then `i = i + 1` **restores** it, so the invariant holds again at the top of the next pass. When the loop ends `i = n+1`, so total = sum of `1..n` — exactly what we want.
- **Base/edge cases**: the smallest or unusual inputs. For `n = 0` the loop never runs and we correctly return 0 ("sum of nothing").
- **Termination**: `i` increases every pass, so `i <= n` eventually fails — the loop always ends.

You will use this style of reasoning throughout: state what stays true, check the edge cases (empty, single, duplicate, negative), and confirm the algorithm stops.

### Vocabulary
- **Correctness** — Producing the right output for every valid input.
- **Loop invariant** — A property true before the loop and preserved by every iteration.
- **Base / edge case** — The smallest or unusual inputs (empty, single, zero, negative).
- **Termination** — A guarantee that the algorithm eventually stops (loops make progress toward ending).
- **Precondition** — What must be true about the input for the algorithm to be valid.

### Concepts
- **purpose:** Correctness reasoning gives confidence an algorithm works for all inputs, not just tested ones.
- **operations:** State an invariant, verify it holds initially and after each step, check edge cases and termination.
- **uses:** Justifying loops, binary search boundaries, recursion base cases, and tricky pointer logic.
- **tradeoffs:** Rigorous proofs take effort; for teaching we use clear invariants and edge-case checks rather than formal proofs.
- **commonMistakes:** Testing one input and assuming general correctness; ignoring empty/zero/negative inputs; off-by-one errors that break the invariant at the boundary.
- **edgeCases:** n = 0 (empty sum → 0), n = 1 (single term), and — if allowed — negative n (loop never runs, returns 0).

### Code
```
# Sum 1 + 2 + ... + n. We argue WHY this is correct.
def sum_to(n):
    total = 0
    i = 1
    # Loop invariant: total == sum of 1..(i-1) at the top of each pass.
    while i <= n:
        total = total + i
        i = i + 1
    return total

print(sum_to(5))
# Edge case: n = 0 means "sum of nothing" = 0.
print(sum_to(0))
```

### Line explanations
- L1 (—): Comment: we will argue why this is correct.
- L2 (exec): Define sum_to(n).
- L3 (exec): Start total at 0 — the sum of no terms.
- L4 (exec): Start i at 1 — the first term to add.
- L5 (—): Comment states the loop invariant.
- L6 (exec): Loop while i <= n. i increases each pass, guaranteeing termination.
- L7 (exec): Add i to total. Mid-iteration the invariant is temporarily BROKEN: total now includes 1..i, but i has not advanced, so it no longer equals the sum of 1..(i-1).
- L8 (exec): Advance i to i+1. This completes the iteration and RESTORES the invariant: total (= sum of 1..old i) once again equals the sum of 1..(new i - 1).
- L9 (exec): Return total. At exit i = n+1, so total = sum of 1..n.
- L10 (—): Blank line.
- L11 (exec): sum_to(5) = 1+2+3+4+5 = 15.
- L12 (—): Comment: the n = 0 edge case.
- L13 (exec): sum_to(0): loop never runs, returns 0 — correct 'sum of nothing'.

### Complexity (table)
- **sum_to(n) loop** — best O(n), avg O(n), worst O(n), space O(1). n additions; two variables. (A closed form n(n+1)/2 would be O(1).)

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "n",
      "meaning": "the upper bound of the sum (we add 1..n)"
    }
  ],
  "costModel": "Each loop pass does one addition and one increment — constant time.",
  "time": {
    "bound": "O(n)",
    "case": "worst",
    "explanation": "The loop runs from i = 1 to n, so it performs n additions — linear in n. (There is a closed-form shortcut, n(n+1)/2, that computes the same answer in a fixed number of arithmetic operations — O(1) under a unit-cost model where each op is constant; strictly, arbitrary-precision arithmetic on d-digit numbers costs more. The loop is shown so the invariant is visible.)"
  },
  "space": {
    "bound": "O(1)",
    "case": "worst",
    "explanation": "Only `total` and `i` are stored, regardless of n. No storage grows with the input."
  },
  "derivation": [
    {
      "lines": [
        6,
        7,
        8
      ],
      "description": "The loop body runs n times: one addition + one increment each.",
      "cost": "O(n)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        4
      ],
      "description": "Two variables held throughout.",
      "cost": "O(1)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "Additions are constant time for these magnitudes (unit-cost model); arbitrary-precision arithmetic on very large numbers would cost more.",
    "Contract (precondition): n is a non-negative integer. A negative n is outside the contract, though the loop guard happens to return 0 for it."
  ],
  "tradeoffs": "The closed form total = n * (n + 1) // 2 gives the same result in a FIXED number of arithmetic operations — O(1) under a unit-cost model that treats each arithmetic op as constant. (Strictly, since Python ints are arbitrary precision, multiplying numbers with d digits is more than O(1); for machine-word-sized n the unit-cost O(1) is the right description.) It is faster than the loop, but the loop makes the invariant and step-by-step reasoning visible for learning.",
  "counters": [
    {
      "label": "loop passes",
      "definition": "executions of the accumulate line (line 7)",
      "countLines": [
        7
      ]
    }
  ],
  "fixedDataNote": "This run computes sum_to(5) = 15 (5 passes) and sum_to(0) = 0 (0 passes). The O(n) bound generalises the pass count to n."
}
```

### Prediction
- **atEventIndex 0** — Q: At the moment the loop exits for n = 5, what is i, and what does that tell you about total?
  - A: i = 6 (= n+1); the invariant then says total = sum of 1..5 = 15.
  - Why: The loop stops when i > n, i.e. i = n+1 = 6. The invariant 'total = sum of 1..(i-1)' becomes total = sum of 1..5, which is 15.

### Experiments
- Trace the invariant at each step: check total equals the sum of 1..(i-1) every pass.
- Run sum_to(1) and sum_to(0) to confirm the single-term and empty edge cases.
- Replace the loop with the closed form n*(n+1)//2 and confirm identical results in O(1).

### Exercises (with hints, graded solutions, and shared-registry content)

#### correct-fix-1 · kind: fix-mistake
- **Prompt:** This version has an off-by-one bug: it omits n. Fix the loop condition.
- **Starter:** ```
def sum_to(n):
    total = 0
    i = 1
    while i < n:
        total = total + i
        i = i + 1
    return total
```
- **Expected / model solution:** ```
def sum_to(n):
    total = 0
    i = 1
    while i <= n:
        total = total + i
        i = i + 1
    return total
```
- **Hints:**
  1. Goal: sum_to(n) should add 1 through n inclusive (sum_to(3) is 6, not 3).
  2. The bug is an off-by-one in the loop boundary that drops the final term n.
  3. Key insight: `i < n` stops before i equals n, so n itself is never added.
  4. Approach: extend the loop condition so it includes n.
  5. Pseudocode: total = 0, i = 1; while i is at most n: add i to total, increment i; return total.
  6. Change the condition to `while i <= n:` so the last term n is included.
- **Shared exercise-registry effective content** (`lesson:correctness:correct-fix-1`):
```
{sum_to(5)}
```

#### correct-predict-1 · kind: predict-state
- **Prompt:** Why does sum_to(0) correctly return 0 without any special-case code?
- **Expected / model solution:** ```
Because the loop condition 1 <= 0 is False immediately, the body never runs, and total stays at its initial 0 — the sum of no terms.
```
- **Hints:**
  1. Does the loop body run when n = 0?
  2. The condition is False from the start.
  3. So total keeps its initial value, 0.

### References
- [MIT 6.006 Introduction to Algorithms — Lecture notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/pages/lecture-notes/) — §Correctness / loop invariants (accessed 2026-09-20)
  - verified: A loop invariant is established initially, maintained each iteration, and used at termination to prove correctness

---

## representations — "Representations of Data"

- **Area:** DSA foundations
- **Prerequisites:** variables-and-types, loops
- **contentHash:** `f9e6e64ce44f97f1` · **verifiedAt:** 2026-10-04 · **semanticReview:** false
- **expectedOutput:** ```
True
3

```

### Explanation
A **data structure** is a way of *representing* information so that the operations you care about are efficient. The same facts can be stored in different shapes, and the shape you pick determines which operations are fast.

Take a tiny graph of three nodes where 0–1, 0–2, and 1–2 are connected. Two standard shapes store **the same connections**:

- an **edge list** — a flat list of pairs, `[(0, 1), (0, 2), (1, 2)]`; and
- an **adjacency map** — each node mapped to the **set** of its neighbours, `{0: {1, 2}, 1: {0, 2}, 2: {0, 1}}`. (A `set` is an unordered collection of distinct values, written with `{ }`.)

To check they really match, the program rebuilds the collection of connections from each shape and compares them. It uses a **set of pairs**: each undirected edge is stored as `(min, max)` so that the edge between 0 and 1 looks identical whether we read it as `(0, 1)` from the list or as the neighbour `1` of node `0` in the map. A first `for` loop walks the edge list; a **nested** `for` loop walks the map (for each node, for each of its neighbours). If the two sets are equal, the encodings describe the same graph — the program prints `True`.

**What the check actually compares.** Be precise about what `from_edges == from_adj` proves: it compares two **sets of normalised `(min, max)` edges**. It does **not** check that the two shapes list the same **vertices**, that the adjacency map stores each edge from **both** ends (reciprocity), or **how many times** an edge appears (multiplicity). So this is an **example under stated assumptions, not a general graph-equivalence validator**. We rely on the graph being **undirected** (an edge `u–v` is the same as `v–u`), with **no self-loops** (`u == v`), **no duplicate/parallel edges**, and **the same set of nodes** in both shapes. The `(min, max)` normalisation and the **set** are what let us ignore direction and the map's both-ends listing.

Because a set ignores order and duplicates, several assumption violations can **still print `True`** — the check will not catch them: a **parallel/duplicate** edge in the list collapses to one element (multiplicity is lost); a **non-reciprocal** map (node 0 lists 1 but node 1 omits 0) normalises to the same edge; and an **isolated node** present in only one shape contributes no edge, so the edge sets can match even though the vertex sets differ. A real graph-equivalence check would also compare vertex sets and (for directed graphs) edge direction — this lesson deliberately does not, to keep the example small.

Neither shape is "more correct" — they trade off differently. The adjacency map answers "who are node X's neighbours?" by a direct key lookup (expected **O(1)** to reach the set, then O(degree) to read it); the edge list has no key, so the same question means scanning all edges — **O(E)**. The takeaway: **choose the representation to match your operations.** Later graph lessons extend this to adjacency lists vs adjacency matrices.

### Vocabulary
- **Data structure** — A way of organising data to make certain operations efficient.
- **Representation** — The concrete shape chosen to store information (edge list, adjacency map, …).
- **Edge list** — A flat list of pairs, each pair being one connection (edge) between two nodes.
- **Adjacency map** — A map (dict) from each node to the collection of its neighbours.
- **Set** — An unordered collection of distinct values, written with { }; adding a duplicate has no effect.
- **Nested loop** — A loop inside another loop; here, for each node we loop over that node's neighbours.
- **Equivalent encodings** — Different shapes that store the same information under stated assumptions, each rebuildable from the other.
- **Normalised edge set** — The set of edges each stored as (min, max); comparing two such sets ignores order, direction, and duplicates.
- **Not a general validator** — This check compares edge sets only; it does not verify vertex sets, reciprocity, or edge multiplicity, so some assumption violations still compare equal.

### Concepts
- **purpose:** Choosing the right representation is what makes an algorithm fast; the same connections can be stored as an edge list or an adjacency map.
- **operations:** Convert between encodings with loops; compare how each supports edge iteration, neighbour lookup, and membership.
- **uses:** Edge list vs adjacency map (and later adjacency list vs matrix) for graphs; array vs linked list for sequences.
- **tradeoffs:** The adjacency map reaches a node's neighbours by key in expected O(1) (then O(degree) to read them); the edge list has no key, so finding one node's neighbours scans all E edges.
- **commonMistakes:** Treating this edge-set check as a general graph-equivalence validator — it is not: a parallel/duplicate edge, a non-reciprocal entry, or an isolated extra node can still compare equal; forgetting the assumptions (undirected, no self-loops, no duplicate edges, same node set); double-counting an undirected edge the map stores from both ends.
- **edgeCases:** Empty graph (no edges). The check only compares normalised edge SETS, so it is reliable just under the stated assumptions. Some violations still print True (it cannot catch them): a parallel/duplicate edge collapses in the set (multiplicity lost), a non-reciprocal adjacency entry normalises to the same edge, and an isolated node present in only one shape adds no edge. It is NOT a general graph-equivalence validator (which would also compare vertex sets and, for directed graphs, edge direction).

### Code
```
# One small graph, two shapes for the SAME connections.
# Edge list: each undirected edge as a pair.
edges = [(0, 1), (0, 2), (1, 2)]
# Adjacency map: each node -> the set of its neighbours.
adj = {0: {1, 2}, 1: {0, 2}, 2: {0, 1}}

# Rebuild the connection set from EACH representation. We store each undirected
# edge as (smaller, larger) so the same edge looks identical from both shapes.
from_edges = set()
for u, v in edges:
    from_edges.add((min(u, v), max(u, v)))

from_adj = set()
for node in adj:
    for neighbour in adj[node]:
        from_adj.add((min(node, neighbour), max(node, neighbour)))

# Equal sets mean the two encodings describe the SAME graph.
print(from_edges == from_adj)
print(len(from_edges))
```

### Line explanations
- L1 (—): Comment: the same connections stored two ways.
- L2 (—): Comment: the edge list representation.
- L3 (exec): Build the edge list: three undirected edges as pairs (0,1), (0,2), (1,2).
- L4 (—): Comment: the adjacency map representation.
- L5 (exec): Build the adjacency map: each node mapped to the SET of its neighbours.
- L6 (—): Blank line.
- L7 (—): Comment: rebuild and compare the connections from each shape.
- L8 (—): Comment: store each edge as (smaller, larger) so both shapes look the same.
- L9 (exec): Start an empty set to collect connections rebuilt from the edge list.
- L10 (exec): Loop over each pair (u, v) in the edge list.
- L11 (exec): Add the normalised edge (min, max) to the set. A set ignores duplicates.
- L12 (—): Blank line.
- L13 (exec): Start an empty set to collect connections rebuilt from the adjacency map.
- L14 (exec): Loop over each node (key) in the adjacency map.
- L15 (exec): Nested loop: for that node, loop over each of its neighbours.
- L16 (exec): Add the normalised (min, max) edge. The map lists each edge from both ends; the set collapses the duplicate.
- L17 (—): Blank line.
- L18 (—): Comment: equal sets mean the two encodings describe the same graph.
- L19 (exec): Print whether the two rebuilt connection sets are equal — True proves equivalence.
- L20 (exec): Print how many distinct connections there are — 3 for this graph.

### Complexity (table)
- **Edge list: find a node's neighbours** — best O(E), avg O(E), worst O(E), space O(E). No key: must scan every edge. Plain list scan (no hashing), so O(E) in all cases. Storing all edges is O(E).
- **Adjacency map: reach a node's neighbour set** — best O(1), avg O(1), worst O(V), space O(V + E). A single hashed dict key lookup: expected O(1) (Python dict Get Item, average O(1)). The hashing worst case is O(V) when keys collide — reachable with integer keys congruent modulo sys.hash_info.modulus, though the labels 0,1,2 here hash distinctly. This is only REACHING the set — not reading its members.
- **Adjacency map: enumerate a node's neighbours** — best O(degree), avg O(degree), worst O(degree), space O(1). Iterating the reached set visits each neighbour once — linear in that node's degree, in all cases (set iteration is O(size)).

### Complexity reasoning
```
{
  "scope": "program",
  "variables": [
    {
      "symbol": "V",
      "meaning": "the number of nodes (vertices) in the graph"
    },
    {
      "symbol": "E",
      "meaning": "the number of edges (connections) in the graph"
    }
  ],
  "costModel": "Each set insertion and dict key lookup is EXPECTED (average-case) O(1) under Python's hashing — not a guaranteed worst case: the Python TimeComplexity reference lists dict/set lookup and insert as average O(1) but worst case O(n) when keys collide. The two rebuild loops each touch every edge; set equality compares the two sets of E pairs.",
  "time": {
    "bound": "O(V + E)",
    "case": "expected",
    "explanation": "The first loop runs once per edge (E iterations). The nested loop visits each node and each of its neighbours — every undirected edge is seen from both ends — which is O(V + E). Comparing the two sets of E pairs is O(E). There is NO sort in the program (we print a count, not a sorted list), so no O(E log E) term. This O(V + E) is the EXPECTED (average) case: it assumes the set inserts and set-equality hashing are O(1) each. Under hash collisions the dict/set operations degrade toward O(n) per step, making the worst case superlinear. Integer keys CAN be made to collide — any ints that are equal modulo sys.hash_info.modulus share a hash (for example 0 and the modulus 2147483647 both hash to 0) — so the pathological worst case is a real property of the data structure, not impossible. The specific labels in THIS graph (0, 1, 2) hash to the distinct values 0, 1, 2, so they do not collide and this run stays in the expected O(V + E) case.",
    "otherCases": [
      {
        "case": "worst",
        "bound": "superlinear (hashing collisions)",
        "note": "If many keys share a hash bucket (achievable with integer keys that are congruent modulo sys.hash_info.modulus), each set insert / membership step degrades toward O(n), pushing the rebuild + comparison above O(V + E). This is the documented dict/set worst case; the specific labels 0, 1, 2 here hash distinctly and do not trigger it."
      }
    ]
  },
  "space": {
    "bound": "O(V + E)",
    "case": "worst",
    "explanation": "The edge list stores E pairs; the adjacency map stores V keys plus 2E neighbour entries (each undirected edge appears in two sets). The two rebuilt connection sets each hold E pairs. All are linear in the graph size.",
    "inputOutputNote": "The two representations ARE the data; their O(V + E) size is inherent, not auxiliary overhead."
  },
  "derivation": [
    {
      "lines": [
        10,
        11
      ],
      "description": "Rebuild from the edge list — one pass over E edges, each an expected O(1) set insert.",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        14,
        15,
        16
      ],
      "description": "Rebuild from the adjacency map — visit each node and each neighbour (each edge twice).",
      "cost": "O(V + E)",
      "dimension": "time"
    },
    {
      "lines": [
        19
      ],
      "description": "Set equality compares the two sets of E pairs.",
      "cost": "O(E)",
      "dimension": "time"
    },
    {
      "lines": [
        3,
        5
      ],
      "description": "Store E edges and V nodes with 2E neighbour entries.",
      "cost": "O(V + E)",
      "dimension": "space"
    }
  ],
  "assumptions": [
    "The graph is undirected, with no self-loops and no duplicate/parallel edges, and both shapes cover the same nodes — the conditions under which the two encodings are equal.",
    "Dict/set lookups are expected O(1) under Python's hashing.",
    "The example is a fixed tiny graph (V = 3, E = 3), so this run is constant work."
  ],
  "tradeoffs": "Two distinct steps: the adjacency map REACHES a node's neighbour set by key in expected O(1) (a dict lookup), then ENUMERATES those neighbours in O(degree) (iterating the set). The edge list has no key, so answering the same question scans all E edges — O(E). The edge list uses less overhead per edge. Pick per your operation mix.",
  "fixedDataNote": "The literals are fixed (3 nodes, 3 edges), so building them is constant work here. The O(V + E) costs describe how each representation behaves as the graph grows."
}
```

### Prediction
- **atEventIndex 0** — Q: Which representation answers 'who are the neighbours of node 0?' faster: the edge list or the adjacency map?
  - A: The adjacency map, in expected O(1) to reach node 0's set (then O(degree) to read it).
  - Why: The adjacency map indexes node 0 directly to its neighbour set via a hashed key lookup (expected O(1)); the edge list has no key, so it must scan all E edges to collect node 0's neighbours.

### Experiments
- Add a GENUINELY NEW edge to the edge list only — change line 3 to `edges = [(0, 1), (0, 2), (1, 2), (0, 3)]`. The adjacency map still has no node 3, so the sets differ and the equality check now prints False (and the count becomes 4).
- Keep them in sync instead: add (0, 3) to the edge list AND put 3 in the map (`adj[0]` gains 3 and `adj[3] = {0}`); the check returns to True.
- Count how many steps it takes to list node 0's neighbours from the edge list (scan all edges) versus the adjacency map (one key lookup).

### Exercises (with hints, graded solutions, and shared-registry content)

#### repr-choose-1 · kind: choose-approach
- **Prompt:** You frequently ask 'who are the neighbours of node X?' on a changing graph. Which representation fits best: an edge list, or an adjacency map?
- **Expected / model solution:** ```
An adjacency map — reaching a node's neighbours is an expected O(1) key lookup, versus scanning all E edges in an edge list.
```
- **Hints:**
  1. Goal: pick a representation for changing data you repeatedly query as 'is key K present, and what is its value?' — a list of pairs or a dict.
  2. The costly choice is a list of (key, value) pairs: every lookup scans the whole list.
  3. Key property: the dominant operation is keyed lookup by K, which a hash table serves directly.
  4. Approach: store the data in a dict keyed by K rather than a list of pairs.
  5. Reasoning: a dict hashes straight to the entry in expected O(1), while a list of pairs forces an O(n) scan per query — and the data changing doesn't hurt the dict.
  6. Answer: use a dict — keyed lookup is expected O(1), versus O(n) scanning a list of pairs.
- **Shared exercise-registry effective content** (`lesson:representations:repr-choose-1`):
```
{
    scenario:
      "On changing data, you frequently ask 'is key K present, and what is its value?'. You can store the data as a list of (key, value) pairs or as a dict.",
    approaches: [
      { id: "dict", label: "Use a dict keyed by K", requiredReasonIds: ["o1-lookup"] },
      { id: "list-pairs", label: "Keep a list of (key, value) pairs", requiredReasonIds: [], rejectionFeedback: "Finding a key in a list of pairs means scanning until you hit it — O(n) per lookup — which is wasteful for frequent keyed queries." },
      { id: "sorted-list", label: "Keep a list of pairs sorted by key and binary-search", requiredReasonIds: [], rejectionFeedback: "Binary search needs the list kept sorted, and inserts/deletes on changing data cost O(n); a dict gives expected O(1) without that upkeep." },
    ],
    reasons: [
      { id: "o1-lookup", text: "A dict hashes the key, so 'is K present and what is its value?' is answered in expected O(1), versus O(n) scanning a list of pairs." },
      { id: "preserves-order-only", text: "A list of pairs answers keyed lookups faster because it preserves insertion order.", contradictory: true },
      { id: "list-is-constant", text: "Searching a list of pairs for a key is O(1).", contradictory: true },
    ],
    acceptableApproachIds: ["dict"],
    modelExplanation:
      "A dict: keyed lookup is expected O(1), versus O(n) scanning a list of pairs.",
  }
```

#### repr-predict-1 · kind: predict-state
- **Prompt:** You add the new edge (0, 3) to the edge list but NOT to the adjacency map. Will `from_edges == from_adj` print True or False, and why?
- **Expected / model solution:** ```
False — the edge list now has a connection (0, 3) that the adjacency map does not, so the two rebuilt sets differ (and the printed count rises to 4).
```
- **Hints:**
  1. Does the adjacency map know about node 3?
  2. No — only the edge list changed.
  3. So from_edges has (0,3) but from_adj does not → the sets are unequal → False.

### References
- [Open Data Structures (Python) — 12. Graphs](https://opendatastructures.org/ods-python/12_Graphs.html) — §Chapter 12 intro: a graph G = (V, E) and its two representations (accessed 2026-10-02)
  - verified: A (directed) graph is a pair G = (V, E) where E is a set of pairs of vertices (edges)
  - verified: There are two broad standard representations of a graph (adjacency matrix and adjacency list)
- [7.2 Graphs: Vocabulary and Definitions — Problem Solving with Algorithms and DS using Python (Runestone)](https://runestone.academy/ns/books/published/pythonds3/Graphs/VocabularyandDefinitions.html) — §Vertex / Edge definitions (accessed 2026-10-02)
  - verified: A graph is made of vertices and edges; an edge connects two vertices (a tuple (v, w))
- [7.3 The Graph Abstract Data Type — Problem Solving with Algorithms and DS using Python (Runestone)](https://runestone.academy/ns/books/published/pythonds3/Graphs/TheGraphAbstractDataType.html) — §Representations trade-off (adjacency matrix vs adjacency list) (accessed 2026-10-02)
  - verified: The graph ADT (vertices + edges) has more than one implementation, with trade-offs between representations (adjacency matrix and adjacency list)
- [7.5 An Adjacency List — Problem Solving with Algorithms and DS using Python (Runestone)](https://runestone.academy/ns/books/published/pythonds3/Graphs/AnAdjacencyList.html) — §Adjacency list as a per-vertex dictionary of neighbours (accessed 2026-10-02)
  - verified: An adjacency list keeps, per vertex, a collection (dictionary) of the vertices it connects to
  - verified: The adjacency list makes it easy to find the vertices directly connected to a particular vertex, and is space-efficient for sparse graphs
- [TimeComplexity — Python Wiki](https://wiki.python.org/moin/TimeComplexity) — §dict (Get Item, k in d) and set (x in s) (accessed 2026-10-02)
  - verified: dict Get Item and 'k in d' are Average Case O(1), Amortized Worst Case O(n)
  - verified: set 'x in s' is Average O(1), Worst Case O(n)

---