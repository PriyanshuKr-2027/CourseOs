"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getProfile as getMockProfile, saveProfile as saveMockProfile, getPlanProgress as getMockProgress, savePlanProgress as saveMockProgress, getDayManualDone as getMockManualDone, saveDayManualDone as saveMockManualDone, getDayNotes as getMockNotes, saveDayNotes as saveMockNotes, getStreakInfo as getMockStreak, saveStreakInfo as saveMockStreak, getCurriculumDays as getMockDays, saveCurriculumDays as saveMockDays } from "@/lib/store";
import topicsData from "@/data/risingbrain_data.json";
import { Profile, Day, Problem } from "@/types";
import { SupabaseClient, User, AuthError, Session } from "@supabase/supabase-js";

interface JSONProblem {
  id: string;
  title: string;
  leetcodeUrl?: string;
}
interface JSONSubtopic {
  problems?: JSONProblem[];
}
interface JSONTopic {
  subtopics?: JSONSubtopic[];
}

interface DBDay {
  id: number;
  pattern: string;
  topic: string;
  date_label?: string;
  youtube_id?: string;
}
interface DBProblem {
  id: string;
  day_id: number;
  name: string;
  difficulty: string;
  leetcode_url?: string;
  gfg_url?: string;
  youtube_url?: string;
  is_missing_video?: boolean;
}

// Flatten sheet problems for quick lookup
const flatSheetProblems = (topicsData as JSONTopic[]).flatMap((topic) =>
  (topic.subtopics || []).flatMap((sub) =>
    (sub.problems || []).map((prob) => ({
      id: prob.id,
      title: prob.title,
      leetcodeUrl: prob.leetcodeUrl || "",
    }))
  )
);

const normalizeUrl = (url: string) => {
  if (!url) return "";
  try {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.toLowerCase().trim().replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  } catch {
    return url.toLowerCase().trim().replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  }
};

const normalizeName = (name: string) => {
  if (!name) return "";
  return name.toLowerCase().trim().split("(")[0].replace(/[^a-z0-9]/g, "");
};

const findMatchingSheetProblem = (dayProb: { name: string; leetcodeUrl?: string }) => {
  if (dayProb.leetcodeUrl) {
    const normUrl = normalizeUrl(dayProb.leetcodeUrl);
    const match = flatSheetProblems.find(p => p.leetcodeUrl && normalizeUrl(p.leetcodeUrl) === normUrl);
    if (match) return match;
  }
  const normName = normalizeName(dayProb.name);
  return flatSheetProblems.find(p => normalizeName(p.title) === normName);
};

const findMatchingDayProblems = (sheetProb: { title: string; leetcodeUrl?: string }, daysList: Day[]) => {
  const matches: { dayId: number; problemIndex: number; id: string }[] = [];
  
  const normUrl = sheetProb.leetcodeUrl ? normalizeUrl(sheetProb.leetcodeUrl) : "";
  const normTitle = normalizeName(sheetProb.title);

  daysList.forEach((day: Day) => {
    (day.problems || []).forEach((prob: Problem, idx: number) => {
      let isMatch = false;
      if (normUrl && prob.leetcodeUrl && normalizeUrl(prob.leetcodeUrl) === normUrl) {
        isMatch = true;
      } else if (normalizeName(prob.name) === normTitle) {
        isMatch = true;
      }
      if (isMatch) {
        matches.push({
          dayId: day.id,
          problemIndex: idx,
          id: prob.id || ""
        });
      }
    });
  });
  return matches;
};

