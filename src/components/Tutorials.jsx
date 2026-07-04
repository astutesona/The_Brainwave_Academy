import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Play, CheckCircle, HelpCircle, Code, Lightbulb, ExternalLink } from 'lucide-react';

const TUTORIAL_DATA = {
  'linked-list': {
    title: 'Singly Linked List',
    category: 'Data Structures',
    wiki: 'https://en.wikipedia.org/wiki/Linked_list',
    famous: 'https://www.geeksforgeeks.org/singly-linked-list-tutorial/',
    theory: 'A Singly Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, elements are linked using pointers. Each node contains: Data (value) and Next (pointer/reference to the next node in the list). The list starts with a head node, and the last node points to NULL.',
    diagramType: 'linked-list',
    code: {
      java: `class Node {
    int data;
    Node next;
    Node(int val) {
        this.data = val;
        this.next = null;
    }
}`,
      cpp: `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};`,
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None`
    },
    output: "Node(10) -> Node(20) -> NULL",
    quiz: [
      {
        question: "What is the time complexity to insert a node at the head of a Singly Linked List?",
        options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
        correct: 0,
        explanation: "Inserting at the head takes constant time O(1) as it only involves redirecting the head pointer to the new node."
      }
    ]
  },
  'stack': {
    title: 'Stack Structure',
    category: 'Data Structures',
    wiki: 'https://en.wikipedia.org/wiki/Stack_(abstract_data_type)',
    famous: 'https://www.geeksforgeeks.org/stack-data-structure/',
    theory: 'A Stack is a linear data structure which follows a particular order in which operations are performed. The order is LIFO (Last In First Out). Think of a stack of plates: the plate placed last is the first to be removed. Key operations are Push (add item to top), Pop (remove item from top), and Peek/Top.',
    diagramType: 'stack',
    code: {
      java: `import java.util.Stack;
Stack<Integer> stack = new Stack<>();
stack.push(10);
stack.pop();`,
      cpp: `#include <stack>
std::stack<int> s;
s.push(10);
s.pop();`,
      python: `stack = []
stack.append(10)
stack.pop()`
    },
    output: "Top Element: 10\nPopped: 10",
    quiz: [
      {
        question: "Which of the following describes the access policy of a stack?",
        options: ["FIFO", "LIFO", "Random Access", "LILO"],
        correct: 1,
        explanation: "Stack elements follow the Last In First Out (LIFO) order, where the most recently added item is the first one processed."
      }
    ]
  },
  'queue': {
    title: 'Queue Structure',
    category: 'Data Structures',
    wiki: 'https://en.wikipedia.org/wiki/Queue_(abstract_data_type)',
    famous: 'https://www.geeksforgeeks.org/queue-data-structure/',
    theory: 'A Queue is a linear data structure that follows the FIFO (First In First Out) principle. The element added first is the one removed first. Elements are added at the rear (enqueue) and removed from the front (dequeue).',
    diagramType: 'queue',
    code: {
      java: `import java.util.LinkedList;
import java.util.Queue;
Queue<Integer> q = new LinkedList<>();
q.add(10); // Enqueue
q.poll(); // Dequeue`,
      cpp: `#include <queue>
std::queue<int> q;
q.push(10);
q.pop();`,
      python: `from collections import deque
q = deque()
q.append(10)
q.popleft()`
    },
    output: "Queue Front: 10",
    quiz: [
      {
        question: "Which operation is used to insert an element into a Queue?",
        options: ["Push", "Pop", "Enqueue", "Dequeue"],
        correct: 2,
        explanation: "Enqueue is the operation used to insert an element into the rear of a Queue."
      }
    ]
  },
  'binary-tree': {
    title: 'Binary Tree',
    category: 'Data Structures',
    wiki: 'https://en.wikipedia.org/wiki/Binary_tree',
    famous: 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
    theory: 'A Binary Tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child. The topmost node is called the root.',
    diagramType: 'binary-tree',
    code: {
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};`,
      python: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None`
    },
    output: "Root: 10 -> Left: 5, Right: 15",
    quiz: [
      {
        question: "What is the maximum number of children a binary tree node can have?",
        options: ["1", "2", "3", "Unlimited"],
        correct: 1,
        explanation: "By definition, a binary tree node can have at most 2 children (left and right)."
      }
    ]
  },
  'graph': {
    title: 'Graph Representation',
    category: 'Data Structures',
    wiki: 'https://en.wikipedia.org/wiki/Graph_(abstract_data_type)',
    famous: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
    theory: 'A Graph is a non-linear data structure consisting of vertices (or nodes) and edges that connect these vertices. Graphs can be directed or undirected, weighted or unweighted, and represented via adjacency matrices or adjacency lists.',
    diagramType: 'graph',
    code: {
      java: `import java.util.*;
Map<Integer, List<Integer>> adjList = new HashMap<>();`,
      cpp: `#include <vector>
std::vector<int> adjList[10];`,
      python: `adj_list = {i: [] for i in range(5)}`
    },
    output: "Graph initialized with 5 vertices",
    quiz: [
      {
        question: "Which of the following representations uses O(V^2) space for a graph?",
        options: ["Adjacency List", "Adjacency Matrix", "Incidence List", "Edge List"],
        correct: 1,
        explanation: "An adjacency matrix uses a V x V grid, resulting in O(V^2) memory footprint regardless of the number of edges."
      }
    ]
  },
  'binary-search': {
    title: 'Binary Search',
    category: 'Algorithms',
    wiki: 'https://en.wikipedia.org/wiki/Binary_search_algorithm',
    famous: 'https://www.geeksforgeeks.org/binary-search/',
    theory: 'Binary Search is an efficient interval-searching algorithm that works on sorted arrays. It repeatedly divides the search interval in half. If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise, narrow it to the upper half.',
    diagramType: 'binary-search',
    code: {
      java: `int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while(low <= high) {
        int mid = low + (high - low)/2;
        if(arr[mid] == target) return mid;
        if(arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low)/2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`
    },
    output: "Target 25 found at index 3",
    quiz: [
      {
        question: "What is the time complexity of Binary Search in the worst case?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correct: 1,
        explanation: "Binary search cuts the search space in half at each step, yielding a logarithmic time complexity of O(log N)."
      }
    ]
  },
  'linear-search': {
    title: 'Linear Search',
    category: 'Algorithms',
    wiki: 'https://en.wikipedia.org/wiki/Linear_search',
    famous: 'https://www.geeksforgeeks.org/linear-search/',
    theory: 'Linear Search is the simplest search algorithm. It scans elements sequentially one by one from the start to the end of the array, comparing each element with the target value until a match is found or the array is exhausted.',
    diagramType: 'linear-search',
    code: {
      java: `int search(int[] arr, int x) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == x) return i;
    }
    return -1;
}`,
      cpp: `int search(int arr[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (arr[i] == x) return i;
    return -1;
}`,
      python: `def search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x: return i
    return -1`
    },
    output: "Target found at index 4",
    quiz: [
      {
        question: "What is the time complexity of linear search when the element is not present?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
        correct: 2,
        explanation: "If the target is absent, the search must iterate through all N elements of the array, resulting in O(N) complexity."
      }
    ]
  },
  'bubble-sort': {
    title: 'Bubble Sort',
    category: 'Algorithms',
    wiki: 'https://en.wikipedia.org/wiki/Bubble_sort',
    famous: 'https://www.geeksforgeeks.org/bubble-sort/',
    theory: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This pass-through is repeated until no swaps are needed, signifying a sorted array.',
    diagramType: 'bubble-sort',
    code: {
      java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
      cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`
    },
    output: "Sorted Array: [1, 2, 5, 8]",
    quiz: [
      {
        question: "What is the worst-case time complexity of Bubble Sort?",
        options: ["O(N)", "O(N log N)", "O(N^2)", "O(2^N)"],
        correct: 2,
        explanation: "In the worst case (reverse sorted array), bubble sort does two nested loops over the array, leading to O(N^2) complexity."
      }
    ]
  },
  'merge-sort': {
    title: 'Merge Sort',
    category: 'Algorithms',
    wiki: 'https://en.wikipedia.org/wiki/Merge_sort',
    famous: 'https://www.geeksforgeeks.org/merge-sort/',
    theory: 'Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself recursively for the two halves, and then merges the two sorted halves into a single fully sorted array.',
    diagramType: 'merge-sort',
    code: {
      java: `// Recursively split and merge
void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      cpp: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
      python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        # ... merge logic ...`
    },
    output: "Sorted Array: [12, 19, 25, 40]",
    quiz: [
      {
        question: "What is the time complexity of Merge Sort in all cases (best, average, and worst)?",
        options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"],
        correct: 1,
        explanation: "Merge sort always splits the array in half (log N levels) and merges them (O(N) operations per level), resulting in O(N log N) time complexity across all cases."
      }
    ]
  },
  'quick-sort': {
    title: 'Quick Sort',
    category: 'Algorithms',
    wiki: 'https://en.wikipedia.org/wiki/Quicksort',
    famous: 'https://www.geeksforgeeks.org/quick-sort/',
    theory: 'Quick Sort is a Divide and Conquer algorithm. It picks an element as pivot and partitions the given array around the picked pivot. There are many different versions of quickSort that pick pivot in different ways.',
    diagramType: 'quick-sort',
    code: {
      java: `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      cpp: `void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      python: `def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
    },
    output: "Sorted Array: [5, 9, 21, 32]",
    quiz: [
      {
        question: "What is the worst-case time complexity of Quick Sort?",
        options: ["O(N)", "O(N log N)", "O(N^2)", "O(2^N)"],
        correct: 2,
        explanation: "Quick sort's worst-case time complexity is O(N^2), occurring when the partitioning is highly unbalanced (e.g. sorted array with first or last element as pivot)."
      }
    ]
  }
};

export default function Tutorials({ setActiveTab }) {
  const { addXP, activeTutorialTopic: selectedTopic, setActiveTutorialTopic: setSelectedTopic } = useApp();
  const [activeLang, setActiveLang] = useState('java');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState({});

  // Visual state controls
  const [llNodes, setLlNodes] = useState([10, 20, 30]);
  const [stackItems, setStackItems] = useState([10, 20]);
  const [queueItems, setQueueItems] = useState([10, 20]);
  const [treeRoot, setTreeRoot] = useState(10);
  const [bsPointers, setBsPointers] = useState({ low: 0, mid: 3, high: 6, target: 40 });
  const [lsCurrent, setLsCurrent] = useState(0);
  const [bubbleArr, setBubbleArr] = useState([8, 2, 5, 1]);

  const activeTopicData = TUTORIAL_DATA[selectedTopic] || TUTORIAL_DATA['linked-list'];

  const handleQuizAnswer = (qIndex, optIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [`${selectedTopic}_${qIndex}`]: optIndex
    }));
  };

  const submitQuiz = () => {
    let score = 0;
    activeTopicData.quiz.forEach((q, idx) => {
      if (quizAnswers[`${selectedTopic}_${idx}`] === q.correct) {
        score++;
      }
    });

    setQuizSubmitted(prev => ({ ...prev, [selectedTopic]: true }));
    const earnedXp = score * 15;
    if (earnedXp > 0) {
      addXP(earnedXp);
    }
  };

  const handleAiRedirect = () => {
    localStorage.setItem('bw_ai_prefill', `Explain the concept of ${activeTopicData.title} in ${activeLang} programming with an easy analogy and code sample.`);
    setActiveTab('ai-tutor');
  };

  const renderVisualSimulator = () => {
    switch (activeTopicData.diagramType) {
      case 'linked-list':
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Dynamic Node Chain</h4>
            <div className="flex flex-wrap items-center justify-center gap-3 py-4 min-h-[70px] w-full">
              {llNodes.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex border border-slate-200 rounded-lg bg-white divide-x divide-slate-150 overflow-hidden shadow-sm">
                    <div className="p-2.5 font-bold text-slate-800 text-xs">{val}</div>
                    <div className="p-2.5 text-[9px] text-slate-400 font-mono flex items-center">
                      {idx === llNodes.length - 1 ? 'NULL' : 'ptr➔'}
                    </div>
                  </div>
                  {idx !== llNodes.length - 1 && (
                    <div className="text-slate-400 font-bold text-xs">➔</div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-2 mt-4 w-full max-w-sm">
              <button onClick={() => setLlNodes(prev => [Math.floor(Math.random() * 90) + 10, ...prev])} className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-1.5 rounded text-xs transition cursor-pointer">Insert Head</button>
              <button onClick={() => setLlNodes(prev => [...prev, Math.floor(Math.random() * 90) + 10])} className="flex-1 bg-electric-blue hover:bg-electric-blue/90 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">Insert Tail</button>
              <button onClick={() => setLlNodes(prev => prev.slice(1))} disabled={llNodes.length <= 1} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded text-xs transition disabled:opacity-40">Pop Head</button>
            </div>
          </div>
        );

      case 'stack':
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Dynamic LIFO Stack</h4>
            <div className="flex gap-8 items-center justify-center w-full max-w-sm">
              <div className="w-28 h-36 border-b-2 border-x-2 border-slate-350 rounded-b-lg flex flex-col justify-end p-1.5 gap-1 bg-white">
                {stackItems.length === 0 ? (
                  <span className="text-[9px] text-slate-400 font-mono text-center mb-12">Empty</span>
                ) : (
                  [...stackItems].reverse().map((item, idx) => (
                    <div key={idx} className={`py-1 text-center rounded font-bold text-xs transition-all ${idx === 0 ? 'bg-amber-100 border border-amber-250 text-amber-800' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
                      {item} {idx === 0 && ' (TOP)'}
                    </div>
                  ))
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => stackItems.length < 4 && setStackItems(prev => [...prev, Math.floor(Math.random() * 90) + 10])} disabled={stackItems.length >= 4} className="bg-electric-blue hover:bg-electric-blue/90 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition disabled:opacity-40">Push Element</button>
                <button onClick={() => setStackItems(prev => prev.slice(0, -1))} disabled={stackItems.length === 0} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs transition disabled:opacity-40">Pop Element</button>
              </div>
            </div>
          </div>
        );

      case 'queue':
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Dynamic FIFO Queue</h4>
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex border-2 border-slate-350 bg-white rounded-lg p-1.5 min-w-[200px] justify-start divide-x divide-slate-150">
                {queueItems.length === 0 ? (
                  <span className="text-[9px] text-slate-400 font-mono p-2">Queue is Empty</span>
                ) : (
                  queueItems.map((val, idx) => (
                    <div key={idx} className={`px-4 py-2 font-bold text-xs ${idx === 0 ? 'bg-emerald-50 text-emerald-600' : 'text-slate-700'}`}>
                      {val} {idx === 0 && '(FRONT)'}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => queueItems.length < 5 && setQueueItems(prev => [...prev, Math.floor(Math.random() * 90) + 10])} className="bg-electric-blue hover:bg-electric-blue/90 text-white font-bold px-3 py-1.5 rounded text-xs">Enqueue</button>
                <button onClick={() => setQueueItems(prev => prev.slice(1))} disabled={queueItems.length === 0} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded text-xs disabled:opacity-45">Dequeue</button>
              </div>
            </div>
          </div>
        );

      case 'binary-tree':
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Binary Tree Hierarchy</h4>
            <div className="flex flex-col items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-electric-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">{treeRoot}</div>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="h-0.5 w-6 bg-slate-350 transform -rotate-45 mb-1" />
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-650 flex items-center justify-center font-bold text-xs border border-slate-300">5</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-0.5 w-6 bg-slate-350 transform rotate-45 mb-1" />
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-650 flex items-center justify-center font-bold text-xs border border-slate-300">15</div>
                </div>
              </div>
              <button onClick={() => setTreeRoot(Math.floor(Math.random() * 90) + 10)} className="mt-4 px-3 py-1 border border-slate-200 rounded text-slate-750 text-xs bg-white hover:bg-slate-50 font-bold">Randomize Root</button>
            </div>
          </div>
        );

      case 'binary-search':
        const arr = [10, 15, 22, 35, 40, 56, 70];
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Interval Search narrowing</h4>
            <div className="flex items-center gap-1.5 mb-4">
              {arr.map((val, idx) => {
                const isLow = idx === bsPointers.low;
                const isHigh = idx === bsPointers.high;
                const isMid = idx === bsPointers.mid;
                let bgStyle = "bg-white text-slate-800 border-slate-200";
                if (isMid) bgStyle = "bg-electric-blue text-white border-electric-blue shadow-sm";
                else if (isLow || isHigh) bgStyle = "bg-amber-100 text-amber-800 border-amber-300";

                return (
                  <div key={idx} className={`w-10 py-2 border rounded-lg text-center font-bold text-xs flex flex-col items-center ${bgStyle}`}>
                    <span>{val}</span>
                    <span className="text-[7px] font-mono leading-none mt-1 uppercase">
                      {isMid && 'mid'}
                      {isLow && 'low'}
                      {isHigh && 'high'}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBsPointers({ low: 0, mid: 1, high: 3, target: 40 })} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50">Step Lower half</button>
              <button onClick={() => setBsPointers({ low: 4, mid: 5, high: 6, target: 40 })} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50">Step Upper half</button>
              <button onClick={() => setBsPointers({ low: 0, mid: 3, high: 6, target: 40 })} className="px-3 py-1 bg-slate-200 rounded text-xs font-semibold hover:bg-slate-250">Reset Pointers</button>
            </div>
          </div>
        );

      case 'linear-search':
        const lsArr = [12, 45, 8, 9, 33, 72, 10];
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Sequential Scan (Target: 33)</h4>
            <div className="flex gap-2 mb-4">
              {lsArr.map((val, idx) => (
                <div key={idx} className={`w-9 py-2 rounded border text-center font-bold text-xs ${idx === lsCurrent ? 'border-amber-400 bg-amber-50 text-amber-800 scale-105' : idx < lsCurrent ? 'border-slate-200 bg-white text-slate-400' : 'border-slate-200 bg-white text-slate-700'}`}>
                  {val}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLsCurrent(prev => (prev + 1) % lsArr.length)} className="px-3.5 py-1 bg-electric-blue text-white rounded text-xs font-bold">Next Scan step</button>
              <button onClick={() => setLsCurrent(0)} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs hover:bg-slate-50">Reset Scan</button>
            </div>
          </div>
        );

      case 'bubble-sort':
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Adjacent Item Swapping</h4>
            <div className="flex gap-3.5 items-end justify-center py-4 h-24">
              {bubbleArr.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-8 bg-electric-blue rounded-t border border-electric-blue/40 flex items-center justify-center text-[10px] text-white font-bold" style={{ height: `${val * 15}px` }}>
                    {val}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono mt-1">idx {idx}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBubbleArr([2, 8, 5, 1])} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs">Run 1st swap step</button>
              <button onClick={() => setBubbleArr([1, 2, 5, 8])} className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs font-bold">Skip to Sorted</button>
              <button onClick={() => setBubbleArr([8, 2, 5, 1])} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs">Reset array</button>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
            Select standard language compilers below to inspect execution runs.
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Topic Navigation Menu */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-electric-blue" />
              Syllabus Index
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Data Structures</span>
                <div className="space-y-1">
                  {Object.keys(TUTORIAL_DATA).filter(k => TUTORIAL_DATA[k].category === 'Data Structures').map((key) => (
                    <button 
                      key={key}
                      onClick={() => setSelectedTopic(key)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedTopic === key ? 'bg-electric-blue/10 text-electric-blue border-l-2 border-electric-blue' : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      {TUTORIAL_DATA[key].title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Algorithms</span>
                <div className="space-y-1">
                  {Object.keys(TUTORIAL_DATA).filter(k => TUTORIAL_DATA[k].category === 'Algorithms').map((key) => (
                    <button 
                      key={key}
                      onClick={() => setSelectedTopic(key)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedTopic === key ? 'bg-electric-blue/10 text-electric-blue border-l-2 border-electric-blue' : 'text-slate-655 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      {TUTORIAL_DATA[key].title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
            <span className="text-xs text-slate-500 block mb-2 font-medium">Stuck on a topic?</span>
            <button onClick={handleAiRedirect} className="w-full py-2 bg-electric-blue text-white rounded-lg text-xs font-bold hover:opacity-90 transition cursor-pointer">Consult AI Tutor</button>
          </div>
        </aside>

        {/* Right Side: Main Tutorial Panel */}
        <main className="lg:col-span-9 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-electric-blue font-bold tracking-wider uppercase">{activeTopicData.category}</span>
                <h2 className="font-outfit text-xl font-extrabold text-slate-900 mt-1">{activeTopicData.title}</h2>
                
                {/* External Academic Resource Links */}
                <div className="flex items-center gap-2.5 mt-1 text-[10px] font-semibold text-slate-500">
                  <a href={activeTopicData.wiki} target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline inline-flex items-center gap-0.5">
                    Wikipedia Definition
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span>•</span>
                  <a href={activeTopicData.famous} target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline inline-flex items-center gap-0.5">
                    GeeksforGeeks Guide
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                {Object.keys(activeTopicData.code).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition ${activeLang === lang ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-outfit font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                <Lightbulb className="h-4 w-4 text-golden-orange" />
                Theory & Concepts
              </h3>
              <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-150">
                {activeTopicData.theory}
              </p>
            </div>

            <div className="py-2">
              {renderVisualSimulator()}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-outfit font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <Code className="h-4 w-4 text-electric-blue" />
                  Code Reference ({activeLang.toUpperCase()})
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeTopicData.code[activeLang] || activeTopicData.code[Object.keys(activeTopicData.code)[0]]);
                    alert("Code copied!");
                  }}
                  className="text-xs text-electric-blue font-bold hover:underline"
                >
                  Copy
                </button>
              </div>

              <div className="relative rounded-xl border border-slate-200 overflow-hidden font-mono text-[11px] bg-slate-900 p-4 text-cyan-400 max-h-80 overflow-y-auto">
                <pre>{activeTopicData.code[activeLang] || activeTopicData.code[Object.keys(activeTopicData.code)[0]]}</pre>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">EXPECTED OUTPUT</span>
              <pre className="p-3 bg-slate-955 border border-slate-900 rounded-lg font-mono text-xs text-emerald-450">
                {activeTopicData.output}
              </pre>
            </div>

            {/* Quiz */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-outfit font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                <HelpCircle className="h-4 w-4 text-golden-orange" />
                Verify Your Knowledge
              </h3>
              
              <div className="space-y-4">
                {activeTopicData.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-xl border border-slate-150 bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">Q{qIdx + 1}</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5 mb-2.5">{q.question}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const answerKey = `${selectedTopic}_${qIdx}`;
                        const isSelected = quizAnswers[answerKey] === optIdx;
                        const isCorrect = q.correct === optIdx;
                        const submitted = quizSubmitted[selectedTopic];

                        let btnStyle = "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50";
                        if (isSelected && !submitted) btnStyle = "border-electric-blue bg-electric-blue/5 text-electric-blue";
                        if (submitted) {
                          if (isCorrect) btnStyle = "border-emerald-250 bg-emerald-500/5 text-emerald-600";
                          else if (isSelected) btnStyle = "border-red-250 bg-red-500/5 text-red-650";
                          else btnStyle = "border-slate-150 bg-slate-50/30 text-slate-400 opacity-60";
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !submitted && handleQuizAnswer(qIdx, optIdx)}
                            className={`p-2.5 rounded-lg text-left text-xs font-semibold border transition ${btnStyle}`}
                            disabled={submitted}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted[selectedTopic] && (
                      <div className="mt-3 text-[11px] text-slate-500 font-medium p-2.5 bg-white rounded border border-slate-150">
                        <span className="font-bold text-golden-orange">Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted[selectedTopic] ? (
                <button
                  onClick={submitQuiz}
                  className="px-5 py-2 bg-golden-orange hover:bg-golden-orange/90 text-black font-bold rounded-lg text-xs hover:scale-[1.01] transition cursor-pointer"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                  <CheckCircle className="h-4.5 w-4.5" />
                  Correct Answers verified! XP rewarded.
                </div>
              )}
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
