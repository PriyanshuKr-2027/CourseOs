"use client";

import { useState, useEffect, useMemo } from "react";
import topicsData from "@/data/risingbrain_data.json";
import { getDifficultyStyle } from "@/lib/badgeStyle";
import {
  CheckCircle,
  Circle,
  ArrowUpRight,
  PlayCircle,
  MagnifyingGlass,
  CaretDown,
  CaretUp,
  YoutubeLogo,
  Briefcase,
  Sparkle,
  X,
  PaperPlaneRight
} from "@phosphor-icons/react";

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

export default function PatternSheetPage() {
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({});
  
  // Track which subtopics are expanded
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({});

  // Active subtopic and problem state
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>("");
  const [activeProblemId, setActiveProblemId] = useState<string>("");

  // AI chat drawer state (FAB popover toggle)
  const [isChatOpen, setIsChatOpen] = useState(false);

  // AI chat messages state per problem
  const [chatMessages, setChatMessages] = useState<Record<string, { role: "user" | "assistant"; text: string }[]>>({});
  const [inputMessage, setInputMessage] = useState("");

  // Convert raw JSON data to type Topic[]
  const topics = topicsData as Topic[];

  // Initialize active subtopic and problem on mount or when topics load
  useEffect(() => {
    if (topics.length > 0) {
      for (const topic of topics) {
        if (topic.subtopics.length > 0) {
          const firstSub = topic.subtopics[0];
          setActiveSubtopicId(firstSub.id);
          // Expand the default subtopic
          setExpandedSubtopics(prev => ({ ...prev, [firstSub.id]: true }));
          if (firstSub.problems.length > 0) {
            setActiveProblemId(firstSub.problems[0].id);
          }
          break;
        }
      }
    }
  }, [topics]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dsa_completed_problems");
    if (saved) {
      try {
        setCompletedProblems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleProblem = (id: string) => {
    setCompletedProblems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem("dsa_completed_problems", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleSubtopic = (id: string) => {
    setExpandedSubtopics((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectProblem = (subtopicId: string, problemId: string) => {
    setActiveSubtopicId(subtopicId);
    setActiveProblemId(problemId);
    setExpandedSubtopics(prev => ({ ...prev, [subtopicId]: true }));
  };

  // Extract YouTube Video ID
  const getYoutubeEmbedUrl = (url: string | null) => {
    if (!url) return "";
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_\-]{11})/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    return url;
  };

  // Find active subtopic and active problem objects
  const activeSubtopic = useMemo(() => {
    for (const topic of topics) {
      const sub = topic.subtopics.find(s => s.id === activeSubtopicId);
      if (sub) return sub;
    }
    return null;
  }, [topics, activeSubtopicId]);

  const activeProblem = useMemo(() => {
    if (!activeSubtopic) return null;
    return activeSubtopic.problems.find(p => p.id === activeProblemId) || activeSubtopic.problems[0];
  }, [activeSubtopic, activeProblemId]);

  // Get active chat messages for the selected problem
  const activeChatMessages = useMemo(() => {
    if (!activeProblemId) return [];
    return chatMessages[activeProblemId] || [
      { role: "assistant", text: `Hello! Ask me anything about the problem "${activeProblem?.title || ''}". I can help you with the logic, edge cases, or complexity analysis.` }
    ];
  }, [chatMessages, activeProblemId, activeProblem]);

  const handleSendMessage = (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim() || !activeProblemId) return;

    const currentMsgs = activeChatMessages;
    const newMsgs = [...currentMsgs, { role: "user" as const, text: msg }];
    
    setChatMessages(prev => ({
      ...prev,
      [activeProblemId]: newMsgs
    }));
    if (!textToSend) setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      let reply = "";
      if (msg.toLowerCase().includes("explain") || msg.toLowerCase().includes("approach")) {
        reply = `To solve **${activeProblem?.title}**, we can follow this approach:\n\n1. **Core Strategy**: Utilize the ${activeSubtopic?.title} pattern.\n2. **Algorithm**: Maintain state variables to track our progress, iterating through the inputs.\n3. **Complexity**: Time Complexity is O(N) and Space Complexity is O(1).`;
      } else if (msg.toLowerCase().includes("complexity") || msg.toLowerCase().includes("time")) {
        reply = `For **${activeProblem?.title}**:\n- **Time Complexity**: Typically O(N) since we process each element a constant number of times.\n- **Space Complexity**: O(1) auxiliary space, as we are optimizing space usage inline.`;
      } else {
        reply = `I've analyzed your question about "${msg}" for **${activeProblem?.title}**. Let me know if you would like me to write a code snippet or trace through an example!`;
      }
      
      setChatMessages(prev => ({
        ...prev,
        [activeProblemId]: [...newMsgs, { role: "assistant" as const, text: reply }]
      }));
    }, 1000);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    let total = 0;
    let solved = 0;
    let easyTotal = 0;
    let easySolved = 0;
    let mediumTotal = 0;
    let mediumSolved = 0;
    let hardTotal = 0;
    let hardSolved = 0;

    topics.forEach((topic) => {
      topic.subtopics.forEach((sub) => {
        sub.problems.forEach((prob) => {
          total++;
          const isDone = !!completedProblems[prob.id];
          if (isDone) solved++;

          if (prob.difficulty === "Easy") {
            easyTotal++;
            if (isDone) easySolved++;
          } else if (prob.difficulty === "Medium") {
            mediumTotal++;
            if (isDone) mediumSolved++;
          } else if (prob.difficulty === "Hard") {
            hardTotal++;
            if (isDone) hardSolved++;
          }
        });
      });
    });

    return {
      total,
      solved,
      easyTotal,
      easySolved,
      mediumTotal,
      mediumSolved,
      hardTotal,
      hardSolved
    };
  }, [completedProblems, topics]);

  // Filter topics, subtopics, and problems based on search and filters
  const filteredTopics = useMemo(() => {
    return topics
      .map((topic) => {
        const filteredSubtopics = topic.subtopics
          .map((sub) => {
            const filteredProblems = sub.problems.filter((prob) => {
              const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase());
              const matchesDifficulty =
                selectedDifficulty === "All" || prob.difficulty === selectedDifficulty;
              
              const isDone = !!completedProblems[prob.id];
              const matchesStatus =
                selectedStatus === "All" ||
                (selectedStatus === "Solved" && isDone) ||
                (selectedStatus === "Unsolved" && !isDone);

              return matchesSearch && matchesDifficulty && matchesStatus;
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
  }, [topics, search, selectedDifficulty, selectedStatus, completedProblems]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pattern-Wise DSA Sheet</h1>
        <p className="text-text-secondary text-sm">
          Master Data Structures and Algorithms with the official Rising Brain DSA curriculum.
        </p>
      </div>

      {/* Stats Cards (Reduced size) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between">
          <p className="text-text-secondary text-xs font-medium">Overall Progress</p>
          <div className="mt-1">
            <p className="text-xl font-mono font-bold">
              {stats.solved}
              <span className="text-gray-400 text-sm">/{stats.total}</span>
            </p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-signal h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.solved / (stats.total || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between">
          <p className="text-text-secondary text-xs font-medium">Easy Solved</p>
          <div className="mt-1">
            <p className="text-xl font-mono font-bold text-signal">
              {stats.easySolved}
              <span className="text-gray-400 text-sm">/{stats.easyTotal}</span>
            </p>
            <div className="w-full bg-signal/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-signal h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.easySolved / (stats.easyTotal || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between">
          <p className="text-text-secondary text-xs font-medium">Medium Solved</p>
          <div className="mt-1">
            <p className="text-xl font-mono font-bold text-warning">
              {stats.mediumSolved}
              <span className="text-gray-400 text-sm">/{stats.mediumTotal}</span>
            </p>
            <div className="w-full bg-warning/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-warning h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.mediumSolved / (stats.mediumTotal || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between">
          <p className="text-text-secondary text-xs font-medium">Hard Solved</p>
          <div className="mt-1">
            <p className="text-xl font-mono font-bold text-alert">
              {stats.hardSolved}
              <span className="text-gray-400 text-sm">/{stats.hardTotal}</span>
            </p>
            <div className="w-full bg-alert/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-alert h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.hardSolved / (stats.hardTotal || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Layout (Left Column increased to lg:col-span-7 for large player, Right Column is lg:col-span-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Sticky Video Player - Increased to lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24">
          
          {/* YouTube Video Player or Placeholder */}
          {activeProblem ? (
            (() => {
              const ytEmbedUrl = getYoutubeEmbedUrl(activeProblem.youtubeUrl);
              if (ytEmbedUrl) {
                return (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-sm border border-border relative">
                      <iframe
                        src={ytEmbedUrl}
                        title={`YouTube video player - ${activeProblem.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-surface border border-border rounded-xl shadow-sm">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <YoutubeLogo className="w-4 h-4 text-red-500 animate-pulse" />
                        Currently playing video for: <strong className="text-text-primary">{activeProblem.title}</strong>
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 bg-surface space-y-3 text-center animate-in fade-in duration-300">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full animate-pulse">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg text-text-primary">Videos are coming soon</h3>
                    <p className="text-text-secondary text-sm max-w-sm">
                      A video explanation for <strong className="text-text-primary">{activeProblem.title}</strong> is in production. Check back later!
                    </p>
                  </div>
                );
              }
            })()
          ) : (
            <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 bg-surface space-y-3 text-center">
              <p className="text-text-secondary font-medium">Select a problem to start learning.</p>
            </div>
          )}

        </div>

        {/* Right Column (Search, Filter, Accordion Trees - Decreased to lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-3 bg-surface border border-border p-4 rounded-xl shadow-sm">
            <div className="flex items-center relative w-full">
              <MagnifyingGlass className="absolute left-3 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 transition-all text-sm"
              />
            </div>

            <div className="flex gap-2 w-full">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex-1 px-3 py-2 bg-paper border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-focus/20"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 px-3 py-2 bg-paper border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-focus/20"
              >
                <option value="All">All Status</option>
                <option value="Solved">Solved</option>
                <option value="Unsolved">Unsolved</option>
              </select>
            </div>
          </div>

          {/* Topics Accordion List */}
          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              let totalInTopic = 0;
              let solvedInTopic = 0;
              topic.subtopics.forEach((sub) => {
                sub.problems.forEach((p) => {
                  totalInTopic++;
                  if (completedProblems[p.id]) solvedInTopic++;
                });
              });

              return (
                <div key={topic.id} id={`topic-${topic.id}`} className="space-y-2.5 scroll-mt-20">
                  <div className="border-b border-border pb-1.5 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{topic.title}</h3>
                    <span className="font-mono text-[9px] font-bold text-text-secondary bg-paper px-1.5 py-0.5 rounded border border-border">
                      {solvedInTopic}/{totalInTopic} Done
                    </span>
                  </div>

                  <div className="space-y-2">
                    {topic.subtopics.map((sub) => {
                      const isExpanded = !!expandedSubtopics[sub.id];
                      const solvedInSub = sub.problems.filter((p) => completedProblems[p.id]).length;
                      const totalInSub = sub.problems.length;
                      const percent = Math.round((solvedInSub / (totalInSub || 1)) * 100);

                      return (
                        <div
                          key={sub.id}
                          className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden"
                        >
                          {/* Accordion Trigger (Reduced padding and text size) */}
                          <button
                            onClick={() => toggleSubtopic(sub.id)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/40 transition-colors"
                          >
                            <div className="flex flex-col items-start text-left max-w-[70%]">
                              <h4 className="text-sm font-bold text-text-primary">{sub.title}</h4>
                              <span className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                                {sub.description}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-text-secondary">
                                {solvedInSub}/{totalInSub}
                              </span>
                              {isExpanded ? (
                                <CaretUp className="w-4 h-4 text-text-secondary" />
                              ) : (
                                <CaretDown className="w-4 h-4 text-text-secondary" />
                              )}
                            </div>
                          </button>

                          {/* Accordion Content (Reduced padding and text size) */}
                          {isExpanded && (
                            <div className="border-t border-border bg-paper/10 divide-y divide-border/60">
                              {sub.problems.map((prob) => {
                                const isDone = !!completedProblems[prob.id];
                                const isActive = prob.id === activeProblemId;
                                const isMissingVideo = !prob.youtubeUrl;

                                return (
                                  <div
                                    key={prob.id}
                                    onClick={() => selectProblem(sub.id, prob.id)}
                                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-50/50 transition-colors ${
                                      isActive ? "bg-focus/5 border-l-2 border-focus" : ""
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 max-w-[70%]">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleProblem(prob.id);
                                        }}
                                        className="text-text-secondary hover:text-signal transition-colors focus:outline-none"
                                      >
                                        {isDone ? (
                                          <CheckCircle weight="fill" className="w-5 h-5 text-signal" />
                                        ) : (
                                          <Circle className="w-5 h-5" />
                                        )}
                                      </button>
                                      <div className="flex flex-col">
                                        <span className="font-mono text-xs font-semibold text-text-primary line-clamp-1">
                                          {prob.title}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                          <span className={`text-[8px] font-bold px-1 py-0.2 rounded ${getDifficultyStyle(prob.difficulty)}`}>
                                            {prob.difficulty}
                                          </span>
                                          {isMissingVideo && (
                                            <span className="text-[7px] font-semibold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-100 uppercase">
                                              No Video
                                            </span>
                                          )}
                                          {prob.companies && prob.companies.slice(0, 2).map((c) => (
                                            <span
                                              key={c.id}
                                              className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1 py-0.2 bg-paper border border-border/60 rounded text-text-secondary"
                                              title={c.name}
                                            >
                                              {c.logo ? (
                                                <img src={c.logo} alt="" className="w-2.5 h-2.5 object-contain filter grayscale" />
                                              ) : (
                                                <Briefcase className="w-2 h-2" />
                                              )}
                                              {c.name}
                                            </span>
                                          ))}
                                          {prob.companies && prob.companies.length > 2 && (
                                            <span className="text-[7px] text-text-secondary font-medium">+{prob.companies.length - 2}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                      {prob.youtubeUrl && (
                                        <span title="Watch video solution" className="cursor-pointer">
                                          <YoutubeLogo
                                            weight="fill"
                                            className="w-4 h-4 text-red-500 hover:scale-110 transition-transform"
                                            onClick={() => selectProblem(sub.id, prob.id)}
                                          />
                                        </span>
                                      )}
                                      {prob.practiceUrl && (
                                        <a
                                          href={prob.practiceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-1.5 py-0.2 text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded font-semibold transition-colors"
                                          title="GFG Practice Link"
                                        >
                                          GFG
                                        </a>
                                      )}
                                      <a
                                        href={prob.leetcodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 hover:bg-paper rounded text-text-secondary hover:text-focus transition-colors"
                                        title="Solve on LeetCode"
                                      >
                                        <ArrowUpRight className="w-4 h-4" />
                                      </a>
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
              );
            })}

            {filteredTopics.length === 0 && (
              <div className="text-center py-12 bg-surface border border-border border-dashed rounded-xl space-y-2">
                <p className="font-semibold text-text-primary text-sm">No problems match filters</p>
                <p className="text-text-secondary text-xs">Adjust search query or filter options.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Floating Action Button (FAB) for AI Assistant */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-focus hover:bg-focus/90 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-focus/20 flex items-center justify-center cursor-pointer"
        title="AI Study Assistant"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <Sparkle weight="fill" className="w-6 h-6" />}
      </button>

      {/* Floating AI Chatbox Card */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-50 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Sparkle weight="fill" className="text-focus w-5 h-5 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm text-text-primary">AI Study Assistant</h3>
                <p className="text-[10px] text-text-secondary truncate max-w-[200px]">Discussing: {activeProblem?.title}</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 hover:bg-paper rounded-lg transition-colors border border-border text-text-secondary hover:text-text-primary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Suggestions */}
          <div className="px-4 py-2 border-b border-border/60 bg-paper/20 flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSendMessage("Explain the approach")}
              className="text-[9px] font-semibold px-2 py-1 bg-surface hover:bg-paper rounded border border-border transition-colors text-text-primary whitespace-nowrap cursor-pointer"
            >
              Explain Approach
            </button>
            <button
              onClick={() => handleSendMessage("What is the time complexity?")}
              className="text-[9px] font-semibold px-2 py-1 bg-surface hover:bg-paper rounded border border-border transition-colors text-text-primary whitespace-nowrap cursor-pointer"
            >
              Show Complexity
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {activeChatMessages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl p-3 text-xs whitespace-pre-line leading-relaxed ${
                  msg.role === "user"
                    ? "bg-focus text-white ml-auto"
                    : "bg-paper text-text-primary mr-auto border border-border"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-paper/50 flex gap-2">
            <input
              type="text"
              placeholder={`Ask about ${activeProblem?.title || 'this problem'}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-xs"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2 bg-[#1B1917] text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <PaperPlaneRight weight="fill" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
