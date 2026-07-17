import { prisma } from "./prisma";

export type AchievementDef = {
  key: string;
  name: string;
  description: string;
  icon: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: "WELCOME",
    name: "Enlisted",
    description: "Joined the Detective's Guild.",
    icon: "Fingerprint",
    tier: "BRONZE",
  },
  {
    key: "FIRST_CASE",
    name: "On the Case",
    description: "Submitted your first investigation.",
    icon: "FileSearch",
    tier: "BRONZE",
  },
  {
    key: "FIRST_SOLVE",
    name: "First Blood",
    description: "Correctly solved your first case.",
    icon: "Sparkles",
    tier: "SILVER",
  },
  {
    key: "SHARP_EYE",
    name: "Sharp Eye",
    description: "Solved 3 cases correctly.",
    icon: "Eye",
    tier: "SILVER",
  },
  {
    key: "MASTERMIND",
    name: "Mastermind",
    description: "Solved 10 cases correctly.",
    icon: "Brain",
    tier: "GOLD",
  },
  {
    key: "EXPERT_SOLVER",
    name: "Nerves of Steel",
    description: "Cracked an Expert-difficulty case.",
    icon: "Flame",
    tier: "GOLD",
  },
  {
    key: "POINTS_500",
    name: "Rising Star",
    description: "Earned 500 points.",
    icon: "Star",
    tier: "SILVER",
  },
  {
    key: "POINTS_2000",
    name: "Legend of the Guild",
    description: "Earned 2000 points.",
    icon: "Crown",
    tier: "PLATINUM",
  },
];

/** Ensure achievement rows exist. Safe to call repeatedly. */
export async function ensureAchievements() {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        tier: a.tier,
      },
      create: a,
    });
  }
}

async function award(userId: string, key: string) {
  const achievement = await prisma.achievement.findUnique({ where: { key } });
  if (!achievement) return;
  await prisma.userAchievement.upsert({
    where: {
      userId_achievementId: { userId, achievementId: achievement.id },
    },
    update: {},
    create: { userId, achievementId: achievement.id },
  });
}

/**
 * Recompute and grant any newly-earned achievements for a user.
 * Idempotent: already-unlocked achievements are left untouched.
 */
export async function checkAchievements(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const submissions = await prisma.submission.findMany({
    where: { userId },
    include: { case: { select: { difficulty: true } } },
  });

  const solved = submissions.filter((s) => s.status === "CORRECT");
  const toAward: string[] = ["WELCOME"];

  if (submissions.length >= 1) toAward.push("FIRST_CASE");
  if (solved.length >= 1) toAward.push("FIRST_SOLVE");
  if (solved.length >= 3) toAward.push("SHARP_EYE");
  if (solved.length >= 10) toAward.push("MASTERMIND");
  if (solved.some((s) => s.case.difficulty === "EXPERT"))
    toAward.push("EXPERT_SOLVER");
  if (user.points >= 500) toAward.push("POINTS_500");
  if (user.points >= 2000) toAward.push("POINTS_2000");

  for (const key of toAward) {
    await award(userId, key);
  }
}
