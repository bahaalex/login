"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to create account");
        return;
      }
      setUser(data.user);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Join the Guild"
      subtitle="Create your detective dossier and start solving"
      footer={
        <>
          Already a member?{" "}
          <Link href="/login" className="font-medium text-gold-300 hover:text-gold-200">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <div>
          <label className="label" htmlFor="name">
            Display Name
          </label>
          <input
            id="name"
            className="input"
            value={form.name}
            onChange={update("name")}
            placeholder="Sam Spade"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="input"
            value={form.username}
            onChange={update("username")}
            placeholder="nightowl"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={form.email}
            onChange={update("email")}
            placeholder="detective@noir.io"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={form.password}
            onChange={update("password")}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <Spinner className="border-noir-900/40 border-t-noir-900" />
          ) : (
            "Create Account"
          )}
        </button>
        <p className="text-center text-xs text-foreground/40">
          The first account created becomes the guild administrator.
        </p>
      </form>
    </AuthShell>
  );
}
