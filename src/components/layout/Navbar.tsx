"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Fingerprint,
  LayoutDashboard,
  Trophy,
  FolderSearch,
  Shield,
  LogOut,
  Menu,
  X,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/cases", label: "Cases", icon: FolderSearch },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  async function handleLogout() {
    await logout();
    setMenu(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gold-400/10 bg-noir-900/80 backdrop-blur-xl">
      <nav className="section flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gold-400/40 bg-noir-800">
            <Fingerprint className="h-5 w-5 text-gold-400 transition-transform duration-500 group-hover:rotate-12" />
          </span>
          <span className="font-display text-lg font-bold tracking-[0.2em] text-gold-100">
            NOIR
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-gold-200"
                  : "text-foreground/60 hover:text-gold-200",
              )}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive("/dashboard")
                  ? "text-gold-200"
                  : "text-foreground/60 hover:text-gold-200",
              )}
            >
              Dashboard
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive("/admin")
                  ? "text-gold-200"
                  : "text-foreground/60 hover:text-gold-200",
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-gold-400/20 py-1 pl-1 pr-3 transition-colors hover:border-gold-400/50"
              >
                <Avatar name={user.name || user.username} src={user.avatarUrl} size={30} />
                <span className="text-sm font-medium text-gold-100">
                  {user.username}
                </span>
              </button>
              {menu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenu(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border border-gold-400/20 bg-noir-850 shadow-gold-lg">
                    <div className="border-b border-gold-400/10 px-4 py-3">
                      <p className="text-sm font-semibold text-gold-100">
                        {user.name || user.username}
                      </p>
                      <p className="text-xs text-foreground/50">{user.email}</p>
                    </div>
                    <MenuLink href="/dashboard" icon={LayoutDashboard} onClick={() => setMenu(false)}>
                      Dashboard
                    </MenuLink>
                    <MenuLink href="/profile" icon={UserRound} onClick={() => setMenu(false)}>
                      Profile
                    </MenuLink>
                    {user.role === "ADMIN" && (
                      <MenuLink href="/admin" icon={Shield} onClick={() => setMenu(false)}>
                        Admin Panel
                      </MenuLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-white/5 hover:text-gold-200"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Join the Guild
              </Link>
            </>
          )}
        </div>

        <button
          className="text-gold-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold-400/10 bg-noir-900 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-white/5 hover:text-gold-200"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-white/5 hover:text-gold-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-white/5 hover:text-gold-200"
                >
                  <UserRound className="h-4 w-4" />
                  Profile
                </Link>
              </>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-white/5 hover:text-gold-200"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-gold-400/10 pt-4">
            {user ? (
              <button onClick={handleLogout} className="btn-outline w-full">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn-outline w-full">
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Join the Guild
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-white/5 hover:text-gold-200"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
