"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Day, Problem } from "@/types";
import { getPatternBadgeStyle, getDifficultyStyle } from "@/lib/badgeStyle";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  Circle,
  ArrowUpRight,
  FilePdf,
  Sparkle,
  PaperPlaneRight,
  PlayCircle,
  YoutubeLogo,
  Clock,
  Plus
} from "@phosphor-icons/react";
import { MarkdownRenderer } from "@/components/layout/MarkdownRenderer";

function getYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function DayDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const dayId = parseInt(resolvedParams.id, 10);

  const { 
    days, 
    planProgress, 
    dayManualDone, 
    dayNotes, 
    loading: providerLoading,
    toggleProblem: providerToggleProblem,
    toggleManualDayDone: providerToggleManualDayDone,
    saveDayNotes: providerSaveDayNotes,
    profile,
    isMockMode,
    getChatHistory,
    saveChatMessage
  } = useSupabase();

  const [notesText, setNotesText] = React.useState("");
  const [activeProblemIndex, setActiveProblemIndex] = React.useState<number>(0);
  const [lastSavedTime, setLastSavedTime] = React.useState<Date | null>(null);
  const day = days.find((d: Day) => d.id === dayId);

  const [prevDayId, setPrevDayId] = React.useState<number | null>(null);
  if (day && dayId !== prevDayId) {
    setPrevDayId(dayId);
    setNotesText(dayNotes[dayId] || "");
    setActiveProblemIndex(0);
  }
  
  const [chatMessages, setChatMessages] = React.useState<Message[]>([
    { role: "assistant", text: "Hello! Ask me anything about today's topic, problems, or notes. I can also summarize the video for you." }
  ]);
  const [inputMessage, setInputMessage] = React.useState("");
  
  // Chat session states
  const [activeSessionId, setActiveSessionId] = React.useState<string>("");
  const [showHistory, setShowHistory] = React.useState(false);
  const [allHistoryMessages, setAllHistoryMessages] = React.useState<any[]>([]);

  // Function to initialize new session ID
  const handleStartNewSession = () => {
    const newSid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    setActiveSessionId(newSid);
    setChatMessages([
      { role: "assistant", text: "Hello! Ask me anything about today's topic, problems, or notes. I can also summarize the video for you." }
    ]);
    setShowHistory(false);
  };

  // Helper to group allHistoryMessages by sessionId
  const getSessionsList = () => {
    const grouped: Record<string, any[]> = {};
    allHistoryMessages.forEach(m => {
      const sid = m.sessionId || "default";
      if (!grouped[sid]) grouped[sid] = [];
      grouped[sid].push(m);
    });

    return Object.entries(grouped).map(([sid, msgs]) => {
      const firstUserMsg = msgs.find(m => m.role === "user")?.text || "Assistant Chat";
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
    }).reverse(); // Most recent first
  };

  const handleSelectSession = (sid: string, msgs: any[]) => {
    setActiveSessionId(sid);
    setChatMessages(msgs);
    setShowHistory(false);
  };

  React.useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      // Start a fresh session ID by default
      const newSid = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      setActiveSessionId(newSid);
      setChatMessages([
        { role: "assistant", text: "Hello! Ask me anything about today's topic, problems, or notes. I can also summarize the video for you." }
      ]);

      const history = await getChatHistory({ dayId });
      if (!isMounted) return;
      setAllHistoryMessages(history);
    };
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [dayId, getChatHistory]);

  if (providerLoading || !day) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h2 className="text-xl font-bold">Loading Day Content...</h2>
      </div>
    );
  }

  // Derive problems solved states
  const problems: Problem[] = day.problems.map((prob: Problem, idx: number) => ({
    ...prob,
    done: !!planProgress[`${dayId}_${idx}`]
  }));

  const manualDone = !!dayManualDone[dayId];

  const toggleProblem = (idx: number) => {
    providerToggleProblem(dayId, idx);
  };

  const toggleManualDayDone = () => {
    providerToggleManualDayDone(dayId);
  };

  const handleNotesChange = (text: string) => {
    setNotesText(text);
    providerSaveDayNotes(dayId, text);
    setLastSavedTime(new Date());
  };

  const formatSavedTime = (time: Date | null): string => {
    if (!time) return "Not saved yet";
    const diffSec = Math.floor((Date.now() - time.getTime()) / 1000);
    if (diffSec < 5) return "Just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;

    const newMsgs: Message[] = [...chatMessages, { role: "user", text: msg }];
    setChatMessages(newMsgs);
    if (!textToSend) setInputMessage("");

    // Save user message to database/localstorage
    await saveChatMessage({ dayId, role: "user", text: msg, sessionId: activeSessionId });

    // Setup helper message mappings for quick actions
    let actualPrompt = msg;
    if (msg === "Summarize this video") {
      actualPrompt = `Please summarize the study video content for Day ${day.id}: ${day.topic}. Identify the main concepts, time complexity discuss, and edge cases.`;
    } else if (msg === "Summarize my notes") {
      actualPrompt = notesText.trim() 
        ? `Here are my personal notes for today: "${notesText}". Can you summarize the core takeaways and suggest what I might have missed or should watch out for?`
        : "Explain what notes I should take for today's topic and problems to maximize revision efficiency.";
    } else if (msg === "Explain this pattern") {
      actualPrompt = `Explain the "${day.pattern}" pattern in detail. Provide a text illustration and explain how it helps optimize algorithms.`;
    }

    // Add temporary assistant thinking message
    setChatMessages([...newMsgs, { role: "assistant", text: "Thinking..." }]);

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
          dayInfo: { id: day.id, topic: day.topic, pattern: day.pattern },
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

      // Clear the "Thinking..." text
      setChatMessages([...newMsgs, { role: "assistant", text: "" }]);

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
              setChatMessages([...newMsgs, { role: "assistant", text: streamedText }]);
            } catch {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }

      // Save assistant message to database/localstorage when done
      if (streamedText) {
        await saveChatMessage({ dayId, role: "assistant", text: streamedText, sessionId: activeSessionId });
        getChatHistory({ dayId }).then(history => {
          setAllHistoryMessages(history);
        });
      }
    } catch (err) {
      setChatMessages([
        ...newMsgs,
        { role: "assistant", text: `Error: ${err instanceof Error ? err.message : "Could not reach assistant."} Please check your Groq API Key settings.` }
      ]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/plan" className="text-sm font-medium text-focus hover:underline flex items-center gap-1">
          <CaretLeft className="w-4 h-4" /> Back to plan
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => day.id > 1 && router.push(`/day/${day.id - 1}`)}
            disabled={day.id <= 1}
            className="p-2 border border-border bg-surface rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <CaretLeft className="w-5 h-5" />
          </button>
          <span className="font-mono text-sm font-semibold">Day {day.id} of 92</span>
          <button
            onClick={() => day.id < 92 && router.push(`/day/${day.id + 1}`)}
            disabled={day.id >= 92}
            className="p-2 border border-border bg-surface rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <CaretRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getPatternBadgeStyle(day.pattern)}`}>
            {day.pattern}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{day.topic}</h1>
      </div>

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Content & Notes) */}
        <div className="lg:col-span-7 space-y-6">
          {/* YouTube Video Player */}
          {problems.length > 0 ? (
            (() => {
              const activeProblem = problems[activeProblemIndex];
              if (!activeProblem) return null;
              const ytId = getYoutubeId(activeProblem.youtubeUrl);
              if (ytId) {
                return (
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-sm border border-border relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        title={`YouTube video player - ${activeProblem.name}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-surface border border-border rounded-xl shadow-sm">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5">
                        <YoutubeLogo className="w-4 h-4 text-red-500" />
                        Currently playing video for: <strong className="text-text-primary">{activeProblem.name}</strong>
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 bg-surface space-y-3 text-center">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full animate-pulse">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg text-text-primary">Videos are coming soon</h3>
                    <p className="text-text-secondary text-sm max-w-sm">
                      A video explanation for <strong className="text-text-primary">{activeProblem.name}</strong> is in production. Check back later!
                    </p>
                  </div>
                );
              }
            })()
          ) : (
            <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 bg-surface space-y-3 text-center">
              <p className="text-text-secondary font-medium">No specific problems assigned to this review day.</p>
            </div>
          )}

          {/* Problem List */}
          <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg">Problems for today</h2>
            {problems.length > 0 ? (
              <div className="space-y-2">
                {problems.map((prob, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveProblemIndex(i)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      i === activeProblemIndex
                        ? "bg-focus/5 border-focus/30 shadow-sm"
                        : "border-transparent hover:bg-paper"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProblem(i);
                        }}
                        className="text-text-secondary hover:text-signal transition-colors focus:outline-none"
                      >
                        {prob.done ? <CheckCircle weight="fill" className="w-6 h-6 text-signal" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-text-primary">{prob.name}</span>
                          {prob.isMissingVideo && (
                            <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                              Videos coming soon
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex gap-2">
                          {prob.difficulty && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getDifficultyStyle(prob.difficulty)}`}>
                              {prob.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {prob.gfgUrl && (
                        <a
                          href={prob.gfgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-[11px] bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#2E7D32] border border-[#A5D6A7] rounded font-semibold transition-colors"
                          title="GFG Practice Link"
                        >
                          GFG
                        </a>
                      )}
                      {prob.leetcodeUrl ? (
                        <a
                          href={prob.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-paper rounded-lg text-text-secondary hover:text-focus transition-colors"
                          title="LeetCode Link"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-text-secondary text-sm">No specific problems assigned. Utilize today to revise.</p>
                <button
                  onClick={toggleManualDayDone}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    manualDone 
                      ? "bg-signal/15 border-signal/30 text-signal hover:bg-signal/20" 
                      : "bg-paper border-border text-text-primary hover:bg-border"
                  }`}
                >
                  {manualDone ? <CheckCircle weight="fill" className="w-5 h-5 text-signal" /> : <Circle className="w-5 h-5" />}
                  {manualDone ? "Day Completed" : "Mark Day as Completed"}
                </button>
              </div>
            )}
          </section>

          {/* Notes Section */}
          <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Personal Notes</h2>
              <span className="text-xs text-text-secondary">
                Autosaved · {lastSavedTime ? formatSavedTime(lastSavedTime) : "Not saved yet"}
              </span>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Write down details, algorithms, or snippets for today's topics..."
              className="w-full min-h-[160px] p-4 bg-paper rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-sans resize-y"
            />
            <div className="flex justify-between items-center pt-2">
              <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-focus transition-colors">
                <FilePdf className="w-4 h-4" /> Import notes from PDF
              </button>
            </div>
          </section>
        </div>

        {/* Right Column (AI Panel) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-2xl flex flex-col h-[650px] shadow-sm overflow-hidden sticky top-24">
          <div className="p-4 border-b border-border flex items-center justify-between bg-gray-50/50 relative">
            <div className="flex items-center gap-2">
              <Sparkle weight="fill" className="text-focus w-5 h-5" />
              <h2 className="font-bold text-sm">AI Study Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-1.5 hover:bg-border rounded-lg transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
                title="Chat History"
              >
                <Clock className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleStartNewSession}
                className="p-1.5 hover:bg-border rounded-lg transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
                title="New Chat Session"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Sessions History List Dropdown */}
          {showHistory && (
            <div className="border-b border-border bg-[#FAF7F0] divide-y divide-border/50 max-h-[200px] overflow-y-auto z-10">
              <div className="px-4 py-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-paper/50 flex justify-between items-center">
                <span>Recent Conversations</span>
                <button 
                  onClick={handleStartNewSession} 
                  className="text-focus hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> New Session
                </button>
              </div>
              {getSessionsList().length === 0 ? (
                <div className="p-4 text-xs text-text-secondary text-center">No past conversations today.</div>
              ) : (
                getSessionsList().map((session) => (
                  <button
                    key={session.sessionId}
                    onClick={() => handleSelectSession(session.sessionId, session.messages)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-paper transition-colors text-xs flex flex-col gap-0.5 cursor-pointer ${
                      activeSessionId === session.sessionId ? "bg-white font-semibold border-l-2 border-focus" : "text-text-primary"
                    }`}
                  >
                    <span className="font-medium truncate">{session.title}</span>
                    <span className="text-[9px] text-text-secondary">{session.date}</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-b border-border flex flex-wrap gap-2">
            <button
              onClick={() => handleSendMessage("Summarize this video")}
              className="text-xs font-semibold px-3 py-1.5 bg-paper hover:bg-border rounded-lg border border-border transition-colors text-text-primary"
            >
              Summarize Video
            </button>
            <button
              onClick={() => handleSendMessage("Summarize my notes")}
              className="text-xs font-semibold px-3 py-1.5 bg-paper hover:bg-border rounded-lg border border-border transition-colors text-text-primary"
            >
              Summarize Notes
            </button>
            <button
              onClick={() => handleSendMessage("Explain this pattern")}
              className="text-xs font-semibold px-3 py-1.5 bg-paper hover:bg-border rounded-lg border border-border transition-colors text-text-primary"
            >
              Explain Pattern
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-focus text-white ml-auto"
                    : "bg-paper text-text-primary mr-auto border border-border"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="whitespace-pre-line">{msg.text}</div>
                ) : (
                  <MarkdownRenderer 
                    content={msg.text} 
                    onInsertToNotes={(code) => {
                      setNotesText(prev => {
                        const newNotes = prev ? `${prev}\n\n${code}` : code;
                        handleNotesChange(newNotes);
                        return newNotes;
                      });
                      alert("Code block inserted into your personal notes!");
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-border bg-paper/50 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about this day's topic..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 bg-focus text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <PaperPlaneRight weight="fill" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
