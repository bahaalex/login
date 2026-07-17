import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { reviewSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";
import { checkAchievements } from "@/lib/achievements";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }

    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
    });
    if (!submission) return fail("Submission not found", 404);

    const { status, score, feedback } = parsed.data;

    // Adjust the player's points by the delta between old and new score so an
    // admin can re-grade without double-counting.
    const delta = score - submission.score;

    const updated = await prisma.$transaction(async (tx) => {
      const s = await tx.submission.update({
        where: { id: params.id },
        data: {
          status,
          score,
          feedback: feedback || null,
          reviewedAt: new Date(),
        },
      });
      if (delta !== 0) {
        await tx.user.update({
          where: { id: submission.userId },
          data: { points: { increment: delta } },
        });
      }
      return s;
    });

    await checkAchievements(submission.userId);

    return ok({ submission: updated });
  } catch (err) {
    return handleError(err);
  }
}
