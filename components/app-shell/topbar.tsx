"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Search, Sun, Moon, CloudUpload, ChevronDown, User, Settings, LogOut, HelpCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInspectionCounts } from "@/hooks/use-dexie-data";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center rounded-xl border border-border overflow-hidden shrink-0">
        <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium h-[48px] text-muted-foreground">
          <Sun className="h-5 w-5" />
          Light
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium h-[48px] text-muted-foreground">
          <Moon className="h-5 w-5" />
          Dark
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center rounded-xl border border-border overflow-hidden shrink-0">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer h-[48px]",
          theme !== "dark"
            ? "text-primary border-b-primary border-b-2"
            : "bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="h-5 w-5" />
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer h-[48px]",
          theme === "dark"
            ? "text-primary border-b-primary border-b-2"
            : "bg-card text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="h-5 w-5" />
        Dark
      </button>
    </div>
  );
}

function ProfileMenu({ size = "md" }: { size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const avatarSize = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className={`${avatarSize} rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20`}>
          <span className={`${textSize} font-bold text-primary`}>SD</span>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-card shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Simona D.</p>
            <p className="text-xs text-muted-foreground">simona@waypoint.io</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              My Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              Help & Support
            </button>
          </div>
          <div className="border-t border-border py-1">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const { counts } = useInspectionCounts();
  const isCompactPage = pathname === "/inspections" || pathname === "/history" || pathname.startsWith("/inspection/") || pathname === "/offline-sync" || pathname === "/installations" || pathname.startsWith("/installations/");

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-card transition-all",
        "ml-0 md:ml-[88px] lg:ml-[180px] xl:ml-[220px]"
      )}
    >
      {/* MOBILE topbar */}
      <div className="md:hidden h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <span className="text-sm font-bold text-foreground">WAYPOINT</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" className="h-9 w-9 cursor-pointer">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications, 3 unread" className="h-9 w-9 relative cursor-pointer">
            <Bell className="h-4 w-4" />
            <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-critical-500 text-[9px] font-bold text-white flex items-center justify-center" aria-hidden="true">
              3
            </span>
          </Button>
          <div className="flex items-center gap-1 rounded-full bg-info-50 px-2 py-1 cursor-pointer">
            <CloudUpload className="h-3 w-3 text-info-700" />
            <span className="text-[10px] font-bold text-info-700">{counts.pendingSync}</span>
          </div>
        </div>
      </div>

      {/* COMPACT: inspections/history pages - single slim row */}
      {isCompactPage && (
        <div className="hidden md:flex items-center h-14 px-5 xl:px-6 gap-4 min-h-[63px]">
          <div className="flex items-center gap-5 ml-auto shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-critical-500 text-[9px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="flex items-center gap-1.5 rounded-md border border-info-500/30 bg-info-50 px-2.5 py-1.5 cursor-pointer hover:bg-info-100 transition-colors">
              <CloudUpload className="h-4 w-4 text-info-700" />
              <span className="text-[11px] font-semibold text-info-700">{counts.pendingSync} Pending Sync</span>
            </div>
            <ProfileMenu size="sm" />
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* TABLET (md to xl): Two rows - only on non-compact pages */}
      {!isCompactPage && (
        <div className="hidden md:block xl:hidden">
        {/* Row 1: Greeting + actions */}
        <div className="h-16 flex items-center justify-between px-5">
          <div className="min-w-0">
            <p className="text-xl font-bold text-foreground leading-tight truncate">
              Good morning, Simona.
            </p>
            <p className="text-[11px] text-foreground mt-0.5">
              Here&apos;s what needs your attention today — Abu Dhabi Wind Farm
            </p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <Button variant="ghost" size="icon" aria-label="Notifications, 3 unread" className="h-9 w-9 relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-critical-500 text-[9px] font-bold text-white flex items-center justify-center" aria-hidden="true">
                3
              </span>
            </Button>
            <div role="status" aria-label="Items pending sync" className="flex items-center gap-1.5 rounded-md border border-info-500/30 bg-info-50 px-2.5 py-1.5 cursor-pointer hover:bg-info-100 transition-colors h-[42px]">
              <CloudUpload className="h-5 w-5 text-info-700" />
              <span className="text-[11px] font-semibold text-info-700">{counts.pendingSync} Pending Sync</span>
            </div>
            <ProfileMenu />
          </div>
        </div>
        {/* Row 2: Search + Theme toggle */}
        <div className="flex items-center gap-3 px-5 pb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search installations, inspections, tags..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary cursor-text"
            />
          </div>
          <ThemeToggle />
        </div>
      </div>
      )}

      {/* DESKTOP (xl+): Single row - everything in one line - only on non-compact pages */}
      {!isCompactPage && (
      <div className="hidden xl:flex items-center h-[72px] px-6 gap-5">
        {/* Greeting */}
        <div className="min-w-0 shrink-0">
          <p className="text-[26px] font-bold text-foreground leading-tight">
            Good morning, Simona.
          </p>
          <p className="text-xs text-foreground">
            Here&apos;s what needs your attention today — Abu Dhabi Wind Farm
          </p>
        </div>

        {/* Search - takes remaining space */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search installations, inspections, tags..."
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary cursor-text"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-5 shrink-0">
          <Button variant="ghost" size="icon" className="h-10 w-10 relative cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-critical-500 text-[9px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </Button>
          <div className="flex items-center gap-1.5 rounded-md border border-info-500/30 bg-info-50 px-3 py-1.5 cursor-pointer hover:bg-info-100 transition-colors h-[48px]">
            <CloudUpload className="h-5 w-5 text-info-700" />
            <span className="text-xs font-semibold text-info-700">{counts.pendingSync} Pending Sync</span>
          </div>
          <ProfileMenu />
          <ThemeToggle />
        </div>
      </div>
      )}
    </header>
  );
}
