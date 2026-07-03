"use client";

import {
  Fire,
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Circle,
  ArrowUpRight,
} from "@phosphor-icons/react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Hero Greeting */}
      <section className="bg-[#FAF7F0] border border-border text-[#1B1917] rounded-2xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Good morning, JD 🔥</h1>
          <p className="text-[#6B655B] font-medium">Day 12 of 92 · 6-day streak. You&apos;re doing great.</p>
        </div>
        <button className="bg-[#1B1917] text-white px-6 py-3 rounded-full font-medium shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 self-start md:self-auto text-sm">
          Continue where you left off
          <ArrowRight weight="bold" />
        </button>
      </section>

      {/* Stats & Heatmap */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border space-y-1">
          <p className="text-text-secondary text-sm font-medium">Total Days Completed</p>
          <p className="text-3xl font-mono font-bold">11<span className="text-gray-400 text-lg">/92</span></p>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border space-y-1">
          <p className="text-text-secondary text-sm font-medium">Problems Solved</p>
          <p className="text-3xl font-mono font-bold">45<span className="text-gray-400 text-lg">/320</span></p>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border space-y-1">
          <p className="text-text-secondary text-sm font-medium">Current Streak</p>
          <p className="text-3xl font-mono font-bold flex items-center gap-2">
            6 <Fire weight="fill" className="text-orange-500 w-6 h-6" />
          </p>
        </div>
        
        {/* Heatmap Widget Placeholder */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
          <p className="text-text-secondary text-sm font-medium">Activity Map</p>
          <div className="grid grid-cols-12 gap-1 mt-2">
            {/* Simple dummy grid for heatmap */}
            {Array.from({ length: 48 }).map((_, i) => {
              const val = (i * 7) % 10;
              const bgColor = val > 7 ? "bg-signal" : val > 4 ? "bg-signal/40" : "bg-gray-100 dark:bg-sidebar";
              return (
                <div key={i} className={`w-3 h-3 rounded-sm ${bgColor}`} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Continue Studying Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Continue Studying</h2>
          <button className="text-sm font-medium text-focus hover:underline">View full plan</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { day: 12, topic: "Sliding Window Maximum", pattern: "Sliding Window", color: "bg-lavender-bg text-lavender-text", progress: 30 },
            { day: 13, topic: "Binary Search Variations", pattern: "Binary Search", color: "bg-mint-bg text-mint-text", progress: 0 },
            { day: 14, topic: "Linked List Reversal", pattern: "Linked List", color: "bg-peach-bg text-peach-text", progress: 0 },
            { day: 15, topic: "Tree Traversals", pattern: "Trees", color: "bg-sky-bg text-sky-text", progress: 0 },
          ].map((item) => (
            <div key={item.day} className="w-full bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.color}`}>
                  {item.pattern}
                </span>
                <h3 className="font-bold mt-3">Day {item.day}</h3>
                <p className="text-text-secondary text-sm line-clamp-1">{item.topic}</p>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-signal h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary font-mono">{item.progress}%</span>
                  <button className="text-focus hover:text-focus/80 transition-colors">
                    <PlayCircle weight="fill" className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Problems Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Your Problems</h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-medium text-text-secondary w-12"></th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Problem</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Pattern</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Difficulty</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: "Longest Substring Without Repeating", pattern: "Sliding Window", patternColor: "bg-lavender-bg text-lavender-text", diff: "Medium", diffColor: "text-warning bg-warning/10", done: true },
                { name: "Minimum Window Substring", pattern: "Sliding Window", patternColor: "bg-lavender-bg text-lavender-text", diff: "Hard", diffColor: "text-alert bg-alert/10", done: false },
                { name: "Find All Anagrams in a String", pattern: "Sliding Window", patternColor: "bg-lavender-bg text-lavender-text", diff: "Medium", diffColor: "text-warning bg-warning/10", done: false },
                { name: "Search in Rotated Sorted Array", pattern: "Binary Search", patternColor: "bg-mint-bg text-mint-text", diff: "Medium", diffColor: "text-warning bg-warning/10", done: false },
              ].map((prob, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <button className="text-text-secondary hover:text-signal transition-colors">
                      {prob.done ? <CheckCircle weight="fill" className="w-6 h-6 text-signal" /> : <Circle className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{prob.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${prob.patternColor}`}>
                      {prob.pattern}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${prob.diffColor}`}>
                      {prob.diff}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="inline-flex text-gray-400 hover:text-focus transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
