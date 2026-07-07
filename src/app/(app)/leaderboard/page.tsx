"use client";

import { useEffect, useState, useMemo } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { 
  Trophy, 
  Fire, 
  TrendUp, 
  Medal, 
  Users, 
  CheckCircle,
  Crown,
  Sparkle
} from "@phosphor-icons/react";
import { getDifficultyStyle } from "@/lib/badgeStyle";
import Link from "next/link";

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  streak: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
  avatarUrl: string;
  isCurrentUser: boolean;
}

interface ActivityItem {
  id: string;
  userName: string;
  userAvatar: string;
  problemName: string;
  difficulty: string;
  points: number;
  solvedAt: string; // Time ago string or date
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const { 
    supabase, 
    user, 
    profile, 
    days, 
    planProgress, 
    loading: providerLoading, 
    isMockMode 
  } = useSupabase();

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"all" | "weekly">("all");

  // Determine current user's profile name
  const currentUserName = profile?.name || user?.email?.split("@")[0] || "You";
  const currentUserEmail = profile?.email || user?.email || "";

  useEffect(() => {
    async function loadLeaderboardData() {
      if (providerLoading) return;
      setLoading(true);

      try {
        if (isMockMode || !supabase || !user) {
          // --- MOCK MODE DATA GENERATION ---
          // Calculate current user's stats from provider's live state
          let userEasy = 0;
          let userMedium = 0;
          let userHard = 0;

          days.forEach((day) => {
            day.problems.forEach((prob, idx) => {
              if (planProgress[`${day.id}_${idx}`]) {
                const diff = (prob.difficulty || "").toLowerCase();
                if (diff === "easy") userEasy++;
                else if (diff === "medium") userMedium++;
                else if (diff === "hard") userHard++;
              }
            });
          });

          const userPoints = userEasy * 10 + userMedium * 20 + userHard * 30;

          const currentUserObj: LeaderboardUser = {
            id: user?.id || "current_user",
            name: `${currentUserName} (You)`,
            email: currentUserEmail,
            streak: profile?.current_streak || 0,
            easySolved: userEasy,
            mediumSolved: userMedium,
            hardSolved: userHard,
            totalPoints: userPoints,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUserEmail || "you")}`,
            isCurrentUser: true,
          };

          // Generate mock friend data
          const mockFriends: LeaderboardUser[] = [
            {
              id: "friend_1",
              name: "Prince Kumot",
              email: "princekumot1307@gmail.com",
              streak: 12,
              easySolved: 28,
              mediumSolved: 18,
              hardSolved: 8,
              totalPoints: 28 * 10 + 18 * 20 + 8 * 30, // 280 + 360 + 240 = 880
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=prince",
              isCurrentUser: false,
            },
            {
              id: "friend_2",
              name: "Alice Smith",
              email: "alice@example.com",
              streak: 5,
              easySolved: 15,
              mediumSolved: 10,
              hardSolved: 3,
              totalPoints: 15 * 10 + 10 * 20 + 3 * 30, // 150 + 200 + 90 = 440
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=alice",
              isCurrentUser: false,
            },
            {
              id: "friend_3",
              name: "Bob Jones",
              email: "bob@example.com",
              streak: 8,
              easySolved: 22,
              mediumSolved: 12,
              hardSolved: 5,
              totalPoints: 22 * 10 + 12 * 20 + 5 * 30, // 220 + 240 + 150 = 610
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=bob",
              isCurrentUser: false,
            },
            {
              id: "friend_4",
              name: "Charlie Brown",
              email: "charlie@example.com",
              streak: 1,
              easySolved: 8,
              mediumSolved: 4,
              hardSolved: 1,
              totalPoints: 8 * 10 + 4 * 20 + 1 * 30, // 80 + 80 + 30 = 190
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=charlie",
              isCurrentUser: false,
            },
            {
              id: "friend_5",
              name: "Sarah Miller",
              email: "sarah@example.com",
              streak: 18,
              easySolved: 32,
              mediumSolved: 24,
              hardSolved: 12,
              totalPoints: 32 * 10 + 24 * 20 + 12 * 30, // 320 + 480 + 360 = 1160
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=sarah",
              isCurrentUser: false,
            }
          ];

          const combined = [currentUserObj, ...mockFriends].sort((a, b) => b.totalPoints - a.totalPoints);
          setLeaderboard(combined);

          // Generate mock recent activities
          const mockActivities: ActivityItem[] = [
            {
              id: "act_1",
              userName: "Sarah Miller",
              userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sarah",
              problemName: "Merge k Sorted Lists",
              difficulty: "Hard",
              points: 30,
              solvedAt: "10 mins ago",
              isCurrentUser: false,
            },
            {
              id: "act_2",
              userName: "Prince Kumot",
              userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=prince",
              problemName: "Longest Palindromic Substring",
              difficulty: "Medium",
              points: 20,
              solvedAt: "1 hour ago",
              isCurrentUser: false,
            },
            {
              id: "act_3",
              userName: "Alice Smith",
              userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=alice",
              problemName: "Two Sum",
              difficulty: "Easy",
              points: 10,
              solvedAt: "3 hours ago",
              isCurrentUser: false,
            },
            {
              id: "act_4",
              userName: "Bob Jones",
              userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bob",
              problemName: "Binary Tree Maximum Path Sum",
              difficulty: "Hard",
              points: 30,
              solvedAt: "5 hours ago",
              isCurrentUser: false,
            },
            {
              id: "act_5",
              userName: currentUserName,
              userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUserEmail || "you")}`,
              problemName: "Reverse Linked List",
              difficulty: "Easy",
              points: 10,
              solvedAt: "Yesterday",
              isCurrentUser: true,
            }
          ];
          setActivities(mockActivities);
        } else {
          // --- REAL SUPABASE MODE ---
          // 1. Fetch user friendships
          const { data: friendshipsData, error: friendshipsError } = await supabase
            .from("friendships")
            .select("sender_id, receiver_id")
            .eq("status", "accepted")
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

          if (friendshipsError) throw friendshipsError;

          const friendIds = (friendshipsData || []).map((f) => 
            f.sender_id === user.id ? f.receiver_id : f.sender_id
          );

          const allUserIds = [user.id, ...friendIds];

          // 2. Fetch profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, name, email, current_streak, last_active_date")
            .in("id", allUserIds);

          if (profilesError) throw profilesError;

          // 3. Fetch progress for all users (joins with problems to get difficulty)
          const { data: progressData, error: progressError } = await supabase
            .from("progress")
            .select(`
              user_id,
              solved_at,
              problems (
                id,
                name,
                difficulty
              )
            `)
            .in("user_id", allUserIds);

          if (progressError) throw progressError;

          // Create map of problems completed per user
          const statsMap: Record<string, { easy: number; medium: number; hard: number; points: number }> = {};
          
          allUserIds.forEach((uid) => {
            statsMap[uid] = { easy: 0, medium: 0, hard: 0, points: 0 };
          });

          if (progressData) {
            // Process and sum points
            progressData.forEach((item: any) => {
              const uid = item.user_id;
              const prob = item.problems;
              if (!prob) return;

              const diff = (prob.difficulty || "").toLowerCase();
              let points = 0;
              if (diff === "easy") {
                statsMap[uid].easy++;
                points = 10;
              } else if (diff === "medium") {
                statsMap[uid].medium++;
                points = 20;
              } else if (diff === "hard") {
                statsMap[uid].hard++;
                points = 30;
              }

              statsMap[uid].points += points;
            });
          }

          // Sort activities by solved date
          const sortedRawProgress = [...(progressData || [])].sort((a, b) => 
            new Date(b.solved_at).getTime() - new Date(a.solved_at).getTime()
          );

          const sortedActivities = sortedRawProgress.map((item: any) => {
            const uid = item.user_id;
            const prob = item.problems;
            const diff = (prob?.difficulty || "Easy").toLowerCase();
            const points = diff === "easy" ? 10 : diff === "medium" ? 20 : 30;
            const userProfile = profilesData?.find((p) => p.id === uid);
            const uName = userProfile?.name || userProfile?.email?.split("@")[0] || "User";

            // Format time ago
            const date = new Date(item.solved_at);
            const diffMs = new Date().getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            
            let timeLabel = "";
            if (diffMins < 1) timeLabel = "Just now";
            else if (diffMins < 60) timeLabel = `${diffMins}m ago`;
            else if (diffHours < 24) timeLabel = `${diffHours}h ago`;
            else timeLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            return {
              id: item.solved_at + uid,
              userName: uid === user.id ? `${uName} (You)` : uName,
              userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userProfile?.email || uid)}`,
              problemName: prob?.name || "DSA Problem",
              difficulty: prob?.difficulty || "Easy",
              points,
              solvedAt: timeLabel,
              isCurrentUser: uid === user.id,
            };
          }).slice(0, 15);

          setActivities(sortedActivities);

          // Map user statistics to final objects
          const formattedUsers: LeaderboardUser[] = (profilesData || []).map((p) => {
            const stats = statsMap[p.id] || { easy: 0, medium: 0, hard: 0, points: 0 };
            return {
              id: p.id,
              name: p.id === user.id ? `${p.name || p.email.split("@")[0]} (You)` : (p.name || p.email.split("@")[0]),
              email: p.email,
              streak: p.current_streak || 0,
              easySolved: stats.easy,
              mediumSolved: stats.medium,
              hardSolved: stats.hard,
              totalPoints: stats.points,
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(p.email)}`,
              isCurrentUser: p.id === user.id,
            };
          });

