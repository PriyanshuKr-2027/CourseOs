"use client";

export interface Profile {
  name: string;
  email: string;
  darkMode: boolean;
  reminders: boolean;
  role?: "learner" | "admin";
}

export interface StreakInfo {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

const DEFAULT_PROFILE: Profile = {
  name: "John Doe",
  email: "john.doe@example.com",
  darkMode: false,
  reminders: true,
  role: "learner",
};

// Simple check if window/localStorage is available (Next.js SSR guard)
const isBrowser = () => typeof window !== "undefined";

export function getProfile(): Profile {
  if (!isBrowser()) return DEFAULT_PROFILE;
  const data = localStorage.getItem("dsa_user_profile");
  if (!data) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(data);
    const email = parsed.email || "";
    const role = email.toLowerCase().includes("admin") ? "admin" : (parsed.role || "learner");
    return { ...DEFAULT_PROFILE, ...parsed, role };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: Profile): void {
  if (!isBrowser()) return;
  const email = profile.email || "";
  const role = email.toLowerCase().includes("admin") ? "admin" : (profile.role || "learner");
  const updatedProfile = { ...profile, role };
  localStorage.setItem("dsa_user_profile", JSON.stringify(updatedProfile));
  // Trigger storage event for local updates
  window.dispatchEvent(new Event("storage"));
}

import { MOCK_DAYS } from "@/data/mockDays";

export function getCurriculumDays() {
  if (!isBrowser()) return MOCK_DAYS;
  const data = localStorage.getItem("dsa_custom_days");
  if (!data) return MOCK_DAYS;
  try {
    return JSON.parse(data);
  } catch {
    return MOCK_DAYS;
  }
}

export function saveCurriculumDays(days: any[]) {
  if (!isBrowser()) return;
  localStorage.setItem("dsa_custom_days", JSON.stringify(days));
  window.dispatchEvent(new Event("storage"));
}

export function getUserProgressList() {
  const days = getCurriculumDays();
  const totalProblems = days.reduce((sum: number, day: any) => sum + (day.problems?.length || 0), 0);
  
  // Get current user's profile and progress
  const profile = getProfile();
  const currentProgress = getPlanProgress();
  const currentSolved = Object.keys(currentProgress).filter(k => currentProgress[k]).length;
  const currentPercentage = totalProblems > 0 ? Math.round((currentSolved / totalProblems) * 100) : 0;
  
  const streak = getStreakInfo();
  
  // Return list of all users
  return [
    {
      id: "john_doe", // Map John Doe / logged in user dynamically
      name: profile.name,
      email: profile.email,
      role: profile.role || "learner",
      joinedDate: "Jun 1, 2026",
      lastActive: streak.lastActiveDate || new Date().toISOString().split("T")[0],
      solvedCount: currentSolved,
      totalProblems: totalProblems,
      percentage: currentPercentage,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name}`
    },
    {
      id: "prince_kumot",
      name: "Prince Kumot",
      email: "princekumot1307@gmail.com",
      role: "learner",
      joinedDate: "Jun 1, 2026",
      lastActive: "2026-07-04",
      solvedCount: Math.round(totalProblems * 0.82),
      totalProblems: totalProblems,
      percentage: 82,
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=prince"
    },
    {
      id: "alice_smith",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "learner",
      joinedDate: "Jun 10, 2026",
      lastActive: "2026-07-03",
      solvedCount: Math.round(totalProblems * 0.43),
      totalProblems: totalProblems,
      percentage: 43,
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=alice"
    },
    {
      id: "bob_jones",
      name: "Bob Jones",
      email: "bob@example.com",
      role: "learner",
      joinedDate: "Jun 5, 2026",
      lastActive: "2026-07-05",
      solvedCount: Math.round(totalProblems * 0.61),
      totalProblems: totalProblems,
      percentage: 61,
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=bob"
    },
    {
      id: "charlie_brown",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "learner",
      joinedDate: "Jun 15, 2026",
      lastActive: "2026-06-30",
      solvedCount: Math.round(totalProblems * 0.12),
      totalProblems: totalProblems,
      percentage: 12,
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=charlie"
    }
  ];
}


export function getPlanProgress(): Record<string, boolean> {
  if (!isBrowser()) return {};
  const data = localStorage.getItem("dsa_plan_progress");
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function savePlanProgress(progress: Record<string, boolean>): void {
  if (!isBrowser()) return;
  localStorage.setItem("dsa_plan_progress", JSON.stringify(progress));
  window.dispatchEvent(new Event("storage"));
}

export function getDayNotes(): Record<number, string> {
  if (!isBrowser()) return {};
  const data = localStorage.getItem("dsa_day_notes");
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveDayNotes(dayId: number, notes: string): void {
  if (!isBrowser()) return;
  const current = getDayNotes();
  current[dayId] = notes;
  localStorage.setItem("dsa_day_notes", JSON.stringify(current));
  localStorage.setItem(`dsa_notes_edited_${dayId}`, new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  window.dispatchEvent(new Event("storage"));
}

export function getNotesLastEdited(dayId: number): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(`dsa_notes_edited_${dayId}`);
}

export function getDayManualDone(): Record<number, boolean> {
  if (!isBrowser()) return {};
  const data = localStorage.getItem("dsa_day_manual_done");
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveDayManualDone(dayId: number, done: boolean): void {
  if (!isBrowser()) return;
  const current = getDayManualDone();
  current[dayId] = done;
  localStorage.setItem("dsa_day_manual_done", JSON.stringify(current));
  window.dispatchEvent(new Event("storage"));
}

export function getStreakInfo(): StreakInfo {
  const defaultStreak: StreakInfo = { currentStreak: 0, lastActiveDate: "" };
  if (!isBrowser()) return defaultStreak;
  const data = localStorage.getItem("dsa_streak_info");
  if (!data) return defaultStreak;
  try {
    return { ...defaultStreak, ...JSON.parse(data) };
  } catch {
    return defaultStreak;
  }
}

export function saveStreakInfo(info: StreakInfo): void {
  if (!isBrowser()) return;
  localStorage.setItem("dsa_streak_info", JSON.stringify(info));
  window.dispatchEvent(new Event("storage"));
}

export function registerActivity(): void {
  if (!isBrowser()) return;
  const todayStr = new Date().toISOString().split("T")[0];
  const info = getStreakInfo();
  
  if (!info.lastActiveDate) {
    info.currentStreak = 1;
    info.lastActiveDate = todayStr;
    saveStreakInfo(info);
    return;
  }
  
  if (info.lastActiveDate === todayStr) {
    return;
  }
  
  const lastDate = new Date(info.lastActiveDate);
  const todayDate = new Date(todayStr);
  
  // Calculate difference in calendar days
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    info.currentStreak += 1;
  } else if (diffDays > 1) {
    info.currentStreak = 1;
  }
  
  info.lastActiveDate = todayStr;
  saveStreakInfo(info);
}

export function resetAllData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem("dsa_user_profile");
  localStorage.removeItem("dsa_plan_progress");
  localStorage.removeItem("dsa_day_notes");
  localStorage.removeItem("dsa_day_manual_done");
  localStorage.removeItem("dsa_streak_info");
  
  // Clear any notes edited trackers
  for (let i = 1; i <= 92; i++) {
    localStorage.removeItem(`dsa_notes_edited_${i}`);
  }
  
  // Also clear completed pattern sheet problems
  localStorage.removeItem("dsa_completed_problems");

  // Clear any chat histories in localStorage
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("dsa_chat_day_") || key.startsWith("dsa_chat_problem_"))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  window.dispatchEvent(new Event("storage"));
}
