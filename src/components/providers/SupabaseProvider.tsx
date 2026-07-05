"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getProfile as getMockProfile, saveProfile as saveMockProfile, getPlanProgress as getMockProgress, savePlanProgress as saveMockProgress, getDayManualDone as getMockManualDone, saveDayManualDone as saveMockManualDone, getDayNotes as getMockNotes, saveDayNotes as saveMockNotes, getStreakInfo as getMockStreak, saveStreakInfo as saveMockStreak, getCurriculumDays as getMockDays } from "@/lib/store";

interface Profile {
  name: string;
  email: string;
  darkMode: boolean;
  reminders: boolean;
  role?: "learner" | "admin";
  current_streak?: number;
  last_active_date?: string;
  hasCompletedSetup?: boolean;
  dob?: string;
  mobileNo?: string;
  groqApiKey?: string;
}

interface SupabaseContextType {
  supabase: any;
  user: any;
  profile: Profile;
  days: any[];
  planProgress: Record<string, boolean>;
  dayManualDone: Record<number, boolean>;
  dayNotes: Record<number, string>;
  streak: number;
  loading: boolean;
  isMockMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  toggleProblem: (dayId: number, problemIndex: number) => Promise<void>;
  toggleManualDayDone: (dayId: number) => Promise<void>;
  saveDayNotes: (dayId: number, text: string) => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  refreshProgress: () => Promise<void>;
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

  const [user, setUser] = useState<any>(null);
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
  const [days, setDays] = useState<any[]>([]);
  const [planProgress, setPlanProgress] = useState<Record<string, boolean>>({});
  const [dayManualDone, setDayManualDone] = useState<Record<number, boolean>>({});
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({});
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

        const { data: dbProblems, error: probsErr } = await supabase!
          .from("problems")
          .select("*")
          .order("order_index", { ascending: true });

        let formattedDays = [];
        if (dbDays && dbProblems) {
          formattedDays = dbDays.map((day: any) => {
            const dayProblems = dbProblems.filter((p: any) => p.day_id === day.id);
            return {
              id: day.id,
              pattern: day.pattern,
              topic: day.topic,
              date: day.date_label,
              youtubeId: day.youtube_id || "",
              problems: dayProblems.map((p: any) => ({
                id: p.id,
                name: p.name,
                difficulty: p.difficulty,
                leetcodeUrl: p.leetcode_url || "",
                gfgUrl: p.gfg_url || "",
                youtubeUrl: p.youtube_url || "",
                isMissingVideo: p.is_missing_video,
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

        const solvedSet = new Set(solveData?.map((p: any) => p.problem_id) || []);

        // 5. Fetch user manual day completion
        const { data: dayDoneData } = await supabase!
          .from("progress_days")
          .select("day_id")
          .eq("user_id", session.user.id);

        const manualDoneMap: Record<number, boolean> = {};
        dayDoneData?.forEach((d: any) => {
          manualDoneMap[Number(d.day_id)] = true;
        });
        setDayManualDone(manualDoneMap);

        // 6. Map solved problems to frontend { [dayId_problemIndex]: boolean } schema
        const progressMap: Record<string, boolean> = {};
        formattedDays.forEach((day: any) => {
          day.problems.forEach((prob: any, idx: number) => {
            if (solvedSet.has(prob.id)) {
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
        notesData?.forEach((n: any) => {
          notesMap[Number(n.day_id)] = n.notes_text;
        });
        setDayNotes(notesMap);

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
            setStreak(0);
            router.push("/login");
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isMockMode]);

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
      setUser({ email });
      router.push("/dashboard");
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
      setUser({ email });
      router.push("/dashboard");
      return { error: null };
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

  // Toggle problem solved
  const toggleProblem = async (dayId: number, problemIndex: number) => {
    const key = `${dayId}_${problemIndex}`;
    const newSolvedVal = !planProgress[key];

    // 1. Optimistic UI update
    setPlanProgress((prev) => ({
      ...prev,
      [key]: newSolvedVal,
    }));

    if (isMockMode) {
      const progress = getMockProgress();
      progress[key] = newSolvedVal;
      saveMockProgress(progress);
      if (newSolvedVal) await registerActivity();
      return;
    }

    if (!user) return;

    try {
      // Find the problem UUID
      const dayData = days.find((d) => d.id === dayId);
      const problem = dayData?.problems[problemIndex];
      if (!problem || !problem.id) return;

      if (newSolvedVal) {
        // Insert progress
        await supabase!
          .from("progress")
          .insert({ user_id: user.id, problem_id: problem.id });
        await registerActivity();
      } else {
        // Delete progress
        await supabase!
          .from("progress")
          .delete()
          .eq("user_id", user.id)
          .eq("problem_id", problem.id);
      }
    } catch (err) {
      console.error("Error toggling problem progress:", err);
      // Revert on error
      setPlanProgress((prev) => ({
        ...prev,
        [key]: !newSolvedVal,
      }));
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
      const updatePayload: any = {};
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

      const solvedSet = new Set(solveData?.map((p: any) => p.problem_id) || []);

      const progressMap: Record<string, boolean> = {};
      days.forEach((day: any) => {
        day.problems.forEach((prob: any, idx: number) => {
          if (solvedSet.has(prob.id)) {
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
      dayDoneData?.forEach((d: any) => {
        manualDoneMap[Number(d.day_id)] = true;
      });
      setDayManualDone(manualDoneMap);
    } catch (e) {
      console.error(e);
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
        streak,
        loading,
        isMockMode,
        signIn,
        signUp,
        signOut,
        toggleProblem,
        toggleManualDayDone,
        saveDayNotes,
        updateProfile,
        refreshProgress,
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
