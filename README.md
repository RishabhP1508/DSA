# DSA Visual Lab

DSA Visual Lab teaches Python, data structures, algorithms and problem-solving
patterns in a local browser app. It starts with variables and loops, then moves
through core and advanced DSA. Lessons use plain explanations, original exercises
and diagrams built from actual Python execution states.

Version 1.0.1 contains 133 lessons, 29 pattern guides and 393 exercises. The
offline Windows package includes the app, Python runtime, portable Node, source
code and dependency notices. No account, API key or AI service is required.

## Run the Windows package

Download [DSA-Visual-Lab-1.0.1-Windows-x64.zip](https://github.com/RishabhP1508/DSA/releases/download/v1.0.1/DSA-Visual-Lab-1.0.1-Windows-x64.zip)
from [GitHub Releases](https://github.com/RishabhP1508/DSA/releases/latest):

1. Extract the entire ZIP to a normal folder. Keep its contents together.
2. Double-click `Start.cmd` inside the extracted folder.
3. The default browser opens <http://127.0.0.1:8765>.
4. Double-click `Stop.cmd` when you want to stop the local servers.

A current Windows Chrome or Edge must be installed. The package needs no
installed Node, Python or development tools, and it works without internet
access. The app uses port 8765; its separate Python runner uses port 8766.

Starting the same build again reuses its running instance. If either port is
occupied, the launcher reports the conflict. It does not stop another app or a
different DSA build. If startup fails, read the message in the launcher window
and resolve the named port conflict before restarting.

The named Windows ZIP includes the portable app. GitHub's automatic "Source code"
archives contain the repository and require a development setup. Release assets
also include a `.sha256` checksum. The previous
[1.0.0 delivery record](docs/releases/1.0.0.md) preserves its original checks;
the [UI hierarchy audit](docs/reviews/ui-content-hierarchy.md) records the 1.0.1 changes.

Version 1.0.1 adds numbered reading sections, a page outline, topic-grouped lessons,
separate exercise panels and stacked answer choices. All pages share readable
heading sizes and responsive layouts. Python syntax colors adapt to light and dark
themes; short zoomed windows can scroll through the complete navigation.

## Learn and practice

The home page recommends the next lesson from your prerequisites and saved
progress. You can also browse any topic. Opening a lesson does not mark it
complete.

- Learn introduces the idea, explains the vocabulary and code, and provides
  worked examples, predictions, experiments, exercises and a review.
- Patterns teaches recognition clues, required conditions, a straightforward
  baseline, its repeated work, suitable alternatives and misleading clues.
- Practice includes coding and approach-selection exercises with explained
  feedback. Hints progress from understanding the example to pseudocode, then
  reveal the explained solution. Practice displays at most 20 exercises per page.
- Playground runs your own single-file Python programs. It saves named drafts,
  accepts input for `input()`, and imports or exports `.py` files.
- Glossary explains terms used in the lessons. Search finds lessons and patterns;
  `Ctrl+K` opens it.
- Backup exports learning data and restores validated backup files. It can also
  recover the snapshot saved before a restore.

The interface supports keyboard navigation, light and dark themes, reduced
motion and narrow layouts. Lesson workspaces use tabs when there is not enough
space to show the code and diagram together.

## Curriculum

The [coverage inventory](docs/coverage.md) maps all 133 required entries to
lessons, visual examples, exercises and review evidence.

| Area | Topics covered |
|---|---|
| Programming foundations | Values, variables, types, expressions, conditions, loops, functions, scope, input/output, references, mutation, classes and errors |
| DSA foundations | Representations, correctness, time and space complexity, best/average/worst cases and amortized costs |
| Arrays | Traversal, two pointers, sliding windows, prefix sums, Kadane's algorithm, in-place changes, matrices and intervals |
| Strings | Frequency counting, two pointers, windows, parsing, palindromes, anagrams, substrings and KMP |
| Linked lists and deques | Traversal, slow/fast pointers, cycles, reversal, merging, middle nodes, dummy nodes, pointer changes and singly/doubly/circular lists |
| Trees and tries | DFS, BFS, traversals, BSTs, height/depth, lowest common ancestor, construction, trie insertion, prefix search, word search and AVL rotations |
| Stacks and queues | Operations, monotonic stacks, parentheses, expression evaluation, BFS queues and min/max tracking |
| Graphs | Representations, traversal, components, cycles, topological sorting, shortest paths, multi-source BFS, union-find, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim and Kruskal |
| Recursion and dynamic programming | Base cases, backtracking, subsets, permutations, combinations, memoization, tabulation, 1D/2D states, knapsack, subsequences, N-Queens and worked DP problems |
| Heaps | Min/max heaps, sift operations, top-K, kth elements, running median, sorted-data merging, two heaps and cooldown scheduling |
| Hashing | Maps, sets, frequencies, duplicates, value-to-index lookup, grouping, prefix sums with maps and previously seen values |
| Bit manipulation | Logical operators, shifts, checking/setting/clearing bits, XOR cancellation and counting set bits |
| Sorting | Bubble, selection, insertion, merge, quick, counting, bucket, heap and radix sort, custom ordering and interval sorting |
| Searching | Linear search, binary search, searching the answer space, rotated arrays, bounds and matrix search |
| Range queries | Fenwick trees and segment trees |

Pattern guides connect these techniques to problem constraints and correctness
conditions. Worked applications include Task Scheduler and Meeting Rooms II.

All 79 occurrences in the supplied Notion syllabus, representing 75 unique
LeetCode questions, are mapped to teaching content. Another 25 optional questions
are labelled separately. External practice and reference links need internet
access; local lessons, exercises and Python execution do not.

## Watch Python execute

Run a lesson or personal program, then step through its recorded states. The
workspace shows the source line, variables, object references, function frames,
output, errors and the selected diagram. Controls include Play/Pause, Previous,
Next, restart, playback speed, timeline seeking and playback breakpoints.

A highlighted `line` event shows the state before that line executes. Its changes
appear in a later recorded state. Going backward restores a snapshot without
rerunning Python. Breakpoints pause playback of the recorded run; they do not
suspend a live Python process.

Diagrams support arrays, strings, matrices, maps, sets, stacks, queues, linked
structures, trees, tries, heaps, graphs, recursion, DP tables and bits. The
"Visualize as..." controls map custom variables and node fields to diagrams.
Unrecognized objects remain available in the inspector. Large values and
diagrams identify omitted data.

Built-in operations show their observable effects. Teaching examples use
explicit implementations when the internal steps matter. Personal programs get
syntax explanations and descriptions of recorded changes without guessing their
intended algorithm. Complexity panels distinguish observed work from theoretical
bounds; automatic analysis reports when it cannot determine a result.

Editing the source or input makes its previous trace stale. Authored lesson
explanations, bindings and complexity claims apply to the original example.

Supported programs use functions, recursion, ordinary classes and instance
attributes, built-in containers, and `collections`, `heapq`, `bisect`, `math` and
`functools`. Each run gets a fresh worker. Execution is limited to 10 seconds,
10,000 trace events and 16 MiB of trace data; Stop terminates the worker.

Multi-file projects, third-party Python packages, native filesystem access,
networking and concurrent Python programs are outside this release.

## Keep your progress

IndexedDB stores lesson completion, exercise results, preferences and drafts in
the current browser profile. Another browser or computer has separate storage.
Use Backup > Export backup before moving your data or clearing browser storage.

Restore validates the backup, handles supported older formats and saves a
pre-restore snapshot before replacing live data. Imported Python files become
drafts; importing or restoring a file does not execute its code.

## Run from source

Development requires Git, Node 24.x and npm. Installing development dependencies
requires internet access; the built app uses its bundled Python files.

```sh
git clone https://github.com/RishabhP1508/DSA.git
cd DSA
npm ci
npm run build
node desktop/server.mjs
```

Open <http://127.0.0.1:8765>. The server starts both loopback origins. Press
`Ctrl+C` in its terminal to stop them.

For UI work with Vite's development reload, run `npm run dev`. Use the built-app
server above for Python execution with the separate runner origin.

If the default ports are occupied, a source build can use another pair:

```sh
node desktop/server.mjs --app-port 8775 --runner-port 8776
```

The packaged Start/Stop launchers use the fixed 8765/8766 pair.

## Verification

Run the aggregate build, lint, unit, Python, curriculum and exercise checks:

```sh
npm run check:all
```

The browser suite builds the app and serves its two origins on ports 4173/4174.
To use Playwright's Chromium:

```sh
npx playwright install chromium
npm run test:browser
```

To test installed Windows browsers, use PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = "chrome"
npm run test:browser
$env:PLAYWRIGHT_CHANNEL = "msedge"
npm run test:browser
```

The recorded 1.0.0 checks on October 10, 2026 passed 999 tests across 93 files,
all 162 standard Python examples, 163 coding model solutions and 166 recognition
exercises. All 163 coding exercises reject each of five authored faulty-solution
categories. All 329 interactive exercises have five hints followed by an
explained solution.

Native Windows Chrome and Edge each passed 38 browser tests with no skips. The
package passed 11 launcher checks, and both browsers passed offline acceptance
against the staged build and a fresh ZIP extraction. Offline tests blocked
external browser requests; they did not disable the Windows network adapter.
The zoom check used an equivalent reduced CSS viewport.

All 162 lessons and patterns have review records tied to their current content
hashes. Unchanged prior human approvals are preserved, and delegated technical
reviews record their provenance. Tests check that evidence is current; passing
tests alone does not establish teaching correctness. Lint recorded 32 warnings
and zero errors; 25 semantic consistency scope advisories remain documented.
The [completion record](docs/completion.md) and
[release record](docs/releases/1.0.0.md) identify the exact tested source and
package hashes.

## Architecture and contribution notes

The UI uses React, TypeScript, Vite, shadcn/ui, Tailwind, CodeMirror, SVG diagrams
and bundled fonts. Pyodide 314.0.7 supplies CPython 3.14.2. The Python runner uses
a separate loopback origin, validated messages and a restrictive Content
Security Policy. `sys.settrace` records immutable snapshots, including aliases
and cycles, without invoking user-defined representations or properties during
inspection. Local servers do not expose native Python execution or native
filesystem APIs.

- [AGENTS.md](AGENTS.md) sets the research, verification and content-review rules.
- [Reference index](docs/references.md) records exact source pages and checked claims.
- [Coverage inventory](docs/coverage.md) tracks required topics and practice mappings.
- [Design notes](docs/design.md) describe the interface and interaction choices.
- [Windows packaging](docs/windows-package.md) explains runtime checksums, file
  inventories, staging, archive verification and dependency notices.

Lessons, exercises and SVG diagrams are original project content. Research
sources are cited in the lessons and reference index. The Windows distribution
retains the license notices for its dependencies, fonts and runtimes.
