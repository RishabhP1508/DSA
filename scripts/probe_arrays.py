# Candidate Arrays lesson programs — verify exact output on CPython 3.14.

print("=== traversal ===")
nums = [5, 2, 9, 1]
for i in range(len(nums)):
    print(i, nums[i])

print("=== two pointers (reverse in place) ===")
arr = [1, 2, 3, 4, 5]
lo = 0
hi = len(arr) - 1
while lo < hi:
    arr[lo], arr[hi] = arr[hi], arr[lo]
    lo = lo + 1
    hi = hi - 1
print(arr)

print("=== sliding window (max sum of k) ===")
nums = [2, 1, 5, 1, 3, 2]
k = 3
window = sum(nums[:k])
best = window
for i in range(k, len(nums)):
    window = window + nums[i] - nums[i - k]
    if window > best:
        best = window
print(best)

print("=== prefix sums ===")
nums = [3, 1, 4, 1, 5]
prefix = [0]
for x in nums:
    prefix.append(prefix[-1] + x)
# sum of nums[1:4] = 1+4+1 = 6
print(prefix)
print(prefix[4] - prefix[1])

print("=== kadane ===")
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
best = nums[0]
current = nums[0]
for i in range(1, len(nums)):
    current = max(nums[i], current + nums[i])
    if current > best:
        best = current
print(best)

print("=== in-place move zeros ===")
nums = [0, 1, 0, 3, 12]
insert = 0
for i in range(len(nums)):
    if nums[i] != 0:
        nums[insert] = nums[i]
        insert = insert + 1
while insert < len(nums):
    nums[insert] = 0
    insert = insert + 1
print(nums)

print("=== matrix traversal ===")
grid = [[1, 2, 3], [4, 5, 6]]
for r in range(len(grid)):
    for c in range(len(grid[r])):
        print(grid[r][c], end=" ")
print()

print("=== intervals merge ===")
intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
intervals.sort()
merged = [intervals[0]]
for start, end in intervals[1:]:
    if start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])
print(merged)
