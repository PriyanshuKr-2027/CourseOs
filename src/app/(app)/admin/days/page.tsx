"use client";

import { useState, useMemo } from "react";
import { 
  Database,
  PencilSimple,
  Check,
  Sparkle,
  MagnifyingGlass,
  ArrowSquareOut
} from "@phosphor-icons/react";
import { useSupabase } from "@/components/providers/SupabaseProvider";

export default function AdminDaysPage() {
  const { days, updateDay, updateDaysBulk } = useSupabase();

  // Curriculum Editor state
  const [editingDayId, setEditingDayId] = useState<number | null>(null);
  const [editTopic, setEditTopic] = useState("");
  const [editPattern, setEditPattern] = useState("");
  const [editYoutubeId, setEditYoutubeId] = useState("");

  // Playlist Mapping tool state
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isMapping, setIsMapping] = useState(false);
  const [proposedMapping, setProposedMapping] = useState<any[]>([]);
  const [mappingMessage, setMappingMessage] = useState("");

  // Search filter
  const [searchDay, setSearchDay] = useState("");

  const filteredDays = useMemo(() => {
    return days.filter(d => 
      d.topic.toLowerCase().includes(searchDay.toLowerCase()) ||
      d.pattern.toLowerCase().includes(searchDay.toLowerCase()) ||
      `day ${d.id}`.includes(searchDay.toLowerCase())
    );
  }, [days, searchDay]);

  // Curriculum Editor Handlers
  const handleEditStart = (day: any) => {
    setEditingDayId(day.id);
    setEditTopic(day.topic);
    setEditPattern(day.pattern);
    setEditYoutubeId(day.youtubeId || "");
  };

  const handleEditSave = async (id: number) => {
    try {
      await updateDay(id, editTopic, editPattern, editYoutubeId);
      setEditingDayId(null);
    } catch (err: any) {
      alert(err.message || "Failed to save day details.");
    }
  };

  // Simulated Playlist Mapper
  const handlePlaylistImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl) return;

    setIsMapping(true);
    setMappingMessage("");

    // Simulate playlist retrieval
    setTimeout(() => {
      const simulatedVideos = [
        { title: "Sliding Window Maximum - Hard", id: "DfljaUwZhs8", duration: "18 mins" },
        { title: "Longest Repeating Character Replacement", id: "gqXU1UyA8pk", duration: "12 mins" },
        { title: "Minimum Window Substring - Leetcode 76", id: "jSto0O4AJbM", duration: "25 mins" },
        { title: "Permutation in String - Two Pointers", id: "UbyhOgBN834", duration: "10 mins" },
        { title: "Subarray Product Less Than K", id: "SxtMxKyhkQ0", duration: "14 mins" }
      ];

      // Map them starting from day 15 onwards or matching topics
      const mapping = days.slice(14, 19).map((day, idx) => ({
        dayId: day.id,
        topic: day.topic,
        existingYoutubeId: day.youtubeId,
        newYoutubeId: simulatedVideos[idx].id,
        videoTitle: simulatedVideos[idx].title,
        duration: simulatedVideos[idx].duration
      }));

      setProposedMapping(mapping);
      setIsMapping(false);
      setMappingMessage("Successfully parsed 5 videos. Review mapping below.");
    }, 1500);
  };

  const handleApplyMapping = async () => {
    try {
      const updates = proposedMapping.map(m => ({
        id: m.dayId,
        youtubeId: m.newYoutubeId
      }));

      await updateDaysBulk(updates);
      setProposedMapping([]);
      setPlaylistUrl("");
      setMappingMessage("Playlist video mappings applied successfully to curriculum database!");
      setTimeout(() => setMappingMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to apply playlist mappings.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Admin Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Database weight="fill" className="text-focus w-8 h-8" /> Admin Content Management
        </h1>
        <p className="text-text-secondary text-sm">Update topics, patterns, and YouTube video IDs for the 92-Day curriculum.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Days Grid (Left) */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-sm">92-Day Curriculum Details Editor</h3>
            <div className="relative max-w-xs w-full">
              <MagnifyingGlass className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search topic or pattern..."
                value={searchDay}
                onChange={(e) => setSearchDay(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-xs"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-gray-50/50 sticky top-0 z-10">
                  <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase w-16">Day</th>
                  <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase w-32">Pattern</th>
                  <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase">Topic</th>
                  <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase w-32">YouTube ID</th>
                  <th className="px-4 py-3 text-xs font-bold text-text-secondary uppercase w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredDays.map((day) => {
                  const isEditing = editingDayId === day.id;
                  return (
                    <tr key={day.id} className="hover:bg-paper/10 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold">#{day.id}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPattern}
                            onChange={(e) => setEditPattern(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-border text-xs font-medium focus:ring-2 focus:ring-focus/25 focus:outline-none"
                          />
                        ) : (
                          <span className="px-2 py-0.5 bg-paper rounded border border-border font-medium text-text-secondary">
                            {day.pattern}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTopic}
                            onChange={(e) => setEditTopic(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-border text-xs font-medium focus:ring-2 focus:ring-focus/25 focus:outline-none"
                          />
                        ) : (
                          day.topic
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editYoutubeId}
                            onChange={(e) => setEditYoutubeId(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-border text-xs font-mono focus:ring-2 focus:ring-focus/25 focus:outline-none"
                          />
                        ) : (
                          day.youtubeId ? (
                            <a
                              href={`https://youtube.com/watch?v=${day.youtubeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-focus hover:underline flex items-center gap-1.5"
                            >
                              {day.youtubeId} <ArrowSquareOut className="w-3.5 h-3.5" />
                            </a>
                          ) : "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <button
                            onClick={() => handleEditSave(day.id)}
                            className="p-1.5 bg-signal text-white rounded hover:opacity-90 transition-all flex items-center justify-center cursor-pointer"
                            title="Save Day Details"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditStart(day)}
                            className="p-1.5 bg-paper hover:bg-border rounded border border-border text-text-secondary hover:text-focus transition-all flex items-center justify-center cursor-pointer"
                            title="Edit Day Details"
                          >
                            <PencilSimple className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredDays.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-text-secondary">No days match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Playlist Mapping Tool (Right) */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-2xl shadow-sm p-5 space-y-6">
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <Database className="text-focus w-4.5 h-4.5" /> Playlist Mapping Tool
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Paste a YouTube playlist URL to parse and map video IDs to sequential study days.
            </p>
          </div>

          <form onSubmit={handlePlaylistImport} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">YouTube Playlist URL</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/playlist?list=..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-paper border border-border text-xs focus:ring-2 focus:ring-focus/20 focus:outline-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={isMapping || !playlistUrl}
              className="w-full py-2 bg-focus text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isMapping ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Parsing Playlist...
                </>
              ) : (
                <>
                  Process Playlist
                </>
              )}
            </button>
          </form>

          {mappingMessage && (
            <div className="p-3 bg-focus/5 text-[11px] text-focus font-bold rounded-lg border border-focus/15 flex items-center gap-2">
              <Sparkle weight="fill" className="w-4 h-4 text-focus shrink-0 animate-pulse" />
              <span>{mappingMessage}</span>
            </div>
          )}

          {/* Proposed Mapping Table */}
          {proposedMapping.length > 0 && (
            <div className="space-y-3.5 pt-2 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
              <h4 className="text-xs font-bold text-text-primary">Review Proposed Day Mapping</h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {proposedMapping.map((map) => (
                  <div key={map.dayId} className="p-2.5 bg-paper rounded-lg border border-border text-[10px] space-y-1">
                    <div className="flex justify-between font-bold text-text-primary">
                      <span>Day #{map.dayId}</span>
                      <span className="font-mono text-text-secondary">{map.existingYoutubeId || "None"} &rarr; {map.newYoutubeId}</span>
                    </div>
                    <p className="text-text-secondary truncate">{map.videoTitle}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleApplyMapping}
                  className="flex-1 py-2 bg-signal text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Apply Mapping
                </button>
                <button
                  onClick={() => setProposedMapping([])}
                  className="px-3 py-2 border border-border text-text-secondary hover:bg-paper rounded-lg text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