interface SupabaseContextType {
  supabase: SupabaseClient | null;
  user: User | null;
  profile: Profile;
  days: Day[];
  planProgress: Record<string, boolean>;
  dayManualDone: Record<number, boolean>;
  dayNotes: Record<number, string>;
  completedProblems: Record<string, boolean>;
  streak: number;
  loading: boolean;
  isMockMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  toggleProblem: (dayId: number, problemIndex: number) => Promise<void>;
  toggleSheetProblem: (problemId: string) => Promise<void>;
  toggleManualDayDone: (dayId: number) => Promise<void>;
  saveDayNotes: (dayId: number, text: string) => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  refreshProgress: () => Promise<void>;
  getChatHistory: (filters: { dayId?: number; problemId?: string; userId?: string }) => Promise<{ role: "user" | "assistant"; text: string; sessionId?: string; createdAt?: string; dayId?: number; problemId?: string }[]>;
  saveChatMessage: (message: { dayId?: number; problemId?: string; role: "user" | "assistant"; text: string; sessionId?: string }) => Promise<void>;
  updateDay: (dayId: number, topic: string, pattern: string, youtubeId: string) => Promise<void>;
  updateDaysBulk: (updates: { id: number; youtubeId: string }[]) => Promise<void>;
  createPortalUser: (email: string, password: string, name: string) => Promise<void>;
  deletePortalUser: (userId: string) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Detect mock mode (if keys are missing)
  const isMockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-public-key");

