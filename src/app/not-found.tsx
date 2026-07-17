import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="section flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <SearchX className="mb-4 h-14 w-14 text-gold-400/50" />
      <h1 className="font-display text-4xl font-bold text-gold-100">
        Case Cold
      </h1>
      <p className="mt-3 max-w-md text-foreground/55">
        This trail has gone cold — the page you&apos;re looking for doesn&apos;t
        exist, or the file has been sealed.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">
          Back to Safety
        </Link>
        <Link href="/cases" className="btn-outline">
          Browse Cases
        </Link>
      </div>
    </div>
  );
}
