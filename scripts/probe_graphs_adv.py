# Candidate advanced Graphs lesson programs — verify exact output on CPython 3.14.
import heapq

print("=== union-find ===")
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        self.count -= 1
        return True
uf = UnionFind(5)
uf.union(0, 1)
uf.union(1, 2)
uf.union(3, 4)
print(uf.count)
print(uf.find(0) == uf.find(2))
print(uf.find(0) == uf.find(3))

print("=== dijkstra ===")
def dijkstra(adj, start, n):
    dist = [float("inf")] * n
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist[node]:
            continue
        for nb, w in adj[node]:
            nd = d + w
            if nd < dist[nb]:
                dist[nb] = nd
                heapq.heappush(pq, (nd, nb))
    return dist
adj = {0: [(1, 4), (2, 1)], 1: [(3, 1)], 2: [(1, 2), (3, 5)], 3: []}
print(dijkstra(adj, 0, 4))

print("=== bellman-ford ===")
def bellman_ford(edges, n, start):
    dist = [float("inf")] * n
    dist[start] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist
edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)]
print(bellman_ford(edges, 4, 0))

print("=== floyd-warshall ===")
def floyd_warshall(n, edges):
    INF = float("inf")
    d = [[INF] * n for _ in range(n)]
    for i in range(n):
        d[i][i] = 0
    for u, v, w in edges:
        d[u][v] = min(d[u][v], w)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return d
fw = floyd_warshall(4, [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)])
print(fw[0])

print("=== prim MST ===")
def prim(adj, n):
    visited = [False] * n
    pq = [(0, 0)]  # (weight, node)
    total = 0
    count = 0
    while pq and count < n:
        w, node = heapq.heappop(pq)
        if visited[node]:
            continue
        visited[node] = True
        total += w
        count += 1
        for nb, w2 in adj[node]:
            if not visited[nb]:
                heapq.heappush(pq, (w2, nb))
    return total
adj2 = {0: [(1, 4), (2, 1)], 1: [(0, 4), (2, 2), (3, 1)], 2: [(0, 1), (1, 2), (3, 5)], 3: [(1, 1), (2, 5)]}
print(prim(adj2, 4))

print("=== kruskal MST ===")
def kruskal(n, edges):
    edges = sorted(edges, key=lambda e: e[2])
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    total = 0
    for u, v, w in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            total += w
    return total
print(kruskal(4, [(0, 1, 4), (0, 2, 1), (1, 2, 2), (1, 3, 1), (2, 3, 5)]))
