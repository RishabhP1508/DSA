# Phase 4.1 pattern walkthroughs — verify exact output on CPython 3.14.
# Keep inputs small (10k trace-event limit).
from collections import deque, defaultdict
import heapq

print("=== merge-intervals ===")
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])       # sort by start
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:           # overlaps the last merged interval
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
print(merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]))

print("=== cyclic-sort (find missing number 0..n) ===")
def find_missing(nums):
    i = 0
    n = len(nums)
    while i < n:
        j = nums[i]
        if j < n and nums[i] != nums[j]:
            nums[i], nums[j] = nums[j], nums[i]   # place value at its index
        else:
            i += 1
    for idx in range(n):
        if nums[idx] != idx:
            return idx
    return n
print(find_missing([3, 0, 1]))

print("=== in-place linked-list reversal (reverse a sublist) ===")
class Node:
    def __init__(self, v, nxt=None):
        self.val = v
        self.next = nxt
def build(vals):
    head = None
    for v in reversed(vals):
        head = Node(v, head)
    return head
def to_list(h):
    out = []
    while h:
        out.append(h.val)
        h = h.next
    return out
def reverse_between(head, p, q):
    dummy = Node(0, head)
    prev = dummy
    for _ in range(p - 1):
        prev = prev.next
    curr = prev.next
    for _ in range(q - p):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next
print(to_list(reverse_between(build([1, 2, 3, 4, 5]), 2, 4)))

print("=== tree-bfs (level order) ===")
class TNode:
    def __init__(self, v, l=None, r=None):
        self.val = v
        self.left = l
        self.right = r
def level_order(root):
    res = []
    if not root:
        return res
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res
root = TNode(1, TNode(2, TNode(4), TNode(5)), TNode(3))
print(level_order(root))

print("=== tree-dfs (root-to-leaf path sums) ===")
def path_sum(root, target):
    res = []
    def dfs(node, path, total):
        if not node:
            return
        path.append(node.val)
        total += node.val
        if not node.left and not node.right and total == target:
            res.append(path[:])
        else:
            dfs(node.left, path, total)
            dfs(node.right, path, total)
        path.pop()
    dfs(root, [], 0)
    return res
r2 = TNode(1, TNode(2, TNode(4)), TNode(3))
print(path_sum(r2, 7))   # 1->2->4

print("=== two-heaps (running median) ===")
class MedianFinder:
    def __init__(self):
        self.small = []   # max-heap (negated)
        self.large = []   # min-heap
    def add(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def median(self):
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2
mf = MedianFinder()
out = []
for x in [5, 15, 1, 3]:
    mf.add(x)
    out.append(mf.median())
print(out)

print("=== modified-binary-search (rotated sorted array) ===")
def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:            # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                 # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
print(search_rotated([4, 5, 6, 7, 0, 1, 2], 0))   # index 4

print("=== bitwise-xor (single number) ===")
def single_number(nums):
    x = 0
    for v in nums:
        x ^= v            # pairs cancel; the lone value remains
    return x
print(single_number([4, 1, 2, 1, 2]))

print("=== k-way-merge (merge k sorted lists) ===")
def merge_k(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out
print(merge_k([[1, 4, 7], [2, 5, 8], [3, 6, 9]]))

print("=== knapsack 0/1 (subset-sum feasibility) ===")
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    return dp[target]
print(can_partition([1, 5, 11, 5]))   # True: 11 == 1+5+5

print("=== topological-sort (Kahn) ===")
def topo_sort(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:
        adj[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            indeg[nb] -= 1
            if indeg[nb] == 0:
                q.append(nb)
    return order
print(topo_sort(6, [(5, 2), (5, 0), (4, 0), (4, 1), (2, 3), (3, 1)]))

print("=== graph-dfs-components (count islands / components) ===")
def count_components(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = set()
    count = 0
    def dfs(node):
        seen.add(node)
        for nb in adj[node]:
            if nb not in seen:
                dfs(nb)
    for s in range(n):
        if s not in seen:
            count += 1
            dfs(s)
    return count
print(count_components(5, [(0, 1), (1, 2), (3, 4)]))   # 2

print("=== union-find (DSU) ===")
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True
dsu = DSU(5)
dsu.union(0, 1)
dsu.union(1, 2)
dsu.union(3, 4)
print(dsu.find(0) == dsu.find(2))   # True
print(dsu.find(0) == dsu.find(3))   # False

print("=== dijkstra (weighted shortest path) ===")
def dijkstra(adj, start, n):
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist[node]:
            continue
        for nb, w in adj[node]:
            nd = d + w
            if nd < dist[nb]:
                dist[nb] = nd
                heapq.heappush(pq, (nd, nb))
    return dist
adj = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print(dijkstra(adj, 0, 4))

print("=== trie-prefix (insert + startsWith) ===")
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True
    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True
t = Trie()
t.insert("apple")
t.insert("app")
print(t.starts_with("app"))    # True
print(t.starts_with("api"))    # False

print("=== dynamic-programming (memoized fib subproblem) ===")
def fib(n):
    memo = {}
    def go(k):
        if k < 2:
            return k
        if k in memo:
            return memo[k]
        memo[k] = go(k - 1) + go(k - 2)
        return memo[k]
    return go(n)
print(fib(10))   # 55

print("=== divide-and-conquer (merge sort) ===")
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    out = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out
print(merge_sort([5, 2, 8, 1, 9, 3]))

print("=== greedy-interval-scheduling (max non-overlapping) ===")
def max_meetings(intervals):
    intervals.sort(key=lambda x: x[1])       # sort by END time
    count = 0
    last_end = float("-inf")
    for start, end in intervals:
        if start >= last_end:                # doesn't conflict
            count += 1
            last_end = end
    return count
print(max_meetings([[1, 3], [2, 4], [3, 5], [0, 6], [5, 7]]))

print("=== matrix-traversal (spiral order) ===")
def spiral(matrix):
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1
    return res
print(spiral([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))
