import { NextResponse } from "next/server";
import { AuthError } from "./auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return fail(err.message, err.status);
  }
  if (err instanceof Error) {
    return fail(err.message, 500);
  }
  return fail("Unexpected error", 500);
}
