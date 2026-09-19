# Candidate lesson programs — verify exact output on CPython 3.14.

print("=== conditions ===")
temp = 30
if temp >= 30:
    label = "hot"
elif temp >= 20:
    label = "warm"
else:
    label = "cold"
print(label)

print("=== loops ===")
nums = [4, 8, 15]
total = 0
for x in nums:
    total = total + x
print(total)
i = 0
while i < 3:
    print(i)
    i = i + 1

print("=== functions/scope ===")
def add(a, b):
    result = a + b
    return result
answer = add(2, 5)
print(answer)

print("=== expressions ===")
x = 2 + 3 * 4
y = (2 + 3) * 4
z = 17 % 5
print(x, y, z)
print(7 // 2, 2 ** 5, 10 / 4)
