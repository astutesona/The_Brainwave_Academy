import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Check, Play, BookOpen as BookIcon, ChevronDown, ChevronUp, FileText, Video } from 'lucide-react';

export default function Courses() {
  const { courses, completeLesson, addNotification } = useApp();
  const [expandedCourse, setExpandedCourse] = useState('java-oop');
  const [activeVideo, setActiveVideo] = useState(null);
  const [noteHighlighter, setNoteHighlighter] = useState('');

  const handleLessonToggle = (courseId, lessonId) => {
    completeLesson(courseId, lessonId);
  };

  const handleNotesDownload = (course) => {
    addNotification('Notes Downloaded', `Successfully compiled PDF Notes for "${course.title}".`, 'success');
    alert(`Downloading PDF study guide & cheat sheet for ${course.title}...\n\nContains:\n- ${course.notes}\n- High-resolution diagrams & roadmaps.`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-6 text-center sm:text-left">
        <h2 className="font-outfit text-2xl font-extrabold text-slate-800">Visual Course Curriculum</h2>
        <p className="text-xs text-slate-500 mt-1">Complete courses, tick off lessons, watch video lectures, and unlock certificates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Course List */}
        <div className="lg:col-span-8 space-y-4">
          {courses.map((course) => {
            const isExpanded = expandedCourse === course.id;
            return (
              <div 
                key={course.id} 
                className={`rounded-2xl border transition duration-200 overflow-hidden ${
                  isExpanded ? 'border-electric-blue bg-white shadow-sm glow-blue' : 'border-slate-200 bg-white/70'
                }`}
              >
                {/* Course Card Header */}
                <div 
                  onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-50/50 select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-electric-blue/10 border border-electric-blue/20 text-electric-blue px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{course.difficulty}</span>
                    </div>
                    <h3 className="font-outfit text-base font-bold text-slate-800 leading-tight">{course.title}</h3>
                    
                    {/* Course Wikipedia and Famous Reference Links */}
                    {course.id === 'java-oop' && (
                      <div className="flex gap-2 text-[10px] font-semibold text-slate-550 mt-1">
                        <a href="https://en.wikipedia.org/wiki/Object-oriented_programming" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">Wikipedia Article</a>
                        <span>•</span>
                        <a href="https://docs.oracle.com/javase/tutorial/java/concepts/" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">Oracle Official Guide</a>
                      </div>
                    )}
                    {course.id === 'dsa-fundamentals' && (
                      <div className="flex gap-2 text-[10px] font-semibold text-slate-550 mt-1">
                        <a href="https://en.wikipedia.org/wiki/Data_structure" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">Wikipedia Article</a>
                        <span>•</span>
                        <a href="https://www.geeksforgeeks.org/complete-roadmap-to-learn-dsa-from-scratch/" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">GeeksforGeeks Roadmaps</a>
                      </div>
                    )}
                    {course.id === 'dbms-core' && (
                      <div className="flex gap-2 text-[10px] font-semibold text-slate-550 mt-1">
                        <a href="https://en.wikipedia.org/wiki/Database" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">Wikipedia Article</a>
                        <span>•</span>
                        <a href="https://www.geeksforgeeks.org/dbms/" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">GeeksforGeeks DBMS Guide</a>
                      </div>
                    )}
                    {course.id === 'operating-systems' && (
                      <div className="flex gap-2 text-[10px] font-semibold text-slate-550 mt-1">
                        <a href="https://en.wikipedia.org/wiki/Operating_system" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">Wikipedia Article</a>
                        <span>•</span>
                        <a href="https://www.geeksforgeeks.org/operating-systems/" target="_blank" rel="noopener noreferrer" className="text-golden-orange hover:text-amber-600 hover:underline">GeeksforGeeks OS Guide</a>
                      </div>
                    )}
                    
                    {/* Progress */}
                    <div className="flex items-center gap-3 pt-1.5 max-w-md">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-gradient-to-r from-electric-blue to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-650">{course.progress}% Complete</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs text-slate-500 font-medium">{course.lessons.length} lessons</span>
                    <span className="text-xs font-extrabold text-golden-orange">+{course.xpReward} XP</span>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Sections */}
                {isExpanded && (
                  <div className="border-t border-slate-150 p-5 bg-slate-50/30 space-y-5">
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleNotesDownload(course)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer shadow-sm"
                      >
                        <FileText className="h-4 w-4 text-golden-orange" />
                        Download PDF Study Notes
                      </button>
                      
                      {course.videos && course.videos.length > 0 && (
                        <button 
                          onClick={() => setActiveVideo(course.videos[0])}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-electric-blue/5 border border-electric-blue/20 rounded-lg text-xs font-bold text-electric-blue hover:bg-electric-blue/10 transition cursor-pointer"
                        >
                          <Video className="h-4 w-4" />
                          Watch Lecture Video
                        </button>
                      )}
                    </div>

                    {/* Lesson Checklist */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Lesson Checklist (+25 XP each)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {course.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            onClick={() => handleLessonToggle(course.id, lesson.id)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                              lesson.completed 
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' 
                                : 'bg-white border-slate-200 text-slate-750 hover:border-slate-350 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`h-4.5 w-4.5 rounded-md flex items-center justify-center border transition ${
                                lesson.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-350 bg-slate-50'
                              }`}>
                                {lesson.completed && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-semibold leading-tight">{lesson.title}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Lecture Player */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Video className="h-4 w-4 text-electric-blue" />
              Lectures & Playlists
            </h3>

            {activeVideo ? (
              <div className="space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-250 bg-black">
                  <iframe 
                    src={activeVideo.url} 
                    title={activeVideo.title}
                    className="w-full h-full"
                    allowFullScreen 
                  />
                </div>
                <div className="p-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{activeVideo.title}</h4>
                  <button 
                    onClick={() => setActiveVideo(null)} 
                    className="text-[9px] text-slate-400 hover:text-slate-650 mt-1 block"
                  >
                    Close Video Player
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <Play className="h-8 w-8 text-slate-350 mb-2 animate-bounce" />
                <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">Expand a course syllabus and select "Watch Lecture Video" to open the play stream.</p>
              </div>
            )}
          </div>

          {/* Quick study notes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <BookIcon className="h-4 w-4 text-golden-orange" />
              Study Pad
            </h3>
            <span className="text-[9px] text-slate-400 block mb-2 leading-relaxed">Write notes, cheatsheets or class definitions. Saved locally.</span>
            
            <textarea 
              value={noteHighlighter}
              onChange={(e) => setNoteHighlighter(e.target.value)}
              placeholder="e.g. Abstraction = hiding code details and only showing interface signatures."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-electric-blue font-sans resize-none"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
