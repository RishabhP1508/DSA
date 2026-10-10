## Searching, sorting, and related patterns — consulted 2026-10-10

### lesson/linear-search

First-match index and absent -1 contract checked on empty, duplicate, negative and singleton inputs. No sorting is needed, but len/index access and equality costs are assumed. Set/hash alternatives require hashable values and expected hashing; coding models return the tested result. Function-only cost excludes demo construction/output.

- [TheSequentialSearch](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheSequentialSearch.html) — Algorithm, analysis and visual example. Checked: Sequential search needs no ordering; present uniform-position average is linear. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays. Checked: Linear scan is O(n). Accessed 2026-10-10.

### lesson/binary-search

Inclusive lo..hi invariants and mid±1 progress checked; equality tests are distinguished from returns. Empty/duplicate inputs preserve any-match-or--1 contract. Average logarithmic search assumes uniformly selected present distinct keys; sortedness validation is outside query scope. Diagram now displays the candidate range.

- [TheBinarySearch](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBinarySearch.html) — Algorithm, analysis and visual example. Checked: Sorted order permits halving; slicing is not constant-time. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays; lower and upper bound. Checked: Monotone order supports logarithmic search. Convention: This app uses inclusive [lo, hi] and excludes mid with mid ± 1. Accessed 2026-10-10.

### lesson/binary-search-answer

Positive nonempty integer weights, days>=1, order-preserving greedy feasibility and feasible sum upper bound checked against an independent exhaustive capacity oracle. Invalid inputs reject; R=0 still incurs initialization, so O(n log(R+2)). Exercises explain positive exact-m splitting and valid DP alternatives. Scalar capacities are shown as values, not array indices.

- [shipping reference](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/) — Problem statement, examples, constraints. Checked: Shipping keeps package order and positive weights; at least one day is permitted. Convention: This app permits days > n as harmless spare days. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search on arbitrary predicate; binary search on the answer. Checked: A monotone predicate identifies a transition within correctly bracketed bounds. Accessed 2026-10-10.

### lesson/rotated-array-search

Exhaustive rotations of distinct lists through n=6 agree with linear lookup. Distinctness is a correctness precondition: [1,0,1,1,1], target0 produces -1 in this code. A separate duplicate-aware variant must discard equal ambiguous endpoints and may take O(n). Inclusive search range, line tests, model explanations and recognition conditions agree.

