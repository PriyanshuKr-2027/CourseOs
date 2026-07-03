"use client";

import { useState } from "react";
import { ShieldWarning } from "@phosphor-icons/react";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [darkMode, setDarkMode] = useState(false);
  const [reminders, setReminders] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
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
            <span className="text-xl font-bold text-gray-600">JD</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Your Profile</h2>
            <p className="text-xs text-text-secondary">Avatar managed via OAuth provider</p>
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-focus text-white rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity text-sm"
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
              onClick={() => setReminders(!reminders)}
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
              onClick={() => confirm("Are you sure you want to reset all your progress? This cannot be undone.") && alert("Progress reset.")}
              className="px-4 py-2 border border-alert/30 text-alert hover:bg-alert/10 transition-colors font-medium rounded-lg text-sm self-start sm:self-center"
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
              onClick={() => confirm("Are you absolutely sure you want to delete your account? All data will be permanently deleted.") && alert("Account deletion simulation.")}
              className="px-4 py-2 bg-alert text-white hover:opacity-90 transition-opacity font-medium rounded-lg text-sm self-start sm:self-center"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
