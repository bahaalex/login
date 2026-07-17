import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  Fingerprint,
  Gavel,
  ScrollText,
  Trophy,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/ui/Reveal";
import { CaseCard } from "@/components/cases/CaseCard";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: FileSearch,
    title: "Study the Evidence",
    desc: "Examine photographs, documents, video footage and downloadable case files.",
  },
  {
    icon: ScrollText,
    title: "Build Your Theory",
    desc: "Connect the clues, question the timeline, and identify the true culprit.",
  },
  {
    icon: Gavel,
    title: "Submit Your Verdict",
    desc: "Name the guilty party and defend your reasoning before the Guild.",
  },
  {
    icon: Trophy,
    title: "Climb the Ranks",
    desc: "Earn points, unlock achievements, and rise up the global leaderboard.",
  },
];

export default async function HomePage() {
  const [featured, caseCount, detectiveCount, solvedCount] = await Promise.all([
    prisma.case.findMany({
      where: { status: "OPEN" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 3,
      select: {
        slug: true,
        title: true,
        subtitle: true,
        summary: true,
        difficulty: true,
        reward: true,
        coverImage: true,
        location: true,
        status: true,
        featured: true,
        _count: { select: { evidence: true, submissions: true } },
      },
    }),
    prisma.case.count({ where: { status: "OPEN" } }),
    prisma.user.count(),
    prisma.submission.count({ where: { status: "CORRECT" } }),
  ]);

  const stats = [
    { label: "Open Cases", value: caseCount, icon: FileSearch },
    { label: "Detectives", value: detectiveCount, icon: Users },
    { label: "Cases Solved", value: solvedCount, icon: Fingerprint },
  ];

  return (
    <>
      <Hero caseCount={caseCount} />

      {/* Stats */}
      <section className="border-y border-gold-400/10 bg-noir-950/50">
        <div className="section grid grid-cols-3 gap-4 py-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-gold-gradient sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-foreground/50 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured cases */}
      <section className="section py-20">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-300/60">
                Case Files
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-gold-100 sm:text-4xl">
                Featured Investigations
              </h2>
            </div>
            <Link href="/cases" className="btn-outline">
              View all cases
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {featured.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-foreground/50">
              No cases have been opened yet. Check back soon, detective.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.08}>
                <CaseCard data={c} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-gold-400/10 bg-noir-950/40 py-20">
        <div className="section">
          <Reveal>
            <div className="mb-12 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-gold-300/60">
                The Method
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-gold-100 sm:text-4xl">
                How the Investigation Works
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="card card-hover h-full p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-400/5">
                    <step.icon className="h-6 w-6 text-gold-400" />
                  </div>
                  <div className="mb-1 text-xs font-bold text-gold-400/60">
                    0{i + 1}
                  </div>
                  <h3 className="font-display text-lg font-bold text-gold-100">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-noir-800 to-noir-950 p-10 text-center shadow-gold-lg sm:p-16">
            <div className="pointer-events-none absolute inset-0 opacity-30 bg-noir-radial" />
            <div className="relative">
              <Fingerprint className="mx-auto mb-6 h-12 w-12 text-gold-400" />
              <h2 className="font-display text-3xl font-bold text-gold-100 sm:text-4xl">
                The City Needs a Detective
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-foreground/60">
                Join the Guild, take on your first case tonight, and prove your
                instincts are sharper than the rest.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="btn-primary px-7 py-3 text-base">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/leaderboard" className="btn-ghost px-7 py-3 text-base">
                  View the Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
