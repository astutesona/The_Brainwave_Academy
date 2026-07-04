import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { verifyJWT } from '../utils/jwt';

const AppContext = createContext();

const MOCK_COURSES = [
  {
    id: 'java-oop',
    title: 'Object Oriented Programming in Java',
    category: 'Programming',
    duration: '6 hours',
    difficulty: 'Beginner to Intermediate',
    xpReward: 200,
    progress: 40,
    lessons: [
      { id: 'l1', title: 'Introduction to OOP Concepts', duration: '25m', completed: true },
      { id: 'l2', title: 'Classes and Objects', duration: '35m', completed: true },
      { id: 'l3', title: 'Inheritance & Subclassing', duration: '45m', completed: false },
      { id: 'l4', title: 'Polymorphism & Method Overriding', duration: '50m', completed: false },
      { id: 'l5', title: 'Abstraction & Interfaces', duration: '40m', completed: false },
      { id: 'l6', title: 'Encapsulation & Access Modifiers', duration: '30m', completed: false },
    ],
    notes: 'Complete guide on inheritance, polymorphism, encapsulation, abstraction, and interfaces with UML diagrams.',
    videos: [
      { title: 'OOPs Basics & Implementation', url: 'https://www.youtube.com/embed/t83zBw4gI_4' },
      { title: 'Inheritance vs Composition', url: 'https://www.youtube.com/embed/yLh470O_Szk' }
    ]
  },
  {
    id: 'dsa-fundamentals',
    title: 'Data Structures & Algorithms (DSA)',
    category: 'Programming',
    duration: '15 hours',
    difficulty: 'Intermediate to Advanced',
    xpReward: 500,
    progress: 15,
    lessons: [
      { id: 'd1', title: 'Asymptotic Analysis & Big O', duration: '40m', completed: true },
      { id: 'd2', title: 'Arrays & Dynamic Arrays', duration: '50m', completed: false },
      { id: 'd3', title: 'Singly & Doubly Linked Lists', duration: '60m', completed: false },
      { id: 'd4', title: 'Stack & Queue Implementations', duration: '45m', completed: false },
      { id: 'd5', title: 'Trees, BST, & AVL Traversals', duration: '90m', completed: false },
      { id: 'd6', title: 'Graph representation & BFS/DFS', duration: '120m', completed: false },
    ],
    notes: 'Handwritten notes covering Time/Space Complexity, Array operations, Pointer manipulations, and Recursion trees.',
    videos: [
      { title: 'Introduction to Algorithms', url: 'https://www.youtube.com/embed/z9b5yR29tZs' }
    ]
  },
  {
    id: 'dbms-core',
    title: 'Database Management Systems (DBMS)',
    category: 'Computer Science',
    duration: '8 hours',
    difficulty: 'Intermediate',
    xpReward: 300,
    progress: 0,
    lessons: [
      { id: 'db1', title: 'Relational Model & ER Diagrams', duration: '45m', completed: false },
      { id: 'db2', title: 'SQL Queries, Joins & Subqueries', duration: '75m', completed: false },
      { id: 'db3', title: 'Functional Dependencies & Normalization', duration: '90m', completed: false },
      { id: 'db4', title: 'Transaction Control & ACID Properties', duration: '60m', completed: false },
    ],
    notes: 'Comprehensive DBMS notes, SQL cheatsheets, and ER diagram explanation booklets.',
    videos: [
      { title: 'SQL Joins Explained Visual', url: 'https://www.youtube.com/embed/9yeMcVar3sM' }
    ]
  },
  {
    id: 'operating-systems',
    title: 'Operating Systems (OS)',
    category: 'Computer Science',
    duration: '7 hours',
    difficulty: 'Intermediate',
    xpReward: 300,
    progress: 0,
    lessons: [
      { id: 'os1', title: 'Processes, Threads & Context Switch', duration: '45m', completed: false },
      { id: 'os2', title: 'CPU Scheduling Algorithms', duration: '60m', completed: false },
      { id: 'os3', title: 'Process Sync & Deadlocks', duration: '75m', completed: false },
      { id: 'os4', title: 'Memory Management & Paging', duration: '90m', completed: false },
    ],
    notes: 'Detailed notes on CPU scheduling (FIFO, SJF, Round Robin), Semaphore issues, and Virtual Memory paging algorithms.',
    videos: []
  }
];

