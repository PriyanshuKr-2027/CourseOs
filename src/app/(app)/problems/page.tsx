"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import topicsData from "@/data/risingbrain_data.json";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import {
  MagnifyingGlass,
  CheckCircle,
  Circle,
  ArrowUpRight,
  CaretDown,
  CaretRight,
  NotePencil,
  Bookmark,
  Briefcase,
  X
} from "@phosphor-icons/react";

// Define Interfaces matching risingbrain_data.json structure
interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  leetcodeUrl: string;
  articleUrl: string | null;
  youtubeUrl: string | null;
  practiceUrl: string | null;
  completed: boolean;
  hasNote: boolean;
  isStarred: boolean;
  companies?: Company[];
}

interface Subtopic {
  id: string;
  title: string;
  description: string;
  problems: Problem[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: Subtopic[];
}

// Custom SVGs for LeetCode, YouTube, and Solution Editorial
const LeetcodeIcon = () => (
  <svg className="w-5 h-5 text-[#FFA116]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.411L7.11 5.826a1.373 1.373 0 0 0-.01 1.945L18.89 19.53a1.373 1.373 0 0 0 1.94-.015l5.218-5.381a1.373 1.373 0 0 0-.012-1.946L13.483 0zm-2.82 20.463L4.973 14.77a1.161 1.161 0 0 1 0-1.643l1.516-1.516 5.69 5.69-1.516 1.516a1.161 1.161 0 0 1-1.643 0z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.002 3.002 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SolutionIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

export default function ProblemsPage() {
  const { completedProblems, toggleSheetProblem, loading } = useSupabase();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Accordion open/collapse states
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({});

  // Local storage bookmarks & notes state
  const [starredProblems, setStarredProblems] = useState<Record<string, boolean>>({});
  const [problemNotes, setProblemNotes] = useState<Record<string, string>>({});

  // Notes Modal State
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentNoteProblemId, setCurrentNoteProblemId] = useState("");
  const [currentNoteProblemTitle, setCurrentNoteProblemTitle] = useState("");
  const [noteText, setNoteText] = useState("");

  // Load Starred and Notes from LocalStorage on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStars = localStorage.getItem("dsa_starred_problems");
      if (savedStars) {
        try {
          setStarredProblems(JSON.parse(savedStars));
        } catch (e) {
          console.error("Error loading starred problems:", e);
        }
      }
      const savedNotes = localStorage.getItem("dsa_problem_notes");
      if (savedNotes) {
        try {
          setProblemNotes(JSON.parse(savedNotes));
        } catch (e) {
          console.error("Error loading problem notes:", e);
        }
      }
    }
  }, []);

  // Star / Bookmark toggle
  const toggleBookmark = (probId: string) => {
    const nextStarred = {
      ...starredProblems,
      [probId]: !starredProblems[probId]
    };
    setStarredProblems(nextStarred);
    localStorage.setItem("dsa_starred_problems", JSON.stringify(nextStarred));
  };

  // Note save operation
  const saveNote = (probId: string, text: string) => {
    const nextNotes = {
      ...problemNotes,
      [probId]: text
    };
    setProblemNotes(nextNotes);
    localStorage.setItem("dsa_problem_notes", JSON.stringify(nextNotes));
  };

  // Open Notes Modal
  const openNotesModal = (probId: string, title: string) => {
    setCurrentNoteProblemId(probId);
    setCurrentNoteProblemTitle(title);
    setNoteText(problemNotes[probId] || "");
    setIsNotesModalOpen(true);
  };

  // Handle Save Note from Modal
  const handleSaveNote = () => {
    saveNote(currentNoteProblemId, noteText);
    setIsNotesModalOpen(false);
  };

  // Extract all subtopic/pattern names for filtering
  const allPatterns = useMemo(() => {
    const list = new Set<string>();
    (topicsData as Topic[]).forEach((topic) => {
      topic.subtopics.forEach((sub) => {
        list.add(sub.title);
      });
    });
    return ["All", ...Array.from(list)];
  }, []);

  // Filter Topics -> Subtopics -> Problems
  const filteredTopics = useMemo(() => {
    return (topicsData as Topic[])
      .map((topic) => {
        const filteredSubtopics = topic.subtopics
          .map((sub) => {
            const filteredProblems = sub.problems.filter((prob) => {
              const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase());
              const matchesPattern = selectedPattern === "All" || sub.title === selectedPattern;
              const matchesDifficulty = selectedDifficulty === "All" || prob.difficulty === selectedDifficulty;
              
              const isDone = !!completedProblems[prob.id];
              const matchesStatus =
                selectedStatus === "All" ||
                (selectedStatus === "Solved" && isDone) ||
                (selectedStatus === "Unsolved" && !isDone) ||
                (selectedStatus === "Starred" && !!starredProblems[prob.id]);

              return matchesSearch && matchesPattern && matchesDifficulty && matchesStatus;
            });

            return {
              ...sub,
              problems: filteredProblems
            };
          })
          .filter((sub) => sub.problems.length > 0);

        return {
          ...topic,
          subtopics: filteredSubtopics
        };
      })
      .filter((topic) => topic.subtopics.length > 0);
  }, [search, selectedPattern, selectedDifficulty, selectedStatus, completedProblems, starredProblems]);

  // Auto-expand accordions when searching/filtering
  useEffect(() => {
    if (search || selectedPattern !== "All" || selectedDifficulty !== "All" || selectedStatus !== "All") {
      const autoExpand: Record<string, boolean> = {};
      filteredTopics.forEach((topic) => {
        topic.subtopics.forEach((sub) => {
          autoExpand[sub.id] = true;
        });
      });
      setExpandedSubtopics(autoExpand);
    }
  }, [search, selectedPattern, selectedDifficulty, selectedStatus, filteredTopics]);

  // Calculate stats
  const stats = useMemo(() => {
    let total = 0;
    let solved = 0;
    (topicsData as Topic[]).forEach((topic) => {
      topic.subtopics.forEach((sub) => {
        sub.problems.forEach((prob) => {
          total++;
          if (completedProblems[prob.id]) solved++;
        });
      });
    });
    return { total, solved };
  }, [completedProblems]);

  const toggleSubtopic = (subId: string) => {
    setExpandedSubtopics((prev) => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-focus"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Page Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-sans text-text-primary">Pattern Wise Sheet</h1>
        <p className="text-text-secondary text-sm">
          Master data structures and algorithms topic by topic.
          <span className="ml-3 font-semibold text-text-primary bg-focus/10 text-focus px-2 py-0.5 rounded font-mono text-xs">
            {stats.solved}/{stats.total} Solved
          </span>
        </p>
      </div>

      {/* Filter Bar */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center max-w-sm w-full relative">
          <MagnifyingGlass className="absolute left-3.5 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search problem by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 transition-all text-sm text-text-primary"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="px-4 py-2 bg-paper border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus/20 cursor-pointer"
          >
            <option value="All">All Patterns</option>
            {allPatterns.filter(p => p !== "All").map((pat) => (
              <option key={pat} value={pat}>{pat}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-paper border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus/20 cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-paper border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus/20 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
            <option value="Starred">Starred Only</option>
          </select>
        </div>
      </section>

      {/* Topics & Collapsible Patterns List */}
      <div className="space-y-12">
        {filteredTopics.map((topic) => (
          <div key={topic.id} className="space-y-4">
            {/* Topic Header & Description */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-text-primary">{topic.title}</h2>
              {topic.description && (
                <p className="text-text-secondary text-sm font-sans">{topic.description}</p>
              )}
            </div>

            {/* Subtopics (Patterns) Accordion Cards */}
            <div className="space-y-3">
              {topic.subtopics.map((sub) => {
                const isExpanded = !!expandedSubtopics[sub.id];
                const solvedInSub = sub.problems.filter((p) => completedProblems[p.id]).length;
                const totalInSub = sub.problems.length;
                const isCompleted = solvedInSub === totalInSub && totalInSub > 0;

                return (
                  <div
                    key={sub.id}
                    className={`bg-surface border ${
                      isExpanded ? "border-border" : "border-border/60"
                    } rounded-xl shadow-xs overflow-hidden transition-all duration-200 relative`}
                  >
                    {/* Expanded left border accent */}
                    {isExpanded && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-focus" />
                    )}

                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleSubtopic(sub.id)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 mr-4">
                        <div className={`p-1 rounded-md transition-colors ${
                          isExpanded ? "text-focus" : "text-text-secondary"
                        }`}>
                          {isExpanded ? (
                            <CaretDown className={`w-5 h-5 ${isCompleted ? "text-signal" : ""}`} />
                          ) : (
                            <CaretRight className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-text-primary">{sub.title}</h3>
                          {sub.description && (
                            <p className="text-xs text-text-secondary mt-0.5 font-normal truncate">
                              {sub.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress on Right */}
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`font-mono text-xs font-semibold ${
                          isCompleted ? "text-signal" : "text-text-secondary"
                        }`}>
                          {solvedInSub}/{totalInSub}
                        </span>
                        <div className="w-24 bg-border/40 dark:bg-border/20 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted ? "bg-signal" : "bg-focus/80"
                            }`}
                            style={{ width: `${(solvedInSub / (totalInSub || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Collapsible Problems List */}
                    {isExpanded && (
                      <div className="border-t border-border bg-paper/20 dark:bg-black/10 divide-y divide-border/60">
                        {sub.problems.map((prob) => {
                          const isDone = !!completedProblems[prob.id];
                          const isStarred = !!starredProblems[prob.id];
                          const hasNote = !!problemNotes[prob.id];

                          return (
                            <div
                              key={prob.id}
                              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-colors group"
                            >
                              {/* Checkbox & Problem Info */}
                              <div className="flex items-center gap-4 flex-grow min-w-0 mr-4">
                                <button
                                  onClick={() => toggleSheetProblem(prob.id)}
                                  className="text-text-secondary hover:text-signal transition-colors focus:outline-none cursor-pointer shrink-0"
                                  title={isDone ? "Mark as unsolved" : "Mark as solved"}
                                >
                                  {isDone ? (
                                    <CheckCircle weight="fill" className="w-5.5 h-5.5 text-signal" />
                                  ) : (
                                    <Circle className="w-5.5 h-5.5 text-text-secondary/60 hover:text-text-secondary" />
                                  )}
                                </button>

                                <div className="flex flex-col min-w-0">
                                  <Link
                                    href={`/patterns?problemId=${prob.id}&subtopicId=${sub.id}`}
                                    className="font-mono text-sm font-semibold text-text-primary hover:text-focus transition-colors truncate hover:underline cursor-pointer"
                                    title="Study Problem"
                                  >
                                    {prob.title}
                                  </Link>

                                  {/* Company Badges */}
                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    {prob.companies && prob.companies.slice(0, 3).map((comp) => (
                                      <span
                                        key={comp.id}
                                        className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 bg-surface border border-border/80 rounded-md text-text-secondary shadow-2xs"
                                        title={comp.name}
                                      >
                                        {comp.logo ? (
                                          <img src={comp.logo} alt="" className="w-3 h-3 object-contain rounded-xs filter grayscale dark:invert" />
                                        ) : (
                                          <Briefcase className="w-2.5 h-2.5" />
                                        )}
                                        {comp.name}
                                      </span>
                                    ))}
                                    {prob.companies && prob.companies.length > 3 && (
                                      <span className="text-[9px] text-text-secondary font-medium">
                                        +{prob.companies.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Difficulty Tag */}
                              <div className="shrink-0 mr-6">
                                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                                  prob.difficulty === "Easy"
                                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                                    : prob.difficulty === "Medium"
                                    ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                                    : "text-red-500 bg-red-500/10 border-red-500/20"
                                }`}>
                                  {prob.difficulty}
                                </span>
                              </div>

                              {/* Action Icon Links */}
                              <div className="flex items-center gap-3 shrink-0">
                                {prob.leetcodeUrl ? (
                                  <a
                                    href={prob.leetcodeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-paper dark:hover:bg-white/[0.04] rounded-lg text-text-secondary hover:text-[#FFA116] transition-all duration-200 inline-flex items-center"
                                    title="Solve on LeetCode"
                                  >
                                    <LeetcodeIcon />
                                  </a>
                                ) : (
                                  <span className="p-1.5 text-text-secondary/20 cursor-not-allowed inline-flex items-center" title="LeetCode link unavailable">
                                    <LeetcodeIcon />
                                  </span>
                                )}

                                {prob.youtubeUrl ? (
                                  <a
                                    href={prob.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-paper dark:hover:bg-white/[0.04] rounded-lg text-text-secondary hover:text-red-500 transition-all duration-200 inline-flex items-center"
                                    title="Watch Video Solution"
                                  >
                                    <YoutubeIcon />
                                  </a>
                                ) : (
                                  <span className="p-1.5 text-text-secondary/20 cursor-not-allowed inline-flex items-center" title="Video unavailable">
                                    <YoutubeIcon />
                                  </span>
                                )}

                                <button
                                  onClick={() => openNotesModal(prob.id, prob.title)}
                                  className={`p-1.5 hover:bg-paper dark:hover:bg-white/[0.04] rounded-lg transition-all duration-200 cursor-pointer inline-flex items-center ${
                                    hasNote
                                      ? "text-focus hover:text-focus/80"
                                      : "text-text-secondary hover:text-text-primary"
                                  }`}
                                  title={hasNote ? "Edit Note" : "Add Note"}
                                >
                                  <NotePencil weight={hasNote ? "fill" : "regular"} className="w-5 h-5" />
                                </button>

                                {prob.articleUrl ? (
                                  <a
                                    href={prob.articleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 hover:bg-paper dark:hover:bg-white/[0.04] rounded-lg text-text-secondary hover:text-[#C2571B] transition-all duration-200 inline-flex items-center"
                                    title="Read Article Solution"
                                  >
                                    <SolutionIcon />
                                  </a>
                                ) : (
                                  <span className="p-1.5 text-text-secondary/20 cursor-not-allowed inline-flex items-center" title="Editorial article unavailable">
                                    <SolutionIcon />
                                  </span>
                                )}

                                <button
                                  onClick={() => toggleBookmark(prob.id)}
                                  className={`p-1.5 hover:bg-paper dark:hover:bg-white/[0.04] rounded-lg transition-all duration-200 cursor-pointer inline-flex items-center ${
                                    isStarred
                                      ? "text-yellow-500 hover:text-yellow-400"
                                      : "text-text-secondary hover:text-text-primary"
                                  }`}
                                  title={isStarred ? "Remove Bookmark" : "Bookmark Problem"}
                                >
                                  <Bookmark weight={isStarred ? "fill" : "regular"} className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredTopics.length === 0 && (
          <div className="text-center py-16 bg-surface border border-border border-dashed rounded-2xl space-y-2">
            <p className="font-semibold text-text-primary text-sm">No problems found</p>
            <p className="text-text-secondary text-xs">Adjust your search query or filters.</p>
          </div>
        )}
      </div>

      {/* Notes Editor Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-text-primary text-base">Problem Notes</h3>
                <p className="text-xs text-text-secondary mt-0.5 font-mono font-medium truncate max-w-[320px]">
                  {currentNoteProblemTitle}
                </p>
              </div>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-paper dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input area */}
            <div className="p-6 flex-grow overflow-y-auto">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your notes, key takeaways, edge cases, or complexity details here..."
                className="w-full h-48 p-4 rounded-xl bg-paper border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus/25 resize-none placeholder:text-text-secondary/50 font-sans"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-white/[0.01]">
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="px-4 py-2 border border-border text-text-secondary hover:text-text-primary hover:bg-paper dark:hover:bg-white/[0.02] rounded-lg text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-focus hover:bg-focus/90 text-white font-medium rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
