import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotSchema } from "@/lib/validation";
import { fail, ok, handleError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Generic response to avoid leaking which emails are registered.
    const generic = {
      message:
        "If an account exists for that email, a password reset link has been issued.",
    } as { message: string; devToken?: string; devResetUrl?: string };

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetTokenExpiry: expiry },
      });

      // No email service is configured in this environment, so the token is
      // surfaced directly to enable the reset flow in development.
      if (process.env.NODE_ENV !== "production") {
        generic.devToken = token;
        generic.devResetUrl = `/reset-password?token=${token}`;
      }
    }

    return ok(generic);
  } catch (err) {
    return handleError(err);
  }
}
