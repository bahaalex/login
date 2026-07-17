import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, handleError } from "@/lib/api";

const updateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  points: z.coerce.number().int().min(0).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }

    if (params.id === admin.id && parsed.data.role === "USER") {
      return fail("You cannot revoke your own admin access", 400);
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: parsed.data,
      select: {
        id: true,
        username: true,
        role: true,
        points: true,
      },
    });
    return ok({ user: updated });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = await requireAdmin();
    if (params.id === admin.id) {
      return fail("You cannot delete your own account", 400);
    }
    await prisma.user.delete({ where: { id: params.id } });
    return ok({ success: true });
  } catch (err) {
    return handleError(err);
  }
}
