import { prisma } from "@/lib/prisma";
import { ok, handleError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ points: "desc" }, { createdAt: "asc" }],
      take: 100,
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        points: true,
        location: true,
        submissions: {
          where: { status: "CORRECT" },
          select: { id: true },
        },
      },
    });

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      username: u.username,
      name: u.name,
      avatarUrl: u.avatarUrl,
      points: u.points,
      location: u.location,
      solved: u.submissions.length,
    }));

    return ok({ leaderboard });
  } catch (err) {
    return handleError(err);
  }
}
