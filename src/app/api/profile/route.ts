import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { fail, ok, handleError } from "@/lib/api";

const profileSchema = z.object({
  name: z.string().max(60).optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  avatarUrl: z.string().max(1000).optional().or(z.literal("")),
});

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const d = parsed.data;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(d.name !== undefined ? { name: d.name || null } : {}),
        ...(d.bio !== undefined ? { bio: d.bio || null } : {}),
        ...(d.location !== undefined ? { location: d.location || null } : {}),
        ...(d.avatarUrl !== undefined ? { avatarUrl: d.avatarUrl || null } : {}),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        points: true,
        avatarUrl: true,
        bio: true,
        location: true,
      },
    });

    return ok({ user: updated });
  } catch (err) {
    return handleError(err);
  }
}
