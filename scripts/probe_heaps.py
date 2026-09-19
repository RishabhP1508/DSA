# Candidate Heaps lesson programs — verify exact output on CPython 3.14.
import heapq

print("=== min/max heap ===")
h = [5, 3, 8, 1, 9, 2]
heapq.heapify(h)          # O(n) build a min-heap
print(h[0])               # smallest is at index 0
heapq.heappush(h, 0)
print(heapq.heappop(h))   # pops the minimum
print(h[0])
# max-heap via negation
maxh = [-x for x in [5, 3, 8, 1]]
heapq.heapify(maxh)
print(-heapq.heappop(maxh))  # largest original value

print("=== top-K ===")
def top_k(nums, k):
    return heapq.nlargest(k, nums)
print(top_k([3, 1, 5, 12, 2, 11], 3))
# manual min-heap of size k
def top_k_heap(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)   # discard smallest -> keeps k largest
    return sorted(h, reverse=True)
print(top_k_heap([3, 1, 5, 12, 2, 11], 3))

print("=== kth largest ===")
def kth_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]   # smallest of the k largest = kth largest
print(kth_largest([3, 2, 1, 5, 6, 4], 2))

print("=== running median (two heaps) ===")
class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negated)
        self.large = []  # min-heap
    def add(self, x):
        heapq.heappush(self.small, -x)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
mf = MedianFinder()
for v in [5, 15, 1, 3]:
    mf.add(v)
print(mf.median())
mf.add(4)
print(mf.median())

print("=== merge sorted ===")
a = [1, 4, 7]
b = [2, 3, 8]
c = [0, 5, 9]
print(list(heapq.merge(a, b, c)))

print("=== two-heap pattern balance ===")
small = []   # max-heap
large = []   # min-heap
for x in [10, 20, 30, 40]:
    heapq.heappush(small, -x)
    heapq.heappush(large, -heapq.heappop(small))
    if len(large) > len(small):
        heapq.heappush(small, -heapq.heappop(large))
print(len(small), len(large))
print(-small[0], large[0])
