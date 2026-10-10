import type { LessonDefinition } from "../../core/types";

// Original local example and exercises; source records are attached below.
export const meetingRoomsII: LessonDefinition = {
  "id": "meeting-rooms-ii",
  "title": "Meeting Rooms II: Count the Peak Overlap",
  "area": "Sorting",
  "prerequisites": [
    "interval-sorting",
    "min-max-heaps"
  ],
  "explanation": "A room can hold one meeting at a time. Every supplied meeting must be held at its fixed time; the job is to find how many identical rooms are needed, not which meetings to keep. Use half-open intervals [start,end): a meeting ending at time 10 frees its room for another starting at 10. The function accepts a finite reusable sequence of integer pairs with start < end, including negative times and duplicate meetings. It rejects zero or reversed durations and returns 0 for an empty sequence.\n\nSort a copy by start time, then sweep those starts from left to right. A min-heap stores the end times of active meetings already processed. Before adding a new meeting, remove every end <= its start. The smallest end is the heap root, so if that one is still in the future, every remaining meeting is still active. Then push the new end and remember the largest heap length seen. Equal starts still need separate entries; duplicate meetings are not deduplicated.\n\nFor [[20,25],[5,15],[10,20],[0,10]], start order is [0,10), [5,15), [10,20), [20,25). After each meeting is added, the active counts are [1,2,2,1]. At time 10, the end 10 is removed before end 20 is added, so the count stays 2. At time 20, both ends 15 and 20 are removed; the current count falls to 1, but the peak remains 2. Returning the final heap length would lose that earlier overlap. The caller’s input order stays unchanged because sorted creates a new list.\n\nWhy is the peak the minimum? If r meetings are happening together, they need r distinct rooms, so any solution needs at least the peak overlap. Processing starts in order can reuse rooms whose meetings have ended. A new room is needed only when every previous room is occupied; those active meetings plus the new one witness exactly that many simultaneous meetings. This attains the lower bound. The function returns only the count, not a list assigning room identifiers to meetings.\n\nThere are two common heap variants. This lesson removes all expired entries and measures the peak active count. Another valid algorithm pops at most one free room per start, keeps one latest end per allocated room, and returns the final heap length. Its heap can retain old availability entries. The invariants and return values belong to different variants; changing just the final return in this lesson is wrong.\n\nFor count-only output, an event sweep is also valid: +1 at each start, -1 at each end, ends before starts when times tie (or group all deltas at a time), then keep the maximum active total. Merging intervals measures blocks of occupied time, and earliest-finish activity selection chooses a subset; neither directly gives the room count. Sorting and the heap operations take O(n log(n+1)) worst-case time. A line event records state before its highlighted line, so a popped end disappears only in the following recorded state.",
  "vocabulary": [
    {
      "term": "Half-open interval",
      "definition": "[start,end) includes its start and excludes its end, allowing a room to be reused exactly at end."
    },
    {
      "term": "Active meeting",
      "definition": "A processed meeting whose end lies strictly after the current start time."
    },
    {
      "term": "Peak overlap",
      "definition": "The largest number of meetings active simultaneously; it equals the minimum required room count."
    },
    {
      "term": "End-time heap",
      "definition": "A min-heap whose root is the earliest active end. It need not be fully sorted."
    },
    {
      "term": "Sweep",
      "definition": "Process events in time order while updating the current active state."
    },
    {
      "term": "Room reuse",
      "definition": "A meeting may use a room after its previous meeting ends, including when end equals the new start."
    }
  ],
  "concepts": {
    "purpose": "Count the minimum rooms required to hold every fixed-time meeting.",
    "operations": "Validate intervals, sort a copy by start, remove all expired heap roots, add the current end, and update peak concurrency.",
    "uses": "Meeting rooms, identical machines reserved for fixed intervals, and resource capacity from simultaneous demand.",
    "tradeoffs": "The heap answers availability from the earliest end and exposes active state. An event sweep or separate sorted starts/ends is equally valid for counting; returning assignments would additionally require room identifiers.",
    "commonMistakes": "Using < instead of <= for expiration; removing only one expired end while claiming the heap contains only active meetings; returning the final active heap length; merging occupied time ranges; dropping conflicts as though choosing a one-room subset; modifying unsorted caller input unnecessarily.",
    "edgeCases": "[] needs 0 rooms; touching intervals share 1; identical overlapping intervals need one room each; nested intervals raise the peak; multiple expired meetings must all be removed in this active-state variant. Negative integer times work. Zero-duration, reversed and noninteger pairs raise ValueError. Malformed pairs violate the two-item input precondition."
  },
  "complexity": [
    {
      "operation": "min_rooms(intervals)",
      "best": "O(n) for already start-ordered, nonoverlapping meetings",
      "worst": "O(n log(n+1))",
      "space": "O(n) auxiliary",
      "note": "Sorting dominates the worst-case bound; each end is pushed once and popped at most once. The copied list, sort workspace and displayed history take O(n); the active heap takes O(R), R<=n. Empty input is O(1)."
    }
  ],
  "complexityExplanation": {
    "scope": "function",
    "variables": [
      {
        "symbol": "n",
        "meaning": "the number of supplied meeting intervals"
      },
      {
        "symbol": "R",
        "meaning": "the largest number of active meetings, at most n"
      }
    ],
    "costModel": "Integer endpoint comparisons use unit cost. sorted evaluates its key once per input pair and uses adaptive Timsort. Heap sifts cost O(log(R+1)); list resizes and append are charged amortized. Trace snapshots, rendering and the sample’s output printing are excluded.",
    "time": {
      "bound": "O(n log(n+1))",
      "case": "worst",
      "explanation": "Validation and key extraction cost O(n), sorting O(n log(n+1)) in the worst case. The outer loop handles n starts. Across all iterations there are n pushes and at most n pops, so the nested while is not O(n) extra pops for each meeting: all heap work totals O(n log(R+1)). The history and peak updates add O(n).",
      "otherCases": [
        {
          "case": "best",
          "bound": "O(n)",
          "note": "Already start-ordered nonoverlapping meetings let adaptive sorting and a heap of at most one active end run linearly; empty input takes O(1)."
        }
      ]
    },
    "space": {
      "bound": "O(n)",
      "case": "worst",
      "explanation": "by_start is a new list of n references, and sorting may use O(n) workspace. The active heap has at most R ends and the displayed active_counts history has n integers. The pairs themselves are shared read-only references, not copied nested arrays.",
      "inputOutputNote": "The O(n) input pairs are excluded. The returned peak is one integer, O(1) under the numeric unit-cost model. active_counts is internal history and is therefore included in auxiliary storage. Removing that history still leaves O(n) copied-list/sort storage."
    },
    "derivation": [
      {
        "lines": [
          4,
          5
        ],
        "description": "Validate each pair once.",
        "cost": "O(n) time",
        "dimension": "time"
      },
      {
        "lines": [
          7
        ],
        "description": "Create a start-sorted copy with one key evaluation per pair.",
        "cost": "O(n log(n+1)) worst-case time; O(n) storage",
        "dimension": "time"
      },
      {
        "lines": [
          11,
          12,
          13,
          14
        ],
        "description": "Across all starts, push each end once and remove it at most once.",
        "cost": "O(n log(R+1)) amortized heap time",
        "dimension": "time"
      },
      {
        "lines": [
          15,
          16
        ],
        "description": "Update the peak and save one count per processed meeting.",
        "cost": "O(n) time",
        "dimension": "time"
      },
      {
        "lines": [
          7,
          8,
          10,
          16
        ],
        "description": "Retain a copied order, active ends and the displayed count history.",
        "cost": "O(n) total working space, including O(R) heap entries",
        "dimension": "space"
      }
    ],
    "assumptions": [
      "A finite reusable sequence of two-item integer pairs is supplied, with start < end.",
      "Intervals are half-open [start,end); end events release rooms before same-time starts.",
      "Every meeting must be held at its fixed time; rooms are identical and no cleanup/setup gap is required.",
      "Integer comparison and list indexing use unit cost; sample prints and the tracer are outside the function analysis."
    ],
    "tradeoffs": "An event sweep stores two events per meeting and sorts them, giving the same O(n log(n+1)) time/O(n) space. A room-assignment variant carries room identifiers. If the input is already start-sorted and no copy/history is needed, the active-end loop alone uses O(R) working space.",
    "counters": [
      {
        "label": "meetings added",
        "definition": "Completed heappush operations, one for each meeting.",
        "countLines": [
          14
        ]
      },
      {
        "label": "meetings released",
        "definition": "Completed heappop operations; each end is removed at most once.",
        "countLines": [
          13
        ]
      },
      {
        "label": "peak updates",
        "definition": "Completed maximum comparisons after adding a meeting, including updates that leave peak unchanged.",
        "countLines": [
          15
        ]
      }
    ],
    "fixedDataNote": "The original displayed input has n=4 and peak R=2. The recorded count history is [1,2,2,1], while the final active heap has one end; the general bound describes variable-size input."
  },
  "code": "import heapq\n\ndef min_rooms(intervals):\n    for start, end in intervals:\n        if type(start) is not int or type(end) is not int or start >= end:\n            raise ValueError(\"meetings need integer start < end\")\n    by_start = sorted(intervals, key=lambda meeting: meeting[0])\n    end_heap = []\n    peak = 0\n    active_counts = []\n    for start, end in by_start:\n        while end_heap and end_heap[0] <= start:\n            heapq.heappop(end_heap)\n        heapq.heappush(end_heap, end)\n        peak = max(peak, len(end_heap))\n        active_counts.append(len(end_heap))\n    return peak\n\nintervals = [[20, 25], [5, 15], [10, 20], [0, 10]]\nrooms = min_rooms(intervals)\nprint(rooms)\nprint(intervals)",
  "codeExplanations": [
    {
      "line": 1,
      "executable": true,
      "explanation": "Import the min-heap operations used to find the earliest ending active meeting."
    },
    {
      "line": 2,
      "executable": false,
      "explanation": "Separate the import from the reusable function."
    },
    {
      "line": 3,
      "executable": true,
      "explanation": "Define a function returning the minimum number of rooms needed to hold every supplied meeting."
    },
    {
      "line": 4,
      "executable": true,
      "explanation": "Read each pair and validate it before sorting. intervals is a reusable finite sequence of two-item pairs."
    },
    {
      "line": 5,
      "executable": true,
      "explanation": "Require integer times and positive duration. Negative times are allowed; equal or reversed endpoints are rejected."
    },
    {
      "line": 6,
      "executable": true,
      "explanation": "Stop with a clear error for a meeting outside the stated contract."
    },
    {
      "line": 7,
      "executable": true,
      "explanation": "Create a start-sorted list without changing the caller’s list or its pairs. The key is evaluated once per meeting."
    },
    {
      "line": 8,
      "executable": true,
      "explanation": "Start an empty heap containing one end time for each active processed meeting."
    },
    {
      "line": 9,
      "executable": true,
      "explanation": "Keep the largest active count seen so far; zero is the answer for no meetings."
    },
    {
      "line": 10,
      "executable": true,
      "explanation": "Record the active count after each start is processed, so the example exposes the sweep history."
    },
    {
      "line": 11,
      "executable": true,
      "explanation": "Process meetings in nondecreasing start order; equal starts are all counted."
    },
    {
      "line": 12,
      "executable": true,
      "explanation": "Release ALL meetings ending by this start time. Equality means a same-time end frees its room first."
    },
    {
      "line": 13,
      "executable": true,
      "explanation": "Remove the earliest expired end. Each meeting can be removed only once across the whole loop."
    },
    {
      "line": 14,
      "executable": true,
      "explanation": "Add the current meeting’s end time. After this push, every heap entry belongs to a meeting active at this start."
    },
    {
      "line": 15,
      "executable": true,
      "explanation": "Update the maximum simultaneous meeting count; a later quiet period must not reduce the answer."
    },
    {
      "line": 16,
      "executable": true,
      "explanation": "Save the current active count for playback. This history is auxiliary storage rather than returned output."
    },
    {
      "line": 17,
      "executable": true,
      "explanation": "Return the maximum active count, which is the minimum room count, rather than the final heap size."
    },
    {
      "line": 18,
      "executable": false,
      "explanation": "Separate the reusable algorithm from the original example."
    },
    {
      "line": 19,
      "executable": true,
      "explanation": "Supply four unsorted meetings. [0,10) and [10,20) may reuse one room at time 10."
    },
    {
      "line": 20,
      "executable": true,
      "explanation": "Run the function; its sorted rows, active end heap and counts provide the recorded visual state."
    },
    {
      "line": 21,
      "executable": true,
      "explanation": "Print 2: the peak overlap occurs at starts 5 and 10."
    },
    {
      "line": 22,
      "executable": true,
      "explanation": "Confirm that sorted made a copy: the original meeting order remains unchanged."
    }
  ],
  "bindings": [
    {
      "variable": "by_start",
      "model": "matrix"
    },
    {
      "variable": "end_heap",
      "model": "heap"
    },
    {
      "variable": "active_counts",
      "model": "array"
    },
    {
      "variable": "start",
      "model": "object"
    },
    {
      "variable": "peak",
      "model": "object"
    }
  ],
  "bindingsRationale": "The matrix shows actual start-sorted pairs, the heap shows recorded active end times, the count array shows actual processed-start history and peak is a recorded scalar. No room assignment is inferred: the program does not assign identifiers. At a line event before a pop, the ending meeting is still present; the following snapshot shows its removal.",
  "prediction": [
    {
      "atEventIndex": 43,
      "prompt": "At the highlighted pop line, the current meeting is [10,20), start is 10, and end_heap contains ends 10 and 15. After the expired end is removed and 20 is pushed, what is the active count?",
      "answer": "2",
      "explanation": "End 10 is released before a start at 10 under [start,end). The heap then contains ends 15 and 20, so the active count is 2 and the peak remains 2. The highlighted pop has not yet executed in this snapshot."
    }
  ],
  "experiments": [
    "Use [] and then one interval [8,10): the answers are 0 and 1.",
    "Use [[0,5],[5,8]]: <= expiration permits a same-time reuse and the answer stays 1. Changing it to < incorrectly requires 2.",
    "Use three identical [0,10) meetings: all must be counted, so the peak is 3. Then try [[0,12],[2,10],[4,8]] to see a nested peak of 3.",
    "Use [[0,2],[0,3],[0,4],[4,6]]: all three old ends expire before the last push; the active count falls to 1, but the answer remains 3.",
    "Try negative times and shuffled pairs, then verify the input list is unchanged. Try [2,2), a reversed pair, or fractional endpoints and observe the ValueError contract."
  ],
  "exercises": [
    {
      "id": "rooms-complete-1",
      "kind": "complete-code",
      "prompt": "Complete min_rooms(intervals) to return the minimum number of rooms for every fixed-time meeting. The input is a reusable finite sequence of two-item integer pairs with start < end; negative times and duplicate meetings are valid. Treat intervals as [start,end), preserve the supplied input, return 0 for empty input, and raise ValueError for noninteger or nonpositive-duration pairs. Return the count rather than printing it.",
      "starterCode": "import heapq\n\ndef min_rooms(intervals):\n    # TODO: validate, sort a copy, maintain active ends, and retain the peak.\n    return 0",
      "expected": "import heapq\n\ndef min_rooms(intervals):\n    for start, end in intervals:\n        if type(start) is not int or type(end) is not int or start >= end:\n            raise ValueError(\"meetings need integer start < end\")\n    by_start = sorted(intervals, key=lambda meeting: meeting[0])\n    end_heap = []\n    peak = 0\n    active_counts = []\n    for start, end in by_start:\n        while end_heap and end_heap[0] <= start:\n            heapq.heappop(end_heap)\n        heapq.heappush(end_heap, end)\n        peak = max(peak, len(end_heap))\n        active_counts.append(len(end_heap))\n    return peak",
      "tests": "for intervals, expected in [\n    ([], 0),\n    ([[0, 5], [5, 8]], 1),\n    ([[0, 10], [0, 10], [0, 10]], 3),\n    ([[0, 12], [2, 10], [4, 8]], 3),\n    ([[20, 25], [5, 15], [10, 20], [0, 10]], 2),\n    ([[-4, -1], [-1, 2], [-3, 0]], 2),\n    ([[0, 2], [0, 3], [0, 4], [4, 6]], 3),\n    ([[8, 10]], 1),\n]:\n    original = [pair[:] for pair in intervals]\n    actual = min_rooms(intervals)\n    assert type(actual) is int, \"return the room count, not printed output\"\n    assert actual == expected, (intervals, actual, expected)\n    assert intervals == original, \"do not mutate the caller's meetings\"\nfor intervals in [[[2, 2]], [[4, 1]], [[0, 1.5]], [[False, 2]]]:\n    try:\n        min_rooms(intervals)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(\"reject noninteger or nonpositive-duration meetings\")",
      "hints": [
        "For [0,5) and [5,8), one room is enough: the first meeting has ended when the second starts. Three identical nonempty intervals need three rooms.",
        "Once meetings are in start order, you only need the earliest active end to know whether any room can be released. A min-heap makes that end available without rescanning every active meeting.",
        "The active-meeting variant removes every end <= the new start. Its current heap length can decrease, so retain a separate maximum; returning its final length loses earlier overlap.",
        "Make a sorted copy by start. For each meeting, pop all expired ends, push this end, then update peak with the heap length. The input must contain integer start < end pairs.",
        "Pseudocode: validate pairs; sort by start; heap=[]; peak=0; for (s,e): while heap and minimum<=s, pop; push e; peak=max(peak,heap length); return peak. The displayed history list is useful for playback but not required to compute the count.",
        "The complete solution is:\n\n```python\nimport heapq\n\ndef min_rooms(intervals):\n    for start, end in intervals:\n        if type(start) is not int or type(end) is not int or start >= end:\n            raise ValueError(\"meetings need integer start < end\")\n    by_start = sorted(intervals, key=lambda meeting: meeting[0])\n    end_heap = []\n    peak = 0\n    active_counts = []\n    for start, end in by_start:\n        while end_heap and end_heap[0] <= start:\n            heapq.heappop(end_heap)\n        heapq.heappush(end_heap, end)\n        peak = max(peak, len(end_heap))\n        active_counts.append(len(end_heap))\n    return peak\n```\nAfter each push, heap length counts meetings active at that start. Its maximum is both necessary (those meetings cannot share rooms) and sufficient (released rooms can be reused). Sorting and all heap operations take O(n log(n+1)) worst-case time; the copied list, sort workspace and displayed history use O(n) auxiliary space."
      ]
    },
    {
      "id": "rooms-recognize-1",
      "kind": "choose-approach",
      "prompt": "Every meeting has integer start < end and must be held; meetings cannot move or be dropped. Times may be negative and input may be unsorted. A room is reusable when its previous end equals a new start. Return the minimum number of identical rooms. Choose an approach and a supporting reason.",
      "expected": "Two rooms are needed while those two meetings overlap. An active-end heap or a correctly tied event sweep finds the maximum overlap. Any simultaneous meetings need distinct rooms, and processing starts in order can reuse any room whose meeting has ended; a new room is needed only when all existing rooms are busy. The local all-expired heap can shrink, so its peak, not its final length, is the answer.",
      "hints": [
        "Every meeting must be held, so an algorithm that selects a compatible subset solves a different problem.",
        "Two overlapping meetings need two rooms even if their occupied time ranges merge into one connected block.",
        "A simultaneous count is a lower bound on rooms. Reusing every free room in start order reaches that bound.",
        "Consider an active end-time heap or a sweep of start/end events. Both must implement same-time room reuse.",
        "Heap pseudocode: sort starts; remove all ends<=start; add the new end; update peak. Event pseudocode: sort (time,delta), with -1 before +1 at ties; accumulate and update peak.",
        "The end-time heap and the properly tied event sweep both pass. Merge-union and earliest-finish subset selection do not count the resources needed for all meetings. In the active heap variant, keep the maximum rather than its final length."
      ],
      "recognition": {
        "scenario": "Every meeting has integer start < end and must be held; meetings cannot move or be dropped. Times may be negative and input may be unsorted. A room is reusable when its previous end equals a new start. Return the minimum number of identical rooms. Choose an approach and a supporting reason.",
        "approaches": [
          {
            "id": "end-heap",
            "label": "Sort by start, remove expired active ends, and retain the peak heap length",
            "requiredReasonIds": [
              "active-overlap"
            ]
          },
          {
            "id": "event-sweep",
            "label": "Sort start/end events, process ends before same-time starts, and retain the peak count",
            "requiredReasonIds": [
              "event-ties"
            ]
          },
          {
            "id": "merge-union",
            "label": "Merge overlapping ranges and count the merged ranges",
            "requiredReasonIds": [],
            "rejectionFeedback": "Merged ranges measure occupied blocks of time, not simultaneous rooms. [0,3) and [1,2) merge to one range but need two rooms."
          },
          {
            "id": "select-subset",
            "label": "Choose the largest nonoverlapping subset using earliest finishes",
            "requiredReasonIds": [],
            "rejectionFeedback": "That selects meetings to keep in one room. This problem requires holding every meeting and counting rooms instead."
          }
        ],
        "reasons": [
          {
            "id": "active-overlap",
            "text": "After expired ends are removed, the heap counts meetings active at each start; their maximum is the necessary and sufficient room count."
          },
          {
            "id": "event-ties",
            "text": "A start adds one active meeting and an end removes one; ending first at a tie implements the stated room-reuse rule."
          },
          {
            "id": "strict-only",
            "text": "An end equal to a start must still occupy a separate room.",
            "contradictory": true
          },
          {
            "id": "drop-conflicts",
            "text": "Overlapping meetings may be discarded so that the rest fit into one room.",
            "contradictory": true
          }
        ],
        "acceptableApproachIds": [
          "end-heap"
        ],
        "alternatives": [
          {
            "approachId": "event-sweep",
            "conditions": "Each meeting contributes a +1 start and -1 end, and end events precede starts at the same time (or their deltas are grouped).",
            "tradeoff": "The sweep stores O(n) events and also takes O(n log(n+1)) time; it is especially convenient when only a count is needed.",
            "requiredReasonIds": [
              "event-ties"
            ]
          }
        ],
        "reflectionPrompt": "How does [0,3), [1,2) distinguish room counting from merging or selecting meetings?",
        "modelExplanation": "Two rooms are needed while those two meetings overlap. An active-end heap or a correctly tied event sweep finds the maximum overlap. Any simultaneous meetings need distinct rooms, and processing starts in order can reuse any room whose meeting has ended; a new room is needed only when all existing rooms are busy. The local all-expired heap can shrink, so its peak, not its final length, is the answer."
      }
    }
  ],
  "review": "Sort by start, remove every active end <= this start, push the new end, and keep the maximum active count. Touching endpoints reuse a room; duplicates remain separate meetings. The sample’s active counts are [1,2,2,1], so 2 rooms are necessary and sufficient even though the final heap has length 1. This count-only function uses O(n log(n+1)) worst-case time and O(n) auxiliary storage for the sorted copy, heap and displayed history. A correctly tied event sweep is another valid counting approach.",
  "expectedOutput": "2\n[[20, 25], [5, 15], [10, 20], [0, 10]]\n",
  "references": [
    {
      "url": "https://neetcode.io/solutions/meeting-rooms-ii",
      "title": "NeetCode Meeting Rooms II explanation",
      "section": "Description; 1. Min Heap; 2. Sweep Line Algorithm; Common Pitfalls",
      "topic": "meeting-rooms-ii",
      "purpose": "Read the accessible teaching contract and compare both heap conventions and a sweep alternative.",
      "verifiedClaims": [
        "Every meeting must be accommodated, rather than selecting a subset.",
        "A meeting ending at t may share a room with one starting at t.",
        "Sort by start before processing; a sweep of starts and ends is also valid."
      ],
      "conventions": [
        "This lesson removes ALL expired active meetings and returns the recorded peak heap size.",
        "The source one-pop variant retains one end time per allocated room and may return final heap length; these invariants must not be mixed.",
        "The local function accepts negative integer times as an extension; start must still be strictly less than end."
      ],
      "accessDate": "2026-10-10"
    },
    {
      "url": "https://cs-people.bu.edu/januario/teaching/cs330/su23/slides/CS330-Lec06-with-notes.pdf",
      "title": "Boston University CS330 Greedy Algorithms lecture",
      "section": "PDF pages 17-21, 28-36: interval partitioning, priority queues, depth and earliest-start correctness",
      "topic": "meeting-rooms-ii",
      "purpose": "Independently verify the minimum-room lower bound, start-order reasoning and heap implementation cost.",
      "verifiedClaims": [
        "The number of simultaneous intervals is a lower bound on required rooms.",
        "Start-order assignment opens a new room only when all existing rooms conflict, attaining that lower bound.",
        "Sorting plus a linear number of logarithmic priority-queue operations takes O(n log n)."
      ],
      "conventions": [
        "The lecture uses open intervals in its diagram; this app states half-open [start,end) intervals so a same-time end releases before a start.",
        "The slide pseudocode uses a strict compatibility operator and an update operation named DECREASE-KEY; neither is copied. The local <= release test and pop/push operations are explicit.",
        "No classroom identifiers are returned by this count-only local function."
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
    contentHash: "866695c4805a26d6",
    verifiedAt: "2026-10-10",
    checks: { content: true, implementation: true, visualization: true, exercise: true, complexity: true, references: true },
    semanticReview: true,
    reviewBatch: 3,
  },
};
