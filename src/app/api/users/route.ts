import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        points: true,
        avatarUrl: true,
        location: true,
        createdAt: true,
        _count: { select: { submissions: true } },
      },
    });
    return ok({ users });
  } catch (err) {
    return handleError(err);
  }
}
