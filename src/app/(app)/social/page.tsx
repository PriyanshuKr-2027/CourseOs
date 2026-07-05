"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Users,
  VideoCamera,
  X,
  UserPlus,
  UserMinus,
  Check,
  ChatCircle,
  MagnifyingGlass,
  UserCheck
} from "@phosphor-icons/react";

import { useSupabase } from "@/components/providers/SupabaseProvider";

// GetStream Client Imports
import { StreamChat } from "stream-chat";
import {
  Chat as StreamChatProvider,
  Channel as StreamChannelProvider,
  Window as StreamWindow,
  MessageList as StreamMessageList,
  MessageComposer as StreamMessageComposer,
  ChannelHeader as StreamChannelHeader
} from "stream-chat-react";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  useCalls
} from "@stream-io/video-react-sdk";

// Import styles (these will be loaded in Next.js)
import "stream-chat-react/dist/css/index.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || "mnmv54a3xea4";

let activeConnectionCount = 0;

export default function SocialPage() {
  const { user, profile, supabase } = useSupabase();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const cleanupTimeoutRef = useRef<any>(null);

  // Initialize GetStream clients when user changes
  useEffect(() => {
    if (!user) return;

    // Clear any pending cleanup/disconnect timeouts
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    activeConnectionCount++;

    let isSubscribed = true;
    let chatInstance: StreamChat | null = null;
    let videoInstance: StreamVideoClient | null = null;

    setStreamConnected(false);
    setStreamError(null);

    const initStream = async () => {
      try {
        chatInstance = StreamChat.getInstance(STREAM_API_KEY);
        
        // Fetch token from server-side endpoint with client-side devToken fallback
        const tokenRes = await fetch(`/api/stream-token?userId=${user.id}`);
        const tokenData = await tokenRes.json();
        let token = tokenData.token;
        if (!token) {
          console.warn("STREAM_API_SECRET is not configured in .env.local. Falling back to devToken.");
          token = chatInstance.devToken(user.id);
        }
        
        // Connect Chat user if not already connected/connecting
        if (chatInstance.userID !== user.id) {
          if (chatInstance.userID) {
            await chatInstance.disconnectUser();
          }
          await chatInstance.connectUser(
            {
              id: user.id,
              name: profile?.name || user.email?.split("@")[0] || "User",
              image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || "")}`
            },
            token
          );
        }

        // Connect Video user using getOrCreateInstance to enforce singleton pattern
        videoInstance = StreamVideoClient.getOrCreateInstance({
          apiKey: STREAM_API_KEY,
          user: {
            id: user.id,
            name: profile?.name || user.email?.split("@")[0] || "User",
            image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || "")}`
          },
          token
        });

        if (isSubscribed) {
          setChatClient(chatInstance);
          setVideoClient(videoInstance);
          setStreamConnected(true);
        }
      } catch (err: any) {
        console.error("Stream Connection Error:", err);
        if (isSubscribed) {
          setStreamError(err.message || "Failed to connect to GetStream server.");
        }
      }
    };

    initStream();

    return () => {
      isSubscribed = false;
      activeConnectionCount--;
      
      // Delay disconnect to prevent race conditions during React Strict Mode double-mounting
      cleanupTimeoutRef.current = setTimeout(async () => {
        if (activeConnectionCount === 0) {
          if (chatInstance) {
            try {
              await chatInstance.disconnectUser();
              console.log("Chat client disconnected successfully");
            } catch (e) {
              console.error("Error disconnecting Chat client:", e);
            }
          }
          if (videoInstance) {
            try {
              await videoInstance.disconnectUser();
              console.log("Video client disconnected successfully");
            } catch (e) {
              console.error("Error disconnecting Video client:", e);
            }
          }
        }
      }, 500);
    };
  }, [user?.id, profile?.name]);

  if (!streamConnected && !streamError) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-focus border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-text-secondary">Initializing live social systems...</p>
        </div>
      </div>
    );
  }

  const workspaceProps = {
    user,
    profile,
    supabase,
    chatClient,
    videoClient,
    streamConnected,
    streamError
  };

  if (videoClient) {
    return (
      <StreamVideo client={videoClient}>
        <SocialWorkspaceContent {...workspaceProps} />
      </StreamVideo>
    );
  }

  return <SocialWorkspaceContent {...workspaceProps} />;
}

