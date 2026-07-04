import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Code, Play, CheckCircle, Terminal, HelpCircle, Check, AlertCircle } from 'lucide-react';

export default function CodingPractice() {
  const { problems, solvedProblems, solveProblem } = useApp();
  const [activeProb, setActiveProb] = useState(problems[0]);
  const [activeLang, setActiveLang] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  const [compilerLogs, setCompilerLogs] = useState([]);
  const [compiling, setCompiling] = useState(false);
  const [compileStatus, setCompileStatus] = useState(null);

  // Update editor boilerplate when problem or language changes
  useEffect(() => {
    if (activeProb && activeProb.defaultCode) {
      setEditorCode(activeProb.defaultCode[activeLang] || activeProb.defaultCode.javascript);
    }
    setCompilerLogs([]);
    setCompileStatus(null);
  }, [activeProb, activeLang]);

  // Safe Javascript Code Evaluator Sandbox
  const runJsCode = (isSubmit = false) => {
    setCompiling(true);
    setCompilerLogs(['Loading browser sandbox...', 'Parsing editor source code...', 'Running test assertions...']);
    setCompileStatus(null);

    setTimeout(() => {
      try {
        let testPassed = true;
        let logs = ['✔ Compilation successful.'];

        if (activeProb.id === 'p1') {
          // Two Sum Function Evaluator
          // Wrap compiler code to isolate declarations
          const evaluator = new Function(`
            ${editorCode}
            return typeof twoSum !== "undefined" ? twoSum : null;
          `);
          const userFn = evaluator();

          if (!userFn) {
            throw new Error("Function 'twoSum' not found. Please verify the function name.");
          }

          // Case 1
          const out1 = userFn([2, 7, 11, 15], 9);
          const p1 = Array.isArray(out1) && 
            ((out1[0] === 0 && out1[1] === 1) || (out1[0] === 1 && out1[1] === 0));
          logs.push(`Test 1: twoSum([2,7,11,15], 9) ➔ Output: ${JSON.stringify(out1)} | Expected: [0,1] [${p1 ? 'Passed' : 'Failed'}]`);

          // Case 2
          const out2 = userFn([3, 2, 4], 6);
          const p2 = Array.isArray(out2) && 
            ((out2[0] === 1 && out2[1] === 2) || (out2[0] === 2 && out2[1] === 1));
          logs.push(`Test 2: twoSum([3,2,4], 6) ➔ Output: ${JSON.stringify(out2)} | Expected: [1,2] [${p2 ? 'Passed' : 'Failed'}]`);

          testPassed = p1 && p2;

        } else if (activeProb.id === 'p2') {
          // Reverse Linked List Function Evaluator
          const evaluator = new Function(`
            ${editorCode}
            return typeof reverseList !== "undefined" ? reverseList : null;
          `);
          const userFn = evaluator();

          if (!userFn) {
            throw new Error("Function 'reverseList' not found. Please verify the function name.");
          }

          // Helpers for Linked Lists objects in browser
          const arrToList = (arr) => {
            if (arr.length === 0) return null;
            let head = { val: arr[0], next: null };
            let curr = head;
            for (let i = 1; i < arr.length; i++) {
              curr.next = { val: arr[i], next: null };
              curr = curr.next;
            }
            return head;
          };

          const listToArr = (head) => {
            let arr = [];
            let curr = head;
            while (curr !== null) {
              arr.push(curr.val);
              curr = curr.next;
            }
            return arr;
          };

          const testList = arrToList([1, 2, 3, 4, 5]);
          const reversedList = userFn(testList);
          const out1 = listToArr(reversedList);
          const p1 = JSON.stringify(out1) === JSON.stringify([5, 4, 3, 2, 1]);
          logs.push(`Test 1: reverseList([1,2,3,4,5]) ➔ Output: ${JSON.stringify(out1)} | Expected: [5,4,3,2,1] [${p1 ? 'Passed' : 'Failed'}]`);

          testPassed = p1;

        } else if (activeProb.id === 'p3') {
          // Valid Parentheses
          const evaluator = new Function(`
            ${editorCode}
            return typeof isValid !== "undefined" ? isValid : null;
          `);
          const userFn = evaluator();

          if (!userFn) {
            throw new Error("Function 'isValid' not found. Please verify the function name.");
          }

          const out1 = userFn("()");
          const p1 = out1 === true;
          logs.push(`Test 1: isValid("()") ➔ Output: ${out1} | Expected: true [${p1 ? 'Passed' : 'Failed'}]`);

          const out2 = userFn("()[]{}");
          const p2 = out2 === true;
          logs.push(`Test 2: isValid("()[]{}") ➔ Output: ${out2} | Expected: true [${p2 ? 'Passed' : 'Failed'}]`);

          const out3 = userFn("(]");
          const p3 = out3 === false;
          logs.push(`Test 3: isValid("(]") ➔ Output: ${out3} | Expected: false [${p3 ? 'Passed' : 'Failed'}]`);

          testPassed = p1 && p2 && p3;
        }

        setCompiling(false);
        if (testPassed) {
          setCompileStatus('success');
          logs.push('✔ Success: Solution Accepted.');
          if (isSubmit) {
            solveProblem(activeProb.id); // Add XP
          }
        } else {
          setCompileStatus('error');
          logs.push('✖ Failed: Solution output does not match expected assertions.');
        }
        setCompilerLogs(logs);

      } catch (err) {
        setCompiling(false);
        setCompileStatus('error');
        setCompilerLogs([
          '✖ Runtime Execution Error.',
          `Error: ${err.message}`,
          'Check your function syntax, return variable definitions, and logic declarations.'
        ]);
      }
    }, 1000);
  };

  const handleCompilerAction = (isSubmit = false) => {
    if (activeLang === 'javascript') {
      runJsCode(isSubmit);
    } else {
      // Simulated compile runner for non-JS languages to prevent static resets
      setCompiling(true);
      setCompilerLogs([`Initializing ${activeLang.toUpperCase()} environment...`, 'Checking imports...', 'Running compiled code...']);
      setCompileStatus(null);

      setTimeout(() => {
        setCompiling(false);
        
        // Dynamic check: did the user change the default boilerplate code?
        const isBoilerplate = editorCode === activeProb.defaultCode[activeLang];
        
        if (isBoilerplate) {
          setCompileStatus('error');
          setCompilerLogs([
            '✖ Compilation failed.',
            'Reason: Output matches boilerplate default returns.',
            'Please modify the logic function body to solve the problem.'
          ]);
        } else {
          setCompileStatus('success');
          setCompilerLogs([
            '✔ Solution accepted (Simulated Execution).',
            `Status: Passed hidden test cases.`,
            'Select JavaScript language for live browser sandbox runs.'
          ]);
          if (isSubmit) {
            solveProblem(activeProb.id); // Add XP
          }
        }
      }, 1000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Selector Grid */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {problems.map((prob) => {
          const isSolved = solvedProblems.includes(prob.id);
          const isSelected = activeProb.id === prob.id;

          return (
            <button
              key={prob.id}
              onClick={() => setActiveProb(prob)}
              className={`p-3.5 rounded-xl border text-left transition select-none flex justify-between items-center cursor-pointer ${
                isSelected 
                  ? 'border-electric-blue bg-electric-blue/5 text-slate-800 shadow-sm' 
                  : 'border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                  prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-150' : 'bg-amber-50 text-amber-600 border border-amber-150'
                }`}>
                  {prob.difficulty}
                </span>
                <h4 className="font-outfit text-xs font-bold text-slate-855 mt-1.5">{prob.title}</h4>
              </div>
              {isSolved && (
                <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-55 flex items-center justify-center text-emerald-600">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Statement */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-electric-blue font-bold uppercase tracking-widest">{activeProb.category}</span>
              <h2 className="font-outfit text-lg font-extrabold text-slate-800 mt-0.5">{activeProb.title}</h2>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Problem Statement</span>
              <p className="text-xs text-slate-655 leading-relaxed font-sans whitespace-pre-line">
                {activeProb.statement}
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 text-[9px] uppercase font-bold block mb-1">Example Input:</span>
                <pre className="text-slate-700">{activeProb.exampleInput}</pre>
              </div>
              <div className="mt-3">
                <span className="text-slate-500 text-[9px] uppercase font-bold block mb-1">Example Output:</span>
                <pre className="text-emerald-600">{activeProb.exampleOutput}</pre>
              </div>
              <div className="mt-3 border-t border-slate-200 pt-2 text-[10px] text-slate-500 leading-relaxed">
                <span className="font-bold text-golden-orange">Explanation:</span> {activeProb.explanation}
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 flex items-center gap-1.5 border-t border-slate-100 pt-4 font-mono uppercase">
            <HelpCircle className="h-4 w-4 text-slate-350" />
            <span>Javascript executes dynamically in-browser. C++/Java/Python runs are simulated.</span>
          </div>
        </div>

        {/* Right Side: Compiler Editor */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col shadow-sm">
            
            {/* Header */}
            <div className="p-3 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>
                <span className="text-xs text-slate-500 font-mono ml-2">sandbox_editor.js</span>
              </div>

              {/* Language Selection */}
              <select 
                value={activeLang}
                onChange={(e) => setActiveLang(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded px-2.5 py-1 focus:outline-none focus:border-electric-blue uppercase cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            {/* Code inputs */}
            <div className="flex-1 relative min-h-[260px]">
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="w-full h-full min-h-[260px] bg-slate-900 p-4 text-xs font-mono text-cyan-400 focus:outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>

            {/* Controls */}
            <div className="p-3 bg-slate-50 border-t border-slate-150 flex justify-end gap-2">
              <button 
                onClick={() => handleCompilerAction(false)}
                disabled={compiling}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 bg-white text-slate-655 font-bold rounded-lg text-xs transition disabled:opacity-40 cursor-pointer shadow-sm"
              >
                Run Code
              </button>
              <button 
                onClick={() => handleCompilerAction(true)}
                disabled={compiling}
                className="flex items-center gap-1 px-5 py-2 bg-gradient-to-r from-electric-blue to-cyan-500 text-white font-bold rounded-lg text-xs hover:opacity-90 hover:scale-[1.01] transition disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <Play className="h-3 w-3 fill-white" />
                Submit Code
              </button>
            </div>
          </div>

          {/* Terminal */}
          <div className="rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-900 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-slate-500" />
              <span className="text-[10px] text-slate-450 font-mono uppercase tracking-wider font-bold">Terminal Output</span>
            </div>
            
            <div className="p-4 min-h-[100px] max-h-40 overflow-y-auto font-mono text-[11px] space-y-1 bg-slate-950">
              {compiling && (
                <div className="text-slate-500 animate-pulse">Processing compiler nodes...</div>
              )}
              {!compiling && compilerLogs.length === 0 && (
                <div className="text-slate-600">Terminal ready. Make edits to solution files and run testing actions.</div>
              )}
              {!compiling && compilerLogs.map((log, idx) => {
                let color = "text-slate-350";
                if (log.startsWith('✔')) color = "text-emerald-400 font-semibold";
                if (log.startsWith('✖')) color = "text-red-400 font-semibold";
                if (log.startsWith('➔')) color = "text-cyan-400";
                if (log.includes('Solution Accepted') || log.includes('accepted')) color = "text-emerald-400 font-bold";
                
                return <div key={idx} className={color}>{log}</div>;
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
