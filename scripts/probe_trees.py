# Candidate Trees & tries lesson programs — verify exact output on CPython 3.14.
from collections import deque

class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# build:      5
#           /   \
#          3     8
#         / \   / \
#        2   4 7   9
root = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)),
                   TreeNode(8, TreeNode(7), TreeNode(9)))

print("=== DFS (recursive preorder) ===")
def dfs(node, out):
    if node is None:
        return
    out.append(node.val)
    dfs(node.left, out)
    dfs(node.right, out)
o = []
dfs(root, o)
print(o)

print("=== BFS / level order ===")
def level_order(root):
    if not root:
        return []
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        out.append(node.val)
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return out
print(level_order(root))

print("=== traversals pre/in/post ===")
def preorder(n, out):
    if n:
        out.append(n.val); preorder(n.left, out); preorder(n.right, out)
def inorder(n, out):
    if n:
        inorder(n.left, out); out.append(n.val); inorder(n.right, out)
def postorder(n, out):
    if n:
        postorder(n.left, out); postorder(n.right, out); out.append(n.val)
pre, ino, post = [], [], []
preorder(root, pre); inorder(root, ino); postorder(root, post)
print(pre)
print(ino)
print(post)

print("=== BST insert/search ===")
def bst_insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = bst_insert(root.left, val)
    else:
        root.right = bst_insert(root.right, val)
    return root
def bst_search(root, val):
    while root:
        if val == root.val:
            return True
        root = root.left if val < root.val else root.right
    return False
bst = None
for v in [5, 3, 8, 1, 4]:
    bst = bst_insert(bst, v)
print(bst_search(bst, 4))
print(bst_search(bst, 6))

print("=== height/depth ===")
def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))
print(height(root))

print("=== lowest common ancestor (BST) ===")
def lca_bst(root, p, q):
    while root:
        if p < root.val and q < root.val:
            root = root.left
        elif p > root.val and q > root.val:
            root = root.right
        else:
            return root.val
    return None
print(lca_bst(root, 2, 4))
print(lca_bst(root, 2, 9))

print("=== tree construction from sorted array (balanced BST) ===")
def build_bst(arr):
    if not arr:
        return None
    mid = len(arr) // 2
    return TreeNode(arr[mid], build_bst(arr[:mid]), build_bst(arr[mid+1:]))
b = build_bst([1, 2, 3, 4, 5, 6, 7])
print(b.val, b.left.val, b.right.val)

print("=== trie insertion + prefix search ===")
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False
class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True
    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word
    def starts_with(self, prefix):
        return self._walk(prefix) is not None
    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
t = Trie()
for w in ["cat", "car", "care"]:
    t.insert(w)
print(t.search("car"))
print(t.search("ca"))
print(t.starts_with("ca"))
print(t.starts_with("dog"))

print("=== word search (grid DFS backtracking) ===")
def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:
            return False
        tmp = board[r][c]
        board[r][c] = "#"
        found = (dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or
                 dfs(r, c+1, i+1) or dfs(r, c-1, i+1))
        board[r][c] = tmp
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False
board = [["A","B","C"],["S","F","E"],["A","D","E"]]
print(exist(board, "ABF"))
print(exist(board, "ABX"))

print("=== AVL rotation (right rotation) ===")
class AVLNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1
def h(n):
    return n.height if n else 0
def rotate_right(y):
    x = y.left
    t = x.right
    x.right = y
    y.left = t
    y.height = 1 + max(h(y.left), h(y.right))
    x.height = 1 + max(h(x.left), h(x.right))
    return x
# Build a right-heavy-left chain 3<-2<-1 then rotate
z = AVLNode(3); z.left = AVLNode(2); z.left.left = AVLNode(1)
z.height = 3; z.left.height = 2
new_root = rotate_right(z)
print(new_root.val, new_root.left.val, new_root.right.val)
