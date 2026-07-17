"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, FileSearch } from "lucide-react";
import { CaseCard, type CaseCardData } from "@/components/cases/CaseCard";
import { Spinner } from "@/components/ui/Spinner";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "EASY", label: "Easy" },
  { key: "MEDIUM", label: "Medium" },
  { key: "HARD", label: "Hard" },
  { key: "EXPERT", label: "Expert" },
];

export default function CasesPage() {
  const [cases, setCases] = useState<CaseCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    fetch("/api/cases")
      .then((r) => r.json())
      .then((d) => setCases(d.cases || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchesFilter = filter === "ALL" || c.difficulty === filter;
      const matchesQ =
        !q ||
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.summary.toLowerCase().includes(q.toLowerCase()) ||
        (c.location || "").toLowerCase().includes(q.toLowerCase());
      return matchesFilter && matchesQ;
    });
  }, [cases, filter, q]);

  return (
    <div className="section py-14">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-300/60">
          The Archive
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-gold-100">
          Case Files
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/55">
          Pick your case. Study every scrap of evidence, then name the guilty
          before anyone else does.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            className="input pl-9"
            placeholder="Search cases, locations…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f.key
                  ? "border-gold-400/60 bg-gold-400/10 text-gold-200"
                  : "border-gold-400/15 text-foreground/50 hover:border-gold-400/40 hover:text-gold-200",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-16 text-center">
          <FileSearch className="h-10 w-10 text-gold-400/30" />
          <p className="text-foreground/50">
            No cases match your search. Try a different filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <Reveal key={c.slug} delay={Math.min(i * 0.05, 0.3)}>
              <CaseCard data={c} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
