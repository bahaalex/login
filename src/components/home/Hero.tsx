"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";

export function Hero({ caseCount }: { caseCount: number }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[140px]" />
        <div className="absolute inset-0 noir-vignette" />
      </div>

      <div className="section flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="chip mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {caseCount} active cases awaiting a sharp mind
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="max-w-4xl font-display text-4xl font-bold leading-[1.1] text-balance sm:text-6xl lg:text-7xl"
        >
          <span className="text-gold-100">Every Shadow Hides</span>{" "}
          <span className="text-gold-gradient">a Culprit</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-foreground/60"
        >
          Step into a world of cinematic mystery. Comb through evidence, study
          the photographs, watch the footage, and name the guilty. Climb from
          Rookie to Master Sleuth in the Detective&apos;s Guild.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/cases" className="btn-primary px-7 py-3 text-base">
            <Search className="h-4 w-4" />
            Investigate a Case
          </Link>
          <Link href="/signup" className="btn-outline px-7 py-3 text-base">
            Join the Guild
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
