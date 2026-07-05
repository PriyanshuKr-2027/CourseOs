"use client";

import Link from "next/link";
import { Day, Problem } from "@/types";
import { useRouter } from "next/navigation";
import {
  Fire,
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Circle,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { getPatternBadgeStyle, getDifficultyStyle } from "@/lib/badgeStyle";

interface DashboardProblem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  done: boolean;
  dayId: number;
  pattern: string;
  problemIndex: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { 
    profile, 
    days, 
    planProgress, 
    dayManualDone, 
    streak, 
    loading: providerLoading, 
    toggleProblem 
  } = useSupabase();

  const getDayProgressPercentage = (dayId: number) => {
    const day = days.find((d: Day) => d.id === dayId);
    if (!day) return 0;
    const total = day.problems?.length || 0;
    if (total === 0) {
      return dayManualDone[dayId] ? 100 : 0;
    }
    const solved = day.problems.filter((_: Problem, idx: number) => !!planProgress[`${dayId}_${idx}`]).length;
    return Math.round((solved / total) * 100);
  };

  const getDayIsCompleted = (dayId: number) => {
    return getDayProgressPercentage(dayId) === 100;
  };

  if (providerLoading || days.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h2 className="text-xl font-bold">Loading Dashboard...</h2>
      </div>
    );
  }

  const profileName = profile?.name ? profile.name.split(" ")[0] : "Learner";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // 1. Total Completed Days
  const completedDaysCount = days.filter((d: Day) => getDayIsCompleted(d.id)).length;

  // 2. Total Problems Solved vs Total
  let totalProblemsCount = 0;
  let solvedProblemsCount = 0;
  days.forEach((day: Day) => {
    day.problems?.forEach((_: Problem, idx: number) => {
      totalProblemsCount++;
      if (planProgress[`${day.id}_${idx}`]) {
        solvedProblemsCount++;
      }
    });
  });

  // 3. Current active day (first incomplete day)
  const currentActiveDay = days.find((d: Day) => !getDayIsCompleted(d.id)) || days[91];
  const currentDayId = currentActiveDay ? currentActiveDay.id : 1;

  // 4. Carousel Days: Next 4 incomplete or unstarted days
  const carouselDays = days.filter((d: Day) => !getDayIsCompleted(d.id)).slice(0, 4);
  // Fallback if all days are completed
  const displayCarouselDays = carouselDays.length > 0 ? carouselDays : days.slice(88);

  // 5. Problems table: Problems of the active day
  // If the active day has no problems (e.g. a review day), look for the next day with incomplete problems
  let activeProblemsDay = currentActiveDay;
  if (activeProblemsDay && (activeProblemsDay.problems?.length || 0) === 0) {
    const nextWithProbs = days.find((d: Day) => (d.problems?.length || 0) > 0 && !getDayIsCompleted(d.id));
    if (nextWithProbs) {
      activeProblemsDay = nextWithProbs;
    }
  }

  const tableProblems: DashboardProblem[] = activeProblemsDay ? activeProblemsDay.problems.map((prob: Problem, idx: number) => ({
    ...prob,
    dayId: activeProblemsDay.id,
    pattern: activeProblemsDay.pattern,
    problemIndex: idx,
    done: !!planProgress[`${activeProblemsDay.id}_${idx}`],
    difficulty: prob.difficulty as "Easy" | "Medium" | "Hard",
  })) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Hero Greeting */}
      <section className="bg-[#FAF7F0] border border-border text-[#1B1917] rounded-2xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {profileName} 🔥</h1>
          <p className="text-[#6B655B] font-medium">
            Day {currentDayId} of 92 · {streak}-day streak. {completedDaysCount === 92 ? "Incredible work! You have completed the curriculum!" : "You're doing great."}
          </p>
        </div>
        <button 
          onClick={() => router.push(`/day/${currentDayId}`)}
          className="bg-[#1B1917] text-white px-6 py-3 rounded-full font-medium shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 self-start md:self-auto text-sm cursor-pointer"
        >
          Continue where you left off
          <ArrowRight weight="bold" />
        </button>
      </section>

      {/* Stats & Heatmap */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border space-y-1">
          <p className="text-text-secondary text-sm font-medium">Total Days Completed</p>
          <p className="text-3xl font-mono font-bold">{completedDaysCount}<span className="text-gray-400 text-lg">/92</span></p>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border space-y-1">
          <p className="text-text-secondary text-sm font-medium">Problems Solved</p>
          <p className="text-3xl font-mono font-bold">{solvedProblemsCount}<span className="text-gray-400 text-lg">/{totalProblemsCount}</span></p>
        </div>
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border space-y-1">
          <p className="text-text-secondary text-sm font-medium">Current Streak</p>
          <p className="text-3xl font-mono font-bold flex items-center gap-2">
            {streak} <Fire weight="fill" className="text-orange-500 w-6 h-6" />
          </p>
        </div>
        
        {/* Heatmap Widget */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <p className="text-text-secondary text-sm font-medium">Activity Map</p>
            <span className="text-[10px] text-gray-400 font-medium">92 Days</span>
          </div>
          <div className="grid grid-cols-23 gap-1 mt-2">
            {days.map((day: Day) => {
              const percentage = getDayProgressPercentage(day.id);
              const bgColor = percentage === 100 
                ? "bg-signal" 
                : percentage > 0 
                  ? "bg-signal/40" 
                  : "bg-gray-100 dark:bg-sidebar";
              return (
                <Link
                  key={day.id}
                  href={`/day/${day.id}`}
                  title={`Day ${day.id}: ${day.topic} (${percentage}% done)`}
                  className={`w-2.5 h-2.5 rounded-sm ${bgColor} transition-opacity hover:opacity-80`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Continue Studying Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Continue Studying</h2>
          <button 
            onClick={() => router.push("/plan")}
            className="text-sm font-medium text-focus hover:underline bg-transparent border-0 cursor-pointer"
          >
            View full plan
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayCarouselDays.map((item) => {
            const pct = getDayProgressPercentage(item.id);
            return (
              <div key={item.id} className="w-full bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getPatternBadgeStyle(item.pattern)}`}>
                    {item.pattern}
                  </span>
                  <h3 className="font-bold mt-3">Day {item.id}</h3>
                  <p className="text-text-secondary text-sm line-clamp-1">{item.topic}</p>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-signal h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary font-mono">{pct}%</span>
                    <button 
                      onClick={() => router.push(`/day/${item.id}`)}
                      className="text-focus hover:text-focus/80 transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <PlayCircle weight="fill" className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Your Problems Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Problems for Day {activeProblemsDay.id} ({activeProblemsDay.topic})</h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
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
                {tableProblems.map((prob, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleProblem(prob.dayId, prob.problemIndex)}
                        className="text-text-secondary hover:text-signal transition-colors focus:outline-none"
                      >
                        {prob.done ? <CheckCircle weight="fill" className="w-6 h-6 text-signal" /> : <Circle className="w-6 h-6" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{prob.name}</td>
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
                      <a 
                        href={prob.leetcodeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex text-gray-400 hover:text-focus transition-colors"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </a>
                    </td>
                  </tr>
                ))}
                {tableProblems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-secondary text-sm">
                      No problems assigned for this day. Revise today&apos;s materials.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
