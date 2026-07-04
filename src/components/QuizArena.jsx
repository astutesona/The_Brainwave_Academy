import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Clock, Award, Star, ArrowRight, Play, Flame, HelpCircle, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOCK_QUIZZES = [
  {
    id: 'q-oop',
    title: 'OOP Fundamentals Challenge',
    description: 'Test your understanding of encapsulation, inheritance, polymorphism, and abstraction.',
    difficulty: 'Easy',
    questionsCount: 5,
    questions: [
      {
        question: "Which OOP concept is best described as 'data hiding' using access modifiers?",
        options: ["Polymorphism", "Abstraction", "Encapsulation", "Inheritance"],
        correct: 2,
        explanation: "Encapsulation restricts direct access to fields by using access modifiers (like private) and public getter/setter methods, effectively hiding internal data representation."
      },
      {
        question: "In Java, can a class extend multiple classes?",
        options: ["Yes, always", "No, Java only supports single class inheritance", "Yes, if they are abstract classes", "Yes, if they are in the same package"],
        correct: 1,
        explanation: "Java does not support multiple inheritance with classes to avoid conflicts like the diamond problem. It supports multiple interface inheritance instead."
      },
      {
        question: "What refers to the ability of a method to perform different behaviors based on the object calling it?",
        options: ["Method Overloading", "Encapsulation", "Dynamic Binding / Polymorphism", "Static Declaration"],
        correct: 2,
        explanation: "Dynamic binding (method overriding) resolves the method call at runtime based on the actual object type, demonstrating runtime polymorphism."
      },
      {
        question: "Which of the following access modifiers provides the widest scope of visibility?",
        options: ["protected", "private", "default", "public"],
        correct: 3,
        explanation: "Members declared as 'public' are accessible from any class in any package."
      },
      {
        question: "What is an abstract class in object-oriented programming?",
        options: ["A class that cannot be instantiated and is used as a blueprint", "A class with only static variables", "A class defined inside another class", "A class with public fields only"],
        correct: 0,
        explanation: "Abstract classes are blueprints that cannot be instantiated directly. They are meant to be subclassed and may contain abstract methods."
      }
    ]
  },
  {
    id: 'q-dsa',
    title: 'Data Structures Quickfire',
    description: 'Rapid-fire questions about stacks, queues, linked lists, and tree traversals.',
    difficulty: 'Medium',
    questionsCount: 5,
    questions: [
      {
        question: "Which data structure operates on a First In First Out (FIFO) policy?",
        options: ["Stack", "Queue", "Binary Tree", "Max Heap"],
        correct: 1,
        explanation: "A Queue processes elements in FIFO order, where the first element added is the first one removed (just like a checkout line)."
      },
      {
        question: "What is the worst-case lookup complexity in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
        correct: 2,
        explanation: "For balanced BSTs, the height is bounded by log(N). Hence, lookup, insertion, and deletion are O(log N)."
      },
      {
        question: "Which stack operation retrieves the top element without removing it?",
        options: ["Pop", "Push", "Peek", "Search"],
        correct: 2,
        explanation: "Peek (or top) returns the value of the top element of the stack without modifying the stack structure."
      },
      {
        question: "A doubly linked list node contains how many pointer fields?",
        options: ["One pointer", "Two pointers", "Three pointers", "No pointers"],
        correct: 1,
        explanation: "A doubly linked list node contains two pointer fields: one pointing to the previous node and one pointing to the next node."
      },
      {
        question: "Which sorting algorithm has a guaranteed worst-case time complexity of O(N log N)?",
        options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Merge Sort"],
        correct: 3,
        explanation: "Merge Sort uses a divide-and-conquer strategy which yields O(N log N) in all cases (best, average, and worst)."
      }
    ]
  }
];

