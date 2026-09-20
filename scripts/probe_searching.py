# Candidate Searching lesson programs — verify exact output on CPython 3.14.

print("=== linear search ===")
def linear_search(nums, target):
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1
print(linear_search([5, 3, 8, 1], 8))
print(linear_search([5, 3, 8, 1], 9))

print("=== binary search ===")
def binary_search(nums, target):
    lo = 0
    hi = len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
print(binary_search([1, 3, 5, 7, 9, 11], 7))
print(binary_search([1, 3, 5, 7, 9, 11], 4))

print("=== binary search on answer (min eating speed style, simplified) ===")
def min_capacity(weights, days):
    def can_ship(cap):
        d = 1
        cur = 0
        for w in weights:
            if cur + w > cap:
                d += 1
                cur = 0
            cur += w
        return d <= days
    lo = max(weights)
    hi = sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_ship(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
print(min_capacity([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))

print("=== rotated array search ===")
def search_rotated(nums, target):
    lo = 0
    hi = len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
print(search_rotated([4, 5, 6, 7, 0, 1, 2], 0))
print(search_rotated([4, 5, 6, 7, 0, 1, 2], 3))

print("=== lower/upper bounds via bisect ===")
import bisect
nums = [1, 2, 2, 2, 3, 5]
print(bisect.bisect_left(nums, 2))
print(bisect.bisect_right(nums, 2))

print("=== matrix search ===")
def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    rows = len(matrix)
    cols = len(matrix[0])
    lo = 0
    hi = rows * cols - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        val = matrix[mid // cols][mid % cols]
        if val == target:
            return True
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False
print(search_matrix([[1, 3, 5], [7, 9, 11], [13, 15, 17]], 9))
print(search_matrix([[1, 3, 5], [7, 9, 11], [13, 15, 17]], 8))
