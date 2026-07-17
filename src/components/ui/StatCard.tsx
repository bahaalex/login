import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-foreground/45">
          {label}
        </p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-400/25 bg-gold-400/5">
          <Icon className="h-4 w-4 text-gold-400" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-gold-gradient">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-foreground/40">{hint}</p>}
    </div>
  );
}
