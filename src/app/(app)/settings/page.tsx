"use client";

import { useState } from "react";
import { ShieldWarning } from "@phosphor-icons/react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { resetAllData } from "@/lib/store";
import { Profile } from "@/types";

export default function SettingsPage() {
  const { profile, updateProfile, isMockMode, supabase, user } = useSupabase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [groqApiKey, setGroqApiKey] = useState("");

  const [prevProfile, setPrevProfile] = useState<Profile | null>(null);
  if (profile && profile !== prevProfile) {
    setPrevProfile(profile);
    setName(profile.name || "");
    setEmail(profile.email || "");
    setDarkMode(profile.darkMode || false);
    setReminders(profile.reminders ?? true);
    setGroqApiKey(profile.groqApiKey || "");
  }

  const toggleDarkMode = () => {
    const updatedDarkMode = !darkMode;
    setDarkMode(updatedDarkMode);
    document.documentElement.classList.toggle("dark", updatedDarkMode);
    updateProfile({ darkMode: updatedDarkMode });
  };

  const toggleReminders = () => {
    const updatedReminders = !reminders;
    setReminders(updatedReminders);
    updateProfile({ reminders: updatedReminders });
  };

  const handleSave = () => {
    if (groqApiKey && !groqApiKey.startsWith("gsk_")) {
      alert("Invalid Groq API key. Keys typically start with 'gsk_'.");
      return;
    }
    updateProfile({ name, email, groqApiKey });
    alert("Settings saved successfully!");
  };

  const handleResetProgress = async () => {
    if (!confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      return;
    }

    if (isMockMode) {
      resetAllData();
      alert("Progress reset successfully!");
      window.location.reload();
      return;
    }

    if (!user || !supabase) return;

    try {
      const { error: err1 } = await supabase.from("progress").delete().eq("user_id", user.id);
      const { error: err2 } = await supabase.from("progress_days").delete().eq("user_id", user.id);
      const { error: err3 } = await supabase.from("user_notes").delete().eq("user_id", user.id);
      const { error: err4 } = await supabase
        .from("profiles")
        .update({ current_streak: 0, last_active_date: null })
        .eq("id", user.id);

      if (err1 || err2 || err3 || err4) {
        throw new Error("Failed to clear data in one or more tables.");
      }

      alert("Progress reset successfully!");
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Failed to reset progress. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure you want to delete your account? All your data will be permanently deleted.")) {
      return;
    }

    if (isMockMode) {
      alert("Account deletion simulation.");
      return;
    }

    if (!user || !supabase) return;

    try {
      // Deleting profile row cascading deletes references due to DB rules.
      const { error } = await supabase.from("profiles").delete().eq("id", user.id);
      if (error) throw error;
      
      await supabase.auth.signOut();
      alert("Account deleted successfully.");
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-text-secondary text-sm">Manage your profile, preferences, and account state.</p>
      </div>

      {/* Profile Card */}
      <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">
              {name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "JD"}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Your Profile</h2>
            <p className="text-xs text-text-secondary">Profile synced with Supabase</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-border focus:outline-none text-sm font-medium text-text-secondary cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Groq API Key</label>
          <input
            type="password"
            placeholder="gsk_••••••••••••••••••••••••"
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium font-mono"
          />
          <p className="text-[10px] text-text-secondary font-medium">Used to power your study assistant AI agent in day panels. Keys start with <code>gsk_</code>.</p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-focus text-white rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity text-sm cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="font-bold text-lg">Preferences</h2>
        
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold">Dark Mode</h3>
              <p className="text-xs text-text-secondary">Switch between light and dark UI themes</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${darkMode ? 'bg-signal' : 'bg-gray-200'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-4 last:pb-0">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold">Email Reminders</h3>
              <p className="text-xs text-text-secondary">Get streak preservation alerts and daily plan updates</p>
            </div>
            <button
              onClick={toggleReminders}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${reminders ? 'bg-signal' : 'bg-gray-200'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${reminders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="border border-alert/20 bg-alert/5 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-alert">
          <ShieldWarning className="w-6 h-6" />
          <h2 className="font-bold text-lg">Danger Zone</h2>
        </div>
        
        <div className="divide-y divide-alert/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-text-primary">Reset Progress</h3>
              <p className="text-xs text-text-secondary">Clear all solved checkboxes and streak data. This is irreversible.</p>
            </div>
            <button
              onClick={handleResetProgress}
              className="px-4 py-2 border border-alert/30 text-alert hover:bg-alert/10 transition-colors font-medium rounded-lg text-sm self-start sm:self-center cursor-pointer"
            >
              Reset All Progress
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 last:pb-0 gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-text-primary">Delete Account</h3>
              <p className="text-xs text-text-secondary">Permanently delete your profile, notes, and study logs.</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-alert text-white hover:opacity-90 transition-opacity font-medium rounded-lg text-sm self-start sm:self-center cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
