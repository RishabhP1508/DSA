# Candidate Pattern-Library walkthrough programs — verify exact output on CPython 3.14.
from collections import deque, defaultdict
import heapq

print("=== fixed sliding window (max sum of k consecutive) ===")
def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # add entering, drop leaving
        best = max(best, window)
    return best
print(max_sum_k([2, 1, 5, 1, 3, 2], 3))   # window [5,1,3] = 9

print("=== variable sliding window (longest substring w/o repeat) ===")
def longest_unique(s):
    seen = {}
    start = 0
    best = 0
    for i, ch in enumerate(s):
        if ch in seen and seen[ch] >= start:
            start = seen[ch] + 1
        seen[ch] = i
        best = max(best, i - start + 1)
    return best
print(longest_unique("abcabcbb"))   # "abc" -> 3

print("=== two pointers (pair sum in sorted array) ===")
def two_sum_sorted(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return (lo, hi)
        if s < target:
            lo += 1
        else:
            hi -= 1
    return None
print(two_sum_sorted([1, 2, 4, 7, 11, 15], 15))   # 4 + 11 -> (2, 4)

print("=== prefix sums + hashmap (count subarrays summing to k, with negatives) ===")
def subarrays_sum_k(nums, k):
    count = 0
    prefix = 0
    seen = defaultdict(int)
    seen[0] = 1                      # empty prefix
    for x in nums:
        prefix += x
        count += seen[prefix - k]    # earlier prefixes that complete a sum-k range
        seen[prefix] += 1
    return count
print(subarrays_sum_k([1, -1, 1, -1, 1], 0))   # 6 subarrays sum to 0

print("=== Kadane (max sum of any contiguous subarray) ===")
def kadane(nums):
    best = nums[0]
    cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)        # extend or restart
        best = max(best, cur)
    return best
print(kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]))   # [4,-1,2,1] -> 6

print("=== fast/slow pointers (cycle detection) ===")
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
a, b, c = Node(1), Node(2), Node(3)
a.next = b; b.next = c
print(has_cycle(a))   # False
c.next = b            # cycle
print(has_cycle(a))   # True

print("=== BFS shortest path (unweighted grid distances) ===")
def bfs_dist(adj, start):
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()
        for nb in adj[node]:
            if nb not in dist:
                dist[nb] = dist[node] + 1
                q.append(nb)
    return dist
graph = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2, 4], 4: [3]}
print(bfs_dist(graph, 0))   # distances from 0

print("=== backtracking (subsets) ===")
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

print("=== binary search on the answer (min feasible capacity) ===")
def can_ship(weights, cap, days):
    d, cur = 1, 0
    for w in weights:
        if cur + w > cap:
            d += 1
            cur = 0
        cur += w
    return d <= days
def least_capacity(weights, days):
    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_ship(weights, mid, days):
            hi = mid
        else:
            lo = mid + 1
    return lo
print(least_capacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))   # 15

print("=== top-K with a heap (k largest) ===")
def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)      # drop the smallest; keep k largest
    return sorted(heap, reverse=True)
print(k_largest([3, 1, 5, 12, 2, 11], 3))   # [12, 11, 5]

print("=== monotonic stack (next greater element) ===")
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                        # indices, values decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)
    return res
print(next_greater([2, 1, 2, 4, 3]))   # [4, 2, 4, -1, -1]
