import { Star } from "lucide-react";
import { DIFFICULTY, type Difficulty, getRank } from "@/lib/ranks";
import { cn } from "@/lib/utils";

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: string;
  className?: string;
}) {
  const d = DIFFICULTY[(difficulty as Difficulty) in DIFFICULTY ? (difficulty as Difficulty) : "MEDIUM"];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        className,
      )}
      style={{
        color: d.color,
        borderColor: `${d.color}55`,
        backgroundColor: `${d.color}12`,
      }}
    >
      <span className="flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3"
            fill={i < d.stars ? d.color : "transparent"}
            stroke={i < d.stars ? d.color : "#555"}
          />
        ))}
      </span>
      {d.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    OPEN: { label: "Open", color: "#6ee7b7" },
    CLOSED: { label: "Closed", color: "#f87171" },
    PENDING: { label: "Pending Review", color: "#e6c65e" },
    CORRECT: { label: "Solved", color: "#6ee7b7" },
    INCORRECT: { label: "Incorrect", color: "#f87171" },
    REVIEWED: { label: "Reviewed", color: "#8b9dc3" },
  };
  const s = map[status] ?? { label: status, color: "#9ca3af" };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
      style={{
        color: s.color,
        borderColor: `${s.color}55`,
        backgroundColor: `${s.color}12`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: s.color }}
      />
      {s.label}
    </span>
  );
}

export function RankPill({ points }: { points: number }) {
  const rank = getRank(points);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        color: rank.color,
        borderColor: `${rank.color}55`,
        backgroundColor: `${rank.color}12`,
      }}
    >
      {rank.name}
    </span>
  );
}
