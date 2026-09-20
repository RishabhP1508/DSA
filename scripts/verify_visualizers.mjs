/**
/**
 * Trace-driven verification that each structure family produces the object
 * shapes the visualizers read. Runs the SAME tracer.py against the SAME bundled
 * Pyodide the browser uses, then asserts the last event exposes the expected
 * fields/entries.
 *
 * NOTE: this checks the trace object SHAPE, not the rendered SVG. Real rendering
 * is covered by the Playwright suite (npm run test:browser). Cross-platform:
 * uses file-URL imports via the shared harness.
 *
 * Run:  node scripts/verify_visualizers.mjs
 */
import { runProgram } from "./lib/pyodide-harness.mjs";

async function run(src) {
  return runProgram(src, "");
}

function localsOf(ev) {
  const m = {};
  for (const f of ev.frames) for (const l of f.locals) m[l.name] = l.value;
  return m;
}
function obj(ev, ref) {
  return ref && ref.kind === "ref" ? ev.objects[ref.id] : undefined;
}

let failures = 0;
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    console.log(`  ✗ ${name} — ${detail}`);
    failures++;
  }
}

// --- linked list ---
{
  const res = await run(`class Node:
    def __init__(self, v, n=None):
        self.val = v
        self.next = n
head = Node(1, Node(2, Node(3)))
`);
  const ev = res.events.at(-1);
  const head = obj(ev, localsOf(ev).head);
  const nextRef = head?.entries?.find((e) => e.key === "next")?.value;
  const second = obj(ev, nextRef);
  check("linked-list: head has val+next", head?.entries?.some((e) => e.key === "val") && !!nextRef, JSON.stringify(head));
  check("linked-list: next resolves to a Node", second?.type === "Node", JSON.stringify(second));
}

// --- tree ---
{
  const res = await run(`class T:
    def __init__(self, v, l=None, r=None):
        self.val = v; self.left = l; self.right = r
root = T(5, T(3), T(8))
`);
  const ev = res.events.at(-1);
  const root = obj(ev, localsOf(ev).root);
  const left = obj(ev, root?.entries?.find((e) => e.key === "left")?.value);
  check("tree: root has val/left/right", ["val", "left", "right"].every((k) => root?.entries?.some((e) => e.key === k)), JSON.stringify(root));
  check("tree: left child is a node with val 3", left?.entries?.find((e) => e.key === "val")?.value?.value === 3, JSON.stringify(left));
}

// --- heap (0-based list) ---
{
  const res = await run(`import heapq
h = [5,3,8,1]
heapq.heapify(h)
`);
  const ev = res.events.at(-1);
  const h = obj(ev, localsOf(ev).h);
  check("heap: is a list", h?.type === "list", JSON.stringify(h));
  check("heap: min at index 0 after heapify", h?.entries?.[0]?.value?.value === 1, JSON.stringify(h?.entries?.[0]));
  check("heap: object table stays small (opaque module skipped)", Object.keys(ev.objects).length <= 3, `objects=${Object.keys(ev.objects).length}`);
}

// --- graph adjacency ---
{
  const res = await run(`g = {0:[1,2], 1:[2], 2:[0]}
visited = set()
`);
  const ev = res.events.at(-1);
  const g = obj(ev, localsOf(ev).g);
  const n0 = obj(ev, g?.entries?.find((e) => e.key === "0")?.value);
  check("graph: adjacency is dict", g?.type === "dict", JSON.stringify(g?.type));
  check("graph: node 0 neighbours [1,2]", n0?.entries?.map((e) => e.value.value).join(",") === "1,2", JSON.stringify(n0));
}

// --- dp 2D ---
{
  const res = await run(`dp = [[0,0,0],[0,0,0]]
dp[1][2] = 5
`);
  const ev = res.events.at(-1);
  const dp = obj(ev, localsOf(ev).dp);
  const row1 = obj(ev, dp?.entries?.[1]?.value);
  check("dp: outer is list of 2 rows", dp?.entries?.length === 2, JSON.stringify(dp?.entries?.length));
  check("dp: dp[1][2] == 5", row1?.entries?.[2]?.value?.value === 5, JSON.stringify(row1));
}

// --- bits (int) ---
{
  const res = await run(`x = 0
x = x | (1 << 3)
`);
  const ev = res.events.at(-1);
  check("bits: x is int 8", localsOf(ev).x?.kind === "int" && localsOf(ev).x?.value === 8, JSON.stringify(localsOf(ev).x));
}

// --- trie ---
{
  const res = await run(`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
root = TrieNode()
root.children["a"] = TrieNode()
root.children["a"].is_end = True
`);
  const ev = res.events.at(-1);
  const root = obj(ev, localsOf(ev).root);
  const children = obj(ev, root?.entries?.find((e) => e.key === "children")?.value);
  const childA = obj(ev, children?.entries?.find((e) => e.key === "a")?.value);
  check("trie: root has children dict", children?.type === "dict", JSON.stringify(children?.type));
  check("trie: child 'a' is terminal", childA?.entries?.find((e) => e.key === "is_end")?.value?.value === true, JSON.stringify(childA));
}

console.log(failures === 0 ? "\nALL VISUALIZER SHAPES OK" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
