# Candidate Bit manipulation lesson programs — verify exact output on CPython 3.14.

print("=== logical ops ===")
a = 0b1100
b = 0b1010
print(a & b)   # AND -> 0b1000 = 8
print(a | b)   # OR  -> 0b1110 = 14
print(a ^ b)   # XOR -> 0b0110 = 6

print("=== shifts ===")
x = 3
print(x << 2)  # 3 * 4 = 12
print(20 >> 2) # 20 // 4 = 5

print("=== check/set/clear ===")
n = 0b1010
# check bit 1 (value 2): is it set?
print((n >> 1) & 1)
# set bit 0:
print(n | (1 << 0))
# clear bit 3:
print(n & ~(1 << 3))
# toggle bit 1:
print(n ^ (1 << 1))

print("=== XOR cancellation (single number) ===")
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result
print(single_number([4, 1, 2, 1, 2]))

print("=== count set bits ===")
def count_bits(n):
    count = 0
    while n:
        n &= n - 1   # drop the lowest set bit
        count += 1
    return count
print(count_bits(0b1011))
print(bin(13).count("1"))
