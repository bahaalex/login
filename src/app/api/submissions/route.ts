import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { ok, handleError, fail } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine") === "true";
    const status = searchParams.get("status");

    if (mine) {
      const user = await getCurrentUser();
      if (!user) return fail("Authentication required", 401);
      const submissions = await prisma.submission.findMany({
        where: { userId: user.id, ...(status ? { status } : {}) },
        orderBy: { createdAt: "desc" },
        include: {
          case: {
            select: { id: true, slug: true, title: true, difficulty: true, reward: true },
          },
        },
      });
      return ok({ submissions });
    }

    await requireAdmin();
    const submissions = await prisma.submission.findMany({
      where: { ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
      include: {
        case: { select: { id: true, slug: true, title: true, culprit: true, reward: true } },
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      },
    });
    return ok({ submissions });
  } catch (err) {
    return handleError(err);
  }
}
