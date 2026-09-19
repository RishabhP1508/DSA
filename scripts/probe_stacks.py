# Candidate Stacks & queues lesson programs — verify exact output on CPython 3.14.

print("=== stack ops ===")
stack = []
stack.append(1)
stack.append(2)
stack.append(3)
print(stack)
print(stack.pop())
print(stack)

print("=== queue ops (deque) ===")
from collections import deque
q = deque()
q.append(1)
q.append(2)
q.append(3)
print(q.popleft())
print(list(q))

print("=== monotonic stack (next greater) ===")
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []  # indices, values decreasing
    for i in range(len(nums)):
        while stack and nums[stack[-1]] < nums[i]:
            j = stack.pop()
            res[j] = nums[i]
        stack.append(i)
    return res
print(next_greater([2, 1, 2, 4, 3]))

print("=== parentheses matching ===")
def valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
print(valid("([]{})"))
print(valid("(]"))

print("=== expression evaluation (RPN) ===")
def eval_rpn(tokens):
    stack = []
    for t in tokens:
        if t in ("+", "-", "*", "/"):
            b = stack.pop()
            a = stack.pop()
            if t == "+": stack.append(a + b)
            elif t == "-": stack.append(a - b)
            elif t == "*": stack.append(a * b)
            else: stack.append(int(a / b))
        else:
            stack.append(int(t))
    return stack[0]
print(eval_rpn(["2", "1", "+", "3", "*"]))

print("=== BFS queue (levels) ===")
from collections import deque
def bfs_levels(graph, start):
    visited = {start}
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in graph[node]:
            if nb not in visited:
                visited.add(nb)
                q.append(nb)
    return order
g = {0: [1, 2], 1: [3], 2: [3], 3: []}
print(bfs_levels(g, 0))

print("=== min tracking stack ===")
class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []
    def push(self, x):
        self.stack.append(x)
        m = x if not self.mins else min(x, self.mins[-1])
        self.mins.append(m)
    def pop(self):
        self.mins.pop()
        return self.stack.pop()
    def get_min(self):
        return self.mins[-1]
ms = MinStack()
ms.push(3); ms.push(1); ms.push(2)
print(ms.get_min())
ms.pop(); ms.pop()
print(ms.get_min())
