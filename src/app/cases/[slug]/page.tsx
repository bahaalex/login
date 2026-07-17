/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Users,
  FileStack,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DifficultyBadge, StatusBadge } from "@/components/ui/Badges";
import { EvidenceBoard } from "@/components/cases/EvidenceBoard";
import { SubmissionPanel } from "@/components/cases/SubmissionPanel";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getCurrentUser();

  const found = await prisma.case.findFirst({
    where: { OR: [{ slug: params.slug }, { id: params.slug }] },
    include: {
      evidence: { orderBy: { order: "asc" } },
      _count: { select: { submissions: true } },
    },
  });

  if (!found) notFound();

  const mySubmissions = user
    ? await prisma.submission.findMany({
        where: { caseId: found.id, userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const serialized = mySubmissions.map((s) => ({
    id: s.id,
    suspect: s.suspect,
    reasoning: s.reasoning,
    status: s.status,
    score: s.score,
    feedback: s.feedback,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div>
      {/* Header */}
      <div className="relative overflow-hidden border-b border-gold-400/10">
        <div className="absolute inset-0 -z-10">
          {found.coverImage ? (
            <>
              <img
                src={found.coverImage}
                alt=""
                className="h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/80 to-noir-900/40" />
            </>
          ) : (
            <div className="h-full w-full bg-noir-radial" />
          )}
        </div>

        <div className="section py-14">
          <Link
            href="/cases"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-gold-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to case files
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={found.difficulty} />
            <StatusBadge status={found.status} />
            <span className="chip">
              <Trophy className="h-3.5 w-3.5" />
              {found.reward} points
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-gold-100 sm:text-5xl">
            {found.title}
          </h1>
          {found.subtitle && (
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-gold-300/60">
              {found.subtitle}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-foreground/55">
            {found.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-400/60" />
                {found.location}
              </span>
            )}
            {found.dateOccurred && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold-400/60" />
                {found.dateOccurred}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FileStack className="h-4 w-4 text-gold-400/60" />
              {found.evidence.length} pieces of evidence
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gold-400/60" />
              {found._count.submissions} submissions
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="section grid gap-10 py-12 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="mb-4 font-display text-2xl font-bold text-gold-100">
              Case Briefing
            </h2>
            <div className="card p-6">
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/70">
                {found.briefing}
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl font-bold text-gold-100">
              The Evidence
            </h2>
            <EvidenceBoard evidence={found.evidence} />
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <SubmissionPanel
              slug={found.slug}
              caseStatus={found.status}
              initialSubmissions={serialized}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