  const supabase = isMockMode ? null : createClient();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: "John Doe",
    email: "john.doe@example.com",
    darkMode: false,
    reminders: true,
    role: "learner",
    current_streak: 0,
    last_active_date: "",
    hasCompletedSetup: false,
    dob: "",
    mobileNo: "",
    groqApiKey: "",
  });
  const [days, setDays] = useState<Day[]>([]);
  const [planProgress, setPlanProgress] = useState<Record<string, boolean>>({});
  const [dayManualDone, setDayManualDone] = useState<Record<number, boolean>>({});
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({});
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize data (Supabase or LocalStorage)
  useEffect(() => {
    async function init() {
      if (isMockMode) {
        console.warn("Running in Mock Mode. Please set Supabase environment variables in .env.local to use the real database.");
        const mockP = getMockProfile();
        setProfile(mockP);
        setDays(getMockDays());
        setPlanProgress(getMockProgress());
        setDayManualDone(getMockManualDone());
        setDayNotes(getMockNotes());
        
        let sheetSolvedMap: Record<string, boolean> = {};
        if (typeof window !== "undefined") {
          const savedSheet = localStorage.getItem("dsa_completed_problems");
          sheetSolvedMap = savedSheet ? JSON.parse(savedSheet) : {};
        }
        setCompletedProblems(sheetSolvedMap);

        setStreak(getMockStreak().currentStreak);
        setLoading(false);
        return;
      }

      try {
        // 1. Get current session user
        const { data: { session } } = await supabase!.auth.getSession();
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        // 2. Fetch user profile
        const { data: profData, error: profError } = await supabase!
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profError) {
          console.error("Error fetching profile:", profError);
        } else if (profData) {
          setProfile({
            name: profData.name,
            email: profData.email,
            darkMode: profData.dark_mode,
            reminders: profData.reminders,
            role: profData.role,
            current_streak: profData.current_streak,
            last_active_date: profData.last_active_date,
            hasCompletedSetup: profData.has_completed_setup,
            dob: profData.dob || "",
            mobileNo: profData.mobile_no || "",
            groqApiKey: profData.groq_api_key || "",
          });
          setStreak(profData.current_streak || 0);
          if (profData.dark_mode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }

        // 3. Fetch days & problems from database
        const { data: dbDays, error: daysErr } = await supabase!
          .from("days")
          .select("*")
          .order("id", { ascending: true });
        if (daysErr) console.error("Error fetching dbDays:", daysErr);

        const { data: dbProblems, error: probsErr } = await supabase!
          .from("problems")
          .select("*")
          .order("order_index", { ascending: true });
        if (probsErr) console.error("Error fetching dbProblems:", probsErr);

        let formattedDays: Day[] = [];
        if (dbDays && dbProblems) {
          const castDays = dbDays as DBDay[];
          const castProblems = dbProblems as DBProblem[];
          formattedDays = castDays.map((day) => {
            const dayProblems = castProblems.filter((p) => p.day_id === day.id);
            return {
              id: day.id,
              pattern: day.pattern,
              topic: day.topic,
              date: day.date_label || "",
              youtubeId: day.youtube_id || "",
              problems: dayProblems.map((p) => ({
                id: p.id,
                name: p.name,
                difficulty: p.difficulty,
                leetcodeUrl: p.leetcode_url || "",
                gfgUrl: p.gfg_url || "",
                youtubeUrl: p.youtube_url || "",
                isMissingVideo: !!p.is_missing_video,
                done: false, // Calculated next
              })),
              done: false,
              notes: "",
            };
          });
          setDays(formattedDays);
        } else {
          // fallback to mock if DB is empty
          formattedDays = getMockDays();
          setDays(formattedDays);
        }

        // 4. Fetch user progress (solved problems)
        const { data: solveData } = await supabase!
          .from("progress")
          .select("problem_id")
          .eq("user_id", session.user.id);

        const solvedSet = new Set((solveData as { problem_id: string }[] | null)?.map((p) => p.problem_id) || []);

        // 5. Fetch user manual day completion
        const { data: dayDoneData } = await supabase!
          .from("progress_days")
          .select("day_id")
          .eq("user_id", session.user.id);

        const manualDoneMap: Record<number, boolean> = {};
        (dayDoneData as { day_id: number }[] | null)?.forEach((d) => {
          manualDoneMap[Number(d.day_id)] = true;
        });
        setDayManualDone(manualDoneMap);

        // 6. Map solved problems to frontend { [dayId_problemIndex]: boolean } schema
        const progressMap: Record<string, boolean> = {};
        formattedDays.forEach((day: Day) => {
          day.problems.forEach((prob: Problem, idx: number) => {
            if (solvedSet.has(prob.id || "")) {
              progressMap[`${day.id}_${idx}`] = true;
            }
          });
        });
        setPlanProgress(progressMap);

        // 7. Fetch user notes
        const { data: notesData } = await supabase!
          .from("user_notes")
          .select("day_id, notes_text")
          .eq("user_id", session.user.id);

        const notesMap: Record<number, string> = {};
        (notesData as { day_id: number; notes_text: string }[] | null)?.forEach((n) => {
          notesMap[Number(n.day_id)] = n.notes_text;
        });
        setDayNotes(notesMap);

        // 8. Fetch user pattern sheet progress
        const { data: sheetSolveData } = await supabase!
          .from("sheet_progress")
          .select("problem_id")
          .eq("user_id", session.user.id);

        const sheetSolvedMap: Record<string, boolean> = {};
        (sheetSolveData as { problem_id: string }[] | null)?.forEach((p) => {
          sheetSolvedMap[p.problem_id] = true;
        });
        setCompletedProblems(sheetSolvedMap);

      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    init();

    // Listen for auth changes
    if (!isMockMode) {
      const { data: { subscription } } = supabase!.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            setUser(session.user);
            setLoading(true);
            init();
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setProfile({
              name: "John Doe",
              email: "john.doe@example.com",
              darkMode: false,
              reminders: true,
              role: "learner",
              current_streak: 0,
              last_active_date: "",
            });
            setPlanProgress({});
            setDayManualDone({});
            setDayNotes({});
            setCompletedProblems({});
            setStreak(0);
            router.push("/login");
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isMockMode, router, supabase]);

  // Auth operations
  const signIn = async (email: string, password: string) => {
    if (isMockMode) {
      // Simulate
      const isAdmin = email.toLowerCase().includes("admin");
      const namePrefix = email.split("@")[0];
      const formattedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
      const mockP: Profile = {
        name: isAdmin ? "System Administrator" : formattedName,
        email,
        darkMode: false,
        reminders: true,
        role: isAdmin ? "admin" : "learner",
      };
      saveMockProfile(mockP);
      setProfile(mockP);
      setUser({ email } as User);
      router.push(isAdmin ? "/admin" : "/dashboard");
      return { error: null };
    }
    return await supabase!.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (isMockMode) {
      const mockP: Profile = {
        name,
        email,
        darkMode: false,
        reminders: true,
        role: email.toLowerCase().includes("admin") ? "admin" : "learner",
      };
      saveMockProfile(mockP);
      setProfile(mockP);
      setUser({ email } as User);
      router.push(email.toLowerCase().includes("admin") ? "/admin" : "/dashboard");
      return { 
        data: { 
          user: { email } as User, 
          session: { access_token: "mock-token", refresh_token: "mock-token", expires_in: 3600, token_type: "bearer", user: { email } as User } as Session 
        }, 
        error: null 
      };
    }
    return await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
  };

  const signOut = async () => {
    if (isMockMode) {
      localStorage.removeItem("dsa_user_profile");
      setUser(null);
      router.push("/login");
      return;
    }
    await supabase!.auth.signOut();
  };

  // Helper to recalculate and register user streak activity in database/mock
  const registerActivity = async () => {
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
    
    if (isMockMode) {
      const mockStreak = getMockStreak();
      const nextStreak = { ...mockStreak };
      if (!mockStreak.lastActiveDate) {
        nextStreak.currentStreak = 1;
      } else if (mockStreak.lastActiveDate !== todayStr) {
        const lastDate = new Date(mockStreak.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          nextStreak.currentStreak += 1;
        } else if (diffDays > 1) {
          nextStreak.currentStreak = 1;
        }
      }
      nextStreak.lastActiveDate = todayStr;
      saveMockStreak(nextStreak);
      setStreak(nextStreak.currentStreak);
      return;
    }

    if (!user || !profile) return;

    const lastActive = profile.last_active_date;
    let nextStreak = profile.current_streak || 0;

    if (!lastActive) {
      nextStreak = 1;
    } else if (lastActive !== todayStr) {
      const lastDate = new Date(lastActive);
      const todayDate = new Date(todayStr);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        nextStreak += 1;
      } else if (diffDays > 1) {
        nextStreak = 1;
      }
    } else {
      // Already active today, streak remains same
      return;
    }

    // Save to profiles database
    const { error } = await supabase!
      .from("profiles")
      .update({ current_streak: nextStreak, last_active_date: todayStr })
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => ({
        ...prev,
        current_streak: nextStreak,
        last_active_date: todayStr,
      }));
      setStreak(nextStreak);
    }
  };

  // Toggle problem solved (with automatic synchronization to pattern sheet progress)
  const toggleProblem = async (dayId: number, problemIndex: number) => {
    const key = `${dayId}_${problemIndex}`;
    const newSolvedVal = !planProgress[key];

    // Optimistic UI updates
    setPlanProgress((prev) => ({ ...prev, [key]: newSolvedVal }));

    const dayData = days.find((d) => d.id === dayId);
    const problem = dayData?.problems[problemIndex];
    
    let matchingSheetProbId: string | null = null;
    if (problem) {
      const match = findMatchingSheetProblem(problem);
      if (match) {
        matchingSheetProbId = match.id;
        setCompletedProblems((prev) => ({ ...prev, [match.id]: newSolvedVal }));
      }
    }

    if (isMockMode) {
      const progress = getMockProgress();
      progress[key] = newSolvedVal;
      saveMockProgress(progress);

      if (matchingSheetProbId) {
        if (typeof window !== "undefined") {
          const savedSheet = localStorage.getItem("dsa_completed_problems");
          const sheetProgress = savedSheet ? JSON.parse(savedSheet) : {};
          sheetProgress[matchingSheetProbId] = newSolvedVal;
          localStorage.setItem("dsa_completed_problems", JSON.stringify(sheetProgress));
        }
      }

      if (newSolvedVal) await registerActivity();
      return;
    }

    if (!user || !problem || !problem.id) return;

    try {
      if (newSolvedVal) {
        await supabase!.from("progress").insert({ user_id: user.id, problem_id: problem.id });
        await registerActivity();
      } else {
        await supabase!.from("progress").delete().eq("user_id", user.id).eq("problem_id", problem.id);
      }

      if (matchingSheetProbId) {
        if (newSolvedVal) {
          await supabase!.from("sheet_progress").upsert(
            { user_id: user.id, problem_id: matchingSheetProbId },
            { onConflict: "user_id,problem_id" }
          );
        } else {
          await supabase!.from("sheet_progress").delete().eq("user_id", user.id).eq("problem_id", matchingSheetProbId);
        }
      }
    } catch (err) {
      console.error("Error toggling problem progress:", err);
      // Revert on error
      setPlanProgress((prev) => ({ ...prev, [key]: !newSolvedVal }));
      if (matchingSheetProbId) {
        setCompletedProblems((prev) => ({ ...prev, [matchingSheetProbId!]: !newSolvedVal }));
      }
    }
  };

  // Toggle pattern-wise sheet problem solved (with automatic synchronization to day plan progress)
  const toggleSheetProblem = async (problemId: string) => {
    const newSolvedVal = !completedProblems[problemId];

    // Optimistic UI updates
    setCompletedProblems((prev) => ({ ...prev, [problemId]: newSolvedVal }));

    const sheetProb = flatSheetProblems.find(p => p.id === problemId);
    let matchingDayProbs: { dayId: number; problemIndex: number; id: string }[] = [];
    if (sheetProb) {
      matchingDayProbs = findMatchingDayProblems(sheetProb, days);
      if (matchingDayProbs.length > 0) {
        setPlanProgress((prev) => {
          const updated = { ...prev };
          matchingDayProbs.forEach(match => {
            updated[`${match.dayId}_${match.problemIndex}`] = newSolvedVal;
          });
          return updated;
        });
      }
    }

    if (isMockMode) {
      if (typeof window !== "undefined") {
        const savedSheet = localStorage.getItem("dsa_completed_problems");
        const sheetProgress = savedSheet ? JSON.parse(savedSheet) : {};
        sheetProgress[problemId] = newSolvedVal;
        localStorage.setItem("dsa_completed_problems", JSON.stringify(sheetProgress));

        const progress = getMockProgress();
        matchingDayProbs.forEach(match => {
          progress[`${match.dayId}_${match.problemIndex}`] = newSolvedVal;
        });
        saveMockProgress(progress);
      }
      if (newSolvedVal) await registerActivity();
      return;
    }

    if (!user) return;

    try {
      if (newSolvedVal) {
        await supabase!.from("sheet_progress").upsert(
          { user_id: user.id, problem_id: problemId },
          { onConflict: "user_id,problem_id" }
        );
        await registerActivity();
      } else {
        await supabase!.from("sheet_progress").delete().eq("user_id", user.id).eq("problem_id", problemId);
      }

      if (matchingDayProbs.length > 0) {
        if (newSolvedVal) {
          const inserts = matchingDayProbs.map(match => ({
            user_id: user.id,
            problem_id: match.id
          }));
          await supabase!.from("progress").upsert(inserts, { onConflict: "user_id,problem_id" });
        } else {
          const idsToDelete = matchingDayProbs.map(match => match.id);
          await supabase!.from("progress").delete().eq("user_id", user.id).in("problem_id", idsToDelete);
        }
      }
    } catch (err) {
      console.error("Error toggling sheet problem:", err);
      // Revert
      setCompletedProblems((prev) => ({ ...prev, [problemId]: !newSolvedVal }));
      if (matchingDayProbs.length > 0) {
        setPlanProgress((prev) => {
          const updated = { ...prev };
          matchingDayProbs.forEach(match => {
            updated[`${match.dayId}_${match.problemIndex}`] = !newSolvedVal;
          });
          return updated;
        });
      }
    }
  };

  // Toggle manual day completion (for 0-problem rest/review days)
  const toggleManualDayDone = async (dayId: number) => {
    const newDoneVal = !dayManualDone[dayId];

    // Optimistic UI update
    setDayManualDone((prev) => ({
      ...prev,
      [dayId]: newDoneVal,
    }));

    if (isMockMode) {
      saveMockManualDone(dayId, newDoneVal);
      if (newDoneVal) await registerActivity();
      return;
    }

    if (!user) return;

    try {
      if (newDoneVal) {
        await supabase!
          .from("progress_days")
          .insert({ user_id: user.id, day_id: dayId });
        await registerActivity();
      } else {
        await supabase!
          .from("progress_days")
          .delete()
          .eq("user_id", user.id)
          .eq("day_id", dayId);
      }
    } catch (err) {
      console.error("Error toggling manual day completion:", err);
      // Revert
      setDayManualDone((prev) => ({
        ...prev,
        [dayId]: !newDoneVal,
      }));
    }
  };

  // Save notes
  const saveDayNotes = async (dayId: number, text: string) => {
    // Optimistic UI update
    setDayNotes((prev) => ({
      ...prev,
      [dayId]: text,
    }));

    if (isMockMode) {
      saveMockNotes(dayId, text);
      await registerActivity();
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase!
        .from("user_notes")
        .upsert(
          { user_id: user.id, day_id: dayId, notes_text: text, updated_at: new Date().toISOString() },
          { onConflict: "user_id,day_id" }
        );

      if (error) throw error;
      await registerActivity();
    } catch (err) {
      console.error("Error saving notes:", err);
    }
  };

  // Update profile details
  const updateProfile = async (profileData: Partial<Profile>) => {
    const updated = { ...profile, ...profileData };
    setProfile(updated);

    if (isMockMode) {
      saveMockProfile(updated);
      return;
    }

    if (!user) return;

    try {
      const updatePayload: Record<string, string | boolean | number | null> = {};
      if (profileData.name !== undefined) updatePayload.name = profileData.name;
      if (profileData.darkMode !== undefined) updatePayload.dark_mode = profileData.darkMode;
      if (profileData.reminders !== undefined) updatePayload.reminders = profileData.reminders;
      if (profileData.hasCompletedSetup !== undefined) updatePayload.has_completed_setup = profileData.hasCompletedSetup;
      if (profileData.dob !== undefined) updatePayload.dob = profileData.dob;
      if (profileData.mobileNo !== undefined) updatePayload.mobile_no = profileData.mobileNo;
      if (profileData.groqApiKey !== undefined) updatePayload.groq_api_key = profileData.groqApiKey;

      const { error } = await supabase!
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating profile in Supabase:", err);
    }
  };

  const refreshProgress = async () => {
    if (isMockMode || !user) return;
    try {
      const { data: solveData } = await supabase!
        .from("progress")
        .select("problem_id")
        .eq("user_id", user.id);

      const solvedSet = new Set((solveData as { problem_id: string }[] | null)?.map((p) => p.problem_id) || []);

      const progressMap: Record<string, boolean> = {};
      days.forEach((day: Day) => {
        day.problems.forEach((prob: Problem, idx: number) => {
          if (solvedSet.has(prob.id || "")) {
            progressMap[`${day.id}_${idx}`] = true;
          }
        });
      });
      setPlanProgress(progressMap);

      const { data: dayDoneData } = await supabase!
        .from("progress_days")
        .select("day_id")
        .eq("user_id", user.id);

      const manualDoneMap: Record<number, boolean> = {};
      (dayDoneData as { day_id: number }[] | null)?.forEach((d) => {
        manualDoneMap[Number(d.day_id)] = true;
      });
      setDayManualDone(manualDoneMap);
    } catch (e) {
      console.error(e);
    }
  };

  const getChatHistory = async (filters: { dayId?: number; problemId?: string; userId?: string }) => {
    if (isMockMode) {
      if (typeof window === "undefined") return [];
      if (filters.userId && filters.userId !== "john_doe") {
        return [
          { role: "user", text: "How do I solve today's sliding window problem?", createdAt: new Date().toISOString() },
          { role: "assistant", text: "You can use two pointers to maintain the window.", createdAt: new Date().toISOString() }
        ];
      }
      const key = filters.dayId 
        ? `dsa_chat_day_${filters.dayId}` 
        : `dsa_chat_problem_${filters.problemId}`;
      const data = localStorage.getItem(key);
      if (!data) return [];
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }

    if (!user) return [];

    try {
      const targetUserId = (profile.role === "admin" && filters.userId) ? filters.userId : user.id;

      let query = supabase!
        .from("chat_messages")
        .select("role, message_text, session_id, created_at, day_id, problem_id")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: true });

      if (filters.dayId !== undefined) {
        query = query.eq("day_id", filters.dayId);
      } else if (filters.problemId !== undefined) {
        query = query.eq("problem_id", filters.problemId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as { role: string; message_text: string; session_id: string; created_at: string; day_id: any; problem_id: any }[]).map((m) => ({
        role: m.role as "user" | "assistant",
        text: m.message_text,
        sessionId: m.session_id,
        createdAt: m.created_at,
        dayId: m.day_id,
        problemId: m.problem_id
      }));
    } catch (err) {
      console.error("Error fetching chat history:", err);
      return [];
    }
  };

  const saveChatMessage = async (msg: { dayId?: number; problemId?: string; role: "user" | "assistant"; text: string; sessionId?: string }) => {
    if (isMockMode) {
      if (typeof window === "undefined") return;
      const key = msg.dayId 
        ? `dsa_chat_day_${msg.dayId}` 
        : `dsa_chat_problem_${msg.problemId}`;
      const history = await getChatHistory({ dayId: msg.dayId, problemId: msg.problemId });
      const updated = [...history, { role: msg.role, text: msg.text, sessionId: msg.sessionId || "default-session" }];
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      return;
    }

    if (!user) return;

    try {
      const { error } = await supabase!
        .from("chat_messages")
        .insert({
          user_id: user.id,
          day_id: msg.dayId,
          problem_id: msg.problemId,
          role: msg.role,
          message_text: msg.text,
          session_id: msg.sessionId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "default-session")
        });
      if (error) throw error;
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  };

  const updateDay = async (dayId: number, topic: string, pattern: string, youtubeId: string) => {
    if (isMockMode) {
      const currentDays = getMockDays();
      const updated = currentDays.map((d: any) =>
        d.id === dayId ? { ...d, topic, pattern, youtubeId } : d
      );
      saveMockDays(updated);
      setDays(updated);
      return;
    }
    if (!user) return;
    try {
      const { error } = await supabase!
        .from("days")
        .update({
          topic,
          pattern,
          youtube_id: youtubeId || null
        })
        .eq("id", dayId);
      if (error) throw error;
      setDays((prev) =>
        prev.map((d) => (d.id === dayId ? { ...d, topic, pattern, youtubeId } : d))
      );
    } catch (err) {
      console.error("Error updating day details:", err);
      throw err;
    }
  };

  const updateDaysBulk = async (updates: { id: number; youtubeId: string }[]) => {
    if (isMockMode) {
      const currentDays = getMockDays();
      const updated = currentDays.map((d: any) => {
        const match = updates.find((u) => u.id === d.id);
        return match ? { ...d, youtubeId: match.youtubeId } : d;
      });
      saveMockDays(updated);
      setDays(updated);
      return;
    }
    if (!user) return;
    try {
      const promises = updates.map((u) =>
        supabase!
          .from("days")
          .update({ youtube_id: u.youtubeId || null })
          .eq("id", u.id)
      );
      const results = await Promise.all(promises);
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) throw new Error("Some bulk day updates failed");
      
      setDays((prev) =>
        prev.map((d) => {
          const match = updates.find((u) => u.id === d.id);
          return match ? { ...d, youtubeId: match.youtubeId } : d;
        })
      );
    } catch (err) {
      console.error("Error updating bulk days details:", err);
      throw err;
    }
  };

  const createPortalUser = async (email: string, password: string, name: string) => {
    if (isMockMode) {
      console.warn("User creation in mock mode is simulated.");
      return;
    }
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create user");
    }
  };

  const deletePortalUser = async (userId: string) => {
    if (isMockMode) {
      console.warn("User deletion in mock mode is simulated.");
      return;
    }
    const res = await fetch(`/api/admin/users?userId=${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete user");
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        user,
        profile,
        days,
        planProgress,
        dayManualDone,
        dayNotes,
        completedProblems,
        streak,
        loading,
        isMockMode,
        signIn,
        signUp,
        signOut,
        toggleProblem,
        toggleSheetProblem,
        toggleManualDayDone,
        saveDayNotes,
        updateProfile,
        refreshProgress,
        getChatHistory,
        saveChatMessage,
        updateDay,
        updateDaysBulk,
        createPortalUser,
        deletePortalUser,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
