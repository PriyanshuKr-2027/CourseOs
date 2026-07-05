"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  ChatCircle, 
  Database,
  Shield,
  SquaresFour,
  CheckCircle,
  PlayCircle,
  PencilSimple,
  Check,
  Plus,
  Trash,
  Sparkle,
  ArrowRight,
  MagnifyingGlass,
  ArrowSquareOut
} from "@phosphor-icons/react";
import { 
  getUserProgressList, 
  getCurriculumDays, 
  saveCurriculumDays,
  getProfile
} from "@/lib/store";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = "mnmv54o3xeo4";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "chats" | "curriculum">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [days, setDays] = useState<any[]>([]);
  
  // Curriculum state
  const [editingDayId, setEditingDayId] = useState<number | null>(null);
  const [editTopic, setEditTopic] = useState("");
  const [editPattern, setEditPattern] = useState("");
  const [editYoutubeId, setEditYoutubeId] = useState("");

  // Playlist Mapping tool state
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isMapping, setIsMapping] = useState(false);
  const [proposedMapping, setProposedMapping] = useState<any[]>([]);
  const [mappingMessage, setMappingMessage] = useState("");

  // Real-time Chat Monitor state
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isChatConnecting, setIsChatConnecting] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Search filters
  const [searchUser, setSearchUser] = useState("");
  const [searchDay, setSearchDay] = useState("");

  // Load Initial Data
  useEffect(() => {
    setUsers(getUserProgressList());
    setDays(getCurriculumDays());
  }, [activeTab]);

  // StreamChat Administration Client Connection
  useEffect(() => {
    if (activeTab !== "chats") return;
    
    setIsChatConnecting(true);
    setChatError(null);
    const client = StreamChat.getInstance(STREAM_API_KEY);

    const initAdminChat = async () => {
      try {
        const token = client.devToken("admin");
        await client.connectUser(
          {
            id: "admin",
            name: "System Administrator",
            image: "https://api.dicebear.com/7.x/bottts/svg?seed=admin"
          },
          token
        );
        setChatClient(client);

        // Query all channels that contain admin (since users add admin to members)
        const filter = { type: "messaging", members: { $in: ["admin"] } };
        const sort: any = { last_message_at: "desc" };
        const queriedChannels = await client.queryChannels(filter, sort, {
          watch: true,
          state: true
        } as any);
        
        setChannels(queriedChannels);
        setIsChatConnecting(false);

        // Listen for new messages globally in the client to update list
        client.on("message.new", (event) => {
          // Refresh channels list
          client.queryChannels(filter, sort).then(setChannels);
        });

      } catch (err: any) {
        console.error("Admin Stream connection error:", err);
        setChatError(err.message || "Could not connect to Stream Chat service.");
        setIsChatConnecting(false);
      }
    };

    initAdminChat();

    return () => {
      const cleanup = async () => {
        if (client) {
          try {
            await client.disconnectUser();
          } catch (e) {
            console.error(e);
          }
        }
      };
      cleanup();
    };
  }, [activeTab]);

  // Monitor channel message list
  useEffect(() => {
    if (!activeChannel) {
      setChatMessages([]);
      return;
    }

    setChatMessages(activeChannel.state.messages || []);

    const handleNewMessage = (event: any) => {
      if (event.channel_id === activeChannel.id) {
        setChatMessages((prev) => [...prev, event.message]);
      }
    };

    activeChannel.on("message.new", handleNewMessage);
    return () => {
      activeChannel.off("message.new", handleNewMessage);
    };
  }, [activeChannel]);

  // Statistics Computations
  const stats = useMemo(() => {
    if (users.length === 0) return { total: 0, avgProgress: 0, active: 0, totalSolved: 0 };
    const total = users.length;
    const avgProgress = Math.round(users.reduce((sum, u) => sum + u.percentage, 0) / total);
    const active = users.filter(u => {
      const lastActiveDate = new Date(u.lastActive);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return lastActiveDate >= oneWeekAgo;
    }).length;
    const totalSolved = users.reduce((sum, u) => sum + u.solvedCount, 0);
    return { total, avgProgress, active, totalSolved };
  }, [users]);

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
    );
  }, [users, searchUser]);

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
    setEditYoutubeId(day.youtubeId);
  };

  const handleEditSave = (id: number) => {
    const updatedDays = days.map(d => {
      if (d.id === id) {
        return {
          ...d,
          topic: editTopic,
          pattern: editPattern,
          youtubeId: editYoutubeId
        };
      }
      return d;
    });
    setDays(updatedDays);
    saveCurriculumDays(updatedDays);
    setEditingDayId(null);
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

  const handleApplyMapping = () => {
    const updatedDays = days.map(day => {
      const match = proposedMapping.find(m => m.dayId === day.id);
      if (match) {
        return {
          ...day,
          youtubeId: match.newYoutubeId
        };
      }
      return day;
    });

    setDays(updatedDays);
    saveCurriculumDays(updatedDays);
    setProposedMapping([]);
    setPlaylistUrl("");
    setMappingMessage("Playlist video mappings applied successfully to curriculum database!");
    setTimeout(() => setMappingMessage(""), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Admin Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield weight="fill" className="text-focus w-8 h-8" /> Administrator Console
          </h1>
          <p className="text-text-secondary text-sm">Monitor user progression, audit real-time chat networks, and edit curriculum details.</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-border bg-surface p-1 rounded-xl shadow-sm max-w-md">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === "users"
              ? "bg-focus text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Users className="w-4 h-4" /> Users & Progress
        </button>
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === "chats"
              ? "bg-focus text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <ChatCircle className="w-4 h-4" /> Chat Monitor
        </button>
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === "curriculum"
              ? "bg-focus text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Database className="w-4 h-4" /> Curriculum Editor
        </button>
      </div>

      {/* TAB 1: USERS & PROGRESS */}
      {activeTab === "users" && (
        <div className="space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-focus/10 rounded-xl text-focus"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Total Users</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
            <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-signal/10 rounded-xl text-signal"><CheckCircle className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Avg Completion</p>
                <p className="text-xl font-bold">{stats.avgProgress}%</p>
              </div>
            </div>
            <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-xl text-warning"><Sparkle className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Active This Week</p>
                <p className="text-xl font-bold">{stats.active}</p>
              </div>
            </div>
            <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-alert/10 rounded-xl text-alert"><PlayCircle className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Problems Solved</p>
                <p className="text-xl font-bold">{stats.totalSolved}</p>
              </div>
            </div>
          </div>

          {/* User List Panel */}
          <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-sm">Platform Users Progress Directory</h3>
              <div className="relative max-w-xs w-full">
                <MagnifyingGlass className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">User Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Joined Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Last Active</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase">Progress</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-paper/20 transition-all">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full bg-paper p-0.5 border border-border" />
                        <div>
                          <p className="font-bold text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-secondary font-mono">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize border ${
                          user.role === "admin" 
                            ? "bg-focus/10 border-focus/20 text-focus" 
                            : "bg-gray-100 border-border text-text-secondary"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-xs">{user.joinedDate}</td>
                      <td className="px-6 py-4 text-text-secondary text-xs font-mono">{user.lastActive}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 max-w-[200px]">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{user.percentage}%</span>
                            <span className="text-text-secondary font-mono">{user.solvedCount}/{user.totalProblems}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-signal h-full rounded-full" style={{ width: `${user.percentage}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="px-3 py-1.5 bg-paper hover:bg-border text-text-primary text-xs font-semibold rounded-lg border border-border transition-all flex items-center gap-1 w-fit"
                        >
                          View Plan <ArrowSquareOut className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL-TIME CHAT MONITOR */}
      {activeTab === "chats" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] items-stretch">
          {/* Chat List (Left) */}
          <div className="lg:col-span-4 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm h-full">
            <div className="p-4 border-b border-border bg-gray-50/50">
              <h3 className="font-bold text-xs uppercase text-text-secondary tracking-wider">Live Chat Channels</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {isChatConnecting ? (
                <div className="text-center py-12 text-xs text-text-secondary flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-focus border-t-transparent rounded-full animate-spin"></div>
                  Connecting Stream Administrator...
                </div>
              ) : chatError ? (
                <div className="text-center text-xs text-alert bg-alert/5 p-4 rounded-xl border border-alert/20">
                  {chatError}
                </div>
              ) : channels.length === 0 ? (
                <div className="text-center text-xs text-text-secondary py-12">
                  No active real-time channels found on server.
                </div>
              ) : (
                channels.map((chan) => {
                  const channelName = chan.data?.name || chan.id;
                  const lastMessage = chan.state.messages[chan.state.messages.length - 1];
                  const membersCount = Object.keys(chan.state.members).length;
                  const filteredMembers = Object.values(chan.state.members)
                    .map((m: any) => m.user?.name || m.user_id)
                    .filter((name) => name !== "System Administrator" && name !== "admin");

                  return (
                    <div
                      key={chan.id}
                      onClick={() => setActiveChannel(chan)}
                      className={`p-3 rounded-xl border border-border hover:bg-paper/40 cursor-pointer transition-all ${
                        activeChannel?.id === chan.id ? "bg-focus/5 border-focus/30" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-text-primary truncate max-w-[170px]">
                          {filteredMembers.join(" & ") || channelName}
                        </p>
                        <span className="text-[9px] font-semibold bg-gray-100 text-text-secondary px-2 py-0.5 rounded-full">
                          Live
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary font-medium mt-1.5 truncate">
                        {lastMessage ? `${lastMessage.user?.name || 'User'}: ${lastMessage.text}` : "No messages yet"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Transcript Viewer (Right) */}
          <div className="lg:col-span-8 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm h-full relative">
            {activeChannel ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">
                      Audit Stream: {Object.values(activeChannel.state.members)
                        .map((m: any) => m.user?.name || m.user_id)
                        .filter((n) => n !== "admin" && n !== "System Administrator")
                        .join(" & ") || activeChannel.data?.name}
                    </h4>
                    <p className="text-[10px] text-text-secondary">Channel Key: {activeChannel.id} (Monitoring Mode)</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-signal border border-signal/20 rounded-full text-[10px] font-bold animate-pulse">
                    Real-time Audit
                  </span>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto p-5 bg-paper/20 space-y-4">
                  {chatMessages.length === 0 ? (
                    <p className="text-center text-xs text-text-secondary py-12">No messages sent in this channel.</p>
                  ) : (
                    chatMessages.map((msg, idx) => {
                      const isSenderAdmin = msg.user?.id === "admin";
                      return (
                        <div key={idx} className={`flex flex-col max-w-[75%] ${isSenderAdmin ? "ml-auto items-end" : "mr-auto items-start"}`}>
                          <span className="text-[9px] text-text-secondary font-bold mb-1">{msg.user?.name || msg.user?.id}</span>
                          <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isSenderAdmin ? "bg-focus text-white" : "bg-surface text-text-primary border border-border"
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-text-secondary mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="p-3.5 bg-paper border border-border rounded-xl text-text-secondary"><ChatCircle className="w-8 h-8" /></div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Real-time Stream Monitor</h4>
                  <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                    Select an active channel from the left sidebar to audit the conversations of users in real-time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM EDITOR */}
      {activeTab === "curriculum" && (
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
                            day.youtubeId || "—"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <button
                              onClick={() => handleEditSave(day.id)}
                              className="p-1.5 bg-signal text-white rounded hover:opacity-90 transition-all flex items-center justify-center"
                              title="Save Day Details"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditStart(day)}
                              className="p-1.5 bg-paper hover:bg-border rounded border border-border text-text-secondary hover:text-focus transition-all flex items-center justify-center"
                              title="Edit Day Details"
                            >
                              <PencilSimple className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
                className="w-full py-2 bg-focus text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
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
                    className="flex-1 py-2 bg-signal text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Apply Mapping
                  </button>
                  <button
                    onClick={() => setProposedMapping([])}
                    className="px-3 py-2 border border-border text-text-secondary hover:bg-paper rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
