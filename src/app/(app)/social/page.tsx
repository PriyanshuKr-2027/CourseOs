"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  MOCK_USERS,
  UserProfile,
  Friendship,
  getFriendships,
  getCurrentUser,
  setCurrentUser,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  getIncomingRequests,
  getSentRequests,
  removeFriendship
} from "@/data/socialState";
import {
  Users,
  PaperPlaneRight,
  VideoCamera,
  X,
  UserPlus,
  UserMinus,
  Check,
  ChatCircle,
  MagnifyingGlass,
  Sparkle,
  Microphone,
  MicrophoneSlash,
  Camera,
  CameraSlash,
  PhoneDisconnect,
  UserCheck
} from "@phosphor-icons/react";

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
  SpeakerLayout
} from "@stream-io/video-react-sdk";

// Import styles (these will be loaded in Next.js)
import "stream-chat-react/dist/css/index.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = "mnmv54o3xeo4";

export default function SocialPage() {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [activeFriend, setActiveFriend] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "find">("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [friendships, setFriendships] = useState<Friendship[]>([]);

  // Stream Client states
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const [streamChannel, setStreamChannel] = useState<any>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  
  // Call States
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [isCalling, setIsCalling] = useState(false);


  // Trigger state refresh
  const refreshState = () => {
    setActiveUser(getCurrentUser());
    setFriendships(getFriendships());
  };

  // Setup initial values
  useEffect(() => {
    refreshState();
    
    // Listen to profile switching events
    const handleUserChange = () => {
      refreshState();
      setActiveFriend(null);
    };
    window.addEventListener("socialCurrentUserChange", handleUserChange);
    return () => window.removeEventListener("socialCurrentUserChange", handleUserChange);
  }, []);

  // Initialize GetStream clients when activeUser changes
  useEffect(() => {
    if (!activeUser) return;

    let isSubscribed = true;
    setStreamConnected(false);
    setStreamError(null);

    const initStream = async () => {
      try {
        const chatInstance = StreamChat.getInstance(STREAM_API_KEY);
        
        // Generate development token client-side
        const token = chatInstance.devToken(activeUser.id);
        
        // Connect Chat user
        await chatInstance.connectUser(
          {
            id: activeUser.id,
            name: activeUser.name,
            image: activeUser.avatarUrl
          },
          token
        );

        // Connect Video user
        const videoInstance = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: activeUser.id,
            name: activeUser.name,
            image: activeUser.avatarUrl
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
      // Cleanup Stream connections
      const cleanup = async () => {
        if (chatClient) {
          try {
            await chatClient.disconnectUser();
          } catch (e) {
            console.error(e);
          }
        }
      };
      cleanup();
    };
  }, [activeUser?.id]);

  // Handle active channel selection
  useEffect(() => {
    if (!chatClient || !activeUser || !activeFriend || !streamConnected) {
      setStreamChannel(null);
      return;
    }

    const initChannel = async () => {
      try {
        // Create 1-on-1 channel with admin as a member for auditing
        const channel = chatClient.channel("messaging", {
          members: [activeUser.id, activeFriend.id, "admin"],
          name: activeFriend.name
        } as any);
        await channel.watch();
        setStreamChannel(channel);
      } catch (e) {
        console.error("Failed to initialize channel:", e);
      }
    };

    initChannel();
  }, [chatClient, activeUser?.id, activeFriend?.id, streamConnected]);



  // Derived lists
  const friends = useMemo(() => {
    if (!activeUser) return [];
    return getFriends(activeUser.id);
  }, [activeUser, friendships]);

  const incomingRequests = useMemo(() => {
    if (!activeUser) return [];
    return getIncomingRequests(activeUser.id);
  }, [activeUser, friendships]);

  const sentRequests = useMemo(() => {
    if (!activeUser) return [];
    return getSentRequests(activeUser.id);
  }, [activeUser, friendships]);

  // Users available to add
  const searchableUsers = useMemo(() => {
    if (!activeUser) return [];
    // Exclude current user
    let pool = MOCK_USERS.filter((u) => u.id !== activeUser.id);
    
    // Apply search filter
    if (searchQuery.trim()) {
      pool = pool.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return pool;
  }, [activeUser, searchQuery]);

  // Active friend requests handlers
  const handleAddFriend = (receiverId: string) => {
    if (!activeUser) return;
    sendFriendRequest(activeUser.id, receiverId);
    refreshState();
  };

  const handleAcceptRequest = (senderId: string) => {
    if (!activeUser) return;
    acceptFriendRequest(senderId, activeUser.id);
    refreshState();
  };

  const handleDeclineRequest = (senderId: string) => {
    if (!activeUser) return;
    declineFriendRequest(senderId, activeUser.id);
    refreshState();
  };

  const handleUnfriend = (friendId: string) => {
    if (!activeUser) return;
    removeFriendship(activeUser.id, friendId);
    if (activeFriend?.id === friendId) {
      setActiveFriend(null);
    }
    refreshState();
  };



  // Video Call Handlers
  const startCall = async () => {
    if (!videoClient || !activeUser || !activeFriend) return;
    setIsCalling(true);
    try {
      const callId = [activeUser.id, activeFriend.id].sort().join("-");
      const callInstance = videoClient.call("default", callId);
      
      await callInstance.getOrCreate({
        data: {
          members: [
            { user_id: activeUser.id, role: "user" },
            { user_id: activeFriend.id, role: "user" }
          ]
        }
      });
      
      await callInstance.join();
      setActiveCall(callInstance);
    } catch (e) {
      console.error("Failed to start Stream call:", e);
    }
  };

  const endCall = async () => {
    if (activeCall) {
      await activeCall.leave();
    }
    setActiveCall(null);
    setIsCalling(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 relative h-[calc(100vh-8rem)]">
      {/* Top Banner & Switcher */}
      <section className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2 text-text-primary">
            <Users weight="fill" className="text-focus" /> Social Workspace
          </h1>
          <p className="text-xs text-text-secondary">
            Send requests, chat, and call other users working on the 92-Day plan.
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Viewing As:</span>
          <select
            value={activeUser?.id || ""}
            onChange={(e) => {
              setCurrentUser(e.target.value);
              setActiveFriend(null);
            }}
            className="px-3 py-1.5 bg-paper border border-border rounded-xl text-xs font-bold text-[#1B1917] focus:outline-none focus:ring-2 focus:ring-focus/20"
          >
            {MOCK_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
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
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "friends"
                  ? "bg-white text-text-primary shadow-sm border border-border/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-2 text-xs font-bold rounded-lg transition-all relative ${
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
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
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
            
            {/* SEARCH FOR USERS in "find" or "friends" */}
            {activeTab !== "requests" && (
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
              <div className="space-y-2.5">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-paper/40 transition-all cursor-pointer ${
                      activeFriend?.id === friend.id ? "bg-focus/5 border-focus/30" : ""
                    }`}
                    onClick={() => setActiveFriend(friend)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={friend.avatarUrl} alt="" className="w-9 h-9 rounded-full bg-gray-100 p-0.5 border border-border" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-text-primary">{friend.name}</p>
                        <p className="text-[10px] text-text-secondary font-mono truncate max-w-[140px]">{friend.email}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfriend(friend.id);
                      }}
                      className="p-1 hover:bg-alert/10 text-text-secondary hover:text-alert rounded transition-colors"
                      title="Unfriend"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {friends.length === 0 && (
                  <p className="text-center text-xs text-text-secondary py-10">No friends added yet. Send requests in &quot;Find Users&quot;.</p>
                )}
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
                          className="p-1.5 bg-signal hover:opacity-90 rounded-lg text-white text-xs font-semibold flex items-center justify-center"
                          title="Accept"
                        >
                          <Check className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(sender.id)}
                          className="p-1.5 bg-alert hover:opacity-90 rounded-lg text-white text-xs font-semibold flex items-center justify-center"
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
                {searchableUsers.map((user) => {
                  // Check status
                  const isFriend = friends.some((f) => f.id === user.id);
                  const isIncoming = incomingRequests.some((r) => r.id === user.id);
                  const isSent = sentRequests.some((s) => s.id === user.id);

                  return (
                    <div key={user.id} className="flex items-center justify-between p-2.5 border border-border rounded-xl hover:bg-paper/30 transition-all">
                      <div className="flex items-center gap-2.5">
                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-gray-50" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-text-primary">{user.name}</p>
                          <p className="text-[9px] font-mono text-text-secondary truncate max-w-[120px]">{user.email}</p>
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
                          onClick={() => handleAcceptRequest(user.id)}
                          className="px-2.5 py-1 bg-focus text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Accept Request
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFriend(user.id)}
                          className="p-1.5 bg-paper hover:bg-border border border-border rounded-lg text-text-secondary hover:text-focus transition-all flex items-center justify-center"
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
          
          {activeFriend ? (
            <div className="flex flex-col h-full relative">
              
              {/* Workspace Header */}
              <div className="p-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeFriend.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-white p-0.5 border border-border" />
                  <div className="text-left">
                    <h3 className="font-bold text-sm text-text-primary">{activeFriend.name}</h3>
                    <p className="text-[10px] text-text-secondary font-mono">{activeFriend.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={startCall}
                    className="p-2 border border-border hover:bg-paper rounded-xl text-text-secondary hover:text-focus transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold bg-white"
                  >
                    <VideoCamera weight="fill" className="w-5 h-5 text-focus" /> Start Call
                  </button>
                  <button
                    onClick={() => setActiveFriend(null)}
                    className="p-2 border border-border hover:bg-paper rounded-xl text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center bg-white"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Chat Message Workspace */}
              <div className="flex-1 flex flex-col bg-paper/20">
                {streamConnected && chatClient && streamChannel ? (
                  /* GetStream SDK Chat Workspace */
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
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-8 h-8 border-4 border-focus border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-text-secondary">Connecting to live chat server...</p>
                  </div>
                )}
              </div>

              {/* Call Overlay overlay */}
              {isCalling && (
                <div className="absolute inset-0 bg-[#0d0f14] z-40 flex flex-col text-white animate-in fade-in duration-300">
                  
                  {videoClient && activeCall ? (
                    /* Real Stream Call Content */
                    <StreamVideo client={videoClient}>
                      <StreamCall call={activeCall}>
                        <div className="flex-1 flex flex-col justify-between p-4 h-full">
                          <h4 className="text-center text-sm font-bold mt-2">Active Call: {activeFriend.name}</h4>
                          <div className="flex-grow flex flex-col items-center justify-center relative bg-gray-950 rounded-2xl overflow-hidden min-h-[400px]">
                            <SpeakerLayout />
                            <CallControls onLeave={endCall} />
                          </div>
                        </div>
                      </StreamCall>
                    </StreamVideo>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-gray-400">Connecting to live call channel...</p>
                    </div>
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
                  Select a friend from the left sidebar panel to initialize the chat instance and launch audio/video calls.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
