export interface Profile {
  name: string;
  email: string;
  darkMode: boolean;
  reminders: boolean;
  role?: "learner" | "admin";
  current_streak?: number;
  last_active_date?: string | null;
  hasCompletedSetup?: boolean;
  dob?: string;
  mobileNo?: string;
  groqApiKey?: string;
}

export interface Problem {
  id?: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  leetcodeUrl: string;
  youtubeUrl: string | null;
  gfgUrl: string | null;
  done: boolean;
  isMissingVideo?: boolean;
  dayId?: number;
  pattern?: string;
  problemIndex?: number;
}

export interface Day {
  id: number;
  pattern: string;
  topic: string;
  date?: string;
  youtubeId: string;
  problems: Problem[];
  done: boolean;
  notes: string;
  lastEdited?: string | null;
}
