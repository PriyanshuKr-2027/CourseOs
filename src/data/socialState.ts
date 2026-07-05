export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Friendship {
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted";
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: "prince_kumot",
    name: "Prince Kumot",
    email: "princekumot1307@gmail.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=prince"
  },
  {
    id: "alice_smith",
    name: "Alice Smith",
    email: "alice@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=alice"
  },
  {
    id: "bob_jones",
    name: "Bob Jones",
    email: "bob@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=bob"
  },
  {
    id: "charlie_brown",
    name: "Charlie Brown",
    email: "charlie@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=charlie"
  }
];

const FRIENDSHIPS_KEY = "dsa_social_friendships";
const CURRENT_USER_KEY = "dsa_social_current_user";

// Helper to check if we are running in browser
const isBrowser = () => typeof window !== "undefined";

export function getFriendships(): Friendship[] {
  if (!isBrowser()) return [];
  const saved = localStorage.getItem(FRIENDSHIPS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  // Seed initial friendship: Prince and Bob are friends, Alice has a pending request from Prince
  const initial: Friendship[] = [
    { senderId: "prince_kumot", receiverId: "bob_jones", status: "accepted" },
    { senderId: "prince_kumot", receiverId: "alice_smith", status: "pending" }
  ];
  localStorage.setItem(FRIENDSHIPS_KEY, JSON.stringify(initial));
  return initial;
}

export function saveFriendships(fs: Friendship[]) {
  if (!isBrowser()) return;
  localStorage.setItem(FRIENDSHIPS_KEY, JSON.stringify(fs));
}

export function getCurrentUser(): UserProfile {
  if (!isBrowser()) return MOCK_USERS[0];
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  if (saved) {
    const found = MOCK_USERS.find((u) => u.id === saved);
    if (found) return found;
  }
  localStorage.setItem(CURRENT_USER_KEY, MOCK_USERS[0].id);
  return MOCK_USERS[0];
}

export function setCurrentUser(userId: string) {
  if (!isBrowser()) return;
  localStorage.setItem(CURRENT_USER_KEY, userId);
  // Dispatch custom event to notify components of user change
  window.dispatchEvent(new Event("socialCurrentUserChange"));
}

export function sendFriendRequest(senderId: string, receiverId: string) {
  const fs = getFriendships();
  // Check if exists
  const exists = fs.some(
    (f) =>
      (f.senderId === senderId && f.receiverId === receiverId) ||
      (f.senderId === receiverId && f.receiverId === senderId)
  );
  if (!exists) {
    fs.push({ senderId, receiverId, status: "pending" });
    saveFriendships(fs);
  }
}

export function acceptFriendRequest(senderId: string, receiverId: string) {
  const fs = getFriendships();
  const index = fs.findIndex(
    (f) => f.senderId === senderId && f.receiverId === receiverId && f.status === "pending"
  );
  if (index !== -1) {
    fs[index].status = "accepted";
    saveFriendships(fs);
  }
}

export function declineFriendRequest(senderId: string, receiverId: string) {
  const fs = getFriendships();
  const updated = fs.filter(
    (f) => !(f.senderId === senderId && f.receiverId === receiverId && f.status === "pending")
  );
  saveFriendships(updated);
}

export function removeFriendship(user1Id: string, user2Id: string) {
  const fs = getFriendships();
  const updated = fs.filter(
    (f) =>
      !(
        (f.senderId === user1Id && f.receiverId === user2Id) ||
        (f.senderId === user2Id && f.receiverId === user1Id)
      )
  );
  saveFriendships(updated);
}

export function getFriends(userId: string): UserProfile[] {
  const fs = getFriendships();
  const friendIds = fs
    .filter((f) => f.status === "accepted")
    .map((f) => (f.senderId === userId ? f.receiverId : f.senderId === userId ? null : f.senderId === f.receiverId ? null : f.senderId === userId ? null : f.senderId === userId ? null : f.senderId === userId ? null : null)) // Wait, simple filter:
    .filter(Boolean) as string[];

  // Let's rewrite simple mapping
  const ids: string[] = [];
  fs.forEach((f) => {
    if (f.status === "accepted") {
      if (f.senderId === userId) ids.push(f.receiverId);
      if (f.receiverId === userId) ids.push(f.senderId);
    }
  });
  return MOCK_USERS.filter((u) => ids.includes(u.id));
}

export function getIncomingRequests(userId: string): UserProfile[] {
  const fs = getFriendships();
  const senderIds = fs
    .filter((f) => f.receiverId === userId && f.status === "pending")
    .map((f) => f.senderId);
  return MOCK_USERS.filter((u) => senderIds.includes(u.id));
}

export function getSentRequests(userId: string): UserProfile[] {
  const fs = getFriendships();
  const receiverIds = fs
    .filter((f) => f.senderId === userId && f.status === "pending")
    .map((f) => f.receiverId);
  return MOCK_USERS.filter((u) => receiverIds.includes(u.id));
}