const MOCK_PROBLEMS = [
  {
    id: 'p1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    xp: 25,
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    exampleInput: 'nums = [2,7,11,15], target = 9',
    exampleOutput: '[0,1]',
    explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
    defaultCode: {
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write C++ code here\n        return {0, 1};\n    }\n};`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write Java code here\n        return new int[]{0, 1};\n    }\n}`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write Python code here\n        return [0, 1]`,
      javascript: `function twoSum(nums, target) {\n    // Write JavaScript code here\n    return [0, 1];\n}`
    },
    testCases: [
      { input: '[2,7,11,15], 9', output: '[0,1]' },
      { input: '[3,2,4], 6', output: '[1,2]' },
      { input: '[3,3], 6', output: '[0,1]' }
    ]
  },
  {
    id: 'p2',
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    category: 'Linked List',
    xp: 50,
    statement: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    exampleInput: 'head = [1,2,3,4,5]',
    exampleOutput: '[5,4,3,2,1]',
    explanation: 'Reverse the node pointers so that the tail becomes the head.',
    defaultCode: {
      cpp: `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write C++ code here\n        return head;\n    }\n};`,
      java: `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; next = null; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write Java code here\n        return head;\n    }\n}`,
      python: `# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write Python code here\n        return head`,
      javascript: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction reverseList(head) {\n    // Write JavaScript code here\n    return head;\n}`
    },
    testCases: [
      { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: '[1,2]', output: '[2,1]' }
    ]
  },
  {
    id: 'p3',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    xp: 25,
    statement: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    exampleInput: 's = "()"',
    exampleOutput: 'true',
    explanation: 'Simple match brackets.',
    defaultCode: {
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write C++ code here\n        return true;\n    }\n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Write Java code here\n        return true;\n    }\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write Python code here\n        return True`,
      javascript: `function isValid(s) {\n    // Write JavaScript code here\n    return true;\n}`
    },
    testCases: [
      { input: '"()"', output: 'true' },
      { input: '"()[]{}"', output: 'true' },
      { input: '"(]"', output: 'false' }
    ]
  }
];

