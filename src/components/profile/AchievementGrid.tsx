import {
  Award,
  Brain,
  Crown,
  Eye,
  FileSearch,
  Fingerprint,
  Flame,
  Lock,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Award,
  Brain,
  Crown,
  Eye,
  FileSearch,
  Fingerprint,
  Flame,
  Sparkles,
  Star,
};

const TIER_COLOR: Record<string, string> = {
  BRONZE: "#c88a4b",
  SILVER: "#b8c0cc",
  GOLD: "#d4af37",
  PLATINUM: "#7fe7e0",
};

export type AchievementView = {
  key: string;
  name: string;
  description: string;
  icon: string;
  tier: string;
  unlocked: boolean;
};

export function AchievementGrid({ items }: { items: AchievementView[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((a) => {
        const Icon = a.unlocked ? ICONS[a.icon] ?? Award : Lock;
        const color = TIER_COLOR[a.tier] ?? "#d4af37";
        return (
          <div
            key={a.key}
            className={cn(
              "card p-5 text-center transition-all",
              a.unlocked
                ? "border-gold-400/30"
                : "opacity-55 grayscale hover:opacity-80",
            )}
          >
            <div
              className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border"
              style={{
                borderColor: a.unlocked ? `${color}55` : "#ffffff15",
                backgroundColor: a.unlocked ? `${color}15` : "transparent",
              }}
            >
              <Icon
                className="h-7 w-7"
                style={{ color: a.unlocked ? color : "#888" }}
              />
            </div>
            <h4 className="font-display text-sm font-bold text-gold-100">
              {a.name}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-foreground/50">
              {a.description}
            </p>
            <span
              className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                color: a.unlocked ? color : "#777",
                backgroundColor: a.unlocked ? `${color}12` : "#ffffff08",
              }}
            >
              {a.tier}
            </span>
          </div>
        );
      })}
    </div>
  );
}
