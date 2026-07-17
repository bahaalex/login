import Link from "next/link";
import { Crown, Medal, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { RankPill } from "@/components/ui/Badges";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const [me, users] = await Promise.all([
    getCurrentUser(),
    prisma.user.findMany({
      orderBy: [{ points: "desc" }, { createdAt: "asc" }],
      take: 100,
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        points: true,
        location: true,
        submissions: { where: { status: "CORRECT" }, select: { id: true } },
      },
    }),
  ]);

  const board = users.map((u, i) => ({
    ...u,
    rank: i + 1,
    solved: u.submissions.length,
  }));
  const top3 = board.slice(0, 3);
  const rest = board.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumStyle = [
    { h: "h-28", color: "#b8c0cc", icon: Medal },
    { h: "h-36", color: "#d4af37", icon: Crown },
    { h: "h-24", color: "#c88a4b", icon: Medal },
  ];

  return (
    <div className="section py-12">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-300/60">
          Hall of Fame
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-gold-100">
          The Global Leaderboard
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-foreground/55">
          The sharpest minds in the Guild, ranked by points earned across every
          case.
        </p>
      </div>

      {board.length === 0 ? (
        <div className="card p-16 text-center text-foreground/55">
          No detectives have earned points yet. Be the first.
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div className="mb-10 flex items-end justify-center gap-3 sm:gap-6">
              {podiumOrder.map((u) => {
                if (!u) return null;
                const idx = top3.findIndex((t) => t?.id === u.id);
                const style = podiumStyle[idx];
                const Icon = style.icon;
                return (
                  <div key={u.id} className="flex w-24 flex-col items-center sm:w-32">
                    <Avatar
                      name={u.name || u.username}
                      src={u.avatarUrl}
                      size={idx === 0 ? 72 : 56}
                      className="mb-2"
                    />
                    <p className="max-w-full truncate text-sm font-semibold text-gold-100">
                      {u.username}
                    </p>
                    <p className="text-xs text-gold-300">{u.points} pts</p>
                    <div
                      className={cn(
                        "mt-2 flex w-full items-start justify-center rounded-t-lg border border-b-0 pt-3",
                        style.h,
                      )}
                      style={{
                        borderColor: `${style.color}55`,
                        background: `linear-gradient(to top, ${style.color}05, ${style.color}20)`,
                      }}
                    >
                      <Icon
                        className="h-6 w-6"
                        style={{ color: style.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="hidden grid-cols-12 gap-4 border-b border-gold-400/10 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground/40 sm:grid">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Detective</div>
              <div className="col-span-2 text-center">Solved</div>
              <div className="col-span-3 text-right">Points</div>
            </div>
            <div className="divide-y divide-gold-400/10">
              {rest.map((u) => (
                <Row key={u.id} u={u} isMe={me?.id === u.id} />
              ))}
              {rest.length === 0 && top3.length > 0 && (
                <div className="px-6 py-6 text-center text-sm text-foreground/45">
                  The podium is all there is — for now.
                </div>
              )}
            </div>
          </div>

          {me && !board.some((u) => u.id === me.id) && (
            <p className="mt-6 text-center text-sm text-foreground/50">
              You&apos;re not in the top 100 yet.{" "}
              <Link href="/cases" className="text-gold-300 hover:text-gold-200">
                Solve a case
              </Link>{" "}
              to climb the ranks.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Row({
  u,
  isMe,
}: {
  u: {
    id: string;
    rank: number;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    points: number;
    location: string | null;
    solved: number;
  };
  isMe: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors",
        isMe ? "bg-gold-400/[0.06]" : "hover:bg-white/[0.02]",
      )}
    >
      <div className="col-span-2 flex items-center gap-1 sm:col-span-1">
        <Trophy className="h-3.5 w-3.5 text-gold-400/40 sm:hidden" />
        <span className="font-display font-bold text-gold-200">{u.rank}</span>
      </div>
      <div className="col-span-7 flex items-center gap-3 sm:col-span-6">
        <Avatar name={u.name || u.username} src={u.avatarUrl} size={36} />
        <div className="min-w-0">
          <p className="truncate font-medium text-gold-100">
            {u.username}
            {isMe && <span className="ml-2 text-xs text-gold-400">(you)</span>}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <RankPill points={u.points} />
            {u.location && (
              <span className="hidden text-xs text-foreground/40 sm:inline">
                {u.location}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-3 hidden text-center text-sm text-foreground/60 sm:block">
        {u.solved}
      </div>
      <div className="col-span-3 text-right sm:col-span-3">
        <span className="font-display text-lg font-bold text-gold-gradient">
          {u.points}
        </span>
      </div>
    </div>
  );
}