const MOCK_BADGES = [
  { id: 'b1', name: 'Beginner', desc: 'Welcome aboard! Unlocked by joining.', icon: '🎓', imageUrl: '/badge_beginner.png', unlocked: true },
  { id: 'b2', name: 'Explorer', desc: 'Complete your first coding lesson.', icon: '🧭', imageUrl: '/badge_explorer.jpg', unlocked: false },
  { id: 'b3', name: 'Java Expert', desc: 'Complete the OOP in Java Course.', icon: '☕', imageUrl: '/badge_java_expert.png', unlocked: false },
  { id: 'b4', name: 'Quiz Master', desc: 'Score 100% on any Quiz Arena challenge.', icon: '🎯', imageUrl: '/badge_quiz_master.jpg', unlocked: false },
  { id: 'b5', name: 'DSA King', desc: 'Solve all DSA Practice Problems.', icon: '👑', imageUrl: '/badge_dsa_king.jpg', unlocked: false },
  { id: 'b6', name: 'BrainWave Legend', desc: 'Accumulate more than 1000 XP.', icon: '🧠', imageUrl: '/badge_brainwave_legend.jpg', unlocked: false },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('bw_token');
    const verified = token ? verifyJWT(token, 'brainwave_secret_key') : null;
    const name = verified ? verified.name : 'Future Developer';

    const saved = localStorage.getItem('bw_user');
    const baseUser = saved ? JSON.parse(saved) : {
      name: 'Future Developer',
      level: 1,
      xp: 150,
      nextLevelXp: 500,
      streak: 5,
      lastActive: new Date().toDateString()
    };
    return {
      ...baseUser,
      name
    };
  });

  const [activeTutorialTopic, setActiveTutorialTopic] = useState('linked-list');

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('bw_courses');
    return saved ? JSON.parse(saved) : MOCK_COURSES;
  });

  const [solvedProblems, setSolvedProblems] = useState(() => {
    const saved = localStorage.getItem('bw_solved');
    return saved ? JSON.parse(saved) : [];
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('bw_badges');
    return saved ? JSON.parse(saved) : MOCK_BADGES;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('bw_certs');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to The BrainWave Academy!', text: 'Start learning OOP, DSA and Computer Science topics visually.', time: 'Just now', type: 'info' },
    { id: 2, title: 'Daily Challenge is Live!', text: 'Complete the quiz today to maintain your 5-day streak!', time: '2 hours ago', type: 'warning' },
  ]);

  const [doubts, setDoubts] = useState(() => {
    const saved = localStorage.getItem('bw_doubts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'd1',
        title: 'Why is multiple inheritance not supported in Java?',
        category: 'OOP',
        content: 'I know Java does not allow extending multiple classes to prevent the Diamond Problem. But can we achieve the same effect using interfaces? How does it avoid the conflict if two interfaces have default methods with the same signature?',
        author: 'CodeNovice',
        upvotes: 18,
        answers: [
          { author: 'JavaExpert', content: 'Yes, default methods can cause conflicts! In Java, if a class implements two interfaces that provide the same default method, the compiler will throw a compilation error. You are forced to override the method in the class and explicitly specify which interface method to call (using InterfaceName.super.methodName()).', upvotes: 12 }
        ],
        timestamp: '1 day ago'
      },
      {
        id: 'd2',
        title: 'What is the time complexity of building a Heap from an array?',
        category: 'DSA',
        content: 'Is it O(N) or O(N log N)? I see different answers online. Can someone explain mathematically why it is O(N)?',
        author: 'AlgorithmicMind',
        upvotes: 24,
        answers: [
          { author: 'DSA_Guru', content: 'It is O(N)! While inserting elements one by one takes O(N log N), building a heap in-place using Floyd\'s bottom-up heapify algorithm takes O(N). This is because the operations occur proportional to the heights of the nodes. Most nodes are near the leaves (height is small), and only a few nodes are near the root (height is log N). The summation of (height * nodes_at_height) converges to O(N).', upvotes: 19 }
        ],
        timestamp: '3 hours ago'
      }
    ];
  });

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem('bw_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bw_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('bw_solved', JSON.stringify(solvedProblems));
  }, [solvedProblems]);

  useEffect(() => {
    localStorage.setItem('bw_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('bw_certs', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('bw_doubts', JSON.stringify(doubts));
  }, [doubts]);

  // Actions
  const addNotification = (title, text, type = 'info') => {
    setNotifications(prev => [
      { id: Date.now(), title, text, time: 'Just now', type },
      ...prev
    ]);
  };

  const addXP = (amount) => {
    setUser(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextLvlXp = prev.nextLevelXp;

      if (newXp >= nextLvlXp) {
        newXp = newXp - nextLvlXp;
        newLevel += 1;
        nextLvlXp = Math.floor(nextLvlXp * 1.5);
        
        // Trigger Level-Up Celebration
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0A84FF', '#FF9F0A', '#ffffff']
          });
          addNotification('🚀 Level Up!', `Congratulations! You reached Level ${newLevel}!`, 'success');
        }, 100);
      }

      // Check for XP Badge
      if (prev.xp + amount >= 1000) {
        unlockBadge('b6');
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextLvlXp
      };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (user.lastActive !== today) {
      setUser(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActive: today
      }));
      addXP(50);
      addNotification('🔥 Streak Active!', 'Your daily streak updated! Earned +50 XP.', 'success');
    }
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev => prev.map(badge => {
      if (badge.id === badgeId && !badge.unlocked) {
        addNotification('🏆 Achievement Unlocked!', `Earned "${badge.name}" badge.`, 'success');
        
        // Small confetti spark
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });

        return { ...badge, unlocked: true };
      }
      return badge;
    }));
  };

  const completeLesson = (courseId, lessonId) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedLessons = course.lessons.map(lesson => {
            if (lesson.id === lessonId && !lesson.completed) {
              addXP(25);
              return { ...lesson, completed: true };
            }
            return lesson;
          });

          const completedCount = updatedLessons.filter(l => l.completed).length;
          const progress = Math.round((completedCount / updatedLessons.length) * 100);

          // Check if first lesson completed
          unlockBadge('b2');

          // Check if course fully completed
          if (progress === 100 && course.progress < 100) {
            addXP(course.xpReward);
            earnCertificate(course.title);
            
            // Check for specific course badges
            if (course.id === 'java-oop') {
              unlockBadge('b3');
            }
          }

          return {
            ...course,
            lessons: updatedLessons,
            progress
          };
        }
        return course;
      });
    });
  };

  const earnCertificate = (courseTitle) => {
    const certId = 'BW-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newCert = {
      id: certId,
      courseTitle,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      studentName: user.name
    };
    
    setCertificates(prev => [...prev, newCert]);
    
    // Large certificate celebration!
    setTimeout(() => {
      let duration = 3 * 1000;
      let end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
      addNotification('🎓 Certificate Earned!', `You received a certificate for completing ${courseTitle}!`, 'success');
    }, 200);
  };

  const solveProblem = (problemId) => {
    if (!solvedProblems.includes(problemId)) {
      setSolvedProblems(prev => [...prev, problemId]);
      const problem = MOCK_PROBLEMS.find(p => p.id === problemId);
      if (problem) {
        addXP(problem.xp);
        addNotification('💻 Code Accepted!', `Passed all test cases for "${problem.title}". +${problem.xp} XP.`, 'success');
      }

      // Check if all problems solved
      const allProblems = MOCK_PROBLEMS.map(p => p.id);
      const isAllSolved = allProblems.every(id => [...solvedProblems, problemId].includes(id));
      if (isAllSolved) {
        unlockBadge('b5');
      }
    }
  };

  const addDoubt = (title, category, content) => {
    const newDoubt = {
      id: 'd' + Date.now(),
      title,
      category,
      content,
      author: user.name,
      upvotes: 0,
      answers: [],
      timestamp: 'Just now'
    };
    setDoubts(prev => [newDoubt, ...prev]);
    addXP(10);
    addNotification('💬 Question Posted', 'Your question has been added to the forum. Earned +10 XP.', 'success');
  };

  const upvoteDoubt = (doubtId) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return { ...d, upvotes: d.upvotes + 1 };
      }
      return d;
    }));
  };

  const answerDoubt = (doubtId, content) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        const newAnswer = {
          author: user.name,
          content,
          upvotes: 0
        };
        addXP(15);
        addNotification('✏️ Answer Posted', 'Thank you for contributing! Earned +15 XP.', 'success');
        return {
          ...d,
          answers: [...d.answers, newAnswer]
        };
      }
      return d;
    }));
  };

  const changeUserName = (newName) => {
    setUser(prev => ({
      ...prev,
      name: newName
    }));
    addNotification('👤 Profile Updated', 'Username successfully changed.', 'success');
  };

  const logout = () => {
    localStorage.removeItem('bw_token');
    setUser(prev => ({
      ...prev,
      name: 'Future Developer'
    }));
    addNotification('👤 Logged Out', 'Your JWT security session has been successfully cleared.', 'info');
  };

  return (
    <AppContext.Provider value={{
      user,
      courses,
      problems: MOCK_PROBLEMS,
      solvedProblems,
      badges,
      certificates,
      notifications,
      doubts,
      activeTutorialTopic,
      setActiveTutorialTopic,
      addXP,
      updateStreak,
      unlockBadge,
      completeLesson,
      solveProblem,
      addDoubt,
      upvoteDoubt,
      answerDoubt,
      changeUserName,
      addNotification,
      earnCertificate,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