function SocialWorkspaceContent({
  user,
  profile,
  supabase,
  chatClient,
  videoClient,
  streamConnected,
  streamError
}: any) {
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [activeFriend, setActiveFriend] = useState<any | null>(null);
  const [activeGroup, setActiveGroup] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "find">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Group creation modal states
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  // Stream Client states
  const [streamChannel, setStreamChannel] = useState<any>(null);
  
  // Call States
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  // Online status presence mapping
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  const calls = useCalls();

  // Monitor calls list for incoming ringing calls or active joined calls
  useEffect(() => {
    if (!videoClient) return;

    const activeCallInstance = calls.find(
      (c) => c.state.callingState === "ringing" || c.state.callingState === "joined"
    );

    if (activeCallInstance) {
      setActiveCall(activeCallInstance);
      setIsCalling(true);
    } else {
      setActiveCall(null);
      setIsCalling(false);
    }
  }, [calls, videoClient]);

  // Fetch social data from Supabase
  const loadSocialData = async () => {
    if (!supabase || !user) return;
    try {
      // 1. Fetch all other users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .neq("id", user.id);

      if (usersError) throw usersError;

      const formattedUsers = (usersData || []).map((u: any) => ({
        id: u.id,
        name: u.name || u.email.split("@")[0],
        email: u.email,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email)}`
      }));
      setDbUsers(formattedUsers);

      // 2. Fetch friendships
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from("friendships")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (friendshipsError) throw friendshipsError;
      setFriendships(friendshipsData || []);

      // 3. Fetch groups that the user belongs to
      const { data: memberGroups, error: memberGroupsError } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);

      if (memberGroupsError) throw memberGroupsError;

      if (memberGroups && memberGroups.length > 0) {
        const groupIds = memberGroups.map((mg: any) => mg.group_id);

        const { data: groupsData, error: groupsError } = await supabase
          .from("group_chats")
          .select("*")
          .in("id", groupIds);

        if (groupsError) throw groupsError;

        const { data: allMembers, error: membersError } = await supabase
          .from("group_members")
          .select("group_id, user_id, profiles(id, name, email)")
          .in("group_id", groupIds);

        if (membersError) throw membersError;

        const formattedGroups = (groupsData || []).map((g: any) => {
          const mInfos = (allMembers || [])
            .filter((m: any) => m.group_id === g.id)
            .map((m: any) => ({
              id: m.user_id,
              name: m.profiles?.name || m.profiles?.email?.split("@")[0] || "User",
              email: m.profiles?.email || ""
            }));

          return {
            id: g.id,
            name: g.name,
            createdById: g.created_by,
            members: mInfos.map((m: any) => m.id),
            memberDetails: mInfos,
            avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(g.name)}`
          };
        });

        setGroups(formattedGroups);
      } else {
        setGroups([]);
      }
    } catch (e) {
      console.error("Error loading social data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabase && user) {
      loadSocialData();
    }
  }, [supabase, user]);

  // Handle active channel selection
  useEffect(() => {
    if (!chatClient || !user || !streamConnected) {
      setStreamChannel(null);
      return;
    }

    if (!activeFriend && !activeGroup) {
      setStreamChannel(null);
      return;
    }

    const initChannel = async () => {
      if (!chatClient || !chatClient.userID) return;
      try {
        let channel;
        if (activeFriend) {
          // Ensure the friend and admin user objects are registered on Stream
          await fetch(`/api/stream-token?userId=${activeFriend.id}`);

          // Create 1-on-1 channel with admin as a member for auditing
          channel = chatClient.channel("messaging", {
            members: [user.id, activeFriend.id, "admin"],
            name: activeFriend.name
          } as any);
        } else if (activeGroup) {
          // Ensure all group members and admin are registered on Stream
          await Promise.all([
            fetch(`/api/stream-token?userId=admin`),
            ...activeGroup.members.map((memberId: string) =>
              fetch(`/api/stream-token?userId=${memberId}`)
            )
          ]);

          // Create group channel
          channel = chatClient.channel("messaging", activeGroup.id, {
            members: [...activeGroup.members, "admin"],
            name: activeGroup.name
          } as any);
        }
        
        if (channel) {
          await channel.watch();
          setStreamChannel(channel);
        }
      } catch (e) {
        console.error("Failed to initialize channel:", e);
      }
    };

    initChannel();
  }, [chatClient, user?.id, activeFriend?.id, activeGroup?.id, streamConnected]);

  // Derived lists
  const friends = useMemo(() => {
    if (!user || !dbUsers.length) return [];
    const acceptedFriendIds = friendships
      .filter((f) => f.status === "accepted")
      .map((f) => (f.sender_id === user.id ? f.receiver_id : f.sender_id));
    return dbUsers.filter((u) => acceptedFriendIds.includes(u.id));
  }, [user, friendships, dbUsers]);

  // Monitor online status of friends in real-time
  useEffect(() => {
    if (!chatClient || !streamConnected || friends.length === 0) return;

    const fetchPresence = async () => {
      if (!chatClient || !chatClient.userID) return;
      try {
        const friendIds = friends.map((f) => f.id);
        const response = await chatClient.queryUsers(
          { id: { $in: friendIds } },
          { last_active: -1 }
        );
        
        const presenceMap: Record<string, boolean> = {};
        response.users.forEach((u: any) => {
          presenceMap[u.id] = !!u.online;
        });
        setOnlineUsers(presenceMap);
      } catch (e) {
        console.error("Error querying user presence:", e);
      }
    };

    fetchPresence();

    const handlePresenceChange = (event: any) => {
      if (event.user) {
        setOnlineUsers((prev) => ({
          ...prev,
          [event.user.id]: !!event.user.online
        }));
      }
    };

    chatClient.on("user.presence.changed", handlePresenceChange);
    return () => {
      chatClient.off("user.presence.changed", handlePresenceChange);
    };
  }, [chatClient, streamConnected, friends]);

  const incomingRequests = useMemo(() => {
    if (!user || !dbUsers.length) return [];
    const requesterIds = friendships
      .filter((f) => f.receiver_id === user.id && f.status === "pending")
      .map((f) => f.sender_id);
    return dbUsers.filter((u) => requesterIds.includes(u.id));
  }, [user, friendships, dbUsers]);

  const sentRequests = useMemo(() => {
    if (!user || !dbUsers.length) return [];
    const receiverIds = friendships
      .filter((f) => f.sender_id === user.id && f.status === "pending")
      .map((f) => f.receiver_id);
    return dbUsers.filter((u) => receiverIds.includes(u.id));
  }, [user, friendships, dbUsers]);

  const searchableUsers = useMemo(() => {
    let pool = dbUsers;
    if (searchQuery.trim()) {
      pool = pool.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return pool;
  }, [dbUsers, searchQuery]);

  // Action handlers
  const handleAddFriend = async (receiverId: string) => {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("friendships")
      .insert({ sender_id: user.id, receiver_id: receiverId, status: "pending" });
    if (!error) {
      loadSocialData();
    }
  };

  const handleAcceptRequest = async (senderId: string) => {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("sender_id", senderId)
      .eq("receiver_id", user.id);
    if (!error) {
      loadSocialData();
    }
  };

  const handleDeclineOrRemove = async (otherUserId: string) => {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("friendships")
      .delete()
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`);
    
    if (!error) {
      if (activeFriend?.id === otherUserId) {
        setActiveFriend(null);
      }
      loadSocialData();
    }
  };

  const handleCreateGroup = async () => {
    if (!supabase || !user || !newGroupName.trim() || selectedGroupMembers.length === 0) return;
    try {
      const { data: newGroup, error: groupErr } = await supabase
        .from("group_chats")
        .insert({ name: newGroupName.trim(), created_by: user.id })
        .select()
        .single();

      if (groupErr) throw groupErr;

      if (newGroup) {
        const membersToInsert = [user.id, ...selectedGroupMembers].map((uid) => ({
          group_id: newGroup.id,
          user_id: uid
        }));

        const { error: membersErr } = await supabase
          .from("group_members")
          .insert(membersToInsert);

        if (membersErr) throw membersErr;

        setIsCreateGroupModalOpen(false);
        setNewGroupName("");
        setSelectedGroupMembers([]);
        await loadSocialData();

        const formattedNewGroup = {
          id: newGroup.id,
          name: newGroup.name,
          createdById: newGroup.created_by,
          members: [user.id, ...selectedGroupMembers],
          avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(newGroup.name)}`
        };
        setActiveFriend(null);
        setActiveGroup(formattedNewGroup);
      }
    } catch (e) {
      console.error("Error creating group:", e);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!supabase || !user) return;
    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      if (!error) {
        const { count } = await supabase
          .from("group_members")
          .select("id", { count: "exact" })
          .eq("group_id", groupId);
        
        if (count === 0) {
          await supabase.from("group_chats").delete().eq("id", groupId);
        }

        if (activeGroup?.id === groupId) {
          setActiveGroup(null);
        }
        loadSocialData();
      }
    } catch (e) {
      console.error("Error leaving group:", e);
    }
  };

  // Video Call Handlers
  const startCall = async () => {
    if (!user || (!activeFriend && !activeGroup)) return;
    setIsCalling(true);
    try {
      // Generate a new, unique UUID for this specific call attempt (required for ringing calls)
      const callId = crypto.randomUUID();

      const callInstance = videoClient.call("default", callId);
      
      const members = activeFriend
        ? [
            { user_id: user.id, role: "admin" },
            { user_id: activeFriend.id, role: "user" }
          ]
        : [
            { user_id: user.id, role: "admin" },
            ...activeGroup.members.map((id: string) => ({ user_id: id, role: "user" }))
          ];

      await callInstance.getOrCreate({
        ring: true, // Ring callee(s)
        video: true,
        data: {
          members
        }
      });
      
      await callInstance.join();
      setActiveCall(callInstance);
    } catch (e) {
      console.error("Failed to start Stream call:", e);
      setIsCalling(false);
    }
  };

  const endCall = async () => {
    if (activeCall) {
      try {
        const state = activeCall.state.callingState;
        // Only call leave() if the call hasn't already terminated
        if (state !== "left" && state !== "disconnected") {
          await activeCall.leave();
        }
      } catch (e) {
        console.warn("Call already left or error leaving:", e);
      }
    }
    setActiveCall(null);
    setIsCalling(false);
  };

  const handleToggleMemberSelection = (friendId: string) => {
    setSelectedGroupMembers((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-focus border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-text-secondary">Loading social workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 relative h-[calc(100vh-8rem)]">
      {/* Top Banner & Profile Info */}
      <section className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2 text-text-primary">
            <Users weight="fill" className="text-focus" /> Social Workspace
          </h1>
          <p className="text-xs text-text-secondary">
            Send requests, chat, and call other users working on the 92-Day plan.
          </p>
        </div>

        {/* Current User Info */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-paper border border-border rounded-xl">
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.email || "")}`}
            alt=""
            className="w-6 h-6 rounded-full bg-white p-0.5 border border-border"
          />
          <span className="text-xs font-bold text-[#1B1917]">{profile?.name || user?.email?.split("@")[0]}</span>
        </div>
      </section>

      {/* Main Grid split: Lists vs Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch">
        
        {/* Left Column: Lists */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm h-[600px]">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-border bg-gray-50/50 p-1.5 gap-1 text-center">
            <button
              onClick={() => setActiveTab("friends")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "friends"
                  ? "bg-white text-text-primary shadow-sm border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                activeTab === "requests"
                  ? "bg-white text-text-primary shadow-sm border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Requests
              {incomingRequests.length > 0 && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-alert"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("find")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "find"
                  ? "bg-white text-text-primary shadow-sm border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Find Users
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* SEARCH FOR USERS in "find" */}
            {activeTab === "find" && (
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-2.5 w-4.5 h-4.5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-xs font-medium"
                />
              </div>
            )}

            {/* TAB: FRIENDS */}
            {activeTab === "friends" && (
              <div className="space-y-5">
                {/* Create Group Button */}
                <button
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-focus text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                >
                  <Users weight="bold" className="w-4 h-4" />
                  Create Group Chat
                </button>

                {/* Direct Messages Section */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">
                    Direct Messages ({friends.length})
                  </h3>
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-paper/40 transition-all cursor-pointer ${
                        activeFriend?.id === friend.id ? "bg-focus/5 border-focus/30" : ""
                      }`}
                      onClick={() => {
                        setActiveFriend(friend);
                        setActiveGroup(null);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={friend.avatarUrl} alt="" className="w-9 h-9 rounded-full bg-gray-100 p-0.5 border border-border" />
                          {onlineUsers[friend.id] && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-signal ring-2 ring-white" title="Online" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-text-primary">{friend.name}</p>
                          <p className="text-[10px] text-text-secondary font-mono truncate max-w-[140px]">{friend.email}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeclineOrRemove(friend.id);
                        }}
                        className="p-1 hover:bg-alert/10 text-text-secondary hover:text-alert rounded transition-colors cursor-pointer"
                        title="Unfriend"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {friends.length === 0 && (
                    <p className="text-center text-[11px] text-text-secondary py-6 bg-paper/10 rounded-xl">
                      No friends yet. Add users in &quot;Find Users&quot;.
                    </p>
                  )}
                </div>

                {/* Group Chats Section */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-1">
                    Group Chats ({groups.length})
                  </h3>
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-paper/40 transition-all cursor-pointer ${
                        activeGroup?.id === group.id ? "bg-focus/5 border-focus/30" : ""
                      }`}
                      onClick={() => {
                        setActiveGroup(group);
                        setActiveFriend(null);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img src={group.avatarUrl} alt="" className="w-9 h-9 rounded-full bg-gray-100 p-0.5 border border-border" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-text-primary">{group.name}</p>
                          <p className="text-[10px] text-text-secondary font-mono truncate max-w-[140px]">
                            {group.members.length} members
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveGroup(group.id);
                        }}
                        className="p-1 hover:bg-alert/10 text-text-secondary hover:text-alert rounded transition-colors cursor-pointer"
                        title="Leave Group"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {groups.length === 0 && (
                    <p className="text-center text-[11px] text-text-secondary py-6 bg-paper/10 rounded-xl">
                      No group chats yet. Click above to create one.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: REQUESTS */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {/* Incoming Requests */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Incoming Requests ({incomingRequests.length})</h3>
                  {incomingRequests.map((sender) => (
                    <div key={sender.id} className="flex items-center justify-between p-2.5 bg-paper/30 border border-border rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <img src={sender.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-white" />
                        <span className="text-xs font-bold text-text-primary">{sender.name}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleAcceptRequest(sender.id)}
                          className="p-1.5 bg-signal hover:opacity-90 rounded-lg text-white text-xs font-semibold flex items-center justify-center cursor-pointer"
                          title="Accept"
                        >
                          <Check className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeclineOrRemove(sender.id)}
                          className="p-1.5 bg-alert hover:opacity-90 rounded-lg text-white text-xs font-semibold flex items-center justify-center cursor-pointer"
                          title="Decline"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {incomingRequests.length === 0 && (
                    <p className="text-[11px] text-text-secondary text-center py-4 bg-paper/20 rounded-xl">No pending incoming requests.</p>
                  )}
                </div>

                {/* Sent Requests */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Sent Requests ({sentRequests.length})</h3>
                  {sentRequests.map((receiver) => (
                    <div key={receiver.id} className="flex items-center justify-between p-2.5 bg-paper/20 border border-border rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <img src={receiver.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-white" />
                        <span className="text-xs font-bold text-text-primary">{receiver.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold bg-gray-100 text-text-secondary px-2.5 py-1 rounded-full border border-border/50">
                        Pending
                      </span>
                    </div>
                  ))}
                  {sentRequests.length === 0 && (
                    <p className="text-[11px] text-text-secondary text-center py-4 bg-paper/10 rounded-xl">No pending sent requests.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: FIND USERS */}
            {activeTab === "find" && (
              <div className="space-y-2">
                {searchableUsers.map((u) => {
                  const isFriend = friends.some((f) => f.id === u.id);
                  const isIncoming = incomingRequests.some((r) => r.id === u.id);
                  const isSent = sentRequests.some((s) => s.id === u.id);

                  return (
                    <div key={u.id} className="flex items-center justify-between p-2.5 border border-border rounded-xl hover:bg-paper/30 transition-all">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-gray-50" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-text-primary">{u.name}</p>
                          <p className="text-[9px] font-mono text-text-secondary truncate max-w-[120px]">{u.email}</p>
                        </div>
                      </div>

                      {isFriend ? (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-signal bg-signal/10 border border-signal/20 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> Friends
                        </span>
                      ) : isSent ? (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-text-secondary bg-gray-50 border border-border">
                          Requested
                        </span>
                      ) : isIncoming ? (
                        <button
                          onClick={() => handleAcceptRequest(u.id)}
                          className="px-2.5 py-1 bg-focus text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          Accept
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFriend(u.id)}
                          className="p-1.5 bg-paper hover:bg-border border border-border rounded-lg text-text-secondary hover:text-focus transition-all flex items-center justify-center cursor-pointer"
                          title="Add Friend"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat/Call Workspace */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm h-[600px] relative">
          
          {(activeFriend || activeGroup) ? (
            <div className="flex flex-col h-full relative">
              
              {/* Workspace Header */}
              <div className="p-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeFriend ? activeFriend.avatarUrl : activeGroup.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full bg-white p-0.5 border border-border"
                  />
                  <div className="text-left max-w-[200px] sm:max-w-sm">
                    <h3 className="font-bold text-sm text-text-primary truncate">
                      {activeFriend ? activeFriend.name : activeGroup.name}
                    </h3>
                    <p className="text-[10px] text-text-secondary font-mono truncate">
                      {activeFriend 
                        ? activeFriend.email 
                        : `${activeGroup.members.length} members: ${activeGroup.memberDetails?.map((m: any) => m.name).join(", ")}`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={startCall}
                    className="p-2 border border-border hover:bg-paper rounded-xl text-text-secondary hover:text-focus transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <VideoCamera weight="fill" className="w-5 h-5 text-focus" /> Start Call
                  </button>
                  <button
                    onClick={() => {
                      setActiveFriend(null);
                      setActiveGroup(null);
                    }}
                    className="p-2 border border-border hover:bg-paper rounded-xl text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center bg-white cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Chat Message Workspace */}
              <div className="flex-1 flex flex-col bg-paper/20">
                {streamConnected && chatClient && streamChannel ? (
                  <div className="flex-grow flex flex-col h-full overflow-hidden text-sm">
                    <StreamChatProvider client={chatClient}>
                      <StreamChannelProvider channel={streamChannel}>
                        <StreamWindow>
                          <StreamChannelHeader />
                          <StreamMessageList />
                          <StreamMessageComposer />
                        </StreamWindow>
                      </StreamChannelProvider>
                    </StreamChatProvider>
                  </div>
                ) : streamError ? (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-2">
                    <p className="text-xs text-red-500 font-semibold">{streamError}</p>
                    <p className="text-[11px] text-text-secondary">Please check your network connection.</p>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-8 h-8 border-4 border-focus border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-text-secondary">Connecting to live chat server...</p>
                  </div>
                )}
              </div>

              {/* Call Overlay overlay */}
              {isCalling && activeCall && (
                <div className="absolute inset-0 bg-[#0d0f14] z-40 flex flex-col text-white animate-in fade-in duration-300">
                  
                  {activeCall.state.callingState === "ringing" && !activeCall.isCreatedByMe ? (
                    /* Incoming Call Screen */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 bg-slate-900/90">
                      <div className="relative">
                        <img
                          src={activeCall.state.createdBy?.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(activeCall.state.createdBy?.id || "")}`}
                          alt=""
                          className="w-20 h-20 rounded-full border-4 border-focus bg-slate-800 p-1"
                        />
                        <span className="absolute bottom-1 right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-signal"></span>
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-center">
                        <h3 className="font-bold text-base">{activeCall.state.createdBy?.name || activeCall.state.createdBy?.id || "Someone"}</h3>
                        <p className="text-xs text-slate-400">Incoming Video Call...</p>
                      </div>

                      <div className="flex gap-4 w-full max-w-xs pt-2">
                        <button
                          onClick={async () => {
                            try {
                              await activeCall.leave({ reject: true });
                            } catch (e) {
                              console.error("Error declining call:", e);
                            }
                          }}
                          className="flex-1 py-3 bg-alert hover:bg-alert/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                        >
                          Decline
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await activeCall.join();
                            } catch (e) {
                              console.error("Error joining call:", e);
                            }
                          }}
                          className="flex-1 py-3 bg-signal hover:bg-signal/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Active call full-screen window */
                    <StreamCall call={activeCall}>
                      <div className="flex-1 flex flex-col justify-between p-4 h-full">
                        <h4 className="text-center text-sm font-bold mt-2">
                          {activeCall.state.callingState === "ringing"
                            ? `Calling: ${activeFriend ? activeFriend.name : activeGroup.name}...`
                            : `Active Call: ${activeFriend ? activeFriend.name : activeGroup.name}`
                          }
                        </h4>
                        <div className="flex-grow flex flex-col items-center justify-center relative bg-gray-950 rounded-2xl overflow-hidden min-h-[400px]">
                          <SpeakerLayout />
                          <CallControls onLeave={endCall} />
                        </div>
                      </div>
                    </StreamCall>
                  )}

                </div>
              )}

            </div>
          ) : (
            /* Empty state workspace */
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-paper border border-border flex items-center justify-center text-text-secondary">
                <ChatCircle weight="light" className="w-9 h-9 text-text-secondary" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-bold text-sm text-text-primary">Chat & Call Workspace</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Select a friend or a group chat from the left sidebar panel to initialize the chat instance and launch audio/video calls.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Create Group Modal */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-text-primary">Create Group Chat</h3>
              <button
                onClick={() => {
                  setIsCreateGroupModalOpen(false);
                  setNewGroupName("");
                  setSelectedGroupMembers([]);
                }}
                className="p-1 hover:bg-paper rounded-lg transition-colors border border-border cursor-pointer"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Group Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. 92-Day DSA Study Group"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border focus:outline-none focus:ring-2 focus:ring-focus/20 text-xs font-medium"
                />
              </div>

              {/* Members Selection List */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                  Select Members ({selectedGroupMembers.length} selected)
                </label>
                <div className="border border-border rounded-xl p-3 bg-paper max-h-48 overflow-y-auto space-y-2">
                  {friends.map((friend) => {
                    const isChecked = selectedGroupMembers.includes(friend.id);
                    return (
                      <label
                        key={friend.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-border/40 hover:bg-surface transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={friend.avatarUrl} alt="" className="w-7 h-7 rounded-full bg-white" />
                          <div className="text-left">
                            <p className="text-xs font-bold text-text-primary">{friend.name}</p>
                            <p className="text-[9px] text-text-secondary truncate max-w-[160px]">{friend.email}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleMemberSelection(friend.id)}
                          className="w-4 h-4 accent-focus cursor-pointer"
                        />
                      </label>
                    );
                  })}
                  {friends.length === 0 && (
                    <p className="text-center text-[10px] text-text-secondary py-6">
                      You need to have friends to create a group chat.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => {
                  setIsCreateGroupModalOpen(false);
                  setNewGroupName("");
                  setSelectedGroupMembers([]);
                }}
                className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-text-secondary hover:bg-paper transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                disabled={!newGroupName.trim() || selectedGroupMembers.length === 0}
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-focus text-white rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
