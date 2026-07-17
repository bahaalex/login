import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { caseSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const difficulty = searchParams.get("difficulty");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const cases = await prisma.case.findMany({
      where: {
        ...(featured === "true" ? { featured: true } : {}),
        ...(difficulty ? { difficulty } : {}),
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { summary: { contains: q } },
                { location: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        summary: true,
        difficulty: true,
        reward: true,
        coverImage: true,
        location: true,
        dateOccurred: true,
        status: true,
        featured: true,
        createdAt: true,
        _count: { select: { evidence: true, submissions: true } },
      },
    });

    return ok({ cases });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = caseSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const data = parsed.data;

    let slug = slugify(data.title);
    const existing = await prisma.case.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const created = await prisma.case.create({
      data: {
        slug,
        title: data.title,
        subtitle: data.subtitle || null,
        summary: data.summary,
        briefing: data.briefing,
        difficulty: data.difficulty,
        reward: data.reward,
        coverImage: data.coverImage || null,
        location: data.location || null,
        dateOccurred: data.dateOccurred || null,
        status: data.status,
        featured: data.featured ?? false,
        culprit: data.culprit,
        solutionSummary: data.solutionSummary,
      },
    });

    return ok({ case: created }, 201);
  } catch (err) {
    return handleError(err);
  }
}
