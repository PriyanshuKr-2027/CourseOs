"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CaretLeft, 
  CheckCircle, 
  Circle,
  Users,
  Shield,
  CalendarBlank,
  BookOpen,
  MagnifyingGlass
} from "@phosphor-icons/react";
import { 
  getUserProgressList, 
  getCurriculumDays,
  getPlanProgress
} from "@/lib/store";
import { getPatternBadgeStyle } from "@/lib/badgeStyle";

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const userId = resolvedParams.id;

  const [user, setUser] = React.useState<any | null>(null);
  const [days, setDays] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectedPattern, setSelectedPattern] = React.useState("All");

  // Load User details and day curriculum
  React.useEffect(() => {
    const userList = getUserProgressList();
    const foundUser = userList.find((u) => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
    }
    setDays(getCurriculumDays());
  }, [userId]);

  // Compute solved state deterministically for mock users, or dynamically for john_doe
  const isProblemSolved = React.useCallback((dayId: number, problemIndex: number, userPercentage: number) => {
    if (userId === "john_doe") {
      const realProgress = getPlanProgress();
      return !!realProgress[`${dayId}_${problemIndex}`];
    }
    
    // Deterministic mock solver based on user progress percentage
    // e.g., if Bob has 61% progress, solve 61% of problems deterministically
    const seed = (dayId * 17 + problemIndex * 31) % 100;
    return seed < userPercentage;
  }, [userId]);

  const getDayProgress = React.useCallback((day: any, userPercentage: number) => {
    const total = day.problems?.length || 0;
    if (total === 0) return 0;
    const solved = day.problems.filter((_: any, idx: number) => isProblemSolved(day.id, idx, userPercentage)).length;
    return Math.round((solved / total) * 100);
  }, [isProblemSolved]);

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-text-secondary text-sm">Loading user progress details...</p>
      </div>
    );
  }

  // Filter list of patterns
  const patterns = ["All", ...Array.from(new Set(days.map((d) => d.pattern)))];

  // Filtered day rows
  const filteredDays = days.filter((day) => {
    const matchesSearch = day.topic.toLowerCase().includes(search.toLowerCase()) || 
      day.problems.some((p: any) => p.name.toLowerCase().includes(search.toLowerCase())) ||
      `day ${day.id}`.includes(search.toLowerCase());
    const matchesPattern = selectedPattern === "All" || day.pattern === selectedPattern;
    return matchesSearch && matchesPattern;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Back to Console Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin")}
          className="p-2 border border-border hover:bg-black/5 rounded-xl transition-all text-text-secondary hover:text-text-primary bg-surface flex items-center justify-center shadow-sm"
        >
          <CaretLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] uppercase font-bold text-focus tracking-wider flex items-center gap-1">
            <Shield weight="fill" className="w-3.5 h-3.5" /> Admin Directory / Audit Log
          </span>
          <h2 className="text-xl font-bold text-text-primary">Learner Progress details</h2>
        </div>
      </div>

      {/* User Info Card */}
      <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full bg-paper p-0.5 border border-border" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-primary">{user.name}</h3>
            <p className="text-xs font-mono text-text-secondary">{user.email}</p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-text-secondary font-medium">
              <span className="flex items-center gap-1"><CalendarBlank className="w-3.5 h-3.5" /> Joined {user.joinedDate}</span>
              <span>·</span>
              <span>Last Active {user.lastActive}</span>
            </div>
          </div>
        </div>

        {/* User Completion statistics */}
        <div className="md:border-l border-border md:pl-8 flex items-center gap-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Curriculum Completed</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-focus">{user.percentage}%</span>
              <span className="text-xs text-text-secondary font-mono">({user.solvedCount}/{user.totalProblems} Solved)</span>
            </div>
            <div className="w-48 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-signal h-full rounded-full" style={{ width: `${user.percentage}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Progress Map Widget */}
      <section className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">Study Tracker Map (Read-Only)</h3>
          <div className="flex items-center gap-4 text-[10px] text-text-secondary font-bold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-100 border border-border"></span> 0%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-signal/40"></span> Partial</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-signal"></span> 100%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-23 gap-2">
          {days.map((day) => {
            const percentage = getDayProgress(day, user.percentage);
            let color = "bg-gray-100 hover:bg-gray-200";
            if (percentage === 100) color = "bg-signal text-white hover:opacity-90";
            else if (percentage > 0) color = "bg-signal/40 text-white hover:opacity-90";

            return (
              <div
                key={day.id}
                title={`Day ${day.id}: ${day.topic} (${percentage}% done)`}
                className={`aspect-square flex items-center justify-center rounded-md font-mono text-xs font-semibold transition-all border border-border/10 cursor-default ${color} ${
                  percentage > 0 ? "text-white" : "text-text-secondary"
                }`}
              >
                {day.id}
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface border border-border p-4 rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <MagnifyingGlass className="absolute left-3 top-2.5 w-4.5 h-4.5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search topics, problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-xs font-semibold"
          />
        </div>

        <select
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value)}
          className="px-3 py-2 bg-paper border border-border rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-focus/20 w-full sm:w-auto"
        >
          {patterns.map((pat) => (
            <option key={pat} value={pat}>{pat}</option>
          ))}
        </select>
      </section>

      {/* Day List Table */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase w-20">Day</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Topic</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Pattern</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase w-32">Problems Solved</th>
                <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase w-32">Day Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDays.map((day) => {
                const total = day.problems?.length || 0;
                const solved = day.problems?.filter((_: any, idx: number) => isProblemSolved(day.id, idx, user.percentage)).length || 0;
                const percentage = getDayProgress(day, user.percentage);

                return (
                  <tr key={day.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-sm">#{day.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-sm">{day.topic}</div>
                      {day.problems?.length > 0 && (
                        <div className="text-xs text-text-secondary mt-1">
                          {day.problems.map((p: any) => p.name).join(" · ")}
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
                  </tr>
                );
              })}
              {filteredDays.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-text-secondary text-sm">
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
