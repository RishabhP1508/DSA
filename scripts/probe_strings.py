# Candidate Strings lesson programs — verify exact output on CPython 3.14.

print("=== frequency ===")
s = "banana"
freq = {}
for ch in s:
    freq[ch] = freq.get(ch, 0) + 1
print(freq)

print("=== two pointers palindrome ===")
s = "racecar"
lo = 0
hi = len(s) - 1
is_pal = True
while lo < hi:
    if s[lo] != s[hi]:
        is_pal = False
        break
    lo = lo + 1
    hi = hi - 1
print(is_pal)

print("=== sliding window longest unique ===")
s = "abcabcbb"
seen = {}
start = 0
best = 0
for i in range(len(s)):
    ch = s[i]
    if ch in seen and seen[ch] >= start:
        start = seen[ch] + 1
    seen[ch] = i
    length = i - start + 1
    if length > best:
        best = length
print(best)

print("=== parsing ===")
line = "12,7,5,20"
parts = line.split(",")
nums = [int(p) for p in parts]
print(parts)
print(sum(nums))

print("=== palindrome check simple ===")
s = "hello"
print(s == s[::-1])

print("=== anagrams ===")
a = "listen"
b = "silent"
print(sorted(a) == sorted(b))

print("=== substrings ===")
s = "abc"
subs = []
for i in range(len(s)):
    for j in range(i + 1, len(s) + 1):
        subs.append(s[i:j])
print(subs)
