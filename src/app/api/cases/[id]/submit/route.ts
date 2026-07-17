import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { submissionSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";
import { checkAchievements } from "@/lib/achievements";

function matchesCulprit(guess: string, culprit: string) {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const g = norm(guess);
  const c = norm(culprit);
  if (!g || !c) return false;
  if (g === c) return true;
  // Accept if the guess contains the culprit's full name, or the culprit's
  // surname (last token) appears as a standalone word in the guess.
  if (g.includes(c)) return true;
  const last = c.split(" ").pop()!;
  if (last.length >= 3 && new RegExp(`\\b${last}\\b`).test(g)) return true;
  return false;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }

    const found = await prisma.case.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });
    if (!found) return fail("Case not found", 404);
    if (found.status !== "OPEN") {
      return fail("This case is closed to new submissions", 400);
    }

    const alreadySolved = await prisma.submission.findFirst({
      where: { caseId: found.id, userId: user.id, status: "CORRECT" },
    });
    if (alreadySolved) {
      return fail("You have already solved this case", 400);
    }

    const correct = matchesCulprit(parsed.data.suspect, found.culprit);
    const score = correct ? found.reward : 0;

    const submission = await prisma.submission.create({
      data: {
        caseId: found.id,
        userId: user.id,
        suspect: parsed.data.suspect,
        reasoning: parsed.data.reasoning,
        status: correct ? "CORRECT" : "INCORRECT",
        score,
      },
    });

    if (correct && score > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: score } },
      });
    }

    await checkAchievements(user.id);

    return ok(
      {
        submission,
        correct,
        awarded: correct ? score : 0,
      },
      201,
    );
  } catch (err) {
    return handleError(err);
  }
}
