"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_DAYS, Day, Problem } from "@/data/mockDays";
import { getPatternBadgeStyle, getDifficultyStyle } from "@/lib/badgeStyle";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  Circle,
  ArrowUpRight,
  FilePdf,
  Sparkle,
  PaperPlaneRight,
} from "@phosphor-icons/react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function DayDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const dayId = parseInt(resolvedParams.id, 10);
  
  const [day, setDay] = React.useState<Day | undefined>(undefined);
  const [notesText, setNotesText] = React.useState("");
  const [problems, setProblems] = React.useState<Problem[]>([]);
  const [chatMessages, setChatMessages] = React.useState<Message[]>([
    { role: "assistant", text: "Hello! Ask me anything about today's topic, problems, or notes. I can also summarize the video for you." }
  ]);
  const [inputMessage, setInputMessage] = React.useState("");

  React.useEffect(() => {
    const foundDay = MOCK_DAYS.find((d) => d.id === dayId);
    if (foundDay) {
      setDay(foundDay);
      setNotesText(foundDay.notes || "");
      setProblems(foundDay.problems);
    }
  }, [dayId]);

  if (!day) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h2 className="text-xl font-bold">Loading Day Content...</h2>
      </div>
    );
  }

  const toggleProblem = (idx: number) => {
    const updated = [...problems];
    updated[idx] = { ...updated[idx], done: !updated[idx].done };
    setProblems(updated);
  };

  const handleSendMessage = (textToSend?: string) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;

    const newMsgs: Message[] = [...chatMessages, { role: "user", text: msg }];
    setChatMessages(newMsgs);
    if (!textToSend) setInputMessage("");

    // Simulate assistant response
    setTimeout(() => {
      let reply = "";
      if (msg.includes("Summarize this video")) {
        reply = `Here is a summary of the video for **Day ${day.id}: ${day.topic}**:\n\n1. **Core Concept**: Introduction to ${day.pattern} and why it's efficient.\n2. **Complexity Analysis**: Discusses Time Complexity O(N) vs O(N²) and Space Complexity O(1).\n3. **Practical Examples**: Highlights common edge cases like empty collections, single element datasets, and extreme bounds.`;
      } else if (msg.includes("Summarize my notes")) {
        reply = notesText.trim() 
          ? `Based on your notes for today:\n\n> "${notesText}"\n\nYou've focused on the key pointer tracking and boundary conditions. Ensure you double-check your pointer comparisons (e.g., \`left < right\`).`
          : "You haven't written any notes for today yet! Write something in the notes box and I'll summarize it.";
      } else if (msg.includes("Explain this pattern")) {
        reply = `The **${day.pattern}** pattern is a highly efficient technique used to optimize array/list operations. By employing structural traversal strategies, we can reduce Time Complexity from nested O(N²) iterations down to a single linear O(N) sweep.`;
      } else {
        reply = `I've analyzed your question about "${msg}". In the context of ${day.pattern}, the key is to ensure we update our states correctly at each iteration. Let me know if you want me to write code snippets for any of the problems listed!`;
      }
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 1000);
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
          {day.youtubeId ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-sm border border-border relative">
              <iframe
                src={`https://www.youtube.com/embed/${day.youtubeId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 bg-surface space-y-3 text-center">
              <p className="text-text-secondary font-medium">No video assigned to this review day.</p>
              <button className="text-xs px-3 py-1.5 bg-paper hover:bg-border rounded-lg border border-border font-medium transition-colors">
                Link YouTube Video
              </button>
            </div>
          )}

          {/* Problem List */}
          <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg">Problems for today</h2>
            {problems.length > 0 ? (
              <div className="divide-y divide-border">
                {problems.map((prob, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleProblem(i)}
                        className="text-text-secondary hover:text-signal transition-colors"
                      >
                        {prob.done ? <CheckCircle weight="fill" className="w-6 h-6 text-signal" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <div>
                        <span className="font-mono text-sm font-semibold">{prob.name}</span>
                        <div className="mt-1 flex gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getDifficultyStyle(prob.difficulty)}`}>
                            {prob.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={prob.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-paper rounded-lg text-text-secondary hover:text-focus transition-colors"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm">No specific problems assigned. Utilize today to revise.</p>
            )}
          </section>

          {/* Notes Section */}
          <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Personal Notes</h2>
              <span className="text-xs text-text-secondary">Autosaved · Just now</span>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
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
          <div className="p-4 border-b border-border flex items-center gap-2 bg-gray-50/50">
            <Sparkle weight="fill" className="text-focus w-5 h-5" />
            <h2 className="font-bold text-sm">AI Study Assistant</h2>
          </div>

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
                className={`max-w-[85%] rounded-2xl p-3 text-sm whitespace-pre-line leading-relaxed ${
                  msg.role === "user"
                    ? "bg-focus text-white ml-auto"
                    : "bg-paper text-text-primary mr-auto border border-border"
                }`}
              >
                {msg.text}
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
