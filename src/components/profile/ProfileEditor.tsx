"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/components/providers/AuthProvider";

export function ProfileEditor({
  initial,
}: {
  initial: {
    name: string;
    bio: string;
    location: string;
    avatarUrl: string;
  };
}) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to save");
        return;
      }
      setUser(data.user);
      setOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline">
        <Pencil className="h-4 w-4" />
        Edit Profile
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-noir-950/80 p-4 backdrop-blur">
          <div className="card w-full max-w-lg p-6 shadow-gold-lg">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-gold-100">
                Edit Profile
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-foreground/50 hover:text-gold-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}
              <div>
                <label className="label" htmlFor="name">
                  Display Name
                </label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="label" htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  className="input"
                  value={form.location}
                  onChange={update("location")}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="label" htmlFor="avatarUrl">
                  Avatar URL
                </label>
                <input
                  id="avatarUrl"
                  className="input"
                  value={form.avatarUrl}
                  onChange={update("avatarUrl")}
                  placeholder="https://…"
                />
              </div>
              <div>
                <label className="label" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  className="input min-h-[100px] resize-y"
                  value={form.bio}
                  onChange={update("bio")}
                  placeholder="A few words about your detective persona…"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <Spinner className="border-noir-900/40 border-t-noir-900" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