          // Sort leaderboard by points descending
          formattedUsers.sort((a, b) => b.totalPoints - a.totalPoints);
          setLeaderboard(formattedUsers);
        }
      } catch (err) {
        console.error("Error generating leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboardData();
  }, [providerLoading, user, profile, days, planProgress, isMockMode, supabase, currentUserName, currentUserEmail]);

  // Derived Top 3 podium list and rest lists
  const podiumUsers = useMemo(() => {
    const top3 = leaderboard.slice(0, 3);
    const order = [];
    if (top3[1]) order.push(top3[1]); // 2nd on Left
    if (top3[0]) order.push(top3[0]); // 1st in Center
    if (top3[2]) order.push(top3[2]); // 3rd on Right
    return { displayOrder: order, originalOrder: top3 };
  }, [leaderboard]);

  const restUsers = useMemo(() => {
    return leaderboard.slice(3);
  }, [leaderboard]);

  // Highlight current user's general standing details
  const currentUserRankInfo = useMemo(() => {
    const idx = leaderboard.findIndex((u) => u.isCurrentUser);
    if (idx === -1) return null;
    return {
      rank: idx + 1,
      stats: leaderboard[idx],
    };
  }, [leaderboard]);

  if (providerLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-focus border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary text-sm font-medium">Calculating leaderboard scores...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header section with Stats Cards */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Leaderboard <Trophy weight="fill" className="text-warning w-8 h-8" />
          </h1>
          <p className="text-[#6B655B] text-sm">
            Compete with friends! Earn points: <span className="font-semibold text-[#1B1917]">Easy (10 pts)</span>, <span className="font-semibold text-[#1B1917]">Medium (20 pts)</span>, and <span className="font-semibold text-[#1B1917]">Hard (30 pts)</span>.
          </p>
        </div>

        {/* Toggle Weekly vs All-Time */}
        <div className="flex items-center bg-sidebar rounded-full p-1 border border-border self-start">
          <button 
            onClick={() => setTimeframe("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              timeframe === "all" ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            All-Time
          </button>
          <button 
            onClick={() => setTimeframe("weekly")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              timeframe === "weekly" ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            This Week
          </button>
        </div>
      </section>

      {/* Overview Stats for Current User */}
      {currentUserRankInfo && (
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#FAF7F0] border border-border p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
              <Crown weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Your Rank</p>
              <p className="text-xl font-bold font-mono">#{currentUserRankInfo.rank}</p>
            </div>
          </div>

          <div className="bg-[#FAF7F0] border border-border p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-focus/10 flex items-center justify-center text-focus">
              <Sparkle weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Total Points</p>
              <p className="text-xl font-bold font-mono">{currentUserRankInfo.stats.totalPoints} pts</p>
            </div>
          </div>

          <div className="bg-[#FAF7F0] border border-border p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Fire weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Current Streak</p>
              <p className="text-xl font-bold font-mono">{currentUserRankInfo.stats.streak} Days</p>
            </div>
          </div>

          <div className="bg-[#FAF7F0] border border-border p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-signal/10 flex items-center justify-center text-signal">
              <CheckCircle weight="fill" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Solved (E/M/H)</p>
              <p className="text-sm font-semibold font-mono">
                {currentUserRankInfo.stats.easySolved} / {currentUserRankInfo.stats.mediumSolved} / {currentUserRankInfo.stats.hardSolved}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid: Podium & Leaderboard vs Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Center Column: Leaderboard details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Trophy Podium for Top 3 */}
          {podiumUsers.originalOrder.length > 0 && (
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-6 flex items-center gap-2">
                Top Performers <Crown className="text-warning" weight="fill" />
              </h2>
              
              <div className="flex items-end justify-center gap-4 sm:gap-8 pt-6 pb-2 min-h-[260px]">
                {podiumUsers.displayOrder.map((usr) => {
                  const rank = leaderboard.findIndex((u) => u.id === usr.id) + 1;
                  
                  // Setup styles based on rank
                  let cardHeight = "h-40"; // 2nd
                  let borderCol = "border-slate-300";
                  let bgCol = "bg-slate-50";
                  let badgeIcon = "🥈";
                  let accentColor = "text-slate-500";
                  
                  if (rank === 1) {
                    cardHeight = "h-48 sm:h-52";
                    borderCol = "border-yellow-400 shadow-md ring-2 ring-yellow-400/20";
                    bgCol = "bg-yellow-50/50";
                    badgeIcon = "🥇";
                    accentColor = "text-yellow-600";
                  } else if (rank === 3) {
                    cardHeight = "h-36";
                    borderCol = "border-amber-600/30";
                    bgCol = "bg-amber-50/30";
                    badgeIcon = "🥉";
                    accentColor = "text-amber-700";
                  }

                  return (
                    <div 
                      key={usr.id} 
                      className={`flex flex-col items-center flex-1 max-w-[150px] transition-all hover:scale-105 duration-300`}
                    >
                      {/* Avatar */}
                      <div className="relative mb-3">
                        <img 
                          src={usr.avatarUrl} 
                          alt={usr.name}
                          className={`w-12 h-12 rounded-full border-2 ${usr.isCurrentUser ? "border-focus" : "border-border"} bg-white p-1`} 
                        />
                        <span className="absolute -top-3 -right-2 text-lg filter drop-shadow font-sans">
                          {badgeIcon}
                        </span>
                      </div>

                      {/* Name & Points */}
                      <div className="text-center w-full mb-2">
                        <p className={`text-xs font-bold truncate px-1 ${usr.isCurrentUser ? "text-focus font-extrabold" : "text-text-primary"}`}>
                          {usr.name.split(" ")[0]}
                        </p>
                        <p className="text-[10px] text-text-secondary font-mono">{usr.totalPoints} pts</p>
                      </div>

                      {/* Column block representing rank height */}
                      <div className={`w-full ${cardHeight} rounded-t-xl border-t border-x ${borderCol} ${bgCol} flex flex-col justify-end p-3 text-center`}>
                        <span className={`text-3xl font-mono font-black ${accentColor}`}>
                          {rank}
                        </span>
                        <div className="mt-2 flex items-center justify-center gap-0.5 text-[10px] text-orange-500 font-bold font-mono">
                          <Fire weight="fill" className="w-3.5 h-3.5" />
                          {usr.streak}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leaderboard Table (Rank 4+) */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                Leaderboard Rankings <Users className="text-text-secondary" />
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase w-16 text-center">Rank</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase">Learner</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase text-center">Streak</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase text-center">Easy</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase text-center">Med</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase text-center">Hard</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* If we have users under rank 4 */}
                  {restUsers.map((usr, i) => {
                    const rank = i + 4;
                    return (
                      <tr 
                        key={usr.id} 
                        className={`hover:bg-gray-50/50 transition-colors ${
                          usr.isCurrentUser ? "bg-focus/5 border-l-4 border-l-focus" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-center font-mono font-bold text-text-secondary">
                          #{rank}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={usr.avatarUrl} 
                              alt="" 
                              className="w-8 h-8 rounded-full bg-gray-100 p-0.5 border border-border" 
                            />
                            <div className="flex flex-col">
                              <span className={`text-sm font-semibold ${usr.isCurrentUser ? "text-focus font-bold" : "text-text-primary"}`}>
                                {usr.name}
                              </span>
                              <span className="text-[10px] text-text-secondary font-mono">{usr.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-orange-500">
                            <Fire weight="fill" className="w-4 h-4" />
                            {usr.streak}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xs text-signal font-medium">
                          {usr.easySolved}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xs text-warning font-medium">
                          {usr.mediumSolved}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xs text-alert font-medium">
                          {usr.hardSolved}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-sm text-text-primary">
                          {usr.totalPoints} <span className="text-[10px] text-text-secondary font-normal font-sans">pts</span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Empty state when no users are in leaderboard */}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-text-secondary text-sm">
                        No competitors found. Add friends in the <Link href="/social" className="text-focus hover:underline">Social</Link> tab to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                Recent Activity <TrendUp className="text-focus" weight="bold" />
              </h2>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar flex-grow">
              {activities.map((act) => (
                <div 
                  key={act.id} 
                  className="flex gap-3 text-xs border-b border-border/50 pb-3 last:border-b-0 last:pb-0 hover:bg-gray-50/50 p-2 rounded-xl transition-all"
                >
                  <img 
                    src={act.userAvatar} 
                    alt="" 
                    className="w-8 h-8 rounded-full bg-gray-100 p-0.5 border border-border self-start shrink-0" 
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-text-primary leading-tight">
                      <span className={`font-semibold ${act.isCurrentUser ? "text-focus font-bold" : ""}`}>
                        {act.userName}
                      </span>{" "}
                      completed{" "}
                      <span className="font-mono bg-paper px-1.5 py-0.5 rounded border border-border font-medium inline-block max-w-full truncate text-[10px]">
                        {act.problemName}
                      </span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-text-secondary">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold px-1.5 py-0.5 rounded ${getDifficultyStyle(act.difficulty)}`}>
                          {act.difficulty}
                        </span>
                        <span className="font-mono text-focus font-semibold">
                          +{act.points} pts
                        </span>
                      </div>
                      <span className="font-mono shrink-0">{act.solvedAt}</span>
                    </div>
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-12 text-text-secondary space-y-2">
                  <CheckCircle className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="text-xs">No recent activity. Solve a problem to record the first event!</p>
                </div>
              )}
            </div>
          </div>

          {/* Social CTAs */}
          <div className="bg-[#FAF7F0] border border-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 font-sans">
              <TrendUp weight="bold" className="text-focus" /> Boost Your Score
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Find and add more friends to see how they match up. Solve tougher problems to earn up to 30 points per challenge and climb the podium!
            </p>
            <Link 
              href="/social"
              className="inline-flex w-full justify-center bg-focus hover:bg-focus/90 text-white py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer text-center"
            >
              Manage Friends & Chats
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
