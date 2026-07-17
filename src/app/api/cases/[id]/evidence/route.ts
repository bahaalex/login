import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { evidenceSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = evidenceSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }

    const found = await prisma.case.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });
    if (!found) return fail("Case not found", 404);

    const count = await prisma.evidence.count({ where: { caseId: found.id } });

    const evidence = await prisma.evidence.create({
      data: {
        caseId: found.id,
        type: parsed.data.type,
        title: parsed.data.title,
        description: parsed.data.description || null,
        url: parsed.data.url,
        fileName: parsed.data.fileName || null,
        order: parsed.data.order ?? count,
      },
    });

    return ok({ evidence }, 201);
  } catch (err) {
    return handleError(err);
  }
}
