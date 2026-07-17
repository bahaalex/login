/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { MapPin, FileStack, Users, ArrowUpRight } from "lucide-react";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badges";

export type CaseCardData = {
  slug: string;
  title: string;
  subtitle?: string | null;
  summary: string;
  difficulty: string;
  reward: number;
  coverImage?: string | null;
  location?: string | null;
  status: string;
  featured?: boolean;
  _count?: { evidence: number; submissions: number };
};

export function CaseCard({ data }: { data: CaseCardData }) {
  return (
    <Link
      href={`/cases/${data.slug}`}
      className="card card-hover group relative flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-noir-800">
        {data.coverImage ? (
          <img
            src={data.coverImage}
            alt={data.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-noir-700 to-noir-900">
            <FileStack className="h-10 w-10 text-gold-400/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/40 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <DifficultyBadge difficulty={data.difficulty} />
        </div>
        <div className="absolute right-3 top-3">
          <StatusBadge status={data.status} />
        </div>
        <div className="absolute bottom-3 right-3 rounded-full border border-gold-400/40 bg-noir-950/70 px-3 py-1 text-xs font-bold text-gold-300 backdrop-blur">
          {data.reward} pts
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-gold-100 transition-colors group-hover:text-gold-200">
          {data.title}
        </h3>
        {data.subtitle && (
          <p className="mt-0.5 text-xs uppercase tracking-widest text-gold-300/50">
            {data.subtitle}
          </p>
        )}
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-foreground/55">
          {data.summary}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gold-400/10 pt-3 text-xs text-foreground/45">
          <div className="flex items-center gap-3">
            {data.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {data.location}
              </span>
            )}
            {data._count && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {data._count.submissions}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 font-medium text-gold-300/70 transition-colors group-hover:text-gold-200">
            Open case
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
