import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: "info" | "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  const styles = {
    info: "border-gold-400/30 bg-gold-400/5 text-gold-100",
    error: "border-red-500/40 bg-red-500/10 text-red-200",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  }[variant];

  const Icon = { info: Info, error: AlertTriangle, success: CheckCircle2 }[
    variant
  ];

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md border px-4 py-3 text-sm",
        styles,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