- [rotated reference](https://leetcode.com/problems/search-in-rotated-sorted-array/description/) — Problem statement and distinct-value constraints. Checked: The original rotated-array logarithmic search problem guarantees unique values. Convention: The app also supports the empty input as -1. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays; implementation. Checked: Each range update needs a valid invariant and progress. Accessed 2026-10-10.

### lesson/bounds

Both lower/upper half-open loops are visible and match CPython bisect on absent values, empty and all-equal lists. hi=len is rendered as an exclusive endpoint. A lower bound requires bounds-and-equality membership validation. insort insertion shifts O(n) references and may resize; the query O(log n)/O(1) analysis is explicitly scoped separately.

- [bisect reference](https://docs.python.org/3.14/library/bisect.html) — bisect_left, bisect_right; performance notes; Searching Sorted Lists. Checked: Left/right insertion points differ on equality; membership requires an equality check; insort is O(n). Convention: The hand-written loops use half-open [lo,hi), matching the library insertion-point result. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Lower bound and upper bound; implementation. Checked: The two bounds delimit the equal-value range. Accessed 2026-10-10.

### lesson/matrix-search

Rectangular globally nondecreasing row-major order is required; row/column sorting alone is insufficient. Flat index quotient/remainder mapping and empty/singleton/duplicate cases tested. Stored row/col highlight the actually examined cell. No O(m*n) validation scan is included in the logarithmic query cost; equality across row boundaries is allowed.

- [matrix reference](https://leetcode.com/problems/search-a-2d-matrix/description/) — Problem statement; row-major ordering requirements. Checked: The flattening problem requires ordered rows with ordered row boundaries. Convention: The app permits equal row-boundary values: nondecreasing global order still suffices. Accessed 2026-10-10.
- [staircase reference](https://leetcode.com/problems/search-a-2d-matrix-ii/description/) — Problem statement; sorted row and column constraints. Checked: Row/column sorting is a weaker input guarantee than global row-major order. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays. Checked: Halving requires a sorted search sequence. Accessed 2026-10-10.

### lesson/bubble-sort

Shown basic implementation always performs n(n-1)/2 adjacent comparisons, including sorted input; linear best case belongs to the early-exit variant. Strict out-of-order swaps preserve stability, confirmed with tagged equal keys. Copy time is O(n); O(1) auxiliary cost excludes the returned copy, whose storage is O(n). No unsupported wall-clock prediction remains.

- [TheBubbleSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheBubbleSort.html) — Algorithm, analysis and visual example. Checked: The basic sort has a triangular comparison count; early exit is a separate variant. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing; list_resize; binarysort. Checked: List copies allocate references; binary insertion sorting moves entries to make room. Convention: This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection. Accessed 2026-10-10.

### lesson/selection-sort

Minimum scan performs n(n-1)/2 comparisons and this exact code executes n placement swaps, including self-swaps. Sorted data still writes each placement pair. Unstable selection distinguished from stable variants. Empty, negative, duplicate and reverse inputs tested; copied-result space is explicitly separated from O(1) working scalars.

- [TheSelectionSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheSelectionSort.html) — Algorithm, analysis and visual example. Checked: Selection places one extremal value per pass with quadratic comparisons. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing; list_resize; binarysort. Checked: List copies allocate references; binary insertion sorting moves entries to make room. Convention: This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection. Accessed 2026-10-10.

### lesson/insertion-sort

Strict > shifts preserve stability; tagged records and signed boundaries tested. Adaptive cost is O(n+I), where I is inversion count; near-sorted linearity requires I=O(n). The while counter counts the short-circuit whole condition, not always a key comparison. Held key is displayed separately. Output copy time/storage are included or explicitly excluded by scope.

- [TheInsertionSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheInsertionSort.html) — Algorithm, analysis and visual example. Checked: Insertion shifts larger prefix items; ordered input takes linear work. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing; list_resize; binarysort. Checked: List copies allocate references; binary insertion sorting moves entries to make room. Convention: This app returns a defensive copy and uses ascending minimum-selection rather than descending maximum-selection. Accessed 2026-10-10.

### lesson/merge-sort

Base cases and two strictly smaller recursive slices introduced before use. Stable <= tie choice checked with tagged records. Slicing/copying is O(n) per recursion level, so total time remains O(n log n); cumulative allocation is distinguished from O(n) peak live storage. Separate input, left/right, destination and live recursion bindings render actual traces.

- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.1 merge-sort; recursion-tree analysis and figure. Checked: Balanced split, linear merge/copy work per level, logarithmic levels. Accessed 2026-10-10.
- [TheMergeSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheMergeSort.html) — Algorithm, analysis and visual example. Checked: Taking left on <= preserves stability; base case is empty/singleton. Accessed 2026-10-10.
- [visual reference](https://visualgo.net/en/sorting) — Merge sort visualization pseudocode. Checked: Display split halves and the merged destination as separate state. Accessed 2026-10-10.

### lesson/quick-sort

Reviewed the exact middle-position-pivot three-list version, not in-place partition quicksort. All-equal best case is O(n); average O(n log n) requires distinct random permutations; crafted extremes give quadratic time and quadratic peak retained-list space. Real depth12 trace retains list lengths1..12. Total-order/no-NaN preconditions and separate classic in-place stack costs are explicit; stable group ordering checked.

- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.2 quicksort; randomized pivot and three-way partition. Checked: Randomized pivots yield expected logarithmic-depth sorting; equal groups avoid further recursion. Convention: The app chooses a deterministic middle-position pivot and allocates three lists. Its retained-list memory bound is derived from this code, not from the in-place source. Accessed 2026-10-10.
- [TheQuickSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheQuickSort.html) — Algorithm, analysis and visual example. Checked: Unbalanced partitions can produce a quadratic sum of subproblem sizes; median-of-three is a heuristic. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list slicing and allocation. Checked: Lists own allocated arrays of element references. Accessed 2026-10-10.

### lesson/counting-sort

Shown integer-frequency reconstruction differs from stable record placement. Nonnegative 0..hi keys, O(n+hi) costs and sparse-range tradeoff checked. Temporary repeated-value list can hold O(n) references beyond result/counts, so auxiliary statement includes it. Output binding now shows reconstruction, and expected speed is not treated as unconditional against adaptive Python sorting.

- [Open Data Structures: counting and radix sorting](https://opendatastructures.org/ods-python/11_2_Counting_Sort_Radix_So.html) — Counting sort; stable placement; radix sorting. Checked: Counting arrays use the bounded key domain; stable per-digit passes enable radix sorting. Convention: This app rebuilds integer values from frequencies; record stability is a separate variant. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list_repeat; list_extend. Checked: Repeated-value expressions allocate temporary lists before extend. Accessed 2026-10-10.

### lesson/bucket-sort

Mapped nonnegative integer x*k//(max+1) into 0..k-1, requiring positive integer k; floats require different integer-index mapping. Actual inner Python sorted gives O(n log n+k) worst time, not a quadratic insertion-sort bound. Expected linearity requires k=Theta(n) and suitable independent occupancy; fixed default k=5 cannot establish it. Bucket matrix and result render actual values.

- [McGill: Bucket Sorting in Expected Linear Time](https://www-cgrl.cs.mcgill.ca/~godfried/teaching/dm-reading-assignments/Bucket-Sorting-Expected-Complexity.pdf) — Algorithm steps 2–5; uniform-input occupancy analysis. Checked: The expected-linear theorem uses a number of buckets proportional to n and independent uniform samples. Convention: The app maps nonnegative integers with max+1 and defaults to fixed k=5, so it does not inherit that expectation. Accessed 2026-10-10.
- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Sorting basics; Timsort. Checked: Python sort is adaptive and sorts each supplied bucket. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — sort implementation, binarysort and merge routines. Checked: Python list sort combines ordered runs with temporary storage. Accessed 2026-10-10.

### lesson/heap-sort

Separate copied min-heap plus output list is the displayed algorithm; O(n) heapify and repeated minimum extraction give O(n log n) worst time with O(n) auxiliary heap memory. Classic O(1)-auxiliary array heapsort is distinguished. Explicit loop makes heap shrinking and output growth visible, with one actual pop per counter entry. No stability or blanket practical-speed guarantee is taught.

- [heap reference](https://docs.python.org/3.14/library/heapq.html) — Heap invariant; heapify; heappop; max-heap functions. Checked: heapify is linear; min-heap heappop returns the smallest; Python 3.14 includes max-heap functions. Convention: This app uses a separate 0-based min-heap. Accessed 2026-10-10.
- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.3 heap-sort. Checked: Classic in-place heapsort reuses the input array. Accessed 2026-10-10.

### lesson/radix-sort

Stable LSD bucket ordering and digit extraction checked on empty, zero, duplicates and varying lengths. d>=1 includes zero by convention; all-zero input executes zero bucket passes but still costs O(n) copy/max. Nonnegative integer and bounded arithmetic assumptions explicit. Digit buckets and rebuilt output render; unrestricted Python integer bit costs are excluded from unit-cost bound.

- [Open Data Structures: counting and radix sorting](https://opendatastructures.org/ods-python/11_2_Counting_Sort_Radix_So.html) — Counting sort and radix sort. Checked: Stable lower-digit-first passes preserve prior order and avoid an array indexed by the whole key range. Convention: This app uses base10 list buckets and nonnegative Python integers. Accessed 2026-10-10.

### lesson/comparators

Python3.14 key-once and stable reverse semantics checked against official docs and runtime. Returned sorted lists are materialized for diagrams while original inputs remain inspectable. Tuple keys, numeric descending negation and string multipass alternatives distinguished. cmp_to_key is accepted when only a valid comparator is available. Program bound includes literals and bounded-size printing/key costs; functions/expressions prerequisites named.

- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key Functions; Sort Stability; Ascending and Descending; comparison functions. Checked: Keys are evaluated once; ties remain stable, including reverse; multiple stable passes express mixed directions. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — list_sort_impl; key allocation; merge routines. Checked: Keys and merge buffers can occupy linear auxiliary storage. Accessed 2026-10-10.

### lesson/interval-sorting

Start-key returned list is shown alongside original intervals. Program complexity includes construction and bounded-size endpoint output. Sorting already ordered input can be linear; a reverse end-sorted merge is a valid adapted sweep, while the displayed forward merge needs start order. Closed merge and positive-duration half-open scheduling conventions are distinguished.

- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key Functions; Sort Stability. Checked: Key functions order records and preserve ties. Accessed 2026-10-10.
- [intervals reference](https://leetcode.com/problems/merge-intervals/description/) — Examples and endpoint constraints. Checked: Closed ranges that touch can be merged. Accessed 2026-10-10.
- [Cornell: Greedy Stays Ahead](https://www.cs.cornell.edu/courses/cs482/2006su/handouts/ahead.pdf) — Interval scheduling example and proof. Checked: Earliest finish leaves a maximum-cardinality compatible set. Convention: This app distinguishes closed merging intervals from half-open start<end meeting intervals. Accessed 2026-10-10.

### pattern/binary-search-on-answer

Monotone false-to-true search requires a feasible upper bound. Standalone can_ship now rejects a package heavier than cap; positive nonempty weights and days>=1 validated by least_capacity. Brute capacity oracle covers singleton R=0 and days>n. Initialization-inclusive O(n log(R+2)) and scalar diagram bindings agree. DP is a valid alternative with its own state recurrence.

- [shipping reference](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/description/) — Problem statement, examples, constraints. Checked: Shipping keeps package order and positive weights; at least one day is permitted. Convention: This app permits days > n as harmless spare days. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search on arbitrary predicate; binary search on the answer. Checked: A monotone predicate identifies a transition within correctly bracketed bounds. Accessed 2026-10-10.

### pattern/merge-intervals

Empty-safe nonmutating closed-interval union uses start-sorted references and fresh result pairs. Touching, nesting, negative endpoints and empty input checked; no input-pair aliases are mutated. Python key/merge buffers and separate sorted list require O(n) auxiliary space, excluding required output. Reverse end-order sweep is an adapted alternative; selecting intervals and counting rooms have different objectives.

- [intervals reference](https://leetcode.com/problems/merge-intervals/description/) — Examples 1–3; valid endpoint pairs. Checked: The output is a union of overlaps; touching endpoints merge. Convention: Closed ranges with start <= end; fresh output pairs; nonmutating input. Accessed 2026-10-10.
- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key functions; stability. Checked: Sort-by-start prepares ordered processing; sort consumes working storage. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — sort key allocation and merge routines. Checked: In-place list.sort can still allocate linear working memory. Accessed 2026-10-10.

### pattern/greedy-interval-scheduling

Earliest compatible finish maximizes equally weighted meeting count by stays-ahead/exchange reasoning. Finite start<end meetings use touching-compatible half-open scheduling; output is a count. Brute subset oracle verifies small tied/nested/negative cases. Python in-place sort still uses O(n) keys/merge buffers. Weighted values require DP, and resource counting/arrows are not automatically this selection pattern.

- [Cornell: Greedy Stays Ahead](https://www.cs.cornell.edu/courses/cs482/2006su/handouts/ahead.pdf) — Interval scheduling example; induction and optimality contradiction. Checked: Earliest finish stays ahead and maximizes the compatible interval count. Convention: The app treats touching positive-duration meetings as compatible. Accessed 2026-10-10.
- [sort reference](https://docs.python.org/3.14/howto/sorting.html) — Key Functions. Checked: Sort by end with one key computation per interval. Accessed 2026-10-10.
- [CPython 3.14.2 list implementation](https://raw.githubusercontent.com/python/cpython/v3.14.2/Objects/listobject.c) — key-sort allocation; merge working storage. Checked: Mutating a list through sort does not imply constant working space. Accessed 2026-10-10.

### pattern/modified-binary-search

Distinct rotated-array implementation checked across all small rotations, with a concrete duplicate counterexample proving incorrectness outside the contract. Sorted-half identification and endpoint updates agree with trace and inclusive-range diagram. Halving counter uses midpoint execution and excludes the final failed loop condition. Feasibility-search alternatives require positive shipping inputs rather than an ordinary array-order assumption.

- [rotated reference](https://leetcode.com/problems/search-in-rotated-sorted-array/description/) — Problem statement and distinct-value constraints. Checked: The original rotated-array logarithmic search problem guarantees unique values. Convention: The app also supports the empty input as -1. Accessed 2026-10-10.
- [binary reference](https://cp-algorithms.com/num_methods/binary_search.html) — Search in sorted arrays; implementation. Checked: Each range update needs a valid invariant and progress. Accessed 2026-10-10.

### pattern/divide-and-conquer

Base case, strictly smaller children and correct combine are required; efficient independent splits avoid repeated states, while overlap can motivate memoization. Correct recurrence is2T(n/2)+O(n), including linear slices per level. Stable merge oracle and recursive bindings agree. Balanced vs unbalanced depth and quicksort variant memory are distinguished; quickselect expected linearity requires random pivots.

- [Open Data Structures: comparison-based sorting](https://opendatastructures.org/ods-python/11_1_Comparison_Based_Sorti.html) — 11.1.1 merge-sort; recurrence tree and Figure 11.2. Checked: Two half-sized calls plus linear copy/merge work give logarithmic levels and O(n log n) time. Accessed 2026-10-10.
- [TheMergeSort](https://runestone.academy/ns/books/published/pythonds3/SortSearch/TheMergeSort.html) — Algorithm, analysis and visual example. Checked: The <= choice keeps equal items stable; base case stops at <=1. Accessed 2026-10-10.
