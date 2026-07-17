"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devUrl, setDevUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevUrl("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to process request");
        return;
      }
      setMessage(data.message);
      if (data.devResetUrl) setDevUrl(data.devResetUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset Your Password"
      subtitle="We'll send instructions to recover your account"
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-gold-300 hover:text-gold-200">
            Back to login
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {message && (
          <Alert variant="success">
            {message}
            {devUrl && (
              <span className="mt-2 block">
                Dev shortcut:{" "}
                <Link href={devUrl} className="underline hover:text-emerald-100">
                  Reset your password now
                </Link>
              </span>
            )}
          </Alert>
        )}
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="detective@noir.io"
            autoComplete="email"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <Spinner className="border-noir-900/40 border-t-noir-900" />
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
