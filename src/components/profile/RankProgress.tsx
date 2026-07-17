import { rankProgress, RANKS } from "@/lib/ranks";

export function RankProgress({ points }: { points: number }) {
  const { rank, progress, toNext } = rankProgress(points);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/40">
            Current Rank
          </p>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: rank.color }}
          >
            {rank.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-gold-gradient">
            {points}
          </p>
          <p className="text-xs uppercase tracking-widest text-foreground/40">
            points
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-2.5 overflow-hidden rounded-full bg-noir-700">
          <div
            className="h-full rounded-full bg-gold-gradient transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-foreground/45">
          {rank.next === null
            ? "You have reached the highest rank. Legendary."
            : `${toNext} points to the next rank`}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {RANKS.map((r) => (
          <span
            key={r.name}
            className="rounded px-2 py-0.5 text-[10px] font-medium"
            style={{
              color: points >= r.min ? r.color : "#555",
              backgroundColor: points >= r.min ? `${r.color}15` : "transparent",
              border: `1px solid ${points >= r.min ? `${r.color}40` : "#ffffff10"}`,
            }}
          >
            {r.name}
          </span>
        ))}
      </div>
    </div>
  );
}
