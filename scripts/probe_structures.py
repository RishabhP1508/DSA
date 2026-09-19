import sys, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "src", "engine"))
import tracer

def show(label, src, stdin=""):
    res = tracer.run_program(src, "<lesson>", 10000, 16*1024*1024, stdin)
    last = res["events"][-1]
    print("====", label, "status", res["status"], "====")
    # print local -> value kind, and object shapes referenced
    top = last["frames"][-1]
    for l in top["locals"]:
        print("  local", l["name"], "=", json.dumps(l["value"]))
    print("  objects:")
    for oid, ob in last["objects"].items():
        if ob is None:
            continue
        brief = {"type": ob["type"]}
        if "entries" in ob:
            brief["entries"] = [(e["key"], e["value"].get("kind")) for e in ob["entries"]]
        if "repr" in ob:
            brief["repr"] = ob["repr"]
        print("    ", oid, brief)

# Linked list
show("linked_list", '''
class Node:
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt
c = Node(3)
b = Node(2, c)
a = Node(1, b)
head = a
''')

# Binary tree
show("tree", '''
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
root = TreeNode(5, TreeNode(3), TreeNode(8))
''')

# Dict / set
show("dict_set", '''
counts = {"a": 1, "b": 2}
seen = {1, 2, 3}
''')

# Heap via heapq
show("heap", '''
import heapq
h = [5, 3, 8, 1]
heapq.heapify(h)
heapq.heappush(h, 2)
''')

# Graph adjacency list
show("graph", '''
g = {0: [1, 2], 1: [2], 2: [0]}
visited = set()
''')
