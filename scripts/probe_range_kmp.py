# Candidate Fenwick / Segment tree / KMP lesson programs — verify on CPython 3.14.

print("=== Fenwick (BIT): prefix sums with point updates ===")
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)   # 1-indexed
    def update(self, i, delta):     # add delta at position i (1-indexed)
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)           # move to the next node that covers i
    def prefix(self, i):            # sum of [1..i]
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= i & (-i)           # strip the lowest set bit
        return s
    def range_sum(self, lo, hi):    # sum of [lo..hi]
        return self.prefix(hi) - self.prefix(lo - 1)

vals = [3, 2, -1, 6, 5, 4]
bit = Fenwick(len(vals))
for idx, v in enumerate(vals, start=1):
    bit.update(idx, v)
print(bit.prefix(4))       # 3+2-1+6 = 10
print(bit.range_sum(2, 5)) # 2-1+6+5 = 12
bit.update(3, 4)           # vals[3] becomes -1+4 = 3
print(bit.range_sum(2, 5)) # 2+3+6+5 = 16

print("=== Segment tree: range sum with point update ===")
class SegTree:
    def __init__(self, data):
        self.n = len(data)
        self.tree = [0] * (2 * self.n)
        for i in range(self.n):            # leaves in the second half
            self.tree[self.n + i] = data[i]
        for i in range(self.n - 1, 0, -1): # internal nodes = sum of children
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
    def update(self, i, value):            # set position i to value
        i += self.n
        self.tree[i] = value
        i //= 2
        while i >= 1:
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]
            i //= 2
    def query(self, lo, hi):               # sum of [lo, hi)
        res = 0
        lo += self.n
        hi += self.n
        while lo < hi:
            if lo & 1:
                res += self.tree[lo]
                lo += 1
            if hi & 1:
                hi -= 1
                res += self.tree[hi]
            lo //= 2
            hi //= 2
        return res

st = SegTree([3, 2, -1, 6, 5, 4])
print(st.query(0, 4))   # 3+2-1+6 = 10
print(st.query(1, 5))   # 2-1+6+5 = 12
st.update(2, 3)         # index 2 becomes 3
print(st.query(1, 5))   # 2+3+6+5 = 16

print("=== KMP string matching ===")
def build_lps(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]   # fall back, don't restart
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    if not pattern:
        return []
    lps = build_lps(pattern)
    res = []
    i = j = 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                res.append(i - j)
                j = lps[j - 1]
        elif j > 0:
            j = lps[j - 1]
        else:
            i += 1
    return res

print(build_lps("ababaca"))
print(kmp_search("ababcabcabababd", "ababd"))
print(kmp_search("aaaaa", "aa"))
