import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Award,
  CheckCircle2,
  FileSearch,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureAchievements } from "@/lib/achievements";
import { StatCard } from "@/components/ui/StatCard";
import { RankProgress } from "@/components/profile/RankProgress";
import { AchievementGrid } from "@/components/profile/AchievementGrid";
import { StatusBadge } from "@/components/ui/Badges";
import { CaseCard } from "@/components/cases/CaseCard";
import { getRank } from "@/lib/ranks";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  await ensureAchievements();

  const [submissions, achievements, unlocked, openCases, ranking] =
    await Promise.all([
      prisma.submission.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          case: { select: { slug: true, title: true, difficulty: true } },
        },
      }),
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({ where: { userId: user.id } }),
      prisma.case.findMany({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          slug: true,
          title: true,
          subtitle: true,
          summary: true,
          difficulty: true,
          reward: true,
          coverImage: true,
          location: true,
          status: true,
          _count: { select: { evidence: true, submissions: true } },
        },
      }),
      prisma.user.count({ where: { points: { gt: user.points } } }),
    ]);

  const solvedCount = submissions.filter((s) => s.status === "CORRECT").length;
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
  const rank = getRank(user.points);

  return (
    <div className="section py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300/60">
            Detective&apos;s Desk
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-gold-100 sm:text-4xl">
            Welcome back, {user.name || user.username}
          </h1>
          <p className="mt-1 text-foreground/55">
            You&apos;re ranked{" "}
            <span className="font-semibold" style={{ color: rank.color }}>
              #{globalRank}
            </span>{" "}
            in the Guild. Keep chasing the truth.
          </p>
        </div>
        <Link href="/cases" className="btn-primary">
          <FileSearch className="h-4 w-4" />
          Find a Case
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Trophy} label="Points" value={user.points} />
        <StatCard
          icon={CheckCircle2}
          label="Cases Solved"
          value={solvedCount}
        />
        <StatCard
          icon={FileSearch}
          label="Submissions"
          value={submissions.length}
        />
        <StatCard
          icon={Award}
          label="Achievements"
          value={`${unlockedSet.size}/${achievements.length}`}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h2 className="mb-4 font-display text-xl font-bold text-gold-100">
              Recent Activity
            </h2>
            {submissions.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-foreground/55">
                  You haven&apos;t submitted any investigations yet.
                </p>
                <Link href="/cases" className="btn-outline mt-4">
                  Start your first case
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="card divide-y divide-gold-400/10">
                {submissions.slice(0, 6).map((s) => (
                  <Link
                    key={s.id}
                    href={`/cases/${s.case.slug}`}
                    className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gold-100">
                        {s.case.title}
                      </p>
                      <p className="mt-0.5 text-xs text-foreground/45">
                        Accused {s.suspect} · {formatDate(s.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {s.score > 0 && (
                        <span className="text-sm font-semibold text-gold-300">
                          +{s.score}
                        </span>
                      )}
                      <StatusBadge status={s.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-gold-100">
                Cases to Crack
              </h2>
              <Link
                href="/cases"
                className="text-sm text-gold-300/70 hover:text-gold-200"
              >
                Browse all
              </Link>
            </div>
            {openCases.length === 0 ? (
              <div className="card p-8 text-center text-foreground/55">
                No open cases right now.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {openCases.map((c) => (
                  <CaseCard key={c.slug} data={c} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <RankProgress points={user.points} />
          <div className="card p-6">
            <h3 className="mb-1 font-display text-lg font-bold text-gold-100">
              Your Badges
            </h3>
            <p className="text-xs text-foreground/45">
              {unlockedSet.size} of {achievements.length} unlocked
            </p>
            <Link
              href="/profile"
              className="btn-outline mt-4 w-full py-2 text-sm"
            >
              View full profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
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
