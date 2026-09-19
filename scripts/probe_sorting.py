# Candidate Sorting lesson programs — verify exact output on CPython 3.14.

print("=== bubble ===")
def bubble_sort(a):
    a = a[:]
    n = len(a)
    for i in range(n):
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a
print(bubble_sort([5, 1, 4, 2, 8]))

print("=== selection ===")
def selection_sort(a):
    a = a[:]
    n = len(a)
    for i in range(n):
        m = i
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]
    return a
print(selection_sort([5, 1, 4, 2, 8]))

print("=== insertion ===")
def insertion_sort(a):
    a = a[:]
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
print(insertion_sort([5, 1, 4, 2, 8]))

print("=== merge ===")
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged
print(merge_sort([5, 1, 4, 2, 8, 3]))

print("=== quick ===")
def quick_sort(a):
    if len(a) <= 1:
        return a
    pivot = a[len(a) // 2]
    less = [x for x in a if x < pivot]
    equal = [x for x in a if x == pivot]
    greater = [x for x in a if x > pivot]
    return quick_sort(less) + equal + quick_sort(greater)
print(quick_sort([5, 1, 4, 2, 8, 3]))

print("=== counting ===")
def counting_sort(a):
    if not a:
        return []
    hi = max(a)
    counts = [0] * (hi + 1)
    for x in a:
        counts[x] += 1
    out = []
    for v in range(hi + 1):
        out.extend([v] * counts[v])
    return out
print(counting_sort([3, 1, 4, 1, 5, 2, 3]))

print("=== bucket ===")
def bucket_sort(a, k=5):
    if not a:
        return []
    buckets = [[] for _ in range(k)]
    hi = max(a) + 1
    for x in a:
        idx = x * k // hi
        buckets[idx].append(x)
    out = []
    for b in buckets:
        out.extend(sorted(b))
    return out
print(bucket_sort([29, 25, 3, 49, 9, 37, 21, 43]))

print("=== heap sort via heapq ===")
import heapq
def heap_sort(a):
    h = a[:]
    heapq.heapify(h)
    return [heapq.heappop(h) for _ in range(len(h))]
print(heap_sort([5, 1, 4, 2, 8, 3]))

print("=== radix ===")
def radix_sort(a):
    if not a:
        return []
    out = a[:]
    exp = 1
    hi = max(out)
    while hi // exp > 0:
        buckets = [[] for _ in range(10)]
        for x in out:
            buckets[(x // exp) % 10].append(x)
        out = []
        for b in buckets:
            out.extend(b)
        exp *= 10
    return out
print(radix_sort([170, 45, 75, 90, 2, 802, 24, 66]))

print("=== comparators ===")
words = ["bb", "a", "ccc", "dd"]
print(sorted(words, key=len))
nums = [3, 1, 2]
print(sorted(nums, reverse=True))

print("=== interval sorting ===")
intervals = [[3, 4], [1, 2], [2, 5]]
print(sorted(intervals, key=lambda iv: iv[0]))
