import Link from "next/link";
import { Fingerprint } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold-400/10 bg-noir-950">
      <div className="section grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-400/40 bg-noir-800">
              <Fingerprint className="h-4 w-4 text-gold-400" />
            </span>
            <span className="font-display text-lg font-bold tracking-[0.2em] text-gold-100">
              NOIR
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/50">
            The Detective&apos;s Guild. Enter a world of cinematic mystery,
            examine the evidence, and prove you have what it takes to unmask the
            guilty.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-200/70">
            Investigate
          </h4>
          <ul className="space-y-2 text-sm text-foreground/50">
            <li>
              <Link href="/cases" className="hover:text-gold-200">
                Browse Cases
              </Link>
            </li>
            <li>
              <Link href="/leaderboard" className="hover:text-gold-200">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-gold-200">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-200/70">
            Guild
          </h4>
          <ul className="space-y-2 text-sm text-foreground/50">
            <li>
              <Link href="/signup" className="hover:text-gold-200">
                Join the Guild
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-gold-200">
                Member Login
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-gold-200">
                My Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold-400/10">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-foreground/40 sm:flex-row">
          <p>© {new Date().getFullYear()} NOIR — The Detective&apos;s Guild. All rights reserved.</p>
          <p className="tracking-widest">CASE FILES · CLASSIFIED</p>
        </div>
      </div>
    </footer>
  );
}
