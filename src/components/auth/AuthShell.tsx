import Link from "next/link";
import { Fingerprint } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[120px]" />
      </div>
      <Reveal className="w-full max-w-md">
        <div className="card p-8 shadow-gold-lg">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-400/40 bg-noir-800">
              <Fingerprint className="h-5 w-5 text-gold-400" />
            </span>
            <span className="font-display text-xl font-bold tracking-[0.2em] text-gold-100">
              NOIR
            </span>
          </Link>
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-bold text-gold-100">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-foreground/50">{subtitle}</p>
          </div>
          {children}
          {footer && (
            <div className="mt-6 text-center text-sm text-foreground/50">
              {footer}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
