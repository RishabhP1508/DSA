import fs from 'node:fs';
import {loadCurriculum} from '../../scripts/lib/load-curriculum.mjs';
import {getPyodide} from '../../scripts/lib/pyodide-harness.mjs';
const c=await loadCurriculum(),py=await getPyodide();
const results=[];
function check(name,ids,probe){const source=ids.map(id=>c.lessons.find(x=>x.id===id).code).join('\n');py.globals.set('__b5_source',source);py.globals.set('__b5_probe',probe);try{py.runPython(`import contextlib,io\n_b5_ns={}\nwith contextlib.redirect_stdout(io.StringIO()):\n exec(__b5_source,_b5_ns)\n exec(__b5_probe,_b5_ns)`);results.push({name,ok:true});console.log('PASS',name);}catch(e){results.push({name,ok:false,error:String(e)});console.log('FAIL',name,String(e));}}
check('range sum oracle: sizes 0..9, all valid ranges, all point changes',['fenwick-tree','segment-tree'],`
for n in range(10):
 a=[(i*7+n)%11-5 for i in range(n)]
 f=Fenwick(n)
 for i,v in enumerate(a,1): f.update(i,v)
 s=SegTree(a)
 for lo in range(n+1):
  for hi in range(lo,n+1):
   assert s.query(lo,hi)==sum(a[lo:hi])
   assert f.range_sum(lo+1,hi)==sum(a[lo:hi])
 for i in range(n):
  f.update(i+1,-3)
  s.update(i,a[i]-3)
  a[i]-=3
  for p in range(n+1):
   assert f.prefix(p)==sum(a[:p])
   assert s.query(0,p)==sum(a[:p])
 for op in [lambda:f.update(0,1),lambda:f.update(-1,1),lambda:f.prefix(n+1),lambda:s.update(-1,1),lambda:s.query(-1,n)]:
  try: op()
  except (IndexError,ValueError): pass
  else: raise AssertionError('invalid range/index accepted')
 if n:
  try:s.query(n,0)
  except IndexError:pass
  else:raise AssertionError('reversed half-open range accepted')
 else:assert s.query(0,0)==0
`);
const oracle=`
from itertools import combinations
def closure(n,edges):
 r=[[i==j for j in range(n)] for i in range(n)]
 for u,v,*_ in edges: r[u][v]=r[v][u]=True
 for k in range(n):
  for i in range(n):
   for j in range(n): r[i][j]=r[i][j] or (r[i][k] and r[k][j])
 return r
def simple_paths(adj,start,n):
 ans=[float('inf')]*n
 stack=[(start,0,frozenset([start]))]
 while stack:
  u,d,path=stack.pop()
  ans[u]=min(ans[u],d)
  for v,w in adj[u]:
   if v not in path: stack.append((v,d+w,path|{v}))
 return ans
`;
check('64 undirected graphs: independent closure/components, cycle count, exhaustive forest minimum',['connected-components','graph-cycle-detection','prim','kruskal'],oracle+`
pairs=list(combinations(range(4),2))
for mask in range(64):
 edges=[(u,v,(i*3)%7-3) for i,(u,v) in enumerate(pairs) if mask>>i&1]
 reach=closure(4,edges)
 cc=len({tuple(row) for row in reach})
 assert count_components(4,[(u,v) for u,v,w in edges])==cc
 assert has_cycle(4,[(u,v) for u,v,w in edges])==(len(edges)>4-cc)
 best=float('inf')
 for sub in combinations(edges,4-cc):
  if closure(4,sub)==reach: best=min(best,sum(w for u,v,w in sub))
 assert kruskal(4,edges)==best
 adj={i:[] for i in range(4)}
 for u,v,w in edges: adj[u].append((v,w));adj[v].append((u,w))
 if cc==1: assert prim(adj,4)==best
 else:
  try: prim(adj,4)
  except ValueError: pass
  else: raise AssertionError('disconnected Prim')
assert count_components(0,[])==0
assert has_cycle(1,[(0,0)]) is True
assert has_cycle(2,[(0,1),(0,1)]) is True
`);
check('64 weighted DAGs: exhaustive simple-path oracle versus Dijkstra/Bellman/Floyd and dependency order',['dijkstra','bellman-ford','floyd-warshall','topological-sort'],oracle+`
pairs=list(combinations(range(4),2))
for mask in range(64):
 edges=[(u,v,(i*3)%7) for i,(u,v) in enumerate(pairs) if mask>>i&1]
 adj={i:[] for i in range(4)}
 for u,v,w in edges: adj[u].append((v,w))
 fw=floyd_warshall(4,edges)
 for start in range(4):
  truth=simple_paths(adj,start,4)
  assert dijkstra(adj,start,4)==truth
  assert bellman_ford(edges,4,start)==truth
  assert fw[start]==truth
 order=topo_sort(4,[(u,v)for u,v,w in edges])
 assert set(order)==set(range(4))
 pos={v:i for i,v in enumerate(order)}
 assert all(pos[u]<pos[v]for u,v,w in edges)
 negative=[(u,v,w-3)for u,v,w in edges]
 nadj={i:[]for i in range(4)}
 for u,v,w in negative:nadj[u].append((v,w))
 nfw=floyd_warshall(4,negative)
 for start in range(4):
  truth=simple_paths(nadj,start,4)
  assert bellman_ford(negative,4,start)==truth
  assert nfw[start]==truth
assert topo_sort(0,[])==[]
assert floyd_warshall(0,[])==[]
`);
check('BFS/DFS directions, disconnected vertices, duplicate multi-sources, endpoint hop counts',['graph-bfs','graph-dfs','multi-source-bfs','shortest-paths-unweighted'],oracle+`
adj={0:[1],1:[2],2:[],3:[]}
assert bfs(adj,0)==[0,1,2]
assert bfs(adj,2)==[2]
order=[];seen=set();dfs(adj,0,seen,order)
assert order==[0,1,2]and seen=={0,1,2}
order=[];dfs(adj,2,set(),order)
assert order==[2]
order=[];dfs({0:[0,1],1:[0],2:[]},0,set(),order)
assert order==[0,1]
assert nearest_distances([0,0,3,3],adj,4)==[0,1,2,0]
assert nearest_distances([],adj,4)==[-1]*4
assert nearest_distances([],{},0)==[]
assert shortest_path(adj,0,2)==2
assert shortest_path(adj,2,0)==-1
assert shortest_path(adj,0,0)==0
`);
check('496 word/grid cases: independent immutable visited-set oracle and board restoration',['word-search'],`
from itertools import product
def brute(board,word):
 if not word:return True
 def walk(r,c,i,seen):
  if not (0<=r<2 and 0<=c<2)or(r,c)in seen or board[r][c]!=word[i]:return False
  if i+1==len(word):return True
  return any(walk(r+dr,c+dc,i+1,seen|{(r,c)})for dr,dc in [(1,0),(-1,0),(0,1),(0,-1)])
 return any(walk(r,c,0,set())for r in range(2)for c in range(2))
for chars in product('A#',repeat=4):
 board=[list(chars[:2]),list(chars[2:])]
 original=[row[:]for row in board]
 for length in range(5):
  for letters in product('A#',repeat=length):
   word=''.join(letters)
   assert exist(board,word)==brute(board,word),(board,word)
   assert board==original
`);
check('tree traversal orders, height convention, strict sorted construction and BST duplicates',['tree-traversals','tree-height-depth','tree-construction','bst-operations'],`
for n in range(10):
 a=list(range(n))
 t=build_bst(a)
 out=[];inorder(t,out)
 assert out==a
 def shape(t):
  if t is None:return 0
  l=shape(t.left);r=shape(t.right)
  assert abs(l-r)<=1
  return 1+max(l,r)
 assert height(t)==shape(t)
 assert all(search(t,v)for v in a)
 assert search(t,-1) is False
t=None
for v in [2,2,1,3,2]:t=insert(t,v)
out=[];inorder(t,out)
assert out==[1,2,2,2,3]
assert t.right.val==2
assert height(None)==0 and height(TreeNode(0))==1
`);
check('trie empty-word/prefix and duplicate storage; Unicode paths',['trie-insertion'],`
t=Trie()
assert t.search('') is False
t.insert('');t.insert('é#');t.insert('é#')
assert t.search('') is True
assert t.search('é#') is True
assert t.search('é') is False
`);
check('prefix counts versus immutable word-set oracle',['prefix-search'],`
t=Trie()
words=['','app','apple','é#','é','app']
for w in words:t.insert(w)
for p in ['','a','app','apple','apples','é','#']:
 assert t.count_with_prefix(p)==sum(w.startswith(p)for w in set(words))
 assert t.starts_with(p)==(p=='' or any(w.startswith(p)for w in words))
`);
check('LCA target/self conventions and absent-target precondition counterexample',['lowest-common-ancestor'],`
assert lca_bst(root,2,4)==3
assert lca_bst(root,3,4)==3
assert lca_bst(root,7,7)==7
assert lca_bst(root,2,9)==5
# 6 is absent: a returned split point does not validate membership.
assert lca_bst(root,2,6)==5
`);
check('AVL rotation transfers the middle subtree and repairs cached heights bottom-up',['avl-rotations'],`
def node(v,l=None,r=None):
 n=AVLNode(v);n.left=l;n.right=r;n.height=1+max(h(l),h(r));return n
def ino(n):return []if n is None else ino(n.left)+[n.val]+ino(n.right)
def verify(n):
 if n is None:return 0
 a=verify(n.left);b=verify(n.right)
 assert n.height==1+max(a,b)
 return n.height
for middle in [None,node(3)]:
 y=node(4,node(2,node(1),middle),node(5))
 before=ino(y)
 z=rotate_right(y)
 assert ino(z)==before
 assert z.right is y and y.left is middle
 verify(z)
`);
check('path halving and rank forest invariants',['union-find'],`
u=UnionFind(12)
for i in range(0,12,2):assert u.union(i,i+1)
for i in range(2,12,2):assert u.union(0,i)
assert u.count==1
for i in range(12):assert u.find(i)==u.find(0)
assert u.union(1,11) is False
assert u.count==1
assert all(u.rank[p]>=u.rank[i]for i,p in enumerate(u.parent))
`);
fs.writeFileSync(new URL('./codex-b5-oracle-results.json',import.meta.url),JSON.stringify(results,null,2));
if(results.some(r=>!r.ok))process.exitCode=1;
