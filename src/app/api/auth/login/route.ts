import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const { identifier, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return fail("Invalid credentials", 401);
    }

    setAuthCookie(user.id);

    return ok({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        points: user.points,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
