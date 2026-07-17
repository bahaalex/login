import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, MapPin, Trophy, Award, CalendarDays } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureAchievements } from "@/lib/achievements";
import { Avatar } from "@/components/ui/Avatar";
import { RankPill } from "@/components/ui/Badges";
import { StatCard } from "@/components/ui/StatCard";
import { RankProgress } from "@/components/profile/RankProgress";
import { AchievementGrid } from "@/components/profile/AchievementGrid";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { DifficultyBadge } from "@/components/ui/Badges";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const auth = await getCurrentUser();
  if (!auth) redirect("/login?next=/profile");

  await ensureAchievements();

  const [user, achievements, unlocked, solved, ranking] = await Promise.all([
    prisma.user.findUnique({ where: { id: auth.id } }),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({
      where: { userId: auth.id },
      include: { achievement: true },
    }),
    prisma.submission.findMany({
      where: { userId: auth.id, status: "CORRECT" },
      orderBy: { createdAt: "desc" },
      include: {
        case: { select: { slug: true, title: true, difficulty: true } },
      },
    }),
    prisma.user.count({ where: { points: { gt: auth.points } } }),
  ]);

  if (!user) redirect("/login");

  const unlockedSet = new Set(unlocked.map((u) => u.achievementId));
  const achievementViews = achievements.map((a) => ({
    key: a.key,
    name: a.name,
    description: a.description,
    icon: a.icon,
    tier: a.tier,
    unlocked: unlockedSet.has(a.id),
  }));
  const globalRank = ranking + 1;

  return (
    <div className="section py-12">
      {/* Header card */}
      <div className="card relative overflow-hidden p-8">
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-noir-radial" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Avatar
            name={user.name || user.username}
            src={user.avatarUrl}
            size={96}
            className="shadow-gold"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-gold-100">
                {user.name || user.username}
              </h1>
              <RankPill points={user.points} />
            </div>
            <p className="mt-1 text-sm text-foreground/50">@{user.username}</p>
            {user.bio && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/65">
                {user.bio}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-foreground/45">
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {user.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Joined {formatDate(user.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                Rank #{globalRank}
              </span>
            </div>
          </div>
          <ProfileEditor
            initial={{
              name: user.name || "",
              bio: user.bio || "",
              location: user.location || "",
              avatarUrl: user.avatarUrl || "",
            }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Trophy} label="Points" value={user.points} />
        <StatCard icon={CheckCircle2} label="Cases Solved" value={solved.length} />
        <StatCard
          icon={Award}
          label="Badges"
          value={`${unlockedSet.size}/${achievements.length}`}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-bold text-gold-100">
            Solved Cases
          </h2>
          {solved.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-foreground/55">No solved cases yet.</p>
              <Link href="/cases" className="btn-outline mt-4">
                Take on a case
              </Link>
            </div>
          ) : (
            <div className="card divide-y divide-gold-400/10">
              {solved.map((s) => (
                <Link
                  key={s.id}
                  href={`/cases/${s.case.slug}`}
                  className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-medium text-gold-100">{s.case.title}</p>
                      <p className="mt-0.5 text-xs text-foreground/45">
                        Solved {formatDate(s.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DifficultyBadge difficulty={s.case.difficulty} />
                    <span className="text-sm font-semibold text-gold-300">
                      +{s.score}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <RankProgress points={user.points} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold text-gold-100">
          Achievements
        </h2>
        <AchievementGrid items={achievementViews} />
      </div>
    </div>
  );
}
