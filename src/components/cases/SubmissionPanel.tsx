"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Gavel, Lock, PartyPopper, XCircle } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBadge } from "@/components/ui/Badges";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDate } from "@/lib/utils";

type Sub = {
  id: string;
  suspect: string;
  reasoning: string;
  status: string;
  score: number;
  feedback?: string | null;
  createdAt: string;
};

export function SubmissionPanel({
  slug,
  caseStatus,
  initialSubmissions,
}: {
  slug: string;
  caseStatus: string;
  initialSubmissions: Sub[];
}) {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Sub[]>(initialSubmissions);
  const [suspect, setSuspect] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ correct: boolean; awarded: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const solved = submissions.some((s) => s.status === "CORRECT");

  if (!user) {
    return (
      <div className="card p-8 text-center">
        <Lock className="mx-auto mb-3 h-8 w-8 text-gold-400/50" />
        <h3 className="font-display text-xl font-bold text-gold-100">
          Ready to name the culprit?
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/55">
          Sign in or join the Guild to submit your final verdict and earn points.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href={`/login?next=/cases/${slug}`} className="btn-outline">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Join the Guild
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/cases/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspect, reasoning }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to submit");
        return;
      }
      setSubmissions((prev) => [data.submission, ...prev]);
      setResult({ correct: data.correct, awarded: data.awarded });
      setSuspect("");
      setReasoning("");
      await refresh();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {result && (
        <Alert variant={result.correct ? "success" : "error"}>
          {result.correct ? (
            <span className="flex items-center gap-2 font-semibold">
              <PartyPopper className="h-4 w-4" />
              Case cracked! You earned {result.awarded} points.
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              That&apos;s not the culprit. Re-examine the evidence and try again.
            </span>
          )}
        </Alert>
      )}

      {solved ? (
        <div className="card border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
          <PartyPopper className="mx-auto mb-2 h-8 w-8 text-emerald-300" />
          <h3 className="font-display text-lg font-bold text-emerald-200">
            You solved this case
          </h3>
          <p className="mt-1 text-sm text-foreground/55">
            Nicely done, detective. Your verdict has been recorded.
          </p>
        </div>
      ) : caseStatus !== "OPEN" ? (
        <div className="card p-6 text-center text-foreground/55">
          This case is closed to new submissions.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card space-y-4 p-6">
          <div className="flex items-center gap-2 text-gold-100">
            <Gavel className="h-5 w-5 text-gold-400" />
            <h3 className="font-display text-lg font-bold">Submit Your Verdict</h3>
          </div>
          {error && <Alert variant="error">{error}</Alert>}
          <div>
            <label className="label" htmlFor="suspect">
              Who is the culprit?
            </label>
            <input
              id="suspect"
              className="input"
              value={suspect}
              onChange={(e) => setSuspect(e.target.value)}
              placeholder="Name your prime suspect"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="reasoning">
              Explain your reasoning
            </label>
            <textarea
              id="reasoning"
              className="input min-h-[140px] resize-y"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Walk through the evidence, the motive, and how it all points to the guilty party…"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <Spinner className="border-noir-900/40 border-t-noir-900" />
            ) : (
              "Submit Final Investigation"
            )}
          </button>
        </form>
      )}

      {submissions.length > 0 && (
        <div className="card p-6">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-200/70">
            Your Submissions ({submissions.length})
          </h4>
          <div className="space-y-4">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-gold-400/10 bg-noir-900/50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gold-100">{s.suspect}</span>
                  <StatusBadge status={s.status} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                  {s.reasoning}
                </p>
                {s.feedback && (
                  <p className="mt-2 rounded border border-gold-400/15 bg-gold-400/5 px-3 py-2 text-xs text-gold-200">
                    Reviewer: {s.feedback}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between text-xs text-foreground/40">
                  <span>{formatDate(s.createdAt)}</span>
                  {s.score > 0 && (
                    <span className="text-gold-300">+{s.score} pts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
