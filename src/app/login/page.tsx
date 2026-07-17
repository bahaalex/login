"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/components/providers/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to sign in");
        return;
      }
      setUser(data.user);
      const next = params.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <div>
        <label className="label" htmlFor="identifier">
          Email or Username
        </label>
        <input
          id="identifier"
          className="input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="detective@noir.io"
          autoComplete="username"
          required
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="password">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="mb-1.5 text-xs text-gold-300/70 hover:text-gold-200"
          >
            Forgot?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? <Spinner className="border-noir-900/40 border-t-noir-900" /> : "Enter the Guild"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back, Detective"
      subtitle="Sign in to resume your active investigations"
      footer={
        <>
          New to the Guild?{" "}
          <Link href="/signup" className="font-medium text-gold-300 hover:text-gold-200">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="flex justify-center py-4"><Spinner /></div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
