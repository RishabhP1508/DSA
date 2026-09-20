# Candidate DP & recursion lesson programs — verify exact output on CPython 3.14.
# Keep all example inputs SMALL (trace event limit is 10000).
from functools import lru_cache

print("=== base-cases (factorial) ===")
def fact(n):
    if n <= 1:          # base case: stop the recursion
        return 1
    return n * fact(n - 1)
print(fact(5))

print("=== recursive-calls (fib tree) ===")
calls = 0
def fib(n):
    global calls
    calls += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
print(fib(6))
print(calls)

print("=== backtracking (generate parentheses n=2) ===")
def gen_parens(n):
    res = []
    def bt(cur, open_c, close_c):
        if len(cur) == 2 * n:
            res.append(cur)
            return
        if open_c < n:
            bt(cur + "(", open_c + 1, close_c)
        if close_c < open_c:
            bt(cur + ")", open_c, close_c + 1)
    bt("", 0, 0)
    return res
print(gen_parens(2))

print("=== subsets (power set of [1,2,3]) ===")
def subsets(nums):
    res = []
    def bt(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i + 1, path)
            path.pop()
    bt(0, [])
    return res
print(subsets([1, 2, 3]))

print("=== permutations of [1,2,3] ===")
def permutations(nums):
    res = []
    def bt(path, used):
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                bt(path, used)
                path.pop()
                used[i] = False
    bt([], [False] * len(nums))
    return res
print(permutations([1, 2, 3]))

print("=== combinations C(4,2) ===")
def combine(n, k):
    res = []
    def bt(start, path):
        if len(path) == k:
            res.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            bt(i + 1, path)
            path.pop()
    bt(1, [])
    return res
print(combine(4, 2))

print("=== memoization (top-down fib) ===")
@lru_cache(maxsize=None)
def mfib(n):
    if n < 2:
        return n
    return mfib(n - 1) + mfib(n - 2)
print(mfib(10))

print("=== tabulation (bottom-up fib) ===")
def tfib(n):
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
print(tfib(10))

print("=== 1D/2D DP (unique paths grid) ===")
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    return dp[m - 1][n - 1]
print(unique_paths(3, 3))

print("=== knapsack 0/1 ===")
def knapsack(weights, values, cap):
    n = len(weights)
    dp = [[0] * (cap + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(cap + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                if take > dp[i][w]:
                    dp[i][w] = take
    return dp[n][cap]
print(knapsack([1, 3, 4], [15, 20, 30], 4))

print("=== subsequences (count distinct? use LCS length) / here: is subsequence ===")
def is_subsequence(s, t):
    i = 0
    for ch in t:
        if i < len(s) and s[i] == ch:
            i += 1
    return i == len(s)
print(is_subsequence("ace", "abcde"))
print(is_subsequence("aec", "abcde"))

print("=== state-transitions (best time to buy/sell stock once) ===")
def max_profit(prices):
    min_price = prices[0]
    best = 0
    for p in prices[1:]:
        best = max(best, p - min_price)
        min_price = min(min_price, p)
    return best
print(max_profit([7, 1, 5, 3, 6, 4]))

print("=== climbing stairs ===")
def climb(n):
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a
print(climb(5))

print("=== house robber ===")
def rob(nums):
    prev, curr = 0, 0
    for x in nums:
        prev, curr = curr, max(curr, prev + x)
    return curr
print(rob([2, 7, 9, 3, 1]))

print("=== grid paths with obstacles (min path sum) ===")
def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j - 1] + grid[0][j]
    for i in range(1, m):
        dp[i][0] = dp[i - 1][0] + grid[i][0]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])
    return dp[m - 1][n - 1]
print(min_path_sum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]))

print("=== coin change (fewest coins) ===")
def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1
print(coin_change([1, 2, 5], 11))

print("=== LIS (longest increasing subsequence) ===")
def lis(nums):
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
    return max(dp)
print(lis([10, 9, 2, 5, 3, 7, 101, 18]))

print("=== LCS (longest common subsequence) ===")
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
print(lcs("abcde", "ace"))

print("=== divide and conquer (merge-count / max subarray) ===")
def max_subarray(nums):
    def helper(lo, hi):
        if lo == hi:
            return nums[lo]
        mid = (lo + hi) // 2
        left = helper(lo, mid)
        right = helper(mid + 1, hi)
        # best crossing sum
        s = 0
        left_best = nums[mid]
        for i in range(mid, lo - 1, -1):
            s += nums[i]
            left_best = max(left_best, s)
        s = 0
        right_best = nums[mid + 1]
        for i in range(mid + 1, hi + 1):
            s += nums[i]
            right_best = max(right_best, s)
        return max(left, right, left_best + right_best)
    return helper(0, len(nums) - 1)
print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))

print("=== N-Queens (count solutions n=4) ===")
def n_queens(n):
    count = 0
    cols = set()
    diag1 = set()
    diag2 = set()
    def bt(row):
        nonlocal count
        if row == n:
            count += 1
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            bt(row + 1)
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)
    bt(0)
    return count
print(n_queens(4))
