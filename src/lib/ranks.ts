export type Rank = {
  name: string;
  min: number;
  next: number | null;
  color: string;
};

export const RANKS: Rank[] = [
  { name: "Rookie", min: 0, next: 150, color: "#9ca3af" },
  { name: "Investigator", min: 150, next: 400, color: "#8b9dc3" },
  { name: "Detective", min: 400, next: 800, color: "#6ec1e4" },
  { name: "Senior Detective", min: 800, next: 1500, color: "#c084fc" },
  { name: "Inspector", min: 1500, next: 2600, color: "#e6c65e" },
  { name: "Chief Inspector", min: 2600, next: 4200, color: "#d4af37" },
  { name: "Master Sleuth", min: 4200, next: null, color: "#f6edc8" },
];

export function getRank(points: number): Rank {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (points >= r.min) current = r;
  }
  return current;
}

export function rankProgress(points: number) {
  const rank = getRank(points);
  if (rank.next === null) {
    return { rank, progress: 100, toNext: 0, pointsInto: points - rank.min };
  }
  const span = rank.next - rank.min;
  const into = points - rank.min;
  return {
    rank,
    progress: Math.min(100, Math.round((into / span) * 100)),
    toNext: rank.next - points,
    pointsInto: into,
  };
}

export const DIFFICULTY = {
  EASY: { label: "Easy", color: "#6ee7b7", stars: 1 },
  MEDIUM: { label: "Medium", color: "#e6c65e", stars: 2 },
  HARD: { label: "Hard", color: "#fb923c", stars: 3 },
  EXPERT: { label: "Expert", color: "#f87171", stars: 4 },
} as const;

export type Difficulty = keyof typeof DIFFICULTY;
