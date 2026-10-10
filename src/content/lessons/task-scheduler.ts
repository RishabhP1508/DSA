import type { LessonDefinition } from "../../core/types";

// Original local example and exercises; source records are attached below.
export const taskScheduler: LessonDefinition = {
  "id": "task-scheduler",
  "title": "Task Scheduler: Cooldowns and a Visible Timeline",
  "area": "Heaps",
  "prerequisites": [
    "min-max-heaps",
    "string-frequency",
    "stack-queue-operations"
  ],
  "explanation": "Imagine one worker completing one task per time slot. Repeated labels need a rest: with cooldown 2, an A at slot 0 cannot run again at slots 1 or 2, but is legal at slot 3. Other labels can fill the gap. All tasks are available initially, each lasts exactly one slot, order may change, and every label shares the same cooldown. This lesson accepts a finite reusable sequence of single letters A-Z and a nonnegative integer cooldown; it returns a list with None for each idle slot. Empty input returns [].\n\nCount the remaining work for each label. Keep eligible labels in a heap ordered by largest remaining count, and cooling labels in a FIFO queue ordered by their release slot. At each slot, first release any label whose time has arrived. Then run the eligible label with most work left. A long repetition chain is hardest to fit later, so giving it priority lets other labels fill its gaps. If no label is eligible but unfinished work is waiting, record an idle. A finished label is never queued again. With a common cooldown, executions at increasing times produce increasing releases; unequal per-label cooldowns would need a release-time heap instead of this FIFO queue.\n\nThe heap stores (-remaining, label). Python’s ordinary heap functions are min-heap functions, so -3 comes before -2. Equal counts use alphabetical labels only to make this example deterministic; heaps are not fully sorted. Python 3.14 also has a native max-heap API: negation is a deliberate portable representation here. The waiting queue stores (release, -remaining, label), so the diagram exposes both the remaining work and exactly when it becomes eligible.\n\nFor tasks AAABBC and cooldown 2, the timeline is A,B,C,A,B,None,A, lasting seven slots. At slot 5, A still waits until slot 6 and no other work remains ready. The idle is necessary. As a duration check, let N be the task count, F the largest frequency, and M the number of labels tied at F. For nonempty input the minimum duration is max(N,(F-1)*(c+1)+M). The repetitions need F-1 separated groups of width c+1, followed by the M final most-frequent labels; enough other tasks fill the gaps, otherwise idle slots remain. This common-cooldown, unit-task rule matches that bound. A formula alone returns a number rather than constructing the requested timeline.\n\nInspect the actual ready heap, release queue and timeline while stepping. A recorded line event occurs before its highlighted line executes; an append is visible in the next recorded state. The explicit timeline requires O(T) output space and at least O(T) work when the cooldown is large. A count-only implementation that skips idle time has a different cost. General operating-system scheduling with different durations, deadlines or arrival times needs different reasoning.",
  "vocabulary": [
    {
      "term": "Time slot",
      "definition": "One unit of time containing a single task or an idle. Timeline index t means the interval [t,t+1)."
    },
    {
      "term": "Cooldown",
      "definition": "The number of slots that must lie between two uses of the same label."
    },
    {
      "term": "Eligible",
      "definition": "A label with unfinished work whose next legal execution time has arrived."
    },
    {
      "term": "Remaining count",
      "definition": "How many executions of a label are still required; the heap prioritizes the largest eligible count."
    },
    {
      "term": "Release slot",
      "definition": "The next allowed slot for a cooling label. After running at t, it is t+cooldown+1."
    },
    {
      "term": "Idle",
      "definition": "A slot containing None because no unfinished label is eligible at that time."
    }
  ],
  "concepts": {
    "purpose": "Construct a shortest valid cooldown schedule, including its actual task and idle slots.",
    "operations": "Count labels, heapify eligible priorities, release the front of a cooldown queue, choose the largest remaining eligible count, and append one slot.",
    "uses": "Reorderable unit jobs with identical label-specific rest periods, and practice combining a priority queue with a FIFO release queue.",
    "tradeoffs": "Explicit output is easy to inspect but costs O(T) space and work; count-only formulas or time jumps avoid writing idle slots. Fixed 26-label scanning is also reasonable.",
    "commonMistakes": "Releasing at t+c instead of t+c+1; ending when ready is empty even though waiting has work; choosing from cooling labels; treating the entire heap as sorted; applying the rule to unequal durations or cooldowns without a new proof.",
    "edgeCases": "[] produces []; cooldown 0 permits equal labels on successive slots; one repeated label forces gaps; tied largest frequencies can force a final group of labels; enough distinct work eliminates idle slots. Invalid cooldowns and labels raise ValueError. A very large cooldown produces a large actual output and may exceed the playback limits."
  },
  "complexity": [
    {
      "operation": "schedule(tasks,cooldown): explicit timeline",
      "average": "O(N log(K+1)+T) expected/amortized",
      "worst": "O(N log(K+1)+T) under the stated hash-cost model",
      "space": "O(K) working + O(T) returned timeline",
      "note": "N executions, K distinct labels, T slots including idle. For A-Z, K<=26, giving O(N+T); constant label count does not make T equal to N."
    },
    {
      "operation": "Duration only from frequencies",
      "average": "O(N+K) expected",
      "space": "O(K)",
      "note": "A different output/implementation: max(N,(F-1)*(c+1)+M) for nonempty input, and 0 for empty input. It does not construct slots."
    }
  ],
  "complexityExplanation": {
    "scope": "function",
    "variables": [
      {
        "symbol": "N",
        "meaning": "number of tasks supplied"
      },
      {
        "symbol": "K",
        "meaning": "number of distinct task labels, at most 26"
      },
      {
        "symbol": "T",
        "meaning": "length of the returned timeline, including idle slots"
      },
      {
        "symbol": "c",
        "meaning": "the common nonnegative cooldown"
      }
    ],
    "costModel": "Unit-cost arithmetic and single-character comparisons; expected O(1) hash operations, amortized list append, approximately O(1) deque endpoints. Heap sifting costs O(log(K+1)); backing-list resizing is charged amortized over the sequence. Input validation scans a reusable sequence twice overall with counting. Tracing and rendering are excluded.",
    "time": {
      "bound": "O(N log(K+1)+T)",
      "case": "expected",
      "explanation": "Validation and counting take expected O(N), initial priority construction/heapify O(K). There are N task pops, at most N queued releases and heap pushes, and T slot iterations; the nested release loop removes each queued item only once. Each heap contains at most K labels. With the fixed alphabet this is O(N+T), but a single repeated label with large c can make T much larger than N.",
      "otherCases": [
        {
          "case": "best",
          "bound": "O(1) for empty input",
          "note": "The valid empty sequence builds empty containers and returns immediately."
        }
      ]
    },
    "space": {
      "bound": "O(K)",
      "case": "worst",
      "explanation": "Counts hold K entries. Each unfinished label has at most one pending record in ready or waiting (or the currently popped local tuple). The heap, queue and counters therefore require O(K) working storage.",
      "inputOutputNote": "The input sequence occupies O(N) storage and is excluded. timeline is the returned output and requires O(T) space, including idle entries. The example’s global result aliases that list. No extra copy of the timeline is made by return."
    },
    "derivation": [
      {
        "lines": [
          7,
          8,
          10
        ],
        "description": "Validate each task and count frequencies.",
        "cost": "O(N) expected time",
        "dimension": "time"
      },
      {
        "lines": [
          11,
          12
        ],
        "description": "Build K priority tuples and heapify once.",
        "cost": "O(K) time and space",
        "dimension": "time"
      },
      {
        "lines": [
          15,
          16,
          27
        ],
        "description": "Advance through every task or idle slot.",
        "cost": "O(T) amortized time",
        "dimension": "time"
      },
      {
        "lines": [
          17,
          18,
          19,
          21,
          25
        ],
        "description": "Each task contributes only a constant number of heap/queue operations across the run.",
        "cost": "O(N log(K+1)) amortized heap time",
        "dimension": "time"
      },
      {
        "lines": [
          10,
          11,
          13
        ],
        "description": "Store counts and at most one pending record per unfinished label.",
        "cost": "O(K) working space",
        "dimension": "space"
      },
      {
        "lines": [
          14,
          22,
          27,
          28
        ],
        "description": "Build and return T timeline slots; this is output storage.",
        "cost": "O(T) output space, excluded from the working bound",
        "dimension": "space"
      }
    ],
    "assumptions": [
      "A finite reusable sequence of single uppercase A-Z strings is supplied.",
      "All tasks are initially available, have unit duration, may be reordered, and share a nonnegative integer cooldown.",
      "Labels are hashable and mutually comparable; arithmetic and comparisons use the unit-cost model.",
      "The complexity describes schedule, excluding sample printing and trace snapshots."
    ],
    "tradeoffs": "A scanning implementation costs O(N+TK), also O(N+T) for K<=26. A count-only frequency formula costs expected O(N+K) time and O(K) storage; jumping to the next release likewise avoids iterating idle time when only duration is returned. Either changes the output behavior.",
    "counters": [
      {
        "label": "task executions",
        "definition": "Completed executions of the line that appends a task label, not visits before that append.",
        "countLines": [
          22
        ]
      },
      {
        "label": "idle slots",
        "definition": "Completed executions of the None append line.",
        "countLines": [
          27
        ]
      },
      {
        "label": "released labels",
        "definition": "Completed popleft operations returning cooling labels to eligibility.",
        "countLines": [
          18
        ]
      }
    ],
    "fixedDataNote": "The displayed fixed input has N=6, K=3 and T=7; these seven observed slots illustrate the generalized N/K/T bounds rather than establish them."
  },
  "code": "from collections import Counter, deque\nimport heapq\n\ndef schedule(tasks, cooldown):\n    if type(cooldown) is not int or cooldown < 0:\n        raise ValueError(\"cooldown must be a nonnegative integer\")\n    for task in tasks:\n        if not isinstance(task, str) or len(task) != 1 or not \"A\" <= task <= \"Z\":\n            raise ValueError(\"tasks must be single letters A-Z\")\n    counts = Counter(tasks)\n    ready = [(-count, label) for label, count in counts.items()]\n    heapq.heapify(ready)\n    waiting = deque()\n    timeline = []\n    while ready or waiting:\n        time = len(timeline)\n        while waiting and waiting[0][0] <= time:\n            ready_at, neg_count, label = waiting.popleft()\n            heapq.heappush(ready, (neg_count, label))\n        if ready:\n            neg_count, label = heapq.heappop(ready)\n            timeline.append(label)\n            neg_count += 1\n            if neg_count < 0:\n                waiting.append((time + cooldown + 1, neg_count, label))\n        else:\n            timeline.append(None)\n    return timeline\n\ntasks = list(\"AAABBC\")\ncooldown = 2\nresult = schedule(tasks, cooldown)\nprint(result)\nprint(len(result))",
  "codeExplanations": [
    {
      "line": 1,
      "executable": true,
      "explanation": "Import Counter to count repeated labels and deque to keep waiting labels in release order."
    },
    {
      "line": 2,
      "executable": true,
      "explanation": "Import the min-heap operations; negative counts will put the largest remaining count first."
    },
    {
      "line": 3,
      "executable": false,
      "explanation": "Separate the imports from the function definition."
    },
    {
      "line": 4,
      "executable": true,
      "explanation": "Define a function that returns a minimum-length list of task slots; None means the CPU is idle."
    },
    {
      "line": 5,
      "executable": true,
      "explanation": "Require a nonnegative integer cooldown. Reject booleans as well as fractional or negative values."
    },
    {
      "line": 6,
      "executable": true,
      "explanation": "Stop with a clear error when the cooldown contract is violated."
    },
    {
      "line": 7,
      "executable": true,
      "explanation": "Validate each supplied label before building the schedule; tasks is a reusable finite sequence."
    },
    {
      "line": 8,
      "executable": true,
      "explanation": "Accept only single uppercase English letters, keeping every label hashable and tie-comparable."
    },
    {
      "line": 9,
      "executable": true,
      "explanation": "Reject a label outside the stated task alphabet."
    },
    {
      "line": 10,
      "executable": true,
      "explanation": "Count how many executions remain for each label. These starting counts are not mutated later."
    },
    {
      "line": 11,
      "executable": true,
      "explanation": "Make one tuple per label: a negative remaining count followed by the label for deterministic ties."
    },
    {
      "line": 12,
      "executable": true,
      "explanation": "Rearrange ready into a min-heap; its root now has the most negative count, meaning the most work."
    },
    {
      "line": 13,
      "executable": true,
      "explanation": "Create a FIFO queue of (release slot, negative remaining count, label) tuples."
    },
    {
      "line": 14,
      "executable": true,
      "explanation": "Start the returned timeline with no completed slots. Its length will supply the next slot index."
    },
    {
      "line": 15,
      "executable": true,
      "explanation": "Continue until both eligible work and cooling work are gone. A temporarily empty heap is not completion."
    },
    {
      "line": 16,
      "executable": true,
      "explanation": "The next slot is zero-based. A line event here is recorded before this assignment finishes."
    },
    {
      "line": 17,
      "executable": true,
      "explanation": "Release every waiting label whose release slot has arrived, before choosing work for this slot."
    },
    {
      "line": 18,
      "executable": true,
      "explanation": "Remove the earliest release from the front of the queue. All labels share the cooldown, so release order is FIFO."
    },
    {
      "line": 19,
      "executable": true,
      "explanation": "Make that label eligible again with its remaining priority. Its stored release time is no longer needed."
    },
    {
      "line": 20,
      "executable": true,
      "explanation": "Check whether at least one label can legally execute now."
    },
    {
      "line": 21,
      "executable": true,
      "explanation": "Choose the eligible label with the largest remaining count; alphabetical label order breaks count ties."
    },
    {
      "line": 22,
      "executable": true,
      "explanation": "Record one execution in this slot. The timeline grows only after this line executes."
    },
    {
      "line": 23,
      "executable": true,
      "explanation": "Consume one execution: for example, -3 becomes -2. Zero means this label is finished."
    },
    {
      "line": 24,
      "executable": true,
      "explanation": "Only labels with further executions need a cooldown entry."
    },
    {
      "line": 25,
      "executable": true,
      "explanation": "After a use at t, wait through t+1 to t+cooldown and release at t+cooldown+1. With cooldown 0, the next slot is allowed."
    },
    {
      "line": 26,
      "executable": false,
      "explanation": "The alternative branch is used only when no label is eligible; else itself has no separate line event."
    },
    {
      "line": 27,
      "executable": true,
      "explanation": "Record a necessary idle slot while waiting work still exists. Do not invent a completed task."
    },
    {
      "line": 28,
      "executable": true,
      "explanation": "Return the full schedule after all executions finish. Empty input returns an empty list."
    },
    {
      "line": 29,
      "executable": false,
      "explanation": "Separate the reusable function from the small visual example."
    },
    {
      "line": 30,
      "executable": true,
      "explanation": "Create three A tasks, two B tasks and one C task, all available before slot 0."
    },
    {
      "line": 31,
      "executable": true,
      "explanation": "Require two intervening slots between equal labels."
    },
    {
      "line": 32,
      "executable": true,
      "explanation": "Run the function; its ready, waiting and timeline locals drive the recorded diagrams."
    },
    {
      "line": 33,
      "executable": true,
      "explanation": "Print the original example timeline: A, B, C, A, B, idle, A."
    },
    {
      "line": 34,
      "executable": true,
      "explanation": "Print its duration of seven slots, including the idle slot."
    }
  ],
  "bindings": [
    {
      "variable": "ready",
      "model": "heap"
    },
    {
      "variable": "waiting",
      "model": "queue"
    },
    {
      "variable": "timeline",
      "model": "array",
      "overlays": [
        {
          "role": "highlight",
          "label": "current slot t",
          "source": "time"
        }
      ]
    },
    {
      "variable": "time",
      "model": "object"
    }
  ],
  "bindingsRationale": "Every diagram reads actual function locals from the trace. ready shows (-remaining,label) tuples in heap order; waiting shows FIFO (release,-remaining,label) tuples; timeline shows completed task/None entries at their slot indices. The current-slot mark appears only once its entry has actually been appended; before the append the time scalar identifies the pending slot. No future slots or invented queue transitions are drawn.",
  "prediction": [
    {
      "atEventIndex": 83,
      "prompt": "At the highlighted None-append line for slot 5, ready is empty and the front waiting entry is A with release slot 6. What is appended for slot 5?",
      "answer": "None",
      "explanation": "A is still cooling at slot 5. The append has not executed in this line event; after it completes, slot 5 is None. At slot 6, A is released before selection and runs."
    }
  ],
  "experiments": [
    "Use [] with cooldown 4: both pending containers are empty, so the returned timeline is [].",
    "Use AAA with cooldown 2: verify A,None,None,A,None,None,A, including exactly two intervening slots. Then set cooldown to 0 and verify three adjacent A slots.",
    "Use AABB with cooldown 2: verify a five-slot schedule such as A,B,None,A,B; both largest frequencies matter in the duration bound.",
    "Use ABCABC with cooldown 2: all six slots can contain work. Compare a single repeated label with a large cooldown and observe how T grows. Keep edits small enough for the 10,000-event playback limit.",
    "Change the release offset to time+cooldown and test AAA with cooldown 2; the repeated task becomes eligible one slot too soon. Restore +1 before continuing."
  ],
  "exercises": [
    {
      "id": "scheduler-complete-1",
      "kind": "complete-code",
      "prompt": "Complete schedule(tasks,cooldown) to return an actual shortest timeline for reorderable unit tasks A-Z with a common nonnegative integer cooldown. Return a list, using None for idle slots, and preserve the supplied sequence. Empty input returns []. Reject invalid cooldowns/labels with ValueError. Any valid minimum-length tie ordering passes the tests; the diagram’s alphabetical tie break is optional.",
      "starterCode": "from collections import Counter, deque\nimport heapq\n\ndef schedule(tasks, cooldown):\n    # TODO: validate, count, maintain eligible/waiting work, and construct slots.\n    return []",
      "expected": "from collections import Counter, deque\nimport heapq\n\ndef schedule(tasks, cooldown):\n    if type(cooldown) is not int or cooldown < 0:\n        raise ValueError(\"cooldown must be a nonnegative integer\")\n    for task in tasks:\n        if not isinstance(task, str) or len(task) != 1 or not \"A\" <= task <= \"Z\":\n            raise ValueError(\"tasks must be single letters A-Z\")\n    counts = Counter(tasks)\n    ready = [(-count, label) for label, count in counts.items()]\n    heapq.heapify(ready)\n    waiting = deque()\n    timeline = []\n    while ready or waiting:\n        time = len(timeline)\n        while waiting and waiting[0][0] <= time:\n            ready_at, neg_count, label = waiting.popleft()\n            heapq.heappush(ready, (neg_count, label))\n        if ready:\n            neg_count, label = heapq.heappop(ready)\n            timeline.append(label)\n            neg_count += 1\n            if neg_count < 0:\n                waiting.append((time + cooldown + 1, neg_count, label))\n        else:\n            timeline.append(None)\n    return timeline",
      "tests": "from collections import Counter\n\ndef check_schedule(tasks, cooldown, duration):\n    original = list(tasks)\n    slots = schedule(tasks, cooldown)\n    assert isinstance(slots, list), \"return a list, not printed output\"\n    assert tasks == original, \"do not mutate the input tasks\"\n    assert Counter(x for x in slots if x is not None) == Counter(tasks), \"execute each supplied task exactly once\"\n    previous = {}\n    for time, label in enumerate(slots):\n        if label is not None:\n            assert label not in previous or time - previous[label] >= cooldown + 1, \"a repeated task ran too early\"\n            previous[label] = time\n    assert len(slots) == duration, \"the schedule contains unnecessary idle time\"\n\nfor tasks, cooldown, duration in [\n    ([], 4, 0),\n    (list(\"AAA\"), 2, 7),\n    (list(\"AABB\"), 2, 5),\n    (list(\"ABCABC\"), 2, 6),\n    (list(\"AAAAABC\"), 2, 13),\n    (list(\"AAABBC\"), 2, 7),\n    (list(\"BAA\"), 0, 3),\n    (list(\"AB\"), 12, 2),\n]:\n    check_schedule(tasks, cooldown, duration)\nfor bad in [-1, 1.5, True]:\n    try:\n        schedule([], bad)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(\"reject invalid cooldown\")\nfor bad_label in [\"a\", \"AA\", 4, None]:\n    try:\n        schedule([bad_label], 1)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(\"reject a label outside A-Z\")",
      "hints": [
        "For A, A, A with cooldown 2, the valid shortest timeline is A, idle, idle, A, idle, idle, A. Slots between uses count toward the cooldown; the execution slot does not.",
        "Keep one remaining count per label. A label waiting for its cooldown is different from a label that is ready to run; one container cannot express both priorities conveniently.",
        "After running a label at zero-based slot t, its next legal use is t+cooldown+1. Release it before choosing at that slot. Because every label has the same cooldown, release times enter the queue in order.",
        "Use a heap of (-remaining, label) for eligible labels and a deque of (release, -remaining, label) for waiting labels. Choose the largest remaining eligible count; use None only when ready is empty but waiting still has work.",
        "Pseudocode: count labels; heapify priorities; while ready OR waiting: t=output length; move all released labels to ready; if ready, pop/run/decrement and enqueue unfinished work for t+c+1; otherwise append None; return the output.",
        "The complete solution is:\n\n```python\nfrom collections import Counter, deque\nimport heapq\n\ndef schedule(tasks, cooldown):\n    if type(cooldown) is not int or cooldown < 0:\n        raise ValueError(\"cooldown must be a nonnegative integer\")\n    for task in tasks:\n        if not isinstance(task, str) or len(task) != 1 or not \"A\" <= task <= \"Z\":\n            raise ValueError(\"tasks must be single letters A-Z\")\n    counts = Counter(tasks)\n    ready = [(-count, label) for label, count in counts.items()]\n    heapq.heapify(ready)\n    waiting = deque()\n    timeline = []\n    while ready or waiting:\n        time = len(timeline)\n        while waiting and waiting[0][0] <= time:\n            ready_at, neg_count, label = waiting.popleft()\n            heapq.heappush(ready, (neg_count, label))\n        if ready:\n            neg_count, label = heapq.heappop(ready)\n            timeline.append(label)\n            neg_count += 1\n            if neg_count < 0:\n                waiting.append((time + cooldown + 1, neg_count, label))\n        else:\n            timeline.append(None)\n    return timeline\n```\nThe OR condition preserves cooling work, the release offset preserves the gap, and the largest-remaining priority avoids postponing a long repetition chain. Work takes O(N log(K+1)+T) expected/amortized time, O(K) working storage, and O(T) returned timeline storage; K<=26 here."
      ]
    },
    {
      "id": "scheduler-recognize-1",
      "kind": "choose-approach",
      "prompt": "A single CPU must execute every task in a finite A-Z list. All tasks are initially available, each takes one slot, order may change, and equal labels need the same nonnegative integer cooldown. Return an actual minimum-length timeline, including idle slots. Choose an approach and a reason that address this output.",
      "expected": "Both accepted approaches separate eligibility from remaining work and produce the actual timeline. A,B,A uses the B slot to satisfy A’s cooldown. A frequency formula alone can certify the duration but cannot identify which label occupies each slot. These claims rely on unit duration, reorderable initially available tasks and one common cooldown; they are not a general scheduler for release dates or unequal task lengths.",
      "hints": [
        "The output must identify each task or idle slot, so a correct duration is only part of the work.",
        "Compare AA B with cooldown 1: fixed input order may waste a slot even though B can fill A’s gap.",
        "Eligibility depends on the last use; priority among eligible labels depends on how much work remains.",
        "Keep eligible and cooling work separately, or scan the small label alphabet with explicit next-release times.",
        "For each slot: release ready labels; choose the eligible largest remaining count; append its label or None; move unfinished chosen work to its future release.",
        "A ready heap with a release queue is the primary approach. A scan choosing the same priority is a valid alternative for at most 26 labels. A formula alone does not produce slots, and preserving input order can be longer."
      ],
      "recognition": {
        "scenario": "A single CPU must execute every task in a finite A-Z list. All tasks are initially available, each takes one slot, order may change, and equal labels need the same nonnegative integer cooldown. Return an actual minimum-length timeline, including idle slots. Choose an approach and a reason that address this output.",
        "approaches": [
          {
            "id": "ready-heap",
            "label": "Largest remaining eligible count, with a release queue and output slots",
            "requiredReasonIds": [
              "priority-and-release"
            ]
          },
          {
            "id": "scan-counts",
            "label": "Scan all label counts and next-release times for the best eligible label each slot",
            "requiredReasonIds": [
              "small-alphabet"
            ]
          },
          {
            "id": "duration-only",
            "label": "Use only the maximum-frequency duration formula",
            "requiredReasonIds": [],
            "rejectionFeedback": "The formula gives a minimum duration, but this request also needs the task/idle label at each slot. Add a construction algorithm."
          },
          {
            "id": "input-order",
            "label": "Keep the supplied task order and wait whenever the next task is cooling",
            "requiredReasonIds": [],
            "rejectionFeedback": "Order may change. For A,A,B with cooldown 1, preserving order gives A,idle,A,B, while A,B,A finishes in three slots."
          }
        ],
        "reasons": [
          {
            "id": "priority-and-release",
            "text": "The heap chooses among eligible labels by remaining work; the queue prevents a repeated label from returning before t+c+1."
          },
          {
            "id": "small-alphabet",
            "text": "There are at most 26 labels, so an explicit scan can choose the same largest-remaining eligible priority and record each slot."
          },
          {
            "id": "number-is-enough",
            "text": "The required output is only the duration, so no arrangement needs to be constructed.",
            "contradictory": true
          },
          {
            "id": "too-early",
            "text": "After a label at t, the same label is always legal again at t+c.",
            "contradictory": true
          }
        ],
        "acceptableApproachIds": [
          "ready-heap"
        ],
        "alternatives": [
          {
            "approachId": "scan-counts",
            "conditions": "The same largest-remaining eligible rule is used and each chosen label receives release time t+c+1.",
            "tradeoff": "A scan costs O(K) per output slot rather than heap operations around task executions. It is a reasonable O(N+T) choice for the fixed 26-label alphabet.",
            "requiredReasonIds": [
              "small-alphabet"
            ]
          }
        ],
        "reflectionPrompt": "Why does A,A,B with cooldown 1 distinguish the supplied order from a legal optimal reordering?",
        "modelExplanation": "Both accepted approaches separate eligibility from remaining work and produce the actual timeline. A,B,A uses the B slot to satisfy A’s cooldown. A frequency formula alone can certify the duration but cannot identify which label occupies each slot. These claims rely on unit duration, reorderable initially available tasks and one common cooldown; they are not a general scheduler for release dates or unequal task lengths."
      }
    }
  ],
  "review": "After a task at t, the next legal use is t+c+1. Release cooling labels before choosing work, prioritize the eligible label with most remaining executions, and keep going while ready OR waiting has work. The original sample has one necessary idle and duration 7. Empty input, cooldown 0, tied frequencies and insufficient filler work are separate cases. The implementation returns the whole timeline: O(K) working storage plus O(T) output, and expected/amortized O(N log(K+1)+T) time. All claims assume initially available reorderable unit tasks with one common cooldown.",
  "expectedOutput": "['A', 'B', 'C', 'A', 'B', None, 'A']\n7\n",
  "references": [
    {
      "url": "https://leetcode.com/problems/task-scheduler/",
      "title": "LeetCode 621 Task Scheduler",
      "section": "Description, examples, constraints",
      "topic": "task-scheduler",
      "purpose": "Verify the original optional-practice contract.",
      "verifiedClaims": [
        "Tasks take one slot and may be reordered.",
        "Equal task labels require the common cooldown between executions.",
        "Original labels are A through Z; cooldown zero is allowed."
      ],
      "conventions": [
        "The local lesson returns an actual optimal timeline, with None for idle slots, rather than only its duration.",
        "The local function also accepts an empty task list and any nonnegative integer cooldown."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://neetcode.io/solutions/task-scheduler",
      "title": "NeetCode Task Scheduler explanation",
      "section": "Prerequisites; 1. Brute Force intuition; 2. Max-Heap intuition/Python; 3. Greedy; 4. Math",
      "topic": "task-scheduler",
      "purpose": "Cross-check largest-remaining priority, cooldown waiting and the minimum-duration bound.",
      "verifiedClaims": [
        "A ready priority structure and cooldown queue separate selection from eligibility.",
        "Choose an eligible label with the largest remaining count.",
        "For nonempty input the optimal duration is max(N,(F-1)*(c+1)+M), where M labels tie at frequency F."
      ],
      "conventions": [
        "This lesson checks releases before a zero-based slot t and re-enables a label at t+c+1.",
        "The source count-only implementation can jump over idle time; this local implementation records each idle, so its output-length cost T must be included."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://docs.python.org/3.14/library/heapq.html",
      "title": "Python 3.14 heapq",
      "section": "heap invariant; heapify/heappush/heappop; Priority Queue Implementation Notes",
      "topic": "heaps",
      "purpose": "Check the exact supported Python heap operations and tuple priorities.",
      "verifiedClaims": [
        "The unqualified API is a zero-based min-heap.",
        "heapify builds in linear time; push/pop sift logarithmically.",
        "Tuple priorities compare subsequent fields when priorities tie."
      ],
      "conventions": [
        "The root is index 0; the remaining array is not fully sorted.",
        "This example deliberately uses the portable negative-priority convention although Python 3.14 also supplies native max-heap functions."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://docs.python.org/3.14/library/collections.html",
      "title": "Python 3.14 collections",
      "section": "Counter; deque objects",
      "topic": "task-scheduler",
      "purpose": "Verify counting and FIFO endpoint operations on the target language family.",
      "verifiedClaims": [
        "Counter stores counts of hashable labels.",
        "deque supports append and popleft with approximately constant endpoint cost."
      ],
      "conventions": [
        "Only strings A-Z are accepted here, so labels are hashable and comparable.",
        "A common cooldown makes release times increase with the time of execution, permitting a FIFO waiting queue."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://www.cs.usfca.edu/~galles/visualization/Heap.html",
      "title": "USFCA Heap Visualization",
      "section": "Insert 15; insert 10; Remove Smallest, with Skip Forward after each operation",
      "topic": "heaps",
      "purpose": "Inspect changing heap array and tree views before choosing a local visual binding.",
      "verifiedClaims": [
        "The smaller root is removed first, leaving the remaining value.",
        "The root changes as actual heap contents change."
      ],
      "conventions": [
        "The inspected reference uses a one-based array with a sentinel; the local Python list uses zero-based indexing without a sentinel.",
        "Only the layout idea is used; no reference diagram or code is copied."
      ],
      "accessDate": "2026-10-10"
    }
  ],
  evidence: {
    inventoryVersion: 20,
    contentHash: "e406fabf9a8e5dc5",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 4,
  },
};
