export interface Problem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  done: boolean;
}

export interface Day {
  id: number;
  pattern: string;
  topic: string;
  youtubeId: string;
  problems: Problem[];
  done: boolean;
  notes: string;
  lastEdited?: string;
}

const PATTERNS = [
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Linked List",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Backtracking",
  "Greedy",
  "Tries"
];

const TOPICS: Record<string, string[]> = {
  "Two Pointers": ["Valid Palindrome", "3Sum", "Container With Most Water", "Trapping Rain Water", "Remove Duplicates"],
  "Sliding Window": ["Longest Substring Without Repeating Characters", "Minimum Window Substring", "Sliding Window Maximum", "Permutation in String"],
  "Binary Search": ["Search in Rotated Sorted Array", "Find Minimum in Rotated Sorted Array", "Median of Two Sorted Arrays", "Koko Eating Bananas"],
  "Linked List": ["Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle", "Reorder List", "Remove Nth Node From End"],
  "Trees": ["Invert Binary Tree", "Maximum Depth of Binary Tree", "Binary Tree Maximum Path Sum", "Serialize and Deserialize Binary Tree"],
  "Graphs": ["Number of Islands", "Clone Graph", "Course Schedule", "Pacific Atlantic Water Flow"],
  "Dynamic Programming": ["Climbing Stairs", "Coin Change", "Longest Common Subsequence", "Edit Distance", "House Robber"],
  "Backtracking": ["Subsets", "Combination Sum", "Permutations", "Word Search", "N-Queens"],
  "Greedy": ["Jump Game", "Gas Station", "Hand of Straights", "Merge Intervals"],
  "Tries": ["Implement Trie", "Design Add and Search Words Data Structure", "Word Search II"]
};

function generateProblems(pattern: string, dayId: number): Problem[] {
  const topics = TOPICS[pattern] || ["Generic Problem"];
  return Array.from({ length: 2 + (dayId % 2) }).map((_, idx) => {
    const name = `${topics[(idx + dayId) % topics.length]} ${idx + 1}`;
    const diffs: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];
    const difficulty = diffs[(idx + dayId) % 3];
    return {
      name,
      difficulty,
      leetcodeUrl: `https://leetcode.com/problems/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`,
      done: dayId < 12 || (dayId === 12 && idx === 0)
    };
  });
}

export const MOCK_DAYS: Day[] = Array.from({ length: 92 }).map((_, idx) => {
  const id = idx + 1;
  const pattern = id % 7 === 0 ? "Review Day" : PATTERNS[idx % PATTERNS.length];
  const topic = pattern === "Review Day" 
    ? "Review previous concepts and resolve hard questions" 
    : `${pattern} Deep Dive - Part ${(idx % 3) + 1}`;
  
  const problems = pattern === "Review Day" ? [] : generateProblems(pattern, id);
  const done = id < 12;
  const notes = id === 1 ? "Focused on left/right pointers. Remember to check boundaries." : 
                id === 5 ? "Autosaved notes: Sliding window needs dynamic size updates." : "";
  const lastEdited = notes ? `${id} days ago` : undefined;

  return {
    id,
    pattern,
    topic,
    youtubeId: pattern === "Review Day" ? "" : "dQw4w9WgXcQ", // Rick Roll dummy video
    problems,
    done,
    notes,
    lastEdited
  };
});
