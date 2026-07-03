"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_DAYS } from "@/data/mockDays";
import { getPatternBadgeStyle, getDifficultyStyle } from "@/lib/badgeStyle";
import { MagnifyingGlass, CheckCircle, Circle, ArrowUpRight } from "@phosphor-icons/react";

interface FlattenedProblem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  done: boolean;
  dayId: number;
  pattern: string;
}

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const allProblems: FlattenedProblem[] = MOCK_DAYS.flatMap((day) =>
    day.problems.map((p) => ({
      ...p,
      dayId: day.id,
      pattern: day.pattern,
    }))
  );

  const totalProblems = allProblems.length;
  const solvedProblems = allProblems.filter((p) => p.done).length;

  const patterns = ["All", ...Array.from(new Set(allProblems.map((p) => p.pattern)))];

  const filteredProblems = allProblems.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      `day ${p.dayId}`.includes(search.toLowerCase());
    const matchesPattern = selectedPattern === "All" || p.pattern === selectedPattern;
    const matchesDifficulty = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "All" ||
      (selectedStatus === "Solved" && p.done) ||
      (selectedStatus === "Unsolved" && !p.done);

    return matchesSearch && matchesPattern && matchesDifficulty && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-sans">Problems</h1>
        <p className="text-text-secondary text-sm">
          <span className="font-mono font-bold text-text-primary">{solvedProblems}</span> of{" "}
          <span className="font-mono font-bold text-text-primary">{totalProblems}</span> problems solved
        </p>
      </div>

      {/* Filter Bar */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center max-w-sm w-full relative">
          <MagnifyingGlass className="absolute left-3 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search problem name or day..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="px-3 py-2 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-focus/20"
          >
            {patterns.map((pat) => (
              <option key={pat} value={pat}>{pat}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-focus/20"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-focus/20"
          >
            <option value="All">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
          </select>
        </div>
      </section>

      {/* Problems Table */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-medium text-text-secondary w-12"></th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Problem</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Day</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Pattern</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Difficulty</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProblems.map((prob, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <button className="text-text-secondary hover:text-signal transition-colors">
                      {prob.done ? <CheckCircle weight="fill" className="w-6 h-6 text-signal" /> : <Circle className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{prob.name}</td>
                  <td className="px-6 py-4">
                    <Link href={`/day/${prob.dayId}`} className="text-focus hover:underline font-semibold text-sm">
                      Day {prob.dayId}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPatternBadgeStyle(prob.pattern)}`}>
                      {prob.pattern}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${getDifficultyStyle(prob.difficulty)}`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={prob.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex text-gray-400 hover:text-focus transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-secondary text-sm">
                    No problems found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
