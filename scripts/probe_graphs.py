# Candidate Graphs lesson programs — verify exact output on CPython 3.14.
from collections import deque, defaultdict
import heapq

print("=== representations ===")
edges = [(0, 1), (0, 2), (1, 2)]
adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)
print(dict(adj))
# adjacency matrix
n = 3
mat = [[0] * n for _ in range(n)]
for u, v in edges:
    mat[u][v] = 1
    mat[v][u] = 1
print(mat)

print("=== BFS ===")
def bfs(adj, start):
    seen = {start}
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            if nb not in seen:
                seen.add(nb)
                q.append(nb)
    return order
g = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}
print(bfs(g, 0))

print("=== DFS ===")
def dfs(adj, node, seen, order):
    seen.add(node)
    order.append(node)
    for nb in adj[node]:
        if nb not in seen:
            dfs(adj, nb, seen, order)
o = []
dfs(g, 0, set(), o)
print(o)

print("=== connected components ===")
def count_components(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = set()
    count = 0
    for start in range(n):
        if start not in seen:
            count += 1
            stack = [start]
            seen.add(start)
            while stack:
                node = stack.pop()
                for nb in adj[node]:
                    if nb not in seen:
                        seen.add(nb)
                        stack.append(nb)
    return count
print(count_components(5, [(0, 1), (1, 2), (3, 4)]))

print("=== cycle detection (undirected) ===")
def has_cycle(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    seen = set()
    def dfs(node, parent):
        seen.add(node)
        for nb in adj[node]:
            if nb not in seen:
                if dfs(nb, node):
                    return True
            elif nb != parent:
                return True
        return False
    for s in range(n):
        if s not in seen:
            if dfs(s, -1):
                return True
    return False
print(has_cycle(3, [(0, 1), (1, 2), (2, 0)]))
print(has_cycle(3, [(0, 1), (1, 2)]))

print("=== topological sort (Kahn) ===")
def topo_sort(n, edges):
    adj = defaultdict(list)
    indeg = [0] * n
    for u, v in edges:
        adj[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            indeg[nb] -= 1
            if indeg[nb] == 0:
                q.append(nb)
    return order
print(topo_sort(6, [(5, 2), (5, 0), (4, 0), (4, 1), (2, 3), (3, 1)]))

print("=== multi-source BFS ===")
def nearest_distances(grid_sources, n):
    dist = [-1] * n
    q = deque()
    for s in grid_sources:
        dist[s] = 0
        q.append(s)
    adj = {0: [1], 1: [0, 2], 2: [1, 3], 3: [2, 4], 4: [3]}
    while q:
        node = q.popleft()
        for nb in adj[node]:
            if dist[nb] == -1:
                dist[nb] = dist[node] + 1
                q.append(nb)
    return dist
print(nearest_distances([0, 4], 5))
