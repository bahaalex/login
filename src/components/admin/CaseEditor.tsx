"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export type AdminCase = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  briefing: string;
  difficulty: string;
  reward: number;
  coverImage: string | null;
  location: string | null;
  dateOccurred: string | null;
  status: string;
  featured: boolean;
  culprit: string;
  solutionSummary: string;
};

type EvidenceRow = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  url: string;
  fileName: string | null;
};

const EMPTY = {
  title: "",
  subtitle: "",
  summary: "",
  briefing: "",
  difficulty: "MEDIUM",
  reward: 100,
  coverImage: "",
  location: "",
  dateOccurred: "",
  status: "OPEN",
  featured: false,
  culprit: "",
  solutionSummary: "",
};

export function CaseEditor({
  editing,
  onClose,
  onSaved,
}: {
  editing: AdminCase | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...(editing
      ? {
          title: editing.title,
          subtitle: editing.subtitle || "",
          summary: editing.summary,
          briefing: editing.briefing,
          difficulty: editing.difficulty,
          reward: editing.reward,
          coverImage: editing.coverImage || "",
          location: editing.location || "",
          dateOccurred: editing.dateOccurred || "",
          status: editing.status,
          featured: editing.featured,
          culprit: editing.culprit,
          solutionSummary: editing.solutionSummary,
        }
      : {}),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceRow[]>([]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {
    if (editing) {
      fetch(`/api/cases/${editing.id}`)
        .then((r) => r.json())
        .then((d) => setEvidence(d.case?.evidence || []));
    }
  }, [editing]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = editing ? `/api/cases/${editing.id}` : "/api/cases";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, reward: Number(form.reward) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to save case");
        return;
      }
      onSaved();
      if (!editing) onClose();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-noir-950/85 p-4 backdrop-blur">
      <div className="card my-8 w-full max-w-3xl p-6 shadow-gold-lg">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-gold-100">
            {editing ? "Edit Case" : "New Case"}
          </h3>
          <button onClick={onClose} className="text-foreground/50 hover:text-gold-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={save} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <input
                className="input"
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Summary (card teaser)</label>
            <textarea
              className="input min-h-[70px] resize-y"
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Case Briefing</label>
            <textarea
              className="input min-h-[140px] resize-y"
              value={form.briefing}
              onChange={(e) => set("briefing", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Difficulty</label>
              <select
                className="input"
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            <div>
              <label className="label">Reward (points)</label>
              <input
                type="number"
                className="input"
                value={form.reward}
                onChange={(e) => set("reward", Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Location</label>
              <input
                className="input"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Date Occurred</label>
              <input
                className="input"
                value={form.dateOccurred}
                onChange={(e) => set("dateOccurred", e.target.value)}
                placeholder="e.g. Oct 31, 1948"
              />
            </div>
          </div>

          <div>
            <label className="label">Cover Image URL</label>
            <input
              className="input"
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://…"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-gold-400"
            />
            Feature this case on the landing page
          </label>

          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-300/80">
              Solution (hidden from players)
            </p>
            <div className="grid gap-4">
              <div>
                <label className="label">Culprit</label>
                <input
                  className="input"
                  value={form.culprit}
                  onChange={(e) => set("culprit", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Solution Summary</label>
                <textarea
                  className="input min-h-[80px] resize-y"
                  value={form.solutionSummary}
                  onChange={(e) => set("solutionSummary", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Close
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <Spinner className="border-noir-900/40 border-t-noir-900" />
              ) : editing ? (
                "Save Changes"
              ) : (
                "Create Case"
              )}
            </button>
          </div>
        </form>

        {editing && (
          <EvidenceManager
            caseId={editing.id}
            evidence={evidence}
            onChange={setEvidence}
          />
        )}
      </div>
    </div>
  );
}

function EvidenceManager({
  caseId,
  evidence,
  onChange,
}: {
  caseId: string;
  evidence: EvidenceRow[];
  onChange: (rows: EvidenceRow[]) => void;
}) {
  const [row, setRow] = useState({
    type: "PHOTO",
    title: "",
    description: "",
    url: "",
    fileName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function add() {
    setError("");
    if (!row.title || !row.url) {
      setError("Title and URL are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to add evidence");
        return;
      }
      onChange([...evidence, data.evidence]);
      setRow({ type: "PHOTO", title: "", description: "", url: "", fileName: "" });
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/evidence/${id}`, { method: "DELETE" });
    if (res.ok) onChange(evidence.filter((e) => e.id !== id));
  }

  return (
    <div className="mt-8 border-t border-gold-400/10 pt-6">
      <h4 className="mb-4 font-display text-lg font-bold text-gold-100">
        Evidence ({evidence.length})
      </h4>

      <div className="mb-4 space-y-2">
        {evidence.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gold-400/10 bg-noir-900/50 px-4 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gold-100">
                <span className="mr-2 text-xs text-gold-400/60">{e.type}</span>
                {e.title}
              </p>
              <p className="truncate text-xs text-foreground/40">{e.url}</p>
            </div>
            <button
              onClick={() => remove(e.id)}
              className="shrink-0 text-red-400/70 hover:text-red-300"
              aria-label="Delete evidence"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {evidence.length === 0 && (
          <p className="text-sm text-foreground/45">No evidence added yet.</p>
        )}
      </div>

      <div className="rounded-lg border border-gold-400/15 bg-noir-900/40 p-4">
        {error && (
          <Alert variant="error" className="mb-3">
            {error}
          </Alert>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="input"
            value={row.type}
            onChange={(e) => setRow({ ...row, type: e.target.value })}
          >
            <option value="PHOTO">Photo</option>
            <option value="VIDEO">Video</option>
            <option value="DOCUMENT">Document</option>
            <option value="AUDIO">Audio</option>
            <option value="FILE">File</option>
          </select>
          <input
            className="input"
            placeholder="Title"
            value={row.title}
            onChange={(e) => setRow({ ...row, title: e.target.value })}
          />
          <input
            className="input sm:col-span-2"
            placeholder="URL (image / video / file link)"
            value={row.url}
            onChange={(e) => setRow({ ...row, url: e.target.value })}
          />
          <input
            className="input"
            placeholder="File name (for downloads)"
            value={row.fileName}
            onChange={(e) => setRow({ ...row, fileName: e.target.value })}
          />
          <input
            className="input"
            placeholder="Short description"
            value={row.description}
            onChange={(e) => setRow({ ...row, description: e.target.value })}
          />
        </div>
        <button
          onClick={add}
          disabled={loading}
          className="btn-outline mt-3 w-full py-2 text-sm"
        >
          {loading ? <Spinner /> : <Plus className="h-4 w-4" />}
          Add Evidence
        </button>
      </div>
    </div>
  );
}
