import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { caseSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";

async function findCase(idOrSlug: string) {
  return prisma.case.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      evidence: { orderBy: { order: "asc" } },
      _count: { select: { submissions: true } },
    },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();
    const found = await findCase(params.id);
    if (!found) return fail("Case not found", 404);

    const isAdmin = user?.role === "ADMIN";

    let mySubmissions: unknown[] = [];
    if (user) {
      mySubmissions = await prisma.submission.findMany({
        where: { caseId: found.id, userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    const { culprit, solutionSummary, ...publicCase } = found;

    return ok({
      case: isAdmin ? found : publicCase,
      solution: isAdmin ? { culprit, solutionSummary } : null,
      mySubmissions,
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = caseSchema.partial().safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const found = await findCase(params.id);
    if (!found) return fail("Case not found", 404);

    const d = parsed.data;
    const updated = await prisma.case.update({
      where: { id: found.id },
      data: {
        ...(d.title !== undefined ? { title: d.title } : {}),
        ...(d.subtitle !== undefined ? { subtitle: d.subtitle || null } : {}),
        ...(d.summary !== undefined ? { summary: d.summary } : {}),
        ...(d.briefing !== undefined ? { briefing: d.briefing } : {}),
        ...(d.difficulty !== undefined ? { difficulty: d.difficulty } : {}),
        ...(d.reward !== undefined ? { reward: d.reward } : {}),
        ...(d.coverImage !== undefined
          ? { coverImage: d.coverImage || null }
          : {}),
        ...(d.location !== undefined ? { location: d.location || null } : {}),
        ...(d.dateOccurred !== undefined
          ? { dateOccurred: d.dateOccurred || null }
          : {}),
        ...(d.status !== undefined ? { status: d.status } : {}),
        ...(d.featured !== undefined ? { featured: d.featured } : {}),
        ...(d.culprit !== undefined ? { culprit: d.culprit } : {}),
        ...(d.solutionSummary !== undefined
          ? { solutionSummary: d.solutionSummary }
          : {}),
      },
    });

    return ok({ case: updated });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    const found = await findCase(params.id);
    if (!found) return fail("Case not found", 404);
    await prisma.case.delete({ where: { id: found.id } });
    return ok({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