export default function QuizArena() {
  const { addXP, unlockBadge } = useApp();
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const timerRef = useRef(null);

  // Timer Countdown Logic
  useEffect(() => {
    if (activeQuiz && !answerLocked && !quizFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setSelectedOpt(-1);
            setAnswerLocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [activeQuiz, currentQIdx, answerLocked, quizFinished]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setAnswerLocked(false);
    setTimeLeft(20);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleOptionClick = (optIdx) => {
    if (answerLocked) return;
    setSelectedOpt(optIdx);
    setAnswerLocked(true);
    clearInterval(timerRef.current);

    const question = activeQuiz.questions[currentQIdx];
    if (optIdx === question.correct) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIdx < activeQuiz.questions.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setAnswerLocked(false);
      setTimeLeft(20);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    const isPerfect = correctCount === activeQuiz.questions.length;
    const baseReward = correctCount * 15;
    const bonusReward = isPerfect ? 50 : 10;
    const totalXp = baseReward + bonusReward;
    
    addXP(totalXp);

    if (isPerfect) {
      unlockBadge('b4');
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }, 100);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      
      {/* Selection screen */}
      {!activeQuiz && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-outfit text-2xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-golden-orange animate-bounce" />
              Quiz Arena
            </h2>
            <p className="text-xs text-slate-500 mt-1">Beat the clock, keep streaks active, and verify concepts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_QUIZZES.map((quiz) => (
              <div 
                key={quiz.id} 
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-blue/30 transition duration-200 flex flex-col justify-between shadow-sm group hover:scale-[1.01]"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      quiz.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-250' : 'bg-amber-55 bg-amber-50 text-amber-600 border border-amber-250'
                    }`}>
                      {quiz.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{quiz.questionsCount} Questions</span>
                  </div>
                  <h3 className="font-outfit text-base font-bold text-slate-800 group-hover:text-electric-blue transition-colors">{quiz.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{quiz.description}</p>
                </div>

                <div className="mt-5 flex justify-between items-center border-t border-slate-100 pt-3.5">
                  <span className="text-[9px] font-bold text-golden-orange uppercase tracking-wider">+15 XP / Correct Answer</span>
                  <button 
                    onClick={() => startQuiz(quiz)}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Start Quiz
                    <Play className="h-3 w-3 fill-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Progress Screen */}
      {activeQuiz && !quizFinished && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 relative">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs text-electric-blue font-bold uppercase tracking-wider">{activeQuiz.title}</span>
              <h3 className="font-outfit text-sm font-bold text-slate-800 mt-0.5">
                Question {currentQIdx + 1} of {activeQuiz.questions.length}
              </h3>
            </div>
            
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all ${
              timeLeft <= 5 ? 'border-red-200 bg-red-50 text-red-650 animate-pulse' : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{timeLeft}s Left</span>
            </div>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-150">
            <div 
              className="h-full bg-gradient-to-r from-electric-blue to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentQIdx + 1) / activeQuiz.questions.length) * 100}%` }}
            />
          </div>

          <div className="py-2">
            <h2 className="font-outfit text-base sm:text-lg font-bold text-slate-800 leading-normal">
              {activeQuiz.questions[currentQIdx].question}
            </h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {activeQuiz.questions[currentQIdx].options.map((opt, idx) => {
              const correctIdx = activeQuiz.questions[currentQIdx].correct;
              const isSelected = selectedOpt === idx;
              const isCorrect = correctIdx === idx;
              
              let btnStyle = "border-slate-200 bg-white text-slate-650 hover:border-slate-350 hover:bg-slate-50";
              
              if (answerLocked) {
                if (isCorrect) {
                  btnStyle = "border-emerald-250 bg-emerald-500/5 text-emerald-600 font-bold";
                } else if (isSelected) {
                  btnStyle = "border-red-250 bg-red-500/5 text-red-650 font-bold";
                } else {
                  btnStyle = "border-slate-100 bg-slate-50/20 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={answerLocked}
                  className={`w-full p-3 text-left text-xs font-semibold rounded-xl border flex items-center justify-between transition duration-150 select-none ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {answerLocked && isCorrect && <Check className="h-4.5 w-4.5 text-emerald-55" />}
                  {answerLocked && isSelected && !isCorrect && <X className="h-4.5 w-4.5 text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Explanation panel */}
          {answerLocked && (
            <div className="mt-3 p-4 rounded-xl border border-slate-200 bg-slate-55 space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-golden-orange">
                <HelpCircle className="h-4 w-4" />
                <span>EXPLANATION</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeQuiz.questions[currentQIdx].explanation}
              </p>
              
              <button 
                onClick={nextQuestion}
                className="flex items-center gap-1 px-4.5 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg text-xs font-bold float-right transition cursor-pointer"
              >
                {currentQIdx === activeQuiz.questions.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <div className="clear-both" />
            </div>
          )}

        </div>
      )}

      {/* Finished Summary */}
      {activeQuiz && quizFinished && (
        <div className="p-6 rounded-2xl bg-white border border-slate-250 shadow-sm text-center space-y-5">
          <Trophy className="h-12 w-12 text-golden-orange mx-auto animate-bounce" />
          
          <div className="space-y-1">
            <h2 className="font-outfit text-xl font-extrabold text-slate-800">Challenge Completed!</h2>
            <p className="text-xs text-slate-450">Finished the {activeQuiz.title}.</p>
          </div>

          <div className="inline-flex flex-col items-center justify-center p-5 border border-slate-200 bg-slate-50 rounded-xl min-w-[180px]">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
            <span className="text-2xl font-extrabold text-slate-850 mt-0.5">
              {correctCount} / {activeQuiz.questions.length}
            </span>
          </div>

          <div className="flex justify-center gap-4 py-2">
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-xl border border-slate-200 min-w-[110px]">
              <span className="text-[9px] text-slate-400 font-semibold">XP GAIN</span>
              <span className="text-sm font-bold text-electric-blue mt-0.5">+{correctCount * 15} XP</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-xl border border-slate-200 min-w-[110px]">
              <span className="text-[9px] text-slate-400 font-semibold">BONUS XP</span>
              <span className="text-sm font-bold text-golden-orange mt-0.5">
                {correctCount === activeQuiz.questions.length ? '+50 XP' : '+10 XP'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-center pt-1.5">
            <button 
              onClick={() => startQuiz(activeQuiz)}
              className="px-4.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-650 transition cursor-pointer"
            >
              Try Again
            </button>
            <button 
              onClick={() => setActiveQuiz(null)}
              className="px-4.5 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Return
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
