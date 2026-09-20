# Candidate Linked-list lesson programs — verify exact output on CPython 3.14.
# Each block mirrors a lesson's `code`; capture stdout precisely.
from collections import deque


class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt


def build(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head


def to_list(head):
    out = []
    while head is not None:
        out.append(head.val)
        head = head.next
    return out


print("=== slow-fast (middle via two speeds) ===")
def middle_slow_fast(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow
h = build([1, 2, 3, 4, 5])
print(middle_slow_fast(h).val)
h2 = build([1, 2, 3, 4])
print(middle_slow_fast(h2).val)

print("=== cycle detection (Floyd) ===")
def has_cycle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
a = Node(1); b = Node(2); c = Node(3); d = Node(4)
a.next = b; b.next = c; c.next = d
print(has_cycle(a))
d.next = b  # create a cycle back to node 2
print(has_cycle(a))

print("=== cycle start (Floyd phase 2) ===")
def cycle_start(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            p = head
            while p is not slow:
                p = p.next
                slow = slow.next
            return p
    return None
print(cycle_start(a).val)

print("=== reversal (iterative) ===")
def reverse(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
r = reverse(build([1, 2, 3, 4, 5]))
print(to_list(r))

print("=== merging two sorted lists (dummy head) ===")
def merge(a, b):
    dummy = Node(0)
    tail = dummy
    while a is not None and b is not None:
        if a.val <= b.val:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    tail.next = a if a is not None else b
    return dummy.next
m = merge(build([1, 3, 5]), build([2, 4, 6]))
print(to_list(m))

print("=== finding the middle (return value) ===")
la = build([10, 20, 30, 40, 50])
print(middle_slow_fast(la).val)

print("=== dummy node: remove all matching values ===")
def remove_all(head, target):
    dummy = Node(0, head)
    prev = dummy
    curr = head
    while curr is not None:
        if curr.val == target:
            prev.next = curr.next
        else:
            prev = curr
        curr = curr.next
    return dummy.next
rr = remove_all(build([1, 2, 6, 3, 6, 6, 4]), 6)
print(to_list(rr))

print("=== pointer manipulation: swap adjacent pairs ===")
def swap_pairs(head):
    dummy = Node(0, head)
    prev = dummy
    while prev.next is not None and prev.next.next is not None:
        first = prev.next
        second = first.next
        first.next = second.next
        second.next = first
        prev.next = second
        prev = first
    return dummy.next
sp = swap_pairs(build([1, 2, 3, 4]))
print(to_list(sp))
sp2 = swap_pairs(build([1, 2, 3, 4, 5]))
print(to_list(sp2))

print("=== variants: doubly linked list traversal both ways ===")
class DNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
def build_doubly(values):
    head = None
    tail = None
    for v in values:
        node = DNode(v)
        if head is None:
            head = tail = node
        else:
            tail.next = node
            node.prev = tail
            tail = node
    return head, tail
dh, dt = build_doubly([1, 2, 3])
fwd = []
n = dh
while n is not None:
    fwd.append(n.val)
    n = n.next
print(fwd)
bwd = []
n = dt
while n is not None:
    bwd.append(n.val)
    n = n.prev
print(bwd)

print("=== variants: circular list one full loop ===")
def build_circular(values):
    head = build(values)
    tail = head
    while tail.next is not None:
        tail = tail.next
    tail.next = head
    return head
ch = build_circular([7, 8, 9])
out = []
node = ch
for _ in range(len(out) + 6):  # walk 6 steps around the 3-node ring
    out.append(node.val)
    node = node.next
print(out)

print("=== deque: both-ends operations ===")
dq = deque()
dq.append(1)
dq.append(2)
dq.appendleft(0)
print(list(dq))
print(dq.popleft())
print(dq.pop())
print(list(dq))
