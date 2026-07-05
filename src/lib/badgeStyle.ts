export function getPatternBadgeStyle(pattern: string): string {
  if (pattern === "Review Day" || pattern === "Rest Day") {
    return "bg-rest-bg text-rest-text border border-border";
  }
  const styles = [
    "bg-lavender-bg text-lavender-text",
    "bg-mint-bg text-mint-text",
    "bg-peach-bg text-peach-text",
    "bg-sky-bg text-sky-text",
    "bg-rose-bg text-rose-text",
    "bg-butter-bg text-butter-text",
  ];
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < pattern.length; i++) {
    hash = pattern.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % styles.length;
  return styles[index];
}

export function getDifficultyStyle(diff: string): string {
  switch (diff) {
    case "Easy":
      return "text-signal bg-signal/10 border border-signal/20";
    case "Medium":
      return "text-warning bg-warning/10 border border-warning/20";
    case "Hard":
      return "text-alert bg-alert/10 border border-alert/20";
    default:
      return "text-text-secondary bg-paper border border-border/50";
  }
}
