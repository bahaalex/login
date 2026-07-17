import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";
import { checkAchievements } from "@/lib/achievements";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const { email, username, name, password } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username }],
      },
    });
    if (existing) {
      return fail(
        existing.email === email.toLowerCase()
          ? "An account with that email already exists"
          : "That username is taken",
        409,
      );
    }

    const count = await prisma.user.count();
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        name: name || null,
        passwordHash,
        // First ever account becomes the admin so the app is usable out of the box.
        role: count === 0 ? "ADMIN" : "USER",
      },
    });

    await checkAchievements(user.id);
    setAuthCookie(user.id);

    return ok(
      {
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
      },
      201,
    );
  } catch (err) {
    return handleError(err);
  }
}
