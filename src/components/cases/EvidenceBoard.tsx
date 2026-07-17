"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  FileText,
  Film,
  Image as ImageIcon,
  Music,
  Download,
  X,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EvidenceItem = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  url: string;
  fileName?: string | null;
};

const TYPE_META: Record<
  string,
  { label: string; icon: typeof FileText }
> = {
  PHOTO: { label: "Photos", icon: ImageIcon },
  VIDEO: { label: "Footage", icon: Film },
  DOCUMENT: { label: "Documents", icon: FileText },
  AUDIO: { label: "Audio", icon: Music },
  FILE: { label: "Files", icon: Paperclip },
};

export function EvidenceBoard({ evidence }: { evidence: EvidenceItem[] }) {
  const [lightbox, setLightbox] = useState<EvidenceItem | null>(null);

  const types = Array.from(new Set(evidence.map((e) => e.type)));
  const [active, setActive] = useState<string>("ALL");

  const shown =
    active === "ALL" ? evidence : evidence.filter((e) => e.type === active);

  if (evidence.length === 0) {
    return (
      <div className="card p-10 text-center text-foreground/50">
        No evidence has been filed for this case yet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <TabButton active={active === "ALL"} onClick={() => setActive("ALL")}>
          All ({evidence.length})
        </TabButton>
        {types.map((t) => {
          const meta = TYPE_META[t] ?? { label: t, icon: Paperclip };
          const count = evidence.filter((e) => e.type === t).length;
          const Icon = meta.icon;
          return (
            <TabButton
              key={t}
              active={active === t}
              onClick={() => setActive(t)}
            >
              <Icon className="h-3.5 w-3.5" />
              {meta.label} ({count})
            </TabButton>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <EvidenceCard
            key={item.id}
            item={item}
            onExpand={() => setLightbox(item)}
          />
        ))}
      </div>

      {lightbox && lightbox.type === "PHOTO" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-noir-950/90 p-4 backdrop-blur"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-5 top-5 rounded-full border border-gold-400/30 p-2 text-gold-200 hover:bg-white/10"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="max-h-[85vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt={lightbox.title}
              className="max-h-[78vh] w-full rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-gold-100">
              {lightbox.title}
              {lightbox.description && (
                <span className="mt-1 block text-xs text-foreground/50">
                  {lightbox.description}
                </span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-gold-400/60 bg-gold-400/10 text-gold-200"
          : "border-gold-400/15 text-foreground/50 hover:border-gold-400/40 hover:text-gold-200",
      )}
    >
      {children}
    </button>
  );
}

function EvidenceCard({
  item,
  onExpand,
}: {
  item: EvidenceItem;
  onExpand: () => void;
}) {
  const meta = TYPE_META[item.type] ?? { label: item.type, icon: Paperclip };
  const Icon = meta.icon;

  return (
    <div className="card group overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-noir-900">
        {item.type === "PHOTO" && (
          <button onClick={onExpand} className="h-full w-full">
            <img
              src={item.url}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        )}
        {item.type === "VIDEO" && (
          <video src={item.url} controls className="h-full w-full object-cover" />
        )}
        {item.type === "AUDIO" && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
            <Music className="h-8 w-8 text-gold-400/50" />
            <audio src={item.url} controls className="w-full" />
          </div>
        )}
        {(item.type === "DOCUMENT" || item.type === "FILE") && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-noir-700 to-noir-900">
            <Icon className="h-10 w-10 text-gold-400/40" />
            <span className="text-xs uppercase tracking-widest text-foreground/40">
              {meta.label}
            </span>
          </div>
        )}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-gold-400/30 bg-noir-950/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-200 backdrop-blur">
          <Icon className="h-3 w-3" />
          {item.type}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gold-100">{item.title}</h4>
        {item.description && (
          <p className="mt-1 text-sm leading-relaxed text-foreground/55">
            {item.description}
          </p>
        )}
        {(item.type === "DOCUMENT" || item.type === "FILE") && (
          <a
            href={item.url}
            download={item.fileName || undefined}
            target="_blank"
            rel="noreferrer"
            className="btn-outline mt-3 w-full py-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Download {item.fileName ? `· ${item.fileName}` : ""}
          </a>
        )}
      </div>
    </div>
  );
}
