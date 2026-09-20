# Candidate Hashing lesson programs — verify exact output on CPython 3.14.

print("=== maps and sets ===")
m = {"a": 1, "b": 2}
m["c"] = 3
print(m["b"])
print("a" in m)
s = set()
s.add(5); s.add(5); s.add(7)
print(len(s))
print(5 in s)

print("=== duplicate detection ===")
def has_dup(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
print(has_dup([1, 2, 3, 2]))
print(has_dup([1, 2, 3]))

print("=== value to index (two sum) ===")
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return []
print(two_sum([2, 7, 11, 15], 9))

print("=== grouping (anagrams) ===")
def group_anagrams(words):
    groups = {}
    for w in words:
        key = "".join(sorted(w))
        groups.setdefault(key, []).append(w)
    return list(groups.values())
print(group_anagrams(["eat", "tea", "tan", "ate", "nat"]))

print("=== prefix sums with map (subarray sum = k) ===")
def subarray_sum(nums, k):
    count = 0
    prefix = 0
    seen = {0: 1}
    for x in nums:
        prefix += x
        count += seen.get(prefix - k, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return count
print(subarray_sum([1, 1, 1], 2))
print(subarray_sum([1, -1, 0], 0))

print("=== caching seen (fib memo) ===")
def fib(n, memo={}):
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
print(fib(10))
