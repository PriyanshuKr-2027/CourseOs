"use client";

import { useState } from "react";
import Link from "next/link";
import { getPatternBadgeStyle } from "@/lib/badgeStyle";
import { MagnifyingGlass, CheckCircle, Circle, PlayCircle } from "@phosphor-icons/react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { Day, Problem } from "@/types";

export default function PlanPage() {
  const [search, setSearch] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { days, planProgress, dayManualDone } = useSupabase();

  const patterns = ["All", ...Array.from(new Set(days.map((d) => d.pattern)))];

  const getDayProgress = (day: Day) => {
    const total = day.problems?.length || 0;
    if (total === 0) {
      return dayManualDone[day.id] ? 100 : 0;
    }
    const solved = day.problems.filter((_: Problem, idx: number) => !!planProgress[`${day.id}_${idx}`]).length;
    return Math.round((solved / total) * 100);
  };

  const filteredDays = days.filter((day) => {
    const matchesSearch = day.topic.toLowerCase().includes(search.toLowerCase()) || 
      day.problems.some((p: Problem) => p.name.toLowerCase().includes(search.toLowerCase())) ||
      `day ${day.id}`.includes(search.toLowerCase());
    const matchesPattern = selectedPattern === "All" || day.pattern === selectedPattern;
    
    const dayProgress = getDayProgress(day);
    
    const matchesStatus = selectedStatus === "All" ||
      (selectedStatus === "Completed" && dayProgress === 100) ||
      (selectedStatus === "Incomplete" && dayProgress < 100);

    return matchesSearch && matchesPattern && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">92-Day Study Plan</h1>
        <p className="text-text-secondary">Jump into any day directly. There is no unlock sequence restrictions.</p>
      </div>

      {/* Full Heatmap Widget */}
      <section className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Curriculum Progress Map</h2>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-sidebar border border-border"></span> 0%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-signal/40"></span> Partial</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-signal"></span> 100%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-23 gap-2">
          {days.map((day) => {
            const percentage = getDayProgress(day);
            
            let color = "bg-gray-100 dark:bg-sidebar hover:bg-gray-200 dark:hover:bg-sidebar/80";
            if (percentage === 100) color = "bg-signal hover:opacity-80";
            else if (percentage > 0) color = "bg-signal/40 hover:opacity-80";

            return (
              <Link
                key={day.id}
                href={`/day/${day.id}`}
                title={`Day ${day.id}: ${day.topic} (${percentage}% done)`}
                className={`aspect-square flex items-center justify-center rounded-md font-mono text-xs font-semibold transition-all border border-border/10 cursor-pointer ${color} ${
                  percentage > 0 ? "text-white" : "text-text-secondary"
                }`}
              >
                {day.id}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Filter Bar */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center max-w-sm w-full relative">
          <MagnifyingGlass className="absolute left-3 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search topics, problems or days..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 transition-all text-sm"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-paper border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-focus/20"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>
      </section>

      {/* Day List Table */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-medium text-text-secondary w-20">Day</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Topic</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Pattern</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Problems</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary w-32">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-text-secondary w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDays.map((day: Day) => {
                const total = day.problems?.length || 0;
                const solved = day.problems ? day.problems.filter((_: Problem, idx: number) => !!planProgress[`${day.id}_${idx}`]).length : 0;
                const percentage = getDayProgress(day);

                return (
                  <tr key={day.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-sm">#{day.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm">{day.topic}</div>
                      {day.problems.length > 0 && (
                        <div className="text-xs text-text-secondary mt-1">
                          {day.problems.map((p: Problem) => p.name).join(" · ")}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPatternBadgeStyle(day.pattern)}`}>
                        {day.pattern}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                      {total > 0 ? `${solved}/${total}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {percentage === 100 ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-signal">
                          <CheckCircle weight="fill" className="w-5 h-5" /> Completed
                        </span>
                      ) : percentage > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-focus">
                          <Circle className="w-5 h-5" /> {percentage}% Done
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <Circle className="w-5 h-5" /> Unstarted
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/day/${day.id}`} className="text-gray-400 hover:text-focus transition-colors">
                        <PlayCircle className="w-8 h-8" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredDays.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-secondary text-sm">
                    No days found matching filter criteria.
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
