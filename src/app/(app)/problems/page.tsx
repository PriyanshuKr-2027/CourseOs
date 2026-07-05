"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import topicsData from "@/data/risingbrain_data.json";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { MarkdownRenderer } from "@/components/layout/MarkdownRenderer";
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
  X,
  PlayCircle,
  YoutubeLogo,
  Sparkle,
  PaperPlaneRight,
  Clock,
  Plus,
  ArrowLeft
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

function ProblemsPageContent() {
  const { completedProblems, toggleSheetProblem, getChatHistory, saveChatMessage, isMockMode, profile, loading } = useSupabase();
  const router = useRouter();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Accordion open/collapse states
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({});

  // Active problem selection state (for split-screen layout)
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>("");
  const [activeProblemId, setActiveProblemId] = useState<string>("");

  // AI chat drawer state (FAB popover toggle)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatMessages, setActiveChatMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeSessionId, setActiveSessionId] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [allHistoryMessages, setAllHistoryMessages] = useState<any[]>([]);

  // Local storage bookmarks & notes state
  const [starredProblems, setStarredProblems] = useState<Record<string, boolean>>({});
  const [problemNotes, setProblemNotes] = useState<Record<string, string>>({});

  // Notes Modal State
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [currentNoteProblemId, setCurrentNoteProblemId] = useState("");
  const [currentNoteProblemTitle, setCurrentNoteProblemTitle] = useState("");
  const [noteText, setNoteText] = useState("");

  const searchParams = useSearchParams();
  const urlProblemId = searchParams ? searchParams.get("problemId") : null;
  const urlSubtopicId = searchParams ? searchParams.get("subtopicId") : null;

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

  // Parse URL parameters on load to trigger split-screen study player
  useEffect(() => {
    if (topicsData && topicsData.length > 0) {
      if (urlProblemId && urlSubtopicId) {
        setActiveSubtopicId(urlSubtopicId);
        setExpandedSubtopics((prev) => ({ ...prev, [urlSubtopicId]: true }));
        setActiveProblemId(urlProblemId);

        // Smooth scroll to topic
        setTimeout(() => {
          const parentTopic = (topicsData as Topic[]).find((t) => t.subtopics.some((s) => s.id === urlSubtopicId));
          if (parentTopic) {
            const element = document.getElementById(`topic-${parentTopic.id}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, 300);
      }
    }
  }, [urlProblemId, urlSubtopicId]);

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

  // Find active subtopic and problem objects
  const activeSubtopic = useMemo(() => {
    for (const topic of topicsData as Topic[]) {
      const sub = topic.subtopics.find((s) => s.id === activeSubtopicId);
      if (sub) return sub;
    }
    return null;
  }, [activeSubtopicId]);

  const activeProblem = useMemo(() => {
    if (!activeSubtopic) return null;
    return activeSubtopic.problems.find((p) => p.id === activeProblemId) || activeSubtopic.problems[0];
  }, [activeSubtopic, activeProblemId]);

  // Load chat history when activeProblemId changes
  useEffect(() => {
    if (!activeProblemId) {
      setActiveChatMessages([]);
      return;
    }

    let isMounted = true;
    const loadHistory = async () => {
      const newSid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      setActiveSessionId(newSid);
      setActiveChatMessages([
        { role: "assistant", text: `Hello! Ask me anything about the problem "${activeProblem?.title || ""}". I can help you with the logic, edge cases, or complexity analysis.` }
      ]);

      const history = await getChatHistory({ problemId: activeProblemId });
      if (!isMounted) return;
      setAllHistoryMessages(history);
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [activeProblemId, activeProblem?.title, getChatHistory]);

  // AI chat messaging
  const handleSendMessage = async (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim() || !activeProblemId) return;

    const currentMsgs = activeChatMessages;
    const newMsgs = [...currentMsgs, { role: "user" as const, text: msg }];
    
    setActiveChatMessages(newMsgs);
    if (!textToSend) setInputMessage("");

    await saveChatMessage({ problemId: activeProblemId, role: "user", text: msg, sessionId: activeSessionId });

    let actualPrompt = msg;
    if (msg === "Explain Approach") {
      actualPrompt = `Explain the optimal approach to solve "${activeProblem?.title}". Detail the main algorithm, data structures, and key steps.`;
    } else if (msg === "Show Complexity") {
      actualPrompt = `Detail the time and space complexity of the optimal approach to solve "${activeProblem?.title}". Explain why it has these complexities.`;
    }

    setActiveChatMessages([...newMsgs, { role: "assistant" as const, text: "Thinking..." }]);

    try {
      const formattedHistory = newMsgs.map(m => ({
        role: m.role,
        content: m.role === "user" && m.text === msg ? actualPrompt : m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedHistory,
          dayInfo: {
            id: activeProblem?.id || activeProblemId,
            topic: activeProblem?.title || "DSA Problem",
            pattern: activeSubtopic?.title || "General"
          },
          apiKey: isMockMode ? profile.groqApiKey : undefined
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to query AI assistant");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader available");

      let streamedText = "";
      let buffer = "";

      setActiveChatMessages([...newMsgs, { role: "assistant" as const, text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;
          if (cleanLine.startsWith("data: ")) {
            const dataStr = cleanLine.slice(6).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const data = JSON.parse(dataStr);
              const content = data.choices[0]?.delta?.content || "";
              streamedText += content;
              setActiveChatMessages([...newMsgs, { role: "assistant" as const, text: streamedText }]);
            } catch {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }

      if (streamedText) {
        await saveChatMessage({ problemId: activeProblemId, role: "assistant", text: streamedText, sessionId: activeSessionId });
        getChatHistory({ problemId: activeProblemId }).then(history => {
          setAllHistoryMessages(history);
        });
      }
    } catch (err) {
      setActiveChatMessages([
        ...newMsgs,
        { role: "assistant" as const, text: `Error: ${err instanceof Error ? err.message : "Could not reach assistant."} Please check your Groq API Key settings.` }
      ]);
    }
  };

  const handleStartNewSession = () => {
    const newSid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    setActiveSessionId(newSid);
    setActiveChatMessages([
      { role: "assistant", text: `Hello! Ask me anything about the problem "${activeProblem?.title || ""}". I can help you with the logic, edge cases, or complexity analysis.` }
    ]);
    setShowHistory(false);
  };

  const getSessionsList = () => {
    const grouped: Record<string, any[]> = {};
    allHistoryMessages.forEach((m) => {
      const sid = m.sessionId || "default";
      if (!grouped[sid]) grouped[sid] = [];
      grouped[sid].push(m);
    });

    return Object.entries(grouped).map(([sid, msgs]) => {
      const firstUserMsg = msgs.find((m) => m.role === "user")?.text || "Assistant Chat";
      const date = msgs[0]?.createdAt ? new Date(msgs[0].createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) : "Previous Session";
      return {
        sessionId: sid,
        title: firstUserMsg,
        messages: msgs,
        date
      };
    }).reverse();
  };

  const handleSelectSession = (sid: string, msgs: any[]) => {
    setActiveSessionId(sid);
    setActiveChatMessages(msgs);
    setShowHistory(false);
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

  // Filter Topics -> Subtopics -> Problems
  const filteredTopics = useMemo(() => {
    return (topicsData as Topic[])
      .map((topic) => {
        const filteredSubtopics = topic.subtopics
          .map((sub) => {
            const filteredProblems = sub.problems.filter((prob) => {
              const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase());
              const matchesDifficulty = selectedDifficulty === "All" || prob.difficulty === selectedDifficulty;
              
              const isDone = !!completedProblems[prob.id];
              const matchesStatus =
                selectedStatus === "All" ||
                (selectedStatus === "Solved" && isDone) ||
                (selectedStatus === "Unsolved" && !isDone) ||
                (selectedStatus === "Starred" && !!starredProblems[prob.id]);

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
  }, [search, selectedDifficulty, selectedStatus, completedProblems, starredProblems]);

  // Auto-expand accordions when searching/filtering
  useEffect(() => {
    if (search || selectedDifficulty !== "All" || selectedStatus !== "All") {
      const autoExpand: Record<string, boolean> = {};
      filteredTopics.forEach((topic) => {
        topic.subtopics.forEach((sub) => {
          autoExpand[sub.id] = true;
        });
      });
      setExpandedSubtopics(autoExpand);
    }
  }, [search, selectedDifficulty, selectedStatus, filteredTopics]);

  // Calculate overall stats
  const stats = useMemo(() => {
    let total = 0;
    let solved = 0;
    let easyTotal = 0;
    let easySolved = 0;
    let mediumTotal = 0;
    let mediumSolved = 0;
    let hardTotal = 0;
    let hardSolved = 0;

    (topicsData as Topic[]).forEach((topic) => {
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
  }, [completedProblems]);

  const toggleSubtopic = (subId: string) => {
    setExpandedSubtopics((prev) => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  // Internal selection trigger from the list
  const selectProblem = (subId: string, probId: string) => {
    setActiveSubtopicId(subId);
    setActiveProblemId(probId);
    setExpandedSubtopics((prev) => ({ ...prev, [subId]: true }));
  };

  // Return back to the full-width list mode
  const exitStudyMode = () => {
    setActiveProblemId("");
    setActiveSubtopicId("");
    // Update URL query parameters by pushing current route without query params
    router.push("/problems");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-focus"></div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 1: SPLIT-SCREEN STUDY MODE (Active problem is selected)
  // ----------------------------------------------------
  if (activeProblemId && activeProblem) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
        {/* Dynamic header / title info */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <button
            onClick={exitStudyMode}
            className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-focus transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to All Problems
          </button>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-text-secondary">
              Overall: {stats.solved}/{stats.total} Solved
            </span>
          </div>
        </div>

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Sticky Video Player) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24">
            {activeProblem.youtubeUrl ? (
              (() => {
                const ytEmbedUrl = getYoutubeEmbedUrl(activeProblem.youtubeUrl);
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
                    <div className="flex items-center justify-between px-4 py-2.5 bg-surface border border-border rounded-xl shadow-xs">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5 min-w-0">
                        <YoutubeLogo className="w-4 h-4 text-red-500 shrink-0" />
                        Currently playing: <strong className="text-text-primary truncate">{activeProblem.title}</strong>
                      </span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 bg-surface space-y-3 text-center animate-in fade-in duration-300">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full animate-pulse">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-text-primary">Videos are coming soon</h3>
                <p className="text-text-secondary text-sm max-w-sm">
                  A video explanation for <strong className="text-text-primary">{activeProblem.title}</strong> is in production. Check back later!
                </p>
              </div>
            )}
          </div>

          {/* Right Column (Accordion List & Filters) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-3 bg-surface border border-border p-4 rounded-xl shadow-sm">
              <div className="flex items-center relative w-full">
                <MagnifyingGlass className="absolute left-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 transition-all text-sm text-text-primary"
                />
              </div>

              <div className="flex gap-2 w-full">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="flex-1 px-3 py-2 bg-paper border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-focus/20 cursor-pointer"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 px-3 py-2 bg-paper border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-focus/20 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Solved">Solved</option>
                  <option value="Unsolved">Unsolved</option>
                  <option value="Starred">Starred Only</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <div key={topic.id} id={`topic-${topic.id}`} className="space-y-2.5 scroll-mt-20">
                  <div className="border-b border-border pb-1.5 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{topic.title}</h4>
                  </div>

                  <div className="space-y-2">
                    {topic.subtopics.map((sub) => {
                      const isExpanded = !!expandedSubtopics[sub.id];
                      const solvedInSub = sub.problems.filter((p) => completedProblems[p.id]).length;
                      const totalInSub = sub.problems.length;
                      const isCompleted = solvedInSub === totalInSub && totalInSub > 0;

                      return (
                        <div
                          key={sub.id}
                          className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden"
                        >
                          {/* Accordion Trigger */}
                          <button
                            onClick={() => toggleSubtopic(sub.id)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors"
                          >
                            <div className="flex flex-col items-start text-left max-w-[70%]">
                              <h5 className="text-sm font-bold text-text-primary">{sub.title}</h5>
                              <span className="text-[11px] text-text-secondary mt-0.5 line-clamp-1 font-normal">
                                {sub.description}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`font-mono text-[10px] font-bold ${
                                isCompleted ? "text-signal" : "text-text-secondary"
                              }`}>
                                {solvedInSub}/{totalInSub}
                              </span>
                              {isExpanded ? (
                                <CaretDown className={`w-4 h-4 ${isCompleted ? "text-signal" : "text-text-secondary"}`} />
                              ) : (
                                <CaretRight className="w-4 h-4 text-text-secondary" />
                              )}
                            </div>
                          </button>

                          {/* Accordion Content */}
                          {isExpanded && (
                            <div className="border-t border-border bg-paper/20 dark:bg-black/10 divide-y divide-border/60">
                              {sub.problems.map((prob) => {
                                const isDone = !!completedProblems[prob.id];
                                const isActive = prob.id === activeProblemId;
                                const isStarred = !!starredProblems[prob.id];
                                const hasNote = !!problemNotes[prob.id];

                                return (
                                  <div
                                    key={prob.id}
                                    onClick={() => selectProblem(sub.id, prob.id)}
                                    className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all relative ${
                                      isActive ? "bg-focus/5 dark:bg-focus/10 pl-5" : ""
                                    }`}
                                  >
                                    {/* Active border accent */}
                                    {isActive && (
                                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-focus" />
                                    )}

                                    <div className="flex items-center gap-3.5 max-w-[65%] min-w-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSheetProblem(prob.id);
                                        }}
                                        className="text-text-secondary hover:text-signal transition-colors focus:outline-none cursor-pointer shrink-0"
                                      >
                                        {isDone ? (
                                          <CheckCircle weight="fill" className="w-5 h-5 text-signal" />
                                        ) : (
                                          <Circle className="w-5 h-5" />
                                        )}
                                      </button>
                                      <div className="flex flex-col min-w-0">
                                        <span className="font-mono text-xs font-semibold text-text-primary truncate">
                                          {prob.title}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                          <span className={`text-[8px] font-bold px-1 rounded ${
                                            prob.difficulty === "Easy"
                                              ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
                                              : prob.difficulty === "Medium"
                                              ? "text-amber-500 bg-amber-500/10 border border-amber-500/20"
                                              : "text-red-500 bg-red-500/10 border border-red-500/20"
                                          }`}>
                                            {prob.difficulty}
                                          </span>
                                          {prob.companies && prob.companies.slice(0, 2).map((c) => (
                                            <span
                                              key={c.id}
                                              className="inline-flex items-center gap-0.5 text-[8px] font-semibold px-1 py-0.2 bg-surface border border-border/60 rounded-sm text-text-secondary"
                                              title={c.name}
                                            >
                                              {c.logo ? (
                                                <img src={c.logo} alt="" className="w-2.5 h-2.5 object-contain filter grayscale dark:invert" />
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
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                      {prob.leetcodeUrl ? (
                                        <a
                                          href={prob.leetcodeUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1 hover:bg-paper dark:hover:bg-white/[0.04] rounded text-text-secondary hover:text-[#FFA116] transition-colors"
                                          title="Solve on LeetCode"
                                        >
                                          <LeetcodeIcon />
                                        </a>
                                      ) : (
                                        <span className="p-1 text-text-secondary/20 cursor-not-allowed">
                                          <LeetcodeIcon />
                                        </span>
                                      )}

                                      {prob.youtubeUrl && (
                                        <button
                                          onClick={() => selectProblem(sub.id, prob.id)}
                                          className="p-1 hover:bg-paper dark:hover:bg-white/[0.04] rounded text-text-secondary hover:text-red-500 transition-colors cursor-pointer"
                                          title="Watch Video solution"
                                        >
                                          <YoutubeIcon />
                                        </button>
                                      )}

                                      <button
                                        onClick={() => openNotesModal(prob.id, prob.title)}
                                        className={`p-1 hover:bg-paper dark:hover:bg-white/[0.04] rounded transition-colors cursor-pointer ${
                                          hasNote ? "text-focus hover:text-focus/80" : "text-text-secondary hover:text-text-primary"
                                        }`}
                                        title={hasNote ? "Edit Note" : "Add Note"}
                                      >
                                        <NotePencil weight={hasNote ? "fill" : "regular"} className="w-4.5 h-4.5" />
                                      </button>

                                      {prob.articleUrl ? (
                                        <a
                                          href={prob.articleUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1 hover:bg-paper dark:hover:bg-white/[0.04] rounded text-text-secondary hover:text-[#C2571B] transition-colors"
                                          title="Read Solution Article"
                                        >
                                          <SolutionIcon />
                                        </a>
                                      ) : (
                                        <span className="p-1 text-text-secondary/20 cursor-not-allowed">
                                          <SolutionIcon />
                                        </span>
                                      )}

                                      <button
                                        onClick={() => toggleBookmark(prob.id)}
                                        className={`p-1 hover:bg-paper dark:hover:bg-white/[0.04] rounded transition-colors cursor-pointer ${
                                          isStarred ? "text-yellow-500 hover:text-yellow-400" : "text-text-secondary hover:text-text-primary"
                                        }`}
                                        title={isStarred ? "Remove Star" : "Bookmark Problem"}
                                      >
                                        <Bookmark weight={isStarred ? "fill" : "regular"} className="w-4.5 h-4.5" />
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

        {/* Floating AI Chatbox */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] z-50 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.01] relative">
              <div className="flex items-center gap-2">
                <Sparkle weight="fill" className="text-focus w-5 h-5 animate-pulse" />
                <div>
                  <h3 className="font-bold text-sm text-text-primary">AI Study Assistant</h3>
                  <p className="text-[10px] text-text-secondary truncate max-w-[150px]">Discussing: {activeProblem.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-1 hover:bg-border rounded transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
                  title="Chat History"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button
                  onClick={handleStartNewSession}
                  className="p-1 hover:bg-border rounded transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
                  title="New Chat Session"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 hover:bg-paper rounded-lg transition-colors border border-border text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sessions History List */}
            {showHistory && (
              <div className="border-b border-border bg-[#FAF7F0] dark:bg-[#1E222A] divide-y divide-border/50 max-h-[150px] overflow-y-auto z-10 shrink-0">
                <div className="px-4 py-2 text-[9px] font-bold text-text-secondary uppercase tracking-wider bg-paper/50 flex justify-between items-center">
                  <span>Recent Conversations</span>
                  <button 
                    onClick={handleStartNewSession} 
                    className="text-focus hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" /> New Session
                  </button>
                </div>
                {getSessionsList().length === 0 ? (
                  <div className="p-3 text-[10px] text-text-secondary text-center">No past conversations.</div>
                ) : (
                  getSessionsList().map((session) => (
                    <button
                      key={session.sessionId}
                      onClick={() => handleSelectSession(session.sessionId, session.messages)}
                      className={`w-full text-left px-4 py-2 hover:bg-paper dark:hover:bg-white/[0.02] transition-colors text-[10px] flex flex-col gap-0.5 cursor-pointer ${
                        activeSessionId === session.sessionId ? "bg-white dark:bg-black font-semibold border-l-2 border-focus" : "text-text-primary"
                      }`}
                    >
                      <span className="font-medium truncate">{session.title}</span>
                      <span className="text-[8px] text-text-secondary">{session.date}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Quick Action Suggestions */}
            <div className="px-4 py-2 border-b border-border/60 bg-paper/20 flex gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => handleSendMessage("Explain Approach")}
                className="text-[9px] font-semibold px-2 py-1 bg-surface hover:bg-paper rounded border border-border transition-colors text-text-primary whitespace-nowrap cursor-pointer"
              >
                Explain Approach
              </button>
              <button
                onClick={() => handleSendMessage("Show Complexity")}
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
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-focus text-white ml-auto"
                      : "bg-paper text-text-primary mr-auto border border-border"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-line">{msg.text}</div>
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-paper/50 flex gap-2">
              <input
                type="text"
                placeholder={`Ask about ${activeProblem.title}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-xs"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2 bg-[#1B1917] dark:bg-[#FAF7F0] text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <PaperPlaneRight weight="fill" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

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

  // ----------------------------------------------------
  // LAYOUT 2: FULL-WIDTH PROBLEMS LIST MODE (Default view)
  // ----------------------------------------------------
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

      {/* Stats Summary Cards (High-End visual cards) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl shadow-xs border border-border flex flex-col justify-between">
          <p className="text-text-secondary text-xs font-medium">Overall Progress</p>
          <div className="mt-1">
            <p className="text-xl font-mono font-bold">
              {stats.solved}
              <span className="text-gray-400 text-sm">/{stats.total}</span>
            </p>
            <div className="w-full bg-gray-100 dark:bg-border/40 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-signal h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.solved / (stats.total || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl shadow-xs border border-border flex flex-col justify-between">
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

        <div className="bg-surface p-4 rounded-xl shadow-xs border border-border flex flex-col justify-between">
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

        <div className="bg-surface p-4 rounded-xl shadow-xs border border-border flex flex-col justify-between">
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
                              {/* Checkbox & Problem Info (Clicking title triggers selection & study view) */}
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
                                  <button
                                    onClick={() => selectProblem(sub.id, prob.id)}
                                    className="font-mono text-sm font-semibold text-text-primary hover:text-focus transition-colors truncate hover:underline cursor-pointer text-left focus:outline-none"
                                    title="Open Study Player"
                                  >
                                    {prob.title}
                                  </button>

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
                                  <button
                                    onClick={() => selectProblem(sub.id, prob.id)}
                                    className="p-1.5 hover:bg-paper dark:hover:bg-white/[0.04] rounded-lg text-text-secondary hover:text-red-500 transition-all duration-200 inline-flex items-center cursor-pointer"
                                    title="Open Study Player & Watch Video Solution"
                                  >
                                    <YoutubeIcon />
                                  </button>
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

export default function ProblemsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-focus"></div>
      </div>
    }>
      <ProblemsPageContent />
    </Suspense>
  );
}
