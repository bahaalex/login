import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { evidenceSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = evidenceSchema.partial().safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const found = await prisma.evidence.findUnique({ where: { id: params.id } });
    if (!found) return fail("Evidence not found", 404);

    const d = parsed.data;
    const updated = await prisma.evidence.update({
      where: { id: params.id },
      data: {
        ...(d.type !== undefined ? { type: d.type } : {}),
        ...(d.title !== undefined ? { title: d.title } : {}),
        ...(d.description !== undefined
          ? { description: d.description || null }
          : {}),
        ...(d.url !== undefined ? { url: d.url } : {}),
        ...(d.fileName !== undefined ? { fileName: d.fileName || null } : {}),
        ...(d.order !== undefined ? { order: d.order } : {}),
      },
    });
    return ok({ evidence: updated });
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
    const found = await prisma.evidence.findUnique({ where: { id: params.id } });
    if (!found) return fail("Evidence not found", 404);
    await prisma.evidence.delete({ where: { id: params.id } });
    return ok({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
