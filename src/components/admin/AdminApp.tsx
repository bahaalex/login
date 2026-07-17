"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FileStack,
  Users,
  Inbox,
  Plus,
  Pencil,
  Trash2,
  Shield,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";
import { CaseEditor, type AdminCase } from "@/components/admin/CaseEditor";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge, DifficultyBadge } from "@/components/ui/Badges";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { cn, formatDate } from "@/lib/utils";

type Tab = "overview" | "cases" | "submissions" | "users";

type AdminSubmission = {
  id: string;
  suspect: string;
  reasoning: string;
  status: string;
  score: number;
  feedback: string | null;
  createdAt: string;
  case: { id: string; slug: string; title: string; culprit: string; reward: number };
  user: { id: string; username: string; name: string | null; avatarUrl: string | null };
};

type AdminUser = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: string;
  points: number;
  avatarUrl: string | null;
  location: string | null;
  createdAt: string;
  _count: { submissions: number };
};

const TABS: { key: Tab; label: string; icon: typeof FileStack }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "cases", label: "Cases", icon: FileStack },
  { key: "submissions", label: "Submissions", icon: Inbox },
  { key: "users", label: "Users", icon: Users },
];

export function AdminApp() {
  const [tab, setTab] = useState<Tab>("overview");
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<{ open: boolean; editing: AdminCase | null }>(
    { open: false, editing: null },
  );

  const load = useCallback(async () => {
    setLoading(true);
    const [c, s, u] = await Promise.all([
      fetch("/api/cases").then((r) => r.json()),
      fetch("/api/submissions").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
    ]);
    setCases(c.cases || []);
    setSubmissions(s.submissions || []);
    setUsers(u.users || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pending = submissions.filter((s) => s.status === "PENDING").length;

  async function deleteCase(id: string) {
    if (!confirm("Delete this case and all its evidence and submissions?")) return;
    const res = await fetch(`/api/cases/${id}`, { method: "DELETE" });
    if (res.ok) setCases((prev) => prev.filter((c) => c.id !== id));
  }

  // Cases list needs full case objects (with solution) — fetch each on edit.
  async function openEdit(id: string) {
    const res = await fetch(`/api/cases/${id}`);
    const data = await res.json();
    if (data.case) {
      const full: AdminCase = {
        ...data.case,
        culprit: data.solution?.culprit ?? data.case.culprit ?? "",
        solutionSummary:
          data.solution?.solutionSummary ?? data.case.solutionSummary ?? "",
      };
      setEditor({ open: true, editing: full });
    }
  }

  return (
    <div className="section py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-300/60">
            <Shield className="h-4 w-4" />
            Guild Administration
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-gold-100 sm:text-4xl">
            Admin Dashboard
          </h1>
        </div>
        <button
          onClick={() => setEditor({ open: true, editing: null })}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          New Case
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-gold-400/10 pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-gold-400/10 text-gold-200"
                : "text-foreground/55 hover:text-gold-200",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.key === "submissions" && pending > 0 && (
              <span className="rounded-full bg-gold-400 px-1.5 text-[10px] font-bold text-noir-950">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <>
          {tab === "overview" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={FileStack} label="Total Cases" value={cases.length} />
              <StatCard icon={Users} label="Detectives" value={users.length} />
              <StatCard
                icon={Inbox}
                label="Submissions"
                value={submissions.length}
              />
              <StatCard
                icon={Inbox}
                label="Pending Review"
                value={pending}
              />
            </div>
          )}

          {tab === "cases" && (
            <CasesTable
              cases={cases}
              onEdit={openEdit}
              onDelete={deleteCase}
            />
          )}

          {tab === "submissions" && (
            <SubmissionsTable
              submissions={submissions}
              onReviewed={load}
            />
          )}

          {tab === "users" && (
            <UsersTable users={users} onChanged={load} />
          )}
        </>
      )}

      {editor.open && (
        <CaseEditor
          editing={editor.editing}
          onClose={() => setEditor({ open: false, editing: null })}
          onSaved={load}
        />
      )}
    </div>
  );
}

function CasesTable({
  cases,
  onEdit,
  onDelete,
}: {
  cases: AdminCase[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (cases.length === 0) {
    return (
      <div className="card p-12 text-center text-foreground/55">
        No cases yet. Create your first case to get started.
      </div>
    );
  }
  return (
    <div className="card divide-y divide-gold-400/10">
      {cases.map((c) => (
        <div
          key={c.id}
          className="flex flex-wrap items-center justify-between gap-3 p-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-gold-100">{c.title}</p>
              <DifficultyBadge difficulty={c.difficulty} />
              <StatusBadge status={c.status} />
              {c.featured && <span className="chip">Featured</span>}
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-foreground/45">
              {c.summary}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/cases/${c.slug}`}
              target="_blank"
              className="btn-ghost px-3 py-2"
              title="View"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={() => onEdit(c.id)}
              className="btn-outline px-3 py-2"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(c.id)}
              className="btn px-3 py-2 text-red-400 hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubmissionsTable({
  submissions,
  onReviewed,
}: {
  submissions: AdminSubmission[];
  onReviewed: () => void;
}) {
  if (submissions.length === 0) {
    return (
      <div className="card p-12 text-center text-foreground/55">
        No submissions yet.
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {submissions.map((s) => (
        <SubmissionRow key={s.id} s={s} onReviewed={onReviewed} />
      ))}
    </div>
  );
}

function SubmissionRow({
  s,
  onReviewed,
}: {
  s: AdminSubmission;
  onReviewed: () => void;
}) {
  const [status, setStatus] = useState(s.status);
  const [score, setScore] = useState(s.score);
  const [feedback, setFeedback] = useState(s.feedback || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/submissions/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, score: Number(score), feedback }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to save review");
        return;
      }
      onReviewed();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={s.user.name || s.user.username} src={s.user.avatarUrl} size={38} />
          <div>
            <p className="font-medium text-gold-100">{s.user.username}</p>
            <Link
              href={`/cases/${s.case.slug}`}
              target="_blank"
              className="text-xs text-gold-300/70 hover:text-gold-200"
            >
              {s.case.title}
            </Link>
          </div>
        </div>
        <StatusBadge status={s.status} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-gold-400/10 bg-noir-900/50 p-3">
          <p className="text-xs uppercase tracking-widest text-foreground/40">
            Accused
          </p>
          <p className="mt-1 font-medium text-gold-100">{s.suspect}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs uppercase tracking-widest text-emerald-300/70">
            Actual Culprit
          </p>
          <p className="mt-1 font-medium text-emerald-200">{s.case.culprit}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-gold-400/10 bg-noir-900/40 p-3">
        <p className="text-xs uppercase tracking-widest text-foreground/40">
          Reasoning
        </p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/65">
          {s.reasoning}
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mt-3">
          {error}
        </Alert>
      )}

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="label">Status</label>
          <select
            className="input w-40"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="CORRECT">Correct</option>
            <option value="INCORRECT">Incorrect</option>
            <option value="REVIEWED">Reviewed</option>
          </select>
        </div>
        <div>
          <label className="label">Score</label>
          <input
            type="number"
            className="input w-28"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            min={0}
          />
        </div>
        <div className="flex-1">
          <label className="label">Feedback</label>
          <input
            className="input"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional note to the detective"
          />
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? (
            <Spinner className="border-noir-900/40 border-t-noir-900" />
          ) : (
            "Save Review"
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-foreground/35">
        Submitted {formatDate(s.createdAt)}
      </p>
    </div>
  );
}

function UsersTable({
  users,
  onChanged,
}: {
  users: AdminUser[];
  onChanged: () => void;
}) {
  async function updateUser(id: string, body: Record<string, unknown>) {
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    onChanged();
  }

  async function removeUser(id: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) onChanged();
  }

  if (users.length === 0) {
    return (
      <div className="card p-12 text-center text-foreground/55">No users yet.</div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-gold-400/10 text-left text-xs uppercase tracking-widest text-foreground/40">
            <th className="px-5 py-3">Detective</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Points</th>
            <th className="px-5 py-3">Submissions</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold-400/10">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name || u.username} src={u.avatarUrl} size={34} />
                  <div>
                    <p className="font-medium text-gold-100">{u.username}</p>
                    <p className="text-xs text-foreground/40">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3">
                <select
                  className="input w-28 py-1.5"
                  value={u.role}
                  onChange={(e) => updateUser(u.id, { role: e.target.value })}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td className="px-5 py-3">
                <input
                  type="number"
                  defaultValue={u.points}
                  className="input w-24 py-1.5"
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (v !== u.points) updateUser(u.id, { points: v });
                  }}
                />
              </td>
              <td className="px-5 py-3 text-foreground/60">
                {u._count.submissions}
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => removeUser(u.id)}
                  className="text-red-400/70 hover:text-red-300"
                  title="Delete user"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
