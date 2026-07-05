"use client";

import { useState } from "react";
import Link from "next/link";
import { getPatternBadgeStyle } from "@/lib/badgeStyle";
import { MagnifyingGlass, CalendarBlank } from "@phosphor-icons/react";
import { getNotesLastEdited } from "@/lib/store";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { Day } from "@/types";

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const { days, dayNotes } = useSupabase();

  const daysWithNotes = days.map((d: Day) => {
    const userNote = dayNotes[d.id] || "";
    return {
      ...d,
      notes: userNote,
      lastEdited: getNotesLastEdited(d.id)
    };
  }).filter((d) => d.notes.trim() !== "");

  const filteredNotes = daysWithNotes.filter((day) => {
    return day.notes.toLowerCase().includes(search.toLowerCase()) ||
      day.topic.toLowerCase().includes(search.toLowerCase()) ||
      day.pattern.toLowerCase().includes(search.toLowerCase()) ||
      `day ${day.id}`.includes(search.toLowerCase());
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Study Notes</h1>
        <p className="text-text-secondary text-sm">
          All your saved notes across the 92 days. Search and select any day to edit.
        </p>
      </div>

      {/* Search Box */}
      <div className="flex items-center relative bg-surface border border-border p-2 rounded-xl shadow-sm max-w-md">
        <MagnifyingGlass className="absolute left-4 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="Search note contents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 transition-all text-sm"
        />
      </div>

      {/* Notes List */}
      <section className="space-y-4">
        {filteredNotes.map((day) => (
          <Link
            key={day.id}
            href={`/day/${day.id}`}
            className="block bg-surface border border-border rounded-2xl p-6 shadow-sm hover:border-focus hover:shadow-md transition-all space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-focus">Day #{day.id}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPatternBadgeStyle(day.pattern)}`}>
                  {day.pattern}
                </span>
              </div>
              {day.lastEdited && (
                <span className="text-xs text-text-secondary flex items-center gap-1">
                  <CalendarBlank /> Edited {day.lastEdited}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="font-bold text-lg group-hover:text-focus transition-colors">{day.topic}</h2>
              <p className="text-text-secondary text-sm font-sans line-clamp-3 bg-paper p-4 rounded-xl border border-border/50 italic">
                &ldquo;{day.notes}&rdquo;
              </p>
            </div>
          </Link>
        ))}

        {filteredNotes.length === 0 && (
          <div className="bg-surface border border-border border-dashed rounded-2xl py-16 text-center space-y-2">
            <p className="text-text-secondary font-medium">No notes match your search.</p>
            <p className="text-xs text-text-secondary">
              Go to any <Link href="/plan" className="text-focus underline font-semibold">Day Page</Link> to start writing notes.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
